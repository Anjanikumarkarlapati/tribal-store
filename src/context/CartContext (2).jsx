import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      api.getCart().then(setCart).catch(() => setCart([]));
    } else {
      setCart([]);
    }
  }, [user]);

  const refreshCart = async () => {
    if (!user) return;
    const data = await api.getCart();
    setCart(data);
  };

  const addToCart = async (product) => {
    if (!user) return false;
    await api.addToCart({ product_id: product.id, qty: 1 });
    await refreshCart();
    return true;
  };

  const updateQuantity = async (productId, qty) => {
    if (!user) return;
    await api.updateCart(productId, { qty });
    await refreshCart();
  };

  const clearCart = async () => {
    if (!user) return;
    await api.clearCart();
    setCart([]);
  };

  const getTotal = () =>
    cart.reduce((total, item) => total + parseFloat(item.price) * item.qty, 0);

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, clearCart, getTotal, itemCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
