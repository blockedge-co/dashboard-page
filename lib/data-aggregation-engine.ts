// High-performance data aggregation engine for large datasets
// Optimized for real-time calculations and memory efficiency

import type { ProjectData } from "./co2e-api";
import type { 
  RetirementTransaction, 
  RetirementStats, 
  MarketData,
  AggregationOptions,
  TimeSeries 
} from "./types";

export interface AggregationResult<T = any> {
  data: T;
  metadata: {
    totalRecords: number;
    processedRecords: number;
    processingTime: number;
    cacheHit: boolean;
    lastUpdated: string;
    aggregationKey: string;
  };
}

export interface PerformanceMetrics {
  memoryUsage: number;
  processingTime: number;
  cacheHitRate: number;
  throughput: number; // records per second
  optimizationSuggestions: string[];
}

export interface DataSlice {
  startIndex: number;
  endIndex: number;
  size: number;
  data: any[];
}

export interface AggregationStrategy {
  name: string;
  description: string;
  minDataSize: number;
  maxDataSize: number;
  memoryEfficient: boolean;
  parallelizable: boolean;
}

export class DataAggregationEngine {
  private static instance: DataAggregationEngine;
  private aggregationCache: Map<string, { result: any; timestamp: number; ttl: number }> = new Map();
  private performanceMetrics: PerformanceMetrics = {
    memoryUsage: 0,
    processingTime: 0,
    cacheHitRate: 0,
    throughput: 0,
    optimizationSuggestions: []
  };

  // Configuration
  private readonly CONFIG = {
    CHUNK_SIZE: 1000,           // Records per chunk for streaming
    MAX_MEMORY_MB: 100,         // Maximum memory usage in MB
    CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutes
    PARALLEL_THRESHOLD: 5000,   // Minimum records for parallel processing
    OPTIMIZATION_THRESHOLD: 0.8 // Cache hit rate threshold for optimization
  };

  // Aggregation strategies
  private readonly STRATEGIES: Record<string, AggregationStrategy> = {
    STREAM: {
      name: 'Stream Processing',
      description: 'Memory-efficient streaming for large datasets',
      minDataSize: 10000,
      maxDataSize: Infinity,
      memoryEfficient: true,
      parallelizable: true
    },
    BATCH: {
      name: 'Batch Processing',
      description: 'Fast batch processing for medium datasets',
      minDataSize: 1000,
      maxDataSize: 10000,
      memoryEfficient: false,
      parallelizable: true
    },
    DIRECT: {
      name: 'Direct Processing',
      description: 'Simple processing for small datasets',
      minDataSize: 0,
      maxDataSize: 1000,
      memoryEfficient: true,
      parallelizable: false
    }
  };

  private constructor() {}

  static getInstance(): DataAggregationEngine {
    if (!DataAggregationEngine.instance) {
      DataAggregationEngine.instance = new DataAggregationEngine();
    }
    return DataAggregationEngine.instance;
  }

  /**
   * Aggregate retirement data with performance optimization
   */
  async aggregateRetirements(
    retirements: RetirementTransaction[],
    options: AggregationOptions
  ): Promise<AggregationResult<RetirementStats>> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey('retirements', options);
    
    // Check cache first
    const cached = this.getCachedResult(cacheKey);
    if (cached) {
      return {
        data: cached,
        metadata: {
          totalRecords: retirements.length,
          processedRecords: 0,
          processingTime: Date.now() - startTime,
          cacheHit: true,
          lastUpdated: new Date().toISOString(),
          aggregationKey: cacheKey
        }
      };
    }

    // Select optimal strategy
    const strategy = this.selectOptimalStrategy(retirements.length);
    console.log(`📊 Using ${strategy.name} for ${retirements.length} retirement records`);

    let result: RetirementStats;
    
    switch (strategy.name) {
      case 'Stream Processing':
        result = await this.streamAggregateRetirements(retirements, options);
        break;
      case 'Batch Processing':
        result = await this.batchAggregateRetirements(retirements, options);
        break;
      default:
        result = await this.directAggregateRetirements(retirements, options);
    }

    // Cache result
    this.setCachedResult(cacheKey, result);
    
    const processingTime = Date.now() - startTime;
    this.updatePerformanceMetrics(retirements.length, processingTime, false);

