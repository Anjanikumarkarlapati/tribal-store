import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ConsultantDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div style={{paddingTop:'72px',minHeight:'100vh',background:'var(--cream)'}}>
      <div style={{background:'var(--deep-brown)',padding:'3rem 2rem'}}>
        <div style={{maxWidth:'900px',margin:'0 auto'}}>
          <div style={{fontFamily:'monospace',fontSize:'0.7rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'0.5rem'}}>Consultant Dashboard</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'2.5rem',color:'var(--cream)'}}>Welcome, {user?.name?.split(' ')[0]}</h1>
        </div>
      </div>
      <div style={{maxWidth:'900px',margin:'3rem auto',padding:'0 2rem',textAlign:'center'}}>
        <div style={{fontSize:'3rem',marginBottom:'1.5rem'}}>💼</div>
        <h2 style={{color:'var(--deep-brown)',marginBottom:'1rem'}}>Consultant features coming soon</h2>
        <p style={{color:'var(--mud)',lineHeight:1.7,maxWidth:'50ch',margin:'0 auto 2rem'}}>
          We are building tools for consultants to guide artisans, review their businesses, and help them grow. Check back soon!
        </p>
        <button onClick={() => navigate('/shop')} style={{padding:'0.75rem 2rem',background:'var(--ochre)',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer',fontFamily:'monospace',fontSize:'0.8rem',letterSpacing:'0.08em',textTransform:'uppercase'}}>
          Browse the Shop
        </button>
      </div>
    </div>
  );
}
