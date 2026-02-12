import { sequence } from '@sveltejs/kit/hooks';
import { handle as authHandle } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

// Rate limiting store (in-memory, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security headers middleware
const securityHeaders: Handle = async ({ event, resolve }) => {
    const response = await resolve(event);

    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    // Content Security Policy
    response.headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'", // unsafe-inline needed for SvelteKit
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ].join('; ')
    );

    // HSTS (only in production with HTTPS)
    if (event.url.protocol === 'https:') {
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    return response;
};

// Rate limiting middleware
const rateLimit: Handle = async ({ event, resolve }) => {
    const ip = event.getClientAddress();
    const now = Date.now();

    // Clean up old entries
    for (const [key, value] of rateLimitStore.entries()) {
        if (value.resetTime < now) {
            rateLimitStore.delete(key);
        }
    }

    // Check rate limit for sensitive endpoints
    const isSensitiveEndpoint =
        event.url.pathname.startsWith('/login') ||
        event.url.pathname.startsWith('/register') ||
        event.request.method === 'POST';

    if (isSensitiveEndpoint) {
        const key = `${ip}:${event.url.pathname}`;
        const limit = rateLimitStore.get(key);

        if (limit) {
            if (limit.count >= 10) { // 10 requests per minute
                return new Response(
                    JSON.stringify({ error: 'Too many requests. Please try again later.' }),
                    {
                        status: 429,
                        headers: {
                            'Content-Type': 'application/json',
                            'Retry-After': '60'
                        }
                    }
                );
            }
            limit.count++;
        } else {
            rateLimitStore.set(key, {
                count: 1,
                resetTime: now + 60000 // 1 minute
            });
        }
    }

    return resolve(event);
};

// CSRF protection middleware
const csrfProtection: Handle = async ({ event, resolve }) => {
    // Only check CSRF for state-changing methods
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(event.request.method)) {
        const origin = event.request.headers.get('origin');
        const host = event.request.headers.get('host');

        // Allow same-origin requests
        if (origin && host) {
            const originHost = new URL(origin).host;
            if (originHost !== host) {
                return new Response(
                    JSON.stringify({ error: 'CSRF validation failed' }),
                    {
                        status: 403,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }
        }
    }

    return resolve(event);
};

// Request logging middleware
const requestLogger: Handle = async ({ event, resolve }) => {
    const start = Date.now();
    const response = await resolve(event);
    const duration = Date.now() - start;

    // Log security-relevant requests
    if (event.url.pathname.startsWith('/login') ||
        event.url.pathname.startsWith('/register') ||
        response.status >= 400) {
        console.log({
            timestamp: new Date().toISOString(),
            method: event.request.method,
            path: event.url.pathname,
            status: response.status,
            duration: `${duration}ms`,
            ip: event.getClientAddress(),
            userAgent: event.request.headers.get('user-agent')
        });
    }

    return response;
};

// Combine all handlers
export const handle = sequence(
    securityHeaders,
    rateLimit,
    csrfProtection,
    authHandle,
    requestLogger
);
