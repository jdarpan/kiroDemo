# Design Document: Dormant Accounts Management System

## Overview

The Dormant Accounts Management System is a full-stack web application built with React (frontend) and Spring Boot (backend), using PostgreSQL as the relational database. The system follows a three-tier architecture with clear separation between presentation, business logic, and data access layers. The application implements JWT-based authentication with role-based access control (RBAC) to manage Admin and Operator user permissions.

The system enables operations teams to monitor dormant bank accounts through an interactive dashboard, search and filter accounts, update reclaim information (individually or in bulk), and export filtered data to CSV. Administrators have additional privileges to upload transaction files containing dormant account data.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend (Port 3000)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Login      │  │  Dashboard   │  │   Reports    │      │
│  │  Component   │  │  Component   │  │  Component   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Search     │  │ Update Modal │  │ File Upload  │      │
│  │  Component   │  │  Component   │  │  Component   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                    REST API (JSON)
                            │
┌─────────────────────────────────────────────────────────────┐
│              Spring Boot Backend (Port 8080)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Controller Layer                         │   │
│  │  - AuthController                                     │   │
│  │  - DormantAccountController                          │   │
│  │  - ReportController                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Service Layer                            │   │
│  │  - AuthService                                        │   │
│  │  - DormantAccountService                             │   │
│  │  - FileUploadService                                  │   │
│  │  - ReportService                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Repository Layer                         │   │
│  │  - UserRepository (JPA)                              │   │
│  │  - DormantAccountRepository (JPA)                    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    JDBC Connection
                            │
┌─────────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                         │
│  - users table                                               │
│  - dormant_accounts table                                    │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18.x
- Axios for HTTP requests
- React Router for navigation
- CSS3 for styling

**Backend:**
- Spring Boot 3.x
- Spring Security with JWT
- Spring Data JPA
- Maven for dependency management

**Database:**
- PostgreSQL 14+

**Authentication:**
- JWT (JSON Web Tokens)
- BCrypt password hashing

## Components and Interfaces

### Frontend Components

#### 1. Login Component
- **Purpose:** Handles user authentication
- **State:** username, password, error messages
- **Methods:**
  - `handleLogin()`: Submits credentials to backend
  - `validateForm()`: Client-side validation
- **API Calls:** POST `/api/auth/login`

#### 2. Dashboard Component
- **Purpose:** Displays summary statistics and account listings
- **State:** accounts array, bank summaries, loading state
- **Methods:**
  - `fetchDashboardData()`: Retrieves accounts and summaries
  - `refreshData()`: Reloads dashboard data
- **API Calls:** 
  - GET `/api/accounts`
  - GET `/api/accounts/summary`

#### 3. SearchBar Component
- **Purpose:** Filters accounts based on search criteria
- **State:** searchTerm, filters
- **Methods:**
  - `handleSearch()`: Triggers search operation
  - `clearSearch()`: Resets search filters
- **Props:** onSearch callback

#### 4. AccountTable Component
- **Purpose:** Displays dormant accounts in tabular format
- **State:** selectedAccounts, sortColumn, sortDirection
- **Methods:**
  - `handleSort()`: Sorts table by column
  - `handleSelect()`: Manages row selection
  - `handleBulkSelect()`: Selects multiple rows
- **Props:** accounts array, onUpdate callback

#### 5. UpdateModal Component
- **Purpose:** Form for updating account reclaim information
- **State:** formData (reclaimStatus, reclaimDate, clawbackDate, comments)
- **Methods:**
  - `handleSubmit()`: Saves updates to backend
  - `validateDates()`: Ensures clawback date is after reclaim date
- **API Calls:** 
  - PUT `/api/accounts/{id}`
  - PUT `/api/accounts/bulk`

#### 6. FileUpload Component (Admin Only)
- **Purpose:** Uploads transaction files
- **State:** selectedFile, uploadProgress, uploadResult
- **Methods:**
  - `handleFileSelect()`: Validates file selection
  - `handleUpload()`: Sends file to backend
- **API Calls:** POST `/api/accounts/upload`

#### 7. Reports Component
- **Purpose:** Exports filtered account data to CSV
- **State:** exportFilters, isExporting
- **Methods:**
  - `handleExport()`: Triggers CSV generation
  - `applyFilters()`: Sets export criteria
