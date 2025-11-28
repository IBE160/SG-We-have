# Epic Technical Specification: Project Initialization & Environment Setup

Date: fredag 28. november 2025
Author: BIP
Epic ID: 0
Status: Draft

---

## Overview

This epic focuses on the foundational setup of the "AI-Powered Student Helper" project. It involves initializing the monorepo structure, configuring the development environments for both the Next.js frontend and the FastAPI backend, and establishing the connection to the Supabase cloud services. The goal is to create a stable, consistent, and productive development environment that enables parallel development of frontend and backend features, ensuring all core technologies (Next.js, Tailwind, FastAPI, Pydantic AI) are correctly installed and configured.

## Objectives and Scope

**In Scope:**
*   **Repository Structure:** establishing a monorepo with clear separation between `frontend/` and `backend/`.
*   **Frontend Initialization:** Scaffolding a Next.js 15+ application with TypeScript and Tailwind CSS.
*   **Backend Initialization:** Setting up a Python 3.12+ environment with FastAPI using `uv`.
*   **Database Integration:** Configuring the Supabase client in both frontend (for Auth) and backend (for Data) and verifying connectivity.
*   **CI/CD Preparation:** Configuring `.gitignore` and basic README documentation.
*   **Dependency Management:** Installing core dependencies defined in the architecture (Supabase SDKs, Pydantic AI, etc.).

**Out of Scope:**
*   Implementation of functional features (User Registration, Course Creation, etc.).
*   Detailed database schema migration (basic connection only).
*   Deployment pipelines or production environment setup.
*   Containerization (Docker) - Local development is the target for MVP.

## System Architecture Alignment

This epic directly implements the **Project Initialization & Structure** section of the [Architecture Document](./architecture.md).

*   **Monorepo Pattern:** strictly adhering to the `frontend/` and `backend/` root directory structure.
*   **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS.
*   **Backend:** FastAPI, Python 3.12+, managed by `uv`.
*   **Data Layer:** Supabase integration for both Auth (Frontend direct) and Data (Backend via Service Role/JWT).
*   **AI Infrastructure:** Installing `pydantic-ai` and `google-generativeai` in the backend to prepare for Gemini integration.

## Detailed Design

### Services and Modules

| Module/Service | Responsibility | Key Technologies |
| :--- | :--- | :--- |
| **Frontend App** | User Interface host | Next.js 15, React, Tailwind |
| **Backend App** | API host, Business Logic | FastAPI, Uvicorn, Python 3.12 |
| **Supabase Client (FE)** | Auth handling | `@supabase/supabase-js` |
| **Supabase Client (BE)** | Database access, Auth validation | `supabase`, `python-dotenv` |

### Data Models and Contracts

*   **Environment Variables (.env):**
    *   **Frontend (.env.local):** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   **Backend (.env):** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `GEMINI_API_KEY`

### APIs and Interfaces

*   **Backend Health Check:** A standard `GET /health` or `GET /` endpoint to verify the API is running and accessible.
*   **Database Connectivity Check:** A script or startup log entry confirming successful connection to Supabase.

### Workflows and Sequencing

1.  **Backend Setup:**
    *   Initialize `uv` project.
    *   Install dependencies (`fastapi`, `uvicorn`, `supabase`, `pydantic-ai`, etc.).
    *   Create `main.py` with Hello World/Health check.
    *   Configure `.env` loading.
2.  **Frontend Setup:**
    *   Run `create-next-app`.
    *   Install UI dependencies (`lucide-react`, `clsx`, etc.).
    *   Install Supabase SDK.
    *   Configure environment variables.
3.  **Integration Verification:**
    *   Run Backend (`uv run uvicorn ...`).
    *   Run Frontend (`npm run dev`).
    *   Verify "Hello World" from backend.
    *   Verify Supabase client initialization in browser console/logs.

## Non-Functional Requirements

### Performance
*   **Build Time:** Frontend cold start should be under 5 seconds.
*   **Dependency Resolution:** Backend dependency installation via `uv` should be near-instant for cached packages.

### Security
*   **Secrets Management:** Git must ignore all `.env` files.
*   **Access Control:** Backend uses Service Role key (server-side only); Frontend uses Anon key (client-side safe).

### Reliability/Availability
*   **Local Dev:** Both servers (Next.js, FastAPI) must run concurrently on localhost ports (e.g., 3000 and 8000) without port conflicts.

### Observability
*   **Startup Logs:** Both services must log successful startup and port binding to stdout.

## Dependencies and Integrations

*   **Frontend:**
    *   `next` (Latest)
    *   `react`, `react-dom`
    *   `typescript`
    *   `tailwindcss`
    *   `@supabase/supabase-js`
    *   `@tanstack/react-query`
    *   `zustand`
    *   `lucide-react`
*   **Backend:**
    *   `python` (3.12+)
    *   `fastapi`
    *   `uvicorn`
    *   `supabase`
    *   `python-dotenv`
    *   `pydantic`
    *   `pydantic-ai`
    *   `google-generativeai`
    *   `uv` (Project Manager)

## Acceptance Criteria (Authoritative)

1.  **Frontend Initialization:**
    *   Next.js project created using `create-next-app`.
    *   Tailwind CSS configured and working.
    *   Project structure follows best practices (app directory).
    *   Application runs locally on port 3000.
2.  **Backend Initialization:**
    *   Python environment set up (virtualenv/uv).
    *   FastAPI installed.
    *   Basic directory structure created (app, api, core).
    *   "Hello World" endpoint working on localhost:8000.
3.  **Supabase Connection:**
    *   Supabase project created (or instructions provided).
    *   Environment variables configured (.env).
    *   Database connection verified from Backend.
    *   Auth client initialized in Frontend.
4.  **Repository Structure:**
    *   Root directory contains clear `frontend/` and `backend/` folders.
    *   .gitignore configured for both Node and Python artifacts.
    *   README.md updated with setup instructions.

## Traceability Mapping

| Acceptance Criteria | Component | Test Strategy |
| :--- | :--- | :--- |
| Next.js Project & Port 3000 | Frontend | Manual Verification (Browser load) |
| Tailwind CSS | Frontend | Visual Verification (Styles apply) |
| Python/FastAPI Setup | Backend | Manual Verification (uvicorn startup) |
| Endpoint Availability | Backend | `curl localhost:8000` |
| Supabase Config (FE) | Frontend | Console Log check on init |
| Supabase Config (BE) | Backend | Startup connection log |
| Repo Structure | File System | Directory listing check |

## Risks, Assumptions, Open Questions

*   **Assumption:** The user has `node`, `npm`, `python`, and `uv` installed on their local machine.
*   **Assumption:** A valid Supabase project URL and keys are available or will be created by the user.
*   **Risk:** Port conflicts if ports 3000 or 8000 are in use.
*   **Risk:** Python version mismatch if user has an older version (requires 3.12+ for best Pydantic AI support).

## Test Strategy Summary

*   **Verification Method:** Manual "Smoke Test" of the environment.
*   **Success Definition:**
    1.  `npm run dev` starts Frontend without errors.
    2.  `uv run uvicorn` starts Backend without errors.
    3.  Browser can access `localhost:3000`.
    4.  Browser/Curl can access `localhost:8000`.
    5.  No secrets committed to git.
