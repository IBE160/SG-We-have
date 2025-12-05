# Story 4.3: Quiz Progress Tracking

Status: ready-for-dev

## Story

As a Student,
I want to see my progress through the quiz (e.g., "Question 3 of 10"),
so that I know how many questions are remaining and can manage my time.

## Acceptance Criteria

1.  A progress bar or question counter (e.g., "3/10") is visible during the quiz. (FR015)

## Tasks / Subtasks

- [ ] **Backend - API Update:** Ensure `GET /api/v1/quiz/{quiz_id}/start` or a new progress endpoint returns `current_question_index` and `total_questions` for the active attempt. (AC: #1)
    - [ ] Check `quiz_submission.py` service for existing capability.
    - [ ] Update Pydantic models if necessary.
    - [ ] Test backend response.
- [ ] **Frontend - Component Creation:** Create a `QuizProgressBar` component (or similar) to visualize progress. (AC: #1)
    - [ ] Implement visual bar (using Tailwind width classes) or text counter (e.g., "3/10").
    - [ ] Test component rendering with different progress values.
- [ ] **Frontend - Integration:** Integrate `QuizProgressBar` into `app/quiz/[quizId]/page.tsx`. (AC: #1)
    - [ ] Pass current index and total count from parent state.
    - [ ] Ensure progress updates when moving to the next question.
- [ ] **Test - Frontend:** Write component tests for `QuizProgressBar` ensuring correct visual width/text. (AC: #1)

## Dev Notes

### Learnings from Previous Story
**From Story 4.2: Immediate Answer Feedback (Status: done)**

-   **Files Modified/Created**: `backend/app/services/quiz_submission.py`, `frontend/app/quiz/[quizId]/page.tsx`, `frontend/components/QuizQuestionDisplay.tsx`.
-   **Advisory Note**: The "Next Question" button logic needs to be fully operational to advance the progress bar. This story should ensure the "Next" flow increments the counter.
-   **Existing Data**: The `QuizAttempt` model in backend likely tracks `current_question_id` or similar. We might need to fetch the full list of question IDs at start to know the "total" and "index".

### Relevant Architecture Patterns and Constraints
-   **Frontend**: Next.js App Router. Use `shadcn/ui` `Progress` component if available or build simple Tailwind bar.
-   **Backend**: FastAPI. Keep logic in `quiz_submission.py`.
-   **State**: The quiz state (current question index) should be managed in the `QuizPlayer` (page) or a dedicated hook/store, initialized by the backend response.

### Project Structure Notes
-   **New Component**: `frontend/components/QuizProgressBar.tsx` (or similar).
-   **Integration Point**: `frontend/app/quiz/[quizId]/page.tsx` is the main orchestrator.

### Source Tree Components to Touch
-   `frontend/app/quiz/[quizId]/page.tsx`
-   `frontend/components/QuizProgressBar.tsx` (New)
-   `backend/app/services/quiz_submission.py`
-   `backend/app/models/quiz_submission.py`

### References
-   [Source: docs/PRD.md#FR015]
-   [Source: docs/sprint-artifacts/tech-spec-epic-4.md#Story 4.3: Quiz Progress Tracking]
-   [Source: docs/sprint-artifacts/epic-4/story-4-2-immediate-answer-feedback/4-2-immediate-answer-feedback.md]
-   [Source: docs/architecture.md]

## Change Log

-   2025-12-05: Initial Draft created from Epic 4 Tech Spec.
-   2025-12-05: Updated to include Architecture in References and added Change Log.

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/epic-4/story-4-3-quiz-progress-tracking/4-3-quiz-progress-tracking.context.xml

### Agent Model Used
{{agent}}

### Debug Log References

### Completion Notes List

### File List
