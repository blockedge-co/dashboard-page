// Credit retirement tracking service
// Handles fetching, processing, and caching retirement data with payment method analytics

import { 
  RetirementTransaction, 
  RetirementStats, 
  PaymentMethod, 
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHOD_CATEGORIES
} from "./types";

class RetirementService {
  private static instance: RetirementService;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private readonly DEFAULT_TTL = 2 * 60 * 1000; // 2 minutes

  static getInstance(): RetirementService {
    if (!RetirementService.instance) {
      RetirementService.instance = new RetirementService();
    }
    return RetirementService.instance;
  }

  private generateMockRetirementData(): RetirementTransaction[] {
    const paymentMethods = Object.values(PAYMENT_METHODS);
    const projects = [
      { id: "proj_001", name: "Amazon Rainforest Conservation" },
      { id: "proj_002", name: "Wind Farm Development" },
      { id: "proj_003", name: "Solar Panel Installation" },
      { id: "proj_004", name: "Reforestation Initiative" },
      { id: "proj_005", name: "Biomass Energy Project" }
    ];

    const retirements: RetirementTransaction[] = [];
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // Generate 100 retirement transactions over last 30 days
    for (let i = 0; i < 100; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(now - (daysAgo * oneDay));
      const project = projects[Math.floor(Math.random() * projects.length)];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      // Weight AIS Points to be more common (40% of transactions)
      const weightedPaymentMethod = Math.random() < 0.4 ? PAYMENT_METHODS.AIS_POINTS : paymentMethod;
      
      const amount = (Math.random() * 100 + 10).toFixed(2);
      const co2eAmount = (parseFloat(amount) * 1.1).toFixed(2);
      
      let currency = "USD";
      let usdValue = amount;
      let exchangeRate = 1;

      // Set currency based on payment method
      if (weightedPaymentMethod === PAYMENT_METHODS.CRYPTO_ETH) {
        currency = "ETH";
        exchangeRate = 0.0005; // Example rate
        usdValue = (parseFloat(amount) / exchangeRate).toFixed(2);
      } else if (weightedPaymentMethod === PAYMENT_METHODS.CRYPTO_BTC) {
        currency = "BTC";
        exchangeRate = 0.000025; // Example rate
        usdValue = (parseFloat(amount) / exchangeRate).toFixed(2);
      } else if (weightedPaymentMethod === PAYMENT_METHODS.FIAT_EUR) {
        currency = "EUR";
        exchangeRate = 0.85; // Example rate
        usdValue = (parseFloat(amount) / exchangeRate).toFixed(2);
      } else if (weightedPaymentMethod === PAYMENT_METHODS.AIS_POINTS) {
        currency = "AIS";
        exchangeRate = 0.01; // 1 AIS point = $0.01
        usdValue = (parseFloat(amount) * 100 * exchangeRate).toFixed(2);
      }

      retirements.push({
        id: `ret_${i.toString().padStart(3, '0')}`,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        projectId: project.id,
        projectName: project.name,
        tokenAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        amount,
        amountCO2e: co2eAmount,
        retiredBy: {
          address: `0x${Math.random().toString(16).substr(2, 40)}`,
          name: `User ${i}`,
          type: Math.random() < 0.7 ? "individual" : "corporation"
        },
        payment: {
          method: weightedPaymentMethod,
          amount,
          currency,
          exchangeRate,
          usdValue,
          provider: this.getPaymentProvider(weightedPaymentMethod),
          transactionId: `txn_${Math.random().toString(16).substr(2, 16)}`,
          fees: [{
            amount: (parseFloat(usdValue) * 0.03).toFixed(2),
            currency: "USD",
            type: "platform"
          }]
        },
        retirementDate: date.toISOString(),
        vintage: (2023 - Math.floor(Math.random() * 3)).toString(),
        methodology: "VCS",
        registry: "Verra",
        status: "confirmed",
        blockNumber: 1000000 + i,
        createdAt: date.toISOString(),
        updatedAt: date.toISOString()
      });
    }

    return retirements.sort((a, b) => 
      new Date(b.retirementDate).getTime() - new Date(a.retirementDate).getTime()
    );
  }

  private getPaymentProvider(method: PaymentMethod): string {
    switch (method) {
      case PAYMENT_METHODS.AIS_POINTS:
        return "AIS Platform";
      case PAYMENT_METHODS.CREDIT_CARD:
        return "Stripe";
      case PAYMENT_METHODS.PAYPAL:
        return "PayPal";
      case PAYMENT_METHODS.BANK_TRANSFER:
        return "Bank Wire";
      case PAYMENT_METHODS.CRYPTO_ETH:
      case PAYMENT_METHODS.CRYPTO_BTC:
      case PAYMENT_METHODS.CRYPTO_USDC:
      case PAYMENT_METHODS.CRYPTO_USDT:
        return "Blockchain";
      default:
        return "Platform";
    }
  }

