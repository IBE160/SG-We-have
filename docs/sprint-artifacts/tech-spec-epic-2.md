# Epic Technical Specification: Core Note-Taking Experience

Date: 2025-12-02
Author: BIP
Epic ID: 2
Status: Draft

---

## Overview

This epic focuses on delivering the core value proposition of the StudyTool: the ability for students to take, format, and save notes for their lectures. It introduces a rich text editor into the frontend application and establishes the data persistence layer for note content. The goal is to provide a seamless, "Google Docs-lite" experience where users can focus on capturing knowledge without worrying about losing their work.

## Objectives and Scope

**In-Scope:**
*   **Note Editor UI:**
    *   Integration of a Rich Text Editor (RTE) library.
    *   Basic formatting toolbar (Bold, Italic, Headings H1-H3, Bullet List, Ordered List).
*   **Note Persistence:**
    *   Saving note content to the database.
    *   Retrieving existing notes when a lecture is opened.
    *   Automatic timestamping on save.
*   **UX/UI:**
    *   Visual feedback for "Saving..." and "Saved".
    *   Display of "Last updated" timestamp.

**Out-of-Scope (for this Epic):**
*   Image uploads or embedding within notes.
*   Real-time collaboration (multi-user editing).
*   Exporting notes to PDF or Markdown files.
*   Version history (reverting to previous saves).
*   AI-based auto-completion or summarization (covered in future epics).

## System Architecture Alignment

This epic builds upon the "User Foundation" by attaching data (Notes) to the existing "Lecture" entities.

*   **Frontend (Next.js):** Will implement a new `NoteEditor` component using **Tiptap** (headless, framework-agnostic, highly customizable rich text editor). This component will be embedded within the `LectureDetail` page.
*   **Backend (FastAPI):** Will implement `notes.py` router in the `api` module (or extend `lectures.py`). It will handle CRUD operations for note content.
*   **Database (Supabase):** Will introduce a new `notes` table.
    *   *Decision:* We will use a **1:1 relationship** between Lecture and Note for this MVP. A lecture has one main body of notes.

## Detailed Design

### Services and Modules

| Module/Service | Responsibility | Owner |
| :--- | :--- | :--- |
| **Frontend: EditorComponent** | Wraps Tiptap instance, handles toolbar state, and emits change events. | Frontend |
| **Frontend: useAutoSave** | (Optional) Custom hook to handle debounced auto-saving (if we go beyond manual save button). *For this Epic, we adhere to Story 2.3 "User can click a Save button", but architecture should support auto-save.* | Frontend |
| **Backend: NoteService** | Handles business logic for upserting (create/update) notes. | Backend |

### Data Models and Contracts

**Table: `notes`**
*   `id`: uuid (Primary Key, Default: `gen_random_uuid()`)
*   `lecture_id`: uuid (Foreign Key references `lectures.id` ON DELETE CASCADE, UNIQUE NOT NULL)
*   `content`: text (Stores the HTML or JSON string of the note content. NOT NULL)
*   `created_at`: timestamptz (Default: `now()`)
*   `updated_at`: timestamptz (Default: `now()`)

*Note: The `unique` constraint on `lecture_id` enforces the 1:1 relationship.*

### APIs and Interfaces

**Note API (FastAPI)**
*   `GET /api/v1/lectures/{lecture_id}/notes`
    *   **Purpose:** Retrieve the notes for a specific lecture.
    *   **Response:**
        *   200 OK: `{ "data": { "id": "...", "content": "...", "updated_at": "..." } }`
        *   404 Not Found: (If no notes exist yet - Frontend should handle this by showing empty editor).
*   `PUT /api/v1/lectures/{lecture_id}/notes`
    *   **Purpose:** Create or Update the notes for a lecture (Upsert).
    *   **Request:** `{ "content": "string (HTML/JSON)" }`
    *   **Response:** `{ "data": { "id": "...", "content": "...", "updated_at": "..." } }`

### Workflows and Sequencing

**1. Accessing Editor**
*   User clicks a Lecture from the Course/Lecture list.
*   Frontend navigates to `/dashboard/courses/{courseId}/lectures/{lectureId}`.
*   `useEffect` triggers `GET /api/v1/lectures/{lectureId}/notes`.
    *   If success: Load content into Tiptap editor.
    *   If 404: Initialize empty editor.

