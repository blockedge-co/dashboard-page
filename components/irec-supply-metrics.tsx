"use client"

import { BasePanel } from '@/components/panels/base-panel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts'
import { 
  Battery, 
  TrendingUp, 
  Globe, 
  Zap, 
  Database, 
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { IrecCertificateComplete } from '@/lib/types/irec'

interface IrecSupplyMetricsProps {
  data: IrecCertificateComplete[]
  className?: string
}

export function IrecSupplyMetrics({ data = [], className }: IrecSupplyMetricsProps) {
  // Calculate supply metrics
  const totalSupply = data.reduce((sum, cert) => sum + parseFloat(cert.supplyData.totalSupply || '0'), 0)
  const availableSupply = data.reduce((sum, cert) => sum + parseFloat(cert.supplyData.availableSupply || '0'), 0)
  const retiredSupply = data.reduce((sum, cert) => sum + parseFloat(cert.supplyData.retiredSupply || '0'), 0)
  const reservedSupply = data.reduce((sum, cert) => sum + parseFloat(cert.supplyData.supplyBreakdown?.original || '0'), 0)

  // Mock historical data for charts
  const supplyHistory = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    total: totalSupply * (0.8 + Math.random() * 0.4),
    available: availableSupply * (0.8 + Math.random() * 0.4),
    retired: retiredSupply * (0.8 + Math.random() * 0.4),
    price: 40 + Math.random() * 20
  }))

  // Country distribution
  const countryData = data.reduce((acc, cert) => {
    const country = cert.country || 'Unknown'
    acc[country] = (acc[country] || 0) + parseFloat(cert.supplyData.totalSupply || '0')
    return acc
  }, {} as Record<string, number>)

  const countryChartData = Object.entries(countryData).map(([country, supply]) => ({
    country,
    supply: supply as number,
    percentage: ((supply as number) / totalSupply) * 100
  }))

  // Technology distribution
  const technologyData = data.reduce((acc, cert) => {
    const tech = cert.facility.technology || 'Unknown'
    acc[tech] = (acc[tech] || 0) + parseFloat(cert.supplyData.totalSupply || '0')
    return acc
  }, {} as Record<string, number>)

  const technologyChartData = Object.entries(technologyData).map(([technology, supply]) => ({
    technology,
    supply: supply as number,
    percentage: ((supply as number) / totalSupply) * 100
  }))

  // Vintage distribution
  const vintageData = data.reduce((acc, cert) => {
    const vintage = cert.vintage || 'Unknown'
    acc[vintage] = (acc[vintage] || 0) + parseFloat(cert.supplyData.totalSupply || '0')
    return acc
  }, {} as Record<string, number>)

  const vintageChartData = Object.entries(vintageData).map(([vintage, supply]) => ({
    vintage,
    supply: supply as number,
    percentage: ((supply as number) / totalSupply) * 100
  }))

  // Pie chart colors
  const pieColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16']

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1E2328] border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatNumber(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <BasePanel 
      title="Supply Metrics & Analytics"
      description="Comprehensive supply analysis and distribution metrics"
      size="xl"
      className={cn("bg-gradient-to-br from-[#181B1F] to-[#1A1D23]", className)}
      headerAction={
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            <Database className="h-3 w-3 mr-1" />
            Analytics
          </Badge>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Supply Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#1E2328] border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Total Supply</CardTitle>
                <Battery className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-gray-100">{formatNumber(totalSupply)}</div>
              <div className="text-xs text-gray-500 mt-1">MWh Certificates</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E2328] border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Available</CardTitle>
                <Zap className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-green-400">{formatNumber(availableSupply)}</div>
              <div className="text-xs text-gray-500 mt-1">
                {((availableSupply / totalSupply) * 100).toFixed(1)}% of total
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E2328] border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Retired</CardTitle>
                <Activity className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-red-400">{formatNumber(retiredSupply)}</div>
              <div className="text-xs text-gray-500 mt-1">
                {((retiredSupply / totalSupply) * 100).toFixed(1)}% retired
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E2328] border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Reserved</CardTitle>
                <Globe className="h-4 w-4 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xl font-bold text-yellow-400">{formatNumber(reservedSupply)}</div>
              <div className="text-xs text-gray-500 mt-1">
                {((reservedSupply / totalSupply) * 100).toFixed(1)}% reserved
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#1E2328] border-gray-700">
            <TabsTrigger value="history" className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="countries" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Countries
            </TabsTrigger>
            <TabsTrigger value="technology" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Technology
            </TabsTrigger>
            <TabsTrigger value="vintage" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Vintage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            <Card className="bg-[#1E2328] border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-100">Supply History (30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={supplyHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9CA3AF"
                      fontSize={12}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={formatNumber} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stackId="1" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.3}
                      name="Total Supply"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="available" 
                      stackId="2" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.3}
                      name="Available"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="retired" 
                      stackId="3" 
                      stroke="#EF4444" 
                      fill="#EF4444" 
                      fillOpacity={0.3}
                      name="Retired"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="countries" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-[#1E2328] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-100">Country Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={countryChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ country, percentage }) => `${country} ${percentage.toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="supply"
                      >
                        {countryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-[#1E2328] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-100">Country Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {countryChartData
                      .sort((a, b) => b.supply - a.supply)
                      .slice(0, 6)
                      .map((item, index) => (
                        <div key={item.country} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pieColors[index % pieColors.length] }}></div>
                            <span className="text-sm text-gray-300">{item.country}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-100">{formatNumber(item.supply)}</div>
                            <div className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="technology" className="space-y-4">
            <Card className="bg-[#1E2328] border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-100">Technology Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={technologyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="technology" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={formatNumber} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="supply" fill="#10B981" name="Supply" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vintage" className="space-y-4">
            <Card className="bg-[#1E2328] border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-100">Vintage Year Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={vintageChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="vintage" stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={formatNumber} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="supply" fill="#8B5CF6" name="Supply" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#1E2328] border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Utilization Rate</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-blue-400">
                {(((totalSupply - availableSupply) / totalSupply) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Supply utilized</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E2328] border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Retirement Rate</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-red-400">
                {((retiredSupply / totalSupply) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Permanently retired</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E2328] border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Avg. Certificate Size</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-green-400">
                {formatNumber(totalSupply / data.length)}
              </div>
              <div className="text-xs text-gray-500 mt-1">MWh per certificate</div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E2328] border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400">Liquidity Score</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-yellow-400">
                {(Math.random() * 100).toFixed(0)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Market liquidity</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BasePanel>
  )
}