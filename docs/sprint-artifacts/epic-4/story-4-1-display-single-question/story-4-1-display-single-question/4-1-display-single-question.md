# Story 4.1: Display Single Question

Status: done



## Story



As a Student,

I want to see one quiz question at a time,

so that I can focus on answering it without distraction.



## Acceptance Criteria



1.  Quiz interface displays one question and its answer options clearly. (FR011)

2.  Navigation controls (e.g., "Next Question") are present.



## Tasks / Subtasks



- [x] **Frontend - Component Creation:** Create `QuizQuestionDisplay` component to render a single question and its options. (AC: #1)

- [x] **Frontend - API Integration:** Implement client-side logic to fetch the first question from `GET /api/v1/quiz/{quiz_id}/start`. (AC: #1)

- [x] **Frontend - Navigation:** Implement "Next Question" button and its logic for navigating to the next question (initially, just to a placeholder). (AC: #2)

- [x] **Backend - API Endpoint:** Implement `GET /api/v1/quiz/{quiz_id}/start` to fetch the initial quiz question data. (AC: #1)

- [x] **Backend - Data Model:** Create Pydantic model for the quiz question display data. (AC: #1)

- [x] **Test - Frontend:** Write unit tests for `QuizQuestionDisplay` component rendering. (AC: #1)

- [x] **Test - Frontend:** Write integration tests for API call and rendering. (AC: #1, #2)

- [x] **Test - Backend:** Write unit tests for the `GET /api/v1/quiz/{quiz_id}/start` endpoint. (AC: #1)



### Review Follow-ups (AI)

- [ ] [AI-Review][Low] Note: `backend/app/services/quiz_submission.py`: Fetching all questions to get the count might be inefficient for large quizzes. (AC #1)

- [ ] [AI-Review][Low] Note: `backend/app/services/quiz_submission.py`: Questions are fetched without explicit `ORDER BY`. (AC #1)



## Dev Notes



### Learnings from Previous Story

**From Story 3.5: AI Fact-Checking for Accuracy (Status: done)**



-   **New Services/Patterns Created**: `search_web` tool in `backend/app/agents/quiz_agent.py` for external information retrieval.

-   **Architectural Decisions**: Integration of external tool (Google Search) for fact-checking via `pydantic-ai` agent tooling.

-   **Technical Debt Addressed**: Refactoring of `backend/app/services/quiz_service.py` for proper logging and sanitized error responses.

-   **Testing Pattern**: Established pattern for mocking `httpx.AsyncClient` and `os.environ` for testing `pydantic-ai` tools.

-   **Files Modified**:

    -   `backend/app/agents/quiz_agent.py` (Added `search_web` tool, updated system prompt)

    -   `backend/app/services/quiz_service.py` (Refactored logging and error handling)

    -   `backend/tests/test_quiz_agent.py` (Added tests for `search_web`)

-   **Warnings/Recommendations**: Monitor Google Search API usage limits in production. Performance check (AC#4) was `UNVERIFIED` for Story 3.5.



### Relevant Architecture Patterns and Constraints

-   **Data Flow Pattern (Frontend Auth + Backend Data):** Frontend makes API calls to FastAPI Backend for all data. Frontend MUST include JWT. Backend validates JWT. (Source: `docs/architecture.md#4.1.-Data-Flow-Pattern-(Frontend-Auth-+-Backend-Data)`)

-   **API Contract & Type Sharing:** Adhere to defined response/error formats. When Pydantic models change in Backend, update corresponding TypeScript interfaces in Frontend. (Source: `docs/architecture.md#5.-API-Contract-&-Type-Sharing`)

-   **Naming Conventions:** Follow `kebab-case` for API endpoints, `snake_case` for Python, `PascalCase` for React components. (Source: `docs/architecture.md#4.2.-Naming-Conventions`)



### Project Structure Notes

- Frontend components will be in `frontend/components/` or `frontend/app/quiz/`.

- Backend API endpoints will be in `backend/app/api/quiz.py`.

- Backend service logic will be in `backend/app/services/quiz_submission.py`.

- Backend Pydantic models will be in `backend/app/models/quiz_submission.py`.



### Source Tree Components to Touch

-   `frontend/app/quiz/` (New directory/files for quiz display)

-   `frontend/components/QuizQuestionDisplay.tsx` (New component)

-   `frontend/lib/services/quiz.ts` (New file for client-side API logic)

-   `backend/app/api/quiz.py` (Modified - Add new API endpoint)

-   `backend/app/services/quiz_submission.py` (New file for quiz submission logic)

-   `backend/app/models/quiz_submission.py` (New file for Pydantic models)

-   `frontend/tests/` (New tests for frontend components and API integration)

-   `backend/tests/` (New tests for backend API endpoint)



### References

-   [Source: docs/PRD.md#FR011:-Quiz-Interface-Display]

-   [Source: docs/epics.md#Story-4.1:-Display-Single-Question]

-   [Source: docs/sprint-artifacts/tech-spec-epic-4.md#Acceptance-Criteria-(Authoritative)]

-   [Source: docs/architecture.md#4.-Architectural-Patterns-&-Consistency]

-   [Source: docs/architecture.md#5.-API-Contract-&-Type-Sharing]



## Change Log



- 2025-12-04: Initial Draft created by Scrum Master.

- 2025-12-04: Implemented full stack solution for Display Single Question (Backend API, Frontend UI, Tests). Status: review.

- 2025-12-04: Senior Developer Review notes appended. Status updated to done.



## Dev Agent Record



### Context Reference

- docs/sprint-artifacts/epic-4/story-4-1-display-single-question/4-1-display-single-question.context.xml



### Agent Model Used



gemini-1.5-flash



### Debug Log References

- Frontend tests failed initially due to missing environment variables and mismatched function arguments in regression tests. Fixed `jest.setup.ts` and `QuizConfigModal.test.tsx`.

- Backend tests failed due to `pydantic-ai` import error requiring `GOOGLE_API_KEY`. Fixed by setting dummy env var in test file.



### Completion Notes List

- Implemented `QuizQuestionDisplay` component and integration into `QuizPage`.

- Implemented `GET /api/v1/quiz/{quiz_id}/start` endpoint and supporting backend logic.

- Added `quiz_attempts` table via migration.

- Verified implementation with comprehensive unit and integration tests for both frontend and backend.

- All tasks completed and verified.



### File List

- `backend/app/models/quiz_submission.py`

- `backend/app/services/quiz_submission.py`

- `backend/app/api/routers/quiz.py`

- `supabase/migrations/20251204000000_create_quiz_attempts.sql`

- `frontend/lib/services/quiz.ts`

- `frontend/components/QuizQuestionDisplay.tsx`

- `frontend/app/quiz/[quizId]/page.tsx`

- `frontend/tests/components/QuizQuestionDisplay.test.tsx`

- `frontend/tests/pages/QuizPage.test.tsx`

- `backend/tests/test_quiz_submission_endpoint.py`

- `backend/tests/test_quiz_submission_service.py`

- `frontend/jest.setup.ts`

- `frontend/components/__tests__/QuizConfigModal.test.tsx`



## Senior Developer Review (AI)



### Reviewer: Amelia (Dev Agent)

### Date: 2025-12-04

### Outcome: Approve



### Summary

The story is well-implemented. The frontend component correctly displays the question and options, and the backend endpoint serves the data as expected. Security controls (RLS) are in place.



### Key Findings

- **Low**: No `ORDER BY` clause when fetching questions. Relies on insertion order. [file: backend/app/services/quiz_submission.py]



### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |

| :--- | :--- | :--- | :--- |

| 1 | Quiz interface displays one question and its answer options clearly. | IMPLEMENTED | `frontend/components/QuizQuestionDisplay.tsx` renders question and options. |

| 2 | Navigation controls (e.g., "Next Question") are present. | IMPLEMENTED | `frontend/app/quiz/[quizId]/page.tsx` contains "Next Question" button (placeholder logic). |



**Summary:** 2 of 2 acceptance criteria fully implemented.



### Task Completion Validation

| Task | Marked As | Verified As | Evidence |

| :--- | :--- | :--- | :--- |

| Frontend - Component Creation | [x] | VERIFIED | `frontend/components/QuizQuestionDisplay.tsx` created. |

| Frontend - API Integration | [x] | VERIFIED | `frontend/lib/services/quiz.ts` implements `startQuiz`. |

| Frontend - Navigation | [x] | VERIFIED | "Next Question" button present in `page.tsx`. |

| Backend - API Endpoint | [x] | VERIFIED | `GET /api/v1/quiz/{quiz_id}/start` in `backend/app/api/routers/quiz.py`. |

| Backend - Data Model | [x] | VERIFIED | `QuestionDisplay` in `backend/app/models/quiz_submission.py`. |

| Test - Frontend Unit | [x] | VERIFIED | `frontend/tests/components/QuizQuestionDisplay.test.tsx`. |

| Test - Frontend Integration | [x] | VERIFIED | `frontend/tests/pages/QuizPage.test.tsx`. |

| Test - Backend Unit | [x] | VERIFIED | `backend/tests/test_quiz_submission_endpoint.py`. |



**Summary:** 8 of 8 completed tasks verified.



### Test Coverage and Gaps

- Comprehensive unit and integration tests provided for both stacks.

- Mocks are correctly used for external dependencies (Supabase).



### Architectural Alignment

- Follows the "Data Flow Pattern" (Frontend Auth + Backend Data).

- Uses defined Pydantic models and TypeScript interfaces.



### Security Notes

- RLS policies applied to `quiz_attempts` and `quiz_answers` (verified in migration).

- `QuestionDisplay` model correctly excludes sensitive data (correct answer/explanation) from the frontend response.



### Action Items

**Advisory Notes:**

- Note: `backend/app/services/quiz_submission.py`: Fetching all questions to get the count might be inefficient for large quizzes. Consider using `count='exact'` or a separate query.

- Note: `backend/app/services/quiz_submission.py`: Questions are fetched without explicit `ORDER BY`. Consider adding a `question_order` column or sorting by `created_at` to guarantee consistent order.
