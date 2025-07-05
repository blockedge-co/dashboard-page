"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { co2eApi, type ProjectData } from '@/lib/co2e-api';
import { usePerformance } from './use-performance';

export interface DashboardState {
  projects: ProjectData[];
  projectStats: any;
  realData: any;
  activeTab: string;
  selectedFilter: string;
  selectedRegistry: string;
  selectedProject: ProjectData | null;
  showProjectDetails: boolean;
  isLoading: boolean;
  dataLoaded: boolean;
  error: string | null;
}

export interface DashboardActions {
  setActiveTab: (tab: string) => void;
  setSelectedFilter: (filter: string) => void;
  setSelectedRegistry: (registry: string) => void;
  setSelectedProject: (project: ProjectData | null) => void;
  setShowProjectDetails: (show: boolean) => void;
  handleViewProjectDetails: (project: ProjectData) => void;
  refreshData: () => Promise<void>;
  clearError: () => void;
}

export function useDashboardState(): DashboardState & DashboardActions {
  // Core state
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [projectStats, setProjectStats] = useState<any>(null);
  const [realData, setRealData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("portfolio");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedRegistry, setSelectedRegistry] = useState("all");
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Performance optimization
  const { shouldReduceAnimations } = usePerformance();

  // Initialize real data
  const initializeRealData = useCallback(() => {
    const data = co2eApi.getRealDashboardData();
    setRealData({
      ...data,
      heroMetrics: data.heroMetrics.map((metric: any) => ({
        ...metric,
        icon: metric.icon, // Keep icon as string for now
      })),
    });
  }, []);

  // Fetch all data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setDataLoaded(false);

    try {
      const [transactions, blocks, stats, projectsData, projectStatsData] = await Promise.all([
        co2eApi.getMainPageTransactions(),
        co2eApi.getMainPageBlocks(),
        co2eApi.getStats(),
        co2eApi.getProjects(),
        co2eApi.getProjectStats(),
      ]);

      if (projectsData && projectsData.length > 0) {
        setProjects(projectsData);
        setProjectStats(projectStatsData);
        setDataLoaded(true);

        // Update real data with fetched information
        setRealData((prev: any) => ({
          ...prev,
          recentTransactions: transactions.slice(0, 6).map((tx, index) => ({
            id: `TX${(index + 1).toString().padStart(3, "0")}`,
            type: tx.method || "Contract Call",
            hash: tx.hash,
            amount: `${tx.value || "0"} CO2E`,
            value: tx.value || "0",
            from: tx.from?.hash || "",
            to: tx.to?.hash || "",
            timestamp: tx.timestamp || "Recently",
            status: tx.status || "Success",
          })),
          recentBlocks: blocks.slice(0, 5).map((block) => ({
            number: block.number,
            timestamp: block.timestamp,
            transactions: block.transaction_count,
            gasUsed: block.gas_used,
            gasLimit: block.gas_limit,
          })),
          heroMetrics: [
            {
              title: "Total Projects",
              value: projectStatsData.total > 0 ? projectStatsData.total.toString() : "—",
              change: "",
              trend: "up" as const,
              icon: "Leaf",
              pulse: true,
              color: "from-teal-500 to-cyan-600",
            },
            {
              title: "CO2 Reduction",
              value: projectStatsData.totalCO2Reduction && projectStatsData.totalCO2Reduction !== "0"
                ? projectStatsData.totalCO2Reduction
                : "—",
              change: "",
              trend: "up" as const,
              icon: "Award",
              pulse: false,
              color: "from-cyan-500 to-sky-600",
            },
            {
              title: "Total Blocks",
              value: stats.total_blocks && stats.total_blocks !== "0"
                ? stats.total_blocks
                : "—",
              change: "",
              trend: "up" as const,
              icon: "Building2",
              pulse: true,
              color: "from-sky-500 to-indigo-600",
            },
            {
              title: "Standards",
              value: projectStatsData.totalStandards > 0
                ? projectStatsData.totalStandards.toString()
                : "—",
              change: "",
              trend: "up" as const,
              icon: "Award",
              pulse: false,
              color: "from-emerald-500 to-teal-600",
            },
          ],
        }));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error instanceof Error ? error.message : "Failed to load dashboard data");
      setDataLoaded(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize data on mount
  useEffect(() => {
    initializeRealData();
    fetchData();
  }, [initializeRealData, fetchData]);

  // Action handlers
  const handleViewProjectDetails = useCallback((project: ProjectData) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  }, []);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Return state and actions
  return useMemo(() => ({
    // State
    projects,
    projectStats,
    realData,
    activeTab,
    selectedFilter,
    selectedRegistry,
    selectedProject,
    showProjectDetails,
    isLoading,
    dataLoaded,
    error,
    
    // Actions
    setActiveTab,
    setSelectedFilter,
    setSelectedRegistry,
    setSelectedProject,
    setShowProjectDetails,
    handleViewProjectDetails,
    refreshData,
    clearError,
  }), [
    projects,
    projectStats,
    realData,
    activeTab,
    selectedFilter,
    selectedRegistry,
    selectedProject,
    showProjectDetails,
    isLoading,
    dataLoaded,
    error,
    handleViewProjectDetails,
    refreshData,
    clearError,
  ]);
}