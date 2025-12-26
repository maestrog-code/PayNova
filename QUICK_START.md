# Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (if not exists)
# The .env file should already be created, but verify it exists
# If not, copy from env.example:
cp env.example .env

# Set up database
chmod +x setup-database.sh
./setup-database.sh

# Start backend server
npm run dev
```

**Backend should be running on:** `http://localhost:5000`

### 2. Frontend Setup

```bash
# From project root
cd ..

# Install dependencies
npm install

# Start frontend server
npm run dev
```

**Frontend should be running on:** `http://localhost:3000`

### 3. Test It!

1. Open `http://localhost:3000` in your browser
2. Click "Create Account"
3. Fill in the form and register
4. You should be automatically logged in!

## ✅ What's Been Set Up

- ✅ Backend API service created (`services/api.ts`)
- ✅ Frontend connected to backend
- ✅ Sign In component uses real API
- ✅ Sign Up component uses real API
- ✅ Token storage and authentication state management
- ✅ Refresh token endpoint added
- ✅ Database setup script ready

## 🔧 Database Setup

If the setup script doesn't work, manually run:

```bash
# Create database
psql -U postgres -c "CREATE DATABASE paynova;"

# Run schema (from backend directory)
cd backend
psql -U postgres -d paynova -f src/database/schema.sql
```

**Password:** `Real5472` (as per env.example)

## 📝 Important Notes

1. **Backend must be running** before frontend can connect
2. **Database must be created** before backend can start
3. **.env file** must exist in `backend/` directory
4. Both servers can run simultaneously in separate terminals

## 🐛 Troubleshooting

- **Backend won't start?** Check database connection in `.env`
- **Frontend can't connect?** Make sure backend is running on port 5000
- **Database errors?** Run the setup script or check PostgreSQL is running

For detailed setup, see `SETUP.md`

