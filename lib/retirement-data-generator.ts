// Realistic retirement data generator following existing carbon credit patterns
// Generates consistent mock data based on real project characteristics

import type {
  RetirementTransaction,
  RetirementStats,
  ProjectWithRetirements,
  MarketData,
  PriceDataPoint,
  ValidationResult,
  ProjectId,
  TokenAmount,
  CO2eAmount,
  ContractAddress,
  TransactionHash,
  PaymentMethod,
} from "./types";
import type { ProjectData } from "./co2e-api";

/**
 * Retirement data generator that creates realistic mock data
 * following existing carbon credit tokenization patterns
 */
export class RetirementDataGenerator {
  private readonly RETIREMENT_REASONS = [
    "Corporate Net Zero Commitment",
    "Voluntary Carbon Offset",
    "Compliance Requirement",
    "ESG Investment Policy",
    "Event Carbon Neutrality",
    "Supply Chain Decarbonization",
    "Product Lifecycle Offset",
    "Annual Sustainability Report",
    "Climate Action Initiative",
    "Green Finance Mandate",
  ];

  private readonly COMPANY_TYPES = [
    "Technology Corporation",
    "Energy Company",
    "Financial Institution", 
    "Manufacturing Company",
    "Retail Corporation",
    "Healthcare Organization",
    "Transportation Company",
    "Real Estate Developer",
    "Consulting Firm",
    "Government Agency",
  ];

  private readonly INDIVIDUAL_PURPOSES = [
    "Personal Carbon Footprint",
    "Travel Offset",
    "Home Energy Use",
    "Investment Portfolio",
    "Climate Activism",
    "Educational Purpose",
    "Family Sustainability",
    "Business Travel",
    "Vehicle Emissions",
    "Lifestyle Commitment",
  ];

  /**
   * Generate retirement transactions for a project based on its characteristics
   */
  generateProjectRetirements(
    project: ProjectData,
    options: {
      count?: number;
      timeframeDays?: number;
      includeHistorical?: boolean;
    } = {}
  ): RetirementTransaction[] {
    const { count = this.calculateRealisticRetirementCount(project), timeframeDays = 90 } = options;
    const retirements: RetirementTransaction[] = [];
    
    const projectHash = this.hashString(project.id);
    const baseRetiredAmount = parseInt(project.retired || "0");
    
    // Calculate individual retirement amounts that sum to total retired
    const amounts = this.distributeRetirementAmounts(baseRetiredAmount, count, projectHash);
    
    for (let i = 0; i < count; i++) {
      const retirement = this.generateSingleRetirement(project, amounts[i], i, timeframeDays);
      retirements.push(retirement);
    }

    // Sort by retirement date (most recent first)
    return retirements.sort((a, b) => 
      new Date(b.retirementDate).getTime() - new Date(a.retirementDate).getTime()
    );
  }

