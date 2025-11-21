## Test Framework Setup for myapp

This document outlines the setup and usage of the Playwright test framework for the `myapp` project.

### Setup Instructions

1.  **Install Dependencies**:
    After scaffolding, you need to install Playwright and its browsers.
    ```bash
    npm install -D @playwright/test
    npx playwright install
    ```
    (or `yarn add -D @playwright/test` and `yarn playwright install` if using yarn)

2.  **Configure Environment**:
    Copy the `.env.example` file to `.env` in the `myapp` directory and fill in any necessary environment variables, especially `BASE_URL` and `API_URL`.
    ```bash
    cp .env.example .env
    ```

### Running Tests

*   **Run all tests**:
    ```bash
    npm run test:e2e
    ```
*   **Run tests in UI mode**:
    ```bash
    npx playwright test --ui
    ```
*   **Run tests with a headed browser**:
    ```bash
    npx playwright test --headed
    ```
*   **Debug tests**:
    Use the Playwright VS Code extension or set `PWDEBUG=1` environment variable.
    ```bash
    PWDEBUG=1 npm run test:e2e
    ```
*   **Show HTML report**:
    ```bash
    npx playwright show-report
    ```

### Architecture Overview

The test framework is structured as follows:

*   **`tests/e2e/`**: Contains the actual end-to-end test files (e.g., `example.spec.ts`).
*   **`tests/support/`**: Houses framework infrastructure.
    *   **`fixtures/`**: Contains test fixtures (e.g., `index.ts` for extending Playwright's `test` object, `factories/user-factory.ts` for data generation and cleanup).
    *   **`helpers/`**: For utility functions used across tests.
    *   **`page-objects/`**: (Optional) For Page Object Models to encapsulate page interactions.

**Fixture Pattern**: The framework uses a fixture architecture (`mergeTests` pattern) for creating isolated test contexts and managing test data. Data factories (e.g., `UserFactory`) are faker-based and include automatic cleanup.

### Best Practices

*   **Selector Strategy**: Always use `data-testid` attributes for selecting UI elements to ensure robust and resilient tests. Avoid brittle CSS selectors or XPath.
*   **Test Isolation**: Each test should be independent and not rely on the state of previous tests. Fixtures are designed to help achieve this.
*   **Cleanup**: Ensure test data created during a test is cleaned up afterwards to prevent test pollution. Data factories include `cleanup` methods for this purpose.

### CI Integration

Tests are configured to run in a CI/CD pipeline with:

*   `fullyParallel: true` for faster execution.
*   `retries: 2` on CI for handling transient failures.
*   `workers: 1` on CI (can be adjusted based on CI runner capabilities).
*   HTML and JUnit XML reporters for comprehensive reporting.

### Knowledge Base References Applied

*   Fixture architecture pattern (pure functions + mergeTests)
*   Data factories with auto-cleanup (faker-based)
*   Network-first testing safeguards (implicitly handled by Playwright's default behavior and best practices)
*   Failure-only artifact capture (screenshots, videos, traces)

---

## Framework Scaffold Complete

**Framework Selected**: Playwright

**Artifacts Created**:

-   ✅ Configuration file: `playwright.config.ts`
-   ✅ Directory structure: `tests/e2e/`, `tests/support/`, `tests/support/fixtures/`, `tests/support/helpers/`, `tests/support/page-objects/`
-   ✅ Environment config: `.env.example`
-   ✅ Node version: `.nvmrc`
-   ✅ Fixture architecture: `tests/support/fixtures/index.ts`
-   ✅ Data factories: `tests/support/fixtures/factories/user-factory.ts`
-   ✅ Sample tests: `tests/e2e/example.spec.ts`
-   ✅ Documentation: `tests/README.md`

**Next Steps**:

1.  Copy `myapp/.env.example` to `myapp/.env` and fill in environment variables.
2.  Run `npm install -D @playwright/test` and `npx playwright install` to install test dependencies.
3.  Run `npm run test:e2e` to execute sample tests.
4.  Review `myapp/tests/README.md` for detailed setup instructions.
