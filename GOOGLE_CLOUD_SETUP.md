# Google Cloud Frontend to Backend Connection Setup

## Overview

This guide helps you connect your frontend running in Google Cloud to your backend API.

## 🔧 Step 1: Configure Frontend Environment Variables

### Option A: Using .env.production file (Recommended)

1. Create `.env.production` in the project root:

```bash
cd /Users/cuthbertrwebilumi/Documents/GitHub/PayNova
cp .env.production.example .env.production
```

2. Edit `.env.production` and set your backend URL:

```env
VITE_API_URL=https://your-backend-url.com/api/v1
GEMINI_API_KEY=your-gemini-api-key-here
```

### Option B: Set in Google Cloud Build/Deploy

If deploying via Google Cloud Build or Cloud Run, set environment variables:

```bash
# In your build/deploy script
export VITE_API_URL=https://your-backend-url.com/api/v1
```

### Option C: Google Cloud Run Environment Variables

If using Cloud Run for frontend:

1. Go to Cloud Run console
2. Select your frontend service
3. Click "Edit & Deploy New Revision"
4. Go to "Variables & Secrets" tab
5. Add:
   - `VITE_API_URL` = `https://your-backend-url.com/api/v1`

## 🔧 Step 2: Update Backend CORS Configuration

Update your backend `.env` file to allow requests from your Google Cloud frontend:

```env
# In backend/.env
FRONTEND_URL=https://your-frontend-url.run.app
# or
FRONTEND_URL=https://your-frontend-domain.com
```

**For multiple origins** (development + production), update `backend/src/server.js`:

```javascript
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://your-frontend-url.run.app',
    'https://your-frontend-domain.com'
  ],
  credentials: true
}));
```

## 🔧 Step 3: Backend Deployment Options

### Option A: Backend on Google Cloud Run (Recommended)

1. **Deploy backend to Cloud Run:**
   ```bash
   cd backend
   gcloud run deploy paynova-backend \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

2. **Get the backend URL:**
   - After deployment, you'll get a URL like: `https://paynova-backend-xxxxx.run.app`
   - Use this in your frontend `VITE_API_URL`

3. **Set environment variables in Cloud Run:**
   - Go to Cloud Run console
   - Select your backend service
   - Edit → Variables & Secrets
   - Add all variables from `backend/.env`

### Option B: Backend on Local/Other Server

If backend is running locally or on another server:

1. **Make backend accessible:**
   - Use ngrok for local: `ngrok http 5000`
   - Or deploy to a server with public IP
   - Or use a VPN/tunnel

2. **Update frontend `VITE_API_URL`** to point to your backend URL

## 🔧 Step 4: Build Frontend with Production Variables

When building for production:

```bash
# Build with production environment
npm run build

# The build will use .env.production variables
# Output will be in dist/ folder
```

## 🔧 Step 5: Deploy Frontend to Google Cloud

### Using Cloud Run:

```bash
# Build the frontend
npm run build

# Deploy to Cloud Run
gcloud run deploy paynova-frontend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars VITE_API_URL=https://your-backend-url.com/api/v1
```

### Using App Engine:

1. Create `app.yaml`:
```yaml
runtime: nodejs18
env: standard

env_variables:
  VITE_API_URL: 'https://your-backend-url.com/api/v1'
```

2. Deploy:
```bash
gcloud app deploy
```

### Using Cloud Storage + Cloud CDN:

1. Build frontend:
```bash
npm run build
```

2. Upload to Cloud Storage:
```bash
gsutil -m cp -r dist/* gs://your-bucket-name/
```

3. Set environment variables in your deployment config

## ✅ Verification Checklist

- [ ] Frontend `.env.production` has correct `VITE_API_URL`
- [ ] Backend `.env` has correct `FRONTEND_URL` (your Google Cloud frontend URL)
- [ ] Backend CORS allows your frontend origin
- [ ] Backend is accessible (deployed or tunneled)
- [ ] Frontend build includes production environment variables
- [ ] Both services are deployed and running

## 🧪 Testing the Connection

1. **Test backend health:**
   ```bash
   curl https://your-backend-url.com/health
   ```

2. **Test from frontend:**
   - Open browser console on your deployed frontend
   - Check Network tab for API calls
   - Should see requests to your backend URL

3. **Test CORS:**
   - Open browser console
   - Try to make an API call
   - Should not see CORS errors

## 🚨 Common Issues

### Issue: CORS Error
**Solution**: 
- Check `FRONTEND_URL` in backend `.env` matches your frontend URL exactly
- Include protocol (https://) and no trailing slash
- Update CORS configuration to allow your frontend origin

### Issue: API calls go to localhost
**Solution**: 
- Make sure `.env.production` exists and has `VITE_API_URL`
- Rebuild frontend: `npm run build`
- Check build output doesn't show localhost URLs

### Issue: Environment variables not working
**Solution**:
- Vite only exposes variables prefixed with `VITE_`
- Make sure variable is `VITE_API_URL` not `API_URL`
- Rebuild after changing environment variables

### Issue: Backend not accessible
**Solution**:
- Check backend is running and accessible
- Test with: `curl https://your-backend-url.com/health`
- Check firewall/security rules allow traffic

## 📝 Example Configuration

### Frontend `.env.production`:
```env
VITE_API_URL=https://paynova-backend-abc123.run.app/api/v1
GEMINI_API_KEY=AIzaSy...
```

### Backend `.env` (on Cloud Run):
```env
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://user:pass@/paynova?host=/cloudsql/project:region:instance
FRONTEND_URL=https://paynova-frontend-xyz789.run.app
JWT_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
```

## 🎯 Quick Start

1. **Get your backend URL** (after deploying backend)
2. **Create `.env.production`** with `VITE_API_URL=your-backend-url/api/v1`
3. **Update backend CORS** to allow your frontend URL
4. **Build and deploy frontend**
5. **Test the connection**

