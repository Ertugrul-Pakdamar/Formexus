#!/bin/bash

################################################################################
# Formexus - Raspberry Pi Deployment Script (TEMPLATE)
# deploy-rpi.sh dosyasını bu template'ten oluştur
################################################################################

cat > deploy-rpi.sh << 'SCRIPT_END'
#!/bin/bash

################################################################################
# Formexus - Raspberry Pi Deployment Script
# Bu dosya hassas bilgiler içerir ve .gitignore'da protected
################################################################################

set -e  # Exit on error

# ============================================================================
# HASSAS BİLGİLER - BURAYA GERÇEK DEĞERLERİ GİR
# ============================================================================

# MongoDB Credentials
MONGO_ROOT_USERNAME="admin"
MONGO_ROOT_PASSWORD="BURAYA_MONGO_ŞİFRESİNİ_YAZ"
MONGO_DATABASE="formexus"

# JWT Secret (Generate with: openssl rand -base64 32)
JWT_SECRET="BURAYA_JWT_SECRET_YAZ"

# Cloudflare Tunnel
TUNNEL_ID="BURAYA_TUNNEL_ID_YAZ"
DOMAIN="formexus.net"

# Cloudflare Tunnel Credentials (cert.json içeriği)
# Cloudflare Dashboard > Zero Trust > Networks > Tunnels > [Tunnel Name] > Configure > JSON
TUNNEL_CREDENTIALS='BURAYA_CERT_JSON_İÇERİĞİNİ_YAZ'

# ============================================================================
# RENK KODLARI
# ============================================================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# YARDIMCI FONKSİYONLAR
# ============================================================================

print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_command() {
    if command -v $1 &> /dev/null; then
        print_success "$1 kurulu"
        return 0
    else
        print_warning "$1 bulunamadı, kuruluyor..."
        return 1
    fi
}

# ============================================================================
# KURULUM FONKSİYONLARI
# ============================================================================

install_docker() {
    print_header "Docker ve Docker Compose Kurulumu"
    
    if check_command docker; then
        print_info "Docker zaten kurulu, güncelleniyor..."
    else
        print_info "Docker kuruluyor..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
    fi
    
    # Docker Compose V2
    if docker compose version &> /dev/null; then
        print_success "Docker Compose V2 kurulu"
    else
        print_info "Docker Compose kuruluyor..."
        sudo apt-get update
        sudo apt-get install -y docker-compose-plugin
    fi
    
    print_success "Docker kurulumu tamamlandı"
}

create_env_files() {
    print_header "Environment Dosyaları Oluşturuluyor"
    
    # Root .env
    cat > .env << EOF
# MongoDB Configuration
MONGO_ROOT_USERNAME=${MONGO_ROOT_USERNAME}
MONGO_ROOT_PASSWORD=${MONGO_ROOT_PASSWORD}
MONGO_DATABASE=${MONGO_DATABASE}

# MongoDB URI
MONGODB_URI=mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@mongodb:27017/${MONGO_DATABASE}?authSource=admin

# JWT Configuration
JWT_SECRET=${JWT_SECRET}

# Frontend URL
FRONTEND_URL=https://${DOMAIN}
VITE_API_URL=https://${DOMAIN}/api
EOF
    
    # Backend .env
    cat > backend/.env << EOF
# Server Configuration
PORT=8080
ENV=production

# MongoDB Configuration
MONGODB_URI=mongodb://${MONGO_ROOT_USERNAME}:${MONGO_ROOT_PASSWORD}@mongodb:27017/${MONGO_DATABASE}?authSource=admin
MONGODB_DATABASE=${MONGO_DATABASE}

# JWT Configuration
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRATION=24h

# Frontend URL (for CORS)
FRONTEND_URL=https://${DOMAIN}
EOF
    
    # Frontend .env
    cat > frontend/.env << EOF
VITE_API_URL=https://${DOMAIN}/api
EOF
    
    print_success "Environment dosyaları oluşturuldu"
}

