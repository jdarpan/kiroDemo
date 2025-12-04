# Quick Reference Card

## 📦 Production Artifacts

| Component | Location | Size |
|-----------|----------|------|
| Backend JAR | `backend/target/dormant-accounts-1.0.0.jar` | 50 MB |
| Frontend Build | `frontend/build/` | 1.4 MB |

## 🔑 Default Credentials

| User | Username | Password | Role |
|------|----------|----------|------|
| Admin | `admin` | `admin123` | ADMIN |
| Operator | `operator` | `operator123` | OPERATOR |

⚠️ **Change these immediately after deployment!**

## 🚀 Essential Commands

### Backend
```bash
# Start
sudo systemctl start dormant-accounts

# Stop
sudo systemctl stop dormant-accounts

# Restart
sudo systemctl restart dormant-accounts

# Status
sudo systemctl status dormant-accounts

# Logs
sudo journalctl -u dormant-accounts -f
```

### Frontend (Nginx)
```bash
# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx

# Restart
sudo systemctl restart nginx

# Logs
tail -f /var/log/nginx/dormant-accounts-access.log
```

## 🔧 Configuration Files

| File | Location | Purpose |
|------|----------|---------|
| Environment | `/opt/dormant-accounts/.env` | Backend config |
| Systemd Service | `/etc/systemd/system/dormant-accounts.service` | Service definition |
| Nginx Config | `/etc/nginx/sites-available/dormant-accounts` | Web server config |
| Application Config | Built into JAR (application-prod.yml) | Spring Boot config |

## 🌐 URLs

| Service | URL | Port |
|---------|-----|------|
| Frontend | `http://your-domain.com` | 80/443 |
| Backend API | `http://localhost:8080/api` | 8080 |
| Health Check | `http://localhost:8080/actuator/health` | 8080 |

## 📁 Important Directories

| Directory | Purpose |
|-----------|---------|
| `/opt/dormant-accounts/` | Application root |
| `/opt/dormant-accounts/data/` | H2 database files |
| `/opt/dormant-accounts/logs/` | Application logs |
| `/var/www/dormant-accounts/frontend/` | Frontend static files |

## 🔒 Security Checklist

- [ ] JWT secret changed
- [ ] CORS origins updated
- [ ] SSL/HTTPS enabled
- [ ] Default passwords changed
- [ ] Firewall configured
- [ ] H2 console disabled

## 🆘 Troubleshooting

### Backend won't start
```bash
sudo journalctl -u dormant-accounts -n 50
sudo netstat -tulpn | grep 8080
```

### Frontend not loading
```bash
sudo nginx -t
ls -la /var/www/dormant-accounts/frontend/
```

### Database issues
```bash
ls -la /opt/dormant-accounts/data/
```

## 💾 Backup

```bash
# Backup database
sudo cp /opt/dormant-accounts/data/dormant_accounts.mv.db \
       /backup/dormant_accounts_$(date +%Y%m%d).mv.db

# Backup JAR
sudo cp /opt/dormant-accounts/dormant-accounts-1.0.0.jar \
       /backup/dormant-accounts-1.0.0.jar.backup
```

## 🔄 Update Application

### Backend
```bash
sudo systemctl stop dormant-accounts
sudo cp new-version.jar /opt/dormant-accounts/dormant-accounts-1.0.0.jar
sudo systemctl start dormant-accounts
```

### Frontend
```bash
sudo rm -rf /var/www/dormant-accounts/frontend/*
sudo cp -r new-build/* /var/www/dormant-accounts/frontend/
# Clear browser cache
```

## 📊 Monitoring

```bash
# CPU/Memory usage
top -p $(pgrep -f dormant-accounts)

# Disk space
df -h /opt/dormant-accounts/data

# Active connections
sudo netstat -an | grep :8080 | wc -l
```

## 🔐 Generate JWT Secret

```bash
openssl rand -base64 32
```

## 📝 Environment Variables

```bash
SERVER_PORT=8080
JWT_SECRET=<generated-secret>
CORS_ALLOWED_ORIGINS=https://your-domain.com
DATABASE_URL=jdbc:h2:file:./data/dormant_accounts
```

## 📞 Support Resources

- Deployment Guide: `DEPLOYMENT_GUIDE.md`
- Checklist: `deployment/DEPLOYMENT_CHECKLIST.md`
- Sample Data: `SAMPLE_DATA_README.md`
