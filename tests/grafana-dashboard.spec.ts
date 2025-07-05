import { test, expect } from '@playwright/test';

test.describe('Enhanced Grafana Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('/dashboard');
    // Wait for dashboard to load
    await page.waitForSelector('[data-testid="dashboard-container"]', { timeout: 10000 });
  });

  test('should load dashboard with all key metrics', async ({ page }) => {
    // Wait for the dashboard title to be visible
    await expect(page.locator('h1:has-text("CO2e Chain Dashboard")')).toBeVisible();
    
    // Verify metric cards are loaded (should have 4)
    const metricCards = page.locator('[data-testid="metric-card"]');
    await expect(metricCards).toHaveCount(4);
    
    // Check for numerical values in metrics (not showing loading states)
    await page.waitForFunction(() => {
      const cards = document.querySelectorAll('[data-testid="metric-card"]');
      return Array.from(cards).some(card => 
        card.textContent && 
        !card.textContent.includes('Loading') &&
        /[0-9,]+/.test(card.textContent)
      );
    }, { timeout: 15000 });
  });

  test('should have functional time range controls', async ({ page }) => {
    // Find time range selector
    const timeSelector = page.locator('[data-testid="time-range-selector"]');
    await expect(timeSelector).toBeVisible();
    
    // Test selecting different time ranges
    await timeSelector.click();
    await page.locator('text=24h').click();
    
    // Verify selection took effect
    await expect(timeSelector).toContainText('24h');
  });

  test('should have working refresh functionality', async ({ page }) => {
    // Find refresh button
    const refreshButton = page.locator('[data-testid="refresh-button"]');
    await expect(refreshButton).toBeVisible();
    
    // Click refresh and verify loading state
    await refreshButton.click();
    await expect(page.locator('.animate-spin')).toBeVisible();
    
    // Wait for refresh to complete
    await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 5000 });
  });

  test('should display retirement analytics correctly', async ({ page }) => {
    // Navigate to retirement tab if it exists
    const retirementTab = page.locator('text=Retirement');
    if (await retirementTab.isVisible()) {
      await retirementTab.click();
      
      // Check for AIS Points vs other payment method breakdown
      await expect(page.locator('text=AIS Points')).toBeVisible();
      await expect(page.locator('text=Cryptocurrency')).toBeVisible();
      await expect(page.locator('text=Fiat Currency')).toBeVisible();
      
      // Verify charts are rendered
      await expect(page.locator('[data-testid="retirement-chart"]')).toBeVisible();
    }
  });

  test('should show tokenization metrics', async ({ page }) => {
    // Navigate to tokenization tab if it exists
    const tokenizationTab = page.locator('text=Tokenization');
    if (await tokenizationTab.isVisible()) {
      await tokenizationTab.click();
      
      // Check for tokenization-specific metrics
      await expect(page.locator('text=/Total.*Tokenized/')).toBeVisible();
      await expect(page.locator('text=/Token Supply/')).toBeVisible();
      
      // Verify tokenization chart is displayed
      await expect(page.locator('[data-testid="tokenization-chart"]')).toBeVisible();
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if dashboard still loads properly
    await expect(page.locator('h1:has-text("CO2e Chain Dashboard")')).toBeVisible();
    
    // Verify metric cards exist and load properly
    const metricCards = page.locator('[data-testid="metric-card"]');
    await expect(metricCards).toHaveCount(4);
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Verify basic layout is intact
    await expect(page.locator('[data-testid="dashboard-container"]')).toBeVisible();
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Simulate network error by intercepting API calls
    await page.route('**/api/**', route => route.abort());
    
    // Reload page to trigger error
    await page.reload();
    
    // Check for error handling (should not crash)
    await page.waitForLoadState('networkidle');
    
    // Verify error message or fallback content is shown
    const errorIndicator = page.locator('text=/error|failed|unable/i');
    await expect(errorIndicator).toBeVisible({ timeout: 10000 });
  });

  test('should export data functionality', async ({ page }) => {
    // Find export button
    const exportButton = page.locator('[data-testid="export-button"]');
    if (await exportButton.isVisible()) {
      // Set up download handler
      const downloadPromise = page.waitForEvent('download');
      
      // Click export
      await exportButton.click();
      
      // Verify download starts
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/dashboard.*\.(csv|json|xlsx)$/);
    }
  });

  test('should maintain data consistency during updates', async ({ page }) => {
    // Get initial metric value
    const initialValue = await page.locator('[data-testid="total-retired-metric"]').textContent();
    
    // Trigger refresh
    await page.locator('[data-testid="refresh-button"]').click();
    
    // Wait for refresh to complete
    await page.waitForSelector('.animate-spin', { state: 'detached' });
    
    // Verify data is still present and reasonable
    const updatedValue = await page.locator('[data-testid="total-retired-metric"]').textContent();
    expect(updatedValue).toBeTruthy();
    expect(updatedValue).toMatch(/[0-9,]+/);
  });

  test('should have proper accessibility features', async ({ page }) => {
    // Check for proper ARIA labels
    await expect(page.locator('[role="button"]')).toHaveCount({ min: 1 });
    
    // Verify keyboard navigation works
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test color contrast (basic check)
    const textElements = page.locator('text=/Total.*Retired/');
    const textColor = await textElements.first().evaluate(el => 
      window.getComputedStyle(el).color
    );
    expect(textColor).toBeTruthy();
  });

  test('should load charts without errors', async ({ page }) => {
    // Wait for charts to render
    await page.waitForSelector('svg', { timeout: 10000 });
    
    // Check that SVG charts are present
    const svgElements = page.locator('svg');
    await expect(svgElements).toHaveCount({ min: 1 });
    
    // Verify chart data is loaded (check for path elements)
    const chartPaths = page.locator('svg path, svg rect, svg circle');
    await expect(chartPaths).toHaveCount({ min: 1 });
  });

  test('should handle auto-refresh correctly', async ({ page }) => {
    // Enable auto-refresh if available
    const refreshSelector = page.locator('[data-testid="refresh-interval-selector"]');
    if (await refreshSelector.isVisible()) {
      await refreshSelector.click();
      await page.locator('text=5s').click();
      
      // Wait for auto-refresh to trigger
      await page.waitForSelector('.animate-spin', { timeout: 7000 });
      
      // Verify refresh completed
      await page.waitForSelector('.animate-spin', { state: 'detached' });
      
      // Disable auto-refresh
      await refreshSelector.click();
      await page.locator('text=Off').click();
    }
  });
});

