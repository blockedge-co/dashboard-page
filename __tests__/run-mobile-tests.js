#!/usr/bin/env node

/**
 * Mobile Test Runner
 * 
 * Orchestrates all mobile layout verification tests and provides
 * a comprehensive report. Can be used in CI/CD pipelines.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

const TEST_TIMEOUT = 300000; // 5 minutes

class MobileTestRunner {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      tests: {},
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        skipped: 0
      },
      duration: 0
    };
    this.startTime = Date.now();
  }

  async runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      console.log(`🚀 Running: ${command} ${args.join(' ')}`);
      
      const child = spawn(command, args, {
        stdio: ['inherit', 'pipe', 'pipe'],
        cwd: path.resolve(__dirname, '..'),
        timeout: TEST_TIMEOUT,
        ...options
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        const output = data.toString();
        stdout += output;
        process.stdout.write(output);
      });

      child.stderr.on('data', (data) => {
        const output = data.toString();
        stderr += output;
        process.stderr.write(output);
      });

      child.on('close', (code) => {
        resolve({
          code,
          stdout,
          stderr,
          success: code === 0
        });
      });

      child.on('error', (error) => {
        reject(error);
      });

      // Handle timeout
      setTimeout(() => {
        child.kill('SIGTERM');
        reject(new Error(`Command timed out after ${TEST_TIMEOUT}ms`));
      }, TEST_TIMEOUT);
    });
  }

  async checkPrerequisites() {
    console.log('🔍 Checking prerequisites...');
    
    const checks = [
      {
        name: 'Node.js version',
        check: async () => {
          const result = await this.runCommand('node', ['--version']);
          return result.success;
        }
      },
      {
        name: 'NPM dependencies',
        check: async () => {
          try {
            await fs.access(path.resolve(__dirname, '../node_modules'));
            return true;
          } catch {
            return false;
          }
        }
      },
      {
        name: 'Next.js build',
        check: async () => {
          try {
            await fs.access(path.resolve(__dirname, '../.next'));
            return true;
          } catch {
            console.log('📦 No build found, running build...');
            const result = await this.runCommand('npm', ['run', 'build']);
            return result.success;
          }
        }
      }
    ];

    for (const check of checks) {
      try {
        const passed = await check.check();
        console.log(`  ${passed ? '✅' : '❌'} ${check.name}`);
        if (!passed) {
          throw new Error(`Prerequisite failed: ${check.name}`);
        }
      } catch (error) {
        console.error(`❌ Prerequisite check failed: ${check.name}`, error.message);
        return false;
      }
    }

    console.log('✅ All prerequisites satisfied\n');
    return true;
  }

  async runBrowserTests() {
    console.log('🌐 Running browser-based layout tests...\n');
    
    try {
      const result = await this.runCommand('node', [
        path.resolve(__dirname, 'mobile-layout-verification.test.js')
      ]);

      this.results.tests.browserTests = {
        name: 'Browser Layout Tests',
        success: result.success,
        duration: 0, // Will be calculated
        output: result.stdout,
        error: result.stderr
      };

      this.results.summary.total++;
      if (result.success) {
        this.results.summary.passed++;
        console.log('✅ Browser tests passed\n');
      } else {
        this.results.summary.failed++;
        console.log('❌ Browser tests failed\n');
      }

      return result.success;
      
    } catch (error) {
      console.error('💥 Browser tests crashed:', error.message);
      this.results.tests.browserTests = {
        name: 'Browser Layout Tests',
        success: false,
        error: error.message
      };
      this.results.summary.total++;
      this.results.summary.failed++;
      return false;
    }
  }

  async runComponentTests() {
    console.log('⚛️ Running React component tests...\n');
    
    try {
      const result = await this.runCommand('npx', [
        'jest',
        '__tests__/mobile-component-verification.test.tsx',
        '--verbose'
      ]);

      this.results.tests.componentTests = {
        name: 'Component Unit Tests',
        success: result.success,
        output: result.stdout,
        error: result.stderr
      };

      this.results.summary.total++;
      if (result.success) {
        this.results.summary.passed++;
        console.log('✅ Component tests passed\n');
      } else {
        this.results.summary.failed++;
        console.log('❌ Component tests failed\n');
      }

      return result.success;
      
    } catch (error) {
      console.error('💥 Component tests crashed:', error.message);
      this.results.tests.componentTests = {
        name: 'Component Unit Tests',
        success: false,
        error: error.message
      };
      this.results.summary.total++;
      this.results.summary.failed++;
      return false;
    }
  }

  async runScreenshotTests() {
    console.log('📸 Running visual regression tests...\n');
    
    try {
      // First try to run comparison (will fail if no baseline)
      let result = await this.runCommand('node', [
        path.resolve(__dirname, 'mobile-screenshot-comparison.js'),
        'compare'
      ]);

      // If comparison fails, create baseline and try again
      if (!result.success && result.stderr.includes('baseline')) {
        console.log('📋 No baseline found, creating baseline...');
        
        const baselineResult = await this.runCommand('node', [
          path.resolve(__dirname, 'mobile-screenshot-comparison.js'),
          'baseline'
        ]);

        if (baselineResult.success) {
          console.log('✅ Baseline created, running comparison...');
          result = await this.runCommand('node', [
            path.resolve(__dirname, 'mobile-screenshot-comparison.js'),
            'compare'
          ]);
        }
      }

      this.results.tests.screenshotTests = {
        name: 'Visual Regression Tests',
        success: result.success,
        output: result.stdout,
        error: result.stderr
      };

      this.results.summary.total++;
      if (result.success) {
        this.results.summary.passed++;
        console.log('✅ Screenshot tests passed\n');
      } else {
        this.results.summary.failed++;
        console.log('❌ Screenshot tests failed\n');
      }

      return result.success;
      
    } catch (error) {
      console.error('💥 Screenshot tests crashed:', error.message);
      this.results.tests.screenshotTests = {
        name: 'Visual Regression Tests',
        success: false,
        error: error.message
      };
      this.results.summary.total++;
      this.results.summary.failed++;
      return false;
    }
  }

  generateSummaryReport() {
    const duration = Date.now() - this.startTime;
    this.results.duration = duration;

    console.log('\n📊 MOBILE TESTING SUMMARY REPORT');
    console.log('='.repeat(50));
    console.log(`Timestamp: ${this.results.timestamp}`);
    console.log(`Duration: ${(duration / 1000).toFixed(1)}s`);
    console.log('');

    // Individual test results
    Object.entries(this.results.tests).forEach(([key, test]) => {
      const status = test.success ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${test.name}`);
      
      if (!test.success && test.error) {
        console.log(`  Error: ${test.error}`);
      }
    });

    console.log('');
    console.log('📈 OVERALL STATISTICS');
    console.log('─'.repeat(30));
    console.log(`Total Tests: ${this.results.summary.total}`);
    console.log(`Passed: ${this.results.summary.passed} ✅`);
    console.log(`Failed: ${this.results.summary.failed} ❌`);
    console.log(`Skipped: ${this.results.summary.skipped} ⏭️`);

    const successRate = this.results.summary.total > 0 ? 
      (this.results.summary.passed / this.results.summary.total * 100).toFixed(1) : 0;
    
    console.log(`Success Rate: ${successRate}%`);

    // Overall status
    const allPassed = this.results.summary.failed === 0 && this.results.summary.total > 0;
    console.log(`\n🎯 Overall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

    // Recommendations
    if (!allPassed) {
      console.log('\n💡 RECOMMENDATIONS');
      console.log('─'.repeat(30));
      
      if (this.results.tests.browserTests && !this.results.tests.browserTests.success) {
        console.log('• Check browser layout issues - ensure grid layouts are responsive');
        console.log('• Verify touch targets meet 44px minimum size requirement');
        console.log('• Fix any content overflow issues');
      }
      
      if (this.results.tests.componentTests && !this.results.tests.componentTests.success) {
        console.log('• Review component unit test failures');
        console.log('• Ensure components have proper responsive CSS classes');
        console.log('• Check component accessibility features');
      }
      
      if (this.results.tests.screenshotTests && !this.results.tests.screenshotTests.success) {
        console.log('• Review visual changes in screenshot comparison');
        console.log('• If changes are intentional, update baseline with: npm run mobile:update-baseline');
        console.log('• If changes are unexpected, investigate layout regressions');
      }
    }

    return allPassed;
  }

  async saveResults() {
    const resultsPath = path.resolve(__dirname, 'mobile-test-results.json');
    await fs.writeFile(resultsPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Detailed results saved to: ${resultsPath}`);
  }

  async run(options = {}) {
    console.log('🧪 MOBILE LAYOUT VERIFICATION TEST SUITE');
    console.log('==========================================\n');

    try {
      // Check prerequisites
      const prerequisitesPassed = await this.checkPrerequisites();
      if (!prerequisitesPassed) {
        console.error('❌ Prerequisites not met, aborting tests');
        return false;
      }

      // Run test suites
      const testPromises = [];

      if (!options.skipBrowser) {
        testPromises.push(this.runBrowserTests());
      }

      if (!options.skipComponents) {
        testPromises.push(this.runComponentTests());
      }

      if (!options.skipScreenshots) {
        testPromises.push(this.runScreenshotTests());
      }

      // Wait for all tests to complete
      await Promise.all(testPromises);

      // Generate and save results
      const allPassed = this.generateSummaryReport();
      await this.saveResults();

      return allPassed;

    } catch (error) {
      console.error('💥 Test runner failed:', error);
      this.results.error = error.message;
      await this.saveResults();
      return false;
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const options = {
    skipBrowser: args.includes('--skip-browser'),
    skipComponents: args.includes('--skip-components'),
    skipScreenshots: args.includes('--skip-screenshots')
  };

  if (args.includes('--help')) {
    console.log(`
Mobile Test Runner

Usage: node run-mobile-tests.js [options]

Options:
  --skip-browser      Skip browser-based layout tests
  --skip-components   Skip React component unit tests  
  --skip-screenshots  Skip visual regression tests
  --help              Show this help message

Examples:
  node run-mobile-tests.js                    # Run all tests
  node run-mobile-tests.js --skip-screenshots # Skip visual tests
    `);
    process.exit(0);
  }

  const runner = new MobileTestRunner();
  const success = await runner.run(options);
  
  process.exit(success ? 0 : 1);
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { MobileTestRunner };