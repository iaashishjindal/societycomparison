import React, { createContext, useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await adminAPI.checkAuth();
        setIsAdmin(res.data.isAdmin);
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (password) => {
    try {
      await adminAPI.login(password);
      setIsAdmin(true);
      return true;
    } catch (error) {
      setIsAdmin(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await adminAPI.logout();
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
