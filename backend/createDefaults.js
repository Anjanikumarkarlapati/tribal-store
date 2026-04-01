require('dotenv').config();
const pool = require('./db.js');

async function createDefaults() {
  try {
    const passwordHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // password123

    // Create Customer
    await pool.query(`
      INSERT INTO users (name, email, password, role, phone)
      VALUES ('Default Customer', 'customer@tribal.com', ?, 'customer', '1111111111')
      ON DUPLICATE KEY UPDATE name=name
    `, [passwordHash]);
    console.log('Customer created: customer@tribal.com / password123');

    // Create Consultant
    await pool.query(`
      INSERT INTO users (name, email, password, role, phone)
      VALUES ('Default Consultant', 'consultant@tribal.com', ?, 'consultant', '2222222222')
      ON DUPLICATE KEY UPDATE name=name
    `, [passwordHash]);
    console.log('Consultant created: consultant@tribal.com / password123');

    // Create Artisan
    await pool.query(`
      INSERT INTO users (name, email, password, role, phone)
      VALUES ('Default Artisan', 'artisan@tribal.com', ?, 'artisan', '3333333333')
      ON DUPLICATE KEY UPDATE name=name
    `, [passwordHash]);
    console.log('Artisan user created: artisan@tribal.com / password123');

    // Get the Artisan User ID.
    const [artUser] = await pool.query('SELECT id FROM users WHERE email = ?', ['artisan@tribal.com']);
    if (artUser.length > 0) {
      const artUserId = artUser[0].id;
      // Insert into artisans table
      await pool.query(`
        INSERT INTO artisans (user_id, tribe, state, specialty, bio, is_approved)
        VALUES (?, 'Default Tribe', 'Default State', 'Default Specialty', 'Default bio for artisan.', TRUE)
        ON DUPLICATE KEY UPDATE tribe=tribe
      `, [artUserId]);
      console.log('Artisan profile created/verified for artisan@tribal.com');
    }

    console.log('All default users processed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating defaults:', err);
    process.exit(1);
  }
}

createDefaults();
