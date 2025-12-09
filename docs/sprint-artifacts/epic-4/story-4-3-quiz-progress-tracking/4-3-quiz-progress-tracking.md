# Story 4.3: Quiz Progress Tracking

Status: done

## Story

As a Student,
I want to see my progress through the quiz (e.g., "Question 3 of 10"),
so that I know how many questions are remaining and can manage my time.

## Acceptance Criteria

1.  A progress bar or question counter (e.g., "3/10") is visible during the quiz. (FR015)

## Tasks / Subtasks

- [x] **Backend - API Update:** Ensure `GET /api/v1/quiz/{quiz_id}/start` or a new progress endpoint returns `current_question_index` and `total_questions` for the active attempt. (AC: #1)
    - [x] Check `quiz_submission.py` service for existing capability.
    - [x] Update Pydantic models if necessary.
    - [x] Test backend response.
- [x] **Frontend - Component Creation:** Create a `QuizProgressBar` component (or similar) to visualize progress. (AC: #1)
    - [x] Implement visual bar (using Tailwind width classes) or text counter (e.g., "3/10").
    - [x] Test component rendering with different progress values.
- [x] **Frontend - Integration:** Integrate `QuizProgressBar` into `app/quiz/[quizId]/page.tsx`. (AC: #1)
    - [x] Pass current index and total count from parent state.
    - [x] Ensure progress updates when moving to the next question.
- [x] **Test - Frontend:** Write component tests for `QuizProgressBar` ensuring correct visual width/text. (AC: #1)

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
-   2025-12-05: Senior Developer Review notes appended.

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/epic-4/story-4-3-quiz-progress-tracking/4-3-quiz-progress-tracking.context.xml

### Agent Model Used
{{agent}}

### Debug Log References

### Completion Notes
**Completed:** 2025-12-05
**Definition of Done:** All acceptance criteria met, code reviewed, tests passing

### File List

## Senior Developer Review (AI)

-   **Reviewer**: dev (Amelia)
-   **Date**: 2025-12-05
-   **Outcome**: **Approve**
    -   All Acceptance Criteria met.
    -   Frontend component implemented and integrated.
    -   Backend API supports progress tracking.
    -   Tests passing.

### Summary
The implementation of the Quiz Progress Tracking feature is complete and functional. The `QuizProgressBar` component correctly visualizes progress based on data from the backend. Integration into the main quiz page is seamless.

### Key Findings
-   **Low**: None.
-   **Medium**: None.
-   **High**: None.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
| :--- | :--- | :--- | :--- |
| 1 | A progress bar or question counter (e.g., "3/10") is visible during the quiz. (FR015) | **IMPLEMENTED** | `frontend/components/QuizProgressBar.tsx` (UI), `frontend/app/quiz/[quizId]/page.tsx` (Integration), `backend/app/services/quiz_submission.py` (Data) |

**Summary**: 1 of 1 acceptance criteria fully implemented.

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
| :--- | :--- | :--- | :--- |
| Backend - API Update | [x] | **VERIFIED COMPLETE** | `backend/app/services/quiz_submission.py` (start/next logic) |
| Frontend - Component Creation | [x] | **VERIFIED COMPLETE** | `frontend/components/QuizProgressBar.tsx` |
| Frontend - Integration | [x] | **VERIFIED COMPLETE** | `frontend/app/quiz/[quizId]/page.tsx` |
| Test - Frontend | [x] | **VERIFIED COMPLETE** | `frontend/tests/components/QuizProgressBar.test.tsx` |

**Summary**: 4 of 4 completed tasks verified.

### Test Coverage and Gaps
-   **Coverage**: Unit tests for `QuizProgressBar` cover rendering of text and visual width, and ARIA roles.
-   **Gaps**: None for this specific story scope.

### Architectural Alignment
-   Follows the pattern of separation between UI components and Page logic.
-   Backend service handles data preparation.
-   Matches Epic 4 Tech Spec.

### Security Notes
-   No new security risks introduced. Progress data is read-only display.

### Best-Practices and References
-   Used `aria-valuenow` for accessibility.

### Action Items
**Advisory Notes:**
-   Note: Ensure that `QuizProgressBar` handles cases where `totalQuestions` might be 0 gracefully (though backend ensures > 0).
