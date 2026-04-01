import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CartSidebar({ isOpen, onClose }) {
  const { cart, updateQuantity, getTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',zIndex:600}} />
      <div style={{
        position:'fixed',top:0,right:0,bottom:0,width:'400px',
        background:'var(--cream)',zIndex:700,
        display:'flex',flexDirection:'column',
        boxShadow:'-4px 0 20px rgba(0,0,0,0.15)'
      }}>
        <div style={{padding:'1.5rem 2rem',borderBottom:'1px solid var(--sand)',display:'flex',justifyContent:'space-between',alignItems:'center',background:'var(--ink)'}}>
          <h3 style={{color:'var(--gold)',margin:0,fontFamily:"'Playfair Display',serif"}}>Your Cart</h3>
          <button onClick={onClose} style={{background:'transparent',border:'none',color:'var(--sand)',fontSize:'1.5rem',cursor:'pointer',lineHeight:1}}>×</button>
        </div>

        <div style={{flex:1,overflowY:'auto',padding:'1rem'}}>
          {cart.length === 0 ? (
            <div style={{textAlign:'center',padding:'3rem 1rem',color:'var(--mud)'}}>
              <div style={{fontSize:'2rem',marginBottom:'1rem'}}>🛒</div>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} style={{display:'flex',gap:'1rem',marginBottom:'1rem',padding:'1rem',border:'1px solid var(--sand)',borderRadius:'4px',background:'#fff'}}>
                <img src={item.img_url} alt={item.name} style={{width:'70px',height:'70px',objectFit:'cover',borderRadius:'4px'}} />
                <div style={{flex:1}}>
                  <h4 style={{margin:'0 0 0.25rem',fontSize:'0.95rem',color:'var(--deep-brown)'}}>{item.name}</h4>
                  <div style={{color:'var(--ochre)',fontWeight:600,marginBottom:'0.5rem'}}>₹{parseFloat(item.price).toLocaleString()}</div>
                  <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                    <button onClick={() => updateQuantity(item.product_id, item.qty - 1)} style={{width:'28px',height:'28px',background:'var(--sand)',border:'none',borderRadius:'50%',cursor:'pointer',fontSize:'1rem',display:'flex',alignItems:'center',justifyContent:'center'}}>−</button>
                    <span style={{fontFamily:'monospace',minWidth:'20px',textAlign:'center'}}>{item.qty}</span>
                    <button onClick={() => updateQuantity(item.product_id, item.qty + 1)} style={{width:'28px',height:'28px',background:'var(--sand)',border:'none',borderRadius:'50%',cursor:'pointer',fontSize:'1rem',display:'flex',alignItems:'center',justifyContent:'center'}}>+</button>
                  </div>
                </div>
                <div style={{color:'var(--deep-brown)',fontWeight:600,fontSize:'0.95rem'}}>₹{(parseFloat(item.price)*item.qty).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={{padding:'1.5rem 2rem',borderTop:'1px solid var(--sand)',background:'#fff'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'1rem',fontSize:'1.1rem'}}>
              <span style={{color:'var(--mud)'}}>Total</span>
              <strong style={{color:'var(--deep-brown)'}}>₹{getTotal().toLocaleString()}</strong>
            </div>
            {!user ? (
              <button onClick={() => { navigate('/login'); onClose(); }} style={{width:'100%',padding:'1rem',background:'var(--ochre)',color:'#fff',border:'none',borderRadius:'4px',fontSize:'1rem',cursor:'pointer',fontFamily:'monospace',letterSpacing:'0.05em'}}>
                LOGIN TO CHECKOUT
              </button>
            ) : (
              <button onClick={() => { navigate('/checkout'); onClose(); }} style={{width:'100%',padding:'1rem',background:'var(--ochre)',color:'#fff',border:'none',borderRadius:'4px',fontSize:'1rem',cursor:'pointer',fontFamily:'monospace',letterSpacing:'0.05em'}}>
                PROCEED TO CHECKOUT
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
