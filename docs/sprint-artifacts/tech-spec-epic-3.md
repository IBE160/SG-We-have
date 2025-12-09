# Epic Technical Specification: AI-Powered Quiz Generation

Date: 2025-12-03
Author: BIP
Epic ID: 3
Status: Draft

---

## Overview

This epic focuses on integrating an AI system to generate accurate, relevant, and configurable multiple-choice quizzes directly from a student's notes, thereby enhancing their ability to self-assess and learn. It builds upon the core note-taking experience to provide a powerful study aid as outlined in the Product Requirements Document (PRD).

## Objectives and Scope

**Objectives:**
- Enable students to initiate and configure quiz generation from their lecture notes.
- Ensure the AI generates high-quality, relevant, and accurate multiple-choice questions.
- Provide options for selecting specific lectures and defining quiz length.
- Enhance the self-assessment capabilities of the application.

**In-Scope:**
- **FR006:** AI Quiz Generation based on individual lecture notes or full course content.
- **FR007:** Configurable Quiz Length (5, 10, 15, 20, 25, or 30 questions).
- **FR008:** AI-generated quizzes to be relevant, understandable, honest, supportive, straight to the point, and fact-based.
- **FR009:** AI fact-checking online using context-relevant online information for accuracy.
- **FR010:** AI-generated quizzes focusing on definitions, application, and comparison question types.
- **FR018:** AI robustness for generating quizzes effectively from free-form notes.
- **FR019:** Clear "Generate Quiz" buttons on single lecture page and lecture notes overview page.
- Story 3.1: Initiate Quiz Generation
- Story 3.2: Select Lectures for Quiz
- Story 3.3: Configure Quiz Length
- Story 3.4: AI Generates Multiple-Choice Questions
- Story 3.5: AI Fact-Checking for Accuracy

**Out-of-Scope (for this epic):**
- The interactive quiz taking experience (covered in Epic 4).
- Advanced quiz types (e.g., true/false, fill-in-the-blank).
- User-editable generated quizzes.

## System Architecture Alignment

This epic aligns with the established architecture by leveraging the FastAPI backend for AI integration and using Supabase for prompt management. The AI component will be primarily handled by `quiz_service.py` and `quiz_agent.py` within the backend. Pydantic AI will be utilized for all LLM interactions, ensuring type-safe and structured output generation. Quiz prompts will be stored in the `system_prompts` table in Supabase, preventing hardcoding and allowing for easy updates. The chosen AI Model is Google Gemini Pro 2.5 Flash for its speed and cost-effectiveness.

**Key architectural components involved:**
- **Frontend:** `QuizConfigModal` for user interaction.
- **Backend:** `quiz_service.py`, `quiz_agent.py` (utilizing Pydantic AI).
- **Database:** `system_prompts` table in Supabase.
- **AI Model:** Google Gemini 2.5 Flash.


## Detailed Design

### Services and Modules

- **`quiz_service.py` (Backend Service):**
    - **Responsibilities:** Orchestrates the quiz generation process. Receives requests from the frontend, retrieves notes, fetches prompts from the database, invokes the AI agent, and persists the generated quiz data.
    - **Inputs:** Lecture IDs, desired quiz length.
    - **Outputs:** Structured quiz object (questions, options, correct answers).
    - **Owner:** Backend Team.

- **`quiz_agent.py` (Backend AI Agent):**
    - **Responsibilities:** Interfaces with the Google Gemini 2.5 Flash LLM using `pydantic-ai`. Structures the input prompt and parses the LLM's output into a predefined Pydantic model for quizzes. Includes logic for fact-checking (FR009).
    - **Inputs:** Formatted prompt (notes + context), Pydantic output schema.
    - **Outputs:** Pydantic model instance representing the generated quiz.
    - **Owner:** Backend Team.

- **`QuizConfigModal.tsx` (Frontend Component):**
    - **Responsibilities:** Provides the user interface for configuring quiz parameters (selecting lectures, quiz length).
    - **Inputs:** List of available lectures for the current course.
    - **Outputs:** User-selected lecture IDs and quiz length.
    - **Owner:** Frontend Team.

### Data Models and Contracts

