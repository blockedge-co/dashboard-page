"use client";

import React from "react";
import { ChartTooltipContent } from "@/components/ui/chart";

// Enhanced tooltip content configurations
export const tooltipStyles = {
  // Standard dark theme tooltip
  dark: {
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    border: "1px solid rgba(71, 85, 105, 0.5)",
    borderRadius: "8px",
    backdropFilter: "blur(4px)",
    color: "#f8fafc",
    fontSize: "12px",
    padding: "8px 12px",
  },
  
  // Compact tooltip for small charts
  compact: {
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    border: "1px solid rgba(71, 85, 105, 0.5)",
    borderRadius: "6px",
    backdropFilter: "blur(4px)",
    color: "#f8fafc",
    fontSize: "11px",
    padding: "6px 8px",
  },
} as const;

// Formatters for different data types
export const dataFormatters = {
  currency: (value: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value),
    
  percentage: (value: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    }).format(value / 100),
    
  number: (value: number) => 
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value),
    
  compactNumber: (value: number) => 
    new Intl.NumberFormat('en-US', { 
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1
    }).format(value),
    
  co2Emissions: (value: number) => 
    `${new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }).format(value)} tCO₂e`,
    
  tokens: (value: number) => 
    `${new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1
    }).format(value)} Tokens`,
} as const;

// Enhanced chart configurations with accessibility
export const accessibleChartProps = {
  // Screen reader friendly descriptions
  ariaDescriptions: {
    carbonPricing: "Carbon credit pricing trends over time showing market performance",
    emissions: "CO2 emissions reduction metrics by project and time period",
    portfolio: "Portfolio performance analysis with comparative benchmarks",
    compliance: "Regulatory compliance scores across different jurisdictions",
  },
  
  // Keyboard navigation support
  keyboardProps: {
    tabIndex: 0,
    role: "img",
    onKeyDown: (event: KeyboardEvent) => {
      // Add keyboard interaction logic here if needed
      if (event.key === "Enter" || event.key === " ") {
        // Handle chart interaction
      }
    }
  },
} as const;

// Custom tooltip content creator
export const createCustomTooltip = (
  formatter: keyof typeof dataFormatters = "number",
  style: keyof typeof tooltipStyles = "dark"
) => {
  return ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div 
          style={tooltipStyles[style]}
          role="tooltip" 
          aria-live="polite"
        >
          {label && (
            <div style={{ 
              fontWeight: "600", 
              marginBottom: "4px",
              color: "#e2e8f0"
            }}>
              {label}
            </div>
          )}
          {payload.map((entry: any, index: number) => (
            <div 
              key={index}
              style={{ 
                display: "flex", 
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
                marginBottom: index < payload.length - 1 ? "2px" : "0"
              }}
            >
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "6px" 
              }}>
                <div 
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: entry.color
                  }}
                />
                <span style={{ color: "#cbd5e1" }}>
                  {entry.name}:
                </span>
              </div>
              <span style={{ 
                fontWeight: "600",
                color: "#f8fafc"
              }}>
                {dataFormatters[formatter](entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
};

// Chart animation configurations
export const chartAnimations = {
  // Standard smooth animations
  smooth: {
    animationBegin: 0,
    animationDuration: 800,
    animationEasing: "ease-out"
  },
  
  // Reduced motion for accessibility
  reduced: {
    animationBegin: 0,
    animationDuration: 200,
    animationEasing: "linear"
  },
  
  // No animations for performance
  none: {
    animationBegin: 0,
    animationDuration: 0,
    animationEasing: "linear"
  }
} as const;

// Responsive chart dimensions helper
export const getChartDimensions = () => {
  if (typeof window === "undefined") {
    return { width: 800, height: 400 }; // Default for SSR
  }
  
  const width = window.innerWidth;
  
  if (width < 640) { // Mobile
    return { width: width - 32, height: 200 };
  } else if (width < 1024) { // Tablet
    return { width: width - 64, height: 300 };
  } else { // Desktop
    return { width: width - 128, height: 400 };
  }
};

// Performance optimization for large datasets
export const optimizeChartData = (data: any[], maxPoints: number = 100) => {
  if (data.length <= maxPoints) return data;
  
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, index) => index % step === 0);
};

// Color accessibility checker
export const getAccessibleColors = (baseColors: string[]) => {
  // Returns colors with sufficient contrast for accessibility
  return baseColors.map(color => {
    // Add logic to ensure WCAG compliance
    return color;
  });
};

// Export enhanced chart configuration
export const enhancedChartConfig = {
  tooltipStyles,
  dataFormatters,
  accessibleChartProps,
  createCustomTooltip,
  chartAnimations,
  getChartDimensions,
  optimizeChartData,
  getAccessibleColors,
} as const;