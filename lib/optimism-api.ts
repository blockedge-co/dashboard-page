import { IREC_CACHE_CONFIGS } from "./types/irec";
import { irecMockDataGenerator } from "./services/irec-mock-data";
import type {
  IrecOptimismTransaction,
  IrecOptimismActivity,
  OptimismTransactionType,
  OptimismTransactionHash,
} from "./types/irec";

/**
 * Optimism API service using mock data for IREC certificate buy/tokenize operations
 */
class OptimismApiService {
  private transactionCache = new Map<string, { data: IrecOptimismTransaction[]; timestamp: number }>();
  private activityCache = new Map<string, { data: IrecOptimismActivity; timestamp: number }>();
  private batchCache = new Map<string, { data: any; timestamp: number }>();

  /**
   * Check cache validity
   */
  private isCacheValid(timestamp: number, ttl: number): boolean {
    return Date.now() - timestamp < ttl;
  }

  /**
   * Fetch IREC certificate transactions using mock data generator
   */
  async fetchCertificateTransactions(certificateId: string): Promise<IrecOptimismTransaction[]> {
    const cacheKey = `transactions-${certificateId}`;
    const cached = this.transactionCache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached.timestamp, IREC_CACHE_CONFIGS.optimism.ttl)) {
      console.log(`✅ Using cached transactions for certificate ${certificateId}`);
      return cached.data;
    }

    try {
      console.log(`🔍 Generating mock Optimism transactions for IREC certificate ${certificateId}`);
      
      // Generate mock transactions using the mock data generator
      const energyAmount = Math.floor(Math.random() * 100000) + 10000; // 10,000 to 110,000 MWh
      const transactionCount = Math.floor(Math.random() * 50) + 5; // 5-55 transactions
      
      const mockTransactions: IrecOptimismTransaction[] = [];
      for (let i = 0; i < transactionCount; i++) {
        const transaction = irecMockDataGenerator.generateOptimismTransaction(certificateId, energyAmount);
        mockTransactions.push(transaction);
      }

      // Sort by block number descending (most recent first)
      mockTransactions.sort((a, b) => b.blockNumber - a.blockNumber);

      // Cache results
      this.transactionCache.set(cacheKey, {
        data: mockTransactions,
        timestamp: Date.now(),
      });

      console.log(`✅ Successfully generated ${mockTransactions.length} mock transactions for certificate ${certificateId}`);
      return mockTransactions;
    } catch (error) {
      console.error(`❌ Error generating transactions for certificate ${certificateId}:`, error);
      return [];
    }
  }


  /**
   * Fetch activity summary for a certificate using mock data
   */
  async fetchCertificateActivity(certificateId: string): Promise<IrecOptimismActivity> {
    const cacheKey = `activity-${certificateId}`;
    const cached = this.activityCache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached.timestamp, IREC_CACHE_CONFIGS.optimism.ttl)) {
      return cached.data;
    }

    try {
      console.log(`🔍 Generating mock activity for IREC certificate ${certificateId}`);
      
      // Generate mock activity data using the mock data generator
      const energyAmount = Math.floor(Math.random() * 100000) + 10000; // 10,000 to 110,000 MWh
      const activity = irecMockDataGenerator.generateOptimismActivity(certificateId, energyAmount);
      
      this.activityCache.set(cacheKey, {
        data: activity,
        timestamp: Date.now(),
      });
      
      console.log(`✅ Successfully generated mock activity for certificate ${certificateId}`);
      return activity;
    } catch (error) {
      console.error(`❌ Error generating activity for ${certificateId}:`, error);
      return this.createEmptyActivity(certificateId);
    }
  }


  /**
   * Create empty activity when no data is available
   */
  private createEmptyActivity(certificateId: string): IrecOptimismActivity {
    return {
      certificateId,
      totalTransactions: 0,
      transactionsByType: {
        tokenize: 0,
        buy: 0,
        sell: 0,
        transfer: 0,
        retire: 0,
        redeem: 0,
      },
      totalVolume: "0",
      volumeByType: {
        tokenize: "0",
        buy: "0",
        sell: "0",
        transfer: "0",
        retire: "0",
        redeem: "0",
      },
      totalValue: "0",
      valueByType: {
        tokenize: "0",
        buy: "0",
        sell: "0",
        transfer: "0",
        retire: "0",
        redeem: "0",
      },
      recentTransactions: [],
      topBuyers: [],
      topSellers: [],
      statistics: {
        averageTransactionSize: "0",
        averagePrice: "0.00",
        medianPrice: "0.00",
        priceRange: {
          min: "0.00",
          max: "0.00",
        },
        activityPeriod: {
          start: new Date().toISOString(),
          end: new Date().toISOString(),
        },
      },
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.transactionCache.clear();
    this.activityCache.clear();
    this.batchCache.clear();
    console.log("✅ Optimism API cache cleared");
  }

  /**
   * Get cache stats
   */
  getCacheStats(): {
    transactions: number;
    activities: number;
    batch: number;
  } {
    return {
      transactions: this.transactionCache.size,
      activities: this.activityCache.size,
      batch: this.batchCache.size,
    };
  }
}

// Export service instance
export const optimismApiService = new OptimismApiService();

// Export helper functions
export async function fetchIrecOptimismTransactions(certificateId: string): Promise<IrecOptimismTransaction[]> {
  return optimismApiService.fetchCertificateTransactions(certificateId);
}

export async function fetchIrecOptimismActivity(certificateId: string): Promise<IrecOptimismActivity> {
  return optimismApiService.fetchCertificateActivity(certificateId);
}