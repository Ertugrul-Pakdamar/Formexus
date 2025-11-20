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

### Prerequisites

- **Raspberry Pi 4/5** (2GB+ RAM recommended)
- **Raspberry Pi OS** (64-bit)
- **Docker & Docker Compose**
- **Cloudflare Account** (free tier works)
- **Domain name** (optional, can use Cloudflare's subdomain)

### Quick Setup

```bash
# 1. Clone repository
git clone https://github.com/Ertugrul-Pakdamar/Formexus.git
cd Formexus

# 2. Run setup script
chmod +x setup.sh
./setup.sh

# 3. Edit .env file and update your domain
nano .env

# 4. Deploy the application
./deploy.sh

# 5. Setup Cloudflare Tunnel
cd cloudflare-tunnel
./setup-tunnel.sh
```

### Manual Setup

#### 1. Install Docker (if not installed)

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Log out and back in
```

#### 2. Install Docker Compose

```bash
sudo apt-get update
sudo apt-get install -y docker-compose-plugin
```

#### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit with your settings
nano .env
```

**Required .env updates:**

- `MONGO_ROOT_PASSWORD` - Strong password for MongoDB
- `JWT_SECRET` - Random string (min 32 characters)
- `FRONTEND_URL` - Your domain (e.g., https://formexus.yourdomain.com)
- `VITE_API_URL` - Your API domain (e.g., https://api.formexus.yourdomain.com)

#### 4. Deploy with Docker Compose

```bash
# Full deployment (MongoDB + Backend + Frontend)
docker-compose up -d

# Or use the deployment script
./deploy.sh
```

#### 5. Setup Cloudflare Tunnel

```bash
# Install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64
sudo mv cloudflared-linux-arm64 /usr/local/bin/cloudflared
sudo chmod +x /usr/local/bin/cloudflared

# Login to Cloudflare
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create formexus

# Note your tunnel ID and update cloudflare-tunnel/config.yml
nano cloudflare-tunnel/config.yml

# Run tunnel
cloudflared tunnel --config ./cloudflare-tunnel/config.yml run
```

See [cloudflare-tunnel/README.md](cloudflare-tunnel/README.md) for detailed Cloudflare setup.

### System Requirements

| Component | Minimum                | Recommended |
| --------- | ---------------------- | ----------- |
| RAM       | 2GB                    | 4GB+        |
| Storage   | 8GB                    | 16GB+       |
| CPU       | 4 cores                | 4 cores     |
| OS        | Raspberry Pi OS 64-bit | Latest      |

### Architecture on Raspberry Pi

```
Internet → Cloudflare Tunnel → Raspberry Pi
                                    ├─ Frontend (Port 3000)
                                    ├─ Backend (Port 8080)
                                    └─ MongoDB (Port 27017)
```

### Advantages of Raspberry Pi Deployment

- 🏠 **Self-hosted** - Full control over your data
- 💰 **Cost-effective** - No monthly hosting fees
- 🔒 **Privacy** - Data stays on your device
- ⚡ **Fast** - No cold starts like serverless
- 🌍 **Global Access** - Via Cloudflare Tunnel
- 🔐 **Secure** - HTTPS via Cloudflare

### Maintenance

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Update application
git pull
./deploy.sh  # Choose option 3 (Update only)

# Backup MongoDB
docker exec formexus-mongodb mongodump --out /data/backup

# Stop all services
docker-compose down
```

---

## ☁️ Cloud Deployment (Alternative)

For traditional cloud deployment on platforms like Render.com:

### Prerequisites

- **Node.js** 18+ and npm
- **Go** 1.21+
- **MongoDB Atlas** account (free tier)
- **Git**

### Installation

```bash
# 1. Clone repository
git clone https://github.com/Ertugrul-Pakdamar/Formexus.git
cd Formexus

# 2. Setup backend
cd backend
cp .env.example .env
# Edit .env and configure your settings
go mod download
make run

# 3. Setup frontend (new terminal)
cd frontend
cp .env.example .env
# Edit .env and add VITE_API_URL=http://localhost:8080
npm install
npm run dev
```

### Current Production Deployment

- **Frontend:** [https://formexus-51vy.onrender.com/](https://formexus-51vy.onrender.com/)
- **Backend API:** [https://formexus-backend-s6vu.onrender.com/health](https://formexus-backend-s6vu.onrender.com/health)
- **Database:** MongoDB Atlas (Free M0 Cluster)

_Note: Cloud deployment on free tier may have cold starts (30-60 seconds on first visit)._

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

### Local Development (without Docker)

```bash
# Backend
cd backend
make run

# Frontend (new terminal)
cd frontend
npm run dev
```

### With Docker (full stack)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Environment Setup

Both backend and frontend need environment variables. Copy the example files and configure:

**Backend (.env):**

```env
# MongoDB Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_strong_password
MONGO_DATABASE=formexus
MONGODB_URI=mongodb://admin:password@mongodb:27017

# Server Configuration
PORT=8080
JWT_SECRET=your_secret_key_min_32_chars
FRONTEND_URL=https://formexus.yourdomain.com

# For MongoDB Atlas (alternative)
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/formexus
```

**Frontend (.env):**

```env
# API Configuration
VITE_API_URL=https://api.formexus.yourdomain.com

# For local development
# VITE_API_URL=http://localhost:8080
```

**⚠️ Important:** Never commit `.env` files to Git! They contain sensitive data.

---

## 📂 Project Structure

```
Formexus/
├── frontend/                      # React frontend application
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   ├── pages/                 # Page components
│   │   ├── context/               # Context providers
│   │   └── services/              # API services
│   ├── Dockerfile                 # Frontend Docker build
│   ├── nginx.conf                 # Nginx configuration
│   └── package.json
│
├── backend/                       # Go backend application
│   ├── cmd/server/                # Main entry point
│   ├── internal/
│   │   ├── handler/               # HTTP handlers
│   │   ├── middleware/            # Auth, CORS, logging
│   │   ├── repository/            # Database layer
│   │   └── service/               # Business logic
│   ├── pkg/utils/                 # Utilities
│   ├── Dockerfile                 # Backend Docker build
│   └── Makefile
│
├── cloudflare-tunnel/             # Cloudflare Tunnel setup
│   ├── config.yml                 # Tunnel configuration
│   ├── setup-tunnel.sh            # Setup script
│   └── README.md                  # Tunnel documentation
│
├── mongodb/                       # MongoDB configuration
│   ├── init-mongo.js              # Database initialization
│   └── README.md                  # MongoDB documentation
│
├── docker-compose.yml             # Docker orchestration
├── .env.example                   # Environment template
├── setup.sh                       # Quick setup script
├── deploy.sh                      # Deployment script
└── README.md                      # This file
```

---

## 🔧 Configuration

### Backend Environment Variables

See `.env.example` for full configuration options:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/formexus
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=changeme

# Server
PORT=8080
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000

# Optional
TZ=Europe/Istanbul
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:8080
```

### Cloudflare Tunnel Configuration

Edit `cloudflare-tunnel/config.yml`:

```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /path/to/credentials.json

ingress:
  - hostname: formexus.yourdomain.com
    service: http://localhost:3000
  - hostname: api.formexus.yourdomain.com
    service: http://localhost:8080
  - service: http_status:404
```

---

## 🔒 Security Features

Formexus implements multiple security layers:

### Authentication & Authorization

- JWT-based authentication
- bcrypt password hashing (cost factor: 12)
- Protected routes with middleware
- Secure session management

### Input Validation & Sanitization

- XSS protection (HTML escaping, script tag removal)
- Input sanitization on all user inputs
- Email validation with regex
- Name validation (alphanumeric + spaces only)

### Security Headers

- Content Security Policy (CSP)
- X-XSS-Protection
- X-Frame-Options (SAMEORIGIN)
- X-Content-Type-Options (nosniff)
- Referrer-Policy (strict-origin-when-cross-origin)

### Network Security

- CORS configuration
- HTTPS via Cloudflare Tunnel
- Rate limiting ready
- Environment variable protection

### Security Score: 9.2/10

See [SECURITY_REPORT.md](SECURITY_REPORT.md) for detailed security audit.

---

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # Login user
GET    /api/auth/me           # Get current user
```

### Form Endpoints (Protected)

```
POST   /api/forms             # Create new form
GET    /api/forms             # Get user's forms
GET    /api/forms/id/:id      # Get form by ID
PUT    /api/forms/:id         # Update form
DELETE /api/forms/:id         # Delete form
POST   /api/forms/:id/duplicate  # Duplicate form
```

### Public Form Endpoints

```
GET    /api/forms/:slug       # Get public form
POST   /api/forms/:slug/submit  # Submit form response
```

### Submission Endpoints (Protected)

```
GET    /api/forms/:id/submissions  # Get form submissions
GET    /api/forms/:id/stats        # Get form statistics
DELETE /api/submissions/:id        # Delete submission
```

---

## 🎯 Roadmap

- [ ] **Drag & Drop Field Reordering** - Visual field arrangement
- [ ] **Conditional Logic** - Show/hide fields based on answers
- [ ] **File Upload** - Allow users to upload files
- [ ] **Email Notifications** - Send notifications on form submission
- [ ] **Webhooks** - Integration with external services
- [ ] **Team Collaboration** - Share forms with team members
- [ ] **Advanced Analytics** - Charts, graphs, and insights
- [ ] **Custom Domains** - Use your own domain for forms
- [ ] **White Label** - Remove Formexus branding
- [ ] **API Access** - Programmatic form management

---

## ☁️ Deployment Options Comparison

| Feature         | Raspberry Pi + Cloudflare | Cloud (Render/Vercel) |
| --------------- | ------------------------- | --------------------- |
| **Cost**        | One-time (~$50)           | $0-20/month           |
| **Control**     | Full control              | Limited               |
| **Privacy**     | Complete                  | Shared infrastructure |
| **Cold Starts** | None                      | Yes (free tier)       |
| **Scalability** | Limited                   | High                  |
| **Maintenance** | Self-managed              | Managed               |
| **Setup Time**  | 1-2 hours                 | 30 minutes            |
| **Best For**    | Personal/Small team       | Production/Scale      |

### Raspberry Pi Deployment

**Pros:**

- 🏠 Full data control and privacy
- 💰 No monthly fees
- ⚡ No cold starts
- 🔒 Data stays local
- 🌍 Global access via Cloudflare

**Cons:**

- 🔧 Requires hardware
- 🛠️ Self-maintenance
- 📊 Limited resources
- 💡 Needs stable power/internet

**Live Example:**

- See production deployment at: [https://formexus-51vy.onrender.com/](https://formexus-51vy.onrender.com/)
- Backend API: [https://formexus-backend-s6vu.onrender.com/health](https://formexus-backend-s6vu.onrender.com/health)

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
