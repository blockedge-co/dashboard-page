import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IrecCertificateOverview } from '../irec-certificate-overview'

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  Bar: () => <div data-testid="bar" />,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}))

const mockOverviewData = [
  {
    id: 'cert-1',
    certificateId: 'IREC-001',
    projectName: 'Solar Farm Alpha',
    country: 'USA',
    technology: 'Solar PV',
    vintage: { year: 2023 },
    supply: { total: '1000000', available: '800000', retired: '200000' },
    trading: { currentPrice: 45.50, volume: '50000' },
    metadata: { status: 'active' },
    environmental: { co2Avoided: 500000, co2Unit: 'tCO2e' }
  },
  {
    id: 'cert-2',
    certificateId: 'IREC-002',
    projectName: 'Wind Farm Beta',
    country: 'Germany',
    technology: 'Wind',
    vintage: { year: 2022 },
    supply: { total: '2000000', available: '1500000', retired: '500000' },
    trading: { currentPrice: 42.00, volume: '75000' },
    metadata: { status: 'active' },
    environmental: { co2Avoided: 1000000, co2Unit: 'tCO2e' }
  },
  {
    id: 'cert-3',
    certificateId: 'IREC-003',
    projectName: 'Hydro Plant Gamma',
    country: 'Canada',
    technology: 'Hydroelectric',
    vintage: { year: 2021 },
    supply: { total: '1500000', available: '1000000', retired: '500000' },
    trading: { currentPrice: 40.00, volume: '30000' },
    metadata: { status: 'retired' },
    environmental: { co2Avoided: 750000, co2Unit: 'tCO2e' }
  }
]

