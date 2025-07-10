// Enhanced mock data generator for Grafana-style dashboard features
// Generates comprehensive data for payment methods, tokenization metrics, and real-time stats

import type { ProjectData } from "./co2e-api";
import type { 
  PaymentMethodData, 
  TokenizationMetrics, 
  RealTimeStats,
  GrafanaDataset 
} from "./grafana-data-manager";
import type { RetirementTransaction } from "./types";
import { retirementDataGenerator } from "./retirement-data-generator";

export interface PaymentMethodTransaction {
  id: string;
  retirementId: string;
  paymentMethod: 'aisPoint' | 'fiat' | 'crypto' | 'other';
  amount: string;
  currency: string;
  exchangeRate?: number;
  processingFee: number;
  transactionHash?: string;
  paymentProcessor: string;
  paymentDetails: {
    cardLast4?: string;
    cryptoAddress?: string;
    aisPointBalance?: string;
    otherMethod?: string;
  };
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
}

export interface TokenizationEvent {
  id: string;
  projectId: string;
  projectName: string;
  tokensCreated: string;
  methodology: string;
  vintage: string;
  tokenAddress: string;
  creatorAddress: string;
  verifierAddress: string;
  tokenizationDate: string;
  registryId: string;
  batchId: string;
  serialNumbers: string[];
  verificationData: {
    auditReport?: string;
    certificationHash: string;
    verificationLevel: 'gold' | 'silver' | 'bronze';
  };
  metadata: {
    co2ePerToken: number;
    projectLocation: string;
    additionalBenefits?: string[];
  };
  status: 'active' | 'retired' | 'locked' | 'disputed';
}

export interface MarketActivity {
  timestamp: string;
  type: 'retirement' | 'tokenization' | 'transfer' | 'trade';
  projectId: string;
  amount: string;
  price?: number;
  paymentMethod?: string;
  volume: number;
  participants: {
    buyer?: string;
    seller?: string;
    tokenizer?: string;
    retirer?: string;
  };
}

export interface NetworkMetrics {
  timestamp: string;
  blockHeight: number;
  gasPrice: number;
  gasUsed: number;
  transactionCount: number;
  uniqueAddresses: number;
  networkHashRate: number;
  difficulty: number;
  blockTime: number;
  pendingTransactions: number;
}

export class EnhancedMockGenerator {
  private readonly PAYMENT_METHOD_WEIGHTS = {
    aisPoint: 0.45,    // 45% AIS Point
    fiat: 0.30,        // 30% Fiat (Credit cards, bank transfers)
    crypto: 0.20,      // 20% Cryptocurrency
    other: 0.05        // 5% Other methods
  };

  private readonly CRYPTO_CURRENCIES = [
    'ETH', 'BTC', 'USDC', 'USDT', 'MATIC', 'BNB', 'ADA', 'SOL'
  ];

  private readonly FIAT_CURRENCIES = [
    'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'SGD', 'HKD'
  ];

  private readonly PAYMENT_PROCESSORS = {
    aisPoint: ['AIS Payment Gateway', 'AIS Wallet', 'AIS Direct'],
    fiat: ['Stripe', 'PayPal', 'Adyen', 'Square', 'Checkout.com'],
    crypto: ['MetaMask', 'WalletConnect', 'Coinbase Wallet', 'Trust Wallet'],
    other: ['Bank Transfer', 'Wire Transfer', 'Check', 'ACH']
  };

  private readonly TOKENIZATION_LEVELS = {
    gold: { weight: 0.2, auditRequired: true, minProjectSize: 100000 },
    silver: { weight: 0.5, auditRequired: true, minProjectSize: 50000 },
    bronze: { weight: 0.3, auditRequired: false, minProjectSize: 10000 }
  };

