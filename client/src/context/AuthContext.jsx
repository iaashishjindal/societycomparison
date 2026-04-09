import { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin, adminLogout, checkAdminAuth } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    checkAdminAuth().then((res) => {
      setIsAdmin(res.data.isAdmin || false);
      setLoading(false);
    });
  }, []);

  const login = async (password) => {
    try {
      const res = await adminLogin(password);
      setIsAdmin(true);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await adminLogout();
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
