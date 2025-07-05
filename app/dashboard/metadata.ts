import type { Metadata } from "next";

export const dashboardMetadata: Metadata = {
  title: "Carbon Credit Dashboard | BlockEdge",
  description: "Real-time carbon credit trading dashboard with blockchain transparency. Track CO2 reduction projects, institutional flows, and ESG compliance metrics.",
  keywords: [
    "carbon credits",
    "blockchain",
    "CO2 reduction",
    "ESG compliance",
    "institutional trading",
    "environmental impact",
    "sustainability",
    "carbon offset",
    "renewable energy",
    "climate action"
  ],
  authors: [{ name: "BlockEdge" }],
  creator: "BlockEdge",
  publisher: "BlockEdge",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dashboard.blockedge.com/dashboard",
    siteName: "BlockEdge",
    title: "Carbon Credit Dashboard | BlockEdge",
    description: "Real-time carbon credit trading dashboard with blockchain transparency",
    images: [
      {
        url: "/dashboard-preview.jpg",
        width: 1200,
        height: 630,
        alt: "BlockEdge Carbon Credit Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Carbon Credit Dashboard | BlockEdge",
    description: "Real-time carbon credit trading dashboard with blockchain transparency",
    creator: "@BlockEdgeIO",
    images: ["/dashboard-preview.jpg"],
  },
  alternates: {
    canonical: "https://dashboard.blockedge.com/dashboard",
  },
  other: {
    "application-name": "BlockEdge Dashboard",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "theme-color": "#0f172a",
  },
};