import React, { useState } from 'react';
import './AccountTable.css';

/**
 * AccountTable component displays dormant accounts in a sortable table
 * with row selection capabilities
 * Requirements: 3.1, 4.2, 6.1
 */
function AccountTable({ accounts, selectedAccounts, onSelectionChange }) {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  /**
   * Handle select all checkbox
   * Requirements: 6.1
   */
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectionChange(accounts.map(acc => acc.id));
    } else {
      onSelectionChange([]);
    }
  };

  /**
   * Handle single row selection
   * Requirements: 6.1
   */
  const handleSelectOne = (id) => {
    if (selectedAccounts.includes(id)) {
      onSelectionChange(selectedAccounts.filter(accId => accId !== id));
    } else {
      onSelectionChange([...selectedAccounts, id]);
    }
  };

  /**
   * Handle column sorting
   * Requirements: 4.2
   */
  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  /**
   * Sort accounts based on current sort column and direction
   * Requirements: 4.2
   */
  const getSortedAccounts = () => {
    if (!sortColumn) return accounts;

    return [...accounts].sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      // Handle null/undefined values
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      // Handle different data types
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  /**
   * Format date for display
   */
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : '-';
  };

  /**
   * Format currency for display
   */
  const formatCurrency = (amount) => {
    return amount != null ? `$${Number(amount).toFixed(2)}` : '-';
  };

  /**
   * Format reclaim status for display
   */
  const formatReclaimStatus = (status) => {
    if (!status) return '-';
    return status.replace('_', ' ');
  };

  /**
   * Get sort indicator for column header
   */
  const getSortIndicator = (column) => {
    if (sortColumn !== column) return ' ↕';
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  const sortedAccounts = getSortedAccounts();

  return (
    <div className="table-container">
      <table className="account-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedAccounts.length === accounts.length && accounts.length > 0}
                onChange={handleSelectAll}
                aria-label="Select all accounts"
              />
            </th>
            <th className="sortable" onClick={() => handleSort('accountNumber')}>
              Account Number{getSortIndicator('accountNumber')}
            </th>
            <th className="sortable" onClick={() => handleSort('customerName')}>
              Customer Name{getSortIndicator('customerName')}
            </th>
            <th className="sortable" onClick={() => handleSort('bankName')}>
              Bank Name{getSortIndicator('bankName')}
            </th>
            <th className="sortable" onClick={() => handleSort('balance')}>
              Balance{getSortIndicator('balance')}
            </th>
            <th>Customer Email</th>
            <th className="sortable" onClick={() => handleSort('reclaimStatus')}>
              Reclaim Status{getSortIndicator('reclaimStatus')}
            </th>
            <th className="sortable" onClick={() => handleSort('reclaimDate')}>
              Reclaim Date{getSortIndicator('reclaimDate')}
            </th>
            <th className="sortable" onClick={() => handleSort('clawbackDate')}>
              Clawback Date{getSortIndicator('clawbackDate')}
            </th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {sortedAccounts.length === 0 ? (
            <tr>
              <td colSpan="10" className="no-data">No accounts found</td>
            </tr>
          ) : (
            sortedAccounts.map(account => (
              <tr key={account.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedAccounts.includes(account.id)}
                    onChange={() => handleSelectOne(account.id)}
                    aria-label={`Select account ${account.accountNumber}`}
                  />
                </td>
                <td>{account.accountNumber}</td>
                <td>{account.customerName || '-'}</td>
                <td>{account.bankName || '-'}</td>
                <td>{formatCurrency(account.balance)}</td>
                <td>{account.customerEmail || '-'}</td>
                <td>
                  <span className={`status-badge ${account.reclaimStatus ? account.reclaimStatus.toLowerCase() : ''}`}>
                    {formatReclaimStatus(account.reclaimStatus)}
                  </span>
                </td>
                <td>{formatDate(account.reclaimDate)}</td>
                <td>{formatDate(account.clawbackDate)}</td>
                <td className="comments">{account.comments || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AccountTable;
