import { z } from 'zod';

// User validation schemas
export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address').toLowerCase(),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address').toLowerCase(),
    password: z.string().min(1, 'Password is required'),
});

// Asset validation schemas
export const assetSchema = z.object({
    lotNumber: z.string()
        .min(1, 'Lot number is required')
        .max(50, 'Lot number too long')
        .regex(/^[A-Za-z0-9-_]+$/, 'Lot number can only contain letters, numbers, hyphens, and underscores'),
    description: z.string()
        .min(1, 'Description is required')
        .max(500, 'Description too long'),
    quantity: z.number()
        .int('Quantity must be a whole number')
        .positive('Quantity must be positive')
        .max(10000, 'Quantity too large'),
    location: z.string()
        .min(1, 'Location is required')
        .max(200, 'Location too long'),
});

// Allocation validation schemas
export const allocationSchema = z.object({
    orderId: z.string().uuid('Invalid order ID'),
    lotId: z.string().uuid('Invalid lot ID'),
    quantity: z.number()
        .int('Quantity must be a whole number')
        .positive('Quantity must be positive'),
});

export const allocationStepSchema = z.object({
    allocationId: z.string().uuid('Invalid allocation ID'),
    step: z.enum(['Allocated', 'Picked', 'On_Hold', 'Dispatched']),
});

export const uuidSchema = z.string().uuid('Invalid ID format');

// Sanitization helpers
export function sanitizeText(text: string): string {
    // Remove any potential XSS vectors while preserving normal text
    return text
        .replace(/[<>]/g, '') // Remove angle brackets
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, '') // Remove event handlers
        .trim();
}

export function sanitizeHtml(html: string): string {
    // For now, just strip all HTML tags
    // In production, consider using a library like DOMPurify
    return html.replace(/<[^>]*>/g, '').trim();
}

// Validation error formatter
export function formatValidationError(error: z.ZodError): Record<string, string> {
    const formatted: Record<string, string> = {};
    const issues = error.issues || [];
    issues.forEach((err) => {
        const path = err.path.join('.');
        formatted[path] = err.message;
    });
    return formatted;
}

// Safe error response (doesn't leak sensitive info)
export function createSafeError(message: string, statusCode: number = 400) {
    return {
        error: true,
        message,
        statusCode,
    };
}
