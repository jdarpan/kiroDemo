import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { getAllAccounts, getBankSummaries } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from './LoadingSpinner';

/**
 * Dashboard component displaying dormant accounts summary
 * Requirements: 3.1, 3.2, 3.3, 3.4
 */
function Dashboard({ onNavigateToAccounts }) {
  const toast = useToast();
  const [accounts, setAccounts] = useState([]);
  const [bankSummaries, setBankSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Load dashboard data (accounts and bank summaries)
   * Requirements: 3.1, 3.4
   */
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch both accounts and bank summaries
      const [accountsData, summariesData] = await Promise.all([
        getAllAccounts(),
        getBankSummaries()
      ]);
      
      setAccounts(accountsData);
      setBankSummaries(summariesData);
    } catch (err) {
      const errorMsg = err.message || 'Failed to load dashboard data';
      setError(errorMsg);
      // Requirements: 9.4 - Display error toast
      toast.error(errorMsg);
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh dashboard data
   * Requirements: 3.4
   */
  const handleRefresh = () => {
    toast.info('Refreshing dashboard data...');
    loadDashboardData();
  };

  // Calculate total account count from accounts array
  // Requirements: 3.1
  const totalAccounts = accounts.length;

  // Calculate total balance across all banks
  // Requirements: 3.3
  const totalBalance = bankSummaries.reduce((sum, bank) => sum + bank.totalBalance, 0);

  // Loading state
  if (loading) {
    return (
      <div className="dashboard">
        <LoadingSpinner message="Loading dashboard data..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard">
        <div className="error-container">
          <div className="error-message">
            <h3>Error Loading Dashboard</h3>
            <p>{error}</p>
            <button className="btn-primary" onClick={handleRefresh}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dormant Accounts Dashboard</h2>
        <div className="dashboard-actions">
          <button className="btn-secondary" onClick={handleRefresh} title="Refresh dashboard data">
            Refresh
          </button>
          <button className="btn-primary" onClick={onNavigateToAccounts}>
            Manage Accounts
          </button>
        </div>
      </div>

      {/* Summary Cards - Requirements: 3.1, 3.2, 3.3 */}
      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Banks</h3>
          <p className="summary-value">{bankSummaries.length}</p>
        </div>
        <div className="summary-card">
          <h3>Total Accounts</h3>
          <p className="summary-value">{totalAccounts}</p>
        </div>
        <div className="summary-card">
          <h3>Total Balance</h3>
          <p className="summary-value">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Bank Summary Table - Requirements: 3.2, 3.3 */}
      <div className="bank-table-container">
        <h3>Bank Summary</h3>
        {bankSummaries.length === 0 ? (
          <div className="empty-state">
            <p>No dormant accounts found</p>
          </div>
        ) : (
          <table className="bank-table">
            <thead>
              <tr>
                <th>Bank Name</th>
                <th>Number of Accounts</th>
                <th>Total Balance</th>
              </tr>
            </thead>
            <tbody>
              {bankSummaries.map((bank, index) => (
                <tr key={index}>
                  <td>{bank.bankName}</td>
                  <td>{bank.accountCount}</td>
                  <td>${bank.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