  private getCacheKey(key: string): string {
    return `retirement_${key}`;
  }

  private setCache(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(this.getCacheKey(key), {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private getCache(key: string): any | null {
    const cached = this.cache.get(this.getCacheKey(key));
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(this.getCacheKey(key));
      return null;
    }
    
    return cached.data;
  }

  async getRetirementTransactions(limit?: number): Promise<RetirementTransaction[]> {
    const cacheKey = `transactions_${limit || 'all'}`;
    const cached = this.getCache(cacheKey);
    if (cached) return cached;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const transactions = this.generateMockRetirementData();
    const result = limit ? transactions.slice(0, limit) : transactions;
    
    this.setCache(cacheKey, result);
    return result;
  }

  async getRetirementStats(): Promise<RetirementStats> {
    const cached = this.getCache('stats');
    if (cached) return cached;

    const transactions = await this.getRetirementTransactions();
    const stats = this.calculateRetirementStats(transactions);
    
    this.setCache('stats', stats);
    return stats;
  }

  private calculateRetirementStats(transactions: RetirementTransaction[]): RetirementStats {
    const totalCredits = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalCO2e = transactions.reduce((sum, t) => sum + parseFloat(t.amountCO2e), 0);
    const totalUSDValue = transactions.reduce((sum, t) => sum + parseFloat(t.payment.usdValue), 0);

    // Calculate by payment method
    const byPaymentMethod: Record<PaymentMethod, any> = {} as any;
    const paymentMethodCounts: Record<PaymentMethod, number> = {} as any;
    const paymentMethodAmounts: Record<PaymentMethod, number> = {} as any;
    const paymentMethodValues: Record<PaymentMethod, number> = {} as any;

    Object.values(PAYMENT_METHODS).forEach(method => {
      paymentMethodCounts[method] = 0;
      paymentMethodAmounts[method] = 0;
      paymentMethodValues[method] = 0;
    });

    transactions.forEach(tx => {
      const method = tx.payment.method;
      paymentMethodCounts[method]++;
      paymentMethodAmounts[method] += parseFloat(tx.amount);
      paymentMethodValues[method] += parseFloat(tx.payment.usdValue);
    });

    Object.values(PAYMENT_METHODS).forEach(method => {
      const count = paymentMethodCounts[method];
      const amount = paymentMethodAmounts[method];
      const value = paymentMethodValues[method];
      
      byPaymentMethod[method] = {
        count,
        amount: amount.toFixed(2),
        co2eAmount: (amount * 1.1).toFixed(2),
        usdValue: value.toFixed(2),
        percentage: totalCredits > 0 ? ((amount / totalCredits) * 100) : 0,
        averageAmount: count > 0 ? (amount / count).toFixed(2) : "0.00",
        trend: {
          growthRate: Math.random() * 20 - 10, // Mock growth rate
          changeFromPrevious: Math.random() * 40 - 20 // Mock change
        }
      };
    });

    // Calculate time series data
    const now = new Date();
    const dailyData: any[] = [];
    const monthlyData: any[] = [];
    const yearlyData: any[] = [];

    // Generate daily data for last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTransactions = transactions.filter(t => 
        t.retirementDate.startsWith(dateStr)
      );
      
      const dayPaymentMethods: Record<PaymentMethod, any> = {} as any;
      Object.values(PAYMENT_METHODS).forEach(method => {
        const methodTxs = dayTransactions.filter(t => t.payment.method === method);
        dayPaymentMethods[method] = {
          count: methodTxs.length,
          amount: methodTxs.reduce((sum, t) => sum + parseFloat(t.amount), 0).toFixed(2),
          usdValue: methodTxs.reduce((sum, t) => sum + parseFloat(t.payment.usdValue), 0).toFixed(2)
        };
      });

      dailyData.push({
        date: dateStr,
        count: dayTransactions.length,
        amount: dayTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0).toFixed(2),
        co2eAmount: dayTransactions.reduce((sum, t) => sum + parseFloat(t.amountCO2e), 0).toFixed(2),
        byPaymentMethod: dayPaymentMethods
      });
    }

    // Generate monthly data for last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = date.toISOString().slice(0, 7);
      
      const monthTransactions = transactions.filter(t => 
        t.retirementDate.startsWith(monthStr)
      );
      
