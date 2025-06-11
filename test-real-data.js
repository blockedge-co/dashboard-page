#!/usr/bin/env node

console.log("Testing real data fetch...");

// Simple test
const https = require("https");

const url = "https://asset.blockedge.co/blockedge-co2e-project.json";

https
  .get(url, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const parsed = JSON.parse(data);
        console.log("✅ Successfully fetched BlockEdge data");
        console.log(
          `📊 Found ${
            Object.keys(parsed.carbonCreditProjects).length
          } standards`
        );

        Object.entries(parsed.carbonCreditProjects).forEach(
          ([standardKey, standard]) => {
            console.log(
              `   • ${standardKey}: ${standard.projects.length} projects`
            );
            if (standard.projects.length > 0) {
              console.log(
                `     └─ ${standard.projects[0].projectId}: ${standard.projects[0].projectName}`
              );
            }
          }
        );
      } catch (error) {
        console.error("❌ Error parsing data:", error);
      }
    });
  })
  .on("error", (error) => {
    console.error("❌ Error fetching data:", error);
  });
