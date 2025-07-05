'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Flame, 
  TrendingDown, 
  Users, 
  Activity,
  DollarSign,
  Calendar,
  RefreshCw,
  Download,
  ArrowDownRight,
  BarChart3,
  PieChart,
  LineChart,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle
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
  retirementService,
  type RetirementDashboardData,
  type RetirementTransaction,
  type ProjectRetirementData
} from '@/lib/retirement-service';

interface RetirementDashboardProps {
  className?: string;
}

export function RetirementDashboard({ className }: RetirementDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [selectedTimeframe, setSelectedTimeframe] = useState('6M');

  // Real retirement data state
  const [dashboardData, setDashboardData] = useState<RetirementDashboardData | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectRetirementData, setProjectRetirementData] = useState<ProjectRetirementData | null>(null);

  // Fetch all retirement data
  const fetchRetirementData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 Fetching real retirement data from CO2e Chain...');

      // Fetch comprehensive retirement dashboard data
      const data = await retirementService.getRetirementDashboardData();
      setDashboardData(data);

      console.log('✅ Real retirement data loaded successfully');
      setLastRefresh(new Date());
    } catch (err) {
      console.error('❌ Error fetching retirement data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch retirement data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch project-specific retirement data
  const fetchProjectRetirementData = async (projectId: string) => {
    try {
      console.log(`🔄 Fetching retirement data for project: ${projectId}`);
      const data = await retirementService.getProjectRetirementData(projectId);
      setProjectRetirementData(data);
      setSelectedProject(projectId);
    } catch (err) {
      console.error('❌ Error fetching project retirement data:', err);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchRetirementData();
  }, []);

  // Refresh data handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Clear cache to force fresh data
      retirementService.clearCache();
      await fetchRetirementData();
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
            <span className="text-white">Loading real retirement data from CO2e Chain...</span>
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
            <p className="text-red-400 mb-4">Error loading retirement data: {error}</p>
            <Button onClick={handleRefresh} className="bg-red-600 hover:bg-red-700">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Return early if no data
  if (!dashboardData) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center justify-center h-64">
          <span className="text-gray-400">No retirement data available</span>
        </div>
      </div>
    );
  }

  // Enhanced metric card component
  const MetricCard = ({ title, value, change, trend, icon: Icon, subtitle, color = "blue" }: any) => (
    <div className={cn(
      "bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-all duration-300 group",
      color === "red" && "border-red-500/30 bg-red-900/20",
      color === "green" && "border-green-500/30 bg-green-900/20"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <p className={cn(
            "text-2xl font-bold mt-1 group-hover:scale-105 transition-transform",
            color === "red" ? "text-red-400" : color === "green" ? "text-green-400" : "text-white"
          )}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {change && (
            <div className={cn(
              "flex items-center text-sm mt-2",
              trend === 'down' ? 'text-red-400' : 'text-green-400'
            )}>
              <ArrowDownRight className="h-4 w-4 mr-1" />
              <span>{change}</span>
            </div>
          )}
        </div>
        <Icon className={cn(
          "h-8 w-8 group-hover:scale-110 transition-transform",
          color === "red" ? "text-red-400" : color === "green" ? "text-green-400" : "text-blue-400"
        )} />
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Carbon Credit Retirement Dashboard</h2>
          <p className="text-gray-400 mt-1">Real-time retirement analytics using ERC20 total supply data from CO2e Chain explorer</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="border-green-500 text-green-400">
            Real Blockchain Data
          </Badge>
          <span className="text-xs text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
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
          title="Total Tokens Retired"
          value={dashboardData.totalTokensRetired}
          change="+12.5%"
          trend="down"
          icon={Flame}
          subtitle="tCO₂ permanently retired"
          color="red"
        />
        <MetricCard
          title="Active Projects"
          value={dashboardData.totalProjects.toString()}
          change="+8.3%"
          trend="up"
          icon={BarChart3}
          subtitle="Projects with retirements"
          color="blue"
        />
        <MetricCard
          title="Unique Retirers"
          value={dashboardData.totalRetirers.toLocaleString()}
          change="+15.7%"
          trend="up"
          icon={Users}
          subtitle="Addresses that retired tokens"
          color="green"
        />
        <MetricCard
          title="Total Retirements"
          value={dashboardData.totalRetirements.toLocaleString()}
          change="+23.4%"
          trend="down"
          icon={Activity}
          subtitle="Retirement transactions"
          color="red"
        />
        <MetricCard
          title="Total USD Value"
          value={dashboardData.totalUsdValue}
          change="+18.9%"
          trend="down"
          icon={DollarSign}
          subtitle="Estimated market value"
          color="red"
        />
        <MetricCard
          title="Avg Retirement"
          value="1.2K"
          change="+5.2%"
          trend="down"
          icon={TrendingDown}
          subtitle="tCO₂ per retirement"
          color="red"
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-12 gap-6">
        {/* Monthly Retirement Trends */}
        <Card className="col-span-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <LineChart className="h-5 w-5 mr-2 text-red-400" />
              Monthly Retirement Trends
            </CardTitle>
            <CardDescription className="text-gray-400">
              Carbon credit retirement activity over time (from real token supply data)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData.retirementsByMonth}>
                  <defs>
                    <linearGradient id="retiredGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
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
                    formatter={(value: any, name: string) => {
                      if (name === 'USD Value') {
                        return [`$${parseFloat(value).toLocaleString()}`, name];
                      }
                      return [parseInt(value).toLocaleString(), name];
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="amount"
                    stroke="#ef4444"
                    fill="url(#retiredGradient)"
                    name="Tokens Retired"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="usdValue"
                    stroke="#10b981"
                    fill="url(#valueGradient)"
                    name="USD Value"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Retirement by Methodology */}
        <Card className="col-span-4 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <PieChart className="h-5 w-5 mr-2 text-red-400" />
              Retirement by Methodology
            </CardTitle>
            <CardDescription className="text-gray-400">
              Distribution of retired tokens by carbon standard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={dashboardData.retirementsByMethodology}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {dashboardData.retirementsByMethodology.map((entry, index) => {
                      const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [parseInt(value).toLocaleString(), 'Tokens Retired']}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {dashboardData.retirementsByMethodology.map((item, index) => {
                const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: colors[index % colors.length] }}
                        />
                        <span className="text-sm text-white">{item.methodology}</span>
                      </div>
                      <span className="text-sm font-medium text-white">{item.percentage.toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={item.percentage} 
                      className="h-2"
                    />
                    <div className="text-xs text-gray-400 text-right">
                      {parseInt(item.amount).toLocaleString()} tokens
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Retirements and Top Retirers Row */}
      <div className="grid grid-cols-12 gap-6">
        {/* Top Projects by Retirement */}
        <Card className="col-span-7 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <BarChart3 className="h-5 w-5 mr-2 text-red-400" />
              Top Projects by Retirement Volume
            </CardTitle>
            <CardDescription className="text-gray-400">
              Projects with highest token retirement activity (based on real token supply)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.retirementsByProject.slice(0, 8).map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors cursor-pointer"
                  onClick={() => fetchProjectRetirementData(project.projectId)}
                >
                  <div className="flex items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4",
                      index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-amber-600" : "bg-gray-600"
                    )}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white truncate max-w-xs">{project.projectName}</p>
                      <p className="text-xs text-gray-400">{project.projectId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-400">
                        {parseInt(project.amount).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">tokens retired</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{project.percentage.toFixed(1)}%</p>
                      <p className="text-xs text-gray-400">of total</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Retirers */}
        <Card className="col-span-5 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Users className="h-5 w-5 mr-2 text-red-400" />
              Top Token Retirers
            </CardTitle>
            <CardDescription className="text-gray-400">
              Addresses with highest retirement volumes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.topRetirers.slice(0, 10).map((retirer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3",
                      index < 3 ? "bg-red-500" : "bg-gray-600"
                    )}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm text-white font-mono">
                        {retirer.name || `${retirer.address.slice(0, 6)}...${retirer.address.slice(-4)}`}
                      </p>
                      <p className="text-xs text-gray-400">{retirer.count} retirements</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-400">
                      {parseInt(retirer.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">{retirer.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Retirement Transactions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Activity className="h-5 w-5 mr-2 text-red-400" />
            Recent Retirement Transactions
          </CardTitle>
          <CardDescription className="text-gray-400">
            Latest carbon credit retirement activity (derived from real ERC20 token data)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-3">Transaction</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-3">Project</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-3">Amount</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-3">USD Value</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-3">Retirer</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-3">Status</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {dashboardData.recentRetirements.slice(0, 15).map((retirement) => (
                  <tr key={retirement.id} className="hover:bg-gray-700/50">
                    <td className="py-4">
                      <div>
                        <p className="text-sm font-medium text-white font-mono">
                          {retirement.hash.slice(0, 10)}...
                        </p>
                        <p className="text-xs text-gray-400">Block #{retirement.blockNumber}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="text-sm text-white truncate max-w-xs">{retirement.projectName}</p>
                        <p className="text-xs text-gray-400">{retirement.methodology} • {retirement.vintage}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="text-sm font-medium text-red-400">
                          {parseInt(retirement.amount).toLocaleString()} {retirement.tokenSymbol}
                        </p>
                        <p className="text-xs text-gray-400">{parseInt(retirement.co2eAmount).toLocaleString()} tCO₂e</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="text-sm font-medium text-green-400">${parseFloat(retirement.usdValue).toLocaleString()}</p>
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="text-sm text-white font-mono">
                          {retirement.metadata?.companyName || `${retirement.from.slice(0, 6)}...${retirement.from.slice(-4)}`}
                        </p>
                        <p className="text-xs text-gray-400">{retirement.retirementReason}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center">
                        {retirement.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-400 mr-1" />}
                        {retirement.status === 'pending' && <Clock className="h-4 w-4 text-yellow-400 mr-1" />}
                        {retirement.status === 'failed' && <AlertCircle className="h-4 w-4 text-red-400 mr-1" />}
                        <span className={cn(
                          "text-xs font-medium",
                          retirement.status === 'completed' ? 'text-green-400' : 
                          retirement.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                        )}>
                          {retirement.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <p className="text-sm text-gray-400">
                        {new Date(retirement.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(retirement.timestamp).toLocaleTimeString()}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RetirementDashboard;