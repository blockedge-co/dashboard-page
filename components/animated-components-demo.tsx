"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Activity,
  Leaf,
  Globe,
  Zap,
  Target
} from "lucide-react";
import {
  AnimatedCounter,
  EnhancedMetricCard,
  AnimatedProgressBar,
  MultiProgressBar,
  RealTimeIndicator,
  InteractiveChartTooltip,
  ChartHoverEffect
} from "./animated-components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AnimatedComponentsDemo() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "loading">("connected");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setConnectionStatus("loading");
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setConnectionStatus("connected");
    setLastUpdate(new Date());
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Animated Components Demo
          </h1>
          <p className="text-xl text-slate-300">
            Showcasing reusable animated components for the BlockEdge Dashboard
          </p>
        </div>

        {/* Real-time Status */}
        <div className="flex justify-center">
          <RealTimeIndicator
            status={connectionStatus}
            lastUpdate={lastUpdate}
            onRefresh={handleRefresh}
            variant="card"
            showSignalStrength={true}
            signalStrength={85}
            autoRefresh={true}
            refreshInterval={30}
            dataUsage={{
              sent: 245,
              received: 1856,
              unit: "KB"
            }}
          />
        </div>

        {/* Animated Counters */}
        <Card className="bg-slate-800/50 backdrop-blur-md border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Animated Counters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <h3 className="text-sm text-slate-400">Basic Number</h3>
                <AnimatedCounter
                  key={`basic-${refreshKey}`}
                  value={12543}
                  className="text-3xl font-bold text-white"
                  duration={2000}
                />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-sm text-slate-400">Currency</h3>
                <AnimatedCounter
                  key={`currency-${refreshKey}`}
                  value={98750.25}
                  className="text-3xl font-bold text-emerald-400"
                  formatAs="currency"
                  decimals={2}
                  duration={2500}
                  delay={200}
                />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-sm text-slate-400">Percentage</h3>
                <AnimatedCounter
                  key={`percentage-${refreshKey}`}
                  value={87.5}
                  className="text-3xl font-bold text-blue-400"
                  formatAs="percentage"
                  decimals={1}
                  duration={1800}
                  delay={400}
                />
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="text-sm text-slate-400">Compact Format</h3>
                <AnimatedCounter
                  key={`compact-${refreshKey}`}
                  value={2580000}
                  className="text-3xl font-bold text-purple-400"
                  formatAs="compact"
                  decimals={1}
                  duration={2200}
                  delay={600}
                  easing="bounce"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Metric Cards */}
        <Card className="bg-slate-800/50 backdrop-blur-md border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Enhanced Metric Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EnhancedMetricCard
                key={`metric1-${refreshKey}`}
                title="Total Carbon Credits"
                value={2580000}
                icon={Leaf}
                formatAs="compact"
                decimals={1}
                suffix=" tCO₂e"
                trend={{
                  value: 12.5,
                  change: "+12.5%",
                  trend: "up",
                  period: "vs last month"
                }}
                badge={{
                  text: "Active",
                  variant: "outline"
                }}
                variant="detailed"
                interactive={true}
                sparklineData={[65, 78, 82, 95, 88, 92, 100]}
                pulse={true}
              />

              <EnhancedMetricCard
                key={`metric2-${refreshKey}`}
                title="Revenue"
                value={1245890}
                icon={DollarSign}
                formatAs="currency"
                color="from-blue-500 to-purple-600"
                trend={{
                  value: 8.2,
                  change: "+8.2%",
                  trend: "up"
                }}
                variant="default"
                interactive={true}
                delay={0.2}
              />

              <EnhancedMetricCard
                key={`metric3-${refreshKey}`}
                title="Project Completion"
                value={75}
                icon={Target}
                formatAs="number"
                suffix="%"
                color="from-emerald-500 to-green-600"
                variant="progress"
                progress={{
                  value: 75,
                  max: 100,
                  showPercentage: true
                }}
                delay={0.4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Progress Bars */}
        <Card className="bg-slate-800/50 backdrop-blur-md border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Animated Progress Bars</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Single Progress Bars */}
            <div className="space-y-6">
              <AnimatedProgressBar
                key={`progress1-${refreshKey}`}
                value={75}
                label="Carbon Credit Verification"
                icon={Leaf}
                showValue={true}
                showPercentage={true}
                variant="default"
                size="md"
                duration={2000}
              />

              <AnimatedProgressBar
                key={`progress2-${refreshKey}`}
                value={890}
                max={1200}
                label="Monthly Target"
                icon={Target}
                showValue={true}
                variant="glow"
                size="md"
                color="from-purple-500 to-pink-600"
                glowIntensity="high"
                delay={500}
                striped={true}
              />

              <AnimatedProgressBar
                key={`progress3-${refreshKey}`}
                value={65}
                label="Project Portfolio Distribution"
                variant="segmented"
                size="lg"
                segments={[
                  { value: 25, color: "bg-emerald-500", label: "Forest" },
                  { value: 20, color: "bg-blue-500", label: "Renewable" },
                  { value: 15, color: "bg-purple-500", label: "Technology" },
                  { value: 5, color: "bg-yellow-500", label: "Other" }
                ]}
                delay={800}
              />
            </div>

            {/* Multiple Progress Bars */}
            <MultiProgressBar
              title="Project Categories"
              items={[
                {
                  value: 85,
                  label: "Forestry Projects",
                  icon: Leaf,
                  color: "from-emerald-500 to-green-600",
                  showPercentage: true,
                  size: "sm"
                },
                {
                  value: 70,
                  label: "Renewable Energy",
                  icon: Zap,
                  color: "from-blue-500 to-cyan-600",
                  showPercentage: true,
                  size: "sm"
                },
                {
                  value: 60,
                  label: "Technology Solutions",
                  icon: Globe,
                  color: "from-purple-500 to-pink-600",
                  showPercentage: true,
                  size: "sm"
                }
              ]}
            />
          </CardContent>
        </Card>

        {/* Chart Hover Effects */}
        <Card className="bg-slate-800/50 backdrop-blur-md border-white/5">
          <CardHeader>
            <CardTitle className="text-white">Interactive Chart Effects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <ChartHoverEffect
                  key={item}
                  hoverColor="rgba(16, 185, 129, 0.1)"
                  scale={1.05}
                >
                  <Card className="bg-slate-700/50 p-4 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">Chart Item {item}</h3>
                        <p className="text-slate-400 text-sm">Hover to see effect</p>
                      </div>
                    </div>
                  </Card>
                </ChartHoverEffect>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex justify-center">
          <Button
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Restart Animations
          </Button>
        </div>
      </div>
    </div>
  );
}