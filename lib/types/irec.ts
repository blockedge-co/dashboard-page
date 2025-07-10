// IREC Certificate TypeScript interfaces
// Data structures for IREC certificates with CO2e chain and Optimism integration

import type { ApiResponse, CacheConfig, ValidationResult } from "../types";

// ===============================
// IREC CERTIFICATE CORE INTERFACES
// ===============================

/**
 * IREC Certificate status types
 */
export type IrecCertificateStatus = 
  | "active"
  | "tokenized"
  | "retired"
  | "transferred"
  | "expired"
  | "revoked"
  | "pending";

/**
 * IREC Certificate types
 */
export type IrecCertificateType = 
  | "renewable_energy"
  | "carbon_offset"
  | "energy_efficiency"
  | "biofuel"
  | "waste_to_energy"
  | "other";

/**
 * Core IREC Certificate data structure
 */
export interface IrecCertificate {
  id: string;
  registryId: string;
  serialNumber: string;
  type: IrecCertificateType;
  status: IrecCertificateStatus;
  
  // Energy/Carbon Details
  energyAmount: string; // MWh for renewable energy
  carbonAmount: string; // tCO2e for carbon certificates
  unit: "MWh" | "tCO2e" | "GJ" | "other";
  
  // Certificate Metadata
  issuanceDate: string;
  expiryDate: string;
  vintage: string; // Production year
  country: string;
  region?: string;
  facility: {
    name: string;
    location: string;
    technology: string;
    capacity?: string;
  };
  
  // Ownership & Registry
  currentOwner: string;
  registryName: string;
  registryUrl?: string;
  
  // Blockchain Integration
  tokenAddress?: string;
  tokenId?: string;
  blockchainNetwork?: "ethereum" | "optimism" | "polygon" | "other";
  
  // Verification
  verification: {
    verifier: string;
    verificationDate: string;
    verificationStandard: string;
    documentHash?: string;
  };
  
  createdAt: string;
  updatedAt: string;
}

// ===============================
// CO2E CHAIN SUPPLY DATA
// ===============================

/**
 * CO2e Chain total supply data for IREC certificates
 */
export interface IrecSupplyData {
  certificateId: string;
  totalSupply: string;
  availableSupply: string;
  tokenizedSupply: string;
  retiredSupply: string;
  
  // Supply breakdown
  supplyBreakdown: {
    original: string;
    minted: string;
    burned: string;
    transferred: string;
  };
  
  // Token details
  tokenContract: {
    address: string;
    symbol: string;
    decimals: number;
    network: string;
  };
  
  // Market data
  marketData: {
    pricePerToken: string;
    pricePerMWh: string;
    currency: string;
    lastUpdated: string;
  };
  
  // Historical data
  supplyHistory: Array<{
    timestamp: string;
    totalSupply: string;
    availableSupply: string;
    action: "mint" | "burn" | "transfer" | "retire";
    amount: string;
    transactionHash: string;
  }>;
  
  lastUpdated: string;
}

// ===============================
// OPTIMISM TRANSACTION DATA
// ===============================

/**
 * Optimism transaction types for IREC certificates
 */
export type OptimismTransactionType = 
  | "tokenize"
  | "buy"
  | "sell"
  | "transfer"
  | "retire"
  | "redeem";

/**
 * Optimism transaction data for IREC certificates
 */
export interface IrecOptimismTransaction {
  id: string;
  transactionHash: string;
  blockNumber: number;
  blockTimestamp: string;
  
  // Transaction details
  type: OptimismTransactionType;
  certificateId: string;
  amount: string;
  amountInTokens: string;
  
  // Parties involved
  from: string;
  to: string;
  
  // Financial details
  pricePerToken: string;
  totalValue: string;
  currency: string;
  
  // Gas and fees
  gasUsed: string;
  gasPrice: string;
  transactionFee: string;
  
  // Contract details
  contractAddress: string;
  methodName: string;
  
  // Status
  status: "pending" | "confirmed" | "failed" | "reverted";
  
  // Metadata
  metadata: {
    purpose?: string;
    beneficiary?: string;
    notes?: string;
    batchId?: string;
  };
  
