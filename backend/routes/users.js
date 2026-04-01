const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'customer' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    // If registering as artisan, create artisan record
    if (role === 'artisan') {
      const { tribe, state, specialty, bio } = req.body;
      await db.execute(
        'INSERT INTO artisans (user_id, tribe, state, specialty, bio) VALUES (?, ?, ?, ?, ?)',
        [result.insertId, tribe || null, state || null, specialty || null, bio || null]
      );
    }
    res.status(201).json({ message: 'User registered successfully!', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/profile  (protected)
router.get('/profile', authenticate, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, name, email, role, avatar_url, phone FROM users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/google-login
router.post('/google-login', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ error: 'Google credential is required' });

    if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
      console.error('SERVER CONFIG ERROR: Missing valid GOOGLE_CLIENT_ID in .env');
      return res.status(500).json({ error: 'Server configuration error: Google Login is disabled because the Client ID is missing. Please add it to your .env file.' });
    }

    // Verify the ID token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    // Find or create the user
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    let user;
    if (rows.length > 0) {
      // Existing user — update avatar if from Google
      user = rows[0];
      if (picture && !user.avatar_url) {
        await db.execute('UPDATE users SET avatar_url = ? WHERE id = ?', [picture, user.id]);
      }
    } else {
      // New user — register with a random unusable password
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
      const [result] = await db.execute(
        'INSERT INTO users (name, email, password, role, avatar_url) VALUES (?, ?, ?, ?, ?)',
        [name, email, randomPassword, 'customer', picture || null]
      );
      user = { id: result.insertId, name, email, role: 'customer', avatar_url: picture || null };
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    console.error('Google login error:', err.message);
    res.status(401).json({ error: 'Google authentication failed' });
  }
});

// POST /api/users/mock-google-login
router.post('/mock-google-login', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required for mock login' });

    // Find or create the user (using generic name if new)
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    let user;
    if (rows.length > 0) {
      user = rows[0];
    } else {
      // New user — register with a random unusable password
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
      const [result] = await db.execute(
        'INSERT INTO users (name, email, password, role, avatar_url) VALUES (?, ?, ?, ?, ?)',
        [email.split('@')[0], email, randomPassword, 'customer', 'https://randomuser.me/api/portraits/lego/1.jpg']
      );
      user = { id: result.insertId, name: email.split('@')[0], email, role: 'customer' };
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
  } catch (err) {
    console.error('Mock Google login error:', err.message);
    res.status(500).json({ error: 'Mock authentication failed' });
  }
});

module.exports = router;

