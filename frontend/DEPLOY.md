# 🚀 Vercel Deployment Guide

This guide will help you deploy the NitroCache frontend dashboard on Vercel.

## 📋 Prerequisites

- Vercel account (free at [vercel.com](https://vercel.com))
- Vercel CLI installed: `npm i -g vercel`
- Your backend API deployed (Render, Railway, Heroku, etc.)

## 🚀 Quick Deploy

### Option 1: Using Vercel CLI (Recommended)

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Update API URL**
Edit `index.html` and change:
```javascript
window.API_URL = 'https://your-backend-url.render.com';
// Replace with your actual backend URL
```

3. **Deploy to Vercel**
```bash
vercel
```

4. **Follow the prompts:**
   - Set up and deploy? **Yes**
   - Link to existing project? **No** (first time)
   - Project name: `nitrocache-frontend`

5. **Get your deployment URL**
```bash
vercel --prod
```

Your frontend is now live at `https://nitrocache-frontend.vercel.app` 🎉

### Option 2: Using Git + Vercel Dashboard

1. **Push your code to GitHub**
```bash
git add .
git commit -m "Add frontend dashboard"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository
   - Select the `frontend` directory as root
   - Framework preset: **Other** (static HTML)
   - Click Deploy

3. **Update API URL**
   - Go to Project Settings → Environment Variables
   - Or directly edit `index.html` in your repo

## ⚙️ Backend CORS Configuration

**Important:** Your backend must accept requests from your Vercel frontend.

Update `app.ts` to add CORS:

```typescript
import cors from 'cors';

// Add CORS middleware before routes
app.use(cors({
  origin: [
    'http://localhost:8080',           // Local development
    'https://nitrocache-frontend.vercel.app', // Your Vercel URL
    // Add more if needed
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

Install CORS:
```bash
npm install cors
npm install --save-dev @types/cors
```

## 🔧 Environment Variables

Create `.env.local` in frontend directory (for local testing):
```env
API_URL=http://localhost:5001
```

## 🔄 Redeploy After Changes

```bash
cd frontend
vercel --prod
```

Or push to GitHub (auto-deploy if connected).

## 🐛 Troubleshooting

### CORS Errors
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```
**Fix:** Update backend CORS settings (see above)

### API Not Found
```
Failed to fetch
```
**Fix:** Check `window.API_URL` in `index.html` matches your deployed backend

### Changes Not Showing
**Fix:** Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## 📊 Production Checklist

- [ ] Backend deployed and accessible
- [ ] CORS configured on backend
- [ ] API URL updated in frontend
- [ ] Frontend deployed to Vercel
- [ ] Test both GET and PATCH endpoints
- [ ] Run load test to verify functionality

## 🎉 Success!

Your NitroCache dashboard is now live and accessible worldwide!

**Share your deployment:**
- LinkedIn: Post the Vercel URL with screenshots
- Twitter: "Just deployed my Redis caching dashboard ⚡️ [link]"

**Live Demo Structure:**
```
Frontend (Vercel): https://nitrocache-frontend.vercel.app
Backend (Render):  https://nitrocache-api.onrender.com
Database (Render): PostgreSQL
Cache (Redis):     Redis Cloud / Upstash
```