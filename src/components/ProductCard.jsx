import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [hov, setHov] = useState(false);

  const { id, name, tribe, state, artisan_name, price, old_price, img_url, avg_stars, badge } = product;

  async function handleAddToCart(e) {
    e.stopPropagation();
    const ok = await addToCart(product);
    if (ok) showToast(`${name} added to cart!`);
    else showToast('Please login to add items to cart', 'warning');
  }

  return (
    <div
      onClick={() => navigate('/shop/' + id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:'var(--cream)',border:'1px solid var(--sand)',
        overflow:'hidden',cursor:'pointer',
        transition:'transform 0.3s,box-shadow 0.3s',
        transform:hov?'translateY(-4px)':'none',
        boxShadow:hov?'0 8px 24px rgba(0,0,0,0.1)':'none'
      }}
    >
      <div style={{position:'relative',height:'250px',overflow:'hidden'}}>
        <img src={img_url} alt={name} style={{width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.5s',transform:hov?'scale(1.05)':'scale(1)'}} />
        {badge && (
          <div style={{position:'absolute',top:'10px',left:'10px',background:'var(--ochre)',color:'#fff',padding:'0.2rem 0.6rem',fontSize:'0.7rem',fontFamily:'monospace',fontWeight:'bold',letterSpacing:'0.05em',borderRadius:'2px'}}>
            {badge}
          </div>
        )}
        <button
          onClick={handleAddToCart}
          style={{
            position:'absolute',bottom:'10px',right:'10px',
            background:'var(--ink)',color:'var(--cream)',border:'none',
            padding:'0.5rem 1rem',borderRadius:'3px',fontSize:'0.78rem',
            fontFamily:'monospace',letterSpacing:'0.05em',
            opacity:hov?1:0,transition:'opacity 0.3s',cursor:'pointer'
          }}
        >
          ADD TO CART
        </button>
      </div>
      <div style={{padding:'1.25rem 1.5rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.5rem'}}>
          <h3 style={{margin:0,fontSize:'1.05rem',color:'var(--deep-brown)',flex:1,marginRight:'0.5rem'}}>{name}</h3>
          <div style={{textAlign:'right',flexShrink:0}}>
            <div style={{fontSize:'1.15rem',fontWeight:'bold',color:'var(--ochre)'}}>₹{parseFloat(price).toLocaleString()}</div>
            {old_price && <div style={{fontSize:'0.82rem',color:'var(--mud)',textDecoration:'line-through'}}>₹{parseFloat(old_price).toLocaleString()}</div>}
          </div>
        </div>
        <div style={{color:'var(--mud)',fontSize:'0.85rem',marginBottom:'0.25rem'}}>{tribe} · {state}</div>
        {artisan_name && <div style={{color:'var(--mud)',fontSize:'0.85rem',marginBottom:'0.5rem'}}>by {artisan_name}</div>}
        <div style={{color:'var(--gold)',fontSize:'0.9rem'}}>
          {'★'.repeat(Math.floor(avg_stars || 5))}{'☆'.repeat(5-Math.floor(avg_stars || 5))}
          <span style={{color:'var(--mud)',marginLeft:'0.25rem',fontSize:'0.8rem'}}>({avg_stars || 5})</span>
        </div>
      </div>
    </div>
  );
}
