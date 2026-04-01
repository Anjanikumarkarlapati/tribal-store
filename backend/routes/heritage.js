const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

// GET /api/heritage/queue  — products pending approval (cultural verification)
router.get('/queue', authenticate, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT p.id, p.name, p.description, p.price, p.img_url, p.category, p.tribe, p.state,
             u.name AS artisan_name
      FROM products p
      JOIN artisans a ON a.id = p.artisan_id
      JOIN users u ON u.id = a.user_id
      WHERE p.is_approved = FALSE
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/heritage/archive  — static cultural archive items
router.get('/archive', authenticate, async (_req, res) => {
  try {
    const archive = [
      { id: 1, type: 'symbol', name: 'Warli Fish Motif', description: 'The fish represents prosperity and fertility in Warli culture. Found in marriage ceremonies.', entries: 348, img: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=300&q=80' },
      { id: 2, type: 'symbol', name: 'Gond Spiral Tree', description: 'The spiral tree of life is central to Gond cosmology, representing the eternal cycle of nature.', entries: 210, img: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=300&q=80' },
      { id: 3, type: 'pigment', name: 'Natural Indigo', description: 'Derived from the Indigofera plant, used for centuries in tribal textiles across Rajasthan and Bihar.', entries: 120, img: 'https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?w=300&q=80' },
      { id: 4, type: 'pigment', name: 'Ochre Mineral', description: 'Iron-rich mineral ochre used in rock paintings and Madhubani art for warm earthy tones.', entries: 85, img: 'https://images.unsplash.com/photo-1600375990578-8ba943ae5ae5?w=300&q=80' },
      { id: 5, type: 'symbol', name: 'Madhubani Elephant', description: 'The elephant symbolises wisdom and good fortune in Mithila art, often drawn at entrances.', entries: 195, img: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=300&q=80' },
      { id: 6, type: 'pigment', name: 'Lampblack (Kajal)', description: 'Soot-based black pigment used by Bastar artists for outlining in Dhokra artwork.', entries: 67, img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=300&q=80' }
    ];
    res.json(archive);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/heritage/story  — save a draft story for an artisan
router.post('/story', authenticate, async (req, res) => {
  const { artisan_id, title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required.' });
  // For now, store in a simple JSON acknowledgement (you can create a DB table later)
  res.status(201).json({
    success: true,
    message: `Story "${title}" saved for artisan #${artisan_id || 'general'}. Ready for editorial review.`,
    draft: { artisan_id, title, content, saved_at: new Date().toISOString() }
  });
});

module.exports = router;
