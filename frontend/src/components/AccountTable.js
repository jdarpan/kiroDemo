import React from 'react';
import './AccountTable.css';

function AccountTable({ accounts, selectedAccounts, onSelectionChange }) {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectionChange(accounts.map(acc => acc.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedAccounts.includes(id)) {
      onSelectionChange(selectedAccounts.filter(accId => accId !== id));
    } else {
      onSelectionChange([...selectedAccounts, id]);
    }
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : '-';
  };

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
              />
            </th>
            <th>Account Number</th>
            <th>Holder Name</th>
            <th>Bank Name</th>
            <th>Balance</th>
            <th>Last Transaction</th>
            <th>Reclaim Flag</th>
            <th>Reclaim Date</th>
            <th>Clawback Date</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length === 0 ? (
            <tr>
              <td colSpan="10" className="no-data">No accounts found</td>
            </tr>
          ) : (
            accounts.map(account => (
              <tr key={account.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedAccounts.includes(account.id)}
                    onChange={() => handleSelectOne(account.id)}
                  />
                </td>
                <td>{account.accountNumber}</td>
                <td>{account.accountHolderName}</td>
                <td>{account.bankName || '-'}</td>
                <td>${account.balance?.toFixed(2)}</td>
                <td>{formatDate(account.lastTransactionDate)}</td>
                <td>
                  <span className={`flag ${account.reclaimFlag ? 'active' : ''}`}>
                    {account.reclaimFlag ? 'Yes' : 'No'}
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