- **`system_prompts` Table (Supabase):**
    - Stores AI prompts, identified by a `key` (e.g., "quiz_generator_v1") and containing a `template` text with placeholders (e.g., `{{notes}}`, `{{question_types}}`).
    - **Schema:**
        ```sql
        CREATE TABLE system_prompts (
          key TEXT PRIMARY KEY,
          template TEXT NOT NULL,
          description TEXT
        );
        ```

- **Quiz Output Pydantic Model (Backend `models/quiz.py`):**
    - Defines the expected structured output from the `quiz_agent`.
    - **Example Schema (conceptual):**
        ```python
        from pydantic import BaseModel, Field
        from typing import List

        class Question(BaseModel):
            question_text: str = Field(..., description="The text of the multiple-choice question.")
            options: List[str] = Field(..., min_length=4, max_length=4, description="Four possible answer options.")
            correct_answer_index: int = Field(..., ge=0, lt=4, description="Index of the correct answer (0-3).")
            explanation: str = Field(..., description="Brief explanation for the correct answer.")

        class Quiz(BaseModel):
            title: str = Field(..., description="Title of the quiz.")
            questions: List[Question] = Field(..., description="List of generated questions.")
        ```

- **Frontend Type Definition (`frontend/types/api.ts`):**
    - Corresponding TypeScript interfaces mirroring the backend Pydantic models for type safety.

### APIs and Interfaces

- **`POST /api/quiz/generate` (Backend API Endpoint):**
    - **Method:** `POST`
    - **Description:** Initiates the AI-powered quiz generation process.
    - **Request Body (JSON):**
        ```json
        {
          "lecture_ids": ["uuid1", "uuid2"],
          "quiz_length": 10
        }
        ```
    - **Response Body (JSON - Success):**
        ```json
        {
          "data": {
            "quiz_id": "uuid-of-generated-quiz",
            "title": "Quiz on Distributed Systems",
            "questions": [
              {
                "question_text": "...",
                "options": ["...", "...", "...", "..."],
                "correct_answer_index": 0,
                "explanation": "..."
              }
            ]
          },
          "meta": {}
        }
        ```
    - **Response Body (JSON - Error):**
        ```json
        {
          "detail": "Human readable error message, e.g., 'Not enough content to generate quiz.'",
          "code": "QUIZ_GENERATION_FAILED"
        }
        ```
    - **Authentication:** Requires valid `Authorization: Bearer <JWT>` token in header.
    - **Rate Limiting:** To be considered if AI costs become a concern (NFR004).

### Workflows and Sequencing

1.  **User Action (Frontend - Story 3.1):** Student clicks "Generate Quiz" on a lecture overview, opening `QuizConfigModal`.
2.  **Configuration (Frontend - Stories 3.2, 3.3):** Student selects lectures and desired quiz length within `QuizConfigModal`.
3.  **API Call (Frontend):** Frontend dispatches a `POST` request to `/api/quiz/generate` with `lecture_ids` and `quiz_length`. Uses React Query with retry logic (e.g., `retry: 3`).
4.  **Backend Request Handling (Backend):**
    *   FastAPI endpoint receives the request.
    *   Authenticates user via JWT middleware.
    *   `quiz_service.py` is invoked.
5.  **Notes Retrieval (Backend `quiz_service.py`):** `quiz_service` retrieves the content of the selected lectures from the database.
6.  **Prompt Assembly (Backend `quiz_service.py`):**
    *   `quiz_service` fetches the "quiz_generator_v1" prompt template from the `system_prompts` table.
    *   Injects the retrieved lecture notes and other parameters (e.g., desired question types from FR010) into the template.
7.  **AI Interaction (Backend `quiz_agent.py`):**
    *   `quiz_service` calls `quiz_agent.py`, passing the assembled prompt and the expected Pydantic `Quiz` model.
    *   `quiz_agent` sends the prompt to Google Gemini 2.5 Flash (FR006, FR008, FR018).
    *   `quiz_agent` handles fact-checking (FR009) by potentially making additional calls to external sources or the LLM itself with specific fact-checking prompts.
    *   LLM generates a response, which `pydantic-ai` parses into the `Quiz` Pydantic model.
    *   If generation fails or output is malformed, appropriate error handling is triggered.
