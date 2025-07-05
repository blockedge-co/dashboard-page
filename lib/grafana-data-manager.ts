// Comprehensive data management layer for Grafana-style dashboard
// Supports retirement by payment method, tokenization metrics, and real-time statistics

import type { ProjectData } from "./co2e-api";
import type { 
  RetirementTransaction, 
  RetirementStats, 
  MarketData, 
  PriceDataPoint,
  ValidationResult 
} from "./types";
import { retirementDataGenerator } from "./retirement-data-generator";

// Enhanced interfaces for Grafana-style dashboard
export interface PaymentMethodData {
  aisPoint: {
    count: number;
    amount: string;
    co2eAmount: string;
    percentage: number;
    avgTransactionSize: number;
    trend: number; // 24h change
  };
  fiat: {
    count: number;
    amount: string;
    co2eAmount: string;
    percentage: number;
    avgTransactionSize: number;
    trend: number;
  };
  crypto: {
    count: number;
    amount: string;
    co2eAmount: string;
    percentage: number;
    avgTransactionSize: number;
    trend: number;
  };
  other: {
    count: number;
    amount: string;
    co2eAmount: string;
    percentage: number;
    avgTransactionSize: number;
    trend: number;
  };
}

export interface TokenizationMetrics {
  totalTokenized: string;
  tokenizationRate: number; // tokens per day
  averageTokenSize: number;
  tokenizationTrend: number; // 7-day change
  projectsTokenized: number;
  pendingTokenization: string;
  tokenizationHistory: Array<{
    date: string;
    amount: string;
    count: number;
    projects: string[];
  }>;
  topTokenizers: Array<{
    address: string;
    name?: string;
    amount: string;
    count: number;
    percentage: number;
  }>;
}

export interface RealTimeStats {
  activeRetirements: number;
  retirementRate: number; // per hour
  avgRetirementSize: number;
  totalValueLocked: string;
  networkActivity: {
    transactionsPerHour: number;
    gasUsageAvg: number;
    successRate: number;
  };
  marketMetrics: {
    totalMarketCap: string;
    totalVolume24h: string;
    avgPrice: number;
    priceVolatility: number;
  };
  timestamp: string;
}

export interface GrafanaDataset {
  projects: ProjectData[];
  retirements: RetirementTransaction[];
  paymentMethods: PaymentMethodData;
  tokenization: TokenizationMetrics;
  realTimeStats: RealTimeStats;
  marketData: MarketData[];
  priceHistory: PriceDataPoint[];
  aggregatedStats: {
    totalProjects: number;
    totalRetirements: number;
    totalCO2eRetired: string;
    totalValueRetired: string;
    averageProjectSize: number;
    retirementGrowthRate: number;
  };
  lastUpdated: string;
}

export class GrafanaDataManager {
  private static instance: GrafanaDataManager;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private refreshIntervals: Map<string, NodeJS.Timeout> = new Map();

  // Payment method configuration
  private readonly PAYMENT_METHODS = {
    AIS_POINT: 'aisPoint',
    FIAT: 'fiat',
    CRYPTO: 'crypto',
    OTHER: 'other'
  } as const;

  // Cache TTL configurations (in milliseconds)
  private readonly CACHE_TTL = {
    REAL_TIME: 30 * 1000,        // 30 seconds
    PAYMENT_METHODS: 2 * 60 * 1000,  // 2 minutes
    TOKENIZATION: 5 * 60 * 1000,     // 5 minutes
    HISTORICAL: 15 * 60 * 1000,      // 15 minutes
    MARKET_DATA: 1 * 60 * 1000,      // 1 minute
  };

  private constructor() {}

  static getInstance(): GrafanaDataManager {
    if (!GrafanaDataManager.instance) {
      GrafanaDataManager.instance = new GrafanaDataManager();
    }
    return GrafanaDataManager.instance;
  }

