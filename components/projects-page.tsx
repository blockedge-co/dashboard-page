"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import {
  Globe,
  MapPin,
  Leaf,
  Award,
  Eye,
  Filter,
  Download,
  Search,
  TrendingUp,
  Users,
  Target,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { useDebouncedFilter } from "@/hooks/use-debounced-filter"
import { usePerformance } from "@/hooks/use-performance"

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
    image: "/placeholder.svg?height=400&width=600&text=Amazon+Rainforest",
    progress: 85,
    verified: true,
    price: "$47.50",
    change: "+12.4%",
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
    image: "/placeholder.svg?height=400&width=600&text=Solar+Farm",
    progress: 92,
    verified: true,
    price: "$52.30",
    change: "+8.7%",
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
    image: "/placeholder.svg?height=400&width=600&text=Wind+Power",
    progress: 78,
    verified: true,
    price: "$45.80",
    change: "+15.2%",
  },
  {
    id: 4,
    name: "Mangrove Restoration",
    location: "Philippines",
    type: "Blue Carbon",
    tokens: "180K",
    impact: "950K tons CO2",
    rating: "AA-",
    compliance: ["VCS", "CCB"],
    backing: "Citi, HSBC",
    liquidity: "Medium",
    vintage: "2023",
    image: "/placeholder.svg?height=400&width=600&text=Mangrove+Restoration",
    progress: 67,
    verified: true,
    price: "$38.90",
    change: "+6.3%",
  },
  {
    id: 5,
    name: "Geothermal Energy Plant",
    location: "Iceland",
    type: "Renewable Energy",
    tokens: "420K",
    impact: "2.3M tons CO2",
    rating: "AAA",
    compliance: ["EU Taxonomy", "TCFD", "SBTi"],
    backing: "Morgan Stanley, Fidelity",
    liquidity: "High",
    vintage: "2024",
    image: "/placeholder.svg?height=400&width=600&text=Geothermal+Energy",
    progress: 95,
    verified: true,
    price: "$58.70",
    change: "+18.9%",
  },
  {
    id: 6,
    name: "Biochar Production",
    location: "Kenya",
    type: "Carbon Removal",
    tokens: "150K",
    impact: "780K tons CO2",
    rating: "A+",
    compliance: ["Gold Standard", "VCS"],
    backing: "World Bank, IFC",
    liquidity: "Low",
    vintage: "2023",
    image: "/placeholder.svg?height=400&width=600&text=Biochar+Production",
    progress: 73,
    verified: true,
    price: "$42.10",
    change: "+9.8%",
  },
]

const impactData = [
  { month: "Jan", impact: 1200, projects: 45 },
  { month: "Feb", impact: 1450, projects: 52 },
  { month: "Mar", impact: 1380, projects: 48 },
  { month: "Apr", impact: 1680, projects: 61 },
  { month: "May", impact: 1590, projects: 58 },
  { month: "Jun", impact: 1820, projects: 67 },
]

