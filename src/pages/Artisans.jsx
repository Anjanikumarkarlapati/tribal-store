import { useState, useEffect } from 'react';
import api from '../api/api';

/* ─── Inline fallback artisans if DB is empty ─────────────────────────── */
const FALLBACK_ARTISANS = [
  {
    id: 1, name: 'Sunita Barku', tribe: 'Warli Tribe', state: 'Maharashtra',
    specialty: 'Warli Paintings', bio: "Third-generation Warli painter from Palghar district. Sunita's intricate dot-and-line motifs narrate daily village life and harvest festivals.",
    total_products: 5, total_sales: 25, avg_rating: 4.8,
    profile_img: 'https://randomuser.me/api/portraits/women/40.jpg',
  },
  {
    id: 2, name: 'Ramesh Ganda', tribe: 'Bastar Tribe', state: 'Chhattisgarh',
    specialty: 'Dhokra Metal Casting', bio: "Master of the ancient lost-wax casting technique. Ramesh's brass figurines draw inspiration from Bastar forest wildlife and tribal deities.",
    total_products: 8, total_sales: 42, avg_rating: 4.9,
    profile_img: 'https://randomuser.me/api/portraits/men/43.jpg',
  },
  {
    id: 3, name: 'Kamla Devi', tribe: 'Mithila Community', state: 'Bihar',
    specialty: 'Madhubani Paintings', bio: 'Known for vibrant Madhubani art depicting nature and mythology. Received national recognition for her contributions to this ancient folk tradition.',
    total_products: 24, total_sales: 187, avg_rating: 4.7,
    profile_img: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    id: 4, name: 'Lakshmi Devi', tribe: 'Toda Tribe', state: 'Tamil Nadu',
    specialty: 'Embroidered Textiles', bio: 'Expert in traditional Toda red-and-black embroidery. One of only 12 remaining women who practice the sacred Pukhoor embroidery technique.',
    total_products: 12, total_sales: 65, avg_rating: 4.9,
    profile_img: 'https://randomuser.me/api/portraits/women/26.jpg',
  },
  {
    id: 5, name: 'Naveen Gond', tribe: 'Gond Tribe', state: 'Madhya Pradesh',
    specialty: 'Gond Art', bio: "Renowned Gond artist capturing folklore elements of nature. Naveen's vibrant canvases are featured in national galleries and international exhibitions.",
    total_products: 15, total_sales: 80, avg_rating: 4.8,
    profile_img: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
  {
    id: 6, name: 'Bhil Ram', tribe: 'Bhil Tribe', state: 'Rajasthan',
    specialty: 'Beaded Jewelry', bio: "Creating intricate tribal beaded jewelry for two decades. His necklaces and anklets blend ancestral patterns with contemporary wearable aesthetics.",
    total_products: 9, total_sales: 30, avg_rating: 4.7,
    profile_img: 'https://randomuser.me/api/portraits/men/33.jpg',
  },
  {
    id: 7, name: 'Priya Santhal', tribe: 'Santhal Tribe', state: 'Jharkhand',
    specialty: 'Kantha Embroidery', bio: "Priya leads a women's cooperative of 30 Santhal artisans, producing stunning Kantha quilts that transform simple cloth into stories of their land.",
    total_products: 7, total_sales: 48, avg_rating: 4.8,
    profile_img: 'https://randomuser.me/api/portraits/women/55.jpg',
  },
  {
    id: 8, name: 'Mohan Koya', tribe: 'Koya Tribe', state: 'Andhra Pradesh',
    specialty: 'Bamboo Craft', bio: 'Skilled bamboo craftsman from the Godavari delta region. His handwoven baskets and furniture pieces celebrate the Koya relationship with the forest.',
    total_products: 11, total_sales: 58, avg_rating: 4.6,
    profile_img: 'https://randomuser.me/api/portraits/men/67.jpg',
  },
];

const SPECIALTY_COLORS = {
  'Warli Paintings':      { bg: '#f5ebe0', accent: '#c4742a' },
  'Dhokra Metal Casting': { bg: '#e8e0d5', accent: '#8b6914' },
  'Madhubani Paintings':  { bg: '#fce8e0', accent: '#d4542a' },
  'Embroidered Textiles': { bg: '#e0e8f0', accent: '#2a6494' },
  'Gond Art':             { bg: '#e0f0e8', accent: '#2a8454' },
  'Beaded Jewelry':       { bg: '#f0e0e8', accent: '#a42a6a' },
  'Kantha Embroidery':    { bg: '#f0ece0', accent: '#8a6c2a' },
  'Bamboo Craft':         { bg: '#e4f0e0', accent: '#4a7c3a' },
};

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill={s <= Math.round(rating) ? '#c4742a' : '#d9cec4'}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
      <span style={{ fontSize: '0.78rem', color: '#8a7060', marginLeft: '2px' }}>{Number(rating).toFixed(1)}</span>
    </div>
  );
}