8.  **Quiz Persistence (Backend `quiz_service.py`):** The generated `Quiz` object is stored in the database (e.g., `quizzes`, `questions`, `options` tables).
9.  **Response (Backend):** `quiz_service` returns the generated quiz ID and possibly a summary to the frontend.
10. **Frontend Update:** Frontend receives the response, closes the `QuizConfigModal`, and potentially navigates the user to the newly generated quiz (Epic 4).

## Non-Functional Requirements

### Performance

-   **Responsiveness:** The quiz generation process, including AI interaction, should be performant enough to provide a responsive user experience (NFR005). The use of Google Gemini 2.5 Flash is intended to keep generation times low.
-   **Frontend Resilience:** Frontend will use React Query with `retry: 3` and `retryDelay: 1000` for quiz generation requests to handle transient network issues and ensure a smoother user experience during API calls.
-   **No Polling:** For MVP, a synchronous approach will be used for quiz generation, with no client-side polling.

### Security

-   **Data Handling:** Secure handling and storage of user notes, which are the basis for quiz generation (NFR002).
-   **Authentication & Authorization:** All API calls to `/api/quiz/generate` will be protected by JWT validation performed by the FastAPI backend (NFR002, Architecture - Data Flow Pattern).
-   **Environment Variables:** Sensitive API keys (e.g., `GEMINI_API_KEY`) and Supabase secrets will be stored securely in environment variables (Architecture - Security & Environment).
-   **Row Level Security (RLS):** Supabase tables storing notes and generated quizzes will have RLS enabled to prevent unauthorized access, even though the backend acts as a trusted intermediary (Architecture - Security & Environment).

### Reliability/Availability

-   **Consistent Functionality:** The quiz generation feature must consistently function as expected (NFR001).
-   **Timeout Handling:** The AI interaction layer in the backend will incorporate timeout handling for calls to the Gemini API to prevent indefinite waiting (Architecture - Quiz Generation Pattern).
-   **Error Handling:** Robust error handling will be implemented in the `quiz_service` and `quiz_agent` to manage potential failures during AI interaction or data persistence, providing informative feedback to the user.

### Observability

-   **Logging:** Implement comprehensive logging for AI interactions within `quiz_service.py` and `quiz_agent.py` to facilitate debugging, performance monitoring, and to track API usage.
-   **Metrics:** Consider emitting metrics related to quiz generation time, success rates, and AI token usage for future performance optimization and cost analysis.
-   **Tracing:** Distributed tracing could be integrated to monitor the flow of quiz generation requests across frontend, backend, and AI services, aiding in root cause analysis for complex issues.

## Dependencies and Integrations

This epic relies on the following key dependencies and integration points:

### Frontend Dependencies (`frontend/package.json`):
-   **Next.js**: `16.0.5`
-   **React**: `19.2.0`
-   **React-DOM**: `19.2.0`
-   **TypeScript**: `5.x` (from `devDependencies`)
-   **@supabase/supabase-js**: `^2.86.0` (Supabase client library for browser)
-   **@tanstack/react-query**: `^5.90.11` (Server state management for API calls)
-   **Zustand**: `^5.0.8` (Client state management)
-   **Tailwind CSS**: `^4` (from `devDependencies`)
-   **clsx**: `^2.1.1` (Utility for constructing className strings conditionally)
-   **lucide-react**: `^0.555.0` (Icon library)
-   **tailwind-merge**: `^3.4.0` (Utility to merge Tailwind CSS classes without style conflicts)
-   **@tiptap/react**: `^3.11.1` (Rich text editor framework, likely used for note taking, potentially for prompt input)
-   **@tiptap/starter-kit**: `^3.11.1` (Starter kit for Tiptap editor)

