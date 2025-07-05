"use client"

import { BasePanel, PanelSize } from './base-panel'
import { ReactNode } from 'react'
import { AlertTriangle, AlertCircle, CheckCircle, Info, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type AlertType = 'success' | 'warning' | 'error' | 'info'
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical'

interface Alert {
  id: string
  type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  timestamp: Date
  actionLabel?: string
  onAction?: () => void
  dismissible?: boolean
}

interface AlertPanelProps {
  title?: string
  description?: string
  size?: PanelSize
  loading?: boolean
  error?: string
  className?: string
  alerts: Alert[]
  onDismiss?: (alertId: string) => void
  onActionClick?: (alertId: string, action: () => void) => void
  maxAlerts?: number
}

const alertTypeConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/50',
    iconColor: 'text-green-500',
    titleColor: 'text-green-400'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/50',
    iconColor: 'text-yellow-500',
    titleColor: 'text-yellow-400'
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/50',
    iconColor: 'text-red-500',
    titleColor: 'text-red-400'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/50',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-400'
  }
}

const severityConfig = {
  low: 'opacity-70',
  medium: 'opacity-85',
  high: 'opacity-100',
  critical: 'opacity-100 ring-1 ring-red-500/30'
}

export function AlertPanel({
  title = 'System Alerts',
  description,
  size = 'md',
  loading = false,
  error,
  className,
  alerts,
  onDismiss,
  onActionClick,
  maxAlerts = 5
}: AlertPanelProps) {
  const displayedAlerts = alerts.slice(0, maxAlerts)
  const hasMoreAlerts = alerts.length > maxAlerts

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return `${Math.floor(diffMins / 1440)}d ago`
  }

  return (
    <BasePanel
      title={title}
      description={description}
      size={size}
      loading={loading}
      error={error}
      className={className}
    >
      <div className="space-y-3">
        {displayedAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
            <p className="text-sm text-gray-400">No active alerts</p>
          </div>
        ) : (
          displayedAlerts.map((alert) => {
            const config = alertTypeConfig[alert.type]
            const Icon = config.icon
            
            return (
              <div
                key={alert.id}
                className={cn(
                  'relative rounded-lg border p-4 transition-all duration-200',
                  config.bgColor,
                  config.borderColor,
                  severityConfig[alert.severity]
                )}
              >
                <div className="flex items-start gap-3">
                  <Icon className={cn('h-5 w-5 flex-shrink-0', config.iconColor)} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={cn('text-sm font-medium', config.titleColor)}>
                        {alert.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(alert.timestamp)}
                        </span>
                        {alert.dismissible && onDismiss && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-gray-800"
                            onClick={() => onDismiss(alert.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <p className="mt-1 text-sm text-gray-300">
                      {alert.message}
                    </p>
                    
                    {alert.actionLabel && alert.onAction && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 h-7"
                        onClick={() => onActionClick?.(alert.id, alert.onAction!)}
                      >
                        {alert.actionLabel}
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Severity indicator */}
                <div className={cn(
                  'absolute left-0 top-0 h-full w-1 rounded-l-lg',
                  alert.severity === 'critical' && 'bg-red-500',
                  alert.severity === 'high' && 'bg-orange-500',
                  alert.severity === 'medium' && 'bg-yellow-500',
                  alert.severity === 'low' && 'bg-blue-500'
                )} />
              </div>
            )
          })
        )}
        
        {hasMoreAlerts && (
          <div className="text-center">
            <Button variant="ghost" size="sm" className="text-gray-500">
              View {alerts.length - maxAlerts} more alerts
            </Button>
          </div>
        )}
      </div>
    </BasePanel>
  )
}