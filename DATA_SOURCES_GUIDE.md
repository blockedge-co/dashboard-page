# BlockEdge Dashboard Data Sources Guide

## Overview
This document explains what data each component fetches, from where, and how to modify the data sources in the codebase.

## Data Architecture

### Primary Data Sources
1. **BlockEdge Project Data**: `https://asset.blockedge.co/blockedge-co2e-project.json`
2. **CO2e Chain API**: `https://exp.co2e.cc/api/v2`
3. **Real Blockchain Data**: Token contracts, transfers, and certificates

---

## Component Data Sources

### 1. Main Dashboard (`app/dashboard/page.tsx`)
**Data Source**: `components/carbon-dashboard.tsx`

#### Carbon Dashboard (`components/carbon-dashboard.tsx`)
**Fetches From**: 
- `lib/co2e-api.ts` → `getRealDashboardData()`
- `lib/project-data-manager.ts` → `initializeProjectData()`

**Data Includes**:
- Hero metrics (total credits, projects, transactions)
- Recent blockchain transactions
- Network statistics
- Project listings with token data

**To Modify Data Source**:
```typescript
// File: lib/co2e-api.ts
// Line: ~100-150
async getRealDashboardData(): Promise<RealDashboardData> {
  // Change API endpoint here
  const projects = await this.getProjects(); // ← Modify this method
  const networkStats = await this.getNetworkStats(); // ← Or this method
  
  return {
    heroMetrics: this.calculateHeroMetrics(projects),
    recentTransactions: await this.getRecentTransactions(),
    recentBlocks: await this.getRecentBlocks(),
    networkStats: networkStats
  };
}
```

### 2. Retirement Analytics (`components/retirement-panels/retirement-analytics.tsx`)
**Fetches From**: 
- `lib/real-retirement-service.ts` → `getRealRetirementData()`

**Data Includes**:
- Payment method breakdowns (AIS Points vs Others)
- Historical retirement trends
- Real-time retirement activity
- Top retirees list

**Real Data Sources**:
1. **Certificate Contracts**: ERC-721 minting events indicate retirements
2. **Token Burns**: Tokens sent to 0x0 address
3. **Transfer Patterns**: Retirement-specific transaction analysis

**To Modify Data Source**:
```typescript
// File: lib/real-retirement-service.ts
// Line: ~50-100
async getRealRetirementData(): Promise<RetirementData> {
  const projects = await this.projectDataManager.getProjects();
  
  // Modify these methods to change data sources:
  const retirements = await this.analyzeRetirementTransactions(projects); // ← Certificate analysis
  const paymentMethods = await this.analyzePaymentMethods(retirements); // ← Payment detection
  const trends = await this.calculateRetirementTrends(retirements); // ← Historical analysis
  
  return {
    paymentBreakdown: paymentMethods,
    retirementTrends: trends,
    topRetirees: this.getTopRetirees(retirements)
  };
}
```

**To Change Certificate Detection**:
```typescript
// File: lib/real-retirement-service.ts
// Line: ~200-250
private async analyzeRetirementTransactions(projects: ProjectData[]): Promise<any[]> {
  const retirements: any[] = [];
  
  for (const project of projects) {
    if (project.certContract) {
      // Modify this endpoint to use different blockchain API
      const transfers = await this.fetchWithRetry(
        `${this.baseUrl}/tokens/${project.certContract}/transfers` // ← Change API here
      );
      
      // Modify retirement detection logic here
      const projectRetirements = transfers
        .filter(transfer => transfer.to === '0x0000000000000000000000000000000000000000') // ← Burn detection
        .map(transfer => this.transformToRetirement(transfer, project));
      
      retirements.push(...projectRetirements);
    }
  }
  
  return retirements;
}
```

### 3. Tokenization Metrics (`components/tokenization-metrics-enhanced.tsx`)
**Fetches From**: 
- `lib/co2e-api.ts` → `getTokenizationData()`
- Real blockchain token data

**Data Includes**:
- Token supply utilization
- Cross-chain distribution
- Tokenization growth trends
- Live tokenization activity

**Real Data Sources**:
1. **Token Supply Data**: From CO2e Chain API `/tokens/{address}`
2. **Transfer Activity**: Real transfer counts and volumes
3. **Holder Analysis**: Actual token holder statistics

**To Modify Data Source**:
```typescript
// File: components/tokenization-metrics-enhanced.tsx
// Line: ~50-100
useEffect(() => {
  const fetchTokenizationData = async () => {
    try {
      // Modify this to change data source
      const projects = await projectDataManager.getProjects(); // ← Main data source
      
      // Change these calculations for different metrics:
      const totalSupply = projects.reduce((sum, p) => sum + (p.totalCreditsIssued || 0), 0);
      const totalHolders = projects.reduce((sum, p) => sum + (p.holderCount || 0), 0);
      
      // Modify API calls here:
      const networkStats = await co2eApi.getNetworkStats(); // ← Blockchain stats
      
      setTokenizationData({
        totalTokenized: projects.length,
        totalSupply: totalSupply,
        activeHolders: totalHolders,
        // Add custom metrics here
      });
    } catch (error) {
      console.error('Failed to fetch tokenization data:', error);
    }
  };
  
  fetchTokenizationData();
}, []);
```

