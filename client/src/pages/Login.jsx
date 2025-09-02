import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGlobalToast } from '../context/ToastContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { showError, showSuccess } = useGlobalToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      showError('Validation', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(formData);
      showSuccess('Authentication', 'Signed in successfully');
      navigate('/');
    } catch (error) {
      console.log('Login error caught:', error.message);
      showError('Login Failed', error.message || 'Failed to sign in');
      // Stay on login page to allow retry
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-deep px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-white">Sign in</h2>
          <p className="text-sm text-white/60 mt-1">Welcome back. Please sign in to continue.</p>
        </div>

        <form className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label 
              htmlFor="username" 
              className="block text-sm text-white/80">
                Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-transparent border-2 border-white text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-accent`}
              placeholder="@your_username"
              dir="ltr"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm text-white/80">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-transparent border-2 border-white text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-accent"
              placeholder="Your password"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex-1 px-4 py-2 bg-white text-black rounded-lg hover:bg-black hover:text-white hover:border-white duration-500 transition-colors"
            >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </button>

          <div className="text-center text-sm text-white/70">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-white underline underline-offset-4 hover:text-white">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;