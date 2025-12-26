# PostgreSQL Installation for MacBook Pro 2015 (Monterey)

## Your System Info
- **Mac**: MacBook Pro 2015 (Intel x86_64)
- **macOS**: Monterey 12.7.6
- **Homebrew**: Installed at `/usr/local/bin/brew`

## ✅ Recommended: PostgreSQL 14 or 15

Both versions work perfectly on your system. I recommend **PostgreSQL 14** (LTS) for stability.

## 🎯 Method 1: Install via Homebrew (Recommended)

Since you already have Homebrew, this is the easiest:

```bash
# Install PostgreSQL 14
brew install postgresql@14

# Start PostgreSQL service
brew services start postgresql@14

# Add to PATH (add this to your ~/.zshrc)
echo 'export PATH="/usr/local/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify installation
psql --version
```

**Note**: On Intel Macs, Homebrew installs to `/usr/local/opt/` (not `/opt/homebrew/`)

## 🎯 Method 2: Postgres.app (Easiest GUI Option)

1. Download Postgres.app: https://postgresapp.com/downloads/
2. Choose version 14 or 15
3. Drag to Applications folder
4. Open Postgres.app
5. Click "Initialize" to create a new server
6. The app will automatically add PostgreSQL to your PATH

**Advantages**:
- ✅ No command line needed
- ✅ Easy to start/stop
- ✅ Visual interface
- ✅ Automatically manages PATH

## 🎯 Method 3: Use Node.js Script (No psql needed!)

If you don't want to install PostgreSQL CLI tools, use the Node.js script:

```bash
cd backend
node setup-database-node.js
```

This works as long as PostgreSQL server is running (even if psql isn't in PATH).

## 📋 Step-by-Step: Homebrew Installation

### Step 1: Install PostgreSQL

```bash
brew install postgresql@14
```

### Step 2: Start PostgreSQL

```bash
brew services start postgresql@14
```

### Step 3: Add to PATH

Edit your shell config file:

```bash
# For zsh (default on Monterey)
nano ~/.zshrc

# Add this line at the end:
export PATH="/usr/local/opt/postgresql@14/bin:$PATH"

# Save and exit (Ctrl+X, then Y, then Enter)

# Reload your shell
source ~/.zshrc
```

### Step 4: Verify Installation

```bash
psql --version
# Should show: psql (PostgreSQL) 14.x

# Test connection
psql -U postgres -c "SELECT version();"
```

### Step 5: Set Default Password (if needed)

```bash
psql -U postgres
```

Then in psql:
```sql
ALTER USER postgres PASSWORD 'Real5472';
\q
```

### Step 6: Run Database Setup

```bash
cd backend
./setup-database.sh
```

Or use the Node.js script:
```bash
cd backend
node setup-database-node.js
```

## 🔧 Troubleshooting

### Issue: "command not found: psql" after installation

**Solution**: Add to PATH
```bash
export PATH="/usr/local/opt/postgresql@14/bin:$PATH"
echo 'export PATH="/usr/local/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Issue: "PostgreSQL service won't start"

**Solution**: Check if it's already running
```bash
brew services list
# If it shows "started", it's running
# If it shows "stopped", start it:
brew services start postgresql@14
```

### Issue: "Port 5432 already in use"

**Solution**: Another PostgreSQL instance is running
```bash
# Check what's using the port
lsof -i :5432

# Stop other instances or change port in .env
```

### Issue: "Password authentication failed"

**Solution**: Reset PostgreSQL password
```bash
# Stop PostgreSQL
brew services stop postgresql@14

# Edit pg_hba.conf to allow local connections without password
# Location: /usr/local/var/postgresql@14/pg_hba.conf
# Change "md5" to "trust" for local connections

# Restart PostgreSQL
brew services start postgresql@14

# Connect and set password
psql -U postgres
ALTER USER postgres PASSWORD 'Real5472';
\q

# Change pg_hba.conf back to "md5"
```

## ✅ Quick Start (Recommended)

1. **Install PostgreSQL**:
   ```bash
   brew install postgresql@14
   brew services start postgresql@14
   ```

2. **Add to PATH**:
   ```bash
   echo 'export PATH="/usr/local/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

3. **Set password** (if needed):
   ```bash
   psql -U postgres -c "ALTER USER postgres PASSWORD 'Real5472';"
   ```

4. **Run setup**:
   ```bash
   cd backend
   node setup-database-node.js
   ```

## 🎯 Alternative: Use Postgres.app

If you prefer a GUI:
1. Download: https://postgresapp.com/downloads/
2. Install and open
3. Click "Initialize"
4. Use the Node.js script: `node setup-database-node.js`

The Node.js script works with Postgres.app too!

