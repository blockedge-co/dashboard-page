import type {
  IrecCertificate,
  IrecSupplyData,
  IrecOptimismTransaction,
  IrecOptimismActivity,
  IrecCertificateComplete,
  IrecAnalytics,
  IrecCertificateType,
  IrecCertificateStatus,
  OptimismTransactionType,
} from '../types/irec';

// Mock data pools for realistic variety
const COUNTRIES = [
  { code: 'NL', name: 'Netherlands', region: 'Europe' },
  { code: 'DE', name: 'Germany', region: 'Europe' },
  { code: 'DK', name: 'Denmark', region: 'Europe' },
  { code: 'UK', name: 'United Kingdom', region: 'Europe' },
  { code: 'ES', name: 'Spain', region: 'Europe' },
  { code: 'FR', name: 'France', region: 'Europe' },
  { code: 'BE', name: 'Belgium', region: 'Europe' },
  { code: 'NO', name: 'Norway', region: 'Europe' },
  { code: 'SE', name: 'Sweden', region: 'Europe' },
  { code: 'FI', name: 'Finland', region: 'Europe' },
];

const FACILITY_TYPES = [
  { type: 'Offshore Wind', capacity: ['500 MW', '750 MW', '1000 MW', '1250 MW', '1500 MW'] },
  { type: 'Onshore Wind', capacity: ['100 MW', '200 MW', '300 MW', '400 MW', '500 MW'] },
  { type: 'Solar PV', capacity: ['50 MW', '100 MW', '200 MW', '300 MW', '400 MW'] },
  { type: 'Hydropower', capacity: ['25 MW', '50 MW', '75 MW', '100 MW', '150 MW'] },
  { type: 'Biomass', capacity: ['20 MW', '30 MW', '40 MW', '50 MW', '60 MW'] },
  { type: 'Geothermal', capacity: ['10 MW', '20 MW', '30 MW', '40 MW', '50 MW'] },
];

const CERTIFICATE_STATUSES: IrecCertificateStatus[] = [
  'active', 'tokenized', 'retired', 'transferred', 'expired'
];

const CERTIFICATE_TYPES: IrecCertificateType[] = [
  'renewable_energy', 'carbon_offset', 'energy_efficiency', 'biofuel', 'waste_to_energy'
];

const TRANSACTION_TYPES: OptimismTransactionType[] = [
  'tokenize', 'buy', 'sell', 'transfer', 'retire', 'redeem'
];

/**
 * Mock data generator for IREC certificates
 */
class IrecMockDataGenerator {
  private certificateCounter = 1;
  private transactionCounter = 1;

