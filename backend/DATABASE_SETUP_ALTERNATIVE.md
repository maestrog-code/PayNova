# Alternative Database Setup Methods

Since `psql` is not in your PATH, here are alternative ways to set up the database:

## 🎯 Method 1: Node.js Script (Easiest - Recommended)

This uses the existing database connection from your `.env` file:

```bash
cd backend
node setup-database-node.js
```

This script will:
- ✅ Connect to PostgreSQL using your DATABASE_URL
- ✅ Create the `paynova` database
- ✅ Run the schema to create all tables

**No need for psql in PATH!**

## 🎯 Method 2: Install PostgreSQL via Homebrew

If you want to use the original script:

```bash
# Install PostgreSQL
brew install postgresql@14

# Add to PATH (add this to your ~/.zshrc or ~/.bash_profile)
echo 'export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Start PostgreSQL
brew services start postgresql@14

# Then run the setup script
cd backend
./setup-database.sh
```

## 🎯 Method 3: Use pgAdmin (GUI)

1. Download pgAdmin from: https://www.pgadmin.org/download/
2. Install and open pgAdmin
3. Connect to your PostgreSQL server
4. Right-click "Databases" → "Create" → Name it `paynova`
5. Right-click on `paynova` database → "Query Tool"
6. Open `backend/src/database/schema.sql`
7. Copy and paste the SQL into the query tool
8. Click "Execute" (F5)

## 🎯 Method 4: Manual SQL Commands

If you have access to PostgreSQL through another method:

```sql
-- Connect to PostgreSQL (however you normally do)
-- Then run:

CREATE DATABASE paynova;

-- Then connect to paynova database and run the schema
\c paynova

-- Then copy and paste all SQL from backend/src/database/schema.sql
```

## 🚨 Troubleshooting

### Error: "password authentication failed"
- Check your `DATABASE_URL` in `.env` file
- Default password in env.example is `Real5472`
- Update if your PostgreSQL password is different

### Error: "ECONNREFUSED" or "Connection refused"
- PostgreSQL is not running
- Start it: `brew services start postgresql@14`
- Or check if it's running: `brew services list`

### Error: "PostgreSQL not installed"
- Install: `brew install postgresql@14`
- Or use Method 1 (Node.js script) which doesn't require psql

## ✅ Recommended: Use Method 1

The Node.js script (`setup-database-node.js`) is the easiest because:
- ✅ No need to install PostgreSQL CLI tools
- ✅ Uses your existing `.env` configuration
- ✅ Works with any PostgreSQL installation
- ✅ Same result as the bash script

Just run:
```bash
cd backend
node setup-database-node.js
```

