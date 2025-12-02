import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import SearchBar from './components/SearchBar';
import AccountTable from './components/AccountTable';
import UpdateModal from './components/UpdateModal';
import FileUpload from './components/FileUpload';
import { searchAccounts, updateAccount, bulkUpdateAccounts } from './services/api';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentView === 'accounts') {
      loadAccounts();
    }
  }, [currentView]);

  const loadAccounts = async (query = '') => {
    setLoading(true);
    try {
      const data = await searchAccounts(query);
      setAccounts(data);
    } catch (error) {
      alert('Error loading accounts: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    loadAccounts(query);
  };

  const handleUpdate = async (updateData) => {
    try {
      if (selectedAccounts.length === 1) {
        await updateAccount(selectedAccounts[0], updateData);
      } else {
        await bulkUpdateAccounts(selectedAccounts, updateData);
      }
      setShowModal(false);
      setSelectedAccounts([]);
      loadAccounts();
      alert('Update successful!');
    } catch (error) {
      alert('Error updating accounts: ' + error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dormant Accounts Management</h1>
        <nav className="nav-tabs">
          <button 
            className={currentView === 'dashboard' ? 'active' : ''}
            onClick={() => setCurrentView('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={currentView === 'accounts' ? 'active' : ''}
            onClick={() => setCurrentView('accounts')}
          >
            Manage Accounts
          </button>
        </nav>
      </header>
      
      <main className="App-main">
        {currentView === 'dashboard' ? (
          <Dashboard onNavigateToAccounts={() => setCurrentView('accounts')} />
        ) : (
          <>
            <FileUpload onUploadComplete={loadAccounts} />
            
            <SearchBar onSearch={handleSearch} />
            
            <div className="actions">
              <button 
                className="btn-primary"
                disabled={selectedAccounts.length === 0}
                onClick={() => setShowModal(true)}
              >
                Update Selected ({selectedAccounts.length})
              </button>
            </div>

            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <AccountTable 
                accounts={accounts}
                selectedAccounts={selectedAccounts}
                onSelectionChange={setSelectedAccounts}
              />
            )}
          </>
        )}
      </main>

      {showModal && (
        <UpdateModal 
          onClose={() => setShowModal(false)}
          onSubmit={handleUpdate}
          accountCount={selectedAccounts.length}
        />
      )}
    </div>
  );
}

export default App;
