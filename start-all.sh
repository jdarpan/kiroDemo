#!/bin/bash

echo "=========================================="
echo "Starting Dormant Accounts Application"
echo "=========================================="
echo ""
echo "This will start both backend and frontend."
echo "Press Ctrl+C to stop both services."
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend in background
echo "Starting backend..."
./start-backend.sh > backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 10

# Start frontend in background
echo "Starting frontend..."
./start-frontend.sh > frontend.log 2>&1 &
FRONTEND_PID=$!

echo ""
echo "✅ Both services are starting..."
echo ""
echo "Backend logs: tail -f backend.log"
echo "Frontend logs: tail -f frontend.log"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for both processes
wait
