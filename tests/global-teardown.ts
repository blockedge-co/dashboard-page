import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test teardown...');
  
  try {
    // Clean up any test data or resources
    console.log('🗑️ Cleaning up test artifacts...');
    
    // Clear any test files or data that might have been created
    // This could include temporary files, test databases, etc.
    
    // Log test results summary if available
    const testResultsPath = './test-results';
    try {
      const fs = require('fs');
      if (fs.existsSync(`${testResultsPath}/results.json`)) {
        const results = JSON.parse(fs.readFileSync(`${testResultsPath}/results.json`, 'utf8'));
        console.log(`📊 Test Results Summary:`);
        console.log(`   ✅ Passed: ${results.suites?.reduce((acc: number, suite: any) => acc + (suite.specs?.filter((spec: any) => spec.tests?.[0]?.results?.[0]?.status === 'passed').length || 0), 0) || 0}`);
        console.log(`   ❌ Failed: ${results.suites?.reduce((acc: number, suite: any) => acc + (suite.specs?.filter((spec: any) => spec.tests?.[0]?.results?.[0]?.status === 'failed').length || 0), 0) || 0}`);
        console.log(`   ⏩ Skipped: ${results.suites?.reduce((acc: number, suite: any) => acc + (suite.specs?.filter((spec: any) => spec.tests?.[0]?.results?.[0]?.status === 'skipped').length || 0), 0) || 0}`);
      }
    } catch (error) {
      // Ignore errors when reading test results
    }

    console.log('✅ Global teardown completed successfully');

  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    // Don't throw here as it might mask test failures
  }
}

export default globalTeardown;