import axios from 'axios';

const AUTH_API_URL = '/api/auth';
const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'current_user';

/**
 * Authentication service for managing user login, logout, and token storage
 */

/**
 * Authenticate user with username and password
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise<Object>} Login response with token and user info
 */
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/login`, {
      username,
      password
    });
    
    const { token, username: user, role } = response.data;
    
    // Store token and user info in localStorage
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify({ username: user, role }));
    
    // Set default authorization header for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

/**
 * Logout current user and clear stored credentials
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    const token = getToken();
    if (token) {
      // Call backend logout endpoint
      await axios.post(`${AUTH_API_URL}/logout`);
    }
  } catch (error) {
    // Continue with logout even if backend call fails
    console.error('Logout error:', error);
  } finally {
    // Clear local storage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
  }
};

/**
 * Get stored JWT token
 * @returns {string|null} JWT token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get current authenticated user
 * @returns {Object|null} User object with username and role, or null if not authenticated
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Initialize axios interceptor to add token to requests
 */
export const initializeAuth = () => {
  const token = getToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  
  // Add response interceptor to handle 401 errors
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid, clear auth data
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        delete axios.defaults.headers.common['Authorization'];
        
        // Redirect to login
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};
