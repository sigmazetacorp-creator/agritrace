import { test, expect } from '@playwright/test';

const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPassword123!';

test.describe('Authentication Flow', () => {
  test('should sign up new user', async ({ page }) => {
    await page.goto('/signup');

    // Fill signup form
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[id*="password"]', TEST_PASSWORD);
    await page.fill('input[id*="confirm"]', TEST_PASSWORD);

    // Submit
    await page.click('button:has-text("Create Account")');

    // Check redirect to login or dashboard
    await expect(page).toHaveURL(/\/(login|agritrace)/);
  });

  test('should log in existing user', async ({ page }) => {
    await page.goto('/login');

    // Fill login form
    await page.fill('input[type="email"]', 'admin@agritrace.com');
    await page.fill('input[type="password"]', 'AdminPassword123!');

    // Submit
    await page.click('button:has-text("Sign In")');

    // Check redirect to dashboard
    await expect(page).toHaveURL('/agritrace/dashboard');
  });

  test('should reject invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill login form with wrong password
    await page.fill('input[type="email"]', 'admin@agritrace.com');
    await page.fill('input[type="password"]', 'WrongPassword123!');

    // Submit
    await page.click('button:has-text("Sign In")');

    // Check error message
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });

  test('should log out user', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@agritrace.com');
    await page.fill('input[type="password"]', 'AdminPassword123!');
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL('/agritrace/dashboard');

    // Logout
    await page.click('button:has-text("Logout")');

    // Check redirect to home
    await expect(page).toHaveURL('/');
  });

  test('should show validation errors on signup', async ({ page }) => {
    await page.goto('/signup');

    // Try to submit empty form
    await page.click('button:has-text("Create Account")');

    // Check for validation errors
    const errors = page.locator('text=required');
    await expect(errors.first()).toBeVisible();
  });

  test('should require matching passwords', async ({ page }) => {
    await page.goto('/signup');

    // Fill form with non-matching passwords
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[id*="password"]:first-of-type', 'TestPassword123!');
    await page.fill('input[id*="confirm"]', 'DifferentPassword123!');

    // Submit
    await page.click('button:has-text("Create Account")');

    // Check error
    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });
});
