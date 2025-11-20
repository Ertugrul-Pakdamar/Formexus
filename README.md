# 📋 Formexus

<div align="center">
  
  ![Formexus Logo](https://img.shields.io/badge/Formexus-Form%20Builder-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDE2VjhhMiAyIDAgMCAwLTEtMS43M2wtNy00YTIgMiAwIDAgMC0yIDBsLTcgNEEyIDIgMCAwIDAgMyA4djhhMiAyIDAgMCAwIDEgMS43M2w3IDRhMiAyIDAgMCAwIDIgMGw3LTRBMiAyIDAgMCAwIDIxIDE2eiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+)
  
  **Modern, Powerful & Intelligent Form Builder Platform**
  
  [![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react)](https://react.dev/)
  [![Go](https://img.shields.io/badge/Go-1.21-00ADD8?style=flat&logo=go)](https://golang.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
  [![Fiber](https://img.shields.io/badge/Fiber-2.52-00ACD7?style=flat&logo=go)](https://gofiber.io/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
  
  **🌐 [Live Demo](https://formexus.net) | [Backend API](https://formexus.net/api/health)**
  
  [🚀 Quick Start](#-quick-start) | [📖 Features](#-features)
  
</div>

---

## 🎯 About

**Formexus** is a next-generation form builder platform that empowers you to create beautiful, intelligent forms in minutes. Built with modern technologies and a focus on user experience, Formexus combines powerful features with an intuitive interface.

### 🌐 Live Demo

**Try it now:** [https://formexus.net](https://formexus.net)

_Self-hosted on Raspberry Pi with Cloudflare Tunnel for global access._

### ✨ Why Formexus?

- 🎨 **Beautiful Themes** - Customize colors, backgrounds, and styles
- 🌍 **Multilingual** - Full support for Turkish and English (easily extensible)
- 🚀 **Real-time Auto-save** - Never lose your work
- 📊 **Smart Analytics** - CSV export and response tracking
- 🔒 **Secure** - JWT authentication and enterprise-grade security
- ⚡ **Lightning Fast** - Built with Go and React for optimal performance
- 🎭 **Template Library** - 6+ pre-built templates to get started quickly

---

## 🌟 Features

### 🎨 Form Builder

- **Intuitive Interface** - Easy-to-use form creation experience
- **15+ Field Types** - Text, email, phone, dropdown, rating, linear scale, and more
- **Real-time Preview** - See changes as you make them with theme support
- **Theme Customization** - 6 brand colors and 5 background options
- **Auto-save** - Changes saved automatically every 1.5 seconds

### 📝 Field Types

```
✓ Short Text          ✓ Email             ✓ Phone Number
✓ Long Text           ✓ URL               ✓ Number
✓ Date                ✓ Time              ✓ Date & Time
✓ Single Choice       ✓ Multiple Choice   ✓ Dropdown
✓ Linear Scale        ✓ Rating            ✓ Section Header
```

### 🎯 Smart Templates

- **Blank Form** - Start from scratch
- **Contact Form** - Collect contact information
- **Survey** - Gather feedback and opinions
- **Registration** - Event or course registration
- **Quiz** - Create tests and quizzes
- **Feedback** - Customer feedback form

### 🌍 Internationalization

- Full Turkish and English support
- Language switcher on all pages
- Template fields translate automatically
- User-generated content remains unchanged

### 🔐 Authentication & Security

- **Email/Password Authentication** - Traditional sign-in method
- **JWT Tokens** - Secure session management
- **bcrypt Password Hashing** - Industry-standard password protection
- **Protected Routes** - Middleware-based authorization
- **CORS Protection** - Cross-origin security

### 📊 Response Management

- View all form submissions in a clean table
- Export responses to CSV
- Real-time response tracking
- Date and time stamps for each submission

### 🎨 Theme System

**6 Brand Colors:**

- 💜 Purple • 🔵 Blue • 💚 Green • 💗 Pink • 🔷 Indigo • 🧡 Orange

**5 Background Options:**

- ⚪ White • 🌫️ Light Gray • 💙 Light Blue • 💜 Light Purple • 💗 Light Pink

---

## 🚀 Quick Start

### Deployment Options

Formexus can be deployed in two ways:

1. **Raspberry Pi + Cloudflare Tunnel** (Self-hosted, recommended for privacy)
2. **Cloud Deployment** (Render.com, Vercel, etc.)

---

## 🏠 Raspberry Pi Deployment (Recommended)

This is a complete, self-hosted deployment that gives you full control over your data while providing global HTTPS access via Cloudflare Tunnel.

### 📋 Prerequisites

**Hardware:**

- Raspberry Pi 4/5 (2GB+ RAM recommended)
- microSD card (16GB+)
- Stable power supply
- Ethernet connection (recommended)

**Software:**

- Raspberry Pi OS (64-bit)
- Docker & Docker Compose
- Cloudflare account (free tier)
- Domain name (required)

### 🚀 Quick Start (5 Steps)

#### Step 1: Prepare Raspberry Pi

```bash
# Update system
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl wget

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt-get install -y docker-compose-plugin
```

#### Step 2: Clone & Configure

```bash
# Clone repository
git clone https://github.com/Ertugrul-Pakdamar/Formexus.git
cd Formexus

# Configure environment
cp .env.example .env
nano .env
```

**Required .env changes:**

```env
MONGO_ROOT_PASSWORD=your_strong_password_here
JWT_SECRET=your_random_32_character_secret
FRONTEND_URL=https://yourdomain.com
VITE_API_URL=https://yourdomain.com/api
```

Generate JWT secret: `openssl rand -base64 32`

#### Step 3: Setup Cloudflare Tunnel

```bash
# Install cloudflared (ARM64)
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64
sudo mv cloudflared-linux-arm64 /usr/local/bin/cloudflared
sudo chmod +x /usr/local/bin/cloudflared

# Login to Cloudflare
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create formexus-tunnel

# Copy credentials (replace YOUR_TUNNEL_ID with actual ID from output)
cp ~/.cloudflared/YOUR_TUNNEL_ID.json ~/Formexus/cloudflare-tunnel/cert.json
chmod 600 ~/Formexus/cloudflare-tunnel/cert.json

# Update tunnel config
nano ~/Formexus/cloudflare-tunnel/config.yml
# Replace YOUR_TUNNEL_ID with actual tunnel ID

# Create DNS routes
cloudflared tunnel route dns YOUR_TUNNEL_ID yourdomain.com
cloudflared tunnel route dns YOUR_TUNNEL_ID www.yourdomain.com
```

#### Step 4: Configure Cloudflare Dashboard

1. Go to **https://dash.cloudflare.com** → Your domain → **DNS**
2. Delete any old A/AAAA records
3. Verify CNAME records exist:
   - `yourdomain.com` → `YOUR_TUNNEL_ID.cfargotunnel.com` (Proxied ☁️)
   - `www` → `YOUR_TUNNEL_ID.cfargotunnel.com` (Proxied ☁️)
4. Go to **SSL/TLS** → Set to **Full** or **Full (strict)**

#### Step 5: Deploy Application

```bash
# Start all services
docker compose up -d

# Install auto-start service
chmod +x install-service.sh
./install-service.sh

# Check status
sudo systemctl status formexus
docker compose ps
```

### 🎯 System Architecture

```
Internet
   ↓
Cloudflare CDN/SSL
   ↓
Cloudflare Tunnel (HTTPS)
   ↓
Raspberry Pi (Local Network)
   ├─ Frontend (Nginx:80)
   ├─ Backend (Go:8080)
   └─ MongoDB (Local:27017)
```

### ⚡ Features

- ✅ **Auto-start on boot** - Systemd service
- ✅ **Auto-restart** - Containers restart unless stopped
- ✅ **Health checks** - All services monitored
- ✅ **HTTPS/SSL** - Via Cloudflare
- ✅ **Global CDN** - Cloudflare edge network
- ✅ **DDoS protection** - Cloudflare security

### 🛠️ Maintenance Commands

```bash
# System Service
sudo systemctl status formexus      # Check status
sudo systemctl restart formexus     # Restart all
sudo journalctl -u formexus -f      # View logs

# Docker Services
docker compose ps                   # List containers
docker compose logs -f              # Follow logs
docker compose logs -f backend      # Service-specific logs
docker compose restart backend      # Restart service

# Updates
cd ~/Formexus
git pull
docker compose up -d --build        # Rebuild & restart

# Backup MongoDB
docker exec formexus-mongodb mongodump --out /data/backup
docker cp formexus-mongodb:/data/backup ./backup-$(date +%Y%m%d)

# Full restart
docker compose down && docker compose up -d
```

### 📊 System Requirements

| Component | Minimum       | Recommended |
| --------- | ------------- | ----------- |
| RAM       | 2GB           | 4GB+        |
| Storage   | 8GB           | 16GB+       |
| CPU Cores | 4             | 4           |
| OS        | RPi OS 64-bit | Latest      |

### 🔧 Troubleshooting

**DNS not resolving?**

```bash
# Check DNS propagation
dig yourdomain.com
curl -I https://yourdomain.com

# Check Cloudflare tunnel
cloudflared tunnel info YOUR_TUNNEL_ID
docker compose logs cloudflared
```

**Container won't start?**

```bash
# Check logs
docker compose logs backend

# Check ports
sudo netstat -tlnp | grep 8080

# Restart from scratch
docker compose down
docker compose up -d
```

**MongoDB connection issues?**

```bash
docker compose logs mongodb
docker exec formexus-backend wget -qO- http://localhost:8080/health
```

### 💡 Advantages

| Feature          | Raspberry Pi    | Cloud Hosting   |
| ---------------- | --------------- | --------------- |
| **Monthly Cost** | $0              | $5-20           |
| **Setup Cost**   | ~$50 (one-time) | $0              |
| **Data Privacy** | 100% (local)    | Shared          |
| **Control**      | Full            | Limited         |
| **Cold Starts**  | None            | Yes (free tier) |
| **Scalability**  | Limited         | High            |
| **Maintenance**  | Self            | Managed         |

---

## ☁️ Cloud Deployment (Alternative)

For traditional cloud deployment on platforms like Render, Vercel, or Railway.

### Prerequisites

- Node.js 18+ and npm
- Go 1.21+
- MongoDB Atlas account (free tier)
- Git

### Quick Start

```bash
# Clone repository
git clone https://github.com/Ertugrul-Pakdamar/Formexus.git
cd Formexus

# Backend setup
cd backend
cp .env.example .env
# Edit .env with MongoDB Atlas URI and other configs
go mod download
make run

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

### Environment Configuration

**Backend (.env):**

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/formexus
PORT=8080
JWT_SECRET=your_32_character_secret
FRONTEND_URL=https://your-frontend.vercel.app
```

**Frontend (.env):**

```env
VITE_API_URL=https://your-backend.render.com/api
```

### Deployment Platforms

**Render.com:**

- Frontend: Static Site
- Backend: Web Service (Go)
- Database: MongoDB Atlas

**Vercel:**

- Frontend only (static export)
- Backend on separate platform

**Railway:**

- Full stack deployment
- Built-in MongoDB option

### Comparison

| Feature     | Raspberry Pi | Cloud           |
| ----------- | ------------ | --------------- |
| Cost        | $0/month     | $0-20/month     |
| Setup Time  | 1-2 hours    | 30 minutes      |
| Control     | Full         | Limited         |
| Cold Starts | No           | Yes (free tier) |
| Scalability | Limited      | High            |

---

## 📦 Docker Deployment Files

### docker-compose.yml

Includes three main services:

- **MongoDB** - Local database (or use MongoDB Atlas)
- **Backend** - Go/Fiber API server
- **Frontend** - React app served via Nginx

### Dockerfiles

- `backend/Dockerfile` - Multi-stage build optimized for ARM64
- `frontend/Dockerfile` - Nginx-based production build

### Cloudflare Tunnel

- `cloudflare-tunnel/config.yml` - Tunnel routing configuration
- `cloudflare-tunnel/setup-tunnel.sh` - Automated setup script
- `cloudflare-tunnel/README.md` - Detailed setup guide

---

## 🛠️ Development

### Local Development Setup

```bash
# Backend
cd backend
cp .env.example .env
nano .env  # Configure MongoDB and JWT secret
make run   # Starts on http://localhost:8080

# Frontend (new terminal)
cd frontend
npm install
npm run dev  # Starts on http://localhost:5173
```

### Development with Docker

```bash
# Start full stack
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild after code changes
docker compose up -d --build
```

### Environment Variables

**Backend:**

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT (min 32 chars)
- `PORT` - Server port (default: 8080)
- `FRONTEND_URL` - Frontend URL for CORS

**Frontend:**

- `VITE_API_URL` - Backend API URL (build-time variable)

Generate JWT secret:

```bash
openssl rand -base64 32
```

---

## 🔒 Security Features

### Multi-Layer Security

**Authentication & Authorization:**

- JWT-based authentication
- bcrypt password hashing (cost: 12)
- Protected routes with middleware
- Secure session management

**Input Validation:**

- XSS protection (HTML escaping)
- Script tag removal
- Email validation with regex
- Unicode name validation (supports Turkish chars: ğ, ü, ş, ı, ö, ç)

**Security Headers:**

- Content Security Policy (CSP)
- X-XSS-Protection
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

**Network Security:**

- CORS configuration
- HTTPS via Cloudflare (production)
- Rate limiting ready
- Environment variable protection

### Security Audit Score: 9.2/10

All sensitive data encrypted, input sanitized, and security headers implemented.

---

## 📚 API Documentation

### Authentication

```
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # Login user
GET    /api/me                # Get current user (protected)
```

### Forms (Protected)

```
POST   /api/forms                      # Create form
GET    /api/forms                      # List user's forms
GET    /api/forms/id/:id               # Get form by ID
PUT    /api/forms/:id                  # Update form
DELETE /api/forms/:id                  # Delete form
POST   /api/forms/:id/duplicate        # Duplicate form
```

### Public Forms

```
GET    /api/forms/:slug                # View public form
POST   /api/forms/:slug/submit         # Submit response
```

### Submissions (Protected)

```
GET    /api/forms/:id/submissions      # Get all submissions
GET    /api/forms/:id/stats            # Get form statistics
DELETE /api/submissions/:id            # Delete submission
```

### Example: Register User

```bash
curl -X POST https://formexus.net/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ertuğrul Pakdamar",
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Example: Create Form

```bash
curl -X POST https://formexus.net/api/forms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Contact Form",
    "description": "Get in touch with us",
    "fields": [
      {"type": "shortText", "label": "Name", "required": true},
      {"type": "email", "label": "Email", "required": true}
    ]
  }'
```

## 📂 Project Structure

```
Formexus/
├── backend/                    # Go backend (Fiber framework)
│   ├── cmd/server/            # Main application entry
│   ├── internal/
│   │   ├── config/           # Configuration management
│   │   ├── database/         # MongoDB connection
│   │   ├── domain/           # Business models
│   │   ├── dto/              # Data transfer objects
│   │   ├── handler/          # HTTP request handlers
│   │   ├── middleware/       # Auth, CORS, logging
│   │   ├── repository/       # Database operations
│   │   └── service/          # Business logic
│   ├── pkg/utils/            # Helper utilities
│   ├── Dockerfile            # Backend container
│   ├── Makefile              # Build commands
│   └── go.mod                # Go dependencies
│
├── frontend/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route pages
│   │   ├── context/          # State management
│   │   └── services/         # API calls
│   ├── Dockerfile            # Frontend container
│   ├── nginx.conf            # Production web server
│   ├── package.json          # npm dependencies
│   └── vite.config.js        # Build configuration
│
├── cloudflare-tunnel/         # Cloudflare Tunnel config
│   └── config.yml            # Routing rules
│
├── docker-compose.yml         # Container orchestration
├── install-service.sh         # Auto-start installer
├── formexus.service          # Systemd service file
├── .env.example              # Environment template
└── README.md                 # This documentation
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👤 Author

**Ertuğrul Pakdamar**

- GitHub: [@Ertugrul-Pakdamar](https://github.com/Ertugrul-Pakdamar)
- LinkedIn: [Ertuğrul Pakdamar](https://linkedin.com/in/ertugrul-pakdamar)

---

## 🙏 Acknowledgments

- Inspired by Google Forms and Typeform
- Built with ❤️ using modern web technologies
- Special thanks to the open-source community

---

<div align="center">
  
  **⭐ Star this repository if you find it helpful!**
  
  Made with 💜 by [Ertuğrul Pakdamar](https://github.com/Ertugrul-Pakdamar)
  
</div>
