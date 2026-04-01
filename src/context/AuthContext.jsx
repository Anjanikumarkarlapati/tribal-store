import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tribal_token');
    if (token) {
      api.getProfile()
        .then(setUser)
        .catch(() => localStorage.removeItem('tribal_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const { token, user } = await api.login(credentials);
    localStorage.setItem('tribal_token', token);
    setUser(user);
    return user;
  };

  const loginWithGoogle = async (credential) => {
    const { token, user } = await api.loginWithGoogle(credential);
    localStorage.setItem('tribal_token', token);
    setUser(user);
    return user;
  };

  const loginWithMockGoogle = async (email) => {
    const { token, user } = await api.loginWithMockGoogle(email);
    localStorage.setItem('tribal_token', token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('tribal_token');
    setUser(null);
  };


  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, loginWithMockGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>

  );
}

export function useAuth() {
  return useContext(AuthContext);
}
