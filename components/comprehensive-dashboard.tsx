'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, RefreshCw, BarChart3, DollarSign, Leaf, Users, Globe } from 'lucide-react';
import { EnhancedMetricCard } from './enhanced-metric-card';
import { MetricCards } from './metric-cards';
import { ProjectDataManager } from '@/lib/project-data-manager';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';

interface ComprehensiveDashboardProps {
  className?: string;
}

export function ComprehensiveDashboard({ className }: ComprehensiveDashboardProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsRefreshing(true);
      const data = await ProjectDataManager.getProjects();
      setProjects(data || []);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  // Calculate summary metrics
  const summaryMetrics = React.useMemo(() => {
    if (!projects.length) return null;

    const totalCredits = projects.reduce((sum, project) => sum + (project.totalCredits || 0), 0);
    const totalRetired = projects.reduce((sum, project) => sum + (project.retired || 0), 0);
    const totalAvailable = projects.reduce((sum, project) => sum + (project.available || 0), 0);
    const totalValue = projects.reduce((sum, project) => sum + (project.totalValue || 0), 0);

    return {
      totalCredits,
      totalRetired,
      totalAvailable,
      totalValue,
      retirementRate: totalCredits > 0 ? (totalRetired / totalCredits) * 100 : 0,
      averagePrice: totalCredits > 0 ? totalValue / totalCredits : 0,
      activeProjects: projects.filter(p => p.status === 'active').length,
      totalProjects: projects.length
    };
  }, [projects]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-12 w-12 text-green-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading comprehensive dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-gray-50 dark:bg-gray-900", className)}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              BlockEdge Carbon Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive carbon credit analytics and retirement tracking
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Activity className="h-3 w-3 mr-1" />
              Live Data
            </Badge>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={isRefreshing}
            >
              <RefreshCw className={cn(
                "h-4 w-4 mr-2",
                isRefreshing && "animate-spin"
              )} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* Summary Cards */}
        {summaryMetrics && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
                <Leaf className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summaryMetrics.totalCredits.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  tCO2e across all projects
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credits Retired</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summaryMetrics.totalRetired.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {summaryMetrics.retirementRate.toFixed(1)}% retirement rate
                </p>
                <Progress 
                  value={summaryMetrics.retirementRate} 
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${summaryMetrics.totalValue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  ${summaryMetrics.averagePrice.toFixed(2)} avg per credit
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <Globe className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summaryMetrics.activeProjects}
                </div>
                <p className="text-xs text-muted-foreground">
                  of {summaryMetrics.totalProjects} total projects
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Carbon Metrics */}
          <motion.div 
            className="lg:col-span-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Leaf className="h-5 w-5 mr-2 text-green-600" />
                  Carbon Credit Overview
                </CardTitle>
                <CardDescription>
                  Comprehensive metrics across all carbon credit projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MetricCards projects={projects} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Retirement Metrics */}
          <motion.div 
            className="lg:col-span-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Retirement Tracking
                </CardTitle>
                <CardDescription>
                  Detailed retirement metrics by payment method and timing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    Retirement tracking metrics will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tokenization Metrics */}
          <motion.div 
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                  Tokenization Metrics
                </CardTitle>
                <CardDescription>
                  Blockchain tokenization and smart contract analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    Tokenization metrics will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Project Distribution */}
          <motion.div 
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-orange-600" />
                  Project Distribution
                </CardTitle>
                <CardDescription>
                  Geographic and methodological distribution of projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center p-6">
                  <p className="text-gray-600 dark:text-gray-400">
                    Project distribution analysis will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              Last updated: {lastRefresh.toLocaleString()} | 
              Data source: BlockEdge Carbon Credit Platform
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}