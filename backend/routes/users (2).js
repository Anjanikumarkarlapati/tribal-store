const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

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

module.exports = router;
