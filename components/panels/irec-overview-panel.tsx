"use client"

import { BasePanel } from './base-panel'
import { StatPanel } from './stat-panel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { 
  Activity, 
  ArrowUpRight,
  BarChart3,
  Building2,
  DollarSign,
  Globe,
  Leaf,
  MapPin,
  Recycle,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react'
import type { IrecAnalytics } from '@/lib/types/irec'

interface IrecOverviewPanelProps {
  analytics: IrecAnalytics
  loading?: boolean
  error?: string
  className?: string
  onExplore?: () => void
  onViewMarkets?: () => void
}

export function IrecOverviewPanel({
  analytics,
  loading = false,
  error,
  className,
  onExplore,
  onViewMarkets
}: IrecOverviewPanelProps) {
  const overview = analytics.overview
  const trends = analytics.trends
  const topCountries = Object.entries(analytics.byCountry)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
  const topTypes = Object.entries(analytics.byType)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 3)

  return (
    <BasePanel
      title="IREC Certificates Overview"
      size="xl"
      loading={loading}
      error={error}
      className={cn("", className)}
      headerAction={
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onViewMarkets}
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Markets
          </Button>
          <Button
            size="sm"
            onClick={onExplore}
          >
            <ArrowUpRight className="h-4 w-4 mr-1" />
            Explore
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Hero Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-blue-400 mb-1 truncate">Total Certificates</div>
                  <div className="text-xl lg:text-2xl font-bold text-gray-100 break-words">
                    {overview.totalCertificates.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 truncate">
                    +{trends.newCertificateRate.toFixed(1)}% this month
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Leaf className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-green-400 mb-1 truncate">Total Supply</div>
                  <div className="text-xl lg:text-2xl font-bold text-gray-100 break-words">
                    {parseInt(overview.totalSupply).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 truncate">
                    MWh • +{trends.supplyGrowth.toFixed(1)}%
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-purple-400 mb-1 truncate">Market Value</div>
                  <div className="text-xl lg:text-2xl font-bold text-gray-100 break-words">
                    ${(parseFloat(overview.totalValue) / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs text-gray-500 mt-1 truncate">
                    +{trends.marketCapChange.toFixed(1)}% growth
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-orange-400 mb-1 truncate">Active Markets</div>
                  <div className="text-xl lg:text-2xl font-bold text-gray-100 break-words">
                    {overview.activeMarkets}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 truncate">
                    Avg ${overview.averagePrice}/MWh
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <Activity className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status & Type Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-800 bg-[#181B1F]">
            <CardHeader>
              <CardTitle className="text-lg text-gray-100 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Certificate Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analytics.byStatus).map(([status, data]) => (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {status.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-300">{data.count} certificates</span>
                      </div>
                      <span className="text-sm text-gray-500">{data.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full">
                      <Progress value={data.percentage} className="h-2 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-[#181B1F]">
            <CardHeader>
              <CardTitle className="text-lg text-gray-100 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Certificate Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topTypes.map(([type, data]) => (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-gray-300 capitalize">
                          {type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{data.count} certs</span>
                    </div>
                    <div className="w-full">
                      <Progress value={data.percentage} className="h-2 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Geographic Distribution */}
        <Card className="border-gray-800 bg-[#181B1F]">
          <CardHeader>
            <CardTitle className="text-lg text-gray-100 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topCountries.map(([country, data]) => (
                <div key={country} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-300">{country}</span>
                    </div>
                    <span className="text-sm text-gray-500">{data.count}</span>
                  </div>
                  <div className="w-full">
                    <Progress value={data.percentage} className="h-2 w-full" />
                  </div>
                  <div className="text-xs text-gray-600">
                    {parseInt(data.supply).toLocaleString()} MWh • ${((data.value as unknown as number) / 1000000).toFixed(1)}M
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Trends */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="border-gray-800 bg-[#181B1F] min-w-[120px]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 mb-1 whitespace-nowrap">Supply Growth</div>
                  <div className="text-lg font-bold text-gray-100 whitespace-nowrap">
                    +{trends.supplyGrowth.toFixed(1)}%
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-green-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-[#181B1F] min-w-[120px]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 mb-1 whitespace-nowrap">Price Change</div>
                  <div className="text-lg font-bold text-gray-100 whitespace-nowrap">
                    +{trends.priceChange.toFixed(1)}%
                  </div>
                </div>
                <DollarSign className="h-5 w-5 text-blue-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-[#181B1F] min-w-[120px]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 mb-1 whitespace-nowrap">Volume Change</div>
                  <div className="text-lg font-bold text-gray-100 whitespace-nowrap">
                    +{trends.volumeChange.toFixed(1)}%
                  </div>
                </div>
                <Activity className="h-5 w-5 text-purple-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-[#181B1F] min-w-[120px]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 mb-1 whitespace-nowrap">Market Cap</div>
                  <div className="text-lg font-bold text-gray-100 whitespace-nowrap">
                    +{trends.marketCapChange.toFixed(1)}%
                  </div>
                </div>
                <BarChart3 className="h-5 w-5 text-orange-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-[#181B1F] min-w-[120px]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500 mb-1 whitespace-nowrap">New Certs</div>
                  <div className="text-lg font-bold text-gray-100 whitespace-nowrap">
                    +{trends.newCertificateRate.toFixed(1)}%
                  </div>
                </div>
                <Leaf className="h-5 w-5 text-green-400 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Summary */}
        <Card className="border-gray-800 bg-[#181B1F]">
          <CardHeader>
            <CardTitle className="text-lg text-gray-100 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Market Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-100 mb-2">
                  {analytics.topPerformers.mostTraded.length}
                </div>
                <div className="text-sm text-gray-500 mb-1">Most Traded</div>
                <div className="text-xs text-gray-600">
                  High volume certificates
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-100 mb-2">
                  {analytics.topPerformers.highestValue.length}
                </div>
                <div className="text-sm text-gray-500 mb-1">High Value</div>
                <div className="text-xs text-gray-600">
                  Premium certificates
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-100 mb-2">
                  {analytics.topPerformers.mostLiquid.length}
                </div>
                <div className="text-sm text-gray-500 mb-1">Most Liquid</div>
                <div className="text-xs text-gray-600">
                  Easy to trade
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="text-xs text-gray-500">
            Last updated: {new Date(analytics.lastUpdated).toLocaleString()}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-500">Real-time data</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-500">Global registry</span>
            </div>
          </div>
        </div>
      </div>
    </BasePanel>
  )
}

export default IrecOverviewPanel