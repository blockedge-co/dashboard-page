"use client"

import { BasePanel } from './base-panel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { 
  Activity, 
  Award, 
  Calendar, 
  ChevronRight, 
  Cpu,
  DollarSign,
  Globe,
  Info,
  MapPin, 
  MoreVertical,
  Recycle,
  TrendingUp,
  Users,
  Zap 
} from 'lucide-react'
import type { IrecCertificateComplete } from '@/lib/types/irec'

interface IrecCertificateCardProps {
  certificate: IrecCertificateComplete
  variant?: 'compact' | 'detailed' | 'grid'
  showActions?: boolean
  onView?: (certificateId: string) => void
  onBuy?: (certificateId: string) => void
  onDetails?: (certificateId: string) => void
  className?: string
}

export function IrecCertificateCard({
  certificate,
  variant = 'detailed',
  showActions = true,
  onView,
  onBuy,
  onDetails,
  className
}: IrecCertificateCardProps) {
  const utilizationRate = certificate.calculated.utilizationRate
  const liquidityScore = certificate.calculated.liquidityScore
  const pricePerToken = parseFloat(certificate.supplyData.marketData.pricePerToken)
  const totalValue = parseFloat(certificate.calculated.marketCap)
  const activeTransactions = certificate.optimismActivity.totalTransactions

  if (variant === 'compact') {
    return (
      <Card className={cn(
        "group relative overflow-hidden transition-all duration-200",
        "hover:shadow-lg hover:shadow-black/20 border-gray-800 bg-[#181B1F]",
        "min-h-[280px] flex flex-col", // Fixed height and flex column
        className
      )}>
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant="secondary" className="text-xs whitespace-nowrap">
                  {certificate.type.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge 
                  variant={certificate.status === 'active' ? 'default' : 'secondary'}
                  className="text-xs whitespace-nowrap"
                >
                  {certificate.status.toUpperCase()}
                </Badge>
              </div>
              <CardTitle className="text-sm text-gray-100 line-clamp-2 leading-tight">
                {certificate.facility.name}
              </CardTitle>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{certificate.country}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-lg font-bold text-gray-100 whitespace-nowrap">
                ${pricePerToken.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 whitespace-nowrap">per MWh</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 flex-1 flex flex-col">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="space-y-1 min-w-0">
              <div className="text-xs text-gray-500">Available</div>
              <div className="text-sm font-medium text-gray-100 break-words">
                {parseInt(certificate.supplyData.availableSupply).toLocaleString()} MWh
              </div>
            </div>
            <div className="space-y-1 min-w-0">
              <div className="text-xs text-gray-500">Activity</div>
              <div className="flex items-center gap-1 text-sm text-gray-100">
                <Activity className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{activeTransactions}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Utilization</span>
              <span className="whitespace-nowrap">{utilizationRate.toFixed(1)}%</span>
            </div>
            <div className="w-full">
              <Progress value={utilizationRate} className="h-1 w-full" />
            </div>
          </div>
          
          {showActions && (
            <div className="mt-auto pt-2">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs h-8 w-full"
                  onClick={() => onView?.(certificate.id)}
                >
                  <Info className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button 
                  size="sm" 
                  className="text-xs h-8 w-full"
                  onClick={() => onBuy?.(certificate.id)}
                >
                  <DollarSign className="h-3 w-3 mr-1" />
                  Buy
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        
        {/* Hover accent */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </Card>
    )
  }

  if (variant === 'grid') {
    return (
      <Card className={cn(
        "group relative overflow-hidden transition-all duration-200",
        "hover:shadow-lg hover:shadow-black/20 border-gray-800 bg-[#181B1F]",
        "min-h-[320px] h-full flex flex-col",
        className
      )}>
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <Badge variant="secondary" className="text-xs whitespace-nowrap">
                {certificate.type.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge 
                variant={certificate.status === 'active' ? 'default' : 'secondary'}
                className="text-xs whitespace-nowrap"
              >
                {certificate.status.toUpperCase()}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreVertical className="h-3 w-3" />
            </Button>
          </div>
          
          <CardTitle className="text-base text-gray-100 mb-1 line-clamp-2 leading-tight">
            {certificate.facility.name}
          </CardTitle>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{certificate.country}</span>
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <Zap className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{certificate.facility.capacity}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 flex-1 flex flex-col">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Price</div>
              <div className="text-lg font-bold text-gray-100">
                ${pricePerToken.toFixed(2)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-gray-500">Market Cap</div>
              <div className="text-lg font-bold text-gray-100">
                ${(totalValue / 1000000).toFixed(1)}M
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Available Supply</span>
              <span className="text-gray-100 font-medium">
                {parseInt(certificate.supplyData.availableSupply).toLocaleString()} MWh
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Utilization</span>
              <span className="text-gray-100 font-medium whitespace-nowrap">{utilizationRate.toFixed(1)}%</span>
            </div>
            <div className="w-full">
              <Progress value={utilizationRate} className="h-1 w-full" />
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Liquidity Score</span>
              <span className="text-gray-100 font-medium">{liquidityScore.toFixed(0)}/100</span>
            </div>
          </div>
          
          <div className="mt-auto">
            <Separator className="mb-3" />
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span>{activeTransactions} trades</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span>{certificate.calculated.activityScore.toFixed(0)}/100</span>
              </div>
            </div>
            
            {showActions && (
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs h-8 w-full"
                  onClick={() => onView?.(certificate.id)}
                >
                  View Details
                </Button>
                <Button 
                  size="sm" 
                  className="text-xs h-8 w-full"
                  onClick={() => onBuy?.(certificate.id)}
                >
                  Buy Now
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        
        {/* Hover accent */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </Card>
    )
  }

  // Default detailed variant
  return (
    <BasePanel
      title={certificate.facility.name}
      size="lg"
      className={cn("group", className)}
      headerAction={
        showActions && (
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onView?.(certificate.id)}
            >
              <Info className="h-4 w-4 mr-1" />
              Details
            </Button>
            <Button 
              size="sm"
              onClick={() => onBuy?.(certificate.id)}
            >
              <DollarSign className="h-4 w-4 mr-1" />
              Buy
            </Button>
          </div>
        )
      }
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {certificate.type.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge 
                variant={certificate.status === 'active' ? 'default' : 'secondary'}
              >
                {certificate.status.toUpperCase()}
              </Badge>
              <Badge variant="outline">
                {certificate.vintage}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{certificate.facility.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span>{certificate.country}</span>
              </div>
              <div className="flex items-center gap-1">
                <Cpu className="h-4 w-4" />
                <span>{certificate.facility.technology}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-100 mb-1">
              ${pricePerToken.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">per MWh</div>
            <div className="text-xs text-gray-600 mt-1">
              Market Cap: ${(totalValue / 1000000).toFixed(1)}M
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Zap className="h-4 w-4" />
              <span>Total Supply</span>
            </div>
            <div className="text-lg font-bold text-gray-100">
              {parseInt(certificate.supplyData.totalSupply).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">MWh</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Activity className="h-4 w-4" />
              <span>Available</span>
            </div>
            <div className="text-lg font-bold text-gray-100">
              {parseInt(certificate.supplyData.availableSupply).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">MWh</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Recycle className="h-4 w-4" />
              <span>Retired</span>
            </div>
            <div className="text-lg font-bold text-gray-100">
              {parseInt(certificate.supplyData.retiredSupply).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">MWh</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              <span>Trades</span>
            </div>
            <div className="text-lg font-bold text-gray-100">
              {activeTransactions}
            </div>
            <div className="text-xs text-gray-500">total</div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Utilization Rate</span>
              <span className="text-sm font-medium text-gray-100">
                {utilizationRate.toFixed(1)}%
              </span>
            </div>
            <Progress value={utilizationRate} className="h-2" />
            <div className="text-xs text-gray-600">
              {parseInt(certificate.supplyData.retiredSupply).toLocaleString()} / {parseInt(certificate.supplyData.totalSupply).toLocaleString()} MWh retired
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Liquidity Score</span>
              <span className="text-sm font-medium text-gray-100">
                {liquidityScore.toFixed(0)}/100
              </span>
            </div>
            <Progress value={liquidityScore} className="h-2" />
            <div className="text-xs text-gray-600">
              Based on trading activity and volume
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Issued: {new Date(certificate.issuanceDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              <span>Registry: {certificate.registryName}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-500">
              Activity Score: {certificate.calculated.activityScore.toFixed(0)}/100
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-500">Live</span>
            </div>
          </div>
        </div>
      </div>
    </BasePanel>
  )
}

export default IrecCertificateCard