    return {
      data: result,
      metadata: {
        totalRecords: retirements.length,
        processedRecords: retirements.length,
        processingTime,
        cacheHit: false,
        lastUpdated: new Date().toISOString(),
        aggregationKey: cacheKey
      }
    };
  }

  /**
   * Aggregate project data with market metrics
   */
  async aggregateProjects(
    projects: ProjectData[],
    options: AggregationOptions
  ): Promise<AggregationResult<any>> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey('projects', options);
    
    const cached = this.getCachedResult(cacheKey);
    if (cached) {
      return {
        data: cached,
        metadata: {
          totalRecords: projects.length,
          processedRecords: 0,
          processingTime: Date.now() - startTime,
          cacheHit: true,
          lastUpdated: new Date().toISOString(),
          aggregationKey: cacheKey
        }
      };
    }

    const strategy = this.selectOptimalStrategy(projects.length);
    let result: any;

    switch (strategy.name) {
      case 'Stream Processing':
        result = await this.streamAggregateProjects(projects, options);
        break;
      case 'Batch Processing':
        result = await this.batchAggregateProjects(projects, options);
        break;
      default:
        result = await this.directAggregateProjects(projects, options);
    }

    this.setCachedResult(cacheKey, result);
    
    const processingTime = Date.now() - startTime;
    this.updatePerformanceMetrics(projects.length, processingTime, false);

    return {
      data: result,
      metadata: {
        totalRecords: projects.length,
        processedRecords: projects.length,
        processingTime,
        cacheHit: false,
        lastUpdated: new Date().toISOString(),
        aggregationKey: cacheKey
      }
    };
  }

  /**
   * Create time series data with automatic downsampling
   */
  async createTimeSeries<T>(
    data: T[],
    timeField: keyof T,
    valueField: keyof T,
    options: {
      interval: 'hour' | 'day' | 'week' | 'month';
      aggregationType: 'sum' | 'avg' | 'max' | 'min' | 'count';
      maxPoints?: number;
    }
  ): Promise<AggregationResult<TimeSeries<number>>> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey('timeseries', options);
    
    const cached = this.getCachedResult(cacheKey);
    if (cached) {
      return {
        data: cached,
        metadata: {
          totalRecords: data.length,
          processedRecords: 0,
          processingTime: Date.now() - startTime,
          cacheHit: true,
          lastUpdated: new Date().toISOString(),
          aggregationKey: cacheKey
        }
      };
    }

    const strategy = this.selectOptimalStrategy(data.length);
    let result: TimeSeries<number>;

    if (strategy.name === 'Stream Processing') {
      result = await this.streamCreateTimeSeries(data, timeField, valueField, options);
    } else {
      result = await this.directCreateTimeSeries(data, timeField, valueField, options);
    }

    // Apply downsampling if too many points
    if (options.maxPoints && result.length > options.maxPoints) {
      result = this.downsampleTimeSeries(result, options.maxPoints);
    }

    this.setCachedResult(cacheKey, result);
    
    const processingTime = Date.now() - startTime;
    this.updatePerformanceMetrics(data.length, processingTime, false);

    return {
      data: result,
      metadata: {
        totalRecords: data.length,
        processedRecords: data.length,
        processingTime,
        cacheHit: false,
        lastUpdated: new Date().toISOString(),
        aggregationKey: cacheKey
      }
    };
  }

  /**
   * Calculate real-time statistics with rolling windows
   */
  async calculateRealTimeStats(
    data: any[],
    windowSize: number = 100
  ): Promise<AggregationResult<{
    current: any;
    trend: number;
    volatility: number;
    momentum: number;
  }>> {
    const startTime = Date.now();
    
    // Use sliding window for real-time calculations
    const window = data.slice(-windowSize);
    const previousWindow = data.slice(-(windowSize * 2), -windowSize);
    
    const current = this.calculateWindowStats(window);
    const previous = this.calculateWindowStats(previousWindow);
    
    const trend = this.calculateTrend(current, previous);
    const volatility = this.calculateVolatility(window);
    const momentum = this.calculateMomentum(window);
    
    const result = {
      current,
      trend,
      volatility,
      momentum
    };
    
    return {
      data: result,
      metadata: {
        totalRecords: data.length,
        processedRecords: window.length,
        processingTime: Date.now() - startTime,
        cacheHit: false,
        lastUpdated: new Date().toISOString(),
        aggregationKey: `realtime_${windowSize}`
      }
    };
  }

  /**
   * Stream processing for large datasets
   */
  private async streamAggregateRetirements(
    retirements: RetirementTransaction[],
    options: AggregationOptions
  ): Promise<RetirementStats> {
    const chunks = this.createDataChunks(retirements, this.CONFIG.CHUNK_SIZE);
    const aggregators = {
      total: { count: 0, amount: 0, co2eAmount: 0, value: 0 },
      byProject: new Map<string, any>(),
      byRetirer: new Map<string, any>(),
      byTimeframe: { daily: new Map(), monthly: new Map(), yearly: new Map() },
      byMethodology: new Map<string, any>()
    };

    // Process chunks in parallel if dataset is large enough
    if (retirements.length > this.CONFIG.PARALLEL_THRESHOLD) {
      await this.processChunksParallel(chunks, aggregators, options);
    } else {
      await this.processChunksSequential(chunks, aggregators, options);
    }

    return this.finalizeRetirementStats(aggregators);
  }

  /**
   * Batch processing for medium datasets
   */
  private async batchAggregateRetirements(
    retirements: RetirementTransaction[],
    options: AggregationOptions
  ): Promise<RetirementStats> {
    const batchSize = Math.min(this.CONFIG.CHUNK_SIZE, retirements.length);
    const batches = this.createDataChunks(retirements, batchSize);
    
    const results = await Promise.all(
      batches.map(batch => this.processBatch(batch, options))
    );
    
    return this.mergeRetirementStats(results);
  }

  /**
   * Direct processing for small datasets
   */
  private async directAggregateRetirements(
    retirements: RetirementTransaction[],
    options: AggregationOptions
  ): Promise<RetirementStats> {
    // Simple direct aggregation for small datasets
    const totalAmount = retirements.reduce((sum, r) => sum + parseInt(r.amount), 0);
    const totalCO2e = retirements.reduce((sum, r) => sum + parseInt(r.amountCO2e), 0);
    const totalValue = totalCO2e * 40; // Assume $40 per tonne

    return {
      total: {
        count: retirements.length,
        amount: totalAmount.toString(),
        co2eAmount: totalCO2e.toString(),
        value: totalValue.toFixed(2)
      },
      byProject: this.aggregateByProject(retirements),
      byRetirer: this.aggregateByRetirer(retirements),
      byTimeframe: this.aggregateByTimeframe(retirements),
      byMethodology: this.aggregateByMethodology(retirements),
      trends: this.calculateTrends(retirements)
    };
  }

  /**
   * Stream processing for projects
   */
  private async streamAggregateProjects(
    projects: ProjectData[],
    options: AggregationOptions
  ): Promise<any> {
    const chunks = this.createDataChunks(projects, this.CONFIG.CHUNK_SIZE);
    const aggregators = {
      totalSupply: 0,
      totalRetired: 0,
      totalValue: 0,
      byCountry: new Map<string, any>(),
      byMethodology: new Map<string, any>(),
      byVintage: new Map<string, any>()
    };

    for (const chunk of chunks) {
      await this.processProjectChunk(chunk, aggregators);
    }

    return this.finalizeProjectStats(aggregators);
  }

  /**
   * Batch processing for projects
   */
  private async batchAggregateProjects(
    projects: ProjectData[],
    options: AggregationOptions
  ): Promise<any> {
    const batchSize = Math.min(this.CONFIG.CHUNK_SIZE, projects.length);
    const batches = this.createDataChunks(projects, batchSize);
    
    const results = await Promise.all(
      batches.map(batch => this.processProjectBatch(batch, options))
    );
    
    return this.mergeProjectStats(results);
  }

  /**
   * Direct processing for projects
   */
  private async directAggregateProjects(
    projects: ProjectData[],
    options: AggregationOptions
  ): Promise<any> {
    return {
      totalSupply: projects.reduce((sum, p) => sum + parseInt(p.totalSupply || '0'), 0),
      totalRetired: projects.reduce((sum, p) => sum + parseInt(p.retired || '0'), 0),
      totalValue: projects.reduce((sum, p) => sum + parseFloat(p.pricing.currentPrice || '0'), 0),
      byCountry: this.groupByField(projects, 'country'),
      byMethodology: this.groupByField(projects, 'methodology'),
      byVintage: this.groupByField(projects, 'vintage'),
      averagePrice: this.calculateAveragePrice(projects),
      priceRange: this.calculatePriceRange(projects)
    };
  }

  /**
   * Create time series with streaming
   */
  private async streamCreateTimeSeries<T>(
    data: T[],
    timeField: keyof T,
    valueField: keyof T,
    options: any
  ): Promise<TimeSeries<number>> {
    const timeSeries: TimeSeries<number> = [];
    const timeGroups = new Map<string, number[]>();
    
    // Group data by time interval
    for (const item of data) {
      const timeValue = item[timeField] as string;
      const numValue = parseFloat(item[valueField] as string) || 0;
      const intervalKey = this.getIntervalKey(timeValue, options.interval);
      
      if (!timeGroups.has(intervalKey)) {
        timeGroups.set(intervalKey, []);
      }
      timeGroups.get(intervalKey)!.push(numValue);
    }
    
    // Aggregate by specified method
    for (const [timestamp, values] of timeGroups) {
      const aggregatedValue = this.aggregateValues(values, options.aggregationType);
      timeSeries.push({ timestamp, data: aggregatedValue });
    }
    
    return timeSeries.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  }

  /**
   * Direct time series creation
   */
  private async directCreateTimeSeries<T>(
    data: T[],
    timeField: keyof T,
    valueField: keyof T,
    options: any
  ): Promise<TimeSeries<number>> {
    return this.streamCreateTimeSeries(data, timeField, valueField, options);
  }

  /**
   * Downsample time series data
   */
  private downsampleTimeSeries(
    timeSeries: TimeSeries<number>,
    maxPoints: number
  ): TimeSeries<number> {
    if (timeSeries.length <= maxPoints) {
      return timeSeries;
    }
    
    const step = Math.floor(timeSeries.length / maxPoints);
    const downsampled: TimeSeries<number> = [];
    
    for (let i = 0; i < timeSeries.length; i += step) {
      const slice = timeSeries.slice(i, i + step);
      const avgValue = slice.reduce((sum, item) => sum + item.data, 0) / slice.length;
      downsampled.push({
        timestamp: slice[0].timestamp,
        data: avgValue
      });
    }
    
    return downsampled;
  }

  /**
   * Select optimal processing strategy
   */
  private selectOptimalStrategy(dataSize: number): AggregationStrategy {
    for (const strategy of Object.values(this.STRATEGIES)) {
      if (dataSize >= strategy.minDataSize && dataSize <= strategy.maxDataSize) {
        return strategy;
      }
    }
    return this.STRATEGIES.DIRECT;
  }

  /**
   * Create data chunks for processing
   */
  private createDataChunks<T>(data: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Process chunks in parallel
   */
  private async processChunksParallel(
    chunks: any[][],
    aggregators: any,
    options: AggregationOptions
  ): Promise<void> {
    const promises = chunks.map(chunk => this.processChunk(chunk, options));
    const results = await Promise.all(promises);
    this.mergeAggregatorResults(aggregators, results);
  }

  /**
   * Process chunks sequentially
   */
  private async processChunksSequential(
    chunks: any[][],
    aggregators: any,
    options: AggregationOptions
  ): Promise<void> {
    for (const chunk of chunks) {
      const result = await this.processChunk(chunk, options);
      this.mergeAggregatorResult(aggregators, result);
    }
  }

  /**
   * Process a single chunk
   */
  private async processChunk(chunk: any[], options: AggregationOptions): Promise<any> {
    // Implement chunk processing logic
    return { processed: chunk.length };
  }

  /**
   * Get current performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  /**
   * Optimize aggregation performance
   */
  optimizePerformance(): void {
    const suggestions: string[] = [];
    
    if (this.performanceMetrics.cacheHitRate < this.CONFIG.OPTIMIZATION_THRESHOLD) {
      suggestions.push('Consider increasing cache TTL for better hit rates');
    }
    
    if (this.performanceMetrics.memoryUsage > this.CONFIG.MAX_MEMORY_MB) {
      suggestions.push('Reduce chunk size or enable streaming for large datasets');
    }
    
    if (this.performanceMetrics.throughput < 1000) {
      suggestions.push('Consider parallel processing for better throughput');
    }
    
    this.performanceMetrics.optimizationSuggestions = suggestions;
  }

  /**
   * Clear aggregation cache
   */
  clearCache(): void {
    this.aggregationCache.clear();
    console.log('🧹 Cleared aggregation cache');
  }

  // Private utility methods
  private generateCacheKey(type: string, options: any): string {
    return `${type}_${JSON.stringify(options)}`;
  }

  private getCachedResult(key: string): any | null {
    const cached = this.aggregationCache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.result;
    }
    return null;
  }

  private setCachedResult(key: string, result: any): void {
    this.aggregationCache.set(key, {
      result,
      timestamp: Date.now(),
      ttl: this.CONFIG.CACHE_TTL_MS
    });
  }

  private updatePerformanceMetrics(
    recordCount: number,
    processingTime: number,
    cacheHit: boolean
  ): void {
    this.performanceMetrics.processingTime = processingTime;
    this.performanceMetrics.throughput = recordCount / (processingTime / 1000);
    
    // Update cache hit rate (simple moving average)
    const currentHitRate = this.performanceMetrics.cacheHitRate;
    this.performanceMetrics.cacheHitRate = (currentHitRate + (cacheHit ? 1 : 0)) / 2;
    
    // Update memory usage estimate
    this.performanceMetrics.memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
  }

  // Aggregation helper methods
  private aggregateByProject(retirements: RetirementTransaction[]): Record<string, any> {
    const byProject: Record<string, any> = {};
    for (const retirement of retirements) {
      const projectId = retirement.projectId;
      if (!byProject[projectId]) {
        byProject[projectId] = { count: 0, amount: '0', co2eAmount: '0', percentage: 0 };
      }
      byProject[projectId].count++;
      byProject[projectId].amount = (parseInt(byProject[projectId].amount) + parseInt(retirement.amount)).toString();
      byProject[projectId].co2eAmount = (parseInt(byProject[projectId].co2eAmount) + parseInt(retirement.amountCO2e)).toString();
    }
    return byProject;
  }

  private aggregateByRetirer(retirements: RetirementTransaction[]): Record<string, any> {
    const byRetirer: Record<string, any> = {};
    for (const retirement of retirements) {
      const retirerId = retirement.retiredBy.address;
      if (!byRetirer[retirerId]) {
        byRetirer[retirerId] = { 
          count: 0, 
          amount: '0', 
          co2eAmount: '0', 
          name: retirement.retiredBy.name,
          type: retirement.retiredBy.type
        };
      }
      byRetirer[retirerId].count++;
      byRetirer[retirerId].amount = (parseInt(byRetirer[retirerId].amount) + parseInt(retirement.amount)).toString();
      byRetirer[retirerId].co2eAmount = (parseInt(byRetirer[retirerId].co2eAmount) + parseInt(retirement.amountCO2e)).toString();
    }
    return byRetirer;
  }

  private aggregateByTimeframe(retirements: RetirementTransaction[]): any {
    const daily = new Map<string, any>();
    const monthly = new Map<string, any>();
    const yearly = new Map<string, any>();
    
    for (const retirement of retirements) {
      const date = new Date(retirement.retirementDate);
      const dayKey = date.toISOString().split('T')[0];
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const yearKey = date.getFullYear().toString();
      
      // Update daily
      if (!daily.has(dayKey)) {
        daily.set(dayKey, { date: dayKey, count: 0, amount: '0', co2eAmount: '0' });
      }
      const dayData = daily.get(dayKey)!;
      dayData.count++;
      dayData.amount = (parseInt(dayData.amount) + parseInt(retirement.amount)).toString();
      dayData.co2eAmount = (parseInt(dayData.co2eAmount) + parseInt(retirement.amountCO2e)).toString();
      
      // Update monthly
      if (!monthly.has(monthKey)) {
        monthly.set(monthKey, { month: monthKey, count: 0, amount: '0', co2eAmount: '0' });
      }
      const monthData = monthly.get(monthKey)!;
      monthData.count++;
      monthData.amount = (parseInt(monthData.amount) + parseInt(retirement.amount)).toString();
      monthData.co2eAmount = (parseInt(monthData.co2eAmount) + parseInt(retirement.amountCO2e)).toString();
      
      // Update yearly
      if (!yearly.has(yearKey)) {
        yearly.set(yearKey, { year: yearKey, count: 0, amount: '0', co2eAmount: '0' });
      }
      const yearData = yearly.get(yearKey)!;
      yearData.count++;
      yearData.amount = (parseInt(yearData.amount) + parseInt(retirement.amount)).toString();
      yearData.co2eAmount = (parseInt(yearData.co2eAmount) + parseInt(retirement.amountCO2e)).toString();
    }
    
    return {
      daily: Array.from(daily.values()).sort((a, b) => b.date.localeCompare(a.date)),
      monthly: Array.from(monthly.values()).sort((a, b) => b.month.localeCompare(a.month)),
      yearly: Array.from(yearly.values()).sort((a, b) => b.year.localeCompare(a.year))
    };
  }

  private aggregateByMethodology(retirements: RetirementTransaction[]): Record<string, any> {
    const byMethodology: Record<string, any> = {};
    for (const retirement of retirements) {
      const methodology = retirement.methodology;
      if (!byMethodology[methodology]) {
        byMethodology[methodology] = { count: 0, amount: '0', co2eAmount: '0', percentage: 0 };
      }
      byMethodology[methodology].count++;
      byMethodology[methodology].amount = (parseInt(byMethodology[methodology].amount) + parseInt(retirement.amount)).toString();
      byMethodology[methodology].co2eAmount = (parseInt(byMethodology[methodology].co2eAmount) + parseInt(retirement.amountCO2e)).toString();
    }
    return byMethodology;
  }

  private calculateTrends(retirements: RetirementTransaction[]): any {
    if (retirements.length < 2) {
      return { growthRate: 0, averageRetirement: '0', topRetirers: [] };
    }
    
    const sortedByDate = [...retirements].sort((a, b) => 
      new Date(a.retirementDate).getTime() - new Date(b.retirementDate).getTime()
    );
    
    const firstMonth = sortedByDate[0];
    const lastMonth = sortedByDate[sortedByDate.length - 1];
    const monthsDiff = (new Date(lastMonth.retirementDate).getTime() - new Date(firstMonth.retirementDate).getTime()) / (30 * 24 * 60 * 60 * 1000);
    
    const growthRate = monthsDiff > 0 ? (retirements.length / monthsDiff) : 0;
    const totalAmount = retirements.reduce((sum, r) => sum + parseInt(r.amountCO2e), 0);
    const averageRetirement = totalAmount / retirements.length;
    
    return {
      growthRate: parseFloat(growthRate.toFixed(2)),
      averageRetirement: Math.floor(averageRetirement).toString(),
      topRetirers: []
    };
  }

  private groupByField(data: any[], field: string): Record<string, number> {
    const groups: Record<string, number> = {};
    for (const item of data) {
      const value = item[field] || 'Unknown';
      groups[value] = (groups[value] || 0) + 1;
    }
    return groups;
  }

  private calculateAveragePrice(projects: ProjectData[]): number {
    const prices = projects.map(p => parseFloat(p.pricing.currentPrice || '0'));
    return prices.reduce((sum, p) => sum + p, 0) / prices.length;
  }

  private calculatePriceRange(projects: ProjectData[]): { min: number; max: number } {
    const prices = projects.map(p => parseFloat(p.pricing.currentPrice || '0'));
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }

  private getIntervalKey(timeValue: string, interval: string): string {
    const date = new Date(timeValue);
    switch (interval) {
      case 'hour':
        return date.toISOString().slice(0, 13);
      case 'day':
        return date.toISOString().slice(0, 10);
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        return weekStart.toISOString().slice(0, 10);
      case 'month':
        return date.toISOString().slice(0, 7);
      default:
        return date.toISOString().slice(0, 10);
    }
  }

  private aggregateValues(values: number[], type: string): number {
    switch (type) {
      case 'sum':
        return values.reduce((sum, v) => sum + v, 0);
      case 'avg':
        return values.reduce((sum, v) => sum + v, 0) / values.length;
      case 'max':
        return Math.max(...values);
      case 'min':
        return Math.min(...values);
      case 'count':
        return values.length;
      default:
        return values.reduce((sum, v) => sum + v, 0);
    }
  }

  private calculateWindowStats(window: any[]): any {
    if (window.length === 0) return {};
    
    const values = window.map(item => parseFloat(item.value || item.amount || '0'));
    return {
      sum: values.reduce((sum, v) => sum + v, 0),
      avg: values.reduce((sum, v) => sum + v, 0) / values.length,
      max: Math.max(...values),
      min: Math.min(...values),
      count: values.length
    };
  }

  private calculateTrend(current: any, previous: any): number {
    if (!previous.avg || previous.avg === 0) return 0;
    return ((current.avg - previous.avg) / previous.avg) * 100;
  }

  private calculateVolatility(window: any[]): number {
    if (window.length < 2) return 0;
    
    const values = window.map(item => parseFloat(item.value || item.amount || '0'));
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    
    return Math.sqrt(variance);
  }

  private calculateMomentum(window: any[]): number {
    if (window.length < 2) return 0;
    
    const values = window.map(item => parseFloat(item.value || item.amount || '0'));
    const recent = values.slice(-Math.floor(values.length / 3));
    const earlier = values.slice(0, Math.floor(values.length / 3));
    
    const recentAvg = recent.reduce((sum, v) => sum + v, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, v) => sum + v, 0) / earlier.length;
    
    return earlierAvg === 0 ? 0 : ((recentAvg - earlierAvg) / earlierAvg) * 100;
  }

  private finalizeRetirementStats(aggregators: any): RetirementStats {
    // Convert Maps to objects and calculate percentages
    const total = aggregators.total;
    
    return {
      total: {
        count: total.count,
        amount: total.amount.toString(),
        co2eAmount: total.co2eAmount.toString(),
        value: total.value.toFixed(2)
      },
      byProject: Object.fromEntries(aggregators.byProject),
      byRetirer: Object.fromEntries(aggregators.byRetirer),
      byTimeframe: {
        daily: Array.from(aggregators.byTimeframe.daily.values()),
        monthly: Array.from(aggregators.byTimeframe.monthly.values()),
        yearly: Array.from(aggregators.byTimeframe.yearly.values())
      },
      byMethodology: Object.fromEntries(aggregators.byMethodology),
      trends: {
        growthRate: 0,
        averageRetirement: total.count > 0 ? (total.co2eAmount / total.count).toString() : '0',
        topRetirers: []
      }
    };
  }

  private mergeRetirementStats(results: RetirementStats[]): RetirementStats {
    // Merge multiple retirement stats results
    const merged: RetirementStats = {
      total: { count: 0, amount: '0', co2eAmount: '0', value: '0' },
      byProject: {},
      byRetirer: {},
      byTimeframe: { daily: [], monthly: [], yearly: [] },
      byMethodology: {},
      trends: { growthRate: 0, averageRetirement: '0', topRetirers: [] }
    };
    
    for (const result of results) {
      merged.total.count += result.total.count;
      merged.total.amount = (parseInt(merged.total.amount) + parseInt(result.total.amount)).toString();
      merged.total.co2eAmount = (parseInt(merged.total.co2eAmount) + parseInt(result.total.co2eAmount)).toString();
      merged.total.value = (parseFloat(merged.total.value) + parseFloat(result.total.value)).toFixed(2);
      
      // Merge other aggregations
      Object.assign(merged.byProject, result.byProject);
      Object.assign(merged.byRetirer, result.byRetirer);
      Object.assign(merged.byMethodology, result.byMethodology);
    }
    
    return merged;
  }

  private processBatch(batch: any[], options: AggregationOptions): RetirementStats {
    // Process a batch of retirement transactions
    return this.directAggregateRetirements(batch, options);
  }

  private processProjectChunk(chunk: ProjectData[], aggregators: any): void {
    for (const project of chunk) {
      aggregators.totalSupply += parseInt(project.totalSupply || '0');
      aggregators.totalRetired += parseInt(project.retired || '0');
      aggregators.totalValue += parseFloat(project.pricing.currentPrice || '0');
      
      // Update country aggregation
      const country = project.country || 'Unknown';
      if (!aggregators.byCountry.has(country)) {
        aggregators.byCountry.set(country, { count: 0, totalSupply: 0, totalRetired: 0 });
      }
      const countryData = aggregators.byCountry.get(country)!;
      countryData.count++;
      countryData.totalSupply += parseInt(project.totalSupply || '0');
      countryData.totalRetired += parseInt(project.retired || '0');
      
      // Update methodology aggregation
      const methodology = project.methodology || 'Unknown';
      if (!aggregators.byMethodology.has(methodology)) {
        aggregators.byMethodology.set(methodology, { count: 0, totalSupply: 0, totalRetired: 0 });
      }
      const methodologyData = aggregators.byMethodology.get(methodology)!;
      methodologyData.count++;
      methodologyData.totalSupply += parseInt(project.totalSupply || '0');
      methodologyData.totalRetired += parseInt(project.retired || '0');
      
      // Update vintage aggregation
      const vintage = project.vintage || 'Unknown';
      if (!aggregators.byVintage.has(vintage)) {
        aggregators.byVintage.set(vintage, { count: 0, totalSupply: 0, totalRetired: 0 });
      }
      const vintageData = aggregators.byVintage.get(vintage)!;
      vintageData.count++;
      vintageData.totalSupply += parseInt(project.totalSupply || '0');
      vintageData.totalRetired += parseInt(project.retired || '0');
    }
  }

  private finalizeProjectStats(aggregators: any): any {
    return {
      totalSupply: aggregators.totalSupply,
      totalRetired: aggregators.totalRetired,
      totalValue: aggregators.totalValue,
      byCountry: Object.fromEntries(aggregators.byCountry),
      byMethodology: Object.fromEntries(aggregators.byMethodology),
      byVintage: Object.fromEntries(aggregators.byVintage),
      averagePrice: aggregators.totalValue / (aggregators.byCountry.size || 1),
      utilizationRate: aggregators.totalSupply > 0 ? (aggregators.totalRetired / aggregators.totalSupply) * 100 : 0
    };
  }

  private processProjectBatch(batch: ProjectData[], options: AggregationOptions): any {
    return this.directAggregateProjects(batch, options);
  }

  private mergeProjectStats(results: any[]): any {
    const merged = {
      totalSupply: 0,
      totalRetired: 0,
      totalValue: 0,
      byCountry: {},
      byMethodology: {},
      byVintage: {},
      averagePrice: 0,
      utilizationRate: 0
    };
    
    for (const result of results) {
      merged.totalSupply += result.totalSupply;
      merged.totalRetired += result.totalRetired;
      merged.totalValue += result.totalValue;
      
      Object.assign(merged.byCountry, result.byCountry);
      Object.assign(merged.byMethodology, result.byMethodology);
      Object.assign(merged.byVintage, result.byVintage);
    }
    
    merged.averagePrice = merged.totalValue / Object.keys(merged.byCountry).length;
    merged.utilizationRate = merged.totalSupply > 0 ? (merged.totalRetired / merged.totalSupply) * 100 : 0;
    
    return merged;
  }

  private mergeAggregatorResults(aggregators: any, results: any[]): void {
    for (const result of results) {
      this.mergeAggregatorResult(aggregators, result);
    }
  }

  private mergeAggregatorResult(aggregators: any, result: any): void {
    // Merge a single result into the aggregators
    if (result.processed) {
      // Simple merge logic - extend as needed
      aggregators.totalProcessed = (aggregators.totalProcessed || 0) + result.processed;
    }
  }
}

