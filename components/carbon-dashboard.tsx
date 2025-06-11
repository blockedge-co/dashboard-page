"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  Globe,
  BarChart3,
  Search,
  Shield,
  MapPin,
  Leaf,
  Building2,
  Users,
  DollarSign,
  Activity,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Award,
  Eye,
  Lock,
  Briefcase,
  Target,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { co2eApi } from "@/lib/co2e-api"
import { initializeProjectData } from "@/lib/project-data-manager"

const marketData = [
  { month: "Jan", price: 45, volume: 120, sentiment: 72 },
  { month: "Feb", price: 52, volume: 145, sentiment: 78 },
  { month: "Mar", price: 48, volume: 135, sentiment: 65 },
  { month: "Apr", price: 61, volume: 180, sentiment: 85 },
  { month: "May", price: 58, volume: 165, sentiment: 80 },
  { month: "Jun", price: 67, volume: 200, sentiment: 88 },
  { month: "Jul", price: 72, volume: 220, sentiment: 90 },
  { month: "Aug", price: 78, volume: 250, sentiment: 92 },
]

const projects = [
  {
    id: 1,
    name: "Amazon Rainforest Conservation",
    location: "Brazil",
    type: "Forest Conservation",
    tokens: "450K",
    impact: "2.1M tons CO2",
    rating: "AAA",
    compliance: ["EU Taxonomy", "TCFD", "SBTi"],
    backing: "Goldman Sachs, BlackRock",
    liquidity: "High",
    vintage: "2024",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 2,
    name: "Solar Farm Initiative",
    location: "India",
    type: "Renewable Energy",
    tokens: "320K",
    impact: "1.8M tons CO2",
    rating: "AA+",
    compliance: ["CDP", "GRI", "SASB"],
    backing: "JPMorgan, Vanguard",
    liquidity: "Medium",
    vintage: "2023",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 3,
    name: "Wind Power Development",
    location: "Denmark",
    type: "Renewable Energy",
    tokens: "280K",
    impact: "1.5M tons CO2",
    rating: "AA",
    compliance: ["EU Taxonomy", "TCFD"],
    backing: "Deutsche Bank, UBS",
    liquidity: "High",
    vintage: "2024",
    image: "/placeholder.svg?height=400&width=600",
  },
]

const transactions = [
  {
    id: "TX001",
    type: "Corporate Purchase",
    company: "Microsoft Corp",
    amount: "50K tokens",
    value: "$2.1M",
    project: "Amazon Conservation",
    timestamp: "2 hours ago",
    status: "Completed",
  },
  {
    id: "TX002",
    type: "Government Procurement",
    company: "EU Commission",
    amount: "125K tokens",
    value: "$5.8M",
    project: "Solar Farm Initiative",
    timestamp: "4 hours ago",
    status: "Pending",
  },
  {
    id: "TX003",
    type: "Institutional Trade",
    company: "BlackRock",
    amount: "200K tokens",
    value: "$9.2M",
    project: "Wind Power Development",
    timestamp: "6 hours ago",
    status: "Completed",
  },
]

const complianceData = [
  { jurisdiction: "EU", status: "Compliant", score: 98, alerts: 0 },
  { jurisdiction: "US", status: "Compliant", score: 95, alerts: 1 },
  { jurisdiction: "UK", status: "Compliant", score: 97, alerts: 0 },
  { jurisdiction: "APAC", status: "Review", score: 89, alerts: 3 },
]

