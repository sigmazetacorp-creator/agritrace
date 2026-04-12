import { test, expect } from '@playwright/test';

test.describe('Harvest Recording Form', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@agritrace.com');
    await page.fill('input[type="password"]', 'AdminPassword123!');
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL('/agritrace/dashboard');
  });

  test('should display harvest form page', async ({ page }) => {
    await page.goto('/agritrace/harvests/new');

    // Check form title
    await expect(page.locator('h1, h2')).toContainText(/log|record|harvest/i);

    // Check required fields
    await expect(page.locator('label')).toContainText('Farm');
    await expect(page.locator('label')).toContainText('Crop');
    await expect(page.locator('label')).toContainText('Quantity');
    await expect(page.locator('label')).toContainText('Date');
    await expect(page.locator('label')).toContainText('Quality');
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/agritrace/harvests/new');

    // Try to submit empty form
    await page.click('button:has-text("Log Harvest")');

    // Check for validation errors
    await expect(page.locator('text=Please select a farm')).toBeVisible();
    await expect(page.locator('text=Crop is required')).toBeVisible();
    await expect(page.locator('text=Quantity is required')).toBeVisible();
  });

  test('should prevent future harvest dates', async ({ page }) => {
    await page.goto('/agritrace/harvests/new');

    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Try to set future date
    const dateInput = page.locator('input[type="date"]');
    await dateInput.fill(tomorrowStr);

    // Submit
    await page.click('button:has-text("Log Harvest")');

    // Check error
    await expect(page.locator('text=cannot be in the future')).toBeVisible();
  });

  test('should require positive quantity', async ({ page }) => {
    await page.goto('/agritrace/harvests/new');

    // Select farm (if available)
    const farmSelect = page.locator('select').first();
    const options = await farmSelect.locator('option').count();
    if (options > 1) {
      await farmSelect.selectOption({ index: 1 });
    }

    // Fill form with negative quantity
    await page.fill('input[placeholder*="kg" i]', '-50');

    // Submit
    await page.click('button:has-text("Log Harvest")');

    // Check error
    await expect(page.locator('text=must be greater than 0')).toBeVisible();
  });

  test('should clear errors on input change', async ({ page }) => {
    await page.goto('/agritrace/harvests/new');

    // Try to submit empty
    await page.click('button:has-text("Log Harvest")');
    await expect(page.locator('text=Crop is required')).toBeVisible();

    // Fill crop field
    await page.fill('input[placeholder*="crop" i]', 'Maize');

    // Error should disappear
    await expect(page.locator('text=Crop is required')).not.toBeVisible();
  });

  test('should show farm details preview on selection', async ({ page }) => {
    await page.goto('/agritrace/harvests/new');

    // Select farm
    const farmSelect = page.locator('select').first();
    const options = await farmSelect.locator('option').count();
    if (options > 1) {
      await farmSelect.selectOption({ index: 1 });

      // Check preview appears
      await expect(page.locator('text=Size:')).toBeVisible();
      await expect(page.locator('text=hectares')).toBeVisible();
    }
  });
});
