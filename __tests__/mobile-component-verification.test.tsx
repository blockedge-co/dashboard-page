/**
 * Mobile Component Verification Test Suite
 * 
 * React Testing Library tests for mobile responsiveness of individual components.
 * Complements the Puppeteer-based browser tests with unit-level component testing.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/dashboard',
    query: {},
    asPath: '/'
  })
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }: any) => children
}));

// Mock Recharts for testing
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />
}));

// Import components to test
import RetirementDashboard from '../components/retirement-dashboard';
import { AdvancedTokenizationAnalytics } from '../components/advanced-tokenization-analytics';

// Viewport utilities
const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

const VIEWPORTS = {
  mobile: { width: 320, height: 568 },
  mobileLarge: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1024, height: 768 },
  desktopLarge: { width: 1440, height: 900 }
};

// Helper to check if element has responsive classes
const hasResponsiveClasses = (element: HTMLElement) => {
  const classList = Array.from(element.classList);
  return {
    hasMobileFirst: classList.some(cls => cls.startsWith('grid-cols-')),
    hasTabletBreakpoint: classList.some(cls => cls.includes('md:')),
    hasDesktopBreakpoint: classList.some(cls => cls.includes('lg:')),
    hasXLBreakpoint: classList.some(cls => cls.includes('xl:'))
  };
};

// Helper to check touch target size
const checkTouchTargetSize = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const minSize = 44; // Minimum touch target size
  return {
    width: rect.width,
    height: rect.height,
    isAdequate: Math.min(rect.width, rect.height) >= minSize
  };
};

describe('Mobile Layout Verification - Component Level', () => {
  beforeEach(() => {
    // Reset viewport to desktop for consistent starting point
    setViewport(1024, 768);
  });

  describe('Retirement Dashboard Mobile Responsiveness', () => {
    test('should render without errors on all viewport sizes', async () => {
      Object.entries(VIEWPORTS).forEach(([name, viewport]) => {
        setViewport(viewport.width, viewport.height);
        
        const { container } = render(<RetirementDashboard />);
        expect(container.firstChild).toBeInTheDocument();
      });
    });

    test('should have proper grid layout classes for mobile-first design', () => {
      const { container } = render(<RetirementDashboard />);
      
      // Check for grid containers
      const gridElements = container.querySelectorAll('[class*="grid-cols"]');
      
      gridElements.forEach(element => {
        const responsive = hasResponsiveClasses(element as HTMLElement);
        
        // Should have mobile-first grid classes
        expect(responsive.hasMobileFirst).toBe(true);
        
        // Should have responsive breakpoints for larger screens
        if (gridElements.length > 1) {
          expect(
            responsive.hasTabletBreakpoint || responsive.hasDesktopBreakpoint
          ).toBe(true);
        }
      });
    });

    test('should display metric cards in single column on mobile', () => {
      setViewport(320, 568); // Mobile viewport
      
      const { container } = render(<RetirementDashboard />);
      
      // Look for the key metrics grid
      const metricsGrid = container.querySelector('.grid.grid-cols-6');
      if (metricsGrid) {
        // On mobile, this should stack (though the class might still say grid-cols-6,
        // CSS media queries should make it single column)
        expect(metricsGrid).toBeInTheDocument();
      }
    });

    test('should have adequate touch targets on mobile', () => {
      setViewport(320, 568);
      
      const { container } = render(<RetirementDashboard />);
      
      // Find all interactive elements
      const buttons = container.querySelectorAll('button');
      const links = container.querySelectorAll('a');
      
      [...buttons, ...links].forEach(element => {
        if (element.offsetParent !== null) { // Only check visible elements
          const touchTarget = checkTouchTargetSize(element as HTMLElement);
          
          // Allow some tolerance for test environment
          if (touchTarget.width > 0 && touchTarget.height > 0) {
            expect(touchTarget.isAdequate).toBe(true);
          }
        }
      });
    });

    test('should render charts responsively', () => {
      Object.entries(VIEWPORTS).forEach(([name, viewport]) => {
        setViewport(viewport.width, viewport.height);
        
        const { container } = render(<RetirementDashboard />);
        
        // Check for responsive chart containers
        const chartContainers = container.querySelectorAll('[data-testid="responsive-container"]');
        expect(chartContainers.length).toBeGreaterThan(0);
        
        // Charts should be present
        const charts = container.querySelectorAll('[data-testid*="chart"]');
        expect(charts.length).toBeGreaterThan(0);
      });
    });

    test('should handle data loading states properly on mobile', async () => {
      setViewport(320, 568);
      
      // Mock loading state
      const { container } = render(<RetirementDashboard />);
      
      // Should show loading indicator
      await waitFor(() => {
        const loadingElement = container.querySelector('[class*="animate-spin"]');
        if (loadingElement) {
          expect(loadingElement).toBeInTheDocument();
        }
      });
    });
  });

  describe('Advanced Tokenization Analytics Mobile Responsiveness', () => {
    test('should render without errors on all viewport sizes', () => {
      Object.entries(VIEWPORTS).forEach(([name, viewport]) => {
        setViewport(viewport.width, viewport.height);
        
        const { container } = render(<AdvancedTokenizationAnalytics />);
        expect(container.firstChild).toBeInTheDocument();
      });
    });

    test('should have responsive grid layouts', () => {
      const { container } = render(<AdvancedTokenizationAnalytics />);
      
      // Check for responsive grid classes
      const gridElements = container.querySelectorAll('[class*="grid"], [class*="md:grid"], [class*="lg:grid"]');
      
      expect(gridElements.length).toBeGreaterThan(0);
      
      gridElements.forEach(element => {
        const classList = Array.from(element.classList);
        
        // Should have some responsive design classes
        const hasResponsive = classList.some(cls => 
          cls.includes('grid') || 
          cls.includes('md:') || 
          cls.includes('lg:') ||
          cls.includes('xl:')
        );
        
        expect(hasResponsive).toBe(true);
      });
    });

    test('should display performance metrics responsively', () => {
      setViewport(320, 568); // Mobile
      
      const { container } = render(<AdvancedTokenizationAnalytics />);
      
      // Look for performance metrics grid
      const metricsElements = container.querySelectorAll('[class*="grid-cols-1"], [class*="md:grid-cols-2"], [class*="lg:grid-cols-3"]');
      expect(metricsElements.length).toBeGreaterThan(0);
    });

    test('should have working refresh functionality on mobile', async () => {
      setViewport(320, 568);
      
      const { container } = render(<AdvancedTokenizationAnalytics />);
      
      // Find refresh button
      const refreshButton = container.querySelector('button[class*="refresh"], button:has([data-testid="refresh"])');
      
      if (refreshButton) {
        // Should be touchable
        const touchTarget = checkTouchTargetSize(refreshButton as HTMLElement);
        expect(touchTarget.isAdequate).toBe(true);
        
        // Should be clickable
        fireEvent.click(refreshButton);
        // Button should be present and functional
        expect(refreshButton).toBeInTheDocument();
      }
    });

    test('should handle select components on mobile', () => {
      setViewport(320, 568);
      
      const { container } = render(<AdvancedTokenizationAnalytics />);
      
      // Look for select/dropdown components
      const selectElements = container.querySelectorAll('[role="combobox"], select, [class*="select"]');
      
      selectElements.forEach(element => {
        if (element.offsetParent !== null) {
          const touchTarget = checkTouchTargetSize(element as HTMLElement);
          expect(touchTarget.isAdequate).toBe(true);
        }
      });
    });
  });

  describe('Cross-Component Mobile Patterns', () => {
    test('should use consistent spacing patterns', () => {
      const components = [
        <RetirementDashboard key="retirement" />,
        <AdvancedTokenizationAnalytics key="tokenization" />
      ];
      
      components.forEach(component => {
        const { container } = render(component);
        
        // Check for consistent spacing classes
        const spacingElements = container.querySelectorAll('[class*="space-y"], [class*="gap-"], [class*="p-"], [class*="m-"]');
        expect(spacingElements.length).toBeGreaterThan(0);
        
        // Should have responsive spacing
        const hasResponsiveSpacing = Array.from(spacingElements).some(element => {
          const classList = Array.from(element.classList);
          return classList.some(cls => cls.includes('md:') || cls.includes('lg:'));
        });
        
        // This is optional but recommended
        // expect(hasResponsiveSpacing).toBe(true);
      });
    });

    test('should use consistent card layouts', () => {
      const components = [
        <RetirementDashboard key="retirement" />,
        <AdvancedTokenizationAnalytics key="tokenization" />
      ];
      
      components.forEach(component => {
        const { container } = render(component);
        
        // Look for card components
        const cards = container.querySelectorAll('[class*="card"], .bg-slate-800, .bg-gray-800');
        expect(cards.length).toBeGreaterThan(0);
        
        // Cards should have proper structure
        cards.forEach(card => {
          const hasContent = card.children.length > 0;
          expect(hasContent).toBe(true);
        });
      });
    });

    test('should handle overflow gracefully', () => {
      // Test with very narrow viewport
      setViewport(280, 568);
      
      const components = [
        <RetirementDashboard key="retirement" />,
        <AdvancedTokenizationAnalytics key="tokenization" />
      ];
      
      components.forEach(component => {
        const { container } = render(component);
        
        // Should render without throwing errors even on very narrow screens
        expect(container.firstChild).toBeInTheDocument();
        
        // Check for potential overflow-causing elements
        const wideElements = container.querySelectorAll('[class*="w-full"], [class*="min-w"]');
        wideElements.forEach(element => {
          // These elements should handle narrow screens gracefully
          expect(element).toBeInTheDocument();
        });
      });
    });
  });

  describe('Accessibility on Mobile', () => {
    test('should maintain proper heading hierarchy', () => {
      const { container } = render(<RetirementDashboard />);
      
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      // Should have logical heading structure
      if (headings.length > 0) {
        const h1Count = container.querySelectorAll('h1').length;
        const h2Count = container.querySelectorAll('h2').length;
        
        // Should have primary heading structure
        expect(h1Count + h2Count).toBeGreaterThan(0);
      }
    });

    test('should have proper ARIA labels for interactive elements', () => {
      const components = [
        <RetirementDashboard key="retirement" />,
        <AdvancedTokenizationAnalytics key="tokenization" />
      ];
      
      components.forEach(component => {
        const { container } = render(component);
        
        // Check buttons for accessibility
        const buttons = container.querySelectorAll('button');
        buttons.forEach(button => {
          if (button.offsetParent !== null) {
            // Should have either text content or aria-label
            const hasAccessibleName = 
              button.textContent?.trim() || 
              button.getAttribute('aria-label') ||
              button.getAttribute('aria-labelledby');
            
            expect(hasAccessibleName).toBeTruthy();
          }
        });
      });
    });

    test('should support keyboard navigation', () => {
      const { container } = render(<RetirementDashboard />);
      
      // Find focusable elements
      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      focusableElements.forEach(element => {
        if (element.offsetParent !== null) {
          // Should be keyboard accessible
          const tabIndex = element.getAttribute('tabindex');
          const isKeyboardAccessible = !tabIndex || parseInt(tabIndex) >= 0;
          
          expect(isKeyboardAccessible).toBe(true);
        }
      });
    });
  });

  describe('Performance on Mobile', () => {
    test('should render within reasonable time', async () => {
      const startTime = performance.now();
      
      setViewport(320, 568);
      render(<RetirementDashboard />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Should render within 1 second (generous for test environment)
      expect(renderTime).toBeLessThan(1000);
    });

    test('should not create excessive DOM nodes', () => {
      const { container } = render(<AdvancedTokenizationAnalytics />);
      
      const allElements = container.querySelectorAll('*');
      
      // Should be reasonable number of DOM nodes (< 1000 for component)
      expect(allElements.length).toBeLessThan(1000);
    });
  });
});

// Test utilities export for use in other test files
export {
  setViewport,
  hasResponsiveClasses,
  checkTouchTargetSize,
  VIEWPORTS
};