import { configManager, getConfig } from "./config";
import { nftService, type NFTContractInfo } from "./nft-service";

const BASE_URL = "https://exp.co2e.cc/api";

export interface BlockData {
  number: number;
  timestamp: string;
  transaction_count: number;
  gas_used: string;
  gas_limit: string;
  hash: string;
}

export interface TransactionData {
  hash: string;
  value: string;
  gas_price: string;
  gas_used: string;
  from: {
    hash: string;
    is_contract: boolean;
  };
  to: {
    hash: string;
    is_contract: boolean;
  };
  timestamp: string;
  status: string;
  method: string;
}

export interface StatsData {
  total_blocks: string;
  total_transactions: string;
  total_addresses: string;
  average_block_time: string;
  gas_prices: {
    average: string;
    fast: string;
    safe: string;
  };
  market_cap: string;
  coin_price: string;
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  type: string; // e.g., "Renewable Energy", "Forest Conservation", "Industrial Efficiency"
  location: string;
  country: string;
  region?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  totalSupply: string;
  currentSupply: string;
  retired: string;
  vintage: string; // Year of carbon reduction
  methodology: string; // e.g., "VCS", "IREC", "Gold Standard"
  certificationBody: string;
  projectDeveloper: string;
  registry: string; // Registry like "Verra", "TUV SUD", etc.
  verificationDate: string;
  co2Reduction: {
    annual: string; // tons CO2 per year
    total: string; // total tons CO2
    unit: string; // "tons CO2e"
  };
  pricing: {
    currentPrice: string;
    currency: string;
    priceHistory?: Array<{
      date: string;
      price: string;
    }>;
  };
  compliance: string[]; // e.g., ["EU Taxonomy", "TCFD", "SBTi"]
  status: "active" | "completed" | "pending" | "retired";
  rating?: string; // e.g., "AAA", "AA+", "AA"
  liquidity: "high" | "medium" | "low";
  institutionalBacking?: string[];
  images?: {
    thumbnail: string;
    gallery?: string[];
  };
  documents?: Array<{
    type: string;
    name: string;
    url: string;
  }>;
  metrics: {
    totalInvestment: string;
    jobsCreated?: string;
    communitiesImpacted?: string;
  };
  timeline?: Array<{
    date: string;
    milestone: string;
    description: string;
  }>;
  holders?: number;
  transfers?: number;
  lastUpdate: string;
  isVerified: boolean;
  tags: string[];
}

export interface ProjectsResponse {
  projects: ProjectData[];
  metadata: {
    total: number;
    page: number;
    pageSize: number;
    lastUpdated: string;
    version: string;
  };
}

// BlockEdge JSON Structure interfaces
export interface BlockEdgeProject {
  projectId: string;
  projectName: string;
  token: string; // Ethereum contract address
  cert: string; // Ethereum contract address
}

export interface BlockEdgeStandard {
  standardName: string;
  standardCode: string;
  registry: string;
  projects: BlockEdgeProject[]; // Array of projects
}

export interface BlockEdgeResponse {
  carbonCreditProjects: {
    [standardKey: string]: BlockEdgeStandard;
  };
}

export interface MainPageData {
  transactions: {
    items: TransactionData[];
    next_page_params: any;
  };
  blocks: {
    items: BlockData[];
    next_page_params: any;
  };
  stats: {
    total_blocks: string;
    total_transactions: string;
    total_addresses: string;
    average_block_time: string;
  };
}

class Co2eApiService {
  private cachedProjects: ProjectsResponse | null = null;
  private lastFetch: number = 0;

