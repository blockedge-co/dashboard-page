"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  BarChart3,
  Users,
  Target,
  Globe,
  Zap,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  Layers,
  PieChart,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

const marketData = [
  { month: "Jan", price: 45, volume: 120, sentiment: 72, prediction: 48 },
  { month: "Feb", price: 52, volume: 145, sentiment: 78, prediction: 54 },
  { month: "Mar", price: 48, volume: 135, sentiment: 65, prediction: 51 },
  { month: "Apr", price: 61, volume: 180, sentiment: 85, prediction: 63 },
  { month: "May", price: 58, volume: 165, sentiment: 80, prediction: 60 },
  { month: "Jun", price: 67, volume: 200, sentiment: 88, prediction: 69 },
  { month: "Jul", price: 72, volume: 220, sentiment: 90, prediction: 74 },
  { month: "Aug", price: 78, volume: 250, sentiment: 92, prediction: 80 },
]

const institutionalFlow = [
  { institution: "BlackRock", flow: 15000000, type: "accumulation", change: "+12.4%" },
  { institution: "Vanguard", flow: -8000000, type: "distribution", change: "-5.2%" },
  { institution: "State Street", flow: 12000000, type: "new_position", change: "+8.7%" },
  { institution: "Fidelity", flow: 6500000, type: "accumulation", change: "+3.1%" },
  { institution: "JPMorgan", flow: -4200000, type: "distribution", change: "-2.8%" },
]

const esgMetrics = [
  { category: "Environmental", score: 94, trend: "+2.1%" },
  { category: "Social", score: 87, trend: "+1.8%" },
  { category: "Governance", score: 91, trend: "+0.9%" },
  { category: "Overall ESG", score: 91, trend: "+1.6%" },
]

const riskAssessment = [
  { risk: "Regulatory Risk", level: "Low", score: 15, color: "emerald" },
  { risk: "Market Risk", level: "Medium", score: 45, color: "yellow" },
  { risk: "Liquidity Risk", level: "Low", score: 25, color: "emerald" },
  { risk: "Credit Risk", level: "Very Low", score: 8, color: "emerald" },
  { risk: "Operational Risk", level: "Medium", score: 35, color: "yellow" },
]

