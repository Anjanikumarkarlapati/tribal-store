import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const inp = { width:'100%', padding:'0.85rem 1rem', border:'1px solid var(--sand)', borderRadius:'4px', fontSize:'1rem', background:'#fff', outline:'none', marginTop:'0.3rem' };
const lbl = { display:'block', fontSize:'0.85rem', fontFamily:'monospace', letterSpacing:'0.05em', textTransform:'uppercase', color:'var(--mud)', marginBottom:'0.8rem' };

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login({ email, password });
      showToast(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(`/dashboard/${user.role}`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{paddingTop:'72px',minHeight:'calc(100vh - 72px)',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--cream)'}}>
      <div style={{background:'#fff',padding:'3rem',borderRadius:'8px',boxShadow:'0 4px 24px rgba(0,0,0,0.08)',maxWidth:'420px',width:'100%',margin:'1rem'}}>
        <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
          <h2 style={{fontSize:'2rem',color:'var(--deep-brown)',marginBottom:'0.5rem'}}>Welcome Back</h2>
          <p style={{color:'var(--mud)',fontSize:'0.95rem'}}>Sign in to your Tribal account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label style={lbl}>Email
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inp} placeholder="you@example.com" />
          </label>
          <label style={lbl}>Password
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inp} placeholder="••••••••" />
          </label>
          <button type="submit" disabled={loading} style={{width:'100%',padding:'1rem',background:'var(--ochre)',color:'#fff',border:'none',borderRadius:'4px',fontSize:'1rem',fontFamily:'monospace',letterSpacing:'0.08em',textTransform:'uppercase',cursor:'pointer',marginTop:'0.5rem',opacity:loading?0.7:1}}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:'1.5rem',color:'var(--mud)',fontSize:'0.9rem'}}>
          Don't have an account? <Link to="/roles" style={{color:'var(--ochre)'}}>Register here</Link>
        </p>
        <div style={{marginTop:'2rem',padding:'1rem',background:'var(--cream)',borderRadius:'4px',fontSize:'0.82rem',color:'var(--mud)',fontFamily:'monospace'}}>
          <div style={{marginBottom:'0.3rem',fontWeight:'bold'}}>Demo accounts (password: password123)</div>
          <div>admin@tribal.com — Admin</div>
          <div>sunita@example.com — Artisan</div>
          <div>priya@example.com — Customer</div>
        </div>
      </div>
    </div>
  );
}
