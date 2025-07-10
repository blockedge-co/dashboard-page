"use client";

import React from "react";
import { ChartConfig } from "@/components/ui/chart";

// Common chart configurations for consistent styling across the dashboard
export const chartConfigs = {
  // Standard emerald/teal themed configuration
  carbonMetrics: {
    price: {
      label: "Price ($)",
      color: "hsl(var(--chart-1))", // emerald-500
    },
    volume: {
      label: "Volume",
      color: "hsl(var(--chart-2))", // teal-500
    },
    emissions: {
      label: "CO2 Emissions",
      color: "hsl(var(--chart-3))", // sky-500
    },
    reduction: {
      label: "CO2 Reduction",
      color: "hsl(var(--chart-1))", // emerald-500
    },
  } as ChartConfig,

  // Performance metrics configuration
  performance: {
    current: {
      label: "Current",
      color: "hsl(var(--chart-1))", // emerald-500
    },
    previous: {
      label: "Previous Period",
      color: "hsl(var(--chart-2))", // teal-500
    },
    target: {
      label: "Target",
      color: "hsl(var(--chart-3))", // sky-500
    },
    benchmark: {
      label: "Benchmark",
      color: "hsl(var(--chart-4))", // blue-500
    },
  } as ChartConfig,

  // Multi-series data configuration
  multiSeries: {
    series1: {
      label: "Series 1",
      color: "hsl(var(--chart-1))", // emerald-500
    },
    series2: {
      label: "Series 2", 
      color: "hsl(var(--chart-2))", // teal-500
    },
    series3: {
      label: "Series 3",
      color: "hsl(var(--chart-3))", // sky-500
    },
    series4: {
      label: "Series 4",
      color: "hsl(var(--chart-4))", // blue-500
    },
    series5: {
      label: "Series 5",
      color: "hsl(var(--chart-5))", // green-600
    },
  } as ChartConfig,
} as const;

// Standard gradient definitions for consistent chart styling
export const chartGradients = {
  emerald: {
    id: "emeraldGradient",
    stops: [
      { offset: "5%", color: "#10b981", opacity: 0.8 },
      { offset: "95%", color: "#10b981", opacity: 0.1 },
    ],
  },
  teal: {
    id: "tealGradient", 
    stops: [
      { offset: "5%", color: "#0d9488", opacity: 0.8 },
      { offset: "95%", color: "#0d9488", opacity: 0.1 },
    ],
  },
  sky: {
    id: "skyGradient",
    stops: [
      { offset: "5%", color: "#0ea5e9", opacity: 0.8 },
      { offset: "95%", color: "#0ea5e9", opacity: 0.1 },
    ],
  },
  blue: {
    id: "blueGradient",
    stops: [
      { offset: "5%", color: "#3b82f6", opacity: 0.8 },
      { offset: "95%", color: "#3b82f6", opacity: 0.1 },
    ],
  },
};

// Common chart styling props for consistent appearance
export const chartStyleProps = {
  // Grid styling that matches the dashboard theme
  grid: {
    strokeDasharray: "3 3",
    stroke: "#334155", // slate-700
    strokeOpacity: 0.4,
  },
  
  // Axis styling for dark theme
  axis: {
    stroke: "#64748b", // slate-500
    fontSize: 12,
    fill: "#94a3b8", // slate-400
  },
  
  // Responsive dimensions
  responsive: {
    mobile: { width: "100%", height: 200 },
    tablet: { width: "100%", height: 300 },
    desktop: { width: "100%", height: 400 },
  },
};

// Helper function to create responsive chart container props
export const getResponsiveChartProps = (size: "sm" | "md" | "lg" = "md") => {
  const sizeMap = {
    sm: "h-48", // 192px
    md: "h-64", // 256px  
    lg: "h-80", // 320px
  };

  return {
    className: `w-full ${sizeMap[size]}`,
  };
};

// Helper function to generate gradient definitions JSX
export const renderChartGradients = (gradients: (keyof typeof chartGradients)[]) => {
  return (
    <defs>
      {gradients.map((gradientKey) => {
        const gradient = chartGradients[gradientKey];
        return (
          <linearGradient
            key={gradient.id}
            id={gradient.id}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            {gradient.stops.map((stop, index) => (
              <stop
                key={index}
                offset={stop.offset}
                stopColor={stop.color}
                stopOpacity={stop.opacity}
              />
            ))}
          </linearGradient>
        );
      })}
    </defs>
  );
};

// Helper function to get chart container class with responsive behavior
export const getChartContainerClass = (
  aspectRatio: "video" | "square" | "portrait" | "compact" = "video"
) => {
  const aspectMap = {
    video: "aspect-video sm:aspect-video", // 16:9
    square: "aspect-square", // 1:1
    portrait: "aspect-[3/4]", // 3:4
    compact: "aspect-[2/1]", // 2:1 for compact view
  };

  return `w-full ${aspectMap[aspectRatio]} min-h-[200px] sm:min-h-[300px] lg:min-h-[400px]`;
};

// Responsive chart margins for different screen sizes
export const getResponsiveMargins = () => ({
  mobile: { top: 10, right: 10, left: 10, bottom: 20 },
  tablet: { top: 15, right: 15, left: 15, bottom: 30 },
  desktop: { top: 20, right: 20, left: 20, bottom: 40 },
});

// Legend configuration for responsive behavior
export const responsiveLegendConfig = {
  mobile: {
    layout: "horizontal" as const,
    align: "center" as const,
    verticalAlign: "bottom" as const,
    wrapperStyle: { 
      paddingTop: "10px",
      fontSize: "12px",
      lineHeight: "16px"
    }
  },
  desktop: {
    layout: "horizontal" as const,
    align: "center" as const,
    verticalAlign: "bottom" as const,
    wrapperStyle: { 
      paddingTop: "15px",
      fontSize: "14px",
      lineHeight: "20px"
    }
  }
};

// Standard color palette for charts
export const chartColors = {
  emerald: "#10b981",
  teal: "#0d9488", 
  sky: "#0ea5e9",
  blue: "#3b82f6",
  green: "#059669",
  cyan: "#06b6d4",
  indigo: "#6366f1",
  violet: "#8b5cf6",
} as const;

// Helper to get chart color by name
export const getChartColor = (colorName: keyof typeof chartColors) => {
  return chartColors[colorName];
};