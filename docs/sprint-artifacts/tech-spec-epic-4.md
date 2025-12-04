# Epic Technical Specification: Interactive Quiz Experience

Date: 2025-12-04
Author: BIP
Epic ID: 4
Status: Draft

---

## Overview

Epic 4 focuses on delivering an engaging and feedback-rich interface for students to take and review quizzes generated from their notes. This involves displaying questions one at a time, providing immediate feedback, tracking progress, and offering options for re-attempting or generating new quizzes.

## Objectives and Scope

**In-Scope:**
-   Displaying quiz questions one by one (FR011).
-   Providing immediate visual feedback for correct/incorrect answers (FR012).
-   Implementing a quiz progress indicator (FR015).
-   Displaying a final score summary (FR013).
-   Offering options to retake the same quiz or generate a new quiz from the same notes (FR014).
-   Displaying micro-learning content for correct answers (FR016).

**Out-of-Scope:**
-   Advanced analytics beyond final score.
-   Quiz sharing features.
-   Complex adaptive learning paths.
-   The "Skip Question" functionality (FR017) from PRD is not explicitly covered in current stories, will be raised as an Open Question.

## System Architecture Alignment

This epic primarily impacts the frontend's `QuizPlayer` and `ScoreCard` components and the backend's `quiz_submission.py` service. It aligns with the Next.js frontend and FastAPI backend architecture, utilizing Supabase for quiz persistence. The data flow pattern ensures the frontend requests quiz data from the backend, which interacts with Supabase for retrieval and submission.

## Detailed Design

### Services and Modules

-   **Frontend (`frontend/app/quiz/*`, `frontend/components/*Quiz*`):**
    -   `QuizPlayer` component: Manages display of single questions, answer selection, and navigation.
    -   `ScoreCard` component: Displays final quiz results and post-quiz options.
    -   `QuizService` (client-side, `frontend/lib/services/quiz.ts`): Handles API calls to backend for fetching questions, submitting answers, and retrieving results.
-   **Backend (`backend/app/api/quiz.py`, `backend/app/services/quiz_submission.py`, `backend/app/models/quiz_submission.py`):**
    -   `quiz_submission.py` (service): Handles logic for fetching quiz questions, recording user answers, calculating scores, and persisting quiz attempt data.
    -   `quiz.py` (API router): Defines endpoints for `/quiz/{quiz_id}/start`, `/quiz/{quiz_id}/answer`, `/quiz/{quiz_id}/results`, `/quiz/{quiz_id}/retake`.
    -   `quiz_submission.py` (model): Defines Pydantic models for quiz attempts, answers, and results.

### Data Models and Contracts

-   **Frontend (Typescript interfaces):** `QuizQuestionDisplay`, `UserAnswer`, `QuizResult`, `QuizAttempt`.
-   **Backend (Pydantic models - `backend/app/models/quiz_submission.py`):**
    -   `QuizAttempt`: Represents a user's attempt at a quiz (stores user_id, quiz_id, start_time, end_time, score, answers).
    -   `UserAnswer`: Records user's selected option for a question.
    -   `QuizSubmissionRequest`: Input model for submitting an answer.
    -   `QuizResultResponse`: Output model for quiz results.

### APIs and Interfaces

-   `GET /api/v1/quiz/{quiz_id}/start`: Fetches the first question and initializes a quiz attempt.
-   `POST /api/v1/quiz/{quiz_id}/answer`: Submits a user's answer for a specific question, returns feedback.
-   `GET /api/v1/quiz/{quiz_id}/progress`: (Optional) Get current progress (question number, total).
-   `GET /api/v1/quiz/{quiz_id}/results`: Retrieves the final score and summary.
-   `POST /api/v1/quiz/{quiz_id}/retake`: Initiates a new attempt for the same quiz.

### Workflows and Sequencing

1.  User selects "Start Quiz" (from `QuizConfigModal` - Epic 3).
2.  Frontend calls `GET /api/v1/quiz/{quiz_id}/start`. Backend initializes `QuizAttempt` in DB.
3.  Frontend displays first question.
4.  User selects an answer, Frontend calls `POST /api/v1/quiz/{quiz_id}/answer`.
5.  Backend validates answer, updates `QuizAttempt`, returns feedback.
6.  Frontend displays feedback and next question (or results if last question).
7.  Repeat steps 4-6 until all questions are answered.
8.  Frontend calls `GET /api/v1/quiz/{quiz_id}/results`. Backend calculates final score and returns.
9.  Frontend displays `ScoreCard` with post-quiz options.

