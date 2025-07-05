import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: "BlockEdge - Enterprise Carbon Credit Platform",
  description: "Advanced blockchain-based carbon credit trading platform with real-time analytics, institutional-grade compliance, and intelligent ESG portfolio management.",
  keywords: [
    "carbon credits",
    "blockchain",
    "ESG",
    "sustainability",
    "enterprise",
    "trading platform",
    "CO2e",
    "environmental finance"
  ],
  authors: [{ name: "BlockEdge Team" }],
  creator: "BlockEdge",
  publisher: "BlockEdge",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://dashboard.blockedge.co'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dashboard.blockedge.co',
    title: 'BlockEdge - Enterprise Carbon Credit Platform',
    description: 'Advanced blockchain-based carbon credit trading platform with real-time analytics.',
    siteName: 'BlockEdge Dashboard',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlockEdge - Enterprise Carbon Credit Platform',
    description: 'Advanced blockchain-based carbon credit trading platform with real-time analytics.',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#10b981' },
    { media: '(prefers-color-scheme: dark)', color: '#064e3b' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
        
        {/* Performance hints */}
        <link rel="dns-prefetch" href="//asset.blockedge.co" />
        <link rel="preconnect" href="https://exp.co2e.cc" />
      </head>
      <body 
        className={`${inter.className} antialiased`}
        suppressHydrationWarning={true}
      >
        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          Skip to main content
        </a>
        
        <div id="root">
          <main id="main-content" role="main" tabIndex={-1}>
            {children}
          </main>
        </div>
        
        {/* Accessibility announcements */}
        <div id="a11y-announcer" aria-live="polite" aria-atomic="true" className="sr-only" />
        
        {/* Performance monitoring script placeholder */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Basic performance monitoring
                if ('performance' in window) {
                  window.addEventListener('load', function() {
                    setTimeout(function() {
                      const perfData = performance.getEntriesByType('navigation')[0];
                      if (perfData && perfData.loadEventEnd - perfData.fetchStart > 3000) {
                        console.warn('Page load time exceeded 3 seconds:', perfData.loadEventEnd - perfData.fetchStart);
                      }
                    }, 0);
                  });
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  )
}
