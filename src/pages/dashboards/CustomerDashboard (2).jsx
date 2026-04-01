import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false));
  }, []);

  const statusColor = { pending:'#b45309', shipped:'#1d4ed8', delivered:'#15803d', cancelled:'#b91c1c', refunded:'#6b7280' };

  return (
    <div style={{paddingTop:'72px',minHeight:'100vh',background:'var(--cream)'}}>
      <div style={{background:'var(--deep-brown)',padding:'3rem 2rem'}}>
        <div style={{maxWidth:'1000px',margin:'0 auto'}}>
          <div style={{fontFamily:'monospace',fontSize:'0.7rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'0.5rem'}}>Customer Dashboard</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'2.5rem',color:'var(--cream)'}}>Welcome, {user?.name?.split(' ')[0]}</h1>
        </div>
      </div>
      <div style={{maxWidth:'1000px',margin:'3rem auto',padding:'0 2rem'}}>
        <h2 style={{fontSize:'1.8rem',color:'var(--deep-brown)',marginBottom:'2rem'}}>My Orders</h2>
        {loading ? (
          <div style={{color:'var(--mud)',fontFamily:'monospace'}}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{textAlign:'center',padding:'3rem',background:'#fff',borderRadius:'8px',border:'1px solid var(--sand)',color:'var(--mud)'}}>
            <div style={{fontSize:'2rem',marginBottom:'1rem'}}>📦</div>
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} style={{background:'#fff',border:'1px solid var(--sand)',borderRadius:'8px',padding:'1.5rem',marginBottom:'1rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
                <div>
                  <div style={{fontFamily:'monospace',fontWeight:'bold',color:'var(--ochre)',fontSize:'1rem'}}>{order.order_number}</div>
                  <div style={{color:'var(--mud)',fontSize:'0.85rem',marginTop:'0.25rem'}}>{new Date(order.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                  <span style={{background:`${statusColor[order.status]}22`,color:statusColor[order.status],padding:'0.3rem 0.8rem',borderRadius:'99px',fontSize:'0.78rem',fontFamily:'monospace',fontWeight:'bold',textTransform:'uppercase'}}>{order.status}</span>
                  <div style={{fontWeight:'bold',color:'var(--deep-brown)',fontSize:'1.1rem'}}>₹{parseFloat(order.total_price).toLocaleString()}</div>
                </div>
              </div>
              {order.items && order.items.map((item, i) => (
                <div key={i} style={{display:'flex',gap:'0.75rem',alignItems:'center',padding:'0.5rem 0',borderTop:'1px solid var(--sand)'}}>
                  <img src={item.img_url} alt={item.name} style={{width:'44px',height:'44px',objectFit:'cover',borderRadius:'4px'}} />
                  <div style={{flex:1,fontSize:'0.9rem',color:'var(--deep-brown)'}}>{item.name}</div>
                  <div style={{color:'var(--mud)',fontSize:'0.85rem',fontFamily:'monospace'}}>×{item.qty}</div>
                  <div style={{color:'var(--ochre)',fontFamily:'monospace',fontSize:'0.9rem'}}>₹{parseFloat(item.unit_price).toLocaleString()}</div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
