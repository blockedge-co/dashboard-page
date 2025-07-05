"use client"

import { BasePanel, PanelSize } from './base-panel'
import { TrendingUp, TrendingDown, Minus, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatPanelProps {
  title: string
  value: string | number
  previousValue?: string | number
  change?: number
  changeType?: 'percentage' | 'absolute'
  trend?: 'up' | 'down' | 'neutral'
  size?: PanelSize
  loading?: boolean
  error?: string
  className?: string
  unit?: string
  precision?: number
}

export function StatPanel({
  title,
  value,
  previousValue,
  change,
  changeType = 'percentage',
  trend,
  size = 'sm',
  loading = false,
  error,
  className,
  unit = '',
  precision = 0
}: StatPanelProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString(undefined, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision
      })
    }
    return val
  }

  const formatChange = (val: number) => {
    if (changeType === 'percentage') {
      return `${val > 0 ? '+' : ''}${val.toFixed(1)}%`
    }
    return `${val > 0 ? '+' : ''}${val.toLocaleString()}`
  }

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const getChangeColor = () => {
    if (change === undefined) return 'text-gray-500'
    if (change > 0) return 'text-green-500'
    if (change < 0) return 'text-red-500'
    return 'text-gray-500'
  }

  const getChangeIcon = () => {
    if (change === undefined || change === 0) return null
    return change > 0 ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    )
  }

  return (
    <BasePanel
      title={title}
      size={size}
      loading={loading}
      error={error}
      className={className}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-100">
              {formatValue(value)}
            </span>
            {unit && (
              <span className="text-sm text-gray-500">{unit}</span>
            )}
          </div>

          {/* Change Indicator */}
          {change !== undefined && (
            <div className={cn(
              "mt-1 flex items-center gap-1 text-sm",
              getChangeColor()
            )}>
              {getChangeIcon()}
              <span>{formatChange(change)}</span>
              {previousValue && (
                <span className="text-xs text-gray-600">
                  vs {formatValue(previousValue)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Trend Icon */}
        <div className="flex-shrink-0">
          {getTrendIcon()}
        </div>
      </div>

      {/* Sparkline Area - placeholder for future micro charts */}
      <div className="mt-4 h-8 rounded bg-gray-800/50 opacity-50" />
    </BasePanel>
  )
}