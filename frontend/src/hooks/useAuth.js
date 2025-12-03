import { useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated } from '../services/api';

/**
 * Custom hook for accessing authentication state and user information
 * Provides current user, role, and authentication status
 * Requirements: 2.1, 2.2, 2.3
 */
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user on mount
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // Listen for storage changes (e.g., login/logout in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'current_user' || e.key === 'jwt_token') {
        const updatedUser = getCurrentUser();
        setUser(updatedUser);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    user,
    isAuthenticated: isAuthenticated(),
    isAdmin: user?.role === 'ADMIN',
    isOperator: user?.role === 'OPERATOR',
    role: user?.role,
    username: user?.username,
    loading
  };
};

export default useAuth;
