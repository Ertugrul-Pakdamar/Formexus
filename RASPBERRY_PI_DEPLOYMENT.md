# 🚀 Raspberry Pi Deployment Guide

## Hızlı Özet

1. **Raspberry Pi'da projeyi klonla**
2. **deploy-rpi.sh oluştur ve hassas bilgileri ekle**
3. **Script'i çalıştır** (10-15 dakika)

---

## 📝 Detaylı Adımlar

### 1️⃣ Raspberry Pi Hazırlığı

Raspberry Pi'nızı sıfırladıysanız, önce SSH ile bağlanın:

```bash
ssh pi@192.168.1.104  # veya RPi'nizin IP'si
# Şifre: 265389 (veya varsayılan: raspberry)
```

### 2️⃣ Projeyi Klonla

```bash
# Önce eski dosyaları temizle (opsiyonel)
cd ~
sudo rm -rf Formexus Formexus.backup.*

# GitHub'dan projeyi klonla
git clone https://github.com/Ertugrul-Pakdamar/Formexus.git
cd Formexus
```

### 3️⃣ Deploy Script Oluştur

```bash
# Template'ten deploy script oluştur
./create-deploy-script.sh

# Oluşturulan deploy-rpi.sh dosyasını düzenle
nano deploy-rpi.sh
```

**deploy-rpi.sh içinde şu değerleri değiştir:**

```bash
# MongoDB Credentials
MONGO_ROOT_USERNAME="admin"
MONGO_ROOT_PASSWORD="fr0vAouoVtaSgBDaSbm7d1caea5hlAlm"  # ← MongoDB şifresi

# JWT Secret
JWT_SECRET="+IvXBD5ekuJlpCVL02NluA7gwu6zmzSc5cG1lH4iGvk="  # ← JWT secret

# Cloudflare Tunnel
TUNNEL_ID="5d3b6d91-4475-47e1-8a0e-6f7072e22632"  # ← Tunnel ID
DOMAIN="formexus.net"  # ← Domain adı

# Cloudflare Tunnel Credentials (cert.json içeriği)
TUNNEL_CREDENTIALS='{
  "AccountTag": "...",
  "TunnelSecret": "...",
  "TunnelID": "5d3b6d91-4475-47e1-8a0e-6f7072e22632"
}'  # ← Cloudflare Dashboard'dan al
```

### 4️⃣ Cloudflare cert.json Al

Cloudflare Dashboard'a git:

1. **Zero Trust** > **Networks** > **Tunnels**
2. Tunnel'ı seç (formexus-tunnel)
3. **Configure** sekmesi
4. Sağ üstte **JSON** butonu
5. Tüm JSON içeriğini kopyala
6. `deploy-rpi.sh` içindeki `TUNNEL_CREDENTIALS` değerine yapıştır

### 5️⃣ Kurulumu Başlat

```bash
# Deploy script'i çalıştır
chmod +x deploy-rpi.sh
./deploy-rpi.sh
```

**Script otomatik olarak:**
- ✅ Docker ve Docker Compose kurar
- ✅ Environment dosyalarını (.env) oluşturur
- ✅ Cloudflare Tunnel yapılandırır
- ✅ MongoDB, Backend, Frontend, Cloudflared containerlarını build eder
- ✅ Tüm servisleri başlatır
- ✅ Systemd service kurar (otomatik başlatma için)
- ✅ Sağlık kontrolü yapar

**Kurulum süresi:** ~10-15 dakika (Raspberry Pi 4'te)

---

## 📊 Kurulum Sonrası Kontroller

### Container Durumları

```bash
docker compose ps
```

**Beklenen çıktı:**
```
NAME                   STATUS         PORTS
formexus-mongodb       Up (healthy)   27017:27017
formexus-backend       Up (healthy)   8080:8080
formexus-frontend      Up (healthy)   3000:80
formexus-cloudflared   Up             -
```

### Logları Kontrol

```bash
# Tüm loglar
docker compose logs -f

# Sadece backend
docker compose logs -f backend

# Sadece cloudflared
docker compose logs -f cloudflared
```

### Sağlık Kontrolleri

```bash
# MongoDB
docker exec formexus-mongodb mongosh --eval "db.adminCommand('ping')"

# Backend API
curl http://localhost:8080/health

# Frontend
curl http://localhost:3000

# Public site
curl https://formexus.net
```

---

## 🔧 Sorun Giderme

### Backend "No .env file found" Hatası

```bash
# .env dosyasının olduğunu kontrol et
ls -la backend/.env

# Yoksa, deploy script'i tekrar çalıştır
./deploy-rpi.sh
```

### Cloudflared "permission denied" Hatası

```bash
# cert.json izinlerini kontrol et
ls -la cloudflare-tunnel/cert.json

# İzinleri düzelt
chmod 600 cloudflare-tunnel/cert.json

# Cloudflared'i yeniden başlat
docker compose restart cloudflared
```

### MongoDB Authentication Failed

```bash
# MongoDB şifresinin doğru olduğunu kontrol et
cat backend/.env | grep MONGODB_URI

# Tüm containerları sil ve yeniden başlat
docker compose down -v
./deploy-rpi.sh
```

### Site Açılmıyor (502 Bad Gateway)

```bash
# Tüm servislerin çalıştığını kontrol et
docker compose ps

# Cloudflare Tunnel bağlantısını kontrol et
docker compose logs cloudflared | grep "Connection"

# 4 connection görmelisin:
# - ist03
# - ist04
# - ist06
# - ist07
```

---

## 🎯 Hızlı Komutlar

```bash
# Servisleri yeniden başlat
docker compose restart

# Servisleri durdur
docker compose down

# Servisleri başlat
docker compose up -d

# Tüm logları göster
docker compose logs -f

# Systemd service durumu
sudo systemctl status formexus

# Systemd ile yeniden başlat
sudo systemctl restart formexus
```

---

## 🚨 Raspberry Pi Reboot Sonrası

Raspberry Pi'nız yeniden başladığında **otomatik olarak** tüm servisler başlar:

```bash
# Systemd service kontrol et
sudo systemctl status formexus

# Container'ları kontrol et (30 saniye sonra)
docker compose ps
```

Eğer servisler başlamadıysa:

```bash
# Manuel başlat
sudo systemctl start formexus

# veya
cd ~/Formexus
docker compose up -d
```

---

## ✅ Başarı Göstergeleri

Kurulum başarılıysa:

1. ✅ `docker compose ps` → 4 container "Up" ve "healthy"
2. ✅ `curl http://localhost:8080/health` → `200 OK` veya JSON yanıt
3. ✅ `curl https://formexus.net` → HTML içerik döner
4. ✅ Browser'da `https://formexus.net` → Site açılır
5. ✅ Cloudflare Dashboard → Tunnel "HEALTHY" (4 connections)

---

## 🎉 Tamamlandı!

Site artık canlı: **https://formexus.net**

Herhangi bir sorun olursa yukarıdaki sorun giderme adımlarını takip edin.