  /**
   * Generate comprehensive payment method data
   */
  generatePaymentMethodData(retirements: RetirementTransaction[]): PaymentMethodData {
    const paymentTransactions = this.generatePaymentTransactions(retirements);
    
    // Aggregate by payment method
    const aggregated: Record<string, { 
      transactions: PaymentMethodTransaction[]; 
      amount: number; 
      co2eAmount: number; 
      count: number; 
      fees: number; 
    }> = {
      aisPoint: { transactions: [], amount: 0, co2eAmount: 0, count: 0, fees: 0 },
      fiat: { transactions: [], amount: 0, co2eAmount: 0, count: 0, fees: 0 },
      crypto: { transactions: [], amount: 0, co2eAmount: 0, count: 0, fees: 0 },
      other: { transactions: [], amount: 0, co2eAmount: 0, count: 0, fees: 0 }
    };

    for (const transaction of paymentTransactions) {
      const method = transaction.paymentMethod;
      aggregated[method].transactions.push(transaction);
      aggregated[method].amount += parseFloat(transaction.amount);
      aggregated[method].co2eAmount += parseFloat(transaction.amount); // 1:1 for simplicity
      aggregated[method].count++;
      aggregated[method].fees += transaction.processingFee;
    }

    const totalAmount = Object.values(aggregated).reduce((sum, m) => sum + m.amount, 0);

    return {
      aisPoint: {
        count: aggregated.aisPoint.count,
        amount: aggregated.aisPoint.amount.toFixed(2),
        co2eAmount: aggregated.aisPoint.co2eAmount.toFixed(2),
        percentage: totalAmount > 0 ? (aggregated.aisPoint.amount / totalAmount) * 100 : 0,
        avgTransactionSize: aggregated.aisPoint.count > 0 ? aggregated.aisPoint.amount / aggregated.aisPoint.count : 0,
        trend: this.calculatePaymentMethodTrend('aisPoint', paymentTransactions)
      },
      fiat: {
        count: aggregated.fiat.count,
        amount: aggregated.fiat.amount.toFixed(2),
        co2eAmount: aggregated.fiat.co2eAmount.toFixed(2),
        percentage: totalAmount > 0 ? (aggregated.fiat.amount / totalAmount) * 100 : 0,
        avgTransactionSize: aggregated.fiat.count > 0 ? aggregated.fiat.amount / aggregated.fiat.count : 0,
        trend: this.calculatePaymentMethodTrend('fiat', paymentTransactions)
      },
      crypto: {
        count: aggregated.crypto.count,
        amount: aggregated.crypto.amount.toFixed(2),
        co2eAmount: aggregated.crypto.co2eAmount.toFixed(2),
        percentage: totalAmount > 0 ? (aggregated.crypto.amount / totalAmount) * 100 : 0,
        avgTransactionSize: aggregated.crypto.count > 0 ? aggregated.crypto.amount / aggregated.crypto.count : 0,
        trend: this.calculatePaymentMethodTrend('crypto', paymentTransactions)
      },
      other: {
        count: aggregated.other.count,
        amount: aggregated.other.amount.toFixed(2),
        co2eAmount: aggregated.other.co2eAmount.toFixed(2),
        percentage: totalAmount > 0 ? (aggregated.other.amount / totalAmount) * 100 : 0,
        avgTransactionSize: aggregated.other.count > 0 ? aggregated.other.amount / aggregated.other.count : 0,
        trend: this.calculatePaymentMethodTrend('other', paymentTransactions)
      }
    };
  }

  /**
   * Generate tokenization metrics and events
   */
  generateTokenizationMetrics(projects: ProjectData[]): TokenizationMetrics {
    const tokenizationEvents = this.generateTokenizationEvents(projects);
    
    const totalTokenized = tokenizationEvents.reduce((sum, event) => 
      sum + parseInt(event.tokensCreated), 0
    );

    // Calculate tokenization rate (events per day over last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEvents = tokenizationEvents.filter(event => 
      new Date(event.tokenizationDate) >= thirtyDaysAgo
    );
    
    const tokenizationRate = recentEvents.length / 30;

    // Generate history
    const history = this.generateTokenizationHistory(tokenizationEvents);

    // Calculate top tokenizers
    const topTokenizers = this.calculateTopTokenizers(tokenizationEvents);

    // Calculate trend
    const tokenizationTrend = this.calculateTokenizationTrend(history);

