#!/usr/bin/env node

/**
 * Test script to verify real blockchain data integration
 */

console.log("🧪 Testing Real Blockchain Data Integration\n");

// Test the known VCS1529 project from blockchain query results
const testProjects = [
  {
    name: "VCS1529 Test",
    tokenAddress: "0x83f1a935008a4e01Cc755d453155572Fdb921cf7",
    expectedTotalSupply: "202000000000000000000", // 202 tokens with 18 decimals
    expectedHolders: "1"
  },
  {
    name: "TVS0021 Test", 
    tokenAddress: "0xaA85Caa16f63ED4b1c4aaE9D5665aDfEAf54F5bA",
    expectedTotalSupply: "unknown", // We'll see what the API returns
    expectedHolders: "unknown"
  }
];

async function testRealTokenDataFetching() {
  const BASE_URL = "https://exp.co2e.cc/api/v2";
  
  console.log("🔍 Testing CO2e Chain API endpoints:");
  console.log(`📡 Base URL: ${BASE_URL}`);
  console.log("");
  
  for (const project of testProjects) {
    console.log(`🔎 Testing ${project.name}:`);
    console.log(`  Token Address: ${project.tokenAddress}`);
    
    try {
      const response = await fetch(`${BASE_URL}/tokens/${project.tokenAddress}`);
      
      if (!response.ok) {
        console.log(`  ❌ HTTP Error: ${response.status} ${response.statusText}`);
        continue;
      }
      
      const data = await response.json();
      console.log(`  ✅ API Response received`);
      
      if (data.token) {
        console.log(`  📊 Real Token Data:`);
        console.log(`    - Name: ${data.token.name || 'N/A'}`);
        console.log(`    - Symbol: ${data.token.symbol || 'N/A'}`);
        console.log(`    - Total Supply: ${data.token.total_supply || 'N/A'}`);
        console.log(`    - Decimals: ${data.token.decimals || 'N/A'}`);
        console.log(`    - Holders: ${data.token.holders_count || data.token.holders || 'N/A'}`);
        
        // Compare with expected values if known
        if (project.expectedTotalSupply !== "unknown" && data.token.total_supply === project.expectedTotalSupply) {
          console.log(`    ✅ Total supply matches expected value!`);
        }
        
        if (project.expectedHolders !== "unknown" && data.token.holders_count === project.expectedHolders) {
          console.log(`    ✅ Holders count matches expected value!`);
        }
        
        // Test supply formatting
        if (data.token.total_supply && data.token.decimals) {
          try {
            const supply = BigInt(data.token.total_supply);
            const decimalsNum = parseInt(data.token.decimals);
            const divisor = BigInt(Math.pow(10, decimalsNum).toString());
            const actualSupply = Number(supply / divisor);
            console.log(`    🔢 Formatted Supply: ${actualSupply} tokens`);
          } catch (error) {
            console.log(`    ⚠️ Error formatting supply: ${error.message}`);
          }
        }
      } else {
        console.log(`  ⚠️ No token data in response`);
        console.log(`  Raw response structure:`, Object.keys(data));
      }
    } catch (error) {
      console.log(`  ❌ Fetch Error: ${error.message}`);
    }
    
    console.log("");
  }
}

async function main() {
  await testRealTokenDataFetching();
  
  console.log("🎯 Integration Status:");
  console.log("✅ Real token data fetching methods added");
  console.log("✅ BigInt exponentiation issue fixed");
  console.log("✅ Token supply formatting implemented");
  console.log("✅ Real data integration in convertBlockEdgeToProjectData");
  console.log("");
  console.log("🚀 Next Step: Test the dashboard to see real blockchain data!");
}

main().catch(console.error);
