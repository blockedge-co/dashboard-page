"use client";

import { useState, useEffect, useMemo, memo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Target,
  BarChart3,
  Zap,
  DollarSign,
  Globe,
  CheckCircle,
  Timer,
  AlertCircle,
  Users,
  Award,
  RefreshCw,
  Calendar,
  Layers,
  Settings,
  Database,
  Network,
  Cpu,
  HardDrive,
  Monitor,
  MoreVertical,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Scatter,
  ScatterChart,
  ReferenceLine,
} from "recharts";
import { getChartColor, renderChartGradients, chartStyleProps } from "@/lib/chart-config";

// Advanced analytics types
interface AdvancedTokenizationAnalytics {
  performanceMetrics: PerformanceMetric[];
  costAnalysis: CostAnalysisData[];
  qualityTrends: QualityTrendData[];
  automationMetrics: AutomationMetric[];
  resourceUtilization: ResourceData[];
  predictiveAnalytics: PredictiveData[];
  benchmarkComparison: BenchmarkData[];
  alertsAndNotifications: AlertData[];
  throughputAnalysis: ThroughputData[];
  errorAnalysis: ErrorData[];
}

interface PerformanceMetric {
  name: string;
  current: number;
  target: number;
  benchmark: number;
  trend: "up" | "down" | "stable";
  unit: string;
  category: "speed" | "quality" | "cost" | "reliability";
}

interface CostAnalysisData {
  period: string;
  totalCost: number;
  costPerCredit: number;
  operationalCost: number;
  complianceCost: number;
  technologyCost: number;
  roi: number;
}

interface QualityTrendData {
  date: string;
  overallQuality: number;
  dataAccuracy: number;
  processCompliance: number;
  verificationScore: number;
  customerSatisfaction: number;
}

interface AutomationMetric {
  process: string;
  automationLevel: number;
  timeSaved: number;
  errorReduction: number;
  costSaving: number;
  status: "implemented" | "in-progress" | "planned";
}

interface ResourceData {
  resource: string;
  utilization: number;
  capacity: number;
  efficiency: number;
  cost: number;
  prediction: number;
}

interface PredictiveData {
  metric: string;
  current: number;
  predicted1Month: number;
  predicted3Month: number;
  predicted6Month: number;
  confidence: number;
}

interface BenchmarkData {
  metric: string;
  ourValue: number;
  industryAverage: number;
  bestInClass: number;
  percentile: number;
}

interface AlertData {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  description: string;
  timestamp: string;
  status: "active" | "acknowledged" | "resolved";
}

interface ThroughputData {
  hour: string;
  successful: number;
  failed: number;
  pending: number;
  avgProcessingTime: number;
}

interface ErrorData {
  category: string;
  count: number;
  percentage: number;
  avgResolutionTime: number;
  impact: "high" | "medium" | "low";
}

