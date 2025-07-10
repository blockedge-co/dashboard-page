// IREC Certificate Data Types for dual-source integration

export interface IrecCertificateData {
  // Core certificate information
  id: string
  certificateId: string
  projectId: string
  projectName: string
  issuer: string
  country: string
  region: string
  facility: string
  
  // Technology and energy information
  technology: string
  energySource: string
  capacity: {
    value: number
    unit: string // MW, GW, etc.
  }
  
  // Certificate supply data (from CO2e Chain)
  supply: {
    total: string
    available: string
    retired: string
    reserved: string
    lastUpdated: string
  }
  
  // Trading and tokenization data
  trading: {
    currentPrice: number
    currency: string
    volume24h: number
    marketCap: number
    priceChange24h: number
  }
  
  // Temporal information
  vintage: {
    year: number
    quarter?: number
    month?: number
  }
  
  // Verification and compliance
  verification: {
    verifiedBy: string
    verificationDate: string
    standard: string
    registry: string
    certificationBody: string
  }
  
  // Environmental attributes
  environmental: {
    co2Avoided: number
    co2Unit: string
    renewablePercentage: number
    gridEmissionFactor: number
  }
  
  // Contract addresses for blockchain integration
  contracts: {
    tokenContract: string
    certificateContract: string
    optimismContract?: string
  }
  
  // Metadata
  metadata: {
    createdAt: string
    updatedAt: string
    status: 'active' | 'retired' | 'suspended' | 'cancelled'
    tags: string[]
  }
}

export interface OptimismTransactionData {
  // Transaction basic information
  hash: string
  blockNumber: number
  blockHash: string
  transactionIndex: number
  timestamp: string
  
  // Transaction details
  from: string
  to: string
  value: string
  gas: string
  gasPrice: string
  gasUsed: string
  status: 'success' | 'failed' | 'pending'
  
  // IREC-specific transaction data
  certificateId: string
  transactionType: 'buy' | 'sell' | 'tokenize' | 'retire' | 'transfer'
  amount: string
  price?: string
  currency?: string
  
  // Token information
  tokenAddress: string
  tokenId?: string
  tokenAmount: string
  
  // Event data
  events: OptimismEventData[]
  
  // Metadata
  metadata: {
    processed: boolean
    errors?: string[]
    retryCount: number
  }
}

export interface OptimismEventData {
  address: string
  topics: string[]
  data: string
  eventName: string
  eventSignature: string
  decodedData: Record<string, any>
}

export interface IrecSupplyMetrics {
  // Current supply status
  totalSupply: number
  availableSupply: number
  retiredSupply: number
  reservedSupply: number
  
  // Supply history
  supplyHistory: SupplyHistoryPoint[]
  
  // Market metrics
  marketMetrics: {
    totalValue: number
    averagePrice: number
    liquidityScore: number
    volatilityIndex: number
  }
  
  // Distribution metrics
  distribution: {
    byCountry: Record<string, number>
    byTechnology: Record<string, number>
    byVintage: Record<string, number>
  }
  
  // Performance indicators
  performance: {
    utilizationRate: number
    retirementRate: number
    tradingVolume: number
    priceStability: number
  }
}

export interface SupplyHistoryPoint {
  date: string
  totalSupply: number
  availableSupply: number
  retiredSupply: number
  price: number
  volume: number
}

export interface IrecTransactionSummary {
  // Period summary
  period: string
  totalTransactions: number
  totalVolume: number
  totalValue: number
  
  // Transaction breakdown
  transactions: {
    buy: number
    sell: number
    tokenize: number
    retire: number
    transfer: number
  }
  
  // Value breakdown
  values: {
    buy: number
    sell: number
    tokenize: number
    retire: number
    transfer: number
  }
  
  // Top transactions
  topTransactions: OptimismTransactionData[]
  
  // Performance metrics
  metrics: {
    averageTransactionValue: number
    averageGasUsed: number
    successRate: number
    peakTransactionTime: string
  }
}

export interface IrecCertificateDetails {
  // Certificate information
  certificate: IrecCertificateData
  
  // Project details
  project: {
    developer: string
    operator: string
    location: {
      coordinates: {
        latitude: number
        longitude: number
      }
      address: string
      postalCode: string
    }
    capacity: {
      nameplate: number
      actual: number
      unit: string
    }
    commissioning: {
      date: string
      phase: string
    }
  }
  
  // Generation data
  generation: {
    annualGeneration: number
    monthlyGeneration: number[]
    capacity: number
    unit: string
  }
  
  // Compliance information
  compliance: {
    regulations: string[]
    standards: string[]
    certifications: string[]
    audits: ComplianceAudit[]
  }
  
  // Financial information
  financial: {
    totalInvestment: number
    operatingCosts: number
    revenue: number
    subsidies: number
    currency: string
  }
  
  // Environmental impact
  environmental: {
    co2Avoided: number
    co2Unit: string
    waterUsage: number
    waterUnit: string
    landUse: number
    landUnit: string
    biodiversityImpact: string
  }
  
  // Social impact
  social: {
    jobsCreated: number
    communitiesServed: number
    economicImpact: number
    socialPrograms: string[]
  }
}

export interface ComplianceAudit {
  auditor: string
  date: string
  result: 'pass' | 'fail' | 'pending'
  score: number
  findings: string[]
  recommendations: string[]
}

// API Response Types
export interface IrecApiResponse<T> {
  data: T
  success: boolean
  timestamp: string
  source: 'co2e-chain' | 'optimism' | 'aggregated'
  error?: string
  metadata?: {
    totalCount?: number
    page?: number
    limit?: number
    processingTime?: number
  }
}

// Aggregated data combining both sources
export interface IrecAggregatedData {
  certificates: IrecCertificateData[]
  transactions: OptimismTransactionData[]
  metrics: IrecSupplyMetrics
  summary: IrecTransactionSummary
  lastUpdated: string
}

// Hook return types
export interface UseIrecDataReturn {
  certificateData: IrecCertificateData[]
  optimismData: OptimismTransactionData[]
  metrics: IrecSupplyMetrics
  summary: IrecTransactionSummary
  loading: boolean
  error: string | null
  refreshData: () => Promise<void>
  lastUpdated: string
}

// Filter and search types
export interface IrecFilters {
  country?: string[]
  technology?: string[]
  vintage?: number[]
  status?: string[]
  priceRange?: {
    min: number
    max: number
  }
  dateRange?: {
    start: string
    end: string
  }
}

export interface IrecSearchParams {
  query?: string
  filters?: IrecFilters
  sortBy?: 'price' | 'volume' | 'date' | 'supply'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// Chart data types
export interface IrecChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
    borderWidth?: number
  }[]
}

export interface IrecTimeSeriesData {
  timestamp: string
  value: number
  volume?: number
  price?: number
  supply?: number
}

// Error types
export interface IrecError {
  code: string
  message: string
  details?: string
  timestamp: string
  source: 'co2e-chain' | 'optimism' | 'aggregation'
}

// Configuration types
export interface IrecConfig {
  co2eChainEndpoint: string
  optimismEndpoint: string
  cacheTimeout: number
  retryAttempts: number
  batchSize: number
  refreshInterval: number
}