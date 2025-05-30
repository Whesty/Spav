const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    DATABASE_URL: "postgresql://neondb_owner:npg_0vih5KTcUOCl@ep-red-wildflower-a8oh1588-pooler.eastus2.azure.neon.tech/neondb?sslmode=require",
});

console.log('Connecting to DB:', {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });


module.exports = pool;
