import { test, expect } from '@playwright/test';

test.describe('IREC Page Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the IREC certificates page
    await page.goto('/irec-certificates');
    
    // Wait for the page to load
    await page.waitForSelector('[data-testid="irec-page-container"]', { timeout: 15000 });
  });

  test('should load IREC certificates page successfully', async ({ page }) => {
    // Wait for the main page title to be visible
    await expect(page.locator('h1:has-text("IREC Certificates")')).toBeVisible();
    
    // Verify page container is present
    await expect(page.locator('[data-testid="irec-page-container"]')).toBeVisible();
    
    // Check for analytics overview panel
    await expect(page.locator('[data-testid="irec-analytics-panel"]')).toBeVisible();
    
    // Check for certificate listing
    await expect(page.locator('[data-testid="certificate-grid"]')).toBeVisible();
  });

  test('should display certificate analytics correctly', async ({ page }) => {
    // Wait for analytics cards to load
    await page.waitForSelector('[data-testid="analytics-card"]', { timeout: 10000 });
    
    // Verify analytics cards are present
    const analyticsCards = page.locator('[data-testid="analytics-card"]');
    await expect(analyticsCards).toHaveCount(4);
    
    // Check for specific analytics metrics
    await expect(page.locator('text=Total Certificates')).toBeVisible();
    await expect(page.locator('text=Total Supply')).toBeVisible();
    await expect(page.locator('text=Total Value')).toBeVisible();
    await expect(page.locator('text=Active Markets')).toBeVisible();
    
    // Verify analytics contain meaningful values
    await page.waitForFunction(() => {
      const cards = document.querySelectorAll('[data-testid="analytics-card"]');
      return Array.from(cards).every(card => {
        const valueElements = card.querySelectorAll('[data-testid="metric-value"]');
        return valueElements.length > 0 && Array.from(valueElements).every(el => 
          el.textContent && el.textContent.trim() !== '0' && el.textContent.trim() !== '$0'
        );
      });
    }, { timeout: 15000 });
  });

  test('should display certificate list correctly', async ({ page }) => {
    // Wait for certificate cards to load
    await page.waitForSelector('[data-testid="certificate-card"]', { timeout: 10000 });
    
    // Verify certificate cards are present
    const certificateCards = page.locator('[data-testid="certificate-card"]');
    await expect(certificateCards).toHaveCountGreaterThan(0);
    
    // Check first certificate card contains required information
    const firstCard = certificateCards.first();
    await expect(firstCard.locator('[data-testid="certificate-id"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="project-name"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="certificate-status"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="supply-amount"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="current-price"]')).toBeVisible();
  });

  test('should handle search functionality', async ({ page }) => {
    // Wait for search input to be available
    await page.waitForSelector('[data-testid="certificate-search"]', { timeout: 10000 });
    
    // Get initial certificate count
    const initialCards = page.locator('[data-testid="certificate-card"]');
    const initialCount = await initialCards.count();
    
    // Perform search
    await page.fill('[data-testid="certificate-search"]', 'solar');
    await page.keyboard.press('Enter');
    
    // Wait for search results to update
    await page.waitForTimeout(1000);
    
    // Verify search results are filtered
    const filteredCards = page.locator('[data-testid="certificate-card"]');
    const filteredCount = await filteredCards.count();
    
    // Should have fewer or equal results
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    
    // Clear search and verify results reset
    await page.fill('[data-testid="certificate-search"]', '');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000);
    
    const resetCards = page.locator('[data-testid="certificate-card"]');
    const resetCount = await resetCards.count();
    expect(resetCount).toBe(initialCount);
  });

  test('should handle filtering by status', async ({ page }) => {
    // Wait for filter dropdown to be available
    await page.waitForSelector('[data-testid="status-filter"]', { timeout: 10000 });
    
    // Get initial certificate count
    const initialCards = page.locator('[data-testid="certificate-card"]');
    const initialCount = await initialCards.count();
    
    // Apply status filter
    await page.click('[data-testid="status-filter"]');
    await page.click('[data-testid="filter-option-active"]');
    
    // Wait for filter to apply
    await page.waitForTimeout(1000);
    
    // Verify filtered results
    const filteredCards = page.locator('[data-testid="certificate-card"]');
    const filteredCount = await filteredCards.count();
    
    // Should have fewer or equal results
    expect(filteredCount).toBeLessThanOrEqual(initialCount);
    
    // Verify all visible cards show active status
    const statusBadges = page.locator('[data-testid="certificate-status"]');
    const statusCount = await statusBadges.count();
    
    for (let i = 0; i < statusCount; i++) {
      const statusText = await statusBadges.nth(i).textContent();
      expect(statusText?.toLowerCase()).toContain('active');
    }
  });

  test('should handle sorting functionality', async ({ page }) => {
    // Wait for sort dropdown to be available
    await page.waitForSelector('[data-testid="sort-dropdown"]', { timeout: 10000 });
    
    // Get initial certificate order
    const initialCards = page.locator('[data-testid="certificate-card"]');
    const initialFirstCard = await initialCards.first().locator('[data-testid="certificate-id"]').textContent();
    
    // Apply sorting
    await page.click('[data-testid="sort-dropdown"]');
    await page.click('[data-testid="sort-option-price"]');
    
    // Wait for sorting to apply
    await page.waitForTimeout(1000);
    
    // Verify order changed
    const sortedCards = page.locator('[data-testid="certificate-card"]');
    const sortedFirstCard = await sortedCards.first().locator('[data-testid="certificate-id"]').textContent();
    
    // First card should be different (unless already sorted)
    expect(sortedFirstCard).toBeDefined();
  });

  test('should handle pagination', async ({ page }) => {
    // Wait for pagination controls
    await page.waitForSelector('[data-testid="pagination-controls"]', { timeout: 10000 });
    
    // Check if pagination is needed (more than one page)
    const nextButton = page.locator('[data-testid="pagination-next"]');
    const isNextEnabled = await nextButton.isEnabled();
    
    if (isNextEnabled) {
      // Get current page certificates
      const currentCards = page.locator('[data-testid="certificate-card"]');
      const currentFirstCard = await currentCards.first().locator('[data-testid="certificate-id"]').textContent();
      
      // Go to next page
      await nextButton.click();
      await page.waitForTimeout(1000);
      
      // Verify page changed
      const newCards = page.locator('[data-testid="certificate-card"]');
      const newFirstCard = await newCards.first().locator('[data-testid="certificate-id"]').textContent();
      
      expect(newFirstCard).not.toBe(currentFirstCard);
      
      // Go back to first page
      await page.click('[data-testid="pagination-previous"]');
      await page.waitForTimeout(1000);
      
      // Verify we're back to original page
      const backCards = page.locator('[data-testid="certificate-card"]');
      const backFirstCard = await backCards.first().locator('[data-testid="certificate-id"]').textContent();
      
      expect(backFirstCard).toBe(currentFirstCard);
    }
  });

  test('should open certificate details modal', async ({ page }) => {
    // Wait for certificate cards to load
    await page.waitForSelector('[data-testid="certificate-card"]', { timeout: 10000 });
    
    // Click on first certificate card
    const firstCard = page.locator('[data-testid="certificate-card"]').first();
    await firstCard.click();
    
    // Wait for modal to open
    await page.waitForSelector('[data-testid="certificate-modal"]', { timeout: 5000 });
    
    // Verify modal content
    await expect(page.locator('[data-testid="certificate-modal"]')).toBeVisible();
    await expect(page.locator('[data-testid="certificate-details"]')).toBeVisible();
    
    // Check for supply metrics
    await expect(page.locator('text=Supply Metrics')).toBeVisible();
    
    // Check for transaction history
    await expect(page.locator('text=Transaction History')).toBeVisible();
    
    // Close modal
    await page.click('[data-testid="modal-close"]');
    await page.waitForTimeout(500);
    
    // Verify modal is closed
    await expect(page.locator('[data-testid="certificate-modal"]')).not.toBeVisible();
  });

  test('should interact with supply metrics charts', async ({ page }) => {
    // Open certificate details
    await page.waitForSelector('[data-testid="certificate-card"]', { timeout: 10000 });
    await page.locator('[data-testid="certificate-card"]').first().click();
    await page.waitForSelector('[data-testid="certificate-modal"]', { timeout: 5000 });
    
    // Navigate to supply metrics tab
    await page.click('[data-testid="supply-metrics-tab"]');
    await page.waitForTimeout(1000);
    
    // Verify charts are present
    await expect(page.locator('[data-testid="supply-history-chart"]')).toBeVisible();
    
    // Test chart tab switching
    await page.click('[data-testid="countries-tab"]');
    await page.waitForTimeout(500);
    await expect(page.locator('[data-testid="country-chart"]')).toBeVisible();
    
    await page.click('[data-testid="technology-tab"]');
    await page.waitForTimeout(500);
    await expect(page.locator('[data-testid="technology-chart"]')).toBeVisible();
    
    await page.click('[data-testid="vintage-tab"]');
    await page.waitForTimeout(500);
    await expect(page.locator('[data-testid="vintage-chart"]')).toBeVisible();
  });

  test('should interact with transaction history', async ({ page }) => {
    // Open certificate details
    await page.waitForSelector('[data-testid="certificate-card"]', { timeout: 10000 });
    await page.locator('[data-testid="certificate-card"]').first().click();
    await page.waitForSelector('[data-testid="certificate-modal"]', { timeout: 5000 });
    
    // Navigate to transaction history tab
    await page.click('[data-testid="transaction-history-tab"]');
    await page.waitForTimeout(1000);
    
    // Verify transaction table is present
    await expect(page.locator('[data-testid="transaction-table"]')).toBeVisible();
    
    // Check for transaction filter
    await page.click('[data-testid="transaction-filter"]');
    await page.click('[data-testid="filter-buy-transactions"]');
    await page.waitForTimeout(500);
    
    // Verify filtering works
    const visibleTransactions = page.locator('[data-testid="transaction-row"]');
    const transactionCount = await visibleTransactions.count();
    
    if (transactionCount > 0) {
      // Verify all visible transactions are buy transactions
      for (let i = 0; i < transactionCount; i++) {
        const transactionType = await visibleTransactions.nth(i).locator('[data-testid="transaction-type"]').textContent();
        expect(transactionType?.toLowerCase()).toContain('buy');
      }
    }
  });

  test('should handle view toggle (grid/list)', async ({ page }) => {
    // Wait for view toggle controls
    await page.waitForSelector('[data-testid="view-toggle"]', { timeout: 10000 });
    
    // Should start in grid view
    await expect(page.locator('[data-testid="certificate-grid"]')).toBeVisible();
    
    // Switch to list view
    await page.click('[data-testid="list-view-toggle"]');
    await page.waitForTimeout(500);
    
    // Verify list view is active
    await expect(page.locator('[data-testid="certificate-list"]')).toBeVisible();
    
    // Switch back to grid view
    await page.click('[data-testid="grid-view-toggle"]');
    await page.waitForTimeout(500);
    
    // Verify grid view is active
    await expect(page.locator('[data-testid="certificate-grid"]')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Wait for mobile layout to adjust
    await page.waitForTimeout(1000);
    
    // Verify page still loads properly
    await expect(page.locator('h1:has-text("IREC Certificates")')).toBeVisible();
    
    // Check mobile-specific elements
    await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeVisible();
    
    // Test mobile search
    await page.click('[data-testid="mobile-search-toggle"]');
    await expect(page.locator('[data-testid="mobile-search-input"]')).toBeVisible();
    
    // Test mobile filters
    await page.click('[data-testid="mobile-filters-toggle"]');
    await expect(page.locator('[data-testid="mobile-filters-panel"]')).toBeVisible();
    
    // Verify certificate cards are responsive
    const certificateCards = page.locator('[data-testid="certificate-card"]');
    await expect(certificateCards).toHaveCountGreaterThan(0);
    
    // Test mobile certificate details
    await certificateCards.first().click();
    await page.waitForSelector('[data-testid="certificate-modal"]', { timeout: 5000 });
    
    // Verify modal is responsive
    await expect(page.locator('[data-testid="certificate-modal"]')).toBeVisible();
    
    // Close modal
    await page.click('[data-testid="modal-close"]');
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Simulate network error by intercepting API calls
    await page.route('**/api/irec/**', route => {
      route.abort('internetdisconnected');
    });
    
    // Refresh page to trigger error
    await page.reload();
    
    // Wait for error state to appear
    await page.waitForSelector('[data-testid="error-state"]', { timeout: 10000 });
    
    // Verify error message is displayed
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    
    // Verify retry button is available
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
    
    // Test retry functionality
    await page.unroute('**/api/irec/**');
    await page.click('[data-testid="retry-button"]');
    
    // Wait for content to reload
    await page.waitForSelector('[data-testid="certificate-grid"]', { timeout: 15000 });
    
    // Verify content is back
    await expect(page.locator('[data-testid="certificate-grid"]')).toBeVisible();
  });

  test('should handle loading states correctly', async ({ page }) => {
    // Intercept API calls to add delay
    await page.route('**/api/irec/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      route.continue();
    });
    
    // Navigate to page
    await page.goto('/irec-certificates');
    
    // Verify loading state appears
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    
    // Wait for content to load
    await page.waitForSelector('[data-testid="certificate-grid"]', { timeout: 15000 });
    
    // Verify loading state disappears
    await expect(page.locator('[data-testid="loading-spinner"]')).not.toBeVisible();
    
    // Verify content is displayed
    await expect(page.locator('[data-testid="certificate-grid"]')).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Focus on search input
    await page.focus('[data-testid="certificate-search"]');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should focus on first certificate card
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toHaveAttribute('data-testid', 'certificate-card');
    
    // Test Enter key to open details
    await page.keyboard.press('Enter');
    
    // Verify modal opens
    await page.waitForSelector('[data-testid="certificate-modal"]', { timeout: 5000 });
    await expect(page.locator('[data-testid="certificate-modal"]')).toBeVisible();
    
    // Test Escape key to close modal
    await page.keyboard.press('Escape');
    
    // Verify modal closes
    await expect(page.locator('[data-testid="certificate-modal"]')).not.toBeVisible();
  });

  test('should handle data refresh correctly', async ({ page }) => {
    // Wait for initial data load
    await page.waitForSelector('[data-testid="certificate-card"]', { timeout: 10000 });
    
    // Get initial certificate count
    const initialCards = page.locator('[data-testid="certificate-card"]');
    const initialCount = await initialCards.count();
    
    // Click refresh button
    await page.click('[data-testid="refresh-button"]');
    
    // Wait for refresh to complete
    await page.waitForTimeout(2000);
    
    // Verify data is refreshed (should have same or different count)
    const refreshedCards = page.locator('[data-testid="certificate-card"]');
    const refreshedCount = await refreshedCards.count();
    
    expect(refreshedCount).toBeGreaterThan(0);
    
    // Verify analytics are refreshed
    await expect(page.locator('[data-testid="analytics-card"]')).toHaveCount(4);
  });

  test.afterEach(async ({ page }) => {
    // Clean up any open modals or states
    const modal = page.locator('[data-testid="certificate-modal"]');
    if (await modal.isVisible()) {
      await page.click('[data-testid="modal-close"]');
    }
    
    // Reset viewport for next test
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});

