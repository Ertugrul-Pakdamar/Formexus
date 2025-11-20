# 🔐 Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for Formexus.

## Prerequisites

- A Google Account
- Access to [Google Cloud Console](https://console.cloud.google.com/)

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown in the top bar
3. Click "New Project"
4. Enter project name: `Formexus` (or any name you prefer)
5. Click "Create"

### 2. Enable Google+ API

1. In the left sidebar, go to **"APIs & Services"** > **"Library"**
2. Search for **"Google+ API"** or **"Google OAuth2 API"**
3. Click on it and press **"Enable"**

### 3. Configure OAuth Consent Screen

1. Go to **"APIs & Services"** > **"OAuth consent screen"**
2. Select **"External"** (or "Internal" if you have a workspace)
3. Click **"Create"**
4. Fill in the required information:
   - **App name:** Formexus
   - **User support email:** Your email
   - **Developer contact email:** Your email
5. Click **"Save and Continue"**
6. **Scopes:** Click "Save and Continue" (default scopes are fine)
7. **Test users:** Add your email for testing
8. Click **"Save and Continue"**

### 4. Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** > **"Credentials"**
2. Click **"Create Credentials"** > **"OAuth client ID"**
3. Select **"Web application"**
4. Fill in the details:
   - **Name:** Formexus Web Client
   - **Authorized JavaScript origins:**
     ```
     http://localhost:5173
     http://localhost:8080
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:5173
     http://localhost:8080/api/auth/google/callback
     ```
5. Click **"Create"**

### 5. Copy Your Credentials

A dialog will appear showing:

- **Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)
- **Client Secret** (looks like: `GOCSPX-...`)

⚠️ **Important:** Keep these credentials secure!

### 6. Configure Backend

Edit `/backend/.env`:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
GOOGLE_REDIRECT_URL=http://localhost:8080/api/auth/google/callback
```

Replace `YOUR_CLIENT_ID_HERE` and `YOUR_CLIENT_SECRET_HERE` with the values from step 5.

### 7. Configure Frontend

Edit `/frontend/.env`:

```env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
```

Replace `YOUR_CLIENT_ID_HERE` with your Client ID from step 5.

### 8. Restart Servers

```bash
# Terminal 1 - Backend
cd backend
make run

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Testing

1. Open your browser and go to `http://localhost:5173`
2. Click "Create a Form" or any button that opens the login modal
3. You should see a "Continue with Google" button
4. Click it and sign in with your Google account
5. After successful authentication, you'll be redirected to the workspace

## Troubleshooting

### "redirect_uri_mismatch" Error

- Make sure the redirect URIs in Google Cloud Console exactly match your application URLs
- Check for trailing slashes (they matter!)
- Verify you're using the correct Client ID

### "invalid_client" Error

- Double-check your Client ID and Client Secret in `.env` files
- Make sure there are no extra spaces in the credentials
- Restart both servers after changing `.env` files

### Google Login Button Not Appearing

- Check browser console for errors
- Verify `VITE_GOOGLE_CLIENT_ID` is set in frontend `.env`
- Clear browser cache and reload

### Token Verification Failed

- Make sure Google+ API is enabled in Google Cloud Console
- Check that the Client ID in frontend matches the one in backend
- Verify the token is being sent correctly from frontend to backend

## Production Deployment

When deploying to production:

1. **Update OAuth Consent Screen:**

   - Change from "Testing" to "In Production"
   - Complete all required fields

2. **Add Production URLs:**

   - Add your production domain to "Authorized JavaScript origins"
   - Add production callback URL to "Authorized redirect URIs"
   - Example:
     ```
     https://formexus.com
     https://api.formexus.com
     https://api.formexus.com/api/auth/google/callback
     ```

3. **Update Environment Variables:**

   - Set production URLs in your `.env` files
   - Use environment variable management tools (like Vercel, Railway, etc.)
   - **NEVER** commit `.env` files with real credentials to Git

4. **Enable HTTPS:**
   - Google requires HTTPS for production OAuth
   - Use SSL certificates (Let's Encrypt, Cloudflare, etc.)

## Security Best Practices

✅ **DO:**

- Keep Client Secret secure and never expose it to frontend
- Use environment variables for all credentials
- Regenerate credentials if they're accidentally exposed
- Use HTTPS in production
- Validate tokens on the backend

❌ **DON'T:**

- Commit `.env` files to version control
- Share credentials in chat, email, or public forums
- Use the same credentials for development and production
- Hardcode credentials in source code

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [@react-oauth/google Documentation](https://www.npmjs.com/package/@react-oauth/google)

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review Google Cloud Console logs
3. Check browser console for JavaScript errors
4. Review backend server logs for API errors
5. Create an issue on GitHub

---

**Happy Coding! 🚀**
