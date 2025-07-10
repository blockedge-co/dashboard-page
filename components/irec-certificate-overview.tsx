"use client"

import { BasePanel } from '@/components/panels/base-panel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Award, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Battery, 
  Zap, 
  Globe, 
  Shield,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface IrecCertificateOverviewProps {
  data: any[]
  className?: string
}

export function IrecCertificateOverview({ data = [], className }: IrecCertificateOverviewProps) {
  // Calculate aggregate metrics
  const totalCertificates = data.length
  const totalSupply = data.reduce((sum, cert) => sum + parseFloat(cert.supply?.total || '0'), 0)
  const totalValue = data.reduce((sum, cert) => 
    sum + (parseFloat(cert.supply?.total || '0') * (cert.trading?.currentPrice || 0)), 0
  )
  const avgPrice = totalValue / totalSupply || 0
  const totalRetired = data.reduce((sum, cert) => sum + parseFloat(cert.supply?.retired || '0'), 0)
  const retirementRate = totalSupply > 0 ? (totalRetired / totalSupply) * 100 : 0

  // Calculate 24h changes (mock data)
  const priceChange24h = (Math.random() - 0.5) * 10 // ±5%
  const supplyChange24h = (Math.random() - 0.5) * 6 // ±3%
  const volumeChange24h = (Math.random() - 0.5) * 20 // ±10%

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(num)
  }

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
  }

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500'
  }

  return (
    <BasePanel 
      title="IREC Certificate Overview"
      description="Real-time overview of International Renewable Energy Certificates"
      size="xl"
      className={cn("bg-gradient-to-br from-[#181B1F] to-[#1A1D23]", className)}
      headerAction={
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-green-400 border-green-400">
            Live Data
          </Badge>
          <Button size="sm" variant="outline" className="h-8 px-3">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Hero Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Certificates */}
          <Card className="bg-[#1E2328] border-gray-700 hover:border-gray-600 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Total Certificates</CardTitle>
                <Award className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-gray-100">{totalCertificates}</div>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <Globe className="h-3 w-3" />
                <span>Active projects</span>
              </div>
            </CardContent>
          </Card>

          {/* Total Supply */}
          <Card className="bg-[#1E2328] border-gray-700 hover:border-gray-600 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Total Supply</CardTitle>
                <Battery className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-gray-100">{formatNumber(totalSupply)}</div>
              <div className="flex items-center gap-1 text-sm">
                {getChangeIcon(supplyChange24h)}
                <span className={getChangeColor(supplyChange24h)}>
                  {Math.abs(supplyChange24h).toFixed(1)}%
                </span>
                <span className="text-gray-500">24h</span>
              </div>
            </CardContent>
          </Card>

          {/* Market Value */}
          <Card className="bg-[#1E2328] border-gray-700 hover:border-gray-600 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Market Value</CardTitle>
                <DollarSign className="h-5 w-5 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-gray-100">{formatCurrency(totalValue)}</div>
              <div className="flex items-center gap-1 text-sm">
                {getChangeIcon(priceChange24h)}
                <span className={getChangeColor(priceChange24h)}>
                  {Math.abs(priceChange24h).toFixed(1)}%
                </span>
                <span className="text-gray-500">24h</span>
              </div>
            </CardContent>
          </Card>

          {/* Average Price */}
          <Card className="bg-[#1E2328] border-gray-700 hover:border-gray-600 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-400">Average Price</CardTitle>
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-gray-100">{formatCurrency(avgPrice)}</div>
              <div className="flex items-center gap-1 text-sm">
                {getChangeIcon(volumeChange24h)}
                <span className={getChangeColor(volumeChange24h)}>
                  {Math.abs(volumeChange24h).toFixed(1)}%
                </span>
                <span className="text-gray-500">24h</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Supply Status */}
          <Card className="bg-[#1E2328] border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-500" />
                Supply Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Available</span>
                  <span className="text-sm text-green-400">{formatNumber(totalSupply - totalRetired)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Retired</span>
                  <span className="text-sm text-red-400">{formatNumber(totalRetired)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Retirement Rate</span>
                  <span className="text-sm text-yellow-400">{retirementRate.toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technology Distribution */}
          <Card className="bg-[#1E2328] border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                Technology Mix
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">Hydroelectric</span>
                  <span className="text-sm text-gray-300 ml-auto">65%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">Solar</span>
                  <span className="text-sm text-gray-300 ml-auto">25%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-400">Wind</span>
                  <span className="text-sm text-gray-300 ml-auto">10%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Activity */}
          <Card className="bg-[#1E2328] border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                Market Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">24h Volume</span>
                  <span className="text-sm text-purple-400">{formatNumber(totalSupply * 0.02)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Active Traders</span>
                  <span className="text-sm text-cyan-400">{Math.floor(totalCertificates * 15)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Avg. Trade Size</span>
                  <span className="text-sm text-orange-400">{formatNumber(1500)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-700">
          <Button size="sm" variant="outline" className="h-8">
            <Award className="h-4 w-4 mr-1" />
            View All Certificates
          </Button>
          <Button size="sm" variant="outline" className="h-8">
            <TrendingUp className="h-4 w-4 mr-1" />
            Trading Analytics
          </Button>
          <Button size="sm" variant="outline" className="h-8">
            <Shield className="h-4 w-4 mr-1" />
            Compliance Report
          </Button>
          <Button size="sm" variant="outline" className="h-8">
            <DollarSign className="h-4 w-4 mr-1" />
            Price History
          </Button>
        </div>

        {/* Data Sources */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>CO2e Chain</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Optimism Network</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </BasePanel>
  )
}