import { test, expect } from '@playwright/test';

/**
 * JEEWAN End-to-End Smoke Tests 
 * Command to run: npx playwright test tests/e2e/playwright_smoke.spec.ts
 */
test.describe('JEEWAN Production Integration Walkthrough', () => {
  const BASE_URL = 'http://localhost:3000';

  test('Critical Flow: Core application boots without fatal errors', async ({ page }) => {
    await page.goto(BASE_URL);
    // Explicitly verify Next.js hydration success
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('Vital Service: High-priority SOS interceptor is accessible globally', async ({ page }) => {
    await page.goto(BASE_URL);
    // Finds the red emergency banner/button
    const sosTrigger = page.locator('button:has-text("SOS")').first();
    await expect(sosTrigger).toBeVisible();
  });

  test('Therapeutic Service: Risk Psychometrics interface is actionable', async ({ page }) => {
    await page.goto(`${BASE_URL}/quiz`);
    // Ensure the DAST-10 wizard successfully parsed 
    await expect(page.locator('text=/DAST-10/i').first()).toBeVisible();
  });
});
