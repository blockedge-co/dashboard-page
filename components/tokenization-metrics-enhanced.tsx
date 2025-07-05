'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Coins, 
  TrendingUp, 
  Database, 
  Target, 
  Activity,
  Zap,
  RefreshCw,
  Download,
  ArrowUpRight,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  LineChart as RechartsLineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { cn } from '@/lib/utils';

interface TokenizationMetricsProps {
  className?: string;
}

// Tokenization growth data
const tokenizationGrowthData = [
  { month: 'Jan', totalTokenized: 1850, newProjects: 45, totalSupply: 185000000, marketCap: 2.31 },
  { month: 'Feb', totalTokenized: 2120, newProjects: 62, totalSupply: 212000000, marketCap: 2.65 },
  { month: 'Mar', totalTokenized: 2480, newProjects: 78, totalSupply: 248000000, marketCap: 3.10 },
  { month: 'Apr', totalTokenized: 2850, newProjects: 89, totalSupply: 285000000, marketCap: 3.56 },
  { month: 'May', totalTokenized: 3290, newProjects: 105, totalSupply: 329000000, marketCap: 4.11 },
  { month: 'Jun', totalTokenized: 3780, newProjects: 124, totalSupply: 378000000, marketCap: 4.73 }
];

// Token supply utilization data
const supplyUtilizationData = [
  { category: 'Available', amount: 248500000, percentage: 65.8, color: '#10b981' },
  { category: 'Retired', amount: 89200000, percentage: 23.6, color: '#0ea5e9' },
  { category: 'Locked/Staked', amount: 28100000, percentage: 7.4, color: '#f59e0b' },
  { category: 'Reserved', amount: 12200000, percentage: 3.2, color: '#8b5cf6' }
];

// Cross-chain distribution
const crossChainData = [
  { chain: 'Ethereum', tokens: 156000000, projects: 1245, percentage: 41.3, color: '#627EEA' },
  { chain: 'CO2e Chain', tokens: 128000000, projects: 1580, percentage: 33.9, color: '#10b981' },
  { chain: 'Polygon', tokens: 58000000, projects: 680, percentage: 15.3, color: '#8247E5' },
  { chain: 'BSC', tokens: 24000000, projects: 285, percentage: 6.3, color: '#F3BA2F' },
  { chain: 'Others', tokens: 12000000, projects: 190, percentage: 3.2, color: '#64748b' }
];

// Real-time tokenization activity
const liveTokenizationData = [
  { time: '00:00', newTokens: 125000, transfers: 45, volume: 2.8 },
  { time: '04:00', newTokens: 98000, transfers: 38, volume: 2.1 },
  { time: '08:00', newTokens: 185000, transfers: 67, volume: 4.2 },
  { time: '12:00', newTokens: 245000, transfers: 89, volume: 5.8 },
  { time: '16:00', newTokens: 198000, transfers: 72, volume: 4.5 },
  { time: '20:00', newTokens: 165000, transfers: 58, volume: 3.7 }
];

// Key metrics
const tokenizationMetrics = {
  totalTokenized: '3,780',
  totalTokenizedChange: '+18.9%',
  totalSupply: '378M',
  totalSupplyChange: '+22.4%',
  newProjectsThisMonth: '124',
  newProjectsChange: '+31.5%',
  averageTokensPerProject: '100K',
  averageTokensChange: '+8.7%',
  marketCap: '$4.73B',
  marketCapChange: '+28.1%',
  activeTokenHolders: '47,580',
  activeTokenHoldersChange: '+15.2%'
};

