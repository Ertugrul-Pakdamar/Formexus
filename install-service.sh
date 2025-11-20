#!/bin/bash

# Formexus Auto-Start Installation Script
# This script installs a systemd service to automatically start Formexus on boot

set -e

echo "🚀 Formexus Auto-Start Installer"
echo "================================"
echo ""

# Check if running on Raspberry Pi
if [ ! -f /etc/rpi-issue ]; then
    read -p "⚠️  This doesn't appear to be a Raspberry Pi. Continue anyway? [y/N] " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   curl -fsSL https://get.docker.com | sh"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose plugin not found. Please install it:"
    echo "   sudo apt-get install docker-compose-plugin"
    exit 1
fi

# Detect current user
CURRENT_USER=${USER:-$(whoami)}
CURRENT_DIR=$(pwd)

echo "📋 Configuration:"
echo "   User: $CURRENT_USER"
echo "   Directory: $CURRENT_DIR"
echo ""

# Update service file with current user and directory
TEMP_SERVICE="/tmp/formexus.service"
cat > "$TEMP_SERVICE" << EOF
[Unit]
Description=Formexus Application Stack
Requires=docker.service
After=docker.service network-online.target
Wants=network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$CURRENT_DIR
ExecStartPre=/usr/bin/docker compose down
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
ExecReload=/usr/bin/docker compose restart
TimeoutStartSec=300
TimeoutStopSec=60
Restart=on-failure
RestartSec=10
User=$CURRENT_USER
Group=$CURRENT_USER

[Install]
WantedBy=multi-user.target
EOF

# Install service
echo "📦 Installing systemd service..."
sudo cp "$TEMP_SERVICE" /etc/systemd/system/formexus.service
sudo chmod 644 /etc/systemd/system/formexus.service

# Reload systemd
echo "🔄 Reloading systemd daemon..."
sudo systemctl daemon-reload

# Enable service
echo "✅ Enabling Formexus service..."
sudo systemctl enable formexus.service

# Start service
echo "🚀 Starting Formexus service..."
sudo systemctl start formexus.service

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Useful commands:"
echo "   sudo systemctl status formexus    # Check status"
echo "   sudo systemctl start formexus     # Start service"
echo "   sudo systemctl stop formexus      # Stop service"
echo "   sudo systemctl restart formexus   # Restart service"
echo "   sudo journalctl -u formexus -f    # View logs"
echo ""
echo "🎉 Formexus will now start automatically on system boot!"
