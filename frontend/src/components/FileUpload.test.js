import React from 'react';
import { render, screen } from '@testing-library/react';
import FileUpload from './FileUpload';
import useAuth from '../hooks/useAuth';
import { ToastProvider } from '../context/ToastContext';

// Mock the useAuth hook
jest.mock('../hooks/useAuth');

// Mock the API module
jest.mock('../services/api');

// Helper to render with ToastProvider
const renderWithToast = (component) => {
  return render(<ToastProvider>{component}</ToastProvider>);
};

describe('FileUpload Component - Role-Based Rendering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render FileUpload component for admin users', () => {
    // Mock useAuth to return admin user
    useAuth.mockReturnValue({
      user: { username: 'admin', role: 'ADMIN' },
      isAuthenticated: true,
      isAdmin: true,
      isOperator: false,
      role: 'ADMIN',
      username: 'admin',
      loading: false
    });

    renderWithToast(<FileUpload onUploadComplete={jest.fn()} />);

    // Check that the component is rendered
    expect(screen.getByText('Upload Dormant Accounts File')).toBeInTheDocument();
    expect(screen.getByText('Admin Only')).toBeInTheDocument();
  });

  test('should not render FileUpload component for operator users', () => {
    // Mock useAuth to return operator user
    useAuth.mockReturnValue({
      user: { username: 'operator', role: 'OPERATOR' },
      isAuthenticated: true,
      isAdmin: false,
      isOperator: true,
      role: 'OPERATOR',
      username: 'operator',
      loading: false
    });

    const { container } = renderWithToast(<FileUpload onUploadComplete={jest.fn()} />);

    // Check that the component is not rendered (returns null)
    expect(container.firstChild).toBeNull();
  });

  test('should not render FileUpload component for unauthenticated users', () => {
    // Mock useAuth to return no user
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isOperator: false,
      role: undefined,
      username: undefined,
      loading: false
    });

    const { container } = renderWithToast(<FileUpload onUploadComplete={jest.fn()} />);

    // Check that the component is not rendered (returns null)
    expect(container.firstChild).toBeNull();
  });
});
