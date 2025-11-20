# Formexus Backend

Professional Go backend with Fiber framework and MongoDB.

## Architecture

```
backend/
├── cmd/
│   └── server/          # Application entry point
├── internal/
│   ├── config/          # Configuration management
│   ├── database/        # Database connections
│   ├── domain/          # Domain models and interfaces
│   ├── dto/             # Data Transfer Objects
│   ├── handler/         # HTTP handlers
│   ├── middleware/      # HTTP middleware
│   ├── repository/      # Data access layer
│   └── service/         # Business logic layer
└── pkg/
    └── utils/           # Utility functions
```

## Setup

1. **Install Dependencies**

   ```bash
   go mod download
   ```

2. **Configure Environment**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run MongoDB** (using Docker)

   ```bash
   docker run -d -p 27017:27017 --name formexus-mongo mongo:latest
   ```

4. **Run the Server**
   ```bash
   go run cmd/server/main.go
   ```

## API Endpoints

### Authentication

- **POST** `/api/auth/register` - Register new user
- **POST** `/api/auth/login` - Login user
- **POST** `/api/auth/google` - Google OAuth login

### Protected Routes

- **GET** `/api/me` - Get current user info (requires JWT token)

## Features

- ✅ Clean Architecture
- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ MongoDB Integration
- ✅ CORS Support
- ✅ Custom Middleware
- ✅ Error Handling
- ✅ Graceful Shutdown
- ✅ Logging
- ⏳ Google OAuth (pending implementation)

## Development

```bash
# Run with hot reload (install air first)
air

# Build for production
go build -o bin/server cmd/server/main.go

# Run tests
go test ./...
```

## Environment Variables

See `.env.example` for required environment variables.
