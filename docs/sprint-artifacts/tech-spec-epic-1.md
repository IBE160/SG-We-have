# Epic Technical Specification: User Foundation & Course Management

**Date:** mandag 1. desember 2025
**Author:** BIP (SM Agent)
**Epic ID:** 1
**Status:** Draft

---

## Overview

Epic 1 establishes the core user journey for the "AI-Powered Student Helper". It transitions the application from a skeleton to a functional multi-user system. This epic focuses on implementing secure User Authentication (Sign Up, Login, Logout) using Supabase Auth and building the fundamental data structures for Course and Lecture management. By the end of this epic, a user will be able to log in, create courses, and organize lectures within those courses, laying the groundwork for note-taking and quiz generation in subsequent epics.

## Objectives and Scope

**In Scope:**
*   **Database Schema:** Designing and applying the Supabase PostgreSQL schema for `profiles`, `courses`, and `lectures`.
*   **Row Level Security (RLS):** Implementing strict RLS policies to ensure users can only access their own data.
*   **Authentication UI:** Implementing Login and Registration pages in Next.js.
*   **Authentication Logic:** Integrating Supabase Auth (SSR/Client) for session management and route protection.
*   **Backend API:** Creating FastAPI endpoints for Course and Lecture CRUD operations, secured by JWT validation.
*   **Frontend UI:** Building the User Dashboard (Course List) and Course Details View (Lecture List).
*   **Frontend State:** Managing server state (Courses/Lectures) using React Query.

**Out of Scope:**
*   Note-taking capabilities (Rich Text Editor) - *Epic 2*.
*   Quiz generation or taking - *Epic 3 & 4*.
*   User profile image uploading (basic placeholder or URL is fine).
*   Social features or sharing.

## System Architecture Alignment

This epic implements the **User Foundation** and **Course Management** subsystems defined in the [Architecture Document](../architecture.md).

*   **Pattern Alignment:**
    *   **Auth:** Frontend talks directly to Supabase Auth. Backend validates JWTs.
    *   **Data:** Frontend calls Backend APIs. Backend queries Supabase DB.
    *   **Security:** "Zero Trust" between Frontend and Backend; Backend verifies Identity via Supabase.

## Detailed Design

### Services and Modules

| Module/Service | Responsibility | Key Technologies |
| :--- | :--- | :--- |
| **Supabase Auth** | User Identity, JWT issuance | GoTrue (Supabase) |
| **PostgreSQL** | Data Storage, RLS | Supabase DB |
| **Frontend / Auth** | Login/Register forms, Session Context | Next.js Middleware, Supabase SSR |
| **Frontend / Dashboard** | View Courses, Create Course Modal | React, React Query, Tailwind |
| **Backend / Auth** | Dependency to validate Bearer Token | FastAPI Depends, PyJWT/Supabase |
| **Backend / Courses** | CRUD logic for Courses | FastAPI Router, Pydantic |
| **Backend / Lectures** | CRUD logic for Lectures | FastAPI Router, Pydantic |

### Data Models (Database Schema)

All tables must have `created_at` (timestamptz) and `updated_at` (timestamptz).

1.  **`profiles`** (Extends `auth.users`)
    *   `id`: UUID (PK, references `auth.users.id` ON DELETE CASCADE)
    *   `full_name`: Text (nullable)
    *   `email`: Text (Read-only from auth)

2.  **`courses`**
    *   `id`: UUID (PK, default `gen_random_uuid()`)
    *   `user_id`: UUID (FK `profiles.id`, NOT NULL)
    *   `title`: Text (NOT NULL)
    *   `description`: Text (nullable)

3.  **`lectures`**
    *   `id`: UUID (PK, default `gen_random_uuid()`)
    *   `course_id`: UUID (FK `courses.id` ON DELETE CASCADE, NOT NULL)
    *   `title`: Text (NOT NULL)
    *   `description`: Text (nullable) - *Optional context for the lecture*

### Security: Row Level Security (RLS) Policies

