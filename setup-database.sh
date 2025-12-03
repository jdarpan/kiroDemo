#!/bin/bash

echo "=========================================="
echo "Database Setup Script"
echo "=========================================="
echo ""

# Check if PostgreSQL is installed
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL is installed"
    
    # Check if PostgreSQL is running
    if pg_isready &> /dev/null; then
        echo "✅ PostgreSQL is running"
        
        # Create database
        echo "Creating database 'dormant_accounts'..."
        psql -U postgres -c "DROP DATABASE IF EXISTS dormant_accounts;" 2>/dev/null
        psql -U postgres -c "CREATE DATABASE dormant_accounts;" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "✅ Database 'dormant_accounts' created successfully"
            echo ""
            echo "Database connection details:"
            echo "  URL: jdbc:postgresql://localhost:5432/dormant_accounts"
            echo "  Username: postgres"
            echo "  Password: postgres"
        else
            echo "⚠️  Could not create database. You may need to:"
            echo "   1. Start PostgreSQL: brew services start postgresql"
            echo "   2. Set password: psql postgres -c \"ALTER USER postgres PASSWORD 'postgres';\""
        fi
    else
        echo "⚠️  PostgreSQL is not running"
        echo "Starting PostgreSQL..."
        brew services start postgresql
        echo "Please run this script again after PostgreSQL starts"
    fi
else
    echo "⚠️  PostgreSQL is not installed"
    echo ""
    echo "The application will use H2 in-memory database for development."
    echo ""
    echo "To install PostgreSQL (optional):"
    echo "  brew install postgresql@14"
    echo "  brew services start postgresql@14"
fi

echo ""
echo "=========================================="
echo "Note: The application is configured to work with both:"
echo "  - PostgreSQL (production)"
echo "  - H2 in-memory database (development/testing)"
echo ""
echo "The schema and initial data will be created automatically"
echo "when you start the Spring Boot application."
echo "=========================================="
