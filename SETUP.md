# PayNova Setup Guide

This guide will help you set up the PayNova project with backend and frontend synced together.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Step 1: Backend Setup

### 1.1 Install Dependencies

```bash
cd backend
npm install
```

### 1.2 Create .env File

The `.env` file should already be created from `env.example`. If not, copy it:

```bash
cp env.example .env
```

**Important:** Update the following values in `.env`:
- `DATABASE_URL`: Replace `Real5472` with your actual PostgreSQL password
- `JWT_SECRET` and `JWT_REFRESH_SECRET`: These should be random strings (already set in env.example)

### 1.3 Set Up Database

**Option A: Using the setup script (Recommended)**

```bash
cd backend
chmod +x setup-database.sh
./setup-database.sh
```

**Option B: Manual Setup**

1. Create the database:
```bash
psql -U postgres -c "CREATE DATABASE paynova;"
```

2. Run the schema:
```bash
psql -U postgres -d paynova -f src/database/schema.sql
```

**Note:** You'll be prompted for your PostgreSQL password (default: `Real5472` as per env.example)

### 1.4 Start Backend Server

```bash
cd backend
npm run dev
```

The backend should now be running on `http://localhost:5000`

## Step 2: Frontend Setup

### 2.1 Install Dependencies

```bash
# From project root
npm install
```

### 2.2 Configure API URL (Optional)

The frontend is configured to connect to `http://localhost:5000/api/v1` by default. If your backend runs on a different port, create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 2.3 Start Frontend Server

```bash
npm run dev
```

The frontend should now be running on `http://localhost:3000`

## Step 3: Verify Setup

1. **Backend Health Check:**
   - Visit: `http://localhost:5000/health`
   - Should return: `{"status":"OK","timestamp":"..."}`

2. **Frontend:**
   - Visit: `http://localhost:3000`
   - You should see the PayNova login page

3. **Test Registration:**
   - Click "Create Account"
   - Fill in the form and submit
   - You should be automatically logged in

4. **Test Login:**
   - Log out and sign in with your credentials
   - You should be redirected to the dashboard

## Troubleshooting

### Database Connection Issues

- **Error: "password authentication failed"**
  - Check your PostgreSQL password in `.env` file
  - Default password in env.example is `Real5472`

- **Error: "database does not exist"**
  - Run the database setup script: `./backend/setup-database.sh`
  - Or manually create: `psql -U postgres -c "CREATE DATABASE paynova;"`

- **Error: "psql: command not found"**
  - PostgreSQL is not in your PATH
  - On Mac: `export PATH="/usr/local/bin:$PATH"`
  - Or use pgAdmin GUI instead

### Backend Issues

- **Error: "Cannot find module"**
  - Run `npm install` in the backend directory

- **Error: "Port 5000 already in use"**
  - Change `PORT` in `.env` to a different port
  - Update `VITE_API_URL` in frontend `.env` accordingly

### Frontend Issues

- **Error: "Failed to fetch" or CORS errors**
  - Make sure backend is running
  - Check that `FRONTEND_URL` in backend `.env` matches frontend URL (default: `http://localhost:3000`)

- **Error: "Module not found"**
  - Run `npm install` in the project root

## Project Structure

```
PayNova/
├── backend/
│   ├── src/
│   │   ├── config/        # Database and Redis config
│   │   ├── controllers/   # Request handlers
│   │   ├── database/       # SQL schema
│   │   ├── middleware/    # Auth middleware
│   │   ├── models/        # Sequelize models
│   │   ├── routes/        # API routes
│   │   └── server.js      # Express server
│   ├── .env               # Environment variables
│   └── package.json
├── components/            # React components
├── services/
│   └── api.ts            # API service for frontend
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/signin` - Login
- `POST /api/v1/auth/verify-2fa` - Verify 2FA code
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/setup-2fa` - Setup 2FA (protected)

### Health Check
- `GET /health` - Server health status

## Next Steps

- Add more API endpoints for wallets, transactions, etc.
- Implement file upload for settlement proofs
- Add email verification
- Set up Redis for caching
- Add more frontend features

## Support

If you encounter any issues, check:
1. Backend logs in terminal
2. Browser console for frontend errors
3. Network tab in browser DevTools for API requests

