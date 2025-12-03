# Implementation Plan

- [x] 1. Set up backend project structure and dependencies
  - Create Spring Boot project with Maven
  - Add dependencies: Spring Web, Spring Security, Spring Data JPA, PostgreSQL driver, JWT library, jqwik for property testing
  - Configure application.yml with database connection and JWT settings
  - Set up package structure: controller, service, repository, model, dto, config, security
  - _Requirements: 8.1, 9.1_

- [x] 2. Set up database schema and initial data
  - Create PostgreSQL database
  - Define users table schema with id, username, password, role, active, timestamps
  - Define dormant_accounts table schema with all required fields
  - Create indexes on account_number, bank_name, and reclaim_status
  - Add initial admin and operator users with hashed passwords
  - _Requirements: 8.1, 8.4, 8.5_

- [x] 3. Implement user authentication and JWT security
  - [x] 3.1 Create User entity and UserRepository
    - Define User entity with JPA annotations
    - Create UserRepository interface extending JpaRepository
    - _Requirements: 1.1, 1.5_
  
  - [x] 3.2 Implement JWT token generation and validation
    - Create JwtUtil class for token operations
    - Implement generateToken() method
    - Implement validateToken() and getUserFromToken() methods
    - _Requirements: 1.1, 1.4_
  
  - [x] 3.3 Create authentication service and controller
    - Implement AuthService with authenticate() method
    - Create LoginRequest and LoginResponse DTOs
    - Implement AuthController with /login and /logout endpoints
    - Use BCrypt for password hashing
    - _Requirements: 1.1, 1.2, 1.4, 1.5_
  
  - [ ]* 3.4 Write property test for authentication
    - **Property 1: Valid credentials authenticate with correct role**
    - **Validates: Requirements 1.1**
  
  - [ ]* 3.5 Write property test for invalid credentials rejection
    - **Property 2: Invalid credentials are rejected**
    - **Validates: Requirements 1.2**
  
  - [ ]* 3.6 Write property test for logout token invalidation
    - **Property 3: Logout invalidates tokens**
    - **Validates: Requirements 1.4**
  
  - [ ]* 3.7 Write property test for password hashing
    - **Property 4: Passwords are hashed**
    - **Validates: Requirements 1.5**

- [x] 4. Implement role-based access control
  - [x] 4.1 Create JWT authentication filter
    - Implement filter to intercept requests and validate JWT
    - Extract user details and set security context
    - _Requirements: 2.4, 9.2_
  
  - [x] 4.2 Configure Spring Security with role-based authorization
    - Create SecurityConfig class
    - Define role hierarchy (ADMIN, OPERATOR)
    - Configure endpoint security rules
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [ ]* 4.3 Write unit tests for role-based access
    - Test admin access to all endpoints
    - Test operator access restrictions
    - Test unauthorized access rejection
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [ ]* 4.4 Write property test for role validation
    - **Property 5: Role validation on protected operations**
    - **Validates: Requirements 2.4**
  
  - [ ]* 4.5 Write property test for role changes
    - **Property 6: Role changes take effect in new sessions**
    - **Validates: Requirements 2.5**

- [x] 5. Implement dormant account data model and repository
  - [x] 5.1 Create DormantAccount entity
    - Define entity with all fields (accountNumber, bankName, balance, etc.)
    - Add JPA annotations and validation constraints
    - Define ReclaimStatus enum
    - _Requirements: 3.1, 5.2, 5.3, 5.4, 5.5_
  
  - [x] 5.2 Create DormantAccountRepository
    - Extend JpaRepository
    - Add custom query methods for search and aggregation
    - Implement findByBankName, searchAccounts methods
    - _Requirements: 3.2, 3.3, 4.1, 4.2_
  
  - [ ]* 5.3 Write unit tests for repository operations
    - Test CRUD operations
    - Test custom query methods
    - _Requirements: 3.1, 4.1_

