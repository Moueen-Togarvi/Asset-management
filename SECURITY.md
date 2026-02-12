# Security Policy

## Overview

This document outlines the security measures implemented in the Hospital Asset Management application.

## Implemented Security Measures

### 1. Authentication & Authorization
- **Auth.js Integration**: Secure session-based authentication using JWT tokens
- **Password Security**: Passwords hashed with bcrypt (12 rounds)
- **Session Management**: 30-day session expiry with secure token storage
- **Role-Based Access Control**: User roles (admin, manager, user) for future permission management
- **Multi-Tenant Data Isolation**: All data queries filtered by user ID to ensure users can only access their own data

### 2. Input Validation & Sanitization
- **Zod Schema Validation**: All user inputs validated against strict schemas
- **XSS Prevention**: Text inputs sanitized to remove HTML tags and JavaScript
- **SQL Injection Protection**: Drizzle ORM with parameterized queries
- **UUID Validation**: All IDs validated as proper UUIDs before database operations

### 3. Security Headers
- **Content Security Policy (CSP)**: Restricts resource loading to prevent XSS
- **X-Frame-Options**: Set to DENY to prevent clickjacking
- **X-Content-Type-Options**: Set to nosniff to prevent MIME sniffing
- **Referrer-Policy**: Strict origin policy for privacy
- **HSTS**: Enforced HTTPS in production (max-age: 1 year)
- **Permissions-Policy**: Disabled unnecessary browser features

### 4. Rate Limiting
- **Endpoint Protection**: 10 requests per minute for sensitive endpoints (login, register, POST actions)
- **IP-Based Tracking**: Rate limits tracked per IP address
- **Automatic Cleanup**: Old rate limit entries automatically removed

### 5. CSRF Protection
- **Origin Validation**: All state-changing requests validate origin header matches host
- **SameSite Cookies**: Cookies configured with SameSite attribute
- **Form Action Validation**: Only same-origin form submissions accepted

### 6. Security Logging
- **Request Logging**: All authentication attempts and errors logged
- **Audit Trail**: Timestamps, IP addresses, and user agents recorded
- **Error Monitoring**: Failed requests logged for security analysis

## Password Requirements

Users must create passwords that meet the following criteria:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

## Environment Variables

### Required Variables
- `DATABASE_URL`: PostgreSQL connection string (keep secure, never commit)
- `AUTH_SECRET`: Secret key for JWT signing (minimum 32 characters, use cryptographically random value)

### Generating Secure Secrets

```bash
# Generate a secure AUTH_SECRET
openssl rand -base64 32
```

## Best Practices

### For Developers
1. **Never commit `.env` files** - Use `.env.example` for documentation only
2. **Rotate secrets regularly** - Change AUTH_SECRET periodically
3. **Use HTTPS in production** - Never deploy without SSL/TLS
4. **Keep dependencies updated** - Run `npm audit` regularly
5. **Review security logs** - Monitor for suspicious activity

### For Administrators
1. **Use strong database passwords** - Minimum 16 characters with mixed case, numbers, symbols
2. **Restrict database access** - Only allow connections from application servers
3. **Enable database SSL** - Use `sslmode=require` in DATABASE_URL
4. **Regular backups** - Implement automated backup strategy
5. **Monitor rate limits** - Consider implementing Redis for production rate limiting

## Vulnerability Reporting

If you discover a security vulnerability, please report it to:
- **Email**: security@yourdomain.com (replace with actual contact)
- **Response Time**: We aim to respond within 48 hours

**Please do not** publicly disclose vulnerabilities until they have been addressed.

## Security Checklist for Deployment

- [ ] Rotate `AUTH_SECRET` from development value
- [ ] Use strong database password
- [ ] Enable database SSL (`sslmode=require`)
- [ ] Configure firewall to restrict database access
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Set up monitoring and alerting
- [ ] Implement Redis for production rate limiting
- [ ] Configure automated backups
- [ ] Review and test all security headers
- [ ] Set up security logging aggregation
- [ ] Enable database query logging for auditing
- [ ] Implement IP whitelisting if applicable
- [ ] Configure CORS properly for production domain
- [ ] Set up DDoS protection (e.g., Cloudflare)
- [ ] Regular security audits and penetration testing

## Known Limitations

1. **In-Memory Rate Limiting**: Current implementation uses in-memory storage. For production with multiple servers, use Redis.
2. **No Email Verification**: Email verification not yet implemented. Users can register without confirming email.
3. **No Password Reset**: Password reset functionality not yet implemented.
4. **No 2FA**: Two-factor authentication not yet available.

## Future Security Enhancements

- [ ] Implement email verification
- [ ] Add password reset functionality
- [ ] Implement two-factor authentication (2FA)
- [ ] Add OAuth providers (Google, GitHub)
- [ ] Implement Redis-based rate limiting
- [ ] Add IP geolocation and suspicious login detection
- [ ] Implement account lockout after failed login attempts
- [ ] Add security question recovery
- [ ] Implement audit log viewer for admins
- [ ] Add CAPTCHA for registration and login

## Compliance

This application implements security measures aligned with:
- OWASP Top 10 security risks
- NIST Cybersecurity Framework basics
- General data protection principles

## Last Updated

February 12, 2026