  /**
   * Generate a single mock IREC certificate
   */
  generateCertificate(): IrecCertificate {
    const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    const facilityType = FACILITY_TYPES[Math.floor(Math.random() * FACILITY_TYPES.length)];
    const capacity = facilityType.capacity[Math.floor(Math.random() * facilityType.capacity.length)];
    const certType = CERTIFICATE_TYPES[Math.floor(Math.random() * CERTIFICATE_TYPES.length)];
    const status = CERTIFICATE_STATUSES[Math.floor(Math.random() * CERTIFICATE_STATUSES.length)];
    
    const certificateId = `IREC-${country.code}-${String(this.certificateCounter).padStart(3, '0')}`;
    this.certificateCounter++;
    
    const issuanceDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const expiryDate = new Date(issuanceDate.getTime() + 5 * 365 * 24 * 60 * 60 * 1000);
    
    const energyAmount = Math.floor(Math.random() * 100000) + 10000; // 10,000 to 110,000 MWh
    const carbonAmount = Math.floor(energyAmount * 0.4); // Rough conversion factor
    
    const facilityName = `${facilityType.type} ${country.name} ${String(this.certificateCounter).padStart(2, '0')}`;
    
    return {
      id: certificateId,
      registryId: `REG-${certificateId}`,
      serialNumber: `SN-${certificateId}-${Date.now()}`,
      type: certType,
      status: status,
      
      energyAmount: energyAmount.toString(),
      carbonAmount: carbonAmount.toString(),
      unit: 'MWh',
      
      issuanceDate: issuanceDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      vintage: issuanceDate.getFullYear().toString(),
      country: country.name,
      region: country.region,
      facility: {
        name: facilityName,
        location: `${this.generateLocation(country.name)}, ${country.name}`,
        technology: facilityType.type,
        capacity: capacity,
      },
      
      currentOwner: this.generateEthereumAddress(),
      registryName: 'IREC Registry',
      registryUrl: 'https://registry.irec.org',
      
      tokenAddress: this.generateEthereumAddress(),
      tokenId: certificateId,
      blockchainNetwork: 'optimism',
      
      verification: {
        verifier: this.getRandomVerifier(),
        verificationDate: new Date(issuanceDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        verificationStandard: 'IREC Standard',
        documentHash: this.generateDocumentHash(),
      },
      
      createdAt: new Date(issuanceDate.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Generate supply data for a certificate
   */
  generateSupplyData(certificateId: string, energyAmount: number): IrecSupplyData {
    const totalSupply = energyAmount;
    const retiredSupply = Math.floor(totalSupply * (0.1 + Math.random() * 0.4)); // 10-50% retired
    const availableSupply = totalSupply - retiredSupply;
    const tokenizedSupply = totalSupply;
    
    const pricePerMWh = 40 + Math.random() * 30; // $40-70 per MWh
    
    return {
      certificateId,
      totalSupply: totalSupply.toString(),
      availableSupply: availableSupply.toString(),
      tokenizedSupply: tokenizedSupply.toString(),
      retiredSupply: retiredSupply.toString(),
      
      supplyBreakdown: {
        original: totalSupply.toString(),
        minted: totalSupply.toString(),
        burned: retiredSupply.toString(),
        transferred: Math.floor(totalSupply * 0.3).toString(),
      },
      
      tokenContract: {
        address: this.generateEthereumAddress(),
        symbol: `IREC-${certificateId.split('-')[1]}`,
        decimals: 18,
        network: 'optimism',
      },
      
      marketData: {
        pricePerToken: pricePerMWh.toFixed(2),
        pricePerMWh: pricePerMWh.toFixed(2),
        currency: 'USD',
        lastUpdated: new Date().toISOString(),
      },
      
      supplyHistory: this.generateSupplyHistory(certificateId, totalSupply),
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Generate Optimism activity data for a certificate
   */
  generateOptimismActivity(certificateId: string, energyAmount: number): IrecOptimismActivity {
    const transactionCount = Math.floor(Math.random() * 50) + 5; // 5-55 transactions
    const transactions = Array.from({ length: transactionCount }, () => 
      this.generateOptimismTransaction(certificateId, energyAmount)
    );
    
    // Calculate aggregated data
    const transactionsByType = this.calculateTransactionsByType(transactions);
    const volumeByType = this.calculateVolumeByType(transactions);
    const valueByType = this.calculateValueByType(transactions);
    
    const totalVolume = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    const totalValue = transactions.reduce((sum, tx) => sum + parseFloat(tx.totalValue), 0);
    
    const participants = this.calculateParticipants(transactions);
    
    return {
      certificateId,
      totalTransactions: transactionCount,
      transactionsByType,
      totalVolume: totalVolume.toString(),
      volumeByType,
      totalValue: totalValue.toString(),
      valueByType,
      recentTransactions: transactions.slice(0, 10),
      topBuyers: participants.buyers.slice(0, 5),
      topSellers: participants.sellers.slice(0, 5),
      statistics: {
        averageTransactionSize: transactionCount > 0 ? (totalVolume / transactionCount).toFixed(2) : '0',
        averagePrice: this.calculateAveragePrice(transactions),
        medianPrice: this.calculateMedianPrice(transactions),
        priceRange: this.calculatePriceRange(transactions),
        activityPeriod: {
          start: transactions.length > 0 ? transactions[transactions.length - 1].blockTimestamp : new Date().toISOString(),
          end: transactions.length > 0 ? transactions[0].blockTimestamp : new Date().toISOString(),
        },
      },
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Generate a mock Optimism transaction
   */
  generateOptimismTransaction(certificateId: string, maxAmount: number): IrecOptimismTransaction {
    const type = TRANSACTION_TYPES[Math.floor(Math.random() * TRANSACTION_TYPES.length)];
    const amount = Math.floor(Math.random() * Math.min(maxAmount / 10, 1000)) + 100; // 100-1000 MWh
    const pricePerToken = 40 + Math.random() * 30; // $40-70 per MWh
    const totalValue = amount * pricePerToken;
    
    const blockTimestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const blockNumber = 125000000 + Math.floor(Math.random() * 1000000);
    
    return {
      id: `${certificateId}-tx-${this.transactionCounter++}`,
      transactionHash: this.generateTransactionHash(),
      blockNumber,
      blockTimestamp: blockTimestamp.toISOString(),
      
      type,
      certificateId,
      amount: amount.toString(),
      amountInTokens: amount.toString(),
      
      from: this.generateEthereumAddress(),
      to: this.generateEthereumAddress(),
      
      pricePerToken: pricePerToken.toFixed(2),
      totalValue: totalValue.toFixed(2),
      currency: 'USD',
      
      gasUsed: (150000 + Math.floor(Math.random() * 50000)).toString(),
      gasPrice: (1000000000 + Math.floor(Math.random() * 500000000)).toString(),
      transactionFee: (0.0001 + Math.random() * 0.0005).toFixed(6),
      
      contractAddress: this.generateEthereumAddress(),
      methodName: type,
      
      status: Math.random() > 0.05 ? 'confirmed' : 'failed', // 95% success rate
      
      metadata: {
        purpose: this.getTransactionPurpose(type),
        beneficiary: Math.random() > 0.7 ? this.generateBeneficiary() : undefined,
        notes: Math.random() > 0.8 ? this.generateTransactionNotes() : undefined,
        batchId: Math.random() > 0.9 ? `batch-${Date.now()}` : undefined,
      },
      
      createdAt: blockTimestamp.toISOString(),
    };
  }

  /**
   * Generate complete certificate data
   */
  generateCompleteCertificate(): IrecCertificateComplete {
    const baseCertificate = this.generateCertificate();
    const energyAmount = parseInt(baseCertificate.energyAmount);
    const supplyData = this.generateSupplyData(baseCertificate.id, energyAmount);
    const optimismActivity = this.generateOptimismActivity(baseCertificate.id, energyAmount);
    
    // Calculate derived metrics
    const calculated = this.calculateDerivedMetrics(supplyData, optimismActivity);
    const correlation = this.calculateCorrelation(supplyData, optimismActivity);
    
    return {
      ...baseCertificate,
      supplyData,
      optimismActivity,
      calculated,
      correlation,
    };
  }

  /**
   * Generate multiple certificates
   */
  generateMultipleCertificates(count: number): IrecCertificateComplete[] {
    return Array.from({ length: count }, () => this.generateCompleteCertificate());
  }

  /**
   * Generate analytics data
   */
  generateAnalytics(certificates: IrecCertificateComplete[]): IrecAnalytics {
    const totalCertificates = certificates.length;
    const totalSupply = certificates.reduce((sum, cert) => sum + parseInt(cert.supplyData.totalSupply), 0);
    const totalValue = certificates.reduce((sum, cert) => sum + parseFloat(cert.calculated.marketCap), 0);
    const activeMarkets = certificates.filter(cert => cert.optimismActivity.totalTransactions > 0).length;
    const averagePrice = certificates.reduce((sum, cert) => sum + parseFloat(cert.supplyData.marketData.pricePerToken), 0) / totalCertificates;
    
    return {
      overview: {
        totalCertificates,
        totalSupply: totalSupply.toString(),
        totalValue: totalValue.toFixed(2),
        activeMarkets,
        averagePrice: averagePrice.toFixed(2),
      },
      byStatus: this.groupByStatus(certificates),
      byType: this.groupByType(certificates),
      byCountry: this.groupByCountry(certificates),
      timeSeriesData: {
        daily: this.generateTimeSeriesData('daily', 30),
        monthly: this.generateTimeSeriesData('monthly', 12),
      },
      trends: {
        supplyGrowth: 5.2 + Math.random() * 3,
        priceChange: -2 + Math.random() * 8,
        volumeChange: 3 + Math.random() * 10,
        marketCapChange: 8 + Math.random() * 8,
        newCertificateRate: 2 + Math.random() * 4,
      },
      topPerformers: {
        mostTraded: certificates.slice(0, 5),
        highestValue: certificates.sort((a, b) => parseFloat(b.calculated.marketCap) - parseFloat(a.calculated.marketCap)).slice(0, 5),
        mostLiquid: certificates.sort((a, b) => b.calculated.liquidityScore - a.calculated.liquidityScore).slice(0, 5),
        recentlyAdded: certificates.slice(-5),
      },
      lastUpdated: new Date().toISOString(),
    };
  }

  // Helper methods
  private generateLocation(country: string): string {
    const locations: Record<string, string[]> = {
      'Netherlands': ['North Sea', 'Wadden Sea', 'Ijsselmeer', 'Flevoland', 'Groningen'],
      'Germany': ['North Sea', 'Baltic Sea', 'Bavaria', 'Brandenburg', 'Schleswig-Holstein'],
      'Denmark': ['Jutland', 'Zealand', 'Bornholm', 'Funen', 'Lolland'],
      'United Kingdom': ['Scottish Highlands', 'North Sea', 'Wales', 'Yorkshire', 'Cornwall'],
      'Spain': ['Andalusia', 'Castile', 'Catalonia', 'Galicia', 'Valencia'],
      'France': ['Brittany', 'Normandy', 'Loire Valley', 'Provence', 'Languedoc'],
      'Belgium': ['Flanders', 'Wallonia', 'North Sea', 'Ardennes', 'Campine'],
      'Norway': ['Rogaland', 'Hordaland', 'Møre og Romsdal', 'Nordland', 'Troms'],
      'Sweden': ['Västra Götaland', 'Skåne', 'Stockholm', 'Värmland', 'Norrbotten'],
      'Finland': ['Uusimaa', 'Pirkanmaa', 'Varsinais-Suomi', 'Kainuu', 'Lapland'],
    };
    
    const countryLocations = locations[country] || ['Region A', 'Region B', 'Region C'];
    return countryLocations[Math.floor(Math.random() * countryLocations.length)];
  }

  private generateEthereumAddress(): string {
    return '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  private generateTransactionHash(): string {
    return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  private generateDocumentHash(): string {
    return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  private getRandomVerifier(): string {
    const verifiers = ['TUV SUD', 'DNV GL', 'Bureau Veritas', 'SGS', 'Intertek', 'DEKRA'];
    return verifiers[Math.floor(Math.random() * verifiers.length)];
  }

  private generateSupplyHistory(certificateId: string, totalSupply: number): any[] {
    const history = [];
    const events = Math.floor(Math.random() * 10) + 5;
    
    for (let i = 0; i < events; i++) {
      const timestamp = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);
      const actions = ['mint', 'transfer', 'retire'] as const;
      const action = actions[Math.floor(Math.random() * actions.length)];
      const amount = Math.floor(Math.random() * totalSupply / 10);
      
      history.push({
        timestamp: timestamp.toISOString(),
        totalSupply: totalSupply.toString(),
        availableSupply: (totalSupply - amount).toString(),
        action,
        amount: amount.toString(),
        transactionHash: this.generateTransactionHash(),
      });
    }
    
    return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  private getTransactionPurpose(type: OptimismTransactionType): string {
    const purposes: Record<OptimismTransactionType, string> = {
      tokenize: 'Convert IREC certificate to blockchain token',
      buy: 'Purchase IREC certificate',
      sell: 'Sell IREC certificate',
      transfer: 'Transfer IREC certificate ownership',
      retire: 'Retire IREC certificate for environmental claims',
      redeem: 'Redeem IREC certificate for underlying asset',
    };
    return purposes[type];
  }

  private generateBeneficiary(): string {
    const beneficiaries = [
      'Carbon Neutral Company Ltd.',
      'Green Energy Solutions Inc.',
      'Sustainable Future Corp.',
      'EcoFriendly Industries',
      'Climate Action Partners',
      'Renewable Energy Trust',
    ];
    return beneficiaries[Math.floor(Math.random() * beneficiaries.length)];
  }

  private generateTransactionNotes(): string {
    const notes = [
      'Monthly renewable energy purchase',
      'Annual carbon offset requirement',
      'Quarterly sustainability goal',
      'Corporate ESG compliance',
      'Green energy procurement',
      'Climate commitment fulfillment',
    ];
    return notes[Math.floor(Math.random() * notes.length)];
  }

  private calculateDerivedMetrics(supplyData: IrecSupplyData, optimismActivity: IrecOptimismActivity) {
    const totalSupply = parseInt(supplyData.totalSupply);
    const retiredSupply = parseInt(supplyData.retiredSupply);
    const utilizationRate = totalSupply > 0 ? (retiredSupply / totalSupply) * 100 : 0;
    
    const liquidityScore = Math.min(100, optimismActivity.totalTransactions * 2 + parseFloat(optimismActivity.totalVolume) / 1000);
    const priceStability = 85 + Math.random() * 15; // Mock stability score
    const marketCap = (totalSupply * parseFloat(supplyData.marketData.pricePerToken)).toFixed(2);
    const averageTradeSize = optimismActivity.totalTransactions > 0 ? 
      (parseFloat(optimismActivity.totalVolume) / optimismActivity.totalTransactions).toFixed(2) : '0';
    const activityScore = Math.min(100, liquidityScore * 0.6 + priceStability * 0.4);
    
    return {
      utilizationRate: Number(utilizationRate.toFixed(2)),
      liquidityScore: Number(liquidityScore.toFixed(2)),
      priceStability: Number(priceStability.toFixed(2)),
      marketCap,
      averageTradeSize,
      activityScore: Number(activityScore.toFixed(2)),
    };
  }

  private calculateCorrelation(supplyData: IrecSupplyData, optimismActivity: IrecOptimismActivity) {
    return {
      supplyVsActivity: 0.75 + Math.random() * 0.2,
      priceConsistency: 0.85 + Math.random() * 0.1,
      dataQuality: 0.9 + Math.random() * 0.1,
      lastSyncTime: new Date().toISOString(),
    };
  }

  private calculateTransactionsByType(transactions: IrecOptimismTransaction[]): Record<OptimismTransactionType, number> {
    const result: Record<OptimismTransactionType, number> = {
      tokenize: 0, buy: 0, sell: 0, transfer: 0, retire: 0, redeem: 0
    };
    
    transactions.forEach(tx => {
      result[tx.type]++;
    });
    
    return result;
  }

  private calculateVolumeByType(transactions: IrecOptimismTransaction[]): Record<OptimismTransactionType, string> {
    const result: Record<OptimismTransactionType, string> = {
      tokenize: '0', buy: '0', sell: '0', transfer: '0', retire: '0', redeem: '0'
    };
    
    transactions.forEach(tx => {
      result[tx.type] = (parseFloat(result[tx.type]) + parseFloat(tx.amount)).toString();
    });
    
    return result;
  }

  private calculateValueByType(transactions: IrecOptimismTransaction[]): Record<OptimismTransactionType, string> {
    const result: Record<OptimismTransactionType, string> = {
      tokenize: '0', buy: '0', sell: '0', transfer: '0', retire: '0', redeem: '0'
    };
    
    transactions.forEach(tx => {
      result[tx.type] = (parseFloat(result[tx.type]) + parseFloat(tx.totalValue)).toString();
    });
    
    return result;
  }

  private calculateParticipants(transactions: IrecOptimismTransaction[]) {
    const buyers = new Map<string, { volume: number; value: number; count: number }>();
    const sellers = new Map<string, { volume: number; value: number; count: number }>();
    
    transactions.forEach(tx => {
      if (tx.type === 'buy') {
        const buyer = buyers.get(tx.from) || { volume: 0, value: 0, count: 0 };
        buyer.volume += parseFloat(tx.amount);
        buyer.value += parseFloat(tx.totalValue);
        buyer.count++;
        buyers.set(tx.from, buyer);
      } else if (tx.type === 'sell') {
        const seller = sellers.get(tx.from) || { volume: 0, value: 0, count: 0 };
        seller.volume += parseFloat(tx.amount);
        seller.value += parseFloat(tx.totalValue);
        seller.count++;
        sellers.set(tx.from, seller);
      }
    });
    
    return {
      buyers: Array.from(buyers.entries()).map(([address, data]) => ({
        address,
        volume: data.volume.toString(),
        value: data.value.toString(),
        transactionCount: data.count,
      })).sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume)),
      sellers: Array.from(sellers.entries()).map(([address, data]) => ({
        address,
        volume: data.volume.toString(),
        value: data.value.toString(),
        transactionCount: data.count,
      })).sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume)),
    };
  }

  private calculateAveragePrice(transactions: IrecOptimismTransaction[]): string {
    if (transactions.length === 0) return '0.00';
    const totalPrice = transactions.reduce((sum, tx) => sum + parseFloat(tx.pricePerToken), 0);
    return (totalPrice / transactions.length).toFixed(2);
  }

  private calculateMedianPrice(transactions: IrecOptimismTransaction[]): string {
    if (transactions.length === 0) return '0.00';
    const prices = transactions.map(tx => parseFloat(tx.pricePerToken)).sort((a, b) => a - b);
    const middle = Math.floor(prices.length / 2);
    return prices.length % 2 === 0 ? 
      ((prices[middle - 1] + prices[middle]) / 2).toFixed(2) : 
      prices[middle].toFixed(2);
  }

  private calculatePriceRange(transactions: IrecOptimismTransaction[]): { min: string; max: string } {
    if (transactions.length === 0) return { min: '0.00', max: '0.00' };
    const prices = transactions.map(tx => parseFloat(tx.pricePerToken));
    return {
      min: Math.min(...prices).toFixed(2),
      max: Math.max(...prices).toFixed(2),
    };
  }

  private groupByStatus(certificates: IrecCertificateComplete[]): Record<string, any> {
    const groups: Record<string, any> = {};
    
    certificates.forEach(cert => {
      if (!groups[cert.status]) {
        groups[cert.status] = { count: 0, supply: 0, value: 0, percentage: 0 };
      }
      groups[cert.status].count++;
      groups[cert.status].supply += parseInt(cert.supplyData.totalSupply);
      groups[cert.status].value += parseFloat(cert.calculated.marketCap);
    });
    
    Object.values(groups).forEach((group: any) => {
      group.percentage = (group.count / certificates.length) * 100;
    });
    
    return groups;
  }

  private groupByType(certificates: IrecCertificateComplete[]): Record<string, any> {
    const groups: Record<string, any> = {};
    
    certificates.forEach(cert => {
      if (!groups[cert.type]) {
        groups[cert.type] = { count: 0, supply: 0, value: 0, percentage: 0 };
      }
      groups[cert.type].count++;
      groups[cert.type].supply += parseInt(cert.supplyData.totalSupply);
      groups[cert.type].value += parseFloat(cert.calculated.marketCap);
    });
    
    Object.values(groups).forEach((group: any) => {
      group.percentage = (group.count / certificates.length) * 100;
    });
    
    return groups;
  }

  private groupByCountry(certificates: IrecCertificateComplete[]): Record<string, any> {
    const groups: Record<string, any> = {};
    
    certificates.forEach(cert => {
      if (!groups[cert.country]) {
        groups[cert.country] = { count: 0, supply: 0, value: 0, percentage: 0 };
      }
      groups[cert.country].count++;
      groups[cert.country].supply += parseInt(cert.supplyData.totalSupply);
      groups[cert.country].value += parseFloat(cert.calculated.marketCap);
    });
    
    Object.values(groups).forEach((group: any) => {
      group.percentage = (group.count / certificates.length) * 100;
    });
    
    return groups;
  }

  private generateTimeSeriesData(period: 'daily' | 'monthly', count: number): any[] {
    const data = [];
    
    for (let i = count - 1; i >= 0; i--) {
      const date = new Date();
      if (period === 'daily') {
        date.setDate(date.getDate() - i);
      } else {
        date.setMonth(date.getMonth() - i);
      }
      
      data.push({
        date: date.toISOString().split('T')[0],
        newCertificates: Math.floor(Math.random() * 10) + 1,
        totalSupply: (Math.random() * 100000 + 500000).toFixed(0),
        tradingVolume: (Math.random() * 50000 + 100000).toFixed(0),
        averagePrice: (Math.random() * 30 + 40).toFixed(2),
      });
    }
    
    return data;
  }
}

// Export singleton instance
export const irecMockDataGenerator = new IrecMockDataGenerator();

// Export convenience functions
export function generateMockCertificates(count: number = 50): IrecCertificateComplete[] {
  return irecMockDataGenerator.generateMultipleCertificates(count);
}

export function generateMockAnalytics(certificates: IrecCertificateComplete[]): IrecAnalytics {
  return irecMockDataGenerator.generateAnalytics(certificates);
}