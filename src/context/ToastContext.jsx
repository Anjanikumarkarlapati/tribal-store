import { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', top: '90px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{
            background: toast.type === 'success' ? '#2d7a2d' : toast.type === 'error' ? '#a32d2d' : '#705a1a',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '6px',
            fontSize: '0.95rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'fadeIn 0.2s ease',
            maxWidth: '320px'
          }}>
            {toast.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
