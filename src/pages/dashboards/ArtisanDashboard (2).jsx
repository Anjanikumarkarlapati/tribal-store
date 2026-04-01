import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/api';

const inp = { width:'100%', padding:'0.6rem 0.8rem', border:'1px solid var(--sand)', borderRadius:'4px', fontSize:'0.95rem', background:'#fff', outline:'none', marginTop:'0.3rem' };

export default function ArtisanDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('orders');
  const [form, setForm] = useState({ name:'', description:'', price:'', old_price:'', category:'pottery', tribe:'', state:'', img_url:'', badge:'', stock:1 });
  const [submitting, setSubmitting] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  useEffect(() => {
    api.getArtisanOrders().then(setOrders).catch(()=>setOrders([])).finally(()=>setLoading(false));
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.addProduct({ ...form, artisan_id: user.artisanId, price: parseFloat(form.price), old_price: form.old_price ? parseFloat(form.old_price) : null, stock: parseInt(form.stock) });
      showToast('Product submitted for admin review!');
      setForm({ name:'', description:'', price:'', old_price:'', category:'pottery', tribe:'', state:'', img_url:'', badge:'', stock:1 });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const tabStyle = (t) => ({ padding:'0.6rem 1.5rem', border:'1px solid', cursor:'pointer', fontFamily:'monospace', fontSize:'0.75rem', letterSpacing:'0.08em', textTransform:'uppercase', background:tab===t?'var(--ochre)':'transparent', color:tab===t?'#fff':'var(--mud)', borderColor:tab===t?'var(--ochre)':'var(--sand)' });

  return (
    <div style={{paddingTop:'72px',minHeight:'100vh',background:'var(--cream)'}}>
      <div style={{background:'var(--deep-brown)',padding:'3rem 2rem'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{fontFamily:'monospace',fontSize:'0.7rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'0.5rem'}}>Artisan Dashboard</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'2.5rem',color:'var(--cream)'}}>Welcome, {user?.name?.split(' ')[0]}</h1>
        </div>
      </div>
      <div style={{maxWidth:'1100px',margin:'2rem auto',padding:'0 2rem'}}>
        <div style={{display:'flex',gap:'0.5rem',marginBottom:'2rem'}}>
          <button style={tabStyle('orders')} onClick={()=>setTab('orders')}>My Orders</button>
          <button style={tabStyle('add')} onClick={()=>setTab('add')}>Add Product</button>
        </div>

        {tab === 'orders' && (
          <div>
            <h2 style={{fontSize:'1.5rem',color:'var(--deep-brown)',marginBottom:'1.5rem'}}>Orders for My Products</h2>
            {loading ? <div style={{color:'var(--mud)',fontFamily:'monospace'}}>Loading...</div>
            : orders.length === 0 ? <div style={{color:'var(--mud)',padding:'2rem',textAlign:'center'}}>No orders yet.</div>
            : orders.map((o,i) => (
              <div key={i} style={{background:'#fff',border:'1px solid var(--sand)',borderRadius:'8px',padding:'1.25rem',marginBottom:'0.75rem',display:'flex',gap:'1rem',alignItems:'center'}}>
                <img src={o.img_url} alt={o.product_name} style={{width:'56px',height:'56px',objectFit:'cover',borderRadius:'4px'}} />
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,color:'var(--deep-brown)'}}>{o.product_name}</div>
                  <div style={{color:'var(--mud)',fontSize:'0.85rem'}}>by {o.customer_name} · {new Date(o.created_at).toLocaleDateString()}</div>
                </div>
                <div style={{fontFamily:'monospace',fontSize:'0.85rem',color:'var(--mud)'}}>×{o.qty}</div>
                <div style={{fontFamily:'monospace',color:'var(--ochre)',fontWeight:'bold'}}>₹{parseFloat(o.unit_price).toLocaleString()}</div>
                <div style={{background:'rgba(196,116,42,0.12)',color:'var(--ochre)',padding:'0.25rem 0.7rem',borderRadius:'99px',fontSize:'0.75rem',fontFamily:'monospace',textTransform:'uppercase'}}>{o.status}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'add' && (
          <form onSubmit={handleAddProduct} style={{maxWidth:'600px',background:'#fff',padding:'2rem',borderRadius:'8px',border:'1px solid var(--sand)'}}>
            <h2 style={{fontSize:'1.5rem',color:'var(--deep-brown)',marginBottom:'1.5rem'}}>Add New Product</h2>
            <label style={{fontSize:'0.78rem',color:'var(--mud)',fontFamily:'monospace',textTransform:'uppercase'}}>Product Name *<input required type="text" value={form.name} onChange={e=>set('name',e.target.value)} style={inp} /></label>
            <label style={{fontSize:'0.78rem',color:'var(--mud)',fontFamily:'monospace',textTransform:'uppercase',display:'block',margin:'0.8rem 0'}}>Description *<textarea required rows={3} value={form.description} onChange={e=>set('description',e.target.value)} style={{...inp,resize:'vertical'}} /></label>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',margin:'0.8rem 0'}}>
              <label style={{fontSize:'0.78rem',color:'var(--mud)',fontFamily:'monospace',textTransform:'uppercase'}}>Price (₹) *<input required type="number" min="1" value={form.price} onChange={e=>set('price',e.target.value)} style={inp} /></label>
              <label style={{fontSize:'0.78rem',color:'var(--mud)',fontFamily:'monospace',textTransform:'uppercase'}}>Old Price (₹)<input type="number" min="1" value={form.old_price} onChange={e=>set('old_price',e.target.value)} style={inp} /></label>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',margin:'0.8rem 0'}}>
              <label style={{fontSize:'0.78rem',color:'var(--mud)',fontFamily:'monospace',textTransform:'uppercase'}}>Category *
                <select value={form.category} onChange={e=>set('category',e.target.value)} style={inp}>
                  {['pottery','jewelry','art','textile','woodwork'].map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                </select>
              </label>
              <label style={{fontSize:'0.78rem',color:'var(--mud)',fontFamily:'monospace',textTransform:'uppercase'}}>Stock *<input required type="number" min="1" value={form.stock} onChange={e=>set('stock',e.target.value)} style={inp} /></label>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',margin:'0.8rem 0'}}>
              <label style={{fontSize:'0.78rem',color:'var(--mud)',fontFamily:'monospace',textTransform:'uppercase'}}>Tribe<input type="text" value={form.tribe} onChange={e=>set('tribe',e.target.value)} style={inp} /></label>
              <label style={{fontSize:'0.78rem',color:'var(--mud)',fontFamily:'monospace',textTransform:'uppercase'}}>State<input type="text" value={form.state} onChange={e=>set('state',e.target.value)} style={inp} /></label>
            </div>
            <label style={{fontSize:'0.78rem',color:'var(--mud)',fontFamily:'monospace',textTransform:'uppercase',display:'block',margin:'0.8rem 0'}}>Image URL<input type="url" value={form.img_url} onChange={e=>set('img_url',e.target.value)} style={inp} placeholder="https://..." /></label>
            <label style={{fontSize:'0.78rem',color:'var(--mud)',fontFamily:'monospace',textTransform:'uppercase',display:'block',margin:'0.8rem 0'}}>Badge (optional)<input type="text" value={form.badge} onChange={e=>set('badge',e.target.value)} style={inp} placeholder="e.g. Bestseller, New, Limited" /></label>
            <button type="submit" disabled={submitting} style={{width:'100%',padding:'0.9rem',background:'var(--ochre)',color:'#fff',border:'none',borderRadius:'4px',fontSize:'0.9rem',fontFamily:'monospace',letterSpacing:'0.08em',textTransform:'uppercase',cursor:'pointer',marginTop:'0.5rem',opacity:submitting?0.7:1}}>
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
