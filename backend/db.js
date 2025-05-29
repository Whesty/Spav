const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,  // <- вот тут имя базы
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log('Connecting to DB:', {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });


module.exports = pool;
