import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Fetch data from BlockEdge API (server-side, no CORS issues)
    const response = await fetch(
      "https://asset.blockedge.co/blockedge-co2e-project.json",
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "BlockEdge-Dashboard/1.0",
        },
        // Add cache control
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Return the data with proper CORS headers
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Cache-Control": "public, max-age=300", // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error("Error fetching BlockEdge data:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch projects data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