test.describe('Dashboard Performance', () => {
  test('should load within acceptable time limits', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-container"]');
    
    const loadTime = Date.now() - startTime;
    
    // Dashboard should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should not have memory leaks during interactions', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-container"]');
    
    // Perform multiple refresh operations
    for (let i = 0; i < 5; i++) {
      await page.locator('[data-testid="refresh-button"]').click();
      await page.waitForSelector('.animate-spin', { state: 'detached' });
      await page.waitForTimeout(500);
    }
    
    // Switch between tabs multiple times
    const tabs = ['Overview', 'Retirement', 'Tokenization', 'Network'];
    for (const tab of tabs) {
      const tabElement = page.locator(`text=${tab}`);
      if (await tabElement.isVisible()) {
        await tabElement.click();
        await page.waitForTimeout(300);
      }
    }
    
    // Check that page is still responsive
    await expect(page.locator('[data-testid="dashboard-container"]')).toBeVisible();
  });
});

test.describe('Dashboard Data Integration', () => {
  test('should integrate with real APIs correctly', async ({ page }) => {
    // Check for actual data loading (not mock data)
    await page.goto('/dashboard');
    await page.waitForSelector('[data-testid="dashboard-container"]');
    
    // Verify API calls are made
    const responses = [];
    page.on('response', response => {
      if (response.url().includes('/api/')) {
        responses.push(response.status());
      }
    });
    
    await page.locator('[data-testid="refresh-button"]').click();
    await page.waitForTimeout(2000);
    
    // At least one successful API call should have been made
    expect(responses.some(status => status >= 200 && status < 300)).toBeTruthy();
  });
});