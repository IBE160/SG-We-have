# User Story: Create New Course

**Story ID:** 1-3
**Epic:** 1 - User Foundation & Course Management
Status: done

## User Story
**AS A** logged-in user
**I WANT** to create a new course
**SO THAT** I can organize my lectures and notes under specific subjects.

## Acceptance Criteria

### AC 1.3.1: Course Creation Input
- [ ] The dashboard provides a clearly visible "Create Course" button.
- [ ] Clicking the button opens a modal or input field prompting for the "Course Name".
- [ ] The input field validates that the name is not empty.

### AC 1.3.2: Successful Creation
- [ ] Upon submission, the system sends a request to create the course.
- [ ] The course is saved in the database and associated *only* with the currently logged-in user.
- [ ] The user receives visual confirmation (e.g., the new course appears in the list immediately or a success toast).

### AC 1.3.3: Data Persistence
- [ ] The backend stores the course with a unique ID, the user's ID, the provided name, and a timestamp.
- [ ] Row Level Security (RLS) policies ensure the course is linked to `auth.uid()`.

## Tasks

### Frontend Tasks
- [x] **Implement Create Course UI** (AC: 1.3.1)
  - Create `CreateCourseModal` component or similar on the `Dashboard` page.
  - Add "Create Course" button to trigger the modal.
  - Implement form validation (non-empty name).
- [x] **Integrate Course Creation API** (AC: 1.3.2)
  - Update `frontend/lib/api.ts` (or similar service) to call `POST /api/v1/courses`.
  - Pass the Supabase JWT token in the `Authorization` header.
  - Handle success (close modal, refresh list/update state) and error states.

### Backend Tasks
- [x] **Implement Create Course Endpoint** (AC: 1.3.3)
  - Create `POST /api/v1/courses` endpoint in `backend/app/api/routers/courses.py`.
  - Define Pydantic model: `class CourseCreate(BaseModel): name: str`.
  - Use `deps.get_current_current` (created in Story 1-2) to validate JWT and get `user_id`.
  - Insert record into `courses` table: `{ user_id: user.id, name: body.name }`.
  - Return the created course object.
- [x] **Verify RLS Policies** (AC: 1.3.3)
  - Ensure Supabase RLS policy for `courses` table allows `INSERT` only for authenticated users where `auth.uid() = user_id`.

### Testing Tasks
- [x] **Backend Integration Tests** (AC: 1.3.3)
  - Test `POST /api/v1/courses` with valid token -> 201 Created.
  - Test `POST /api/v1/courses` without token -> 401 Unauthorized.
  - Test `POST /api/v1/courses` with invalid data (empty name) -> 422 Unprocessable Entity.

### Review Follow-ups (AI)
- [x] [AI-Review][Medium] Implement visual confirmation for course creation (e.g., refresh course list, success toast) in `frontend/app/dashboard/page.tsx`.
- [x] [AI-Review][Low] Refine frontend error typing to use a more specific error interface instead of `any` in `frontend/components/CreateCourseModal.tsx` and `frontend/lib/api.ts`.
- [x] [AI-Review][Low] Replace `print()` statement with a proper logging framework in `backend/app/api/routers/courses.py`.

## Dev Notes

### Architecture Patterns and Constraints
- **Frontend-Backend Separation**: The frontend must not insert directly into the `courses` table for this operation; it must use the Backend API `POST /api/v1/courses` as defined in the Tech Spec. [Source: docs/sprint-artifacts/tech-spec-epic-1.md]
- **Authentication**: Use the established `security.py` dependency to validate tokens. The backend trusts the JWT signed by Supabase. [Source: docs/architecture.md]

### Learnings from Previous Story (1-2: User Login & Logout)
- **Reusable Auth Components**: We can now use `SupabaseClientProvider` for auth context and `backend/app/core/security.py` for token validation.
- **Advisory**: In Story 1-2, it was noted to "Consider typing the error object in `LoginPage`". For this story's frontend work (`CreateCourseModal`), ensure we define proper interfaces for error handling to avoid `any`. [Source: docs/sprint-artifacts/epic-1/story-1-2/story-1-2.md]

### References
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md] - Epic 1 Technical Specification
- [Source: docs/architecture.md] - System Architecture
- [Source: docs/PRD.md] - Product Requirements Document

