# PWA Deployment Guide for Production

## Overview

This guide covers deploying the IoT Dashboard as a Progressive Web App to various hosting platforms. The PWA will be installable on Android devices once deployed with HTTPS.

---

## Pre-Deployment Checklist

### ✅ Required Files
- [x] `manifest.json` - PWA manifest configuration
- [x] `service-worker.js` - Service worker for offline support
- [x] `index.html` - Updated with PWA meta tags
- [x] App icons (192x192 and 512x512) - **Need to be created**
- [x] Mobile-optimized responsive design

### ✅ Backend Requirements
- Backend API must be accessible via HTTPS
- CORS must be configured for your domain
- MongoDB connection must be stable

### ⚠️ Icons Required
Before deploying, create app icons:
- `logo192.png` (192x192 pixels)
- `logo512.png` (512x512 pixels)

Place these in `/app/frontend/public/` directory.

---

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Pros:** Free tier, automatic HTTPS, easy deployment, great performance
**Cons:** Frontend-only (backend needs separate hosting)

#### Step 1: Prepare Frontend
```bash
cd /app/frontend
npm run build
```

#### Step 2: Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Scope: Your account
# - Link to existing project? No
# - Project name: iot-dashboard
# - Directory: ./
# - Override settings? No

# For production:
vercel --prod
```

#### Step 3: Configure Environment Variable
In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add `REACT_APP_BACKEND_URL` with your backend URL
3. Redeploy

#### Step 4: Deploy Backend Separately
Options for backend:
- **Railway.app** - Easy Python deployment
- **Render.com** - Free tier available
- **Heroku** - Well-documented
- **AWS/Google Cloud/Azure** - More complex but scalable

---

### Option 2: Netlify

**Pros:** Free tier, simple deployment, great for static sites
**Cons:** Backend needs separate hosting

#### Step 1: Build Frontend
```bash
cd /app/frontend
npm run build
```

#### Step 2: Deploy to Netlify

**Via Netlify CLI:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Directory to deploy: build
# Site name: iot-dashboard

# Production deploy:
netlify deploy --prod
```

**Via Netlify Web UI:**
1. Go to https://app.netlify.com
2. Drag and drop `build` folder
3. Site is live!

#### Step 3: Add Environment Variables
1. Site Settings → Environment Variables
2. Add `REACT_APP_BACKEND_URL`
3. Redeploy

---

### Option 3: Firebase Hosting

**Pros:** Google infrastructure, CDN included, free tier generous
**Cons:** Backend needs separate hosting

#### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

#### Step 2: Initialize Firebase
```bash
cd /app/frontend
firebase init hosting

# Select options:
# - Use existing project or create new
# - Public directory: build
# - Single-page app: Yes
# - Automatic builds: No
```

#### Step 3: Build and Deploy
```bash
npm run build
firebase deploy
```

---

### Option 4: Self-Hosted (VPS/Dedicated Server)

**Pros:** Full control, can host backend + frontend together
**Cons:** Requires server management, SSL certificate setup

