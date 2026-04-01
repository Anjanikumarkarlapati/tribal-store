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

  const updates = [
    { name: 'Warli Village Wall Art', url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&q=80' },
    { name: 'Tribal Brass Figurine', url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=500&q=80' },
    { name: 'Silk Madhubani Stole', url: 'https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?w=500&q=80' },
    { name: 'Toda Pukhoor Bag', url: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500&q=80' },
    { name: 'Wooden Tribal Mask', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80' }
  ];

  try {
    for (let u of updates) {
      await connection.execute(`UPDATE products SET img_url = ? WHERE name = ?`, [u.url, u.name]);
    }
    console.log("Remaining broken Image URLs successfully repaired in the MySQL database!");
    process.exit(0);
  } catch(err) {
    console.error("Failed to fix images:", err);
    process.exit(1);
  }
}

fixImages();
