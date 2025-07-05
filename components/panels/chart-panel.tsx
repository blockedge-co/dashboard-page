"use client"

import { BasePanel, PanelSize } from './base-panel'
import { ReactNode } from 'react'
import { MoreHorizontal, Download, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ChartPanelProps {
  title: string
  description?: string
  size?: PanelSize
  loading?: boolean
  error?: string
  className?: string
  children: ReactNode
  showActions?: boolean
  onExport?: () => void
  onFullscreen?: () => void
  timeRange?: string
  refreshInterval?: string
}

export function ChartPanel({
  title,
  description,
  size = 'lg',
  loading = false,
  error,
  className,
  children,
  showActions = true,
  onExport,
  onFullscreen,
  timeRange,
  refreshInterval
}: ChartPanelProps) {
  const headerAction = showActions && (
    <div className="flex items-center gap-2">
      {timeRange && (
        <span className="text-xs text-gray-500">{timeRange}</span>
      )}
      {refreshInterval && (
        <span className="text-xs text-gray-600">↻ {refreshInterval}</span>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {onExport && (
            <DropdownMenuItem onClick={onExport}>
              <Download className="mr-2 h-4 w-4" />
              Export data
            </DropdownMenuItem>
          )}
          {onFullscreen && (
            <DropdownMenuItem onClick={onFullscreen}>
              <Maximize2 className="mr-2 h-4 w-4" />
              View fullscreen
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  return (
    <BasePanel
      title={title}
      description={description}
      size={size}
      loading={loading}
      error={error}
      className={className}
      headerAction={headerAction}
    >
      <div className="relative">
        {/* Chart Container */}
        <div className="min-h-[200px] w-full">
          {children}
        </div>

        {/* Chart Legend/Controls */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Primary</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Secondary</span>
            </div>
          </div>
          <div className="text-right">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </BasePanel>
  )
}