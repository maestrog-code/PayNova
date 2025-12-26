# Environment Variables Checklist

## Backend .env File (Required)

Location: `/backend/.env` (NOT in `/backend/src/.env`)

### Required Variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database (REQUIRED)
DATABASE_URL=postgresql://postgres:Real5472@localhost:5432/paynova

# Redis (REQUIRED - but has fallback)
REDIS_URL=redis://localhost:6379

# JWT Secrets (REQUIRED)
JWT_SECRET=uzZ5Zkyoe2AREezM20rPJCFCalyoTRZp
JWT_REFRESH_SECRET=h4fY01M560AFsyoR7L90Ts6FLiHAwOpT
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL (REQUIRED for CORS)
FRONTEND_URL=http://localhost:3000

# File Upload (REQUIRED)
UPLOAD_DIR=./uploads

# Optional
GEMINI_API_KEY=AIzaSyBHzAH4bIuRjx8vERkZ63o6tJLxuQpm9UY
EMAIL_FROM=noreply@paynova.com
```

## Frontend .env File (Optional)

Location: `/PayNova/.env` (project root)

### Optional Variables:

```env
# API URL (optional - defaults to http://localhost:5000/api/v1)
VITE_API_URL=http://localhost:5000/api/v1

# Gemini API Key (optional - for AI assistant)
GEMINI_API_KEY=AIzaSyBHzAH4bIuRjx8vERkZ63o6tJLxuQpm9UY
```

## Common Issues

### Issue 1: .env file in wrong location
- ❌ Wrong: `backend/src/.env`
- ✅ Correct: `backend/.env`

### Issue 2: Missing required variables
If you get errors like:
- "JWT_SECRET is not defined"
- "DATABASE_URL is not defined"
- "Cannot read property of undefined"

Check that all required variables are in your `.env` file.

### Issue 3: Frontend can't connect to backend
- Check `FRONTEND_URL` in backend `.env` matches frontend URL
- Check `VITE_API_URL` in frontend `.env` (or use default)

## Quick Fix

If your `.env` file is missing variables, copy from `env.example`:

```bash
cd backend
cp env.example .env
```

Then verify all 32 lines are present.

