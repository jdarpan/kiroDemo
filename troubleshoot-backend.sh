#!/bin/bash

echo "=== Backend Troubleshooting ==="
echo ""

echo "1. Checking Java version..."
java -version
echo ""

echo "2. Checking Maven version..."
mvn -version
echo ""

echo "3. Cleaning and rebuilding..."
cd backend
mvn clean install -DskipTests
echo ""

echo "4. If successful, starting application..."
mvn spring-boot:run