  /**
   * Generate comprehensive retirement statistics for a project
   */
  generateRetirementStats(
    project: ProjectData,
    retirements: RetirementTransaction[]
  ): RetirementStats {
    const totalAmount = retirements.reduce((sum, r) => sum + parseInt(r.amount), 0);
    const totalCO2e = retirements.reduce((sum, r) => sum + parseInt(r.amountCO2e), 0);
    
    // Calculate average price from project pricing
    const avgPrice = parseFloat(project.pricing.currentPrice || "40");
    const totalValue = totalCO2e * avgPrice;

    return {
      total: {
        count: retirements.length,
        amount: totalAmount.toString(),
        co2eAmount: totalCO2e.toString(),
        value: totalValue.toFixed(2),
      },
      byProject: {
        [project.id]: {
          count: retirements.length,
          amount: totalAmount.toString(),
          co2eAmount: totalCO2e.toString(),
          percentage: 100, // This is for single project
        },
      },
      byRetirer: this.aggregateByRetirer(retirements),
      byTimeframe: this.aggregateByTimeframe(retirements),
      byMethodology: {
        [project.methodology]: {
          count: retirements.length,
          amount: totalAmount.toString(),
          co2eAmount: totalCO2e.toString(),
          percentage: 100,
        },
      },
      byPaymentMethod: {
        ais_points: { 
          count: 0, 
          amount: '0', 
          co2eAmount: '0', 
          usdValue: '0',
          percentage: 0, 
          averageAmount: '0',
          trend: { growthRate: 0, changeFromPrevious: 0 }
        },
        fiat_usd: { 
          count: 0, 
          amount: '0', 
          co2eAmount: '0', 
          usdValue: '0',
          percentage: 0, 
          averageAmount: '0',
          trend: { growthRate: 0, changeFromPrevious: 0 }
        },
        fiat_eur: { 
          count: 0, 
          amount: '0', 
          co2eAmount: '0', 
          usdValue: '0',
          percentage: 0, 
          averageAmount: '0',
          trend: { growthRate: 0, changeFromPrevious: 0 }
        },
        fiat_other: { 
          count: 0, 
          amount: '0', 
          co2eAmount: '0', 
          usdValue: '0',
          percentage: 0, 
          averageAmount: '0',
          trend: { growthRate: 0, changeFromPrevious: 0 }
        },
        crypto_eth: { 
          count: 0, 
          amount: '0', 
          co2eAmount: '0', 
          usdValue: '0',
          percentage: 0, 
          averageAmount: '0',
          trend: { growthRate: 0, changeFromPrevious: 0 }
        },
        crypto_btc: { 
          count: 0, 
          amount: '0', 
          co2eAmount: '0', 
          usdValue: '0',
          percentage: 0, 
          averageAmount: '0',
          trend: { growthRate: 0, changeFromPrevious: 0 }
        },
        crypto_usdc: { 
          count: 0, 
          amount: '0', 
          co2eAmount: '0', 
          usdValue: '0',
          percentage: 0, 
          averageAmount: '0',
          trend: { growthRate: 0, changeFromPrevious: 0 }
        },
        crypto_usdt: { 
          count: 0, 
          amount: '0', 
          co2eAmount: '0', 
          usdValue: '0',
          percentage: 0, 
          averageAmount: '0',
          trend: { growthRate: 0, changeFromPrevious: 0 }
        },
        crypto_other: { 
          count: 0, 
          amount: '0', 
          co2eAmount: '0', 
          usdValue: '0',
          percentage: 0, 
          averageAmount: '0',
          trend: { growthRate: 0, changeFromPrevious: 0 }
        },
        bank_transfer: { 
          count: 0, 
          amount: '0', 
          co2eAmount: '0', 
          usdValue: '0',
          percentage: 0, 
          averageAmount: '0',
          trend: { growthRate: 0, changeFromPrevious: 0 }
        },
        credit_card: { 
          count: 0, 
          amount: '0', 
          co2eAmount: '0', 
          usdValue: '0',
          percentage: 0, 
          averageAmount: '0',
          trend: { growthRate: 0, changeFromPrevious: 0 }
        },
        paypal: { 
          count: 0, 
          amount: '0', 
          co2eAmount: '0', 
          usdValue: '0',
          percentage: 0, 
          averageAmount: '0',
          trend: { growthRate: 0, changeFromPrevious: 0 }
        },
        other: { 
          count: 0, 
          amount: '0', 
          co2eAmount: '0', 
          usdValue: '0',
          percentage: 0, 
          averageAmount: '0',
          trend: { growthRate: 0, changeFromPrevious: 0 }
        },
      },
      trends: this.calculateTrends(retirements, avgPrice),
    };
  }

  /**
   * Generate enhanced project data with retirement information
   */
  generateProjectWithRetirements(project: ProjectData): ProjectWithRetirements {
    const retirements = this.generateProjectRetirements(project);
    const stats = this.generateRetirementStats(project, retirements);
    
    const totalSupplyNum = parseInt(project.totalSupply || "0");
    const retiredSupplyNum = parseInt(project.retired || "0");
    const currentSupplyNum = parseInt(project.currentSupply || "0");
    
    return {
      ...project,
      retirements: {
        total: {
          count: retirements.length,
          amount: stats.total.amount,
          co2eAmount: stats.total.co2eAmount,
          percentage: totalSupplyNum > 0 ? (retiredSupplyNum / totalSupplyNum) * 100 : 0,
        },
        recent: retirements.slice(0, 10), // Most recent 10
        topRetirers: this.getTopRetirers(retirements, 5),
        retirementHistory: this.generateRetirementHistory(retirements),
      },
      availability: {
        totalSupply: project.totalSupply,
        availableSupply: project.currentSupply,
        retiredSupply: project.retired,
        reservedSupply: Math.floor(currentSupplyNum * 0.05).toString(), // 5% reserved
        burnedSupply: "0", // No burned supply for carbon credits
      },
    };
  }

