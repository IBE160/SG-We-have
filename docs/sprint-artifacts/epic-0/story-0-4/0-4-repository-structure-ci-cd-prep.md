# Story 0.4: Repository Structure & CI/CD Prep

Status: ready-for-dev

## Story

As a DevOps Engineer,
I want to organize the repository,
so that frontend and backend code are manageable in a single repo (monorepo style) or cleanly separated.

## Acceptance Criteria

1.  Root directory contains clear `frontend/` and `backend/` folders (or equivalent)
2.  `.gitignore` configured for both Node and Python artifacts
3.  `README.md` updated with setup instructions

## Tasks / Subtasks

- [ ] **AC 1: Verify and Formalize Repository Structure**
  - [ ] Audit root directory to ensure clean separation of `frontend/` and `backend/`.
  - [ ] Move any misplaced configuration files to their respective directories.
  - [ ] Verify no cross-contamination of dependencies (e.g., `package.json` in backend).

- [ ] **AC 2: Configure .gitignore**
  - [ ] Review existing `.gitignore` (or create if missing).
  - [ ] Ensure Node.js artifacts are ignored (node_modules, .next, .env.local, npm-debug.log, etc.).
  - [ ] Ensure Python artifacts are ignored (venv, __pycache__, .pytest_cache, .env, *.pyc, etc.).
  - [ ] Ensure system files are ignored (.DS_Store, Thumbs.db).
  - [ ] Consolidate ignores into a single root `.gitignore` or verify split configuration.

- [ ] **AC 3: Update Documentation**
  - [ ] Update root `README.md` with comprehensive setup instructions.
  - [ ] Include "Prerequisites" section (Node, Python, uv, etc.).
  - [ ] Include "Getting Started" for Frontend (npm install, run dev).
  - [ ] Include "Getting Started" for Backend (uv sync, run server).
  - [ ] Document the monorepo structure and where to find things.
  - [ ] Add a "Troubleshooting" section if common issues are known (e.g., port conflicts).

## Dev Notes

### Relevant Architecture Patterns and Constraints
-   **Monorepo Pattern:** The project follows a Monorepo structure to keep frontend and backend tightly coupled in context but loosely coupled in code. [Source: docs/architecture.md#2.-Project-Initialization-&-Structure]
-   **Project Initialization:** The initialization commands for both stacks are explicitly defined in the architecture. [Source: docs/architecture.md#2.-Project-Initialization-&-Structure]
-   **Security:** Secrets Management rules must be enforced via .gitignore. [Source: docs/architecture.md#7.-Security-&-Environment]

### Source Tree Components to Touch
-   `.gitignore` (Root)
-   `README.md` (Root)
-   `frontend/` (Audit structure)
-   `backend/` (Audit structure)

### Testing Standards Summary
-   **Verification Method:** Manual verification of the file system structure and git status (to ensure ignored files are not tracked).
-   **Documentation Test:** Follow the `README.md` instructions on a fresh clone (or simulate it) to verify they work.
-   **Git Status:** Run `git status` to confirm no artifact files (node_modules, venv) are showing up as untracked files.

### Project Structure Notes
-   The `frontend/` and `backend/` directories should be the primary top-level folders.
-   `docs/` folder should remain at the root.

### Learnings from Previous Story (0.3: Configure Supabase Connection)

From Story 0.3-configure-supabase-connection (Status: drafted):
-   **Existing Structure:** `frontend/` and `backend/` folders already exist and contain the respective projects.
-   **Environment Files:** `.env` (Backend) and `.env.local` (Frontend) were created. It was noted to ensure they are in `.gitignore`. This story (0.4) serves as the final audit to guarantee this security practice is permanent.
-   **Documentation:** While 0.3 added some setup, 0.4 is the dedicated place to consolidate all setup instructions into a coherent `README.md` for new developers.

### References

-   [Source: docs/epics.md#Story 0.4: Repository Structure & CI/CD Prep]
-   [Source: docs/sprint-artifacts/tech-spec-epic-0.md#Acceptance-Criteria-(Authoritative)]
-   [Source: docs/architecture.md#2.-Project-Initialization-&-Structure]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/epic-0/story-0-4/0-4-repository-structure-ci-cd-prep.context.xml

### Agent Model Used

Gemini CLI

### Debug Log References

### Completion Notes List

### File List