- [x] 6. Implement account management service
  - [x] 6.1 Create DormantAccountService
    - Implement getAllAccounts() method
    - Implement getAccountById() method
    - Implement searchAccounts() with case-insensitive filtering
    - Implement getBankSummaries() with aggregation logic
    - _Requirements: 3.1, 3.2, 3.3, 4.1, 4.2, 4.4_
  
  - [x] 6.2 Implement single account update functionality
    - Create updateAccount() method
    - Validate date relationships (clawback after reclaim)
    - Implement immediate persistence
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 8.2, 10.2_
  
  - [x] 6.3 Implement bulk account update functionality
    - Create bulkUpdateAccounts() method
    - Apply updates to all selected accounts
    - Return count of updated accounts
    - _Requirements: 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 6.4 Write property test for account count accuracy
    - **Property 7: Account count accuracy**
    - **Validates: Requirements 3.1**
  
  - [ ]* 6.5 Write property test for bank aggregation
    - **Property 8: Bank aggregation accuracy**
    - **Validates: Requirements 3.2, 3.3**
  
  - [ ]* 6.6 Write property test for search results matching
    - **Property 9: Search results match criteria**
    - **Validates: Requirements 4.1**
  
  - [ ]* 6.7 Write property test for search completeness
    - **Property 10: Search completeness**
    - **Validates: Requirements 4.2**
  
  - [ ]* 6.8 Write property test for case-insensitive search
    - **Property 11: Case-insensitive search**
    - **Validates: Requirements 4.4**
  
  - [ ]* 6.9 Write property test for single account updates
    - **Property 13: Single account updates persist**
    - **Validates: Requirements 5.2, 5.3, 5.4, 5.5**
  
  - [ ]* 6.10 Write property test for bulk updates
    - **Property 14: Bulk updates apply to all selected accounts**
    - **Validates: Requirements 6.2, 6.3, 6.4**
  
  - [ ]* 6.11 Write property test for bulk update count
    - **Property 15: Bulk update count accuracy**
    - **Validates: Requirements 6.5**

- [ ] 7. Implement file upload service
  - [ ] 7.1 Create FileUploadService
    - Implement validateFileFormat() method
    - Implement parseFile() method to extract account data
    - Handle various file format errors
    - _Requirements: 7.1, 7.2, 7.5_
  
  - [ ] 7.2 Implement upsert logic for uploaded accounts
    - Create processAccounts() method
    - Check if account exists by account number
    - Update existing or create new accounts
    - Generate upload summary with counts
    - _Requirements: 7.3, 7.4, 7.6_
  
  - [ ]* 7.3 Write property test for file format validation
    - **Property 16: File format validation**
    - **Validates: Requirements 7.1**
  
  - [ ]* 7.4 Write property test for file parsing completeness
    - **Property 17: File parsing completeness**
    - **Validates: Requirements 7.2**
  
  - [ ]* 7.5 Write property test for upsert behavior
    - **Property 18: Upsert behavior**
    - **Validates: Requirements 7.3, 7.6**
  
  - [ ]* 7.6 Write property test for upload summary accuracy
    - **Property 19: Upload summary accuracy**
    - **Validates: Requirements 7.4**
  
  - [ ]* 7.7 Write property test for invalid file rejection
    - **Property 20: Invalid file rejection**
    - **Validates: Requirements 7.5**

- [x] 8. Implement REST API controllers
  - [x] 8.1 Create DormantAccountController
    - Implement GET /api/accounts (with optional search parameter)
    - Implement GET /api/accounts/{id}
    - Implement GET /api/accounts/summary
    - Implement PUT /api/accounts/{id}
    - Implement PUT /api/accounts/bulk
    - Implement POST /api/accounts/upload (Admin only)
    - Add proper HTTP status codes and error handling
    - _Requirements: 9.1, 9.3, 9.4_
  
  - [x] 8.2 Create DTOs for API requests and responses
    - Create AccountUpdateRequest DTO
    - Create BulkUpdateRequest DTO
    - Create BankSummary DTO
    - Create UploadResponse DTO
    - Add validation annotations
    - _Requirements: 9.5, 10.3_
  
  - [ ]* 8.3 Write property test for authentication enforcement
    - **Property 23: Authentication enforcement**
    - **Validates: Requirements 9.2**
  
  - [ ]* 8.4 Write property test for success response format
    - **Property 24: Success response format**
    - **Validates: Requirements 9.3**
  
  - [ ]* 8.5 Write property test for error response format
    - **Property 25: Error response format**
    - **Validates: Requirements 9.4**
  
  - [ ]* 8.6 Write property test for JSON payload format
    - **Property 26: JSON payload format**
    - **Validates: Requirements 9.5**

