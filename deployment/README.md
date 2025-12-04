# Deployment Files

This directory contains all the files needed to deploy the Dormant Accounts Management System to production.

## Files Overview

### Configuration Files

- **`.env.example`** - Template for environment variables
  - Copy to `.env` and update with production values
  - Contains database, JWT, and CORS configuration

- **`nginx.conf`** - Nginx web server configuration
  - Serves React frontend
  - Proxies API requests to backend
  - Includes security headers and caching

### Scripts

- **`start-backend.sh`** - Backend startup script
  - Loads environment variables
  - Starts Spring Boot application
  - Creates necessary directories

### Documentation

- **`DEPLOYMENT_CHECKLIST.md`** - Step-by-step deployment checklist
  - Use this to track deployment progress
  - Ensures nothing is missed

## Quick Start

1. **Build the application** (from project root):
   ```bash
   # Backend
   cd backend && mvn clean package -DskipTests
   
   # Frontend
   cd frontend && npm run build
   ```

2. **Copy files to server**:
   ```bash
   # Backend JAR
   scp backend/target/dormant-accounts-1.0.0.jar user@server:/opt/dormant-accounts/
   
   # Frontend build
   scp -r frontend/build/* user@server:/var/www/dormant-accounts/frontend/
   
   # Deployment files
   scp deployment/* user@server:/opt/dormant-accounts/
   ```

3. **Configure environment**:
   ```bash
   ssh user@server
   cd /opt/dormant-accounts
   cp .env.example .env
   nano .env  # Edit with your values
   ```

4. **Start services**:
   ```bash
   # Setup systemd service (see DEPLOYMENT_GUIDE.md)
   sudo systemctl start dormant-accounts
   sudo systemctl start nginx
   ```

## Important Notes

- **Change JWT Secret**: Generate a new secret for production
- **Update CORS**: Set to your actual frontend domain
- **Enable SSL**: Use Let's Encrypt for free SSL certificates
- **Change Passwords**: Update default admin password after first login
- **Backup Database**: Set up automated backups of H2 database file

## Support

Refer to the main `DEPLOYMENT_GUIDE.md` in the project root for detailed instructions.

## Production Artifacts

After building, you'll have:
- Backend: `backend/target/dormant-accounts-1.0.0.jar` (~50MB)
- Frontend: `frontend/build/` directory (~500KB)

## Environment Variables

Required environment variables (see `.env.example`):
- `SERVER_PORT` - Backend port (default: 8080)
- `JWT_SECRET` - Secret key for JWT tokens (MUST CHANGE)
- `CORS_ALLOWED_ORIGINS` - Frontend URL for CORS
- `DATABASE_URL` - H2 database file location

## Security Checklist

Before going live:
- [ ] JWT secret changed from default
- [ ] CORS configured for production domain
- [ ] SSL/HTTPS enabled
- [ ] H2 console disabled
- [ ] Default passwords changed
- [ ] Firewall configured
- [ ] Backups configured
