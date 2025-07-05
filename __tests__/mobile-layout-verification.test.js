/**
 * Mobile Layout Verification Test Suite
 * 
 * Comprehensive testing for responsive design across mobile, tablet, and desktop viewports.
 * Tests both retirement and tokenization components for proper responsive behavior.
 * 
 * Test Scenarios:
 * - 320px (Mobile Portrait) - Small mobile devices
 * - 768px (Tablet) - iPad and similar tablets  
 * - 1024px (Desktop) - Standard desktop breakpoint
 * 
 * Verification Points:
 * - Grid layouts stack properly (grid-cols-1 on mobile)
 * - Interactive elements are touch-friendly (44px+ touch targets)
 * - Charts remain readable and responsive
 * - Text scales appropriately
 * - Components don't overflow viewport
 * - Navigation remains accessible
 */

const puppeteer = require('puppeteer');
const path = require('path');

// Viewport configurations for different screen sizes
const VIEWPORTS = {
  mobile: { width: 320, height: 568, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  mobileLarge: { width: 375, height: 812, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  tablet: { width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  desktop: { width: 1024, height: 768, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  desktopLarge: { width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false }
};

// Touch target minimum size (44px recommended by Apple/Google)
const MIN_TOUCH_TARGET_SIZE = 44;

// Test timeout
const TEST_TIMEOUT = 60000;

class MobileLayoutVerifier {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
  }

  async setup() {
    console.log('🚀 Setting up Mobile Layout Verification Tests...');
    
    this.browser = await puppeteer.launch({
      headless: process.env.CI !== 'false',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });

    this.page = await this.browser.newPage();
    
    // Enable console logging
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('🔴 Browser Console Error:', msg.text());
      }
    });

    // Enable request interception for network monitoring
    await this.page.setRequestInterception(true);
    this.page.on('request', request => request.continue());
    
    console.log('✅ Browser setup complete');
  }

  async teardown() {
    if (this.browser) {
      await this.browser.close();
      console.log('✅ Browser closed');
    }
  }

  async navigateToPage(path = '/dashboard') {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}${path}`;
    
    console.log(`📱 Navigating to: ${url}`);
    
    await this.page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for main content to load
    await this.page.waitForSelector('[data-testid="dashboard-content"], .dashboard-layout, main', {
      timeout: 10000
    }).catch(() => {
      console.warn('⚠️ No dashboard content selector found, continuing...');
    });
  }

  async setViewport(viewportName) {
    const viewport = VIEWPORTS[viewportName];
    if (!viewport) {
      throw new Error(`Unknown viewport: ${viewportName}`);
    }

    console.log(`📐 Setting viewport to ${viewportName}: ${viewport.width}x${viewport.height}`);
    await this.page.setViewport(viewport);
    
    // Wait for layout to settle
    await this.page.waitForTimeout(1000);
  }

  async verifyGridLayout(viewportName) {
    console.log(`🔍 Verifying grid layout for ${viewportName}`);
    
    const gridResults = await this.page.evaluate((viewport) => {
      const results = [];
      
      // Find all grid containers
      const gridContainers = document.querySelectorAll('[class*="grid-cols"], [class*="md:grid-cols"], [class*="lg:grid-cols"]');
      
      gridContainers.forEach((container, index) => {
        const computedStyle = window.getComputedStyle(container);
        const gridTemplateColumns = computedStyle.gridTemplateColumns;
        const classList = Array.from(container.classList);
        
        // Count actual columns
        const columnCount = gridTemplateColumns === 'none' ? 1 : 
                           gridTemplateColumns.split(' ').length;
        
        // Determine expected columns based on viewport
        let expectedColumns = 1; // Default mobile
        if (viewport === 'tablet' && classList.some(c => c.includes('md:grid-cols'))) {
          const mdClass = classList.find(c => c.includes('md:grid-cols'));
          expectedColumns = parseInt(mdClass.match(/md:grid-cols-(\d+)/)?.[1] || '2');
        } else if (viewport === 'desktop' && classList.some(c => c.includes('lg:grid-cols'))) {
          const lgClass = classList.find(c => c.includes('lg:grid-cols'));
          expectedColumns = parseInt(lgClass.match(/lg:grid-cols-(\d+)/)?.[1] || '3');
        }
        
        results.push({
          index,
          selector: container.tagName.toLowerCase() + (container.className ? '.' + container.className.split(' ').join('.') : ''),
          actualColumns: columnCount,
          expectedColumns,
          passes: columnCount === expectedColumns,
          classList: classList.join(' ')
        });
      });
      
      return results;
    }, viewportName);

    return gridResults;
  }

  async verifyTouchTargets(viewportName) {
    console.log(`👆 Verifying touch targets for ${viewportName}`);
    
    if (!VIEWPORTS[viewportName].hasTouch) {
      return { touchTargetsVerified: 0, touchTargetsPass: 0, results: [] };
    }

    const touchResults = await this.page.evaluate((minSize) => {
      const results = [];
      
      // Find all interactive elements
      const interactiveSelectors = [
        'button',
        'a[href]',
        'input[type="button"]',
        'input[type="submit"]',
        '[role="button"]',
        '[onclick]',
        '.clickable',
        '[data-testid*="button"]'
      ];
      
      interactiveSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.width > 0 && rect.height > 0 && 
                           element.offsetParent !== null;
          
          if (isVisible) {
            const width = rect.width;
            const height = rect.height;
            const minDimension = Math.min(width, height);
            const passes = minDimension >= minSize;
            
            results.push({
              selector: selector,
              elementIndex: index,
              width: Math.round(width),
              height: Math.round(height),
              minDimension: Math.round(minDimension),
              passes,
              elementText: element.textContent?.trim().substring(0, 50) || 'No text'
            });
          }
        });
      });
      
      return results;
    }, MIN_TOUCH_TARGET_SIZE);

    const touchTargetsPass = touchResults.filter(r => r.passes).length;
    const touchTargetsTotal = touchResults.length;

    return {
      touchTargetsVerified: touchTargetsTotal,
      touchTargetsPass,
      results: touchResults
    };
  }

  async verifyChartResponsiveness(viewportName) {
    console.log(`📊 Verifying chart responsiveness for ${viewportName}`);
    
    const chartResults = await this.page.evaluate(() => {
      const results = [];
      
      // Find chart containers (Recharts and other chart libraries)
      const chartSelectors = [
        '.recharts-wrapper',
        '.recharts-responsive-container',
        '[class*="chart"]',
        'svg[class*="recharts"]',
        '.chart-container'
      ];
      
      chartSelectors.forEach(selector => {
        const charts = document.querySelectorAll(selector);
        charts.forEach((chart, index) => {
          const rect = chart.getBoundingClientRect();
          const isVisible = rect.width > 0 && rect.height > 0;
          
          if (isVisible) {
            const parentRect = chart.parentElement?.getBoundingClientRect();
            const fitsInParent = parentRect ? 
              (rect.width <= parentRect.width && rect.height <= parentRect.height) : true;
            
            results.push({
              selector,
              index,
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              fitsInParent,
              isVisible,
              passes: isVisible && fitsInParent
            });
          }
        });
      });
      
      return results;
    });

    return chartResults;
  }

  async verifyContentOverflow(viewportName) {
    console.log(`📏 Verifying content overflow for ${viewportName}`);
    
    const overflowResults = await this.page.evaluate(() => {
      const results = [];
      const viewportWidth = window.innerWidth;
      
      // Check for horizontal overflow
      const allElements = document.querySelectorAll('*');
      allElements.forEach((element, index) => {
        if (element.children.length === 0) { // Only check leaf elements
          const rect = element.getBoundingClientRect();
          if (rect.width > 0 && rect.right > viewportWidth + 5) { // 5px tolerance
            results.push({
              tagName: element.tagName.toLowerCase(),
              className: element.className,
              overflowAmount: Math.round(rect.right - viewportWidth),
              elementWidth: Math.round(rect.width),
              viewportWidth,
              passes: false
            });
          }
        }
      });
      
      return results.slice(0, 10); // Limit to first 10 overflow issues
    });

    return overflowResults;
  }

  async verifyNavigationAccessibility(viewportName) {
    console.log(`🧭 Verifying navigation accessibility for ${viewportName}`);
    
    const navResults = await this.page.evaluate(() => {
      const results = {
        mobileMenu: null,
        navLinks: [],
        accessibilityFeatures: []
      };
      
      // Check for mobile menu (hamburger, etc.)
      const mobileMenuSelectors = [
        '[data-testid*="mobile-menu"]',
        '.mobile-menu',
        '[aria-label*="menu"]',
        'button[aria-expanded]'
      ];
      
      mobileMenuSelectors.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
          const rect = element.getBoundingClientRect();
          results.mobileMenu = {
            selector,
            isVisible: rect.width > 0 && rect.height > 0,
            hasAriaLabel: !!element.getAttribute('aria-label'),
            hasAriaExpanded: !!element.getAttribute('aria-expanded')
          };
        }
      });
      
      // Check navigation links
      const navLinks = document.querySelectorAll('nav a, [role="navigation"] a');
      navLinks.forEach((link, index) => {
        const rect = link.getBoundingClientRect();
        results.navLinks.push({
          index,
          text: link.textContent?.trim() || 'No text',
          isVisible: rect.width > 0 && rect.height > 0,
          hasHref: !!link.getAttribute('href'),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        });
      });
      
      return results;
    });

    return navResults;
  }

  async takeScreenshot(viewportName, componentName = 'dashboard') {
    const screenshotPath = path.join(__dirname, 'screenshots', `${componentName}-${viewportName}.png`);
    
    try {
      await this.page.screenshot({
        path: screenshotPath,
        fullPage: true,
        type: 'png'
      });
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
      return screenshotPath;
    } catch (error) {
      console.warn(`⚠️ Failed to take screenshot: ${error.message}`);
      return null;
    }
  }

  async runAllTests(pagePath = '/dashboard', componentName = 'dashboard') {
    const testResults = {
      pagePath,
      componentName,
      timestamp: new Date().toISOString(),
      viewports: {}
    };

    try {
      await this.navigateToPage(pagePath);

      for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
        console.log(`\n🔄 Testing ${viewportName} (${viewport.width}x${viewport.height})`);
        
        await this.setViewport(viewportName);
        
        const viewportResults = {
          viewport: viewport,
          gridLayout: await this.verifyGridLayout(viewportName),
          touchTargets: await this.verifyTouchTargets(viewportName),
          charts: await this.verifyChartResponsiveness(viewportName),
          overflow: await this.verifyContentOverflow(viewportName),
          navigation: await this.verifyNavigationAccessibility(viewportName),
          screenshot: await this.takeScreenshot(viewportName, componentName)
        };

        testResults.viewports[viewportName] = viewportResults;
        
        // Summary for this viewport
        const gridPass = viewportResults.gridLayout.filter(g => g.passes).length;
        const gridTotal = viewportResults.gridLayout.length;
        const touchPass = viewportResults.touchTargets.touchTargetsPass || 0;
        const touchTotal = viewportResults.touchTargets.touchTargetsVerified || 0;
        const chartPass = viewportResults.charts.filter(c => c.passes).length;
        const chartTotal = viewportResults.charts.length;
        const overflowIssues = viewportResults.overflow.length;
        
        console.log(`  Grid Layout: ${gridPass}/${gridTotal} ✅`);
        if (touchTotal > 0) {
          console.log(`  Touch Targets: ${touchPass}/${touchTotal} ✅`);
        }
        console.log(`  Charts: ${chartPass}/${chartTotal} ✅`);
        console.log(`  Overflow Issues: ${overflowIssues} ${overflowIssues === 0 ? '✅' : '❌'}`);
      }

    } catch (error) {
      console.error('🔴 Test execution failed:', error);
      testResults.error = error.message;
    }

    return testResults;
  }

  generateReport(testResults) {
    console.log('\n📋 MOBILE LAYOUT VERIFICATION REPORT');
    console.log('=====================================');
    console.log(`Component: ${testResults.componentName}`);
    console.log(`Page: ${testResults.pagePath}`);
    console.log(`Timestamp: ${testResults.timestamp}`);
    console.log('');

    let overallPass = true;
    const summary = {};

    Object.entries(testResults.viewports || {}).forEach(([viewportName, results]) => {
      console.log(`📱 ${viewportName.toUpperCase()}`);
      console.log('─'.repeat(40));
      
      // Grid Layout Results
      const gridPass = results.gridLayout.filter(g => g.passes).length;
      const gridTotal = results.gridLayout.length;
      const gridScore = gridTotal > 0 ? (gridPass / gridTotal * 100).toFixed(1) : 100;
      console.log(`Grid Layout: ${gridPass}/${gridTotal} (${gridScore}%)`);
      
      if (results.gridLayout.some(g => !g.passes)) {
        console.log('  Issues:');
        results.gridLayout.filter(g => !g.passes).forEach(grid => {
          console.log(`    - Expected ${grid.expectedColumns} cols, got ${grid.actualColumns}`);
        });
      }

      // Touch Targets Results
      if (results.touchTargets.touchTargetsVerified > 0) {
        const touchScore = (results.touchTargets.touchTargetsPass / results.touchTargets.touchTargetsVerified * 100).toFixed(1);
        console.log(`Touch Targets: ${results.touchTargets.touchTargetsPass}/${results.touchTargets.touchTargetsVerified} (${touchScore}%)`);
        
        const touchFails = results.touchTargets.results.filter(t => !t.passes);
        if (touchFails.length > 0) {
          console.log('  Issues:');
          touchFails.slice(0, 3).forEach(touch => {
            console.log(`    - ${touch.elementText}: ${touch.minDimension}px (need ${MIN_TOUCH_TARGET_SIZE}px)`);
          });
        }
      }

      // Chart Results
      const chartPass = results.charts.filter(c => c.passes).length;
      const chartTotal = results.charts.length;
      const chartScore = chartTotal > 0 ? (chartPass / chartTotal * 100).toFixed(1) : 100;
      console.log(`Charts: ${chartPass}/${chartTotal} (${chartScore}%)`);

      // Overflow Results
      console.log(`Overflow Issues: ${results.overflow.length}`);
      if (results.overflow.length > 0) {
        console.log('  Issues:');
        results.overflow.slice(0, 3).forEach(overflow => {
          console.log(`    - ${overflow.tagName}: overflows by ${overflow.overflowAmount}px`);
        });
        overallPass = false;
      }

      // Navigation Results
      const navVisible = results.navigation.navLinks.filter(n => n.isVisible).length;
      console.log(`Navigation Links: ${navVisible} visible`);

      summary[viewportName] = {
        gridScore: parseFloat(gridScore),
        touchScore: results.touchTargets.touchTargetsVerified > 0 ? 
          parseFloat((results.touchTargets.touchTargetsPass / results.touchTargets.touchTargetsVerified * 100).toFixed(1)) : 100,
        chartScore: parseFloat(chartScore),
        overflowIssues: results.overflow.length,
        navLinksVisible: navVisible
      };

      console.log('');
    });

    // Overall Summary
    console.log('📊 OVERALL SUMMARY');
    console.log('─'.repeat(40));
    
    const avgGridScore = Object.values(summary).reduce((acc, s) => acc + s.gridScore, 0) / Object.keys(summary).length;
    const avgTouchScore = Object.values(summary).reduce((acc, s) => acc + s.touchScore, 0) / Object.keys(summary).length;
    const avgChartScore = Object.values(summary).reduce((acc, s) => acc + s.chartScore, 0) / Object.keys(summary).length;
    const totalOverflowIssues = Object.values(summary).reduce((acc, s) => acc + s.overflowIssues, 0);

    console.log(`Average Grid Layout Score: ${avgGridScore.toFixed(1)}%`);
    console.log(`Average Touch Target Score: ${avgTouchScore.toFixed(1)}%`);
    console.log(`Average Chart Score: ${avgChartScore.toFixed(1)}%`);
    console.log(`Total Overflow Issues: ${totalOverflowIssues}`);
    
    const overallScore = (avgGridScore + avgTouchScore + avgChartScore) / 3;
    const passThreshold = 90;
    
    console.log(`\n🎯 Overall Score: ${overallScore.toFixed(1)}%`);
    console.log(`Status: ${overallScore >= passThreshold && totalOverflowIssues === 0 ? '✅ PASS' : '❌ NEEDS IMPROVEMENT'}`);

    return {
      summary,
      overallScore,
      passes: overallScore >= passThreshold && totalOverflowIssues === 0,
      recommendations: this.generateRecommendations(testResults)
    };
  }

  generateRecommendations(testResults) {
    const recommendations = [];

    Object.entries(testResults.viewports || {}).forEach(([viewportName, results]) => {
      // Grid layout recommendations
      const gridIssues = results.gridLayout.filter(g => !g.passes);
      if (gridIssues.length > 0) {
        recommendations.push(`${viewportName}: Fix grid layouts - ensure mobile uses grid-cols-1, tablet uses md:grid-cols-2, desktop uses lg:grid-cols-3+`);
      }

      // Touch target recommendations
      const touchIssues = results.touchTargets.results?.filter(t => !t.passes) || [];
      if (touchIssues.length > 0) {
        recommendations.push(`${viewportName}: Increase touch target sizes - ${touchIssues.length} elements smaller than ${MIN_TOUCH_TARGET_SIZE}px`);
      }

      // Chart recommendations
      const chartIssues = results.charts.filter(c => !c.passes);
      if (chartIssues.length > 0) {
        recommendations.push(`${viewportName}: Fix chart responsiveness - ensure charts fit within their containers`);
      }

      // Overflow recommendations
      if (results.overflow.length > 0) {
        recommendations.push(`${viewportName}: Fix content overflow - ${results.overflow.length} elements extend beyond viewport`);
      }
    });

    return recommendations;
  }
}

// Test execution
async function runMobileLayoutTests() {
  const verifier = new MobileLayoutVerifier();
  
  try {
    await verifier.setup();
    
    // Test different pages/components
    const testPages = [
      { path: '/dashboard', name: 'dashboard' },
      { path: '/analytics', name: 'analytics' },
      { path: '/projects', name: 'projects' }
    ];

    const allResults = [];

    for (const testPage of testPages) {
      console.log(`\n🧪 Testing ${testPage.name} page...`);
      const results = await verifier.runAllTests(testPage.path, testPage.name);
      const report = verifier.generateReport(results);
      
      allResults.push({
        page: testPage,
        results,
        report
      });
    }

    // Generate combined report
    console.log('\n🏆 COMBINED TEST RESULTS');
    console.log('=========================');
    
    let allPassed = true;
    allResults.forEach(({ page, report }) => {
      console.log(`${page.name}: ${report.passes ? '✅ PASS' : '❌ FAIL'} (${report.overallScore.toFixed(1)}%)`);
      if (!report.passes) allPassed = false;
    });

    console.log(`\nOverall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    
    // Save detailed results
    const fs = require('fs').promises;
    const resultsPath = path.join(__dirname, 'mobile-layout-test-results.json');
    await fs.writeFile(resultsPath, JSON.stringify(allResults, null, 2));
    console.log(`\n📄 Detailed results saved to: ${resultsPath}`);

    return allPassed;

  } catch (error) {
    console.error('🔴 Test suite failed:', error);
    return false;
  } finally {
    await verifier.teardown();
  }
}

// Run tests if called directly
if (require.main === module) {
  runMobileLayoutTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = {
  MobileLayoutVerifier,
  runMobileLayoutTests,
  VIEWPORTS,
  MIN_TOUCH_TARGET_SIZE
};