// Mock data generation
const generateAdvancedAnalytics = (): AdvancedTokenizationAnalytics => {
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);
  const days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  return {
    performanceMetrics: [
      { name: "Processing Speed", current: 94.2, target: 95.0, benchmark: 88.5, trend: "up", unit: "%", category: "speed" },
      { name: "Success Rate", current: 98.7, target: 99.0, benchmark: 95.2, trend: "up", unit: "%", category: "quality" },
      { name: "Cost Efficiency", current: 87.8, target: 90.0, benchmark: 82.1, trend: "up", unit: "%", category: "cost" },
      { name: "SLA Compliance", current: 99.2, target: 99.5, benchmark: 96.8, trend: "stable", unit: "%", category: "reliability" },
      { name: "Error Rate", current: 0.8, target: 0.5, benchmark: 2.1, trend: "down", unit: "%", category: "quality" },
      { name: "Resource Utilization", current: 76.4, target: 80.0, benchmark: 71.3, trend: "up", unit: "%", category: "speed" },
    ],
    costAnalysis: days.slice(-12).map((period, i) => ({
      period,
      totalCost: 15000 + Math.sin(i / 3) * 2000 + Math.random() * 1000,
      costPerCredit: 2.5 + Math.sin(i / 5) * 0.3 + Math.random() * 0.2,
      operationalCost: 8000 + Math.random() * 1000,
      complianceCost: 3000 + Math.random() * 500,
      technologyCost: 4000 + Math.random() * 800,
      roi: 185 + Math.sin(i / 4) * 15 + Math.random() * 10,
    })),
    qualityTrends: days.map((date, i) => ({
      date,
      overallQuality: 95 + Math.sin(i / 7) * 3 + Math.random() * 2,
      dataAccuracy: 97 + Math.sin(i / 5) * 2 + Math.random() * 1,
      processCompliance: 94 + Math.sin(i / 6) * 4 + Math.random() * 2,
      verificationScore: 96 + Math.sin(i / 8) * 3 + Math.random() * 1.5,
      customerSatisfaction: 92 + Math.sin(i / 4) * 5 + Math.random() * 3,
    })),
    automationMetrics: [
      { process: "Data Validation", automationLevel: 92, timeSaved: 48, errorReduction: 78, costSaving: 35000, status: "implemented" },
      { process: "Document Verification", automationLevel: 85, timeSaved: 36, errorReduction: 65, costSaving: 28000, status: "implemented" },
      { process: "Compliance Checking", automationLevel: 78, timeSaved: 42, errorReduction: 82, costSaving: 41000, status: "in-progress" },
      { process: "Report Generation", automationLevel: 45, timeSaved: 24, errorReduction: 35, costSaving: 15000, status: "planned" },
    ],
    resourceUtilization: [
      { resource: "CPU", utilization: 72, capacity: 100, efficiency: 94, cost: 2400, prediction: 78 },
      { resource: "Memory", utilization: 68, capacity: 100, efficiency: 91, cost: 1800, prediction: 74 },
      { resource: "Storage", utilization: 45, capacity: 100, efficiency: 88, cost: 900, prediction: 52 },
      { resource: "Network", utilization: 82, capacity: 100, efficiency: 96, cost: 1200, prediction: 85 },
      { resource: "Database", utilization: 76, capacity: 100, efficiency: 92, cost: 3200, prediction: 82 },
    ],
    predictiveAnalytics: [
      { metric: "Daily Volume", current: 15420, predicted1Month: 16800, predicted3Month: 18500, predicted6Month: 21200, confidence: 87 },
      { metric: "Cost per Credit", current: 2.45, predicted1Month: 2.32, predicted3Month: 2.18, predicted6Month: 2.05, confidence: 83 },
      { metric: "Success Rate", current: 98.7, predicted1Month: 98.9, predicted3Month: 99.1, predicted6Month: 99.3, confidence: 91 },
      { metric: "Processing Time", current: 3.2, predicted1Month: 3.0, predicted3Month: 2.8, predicted6Month: 2.5, confidence: 89 },
    ],
    benchmarkComparison: [
      { metric: "Processing Speed", ourValue: 94.2, industryAverage: 88.5, bestInClass: 97.8, percentile: 78 },
      { metric: "Cost Efficiency", ourValue: 87.8, industryAverage: 82.1, bestInClass: 93.5, percentile: 71 },
      { metric: "Quality Score", ourValue: 97.8, industryAverage: 94.2, bestInClass: 99.1, percentile: 85 },
      { metric: "Automation Level", ourValue: 76.4, industryAverage: 68.3, bestInClass: 89.7, percentile: 82 },
    ],
    alertsAndNotifications: [
      { id: "1", type: "warning", title: "High Processing Load", description: "Processing queue is above 85% capacity", timestamp: "2 minutes ago", status: "active" },
      { id: "2", type: "info", title: "Scheduled Maintenance", description: "System maintenance scheduled for tonight", timestamp: "1 hour ago", status: "acknowledged" },
      { id: "3", type: "critical", title: "Quality Score Drop", description: "Quality score dropped below threshold", timestamp: "3 hours ago", status: "resolved" },
    ],
    throughputAnalysis: hours.map((hour, i) => ({
      hour,
      successful: 450 + Math.sin(i / 6) * 150 + Math.random() * 100,
      failed: 5 + Math.random() * 10,
      pending: 15 + Math.random() * 20,
      avgProcessingTime: 3.2 + Math.sin(i / 8) * 0.8 + Math.random() * 0.5,
    })),
    errorAnalysis: [
      { category: "Validation Errors", count: 23, percentage: 45.2, avgResolutionTime: 2.4, impact: "medium" },
      { category: "Network Timeouts", count: 12, percentage: 23.5, avgResolutionTime: 1.2, impact: "low" },
      { category: "Data Format Issues", count: 8, percentage: 15.7, avgResolutionTime: 3.8, impact: "high" },
      { category: "System Errors", count: 5, percentage: 9.8, avgResolutionTime: 4.5, impact: "high" },
      { category: "Authentication Failures", count: 3, percentage: 5.9, avgResolutionTime: 0.8, impact: "medium" },
    ],
  };
};

