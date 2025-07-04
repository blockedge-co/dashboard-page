"use client";

/**
 * DEPRECATED: This file is kept for compatibility only.
 * Use tokenization-metrics-enhanced.tsx for real data integration.
 * 
 * This legacy component previously used mock data generation.
 * All functionality has been moved to the enhanced version which
 * connects to real blockchain data sources.
 */

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
  TrendingUpIcon,
  Coins,
  MapPin,
  Users,
  Award,
  RefreshCw,
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
} from "recharts";
import { getChartColor, renderChartGradients, chartStyleProps } from "@/lib/chart-config";
import { AdvancedTokenizationAnalytics } from "./advanced-tokenization-analytics";

// Types for tokenization metrics
interface TokenizationMetrics {
  totalTokenized: string;
  tokenizationRate: number;
  averageProjectSize: string;
  successfulTokenizations: number;
  pendingTokenizations: number;
  failedTokenizations: number;
  tokenizationVelocity: number; // credits/day
  costPerTokenization: number;
  timeToCompletion: number; // days
  qualityScore: number; // percentage
  regionalDistribution: RegionalData[];
  methodBreakdown: MethodData[];
  trendsData: TrendData[];
  efficiencyData: EfficiencyData[];
  statusData: StatusData[];
}

interface RegionalData {
  region: string;
  value: number;
  percentage: number;
  projects: number;
  color: string;
}

interface MethodData {
  method: string;
  count: number;
  percentage: number;
  avgTime: number;
  successRate: number;
}

interface TrendData {
  date: string;
  tokenized: number;
  velocity: number;
  quality: number;
  cost: number;
}

interface EfficiencyData {
  metric: string;
  current: number;
  target: number;
  improvement: number;
}