### Backend Dependencies (`backend/pyproject.toml`):
-   **FastAPI**: `>=0.122.0` (Web framework for API)
-   **uvicorn**: `>=0.38.0` (ASGI server for FastAPI)
-   **Pydantic**: `>=2.12.5` (Data validation and serialization library, base for Pydantic AI)
-   **python-dotenv**: `>=1.2.1` (For loading environment variables)
-   **supabase**: `>=2.24.0` (Supabase Python client)
-   **python-jose**: `>=3.5.0` (JOSE library for JWT handling, used for authentication)
-   **cryptography**: `>=46.0.3` (Cryptography library, a dependency of python-jose)
-   **Pydantic AI**: (Explicitly mentioned in architecture, not in `pyproject.toml` as a direct dependency but likely integrated via Pydantic and specific LLM SDKs)
-   **google-generativeai**: (Implicitly mentioned in architecture for Google Gemini 2.5 Flash, not directly in `pyproject.toml` but required for `quiz_agent.py`)

### External Services:
-   **Supabase**: Provides PostgreSQL database, Authentication services, and storage for `system_prompts`.
-   **Google Gemini 2.5 Flash**: The AI model utilized by `quiz_agent.py` for quiz generation and fact-checking.

### Integrations:
-   **Frontend-Backend API:** RESTful API communication using `POST /api/quiz/generate` for quiz generation. JWT for authentication.
-   **Backend-Supabase:** Python client library (`supabase`) for database operations (reading notes, storing quizzes, fetching prompts).
-   **Backend-Google Gemini API:** `quiz_agent.py` interacts with the Google Gemini API via `pydantic-ai` for LLM calls.

## Acceptance Criteria (Authoritative)

The following acceptance criteria, derived directly from the user stories of Epic 3, must be met for successful completion:

**Story 3.1: Initiate Quiz Generation**
1.  A "Generate Quiz" button is available on all lecture overview pages.
2.  Clicking the "Generate Quiz" button successfully opens a quiz configuration interface.

**Story 3.2: Select Lectures for Quiz**
1.  The quiz configuration interface allows the user to select one or more lectures from a displayed list.
2.  Only lectures that have associated saved notes are presented as selectable options.

**Story 3.3: Configure Quiz Length**
1.  The quiz configuration interface offers discrete options for quiz length: 5, 10, 15, 20, 25, or 30 questions.
2.  The system successfully generates a quiz containing the user-selected number of questions.

**Story 3.4: AI Generates Multiple-Choice Questions**
1.  The AI processes the content of the selected lecture notes to generate quiz questions.
2.  All generated questions are in a multiple-choice format.
3.  Generated questions are directly relevant to the content within the provided notes.
4.  Each question includes exactly one correct answer and a set of plausible distractor options.

**Story 3.5: AI Fact-Checking for Accuracy**
1.  During quiz generation, the AI integrates with external knowledge sources to verify factual accuracy.
2.  All generated questions and their respective answers are factually correct according to the external sources.

## Traceability Mapping

| Acceptance Criteria | Spec Section(s) (e.g., FRxxx, NFRyyy) | Component(s)/API(s) Involved | Test Idea |
| :------------------ | :------------------------------------ | :----------------------------- | :-------- |
| 3.1.1 (Button Available) | FR019 | `QuizConfigModal.tsx` | Verify button presence on lecture page. |
| 3.1.2 (Opens Interface) | FR019 | `QuizConfigModal.tsx` | Click button, verify modal/interface appears. |
| 3.2.1 (Lecture Selection) | FR006 | `QuizConfigModal.tsx`, Backend `quiz_service.py` (for available notes) | Verify checkboxes/selection for lectures. |
| 3.2.2 (Only Saved Notes) | FR006 | Backend `quiz_service.py` | Select lecture with no notes, verify it's disabled or not shown. |
| 3.3.1 (Length Options) | FR007 | `QuizConfigModal.tsx` | Verify dropdown/radio buttons for quiz lengths. |
| 3.3.2 (Generates Selected Length) | FR007 | Backend `quiz_service.py`, `quiz_agent.py`, `POST /api/quiz/generate` | Generate 5, 10, 15, etc., questions; count results. |
| 3.4.1 (Processes Notes) | FR006, FR018 | Backend `quiz_service.py`, `quiz_agent.py` | Provide notes, check quiz generated. |
| 3.4.2 (Multiple-Choice Format) | FR006, FR010 | Backend `quiz_agent.py` | Examine generated question format (one correct, multiple distractors). |
| 3.4.3 (Relevant to Notes) | FR008 | Backend `quiz_agent.py` | Provide specific notes, verify questions are on topic. |
| 3.4.4 (Correct & Plausible Distractors) | FR008, FR010 | Backend `quiz_agent.py` | Manually review generated quiz for correctness and distractor quality. |
| 3.5.1 (Integrates External Sources) | FR009 | Backend `quiz_agent.py` | Inspect `quiz_agent.py` code for external API calls/fact-checking mechanism. |
| 3.5.2 (Factually Correct) | FR009 | Manual review of generated quizzes against external facts. | Manual review. |