#### Requirements:
- Ubuntu/Debian server
- Nginx or Apache
- SSL certificate (Let's Encrypt free)
- Node.js and Python installed

#### Step 1: Build Frontend
```bash
cd /app/frontend
npm run build
```

#### Step 2: Setup Nginx
```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/iot-dashboard
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # Frontend
    root /var/www/iot-dashboard/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API proxy
    location /api {
        proxy_pass http://localhost:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Step 3: Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/iot-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 4: Setup SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

#### Step 5: Deploy Backend
```bash
cd /app/backend
pip install -r requirements.txt

# Use supervisor or systemd to keep it running
sudo apt install supervisor

# Create supervisor config
sudo nano /etc/supervisor/conf.d/iot-backend.conf
```

Add configuration:
```ini
[program:iot-backend]
directory=/app/backend
command=/usr/bin/python3 -m uvicorn server:app --host 0.0.0.0 --port 8001
autostart=true
autorestart=true
stderr_logfile=/var/log/iot-backend.err.log
stdout_logfile=/var/log/iot-backend.out.log
```

Start backend:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start iot-backend
```

---

## Backend Deployment Options

### Option A: Railway.app (Recommended for Python)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
cd /app/backend
railway init

# Deploy
railway up

# Add environment variables in Railway dashboard
```

### Option B: Render.com

1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository (or manual deploy)
4. Select Python environment
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
7. Add environment variables
8. Deploy

### Option C: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
cd /app/backend
heroku create iot-dashboard-api

# Add Procfile
echo "web: uvicorn server:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
git init
git add .
git commit -m "Initial commit"
git push heroku main

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set CORS_ORIGINS=https://your-frontend-domain.com
```

---

## Post-Deployment Configuration

### 1. Update Backend URL

Update frontend environment variable:
```bash
# In Vercel/Netlify dashboard:
REACT_APP_BACKEND_URL=https://your-backend-api.com
```

### 2. Configure CORS on Backend

Update `/app/backend/.env`:
```
CORS_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

### 3. MongoDB Connection

If using MongoDB Atlas:
```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=iot_dashboard
```

---

## Testing PWA After Deployment

### 1. Test HTTPS
- Ensure site loads with `https://`
- Check for SSL certificate validity
- Verify no mixed content warnings

### 2. Test Service Worker
1. Open Chrome DevTools (F12)
2. Go to Application → Service Workers
3. Verify service worker is registered

### 3. Test Installation
1. Open site in Chrome on Android
2. Look for "Install" prompt
3. Install and test from home screen

### 4. Test Lighthouse Score
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run PWA audit
4. Aim for score above 90

### 5. Test Offline Mode
1. Install PWA on device
2. Open app
3. Turn off WiFi/Data
4. Verify app still loads (with cached data)

---

## Android Testing Checklist

- [ ] App installs from Chrome
- [ ] Icon appears on home screen
- [ ] App opens in fullscreen (no browser UI)
- [ ] Touch interactions work smoothly
- [ ] Charts are readable and interactive
- [ ] Export functionality works
- [ ] Auto-refresh toggles correctly
- [ ] Offline mode shows cached data
- [ ] App updates automatically

---

## Performance Optimization

### 1. Enable Gzip Compression

Add to Nginx config:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### 2. Add Caching Headers

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Optimize Images
- Use WebP format for icons
- Compress PNG/JPG images
- Use appropriate sizes (192x192, 512x512)

### 4. Minify Assets
Already handled by `npm run build`

---

## Monitoring & Analytics

### Add Google Analytics (Optional)

Create `/app/frontend/src/analytics.js`:
```javascript
// Add Google Analytics tracking
export const initGA = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID');
  }
};
```

### Monitor Service Worker Updates
```javascript
// In App.js
navigator.serviceWorker.register('/service-worker.js')
  .then(reg => {
    reg.addEventListener('updatefound', () => {
      console.log('New version available! Refresh to update.');
    });
  });
```

---

## Troubleshooting Deployment Issues

### Issue: Service Worker not registering
**Solution:**
- Ensure HTTPS is enabled
- Check service-worker.js path is correct
- Verify no console errors
- Clear browser cache

### Issue: Manifest not detected
**Solution:**
- Check manifest.json is in public folder
- Verify manifest link in index.html
- Validate manifest JSON syntax
- Check Content-Type header is application/json

### Issue: App not installable
**Solution:**
- Ensure HTTPS
- Check manifest.json has all required fields
- Verify icons exist and are correct size
- Check Lighthouse PWA audit for issues

### Issue: Backend API not connecting
**Solution:**
- Verify CORS settings
- Check REACT_APP_BACKEND_URL is correct
- Ensure backend is running and accessible
- Check browser console for errors

---

## Security Best Practices

1. **Always use HTTPS** - Required for PWA
2. **Secure MongoDB** - Use authentication and whitelisting
3. **Environment Variables** - Never commit secrets to Git
4. **CORS** - Only allow specific domains
5. **Rate Limiting** - Implement on backend API
6. **Input Validation** - Sanitize all user inputs

---

## Cost Estimates

### Free Tier Hosting (Hobby Projects)
- **Vercel:** Frontend free
- **Railway:** Backend $5/month (free trial)
- **MongoDB Atlas:** Free tier (512 MB)
- **Total:** ~$5/month

### Production Hosting (Small Business)
- **Vercel Pro:** $20/month
- **Railway:** $20/month
- **MongoDB Atlas:** $9/month (2 GB)
- **Total:** ~$49/month

### Enterprise (High Traffic)
- **AWS/GCP/Azure:** Custom pricing
- **MongoDB Atlas:** $57/month (10 GB)
- **CDN:** Cloudflare (free or $20/month)
- **Total:** $100-500/month

---

## Next Steps After Deployment

1. ✅ Share URL with users
2. ✅ Test installation on multiple Android devices
3. ✅ Monitor error logs
4. ✅ Set up analytics
5. ✅ Plan for feature updates
6. ✅ Configure automated backups
7. ✅ Setup monitoring/alerting

---

**Your IoT Dashboard PWA is ready for production! 🚀**

For support, refer to:
- `/app/PWA_ANDROID_GUIDE.md` - Android installation guide
- `/app/WINDOWS_INSTALLATION.md` - Local development guide
