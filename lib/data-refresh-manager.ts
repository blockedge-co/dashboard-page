// Advanced data refresh and update management system
// Handles real-time updates, background refresh, and intelligent caching

import type { ProjectData } from "./co2e-api";
import type { GrafanaDataset } from "./grafana-data-manager";
import { grafanaDataManager } from "./grafana-data-manager";
import { dataAggregationEngine } from "./data-aggregation-engine";
import { co2eApi } from "./co2e-api";

export interface RefreshConfig {
  interval: number;          // Refresh interval in milliseconds
  maxRetries: number;        // Maximum retry attempts
  retryDelay: number;        // Delay between retries
  backgroundRefresh: boolean; // Enable background refresh
  priority: 'high' | 'medium' | 'low';
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: RefreshProgress) => void;
}

export interface RefreshProgress {
  stage: string;
  progress: number; // 0-100
  message: string;
  startTime: number;
  elapsedTime: number;
  estimatedRemaining: number;
}

export interface RefreshResult {
  success: boolean;
  data?: any;
  error?: Error;
  metrics: {
    duration: number;
    dataSize: number;
    cacheHit: boolean;
    retryCount: number;
  };
  timestamp: string;
}

export interface DataSource {
  name: string;
  type: 'api' | 'cache' | 'mock';
  url?: string;
  refreshRate: number;
  priority: number;
  enabled: boolean;
  lastRefresh?: string;
  lastError?: string;
  consecutiveErrors: number;
}

export interface RefreshStrategy {
  name: string;
  description: string;
  condition: (context: RefreshContext) => boolean;
  execute: (context: RefreshContext) => Promise<RefreshResult>;
}

export interface RefreshContext {
  dataSources: DataSource[];
  lastRefresh: Date | null;
  errorRate: number;
  networkCondition: 'fast' | 'slow' | 'offline';
  userActive: boolean;
  criticalData: boolean;
}

export class DataRefreshManager {
  private static instance: DataRefreshManager;
  private refreshIntervals: Map<string, NodeJS.Timeout> = new Map();
  private refreshQueue: Array<{ id: string; config: RefreshConfig; priority: number }> = [];
  private activeRefreshes: Map<string, RefreshProgress> = new Map();
  private refreshHistory: RefreshResult[] = [];
  private dataSources: Map<string, DataSource> = new Map();
  private refreshStrategies: Map<string, RefreshStrategy> = new Map();
  
  // Configuration
  private readonly CONFIG = {
    MAX_CONCURRENT_REFRESHES: 3,
    REFRESH_HISTORY_LIMIT: 100,
    DEFAULT_RETRY_DELAY: 2000,
    DEFAULT_MAX_RETRIES: 3,
    BACKGROUND_INTERVAL: 60000, // 1 minute
    FAST_REFRESH_INTERVAL: 30000, // 30 seconds
    SLOW_REFRESH_INTERVAL: 300000, // 5 minutes
    ERROR_THRESHOLD: 0.1, // 10% error rate threshold
    OFFLINE_DETECTION_TIMEOUT: 5000,
  };

  // Refresh strategies
  private readonly STRATEGIES = {
    IMMEDIATE: 'immediate',
    BACKGROUND: 'background',
    LAZY: 'lazy',
    ADAPTIVE: 'adaptive',
    PRIORITY_BASED: 'priority_based'
  } as const;

  private constructor() {
    this.initializeDataSources();
    this.initializeRefreshStrategies();
    this.setupNetworkMonitoring();
  }

  static getInstance(): DataRefreshManager {
    if (!DataRefreshManager.instance) {
      DataRefreshManager.instance = new DataRefreshManager();
    }
    return DataRefreshManager.instance;
  }

  /**
   * Start comprehensive data refresh system
   */
  async startRefreshSystem(): Promise<void> {
    console.log('🔄 Starting data refresh system...');
    
    // Start background refresh for all enabled data sources
    for (const [sourceId, source] of this.dataSources) {
      if (source.enabled) {
        await this.scheduleRefresh(sourceId, {
          interval: source.refreshRate,
          maxRetries: this.CONFIG.DEFAULT_MAX_RETRIES,
          retryDelay: this.CONFIG.DEFAULT_RETRY_DELAY,
          backgroundRefresh: true,
          priority: 'medium'
        });
      }
    }
    
    // Start queue processor
    this.startQueueProcessor();
    
    console.log('✅ Data refresh system started');
  }

