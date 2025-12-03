import axios from 'axios';

/**
 * API Service Layer
 * Centralized axios instance with interceptors for authentication and error handling
 * Requirements: 9.2, 9.5
 */

// Token storage key
const TOKEN_KEY = 'jwt_token';

/**
 * Create axios instance with base URL configuration
 * Requirements: 9.5
 */
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 second timeout
});

/**
 * Request interceptor to attach JWT token to all requests
 * Requirements: 9.2
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem(TOKEN_KEY);
    
    // Attach token to Authorization header if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle 401 errors and network errors
 * Requirements: 9.2
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear authentication data
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('current_user');
      
      // Redirect to login page
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Handle network errors with retry logic
    // Requirements: Handle network errors with retry options
    if (!error.response && !originalRequest._retry) {
      // Network error (no response from server)
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      // Retry up to 2 times for network errors
      if (originalRequest._retryCount <= 2) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * originalRequest._retryCount));
        return apiClient(originalRequest);
      }
      
      const networkError = new Error('Network error: Unable to connect to server. Please check your connection and try again.');
      networkError.isNetworkError = true;
      networkError.canRetry = true;
      return Promise.reject(networkError);
    }
    
    // Handle other HTTP errors
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    const apiError = new Error(errorMessage);
    apiError.response = error.response;
    apiError.status = error.response?.status;
    
    return Promise.reject(apiError);
  }
);

/**
 * Authentication API methods
 */

/**
 * Login user with credentials
 * Requirements: 1.1
 */
export const login = async (username, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      username,
      password
    });
    
    const { token, username: user, role } = response.data;
    
    // Store token and user info
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem('current_user', JSON.stringify({ username: user, role }));
    
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Login failed');
  }
};

/**
 * Logout current user
 * Requirements: 1.4
 */
export const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    // Continue with logout even if backend call fails
    console.error('Logout error:', error);
  } finally {
    // Clear local storage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('current_user');
  }
};

/**
 * Account Management API methods
 */

/**
 * Get all accounts (for dashboard total count)
 * Requirements: 3.1
 */
export const getAllAccounts = async () => {
  try {
    const response = await apiClient.get('/accounts');
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch accounts');
  }
};

/**
 * Get bank summaries (for dashboard)
 * Requirements: 3.2, 3.3
 */
export const getBankSummaries = async () => {
  try {
    const response = await apiClient.get('/accounts/summary');
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch bank summaries');
  }
};

/**
 * Search accounts with optional query parameter
 * Requirements: 4.1, 4.2, 4.4
 */
export const searchAccounts = async (query = '') => {
  try {
    const response = await apiClient.get('/accounts', {
      params: query ? { search: query } : {}
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to search accounts');
  }
};

/**
 * Get single account by ID
 * Requirements: 5.1
 */
export const getAccount = async (id) => {
  try {
    const response = await apiClient.get(`/accounts/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch account');
  }
};

/**
 * Update single account
 * Requirements: 5.2, 5.3, 5.4, 5.5
 */
export const updateAccount = async (id, updateData) => {
  try {
    const response = await apiClient.put(`/accounts/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to update account');
  }
};

/**
 * Bulk update multiple accounts
 * Requirements: 6.2, 6.3, 6.4, 6.5
 */
export const bulkUpdateAccounts = async (accountIds, updateData) => {
  try {
    const response = await apiClient.put('/accounts/bulk', {
      accountIds: accountIds,
      ...updateData
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to bulk update accounts');
  }
};

/**
 * Upload dormant accounts file (Admin only)
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */
export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/accounts/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Failed to upload file');
  }
};

/**
 * Report API methods
 */

/**
 * Export accounts to CSV with optional filters
 * Requirements: 11.2, 11.3, 11.5, 11.6
 */
export const exportCSV = async (filters = {}) => {
  try {
    // Build query parameters from filters
    const params = {};
    if (filters.search && filters.search.trim()) {
      params.search = filters.search.trim();
    }
    if (filters.bankName && filters.bankName.trim()) {
      params.bankName = filters.bankName.trim();
    }
    if (filters.status && filters.status.trim()) {
      params.status = filters.status.trim();
    }

    // Make request to export endpoint
    const response = await apiClient.get('/reports/export', {
      params,
      responseType: 'blob' // Important for file download
    });

    // Extract filename from Content-Disposition header or use default
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'dormant_accounts.csv';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    // Create blob and trigger download
    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, filename };
  } catch (error) {
    throw new Error(error.message || 'Failed to export CSV');
  }
};

/**
 * Utility functions
 */

/**
 * Get current authentication token
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('current_user');
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
 */
export const isAuthenticated = () => {
  return !!getToken();
};

// Export the axios instance for advanced use cases
export default apiClient;