  createdAt: string;
}

/**
 * Optimism activity summary for IREC certificates
 */
export interface IrecOptimismActivity {
  certificateId: string;
  
  // Transaction counts
  totalTransactions: number;
  transactionsByType: Record<OptimismTransactionType, number>;
  
  // Volume data
  totalVolume: string;
  volumeByType: Record<OptimismTransactionType, string>;
  
  // Value data
  totalValue: string;
  valueByType: Record<OptimismTransactionType, string>;
  
  // Recent activity
  recentTransactions: IrecOptimismTransaction[];
  
  // Top participants
  topBuyers: Array<{
    address: string;
    volume: string;
    value: string;
    transactionCount: number;
  }>;
  
  topSellers: Array<{
    address: string;
    volume: string;
    value: string;
    transactionCount: number;
  }>;
  
  // Statistics
  statistics: {
    averageTransactionSize: string;
    averagePrice: string;
    medianPrice: string;
    priceRange: {
      min: string;
      max: string;
    };
    activityPeriod: {
      start: string;
      end: string;
    };
  };
  
  lastUpdated: string;
}

// ===============================
// COMBINED DATA STRUCTURES
// ===============================

/**
 * Complete IREC certificate data with all sources
 */
export interface IrecCertificateComplete extends IrecCertificate {
  supplyData: IrecSupplyData;
  optimismActivity: IrecOptimismActivity;
  
  // Calculated fields
  calculated: {
    utilizationRate: number; // Percentage of supply used
    liquidityScore: number; // Trading activity score
    priceStability: number; // Price volatility indicator
    marketCap: string; // Total market value
    averageTradeSize: string;
    activityScore: number; // Overall activity score
  };
  
  // Cross-chain data correlation
  correlation: {
    supplyVsActivity: number; // Correlation between supply and trading
    priceConsistency: number; // Price consistency across chains
    dataQuality: number; // Data quality score
    lastSyncTime: string;
  };
}

/**
 * IREC certificate listing with pagination
 */
export interface IrecCertificateList {
  certificates: IrecCertificateComplete[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  filters: {
    status?: IrecCertificateStatus[];
    type?: IrecCertificateType[];
    country?: string[];
    vintage?: string[];
    minAmount?: string;
    maxAmount?: string;
    priceRange?: {
      min: string;
      max: string;
    };
  };
  sorting: {
    field: string;
    direction: "asc" | "desc";
  };
}

// ===============================
// ANALYTICS AND STATISTICS
// ===============================

/**
 * IREC certificate analytics dashboard data
 */
export interface IrecAnalytics {
  overview: {
    totalCertificates: number;
    totalSupply: string;
    totalValue: string;
    activeMarkets: number;
    averagePrice: string;
  };
  
  // By status
  byStatus: Record<IrecCertificateStatus, {
    count: number;
    supply: string;
    value: string;
    percentage: number;
  }>;
  
  // By type
  byType: Record<IrecCertificateType, {
    count: number;
    supply: string;
    value: string;
    percentage: number;
  }>;
  
  // Geographic distribution
  byCountry: Record<string, {
    count: number;
    supply: string;
    value: string;
    percentage: number;
  }>;
  
  // Temporal data
  timeSeriesData: {
    daily: Array<{
      date: string;
      newCertificates: number;
      totalSupply: string;
      tradingVolume: string;
      averagePrice: string;
    }>;
    monthly: Array<{
      month: string;
      newCertificates: number;
      totalSupply: string;
      tradingVolume: string;
      averagePrice: string;
    }>;
  };
  
  // Market trends
  trends: {
    supplyGrowth: number;
    priceChange: number;
    volumeChange: number;
    marketCapChange: number;
    newCertificateRate: number;
  };
  
  // Top performers
  topPerformers: {
    mostTraded: IrecCertificateComplete[];
    highestValue: IrecCertificateComplete[];
    mostLiquid: IrecCertificateComplete[];
    recentlyAdded: IrecCertificateComplete[];
  };
  
