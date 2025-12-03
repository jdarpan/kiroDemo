import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SearchBar from './components/SearchBar';
import AccountTable from './components/AccountTable';
import UpdateModal from './components/UpdateModal';
import FileUpload from './components/FileUpload';
import PrivateRoute from './components/PrivateRoute';
import { searchAccounts, updateAccount, bulkUpdateAccounts } from './services/api';
import { initializeAuth, logout, getCurrentUser } from './services/authService';

// Main application component with authentication
function MainApp() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('dashboard');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Initialize authentication on mount
    initializeAuth();
    setCurrentUser(getCurrentUser());
  }, []);

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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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
          <div className="user-info">
            {currentUser && (
              <>
                <span className="username">{currentUser.username} ({currentUser.role})</span>
                <button className="btn-logout" onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>
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

// App wrapper with routing
function App() {
  const handleLoginSuccess = () => {
    // Navigation will be handled by the router
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route 
          path="/*" 
          element={
            <PrivateRoute>
              <MainApp />
            </PrivateRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
