import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Load user on app start if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const currentUser = await authAPI.getCurrentUser();
          setUser(currentUser);
          setLoading(false);
        } catch (error) {
          console.error('Error loading user:', error);
          logout();
        }
      } else {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password);
      const { access_token, user } = response;
      
      setToken(access_token);
      setUser(user);
      localStorage.setItem('token', access_token);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      return { success: false, error: message };
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await authAPI.signup(username, email, password);
      const { access_token, user } = response;
      
      setToken(access_token);
      setUser(user);
      localStorage.setItem('token', access_token);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Signup failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
