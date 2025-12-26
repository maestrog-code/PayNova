# Quick Fix: .env File Location

## 🚨 Problem Found

Your `.env` file is in the **wrong location**:
- ❌ Current: `backend/src/.env`
- ✅ Should be: `backend/.env`

## ✅ Quick Fix (Choose One)

### Option 1: Use the Script (Easiest)

```bash
cd backend
./move-env.sh
```

This will automatically move your `.env` file to the correct location.

### Option 2: Manual Move

```bash
cd backend
mv src/.env .env
```

### Option 3: Copy from env.example

If you want to start fresh:

```bash
cd backend
cp env.example .env
# Then update DATABASE_URL password if needed
```

## ✅ Verify

After moving, check:

```bash
cd backend
ls -la | grep .env
```

You should see `.env` (not `src/.env`).

## 🧪 Test

```bash
cd backend
npm run dev
```

You should see:
- ✅ Database connected
- 🚀 Server running on http://localhost:5000

## 📋 Why This Matters

The `dotenv` package loads `.env` from the directory where you run `npm start` or `npm run dev`. Since you run it from `backend/`, the `.env` file must be in `backend/`, not `backend/src/`.

## ✅ Your .env File Should Have

All 12 environment variables (32 lines total):
1. NODE_ENV
2. PORT
3. DATABASE_URL
4. REDIS_URL
5. JWT_SECRET
6. JWT_REFRESH_SECRET
7. JWT_EXPIRES_IN
8. JWT_REFRESH_EXPIRES_IN
9. GEMINI_API_KEY
10. FRONTEND_URL
11. EMAIL_FROM
12. UPLOAD_DIR

If all these are present, you're good to go!