- [x] 9. Implement input validation
  - [x] 9.1 Add validation annotations to DTOs
    - Add @NotNull, @NotEmpty for required fields
    - Add @Pattern for date formats
    - Add custom validator for date relationships
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [x] 9.2 Create custom validators
    - Implement ClawbackDateValidator to check date relationship
    - Implement input sanitization utility
    - _Requirements: 10.2, 10.5_
  
  - [ ]* 9.3 Write property test for date format validation
    - **Property 27: Date format validation**
    - **Validates: Requirements 10.1**
  
  - [ ]* 9.4 Write property test for date relationship validation
    - **Property 28: Date relationship validation**
    - **Validates: Requirements 10.2**
  
  - [ ]* 9.5 Write property test for required field validation
    - **Property 29: Required field validation**
    - **Validates: Requirements 10.3**
  
  - [ ]* 9.6 Write property test for numeric field validation
    - **Property 30: Numeric field validation**
    - **Validates: Requirements 10.4**
  
  - [ ]* 9.7 Write property test for input sanitization
    - **Property 31: Input sanitization**
    - **Validates: Requirements 10.5**

- [x] 10. Implement CSV export functionality
  - [x] 10.1 Create ReportService
    - Implement generateCSV() method
    - Implement applyFilters() method
    - Implement formatCSVRow() method
    - Add CSV headers for all account fields
    - _Requirements: 11.2, 11.3, 11.4_
  
  - [x] 10.2 Create ReportController
    - Implement GET /api/reports/export endpoint
    - Accept filter parameters
    - Return CSV file with timestamped filename
    - Set appropriate content-type headers
    - _Requirements: 11.2, 11.5, 11.6_
  
  - [ ]* 10.3 Write property test for filtered export accuracy
    - **Property 32: Filtered export accuracy**
    - **Validates: Requirements 11.2**
  
  - [ ]* 10.4 Write property test for CSV field completeness
    - **Property 33: CSV field completeness**
    - **Validates: Requirements 11.3**
  
  - [ ]* 10.5 Write property test for CSV header presence
    - **Property 34: CSV header presence**
    - **Validates: Requirements 11.4**
  
  - [ ]* 10.6 Write property test for export filename timestamp
    - **Property 35: Export filename timestamp**
    - **Validates: Requirements 11.6**

- [x] 11. Implement global exception handling
  - Create @ControllerAdvice class
  - Handle validation exceptions (400)
  - Handle authentication exceptions (401)
  - Handle authorization exceptions (403)
  - Handle not found exceptions (404)
  - Handle database exceptions (500)
  - Return consistent error response format
  - _Requirements: 9.4_

- [ ]* 12. Write property test for transaction rollback
  - **Property 22: Transaction rollback on failure**
  - **Validates: Requirements 8.3**

- [x] 13. Configure CORS and security settings
  - Configure CORS to allow frontend origin
  - Set up security headers
  - Configure JWT secret and expiration
  - _Requirements: 1.3_

- [x] 14. Checkpoint - Ensure all backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 15. Set up frontend React project
  - Create React app with create-react-app
  - Install dependencies: axios, react-router-dom, fast-check for property testing
  - Set up project structure: components, services, styles
  - Configure proxy for backend API calls
  - _Requirements: 9.1_

- [x] 16. Implement authentication UI
  - [x] 16.1 Create Login component
    - Build login form with username and password fields
    - Implement form validation
    - Handle login API call
    - Store JWT token in localStorage
    - Redirect to dashboard on success
    - Display error messages
    - _Requirements: 1.1, 1.2_
  
  - [ ] 16.2 Create authentication service
    - Implement login() function
    - Implement logout() function
    - Implement token storage and retrieval
    - Implement getCurrentUser() function
    - _Requirements: 1.1, 1.4_
  
  - [x] 16.3 Implement protected route wrapper
    - Create PrivateRoute component
    - Check authentication status
    - Redirect to login if not authenticated
    - _Requirements: 1.3_
  
  - [ ]* 16.4 Write unit tests for Login component
    - Test form submission
    - Test error display
    - Test successful login redirect
    - _Requirements: 1.1, 1.2_

