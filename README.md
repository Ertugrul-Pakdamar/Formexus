# 📋 Formexus

<div align="center">
  
  ![Formexus Logo](https://img.shields.io/badge/Formexus-Form%20Builder-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDE2VjhhMiAyIDAgMCAwLTEtMS43M2wtNy00YTIgMiAwIDAgMC0yIDBsLTcgNEEyIDIgMCAwIDAgMyA4djhhMiAyIDAgMCAwIDEgMS43M2w3IDRhMiAyIDAgMCAwIDIgMGw3LTRBMiAyIDAgMCAwIDIxIDE2eiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+)
  
  **Modern, Powerful & Intelligent Form Builder Platform**
  
  [![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react)](https://react.dev/)
  [![Go](https://img.shields.io/badge/Go-1.21-00ADD8?style=flat&logo=go)](https://golang.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
  [![Fiber](https://img.shields.io/badge/Fiber-2.52-00ACD7?style=flat&logo=go)](https://gofiber.io/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
  
  [🚀 Quick Start](#-quick-start) | [📖 Features](#-features) | [🏗️ Architecture](#️-architecture)
  
</div>

---

## 🎯 About

**Formexus** is a next-generation form builder platform that empowers you to create beautiful, intelligent forms in minutes. Built with modern technologies and a focus on user experience, Formexus combines powerful features with an intuitive interface.

### ✨ Why Formexus?

- 🎨 **Beautiful Themes** - Customize colors, backgrounds, and styles
- 🌍 **Multilingual** - Full support for Turkish and English (easily extensible)
- 🚀 **Real-time Auto-save** - Never lose your work
- 📊 **Smart Analytics** - CSV export and response tracking
- 🔒 **Secure** - JWT authentication and enterprise-grade security
- 🔑 **Google OAuth** - Sign in with Google for seamless authentication
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
- **Google OAuth 2.0** - One-click sign-in with Google
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

### Prerequisites

- **Node.js** 18+ and npm
- **Go** 1.21+
- **Docker** (for MongoDB)
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Ertugrul-Pakdamar/Formexus.git
   cd Formexus
   ```

2. **Start MongoDB**

   ```bash
   cd backend/docker
   bash clean_setup.sh
   cd ../..
   ```

3. **Setup Backend**

   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and add your Google OAuth credentials (see Google OAuth Setup below)
   go mod download
   make run
   ```

4. **Setup Frontend**

   ```bash
   cd frontend
   npm install
   # Create .env file and add VITE_GOOGLE_CLIENT_ID (see Google OAuth Setup below)
   npm run dev
   ```

5. **Open your browser**
   ```
   Frontend: http://localhost:5173
   Backend:  http://localhost:8080
   ```

### 🔐 Google OAuth Setup

To enable Google Sign-In, follow the detailed setup guide: **[Google OAuth Setup Guide](./GOOGLE_OAUTH_SETUP.md)**

**Quick Summary:**

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**

2. **Create a new project** (or select existing)

3. **Enable Google+ API**

   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

4. **Create OAuth 2.0 Credentials**

   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Add authorized JavaScript origins:
     - `http://localhost:5173`
     - `http://localhost:8080`
   - Add authorized redirect URIs:
     - `http://localhost:5173`
   - Click "Create"

5. **Copy Client ID**

6. **Update Environment Variables**

   **Backend (.env):**

   ```env
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   ```

   **Frontend (.env):**

   ```env
   VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
   ```

7. **Restart both servers** to apply the changes

### 🎬 First Steps

1. **Create an Account** - Click "Create a Form" on the landing page
2. **Choose a Template** - Select from 6 pre-built templates or start blank
3. **Design Your Form** - Add fields, customize theme, set options
4. **Publish** - Click "Publish" to make your form live
5. **Share** - Copy the public link and share it anywhere
6. **Collect Responses** - View submissions in the Responses tab

---

## 🛠️ Tech Stack

### Frontend

| Technology       | Purpose                 |
| ---------------- | ----------------------- |
| **React 18.3**   | UI Framework            |
| **Vite**         | Build Tool & Dev Server |
| **React Router** | Client-side Routing     |
| **Tailwind CSS** | Styling Framework       |
| **Axios**        | HTTP Client             |
| **Context API**  | State Management        |

### Backend

| Technology     | Purpose              |
| -------------- | -------------------- |
| **Go 1.21+**   | Backend Language     |
| **Fiber 2.52** | Web Framework        |
| **MongoDB**    | Database             |
| **JWT**        | Authentication       |
| **bcrypt**     | Password Hashing     |
| **CORS**       | Cross-Origin Support |

### Infrastructure

| Technology | Purpose           |
| ---------- | ----------------- |
| **Docker** | MongoDB Container |
| **Git**    | Version Control   |
| **Make**   | Build Automation  |

---

## 📂 Project Structure

```
Formexus/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── context/          # Context providers (Auth, Language)
│   │   ├── services/         # API services
│   │   └── main.jsx          # Entry point
│   ├── public/               # Static assets
│   └── package.json
│
├── backend/                  # Go backend application
│   ├── cmd/
│   │   └── server/           # Main application entry
│   ├── internal/
│   │   ├── config/           # Configuration
│   │   ├── database/         # Database connection
│   │   ├── domain/           # Domain models
│   │   ├── dto/              # Data transfer objects
│   │   ├── handler/          # HTTP handlers
│   │   ├── middleware/       # Middleware (auth, CORS, logging)
│   │   ├── repository/       # Database repositories
│   │   └── service/          # Business logic
│   ├── pkg/
│   │   └── utils/            # Utilities (JWT, password)
│   ├── docker/               # Docker setup scripts
│   └── Makefile
│
└── README.md                 # This file
```

---

## 🔧 Configuration

### Backend (.env)

```env
PORT=8080
ENV=development

MONGODB_URI=mongodb://localhost:27017/formexus
MONGODB_DATABASE=formexus

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=24h

FRONTEND_URL=http://localhost:5173
```

### Frontend (Environment)

```env
VITE_API_URL=http://localhost:8080/api
```

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