export function ProjectsPage() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedRegistry, setSelectedRegistry] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Performance optimization
  const { shouldReduceAnimations } = usePerformance()

  // Memoized filter functions
  const filterFunctions = useMemo(() => ({
    byType: (project: any, type: string) => 
      type === "all" || project.type.toLowerCase().includes(type.toLowerCase()),
    byRegistry: (project: any, registry: string) => {
      if (registry === "all") return true
      const projectRegistry = project.backing?.toLowerCase() || ""
      switch (registry) {
        case "verra":
          return projectRegistry.includes("verra") || project.compliance?.includes("VCS")
        case "tuv-sud":
          return projectRegistry.includes("tuv") || projectRegistry.includes("sud")
        case "dnv":
          return projectRegistry.includes("dnv")
        case "irec":
          return projectRegistry.includes("irec") || project.compliance?.includes("GRI")
        default:
          return true
      }
    },
    bySearch: (project: any, search: string) =>
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.location.toLowerCase().includes(search.toLowerCase())
  }), [])

  // Use debounced filtering
  const filteredProjects = useDebouncedFilter(
    projects,
    {
      type: selectedType,
      registry: selectedRegistry,
      search: searchQuery
    },
    filterFunctions,
    300
  )


  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Global Carbon Projects
            </h1>
            <p className="text-slate-400 mt-2">Discover verified carbon credit projects worldwide</p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
              <Target className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Projects", value: "847", icon: Globe, color: "from-emerald-500 to-teal-600" },
            { title: "Active Tokens", value: "2.4M", icon: Leaf, color: "from-teal-500 to-cyan-600" },
            { title: "CO2 Impact", value: "12.8M tons", icon: TrendingUp, color: "from-cyan-500 to-sky-600" },
            { title: "Participants", value: "156K", icon: Users, color: "from-sky-500 to-indigo-600" },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                    >
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Impact Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Global Impact Trends
            </CardTitle>
            <CardDescription className="text-slate-400">
              Monthly CO2 reduction and project growth metrics
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
                  projects: {
                    label: "Active Projects",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={impactData}>
                    <defs>
                      <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
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
                      dataKey="impact"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorImpact)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  placeholder="Search projects by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-slate-900/80 border-slate-700 text-slate-300 focus:border-emerald-500"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-48 bg-slate-900/80 border-slate-700 text-slate-300">
                  <SelectValue placeholder="Project Type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-slate-300">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="renewable">Renewable Energy</SelectItem>
                  <SelectItem value="forest">Forest Conservation</SelectItem>
                  <SelectItem value="blue">Blue Carbon</SelectItem>
                  <SelectItem value="removal">Carbon Removal</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedRegistry} onValueChange={setSelectedRegistry}>
                <SelectTrigger className="w-full sm:w-48 bg-slate-900/80 border-slate-700 text-slate-300">
                  <SelectValue placeholder="Registry" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-slate-300">
                  <SelectItem value="all">All Registries</SelectItem>
                  <SelectItem value="verra">Verra</SelectItem>
                  <SelectItem value="tuv-sud">TUV SUD</SelectItem>
                  <SelectItem value="dnv">DNV</SelectItem>
                  <SelectItem value="irec">I-REC</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-slate-900/80 border-slate-700 text-slate-300">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-slate-300">
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="liquidity">High Liquidity</SelectItem>
                  <SelectItem value="impact">Highest Impact</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-700/50">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-700/50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-slate-800/80 border-slate-700/50 overflow-hidden hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-white line-clamp-2">{project.name}</CardTitle>
                      <CardDescription className="text-slate-400 mt-1">{project.type}</CardDescription>
                      <div className="flex items-center gap-1 mt-2">
                        <MapPin className="w-3 h-3 text-slate-300" />
                        <span className="text-sm text-slate-300">{project.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-2">
                        <Badge
                          variant="outline"
                          className="bg-emerald-900/80 text-emerald-400 border-emerald-500/30 backdrop-blur-sm"
                        >
                          {project.rating}
                        </Badge>
                        {project.verified && (
                          <Badge
                            variant="outline"
                            className="bg-blue-900/80 text-blue-400 border-blue-500/30 backdrop-blur-sm"
                          >
                            <Award className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{project.price}</div>
                        <div className="text-xs text-emerald-400">{project.change}</div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Tokens</span>
                      <p className="font-semibold text-white">{project.tokens}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Impact</span>
                      <p className="font-semibold text-white">{project.impact}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Liquidity</span>
                      <p className="font-semibold text-white">{project.liquidity}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Vintage</span>
                      <p className="font-semibold text-white">{project.vintage}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-500">Project Progress</span>
                      <span className="text-white font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-slate-500">Compliance Standards</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.compliance.map((badge) => (
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
                    <span className="text-sm text-slate-500">Institutional Backing</span>
                    <p className="text-sm font-medium mt-1 text-slate-300 line-clamp-1">{project.backing}</p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                      onClick={() => console.log('View details for project:', project.id)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Load More */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-center"
      >
        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-700/50">
          Load More Projects
        </Button>
      </motion.div>
    </div>
  )
}
