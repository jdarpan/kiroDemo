import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Reports from './Reports';
import * as api from '../services/api';
import { ToastProvider } from '../context/ToastContext';

// Mock the API module
jest.mock('../services/api');

// Helper to render with ToastProvider
const renderWithToast = (component) => {
  return render(<ToastProvider>{component}</ToastProvider>);
};

describe('Reports Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders reports UI with filter form', () => {
    renderWithToast(<Reports />);
    
    // Check for main heading
    expect(screen.getByText('Export Reports')).toBeInTheDocument();
    
    // Check for filter inputs
    expect(screen.getByLabelText('Search Term')).toBeInTheDocument();
    expect(screen.getByLabelText('Bank Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Reclaim Status')).toBeInTheDocument();
    
    // Check for buttons
    expect(screen.getByText('Clear Filters')).toBeInTheDocument();
    expect(screen.getByText('Export to CSV')).toBeInTheDocument();
  });

  test('handles filter input changes', () => {
    renderWithToast(<Reports />);
    
    const searchInput = screen.getByLabelText('Search Term');
    const bankNameInput = screen.getByLabelText('Bank Name');
    const statusSelect = screen.getByLabelText('Reclaim Status');
    
    // Change filter values
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    fireEvent.change(bankNameInput, { target: { value: 'Test Bank' } });
    fireEvent.change(statusSelect, { target: { value: 'PENDING' } });
    
    // Verify values are updated
    expect(searchInput.value).toBe('test search');
    expect(bankNameInput.value).toBe('Test Bank');
    expect(statusSelect.value).toBe('PENDING');
  });

  test('clears filters when clear button is clicked', () => {
    renderWithToast(<Reports />);
    
    const searchInput = screen.getByLabelText('Search Term');
    const bankNameInput = screen.getByLabelText('Bank Name');
    const clearButton = screen.getByText('Clear Filters');
    
    // Set some filter values
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.change(bankNameInput, { target: { value: 'bank' } });
    
    // Click clear button
    fireEvent.click(clearButton);
    
    // Verify filters are cleared
    expect(searchInput.value).toBe('');
    expect(bankNameInput.value).toBe('');
  });

  test('calls exportCSV API when export button is clicked', async () => {
    api.exportCSV.mockResolvedValue({ success: true, filename: 'test.csv' });
    
    renderWithToast(<Reports />);
    
    const exportButton = screen.getByText('Export to CSV');
    
    // Click export button
    fireEvent.click(exportButton);
    
    // Verify API was called
    await waitFor(() => {
      expect(api.exportCSV).toHaveBeenCalledWith({
        search: '',
        bankName: '',
        status: ''
      });
    });
    
    // Verify success message is displayed
    await waitFor(() => {
      expect(screen.getByText('Export completed successfully!')).toBeInTheDocument();
    });
  });

  test('displays error message when export fails', async () => {
    const errorMessage = 'Export failed';
    api.exportCSV.mockRejectedValue(new Error(errorMessage));
    
    renderWithToast(<Reports />);
    
    const exportButton = screen.getByText('Export to CSV');
    
    // Click export button
    fireEvent.click(exportButton);
    
    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('disables inputs and buttons during export', async () => {
    // Mock a delayed export
    api.exportCSV.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    renderWithToast(<Reports />);
    
    const searchInput = screen.getByLabelText('Search Term');
    const exportButton = screen.getByText('Export to CSV');
    const clearButton = screen.getByText('Clear Filters');
    
    // Click export button
    fireEvent.click(exportButton);
    
    // Verify inputs and buttons are disabled
    expect(searchInput).toBeDisabled();
    expect(exportButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
    expect(exportButton).toHaveTextContent('Exporting...');
    
    // Wait for export to complete
    await waitFor(() => {
      expect(searchInput).not.toBeDisabled();
    });
  });

  test('sends filters to API when export is triggered', async () => {
    api.exportCSV.mockResolvedValue({ success: true });
    
    renderWithToast(<Reports />);
    
    // Set filter values
    fireEvent.change(screen.getByLabelText('Search Term'), { target: { value: 'account123' } });
    fireEvent.change(screen.getByLabelText('Bank Name'), { target: { value: 'Chase Bank' } });
    fireEvent.change(screen.getByLabelText('Reclaim Status'), { target: { value: 'COMPLETED' } });
    
    // Click export
    fireEvent.click(screen.getByText('Export to CSV'));
    
    // Verify API was called with correct filters
    await waitFor(() => {
      expect(api.exportCSV).toHaveBeenCalledWith({
        search: 'account123',
        bankName: 'Chase Bank',
        status: 'COMPLETED'
      });
    });
  });
});
