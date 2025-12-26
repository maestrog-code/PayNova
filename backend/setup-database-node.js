#!/usr/bin/env node

/**
 * Alternative Database Setup Script
 * Uses Node.js and Sequelize instead of psql command
 * Run: node setup-database-node.js
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env file');
  console.error('   Please make sure .env file exists and has DATABASE_URL');
  process.exit(1);
}

// Parse DATABASE_URL to get connection details
// Format: postgresql://user:password@host:port/database
const urlMatch = DATABASE_URL.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

if (!urlMatch) {
  console.error('❌ Invalid DATABASE_URL format');
  console.error('   Expected: postgresql://user:password@host:port/database');
  process.exit(1);
}

const [, username, password, host, port, databaseName] = urlMatch;

// Connect to postgres database (default database) to create our database
const adminSequelize = new Sequelize({
  dialect: 'postgres',
  host: host,
  port: parseInt(port),
  username: username,
  password: password,
  database: 'postgres', // Connect to default postgres database
  logging: false
});

async function setupDatabase() {
  try {
    console.log('🗄️  PayNova Database Setup (Node.js)');
    console.log('================================');
    console.log('');

    // Test connection
    console.log('📡 Testing PostgreSQL connection...');
    await adminSequelize.authenticate();
    console.log('✅ Connected to PostgreSQL');
    console.log('');

    // Create database
    console.log(`📦 Creating database '${databaseName}'...`);
    try {
      await adminSequelize.query(`CREATE DATABASE ${databaseName};`);
      console.log('✅ Database created successfully');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  Database already exists (this is OK)');
      } else {
        throw error;
      }
    }
    console.log('');

    // Close admin connection
    await adminSequelize.close();

    // Connect to the new database
    console.log('📊 Creating tables...');
    const dbSequelize = new Sequelize(DATABASE_URL, {
      dialect: 'postgres',
      logging: false
    });

    await dbSequelize.authenticate();
    console.log('✅ Connected to paynova database');

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'src', 'database', 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        await dbSequelize.query(statement);
      }
    }

    await dbSequelize.close();

    console.log('✅ Tables created successfully');
    console.log('');
    console.log('================================');
    console.log('✅ Database setup complete!');
    console.log('================================');
    console.log('');
    console.log('You can now start the server with:');
    console.log('   npm run dev');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Error setting up database:');
    console.error(error.message);
    console.error('');
    
    if (error.message.includes('password authentication failed')) {
      console.error('💡 Tip: Check your DATABASE_URL password in .env file');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Tip: Make sure PostgreSQL is running');
      console.error('   Try: brew services start postgresql');
    } else if (error.message.includes('does not exist')) {
      console.error('💡 Tip: PostgreSQL might not be installed');
      console.error('   Install with: brew install postgresql@14');
    }
    
    process.exit(1);
  }
}

setupDatabase();

