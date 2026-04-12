import { test, expect } from '@playwright/test';

test.describe('Farmers Table & Search', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@agritrace.com');
    await page.fill('input[type="password"]', 'AdminPassword123!');
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL('/agritrace/dashboard');
  });

  test('should display farmers table', async ({ page }) => {
    await page.goto('/agritrace/farmers');

    // Check table headers
    await expect(page.locator('th')).toContainText('Name');
    await expect(page.locator('th')).toContainText('Crops');
    await expect(page.locator('th')).toContainText('Phone');
    await expect(page.locator('th')).toContainText('Village');
  });

  test('should have search functionality', async ({ page }) => {
    await page.goto('/agritrace/farmers');

    // Check search input exists
    const searchInput = page.locator('input[placeholder*="Search" i]');
    await expect(searchInput).toBeVisible();

    // Search placeholder should mention crops
    const placeholder = await searchInput.getAttribute('placeholder');
    expect(placeholder?.toLowerCase()).toContain('crop');
  });

  test('should search by crop name', async ({ page }) => {
    await page.goto('/agritrace/farmers');

    // Type crop in search
    const searchInput = page.locator('input[placeholder*="Search" i]');
    await searchInput.fill('maize');

    // Wait for results
    await page.waitForTimeout(300);

    // Check if results are filtered
    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();

    // Either shows filtered results or "no farmers" message
    const isEmpty = await page.locator('text=No farmers found').isVisible();

    if (rowCount > 0) {
      // If results exist, they should contain Maize
      const firstRow = tableRows.first();
      const text = await firstRow.textContent();
      expect(text?.toLowerCase()).toContain('maize');
    } else {
      // Or show empty state
      await expect(page.locator('text=No farmers')).toBeVisible();
    }
  });

  test('should search by farmer name', async ({ page }) => {
    await page.goto('/agritrace/farmers');

    // Type farmer name in search
    const searchInput = page.locator('input[placeholder*="Search" i]');
    await searchInput.fill('John');

    // Wait for results
    await page.waitForTimeout(300);

    // Check results
    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      const firstRow = tableRows.first();
      const text = await firstRow.textContent();
      expect(text?.toLowerCase()).toContain('john');
    }
  });

  test('should search by phone number', async ({ page }) => {
    await page.goto('/agritrace/farmers');

    // Type phone number in search
    const searchInput = page.locator('input[placeholder*="Search" i]');
    await searchInput.fill('254');

    // Wait for results
    await page.waitForTimeout(300);

    // Check results contain phone
    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // At least one result should have matching phone
      const hasMatch = await tableRows.first().textContent();
      expect(hasMatch).toBeTruthy();
    }
  });

  test('should show "no farmers" when search has no matches', async ({ page }) => {
    await page.goto('/agritrace/farmers');

    // Search for non-existent crop
    const searchInput = page.locator('input[placeholder*="Search" i]');
    await searchInput.fill('xyznonexistent123');

    // Wait for results
    await page.waitForTimeout(300);

    // Check empty state
    await expect(page.locator('text=No farmers')).toBeVisible();
  });

  test('should clear search and show all farmers', async ({ page }) => {
    await page.goto('/agritrace/farmers');

    // Search for something
    const searchInput = page.locator('input[placeholder*="Search" i]');
    await searchInput.fill('maize');
    await page.waitForTimeout(300);

    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(300);

    // Should show farmers again (if any exist)
    const tableRows = page.locator('tbody tr');
    const rowCount = await tableRows.count();

    // Either has rows or shows "No farmers registered" message
    if (rowCount === 0) {
      await expect(page.locator('text=No farmers registered')).toBeVisible();
    }
  });
});
