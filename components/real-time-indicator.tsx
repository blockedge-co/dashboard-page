"use client";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Zap,
  Activity,
  Signal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePerformance } from "@/hooks/use-performance";

interface RealTimeIndicatorProps {
  status: "connected" | "disconnected" | "loading" | "error" | "syncing";
  lastUpdate?: Date;
  nextUpdate?: Date;
  onRefresh?: () => void;
  showLastUpdate?: boolean;
  showNextUpdate?: boolean;
  showRefreshButton?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // in seconds
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "badge" | "card" | "minimal" | "detailed";
  animate?: boolean;
  showSignalStrength?: boolean;
  signalStrength?: number; // 0-100
  dataUsage?: {
    sent: number;
    received: number;
    unit: "B" | "KB" | "MB" | "GB";
  };
  connectionType?: "wifi" | "cellular" | "ethernet" | "unknown";
  customMessages?: {
    connected?: string;
    disconnected?: string;
    loading?: string;
    error?: string;
    syncing?: string;
  };
}

const RealTimeIndicator = memo(({
  status,
  lastUpdate,
  nextUpdate,
  onRefresh,
  showLastUpdate = true,
  showNextUpdate = false,
  showRefreshButton = true,
  autoRefresh = true,
  refreshInterval = 30,
  className,
  size = "md",
  variant = "badge",
  animate = true,
  showSignalStrength = false,
  signalStrength = 100,
  dataUsage,
  connectionType = "wifi",
  customMessages,
}: RealTimeIndicatorProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const { shouldReduceAnimations } = usePerformance();
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();
  const countdownIntervalRef = useRef<NodeJS.Timeout>();

  // Status configurations
  const statusConfig = {
    connected: {
      icon: CheckCircle2,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      message: customMessages?.connected || "Connected",
      badge: "success"
    },
    disconnected: {
      icon: WifiOff,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      message: customMessages?.disconnected || "Disconnected",
      badge: "destructive"
    },
    loading: {
      icon: RefreshCw,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      message: customMessages?.loading || "Loading...",
      badge: "secondary"
    },
    error: {
      icon: AlertCircle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      message: customMessages?.error || "Connection Error",
      badge: "destructive"
    },
    syncing: {
      icon: RefreshCw,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      message: customMessages?.syncing || "Syncing...",
      badge: "secondary"
    }
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      text: "text-xs",
      icon: "w-3 h-3",
      padding: "px-2 py-1",
      gap: "gap-1"
    },
    md: {
      text: "text-sm",
      icon: "w-4 h-4",
      padding: "px-3 py-2",
      gap: "gap-2"
    },
    lg: {
      text: "text-base",
      icon: "w-5 h-5",
      padding: "px-4 py-3",
      gap: "gap-3"
    }
  };

  const currentStatus = statusConfig[status];
  const currentSize = sizeConfig[size];

  // Format time ago
  const formatTimeAgo = useCallback((date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  }, []);

  // Format countdown
  const formatCountdown = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    if (isRefreshing || !onRefresh) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, onRefresh]);

  // Auto refresh logic
  useEffect(() => {
    if (!autoRefresh || !onRefresh || status === "disconnected" || status === "error") {
      return;
    }

    const startCountdown = () => {
      let timeLeft = refreshInterval;
      setCountdown(timeLeft);

      countdownIntervalRef.current = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);

        if (timeLeft <= 0) {
          clearInterval(countdownIntervalRef.current!);
          handleRefresh();
        }
      }, 1000);
    };

    refreshTimeoutRef.current = setTimeout(() => {
      startCountdown();
    }, 1000);

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, onRefresh, status, handleRefresh]);

  // Update time display
  useEffect(() => {
    if (!lastUpdate && !nextUpdate) return;

    const interval = setInterval(() => {
      if (lastUpdate) {
        setTimeLeft(formatTimeAgo(lastUpdate));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate, nextUpdate, formatTimeAgo]);

  // Connection type icon
  const getConnectionIcon = () => {
    switch (connectionType) {
      case "wifi":
        return status === "connected" ? Wifi : WifiOff;
      case "cellular":
        return Signal;
      case "ethernet":
        return Activity;
      default:
        return currentStatus.icon;
    }
  };

  const ConnectionIcon = getConnectionIcon();

  // Signal strength component
  const SignalStrength = () => {
    if (!showSignalStrength) return null;

    const strength = Math.max(0, Math.min(100, signalStrength));
    const bars = Math.ceil((strength / 100) * 4);

    return (
      <div className="flex items-center gap-px">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={cn(
              "w-1 bg-slate-600 rounded-sm transition-colors duration-300",
              bar === 1 && "h-1",
              bar === 2 && "h-2",
              bar === 3 && "h-3",
              bar === 4 && "h-4",
              bar <= bars && currentStatus.color.replace("text-", "bg-")
            )}
          />
        ))}
      </div>
    );
  };

  // Minimal variant
  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center", currentSize.gap, className)}>
        <motion.div
          animate={!shouldReduceAnimations && (status === "loading" || status === "syncing") ? { rotate: 360 } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <ConnectionIcon className={cn(currentSize.icon, currentStatus.color)} />
        </motion.div>
        {showSignalStrength && <SignalStrength />}
        {countdown > 0 && autoRefresh && (
          <span className={cn("font-mono text-slate-400", currentSize.text)}>
            {formatCountdown(countdown)}
          </span>
        )}
      </div>
    );
  }

  // Badge variant
  if (variant === "badge") {
    return (
      <div className={cn("flex items-center", currentSize.gap, className)}>
        <Badge 
          variant={currentStatus.badge as any}
          className={cn(
            "flex items-center",
            currentSize.gap,
            currentSize.padding,
            animate && "transition-all duration-300"
          )}
        >
          <motion.div
            animate={!shouldReduceAnimations && (status === "loading" || status === "syncing") ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <ConnectionIcon className={currentSize.icon} />
          </motion.div>
          <span className={currentSize.text}>{currentStatus.message}</span>
        </Badge>
        
        {showSignalStrength && <SignalStrength />}
        
        {showRefreshButton && onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={cn("h-auto", currentSize.padding)}
          >
            <motion.div
              animate={isRefreshing && !shouldReduceAnimations ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
            >
              <RefreshCw className={currentSize.icon} />
            </motion.div>
          </Button>
        )}
      </div>
    );
  }

  // Card variant
  if (variant === "card") {
    return (
      <motion.div
        initial={animate ? { opacity: 0, scale: 0.95 } : false}
        animate={animate ? { opacity: 1, scale: 1 } : false}
        className={cn(
          "rounded-lg border p-4 bg-slate-800/50 backdrop-blur-sm",
          currentStatus.borderColor,
          currentStatus.bgColor,
          className
        )}
      >
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center", currentSize.gap)}>
            <motion.div
              animate={!shouldReduceAnimations && (status === "loading" || status === "syncing") ? { rotate: 360 } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <ConnectionIcon className={cn(currentSize.icon, currentStatus.color)} />
            </motion.div>
            <div>
              <div className={cn("font-medium", currentStatus.color, currentSize.text)}>
                {currentStatus.message}
              </div>
              {showLastUpdate && lastUpdate && (
                <div className={cn("text-slate-400", size === "lg" ? "text-sm" : "text-xs")}>
                  Last update: {timeLeft || formatTimeAgo(lastUpdate)}
                </div>
              )}
            </div>
          </div>
          
          <div className={cn("flex items-center", currentSize.gap)}>
            {showSignalStrength && <SignalStrength />}
            
            {countdown > 0 && autoRefresh && (
              <Badge variant="outline" className="font-mono">
                {formatCountdown(countdown)}
              </Badge>
            )}
            
            {showRefreshButton && onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <motion.div
                  animate={isRefreshing && !shouldReduceAnimations ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
              </Button>
            )}
          </div>
        </div>
        
        {dataUsage && (
          <div className="mt-3 pt-3 border-t border-slate-700/50">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Sent: {dataUsage.sent}{dataUsage.unit}</span>
              <span>Received: {dataUsage.received}{dataUsage.unit}</span>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // Detailed variant
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 10 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      className={cn(
        "rounded-xl border p-6 bg-slate-800/50 backdrop-blur-sm",
        currentStatus.borderColor,
        currentStatus.bgColor,
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={!shouldReduceAnimations && (status === "loading" || status === "syncing") ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={cn(
              "p-2 rounded-lg",
              currentStatus.bgColor,
              currentStatus.borderColor,
              "border"
            )}
          >
            <ConnectionIcon className={cn("w-6 h-6", currentStatus.color)} />
          </motion.div>
          <div>
            <h3 className={cn("font-semibold", currentStatus.color)}>
              {currentStatus.message}
            </h3>
            <p className="text-sm text-slate-400">
              Real-time data synchronization
            </p>
          </div>
        </div>
        
        {showSignalStrength && <SignalStrength />}
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        {showLastUpdate && lastUpdate && (
          <div>
            <span className="text-slate-400">Last Update</span>
            <div className="font-mono text-white">
              {timeLeft || formatTimeAgo(lastUpdate)}
            </div>
          </div>
        )}
        
        {showNextUpdate && nextUpdate && (
          <div>
            <span className="text-slate-400">Next Update</span>
            <div className="font-mono text-white">
              {formatTimeAgo(nextUpdate)}
            </div>
          </div>
        )}
        
        {countdown > 0 && autoRefresh && (
          <div>
            <span className="text-slate-400">Refresh In</span>
            <div className="font-mono text-white">
              {formatCountdown(countdown)}
            </div>
          </div>
        )}
        
        <div>
          <span className="text-slate-400">Connection</span>
          <div className="font-mono text-white capitalize">
            {connectionType}
          </div>
        </div>
      </div>
      
      {(dataUsage || showRefreshButton) && (
        <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
          {dataUsage && (
            <div className="text-xs text-slate-400">
              ↑ {dataUsage.sent}{dataUsage.unit} / ↓ {dataUsage.received}{dataUsage.unit}
            </div>
          )}
          
          {showRefreshButton && onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="ml-auto"
            >
              <motion.div
                animate={isRefreshing && !shouldReduceAnimations ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
              </motion.div>
              Refresh
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
});

RealTimeIndicator.displayName = "RealTimeIndicator";

export { RealTimeIndicator };
export type { RealTimeIndicatorProps };