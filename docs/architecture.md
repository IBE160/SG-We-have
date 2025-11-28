# Scale Adaptive Architecture: AI-Powered Student Helper

**Date:** 2025-11-28
**Project:** ibe160
**Version:** 1.1
**Status:** Approved

## 1. Executive Summary

This architecture defines a modern, monolithic web application designed for the "AI-Powered Student Helper". It leverages **Next.js** for a responsive frontend and **FastAPI (Python)** for a high-performance backend capable of seamless AI integration. Data persistence and authentication are offloaded to **Supabase (Cloud)**. **Google Gemini Pro 2.5** provides the core intelligence, orchestrated via the **Pydantic AI** framework for type-safe, structured interactions. The system is designed for simplicity and developer velocity, utilizing a local development environment without complex containerization for the MVP phase.

## 2. Project Initialization & Structure

The project follows a **Monorepo** structure to keep frontend and backend tightly coupled in context but loosely coupled in code.

### Source Tree
```
C:\IBE160\projects\SG-We-have\
├── docs/                   # Project documentation
├── frontend/               # Next.js application
│   ├── app/                # App Router (pages & layouts)
│   ├── components/         # Shared UI components (shadcn/ui)
│   ├── lib/                # API clients, utils, hooks
│   ├── public/             # Static assets
│   ├── package.json
│   └── .env.local          # Frontend env vars (Supabase URL, Anon Key)
└── backend/                # FastAPI application
    ├── app/
    │   ├── main.py         # App entry point
    │   ├── api/            # Route handlers (endpoints)
    │   ├── core/           # Config, DB connection, Security
    │   ├── services/       # Business logic (Quiz Gen)
    │   ├── agents/         # Pydantic AI Agents
    │   └── models/         # Pydantic schemas & DB models
    ├── pyproject.toml      # Dependencies (managed by uv)
    └── .env                # Backend env vars (DB URL, API Keys)
```

### Initialization Commands (Implementation Step 1)
Agents must use these exact commands to scaffold the project:

```bash
# Backend Setup
mkdir backend
cd backend
uv init
uv add fastapi uvicorn supabase python-dotenv pydantic pydantic-ai google-generativeai

# Frontend Setup
cd ..
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
cd frontend
npm install @supabase/supabase-js @tanstack/react-query zustand lucide-react clsx tailwind-merge
```

---

## 3. Decision Summary

| Category | Decision | Version | Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **Next.js** | 15.x | React standard, App Router, robust ecosystem. |
| **Backend Framework** | **FastAPI** | 0.110+ | High performance, native Python (for AI), easy async. |
| **AI Framework** | **Pydantic AI** | Latest | Type-safe, structured output generation, seamless FastAPI integration. |
| **Language (FE)** | **TypeScript** | 5.x | Type safety, developer experience. |
| **Language (BE)** | **Python** | 3.12+ | AI ecosystem dominance (Gemini SDK), readability. |
| **Database** | **Supabase (PostgreSQL)** | Cloud | Remote managed DB, powerful auth, vector ready. |
| **Authentication** | **Supabase Auth** | Cloud | Secure, ready-to-use auth flows, JWT handling. |
| **State Management** | **React Query** | 5.x | Best for server state (API data). |
| **Client State** | **Zustand** | 4.x | Simple global state (if needed). |
| **Styling** | **Tailwind CSS** | 3.4+ | Rapid UI development, consistent design system. |
| **Package Manager** | **uv** (BE) / **npm** (FE) | Latest | `uv` is significantly faster for Python dependency resolution. |
| **AI Model** | **Gemini Pro 2.5** | Flash | Fast, cost-effective, large context window for notes. |
| **Deployment** | **Local** (MVP) | N/A | Focus on feature delivery first. |

---

## 4. Architectural Patterns & Consistency

### 4.1. Data Flow Pattern (Frontend Auth + Backend Data)
To ensure security and cleaner logic, we strictly separate Auth flows from Data flows.

1.  **Authentication**:
    *   **Frontend** talks *directly* to Supabase Auth to login/signup.
    *   Supabase returns a **JWT (Access Token)**.
    *   Frontend stores this token (handled by Supabase SDK).

