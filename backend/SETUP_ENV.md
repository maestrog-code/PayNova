# How to Create the .env File Manually

## 📍 Location
The `.env` file must be created in the **`backend/`** folder (same level as `package.json`).

```
PayNova/
└── backend/
    ├── .env          ← Create it HERE
    ├── package.json
    └── src/
```

---

## 🎯 Method 1: Using VS Code (Easiest)

### Step 1: Open the backend folder in VS Code
1. Open VS Code
2. Go to **File → Open Folder**
3. Navigate to: `/Users/cuthbertrwebilumi/Documents/GitHub/PayNova/backend`
4. Click "Open"

### Step 2: Create the .env file
1. In VS Code, right-click in the file explorer (left sidebar)
2. Click **"New File"**
3. Type exactly: `.env` (including the dot at the beginning)
4. Press Enter

### Step 3: Copy and paste this content
Copy everything below and paste it into the `.env` file:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
# Replace 'mypassword123' with your actual PostgreSQL password
DATABASE_URL=postgresql://postgres:mypassword123@localhost:5432/paynova

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secrets (IMPORTANT: Change these to random strings!)
# You can generate random strings at: https://randomkeygen.com/
JWT_SECRET=change-this-to-a-very-long-random-string-12345
JWT_REFRESH_SECRET=change-this-to-another-random-string-67890
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Google Gemini AI
# Get your key from: https://ai.google.dev/
GEMINI_API_KEY=your-existing-gemini-key-from-google-ai-studio

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Email (we'll set this up later)
EMAIL_FROM=noreply@paynova.com

# File Upload (we'll use local storage for now)
UPLOAD_DIR=./uploads
```

### Step 4: Edit the values
**You MUST change these values:**

1. **DATABASE_URL**: Replace `mypassword123` with your PostgreSQL password
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/paynova
   ```

2. **JWT_SECRET**: Generate a random string (at least 32 characters)
   - Visit: https://randomkeygen.com/
   - Copy a "CodeIgniter Encryption Keys" value
   - Replace the entire value
   ```env
   JWT_SECRET=your-generated-random-string-here
   ```

3. **JWT_REFRESH_SECRET**: Generate a different random string
   ```env
   JWT_REFRESH_SECRET=another-different-random-string-here
   ```

4. **GEMINI_API_KEY**: If you have one, paste it here
   ```env
   GEMINI_API_KEY=AIzaSy...your-actual-key
   ```

### Step 5: Save the file
- Press `Cmd + S` (Mac) or `Ctrl + S` (Windows/Linux)
- The file should now be saved

---

## 🎯 Method 2: Using Terminal/Command Line

### Step 1: Navigate to backend folder
Open Terminal (Mac) or Command Prompt (Windows) and type:

```bash
cd /Users/cuthbertrwebilumi/Documents/GitHub/PayNova/backend
```

### Step 2: Create the file
**On Mac/Linux:**
```bash
touch .env
```

**On Windows:**
```bash
type nul > .env
```

### Step 3: Open the file in a text editor
**On Mac:**
```bash
open -a TextEdit .env
```

**On Windows:**
```bash
notepad .env
```

**On Linux:**
```bash
nano .env
```

### Step 4: Copy and paste the content
Copy the content from Method 1, Step 3 above, paste it into the editor, edit the values, and save.

---

## 🎯 Method 3: Using Terminal (One Command)

**On Mac/Linux:**
```bash
cd /Users/cuthbertrwebilumi/Documents/GitHub/PayNova/backend

cat > .env << 'EOF'
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://postgres:mypassword123@localhost:5432/paynova

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secrets
JWT_SECRET=change-this-to-a-very-long-random-string-12345
JWT_REFRESH_SECRET=change-this-to-another-random-string-67890
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Google Gemini AI
GEMINI_API_KEY=your-existing-gemini-key-from-google-ai-studio

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email
EMAIL_FROM=noreply@paynova.com

# File Upload
UPLOAD_DIR=./uploads
EOF
```

Then edit it:
```bash
nano .env
# or
open -a TextEdit .env
```

---

## ✅ Verify the File Was Created

### Check if file exists:
```bash
cd /Users/cuthbertrwebilumi/Documents/GitHub/PayNova/backend
ls -la | grep .env
```

You should see: `.env`

### View the file contents:
```bash
cat .env
```

---

## 🔧 Important Values to Change

### 1. Database Password
Find your PostgreSQL password (the one you set during installation):
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD_HERE@localhost:5432/paynova
```

**Don't know your password?**
- Try the default: `postgres`
- Or reset it in PostgreSQL settings

### 2. JWT Secrets (REQUIRED!)
These MUST be changed for security. Generate random strings:

**Option A: Use online generator**
- Go to: https://randomkeygen.com/
- Copy a "CodeIgniter Encryption Keys" value
- Use it for JWT_SECRET
- Generate another one for JWT_REFRESH_SECRET

**Option B: Use terminal**
```bash
# Generate random string (Mac/Linux)
openssl rand -base64 32
```

Run it twice to get two different secrets.

### 3. Gemini API Key (Optional for now)
If you have a Google Gemini API key, paste it. Otherwise, leave it as is - you can add it later.

---

## 🚨 Common Mistakes

1. **Wrong location**: File must be in `backend/` folder, NOT in `backend/src/`
2. **Missing dot**: File must be named `.env` (with the dot), not `env`
3. **Spaces around =**: Use `KEY=value`, NOT `KEY = value`
4. **Quotes**: Don't add quotes around values unless the value itself contains spaces
5. **Comments**: Lines starting with `#` are comments and are ignored

---

## 📝 Example of Correct .env File

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:mySecurePassword123@localhost:5432/paynova
REDIS_URL=redis://localhost:6379
JWT_SECRET=K8j3mN9pQ2rT5vW8xY1zA4bC6dE7fG0hI2jK4lM6nO8pQ0rS2tU4vW6xY8zA
JWT_REFRESH_SECRET=B3cD5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA7bC9dE1fG3hI5jK7lM
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz123456789
FRONTEND_URL=http://localhost:3000
EMAIL_FROM=noreply@paynova.com
UPLOAD_DIR=./uploads
```

---

## 🎉 Done!

Once you've created and saved the `.env` file, you're ready for Step 3 (Database Setup)!

