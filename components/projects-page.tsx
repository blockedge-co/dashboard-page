"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  MapPin,
  Leaf,
  Award,
  Eye,
  Filter,
  Download,
  Search,
  TrendingUp,
  Users,
  Target,
  X,
  ExternalLink,
  Copy,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { co2eApi, fetchNFTMetadata } from "@/lib/co2e-api";
import { initializeProjectData } from "@/lib/project-data-manager";
import { useDebouncedFilter } from "@/hooks/use-debounced-filter";
import { usePerformance } from "@/hooks/use-performance";
import {
  viewTokenOnBlockchain,
  viewCertOnBlockchain,
} from "@/lib/blockchain-utils";

export function ProjectsPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedRegistry, setSelectedRegistry] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [nftMetadata, setNftMetadata] = useState<any>(null);
  const [loadingNftMetadata, setLoadingNftMetadata] = useState(false);

  // Generate impact trend data based on real project count
  const generateImpactData = useCallback((projectCount: number) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const baseImpact = Math.max(1000, projectCount * 200); // Base impact calculation
    const baseProjects = Math.max(20, projectCount - 10); // Base project count

    return months.map((month, index) => ({
      month,
      impact: Math.round(
        baseImpact + index * 150 + (Math.random() * 200 - 100)
      ),
      projects: Math.round(baseProjects + index * 5 + (Math.random() * 10 - 5)),
    }));
  }, []);

  const [impactData, setImpactData] = useState(() => generateImpactData(3)); // Default for 3 projects

  // Performance optimization
  const { shouldReduceAnimations } = usePerformance();

  // Initialize real data fetching
  useEffect(() => {
    const fetchRealData = async () => {
      setIsLoading(true);
      setDataLoaded(false);

      try {
        // For development, we use the local API proxy to avoid CORS issues
        // The proxy will fetch from the BlockEdge URL server-side

        // Fetch real projects data
        const projectsData = await co2eApi.getProjects();

        if (projectsData && projectsData.length > 0) {
          setProjects(projectsData);
          setImpactData(generateImpactData(projectsData.length));
          setDataLoaded(true);
          console.log(
            `✅ Projects page loaded ${projectsData.length} real projects`
          );
        } else {
          console.warn("⚠️ No projects data received");
        }
      } catch (error) {
        console.error("❌ Error fetching projects data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealData();
  }, []);

  // Memoized handler for viewing project details
  const handleViewProjectDetails = useCallback(async (project: any) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
    setNftMetadata(null);
    setLoadingNftMetadata(true);

    // Fetch NFT metadata if cert contract exists
    if (project.certContract) {
      try {
        console.log(`Fetching NFT metadata for cert: ${project.certContract}`);
        const metadata = await fetchNFTMetadata(project.certContract, "0");
        if (metadata) {
          console.log("NFT metadata received:", metadata);
          setNftMetadata(metadata);
        }
      } catch (error) {
        console.error("Error fetching NFT metadata:", error);
      } finally {
        setLoadingNftMetadata(false);
      }
    } else {
      setLoadingNftMetadata(false);
    }
  }, []);

  // Memoized filter functions
  const filterFunctions = useMemo(
    () => ({
      byType: (project: any, type: string) =>
        type === "all" ||
        project.type.toLowerCase().includes(type.toLowerCase()),
      byRegistry: (project: any, registry: string) => {
        if (registry === "all") return true;
        const projectRegistry = project.backing?.toLowerCase() || "";
        switch (registry) {
          case "verra":
            return (
              projectRegistry.includes("verra") ||
              project.compliance?.includes("VCS")
            );
          case "tuv-sud":
            return (
              projectRegistry.includes("tuv") || projectRegistry.includes("sud")
            );
          case "dnv":
            return projectRegistry.includes("dnv");
          case "irec":
            return (
              projectRegistry.includes("irec") ||
              project.compliance?.includes("GRI")
            );
          default:
            return true;
        }
      },
      bySearch: (project: any, search: string) =>
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.location.toLowerCase().includes(search.toLowerCase()),
    }),
    []
  );

  // Use debounced filtering
  const filteredProjects = useDebouncedFilter(
    projects,
    {
      type: selectedType,
      registry: selectedRegistry,
      search: searchQuery,
    },
    filterFunctions,
    300
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Global Carbon Projects
            </h1>
            <p className="text-slate-400 mt-2">
              Discover verified carbon credit projects worldwide
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Projects",
              value: isLoading ? "..." : projects.length.toString(),
              icon: Globe,
              color: "from-emerald-500 to-teal-600",
            },
            {
              title: "Active Tokens",
              value: isLoading
                ? "..."
                : (() => {
                    const totalCO2 = projects.reduce(
                      (sum, p) => sum + parseInt(p.totalSupply || "0"),
                      0
                    );
                    return totalCO2 > 1000000
                      ? `${(totalCO2 / 1000000).toFixed(2)}M tCO2e`
                      : totalCO2 > 1000
                      ? `${(totalCO2 / 1000).toFixed(2)}K tCO2e`
                      : `${totalCO2.toLocaleString()} tCO2e`;
                  })(),
              icon: Leaf,
              color: "from-teal-500 to-cyan-600",
            },
            {
              title: "CO2 Impact",
              value: isLoading
                ? "..."
                : (() => {
                    const totalCO2 = projects.reduce(
                      (sum, p) => sum + parseInt(p.co2Reduction?.total || "0"),
                      0
                    );
                    return totalCO2 > 1000000
                      ? `${(totalCO2 / 1000000).toFixed(2)}M tCO2e`
                      : totalCO2 > 1000
                      ? `${(totalCO2 / 1000).toFixed(2)}K tCO2e`
                      : `${totalCO2.toLocaleString()} tCO2e`;
                  })(),
              icon: TrendingUp,
              color: "from-cyan-500 to-sky-600",
            },
            {
              title: "Standards",
              value: isLoading
                ? "..."
                : new Set(projects.map((p) => p.methodology)).size.toString(),
              icon: Award,
              color: "from-sky-500 to-indigo-600",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                    >
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Impact Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Global Impact Trends
            </CardTitle>
            <CardDescription className="text-slate-400">
              Monthly CO2 reduction and project growth metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ChartContainer
                config={{
                  impact: {
                    label: "CO2 Impact (K tCO2e)",
                    color: "hsl(var(--chart-1))",
                  },
                  projects: {
                    label: "Active Projects",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                  <AreaChart
                    data={impactData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorImpact"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="impact"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorImpact)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-slate-800/50 backdrop-blur-md border-white/5 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  placeholder="Search projects by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-slate-900/80 border-slate-700 text-slate-300 focus:border-emerald-500"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-48 bg-slate-900/80 border-slate-700 text-slate-300">
                  <SelectValue placeholder="Project Type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-slate-300">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="renewable">Renewable Energy</SelectItem>
                  <SelectItem value="forest">Forest Conservation</SelectItem>
                  <SelectItem value="blue">Blue Carbon</SelectItem>
                  <SelectItem value="removal">Carbon Removal</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={selectedRegistry}
                onValueChange={setSelectedRegistry}
              >
                <SelectTrigger className="w-full sm:w-48 bg-slate-900/80 border-slate-700 text-slate-300">
                  <SelectValue placeholder="Registry" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-slate-300">
                  <SelectItem value="all">All Registries</SelectItem>
                  <SelectItem value="verra">Verra</SelectItem>
                  <SelectItem value="tuv-sud">TUV SUD</SelectItem>
                  <SelectItem value="dnv">DNV</SelectItem>
                  <SelectItem value="irec">I-REC</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-700/50"
              >
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
              <Button
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-700/50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card
                key={index}
                className="bg-slate-800/80 border-slate-700/50 h-96 animate-pulse"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-700 rounded"></div>
                      <div className="h-3 bg-slate-700 rounded w-5/6"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg">No projects found</div>
            <div className="text-slate-500 text-sm mt-2">
              {dataLoaded
                ? "All projects loaded successfully, but none match your filters."
                : "Unable to load projects data."}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-slate-800/80 border-slate-700/50 overflow-hidden hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white line-clamp-2">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="text-slate-400 mt-1">
                          {project.type}
                        </CardDescription>
                        <div className="flex items-center gap-1 mt-2">
                          <MapPin className="w-3 h-3 text-slate-300" />
                          <span className="text-sm text-slate-300">
                            {project.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                          {" "}
                          {(project.verified || project.verificationDate) && (
                            <Badge
                              variant="outline"
                              className="bg-blue-900/80 text-blue-400 border-blue-500/30 backdrop-blur-sm"
                            >
                              <Award className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Tokens</span>
                        <p className="font-semibold text-white">
                          {project.totalSupply
                            ? (() => {
                                const co2Value = parseInt(project.totalSupply);
                                return co2Value > 1000000
                                  ? `${(co2Value / 1000000).toFixed(1)}M Tokens`
                                  : co2Value > 1000
                                  ? `${(co2Value / 1000).toFixed(0)}K Tokens`
                                  : `${co2Value.toLocaleString()} Tokens`;
                              })()
                            : project.tokens || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">Impact</span>
                        <p className="font-semibold text-white">
                          {project.co2Reduction?.total
                            ? (() => {
                                const co2Value = parseInt(
                                  project.co2Reduction.total
                                );
                                return co2Value > 1000000
                                  ? `${(co2Value / 1000000).toFixed(1)}M tCO2e`
                                  : co2Value > 1000
                                  ? `${(co2Value / 1000).toFixed(0)}K tCO2e`
                                  : `${co2Value.toLocaleString()} tCO2e`;
                              })()
                            : project.impact || "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500">Registry</span>
                        <p className="font-semibold text-white">
                          {project.registry || project.liquidity || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-slate-500">
                        Standards & Methodology
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.methodology && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-slate-700/50 text-slate-300 border-slate-600"
                          >
                            {project.methodology}
                          </Badge>
                        )}
                        {project.certificationBody && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-slate-700/50 text-slate-300 border-slate-600"
                          >
                            {project.certificationBody}
                          </Badge>
                        )}
                        {!project.methodology &&
                          !project.certificationBody &&
                          project.compliance &&
                          project.compliance.map((badge: string) => (
                            <Badge
                              key={badge}
                              variant="outline"
                              className="text-xs bg-slate-700/50 text-slate-300 border-slate-600"
                            >
                              {badge}
                            </Badge>
                          ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-sm text-slate-500">
                        Project Developer
                      </span>
                      <p className="text-sm font-medium mt-1 text-slate-300 line-clamp-1">
                        {project.projectDeveloper ||
                          project.backing ||
                          "Various Institutions"}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                        onClick={() => handleViewProjectDetails(project)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Load More */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex justify-center"
      >
        <Button
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-700/50"
        >
          Load More Projects
        </Button>
      </motion.div>

      {/* Project Details Modal */}
      {showProjectDetails && selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-700 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {nftMetadata?.metadata?.name || selectedProject.name}
                </h2>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className="text-slate-300 border-slate-600"
                  >
                    {nftMetadata?.metadata?.attributes?.find(
                      (attr: any) => attr.trait_type === "Credit category"
                    )?.value || selectedProject.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-slate-300 border-slate-600"
                  >
                    {nftMetadata?.token?.type || "ERC-721"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-slate-300 border-slate-600"
                  >
                    {selectedProject.verified ? "Verified" : "Pending"}
                  </Badge>
                </div>
                <p className="text-slate-400">
                  {nftMetadata?.metadata?.description ? (
                    <span className="line-clamp-2">
                      {nftMetadata.metadata.description}
                    </span>
                  ) : (
                    <>
                      Carbon credit project focusing on{" "}
                      {selectedProject.type.toLowerCase()} initiatives in{" "}
                      {selectedProject.location}.
                    </>
                  )}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowProjectDetails(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* NFT Image if available */}
              {(nftMetadata?.metadata?.image || nftMetadata?.image_url) && (
                <div className="flex justify-center mb-6">
                  <img
                    src={nftMetadata.metadata?.image || nftMetadata.image_url}
                    alt={nftMetadata?.metadata?.name || selectedProject.name}
                    className="rounded-lg shadow-lg max-h-64 object-contain bg-slate-800 p-2"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
              {/* Project Location */}
              <div className="flex items-center gap-2 p-4 bg-slate-700/50 rounded-lg">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">
                  {selectedProject.location}
                  {console.log(selectedProject)}
                </span>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400">Current Supply</div>
                  <div className="text-xl font-bold text-white">
                    {loadingNftMetadata ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      <>{selectedProject.totalSupply || "N/A"} Tokens</>
                    )}
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400">CO2 Impact</div>
                  <div className="text-xl font-bold text-emerald-400">
                    {/* Always use project data for CO2 Impact, not the Amount from NFT */}
                    {selectedProject.co2Reduction.total}{" "}
                    {selectedProject.co2Reduction.unit}
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400">Vintage Year</div>
                  <div className="text-xl font-bold text-white">
                    {loadingNftMetadata ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      <>
                        {nftMetadata?.metadata?.attributes?.find(
                          (attr: any) => attr.trait_type === "Vintage"
                        )?.value ||
                          selectedProject.vintage ||
                          "2024"}
                      </>
                    )}
                  </div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="text-sm text-slate-400">Methodology</div>
                  <div className="text-xl font-bold text-white">
                    {loadingNftMetadata ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      <>
                        {nftMetadata?.metadata?.attributes?.find(
                          (attr: any) => attr.trait_type === "Methodology"
                        )?.value ||
                          selectedProject.methodology ||
                          "N/A"}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Project Information
                  </h3>
                  <div className="space-y-3">
                    {loadingNftMetadata ? (
                      <div className="animate-pulse space-y-3">
                        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                        <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                        <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                      </div>
                    ) : (
                      <>
                        {nftMetadata?.metadata?.attributes ? (
                          <>
                            {/* Display all NFT attributes except Amount */}
                            {nftMetadata.metadata.attributes
                              .filter(
                                (attr: any) => attr.trait_type !== "Amount"
                              )
                              .map((attr: any, index: number) => (
                                <div key={index}>
                                  <span className="text-sm text-slate-400">
                                    {attr.trait_type}
                                  </span>
                                  <p className="text-white">{attr.value}</p>
                                </div>
                              ))}
                          </>
                        ) : (
                          <>
                            <div>
                              <span className="text-sm text-slate-400">
                                Project Type
                              </span>
                              <p className="text-white">
                                {selectedProject.type}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-slate-400">
                                Location
                              </span>
                              <p className="text-white">
                                {selectedProject.location}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-slate-400">
                                Project ID
                              </span>
                              <p className="text-white">
                                #{selectedProject.id}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-slate-400">
                                Registry
                              </span>
                              <p className="text-white">
                                {selectedProject.registry ||
                                  "Verified Registry"}
                              </p>
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    Blockchain Contracts
                  </h3>
                  <div className="space-y-3">
                    {/* Token Contract */}
                    <div className="bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-700/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-emerald-400">
                          🪙 Token Contract
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-emerald-900/50 text-emerald-300 border-emerald-500/30 text-xs"
                        >
                          ERC-20
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-slate-800/80 px-2 py-1 rounded text-emerald-300 font-mono flex-1 border border-emerald-700/30">
                          {selectedProject.tokenAddress || "0x..."}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              selectedProject.tokenAddress || ""
                            );
                            alert(
                              "Token contract address copied to clipboard!"
                            );
                          }}
                          className="h-7 w-7 p-0 border-emerald-600/50 hover:bg-emerald-800/30"
                        >
                          <Copy className="w-3 h-3 text-emerald-400" />
                        </Button>
                      </div>
                    </div>

                    {/* Certificate Contract */}
                    <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-700/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-400">
                          📜 Certificate Contract
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-blue-900/50 text-blue-300 border-blue-500/30 text-xs"
                        >
                          ERC-721
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-slate-800/80 px-2 py-1 rounded text-blue-300 font-mono flex-1 border border-blue-700/30">
                          {selectedProject.certContract ||
                            "No cert contract found"}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              selectedProject.certContract || ""
                            );
                            alert(
                              "Certificate contract address copied to clipboard!"
                            );
                          }}
                          className="h-7 w-7 p-0 border-blue-600/50 hover:bg-blue-800/30"
                        >
                          <Copy className="w-3 h-3 text-blue-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Compliance Standards
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(selectedProject.compliance || []).map(
                    (standard: string) => (
                      <Badge
                        key={standard}
                        variant="outline"
                        className="bg-slate-700/50 text-slate-300 border-slate-600"
                      >
                        {standard}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  onClick={() => viewTokenOnBlockchain(selectedProject)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Blockchain
                </Button>
                {nftMetadata?.metadata?.url && (
                  <Button
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-700/50"
                    onClick={() =>
                      window.open(nftMetadata.metadata.url, "_blank")
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Registry
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-700/50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
