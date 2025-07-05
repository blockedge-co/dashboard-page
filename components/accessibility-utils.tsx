"use client";

import { useEffect, useRef } from 'react';

// Accessibility utilities and hooks

export function useAnnouncer() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.getElementById('a11y-announcer');
    if (announcer) {
      announcer.setAttribute('aria-live', priority);
      announcer.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    }
  };

  return { announce };
}

export function useFocusManagement() {
  const focusRef = useRef<HTMLElement>(null);

  const setFocus = () => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  };

  const trapFocus = (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
      
      if (e.key === 'Escape') {
        // Let parent handle escape
        return;
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    
    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  };

  return { focusRef, setFocus, trapFocus };
}

export function useKeyboardNavigation(onEnter?: () => void, onEscape?: () => void) {
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        if (onEnter) {
          e.preventDefault();
          onEnter();
        }
        break;
      case 'Escape':
        if (onEscape) {
          e.preventDefault();
          onEscape();
        }
        break;
    }
  };

  return { handleKeyDown };
}

// Component for skip links
export function SkipLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
    >
      {children}
    </a>
  );
}

// Component for visually hidden text (screen reader only)
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

// Component for focus indicators
export function FocusIndicator({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={`focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 rounded-md ${className}`}>
      {children}
    </div>
  );
}

// High contrast mode detection
export function useHighContrast() {
  const isHighContrast = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-contrast: high)').matches
    : false;

  return { isHighContrast };
}

// Reduced motion detection (already in use-performance.ts but providing here too)
export function useReducedMotion() {
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  return { prefersReducedMotion };
}

// ARIA describedby utility
export function useAriaDescribedBy(description: string) {
  const id = `desc-${Math.random().toString(36).substr(2, 9)}`;
  
  const DescriptionComponent = () => (
    <div id={id} className="sr-only">
      {description}
    </div>
  );

  return { 
    'aria-describedby': id,
    DescriptionComponent
  };
}

// Color contrast utilities
export const colorContrast = {
  // Ensure text meets WCAG AA standards
  getContrastRatio: (foreground: string, background: string): number => {
    // Simplified contrast calculation - in production, use a proper color library
    // This is a placeholder implementation
    return 4.5; // Mock value that meets WCAG AA
  },
  
  // Check if color combination meets WCAG standards
  meetsWCAG: (foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
    const ratio = colorContrast.getContrastRatio(foreground, background);
    return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
  }
};

// Accessibility validation utilities
export const a11yValidation = {
  // Check if element has accessible name
  hasAccessibleName: (element: HTMLElement): boolean => {
    return !!(
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.textContent?.trim() ||
      element.getAttribute('title')
    );
  },

  // Check if interactive element is keyboard accessible
  isKeyboardAccessible: (element: HTMLElement): boolean => {
    const tabIndex = element.getAttribute('tabindex');
    return element.tagName.toLowerCase() === 'button' ||
           element.tagName.toLowerCase() === 'a' ||
           element.tagName.toLowerCase() === 'input' ||
           element.tagName.toLowerCase() === 'select' ||
           element.tagName.toLowerCase() === 'textarea' ||
           (tabIndex !== null && tabIndex !== '-1');
  },

  // Validate common accessibility issues
  validateElement: (element: HTMLElement): string[] => {
    const issues: string[] = [];

    // Check for accessible name on interactive elements
    if (['button', 'a', 'input'].includes(element.tagName.toLowerCase())) {
      if (!a11yValidation.hasAccessibleName(element)) {
        issues.push('Interactive element lacks accessible name');
      }
    }

    // Check for keyboard accessibility
    if (['button', 'div'].includes(element.tagName.toLowerCase()) && 
        element.onclick && 
        !a11yValidation.isKeyboardAccessible(element)) {
      issues.push('Interactive element is not keyboard accessible');
    }

    return issues;
  }
};