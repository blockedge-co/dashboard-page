"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  Leaf,
  Award,
  Building2,
  TrendingUp,
  Users,
  Target,
  Activity,
  Globe,
  Zap,
} from "lucide-react";
import { MetricCard, MetricGrid } from "@/components/metric-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MetricCardsDemo() {
  // Simulate real-time data updates
  const [metrics, setMetrics] = useState([
    {
      title: "Total Value Locked",
      value: 247000000,
      change: "+12.4%",
      trend: "up" as const,
      icon: DollarSign,
      color: "from-emerald-500 to-teal-600",
      pulse: true,
      badge: {
        text: "Live",
        variant: "default" as const,
        className: "bg-emerald-900/50 text-emerald-400 border-emerald-500/30",
      },
    },
    {
      title: "CO2 Reduced",
      value: 850000,
      change: "+8.7%",
      trend: "up" as const,
      icon: Leaf,
      color: "from-teal-500 to-cyan-600",
      description: "Total tons of CO2 equivalent reduced",
    },
    {
      title: "Active Projects",
      value: 1247,
      change: "+15.2%",
      trend: "up" as const,
      icon: Building2,
      color: "from-cyan-500 to-sky-600",
      pulse: true,
    },
    {
      title: "Verified Credits",
      value: 5600000,
      change: "+22.1%",
      trend: "up" as const,
      icon: Award,
      color: "from-sky-500 to-indigo-600",
      badge: {
        text: "Verified",
        variant: "outline" as const,
        className: "bg-sky-900/50 text-sky-400 border-sky-500/30",
      },
    },
  ]);

  const analyticsMetrics = [
    {
      title: "Market Volatility",
      value: "12.4%",
      change: "-1.8%",
      trend: "down" as const,
      icon: Activity,
      color: "from-orange-500 to-red-600",
    },
    {
      title: "Institutional Flow",
      value: "$47.2M",
      change: "+15.6%",
      trend: "up" as const,
      icon: Users,
      color: "from-purple-500 to-pink-600",
      pulse: true,
    },
    {
      title: "Risk Score",
      value: "Low",
      change: "Stable",
      trend: "neutral" as const,
      icon: Target,
      color: "from-green-500 to-emerald-600",
    },
  ];

  const compactMetrics = [
    {
      title: "Network Hash Rate",
      value: "234.5 TH/s",
      change: "+5.2%",
      trend: "up" as const,
      icon: Zap,
      color: "from-yellow-500 to-orange-600",
    },
    {
      title: "Global Reach",
      value: "67 Countries",
      change: "+3 new",
      trend: "up" as const,
      icon: Globe,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Prediction Accuracy",
      value: "94.2%",
      change: "+2.1%",
      trend: "up" as const,
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-600",
    },
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value:
            typeof metric.value === "number"
              ? Math.floor(metric.value * (1 + (Math.random() * 0.02 - 0.01)))
              : metric.value,
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Integrated Metric Cards System
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Demonstrating adaptive metric cards with performance optimization, animated counters,
          and responsive grid layouts following existing design patterns.
        </p>
      </div>

      <Tabs defaultValue="grid" className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-800/70 backdrop-blur-md border border-white/5">
            <TabsTrigger value="grid">Grid Layout</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="responsive">Responsive</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid" className="space-y-6">
          <Card className="bg-slate-800/50 backdrop-blur-md border-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" />
                Standard Metric Grid (4 Columns)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MetricGrid
                metrics={metrics}
                columns={{ sm: 1, md: 2, lg: 4 }}
                gap="md"
              />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-md border-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Analytics Metrics (3 Columns)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MetricGrid
                metrics={analyticsMetrics}
                columns={{ sm: 1, md: 2, lg: 3 }}
                gap="lg"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variants" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5">
              <CardHeader>
                <CardTitle className="text-white text-lg">Default Variant</CardTitle>
              </CardHeader>
              <CardContent>
                <MetricCard
                  title="Total Revenue"
                  value={125000}
                  change="+15.3%"
                  trend="up"
                  icon={DollarSign}
                  color="from-emerald-500 to-teal-600"
                  pulse={true}
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5">
              <CardHeader>
                <CardTitle className="text-white text-lg">Compact Variant</CardTitle>
              </CardHeader>
              <CardContent>
                <MetricCard
                  title="Active Users"
                  value={45600}
                  change="+8.2%"
                  trend="up"
                  icon={Users}
                  variant="compact"
                  size="sm"
                  color="from-blue-500 to-indigo-600"
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5">
              <CardHeader>
                <CardTitle className="text-white text-lg">Detailed Variant</CardTitle>
              </CardHeader>
              <CardContent>
                <MetricCard
                  title="Performance Score"
                  value="98.5%"
                  change="+2.1%"
                  trend="up"
                  icon={Target}
                  variant="detailed"
                  description="System uptime and reliability"
                  color="from-purple-500 to-pink-600"
                  badge={{
                    text: "Excellent",
                    variant: "default",
                    className: "bg-emerald-900/50 text-emerald-400 border-emerald-500/30",
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="responsive" className="space-y-6">
          <Card className="bg-slate-800/50 backdrop-blur-md border-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                Responsive Breakpoints Demo
              </CardTitle>
              <p className="text-slate-400 text-sm mt-2">
                Resize your browser to see how the grid adapts: 1 column on mobile, 2 on tablet, 3 on desktop
              </p>
            </CardHeader>
            <CardContent>
              <MetricGrid
                metrics={compactMetrics}
                columns={{ sm: 1, md: 2, lg: 3, xl: 3 }}
                gap="md"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5">
              <CardHeader>
                <CardTitle className="text-white text-sm">Small Size</CardTitle>
              </CardHeader>
              <CardContent>
                <MetricCard
                  title="CPU Usage"
                  value="34%"
                  change="+2%"
                  trend="up"
                  icon={Activity}
                  size="sm"
                  variant="compact"
                  color="from-green-500 to-emerald-600"
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5">
              <CardHeader>
                <CardTitle className="text-white text-sm">Medium Size</CardTitle>
              </CardHeader>
              <CardContent>
                <MetricCard
                  title="Memory Usage"
                  value="67%"
                  change="-5%"
                  trend="down"
                  icon={Zap}
                  size="md"
                  color="from-yellow-500 to-orange-600"
                />
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5">
              <CardHeader>
                <CardTitle className="text-white text-sm">Large Size</CardTitle>
              </CardHeader>
              <CardContent>
                <MetricCard
                  title="Disk Usage"
                  value="82%"
                  change="0%"
                  trend="neutral"
                  icon={Building2}
                  size="lg"
                  color="from-red-500 to-red-600"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="bg-slate-800/50 backdrop-blur-md border-white/5">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Key Features Implemented
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Performance Optimizations</h4>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Animated counters with performance controls</li>
                <li>• Reduced motion support for accessibility</li>
                <li>• Memoized components to prevent unnecessary re-renders</li>
                <li>• RequestAnimationFrame for smooth animations</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Design Integration</h4>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Consistent with existing Card component patterns</li>
                <li>• Lucide icons with proper sizing and accessibility</li>
                <li>• Badge integration following existing variants</li>
                <li>• Responsive grid with customizable breakpoints</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}