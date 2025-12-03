-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS dormant_accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create dormant_accounts table
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

-- Create indexes for dormant_accounts table
CREATE INDEX idx_account_number ON dormant_accounts(account_number);
CREATE INDEX idx_bank_name ON dormant_accounts(bank_name);
CREATE INDEX idx_reclaim_status ON dormant_accounts(reclaim_status);
