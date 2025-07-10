import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IrecSupplyMetrics } from '../irec-supply-metrics'
import type { IrecCertificateComplete } from '@/lib/types/irec'

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Area: () => <div data-testid="area" />,
  Pie: () => <div data-testid="pie" />,
  Bar: () => <div data-testid="bar" />,
  Cell: () => <div data-testid="cell" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}))

const mockCertificateData: IrecCertificateComplete[] = [
  {
    id: 'cert-1',
    registryId: 'REG-001',
    serialNumber: 'SN-001',
    type: 'renewable_energy',
    status: 'active',
    energyAmount: '1000',
    carbonAmount: '500',
    unit: 'MWh',
    issuanceDate: '2023-01-01',
    expiryDate: '2025-01-01',
    vintage: '2023',
    country: 'USA',
    region: 'California',
    facility: {
      name: 'Solar Farm 1',
      location: 'California, USA',
      technology: 'Solar PV',
      capacity: '50 MW',
    },
    currentOwner: '0x123456789abcdef',
    registryName: 'IREC Registry',
    verification: {
      verifier: 'Test Verifier',
      verificationDate: '2023-01-15',
      verificationStandard: 'IREC Standard',
    },
    supplyData: {
      certificateId: 'cert-1',
      totalSupply: '1000',
      availableSupply: '800',
      tokenizedSupply: '200',
      retiredSupply: '100',
      supplyBreakdown: {
        original: '1000',
        minted: '200',
        burned: '100',
        transferred: '50',
      },
      tokenContract: {
        address: '0x123456789abcdef',
        symbol: 'REC',
        decimals: 18,
        network: 'optimism',
      },
      marketData: {
        pricePerToken: '45.00',
        pricePerMWh: '45.00',
        currency: 'USD',
        lastUpdated: '2023-01-01T00:00:00Z',
      },
      supplyHistory: [],
      lastUpdated: '2023-01-01T00:00:00Z',
    },
    optimismActivity: {
      certificateId: 'cert-1',
      totalTransactions: 5,
      transactionsByType: {
        tokenize: 1,
        buy: 2,
        sell: 1,
        transfer: 1,
        retire: 0,
        redeem: 0,
      },
      totalVolume: '200',
      volumeByType: {
        tokenize: '200',
        buy: '100',
        sell: '50',
        transfer: '25',
        retire: '0',
        redeem: '0',
      },
      totalValue: '9000',
      valueByType: {
        tokenize: '9000',
        buy: '4500',
        sell: '2250',
        transfer: '1125',
        retire: '0',
        redeem: '0',
      },
      recentTransactions: [],
      topBuyers: [],
      topSellers: [],
      statistics: {
        averageTransactionSize: '40',
        averagePrice: '45.00',
        medianPrice: '45.00',
        priceRange: {
          min: '40.00',
          max: '50.00',
        },
        activityPeriod: {
          start: '2023-01-01',
          end: '2023-12-31',
        },
      },
      lastUpdated: '2023-01-01T00:00:00Z',
    },
    calculated: {
      utilizationRate: 0.2,
      liquidityScore: 0.8,
      priceStability: 0.9,
      marketCap: '45000',
      averageTradeSize: '50',
      activityScore: 0.7,
    },
    correlation: {
      supplyVsActivity: 0.8,
      priceConsistency: 0.9,
      dataQuality: 0.95,
      lastSyncTime: '2023-01-01T00:00:00Z',
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: 'cert-2',
    registryId: 'REG-002',
    serialNumber: 'SN-002',
    type: 'renewable_energy',
    status: 'active',
    energyAmount: '2000',
    carbonAmount: '1000',
    unit: 'MWh',
    issuanceDate: '2023-02-01',
    expiryDate: '2025-02-01',
    vintage: '2023',
    country: 'Germany',
    region: 'Bavaria',
    facility: {
      name: 'Wind Farm 1',
      location: 'Bavaria, Germany',
      technology: 'Wind',
      capacity: '100 MW',
    },
    currentOwner: '0x987654321fedcba',
    registryName: 'IREC Registry',
    verification: {
      verifier: 'Test Verifier',
      verificationDate: '2023-02-15',
      verificationStandard: 'IREC Standard',
    },
    supplyData: {
      certificateId: 'cert-2',
      totalSupply: '2000',
      availableSupply: '1500',
      tokenizedSupply: '500',
      retiredSupply: '200',
      supplyBreakdown: {
        original: '2000',
        minted: '500',
        burned: '200',
        transferred: '100',
      },
      tokenContract: {
        address: '0x987654321fedcba',
        symbol: 'REC',
        decimals: 18,
        network: 'optimism',
      },
      marketData: {
        pricePerToken: '42.00',
        pricePerMWh: '42.00',
        currency: 'USD',
        lastUpdated: '2023-02-01T00:00:00Z',
      },
      supplyHistory: [],
      lastUpdated: '2023-02-01T00:00:00Z',
    },
    optimismActivity: {
      certificateId: 'cert-2',
      totalTransactions: 8,
      transactionsByType: {
        tokenize: 2,
        buy: 3,
        sell: 2,
        transfer: 1,
        retire: 0,
        redeem: 0,
      },
      totalVolume: '500',
      volumeByType: {
        tokenize: '500',
        buy: '300',
        sell: '200',
        transfer: '100',
        retire: '0',
        redeem: '0',
      },
      totalValue: '21000',
      valueByType: {
        tokenize: '21000',
        buy: '12600',
        sell: '8400',
        transfer: '4200',
        retire: '0',
        redeem: '0',
      },
      recentTransactions: [],
      topBuyers: [],
      topSellers: [],
      statistics: {
        averageTransactionSize: '62.5',
        averagePrice: '42.00',
        medianPrice: '42.00',
        priceRange: {
          min: '40.00',
          max: '45.00',
        },
        activityPeriod: {
          start: '2023-02-01',
          end: '2023-12-31',
        },
      },
      lastUpdated: '2023-02-01T00:00:00Z',
    },
    calculated: {
      utilizationRate: 0.25,
      liquidityScore: 0.75,
      priceStability: 0.85,
      marketCap: '84000',
      averageTradeSize: '62.5',
      activityScore: 0.8,
    },
    correlation: {
      supplyVsActivity: 0.85,
      priceConsistency: 0.88,
      dataQuality: 0.92,
      lastSyncTime: '2023-02-01T00:00:00Z',
    },
    createdAt: '2023-02-01T00:00:00Z',
    updatedAt: '2023-02-01T00:00:00Z',
  },
]

describe('IrecSupplyMetrics', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders with empty data', () => {
    render(<IrecSupplyMetrics data={[]} />)
    
    expect(screen.getByText('Supply Metrics & Analytics')).toBeInTheDocument()
    expect(screen.getByText('Comprehensive supply analysis and distribution metrics')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })

  it('renders supply status cards with correct data', () => {
    render(<IrecSupplyMetrics data={mockCertificateData} />)
    
    // Check for supply status cards
    expect(screen.getByText('Total Supply')).toBeInTheDocument()
    expect(screen.getByText('Available')).toBeInTheDocument()
    expect(screen.getByText('Retired')).toBeInTheDocument()
    expect(screen.getByText('Reserved')).toBeInTheDocument()
    
    // Check calculated values
    expect(screen.getByText('3,000')).toBeInTheDocument() // Total supply (1000 + 2000)
    expect(screen.getByText('2,300')).toBeInTheDocument() // Available supply (800 + 1500)
    expect(screen.getByText('300')).toBeInTheDocument() // Retired supply (100 + 200)
    expect(screen.getByText('3,000')).toBeInTheDocument() // Reserved supply (1000 + 2000)
  })

  it('renders tab navigation correctly', () => {
    render(<IrecSupplyMetrics data={mockCertificateData} />)
    
    expect(screen.getByText('History')).toBeInTheDocument()
    expect(screen.getByText('Countries')).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('Vintage')).toBeInTheDocument()
  })

  it('switches between tabs correctly', async () => {
    const user = userEvent.setup()
    render(<IrecSupplyMetrics data={mockCertificateData} />)
    
    // Initially on History tab
    expect(screen.getByText('Supply History (30 Days)')).toBeInTheDocument()
    
    // Click on Countries tab
    await user.click(screen.getByText('Countries'))
    expect(screen.getByText('Country Distribution')).toBeInTheDocument()
    expect(screen.getByText('Country Rankings')).toBeInTheDocument()
    
    // Click on Technology tab
    await user.click(screen.getByText('Technology'))
    expect(screen.getByText('Technology Distribution')).toBeInTheDocument()
    
    // Click on Vintage tab
    await user.click(screen.getByText('Vintage'))
    expect(screen.getByText('Vintage Year Distribution')).toBeInTheDocument()
  })

  it('renders charts correctly', () => {
    render(<IrecSupplyMetrics data={mockCertificateData} />)
    
    // Check for chart components
    expect(screen.getAllByTestId('responsive-container')).toHaveLength(1) // History chart
    expect(screen.getByTestId('area-chart')).toBeInTheDocument()
  })

  it('handles country data correctly', async () => {
    const user = userEvent.setup()
    render(<IrecSupplyMetrics data={mockCertificateData} />)
    
    // Switch to Countries tab
    await user.click(screen.getByText('Countries'))
    
    // Should render country-specific data
    expect(screen.getByText('USA')).toBeInTheDocument()
    expect(screen.getByText('Germany')).toBeInTheDocument()
  })

  it('handles technology data correctly', async () => {
    const user = userEvent.setup()
    render(<IrecSupplyMetrics data={mockCertificateData} />)
    
    // Switch to Technology tab
    await user.click(screen.getByText('Technology'))
    
    // Should render technology-specific data
    expect(screen.getByText('Solar PV')).toBeInTheDocument()
    expect(screen.getByText('Wind')).toBeInTheDocument()
  })

  it('handles vintage data correctly', async () => {
    const user = userEvent.setup()
    render(<IrecSupplyMetrics data={mockCertificateData} />)
    
    // Switch to Vintage tab
    await user.click(screen.getByText('Vintage'))
    
    // Should render vintage-specific data
    expect(screen.getByText('2023')).toBeInTheDocument()
  })

  it('renders performance indicators correctly', () => {
    render(<IrecSupplyMetrics data={mockCertificateData} />)
    
    expect(screen.getByText('Utilization Rate')).toBeInTheDocument()
    expect(screen.getByText('Retirement Rate')).toBeInTheDocument()
    expect(screen.getByText('Avg. Certificate Size')).toBeInTheDocument()
    expect(screen.getByText('Liquidity Score')).toBeInTheDocument()
  })

  it('calculates utilization rate correctly', () => {
    render(<IrecSupplyMetrics data={mockCertificateData} />)
    
    // Utilization rate = (total - available) / total * 100
    // (3000 - 2300) / 3000 * 100 = 23.3%
    expect(screen.getByText('23.3%')).toBeInTheDocument()
  })

  it('calculates retirement rate correctly', () => {
    render(<IrecSupplyMetrics data={mockCertificateData} />)
    
    // Retirement rate = retired / total * 100
    // 300 / 3000 * 100 = 10.0%
    expect(screen.getByText('10.0%')).toBeInTheDocument()
  })

  it('calculates average certificate size correctly', () => {
    render(<IrecSupplyMetrics data={mockCertificateData} />)
    
    // Average certificate size = total supply / number of certificates
    // 3000 / 2 = 1500
    expect(screen.getByText('1,500')).toBeInTheDocument()
  })

  it('handles missing data gracefully', () => {
    const certificatesWithMissingData = [
      {
        ...mockCertificateData[0],
        country: '',
        facility: {
          ...mockCertificateData[0].facility,
          technology: '',
        },
        vintage: '',
      },
    ]
    
    render(<IrecSupplyMetrics data={certificatesWithMissingData} />)
    
    // Should still render without errors
    expect(screen.getByText('Supply Metrics & Analytics')).toBeInTheDocument()
  })

  it('formats large numbers correctly', () => {
    const certificatesWithLargeNumbers = [
      {
        ...mockCertificateData[0],
        supplyData: {
          ...mockCertificateData[0].supplyData,
          totalSupply: '1000000',
          availableSupply: '800000',
          retiredSupply: '200000',
        },
      },
    ]
    
    render(<IrecSupplyMetrics data={certificatesWithLargeNumbers} />)
    
    // Should format numbers with K/M suffix
    expect(screen.getByText('1.0M')).toBeInTheDocument()
    expect(screen.getByText('800K')).toBeInTheDocument()
    expect(screen.getByText('200K')).toBeInTheDocument()
  })

  it('applies correct CSS classes', () => {
    const { container } = render(<IrecSupplyMetrics data={mockCertificateData} />)
    
    // Check for gradient background
    const gradientElement = container.querySelector('.bg-gradient-to-br')
    expect(gradientElement).toBeInTheDocument()
    expect(gradientElement).toHaveClass('from-[#181B1F]')
    expect(gradientElement).toHaveClass('to-[#1A1D23]')
  })

  it('renders with custom className', () => {
    const { container } = render(
      <IrecSupplyMetrics data={mockCertificateData} className="custom-class" />
    )
    
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })

  it('handles zero values correctly', () => {
    const certificatesWithZeroValues = [
      {
        ...mockCertificateData[0],
        supplyData: {
          ...mockCertificateData[0].supplyData,
          totalSupply: '0',
          availableSupply: '0',
          retiredSupply: '0',
        },
      },
    ]
    
    render(<IrecSupplyMetrics data={certificatesWithZeroValues} />)
    
    // Should handle zero values without errors
    expect(screen.getByText('Supply Metrics & Analytics')).toBeInTheDocument()
  })

  it('generates historical data correctly', () => {
    render(<IrecSupplyMetrics data={mockCertificateData} />)
    
    // Should generate 30 days of historical data
    expect(screen.getByText('Supply History (30 Days)')).toBeInTheDocument()
  })

  it('handles percentage calculations correctly', async () => {
    const user = userEvent.setup()
    render(<IrecSupplyMetrics data={mockCertificateData} />)
    
    // Switch to Countries tab to see percentage calculations
    await user.click(screen.getByText('Countries'))
    
    // Should calculate percentages correctly
    // USA: 1000 / 3000 = 33.3%
    // Germany: 2000 / 3000 = 66.7%
    expect(screen.getByText('33.3%')).toBeInTheDocument()
    expect(screen.getByText('66.7%')).toBeInTheDocument()
  })
})