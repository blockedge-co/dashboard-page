"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Search,
  BarChart3,
  TrendingUp,
  Users,
  Globe,
  Award,
  Clock,
  Eye,
  Share,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const reports = [
  {
    id: 1,
    title: "Q4 2024 Carbon Credit Market Analysis",
    type: "Market Analysis",
    date: "2024-12-15",
    status: "Published",
    size: "2.4 MB",
    pages: 47,
    downloads: 1247,
    description:
      "Comprehensive analysis of carbon credit market trends, pricing dynamics, and institutional activity for Q4 2024.",
    tags: ["Market Analysis", "Quarterly", "Institutional"],
    author: "Analytics Team",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Q4+Market+Analysis",
  },
  {
    id: 2,
    title: "ESG Impact Assessment Report",
    type: "ESG Report",
    date: "2024-12-10",
    status: "Published",
    size: "3.1 MB",
    pages: 62,
    downloads: 892,
    description: "Detailed assessment of environmental, social, and governance impact across all portfolio holdings.",
    tags: ["ESG", "Impact", "Sustainability"],
    author: "ESG Team",
    thumbnail: "/placeholder.svg?height=200&width=300&text=ESG+Impact+Report",
  },
  {
    id: 3,
    title: "Institutional Trading Patterns Study",
    type: "Research",
    date: "2024-12-08",
    status: "Published",
    size: "1.8 MB",
    pages: 34,
    downloads: 567,
    description: "In-depth analysis of institutional trading patterns and their impact on carbon credit markets.",
    tags: ["Institutional", "Trading", "Research"],
    author: "Research Team",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Trading+Patterns",
  },
  {
    id: 4,
    title: "Regulatory Compliance Update",
    type: "Compliance",
    date: "2024-12-05",
    status: "Published",
    size: "1.2 MB",
    pages: 28,
    downloads: 1034,
    description: "Latest updates on regulatory changes across 47 jurisdictions and their impact on carbon markets.",
    tags: ["Compliance", "Regulatory", "Legal"],
    author: "Compliance Team",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Compliance+Update",
  },
  {
    id: 5,
    title: "Risk Assessment Framework 2024",
    type: "Risk Analysis",
    date: "2024-12-01",
    status: "Published",
    size: "2.7 MB",
    pages: 55,
    downloads: 723,
    description: "Comprehensive risk assessment framework for carbon credit investments and portfolio management.",
    tags: ["Risk", "Framework", "Portfolio"],
    author: "Risk Team",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Risk+Framework",
  },
  {
    id: 6,
    title: "Global Project Performance Review",
    type: "Performance",
    date: "2024-11-28",
    status: "Draft",
    size: "1.9 MB",
    pages: 41,
    downloads: 0,
    description: "Performance review of carbon credit projects across different geographical regions and sectors.",
    tags: ["Performance", "Global", "Projects"],
    author: "Analytics Team",
    thumbnail: "/placeholder.svg?height=200&width=300&text=Project+Performance",
  },
]

const reportTemplates = [
  {
    id: 1,
    name: "Market Analysis Template",
    description: "Standard template for quarterly market analysis reports",
    icon: BarChart3,
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: 2,
    name: "ESG Impact Template",
    description: "Template for environmental, social, and governance impact reports",
    icon: Globe,
    color: "from-teal-500 to-cyan-600",
  },
  {
    id: 3,
    name: "Risk Assessment Template",
    description: "Comprehensive risk analysis and assessment template",
    icon: TrendingUp,
    color: "from-cyan-500 to-sky-600",
  },
  {
    id: 4,
    name: "Compliance Report Template",
    description: "Regulatory compliance and legal update template",
    icon: Award,
    color: "from-sky-500 to-indigo-600",
  },
]

