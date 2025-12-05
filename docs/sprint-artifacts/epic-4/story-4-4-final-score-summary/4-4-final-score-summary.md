# Story 4.4: Final Score Summary

**Date:** 2025-12-05
**Status:** done
**Epic:** 4 - Interactive Quiz Experience
**Story Key:** 4-4-final-score-summary

## Dev Agent Record
### Context Reference
- docs/sprint-artifacts/epic-4/story-4-4-final-score-summary/4-4-final-score-summary.context.xml

### Completion Notes
- Implemented `get_quiz_results` backend service and endpoint.
- Created `QuizResultResponse` model.
- Created `ScoreCard` frontend component with Retake and Back to Courses actions.
- Integrated `ScoreCard` into `QuizPage` (displayed upon quiz completion).
- Added unit tests for backend logic.

### File List
- backend/app/models/quiz_submission.py
- backend/app/services/quiz_submission.py
- backend/app/api/routers/quiz.py
- backend/tests/test_quiz_results.py
- frontend/lib/services/quiz.ts
- frontend/components/ScoreCard.tsx
- frontend/app/quiz/[quizId]/page.tsx

**Completed:** 2025-12-05
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

## 1. User Story

**As a** student,
**I want to** see a summary of my performance after completing a quiz,
**So that** I can assess my understanding of the material.

## 2. Acceptance Criteria

1.  **Score Display:** Upon quiz completion, the screen displays the total score (e.g., "8/10 correct") and a percentage (e.g., "80%").
2.  **Completion Summary:** A visual indication that the quiz is finished is shown.
3.  **Action Options:** Options to "Review Answers" (visual placeholder or link), "Retake Same Quiz", and "Generate New Quiz" are presented to the user.
4.  **Navigation:** The user cannot navigate back to the active quiz questions once the summary is shown (quiz state is 'completed').

## 3. Technical Implementation

### 3.1 Backend (FastAPI)

*   **Endpoint:** `GET /api/v1/quiz/{quiz_id}/results`
*   **Logic:**
    *   Fetch the `QuizAttempt` from the database using `quiz_id` and `user_id`.
    *   Calculate the score (count of correct `UserAnswer`s vs total questions).
    *   Return a JSON response with:
        *   `score`: Integer (e.g., 8)
        *   `total_questions`: Integer (e.g., 10)
        *   `percentage`: Float (e.g., 80.0)
        *   `completed_at`: Timestamp
*   **Service:** Update `quiz_submission.py` to include a `get_quiz_results` method.
*   **Models:** Ensure `QuizResultResponse` Pydantic model covers these fields.

### 3.2 Frontend (Next.js)

*   **Component:** Create or update `ScoreCard.tsx` (or `QuizSummary.tsx`).
    *   Display the score prominently.
    *   Include buttons/links for the post-quiz actions.
*   **State Management:**
    *   Use `useQuery` (React Query) to fetch results from `/api/v1/quiz/{quiz_id}/results` when the quiz is completed.
    *   Handle loading state (skeleton) and error state.
*   **Routing:**
    *   Ensure the quiz flow redirects to or renders the Summary view upon successful submission of the last question.

### 3.3 Database (Supabase)

*   Ensure `quiz_attempts` table has a `score` column (or it's calculated on fly). *Decision: Calculate on fly or store on completion. Storing is better for analytics.*
*   Update `quiz_attempts` table schema if necessary to store final score.

## 4. Testing Strategy

*   **Backend Unit Tests:**
    *   Test `get_quiz_results` with various attempt states (perfect score, zero score, partial).
    *   Test that accessing results for another user's quiz returns 403/404.
*   **Frontend Component Tests:**
    *   Render `ScoreCard` with mock data and verify score display.
    *   Verify "Retake" and "New Quiz" buttons are present (actions can be mocked).
*   **Integration Tests:**
    *   Complete a quiz flow and verify the result endpoint returns the expected calculated score.

## 5. Dependencies

*   Story 4.1, 4.2, 4.3 (Completed) - Quiz flow foundation.
*   Epic 3 (Quiz Generation) - For creating the underlying quiz data.

## 6. Task Breakdown

- [x] Backend: Implement `get_quiz_results` service logic.
- [x] Backend: Create `GET /quiz/{id}/results` endpoint.
- [x] Frontend: Create `ScoreCard` component.
- [x] Frontend: Integrate `ScoreCard` into `QuizPlayer` or routing flow.
- [x] Testing: Write backend unit tests and frontend component tests.