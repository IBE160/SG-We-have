# User Story: Auto-timestamp Notes

**Story ID:** 2-4
**Epic:** 2 - Core Note-Taking Experience
**Status:** ready-for-dev

## User Story
**AS A** student
**I WANT** my saved notes to be automatically timestamped
**SO THAT** I can easily track when I last updated them and be assured my work is saved.

## Acceptance Criteria

### AC 2.4.1: Display Timestamp
- [ ] The note editor interface displays a "Last updated: [Date/Time]" label.
- [ ] The timestamp is located near the save controls (or in a status bar) for clear visibility.
- [ ] The timestamp is formatted in a user-friendly local format (e.g., "Last updated: 12:30 PM" or "Dec 2, 12:30 PM").

### AC 2.4.2: Real-time Update
- [ ] When the user successfully saves the notes (via the Save button), the timestamp updates immediately to the current time (or the time returned by the server).
- [ ] If the save fails, the timestamp does NOT update.

### AC 2.4.3: Persistence on Load
- [ ] When opening a lecture with existing notes, the "Last updated" timestamp reflects the stored `updated_at` value from the database.
- [ ] If no notes exist (or new notes), the timestamp is hidden or shows "Not saved yet".

## Tasks

### Frontend Tasks
- [ ] **Update NoteEditor Component** (AC: 2.4.1)
  - Modify `frontend/components/NoteEditor.tsx`.
  - Add `lastSavedAt` (string | null) to `NoteEditorProps`.
  - Render the timestamp in the toolbar or a footer area.
  - Use a utility (or `new Date().toLocaleString()`) to format the string nicely.
- [ ] **Integrate Timestamp in Lecture Page** (AC: 2.4.2, 2.4.3)
  - Modify `frontend/app/dashboard/courses/[courseId]/lectures/[lectureId]/page.tsx`.
  - Update the state to track `note` object (which already includes `updated_at`).
  - Ensure the `GET` request populates the initial `updated_at`.
  - Ensure the `handleSave` function updates the local state with the `updated_at` returned from the `PUT` response.
  - Pass the `updated_at` value to the `<NoteEditor />` component.

### Testing Tasks
- [ ] **Component Unit Test** (AC: 2.4.1, 2.4.2)
  - Update `frontend/components/__tests__/NoteEditor.test.tsx`.
  - Test that `lastSavedAt` prop is rendered correctly when provided.
  - Test that it is not rendered (or shows empty state) when null.
  - Test that the timestamp updates in the UI immediately after the save action completes (mocking the `onSave` promise resolution).
- [ ] **Backend/Integration Test (Optional but recommended)** (AC: 2.4.3)
  - Review `backend/tests/test_notes.py`.
  - Verify `test_update_note_success` checks that `updated_at` returned is strictly greater than `created_at`.
  - Ensure the `PUT` response structure matches what the frontend expects for `updated_at`.

## Dev Notes

### Learnings from Previous Story (2-3 Save Lecture Notes)
- **Implementation Success:** The `NoteEditor` component and `PUT /api/v1/lectures/{id}/notes` endpoint are fully operational and tested.
- **File Locations:**
  - Component: `frontend/components/NoteEditor.tsx`
  - API Client: `frontend/lib/api.ts`
  - Backend Router: `backend/app/api/routers/notes.py`
  - Tests: `frontend/components/__tests__/NoteEditor.test.tsx` and `backend/tests/test_notes.py`
- **Continuity:** This story strictly extends the UI of `NoteEditor.tsx` (adding a prop/label) and the usage in `page.tsx`. The backend already returns `updated_at` [Source: backend/app/api/routers/notes.py], so no backend changes are required, only frontend integration.
- **Review Status:** Story 2-3 was completed with all review items resolved. No outstanding debt to carry forward. [Source: docs/sprint-artifacts/epic-2/story-2-3-save-lecture-notes/2-3-save-lecture-notes.md]

### Architecture Patterns
- **Data Flow:** The backend is the source of truth for the timestamp. The `PUT` endpoint already returns the full `Note` object with the new `updated_at`. The frontend should rely on this return value rather than generating a client-side timestamp to ensure consistency.
- **Formatting:** Use standard JavaScript `Date` formatting or `Intl.DateTimeFormat` for locale-aware formatting.

### References
- [Source: docs/sprint-artifacts/tech-spec-epic-2.md] - AC 2.4
- [Source: docs/sprint-artifacts/epic-2/story-2-3-save-lecture-notes/2-3-save-lecture-notes.md] - Story 2-3 (Save Implementation)
- [Source: backend/app/api/routers/notes.py] - Backend logic returning `updated_at`.
- [Source: docs/epics.md] - Epic 2, Story 2.4 definition.
- [Source: docs/architecture.md] - System Architecture (Frontend/Backend interaction).

## Change Log
- 2025-12-02: Initial Draft created by SM Agent.
- 2025-12-02: Enhanced by SM Agent (Validator) to add missing testing coverage, continuity notes, and citations.

## Dev Agent Record

### Context Reference
- docs/sprint-artifacts/epic-2/story-2-4-auto-timestamp-notes/2-4-auto-timestamp-notes.context.xml

### Agent Model Used
{{agent_model_name_version}}

### Debug Log References
- **2025-12-02**: Auto-improved by SM Agent following validation failure.

### Completion Notes List
- [ ] Confirmed timestamp appears on load.
- [ ] Confirmed timestamp updates on save.
- [ ] Confirmed "Last updated" format is user-friendly.

### File List
- frontend/components/NoteEditor.tsx
- frontend/app/dashboard/courses/[courseId]/lectures/[lectureId]/page.tsx
- frontend/components/__tests__/NoteEditor.test.tsx
