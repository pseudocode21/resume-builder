import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/api/auth/profile');
          setUser(res.data);
        } catch (err) {
          console.error("Failed to restore session:", err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { token, ...userData } = res.data;
    localStorage.setItem('token', token);
    setUser(userData);
    return res.data;
  };

  const registerUser = async (name, email, password, profileImageUrl) => {
    const res = await api.post('/api/auth/register', { name, email, password, profileImageUrl });
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const res = await api.get('/api/auth/profile');
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error("Failed to refresh profile:", err);
    }
  };

  const value = {
    user,
    loading,
    login,
    registerUser,
    logout,
    refreshProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
