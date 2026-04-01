import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ onCartClick }) {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      position:'fixed',top:0,left:0,right:0,
      background:'var(--ink)',color:'var(--cream)',
      padding:'0 2.5rem',height:'72px',
      display:'flex',alignItems:'center',justifyContent:'space-between',
      zIndex:500,borderBottom:'1px solid rgba(196,116,42,0.2)'
    }}>
      <Link to="/" style={{color:'var(--gold)',fontSize:'1.5rem',fontFamily:"'Playfair Display',serif",fontWeight:700,textDecoration:'none'}}>
        Tribal
      </Link>
      <div style={{display:'flex',gap:'2rem',alignItems:'center'}}>
        {[['Shop','/shop'],['Artisans','/artisans'],['Join Us','/roles']].map(([label,path])=>(
          <Link key={path} to={path} style={{color:'var(--sand)',textDecoration:'none',fontFamily:'monospace',fontSize:'0.78rem',letterSpacing:'0.08em',textTransform:'uppercase'}}>{label}</Link>
        ))}
        {user ? (
          <>
            <Link to={`/dashboard/${user.role}`} style={{color:'var(--gold)',textDecoration:'none',fontFamily:'monospace',fontSize:'0.78rem',letterSpacing:'0.08em',textTransform:'uppercase'}}>
              {user.name?.split(' ')[0]}
            </Link>
            <button onClick={handleLogout} style={{background:'transparent',color:'var(--sand)',border:'1px solid rgba(255,255,255,0.15)',padding:'0.4rem 1rem',fontFamily:'monospace',fontSize:'0.72rem',letterSpacing:'0.08em',textTransform:'uppercase',cursor:'pointer'}}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{color:'var(--gold)',textDecoration:'none',fontFamily:'monospace',fontSize:'0.78rem',letterSpacing:'0.08em',textTransform:'uppercase'}}>Login</Link>
        )}
        <button onClick={onCartClick} style={{background:'transparent',color:'var(--sand)',border:'1px solid rgba(255,255,255,0.15)',padding:'0.4rem 1.2rem',fontFamily:'monospace',fontSize:'0.72rem',letterSpacing:'0.08em',textTransform:'uppercase',cursor:'pointer'}}>
          Cart{itemCount > 0 ? ` (${itemCount})` : ''}
        </button>
      </div>
    </nav>
  );
}
