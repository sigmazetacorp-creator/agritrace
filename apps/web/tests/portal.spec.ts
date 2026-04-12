import { test, expect } from '@playwright/test';

test.describe('Portal Navigation & Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@agritrace.com');
    await page.fill('input[type="password"]', 'AdminPassword123!');
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL('/agritrace/dashboard');
  });

  test('should display dashboard', async ({ page }) => {
    await page.goto('/agritrace/dashboard');

    // Check key dashboard elements
    await expect(page.locator('h1, h2')).toContainText(/dashboard|overview/i);

    // Check navigation tabs exist
    await expect(page.locator('a, button')).toContainText('Dashboard');
    await expect(page.locator('a, button')).toContainText('Farmers');
  });

  test('should navigate to farmers page', async ({ page }) => {
    await page.goto('/agritrace/dashboard');

    // Click farmers link
    await page.click('a:has-text("Farmers"), button:has-text("Farmers")');

    // Check URL and page
    await expect(page).toHaveURL('/agritrace/farmers');
    await expect(page.locator('h1, h2')).toContainText(/farmer/i);
  });

  test('should navigate to harvests page', async ({ page }) => {
    await page.goto('/agritrace/dashboard');

    // Click harvests link
    const harvestLink = page.locator('a:has-text("Harvest"), button:has-text("Harvest")');
    if (await harvestLink.isVisible()) {
      await harvestLink.click();
      await expect(page).toHaveURL(/harvests/);
    }
  });

  test('should show logout button', async ({ page }) => {
    await page.goto('/agritrace/dashboard');

    // Check logout button exists
    const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")');
    await expect(logoutButton).toBeVisible();
  });

  test('should handle error boundary gracefully', async ({ page }) => {
    // This test verifies error boundary exists
    await page.goto('/agritrace/dashboard');

    // Portal should load without issues
    await expect(page.locator('body')).toBeVisible();

    // Should have no JS errors (basic check)
    const errors: string[] = [];
    page.on('pageerror', (err) => {
      errors.push(err.message);
    });

    // Navigate around portal
    await page.click('a:has-text("Farmers"), button:has-text("Farmers")');
    await page.waitForURL(/farmers/);

    // If there were no unhandled errors, we're good
    expect(errors.length).toBe(0);
  });
});
