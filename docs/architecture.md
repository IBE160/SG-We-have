# Decision Architecture

## Executive Summary

This document outlines the architectural decisions for the `ibe160` application, a note-taking and AI quiz generation platform. It establishes a modern, type-safe, and scalable full-stack architecture using Next.js, tRPC, Supabase, and the Google Gemini API, designed for consistent implementation by AI agents.

## Project Initialization

First implementation story should execute:
```bash
npx create-next-app@latest ibe160 --typescript --tailwind --eslint --app
```

This establishes the base architecture with these decisions:
-   **Framework:** Next.js
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **Linting:** ESLint
-   **Routing:** App Router

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |
| Frontend Framework | Next.js | 16.0.1 | All | Standard, modern web stack |
| Language | TypeScript | 5.x | All | Type safety, developer experience |
| Styling | Tailwind CSS | 3.x | All | Utility-first CSS, rapid UI development |
| Linting | ESLint | 8.x | All | Code quality and consistency |
| Routing | App Router | N/A | All | Modern Next.js routing paradigm |
| Data Persistence | Supabase (PostgreSQL) | 2.78.0 | All | All-in-one solution, speeds up development |
| API Pattern | tRPC | 11.7.1 | All | Type-safe, integrates with Next.js/TypeScript |
| Authentication System | Supabase Auth | 2.78.0 | Epic 1 | Integrates with Supabase, developer-friendly |
| AI Integration Strategy | Google Gemini API | v1 | Epic 3 | Powerful, versatile for quiz generation |
| Deployment Strategy | Vercel | N/A | All | Best integration with Next.js, ease of deployment |
| Rich Text Editor | Tiptap | 3.10.2 | Epic 2 | Flexible, React-compatible, customizable |
| Error Handling | Sentry | 10.23.0 | All | Centralized logging, detailed reports |
| Logging Approach | Structured Logging (Pino) | 10.1.0 | All | Machine-readable, searchable logs |
| Testing Strategy | Unit & Integration (Vitest, React Testing Library) | 4.0.7 | All | Balanced coverage, modern tools |
| Date/Time Handling | Store UTC, format `dd/mm/yyyy` with `date-fns`/`Luxon` | 3.x | All | Best practice, user-friendly display |
| API Response Format | Standard HTTP Status Codes with JSON Payloads | N/A | All | Standard, clear communication |
| Server State Management | TanStack Query (React Query) | 5.90.7 | All | Caching, background refetching, synchronization |
| Client State Management | Zustand | 5.0.8 | All | Lightweight, flexible UI state management |
| ORM / Schema | Prisma | 6.19.0 | All | Schema management, type generation |


## Project Structure

```
ibe160/
├── .vscode/                  # VSCode configuration (launch.json, settings.json, tasks.json)
├── public/                   # Static assets (images, fonts, etc.)
├── src/                      # Main application source code
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/           # Grouping for authentication-related routes/components (e.g., login, signup, password reset)
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── ...
│   │   ├── (dashboard)/      # Grouping for authenticated user dashboard and features
│   │   │   ├── courses/      # Pages and components for course management
│   │   │   ├── lectures/     # Pages and components for lecture management
│   │   │   ├── notes/        # Pages and components for note-taking interface
│   │   │   ├── quizzes/      # Pages and components for quiz generation and interactive quiz
│   │   │   └── page.tsx      # Dashboard landing page
│   │   ├── api/              # Next.js API routes (specifically for tRPC endpoint)
│   │   │   └── trpc/[trpc].ts # tRPC API endpoint
│   │   └── layout.tsx        # Root layout for the application
│   ├── components/           # Reusable UI components (e.g., buttons, cards, forms)
│   │   └── rich-text-editor/ # Tiptap editor component and related logic
│   ├── lib/                  # Utility functions, helpers, client initializations
│   │   ├── supabase/         # Supabase client setup, auth helpers, database types
│   │   ├── gemini/           # Google Gemini API client and related functions
│   │   ├── trpc/             # tRPC client and server setup, router definitions
│   │   ├── utils/            # General utility functions (e.g., date formatting, validation)
│   │   └── hooks/            # Custom React hooks
│   ├── styles/               # Tailwind CSS configuration and global styles
│   ├── types/                # TypeScript global type definitions and interfaces
│   └── app.tsx               # Root application component (if not using app/layout.tsx directly)
├── tests/                    # Unit and Integration tests
│   ├── unit/                 # Unit tests for individual functions/components
│   ├── integration/          # Integration tests for component interactions and API calls
│   └── setup.ts              # Test setup file (e.g., for Vitest)
├── prisma/                   # Prisma schema and migrations (for Supabase database)
├── .env                      # Environment variables (local and for Vercel)
├── .eslintrc.json            # ESLint configuration
├── next.config.js            # Next.js configuration
├── package.json              # Project dependencies and scripts
├── postcss.config.js         # PostCSS configuration (for Tailwind)
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── vitest.config.ts          # Vitest configuration
├── README.md                 # Project README
├── architecture.md           # This architecture document
└── ...                       # Other configuration files (e.g., .gitignore, .prettierrc)
```