  /**
   * Schedule data refresh for a specific source
   */
  async scheduleRefresh(sourceId: string, config: RefreshConfig): Promise<string> {
    const refreshId = `${sourceId}_${Date.now()}`;
    
    // Add to queue with priority
    const priority = this.getPriorityValue(config.priority);
    this.refreshQueue.push({ id: refreshId, config, priority });
    this.refreshQueue.sort((a, b) => b.priority - a.priority);
    
    // Setup interval if background refresh is enabled
    if (config.backgroundRefresh) {
      this.setupBackgroundRefresh(sourceId, config);
    }
    
    console.log(`📅 Scheduled refresh for ${sourceId} (${refreshId})`);
    return refreshId;
  }

  /**
   * Execute immediate refresh for critical data
   */
  async immediateRefresh(sourceId: string): Promise<RefreshResult> {
    const source = this.dataSources.get(sourceId);
    if (!source) {
      throw new Error(`Data source ${sourceId} not found`);
    }

    console.log(`⚡ Executing immediate refresh for ${sourceId}`);
    
    const context = await this.buildRefreshContext();
    const strategy = this.selectRefreshStrategy(context, true);
    
    return await strategy.execute(context);
  }

  /**
   * Refresh Grafana dataset with progress tracking
   */
  async refreshGrafanaDataset(projects: ProjectData[]): Promise<GrafanaDataset> {
    const refreshId = 'grafana_dataset';
    const startTime = Date.now();
    
    const progress: RefreshProgress = {
      stage: 'Initializing',
      progress: 0,
      message: 'Starting Grafana dataset refresh',
      startTime,
      elapsedTime: 0,
      estimatedRemaining: 15000 // 15 seconds estimate
    };
    
    this.activeRefreshes.set(refreshId, progress);
    
    try {
      // Stage 1: Data validation
      this.updateProgress(refreshId, {
        stage: 'Validating',
        progress: 10,
        message: `Validating ${projects.length} projects`
      });
      
      await this.validateDataSources(projects);
      
      // Stage 2: Generate retirement data
      this.updateProgress(refreshId, {
        stage: 'Processing',
        progress: 30,
        message: 'Generating retirement transactions'
      });
      
      // Stage 3: Calculate aggregations
      this.updateProgress(refreshId, {
        stage: 'Aggregating',
        progress: 60,
        message: 'Calculating payment methods and metrics'
      });
      
      const dataset = await grafanaDataManager.generateGrafanaDataset(projects);
      
      // Stage 4: Cache optimization
      this.updateProgress(refreshId, {
        stage: 'Optimizing',
        progress: 90,
        message: 'Optimizing cache and finalizing'
      });
      
      await this.optimizeDataCache();
      
      // Complete
      this.updateProgress(refreshId, {
        stage: 'Complete',
        progress: 100,
        message: 'Dataset refresh completed successfully'
      });
      
      const result: RefreshResult = {
        success: true,
        data: dataset,
        metrics: {
          duration: Date.now() - startTime,
          dataSize: JSON.stringify(dataset).length,
          cacheHit: false,
          retryCount: 0
        },
        timestamp: new Date().toISOString()
      };
      
      this.addToHistory(result);
      this.activeRefreshes.delete(refreshId);
      
      console.log(`✅ Grafana dataset refreshed in ${result.metrics.duration}ms`);
      return dataset;
      
    } catch (error) {
      const result: RefreshResult = {
        success: false,
        error: error as Error,
        metrics: {
          duration: Date.now() - startTime,
          dataSize: 0,
          cacheHit: false,
          retryCount: 0
        },
        timestamp: new Date().toISOString()
      };
      
      this.addToHistory(result);
      this.activeRefreshes.delete(refreshId);
      
      console.error(`❌ Grafana dataset refresh failed:`, error);
      throw error;
    }
  }

  /**
   * Adaptive refresh based on network and usage conditions
   */
  async adaptiveRefresh(): Promise<void> {
    const context = await this.buildRefreshContext();
    const strategy = this.selectRefreshStrategy(context, false);
    
    console.log(`🎯 Using ${strategy.name} refresh strategy`);
    await strategy.execute(context);
  }