    return {
      totalTokenized: totalTokenized.toString(),
      tokenizationRate,
      averageTokenSize: totalTokenized / tokenizationEvents.length,
      tokenizationTrend,
      projectsTokenized: projects.length,
      pendingTokenization: Math.floor(totalTokenized * 0.03).toString(), // 3% pending
      tokenizationHistory: history,
      topTokenizers
    };
  }

  /**
   * Generate real-time statistics
   */
  generateRealTimeStats(projects: ProjectData[], retirements: RetirementTransaction[]): RealTimeStats {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    // Recent activity
    const recentRetirements = retirements.filter(r => 
      new Date(r.retirementDate) >= oneHourAgo
    );

    // Network metrics
    const networkMetrics = this.generateNetworkMetrics();
    
    // Market metrics
    const totalMarketCap = projects.reduce((sum, p) => {
      const price = parseFloat(p.pricing?.currentPrice || '40');
      const supply = parseInt(p.totalSupply || '0');
      return sum + (price * supply);
    }, 0);

    const totalVolume24h = recentRetirements.reduce((sum, r) => {
      const amount = parseInt(r.amountCO2e);
      const price = 40; // Assume $40 per tonne
      return sum + (amount * price);
    }, 0) * 24; // Extrapolate to 24 hours

    const avgPrice = projects.reduce((sum, p) => 
      sum + parseFloat(p.pricing?.currentPrice || '40'), 0
    ) / projects.length;

    const priceVolatility = this.calculateRealTimePriceVolatility(projects);

    return {
      activeRetirements: recentRetirements.length,
      retirementRate: recentRetirements.length, // per hour
      avgRetirementSize: recentRetirements.length > 0 ? 
        recentRetirements.reduce((sum, r) => sum + parseInt(r.amountCO2e), 0) / recentRetirements.length : 0,
      totalValueLocked: this.calculateTotalValueLocked(projects),
      networkActivity: {
        transactionsPerHour: networkMetrics.transactionCount,
        gasUsageAvg: networkMetrics.gasUsed / networkMetrics.transactionCount,
        successRate: this.calculateSuccessRate(retirements)
      },
      marketMetrics: {
        totalMarketCap: totalMarketCap.toFixed(2),
        totalVolume24h: totalVolume24h.toFixed(2),
        avgPrice,
        priceVolatility
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate comprehensive market activity data
   */
  generateMarketActivity(
    projects: ProjectData[], 
    retirements: RetirementTransaction[],
    days: number = 30
  ): MarketActivity[] {
    const activities: MarketActivity[] = [];
    
    // Generate retirement activities
    for (const retirement of retirements.slice(0, 100)) { // Limit for performance
      activities.push({
        timestamp: retirement.retirementDate,
        type: 'retirement',
        projectId: retirement.projectId,
        amount: retirement.amountCO2e,
        price: parseFloat(projects.find(p => p.id === retirement.projectId)?.pricing?.currentPrice || '40'),
        volume: parseInt(retirement.amountCO2e) * parseFloat(projects.find(p => p.id === retirement.projectId)?.pricing?.currentPrice || '40'),
        participants: {
          retirer: retirement.retiredBy.address
        }
      });
    }

    // Generate tokenization activities
    const tokenizationEvents = this.generateTokenizationEvents(projects.slice(0, 20));
    for (const event of tokenizationEvents) {
      activities.push({
        timestamp: event.tokenizationDate,
        type: 'tokenization',
        projectId: event.projectId,
        amount: event.tokensCreated,
        volume: parseInt(event.tokensCreated) * event.metadata.co2ePerToken * 40,
        participants: {
          tokenizer: event.creatorAddress
        }
      });
    }

    // Generate trading activities
    const tradingActivities = this.generateTradingActivities(projects, Math.floor(activities.length * 0.3));
    activities.push(...tradingActivities);

    // Sort by timestamp (most recent first)
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, days * 10); // Limit based on days
  }

  /**
   * Generate network performance metrics
   */
  generateNetworkMetrics(): NetworkMetrics {
    const now = new Date();
    
    return {
      timestamp: now.toISOString(),
      blockHeight: 1298000 + Math.floor(Math.random() * 1000),
      gasPrice: 20 + Math.random() * 100, // 20-120 gwei
      gasUsed: 21000 + Math.random() * 500000, // 21k - 521k gas
      transactionCount: Math.floor(150 + Math.random() * 50), // 150-200 tx per hour
      uniqueAddresses: Math.floor(80 + Math.random() * 40), // 80-120 unique addresses
      networkHashRate: 180000000 + Math.random() * 20000000, // Network hash rate
      difficulty: 13500000000000000 + Math.random() * 1000000000000000,
      blockTime: 12 + Math.random() * 3, // 12-15 seconds
      pendingTransactions: Math.floor(Math.random() * 50) // 0-50 pending
    };
  }

  /**
   * Generate time series data for charts
   */
  generateTimeSeriesData(
    metric: 'retirements' | 'tokenization' | 'prices' | 'volume',
    interval: 'hourly' | 'daily' | 'weekly',
    points: number = 30
  ): Array<{ timestamp: string; value: number; volume?: number }> {
    const data: Array<{ timestamp: string; value: number; volume?: number }> = [];
    const now = new Date();
    
    let intervalMs: number;
    switch (interval) {
      case 'hourly':
        intervalMs = 60 * 60 * 1000; // 1 hour
        break;
      case 'daily':
        intervalMs = 24 * 60 * 60 * 1000; // 1 day
        break;
      case 'weekly':
        intervalMs = 7 * 24 * 60 * 60 * 1000; // 1 week
        break;
    }

    for (let i = points; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * intervalMs));
      let value: number;
      let volume: number | undefined;

      switch (metric) {
        case 'retirements':
          value = Math.floor(10 + Math.random() * 50 + Math.sin(i / 5) * 10); // 10-70 with trend
          volume = value * (30 + Math.random() * 20); // USD volume
          break;
        case 'tokenization':
          value = Math.floor(50000 + Math.random() * 200000 + i * 1000); // Growing trend
          volume = value * 0.4; // Lower volume for tokenization
          break;
        case 'prices':
          value = 35 + Math.random() * 15 + Math.sin(i / 10) * 5; // $35-55 with cycles
          volume = Math.floor(1000 + Math.random() * 5000); // Trading volume
          break;
        case 'volume':
          value = Math.floor(10000 + Math.random() * 50000 + Math.cos(i / 7) * 10000);
          break;
        default:
          value = Math.random() * 100;
      }

      data.push({
        timestamp: timestamp.toISOString(),
        value: parseFloat(value.toFixed(2)),
        ...(volume !== undefined && { volume: parseFloat(volume.toFixed(2)) })
      });
    }

    return data;
  }

  // Private helper methods

  private generatePaymentTransactions(retirements: RetirementTransaction[]): PaymentMethodTransaction[] {
    const transactions: PaymentMethodTransaction[] = [];
    
    for (const retirement of retirements) {
      const paymentMethod = this.selectPaymentMethod(retirement.retiredBy.type);
      const amount = parseFloat(retirement.amountCO2e);
      const basePrice = 40; // $40 per tonne CO2e
      const totalAmount = amount * basePrice;
      
      const transaction: PaymentMethodTransaction = {
        id: `payment_${retirement.id}`,
        retirementId: retirement.id,
        paymentMethod,
        amount: totalAmount.toFixed(2),
        currency: this.selectCurrency(paymentMethod),
        exchangeRate: paymentMethod === 'crypto' ? (0.8 + Math.random() * 0.4) : undefined,
        processingFee: this.calculateProcessingFee(totalAmount, paymentMethod),
        transactionHash: paymentMethod === 'crypto' ? this.generateTransactionHash() : undefined,
        paymentProcessor: this.selectPaymentProcessor(paymentMethod),
        paymentDetails: this.generatePaymentDetails(paymentMethod),
        status: Math.random() > 0.02 ? 'completed' : (Math.random() > 0.5 ? 'pending' : 'failed'),
        timestamp: retirement.retirementDate
      };
      
      transactions.push(transaction);
    }
    
    return transactions;
  }

  private generateTokenizationEvents(projects: ProjectData[]): TokenizationEvent[] {
    const events: TokenizationEvent[] = [];
    
    for (const project of projects) {
      const eventCount = Math.floor(1 + Math.random() * 3); // 1-3 events per project
      
      for (let i = 0; i < eventCount; i++) {
        const tokensCreated = Math.floor(parseInt(project.totalSupply || '0') / eventCount);
        const verificationLevel = this.selectVerificationLevel(tokensCreated);
        
        const event: TokenizationEvent = {
          id: `tokenization_${project.id}_${i + 1}`,
          projectId: project.id,
          projectName: project.name,
          tokensCreated: tokensCreated.toString(),
          methodology: project.methodology,
          vintage: project.vintage,
          tokenAddress: project.tokenAddress,
          creatorAddress: this.generateAddress(),
          verifierAddress: this.generateAddress(),
          tokenizationDate: this.generateTokenizationDate(project),
          registryId: `REG_${project.registry}_${Math.floor(Math.random() * 10000)}`,
          batchId: `BATCH_${Date.now()}_${i}`,
          serialNumbers: this.generateSerialNumbers(tokensCreated, i),
          verificationData: {
            auditReport: verificationLevel !== 'bronze' ? `audit_report_${project.id}_${i}.pdf` : undefined,
            certificationHash: this.generateHash(),
            verificationLevel
          },
          metadata: {
            co2ePerToken: 1, // 1 tonne CO2e per token
            projectLocation: project.country,
            additionalBenefits: this.generateAdditionalBenefits(project.methodology)
          },
          status: this.selectTokenizationStatus()
        };
        
        events.push(event);
      }
    }
    
    return events.sort((a, b) => 
      new Date(b.tokenizationDate).getTime() - new Date(a.tokenizationDate).getTime()
    );
  }

  private generateTradingActivities(projects: ProjectData[], count: number): MarketActivity[] {
    const activities: MarketActivity[] = [];
    
    for (let i = 0; i < count; i++) {
      const project = projects[Math.floor(Math.random() * projects.length)];
      const tradeAmount = Math.floor(100 + Math.random() * 10000);
      const price = parseFloat(project.pricing?.currentPrice || '40') * (0.95 + Math.random() * 0.1);
      
      const activity: MarketActivity = {
        timestamp: this.generateRecentTimestamp(30),
        type: Math.random() > 0.5 ? 'trade' : 'transfer',
        projectId: project.id,
        amount: tradeAmount.toString(),
        price,
        volume: tradeAmount * price,
        participants: {
          buyer: this.generateAddress(),
          seller: this.generateAddress()
        }
      };
      
      activities.push(activity);
    }
    
    return activities;
  }

  private selectPaymentMethod(retirerType: string): 'aisPoint' | 'fiat' | 'crypto' | 'other' {
    // Adjust weights based on retirer type
    let weights = { ...this.PAYMENT_METHOD_WEIGHTS };
    
    if (retirerType === 'individual') {
      weights.aisPoint = 0.60; // Individuals prefer AIS points
      weights.crypto = 0.25;
      weights.fiat = 0.10;
      weights.other = 0.05;
    } else if (retirerType === 'corporation') {
      weights.fiat = 0.50; // Corporations prefer traditional payments
      weights.aisPoint = 0.30;
      weights.crypto = 0.15;
      weights.other = 0.05;
    }
    
    const random = Math.random();
    let cumulative = 0;
    
    for (const [method, weight] of Object.entries(weights)) {
      cumulative += weight;
      if (random <= cumulative) {
        return method as 'aisPoint' | 'fiat' | 'crypto' | 'other';
      }
    }
    
    return 'aisPoint';
  }

  private selectCurrency(paymentMethod: string): string {
    switch (paymentMethod) {
      case 'crypto':
        return this.CRYPTO_CURRENCIES[Math.floor(Math.random() * this.CRYPTO_CURRENCIES.length)];
      case 'fiat':
        return this.FIAT_CURRENCIES[Math.floor(Math.random() * this.FIAT_CURRENCIES.length)];
      case 'aisPoint':
        return 'AIS';
      default:
        return 'USD';
    }
  }

  private calculateProcessingFee(amount: number, paymentMethod: string): number {
    const feeRates = {
      aisPoint: 0.01,   // 1%
      fiat: 0.029,      // 2.9%
      crypto: 0.015,    // 1.5%
      other: 0.02       // 2%
    };
    
    return amount * (feeRates[paymentMethod as keyof typeof feeRates] || 0.02);
  }

  private selectPaymentProcessor(paymentMethod: string): string {
    const processors = this.PAYMENT_PROCESSORS[paymentMethod as keyof typeof this.PAYMENT_PROCESSORS];
    return processors[Math.floor(Math.random() * processors.length)];
  }

  private generatePaymentDetails(paymentMethod: string): PaymentMethodTransaction['paymentDetails'] {
    switch (paymentMethod) {
      case 'fiat':
        return {
          cardLast4: Math.floor(1000 + Math.random() * 9000).toString()
        };
      case 'crypto':
        return {
          cryptoAddress: this.generateAddress()
        };
      case 'aisPoint':
        return {
          aisPointBalance: Math.floor(1000 + Math.random() * 50000).toString()
        };
      default:
        return {
          otherMethod: 'Bank Transfer'
        };
    }
  }

  private calculatePaymentMethodTrend(
    method: string, 
    transactions: PaymentMethodTransaction[]
  ): number {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

    const recent = transactions.filter(t => 
      t.paymentMethod === method && new Date(t.timestamp) >= yesterday
    ).length;

    const previous = transactions.filter(t => 
      t.paymentMethod === method && 
      new Date(t.timestamp) >= twoDaysAgo && 
      new Date(t.timestamp) < yesterday
    ).length;

    if (previous === 0) return recent > 0 ? 100 : 0;
    return ((recent - previous) / previous) * 100;
  }

  private generateTokenizationHistory(events: TokenizationEvent[]): TokenizationMetrics['tokenizationHistory'] {
    const history: Record<string, { date: string; amount: number; count: number; projects: Set<string> }> = {};

    for (const event of events) {
      const date = new Date(event.tokenizationDate).toISOString().split('T')[0];
      if (!history[date]) {
        history[date] = { date, amount: 0, count: 0, projects: new Set() };
      }
      history[date].amount += parseInt(event.tokensCreated);
      history[date].count++;
      history[date].projects.add(event.projectId);
    }

    return Object.values(history)
      .map(h => ({
        date: h.date,
        amount: h.amount.toString(),
        count: h.count,
        projects: Array.from(h.projects)
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 30);
  }

  private calculateTopTokenizers(events: TokenizationEvent[]): TokenizationMetrics['topTokenizers'] {
    const tokenizers: Record<string, { address: string; amount: number; count: number }> = {};
    const totalAmount = events.reduce((sum, e) => sum + parseInt(e.tokensCreated), 0);

    for (const event of events) {
      const address = event.creatorAddress;
      if (!tokenizers[address]) {
        tokenizers[address] = { address, amount: 0, count: 0 };
      }
      tokenizers[address].amount += parseInt(event.tokensCreated);
      tokenizers[address].count++;
    }

    return Object.values(tokenizers)
      .map(t => ({
        address: t.address,
        name: this.generateTokenizerName(),
        amount: t.amount.toString(),
        count: t.count,
        percentage: (t.amount / totalAmount) * 100
      }))
      .sort((a, b) => parseInt(b.amount) - parseInt(a.amount))
      .slice(0, 10);
  }

  private calculateTokenizationTrend(history: TokenizationMetrics['tokenizationHistory']): number {
    if (history.length < 7) return 0;

    const recent7Days = history.slice(0, 7);
    const previous7Days = history.slice(7, 14);

    const recentTotal = recent7Days.reduce((sum, h) => sum + parseInt(h.amount), 0);
    const previousTotal = previous7Days.reduce((sum, h) => sum + parseInt(h.amount), 0);

    if (previousTotal === 0) return recentTotal > 0 ? 100 : 0;
    return ((recentTotal - previousTotal) / previousTotal) * 100;
  }

  private calculateRealTimePriceVolatility(projects: ProjectData[]): number {
    const prices = projects.map(p => parseFloat(p.pricing?.currentPrice || '40'));
    const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const variance = prices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / prices.length;
    return (Math.sqrt(variance) / avgPrice) * 100;
  }

  private calculateTotalValueLocked(projects: ProjectData[]): string {
    const totalLocked = projects.reduce((sum, p) => {
      const price = parseFloat(p.pricing?.currentPrice || '40');
      const lockedSupply = parseInt(p.totalSupply || '0') - parseInt(p.currentSupply || '0');
      return sum + (price * lockedSupply);
    }, 0);
    
    return totalLocked.toFixed(2);
  }

  private calculateSuccessRate(retirements: RetirementTransaction[]): number {
    const successful = retirements.filter(r => r.status === 'confirmed').length;
    return (successful / retirements.length) * 100;
  }

  private selectVerificationLevel(tokensCreated: number): 'gold' | 'silver' | 'bronze' {
    const levels = this.TOKENIZATION_LEVELS;
    
    if (tokensCreated >= levels.gold.minProjectSize && Math.random() < levels.gold.weight) {
      return 'gold';
    } else if (tokensCreated >= levels.silver.minProjectSize && Math.random() < levels.silver.weight) {
      return 'silver';
    } else {
      return 'bronze';
    }
  }

  private generateTokenizationDate(project: ProjectData): string {
    // Generate date within last 2 years, weighted toward recent
    const now = new Date();
    const twoYearsAgo = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
    const timeRange = now.getTime() - twoYearsAgo.getTime();
    
    // Weight toward recent dates (exponential distribution)
    const random = Math.pow(Math.random(), 2); // Square for recent bias
    const timestamp = twoYearsAgo.getTime() + (random * timeRange);
    
    return new Date(timestamp).toISOString();
  }

  private generateSerialNumbers(tokensCreated: number, batchIndex: number): string[] {
    const baseSerial = 2000000 + (batchIndex * 100000);
    const serialCount = Math.min(tokensCreated, 10); // Max 10 serials shown
    
    return Array.from({ length: serialCount }, (_, i) => 
      (baseSerial + i).toString()
    );
  }

  private generateAdditionalBenefits(methodology: string): string[] {
    const benefitsByMethodology = {
      'Afforestation/Reforestation': ['Biodiversity Enhancement', 'Soil Conservation', 'Water Cycle Regulation'],
      'Renewable Energy': ['Air Quality Improvement', 'Energy Independence', 'Grid Stability'],
      'Energy Efficiency': ['Cost Savings', 'Resource Conservation', 'Technology Innovation'],
      'Waste Management': ['Pollution Reduction', 'Resource Recovery', 'Public Health'],
      'Transportation': ['Air Quality', 'Noise Reduction', 'Urban Planning']
    };
    
    const benefits = benefitsByMethodology[methodology as keyof typeof benefitsByMethodology] || 
                     ['Environmental Protection', 'Sustainability'];
    
    // Return 1-3 random benefits
    const count = Math.floor(1 + Math.random() * 3);
    return benefits.sort(() => Math.random() - 0.5).slice(0, count);
  }

  private selectTokenizationStatus(): 'active' | 'retired' | 'locked' | 'disputed' {
    const weights = { active: 0.70, retired: 0.20, locked: 0.08, disputed: 0.02 };
    const random = Math.random();
    let cumulative = 0;
    
    for (const [status, weight] of Object.entries(weights)) {
      cumulative += weight;
      if (random <= cumulative) {
        return status as 'active' | 'retired' | 'locked' | 'disputed';
      }
    }
    
    return 'active';
  }

  private generateRecentTimestamp(maxDaysAgo: number): string {
    const now = new Date();
    const maxMs = maxDaysAgo * 24 * 60 * 60 * 1000;
    const randomMs = Math.random() * maxMs;
    return new Date(now.getTime() - randomMs).toISOString();
  }

  private generateTokenizerName(): string {
    const companies = [
      'GreenTech Solutions', 'Carbon Dynamics Inc', 'EcoVault Corp', 
      'Climate Bridge', 'Sustainable Ventures', 'Carbon Trust Ltd',
      'Green Horizon', 'Eco Impact Group', 'Climate Forward'
    ];
    return companies[Math.floor(Math.random() * companies.length)];
  }

  // Utility methods
  private generateTransactionHash(): string {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * 16)];
    }
    return hash;
  }

  private generateAddress(): string {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * 16)];
    }
    return address;
  }

  private generateHash(): string {
    return this.generateTransactionHash();
  }
}

