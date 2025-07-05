"use client"

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export type PanelSize = 'sm' | 'md' | 'lg' | 'xl'

interface BasePanelProps {
  children: ReactNode
  title?: string
  description?: string
  size?: PanelSize
  loading?: boolean
  error?: string
  className?: string
  headerAction?: ReactNode
}

const sizeClasses: Record<PanelSize, string> = {
  sm: 'col-span-12 md:col-span-6 lg:col-span-3',
  md: 'col-span-12 md:col-span-6 lg:col-span-4',
  lg: 'col-span-12 md:col-span-12 lg:col-span-6',
  xl: 'col-span-12'
}

export function BasePanel({
  children,
  title,
  description,
  size = 'md',
  loading = false,
  error,
  className,
  headerAction
}: BasePanelProps) {
  return (
    <div
      className={cn(
        sizeClasses[size],
        'group relative overflow-hidden rounded-sm border border-gray-800 bg-[#181B1F] transition-all duration-200',
        'hover:border-gray-700 hover:shadow-lg hover:shadow-black/20',
        className
      )}
    >
      {/* Panel Header */}
      {(title || headerAction) && (
        <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
          <div>
            {title && (
              <h3 className="text-sm font-medium text-gray-100">{title}</h3>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-gray-500">{description}</p>
            )}
          </div>
          {headerAction && (
            <div className="flex items-center gap-2">{headerAction}</div>
          )}
        </div>
      )}

      {/* Panel Content */}
      <div className="relative p-4">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#181B1F]/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <span className="text-xs text-gray-500">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#181B1F]/80 backdrop-blur-sm">
            <div className="max-w-[80%] text-center">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </div>
        )}

        {!error && children}
      </div>

      {/* Hover Accent */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
    </div>
  )
}