## Change Log
- **2025-12-01**: Initial Draft created.
- **2025-12-01**: Updated with formal Tasks section, Dev Notes, and addressed validation feedback regarding previous story continuity.
- **2025-12-01**: Senior Developer Review notes appended. Outcome: Changes Requested.
- **2025-12-01**: Addressed code review findings - 3 items resolved (Date: 2025-12-01)
- **2025-12-01**: Second Senior Developer Review. Outcome: Approved.

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/epic-1/story-1-3/1-3-create-new-course.md

### Agent Model Used
- Gemini CLI

### Debug Log References
- N/A

### Completion Notes List
- Refined tasks to strictly follow the "Frontend API call" pattern.
- Included specific reference to the previous story's advisory about type safety.
- Mapped all tasks to Acceptance Criteria.
- Story implementation completed and marked for review after running all backend tests. All tests passed.
- Resolved 3 code review findings: Added visual confirmation, improved error typing, and added backend logging.

### File List
- docs/sprint-artifacts/epic-1/story-1-3/1-3-create-new-course.md
- frontend/app/dashboard/page.tsx
- frontend/lib/api.ts
- frontend/components/CreateCourseModal.tsx
- backend/app/api/routers/courses.py

---
**Senior Developer Review (AI)**

**Reviewer**: BIP
**Date**: mandag 1. desember 2025
**Outcome**: Changes Requested (See Justification below)

### Summary
The implementation for Story 1-3 ("Create New Course") provides a solid foundation, with core functionality for creating courses and robust backend and database integration. The client-side validation, API integration, and server-side logic are largely complete and well-tested. However, there is a clear gap in the frontend user experience regarding visual confirmation of a successful course creation, which leads to a "Changes Requested" outcome.

### Justification for Changes Requested
A critical aspect of a successful user interaction is clear feedback. The frontend currently lacks visual confirmation upon successful course creation, as indicated by a `TODO` comment in the `DashboardPage.tsx`. This directly impacts Acceptance Criterion 1.3.2. While the backend correctly processes the creation, the user is not explicitly informed of success on the UI, which can lead to confusion or repeated actions.

### Key Findings

#### MEDIUM Severity Issues
-   **AC 1.3.2: Frontend Visual Confirmation Missing**
    *   **Description**: The frontend does not provide explicit visual confirmation (e.g., refreshing the course list, displaying a success toast/message) to the user after a course is successfully created.
    *   **Rationale**: This impacts user experience and violates AC 1.3.2.
    *   **Evidence**: `frontend/app/dashboard/page.tsx`, Line 12 (`// TODO: Refresh the course list`).
    *   **Related Task**: Frontend: Integrate Course Creation API (Questionable completion due to this missing visual feedback).

#### LOW Severity Issues
-   **Improve Frontend Error Typing**
    *   **Description**: Generic `catch (err: any)` blocks are used for error handling in the frontend API calls and modal.
    *   **Rationale**: This deviates from the project's emphasis on type discipline and can lead to less robust error handling.
    *   **Evidence**: `frontend/components/CreateCourseModal.tsx` (Line 33), `frontend/lib/api.ts` (Line 26).
