import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { GoogleLogin } from '@react-oauth/google';

const inp = {
  width: '100%', padding: '0.85rem 1rem', border: '1px solid #ddd',
  borderRadius: '8px', fontSize: '1rem', background: '#fafafa',
  outline: 'none', marginTop: '0.3rem', transition: 'border-color 0.2s',
  boxSizing: 'border-box',
};
const lbl = {
  display: 'block', fontSize: '0.8rem', fontFamily: 'monospace',
  letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b5a4e',
  marginBottom: '0.9rem',
};

/* ── Mock Google Modal ──────────────────────────────────────────────────────── */
const DEMO_ACCOUNTS = [
  { email: 'admin@tribal.com',   label: 'Admin',      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',   role: 'admin' },
  { email: 'sunita@example.com', label: 'Artisan',    avatar: 'https://randomuser.me/api/portraits/women/40.jpg', role: 'artisan' },
  { email: 'customer@tribal.com',label: 'Customer',   avatar: 'https://randomuser.me/api/portraits/men/32.jpg',   role: 'customer' },
  { email: 'consultant@tribal.com',label:'Consultant',avatar: 'https://randomuser.me/api/portraits/women/12.jpg', role: 'consultant' },
];

function MockGoogleModal({ onClose, onSelect }) {
  const [customEmail, setCustomEmail] = useState('');

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '1rem',
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '2rem',
        maxWidth: '400px', width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <img src="https://www.google.com/favicon.ico" width="22" alt="Google" />
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '1rem', color: '#1c1008' }}>Sign in with Google</div>
            <div style={{ fontSize: '0.75rem', color: '#888', fontFamily: 'monospace' }}>DEV MODE — choose an account</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#aaa', lineHeight: 1 }}>×</button>
        </div>

        {/* Demo accounts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {DEMO_ACCOUNTS.map(acc => (
            <button key={acc.email} onClick={() => onSelect(acc.email)} style={{
              display: 'flex', alignItems: 'center', gap: '0.9rem',
              padding: '0.7rem 1rem', borderRadius: '10px',
              border: '1px solid #eee', background: '#fafafa',
              cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#fff5ec'}
              onMouseLeave={e => e.currentTarget.style.background = '#fafafa'}
            >
              <img src={acc.avatar} alt={acc.label} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1c1008' }}>{acc.email}</div>
                <div style={{ fontSize: '0.75rem', color: '#c4742a', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{acc.label}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #eee' }} />
          <span style={{ fontSize: '0.75rem', color: '#aaa', fontFamily: 'monospace' }}>or use any email</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #eee' }} />
        </div>

        {/* Custom email */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="email"
            placeholder="yourname@gmail.com"
            value={customEmail}
            onChange={e => setCustomEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && customEmail && onSelect(customEmail)}
            style={{ ...inp, marginTop: 0, flex: 1 }}
          />
          <button
            onClick={() => customEmail && onSelect(customEmail)}
            disabled={!customEmail}
            style={{
              padding: '0 1.1rem', borderRadius: '8px', border: 'none',
              background: customEmail ? '#c4742a' : '#eee',
              color: customEmail ? '#fff' : '#aaa',
              cursor: customEmail ? 'pointer' : 'default',
              fontWeight: 'bold', transition: 'all 0.2s',
            }}
          >→</button>
        </div>

        <p style={{ fontSize: '0.72rem', color: '#bbb', textAlign: 'center', marginTop: '1rem', fontFamily: 'monospace' }}>
          This prompt only appears in development mode. Real Google OAuth requires a Client ID.
        </p>
      </div>
    </div>
  );
}

