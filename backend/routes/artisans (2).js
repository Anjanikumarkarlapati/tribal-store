const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate, requireRole } = require('../middleware/auth');

// GET /api/artisans/pending/all  — MUST be before /:id
router.get('/pending/all', authenticate, requireRole('admin'), async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT a.*, u.name, u.email FROM artisans a
       JOIN users u ON a.user_id = u.id
       WHERE a.is_approved = FALSE`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/artisans
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT a.id, a.tribe, a.state, a.specialty, a.bio, a.is_approved,
              a.total_products, a.total_sales, a.avg_rating, a.profile_img,
              u.name, u.email, u.avatar_url
       FROM artisans a
       JOIN users u ON a.user_id = u.id
       WHERE a.is_approved = TRUE
       ORDER BY a.total_sales DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/artisans/:id
router.get('/:id', async (req, res) => {
  try {
    const [[artisan]] = await db.execute(
      `SELECT a.id, a.tribe, a.state, a.specialty, a.bio,
              a.total_products, a.total_sales, a.avg_rating, a.profile_img,
              u.name, u.email, u.avatar_url
       FROM artisans a JOIN users u ON a.user_id = u.id
       WHERE a.id = ?`,
      [req.params.id]
    );
    if (!artisan) return res.status(404).json({ error: 'Artisan not found' });
    const [products] = await db.execute(
      'SELECT * FROM products WHERE artisan_id = ? AND is_active = TRUE AND is_approved = TRUE',
      [req.params.id]
    );
    res.json({ ...artisan, products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/artisans/:id/approve  (admin only)
router.put('/:id/approve', authenticate, requireRole('admin'), async (req, res) => {
  try {
    await db.execute('UPDATE artisans SET is_approved = TRUE WHERE id = ?', [req.params.id]);
    res.json({ message: 'Artisan approved!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
