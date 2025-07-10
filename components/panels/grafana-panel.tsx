'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export interface GrafanaPanelProps {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
  status?: 'loading' | 'success' | 'error' | 'warning';
  statusText?: string;
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  transparent?: boolean;
  noPadding?: boolean;
}

const statusConfig = {
  loading: { icon: Loader2, color: 'bg-blue-500', animate: 'animate-spin' },
  success: { icon: CheckCircle, color: 'bg-green-500', animate: '' },
  error: { icon: AlertCircle, color: 'bg-red-500', animate: '' },
  warning: { icon: AlertCircle, color: 'bg-yellow-500', animate: '' },
};

const sizeConfig = {
  sm: 'min-h-[200px]',
  md: 'min-h-[300px]',
  lg: 'min-h-[400px]',
  xl: 'min-h-[500px]',
};

export function GrafanaPanel({
  title,
  description,
  className,
  children,
  status,
  statusText,
  actions,
  size = 'md',
  transparent = false,
  noPadding = false,
}: GrafanaPanelProps) {
  const StatusIcon = status ? statusConfig[status]?.icon : null;

  return (
    <Card
      className={cn(
        'grafana-panel',
        'border-border bg-card',
        'hover:bg-card/80 transition-colors duration-200',
        sizeConfig[size],
        {
          'bg-transparent border-transparent': transparent,
        },
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center space-x-2">
          <div>
            <CardTitle className="text-sm font-medium text-foreground leading-none">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-xs text-muted-foreground mt-1">
                {description}
              </CardDescription>
            )}
          </div>
          {status && StatusIcon && (
            <div className="flex items-center space-x-1">
              <div className={cn('w-2 h-2 rounded-full', statusConfig[status].color)} />
              <StatusIcon 
                className={cn(
                  'h-3 w-3 text-muted-foreground',
                  statusConfig[status].animate
                )} 
              />
              {statusText && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {statusText}
                </Badge>
              )}
            </div>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-1">
            {actions}
          </div>
        )}
      </CardHeader>
      <CardContent className={cn('pt-0', { 'p-0': noPadding })}>
        {children}
      </CardContent>
    </Card>
  );
}

export interface StatPanelProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: {
    value: number;
    period: string;
  };
  trend?: 'up' | 'down' | 'neutral';
  status?: 'success' | 'warning' | 'error';
  description?: string;
  className?: string;
}

export function StatPanel({
  title,
  value,
  unit,
  change,
  trend,
  status,
  description,
  className,
}: StatPanelProps) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-muted-foreground',
  };

  const statusColors = {
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
  };

  return (
    <GrafanaPanel 
      title={title} 
      description={description}
      size="sm"
      className={className}
      noPadding
    >
      <div className="p-6 flex flex-col justify-center h-full">
        <div className="flex items-baseline space-x-1 mb-2">
          <span 
            className={cn(
              'text-3xl font-mono font-semibold',
              status ? statusColors[status] : 'text-foreground'
            )}
          >
            {value}
          </span>
          {unit && (
            <span className="text-sm text-muted-foreground font-mono">
              {unit}
            </span>
          )}
        </div>
        
        {change && (
          <div className="flex items-center space-x-2 text-xs">
            <span className={cn('font-mono', trend ? trendColors[trend] : 'text-muted-foreground')}>
              {change.value > 0 ? '+' : ''}{change.value}%
            </span>
            <span className="text-muted-foreground">
              {change.period}
            </span>
          </div>
        )}
      </div>
    </GrafanaPanel>
  );
}

export interface TablePanelProps {
  title: string;
  description?: string;
  headers: string[];
  data: Array<Array<string | number>>;
  className?: string;
  maxHeight?: string;
  sortable?: boolean;
}

export function TablePanel({
  title,
  description,
  headers,
  data,
  className,
  maxHeight = '400px',
  sortable = false,
}: TablePanelProps) {
  return (
    <GrafanaPanel 
      title={title} 
      description={description}
      className={className}
      noPadding
    >
      <div className="relative">
        <div 
          className="overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border"
          style={{ maxHeight }}
        >
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-card border-b border-border">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="text-left px-3 py-2 font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-3 py-2 font-mono text-foreground"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </GrafanaPanel>
  );
}

export interface StatusIndicatorProps {
  label: string;
  status: 'online' | 'warning' | 'error' | 'offline';
  value?: string | number;
  lastUpdate?: string;
  className?: string;
}

export function StatusIndicator({
  label,
  status,
  value,
  lastUpdate,
  className,
}: StatusIndicatorProps) {
  const statusConfig = {
    online: { color: 'bg-green-500', text: 'text-green-400', label: 'ONLINE' },
    warning: { color: 'bg-yellow-500', text: 'text-yellow-400', label: 'WARNING' },
    error: { color: 'bg-red-500', text: 'text-red-400', label: 'ERROR' },
    offline: { color: 'bg-gray-500', text: 'text-gray-400', label: 'OFFLINE' },
  };

  const config = statusConfig[status];

  return (
    <div className={cn('flex items-center space-x-3 p-3 rounded border border-border bg-card', className)}>
      <div className={cn('w-3 h-3 rounded-full', config.color)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <Badge variant="outline" className={cn('text-xs', config.text)}>
            {config.label}
          </Badge>
        </div>
        {value && (
          <div className="text-lg font-mono text-foreground mt-1">{value}</div>
        )}
        {lastUpdate && (
          <div className="text-xs text-muted-foreground mt-1">
            Last update: {lastUpdate}
          </div>
        )}
      </div>
    </div>
  );
}