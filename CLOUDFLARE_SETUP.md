# Cloudflare Tunnel Setup Guide

## Adım 1: Cloudflare Dashboard

```
1. https://dash.cloudflare.com giriş yap
2. Domain seç: formexus.net
3. Sol menü: Traffic > Cloudflare Tunnel
4. "Create a tunnel" tıkla
5. Tunnel name: formexus-tunnel
6. "Save tunnel" tıkla
```

## Adım 2: Connector Token Al

```
7. Token kopyala (eyJ... ile başlayan uzun string)
8. Token'ı .env dosyasına ekle:
   TUNNEL_TOKEN=eyJ...
```

## Adım 3: Public Hostname Ayarla

```
9. "Public Hostname" tab
10. "Add a public hostname" tıkla

Backend API:
- Subdomain: (boş)
- Domain: formexus.net
- Path: /api/*
- Type: HTTP
- URL: backend:8080

Frontend:
- Subdomain: (boş)
- Domain: formexus.net
- Path: (boş)
- Type: HTTP
- URL: frontend:80

WWW Redirect:
- Subdomain: www
- Domain: formexus.net
- Path: (boş)
- Type: HTTP
- URL: frontend:80
```

## Adım 4: .env Dosyası

Root dizinde .env oluştur:

```bash
# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=GÜÇLÜ_ŞİFRE
MONGO_DATABASE=formexus
MONGODB_URI=mongodb://admin:GÜÇLÜ_ŞİFRE@mongodb:27017/formexus?authSource=admin

# JWT
JWT_SECRET=JWT_SECRET_BURAYA

# Frontend
FRONTEND_URL=https://formexus.net
VITE_API_URL=https://formexus.net/api

# Cloudflare Tunnel Token
TUNNEL_TOKEN=eyJ...BURAYA_TOKEN
```

## Adım 5: Raspberry Pi'da Çalıştır

```bash
git clone https://github.com/Ertugrul-Pakdamar/Formexus.git
cd Formexus
nano .env  # Token ve şifreleri ekle
docker compose up -d
```

## Adım 6: Kontrol

```bash
docker compose ps
curl https://formexus.net
```