// Export singleton instance
export const dataAggregationEngine = DataAggregationEngine.getInstance();

// Export utility functions
export const aggregateRetirements = async (
  retirements: RetirementTransaction[],
  options: AggregationOptions
): Promise<AggregationResult<RetirementStats>> => 
  dataAggregationEngine.aggregateRetirements(retirements, options);

export const aggregateProjects = async (
  projects: ProjectData[],
  options: AggregationOptions
): Promise<AggregationResult<any>> => 
  dataAggregationEngine.aggregateProjects(projects, options);

export const createTimeSeries = async <T>(
  data: T[],
  timeField: keyof T,
  valueField: keyof T,
  options: {
    interval: 'hour' | 'day' | 'week' | 'month';
    aggregationType: 'sum' | 'avg' | 'max' | 'min' | 'count';
    maxPoints?: number;
  }
): Promise<AggregationResult<TimeSeries<number>>> => 
  dataAggregationEngine.createTimeSeries(data, timeField, valueField, options);

export const calculateRealTimeStats = async (
  data: any[],
  windowSize?: number
): Promise<AggregationResult<any>> => 
  dataAggregationEngine.calculateRealTimeStats(data, windowSize);

export const getAggregationPerformanceMetrics = (): PerformanceMetrics => 
  dataAggregationEngine.getPerformanceMetrics();

export const optimizeAggregationPerformance = (): void => 
  dataAggregationEngine.optimizePerformance();

export const clearAggregationCache = (): void => 
  dataAggregationEngine.clearCache();