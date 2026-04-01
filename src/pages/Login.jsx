import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GoogleLogin } from '@react-oauth/google';

const inp = { width:'100%', padding:'0.85rem 1rem', border:'1px solid var(--sand)', borderRadius:'4px', fontSize:'1rem', background:'#fff', outline:'none', marginTop:'0.3rem' };
const lbl = { display:'block', fontSize:'0.85rem', fontFamily:'monospace', letterSpacing:'0.05em', textTransform:'uppercase', color:'var(--mud)', marginBottom:'0.8rem' };

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const { login, loginWithGoogle, loginWithMockGoogle } = useAuth();
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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const user = await loginWithGoogle(credentialResponse.credential);
      showToast(`Welcome, ${user.name.split(' ')[0]}! 🎉`);
      navigate(`/dashboard/${user.role}`);
    } catch (err) {
      showToast(err.message || 'Google sign-in failed', 'error');
    }
  };

  return (
    <div style={{paddingTop:'72px',minHeight:'calc(100vh - 72px)',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(rgba(28,16,8,0.7), rgba(28,16,8,0.7)), url(https://images.unsplash.com/photo-1606868306217-dbf5046868d2?auto=format&fit=crop&q=80) center/cover no-repeat'}}>
      <div style={{background:'#fff',padding:'3rem',borderRadius:'8px',boxShadow:'0 8px 32px rgba(0,0,0,0.2)',maxWidth:'420px',width:'100%',margin:'1rem',position:'relative',zIndex:2}}>
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

        {/* Google Sign-In Divider */}
        <div style={{display:'flex',alignItems:'center',margin:'1.5rem 0',gap:'0.75rem'}}>
          <hr style={{flex:1,border:'none',borderTop:'1px solid var(--sand)'}} />
          <span style={{color:'var(--mud)',fontSize:'0.8rem',fontFamily:'monospace',whiteSpace:'nowrap'}}>or continue with</span>
          <hr style={{flex:1,border:'none',borderTop:'1px solid var(--sand)'}} />
        </div>

        {/* Google OAuth Button */}
        <div style={{display:'flex',justifyContent:'center'}}>
          {!process.env.REACT_APP_GOOGLE_CLIENT_ID || process.env.REACT_APP_GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE' ? (
            <button 
              type="button" 
              onClick={async () => {
                const mockEmail = prompt("DEV MODE: Enter your Google email to seamlessly log in (or create a new user):", "customer@tribal.com");
                if (!mockEmail) return;
                setLoading(true);
                try {
                  const user = await loginWithMockGoogle(mockEmail);
                  showToast(`Google Auth Mocked! Welcome, ${user.name}! 🎉`);
                  navigate(`/dashboard/${user.role}`);
                } catch (err) {
                  showToast(err.message, 'error');
                } finally {
                  setLoading(false);
                }
              }}
              style={{width:'100%',padding:'1rem',background:'#fff',color:'var(--mud)',border:'1px solid #ccc',borderRadius:'4px',fontSize:'0.9rem',fontWeight:'bold',cursor:'pointer',display:'flex',justifyContent:'center',alignItems:'center',gap:'0.5rem'}}
            >
              <img src="https://www.google.com/favicon.ico" width="16" alt="G" />
              Mock Google Login (Dev Mode)
            </button>
          ) : (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => showToast('Google sign-in was cancelled or failed', 'error')}
              useOneTap={false}
              shape="rectangular"
              size="large"
              text="signin_with"
              theme="outline"
              width="358"
            />
          )}
        </div>

        <p style={{textAlign:'center',marginTop:'1.5rem',color:'var(--mud)',fontSize:'0.9rem'}}>
          Don't have an account? <Link to="/roles" style={{color:'var(--ochre)'}}>Register here</Link>
        </p>
        <div style={{marginTop:'2rem',padding:'1rem',background:'var(--cream)',borderRadius:'4px',fontSize:'0.82rem',color:'var(--mud)',fontFamily:'monospace'}}>
          <div style={{marginBottom:'0.3rem',fontWeight:'bold'}}>Demo accounts (password: password123)</div>
          <div>admin@tribal.com — Admin</div>
          <div>sunita@example.com — Artisan</div>
          <div>customer@tribal.com — Customer</div>
        </div>
      </div>
    </div>
  );
}
