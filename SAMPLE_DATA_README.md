# Sample Data Documentation

## Overview
The application has been loaded with sample dormant account data for testing and demonstration purposes.

## Sample Accounts in Database

The database now contains **15 sample dormant accounts** across 4 different banks:

### Bank Distribution:
- **First National Bank**: 5 accounts
- **City Trust Bank**: 4 accounts  
- **Metro Bank**: 4 accounts
- **Coastal Bank**: 2 accounts

### Status Distribution:
- **PENDING**: 5 accounts (awaiting initial assessment)
- **IN_PROGRESS**: 4 accounts (actively being processed)
- **COMPLETED**: 4 accounts (successfully reclaimed)
- **FAILED**: 2 accounts (reclaim attempts unsuccessful)

### Sample Account Examples:

| Account Number | Bank | Customer Name | Balance | Status | Comments |
|---------------|------|---------------|---------|--------|----------|
| ACC001234567 | First National Bank | John Smith | $15,000.00 | PENDING | Initial assessment pending |
| ACC002345678 | First National Bank | Sarah Johnson | $8,500.50 | IN_PROGRESS | Customer contacted |
| ACC003456789 | City Trust Bank | Michael Brown | $25,000.00 | COMPLETED | Successfully reclaimed |
| ACC006789012 | Metro Bank | Jennifer Martinez | $45,000.00 | FAILED | Customer disputed claim |

## Sample Upload File

A sample upload file has been created at: **`sample-dormant-accounts-upload.txt`**

### File Format:
The file uses pipe-delimited format (|) with the following structure:
```
AccountNumber|CustomerName|BankName|Balance|CustomerEmail
```

### File Contents:
- **20 additional accounts** ready to be uploaded
- Account numbers: ACC016789012 through ACC035678901
- Distributed across all 4 banks
- Balances ranging from $4,500 to $33,000

### How to Use the Upload File:

1. **Login as Admin**:
   - Username: `admin`
   - Password: `admin123`

2. **Navigate to "Manage Accounts" tab**

3. **Use the File Upload section** (only visible to Admin users)

4. **Select the file**: `sample-dormant-accounts-upload.txt`

5. **Click Upload**

6. **Expected Result**: 
   - 20 accounts successfully added
   - Total accounts in system: 35 (15 initial + 20 uploaded)

## Testing Scenarios

### 1. Dashboard View
- Login and view the dashboard
- See total account count (15 initially)
- View bank summaries with counts and total balances

### 2. Search Functionality
- Search by account number: `ACC001234567`
- Search by customer name: `John Smith`
- Search by bank: `Metro Bank`
- Test case-insensitive search

### 3. Single Account Update
- Select one account
- Click "Update Selected"
- Change reclaim status
- Add reclaim date and comments
- Save and verify changes

### 4. Bulk Account Update
- Select multiple accounts (use checkboxes)
- Click "Update Selected"
- Apply same status/dates to all
- Verify all accounts updated

### 5. File Upload (Admin Only)
- Login as admin
- Upload `sample-dormant-accounts-upload.txt`
- Verify 20 accounts added
- Check dashboard shows 35 total accounts

### 6. CSV Export
- Navigate to "Reports" tab
- Apply filters (optional)
- Click "Export to CSV"
- Verify downloaded file contains account data

### 7. Role-Based Access
- Login as operator:
  - Username: `operator`
  - Password: `operator123`
- Verify file upload section is NOT visible
- Verify can still view and update accounts

## Database Access

The application uses H2 in-memory database. You can access the H2 console at:
- **URL**: http://localhost:8080/h2-console
- **JDBC URL**: `jdbc:h2:mem:dormant_accounts`
- **Username**: `sa`
- **Password**: (leave empty)

## API Endpoints

Test the API directly:

### Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get All Accounts (requires token):
```bash
curl -X GET http://localhost:8080/api/accounts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Bank Summaries:
```bash
curl -X GET http://localhost:8080/api/accounts/summary \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Notes

- All sample data is reset when the backend restarts (H2 in-memory database)
- The upload file can be used multiple times, but duplicate account numbers will be rejected
- Dates in the sample data use format: YYYY-MM-DD
- All monetary values are in USD

## Troubleshooting

If you don't see the sample data:
1. Check that the backend started successfully
2. Look for "✅ Dormant_accounts table exists with 15 records" in the startup logs
3. Restart the backend: Stop and start the backend process
4. Clear browser cache and refresh the frontend

Enjoy testing the Dormant Accounts Management System!
