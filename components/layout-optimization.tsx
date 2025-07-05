"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Layout optimization component for consistent grid and spacing patterns

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: "none" | "sm" | "md" | "lg" | "xl";
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  animate?: boolean;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

// Optimized container component following existing patterns
export function OptimizedContainer({ 
  children, 
  className, 
  maxWidth = "full", 
  padding = "md" 
}: ContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-4xl", 
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full"
  };

  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6", // Following existing pattern
    lg: "p-8"
  };

  return (
    <div className={cn(
      "container mx-auto",
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
}

// Optimized grid component following existing breakpoint patterns
export function OptimizedGrid({ 
  children, 
  className, 
  cols = { default: 1, md: 2, lg: 3 }, 
  gap = "md" 
}: GridProps) {
  const gapClasses = {
    none: "gap-0",
    sm: "gap-4",
    md: "gap-6", // Following existing pattern
    lg: "gap-8",
    xl: "gap-12"
  };

  // Build responsive grid classes following existing patterns
  const gridClasses = [
    `grid-cols-${cols.default || 1}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`
  ].filter(Boolean).join(" ");

  return (
    <div className={cn(
      "grid",
      gridClasses,
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
}

// Optimized section component with consistent spacing
export function OptimizedSection({ 
  children, 
  className, 
  spacing = "md", 
  animate = true 
}: SectionProps) {
  const spacingClasses = {
    none: "",
    sm: "space-y-4",
    md: "space-y-6", // Following existing pattern
    lg: "space-y-8",
    xl: "space-y-12"
  };

  const content = (
    <div className={cn(
      spacingClasses[spacing],
      className
    )}>
      {children}
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        spacingClasses[spacing],
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// Optimized page header following existing navigation patterns
export function OptimizedPageHeader({ 
  title, 
  description, 
  children, 
  className,
  breadcrumbs 
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "mb-6 space-y-4", // Following existing spacing pattern
        className
      )}
    >
      {/* Breadcrumbs following existing navigation patterns */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-2 text-sm text-slate-400">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              {crumb.href ? (
                <a 
                  href={crumb.href} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-slate-300">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Title following existing patterns */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {title}
          </h1>
          {description && (
            <p className="text-slate-400 text-lg">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-2">
            {children}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Mobile-optimized card component following existing patterns
interface OptimizedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export function OptimizedCard({ 
  children, 
  className, 
  hover = true, 
  gradient = false 
}: OptimizedCardProps) {
  return (
    <div className={cn(
      // Base card styles following existing patterns
      "relative overflow-hidden",
      "bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl",
      "rounded-2xl", // Following existing border radius
      // Mobile-optimized transitions
      "transition-all duration-300",
      hover && "hover:shadow-2xl hover:bg-slate-800/70",
      className
    )}>
      {/* Optional gradient background following existing pattern */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-70" />
      )}
      
      {/* Content container with consistent padding */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}

// Mobile-first responsive layout wrapper
interface ResponsiveLayoutProps {
  children: React.ReactNode;
  className?: string;
  sidebar?: React.ReactNode;
  sidebarWidth?: "sm" | "md" | "lg";
}

export function ResponsiveLayout({ 
  children, 
  className, 
  sidebar, 
  sidebarWidth = "md" 
}: ResponsiveLayoutProps) {
  const sidebarWidthClasses = {
    sm: "lg:w-64",
    md: "lg:w-80",
    lg: "lg:w-96"
  };

  if (!sidebar) {
    return (
      <OptimizedContainer className={className}>
        {children}
      </OptimizedContainer>
    );
  }

  return (
    <OptimizedContainer className={className}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - stacked on mobile, side-by-side on desktop */}
        <aside className={cn(
          "w-full",
          sidebarWidthClasses[sidebarWidth],
          "lg:flex-shrink-0"
        )}>
          {sidebar}
        </aside>
        
        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </OptimizedContainer>
  );
}

// Touch-optimized button wrapper for mobile
interface TouchOptimizedButtonProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function TouchOptimizedButton({ 
  children, 
  className, 
  size = "md", 
  onClick 
}: TouchOptimizedButtonProps) {
  const sizeClasses = {
    sm: "min-h-[40px] px-3 py-2", // Minimum 40px for mobile touch
    md: "min-h-[44px] px-4 py-3", // Recommended 44px for touch
    lg: "min-h-[48px] px-6 py-4"  // Larger for primary actions
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "touch-manipulation", // Optimize for touch
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
        "active:scale-95", // Touch feedback
        sizeClasses[size],
        className
      )}
    >
      {children}
    </button>
  );
}

// Responsive text component following existing typography patterns
interface ResponsiveTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "h1" | "h2" | "h3" | "body" | "caption";
  responsive?: boolean;
}

export function ResponsiveText({ 
  children, 
  className, 
  variant = "body", 
  responsive = true 
}: ResponsiveTextProps) {
  const variantClasses = {
    h1: responsive ? "text-2xl sm:text-3xl lg:text-4xl font-bold" : "text-3xl font-bold",
    h2: responsive ? "text-xl sm:text-2xl lg:text-3xl font-semibold" : "text-2xl font-semibold", 
    h3: responsive ? "text-lg sm:text-xl lg:text-2xl font-medium" : "text-xl font-medium",
    body: responsive ? "text-sm sm:text-base" : "text-base",
    caption: responsive ? "text-xs sm:text-sm" : "text-sm"
  };

  const Component = variant.startsWith('h') ? variant as keyof JSX.IntrinsicElements : 'p';

  return (
    <Component className={cn(
      variantClasses[variant],
      className
    )}>
      {children}
    </Component>
  );
}