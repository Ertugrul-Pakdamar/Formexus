#!/bin/bash

# Cloudflare Tunnel Setup Script for Formexus
# This script helps you set up Cloudflare Tunnel on Raspberry Pi

set -e

echo "================================"
echo "Formexus Cloudflare Tunnel Setup"
echo "================================"
echo ""

# Check if running on ARM64
ARCH=$(uname -m)
if [[ "$ARCH" != "aarch64" ]] && [[ "$ARCH" != "arm64" ]]; then
    echo "Warning: This script is optimized for ARM64 (Raspberry Pi 4/5)"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo "cloudflared not found. Installing..."
    
    # Download and install cloudflared for ARM64
    wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64
    sudo mv cloudflared-linux-arm64 /usr/local/bin/cloudflared
    sudo chmod +x /usr/local/bin/cloudflared
    
    echo "✓ cloudflared installed successfully"
else
    echo "✓ cloudflared is already installed"
fi

echo ""
echo "================================"
echo "Cloudflare Account Setup"
echo "================================"
echo ""
echo "Please follow these steps:"
echo ""
echo "1. Login to Cloudflare Tunnel:"
echo "   Run: cloudflared tunnel login"
echo ""
echo "2. Create a tunnel:"
echo "   Run: cloudflared tunnel create formexus"
echo ""
echo "3. Note your Tunnel ID from the output"
echo ""
echo "4. Update cloudflare-tunnel/config.yml with:"
echo "   - Your tunnel ID"
echo "   - Your domain names"
echo "   - Path to credentials file"
echo ""
echo "5. Create DNS records in Cloudflare Dashboard:"
echo "   - formexus.yourdomain.com -> your-tunnel-id.cfargotunnel.com"
echo "   - api.formexus.yourdomain.com -> your-tunnel-id.cfargotunnel.com"
echo ""
echo "6. Run the tunnel:"
echo "   Run: cloudflared tunnel --config ./cloudflare-tunnel/config.yml run"
echo ""
echo "================================"
echo "Or use Docker Compose (recommended)"
echo "================================"
echo ""
echo "Add this service to docker-compose.yml:"
echo ""
cat << 'EOF'
  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: formexus-tunnel
    restart: unless-stopped
    command: tunnel --config /etc/cloudflared/config.yml run
    volumes:
      - ./cloudflare-tunnel/config.yml:/etc/cloudflared/config.yml:ro
      - ./cloudflare-tunnel/credentials.json:/etc/cloudflared/credentials.json:ro
    networks:
      - formexus-network
    depends_on:
      - frontend
      - backend
EOF
echo ""
echo "================================"
echo "Setup complete!"
echo "================================"
