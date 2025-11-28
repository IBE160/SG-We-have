# Story 0.2: Initialize FastAPI Backend

Status: drafted

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

- [ ] Initialize Python project with `uv` in `backend/` (AC: #1)
  - [ ] Run `uv init` inside `backend/` directory
  - [ ] Configure `pyproject.toml`
- [ ] Install core dependencies (AC: #2)
  - [ ] `uv add fastapi uvicorn`
  - [ ] `uv add supabase python-dotenv pydantic`
- [ ] Create project directory structure (AC: #3)
  - [ ] Create `backend/app/__init__.py`
  - [ ] Create `backend/app/main.py`
  - [ ] Create `backend/app/api/`
  - [ ] Create `backend/app/core/`
- [ ] Implement basic application entry point in `main.py` (AC: #4, #6)
  - [ ] Initialize `FastAPI` app instance
  - [ ] Add root route (`GET /`) returning `{"message": "Hello World"}`
- [ ] Configure CORS Middleware (AC: #5)
  - [ ] Allow origins: `http://localhost:3000`
  - [ ] Allow credentials, methods, and headers
- [ ] Verify server startup and access (AC: #4, #6)
  - [ ] Run `uv run uvicorn app.main:app --reload --port 8000`
  - [ ] Curl `localhost:8000` to verify response

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

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

gemini-1.5-pro

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2025-11-28: Initial Draft created from Epic 0 Tech Spec.
