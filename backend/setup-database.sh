#!/bin/bash

# PayNova Database Setup Script
# This script creates the database and runs the schema

echo "🗄️  PayNova Database Setup"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Database name
DB_NAME="paynova"
DB_USER="postgres"
SCHEMA_FILE="src/database/schema.sql"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL (psql) not found in PATH${NC}"
    echo ""
    echo "On Mac, try:"
    echo "  export PATH=\"/usr/local/bin:\$PATH\""
    echo "  or"
    echo "  export PATH=\"/Applications/Postgres.app/Contents/Versions/latest/bin:\$PATH\""
    echo ""
    echo "Or use pgAdmin GUI instead (see DATABASE_SETUP.md)"
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready -U $DB_USER &> /dev/null; then
    echo -e "${YELLOW}⚠️  PostgreSQL doesn't seem to be running${NC}"
    echo ""
    echo "Please start PostgreSQL first:"
    echo "  Mac: brew services start postgresql"
    echo "  Windows: Start PostgreSQL service"
    echo "  Linux: sudo service postgresql start"
    exit 1
fi

echo -e "${GREEN}✓${NC} PostgreSQL is running"
echo ""

# Step 1: Create database
echo "📦 Step 1: Creating database '$DB_NAME'..."
psql -U $DB_USER -c "CREATE DATABASE $DB_NAME;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Database created successfully"
else
    echo -e "${YELLOW}⚠️  Database might already exist (this is OK)${NC}"
fi

echo ""

# Step 2: Run schema
echo "📊 Step 2: Creating tables..."
if [ -f "$SCHEMA_FILE" ]; then
    psql -U $DB_USER -d $DB_NAME -f "$SCHEMA_FILE"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Tables created successfully"
    else
        echo -e "${RED}❌ Error creating tables${NC}"
        echo "Please check the error message above"
        exit 1
    fi
else
    echo -e "${RED}❌ Schema file not found: $SCHEMA_FILE${NC}"
    exit 1
fi

echo ""
echo "================================"
echo -e "${GREEN}✅ Database setup complete!${NC}"
echo "================================"
echo ""
echo "You can verify by running:"
echo "  psql -U postgres -d paynova -c \"\\dt\""
echo ""

