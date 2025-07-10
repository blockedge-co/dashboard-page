
import { ProjectData } from "./types";
import { MetricCardProps } from "../components/metric-cards";
import { BarChart3, Leaf, TrendingUp } from "lucide-react";

export const mapProjectToMetricCard = (project: ProjectData): MetricCardProps => ({
  title: project.name,
  value: project.totalSupply || "0",
  change: "N/A",
  trend: "up" as const,
  icon: Leaf,
  color: "from-green-500 to-emerald-600",
  description: project.description || project.name,
});

export const mapProjectsToMetricCards = (projects: ProjectData[]): MetricCardProps[] => {
  return projects.map(mapProjectToMetricCard);
};
