import { co2eApi } from '../co2e-api'
import type { 
  IrecCertificateData, 
  OptimismTransactionData, 
  IrecSupplyMetrics, 
  IrecTransactionSummary,
  IrecApiResponse,
  IrecAggregatedData,
  IrecError,
  IrecConfig
} from '../types/irec-types'

// Configuration
const IREC_CONFIG: IrecConfig = {
  co2eChainEndpoint: 'https://exp.co2e.cc/api/v2',
  optimismEndpoint: 'https://api.optimism.io/api',
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  retryAttempts: 3,
  batchSize: 50,
  refreshInterval: 30 * 1000 // 30 seconds
}

class IrecDataService {
  private certificateCache = new Map<string, { data: IrecCertificateData[], timestamp: number }>()
  private optimismCache = new Map<string, { data: OptimismTransactionData[], timestamp: number }>()
  private metricsCache = new Map<string, { data: IrecSupplyMetrics, timestamp: number }>()

  // Main aggregation method
  async getAggregatedIrecData(): Promise<IrecAggregatedData> {
    try {
      const [certificates, transactions, metrics, summary] = await Promise.all([
        this.getIrecCertificates(),
        this.getOptimismTransactions(),
        this.getSupplyMetrics(),
        this.getTransactionSummary()
      ])

      return {
        certificates,
        transactions,
        metrics,
        summary,
        lastUpdated: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error aggregating IREC data:', error)
      throw this.createError('AGGREGATION_ERROR', 'Failed to aggregate IREC data', error)
    }
  }

  // CO2e Chain Integration - IREC Certificates
  async getIrecCertificates(): Promise<IrecCertificateData[]> {
    const cacheKey = 'irec-certificates'
    const cached = this.certificateCache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < IREC_CONFIG.cacheTimeout) {
      return cached.data
    }

    try {
      // Fetch IREC projects from CO2e Chain
      const projects = await co2eApi.getProjectsByType('IREC')
      const certificates: IrecCertificateData[] = []

      for (const project of projects) {
        try {
          // Fetch real token data for each IREC project
          const tokenData = await this.fetchTokenData(project.tokenAddress)
          
          const certificate: IrecCertificateData = {
            id: project.id,
            certificateId: `IREC-${project.id}`,
            projectId: project.id,
            projectName: project.name,
            issuer: project.registry,
            country: project.country,
            region: project.region || 'International',
            facility: project.name,
            
            technology: this.extractTechnology(project.type),
            energySource: this.extractEnergySource(project.type),
            capacity: {
              value: this.calculateCapacity(project.metrics.totalInvestment),
              unit: 'MW'
            },
            
            supply: {
              total: project.totalSupply,
              available: project.currentSupply,
              retired: project.retired,
              reserved: '0',
              lastUpdated: project.lastUpdate
            },
            
            trading: {
              currentPrice: parseFloat(project.pricing.currentPrice),
              currency: project.pricing.currency,
              volume24h: this.calculateVolume24h(project.transfers || 0),
              marketCap: parseFloat(project.totalSupply) * parseFloat(project.pricing.currentPrice),
              priceChange24h: this.calculatePriceChange24h(project.id)
            },
            
            vintage: {
              year: parseInt(project.vintage),
              quarter: Math.floor(Math.random() * 4) + 1,
              month: Math.floor(Math.random() * 12) + 1
            },
            
            verification: {
              verifiedBy: project.certificationBody,
              verificationDate: project.verificationDate,
              standard: project.methodology,
              registry: project.registry,
              certificationBody: project.certificationBody
            },
            
            environmental: {
              co2Avoided: parseFloat(project.co2Reduction.total),
              co2Unit: project.co2Reduction.unit,
              renewablePercentage: 100,
              gridEmissionFactor: this.calculateGridEmissionFactor(project.country)
            },
            
            contracts: {
              tokenContract: project.tokenAddress,
              certificateContract: project.certContract || project.tokenAddress,
              optimismContract: this.getOptimismContract(project.tokenAddress)
            },
            
            metadata: {
              createdAt: project.verificationDate,
              updatedAt: project.lastUpdate,
              status: project.status as 'active' | 'retired' | 'suspended' | 'cancelled',
              tags: project.tags
            }
          }

          certificates.push(certificate)
        } catch (error) {
          console.warn(`Failed to process IREC project ${project.id}:`, error)
        }
      }

      // Cache the results
      this.certificateCache.set(cacheKey, {
        data: certificates,
        timestamp: Date.now()
      })

      return certificates
    } catch (error) {
      console.error('Error fetching IREC certificates:', error)
      throw this.createError('FETCH_CERTIFICATES_ERROR', 'Failed to fetch IREC certificates', error)
    }
  }

