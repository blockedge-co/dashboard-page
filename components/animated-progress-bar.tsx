"use client";

import { useState, useEffect, useRef, memo } from "react";
import { motion, useInView } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePerformance } from "@/hooks/use-performance";
import { LucideIcon } from "lucide-react";

interface ProgressSegment {
  value: number;
  color: string;
  label?: string;
  icon?: LucideIcon;
}

interface AnimatedProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "gradient" | "segmented" | "striped" | "glow";
  color?: string;
  backgroundColor?: string;
  showValue?: boolean;
  showPercentage?: boolean;
  label?: string;
  segments?: ProgressSegment[];
  animate?: boolean;
  duration?: number;
  delay?: number;
  easing?: "linear" | "easeOut" | "easeInOut" | "bounce";
  startOnView?: boolean;
  pulse?: boolean;
  striped?: boolean;
  glowIntensity?: "low" | "medium" | "high";
  onComplete?: () => void;
  formatValue?: (value: number, max: number) => string;
  icon?: LucideIcon;
  interactive?: boolean;
  tooltip?: string;
}

const AnimatedProgressBar = memo(({
  value,
  max = 100,
  className,
  size = "md",
  variant = "default",
  color = "from-emerald-500 to-teal-600",
  backgroundColor = "bg-slate-700/50",
  showValue = false,
  showPercentage = false,
  label,
  segments,
  animate = true,
  duration = 1500,
  delay = 0,
  easing = "easeOut",
  startOnView = true,
  pulse = false,
  striped = false,
  glowIntensity = "medium",
  onComplete,
  formatValue,
  icon: Icon,
  interactive = false,
  tooltip,
}: AnimatedProgressBarProps) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { shouldReduceAnimations } = usePerformance();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const percentage = Math.min((value / max) * 100, 100);

  // Size configurations
  const sizeConfig = {
    sm: { height: "h-2", text: "text-xs", icon: "w-3 h-3" },
    md: { height: "h-3", text: "text-sm", icon: "w-4 h-4" },
    lg: { height: "h-4", text: "text-base", icon: "w-5 h-5" },
  };

  const currentSize = sizeConfig[size];

  // Easing functions
  const easingFunctions = {
    linear: (t: number) => t,
    easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
    easeInOut: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    bounce: (t: number) => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (t < 1 / d1) {
        return n1 * t * t;
      } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
      } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
      } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
      }
    }
  };

  // Animation effect
  useEffect(() => {
    if (shouldReduceAnimations || !animate || !startOnView || hasAnimated) {
      setCurrentValue(value);
      return;
    }

    if (!isInView) return;

    const startAnimation = () => {
      setIsAnimating(true);
      setHasAnimated(true);
      const startTime = Date.now();
      const startValue = 0;

      const animateStep = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easedProgress = easingFunctions[easing](progress);
        const newValue = startValue + (value - startValue) * easedProgress;

        setCurrentValue(newValue);

        if (progress < 1) {
          requestAnimationFrame(animateStep);
        } else {
          setIsAnimating(false);
          onComplete?.();
        }
      };

      requestAnimationFrame(animateStep);
    };

    if (delay > 0) {
      const timer = setTimeout(startAnimation, delay);
      return () => clearTimeout(timer);
    } else {
      startAnimation();
    }
  }, [value, duration, shouldReduceAnimations, animate, isInView, startOnView, hasAnimated, delay, easing, onComplete]);

  // Format display value
  const displayValue = formatValue ? formatValue(currentValue, max) : Math.round(currentValue);
  const displayPercentage = Math.round((currentValue / max) * 100);

  // Render segmented progress
  const renderSegmentedProgress = () => {
    if (!segments) return null;

    let accumulatedValue = 0;
    
    return (
      <div className={cn("relative w-full rounded-full overflow-hidden", backgroundColor, currentSize.height)}>
        {segments.map((segment, index) => {
          const segmentStart = accumulatedValue;
          const segmentEnd = accumulatedValue + segment.value;
          const segmentWidth = Math.min((segment.value / max) * 100, 100);
          const displayWidth = Math.min(((currentValue - segmentStart) / max) * 100, segmentWidth);
          
          accumulatedValue = segmentEnd;

          return (
            <motion.div
              key={index}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(0, displayWidth)}%` }}
              transition={{ 
                duration: duration / 1000, 
                delay: (delay + index * 100) / 1000,
                ease: easing === "bounce" ? "easeOut" : easing
              }}
              className={cn(
                "absolute top-0 h-full rounded-full",
                segment.color || color,
                striped && "bg-stripe",
                pulse && "animate-pulse",
                glowIntensity === "high" && "shadow-lg",
                glowIntensity === "medium" && "shadow-md",
                glowIntensity === "low" && "shadow-sm"
              )}
              style={{ 
                left: `${(segmentStart / max) * 100}%`,
                ...(glowIntensity !== "low" && {
                  boxShadow: `0 0 ${glowIntensity === "high" ? "20px" : "10px"} ${segment.color || color}33`
                })
              }}
            />
          );
        })}
      </div>
    );
  };

  // Render standard progress
  const renderStandardProgress = () => {
    const progressWidth = (currentValue / max) * 100;

    return (
      <div className={cn("relative w-full rounded-full overflow-hidden", backgroundColor, currentSize.height)}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressWidth}%` }}
          transition={{ 
            duration: duration / 1000, 
            delay: delay / 1000,
            ease: easing === "bounce" ? "easeOut" : easing
          }}
          className={cn(
            "h-full rounded-full transition-all duration-300",
            variant === "gradient" && `bg-gradient-to-r ${color}`,
            variant === "default" && `bg-gradient-to-r ${color}`,
            variant === "glow" && `bg-gradient-to-r ${color}`,
            striped && "bg-stripe animate-stripe",
            pulse && "animate-pulse",
            interactive && isHovered && "brightness-110"
          )}
          style={{
            ...(variant === "glow" && {
              boxShadow: `0 0 ${glowIntensity === "high" ? "20px" : glowIntensity === "medium" ? "10px" : "5px"} ${color}33`
            })
          }}
        />
      </div>
    );
  };

  return (
    <motion.div
      ref={ref}
      initial={animate ? { opacity: 0, y: 10 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("w-full space-y-2", className)}
      title={tooltip}
    >
      {/* Header */}
      {(label || Icon || showValue || showPercentage) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className={cn("text-slate-400", currentSize.icon)} />}
            {label && (
              <span className={cn("font-medium text-slate-300", currentSize.text)}>
                {label}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {showValue && (
              <span className={cn("font-mono text-slate-400", currentSize.text)}>
                {displayValue}/{max}
              </span>
            )}
            {showPercentage && (
              <Badge variant="outline" className={cn("text-xs", currentSize.text)}>
                {displayPercentage}%
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {variant === "segmented" && segments ? renderSegmentedProgress() : renderStandardProgress()}

      {/* Segment Labels */}
      {segments && variant === "segmented" && (
        <div className="flex items-center gap-4 flex-wrap">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className={cn("text-slate-400", currentSize.text)}>
                {segment.label || `Segment ${index + 1}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
});

AnimatedProgressBar.displayName = "AnimatedProgressBar";

// Multi-progress component for displaying multiple progress bars
const MultiProgressBar = memo(({ 
  items, 
  className,
  title,
  spacing = "md"
}: {
  items: AnimatedProgressBarProps[];
  className?: string;
  title?: string;
  spacing?: "sm" | "md" | "lg";
}) => {
  const spacingConfig = {
    sm: "space-y-2",
    md: "space-y-4",
    lg: "space-y-6"
  };

  return (
    <div className={cn("w-full", className)}>
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      )}
      <div className={spacingConfig[spacing]}>
        {items.map((item, index) => (
          <AnimatedProgressBar 
            key={index}
            {...item}
            delay={item.delay || index * 200}
          />
        ))}
      </div>
    </div>
  );
});

MultiProgressBar.displayName = "MultiProgressBar";

export { AnimatedProgressBar, MultiProgressBar };
export type { AnimatedProgressBarProps, ProgressSegment };