/* ── Main Login Page ────────────────────────────────────────────────────────── */
export default function Login() {
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [loading, setLoading]       = useState(false);
  const [showMockModal, setShowMockModal] = useState(false);
  const { login, loginWithGoogle, loginWithMockGoogle } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const hasRealClientId =
    process.env.REACT_APP_GOOGLE_CLIENT_ID &&
    process.env.REACT_APP_GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE';

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

  const handleMockSelect = async (selectedEmail) => {
    setShowMockModal(false);
    setLoading(true);
    try {
      const user = await loginWithMockGoogle(selectedEmail);
      showToast(`Signed in as ${user.name} 🎉`);
      navigate(`/dashboard/${user.role}`);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showMockModal && (
        <MockGoogleModal onClose={() => setShowMockModal(false)} onSelect={handleMockSelect} />
      )}

      <div style={{
        paddingTop: '72px', minHeight: 'calc(100vh - 72px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(rgba(28,16,8,0.72), rgba(28,16,8,0.72)), url(https://images.unsplash.com/photo-1606868306217-dbf5046868d2?auto=format&fit=crop&q=80) center/cover no-repeat',
      }}>
        <div style={{
          background: '#fff', padding: '2.75rem 2.5rem', borderRadius: '16px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.25)', maxWidth: '420px',
          width: '100%', margin: '1rem',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', color: '#1c1008', marginBottom: '0.3rem' }}>
              Welcome Back
            </div>
            <p style={{ color: '#8a7060', fontSize: '0.9rem' }}>Sign in to your Tribal account</p>
          </div>

          {/* Google Button — real or mock */}
          <div style={{ marginBottom: '1.5rem' }}>
            {hasRealClientId ? (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => showToast('Google sign-in was cancelled or failed.', 'error')}
                  useOneTap={false}
                  shape="rectangular"
                  size="large"
                  text="signin_with"
                  theme="outline"
                  width="358"
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowMockModal(true)}
                disabled={loading}
                style={{
                  width: '100%', padding: '0.85rem 1rem',
                  background: '#fff', color: '#3c4043',
                  border: '1px solid #dadce0', borderRadius: '8px',
                  fontSize: '0.95rem', fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.6rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  transition: 'box-shadow 0.2s, background 0.2s',
                  opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#f8f8f8'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </button>
            )}
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 1.5rem', gap: '0.75rem' }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #eee' }} />
            <span style={{ color: '#aaa', fontSize: '0.78rem', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>or sign in with email</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #eee' }} />
          </div>

          {/* Email/Password form */}
          <form onSubmit={handleSubmit}>
            <label style={lbl}>Email
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required style={inp} placeholder="you@example.com"
                onFocus={e => e.target.style.borderColor = '#c4742a'}
                onBlur={e => e.target.style.borderColor = '#ddd'}
              />
            </label>
            <label style={lbl}>Password
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                required style={inp} placeholder="••••••••"
                onFocus={e => e.target.style.borderColor = '#c4742a'}
                onBlur={e => e.target.style.borderColor = '#ddd'}
              />
            </label>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '0.9rem', marginTop: '0.5rem',
              background: 'linear-gradient(135deg, #c4742a, #a85e1e)',
              color: '#fff', border: 'none', borderRadius: '8px',
              fontSize: '0.9rem', fontFamily: 'monospace',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 12px rgba(196,116,42,0.3)',
              transition: 'all 0.2s',
            }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', color: '#8a7060', fontSize: '0.88rem' }}>
            Don't have an account?{' '}
            <Link to="/roles" style={{ color: '#c4742a', fontWeight: '600', textDecoration: 'none' }}>Register here</Link>
          </p>

          {/* Demo accounts */}
          <div style={{
            marginTop: '1.5rem', padding: '0.9rem 1rem',
            background: '#faf7f2', borderRadius: '8px',
            fontSize: '0.78rem', color: '#8a7060', fontFamily: 'monospace',
            borderLeft: '3px solid #c4742a',
          }}>
            <div style={{ marginBottom: '0.4rem', fontWeight: 'bold', color: '#6b5a4e' }}>Demo accounts (password: password123)</div>
            {[
              'admin@tribal.com — Admin',
              'sunita@example.com — Artisan',
              'customer@tribal.com — Customer',
            ].map(line => (
              <div key={line} style={{ cursor: 'pointer', padding: '1px 0' }}
                onClick={() => {
                  const [em] = line.split(' — ');
                  setEmail(em); setPassword('password123');
                }}
                title="Click to autofill"
              >▸ {line}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
