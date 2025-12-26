# Fix .env File Location

## 🚨 Problem

Your `.env` file is in the **wrong location**:
- ❌ Current: `backend/src/.env` 
- ✅ Should be: `backend/.env`

The `dotenv` package looks for `.env` in the directory where you run `npm start` or `npm run dev`, which is `backend/`, not `backend/src/`.

## ✅ Solution

### Option 1: Move the file (Recommended)

```bash
cd backend
mv src/.env .env
```

### Option 2: Copy and verify

```bash
cd backend
cp src/.env .env
# Verify it has all variables
cat .env | wc -l  # Should show 32 or 33 lines
```

### Option 3: Recreate from env.example

```bash
cd backend
cp env.example .env
# Then update DATABASE_URL password if needed
```

## 📋 Verify .env File Has All Variables

Your `.env` file should have these 12 variables (32 lines total with comments):

1. ✅ `NODE_ENV=development`
2. ✅ `PORT=5000`
3. ✅ `DATABASE_URL=postgresql://postgres:Real5472@localhost:5432/paynova`
4. ✅ `REDIS_URL=redis://localhost:6379`
5. ✅ `JWT_SECRET=uzZ5Zkyoe2AREezM20rPJCFCalyoTRZp`
6. ✅ `JWT_REFRESH_SECRET=h4fY01M560AFsyoR7L90Ts6FLiHAwOpT`
7. ✅ `JWT_EXPIRES_IN=24h`
8. ✅ `JWT_REFRESH_EXPIRES_IN=7d`
9. ✅ `GEMINI_API_KEY=AIzaSyBHzAH4bIuRjx8vERkZ63o6tJLxuQpm9UY`
10. ✅ `FRONTEND_URL=http://localhost:3000`
11. ✅ `EMAIL_FROM=noreply@paynova.com`
12. ✅ `UPLOAD_DIR=./uploads`

## 🔍 Check File Location

After moving, verify:

```bash
cd backend
ls -la | grep .env
```

You should see `.env` in the list (same level as `package.json`).

## ✅ Test

After fixing the location, test:

```bash
cd backend
npm run dev
```

You should see:
- ✅ Database connected
- 🚀 Server running on http://localhost:5000

If you still get errors about missing environment variables, check that all 12 variables above are in your `.env` file.

