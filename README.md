# Dormant Accounts Management System

A full-stack application for operations teams to search and manage dormant bank accounts.

## Architecture

- **Frontend**: React SPA (Port 3000)
- **Backend**: Spring Boot Microservices (Port 8080)

## Features

- Search dormant bank accounts
- Update reclaim flag, reclaim date, clawback date, and comments
- Single and bulk account updates

## Getting Started

### Backend (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend (React)
```bash
cd frontend
npm install
npm start
```

## API Endpoints

- `GET /api/accounts/search?query={query}` - Search accounts
- `GET /api/accounts/{id}` - Get account details
- `PUT /api/accounts/{id}` - Update single account
- `PUT /api/accounts/bulk` - Bulk update accounts
