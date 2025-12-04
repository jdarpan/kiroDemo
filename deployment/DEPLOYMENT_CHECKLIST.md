# Deployment Checklist

## Pre-Deployment

- [ ] Backend JAR built successfully (`backend/target/dormant-accounts-1.0.0.jar`)
- [ ] Frontend build completed (`frontend/build/`)
- [ ] Production configuration reviewed (`application-prod.yml`)
- [ ] Environment variables configured (`.env`)
- [ ] JWT secret generated and set
- [ ] CORS origins updated for production domain
- [ ] Default passwords changed

## Server Setup

- [ ] Server provisioned (EC2, VPS, etc.)
- [ ] Java 17 installed
- [ ] Nginx installed
- [ ] Firewall configured (ports 80, 443)
- [ ] Domain name configured (DNS A record)

## Backend Deployment

- [ ] JAR file copied to `/opt/dormant-accounts/`
- [ ] Environment file created and configured
- [ ] Data directory created (`/opt/dormant-accounts/data`)
- [ ] Logs directory created (`/opt/dormant-accounts/logs`)
- [ ] Systemd service file created
- [ ] Service enabled and started
- [ ] Backend health check passing

## Frontend Deployment

- [ ] Build files copied to `/var/www/dormant-accounts/frontend/`
- [ ] File permissions set correctly
- [ ] Nginx configuration file created
- [ ] Nginx configuration tested (`nginx -t`)
- [ ] Nginx reloaded
- [ ] Frontend accessible via domain

## SSL/Security

- [ ] SSL certificate obtained (Let's Encrypt or other)
- [ ] HTTPS configured in Nginx
- [ ] HTTP to HTTPS redirect enabled
- [ ] Security headers configured
- [ ] H2 console disabled in production

## Testing

- [ ] Can access frontend at https://your-domain.com
- [ ] Can login with admin credentials
- [ ] Dashboard loads with data
- [ ] Can search accounts
- [ ] Can update account status
- [ ] Can upload file (admin only)
- [ ] Can export CSV
- [ ] API endpoints responding correctly

## Monitoring

- [ ] Backend logs accessible
- [ ] Nginx logs accessible
- [ ] Log rotation configured
- [ ] Health check endpoint working
- [ ] Backup strategy implemented

## Post-Deployment

- [ ] Change default admin password
- [ ] Create additional user accounts as needed
- [ ] Document any custom configurations
- [ ] Set up monitoring/alerting (optional)
- [ ] Schedule regular backups
- [ ] Test disaster recovery procedure

## Rollback Plan

- [ ] Backup of previous version available
- [ ] Rollback procedure documented
- [ ] Database backup before deployment
- [ ] Know how to restore previous version quickly

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Version**: 1.0.0
**Notes**: _______________