**2. Saving Notes**
*   User types in editor.
*   User clicks "Save" button.
*   Frontend sends `PUT /api/v1/lectures/{lectureId}/notes` with current editor content.
*   Backend checks if note exists for `lecture_id`.
    *   If yes: Update `content` and `updated_at`.
    *   If no: Insert new row.
*   Backend returns updated note object.
*   Frontend updates "Last saved at..." display.

## Non-Functional Requirements

### Performance
*   Editor initialization should be instantaneous (< 100ms) after data fetch.
*   Save operation should complete within 500ms to feel responsive.

### Security
*   **Authorization:** RLS must ensure users can only read/write notes for lectures they own (via the `courses` -> `profiles` chain).
*   **Sanitization:** While Tiptap handles rendering, the Backend (or Frontend on render) should ensure no malicious scripts are injected if we store raw HTML. *Decision: Store JSON/HTML as produced by trusted Tiptap configuration.*

### Usability
*   Formatting toolbar must be sticky or easily accessible.
*   Editor must support standard keyboard shortcuts (Ctrl+B, Ctrl+I).

### Reliability/Availability
*   The system relies on Supabase cloud availability.
*   Frontend should handle network errors gracefully during save (e.g., show "Save failed" toast and retain content in editor).

### Observability
*   Backend requests (note upserts) should be logged with method, path, status code, and processing time.
*   Client-side errors (save failures) should be logged to the console (MVP).

## Dependencies and Integrations

*   **Tiptap (React):**
    *   `@tiptap/react` (Latest Stable, e.g., ^2.10.x)
    *   `@tiptap/starter-kit` (Includes Bold, Italic, Heading, BulletList, OrderedList, History)
    *   `@tiptap/extension-highlight` (Optional, for future highlighting support)
*   **Lucide React:** Icons for the toolbar (Bold, Italic, etc.).

## Acceptance Criteria (Authoritative)

**AC 2.1: Access Note Editor**
1.  Clicking a lecture opens a dedicated view/page.
2.  A rich text editor surface is visible.
3.  If notes were previously saved, they are loaded into the editor.

**AC 2.2: Basic Text Formatting**
1.  Toolbar contains: Bold, Italic, H1, H2, Bullet List, Ordered List.
2.  Applying formatting changes the visual appearance of the selected text.
3.  Markdown shortcuts (e.g., typing `# ` for H1, `* ` for bullets) work (standard Tiptap feature).

**AC 2.3: Save Lecture Notes**
1.  "Save" button is available.
2.  Clicking "Save" persists the content to the database.
3.  Page reload retains the saved content.
4.  Empty notes can be saved (or handled gracefully).

**AC 2.4: Auto-Timestamp Notes**
1.  UI displays "Last updated: [Date/Time]" near the save controls.
2.  This timestamp updates immediately upon a successful save response from the backend.

## Traceability Mapping

| Acceptance Criteria | Spec Section | Component / API | Test Idea |
| :--- | :--- | :--- | :--- |
| AC 2.1 | Workflows (1) | `NoteEditor`, `GET` API | Open lecture with existing notes vs empty. |
| AC 2.2 | Detailed Design | `Tiptap` Config | Test all toolbar buttons and shortcuts. |
| AC 2.3 | APIs (Note), Workflows (2) | `PUT` API | Save text, reload page, verify persistence. |
| AC 2.4 | Detailed Design | Frontend State | Save and watch the timestamp label update. |

## Risks, Assumptions, Open Questions

*   **Assumption:** We are storing note content as HTML string for simplicity in MVP. Tiptap supports JSON (Prosemirror node tree) which is better for advanced things, but HTML is easier for "Export to PDF" or simple viewing later. **Decision: Use HTML string.**
*   **Risk:** XSS attacks if rendering stored HTML. **Mitigation:** Use `dompurify` on the frontend if rendering HTML outside of Tiptap (which usually handles it), or rely on React's safe defaults + Tiptap's handling.
*   **Question:** Do we need to handle concurrent edits (two tabs open)? **Decision:** No, last write wins for MVP.

## Test Strategy Summary

*   **Component Tests:** Test `NoteEditor` rendering and toolbar interactions using React Testing Library.
*   **API Tests:** Test `PUT` upsert logic – ensure creating a note works, and updating it works (and updates the timestamp).
*   **Manual Tests:** Verify "Write -> Save -> Reload -> Verify" loop.
