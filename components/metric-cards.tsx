"use client";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePerformance, useAnimationProps } from "@/hooks/use-performance";

// Types
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  color?: string;
  pulse?: boolean;
  description?: string;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  };
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact" | "detailed";
  animate?: boolean;
  delay?: number;
  className?: string;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
}

interface AnimatedCounterProps {
  value: string | number;
  duration?: number;
  className?: string;
}

interface MetricGridProps {
  metrics: MetricCardProps[];
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  className?: string;
  cardClassName?: string;
  gap?: "sm" | "md" | "lg";
}

// Animated Counter Component with Performance Optimization
const AnimatedCounter = memo(({ value, duration = 2000, className }: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const { shouldReduceAnimations } = usePerformance();

  useEffect(() => {
    if (shouldReduceAnimations) {
      setDisplayValue(typeof value === "number" ? value : parseInt(value.toString()) || 0);
      return;
    }

    const numericValue = typeof value === "number" ? value : parseFloat(value.toString()) || 0;
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (numericValue - startValue) * easeOutQuart;

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, shouldReduceAnimations]);

  const formatValue = (val: number): string => {
    if (typeof value === "string" && isNaN(Number(value))) {
      return value;
    }
    
    // Format numbers appropriately
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`;
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`;
    }
    return Math.round(val).toString();
  };

  return (
    <span className={className}>
      {formatValue(displayValue)}
    </span>
  );
});

AnimatedCounter.displayName = "AnimatedCounter";

