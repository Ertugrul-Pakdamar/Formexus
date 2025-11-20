# 🚀 Formexus Deployment Guide

This guide will help you deploy Formexus to production using Render.com (free tier) and MongoDB Atlas.

## 📋 Prerequisites

- GitHub account (your repo is already on GitHub)
- MongoDB Atlas account (free - we'll set this up)
- Render.com account (free)
- Google Cloud Console project (for OAuth)

## ⏱️ Estimated Time: 30 minutes

---

## Step 1: MongoDB Atlas Setup (5 minutes)

### 1.1 Create Account & Cluster

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up (free tier - no credit card required)
3. **Create a Database:**
   - Choose **M0 Free** tier
   - Provider: **AWS**
   - Region: **Frankfurt (eu-central-1)** (closest to Turkey)
   - Cluster Name: `formexus`
4. Click **Create**

### 1.2 Create Database User

1. Go to **Database Access** (left sidebar)
2. Click **Add New Database User**
   - Authentication Method: **Password**
   - Username: `formexus_user`
   - Password: Click "Autogenerate Secure Password" (SAVE THIS!)
   - Database User Privileges: **Read and write to any database**
3. Click **Add User**

### 1.3 Configure Network Access

1. Go to **Network Access** (left sidebar)
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
4. Click **Confirm**

⚠️ **Note:** For production, you should whitelist only Render's IP addresses

### 1.4 Get Connection String

1. Go to **Database** → Click **Connect** on your cluster
2. Choose **Connect your application**
3. Driver: **Go**, Version: **1.13 or later**
4. Copy the connection string:
   ```
   mongodb+srv://formexus_user:<password>@formexus.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with the password you saved earlier
6. Add database name before the `?`:
   ```
   mongodb+srv://formexus_user:YOUR_PASSWORD@formexus.xxxxx.mongodb.net/formexus?retryWrites=true&w=majority
   ```

✅ **Save this connection string - you'll need it for Render!**

---

## Step 2: Google OAuth Production Setup (5 minutes)

### 2.1 Update OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your Formexus project
3. Navigate to **APIs & Services** → **OAuth consent screen**
4. Scroll down to **Authorized domains**
5. Add: `onrender.com` (we'll add specific URLs after deployment)

### 2.2 Note Your Credentials

You'll need these from your existing setup:

- **Client ID:** `xxxxx.apps.googleusercontent.com`
- **Client Secret:** `GOCSPX-xxxxx`

We'll update the redirect URIs after getting Render URLs.

---

## Step 3: Backend Deployment on Render (10 minutes)

### 3.1 Create Render Account

1. Go to [https://render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

### 3.2 Deploy Backend

1. Click **New +** → **Web Service**
2. Connect your **Formexus** repository
3. Configure the service:

**Basic Settings:**

```
Name:               formexus-backend
Region:             Frankfurt (EU Central)
Branch:             main
Root Directory:     backend
Runtime:            Go
Build Command:      go build -o server cmd/server/main.go
Start Command:      ./server
Instance Type:      Free
```

**Environment Variables:**

Click **Advanced** → **Add Environment Variable** for each:

```env
PORT=8080
ENV=production
MONGODB_URI=mongodb+srv://formexus_user:YOUR_PASSWORD@formexus.xxxxx.mongodb.net/formexus?retryWrites=true&w=majority
MONGODB_DATABASE=formexus
JWT_SECRET=<click "Generate" button - Render will create a secure random value>
JWT_EXPIRATION=24h
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
GOOGLE_REDIRECT_URL=https://formexus-backend.onrender.com/api/auth/google/callback
FRONTEND_URL=https://formexus-frontend.onrender.com
```

⚠️ **Important:**

- Replace `MONGODB_URI` with your actual connection string from Step 1
- Replace Google credentials with your actual values
- We'll update `FRONTEND_URL` after deploying frontend

4. Click **Create Web Service**
5. Wait for deployment (~3-5 minutes)
6. **Copy your backend URL:** `https://formexus-backend.onrender.com`

---

## Step 4: Frontend Deployment on Render (5 minutes)

### 4.1 Create Static Site

1. In Render dashboard, click **New +** → **Static Site**
2. Select your **Formexus** repository
3. Configure:

**Basic Settings:**

```
Name:               formexus-frontend
Branch:             main
Root Directory:     frontend
Build Command:      npm install && npm run build
Publish Directory:  dist
```

**Environment Variables:**

```env
VITE_API_URL=https://formexus-backend.onrender.com/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

⚠️ **Replace** `formexus-backend` with your actual backend service name

4. Click **Create Static Site**
5. Wait for deployment (~2-3 minutes)
6. **Copy your frontend URL:** `https://formexus-frontend.onrender.com`

---

## Step 5: Update Backend Environment (2 minutes)

1. Go to your **formexus-backend** service in Render
2. Click **Environment**
3. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://formexus-frontend.onrender.com
   ```
4. Click **Save Changes**
5. Backend will auto-redeploy (~1 minute)

---

## Step 6: Update Google OAuth Redirect URIs (3 minutes)

### 6.1 Add Production URLs

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized JavaScript origins**, add:
   ```
   https://formexus-frontend.onrender.com
   https://formexus-backend.onrender.com
   ```
5. Under **Authorized redirect URIs**, add:
   ```
   https://formexus-frontend.onrender.com
   https://formexus-backend.onrender.com/api/auth/google/callback
   ```
6. Click **Save**

---

## Step 7: Test Your Deployment 🎉

1. Visit your frontend URL: `https://formexus-frontend.onrender.com`
2. Click **"Create a Form"**
3. Test login with email/password
4. Test Google OAuth login
5. Create a test form
6. Fill and submit the form
7. Check responses

### ✅ Deployment Checklist

- [ ] Frontend loads successfully
- [ ] Login modal opens
- [ ] Email/password registration works
- [ ] Email/password login works
- [ ] Google OAuth login works
- [ ] Can create new forms
- [ ] Forms are saved (check MongoDB Atlas)
- [ ] Can publish forms
- [ ] Public form link works
- [ ] Can submit forms
- [ ] Responses are saved
- [ ] CSV export works
- [ ] Theme customization works
- [ ] Language switcher works (TR/EN)

---

## 🔧 Post-Deployment Configuration

### Custom Domains (Optional)

1. Buy a domain (e.g., formexus.com)
2. In Render → Your service → **Settings** → **Custom Domain**
3. Add domain and configure DNS records

### SSL Certificates

Render provides free SSL automatically! ✅

### Environment Variables Management

- Never commit `.env` or `.env.production` files
- Always use `.env.example` templates
- Update variables in Render dashboard only

---

## 🐛 Troubleshooting

### Backend Health Check Fails

**Problem:** Backend shows "Unhealthy"

**Solution:**

1. Check logs in Render dashboard
2. Verify MongoDB connection string
3. Ensure all environment variables are set
4. Check if port is correctly set to 8080

### CORS Errors

**Problem:** Frontend can't connect to backend

**Solution:**

1. Verify `FRONTEND_URL` in backend matches your frontend domain exactly
2. Check browser console for exact error
3. Ensure no trailing slashes in URLs

### Google OAuth Fails

**Problem:** "redirect_uri_mismatch" or "invalid_client"

**Solution:**

1. Verify redirect URIs in Google Console match exactly
2. Check Client ID is the same in both backend and frontend
3. Ensure `GOOGLE_REDIRECT_URL` format is correct
4. Wait 5-10 minutes after changing Google Console settings

### MongoDB Connection Fails

**Problem:** "Failed to connect to database"

**Solution:**

1. Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
2. Verify connection string format
3. Ensure password doesn't contain special characters (or encode them)
4. Check database user has read/write permissions

### Free Tier Sleep Mode

**Problem:** First request takes 30-60 seconds

**Solution:**

- This is normal on Render's free tier
- After 15 minutes of inactivity, services sleep
- First request wakes them up
- Upgrade to paid tier for always-on services

---

## 💰 Costs

### Current Setup (FREE)

- **MongoDB Atlas:** M0 Free Tier (512 MB storage)
- **Render Backend:** Free (750 hours/month)
- **Render Frontend:** Free (100 GB bandwidth/month)
- **Google OAuth:** Free
- **Total:** $0/month ✅

### Limitations

- Backend sleeps after 15 minutes inactivity
- 512 MB MongoDB storage
- Render free tier limited to 750 hours/month

### When to Upgrade

Upgrade when you have:

- 1000+ users
- 10GB+ database size
- Need 24/7 uptime
- Custom domain with professional setup

---

## 🔐 Security Best Practices

✅ **Do:**

- Use strong JWT secrets (32+ characters)
- Rotate secrets periodically
- Enable 2FA on MongoDB Atlas and Render
- Monitor logs regularly
- Keep dependencies updated

❌ **Don't:**

- Commit `.env` files
- Share credentials in public
- Use same credentials for dev and production
- Expose sensitive data in logs
- Hardcode secrets in code

---

## 📊 Monitoring

### Render Dashboard

- **Logs:** Real-time application logs
- **Metrics:** CPU, memory, bandwidth usage
- **Deploy History:** Track all deployments

### MongoDB Atlas

- **Database Monitoring:** Query performance
- **Alerts:** Set up alerts for high usage
- **Backup:** Automatic backups on paid tiers

---

## 🚀 Next Steps

1. **Custom Domain:** Buy and configure custom domain
2. **Email Service:** Integrate SendGrid/Mailgun for notifications
3. **Analytics:** Add Google Analytics or Plausible
4. **Error Tracking:** Integrate Sentry for error monitoring
5. **CDN:** Use Cloudflare for better performance
6. **Backup Strategy:** Regular database backups

---

## 📞 Support

- **Render Issues:** [Render Community Forum](https://community.render.com)
- **MongoDB Issues:** [MongoDB Support](https://support.mongodb.com)
- **Google OAuth Issues:** [Google Console Support](https://console.cloud.google.com/support)

---

## 🎉 Congratulations!

Your Formexus application is now live in production! 🚀

**Share your forms with the world:** `https://formexus-frontend.onrender.com`

---

**Last Updated:** January 2025  
**Deployment Platform:** Render.com + MongoDB Atlas  
**Estimated Setup Time:** 30 minutes
