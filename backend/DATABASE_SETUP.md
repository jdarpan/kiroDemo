# Database Setup Documentation

## Overview

The Dormant Accounts Management System uses PostgreSQL as the primary database for production and H2 in-memory database for development/testing.

## Database Schema

### Tables

#### 1. users
Stores user authentication and authorization information.

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
```

**Fields:**
- `id`: Auto-incrementing primary key
- `username`: Unique username for login
- `password`: BCrypt hashed password
- `role`: User role (ADMIN or OPERATOR)
- `active`: Account status flag
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

#### 2. dormant_accounts
Stores dormant bank account information.

```sql
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
```

**Fields:**
- `id`: Auto-incrementing primary key
- `account_number`: Unique account identifier
- `bank_name`: Name of the bank
- `balance`: Account balance (up to 15 digits, 2 decimal places)
- `customer_name`: Account holder name
- `customer_email`: Account holder email
- `reclaim_status`: Status of reclaim process (PENDING, IN_PROGRESS, COMPLETED, FAILED)
- `reclaim_date`: Date when reclaim was initiated
- `clawback_date`: Date when funds were recovered
- `comments`: Additional notes
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

### Indexes

For optimal query performance, the following indexes are created:

```sql
CREATE INDEX idx_account_number ON dormant_accounts(account_number);
CREATE INDEX idx_bank_name ON dormant_accounts(bank_name);
CREATE INDEX idx_reclaim_status ON dormant_accounts(reclaim_status);
```

## Initial Data

The system is initialized with two default users:

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| admin | admin123 | ADMIN | Full system access including file uploads |
| operator | operator123 | OPERATOR | Dashboard viewing and account updates |

**Note:** These are development credentials. Change them before deploying to production!

## Database Configuration

### PostgreSQL (Production)

Configure the following environment variables:

```bash
DATABASE_URL=jdbc:postgresql://localhost:5432/dormant_accounts
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_secure_password
```

Or update `application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/dormant_accounts
    username: postgres
    password: your_secure_password
```

### H2 (Development/Testing)

To run with H2 in-memory database:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
```

H2 Console is available at: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:dormant_accounts`
- Username: `sa`
- Password: (leave empty)

## Setup Instructions

### Option 1: Automatic Setup (Recommended)

The database schema and initial data are automatically created when the application starts. The `DatabaseInitializer` component executes the SQL scripts on startup.

### Option 2: Manual PostgreSQL Setup

1. Install PostgreSQL:
   ```bash
   brew install postgresql@14
   brew services start postgresql@14
   ```

2. Create the database:
   ```bash
   psql -U postgres -c "CREATE DATABASE dormant_accounts;"
   ```

3. Run the application - schema and data will be created automatically

### Option 3: Using the Setup Script

Run the provided setup script:

```bash
./setup-database.sh
```

This script will:
- Check if PostgreSQL is installed
- Create the database if PostgreSQL is available
- Provide instructions for H2 fallback if PostgreSQL is not available

## Verification

When the application starts successfully, you should see:

```
✅ Database schema and initial data loaded successfully!
========================================
Database Verification
========================================
✅ Users table exists with 2 records
   - admin (ADMIN)
   - operator (OPERATOR)
✅ Dormant_accounts table exists with 0 records
✅ Database indexes created successfully
========================================
Database setup complete!
```

## Troubleshooting

### PostgreSQL Connection Issues

If you see connection errors:

1. Check if PostgreSQL is running:
   ```bash
   brew services list
   ```

2. Start PostgreSQL if needed:
   ```bash
   brew services start postgresql@14
   ```

3. Verify the database exists:
   ```bash
   psql -U postgres -l
   ```

### H2 Database Issues

If H2 console is not accessible:

1. Ensure H2 profile is active:
   ```bash
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=h2
   ```

2. Check that `spring.h2.console.enabled=true` in `application-h2.yml`

### Schema Not Created

If tables are not created:

1. Check application logs for SQL execution errors
2. Verify SQL scripts exist in `src/main/resources/`:
   - `schema.sql`
   - `data.sql`
3. Ensure `DatabaseInitializer` component is not disabled

## Security Notes

⚠️ **Important Security Considerations:**

1. **Change Default Passwords**: The default admin/operator passwords are for development only
2. **Use Strong Passwords**: In production, use strong, unique passwords
3. **Secure Database Credentials**: Never commit database credentials to version control
4. **Use Environment Variables**: Store sensitive configuration in environment variables
5. **Enable SSL**: Use SSL/TLS for database connections in production
6. **Regular Backups**: Implement regular database backup procedures

## Migration Notes

When deploying to production:

1. Update the default user passwords
2. Configure proper database credentials
3. Set up database backups
4. Enable SSL for database connections
5. Review and adjust connection pool settings
6. Set up monitoring and alerting

## References

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Spring Boot Data Access: https://docs.spring.io/spring-boot/docs/current/reference/html/data.html
- H2 Database: http://www.h2database.com/
