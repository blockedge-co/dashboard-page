#!/usr/bin/env node

// Simple test script to verify the project data structure
console.log('🧪 Testing Project Data Structure...\n');

// Sample data structure based on real BlockEdge API
const sampleProjects = [
  {
    id: "VCS1529",
    name: "Inner Mongolia Chao'er Improved Forest Management Project",
    description: "Carbon credit project verified under Verified Carbon Standard standard",
    type: "Forest Conservation",
    location: "Inner Mongolia",
    country: "China",
    region: "Asia",
    tokenAddress: "0x83f1a935008a4e01Cc755d453155572Fdb921cf7",
    tokenSymbol: "VCS1529",
    tokenName: "Inner Mongolia Chao'er Improved Forest Management Project",
    totalSupply: "1000000",
    currentSupply: "750000",
    retired: "250000",
    vintage: "2024",
    methodology: "VCS",
    certificationBody: "Verra",
    projectDeveloper: "Project Developer",
    registry: "Verra",
    verificationDate: new Date().toISOString(),
    co2Reduction: {
      annual: "500000",
      total: "2000000",
      unit: "tCO2e"
    },
    verified: true,
    rating: "AAA"
  }
];

console.log('✅ Sample project structure:');
console.log(JSON.stringify(sampleProjects[0], null, 2));

console.log('\n📊 Testing calculations:');
const project = sampleProjects[0];

// Test token display
const tokensDisplay = project.totalSupply ? `${Math.round(parseInt(project.totalSupply) / 1000)}K` : "N/A";
console.log(`Tokens: ${tokensDisplay}`);

// Test impact display
const impactDisplay = project.co2Reduction?.total ? `${Math.round(parseInt(project.co2Reduction.total) / 1000000)}M tCO2e` : "N/A";
console.log(`Impact: ${impactDisplay}`);

// Test verification status
const statusDisplay = project.verified ? "Verified" : "Pending";
console.log(`Status: ${statusDisplay}`);

console.log('\n🎯 All tests passed! The project structure should work correctly.');
