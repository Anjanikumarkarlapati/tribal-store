import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/api';

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [pendingArtisans, setPendingArtisans] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [tab, setTab] = useState('artisans');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getPendingArtisans(), api.getPendingProducts()])
      .then(([a, p]) => { setPendingArtisans(a); setPendingProducts(p); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const approveArtisan = async (id) => {
    try {
      await api.approveArtisan(id);
      setPendingArtisans(prev => prev.filter(a => a.id !== id));
      showToast('Artisan approved!');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const approveProduct = async (id) => {
    try {
      await api.approveProduct(id);
      setPendingProducts(prev => prev.filter(p => p.id !== id));
      showToast('Product approved!');
    } catch (err) { showToast(err.message, 'error'); }
  };

  const tabStyle = (t) => ({ padding:'0.6rem 1.5rem', border:'1px solid', cursor:'pointer', fontFamily:'monospace', fontSize:'0.75rem', letterSpacing:'0.08em', textTransform:'uppercase', background:tab===t?'var(--ochre)':'transparent', color:tab===t?'#fff':'var(--mud)', borderColor:tab===t?'var(--ochre)':'var(--sand)' });

  return (
    <div style={{paddingTop:'72px',minHeight:'100vh',background:'var(--cream)'}}>
      <div style={{background:'var(--deep-brown)',padding:'3rem 2rem'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{fontFamily:'monospace',fontSize:'0.7rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'0.5rem'}}>Admin Dashboard</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'2.5rem',color:'var(--cream)'}}>Manage Tribal</h1>
        </div>
      </div>

      <div style={{maxWidth:'1100px',margin:'2rem auto',padding:'0 2rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'2rem'}}>
          {[['Pending Artisans', pendingArtisans.length],['Pending Products', pendingProducts.length]].map(([label,count])=>(
            <div key={label} style={{background:'#fff',border:'1px solid var(--sand)',borderRadius:'8px',padding:'1.5rem',textAlign:'center'}}>
              <div style={{fontSize:'2.5rem',fontWeight:'bold',color:'var(--ochre)',fontFamily:"'Playfair Display',serif"}}>{count}</div>
              <div style={{color:'var(--mud)',fontFamily:'monospace',fontSize:'0.75rem',letterSpacing:'0.1em',textTransform:'uppercase',marginTop:'0.3rem'}}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{display:'flex',gap:'0.5rem',marginBottom:'2rem'}}>
          <button style={tabStyle('artisans')} onClick={()=>setTab('artisans')}>Pending Artisans ({pendingArtisans.length})</button>
          <button style={tabStyle('products')} onClick={()=>setTab('products')}>Pending Products ({pendingProducts.length})</button>
        </div>

        {loading ? <div style={{color:'var(--mud)',fontFamily:'monospace'}}>Loading...</div> : (
          tab === 'artisans' ? (
            pendingArtisans.length === 0 ? <div style={{color:'var(--mud)',textAlign:'center',padding:'2rem'}}>No pending artisans.</div> :
            pendingArtisans.map(a => (
              <div key={a.id} style={{background:'#fff',border:'1px solid var(--sand)',borderRadius:'8px',padding:'1.5rem',marginBottom:'1rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div style={{fontWeight:600,fontSize:'1.1rem',color:'var(--deep-brown)'}}>{a.name}</div>
                  <div style={{color:'var(--mud)',fontSize:'0.9rem'}}>{a.email}</div>
                  <div style={{color:'var(--mud)',fontSize:'0.85rem',marginTop:'0.25rem',fontFamily:'monospace'}}>{a.specialty} · {a.tribe} · {a.state}</div>
                  {a.bio && <div style={{color:'var(--mud)',fontSize:'0.85rem',marginTop:'0.5rem',maxWidth:'500px'}}>{a.bio}</div>}
                </div>
                <button onClick={() => approveArtisan(a.id)} style={{padding:'0.75rem 1.5rem',background:'#15803d',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer',fontFamily:'monospace',fontSize:'0.78rem',letterSpacing:'0.05em',textTransform:'uppercase',flexShrink:0}}>
                  Approve
                </button>
              </div>
            ))
          ) : (
            pendingProducts.length === 0 ? <div style={{color:'var(--mud)',textAlign:'center',padding:'2rem'}}>No pending products.</div> :
            pendingProducts.map(p => (
              <div key={p.id} style={{background:'#fff',border:'1px solid var(--sand)',borderRadius:'8px',padding:'1.5rem',marginBottom:'1rem',display:'flex',gap:'1.5rem',alignItems:'center'}}>
                {p.img_url && <img src={p.img_url} alt={p.name} style={{width:'80px',height:'80px',objectFit:'cover',borderRadius:'4px',flexShrink:0}} />}
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:'1.1rem',color:'var(--deep-brown)'}}>{p.name}</div>
                  <div style={{color:'var(--ochre)',fontFamily:'monospace',fontWeight:'bold'}}>₹{parseFloat(p.price).toLocaleString()}</div>
                  <div style={{color:'var(--mud)',fontSize:'0.85rem',marginTop:'0.25rem'}}>{p.artisan_name} · {p.category}</div>
                  <div style={{color:'var(--mud)',fontSize:'0.85rem',marginTop:'0.25rem',maxWidth:'500px'}}>{p.description}</div>
                </div>
                <button onClick={() => approveProduct(p.id)} style={{padding:'0.75rem 1.5rem',background:'#15803d',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer',fontFamily:'monospace',fontSize:'0.78rem',letterSpacing:'0.05em',textTransform:'uppercase',flexShrink:0}}>
                  Approve
                </button>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}
