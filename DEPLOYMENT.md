# 🚀 Deployment Guide - Raspberry Pi + Cloudflare Tunnel

This guide walks you through deploying Formexus on a Raspberry Pi with Cloudflare Tunnel for secure global access.

## 📋 Prerequisites

### Hardware

- **Raspberry Pi 4 or 5** (2GB+ RAM recommended)
- **microSD card** (16GB+ recommended)
- **Stable power supply**
- **Ethernet connection** (recommended for stability)

### Software

- **Raspberry Pi OS** (64-bit, latest version)
- **Docker** and **Docker Compose**
- **Cloudflare account** (free tier works)
- **Domain name** (optional but recommended)

### Accounts

- **Cloudflare account**: https://dash.cloudflare.com
- **Domain registrar** (if using custom domain)

---

## 🛠️ Step 1: Prepare Raspberry Pi

### 1.1 Install Raspberry Pi OS

```bash
# If not already installed, download Raspberry Pi Imager
# Flash Raspberry Pi OS (64-bit) to your microSD card
# Enable SSH during setup for headless installation
```

### 1.2 Update System

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl wget
```

### 1.3 Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Add your user to docker group
sudo usermod -aG docker $USER

# Log out and back in, or run:
newgrp docker

# Verify installation
docker --version
```

### 1.4 Install Docker Compose Plugin

```bash
sudo apt-get install -y docker-compose-plugin

# Verify installation
docker compose version
```

---

## 📦 Step 2: Clone and Configure Formexus

### 2.1 Clone Repository

```bash
cd ~
git clone https://github.com/Ertugrul-Pakdamar/Formexus.git
cd Formexus
```

### 2.2 Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit environment variables
nano .env
```

**Required changes in `.env`:**

```env
# Strong MongoDB password
MONGO_ROOT_PASSWORD=your_very_strong_password_here

# JWT secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_random_32_character_secret_key

# Your domain (update after Cloudflare setup)
FRONTEND_URL=https://formexus.yourdomain.com
VITE_API_URL=https://formexus.yourdomain.com/api
```

Save with `Ctrl+O`, exit with `Ctrl+X`.

---

## ☁️ Step 3: Setup Cloudflare Tunnel

### 3.1 Install cloudflared

```bash
# Download cloudflared for ARM64
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64

# Move to system path
sudo mv cloudflared-linux-arm64 /usr/local/bin/cloudflared
sudo chmod +x /usr/local/bin/cloudflared

# Verify installation
cloudflared --version
```

### 3.2 Authenticate with Cloudflare

```bash
# Login to Cloudflare (will open browser)
cloudflared tunnel login
```

This opens a browser window. Select your domain and authorize.

### 3.3 Create Tunnel

```bash
# Create a new tunnel
cloudflared tunnel create formexus-tunnel

# Note the Tunnel ID from output
# Example: Created tunnel formexus-tunnel with id abc123-def456-...
```

**Copy the tunnel credentials:**

```bash
# Copy credentials to project directory
cp ~/.cloudflared/YOUR_TUNNEL_ID.json ~/Formexus/cloudflare-tunnel/cert.json

# Set proper permissions
chmod 600 ~/Formexus/cloudflare-tunnel/cert.json
```

### 3.4 Configure Tunnel

Edit `cloudflare-tunnel/config.yml`:

```bash
nano ~/Formexus/cloudflare-tunnel/config.yml
```

Update with your tunnel ID:

```yaml
tunnel: YOUR_TUNNEL_ID_HERE
credentials-file: /etc/cloudflared/cert.json

