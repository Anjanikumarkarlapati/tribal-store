import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import api from '../api/api';

const inp = { width:'100%', padding:'0.75rem 1rem', border:'1px solid var(--sand)', borderRadius:'4px', fontSize:'1rem', background:'#fff', outline:'none', marginTop:'0.3rem' };
const lbl = { display:'block', fontSize:'0.8rem', color:'var(--mud)', fontFamily:'monospace', letterSpacing:'0.05em', textTransform:'uppercase', marginBottom:'1rem' };

export default function Checkout() {
  const { cart, getTotal, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(null);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return showToast('Your cart is empty', 'error');
    setLoading(true);
    try {
      const result = await api.createOrder({ shipping_address: address, cart_items: cart });
      setPlaced(result);
      clearCart();
      showToast('Order placed successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (placed) return (
    <div style={{paddingTop:'72px',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--cream)'}}>
      <div style={{textAlign:'center',padding:'3rem',background:'#fff',borderRadius:'8px',boxShadow:'0 4px 20px rgba(0,0,0,0.08)',maxWidth:'480px'}}>
        <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🎉</div>
        <h2 style={{color:'var(--deep-brown)',marginBottom:'0.5rem'}}>Order Placed!</h2>
        <p style={{color:'var(--mud)',marginBottom:'0.5rem'}}>Order Number: <strong style={{fontFamily:'monospace',color:'var(--ochre)'}}>{placed.order_number}</strong></p>
        <p style={{color:'var(--mud)',marginBottom:'2rem'}}>Thank you for supporting tribal artisans.</p>
        <div style={{display:'flex',gap:'1rem',justifyContent:'center'}}>
          <button onClick={() => navigate('/dashboard/customer')} style={{padding:'0.75rem 1.5rem',background:'var(--ochre)',color:'#fff',border:'none',borderRadius:'4px',cursor:'pointer',fontFamily:'monospace',fontSize:'0.8rem',letterSpacing:'0.05em',textTransform:'uppercase'}}>My Orders</button>
          <button onClick={() => navigate('/shop')} style={{padding:'0.75rem 1.5rem',background:'transparent',color:'var(--ochre)',border:'1px solid var(--ochre)',borderRadius:'4px',cursor:'pointer',fontFamily:'monospace',fontSize:'0.8rem',letterSpacing:'0.05em',textTransform:'uppercase'}}>Shop More</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{paddingTop:'72px',minHeight:'100vh',background:'var(--cream)'}}>
      <div style={{maxWidth:'900px',margin:'0 auto',padding:'3rem 2rem'}}>
        <h1 style={{fontSize:'2.5rem',color:'var(--deep-brown)',marginBottom:'3rem'}}>Checkout</h1>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3rem'}}>
          <form onSubmit={handleOrder}>
            <h2 style={{fontSize:'1.5rem',color:'var(--deep-brown)',marginBottom:'1.5rem'}}>Shipping Details</h2>
            <label style={lbl}>Full Address
              <textarea value={address} onChange={e => setAddress(e.target.value)} required rows={4} style={{...inp,resize:'vertical'}} placeholder="House/Flat No, Street, City, State, Pincode" />
            </label>

            <h2 style={{fontSize:'1.5rem',color:'var(--deep-brown)',margin:'2rem 0 1.5rem'}}>Payment Method</h2>
            <div style={{display:'flex',flexDirection:'column',gap:'1rem',marginBottom:'2rem'}}>
              {/* UPI Option */}
              <label style={{display:'flex',alignItems:'flex-start',gap:'1rem',padding:'1rem',border:`1px solid ${paymentMethod==='upi'?'var(--ochre)':'var(--sand)'}`,borderRadius:'4px',background:paymentMethod==='upi'?'#fffbfa':'#fff',cursor:'pointer', transition:'all 0.2s'}}>
                <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} style={{marginTop:'4px',accentColor:'var(--ochre)'}} />
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,color:'var(--deep-brown)',marginBottom:'0.25rem'}}>UPI</div>
                  <div style={{fontSize:'0.85rem',color:'var(--mud)'}}>Pay via Google Pay, PhonePe, Paytm, etc.</div>
                  {paymentMethod === 'upi' && (
                    <input type="text" placeholder="Enter UPI ID (e.g. name@okhdfcbank)" required style={{...inp,marginTop:'1rem'}} />
                  )}
                </div>
              </label>

              {/* Card Option */}
              <label style={{display:'flex',alignItems:'flex-start',gap:'1rem',padding:'1rem',border:`1px solid ${paymentMethod==='card'?'var(--ochre)':'var(--sand)'}`,borderRadius:'4px',background:paymentMethod==='card'?'#fffbfa':'#fff',cursor:'pointer', transition:'all 0.2s'}}>
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} style={{marginTop:'4px',accentColor:'var(--ochre)'}} />
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,color:'var(--deep-brown)',marginBottom:'0.25rem'}}>Credit / Debit Card</div>
                  <div style={{fontSize:'0.85rem',color:'var(--mud)'}}>Safe and secure card payments.</div>
                  {paymentMethod === 'card' && (
                    <div style={{marginTop:'1rem',display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                      <input type="text" placeholder="Card Number" required style={inp} maxLength={16} />
                      <div style={{display:'flex',gap:'0.5rem'}}>
                        <input type="text" placeholder="MM/YY" required style={inp} maxLength={5} />
                        <input type="password" placeholder="CVV" required style={inp} maxLength={3} />
                      </div>
                    </div>
                  )}
                </div>
              </label>

              {/* COD Option */}
              <label style={{display:'flex',alignItems:'flex-start',gap:'1rem',padding:'1rem',border:`1px solid ${paymentMethod==='cod'?'var(--ochre)':'var(--sand)'}`,borderRadius:'4px',background:paymentMethod==='cod'?'#fffbfa':'#fff',cursor:'pointer', transition:'all 0.2s'}}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} style={{marginTop:'4px',accentColor:'var(--ochre)'}} />
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,color:'var(--deep-brown)',marginBottom:'0.25rem'}}>Cash on Delivery (COD)</div>
                  <div style={{fontSize:'0.85rem',color:'var(--mud)'}}>Pay with cash when your order is delivered.</div>
                </div>
              </label>
            </div>

            <button type="submit" disabled={loading || cart.length===0} style={{width:'100%',padding:'1rem',background:'var(--ochre)',color:'#fff',border:'none',borderRadius:'4px',fontSize:'1rem',fontFamily:'monospace',letterSpacing:'0.08em',textTransform:'uppercase',cursor:'pointer',opacity:loading?0.7:1}}>
              {loading ? 'Placing Order...' : `Place Order — ₹${getTotal().toLocaleString()}`}
            </button>
          </form>
          <div>
            <h2 style={{fontSize:'1.5rem',color:'var(--deep-brown)',marginBottom:'1.5rem'}}>Order Summary</h2>
            {cart.map(item => (
              <div key={item.id} style={{display:'flex',gap:'1rem',marginBottom:'1rem',padding:'1rem',background:'#fff',border:'1px solid var(--sand)',borderRadius:'4px'}}>
                <img src={item.img_url} alt={item.name} style={{width:'60px',height:'60px',objectFit:'cover',borderRadius:'4px'}} />
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,color:'var(--deep-brown)',fontSize:'0.95rem'}}>{item.name}</div>
                  <div style={{color:'var(--mud)',fontSize:'0.85rem'}}>Qty: {item.qty}</div>
                </div>
                <div style={{color:'var(--ochre)',fontWeight:600}}>₹{(parseFloat(item.price)*item.qty).toLocaleString()}</div>
              </div>
            ))}
            <div style={{borderTop:'2px solid var(--sand)',paddingTop:'1rem',display:'flex',justifyContent:'space-between',fontSize:'1.2rem',fontWeight:700,color:'var(--deep-brown)'}}>
              <span>Total</span><span style={{color:'var(--ochre)'}}>₹{getTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
