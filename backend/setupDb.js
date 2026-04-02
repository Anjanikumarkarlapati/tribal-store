require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setup() {
  console.log(`Attempting to connect to MySQL server at ${process.env.DB_HOST || 'localhost'}...`);
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '12345',
      database: process.env.DB_NAME || 'tribal_db',
      multipleStatements: true,
      ssl: { rejectUnauthorized: false }
    });
    console.log("Connected successfully!");
  } catch (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }

  try {
    const rawSql = fs.readFileSync(path.join(__dirname, '../database/tribal_db.sql'), 'utf8');
    console.log("Executing SQL Setup Script to create full database + seed data...");
    
    await connection.query(rawSql);
    
    console.log("\n✅ SUCCESS! Database 'tribal_db' successfully created!");
    console.log("All users (including admin & artisans) are loaded.");
    console.log("All 17 high-quality products are loaded into the shop categories.");
    process.exit(0);
  } catch(err) {
    console.error("SQL Execution Error:", err.message);
    process.exit(1);
  }
}
setup();
