# Formexus Raspberry Pi Deployment Guide

## 📋 Complete Setup Guide

This guide will walk you through deploying Formexus on your Raspberry Pi with Cloudflare Tunnel for secure external access.

---

## 🔧 Hardware Requirements

### Minimum Requirements

- Raspberry Pi 4 Model B (2GB RAM)
- 16GB microSD card (Class 10)
- Stable internet connection
- Power supply (5V 3A)

### Recommended

- Raspberry Pi 4/5 (4GB+ RAM)
- 32GB+ microSD card
- Ethernet connection
- UPS or stable power source

---

## 📦 Software Prerequisites

### 1. Install Raspberry Pi OS

Download and install **Raspberry Pi OS (64-bit)** using Raspberry Pi Imager:

- Download from: https://www.raspberrypi.com/software/
- Choose "Raspberry Pi OS (64-bit)"
- Enable SSH in advanced options
- Set username and password
- Configure WiFi (optional)

### 2. First Boot

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y git curl wget nano htop
```

---

## 🚀 Quick Start (Automated)

```bash
# 1. Clone repository
git clone https://github.com/Ertugrul-Pakdamar/Formexus.git
cd Formexus

# 2. Run setup script
chmod +x setup.sh
./setup.sh

# 3. Edit configuration
nano .env
# Update FRONTEND_URL and VITE_API_URL with your domain

# 4. Deploy
./deploy.sh

# 5. Setup Cloudflare Tunnel
cd cloudflare-tunnel
./setup-tunnel.sh
```

---

## 📝 Detailed Setup Steps

### Step 1: Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in, then verify
docker --version
docker compose version
```

### Step 2: Clone and Configure

```bash
# Clone repository
git clone https://github.com/Ertugrul-Pakdamar/Formexus.git
cd Formexus

# Create environment file
cp .env.example .env
nano .env
```

**Important .env configurations:**

```env
# MongoDB
MONGO_ROOT_PASSWORD=your_very_strong_password_here

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_generated_secret_key_min_32_chars

# Your domain names
FRONTEND_URL=https://formexus.yourdomain.com
VITE_API_URL=https://api.formexus.yourdomain.com

# Database URI (for local MongoDB)
MONGODB_URI=mongodb://admin:your_very_strong_password_here@mongodb:27017
```

### Step 3: Deploy with Docker

```bash
# Deploy all services (MongoDB + Backend + Frontend)
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 4: Setup Cloudflare Tunnel

#### A. Install cloudflared

```bash
# Download for ARM64
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64

# Install
sudo mv cloudflared-linux-arm64 /usr/local/bin/cloudflared
sudo chmod +x /usr/local/bin/cloudflared

# Verify installation
cloudflared --version
```

#### B. Authenticate with Cloudflare

```bash
# Login (opens browser)
cloudflared tunnel login
```

#### C. Create Tunnel

```bash
# Create tunnel named 'formexus'
cloudflared tunnel create formexus

# Note the Tunnel ID from output
# Example: Created tunnel formexus with id abc123-def456-ghi789
```

#### D. Configure Tunnel

```bash
# Edit config file
nano cloudflare-tunnel/config.yml
```

Update with your details:

```yaml
tunnel: abc123-def456-ghi789 # Your tunnel ID
credentials-file: /home/pi/.cloudflared/abc123-def456-ghi789.json

ingress:
  - hostname: formexus.yourdomain.com
    service: http://localhost:3000
  - hostname: api.formexus.yourdomain.com
    service: http://localhost:8080
  - service: http_status:404
```

#### E. Create DNS Records

In Cloudflare Dashboard:

1. Go to your domain → DNS → Records
2. Add CNAME record:
   - Name: `formexus`
   - Target: `abc123-def456-ghi789.cfargotunnel.com`
   - Proxy: Enabled (orange cloud)
3. Add CNAME record:
   - Name: `api.formexus`
   - Target: `abc123-def456-ghi789.cfargotunnel.com`
   - Proxy: Enabled (orange cloud)

#### F. Run Tunnel

```bash
# Test run
cloudflared tunnel --config ./cloudflare-tunnel/config.yml run

# If working, set up as systemd service (see below)
```

### Step 5: Setup Auto-Start (systemd)

#### For Docker Services

```bash
# Enable Docker to start on boot
sudo systemctl enable docker

# Services will auto-start via docker-compose restart policy
```

#### For Cloudflare Tunnel

```bash
# Create systemd service
sudo nano /etc/systemd/system/cloudflared.service
```

Add this content:

```ini
[Unit]
Description=Cloudflare Tunnel
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/Formexus
ExecStart=/usr/local/bin/cloudflared tunnel --config /home/pi/Formexus/cloudflare-tunnel/config.yml run
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable on boot
sudo systemctl enable cloudflared