2.  **Data Access**:
    *   **Frontend** calls **FastAPI Backend** for ALL data (Notes, Courses, Quizzes).
    *   **Frontend** MUST include the `Authorization: Bearer <token>` header in requests.
    *   **Backend** Middleware validates the JWT using Supabase Secret.
    *   **Backend** queries Supabase DB or calls AI.
    *   **Backend** returns JSON data to Frontend.
    *   **Constraint**: Frontend *never* queries the Database directly.

### 4.2. Naming Conventions
*   **Database Tables**: `snake_case` (e.g., `user_profiles`, `quiz_questions`)
*   **API Endpoints**: `kebab-case` (e.g., `/api/v1/generate-quiz`)
*   **Python Variables/Files**: `snake_case` (e.g., `quiz_service.py`, `user_id`)
*   **TS/React Components**: `PascalCase` (e.g., `QuizCard.tsx`)
*   **TS Variables**: `camelCase` (e.g., `quizData`, `isLoading`)

### 4.3. Prompt Management (Database Driven)
Prompts are **not** hardcoded in files. They are stored in Supabase.
*   **Table**: `system_prompts`
    *   `key` (primary key, string): e.g., "quiz_generator_v1"
    *   `template` (text): The prompt text with placeholders (e.g., `{{notes}}`).
*   **Flow**:
    1.  Service fetches prompt from DB by key.
    2.  Service injects variables (notes content).
    3.  Service calls Pydantic AI Agent with the specific prompt.

### 4.4. Quiz Generation Pattern (Synchronous + Retry)
*   **Flow**: Frontend `POST /api/quiz/generate` -> Backend (Calls Pydantic AI Agent) -> Waits -> Returns Quiz.
*   **Timeout Handling**: Gemini Flash is fast, but network issues happen.
*   **Frontend**: React Query configured with `retry: 3` and `retryDelay: 1000` for this specific mutation.
*   **No Polling**: Simplified flow for MVP.

---

## 5. API Contract & Type Sharing

Since we are using **Manual Sync** (no auto-generator), agents must follow this strict contract:

*   **Response Format**:
    ```json
    {
      "data": { ... },    // The actual resource
      "meta": { ... }     // Pagination, etc. (optional)
    }
    ```
*   **Error Format**:
    ```json
    {
      "detail": "Human readable error message",
      "code": "ERROR_CODE" // Optional machine code
    }
    ```
*   **Type Discipline**: When an agent modifies a Pydantic model in Backend (`schemas.py`), they **MUST** immediately update the corresponding TypeScript interface in Frontend (`types/api.ts`).

---

## 6. Epic to Architecture Mapping

| Epic | Frontend Component | Backend Service | DB Table(s) |
| :--- | :--- | :--- | :--- |
| **Epic 0: Setup** | Scaffold, Tailwind | FastAPI Setup, Env | N/A |
| **Epic 1: User Foundation** | `LoginPage`, `CourseList` | `auth.py`, `courses.py` | `profiles`, `courses` |
| **Epic 2: Note Taking** | `Editor` (TipTap/Quill), `NoteView` | `lectures.py`, `notes.py` | `lectures`, `notes` |
| **Epic 3: AI Quiz Gen** | `QuizConfigModal` | `quiz_service.py`, `quiz_agent.py` | `system_prompts` |
| **Epic 4: Quiz Experience** | `QuizPlayer`, `ScoreCard` | `quiz_submission.py` | `quizzes`, `questions`, `submissions` |

---

## 7. Security & Environment

*   **Environment Variables**:
    *   `frontend/.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
    *   `backend/.env`: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (for admin tasks/prompts), `SUPABASE_JWT_SECRET` (for token validation), `GEMINI_API_KEY`.
*   **RLS (Row Level Security)**: Even though backend is trusted, we should enable RLS on Supabase tables to prevent accidental public access, and use the Service Role key carefully in the backend only when necessary.

---

## 8. AI Agent Implementation Guidelines

1.  **Check `architecture.md` first**. If you are unsure where a file goes, look at the Source Tree section.
2.  **Respect the Monorepo**. Do not mix frontend and backend dependencies.
3.  **Manual Type Sync**. If you change an API return type, you **must** update the frontend interface.
4.  **Pydantic AI**. Use `pydantic-ai` for all LLM interactions. Define clear Pydantic models for outputs.
5.  **Prompts in DB**. Do not write long prompt strings in Python files. Create a migration/seed script to insert them into the `system_prompts` table.
6.  **Keep it Local**. Assume `npm run dev` and `uvicorn` are how the app runs. Do not add Dockerfiles unless requested.