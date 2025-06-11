#!/usr/bin/env node

// Test script to verify BlockEdge JSON data fetching
const fetch = require("node-fetch");

async function testDataFetching() {
  const url = "https://asset.blockedge.co/blockedge-co2e-project.json";

  console.log("🔍 Testing data fetch from:", url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    console.log("✅ Successfully fetched data!");
    console.log("📊 Data structure:");
    console.log("- Has carbonCreditProjects:", !!data.carbonCreditProjects);

    if (data.carbonCreditProjects) {
      const standards = Object.keys(data.carbonCreditProjects);
      console.log("- Standards found:", standards);

      let totalProjects = 0;
      standards.forEach((standard) => {
        const projects = data.carbonCreditProjects[standard].projects;
        if (projects && Array.isArray(projects)) {
          console.log(`  - ${standard}: ${projects.length} projects`);
          totalProjects += projects.length;
        }
      });

      console.log(`📈 Total projects: ${totalProjects}`);

      // Test a sample project
      const firstStandard = standards[0];
      const firstProject =
        data.carbonCreditProjects[firstStandard]?.projects?.[0];
      if (firstProject) {
        console.log("🔬 Sample project:");
        console.log(`  - ID: ${firstProject.projectId}`);
        console.log(`  - Name: ${firstProject.projectName}`);
        console.log(`  - Token: ${firstProject.token}`);
        console.log(`  - Cert: ${firstProject.cert}`);
      }
    }
  } catch (error) {
    console.error("❌ Error fetching data:", error.message);
    process.exit(1);
  }
}

testDataFetching();
