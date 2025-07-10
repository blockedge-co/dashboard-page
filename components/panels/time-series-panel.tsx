'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { GrafanaPanel } from './grafana-panel';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface TimeSeriesPanelProps {
  title: string;
  description?: string;
  data: TimeSeriesDataPoint[];
  type?: 'line' | 'area' | 'bar';
  color?: string;
  className?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  height?: number;
  yAxisDomain?: [number, number] | 'auto';
  unit?: string;
}

const ChartTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded p-2 shadow-lg">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-mono text-foreground">
          {payload[0].value}{unit ? ` ${unit}` : ''}
        </p>
      </div>
    );
  }
  return null;
};

export function TimeSeriesPanel({
  title,
  description,
  data,
  type = 'line',
  color = 'hsl(var(--chart-1))',
  className,
  showGrid = true,
  showTooltip = true,
  height = 200,
  yAxisDomain = 'auto',
  unit,
}: TimeSeriesPanelProps) {
  const ChartComponent = type === 'line' ? LineChart : type === 'area' ? AreaChart : BarChart;
  
  const chartProps = {
    data,
    margin: { top: 5, right: 5, left: 5, bottom: 5 },
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart {...chartProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <XAxis 
              dataKey="timestamp" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={yAxisDomain === 'auto' ? undefined : yAxisDomain}
            />
            {showTooltip && <Tooltip content={<ChartTooltip unit={unit} />} />}
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: color, strokeWidth: 2 }}
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...chartProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <XAxis 
              dataKey="timestamp" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={yAxisDomain === 'auto' ? undefined : yAxisDomain}
            />
            {showTooltip && <Tooltip content={<ChartTooltip unit={unit} />} />}
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={color}
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart {...chartProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />}
            <XAxis 
              dataKey="timestamp" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={yAxisDomain === 'auto' ? undefined : yAxisDomain}
            />
            {showTooltip && <Tooltip content={<ChartTooltip unit={unit} />} />}
            <Bar dataKey="value" fill={color} />
          </BarChart>
        );
      default:
        return <div />;
    }
  };

  return (
    <GrafanaPanel title={title} description={description} className={className} noPadding>
      <div className="p-4">
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </GrafanaPanel>
  );
}

export interface GaugeProps {
  title: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  thresholds?: {
    warning: number;
    critical: number;
  };
  className?: string;
}

export function GaugePanel({
  title,
  value,
  min,
  max,
  unit,
  thresholds,
  className,
}: GaugeProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  
  let color = 'hsl(var(--success))';
  if (thresholds) {
    if (value >= thresholds.critical) {
      color = 'hsl(var(--destructive))';
    } else if (value >= thresholds.warning) {
      color = 'hsl(var(--warning))';
    }
  }

  return (
    <GrafanaPanel title={title} className={className} size="sm">
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="hsl(var(--border))"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={color}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(percentage * 251.32) / 100} 251.32`}
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-foreground">
                {value}
              </div>
              {unit && (
                <div className="text-xs text-muted-foreground font-mono">
                  {unit}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-muted-foreground">
            Range: {min} - {max}
          </div>
        </div>
      </div>
    </GrafanaPanel>
  );
}

export interface DonutChartProps {
  title: string;
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  centerText?: string;
  centerSubtext?: string;
  className?: string;
}

export function DonutChartPanel({
  title,
  data,
  centerText,
  centerSubtext,
  className,
}: DonutChartProps) {
  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <GrafanaPanel title={title} className={className} size="sm">
      <div className="flex items-center justify-between h-full">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const data = payload[0].payload;
                    const percentage = ((data.value / total) * 100).toFixed(1);
                    return (
                      <div className="bg-popover border border-border rounded p-2 shadow-lg">
                        <p className="text-xs text-muted-foreground">{data.name}</p>
                        <p className="text-sm font-mono text-foreground">
                          {data.value} ({percentage}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {(centerText || centerSubtext) && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                {centerText && (
                  <div className="text-lg font-mono font-semibold text-foreground">
                    {centerText}
                  </div>
                )}
                {centerSubtext && (
                  <div className="text-xs text-muted-foreground">
                    {centerSubtext}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="ml-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: item.color || COLORS[index % COLORS.length] }}
              />
              <span className="text-muted-foreground">{item.name}</span>
              <span className="font-mono text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </GrafanaPanel>
  );
}