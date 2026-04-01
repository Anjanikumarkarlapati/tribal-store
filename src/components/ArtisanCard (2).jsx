import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ArtisanCard({ artisan, dark }) {
  const [hov, setHov] = useState(false);
  const navigate = useNavigate();
  const isDark = dark === true;
  const { id, name, tribe, state, specialty, total_products, total_sales, profile_img, avatar_url } = artisan;
  const img = profile_img || avatar_url || 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&q=80';

  return (
    <div
      onClick={() => navigate('/artisans/' + id)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:isDark?'rgba(255,255,255,0.04)':'var(--cream)',
        border:'1px solid '+(hov?'var(--ochre)':'rgba(196,116,42,0.2)'),
        overflow:'hidden',cursor:'pointer',
        transition:'border-color 0.3s,transform 0.3s',
        transform:hov?'translateY(-4px)':'none'
      }}
    >
      <div style={{height:'200px',overflow:'hidden'}}>
        <img src={img} alt={name} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center top',transition:'transform 0.5s',transform:hov?'scale(1.05)':'scale(1)'}} />
      </div>
      <div style={{padding:'1.25rem 1.5rem'}}>
        <div style={{fontFamily:"'Playfair Display',serif",color:isDark?'var(--cream)':'var(--deep-brown)',fontSize:'1.05rem',marginBottom:'0.25rem'}}>{name}</div>
        <div style={{fontFamily:'monospace',fontSize:'0.62rem',color:'var(--gold)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.6rem'}}>{tribe} · {state}</div>
        <div style={{color:isDark?'var(--sand)':'var(--mud)',fontSize:'0.88rem',lineHeight:1.5,marginBottom:'1rem'}}>{specialty}</div>
        <div style={{display:'flex',gap:'1.5rem'}}>
          {[['Products', total_products||0],['Sales', total_sales||0]].map(([label,val])=>(
            <div key={label}>
              <div style={{fontFamily:'monospace',color:'var(--ochre)',fontSize:'1rem'}}>{val}</div>
              <div style={{fontFamily:'monospace',fontSize:'0.6rem',color:isDark?'rgba(255,255,255,0.4)':'var(--mud)',letterSpacing:'0.1em',textTransform:'uppercase'}}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
