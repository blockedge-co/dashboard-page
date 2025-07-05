"use client";

import { useState, useEffect, useRef, memo } from "react";
import { motion, useInView } from "framer-motion";
import { usePerformance } from "@/hooks/use-performance";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: string | number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  separator?: string;
  formatAs?: "number" | "currency" | "percentage" | "compact";
  startOnView?: boolean;
  delay?: number;
  easing?: "linear" | "easeOut" | "easeInOut" | "bounce";
  onComplete?: () => void;
}

const AnimatedCounter = memo(({
  value,
  duration = 2000,
  className,
  prefix = "",
  suffix = "",
  decimals = 0,
  separator = ",",
  formatAs = "number",
  startOnView = true,
  delay = 0,
  easing = "easeOut",
  onComplete
}: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { shouldReduceAnimations } = usePerformance();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  const numericValue = typeof value === "number" ? value : parseFloat(value.toString()) || 0;

  // Easing functions
  const easingFunctions = {
    linear: (t: number) => t,
    easeOut: (t: number) => 1 - Math.pow(1 - t, 4),
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

  useEffect(() => {
    if (shouldReduceAnimations || !startOnView || hasAnimated) {
      setDisplayValue(numericValue);
      return;
    }

    if (!isInView) return;

    const startAnimation = () => {
      setIsAnimating(true);
      setHasAnimated(true);
      const startTime = Date.now();
      const startValue = 0;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easedProgress = easingFunctions[easing](progress);
        const currentValue = startValue + (numericValue - startValue) * easedProgress;

        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          onComplete?.();
        }
      };

      requestAnimationFrame(animate);
    };

    if (delay > 0) {
      const timer = setTimeout(startAnimation, delay);
      return () => clearTimeout(timer);
    } else {
      startAnimation();
    }
  }, [numericValue, duration, shouldReduceAnimations, isInView, startOnView, hasAnimated, delay, easing, onComplete]);

  const formatValue = (val: number): string => {
    if (typeof value === "string" && isNaN(Number(value))) {
      return value;
    }

    let formattedValue: string;

    switch (formatAs) {
      case "currency":
        formattedValue = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }).format(val);
        break;

      case "percentage":
        formattedValue = new Intl.NumberFormat("en-US", {
          style: "percent",
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }).format(val / 100);
        break;

      case "compact":
        if (val >= 1000000) {
          formattedValue = `${(val / 1000000).toFixed(decimals)}M`;
        } else if (val >= 1000) {
          formattedValue = `${(val / 1000).toFixed(decimals)}K`;
        } else {
          formattedValue = val.toFixed(decimals);
        }
        break;

      default: // number
        formattedValue = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        }).format(val);
    }

    return `${prefix}${formattedValue}${suffix}`;
  };

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className={cn(
        "inline-block font-mono tabular-nums",
        isAnimating && "animate-pulse",
        className
      )}
      style={{
        fontVariantNumeric: "tabular-nums"
      }}
    >
      {formatValue(displayValue)}
    </motion.span>
  );
});

AnimatedCounter.displayName = "AnimatedCounter";

export { AnimatedCounter };
export type { AnimatedCounterProps };