# User Story: Select Lectures for Quiz

**Story ID:** 3.2
**Epic:** 3 - AI-Powered Quiz Generation
**Status:** done

## User Story
**AS A** student
**I WANT** to select specific lectures to include in a quiz
**SO THAT** I can focus on particular topics.

## Acceptance Criteria

### AC 3.2.1: Lecture Selection Interface
- [x] The quiz configuration modal displays a list of available lectures for the current course.
- [x] Users can select one or more lectures using checkboxes.
- [x] Users can "Select All" or "Deselect All" (usability enhancement).

### AC 3.2.2: Note Availability Constraint
- [x] Only lectures that have associated saved notes are enabled for selection.
- [x] Lectures without notes are visually distinct (e.g., grayed out) and unselectable.
- [x] A tooltip or text explains why a lecture is unselectable (e.g., "No notes saved").

## Tasks

### Backend Tasks
- [x] **Expose Note Status in Lecture API** (AC: 3.2.2)
  - Update `backend/app/models/lecture.py` (or schema) to include a `has_notes` boolean field (computed or joined).
  - Update `backend/app/api/lectures.py` to populate this field when listing lectures for a course.
  - Ensure efficient querying (avoid N+1 queries).

### Frontend Tasks
- [x] **Update Api Client** (AC: 3.2.2)
  - Update `frontend/lib/api.ts` `Lecture` interface to include `has_notes`.
- [x] **Enhance QuizConfigModal for Selection** (AC: 3.2.1)
  - Update `frontend/components/QuizConfigModal.tsx`.
  - Add prop: `lectures: Lecture[]`.
  - Render a list of lectures with checkboxes.
  - Implement state for `selectedLectureIds`.
  - Disable checkboxes where `lecture.has_notes` is false.
- [x] **Implement Select All / Deselect All** (AC: 3.2.1)
  - Add a control to toggle selection of all *available* (valid) lectures.
- [x] **Update Parent Integration** (AC: 3.2.1)
  - Update `frontend/app/dashboard/courses/[courseId]/page.tsx` to pass the course's lecture list to the modal.
  - Update `frontend/app/dashboard/courses/[courseId]/lectures/[lectureId]/page.tsx` to pass the current lecture (pre-selected) or full list.

### Testing Tasks
- [x] **Backend Test: Lecture API**
  - Verify `GET /courses/{id}/lectures` returns `has_notes` correctly.
- [x] **Component Test: QuizConfigModal Selection**
  - Verify list rendering.
  - Verify only lectures with notes are enabled.
  - Verify selection state updates.
  - Verify "Select All" behavior.

## Dev Notes

### Learnings from Previous Story (3-1 Initiate Quiz Generation)
- **Components:** `QuizConfigModal` is already established. We are extending it, not creating it.
- **State Management:** The modal's open/close state is managed by the parent page. The *selection* state should likely be managed *inside* the modal, exposing the result via an `onGenerate(selectedIds)` callback.
- **Technical Debt:** Story 3.1 identified that the Course Overview page needs to know about note existence. This story (3.2) directly addresses that by requiring the Backend API update.
- **Reuse:** Use `GenerateQuizButton` pattern where applicable (though this story focuses on the modal content).
- [Source: stories/3-1-initiate-quiz-generation.md#Dev-Agent-Record]

### Architecture Patterns
- **Computed Fields:** For `has_notes`, prefer a lightweight check. If using Supabase directly from backend, a `left join` or `exists` check is efficient.
- **Validation:** Frontend prevents selecting invalid lectures, but Backend should also validate `lecture_ids` in the generation endpoint (next story).

### References
- [Source: docs/sprint-artifacts/tech-spec-epic-3.md] - Epic 3 Technical Specification
- [Source: docs/epics.md] - Epic 3, Story 3.2
- [Source: docs/PRD.md] - FR006 Lecture Selection
- [Source: docs/architecture.md] - Architecture & Data Models

## Change Log
- 2025-12-03: Initial draft created by SM Agent.
- 2025-12-03: Validation updates - Added architecture reference and Change Log.
- 2025-12-03: Story Context generated and status updated to ready-for-dev.
- 2025-12-03: Story completed and verified by Dev Agent.

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/epic-3/story-3-2-select-lectures-for-quiz/3-2-select-lectures-for-quiz.context.xml

### Agent Model Used
Gemini

### Debug Log References

### Completion Notes List
- Story implementation verified via code review.
- All Acceptance Criteria met.
- Unit tests (frontend and backend) passing.
- Code merged.

### File List