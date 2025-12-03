import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

/**
 * PrivateRoute component to protect routes that require authentication
 * Redirects to login page if user is not authenticated
 * 
 * @param {Object} props - Component props
 * @param {React.Component} props.children - Child components to render if authenticated
 * @returns {React.Component} Protected route or redirect to login
 */
const PrivateRoute = ({ children }) => {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
};

export default PrivateRoute;
