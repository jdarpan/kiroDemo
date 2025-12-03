/**
 * Authentication service for managing user login, logout, and token storage
 * This service now delegates to the centralized API service layer
 * Requirements: 1.1, 1.4, 9.2
 */

import { login as apiLogin, logout as apiLogout, getToken, getCurrentUser, isAuthenticated } from './api';

/**
 * Authenticate user with username and password
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise<Object>} Login response with token and user info
 * Requirements: 1.1
 */
export const login = async (username, password) => {
  return apiLogin(username, password);
};

/**
 * Logout current user and clear stored credentials
 * @returns {Promise<void>}
 * Requirements: 1.4
 */
export const logout = async () => {
  return apiLogout();
};

/**
 * Get stored JWT token
 * @returns {string|null} JWT token or null if not found
 */
export { getToken };

/**
 * Get current authenticated user
 * @returns {Object|null} User object with username and role, or null if not authenticated
 */
export { getCurrentUser };

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export { isAuthenticated };

/**
 * Initialize authentication
 * Note: With the centralized API service, interceptors are automatically configured
 * This function is kept for backward compatibility but is now a no-op
 */
export const initializeAuth = () => {
  // Interceptors are now configured in the centralized API service
  // This function is kept for backward compatibility
};