  /**
   * Generate realistic market data with retirement impact
   */
  generateMarketData(
    project: ProjectData,
    retirements: RetirementTransaction[]
  ): MarketData {
    const basePrice = parseFloat(project.pricing.currentPrice || "40");
    const projectHash = this.hashString(project.id);
    
    // Calculate retirement impact on price
    const recent24hRetirements = retirements.filter(r => 
      Date.now() - new Date(r.retirementDate).getTime() < 24 * 60 * 60 * 1000
    );
    
    const retirementRate24h = recent24hRetirements.reduce((sum, r) => 
      sum + parseInt(r.amountCO2e), 0
    );
    
    // Higher retirement rate creates slight price premium
    const retirementImpact = Math.min(retirementRate24h / 10000, 0.05); // Max 5% impact
    const currentPrice = basePrice * (1 + retirementImpact);
    
    // Generate realistic volatility
    const volatility = 0.02 + (projectHash % 100) / 10000; // 2-3% base volatility
    const change24h = (Math.random() - 0.5) * volatility * 2;
    const change7d = (Math.random() - 0.5) * volatility * 7;
    
    const totalSupply = parseInt(project.totalSupply || "0");
    const availableSupply = parseInt(project.currentSupply || "0");
    
    return {
      pricing: {
        current: currentPrice,
        currency: "USD",
        change24h: change24h * 100,
        change7d: change7d * 100,
        volume24h: retirementRate24h * currentPrice,
        marketCap: totalSupply * currentPrice,
      },
      trading: {
        high24h: currentPrice * (1 + volatility),
        low24h: currentPrice * (1 - volatility),
        open24h: currentPrice * (1 + change24h),
        close24h: currentPrice,
        trades24h: recent24hRetirements.length,
      },
      retirement: {
        rate24h: retirementRate24h,
        impact: retirementImpact * 100,
      },
      liquidity: {
        available: availableSupply.toString(),
        locked: (totalSupply - availableSupply).toString(),
        utilization: totalSupply > 0 ? ((totalSupply - availableSupply) / totalSupply) * 100 : 0,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Generate historical price data with retirement correlation
   */
  generatePriceHistory(
    project: ProjectData,
    retirements: RetirementTransaction[],
    days: number = 30
  ): PriceDataPoint[] {
    const basePrice = parseFloat(project.pricing.currentPrice || "40");
    const dataPoints: PriceDataPoint[] = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Get retirements for this day
      const dayRetirements = retirements.filter(r => {
        const retirementDate = new Date(r.retirementDate);
        return retirementDate.toDateString() === date.toDateString();
      });
      
      const dayRetirementAmount = dayRetirements.reduce((sum, r) => 
        sum + parseInt(r.amountCO2e), 0
      );
      
      // Price influenced by retirement activity and market trends
      const trendFactor = 1 + (i / days) * 0.1; // Slight upward trend
      const retirementFactor = 1 + (dayRetirementAmount / 100000) * 0.02; // Retirement premium
      const randomFactor = 0.95 + Math.random() * 0.1; // Random volatility
      
      const price = basePrice * trendFactor * retirementFactor * randomFactor;
      const volume = dayRetirementAmount * price;
      
      dataPoints.push({
        timestamp: date.toISOString(),
        price: parseFloat(price.toFixed(2)),
        volume: parseFloat(volume.toFixed(2)),
        retirements: dayRetirementAmount,
        marketCap: parseInt(project.totalSupply || "0") * price,
      });
    }
    
    return dataPoints;
  }

  /**
   * Validate generated retirement data consistency
   */
  validateRetirementData(
    project: ProjectData,
    retirements: RetirementTransaction[]
  ): ValidationResult {
    const errors: any[] = [];
    const warnings: any[] = [];
    
    // Validate total amounts
    const totalRetired = retirements.reduce((sum, r) => sum + parseInt(r.amount), 0);
    const projectRetired = parseInt(project.retired || "0");
    
    if (Math.abs(totalRetired - projectRetired) > projectRetired * 0.01) { // 1% tolerance
      errors.push({
        field: "retirement_amounts",
        message: `Total retirement amount (${totalRetired}) doesn't match project retired amount (${projectRetired})`,
        code: "AMOUNT_MISMATCH",
        severity: "error" as const,
      });
    }
    
    // Validate chronological order
    for (let i = 1; i < retirements.length; i++) {
      if (new Date(retirements[i].retirementDate) > new Date(retirements[i-1].retirementDate)) {
        warnings.push({
          field: "retirement_dates",
          message: "Retirements are not in chronological order",
          code: "CHRONOLOGICAL_ORDER",
          severity: "warning" as const,
        });
        break;
      }
    }
    
    // Validate vintage years
    const projectVintage = parseInt(project.vintage);
    for (const retirement of retirements) {
      const retirementVintage = parseInt(retirement.vintage);
      if (retirementVintage !== projectVintage) {
        warnings.push({
          field: "vintage_consistency",
          message: `Retirement vintage (${retirementVintage}) doesn't match project vintage (${projectVintage})`,
          code: "VINTAGE_MISMATCH",
          severity: "warning" as const,
        });
        break;
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata: {
        validatedAt: new Date().toISOString(),
        validatorVersion: "1.0.0",
        schemaVersion: "1.0.0",
      },
    };
  }

  // Private helper methods

  private calculateRealisticRetirementCount(project: ProjectData): number {
    const retiredAmount = parseInt(project.retired || "0");
    const projectHash = this.hashString(project.id);
    
    // Base count on project size and characteristics
    let baseCount = 5;
    if (retiredAmount > 100000) baseCount = 15; // Large projects have more retirements
    if (retiredAmount > 500000) baseCount = 25; // Very large projects
    
    // Add variation based on project hash
    const variation = (projectHash % 10) - 5; // -5 to +4
    return Math.max(3, baseCount + variation);
  }

  private distributeRetirementAmounts(
    totalAmount: number,
    count: number,
    seed: number
  ): number[] {
    if (count === 0 || totalAmount === 0) return [];
    
    // Generate random weights with controlled distribution
    const weights: number[] = [];
    for (let i = 0; i < count; i++) {
      // Use seed to ensure consistent results
      const random = this.seededRandom(seed + i);
      // Power law distribution for more realistic retirement sizes
      weights.push(Math.pow(random, 2));
    }
    
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    
    // Distribute amounts proportionally
    const amounts: number[] = [];
    let distributed = 0;
    
    for (let i = 0; i < count - 1; i++) {
      const amount = Math.floor((weights[i] / totalWeight) * totalAmount);
      amounts.push(amount);
      distributed += amount;
    }
    
    // Last amount gets the remainder
    amounts.push(totalAmount - distributed);
    
    return amounts.filter(amount => amount > 0);
  }

  private generateSingleRetirement(
    project: ProjectData,
    amount: number,
    index: number,
    timeframeDays: number
  ): RetirementTransaction {
    const projectHash = this.hashString(project.id + index);
    
    // Generate retirement date within timeframe
    const daysAgo = Math.floor((projectHash % (timeframeDays * 24 * 60)) / (24 * 60));
    const retirementDate = new Date();
    retirementDate.setDate(retirementDate.getDate() - daysAgo);
    
    // Determine retirer type and details
    const isInstitutional = (projectHash % 100) > 70; // 30% institutional
    const retirerType = isInstitutional ? 
      (projectHash % 2 === 0 ? "corporation" : "institution") : "individual";
    
    const transactionHash = this.generateTransactionHash(projectHash);
    const beneficiary = this.generateBeneficiary(retirerType, projectHash);
    
    return {
      id: `retirement_${project.id}_${index + 1}`,
      transactionHash: transactionHash as TransactionHash,
      projectId: project.id as ProjectId,
      projectName: project.name,
      tokenAddress: project.tokenAddress as ContractAddress,
      certContract: project.certContract as ContractAddress,
      amount: amount.toString() as TokenAmount,
      amountCO2e: amount.toString() as CO2eAmount, // 1:1 ratio for carbon credits
      retiredBy: {
        address: this.generateAddress(projectHash),
        name: this.generateRetirerName(retirerType, projectHash),
        type: retirerType,
      },
      beneficiary,
      retirementDate: retirementDate.toISOString(),
      vintage: project.vintage,
      methodology: project.methodology,
      registry: project.registry,
      serialNumbers: this.generateSerialNumbers(amount, projectHash),
      certificate: {
        issued: true,
        hash: this.generateCertificateHash(projectHash),
      },
      status: "confirmed",
      blockNumber: 1298000 + (projectHash % 10000),
      gasUsed: (21000 + (projectHash % 50000)).toString(),
      gasPrice: ((projectHash % 100) / 100).toFixed(4),
      metadata: {
        reason: this.getRetirementReason(retirerType, projectHash),
        notes: this.generateRetirementNotes(retirerType, amount),
        location: project.country,
      },
      payment: {
        method: this.getPaymentMethod(projectHash),
        amount: (amount * parseFloat(project.pricing.currentPrice || '40')).toFixed(2),
        currency: 'USD',
        usdValue: (amount * parseFloat(project.pricing.currentPrice || '40')).toFixed(2),
        transactionId: `pay_${transactionHash.slice(0, 8)}`,
      },
      createdAt: retirementDate.toISOString(),
      updatedAt: retirementDate.toISOString(),
    };
  }

  private aggregateByRetirer(retirements: RetirementTransaction[]): Record<string, any> {
    const byRetirer: Record<string, any> = {};
    
    for (const retirement of retirements) {
      const key = retirement.retiredBy.address;
      if (!byRetirer[key]) {
        byRetirer[key] = {
          count: 0,
          amount: "0",
          co2eAmount: "0",
          name: retirement.retiredBy.name,
          type: retirement.retiredBy.type,
        };
      }
      
      byRetirer[key].count++;
      byRetirer[key].amount = (parseInt(byRetirer[key].amount) + parseInt(retirement.amount)).toString();
      byRetirer[key].co2eAmount = (parseInt(byRetirer[key].co2eAmount) + parseInt(retirement.amountCO2e)).toString();
    }
    
    return byRetirer;
  }

  private aggregateByTimeframe(retirements: RetirementTransaction[]): any {
    const daily: any[] = [];
    const monthly: any[] = [];
    const yearly: any[] = [];
    
    // Group by date strings
    const dailyGroups: Record<string, any> = {};
    const monthlyGroups: Record<string, any> = {};
    const yearlyGroups: Record<string, any> = {};
    
    for (const retirement of retirements) {
      const date = new Date(retirement.retirementDate);
      const dayKey = date.toISOString().split('T')[0];
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const yearKey = date.getFullYear().toString();
      
      // Daily aggregation
      if (!dailyGroups[dayKey]) {
        dailyGroups[dayKey] = { date: dayKey, count: 0, amount: "0", co2eAmount: "0" };
      }
      dailyGroups[dayKey].count++;
      dailyGroups[dayKey].amount = (parseInt(dailyGroups[dayKey].amount) + parseInt(retirement.amount)).toString();
      dailyGroups[dayKey].co2eAmount = (parseInt(dailyGroups[dayKey].co2eAmount) + parseInt(retirement.amountCO2e)).toString();
      
      // Monthly aggregation
      if (!monthlyGroups[monthKey]) {
        monthlyGroups[monthKey] = { month: monthKey, count: 0, amount: "0", co2eAmount: "0" };
      }
      monthlyGroups[monthKey].count++;
      monthlyGroups[monthKey].amount = (parseInt(monthlyGroups[monthKey].amount) + parseInt(retirement.amount)).toString();
      monthlyGroups[monthKey].co2eAmount = (parseInt(monthlyGroups[monthKey].co2eAmount) + parseInt(retirement.amountCO2e)).toString();
      
      // Yearly aggregation
      if (!yearlyGroups[yearKey]) {
        yearlyGroups[yearKey] = { year: yearKey, count: 0, amount: "0", co2eAmount: "0" };
      }
      yearlyGroups[yearKey].count++;
      yearlyGroups[yearKey].amount = (parseInt(yearlyGroups[yearKey].amount) + parseInt(retirement.amount)).toString();
      yearlyGroups[yearKey].co2eAmount = (parseInt(yearlyGroups[yearKey].co2eAmount) + parseInt(retirement.amountCO2e)).toString();
    }
    
    return {
      daily: Object.values(dailyGroups).sort((a: any, b: any) => b.date.localeCompare(a.date)),
      monthly: Object.values(monthlyGroups).sort((a: any, b: any) => b.month.localeCompare(a.month)),
      yearly: Object.values(yearlyGroups).sort((a: any, b: any) => b.year.localeCompare(a.year)),
    };
  }

  private calculateTrends(retirements: RetirementTransaction[], avgPrice: number): any {
    if (retirements.length < 2) {
      return {
        growthRate: 0,
        averageRetirement: "0",
        topRetirers: [],
      };
    }
    
    // Calculate monthly growth rate
    const sortedByDate = [...retirements].sort((a, b) => 
      new Date(a.retirementDate).getTime() - new Date(b.retirementDate).getTime()
    );
    
    const firstMonth = sortedByDate[0];
    const lastMonth = sortedByDate[sortedByDate.length - 1];
    const monthsDiff = (new Date(lastMonth.retirementDate).getTime() - new Date(firstMonth.retirementDate).getTime()) / (30 * 24 * 60 * 60 * 1000);
    
    const growthRate = monthsDiff > 0 ? (retirements.length / monthsDiff) : 0;
    
    // Calculate average retirement
    const totalAmount = retirements.reduce((sum, r) => sum + parseInt(r.amountCO2e), 0);
    const averageRetirement = totalAmount / retirements.length;
    
    // Get top retirers
    const retirerAmounts: Record<string, any> = {};
    for (const retirement of retirements) {
      const key = retirement.retiredBy.address;
      if (!retirerAmounts[key]) {
        retirerAmounts[key] = {
          address: key,
          name: retirement.retiredBy.name,
          amount: "0",
          count: 0,
        };
      }
      retirerAmounts[key].amount = (parseInt(retirerAmounts[key].amount) + parseInt(retirement.amountCO2e)).toString();
      retirerAmounts[key].count++;
    }
    
    const topRetirers = Object.values(retirerAmounts)
      .sort((a: any, b: any) => parseInt(b.amount) - parseInt(a.amount))
      .slice(0, 5);
    
    return {
      growthRate: parseFloat(growthRate.toFixed(2)),
      averageRetirement: Math.floor(averageRetirement).toString(),
      topRetirers,
    };
  }

  private getTopRetirers(retirements: RetirementTransaction[], limit: number): any[] {
    const retirerStats: Record<string, any> = {};
    
    for (const retirement of retirements) {
      const key = retirement.retiredBy.address;
      if (!retirerStats[key]) {
        retirerStats[key] = {
          address: key,
          name: retirement.retiredBy.name,
          amount: "0",
          count: 0,
        };
      }
      retirerStats[key].amount = (parseInt(retirerStats[key].amount) + parseInt(retirement.amountCO2e)).toString();
      retirerStats[key].count++;
    }
    
    return Object.values(retirerStats)
      .sort((a: any, b: any) => parseInt(b.amount) - parseInt(a.amount))
      .slice(0, limit);
  }

  private generateRetirementHistory(retirements: RetirementTransaction[]): any[] {
    const history: Record<string, any> = {};
    
    for (const retirement of retirements) {
      const date = new Date(retirement.retirementDate).toISOString().split('T')[0];
      if (!history[date]) {
        history[date] = { date, amount: "0", count: 0 };
      }
      history[date].amount = (parseInt(history[date].amount) + parseInt(retirement.amountCO2e)).toString();
      history[date].count++;
    }
    
    return Object.values(history).sort((a: any, b: any) => b.date.localeCompare(a.date));
  }

  // Utility methods
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  private generateTransactionHash(seed: number): string {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(this.seededRandom(seed + i) * 16)];
    }
    return hash;
  }

  private generateAddress(seed: number): string {
    const chars = '0123456789abcdef';
    let address = '0x';
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(this.seededRandom(seed + i) * 16)];
    }
    return address;
  }

  private getPaymentMethod(seed: number): PaymentMethod {
    const methods: PaymentMethod[] = ['ais_points', 'fiat_usd', 'crypto_eth', 'crypto_usdc', 'credit_card', 'bank_transfer', 'other'];
    const index = Math.floor(this.seededRandom(seed) * methods.length);
    return methods[index];
  }

  private generateRetirerName(type: string, seed: number): string {
    if (type === "individual") {
      const firstNames = ["John", "Sarah", "Michael", "Emily", "David", "Jessica", "Robert", "Lisa"];
      const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"];
      const firstName = firstNames[seed % firstNames.length];
      const lastName = lastNames[(seed + 1) % lastNames.length];
      return `${firstName} ${lastName}`;
    } else {
      const companies = this.COMPANY_TYPES;
      const prefixes = ["Global", "International", "United", "Premier", "Advanced", "Sustainable"];
      const suffixes = ["Inc", "Corp", "Ltd", "Group", "Holdings", "Partners"];
      
      const prefix = prefixes[seed % prefixes.length];
      const company = companies[(seed + 1) % companies.length];
      const suffix = suffixes[(seed + 2) % suffixes.length];
      
      return `${prefix} ${company} ${suffix}`;
    }
  }

  private generateBeneficiary(retirerType: string, seed: number): any {
    if (retirerType === "individual") {
      const purposes = this.INDIVIDUAL_PURPOSES;
      return {
        name: "Personal Offset",
        purpose: purposes[seed % purposes.length],
        description: "Individual carbon footprint offset",
      };
    } else {
      const reasons = this.RETIREMENT_REASONS;
      return {
        name: "Corporate Initiative",
        purpose: reasons[seed % reasons.length],
        description: "Corporate sustainability and carbon neutrality program",
      };
    }
  }

  private getRetirementReason(retirerType: string, seed: number): string {
    if (retirerType === "individual") {
      return this.INDIVIDUAL_PURPOSES[seed % this.INDIVIDUAL_PURPOSES.length];
    } else {
      return this.RETIREMENT_REASONS[seed % this.RETIREMENT_REASONS.length];
    }
  }

  private generateRetirementNotes(retirerType: string, amount: number): string {
    const baseNotes = `Retirement of ${amount} carbon credits for offset purposes.`;
    if (retirerType === "individual") {
      return `${baseNotes} Personal commitment to carbon neutrality.`;
    } else {
      return `${baseNotes} Part of corporate sustainability initiative.`;
    }
  }

  private generateSerialNumbers(amount: number, seed: number): string[] {
    const serials: string[] = [];
    const baseSerial = 1000000 + (seed % 900000);
    
    // Generate sequential serial numbers
    for (let i = 0; i < Math.min(amount, 5); i++) { // Max 5 serials shown
      serials.push((baseSerial + i).toString());
    }
    
    return serials;
  }

  private generateCertificateHash(seed: number): string {
    return this.generateTransactionHash(seed + 12345);
  }
}

// Export singleton instance
export const retirementDataGenerator = new RetirementDataGenerator();

// Export utility functions
export const generateProjectRetirements = (
  project: ProjectData,
  options?: { count?: number; timeframeDays?: number; includeHistorical?: boolean }
): RetirementTransaction[] => retirementDataGenerator.generateProjectRetirements(project, options);

export const generateRetirementStats = (
  project: ProjectData,
  retirements: RetirementTransaction[]
): RetirementStats => retirementDataGenerator.generateRetirementStats(project, retirements);

export const generateProjectWithRetirements = (
  project: ProjectData
): ProjectWithRetirements => retirementDataGenerator.generateProjectWithRetirements(project);

export const generateMarketData = (
  project: ProjectData,
  retirements: RetirementTransaction[]
): MarketData => retirementDataGenerator.generateMarketData(project, retirements);

export const validateRetirementData = (
  project: ProjectData,
  retirements: RetirementTransaction[]
): ValidationResult => retirementDataGenerator.validateRetirementData(project, retirements);