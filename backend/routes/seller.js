const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

// GET /api/seller/summary  — returns stats for the logged-in artisan seller
router.get('/summary', authenticate, async (req, res) => {
  try {
    // Find the artisan record for this user
    const [[artisan]] = await db.execute(
      'SELECT id FROM artisans WHERE user_id = ?', [req.user.id]
    );
    if (!artisan) return res.status(404).json({ error: 'Artisan profile not found.' });

    const artisanId = artisan.id;

    // Total Revenue
    const [[{ total_revenue }]] = await db.execute(`
      SELECT COALESCE(SUM(oi.unit_price * oi.qty), 0) AS total_revenue
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      JOIN orders o ON o.id = oi.order_id
      WHERE p.artisan_id = ? AND o.status != 'cancelled' AND o.status != 'refunded'
    `, [artisanId]);

    // Total orders
    const [[{ total_orders }]] = await db.execute(`
      SELECT COUNT(DISTINCT oi.order_id) AS total_orders
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      WHERE p.artisan_id = ?
    `, [artisanId]);

    // Total active products
    const [[{ total_products }]] = await db.execute(
      'SELECT COUNT(*) AS total_products FROM products WHERE artisan_id = ? AND is_active = TRUE', [artisanId]
    );

    // Pending products (awaiting approval)
    const [[{ pending_products }]] = await db.execute(
      'SELECT COUNT(*) AS pending_products FROM products WHERE artisan_id = ? AND is_approved = FALSE', [artisanId]
    );

    // Recent top products by sales
    const [top_products] = await db.execute(`
      SELECT p.id, p.name, p.img_url, p.price, p.category,
             COALESCE(SUM(oi.qty),0) AS units_sold,
             COALESCE(SUM(oi.unit_price * oi.qty),0) AS revenue
      FROM products p
      LEFT JOIN order_items oi ON oi.product_id = p.id
      WHERE p.artisan_id = ?
      GROUP BY p.id
      ORDER BY units_sold DESC
      LIMIT 5
    `, [artisanId]);

    res.json({ total_revenue, total_orders, total_products, pending_products, top_products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/seller/orders  — returns orders for the logged-in artisan's products
router.get('/orders', authenticate, async (req, res) => {
  try {
    const [[artisan]] = await db.execute(
      'SELECT id FROM artisans WHERE user_id = ?', [req.user.id]
    );
    if (!artisan) return res.status(404).json({ error: 'Artisan profile not found.' });

    const artisanId = artisan.id;

    // Join order_items with products and orders to get the artisan's sales
    const [orders] = await db.execute(`
      SELECT oi.id, oi.qty, oi.unit_price, o.status, o.created_at, 
             p.name AS product_name, p.img_url, u.name AS customer_name
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      JOIN orders o ON o.id = oi.order_id
      JOIN users u ON u.id = o.customer_id
      WHERE p.artisan_id = ?
      ORDER BY o.created_at DESC
    `, [artisanId]);

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

