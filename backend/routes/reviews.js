const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

// GET /api/reviews/:product_id
router.get('/:product_id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name
       FROM reviews r
       JOIN users u ON r.customer_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [req.params.product_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reviews
router.post('/', authenticate, async (req, res) => {
  try {
    const { product_id, order_id, rating, comment } = req.body;
    if (!product_id || !rating) return res.status(400).json({ error: 'product_id and rating are required' });
    const [result] = await db.execute(
      'INSERT INTO reviews (product_id, customer_id, order_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [product_id, req.user.id, order_id || null, rating, comment || null]
    );
    // Update product avg_stars
    await db.execute(
      'UPDATE products SET avg_stars = (SELECT AVG(rating) FROM reviews WHERE product_id = ?) WHERE id = ?',
      [product_id, product_id]
    );
    res.status(201).json({ message: 'Review added!', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
