"use client";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { usePerformance } from "@/hooks/use-performance";
import { AnimatedCounter } from "./animated-counter";

interface TrendData {
  value: number;
  change: string;
  trend: "up" | "down" | "neutral";
  period?: string;
}

interface ProgressData {
  value: number;
  max: number;
  color?: string;
  showPercentage?: boolean;
}

interface EnhancedMetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  color?: string;
  variant?: "default" | "compact" | "detailed" | "progress";
  size?: "sm" | "md" | "lg";
  trend?: TrendData;
  progress?: ProgressData;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  };
  pulse?: boolean;
  animate?: boolean;
  delay?: number;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
  sparklineData?: number[];
  loading?: boolean;
  formatAs?: "number" | "currency" | "percentage" | "compact";
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

const EnhancedMetricCard = memo(({
  title,
  value,
  description,
  icon: Icon,
  color = "from-emerald-500 to-teal-600",
  variant = "default",
  size = "md",
  trend,
  progress,
  badge,
  pulse = false,
  animate = true,
  delay = 0,
  className,
  onClick,
  interactive = false,
  sparklineData,
  loading = false,
  formatAs = "number",
  decimals = 0,
  prefix = "",
  suffix = "",
}: EnhancedMetricCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { shouldReduceAnimations } = usePerformance();
  const isInView = useInView(cardRef, { once: true });

  // Size configurations
  const sizeConfig = {
    sm: {
      card: "p-4",
      title: "text-xs",
      value: "text-lg",
      description: "text-xs",
      icon: "w-4 h-4",
      iconContainer: "w-8 h-8",
      progress: "h-1.5",
    },
    md: {
      card: "p-6",
      title: "text-sm",
      value: "text-2xl",
      description: "text-sm",
      icon: "w-5 h-5",
      iconContainer: "w-10 h-10",
      progress: "h-2",
    },
    lg: {
      card: "p-8",
      title: "text-base",
      value: "text-3xl",
      description: "text-base",
      icon: "w-6 h-6",
      iconContainer: "w-12 h-12",
      progress: "h-2.5",
    },
  };

  const currentSize = sizeConfig[size];

  // Trend indicator component
  const TrendIndicator = ({ trend: trendData }: { trend: TrendData }) => {
    const TrendIcon = trendData.trend === "up" ? TrendingUp : 
                     trendData.trend === "down" ? TrendingDown : Minus;
    
    const trendColor = trendData.trend === "up" ? "text-emerald-400" : 
                       trendData.trend === "down" ? "text-red-400" : "text-slate-400";

    return (
      <div className="flex items-center gap-1">
        <TrendIcon className={cn("w-3 h-3", trendColor)} />
        <span className={cn("text-xs font-medium", trendColor)}>
          {trendData.change}
        </span>
        {trendData.period && (
          <span className="text-xs text-slate-500">
            {trendData.period}
          </span>
        )}
      </div>
    );
  };

  // Mini sparkline component
  const MiniSparkline = ({ data }: { data: number[] }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    return (
      <div className="flex items-end gap-px h-8 w-16">
        {data.map((value, index) => {
          const height = range === 0 ? 50 : ((value - min) / range) * 100;
          return (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="flex-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-sm min-h-[2px]"
            />
          );
        })}
      </div>
    );
  };

  // 3D hover effect
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (shouldReduceAnimations || !cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  }, [shouldReduceAnimations]);

  const handleMouseLeave = useCallback(() => {
    if (shouldReduceAnimations || !cardRef.current) return;
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    setIsHovered(false);
  }, [shouldReduceAnimations]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <Card className="relative overflow-hidden bg-slate-800/50 backdrop-blur-md border-white/5">
        <CardContent className={currentSize.card}>
          <div className="animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-slate-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Progress variant
  if (variant === "progress" && progress) {
    return (
      <motion.div
        ref={cardRef}
        initial={animate ? { opacity: 0, y: 20 } : false}
        animate={animate ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.5, delay }}
        onMouseMove={interactive ? handleMouseMove : undefined}
        onMouseLeave={interactive ? handleMouseLeave : undefined}
        onMouseEnter={interactive ? handleMouseEnter : undefined}
        onClick={onClick}
        className={cn(
          "relative group cursor-pointer transition-all duration-300",
          interactive && "hover:shadow-2xl",
          className
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-70" />
        <Card className="relative overflow-hidden bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:bg-slate-800/70">
          <CardContent className={currentSize.card}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={cn("rounded-full bg-gradient-to-r flex items-center justify-center shadow-lg", color, currentSize.iconContainer)}>
                  <Icon className={cn("text-white", currentSize.icon)} />
                </div>
                <div>
                  <p className={cn("font-medium text-slate-400", currentSize.title)}>
                    {title}
                  </p>
                  {description && (
                    <p className={cn("text-slate-500", currentSize.description)}>
                      {description}
                    </p>
                  )}
                </div>
              </div>
              {badge && (
                <Badge variant={badge.variant} className={badge.className}>
                  {badge.text}
                </Badge>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-end justify-between">
                <AnimatedCounter
                  value={value}
                  className={cn("font-bold text-white", currentSize.value)}
                  formatAs={formatAs}
                  decimals={decimals}
                  prefix={prefix}
                  suffix={suffix}
                  delay={delay * 1000}
                />
                <div className="text-right">
                  <div className={cn("text-slate-400", currentSize.description)}>
                    {progress.showPercentage ? `${Math.round((progress.value / progress.max) * 100)}%` : `${progress.value}/${progress.max}`}
                  </div>
                </div>
              </div>
              
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(progress.value / progress.max) * 100}%` }}
                transition={{ duration: 1.5, delay: delay + 0.5 }}
                className="w-full bg-slate-700/50 rounded-full overflow-hidden"
              >
                <div className={cn("h-full rounded-full bg-gradient-to-r", progress.color || color, currentSize.progress)} />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Detailed variant
  if (variant === "detailed") {
    return (
      <motion.div
        ref={cardRef}
        initial={animate ? { opacity: 0, y: 20 } : false}
        animate={animate ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.5, delay }}
        onMouseMove={interactive ? handleMouseMove : undefined}
        onMouseLeave={interactive ? handleMouseLeave : undefined}
        onMouseEnter={interactive ? handleMouseEnter : undefined}
        onClick={onClick}
        className={cn(
          "relative group cursor-pointer transition-all duration-300",
          interactive && "hover:shadow-2xl",
          className
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-70" />
        <Card className="relative overflow-hidden bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:bg-slate-800/70">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className={cn("text-white", currentSize.title)}>
                  {title}
                </CardTitle>
                {description && (
                  <CardDescription className={cn("text-slate-400 mt-1", currentSize.description)}>
                    {description}
                  </CardDescription>
                )}
              </div>
              {badge && (
                <Badge variant={badge.variant} className={badge.className}>
                  {badge.text}
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="flex items-end justify-between mb-4">
              <AnimatedCounter
                value={value}
                className={cn("font-bold text-white", currentSize.value)}
                formatAs={formatAs}
                decimals={decimals}
                prefix={prefix}
                suffix={suffix}
                delay={delay * 1000}
              />
              <div className="relative">
                <div className={cn("rounded-full bg-gradient-to-r flex items-center justify-center shadow-lg", color, currentSize.iconContainer)}>
                  <Icon className={cn("text-white", currentSize.icon)} />
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
            
            <div className="flex items-center justify-between">
              {trend && <TrendIndicator trend={trend} />}
              {sparklineData && <MiniSparkline data={sparklineData} />}
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
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <motion.div
        ref={cardRef}
        initial={animate ? { opacity: 0, y: 20 } : false}
        animate={animate ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.5, delay }}
        onMouseMove={interactive ? handleMouseMove : undefined}
        onMouseLeave={interactive ? handleMouseLeave : undefined}
        onMouseEnter={interactive ? handleMouseEnter : undefined}
        onClick={onClick}
        className={cn(
          "relative group cursor-pointer transition-all duration-300",
          interactive && "hover:shadow-2xl",
          className
        )}
      >
        <Card className="relative overflow-hidden bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:bg-slate-800/70">
          <CardContent className={currentSize.card}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className={cn("font-medium text-slate-400", currentSize.title)}>
                    {title}
                  </p>
                  {badge && (
                    <Badge variant={badge.variant} className={cn("text-xs", badge.className)}>
                      {badge.text}
                    </Badge>
                  )}
                </div>
                <AnimatedCounter
                  value={value}
                  className={cn("font-bold text-white", currentSize.value)}
                  formatAs={formatAs}
                  decimals={decimals}
                  prefix={prefix}
                  suffix={suffix}
                  delay={delay * 1000}
                />
                {trend && <TrendIndicator trend={trend} />}
              </div>
              <div className="relative">
                <div className={cn("rounded-full bg-gradient-to-r flex items-center justify-center shadow-lg", color, currentSize.iconContainer)}>
                  <Icon className={cn("text-white", currentSize.icon)} />
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

  // Default variant
  return (
    <motion.div
      ref={cardRef}
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.5, delay }}
      onMouseMove={interactive ? handleMouseMove : undefined}
      onMouseLeave={interactive ? handleMouseLeave : undefined}
      onMouseEnter={interactive ? handleMouseEnter : undefined}
      onClick={onClick}
      className={cn(
        "relative group cursor-pointer transition-all duration-300",
        interactive && "hover:shadow-2xl",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-70" />
      <Card className="relative overflow-hidden bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:bg-slate-800/70">
        <CardContent className={currentSize.card}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className={cn("font-medium text-slate-400", currentSize.title)}>
                  {title}
                </p>
                {badge && (
                  <Badge variant={badge.variant} className={cn("text-xs", badge.className)}>
                    {badge.text}
                  </Badge>
                )}
              </div>
              <div className="h-8 flex items-end mb-2">
                <AnimatedCounter
                  value={value}
                  className={cn("font-bold text-white", currentSize.value)}
                  formatAs={formatAs}
                  decimals={decimals}
                  prefix={prefix}
                  suffix={suffix}
                  delay={delay * 1000}
                />
              </div>
              {trend && <TrendIndicator trend={trend} />}
            </div>
            <div className="relative">
              <div className={cn("rounded-full bg-gradient-to-r flex items-center justify-center shadow-lg", color, currentSize.iconContainer)}>
                <Icon className={cn("text-white", currentSize.icon)} />
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

EnhancedMetricCard.displayName = "EnhancedMetricCard";

export { EnhancedMetricCard };
export type { EnhancedMetricCardProps, TrendData, ProgressData };