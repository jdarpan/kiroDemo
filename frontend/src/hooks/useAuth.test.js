import { renderHook } from '@testing-library/react';
import useAuth from './useAuth';
import * as api from '../services/api';

// Mock the API module
jest.mock('../services/api');

describe('useAuth Hook', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  test('should return null user when not authenticated', () => {
    // Mock getCurrentUser to return null
    api.getCurrentUser.mockReturnValue(null);
    api.isAuthenticated.mockReturnValue(false);

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isOperator).toBe(false);
    expect(result.current.role).toBeUndefined();
    expect(result.current.username).toBeUndefined();
  });

  test('should return admin user when authenticated as admin', () => {
    // Mock getCurrentUser to return admin user
    const adminUser = { username: 'admin', role: 'ADMIN' };
    api.getCurrentUser.mockReturnValue(adminUser);
    api.isAuthenticated.mockReturnValue(true);

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(adminUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isOperator).toBe(false);
    expect(result.current.role).toBe('ADMIN');
    expect(result.current.username).toBe('admin');
  });

  test('should return operator user when authenticated as operator', () => {
    // Mock getCurrentUser to return operator user
    const operatorUser = { username: 'operator', role: 'OPERATOR' };
    api.getCurrentUser.mockReturnValue(operatorUser);
    api.isAuthenticated.mockReturnValue(true);

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(operatorUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isOperator).toBe(true);
    expect(result.current.role).toBe('OPERATOR');
    expect(result.current.username).toBe('operator');
  });

  test('should handle loading state', () => {
    api.getCurrentUser.mockReturnValue(null);
    api.isAuthenticated.mockReturnValue(false);

    const { result } = renderHook(() => useAuth());

    // Initially loading should be false after first render
    expect(result.current.loading).toBe(false);
  });
});
