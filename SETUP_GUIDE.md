# Setup Guide

## Quick Start

Run the setup script to install all dependencies:

```bash
./setup.sh
```

This will:
- Check for Homebrew (required)
- Install Java 17 if not present
- Install Node.js if not present
- Set up Maven Wrapper
- Install frontend npm dependencies

## Running the Application

### Option 1: Run Both Services Together
```bash
./start-all.sh
```

### Option 2: Run Services Separately

**Terminal 1 - Backend:**
```bash
./start-backend.sh
```

**Terminal 2 - Frontend:**
```bash
./start-frontend.sh
```

## Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **H2 Database Console:** http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:dormantdb`
  - Username: `sa`
  - Password: (leave empty)

## Manual Setup (if scripts don't work)

### Install Dependencies
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Java and Node
brew install openjdk@17 node
```

### Run Backend
```bash
cd backend
mvn spring-boot:run
```

### Run Frontend
```bash
cd frontend
npm install
npm start
```

## Troubleshooting

**Java not found after installation:**
```bash
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
```

**Port already in use:**
- Backend (8080): Change port in `backend/src/main/resources/application.yml`
- Frontend (3000): Set `PORT=3001` before running `npm start`
