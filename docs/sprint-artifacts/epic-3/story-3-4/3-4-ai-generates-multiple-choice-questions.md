# Story 3.4: AI Generates Multiple-Choice Questions

Status: drafted

## Story

As a Student,
I want the AI to generate multiple-choice questions based on my lecture notes,
so that I can test my knowledge with relevant and accurately structured questions.

## Acceptance Criteria

1.  The AI processes the content of the selected lecture notes to generate quiz questions.
2.  All generated questions are in a multiple-choice format.
3.  Generated questions are directly relevant to the content within the provided notes.
4.  Each question includes exactly one correct answer and a set of plausible distractor options.
5.  The system successfully handles the generation process using the configured AI model (Google Gemini).

## Tasks / Subtasks

- [ ] Create/Update `quiz_agent.py` to define the Pydantic model for a Quiz Question (Question, Options, Correct Answer Index, Explanation) (AC: #2, #4).
- [ ] Implement the AI interaction logic in `quiz_agent.py` using `pydantic-ai` to prompt Google Gemini with lecture notes (AC: #1, #5).
- [ ] Implement prompt engineering to ensure questions are relevant, have one correct answer, and plausible distractors (AC: #3, #4).
- [ ] Integrate `quiz_agent.py` into the `quiz_service.py` to be called during the generation flow (AC: #5).
- [ ] **Test:** Verify the AI output structure matches the Pydantic model using unit tests with mock responses (AC: #2).
- [ ] **Test:** Verify prompt assembly correctly includes lecture notes context (AC: #1).
- [ ] **Test:** Verify error handling when the AI service is unreachable or returns malformed data (AC: #5).
- [ ] **Test:** Manual review of generated quizzes to verify question relevance to provided notes (AC: #3).
- [ ] **Test:** Manual review to confirm exactly one correct answer and plausible distractors per question (AC: #4).

## Dev Notes

### Learnings from Previous Story
- **Context Gap**: Previous story artifacts (3-1, 3-2, 3-3) are marked 'done' in `sprint-status.yaml` but are currently missing from the `docs/sprint-artifacts/epic-3` directory. This implementation will strictly follow the Architecture and Tech Spec to ensure continuity despite missing file history.
- **Architectural Alignment**: Continuing the Service-Agent pattern established in the backend architecture.

### Relevant Architecture Patterns and Constraints
-   **Backend Service**: `quiz_service.py`
-   **AI Agent**: `quiz_agent.py` using `pydantic-ai`
-   **AI Model**: Google Gemini 2.5 Flash
-   **Data Validation**: Pydantic models for strict output structuring

### Source Tree Components to Touch
-   `backend/app/core/quiz_agent.py` (New/Modified)
-   `backend/app/core/quiz_service.py` (Modified)
-   `backend/app/models/quiz.py` (New - Pydantic models)

### Testing Standards Summary
-   Unit tests for `quiz_agent.py` using mocked LLM responses to verify parsing and error handling.
-   Integration tests for the `quiz_service` flow.
-   Manual verification of generated quiz quality (relevance, distractors).

### Project Structure Notes
-   Follows the Service-Agent pattern defined in the Architecture.
-   Prompts should ideally be fetched from `system_prompts` table (via `quiz_service`), but `quiz_agent` handles the actual construction and call.

### References
-   [Source: docs/PRD.md#Epic 3: AI-Powered Quiz Generation]
-   [Source: docs/sprint-artifacts/tech-spec-epic-3.md#Detailed Design]
-   [Source: docs/epics.md#Epic 3: AI-Powered Quiz Generation]
-   [Source: docs/architecture.md#4.3. Prompt Management (Database Driven)]
-   [Source: docs/architecture.md#8. AI Agent Implementation Guidelines]

## Change Log

- 2025-12-03: Initial Draft created from Epic 3 Tech Spec.
- 2025-12-03: Updated based on validation feedback (Added Learnings, improved Citations, expanded Testing Tasks).