*   **`profiles`**:
    *   `SELECT`: Users can see their own profile. `auth.uid() = id`.
    *   `UPDATE`: Users can update their own profile.
*   **`courses`**:
    *   `ALL`: Users can perform all actions on courses where `auth.uid() = user_id`.
*   **`lectures`**:
    *   `ALL`: Users can perform all actions on lectures where `course_id` belongs to a course they own. (Requires a join or helper function check, or denormalizing `user_id` to lectures for simpler RLS - *Decision: Join or `EXISTS` clause preferred for normalization*).

### APIs and Interfaces (FastAPI)

**Base URL:** `/api/v1`

1.  **Auth Dependency:** `get_current_user` (Validates `Authorization: Bearer <token>`)

2.  **Courses**
    *   `GET /courses/` - List all courses for current user.
    *   `POST /courses/` - Create a new course. Body: `CourseCreate`.
    *   `GET /courses/{course_id}` - Get details of a specific course.
    *   `DELETE /courses/{course_id}` - Delete a course.

3.  **Lectures**
    *   `GET /courses/{course_id}/lectures/` - List lectures for a course.
    *   `POST /courses/{course_id}/lectures/` - Create a lecture. Body: `LectureCreate`.
    *   `DELETE /lectures/{lecture_id}` - Delete a lecture.

### Frontend Routes (Next.js)

*   `/login` - Public. Login form.
*   `/register` - Public. Registration form.
*   `/` - Landing page (redirects to /dashboard if logged in).
*   `/dashboard` - **Protected**. Lists courses.
*   `/courses/[courseId]` - **Protected**. Lists lectures, "Add Lecture" button.

## Non-Functional Requirements

*   **Usability:** Login/Register must provide clear error messages (e.g., "Invalid password").
*   **Performance:** Dashboard loading state must be handled gracefully (skeleton loaders).
*   **Security:** No raw SQL in backend. Use Supabase Client (Python) or ORM-like interaction to prevent injection. RLS is the final barrier.

## Acceptance Criteria (Authoritative)

1.  **User Registration:**
    *   User can sign up with email/password.
    *   User is redirected to Dashboard after signup.
    *   `profiles` row is created (via trigger or manual call).
2.  **User Login:**
    *   User can log in.
    *   Session persists on refresh.
    *   User can log out.
3.  **Course Management:**
    *   User sees *only* their courses on Dashboard.
    *   User can create a course (Name required).
    *   User can click a course to view details.
4.  **Lecture Management:**
    *   User can add a lecture to a course.
    *   Lecture appears in the list immediately (optimistic update or refetch).

## Traceability Mapping

| User Story | Component | Test Strategy |
| :--- | :--- | :--- |
| 1.1 Registration | FE/Auth | Manual: Sign up new user, check DB `auth.users`. |
| 1.2 Login/Logout | FE/Auth | Manual: Login, refresh page (check session), Logout. |
| 1.3 Create Course | BE/API | Integration: POST /courses/ with token. Check DB. |
| 1.4 View Courses | FE/Dash | Manual: Verify list matches DB. |
| 1.5 Add Lecture | BE/API | Integration: POST /lectures/. Verify linkage to Course. |

## Risks, Assumptions, Open Questions

*   **Risk:** Supabase Auth Cookie handling in Next.js App Router can be tricky with Server Actions/Middleware. *Mitigation: Follow Supabase official Next.js guide strictly.*
*   **Decision:** We will use Supabase Python Client (`supabase`) in the backend, which uses PostgREST under the hood. We will NOT use a separate SQL driver (like `psycopg2`) or ORM (SQLAlchemy) to keep the stack simple and aligned with Supabase primitives.

## Test Strategy Summary

*   **Unit Tests:** Backend Pydantic models and simple service logic.
*   **Integration Tests:** Backend API tests using `TestClient` and a mocked Supabase client (or separate test project).
*   **Manual Verification:** Critical for Auth flows (cookies, redirects).
