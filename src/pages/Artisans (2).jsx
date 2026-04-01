import { useState, useEffect } from 'react';
import ArtisanCard from '../components/ArtisanCard';
import api from '../api/api';

export default function Artisans() {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getArtisans().then(setArtisans).catch(() => setArtisans([])).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{paddingTop:'72px'}}>
      <div style={{textAlign:'center',padding:'5rem 2rem 3rem',background:'var(--deep-brown)'}}>
        <div style={{fontFamily:'monospace',fontSize:'0.7rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'1rem'}}>Our Community</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'3rem',color:'var(--cream)',marginBottom:'1rem'}}>Meet Our <em style={{color:'var(--gold)'}}>Artisans</em></h1>
        <p style={{color:'var(--sand)',fontSize:'1.1rem',maxWidth:'55ch',margin:'0 auto',lineHeight:1.7}}>Talented craftspeople from across India's tribal heartlands.</p>
      </div>
      {loading ? (
        <div style={{textAlign:'center',padding:'4rem',fontFamily:'monospace',color:'var(--mud)'}}>Loading artisans...</div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1.5rem',padding:'3rem 2rem',maxWidth:'1200px',margin:'0 auto'}}>
          {artisans.map(a => <ArtisanCard key={a.id} artisan={a} dark={false} />)}
        </div>
      )}
    </div>
  );
}