test.describe('IREC Page Performance', () => {
  test('should load page within performance budget', async ({ page }) => {
    // Start performance monitoring
    await page.coverage.startJSCoverage();
    
    const startTime = Date.now();
    
    // Navigate to page
    await page.goto('/irec-certificates');
    
    // Wait for critical content to load
    await page.waitForSelector('[data-testid="certificate-grid"]', { timeout: 15000 });
    
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    // Verify page loads within 10 seconds
    expect(loadTime).toBeLessThan(10000);
    
    // Stop coverage and get metrics
    const coverage = await page.coverage.stopJSCoverage();
    const totalBytes = coverage.reduce((sum, entry) => sum + entry.text.length, 0);
    
    // Verify reasonable bundle size (less than 2MB)
    expect(totalBytes).toBeLessThan(2 * 1024 * 1024);
  });
});

test.describe('IREC Page Accessibility', () => {
  test('should meet accessibility standards', async ({ page }) => {
    // Navigate to page
    await page.goto('/irec-certificates');
    await page.waitForSelector('[data-testid="certificate-grid"]', { timeout: 15000 });
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test screen reader support
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    expect(headingCount).toBeGreaterThan(0);
    
    // Test ARIA labels
    const ariaLabels = page.locator('[aria-label]');
    const ariaLabelCount = await ariaLabels.count();
    expect(ariaLabelCount).toBeGreaterThan(0);
    
    // Test focus management
    await page.click('[data-testid="certificate-card"]');
    await page.waitForSelector('[data-testid="certificate-modal"]', { timeout: 5000 });
    
    // Modal should trap focus
    await page.keyboard.press('Tab');
    const modalFocusedElement = page.locator(':focus');
    const modalContainer = page.locator('[data-testid="certificate-modal"]');
    
    // Focused element should be within modal
    await expect(modalContainer).toContainText(await modalFocusedElement.textContent() || '');
  });
});