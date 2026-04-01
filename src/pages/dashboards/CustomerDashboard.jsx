import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/api';

function OrderTracker({ status, date }) {
  if (status === 'cancelled') return <div style={{color:'var(--mud)', fontWeight:'bold', marginTop:'1rem', fontFamily:'monospace'}}>❌ Order Cancelled</div>;
  if (status === 'refunded') return <div style={{color:'var(--mud)', fontWeight:'bold', marginTop:'1rem', fontFamily:'monospace'}}>💰 Order Refunded</div>;

  const isShipped = status === 'shipped' || status === 'delivered';
  const isDelivered = status === 'delivered';
  
  // Fake timeline logic: If shipped and >2 days passed, assume it reached near location.
  const daysSinceOrder = (new Date() - new Date(date)) / (1000 * 60 * 60 * 24);
  const reachedLocation = isDelivered || (isShipped && daysSinceOrder > 2);

  const steps = [
    { label: 'Ordered', active: true },
    { label: 'Dispatched (in 2 days)', active: isShipped },
    { label: 'Reached near your location', active: reachedLocation },
    { label: 'Out for delivery', active: isDelivered }
  ];

  const activeCount = steps.filter(s => s.active).length;
  const progressWidth = activeCount === 1 ? '0%' : activeCount === 2 ? '33%' : activeCount === 3 ? '66%' : '80%';

  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', margin:'1.5rem 0', position:'relative' }}>
      {/* Background track */}
      <div style={{ position:'absolute', top:'10px', left:'12.5%', right:'12.5%', height:'3px', background:'var(--sand)', zIndex:0 }}></div>
      {/* Active track */}
      <div style={{ position:'absolute', top:'10px', left:'12.5%', width: progressWidth, height:'3px', background:'var(--ochre)', zIndex:1, transition:'width 0.4s ease' }}></div>
      
      {steps.map((step, i) => (
        <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', zIndex:2, width:'25%' }}>
          <div style={{ 
            width:'24px', height:'24px', borderRadius:'50%', 
            background: step.active ? 'var(--ochre)' : '#fff', 
            border: step.active ? '3px solid var(--ochre)' : '3px solid var(--sand)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color: '#fff', fontSize:'0.75rem', fontWeight:'bold',
            boxShadow: step.active ? '0 0 10px rgba(214,143,60,0.4)' : 'none'
          }}>
            {step.active && '✓'}
          </div>
          <div style={{ 
            fontSize:'0.75rem', fontFamily:'monospace', 
            color: step.active ? 'var(--deep-brown)' : 'var(--mud)', 
            marginTop:'0.6rem', textAlign:'center', padding:'0 5px',
            fontWeight: step.active ? 'bold' : 'normal' 
          }}>
            {step.label}
          </div>
        </div>
      ))}
    </div>
  );
}

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
      <div style={{background:'linear-gradient(rgba(28,16,8,0.85), rgba(28,16,8,0.85)), url(https://images.unsplash.com/photo-1513530176992-0cf73cb20c5f?auto=format&fit=crop&q=80) center/cover no-repeat',padding:'3rem 2rem'}}>
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
            <div key={order.id} style={{background:'#fff',border:'1px solid var(--sand)',borderRadius:'8px',padding:'1.5rem',marginBottom:'2rem', boxShadow:'0 4px 6px rgba(0,0,0,0.02)'}}>
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

              {/* Injected the Visual Order Tracker Here */}
              <OrderTracker status={order.status} date={order.created_at} />

              <div style={{ marginTop: '1.5rem'}}>
                {order.items && order.items.map((item, i) => (
                  <div key={i} style={{display:'flex',gap:'0.75rem',alignItems:'center',padding:'0.75rem 0',borderTop:'1px solid var(--sand)'}}>
                    <img src={item.img_url} alt={item.name} style={{width:'48px',height:'48px',objectFit:'cover',borderRadius:'4px'}} />
                    <div style={{flex:1,fontSize:'0.95rem',color:'var(--deep-brown)', fontWeight:'500'}}>{item.name}</div>
                    <div style={{color:'var(--mud)',fontSize:'0.85rem',fontFamily:'monospace'}}>×{item.qty}</div>
                    <div style={{color:'var(--ochre)',fontFamily:'monospace',fontSize:'0.95rem', fontWeight:'600'}}>₹{parseFloat(item.unit_price).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