function ArtisanCard({ artisan }) {
  const [hovered, setHovered] = useState(false);
  const colors = SPECIALTY_COLORS[artisan.specialty] || { bg: '#f5ebe0', accent: '#c4742a' };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: hovered
          ? '0 24px 48px rgba(28,16,8,0.18)'
          : '0 4px 20px rgba(28,16,8,0.08)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Color band top */}
      <div style={{
        height: '8px',
        background: `linear-gradient(90deg, ${colors.accent}, ${colors.bg})`,
      }} />

      {/* Profile section */}
      <div style={{
        padding: '2rem 2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        background: `linear-gradient(180deg, ${colors.bg}44, #fff)`,
      }}>
        {/* Avatar */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: `4px solid ${colors.accent}`,
          boxShadow: `0 8px 24px ${colors.accent}44`,
          marginBottom: '1.2rem',
          flexShrink: 0,
        }}>
          <img
            src={artisan.profile_img || artisan.avatar_url || `https://api.dicebear.com/7.x/personas/svg?seed=${artisan.name}`}
            alt={artisan.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { e.target.src = `https://api.dicebear.com/7.x/personas/svg?seed=${artisan.name}`; }}
          />
        </div>

        {/* Name */}
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.3rem',
          color: '#2d1a0a',
          margin: '0 0 0.3rem',
          lineHeight: 1.2,
        }}>{artisan.name}</h3>

        {/* Tribe + State */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.7rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          <span style={{
            background: colors.accent,
            color: '#fff',
            padding: '2px 10px',
            borderRadius: '12px',
            fontSize: '0.7rem',
            fontFamily: 'monospace',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>{artisan.tribe}</span>
          <span style={{ fontSize: '0.78rem', color: '#8a7060' }}>
            📍 {artisan.state}
          </span>
        </div>

        {/* Specialty */}
        <div style={{
          fontFamily: 'monospace',
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: colors.accent,
          marginBottom: '1rem',
          fontWeight: 'bold',
        }}>{artisan.specialty}</div>

        {/* Star rating */}
        <StarRating rating={artisan.avg_rating || 5} />
      </div>

      {/* Bio */}
      <div style={{
        padding: '0 2rem 1.5rem',
        fontSize: '0.88rem',
        color: '#6b5a4e',
        lineHeight: 1.7,
        flex: 1,
        textAlign: 'center',
        fontFamily: "'Crimson Pro', serif",
        fontStyle: 'italic',
      }}>
        "{artisan.bio}"
      </div>

      {/* Stats bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        borderTop: `1px solid ${colors.bg}`,
        background: `${colors.bg}88`,
      }}>
        {[
          { label: 'Products', value: artisan.total_products || 0 },
          { label: 'Sales', value: artisan.total_sales || 0 },
          { label: 'Rating', value: `${Number(artisan.avg_rating || 0).toFixed(1)}★` },
        ].map(s => (
          <div key={s.label} style={{
            padding: '0.9rem 0.5rem',
            textAlign: 'center',
            borderRight: s.label !== 'Rating' ? `1px solid ${colors.accent}22` : 'none',
          }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.2rem',
              color: colors.accent,
              fontWeight: 'bold',
              lineHeight: 1,
            }}>{s.value}</div>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#8a7060',
              marginTop: '3px',
            }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Artisans() {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.getArtisans()
      .then(data => setArtisans(data && data.length > 0 ? data : FALLBACK_ARTISANS))
      .catch(() => setArtisans(FALLBACK_ARTISANS))
      .finally(() => setLoading(false));
  }, []);

  const states = ['all', ...new Set(artisans.map(a => a.state))];
  const displayed = filter === 'all' ? artisans : artisans.filter(a => a.state === filter);

  return (
    <div style={{ paddingTop: '72px', background: '#faf7f2', minHeight: '100vh' }}>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div style={{
        textAlign: 'center',
        padding: '6rem 2rem 4rem',
        background: 'linear-gradient(rgba(28,16,8,0.75), rgba(28,16,8,0.75)), url(https://images.unsplash.com/photo-1544965850-6f816af7cebc?auto=format&fit=crop&q=80) center/cover no-repeat',
      }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>
          Our Community
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', color: 'var(--cream)', marginBottom: '1.2rem', lineHeight: 1.15 }}>
          Meet Our <em style={{ color: 'var(--gold)' }}>Artisans</em>
        </h1>
        <p style={{ color: 'var(--sand)', fontSize: '1.1rem', maxWidth: '55ch', margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
          Talented craftspeople from across India's tribal heartlands — each carrying forward
          centuries of tradition through their hands.
        </p>

        {/* Hero stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
          {[
            { num: '8+', label: 'Artisans' },
            { num: '40+', label: 'Products' },
            { num: '8', label: 'Tribes' },
            { num: '7', label: 'States' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: 'var(--gold)', lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── State filter pills ────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '0.6rem',
        padding: '2rem 1.5rem',
        background: '#fff',
        borderBottom: '1px solid #e8ddd4',
      }}>
        {states.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '0.45rem 1.1rem',
            borderRadius: '50px',
            border: `2px solid ${filter === s ? '#c4742a' : '#e8ddd4'}`,
            background: filter === s ? '#c4742a' : 'transparent',
            color: filter === s ? '#fff' : '#6b5a4e',
            fontFamily: 'monospace',
            fontSize: '0.72rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontWeight: filter === s ? 'bold' : 'normal',
          }}>
            {s === 'all' ? '🗺 All States' : s}
          </button>
        ))}
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      <div style={{ padding: '3rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem', fontFamily: 'monospace', color: '#c4742a', fontSize: '1rem', letterSpacing: '0.1em' }}>
            ✦ Loading artisans...
          </div>
        ) : (
          <>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#8a7060',
              marginBottom: '2rem',
              textAlign: 'center',
            }}>
              Showing {displayed.length} artisan{displayed.length !== 1 ? 's' : ''}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '2rem',
            }}>
              {displayed.map(a => <ArtisanCard key={a.id} artisan={a} />)}
            </div>
          </>
        )}
      </div>

      {/* ── Join CTA ─────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1c1008, #3d2010)',
        padding: '5rem 2rem',
        textAlign: 'center',
        marginTop: '2rem',
      }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '1rem' }}>
          Join the Community
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', color: 'var(--cream)', marginBottom: '1rem' }}>
          Are you a tribal artisan?
        </h2>
        <p style={{ color: 'var(--sand)', maxWidth: '50ch', margin: '0 auto 2rem', lineHeight: 1.7 }}>
          Share your craft with the world. Join Tribal and reach buyers who value authentic, handmade heritage.
        </p>
        <a href="/roles" style={{
          display: 'inline-block',
          background: 'var(--gold)',
          color: '#1c1008',
          padding: '0.9rem 2.5rem',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          fontWeight: 'bold',
          transition: 'all 0.2s',
        }}>
          Join as Artisan →
        </a>
      </div>
    </div>
  );
}
