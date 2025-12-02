# Engineering Backlog

This backlog collects cross-cutting or future action items that emerge from reviews and planning.

Routing guidance:

- Use this file for non-urgent optimizations, refactors, or follow-ups that span multiple stories/epics.
- Must-fix items to ship a story belong in that story’s `Tasks / Subtasks`.
- Same-epic improvements may also be captured under the epic Tech Spec `Post-Review Follow-ups` section.

| Date | Story | Epic | Type | Severity | Owner | Status | Notes |
| ---- | ----- | ---- | ---- | -------- | ----- | ------ | ----- |
| mandag 1. desember 2025 | 1.3 | 1 | Feature | Medium | TBD | Open | Implement visual confirmation (e.g., refresh course list, success toast) in `frontend/app/dashboard/page.tsx` within the `handleCourseCreated` function. (AC 1.3.2) [file: frontend/app/dashboard/page.tsx:12] |
| mandag 1. desember 2025 | 1.3 | 1 | TechDebt | Low | TBD | Open | Use a more specific error interface instead of `any` in `frontend/components/CreateCourseModal.tsx` and `frontend/lib/api.ts`. [file: frontend/components/CreateCourseModal.tsx:33, frontend/lib/api.ts:26] |
| mandag 1. desember 2025 | 1.3 | 1 | TechDebt | Low | TBD | Open | Integrate a standard Python logging library in `backend/app/api/routers/courses.py` instead of `print()`. [file: backend/app/api/routers/courses.py:36] |
| 2025-12-02 | 2.3 | 2 | Bug | High | dev | Open | Add missing UI state tests in `NoteEditor.test.tsx`. |
| 2025-12-02 | 2.3 | 2 | Bug | High | dev | Open | Add missing security test (PUT 403) in `test_notes.py`. |
| 2025-12-02 | 2.3 | 2 | TechDebt | Med | dev | Open | Add explicit UPDATE path test in `test_notes.py`. |