const portfolioAllocation = [
  { sector: "Renewable Energy", allocation: 45, value: "$21.2M", change: "+8.4%" },
  { sector: "Forest Conservation", allocation: 30, value: "$14.1M", change: "+12.1%" },
  { sector: "Blue Carbon", allocation: 15, value: "$7.1M", change: "+6.7%" },
  { sector: "Carbon Removal", allocation: 10, value: "$4.7M", change: "+15.3%" },
]

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("predictive")
  const [realTimeData, setRealTimeData] = useState(marketData)

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prevData) => {
        return prevData.map((item) => ({
          ...item,
          price: item.price * (1 + (Math.random() * 0.02 - 0.01)),
          volume: item.volume * (1 + (Math.random() * 0.03 - 0.015)),
          sentiment: Math.max(0, Math.min(100, item.sentiment + (Math.random() * 4 - 2))),
        }))
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Intelligence Analytics
            </h1>
            <p className="text-slate-400 mt-2">
              Advanced market intelligence and predictive analytics for carbon credit markets
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-700/50">
              <Brain className="w-4 h-4 mr-2" />
              AI Insights
            </Button>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Prediction Accuracy",
              value: "94.2%",
              change: "+2.1%",
              icon: Brain,
              color: "from-emerald-500 to-teal-600",
            },
            {
              title: "Market Volatility",
              value: "12.4%",
              change: "-1.8%",
              icon: Activity,
              color: "from-teal-500 to-cyan-600",
            },
            {
              title: "Institutional Flow",
              value: "$47.2M",
              change: "+15.6%",
              icon: Users,
              color: "from-cyan-500 to-sky-600",
            },
            { title: "Risk Score", value: "Low", change: "Stable", icon: Target, color: "from-sky-500 to-indigo-600" },
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
                      <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {metric.change.startsWith("+") ? (
                          <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                        ) : metric.change.startsWith("-") ? (
                          <ArrowDownRight className="w-3 h-3 text-red-400" />
                        ) : null}
                        <span
                          className={`text-xs ${
                            metric.change.startsWith("+")
                              ? "text-emerald-400"
                              : metric.change.startsWith("-")
                                ? "text-red-400"
                                : "text-slate-400"
                          }`}
                        >
                          {metric.change}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r ${metric.color} flex items-center justify-center`}
                    >
                      <metric.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Analytics Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl blur-xl" />
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/70 backdrop-blur-md border border-white/5 rounded-xl p-1">
              <TabsTrigger
                value="predictive"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg"
              >
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">Predictive Models</span>
                <span className="sm:hidden">Predictive</span>
              </TabsTrigger>
              <TabsTrigger
                value="institutional"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Institutional Flow</span>
                <span className="sm:hidden">Institutional</span>
              </TabsTrigger>
              <TabsTrigger
                value="esg"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg"
              >
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">ESG Impact</span>
                <span className="sm:hidden">ESG</span>
              </TabsTrigger>
              <TabsTrigger
                value="risk"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg"
              >
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Risk Assessment</span>
                <span className="sm:hidden">Risk</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Predictive Models Tab */}
          <TabsContent value="predictive" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Carbon Price Prediction
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    ML-driven 6-month price forecasting with 94.2% accuracy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer
                      config={{
                        price: {
                          label: "Actual Price",
                          color: "hsl(var(--chart-1))",
                        },
                        prediction: {
                          label: "Predicted Price",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={realTimeData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="month" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="price"
                            name="Actual Price"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2 }}
                            activeDot={{ r: 6, strokeWidth: 2 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="prediction"
                            name="Predicted Price"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            strokeDasharray="8 8"
                            dot={{ r: 3, strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                    Market Sentiment Analysis
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Real-time sentiment tracking across news, social media, and trading data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-emerald-400 mb-2">92%</div>
                      <div className="text-slate-400">Current Sentiment Score</div>
                      <Badge className="mt-2 bg-emerald-900/50 text-emerald-400 border-emerald-500/30">
                        Extremely Bullish
                      </Badge>
                    </div>
                    <div className="h-40">
                      <ChartContainer
                        config={{
                          sentiment: {
                            label: "Sentiment Score",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                        className="h-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={realTimeData}>
                            <defs>
                              <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="month" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Area
                              type="monotone"
                              dataKey="sentiment"
                              stroke="#10b981"
                              fillOpacity={1}
                              fill="url(#colorSentiment)"
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  AI Model Performance
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time performance metrics of our machine learning models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { model: "Price Prediction", accuracy: 94.2, confidence: 98.1, status: "Active" },
                    { model: "Sentiment Analysis", accuracy: 89.7, confidence: 92.4, status: "Active" },
                    { model: "Risk Assessment", accuracy: 91.3, confidence: 95.8, status: "Active" },
                  ].map((model, index) => (
                    <motion.div
                      key={model.model}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-slate-800/80 border border-slate-700/50 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-white">{model.model}</h3>
                        <Badge className="bg-emerald-900/50 text-emerald-400 border-emerald-500/30">
                          {model.status}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Accuracy</span>
                            <span className="text-white font-medium">{model.accuracy}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${model.accuracy}%` }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Confidence</span>
                            <span className="text-white font-medium">{model.confidence}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${model.confidence}%` }}
                              transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                              className="bg-gradient-to-r from-cyan-500 to-sky-500 h-2 rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Institutional Flow Tab */}
          <TabsContent value="institutional" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="w-5 h-5 text-emerald-400" />
                    Institutional Money Flow
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Real-time tracking of large institutional movements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {institutionalFlow.map((flow, index) => (
                      <motion.div
                        key={flow.institution}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          flow.type === "accumulation"
                            ? "bg-emerald-900/30 border-emerald-800/50"
                            : flow.type === "distribution"
                              ? "bg-red-900/30 border-red-800/50"
                              : "bg-blue-900/30 border-blue-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.7, 1, 0.7],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                            className={`w-2 h-2 rounded-full ${
                              flow.type === "accumulation"
                                ? "bg-emerald-400"
                                : flow.type === "distribution"
                                  ? "bg-red-400"
                                  : "bg-blue-400"
                            }`}
                          />
                          <div>
                            <div className="font-medium text-white">{flow.institution}</div>
                            <div
                              className={`text-sm ${
                                flow.type === "accumulation"
                                  ? "text-emerald-300"
                                  : flow.type === "distribution"
                                    ? "text-red-300"
                                    : "text-blue-300"
                              }`}
                            >
                              {flow.type === "accumulation"
                                ? "Large Accumulation"
                                : flow.type === "distribution"
                                  ? "Distribution"
                                  : "New Position"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-white">
                            {flow.flow > 0 ? "+" : ""}${(Math.abs(flow.flow) / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-xs text-slate-400">{flow.change}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                    Volume Analysis
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Trading volume patterns and institutional activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer
                      config={{
                        volume: {
                          label: "Trading Volume",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={realTimeData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="month" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="volume" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <PieChart className="w-5 h-5 text-emerald-400" />
                  Portfolio Allocation Analysis
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Institutional portfolio distribution across carbon credit sectors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {portfolioAllocation.map((sector, index) => (
                      <motion.div
                        key={sector.sector}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-slate-800/80 border border-slate-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                              index === 0
                                ? "from-emerald-500 to-teal-600"
                                : index === 1
                                  ? "from-teal-500 to-cyan-600"
                                  : index === 2
                                    ? "from-cyan-500 to-sky-600"
                                    : "from-sky-500 to-indigo-600"
                            }`}
                          />
                          <div>
                            <div className="font-medium text-white">{sector.sector}</div>
                            <div className="text-sm text-slate-400">{sector.allocation}% allocation</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-white">{sector.value}</div>
                          <div className="text-xs text-emerald-400">{sector.change}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {portfolioAllocation.map((sector, index) => {
                          const startAngle =
                            portfolioAllocation.slice(0, index).reduce((sum, s) => sum + s.allocation, 0) * 3.6
                          const endAngle = startAngle + sector.allocation * 3.6
                          const largeArcFlag = sector.allocation > 50 ? 1 : 0
                          const x1 = 50 + 40 * Math.cos(((startAngle - 90) * Math.PI) / 180)
                          const y1 = 50 + 40 * Math.sin(((startAngle - 90) * Math.PI) / 180)
                          const x2 = 50 + 40 * Math.cos(((endAngle - 90) * Math.PI) / 180)
                          const y2 = 50 + 40 * Math.sin(((endAngle - 90) * Math.PI) / 180)

                          return (
                            <motion.path
                              key={sector.sector}
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              d={`M 50,50 L ${x1},${y1} A 40,40 0 ${largeArcFlag},1 ${x2},${y2} z`}
                              fill={
                                index === 0 ? "#10b981" : index === 1 ? "#0d9488" : index === 2 ? "#0891b2" : "#0284c7"
                              }
                              stroke="#1e293b"
                              strokeWidth="1"
                            />
                          )
                        })}
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">$47.1M</div>
                          <div className="text-xs text-slate-400">Total AUM</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ESG Impact Tab */}
          <TabsContent value="esg" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Target className="w-5 h-5 text-emerald-400" />
                    ESG Performance Metrics
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Comprehensive ESG scoring across all portfolio holdings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {esgMetrics.map((metric, index) => (
                      <motion.div
                        key={metric.category}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-300">{metric.category}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-white">{metric.score}</span>
                            <span className="text-xs text-emerald-400">{metric.trend}</span>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${metric.score}%` }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Globe className="w-5 h-5 text-emerald-400" />
                    Global Impact Metrics
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Real-world environmental and social impact measurements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      <div className="text-3xl font-bold text-emerald-400">8.7M</div>
                      <div className="text-sm text-slate-400 mt-1">Tons CO2 Reduced</div>
                      <div className="text-xs text-emerald-400 mt-1">+12% this quarter</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="text-center"
                    >
                      <div className="text-3xl font-bold text-emerald-400">156K</div>
                      <div className="text-sm text-slate-400 mt-1">Jobs Created</div>
                      <div className="text-xs text-emerald-400 mt-1">+8% this quarter</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-center"
                    >
                      <div className="text-3xl font-bold text-emerald-400">2.1M</div>
                      <div className="text-sm text-slate-400 mt-1">Hectares Protected</div>
                      <div className="text-xs text-emerald-400 mt-1">+15% this quarter</div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="text-center"
                    >
                      <div className="text-3xl font-bold text-emerald-400">15/17</div>
                      <div className="text-sm text-slate-400 mt-1">SDG Goals</div>
                      <div className="text-xs text-emerald-400 mt-1">88% coverage</div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  Impact Attribution Analysis
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Detailed breakdown of environmental and social impact by project type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      impact: {
                        label: "CO2 Impact (K tons)",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={realTimeData}>
                        <defs>
                          <linearGradient id="colorImpactAnalysis" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="month" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="volume"
                          stroke="#10b981"
                          fillOpacity={1}
                          fill="url(#colorImpactAnalysis)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Assessment Tab */}
          <TabsContent value="risk" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    Risk Assessment Matrix
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Comprehensive risk analysis across multiple dimensions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {riskAssessment.map((risk, index) => (
                      <motion.div
                        key={risk.risk}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-slate-800/80 border border-slate-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              risk.color === "emerald"
                                ? "bg-emerald-500"
                                : risk.color === "yellow"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          />
                          <div>
                            <div className="font-medium text-white">{risk.risk}</div>
                            <div className="text-sm text-slate-400">{risk.level} Risk</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-white">{risk.score}%</div>
                          <div className="w-20 h-2 bg-slate-700 rounded-full mt-1">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${risk.score}%` }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              className={`h-full rounded-full ${
                                risk.color === "emerald"
                                  ? "bg-emerald-500"
                                  : risk.color === "yellow"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    Value at Risk (VaR)
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Portfolio risk metrics and stress testing results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">$2.1M</div>
                        <div className="text-sm text-slate-400">1-Day VaR (95%)</div>
                        <div className="text-xs text-emerald-400 mt-1">4.4% of portfolio</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">$8.7M</div>
                        <div className="text-sm text-slate-400">1-Month VaR (95%)</div>
                        <div className="text-xs text-orange-400 mt-1">18.4% of portfolio</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Stress Test: Market Crash</span>
                        <span className="text-sm font-medium text-red-400">-15.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Stress Test: Regulatory Change</span>
                        <span className="text-sm font-medium text-orange-400">-8.7%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Stress Test: Liquidity Crisis</span>
                        <span className="text-sm font-medium text-yellow-400">-12.1%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Risk-Adjusted Returns
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Performance metrics adjusted for risk exposure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400">1.47</div>
                    <div className="text-sm text-slate-400 mt-1">Sharpe Ratio</div>
                    <div className="text-xs text-emerald-400 mt-1">Excellent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400">0.89</div>
                    <div className="text-sm text-slate-400 mt-1">Beta</div>
                    <div className="text-xs text-emerald-400 mt-1">Low correlation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400">12.4%</div>
                    <div className="text-sm text-slate-400 mt-1">Max Drawdown</div>
                    <div className="text-xs text-orange-400 mt-1">Moderate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
