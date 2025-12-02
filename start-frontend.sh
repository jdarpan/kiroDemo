#!/bin/bash

echo "Starting React Frontend..."
echo "Frontend will be available at: http://localhost:3000"
echo ""

cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies first..."
    npm install
fi

npm start
