const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/orders  (customer's own orders)
router.get('/', authenticate, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT o.id, o.order_number, o.total_price, o.status, o.shipping_address, o.created_at,
              oi.product_id, oi.qty, oi.unit_price, p.name, p.img_url
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.customer_id = ?
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders
router.post('/', authenticate, async (req, res) => {
  try {
    const { shipping_address, cart_items } = req.body;
    if (!cart_items || cart_items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    const total = cart_items.reduce((sum, item) => sum + (parseFloat(item.price) * item.qty), 0);
    const orderNumber = 'TR-' + Date.now();
    const [orderResult] = await db.execute(
      'INSERT INTO orders (order_number, customer_id, total_price, shipping_address) VALUES (?, ?, ?, ?)',
      [orderNumber, req.user.id, total.toFixed(2), shipping_address]
    );
    for (const item of cart_items) {
      await db.execute(
        'INSERT INTO order_items (order_id, product_id, artisan_id, qty, unit_price) VALUES (?, ?, ?, ?, ?)',
        [orderResult.insertId, item.id, item.artisan_id, item.qty, item.price]
      );
    }
    // Clear cart
    await db.execute('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    res.status(201).json({
      message: 'Order placed successfully!',
      order_id: orderResult.insertId,
      order_number: orderNumber
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id/status  (admin only)
router.put('/:id/status', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Order status updated!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
