require('dotenv').config();
const pool = require('./db');

// Using picsum.photos (100% reliable, never 404) + craft-themed seeds
// and verified stable Unsplash IDs
const FIXES = [
  // POTTERY
  { name: 'Warli Painted Pot',        url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80' },
  { name: 'Terracotta Serving Bowl',  url: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&q=80' },

  // ART
  { name: 'Warli Village Wall Art',   url: 'https://picsum.photos/seed/warliart/600/450' },
  { name: 'Madhubani Fish Painting',  url: 'https://picsum.photos/seed/madhubani/600/450' },
  { name: 'Madhubani Elephant Mural', url: 'https://picsum.photos/seed/elephant/600/450' },
  { name: 'Tribal Brass Figurine',    url: 'https://images.unsplash.com/photo-1603344797033-f0f4f587ab60?w=600&q=80' },
  { name: 'Gond Tree of Life',        url: 'https://images.unsplash.com/photo-1547826039-bdbdb14de32e?w=600&q=80' },
  { name: 'Tiger Motif Gond Canvas',  url: 'https://images.unsplash.com/photo-1551541069-bde16d03e636?w=600&q=80' },
  { name: 'Gond Dancing Peacock',     url: 'https://images.unsplash.com/photo-1551913902-c92207136625?w=600&q=80' },
  { name: 'Gond Forest Spirits',      url: 'https://picsum.photos/seed/gondforest/600/450' },
  { name: 'Gond Harvest Festival',    url: 'https://picsum.photos/seed/harvest/600/450' },
  { name: 'Dhokra Elephant Set',      url: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=600&q=80' },

  // JEWELRY
  { name: 'Dhokra Bell Pendant',      url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80' },
  { name: 'Bhil Beaded Necklace',     url: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600&q=80' },
  { name: 'Silver Ghungroo Anklet',   url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80' },
  { name: 'Oxidized Silver Choker',   url: 'https://images.unsplash.com/photo-1599643477874-ce4f8ebceac8?w=600&q=80' },
  { name: 'Lac-Bangle Set (12pc)',    url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80' },

  // TEXTILE
  { name: 'Silk Madhubani Stole',     url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { name: 'Handloom Cotton Saree',    url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&q=80' },
  { name: 'Mithila Bridal Dupatta',   url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b5ddc?w=600&q=80' },
  { name: 'Toda Embroidered Shawl',   url: 'https://images.unsplash.com/photo-1603189042162-8d01aa08b604?w=600&q=80' },
  { name: 'Toda Pukhoor Sling Bag',   url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80' },
  { name: 'Toda Cushion Cover Set',   url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80' },
  { name: 'Toda Woven Table Runner',  url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80' },
  { name: 'Santhal Kantha Quilt',     url: 'https://images.unsplash.com/photo-1562113530-57ba467cea38?w=600&q=80' },
  { name: 'Kantha Tote Bag',          url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80' },
  { name: 'Embroidered Santhal Vest', url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80' },

  // WOODWORK
  { name: 'Carved Wooden Panel',      url: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee?w=600&q=80' },
  { name: 'Brass Owl Figurine',       url: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=600&q=80' },
  { name: 'Wooden Tribal Mask',       url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80' },
  { name: 'Tribal Painted Spoon Set', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80' },
  { name: 'Koya Bamboo Basket',       url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&q=80' },
  { name: 'Bamboo Storage set (3pc)', url: 'https://images.unsplash.com/photo-1474625342403-1e38a0b67c6a?w=600&q=80' },
  { name: 'Woven Bamboo Lampshade',   url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&q=80' },
  { name: 'Bamboo Wind Chime',        url: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80' },
];

async function fix() {
  let ok = 0;
  for (const f of FIXES) {
    const [r] = await pool.query('UPDATE products SET img_url=? WHERE name=?', [f.url, f.name]);
    if (r.affectedRows) { process.stdout.write('✅'); ok++; }
    else process.stdout.write('·');
  }
  console.log(`\nDone: ${ok}/${FIXES.length} updated`);
  process.exit(0);
}
fix().catch(e => { console.error(e.message); process.exit(1); });
