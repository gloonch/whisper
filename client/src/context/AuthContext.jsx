import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../lib/axios';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage on app start
    const storedUser = localStorage.getItem('whisper_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('whisper_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post('/auth/login', credentials);
      const userData = response.data;
      
      // Store user data in state and localStorage
      setUser(userData);
      localStorage.setItem('whisper_user', JSON.stringify(userData));
      
      // Success handled by component
      return userData;
    } catch (error) {
      // Don't show toast here, let the component handle it
      // Just format the error and re-throw
      if (error.response?.data?.message === 'invalid username or password') {
        const customError = new Error('Username or password is incorrect');
        customError.originalError = error;
        throw customError;
      } else if (error.response?.status === 401) {
        const customError = new Error('Username or password is incorrect');
        customError.originalError = error;
        throw customError;
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        const customError = new Error('Network error. Please check your connection.');
        customError.originalError = error;
        throw customError;
      } else {
        const customError = new Error(error.response?.data?.message || 'Failed to sign in');
        customError.originalError = error;
        throw customError;
      }
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      const registeredUser = response.data;
      
      // Store user data in state and localStorage
      setUser(registeredUser);
      localStorage.setItem('whisper_user', JSON.stringify(registeredUser));
      
      // Success handled by component
      return registeredUser;
    } catch (error) {
      // Don't show toast here, let the component handle it
      if (error.response?.data?.message === 'username already exists') {
        const customError = new Error('Username is already taken');
        customError.originalError = error;
        throw customError;
      } else if (error.response?.data?.message === 'email already exists') {
        const customError = new Error('Email is already registered');
        customError.originalError = error;
        throw customError;
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        const customError = new Error('Network error. Please check your connection.');
        customError.originalError = error;
        throw customError;
      } else {
        const customError = new Error(error.response?.data?.message || 'Failed to create account');
        customError.originalError = error;
        throw customError;
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('whisper_user');
    // Logout success handled by UI
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-deep">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};