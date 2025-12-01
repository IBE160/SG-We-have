# Epic Technical Specification: User Foundation & Course Management

Date: 2025-12-01
Author: BIP
Epic ID: 1
Status: Draft

---

## Overview

This epic establishes the foundational user experience for the StudyTool application. It covers the essential capabilities for users to create an account, securely log in, and manage their academic structure. Specifically, it focuses on enabling students to register and authenticate, create courses to organize their subjects, and add lectures within those courses. This foundation is critical for the subsequent note-taking and quiz generation features, as all data must be associated with specific users and courses.

## Objectives and Scope

**In-Scope:**
*   **User Authentication:**
    *   User Registration (Username/Email + Password).
    *   User Login (Supabase Auth).
    *   User Logout.
*   **Course Management:**
    *   Create a new course.
    *   View list of all created courses.
*   **Lecture Management:**
    *   Add a new lecture to a specific course.
    *   View list of lectures within a course.

**Out-of-Scope (for this Epic):**
*   Password reset functionality.
*   Email verification (deferred for MVP).
*   Deleting or editing courses and lectures.
*   Social login providers (Google, GitHub, etc.).
*   Note-taking functionality (covered in Epic 2).
*   Quiz generation (covered in Epic 3).

## System Architecture Alignment

This epic aligns with the "Scale Adaptive Architecture" by implementing the core "User Foundation" and "Course Management" verticals.

*   **Frontend (Next.js):** Will implement `RegisterPage`, `LoginPage`, `Dashboard` (Course List), and `CourseDetail` (Lecture List) using the `app` router. It will utilize the Supabase client (`@supabase/supabase-js`) for direct authentication and for passing JWTs to the backend.
*   **Backend (FastAPI):** Will implement `courses.py` and `lectures.py` routers in the `api` module. It will use `Supabase` (PostgreSQL) for data persistence. The backend will **not** handle login/registration directly but will validate JWT tokens passed in the `Authorization` header for all course and lecture operations.
*   **Database (Supabase):** Will use the `profiles` table (linked to `auth.users`), `courses` table, and `lectures` table. RLS policies will be applied to ensure users can only access their own data.

## Detailed Design

### Services and Modules

| Module/Service | Responsibility | Owner |
| :--- | :--- | :--- |
| **Frontend: AuthContext** | Manages global user session state using Supabase `onAuthStateChange`. | Frontend |
| **Frontend: SupabaseClient** | Singleton instance for Auth and API calls. | Frontend |
| **Backend: Core/Security** | Validates JWT tokens from incoming requests. | Backend |
| **Backend: CourseService** | Handles business logic for creating and retrieving courses. | Backend |
| **Backend: LectureService** | Handles business logic for adding and retrieving lectures. | Backend |

### Data Models and Contracts

**Table: `profiles`**
*   `id`: uuid (Primary Key, references `auth.users` on delete cascade)
*   `username`: text (Unique)
*   `created_at`: timestamptz

**Table: `courses`**
*   `id`: uuid (Primary Key, Default: `gen_random_uuid()`)
*   `user_id`: uuid (Foreign Key references `profiles.id` NOT NULL)
*   `name`: text (NOT NULL)
*   `created_at`: timestamptz (Default: `now()`)

**Table: `lectures`**
*   `id`: uuid (Primary Key, Default: `gen_random_uuid()`)
*   `course_id`: uuid (Foreign Key references `courses.id` ON DELETE CASCADE NOT NULL)
*   `title`: text (NOT NULL)
*   `created_at`: timestamptz (Default: `now()`)

### APIs and Interfaces

**Authentication (Frontend SDK)**
*   `supabase.auth.signUp({ email, password })`
*   `supabase.auth.signInWithPassword({ email, password })`
*   `supabase.auth.signOut()`

**Course API (FastAPI)**
*   `POST /api/v1/courses`
    *   Request: `{ "name": "string" }`
    *   Response: `{ "data": { "id": "uuid", "name": "string", "created_at": "timestamp" } }`
*   `GET /api/v1/courses`
    *   Response: `{ "data": [ { "id": "uuid", "name": "string" } ] }`

**Lecture API (FastAPI)**
*   `POST /api/v1/courses/{course_id}/lectures`
    *   Request: `{ "title": "string" }`
    *   Response: `{ "data": { "id": "uuid", "title": "string", "course_id": "uuid" } }`
*   `GET /api/v1/courses/{course_id}/lectures`
    *   Response: `{ "data": [ { "id": "uuid", "title": "string" } ] }`

### Workflows and Sequencing

**1. User Registration Flow**
*   User enters email/password on Register Page.
*   Frontend calls `supabase.auth.signUp()`.
*   Supabase creates user in `auth.users`.
*   **Trigger:** A Supabase Database Trigger (`after insert on auth.users`) automatically inserts a row into `public.profiles`.
*   User is redirected to Login/Dashboard.

