import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from '../context/ToastContext';
import ToastContainer from './ToastContainer';

// Test component that uses toast
const TestComponent = () => {
  const toast = useToast();

  return (
    <div>
      <button onClick={() => toast.success('Success message')}>Show Success</button>
      <button onClick={() => toast.error('Error message')}>Show Error</button>
      <button onClick={() => toast.warning('Warning message')}>Show Warning</button>
      <button onClick={() => toast.info('Info message')}>Show Info</button>
    </div>
  );
};

describe('Toast System', () => {
  test('displays success toast when triggered', () => {
    render(
      <ToastProvider>
        <TestComponent />
        <ToastContainer />
      </ToastProvider>
    );

    const successButton = screen.getByText('Show Success');
    fireEvent.click(successButton);

    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  test('displays error toast when triggered', () => {
    render(
      <ToastProvider>
        <TestComponent />
        <ToastContainer />
      </ToastProvider>
    );

    const errorButton = screen.getByText('Show Error');
    fireEvent.click(errorButton);

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  test('displays warning toast when triggered', () => {
    render(
      <ToastProvider>
        <TestComponent />
        <ToastContainer />
      </ToastProvider>
    );

    const warningButton = screen.getByText('Show Warning');
    fireEvent.click(warningButton);

    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  test('displays info toast when triggered', () => {
    render(
      <ToastProvider>
        <TestComponent />
        <ToastContainer />
      </ToastProvider>
    );

    const infoButton = screen.getByText('Show Info');
    fireEvent.click(infoButton);

    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  test('removes toast when close button is clicked', () => {
    render(
      <ToastProvider>
        <TestComponent />
        <ToastContainer />
      </ToastProvider>
    );

    const successButton = screen.getByText('Show Success');
    fireEvent.click(successButton);

    const toast = screen.getByText('Success message');
    expect(toast).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Close notification');
    fireEvent.click(closeButton);

    // Toast should be removed after animation
    setTimeout(() => {
      expect(screen.queryByText('Success message')).not.toBeInTheDocument();
    }, 400);
  });
});