-   **Implement Proper Backend Logging**
    *   **Description**: The backend uses `print()` for error logging in `courses.py`.
    *   **Rationale**: While functional for development, a more robust logging framework (e.g., Python's `logging` module) is essential for production monitoring and debugging.
    *   **Evidence**: `backend/app/api/routers/courses.py`, Line 36 (`print(f"Error creating course: {e}")`).

### Acceptance Criteria Coverage

| AC#   | Description                                                                                                                                                                                                                                                                   | Status      | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| :---- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.3.1 | The dashboard provides a clearly visible "Create Course" button. Clicking the button opens a modal or input field prompting for the "Course Name". The input field validates that the name is not empty.                                                                        | IMPLEMENTED | `frontend/app/dashboard/page.tsx` (button on Line 21, modal invocation on Line 41). `frontend/components/CreateCourseModal.tsx` (modal implementation, input field on Line 40, client-side validation on Lines 24-27). Server-side validation also present in `backend/app/api/routers/courses.py` (Lines 14-16) and tested in `backend/tests/test_courses.py` (`test_create_course_empty_name`).                                                                                                                                                  |
| 1.3.2 | Upon submission, the system sends a request to create the course. The course is saved in the database and associated *only* with the currently logged-in user. The user receives visual confirmation (e.g., the new course appears in the list immediately or a success toast). | PARTIAL     | Request sent via `frontend/lib/api.ts` (`createCourse` function, Lines 14-36) with JWT for user association. Backend handles saving to DB and user association in `backend/app/api/routers/courses.py` (Lines 18-34). Tested in `backend/tests/test_courses.py` (`test_create_course_success`, `test_create_course_no_auth`). **Missing**: Frontend visual confirmation (TODO in `frontend/app/dashboard/page.tsx`, Line 12).                                                                                                                                                   |
| 1.3.3 | The backend stores the course with a unique ID, the user's ID, the provided name, and a timestamp. Row Level Security (RLS) policies ensure the course is linked to `auth.uid()`.                                                                                             | IMPLEMENTED | `supabase/migrations/20251201000001_create_courses.sql` creates table with UUID and timestamp defaults, implements RLS policies for `INSERT` and `SELECT` (Lines 1-17). `backend/app/api/routers/courses.py` inserts `user_id` and `name` (Lines 25-34). Verified by `backend/tests/test_courses.py` (`test_create_course_success`).                                                                                                                                                                                                                                |

**Summary**: 2 of 3 acceptance criteria fully implemented. AC 1.3.2 is partially implemented.

### Task Completion Validation

| Task                                 | Marked As | Verified As          | Evidence                                                                                                                                                                                                                                                                         |
| :----------------------------------- | :-------- | :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend: Implement Create Course UI** | [x]       | VERIFIED COMPLETE    | `frontend/app/dashboard/page.tsx` (button, modal invocation). `frontend/components/CreateCourseModal.tsx` (modal, form validation).                                                                                                                                               |
| **Frontend: Integrate Course Creation API** | [x]       | QUESTIONABLE         | `frontend/components/CreateCourseModal.tsx` (`createCourse` call), `frontend/lib/api.ts` (API call with token, error handling). **Questionable**: Frontend `DashboardPage.tsx` has `// TODO: Refresh the course list` in `handleCourseCreated`, indicating incomplete success handling. |
| **Backend: Implement Create Course Endpoint** | [x]       | VERIFIED COMPLETE    | `backend/app/api/routers/courses.py` (endpoint implementation). `backend/tests/test_courses.py` (`test_create_course_success`).                                                                                                                                       |
| **Backend: Verify RLS Policies**      | [x]       | VERIFIED COMPLETE    | `supabase/migrations/20251201000001_create_courses.sql` (RLS policies).                                                                                                                                                                                                          |
| **Testing: Backend Integration Tests** | [x]       | VERIFIED COMPLETE    | `backend/tests/test_courses.py` (all three tests implemented and cover specified cases).                                                                                                                                                                                 |

**Summary**: 4 of 5 completed tasks verified, 1 questionable, 0 falsely marked complete.

### Test Coverage and Gaps
- **Backend Tests**: Comprehensive integration tests (`backend/tests/test_courses.py`) cover successful creation, invalid input, and unauthorized access for the `POST /api/v1/courses` endpoint.
- **Frontend Tests**: No specific frontend tests were listed or reviewed.
- **Gaps**: There are no explicit frontend unit or integration tests to verify the UI behavior for course creation (e.g., button click, modal open/close, client-side validation).

### Architectural Alignment
The implementation aligns well with the defined architecture patterns and constraints, including:
-   **Data Flow**: Correct use of frontend calling backend API with JWT.
-   **Naming Conventions**: Adherence to `snake_case` for DB/Python and `kebab-case` for API endpoints.
-   **API Contract**: Follows specified response and error formats.
-   **Security (RLS)**: Correct implementation of RLS on the `courses` table.

### Security Notes
The authentication and authorization mechanisms are correctly implemented using Supabase JWTs and RLS. Input validation is present on both frontend and backend. No high or medium severity security vulnerabilities were identified.

### Best-Practices and References
-   **Frontend-Backend Separation**: Frontend must use the Backend API `POST /api/v1/courses` for data operations.
-   **Authentication**: Use `backend/app/core/security.py`'s `get_current_user` for JWT validation.
-   **Data Persistence**: Row Level Security (RLS) must be active on the `courses` table for user data isolation.
-   **Type Discipline**: Manual Type Sync: If a Pydantic model in Backend (`schemas.py`) is modified, the corresponding TypeScript interface in Frontend (`types/api.ts`) **MUST** be updated.
-   **Error Handling**: Proper interfaces for error handling on the frontend should be used to avoid `any` types.

### Action Items

**Code Changes Required:**
- [x] [Medium] Implement visual confirmation for course creation (e.g., refresh course list, success toast) in `frontend/app/dashboard/page.tsx` within the `handleCourseCreated` function. (AC 1.3.2) [file: frontend/app/dashboard/page.tsx:12]
- [x] [Low] Refine frontend error typing to use a more specific error interface instead of `any` in `frontend/components/CreateCourseModal.tsx` and `frontend/lib/api.ts`. [file: frontend/components/CreateCourseModal.tsx:33, frontend/lib/api.ts:26]
- [x] [Low] Replace `print()` statement with a proper logging framework in `backend/app/api/routers/courses.py`. [file: backend/app/api/routers/courses.py:36]

**Advisory Notes:**
- Note: Consider adding frontend unit/integration tests for the `CreateCourseModal` and dashboard interaction to cover UI behavior.

---
**Senior Developer Review (AI)**

**Reviewer**: BIP
**Date**: mandag 1. desember 2025
**Outcome**: Approve

### Summary
The developer has successfully addressed all findings from the previous review. The frontend now provides clear visual feedback upon course creation, error handling types have been improved, and backend logging has been standardized. The implementation fully satisfies all Acceptance Criteria and follows the architectural guidelines.

### Key Findings
- No findings. Code is clean and compliant.

### Acceptance Criteria Coverage
| AC# | Description | Status | Evidence |
| :--- | :--- | :--- | :--- |
| 1.3.1 | Course Creation Input | IMPLEMENTED | `frontend/app/dashboard/page.tsx` (Modal trigger), `frontend/components/CreateCourseModal.tsx` (Input & Validation). |
| 1.3.2 | Successful Creation & Confirmation | IMPLEMENTED | `backend/app/api/routers/courses.py` (Creation), `frontend/app/dashboard/page.tsx` (Success Toast). |
| 1.3.3 | Data Persistence & RLS | IMPLEMENTED | `supabase/migrations/20251201000001_create_courses.sql` (Table & RLS), `backend/app/api/routers/courses.py` (Insert). |

**Summary**: 3 of 3 acceptance criteria fully implemented.

### Task Completion Validation
| Task | Marked As | Verified As | Evidence |
| :--- | :--- | :--- | :--- |
| Frontend: Implement Create Course UI | [x] | VERIFIED COMPLETE | Verified in `frontend/app/dashboard/page.tsx`. |
| Frontend: Integrate Course Creation API | [x] | VERIFIED COMPLETE | Verified in `frontend/lib/api.ts` and usage in Modal. |
| Backend: Implement Create Course Endpoint | [x] | VERIFIED COMPLETE | Verified in `backend/app/api/routers/courses.py`. |
| Backend: Verify RLS Policies | [x] | VERIFIED COMPLETE | Verified in migrations. |
| Testing: Backend Integration Tests | [x] | VERIFIED COMPLETE | Verified in `backend/tests/test_courses.py`. |
| Review Follow-ups (AI) | [x] | VERIFIED COMPLETE | Visual feedback, typing, and logging implemented. |

**Summary**: 6 of 6 completed tasks verified.

### Test Coverage and Gaps
- **Backend**: Strong coverage with `test_courses.py` handling success, error, and auth cases.
- **Frontend**: Manual verification implied; no automated frontend tests yet (acceptable for MVP phase, but noted as advisory).

### Architectural Alignment
- **Layering**: Strict separation maintained. Frontend -> API -> Backend -> Supabase.
- **Security**: RLS and JWT validation correctly applied.
- **Code Style**: Pydantic models and Typing used correctly.

### Security Notes
- No issues found. RLS is active.

### Best-Practices and References
- **Logging**: Replaced `print` with `logging.getLogger` (Good).
- **Error Handling**: Custom `ApiError` class improves maintainability (Good).

### Action Items
**Code Changes Required:**
- None.

**Advisory Notes:**
- Note: As the project grows, consider adding React Testing Library tests for critical UI components like `CreateCourseModal`.
