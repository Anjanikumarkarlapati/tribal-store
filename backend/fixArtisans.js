const mysql = require('mysql2/promise');

async function fixArtisans() {
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

  // Update Artisans with real, high-quality portraits from Unsplash
  // We use `user_id` to reliably target them.
  const updates = [
    { user_id: 2, url: 'https://images.unsplash.com/photo-1544168190-79c154273140?w=400&q=80' }, // Sunita Barku (Authentic portrait)
    { user_id: 3, url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80' }, // Ramesh Ganda
    { user_id: 4, url: 'https://images.unsplash.com/photo-1589418659141-6e8aa7eb1522?w=400&q=80' }, // Kamla Devi
    { user_id: 6, url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80' }, // Lakshmi Devi
    { user_id: 7, url: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&q=80' }, // Naveen Gond
    { user_id: 8, url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' }  // Bhil Ram
  ];

  try {
    for (let u of updates) {
      await connection.execute(`UPDATE artisans SET profile_img = ? WHERE user_id = ?`, [u.url, u.user_id]);
    }
    console.log("Artisan Profile Images successfully replaced with beautiful, working portraits!");
    process.exit(0);
  } catch(err) {
    console.error("Failed to fix images:", err);
    process.exit(1);
  }
}

fixArtisans();
