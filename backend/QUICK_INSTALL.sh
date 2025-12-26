#!/bin/bash

# Quick PostgreSQL Installation Script for MacBook Pro 2015 (Monterey)
# This script installs PostgreSQL 14 and sets it up

echo "🍺 Installing PostgreSQL 14 via Homebrew..."
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew not found!"
    echo "   Install Homebrew first: https://brew.sh"
    exit 1
fi

# Install PostgreSQL 14
echo "📦 Installing PostgreSQL 14..."
brew install postgresql@14

if [ $? -ne 0 ]; then
    echo "❌ Installation failed"
    exit 1
fi

echo ""
echo "🚀 Starting PostgreSQL service..."
brew services start postgresql@14

echo ""
echo "📝 Adding PostgreSQL to PATH..."

# Detect shell
if [ -n "$ZSH_VERSION" ]; then
    SHELL_FILE="$HOME/.zshrc"
elif [ -n "$BASH_VERSION" ]; then
    SHELL_FILE="$HOME/.bash_profile"
else
    SHELL_FILE="$HOME/.zshrc"
fi

# Check if already in PATH
if grep -q "postgresql@14/bin" "$SHELL_FILE" 2>/dev/null; then
    echo "   Already in PATH"
else
    echo 'export PATH="/usr/local/opt/postgresql@14/bin:$PATH"' >> "$SHELL_FILE"
    echo "   Added to $SHELL_FILE"
    echo "   Run: source $SHELL_FILE"
fi

echo ""
echo "✅ PostgreSQL 14 installed and started!"
echo ""
echo "📋 Next steps:"
echo "   1. Reload your shell: source $SHELL_FILE"
echo "   2. Verify: psql --version"
echo "   3. Set password (if needed): psql -U postgres -c \"ALTER USER postgres PASSWORD 'Real5472';\""
echo "   4. Run database setup: cd backend && node setup-database-node.js"
echo ""

