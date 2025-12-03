import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  let mockOnSearch;

  beforeEach(() => {
    mockOnSearch = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders search input and button', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search by account number/i);
    const searchButton = screen.getByRole('button', { name: /search/i });
    
    expect(searchInput).toBeInTheDocument();
    expect(searchButton).toBeInTheDocument();
  });

  test('updates input value when user types', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search by account number/i);
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    
    expect(searchInput.value).toBe('test query');
  });

  test('debounces search calls', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search by account number/i);
    
    // Type multiple characters quickly
    fireEvent.change(searchInput, { target: { value: 't' } });
    fireEvent.change(searchInput, { target: { value: 'te' } });
    fireEvent.change(searchInput, { target: { value: 'tes' } });
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Should not call onSearch immediately
    expect(mockOnSearch).not.toHaveBeenCalled();
    
    // Fast-forward time by 300ms
    jest.advanceTimersByTime(300);
    
    // Should call onSearch once after debounce
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('test');
  });

  test('triggers immediate search on form submit', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search by account number/i);
    const form = searchInput.closest('form');
    
    fireEvent.change(searchInput, { target: { value: 'immediate search' } });
    fireEvent.submit(form);
    
    // Should call onSearch immediately without waiting for debounce
    expect(mockOnSearch).toHaveBeenCalledWith('immediate search');
  });

  test('shows clear button when input has value', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search by account number/i);
    
    // Clear button should not be visible initially
    expect(screen.queryByLabelText(/clear search/i)).not.toBeInTheDocument();
    
    // Type something
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Clear button should now be visible
    expect(screen.getByLabelText(/clear search/i)).toBeInTheDocument();
  });

  test('clears search when clear button is clicked', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search by account number/i);
    
    // Type something
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    
    // Click clear button
    const clearButton = screen.getByLabelText(/clear search/i);
    fireEvent.click(clearButton);
    
    // Input should be cleared
    expect(searchInput.value).toBe('');
    
    // Should call onSearch with empty string
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  test('hides clear button after clearing', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const searchInput = screen.getByPlaceholderText(/search by account number/i);
    
    // Type something
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Clear button should be visible
    const clearButton = screen.getByLabelText(/clear search/i);
    expect(clearButton).toBeInTheDocument();
    
    // Click clear
    fireEvent.click(clearButton);
    
    // Clear button should be hidden
    expect(screen.queryByLabelText(/clear search/i)).not.toBeInTheDocument();
  });
});