export function ReportsPage() {
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("reports")

  const filteredReports = reports.filter((report) => {
    const matchesType = selectedType === "all" || report.type === selectedType
    const matchesStatus = selectedStatus === "all" || report.status === selectedStatus
    const matchesSearch =
      searchQuery === "" ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesType && matchesStatus && matchesSearch
  })

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Reports & Analytics
            </h1>
            <p className="text-slate-400 mt-2">Comprehensive reports, market analysis, and business intelligence</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-700/50">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
              <FileText className="w-4 h-4 mr-2" />
              Create Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Total Reports", value: "247", icon: FileText, color: "from-emerald-500 to-teal-600" },
            { title: "Downloads", value: "12.4K", icon: Download, color: "from-teal-500 to-cyan-600" },
            { title: "Active Users", value: "1.2K", icon: Users, color: "from-cyan-500 to-sky-600" },
            { title: "Avg. Rating", value: "4.8/5", icon: Award, color: "from-sky-500 to-indigo-600" },
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

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl blur-xl" />
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/70 backdrop-blur-md border border-white/5 rounded-xl p-1">
              <TabsTrigger
                value="reports"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg"
              >
                <FileText className="w-4 h-4" />
                Published Reports
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg"
              >
                <BarChart3 className="w-4 h-4" />
                Report Templates
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white rounded-lg"
              >
                <TrendingUp className="w-4 h-4" />
                Usage Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Published Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            {/* Filters */}
            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      placeholder="Search reports by title or content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-slate-900/80 border-slate-700 text-slate-300 focus:border-emerald-500"
                    />
                  </div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full sm:w-48 bg-slate-900/80 border-slate-700 text-slate-300">
                      <SelectValue placeholder="Report Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-300">
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Market Analysis">Market Analysis</SelectItem>
                      <SelectItem value="ESG Report">ESG Report</SelectItem>
                      <SelectItem value="Research">Research</SelectItem>
                      <SelectItem value="Compliance">Compliance</SelectItem>
                      <SelectItem value="Risk Analysis">Risk Analysis</SelectItem>
                      <SelectItem value="Performance">Performance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full sm:w-48 bg-slate-900/80 border-slate-700 text-slate-300">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-300">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Review">Under Review</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-700/50">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredReports.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="bg-slate-800/80 border-slate-700/50 overflow-hidden hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 h-full">
                    <div className="relative h-40 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
                      <img
                        src={report.thumbnail || "/placeholder.svg"}
                        alt={report.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute top-3 right-3 z-20">
                        <Badge
                          variant="outline"
                          className={`backdrop-blur-sm ${
                            report.status === "Published"
                              ? "bg-emerald-900/80 text-emerald-400 border-emerald-500/30"
                              : report.status === "Draft"
                                ? "bg-orange-900/80 text-orange-400 border-orange-500/30"
                                : "bg-blue-900/80 text-blue-400 border-blue-500/30"
                          }`}
                        >
                          {report.status}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-300" />
                        <span className="text-xs text-slate-300">{report.date}</span>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-white line-clamp-2">{report.title}</CardTitle>
                          <CardDescription className="text-slate-400 mt-1">{report.type}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-slate-300 line-clamp-3">{report.description}</p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">Size</span>
                          <p className="font-semibold text-white">{report.size}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Pages</span>
                          <p className="font-semibold text-white">{report.pages}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Downloads</span>
                          <p className="font-semibold text-white">{report.downloads.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Author</span>
                          <p className="font-semibold text-white">{report.author}</p>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm text-slate-500">Tags</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {report.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs bg-slate-700/50 text-slate-300 border-slate-600"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                          disabled={report.status === "Draft"}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-700 text-slate-300 hover:bg-slate-700/50"
                          disabled={report.status === "Draft"}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-700 text-slate-300 hover:bg-slate-700/50"
                        >
                          <Share className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Report Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  Report Templates
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Pre-built templates to streamline your report creation process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reportTemplates.map((template, index) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="bg-slate-800/80 border-slate-700/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-12 h-12 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center`}
                            >
                              <template.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white mb-2">{template.name}</h3>
                              <p className="text-sm text-slate-400 mb-4">{template.description}</p>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                                >
                                  Use Template
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-slate-700 text-slate-300 hover:bg-slate-700/50"
                                >
                                  Preview
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Download Trends
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Report download activity over the past 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-emerald-400">12.4K</div>
                      <div className="text-sm text-slate-400">Total Downloads</div>
                      <div className="text-xs text-emerald-400 mt-1">+18.7% vs last month</div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { month: "Nov", downloads: 2100 },
                        { month: "Oct", downloads: 1850 },
                        { month: "Sep", downloads: 1920 },
                        { month: "Aug", downloads: 1650 },
                        { month: "Jul", downloads: 1780 },
                        { month: "Jun", downloads: 1450 },
                      ].map((data, index) => (
                        <div key={data.month} className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">{data.month} 2024</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(data.downloads / 2100) * 100}%` }}
                                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                              />
                            </div>
                            <span className="text-sm font-medium text-white w-12">{data.downloads}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="w-5 h-5 text-emerald-400" />
                    User Engagement
                  </CardTitle>
                  <CardDescription className="text-slate-400">User activity and engagement metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">1.2K</div>
                        <div className="text-sm text-slate-400">Active Users</div>
                        <div className="text-xs text-emerald-400 mt-1">+12% this month</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">4.8</div>
                        <div className="text-sm text-slate-400">Avg. Rating</div>
                        <div className="text-xs text-emerald-400 mt-1">+0.2 vs last month</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Report Views</span>
                        <span className="text-sm font-medium text-white">8.7K</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Avg. Time on Report</span>
                        <span className="text-sm font-medium text-white">12m 34s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Share Rate</span>
                        <span className="text-sm font-medium text-white">23.4%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Return Users</span>
                        <span className="text-sm font-medium text-white">67.8%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  Most Popular Reports
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Top performing reports by downloads and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.slice(0, 5).map((report, index) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-slate-800/80 border border-slate-700/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-white line-clamp-1">{report.title}</div>
                          <div className="text-sm text-slate-400">{report.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-white">{report.downloads.toLocaleString()}</div>
                        <div className="text-xs text-slate-400">downloads</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
