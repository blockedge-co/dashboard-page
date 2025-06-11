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
    value: "",
    change: "",
    trend: "up",
    icon: DollarSign,
    pulse: true,
  },
  {
    title: "Active Carbon Tokens",
    value: "",
    change: "",
    trend: "up",
    icon: Leaf,
    pulse: true,
  },
  {
    title: "Verified Projects",
    value: "",
    change: "",
    trend: "up",
    icon: Award,
    pulse: false,
  },
  {
    title: "Corporate Participants",
    value: "",
    change: "",
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
              Beta Version
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

      </div>
    </div>
  )
}