export function CarbonDashboard() {
  const [activeTab, setActiveTab] = useState("portfolio")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [realData, setRealData] = useState(co2eApi.getRealDashboardData())
  const [projects, setProjects] = useState<any[]>([])
  const [projectStats, setProjectStats] = useState<any>(null)
  const [animatedMetrics, setAnimatedMetrics] = useState(realData.heroMetrics.map(() => 0))

  // Fetch real data on component mount
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const [transactions, blocks, stats, projectsData, projectStatsData] = await Promise.all([
          co2eApi.getMainPageTransactions(),
          co2eApi.getMainPageBlocks(),
          co2eApi.getStats(),
          co2eApi.getProjects(),
          co2eApi.getProjectStats()
        ])
        
        // Update projects data
        setProjects(projectsData)
        setProjectStats(projectStatsData)
        
        // Update with real data if available
        setRealData(prev => ({
          ...prev,
          recentTransactions: transactions.slice(0, 6).map((tx, index) => ({
            id: `TX${(index + 1).toString().padStart(3, '0')}`,
            type: tx.method || "Contract Call",
            hash: tx.hash,
            amount: `${tx.value || "0"} CO2E`,
            value: tx.value || "0",
            from: tx.from?.hash || "",
            to: tx.to?.hash || "",
            timestamp: tx.timestamp || "Recently",
            status: tx.status || "Success",
          })),
          recentBlocks: blocks.slice(0, 5).map(block => ({
            number: block.number,
            timestamp: block.timestamp,
            transactions: block.transaction_count,
            gasUsed: block.gas_used,
            gasLimit: block.gas_limit
          })),
          heroMetrics: [
            {
              title: "Total Projects",
              value: projectStatsData.total.toString(),
              change: "+8.7%",
              trend: "up" as const,
              icon: Leaf,
              pulse: true,
              color: "from-teal-500 to-cyan-600",
            },
            {
              title: "CO2 Reduction", 
              value: `${projectStatsData.totalCO2Reduction} tons`,
              change: "+23",
              trend: "up" as const,
              icon: Award,
              pulse: false,
              color: "from-cyan-500 to-sky-600",
            },
            {
              title: "Total Blocks",
              value: stats.total_blocks || realData.heroMetrics[2].value,
              change: "+5.2%",
              trend: "up" as const,
              icon: Building2,
              pulse: true,
              color: "from-sky-500 to-indigo-600",
            },
            {
              title: "Average Rating",
              value: projectStatsData.averageRating.toFixed(1),
              change: "+0.1",
              trend: "up" as const,
              icon: DollarSign,
              pulse: true,
              color: "from-emerald-500 to-teal-600",
            }
          ]
        }))
      } catch (error) {
        console.error('Error fetching real data:', error)
      }
    }

    fetchRealData()
  }, [])

  // Animate metrics on load
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedMetrics((prev) => {
        const newValues = [...prev]
        realData.heroMetrics.forEach((_, index) => {
          if (newValues[index] < 100) {
            newValues[index] += 5
            if (newValues[index] > 100) newValues[index] = 100
          }
        })
        return newValues
      })
    }, 50)

    return () => clearInterval(interval)
  }, [realData.heroMetrics])

  // Simulate real-time data updates with CO2e chain data
  const [marketDataState, setMarketDataState] = useState(co2eApi.generateMarketData())
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketDataState((prevData) => {
        return prevData.map((item) => ({
          ...item,
          price: item.price * (1 + (Math.random() * 0.02 - 0.01)),
          volume: item.volume * (1 + (Math.random() * 0.03 - 0.015)),
        }))
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // 3D card effect refs
  const card1Ref = useRef(null)
  const card2Ref = useRef(null)
  const card3Ref = useRef(null)
  const card4Ref = useRef(null)

  // Handle 3D card effect
  const handleMouseMove = (e, ref) => {
    if (!ref.current) return
    const card = ref.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }

  const handleMouseLeave = (ref) => {
    if (!ref.current) return
    ref.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero Metrics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          CO2e Chain Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {realData.heroMetrics.map((metric, index) => (
            <motion.div
              key={index}
              ref={[card1Ref, card2Ref, card3Ref, card4Ref][index]}
              onMouseMove={(e) => handleMouseMove(e, [card1Ref, card2Ref, card3Ref, card4Ref][index])}
              onMouseLeave={() => handleMouseLeave([card1Ref, card2Ref, card3Ref, card4Ref][index])}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-70" />
              <Card className="relative overflow-hidden bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:bg-slate-800/70">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">{metric.title}</p>
                      <div className="h-8 flex items-end">
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                          className="text-3xl font-bold text-white"
                        >
                          {animatedMetrics[index] === 100 ? metric.value : "—"}
                        </motion.p>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {metric.trend === "up" ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                          >
                            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                          </motion.div>
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-400" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            metric.trend === "up" ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {metric.change}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${metric.color} flex items-center justify-center shadow-lg`}
                      >
                        <metric.icon className="w-6 h-6 text-white" />
                      </div>
                      {metric.pulse && (
                        <motion.div
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0.2, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                          className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"
                        />
                      )}
                    </div>
                  </div>
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${animatedMetrics[index]}%` }}
                    className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-4"
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Market Intelligence Center */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
          <CardHeader className="border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  CO2e Chain Analytics
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time blockchain metrics and transaction analysis for CO2e Chain network
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-700/50">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-80">
                  <ChartContainer
                    config={{
                      price: {
                        label: "Price ($)",
                        color: "hsl(var(--chart-1))",
                      },
                      volume: {
                        label: "Volume",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={marketDataState}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
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
                          dataKey="price"
                          stroke="#10b981"
                          fillOpacity={1}
                          fill="url(#colorPrice)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
              <div className="space-y-4">
                <Card className="bg-slate-800/80 border-slate-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-400">Gas Price</span>
                      <motion.span
                        animate={{
                          color: ["#10b981", "#34d399", "#10b981"],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="text-lg font-bold text-emerald-500"
                      >
                        {realData.networkStats.gasPrice}
                      </motion.span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                      <span className="text-xs text-emerald-400">+15.5% (24h)</span>
                    </div>
                    <div className="mt-2">
                      <div className="h-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={marketDataState.slice(-5)}>
                            <Line
                              type="monotone"
                              dataKey="price"
                              stroke="#10b981"
                              strokeWidth={2}
                              dot={false}
                              isAnimationActive={true}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/80 border-slate-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-400">Network Utilization</span>
                      <span className="text-lg font-bold text-emerald-500">{realData.networkStats.networkUtilization}</span>
                    </div>
                    <div className="mt-2 relative">
                      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "88%" }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-slate-500">
                        <span>Bearish</span>
                        <span>Neutral</span>
                        <span>Bullish</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/80 border-slate-700/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-400">Daily Transactions</span>
                      <span className="text-lg font-bold text-white">{realData.networkStats.dailyTransactions}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                      <span className="text-xs text-emerald-400">+8.2%</span>
                    </div>
                    <div className="mt-2">
                      <div className="h-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={marketDataState.slice(-5)}>
                            <defs>
                              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <Area
                              type="monotone"
                              dataKey="volume"
                              stroke="#0d9488"
                              fill="url(#colorVolume)"
                              strokeWidth={2}
                              dot={false}
                              isAnimationActive={true}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl blur-xl" />
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/70 backdrop-blur-md border border-white/5 rounded-xl p-1">
              <TabsTrigger
                value="portfolio"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">Global Portfolio</span>
                <span className="sm:hidden">Portfolio</span>
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Intelligence Analytics</span>
                <span className="sm:hidden">Analytics</span>
              </TabsTrigger>
              <TabsTrigger
                value="explorer"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Institutional Explorer</span>
                <span className="sm:hidden">Explorer</span>
              </TabsTrigger>
              <TabsTrigger
                value="compliance"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Compliance & Governance</span>
                <span className="sm:hidden">Compliance</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Global Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
              <CardHeader className="border-b border-slate-700/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Globe className="w-5 h-5 text-emerald-400" />
                      Project Command Center
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Enterprise project management with AI-powered recommendations
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger className="w-48 bg-slate-900/80 border-slate-700 text-slate-300">
                        <SelectValue placeholder="Filter projects" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-slate-300">
                        <SelectItem value="all">All Projects</SelectItem>
                        <SelectItem value="renewable">Renewable Energy</SelectItem>
                        <SelectItem value="forest">Forest Conservation</SelectItem>
                        <SelectItem value="industrial">Industrial Efficiency</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-slate-700 text-slate-300 hover:bg-slate-700/50"
                    >
                      <Filter className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-slate-700 text-slate-300 hover:bg-slate-700/50"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {(projects.length > 0 ? projects.slice(0, 6) : realData.projects || []).map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="bg-slate-800/80 border-slate-700/50 overflow-hidden hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
                        <div className="relative h-40 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
                          <img
                            src={project.images?.thumbnail || project.image || "/placeholder.svg"}
                            alt={project.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />
                          <div className="absolute top-2 right-2 z-20">
                            <Badge
                              variant="outline"
                              className="bg-emerald-900/80 text-emerald-400 border-emerald-500/30 backdrop-blur-sm"
                            >
                              {project.rating || "N/A"}
                            </Badge>
                          </div>
                          <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-300" />
                            <span className="text-xs text-slate-300">{project.location}</span>
                          </div>
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-white">{project.name}</CardTitle>
                          <CardDescription className="text-slate-400">{project.type}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-500">Current Supply</span>
                              <p className="font-semibold text-white">{project.currentSupply || project.tokens || "N/A"}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">CO2 Impact</span>
                              <p className="font-semibold text-white">{project.co2Reduction?.total ? `${parseInt(project.co2Reduction.total).toLocaleString()} tons` : project.impact || "N/A"}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Liquidity</span>
                              <p className="font-semibold text-white capitalize">{project.liquidity || "Medium"}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Vintage</span>
                              <p className="font-semibold text-white">{project.vintage || "2024"}</p>
                            </div>
                          </div>

                          <div>
                            <span className="text-sm text-slate-500">Compliance</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(project.compliance || ["EU Taxonomy", "TCFD"]).map((badge) => (
                                <Badge
                                  key={badge}
                                  variant="outline"
                                  className="text-xs bg-slate-700/50 text-slate-300 border-slate-600"
                                >
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-sm text-slate-500">Methodology</span>
                            <p className="text-sm font-medium mt-1 text-slate-300">{project.methodology || project.backing || "IREC Standard"}</p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-700 text-slate-300 hover:bg-slate-700/50"
                            >
                              <Briefcase className="w-3 h-3 mr-1" />
                              Invest
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Intelligence Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Predictive Carbon Pricing
                  </CardTitle>
                  <CardDescription className="text-slate-400">ML-driven forecasting models</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-64">
                    <ChartContainer
                      config={{
                        predicted: {
                          label: "Predicted Price",
                          color: "hsl(var(--chart-1))",
                        },
                        actual: {
                          label: "Actual Price",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={marketDataState}>
                          <defs>
                            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="month" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="price"
                            name="Actual"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            dot={{ r: 4, strokeWidth: 2 }}
                            activeDot={{ r: 6, strokeWidth: 2 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="sentiment"
                            name="Predicted"
                            stroke="#10b981"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ r: 4, strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="w-5 h-5 text-emerald-400" />
                    Institutional Flow Analysis
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Whale movements and accumulation patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center justify-between p-4 bg-emerald-900/30 border border-emerald-800/50 rounded-lg"
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
                          className="w-2 h-2 bg-emerald-400 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-white">Large Accumulation</div>
                          <div className="text-sm text-emerald-300">+$15M in carbon credits</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">BlackRock</div>
                        <div className="text-xs text-slate-400">10 minutes ago</div>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="flex items-center justify-between p-4 bg-orange-900/30 border border-orange-800/50 rounded-lg"
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
                          className="w-2 h-2 bg-orange-400 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-white">Distribution</div>
                          <div className="text-sm text-orange-300">-$8M in carbon credits</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">Vanguard</div>
                        <div className="text-xs text-slate-400">25 minutes ago</div>
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="flex items-center justify-between p-4 bg-emerald-900/30 border border-emerald-800/50 rounded-lg"
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
                          className="w-2 h-2 bg-emerald-400 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-white">New Position</div>
                          <div className="text-sm text-emerald-300">+$12M in carbon credits</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">State Street</div>
                        <div className="text-xs text-slate-400">42 minutes ago</div>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
              <CardHeader className="border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Target className="w-5 h-5 text-emerald-400" />
                      ESG Impact Attribution
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Third-party verified impact scoring across portfolios
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-slate-800/80 border border-slate-700/50 rounded-lg p-6 text-center"
                  >
                    <div className="relative mb-4">
                      <div className="w-24 h-24 mx-auto">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#1e293b"
                            strokeWidth="10"
                            strokeLinecap="round"
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray="282.7"
                            initial={{ strokeDashoffset: 282.7 }}
                            animate={{ strokeDashoffset: 282.7 * (1 - 94.2 / 100) }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 1 }}
                          >
                            <div className="text-3xl font-bold text-emerald-400">94.2</div>
                            <div className="text-xs text-slate-400">ESG Score</div>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-slate-800/80 border border-slate-700/50 rounded-lg p-6 text-center"
                  >
                    <div className="text-3xl font-bold text-emerald-400">8.7M</div>
                    <div className="text-sm text-slate-400 mt-1">Tons CO2 Reduced</div>
                    <div className="text-xs text-emerald-400 mt-1">+12% this quarter</div>
                    <div className="mt-4 h-16">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={marketDataState}>
                          <defs>
                            <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="volume"
                            stroke="#10b981"
                            fill="url(#colorImpact)"
                            strokeWidth={2}
                            dot={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-slate-800/80 border border-slate-700/50 rounded-lg p-6 text-center"
                  >
                    <div className="text-3xl font-bold text-emerald-400">156</div>
                    <div className="text-sm text-slate-400 mt-1">SDG Alignment</div>
                    <div className="text-xs text-emerald-400 mt-1">15 of 17 goals</div>
                    <div className="mt-4 flex flex-wrap justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                          className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white"
                        >
                          {i}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Institutional Explorer Tab */}
          <TabsContent value="explorer" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
              <CardHeader className="border-b border-slate-700/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Search className="w-5 h-5 text-emerald-400" />
                      Professional Transaction Interface
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Advanced query builder with natural language processing
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        placeholder="Search transactions, companies, or projects..."
                        className="w-full sm:w-80 pl-9 bg-slate-900/80 border-slate-700 text-slate-300 focus:border-emerald-500"
                      />
                    </div>
                    <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {realData.recentTransactions.map((tx, index) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-slate-800/80 border border-slate-700/50 rounded-lg hover:bg-slate-700/50 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{tx.hash.substring(0, 10)}...{tx.hash.slice(-4)}</div>
                          <div className="text-sm text-slate-400">
                            {tx.type} • {tx.from ? `${tx.from.substring(0, 6)}...${tx.from.slice(-4)}` : 'Unknown'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">{tx.amount}</div>
                        <div className="text-sm text-slate-400">{tx.timestamp}</div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={tx.status === "Success" ? "default" : "secondary"}
                          className={
                            tx.status === "Success"
                              ? "bg-emerald-900/50 text-emerald-400 border-emerald-500/30"
                              : "bg-orange-900/50 text-orange-400 border-orange-500/30"
                          }
                        >
                          {tx.status}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    Whale Alert System
                  </CardTitle>
                  <CardDescription className="text-slate-400">Large institutional movements</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center gap-3 p-3 bg-red-900/30 border border-red-800/50 rounded-lg"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        className="w-2 h-2 bg-red-400 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white">Large Sale Alert</div>
                        <div className="text-sm text-red-300">JPMorgan sold 500K tokens ($23M)</div>
                      </div>
                      <span className="text-xs text-slate-500">5m ago</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="flex items-center gap-3 p-3 bg-emerald-900/30 border border-emerald-800/50 rounded-lg"
                    >
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        className="w-2 h-2 bg-emerald-400 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white">Large Purchase Alert</div>
                        <div className="text-sm text-emerald-300">Microsoft bought 750K tokens ($35M)</div>
                      </div>
                      <span className="text-xs text-slate-500">12m ago</span>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="w-5 h-5 text-emerald-400" />
                    Cross-Chain Activity
                  </CardTitle>
                  <CardDescription className="text-slate-400">Multi-blockchain transaction monitoring</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { name: "Ethereum", value: 75, color: "from-blue-500 to-blue-600" },
                      { name: "Polygon", value: 45, color: "from-purple-500 to-purple-600" },
                      { name: "Binance Smart Chain", value: 30, color: "from-yellow-500 to-yellow-600" },
                    ].map((chain, index) => (
                      <motion.div
                        key={chain.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${chain.color}`} />
                          <span className="text-sm text-slate-300">{chain.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${chain.value}%` }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              className={`h-full bg-gradient-to-r ${chain.color}`}
                            />
                          </div>
                          <span className="text-sm font-medium text-white w-8">{chain.value}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compliance & Governance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
              <CardHeader className="border-b border-slate-700/50">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  Regulatory Command Center
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Real-time compliance monitoring across 47 jurisdictions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {complianceData.map((item, index) => (
                    <motion.div
                      key={item.jurisdiction}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="bg-slate-800/80 border-slate-700/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-white">{item.jurisdiction}</span>
                            <Badge
                              variant={item.status === "Compliant" ? "default" : "secondary"}
                              className={
                                item.status === "Compliant"
                                  ? "bg-emerald-900/50 text-emerald-400 border-emerald-500/30"
                                  : "bg-orange-900/50 text-orange-400 border-orange-500/30"
                              }
                            >
                              {item.status}
                            </Badge>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-400">Compliance Score</span>
                              <span className="font-medium text-white">{item.score}%</span>
                            </div>
                            <div className="relative">
                              <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.score}%` }}
                                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                  className={`h-full ${
                                    item.score >= 95
                                      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                                      : item.score >= 90
                                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                        : "bg-gradient-to-r from-red-500 to-red-600"
                                  }`}
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-400">Active Alerts</span>
                              <span
                                className={`font-medium ${item.alerts > 0 ? "text-orange-400" : "text-emerald-400"}`}
                              >
                                {item.alerts}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Lock className="w-5 h-5 text-emerald-400" />
                    Automated Audit Trail
                  </CardTitle>
                  <CardDescription className="text-slate-400">Enterprise-grade security and compliance</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { name: "SOC 2 Type II", status: "Certified", icon: Award },
                      { name: "ISO 27001", status: "Certified", icon: Shield },
                      { name: "GDPR Compliance", status: "Active", icon: Lock },
                    ].map((cert, index) => (
                      <motion.div
                        key={cert.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-slate-800/80 border border-slate-700/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-900/50 rounded-lg flex items-center justify-center">
                            <cert.icon className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{cert.name}</div>
                            <div className="text-sm text-slate-400">{cert.status}</div>
                          </div>
                        </div>
                        <Badge className="bg-emerald-900/50 text-emerald-400 border-emerald-500/30">Active</Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-700/50">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <RefreshCw className="w-5 h-5 text-emerald-400" />
                    Third-Party Verification
                  </CardTitle>
                  <CardDescription className="text-slate-400">Big 4 accounting firm integration</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { name: "PwC Carbon Audit", period: "Q4 2024 Review", status: "Passed" },
                      { name: "KPMG ESG Verification", period: "Annual Assessment", status: "In Progress" },
                      { name: "Deloitte Risk Assessment", period: "Quarterly Review", status: "Scheduled" },
                    ].map((audit, index) => (
                      <motion.div
                        key={audit.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-slate-800/80 border border-slate-700/50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-white">{audit.name}</div>
                          <div className="text-sm text-slate-400">{audit.period}</div>
                        </div>
                        <Badge
                          className={
                            audit.status === "Passed"
                              ? "bg-emerald-900/50 text-emerald-400 border-emerald-500/30"
                              : audit.status === "In Progress"
                                ? "bg-orange-900/50 text-orange-400 border-orange-500/30"
                                : "bg-slate-700/50 text-slate-400 border-slate-600/30"
                          }
                        >
                          {audit.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