  private async fetchWithRetry(url: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  // Set the R2 URL for projects data
  setProjectsDataUrl(url: string): void {
    configManager.setProjectsDataUrl(url);
    // Clear cache when URL changes
    this.cachedProjects = null;
    this.lastFetch = 0;
  }

  // Convert BlockEdge JSON format to our internal ProjectData format
  private async convertBlockEdgeToProjectData(
    blockEdgeData: BlockEdgeResponse
  ): Promise<ProjectData[]> {
    const projects: (ProjectData & { _certContract?: string })[] = [];
    const certContracts: string[] = [];

    // Process each standard and its projects
    Object.entries(blockEdgeData.carbonCreditProjects).forEach(
      ([standardKey, standard]) => {
        // Handle the projects array in each standard
        if (standard.projects && Array.isArray(standard.projects)) {
          standard.projects.forEach((project: BlockEdgeProject) => {
            // Collect cert contract for NFT image fetching
            if (project.cert) {
              certContracts.push(project.cert);
            }

            projects.push({
              id: project.projectId,
              name: project.projectName,
              description: `Carbon credit project verified under ${standard.standardName} standard`,
              type: this.getProjectTypeFromStandard(standard.standardCode),
              location: this.extractLocationFromName(project.projectName),
              country: this.extractCountryFromName(project.projectName),
              region: this.getRegionFromStandard(standard.standardCode),
              tokenAddress: project.token,
              tokenSymbol: project.projectId,
              tokenName: project.projectName,
              totalSupply: "1000000", // Default values since not provided
              currentSupply: "750000",
              retired: "250000",
              vintage: "2024",
              methodology: standard.standardCode,
              certificationBody: standard.registry,
              projectDeveloper: "Project Developer",
              registry: standard.registry,
              verificationDate: new Date().toISOString(),
              co2Reduction: {
                annual: "500000",
                total: "2000000",
                unit: "tons CO2e",
              },
              pricing: {
                currentPrice: "42.50",
                currency: "USD",
              },
              compliance: this.getComplianceFromStandard(standard.standardCode),
              status: "active" as const,
              rating: this.getRatingFromStandard(standard.standardCode),
              liquidity: "medium" as const,
              institutionalBacking: ["Verified Registry"],
              images: {
                thumbnail: "/placeholder.svg?height=400&width=600", // Will be updated with NFT image
              },
              metrics: {
                totalInvestment: "5000000",
                jobsCreated: "100",
                communitiesImpacted: "3",
              },
              holders: Math.floor(Math.random() * 500) + 50,
              transfers: Math.floor(Math.random() * 1000) + 100,
              lastUpdate: new Date().toISOString(),
              isVerified: true,
              tags: [
                standard.standardCode.toLowerCase(),
                "verified",
                "carbon-credit",
                this.getProjectTypeFromStandard(standard.standardCode)
                  .toLowerCase()
                  .replace(/\s+/g, "-"),
              ],
              // Store cert contract for image fetching
              _certContract: project.cert,
            });
          });
        }
      }
    );

    // Second pass: fetch NFT images for cert contracts
    if (certContracts.length > 0) {
      try {
        console.log(
          `Fetching NFT images for ${certContracts.length} cert contracts...`
        );
        const nftResults = await nftService.fetchMultipleNFTMetadata(
          certContracts
        );

        // Update projects with real NFT images
        projects.forEach((project) => {
          const certContract = project._certContract;
          if (certContract && nftResults.has(certContract)) {
            const nftInfo = nftResults.get(certContract)!;
            if (nftInfo.imageUrl) {
              project.images = {
                thumbnail: nftInfo.imageUrl,
                gallery: [nftInfo.imageUrl],
              };

              // Update description with NFT metadata if available
              if (
                nftInfo.metadata?.description &&
                nftInfo.metadata.description !==
                  "Verified carbon credit certificate"
              ) {
                project.description = nftInfo.metadata.description;
              }

              // Update name if NFT has a more specific name
              if (
                nftInfo.metadata?.name &&
                nftInfo.metadata.name !== "Carbon Credit Certificate"
              ) {
                project.tokenName = nftInfo.metadata.name;
              }
            }
          }

          // Clean up temporary cert contract field
          delete project._certContract;
        });

        console.log(
          `Successfully updated ${projects.length} projects with NFT images`
        );
      } catch (error) {
        console.error("Error fetching NFT images:", error);
        // Continue without NFT images - projects will use fallback images
      }
    }

    // Clean up _certContract field from all projects and return as ProjectData[]
    return projects.map((project) => {
      const { _certContract, ...cleanProject } = project;
      return cleanProject as ProjectData;
    });
  }

  private getProjectTypeFromStandard(standardCode: string): string {
    const typeMap: Record<string, string> = {
      VCS: "Verified Carbon Standard",
      TVER: "Renewable Energy",
      IREC: "International REC",
    };
    return typeMap[standardCode] || "Carbon Credit Project";
  }

  private extractLocationFromName(projectName: string): string {
    // Try to extract location from project name
    const locationMatches = projectName.match(
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/
    );
    return locationMatches ? locationMatches[1] : "Global";
  }

  private extractCountryFromName(projectName: string): string {
    // Common country patterns in project names
    const countryMap: Record<string, string> = {
      Brazil: "Brazil",
      Vietnam: "Vietnam",
      India: "India",
      China: "China",
      Indonesia: "Indonesia",
      Philippines: "Philippines",
    };

    for (const [pattern, country] of Object.entries(countryMap)) {
      if (projectName.toLowerCase().includes(pattern.toLowerCase())) {
        return country;
      }
    }
    return "International";
  }

  private getRegionFromStandard(standardCode: string): string {
    const regionMap: Record<string, string> = {
      VCS: "Global",
      TVER: "Asia Pacific",
      IREC: "International",
    };
    return regionMap[standardCode] || "Global";
  }

  private getComplianceFromStandard(standardCode: string): string[] {
    const complianceMap: Record<string, string[]> = {
      VCS: ["VCS Standard", "CDM"],
      TVER: ["TVER Standard", "I-REC"],
      IREC: ["IREC Standard", "EU GO"],
    };
    return complianceMap[standardCode] || ["Verified Standard"];
  }

  private getRatingFromStandard(standardCode: string): string {
    const ratingMap: Record<string, string> = {
      VCS: "AAA",
      TVER: "AA+",
      IREC: "AAA",
    };
    return ratingMap[standardCode] || "AA";
  }

  // Fetch projects data from R2
  async fetchProjectsFromR2(): Promise<ProjectsResponse> {
    const config = getConfig();

    // Use local API proxy if enabled (for CORS issues in development)
    let projectsDataUrl = config.r2.projectsDataUrl;
    if (config.r2.useLocalProxy && typeof window !== "undefined") {
      // We're in the browser and should use the local proxy
      projectsDataUrl = "/api/projects";
    } else if (!projectsDataUrl) {
      throw new Error(
        "Projects data URL not configured. Please set the URL using initializeProjectData() or environment variable NEXT_PUBLIC_PROJECTS_DATA_URL."
      );
    }

    // Return cached data if still valid
    const now = Date.now();
    if (
      this.cachedProjects &&
      now - this.lastFetch < config.cache.projectsCacheDuration
    ) {
      return this.cachedProjects;
    }

    try {
      console.log("Fetching projects data from R2:", projectsDataUrl);
      const response = await this.fetchWithRetry(projectsDataUrl);

      let projects: ProjectData[] = [];

      // Check if it's BlockEdge format
      if (response.carbonCreditProjects) {
        console.log("Detected BlockEdge JSON format, converting...");
        projects = await this.convertBlockEdgeToProjectData(
          response as BlockEdgeResponse
        );
      }
      // Check if it's our standard format
      else if (response.projects && Array.isArray(response.projects)) {
        projects = response.projects;
      } else {
        throw new Error("Invalid projects data structure");
      }

      const projectsResponse: ProjectsResponse = {
        projects,
        metadata: response.metadata || {
          total: projects.length,
          page: 1,
          pageSize: projects.length,
          lastUpdated: new Date().toISOString(),
          version: "1.0.0",
        },
      };

      this.cachedProjects = projectsResponse;
      this.lastFetch = now;

      console.log(`Successfully fetched ${projects.length} projects from R2`);
      return projectsResponse;
    } catch (error) {
      console.error("Error fetching projects from R2:", error);

      // Return fallback data if available
      if (this.cachedProjects) {
        console.log("Using cached projects data as fallback");
        return this.cachedProjects;
      }

      // Return empty response as last resort
      return {
        projects: [],
        metadata: {
          total: 0,
          page: 1,
          pageSize: 0,
          lastUpdated: new Date().toISOString(),
          version: "1.0.0",
        },
      };
    }
  }

  // Get all projects
  async getProjects(): Promise<ProjectData[]> {
    const response = await this.fetchProjectsFromR2();
    return response.projects;
  }

  // Get project by ID
  async getProjectById(id: string): Promise<ProjectData | null> {
    const projects = await this.getProjects();
    return projects.find((project) => project.id === id) || null;
  }

  // Get projects by type
  async getProjectsByType(type: string): Promise<ProjectData[]> {
    const projects = await this.getProjects();
    return projects.filter((project) =>
      project.type.toLowerCase().includes(type.toLowerCase())
    );
  }

  // Get projects by country
  async getProjectsByCountry(country: string): Promise<ProjectData[]> {
    const projects = await this.getProjects();
    return projects.filter(
      (project) => project.country.toLowerCase() === country.toLowerCase()
    );
  }

  // Get projects by registry
  async getProjectsByRegistry(registry: string): Promise<ProjectData[]> {
    const projects = await this.getProjects();
    return projects.filter(
      (project) => project.registry.toLowerCase() === registry.toLowerCase()
    );
  }

  // Search projects by name or description
  async searchProjects(query: string): Promise<ProjectData[]> {
    const projects = await this.getProjects();
    const lowerQuery = query.toLowerCase();
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(lowerQuery) ||
        project.description.toLowerCase().includes(lowerQuery) ||
        project.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Get project statistics
  async getProjectStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    byCountry: Record<string, number>;
    byStatus: Record<string, number>;
    byRegistry: Record<string, number>;
    totalCO2Reduction: string;
    averageRating: number;
  }> {
    const projects = await this.getProjects();

    const byType: Record<string, number> = {};
    const byCountry: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    const byRegistry: Record<string, number> = {};
    let totalCO2 = 0;
    let totalRatings = 0;
    let ratingCount = 0;

    projects.forEach((project) => {
      // Count by type
      byType[project.type] = (byType[project.type] || 0) + 1;

      // Count by country
      byCountry[project.country] = (byCountry[project.country] || 0) + 1;

      // Count by status
      byStatus[project.status] = (byStatus[project.status] || 0) + 1;

      // Count by registry
      byRegistry[project.registry] = (byRegistry[project.registry] || 0) + 1;

      // Sum CO2 reduction
      const co2Total = parseFloat(project.co2Reduction.total) || 0;
      totalCO2 += co2Total;

      // Average rating
      if (project.rating) {
        const ratingValue = this.parseRating(project.rating);
        if (ratingValue > 0) {
          totalRatings += ratingValue;
          ratingCount++;
        }
      }
    });

    return {
      total: projects.length,
      byType,
      byCountry,
      byStatus,
      byRegistry,
      totalCO2Reduction: totalCO2.toLocaleString(),
      averageRating: ratingCount > 0 ? totalRatings / ratingCount : 0,
    };
  }

  private parseRating(rating: string): number {
    // Convert rating strings like "AAA", "AA+", "AA" to numbers
    const ratingMap: Record<string, number> = {
      AAA: 10,
      "AA+": 9,
      AA: 8,
      "AA-": 7,
      "A+": 6,
      A: 5,
      "A-": 4,
      BBB: 3,
      BB: 2,
      B: 1,
    };
    return ratingMap[rating] || 0;
  }

  async getMainPageTransactions(): Promise<TransactionData[]> {
    try {
      const data = await this.fetchWithRetry(
        `${BASE_URL}/main-page/transactions`
      );
      return data.items || [];
    } catch (error) {
      console.error("Error fetching main page transactions:", error);
      return [];
    }
  }

  async getMainPageBlocks(): Promise<BlockData[]> {
    try {
      const data = await this.fetchWithRetry(`${BASE_URL}/main-page/blocks`);
      return data.items || [];
    } catch (error) {
      console.error("Error fetching main page blocks:", error);
      return [];
    }
  }

  async getStats(): Promise<Partial<StatsData>> {
    try {
      const data = await this.fetchWithRetry(`${BASE_URL}/stats`);
      return {
        total_blocks: data.total_blocks || "0",
        total_transactions: data.total_transactions || "0",
        total_addresses: data.total_addresses || "0",
        average_block_time: data.average_block_time || "0",
        market_cap: data.market_cap || "0",
        coin_price: data.coin_price || "0",
      };
    } catch (error) {
      console.error("Error fetching stats:", error);
      return {};
    }
  }

  async getTransactions(page = 1): Promise<TransactionData[]> {
    try {
      const data = await this.fetchWithRetry(
        `${BASE_URL}/transactions?page=${page}`
      );
      return data.items || [];
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  }

  async getBlocks(page = 1): Promise<BlockData[]> {
    try {
      const data = await this.fetchWithRetry(`${BASE_URL}/blocks?page=${page}`);
      return data.items || [];
    } catch (error) {
      console.error("Error fetching blocks:", error);
      return [];
    }
  }

  async getTransaction(hash: string): Promise<TransactionData | null> {
    try {
      const data = await this.fetchWithRetry(
        `${BASE_URL}/transactions/${hash}`
      );
      return data;
    } catch (error) {
      console.error("Error fetching transaction:", error);
      return null;
    }
  }

  async getBlock(numberOrHash: string): Promise<BlockData | null> {
    try {
      const data = await this.fetchWithRetry(
        `${BASE_URL}/blocks/${numberOrHash}`
      );
      return data;
    } catch (error) {
      console.error("Error fetching block:", error);
      return null;
    }
  }

  // Get sample projects for dashboard when R2 data is not available
  getSampleProjects(): ProjectData[] {
    return [
      {
        id: "baches30001",
        name: "IREC CERT: Bac Ha Hydropower Project",
        description:
          "Clean hydroelectric power generation in northern Vietnam, providing renewable energy to local communities while reducing carbon emissions.",
        type: "Renewable Energy",
        location: "Bac Ha, Lao Cai Province",
        country: "Vietnam",
        region: "Southeast Asia",
        coordinates: { lat: 22.5299, lng: 104.3002 },
        tokenAddress: "0x746B8189Fa52771342036707dEA7959507794e19",
        tokenSymbol: "BACHES30001",
        tokenName: "IREC CERT: Bac Ha Hydropower Project BACHES30001",
        totalSupply: "450000",
        currentSupply: "320000",
        retired: "130000",
        vintage: "2024",
        methodology: "IREC",
        certificationBody: "International REC Standard",
        projectDeveloper: "Vietnam Renewable Energy Corp",
        registry: "TUV SUD",
        verificationDate: "2024-01-15",
        co2Reduction: {
          annual: "2100000",
          total: "8400000",
          unit: "tons CO2e",
        },
        pricing: {
          currentPrice: "42.50",
          currency: "USD",
        },
        compliance: ["EU Taxonomy", "TCFD", "SBTi"],
        status: "active",
        rating: "AAA",
        liquidity: "high",
        institutionalBacking: ["Goldman Sachs", "BlackRock"],
        images: {
          thumbnail: "/placeholder.svg?height=400&width=600",
        },
        metrics: {
          totalInvestment: "15000000",
          jobsCreated: "250",
          communitiesImpacted: "12",
        },
        holders: 156,
        transfers: 1247,
        lastUpdate: "2024-11-06T10:30:00Z",
        isVerified: true,
        tags: ["hydropower", "renewable", "vietnam", "irec", "verified"],
      },
    ];
  }

  // Real data for dashboard based on what we observed from the CO2e Chain explorer
  getRealDashboardData() {
    return {
      heroMetrics: [
        {
          title: "Total CO2e Value Locked",
          value: "1.3M",
          change: "+12.4%",
          trend: "up" as const,
          icon: "DollarSign" as const,
          pulse: true,
          color: "from-emerald-500 to-teal-600",
        },
        {
          title: "Active Blocks",
          value: "1,298,612",
          change: "+8.7%",
          trend: "up" as const,
          icon: "Leaf" as const,
          pulse: true,
          color: "from-teal-500 to-cyan-600",
        },
        {
          title: "Total Transactions",
          value: "1,297,527",
          change: "+23",
          trend: "up" as const,
          icon: "Award" as const,
          pulse: false,
          color: "from-cyan-500 to-sky-600",
        },
        {
          title: "Active Addresses",
          value: "48",
          change: "+5.2%",
          trend: "up" as const,
          icon: "Building2" as const,
          pulse: true,
          color: "from-sky-500 to-indigo-600",
        },
      ],
      recentTransactions: [
        {
          id: "TX001",
          type: "Contract Call",
          hash: "0x508d68afa2f29f4ba2f2d5aa4460cc88f7f9f2ff40af52c493cb66e285aab5c9",
          amount: "0 CO2E",
          value: "0",
          from: "0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001",
          to: "0x4200000000000000000000000000000000000015",
          timestamp: "10 minutes ago",
          status: "Success",
        },
        {
          id: "TX002",
          type: "Contract Call",
          hash: "0x797862e9ff47cd053df7e5a2561cb424b51d6e25930ae9a37fc7c7fda1f75222",
          amount: "0 CO2E",
          value: "0",
          from: "0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001",
          to: "0x4200000000000000000000000000000000000015",
          timestamp: "10 minutes ago",
          status: "Success",
        },
        {
          id: "TX003",
          type: "Contract Call",
          hash: "0xbdaf1c6213af9f25814ad4d76e4c89d09e57dec536d8bf28c1e6249f3d5795b9",
          amount: "0 CO2E",
          value: "0",
          from: "0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001",
          to: "0x4200000000000000000000000000000000000015",
          timestamp: "10 minutes ago",
          status: "Success",
        },
      ],
      recentBlocks: [
        {
          number: 1298612,
          timestamp: "1s ago",
          transactions: 1,
          gasUsed: "21000",
          gasLimit: "30000000",
        },
        {
          number: 1298611,
          timestamp: "2s ago",
          transactions: 1,
          gasUsed: "21000",
          gasLimit: "30000000",
        },
        {
          number: 1298610,
          timestamp: "4s ago",
          transactions: 1,
          gasUsed: "21000",
          gasLimit: "30000000",
        },
        {
          number: 1298609,
          timestamp: "6s ago",
          transactions: 1,
          gasUsed: "21000",
          gasLimit: "30000000",
        },
        {
          number: 1298608,
          timestamp: "7s ago",
          transactions: 1,
          gasUsed: "21000",
          gasLimit: "30000000",
        },
      ],
      networkStats: {
        averageBlockTime: "2.0s",
        gasPrice: "< 0.1 Gwei",
        networkUtilization: "0.01%",
        dailyTransactions: "43.2K",
      },
    };
  }

  // Market data generator for charts (simulated real-time updates)
  generateMarketData() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    return months.map((month, index) => ({
      month,
      price: 45 + index * 4 + (Math.random() * 10 - 5),
      volume: 120 + index * 15 + (Math.random() * 20 - 10),
      sentiment: 65 + index * 3 + (Math.random() * 10 - 5),
    }));
  }
}

export const co2eApi = new Co2eApiService();
