// Configuration for the CO2e Chain Dashboard

export interface AppConfig {
  // R2 Data Sources
  r2: {
    projectsDataUrl?: string;
    fallbackToSample: boolean;
    useLocalProxy?: boolean; // Use local API proxy to avoid CORS
  };

  // API Configuration
  api: {
    co2eChainBaseUrl: string;
    requestTimeout: number;
    retryAttempts: number;
  };

  // Cache Settings
  cache: {
    projectsCacheDuration: number; // in milliseconds
    statsCacheDuration: number;
  };

  // Dashboard Settings
  dashboard: {
    refreshInterval: number; // auto-refresh interval in milliseconds
    itemsPerPage: number;
    defaultProjectType: string;
  };
}

export const defaultConfig: AppConfig = {
  r2: {
    projectsDataUrl: undefined, // Will be set when provided
    fallbackToSample: false, // Disabled for production - must use real data
    useLocalProxy: true, // Use local API proxy to avoid CORS issues in development
  },
  api: {
    co2eChainBaseUrl: "https://exp.co2e.cc/api/v2",
    requestTimeout: 10000, // 10 seconds
    retryAttempts: 3,
  },
  cache: {
    projectsCacheDuration: 5 * 60 * 1000, // 5 minutes
    statsCacheDuration: 2 * 60 * 1000, // 2 minutes
  },
  dashboard: {
    refreshInterval: 30 * 1000, // 30 seconds
    itemsPerPage: 12,
    defaultProjectType: "all",
  },
};

class ConfigManager {
  private config: AppConfig = { ...defaultConfig };

  // Get current configuration
  getConfig(): AppConfig {
    return { ...this.config };
  }

  // Update R2 projects data URL
  setProjectsDataUrl(url: string): void {
    this.config.r2.projectsDataUrl = url;
    console.log("Projects data URL updated:", url);
  }

  // Update specific configuration sections
  updateConfig(updates: Partial<AppConfig>): void {
    this.config = {
      ...this.config,
      ...updates,
      r2: { ...this.config.r2, ...updates.r2 },
      api: { ...this.config.api, ...updates.api },
      cache: { ...this.config.cache, ...updates.cache },
      dashboard: { ...this.config.dashboard, ...updates.dashboard },
    };
  }

  // Check if R2 data source is configured
  isR2Configured(): boolean {
    return !!this.config.r2.projectsDataUrl;
  }

  // Get environment-specific config
  getEnvConfig(): Partial<AppConfig> {
    const envConfig: Partial<AppConfig> = {};

    // Check for environment variables
    if (process.env.NEXT_PUBLIC_PROJECTS_DATA_URL) {
      envConfig.r2 = {
        projectsDataUrl: process.env.NEXT_PUBLIC_PROJECTS_DATA_URL,
        fallbackToSample: this.config.r2.fallbackToSample,
      };
    }

    if (process.env.NEXT_PUBLIC_API_BASE_URL) {
      envConfig.api = {
        ...this.config.api,
        co2eChainBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      };
    }

    return envConfig;
  }

  // Initialize configuration with environment variables
  initializeConfig(): void {
    const envConfig = this.getEnvConfig();
    if (Object.keys(envConfig).length > 0) {
      this.updateConfig(envConfig);
      console.log("Configuration initialized with environment variables");
    }
  }
}

// Export singleton instance
export const configManager = new ConfigManager();

// Initialize on module load
configManager.initializeConfig();

// Export utility functions
export const setProjectsDataUrl = (url: string) =>
  configManager.setProjectsDataUrl(url);
export const getConfig = () => configManager.getConfig();
export const isR2Configured = () => configManager.isR2Configured();
