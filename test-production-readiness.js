#!/usr/bin/env node

/**
 * Production Readiness Test for BlockEdge Dashboard
 * Tests data fetching, parsing, and error handling
 */

const https = require('https');
const fs = require('fs');

const CONFIG = {
  dataUrl: 'https://asset.blockedge.co/blockedge-co2e-project.json',
  timeout: 10000
};

async function fetchData(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: CONFIG.timeout }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (error) {
          reject(new Error(`JSON parsing failed: ${error.message}`));
        }
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request timeout after ${CONFIG.timeout}ms`));
    });
    
    req.on('error', (error) => {
      reject(error);
    });
  });
}

function validateDataStructure(data) {
  const errors = [];
  
  // Check top level structure
  if (!data.carbonCreditProjects) {
    errors.push('Missing carbonCreditProjects field');
    return errors;
  }
  
  const standards = Object.keys(data.carbonCreditProjects);
  if (standards.length === 0) {
    errors.push('No standards found in carbonCreditProjects');
    return errors;
  }
  
  let totalProjects = 0;
  
  standards.forEach(standardKey => {
    const standard = data.carbonCreditProjects[standardKey];
    
    // Check standard structure
    if (!standard.standardName) {
      errors.push(`${standardKey}: Missing standardName`);
    }
    if (!standard.standardCode) {
      errors.push(`${standardKey}: Missing standardCode`);
    }
    if (!standard.registry) {
      errors.push(`${standardKey}: Missing registry`);
    }
    
    // Check projects array
    if (!standard.projects || !Array.isArray(standard.projects)) {
      errors.push(`${standardKey}: Missing or invalid projects array`);
      return;
    }
    
    totalProjects += standard.projects.length;
    
    // Validate first project structure (sample)
    if (standard.projects.length > 0) {
      const project = standard.projects[0];
      if (!project.projectId) {
        errors.push(`${standardKey}: Project missing projectId`);
      }
      if (!project.projectName) {
        errors.push(`${standardKey}: Project missing projectName`);
      }
      if (!project.token) {
        errors.push(`${standardKey}: Project missing token address`);
      }
      if (!project.cert) {
        errors.push(`${standardKey}: Project missing cert address`);
      }
    }
  });
  
  console.log(`📊 Found ${standards.length} standards with ${totalProjects} total projects`);
  
  return errors;
}

function checkEnvironmentConfig() {
  console.log('\n🔧 Environment Configuration Check:');
  
  // Check .env.local file
  if (fs.existsSync('.env.local')) {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    if (envContent.includes('NEXT_PUBLIC_PROJECTS_DATA_URL')) {
      console.log('✅ .env.local file exists with NEXT_PUBLIC_PROJECTS_DATA_URL');
    } else {
      console.log('⚠️  .env.local exists but missing NEXT_PUBLIC_PROJECTS_DATA_URL');
    }
  } else {
    console.log('⚠️  No .env.local file found');
  }
  
  // Check .env.example file
  if (fs.existsSync('.env.example')) {
    console.log('✅ .env.example file exists');
  } else {
    console.log('⚠️  No .env.example file found');
  }
  
  // Check production setup documentation
  if (fs.existsSync('PRODUCTION_SETUP.md')) {
    console.log('✅ PRODUCTION_SETUP.md documentation exists');
  } else {
    console.log('⚠️  No PRODUCTION_SETUP.md documentation found');
  }
}

async function runTests() {
  console.log('🚀 BlockEdge Dashboard Production Readiness Test\n');
  
  try {
    // Test 1: Environment Configuration
    checkEnvironmentConfig();
    
    // Test 2: Data Fetching
    console.log('\n📡 Testing data fetch from:', CONFIG.dataUrl);
    const data = await fetchData(CONFIG.dataUrl);
    console.log('✅ Data fetch successful');
    
    // Test 3: Data Structure Validation
    console.log('\n🔍 Validating data structure...');
    const errors = validateDataStructure(data);
    
    if (errors.length === 0) {
      console.log('✅ Data structure validation passed');
    } else {
      console.log('❌ Data structure validation failed:');
      errors.forEach(error => console.log(`   - ${error}`));
      process.exit(1);
    }
    
    // Test 4: Sample Data Display
    console.log('\n📋 Sample Project Data:');
    const firstStandard = Object.keys(data.carbonCreditProjects)[0];
    const firstProject = data.carbonCreditProjects[firstStandard].projects[0];
    
    console.log(`   Standard: ${data.carbonCreditProjects[firstStandard].standardName}`);
    console.log(`   Project ID: ${firstProject.projectId}`);
    console.log(`   Project Name: ${firstProject.projectName}`);
    console.log(`   Token Address: ${firstProject.token}`);
    console.log(`   Cert Address: ${firstProject.cert}`);
    
    console.log('\n🎉 All production readiness tests passed!');
    console.log('\n✅ Dashboard is ready for production deployment');
    
  } catch (error) {
    console.error('\n❌ Production readiness test failed:', error.message);
    process.exit(1);
  }
}

runTests();
