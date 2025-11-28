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

From the project root:

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Sync Environment & Install Dependencies:**
   ```bash
   uv sync
   ```

3. **Run Development Server:**
   Starts the server on `http://localhost:8000`.
   ```bash
   uv run uvicorn app.main:app --reload --port 8000
   ```

4. **Run Tests:**
   ```bash
   uv run pytest
   ```

### Frontend (Next.js)

From the project root:

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Sync/Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run Development Server:**
   Starts the server on `http://localhost:3000`.
   ```bash
   npm run dev
   ```
