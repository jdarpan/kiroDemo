# Requirements Document

## Introduction

The Dormant Accounts Management System is a web-based application that enables banking operations teams to monitor, search, and manage dormant bank accounts across multiple banks. The system provides role-based access control with Admin and Operator roles, allowing administrators to upload dormant account data files while both roles can view dashboards and update account reclaim information.

## Glossary

- **System**: The Dormant Accounts Management System
- **User**: An authenticated person using the system (Admin or Operator)
- **Admin**: A user role with full system access including file upload capabilities
- **Operator**: A user role with dashboard viewing and account update capabilities
- **Dormant Account**: A bank account that has been inactive for a specified period
- **Reclaim Status**: The current state of the account reclaim process
- **Reclaim Date**: The date when the account reclaim process was initiated
- **Clawback Date**: The date when funds were or will be recovered from the dormant account
- **Dashboard**: The main interface displaying summary statistics and account listings
- **Transaction File**: A text file containing dormant account data for bulk upload

## Requirements

### Requirement 1: User Authentication

**User Story:** As a user, I want to log in to the system with my credentials, so that I can access the dormant accounts management features based on my role.

#### Acceptance Criteria

1. WHEN a user submits valid credentials THEN the System SHALL authenticate the user and grant access based on their assigned role
2. WHEN a user submits invalid credentials THEN the System SHALL reject the authentication attempt and display an error message
3. WHEN a user session expires THEN the System SHALL redirect the user to the login page
4. WHEN a user logs out THEN the System SHALL terminate the session and clear authentication tokens
5. THE System SHALL encrypt user passwords using industry-standard hashing algorithms

### Requirement 2: Role-Based Access Control

**User Story:** As a system administrator, I want users to have different access levels based on their roles, so that sensitive operations are restricted to authorized personnel.

#### Acceptance Criteria

1. WHEN an Admin user logs in THEN the System SHALL grant access to all features including file upload functionality
2. WHEN an Operator user logs in THEN the System SHALL grant access to dashboard viewing and account update features
3. WHEN an Operator attempts to access file upload functionality THEN the System SHALL deny access and display an authorization error
4. THE System SHALL validate user roles on every protected operation
5. WHEN a user's role is changed THEN the System SHALL reflect the new permissions in the next session

### Requirement 3: Dashboard Display

**User Story:** As a user, I want to view a dashboard showing dormant accounts summary, so that I can quickly understand the current state of dormant accounts across all banks.

#### Acceptance Criteria

1. WHEN a user accesses the dashboard THEN the System SHALL display the total number of dormant accounts
2. WHEN displaying dashboard data THEN the System SHALL show bank names with their respective dormant account counts
3. WHEN calculating totals THEN the System SHALL display the total balance across all dormant accounts for each bank
4. WHEN dashboard data is updated THEN the System SHALL refresh the display to show current information
5. THE System SHALL aggregate account data by bank name for summary statistics

### Requirement 4: Account Search

**User Story:** As a user, I want to search for specific dormant accounts, so that I can quickly locate accounts that need attention.

#### Acceptance Criteria

1. WHEN a user enters a search term THEN the System SHALL filter accounts matching the account number, bank name, or customer information
2. WHEN search results are returned THEN the System SHALL display all matching accounts with their complete details
3. WHEN a user clears the search THEN the System SHALL display all dormant accounts
4. THE System SHALL perform case-insensitive searches across searchable fields
5. WHEN no accounts match the search criteria THEN the System SHALL display a message indicating no results found

### Requirement 5: Single Account Update

**User Story:** As a user, I want to update reclaim information for a single dormant account, so that I can track the reclaim process for individual accounts.

#### Acceptance Criteria

1. WHEN a user selects an account for update THEN the System SHALL display a form with current account details
2. WHEN a user updates the reclaim status THEN the System SHALL save the new status to the database
3. WHEN a user updates the reclaim date THEN the System SHALL validate and save the date
4. WHEN a user updates the clawback date THEN the System SHALL validate and save the date
5. WHEN a user adds or updates comments THEN the System SHALL save the comment text with the account record
6. WHEN an update is saved THEN the System SHALL refresh the account display to show updated information

