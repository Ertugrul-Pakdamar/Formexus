#!/bin/bash

# Formexus Deployment Script for Raspberry Pi
# This script automates the deployment process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo ""
echo "================================"
echo "   Formexus Deployment Script   "
echo "     Raspberry Pi Edition       "
echo "================================"
echo ""

# Check if running on ARM64
ARCH=$(uname -m)
print_info "Detected architecture: $ARCH"
if [[ "$ARCH" != "aarch64" ]] && [[ "$ARCH" != "arm64" ]]; then
    print_warning "This script is optimized for ARM64 (Raspberry Pi 4/5)"
fi

# Check system requirements
print_info "Checking system requirements..."

# Check Docker
if ! command_exists docker; then
    print_error "Docker is not installed"
    print_info "Install Docker with: curl -fsSL https://get.docker.com | sh"
    exit 1
fi
print_success "Docker is installed"

# Check Docker Compose
if ! command_exists docker-compose && ! docker compose version >/dev/null 2>&1; then
    print_error "Docker Compose is not installed"
    print_info "Install Docker Compose plugin with: sudo apt-get install docker-compose-plugin"
    exit 1
fi
print_success "Docker Compose is installed"

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found"
    if [ -f .env.example ]; then
        print_info "Creating .env file from .env.example..."
        cp .env.example .env
        print_warning "Please edit .env file and update the values before continuing"
        print_info "Required changes:"
        echo "  - MONGO_ROOT_PASSWORD"
        echo "  - JWT_SECRET"
        echo "  - FRONTEND_URL (your domain)"
        echo "  - VITE_API_URL (your API domain)"
        echo ""
        read -p "Press Enter after updating .env file..." 
    else
        print_error ".env.example not found. Cannot create .env file."
        exit 1
    fi
else
    print_success ".env file found"
fi

# Load environment variables
source .env

# Validate required environment variables
print_info "Validating environment variables..."

if [ "$MONGO_ROOT_PASSWORD" = "changeme" ] || [ "$MONGO_ROOT_PASSWORD" = "your_strong_password_here" ]; then
    print_error "Please change MONGO_ROOT_PASSWORD in .env file"
    exit 1
fi

if [ "$JWT_SECRET" = "your_super_secret_jwt_key_min_32_chars_please_change_this" ]; then
    print_error "Please change JWT_SECRET in .env file"
    exit 1
fi

print_success "Environment variables validated"

# Ask deployment mode
echo ""
print_info "Select deployment mode:"
echo "1) Full deployment (MongoDB + Backend + Frontend)"
echo "2) Backend + Frontend only (use MongoDB Atlas)"
echo "3) Update only (rebuild and restart services)"
read -p "Enter choice [1-3]: " DEPLOY_MODE

case $DEPLOY_MODE in
    1)
        SERVICES="mongodb backend frontend"
        print_info "Full deployment selected"
        ;;
    2)
        SERVICES="backend frontend"
        print_info "Backend + Frontend deployment selected (external MongoDB)"
        print_warning "Make sure MONGODB_URI in .env points to MongoDB Atlas"
        ;;
    3)
        print_info "Update mode selected"
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

# Stop existing containers
if docker ps -a | grep -q formexus; then
    print_info "Stopping existing containers..."
    docker-compose down
    print_success "Containers stopped"
fi

# Build and start services
if [ "$DEPLOY_MODE" = "3" ]; then
    print_info "Rebuilding and restarting services..."
    docker-compose up -d --build
else
    print_info "Building Docker images..."
    docker-compose build $SERVICES
    
    print_info "Starting services..."
    docker-compose up -d $SERVICES
fi

# Wait for services to be healthy
print_info "Waiting for services to be healthy..."
sleep 10

# Check service health
print_info "Checking service health..."

if docker ps | grep -q formexus-mongodb && [ "$DEPLOY_MODE" = "1" ]; then
    if docker exec formexus-mongodb mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
        print_success "MongoDB is healthy"
    else
        print_error "MongoDB is not responding"
    fi
fi

if docker ps | grep -q formexus-backend; then
    if curl -s http://localhost:8080/health >/dev/null 2>&1; then
        print_success "Backend is healthy"
    else
        print_warning "Backend health check failed (it may still be starting)"
    fi
fi

if docker ps | grep -q formexus-frontend; then
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        print_success "Frontend is healthy"
    else
        print_warning "Frontend health check failed (it may still be starting)"
    fi
fi

# Show running containers
echo ""
print_info "Running containers:"
docker-compose ps

# Show logs
echo ""
print_info "Recent logs:"
docker-compose logs --tail=20

# Display access information
echo ""
echo "================================"
print_success "Deployment completed!"
echo "================================"
echo ""
print_info "Access your application:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:8080"
if [ "$DEPLOY_MODE" = "1" ]; then
    echo "  - MongoDB: mongodb://localhost:27017"
fi
echo ""
print_info "Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop services: docker-compose down"
echo "  - Restart services: docker-compose restart"
echo "  - Update services: ./deploy.sh (choose option 3)"
echo ""
print_warning "Next steps:"
echo "  1. Set up Cloudflare Tunnel (see cloudflare-tunnel/README.md)"
echo "  2. Configure your domain DNS records"
echo "  3. Update .env with production URLs"
echo "  4. Set up SSL certificates (handled by Cloudflare)"
echo ""
print_info "For Cloudflare Tunnel setup, run:"
echo "  cd cloudflare-tunnel && ./setup-tunnel.sh"
echo ""
