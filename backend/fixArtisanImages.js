const mysql = require('mysql2/promise');

async function fixArtisanImages() {
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

  // Photorealistic real people portraits
  const artisanUpdates = [
    { name: 'Sunita Barku', url: 'https://randomuser.me/api/portraits/women/40.jpg' },
    { name: 'Ramesh Ganda', url: 'https://randomuser.me/api/portraits/men/43.jpg' },
    { name: 'Kamla Devi', url: 'https://randomuser.me/api/portraits/women/65.jpg' },
    { name: 'Lakshmi Devi', url: 'https://randomuser.me/api/portraits/women/26.jpg' },
    { name: 'Naveen Gond', url: 'https://randomuser.me/api/portraits/men/22.jpg' },
    { name: 'Bhil Ram', url: 'https://randomuser.me/api/portraits/men/33.jpg' }
  ];

  try {
    for (const u of artisanUpdates) {
      // artisans table profile_img
      const [userRows] = await connection.execute('SELECT id FROM users WHERE name = ?', [u.name]);
      if (userRows.length > 0) {
        await connection.execute(`UPDATE artisans SET profile_img = ? WHERE user_id = ?`, [u.url, userRows[0].id]);
      }
    }
    console.log("Artisan profile images successfully repaired!");
    process.exit(0);
  } catch(err) {
    console.error("Failed to fix images:", err);
    process.exit(1);
  }
}

fixArtisanImages();