setup_cloudflare_tunnel() {
    print_header "Cloudflare Tunnel Kurulumu"
    
    # Create cloudflare-tunnel directory if not exists
    mkdir -p cloudflare-tunnel
    
    # Create cert.json
    echo "${TUNNEL_CREDENTIALS}" > cloudflare-tunnel/cert.json
    chmod 600 cloudflare-tunnel/cert.json
    
    # Create config.yml
    cat > cloudflare-tunnel/config.yml << EOF
tunnel: ${TUNNEL_ID}
credentials-file: /etc/cloudflared/cert.json

ingress:
  # Backend API - MUST BE FIRST (path matching)
  - hostname: ${DOMAIN}
    path: /api/*
    service: http://backend:8080
  
  # Frontend - www redirect
  - hostname: www.${DOMAIN}
    service: http://frontend:80
  
  # Frontend - main domain (catch-all for this hostname)
  - hostname: ${DOMAIN}
    service: http://frontend:80
  
  # Catch-all rule
  - service: http_status:404
EOF
    
    print_success "Cloudflare Tunnel yapılandırıldı"
}

build_and_start() {
    print_header "Docker Containers Build ve Start"
    
    print_info "Eski containerlar temizleniyor..."
    docker compose down -v 2>/dev/null || true
    
    print_info "Images build ediliyor (bu işlem 5-10 dakika sürebilir)..."
    docker compose build --no-cache
    
    print_info "Containerlar başlatılıyor..."
    docker compose up -d
    
    print_success "Tüm servisler başlatıldı"
}

setup_systemd_service() {
    print_header "Systemd Service Kurulumu"
    
    INSTALL_DIR=$(pwd)
    
    sudo tee /etc/systemd/system/formexus.service > /dev/null << EOF
[Unit]
Description=Formexus Application Stack
Requires=docker.service
After=docker.service network-online.target
Wants=network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=${INSTALL_DIR}
ExecStartPre=/usr/bin/docker compose down
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
ExecReload=/usr/bin/docker compose restart
TimeoutStartSec=600
TimeoutStopSec=60
Restart=on-failure
RestartSec=10
User=${USER}
Group=${USER}

[Install]
WantedBy=multi-user.target
EOF
    
    sudo systemctl daemon-reload
    sudo systemctl enable formexus.service
    
    print_success "Systemd service kuruldu ve etkinleştirildi"
}

check_health() {
    print_header "Sistem Sağlık Kontrolü"
    
    print_info "30 saniye bekleniyor (servisler başlasın)..."
    sleep 30
    
    echo -e "\n${BLUE}Container Durumları:${NC}"
    docker compose ps
    
    echo -e "\n${BLUE}MongoDB Sağlık Kontrolü:${NC}"
    docker exec formexus-mongodb mongosh --eval "db.adminCommand('ping')" --quiet 2>/dev/null && \
        print_success "MongoDB çalışıyor" || print_error "MongoDB hatası"
    
    echo -e "\n${BLUE}Backend Sağlık Kontrolü:${NC}"
    curl -s http://localhost:8080/health > /dev/null && \
        print_success "Backend çalışıyor" || print_warning "Backend henüz hazır değil"
    
    echo -e "\n${BLUE}Frontend Sağlık Kontrolü:${NC}"
    curl -s http://localhost:3000 > /dev/null && \
        print_success "Frontend çalışıyor" || print_warning "Frontend henüz hazır değil"
    
    echo -e "\n${BLUE}Cloudflare Tunnel Kontrolü:${NC}"
    docker logs formexus-cloudflared 2>&1 | tail -5
}

show_completion_message() {
    print_header "KURULUM TAMAMLANDI! 🎉"
    
    cat << EOF
${GREEN}✓ Tüm servisler başarıyla kuruldu ve çalışıyor${NC}

${BLUE}Servis Bilgileri:${NC}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 Public URL       : https://${DOMAIN}
🔗 Frontend (Local) : http://localhost:3000
🔌 Backend (Local)  : http://localhost:8080
📦 MongoDB (Local)  : mongodb://localhost:27017

${BLUE}Kullanışlı Komutlar:${NC}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
make status         - Tüm servislerin durumunu göster
make logs           - Tüm logları takip et
make restart        - Tüm servisleri yeniden başlat
make stop           - Tüm servisleri durdur
make start          - Tüm servisleri başlat
docker compose ps   - Container durumları

${BLUE}Servis Yönetimi:${NC}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
sudo systemctl status formexus    - Servis durumu
sudo systemctl restart formexus   - Servisi yeniden başlat
sudo systemctl stop formexus      - Servisi durdur
sudo systemctl start formexus     - Servisi başlat

${YELLOW}NOT: Sistem yeniden başladığında servisler otomatik olarak başlayacak${NC}

${GREEN}Site canlı: https://${DOMAIN}${NC}
EOF
}

# ============================================================================
# ANA KURULUM AKIŞI
# ============================================================================

main() {
    clear
    
    cat << "EOF"
    
    ███████╗ ██████╗ ██████╗ ███╗   ███╗███████╗██╗  ██╗██╗   ██╗███████╗
    ██╔════╝██╔═══██╗██╔══██╗████╗ ████║██╔════╝╚██╗██╔╝██║   ██║██╔════╝
    █████╗  ██║   ██║██████╔╝██╔████╔██║█████╗   ╚███╔╝ ██║   ██║███████╗
    ██╔══╝  ██║   ██║██╔══██╗██║╚██╔╝██║██╔══╝   ██╔██╗ ██║   ██║╚════██║
    ██║     ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗██╔╝ ██╗╚██████╔╝███████║
    ╚═╝      ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝
    
    Raspberry Pi Deployment Script v1.0
    
EOF
    
    print_info "Kurulum başlıyor..."
    print_warning "Bu işlem 10-15 dakika sürebilir"
    
    # Kurulum adımları
    install_docker
    create_env_files
    setup_cloudflare_tunnel
    build_and_start
    setup_systemd_service
    check_health
    show_completion_message
    
    print_info "\n${YELLOW}Docker grubuna ekleme aktif olması için çıkış yapıp tekrar giriş yapmanız gerekebilir${NC}"
}

# Script'i çalıştır
main "$@"
SCRIPT_END

chmod +x deploy-rpi.sh

echo ""
echo "✓ deploy-rpi.sh oluşturuldu!"
echo ""
echo "ŞİMDİ YAP:"
echo "1. deploy-rpi.sh dosyasını aç"
echo "2. HASSAS BİLGİLER bölümündeki değerleri gerçek verilerle değiştir:"
echo "   - MONGO_ROOT_PASSWORD"
echo "   - JWT_SECRET"
echo "   - TUNNEL_ID"
echo "   - TUNNEL_CREDENTIALS"
echo ""
echo "3. Raspberry Pi'da çalıştır:"
echo "   chmod +x deploy-rpi.sh"
echo "   ./deploy-rpi.sh"
echo ""
