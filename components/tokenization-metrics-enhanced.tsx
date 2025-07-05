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
import { 
  tokenizationService,
  type TokenizationMetrics as TokenizationMetricsType,
  type TokenizationGrowthData,
  type TokenSupplyUtilization,
  type CrossChainDistribution,
  type LiveTokenizationActivity
} from '@/lib/tokenization-service';

interface TokenizationMetricsProps {
  className?: string;
}


export function TokenizationMetrics({ className }: TokenizationMetricsProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('6M');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real data state
  const [tokenizationMetrics, setTokenizationMetrics] = useState<TokenizationMetricsType | null>(null);
  const [tokenizationGrowthData, setTokenizationGrowthData] = useState<TokenizationGrowthData[]>([]);
  const [supplyUtilizationData, setSupplyUtilizationData] = useState<TokenSupplyUtilization[]>([]);
  const [crossChainData, setCrossChainData] = useState<CrossChainDistribution[]>([]);
  const [liveTokenizationData, setLiveTokenizationData] = useState<LiveTokenizationActivity[]>([]);
  const [blockchainStats, setBlockchainStats] = useState<any>(null);

  // Fetch all real data
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 Fetching real tokenization data...');

      // Fetch all data in parallel
      const [
        metricsData,
        growthData,
        utilizationData,
        chainData,
        activityData,
        statsData
      ] = await Promise.all([
        tokenizationService.getTokenizationMetrics(),
        tokenizationService.getTokenizationGrowthData(),
        tokenizationService.getTokenSupplyUtilization(),
        tokenizationService.getCrossChainDistribution(),
        tokenizationService.getLiveTokenizationActivity(),
        tokenizationService.getBlockchainStats()
      ]);

      // Update state with real data
      setTokenizationMetrics(metricsData);
      setTokenizationGrowthData(growthData);
      setSupplyUtilizationData(utilizationData);
      setCrossChainData(chainData);
      setLiveTokenizationData(activityData);
      setBlockchainStats(statsData);

      console.log('✅ Real tokenization data loaded successfully');
      setLastRefresh(new Date());
    } catch (err) {
      console.error('❌ Error fetching tokenization data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tokenization data');
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Refresh data handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Clear cache to force fresh data
      tokenizationService.clearCache();
      await fetchAllData();
    } catch (err) {
      console.error('❌ Error refreshing data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Loading component
  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-400" />
            <span className="text-white">Loading real tokenization data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-400 mb-4">Error loading tokenization data: {error}</p>
            <Button onClick={handleRefresh} className="bg-red-600 hover:bg-red-700">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Return early if no data
  if (!tokenizationMetrics) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center justify-center h-64">
          <span className="text-gray-400">No tokenization data available</span>
        </div>
      </div>
    );
  }

  // Enhanced metric card component - Mobile Optimized
  const MetricCard = ({ title, value, change, trend, icon: Icon, subtitle }: any) => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 lg:p-4 hover:bg-gray-750 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs lg:text-sm text-gray-400 font-medium truncate">{title}</p>
          <p className="text-lg lg:text-2xl font-bold text-white mt-1 group-hover:text-blue-400 transition-colors">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1 truncate">{subtitle}</p>
          )}
          <div className={cn(
            "flex items-center text-xs lg:text-sm mt-2",
            trend === 'up' ? 'text-green-400' : 'text-red-400'
          )}>
            <ArrowUpRight className="h-3 w-3 lg:h-4 lg:w-4 mr-1 flex-shrink-0" />
            <span className="truncate">{change}</span>
          </div>
        </div>
        <Icon className="h-6 w-6 lg:h-8 lg:w-8 text-blue-400 group-hover:scale-110 transition-transform flex-shrink-0 ml-2" />
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-4 lg:space-y-6", className)}>
      {/* Header - Mobile First */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-white">Tokenization Analytics</h2>
          <p className="text-gray-400 mt-1 text-sm lg:text-base">
            Comprehensive blockchain tokenization metrics and supply analysis
          </p>
        </div>
        <div className="flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:items-center lg:space-x-3">
          <Badge variant="outline" className="border-blue-500 text-blue-400 self-start lg:self-auto">
            Real-time Blockchain Data
          </Badge>
          <span className="text-xs text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <div className="flex space-x-2">
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
      </div>

      {/* Blockchain Stats - Mobile First */}
      {blockchainStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 py-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="text-center">
            <p className="text-xs text-gray-400">Total Blocks</p>
            <p className="text-sm lg:text-lg font-semibold text-white">{parseInt(blockchainStats.totalBlocks).toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Total Transactions</p>
            <p className="text-sm lg:text-lg font-semibold text-white">{parseInt(blockchainStats.totalTransactions).toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Active Addresses</p>
            <p className="text-sm lg:text-lg font-semibold text-white">{parseInt(blockchainStats.totalAddresses).toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Avg Block Time</p>
            <p className="text-sm lg:text-lg font-semibold text-white">{blockchainStats.averageBlockTime}s</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Network</p>
            <p className="text-sm lg:text-lg font-semibold text-green-400">CO2e Chain</p>
          </div>
        </div>
      )}

      {/* Key Metrics Grid - Mobile First */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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

      {/* Tokenization Growth Trends - Full Width on Mobile */}
      <Card className="bg-gray-800 border-gray-700">
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
          <div className="h-64 lg:h-80">
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
                <XAxis 
                  dataKey="month" 
                  stroke="#9ca3af" 
                  fontSize={12}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  yAxisId="left" 
                  stroke="#9ca3af" 
                  fontSize={12}
                  width={40}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke="#9ca3af" 
                  fontSize={12}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === 'Market Cap ($M)') {
                      return [`$${(value / 1000000).toFixed(1)}M`, name];
                    }
                    return [value.toLocaleString(), name];
                  }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="totalTokenized"
                  stroke="#10b981"
                  fill="url(#tokensGradient)"
                  name="Total Projects Tokenized"
                  strokeWidth={2}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="marketCap"
                  stroke="#0ea5e9"
                  fill="url(#projectsGradient)"
                  name="Market Cap ($M)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Token Supply Utilization - Full Width on Mobile */}
      <Card className="bg-gray-800 border-gray-700">
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8">
            <div className="h-48 lg:h-64 flex-shrink-0 lg:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={supplyUtilizationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
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
            <div className="space-y-3 mt-4 lg:mt-0 lg:flex-1">
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
          </div>
        </CardContent>
      </Card>

      {/* Cross-chain Distribution - Full Width on Mobile */}
      <Card className="bg-gray-800 border-gray-700">
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
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors space-y-2 sm:space-y-0"
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
                <div className="flex items-center justify-between sm:justify-end space-x-6">
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

      {/* Live Tokenization Activity - Full Width on Mobile */}
      <Card className="bg-gray-800 border-gray-700">
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
          <div className="h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={liveTokenizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9ca3af" 
                  fontSize={12}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#9ca3af" 
                  fontSize={12}
                  width={40}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(value: any, name: string) => [
                    value.toLocaleString(),
                    name
                  ]}
                />
                <Legend />
                <Bar dataKey="newTokens" fill="#10b981" name="New Tokens Minted" />
                <Bar dataKey="transfers" fill="#0ea5e9" name="Token Transfers" />
                <Bar dataKey="retirements" fill="#f59e0b" name="Token Retirements" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TokenizationMetrics;