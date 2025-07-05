// Extended TypeScript interfaces for carbon credit retirement and data structures
// Extends existing types from co2e-api.ts while adding retirement-specific patterns

import type { ProjectData, ProjectsResponse, BlockData, TransactionData, StatsData } from "./co2e-api";

// ===============================
// RETIREMENT DATA INTERFACES
// ===============================

/**
 * Payment method types for credit retirement
 */
export type PaymentMethod = 
  | "ais_points"
  | "fiat_usd"
  | "fiat_eur"
  | "fiat_other"
  | "crypto_eth"
  | "crypto_btc"
  | "crypto_usdc"
  | "crypto_usdt"
  | "crypto_other"
  | "bank_transfer"
  | "credit_card"
  | "paypal"
  | "other";

/**
 * Payment details for retirement transaction
 */
export interface PaymentDetails {
  method: PaymentMethod;
  amount: string; // Amount paid in payment currency
  currency: string; // Payment currency (USD, EUR, ETH, etc.)
  exchangeRate?: number; // Exchange rate to USD at time of payment
  usdValue: string; // USD equivalent value
  provider?: string; // Payment provider (Stripe, PayPal, etc.)
  transactionId?: string; // External payment transaction ID
  fees?: {
    amount: string;
    currency: string;
    type: "gas" | "platform" | "payment_processor" | "other";
  }[];
  metadata?: {
    processingTime?: number;
    confirmations?: number;
    paymentAddress?: string;
    additionalData?: Record<string, any>;
  };
}

/**
 * Carbon credit retirement transaction
 */