  /**
   * Get refresh progress for a specific operation
   */
  getRefreshProgress(refreshId: string): RefreshProgress | null {
    return this.activeRefreshes.get(refreshId) || null;
  }

  /**
   * Get all active refreshes
   */
  getActiveRefreshes(): Map<string, RefreshProgress> {
    return new Map(this.activeRefreshes);
  }

  /**
   * Get refresh history with filtering
   */
  getRefreshHistory(filter?: {
    success?: boolean;
    source?: string;
    since?: Date;
    limit?: number;
  }): RefreshResult[] {
    let history = [...this.refreshHistory];
    
    if (filter) {
      if (filter.success !== undefined) {
        history = history.filter(r => r.success === filter.success);
      }
      if (filter.since) {
        history = history.filter(r => new Date(r.timestamp) >= filter.since!);
      }
      if (filter.limit) {
        history = history.slice(0, filter.limit);
      }
    }
    
    return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Get data source statistics
   */
  getDataSourceStats(): Array<DataSource & {
    successRate: number;
    avgRefreshTime: number;
    nextRefresh?: string;
  }> {
    return Array.from(this.dataSources.values()).map(source => {
      const history = this.getRefreshHistory({ source: source.name, limit: 10 });
      const successCount = history.filter(h => h.success).length;
      const successRate = history.length > 0 ? (successCount / history.length) * 100 : 0;
      const avgRefreshTime = history.length > 0 ? 
        history.reduce((sum, h) => sum + h.metrics.duration, 0) / history.length : 0;
      
      return {
        ...source,
        successRate,
        avgRefreshTime,
        nextRefresh: this.getNextRefreshTime(source.name)
      };
    });
  }

  /**
   * Optimize refresh performance
   */
  async optimizeRefreshPerformance(): Promise<void> {
    console.log('🚀 Optimizing refresh performance...');
    
    // Analyze refresh patterns
    const history = this.getRefreshHistory({ limit: 50 });
    const avgDuration = history.reduce((sum, h) => sum + h.metrics.duration, 0) / history.length;
    const errorRate = history.filter(h => !h.success).length / history.length;
    
    // Adjust refresh intervals based on performance
    if (errorRate > this.CONFIG.ERROR_THRESHOLD) {
      console.log('⚠️ High error rate detected, slowing refresh intervals');
      this.adjustRefreshIntervals(1.5); // Increase intervals by 50%
    } else if (avgDuration < 1000 && errorRate < 0.05) {
      console.log('✨ Good performance, optimizing refresh intervals');
      this.adjustRefreshIntervals(0.8); // Decrease intervals by 20%
    }
    
    // Clear old cache entries
    await this.cleanupCache();
    
    // Optimize data aggregation
    dataAggregationEngine.optimizePerformance();
    
    console.log('✅ Refresh performance optimization completed');
  }

  /**
   * Stop all refresh operations
   */
  stopAllRefreshes(): void {
    console.log('⏹️ Stopping all refresh operations...');
    
    // Clear all intervals
    for (const [id, interval] of this.refreshIntervals) {
      clearInterval(interval);
    }
    this.refreshIntervals.clear();
    
    // Clear queue and active refreshes
    this.refreshQueue.length = 0;
    this.activeRefreshes.clear();
    
    console.log('✅ All refresh operations stopped');
  }

  /**
   * Enable/disable data source
   */
  toggleDataSource(sourceId: string, enabled: boolean): void {
    const source = this.dataSources.get(sourceId);
    if (source) {
      source.enabled = enabled;
      console.log(`${enabled ? '✅' : '❌'} Data source ${sourceId} ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  /**
   * Update data source configuration
   */
  updateDataSource(sourceId: string, updates: Partial<DataSource>): void {
    const source = this.dataSources.get(sourceId);
    if (source) {
      Object.assign(source, updates);
      console.log(`🔧 Updated data source ${sourceId}`);
    }
  }

  // Private methods

  private initializeDataSources(): void {
    const sources: DataSource[] = [
      {
        name: 'projects_api',
        type: 'api',
        url: process.env.NEXT_PUBLIC_PROJECTS_DATA_URL,
        refreshRate: this.CONFIG.BACKGROUND_INTERVAL,
        priority: 1,
        enabled: true,
        consecutiveErrors: 0
      },
      {
        name: 'co2e_api',
        type: 'api',
        url: process.env.NEXT_PUBLIC_API_BASE_URL,
        refreshRate: this.CONFIG.FAST_REFRESH_INTERVAL,
        priority: 2,
        enabled: true,
        consecutiveErrors: 0
      },
      {
        name: 'grafana_cache',
        type: 'cache',
        refreshRate: this.CONFIG.SLOW_REFRESH_INTERVAL,
        priority: 3,
        enabled: true,
        consecutiveErrors: 0
      }
    ];

    for (const source of sources) {
      this.dataSources.set(source.name, source);
    }
  }

  private initializeRefreshStrategies(): void {
    // Immediate strategy
    this.refreshStrategies.set(this.STRATEGIES.IMMEDIATE, {
      name: 'Immediate Refresh',
      description: 'High-priority immediate data refresh',
      condition: (context) => context.criticalData || context.userActive,
      execute: async (context) => this.executeImmediateRefresh(context)
    });

    // Background strategy
    this.refreshStrategies.set(this.STRATEGIES.BACKGROUND, {
      name: 'Background Refresh',
      description: 'Low-impact background refresh',
      condition: (context) => !context.userActive && context.networkCondition !== 'offline',
      execute: async (context) => this.executeBackgroundRefresh(context)
    });

    // Lazy strategy
    this.refreshStrategies.set(this.STRATEGIES.LAZY, {
      name: 'Lazy Refresh',
      description: 'Minimal refresh only when needed',
      condition: (context) => context.networkCondition === 'slow' || context.errorRate > 0.2,
      execute: async (context) => this.executeLazyRefresh(context)
    });

    // Adaptive strategy
    this.refreshStrategies.set(this.STRATEGIES.ADAPTIVE, {
      name: 'Adaptive Refresh',
      description: 'Smart refresh based on usage patterns',
      condition: (context) => true, // Default strategy
      execute: async (context) => this.executeAdaptiveRefresh(context)
    });
  }

  private async buildRefreshContext(): Promise<RefreshContext> {
    const now = new Date();
    const recentHistory = this.getRefreshHistory({ since: new Date(now.getTime() - 3600000), limit: 20 });
    const errorRate = recentHistory.length > 0 ? 
      recentHistory.filter(h => !h.success).length / recentHistory.length : 0;

    return {
      dataSources: Array.from(this.dataSources.values()),
      lastRefresh: recentHistory.length > 0 ? new Date(recentHistory[0].timestamp) : null,
      errorRate,
      networkCondition: await this.detectNetworkCondition(),
      userActive: this.isUserActive(),
      criticalData: this.hasCriticalDataNeeds()
    };
  }

  private selectRefreshStrategy(context: RefreshContext, forceImmediate: boolean = false): RefreshStrategy {
    if (forceImmediate) {
      return this.refreshStrategies.get(this.STRATEGIES.IMMEDIATE)!;
    }

    for (const strategy of this.refreshStrategies.values()) {
      if (strategy.condition(context)) {
        return strategy;
      }
    }

    return this.refreshStrategies.get(this.STRATEGIES.ADAPTIVE)!;
  }

  private async executeImmediateRefresh(context: RefreshContext): Promise<RefreshResult> {
    const startTime = Date.now();
    try {
      // Force refresh all critical data sources
      const results = await Promise.all(
        context.dataSources
          .filter(ds => ds.enabled && ds.priority <= 2)
          .map(ds => this.refreshDataSource(ds))
      );

      return {
        success: results.every(r => r.success),
        data: results,
        metrics: {
          duration: Date.now() - startTime,
          dataSize: 0,
          cacheHit: false,
          retryCount: 0
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error as Error,
        metrics: {
          duration: Date.now() - startTime,
          dataSize: 0,
          cacheHit: false,
          retryCount: 0
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  private async executeBackgroundRefresh(context: RefreshContext): Promise<RefreshResult> {
    const startTime = Date.now();
    try {
      // Refresh only non-critical data sources
      const results = await Promise.all(
        context.dataSources
          .filter(ds => ds.enabled && ds.priority >= 3)
          .map(ds => this.refreshDataSource(ds))
      );

      return {
        success: results.every(r => r.success),
        data: results,
        metrics: {
          duration: Date.now() - startTime,
          dataSize: 0,
          cacheHit: false,
          retryCount: 0
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error as Error,
        metrics: {
          duration: Date.now() - startTime,
          dataSize: 0,
          cacheHit: false,
          retryCount: 0
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  private async executeLazyRefresh(context: RefreshContext): Promise<RefreshResult> {
    const startTime = Date.now();
    try {
      // Only refresh if data is stale
      const staleThreshold = 10 * 60 * 1000; // 10 minutes
      const now = Date.now();
      
      const staleSources = context.dataSources.filter(ds => {
        if (!ds.enabled || !ds.lastRefresh) return true;
        return now - new Date(ds.lastRefresh).getTime() > staleThreshold;
      });

      if (staleSources.length === 0) {
        return {
          success: true,
          data: 'No refresh needed',
          metrics: {
            duration: Date.now() - startTime,
            dataSize: 0,
            cacheHit: true,
            retryCount: 0
          },
          timestamp: new Date().toISOString()
        };
      }

      const results = await Promise.all(
        staleSources.map(ds => this.refreshDataSource(ds))
      );

      return {
        success: results.every(r => r.success),
        data: results,
        metrics: {
          duration: Date.now() - startTime,
          dataSize: 0,
          cacheHit: false,
          retryCount: 0
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error as Error,
        metrics: {
          duration: Date.now() - startTime,
          dataSize: 0,
          cacheHit: false,
          retryCount: 0
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  private async executeAdaptiveRefresh(context: RefreshContext): Promise<RefreshResult> {
    // Combine strategies based on context
    if (context.userActive && context.networkCondition === 'fast') {
      return this.executeImmediateRefresh(context);
    } else if (context.errorRate > 0.1) {
      return this.executeLazyRefresh(context);
    } else {
      return this.executeBackgroundRefresh(context);
    }
  }

  private async refreshDataSource(source: DataSource): Promise<RefreshResult> {
    const startTime = Date.now();
    try {
      let data: any;
      
      switch (source.type) {
        case 'api':
          if (source.name === 'projects_api') {
            data = await co2eApi.getProjects();
          } else if (source.name === 'co2e_api') {
            data = await co2eApi.getStats();
          }
          break;
        case 'cache':
          // Refresh cache-based data
          if (source.name === 'grafana_cache') {
            grafanaDataManager.clearCache();
          }
          data = 'Cache refreshed';
          break;
        default:
          throw new Error(`Unknown source type: ${source.type}`);
      }

      source.lastRefresh = new Date().toISOString();
      source.consecutiveErrors = 0;

      return {
        success: true,
        data,
        metrics: {
          duration: Date.now() - startTime,
          dataSize: JSON.stringify(data).length,
          cacheHit: false,
          retryCount: 0
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      source.lastError = (error as Error).message;
      source.consecutiveErrors++;

      return {
        success: false,
        error: error as Error,
        metrics: {
          duration: Date.now() - startTime,
          dataSize: 0,
          cacheHit: false,
          retryCount: 0
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  private setupBackgroundRefresh(sourceId: string, config: RefreshConfig): void {
    if (this.refreshIntervals.has(sourceId)) {
      clearInterval(this.refreshIntervals.get(sourceId)!);
    }

    const interval = setInterval(async () => {
      const source = this.dataSources.get(sourceId);
      if (source && source.enabled) {
        await this.refreshDataSource(source);
      }
    }, config.interval);

    this.refreshIntervals.set(sourceId, interval);
  }

  private startQueueProcessor(): void {
    setInterval(async () => {
      if (this.refreshQueue.length > 0 && this.activeRefreshes.size < this.CONFIG.MAX_CONCURRENT_REFRESHES) {
        const next = this.refreshQueue.shift();
        if (next) {
          // Process refresh in background
          this.processQueuedRefresh(next).catch(console.error);
        }
      }
    }, 1000); // Check every second
  }

  private async processQueuedRefresh(item: { id: string; config: RefreshConfig; priority: number }): Promise<void> {
    // Extract source ID from refresh ID
    const sourceId = item.id.split('_')[0];
    const source = this.dataSources.get(sourceId);
    
    if (source) {
      const result = await this.refreshDataSource(source);
      this.addToHistory(result);
      
      if (item.config.onSuccess && result.success) {
        item.config.onSuccess(result.data);
      } else if (item.config.onError && !result.success) {
        item.config.onError(result.error!);
      }
    }
  }

  private updateProgress(refreshId: string, updates: Partial<RefreshProgress>): void {
    const current = this.activeRefreshes.get(refreshId);
    if (current) {
      const updated = { 
        ...current, 
        ...updates, 
        elapsedTime: Date.now() - current.startTime 
      };
      
      // Calculate estimated remaining time
      if (updated.progress > 0) {
        const totalEstimated = (updated.elapsedTime / updated.progress) * 100;
        updated.estimatedRemaining = Math.max(0, totalEstimated - updated.elapsedTime);
      }
      
      this.activeRefreshes.set(refreshId, updated);
    }
  }

  private addToHistory(result: RefreshResult): void {
    this.refreshHistory.unshift(result);
    if (this.refreshHistory.length > this.CONFIG.REFRESH_HISTORY_LIMIT) {
      this.refreshHistory = this.refreshHistory.slice(0, this.CONFIG.REFRESH_HISTORY_LIMIT);
    }
  }

  private getPriorityValue(priority: 'high' | 'medium' | 'low'): number {
    const values = { high: 3, medium: 2, low: 1 };
    return values[priority];
  }

  private async validateDataSources(projects: ProjectData[]): Promise<void> {
    if (!projects || projects.length === 0) {
      throw new Error('No project data available for validation');
    }
    
    // Validate project data structure
    for (const project of projects.slice(0, 5)) { // Check first 5 projects
      if (!project.id || !project.name) {
        throw new Error('Invalid project data structure');
      }
    }
  }

  private async optimizeDataCache(): Promise<void> {
    // Clear old cache entries and optimize memory usage
    grafanaDataManager.clearCache();
    dataAggregationEngine.clearCache();
  }

  private adjustRefreshIntervals(factor: number): void {
    for (const source of this.dataSources.values()) {
      source.refreshRate = Math.floor(source.refreshRate * factor);
    }
  }

  private async cleanupCache(): Promise<void> {
    // Cleanup expired cache entries
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
    this.refreshHistory = this.refreshHistory.filter(h => 
      new Date(h.timestamp).getTime() > cutoff
    );
  }

  private getNextRefreshTime(sourceId: string): string | undefined {
    const source = this.dataSources.get(sourceId);
    if (!source || !source.lastRefresh) return undefined;
    
    const nextTime = new Date(source.lastRefresh).getTime() + source.refreshRate;
    return new Date(nextTime).toISOString();
  }

  private setupNetworkMonitoring(): void {
    // Monitor network conditions for adaptive refresh
    // This would typically integrate with browser APIs or network monitoring services
  }

  private async detectNetworkCondition(): Promise<'fast' | 'slow' | 'offline'> {
    // Simple network condition detection
    // In a real implementation, this would check actual network speed
    if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
      if (!navigator.onLine) return 'offline';
    }
    
    // For now, assume fast network
    return 'fast';
  }

  private isUserActive(): boolean {
    // Detect if user is actively using the dashboard
    // This could be based on mouse movement, clicks, focus, etc.
    return document.hasFocus?.() ?? true;
  }

  private hasCriticalDataNeeds(): boolean {
    // Determine if there are critical data needs
    // This could be based on current page, user actions, etc.
    return window.location.pathname.includes('/dashboard');
  }
}

// Export singleton instance
export const dataRefreshManager = DataRefreshManager.getInstance();

// Export utility functions
export const startDataRefreshSystem = (): Promise<void> => 
  dataRefreshManager.startRefreshSystem();

export const scheduleDataRefresh = (sourceId: string, config: RefreshConfig): Promise<string> => 
  dataRefreshManager.scheduleRefresh(sourceId, config);

export const immediateDataRefresh = (sourceId: string): Promise<RefreshResult> => 
  dataRefreshManager.immediateRefresh(sourceId);

export const refreshGrafanaDataset = (projects: ProjectData[]): Promise<GrafanaDataset> => 
  dataRefreshManager.refreshGrafanaDataset(projects);

export const getRefreshProgress = (refreshId: string): RefreshProgress | null => 
  dataRefreshManager.getRefreshProgress(refreshId);

export const getRefreshHistory = (filter?: any): RefreshResult[] => 
  dataRefreshManager.getRefreshHistory(filter);

export const optimizeRefreshPerformance = (): Promise<void> => 
  dataRefreshManager.optimizeRefreshPerformance();

export const stopAllDataRefreshes = (): void => 
  dataRefreshManager.stopAllRefreshes();