"use client";

import { useState, useEffect, useRef, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePerformance } from "@/hooks/use-performance";
import { LucideIcon } from "lucide-react";

interface TooltipData {
  label: string;
  value: string | number;
  color?: string;
  icon?: LucideIcon;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  metadata?: {
    [key: string]: string | number;
  };
}

interface InteractiveChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  coordinate?: { x: number; y: number };
  position?: { x: number; y: number };
  className?: string;
  formatter?: (value: any, name: string, props: any) => [string, string];
  labelFormatter?: (label: string, payload: any[]) => string;
  separator?: string;
  showAnimation?: boolean;
  showMetadata?: boolean;
  compact?: boolean;
  style?: "default" | "glass" | "solid" | "minimal";
  data?: TooltipData[];
}

const InteractiveChartTooltip = memo(({
  active,
  payload,
  label,
  coordinate,
  position,
  className,
  formatter,
  labelFormatter,
  separator = " : ",
  showAnimation = true,
  showMetadata = false,
  compact = false,
  style = "default",
  data,
}: InteractiveChartTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState<TooltipData[]>([]);
  const { shouldReduceAnimations } = usePerformance();
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active && (payload?.length || data?.length)) {
      setIsVisible(true);
      
      if (data) {
        setTooltipData(data);
      } else if (payload) {
        const processedData = payload.map((item, index) => ({
          label: item.name || item.dataKey || `Series ${index + 1}`,
          value: formatter ? formatter(item.value, item.name, item)[0] : item.value,
          color: item.color || item.stroke || item.fill,
          metadata: showMetadata ? item.payload : undefined,
        }));
        setTooltipData(processedData);
      }
    } else {
      setIsVisible(false);
    }
  }, [active, payload, data, formatter, showMetadata]);

  const formatValue = (value: string | number): string => {
    if (typeof value === "number") {
      return value.toLocaleString();
    }
    return value;
  };

  const getTooltipStyles = () => {
    const baseStyles = "rounded-lg border shadow-xl backdrop-blur-sm";
    
    switch (style) {
      case "glass":
        return cn(baseStyles, "bg-slate-900/80 border-slate-700/50");
      case "solid":
        return cn(baseStyles, "bg-slate-800 border-slate-700");
      case "minimal":
        return cn(baseStyles, "bg-white/95 border-slate-200 text-slate-900");
      default:
        return cn(baseStyles, "bg-slate-800/95 border-slate-700/50");
    }
  };

  if (!isVisible || !tooltipData.length) {
    return null;
  }

  const formattedLabel = labelFormatter && label ? labelFormatter(label, payload || []) : label;

  const tooltipContent = (
    <div
      ref={tooltipRef}
      className={cn(
        getTooltipStyles(),
        "min-w-[200px] max-w-[300px] p-3 z-50",
        compact && "p-2 min-w-[150px]",
        className
      )}
    >
      {formattedLabel && (
        <div className={cn(
          "font-medium mb-2 pb-2 border-b border-slate-700/30",
          compact && "text-sm mb-1 pb-1",
          style === "minimal" && "text-slate-900 border-slate-200"
        )}>
          {formattedLabel}
        </div>
      )}
      
      <div className="space-y-2">
        {tooltipData.map((item, index) => (
          <motion.div
            key={index}
            initial={showAnimation && !shouldReduceAnimations ? { opacity: 0, x: -10 } : false}
            animate={showAnimation && !shouldReduceAnimations ? { opacity: 1, x: 0 } : false}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className={cn(
              "flex items-center justify-between gap-2",
              compact && "text-sm"
            )}
          >
            <div className="flex items-center gap-2 flex-1">
              {item.icon && (
                <item.icon className={cn("w-4 h-4", item.color && `text-[${item.color}]`)} />
              )}
              {item.color && !item.icon && (
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
              )}
              <span className={cn(
                "text-slate-300 truncate",
                style === "minimal" && "text-slate-600"
              )}>
                {item.label}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className={cn(
                "font-mono font-medium tabular-nums",
                style === "minimal" ? "text-slate-900" : "text-white"
              )}>
                {formatValue(item.value)}
              </span>
              
              {item.change && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs px-1 py-0",
                    item.change.trend === "up" && "text-emerald-400 border-emerald-400/30",
                    item.change.trend === "down" && "text-red-400 border-red-400/30",
                    item.change.trend === "neutral" && "text-slate-400 border-slate-400/30"
                  )}
                >
                  {item.change.value}
                </Badge>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {showMetadata && tooltipData.some(item => item.metadata) && (
        <div className={cn(
          "mt-3 pt-2 border-t border-slate-700/30 space-y-1",
          compact && "mt-2 pt-1",
          style === "minimal" && "border-slate-200"
        )}>
          {tooltipData.map((item, index) => (
            item.metadata && (
              <div key={index} className="text-xs text-slate-500 space-y-1">
                {Object.entries(item.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key}:</span>
                    <span className="font-mono">{formatValue(value)}</span>
                  </div>
                ))}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );

  if (shouldReduceAnimations || !showAnimation) {
    return tooltipContent;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.15 }}
      >
        {tooltipContent}
      </motion.div>
    </AnimatePresence>
  );
});

InteractiveChartTooltip.displayName = "InteractiveChartTooltip";

// Enhanced tooltip for recharts integration
const EnhancedChartTooltip = memo((props: any) => {
  const { active, payload, label, coordinate } = props;
  
  return (
    <InteractiveChartTooltip
      active={active}
      payload={payload}
      label={label}
      coordinate={coordinate}
      showAnimation={true}
      showMetadata={false}
      style="glass"
    />
  );
});

EnhancedChartTooltip.displayName = "EnhancedChartTooltip";

// Hover effect component for chart elements
const ChartHoverEffect = memo(({ 
  children, 
  hoverColor = "rgba(16, 185, 129, 0.1)",
  scale = 1.02,
  duration = 0.2
}: {
  children: React.ReactNode;
  hoverColor?: string;
  scale?: number;
  duration?: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { shouldReduceAnimations } = usePerformance();

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={!shouldReduceAnimations ? { scale } : {}}
      transition={{ duration }}
      className="relative"
    >
      {children}
      <AnimatePresence>
        {isHovered && !shouldReduceAnimations && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{ backgroundColor: hoverColor }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
});

ChartHoverEffect.displayName = "ChartHoverEffect";

export { 
  InteractiveChartTooltip, 
  EnhancedChartTooltip, 
  ChartHoverEffect 
};
export type { InteractiveChartTooltipProps, TooltipData };