require('dotenv').config();
const pool = require('./db');

// ─── USERS (artisans) ────────────────────────────────────────────────────────
const users = [
  { name: 'Sunita Barku',  email: 'sunita@example.com',  role: 'artisan', phone: '9876543210' },
  { name: 'Ramesh Ganda',  email: 'ramesh@example.com',  role: 'artisan', phone: '8765432109' },
  { name: 'Kamla Devi',    email: 'kamla@example.com',   role: 'artisan', phone: '7654321098' },
  { name: 'Lakshmi Devi',  email: 'lakshmi@example.com', role: 'artisan', phone: '6543210987' },
  { name: 'Naveen Gond',   email: 'naveen@example.com',  role: 'artisan', phone: '5432109876' },
  { name: 'Bhil Ram',      email: 'bhil@example.com',    role: 'artisan', phone: '4321098765' },
  { name: 'Priya Santhal', email: 'priya@example.com',   role: 'artisan', phone: '3210987654' },
  { name: 'Mohan Koya',    email: 'mohan@example.com',   role: 'artisan', phone: '2109876543' },
];

// password123 bcrypt hash
const PASS = '$2a$10$sloC4xKd4H2zpUbOWOq8Y.fslM1yIqVJAFQ98SMl7B.eLtDckOx16';

// ─── ARTISAN PROFILES ────────────────────────────────────────────────────────
const artisanProfiles = {
  'sunita@example.com':  { tribe: 'Warli Tribe',      state: 'Maharashtra',    specialty: 'Warli Paintings',         bio: 'Third-generation Warli painter from Palghar district. Sunita\'s intricate dot-and-line motifs narrate daily village life and harvest festivals.',          total_products: 5,  total_sales: 25,  avg_rating: 4.8, profile_img: 'https://randomuser.me/api/portraits/women/40.jpg' },
  'ramesh@example.com':  { tribe: 'Bastar Tribe',     state: 'Chhattisgarh',   specialty: 'Dhokra Metal Casting',    bio: 'Master of the ancient lost-wax casting technique. Ramesh\'s brass figurines draw inspiration from Bastar forest wildlife and tribal deities.',                total_products: 8,  total_sales: 42,  avg_rating: 4.9, profile_img: 'https://randomuser.me/api/portraits/men/43.jpg' },
  'kamla@example.com':   { tribe: 'Mithila Community',state: 'Bihar',          specialty: 'Madhubani Paintings',     bio: 'Known for vibrant Madhubani art depicting nature and mythology. Kamla received national recognition for her contributions to this ancient folk tradition.',     total_products: 24, total_sales: 187, avg_rating: 4.7, profile_img: 'https://randomuser.me/api/portraits/women/65.jpg' },
  'lakshmi@example.com': { tribe: 'Toda Tribe',       state: 'Tamil Nadu',     specialty: 'Embroidered Textiles',    bio: 'Expert in traditional Toda red-and-black embroidery. Lakshmi is one of only 12 remaining women who practice the sacred Pukhoor embroidery technique.',        total_products: 12, total_sales: 65,  avg_rating: 4.9, profile_img: 'https://randomuser.me/api/portraits/women/26.jpg' },
  'naveen@example.com':  { tribe: 'Gond Tribe',       state: 'Madhya Pradesh', specialty: 'Gond Art',                bio: 'Renowned Gond artist capturing folklore elements of nature. Naveen\'s vibrant canvases are featured in national galleries and international exhibitions.',       total_products: 15, total_sales: 80,  avg_rating: 4.8, profile_img: 'https://randomuser.me/api/portraits/men/22.jpg' },
  'bhil@example.com':    { tribe: 'Bhil Tribe',       state: 'Rajasthan',      specialty: 'Beaded Jewelry',          bio: 'Creating intricate tribal beaded jewelry for two decades. Bhil Ram\'s necklaces and anklets blend ancestral patterns with contemporary wearable aesthetics.',  total_products: 9,  total_sales: 30,  avg_rating: 4.7, profile_img: 'https://randomuser.me/api/portraits/men/33.jpg' },
  'priya@example.com':   { tribe: 'Santhal Tribe',    state: 'Jharkhand',      specialty: 'Kantha Embroidery',       bio: 'Priya leads a women\'s cooperative of 30 Santhal artisans, producing stunning Kantha quilts that transform simple cloth into intricate stories of their land.',    total_products: 7,  total_sales: 48,  avg_rating: 4.8, profile_img: 'https://randomuser.me/api/portraits/women/55.jpg' },
  'mohan@example.com':   { tribe: 'Koya Tribe',       state: 'Andhra Pradesh', specialty: 'Bamboo Craft',            bio: 'Mohan is a skilled bamboo craftsman from the Godavari delta region. His handwoven baskets and furniture pieces celebrate the Koya relationship with the forest.',  total_products: 11, total_sales: 58,  avg_rating: 4.6, profile_img: 'https://randomuser.me/api/portraits/men/67.jpg' },
};