# Start service
sudo systemctl start cloudflared

# Check status
sudo systemctl status cloudflared
```

---

## 🔍 Verification

### Check Services

```bash
# Docker services
docker-compose ps

# Should show:
# formexus-mongodb    Up (healthy)
# formexus-backend    Up (healthy)
# formexus-frontend   Up (healthy)
```

### Test Locally

```bash
# Frontend
curl http://localhost:3000

# Backend health
curl http://localhost:8080/health

# MongoDB
docker exec formexus-mongodb mongosh --eval "db.adminCommand('ping')"
```

### Test Externally

Visit your domains:

- Frontend: https://formexus.yourdomain.com
- Backend: https://api.formexus.yourdomain.com/health

---

## 🛠️ Maintenance

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Cloudflare Tunnel
sudo journalctl -u cloudflared -f
```

### Restart Services

```bash
# All services
docker-compose restart

# Specific service
docker-compose restart backend

# Cloudflare Tunnel
sudo systemctl restart cloudflared
```

### Update Application

```bash
# Stop services
docker-compose down

# Pull latest code
git pull

# Rebuild and start
docker-compose up -d --build

# Or use deploy script
./deploy.sh  # Choose option 3 (Update)
```

### Backup Database

```bash
# Create backup
docker exec formexus-mongodb mongodump --out /data/backup

# Copy to host
docker cp formexus-mongodb:/data/backup ./mongodb-backup-$(date +%Y%m%d)

# Compress
tar -czf mongodb-backup-$(date +%Y%m%d).tar.gz ./mongodb-backup-$(date +%Y%m%d)
```

### Restore Database

```bash
# Copy backup to container
docker cp ./mongodb-backup formexus-mongodb:/data/restore

# Restore
docker exec formexus-mongodb mongorestore /data/restore
```

---

## 🔒 Security Checklist

- [ ] Changed default MongoDB password
- [ ] Generated strong JWT secret (32+ characters)
- [ ] Enabled Cloudflare proxy (orange cloud)
- [ ] Configured firewall (ufw)
- [ ] Regular system updates
- [ ] MongoDB backup schedule
- [ ] HTTPS only (via Cloudflare)
- [ ] Changed default Pi password
- [ ] SSH key authentication
- [ ] Disabled password SSH login

### Setup Firewall

```bash
# Install UFW
sudo apt install ufw

# Allow SSH
sudo ufw allow ssh

# Deny all incoming (Cloudflare Tunnel handles external access)
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## 📊 Monitoring

### System Resources

```bash
# CPU, Memory, Disk
htop

# Disk usage
df -h

# Docker stats
docker stats

# Temperature
vcgencmd measure_temp
```

### Service Health

```bash
# Docker services
docker-compose ps

# Cloudflare Tunnel
sudo systemctl status cloudflared

# Logs
docker-compose logs --tail=50
```

---

## 🐛 Troubleshooting

### Services Not Starting

```bash
# Check Docker logs
docker-compose logs

# Check individual service
docker-compose logs backend

# Restart all
docker-compose down
docker-compose up -d
```

### Cloudflare Tunnel Issues

```bash
# Check service
sudo systemctl status cloudflared

# View logs
sudo journalctl -u cloudflared -n 50

# Restart
sudo systemctl restart cloudflared
```

### MongoDB Connection Issues

```bash
# Check MongoDB logs
docker-compose logs mongodb

# Test connection
docker exec formexus-mongodb mongosh --eval "db.adminCommand('ping')"

# Check environment variables
docker-compose config
```

### High Memory Usage

```bash
# Check usage
free -h

# Restart services
docker-compose restart

# Enable swap if needed
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile  # Increase CONF_SWAPSIZE
sudo dphys-swapfile setup
sudo dphys-swapfile swapon
```

---

## 🎯 Performance Optimization

### Raspberry Pi

```bash
# Increase swap size
sudo nano /etc/dphys-swapfile
# Set CONF_SWAPSIZE=2048

# Overclock (if on Pi 4/5)
sudo nano /boot/config.txt
# Add: arm_freq=2000

# Disable unnecessary services
sudo systemctl disable bluetooth
```

### Docker

```bash
# Clean up unused images/containers
docker system prune -a

# Remove unused volumes
docker volume prune
```

---

## 📚 Additional Resources

- [Cloudflare Tunnel Docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
- [Docker Documentation](https://docs.docker.com/)
- [Raspberry Pi Documentation](https://www.raspberrypi.com/documentation/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)

---

## 🆘 Getting Help

If you encounter issues:

1. Check logs: `docker-compose logs -f`
2. Verify configuration: `docker-compose config`
3. Check system resources: `htop`
4. Review this guide
5. Open issue on GitHub

---

**Made with 💜 by Ertuğrul Pakdamar**