      const monthPaymentMethods: Record<PaymentMethod, any> = {} as any;
      Object.values(PAYMENT_METHODS).forEach(method => {
        const methodTxs = monthTransactions.filter(t => t.payment.method === method);
        monthPaymentMethods[method] = {
          count: methodTxs.length,
          amount: methodTxs.reduce((sum, t) => sum + parseFloat(t.amount), 0).toFixed(2),
          usdValue: methodTxs.reduce((sum, t) => sum + parseFloat(t.payment.usdValue), 0).toFixed(2)
        };
      });

      monthlyData.push({
        month: monthStr,
        count: monthTransactions.length,
        amount: monthTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0).toFixed(2),
        co2eAmount: monthTransactions.reduce((sum, t) => sum + parseFloat(t.amountCO2e), 0).toFixed(2),
        byPaymentMethod: monthPaymentMethods
      });
    }

    // Find most popular and fastest growing payment methods
    const sortedByCount = Object.entries(byPaymentMethod).sort(([,a], [,b]) => b.count - a.count);
    const sortedByGrowth = Object.entries(byPaymentMethod).sort(([,a], [,b]) => b.trend.growthRate - a.trend.growthRate);
    
    const aisPointsData = byPaymentMethod[PAYMENT_METHODS.AIS_POINTS];
    const cryptoMethods = [
      PAYMENT_METHODS.CRYPTO_ETH,
      PAYMENT_METHODS.CRYPTO_BTC,
      PAYMENT_METHODS.CRYPTO_USDC,
      PAYMENT_METHODS.CRYPTO_USDT,
      PAYMENT_METHODS.CRYPTO_OTHER
    ];
    const cryptoCount = cryptoMethods.reduce((sum, method) => sum + byPaymentMethod[method].count, 0);

    return {
      total: {
        count: transactions.length,
        amount: totalCredits.toFixed(2),
        co2eAmount: totalCO2e.toFixed(2),
        value: totalUSDValue.toFixed(2)
      },
      byProject: {}, // Could be calculated if needed
      byRetirer: {}, // Could be calculated if needed
      byPaymentMethod,
      byTimeframe: {
        daily: dailyData,
        monthly: monthlyData,
        yearly: yearlyData
      },
      byMethodology: {}, // Could be calculated if needed
      trends: {
        growthRate: 15.5, // Mock overall growth rate
        averageRetirement: (totalCredits / transactions.length).toFixed(2),
        topRetirers: [], // Could be calculated if needed
        paymentMethodTrends: {
          mostPopular: sortedByCount[0][0] as PaymentMethod,
          fastestGrowing: sortedByGrowth[0][0] as PaymentMethod,
          aisPointsUsage: {
            percentage: (aisPointsData.count / transactions.length) * 100,
            trend: aisPointsData.trend.growthRate
          },
          cryptoAdoption: {
            percentage: (cryptoCount / transactions.length) * 100,
            trend: cryptoMethods.reduce((sum, method) => sum + byPaymentMethod[method].trend.growthRate, 0) / cryptoMethods.length
          }
        }
      }
    };
  }

  async getTodayStats(): Promise<{
    retiredToday: number;
    retiredThisMonth: number;
    aisPointsPercentage: number;
    topPaymentMethod: PaymentMethod;
  }> {
    const cached = this.getCache('today_stats');
    if (cached) return cached;

    const transactions = await this.getRetirementTransactions();
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().toISOString().slice(0, 7);
    
    const todayTransactions = transactions.filter(t => t.retirementDate.startsWith(today));
    const monthTransactions = transactions.filter(t => t.retirementDate.startsWith(thisMonth));
    
    const retiredToday = todayTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const retiredThisMonth = monthTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const aisPointsTransactions = transactions.filter(t => t.payment.method === PAYMENT_METHODS.AIS_POINTS);
    const aisPointsPercentage = (aisPointsTransactions.length / transactions.length) * 100;
    
    // Find most popular payment method
    const methodCounts: Record<PaymentMethod, number> = {} as any;
    Object.values(PAYMENT_METHODS).forEach(method => {
      methodCounts[method] = 0;
    });
    
    transactions.forEach(tx => {
      methodCounts[tx.payment.method]++;
    });
    
    const topPaymentMethod = Object.entries(methodCounts).sort(([,a], [,b]) => b - a)[0][0] as PaymentMethod;
    
    const result = {
      retiredToday,
      retiredThisMonth,
      aisPointsPercentage,
      topPaymentMethod
    };
    
    this.setCache('today_stats', result, 5 * 60 * 1000); // Cache for 5 minutes
    return result;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const retirementService = RetirementService.getInstance();
export default retirementService;