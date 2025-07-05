"use client"

import { BasePanel, PanelSize } from './base-panel'
import { ReactNode } from 'react'
import { Search, Filter, Download, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  width?: string
  render?: (value: any, row: any) => ReactNode
}

interface TablePanelProps {
  title: string
  description?: string
  size?: PanelSize
  loading?: boolean
  error?: string
  className?: string
  columns: TableColumn[]
  data: any[]
  showSearch?: boolean
  showFilter?: boolean
  showExport?: boolean
  onSearch?: (query: string) => void
  onFilter?: () => void
  onExport?: () => void
  onSort?: (column: string, direction: 'asc' | 'desc') => void
  maxHeight?: string
}

export function TablePanel({
  title,
  description,
  size = 'xl',
  loading = false,
  error,
  className,
  columns,
  data,
  showSearch = true,
  showFilter = true,
  showExport = true,
  onSearch,
  onFilter,
  onExport,
  onSort,
  maxHeight = '400px'
}: TablePanelProps) {
  const headerAction = (
    <div className="flex items-center gap-2">
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search..."
            className="h-8 w-40 pl-8"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      )}
      {showFilter && (
        <Button
          variant="outline"
          size="sm"
          onClick={onFilter}
          className="h-8"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      )}
      {showExport && (
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="h-8"
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      )}
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
      <div className="overflow-hidden rounded-md border border-gray-800">
        <div
          className="overflow-auto"
          style={{ maxHeight }}
        >
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-900/95 backdrop-blur-sm">
              <tr className="border-b border-gray-800">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      'px-4 py-3 font-medium text-gray-300',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.sortable && 'cursor-pointer hover:text-gray-100'
                    )}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && onSort?.(column.key, 'asc')}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && (
                        <ArrowUpDown className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-4 py-3 text-gray-300',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="border-t border-gray-800 bg-gray-900/50 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing {data.length} of {data.length} entries
            </span>
            <span>
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </BasePanel>
  )
}