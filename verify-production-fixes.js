#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 BlockEdge Dashboard - Production Fixes Verification\n');

const checks = {
  mobileResponsive: [],
  performance: [],
  accessibility: [],
  errorHandling: [],
  production: []
};

// Check if file exists
function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, filePath));
}

// Read file content
function readFile(filePath) {
  try {
    return fs.readFileSync(path.join(__dirname, filePath), 'utf8');
  } catch (error) {
    return '';
  }
}

// Mobile Responsive Checks
console.log('📱 Checking Mobile Responsiveness...');

if (fileExists('components/responsive-navigation.tsx')) {
  checks.mobileResponsive.push('✅ Responsive navigation component created');
} else {
  checks.mobileResponsive.push('❌ Missing responsive navigation component');
}

const dashboardContent = readFile('components/carbon-dashboard.tsx');
if (dashboardContent.includes('sm:') && dashboardContent.includes('lg:')) {
  checks.mobileResponsive.push('✅ Mobile breakpoints implemented in dashboard');
} else {
  checks.mobileResponsive.push('❌ Missing mobile breakpoints in dashboard');
}

if (dashboardContent.includes('min-h-[44px]') || dashboardContent.includes('touch-manipulation')) {
  checks.mobileResponsive.push('✅ Touch-friendly targets implemented');
} else {
  checks.mobileResponsive.push('❌ Missing touch-friendly targets');
}

// Performance Checks
console.log('⚡ Checking Performance Optimizations...');

if (fileExists('components/lazy-components.tsx')) {
  checks.performance.push('✅ Lazy loading components implemented');
} else {
  checks.performance.push('❌ Missing lazy loading components');
}

if (fileExists('components/error-boundary.tsx')) {
  checks.performance.push('✅ Error boundaries created');
} else {
  checks.performance.push('❌ Missing error boundaries');
}

const nextConfig = readFile('next.config.mjs');
if (nextConfig.includes('swcMinify') && nextConfig.includes('splitChunks')) {
  checks.performance.push('✅ Next.js performance optimizations configured');
} else {
  checks.performance.push('❌ Missing Next.js performance optimizations');
}

if (dashboardContent.includes('usePerformance') || dashboardContent.includes('shouldReduceAnimations')) {
  checks.performance.push('✅ Performance hooks implemented');
} else {
  checks.performance.push('❌ Missing performance hooks');
}

// Accessibility Checks
console.log('♿ Checking Accessibility Improvements...');

if (fileExists('components/accessibility-utils.tsx')) {
  checks.accessibility.push('✅ Accessibility utilities created');
} else {
  checks.accessibility.push('❌ Missing accessibility utilities');
}

const layoutContent = readFile('app/layout.tsx');
if (layoutContent.includes('Skip to main content') && layoutContent.includes('aria-live')) {
  checks.accessibility.push('✅ Skip links and ARIA live regions implemented');
} else {
  checks.accessibility.push('❌ Missing skip links or ARIA live regions');
}

const globalCSS = readFile('app/globals.css');
if (globalCSS.includes('sr-only') && globalCSS.includes('prefers-reduced-motion')) {
  checks.accessibility.push('✅ CSS accessibility improvements added');
} else {
  checks.accessibility.push('❌ Missing CSS accessibility improvements');
}

const buttonComponent = readFile('components/ui/button.tsx');
if (buttonComponent.includes('aria-busy') && buttonComponent.includes('min-h-[44px]')) {
  checks.accessibility.push('✅ Button component accessibility enhanced');
} else {
  checks.accessibility.push('❌ Button component accessibility not enhanced');
}

// Error Handling Checks
console.log('🛡️ Checking Error Handling...');

if (dashboardContent.includes('ErrorBoundaryWrapper')) {
  checks.errorHandling.push('✅ Error boundaries integrated in dashboard');
} else {
  checks.errorHandling.push('❌ Error boundaries not integrated in dashboard');
}

