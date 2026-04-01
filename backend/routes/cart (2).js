const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

// GET /api/cart
router.get('/', authenticate, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT c.id, c.product_id, c.qty, p.name, p.price, p.img_url, p.artisan_id
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cart
router.post('/', authenticate, async (req, res) => {
  try {
    const { product_id, qty = 1 } = req.body;
    await db.execute(
      'INSERT INTO cart (user_id, product_id, qty) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE qty = qty + ?',
      [req.user.id, product_id, qty, qty]
    );
    res.json({ message: 'Added to cart!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/cart/:product_id
router.put('/:product_id', authenticate, async (req, res) => {
  try {
    const { qty } = req.body;
    if (qty <= 0) {
      await db.execute('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [req.user.id, req.params.product_id]);
      res.json({ message: 'Removed from cart!' });
    } else {
      await db.execute('UPDATE cart SET qty = ? WHERE user_id = ? AND product_id = ?', [qty, req.user.id, req.params.product_id]);
      res.json({ message: 'Cart updated!' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/cart  (clear entire cart)
router.delete('/', authenticate, async (req, res) => {
  try {
    await db.execute('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'Cart cleared!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
