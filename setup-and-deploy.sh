#!/bin/bash

#############################################
# Formexus - Automated Setup & Deployment
# One-command installation for Raspberry Pi
#############################################

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Banner
echo -e "${CYAN}"
cat << "EOF"
╔═══════════════════════════════════════════╗
║                                           ║
║          FORMEXUS INSTALLER               ║
║     Form Builder Platform v1.0            ║
║                                           ║
╚═══════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Step counter
STEP=1
total_steps=10

print_step() {
    echo -e "\n${BLUE}[${STEP}/${total_steps}]${NC} ${GREEN}$1${NC}"
    ((STEP++))
}

print_error() {
    echo -e "${RED}✗ Error: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if running on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    print_error "This script is designed for Linux systems (Raspberry Pi OS recommended)"
    exit 1
fi

# ============================================
# STEP 1: Collect Configuration
# ============================================
print_step "Collecting Configuration"

read -p "Enter your domain (e.g., formexus.net): " DOMAIN
if [ -z "$DOMAIN" ]; then
    print_error "Domain is required!"
    exit 1
fi
print_success "Domain: $DOMAIN"

read -p "Enter MongoDB root password (or press Enter to generate): " MONGO_PASSWORD
if [ -z "$MONGO_PASSWORD" ]; then
    MONGO_PASSWORD=$(openssl rand -base64 24 | tr -d "=+/" | cut -c1-20)
    print_warning "Generated MongoDB password: $MONGO_PASSWORD"
fi

read -p "Enter JWT secret (or press Enter to generate): " JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    print_warning "Generated JWT secret: $JWT_SECRET"
fi

# ============================================
# STEP 2: Install System Dependencies
# ============================================
print_step "Installing System Dependencies"

sudo apt update -qq
sudo apt install -y git curl wget make jq >/dev/null 2>&1
print_success "System dependencies installed"

# ============================================
# STEP 3: Install Docker
# ============================================
print_step "Installing Docker"

if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh >/dev/null 2>&1
    sudo usermod -aG docker $USER
    print_success "Docker installed"
else
    print_success "Docker already installed"
fi

# ============================================
# STEP 4: Install Docker Compose
# ============================================
print_step "Installing Docker Compose"

if ! docker compose version &> /dev/null; then
    sudo apt-get install -y docker-compose-plugin >/dev/null 2>&1
    print_success "Docker Compose installed"
else
    print_success "Docker Compose already installed"
fi

# ============================================
# STEP 5: Clone Repository
# ============================================
print_step "Cloning Formexus Repository"

INSTALL_DIR="$HOME/Formexus"
if [ -d "$INSTALL_DIR" ]; then
    print_warning "Directory $INSTALL_DIR already exists. Backing up..."
    mv "$INSTALL_DIR" "$INSTALL_DIR.backup.$(date +%Y%m%d-%H%M%S)"
fi

git clone https://github.com/Ertugrul-Pakdamar/Formexus.git "$INSTALL_DIR" >/dev/null 2>&1
cd "$INSTALL_DIR"
print_success "Repository cloned to $INSTALL_DIR"

# ============================================
# STEP 6: Configure Environment
# ============================================
print_step "Configuring Environment Variables"

cat > .env << EOF
# MongoDB Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=$MONGO_PASSWORD
MONGO_DATABASE=formexus

# MongoDB Connection String
MONGODB_URI=mongodb://admin:$MONGO_PASSWORD@mongodb:27017

# Backend Configuration
PORT=8080
JWT_SECRET=$JWT_SECRET

# Frontend URL (for CORS)
FRONTEND_URL=https://$DOMAIN

# Frontend API URL (build-time variable)
VITE_API_URL=https://$DOMAIN/api

# Timezone
TZ=Europe/Istanbul

# Server Environment
SERVER_ENV=production
EOF

print_success "Environment configured"
print_warning "Configuration saved to: $INSTALL_DIR/.env"

# ============================================
# STEP 7: Install Cloudflared
# ============================================
print_step "Installing Cloudflare Tunnel"

if ! command -v cloudflared &> /dev/null; then
    ARCH=$(uname -m)
    if [[ "$ARCH" == "aarch64" || "$ARCH" == "arm64" ]]; then
        CLOUDFLARED_URL="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64"
    elif [[ "$ARCH" == "armv7l" ]]; then
        CLOUDFLARED_URL="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm"
    else
        CLOUDFLARED_URL="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64"
    fi
    
    wget -q $CLOUDFLARED_URL -O /tmp/cloudflared
    sudo mv /tmp/cloudflared /usr/local/bin/cloudflared
    sudo chmod +x /usr/local/bin/cloudflared
    print_success "Cloudflared installed"
else
    print_success "Cloudflared already installed"
fi

# ============================================
# STEP 8: Setup Cloudflare Tunnel
# ============================================
print_step "Setting up Cloudflare Tunnel"

echo -e "${YELLOW}Follow these steps:${NC}"
echo "1. A browser window will open for Cloudflare login"
echo "2. Select your domain"
echo "3. Authorize the tunnel"
echo ""
read -p "Press Enter to continue..."

cloudflared tunnel login

echo ""
read -p "Enter tunnel name (default: formexus-tunnel): " TUNNEL_NAME
TUNNEL_NAME=${TUNNEL_NAME:-formexus-tunnel}

# Check if tunnel already exists
EXISTING_TUNNEL=$(cloudflared tunnel list 2>/dev/null | grep "$TUNNEL_NAME" | awk '{print $1}')

if [ -n "$EXISTING_TUNNEL" ]; then
    print_warning "Tunnel '$TUNNEL_NAME' already exists with ID: $EXISTING_TUNNEL"
    TUNNEL_ID=$EXISTING_TUNNEL
else
    cloudflared tunnel create "$TUNNEL_NAME"
    TUNNEL_ID=$(cloudflared tunnel list | grep "$TUNNEL_NAME" | awk '{print $1}')
fi

print_success "Tunnel ID: $TUNNEL_ID"

# Copy credentials
cp ~/.cloudflared/${TUNNEL_ID}.json ./cloudflare-tunnel/cert.json
chmod 600 ./cloudflare-tunnel/cert.json

# Update tunnel config
cat > ./cloudflare-tunnel/config.yml << EOF
tunnel: $TUNNEL_ID
credentials-file: /etc/cloudflared/cert.json

ingress:
  # Backend API - MUST BE FIRST (path matching)
  - hostname: $DOMAIN
    path: /api/*
    service: http://backend:8080
  
  # Frontend - www redirect
  - hostname: www.$DOMAIN
    service: http://frontend:80
  
  # Frontend - main domain (catch-all for this hostname)
  - hostname: $DOMAIN
    service: http://frontend:80
  
  # Catch-all rule
  - service: http_status:404
EOF

# Setup DNS routes
cloudflared tunnel route dns $TUNNEL_ID $DOMAIN
cloudflared tunnel route dns $TUNNEL_ID www.$DOMAIN

print_success "Cloudflare Tunnel configured"
print_warning "Tunnel ID: $TUNNEL_ID"

# ============================================
# STEP 9: Build and Start Services
# ============================================
print_step "Building and Starting Services"

echo -e "${YELLOW}This may take 5-10 minutes on Raspberry Pi...${NC}"

# Ensure we're in docker group (might need re-login)
if ! docker ps &> /dev/null; then
    print_warning "Docker permission issue. Trying with newgrp..."
    newgrp docker << EONG
    docker compose up -d --build
EONG
else
    docker compose up -d --build
fi

print_success "Services started"

# ============================================
# STEP 10: Install Auto-Start Service
# ============================================
print_step "Installing Auto-Start Service"

chmod +x install-service.sh
./install-service.sh >/dev/null 2>&1 || true

print_success "Auto-start service installed"

# ============================================
# Final Status Check
# ============================================
echo -e "\n${CYAN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}Checking Service Status...${NC}"
echo -e "${CYAN}═══════════════════════════════════════${NC}\n"

sleep 5

# Check containers
docker compose ps

echo -e "\n${CYAN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}Installation Complete!${NC}"
echo -e "${CYAN}═══════════════════════════════════════${NC}\n"

echo -e "${GREEN}✓ Formexus has been installed successfully!${NC}\n"

echo -e "${YELLOW}Access Information:${NC}"
echo -e "  ${CYAN}🌐 Website:${NC}      https://$DOMAIN"
echo -e "  ${CYAN}🌐 WWW:${NC}          https://www.$DOMAIN"
echo -e "  ${CYAN}🔧 API:${NC}          https://$DOMAIN/api"
echo -e "  ${CYAN}📁 Location:${NC}     $INSTALL_DIR"

echo -e "\n${YELLOW}Credentials:${NC}"
echo -e "  ${CYAN}MongoDB Password:${NC} $MONGO_PASSWORD"
echo -e "  ${CYAN}JWT Secret:${NC}       $JWT_SECRET"
echo -e "  ${CYAN}Tunnel ID:${NC}        $TUNNEL_ID"

echo -e "\n${YELLOW}Important Notes:${NC}"
echo -e "  ${GREEN}✓${NC} Save your MongoDB password and JWT secret!"
echo -e "  ${GREEN}✓${NC} DNS may take 2-5 minutes to propagate"
echo -e "  ${GREEN}✓${NC} Services will auto-start on system boot"

echo -e "\n${YELLOW}Useful Commands:${NC}"
echo -e "  ${CYAN}make help${NC}              - Show all available commands"
echo -e "  ${CYAN}make status${NC}            - Check service status"
echo -e "  ${CYAN}make logs${NC}              - View all logs"
echo -e "  ${CYAN}make health${NC}            - Health check"
echo -e "  ${CYAN}make restart${NC}           - Restart all services"
echo -e "  ${CYAN}sudo systemctl status formexus${NC} - Check systemd service"

echo -e "\n${YELLOW}Cloudflare Dashboard:${NC}"
echo -e "  ${CYAN}https://dash.cloudflare.com${NC}"
echo -e "  ${GREEN}✓${NC} Make sure DNS records are set to Proxied (orange cloud)"
echo -e "  ${GREEN}✓${NC} SSL/TLS mode should be 'Full' or 'Full (strict)'"

echo -e "\n${GREEN}Wait 2-5 minutes, then visit:${NC} ${CYAN}https://$DOMAIN${NC}\n"

# Save credentials
cat > $INSTALL_DIR/CREDENTIALS.txt << EOF
Formexus Installation Credentials
==================================
Installation Date: $(date)
Domain: $DOMAIN
Location: $INSTALL_DIR

MongoDB:
  Username: admin
  Password: $MONGO_PASSWORD
  
JWT Secret: $JWT_SECRET

Cloudflare Tunnel:
  Tunnel ID: $TUNNEL_ID
  Tunnel Name: $TUNNEL_NAME
  
Systemd Service: formexus.service

Access URLs:
  Website: https://$DOMAIN
  WWW: https://www.$DOMAIN
  API: https://$DOMAIN/api
  
Important Commands:
  make help         - Show all commands
  make status       - Service status
  make logs         - View logs
  make restart      - Restart services
  
Note: Keep this file secure and delete it after backing up credentials!
EOF

print_success "Credentials saved to: $INSTALL_DIR/CREDENTIALS.txt"

echo -e "\n${RED}⚠ IMPORTANT:${NC} Backup ${CYAN}CREDENTIALS.txt${NC} and ${RED}delete${NC} it from the server!\n"

exit 0
