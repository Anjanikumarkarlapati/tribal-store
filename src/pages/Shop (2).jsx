import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../api/api';

const CATS = ['all','pottery','textile','jewelry','art','woodwork'];

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
      <div style={{background:'var(--deep-brown)',padding:'3rem 2rem',textAlign:'center'}}>
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

      <div style={{display:'flex',justifyContent:'center',gap:'1rem',padding:'2rem',flexWrap:'wrap',background:'var(--sand)'}}>
        {CATS.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{fontFamily:'monospace',fontSize:'0.7rem',letterSpacing:'0.1em',textTransform:'uppercase',padding:'0.5rem 1.5rem',border:'1px solid',cursor:'pointer',background:filter===c?'var(--deep-brown)':'transparent',color:filter===c?'var(--cream)':'var(--mud)',borderColor:filter===c?'var(--deep-brown)':'var(--mud)'}}>
            {c === 'all' ? 'All' : c.charAt(0).toUpperCase()+c.slice(1)}
          </button>
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