- **API Calls:** GET `/api/reports/export`

### Backend Components

#### 1. AuthController
- **Endpoints:**
  - `POST /api/auth/login`: Authenticates user and returns JWT
  - `POST /api/auth/logout`: Invalidates session
- **Security:** Public access for login, authenticated for logout

#### 2. DormantAccountController
- **Endpoints:**
  - `GET /api/accounts`: Returns all accounts (with optional search)
  - `GET /api/accounts/{id}`: Returns single account
  - `GET /api/accounts/summary`: Returns bank summaries
  - `PUT /api/accounts/{id}`: Updates single account
  - `PUT /api/accounts/bulk`: Updates multiple accounts
  - `POST /api/accounts/upload`: Uploads transaction file (Admin only)
- **Security:** Requires authentication, upload requires ADMIN role

#### 3. ReportController
- **Endpoints:**
  - `GET /api/reports/export`: Generates CSV export with filters
- **Security:** Requires authentication

#### 4. AuthService
- **Methods:**
  - `authenticate(username, password)`: Validates credentials
  - `generateToken(user)`: Creates JWT token
  - `validateToken(token)`: Verifies JWT validity
  - `getUserFromToken(token)`: Extracts user information

#### 5. DormantAccountService
- **Methods:**
  - `getAllAccounts()`: Retrieves all accounts
  - `searchAccounts(criteria)`: Filters accounts by search term
  - `getAccountById(id)`: Retrieves single account
  - `updateAccount(id, data)`: Updates single account
  - `bulkUpdateAccounts(ids, data)`: Updates multiple accounts
  - `getBankSummaries()`: Aggregates data by bank

#### 6. FileUploadService
- **Methods:**
  - `parseFile(file)`: Parses transaction file
  - `validateFileFormat(file)`: Checks file structure
  - `processAccounts(accountData)`: Creates or updates accounts
  - `generateUploadSummary()`: Returns processing results

#### 7. ReportService
- **Methods:**
  - `generateCSV(accounts)`: Creates CSV from account data
  - `applyFilters(criteria)`: Filters accounts for export
  - `formatCSVRow(account)`: Formats account as CSV row

### Security Components

#### JWT Authentication Filter
- Intercepts all requests
- Validates JWT token from Authorization header
- Sets security context with user details

#### Role-Based Authorization
- Method-level security annotations
- `@PreAuthorize("hasRole('ADMIN')")` for admin-only endpoints
- `@PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")` for general endpoints

## Data Models

### User Entity

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(nullable = false)
    private String password; // BCrypt hashed
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role; // ADMIN or OPERATOR
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

### DormantAccount Entity

