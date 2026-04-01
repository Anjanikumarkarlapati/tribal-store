const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/products  (supports ?category=)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let sql = `
      SELECT p.*, u.name AS artisan_name, a.tribe AS artisan_tribe
      FROM products p
      JOIN artisans a ON p.artisan_id = a.id
      JOIN users u ON a.user_id = u.id
      WHERE p.is_active = TRUE AND p.is_approved = TRUE
    `;
    const params = [];
    if (category) {
      sql += ' AND p.category = ?';
      params.push(category);
    }
    sql += ' ORDER BY p.created_at DESC';
    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT p.*, u.name AS artisan_name, a.tribe, a.specialty
       FROM products p
       JOIN artisans a ON p.artisan_id = a.id
       JOIN users u ON a.user_id = u.id
       WHERE p.id = ? AND p.is_active = TRUE`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products  (artisan only)
router.post('/', authenticate, requireRole('artisan', 'admin'), async (req, res) => {
  try {
    const { artisan_id, name, description, price, old_price, category, tribe, state, img_url, badge, stock } = req.body;
    const [result] = await db.execute(
      `INSERT INTO products (artisan_id, name, description, price, old_price, category, tribe, state, img_url, badge, stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [artisan_id, name, description, price, old_price || null, category, tribe, state, img_url, badge || null, stock || 1]
    );
    res.status(201).json({ message: 'Product submitted for review!', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id/approve  (admin only)
router.put('/:id/approve', authenticate, requireRole('admin'), async (req, res) => {
  try {
    await db.execute('UPDATE products SET is_approved = TRUE WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product approved!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/pending/all  (admin only)
router.get('/pending/all', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT p.*, u.name AS artisan_name FROM products p
       JOIN artisans a ON p.artisan_id = a.id
       JOIN users u ON a.user_id = u.id
       WHERE p.is_approved = FALSE`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
