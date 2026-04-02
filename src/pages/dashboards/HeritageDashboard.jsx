import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../api/api';

export default function HeritageDashboard() {
  const { showToast } = useToast();
  const [queue, setQueue]     = useState([]);
  const [archive, setArchive] = useState([]);
  const [tab, setTab]         = useState('verification');
  const [story, setStory]     = useState({ title: '', artisan_id: '', content: '' });
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getHeritageQueue(), api.getHeritageArchive()])
      .then(([q, a]) => { setQueue(q); setArchive(a); })
      .catch(() => showToast('Error loading heritage data', 'error'))
      .finally(() => setLoading(false));
  }, [showToast]);

  const handleSaveStory = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.saveHeritageStory(story);
      showToast(res.message);
      setStory({ title: '', artisan_id: '', content: '' });
    } catch (err) { showToast(err.message, 'error'); }
    finally { setSaving(false); }
  };

  const tabs = ['verification', 'stories', 'archive', 'guidelines'];
  const tabStyle = (t) => ({ padding:'0.6rem 1.4rem', border:'none', borderBottom: tab===t ? '2px solid var(--ochre)' : '2px solid transparent', cursor:'pointer', fontFamily:'monospace', fontSize:'0.78rem', letterSpacing:'0.08em', textTransform:'uppercase', background:'transparent', color: tab===t ? 'var(--ochre)' : 'var(--mud)', fontWeight: tab===t ? 700 : 400, transition:'all 0.2s' });

  const inp = { width:'100%', padding:'0.75rem 1rem', border:'1px solid var(--sand)', borderRadius:'4px', fontSize:'0.95rem', background:'#fff', outline:'none', boxSizing:'border-box', marginBottom:'1rem', fontFamily:'inherit' };

  return (
    <div style={{paddingTop:'72px',minHeight:'100vh',background:'var(--cream)'}}>
      {/* Hero Header */}
      <div style={{position:'relative',overflow:'hidden',padding:'4rem 2rem'}}>
        <img src="https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=1200&q=70" alt="Heritage" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg, rgba(255,247,237,0.96) 40%, rgba(255,247,237,0.7) 100%)'}}></div>
        <div style={{maxWidth:'1100px',margin:'0 auto',position:'relative',zIndex:1}}>
          <div style={{fontFamily:'monospace',fontSize:'0.7rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--ochre)',marginBottom:'0.75rem'}}>Active Oversight</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(2rem,5vw,3.5rem)',color:'var(--deep-brown)',margin:'0 0 0.75rem',lineHeight:1.15}}>
            Preserving the <span style={{color:'var(--ochre)',fontStyle:'italic'}}>Ancestral Thread</span><br/>through rigorous curation.
          </h1>
          <p style={{color:'var(--mud)',fontSize:'1rem',maxWidth:'520px'}}>
            Welcome, Curator. There are <strong>{queue.length}</strong> items requiring cultural authenticity checks pending for your review.
          </p>
        </div>
      </div>

      <div style={{maxWidth:'1100px',margin:'0 auto',padding:'2rem 2rem'}}>
        {/* Tabs */}
        <div style={{borderBottom:'1px solid var(--sand)',display:'flex',gap:'0.25rem',marginBottom:'2rem',overflowX:'auto'}}>
          {tabs.map(t => <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
        </div>

        {loading && <div style={{color:'var(--mud)',fontFamily:'monospace',textAlign:'center',padding:'3rem'}}>Loading heritage data...</div>}

        {/* VERIFICATION QUEUE */}
        {!loading && tab === 'verification' && (
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',color:'var(--deep-brown)',margin:0}}>Verification Queue</h2>
              <span style={{background:'var(--ochre)',color:'#fff',padding:'0.3rem 0.8rem',borderRadius:'99px',fontFamily:'monospace',fontSize:'0.78rem'}}>Batch Review</span>
            </div>
            {queue.length === 0
              ? <div style={{textAlign:'center',padding:'3rem',background:'#fff',borderRadius:'8px',border:'1px solid var(--sand)',color:'var(--mud)',fontFamily:'monospace'}}>✅ No items pending verification.</div>
              : queue.map(p => (
              <div key={p.id} style={{background:'#fff',border:'1px solid var(--sand)',borderRadius:'10px',padding:'1.25rem 1.5rem',marginBottom:'1rem',display:'flex',gap:'1.25rem',alignItems:'center',boxShadow:'0 1px 4px rgba(0,0,0,0.04)'}}>
                {p.img_url && <img src={p.img_url} alt={p.name} style={{width:'72px',height:'72px',objectFit:'cover',borderRadius:'8px',flexShrink:0}} />}
                <div style={{flex:1}}>
                  <div style={{display:'flex',gap:'0.5rem',alignItems:'center',marginBottom:'0.25rem'}}>
                    <span style={{fontWeight:700,color:'var(--deep-brown)',fontSize:'1rem'}}>{p.name}</span>
                    <span style={{background:'#fef3c7',color:'#92400e',padding:'0.15rem 0.5rem',borderRadius:'4px',fontSize:'0.72rem',fontFamily:'monospace',textTransform:'uppercase'}}>Pending</span>
                  </div>
                  <div style={{color:'var(--mud)',fontSize:'0.85rem'}}>{p.artisan_name} · {p.tribe} · {p.state}</div>
                  <div style={{color:'var(--mud)',fontSize:'0.83rem',marginTop:'0.3rem',fontStyle:'italic'}}>{p.description?.substring(0,100)}...</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'0.5rem',flexShrink:0}}>
                  <button style={{padding:'0.5rem 1rem',background:'var(--ochre)',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer',fontFamily:'monospace',fontSize:'0.75rem',textTransform:'uppercase'}}>Approve</button>
                  <button style={{padding:'0.5rem 1rem',background:'transparent',color:'#b91c1c',border:'1px solid #b91c1c',borderRadius:'4px',cursor:'pointer',fontFamily:'monospace',fontSize:'0.75rem',textTransform:'uppercase'}}>Flag</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STORY CURATION */}
        {!loading && tab === 'stories' && (
          <div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',color:'var(--deep-brown)',marginBottom:'0.5rem'}}>Story Curation</h2>
            <p style={{color:'var(--mud)',fontSize:'0.9rem',marginBottom:'2rem'}}>Review and draft artisan cultural narratives and oral history documentation.</p>
            <form onSubmit={handleSaveStory} style={{background:'#fff',border:'1px solid var(--sand)',borderRadius:'10px',padding:'2rem',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
              <label style={{display:'block',color:'var(--mud)',fontFamily:'monospace',fontSize:'0.78rem',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'0.4rem'}}>Story Title</label>
              <input type="text" required placeholder="e.g. The Weaver's Song" value={story.title} onChange={e => setStory(s => ({...s,title:e.target.value}))} style={inp} />
              <label style={{display:'block',color:'var(--mud)',fontFamily:'monospace',fontSize:'0.78rem',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'0.4rem'}}>Artisan ID (optional)</label>
              <input type="number" placeholder="Artisan ID from database" value={story.artisan_id} onChange={e => setStory(s => ({...s,artisan_id:e.target.value}))} style={inp} />
              <label style={{display:'block',color:'var(--mud)',fontFamily:'monospace',fontSize:'0.78rem',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:'0.4rem'}}>Story Content</label>
              <textarea required rows={8} placeholder="Write the artisan's story and cultural context here..." value={story.content} onChange={e => setStory(s => ({...s,content:e.target.value}))} style={{...inp,resize:'vertical'}} />
              {story.content && (
                <div style={{background:'var(--cream)',borderRadius:'8px',padding:'1.5rem',marginBottom:'1.5rem',border:'1px solid var(--sand)'}}>
                  <div style={{fontFamily:'monospace',fontSize:'0.72rem',color:'var(--ochre)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.75rem'}}>Preview</div>
                  <h3 style={{fontFamily:"'Playfair Display',serif",color:'var(--deep-brown)',marginBottom:'0.75rem'}}>{story.title||'Story Title'}</h3>
                  <p style={{color:'var(--mud)',lineHeight:1.7,fontSize:'0.95rem'}}>{story.content}</p>
                </div>
              )}
              <div style={{display:'flex',gap:'1rem'}}>
                <button type="submit" disabled={saving} style={{padding:'0.75rem 2rem',background:'var(--ochre)',color:'#fff',border:'none',borderRadius:'4px',fontFamily:'monospace',fontSize:'0.8rem',letterSpacing:'0.08em',textTransform:'uppercase',cursor:'pointer',opacity:saving?0.7:1}}>
                  {saving ? 'Saving...' : '📝 Save Draft Story'}
                </button>
                <button type="button" onClick={() => setStory({title:'',artisan_id:'',content:''})} style={{padding:'0.75rem 1.5rem',background:'transparent',color:'var(--mud)',border:'1px solid var(--sand)',borderRadius:'4px',fontFamily:'monospace',fontSize:'0.8rem',textTransform:'uppercase',cursor:'pointer'}}>Clear</button>
              </div>
            </form>
          </div>
        )}

        {/* HERITAGE ARCHIVE */}
        {!loading && tab === 'archive' && (
          <div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',color:'var(--deep-brown)',marginBottom:'0.5rem'}}>Heritage Archive</h2>
            <p style={{color:'var(--mud)',fontSize:'0.9rem',marginBottom:'2rem'}}>Browse recorded symbols, traditional pigments, and cultural motifs.</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1.25rem'}}>
              {archive.map(item => (
                <div key={item.id} style={{background:'#fff',border:'1px solid var(--sand)',borderRadius:'10px',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
                  <img src={item.img} alt={item.name} style={{width:'100%',height:'140px',objectFit:'cover'}} />
                  <div style={{padding:'1.25rem'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.5rem'}}>
                      <div style={{fontWeight:700,color:'var(--deep-brown)',fontSize:'1rem'}}>{item.name}</div>
                      <span style={{background:item.type==='symbol'?'#fef3c7':'#ecfdf5',color:item.type==='symbol'?'#92400e':'#166534',padding:'0.15rem 0.5rem',borderRadius:'4px',fontSize:'0.7rem',fontFamily:'monospace',textTransform:'uppercase'}}>{item.type}</span>
                    </div>
                    <p style={{color:'var(--mud)',fontSize:'0.85rem',lineHeight:1.5,margin:'0 0 0.75rem'}}>{item.description}</p>
                    <div style={{color:'var(--ochre)',fontFamily:'monospace',fontSize:'0.78rem'}}>{item.entries} Entries</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ETHICAL GUIDELINES */}
        {!loading && tab === 'guidelines' && (
          <div>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',color:'var(--deep-brown)',marginBottom:'0.5rem'}}>Ethical Guidelines</h2>
            <p style={{color:'var(--mud)',fontSize:'0.9rem',marginBottom:'2rem'}}>Our proposal for fair representation and cultural sensitivity, updated quarterly.</p>
            <div style={{background:'#fff',border:'1px solid var(--sand)',borderRadius:'10px',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
              {[
                {title:'Full Factual Propriety Protocol', desc:'Our proposal for fair representation and cultural sensitivity is updated quarterly. The Directorate of Curation follows the 2024 Tribal Factual Propriety Standards with strict oversight.', icon:'📜'},
                {title:'Community Consent Guidelines', desc:'All artisan stories and product descriptions require prior informed consent from the community elder council before publication.', icon:'🤝'},
                {title:'Cultural Misappropriation Policy', desc:'A zero-tolerance policy towards misrepresentation of tribal symbols, practices, or intellectual property in any commercial context.', icon:'⚖️'},
                {title:'Revenue Fairness Charter', desc:'Artisans receive minimum 70% of the sale price. Platform fees are capped and transparently disclosed to all members.', icon:'💛'},
              ].map((g, i) => (
                <div key={i} style={{padding:'1.5rem 2rem',borderBottom:'1px solid var(--sand)',display:'flex',gap:'1.25rem'}}>
                  <div style={{fontSize:'1.8rem',flexShrink:0}}>{g.icon}</div>
                  <div>
                    <div style={{fontWeight:700,color:'var(--deep-brown)',marginBottom:'0.5rem'}}>{g.title}</div>
                    <p style={{color:'var(--mud)',fontSize:'0.88rem',lineHeight:1.6,margin:0}}>{g.desc}</p>
                  </div>
                </div>
              ))}
              <div style={{padding:'1.5rem 2rem',display:'flex',gap:'1rem'}}>
                <button style={{padding:'0.65rem 1.5rem',background:'var(--ochre)',color:'#fff',border:'none',borderRadius:'4px',fontFamily:'monospace',fontSize:'0.78rem',textTransform:'uppercase',cursor:'pointer'}}>↓ Full Protocol PDF</button>
                <button style={{padding:'0.65rem 1.5rem',background:'transparent',color:'var(--ochre)',border:'1px solid var(--ochre)',borderRadius:'4px',fontFamily:'monospace',fontSize:'0.78rem',textTransform:'uppercase',cursor:'pointer'}}>Benefits by FAQ</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