```java
@Entity
@Table(name = "dormant_accounts")
public class DormantAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String accountNumber;
    
    @Column(nullable = false)
    private String bankName;
    
    @Column(nullable = false)
    private BigDecimal balance;
    
    private String customerName;
    
    private String customerEmail;
    
    @Enumerated(EnumType.STRING)
    private ReclaimStatus reclaimStatus; // PENDING, IN_PROGRESS, COMPLETED, FAILED
    
    private LocalDate reclaimDate;
    
    private LocalDate clawbackDate;
    
    @Column(length = 1000)
    private String comments;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

### DTOs (Data Transfer Objects)

#### LoginRequest
```java
public class LoginRequest {
    private String username;
    private String password;
}
```

#### LoginResponse
```java
public class LoginResponse {
    private String token;
    private String username;
    private String role;
    private Long expiresIn;
}
```

#### AccountUpdateRequest
```java
public class AccountUpdateRequest {
    private ReclaimStatus reclaimStatus;
    private LocalDate reclaimDate;
    private LocalDate clawbackDate;
    private String comments;
}
```

#### BulkUpdateRequest
```java
public class BulkUpdateRequest {
    private List<Long> accountIds;
    private ReclaimStatus reclaimStatus;
    private LocalDate reclaimDate;
    private LocalDate clawbackDate;
    private String comments;
}
```

#### BankSummary
```java
public class BankSummary {
    private String bankName;
    private Long accountCount;
    private BigDecimal totalBalance;
}
```

#### UploadResponse
```java
public class UploadResponse {
    private Integer totalRecords;
    private Integer successCount;
    private Integer failureCount;
    private List<String> errors;
}
```

### Database Schema

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dormant_accounts (
    id BIGSERIAL PRIMARY KEY,
    account_number VARCHAR(255) UNIQUE NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    balance DECIMAL(15, 2) NOT NULL,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    reclaim_status VARCHAR(50),
    reclaim_date DATE,
    clawback_date DATE,
    comments TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bank_name ON dormant_accounts(bank_name);
CREATE INDEX idx_reclaim_status ON dormant_accounts(reclaim_status);
CREATE INDEX idx_account_number ON dormant_accounts(account_number);
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Authentication and Authorization Properties

**Property 1: Valid credentials authenticate with correct role**
*For any* user with valid credentials, authentication should succeed and return the user's assigned role
**Validates: Requirements 1.1**

**Property 2: Invalid credentials are rejected**
*For any* invalid username or password combination, authentication should fail and return an error
**Validates: Requirements 1.2**

**Property 3: Logout invalidates tokens**
*For any* authenticated user, after logout, their token should no longer grant access to protected endpoints
**Validates: Requirements 1.4**

**Property 4: Passwords are hashed**
*For any* user password, the stored value in the database should be a hash, not plaintext
**Validates: Requirements 1.5**

**Property 5: Role validation on protected operations**
*For any* protected endpoint and any user, the system should verify the user's role before allowing access
**Validates: Requirements 2.4**

**Property 6: Role changes take effect in new sessions**
*For any* user whose role is changed, re-authenticating should grant permissions according to the new role
**Validates: Requirements 2.5**

### Dashboard and Aggregation Properties

**Property 7: Account count accuracy**
*For any* set of dormant accounts, the dashboard should display a count that equals the actual number of accounts
**Validates: Requirements 3.1**

**Property 8: Bank aggregation accuracy**
*For any* set of dormant accounts, the count and total balance displayed for each bank should match the actual accounts belonging to that bank
**Validates: Requirements 3.2, 3.3**

### Search Properties

**Property 9: Search results match criteria**
*For any* search term and any set of accounts, all returned results should contain the search term in account number, bank name, or customer information
**Validates: Requirements 4.1**

**Property 10: Search completeness**
*For any* search term, all accounts matching the criteria should be returned (no matching accounts should be omitted)
**Validates: Requirements 4.2**

**Property 11: Case-insensitive search**
*For any* search term, searching with different case variations should return the same set of accounts
**Validates: Requirements 4.4**

### Account Update Properties

**Property 12: Form displays current account data**
*For any* account selected for update, the form should display all current field values for that account
**Validates: Requirements 5.1**

**Property 13: Single account updates persist**
*For any* account and any valid update to reclaim status, reclaim date, clawback date, or comments, the changes should be saved to the database and retrievable
**Validates: Requirements 5.2, 5.3, 5.4, 5.5**

**Property 14: Bulk updates apply to all selected accounts**
*For any* set of selected accounts and any bulk update operation, all selected accounts should receive the same updates to reclaim status, dates, and comments
**Validates: Requirements 6.2, 6.3, 6.4**

**Property 15: Bulk update count accuracy**
*For any* bulk update operation, the confirmation message count should equal the number of accounts actually updated
**Validates: Requirements 6.5**

### File Upload Properties

**Property 16: File format validation**
*For any* uploaded file, the system should validate the format before processing and reject files that don't match the expected structure
**Validates: Requirements 7.1**

**Property 17: File parsing completeness**
*For any* valid transaction file, all account records in the file should be parsed and extracted
**Validates: Requirements 7.2**

**Property 18: Upsert behavior**
*For any* account data in an uploaded file, if the account number exists, the record should be updated; if it doesn't exist, a new record should be created
**Validates: Requirements 7.3, 7.6**

**Property 19: Upload summary accuracy**
*For any* file upload operation, the summary counts (total, success, failure) should match the actual processing results
**Validates: Requirements 7.4**

**Property 20: Invalid file rejection**
*For any* file that doesn't match the expected format, the upload should be rejected with a descriptive error message
**Validates: Requirements 7.5**

### Data Persistence Properties

**Property 21: Immediate persistence**
*For any* data modification operation, the changes should be committed to the database immediately and be retrievable in subsequent queries
**Validates: Requirements 8.2**

**Property 22: Transaction rollback on failure**
*For any* database operation that fails, the transaction should be rolled back and no partial changes should persist
**Validates: Requirements 8.3**

### API Properties

**Property 23: Authentication enforcement**
*For any* protected API endpoint, requests without valid authentication tokens should be rejected with 401 status
**Validates: Requirements 9.2**

**Property 24: Success response format**
*For any* successful API operation, the response should have appropriate 2xx status code and contain the expected data structure
**Validates: Requirements 9.3**

**Property 25: Error response format**
*For any* failed API operation, the response should have appropriate error status code and contain a descriptive error message
**Validates: Requirements 9.4**

**Property 26: JSON payload format**
*For any* API request or response, the payload should be valid JSON
**Validates: Requirements 9.5**

### Validation Properties

**Property 27: Date format validation**
*For any* date input, invalid date formats should be rejected with a validation error
**Validates: Requirements 10.1**

**Property 28: Date relationship validation**
*For any* clawback date that is before the reclaim date, the validation should fail and prevent the update
**Validates: Requirements 10.2**

**Property 29: Required field validation**
*For any* form submission with empty required fields, the submission should be prevented and validation errors displayed
**Validates: Requirements 10.3**

**Property 30: Numeric field validation**
*For any* numeric field input, non-numeric values should be rejected with a validation error
**Validates: Requirements 10.4**

**Property 31: Input sanitization**
*For any* user input containing potentially dangerous characters, the input should be sanitized or escaped to prevent injection attacks
**Validates: Requirements 10.5**

### Export Properties

**Property 32: Filtered export accuracy**
*For any* set of filter criteria, the exported CSV should contain only accounts matching those criteria
**Validates: Requirements 11.2**

**Property 33: CSV field completeness**
*For any* exported CSV, all account fields (account number, bank name, balance, reclaim status, reclaim date, clawback date, comments) should be included
**Validates: Requirements 11.3**

**Property 34: CSV header presence**
*For any* generated CSV file, the first row should contain headers for all account fields
**Validates: Requirements 11.4**

**Property 35: Export filename timestamp**
*For any* CSV export, the filename should include a timestamp indicating when the export was generated
**Validates: Requirements 11.6**

## Error Handling

### Frontend Error Handling

1. **Network Errors:**
   - Display user-friendly messages for connection failures
   - Implement retry logic for transient failures
   - Show loading states during API calls

2. **Validation Errors:**
   - Display inline validation messages
   - Prevent form submission until errors are resolved
   - Highlight invalid fields

3. **Authentication Errors:**
   - Redirect to login on 401 responses
   - Clear stored tokens on authentication failure
   - Display session timeout messages

4. **Authorization Errors:**
   - Display "Access Denied" messages for 403 responses
   - Hide UI elements for unauthorized actions
   - Provide clear feedback on permission requirements

### Backend Error Handling

1. **Global Exception Handler:**
   - Catch all exceptions and return consistent error responses
   - Log errors with stack traces for debugging
   - Return appropriate HTTP status codes

2. **Validation Exceptions:**
   - Return 400 Bad Request with field-level error details
   - Validate all input at controller and service layers
   - Use Bean Validation annotations

3. **Authentication/Authorization Exceptions:**
   - Return 401 for authentication failures
   - Return 403 for authorization failures
   - Include error messages in response body

4. **Database Exceptions:**
   - Wrap database errors in custom exceptions
   - Return 500 Internal Server Error for unexpected failures
   - Implement transaction rollback on errors

5. **File Upload Exceptions:**
   - Validate file size and format
   - Return 400 for invalid files with specific error messages
   - Handle parsing errors gracefully

### Error Response Format

```json
{
  "timestamp": "2024-12-03T10:30:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Clawback date cannot be before reclaim date",
  "path": "/api/accounts/123"
}
```

## Testing Strategy

The Dormant Accounts Management System will employ a comprehensive testing strategy combining unit tests and property-based tests to ensure correctness and reliability.

### Unit Testing

**Frontend Unit Tests (Jest + React Testing Library):**
- Component rendering tests
- User interaction tests (button clicks, form submissions)
- State management tests
- API call mocking and verification
- Edge cases: empty states, error states, loading states

**Backend Unit Tests (JUnit 5 + Mockito):**
- Service layer business logic tests
- Repository layer data access tests
- Controller endpoint tests with MockMvc
- DTO validation tests
- Specific examples demonstrating correct behavior
- Integration points between components

**Key Unit Test Areas:**
- User authentication with specific credentials
- Role-based access control for specific roles
- Dashboard rendering with sample data
- Search with specific search terms
- Single account update with specific values
- File upload with sample files
- CSV export with specific filters

### Property-Based Testing

**Framework:** We will use **jqwik** for Java property-based testing on the backend, and **fast-check** for JavaScript property-based testing on the frontend.

**Configuration:**
- Each property-based test MUST run a minimum of 100 iterations
- Each property-based test MUST be tagged with a comment explicitly referencing the correctness property from this design document
- Tag format: `// Feature: dormant-accounts-management, Property {number}: {property_text}`
- Each correctness property MUST be implemented by a SINGLE property-based test

