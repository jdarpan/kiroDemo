# Security Configuration

This document describes the security configuration for the Dormant Accounts Management System.

## CORS Configuration

Cross-Origin Resource Sharing (CORS) is configured to allow the frontend application to communicate with the backend API.

### Configuration Properties

The following properties can be set in `application.yml` or via environment variables:

- `cors.allowed-origins`: Comma-separated list of allowed origins (default: `http://localhost:3000`)
- `cors.allowed-methods`: Comma-separated list of allowed HTTP methods (default: `GET,POST,PUT,DELETE,OPTIONS`)
- `cors.allowed-headers`: Allowed headers, use `*` for all headers (default: `*`)
- `cors.allow-credentials`: Whether to allow credentials like cookies and authorization headers (default: `true`)

### Environment Variables

For production deployment, set the following environment variables:

```bash
export CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Example Configuration

```yaml
cors:
  allowed-origins: http://localhost:3000,https://production-frontend.com
  allowed-methods: GET,POST,PUT,DELETE,OPTIONS
  allowed-headers: "*"
  allow-credentials: true
```

## JWT Configuration

JSON Web Tokens (JWT) are used for authentication and authorization.

### Configuration Properties

- `jwt.secret`: Secret key for signing JWT tokens (should be at least 256 bits)
- `jwt.expiration`: Token expiration time in milliseconds (default: 3600000 = 1 hour)
- `jwt.issuer`: Token issuer identifier (default: `dormant-accounts-service`)

### Environment Variables

For production deployment, **always** set a strong JWT secret:

```bash
export JWT_SECRET=your-strong-secret-key-at-least-256-bits-long
export JWT_EXPIRATION=3600000
```

### Security Best Practices

1. **JWT Secret**: Use a cryptographically strong random string of at least 256 bits (32 characters)
2. **Token Expiration**: Keep token expiration short (1 hour recommended) to minimize security risks
3. **Never commit secrets**: Always use environment variables for sensitive configuration

### Example Configuration

```yaml
jwt:
  secret: ${JWT_SECRET:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}
  expiration: ${JWT_EXPIRATION:3600000}
  issuer: dormant-accounts-service
```

## Security Headers

The application configures the following security headers:

### Content Security Policy (CSP)
- Policy: `default-src 'self'`
- Restricts resources to same origin only

### HTTP Strict Transport Security (HSTS)
- Max Age: 31536000 seconds (1 year)
- Include Subdomains: Yes
- Forces HTTPS connections in production

### X-Content-Type-Options
- Disabled for compatibility
- Prevents MIME type sniffing

### X-Frame-Options
- Disabled for H2 console access (development only)
- Should be enabled in production to prevent clickjacking

## Session Management

- **Session Creation Policy**: STATELESS
- No server-side sessions are created
- All authentication state is maintained via JWT tokens

## Role-Based Access Control

The application implements role-based access control with two roles:

### ADMIN Role
- Full access to all endpoints
- Can upload transaction files
- Can view and update accounts
- Can export reports

### OPERATOR Role
- Can view accounts and dashboard
- Can update account information
- Can export reports
- Cannot upload transaction files

### Endpoint Security

```
Public Endpoints:
- POST /api/auth/login
- POST /api/auth/logout

Admin-Only Endpoints:
- POST /api/accounts/upload

Admin & Operator Endpoints:
- GET /api/accounts
- GET /api/accounts/{id}
- GET /api/accounts/summary
- PUT /api/accounts/{id}
- PUT /api/accounts/bulk
- GET /api/reports/export
```

## Production Deployment Checklist

- [ ] Set strong JWT secret via environment variable
- [ ] Configure CORS allowed origins for production domain
- [ ] Enable HTTPS/TLS
- [ ] Review and enable X-Frame-Options
- [ ] Disable H2 console
- [ ] Set appropriate token expiration time
- [ ] Configure rate limiting for authentication endpoints
- [ ] Enable audit logging
- [ ] Review and update Content Security Policy

## Testing Security Configuration

To verify CORS configuration:

```bash
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Authorization" \
     -X OPTIONS \
     http://localhost:8080/api/accounts
```

Expected response should include:
- `Access-Control-Allow-Origin: http://localhost:3000`
- `Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS`
- `Access-Control-Allow-Credentials: true`

## References

- Requirements: 1.3 - Session management and CORS configuration
- Design Document: Security Considerations section
