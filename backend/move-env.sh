#!/bin/bash

# Script to move .env file from wrong location to correct location

cd "$(dirname "$0")"

if [ -f src/.env ]; then
    echo "📦 Found .env file in src/.env"
    
    if [ -f .env ]; then
        echo "⚠️  .env already exists in correct location"
        read -p "Do you want to overwrite it? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Keeping existing .env file. Aborted."
            exit 0
        fi
    fi
    
    echo "🔄 Moving .env from src/.env to .env..."
    mv src/.env .env
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully moved .env file to correct location!"
        echo ""
        echo "📋 Verifying file contents..."
        if [ -f .env ]; then
            line_count=$(wc -l < .env | tr -d ' ')
            echo "   File has $line_count lines"
            echo ""
            echo "✅ .env file is now in the correct location: backend/.env"
            echo ""
            echo "You can now start the server with:"
            echo "   npm run dev"
        fi
    else
        echo "❌ Failed to move .env file"
        exit 1
    fi
else
    echo "❌ .env file not found in src/.env"
    echo ""
    echo "Creating .env from env.example instead..."
    if [ -f env.example ]; then
        cp env.example .env
        echo "✅ Created .env from env.example"
    else
        echo "❌ env.example not found either!"
        exit 1
    fi
fi

