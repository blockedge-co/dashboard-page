"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RetirementStats, PaymentMethod, PAYMENT_METHOD_LABELS } from "@/lib/types";
import { retirementService } from "@/lib/retirement-service";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Coins, 
  Calendar,
  RefreshCw,
  BarChart3,
  PieChart,
  TrendingUpIcon
} from "lucide-react";

// Import individual panel components
import { PaymentMethodBreakdown } from "./retirement-panels/payment-method-breakdown";
import { RetirementTimeSeries } from "./retirement-panels/retirement-time-series";
import { PaymentMethodComparison } from "./retirement-panels/payment-method-comparison";
import { RealTimeStats } from "./retirement-panels/real-time-stats";
import { PaymentMethodTrends } from "./retirement-panels/payment-method-trends";

interface RetirementDashboardProps {
  className?: string;
}

export function RetirementDashboard({ className }: RetirementDashboardProps) {
  const [stats, setStats] = useState<RetirementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d' | '1y'>('30d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRetirementStats();
  }, [timeRange]);

  const loadRetirementStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await retirementService.getRetirementStats();
      setStats(data);
    } catch (err) {
      setError('Failed to load retirement statistics');
      console.error('Error loading retirement stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    retirementService.clearCache();
    await loadRetirementStats();
    setRefreshing(false);
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatNumber = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Credit Retirement Tracking</h2>
            <p className="text-muted-foreground">Monitor retirement patterns and payment methods</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadRetirementStats} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const topPaymentMethods = Object.entries(stats.byPaymentMethod)
    .sort(([,a], [,b]) => b.count - a.count)
    .slice(0, 3);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Credit Retirement Tracking</h2>
          <p className="text-muted-foreground">Monitor retirement patterns and payment methods</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Retired</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.total.amount)}</div>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats.total.co2eAmount)} tCO2e
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.total.value)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total.count} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AIS Points Usage</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.trends.paymentMethodTrends.aisPointsUsage.percentage.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              {stats.trends.paymentMethodTrends.aisPointsUsage.trend > 0 ? (
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
              )}
              {Math.abs(stats.trends.paymentMethodTrends.aisPointsUsage.trend).toFixed(1)}% trend
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Payment Method</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {PAYMENT_METHOD_LABELS[stats.trends.paymentMethodTrends.mostPopular]}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.byPaymentMethod[stats.trends.paymentMethodTrends.mostPopular].count} transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="time-series">Time Series</TabsTrigger>
          <TabsTrigger value="breakdown">Payment Methods</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RealTimeStats stats={stats} />
            <PaymentMethodBreakdown stats={stats} />
          </div>
        </TabsContent>

        <TabsContent value="time-series" className="space-y-4">
          <RetirementTimeSeries stats={stats} timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <PaymentMethodBreakdown stats={stats} detailed />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <PaymentMethodComparison stats={stats} />
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <PaymentMethodTrends stats={stats} />
        </TabsContent>
      </Tabs>

      {/* Payment Method Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method Summary</CardTitle>
          <CardDescription>Top performing payment methods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPaymentMethods.map(([method, data]) => (
              <div key={method} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{PAYMENT_METHOD_LABELS[method as PaymentMethod]}</div>
                  <div className="text-sm text-muted-foreground">
                    {data.count} transactions
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{formatCurrency(data.usdValue)}</div>
                  <Badge variant={data.trend.growthRate > 0 ? "default" : "secondary"}>
                    {data.trend.growthRate > 0 ? '+' : ''}{data.trend.growthRate.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RetirementDashboard;