import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import ProductCard from '../components/ProductCard';
import ArtisanCard from '../components/ArtisanCard';

const CATS = [
  { id: 'all', label: 'All', img: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=400&q=80' },
  { id: 'pottery', label: 'Pottery', img: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80' },
  { id: 'textile', label: 'Textile', img: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=400&q=80' },
  { id: 'jewelry', label: 'Jewelry', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80' },
  { id: 'art', label: 'Art', img: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=400&q=80' },
  { id: 'woodwork', label: 'Woodwork', img: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400&q=80' }
];

export default function Home() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [products, setProducts] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getProducts(), api.getArtisans()])
      .then(([p, a]) => { setProducts(p); setArtisans(a); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => filter === 'all' || p.category === filter).slice(0, 8);

  return (
    <div style={{paddingTop:'72px'}}>
      {/* HERO */}
      <section style={{minHeight:'calc(100vh - 72px)',background:'linear-gradient(to right, rgba(28,16,8,0.95) 0%, rgba(28,16,8,0.7) 100%), url(https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&q=80) center/cover no-repeat',display:'grid',gridTemplateColumns:'1fr 1fr',overflow:'hidden',position:'relative'}}>
        <div style={{padding:'8rem 5rem',position:'relative',zIndex:2,display:'flex',flexDirection:'column',justifyContent:'center'}}>
          <div style={{fontFamily:'monospace',fontSize:'0.7rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'2rem'}}>✦ Authentic Tribal Craftsmanship</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'4.5rem',color:'var(--cream)',lineHeight:1.05,marginBottom:'2rem'}}>
            Where <em style={{color:'var(--gold)'}}>Ancient</em><br />Hands Meet<br />Global Hearts
          </h1>
          <p style={{color:'var(--sand)',fontSize:'1.2rem',fontWeight:300,lineHeight:1.8,maxWidth:'42ch',marginBottom:'3rem'}}>
            A marketplace connecting tribal artisans directly with conscious buyers worldwide.
          </p>
          <div style={{display:'flex',gap:'1.5rem'}}>
            <button onClick={() => navigate('/shop')} style={{background:'var(--ochre)',color:'var(--cream)',border:'none',padding:'1rem 2.5rem',fontFamily:'monospace',fontSize:'0.8rem',letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer'}}>
              Explore Crafts
            </button>
            <button onClick={() => navigate('/roles')} style={{background:'transparent',color:'var(--sand)',border:'1px solid rgba(255,255,255,0.2)',padding:'1rem 2.5rem',fontFamily:'monospace',fontSize:'0.8rem',letterSpacing:'0.1em',textTransform:'uppercase',cursor:'pointer'}}>
              Become an Artisan
            </button>
          </div>
        </div>
        <div style={{position:'relative',zIndex:2,display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',padding:'3rem',alignContent:'center'}}>
          {products.slice(0,4).map(p => (
            <div key={p.id} onClick={() => navigate('/shop/'+p.id)} style={{overflow:'hidden',border:'1px solid rgba(196,116,42,0.3)',cursor:'pointer',height:'200px',position:'relative'}}>
              <img src={p.img_url} alt={p.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
              <div style={{position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(transparent,rgba(28,16,8,0.9))',padding:'0.8rem'}}>
                <div style={{fontFamily:"'Playfair Display',serif",color:'var(--cream)',fontSize:'0.82rem'}}>{p.name}</div>
                <div style={{fontFamily:'monospace',color:'var(--gold)',fontSize:'0.65rem'}}>₹{parseFloat(p.price).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <div style={{background:'var(--ochre)',padding:'2rem 4rem',display:'flex',justifyContent:'space-around',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
        {[['2,400+','Tribal Artisans'],['84','Tribal Communities'],['56','Countries Reached'],['₹4.2Cr','Artisan Earnings']].map(([num,label]) => (
          <div key={label} style={{textAlign:'center'}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'2.5rem',color:'var(--cream)'}}>{num}</div>
            <div style={{fontFamily:'monospace',fontSize:'0.65rem',color:'rgba(255,255,255,0.8)',letterSpacing:'0.15em',textTransform:'uppercase',marginTop:'0.3rem'}}>{label}</div>
          </div>
        ))}
      </div>

      {/* PRODUCTS */}
      <section style={{padding:'5rem 2rem'}}>
        <div style={{textAlign:'center',marginBottom:'3rem'}}>
          <div style={{fontFamily:'monospace',fontSize:'0.7rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--ochre)',marginBottom:'1rem'}}>Featured Collection</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'3rem',color:'var(--deep-brown)'}}>Handpicked <em style={{color:'var(--ochre)'}}>Masterpieces</em></h2>
        </div>
        <div style={{display:'flex',justifyContent:'center',gap:'2rem',marginBottom:'3.5rem',flexWrap:'wrap'}}>
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
          <div style={{textAlign:'center',padding:'3rem',color:'var(--mud)',fontFamily:'monospace'}}>Loading crafts...</div>
        ) : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'2px',maxWidth:'1400px',margin:'0 auto'}}>
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ARTISANS */}
      <section style={{background:'linear-gradient(rgba(28,16,8,0.9), rgba(28,16,8,0.9)), url(https://images.unsplash.com/photo-1544965850-6f816af7cebc?auto=format&fit=crop&q=80) center/cover fixed',padding:'5rem 2rem'}}>
        <div style={{textAlign:'center',marginBottom:'3rem'}}>
          <div style={{fontFamily:'monospace',fontSize:'0.7rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'1rem'}}>Meet the Makers</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'3rem',color:'var(--cream)'}}>Hands Behind <em style={{color:'var(--gold)'}}>Every Craft</em></h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:'1.5rem',maxWidth:'1200px',margin:'0 auto'}}>
          {artisans.slice(0,4).map(a => <ArtisanCard key={a.id} artisan={a} dark={true} />)}
        </div>
      </section>
    </div>
  );
}