  /**
   * Generate comprehensive dataset for Grafana-style dashboard
   */
  async generateGrafanaDataset(projects: ProjectData[]): Promise<GrafanaDataset> {
    const cacheKey = 'grafana_dataset';
    const cached = this.getCachedData(cacheKey, this.CACHE_TTL.REAL_TIME);
    
    if (cached) {
      return cached;
    }

    console.log('📊 Generating comprehensive Grafana dataset...');
    
    // Generate retirement data for all projects
    const allRetirements: RetirementTransaction[] = [];
    const marketDataList: MarketData[] = [];
    const priceHistoryList: PriceDataPoint[] = [];

    for (const project of projects) {
      const retirements = retirementDataGenerator.generateProjectRetirements(project, {
        count: this.calculateRetirementCount(project),
        timeframeDays: 90,
        includeHistorical: true
      });
      allRetirements.push(...retirements);

      // Generate market data
      const marketData = retirementDataGenerator.generateMarketData(project, retirements);
      marketDataList.push(marketData);

      // Generate price history
      const priceHistory = retirementDataGenerator.generatePriceHistory(project, retirements, 30);
      priceHistoryList.push(...priceHistory);
    }

    // Generate enhanced datasets
    const dataset: GrafanaDataset = {
      projects,
      retirements: allRetirements,
      paymentMethods: this.generatePaymentMethodData(allRetirements),
      tokenization: this.generateTokenizationMetrics(projects, allRetirements),
      realTimeStats: this.generateRealTimeStats(allRetirements, marketDataList),
      marketData: marketDataList,
      priceHistory: priceHistoryList,
      aggregatedStats: this.calculateAggregatedStats(projects, allRetirements),
      lastUpdated: new Date().toISOString()
    };

    // Cache the dataset
    this.setCachedData(cacheKey, dataset, this.CACHE_TTL.REAL_TIME);
    
    console.log(`✅ Generated dataset: ${projects.length} projects, ${allRetirements.length} retirements`);
    
    return dataset;
  }

  /**
   * Generate payment method distribution data
   */
  private generatePaymentMethodData(retirements: RetirementTransaction[]): PaymentMethodData {
    const cacheKey = 'payment_methods';
    const cached = this.getCachedData(cacheKey, this.CACHE_TTL.PAYMENT_METHODS);
    
    if (cached) {
      return cached;
    }

    // Simulate payment method distribution based on retirement patterns
    const paymentMethodDistribution = this.simulatePaymentMethodDistribution(retirements);
    
    const totalRetirements = retirements.length;
    const totalAmount = retirements.reduce((sum, r) => sum + parseInt(r.amountCO2e), 0);

    const paymentData: PaymentMethodData = {
      aisPoint: {
        count: paymentMethodDistribution.aisPoint.count,
        amount: paymentMethodDistribution.aisPoint.amount.toString(),
        co2eAmount: paymentMethodDistribution.aisPoint.co2eAmount.toString(),
        percentage: (paymentMethodDistribution.aisPoint.count / totalRetirements) * 100,
        avgTransactionSize: paymentMethodDistribution.aisPoint.avgSize,
        trend: this.calculatePaymentMethodTrend('aisPoint', retirements)
      },
      fiat: {
        count: paymentMethodDistribution.fiat.count,
        amount: paymentMethodDistribution.fiat.amount.toString(),
        co2eAmount: paymentMethodDistribution.fiat.co2eAmount.toString(),
        percentage: (paymentMethodDistribution.fiat.count / totalRetirements) * 100,
        avgTransactionSize: paymentMethodDistribution.fiat.avgSize,
        trend: this.calculatePaymentMethodTrend('fiat', retirements)
      },
      crypto: {
        count: paymentMethodDistribution.crypto.count,
        amount: paymentMethodDistribution.crypto.amount.toString(),
        co2eAmount: paymentMethodDistribution.crypto.co2eAmount.toString(),
        percentage: (paymentMethodDistribution.crypto.count / totalRetirements) * 100,
        avgTransactionSize: paymentMethodDistribution.crypto.avgSize,
        trend: this.calculatePaymentMethodTrend('crypto', retirements)
      },
      other: {
        count: paymentMethodDistribution.other.count,
        amount: paymentMethodDistribution.other.amount.toString(),
        co2eAmount: paymentMethodDistribution.other.co2eAmount.toString(),
        percentage: (paymentMethodDistribution.other.count / totalRetirements) * 100,
        avgTransactionSize: paymentMethodDistribution.other.avgSize,
        trend: this.calculatePaymentMethodTrend('other', retirements)
      }
    };

    this.setCachedData(cacheKey, paymentData, this.CACHE_TTL.PAYMENT_METHODS);
    return paymentData;
  }

