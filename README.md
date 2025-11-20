# Formexus

Modern form oluşturma platformu - Google Forms alternatifi

## Proje Yapısı

```
Formexus/
├── backend/          # Go Fiber backend
└── frontend/         # React + Vite frontend
```

## Teknolojiler

### Backend

- **Go** - Programming language
- **Fiber** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend

- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client

## Kurulum

### 1. MongoDB Başlatma

```bash
./backend/docker/clean_setup.sh
```

### 2. Backend Kurulum

```bash
cd backend
cp .env.example .env
# .env dosyasını düzenleyin
go run cmd/server/main.go
```

Backend `http://localhost:8080` adresinde çalışacak.

### 3. Frontend Kurulum

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışacak.

## Özellikler

✅ **Tamamlanan**

- Kullanıcı kaydı ve girişi
- JWT authentication
- Password hashing (bcrypt)
- MongoDB entegrasyonu
- Responsive tasarım
- Protected routes
- Template seçimi
- Modern UI/UX

⏳ **Yapım Aşamasında**

- Google OAuth entegrasyonu
- Form builder
- Form yanıtları
- Analytics dashboard

## API Endpoints

### Auth

- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/google` - Google OAuth (pending)
- `GET /api/me` - Kullanıcı bilgileri (protected)

## Geliştirme

### Backend

```bash
cd backend
make run          # Uygulamayı çalıştır
make build        # Build
make test         # Testleri çalıştır
make docker-mongo # MongoDB başlat
```

### Frontend

```bash
cd frontend
npm run dev       # Development server
npm run build     # Production build
npm run preview   # Preview production build
```
