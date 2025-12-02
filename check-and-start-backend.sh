#!/bin/bash

echo "Checking Maven installation..."

# Add homebrew to PATH
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

# Check if mvn is available
if command -v mvn &> /dev/null; then
    echo "Maven found at: $(which mvn)"
    echo "Maven version: $(mvn -version | head -1)"
    echo ""
    echo "Starting backend..."
    cd backend
    mvn spring-boot:run
else
    echo "ERROR: Maven not found!"
    echo "Please install Maven first:"
    echo "  brew install maven"
    exit 1
fi
