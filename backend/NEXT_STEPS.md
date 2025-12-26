# Next Steps After Moving .env File

## ✅ After Running move-env.sh

Once the script completes successfully, follow these steps:

## 1. Verify .env File Location

```bash
cd backend
ls -la | grep .env
```

You should see `.env` (not `src/.env`).

## 2. Verify .env File Contents

Check that all required variables are present:

```bash
cd backend
cat .env | grep -v "^#" | grep -v "^$" | wc -l
```

Should show **12** environment variables (excluding comments and empty lines).

Or check specific variables:

```bash
cd backend
grep -E "^(DATABASE_URL|JWT_SECRET|JWT_REFRESH_SECRET|FRONTEND_URL)=" .env
```

## 3. Set Up Database (If Not Done)

```bash
cd backend
chmod +x setup-database.sh
./setup-database.sh
```

Or manually:
```bash
psql -U postgres -c "CREATE DATABASE paynova;"
psql -U postgres -d paynova -f src/database/schema.sql
```

## 4. Create Uploads Directory

```bash
cd backend
mkdir -p uploads
```

## 5. Install Dependencies (If Not Done)

```bash
cd backend
npm install
```

## 6. Start the Backend Server

```bash
cd backend
npm run dev
```

You should see:
- ✅ Database connected
- 🚀 Server running on http://localhost:5000
- 📝 Health check: http://localhost:5000/health

## 7. Test the Connection

In another terminal, test the health endpoint:

```bash
curl http://localhost:5000/health
```

Should return:
```json
{"status":"OK","timestamp":"..."}
```

## 8. Start the Frontend (In Another Terminal)

```bash
# From project root
npm run dev
```

Frontend should start on http://localhost:3000

## 🚨 Troubleshooting

### Error: "Cannot find module 'dotenv'"
```bash
cd backend
npm install
```

### Error: "Database connection failed"
- Check PostgreSQL is running: `pg_isready`
- Verify `DATABASE_URL` in `.env` has correct password
- Make sure database exists: `psql -U postgres -l | grep paynova`

### Error: "JWT_SECRET is not defined"
- Check `.env` file exists in `backend/` (not `backend/src/`)
- Verify all JWT variables are in `.env`

### Error: "Port 5000 already in use"
- Change `PORT` in `.env` to a different port (e.g., `5001`)
- Update frontend `VITE_API_URL` if needed

## ✅ Success Checklist

- [ ] `.env` file in `backend/.env` (correct location)
- [ ] All 12 environment variables present
- [ ] Database created and schema run
- [ ] `uploads/` directory created
- [ ] Dependencies installed (`npm install`)
- [ ] Backend server starts without errors
- [ ] Health check endpoint works
- [ ] Frontend can connect to backend

## 🎯 You're Ready!

Once all checks pass, you can:
1. Register a new user
2. Sign in
3. Create exchange transactions
4. Create transfer transactions
5. Upload settlement proofs

Everything should be synced and working! 🚀

