import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGlobalToast } from '../context/ToastContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
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

  const validateForm = () => {
    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      showError('Validation', 'Please fill in all fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      showError('Validation', 'Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      showError('Validation', 'Password must be at least 6 characters');
      return false;
    }

    if (formData.username.length < 3) {
      showError('Validation', 'Username must be at least 3 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      showSuccess('Registration', 'Account created successfully');
      navigate('/');
    } catch (error) {
      console.log('SignUp error caught:', error.message);
      showError('Registration Failed', error.message || 'Failed to create account');
      // Stay on signup page to allow retry
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-deep px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-white">Create an account</h2>
          <p className="text-sm text-white/60 mt-1">Join us and start your journey.</p>
        </div>

        <form className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-sm text-white/80">
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-transparent border-2 border-white text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-accent"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="username" className="block text-sm text-white/80">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-transparent border-2 border-white text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-accent"
              placeholder="johndoe"
              dir="ltr"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm text-white/80">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-transparent border-2 border-white text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-accent"
              placeholder="you@example.com"
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
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-transparent border-2 border-white text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-accent"
              placeholder="At least 6 characters"
              dir="ltr"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="block text-sm text-white/80">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-transparent border-2 border-white text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-accent"
              placeholder="Re-enter your password"
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
                Creating account...
              </div>
            ) : (
              'Create account'
            )}
          </button>

          <div className="text-center text-sm text-white/70">
            Already have an account?{' '}
            <Link to="/login" className="text-white underline underline-offset-4 hover:text-white">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;