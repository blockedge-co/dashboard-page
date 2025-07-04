"use client";

import { 
  useState, 
  useEffect, 
  useRef, 
  useMemo, 
  useCallback, 
  memo, 
  lazy, 
  Suspense,
  startTransition,
  useDeferredValue 
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  TrendingUp,
  Globe,
  BarChart3,
  Search,
  Shield,
  MapPin,
  Leaf,
  Building2,
  Users,
  DollarSign,
  Activity,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Award,
  Eye,
  Lock,
  Briefcase,
  Target,
  RefreshCw,
  MoreHorizontal,
  X,
  Copy,
  ExternalLink,
  Maximize2,
  Minimize2,
  Settings,
  HelpCircle,
  Bell,
  Menu,
  Grid3X3,
  Layout,
  BarChart,
  Database,
  Cpu,
  Wifi,
  WifiOff,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
} from "recharts";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { co2eApi } from "@/lib/co2e-api";
import {
  chartStyleProps,
  getChartContainerClass,
  getChartColor,
  renderChartGradients,
  chartConfigs,
} from "@/lib/chart-config";
import { useDebouncedFilter } from "@/hooks/use-debounced-filter";
import { usePerformance } from "@/hooks/use-performance";
import { viewTokenOnBlockchain, viewCertOnBlockchain } from "@/lib/blockchain-utils";
import ProjectCard from "./project-card";
import {
  LoadingText,
  LoadingMetric,
  LoadingSkeleton,
} from "./loading-skeleton";

// Types
interface TooltipData {
  title: string;
  description: string;
  shortcut?: string;
}

interface PanelConfig {
  id: string;
  title: string;
  component: React.ComponentType;
  span: number;
  height: string;
  minimized: boolean;
  visible: boolean;
}

interface DashboardSettings {
  refreshInterval: number;
  autoRefresh: boolean;
  animationsEnabled: boolean;
  theme: 'dark' | 'light';
  layout: 'compact' | 'standard' | 'expanded';
  notifications: boolean;
}

