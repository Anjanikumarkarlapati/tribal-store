import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/api';

const statCard = (label, value, icon, color='var(--ochre)') => (
  <div style={{background:'#fff',border:'1px solid var(--sand)',borderRadius:'12px',padding:'1.5rem',display:'flex',alignItems:'center',gap:'1.2rem',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
    <div style={{width:'52px',height:'52px',borderRadius:'50%',background:`${color}18`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',flexShrink:0}}>{icon}</div>
    <div>
      <div style={{fontSize:'1.8rem',fontWeight:'800',color,fontFamily:"'Playfair Display',serif",lineHeight:1}}>{value}</div>
      <div style={{color:'var(--mud)',fontSize:'0.78rem',fontFamily:'monospace',letterSpacing:'0.08em',textTransform:'uppercase',marginTop:'0.25rem'}}>{label}</div>
    </div>
  </div>
);

export default function TribalAdminDashboard() {
  const { showToast } = useToast();
  const [summary, setSummary] = useState(null);
  const [disputes, setDisputes] = useState([]);
  const [pending, setPending] = useState({ artisans: [], products: [] });
  const [featured, setFeatured] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getAnalyticsSummary(),
      api.getDisputes(),
      api.getPendingArtisans(),
      api.getPendingProducts(),
      api.getArtisans(),
    ]).then(([sum, dis, pa, pp, arts]) => {
      setSummary(sum);
      setDisputes(dis);
      setPending({ artisans: pa, products: pp });
      setFeatured(arts.slice(0, 3));
    }).catch(() => showToast('Error loading dashboard', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const approveArtisan = async (id) => {
    try { await api.approveArtisan(id); setPending(p => ({ ...p, artisans: p.artisans.filter(a => a.id !== id) })); showToast('Artisan approved!'); }
    catch (err) { showToast(err.message, 'error'); }
  };
  const approveProduct = async (id) => {
    try { await api.approveProduct(id); setPending(p => ({ ...p, products: p.products.filter(a => a.id !== id) })); showToast('Product approved!'); }
    catch (err) { showToast(err.message, 'error'); }
  };

  const tabs = ['overview', 'curation', 'approvals', 'disputes'];
  const tabStyle = (t) => ({ padding:'0.6rem 1.4rem', border:'none', borderBottom: tab===t ? '2px solid var(--ochre)' : '2px solid transparent', cursor:'pointer', fontFamily:'monospace', fontSize:'0.78rem', letterSpacing:'0.08em', textTransform:'uppercase', background:'transparent', color: tab===t ? 'var(--ochre)' : 'var(--mud)', fontWeight: tab===t ? 700 : 400, transition:'all 0.2s' });

  return (
    <div style={{paddingTop:'72px',minHeight:'100vh',background:'var(--cream)'}}>
      {/* Hero Header */}
      <div style={{background:'linear-gradient(120deg,#1c1008 60%,#3d2209 100%)',padding:'3rem 2rem',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,right:0,bottom:0,left:'50%',background:'url(https://images.unsplash.com/photo-1550136513-548af4445338?w=800&q=60) center/cover no-repeat',opacity:0.18}}></div>
        <div style={{maxWidth:'1200px',margin:'0 auto',position:'relative',zIndex:1}}>
          <div style={{fontFamily:'monospace',fontSize:'0.7rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'0.4rem'}}>Curator Presents</div>
          <div style={{color:'var(--gold)',fontSize:'0.9rem',marginBottom:'0.25rem'}}>Morning, Administrator.</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(2rem,4vw,3rem)',color:'var(--cream)',margin:'0 0 0.5rem'}}>Tribal Artisans <span style={{color:'var(--gold)'}}>Admin</span></h1>
          <p style={{color:'var(--sand)',fontSize:'0.9rem',maxWidth:'500px'}}>Youth is the bridge between the ancestors and the future.</p>
          <button onClick={() => window.print()} style={{marginTop:'1.5rem',padding:'0.65rem 1.5rem',background:'transparent',border:'1px solid var(--gold)',color:'var(--gold)',borderRadius:'4px',fontFamily:'monospace',fontSize:'0.78rem',letterSpacing:'0.08em',textTransform:'uppercase',cursor:'pointer'}}>↗ Export Report</button>
        </div>
      </div>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'2.5rem 2rem'}}>
        {/* Stat Cards */}
        {!loading && summary && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:'1rem',marginBottom:'2.5rem'}}>
            {statCard('Total Platform Revenue', `₹${parseFloat(summary.total_revenue||0).toLocaleString('en-IN')}`, '💰', 'var(--ochre)')}
            {statCard('Active Artisans', summary.active_artisans, '🎨', '#15803d')}
            {statCard('Pending Applications', (summary.pending_artisans||0)+(summary.pending_products||0), '📋', '#b45309')}
            {statCard('Disputes / Refunds', disputes.length, '⚠️', '#b91c1c')}
          </div>
        )}

        {/* Tabs */}
        <div style={{borderBottom:'1px solid var(--sand)',display:'flex',gap:'0.25rem',marginBottom:'2rem',overflowX:'auto'}}>
          {tabs.map(t => <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
        </div>

        {loading && <div style={{color:'var(--mud)',fontFamily:'monospace',padding:'2rem',textAlign:'center'}}>Loading dashboard...</div>}

        {/* OVERVIEW TAB */}
        {!loading && tab === 'overview' && (
          <div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',color:'var(--deep-brown)',marginBottom:'1.5rem'}}>Recent High-Value Sales</h2>
            {summary?.high_value_sales?.length === 0
              ? <div style={{color:'var(--mud)',textAlign:'center',padding:'2rem',background:'#fff',borderRadius:'8px'}}>No orders yet.</div>
              : summary?.high_value_sales?.map((s, i) => (
              <div key={i} style={{background:'#fff',border:'1px solid var(--sand)',borderRadius:'8px',padding:'1rem 1.5rem',marginBottom:'0.75rem',display:'flex',alignItems:'center',gap:'1.25rem',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                {s.img_url && <img src={s.img_url} alt={s.product_name} style={{width:'52px',height:'52px',objectFit:'cover',borderRadius:'6px',flexShrink:0}} />}
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,color:'var(--deep-brown)',fontSize:'0.95rem'}}>{s.product_name}</div>
                  <div style={{color:'var(--mud)',fontSize:'0.82rem',marginTop:'0.15rem'}}>by {s.customer_name}</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{color:'var(--ochre)',fontFamily:'monospace',fontWeight:'bold',fontSize:'1.05rem'}}>₹{parseFloat(s.unit_price).toLocaleString('en-IN')}</div>
                  <div style={{color:'var(--mud)',fontSize:'0.78rem',fontFamily:'monospace'}}>Qty: {s.qty}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CURATION TAB */}
        {!loading && tab === 'curation' && (
          <div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',color:'var(--deep-brown)',marginBottom:'0.5rem'}}>Visual Curation</h2>
            <p style={{color:'var(--mud)',fontSize:'0.9rem',marginBottom:'2rem'}}>Manage all banners, featured artisans, and heritage stories.</p>

            {[{title:'Hero Banners', sub:'Active Displays', emoji:'🖼️', img:'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=600&q=70'},
              {title:'Featured Artisans', sub:'Update Highlights', emoji:'👤', img:'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&q=70'},
              {title:'Heritage Stories', sub:'Editorial Queue', emoji:'📖', img:'https://images.unsplash.com/photo-1578926288207-a90a5e9c9f3a?w=600&q=70'}
            ].map(item => (
              <div key={item.title} style={{height:'110px',borderRadius:'10px',marginBottom:'1rem',overflow:'hidden',position:'relative',display:'flex',alignItems:'flex-end',cursor:'pointer',boxShadow:'0 2px 12px rgba(0,0,0,0.1)'}}>
                <img src={item.img} alt={item.title} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />
                <div style={{position:'absolute',inset:0,background:'linear-gradient(to right,rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.2) 100%)'}}></div>
                <div style={{position:'relative',zIndex:1,padding:'1rem 1.5rem'}}>
                  <div style={{color:'#fff',fontWeight:700,fontSize:'1rem'}}>{item.emoji} {item.title}</div>
                  <div style={{color:'rgba(255,255,255,0.75)',fontSize:'0.8rem',fontFamily:'monospace',letterSpacing:'0.05em'}}>{item.sub}</div>
                </div>
              </div>
            ))}

            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',color:'var(--deep-brown)',margin:'2rem 0 1rem'}}>Featured Artisans</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'1rem'}}>
              {featured.map(a => (
                <div key={a.id} style={{background:'#fff',border:'1px solid var(--sand)',borderRadius:'10px',overflow:'hidden'}}>
                  <img src={a.profile_img} alt={a.name} style={{width:'100%',height:'130px',objectFit:'cover'}} />
                  <div style={{padding:'0.75rem'}}>
                    <div style={{fontWeight:600,color:'var(--deep-brown)',fontSize:'0.9rem'}}>{a.name}</div>
                    <div style={{color:'var(--ochre)',fontSize:'0.78rem',fontFamily:'monospace'}}>{a.tribe || a.specialty}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* APPROVALS TAB */}
        {!loading && tab === 'approvals' && (
          <div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',color:'var(--deep-brown)',marginBottom:'1.5rem'}}>Approval Queue</h2>

            {pending.artisans.length > 0 && <>
              <h3 style={{color:'var(--ochre)',fontFamily:'monospace',fontSize:'0.85rem',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'1rem'}}>Pending Artisans</h3>
              {pending.artisans.map(a => (
                <div key={a.id} style={{background:'#fff',border:'1px solid var(--sand)',borderRadius:'8px',padding:'1.25rem 1.5rem',marginBottom:'0.75rem',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'1rem'}}>
                  <div>
                    <div style={{fontWeight:600,color:'var(--deep-brown)'}}>{a.name}</div>
                    <div style={{color:'var(--mud)',fontSize:'0.85rem'}}>{a.email}</div>
                    <div style={{color:'var(--mud)',fontSize:'0.82rem',fontFamily:'monospace',marginTop:'0.2rem'}}>{a.specialty} · {a.tribe} · {a.state}</div>
                  </div>
                  <div style={{display:'flex',gap:'0.5rem',flexShrink:0}}>
                    <button onClick={() => approveArtisan(a.id)} style={{padding:'0.6rem 1.2rem',background:'#15803d',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer',fontFamily:'monospace',fontSize:'0.75rem',textTransform:'uppercase'}}>Approve</button>
                    <button style={{padding:'0.6rem 1.2rem',background:'transparent',color:'#b91c1c',border:'1px solid #b91c1c',borderRadius:'4px',cursor:'pointer',fontFamily:'monospace',fontSize:'0.75rem',textTransform:'uppercase'}}>Reject</button>
                  </div>
                </div>
              ))}
            </>}

            {pending.products.length > 0 && <>
              <h3 style={{color:'var(--ochre)',fontFamily:'monospace',fontSize:'0.85rem',letterSpacing:'0.1em',textTransform:'uppercase',margin:'2rem 0 1rem'}}>Pending Products</h3>
              {pending.products.map(p => (
                <div key={p.id} style={{background:'#fff',border:'1px solid var(--sand)',borderRadius:'8px',padding:'1.25rem 1.5rem',marginBottom:'0.75rem',display:'flex',gap:'1rem',alignItems:'center'}}>
                  {p.img_url && <img src={p.img_url} alt={p.name} style={{width:'60px',height:'60px',objectFit:'cover',borderRadius:'6px',flexShrink:0}} />}
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,color:'var(--deep-brown)'}}>{p.name}</div>
                    <div style={{color:'var(--ochre)',fontFamily:'monospace',fontWeight:'bold'}}>₹{parseFloat(p.price).toLocaleString()}</div>
                    <div style={{color:'var(--mud)',fontSize:'0.82rem'}}>{p.artisan_name} · {p.category}</div>
                  </div>
                  <div style={{display:'flex',gap:'0.5rem',flexShrink:0}}>
                    <button onClick={() => approveProduct(p.id)} style={{padding:'0.6rem 1.2rem',background:'#15803d',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer',fontFamily:'monospace',fontSize:'0.75rem',textTransform:'uppercase'}}>Approve</button>
                    <button style={{padding:'0.6rem 1.2rem',background:'transparent',color:'#b91c1c',border:'1px solid #b91c1c',borderRadius:'4px',cursor:'pointer',fontFamily:'monospace',fontSize:'0.75rem',textTransform:'uppercase'}}>Reject</button>
                  </div>
                </div>
              ))}
            </>}

            {pending.artisans.length === 0 && pending.products.length === 0 &&
              <div style={{textAlign:'center',padding:'3rem',color:'var(--mud)',background:'#fff',borderRadius:'8px',border:'1px solid var(--sand)'}}>
                <div style={{fontSize:'2rem'}}>✅</div><p>All approvals are up to date!</p>
              </div>
            }
          </div>
        )}

        {/* DISPUTES TAB */}
        {!loading && tab === 'disputes' && (
          <div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',color:'var(--deep-brown)',marginBottom:'1.5rem'}}>System Disputes</h2>
            {disputes.length === 0
              ? <div style={{textAlign:'center',padding:'3rem',color:'var(--mud)',background:'#fff',borderRadius:'8px',border:'1px solid var(--sand)'}}>
                  <div style={{fontSize:'2rem'}}>✅</div><p>No disputes or refunds.</p>
                </div>
              : disputes.map(d => (
                <div key={d.id} style={{background:'#fff',border:'1px solid #fecaca',borderRadius:'8px',padding:'1.25rem 1.5rem',marginBottom:'0.75rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <div style={{fontWeight:600,color:'var(--deep-brown)'}}>{d.name}</div>
                    <div style={{color:'var(--mud)',fontSize:'0.85rem'}}>{d.email}</div>
                    <div style={{color:'var(--mud)',fontSize:'0.82rem',fontFamily:'monospace',marginTop:'0.2rem'}}>{d.order_number} · {new Date(d.created_at).toLocaleDateString()}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{color:'#b91c1c',fontWeight:'bold',fontFamily:'monospace'}}>₹{parseFloat(d.total_price).toLocaleString()}</div>
                    <span style={{background:'#fee2e2',color:'#b91c1c',padding:'0.2rem 0.6rem',borderRadius:'99px',fontSize:'0.75rem',fontFamily:'monospace',textTransform:'uppercase'}}>{d.status}</span>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}
