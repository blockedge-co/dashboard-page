import { test, expect } from '@playwright/test';

test.describe('Dashboard Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('/dashboard');
    // Wait for dashboard to load
    await page.waitForSelector('[data-testid="dashboard-container"]', { timeout: 15000 });
  });

  test('should load dashboard successfully', async ({ page }) => {
    // Wait for the dashboard title to be visible
    await expect(page.locator('h1:has-text("CO2e Chain Dashboard")')).toBeVisible();
    
    // Verify dashboard container is present
    await expect(page.locator('[data-testid="dashboard-container"]')).toBeVisible();
  });

  test('should display metric cards', async ({ page }) => {
    // Verify metric cards are loaded
    const metricCards = page.locator('[data-testid="metric-card"]');
    await expect(metricCards).toHaveCount(4);
    
    // Check that cards contain meaningful content
    await page.waitForFunction(() => {
      const cards = document.querySelectorAll('[data-testid="metric-card"]');
      return cards.length === 4 && Array.from(cards).every(card => 
        card.textContent && card.textContent.trim().length > 0
      );
    }, { timeout: 10000 });
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if dashboard still loads properly
    await expect(page.locator('h1:has-text("CO2e Chain Dashboard")')).toBeVisible();
    
    // Verify dashboard is still functional
    await expect(page.locator('[data-testid="dashboard-container"]')).toBeVisible();
    await expect(page.locator('[data-testid="metric-card"]')).toHaveCount(4);
  });

  test('should handle page reload gracefully', async ({ page }) => {
    // Wait for initial load
    await expect(page.locator('h1:has-text("CO2e Chain Dashboard")')).toBeVisible();
    
    // Reload the page
    await page.reload();
    
    // Verify dashboard loads again
    await page.waitForSelector('[data-testid="dashboard-container"]', { timeout: 15000 });
    await expect(page.locator('h1:has-text("CO2e Chain Dashboard")')).toBeVisible();
    await expect(page.locator('[data-testid="metric-card"]')).toHaveCount(4);
  });

  test('should display charts and visualizations', async ({ page }) => {
    // Wait for dashboard to load
    await expect(page.locator('h1:has-text("CO2e Chain Dashboard")')).toBeVisible();
    
    // Check for presence of SVG charts (Recharts renders SVG)
    await page.waitForSelector('svg', { timeout: 10000 });
    
    // Verify multiple charts are present
    const svgElements = page.locator('svg');
    await expect(svgElements.first()).toBeVisible();
  });

  test('should have proper page structure', async ({ page }) => {
    // Check basic HTML structure
    await expect(page.locator('html')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
    
    // Verify dashboard specific structure
    await expect(page.locator('[data-testid="dashboard-container"]')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });
});

test.describe('Dashboard Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-container"]', { timeout: 15000 });
    
    const loadTime = Date.now() - startTime;
    
    // Dashboard should load within 15 seconds
    expect(loadTime).toBeLessThan(15000);
  });

  test('should not have JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-container"]', { timeout: 15000 });
    
    // Wait a bit for any async errors
    await page.waitForTimeout(2000);
    
    // Check that no critical JavaScript errors occurred
    const criticalErrors = errors.filter(error => 
      !error.includes('Warning:') && 
      !error.includes('chunk') &&
      !error.toLowerCase().includes('network')
    );
    
    expect(criticalErrors).toEqual([]);
  });
});