  // Optimism Integration - Transaction Data
  async getOptimismTransactions(): Promise<OptimismTransactionData[]> {
    const cacheKey = 'optimism-transactions'
    const cached = this.optimismCache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < IREC_CONFIG.cacheTimeout) {
      return cached.data
    }

    try {
      // Get IREC certificate contracts
      const certificates = await this.getIrecCertificates()
      const transactions: OptimismTransactionData[] = []

      for (const certificate of certificates) {
        if (certificate.contracts.optimismContract) {
          try {
            const contractTransactions = await this.fetchOptimismTransactions(
              certificate.contracts.optimismContract
            )
            transactions.push(...contractTransactions)
          } catch (error) {
            console.warn(`Failed to fetch Optimism transactions for ${certificate.id}:`, error)
          }
        }
      }

      // Sort by timestamp (newest first)
      transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      // Cache the results
      this.optimismCache.set(cacheKey, {
        data: transactions,
        timestamp: Date.now()
      })

      return transactions
    } catch (error) {
      console.error('Error fetching Optimism transactions:', error)
      throw this.createError('FETCH_OPTIMISM_ERROR', 'Failed to fetch Optimism transactions', error)
    }
  }

  // Supply Metrics Calculation
  async getSupplyMetrics(): Promise<IrecSupplyMetrics> {
    const cacheKey = 'supply-metrics'
    const cached = this.metricsCache.get(cacheKey)
    
    if (cached && Date.now() - cached.timestamp < IREC_CONFIG.cacheTimeout) {
      return cached.data
    }

    try {
      const certificates = await this.getIrecCertificates()
      
      // Calculate aggregate metrics
      const totalSupply = certificates.reduce((sum, cert) => sum + parseFloat(cert.supply.total), 0)
      const availableSupply = certificates.reduce((sum, cert) => sum + parseFloat(cert.supply.available), 0)
      const retiredSupply = certificates.reduce((sum, cert) => sum + parseFloat(cert.supply.retired), 0)
      const reservedSupply = certificates.reduce((sum, cert) => sum + parseFloat(cert.supply.reserved), 0)

      // Calculate market metrics
      const totalValue = certificates.reduce((sum, cert) => 
        sum + (parseFloat(cert.supply.total) * cert.trading.currentPrice), 0
      )
      const averagePrice = totalValue / totalSupply
      const liquidityScore = this.calculateLiquidityScore(certificates)
      const volatilityIndex = this.calculateVolatilityIndex(certificates)

      // Calculate distribution
      const byCountry = this.calculateDistributionByCountry(certificates)
      const byTechnology = this.calculateDistributionByTechnology(certificates)
      const byVintage = this.calculateDistributionByVintage(certificates)

      // Calculate performance indicators
      const utilizationRate = (totalSupply - availableSupply) / totalSupply
      const retirementRate = retiredSupply / totalSupply
      const tradingVolume = certificates.reduce((sum, cert) => sum + cert.trading.volume24h, 0)
      const priceStability = this.calculatePriceStability(certificates)

      // Generate supply history (mock data for now)
      const supplyHistory = this.generateSupplyHistory(totalSupply, availableSupply, retiredSupply)

      const metrics: IrecSupplyMetrics = {
        totalSupply,
        availableSupply,
        retiredSupply,
        reservedSupply,
        supplyHistory,
        marketMetrics: {
          totalValue,
          averagePrice,
          liquidityScore,
          volatilityIndex
        },
        distribution: {
          byCountry,
          byTechnology,
          byVintage
        },
        performance: {
          utilizationRate,
          retirementRate,
          tradingVolume,
          priceStability
        }
      }

      // Cache the results
      this.metricsCache.set(cacheKey, {
        data: metrics,
        timestamp: Date.now()
      })

      return metrics
    } catch (error) {
      console.error('Error calculating supply metrics:', error)
      throw this.createError('METRICS_ERROR', 'Failed to calculate supply metrics', error)
    }
  }

  // Transaction Summary
  async getTransactionSummary(): Promise<IrecTransactionSummary> {
    try {
      const transactions = await this.getOptimismTransactions()
      const period = 'Last 24 hours'
      
      // Filter transactions from last 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const recentTransactions = transactions.filter(
        tx => new Date(tx.timestamp) > oneDayAgo
      )

      const totalTransactions = recentTransactions.length
      const totalVolume = recentTransactions.reduce((sum, tx) => sum + parseFloat(tx.tokenAmount), 0)
      const totalValue = recentTransactions.reduce((sum, tx) => 
        sum + (parseFloat(tx.tokenAmount) * parseFloat(tx.price || '0')), 0
      )

      // Transaction breakdown
      const transactionBreakdown = {
        buy: recentTransactions.filter(tx => tx.transactionType === 'buy').length,
        sell: recentTransactions.filter(tx => tx.transactionType === 'sell').length,
        tokenize: recentTransactions.filter(tx => tx.transactionType === 'tokenize').length,
        retire: recentTransactions.filter(tx => tx.transactionType === 'retire').length,
        transfer: recentTransactions.filter(tx => tx.transactionType === 'transfer').length
      }

      // Value breakdown
      const valueBreakdown = {
        buy: this.calculateValueByType(recentTransactions, 'buy'),
        sell: this.calculateValueByType(recentTransactions, 'sell'),
        tokenize: this.calculateValueByType(recentTransactions, 'tokenize'),
        retire: this.calculateValueByType(recentTransactions, 'retire'),
        transfer: this.calculateValueByType(recentTransactions, 'transfer')
      }

      // Top transactions
      const topTransactions = recentTransactions
        .sort((a, b) => parseFloat(b.tokenAmount) - parseFloat(a.tokenAmount))
        .slice(0, 10)

      // Performance metrics
      const metrics = {
        averageTransactionValue: totalValue / totalTransactions || 0,
        averageGasUsed: recentTransactions.reduce((sum, tx) => sum + parseFloat(tx.gasUsed), 0) / totalTransactions || 0,
        successRate: recentTransactions.filter(tx => tx.status === 'success').length / totalTransactions || 0,
        peakTransactionTime: this.calculatePeakTransactionTime(recentTransactions)
      }

      return {
        period,
        totalTransactions,
        totalVolume,
        totalValue,
        transactions: transactionBreakdown,
        values: valueBreakdown,
        topTransactions,
        metrics
      }
    } catch (error) {
      console.error('Error generating transaction summary:', error)
      throw this.createError('SUMMARY_ERROR', 'Failed to generate transaction summary', error)
    }
  }

  // Helper methods
  private async fetchTokenData(tokenAddress: string): Promise<any> {
    // This would fetch real token data from CO2e Chain
    // For now, we'll use the existing co2eApi methods
    return null
  }

  private async fetchOptimismTransactions(contractAddress: string): Promise<OptimismTransactionData[]> {
    // Mock Optimism transaction data
    const mockTransactions: OptimismTransactionData[] = [
      {
        hash: `0x${Math.random().toString(16).substr(2, 64)}`,
        blockNumber: Math.floor(Math.random() * 1000000),
        blockHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        transactionIndex: Math.floor(Math.random() * 100),
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        from: `0x${Math.random().toString(16).substr(2, 40)}`,
        to: contractAddress,
        value: (Math.random() * 1000).toFixed(2),
        gas: '21000',
        gasPrice: (Math.random() * 0.1).toFixed(8),
        gasUsed: '21000',
        status: 'success' as const,
        certificateId: `IREC-${Math.random().toString(36).substr(2, 9)}`,
        transactionType: ['buy', 'sell', 'tokenize', 'retire', 'transfer'][Math.floor(Math.random() * 5)] as any,
        amount: (Math.random() * 1000).toFixed(2),
        price: (Math.random() * 100).toFixed(2),
        currency: 'USD',
        tokenAddress: contractAddress,
        tokenAmount: (Math.random() * 1000).toFixed(2),
        events: [],
        metadata: {
          processed: true,
          retryCount: 0
        }
      }
    ]

    return mockTransactions
  }

  private extractTechnology(type: string): string {
    if (type.toLowerCase().includes('hydro')) return 'Hydroelectric'
    if (type.toLowerCase().includes('solar')) return 'Solar'
    if (type.toLowerCase().includes('wind')) return 'Wind'
    return 'Renewable Energy'
  }

  private extractEnergySource(type: string): string {
    if (type.toLowerCase().includes('hydro')) return 'Water'
    if (type.toLowerCase().includes('solar')) return 'Solar'
    if (type.toLowerCase().includes('wind')) return 'Wind'
    return 'Renewable'
  }

  private calculateCapacity(investment: string): number {
    // Rough estimate: $1M investment = 1MW capacity
    return parseFloat(investment) / 1000000
  }

  private calculateVolume24h(transfers: number): number {
    // Mock calculation based on transfers
    return transfers * 0.1
  }

  private calculatePriceChange24h(projectId: string): number {
    // Mock price change calculation
    return (Math.random() - 0.5) * 10 // ±5% change
  }

  private calculateGridEmissionFactor(country: string): number {
    // Mock grid emission factors by country (kg CO2/kWh)
    const factors: Record<string, number> = {
      Vietnam: 0.6,
      Thailand: 0.55,
      Indonesia: 0.7,
      Philippines: 0.65,
      Malaysia: 0.6
    }
    return factors[country] || 0.6
  }

  private getOptimismContract(tokenAddress: string): string {
    // Generate mock Optimism contract address
    return `0x${Math.random().toString(16).substr(2, 40)}`
  }

  private calculateLiquidityScore(certificates: IrecCertificateData[]): number {
    // Mock liquidity score calculation
    return Math.random() * 100
  }

  private calculateVolatilityIndex(certificates: IrecCertificateData[]): number {
    // Mock volatility index calculation
    return Math.random() * 50
  }

  private calculateDistributionByCountry(certificates: IrecCertificateData[]): Record<string, number> {
    const distribution: Record<string, number> = {}
    certificates.forEach(cert => {
      distribution[cert.country] = (distribution[cert.country] || 0) + parseFloat(cert.supply.total)
    })
    return distribution
  }

  private calculateDistributionByTechnology(certificates: IrecCertificateData[]): Record<string, number> {
    const distribution: Record<string, number> = {}
    certificates.forEach(cert => {
      distribution[cert.technology] = (distribution[cert.technology] || 0) + parseFloat(cert.supply.total)
    })
    return distribution
  }

  private calculateDistributionByVintage(certificates: IrecCertificateData[]): Record<string, number> {
    const distribution: Record<string, number> = {}
    certificates.forEach(cert => {
      const vintage = cert.vintage.year.toString()
      distribution[vintage] = (distribution[vintage] || 0) + parseFloat(cert.supply.total)
    })
    return distribution
  }

  private calculatePriceStability(certificates: IrecCertificateData[]): number {
    // Mock price stability calculation
    return Math.random() * 100
  }

  private generateSupplyHistory(totalSupply: number, availableSupply: number, retiredSupply: number): any[] {
    // Mock supply history data
    const history = []
    for (let i = 30; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      history.push({
        date: date.toISOString().split('T')[0],
        totalSupply: totalSupply * (0.9 + Math.random() * 0.2),
        availableSupply: availableSupply * (0.9 + Math.random() * 0.2),
        retiredSupply: retiredSupply * (0.9 + Math.random() * 0.2),
        price: 40 + Math.random() * 20,
        volume: Math.random() * 1000
      })
    }
    return history
  }

  private calculateValueByType(transactions: OptimismTransactionData[], type: string): number {
    return transactions
      .filter(tx => tx.transactionType === type)
      .reduce((sum, tx) => sum + (parseFloat(tx.tokenAmount) * parseFloat(tx.price || '0')), 0)
  }

  private calculatePeakTransactionTime(transactions: OptimismTransactionData[]): string {
    // Mock peak transaction time calculation
    const hours = ['00:00', '06:00', '12:00', '18:00']
    return hours[Math.floor(Math.random() * hours.length)]
  }

  private createError(code: string, message: string, originalError?: any): IrecError {
    return {
      code,
      message,
      details: originalError?.message || originalError?.toString(),
      timestamp: new Date().toISOString(),
      source: 'aggregation'
    }
  }
}

export const irecDataService = new IrecDataService()