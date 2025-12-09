# Story 0.4: Repository Structure & CI/CD Prep

Status: done

## Story

As a DevOps Engineer,
I want to organize the repository,
so that frontend and backend code are manageable in a single repo (monorepo style) or cleanly separated.

## Acceptance Criteria

1.  Root directory contains clear `frontend/` and `backend/` folders (or equivalent)
2.  `.gitignore` configured for both Node and Python artifacts
3.  `README.md` updated with setup instructions

## Tasks / Subtasks

- [x] **AC 1: Verify and Formalize Repository Structure**
  - [x] Audit root directory to ensure clean separation of `frontend/` and `backend/`.
  - [x] Move any misplaced configuration files to their respective directories.
  - [x] Verify no cross-contamination of dependencies (e.g., `package.json` in backend).

- [x] **AC 2: Configure .gitignore**
  - [x] Review existing `.gitignore` (or create if missing).
  - [x] Ensure Node.js artifacts are ignored (node_modules, .next, .env.local, npm-debug.log, etc.).
  - [x] Ensure Python artifacts are ignored (venv, __pycache__, .pytest_cache, .env, *.pyc, etc.).
  - [x] Ensure system files are ignored (.DS_Store, Thumbs.db).
  - [x] Consolidate ignores into a single root `.gitignore` or verify split configuration.

- [x] **AC 3: Update Documentation**
  - [x] Update root `README.md` with comprehensive setup instructions.
  - [x] Include "Prerequisites" section (Node, Python, uv, etc.).
  - [x] Include "Getting Started" for Frontend (npm install, run dev).
  - [x] Include "Getting Started" for Backend (uv sync, run server).
  - [x] Document the monorepo structure and where to find things.
  - [x] Add a "Troubleshooting" section if common issues are known (e.g., port conflicts).

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

- **AC 1 Planning:**
  - Auditing root, frontend, and backend directories.
  - Will verify file placements and dependency isolation.

### Completion Notes List

- Verified `frontend/` and `backend/` separation.
- Consolidated ignores into root `.gitignore`, covering Node, Python, and secrets.
- Removed redundant `frontend/.gitignore`.
- Updated `README.md` with comprehensive setup instructions for both stacks.

### File List
- .gitignore
- README.md
- frontend/.gitignore (deleted)

### Change Log
- 2025-12-01: Implemented repository structure audit, consolidated .gitignore, and updated README.md. Marked story as Review.
- 2025-12-01: Senior Developer Review performed. Outcome: Approve. Story marked Done.

## Senior Developer Review (AI)

- **Reviewer:** Amelia (AI Senior Dev)
- **Date:** 2025-12-01
- **Outcome:** Approve
- **Summary:** The repository structure has been successfully formalized with a clean separation of concerns between frontend and backend. The `.gitignore` configuration is comprehensive and secure, correctly ignoring environment files and build artifacts for both stacks. Documentation has been significantly improved to guide new developers.

### Key Findings

-   **[None]** No High or Medium severity issues found. Implementation is solid.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
| :--- | :--- | :--- | :--- |
| 1 | Root directory contains clear `frontend/` and `backend/` folders | **IMPLEMENTED** | `ls -R` confirmed `frontend/package.json` and `backend/pyproject.toml` exist in correct locations. |
| 2 | `.gitignore` configured for both Node and Python artifacts | **IMPLEMENTED** | Root `.gitignore` includes `node_modules`, `.next`, `.venv`, `__pycache__`, and `.env`. verified `frontend/.gitignore` was removed. |
| 3 | `README.md` updated with setup instructions | **IMPLEMENTED** | `README.md` contains clear sections for Prerequisites, Frontend/Backend setup, and Troubleshooting. |

**Summary:** 3 of 3 acceptance criteria fully implemented.

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
| :--- | :--- | :--- | :--- |
| Audit root directory | [x] | **VERIFIED** | File system check passed. |
| Move misplaced config files | [x] | **VERIFIED** | No config files found in root (except monorepo level ones). |
| Verify no cross-contamination | [x] | **VERIFIED** | `package.json` only in frontend, `pyproject.toml` only in backend. |
| Review existing `.gitignore` | [x] | **VERIFIED** | `.gitignore` content reviewed. |
| Ensure Node.js artifacts ignored | [x] | **VERIFIED** | Lines 18-25 in `.gitignore`. |
| Ensure Python artifacts ignored | [x] | **VERIFIED** | Lines 28-39 in `.gitignore`. |
| Ensure system files ignored | [x] | **VERIFIED** | Lines 2-4 in `.gitignore`. |
| Consolidate ignores | [x] | **VERIFIED** | Single root `.gitignore` exists. |
| Update root `README.md` | [x] | **VERIFIED** | Content verified. |
| Include "Prerequisites" | [x] | **VERIFIED** | "Prerequisites" section present. |
| Include "Getting Started" (FE) | [x] | **VERIFIED** | "Frontend (Next.js)" section present. |
| Include "Getting Started" (BE) | [x] | **VERIFIED** | "Backend (FastAPI)" section present. |
| Document monorepo structure | [x] | **VERIFIED** | "Repository Structure" section present. |
| Add "Troubleshooting" | [x] | **VERIFIED** | "Troubleshooting" section present. |

**Summary:** 14 of 14 completed tasks verified.

### Test Coverage and Gaps
-   **Verification:** Manual verification of file structure and configuration files was appropriate for this infrastructure story.
-   **CI/CD:** `README.md` lists test commands (`uv run pytest`) which is good preparation.

### Architectural Alignment
-   **Alignment:** Perfect alignment with `docs/architecture.md` regarding Monorepo Structure and Initialization.
-   **Security:** `.env` files are correctly ignored as per security requirements.

### Action Items

**Advisory Notes:**
-   Note: Ensure all developers run `uv sync` and `npm install` after pulling these changes to respect the new structure.

