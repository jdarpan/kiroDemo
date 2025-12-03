# API Service Layer

This directory contains the centralized API service layer for the Dormant Accounts Management System frontend.

## Overview

The API service layer provides a unified interface for all HTTP requests to the backend API. It implements:

- **Centralized axios instance** with base URL configuration
- **Request interceptor** to automatically attach JWT tokens
- **Response interceptor** to handle 401 errors and network failures
- **Consistent error handling** across all API calls
- **Type-safe API methods** for all backend endpoints

## Requirements

This implementation satisfies the following requirements:
- **9.2**: Authentication enforcement on all API requests
- **9.5**: JSON format for all API request and response payloads

## Files

### api.js

The main API service file that exports:

#### Configuration
- `apiClient`: Configured axios instance with interceptors

#### Authentication Methods
- `login(username, password)`: Authenticate user and store token
- `logout()`: Clear authentication and redirect to login

#### Account Management Methods
- `getAllAccounts()`: Fetch all dormant accounts
- `getBankSummaries()`: Fetch bank summary statistics
- `searchAccounts(query)`: Search accounts with optional query
- `getAccount(id)`: Fetch single account by ID
- `updateAccount(id, updateData)`: Update single account
- `bulkUpdateAccounts(accountIds, updateData)`: Update multiple accounts
- `uploadFile(file)`: Upload dormant accounts file (Admin only)

#### Report Methods
- `exportCSV(filters)`: Export accounts to CSV with optional filters

#### Utility Methods
- `getToken()`: Get stored JWT token
- `getCurrentUser()`: Get current authenticated user
- `isAuthenticated()`: Check if user is authenticated

### authService.js

Backward-compatible authentication service that delegates to the centralized API service.

### api.test.js

Comprehensive test suite for the API service layer.

## Usage Examples

### Authentication

```javascript
import { login, logout, isAuthenticated } from './services/api';

// Login
try {
  const response = await login('username', 'password');
  console.log('Logged in as:', response.username);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Check authentication
if (isAuthenticated()) {
  console.log('User is authenticated');
}

// Logout
await logout();
```

### Fetching Data

```javascript
import { getAllAccounts, getBankSummaries, searchAccounts } from './services/api';

// Get all accounts
const accounts = await getAllAccounts();

// Get bank summaries
const summaries = await getBankSummaries();

// Search accounts
const results = await searchAccounts('Chase Bank');
```

### Updating Accounts

```javascript
import { updateAccount, bulkUpdateAccounts } from './services/api';

// Update single account
const updated = await updateAccount(123, {
  reclaimStatus: 'COMPLETED',
  reclaimDate: '2024-01-15',
  clawbackDate: '2024-02-15',
  comments: 'Reclaim completed successfully'
});

// Bulk update
const count = await bulkUpdateAccounts([1, 2, 3], {
  reclaimStatus: 'IN_PROGRESS'
});
```

### File Upload

```javascript
import { uploadFile } from './services/api';

const file = document.getElementById('fileInput').files[0];
const result = await uploadFile(file);
console.log(`Uploaded ${result.successCount} accounts`);
```

### CSV Export

```javascript
import { exportCSV } from './services/api';

// Export with filters
await exportCSV({
  search: 'Chase',
  bankName: 'Chase Bank',
  status: 'PENDING'
});

// Export all accounts
await exportCSV();
```

## Interceptors

### Request Interceptor

Automatically attaches the JWT token to all requests:

```javascript
Authorization: Bearer <token>
```

### Response Interceptor

Handles common error scenarios:

1. **401 Unauthorized**: Clears authentication and redirects to login
2. **Network Errors**: Provides user-friendly error messages
3. **API Errors**: Extracts error messages from response

## Error Handling

All API methods throw errors with descriptive messages:

```javascript
try {
  const accounts = await getAllAccounts();
} catch (error) {
  if (error.isNetworkError) {
    console.error('Network error:', error.message);
  } else if (error.status === 403) {
    console.error('Access denied:', error.message);
  } else {
    console.error('API error:', error.message);
  }
}
```

## Testing

Run tests with:

```bash
npm test -- api.test.js
```

The test suite covers:
- Axios instance configuration
- Authentication methods
- Utility functions
- Account API methods
- Error handling scenarios

## Migration Notes

The API service layer consolidates functionality previously spread across multiple files:

- **Before**: Direct axios calls in components with manual token management
- **After**: Centralized API service with automatic token injection and error handling

Components should import from `./services/api` instead of using axios directly.
