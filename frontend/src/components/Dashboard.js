import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { getDashboard } from '../services/api';

function Dashboard({ onNavigateToAccounts }) {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await getDashboard();
      setSummary(data);
    } catch (error) {
      alert('Error loading dashboard: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const totalAccounts = summary.reduce((sum, bank) => sum + bank.accountCount, 0);
  const totalBalance = summary.reduce((sum, bank) => sum + bank.totalBalance, 0);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dormant Accounts Dashboard</h2>
        <button className="btn-primary" onClick={onNavigateToAccounts}>
          Manage Accounts
        </button>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Banks</h3>
          <p className="summary-value">{summary.length}</p>
        </div>
        <div className="summary-card">
          <h3>Total Accounts</h3>
          <p className="summary-value">{totalAccounts}</p>
        </div>
        <div className="summary-card">
          <h3>Total Balance</h3>
          <p className="summary-value">${totalBalance.toFixed(2)}</p>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="bank-table-container">
          <h3>Bank Summary</h3>
          <table className="bank-table">
            <thead>
              <tr>
                <th>Bank Name</th>
                <th>Number of Accounts</th>
                <th>Total Balance</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((bank, index) => (
                <tr key={index}>
                  <td>{bank.bankName}</td>
                  <td>{bank.accountCount}</td>
                  <td>${bank.totalBalance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
