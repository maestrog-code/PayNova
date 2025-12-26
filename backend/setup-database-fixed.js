#!/usr/bin/env node

/**
 * Fixed Database Setup Script
 * Properly executes SQL schema file
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env file');
  process.exit(1);
}

// Parse DATABASE_URL
const urlMatch = DATABASE_URL.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

if (!urlMatch) {
  console.error('❌ Invalid DATABASE_URL format');
  process.exit(1);
}

const [, username, password, host, port, databaseName] = urlMatch;

async function setupDatabase() {
  let adminSequelize, dbSequelize;
  
  try {
    console.log('🗄️  PayNova Database Setup (Node.js)');
    console.log('================================');
    console.log('');

    // Connect to postgres database
    adminSequelize = new Sequelize({
      dialect: 'postgres',
      host: host,
      port: parseInt(port),
      username: username,
      password: password,
      database: 'postgres',
      logging: false
    });

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
        console.log('⚠️  Database already exists');
      } else {
        throw error;
      }
    }
    console.log('');

    await adminSequelize.close();

    // Connect to paynova database
    console.log('📊 Creating tables...');
    dbSequelize = new Sequelize(DATABASE_URL, {
      dialect: 'postgres',
      logging: false
    });

    await dbSequelize.authenticate();
    console.log('✅ Connected to paynova database');

    // Read schema file
    const schemaPath = path.join(__dirname, 'src', 'database', 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Use Sequelize's query method which handles multiple statements
    // Execute the entire schema at once
    console.log('   Executing schema...');
    
    try {
      // Execute all SQL statements
      await dbSequelize.query(schema);
      console.log('✅ Tables created successfully');
    } catch (error) {
      // If error is about existing tables, that's OK
      if (error.message.includes('already exists') || 
          error.message.includes('duplicate key')) {
        console.log('⚠️  Some tables already exist');
        console.log('   Dropping existing tables and recreating...');
        
        // Drop all tables in reverse order
        await dbSequelize.query(`
          DROP TABLE IF EXISTS price_alerts CASCADE;
          DROP TABLE IF EXISTS settlement_proofs CASCADE;
          DROP TABLE IF EXISTS transactions CASCADE;
          DROP TABLE IF EXISTS wallets CASCADE;
          DROP TABLE IF EXISTS users CASCADE;
        `);
        
        // Now execute schema again
        await dbSequelize.query(schema);
        console.log('✅ Tables recreated successfully');
      } else {
        throw error;
      }
    }

    // Verify tables were created
    const [results] = await dbSequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('');
    console.log('📋 Created tables:');
    results.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });

    await dbSequelize.close();

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
    }
    
    if (adminSequelize) await adminSequelize.close().catch(() => {});
    if (dbSequelize) await dbSequelize.close().catch(() => {});
    
    process.exit(1);
  }
}

setupDatabase();

