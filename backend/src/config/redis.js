const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.error('Redis Error:', err));
client.on('connect', () => console.log('✅ Redis connected'));

// Connect immediately (non-blocking)
client.connect().catch((err) => {
  console.warn('⚠️  Redis connection failed. Continuing without Redis cache.');
  console.warn('   Make sure Redis is running: redis-cli ping');
});

module.exports = client;

