#!/bin/bash

# Script to create .env file from env.example
# This script creates the .env file with all required environment variables

cd "$(dirname "$0")"

if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted. Keeping existing .env file."
        exit 0
    fi
fi

echo "📝 Creating .env file from env.example..."

if [ ! -f env.example ]; then
    echo "❌ Error: env.example file not found!"
    exit 1
fi

# Copy env.example to .env
cp env.example .env

if [ $? -eq 0 ]; then
    echo "✅ .env file created successfully!"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env and update these values:"
    echo "   1. DATABASE_URL - Update PostgreSQL password"
    echo "   2. JWT_SECRET - Should be a random string"
    echo "   3. JWT_REFRESH_SECRET - Should be a different random string"
    echo ""
    echo "You can edit it with:"
    echo "   nano .env"
    echo "   or"
    echo "   open -a TextEdit .env"
else
    echo "❌ Failed to create .env file"
    exit 1
fi