**Property Test Coverage:**

The following correctness properties will be implemented as property-based tests:

1. **Authentication Properties (1-6):** Generate random users with various roles and credentials to verify authentication and authorization behavior
2. **Dashboard Properties (7-8):** Generate random sets of accounts and verify aggregation accuracy
3. **Search Properties (9-11):** Generate random search terms and account datasets to verify search correctness
4. **Update Properties (12-15):** Generate random account updates and verify persistence and bulk operations
5. **File Upload Properties (16-20):** Generate random file contents and verify parsing and upsert behavior
6. **Persistence Properties (21-22):** Generate random data modifications and verify immediate persistence and rollback
7. **API Properties (23-26):** Generate random API requests and verify response formats and authentication
8. **Validation Properties (27-31):** Generate random inputs including invalid data to verify validation rules
9. **Export Properties (32-35):** Generate random filter criteria and verify CSV export accuracy

**Property Test Implementation Guidelines:**
- Write smart generators that constrain to the valid input space
- Test core logic without mocking when possible
- Focus on universal properties that should hold across all inputs
- Combine property tests with unit tests for comprehensive coverage

### Integration Testing

- End-to-end API tests with real database (using Testcontainers for PostgreSQL)
- Frontend-backend integration tests
- Authentication flow tests
- File upload and processing workflow tests