## Epic to Architecture Mapping

*   **Epic 1: User Foundation & Course Management**
    *   **Architectural Boundaries:** `src/app/(auth)/`, `src/app/(dashboard)/courses/`, `src/app/(dashboard)/lectures/`, `src/lib/supabase/` (for auth and database interactions), `src/lib/trpc/` (for API calls related to user, course, and lecture data).
*   **Epic 2: Core Note-Taking Experience**
    *   **Architectural Boundaries:** `src/app/(dashboard)/notes/`, `src/components/rich-text-editor/` (Tiptap integration), `src/lib/trpc/` (for saving/loading notes via API).
*   **Epic 3: AI-Powered Quiz Generation**
    *   **Architectural Boundaries:** `src/app/(dashboard)/quizzes/` (UI for quiz config), `src/lib/gemini/` (Google Gemini API client), `src/lib/trpc/` (for triggering AI generation and saving quizzes to DB).
*   **Epic 4: Interactive Quiz Experience**
    *   **Architectural Boundaries:** `src/app/(dashboard)/quizzes/` (UI for quiz taking and results), `src/lib/trpc/` (for fetching quiz questions, submitting answers, and updating scores).

## Technology Stack Details

### Core Technologies

*   **Frontend Framework:** Next.js (16.0.1)
*   **Backend:** Next.js API Routes / tRPC (11.7.1)
*   **Language:** TypeScript (5.x)
*   **Styling:** Tailwind CSS (3.x)
*   **Database:** Supabase (PostgreSQL) (Client: 2.78.0)
*   **Authentication:** Supabase Auth (Client: 2.78.0)
*   **AI Integration:** Google Gemini API (v1)
*   **Deployment:** Vercel
*   **Rich Text Editor:** Tiptap (3.10.2)
*   **Error Handling:** Sentry (10.23.0)
*   **Logging:** Pino (10.1.0)
*   **Testing:** Vitest (4.0.7), React Testing Library
*   **State Management:** TanStack Query (5.90.7), Zustand (5.0.8)
*   **ORM / Schema:** Prisma (6.19.0)

### Integration Points

*   **Frontend (Next.js) <-> Backend (tRPC):** All client-server communication for data fetching, mutations, and business logic execution will be handled via type-safe tRPC procedures defined in `src/lib/trpc/`.
*   **Backend (tRPC) <-> Supabase:** tRPC procedures will interact with the Supabase client (`src/lib/supabase/`) for all database operations (PostgreSQL) and leverage Supabase Auth for user management.
*   **Backend (tRPC) <-> Google Gemini API:** tRPC procedures responsible for AI quiz generation will make calls to the Google Gemini API client (`src/lib/gemini/`) to interact with the AI models.
*   **Frontend (Next.js) <-> Sentry:** The Sentry SDK will be initialized on the frontend to capture and report client-side errors.
*   **Backend (tRPC) <-> Sentry/Pino:** The Sentry SDK and Pino logger will be integrated into the tRPC server-side procedures to capture errors and structured logs from the backend.

## Novel Pattern Designs

No novel architectural patterns were identified. The application leverages modern, established patterns for its core functionalities.

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

### Naming Conventions

