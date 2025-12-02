# Fix Backend and Run Application

## The Problem
The backend isn't starting because Maven is not installed.

## Solution - Run these commands in your terminal:

### Step 1: Install Maven
```bash
brew install maven
```

### Step 2: Start the backend
```bash
cd backend
mvn spring-boot:run
```

Keep this terminal open - the backend will run here.

### Step 3: In a NEW terminal, check if frontend is still running
If not, start it:
```bash
cd frontend
npm start
```

### Step 4: Open your browser
Go to: http://localhost:3000

---

## Quick One-Command Fix

Run this in your terminal:
```bash
brew install maven && cd backend && mvn spring-boot:run
```

Then in another terminal:
```bash
cd frontend && npm start
```

---

## Verify Everything is Working

Check if services are running:
```bash
# Check backend
curl http://localhost:8080/api/accounts/search

# Check frontend
curl http://localhost:3000
```

You should see JSON data from the backend and HTML from the frontend.
