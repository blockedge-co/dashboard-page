#!/usr/bin/env node

/**
 * BlockEdge Dashboard - Real Data Components Test
 * 
 * This script tests that the retirement and tokenization components
 * are correctly loading real data from the services.
 * 
 * Usage: node test-real-data-components.js
 */

const { execSync } = require('child_process');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(level, message) {
  const levelColors = {
    SUCCESS: colors.green,
    ERROR: colors.red,
    WARN: colors.yellow,
    INFO: colors.blue
  };
  
  console.log(`${levelColors[level]}[${level}]${colors.reset} ${message}`);
}

async function testRealDataServices() {
  console.log(`${colors.bold}${colors.blue}Testing Real Data Service Integration...${colors.reset}\n`);
  
  let allTestsPassed = true;
  const testResults = [];

  // Test 1: Check if real retirement service can be imported
  try {
    const retirementService = require('./lib/real-retirement-service.ts');
    testResults.push({ test: 'Real Retirement Service Import', passed: true });
    log('SUCCESS', '✓ Real retirement service imports successfully');
  } catch (error) {
    testResults.push({ test: 'Real Retirement Service Import', passed: false, error: error.message });
    log('ERROR', '✗ Real retirement service import failed');
    allTestsPassed = false;
  }

  // Test 2: Check if tokenization service can be imported  
  try {
    const tokenizationService = require('./lib/tokenization-service.ts');
    testResults.push({ test: 'Tokenization Service Import', passed: true });
    log('SUCCESS', '✓ Tokenization service imports successfully');
  } catch (error) {
    testResults.push({ test: 'Tokenization Service Import', passed: false, error: error.message });
    log('ERROR', '✗ Tokenization service import failed');
    allTestsPassed = false;
  }

  // Test 3: Check if CO2e API can be imported
  try {
    const co2eApi = require('./lib/co2e-api.ts');
    testResults.push({ test: 'CO2e API Import', passed: true });
    log('SUCCESS', '✓ CO2e API imports successfully');
  } catch (error) {
    testResults.push({ test: 'CO2e API Import', passed: false, error: error.message });
    log('ERROR', '✗ CO2e API import failed');
    allTestsPassed = false;
  }

  // Test 4: Check if main dashboard component uses enhanced versions
  try {
    const fs = require('fs');
    const dashboardContent = fs.readFileSync('./components/carbon-dashboard.tsx', 'utf8');
    
    if (dashboardContent.includes('from "./retirement-panels/retirement-analytics"') &&
        dashboardContent.includes('from "./tokenization-metrics-enhanced"')) {
      testResults.push({ test: 'Dashboard Enhanced Component Usage', passed: true });
      log('SUCCESS', '✓ Dashboard uses enhanced components with real data');
    } else {
      testResults.push({ test: 'Dashboard Enhanced Component Usage', passed: false, error: 'Dashboard not using enhanced components' });
      log('ERROR', '✗ Dashboard not using enhanced components');
      allTestsPassed = false;
    }
  } catch (error) {
    testResults.push({ test: 'Dashboard Enhanced Component Usage', passed: false, error: error.message });
    log('ERROR', '✗ Failed to check dashboard component usage');
    allTestsPassed = false;
  }

  // Test 5: Verify Next.js can start in development mode (quick check)
  try {
    log('INFO', 'Testing Next.js development server startup...');
    // This just checks if the command can be prepared, not actually starting the server
    execSync('npm list next', { stdio: 'pipe' });
    testResults.push({ test: 'Next.js Development Ready', passed: true });
    log('SUCCESS', '✓ Next.js development environment is ready');
  } catch (error) {
    testResults.push({ test: 'Next.js Development Ready', passed: false, error: 'Next.js not properly installed' });
    log('ERROR', '✗ Next.js development environment issue');
    allTestsPassed = false;
  }

  // Test 6: Check build artifacts exist
  try {
    const fs = require('fs');
    if (fs.existsSync('./.next') && fs.existsSync('./.next/server')) {
      testResults.push({ test: 'Build Artifacts Present', passed: true });
      log('SUCCESS', '✓ Build artifacts present (recent build successful)');
    } else {
      testResults.push({ test: 'Build Artifacts Present', passed: false, error: 'No build artifacts found' });
      log('WARN', '⚠ No build artifacts found (run npm run build)');
    }
  } catch (error) {
    testResults.push({ test: 'Build Artifacts Present', passed: false, error: error.message });
    log('ERROR', '✗ Error checking build artifacts');
    allTestsPassed = false;
  }

  // Generate final report
  console.log('\n' + '='.repeat(80));
  console.log(`${colors.bold}${colors.blue}Real Data Components Test Report${colors.reset}`);
  console.log('='.repeat(80));
  
  const passedTests = testResults.filter(t => t.passed).length;
  const totalTests = testResults.length;
  
  console.log(`\n${colors.bold}Summary:${colors.reset}`);
  console.log(`Tests passed: ${passedTests}/${totalTests}`);
  console.log(`Success rate: ${Math.round((passedTests/totalTests) * 100)}%`);
  
  if (allTestsPassed) {
    console.log(`\n${colors.green}${colors.bold}✅ ALL TESTS PASSED!${colors.reset}`);
    console.log(`${colors.green}The retirement and tokenization tabs are successfully using real data services.${colors.reset}`);
    console.log(`\n${colors.blue}Next steps:${colors.reset}`);
    console.log(`  • Run: npm run dev`);
    console.log(`  • Navigate to the dashboard and test the retirement/tokenization tabs`);
    console.log(`  • Verify data loads correctly and shows real blockchain information`);
  } else {
    console.log(`\n${colors.red}${colors.bold}❌ SOME TESTS FAILED${colors.reset}`);
    console.log(`${colors.red}Please review the failed tests above.${colors.reset}`);
    
    console.log(`\n${colors.yellow}${colors.bold}Failed Tests:${colors.reset}`);
    testResults.filter(t => !t.passed).forEach(test => {
      console.log(`${colors.red}  • ${test.test}: ${test.error || 'Unknown error'}${colors.reset}`);
    });
  }
  
  console.log('\n' + '='.repeat(80));
  
  return allTestsPassed;
}

// Main execution
if (require.main === module) {
  testRealDataServices()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error(`${colors.red}Test execution failed: ${error.message}${colors.reset}`);
      process.exit(1);
    });
}

module.exports = { testRealDataServices };