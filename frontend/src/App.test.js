import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Mock window.alert
global.alert = jest.fn();

test('renders login page by default', () => {
  render(<App />);
  const loginHeader = screen.getByRole('heading', { name: /Login/i, level: 2 });
  expect(loginHeader).toBeInTheDocument();
});

test('renders login form with username and password fields', () => {
  render(<App />);
  const usernameInput = screen.getByLabelText(/Username/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const loginButton = screen.getByRole('button', { name: /Login/i });
  
  expect(usernameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
});
