require('dotenv').config();
const pool = require('./db.js');

async function fixPasswords() {
  try {
    // This hash is BCRrypt for 'password123'
    const correctHash = '$2a$10$sloC4xKd4H2zpUbOWOq8Y.fslM1yIqVJAFQ98SMl7B.eLtDckOx16';
    
    console.log('Updating all users to use password123...');
    const [result] = await pool.query('UPDATE users SET password = ?', [correctHash]);
    
    console.log(`Successfully updated ${result.affectedRows} users!`);
    console.log('You can now log in with ANY email and the password: password123');
    process.exit(0);
  } catch (err) {
    console.error('Error updating passwords:', err);
    process.exit(1);
  }
}

fixPasswords();
