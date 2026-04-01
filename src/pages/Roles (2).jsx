import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useToast } from '../context/ToastContext';

const inp = { width:'100%', padding:'0.75rem 1rem', border:'1px solid var(--sand)', borderRadius:'4px', fontSize:'1rem', background:'#fff', outline:'none' };

export default function Roles() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'customer', tribe:'', state:'', specialty:'', bio:'' });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.register(form);
      showToast('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{paddingTop:'72px',background:'var(--cream)',minHeight:'100vh'}}>
      <div style={{background:'var(--deep-brown)',padding:'4rem 2rem',textAlign:'center'}}>
        <div style={{fontFamily:'monospace',fontSize:'0.7rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'1rem'}}>Join the Movement</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'3rem',color:'var(--cream)'}}>Become Part of <em style={{color:'var(--gold)'}}>Tribal</em></h1>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1.5rem',maxWidth:'1000px',margin:'3rem auto',padding:'0 2rem'}}>
        {[
          ['Customer','🛍️','Discover and buy authentic tribal crafts. Support artisan communities directly.'],
          ['Artisan','🏺','List your handcrafted pieces. Reach buyers worldwide. Get fair prices for your craft.'],
          ['Consultant','💼','Guide artisans. Help them grow their businesses and reach new markets.'],
        ].map(([role,icon,desc]) => (
          <div key={role} onClick={() => set('role', role.toLowerCase())} style={{padding:'2rem',textAlign:'center',border:'2px solid',borderColor:form.role===role.toLowerCase()?'var(--ochre)':'var(--sand)',borderRadius:'8px',cursor:'pointer',background:form.role===role.toLowerCase()?'rgba(196,116,42,0.05)':'#fff',transition:'all 0.2s'}}>
            <div style={{fontSize:'2.5rem',marginBottom:'0.75rem'}}>{icon}</div>
            <h3 style={{color:'var(--deep-brown)',marginBottom:'0.5rem'}}>{role}</h3>
            <p style={{color:'var(--mud)',fontSize:'0.9rem',lineHeight:1.5}}>{desc}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{maxWidth:'600px',margin:'0 auto 5rem',padding:'2.5rem',background:'#fff',borderRadius:'8px',boxShadow:'0 4px 20px rgba(0,0,0,0.06)'}}>
        <h2 style={{color:'var(--deep-brown)',marginBottom:'2rem',textAlign:'center'}}>Register as {form.role.charAt(0).toUpperCase()+form.role.slice(1)}</h2>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
          <div><label style={{fontSize:'0.8rem',color:'var(--mud)',fontFamily:'monospace',letterSpacing:'0.05em',textTransform:'uppercase'}}>Full Name</label><input type="text" value={form.name} onChange={e => set('name',e.target.value)} required style={{...inp,marginTop:'0.3rem'}} /></div>
          <div><label style={{fontSize:'0.8rem',color:'var(--mud)',fontFamily:'monospace',letterSpacing:'0.05em',textTransform:'uppercase'}}>Email</label><input type="email" value={form.email} onChange={e => set('email',e.target.value)} required style={{...inp,marginTop:'0.3rem'}} /></div>
        </div>
        <div style={{marginBottom:'1rem'}}><label style={{fontSize:'0.8rem',color:'var(--mud)',fontFamily:'monospace',letterSpacing:'0.05em',textTransform:'uppercase'}}>Password</label><input type="password" value={form.password} onChange={e => set('password',e.target.value)} required minLength={6} style={{...inp,marginTop:'0.3rem'}} /></div>
        {form.role === 'artisan' && (
          <>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
              <div><label style={{fontSize:'0.8rem',color:'var(--mud)',fontFamily:'monospace',letterSpacing:'0.05em',textTransform:'uppercase'}}>Tribe</label><input type="text" value={form.tribe} onChange={e => set('tribe',e.target.value)} style={{...inp,marginTop:'0.3rem'}} placeholder="e.g. Warli Tribe" /></div>
              <div><label style={{fontSize:'0.8rem',color:'var(--mud)',fontFamily:'monospace',letterSpacing:'0.05em',textTransform:'uppercase'}}>State</label><input type="text" value={form.state} onChange={e => set('state',e.target.value)} style={{...inp,marginTop:'0.3rem'}} placeholder="e.g. Maharashtra" /></div>
            </div>
            <div style={{marginBottom:'1rem'}}><label style={{fontSize:'0.8rem',color:'var(--mud)',fontFamily:'monospace',letterSpacing:'0.05em',textTransform:'uppercase'}}>Specialty</label><input type="text" value={form.specialty} onChange={e => set('specialty',e.target.value)} style={{...inp,marginTop:'0.3rem'}} placeholder="e.g. Warli Paintings" /></div>
            <div style={{marginBottom:'1rem'}}><label style={{fontSize:'0.8rem',color:'var(--mud)',fontFamily:'monospace',letterSpacing:'0.05em',textTransform:'uppercase'}}>Bio</label><textarea value={form.bio} onChange={e => set('bio',e.target.value)} rows={3} style={{...inp,marginTop:'0.3rem',resize:'vertical'}} placeholder="Tell buyers about yourself and your craft..." /></div>
          </>
        )}
        <button type="submit" disabled={loading} style={{width:'100%',padding:'1rem',background:'var(--ochre)',color:'#fff',border:'none',borderRadius:'4px',fontSize:'1rem',fontFamily:'monospace',letterSpacing:'0.08em',textTransform:'uppercase',cursor:'pointer',opacity:loading?0.7:1}}>
          {loading ? 'Registering...' : `Register as ${form.role.charAt(0).toUpperCase()+form.role.slice(1)}`}
        </button>
      </form>
    </div>
  );
}
