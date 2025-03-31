require('dotenv').config();
const { Client } = require('pg');

const db = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432
});

db.connect()
    .then(() => console.log('✅ Database connected successfully.'))
    .catch((err) => console.error('❌ Connection error', err));

module.exports = db;
