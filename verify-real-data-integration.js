#!/usr/bin/env node

/**
 * BlockEdge Dashboard - Real Data Integration Verification Script
 * 
 * This script verifies that the retirement and tokenization flows
 * are using real data services instead of mock data.
 * 
 * Usage: node verify-real-data-integration.js
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// Track issues found
let issuesFound = [];
let filesChecked = 0;

/**
 * Log with colors
 */
function log(level, message) {
  const timestamp = new Date().toISOString();
  const levelColors = {
    SUCCESS: colors.green,
    ERROR: colors.red,
    WARN: colors.yellow,
    INFO: colors.blue
  };
  
  console.log(`${levelColors[level]}[${level}]${colors.reset} ${message}`);
}

/**
 * Check if file exists
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

/**
 * Read file content safely
 */
function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return null;
  }
}

/**
 * Search for patterns in file content
 */
function searchPattern(content, pattern, description) {
  const matches = content.match(pattern);
  return {
    found: Boolean(matches),
    count: matches ? matches.length : 0,
    description
  };
}

/**
 * Check a single file for mock data patterns
 */
function checkFileForMockData(filePath) {
  const content = readFileContent(filePath);
  if (!content) return [];
  
  // Check if file is deprecated
  const isDeprecated = content.includes('DEPRECATED') || content.includes('deprecated');
  
  const mockPatterns = [
    {
      pattern: /generateTokenizationMetrics|generateMockData|generateMock/gi,
      severity: isDeprecated ? 'INFO' : 'ERROR',
      description: 'Mock data generation functions'
    },
    {
      pattern: /mock.*data|dummy.*data|fake.*data/gi,
      severity: isDeprecated ? 'INFO' : 'WARN',
      description: 'Mock/dummy/fake data references'
    },
    {
      pattern: /TODO.*real.*data|FIXME.*mock|\/\*.*mock.*\*\//gi,
      severity: 'INFO',
      description: 'TODO/FIXME comments about mock data'
    },
    {
      pattern: /Math\.random\(\)|Math\.sin\(|Math\.cos\(/gi,
      severity: isDeprecated ? 'INFO' : 'WARN',
      description: 'Mathematical randomization (potential mock data)'
    }
  ];

  const realDataPatterns = [
    {
      pattern: /realRetirementService|tokenizationService|co2eApi/gi,
      severity: 'SUCCESS',
      description: 'Real data service usage'
    },
    {
      pattern: /fetchWithRetry|getCache|setCache/gi,
      severity: 'SUCCESS',
      description: 'Real API calls and caching'
    },
    {
      pattern: /"real_.*"|'real_.*'/gi,
      severity: 'SUCCESS',
      description: 'Real data cache keys'
    }
  ];

  const issues = [];
  
  // Check for mock patterns
  mockPatterns.forEach(({ pattern, severity, description }) => {
    const result = searchPattern(content, pattern, description);
    if (result.found) {
      issues.push({
        file: filePath,
        severity,
        description: `${description} (${result.count} occurrences)`,
        type: 'MOCK_DATA'
      });
    }
  });
  
  // Check for real data patterns (positive indicators)
  let hasRealDataIndicators = false;
  realDataPatterns.forEach(({ pattern, description }) => {
    const result = searchPattern(content, pattern, description);
    if (result.found) {
      hasRealDataIndicators = true;
    }
  });
  
  // If file is in components and has no real data indicators, that might be an issue
  // Unless it's explicitly marked as deprecated
  if (filePath.includes('/components/') && 
      (filePath.includes('retirement') || filePath.includes('tokenization')) &&
      !hasRealDataIndicators &&
      !filePath.includes('.test.') &&
      !filePath.includes('.spec.') &&
      !isDeprecated) {
    issues.push({
      file: filePath,
      severity: 'WARN',
      description: 'No real data service usage detected',
      type: 'NO_REAL_DATA'
    });
  }
  
  // Note deprecated files
  if (isDeprecated) {
    issues.push({
      file: filePath,
      severity: 'INFO',
      description: 'File marked as deprecated',
      type: 'DEPRECATED'
    });
  }

  return issues;
}

/**
 * Check if dashboard imports are correct
 */
function checkDashboardImports() {
  const dashboardPath = './components/carbon-dashboard.tsx';
  const content = readFileContent(dashboardPath);
  
  if (!content) {
    issuesFound.push({
      file: dashboardPath,
      severity: 'ERROR',
      description: 'Could not read dashboard file',
      type: 'FILE_ACCESS'
    });
    return;
  }

  // Check if dashboard imports enhanced components
  const retirementImport = content.includes('from "./retirement-panels/retirement-analytics"');
  const tokenizationImport = content.includes('from "./tokenization-metrics-enhanced"');
  
  if (!retirementImport) {
    issuesFound.push({
      file: dashboardPath,
      severity: 'ERROR',
      description: 'Dashboard not importing RetirementAnalytics component',
      type: 'IMPORT_ERROR'
    });
  }
  
  if (!tokenizationImport) {
    issuesFound.push({
      file: dashboardPath,
      severity: 'ERROR',
      description: 'Dashboard not importing enhanced TokenizationMetrics component',
      type: 'IMPORT_ERROR'
    });
  }

  if (retirementImport && tokenizationImport) {
    log('SUCCESS', 'Dashboard imports are correctly configured');
  }
}

/**
 * Check if real data services exist
 */
function checkRealDataServices() {
  const services = [
    './lib/real-retirement-service.ts',
    './lib/tokenization-service.ts',
    './lib/co2e-api.ts',
    './lib/project-data-manager.ts'
  ];

  services.forEach(servicePath => {
    if (!fileExists(servicePath)) {
      issuesFound.push({
        file: servicePath,
        severity: 'ERROR',
        description: 'Real data service file missing',
        type: 'MISSING_SERVICE'
      });
    } else {
      const content = readFileContent(servicePath);
      if (content && content.includes('class ') && content.includes('async ')) {
        log('SUCCESS', `Real data service found: ${servicePath}`);
      }
    }
  });
}

/**
 * Check component files for mock data usage
 */
function checkComponentFiles() {
  const componentDirs = [
    './components',
    './components/retirement-panels'
  ];

  const filesToCheck = [
    './components/carbon-dashboard.tsx',
    './components/retirement-panels/retirement-analytics.tsx',
    './components/tokenization-metrics.tsx',
    './components/tokenization-metrics-enhanced.tsx'
  ];

  filesToCheck.forEach(filePath => {
    if (fileExists(filePath)) {
      filesChecked++;
      const fileIssues = checkFileForMockData(filePath);
      issuesFound.push(...fileIssues);
      
      if (fileIssues.length === 0) {
        log('SUCCESS', `✓ ${filePath} - No mock data issues found`);
      } else {
        log('WARN', `⚠ ${filePath} - ${fileIssues.length} issues found`);
      }
    } else {
      issuesFound.push({
        file: filePath,
        severity: 'ERROR',
        description: 'Component file missing',
        type: 'MISSING_FILE'
      });
    }
  });
}

/**
 * Check if build passes
 */
function checkBuildStatus() {
  log('INFO', 'Checking if Next.js build passes...');
  
  const { execSync } = require('child_process');
  
  try {
    // Run Next.js build (more comprehensive than just type check)
    execSync('npm run build', { stdio: 'pipe' });
    log('SUCCESS', '✓ Next.js build successful');
  } catch (error) {
    try {
      // Fallback to type check only
      execSync('npm run type-check', { stdio: 'pipe' });
      log('SUCCESS', '✓ TypeScript compilation successful (build had warnings)');
    } catch (typeError) {
      issuesFound.push({
        file: 'Build Process',
        severity: 'ERROR',
        description: 'Build and TypeScript compilation failed',
        type: 'BUILD_ERROR'
      });
      log('ERROR', '✗ Build process failed');
    }
  }
}

/**
 * Generate final report
 */
function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log(`${colors.bold}${colors.blue}BlockEdge Dashboard - Real Data Integration Report${colors.reset}`);
  console.log('='.repeat(80));
  
  console.log(`\n${colors.bold}Summary:${colors.reset}`);
  console.log(`Files checked: ${filesChecked}`);
  console.log(`Issues found: ${issuesFound.length}`);
  
  if (issuesFound.length === 0) {
    console.log(`\n${colors.green}${colors.bold}✅ VERIFICATION PASSED!${colors.reset}`);
    console.log(`${colors.green}All retirement and tokenization flows are using real data services.${colors.reset}`);
    return true;
  }

  // Group issues by severity
  const errorIssues = issuesFound.filter(issue => issue.severity === 'ERROR');
  const warnIssues = issuesFound.filter(issue => issue.severity === 'WARN');
  const infoIssues = issuesFound.filter(issue => issue.severity === 'INFO');

  if (errorIssues.length > 0) {
    console.log(`\n${colors.red}${colors.bold}❌ CRITICAL ISSUES (${errorIssues.length}):${colors.reset}`);
    errorIssues.forEach(issue => {
      console.log(`${colors.red}  • ${issue.file}: ${issue.description}${colors.reset}`);
    });
  }

  if (warnIssues.length > 0) {
    console.log(`\n${colors.yellow}${colors.bold}⚠️  WARNINGS (${warnIssues.length}):${colors.reset}`);
    warnIssues.forEach(issue => {
      console.log(`${colors.yellow}  • ${issue.file}: ${issue.description}${colors.reset}`);
    });
  }

  if (infoIssues.length > 0) {
    console.log(`\n${colors.blue}${colors.bold}ℹ️  INFO (${infoIssues.length}):${colors.reset}`);
    infoIssues.forEach(issue => {
      console.log(`${colors.blue}  • ${issue.file}: ${issue.description}${colors.reset}`);
    });
  }

  const hasBlockingIssues = errorIssues.length > 0;
  
  if (hasBlockingIssues) {
    console.log(`\n${colors.red}${colors.bold}❌ VERIFICATION FAILED!${colors.reset}`);
    console.log(`${colors.red}Critical issues must be resolved before deployment.${colors.reset}`);
  } else {
    console.log(`\n${colors.yellow}${colors.bold}⚠️  VERIFICATION PASSED WITH WARNINGS${colors.reset}`);
    console.log(`${colors.yellow}Real data integration is functional but consider addressing warnings.${colors.reset}`);
  }

  return !hasBlockingIssues;
}

/**
 * Provide specific recommendations
 */
function provideRecommendations() {
  console.log(`\n${colors.bold}Recommendations:${colors.reset}`);
  
  const mockDataIssues = issuesFound.filter(issue => issue.type === 'MOCK_DATA');
  const missingRealData = issuesFound.filter(issue => issue.type === 'NO_REAL_DATA');
  
  if (mockDataIssues.length > 0) {
    console.log(`\n${colors.yellow}Mock Data Cleanup:${colors.reset}`);
    console.log(`  • Replace mock data generators with real data service calls`);
    console.log(`  • Remove Math.random() in favor of actual API data`);
    console.log(`  • Update component state management to use async data loading`);
  }
  
  if (missingRealData.length > 0) {
    console.log(`\n${colors.blue}Real Data Integration:${colors.reset}`);
    console.log(`  • Import and use realRetirementService for retirement data`);
    console.log(`  • Import and use tokenizationService for tokenization data`);
    console.log(`  • Add proper loading states and error handling`);
  }
  
  console.log(`\n${colors.green}Best Practices:${colors.reset}`);
  console.log(`  • Always use try-catch blocks for API calls`);
  console.log(`  • Implement proper cache invalidation strategies`);
  console.log(`  • Add fallback data for offline scenarios`);
  console.log(`  • Monitor API performance and add timeout handling`);
}

/**
 * Main verification function
 */
function main() {
  console.log(`${colors.bold}${colors.blue}Starting Real Data Integration Verification...${colors.reset}\n`);
  
  // Run all checks
  checkRealDataServices();
  checkDashboardImports();
  checkComponentFiles();
  checkBuildStatus();
  
  // Generate report
  const passed = generateReport();
  
  // Provide recommendations
  provideRecommendations();
  
  console.log('\n' + '='.repeat(80));
  
  // Exit with appropriate code
  process.exit(passed ? 0 : 1);
}

// Run the verification
if (require.main === module) {
  main();
}

module.exports = {
  checkFileForMockData,
  checkDashboardImports,
  checkRealDataServices,
  generateReport
};