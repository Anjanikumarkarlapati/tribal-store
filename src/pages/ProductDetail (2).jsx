import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api from '../api/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([api.getProduct(id), api.getReviews(id)])
      .then(([p, r]) => { setProduct(p); setReviews(r); })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{paddingTop:'100px',textAlign:'center',color:'var(--mud)',fontFamily:'monospace'}}>Loading...</div>;
  if (!product) return <div style={{paddingTop:'100px',textAlign:'center',color:'var(--mud)'}}>Product not found. <button onClick={() => navigate('/shop')} style={{color:'var(--ochre)',background:'none',border:'none',cursor:'pointer'}}>Back to shop</button></div>;

  const discount = product.old_price ? Math.round((1 - product.price / product.old_price) * 100) : null;

  return (
    <div style={{paddingTop:'72px'}}>
      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'3rem 2rem'}}>
        <button onClick={() => navigate(-1)} style={{background:'none',border:'none',color:'var(--mud)',cursor:'pointer',fontFamily:'monospace',fontSize:'0.8rem',letterSpacing:'0.05em',marginBottom:'2rem',padding:0}}>
          ← Back
        </button>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem'}}>
          <div style={{position:'relative'}}>
            <img src={product.img_url} alt={product.name} style={{width:'100%',borderRadius:'4px'}} />
            {discount && <div style={{position:'absolute',top:'16px',left:'16px',background:'var(--ochre)',color:'#fff',padding:'0.3rem 0.7rem',fontFamily:'monospace',fontSize:'0.75rem',fontWeight:'bold'}}>{discount}% OFF</div>}
          </div>
          <div>
            <div style={{fontFamily:'monospace',fontSize:'0.65rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--ochre)',marginBottom:'1rem'}}>{product.category} · {product.tribe} · {product.state}</div>
            <h1 style={{fontSize:'2.5rem',color:'var(--deep-brown)',marginBottom:'0.5rem',lineHeight:1.1}}>{product.name}</h1>
            <div style={{color:'var(--mud)',marginBottom:'1.5rem',fontSize:'1rem'}}>by {product.artisan_name}</div>
            <div style={{display:'flex',alignItems:'baseline',gap:'1rem',marginBottom:'2rem'}}>
              <div style={{fontSize:'2rem',fontWeight:'bold',color:'var(--ochre)'}}>₹{parseFloat(product.price).toLocaleString()}</div>
              {product.old_price && <div style={{fontSize:'1.2rem',color:'var(--mud)',textDecoration:'line-through'}}>₹{parseFloat(product.old_price).toLocaleString()}</div>}
            </div>
            <p style={{lineHeight:1.8,color:'var(--deep-brown)',marginBottom:'2rem',fontSize:'1.05rem'}}>{product.description}</p>
            <div style={{marginBottom:'2rem',fontSize:'0.9rem',color:'var(--mud)',fontFamily:'monospace'}}>
              Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </div>
            <button
              onClick={async () => { const ok = await addToCart(product); showToast(ok ? 'Added to cart!' : 'Please login first', ok ? 'success' : 'warning'); }}
              disabled={product.stock === 0}
              style={{padding:'1rem 2.5rem',background:'var(--ochre)',color:'#fff',border:'none',borderRadius:'4px',fontSize:'1rem',fontFamily:'monospace',letterSpacing:'0.08em',textTransform:'uppercase',cursor:'pointer',width:'100%',opacity:product.stock===0?0.5:1}}
            >
              {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
            </button>
          </div>
        </div>

        <div style={{marginTop:'5rem',borderTop:'1px solid var(--sand)',paddingTop:'3rem'}}>
          <h2 style={{fontSize:'2rem',color:'var(--deep-brown)',marginBottom:'2rem'}}>Customer Reviews</h2>
          {reviews.length === 0 ? (
            <p style={{color:'var(--mud)'}}>No reviews yet. Be the first to review this product!</p>
          ) : (
            reviews.map(r => (
              <div key={r.id} style={{padding:'1.5rem',border:'1px solid var(--sand)',borderRadius:'4px',marginBottom:'1rem',background:'#fff'}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.5rem'}}>
                  <strong style={{color:'var(--deep-brown)'}}>{r.name}</strong>
                  <div style={{color:'var(--gold)'}}> {'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)} </div>
                </div>
                <p style={{color:'var(--mud)',margin:0}}>{r.comment}</p>
                <div style={{color:'var(--sand)',fontSize:'0.8rem',marginTop:'0.5rem',fontFamily:'monospace'}}>{new Date(r.created_at).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
