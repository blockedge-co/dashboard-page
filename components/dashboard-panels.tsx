"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Leaf,
  BarChart3,
  Activity,
  Users,
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";

// Sample data generators
const generateTimeSeriesData = (points: number = 24) => {
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(Date.now() - (points - i) * 60 * 60 * 1000).toISOString(),
    value: Math.floor(Math.random() * 100) + 50 + Math.sin(i * 0.5) * 20,
    secondary: Math.floor(Math.random() * 50) + 25,
  }));
};

const generateBarData = () => {
  const categories = ['Forestry', 'Renewable Energy', 'Agriculture', 'Industrial', 'Transportation'];
  return categories.map(cat => ({
    name: cat,
    value: Math.floor(Math.random() * 10000) + 5000,
    growth: Math.random() * 20 - 10,
  }));
};

const generatePieData = () => {
  return [
    { name: 'Active', value: 65, color: '#10b981' },
    { name: 'Pending', value: 20, color: '#f59e0b' },
    { name: 'Retired', value: 15, color: '#6b7280' },
  ];
};

// KPI Card Panel
export function KPIPanel({ title, value, change, icon: Icon, trend, color = "emerald" }: {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend: 'up' | 'down' | 'neutral';
  color?: string;
}) {
  const trendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity;
  const TrendIcon = trendIcon;

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-${color}-500/20`}>
              <Icon className={`w-5 h-5 text-${color}-400`} />
            </div>
            <div>
              <p className="text-sm text-slate-400">{title}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TrendIcon className={`w-4 h-4 ${
              trend === 'up' ? 'text-emerald-400' : 
              trend === 'down' ? 'text-red-400' : 
              'text-slate-400'
            }`} />
            <span className={`text-sm font-medium ${
              trend === 'up' ? 'text-emerald-400' : 
              trend === 'down' ? 'text-red-400' : 
              'text-slate-400'
            }`}>
              {change}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Time Series Chart Panel
export function TimeSeriesPanel({ title = "Time Series Data", color = "#10b981" }: {
  title?: string;
  color?: string;
}) {
  const [data, setData] = useState(generateTimeSeriesData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateTimeSeriesData());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-slate-200">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#f9fafb'
                }}
                labelFormatter={(value) => new Date(value).toLocaleString()}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Bar Chart Panel
export function BarChartPanel({ title = "Bar Chart Data" }: { title?: string }) {
  const [data, setData] = useState(generateBarData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateBarData());
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-slate-200">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#f9fafb'
                }}
              />
              <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Pie Chart Panel
export function PieChartPanel({ title = "Distribution" }: { title?: string }) {
  const [data, setData] = useState(generatePieData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generatePieData());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-slate-200">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#f9fafb'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-slate-400">{entry.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Activity Feed Panel
export function ActivityFeedPanel({ title = "Recent Activity" }: { title?: string }) {
  const [activities] = useState([
    { id: 1, type: 'transaction', message: 'New carbon credit transaction', time: '2 minutes ago', icon: DollarSign },
    { id: 2, type: 'retirement', message: 'Carbon credits retired', time: '5 minutes ago', icon: Leaf },
    { id: 3, type: 'project', message: 'New project registered', time: '12 minutes ago', icon: CheckCircle },
    { id: 4, type: 'alert', message: 'System maintenance scheduled', time: '1 hour ago', icon: AlertTriangle },
    { id: 5, type: 'user', message: 'New user registered', time: '2 hours ago', icon: Users },
  ]);

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-slate-200">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 hover:bg-slate-900/70 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center">
                <activity.icon className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200">{activity.message}</p>
                <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Status Panel
export function StatusPanel({ title = "System Status" }: { title?: string }) {
  const [status] = useState([
    { name: 'API Server', status: 'healthy', uptime: '99.9%', color: 'emerald' },
    { name: 'Database', status: 'healthy', uptime: '99.8%', color: 'emerald' },
    { name: 'Blockchain Node', status: 'warning', uptime: '98.2%', color: 'amber' },
    { name: 'File Storage', status: 'healthy', uptime: '99.9%', color: 'emerald' },
  ]);

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-slate-200">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          {status.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  service.color === 'emerald' ? 'bg-emerald-500' : 
                  service.color === 'amber' ? 'bg-amber-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-slate-200">{service.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-xs ${
                  service.color === 'emerald' ? 'text-emerald-400 border-emerald-500/50' : 
                  service.color === 'amber' ? 'text-amber-400 border-amber-500/50' : 'text-red-400 border-red-500/50'
                }`}>
                  {service.status}
                </Badge>
                <span className="text-xs text-slate-500">{service.uptime}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Progress Panel
export function ProgressPanel({ title = "Monthly Goals" }: { title?: string }) {
  const [goals] = useState([
    { name: 'Carbon Credits Issued', current: 75, target: 100, unit: 'k' },
    { name: 'Projects Registered', current: 12, target: 20, unit: '' },
    { name: 'Revenue Target', current: 850, target: 1000, unit: 'k' },
    { name: 'User Registrations', current: 340, target: 500, unit: '' },
  ]);

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-slate-200">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-6">
          {goals.map((goal, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-200">{goal.name}</span>
                <span className="text-sm text-slate-400">
                  {goal.current}{goal.unit} / {goal.target}{goal.unit}
                </span>
              </div>
              <Progress 
                value={(goal.current / goal.target) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Area Chart Panel
export function AreaChartPanel({ title = "Area Chart Data" }: { title?: string }) {
  const [data, setData] = useState(generateTimeSeriesData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateTimeSeriesData());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-slate-200">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#f9fafb'
                }}
                labelFormatter={(value) => new Date(value).toLocaleString()}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981"
                fill="#10b981" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}