  /**
   * Generate tokenization metrics
   */
  private generateTokenizationMetrics(
    projects: ProjectData[], 
    retirements: RetirementTransaction[]
  ): TokenizationMetrics {
    const cacheKey = 'tokenization_metrics';
    const cached = this.getCachedData(cacheKey, this.CACHE_TTL.TOKENIZATION);
    
    if (cached) {
      return cached;
    }

    const totalTokenized = projects.reduce((sum, p) => sum + parseInt(p.totalSupply || '0'), 0);
    const totalRetired = retirements.reduce((sum, r) => sum + parseInt(r.amountCO2e), 0);
    const projectsTokenized = projects.length;

    // Calculate tokenization rate (tokens per day over last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentRetirements = retirements.filter(r => 
      new Date(r.retirementDate) >= thirtyDaysAgo
    );
    
    const tokenizationRate = recentRetirements.length / 30; // per day

    // Generate tokenization history
    const tokenizationHistory = this.generateTokenizationHistory(projects, retirements);

    // Calculate top tokenizers
    const topTokenizers = this.calculateTopTokenizers(retirements);

    const metrics: TokenizationMetrics = {
      totalTokenized: totalTokenized.toString(),
      tokenizationRate: tokenizationRate,
      averageTokenSize: totalTokenized / projectsTokenized,
      tokenizationTrend: this.calculateTokenizationTrend(tokenizationHistory),
      projectsTokenized: projectsTokenized,
      pendingTokenization: Math.floor(totalTokenized * 0.05).toString(), // 5% pending
      tokenizationHistory,
      topTokenizers
    };

