# Deploy Backend to Google Cloud

Since your frontend is already in Google Cloud, you need to deploy the backend there too.

## 🎯 Option 1: Deploy to Google Cloud Run (Recommended)

### Step 1: Install Google Cloud SDK

If not already installed:
```bash
# Download and install from: https://cloud.google.com/sdk/docs/install
# Or on Mac:
brew install --cask google-cloud-sdk
```

### Step 2: Authenticate

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### Step 3: Deploy Backend

```bash
cd backend

# Deploy to Cloud Run
gcloud run deploy paynova-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --timeout 300 \
  --set-env-vars NODE_ENV=production,PORT=8080 \
  --set-secrets DATABASE_URL=DATABASE_URL_SECRET:latest,JWT_SECRET=JWT_SECRET_SECRET:latest,JWT_REFRESH_SECRET=JWT_REFRESH_SECRET:latest,FRONTEND_URL=FRONTEND_URL_SECRET:latest
```

**Note**: You'll need to set up secrets in Google Cloud Secret Manager first (see below).

### Step 4: Get Backend URL

After deployment, you'll get a URL like:
```
https://paynova-backend-xxxxx-uc.a.run.app
```

### Step 5: Update Frontend Environment Variables

In Google Cloud Console:
1. Go to your frontend service (Cloud Run/App Engine)
2. Edit the service
3. Go to "Variables & Secrets"
4. Add/Update: `VITE_API_URL` = `https://paynova-backend-xxxxx-uc.a.run.app/api/v1`

## 🔐 Setting Up Secrets in Google Cloud

### Create Secrets:

```bash
# Database URL
echo -n "postgresql://user:pass@host:5432/paynova" | gcloud secrets create DATABASE_URL_SECRET --data-file=-

# JWT Secret
echo -n "your-jwt-secret" | gcloud secrets create JWT_SECRET_SECRET --data-file=-

# JWT Refresh Secret
echo -n "your-jwt-refresh-secret" | gcloud secrets create JWT_REFRESH_SECRET --data-file=-

# Frontend URL (your frontend's Google Cloud URL)
echo -n "https://your-frontend-url.run.app" | gcloud secrets create FRONTEND_URL_SECRET --data-file=-
```

### Grant Access:

```bash
gcloud secrets add-iam-policy-binding DATABASE_URL_SECRET \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## 🎯 Option 2: Use Environment Variables (Simpler)

Instead of secrets, you can use environment variables directly:

```bash
cd backend

gcloud run deploy paynova-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars "NODE_ENV=production,PORT=8080,DATABASE_URL=postgresql://user:pass@host:5432/paynova,JWT_SECRET=your-secret,JWT_REFRESH_SECRET=your-refresh-secret,FRONTEND_URL=https://your-frontend-url.run.app"
```

## 🗄️ Database Setup in Google Cloud

### Option A: Cloud SQL (Recommended for Production)

1. **Create Cloud SQL instance:**
   ```bash
   gcloud sql instances create paynova-db \
     --database-version=POSTGRES_14 \
     --tier=db-f1-micro \
     --region=us-central1
   ```

2. **Create database:**
   ```bash
   gcloud sql databases create paynova --instance=paynova-db
   ```

3. **Create user:**
   ```bash
   gcloud sql users create postgres \
     --instance=paynova-db \
     --password=YOUR_PASSWORD
   ```

4. **Get connection name:**
   ```bash
   gcloud sql instances describe paynova-db --format="value(connectionName)"
   ```

5. **Update DATABASE_URL:**
   ```
   postgresql://postgres:PASSWORD@/paynova?host=/cloudsql/PROJECT:REGION:INSTANCE
   ```

6. **Connect Cloud Run to Cloud SQL:**
   ```bash
   gcloud run services update paynova-backend \
     --add-cloudsql-instances=PROJECT:REGION:INSTANCE \
     --region=us-central1
   ```

### Option B: Use Existing Database

If you have a database elsewhere, just update `DATABASE_URL` in your deployment.

## 📝 Quick Deploy Script

Create `deploy.sh` in backend folder:

```bash
#!/bin/bash

# Get your frontend URL (update this)
FRONTEND_URL="https://your-frontend-url.run.app"

# Deploy backend
gcloud run deploy paynova-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --set-env-vars "NODE_ENV=production,PORT=8080,FRONTEND_URL=$FRONTEND_URL" \
  --set-secrets "DATABASE_URL=DATABASE_URL_SECRET:latest,JWT_SECRET=JWT_SECRET_SECRET:latest,JWT_REFRESH_SECRET=JWT_REFRESH_SECRET:latest"

echo ""
echo "✅ Backend deployed!"
echo "📋 Update your frontend VITE_API_URL to:"
gcloud run services describe paynova-backend --region us-central1 --format="value(status.url)/api/v1"
```

## ✅ After Deployment

1. **Get backend URL:**
   ```bash
   gcloud run services describe paynova-backend \
     --region us-central1 \
     --format="value(status.url)"
   ```

2. **Update frontend in Google Cloud Console:**
   - Go to your frontend service
   - Edit → Variables & Secrets
   - Set `VITE_API_URL` = `https://your-backend-url.run.app/api/v1`

3. **Test connection:**
   ```bash
   curl https://your-backend-url.run.app/health
   ```

4. **Update backend CORS** (already done in server.js):
   - Make sure `FRONTEND_URL` env var is set to your frontend URL
   - Or add it to the `allowedOrigins` array in `server.js`

## 🚨 Important Notes

1. **Database**: You'll need a PostgreSQL database accessible from Cloud Run
2. **Secrets**: Use Secret Manager for sensitive data (passwords, keys)
3. **CORS**: Backend already configured to accept your frontend URL
4. **Port**: Cloud Run uses PORT 8080 by default (already configured)

## 🎯 Next Steps

1. Deploy backend to Cloud Run
2. Get the backend URL
3. Update frontend's `VITE_API_URL` in Google Cloud Console
4. Test the connection

