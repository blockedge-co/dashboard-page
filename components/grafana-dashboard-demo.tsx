"use client";

import { useState, useEffect } from "react";
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
import { 
  DollarSign, 
  Leaf, 
  Users, 
  TrendingUp, 
  Activity, 
  Globe,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";

// Panel configurations for different dashboard tabs
const panelConfigurations = {
  overview: [
    {
      id: "kpi-revenue",
      title: "Total Revenue",
      type: "kpi",
      component: KPIPanel,
      props: {
        title: "Total Revenue",
        value: "$2.4M",
        change: "+12.3%",
        icon: DollarSign,
        trend: "up" as const,
        color: "emerald"
      },
      position: { x: 0, y: 0, w: 3, h: 2 }
    },
    {
      id: "kpi-credits",
      title: "Credits Issued",
      type: "kpi",
      component: KPIPanel,
      props: {
        title: "Credits Issued",
        value: "847K",
        change: "+8.7%",
        icon: Leaf,
        trend: "up" as const,
        color: "emerald"
      },
      position: { x: 3, y: 0, w: 3, h: 2 }
    },
    {
      id: "kpi-users",
      title: "Active Users",
      type: "kpi",
      component: KPIPanel,
      props: {
        title: "Active Users",
        value: "1,234",
        change: "+5.2%",
        icon: Users,
        trend: "up" as const,
        color: "blue"
      },
      position: { x: 6, y: 0, w: 3, h: 2 }
    },
    {
      id: "kpi-projects",
      title: "Projects",
      type: "kpi",
      component: KPIPanel,
      props: {
        title: "Active Projects",
        value: "156",
        change: "+2.1%",
        icon: Globe,
        trend: "up" as const,
        color: "purple"
      },
      position: { x: 9, y: 0, w: 3, h: 2 }
    },
    {
      id: "timeseries-main",
      title: "Carbon Credits Over Time",
      type: "timeseries",
      component: TimeSeriesPanel,
      props: {
        title: "Carbon Credits Over Time",
        color: "#10b981"
      },
      position: { x: 0, y: 2, w: 8, h: 4 }
    },
    {
      id: "activity-feed",
      title: "Recent Activity",
      type: "activity",
      component: ActivityFeedPanel,
      props: {
        title: "Recent Activity"
      },
      position: { x: 8, y: 2, w: 4, h: 4 }
    },
    {
      id: "status-panel",
      title: "System Status",
      type: "status",
      component: StatusPanel,
      props: {
        title: "System Status"
      },
      position: { x: 0, y: 6, w: 6, h: 3 }
    },
    {
      id: "progress-panel",
      title: "Monthly Goals",
      type: "progress",
      component: ProgressPanel,
      props: {
        title: "Monthly Goals"
      },
      position: { x: 6, y: 6, w: 6, h: 3 }
    }
  ],
  retirement: [
    {
      id: "retirement-volume",
      title: "Retirement Volume",
      type: "timeseries",
      component: TimeSeriesPanel,
      props: {
        title: "Monthly Retirement Volume",
        color: "#f59e0b"
      },
      position: { x: 0, y: 0, w: 6, h: 4 }
    },
    {
      id: "retirement-by-sector",
      title: "Retirements by Sector",
      type: "bar",
      component: BarChartPanel,
      props: {
        title: "Retirements by Sector"
      },
      position: { x: 6, y: 0, w: 6, h: 4 }
    },
    {
      id: "retirement-distribution",
      title: "Retirement Distribution",
      type: "pie",
      component: PieChartPanel,
      props: {
        title: "Retirement Distribution"
      },
      position: { x: 0, y: 4, w: 6, h: 4 }
    },
    {
      id: "retirement-trends",
      title: "Retirement Trends",
      type: "area",
      component: AreaChartPanel,
      props: {
        title: "Retirement Trends"
      },
      position: { x: 6, y: 4, w: 6, h: 4 }
    }
  ],
  tokenization: [
    {
      id: "tokenization-rate",
      title: "Tokenization Rate",
      type: "timeseries",
      component: TimeSeriesPanel,
      props: {
        title: "Daily Tokenization Rate",
        color: "#8b5cf6"
      },
      position: { x: 0, y: 0, w: 8, h: 4 }
    },
    {
      id: "token-status",
      title: "Token Status",
      type: "pie",
      component: PieChartPanel,
      props: {
        title: "Token Status Distribution"
      },
      position: { x: 8, y: 0, w: 4, h: 4 }
    },
    {
      id: "tokenization-by-project",
      title: "Tokenization by Project",
      type: "bar",
      component: BarChartPanel,
      props: {
        title: "Tokenization by Project Type"
      },
      position: { x: 0, y: 4, w: 12, h: 4 }
    }
  ],
  realtime: [
    {
      id: "realtime-transactions",
      title: "Real-time Transactions",
      type: "timeseries",
      component: TimeSeriesPanel,
      props: {
        title: "Live Transaction Feed",
        color: "#ef4444"
      },
      position: { x: 0, y: 0, w: 6, h: 4 }
    },
    {
      id: "realtime-activity",
      title: "Live Activity",
      type: "activity",
      component: ActivityFeedPanel,
      props: {
        title: "Live Activity Feed"
      },
      position: { x: 6, y: 0, w: 6, h: 4 }
    },
    {
      id: "realtime-status",
      title: "System Health",
      type: "status",
      component: StatusPanel,
      props: {
        title: "Real-time System Health"
      },
      position: { x: 0, y: 4, w: 12, h: 4 }
    }
  ],
  historical: [
    {
      id: "historical-trends",
      title: "Historical Trends",
      type: "area",
      component: AreaChartPanel,
      props: {
        title: "Historical Carbon Credit Trends"
      },
      position: { x: 0, y: 0, w: 12, h: 4 }
    },
    {
      id: "historical-comparison",
      title: "Year-over-Year",
      type: "bar",
      component: BarChartPanel,
      props: {
        title: "Year-over-Year Comparison"
      },
      position: { x: 0, y: 4, w: 6, h: 4 }
    },
    {
      id: "historical-performance",
      title: "Performance Metrics",
      type: "timeseries",
      component: TimeSeriesPanel,
      props: {
        title: "Historical Performance",
        color: "#06b6d4"
      },
      position: { x: 6, y: 4, w: 6, h: 4 }
    }
  ]
};

export function GrafanaDashboardDemo() {
  const [panels, setPanels] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  // Load panels for active tab
  useEffect(() => {
    const tabPanels = panelConfigurations[activeTab as keyof typeof panelConfigurations] || [];
    setPanels(tabPanels);
  }, [activeTab]);

  // Custom dashboard with the panels rendered as children
  return (
    <GrafanaDashboard>
      {panels.map((panel) => {
        const PanelComponent = panel.component;
        return (
          <div
            key={panel.id}
            className={`col-span-${panel.position.w} row-span-${panel.position.h}`}
          >
            <PanelComponent {...panel.props} />
          </div>
        );
      })}
    </GrafanaDashboard>
  );
}