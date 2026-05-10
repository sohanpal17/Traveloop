import React, { createContext, useContext, useState, useEffect } from 'react';
// 1. Ensure getMe and other services are imported correctly
import { getMe, login as loginApi, signup as signupApi } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await getMe();
          // Ensure this matches your backend response structure (res.data.user)
          setUser(res.data.user || res.data); 
        } catch (err) {
          console.error("Session verification failed", err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false); // CRITICAL: Stop loading once the check is done
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
    }
    return res.data;
  };

  const register = async (userData) => {
    const res = await signupApi(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // 2. This return was previously "outside" because of a missing closing brace }
  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

