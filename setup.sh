#!/bin/bash

# Formexus Quick Setup Script for Raspberry Pi
# Run this script for first-time setup

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "================================"
echo "  Formexus Quick Setup Script   "
echo "================================"
echo ""

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo -e "${BLUE}Installing Docker...${NC}"
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
    echo -e "${GREEN}✓ Docker installed${NC}"
    echo -e "${YELLOW}⚠ Please log out and log back in for Docker permissions to take effect${NC}"
else
    echo -e "${GREEN}✓ Docker already installed${NC}"
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${BLUE}Installing Docker Compose...${NC}"
    sudo apt-get update
    sudo apt-get install -y docker-compose-plugin
    echo -e "${GREEN}✓ Docker Compose installed${NC}"
else
    echo -e "${GREEN}✓ Docker Compose already installed${NC}"
fi

# Create .env file
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file...${NC}"
    cp .env.example .env
    
    # Generate random JWT secret
    JWT_SECRET=$(openssl rand -base64 32)
    MONGO_PASSWORD=$(openssl rand -base64 16)
    
    # Update .env file
    sed -i "s/your_super_secret_jwt_key_min_32_chars_please_change_this/$JWT_SECRET/" .env
    sed -i "s/your_strong_password_here/$MONGO_PASSWORD/" .env
    
    echo -e "${GREEN}✓ .env file created with random secrets${NC}"
    echo -e "${YELLOW}⚠ Please update FRONTEND_URL and VITE_API_URL with your domain${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Make scripts executable
chmod +x deploy.sh
chmod +x cloudflare-tunnel/setup-tunnel.sh

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Setup completed!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Next steps:"
echo "1. Edit .env file and update your domain names"
echo "2. Run: ./deploy.sh"
echo "3. Set up Cloudflare Tunnel: cd cloudflare-tunnel && ./setup-tunnel.sh"
echo ""
