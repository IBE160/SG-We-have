# Story 3.3: Configure Quiz Length

Status: done

## Story

As a Focused Fiona (Student),
I want to be able to choose the number of questions for my quiz (5, 10, 15, 20, 25, or 30),
so that I can tailor the quiz to the time I have available and my current study needs.

## Acceptance Criteria

1.  The quiz configuration interface (`QuizConfigModal`) offers discrete options for quiz length: 5, 10, 15, 20, 25, or 30 questions.
2.  The default quiz length is set to 10 questions.
3.  The selected quiz length is included in the API request to the backend (`/api/v1/quiz/generate`).
4.  The Backend successfully receives the `quiz_length` parameter and validates it against the allowed values.

## Tasks / Subtasks

- [x] **Frontend:** Update `frontend/components/QuizConfigModal.tsx` to include a selector (e.g., dropdown or radio buttons) for Quiz Length with values [5, 10, 15, 20, 25, 30]. Default to 10. (AC: 1, 2)
- [x] **Frontend:** Update state management in `QuizConfigModal` to capture the selected length. (AC: 3)
- [x] **Frontend:** Update `frontend/lib/api.ts` to include a `generateQuiz` function that accepts `lectureIds` (array) and `quizLength` (number). (AC: 3)
- [x] **Backend:** Create `backend/app/api/routers/quiz.py` with a `POST /generate` endpoint (resulting in `/api/v1/quiz/generate`). (AC: 4)
- [x] **Backend:** Define a Pydantic Request Model (e.g., `QuizGenerationRequest`) that includes `lecture_ids: List[str]` and `quiz_length: int`. (AC: 4)
- [x] **Backend:** Wire up the `quiz` router in `backend/app/main.py`. (AC: 4)
- [x] **Integration:** Verify that clicking "Generate" in the modal sends the correct JSON payload to the backend endpoint. (AC: 3, 4)
- [x] **Testing:** Add unit tests for the Pydantic model validation (ensuring only 5-30 are accepted). (AC: 4)

## Dev Notes

### Learnings from Previous Story (3.2 Select Lectures)
- **Files Modified:** `frontend/components/QuizConfigModal.tsx` was significantly updated in 3.2 to handle lecture selection. We will continue modifying this component.
- **API Structure:** `frontend/lib/api.ts` was updated to handle lecture data. We will extend it for the quiz generation endpoint.
- **State Management:** As noted in 3.2, the modal manages its own selection state. We will add `quizLength` to this local state before passing it up/out via the `onGenerate` callback or API call.
- **Backend Context:** `backend/app/api/lectures.py` was touched. We are now adding a new router `backend/app/api/routers/quiz.py`.
- [Source: docs/sprint-artifacts/epic-3/story-3-2-select-lectures-for-quiz/3-2-select-lectures-for-quiz.md]

### Relevant Architecture Patterns and Constraints
-   **Frontend**: React functional components, local state for modal.
-   **Styling**: Tailwind CSS.
-   **API Design**: RESTful `POST` endpoint.
-   **Backend**: FastAPI router, Pydantic validation.
-   **Validation**: Strict validation of inputs (lecture IDs and length) is required at the API boundary.

### Source Tree Components to Touch
-   `frontend/components/QuizConfigModal.tsx`
-   `frontend/lib/api.ts`
-   `backend/app/api/routers/quiz.py` (New File)
-   `backend/app/main.py`

### Testing Standards Summary
-   **Manual Verification**:
    -   Open modal.
    -   Select "5 questions".
    -   Click Generate.
    -   Inspect Network tab: Ensure payload is `{"lecture_ids": [...], "quiz_length": 5}`.
    -   Check Backend logs: Ensure request is received and validated (200 OK).

### References
-   [Source: docs/PRD.md#FR007: Configurable Quiz Length]
-   [Source: docs/sprint-artifacts/tech-spec-epic-3.md#Story 3.3: Configure Quiz Length]
-   [Source: docs/architecture.md]

## Change Log
- 2025-12-03: Initial draft created by SM Agent.
- 2025-12-03: Auto-improved by SM Agent: Added Learnings from 3.2, Dev Agent Record, Change Log, and updated AC references.
- 2025-12-03: Context generated and status updated to ready-for-dev.

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/epic-3/story-3-3/3-3-configure-quiz-length.context.xml

### Agent Model Used
Gemini

### Debug Log References

### Completion Notes List

### File List