*   **Database Tables:** Plural, snake_case (e.g., `users`, `courses`, `lectures`).
*   **Database Columns:** Snake_case (e.g., `user_id`, `created_at`).
*   **API Endpoints (tRPC procedures):** CamelCase (e.g., `getUsers`, `createCourse`).

### Code Organization

*   **Features-first (Domain-driven):** Code will be organized by feature or domain within the `src/app` and `src/lib/trpc` directories (e.g., `src/app/(dashboard)/courses/`, `src/lib/trpc/routers/course.ts`).
*   **Co-location of Tests:** Test files will be placed directly alongside the code they test (e.g., `component.tsx` and `component.test.tsx` in the same folder).

### Data Formatting

*   **API Payloads:** All API request and response payloads will use JSON.
*   **Dates in JSON:** Dates will be represented as ISO 8601 strings (UTC) in JSON payloads.

### Communication Patterns

*   **Server State Management:** TanStack Query (React Query) will be used for managing data fetched from the server (e.g., caching, background refetching).
*   **Client-side UI State Management:** Zustand will be used for managing local UI state (e.g., modal open/close, form values).

### Lifecycle Patterns

*   **Loading States:**
    *   **UI Feedback:** When data is being fetched, the UI should display a clear loading indicator (e.g., a skeleton screen, a spinner).
    *   **State Management:** TanStack Query's `isLoading` and `isFetching` flags will be used to control the display of these loading indicators.
    *   **Button States:** Buttons that trigger mutations (e.g., "Save", "Generate Quiz") should be disabled and show a loading spinner to prevent duplicate submissions.
*   **Error Recovery:**
    *   **UI Feedback:** When an API call fails, the UI should display a user-friendly error message (e.g., using a toast notification or an inline error message). The message should be concise and, if possible, suggest a course of action (e.g., "Could not save notes. Please try again.").
    *   **State Management:** TanStack Query's `isError` and `error` properties will be used to display these error states.
    *   **Error Boundaries:** React's Error Boundaries will be used to catch rendering errors in component trees, log them to Sentry, and display a fallback UI.
*   **Retry Logic:**
    *   **Queries:** TanStack Query provides automatic retry logic for failed queries out of the box (defaults to 3 retries with exponential backoff). This will be the default behavior.
    *   **Mutations:** Mutations (e.g., creating a course, saving a note) will generally not be retried automatically to prevent creating duplicate data. The user will be responsible for manually retrying the action after an error.

## Consistency Rules

### Naming Conventions

*   **Database Tables:** Plural, snake_case (e.g., `users`, `courses`).
*   **Database Columns:** Snake_case (e.g., `user_id`, `created_at`).
*   **API Endpoints (tRPC procedures):** CamelCase (e.g., `getUsers`, `createCourse`).
*   **Frontend Components:** PascalCase (e.g., `UserCard`, `QuizGenerator`).
*   **Frontend Functions/Variables:** camelCase (e.g., `handleLogin`, `userName`).

### Code Organization

*   **Next.js App Router:** Utilize the `app` directory for routing, layouts, and pages.
*   **Feature-based Grouping:** Group related files (components, hooks, utilities, tRPC procedures) by feature or domain.
*   **Shared Components:** Reusable UI components will reside in `src/components/`.
*   **Utilities/Helpers:** General utility functions and client initializations will be in `src/lib/`.
*   **Type Definitions:** Global types and interfaces will be in `src/types/`.

### Error Handling

*   **Centralized Error Logging:** Sentry will be integrated for both frontend and backend error capturing, reporting, and analysis.
*   **User Feedback:** Frontend will display user-friendly error messages for common scenarios.
*   **API Error Format:** Backend (tRPC) will return errors with standard HTTP status codes and a consistent JSON body: `{ message: "...", code: "...", details: [...] }`.

### Logging Strategy

*   **Structured Logging:** Pino will be used for structured logging on the backend (tRPC server), outputting logs in JSON format for easy analysis.
*   **Log Levels:** Standard log levels (e.g., `info`, `warn`, `error`, `debug`) will be used consistently.

## Data Architecture

*   **Database System:** PostgreSQL, managed by Supabase.
*   **ORM/Schema Management:** Prisma will be used for defining the database schema, generating types, and managing migrations.
*   **Data Models:** Models will reflect the entities from the PRD (Users, Courses, Lectures, Notes, Quizzes, Questions, Answers).
*   **Relationships:** Relationships between models (e.g., User has many Courses, Course has many Lectures) will be clearly defined in the Prisma schema.