## Non-Functional Requirements

### Performance

-   `NFR005`: Frontend quiz interactions (answer submission, next question load) should be highly responsive (< 500ms).
-   Backend API endpoints for quiz progression must handle concurrent requests efficiently.

### Security

-   `NFR002`: All quiz submission data must be securely handled and stored, associated with the authenticated `user_id`.
-   Backend API endpoints must enforce authentication and authorization (e.g., a user can only submit answers for their own quiz attempts).

### Reliability/Availability

-   `NFR001`: The quiz interface and backend services must be highly available during quiz sessions to prevent loss of progress.

### Observability

-   Logging for quiz attempt starts, answer submissions, and completion events.
-   Metrics for quiz completion rates, average scores, and time taken per question.

## Dependencies and Integrations

-   **Supabase Database:** For persisting quiz questions, user answers, and quiz attempt history.
-   **Backend FastAPI:** Existing auth middleware for user authentication.
-   **Frontend Next.js:** React Query for managing API calls and state.

## Acceptance Criteria (Authoritative)

1.  **Story 4.1: Display Single Question**
    1.  Quiz interface displays one question and its answer options clearly.
    2.  Navigation controls (e.g., "Next Question") are present. (FR011)
2.  **Story 4.2: Immediate Answer Feedback**
    1.  Upon selecting an answer, the correct option is highlighted green and incorrect options red.
    2.  Feedback is displayed clearly (e.g., "Correct!" or "Incorrect, the correct answer was..."). (FR012)
3.  **Story 4.3: Quiz Progress Tracking**
    1.  A progress bar or question counter (e.g., "3/10") is visible during the quiz. (FR015)
4.  **Story 4.4: Final Score Summary**
    1.  Upon quiz completion, a screen displays the total score (e.g., "8/10 correct").
    2.  Options to review answers or retake the quiz are presented. (FR013)
5.  **Story 4.5: Retake/New Quiz Options**
    1.  After completing a quiz, buttons for "Retake same quiz" and "Generate new quiz" are available.
    2.  Clicking "Retake same quiz" starts a new quiz with the identical questions.
    3.  Clicking "Generate new quiz" starts a new quiz with different questions from the same source notes. (FR014)
6.  **Story 4.6: Micro-learning Content**
    1.  When an answer is marked as correct, a "Want to learn more?" option is displayed.
    2.  This option reveals 1-3 factual sentences related to the correct answer. (FR016)

## Traceability Mapping

| AC | Spec Section(s) | Component(s)/API(s) | Test Idea |
| :--- | :--- | :--- | :--- |
| FR011 (4.1) | Workflows, APIs | `QuizPlayer` / `GET /quiz/start` | UI test: single question display |
| FR012 (4.2) | Workflows, APIs | `QuizPlayer` / `POST /quiz/answer` | UI test: feedback after answer |
| FR015 (4.3) | Workflows | `QuizPlayer` | UI test: progress bar update |
| FR013 (4.4) | Workflows, APIs | `ScoreCard` / `GET /quiz/results` | UI test: score summary display |
| FR014 (4.5) | Workflows, APIs | `ScoreCard` / `POST /quiz/retake` | UI test: retake/new quiz options |
| FR016 (4.6) | Workflows | `QuizPlayer` | UI test: micro-learning content |

## Risks, Assumptions, Open Questions

-   **Risk:** Performance of complex UI updates for feedback on low-spec devices. (Mitigation: Optimize React component rendering).
-   **Risk:** Complexity of "Retake same quiz" vs "Generate new quiz" logic, especially with dynamic question generation vs static set. (Mitigation: For "Retake same quiz", simply reuse the same `quiz_id` and questions; for "Generate new quiz", call Epic 3's quiz generation again).
-   **Assumption:** Quiz question generation from Epic 3 provides sufficient data for micro-learning explanations.
-   **Open Question:** How will "Skip Question" (FR017 from PRD) be handled in the UI and backend logic, specifically regarding scoring and progress? This functionality is defined in the PRD (FR017) but not yet associated with a story in Epic 4.

## Test Strategy Summary

-   **Unit Tests:** For backend `quiz_submission.py` service logic (score calculation, answer validation).
-   **Component Tests:** For Frontend `QuizPlayer` and `ScoreCard` components (rendering, state changes, interactions).
-   **Integration Tests:** Backend API endpoints with Supabase.
-   **E2E Tests:** Full user journeys for taking a quiz and post-quiz actions.
