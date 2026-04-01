const pool = require('./db');

const products = [
  // Pottery
  { artisan_id: 1, name: "Terracotta Planter Duo", description: "Set of two rustic red earth planters, handmade.", price: 850, old_price: 1000, category: "pottery", tribe: "Warli", state: "Maharashtra", img_url: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&q=80", stock: 15 },
  { artisan_id: 1, name: "Glazed Clay Cups", description: "Set of 4 handmade tribal clay cups for chai.", price: 600, category: "pottery", tribe: "Warli", state: "Maharashtra", img_url: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&q=80", stock: 20 },
  { artisan_id: 1, name: "Earthen Water Pitcher", description: "Natural cooling earthen pot for summer water storage.", price: 1200, category: "pottery", tribe: "Warli", state: "Maharashtra", img_url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&q=80", stock: 8 },

  // Textile
  { artisan_id: 4, name: "Toda Embroidered Cushion Covers", description: "Authentic Toda red and black embroidery on pristine white cotton. Pack of 2.", price: 1800, old_price: 2200, category: "textile", tribe: "Toda", state: "Tamil Nadu", img_url: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=500&q=80", stock: 12 },
  { artisan_id: 4, name: "Tribal Loom Woven Rug", description: "Heavy duty handmade cotton rug with geometric tribal patterns.", price: 4500, category: "textile", tribe: "Toda", state: "Tamil Nadu", img_url: "https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?w=500&q=80", stock: 5 },
  { artisan_id: 3, name: "Mithila Hand-woven Dupatta", description: "Silk mixed Dupatta intricately handwoven by women artisans.", price: 2800, category: "textile", tribe: "Mithila", state: "Bihar", img_url: "https://images.unsplash.com/photo-1583391733958-cddbf0bd3d25?w=500&q=80", stock: 10 },

  // Jewelry
  { artisan_id: 6, name: "Oxidized Silver Choker", description: "Statement heavy tribal neckpiece with traditional Ghungroo drops.", price: 3400, category: "jewelry", tribe: "Bhil", state: "Rajasthan", img_url: "https://images.unsplash.com/photo-1599643477874-ce4f8ebceac8?w=500&q=80", stock: 6 },
  { artisan_id: 6, name: "Beaded Long Tribal Necklace", description: "Multi-colored glass beads woven ceremonially.", price: 1250, category: "jewelry", tribe: "Bhil", state: "Rajasthan", img_url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80", stock: 15 },
  { artisan_id: 2, name: "Dhokra Bell Earrings", description: "Lost wax method brass drop earrings.", price: 850, category: "jewelry", tribe: "Bastar", state: "Chhattisgarh", img_url: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=500&q=80", stock: 20 },

  // Art
  { artisan_id: 5, name: "Gond Canvas: Dancing Peacock", description: "Vibrant dots and dashes bring a mystical peacock to life.", price: 3800, category: "art", tribe: "Gond", state: "Madhya Pradesh", img_url: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=500&q=80", stock: 3 },
  { artisan_id: 1, name: "Warli Canvas: Harvest Festival", description: "Intricate depiction of village celebrations in classic white on brown rustic canvas.", price: 4200, category: "art", tribe: "Warli", state: "Maharashtra", img_url: "https://images.unsplash.com/photo-1578926288207-a90a5e9c9f3a?w=500&q=80", stock: 4 },
  { artisan_id: 3, name: "Madhubani Elephant Fresco", description: "Symbol of strength painted in bright natural pigments. Large size.", price: 5500, category: "art", tribe: "Mithila", state: "Bihar", img_url: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=500&q=80", stock: 2 },

  // Woodwork
  { artisan_id: 2, name: "Bastar Carved Teak Tray", description: "Functional woodwork tray with intricate borders.", price: 1600, category: "woodwork", tribe: "Bastar", state: "Chhattisgarh", img_url: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500&q=80", stock: 10 },
  { artisan_id: 1, name: "Tribal Painted Wooden Spoons", description: "Set of 3 hand-carved and painted bamboo cooking spoons.", price: 850, category: "woodwork", tribe: "Warli", state: "Maharashtra", img_url: "https://images.unsplash.com/photo-1588693952796-08103ee7c4a1?w=500&q=80", stock: 25 },
  { artisan_id: 2, name: "Wooden Elephant Sculpture", description: "Solid block carving of an elephant by master craftsmen.", price: 8500, old_price: 9000, category: "woodwork", tribe: "Bastar", state: "Chhattisgarh", img_url: "https://images.unsplash.com/photo-1541312567258-3604b732e4d0?w=500&q=80", stock: 2 }
];

async function seedProducts() {
  try {
    for (let p of products) {
      await pool.query(
        'INSERT INTO products (artisan_id, name, description, price, old_price, category, tribe, state, img_url, stock, is_approved) VALUES (?,?,?,?,?,?,?,?,?,?,TRUE)',
        [p.artisan_id, p.name, p.description, p.price, p.old_price || null, p.category, p.tribe, p.state, p.img_url, p.stock]
      );
    }
    console.log('Successfully added ' + products.length + ' beautiful new products across all categories to the database!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding products:', err);
    process.exit(1);
  }
}

seedProducts();
