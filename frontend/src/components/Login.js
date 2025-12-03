import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useToast } from '../context/ToastContext';
import './Login.css';

/**
 * Login component for user authentication
 * Handles username/password input, validation, and authentication
 */
const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Validate form fields
   * @returns {boolean} True if form is valid
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle input field changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general error message
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      // Requirements: 1.2 - Display validation errors inline
      toast.warning('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // Call login API
      const response = await login(formData.username, formData.password);
      
      // Requirements: 1.2 - Display success message
      toast.success('Login successful! Welcome back.');
      
      // Call success callback if provided
      if (onLoginSuccess) {
        onLoginSuccess(response);
      }
      
      // Redirect to dashboard on success
      navigate('/');
    } catch (error) {
      // Requirements: 1.2, 9.4 - Display error message
      const errorMsg = error.message || 'Invalid username or password';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Dormant Accounts Management</h1>
        <h2>Login</h2>
        
        {errorMessage && (
          <div className="error-banner" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              disabled={loading}
              autoComplete="username"
              autoFocus
            />
            {errors.username && (
              <span className="error-message">{errors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              disabled={loading}
              autoComplete="current-password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="btn-login"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
