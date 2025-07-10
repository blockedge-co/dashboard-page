"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GrafanaPanel,
  StatPanel,
  TablePanel,
  StatusIndicator,
} from "@/components/panels/grafana-panel";
import {
  TimeSeriesPanel,
  GaugePanel,
  DonutChartPanel,
} from "@/components/panels/time-series-panel";
import {
  DashboardGrid,
  GridPanel,
  DashboardHeader,
  MetricsSummary,
  ResponsivePanel,
} from "@/components/dashboard-grid";
import {
  irecAggregationService,
  getIrecAnalytics,
  getIrecCertificateList,
} from "@/lib/irec-aggregation";
import type {
  IrecCertificateComplete,
  IrecAnalytics,
  IrecCertificateList,
  IrecSearchFilters,
} from "@/lib/types/irec";
import {
  Award,
  Database,
  Filter,
  Grid3X3,
  List,
  Loader2,
  RefreshCw,
  Search,
  TrendingUp,
  Zap,
  Activity,
  DollarSign,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
} from "lucide-react";

interface PageState {
  analytics: IrecAnalytics | null;
  certificateList: IrecCertificateList | null;
  loading: boolean;
  error: string | null;
  filters: IrecSearchFilters;
  viewMode: "grid" | "list";
  selectedCertificate: IrecCertificateComplete | null;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-xl font-medium text-foreground">
          Loading IREC Certificate Data...
        </h2>
        <p className="text-sm text-muted-foreground">
          Fetching data from CO2e Chain and Optimism
        </p>
      </div>
    </div>
  );
}