### Requirement 6: Bulk Account Update

**User Story:** As a user, I want to update reclaim information for multiple accounts simultaneously, so that I can efficiently process groups of accounts.

#### Acceptance Criteria

1. WHEN a user selects multiple accounts THEN the System SHALL enable bulk update functionality
2. WHEN a user applies bulk updates THEN the System SHALL update reclaim status for all selected accounts
3. WHEN bulk updating dates THEN the System SHALL apply the same reclaim date and clawback date to all selected accounts
4. WHEN bulk updating comments THEN the System SHALL append or replace comments for all selected accounts
5. WHEN bulk update completes THEN the System SHALL display a confirmation message with the count of updated accounts

### Requirement 7: File Upload (Admin Only)

**User Story:** As an Admin, I want to upload dormant account transaction files, so that I can import new dormant account data into the system.

#### Acceptance Criteria

1. WHEN an Admin selects a transaction file THEN the System SHALL validate the file format before processing
2. WHEN a valid file is uploaded THEN the System SHALL parse the file and extract account information
3. WHEN processing uploaded data THEN the System SHALL create new account records or update existing ones based on account numbers
4. WHEN file upload completes THEN the System SHALL display a summary showing the number of accounts processed
5. WHEN an invalid file is uploaded THEN the System SHALL reject the file and display specific error messages
6. WHERE an account already exists THEN the System SHALL update the existing record with new information from the file

### Requirement 8: Data Persistence

**User Story:** As a system administrator, I want all account data and updates to be stored in a relational database, so that data is reliably persisted and can be queried efficiently.

#### Acceptance Criteria

1. THE System SHALL store all dormant account records in a PostgreSQL database
2. WHEN data is modified THEN the System SHALL commit changes to the database immediately
3. WHEN database operations fail THEN the System SHALL rollback transactions to maintain data integrity
4. THE System SHALL maintain referential integrity between related data entities
5. THE System SHALL index frequently queried fields for optimal search performance

### Requirement 9: API Communication

**User Story:** As a developer, I want the frontend and backend to communicate via RESTful APIs, so that the system follows modern architectural patterns and can be maintained independently.

#### Acceptance Criteria

1. THE System SHALL expose RESTful endpoints for all data operations
2. WHEN API requests are made THEN the System SHALL validate authentication tokens
3. WHEN API operations succeed THEN the System SHALL return appropriate HTTP status codes and response data
4. WHEN API operations fail THEN the System SHALL return error responses with descriptive messages
5. THE System SHALL use JSON format for all API request and response payloads

### Requirement 10: Data Validation

**User Story:** As a user, I want the system to validate my input, so that I can ensure data quality and prevent errors.

#### Acceptance Criteria

1. WHEN a user enters a reclaim date THEN the System SHALL validate that the date is in a valid format
2. WHEN a user enters a clawback date THEN the System SHALL validate that the date is not before the reclaim date
3. WHEN required fields are empty THEN the System SHALL prevent form submission and display validation messages
4. WHEN numeric fields are entered THEN the System SHALL validate that values are valid numbers
5. THE System SHALL sanitize all user input to prevent injection attacks

### Requirement 11: Report Export

**User Story:** As a user, I want to export filtered account data to CSV format, so that I can analyze dormant accounts data in external tools or share reports with stakeholders.

#### Acceptance Criteria

1. WHEN a user accesses the reporting tab THEN the System SHALL display export options with available filter criteria
2. WHEN a user applies search filters THEN the System SHALL enable CSV export for the filtered results
3. WHEN a user initiates CSV export THEN the System SHALL generate a file containing all visible account fields
4. WHEN the CSV file is generated THEN the System SHALL include headers for account number, bank name, balance, reclaim status, reclaim date, clawback date, and comments
5. WHEN no filters are applied THEN the System SHALL export all dormant accounts to CSV
6. WHEN the export completes THEN the System SHALL trigger a file download with a timestamped filename
