'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  TrendingUp, 
  DollarSign, 
  Coins, 
  Users, 
  RefreshCw,
  Download,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
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

interface RetirementAnalyticsProps {
  className?: string;
}

// Mock data for retirement by payment method
const retirementByPaymentData = [
  { period: 'Jan', aisPoint: 125000, other: 155000 },
  { period: 'Feb', aisPoint: 142000, other: 178000 },
  { period: 'Mar', aisPoint: 158000, other: 200000 },
  { period: 'Apr', aisPoint: 175000, other: 225000 },
  { period: 'May', aisPoint: 192000, other: 245000 },
  { period: 'Jun', aisPoint: 215000, other: 270000 }
];

// Real-time retirement data
const liveRetirementData = [
  { time: '00:00', total: 340, aisPoint: 215, other: 125 },
  { time: '04:00', total: 380, aisPoint: 240, other: 140 },
  { time: '08:00', total: 450, aisPoint: 285, other: 165 },
  { time: '12:00', total: 520, aisPoint: 330, other: 190 },
  { time: '16:00', total: 485, aisPoint: 308, other: 177 },
  { time: '20:00', total: 425, aisPoint: 270, other: 155 }
];

// Payment method breakdown for pie chart
const paymentBreakdown = [
  { method: 'AIS Points', amount: 2150000, percentage: 62.8, color: '#10b981', trend: '+18.5%' },
  { method: 'Other Methods', amount: 1271000, percentage: 37.2, color: '#8b5cf6', trend: '+12.1%' }
];

// Top retirees data
const topRetirees = [
  { name: 'Carbon Solutions Ltd', amount: 485000, change: '+12.5%', type: 'Corporate' },
  { name: 'Green Energy Corp', amount: 320000, change: '+8.3%', type: 'Corporate' },
  { name: 'EcoFund Investment', amount: 285000, change: '+15.7%', type: 'Investment' },
  { name: 'Climate Action NGO', amount: 245000, change: '+6.2%', type: 'NGO' },
  { name: 'Renewable Partners', amount: 198000, change: '+22.1%', type: 'Corporate' }
];

// Key metrics
const retirementMetrics = {
  totalRetired: '3,421,000',
  totalRetiredChange: '+15.3%',
  todayRetired: '18,750',
  todayRetiredChange: '+8.7%',
  averageRetirement: '12.5K',
  averageRetirementChange: '+5.2%',
  uniqueRetirees: '1,847',
  uniqueRetireesChange: '+12.8%'
};

export function RetirementAnalytics({ className }: RetirementAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = () => {
    setIsRefreshing(true);
    setLastRefresh(new Date());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Metric card component
  const MetricCard = ({ title, value, change, trend, icon: Icon }: any) => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          <div className={cn(
            "flex items-center text-sm mt-2",
            trend === 'up' ? 'text-green-400' : 'text-red-400'
          )}>
            {trend === 'up' ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-1" />
            )}
            <span>{change}</span>
          </div>
        </div>
        <Icon className="h-8 w-8 text-blue-400" />
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Credit Retirement Analytics</h2>
          <p className="text-gray-400 mt-1">Track retirements by AIS Points vs other payment methods</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="border-green-500 text-green-400">
            Live Data
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
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Total Credits Retired"
          value={retirementMetrics.totalRetired}
          change={retirementMetrics.totalRetiredChange}
          trend="up"
          icon={CreditCard}
        />
        <MetricCard
          title="Retired Today"
          value={retirementMetrics.todayRetired}
          change={retirementMetrics.todayRetiredChange}
          trend="up"
          icon={TrendingUp}
        />
        <MetricCard
          title="Average Retirement"
          value={retirementMetrics.averageRetirement}
          change={retirementMetrics.averageRetirementChange}
          trend="up"
          icon={DollarSign}
        />
        <MetricCard
          title="Unique Retirees"
          value={retirementMetrics.uniqueRetirees}
          change={retirementMetrics.uniqueRetireesChange}
          trend="up"
          icon={Users}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-12 gap-6">
        {/* Historical Retirement Trends */}
        <Card className="col-span-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
              Retirement by Payment Method
            </CardTitle>
            <CardDescription className="text-gray-400">
              Monthly trends showing AIS Points vs other payment methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={retirementByPaymentData}>
                  <defs>
                    <linearGradient id="aisGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="otherGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="period" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
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
                    type="monotone"
                    dataKey="aisPoint"
                    stackId="1"
                    stroke="#10b981"
                    fill="url(#aisGradient)"
                    name="AIS Points"
                  />
                  <Area
                    type="monotone"
                    dataKey="other"
                    stackId="1"
                    stroke="#8b5cf6"
                    fill="url(#otherGradient)"
                    name="Other"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method Distribution */}
        <Card className="col-span-4 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Coins className="h-5 w-5 mr-2 text-blue-400" />
              Payment Distribution
            </CardTitle>
            <CardDescription className="text-gray-400">
              Current breakdown by payment method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {paymentBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value.toLocaleString()} tCO₂`, 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {paymentBreakdown.map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: method.color }}
                    />
                    <div>
                      <p className="text-sm font-medium text-white">{method.method}</p>
                      <p className="text-xs text-gray-400">{method.percentage}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      {method.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-400">{method.trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity and Top Retirees */}
      <div className="grid grid-cols-12 gap-6">
        {/* Real-time Retirement Activity */}
        <Card className="col-span-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
              Real-time Retirement Activity (24h)
            </CardTitle>
            <CardDescription className="text-gray-400">
              Live retirement data by payment method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={liveRetirementData}>
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
                  <Bar dataKey="aisPoint" fill="#10b981" name="AIS Points" />
                  <Bar dataKey="other" fill="#8b5cf6" name="Other Methods" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Retirees */}
        <Card className="col-span-4 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Users className="h-5 w-5 mr-2 text-blue-400" />
              Top Retirees
            </CardTitle>
            <CardDescription className="text-gray-400">
              Leading institutions by retirement volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRetirees.map((retiree, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{retiree.name}</p>
                      <p className="text-xs text-gray-400">{retiree.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      {retiree.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-400">{retiree.change}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}