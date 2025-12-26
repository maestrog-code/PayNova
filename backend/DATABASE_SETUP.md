# Step 3: Database Setup Guide

## 📋 What You'll Do
1. Create the `paynova` database in PostgreSQL
2. Run the SQL schema to create all tables
3. Verify everything is set up correctly

---

## ✅ Prerequisites
- PostgreSQL is installed and running
- You know your PostgreSQL password (from your `env.example`: `Real5472`)

---

## 🎯 Method 1: Using Terminal (Recommended)

### Step 1: Check if PostgreSQL is running

**On Mac:**
```bash
# Check if PostgreSQL is running
pg_isready

# If not running, start it:
brew services start postgresql
```

**On Windows:**
- Open Services (Win + R, type `services.msc`)
- Find "postgresql" service
- Make sure it's "Running"

**On Linux:**
```bash
sudo service postgresql status
# If not running:
sudo service postgresql start
```

### Step 2: Connect to PostgreSQL

Open Terminal and run:
```bash
psql -U postgres
```

You'll be prompted for your password. Enter: `Real5472`

**If you get an error:**
- Make sure PostgreSQL is running
- Try: `psql -U postgres -h localhost`
- On Mac, you might need: `psql postgres`

### Step 3: Create the Database

Once you're in the PostgreSQL prompt (you'll see `postgres=#`), type:

```sql
CREATE DATABASE paynova;
```

You should see: `CREATE DATABASE`

### Step 4: Verify Database Was Created

```sql
\l
```

You should see `paynova` in the list of databases.

### Step 5: Exit PostgreSQL

```sql
\q
```

---

## 🎯 Method 2: One-Line Command (Easier)

Instead of steps 2-5 above, you can do it all in one command:

```bash
psql -U postgres -c "CREATE DATABASE paynova;"
```

Enter password when prompted: `Real5472`

**If it says "database already exists"**, that's fine! It means the database is already created.

---

## 📊 Step 6: Run the Schema (Create Tables)

Now we'll create all the tables (users, wallets, transactions, etc.)

### Option A: Using the schema file (Recommended)

```bash
cd /Users/cuthbertrwebilumi/Documents/GitHub/PayNova/backend
psql -U postgres -d paynova -f src/database/schema.sql
```

Enter password when prompted: `Real5472`

### Option B: Copy and paste SQL

1. Open the file: `backend/src/database/schema.sql`
2. Copy all the content
3. Connect to PostgreSQL:
   ```bash
   psql -U postgres -d paynova
   ```
4. Paste the SQL content
5. Press Enter
6. Type `\q` to exit

---

## ✅ Step 7: Verify Tables Were Created

Connect to the database and check:

```bash
psql -U postgres -d paynova
```

Then run:
```sql
\dt
```

You should see these tables:
- `users`
- `wallets`
- `transactions`
- `settlement_proofs`
- `price_alerts`

To see more details about a table:
```sql
\d users
```

Exit when done:
```sql
\q
```

---

## 🚨 Troubleshooting

### Error: "password authentication failed"
- Make sure you're using the correct password: `Real5472`
- Try resetting PostgreSQL password if needed

### Error: "database already exists"
- This is fine! The database is already created
- Skip to Step 6 (Run the Schema)

### Error: "relation already exists"
- Tables already exist
- If you want to start fresh, drop and recreate:
  ```sql
  DROP DATABASE paynova;
  CREATE DATABASE paynova;
  ```
  Then run the schema again

### Error: "psql: command not found"
- PostgreSQL is not in your PATH
- **Mac:** Add PostgreSQL to PATH or use full path:
  ```bash
  /usr/local/bin/psql -U postgres
  ```
- **Windows:** Use pgAdmin or add PostgreSQL bin to PATH

### Error: "connection refused"
- PostgreSQL is not running
- Start PostgreSQL service first

---

## 🎉 Success!

If you see the tables listed when you run `\dt`, you're done with Step 3!

**Next:** Step 4 - Start your server with `npm run dev`

---

## 📝 Quick Reference Commands

```bash
# Create database (one command)
psql -U postgres -c "CREATE DATABASE paynova;"

# Run schema
psql -U postgres -d paynova -f src/database/schema.sql

# Connect to database
psql -U postgres -d paynova

# List tables (inside psql)
\dt

# Exit psql
\q
```

