const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    DATABASE_URL: process.env.DATABASE_URL,
});

console.log('Connecting to DB:', {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });


module.exports = pool;
