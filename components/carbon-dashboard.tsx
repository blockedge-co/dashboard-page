"use client";

import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { motion } from "framer-motion";
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
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { co2eApi } from "@/lib/co2e-api";
import { initializeProjectData } from "@/lib/project-data-manager";
import { useDebouncedFilter } from "@/hooks/use-debounced-filter";
import { usePerformance } from "@/hooks/use-performance";
import { viewTokenOnBlockchain, viewCertOnBlockchain } from "@/lib/blockchain-utils";
import ProjectCard from "./project-card";
import {
  LoadingText,
  LoadingMetric,
  LoadingSkeleton,
} from "./loading-skeleton";

export function CarbonDashboard() {
  const [activeTab, setActiveTab] = useState("portfolio");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedRegistry, setSelectedRegistry] = useState("all");
  type HeroMetric = {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: React.ComponentType<any>;
    pulse: boolean;
    color: string;
  };

  type RealDashboardData = {
    heroMetrics: HeroMetric[];
    recentTransactions: any[];
    recentBlocks: any[];
    networkStats: any;
    projects?: any[];
  };

  // Map icon string to actual icon component
  const iconMap: Record<string, React.ComponentType<any>> = {
    DollarSign,
    Leaf,
    Award,
    Building2,
  };

  const getInitialRealDashboardData = () => {
    const data = co2eApi.getRealDashboardData();
    return {
      ...data,
      heroMetrics: data.heroMetrics.map((metric: any) => ({
        ...metric,
        icon: iconMap[metric.icon] || DollarSign,
      })),
    };
  };

  const [realData, setRealData] = useState<RealDashboardData>(
    getInitialRealDashboardData()
  );
  const [projects, setProjects] = useState<any[]>([]);
  const [projectStats, setProjectStats] = useState<any>(null);
  const [animatedMetrics, setAnimatedMetrics] = useState(
    realData.heroMetrics.map(() => 0)
  );
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Compliance data - generated dynamically based on real data
  const [complianceData] = useState(() => [
    {
      jurisdiction: "EU ETS",
      status: "Compliant",
      score: 97,
      alerts: 0,
      lastCheck: "2 hours ago",
      nextAudit: "Dec 2024",
    },
    {
      jurisdiction: "California",
      status: "Compliant",
      score: 94,
      alerts: 1,
      lastCheck: "4 hours ago",
      nextAudit: "Jan 2025",
    },
    {
      jurisdiction: "RGGI",
      status: "Compliant",
      score: 99,
      alerts: 0,
      lastCheck: "1 hour ago",
      nextAudit: "Mar 2025",
    },
    {
      jurisdiction: "UK ETS",
      status: "Under Review",
      score: 87,
      alerts: 2,
      lastCheck: "6 hours ago",
      nextAudit: "Nov 2024",
    },
  ]);

  // Performance optimization
  const { shouldReduceAnimations } = usePerformance();

  // Memoized filter functions for better performance
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
            return (
              projectRegistry.includes("tuv") || projectRegistry.includes("sud")
            );
          case "dnv":
            return projectRegistry.includes("dnv");
          case "irec":
            return (
              projectRegistry.includes("irec") ||
              projectRegistry.includes("i-rec")
            );
          default:
            return true;
        }
      },
    }),
    []
  );

  // Use debounced filtering for better performance
  const filteredProjects = useDebouncedFilter(
    projects,
    {
      type: selectedFilter,
      registry: selectedRegistry,
    },
    filterFunctions,
    300 // 300ms debounce delay
  );

  // Initialize R2 data source and fetch real data on component mount
  useEffect(() => {
    const fetchRealData = async () => {
      setIsLoading(true);
      setDataLoaded(false);

      try {
        // For development, we use the local API proxy to avoid CORS issues
        // The proxy will fetch from the BlockEdge URL server-side
        const [transactions, blocks, stats, projectsData, projectStatsData] =
          await Promise.all([
            co2eApi.getMainPageTransactions(),
            co2eApi.getMainPageBlocks(),
            co2eApi.getStats(),
            co2eApi.getProjects(),
            co2eApi.getProjectStats(),
          ]);

        // Only update if we have valid data (not empty or zero values)
        if (projectsData && projectsData.length > 0) {
          setProjects(projectsData);
          setProjectStats(projectStatsData);
          setDataLoaded(true);

          // Update with real data if available
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
                value:
                  projectStatsData.total > 0
                    ? projectStatsData.total.toString()
                    : "—",
                change: "",
                trend: "up" as const,
                icon: Leaf,
                pulse: true,
                color: "from-teal-500 to-cyan-600",
              },
              {
                title: "CO2 Reduction",
                value:
                  projectStatsData.totalCO2Reduction &&
                    projectStatsData.totalCO2Reduction !== "0"
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
                value:
                  stats.total_blocks && stats.total_blocks !== "0"
                    ? stats.total_blocks
                    : realData.heroMetrics[2].value,
                change: "",
                trend: "up" as const,
                icon: Building2,
                pulse: true,
                color: "from-sky-500 to-indigo-600",
              },
              {
                title: "Standards",
                value:
                  projectStatsData.totalStandards > 0
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
        }
      } catch (error) {
        console.error("Error fetching real data:", error);
        // Keep loading state if there's an error
        setDataLoaded(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealData();
  }, []);

  // Animate metrics on load (optimized for performance)
  useEffect(() => {
    if (shouldReduceAnimations) {
      // Instantly set to 100% if animations are disabled
      setAnimatedMetrics(realData.heroMetrics.map(() => 100));
      return;
    }

    const interval = setInterval(() => {
      setAnimatedMetrics((prev) => {
        const newValues = [...prev];
        let allComplete = true;

        realData.heroMetrics.forEach((_, index) => {
          if (newValues[index] < 100) {
            newValues[index] += 10; // Faster increment for better performance
            if (newValues[index] > 100) newValues[index] = 100;
            allComplete = false;
          }
        });

        // Stop interval when all animations are complete
        if (allComplete) {
          clearInterval(interval);
        }

        return newValues;
      });
    }, 100); // Slower interval for better performance

    return () => clearInterval(interval);
  }, [realData.heroMetrics, shouldReduceAnimations]);

  // Simulate real-time data updates with CO2e chain data (optimized)
  const [marketDataState, setMarketDataState] = useState(
    co2eApi.generateMarketData()
  );

  useEffect(() => {
    if (shouldReduceAnimations) {
      // Skip real-time updates on slower devices
      return;
    }

    const interval = setInterval(() => {
      setMarketDataState((prevData) => {
        return prevData.map((item) => ({
          ...item,
          price: item.price * (1 + (Math.random() * 0.02 - 0.01)),
          volume: item.volume * (1 + (Math.random() * 0.03 - 0.015)),
        }));
      });
    }, 5000); // Slower updates for better performance

    return () => clearInterval(interval);
  }, [shouldReduceAnimations]);

  // 3D card effect refs
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const card4Ref = useRef(null);

  // Memoized handlers for better performance
  const handleViewProjectDetails = useCallback((project: any) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  }, []);

  const handleMouseMove = useCallback((e: any, ref: any) => {
    if (!ref.current) return;
    const card = ref.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);

  const handleMouseLeave = useCallback((ref: any) => {
    if (!ref.current) return;
    ref.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          CO2e Chain Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {realData.heroMetrics.map((metric, index) => (
            <motion.div
              key={index}
              ref={[card1Ref, card2Ref, card3Ref, card4Ref][index]}
              onMouseMove={(e) =>
                handleMouseMove(
                  e,
                  [card1Ref, card2Ref, card3Ref, card4Ref][index]
                )
              }
              onMouseLeave={() =>
                handleMouseLeave(
                  [card1Ref, card2Ref, card3Ref, card4Ref][index]
                )
              }
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-70" />
              <Card className="relative overflow-hidden bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:bg-slate-800/70">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
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
                            {animatedMetrics[index] === 100
                              ? metric.value
                              : "—"}
                          </motion.p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {metric.trend === "up" ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.5 + index * 0.1,
                              type: "spring",
                            }}
                          >
                            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                          </motion.div>
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-400" />
                        )}
                        <span
                          className={`text-sm font-medium ${metric.trend === "up"
                              ? "text-emerald-400"
                              : "text-red-400"
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
        </div>
      </motion.div>

      {/* Market Intelligence Center */}
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
                  Real-time blockchain metrics and transaction analysis for CO2e
                  Chain network
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-700 text-slate-300 hover:bg-slate-700/50"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-80">
                  <ChartContainer
                    config={{
                      price: {
                        label: "Price ($)",
                        color: "hsl(var(--chart-1))",
                      },
                      volume: {
                        label: "Volume",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={marketDataState}>
                        <defs>
                          <linearGradient
                            id="colorPrice"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#10b981"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#10b981"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="month" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke="#10b981"
                          fillOpacity={1}
                          fill="url(#colorPrice)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
              <div className="space-y-4">
                <Card className="bg-slate-800/80 border-slate-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-400">
                        Gas Price
                      </span>
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
                      <span className="text-xs text-emerald-400">
                        +15.5% (24h)
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="h-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={marketDataState.slice(-5)}>
                            <Line
                              type="monotone"
                              dataKey="price"
                              stroke="#10b981"
                              strokeWidth={2}
                              dot={false}
                              isAnimationActive={true}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/80 border-slate-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-400">
                        Network Utilization
                      </span>
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
                        <span>Bearish</span>
                        <span>Neutral</span>
                        <span>Bullish</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/80 border-slate-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-400">
                        Daily Transactions
                      </span>
                      <span className="text-lg font-bold text-white">
                        {realData.networkStats.dailyTransactions}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                      <span className="text-xs text-emerald-400">+8.2%</span>
                    </div>
                    <div className="mt-2">
                      <div className="h-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={marketDataState.slice(-5)}>
                            <defs>
                              <linearGradient
                                id="colorVolume"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#0d9488"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#0d9488"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <Area
                              type="monotone"
                              dataKey="volume"
                              stroke="#0d9488"
                              fill="url(#colorVolume)"
                              strokeWidth={2}
                              dot={false}
                              isAnimationActive={true}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl blur-xl" />
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/70 backdrop-blur-md border border-white/5 rounded-xl p-1">
              <TabsTrigger
                value="portfolio"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Global Portfolio</span>
                <span className="sm:hidden">Portfolio</span>
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Intelligence Analytics</span>
                <span className="sm:hidden">Analytics</span>
              </TabsTrigger>
              <TabsTrigger
                value="explorer"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Institutional Explorer</span>
                <span className="sm:hidden">Explorer</span>
              </TabsTrigger>
              <TabsTrigger
                value="compliance"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">
                  Compliance & Governance
                </span>
                <span className="sm:hidden">Compliance</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Global Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
              <CardHeader className="border-b border-slate-700/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Globe className="w-5 h-5 text-emerald-400" />
                      Project Command Center
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Enterprise project management with AI-powered
                      recommendations
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select
                      value={selectedFilter}
                      onValueChange={setSelectedFilter}
                    >
                      <SelectTrigger className="w-48 bg-slate-900/80 border-slate-700 text-slate-300">
                        <SelectValue placeholder="Filter projects" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-slate-300">
                        <SelectItem value="all">All Projects</SelectItem>
                        <SelectItem value="renewable">
                          Renewable Energy
                        </SelectItem>
                        <SelectItem value="forest">
                          Forest Conservation
                        </SelectItem>
                        <SelectItem value="industrial">
                          Industrial Efficiency
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={selectedRegistry}
                      onValueChange={setSelectedRegistry}
                    >
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
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-slate-700 text-slate-300 hover:bg-slate-700/50"
                    >
                      <Filter className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-slate-700 text-slate-300 hover:bg-slate-700/50"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading || (!dataLoaded && projects.length === 0) ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((index) => (
                      <Card
                        key={index}
                        className="bg-slate-800/80 border-slate-700/50"
                      >
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
                    {(filteredProjects.length > 0
                      ? filteredProjects.slice(0, 6)
                      : projects.slice(0, 6)
                    ).map((project, index) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        onViewDetails={handleViewProjectDetails}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Intelligence Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Predictive Carbon Pricing
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    ML-driven forecasting models
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-64">
                    <ChartContainer
                      config={{
                        predicted: {
                          label: "Predicted Price",
                          color: "hsl(var(--chart-1))",
                        },
                        actual: {
                          label: "Actual Price",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={marketDataState}>
                          <defs>
                            <linearGradient
                              id="colorPredicted"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#10b981"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#10b981"
                                stopOpacity={0}
                              />
                            </linearGradient>
                            <linearGradient
                              id="colorActual"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#0ea5e9"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#0ea5e9"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#334155"
                          />
                          <XAxis dataKey="month" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="price"
                            name="Actual"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            dot={{ r: 4, strokeWidth: 2 }}
                            activeDot={{ r: 6, strokeWidth: 2 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="sentiment"
                            name="Predicted"
                            stroke="#10b981"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ r: 4, strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="w-5 h-5 text-emerald-400" />
                    Institutional Flow Analysis
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Whale movements and accumulation patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center justify-between p-4 bg-emerald-900/30 border border-emerald-800/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                          className="w-2 h-2 bg-emerald-400 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-white">
                            Large Accumulation
                          </div>
                          <div className="text-sm text-emerald-300">
                            +$15M in carbon credits
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">BlackRock</div>
                        <div className="text-xs text-slate-400">
                          10 minutes ago
                        </div>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="flex items-center justify-between p-4 bg-orange-900/30 border border-orange-800/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                          className="w-2 h-2 bg-orange-400 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-white">
                            Distribution
                          </div>
                          <div className="text-sm text-orange-300">
                            -$8M in carbon credits
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">Vanguard</div>
                        <div className="text-xs text-slate-400">
                          25 minutes ago
                        </div>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="flex items-center justify-between p-4 bg-emerald-900/30 border border-emerald-800/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                          className="w-2 h-2 bg-emerald-400 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-white">
                            New Position
                          </div>
                          <div className="text-sm text-emerald-300">
                            +$12M in carbon credits
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">
                          State Street
                        </div>
                        <div className="text-xs text-slate-400">
                          42 minutes ago
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
              <CardHeader className="border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Target className="w-5 h-5 text-emerald-400" />
                      ESG Impact Attribution
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Third-party verified impact scoring across portfolios
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-slate-800/80 border border-slate-700/50 rounded-lg p-6 text-center"
                  >
                    <div className="relative mb-4">
                      <div className="w-24 h-24 mx-auto">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#1e293b"
                            strokeWidth="10"
                            strokeLinecap="round"
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray="282.7"
                            initial={{ strokeDashoffset: 282.7 }}
                            animate={{
                              strokeDashoffset: 282.7 * (1 - 94.2 / 100),
                            }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 1 }}
                          >
                            <div className="text-3xl font-bold text-emerald-400">
                              94.2
                            </div>
                            <div className="text-xs text-slate-400">
                              ESG Score
                            </div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-slate-800/80 border border-slate-700/50 rounded-lg p-6 text-center"
                  >
                    <div className="text-3xl font-bold text-emerald-400">
                      8.7M
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      Tons CO2 Reduced
                    </div>
                    <div className="text-xs text-emerald-400 mt-1">
                      +12% this quarter
                    </div>
                    <div className="mt-4 h-16">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={marketDataState}>
                          <defs>
                            <linearGradient
                              id="colorImpact"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#10b981"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#10b981"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="volume"
                            stroke="#10b981"
                            fill="url(#colorImpact)"
                            strokeWidth={2}
                            dot={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-slate-800/80 border border-slate-700/50 rounded-lg p-6 text-center"
                  >
                    <div className="text-3xl font-bold text-emerald-400">
                      156
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      SDG Alignment
                    </div>
                    <div className="text-xs text-emerald-400 mt-1">
                      15 of 17 goals
                    </div>
                    <div className="mt-4 flex flex-wrap justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                          className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white"
                        >
                          {i}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Institutional Explorer Tab */}
          <TabsContent value="explorer" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
              <CardHeader className="border-b border-slate-700/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Search className="w-5 h-5 text-emerald-400" />
                      Professional Transaction Interface
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Advanced query builder with natural language processing
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        placeholder="Search transactions, companies, or projects..."
                        className="w-full sm:w-80 pl-9 bg-slate-900/80 border-slate-700 text-slate-300 focus:border-emerald-500"
                      />
                    </div>
                    <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {realData.recentTransactions.map((tx, index) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-slate-800/80 border border-slate-700/50 rounded-lg hover:bg-slate-700/50 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-white">
                            {tx.hash.substring(0, 10)}...{tx.hash.slice(-4)}
                          </div>
                          <div className="text-sm text-slate-400">
                            {tx.type} •{" "}
                            {tx.from
                              ? `${tx.from.substring(0, 6)}...${tx.from.slice(
                                -4
                              )}`
                              : "Unknown"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">
                          {tx.amount}
                        </div>
                        <div className="text-sm text-slate-400">
                          {tx.timestamp}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            tx.status === "Success" ? "default" : "secondary"
                          }
                          className={
                            tx.status === "Success"
                              ? "bg-emerald-900/50 text-emerald-400 border-emerald-500/30"
                              : "bg-orange-900/50 text-orange-400 border-orange-500/30"
                          }
                        >
                          {tx.status}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    Whale Alert System
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Large institutional movements
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center gap-3 p-3 bg-red-900/30 border border-red-800/50 rounded-lg"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        className="w-2 h-2 bg-red-400 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white">
                          Large Sale Alert
                        </div>
                        <div className="text-sm text-red-300">
                          JPMorgan sold 500K tokens ($23M)
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">5m ago</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="flex items-center gap-3 p-3 bg-emerald-900/30 border border-emerald-800/50 rounded-lg"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        className="w-2 h-2 bg-emerald-400 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white">
                          Large Purchase Alert
                        </div>
                        <div className="text-sm text-emerald-300">
                          Microsoft bought 750K tokens ($35M)
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">12m ago</span>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    Cross-Chain Activity
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Multi-blockchain transaction monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      {
                        name: "Ethereum",
                        value: 75,
                        color: "from-blue-500 to-blue-600",
                      },
                      {
                        name: "Polygon",
                        value: 45,
                        color: "from-purple-500 to-purple-600",
                      },
                      {
                        name: "Binance Smart Chain",
                        value: 30,
                        color: "from-yellow-500 to-yellow-600",
                      },
                    ].map((chain, index) => (
                      <motion.div
                        key={chain.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full bg-gradient-to-r ${chain.color}`}
                          />
                          <span className="text-sm text-slate-300">
                            {chain.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${chain.value}%` }}
                              transition={{
                                duration: 1,
                                delay: 0.5 + index * 0.1,
                              }}
                              className={`h-full bg-gradient-to-r ${chain.color}`}
                            />
                          </div>
                          <span className="text-sm font-medium text-white w-8">
                            {chain.value}%
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compliance & Governance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  Regulatory Command Center
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time compliance monitoring across 47 jurisdictions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {complianceData.map((item, index) => (
                    <motion.div
                      key={item.jurisdiction}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="bg-slate-800/80 border-slate-700/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-white">
                              {item.jurisdiction}
                            </span>
                            <Badge
                              variant={
                                item.status === "Compliant"
                                  ? "default"
                                  : "secondary"
                              }
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
                              <span className="text-slate-400">
                                Compliance Score
                              </span>
                              <span className="font-medium text-white">
                                {item.score}%
                              </span>
                            </div>
                            <div className="relative">
                              <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.score}%` }}
                                  transition={{
                                    duration: 1,
                                    delay: 0.5 + index * 0.1,
                                  }}
                                  className={`h-full ${item.score >= 95
                                      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                                      : item.score >= 90
                                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                        : "bg-gradient-to-r from-red-500 to-red-600"
                                    }`}
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-400">
                                Active Alerts
                              </span>
                              <span
                                className={`font-medium ${item.alerts > 0
                                    ? "text-orange-400"
                                    : "text-emerald-400"
                                  }`}
                              >
                                {item.alerts}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Lock className="w-5 h-5 text-emerald-400" />
                    Automated Audit Trail
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Enterprise-grade security and compliance
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      {
                        name: "SOC 2 Type II",
                        status: "Certified",
                        icon: Award,
                      },
                      { name: "ISO 27001", status: "Certified", icon: Shield },
                      { name: "GDPR Compliance", status: "Active", icon: Lock },
                    ].map((cert, index) => (
                      <motion.div
                        key={cert.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-slate-800/80 border border-slate-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-900/50 rounded-lg flex items-center justify-center">
                            <cert.icon className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {cert.name}
                            </div>
                            <div className="text-sm text-slate-400">
                              {cert.status}
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-emerald-900/50 text-emerald-400 border-emerald-500/30">
                          Active
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <RefreshCw className="w-5 h-5 text-emerald-400" />
                    Third-Party Verification
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Big 4 accounting firm integration
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      {
                        name: "PwC Carbon Audit",
                        period: "Q4 2024 Review",
                        status: "Passed",
                      },
                      {
                        name: "KPMG ESG Verification",
                        period: "Annual Assessment",
                        status: "In Progress",
                      },
                      {
                        name: "Deloitte Risk Assessment",
                        period: "Quarterly Review",
                        status: "Scheduled",
                      },
                    ].map((audit, index) => (
                      <motion.div
                        key={audit.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-slate-800/80 border border-slate-700/50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-white">
                            {audit.name}
                          </div>
                          <div className="text-sm text-slate-400">
                            {audit.period}
                          </div>
                        </div>
                        <Badge
                          className={
                            audit.status === "Passed"
                              ? "bg-emerald-900/50 text-emerald-400 border-emerald-500/30"
                              : audit.status === "In Progress"
                                ? "bg-orange-900/50 text-orange-400 border-orange-500/30"
                                : "bg-slate-700/50 text-slate-400 border-slate-600/30"
                          }
                        >
                          {audit.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Project Details Modal */}
      {showProjectDetails && selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-700 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedProject.name}
                </h2>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className="text-slate-300 border-slate-600"
                  >
                    {selectedProject.methodology || "IREC"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-slate-300 border-slate-600"
                  >
                    {selectedProject.status || "Active"}
                  </Badge>
                </div>
                <p className="text-slate-400">{selectedProject.description}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowProjectDetails(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Project Location */}
              <div className="flex items-center gap-2 p-4 bg-slate-700/50 rounded-lg">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">
                  {selectedProject.location}
                </span>
              </div>

              {/* Debug Information - Remove in production */}
              <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-red-400 mb-2">Debug Info (Remove in production)</h4>
                <div className="text-xs text-slate-300 space-y-1">
                  <div>Token Address: {selectedProject.tokenAddress || "None"}</div>
                  <div>Cert Contract: {selectedProject.certContract || "None"}</div>
                  <div>_certContract: {(selectedProject as any)._certContract || "None"}</div>
                  <div>All Keys: {Object.keys(selectedProject).join(", ")}</div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400">Current Supply</div>
                  <div className="text-xl font-bold text-white">
                    {selectedProject.co2Reduction?.total
                      ? `${parseInt(
                        selectedProject.co2Reduction.total
                      ).toLocaleString()} Tokens`
                      : selectedProject.impact || " Tokens"}
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400">CO2 Reduction</div>
                  <div className="text-xl font-bold text-emerald-400">
                    {selectedProject.co2Reduction?.total
                      ? `${parseInt(
                        selectedProject.co2Reduction.total
                      ).toLocaleString()} tCO2e`
                      : selectedProject.impact || " tCO2e"}
                  </div>
                </div>

              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Project Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-slate-400">
                        Project Type
                      </span>
                      <p className="text-white">{selectedProject.type}</p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-400">Country</span>
                      <p className="text-white">
                        {selectedProject.country || "International"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-400">Registry</span>
                      <p className="text-white">
                        {selectedProject.registry || "Verified Registry"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-400">
                        Certification Body
                      </span>
                      <p className="text-white">
                        {selectedProject.certificationBody ||
                          "Verified Registry"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-slate-400">
                        Project Developer
                      </span>
                      <p className="text-white">
                        {selectedProject.projectDeveloper ||
                          "Project Developer"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Blockchain Contracts
                  </h3>
                  <div className="space-y-4">
                    {/* Token Contract */}
                    <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-700/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-emerald-400">
                          🪙 Token Contract (ERC-20)
                        </span>
                        <Badge variant="outline" className="bg-emerald-900/50 text-emerald-300 border-emerald-500/30">
                          Active
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-sm bg-slate-800/80 px-3 py-2 rounded-md text-emerald-300 font-mono flex-1 border border-emerald-700/30">
                          {selectedProject.tokenAddress || "0x..."}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              selectedProject.tokenAddress || ""
                            );
                            // Simple feedback - could be replaced with toast library
                            alert("Token contract address copied to clipboard!");
                          }}
                          className="h-9 w-9 p-0 border-emerald-600/50 hover:bg-emerald-800/30 hover:border-emerald-500"
                        >
                          <Copy className="w-4 h-4 text-emerald-400" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400">Total Supply</span>
                          <p className="text-emerald-300 font-medium">
                            {selectedProject.totalSupply || "1,000,000"} Tokens
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-400">Holders</span>
                          <p className="text-emerald-300 font-medium">
                            {selectedProject.holders || "156"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Certificate Contract */}
                    <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-700/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-blue-400">
                          📜 Certificate Contract (ERC-721)
                        </span>
                        <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-500/30">
                          Verified
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-sm bg-slate-800/80 px-3 py-2 rounded-md text-blue-300 font-mono flex-1 border border-blue-700/30">
                          {selectedProject.certContract || "No cert contract found"}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              selectedProject.certContract || ""
                            );
                            // Simple feedback - could be replaced with toast library
                            alert("Certificate contract address copied to clipboard!");
                          }}
                          className="h-9 w-9 p-0 border-blue-600/50 hover:bg-blue-800/30 hover:border-blue-500"
                        >
                          <Copy className="w-4 h-4 text-blue-400" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400">NFT Certificates</span>
                          <p className="text-blue-300 font-medium">
                            {selectedProject.certificates || "1"} NFT
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-400">Transfers</span>
                          <p className="text-blue-300 font-medium">
                            {selectedProject.transfers || "1,247"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Compliance Standards
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(selectedProject.compliance || ["EU Taxonomy", "TCFD"]).map(
                    (standard: string) => (
                      <Badge
                        key={standard}
                        variant="outline"
                        className="bg-slate-700/50 text-slate-300 border-slate-600"
                      >
                        {standard}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  onClick={() => viewTokenOnBlockchain(selectedProject)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Token on CO2e Chain
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  onClick={() => viewCertOnBlockchain(selectedProject)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Cert on CO2e Chain
                </Button>                
                <Button
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-700/50"
                >

                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