export function IrecCertificatesContent() {
  const [state, setState] = useState<PageState>({
    analytics: null,
    certificateList: null,
    loading: true,
    error: null,
    filters: {
      page: 1,
      pageSize: 12,
      sortBy: "issuanceDate",
      sortOrder: "desc",
    },
    viewMode: "grid",
    selectedCertificate: null,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Load data when filters change
  useEffect(() => {
    if ((state.filters.page && state.filters.page > 1) || searchQuery) {
      loadCertificates();
    }
  }, [state.filters, searchQuery]);

  const loadData = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // Load analytics and certificate list in parallel
      const [analyticsData, certificateListData] = await Promise.all([
        getIrecAnalytics(),
        getIrecCertificateList(state.filters),
      ]);

      setState((prev) => ({
        ...prev,
        analytics: analyticsData,
        certificateList: certificateListData,
        loading: false,
      }));
    } catch (error) {
      console.error("Error loading IREC data:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to load data",
      }));
    }
  };

  const loadCertificates = async () => {
    try {
      const updatedFilters = {
        ...state.filters,
        query: searchQuery || undefined,
      };

      const certificateListData = await getIrecCertificateList(updatedFilters);
      setState((prev) => ({
        ...prev,
        certificateList: certificateListData,
      }));
    } catch (error) {
      console.error("Error loading certificates:", error);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    irecAggregationService.clearCache();
    await loadData();
    setIsRefreshing(false);
  };

  const updateFilters = (newFilters: Partial<IrecSearchFilters>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters, page: 1 },
    }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleViewCertificate = (certificateId: string) => {
    const certificate = state.certificateList?.certificates.find(
      (c) => c.id === certificateId
    );
    if (certificate) {
      setState((prev) => ({ ...prev, selectedCertificate: certificate }));
    }
  };

  const handleBuyCertificate = (certificateId: string) => {
    // Implement buy functionality
    console.log("Buy certificate:", certificateId);
  };

  const handlePageChange = (page: number) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, page },
    }));
  };

  if (state.loading) {
    return <LoadingSpinner />;
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] p-4">
        <div className="max-w-md text-center">
          <GrafanaPanel
            title="Error Loading Data"
            status="error"
            statusText="Connection Failed"
          >
            <div className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {state.error}
              </p>
              <Button onClick={loadData} variant="destructive">
                Try Again
              </Button>
            </div>
          </GrafanaPanel>
        </div>
      </div>
    );
  }

  // Generate mock data for demonstration
  const mockMetrics = [
    {
      label: "Total Supply",
      value: "2,847,592",
      unit: "MWh",
      change: { value: 12.5, period: "30d" },
      trend: "up" as const,
    },
    {
      label: "Active Certificates",
      value: "1,429",
      change: { value: 8.2, period: "30d" },
      trend: "up" as const,
    },
    {
      label: "Total Volume (24h)",
      value: "$847,293",
      change: { value: -3.1, period: "24h" },
      trend: "down" as const,
    },
    {
      label: "Avg Price",
      value: "$12.47",
      unit: "per MWh",
      change: { value: 1.8, period: "7d" },
      trend: "up" as const,
    },
  ];

  const timeSeriesData = [
    { timestamp: "00:00", value: 2840000 },
    { timestamp: "04:00", value: 2841500 },
    { timestamp: "08:00", value: 2843200 },
    { timestamp: "12:00", value: 2845800 },
    { timestamp: "16:00", value: 2846900 },
    { timestamp: "20:00", value: 2847592 },
  ];

  const distributionData = [
    { name: "Solar", value: 45, color: "hsl(var(--chart-2))" },
    { name: "Wind", value: 35, color: "hsl(var(--chart-1))" },
    { name: "Hydro", value: 15, color: "hsl(var(--chart-3))" },
    { name: "Other", value: 5, color: "hsl(var(--chart-4))" },
  ];

  const recentTransactions = [
    ["TX001", "Buy", "150 MWh", "$1,847", "2 min ago"],
    ["TX002", "Sell", "75 MWh", "$923", "5 min ago"],
    ["TX003", "Tokenize", "200 MWh", "$2,460", "8 min ago"],
    ["TX004", "Buy", "300 MWh", "$3,694", "12 min ago"],
    ["TX005", "Retire", "100 MWh", "$1,230", "15 min ago"],
  ];

  const certificateData = [
    [
      "IREC-001",
      "Solar Farm Alpha",
      "Active",
      "450 MWh",
      "$12.45",
      "Singapore",
    ],
    ["IREC-002", "Wind Park Beta", "Active", "320 MWh", "$12.50", "Thailand"],
    [
      "IREC-003",
      "Hydro Plant Gamma",
      "Pending",
      "180 MWh",
      "$12.30",
      "Vietnam",
    ],
    [
      "IREC-004",
      "Solar Complex Delta",
      "Active",
      "680 MWh",
      "$12.55",
      "Malaysia",
    ],
    [
      "IREC-005",
      "Wind Farm Epsilon",
      "Retired",
      "250 MWh",
      "$12.40",
      "Philippines",
    ],
  ];

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader
        title="IREC Certificate Analytics"
        subtitle="International Renewable Energy Certificate trading and analytics dashboard"
        breadcrumb={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "IREC Certificates" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""} mr-2`}
              />
              Refresh
            </Button>
            <Button size="sm">
              <Award className="h-4 w-4 mr-2" />
              Buy Certificates
            </Button>
          </div>
        }
      />

      <MetricsSummary metrics={mockMetrics} />

      <DashboardGrid>
        {/* Status Indicators */}
        <ResponsivePanel sm={12} md={6} lg={6} xl={6}>
          <div className="space-y-3">
            <StatusIndicator
              label="CO2e Chain"
              status="online"
              value="Connected"
              lastUpdate="2 sec ago"
            />
            <StatusIndicator
              label="Optimism Network"
              status="online"
              value="Synced"
              lastUpdate="5 sec ago"
            />
            <StatusIndicator
              label="Market Data"
              status="warning"
              value="Delayed"
              lastUpdate="30 sec ago"
            />
          </div>
        </ResponsivePanel>

        {/* Supply Trend */}
        <ResponsivePanel sm={12} md={6} lg={6} xl={6}>
          <TimeSeriesPanel
            title="Total Supply Trend"
            description="24-hour supply changes"
            data={timeSeriesData}
            type="area"
            unit="MWh"
            height={180}
          />
        </ResponsivePanel>

        {/* Energy Source Distribution */}
        <ResponsivePanel sm={12} md={6} lg={4} xl={4}>
          <DonutChartPanel
            title="Energy Source Distribution"
            data={distributionData}
          />
        </ResponsivePanel>

        {/* Price Gauge */}
        <ResponsivePanel sm={12} md={6} lg={4} xl={4}>
          <GaugePanel
            title="Average Price"
            value={12.47}
            min={10}
            max={15}
            unit="$/MWh"
            thresholds={{ warning: 13, critical: 14 }}
          />
        </ResponsivePanel>

        {/* Trading Volume */}
        <ResponsivePanel sm={12} md={12} lg={4} xl={4}>
          <StatPanel
            title="24h Trading Volume"
            value="$847,293"
            change={{ value: -3.1, period: "24h" }}
            trend="down"
            description="Total transaction value"
          />
        </ResponsivePanel>

        {/* Recent Transactions */}
        <ResponsivePanel sm={12} md={12} lg={6} xl={6}>
          <TablePanel
            title="Recent Transactions"
            description="Latest blockchain activity"
            headers={["TX ID", "Type", "Amount", "Value", "Time"]}
            data={recentTransactions}
            maxHeight="300px"
          />
        </ResponsivePanel>

        {/* Certificate Listings */}
        <ResponsivePanel sm={12} md={12} lg={12} xl={12}>
          <TablePanel
            title="Active Certificates"
            description="Available IREC certificates for trading"
            headers={["ID", "Project", "Status", "Supply", "Price", "Country"]}
            data={certificateData}
            maxHeight="400px"
          />
        </ResponsivePanel>

        {/* Certificate Details */}
        <ResponsivePanel sm={12} md={12} lg={6} xl={6}>
          <GrafanaPanel
            title="Certificate Quality Metrics"
            description="Verification and compliance status"
          >
            <div className="space-y-4 p-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Verified Certificates
                </span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="font-mono text-sm">98.7%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Avg Verification Time
                </span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="font-mono text-sm">2.4 hrs</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Compliance Score
                </span>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-400" />
                  <span className="font-mono text-sm">94.2/100</span>
                </div>
              </div>
            </div>
          </GrafanaPanel>
        </ResponsivePanel>

        {/* Market Activity */}
        <ResponsivePanel sm={12} md={12} lg={6} xl={6}>
          <GrafanaPanel
            title="Market Activity"
            description="Trading statistics and trends"
          >
            <div className="grid grid-cols-2 gap-4 p-2">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-green-400">
                  1,247
                </div>
                <div className="text-xs text-muted-foreground">
                  Active Traders
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-blue-400">
                  $2.4M
                </div>
                <div className="text-xs text-muted-foreground">
                  Daily Volume
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-purple-400">
                  156
                </div>
                <div className="text-xs text-muted-foreground">
                  Transactions/hr
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-orange-400">
                  12.5s
                </div>
                <div className="text-xs text-muted-foreground">
                  Avg Block Time
                </div>
              </div>
            </div>
          </GrafanaPanel>
        </ResponsivePanel>
      </DashboardGrid>
    </div>
  );
}
