#!/bin/bash

echo "Starting Spring Boot Backend..."
echo "Backend will be available at: http://localhost:8080"
echo ""

cd backend

# Check if Maven is available
if command -v mvn &> /dev/null; then
    mvn spring-boot:run
elif [ -f "mvnw" ]; then
    ./mvnw spring-boot:run
else
    echo "❌ Maven not found. Please run setup.sh first."
    exit 1
fi
