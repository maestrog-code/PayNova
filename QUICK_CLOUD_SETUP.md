# Quick Setup: Connect Google Cloud Frontend to Backend

## 🚀 Quick Steps

### 1. Get Your Backend URL

After deploying your backend to Google Cloud Run (or wherever it's hosted), note the URL:
```
https://your-backend-service.run.app
```

### 2. Configure Frontend

Create `.env.production` in project root:

```bash
cd /Users/cuthbertrwebilumi/Documents/GitHub/PayNova
```

Create file `.env.production`:
```env
VITE_API_URL=https://your-backend-service.run.app/api/v1
```

**Replace `your-backend-service.run.app` with your actual backend URL!**

### 3. Update Backend CORS

Edit `backend/src/server.js` and add your frontend URL to the `allowedOrigins` array:

```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'https://your-frontend-service.run.app', // ← Add your frontend URL here
].filter(Boolean);
```

Or set in `backend/.env`:
```env
FRONTEND_URL=https://your-frontend-service.run.app
```

### 4. Rebuild Frontend

```bash
npm run build
```

This will use `.env.production` and include your backend URL in the build.

### 5. Deploy Frontend

Deploy the `dist/` folder to Google Cloud (Cloud Run, App Engine, or Cloud Storage).

## ✅ Test

1. Open your deployed frontend
2. Open browser console (F12)
3. Try to sign up or sign in
4. Check Network tab - should see requests to your backend URL
5. Should NOT see CORS errors

## 🎯 That's It!

Your frontend should now connect to your backend running in Google Cloud.

For detailed instructions, see `GOOGLE_CLOUD_SETUP.md`

