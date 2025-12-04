#!/bin/bash

# Production startup script for Dormant Accounts Backend
# This script starts the Spring Boot application with production profile

echo "=========================================="
echo "Starting Dormant Accounts Backend"
echo "=========================================="

# Set production profile
export SPRING_PROFILES_ACTIVE=prod

# Create data directory if it doesn't exist
mkdir -p ./data
mkdir -p ./logs

# Load environment variables if .env file exists
if [ -f .env ]; then
    echo "Loading environment variables from .env file..."
    export $(cat .env | grep -v '^#' | xargs)
fi

# Check if JAR file exists
JAR_FILE="dormant-accounts-1.0.0.jar"
if [ ! -f "$JAR_FILE" ]; then
    echo "Error: $JAR_FILE not found!"
    echo "Please copy the JAR file from backend/target/ to this directory"
    exit 1
fi

# Start the application
echo "Starting application on port ${SERVER_PORT:-8080}..."
java -jar $JAR_FILE \
    --spring.profiles.active=prod \
    --server.port=${SERVER_PORT:-8080} \
    --jwt.secret=${JWT_SECRET} \
    --cors.allowed-origins=${CORS_ALLOWED_ORIGINS}

echo "Application stopped"
