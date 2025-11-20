# Cloudflare Tunnel Configuration

This directory contains configuration files for Cloudflare Tunnel.

## Quick Start

### Option 1: Standalone Cloudflared

1. Run the setup script:

```bash
chmod +x setup-tunnel.sh
./setup-tunnel.sh
```

2. Login to Cloudflare:

```bash
cloudflared tunnel login
```

3. Create a tunnel:

```bash
cloudflared tunnel create formexus
```

4. Update `config.yml` with your tunnel ID and domain

5. Create DNS records in Cloudflare Dashboard:

   - `formexus.yourdomain.com` → `<tunnel-id>.cfargotunnel.com` (CNAME)
   - `api.formexus.yourdomain.com` → `<tunnel-id>.cfargotunnel.com` (CNAME)

6. Run the tunnel:

```bash
cloudflared tunnel --config ./config.yml run
```

### Option 2: Docker Compose (Recommended)

1. Follow steps 1-5 from Option 1

2. Copy your credentials file to this directory:

```bash
cp ~/.cloudflared/<tunnel-id>.json ./credentials.json
```

3. Update `config.yml` with correct paths

4. Add cloudflared service to `docker-compose.yml` (see setup-tunnel.sh)

5. Start all services:

```bash
docker-compose up -d
```

## Files

- `config.yml` - Main tunnel configuration
- `setup-tunnel.sh` - Setup script
- `credentials.json` - Tunnel credentials (created after tunnel creation)
- `.gitignore` - Prevents credentials from being committed

## Important Notes

- Never commit `credentials.json` to git
- Update domain names in `config.yml` before running
- Ensure services are running before starting tunnel
- Use systemd service for auto-start on boot (see below)

## Systemd Service (Auto-start on boot)

Create `/etc/systemd/system/cloudflared.service`:

```ini
[Unit]
Description=Cloudflare Tunnel
After=network.target

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
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
sudo systemctl status cloudflared
```