**2. Create Course Flow**
*   User clicks "Create Course" on Dashboard.
*   Frontend prompts for Course Name.
*   Frontend sends `POST /api/v1/courses` with `Authorization: Bearer <token>`.
*   Backend validates token.
*   Backend inserts into `courses` table with `user_id` from token.
*   Backend returns created course object.
*   Frontend updates list.

## Non-Functional Requirements

### Performance
*   API response time for Course/Lecture CRUD operations should be < 200ms.
*   Dashboard load time (fetching course list) should be < 500ms on 4G networks.

### Security
*   **Authentication:** All backend API endpoints (except health checks) must require a valid Supabase JWT.
*   **Authorization:** Row Level Security (RLS) must be enabled on all tables (`profiles`, `courses`, `lectures`) to strictly enforce that users can only SELECT/INSERT/UPDATE/DELETE rows where `user_id` matches their own ID.

### Reliability/Availability
*   The system relies on Supabase cloud availability.
*   Frontend should handle network errors gracefully (e.g., "Failed to create course, please try again").

### Observability
*   Backend requests should be logged with method, path, status code, and processing time.
*   Client-side errors (API failures) should be logged to the console (MVP) or telemetry service (Future).

## Dependencies and Integrations

*   **Supabase Auth:** For user management and token generation.
*   **Supabase Database:** PostgreSQL for data storage.
*   **FastAPI:** Backend framework.
*   **Next.js:** Frontend framework.
*   **Lucide React:** Icons for UI.
*   **Tailwind CSS:** Styling.

## Acceptance Criteria (Authoritative)

**AC 1.1: User Registration**
1.  User can successfully create an account with a valid email and password.
2.  System prevents registration with an already existing email.
3.  Upon success, a user profile is created in the database.

**AC 1.2: User Login & Logout**
1.  User can log in with registered credentials.
2.  System rejects invalid credentials with an appropriate error message.
3.  User can log out, clearing the local session state.
4.  Accessing protected routes (Dashboard) without a session redirects to Login.

**AC 1.3: Create New Course**
1.  Logged-in user can create a course by providing a name.
2.  The course is saved to the database associated with the user.
3.  The course appears immediately in the user's course list.

**AC 1.4: View Course List**
1.  Dashboard displays a list of all courses belonging to the logged-in user.
2.  Dashboard does **not** display courses from other users.
3.  Clicking a course navigates to the course details page.

**AC 1.5: Add Lecture to Course**
1.  User can add a lecture title within a selected course.
2.  The lecture is saved and associated with that specific course.
3.  The lecture appears in the lecture list for that course.

## Traceability Mapping

| Acceptance Criteria | Spec Section | Component / API | Test Idea |
| :--- | :--- | :--- | :--- |
| AC 1.1 | Workflows (1) | `RegisterPage`, `public.profiles` trigger | Register user, check `auth.users` and `public.profiles` tables. |
| AC 1.2 | APIs (Auth) | `LoginPage`, `AuthContext` | Login with valid/invalid creds; try accessing `/dashboard` while logged out. |
| AC 1.3 | APIs (Course) | `POST /api/v1/courses` | Create course, verify response ID, check DB for `user_id` match. |
| AC 1.4 | APIs (Course), Security | `GET /api/v1/courses` | Create courses as User A and User B; verify User A only sees A's courses. |
| AC 1.5 | APIs (Lecture) | `POST /api/v1/courses/{id}/lectures` | Create lecture, verify `course_id` foreign key linkage. |

## Risks, Assumptions, Open Questions

*   **Assumption:** We are using Supabase's built-in Auth UI or building custom UI with their SDK? -> **Decision:** Custom UI (`RegisterPage`, `LoginPage`) using the SDK functions for better control over styling (Tailwind).
*   **Risk:** Handling the `profiles` table creation sync. If the DB trigger fails, the user exists in Auth but not in our app logic. **Mitigation:** Ensure the trigger is robust and tested; consider a "create profile if missing" check on login as backup.
*   **Question:** Do we need email confirmation enabled for MVP? -> **Decision:** No, disable "Confirm Email" in Supabase settings for smoother MVP onboarding.

## Test Strategy Summary

*   **Unit Tests:** Test Pydantic models and FastAPI route logic (mocking DB calls).
*   **Integration Tests:** Test API endpoints against a local Supabase instance (or test project) to verify RLS and DB constraints.
*   **Manual Tests:** Verify full "New User" flow: Register -> Login -> Create Course -> Add Lecture.

## Post-Review Follow-ups

-   **From Story 1.3: Create New Course (Changes Requested)**
    -   [ ] Implement visual confirmation for course creation (e.g., refresh course list, success toast) in `frontend/app/dashboard/page.tsx` within the `handleCourseCreated` function. (AC 1.3.2)
    -   [ ] Refine frontend error typing to use a more specific error interface instead of `any` in `frontend/components/CreateCourseModal.tsx` and `frontend/lib/api.ts`.
    -   [ ] Replace `print()` statement with a proper logging framework in `backend/app/api/routers/courses.py`.