### Test Execution

- Unit tests run on every build
- Property-based tests run on every build (minimum 100 iterations each)
- Integration tests run on pre-commit and CI/CD pipeline
- All tests must pass before merging to main branch

## Security Considerations

1. **Password Security:**
   - BCrypt hashing with salt
   - Minimum password complexity requirements
   - No password storage in logs or error messages

2. **JWT Security:**
   - Short token expiration (1 hour)
   - Secure token storage (httpOnly cookies or secure localStorage)
   - Token refresh mechanism

3. **Input Validation:**
   - Server-side validation for all inputs
   - SQL injection prevention via parameterized queries (JPA)
   - XSS prevention via input sanitization

4. **CORS Configuration:**
   - Whitelist allowed origins
   - Restrict allowed methods and headers

5. **HTTPS:**
   - Enforce HTTPS in production
   - Secure cookie flags

6. **Rate Limiting:**
   - Implement rate limiting on authentication endpoints
   - Prevent brute force attacks

## Performance Considerations

1. **Database Optimization:**
   - Index on frequently queried fields (account_number, bank_name, reclaim_status)
   - Connection pooling
   - Query optimization for aggregations

2. **Caching:**
   - Cache bank summaries with short TTL
   - Cache user roles after authentication

3. **Pagination:**
   - Implement pagination for account listings
   - Limit results per page (e.g., 50 accounts)

4. **File Upload:**
   - Stream large files instead of loading into memory
   - Async processing for large uploads
   - Progress indicators for user feedback

5. **Frontend Optimization:**
   - Lazy loading for components
   - Debounce search input
   - Memoization for expensive computations

## Deployment Architecture

**Development Environment:**
- Frontend: localhost:3000
- Backend: localhost:8080
- Database: localhost:5432

**Production Environment:**
- Frontend: Nginx serving static React build
- Backend: Spring Boot application server
- Database: PostgreSQL with replication
- Load balancer for backend scaling
- SSL/TLS termination at load balancer

## Future Enhancements

1. Audit logging for all account modifications
2. Email notifications for reclaim status changes
3. Advanced reporting with charts and graphs
4. Scheduled jobs for automatic status updates
5. Multi-factor authentication
6. API versioning for backward compatibility
