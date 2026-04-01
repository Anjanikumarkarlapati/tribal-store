const db = require('./db.js');
const bcrypt = require('bcryptjs');

async function test() {
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', ['admin@tribal.com']);
    if (rows.length === 0) {
      console.log('admin@tribal.com NOT FOUND');
      process.exit();
    }
    const user = rows[0];
    console.log('DB Hash:', user.password);
    
    // Testing multiple passwords
    const p1 = await bcrypt.compare('password', user.password);
    console.log('password ->', p1);
    
    const p2 = await bcrypt.compare('password123', user.password);
    console.log('password123 ->', p2);

    process.exit();
  } catch(e) {
    console.error(e);
    process.exit();
  }
}
test();
