# SG-We-have

Repository for SG-We-have - IBE160 Programmering med KI.

## Project Structure

This project is a monorepo containing:
- **Frontend:** Next.js application (`frontend/`)
- **Backend:** FastAPI application (`backend/`)
- **Documentation:** Project docs and sprint artifacts (`docs/`)

## Getting Started

### Prerequisites

- **Node.js** (for Frontend)
- **Python 3.12+** (for Backend)
- **uv** (Python package manager)

### Backend (FastAPI)

Navigate to the backend directory:
```bash
cd backend
```

#### 1. Install Dependencies
```bash
uv sync
```

#### 2. Run the Development Server
Starts the server on `http://localhost:8000`.
```bash
uv run uvicorn app.main:app --reload --port 8000
```

#### 3. Run Tests
```bash
uv run pytest
```

### Frontend (Next.js)

Navigate to the frontend directory:
```bash
cd frontend
```

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Run the Development Server
Starts the server on `http://localhost:3000`.
```bash
npm run dev
```