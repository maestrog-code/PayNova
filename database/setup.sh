#!/bin/bash

echo "Setting up PayNova database..."

# Check if PostgreSQL is running
if ! pg_isready > /dev/null 2>&1; then
    echo "Error: PostgreSQL is not running"
    echo "Please start PostgreSQL and try again"
    exit 1
fi

# Create database
echo "Creating database..."
psql -U postgres -c "CREATE DATABASE paynova;" 2>/dev/null || echo "Database already exists"

# Run schema
echo "Running schema..."
psql -U postgres -d paynova -f schema.sql

echo "✓ Database setup complete!"

