"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GrafanaDashboard } from "./grafana-dashboard";
import { 
  KPIPanel, 
  TimeSeriesPanel, 
  BarChartPanel, 
  PieChartPanel, 
  ActivityFeedPanel, 
  StatusPanel, 
  ProgressPanel, 
  AreaChartPanel 
} from "./dashboard-panels";
import { CarbonDashboard } from "./carbon-dashboard";
import { 
  DollarSign, 
  Leaf, 
  Users, 
  TrendingUp, 
  Activity, 
  Globe,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  Shield,
  Clock
} from "lucide-react";

// Enhanced panel component that wraps existing dashboard content
function ExistingDashboardPanel() {
  return (
    <div className="h-full overflow-hidden">
      <CarbonDashboard />
    </div>
  );
}

// Custom wrapper for full-width panels
function FullWidthPanel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`col-span-12 ${className}`}>
      {children}
    </div>
  );
}

// Tab-specific panel configurations
const createPanelConfigurations = () => ({
  overview: [
    // KPI Row
    {
      id: "kpi-revenue",
      component: () => (
        <KPIPanel
          title="Total Revenue"
          value="$2.4M"
          change="+12.3%"
          icon={DollarSign}
          trend="up"
          color="emerald"
        />
      ),
      gridClass: "col-span-3"
    },
    {
      id: "kpi-credits",
      component: () => (
        <KPIPanel
          title="Credits Issued"
          value="847K"
          change="+8.7%"
          icon={Leaf}
          trend="up"
          color="emerald"
        />
      ),
      gridClass: "col-span-3"
    },
    {
      id: "kpi-users",
      component: () => (
        <KPIPanel
          title="Active Users"
          value="1,234"
          change="+5.2%"
          icon={Users}
          trend="up"
          color="blue"
        />
      ),
      gridClass: "col-span-3"
    },
    {
      id: "kpi-projects",
      component: () => (
        <KPIPanel
          title="Active Projects"
          value="156"
          change="+2.1%"
          icon={Globe}
          trend="up"
          color="purple"
        />
      ),
      gridClass: "col-span-3"
    },
    // Main Dashboard
    {
      id: "main-dashboard",
      component: ExistingDashboardPanel,
      gridClass: "col-span-12"
    }
  ],
  retirement: [
    {
      id: "retirement-kpi-volume",
      component: () => (
        <KPIPanel
          title="Monthly Retirements"
          value="45.2K"
          change="+15.7%"
          icon={Leaf}
          trend="up"
          color="emerald"
        />
      ),
      gridClass: "col-span-3"
    },
    {
      id: "retirement-kpi-value",
      component: () => (
        <KPIPanel
          title="Retirement Value"
          value="$1.2M"
          change="+22.1%"
          icon={DollarSign}
          trend="up"
          color="emerald"
        />
      ),
      gridClass: "col-span-3"
    },
    {
      id: "retirement-kpi-projects",
      component: () => (
        <KPIPanel
          title="Active Projects"
          value="87"
          change="+3.2%"
          icon={Globe}
          trend="up"
          color="blue"
        />
      ),
      gridClass: "col-span-3"
    },
    {
      id: "retirement-kpi-rate",
      component: () => (
        <KPIPanel
          title="Retirement Rate"
          value="12.3%"
          change="+1.8%"
          icon={TrendingUp}
          trend="up"
          color="purple"
        />
      ),
      gridClass: "col-span-3"
    },
    {
      id: "retirement-volume-chart",
      component: () => (
        <TimeSeriesPanel
          title="Monthly Retirement Volume"
          color="#f59e0b"
        />
      ),
      gridClass: "col-span-8"
    },
    {
      id: "retirement-distribution",
      component: () => (
        <PieChartPanel
          title="Retirement Distribution"
        />
      ),
      gridClass: "col-span-4"
    },
    {
      id: "retirement-by-sector",
      component: () => (
        <BarChartPanel
          title="Retirements by Sector"
        />
      ),
      gridClass: "col-span-6"
    },
    {
      id: "retirement-trends",
      component: () => (
        <AreaChartPanel
          title="Retirement Trends"
        />
      ),
      gridClass: "col-span-6"
    }
  ],
  tokenization: [
    {
      id: "tokenization-kpi-rate",
      component: () => (
        <KPIPanel
          title="Daily Tokenization"
          value="23.4K"
          change="+18.5%"
          icon={Zap}
          trend="up"
          color="purple"
        />
      ),
      gridClass: "col-span-3"
    },
    {
      id: "tokenization-kpi-value",
      component: () => (
        <KPIPanel
          title="Token Value"
          value="$847K"
          change="+12.7%"
          icon={DollarSign}
          trend="up"
          color="emerald"
        />
      ),
      gridClass: "col-span-3"
    },
    {
      id: "tokenization-kpi-supply",
      component: () => (
        <KPIPanel
          title="Total Supply"
          value="2.1M"
          change="+9.3%"
          icon={Activity}
          trend="up"
          color="blue"
        />
      ),
      gridClass: "col-span-3"
    },
    {
      id: "tokenization-kpi-burned",
      component: () => (
        <KPIPanel
          title="Tokens Burned"
          value="156K"
          change="+25.1%"
          icon={Shield}
          trend="up"
          color="red"
        />
      ),
      gridClass: "col-span-3"
    },
    {
      id: "tokenization-rate-chart",
      component: () => (
        <TimeSeriesPanel
          title="Daily Tokenization Rate"
          color="#8b5cf6"
        />
      ),
      gridClass: "col-span-8"
    },
    {
      id: "token-status",
      component: () => (
        <PieChartPanel
          title="Token Status Distribution"
        />
      ),
      gridClass: "col-span-4"
    },
    {
      id: "tokenization-by-project",
      component: () => (
        <BarChartPanel
          title="Tokenization by Project Type"
        />
      ),
      gridClass: "col-span-12"
    }
  ],
  realtime: [
    {
      id: "realtime-kpi-tps",
      component: () => (
        <KPIPanel
          title="Transactions/sec"
          value="45.2"
          change="+5.7%"
          icon={Zap}
          trend="up"
          color="emerald"
        />
      ),
      gridClass: "col-span-3"
    },
    {
      id: "realtime-kpi-users",
      component: () => (
        <KPIPanel
          title="Active Users"
          value="1,847"
          change="+12.3%"
          icon={Users}
          trend="up"
          color="blue"
        />
      ),
      gridClass: "col-span-3"
    },
    {
      id: "realtime-kpi-latency",
      component: () => (
        <KPIPanel
          title="Avg Latency"
          value="245ms"
          change="-8.2%"
          icon={Clock}
          trend="down"
          color="emerald"
        />
      ),
      gridClass: "col-span-3"
    },
    {
      id: "realtime-kpi-uptime",
      component: () => (
        <KPIPanel
          title="Uptime"
          value="99.9%"
          change="+0.1%"
          icon={Shield}
          trend="up"
          color="emerald"
        />
      ),
      gridClass: "col-span-3"
    },
    {
      id: "realtime-transactions",
      component: () => (
        <TimeSeriesPanel
          title="Live Transaction Feed"
          color="#ef4444"
        />
      ),
      gridClass: "col-span-6"
    },
    {
      id: "realtime-activity",
      component: () => (
        <ActivityFeedPanel
          title="Live Activity Feed"
        />
      ),
      gridClass: "col-span-6"
    },
    {
      id: "realtime-status",
      component: () => (
        <StatusPanel
          title="Real-time System Health"
        />
      ),
      gridClass: "col-span-12"
    }
  ],
  historical: [
    {
      id: "historical-kpi-total",
      component: () => (
        <KPIPanel
          title="Total Credits"
          value="5.2M"
          change="+145.7%"
          icon={Leaf}
          trend="up"
          color="emerald"
        />
      ),
      gridClass: "col-span-3"
    },
    {
      id: "historical-kpi-projects",
      component: () => (
        <KPIPanel
          title="Total Projects"
          value="342"
          change="+67.2%"
          icon={Globe}
          trend="up"
          color="blue"
        />
      ),
      gridClass: "col-span-3"
    },
    {
      id: "historical-kpi-users",
      component: () => (
        <KPIPanel
          title="Total Users"
          value="12.4K"
          change="+234.1%"
          icon={Users}
          trend="up"
          color="purple"
        />
      ),
      gridClass: "col-span-3"
    },
    {
      id: "historical-kpi-volume",
      component: () => (
        <KPIPanel
          title="Trading Volume"
          value="$45.2M"
          change="+189.3%"
          icon={DollarSign}
          trend="up"
          color="emerald"
        />
      ),
      gridClass: "col-span-3"
    },
    {
      id: "historical-trends",
      component: () => (
        <AreaChartPanel
          title="Historical Carbon Credit Trends"
        />
      ),
      gridClass: "col-span-12"
    },
    {
      id: "historical-comparison",
      component: () => (
        <BarChartPanel
          title="Year-over-Year Comparison"
        />
      ),
      gridClass: "col-span-6"
    },
    {
      id: "historical-performance",
      component: () => (
        <TimeSeriesPanel
          title="Historical Performance"
          color="#06b6d4"
        />
      ),
      gridClass: "col-span-6"
    }
  ]
});

export function EnhancedGrafanaDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [panelConfigurations, setPanelConfigurations] = useState<any>({});

  useEffect(() => {
    setPanelConfigurations(createPanelConfigurations());
  }, []);

  // Get current tab panels
  const currentPanels = panelConfigurations[activeTab] || [];

  return (
    <div className="h-screen bg-slate-900 overflow-hidden">
      <GrafanaDashboard className="grafana-dashboard" />
      <div className="grid grid-cols-12 gap-4 p-4">
        {currentPanels.map((panel: any, index: number) => {
          const PanelComponent = panel.component;
          return (
            <motion.div
              key={`${activeTab}-${panel.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={panel.gridClass}
            >
              <PanelComponent />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}