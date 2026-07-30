import React, { createContext, useState, useEffect } from 'react';
import { getMe, login as loginService, register as registerService, logout as logoutService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hydrate auth session on initial startup
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('resello_token');
      if (token) {
        try {
          const data = await getMe();
          if (data.success && data.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem('resello_token');
          }
        } catch (err) {
          console.error('[Auth Context Init Error]', err);
          localStorage.removeItem('resello_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loginUser = async (credentials) => {
    setError(null);
    try {
      const data = await loginService(credentials);
      if (data.success) {
        setUser(data.user);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const registerUser = async (userData) => {
    setError(null);
    try {
      const data = await registerService(userData);
      if (data.success) {
        setUser(data.user);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const logoutUser = async () => {
    await logoutService();
    setUser(null);
  };

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        loginUser,
        registerUser,
        logoutUser,
        updateUserState,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
