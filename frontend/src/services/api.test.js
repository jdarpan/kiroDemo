/**
 * API Service Layer Tests
 * Tests for centralized axios instance with interceptors
 * Requirements: 9.2, 9.5
 */

import apiClient, { 
  login, 
  logout, 
  getAllAccounts, 
  getBankSummaries,
  searchAccounts,
  getAccount,
  updateAccount,
  bulkUpdateAccounts,
  getToken,
  getCurrentUser,
  isAuthenticated
} from './api';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('API Service Layer', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Axios Instance Configuration', () => {
    it('should have apiClient instance available', () => {
      expect(apiClient).toBeDefined();
      expect(apiClient.get).toBeDefined();
      expect(apiClient.post).toBeDefined();
      expect(apiClient.put).toBeDefined();
    });
  });

  describe('Authentication Methods', () => {
    it('should store token and user data on successful login', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          username: 'testuser',
          role: 'ADMIN'
        }
      };

      apiClient.post = jest.fn().mockResolvedValue(mockResponse);

      await login('testuser', 'password');

      expect(localStorage.getItem('jwt_token')).toBe('test-token');
      expect(localStorage.getItem('current_user')).toBe(
        JSON.stringify({ username: 'testuser', role: 'ADMIN' })
      );
    });

    it('should clear storage on logout', async () => {
      localStorage.setItem('jwt_token', 'test-token');
      localStorage.setItem('current_user', JSON.stringify({ username: 'testuser', role: 'ADMIN' }));

      apiClient.post = jest.fn().mockResolvedValue({});

      await logout();

      expect(localStorage.getItem('jwt_token')).toBeNull();
      expect(localStorage.getItem('current_user')).toBeNull();
    });
  });

  describe('Utility Functions', () => {
    it('should get token from localStorage', () => {
      localStorage.setItem('jwt_token', 'test-token');
      expect(getToken()).toBe('test-token');
    });

    it('should get current user from localStorage', () => {
      const user = { username: 'testuser', role: 'ADMIN' };
      localStorage.setItem('current_user', JSON.stringify(user));
      expect(getCurrentUser()).toEqual(user);
    });

    it('should check if user is authenticated', () => {
      expect(isAuthenticated()).toBe(false);
      localStorage.setItem('jwt_token', 'test-token');
      expect(isAuthenticated()).toBe(true);
    });
  });

  describe('Account API Methods', () => {
    it('should fetch all accounts', async () => {
      const mockAccounts = [{ id: 1, accountNumber: 'ACC001' }];
      apiClient.get = jest.fn().mockResolvedValue({ data: mockAccounts });

      const result = await getAllAccounts();

      expect(apiClient.get).toHaveBeenCalledWith('/accounts');
      expect(result).toEqual(mockAccounts);
    });

    it('should fetch bank summaries', async () => {
      const mockSummaries = [{ bankName: 'Test Bank', accountCount: 5 }];
      apiClient.get = jest.fn().mockResolvedValue({ data: mockSummaries });

      const result = await getBankSummaries();

      expect(apiClient.get).toHaveBeenCalledWith('/accounts/summary');
      expect(result).toEqual(mockSummaries);
    });

    it('should search accounts with query', async () => {
      const mockAccounts = [{ id: 1, accountNumber: 'ACC001' }];
      apiClient.get = jest.fn().mockResolvedValue({ data: mockAccounts });

      const result = await searchAccounts('test');

      expect(apiClient.get).toHaveBeenCalledWith('/accounts', {
        params: { search: 'test' }
      });
      expect(result).toEqual(mockAccounts);
    });

    it('should update single account', async () => {
      const mockAccount = { id: 1, reclaimStatus: 'COMPLETED' };
      apiClient.put = jest.fn().mockResolvedValue({ data: mockAccount });

      const result = await updateAccount(1, { reclaimStatus: 'COMPLETED' });

      expect(apiClient.put).toHaveBeenCalledWith('/accounts/1', { reclaimStatus: 'COMPLETED' });
      expect(result).toEqual(mockAccount);
    });

    it('should bulk update accounts', async () => {
      const mockResponse = { updatedCount: 3 };
      apiClient.put = jest.fn().mockResolvedValue({ data: mockResponse });

      const result = await bulkUpdateAccounts([1, 2, 3], { reclaimStatus: 'COMPLETED' });

      expect(apiClient.put).toHaveBeenCalledWith('/accounts/bulk', {
        accountIds: [1, 2, 3],
        reclaimStatus: 'COMPLETED'
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network Error');
      networkError.response = undefined;
      
      apiClient.get = jest.fn().mockRejectedValue(networkError);

      await expect(getAllAccounts()).rejects.toThrow('Network Error');
    });

    it('should handle API errors with messages', async () => {
      const apiError = new Error('Invalid request');
      apiError.response = {
        data: { message: 'Invalid request' },
        status: 400
      };
      
      apiClient.get = jest.fn().mockRejectedValue(apiError);

      await expect(getAllAccounts()).rejects.toThrow();
    });
  });
});