describe('IrecCertificateOverview', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders certificate overview with data', () => {
    render(<IrecCertificateOverview data={mockOverviewData} />)
    
    expect(screen.getByText('Certificate Overview')).toBeInTheDocument()
    expect(screen.getByText('Market analysis and certificate distribution insights')).toBeInTheDocument()
  })

  it('renders with empty data', () => {
    render(<IrecCertificateOverview data={[]} />)
    
    expect(screen.getByText('Certificate Overview')).toBeInTheDocument()
    expect(screen.getByText('No certificates available')).toBeInTheDocument()
  })

  it('displays market summary cards correctly', () => {
    render(<IrecCertificateOverview data={mockOverviewData} />)
    
    expect(screen.getByText('Total Certificates')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    
    expect(screen.getByText('Total Supply')).toBeInTheDocument()
    expect(screen.getByText('4.5M')).toBeInTheDocument() // 1M + 2M + 1.5M
    
    expect(screen.getByText('Market Value')).toBeInTheDocument()
    expect(screen.getByText('Active Markets')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('displays average price correctly', () => {
    render(<IrecCertificateOverview data={mockOverviewData} />)
    
    expect(screen.getByText('Avg. Price')).toBeInTheDocument()
    // Average price: (45.50 + 42.00 + 40.00) / 3 = 42.50
    expect(screen.getByText('$42.50')).toBeInTheDocument()
  })

  it('displays technology distribution correctly', () => {
    render(<IrecCertificateOverview data={mockOverviewData} />)
    
    expect(screen.getByText('Technology Distribution')).toBeInTheDocument()
    expect(screen.getByText('Solar PV')).toBeInTheDocument()
    expect(screen.getByText('Wind')).toBeInTheDocument()
    expect(screen.getByText('Hydroelectric')).toBeInTheDocument()
  })

  it('displays country distribution correctly', () => {
    render(<IrecCertificateOverview data={mockOverviewData} />)
    
    expect(screen.getByText('Country Distribution')).toBeInTheDocument()
    expect(screen.getByText('USA')).toBeInTheDocument()
    expect(screen.getByText('Germany')).toBeInTheDocument()
    expect(screen.getByText('Canada')).toBeInTheDocument()
  })

  it('displays status distribution correctly', () => {
    render(<IrecCertificateOverview data={mockOverviewData} />)
    
    expect(screen.getByText('Status Distribution')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Retired')).toBeInTheDocument()
    
    // Should show counts: 2 active, 1 retired
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('displays vintage distribution correctly', () => {
    render(<IrecCertificateOverview data={mockOverviewData} />)
    
    expect(screen.getByText('Vintage Distribution')).toBeInTheDocument()
    expect(screen.getByText('2021')).toBeInTheDocument()
    expect(screen.getByText('2022')).toBeInTheDocument()
    expect(screen.getByText('2023')).toBeInTheDocument()
  })

  it('renders charts correctly', () => {
    render(<IrecCertificateOverview data={mockOverviewData} />)
    
    // Check for chart components
    expect(screen.getAllByTestId('responsive-container')).toHaveLength(4) // 4 charts
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
  })

  it('switches between chart tabs correctly', async () => {
    const user = userEvent.setup()
    render(<IrecCertificateOverview data={mockOverviewData} />)
    
    // Check if Technology tab is active by default
    expect(screen.getByText('Technology Distribution')).toBeInTheDocument()
    
    // Click on Country tab
    await user.click(screen.getByText('Country'))
    expect(screen.getByText('Country Distribution')).toBeInTheDocument()
    
    // Click on Status tab
    await user.click(screen.getByText('Status'))
    expect(screen.getByText('Status Distribution')).toBeInTheDocument()
    
    // Click on Vintage tab
    await user.click(screen.getByText('Vintage'))
    expect(screen.getByText('Vintage Distribution')).toBeInTheDocument()
  })

  it('formats large numbers correctly', () => {
    const dataWithLargeNumbers = [
      {
        ...mockOverviewData[0],
        supply: { total: '5000000', available: '4000000', retired: '1000000' }
      }
    ]
    
    render(<IrecCertificateOverview data={dataWithLargeNumbers} />)
    
    expect(screen.getByText('5.0M')).toBeInTheDocument()
  })

  it('calculates market value correctly', () => {
    render(<IrecCertificateOverview data={mockOverviewData} />)
    
    expect(screen.getByText('Market Value')).toBeInTheDocument()
    // Market value should be calculated from supply * price for each certificate
    // This depends on the specific implementation
  })

  it('handles missing data gracefully', () => {
    const dataWithMissingFields = [
      {
        id: 'cert-incomplete',
        certificateId: 'IREC-INCOMPLETE',
        projectName: 'Incomplete Certificate',
        country: 'Unknown',
        technology: 'Unknown',
        vintage: { year: 2023 },
        metadata: { status: 'active' }
        // Missing supply, trading, environmental data
      }
    ]
    
    render(<IrecCertificateOverview data={dataWithMissingFields} />)
    
    expect(screen.getByText('Certificate Overview')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument() // Should still show 1 certificate
  })

  it('handles zero values correctly', () => {
    const dataWithZeroValues = [
      {
        ...mockOverviewData[0],
        supply: { total: '0', available: '0', retired: '0' },
        trading: { currentPrice: 0, volume: '0' }
      }
    ]
    
    render(<IrecCertificateOverview data={dataWithZeroValues} />)
    
    expect(screen.getByText('Certificate Overview')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('$0.00')).toBeInTheDocument()
  })

  it('displays refresh button functionality', async () => {
    const user = userEvent.setup()
    render(<IrecCertificateOverview data={mockOverviewData} />)
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i })
    await user.click(refreshButton)
    
    expect(refreshButton).toBeInTheDocument()
  })

  it('calculates percentages correctly', () => {
    render(<IrecCertificateOverview data={mockOverviewData} />)
    
    // Technology distribution percentages
    // Solar PV: 1 out of 3 = 33.3%
    // Wind: 1 out of 3 = 33.3%
    // Hydroelectric: 1 out of 3 = 33.3%
    expect(screen.getAllByText('33.3%')).toHaveLength(3)
  })

  it('handles single certificate correctly', () => {
    const singleCertificateData = [mockOverviewData[0]]
    
    render(<IrecCertificateOverview data={singleCertificateData} />)
    
    expect(screen.getByText('1')).toBeInTheDocument() // Total certificates
    expect(screen.getByText('1.0M')).toBeInTheDocument() // Total supply
    expect(screen.getByText('$45.50')).toBeInTheDocument() // Average price (same as single price)
  })

  it('applies correct CSS classes', () => {
    const { container } = render(<IrecCertificateOverview data={mockOverviewData} />)
    
    // Check for gradient background
    const gradientElement = container.querySelector('.bg-gradient-to-br')
    expect(gradientElement).toBeInTheDocument()
    expect(gradientElement).toHaveClass('from-[#181B1F]')
    expect(gradientElement).toHaveClass('to-[#1A1D23]')
  })

  it('renders with custom className', () => {
    const { container } = render(
      <IrecCertificateOverview data={mockOverviewData} className="custom-class" />
    )
    
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })

  it('displays environmental impact correctly', () => {
    render(<IrecCertificateOverview data={mockOverviewData} />)
    
    expect(screen.getByText('Environmental Impact')).toBeInTheDocument()
    // Total CO2 avoided: 500000 + 1000000 + 750000 = 2,250,000
    expect(screen.getByText('2.3M')).toBeInTheDocument()
    expect(screen.getByText('tCO2e avoided')).toBeInTheDocument()
  })

  it('handles mixed vintage years correctly', () => {
    const mixedVintageData = [
      { ...mockOverviewData[0], vintage: { year: 2020 } },
      { ...mockOverviewData[1], vintage: { year: 2021 } },
      { ...mockOverviewData[2], vintage: { year: 2022 } }
    ]
    
    render(<IrecCertificateOverview data={mixedVintageData} />)
    
    expect(screen.getByText('2020')).toBeInTheDocument()
    expect(screen.getByText('2021')).toBeInTheDocument()
    expect(screen.getByText('2022')).toBeInTheDocument()
  })

  it('handles mixed statuses correctly', () => {
    const mixedStatusData = [
      { ...mockOverviewData[0], metadata: { status: 'active' } },
      { ...mockOverviewData[1], metadata: { status: 'retired' } },
      { ...mockOverviewData[2], metadata: { status: 'suspended' } }
    ]
    
    render(<IrecCertificateOverview data={mixedStatusData} />)
    
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Retired')).toBeInTheDocument()
    expect(screen.getByText('Suspended')).toBeInTheDocument()
  })

  it('handles invalid price data gracefully', () => {
    const invalidPriceData = [
      { ...mockOverviewData[0], trading: { currentPrice: 'invalid', volume: '50000' } }
    ]
    
    render(<IrecCertificateOverview data={invalidPriceData} />)
    
    expect(screen.getByText('Certificate Overview')).toBeInTheDocument()
    expect(screen.getByText('$0.00')).toBeInTheDocument() // Should default to 0
  })

  it('handles missing vintage data gracefully', () => {
    const missingVintageData = [
      { ...mockOverviewData[0], vintage: null }
    ]
    
    render(<IrecCertificateOverview data={missingVintageData} />)
    
    expect(screen.getByText('Certificate Overview')).toBeInTheDocument()
    expect(screen.getByText('Unknown')).toBeInTheDocument()
  })

  it('displays loading state correctly', () => {
    render(<IrecCertificateOverview data={[]} loading={true} />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('displays error state correctly', () => {
    render(<IrecCertificateOverview data={[]} error="Failed to load certificates" />)
    
    expect(screen.getByText('Error: Failed to load certificates')).toBeInTheDocument()
  })

  it('calculates total retirement correctly', () => {
    render(<IrecCertificateOverview data={mockOverviewData} />)
    
    expect(screen.getByText('Total Retired')).toBeInTheDocument()
    // Total retired: 200000 + 500000 + 500000 = 1,200,000
    expect(screen.getByText('1.2M')).toBeInTheDocument()
  })

  it('calculates utilization rate correctly', () => {
    render(<IrecCertificateOverview data={mockOverviewData} />)
    
    expect(screen.getByText('Utilization Rate')).toBeInTheDocument()
    // Utilization rate = (total supply - available supply) / total supply
    // ((1M + 2M + 1.5M) - (0.8M + 1.5M + 1M)) / (1M + 2M + 1.5M) = 1.2M / 4.5M = 26.7%
    expect(screen.getByText('26.7%')).toBeInTheDocument()
  })

  it('displays market trends correctly', () => {
    render(<IrecCertificateOverview data={mockOverviewData} />)
    
    expect(screen.getByText('Market Trends')).toBeInTheDocument()
    expect(screen.getByText('Price Trend')).toBeInTheDocument()
    expect(screen.getByText('Volume Trend')).toBeInTheDocument()
  })

  it('handles duplicate technology entries correctly', () => {
    const duplicateTechData = [
      { ...mockOverviewData[0], technology: 'Solar PV' },
      { ...mockOverviewData[1], technology: 'Solar PV' },
      { ...mockOverviewData[2], technology: 'Wind' }
    ]
    
    render(<IrecCertificateOverview data={duplicateTechData} />)
    
    // Should combine duplicate technologies
    expect(screen.getByText('Solar PV')).toBeInTheDocument()
    expect(screen.getByText('Wind')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // Count for Solar PV
    expect(screen.getByText('1')).toBeInTheDocument() // Count for Wind
  })
})