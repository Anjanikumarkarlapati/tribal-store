import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/api';

const ROLE_COLOR = { admin:'#7c3aed', artisan:'#b45309', consultant:'#0369a1', customer:'#15803d' };
const TYPE_ICON  = { order:'🛒', review:'⭐', signup:'👤' };
const TYPE_COLOR = { order:'#b45309', review:'#0369a1', signup:'#15803d' };

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)   return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

export default function AdminDashboard() {
  const { showToast } = useToast();
  const [pendingArtisans, setPendingArtisans] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [activityData, setActivityData]       = useState(null);
  const [tab, setTab]     = useState('artisans');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actLoading, setActLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.getPendingArtisans(), api.getPendingProducts()])
      .then(([a, p]) => { setPendingArtisans(a); setPendingProducts(p); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadActivity = useCallback(() => {
    setActLoading(true);
    api.getActivityUsers()
      .then(setActivityData)
      .catch(() => showToast('Could not load user activity', 'error'))
      .finally(() => setActLoading(false));
  }, [showToast]);

  useEffect(() => {
    if (tab === 'users') loadActivity();
  }, [tab, loadActivity]);

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

  const tabStyle = (t) => ({
    padding:'0.6rem 1.5rem', border:'1px solid', cursor:'pointer',
    fontFamily:'monospace', fontSize:'0.75rem', letterSpacing:'0.08em',
    textTransform:'uppercase',
    background: tab===t ? 'var(--ochre)' : 'transparent',
    color:       tab===t ? '#fff'         : 'var(--mud)',
    borderColor: tab===t ? 'var(--ochre)' : 'var(--sand)',
  });

  const filteredUsers = activityData?.users?.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div style={{paddingTop:'72px',minHeight:'100vh',background:'var(--cream)'}}>
      {/* Header */}
      <div style={{background:'linear-gradient(rgba(28,16,8,0.85),rgba(28,16,8,0.85)),url(https://images.unsplash.com/photo-1550136513-548af4445338?auto=format&fit=crop&q=80) center/cover no-repeat',padding:'3rem 2rem'}}>
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div style={{fontFamily:'monospace',fontSize:'0.7rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'0.5rem'}}>Admin Dashboard</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'2.5rem',color:'var(--cream)'}}>Manage Tribal</h1>
        </div>
      </div>

      <div style={{maxWidth:'1100px',margin:'2rem auto',padding:'0 2rem'}}>
        {/* Stat Cards */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'2rem'}}>
          {[['Pending Artisans',pendingArtisans.length],['Pending Products',pendingProducts.length]].map(([label,count])=>(
            <div key={label} style={{background:'#fff',border:'1px solid var(--sand)',borderRadius:'8px',padding:'1.5rem',textAlign:'center'}}>
              <div style={{fontSize:'2.5rem',fontWeight:'bold',color:'var(--ochre)',fontFamily:"'Playfair Display',serif"}}>{count}</div>
              <div style={{color:'var(--mud)',fontFamily:'monospace',fontSize:'0.75rem',letterSpacing:'0.1em',textTransform:'uppercase',marginTop:'0.3rem'}}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:'0.5rem',marginBottom:'2rem',flexWrap:'wrap'}}>
          <button style={tabStyle('artisans')} onClick={()=>setTab('artisans')}>Pending Artisans ({pendingArtisans.length})</button>
          <button style={tabStyle('products')} onClick={()=>setTab('products')}>Pending Products ({pendingProducts.length})</button>
          <button style={tabStyle('users')}    onClick={()=>setTab('users')}>👥 User Activity</button>
        </div>

        {/* ── ARTISANS ── */}
        {tab === 'artisans' && !loading && (
          pendingArtisans.length === 0
            ? <div style={{color:'var(--mud)',textAlign:'center',padding:'2rem'}}>No pending artisans.</div>
            : pendingArtisans.map(a => (
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
        )}

        {/* ── PRODUCTS ── */}
        {tab === 'products' && !loading && (
          pendingProducts.length === 0
            ? <div style={{color:'var(--mud)',textAlign:'center',padding:'2rem'}}>No pending products.</div>
            : pendingProducts.map(p => (
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
        )}

        {/* ── USER ACTIVITY ── */}
        {tab === 'users' && (
          actLoading ? (
            <div style={{color:'var(--mud)',fontFamily:'monospace',textAlign:'center',padding:'2rem'}}>Loading user data...</div>
          ) : activityData ? (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem'}}>

              {/* Left — All Users table */}
              <div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
                  <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',color:'var(--deep-brown)',margin:0}}>All Users ({activityData.users.length})</h3>
                  <button onClick={loadActivity} style={{padding:'0.4rem 0.8rem',background:'transparent',border:'1px solid var(--sand)',borderRadius:'4px',cursor:'pointer',fontFamily:'monospace',fontSize:'0.7rem',color:'var(--mud)'}}>↻ Refresh</button>
                </div>
                <input
                  placeholder="Search by name, email, role…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{width:'100%',padding:'0.6rem 0.8rem',border:'1px solid var(--sand)',borderRadius:'4px',fontSize:'0.85rem',marginBottom:'0.75rem',boxSizing:'border-box',outline:'none'}}
                />
                <div style={{maxHeight:'520px',overflowY:'auto',display:'flex',flexDirection:'column',gap:'0.6rem'}}>
                  {filteredUsers.length === 0 && <div style={{color:'var(--mud)',fontSize:'0.9rem',padding:'1rem',textAlign:'center'}}>No users found.</div>}
                  {filteredUsers.map(u => (
                    <div key={u.id} style={{background:'#fff',border:'1px solid var(--sand)',borderRadius:'6px',padding:'0.85rem 1rem',display:'flex',alignItems:'center',gap:'0.75rem'}}>
                      {/* Avatar */}
                      {u.avatar_url
                        ? <img src={u.avatar_url} alt={u.name} style={{width:'36px',height:'36px',borderRadius:'50%',objectFit:'cover',flexShrink:0}} />
                        : <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'var(--sand)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontWeight:'bold',color:'var(--mud)',fontSize:'1rem'}}>{u.name[0]}</div>
                      }
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:600,fontSize:'0.9rem',color:'var(--deep-brown)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{u.name}</div>
                        <div style={{fontSize:'0.78rem',color:'var(--mud)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{u.email}</div>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'0.2rem',flexShrink:0}}>
                        <span style={{padding:'0.15rem 0.5rem',borderRadius:'999px',fontSize:'0.65rem',fontFamily:'monospace',fontWeight:'bold',background:ROLE_COLOR[u.role]+'22',color:ROLE_COLOR[u.role]}}>{u.role}</span>
                        <span style={{fontSize:'0.65rem',color:'var(--mud)',fontFamily:'monospace'}}>{u.order_count}🛒 {u.review_count}⭐</span>
                        <span style={{fontSize:'0.6rem',color:'#aaa'}}>{timeAgo(u.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Live Activity Feed */}
              <div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',color:'var(--deep-brown)',marginBottom:'1rem',marginTop:0}}>Recent Activity</h3>
                <div style={{maxHeight:'580px',overflowY:'auto',display:'flex',flexDirection:'column',gap:'0.6rem'}}>
                  {activityData.feed.length === 0 && <div style={{color:'var(--mud)',padding:'1rem',textAlign:'center'}}>No activity yet.</div>}
                  {activityData.feed.map((e, i) => (
                    <div key={i} style={{background:'#fff',border:'1px solid var(--sand)',borderRadius:'6px',padding:'0.75rem 1rem',display:'flex',gap:'0.75rem',alignItems:'flex-start'}}>
                      <div style={{width:'32px',height:'32px',borderRadius:'50%',background:TYPE_COLOR[e.type]+'22',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}}>
                        {TYPE_ICON[e.type]}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:600,fontSize:'0.85rem',color:'var(--deep-brown)'}}>{e.user_name}</div>
                        <div style={{fontSize:'0.8rem',color:'var(--mud)',marginTop:'0.1rem',wordBreak:'break-word'}}>{e.detail}</div>
                      </div>
                      <div style={{fontSize:'0.65rem',color:'#aaa',fontFamily:'monospace',flexShrink:0,whiteSpace:'nowrap'}}>{timeAgo(e.at)}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div style={{color:'var(--mud)',textAlign:'center',padding:'2rem'}}>Failed to load data.</div>
          )
        )}

        {loading && <div style={{color:'var(--mud)',fontFamily:'monospace'}}>Loading...</div>}
      </div>
    </div>
  );
}