## Risks, Assumptions, Open Questions

### Risks
-   **AI Quality & Relevance:** The primary risk is that the AI-generated quizzes may not consistently meet the required quality standards (FR008), leading to irrelevant, inaccurate, or poorly formatted questions. This could negatively impact user trust and learning effectiveness.
-   **AI Cost & Performance:** While Google Gemini 2.5 Flash is designed for speed and cost-efficiency, unpredictable usage patterns or higher-than-anticipated token consumption could lead to unexpected operational costs or increased latency beyond acceptable limits (NFR005).
-   **Fact-Checking Limitations:** The effectiveness and reliability of the AI's "fact-checking online" capability (FR009) might be limited, potentially introducing inaccuracies or requiring significant prompt engineering.
-   **Input Variability:** Free-form user notes may vary widely in quality and structure. Generating consistent, high-quality quizzes from highly unstructured or sparse notes could be challenging (FR018).
-   **API Rate Limits:** Potential for hitting Google Gemini API rate limits under heavy usage, leading to service disruption.

### Assumptions
-   Users will provide notes with sufficient content and clarity for the AI to generate meaningful quizzes.
-   The `pydantic-ai` library will provide a stable and effective interface for structured LLM interactions.
-   Supabase's database and authentication services will offer reliable and scalable support for storing notes, quizzes, and managing user sessions.
-   The chosen AI model (Google Gemini 2.5 Flash) will meet the expected performance and accuracy requirements within a reasonable cost.

### Open Questions
-   What specific mechanisms will `quiz_agent.py` employ for "fact-checking online" (FR009)? Will it involve explicit web searches or rely solely on the LLM's pre-trained knowledge base?
-   What are the anticipated average and worst-case latencies for quiz generation given typical note lengths and quiz sizes?
-   How will the system gracefully handle cases where the AI cannot generate a quiz due to insufficient or ambiguous input notes?
-   Are there specific content guidelines or limitations for user notes that could improve quiz generation quality?

## Test Strategy Summary

A multi-faceted test strategy will be employed to ensure the quality and reliability of the AI-powered quiz generation feature:

-   **Unit Testing:** Individual components such as `quiz_service.py` (for orchestrating flow, prompt assembly, and persistence) and `quiz_agent.py` (for LLM interaction, Pydantic parsing, and output structure) will have comprehensive unit tests.
-   **Integration Testing:** Verify the end-to-end flow of the `/api/quiz/generate` endpoint, including proper JWT authentication, successful interaction with Supabase (for notes retrieval and quiz storage), and correct invocation of the AI agent. Mocking the external Google Gemini API will be critical for controlled and repeatable tests.
-   **End-to-End (E2E) Testing:** Automated E2E tests (e.g., using Playwright or Cypress) will simulate the user journey from selecting lectures and configuring quiz length in the `QuizConfigModal` to receiving a generated quiz object.
-   **Manual Testing & User Acceptance Testing (UAT):** Essential for subjectively assessing the quality, relevance, factual accuracy (FR008, FR009), and pedagogical soundness of the AI-generated questions and answers. Diverse sets of notes will be used to test robustness across various content types.
-   **Performance Testing:** Load testing will be conducted on the `/api/quiz/generate` endpoint to evaluate its scalability, responsiveness (NFR005), and identify potential bottlenecks or issues with AI API rate limits.
-   **Security Testing:** Focus on verifying correct implementation of JWT validation, secure handling of `GEMINI_API_KEY` (NFR002), and effective Row Level Security (RLS) on Supabase tables.
-   **Negative Testing:** Test scenarios with invalid inputs, insufficient notes, very short notes, or malformed requests to ensure robust error handling and informative feedback.