// ─── PRODUCTS (keyed by email to resolve artisan_id) ───────────────────────
const productsByEmail = {
  'sunita@example.com': [
    { name: 'Warli Painted Pot',        description: 'Hand-painted Warli motifs on river clay. A 2,500-year-old tradition from Maharashtra.',         price: 1200, old_price: 1500, category: 'pottery',  tribe: 'Warli Tribe',       state: 'Maharashtra',    img_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&q=80', badge: 'Bestseller', avg_stars: 5.0, stock: 10 },
    { name: 'Warli Village Wall Art',   description: 'Large canvas depicting village life in classic Warli white-on-terracotta style.',               price: 2800, old_price: null, category: 'art',      tribe: 'Warli Tribe',       state: 'Maharashtra',    img_url: 'https://images.unsplash.com/photo-1578926288207-a90a5e9c9f3a?w=500&q=80', badge: null,         avg_stars: 4.8, stock: 5 },
    { name: 'Terracotta Serving Bowl',  description: 'Rustic red clay serving bowl baked in an earth-pit kiln.',                                     price:  600, old_price: null, category: 'pottery',  tribe: 'Warli Tribe',       state: 'Maharashtra',    img_url: 'https://images.unsplash.com/photo-1610700084795-95027fc6479b?w=500&q=80', badge: null,         avg_stars: 4.6, stock: 25 },
    { name: 'Wooden Tribal Mask',       description: 'Carved wooden mask used in traditional village harvest dances.',                               price: 2200, old_price: null, category: 'woodwork', tribe: 'Warli Tribe',       state: 'Maharashtra',    img_url: 'https://images.unsplash.com/photo-1541312567258-3604b732e4d0?w=500&q=80', badge: null,         avg_stars: 4.7, stock: 5 },
    { name: 'Tribal Painted Spoon Set', description: 'Set of 3 hand-carved and painted bamboo cooking spoons with Warli motifs.',                    price:  750, old_price: null, category: 'woodwork', tribe: 'Warli Tribe',       state: 'Maharashtra',    img_url: 'https://images.unsplash.com/photo-1588693952796-08103ee7c4a1?w=500&q=80', badge: null,         avg_stars: 4.5, stock: 18 },
  ],
  'ramesh@example.com': [
    { name: 'Dhokra Bell Pendant',      description: 'Ancient lost-wax brass casting. No two pieces are identical — a one-of-a-kind heirloom.',       price:  850, old_price: null, category: 'jewelry',  tribe: 'Bastar Tribe',      state: 'Chhattisgarh',   img_url: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=500&q=80', badge: null,         avg_stars: 5.0, stock: 5 },
    { name: 'Tribal Brass Figurine',    description: 'A dancing Gond figure cast in brass using the 5,000-year-old Dhokra technique.',                price: 3200, old_price: 3800, category: 'art',      tribe: 'Bastar Tribe',      state: 'Chhattisgarh',   img_url: 'https://images.unsplash.com/photo-1559181567-c3190b60b13d?w=500&q=80', badge: 'Rare',        avg_stars: 4.9, stock: 3 },
    { name: 'Carved Wooden Panel',      description: 'Intricately carved teak wood depicting Bastar tribal folklore and forest spirits.',              price: 5200, old_price: 6000, category: 'woodwork', tribe: 'Bastar Tribe',      state: 'Chhattisgarh',   img_url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500&q=80', badge: 'Artisan Choice', avg_stars: 4.9, stock: 2 },
    { name: 'Brass Owl Figurine',       description: 'Small intricately cast Dhokra owl, symbolising wisdom and protection.',                        price: 1500, old_price: 1800, category: 'woodwork', tribe: 'Bastar Tribe',      state: 'Chhattisgarh',   img_url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500&q=80', badge: 'Top Rated',   avg_stars: 4.9, stock: 12 },
    { name: 'Dhokra Elephant Set',      description: 'Pair of brass Dhokra elephants in traditional Bastar style, ideal as decor.',                  price: 2400, old_price: 2800, category: 'art',      tribe: 'Bastar Tribe',      state: 'Chhattisgarh',   img_url: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=500&q=80', badge: null,         avg_stars: 4.8, stock: 7 },
  ],
  'kamla@example.com': [
    { name: 'Madhubani Fish Painting',  description: 'Traditional Mithila fish motifs in natural pigments on handmade paper.',                       price: 1500, old_price: null, category: 'art',      tribe: 'Mithila Community', state: 'Bihar',          img_url: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=500&q=80', badge: null,         avg_stars: 4.7, stock: 8 },
    { name: 'Silk Madhubani Stole',     description: 'Hand-painted Madhubani design on pure silk — wearable art from Bihar.',                        price: 4500, old_price: 5000, category: 'textile',  tribe: 'Mithila Community', state: 'Bihar',          img_url: 'https://images.unsplash.com/photo-1603189042162-8d01aa08b604?w=500&q=80', badge: 'New',         avg_stars: 4.8, stock: 4 },
    { name: 'Handloom Cotton Saree',    description: 'Woven pure-cotton saree featuring vibrant traditional Mithila borders.',                       price: 3800, old_price: 4200, category: 'textile',  tribe: 'Mithila Community', state: 'Bihar',          img_url: 'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=500&q=80', badge: 'Popular',     avg_stars: 4.8, stock: 7 },
    { name: 'Madhubani Elephant Mural', description: 'Symbol of strength painted in bright natural pigments. Large-size canvas perfect for walls.',  price: 5500, old_price: null, category: 'art',      tribe: 'Mithila Community', state: 'Bihar',          img_url: 'https://images.unsplash.com/photo-1578926288207-a90a5e9c9f3a?w=500&q=80', badge: null,         avg_stars: 4.9, stock: 2 },
    { name: 'Mithila Bridal Dupatta',   description: 'Silk mixed dupatta intricately handwoven with ceremonial Madhubani patterns.',                 price: 2800, old_price: null, category: 'textile',  tribe: 'Mithila Community', state: 'Bihar',          img_url: 'https://images.unsplash.com/photo-1583391733958-cddbf0bd3d25?w=500&q=80', badge: null,         avg_stars: 4.7, stock: 10 },
  ],
  'lakshmi@example.com': [
    { name: 'Toda Embroidered Shawl',   description: 'Authentic red and black thread embroidery on white cotton fabric by Toda women.',               price: 3500, old_price: 4000, category: 'textile',  tribe: 'Toda Tribe',        state: 'Tamil Nadu',     img_url: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=500&q=80', badge: 'Featured',    avg_stars: 5.0, stock: 15 },
    { name: 'Toda Pukhoor Sling Bag',   description: 'A traditional sling bag showcasing intricate Toda geometrical embroidery.',                    price: 1200, old_price: null, category: 'textile',  tribe: 'Toda Tribe',        state: 'Tamil Nadu',     img_url: 'https://images.unsplash.com/photo-1620000628383-7f2ded41c59c?w=500&q=80', badge: null,         avg_stars: 4.8, stock: 10 },
    { name: 'Toda Cushion Cover Set',   description: 'Pack of 2 cushion covers with Toda embroidery, a UNESCO-recognised textile art.',               price: 1800, old_price: 2200, category: 'textile',  tribe: 'Toda Tribe',        state: 'Tamil Nadu',     img_url: 'https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?w=500&q=80', badge: null,         avg_stars: 4.9, stock: 12 },
    { name: 'Toda Woven Table Runner',  description: 'Long table runner in traditional black-and-red Toda patterns, hand-loomed on a backstrap loom.',price: 2100, old_price: null, category: 'textile',  tribe: 'Toda Tribe',        state: 'Tamil Nadu',     img_url: 'https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?w=500&q=80', badge: null,         avg_stars: 4.7, stock: 8 },
  ],
  'naveen@example.com': [
    { name: 'Gond Tree of Life',        description: 'A vibrant Gond painting showcasing the interconnectedness of forest life.',                     price: 4500, old_price: 5200, category: 'art',      tribe: 'Gond Tribe',        state: 'Madhya Pradesh', img_url: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=500&q=80', badge: 'Bestseller',  avg_stars: 4.9, stock: 5 },
    { name: 'Tiger Motif Gond Canvas',  description: 'A detailed large-format painting of the mystical Gond tiger in signature dot-and-dash style.',  price: 3000, old_price: null, category: 'art',      tribe: 'Gond Tribe',        state: 'Madhya Pradesh', img_url: 'https://images.unsplash.com/photo-1606868306217-dbf5046868d2?w=500&q=80', badge: null,         avg_stars: 4.7, stock: 3 },
    { name: 'Gond Dancing Peacock',     description: 'Vibrant dots and dashes bring a mystical peacock to life on hand-made canvas.',                 price: 3800, old_price: null, category: 'art',      tribe: 'Gond Tribe',        state: 'Madhya Pradesh', img_url: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=500&q=80', badge: null,         avg_stars: 4.8, stock: 4 },
    { name: 'Gond Forest Spirits',      description: 'Large Gond canvas depicting the sacred forest spirits revered by the Gondi people.',            price: 6200, old_price: 7000, category: 'art',      tribe: 'Gond Tribe',        state: 'Madhya Pradesh', img_url: 'https://images.unsplash.com/photo-1606868306217-dbf5046868d2?w=500&q=80', badge: 'Rare',        avg_stars: 5.0, stock: 2 },
    { name: 'Gond Harvest Festival',    description: 'Celebrates the Gond harvest season with concentric bands of animals and village scenes.',       price: 4100, old_price: null, category: 'art',      tribe: 'Gond Tribe',        state: 'Madhya Pradesh', img_url: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=500&q=80', badge: null,         avg_stars: 4.6, stock: 6 },
  ],
  'bhil@example.com': [
    { name: 'Bhil Beaded Necklace',     description: 'Hand-strung colorful glass beads forming a traditional ceremonial Bhil necklace.',              price:  950, old_price: 1200, category: 'jewelry',  tribe: 'Bhil Tribe',        state: 'Rajasthan',      img_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80', badge: 'New',         avg_stars: 4.8, stock: 20 },
    { name: 'Silver Ghungroo Anklet',   description: 'Heavy oxidized silver anklet with tiny bells, traditionally worn by Bhil women.',               price: 2800, old_price: null, category: 'jewelry',  tribe: 'Bhil Tribe',        state: 'Rajasthan',      img_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80', badge: 'Classic',     avg_stars: 4.9, stock: 8 },
    { name: 'Oxidized Silver Choker',   description: 'Statement heavy tribal neckpiece with traditional Ghungroo drops and silver inlay work.',       price: 3400, old_price: null, category: 'jewelry',  tribe: 'Bhil Tribe',        state: 'Rajasthan',      img_url: 'https://images.unsplash.com/photo-1599643477874-ce4f8ebceac8?w=500&q=80', badge: null,         avg_stars: 4.8, stock: 6 },
    { name: 'Lac-Bangle Set (12pc)',    description: 'Traditional Bhil lac bangles in vibrant earth tones, hand-rolled and set on wooden molds.',     price:  680, old_price:  800, category: 'jewelry',  tribe: 'Bhil Tribe',        state: 'Rajasthan',      img_url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80', badge: null,         avg_stars: 4.7, stock: 30 },
  ],
  'priya@example.com': [
    { name: 'Santhal Kantha Quilt',     description: 'A vibrant Kantha quilt hand-stitched by the women of the Santhal cooperative in Jharkhand.',  price: 4800, old_price: 5500, category: 'textile',  tribe: 'Santhal Tribe',     state: 'Jharkhand',      img_url: 'https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?w=500&q=80', badge: 'Featured',    avg_stars: 5.0, stock: 4 },
    { name: 'Kantha Tote Bag',          description: 'Sturdy cotton tote with Kantha embroidery; strong, beautiful, and eco-friendly.',              price: 1100, old_price: null, category: 'textile',  tribe: 'Santhal Tribe',     state: 'Jharkhand',      img_url: 'https://images.unsplash.com/photo-1620000628383-7f2ded41c59c?w=500&q=80', badge: null,         avg_stars: 4.7, stock: 15 },
    { name: 'Embroidered Santhal Vest', description: 'Traditional Santhal body vest adorned with mirror work and Kantha running stitch.',             price: 3200, old_price: null, category: 'textile',  tribe: 'Santhal Tribe',     state: 'Jharkhand',      img_url: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=500&q=80', badge: null,         avg_stars: 4.8, stock: 6 },
  ],
  'mohan@example.com': [
    { name: 'Koya Bamboo Basket',       description: 'Hand-woven bamboo basket using age-old Koya techniques from the Godavari delta forests.',       price:  750, old_price: null, category: 'woodwork', tribe: 'Koya Tribe',         state: 'Andhra Pradesh', img_url: 'https://images.unsplash.com/photo-1588693952796-08103ee7c4a1?w=500&q=80', badge: null,         avg_stars: 4.5, stock: 22 },
    { name: 'Bamboo Storage set (3pc)', description: 'Three graduated bamboo canisters with tight-fitting lids for spice or tea storage.',            price: 1350, old_price: 1600, category: 'woodwork', tribe: 'Koya Tribe',         state: 'Andhra Pradesh', img_url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500&q=80', badge: null,         avg_stars: 4.6, stock: 10 },
    { name: 'Woven Bamboo Lampshade',   description: 'Elegant pendant lampshade handwoven in a diamond-weave pattern from sustainably sourced bamboo.',price: 2200, old_price: null, category: 'woodwork', tribe: 'Koya Tribe',         state: 'Andhra Pradesh', img_url: 'https://images.unsplash.com/photo-1541312567258-3604b732e4d0?w=500&q=80', badge: 'New',         avg_stars: 4.7, stock: 7 },
    { name: 'Bamboo Wind Chime',        description: 'Melodic wind chime made from hollow bamboo tubes, each tuned to a different tone by hand.',     price:  980, old_price: null, category: 'woodwork', tribe: 'Koya Tribe',         state: 'Andhra Pradesh', img_url: 'https://images.unsplash.com/photo-1588693952796-08103ee7c4a1?w=500&q=80', badge: null,         avg_stars: 4.8, stock: 14 },
  ],
};

async function seedAll() {
  try {
    console.log('🌱 Starting full seed...\n');

    for (const u of users) {
      // Upsert user
      await pool.query(
        `INSERT INTO users (name, email, password, role, phone)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), phone=VALUES(phone)`,
        [u.name, u.email, PASS, u.role, u.phone]
      );

      const [[{ id: userId }]] = await pool.query('SELECT id FROM users WHERE email = ?', [u.email]);
      const p = artisanProfiles[u.email];

      // Upsert artisan profile
      await pool.query(
        `INSERT INTO artisans (user_id, tribe, state, specialty, bio, is_approved, total_products, total_sales, avg_rating, profile_img)
         VALUES (?, ?, ?, ?, ?, TRUE, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           tribe=VALUES(tribe), state=VALUES(state), specialty=VALUES(specialty),
           bio=VALUES(bio), is_approved=TRUE, total_products=VALUES(total_products),
           total_sales=VALUES(total_sales), avg_rating=VALUES(avg_rating), profile_img=VALUES(profile_img)`,
        [userId, p.tribe, p.state, p.specialty, p.bio, p.total_products, p.total_sales, p.avg_rating, p.profile_img]
      );

      const [[{ id: artisanId }]] = await pool.query('SELECT id FROM artisans WHERE user_id = ?', [userId]);

      // Seed products for this artisan
      const prods = productsByEmail[u.email] || [];
      let inserted = 0;
      for (const prod of prods) {
        // Only insert if product doesn't already exist for this artisan
        const [[existing]] = await pool.query(
          'SELECT id FROM products WHERE artisan_id = ? AND name = ?', [artisanId, prod.name]
        );
        if (!existing) {
          await pool.query(
            `INSERT INTO products (artisan_id, name, description, price, old_price, category, tribe, state, img_url, badge, avg_stars, stock, is_approved, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, TRUE)`,
            [artisanId, prod.name, prod.description, prod.price, prod.old_price || null,
             prod.category, prod.tribe, prod.state, prod.img_url, prod.badge || null,
             prod.avg_stars, prod.stock]
          );
          inserted++;
        }
      }
      console.log(`✅  ${u.name} — artisan profile + ${inserted}/${prods.length} new products inserted`);
    }

    console.log('\n🎉 Seed complete! All artisans and products are in the database.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seedAll();
