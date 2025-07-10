"use client";

import { lazy, Suspense, ReactNode } from "react";
import { LoadingSkeleton } from "./loading-skeleton";
import { ErrorBoundaryWrapper } from "./error-boundary";

// Lazy load heavy components
export const LazyCarbonDashboard = lazy(() => 
  import("./carbon-dashboard").then(module => ({ default: module.CarbonDashboard }))
);

export const LazyRetirementAnalytics = lazy(() => 
  import("./retirement-panels/retirement-analytics").then(module => ({ default: module.RetirementAnalytics }))
);

export const LazyTokenizationMetrics = lazy(() => 
  import("./tokenization-metrics-enhanced").then(module => ({ default: module.TokenizationMetrics }))
);

export const LazyProjectCard = lazy(() => 
  import("./project-card")
);

export const LazyAnalyticsPage = lazy(() => 
  import("./analytics-page").then(module => ({ default: module as any }))
);

// Loading fallbacks with proper sizing
const DashboardSkeleton = () => (
  <div className="container mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
    {/* Hero metrics skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {[1, 2, 3, 4].map((i) => (
        <LoadingSkeleton key={i} className="h-32 sm:h-36 rounded-2xl" />
      ))}
    </div>
    
    {/* Chart skeleton */}
    <LoadingSkeleton className="h-64 sm:h-80 rounded-xl" />
    
    {/* Tabs skeleton */}
    <div className="space-y-4">
      <LoadingSkeleton className="h-12 rounded-xl" />
      <LoadingSkeleton className="h-96 rounded-xl" />
    </div>
  </div>
);

const ProjectCardSkeleton = () => (
  <LoadingSkeleton className="h-64 sm:h-72 rounded-xl" />
);

const AnalyticsSkeleton = () => (
  <div className="space-y-4 sm:space-y-6">
    <LoadingSkeleton className="h-32 rounded-xl" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <LoadingSkeleton className="h-64 rounded-xl" />
      <LoadingSkeleton className="h-64 rounded-xl" />
    </div>
  </div>
);

// Wrapper components with error boundaries and loading states
export function LazyComponentWrapper({
  children,
  fallback,
  name,
  className = ""
}: {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <ErrorBoundaryWrapper name={name}>
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      </ErrorBoundaryWrapper>
    </div>
  );
}

// Pre-configured lazy components with appropriate fallbacks
export function LazyDashboard() {
  return (
    <LazyComponentWrapper 
      name="Dashboard" 
      fallback={<DashboardSkeleton />}
    >
      <LazyCarbonDashboard />
    </LazyComponentWrapper>
  );
}

export function LazyRetirement() {
  return (
    <LazyComponentWrapper 
      name="Retirement Analytics" 
      fallback={<AnalyticsSkeleton />}
    >
      <LazyRetirementAnalytics />
    </LazyComponentWrapper>
  );
}

export function LazyTokenization() {
  return (
    <LazyComponentWrapper 
      name="Tokenization Metrics" 
      fallback={<AnalyticsSkeleton />}
    >
      <LazyTokenizationMetrics />
    </LazyComponentWrapper>
  );
}

export function LazyProjectCardWrapper({ project, index, onViewDetails }: any) {
  return (
    <LazyComponentWrapper 
      name="Project Card" 
      fallback={<ProjectCardSkeleton />}
    >
      <LazyProjectCard 
        project={project} 
        index={index} 
        onViewDetails={onViewDetails} 
      />
    </LazyComponentWrapper>
  );
}

export function LazyAnalytics() {
  return (
    <LazyComponentWrapper 
      name="Analytics" 
      fallback={<AnalyticsSkeleton />}
    >
      <LazyAnalyticsPage />
    </LazyComponentWrapper>
  );
}