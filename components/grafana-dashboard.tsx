'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Activity, Settings, Clock, AlertCircle, BarChart3, TrendingUp, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mapProjectsToMetricCards } from '../lib/mappers';
import { MetricGrid } from './metric-cards';
import { projectDataManager } from '../lib/project-data-manager';
import { co2eApi } from '../lib/co2e-api';
import { Button } from './ui/button';
import { RealTimeRetirementStats } from './retirement-panels/real-time-stats';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';

interface GrafanaDashboardProps {
  className?: string;
}

const REFRESH_INTERVALS = [
  { value: '5s', label: '5 seconds' },
  { value: '10s', label: '10 seconds' },
  { value: '30s', label: '30 seconds' },
  { value: '1m', label: '1 minute' },
  { value: '5m', label: '5 minutes' },
  { value: 'off', label: 'Off' }
];

const TIME_RANGES = [
  { value: '5m', label: 'Last 5 minutes' },
  { value: '15m', label: 'Last 15 minutes' },
  { value: '30m', label: 'Last 30 minutes' },
  { value: '1h', label: 'Last hour' },
  { value: '3h', label: 'Last 3 hours' },
  { value: '6h', label: 'Last 6 hours' },
  { value: '12h', label: 'Last 12 hours' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' }
];

export function GrafanaDashboard({ className }: GrafanaDashboardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('30s');
  const [timeRange, setTimeRange] = useState('24h');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      if (!projectDataManager.isReady()) {
        projectDataManager.initialize(process.env.NEXT_PUBLIC_PROJECTS_DATA_URL || '');
      }
      const projectData = await co2eApi.getProjects();
      if (!projectData || projectData.length === 0) {
        throw new Error('No project data available');
      }

      const enhancedData = {
        projects: projectData,
        lastUpdated: new Date()
      };

      setData(enhancedData);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      await fetchData();
      setIsLoading(false);
      setIsInitialLoadComplete(true);
    };
    loadInitialData();
  }, [fetchData]);

  // Auto-refresh
  useEffect(() => {
    if (refreshInterval === 'off' || !isInitialLoadComplete) return;

    const intervalMs = {
      '5s': 5000,
      '10s': 10000,
      '30s': 30000,
      '1m': 60000,
      '5m': 300000
    }[refreshInterval] || 30000;

    const interval = setInterval(fetchData, intervalMs);
    return () => clearInterval(interval);
  }, [refreshInterval, fetchData, isInitialLoadComplete]);

  const handleManualRefresh = useCallback(async () => {
    setIsLoading(true);
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  }, [fetchData]);

  return (
    <div className={cn("min-h-screen bg-gray-900 text-gray-100", className)}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="text-center">
            <Activity className="h-12 w-12 text-green-500 animate-pulse mx-auto mb-4" />
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={handleManualRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-white">Carbon Credit Dashboard</h1>
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Last refresh: {lastRefresh.toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Time Range Selector */}
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {TIME_RANGES.map(range => (
                      <SelectItem 
                        key={range.value} 
                        value={range.value}
                        className="text-gray-100 hover:bg-gray-700"
                      >
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Refresh Interval Selector */}
                <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                  <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {REFRESH_INTERVALS.map(interval => (
                      <SelectItem 
                        key={interval.value} 
                        value={interval.value}
                        className="text-gray-100 hover:bg-gray-700"
                      >
                        {interval.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Manual Refresh Button */}
                <Button
                  onClick={handleManualRefresh}
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 border-gray-600 hover:bg-gray-600"
                  disabled={isRefreshing}
                >
                  <RefreshCw className={cn(
                    "h-4 w-4",
                    isRefreshing && "animate-spin"
                  )} />
                </Button>

                {/* Settings Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 border-gray-600 hover:bg-gray-600"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main Dashboard Grid */}
          <main className="p-4">
            <div className="grid grid-cols-12 gap-4">
              {/* Row 1: Key Metrics */}
              <motion.div 
                className="col-span-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Leaf className="h-5 w-5 mr-2 text-green-500" />
                      Carbon Credit Overview
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Comprehensive metrics across all carbon credit projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MetricGrid metrics={mapProjectsToMetricCards(data?.projects || [])} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Row 2: Retirement Metrics */}
              <motion.div
                className="col-span-12 lg:col-span-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <RealTimeRetirementStats />
              </motion.div>

              {/* Row 2: Tokenization Metrics */}
              <motion.div 
                className="col-span-12 lg:col-span-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-gray-800 border-gray-700 h-[300px]">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
                      Tokenization Metrics
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Blockchain tokenization analytics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-32">
                      <p className="text-gray-500">Tokenization metrics visualization coming soon...</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </main>

          {/* Refresh Animation Overlay */}
          <AnimatePresence>
            {isRefreshing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed top-0 left-0 right-0 h-1 bg-green-500/20"
              >
                <motion.div
                  className="h-full bg-green-500"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );

  return (
    <div className={cn("min-h-screen bg-gray-900 text-gray-100", className)}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="text-center">
            <Activity className="h-12 w-12 text-green-500 animate-pulse mx-auto mb-4" />
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={handleManualRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-white">Carbon Credit Dashboard</h1>
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Last refresh: {lastRefresh.toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Time Range Selector */}
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {TIME_RANGES.map(range => (
                      <SelectItem 
                        key={range.value} 
                        value={range.value}
                        className="text-gray-100 hover:bg-gray-700"
                      >
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Refresh Interval Selector */}
                <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                  <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {REFRESH_INTERVALS.map(interval => (
                      <SelectItem 
                        key={interval.value} 
                        value={interval.value}
                        className="text-gray-100 hover:bg-gray-700"
                      >
                        {interval.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Manual Refresh Button */}
                <Button
                  onClick={handleManualRefresh}
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 border-gray-600 hover:bg-gray-600"
                  disabled={isRefreshing}
                >
                  <RefreshCw className={cn(
                    "h-4 w-4",
                    isRefreshing && "animate-spin"
                  )} />
                </Button>

                {/* Settings Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 border-gray-600 hover:bg-gray-600"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main Dashboard Grid */}
          <main className="p-4">
            <div className="grid grid-cols-12 gap-4">
              {/* Row 1: Key Metrics */}
              <motion.div 
                className="col-span-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Leaf className="h-5 w-5 mr-2 text-green-500" />
                      Carbon Credit Overview
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Comprehensive metrics across all carbon credit projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MetricGrid metrics={mapProjectsToMetricCards(data?.projects || [])} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Row 2: Retirement Metrics */}
              <motion.div
                className="col-span-12 lg:col-span-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <RealTimeRetirementStats />
              </motion.div>

              {/* Row 2: Tokenization Metrics */}
              <motion.div 
                className="col-span-12 lg:col-span-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-gray-800 border-gray-700 h-[300px]">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
                      Tokenization Metrics
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Blockchain tokenization analytics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-32">
                      <p className="text-gray-500">Tokenization metrics visualization coming soon...</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </main>

          {/* Refresh Animation Overlay */}
          <AnimatePresence>
            {isRefreshing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed top-0 left-0 right-0 h-1 bg-green-500/20"
              >
                <motion.div
                  className="h-full bg-green-500"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );

  return (
    <div className={cn("min-h-screen bg-gray-900 text-gray-100", className)}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="text-center">
            <Activity className="h-12 w-12 text-green-500 animate-pulse mx-auto mb-4" />
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={handleManualRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-white">Carbon Credit Dashboard</h1>
                <div className="flex items-center text-sm text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Last refresh: {lastRefresh.toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Time Range Selector */}
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {TIME_RANGES.map(range => (
                      <SelectItem 
                        key={range.value} 
                        value={range.value}
                        className="text-gray-100 hover:bg-gray-700"
                      >
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Refresh Interval Selector */}
                <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                  <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-gray-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {REFRESH_INTERVALS.map(interval => (
                      <SelectItem 
                        key={interval.value} 
                        value={interval.value}
                        className="text-gray-100 hover:bg-gray-700"
                      >
                        {interval.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Manual Refresh Button */}
                <Button
                  onClick={handleManualRefresh}
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 border-gray-600 hover:bg-gray-600"
                  disabled={isRefreshing}
                >
                  <RefreshCw className={cn(
                    "h-4 w-4",
                    isRefreshing && "animate-spin"
                  )} />
                </Button>

                {/* Settings Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 border-gray-600 hover:bg-gray-600"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Main Dashboard Grid */}
          <main className="p-4">
            <div className="grid grid-cols-12 gap-4">
              {/* Row 1: Key Metrics */}
              <motion.div 
                className="col-span-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <Leaf className="h-5 w-5 mr-2 text-green-500" />
                      Carbon Credit Overview
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Comprehensive metrics across all carbon credit projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MetricGrid metrics={mapProjectsToMetricCards(data?.projects || [])} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Row 2: Retirement Metrics */}
              <motion.div
                className="col-span-12 lg:col-span-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <RealTimeRetirementStats />
              </motion.div>

              {/* Row 2: Tokenization Metrics */}
              <motion.div 
                className="col-span-12 lg:col-span-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-gray-800 border-gray-700 h-[300px]">
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
                      Tokenization Metrics
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Blockchain tokenization analytics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center h-32">
                      <p className="text-gray-500">Tokenization metrics visualization coming soon...</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </main>

          {/* Refresh Animation Overlay */}
          <AnimatePresence>
            {isRefreshing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed top-0 left-0 right-0 h-1 bg-green-500/20"
              >
                <motion.div
                  className="h-full bg-green-500"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