    this.setCachedData(cacheKey, metrics, this.CACHE_TTL.TOKENIZATION);
    return metrics;
  }

  /**
   * Generate real-time statistics
   */
  private generateRealTimeStats(
    retirements: RetirementTransaction[],
    marketData: MarketData[]
  ): RealTimeStats {
    const cacheKey = 'real_time_stats';
    const cached = this.getCachedData(cacheKey, this.CACHE_TTL.REAL_TIME);
    
    if (cached) {
      return cached;
    }

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const recentRetirements = retirements.filter(r => 
      new Date(r.retirementDate) >= oneHourAgo
    );

    // Calculate network activity
    const avgGasUsage = retirements.reduce((sum, r) => 
      sum + parseInt(r.gasUsed || '0'), 0
    ) / retirements.length;

    const successRate = retirements.filter(r => r.status === 'confirmed').length / retirements.length;

    // Calculate market metrics
    const totalMarketCap = marketData.reduce((sum, m) => sum + (m.pricing.marketCap || 0), 0);
    const totalVolume24h = marketData.reduce((sum, m) => sum + m.pricing.volume24h, 0);
    const avgPrice = marketData.reduce((sum, m) => sum + m.pricing.current, 0) / marketData.length;
    const priceVolatility = this.calculatePriceVolatility(marketData);

    const stats: RealTimeStats = {
      activeRetirements: recentRetirements.length,
      retirementRate: recentRetirements.length, // per hour
      avgRetirementSize: recentRetirements.length > 0 ? 
        recentRetirements.reduce((sum, r) => sum + parseInt(r.amountCO2e), 0) / recentRetirements.length : 0,
      totalValueLocked: marketData.reduce((sum, m) => sum + parseFloat(m.liquidity.locked || '0'), 0).toFixed(2),
      networkActivity: {
        transactionsPerHour: recentRetirements.length,
        gasUsageAvg: avgGasUsage,
        successRate: successRate * 100
      },
      marketMetrics: {
        totalMarketCap: totalMarketCap.toFixed(2),
        totalVolume24h: totalVolume24h.toFixed(2),
        avgPrice: avgPrice,
        priceVolatility: priceVolatility
      },
      timestamp: new Date().toISOString()
    };

    this.setCachedData(cacheKey, stats, this.CACHE_TTL.REAL_TIME);
    return stats;
  }

  /**
   * Simulate payment method distribution
   */
  private simulatePaymentMethodDistribution(retirements: RetirementTransaction[]) {
    const distribution = {
      aisPoint: { count: 0, amount: 0, co2eAmount: 0, avgSize: 0 },
      fiat: { count: 0, amount: 0, co2eAmount: 0, avgSize: 0 },
      crypto: { count: 0, amount: 0, co2eAmount: 0, avgSize: 0 },
      other: { count: 0, amount: 0, co2eAmount: 0, avgSize: 0 }
    };

    // Simulate realistic payment method distribution
    // AIS Point: 45%, Fiat: 30%, Crypto: 20%, Other: 5%
    const paymentMethodWeights = [0.45, 0.30, 0.20, 0.05];
    const paymentMethods = ['aisPoint', 'fiat', 'crypto', 'other'] as const;

    for (const retirement of retirements) {
      const hash = this.hashString(retirement.id);
      const methodIndex = this.weightedRandomSelection(paymentMethodWeights, hash);
      const method = paymentMethods[methodIndex];
      
      const amount = parseInt(retirement.amount);
      const co2eAmount = parseInt(retirement.amountCO2e);
      
      distribution[method].count++;
      distribution[method].amount += amount;
      distribution[method].co2eAmount += co2eAmount;
    }

    // Calculate average sizes
    for (const method of paymentMethods) {
      if (distribution[method].count > 0) {
        distribution[method].avgSize = distribution[method].co2eAmount / distribution[method].count;
      }
    }

    return distribution;
  }

  /**
   * Calculate payment method trend
   */
  private calculatePaymentMethodTrend(method: string, retirements: RetirementTransaction[]): number {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const recentRetirements = retirements.filter(r => {
      const date = new Date(r.retirementDate);
      return date >= yesterday;
    });

    const previousRetirements = retirements.filter(r => {
      const date = new Date(r.retirementDate);
      return date >= twoDaysAgo && date < yesterday;
    });

    // Simulate method usage based on retirement patterns
    const recentCount = Math.floor(recentRetirements.length * this.getMethodWeight(method));
    const previousCount = Math.floor(previousRetirements.length * this.getMethodWeight(method));

    if (previousCount === 0) return 0;
    return ((recentCount - previousCount) / previousCount) * 100;
  }

  /**
   * Get method weight for distribution
   */
  private getMethodWeight(method: string): number {
    const weights = {
      'aisPoint': 0.45,
      'fiat': 0.30,
      'crypto': 0.20,
      'other': 0.05
    };
    return weights[method as keyof typeof weights] || 0.05;
  }

  /**
   * Generate tokenization history
   */
  private generateTokenizationHistory(
    projects: ProjectData[], 
    retirements: RetirementTransaction[]
  ): Array<{ date: string; amount: string; count: number; projects: string[] }> {
    const history: Record<string, { date: string; amount: number; count: number; projects: Set<string> }> = {};

    // Group retirements by date
    for (const retirement of retirements) {
      const date = new Date(retirement.retirementDate).toISOString().split('T')[0];
      if (!history[date]) {
        history[date] = { date, amount: 0, count: 0, projects: new Set() };
      }
      history[date].amount += parseInt(retirement.amountCO2e);
      history[date].count++;
      history[date].projects.add(retirement.projectId);
    }

    return Object.values(history)
      .map(h => ({
        date: h.date,
        amount: h.amount.toString(),
        count: h.count,
        projects: Array.from(h.projects)
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 30); // Last 30 days
  }

  /**
   * Calculate top tokenizers
   */
  private calculateTopTokenizers(retirements: RetirementTransaction[]): Array<{
    address: string;
    name?: string;
    amount: string;
    count: number;
    percentage: number;
  }> {
    const tokenizers: Record<string, { address: string; name?: string; amount: number; count: number }> = {};
    const totalAmount = retirements.reduce((sum, r) => sum + parseInt(r.amountCO2e), 0);

    for (const retirement of retirements) {
      const address = retirement.retiredBy.address;
      if (!tokenizers[address]) {
        tokenizers[address] = {
          address,
          name: retirement.retiredBy.name,
          amount: 0,
          count: 0
        };
      }
      tokenizers[address].amount += parseInt(retirement.amountCO2e);
      tokenizers[address].count++;
    }

    return Object.values(tokenizers)
      .map(t => ({
        ...t,
        amount: t.amount.toString(),
        percentage: (t.amount / totalAmount) * 100
      }))
      .sort((a, b) => parseInt(b.amount) - parseInt(a.amount))
      .slice(0, 10); // Top 10
  }

  /**
   * Calculate tokenization trend
   */
  private calculateTokenizationTrend(history: Array<{ date: string; amount: string; count: number }>): number {
    if (history.length < 7) return 0;

    const recent7Days = history.slice(0, 7);
    const previous7Days = history.slice(7, 14);

    const recentTotal = recent7Days.reduce((sum, h) => sum + parseInt(h.amount), 0);
    const previousTotal = previous7Days.reduce((sum, h) => sum + parseInt(h.amount), 0);

    if (previousTotal === 0) return 0;
    return ((recentTotal - previousTotal) / previousTotal) * 100;
  }

  /**
   * Calculate aggregated statistics
   */
  private calculateAggregatedStats(
    projects: ProjectData[], 
    retirements: RetirementTransaction[]
  ): GrafanaDataset['aggregatedStats'] {
    const totalCO2eRetired = retirements.reduce((sum, r) => sum + parseInt(r.amountCO2e), 0);
    const totalValueRetired = retirements.reduce((sum, r) => {
      const price = parseFloat((r.metadata as any)?.price || '40');
      return sum + (parseInt(r.amountCO2e) * price);
    }, 0);

    const averageProjectSize = projects.reduce((sum, p) => sum + parseInt(p.totalSupply || '0'), 0) / projects.length;

    // Calculate retirement growth rate (monthly)
    const now = new Date();
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const recentRetirements = retirements.filter(r => new Date(r.retirementDate) >= lastMonth);
    const previousRetirements = retirements.filter(r => {
      const date = new Date(r.retirementDate);
      return date >= twoMonthsAgo && date < lastMonth;
    });

    const growthRate = previousRetirements.length > 0 ? 
      ((recentRetirements.length - previousRetirements.length) / previousRetirements.length) * 100 : 0;

    return {
      totalProjects: projects.length,
      totalRetirements: retirements.length,
      totalCO2eRetired: totalCO2eRetired.toString(),
      totalValueRetired: totalValueRetired.toFixed(2),
      averageProjectSize: Math.floor(averageProjectSize),
      retirementGrowthRate: parseFloat(growthRate.toFixed(2))
    };
  }

  /**
   * Calculate price volatility
   */
  private calculatePriceVolatility(marketData: MarketData[]): number {
    const prices = marketData.map(m => m.pricing.current);
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    
    const variance = prices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / prices.length;
    return Math.sqrt(variance) / avgPrice * 100; // Coefficient of variation as percentage
  }

  /**
   * Calculate realistic retirement count based on project characteristics
   */
  private calculateRetirementCount(project: ProjectData): number {
    const retiredAmount = parseInt(project.retired || '0');
    const projectHash = this.hashString(project.id);
    
    // Base count on project size and characteristics
    let baseCount = 8;
    if (retiredAmount > 100000) baseCount = 20;
    if (retiredAmount > 500000) baseCount = 35;
    if (retiredAmount > 1000000) baseCount = 50;
    
    // Add variation based on project hash
    const variation = (projectHash % 15) - 7; // -7 to +7
    return Math.max(5, baseCount + variation);
  }

  /**
   * Setup automatic data refresh
   */
  setupAutoRefresh(intervalMs: number = 60000): void {
    if (this.refreshIntervals.has('main')) {
      clearInterval(this.refreshIntervals.get('main')!);
    }

    const interval = setInterval(() => {
      this.cache.clear();
      console.log('🔄 Auto-refreshed Grafana data cache');
    }, intervalMs);

    this.refreshIntervals.set('main', interval);
  }

  /**
   * Stop automatic refresh
   */
  stopAutoRefresh(): void {
    this.refreshIntervals.forEach(interval => clearInterval(interval));
    this.refreshIntervals.clear();
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cache.clear();
    console.log('🧹 Cleared all cached data');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[]; totalMemory: number } {
    const keys = Array.from(this.cache.keys());
    const totalMemory = keys.reduce((sum, key) => {
      const entry = this.cache.get(key);
      return sum + (entry ? JSON.stringify(entry.data).length : 0);
    }, 0);

    return {
      size: this.cache.size,
      keys,
      totalMemory
    };
  }

  // Utility methods
  private getCachedData(key: string, ttl: number): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  private weightedRandomSelection(weights: number[], seed: number): number {
    const random = this.seededRandom(seed);
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random <= sum) {
        return i;
      }
    }
    return weights.length - 1;
  }

  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
}

// Export singleton instance
export const grafanaDataManager = GrafanaDataManager.getInstance();

// Export utility functions
export const generateGrafanaDataset = async (projects: ProjectData[]): Promise<GrafanaDataset> => 
  grafanaDataManager.generateGrafanaDataset(projects);

export const setupGrafanaAutoRefresh = (intervalMs?: number): void => 
  grafanaDataManager.setupAutoRefresh(intervalMs);

export const stopGrafanaAutoRefresh = (): void => 
  grafanaDataManager.stopAutoRefresh();

export const clearGrafanaCache = (): void => 
  grafanaDataManager.clearCache();

export const getGrafanaCacheStats = () => 
  grafanaDataManager.getCacheStats();