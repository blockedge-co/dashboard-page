/**
 * Mobile Screenshot Comparison Utility
 * 
 * Generates and compares screenshots across different viewports to detect
 * visual regressions in mobile layouts. Uses Puppeteer for consistent
 * screenshot generation.
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Viewport configurations optimized for screenshot testing
const SCREENSHOT_VIEWPORTS = {
  mobile: { 
    width: 320, 
    height: 568, 
    deviceScaleFactor: 2,
    name: 'iPhone SE'
  },
  mobileLarge: { 
    width: 414, 
    height: 896, 
    deviceScaleFactor: 3,
    name: 'iPhone 11 Pro'
  },
  tablet: { 
    width: 768, 
    height: 1024, 
    deviceScaleFactor: 2,
    name: 'iPad'
  },
  tabletLandscape: { 
    width: 1024, 
    height: 768, 
    deviceScaleFactor: 2,
    name: 'iPad Landscape'
  },
  desktop: { 
    width: 1280, 
    height: 800, 
    deviceScaleFactor: 1,
    name: 'Desktop'
  }
};

class MobileScreenshotComparison {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.browser = null;
    this.screenshotsDir = path.join(__dirname, 'screenshots');
    this.baselineDir = path.join(this.screenshotsDir, 'baseline');
    this.currentDir = path.join(this.screenshotsDir, 'current');
    this.diffDir = path.join(this.screenshotsDir, 'diff');
  }

  async setup() {
    console.log('🚀 Setting up Screenshot Comparison...');
    
    // Create directories
    await this.ensureDirectories();
    
    // Launch browser
    this.browser = await puppeteer.launch({
      headless: process.env.CI !== 'false',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--disable-web-security', // For local testing
        '--font-render-hinting=none', // Consistent font rendering
        '--disable-font-subpixel-positioning'
      ]
    });

    console.log('✅ Screenshot setup complete');
  }

  async ensureDirectories() {
    const dirs = [this.screenshotsDir, this.baselineDir, this.currentDir, this.diffDir];
    
    for (const dir of dirs) {
      try {
        await fs.access(dir);
      } catch {
        await fs.mkdir(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    }
  }

  async teardown() {
    if (this.browser) {
      await this.browser.close();
      console.log('✅ Browser closed');
    }
  }

  async capturePageScreenshots(pagePath, componentName) {
    console.log(`📸 Capturing screenshots for ${componentName} at ${pagePath}`);
    
    const page = await this.browser.newPage();
    
    // Set up page for consistent screenshots
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
    });
    
    // Block external resources for faster loading
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      if (['image', 'font'].includes(resourceType) && !request.url().includes(this.baseUrl)) {
        request.abort();
      } else {
        request.continue();
      }
    });

    const screenshots = {};

    try {
      // Navigate to page
      const url = `${this.baseUrl}${pagePath}`;
      console.log(`🌐 Navigating to: ${url}`);
      
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Wait for content to load
      await page.waitForSelector('main, [data-testid="dashboard-content"], .dashboard-layout', {
        timeout: 10000
      }).catch(() => {
        console.warn('⚠️ Main content selector not found, continuing...');
      });

      // Additional wait for dynamic content
      await page.waitForTimeout(2000);

      // Capture screenshots for each viewport
      for (const [viewportKey, viewport] of Object.entries(SCREENSHOT_VIEWPORTS)) {
        console.log(`📱 Capturing ${viewport.name} (${viewport.width}x${viewport.height})`);
        
        await page.setViewport({
          width: viewport.width,
          height: viewport.height,
          deviceScaleFactor: viewport.deviceScaleFactor
        });

        // Wait for layout to settle
        await page.waitForTimeout(1000);

        // Hide scroll bars for cleaner screenshots
        await page.addStyleTag({
          content: `
            ::-webkit-scrollbar { display: none; }
            * { scrollbar-width: none; }
            body { overflow-x: hidden; }
          `
        });

        // Take full page screenshot
        const screenshotPath = path.join(
          this.currentDir, 
          `${componentName}-${viewportKey}.png`
        );

        await page.screenshot({
          path: screenshotPath,
          fullPage: true,
          type: 'png'
        });

        screenshots[viewportKey] = {
          path: screenshotPath,
          viewport: viewport,
          filename: `${componentName}-${viewportKey}.png`
        };

        console.log(`✅ Screenshot saved: ${screenshotPath}`);
      }

    } catch (error) {
      console.error(`❌ Failed to capture screenshots for ${componentName}:`, error);
      throw error;
    } finally {
      await page.close();
    }

    return screenshots;
  }

  async captureComponentScreenshots(selector, componentName, pagePath = '/dashboard') {
    console.log(`📸 Capturing component screenshots for ${componentName}`);
    
    const page = await this.browser.newPage();
    const screenshots = {};

    try {
      const url = `${this.baseUrl}${pagePath}`;
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Wait for component to load
      await page.waitForSelector(selector, { timeout: 10000 });

      for (const [viewportKey, viewport] of Object.entries(SCREENSHOT_VIEWPORTS)) {
        await page.setViewport({
          width: viewport.width,
          height: viewport.height,
          deviceScaleFactor: viewport.deviceScaleFactor
        });

        await page.waitForTimeout(1000);

        // Screenshot specific component
        const element = await page.$(selector);
        if (element) {
          const screenshotPath = path.join(
            this.currentDir, 
            `component-${componentName}-${viewportKey}.png`
          );

          await element.screenshot({
            path: screenshotPath,
            type: 'png'
          });

          screenshots[viewportKey] = {
            path: screenshotPath,
            viewport: viewport,
            filename: `component-${componentName}-${viewportKey}.png`
          };
        }
      }

    } catch (error) {
      console.error(`❌ Failed to capture component screenshots:`, error);
      throw error;
    } finally {
      await page.close();
    }

    return screenshots;
  }

  async generateBaseline() {
    console.log('📋 Generating baseline screenshots...');
    
    const testPages = [
      { path: '/dashboard', name: 'dashboard' },
      { path: '/analytics', name: 'analytics' },
      { path: '/projects', name: 'projects' }
    ];

    const baselineResults = {};

    for (const testPage of testPages) {
      try {
        const screenshots = await this.capturePageScreenshots(testPage.path, testPage.name);
        
        // Copy to baseline directory
        for (const [viewportKey, screenshot] of Object.entries(screenshots)) {
          const baselinePath = path.join(this.baselineDir, screenshot.filename);
          await fs.copyFile(screenshot.path, baselinePath);
          console.log(`📋 Baseline saved: ${baselinePath}`);
        }

        baselineResults[testPage.name] = screenshots;
        
      } catch (error) {
        console.error(`❌ Failed to generate baseline for ${testPage.name}:`, error);
      }
    }

    // Save baseline metadata
    const metadata = {
      timestamp: new Date().toISOString(),
      viewports: SCREENSHOT_VIEWPORTS,
      pages: testPages,
      results: baselineResults
    };

    await fs.writeFile(
      path.join(this.baselineDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    console.log('✅ Baseline generation complete');
    return baselineResults;
  }

  async compareWithBaseline() {
    console.log('🔍 Comparing current screenshots with baseline...');
    
    const testPages = [
      { path: '/dashboard', name: 'dashboard' },
      { path: '/analytics', name: 'analytics' },
      { path: '/projects', name: 'projects' }
    ];

    const comparisonResults = {
      timestamp: new Date().toISOString(),
      pages: {},
      summary: {
        totalScreenshots: 0,
        changedScreenshots: 0,
        newScreenshots: 0,
        missingScreenshots: 0
      }
    };

    // Capture current screenshots
    for (const testPage of testPages) {
      try {
        const currentScreenshots = await this.capturePageScreenshots(testPage.path, testPage.name);
        
        const pageResults = {
          name: testPage.name,
          path: testPage.path,
          viewports: {}
        };

        for (const [viewportKey, screenshot] of Object.entries(currentScreenshots)) {
          const baselinePath = path.join(this.baselineDir, screenshot.filename);
          const currentPath = screenshot.path;
          
          comparisonResults.summary.totalScreenshots++;

          try {
            // Check if baseline exists
            await fs.access(baselinePath);
            
            // Compare file sizes as basic difference check
            const baselineStats = await fs.stat(baselinePath);
            const currentStats = await fs.stat(currentPath);
            
            const sizeDifference = Math.abs(baselineStats.size - currentStats.size);
            const sizeDifferencePercent = (sizeDifference / baselineStats.size) * 100;
            
            const hasSignificantChange = sizeDifferencePercent > 5; // 5% threshold
            
            pageResults.viewports[viewportKey] = {
              baseline: baselinePath,
              current: currentPath,
              baselineSize: baselineStats.size,
              currentSize: currentStats.size,
              sizeDifference,
              sizeDifferencePercent: sizeDifferencePercent.toFixed(2),
              hasSignificantChange,
              status: hasSignificantChange ? 'changed' : 'unchanged'
            };
            
            if (hasSignificantChange) {
              comparisonResults.summary.changedScreenshots++;
              console.log(`🔄 Changed: ${screenshot.filename} (${sizeDifferencePercent.toFixed(1)}% size difference)`);
            }
            
          } catch {
            // Baseline doesn't exist - new screenshot
            pageResults.viewports[viewportKey] = {
              baseline: null,
              current: currentPath,
              status: 'new'
            };
            
            comparisonResults.summary.newScreenshots++;
            console.log(`🆕 New: ${screenshot.filename}`);
          }
        }

        comparisonResults.pages[testPage.name] = pageResults;
        
      } catch (error) {
        console.error(`❌ Failed to compare ${testPage.name}:`, error);
      }
    }

    // Save comparison results
    await fs.writeFile(
      path.join(this.screenshotsDir, 'comparison-results.json'),
      JSON.stringify(comparisonResults, null, 2)
    );

    // Generate summary report
    this.generateComparisonReport(comparisonResults);

    return comparisonResults;
  }

  generateComparisonReport(results) {
    console.log('\n📊 SCREENSHOT COMPARISON REPORT');
    console.log('================================');
    console.log(`Timestamp: ${results.timestamp}`);
    console.log(`Total Screenshots: ${results.summary.totalScreenshots}`);
    console.log(`Changed: ${results.summary.changedScreenshots}`);
    console.log(`New: ${results.summary.newScreenshots}`);
    console.log(`Missing: ${results.summary.missingScreenshots}`);
    console.log('');

    Object.entries(results.pages).forEach(([pageName, pageResults]) => {
      console.log(`📄 ${pageName.toUpperCase()}`);
      console.log('─'.repeat(30));
      
      Object.entries(pageResults.viewports).forEach(([viewport, result]) => {
        const status = result.status === 'changed' ? '🔄' : 
                      result.status === 'new' ? '🆕' : '✅';
        
        console.log(`  ${status} ${viewport}: ${result.status}`);
        
        if (result.status === 'changed') {
          console.log(`    Size difference: ${result.sizeDifferencePercent}%`);
        }
      });
      
      console.log('');
    });

    const hasChanges = results.summary.changedScreenshots > 0 || results.summary.newScreenshots > 0;
    console.log(`🎯 Overall Status: ${hasChanges ? '⚠️ CHANGES DETECTED' : '✅ NO CHANGES'}`);
    
    if (hasChanges) {
      console.log('\n💡 Next Steps:');
      console.log('  1. Review changed screenshots manually');
      console.log('  2. If changes are expected, update baseline with: npm run mobile:update-baseline');
      console.log('  3. If changes are unexpected, investigate layout issues');
    }

    return hasChanges;
  }

  async generateDetailedReport() {
    console.log('📝 Generating detailed mobile layout report...');
    
    const reportData = {
      timestamp: new Date().toISOString(),
      viewports: SCREENSHOT_VIEWPORTS,
      pages: []
    };

    const testPages = [
      { path: '/dashboard', name: 'dashboard' },
      { path: '/analytics', name: 'analytics' },
      { path: '/projects', name: 'projects' }
    ];

    for (const testPage of testPages) {
      const page = await this.browser.newPage();
      
      try {
        await page.goto(`${this.baseUrl}${testPage.path}`, { 
          waitUntil: 'networkidle2',
          timeout: 30000 
        });

        const pageReport = {
          name: testPage.name,
          path: testPage.path,
          viewports: {}
        };

        for (const [viewportKey, viewport] of Object.entries(SCREENSHOT_VIEWPORTS)) {
          await page.setViewport({
            width: viewport.width,
            height: viewport.height,
            deviceScaleFactor: viewport.deviceScaleFactor
          });

          await page.waitForTimeout(1000);

          // Analyze layout at this viewport
          const layoutAnalysis = await page.evaluate(() => {
            const analysis = {
              totalElements: document.querySelectorAll('*').length,
              gridElements: document.querySelectorAll('[class*="grid"]').length,
              responsiveElements: document.querySelectorAll('[class*="md:"], [class*="lg:"]').length,
              interactiveElements: document.querySelectorAll('button, a, input').length,
              chartElements: document.querySelectorAll('[class*="chart"], .recharts-wrapper').length,
              overflowingElements: 0,
              viewport: {
                width: window.innerWidth,
                height: window.innerHeight
              }
            };

            // Check for overflow
            const allElements = document.querySelectorAll('*');
            allElements.forEach(element => {
              const rect = element.getBoundingClientRect();
              if (rect.right > window.innerWidth + 5) {
                analysis.overflowingElements++;
              }
            });

            return analysis;
          });

          pageReport.viewports[viewportKey] = {
            viewport,
            analysis: layoutAnalysis
          };
        }

        reportData.pages.push(pageReport);
        
      } catch (error) {
        console.error(`❌ Failed to analyze ${testPage.name}:`, error);
      } finally {
        await page.close();
      }
    }

    // Save detailed report
    const reportPath = path.join(this.screenshotsDir, 'detailed-layout-report.json');
    await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2));
    
    console.log(`📊 Detailed report saved: ${reportPath}`);
    return reportData;
  }
}

// CLI interface
async function runScreenshotTests(command = 'compare') {
  const comparison = new MobileScreenshotComparison();
  
  try {
    await comparison.setup();
    
    switch (command) {
      case 'baseline':
        await comparison.generateBaseline();
        break;
        
      case 'compare':
        const results = await comparison.compareWithBaseline();
        const hasChanges = comparison.generateComparisonReport(results);
        return !hasChanges; // Return true if no changes (success)
        
      case 'report':
        await comparison.generateDetailedReport();
        break;
        
      default:
        console.error('Unknown command. Use: baseline, compare, or report');
        return false;
    }
    
    return true;
    
  } catch (error) {
    console.error('💥 Screenshot testing failed:', error);
    return false;
  } finally {
    await comparison.teardown();
  }
}

// Export for programmatic use
module.exports = {
  MobileScreenshotComparison,
  runScreenshotTests,
  SCREENSHOT_VIEWPORTS
};

// Run if called directly
if (require.main === module) {
  const command = process.argv[2] || 'compare';
  
  runScreenshotTests(command)
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error);
      process.exit(1);
    });
}