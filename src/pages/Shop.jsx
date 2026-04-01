import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../api/api';

const CATS = [
  { id: 'all', label: 'All', img: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=400&q=80' },
  { id: 'pottery', label: 'Pottery', img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80' },
  { id: 'textile', label: 'Textile', img: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400&q=80' },
  { id: 'jewelry', label: 'Jewelry', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80' },
  { id: 'art', label: 'Art', img: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=400&q=80' },
  { id: 'woodwork', label: 'Woodwork', img: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&q=80' }
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getProducts(filter === 'all' ? null : filter)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    return !q || p.name?.toLowerCase().includes(q) || p.tribe?.toLowerCase().includes(q) || p.artisan_name?.toLowerCase().includes(q);
  });

  return (
    <div style={{paddingTop:'72px'}}>
      <div style={{background:'linear-gradient(rgba(28,16,8,0.8), rgba(28,16,8,0.8)), url(https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80) center/cover no-repeat',padding:'4rem 2rem',textAlign:'center'}}>
        <div style={{fontFamily:'monospace',fontSize:'0.7rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'1rem'}}>Marketplace</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'3rem',color:'var(--cream)',marginBottom:'2rem'}}>All <em style={{color:'var(--gold)'}}>Handcrafted</em> Items</h1>
        <div style={{display:'flex',maxWidth:'600px',margin:'0 auto'}}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search crafts, tribes, artisans..."
            style={{flex:1,padding:'1rem 1.5rem',border:'none',background:'rgba(255,255,255,0.1)',color:'var(--cream)',fontFamily:"'Crimson Pro',serif",fontSize:'1rem',outline:'none'}}
          />
          <button style={{background:'var(--ochre)',color:'var(--cream)',border:'none',padding:'0 1.5rem',fontFamily:'monospace',fontSize:'0.75rem',letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer'}}>
            Search
          </button>
        </div>
      </div>

      <div style={{display:'flex',justifyContent:'center',gap:'2rem',padding:'3rem 2rem',flexWrap:'wrap',background:'var(--cream)',borderBottom:'1px solid var(--sand)'}}>
        {CATS.map(c => (
          <div key={c.id} onClick={() => setFilter(c.id)} style={{cursor:'pointer',textAlign:'center',width:'80px'}}>
            <div style={{width:'80px',height:'80px',borderRadius:'50%',margin:'0 auto 0.8rem',overflow:'hidden',border:filter===c.id?'3px solid var(--ochre)':'3px solid transparent',transition:'all 0.2s',boxShadow:filter===c.id?'0 8px 16px rgba(196,116,42,0.3)':'0 4px 12px rgba(0,0,0,0.1)',transform:filter===c.id?'scale(1.05)':'scale(1)'}}>
              <img src={c.img} alt={c.label} style={{width:'100%',height:'100%',objectFit:'cover'}} />
            </div>
            <div style={{fontFamily:'monospace',fontSize:'0.75rem',letterSpacing:'0.05em',textTransform:'uppercase',color:filter===c.id?'var(--ochre)':'var(--deep-brown)',fontWeight:filter===c.id?'bold':'normal'}}>
              {c.label}
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{textAlign:'center',padding:'4rem',fontFamily:'monospace',color:'var(--mud)'}}>Loading products...</div>
      ) : filtered.length === 0 ? (
        <div style={{textAlign:'center',padding:'4rem',color:'var(--mud)'}}>No products found.</div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'2px',padding:'2px',maxWidth:'1400px',margin:'0 auto'}}>
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
