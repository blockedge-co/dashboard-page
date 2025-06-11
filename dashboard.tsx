"use client"

import { useState } from "react"
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
  Bell,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Award,
  Eye,
  Lock,
  Target,
} from "lucide-react"
import { MoreHorizontal, RefreshCw } from "lucide-react" // Importing MoreHorizontal and RefreshCw

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts" // Removed Pie and Cell from recharts import

const heroMetrics = [
  {
    title: "Total Carbon Value Locked",
    value: "$47.2M",
    change: "+12.4%",
    trend: "up",
    icon: DollarSign,
    pulse: true,
  },
  {
    title: "Active Carbon Tokens",
    value: "2.4M",
    change: "+8.7%",
    trend: "up",
    icon: Leaf,
    pulse: true,
  },
  {
    title: "Verified Projects",
    value: "847",
    change: "+23",
    trend: "up",
    icon: Award,
    pulse: false,
  },
  {
    title: "Corporate Participants",
    value: "156K",
    change: "+5.2%",
    trend: "up",
    icon: Building2,
    pulse: true,
  },
]

const marketData = [
  { month: "Jan", price: 45, volume: 120, sentiment: 72 },
  { month: "Feb", price: 52, volume: 145, sentiment: 78 },
  { month: "Mar", price: 48, volume: 135, sentiment: 65 },
  { month: "Apr", price: 61, volume: 180, sentiment: 85 },
  { month: "May", price: 58, volume: 165, sentiment: 80 },
  { month: "Jun", price: 67, volume: 200, sentiment: 88 },
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

export default function BlockedgeDashboard() {
  const [activeTab, setActiveTab] = useState("portfolio")
  const [selectedFilter, setSelectedFilter] = useState("all")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Blockedge Carbon
              </span>
            </div>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
              Enterprise
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Hero Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {heroMetrics.map((metric, index) => (
            <Card
              key={index}
              className="relative overflow-hidden bg-white/60 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{metric.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {metric.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm font-medium ${metric.trend === "up" ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <metric.icon className="w-8 h-8 text-slate-400" />
                    {metric.pulse && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Market Intelligence Center */}
        <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Market Intelligence Center
            </CardTitle>
            <CardDescription>
              Real-time carbon credit market analysis and institutional trading insights
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                      <AreaChart data={marketData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke="var(--color-price)"
                          fill="var(--color-price)"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current Price</span>
                      <span className="text-lg font-bold text-emerald-600">$67.00</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                      <span className="text-xs text-emerald-600">+15.5% (24h)</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Market Sentiment</span>
                      <span className="text-lg font-bold text-emerald-600">88%</span>
                    </div>
                    <Progress value={88} className="mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">24h Volume</span>
                      <span className="text-lg font-bold">$12.4M</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                      <span className="text-xs text-emerald-600">+8.2%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Global Portfolio
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Intelligence Analytics
            </TabsTrigger>
            <TabsTrigger value="explorer" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Institutional Explorer
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Compliance & Governance
            </TabsTrigger>
          </TabsList>

          {/* Global Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Project Command Center</CardTitle>
                    <CardDescription>Enterprise project management with AI-powered recommendations</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter projects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Projects</SelectItem>
                        <SelectItem value="renewable">Renewable Energy</SelectItem>
                        <SelectItem value="forest">Forest Conservation</SelectItem>
                        <SelectItem value="industrial">Industrial Efficiency</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{project.name}</CardTitle>
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              <span className="text-sm text-slate-600">{project.location}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            {project.rating}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500">Tokens</span>
                            <p className="font-semibold">{project.tokens}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Impact</span>
                            <p className="font-semibold">{project.impact}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Liquidity</span>
                            <p className="font-semibold">{project.liquidity}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Vintage</span>
                            <p className="font-semibold">{project.vintage}</p>
                          </div>
                        </div>

                        <div>
                          <span className="text-sm text-slate-500">Compliance</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.compliance.map((badge) => (
                              <Badge key={badge} variant="secondary" className="text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="text-sm text-slate-500">Institutional Backing</span>
                          <p className="text-sm font-medium mt-1">{project.backing}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Intelligence Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Predictive Carbon Pricing
                  </CardTitle>
                  <CardDescription>ML-driven forecasting models</CardDescription>
                </CardHeader>
                <CardContent>
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
                        <Line data={marketData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </Line>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Institutional Flow Analysis
                  </CardTitle>
                  <CardDescription>Whale movements and accumulation patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="font-medium">Large Accumulation</span>
                      </div>
                      <span className="text-sm text-slate-600">BlackRock +$15M</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                        <span className="font-medium">Distribution</span>
                      </div>
                      <span className="text-sm text-slate-600">Vanguard -$8M</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="font-medium">New Position</span>
                      </div>
                      <span className="text-sm text-slate-600">State Street +$12M</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      ESG Impact Attribution
                    </CardTitle>
                    <CardDescription>Third-party verified impact scoring across portfolios</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">94.2</div>
                    <div className="text-sm text-slate-600">ESG Score</div>
                    <Progress value={94} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">8.7M</div>
                    <div className="text-sm text-slate-600">Tons CO2 Reduced</div>
                    <div className="text-xs text-emerald-600 mt-1">+12% this quarter</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">156</div>
                    <div className="text-sm text-slate-600">SDG Alignment</div>
                    <div className="text-xs text-emerald-600 mt-1">15 of 17 goals</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Institutional Explorer Tab */}
          <TabsContent value="explorer" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5" />
                      Professional Transaction Interface
                    </CardTitle>
                    <CardDescription>Advanced query builder with natural language processing</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input placeholder="Search transactions, companies, or projects..." className="w-80" />
                    <Button>
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-medium">{tx.company}</div>
                          <div className="text-sm text-slate-600">
                            {tx.type} • {tx.project}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{tx.amount}</div>
                        <div className="text-sm text-slate-600">{tx.value}</div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={tx.status === "Completed" ? "default" : "secondary"}
                          className={tx.status === "Completed" ? "bg-emerald-100 text-emerald-700" : ""}
                        >
                          {tx.status}
                        </Badge>
                        <div className="text-sm text-slate-600 mt-1">{tx.timestamp}</div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Whale Alert System
                  </CardTitle>
                  <CardDescription>Large institutional movements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <div className="flex-1">
                        <div className="font-medium">Large Sale Alert</div>
                        <div className="text-sm text-slate-600">JPMorgan sold 500K tokens ($23M)</div>
                      </div>
                      <span className="text-xs text-slate-500">5m ago</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <div className="flex-1">
                        <div className="font-medium">Large Purchase Alert</div>
                        <div className="text-sm text-slate-600">Microsoft bought 750K tokens ($35M)</div>
                      </div>
                      <span className="text-xs text-slate-500">12m ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Cross-Chain Activity
                  </CardTitle>
                  <CardDescription>Multi-blockchain transaction monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ethereum</span>
                      <div className="flex items-center gap-2">
                        <Progress value={75} className="w-20" />
                        <span className="text-sm font-medium">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Polygon</span>
                      <div className="flex items-center gap-2">
                        <Progress value={45} className="w-20" />
                        <span className="text-sm font-medium">45%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Binance Smart Chain</span>
                      <div className="flex items-center gap-2">
                        <Progress value={30} className="w-20" />
                        <span className="text-sm font-medium">30%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compliance & Governance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Regulatory Command Center
                </CardTitle>
                <CardDescription>Real-time compliance monitoring across 47 jurisdictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {complianceData.map((item) => (
                    <Card key={item.jurisdiction}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{item.jurisdiction}</span>
                          <Badge
                            variant={item.status === "Compliant" ? "default" : "secondary"}
                            className={
                              item.status === "Compliant"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-orange-100 text-orange-700"
                            }
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Compliance Score</span>
                            <span className="font-medium">{item.score}%</span>
                          </div>
                          <Progress value={item.score} />
                          <div className="flex items-center justify-between text-sm">
                            <span>Active Alerts</span>
                            <span className={`font-medium ${item.alerts > 0 ? "text-orange-600" : "text-emerald-600"}`}>
                              {item.alerts}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Automated Audit Trail
                  </CardTitle>
                  <CardDescription>Enterprise-grade security and compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Award className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-medium">SOC 2 Type II</div>
                          <div className="text-sm text-slate-600">Certified</div>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Shield className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-medium">ISO 27001</div>
                          <div className="text-sm text-slate-600">Certified</div>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/60 backdrop-blur-sm border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Third-Party Verification
                  </CardTitle>
                  <CardDescription>Big 4 accounting firm integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-medium">PwC Carbon Audit</div>
                        <div className="text-sm text-slate-600">Q4 2024 Review</div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700">Passed</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <div className="font-medium">KPMG ESG Verification</div>
                        <div className="text-sm text-slate-600">Annual Assessment</div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-700">In Progress</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
