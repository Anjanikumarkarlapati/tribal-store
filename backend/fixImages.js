const mysql = require('mysql2/promise');

async function fixImages() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: process.env.DB_PASSWORD || '12345',
      database: 'tribal_db',
    });
  } catch(e) {
    if (e.code === 'ER_ACCESS_DENIED_ERROR') {
      connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'tribal_db',
      });
    } else {
        throw e;
    }
  }

  try {
    // 1. Fix Terracotta Serving Bowl (Broken URL)
    await connection.execute(`
      UPDATE products 
      SET img_url = 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&q=80' 
      WHERE img_url LIKE '%1610700084795%'
    `);

    // 2. Fix Brass Owl Figurine (Currently duplicate of Carved Wooden Panel 1610557892470)
    // We will find the Brass Owl by name
    await connection.execute(`
      UPDATE products 
      SET img_url = 'https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?w=500&q=80' 
      WHERE name = 'Brass Owl Figurine'
    `);

    // 3. Fix any other possible broken lengths or duplicates if identified
    console.log("Image URLs successfully repaired in the MySQL database!");
    process.exit(0);
  } catch(err) {
    console.error("Failed to fix images:", err);
    process.exit(1);
  }
}

fixImages();