  lastUpdated: string;
}

// ===============================
// API RESPONSE INTERFACES
// ===============================

/**
 * IREC certificate API responses
 */
export interface IrecCertificateResponse extends ApiResponse<IrecCertificate> {}
export interface IrecCertificateListResponse extends ApiResponse<IrecCertificateList> {}
export interface IrecSupplyResponse extends ApiResponse<IrecSupplyData> {}
export interface IrecOptimismResponse extends ApiResponse<IrecOptimismActivity> {}
export interface IrecAnalyticsResponse extends ApiResponse<IrecAnalytics> {}
export interface IrecCompleteResponse extends ApiResponse<IrecCertificateComplete> {}

// ===============================
// FILTER AND SEARCH INTERFACES
// ===============================

/**
 * IREC certificate search and filter options
 */
export interface IrecSearchFilters {
  query?: string;
  status?: IrecCertificateStatus[];
  type?: IrecCertificateType[];
  country?: string[];
  region?: string[];
  vintage?: string[];
  registryName?: string[];
  
  // Numerical filters
  minAmount?: string;
  maxAmount?: string;
  minPrice?: string;
  maxPrice?: string;
  
  // Date filters
  issuedAfter?: string;
  issuedBefore?: string;
  expiresAfter?: string;
  expiresBefore?: string;
  
  // Blockchain filters
  hasToken?: boolean;
  network?: string[];
  
  // Activity filters
  minTradingVolume?: string;
  maxTradingVolume?: string;
  hasRecentActivity?: boolean;
  
  // Sorting
  sortBy?: "issuanceDate" | "amount" | "price" | "volume" | "activity";
  sortOrder?: "asc" | "desc";
  
  // Pagination
  page?: number;
  pageSize?: number;
}

// ===============================
// CONSTANTS AND ENUMS
// ===============================

export const IREC_CERTIFICATE_STATUS = {
  ACTIVE: "active",
  TOKENIZED: "tokenized",
  RETIRED: "retired",
  TRANSFERRED: "transferred",
  EXPIRED: "expired",
  REVOKED: "revoked",
  PENDING: "pending",
} as const;

export const IREC_CERTIFICATE_TYPE = {
  RENEWABLE_ENERGY: "renewable_energy",
  CARBON_OFFSET: "carbon_offset",
  ENERGY_EFFICIENCY: "energy_efficiency",
  BIOFUEL: "biofuel",
  WASTE_TO_ENERGY: "waste_to_energy",
  OTHER: "other",
} as const;

export const OPTIMISM_TRANSACTION_TYPE = {
  TOKENIZE: "tokenize",
  BUY: "buy",
  SELL: "sell",
  TRANSFER: "transfer",
  RETIRE: "retire",
  REDEEM: "redeem",
} as const;

export const IREC_UNITS = {
  MWH: "MWh",
  TCO2E: "tCO2e",
  GJ: "GJ",
  OTHER: "other",
} as const;

export const BLOCKCHAIN_NETWORKS = {
  ETHEREUM: "ethereum",
  OPTIMISM: "optimism",
  POLYGON: "polygon",
  OTHER: "other",
} as const;

// Default cache configurations for IREC data
export const IREC_CACHE_CONFIGS = {
  certificates: {
    key: "irec-certificates",
    ttl: 5 * 60 * 1000, // 5 minutes
    strategy: "ttl" as const,
    maxSize: 200,
  },
  supply: {
    key: "irec-supply",
    ttl: 2 * 60 * 1000, // 2 minutes
    strategy: "ttl" as const,
    maxSize: 100,
  },
  optimism: {
    key: "irec-optimism",
    ttl: 1 * 60 * 1000, // 1 minute
    strategy: "ttl" as const,
    maxSize: 500,
  },
  analytics: {
    key: "irec-analytics",
    ttl: 3 * 60 * 1000, // 3 minutes
    strategy: "ttl" as const,
    maxSize: 50,
  },
} as const;

// Export utility types
export type IrecCertificateId = string & { __brand: "IrecCertificateId" };
export type IrecRegistryId = string & { __brand: "IrecRegistryId" };
export type IrecSerialNumber = string & { __brand: "IrecSerialNumber" };
export type OptimismTransactionHash = string & { __brand: "OptimismTransactionHash" };