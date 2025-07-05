import type { Metadata } from "next";
import { EnhancedGrafanaDashboard } from "../../components/enhanced-grafana-dashboard";

export const metadata: Metadata = {
  title: "Grafana Dashboard - Blockedge",
  description: "Professional monitoring dashboard with Grafana-style interface for carbon credit analytics",
};

export default function GrafanaDashboardPage() {
  return <EnhancedGrafanaDashboard />;
}