// Export singleton instance
export const enhancedMockGenerator = new EnhancedMockGenerator();

// Export utility functions
export const generatePaymentMethodData = (retirements: RetirementTransaction[]): PaymentMethodData => 
  enhancedMockGenerator.generatePaymentMethodData(retirements);

export const generateTokenizationMetrics = (projects: ProjectData[]): TokenizationMetrics => 
  enhancedMockGenerator.generateTokenizationMetrics(projects);

export const generateRealTimeStats = (projects: ProjectData[], retirements: RetirementTransaction[]): RealTimeStats => 
  enhancedMockGenerator.generateRealTimeStats(projects, retirements);

export const generateMarketActivity = (
  projects: ProjectData[], 
  retirements: RetirementTransaction[], 
  days?: number
): MarketActivity[] => 
  enhancedMockGenerator.generateMarketActivity(projects, retirements, days);

export const generateTimeSeriesData = (
  metric: 'retirements' | 'tokenization' | 'prices' | 'volume',
  interval: 'hourly' | 'daily' | 'weekly',
  points?: number
): Array<{ timestamp: string; value: number; volume?: number }> => 
  enhancedMockGenerator.generateTimeSeriesData(metric, interval, points);

export const generateNetworkMetrics = (): NetworkMetrics => 
  enhancedMockGenerator.generateNetworkMetrics();