- [x] 17. Implement Dashboard component
  - [x] 17.1 Create Dashboard layout
    - Build dashboard structure with summary cards
    - Display total account count
    - Display bank summaries with counts and balances
    - Add loading and error states
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 17.2 Implement data fetching
    - Create API service methods for accounts and summaries
    - Fetch data on component mount
    - Implement refresh functionality
    - _Requirements: 3.1, 3.4_
  
  - [ ]* 17.3 Write property test for dashboard data display
    - **Property 12: Form displays current account data**
    - **Validates: Requirements 5.1**

- [x] 18. Implement SearchBar component
  - Create search input field
  - Implement onChange handler with debouncing
  - Implement clear search functionality
  - Pass search term to parent component
  - _Requirements: 4.1, 4.3_

- [x] 19. Implement AccountTable component
  - [x] 19.1 Create table structure
    - Build table with columns for all account fields
    - Implement row selection with checkboxes
    - Add sort functionality for columns
    - Display account data from props
    - _Requirements: 3.1, 4.2_
  
  - [x] 19.2 Implement selection logic
    - Handle single row selection
    - Handle bulk selection (select all)
    - Track selected account IDs in state
    - _Requirements: 6.1_
  
  - [ ]* 19.3 Write unit tests for AccountTable
    - Test rendering with data
    - Test selection functionality
    - Test sorting
    - _Requirements: 3.1, 6.1_

- [x] 20. Implement UpdateModal component
  - [x] 20.1 Create modal form
    - Build form with fields for reclaim status, dates, and comments
    - Implement form validation
    - Display current account values
    - Add save and cancel buttons
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [x] 20.2 Implement update logic
    - Handle single account update
    - Handle bulk account update
    - Validate date relationships
    - Call appropriate API endpoints
    - Display success/error messages
    - Refresh account list after update
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 20.3 Write unit tests for UpdateModal
    - Test form rendering
    - Test validation
    - Test update submission
    - _Requirements: 5.2, 10.2_

- [x] 21. Implement FileUpload component (Admin only)
  - [x] 21.1 Create file upload UI
    - Build file input with drag-and-drop
    - Display selected filename
    - Add upload button
    - Show upload progress
    - Display upload results
    - _Requirements: 7.1, 7.4_
  
  - [x] 21.2 Implement upload logic
    - Validate file selection
    - Call upload API endpoint
    - Handle upload response
    - Display success summary or errors
    - Refresh dashboard after successful upload
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ]* 21.3 Write unit tests for FileUpload
    - Test file selection
    - Test upload submission
    - Test error handling
    - _Requirements: 7.1, 7.5_

- [x] 22. Implement Reports component
  - [x] 22.1 Create reports UI
    - Build filter form for export criteria
    - Add export button
    - Display export status
    - _Requirements: 11.1_
  
  - [x] 22.2 Implement CSV export logic
    - Apply filters from form
    - Call export API endpoint
    - Trigger file download
    - Handle errors
    - _Requirements: 11.2, 11.3, 11.5, 11.6_
  
  - [ ]* 22.3 Write unit tests for Reports component
    - Test filter application
    - Test export trigger
    - _Requirements: 11.2_

- [x] 23. Implement API service layer
  - Create axios instance with base URL and interceptors
  - Add request interceptor to attach JWT token
  - Add response interceptor to handle 401 errors
  - Implement all API methods (login, getAccounts, updateAccount, etc.)
  - Handle network errors gracefully
  - _Requirements: 9.2, 9.5_

- [x] 24. Implement role-based UI rendering
  - Create useAuth hook to get current user role
  - Conditionally render FileUpload component for Admin only
  - Hide/show UI elements based on role
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 25. Add styling and responsive design
  - Style all components with CSS
  - Ensure responsive layout for mobile and desktop
  - Add loading spinners and animations
  - Implement consistent color scheme and typography
  - _Requirements: 3.1_

- [x] 26. Implement error handling and user feedback
  - Display toast notifications for success/error messages
  - Show loading states during API calls
  - Handle network errors with retry options
  - Display validation errors inline
  - _Requirements: 1.2, 7.5, 9.4_

- [x] 27. Checkpoint - Ensure all frontend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 28. Write integration tests
  - Test complete authentication flow
  - Test account search and update flow
  - Test file upload flow
  - Test CSV export flow
  - Use Testcontainers for PostgreSQL
  - _Requirements: 1.1, 4.1, 5.2, 7.3, 11.2_

- [x] 29. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