## API Contracts

*   **API Framework:** tRPC, providing end-to-end type safety between frontend and backend.
*   **Procedure Definitions:** tRPC procedures will be defined in `src/lib/trpc/routers/`, with clear input and output types.
*   **Error Handling:** tRPC will leverage the defined API error format, propagating errors with appropriate HTTP status codes.

## Security Architecture

*   **Authentication:** Supabase Auth will handle user registration, login, session management, and potentially social logins.
*   **Authorization:** Row-Level Security (RLS) in PostgreSQL (via Supabase) will be utilized to enforce data access policies. Backend tRPC procedures will also implement authorization checks.
*   **Environment Variables:** Sensitive information (API keys, database credentials) will be stored securely using environment variables (`.env` file for local, Vercel environment variables for deployment).
*   **Secure Communication:** All communication will be over HTTPS.

## Performance Considerations

*   **Next.js Optimizations:** Leverage Next.js features like Image Optimization, Font Optimization, Code Splitting, and Server-Side Rendering (SSR) or Static Site Generation (SSG) where appropriate.
*   **TanStack Query Caching:** Utilize TanStack Query's caching mechanisms to reduce unnecessary API calls and improve perceived performance.
*   **Database Indexing:** Proper database indexing will be applied to frequently queried columns to optimize query performance.
*   **Vercel Edge Network:** Vercel's global edge network will serve static assets and API responses closer to users, reducing latency.

## Development Environment

### Prerequisites

*   Node.js (LTS version)
*   npm or yarn or pnpm (package manager)
*   Git
*   VS Code (recommended IDE)
*   Supabase account (for database and auth)
*   Google Cloud Project with Gemini API enabled (for AI)

### Setup Commands

```bash
# 1. Clone the repository
git clone <repository-url>
cd ibe160

# 2. Install dependencies
npm install # or yarn install or pnpm install

# 3. Set up environment variables
# Create a .env.local file based on .env.example (to be provided)
# and fill in your Supabase and Gemini API credentials.

# 4. Initialize Supabase (if not already done via Supabase CLI/Dashboard)
# Follow Supabase documentation to link your local project to your Supabase project.

# 5. Generate Prisma client (after setting up Supabase connection string in .env.local)
npx prisma generate

# 6. Run the development server
npm run dev # or yarn dev or pnpm dev
```

## Architecture Decision Records (ADRs)

This document serves as the primary Architecture Decision Record, summarizing key architectural choices and their rationale:

*   **Decision:** Use Next.js, TypeScript, Tailwind CSS for frontend.
    *   **Rationale:** Modern, performant, and developer-friendly stack.
*   **Decision:** Use Supabase (PostgreSQL) for data persistence and Supabase Auth for authentication.
    *   **Rationale:** All-in-one solution, simplifies development, integrates seamlessly.
*   **Decision:** Use tRPC for API communication.
    *   **Rationale:** Provides end-to-end type safety, excellent integration with Next.js/TypeScript.
*   **Decision:** Integrate Google Gemini API for AI quiz generation.
    *   **Rationale:** Powerful and versatile AI model for core application functionality.
*   **Decision:** Deploy on Vercel.
    *   **Rationale:** Optimal for Next.js applications, ease of deployment, automatic scaling.
*   **Decision:** Use Tiptap for rich text editing.
    *   **Rationale:** Flexible, customizable, React-compatible.
*   **Decision:** Implement Centralized Error Logging with Sentry and Structured Logging with Pino.
    *   **Rationale:** Improves debugging, monitoring, and application reliability.
*   **Decision:** Adopt Unit and Integration Testing with Vitest and React Testing Library.
    *   **Rationale:** Balanced testing approach for quality assurance.
*   **Decision:** Standardize Date/Time handling (UTC storage, `dd/mm/yyyy` display) and API Response Format (Standard HTTP Status Codes, JSON, ISO 8601 dates).
    *   **Rationale:** Ensures consistency, predictability, and reduces bugs.

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: torsdag 6. november 2025_
_For: BIP_
