# Story 0.2: Initialize FastAPI Backend

Status: review

## Story

As a Backend Developer,
I want to set up a Python FastAPI project structure,
so that I have a high-performance, type-safe backend foundation for building API endpoints.

## Acceptance Criteria

1.  Python environment set up (using `uv`)
2.  FastAPI installed and configured
3.  Basic directory structure created (`app/`, `app/api`, `app/core`)
4.  "Hello World" endpoint working on `localhost:8000`
5.  CORS configured to allow requests from Frontend (`localhost:3000`)
6.  Server runs via `uvicorn`

## Tasks / Subtasks

- [x] Initialize Python project with `uv` in `backend/` (AC: #1)
  - [x] Run `uv init` inside `backend/` directory
  - [x] Configure `pyproject.toml`
- [x] Install core dependencies (AC: #2)
  - [x] `uv add fastapi uvicorn`
  - [x] `uv add supabase python-dotenv pydantic`
- [x] Create project directory structure (AC: #3)
  - [x] Create `backend/app/__init__.py`
  - [x] Create `backend/app/main.py`
  - [x] Create `backend/app/api/`
  - [x] Create `backend/app/core/`
- [x] Implement basic application entry point in `main.py` (AC: #4, #6)
  - [x] Initialize `FastAPI` app instance
  - [x] Add root route (`GET /`) returning `{"message": "Hello World"}`
- [x] Configure CORS Middleware (AC: #5)
  - [x] Allow origins: `http://localhost:3000`
  - [x] Allow credentials, methods, and headers
- [x] Verify server startup and access (AC: #4, #6)
  - [x] Run `uv run uvicorn app.main:app --reload --port 8000`
  - [x] Curl `localhost:8000` to verify response

## Dev Notes

### Relevant Architecture Patterns and Constraints
-   **Backend Framework**: FastAPI (0.110+)
-   **Language**: Python 3.12+
-   **Project Manager**: `uv` (for dependency resolution and venv management)
-   **Monorepo Structure**: `backend/` directory at project root (separate from `frontend/`)
-   **API Structure**: Routes should be organized in `app/api` (though simple root is fine for this init story).
-   **Performance**: `uv` ensures fast dependency installation.

### Source Tree Components to Touch
-   `backend/` directory (newly created)
-   `backend/pyproject.toml` (dependencies)
-   `backend/app/main.py` (entry point)

### Testing Standards Summary
-   Manual verification of server startup.
-   `curl` or browser check of the root endpoint.
-   Verification of `uv` lockfile generation.

### Project Structure Notes
-   This story establishes the `backend/` root, complementing the `frontend/` root established in Story 0.1.
-   Strict separation of concerns: Backend handles data and logic, Frontend handles UI.

### Learnings from Previous Story

**From Story 0-1-initialize-next-js-frontend (Status: done)**

-   **Port Awareness**: Frontend is running on port 3000. Backend MUST use port 8000 and configure CORS to allow `http://localhost:3000`.
-   **Monorepo Clarity**: The `frontend/` directory exists. Ensure `backend/` is created at the same level (project root), not nested.
-   **Dependency Management**: Frontend used `npm`. Backend MUST use `uv` as per architecture.

[Source: stories/0-1-initialize-next-js-frontend.md#Dev-Agent-Record]

### References

-   [Source: docs/sprint-artifacts/tech-spec-epic-0.md#Backend Initialization]
-   [Source: docs/architecture.md#2. Project Initialization & Structure]
-   [Source: docs/epics.md#Story 0.2: Initialize FastAPI Backend]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/epic-0/story-0-2/0-2-initialize-fastapi-backend.context.xml

### Agent Model Used

gemini-1.5-pro

### Debug Log References

### Completion Notes List

- Initialized FastAPI backend using uv.
- Set up directory structure: `app/`, `app/api`, `app/core`.
- Installed core dependencies: `fastapi`, `uvicorn`, `supabase`, `python-dotenv`, `pydantic`.
- Implemented `main.py` with Hello World endpoint and CORS for localhost:3000.
- Verified server startup and response with `curl` and `pytest`.

### File List

- backend/pyproject.toml
- backend/uv.lock
- backend/app/__init__.py
- backend/app/main.py
- backend/app/api/
- backend/app/core/
- backend/tests/test_main.py

## Change Log

- 2025-11-28: Initial Draft created from Epic 0 Tech Spec.
- 2025-11-28: Implemented story: initialized backend, added dependencies, created app structure, added CORS, verified with tests.