export interface RetirementTransaction {
  id: string;
  transactionHash: string;
  projectId: string;
  projectName: string;
  tokenAddress: string;
  certContract?: string;
  amount: string; // Amount of credits retired (in tokens)
  amountCO2e: string; // CO2e equivalent amount
  retiredBy: {
    address: string;
    name?: string;
    type: "individual" | "corporation" | "institution" | "registry";
  };
  beneficiary?: {
    name: string;
    purpose: string;
    description?: string;
  };
  payment: PaymentDetails; // Payment information
  retirementDate: string;
  vintage: string; // Year of carbon reduction
  methodology: string;
  registry: string;
  serialNumbers?: string[]; // Credit serial numbers if available
  certificate?: {
    url?: string;
    hash?: string;
    issued: boolean;
  };
  status: "pending" | "confirmed" | "failed" | "cancelled";
  blockNumber?: number;
  gasUsed?: string;
  gasPrice?: string;
  metadata?: {
    reason?: string;
    notes?: string;
    location?: string;
    additionalData?: Record<string, any>;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Retirement statistics and aggregations
 */
export interface RetirementStats {
  total: {
    count: number;
    amount: string; // Total tokens retired
    co2eAmount: string; // Total CO2e retired
    value: string; // Total USD value retired
  };
  byProject: Record<string, {
    count: number;
    amount: string;
    co2eAmount: string;
    percentage: number;
  }>;
  byRetirer: Record<string, {
    count: number;
    amount: string;
    co2eAmount: string;
    name?: string;
    type: "individual" | "corporation" | "institution" | "registry";
  }>;
  byPaymentMethod: Record<PaymentMethod, {
    count: number;
    amount: string;
    co2eAmount: string;
    usdValue: string;
    percentage: number;
    averageAmount: string;
    trend: {
      growthRate: number;
      changeFromPrevious: number;
    };
  }>;
  byTimeframe: {
    daily: Array<{
      date: string;
      count: number;
      amount: string;
      co2eAmount: string;
      byPaymentMethod: Record<PaymentMethod, {
        count: number;
        amount: string;
        usdValue: string;
      }>;
    }>;
    monthly: Array<{
      month: string;
      count: number;
      amount: string;
      co2eAmount: string;
      byPaymentMethod: Record<PaymentMethod, {
        count: number;
        amount: string;
        usdValue: string;
      }>;
    }>;
    yearly: Array<{
      year: string;
      count: number;
      amount: string;
      co2eAmount: string;
      byPaymentMethod: Record<PaymentMethod, {
        count: number;
        amount: string;
        usdValue: string;
      }>;
    }>;
  };
  byMethodology: Record<string, {
    count: number;
    amount: string;
    co2eAmount: string;
    percentage: number;
  }>;
  trends: {
    growthRate: number; // Monthly growth rate
    averageRetirement: string; // Average retirement amount
    topRetirers: Array<{
      address: string;
      name?: string;
      amount: string;
      count: number;
    }>;
    paymentMethodTrends: {
      mostPopular: PaymentMethod;
      fastestGrowing: PaymentMethod;
      aisPointsUsage: {
        percentage: number;
        trend: number;
      };
      cryptoAdoption: {
        percentage: number;
        trend: number;
      };
    };
  };
}

/**
 * Extended project data with retirement information
 */
export interface ProjectWithRetirements extends ProjectData {
  retirements: {
    total: {
      count: number;
      amount: string;
      co2eAmount: string;
      percentage: number; // Percentage of total supply retired
    };
    recent: RetirementTransaction[];
    topRetirers: Array<{
      address: string;
      name?: string;
      amount: string;
      count: number;
    }>;
    retirementHistory: Array<{
      date: string;
      amount: string;
      count: number;
    }>;
  };
  availability: {
    totalSupply: string;
    availableSupply: string;
    retiredSupply: string;
    reservedSupply?: string;
    burnedSupply?: string;
  };
}

// ===============================
// DATA VALIDATION INTERFACES
// ===============================

/**
 * Data validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  metadata?: {
    validatedAt: string;
    validatorVersion: string;
    schemaVersion: string;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: "error" | "critical";
  suggestions?: string[];
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  severity: "warning" | "info";
}

// ===============================
// CACHING INTERFACES
// ===============================

/**
 * Cache configuration and management
 */
export interface CacheConfig {
  key: string;
  ttl: number; // Time to live in milliseconds
  refreshThreshold?: number; // Refresh when TTL is under this threshold
  maxSize?: number; // Maximum cache entries
  strategy: "lru" | "fifo" | "ttl";
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
  accessCount: number;
  lastAccessed: number;
  metadata?: {
    source: string;
    version: string;
    tags?: string[];
  };
}

export interface CacheStats {
  size: number;
  maxSize: number;
  hitRate: number;
  missRate: number;
  evictions: number;
  totalRequests: number;
  lastCleanup: number;
}

// ===============================
// API RESPONSE INTERFACES
// ===============================

/**
 * Standardized API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    requestId?: string;
    version: string;
    cached?: boolean;
    processingTime?: number;
  };
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * Retirement data API responses
 */
export interface RetirementApiResponse extends ApiResponse<RetirementTransaction[]> {
  stats?: RetirementStats;
}

export interface ProjectRetirementResponse extends ApiResponse<ProjectWithRetirements> {}

export interface RetirementStatsResponse extends ApiResponse<RetirementStats> {}

// ===============================
// BLOCKCHAIN DATA INTERFACES
// ===============================

/**
 * Enhanced blockchain transaction data with retirement context
 */
export interface RetirementTransactionData extends TransactionData {
  retirement?: {
    projectId: string;
    amount: string;
    beneficiary?: string;
    purpose?: string;
    certificateHash?: string;
  };
  tokenTransfers?: Array<{
    from: string;
    to: string;
    amount: string;
    tokenAddress: string;
    tokenSymbol?: string;
  }>;
}

/**
 * Enhanced block data with retirement statistics
 */
export interface BlockWithRetirements extends BlockData {
  retirements?: {
    count: number;
    totalAmount: string;
    projects: string[];
  };
}

// ===============================
// MARKET DATA INTERFACES
// ===============================

/**
 * Carbon credit pricing and market data
 */
export interface MarketData {
  pricing: {
    current: number;
    currency: string;
    change24h: number;
    change7d: number;
    volume24h: number;
    marketCap?: number;
  };
  trading: {
    high24h: number;
    low24h: number;
    open24h: number;
    close24h: number;
    trades24h: number;
  };
  retirement: {
    rate24h: number; // Retirement rate in last 24h
    impact: number; // Price impact of retirements
  };
  liquidity: {
    available: string;
    locked: string;
    utilization: number; // Percentage
  };
  timestamp: string;
}

/**
 * Historical price data point
 */
export interface PriceDataPoint {
  timestamp: string;
  price: number;
  volume: number;
  retirements: number;
  marketCap?: number;
}

// ===============================
// UTILITY TYPES
// ===============================

/**
 * Generic data fetcher configuration
 */
export interface DataFetcherConfig {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  params?: Record<string, any>;
  body?: any;
  cache?: CacheConfig;
  retry?: {
    attempts: number;
    delay: number;
    backoff: "linear" | "exponential";
  };
  timeout?: number;
}

/**
 * Data aggregation options
 */
export interface AggregationOptions {
  groupBy: string[];
  metrics: string[];
  filters?: Record<string, any>;
  timeframe?: {
    start: string;
    end: string;
    interval: "hour" | "day" | "week" | "month" | "year";
  };
  sort?: {
    field: string;
    direction: "asc" | "desc";
  };
  limit?: number;
}

// ===============================
// EXTENDED EXPORTS
// ===============================

// Re-export existing types for convenience
export type {
  ProjectData,
  ProjectsResponse,
  BlockData,
  TransactionData,
  StatsData,
} from "./co2e-api";

// Export utility type helpers
export type WithRetirements<T> = T & {
  retirements: RetirementStats;
};

export type Paginated<T> = {
  items: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

export type TimeSeries<T> = Array<{
  timestamp: string;
  data: T;
}>;

// Export validation helpers
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Export branded types for better type safety
export type TokenAmount = string & { __brand: "TokenAmount" };
export type CO2eAmount = string & { __brand: "CO2eAmount" };
export type ContractAddress = string & { __brand: "ContractAddress" };
export type TransactionHash = string & { __brand: "TransactionHash" };
export type ProjectId = string & { __brand: "ProjectId" };

// ===============================
// CONSTANTS AND ENUMS
// ===============================

export const RETIREMENT_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  FAILED: "failed",
  CANCELLED: "cancelled",
} as const;

export const RETIRER_TYPES = {
  INDIVIDUAL: "individual",
  CORPORATION: "corporation",
  INSTITUTION: "institution",
  REGISTRY: "registry",
} as const;

export const PAYMENT_METHODS = {
  AIS_POINTS: "ais_points",
  FIAT_USD: "fiat_usd",
  FIAT_EUR: "fiat_eur",
  FIAT_OTHER: "fiat_other",
  CRYPTO_ETH: "crypto_eth",
  CRYPTO_BTC: "crypto_btc",
  CRYPTO_USDC: "crypto_usdc",
  CRYPTO_USDT: "crypto_usdt",
  CRYPTO_OTHER: "crypto_other",
  BANK_TRANSFER: "bank_transfer",
  CREDIT_CARD: "credit_card",
  PAYPAL: "paypal",
  OTHER: "other",
} as const;

export const PAYMENT_METHOD_CATEGORIES = {
  AIS_POINTS: "ais_points",
  FIAT: "fiat",
  CRYPTOCURRENCY: "cryptocurrency",
  TRADITIONAL: "traditional",
  OTHER: "other",
} as const;

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.AIS_POINTS]: "AIS Points",
  [PAYMENT_METHODS.FIAT_USD]: "USD",
  [PAYMENT_METHODS.FIAT_EUR]: "EUR",
  [PAYMENT_METHODS.FIAT_OTHER]: "Other Fiat",
  [PAYMENT_METHODS.CRYPTO_ETH]: "Ethereum",
  [PAYMENT_METHODS.CRYPTO_BTC]: "Bitcoin",
  [PAYMENT_METHODS.CRYPTO_USDC]: "USDC",
  [PAYMENT_METHODS.CRYPTO_USDT]: "USDT",
  [PAYMENT_METHODS.CRYPTO_OTHER]: "Other Crypto",
  [PAYMENT_METHODS.BANK_TRANSFER]: "Bank Transfer",
  [PAYMENT_METHODS.CREDIT_CARD]: "Credit Card",
  [PAYMENT_METHODS.PAYPAL]: "PayPal",
  [PAYMENT_METHODS.OTHER]: "Other",
} as const;

export const CACHE_STRATEGIES = {
  LRU: "lru",
  FIFO: "fifo",
  TTL: "ttl",
} as const;

export const API_VERSIONS = {
  V1: "v1",
  V2: "v2",
} as const;

// Default cache configurations
export const DEFAULT_CACHE_CONFIGS = {
  projects: {
    key: "projects",
    ttl: 5 * 60 * 1000, // 5 minutes
    strategy: "ttl" as const,
    maxSize: 100,
  },
  retirements: {
    key: "retirements",
    ttl: 2 * 60 * 1000, // 2 minutes
    strategy: "ttl" as const,
    maxSize: 500,
  },
  stats: {
    key: "stats",
    ttl: 1 * 60 * 1000, // 1 minute
    strategy: "ttl" as const,
    maxSize: 50,
  },
  market: {
    key: "market",
    ttl: 30 * 1000, // 30 seconds
    strategy: "ttl" as const,
    maxSize: 20,
  },
} as const;