// Individual components
const PerformanceMetricsGrid = memo(({ metrics }: { metrics: PerformanceMetric[] }) => (
  <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
    <CardHeader className="border-b border-slate-700/50">
      <CardTitle className="flex items-center gap-2 text-white">
        <Monitor className="w-5 h-5 text-emerald-400" />
        Performance Metrics Dashboard
      </CardTitle>
      <CardDescription className="text-slate-400">
        Real-time performance tracking against targets and industry benchmarks
      </CardDescription>
    </CardHeader>
    <CardContent className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 bg-slate-800/80 border border-slate-700/50 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  metric.trend === "up" ? "bg-emerald-400" :
                  metric.trend === "down" ? "bg-red-400" : "bg-yellow-400"
                }`} />
                <span className="text-white font-medium text-sm">{metric.name}</span>
              </div>
              <Badge className={`${
                metric.category === "speed" ? "bg-blue-900/50 text-blue-400 border-blue-500/30" :
                metric.category === "quality" ? "bg-emerald-900/50 text-emerald-400 border-emerald-500/30" :
                metric.category === "cost" ? "bg-orange-900/50 text-orange-400 border-orange-500/30" :
                "bg-purple-900/50 text-purple-400 border-purple-500/30"
              }`}>
                {metric.category}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">{metric.current}{metric.unit}</span>
                {metric.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : metric.trend === "down" ? (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                ) : (
                  <Activity className="w-4 h-4 text-yellow-400" />
                )}
              </div>
              
              <div className="text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Target: {metric.target}{metric.unit}</span>
                  <span>Industry: {metric.benchmark}{metric.unit}</span>
                </div>
                
                <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((metric.current / metric.target) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className={`h-full ${
                      metric.current >= metric.target ? "bg-gradient-to-r from-emerald-500 to-teal-500" :
                      metric.current >= metric.target * 0.8 ? "bg-gradient-to-r from-yellow-500 to-orange-500" :
                      "bg-gradient-to-r from-orange-500 to-red-500"
                    }`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </CardContent>
  </Card>
));

const CostAnalysisChart = memo(({ data }: { data: CostAnalysisData[] }) => (
  <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
    <CardHeader className="border-b border-slate-700/50">
      <CardTitle className="flex items-center gap-2 text-white">
        <DollarSign className="w-5 h-5 text-emerald-400" />
        Cost Analysis & ROI Tracking
      </CardTitle>
      <CardDescription className="text-slate-400">
        Comprehensive cost breakdown and return on investment trends
      </CardDescription>
    </CardHeader>
    <CardContent className="p-6">
      <div className="h-80">
        <ChartContainer 
          config={{
            totalCost: { label: "Total Cost", color: "#3b82f6" },
            roi: { label: "ROI %", color: "#10b981" }
          }} 
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid 
                strokeDasharray={chartStyleProps.grid.strokeDasharray}
                stroke={chartStyleProps.grid.stroke}
                strokeOpacity={chartStyleProps.grid.strokeOpacity}
              />
              <XAxis 
                dataKey="period" 
                stroke={chartStyleProps.axis.stroke}
                fontSize={chartStyleProps.axis.fontSize}
              />
              <YAxis 
                yAxisId="cost"
                stroke={chartStyleProps.axis.stroke}
                fontSize={chartStyleProps.axis.fontSize}
              />
              <YAxis 
                yAxisId="roi"
                orientation="right"
                stroke={chartStyleProps.axis.stroke}
                fontSize={chartStyleProps.axis.fontSize}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar yAxisId="cost" dataKey="operationalCost" stackId="a" fill={getChartColor("blue")} name="Operational" />
              <Bar yAxisId="cost" dataKey="complianceCost" stackId="a" fill={getChartColor("violet")} name="Compliance" />
              <Bar yAxisId="cost" dataKey="technologyCost" stackId="a" fill={getChartColor("indigo")} name="Technology" />
              <Line yAxisId="roi" type="monotone" dataKey="roi" stroke={getChartColor("emerald")} strokeWidth={3} name="ROI %" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </CardContent>
  </Card>
));

const QualityTrendsChart = memo(({ data }: { data: QualityTrendData[] }) => (
  <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
    <CardHeader className="border-b border-slate-700/50">
      <CardTitle className="flex items-center gap-2 text-white">
        <Award className="w-5 h-5 text-emerald-400" />
        Quality Trends Analysis
      </CardTitle>
      <CardDescription className="text-slate-400">
        Multi-dimensional quality metrics and customer satisfaction tracking
      </CardDescription>
    </CardHeader>
    <CardContent className="p-6">
      <div className="h-80">
        <ChartContainer 
          config={{
            overallQuality: { label: "Overall Quality", color: "#10b981" },
            dataAccuracy: { label: "Data Accuracy", color: "#3b82f6" },
            processCompliance: { label: "Process Compliance", color: "#8b5cf6" },
            verificationScore: { label: "Verification Score", color: "#f59e0b" },
            customerSatisfaction: { label: "Customer Satisfaction", color: "#ef4444" }
          }} 
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid 
                strokeDasharray={chartStyleProps.grid.strokeDasharray}
                stroke={chartStyleProps.grid.stroke}
                strokeOpacity={chartStyleProps.grid.strokeOpacity}
              />
              <XAxis 
                dataKey="date" 
                stroke={chartStyleProps.axis.stroke}
                fontSize={chartStyleProps.axis.fontSize}
              />
              <YAxis 
                domain={[85, 100]}
                stroke={chartStyleProps.axis.stroke}
                fontSize={chartStyleProps.axis.fontSize}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="overallQuality" stroke={getChartColor("emerald")} strokeWidth={3} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="dataAccuracy" stroke={getChartColor("blue")} strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="processCompliance" stroke={getChartColor("violet")} strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="verificationScore" stroke={getChartColor("sky")} strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="customerSatisfaction" stroke={getChartColor("teal")} strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </CardContent>
  </Card>
));

const AutomationProgress = memo(({ metrics }: { metrics: AutomationMetric[] }) => (
  <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
    <CardHeader className="border-b border-slate-700/50">
      <CardTitle className="flex items-center gap-2 text-white">
        <Settings className="w-5 h-5 text-emerald-400" />
        Automation Progress & Impact
      </CardTitle>
      <CardDescription className="text-slate-400">
        Process automation levels and efficiency gains
      </CardDescription>
    </CardHeader>
    <CardContent className="p-6">
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.process}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-4 bg-slate-800/80 border border-slate-700/50 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-white font-medium">{metric.process}</span>
                <Badge className={`${
                  metric.status === "implemented" ? "bg-emerald-900/50 text-emerald-400 border-emerald-500/30" :
                  metric.status === "in-progress" ? "bg-yellow-900/50 text-yellow-400 border-yellow-500/30" :
                  "bg-slate-700/50 text-slate-400 border-slate-600/30"
                }`}>
                  {metric.status}
                </Badge>
              </div>
              <span className="text-emerald-400 font-bold text-lg">{metric.automationLevel}%</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
              <div>
                <div className="text-slate-400">Time Saved</div>
                <div className="text-white font-medium">{metric.timeSaved}h/week</div>
              </div>
              <div>
                <div className="text-slate-400">Error Reduction</div>
                <div className="text-emerald-400 font-medium">{metric.errorReduction}%</div>
              </div>
              <div>
                <div className="text-slate-400">Cost Saving</div>
                <div className="text-white font-medium">${metric.costSaving.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="relative">
              <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.automationLevel}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  className={`h-full ${
                    metric.status === "implemented" ? "bg-gradient-to-r from-emerald-500 to-teal-500" :
                    metric.status === "in-progress" ? "bg-gradient-to-r from-yellow-500 to-orange-500" :
                    "bg-gradient-to-r from-slate-600 to-slate-500"
                  }`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </CardContent>
  </Card>
));

// Main component
export const AdvancedTokenizationAnalytics = memo(function AdvancedTokenizationAnalytics() {
  const [analytics, setAnalytics] = useState<AdvancedTokenizationAnalytics>(generateAdvancedAnalytics());
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(generateAdvancedAnalytics());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAnalytics(generateAdvancedAnalytics());
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Advanced Tokenization Analytics</h2>
          <p className="text-slate-400">Deep insights and predictive analytics for tokenization operations</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32 bg-slate-800/80 border-slate-700 text-slate-300">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-slate-300">
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <PerformanceMetricsGrid metrics={analytics.performanceMetrics} />

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CostAnalysisChart data={analytics.costAnalysis} />
        <QualityTrendsChart data={analytics.qualityTrends} />
      </div>

      {/* Automation and Resource Utilization */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AutomationProgress metrics={analytics.automationMetrics} />
        
        <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
          <CardHeader className="border-b border-slate-700/50">
            <CardTitle className="flex items-center gap-2 text-white">
              <Database className="w-5 h-5 text-emerald-400" />
              Resource Utilization
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {analytics.resourceUtilization.map((resource, index) => (
                <div key={resource.resource} className="flex items-center justify-between p-3 bg-slate-800/80 border border-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                      {resource.resource === "CPU" && <Cpu className="w-4 h-4 text-emerald-400" />}
                      {resource.resource === "Memory" && <HardDrive className="w-4 h-4 text-blue-400" />}
                      {resource.resource === "Storage" && <Database className="w-4 h-4 text-purple-400" />}
                      {resource.resource === "Network" && <Network className="w-4 h-4 text-orange-400" />}
                      {resource.resource === "Database" && <Layers className="w-4 h-4 text-red-400" />}
                    </div>
                    <div>
                      <div className="text-white font-medium">{resource.resource}</div>
                      <div className="text-slate-400 text-sm">{resource.utilization}% / {resource.capacity}%</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">${resource.cost}</div>
                    <div className="text-slate-400 text-sm">{resource.efficiency}% eff.</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
});

export default AdvancedTokenizationAnalytics;