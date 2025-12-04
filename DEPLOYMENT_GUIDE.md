# Deployment Guide - Dormant Accounts Management System

## Overview
This guide will help you deploy the Dormant Accounts Management System to a production environment.

## Prerequisites
- Java 17 or higher
- Node.js 16+ and npm
- Web server (Nginx recommended)
- Domain name (optional but recommended)
- SSL certificate (recommended for production)

## Architecture
- **Backend**: Spring Boot application (JAR file) running on port 8080
- **Frontend**: React static files served by Nginx
- **Database**: H2 file-based database for persistence
- **Reverse Proxy**: Nginx serves frontend and proxies API requests to backend

## Production Artifacts Created

### Backend
- **Location**: `backend/target/dormant-accounts-1.0.0.jar`
- **Size**: ~50MB (includes all dependencies)
- **Profile**: Use `prod` profile for production

### Frontend
- **Location**: `frontend/build/`
- **Contents**: Optimized static files (HTML, CSS, JS)
- **Size**: ~500KB (gzipped)

## Deployment Steps

### Step 1: Prepare Server Environment


```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Java 17
sudo apt install openjdk-17-jdk -y
java -version

# Install Nginx
sudo apt install nginx -y
sudo systemctl enable nginx
```

### Step 2: Deploy Backend

```bash
# Create application directory
sudo mkdir -p /opt/dormant-accounts
cd /opt/dormant-accounts

# Copy JAR file
sudo cp /path/to/backend/target/dormant-accounts-1.0.0.jar .

# Copy environment configuration
sudo cp /path/to/deployment/.env.example .env
sudo nano .env  # Edit with your production values

# Copy startup script
sudo cp /path/to/deployment/start-backend.sh .
sudo chmod +x start-backend.sh

# Create data and logs directories
sudo mkdir -p data logs
```

### Step 3: Configure Environment Variables

Edit `/opt/dormant-accounts/.env`:

```bash
# IMPORTANT: Change these values for production!
SERVER_PORT=8080
JWT_SECRET=YOUR_SECURE_RANDOM_SECRET_HERE
CORS_ALLOWED_ORIGINS=https://your-domain.com
```

Generate a secure JWT secret:
```bash
openssl rand -base64 32
```


### Step 4: Create Systemd Service (Backend)

Create `/etc/systemd/system/dormant-accounts.service`:

```ini
[Unit]
Description=Dormant Accounts Management Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/dormant-accounts
Environment="SPRING_PROFILES_ACTIVE=prod"
EnvironmentFile=/opt/dormant-accounts/.env
ExecStart=/usr/bin/java -jar /opt/dormant-accounts/dormant-accounts-1.0.0.jar
Restart=always
RestartSec=10
StandardOutput=append:/opt/dormant-accounts/logs/application.log
StandardError=append:/opt/dormant-accounts/logs/error.log

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable dormant-accounts
sudo systemctl start dormant-accounts
sudo systemctl status dormant-accounts
```

### Step 5: Deploy Frontend

```bash
# Create frontend directory
sudo mkdir -p /var/www/dormant-accounts/frontend

# Copy build files
sudo cp -r /path/to/frontend/build/* /var/www/dormant-accounts/frontend/

# Set permissions
sudo chown -R www-data:www-data /var/www/dormant-accounts
sudo chmod -R 755 /var/www/dormant-accounts
```


### Step 6: Configure Nginx

```bash
# Copy nginx configuration
sudo cp /path/to/deployment/nginx.conf /etc/nginx/sites-available/dormant-accounts

# Edit configuration with your domain
sudo nano /etc/nginx/sites-available/dormant-accounts

# Enable site
sudo ln -s /etc/nginx/sites-available/dormant-accounts /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 7: Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Step 8: Setup SSL (Recommended)

Using Let's Encrypt (free SSL):

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
sudo certbot renew --dry-run
```

## Verification

### Check Backend Health
```bash
curl http://localhost:8080/actuator/health
```

### Check Frontend
```bash
curl http://your-domain.com
```

### Test Login
Navigate to `https://your-domain.com` and login with:
- Username: `admin`
- Password: `admin123`


## Monitoring and Maintenance

### View Backend Logs
```bash
# Real-time logs
sudo journalctl -u dormant-accounts -f

# Application logs
tail -f /opt/dormant-accounts/logs/application.log
```

### View Nginx Logs
```bash
tail -f /var/log/nginx/dormant-accounts-access.log
tail -f /var/log/nginx/dormant-accounts-error.log
```

### Restart Services
```bash
# Restart backend
sudo systemctl restart dormant-accounts

# Restart Nginx
sudo systemctl restart nginx
```

### Database Backup
```bash
# Backup H2 database
sudo cp /opt/dormant-accounts/data/dormant_accounts.mv.db /backup/location/

# Automated backup script
sudo crontab -e
# Add: 0 2 * * * cp /opt/dormant-accounts/data/dormant_accounts.mv.db /backup/dormant_accounts_$(date +\%Y\%m\%d).mv.db
```

## Security Checklist

- [ ] Changed default JWT secret
- [ ] Updated CORS origins to production domain
- [ ] Disabled H2 console in production
- [ ] Configured SSL/HTTPS
- [ ] Set up firewall rules
- [ ] Changed default admin password
- [ ] Configured log rotation
- [ ] Set up automated backups
- [ ] Restricted file permissions
- [ ] Enabled security headers in Nginx

## Troubleshooting

### Backend won't start
```bash
# Check logs
sudo journalctl -u dormant-accounts -n 50

# Check if port is in use
sudo netstat -tulpn | grep 8080

# Verify Java version
java -version
```

### Frontend shows blank page
```bash
# Check Nginx configuration
sudo nginx -t

# Check file permissions
ls -la /var/www/dormant-accounts/frontend

# Check browser console for errors
```

### Database errors
```bash
# Check data directory permissions
ls -la /opt/dormant-accounts/data

# Verify H2 database file exists
ls -la /opt/dormant-accounts/data/dormant_accounts.mv.db
```

## Performance Optimization

### Backend JVM Options
Edit systemd service file to add:
```ini
Environment="JAVA_OPTS=-Xms512m -Xmx1024m -XX:+UseG1GC"
```

### Nginx Caching
Already configured in nginx.conf for static assets

### Database Optimization
H2 is optimized for small to medium datasets. For larger datasets, consider PostgreSQL.

## Updating the Application

### Update Backend
```bash
# Stop service
sudo systemctl stop dormant-accounts

# Backup current JAR
sudo cp /opt/dormant-accounts/dormant-accounts-1.0.0.jar /opt/dormant-accounts/dormant-accounts-1.0.0.jar.backup

# Copy new JAR
sudo cp /path/to/new/dormant-accounts-1.0.0.jar /opt/dormant-accounts/

# Start service
sudo systemctl start dormant-accounts
```

### Update Frontend
```bash
# Backup current build
sudo cp -r /var/www/dormant-accounts/frontend /var/www/dormant-accounts/frontend.backup

# Copy new build
sudo rm -rf /var/www/dormant-accounts/frontend/*
sudo cp -r /path/to/new/frontend/build/* /var/www/dormant-accounts/frontend/

# Clear browser cache or use hard refresh (Ctrl+Shift+R)
```

## Support

For issues or questions:
1. Check application logs
2. Review this deployment guide
3. Verify all configuration files
4. Check system resources (disk space, memory)

## Additional Resources

- Spring Boot Documentation: https://spring.io/projects/spring-boot
- React Deployment: https://create-react-app.dev/docs/deployment/
- Nginx Documentation: https://nginx.org/en/docs/
- Let's Encrypt: https://letsencrypt.org/
