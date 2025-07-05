
import { test, expect } from '@playwright/test';

test.describe('Grafana Dashboard', () => {
  test('should display the Grafana-style dashboard with retirement stats', async ({ page }) => {
    test.setTimeout(60000);

    page.on('console', msg => console.log(msg.text()));

    await page.goto('http://localhost:3000/dashboard');

    await page.waitForSelector('h1:has-text("Carbon Credit Dashboard")');

    // Check for the main dashboard title
    await expect(page.locator('h1:has-text("Carbon Credit Dashboard")')).toBeVisible();

    // Check for the retirement tracking card
    await expect(page.locator('h2:has-text("Retirement Tracking")')).toBeVisible();

    // Check for the retirement chart
    await expect(page.locator('.recharts-wrapper')).toBeVisible();

    // Check for the total tokenized and total retired stats
    await expect(page.locator('p:has-text("Total Tokenized")')).toBeVisible();
    await expect(page.locator('p:has-text("Total Retired")')).toBeVisible();
  });
});
