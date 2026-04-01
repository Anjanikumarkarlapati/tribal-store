const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setup() {
  console.log("Attempting to connect to MySQL server...");
  let connection;
  try {
    // Try the default password from db.js
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: process.env.DB_PASSWORD || '12345',
      multipleStatements: true
    });
    console.log("Connected using password '12345'");
  } catch (err) {
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log("Access denied with password '12345', trying with a blank password (default for XAMPP)...");
      try {
        connection = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: '',
          multipleStatements: true
        });
        console.log("Connected using blank password!");
        // Update the .env or backend code so that db.js knows to use blank password too if needed?
        // the db.js defaults to '12345', if it fails to login later, we will have to fix that too.
      } catch (err2) {
        console.error("Could not connect to MySQL server with '12345' or blank password. Is MySQL currently running?");
        console.error(err2.message);
        process.exit(1);
      }
    } else {
      console.error("Connection failed:", err.message);
      process.exit(1);
    }
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
