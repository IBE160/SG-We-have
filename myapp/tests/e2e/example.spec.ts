import { test, expect } from '../support/fixtures';

test.describe('Example Test Suite', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Home/i);
  });

  test('should create user and login', async ({ page, userFactory }) => {
    // Create test user
    const user = await userFactory.createUser();

    // Login
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', user.email);
    await page.fill('[data-testid="password-input"]', user.password);
    await page.click('[data-testid="login-button"]');

    // Assert login success
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });
});