interface StatusData {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

// This file is deprecated - use tokenization-metrics-enhanced.tsx instead
// Kept for compatibility but no longer contains mock data

// Empty function to maintain compatibility
const generateTokenizationMetrics = (): TokenizationMetrics => {
  return {
    totalTokenized: "0",
    tokenizationRate: 0,
    averageProjectSize: "0",
    successfulTokenizations: 0,
    pendingTokenizations: 0,
    failedTokenizations: 0,
    tokenizationVelocity: 0,
    costPerTokenization: 0,
    timeToCompletion: 0,
    qualityScore: 0,
    regionalDistribution: [],
    methodBreakdown: [],
    trendsData: [],
    efficiencyData: [],
    statusData: [],
  };
};

// Individual metric components
const TokenizationOverviewCard = memo(({ metrics }: { metrics: TokenizationMetrics }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[
      {
        title: "Total Credits Tokenized",
        value: metrics.totalTokenized,
        change: "+12.5%",
        trend: "up",
        icon: Coins,
        color: "from-emerald-500 to-teal-600",
      },
      {
        title: "Tokenization Rate",
        value: `${metrics.tokenizationRate}%`,
        change: "+2.3%",
        trend: "up",
        icon: TrendingUp,
        color: "from-blue-500 to-cyan-600",
      },
      {
        title: "Avg Project Size",
        value: metrics.averageProjectSize,
        change: "+8.7%",
        trend: "up",
        icon: Target,
        color: "from-purple-500 to-indigo-600",
      },
      {
        title: "Daily Velocity",
        value: `${metrics.tokenizationVelocity.toLocaleString()}`,
        change: "+15.2%",
        trend: "up",
        icon: Zap,
        color: "from-orange-500 to-red-600",
      },
    ].map((metric, index) => (
      <motion.div
        key={metric.title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400">{metric.title}</p>
                <p className="text-3xl font-bold text-white mt-2">{metric.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    metric.trend === "up" ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {metric.change}
                  </span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${metric.color} flex items-center justify-center shadow-lg`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
));

const TokenizationVelocityChart = memo(({ data }: { data: TrendData[] }) => (
  <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
    <CardHeader className="border-b border-slate-700/50">
      <CardTitle className="flex items-center gap-2 text-white">
        <Activity className="w-5 h-5 text-emerald-400" />
        Tokenization Velocity Trends
      </CardTitle>
      <CardDescription className="text-slate-400">
        Real-time tracking of tokenization speed and volume
      </CardDescription>
    </CardHeader>
    <CardContent className="p-6">
      <div className="h-80">
        <ChartContainer config={{ velocity: { label: "Velocity", color: "#10b981" } }} className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              {renderChartGradients(["emerald", "blue"])}
              <CartesianGrid 
                strokeDasharray={chartStyleProps.grid.strokeDasharray}
                stroke={chartStyleProps.grid.stroke}
                strokeOpacity={chartStyleProps.grid.strokeOpacity}
              />
              <XAxis 
                dataKey="date" 
                stroke={chartStyleProps.axis.stroke}
                fontSize={chartStyleProps.axis.fontSize}
                fill={chartStyleProps.axis.fill}
              />
              <YAxis 
                stroke={chartStyleProps.axis.stroke}
                fontSize={chartStyleProps.axis.fontSize}
                fill={chartStyleProps.axis.fill}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="tokenized"
                name="Credits Tokenized"
                stroke={getChartColor("emerald")}
                fill="url(#emeraldGradient)"
                strokeWidth={3}
                dot={{ fill: getChartColor("emerald"), strokeWidth: 2, r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="velocity"
                name="Daily Velocity"
                stroke={getChartColor("blue")}
                fill="url(#blueGradient)"
                strokeWidth={3}
                dot={{ fill: getChartColor("blue"), strokeWidth: 2, r: 4 }}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </CardContent>
  </Card>
));

const RegionalDistributionChart = memo(({ data }: { data: RegionalData[] }) => (
  <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
    <CardHeader className="border-b border-slate-700/50">
      <CardTitle className="flex items-center gap-2 text-white">
        <Globe className="w-5 h-5 text-emerald-400" />
        Regional Tokenization Distribution
      </CardTitle>
      <CardDescription className="text-slate-400">
        Geographic distribution of tokenized carbon credits
      </CardDescription>
    </CardHeader>
    <CardContent className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-800/95 border border-slate-700/50 rounded-lg p-3 backdrop-blur-sm">
                        <div className="text-white font-medium">{data.region}</div>
                        <div className="text-slate-300 text-sm">
                          {data.value.toLocaleString()} credits ({data.percentage}%)
                        </div>
                        <div className="text-slate-400 text-xs">
                          {data.projects} projects
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {data.map((region, index) => (
            <motion.div
              key={region.region}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-slate-800/80 border border-slate-700/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: region.color }}
                />
                <div>
                  <div className="text-white font-medium">{region.region}</div>
                  <div className="text-slate-400 text-sm">{region.projects} projects</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{region.percentage}%</div>
                <div className="text-slate-400 text-sm">{region.value.toLocaleString()}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
));

const TokenizationMethodBreakdown = memo(({ data }: { data: MethodData[] }) => (
  <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
    <CardHeader className="border-b border-slate-700/50">
      <CardTitle className="flex items-center gap-2 text-white">
        <BarChart3 className="w-5 h-5 text-emerald-400" />
        Tokenization Method Analysis
      </CardTitle>
      <CardDescription className="text-slate-400">
        Performance metrics by tokenization method
      </CardDescription>
    </CardHeader>
    <CardContent className="p-6">
      <div className="space-y-4">
        {data.map((method, index) => (
          <motion.div
            key={method.method}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-4 bg-slate-800/80 border border-slate-700/50 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge 
                  className={`${
                    index === 0 ? "bg-emerald-900/50 text-emerald-400 border-emerald-500/30" :
                    index === 1 ? "bg-blue-900/50 text-blue-400 border-blue-500/30" :
                    "bg-orange-900/50 text-orange-400 border-orange-500/30"
                  }`}
                >
                  {method.method}
                </Badge>
                <span className="text-white font-medium">{method.count} projects</span>
              </div>
              <span className="text-slate-400 text-sm">{method.percentage}%</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-slate-400">Avg Time</div>
                <div className="text-white font-medium">{method.avgTime} days</div>
              </div>
              <div>
                <div className="text-slate-400">Success Rate</div>
                <div className="text-emerald-400 font-medium">{method.successRate}%</div>
              </div>
              <div>
                <div className="text-slate-400">Efficiency</div>
                <div className={`font-medium ${
                  method.successRate > 95 ? "text-emerald-400" : 
                  method.successRate > 90 ? "text-yellow-400" : "text-orange-400"
                }`}>
                  {method.successRate > 95 ? "Excellent" : 
                   method.successRate > 90 ? "Good" : "Fair"}
                </div>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Progress</span>
                <span>{method.percentage}%</span>
              </div>
              <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${method.percentage}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  className={`h-full ${
                    index === 0 ? "bg-gradient-to-r from-emerald-500 to-teal-500" :
                    index === 1 ? "bg-gradient-to-r from-blue-500 to-cyan-500" :
                    "bg-gradient-to-r from-orange-500 to-red-500"
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

const EfficiencyMetricsPanel = memo(({ data }: { data: EfficiencyData[] }) => (
  <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
    <CardHeader className="border-b border-slate-700/50">
      <CardTitle className="flex items-center gap-2 text-white">
        <Target className="w-5 h-5 text-emerald-400" />
        Tokenization Efficiency Metrics
      </CardTitle>
      <CardDescription className="text-slate-400">
        Performance vs targets and improvement tracking
      </CardDescription>
    </CardHeader>
    <CardContent className="p-6">
      <div className="space-y-6">
        {data.map((metric, index) => (
          <motion.div
            key={metric.metric}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">{metric.metric}</span>
              <div className="flex items-center gap-4">
                <span className="text-slate-400 text-sm">
                  {metric.current}% / {metric.target}%
                </span>
                <Badge className={`${
                  metric.improvement > 10 ? "bg-emerald-900/50 text-emerald-400 border-emerald-500/30" :
                  metric.improvement > 5 ? "bg-yellow-900/50 text-yellow-400 border-yellow-500/30" :
                  "bg-orange-900/50 text-orange-400 border-orange-500/30"
                }`}>
                  +{metric.improvement}%
                </Badge>
              </div>
            </div>
            
            <div className="relative">
              <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(metric.current / metric.target) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  className={`h-full ${
                    metric.current >= metric.target ? "bg-gradient-to-r from-emerald-500 to-teal-500" :
                    metric.current >= metric.target * 0.8 ? "bg-gradient-to-r from-yellow-500 to-orange-500" :
                    "bg-gradient-to-r from-orange-500 to-red-500"
                  }`}
                />
              </div>
              <div 
                className="absolute top-0 w-1 h-3 bg-white/50"
                style={{ left: `${(metric.target / 100) * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-slate-400">
              <span>Current: {metric.current}%</span>
              <span>Target: {metric.target}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </CardContent>
  </Card>
));

const QualityAndCostMetrics = memo(({ metrics }: { metrics: TokenizationMetrics }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
      <CardHeader className="border-b border-slate-700/50">
        <CardTitle className="flex items-center gap-2 text-white">
          <Award className="w-5 h-5 text-emerald-400" />
          Quality & Success Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="251.2"
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 * (1 - metrics.qualityScore / 100) }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">
                    {metrics.qualityScore}%
                  </div>
                  <div className="text-xs text-slate-400">Quality Score</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-slate-800/80 border border-slate-700/50 rounded-lg">
              <div className="text-emerald-400 text-xl font-bold">{metrics.successfulTokenizations}</div>
              <div className="text-slate-400 text-xs">Successful</div>
            </div>
            <div className="p-3 bg-slate-800/80 border border-slate-700/50 rounded-lg">
              <div className="text-yellow-400 text-xl font-bold">{metrics.pendingTokenizations}</div>
              <div className="text-slate-400 text-xs">Pending</div>
            </div>
            <div className="p-3 bg-slate-800/80 border border-slate-700/50 rounded-lg">
              <div className="text-red-400 text-xl font-bold">{metrics.failedTokenizations}</div>
              <div className="text-slate-400 text-xs">Failed</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
      <CardHeader className="border-b border-slate-700/50">
        <CardTitle className="flex items-center gap-2 text-white">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          Cost & Time Efficiency
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-slate-800/80 border border-slate-700/50 rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">
                ${metrics.costPerTokenization}
              </div>
              <div className="text-slate-400 text-sm">Cost per Tokenization</div>
              <div className="text-emerald-400 text-xs mt-1">-15% vs last month</div>
            </div>
            <div className="text-center p-4 bg-slate-800/80 border border-slate-700/50 rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">
                {metrics.timeToCompletion}d
              </div>
              <div className="text-slate-400 text-sm">Avg Completion Time</div>
              <div className="text-emerald-400 text-xs mt-1">-22% vs last month</div>
            </div>
          </div>
          
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.trendsData.slice(-7)}>
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke={getChartColor("emerald")}
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
));

// Main component - DEPRECATED: Use tokenization-metrics-enhanced.tsx instead
export const TokenizationMetrics = memo(function TokenizationMetrics() {
  // DEPRECATED: This component is replaced by tokenization-metrics-enhanced.tsx
  // which uses real data services instead of simulated data.
  
  return (
    <div className="flex items-center justify-center h-64 bg-slate-800/50 rounded-lg border border-slate-700">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-2">Component Deprecated</h3>
        <p className="text-slate-400 mb-4">
          This component has been replaced by tokenization-metrics-enhanced.tsx
        </p>
        <p className="text-slate-500 text-sm">
          Please use the enhanced version for real data integration.
        </p>
      </div>
    </div>
  );
});

export default TokenizationMetrics;