ingress:
  # Frontend
  - hostname: formexus.yourdomain.com
    service: http://frontend:80

  # WWW redirect
  - hostname: www.formexus.yourdomain.com
    service: http://frontend:80

  # Backend API
  - hostname: formexus.yourdomain.com
    path: /api/*
    service: http://backend:8080

  # 404 for everything else
  - service: http_status:404
```

### 3.5 Setup DNS Routes

```bash
# Route your domain to the tunnel
cloudflared tunnel route dns YOUR_TUNNEL_ID formexus.yourdomain.com
cloudflared tunnel route dns YOUR_TUNNEL_ID www.formexus.yourdomain.com
```

---

## 🐳 Step 4: Deploy with Docker Compose

### 4.1 Build and Start Services

```bash
cd ~/Formexus

# Start all services
docker compose up -d

# View logs
docker compose logs -f
```

### 4.2 Verify Services

```bash
# Check all containers are running
docker compose ps

# Should show:
# - formexus-mongodb (healthy)
# - formexus-backend (healthy)
# - formexus-frontend (healthy)
# - formexus-cloudflared (running)
```

### 4.3 Test Locally

```bash
# Test frontend
curl -I http://localhost:3000

# Test backend
curl http://localhost:8080/health
```

---

## 🔄 Step 5: Enable Auto-Start on Boot

### 5.1 Install Systemd Service

```bash
cd ~/Formexus
chmod +x install-service.sh
./install-service.sh
```

This installs a systemd service that automatically starts Formexus on boot.

### 5.2 Verify Service

```bash
# Check service status
sudo systemctl status formexus

# View logs
sudo journalctl -u formexus -f
```

### 5.3 Systemd Commands

```bash
# Start service
sudo systemctl start formexus

# Stop service
sudo systemctl stop formexus

# Restart service
sudo systemctl restart formexus

# Disable auto-start
sudo systemctl disable formexus

# Enable auto-start
sudo systemctl enable formexus
```

---

## 🌐 Step 6: Configure Cloudflare Dashboard

### 6.1 Login to Cloudflare Dashboard

Go to: https://dash.cloudflare.com

### 6.2 Select Your Domain

Click on your domain in the dashboard.

### 6.3 Configure DNS Records

Go to **DNS > Records**

**Delete or disable old records:**

- Remove any A, AAAA records for your domain
- Remove old CNAME records

**Add tunnel CNAME records:**

**Record 1 (Apex domain):**

- Type: `CNAME`
- Name: `@` or leave blank
- Target: `YOUR_TUNNEL_ID.cfargotunnel.com`
- Proxy status: **Proxied** (orange cloud)
- TTL: Auto

**Record 2 (WWW):**

- Type: `CNAME`
- Name: `www`
- Target: `YOUR_TUNNEL_ID.cfargotunnel.com`
- Proxy status: **Proxied** (orange cloud)
- TTL: Auto

### 6.4 SSL/TLS Settings

Go to **SSL/TLS > Overview**

Set SSL/TLS encryption mode to: **Full** or **Full (strict)**

---

## ✅ Step 7: Testing

### 7.1 Wait for DNS Propagation

DNS changes can take 2-10 minutes to propagate.

### 7.2 Test Your Domain

```bash
# Test frontend
curl -I https://formexus.yourdomain.com

# Should return: HTTP/2 200

# Test backend API
curl https://formexus.yourdomain.com/api/health

# Should return: {"status":"ok","service":"formexus-api"}
```

### 7.3 Test in Browser

Open: https://formexus.yourdomain.com

You should see the Formexus homepage!

---

## 🔧 Maintenance

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f cloudflared
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart backend
```

### Update Application

```bash
cd ~/Formexus

# Pull latest changes
git pull

# Rebuild and restart
docker compose up -d --build
```

### Backup MongoDB

```bash
# Create backup
docker exec formexus-mongodb mongodump --out /data/backup

# Copy backup to host
docker cp formexus-mongodb:/data/backup ./mongodb-backup-$(date +%Y%m%d)
```

### Restore MongoDB

```bash
# Copy backup to container
docker cp ./mongodb-backup formexus-mongodb:/data/restore

# Restore
docker exec formexus-mongodb mongorestore /data/restore
```

---

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker compose logs backend

# Check if port is in use
sudo netstat -tlnp | grep 8080

# Restart from scratch
docker compose down
docker compose up -d
```

### DNS Not Resolving

```bash
# Check DNS propagation
dig formexus.yourdomain.com

# Check Cloudflare tunnel
cloudflared tunnel info YOUR_TUNNEL_ID

# Restart tunnel
docker compose restart cloudflared
```

### MongoDB Connection Issues

```bash
# Check MongoDB logs
docker compose logs mongodb

# Verify credentials in .env
cat .env | grep MONGO

# Test connection
docker exec formexus-backend wget -qO- http://localhost:8080/health
```

### Backend 502 Error

```bash
# Check backend logs
docker compose logs backend

# Check if backend is healthy
docker compose ps

# Restart backend
docker compose restart backend
```

---

## 🔒 Security Best Practices

### 1. Change Default Passwords

Always use strong, unique passwords for:

- MongoDB root password
- JWT secret

### 2. Keep System Updated

```bash
# Update Raspberry Pi OS
sudo apt update && sudo apt upgrade -y

# Update Docker containers
cd ~/Formexus
docker compose pull
docker compose up -d
```

### 3. Monitor Logs

Regularly check logs for suspicious activity:

```bash
sudo journalctl -u formexus -f
```

### 4. Firewall Configuration

```bash
# Install UFW (if not installed)
sudo apt install ufw

# Allow SSH
sudo ufw allow 22/tcp

# Block external access to MongoDB
sudo ufw deny 27017/tcp

# Enable firewall
sudo ufw enable
```

### 5. Backup Regularly

Set up automated backups:

```bash
# Create backup script
nano ~/backup-formexus.sh
```

Add:

```bash
#!/bin/bash
BACKUP_DIR=~/formexus-backups
DATE=$(date +%Y%m%d-%H%M%S)

mkdir -p $BACKUP_DIR
docker exec formexus-mongodb mongodump --out /data/backup
docker cp formexus-mongodb:/data/backup $BACKUP_DIR/mongodb-$DATE

# Keep last 7 backups
ls -t $BACKUP_DIR | tail -n +8 | xargs -I {} rm -rf $BACKUP_DIR/{}
```

Make executable and add to crontab:

```bash
chmod +x ~/backup-formexus.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add line: 0 2 * * * /home/YOUR_USER/backup-formexus.sh
```

---

## 📊 Monitoring

### Check Service Status

```bash
# System service
sudo systemctl status formexus

# Docker containers
docker compose ps

# Resource usage
docker stats
```

### Monitor Cloudflare Tunnel

```bash
# Check tunnel connections
docker compose logs cloudflared | grep "Registered tunnel connection"

# Should show 4 connections to Cloudflare edge
```

---

## 🎉 Success!

Your Formexus instance is now:

✅ Running on Raspberry Pi  
✅ Accessible globally via HTTPS  
✅ Auto-starts on boot  
✅ Protected by Cloudflare  
✅ Fully self-hosted

**Next Steps:**

1. Create your first form
2. Customize your profile
3. Share forms with others
4. Export responses

Enjoy your self-hosted form builder! 🚀
