"use client";

import React, { 
  useState, 
  useEffect, 
  useCallback, 
  memo, 
  Suspense,
  lazy 
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Monitor,
  Smartphone,
  Tablet,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Settings,
  Bell,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Globe,
  Search,
  Shield,
  Home,
  TrendingUp,
  Activity,
  Database,
  Lock,
  HelpCircle,
  ExternalLink,
  Maximize2,
  Minimize2,
  RefreshCw,
  Download,
  Upload,
  Filter,
  Grid3X3,
  List,
  Zap,
  Cpu,
  MemoryStick,
  HardDrive,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Lazy load the main dashboard component
const PolishedCarbonDashboard = lazy(() => import("./polished-carbon-dashboard"));

// Loading skeleton for the dashboard
const DashboardSkeleton = memo(() => (
  <div className="space-y-6">
    {/* Header skeleton */}
    <div className="h-16 bg-slate-800/50 rounded-lg animate-pulse" />
    
    {/* Metrics skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 bg-slate-800/50 rounded-lg animate-pulse" />
      ))}
    </div>
    
    {/* Chart skeleton */}
    <div className="h-96 bg-slate-800/50 rounded-lg animate-pulse" />
    
    {/* Content skeleton */}
    <div className="h-64 bg-slate-800/50 rounded-lg animate-pulse" />
  </div>
));

// Network status indicator
const NetworkStatus = memo(() => {
  const [status, setStatus] = useState<'online' | 'offline' | 'slow'>('online');
  const [latency, setLatency] = useState(45);

  useEffect(() => {
    const checkNetwork = () => {
      if (!navigator.onLine) {
        setStatus('offline');
        return;
      }

      const start = Date.now();
      fetch('/api/health', { method: 'HEAD', cache: 'no-cache' })
        .then(() => {
          const end = Date.now();
          const responseTime = end - start;
          setLatency(responseTime);
          setStatus(responseTime > 1000 ? 'slow' : 'online');
        })
        .catch(() => setStatus('offline'));
    };

    checkNetwork();
    const interval = setInterval(checkNetwork, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'text-emerald-400';
      case 'slow': return 'text-yellow-400';
      case 'offline': return 'text-red-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'online': return <Wifi className="w-4 h-4" />;
      case 'slow': return <Wifi className="w-4 h-4" />;
      case 'offline': return <WifiOff className="w-4 h-4" />;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex items-center gap-2 ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="text-xs">{latency}ms</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <div className="font-semibold capitalize">{status}</div>
            <div className="text-xs text-slate-400">Latency: {latency}ms</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

// System performance indicator
const SystemPerformance = memo(() => {
  const [metrics, setMetrics] = useState({
    cpu: 15,
    memory: 45,
    storage: 67,
    fps: 60,
  });

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics({
        cpu: Math.floor(Math.random() * 30) + 10,
        memory: Math.floor(Math.random() * 20) + 40,
        storage: Math.floor(Math.random() * 10) + 60,
        fps: Math.floor(Math.random() * 5) + 58,
      });
    };

    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
          <Activity className="w-4 h-4 mr-1" />
          <span className="text-xs">{metrics.fps} FPS</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-slate-900 border-slate-700">
        <DropdownMenuLabel className="text-white">System Performance</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-700" />
        <div className="p-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-slate-300">CPU</span>
            </div>
            <span className="text-sm font-medium text-white">{metrics.cpu}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MemoryStick className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-slate-300">Memory</span>
            </div>
            <span className="text-sm font-medium text-white">{metrics.memory}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-slate-300">Storage</span>
            </div>
            <span className="text-sm font-medium text-white">{metrics.storage}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-slate-300">FPS</span>
            </div>
            <span className="text-sm font-medium text-white">{metrics.fps}</span>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

// Responsive indicator
const ResponsiveIndicator = memo(() => {
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      if (width < 768) setViewport('mobile');
      else if (width < 1024) setViewport('tablet');
      else setViewport('desktop');
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const getIcon = () => {
    switch (viewport) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      case 'desktop': return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 text-slate-400">
            {getIcon()}
            <span className="text-xs capitalize">{viewport}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div>Current viewport: {viewport}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

// Navigation sidebar
const NavigationSidebar = memo(({ 
  isCollapsed, 
  onToggle, 
  activeSection, 
  onSectionChange 
}: {
  isCollapsed: boolean;
  onToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}) => {
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'portfolio', label: 'Portfolio', icon: Globe },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'explorer', label: 'Explorer', icon: Search },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'trading', label: 'Trading', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <motion.div
      initial={false}
      animate={{
        width: isCollapsed ? 64 : 240,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative bg-slate-900/95 backdrop-blur-md border-r border-slate-700/50 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-md flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-white">CO2e Chain</span>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-slate-400 hover:text-white"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {navigationItems.map((item) => (
            <TooltipProvider key={item.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeSection === item.id ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 ${
                      activeSection === item.id
                        ? "bg-emerald-900/50 text-emerald-400 border-emerald-500/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`}
                    onClick={() => onSectionChange(item.id)}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="truncate"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </Button>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 min-w-0"
            >
              <div className="text-sm font-medium text-white truncate">Admin User</div>
              <div className="text-xs text-slate-400 truncate">admin@co2e.chain</div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

// Top status bar
const TopStatusBar = memo(() => {
  const [notifications, setNotifications] = useState(3);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="h-12 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs text-slate-400">Live Dashboard</span>
        </div>
        <Separator orientation="vertical" className="h-4 bg-slate-700" />
        <NetworkStatus />
        <ResponsiveIndicator />
      </div>

      <div className="flex items-center gap-2">
        <SystemPerformance />
        
        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-400 hover:text-white"
        >
          <Bell className="w-4 h-4" />
          {notifications > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 border-0 flex items-center justify-center">
              {notifications}
            </Badge>
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="text-slate-400 hover:text-white"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <Settings className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-slate-900 border-slate-700">
            <DropdownMenuLabel className="text-white">Quick Actions</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh All Data
            </DropdownMenuItem>
            <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800">
              <Download className="w-4 h-4 mr-2" />
              Export Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800">
              <Upload className="w-4 h-4 mr-2" />
              Import Config
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in New Window
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
});

// Main layout component
export const EnhancedDashboardLayout = memo(function EnhancedDashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col overflow-hidden">
      {/* Top Status Bar */}
      <TopStatusBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <NavigationSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6"
                >
                  <DashboardSkeleton />
                </motion.div>
              ) : (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <Suspense fallback={<DashboardSkeleton />}>
                    <PolishedCarbonDashboard />
                  </Suspense>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Bottom Status Bar */}
          <div className="h-8 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50 flex items-center justify-between px-4">
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>CO2e Chain Dashboard v3.0.0</span>
              <Separator orientation="vertical" className="h-3 bg-slate-700" />
              <span>© 2024 BlockEdge</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>Last sync: {new Date().toLocaleTimeString()}</span>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

EnhancedDashboardLayout.displayName = "EnhancedDashboardLayout";