if (fileExists('components/error-boundary.tsx')) {
  const errorBoundary = readFile('components/error-boundary.tsx');
  if (errorBoundary.includes('componentDidCatch') && errorBoundary.includes('ErrorFallback')) {
    checks.errorHandling.push('✅ Comprehensive error boundary implementation');
  } else {
    checks.errorHandling.push('❌ Incomplete error boundary implementation');
  }
} else {
  checks.errorHandling.push('❌ Missing error boundary component');
}

// Production Configuration Checks
console.log('🚀 Checking Production Configuration...');

if (nextConfig.includes('headers()') && nextConfig.includes('Content-Security-Policy')) {
  checks.production.push('✅ Security headers configured');
} else {
  checks.production.push('❌ Missing security headers');
}

if (layoutContent.includes('metadataBase') && layoutContent.includes('viewport')) {
  checks.production.push('✅ SEO and metadata optimizations implemented');
} else {
  checks.production.push('❌ Missing SEO and metadata optimizations');
}

if (nextConfig.includes('compress: true') && nextConfig.includes('swcMinify: true')) {
  checks.production.push('✅ Build optimizations enabled');
} else {
  checks.production.push('❌ Missing build optimizations');
}

if (globalCSS.includes('antialiased') && globalCSS.includes('text-rendering')) {
  checks.production.push('✅ Font rendering optimizations added');
} else {
  checks.production.push('❌ Missing font rendering optimizations');
}

// Performance monitoring
if (layoutContent.includes('performance.getEntriesByType')) {
  checks.production.push('✅ Performance monitoring implemented');
} else {
  checks.production.push('❌ Missing performance monitoring');
}

// Display Results
console.log('\n📊 VERIFICATION RESULTS\n');

const categories = [
  { name: '📱 Mobile Responsiveness', checks: checks.mobileResponsive },
  { name: '⚡ Performance Optimizations', checks: checks.performance },
  { name: '♿ Accessibility Improvements', checks: checks.accessibility },
  { name: '🛡️ Error Handling', checks: checks.errorHandling },
  { name: '🚀 Production Configuration', checks: checks.production }
];

let totalChecks = 0;
let passedChecks = 0;

categories.forEach(category => {
  console.log(`${category.name}:`);
  category.checks.forEach(check => {
    console.log(`  ${check}`);
    totalChecks++;
    if (check.startsWith('✅')) passedChecks++;
  });
  console.log('');
});

const successRate = Math.round((passedChecks / totalChecks) * 100);

console.log('📈 SUMMARY');
console.log(`Total Checks: ${totalChecks}`);
console.log(`Passed: ${passedChecks}`);
console.log(`Failed: ${totalChecks - passedChecks}`);
console.log(`Success Rate: ${successRate}%\n`);

if (successRate >= 90) {
  console.log('🎉 EXCELLENT! Dashboard is production-ready with comprehensive fixes.');
} else if (successRate >= 75) {
  console.log('✅ GOOD! Most fixes are implemented. Address remaining issues for full production readiness.');
} else if (successRate >= 50) {
  console.log('⚠️  PARTIAL! Significant fixes implemented but more work needed for production.');
} else {
  console.log('❌ NEEDS WORK! Many critical fixes are missing. Continue development before production.');
}

console.log('\n💡 NEXT STEPS:');
if (passedChecks < totalChecks) {
  console.log('1. Address any failed checks above');
  console.log('2. Test all responsive breakpoints manually');
  console.log('3. Run accessibility testing with screen readers');
  console.log('4. Perform load testing for performance validation');
} else {
  console.log('1. Run `npm run build` to test production build');
  console.log('2. Deploy to staging environment for final testing');
  console.log('3. Perform manual accessibility and mobile testing');
  console.log('4. Monitor performance metrics after deployment');
}

console.log('\n🔧 DEVELOPMENT COMMANDS:');
console.log('npm run dev          # Start development server');
console.log('npm run build        # Create production build');
console.log('npm run lint         # Check code quality');
console.log('npm run type-check   # Verify TypeScript types');

process.exit(successRate >= 75 ? 0 : 1);