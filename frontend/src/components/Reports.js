import React, { useState } from 'react';
import './Reports.css';
import { exportCSV } from '../services/api';
import { useToast } from '../context/ToastContext';

/**
 * Reports component for CSV export functionality
 * Requirements: 11.1, 11.2, 11.3, 11.5, 11.6
 */
function Reports() {
  const toast = useToast();
  const [filters, setFilters] = useState({
    search: '',
    bankName: '',
    status: ''
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Handle filter input changes
   */
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    setFilters({
      search: '',
      bankName: '',
      status: ''
    });
    setExportStatus(null);
    setError(null);
  };

  /**
   * Handle CSV export
   * Requirements: 11.2, 11.3, 11.5, 11.6
   */
  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus(null);
    setError(null);
    
    // Requirements: 9.4 - Show loading state
    toast.info('Generating CSV export...');

    try {
      // Call export API with filters
      await exportCSV(filters);
      
      // Show success message
      const successMsg = 'Export completed successfully!';
      setExportStatus(successMsg);
      // Requirements: 9.4 - Display success toast
      toast.success(successMsg);
    } catch (err) {
      // Handle errors
      const errorMessage = err.response?.data?.message || err.message || 'Failed to export CSV';
      setError(errorMessage);
      // Requirements: 9.4 - Display error toast
      toast.error('Export failed: ' + errorMessage);
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>Export Reports</h2>
        <p className="reports-description">
          Export dormant accounts data to CSV format. Apply filters to export specific data or leave filters empty to export all accounts.
        </p>
      </div>

      {/* Filter Form - Requirements: 11.1 */}
      <div className="filter-form">
        <h3>Export Filters</h3>
        
        <div className="form-group">
          <label htmlFor="search">Search Term</label>
          <input
            type="text"
            id="search"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by account number, bank name, or customer info"
            disabled={isExporting}
          />
          <small>Filter accounts by account number, bank name, or customer information</small>
        </div>

        <div className="form-group">
          <label htmlFor="bankName">Bank Name</label>
          <input
            type="text"
            id="bankName"
            name="bankName"
            value={filters.bankName}
            onChange={handleFilterChange}
            placeholder="Enter bank name"
            disabled={isExporting}
          />
          <small>Filter accounts by specific bank name</small>
        </div>

        <div className="form-group">
          <label htmlFor="status">Reclaim Status</label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            disabled={isExporting}
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
          </select>
          <small>Filter accounts by reclaim status</small>
        </div>

        <div className="form-actions">
          <button
            className="btn-secondary"
            onClick={handleClearFilters}
            disabled={isExporting}
          >
            Clear Filters
          </button>
          <button
            className="btn-primary"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export to CSV'}
          </button>
        </div>
      </div>

      {/* Export Status Display - Requirements: 11.1 */}
      {exportStatus && (
        <div className="export-status success">
          <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{exportStatus}</span>
        </div>
      )}

      {error && (
        <div className="export-status error">
          <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Export Information */}
      <div className="export-info">
        <h3>Export Information</h3>
        <ul>
          <li>The exported CSV file will include all account fields: account number, bank name, balance, customer information, reclaim status, dates, and comments.</li>
          <li>The filename will include a timestamp indicating when the export was generated.</li>
          <li>If no filters are applied, all dormant accounts will be exported.</li>
          <li>Filters can be combined to narrow down the export results.</li>
        </ul>
      </div>
    </div>
  );
}

export default Reports;
