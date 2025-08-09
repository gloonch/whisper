import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../lib/axios';
import toast from 'react-hot-toast';

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
      
      toast.success('Signed in successfully');
      return userData;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to sign in';
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/auth/register', userData);
      const registeredUser = response.data;
      
      // Store user data in state and localStorage
      setUser(registeredUser);
      localStorage.setItem('whisper_user', JSON.stringify(registeredUser));
      
      toast.success('Account created successfully');
      return registeredUser;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create account';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('whisper_user');
    toast.success('Signed out');
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