export function TokenizationMetrics({ className }: TokenizationMetricsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6M');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastRefresh(new Date());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Enhanced metric card component
  const MetricCard = ({ title, value, change, trend, icon: Icon, subtitle }: any) => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1 group-hover:text-blue-400 transition-colors">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          <div className={cn(
            "flex items-center text-sm mt-2",
            trend === 'up' ? 'text-green-400' : 'text-red-400'
          )}>
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>{change}</span>
          </div>
        </div>
        <Icon className="h-8 w-8 text-blue-400 group-hover:scale-110 transition-transform" />
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Tokenization Analytics</h2>
          <p className="text-gray-400 mt-1">Comprehensive blockchain tokenization metrics and supply analysis</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="border-blue-500 text-blue-400">
            Real-time
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-gray-700 border-gray-600 hover:bg-gray-600"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-700 border-gray-600 hover:bg-gray-600"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-6 gap-4">
        <MetricCard
          title="Total Projects Tokenized"
          value={tokenizationMetrics.totalTokenized}
          change={tokenizationMetrics.totalTokenizedChange}
          trend="up"
          icon={Target}
          subtitle="Carbon credit projects"
        />
        <MetricCard
          title="Total Token Supply"
          value={tokenizationMetrics.totalSupply}
          change={tokenizationMetrics.totalSupplyChange}
          trend="up"
          icon={Database}
          subtitle="tCO₂ tokens in circulation"
        />
        <MetricCard
          title="New Projects (30d)"
          value={tokenizationMetrics.newProjectsThisMonth}
          change={tokenizationMetrics.newProjectsChange}
          trend="up"
          icon={TrendingUp}
          subtitle="Recently tokenized"
        />
        <MetricCard
          title="Avg Tokens/Project"
          value={tokenizationMetrics.averageTokensPerProject}
          change={tokenizationMetrics.averageTokensChange}
          trend="up"
          icon={BarChart3}
          subtitle="Mean tokenization size"
        />
        <MetricCard
          title="Market Cap"
          value={tokenizationMetrics.marketCap}
          change={tokenizationMetrics.marketCapChange}
          trend="up"
          icon={Coins}
          subtitle="Total value locked"
        />
        <MetricCard
          title="Active Token Holders"
          value={tokenizationMetrics.activeTokenHolders}
          change={tokenizationMetrics.activeTokenHoldersChange}
          trend="up"
          icon={Activity}
          subtitle="Unique addresses"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-12 gap-6">
        {/* Tokenization Growth Trends */}
        <Card className="col-span-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <LineChart className="h-5 w-5 mr-2 text-blue-400" />
              Tokenization Growth Trends
            </CardTitle>
            <CardDescription className="text-gray-400">
              Historical growth in projects, tokens, and market cap
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tokenizationGrowthData}>
                  <defs>
                    <linearGradient id="tokensGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="projectsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis yAxisId="left" stroke="#9ca3af" />
                  <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="totalTokenized"
                    stroke="#10b981"
                    fill="url(#tokensGradient)"
                    name="Total Projects"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="marketCap"
                    stroke="#0ea5e9"
                    fill="url(#projectsGradient)"
                    name="Market Cap ($B)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Token Supply Utilization */}
        <Card className="col-span-4 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <PieChart className="h-5 w-5 mr-2 text-blue-400" />
              Token Supply Utilization
            </CardTitle>
            <CardDescription className="text-gray-400">
              Current token allocation breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={supplyUtilizationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {supplyUtilizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${(value / 1000000).toFixed(1)}M`, 'Tokens']}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {supplyUtilizationData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-white">{item.category}</span>
                    </div>
                    <span className="text-sm font-medium text-white">{item.percentage}%</span>
                  </div>
                  <Progress 
                    value={item.percentage} 
                    className="h-2"
                    style={{ 
                      background: `linear-gradient(to right, ${item.color} ${item.percentage}%, #374151 ${item.percentage}%)`
                    }}
                  />
                  <div className="text-xs text-gray-400 text-right">
                    {(item.amount / 1000000).toFixed(1)}M tokens
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cross-chain and Activity Row */}
      <div className="grid grid-cols-12 gap-6">
        {/* Cross-chain Distribution */}
        <Card className="col-span-7 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Zap className="h-5 w-5 mr-2 text-blue-400" />
              Cross-chain Token Distribution
            </CardTitle>
            <CardDescription className="text-gray-400">
              Token distribution across different blockchain networks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {crossChainData.map((chain, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors"
                >
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-4"
                      style={{ backgroundColor: chain.color }}
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{chain.chain}</p>
                      <p className="text-xs text-gray-400">{chain.projects} projects</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">
                        {(chain.tokens / 1000000).toFixed(1)}M
                      </p>
                      <p className="text-xs text-gray-400">tokens</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-400">{chain.percentage}%</p>
                      <p className="text-xs text-gray-400">share</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Real-time Tokenization Activity */}
        <Card className="col-span-5 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Activity className="h-5 w-5 mr-2 text-blue-400" />
              Live Tokenization Activity
            </CardTitle>
            <CardDescription className="text-gray-400">
              Real-time token creation and transfer activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={liveTokenizationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="newTokens" fill="#10b981" name="New Tokens" />
                  <Bar dataKey="transfers" fill="#0ea5e9" name="Transfers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}