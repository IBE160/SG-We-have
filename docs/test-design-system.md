# System-Level Test Design

## Testability Assessment

- **Controllability: PASS**
  - API seeding is fully viable via FastAPI backend endpoints.
  - Supabase integration allows direct database state control for tests (using service role key in test environment only).
  - External dependency (Gemini AI) is behind a service interface `gemini_client.py`, making it mockable via dependency injection or network interception.

- **Observability: PASS**
  - FastAPI provides structured logging and clear HTTP error codes.
  - Client-side errors are exposed via standard UI components (Toast/Alert).
  - Database state is inspectable via Supabase client.
  - **Recommendation**: Ensure `server-timing` headers are added to API responses for performance validation.

- **Reliability: PASS**
  - Stateless architecture (REST + JWT) supports parallel test execution.
  - Unique data generation (via Faker) avoids collisions in Supabase.
  - Synchronous quiz generation with retries is deterministic (vs. polling complexity).

## Architecturally Significant Requirements (ASRs)

| Requirement | Category | Risk Score | Test Approach |
| :--- | :--- | :--- | :--- |
| **AI Quiz Accuracy** (FR009) | Functional | 9 (Critical) | Automated evaluation of generated quizzes against source text using LLM-as-a-judge approach or static datasets. |
| **Quiz Generation Latency** | Performance | 6 (High) | k6 load tests measuring p95 response time for `POST /api/quiz/generate`. |
| **Offline Resilience** | Reliability | 4 (Medium) | Playwright network interception to simulate offline mode and verify "retry" UI behavior. |
| **Data Privacy** | Security | 9 (Critical) | Playwright security tests validating RLS enforcement (user A cannot fetch user B's notes). |

## Test Levels Strategy

### Unit Tests (Backend: Pytest, Frontend: Vitest) - 40%
- **Backend**: Business logic in `services/`, Pydantic models validation, utility functions.
- **Frontend**: Complex UI logic (quiz state machine), utility helpers, hooks logic.

### Integration Tests (Backend: Pytest + Test DB) - 40%
- **API Contracts**: Validate FastAPI endpoints return correct structures (Pydantic schemas).
- **Database**: Verify CRUD operations against a test Supabase instance (or local Dockerized Postgres if feasible, otherwise mocked DB service).
- **AI Service**: Verify `gemini_client` handles API errors/timeouts correctly (using mocks).

### E2E Tests (Playwright) - 20%
- **Critical Flows**: Login -> Create Course -> Add Note -> Generate Quiz.
- **Focus**: Happy paths and critical error scenarios (network failure during quiz gen).
- **Mocking**: Mock Gemini API responses to ensure deterministic E2E runs and avoid costs.

## NFR Testing Approach

- **Security**:
  - **Tool**: Playwright + Custom Scripts
  - **Tests**:
    - Verify unauthenticated access is blocked (401).
    - Verify cross-user access is blocked (RLS validation).
    - Verify tokens are stored securely (HttpOnly cookies preferred, or secure local storage handling).

- **Performance**:
  - **Tool**: k6
  - **Tests**:
    - Load test `POST /api/quiz/generate` (mocked AI) to ensure backend throughput.
    - Stress test database connection pool.
  - **Thresholds**: API p95 < 500ms (excluding AI latency), AI p95 < 15s.

- **Reliability**:
  - **Tool**: Playwright
  - **Tests**:
    - Simulate 500 errors from backend -> Verify UI shows graceful error message.
    - Simulate network timeout -> Verify retry button functionality.

- **Maintainability**:
  - **Tool**: CI/CD (GitHub Actions)
  - **Checks**:
    - Strict TypeScript checks (no `any`).
    - Backend type checking (`mypy`).
    - Linting (`eslint`, `ruff`).

## Test Environment Requirements

- **Backend**: Local FastAPI instance (`localhost:8000`).
- **Frontend**: Local Next.js instance (`localhost:3000`).
- **Database**:
  - Option A: Local Dockerized Supabase (Recommended for speed/cost).
  - Option B: Separate "Test" project in Supabase Cloud (Accepted per architecture).
- **AI**:
  - Mocked for standard regression.
  - Live key enabled ONLY for "AI Accuracy" smoke tests (tagged `@ai-live`).

## Testability Concerns

- **Concern 1**: Reliance on remote Supabase for tests might be slow/flaky.
  - *Mitigation*: Use aggressive caching or consider local Docker Supabase for integration tests if remote proves unstable.
- **Concern 2**: AI non-determinism.
  - *Mitigation*: Strict mocking for functional tests. Separate "AI Quality" suite running on schedule, not per-commit.

## Recommendations for Sprint 0

1. **Initialize Test Frameworks**: Set up Playwright (E2E) and Pytest (Backend) immediately.
2. **Mocking Strategy**: Implement a global `MockGeminiService` for development/testing to save costs and ensure speed.
3. **Seed Scripts**: Create robust SQL/API seed scripts to populate Supabase with test users/courses before test runs.
