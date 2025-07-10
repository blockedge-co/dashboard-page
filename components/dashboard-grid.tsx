'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface GridPanelProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  rows?: 1 | 2 | 3 | 4;
  colStart?: number;
  rowStart?: number;
  className?: string;
}

export function GridPanel({
  children,
  cols = 1,
  rows = 1,
  colStart,
  rowStart,
  className,
}: GridPanelProps) {
  const colSpanClasses = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    6: 'col-span-6',
    12: 'col-span-12',
  };

  const rowSpanClasses = {
    1: 'row-span-1',
    2: 'row-span-2',
    3: 'row-span-3',
    4: 'row-span-4',
  };

  return (
    <div
      className={cn(
        colSpanClasses[cols],
        rowSpanClasses[rows],
        {
          [`col-start-${colStart}`]: colStart,
          [`row-start-${rowStart}`]: rowStart,
        },
        className
      )}
    >
      {children}
    </div>
  );
}

export interface DashboardGridProps {
  children: React.ReactNode;
  columns?: 12 | 24;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function DashboardGrid({
  children,
  columns = 12,
  gap = 'md',
  className,
}: DashboardGridProps) {
  const gridCols = {
    12: 'grid-cols-12',
    24: 'grid-cols-24',
  };

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div
      className={cn(
        'grid auto-rows-min',
        gridCols[columns],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
}

export interface DashboardRowProps {
  children: React.ReactNode;
  title?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

export function DashboardRow({
  children,
  title,
  collapsible = false,
  defaultExpanded = true,
  className,
}: DashboardRowProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  return (
    <div className={cn('col-span-full', className)}>
      {title && (
        <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {collapsible && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded ? '−' : '+'}
            </button>
          )}
        </div>
      )}
      {expanded && (
        <div className="grid grid-cols-12 gap-4">
          {children}
        </div>
      )}
    </div>
  );
}

export interface ResponsivePanelProps {
  children: React.ReactNode;
  sm?: 1 | 2 | 3 | 4 | 6 | 12;
  md?: 1 | 2 | 3 | 4 | 6 | 12;
  lg?: 1 | 2 | 3 | 4 | 6 | 12;
  xl?: 1 | 2 | 3 | 4 | 6 | 12;
  className?: string;
}

export function ResponsivePanel({
  children,
  sm = 12,
  md = 6,
  lg = 4,
  xl = 3,
  className,
}: ResponsivePanelProps) {
  const responsiveClasses = {
    1: { sm: 'sm:col-span-1', md: 'md:col-span-1', lg: 'lg:col-span-1', xl: 'xl:col-span-1' },
    2: { sm: 'sm:col-span-2', md: 'md:col-span-2', lg: 'lg:col-span-2', xl: 'xl:col-span-2' },
    3: { sm: 'sm:col-span-3', md: 'md:col-span-3', lg: 'lg:col-span-3', xl: 'xl:col-span-3' },
    4: { sm: 'sm:col-span-4', md: 'md:col-span-4', lg: 'lg:col-span-4', xl: 'xl:col-span-4' },
    6: { sm: 'sm:col-span-6', md: 'md:col-span-6', lg: 'lg:col-span-6', xl: 'xl:col-span-6' },
    12: { sm: 'sm:col-span-12', md: 'md:col-span-12', lg: 'lg:col-span-12', xl: 'xl:col-span-12' },
  };

  return (
    <div
      className={cn(
        'col-span-12',
        responsiveClasses[sm]?.sm,
        responsiveClasses[md]?.md,
        responsiveClasses[lg]?.lg,
        responsiveClasses[xl]?.xl,
        className
      )}
    >
      {children}
    </div>
  );
}

export interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumb?: Array<{ label: string; href?: string }>;
  className?: string;
}

export function DashboardHeader({
  title,
  subtitle,
  actions,
  breadcrumb,
  className,
}: DashboardHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      {breadcrumb && (
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              {item.href ? (
                <a
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-foreground">{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export interface MetricsSummaryProps {
  metrics: Array<{
    label: string;
    value: string | number;
    unit?: string;
    change?: {
      value: number;
      period: string;
    };
    trend?: 'up' | 'down' | 'neutral';
  }>;
  className?: string;
}

export function MetricsSummary({ metrics, className }: MetricsSummaryProps) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-muted-foreground',
  };

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4 mb-6', className)}>
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-card border border-border rounded p-4"
        >
          <div className="text-sm text-muted-foreground mb-1">
            {metric.label}
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-mono font-semibold text-foreground">
              {metric.value}
            </span>
            {metric.unit && (
              <span className="text-sm text-muted-foreground font-mono">
                {metric.unit}
              </span>
            )}
          </div>
          {metric.change && (
            <div className="flex items-center space-x-1 mt-1">
              <span
                className={cn(
                  'text-xs font-mono',
                  metric.trend ? trendColors[metric.trend] : 'text-muted-foreground'
                )}
              >
                {metric.change.value > 0 ? '+' : ''}{metric.change.value}%
              </span>
              <span className="text-xs text-muted-foreground">
                {metric.change.period}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}