### 4. Analytics Page (`components/analytics-page.tsx`)
**Fetches From**: 
- `lib/co2e-api.ts` → Various analytics methods
- Market data calculations

**Data Includes**:
- Market trends and predictions
- Institutional flows
- ESG metrics
- Risk assessments

**To Modify Data Source**:
```typescript
// File: components/analytics-page.tsx
// Line: ~100-150
useEffect(() => {
  const fetchAnalyticsData = async () => {
    // Change these API calls to modify data sources:
    const marketData = await co2eApi.getMarketData(); // ← Market analysis
    const institutionalData = await co2eApi.getInstitutionalFlow(); // ← Institutional tracking
    const esgData = await co2eApi.getESGMetrics(); // ← ESG scoring
    
    setAnalyticsData({
      market: marketData,
      institutional: institutionalData,
      esg: esgData
    });
  };
  
  fetchAnalyticsData();
}, []);
```

---

## Core Data Services

### 1. Project Data Manager (`lib/project-data-manager.ts`)
**Purpose**: Central project data management with caching
**Data Source**: BlockEdge Project API

**To Change Project Data Source**:
```typescript
// File: lib/project-data-manager.ts
// Line: ~20-30
class ProjectDataManager {
  private dataUrl = process.env.NEXT_PUBLIC_PROJECTS_DATA_URL || 
    'https://asset.blockedge.co/blockedge-co2e-project.json'; // ← Change URL here
  
  async fetchProjectData(): Promise<any> {
    // Modify this method to use different API format:
    const response = await fetch(this.dataUrl); // ← Change fetch logic
    const data = await response.json();
    
    // Change data transformation here:
    return this.convertBlockEdgeFormat(data); // ← Modify converter
  }
}
```

### 2. CO2e API Service (`lib/co2e-api.ts`)
**Purpose**: Blockchain data integration
**Data Source**: CO2e Chain API

**To Change Blockchain API**:
```typescript
// File: lib/co2e-api.ts
// Line: ~30-50
class Co2eApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 
    'https://exp.co2e.cc/api/v2'; // ← Change blockchain API here
  
  async getTokenData(address: string): Promise<any> {
    // Modify endpoint structure:
    const url = `${this.baseUrl}/tokens/${address}`; // ← Change API path
    const response = await this.fetchWithRetry(url);
    
    // Change response transformation:
    return {
      totalSupply: response.total_supply, // ← Map different field names
      holders: response.holder_count,
      // Add new fields from your API
    };
  }
}
```

---

## Environment Configuration

### Data Source URLs
```bash
# .env.local
NEXT_PUBLIC_PROJECTS_DATA_URL=https://asset.blockedge.co/blockedge-co2e-project.json
NEXT_PUBLIC_API_BASE_URL=https://exp.co2e.cc/api/v2
```

**To Use Different APIs**:
1. Update environment variables
2. Modify corresponding service files
3. Update data transformation logic

### Local Development Override
```typescript
// File: lib/config.ts
const config = {
  projectsDataUrl: process.env.NEXT_PUBLIC_PROJECTS_DATA_URL || 
    'http://localhost:3001/api/projects', // ← Local API
  blockchainApiUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 
    'http://localhost:8545' // ← Local blockchain
};
```

---

## Data Flow Summary

```
1. User visits dashboard
   ↓
2. ProjectDataManager fetches project list from BlockEdge API
   ↓
3. Co2eApiService enriches projects with blockchain data
   ↓
4. Components fetch specific data:
   - CarbonDashboard → Dashboard metrics
   - RetirementAnalytics → Retirement data
   - TokenizationMetrics → Token data
   - AnalyticsPage → Market data
   ↓
5. Real-time updates every 5 minutes (configurable)
```

## Quick Modification Examples

### Change Retirement Detection Method
```typescript
// File: lib/real-retirement-service.ts
// Current: Certificate minting detection
// Change to: Token burn detection only
private async analyzeRetirementTransactions(projects: ProjectData[]): Promise<any[]> {
  // Replace certificate analysis with burn analysis
  return this.analyzeBurnTransactions(projects);
}
```

### Add New Blockchain Network
```typescript
// File: lib/co2e-api.ts
// Add support for different blockchain
private getNetworkConfig(chainId: number) {
  switch(chainId) {
    case 1: return { api: 'https://api.etherscan.io/api' };
    case 137: return { api: 'https://api.polygonscan.com/api' };
    case 56: return { api: 'https://api.bscscan.com/api' };
    default: return { api: 'https://exp.co2e.cc/api/v2' };
  }
}
```

### Change Data Update Frequency
```typescript
// File: lib/project-data-manager.ts
// Current: 5-minute cache
private cacheTimeout = 5 * 60 * 1000; // ← Change to 1 minute: 1 * 60 * 1000
```

---

This guide provides the complete data flow architecture and modification points for the BlockEdge Dashboard. Each component's data source is clearly documented with specific code locations for easy customization.