// Individual Metric Card Component
const MetricCard = memo(({
  title,
  value,
  change,
  trend = "neutral",
  icon: Icon,
  color = "from-emerald-500 to-teal-600",
  pulse = false,
  description,
  badge,
  size = "md",
  variant = "default",
  animate = true,
  delay = 0,
  className,
  onMouseMove,
  onMouseLeave,
}: MetricCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { shouldReduceAnimations } = usePerformance();
  const animationProps = useAnimationProps(animate);

  // Size classes
  const sizeClasses = {
    sm: {
      card: "p-4",
      title: "text-xs",
      value: "text-lg",
      icon: "w-6 h-6",
      iconContainer: "w-8 h-8",
    },
    md: {
      card: "p-6",
      title: "text-sm",
      value: "text-2xl",
      icon: "w-5 h-5",
      iconContainer: "w-10 h-10",
    },
    lg: {
      card: "p-8",
      title: "text-base",
      value: "text-3xl",
      icon: "w-6 h-6",
      iconContainer: "w-12 h-12",
    },
  };

  // Trend colors and icons
  const trendClasses = {
    up: "text-emerald-400",
    down: "text-red-400",
    neutral: "text-slate-400",
  };

  // 3D hover effect handler
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (shouldReduceAnimations || !cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    
    onMouseMove?.(e);
  }, [shouldReduceAnimations, onMouseMove]);

  const handleMouseLeave = useCallback(() => {
    if (shouldReduceAnimations || !cardRef.current) return;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    onMouseLeave?.();
  }, [shouldReduceAnimations, onMouseLeave]);

  const currentSizeClasses = sizeClasses[size];

  if (variant === "compact") {
    return (
      <motion.div
        ref={cardRef}
        {...animationProps}
        transition={{ duration: 0.5, delay }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn("relative group", className)}
      >
        <Card className="relative overflow-hidden bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:bg-slate-800/70">
          <CardContent className={currentSizeClasses.card}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className={cn("font-medium text-slate-400", currentSizeClasses.title)}>
                    {title}
                  </p>
                  {badge && (
                    <Badge
                      variant={badge.variant}
                      className={cn("text-xs", badge.className)}
                    >
                      {badge.text}
                    </Badge>
                  )}
                </div>
                <AnimatedCounter
                  value={value}
                  className={cn("font-bold text-white", currentSizeClasses.value)}
                />
                {change && (
                  <p className={cn("text-xs mt-1", trendClasses[trend])}>
                    {change}
                  </p>
                )}
              </div>
              <div className="relative">
                <div
                  className={cn(
                    "rounded-full bg-gradient-to-r flex items-center justify-center shadow-lg",
                    color,
                    currentSizeClasses.iconContainer
                  )}
                >
                  <Icon className={cn("text-white", currentSizeClasses.icon)} />
                </div>
                {pulse && !shouldReduceAnimations && (
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0.2, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full"
                  />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (variant === "detailed") {
    return (
      <motion.div
        ref={cardRef}
        {...animationProps}
        transition={{ duration: 0.5, delay }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn("relative group", className)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-70" />
        <Card className="relative overflow-hidden bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:bg-slate-800/70">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className={cn("text-white", currentSizeClasses.title)}>
                  {title}
                </CardTitle>
                {description && (
                  <CardDescription className="text-slate-400 mt-1">
                    {description}
                  </CardDescription>
                )}
              </div>
              {badge && (
                <Badge
                  variant={badge.variant}
                  className={badge.className}
                >
                  {badge.text}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-end justify-between mb-4">
              <AnimatedCounter
                value={value}
                className={cn("font-bold text-white", currentSizeClasses.value)}
              />
              <div className="relative">
                <div
                  className={cn(
                    "rounded-full bg-gradient-to-r flex items-center justify-center shadow-lg",
                    color,
                    currentSizeClasses.iconContainer
                  )}
                >
                  <Icon className={cn("text-white", currentSizeClasses.icon)} />
                </div>
                {pulse && !shouldReduceAnimations && (
                  <motion.div
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0.2, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"
                  />
                )}
              </div>
            </div>
            {change && (
              <div className="flex items-center gap-1">
                <span className={cn("text-sm font-medium", trendClasses[trend])}>
                  {change}
                </span>
              </div>
            )}
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: delay + 0.5 }}
              className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-4"
            />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      ref={cardRef}
      {...animationProps}
      transition={{ duration: 0.5, delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative group", className)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-70" />
      <Card className="relative overflow-hidden bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:bg-slate-800/70">
        <CardContent className={currentSizeClasses.card}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className={cn("font-medium text-slate-400", currentSizeClasses.title)}>
                  {title}
                </p>
                {badge && (
                  <Badge
                    variant={badge.variant}
                    className={cn("text-xs", badge.className)}
                  >
                    {badge.text}
                  </Badge>
                )}
              </div>
              <div className="h-8 flex items-end">
                <AnimatedCounter
                  value={value}
                  className={cn("font-bold text-white", currentSizeClasses.value)}
                />
              </div>
              {change && (
                <div className="flex items-center gap-1 mt-2">
                  <span className={cn("text-sm font-medium", trendClasses[trend])}>
                    {change}
                  </span>
                </div>
              )}
            </div>
            <div className="relative">
              <div
                className={cn(
                  "rounded-full bg-gradient-to-r flex items-center justify-center shadow-lg",
                  color,
                  currentSizeClasses.iconContainer
                )}
              >
                <Icon className={cn("text-white", currentSizeClasses.icon)} />
              </div>
              {pulse && !shouldReduceAnimations && (
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0.2, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"
                />
              )}
            </div>
          </div>
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, delay: delay + 0.5 }}
            className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-4"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
});

MetricCard.displayName = "MetricCard";

// Responsive Metric Grid Component
const MetricGrid = memo(({
  metrics,
  columns = { sm: 1, md: 2, lg: 4, xl: 4 },
  className,
  cardClassName,
  gap = "md",
}: MetricGridProps) => {
  const gapClasses = {
    sm: "gap-3",
    md: "gap-6",
    lg: "gap-8",
  };

  const getGridColumns = () => {
    const classes = [];
    if (columns.sm) classes.push(`grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
    return classes.join(" ");
  };

  return (
    <div className={cn("grid", getGridColumns(), gapClasses[gap], className)}>
      {metrics.map((metric, index) => (
        <MetricCard
          key={`${metric.title}-${index}`}
          {...metric}
          delay={index * 0.1}
          className={cardClassName}
        />
      ))}
    </div>
  );
});

MetricGrid.displayName = "MetricGrid";

export { MetricCard, MetricGrid, AnimatedCounter };
export type { MetricCardProps, MetricGridProps, AnimatedCounterProps };