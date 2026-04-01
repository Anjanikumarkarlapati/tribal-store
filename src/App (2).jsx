import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

import Navbar         from './components/Navbar';
import CartSidebar    from './components/CartSidebar';
import Home           from './pages/Home';
import Shop           from './pages/Shop';
import ProductDetail  from './pages/ProductDetail';
import Artisans       from './pages/Artisans';
import Roles          from './pages/Roles';
import Login          from './pages/Login';
import Checkout       from './pages/Checkout';

import AdminDashboard      from './pages/dashboards/AdminDashboard';
import ArtisanDashboard    from './pages/dashboards/ArtisanDashboard';
import CustomerDashboard   from './pages/dashboards/CustomerDashboard';
import ConsultantDashboard from './pages/dashboards/ConsultantDashboard';

function PrivateRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center', color: 'var(--mud)' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && user.role !== allowedRole && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <>
      <Navbar onCartClick={() => setCartOpen(true)} />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/shop"     element={<Shop />} />
        <Route path="/shop/:id" element={<ProductDetail />} />
        <Route path="/artisans" element={<Artisans />} />
        <Route path="/roles"    element={<Roles />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/dashboard/admin"      element={<PrivateRoute allowedRole="admin"><AdminDashboard /></PrivateRoute>} />
        <Route path="/dashboard/artisan"    element={<PrivateRoute allowedRole="artisan"><ArtisanDashboard /></PrivateRoute>} />
        <Route path="/dashboard/customer"   element={<PrivateRoute allowedRole="customer"><CustomerDashboard /></PrivateRoute>} />
        <Route path="/dashboard/consultant" element={<PrivateRoute allowedRole="consultant"><ConsultantDashboard /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