// Enhanced Tooltip Component
const EnhancedTooltip = memo(({ data, children }: { data: TooltipData; children: React.ReactNode }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent 
        side="top" 
        className="bg-slate-900 border-slate-700 text-white p-3 rounded-lg shadow-xl max-w-sm"
      >
        <div className="space-y-1">
          <div className="font-semibold text-emerald-400">{data.title}</div>
          <div className="text-sm text-slate-300">{data.description}</div>
          {data.shortcut && (
            <div className="text-xs text-slate-500 mt-2">
              <kbd className="px-2 py-1 bg-slate-800 rounded text-xs">{data.shortcut}</kbd>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
));

// Enhanced Status Indicator
const StatusIndicator = memo(({ status, size = "sm" }: { status: 'online' | 'offline' | 'warning'; size?: 'sm' | 'md' }) => {
  const sizeClasses = size === 'md' ? 'w-3 h-3' : 'w-2 h-2';
  const colors = {
    online: 'bg-emerald-400',
    offline: 'bg-red-400',
    warning: 'bg-orange-400'
  };

  return (
    <motion.div
      className={`${sizeClasses} ${colors[status]} rounded-full`}
      animate={status === 'online' ? {
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
      } : {}}
      transition={{
        duration: 2,
        repeat: status === 'online' ? Infinity : 0,
        ease: "easeInOut",
      }}
    />
  );
});

// Performance Optimized Chart Component
const OptimizedChart = memo(function OptimizedChart({ 
  children, 
  config, 
  className = "h-full",
  minimized = false
}: { 
  children: React.ReactNode; 
  config: any; 
  className?: string;
  minimized?: boolean;
}) {
  const height = minimized ? 200 : 300;
  
  return (
    <ChartContainer config={config} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </ChartContainer>
  );
});

// Mini Performance Indicator
const PerformanceIndicator = memo(() => {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: 45,
    cpu: 23,
    network: 'online' as const
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        fps: Math.floor(Math.random() * 5) + 58,
        memory: Math.floor(Math.random() * 10) + 40,
        cpu: Math.floor(Math.random() * 20) + 15,
        network: Math.random() > 0.95 ? 'warning' : 'online'
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs text-slate-400">
      <div className="flex items-center gap-1">
        <StatusIndicator status={metrics.network} size="sm" />
        <span>{metrics.fps} FPS</span>
      </div>
      <div>CPU: {metrics.cpu}%</div>
      <div>RAM: {metrics.memory}%</div>
    </div>
  );
});

// Keyboard Shortcuts Modal
const KeyboardShortcuts = memo(({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Keyboard Shortcuts</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3 text-sm">
            {[
              { key: "Ctrl + 1", action: "Portfolio Tab" },
              { key: "Ctrl + 2", action: "Analytics Tab" },
              { key: "Ctrl + 3", action: "Explorer Tab" },
              { key: "Ctrl + 4", action: "Compliance Tab" },
              { key: "Ctrl + R", action: "Refresh Data" },
              { key: "Ctrl + /", action: "Show Shortcuts" },
              { key: "Ctrl + F", action: "Search" },
              { key: "Esc", action: "Close Modal" },
            ].map(({ key, action }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-slate-300">{action}</span>
                <kbd className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">{key}</kbd>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
));

// Settings Panel
const SettingsPanel = memo(({ 
  settings, 
  onSettingsChange, 
  isOpen, 
  onClose 
}: { 
  settings: DashboardSettings; 
  onSettingsChange: (settings: DashboardSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, x: 300 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          exit={{ scale: 0.9, opacity: 0, x: 300 }}
          className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Dashboard Settings</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-6">
            {/* Auto Refresh */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Auto Refresh</Label>
                <div className="text-xs text-slate-400">Automatically update data</div>
              </div>
              <Switch
                checked={settings.autoRefresh}
                onCheckedChange={(checked) => 
                  onSettingsChange({ ...settings, autoRefresh: checked })
                }
              />
            </div>
            
            {/* Refresh Interval */}
            <div className="space-y-2">
              <Label className="text-white">Refresh Interval</Label>
              <Select
                value={settings.refreshInterval.toString()}
                onValueChange={(value) => 
                  onSettingsChange({ ...settings, refreshInterval: parseInt(value) })
                }
              >
                <SelectTrigger className="bg-slate-900 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="5000">5 seconds</SelectItem>
                  <SelectItem value="10000">10 seconds</SelectItem>
                  <SelectItem value="30000">30 seconds</SelectItem>
                  <SelectItem value="60000">1 minute</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Animations */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Animations</Label>
                <div className="text-xs text-slate-400">Enable smooth animations</div>
              </div>
              <Switch
                checked={settings.animationsEnabled}
                onCheckedChange={(checked) => 
                  onSettingsChange({ ...settings, animationsEnabled: checked })
                }
              />
            </div>
            
            {/* Layout */}
            <div className="space-y-2">
              <Label className="text-white">Layout Density</Label>
              <Select
                value={settings.layout}
                onValueChange={(value: 'compact' | 'standard' | 'expanded') => 
                  onSettingsChange({ ...settings, layout: value })
                }
              >
                <SelectTrigger className="bg-slate-900 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="expanded">Expanded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
));

// Main Dashboard Component
export const PolishedCarbonDashboard = memo(function PolishedCarbonDashboard() {
  // State management
  const [activeTab, setActiveTab] = useState("portfolio");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedRegistry, setSelectedRegistry] = useState("all");
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  
  const [settings, setSettings] = useState<DashboardSettings>({
    refreshInterval: 10000,
    autoRefresh: true,
    animationsEnabled: true,
    theme: 'dark',
    layout: 'standard',
    notifications: true,
  });

  // Panel management
  const [panelStates, setPanelStates] = useState<Record<string, { minimized: boolean; visible: boolean }>>({
    metrics: { minimized: false, visible: true },
    chart: { minimized: false, visible: true },
    transactions: { minimized: false, visible: true },
    analytics: { minimized: false, visible: true },
  });

  const shouldReduceMotion = useReducedMotion();

  // Data states
  const [realData, setRealData] = useState(() => {
    const data = co2eApi.getRealDashboardData();
    const iconMap: Record<string, React.ComponentType<any>> = {
      DollarSign, Leaf, Award, Building2,
    };
    return {
      ...data,
      heroMetrics: data.heroMetrics.map((metric: any) => ({
        ...metric,
        icon: iconMap[metric.icon] || DollarSign,
      })),
    };
  });

  const [projects, setProjects] = useState<any[]>([]);
  const [projectStats, setProjectStats] = useState<any>(null);
  const [animatedMetrics, setAnimatedMetrics] = useState(
    realData.heroMetrics.map(() => 0)
  );
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'warning'>('online');

  // Performance optimization
  const { shouldReduceAnimations } = usePerformance();

  // Memoized data
  const initialMarketData = useMemo(() => co2eApi.generateMarketData(), []);
  const [marketDataState, setMarketDataState] = useState(initialMarketData);

  // Filter functions
  const filterFunctions = useMemo(
    () => ({
      byType: (project: any, type: string) => {
        if (type === "renewable") {
          return (
            project.type.toLowerCase().includes("renewable") ||
            project.type.toLowerCase().includes("energy")
          );
        }
        if (type === "forest") {
          return (
            project.type.toLowerCase().includes("forest") ||
            project.type.toLowerCase().includes("conservation")
          );
        }
        if (type === "industrial") {
          return (
            project.type.toLowerCase().includes("industrial") ||
            project.type.toLowerCase().includes("efficiency")
          );
        }
        return true;
      },
      byRegistry: (project: any, registry: string) => {
        if (!project.registry) return false;
        const projectRegistry = project.registry.toLowerCase();

        switch (registry) {
          case "verra":
            return projectRegistry.includes("verra");
          case "tuv-sud":
            return projectRegistry.includes("tuv") || projectRegistry.includes("sud");
          case "dnv":
            return projectRegistry.includes("dnv");
          case "irec":
            return projectRegistry.includes("irec") || projectRegistry.includes("i-rec");
          default:
            return true;
        }
      },
      bySearch: (project: any, query: string) => {
        if (!query) return true;
        const searchFields = [
          project.name,
          project.type,
          project.location,
          project.description,
          project.registry,
        ].filter(Boolean);
        
        return searchFields.some(field => 
          field.toLowerCase().includes(query.toLowerCase())
        );
      },
    }),
    []
  );

  // Filtered projects with search
  const filteredProjects = useDebouncedFilter(
    projects,
    {
      type: selectedFilter,
      registry: selectedRegistry,
      search: deferredSearchQuery,
    },
    filterFunctions,
    300
  );

  // Data fetching
  const fetchData = useCallback(async () => {
    if (!settings.autoRefresh && dataLoaded) return;

    setNetworkStatus('warning');
    
    try {
      const [transactions, blocks, stats, projectsData, projectStatsData] = await Promise.all([
        co2eApi.getMainPageTransactions(),
        co2eApi.getMainPageBlocks(),
        co2eApi.getStats(),
        co2eApi.getProjects(),
        co2eApi.getProjectStats(),
      ]);

      if (projectsData && projectsData.length > 0) {
        startTransition(() => {
          setProjects(projectsData);
          setProjectStats(projectStatsData);
          setDataLoaded(true);
          setLastRefresh(new Date());
          setNetworkStatus('online');

          setRealData((prev) => ({
            ...prev,
            recentTransactions: transactions.slice(0, 6).map((tx, index) => ({
              id: `TX${(index + 1).toString().padStart(3, "0")}`,
              type: tx.method || "Contract Call",
              hash: tx.hash,
              amount: `${tx.value || "0"} CO2E`,
              value: tx.value || "0",
              from: tx.from?.hash || "",
              to: tx.to?.hash || "",
              timestamp: tx.timestamp || "Recently",
              status: tx.status || "Success",
            })),
            recentBlocks: blocks.slice(0, 5).map((block) => ({
              number: block.number,
              timestamp: block.timestamp,
              transactions: block.transaction_count,
              gasUsed: block.gas_used,
              gasLimit: block.gas_limit,
            })),
            heroMetrics: [
              {
                title: "Total Projects",
                value: projectStatsData.total > 0 ? projectStatsData.total.toString() : "—",
                change: "",
                trend: "up" as const,
                icon: Leaf,
                pulse: true,
                color: "from-teal-500 to-cyan-600",
              },
              {
                title: "CO2 Reduction",
                value: projectStatsData.totalCO2Reduction && projectStatsData.totalCO2Reduction !== "0"
                  ? `${projectStatsData.totalCO2Reduction}`
                  : "—",
                change: "",
                trend: "up" as const,
                icon: Award,
                pulse: false,
                color: "from-cyan-500 to-sky-600",
              },
              {
                title: "Total Blocks",
                value: stats.total_blocks && stats.total_blocks !== "0"
                  ? stats.total_blocks
                  : prev.heroMetrics[2].value,
                change: "",
                trend: "up" as const,
                icon: Building2,
                pulse: true,
                color: "from-sky-500 to-indigo-600",
              },
              {
                title: "Standards",
                value: projectStatsData.totalStandards > 0
                  ? projectStatsData.totalStandards.toString()
                  : "—",
                change: "",
                trend: "up" as const,
                icon: Award,
                pulse: false,
                color: "from-emerald-500 to-teal-600",
              },
            ],
          }));
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setNetworkStatus('offline');
    }
  }, [settings.autoRefresh, dataLoaded]);

  // Effects
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto refresh
  useEffect(() => {
    if (!settings.autoRefresh) return;

    const interval = setInterval(fetchData, settings.refreshInterval);
    return () => clearInterval(interval);
  }, [settings.autoRefresh, settings.refreshInterval, fetchData]);

  // Metric animations
  useEffect(() => {
    if (shouldReduceMotion || !settings.animationsEnabled) {
      setAnimatedMetrics(realData.heroMetrics.map(() => 100));
      return;
    }

    const interval = setInterval(() => {
      setAnimatedMetrics((prev) => {
        const newValues = [...prev];
        let allComplete = true;

        realData.heroMetrics.forEach((_, index) => {
          if (newValues[index] < 100) {
            newValues[index] += 10;
            if (newValues[index] > 100) newValues[index] = 100;
            allComplete = false;
          }
        });

        if (allComplete) {
          clearInterval(interval);
        }

        return newValues;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [realData.heroMetrics, shouldReduceMotion, settings.animationsEnabled]);

  // Market data updates
  useEffect(() => {
    if (shouldReduceMotion || !settings.animationsEnabled) return;

    const interval = setInterval(() => {
      setMarketDataState((prevData) => {
        return prevData.map((item) => ({
          ...item,
          price: item.price * (1 + (Math.random() * 0.02 - 0.01)),
          volume: item.volume * (1 + (Math.random() * 0.03 - 0.015)),
        }));
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [shouldReduceMotion, settings.animationsEnabled]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case '1':
          e.preventDefault();
          setActiveTab('portfolio');
          break;
        case '2':
          e.preventDefault();
          setActiveTab('analytics');
          break;
        case '3':
          e.preventDefault();
          setActiveTab('explorer');
          break;
        case '4':
          e.preventDefault();
          setActiveTab('compliance');
          break;
        case 'r':
          e.preventDefault();
          fetchData();
          break;
        case '/':
          e.preventDefault();
          setShowKeyboardShortcuts(true);
          break;
        case 'f':
          e.preventDefault();
          document.getElementById('global-search')?.focus();
          break;
      }
    }
    if (e.key === 'Escape') {
      setShowKeyboardShortcuts(false);
      setShowSettings(false);
    }
  }, [fetchData]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Panel controls
  const togglePanel = useCallback((panelId: string, action: 'minimize' | 'hide') => {
    setPanelStates(prev => ({
      ...prev,
      [panelId]: {
        ...prev[panelId],
        [action === 'minimize' ? 'minimized' : 'visible']: 
          action === 'minimize' ? !prev[panelId]?.minimized : !prev[panelId]?.visible
      }
    }));
  }, []);

  const spacing = settings.layout === 'compact' ? 'space-y-4' : settings.layout === 'expanded' ? 'space-y-8' : 'space-y-6';
  const padding = settings.layout === 'compact' ? 'p-4' : settings.layout === 'expanded' ? 'p-8' : 'p-6';

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 ${spacing}`}>
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50">
        <div className={`container mx-auto ${padding}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  CO2e Chain Dashboard
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <StatusIndicator status={networkStatus} size="md" />
                <span className="text-xs text-slate-400">
                  Last update: {lastRefresh.toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Global Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="global-search"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-9 bg-slate-800/50 border-slate-700 text-slate-300 focus:border-emerald-500"
                />
              </div>

              {/* Action Buttons */}
              <EnhancedTooltip data={{ title: "Refresh Data", description: "Reload all dashboard data", shortcut: "Ctrl+R" }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={fetchData}
                  className="text-slate-400 hover:text-white"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </EnhancedTooltip>

              <EnhancedTooltip data={{ title: "Keyboard Shortcuts", description: "View all available shortcuts", shortcut: "Ctrl+/" }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowKeyboardShortcuts(true)}
                  className="text-slate-400 hover:text-white"
                >
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </EnhancedTooltip>

              <EnhancedTooltip data={{ title: "Settings", description: "Configure dashboard preferences" }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(true)}
                  className="text-slate-400 hover:text-white"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </EnhancedTooltip>

              <PerformanceIndicator />
            </div>
          </div>
        </div>
      </div>

      <div className={`container mx-auto ${padding} ${spacing}`}>
        {/* Hero Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {realData.heroMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-70" />
              <Card className="relative overflow-hidden bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:bg-slate-800/70">
                <CardContent className={settings.layout === 'compact' ? 'p-4' : 'p-6'}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-400">
                        {metric.title}
                      </p>
                      <div className="h-8 flex items-end">
                        {isLoading || !dataLoaded ? (
                          <LoadingText text="Loading..." />
                        ) : (
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.5,
                              delay: 0.2 + index * 0.1,
                            }}
                            className="text-3xl font-bold text-white"
                          >
                            {animatedMetrics[index] === 100 ? metric.value : "—"}
                          </motion.p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {metric.trend === "up" ? (
                          <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-400" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            metric.trend === "up" ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {metric.change}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${metric.color} flex items-center justify-center shadow-lg`}
                      >
                        <metric.icon className="w-6 h-6 text-white" />
                      </div>
                      {metric.pulse && (
                        <motion.div
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0.2, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                          className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"
                        />
                      )}
                    </div>
                  </div>
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${animatedMetrics[index]}%` }}
                    className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-4"
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Chart Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                    CO2e Chain Analytics
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Real-time blockchain metrics and transaction analysis
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <EnhancedTooltip data={{ title: "Minimize Panel", description: "Reduce panel height" }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => togglePanel('chart', 'minimize')}
                      className="text-slate-400 hover:text-white"
                    >
                      {panelStates.chart?.minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                    </Button>
                  </EnhancedTooltip>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-700 text-slate-300 hover:bg-slate-700/50"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className={settings.layout === 'compact' ? 'p-4' : 'p-6'}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className={getChartContainerClass(panelStates.chart?.minimized ? "compact" : "video")}>
                    <OptimizedChart
                      config={chartConfigs.carbonMetrics}
                      minimized={panelStates.chart?.minimized}
                    >
                      <AreaChart data={marketDataState} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        {renderChartGradients(["emerald"])}
                        <CartesianGrid 
                          strokeDasharray={chartStyleProps.grid.strokeDasharray}
                          stroke={chartStyleProps.grid.stroke}
                          strokeOpacity={chartStyleProps.grid.strokeOpacity}
                        />
                        <XAxis 
                          dataKey="month" 
                          stroke={chartStyleProps.axis.stroke}
                          fontSize={chartStyleProps.axis.fontSize}
                          fill={chartStyleProps.axis.fill}
                          axisLine={{ stroke: chartStyleProps.grid.stroke }}
                          tickLine={{ stroke: chartStyleProps.grid.stroke }}
                        />
                        <YAxis 
                          stroke={chartStyleProps.axis.stroke}
                          fontSize={chartStyleProps.axis.fontSize}
                          fill={chartStyleProps.axis.fill}
                          axisLine={{ stroke: chartStyleProps.grid.stroke }}
                          tickLine={{ stroke: chartStyleProps.grid.stroke }}
                        />
                        <ChartTooltip 
                          content={<ChartTooltipContent />}
                          contentStyle={{
                            backgroundColor: "rgba(30, 41, 59, 0.95)",
                            border: "1px solid rgba(71, 85, 105, 0.5)",
                            borderRadius: "8px",
                            backdropFilter: "blur(4px)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke={getChartColor("emerald")}
                          fillOpacity={1}
                          fill="url(#emeraldGradient)"
                          strokeWidth={3}
                          dot={{ fill: getChartColor("emerald"), strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: getChartColor("emerald"), strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </OptimizedChart>
                  </div>
                </div>
                
                {/* Side panels */}
                <div className="space-y-4">
                  {/* Gas Price */}
                  <Card className="bg-slate-800/80 border-slate-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-400">Gas Price</span>
                        <motion.span
                          animate={{
                            color: ["#10b981", "#34d399", "#10b981"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                          className="text-lg font-bold text-emerald-500"
                        >
                          {realData.networkStats.gasPrice}
                        </motion.span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs text-emerald-400">+15.5% (24h)</span>
                      </div>
                      <div className="mt-2 h-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={marketDataState.slice(-5)} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                            <Line
                              type="monotone"
                              dataKey="price"
                              stroke={getChartColor("emerald")}
                              strokeWidth={3}
                              dot={false}
                              isAnimationActive={settings.animationsEnabled}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Network Utilization */}
                  <Card className="bg-slate-800/80 border-slate-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-400">Network Health</span>
                        <span className="text-lg font-bold text-emerald-500">
                          {realData.networkStats.networkUtilization}
                        </span>
                      </div>
                      <div className="mt-2 relative">
                        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "88%" }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-slate-500">
                          <span>Poor</span>
                          <span>Good</span>
                          <span>Excellent</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Daily Transactions */}
                  <Card className="bg-slate-800/80 border-slate-700/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-400">Daily TXs</span>
                        <span className="text-lg font-bold text-white">
                          {realData.networkStats.dailyTransactions}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs text-emerald-400">+8.2%</span>
                      </div>
                      <div className="mt-2 h-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={marketDataState.slice(-5)} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                            {renderChartGradients(["teal"])}
                            <Area
                              type="monotone"
                              dataKey="volume"
                              stroke={getChartColor("teal")}
                              fill="url(#tealGradient)"
                              strokeWidth={3}
                              dot={false}
                              isAnimationActive={settings.animationsEnabled}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl blur-xl" />
              <TabsList className="grid w-full grid-cols-4 bg-slate-800/70 backdrop-blur-md border border-white/5 rounded-xl p-1">
                <TabsTrigger
                  value="portfolio"
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">Portfolio</span>
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger
                  value="explorer"
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Explorer</span>
                </TabsTrigger>
                <TabsTrigger
                  value="compliance"
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Compliance</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-6">
              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-700/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Globe className="w-5 h-5 text-emerald-400" />
                        Project Portfolio
                      </CardTitle>
                      <CardDescription className="text-slate-400">
                        {filteredProjects.length} of {projects.length} projects shown
                      </CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                        <SelectTrigger className="w-48 bg-slate-900/80 border-slate-700 text-slate-300">
                          <SelectValue placeholder="Filter projects" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700 text-slate-300">
                          <SelectItem value="all">All Projects</SelectItem>
                          <SelectItem value="renewable">Renewable Energy</SelectItem>
                          <SelectItem value="forest">Forest Conservation</SelectItem>
                          <SelectItem value="industrial">Industrial Efficiency</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={selectedRegistry} onValueChange={setSelectedRegistry}>
                        <SelectTrigger className="w-48 bg-slate-900/80 border-slate-700 text-slate-300">
                          <SelectValue placeholder="Filter by registry" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-700 text-slate-300">
                          <SelectItem value="all">All Registries</SelectItem>
                          <SelectItem value="verra">Verra</SelectItem>
                          <SelectItem value="tuv-sud">TUV SUD</SelectItem>
                          <SelectItem value="dnv">DNV</SelectItem>
                          <SelectItem value="irec">I-REC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className={settings.layout === 'compact' ? 'p-4' : 'p-6'}>
                  {isLoading || (!dataLoaded && projects.length === 0) ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((index) => (
                        <Card key={index} className="bg-slate-800/80 border-slate-700/50">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-2">
                                <LoadingSkeleton className="h-6 w-3/4" />
                                <LoadingSkeleton className="h-4 w-1/2" />
                                <LoadingSkeleton className="h-3 w-1/3" />
                              </div>
                              <LoadingSkeleton className="h-6 w-12" />
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <LoadingSkeleton className="h-3 w-20 mb-1" />
                                <LoadingSkeleton className="h-4 w-16" />
                              </div>
                              <div>
                                <LoadingSkeleton className="h-3 w-16 mb-1" />
                                <LoadingSkeleton className="h-4 w-20" />
                              </div>
                            </div>
                            <LoadingSkeleton className="h-8 w-full" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {(filteredProjects.length > 0 ? filteredProjects.slice(0, 6) : projects.slice(0, 6)).map((project, index) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          index={index}
                          onViewDetails={() => {}}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
                  <CardHeader className="border-b border-slate-700/50">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      Predictive Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className={getChartContainerClass("video")}>
                      <OptimizedChart config={chartConfigs.performance}>
                        <LineChart data={marketDataState} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.3} />
                          <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                          <YAxis stroke="#64748b" fontSize={12} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} />
                          <Line type="monotone" dataKey="sentiment" stroke="#3b82f6" strokeWidth={3} strokeDasharray="8 4" />
                        </LineChart>
                      </OptimizedChart>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
                  <CardHeader className="border-b border-slate-700/50">
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Users className="w-5 h-5 text-emerald-400" />
                      Market Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {[
                        { name: "Large Buy", amount: "$15M", entity: "BlackRock", color: "emerald" },
                        { name: "Distribution", amount: "$8M", entity: "Vanguard", color: "orange" },
                        { name: "New Position", amount: "$12M", entity: "State Street", color: "emerald" },
                      ].map((activity, index) => (
                        <motion.div
                          key={activity.name}
                          initial={{ x: -50, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className={`flex items-center justify-between p-4 bg-${activity.color}-900/30 border border-${activity.color}-800/50 rounded-lg`}
                        >
                          <div className="flex items-center gap-3">
                            <StatusIndicator status="online" size="md" />
                            <div>
                              <div className="font-medium text-white">{activity.name}</div>
                              <div className={`text-sm text-${activity.color}-300`}>{activity.amount}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-white">{activity.entity}</div>
                            <div className="text-xs text-slate-400">{Math.floor(Math.random() * 60)} min ago</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Explorer Tab */}
            <TabsContent value="explorer" className="space-y-6">
              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Search className="w-5 h-5 text-emerald-400" />
                    Transaction Explorer
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {realData.recentTransactions.slice(0, 5).map((tx, index) => (
                      <motion.div
                        key={tx.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-slate-800/80 border border-slate-700/50 rounded-lg hover:bg-slate-700/50 transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {tx.hash.substring(0, 10)}...{tx.hash.slice(-4)}
                            </div>
                            <div className="text-sm text-slate-400">
                              {tx.type} • {tx.from ? `${tx.from.substring(0, 6)}...${tx.from.slice(-4)}` : "Unknown"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-white">{tx.amount}</div>
                          <div className="text-sm text-slate-400">{tx.timestamp}</div>
                        </div>
                        <Badge
                          variant={tx.status === "Success" ? "default" : "secondary"}
                          className={
                            tx.status === "Success"
                              ? "bg-emerald-900/50 text-emerald-400 border-emerald-500/30"
                              : "bg-orange-900/50 text-orange-400 border-orange-500/30"
                          }
                        >
                          {tx.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="space-y-6">
              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Shield className="w-5 h-5 text-emerald-400" />
                    Regulatory Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { name: "EU ETS", score: 97, status: "Compliant" },
                      { name: "California", score: 94, status: "Compliant" },
                      { name: "RGGI", score: 99, status: "Compliant" },
                      { name: "UK ETS", score: 87, status: "Review" },
                    ].map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="bg-slate-800/80 border-slate-700/50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-medium text-white">{item.name}</span>
                              <Badge
                                variant={item.status === "Compliant" ? "default" : "secondary"}
                                className={
                                  item.status === "Compliant"
                                    ? "bg-emerald-900/50 text-emerald-400 border-emerald-500/30"
                                    : "bg-orange-900/50 text-orange-400 border-orange-500/30"
                                }
                              >
                                {item.status}
                              </Badge>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400">Score</span>
                                <span className="font-medium text-white">{item.score}%</span>
                              </div>
                              <div className="relative">
                                <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.score}%` }}
                                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                    className={`h-full ${
                                      item.score >= 95
                                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                                        : item.score >= 90
                                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                        : "bg-gradient-to-r from-red-500 to-red-600"
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Modals */}
      <KeyboardShortcuts 
        isOpen={showKeyboardShortcuts} 
        onClose={() => setShowKeyboardShortcuts(false)} 
      />
      <SettingsPanel
        settings={settings}
        onSettingsChange={setSettings}
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
});

PolishedCarbonDashboard.displayName = "PolishedCarbonDashboard";

export default PolishedCarbonDashboard;