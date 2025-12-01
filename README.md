# SG-We-have

AI-Powered Student Helper Application.
This project is a monorepo containing a Next.js frontend and a FastAPI backend.

## Repository Structure

```
SG-We-have/
├── frontend/       # Next.js application
├── backend/        # FastAPI application
├── docs/           # Documentation and sprint artifacts
└── README.md       # This file
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or later) & **npm**
- **Python** (v3.12 or later)
- **uv** (Python package manager) - [Installation Guide](https://docs.astral.sh/uv/getting-started/installation/)

## Getting Started

### Backend (FastAPI)

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Sync environment and install dependencies:**
    ```bash
    uv sync
    ```

3.  **Run the development server:**
    ```bash
    uv run uvicorn app.main:app --reload --port 8000
    ```
    The API will be available at `http://localhost:8000`.
    API Documentation (Swagger UI) at `http://localhost:8000/docs`.

4.  **Run Tests:**
    ```bash
    uv run pytest
    ```

### Frontend (Next.js)

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## Troubleshooting

### Port Conflicts
- **Frontend:** Uses port `3000`. If occupied, Next.js will try `3001`.
- **Backend:** Uses port `8000`. If occupied, change the `--port` flag in the `uv run` command.

### Dependency Issues
- **Backend:** If you encounter issues with Python packages, try removing the `.venv` folder and running `uv sync` again.
- **Frontend:** If you encounter issues with Node packages, try removing `node_modules` and `package-lock.json`, then run `npm install`.