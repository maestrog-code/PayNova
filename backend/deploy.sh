#!/bin/bash

# Quick Deploy Script for PayNova Backend to Google Cloud Run
# Usage: ./deploy.sh

echo "🚀 Deploying PayNova Backend to Google Cloud Run"
echo "=================================================="
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found!"
    echo "   Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get current project
PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT" ]; then
    echo "❌ No Google Cloud project set"
    echo "   Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "📋 Project: $PROJECT"
echo ""

# Ask for frontend URL
read -p "Enter your frontend URL (e.g., https://your-frontend.run.app): " FRONTEND_URL

if [ -z "$FRONTEND_URL" ]; then
    echo "❌ Frontend URL is required"
    exit 1
fi

echo ""
echo "📦 Building and deploying..."
echo ""

# Deploy to Cloud Run
gcloud run deploy paynova-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --timeout 300 \
  --set-env-vars "NODE_ENV=production,PORT=8080,FRONTEND_URL=$FRONTEND_URL" \
  --quiet

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Backend deployed successfully!"
    echo ""
    
    # Get the backend URL
    BACKEND_URL=$(gcloud run services describe paynova-backend \
      --region us-central1 \
      --format="value(status.url)" 2>/dev/null)
    
    if [ ! -z "$BACKEND_URL" ]; then
        echo "📋 Backend URL: $BACKEND_URL"
        echo ""
        echo "🔧 Next Steps:"
        echo "   1. Update your frontend's VITE_API_URL to:"
        echo "      $BACKEND_URL/api/v1"
        echo ""
        echo "   2. Set up your database connection:"
        echo "      - Update DATABASE_URL in Cloud Run environment variables"
        echo "      - Or use Cloud SQL and connect it"
        echo ""
        echo "   3. Set JWT secrets:"
        echo "      - Add JWT_SECRET and JWT_REFRESH_SECRET to environment variables"
        echo ""
        echo "   4. Test the connection:"
        echo "      curl $BACKEND_URL/health"
        echo ""
    fi
else
    echo ""
    echo "❌ Deployment failed"
    echo "   Check the error messages above"
    exit 1
fi

