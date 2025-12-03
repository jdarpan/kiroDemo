import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SearchBar from './components/SearchBar';
import AccountTable from './components/AccountTable';
import UpdateModal from './components/UpdateModal';
import FileUpload from './components/FileUpload';
import Reports from './components/Reports';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ToastContainer from './components/ToastContainer';
import LoadingSpinner from './components/LoadingSpinner';
import { ToastProvider, useToast } from './context/ToastContext';
import { searchAccounts, updateAccount, bulkUpdateAccounts } from './services/api';
import { initializeAuth, logout } from './services/authService';
import useAuth from './hooks/useAuth';

// Main application component with authentication
function MainApp() {
  const navigate = useNavigate();
  const toast = useToast();
  const [currentView, setCurrentView] = useState('dashboard');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Use the useAuth hook to get current user information
  // Requirements: 2.1, 2.2, 2.3
  const { user: currentUser, isAdmin } = useAuth();

  useEffect(() => {
    // Initialize authentication on mount
    initializeAuth();
  }, []);

  const loadAccounts = useCallback(async (query = '') => {
    setLoading(true);
    try {
      const data = await searchAccounts(query);
      setAccounts(data);
    } catch (error) {
      // Requirements: 9.4 - Display error messages
      toast.error('Error loading accounts: ' + error.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentView === 'accounts') {
      loadAccounts();
    }
  }, [currentView, loadAccounts]);

  const handleSearch = useCallback((query) => {
    loadAccounts(query);
  }, [loadAccounts]);

  const handleUpdate = async (updateData) => {
    try {
      if (selectedAccounts.length === 1) {
        // Single account update
        const updatedAccount = await updateAccount(selectedAccounts[0], updateData);
        setShowModal(false);
        setSelectedAccounts([]);
        await loadAccounts(); // Refresh account list
        // Requirements: 1.2, 9.4 - Display success toast
        toast.success('Account updated successfully!');
        return updatedAccount;
      } else {
        // Bulk account update
        const updatedCount = await bulkUpdateAccounts(selectedAccounts, updateData);
        setShowModal(false);
        setSelectedAccounts([]);
        await loadAccounts(); // Refresh account list
        // Requirements: 1.2, 9.4 - Display success toast
        toast.success(`${updatedCount} account(s) updated successfully!`);
        return updatedCount;
      }
    } catch (error) {
      // Extract error message from response if available
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update accounts';
      // Requirements: 9.4 - Display error toast
      toast.error('Error updating accounts: ' + errorMessage);
      throw error; // Re-throw to let modal handle it
    }
  };

  // Get the selected account object for single account updates
  const getSelectedAccount = () => {
    if (selectedAccounts.length === 1) {
      return accounts.find(acc => acc.id === selectedAccounts[0]);
    }
    return null;
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
          <button 
            className={currentView === 'reports' ? 'active' : ''}
            onClick={() => setCurrentView('reports')}
          >
            Reports
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
        ) : currentView === 'reports' ? (
          <Reports />
        ) : (
          <>
            {/* Only show FileUpload component for Admin users - Requirements: 2.1, 2.2, 2.3 */}
            {isAdmin && <FileUpload onUploadComplete={loadAccounts} />}
            
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
              <LoadingSpinner message="Loading accounts..." />
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
          selectedAccount={getSelectedAccount()}
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
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <ToastContainer />
          <Routes>
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <MainApp />
                </PrivateRoute>
              } 
            />
          </Routes>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
