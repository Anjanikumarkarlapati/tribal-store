const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/analytics/summary  (admin only)
router.get('/summary', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const [[{ total_revenue }]] = await db.execute(
      "SELECT COALESCE(SUM(total_price),0) AS total_revenue FROM orders WHERE status != 'cancelled' AND status != 'refunded'"
    );
    const [[{ active_artisans }]] = await db.execute(
      "SELECT COUNT(*) AS active_artisans FROM artisans WHERE is_approved = TRUE"
    );
    const [[{ pending_artisans }]] = await db.execute(
      "SELECT COUNT(*) AS pending_artisans FROM artisans WHERE is_approved = FALSE"
    );
    const [[{ pending_products }]] = await db.execute(
      "SELECT COUNT(*) AS pending_products FROM products WHERE is_approved = FALSE"
    );

    // High value orders (over ₹50,000 total or top 5 most expensive)
    const [high_value_sales] = await db.execute(`
      SELECT o.id, o.order_number, o.total_price, o.created_at, u.name AS customer_name,
             p.name AS product_name, p.img_url, oi.qty, oi.unit_price
      FROM orders o
      JOIN users u ON u.id = o.customer_id
      JOIN order_items oi ON oi.order_id = o.id
      JOIN products p ON p.id = oi.product_id
      ORDER BY o.total_price DESC
      LIMIT 5
    `);

    res.json({ total_revenue, active_artisans, pending_artisans, pending_products, high_value_sales });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/disputes  (admin only)
router.get('/disputes', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT o.id, o.order_number, o.total_price, o.status, o.created_at, u.name, u.email
      FROM orders o
      JOIN users u ON u.id = o.customer_id
      WHERE o.status IN ('cancelled','refunded')
      ORDER BY o.created_at DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/users  (admin only)
router.get('/users', authenticate, requireRole('admin'), async (req, res) => {
  try {
    // All users with role, join date, and counts
    const [users] = await db.execute(`
      SELECT u.id, u.name, u.email, u.role, u.avatar_url, u.created_at,
             (SELECT COUNT(*) FROM orders o WHERE o.customer_id = u.id) AS order_count,
             (SELECT COUNT(*) FROM cart c WHERE c.user_id = u.id) AS cart_items,
             (SELECT COUNT(*) FROM reviews r WHERE r.customer_id = u.id) AS review_count
      FROM users u
      ORDER BY u.created_at DESC
    `);

    // Recent activity feed — last 20 events across orders, reviews
    const [recentOrders] = await db.execute(`
      SELECT 'order' AS type, o.created_at AS at,
             u.name AS user_name, u.email, u.role,
             CONCAT('Placed order #', o.order_number, ' · ₹', FORMAT(o.total_price,0)) AS detail
      FROM orders o
      JOIN users u ON u.id = o.customer_id
      ORDER BY o.created_at DESC
      LIMIT 10
    `);

    const [recentReviews] = await db.execute(`
      SELECT 'review' AS type, r.created_at AS at,
             u.name AS user_name, u.email, u.role,
             CONCAT('Reviewed "', p.name, '" · ', r.rating, '★') AS detail
      FROM reviews r
      JOIN users u ON u.id = r.customer_id
      JOIN products p ON p.id = r.product_id
      ORDER BY r.created_at DESC
      LIMIT 10
    `);

    const [recentSignups] = await db.execute(`
      SELECT 'signup' AS type, u.created_at AS at,
             u.name AS user_name, u.email, u.role,
             CONCAT('Joined as ', u.role) AS detail
      FROM users u
      ORDER BY u.created_at DESC
      LIMIT 10
    `);

    // Merge & sort activity feed
    const feed = [...recentOrders, ...recentReviews, ...recentSignups]
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 20);

    res.json({ users, feed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

