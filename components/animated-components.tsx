"use client";

// Export all animated components for easy importing
export { AnimatedCounter } from "./animated-counter";
export type { AnimatedCounterProps } from "./animated-counter";

export { EnhancedMetricCard } from "./enhanced-metric-card";
export type { 
  EnhancedMetricCardProps, 
  TrendData, 
  ProgressData 
} from "./enhanced-metric-card";

export { 
  InteractiveChartTooltip, 
  EnhancedChartTooltip, 
  ChartHoverEffect 
} from "./interactive-chart-tooltip";
export type { 
  InteractiveChartTooltipProps, 
  TooltipData 
} from "./interactive-chart-tooltip";

export { 
  AnimatedProgressBar, 
  MultiProgressBar 
} from "./animated-progress-bar";
export type { 
  AnimatedProgressBarProps, 
  ProgressSegment 
} from "./animated-progress-bar";

export { RealTimeIndicator } from "./real-time-indicator";
export type { RealTimeIndicatorProps } from "./real-time-indicator";

// Re-export existing components for convenience
export { MetricCard, MetricGrid } from "./metric-cards";
export type { 
  MetricCardProps, 
  MetricGridProps 
} from "./metric-cards";