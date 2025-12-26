# Quick Guide: Create .env File

The `.env` file is required for the backend to run. Here's how to create it:

## 🚀 Quick Method (Recommended)

Run the setup script:

```bash
cd backend
./create-env.sh
```

This will copy `env.example` to `.env` automatically.

## 📝 Manual Method

### Option 1: Using Terminal

```bash
cd backend
cp env.example .env
```

### Option 2: Using VS Code

1. Open the `backend` folder in VS Code
2. Right-click in the file explorer
3. Click "New File"
4. Type `.env` (with the dot)
5. Copy the contents from `env.example` and paste into `.env`

## ⚠️ Required Updates

After creating `.env`, you **MUST** update these values:

### 1. Database Password
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/paynova
```
Replace `YOUR_PASSWORD` with your actual PostgreSQL password (default in env.example is `Real5472`)

### 2. JWT Secrets (IMPORTANT for Security!)

The JWT secrets in `env.example` are already set, but for production you should generate new ones:

**Generate new secrets:**
```bash
# On Mac/Linux
openssl rand -base64 32
```

Run this twice to get two different secrets for `JWT_SECRET` and `JWT_REFRESH_SECRET`.

Or use an online generator: https://randomkeygen.com/

## ✅ Verify .env File

Check if the file was created:

```bash
cd backend
ls -la | grep .env
```

You should see `.env` in the list.

## 📋 All Environment Variables

The `.env` file should contain:

- `NODE_ENV=development`
- `PORT=5000`
- `DATABASE_URL=postgresql://postgres:Real5472@localhost:5432/paynova`
- `REDIS_URL=redis://localhost:6379`
- `JWT_SECRET=...` (32+ character random string)
- `JWT_REFRESH_SECRET=...` (different 32+ character random string)
- `JWT_EXPIRES_IN=24h`
- `JWT_REFRESH_EXPIRES_IN=7d`
- `GEMINI_API_KEY=...` (optional, for AI assistant)
- `FRONTEND_URL=http://localhost:3000`
- `EMAIL_FROM=noreply@paynova.com`
- `UPLOAD_DIR=./uploads`

## 🚨 Common Issues

**Issue:** "Cannot find module" or "Environment variable not defined"
- **Solution:** Make sure `.env` file exists in `backend/` folder (not in `backend/src/`)

**Issue:** Database connection fails
- **Solution:** Check `DATABASE_URL` has the correct password

**Issue:** JWT errors
- **Solution:** Make sure `JWT_SECRET` and `JWT_REFRESH_SECRET` are set and different

## 🎯 Next Steps

After creating `.env`:

1. ✅ Verify `.env` file exists
2. ✅ Update database password if needed
3. ✅ Start backend: `npm run dev`
4. ✅ Check database connection works

