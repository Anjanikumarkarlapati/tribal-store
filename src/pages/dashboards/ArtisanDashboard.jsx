import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/api';

const inp = { width:'100%', padding:'0.75rem 1rem', border:'1px solid var(--sand)', borderRadius:'6px', fontSize:'0.95rem', background:'#fff', outline:'none', marginTop:'0.3rem', boxSizing:'border-box', fontFamily:'inherit' };

function StatCard({ label, value, icon, color = 'var(--ochre)' }) {
  return (
    <div style={{ background:'#fff', border:'1px solid var(--sand)', borderRadius:'12px', padding:'1.5rem', display:'flex', alignItems:'center', gap:'1.2rem', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ width:'52px', height:'52px', borderRadius:'50%', background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}>{icon}</div>
      <div>
        <div style={{ fontSize:'1.8rem', fontWeight:'800', color, fontFamily:"'Playfair Display',serif", lineHeight:1 }}>{value}</div>
        <div style={{ color:'var(--mud)', fontSize:'0.76rem', fontFamily:'monospace', letterSpacing:'0.08em', textTransform:'uppercase', marginTop:'0.25rem' }}>{label}</div>
      </div>
    </div>
  );
}

export default function ArtisanDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [summary, setSummary]     = useState(null);
  const [orders, setOrders]       = useState([]);
  const [archive, setArchive]     = useState([]);
  const [tab, setTab]             = useState('overview');
  const [loading, setLoading]     = useState(true);
  const [story, setStory]         = useState({ title:'', artisan_id:'', content:'' });
  const [saving, setSaving]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name:'', description:'', price:'', old_price:'', category:'pottery', tribe:'', state:'', img_url:'', badge:'', stock:1 });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    Promise.all([
      api.getSellerSummary(),
      api.getArtisanOrders(),
      api.getHeritageArchive(),
    ]).then(([sum, ords, arch]) => {
      setSummary(sum);
      setOrders(ords);
      setArchive(arch);
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await api.addProduct({ ...form, artisan_id: user.artisanId, price: parseFloat(form.price), old_price: form.old_price ? parseFloat(form.old_price) : null, stock: parseInt(form.stock) });
      showToast('Product submitted for admin review!');
      setForm({ name:'', description:'', price:'', old_price:'', category:'pottery', tribe:'', state:'', img_url:'', badge:'', stock:1 });
    } catch (err) { showToast(err.message, 'error'); }
    finally { setSubmitting(false); }
  };

  const handleSaveStory = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const res = await api.saveHeritageStory(story);
      showToast(res.message);
      setStory({ title:'', artisan_id:'', content:'' });
    } catch (err) { showToast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const tabs = ['overview', 'orders', 'add-product', 'heritage', 'curation'];
  const tabStyle = (t) => ({
    padding:'0.6rem 1.2rem', border:'none',
    borderBottom: tab===t ? '2px solid var(--ochre)' : '2px solid transparent',
    cursor:'pointer', fontFamily:'monospace', fontSize:'0.75rem',
    letterSpacing:'0.08em', textTransform:'uppercase', background:'transparent',
    color: tab===t ? 'var(--ochre)' : 'var(--mud)', fontWeight: tab===t ? 700 : 400,
    transition:'all 0.2s', whiteSpace:'nowrap'
  });

  const tabLabels = { 'overview':'Overview', 'orders':'My Orders', 'add-product':'Add Product', 'heritage':'Heritage Archive', 'curation':'Story Curation' };

  return (
    <div style={{ paddingTop:'72px', minHeight:'100vh', background:'var(--cream)' }}>

      {/* Hero Header — inspired by the screenshot design */}
      <div style={{ position:'relative', overflow:'hidden', padding:'4rem 2rem', minHeight:'200px' }}>
        <img src="https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=1400&q=70" alt="Artisan" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(28,10,0,0.88) 50%, rgba(58,28,8,0.6) 100%)' }}></div>
        <div style={{ maxWidth:'1100px', margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ fontFamily:'monospace', fontSize:'0.7rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'0.4rem' }}>Seller Dashboard</div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(2rem,4vw,3rem)', color:'var(--cream)', margin:'0 0 0.5rem', lineHeight:1.1 }}>
            Morning, <span style={{ color:'var(--gold)' }}>{user?.name?.split(' ')[0]}</span>.
          </h1>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'0.95rem', maxWidth:'460px' }}>Youth is the bridge between the ancestors and the future.</p>
          {!loading && summary && (
            <div style={{ display:'inline-flex', gap:'2rem', marginTop:'1.5rem', background:'rgba(255,255,255,0.1)', backdropFilter:'blur(8px)', padding:'1rem 1.5rem', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ color:'var(--gold)', fontSize:'1.4rem', fontWeight:'800', fontFamily:"'Playfair Display',serif" }}>₹{parseFloat(summary.total_revenue||0).toLocaleString('en-IN')}</div>
                <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.7rem', fontFamily:'monospace', textTransform:'uppercase', letterSpacing:'0.1em' }}>Total Revenue</div>
              </div>
              <div style={{ width:'1px', background:'rgba(255,255,255,0.2)' }}></div>
              <div style={{ textAlign:'center' }}>
                <div style={{ color:'var(--cream)', fontSize:'1.4rem', fontWeight:'800', fontFamily:"'Playfair Display',serif" }}>{summary.total_orders}</div>
                <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.7rem', fontFamily:'monospace', textTransform:'uppercase', letterSpacing:'0.1em' }}>Orders</div>
              </div>
              <div style={{ width:'1px', background:'rgba(255,255,255,0.2)' }}></div>
              <div style={{ textAlign:'center' }}>
                <div style={{ color:'var(--cream)', fontSize:'1.4rem', fontWeight:'800', fontFamily:"'Playfair Display',serif" }}>{summary.total_products}</div>
                <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.7rem', fontFamily:'monospace', textTransform:'uppercase', letterSpacing:'0.1em' }}>Products</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'2rem 2rem' }}>

        {/* Tabs */}
        <div style={{ borderBottom:'1px solid var(--sand)', display:'flex', gap:'0', marginBottom:'2rem', overflowX:'auto' }}>
          {tabs.map(t => <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>{tabLabels[t]}</button>)}
        </div>

        {loading && <div style={{ color:'var(--mud)', fontFamily:'monospace', textAlign:'center', padding:'3rem' }}>Loading dashboard...</div>}

        {/* OVERVIEW TAB */}
        {!loading && tab === 'overview' && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem', marginBottom:'2.5rem' }}>
              <StatCard label="Total Revenue" value={`₹${parseFloat(summary?.total_revenue||0).toLocaleString('en-IN')}`} icon="💰" color="var(--ochre)" />
              <StatCard label="Total Orders" value={summary?.total_orders||0} icon="📦" color="#1d4ed8" />
              <StatCard label="Active Products" value={summary?.total_products||0} icon="🎨" color="#15803d" />
              <StatCard label="Pending Review" value={summary?.pending_products||0} icon="⏳" color="#b45309" />
            </div>

            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', color:'var(--deep-brown)', marginBottom:'1.25rem' }}>Top Performing Products</h2>
            {summary?.top_products?.length === 0
              ? <div style={{ color:'var(--mud)', padding:'2rem', textAlign:'center', background:'#fff', borderRadius:'8px', border:'1px solid var(--sand)' }}>No product sales yet.</div>
              : summary?.top_products?.map((p, i) => (
              <div key={p.id} style={{ background:'#fff', border:'1px solid var(--sand)', borderRadius:'10px', padding:'1rem 1.5rem', marginBottom:'0.75rem', display:'flex', alignItems:'center', gap:'1.25rem', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:'var(--cream)', border:'1px solid var(--sand)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'monospace', fontWeight:'bold', fontSize:'0.9rem', color:'var(--ochre)', flexShrink:0 }}>#{i+1}</div>
                {p.img_url && <img src={p.img_url} alt={p.name} style={{ width:'56px', height:'56px', objectFit:'cover', borderRadius:'6px', flexShrink:0 }} />}
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, color:'var(--deep-brown)' }}>{p.name}</div>
                  <div style={{ color:'var(--mud)', fontSize:'0.82rem', fontFamily:'monospace', marginTop:'0.15rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>{p.category}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ color:'var(--ochre)', fontFamily:'monospace', fontWeight:'bold' }}>₹{parseFloat(p.revenue).toLocaleString('en-IN')}</div>
                  <div style={{ color:'var(--mud)', fontSize:'0.8rem', fontFamily:'monospace' }}>{p.units_sold} units sold</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ORDERS TAB */}
        {!loading && tab === 'orders' && (
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', color:'var(--deep-brown)', marginBottom:'1.5rem' }}>Orders for My Products</h2>
            {orders.length === 0
              ? <div style={{ color:'var(--mud)', padding:'3rem', textAlign:'center', background:'#fff', borderRadius:'8px', border:'1px solid var(--sand)' }}><div style={{ fontSize:'2rem' }}>📦</div><p>No orders yet.</p></div>
              : orders.map((o, i) => (
              <div key={i} style={{ background:'#fff', border:'1px solid var(--sand)', borderRadius:'10px', padding:'1.25rem 1.5rem', marginBottom:'0.75rem', display:'flex', gap:'1rem', alignItems:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
                <img src={o.img_url} alt={o.product_name} style={{ width:'60px', height:'60px', objectFit:'cover', borderRadius:'6px' }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, color:'var(--deep-brown)', fontSize:'0.95rem' }}>{o.product_name}</div>
                  <div style={{ color:'var(--mud)', fontSize:'0.82rem', marginTop:'0.15rem' }}>by {o.customer_name} · {new Date(o.created_at).toLocaleDateString('en-IN')}</div>
                </div>
                <div style={{ fontFamily:'monospace', fontSize:'0.85rem', color:'var(--mud)' }}>×{o.qty}</div>
                <div style={{ fontFamily:'monospace', color:'var(--ochre)', fontWeight:'bold', fontSize:'1rem' }}>₹{parseFloat(o.unit_price).toLocaleString()}</div>
                <span style={{ background:'rgba(196,116,42,0.12)', color:'var(--ochre)', padding:'0.25rem 0.7rem', borderRadius:'99px', fontSize:'0.73rem', fontFamily:'monospace', textTransform:'uppercase' }}>{o.status}</span>
              </div>
            ))}
          </div>
        )}

        {/* ADD PRODUCT TAB */}
        {!loading && tab === 'add-product' && (
          <form onSubmit={handleAddProduct} style={{ maxWidth:'640px', background:'#fff', padding:'2rem', borderRadius:'10px', border:'1px solid var(--sand)', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', color:'var(--deep-brown)', marginBottom:'1.5rem' }}>Add New Product</h2>
            {[['Product Name *','text','name',true],['Description *','textarea','description',true]].map(([label, type, key, req]) => (
              <label key={key} style={{ display:'block', fontSize:'0.76rem', color:'var(--mud)', fontFamily:'monospace', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'1rem' }}>{label}
                {type === 'textarea'
                  ? <textarea required={req} rows={3} value={form[key]} onChange={e => set(key, e.target.value)} style={{ ...inp, resize:'vertical' }} />
                  : <input required={req} type={type} value={form[key]} onChange={e => set(key, e.target.value)} style={inp} />}
              </label>
            ))}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              {[['Price (₹) *','number','price',true],['Old Price (₹)','number','old_price',false],['Tribe','text','tribe',false],['State','text','state',false]].map(([label,type,key,req]) => (
                <label key={key} style={{ display:'block', fontSize:'0.76rem', color:'var(--mud)', fontFamily:'monospace', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'1rem' }}>{label}
                  <input required={req} type={type} min={type==='number'?1:undefined} value={form[key]} onChange={e => set(key, e.target.value)} style={inp} />
                </label>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <label style={{ display:'block', fontSize:'0.76rem', color:'var(--mud)', fontFamily:'monospace', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'1rem' }}>Category *
                <select value={form.category} onChange={e => set('category', e.target.value)} style={inp}>
                  {['pottery','jewelry','art','textile','woodwork'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                </select>
              </label>
              <label style={{ display:'block', fontSize:'0.76rem', color:'var(--mud)', fontFamily:'monospace', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'1rem' }}>Stock *
                <input required type="number" min="1" value={form.stock} onChange={e => set('stock', e.target.value)} style={inp} />
              </label>
            </div>
            <label style={{ display:'block', fontSize:'0.76rem', color:'var(--mud)', fontFamily:'monospace', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'1rem' }}>Image URL
              <input type="url" value={form.img_url} onChange={e => set('img_url', e.target.value)} style={inp} placeholder="https://..." />
            </label>
            <label style={{ display:'block', fontSize:'0.76rem', color:'var(--mud)', fontFamily:'monospace', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'1.5rem' }}>Badge (optional)
              <input type="text" value={form.badge} onChange={e => set('badge', e.target.value)} style={inp} placeholder="Bestseller · New · Limited" />
            </label>
            <button type="submit" disabled={submitting} style={{ width:'100%', padding:'0.9rem', background:'var(--ochre)', color:'#fff', border:'none', borderRadius:'6px', fontSize:'0.9rem', fontFamily:'monospace', letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer', opacity:submitting?0.7:1 }}>
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          </form>
        )}

        {/* HERITAGE ARCHIVE TAB */}
        {!loading && tab === 'heritage' && (
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', color:'var(--deep-brown)', marginBottom:'0.5rem' }}>Heritage Archive</h2>
            <p style={{ color:'var(--mud)', fontSize:'0.9rem', marginBottom:'2rem' }}>Browse the cultural archive — symbols, traditional pigments, and tribal motifs relevant to your craft.</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:'1.25rem' }}>
              {archive.map(item => (
                <div key={item.id} style={{ background:'#fff', border:'1px solid var(--sand)', borderRadius:'10px', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
                  <img src={item.img} alt={item.name} style={{ width:'100%', height:'140px', objectFit:'cover' }} />
                  <div style={{ padding:'1.25rem' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.5rem' }}>
                      <div style={{ fontWeight:700, color:'var(--deep-brown)', fontSize:'0.95rem' }}>{item.name}</div>
                      <span style={{ background:item.type==='symbol'?'#fef3c7':'#ecfdf5', color:item.type==='symbol'?'#92400e':'#166534', padding:'0.15rem 0.5rem', borderRadius:'4px', fontSize:'0.7rem', fontFamily:'monospace', textTransform:'uppercase' }}>{item.type}</span>
                    </div>
                    <p style={{ color:'var(--mud)', fontSize:'0.83rem', lineHeight:1.5, margin:'0 0 0.75rem' }}>{item.description}</p>
                    <div style={{ color:'var(--ochre)', fontFamily:'monospace', fontSize:'0.75rem' }}>{item.entries} Entries</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STORY CURATION TAB */}
        {!loading && tab === 'curation' && (
          <div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', color:'var(--deep-brown)', marginBottom:'0.5rem' }}>Story Curation</h2>
            <p style={{ color:'var(--mud)', fontSize:'0.9rem', marginBottom:'2rem' }}>Share the cultural context, oral history, or craft techniques behind your work. Stories are submitted for editorial review.</p>
            <form onSubmit={handleSaveStory} style={{ background:'#fff', border:'1px solid var(--sand)', borderRadius:'10px', padding:'2rem', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
              <label style={{ display:'block', color:'var(--mud)', fontFamily:'monospace', fontSize:'0.76rem', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.4rem' }}>Story Title</label>
              <input required type="text" placeholder="e.g. The Weaver's Song" value={story.title} onChange={e => setStory(s => ({ ...s, title:e.target.value }))} style={inp} />
              <label style={{ display:'block', color:'var(--mud)', fontFamily:'monospace', fontSize:'0.76rem', letterSpacing:'0.08em', textTransform:'uppercase', margin:'1rem 0 0.4rem' }}>Story Content</label>
              <textarea required rows={8} placeholder="Write about the cultural significance, techniques, or personal story behind your craft..." value={story.content} onChange={e => setStory(s => ({ ...s, content:e.target.value }))} style={{ ...inp, resize:'vertical' }} />
              {story.content && (
                <div style={{ background:'var(--cream)', borderRadius:'8px', padding:'1.5rem', margin:'1rem 0', border:'1px solid var(--sand)' }}>
                  <div style={{ fontFamily:'monospace', fontSize:'0.72rem', color:'var(--ochre)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.75rem' }}>Preview</div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", color:'var(--deep-brown)', marginBottom:'0.75rem' }}>{story.title||'Story Title'}</h3>
                  <p style={{ color:'var(--mud)', lineHeight:1.7, fontSize:'0.95rem' }}>{story.content}</p>
                </div>
              )}
              <div style={{ display:'flex', gap:'1rem', marginTop:'1rem' }}>
                <button type="submit" disabled={saving} style={{ padding:'0.75rem 2rem', background:'var(--ochre)', color:'#fff', border:'none', borderRadius:'6px', fontFamily:'monospace', fontSize:'0.8rem', letterSpacing:'0.08em', textTransform:'uppercase', cursor:'pointer', opacity:saving?0.7:1 }}>
                  {saving ? 'Saving...' : '📝 Submit Story'}
                </button>
                <button type="button" onClick={() => setStory({ title:'', artisan_id:'', content:'' })} style={{ padding:'0.75rem 1.5rem', background:'transparent', color:'var(--mud)', border:'1px solid var(--sand)', borderRadius:'6px', fontFamily:'monospace', fontSize:'0.8rem', textTransform:'uppercase', cursor:'pointer' }}>Clear</button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
