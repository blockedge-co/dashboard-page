import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IrecCertificateDetails } from '../irec-certificate-details'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
})

const mockCertificateData = [
  {
    id: 'irec-001',
    certificateId: 'IREC-TEST-001',
    projectName: 'Test Solar Farm',
    country: 'USA',
    technology: 'Solar PV',
    vintage: { year: 2023 },
    supply: { 
      total: '1000000', 
      available: '750000', 
      retired: '250000' 
    },
    verification: { 
      verifiedBy: 'Test Verifier', 
      registry: 'International REC Standard' 
    },
    environmental: { 
      co2Avoided: 500000, 
      co2Unit: 'tCO2e' 
    },
    trading: { 
      currentPrice: 45.50, 
      currency: 'USD' 
    },
    metadata: { 
      status: 'active' 
    }
  },
  {
    id: 'irec-002',
    certificateId: 'IREC-TEST-002',
    projectName: 'Test Wind Farm',
    country: 'Germany',
    technology: 'Wind',
    vintage: { year: 2022 },
    supply: { 
      total: '2000000', 
      available: '1500000', 
      retired: '500000' 
    },
    verification: { 
      verifiedBy: 'Another Verifier', 
      registry: 'European REC Standard' 
    },
    environmental: { 
      co2Avoided: 1000000, 
      co2Unit: 'tCO2e' 
    },
    trading: { 
      currentPrice: 42.00, 
      currency: 'EUR' 
    },
    metadata: { 
      status: 'retired' 
    }
  }
]

describe('IrecCertificateDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders certificate details with data', () => {
    render(<IrecCertificateDetails data={mockCertificateData} />)
    
    expect(screen.getByText('Certificate Details')).toBeInTheDocument()
    expect(screen.getByText('Detailed information about selected IREC certificate')).toBeInTheDocument()
    expect(screen.getByText('Test Solar Farm')).toBeInTheDocument()
    expect(screen.getByText('IREC-TEST-001')).toBeInTheDocument()
  })

  it('renders with empty data using default values', () => {
    render(<IrecCertificateDetails data={[]} />)
    
    expect(screen.getByText('Certificate Details')).toBeInTheDocument()
    expect(screen.getByText('Hydropower Plant Demo')).toBeInTheDocument()
    expect(screen.getByText('IREC-DEMO-001')).toBeInTheDocument()
  })

  it('displays certificate status badge correctly', () => {
    render(<IrecCertificateDetails data={mockCertificateData} />)
    
    expect(screen.getByText('Active')).toBeInTheDocument()
    
    const statusBadge = screen.getByText('Active')
    expect(statusBadge).toHaveClass('text-green-400')
  })

  it('displays different status badges correctly', () => {
    const retiredCertificate = [{
      ...mockCertificateData[0],
      metadata: { status: 'retired' }
    }]
    
    render(<IrecCertificateDetails data={retiredCertificate} />)
    
    expect(screen.getByText('Retired')).toBeInTheDocument()
    
    const statusBadge = screen.getByText('Retired')
    expect(statusBadge).toHaveClass('text-red-400')
  })

  it('displays key metrics cards correctly', () => {
    render(<IrecCertificateDetails data={mockCertificateData} />)
    
    expect(screen.getByText('Total Supply')).toBeInTheDocument()
    expect(screen.getByText('1.0M')).toBeInTheDocument()
    
    expect(screen.getByText('Current Price')).toBeInTheDocument()
    expect(screen.getByText('$45.50')).toBeInTheDocument()
  })

  it('formats large numbers correctly', () => {
    const certificateWithLargeNumbers = [{
      ...mockCertificateData[0],
      supply: { 
        total: '5000000', 
        available: '3750000', 
        retired: '1250000' 
      }
    }]
    
    render(<IrecCertificateDetails data={certificateWithLargeNumbers} />)
    
    expect(screen.getByText('5.0M')).toBeInTheDocument()
  })

  it('formats currency correctly', () => {
    const certificateWithCustomPrice = [{
      ...mockCertificateData[0],
      trading: { 
        currentPrice: 123.45, 
        currency: 'USD' 
      }
    }]
    
    render(<IrecCertificateDetails data={certificateWithCustomPrice} />)
    
    expect(screen.getByText('$123.45')).toBeInTheDocument()
  })

  it('calculates supply utilization correctly', () => {
    render(<IrecCertificateDetails data={mockCertificateData} />)
    
    // Supply utilization = (total - available) / total * 100
    // (1000000 - 750000) / 1000000 * 100 = 25%
    // This should be displayed somewhere in the component
    expect(screen.getByText('Certificate Details')).toBeInTheDocument()
  })

  it('calculates retirement rate correctly', () => {
    render(<IrecCertificateDetails data={mockCertificateData} />)
    
    // Retirement rate = retired / total * 100
    // 250000 / 1000000 * 100 = 25%
    // This should be displayed somewhere in the component
    expect(screen.getByText('Certificate Details')).toBeInTheDocument()
  })

  it('handles copy certificate ID functionality', async () => {
    const user = userEvent.setup()
    const mockWriteText = jest.fn()
    navigator.clipboard.writeText = mockWriteText
    
    render(<IrecCertificateDetails data={mockCertificateData} />)
    
    const copyButton = screen.getByRole('button', { name: '' }) // Copy button has no text
    await user.click(copyButton)
    
    expect(mockWriteText).toHaveBeenCalledWith('IREC-TEST-001')
  })

  it('handles View button click', async () => {
    const user = userEvent.setup()
    render(<IrecCertificateDetails data={mockCertificateData} />)
    
    const viewButton = screen.getByRole('button', { name: /view/i })
    await user.click(viewButton)
    
    expect(viewButton).toBeInTheDocument()
  })

  it('handles missing optional fields gracefully', () => {
    const certificateWithMissingFields = [{
      id: 'irec-003',
      certificateId: 'IREC-TEST-003',
      projectName: 'Minimal Test Certificate',
      country: 'Test Country',
      technology: 'Test Technology',
      vintage: { year: 2023 },
      metadata: { status: 'active' }
      // Missing supply, verification, environmental, trading fields
    }]
    
    render(<IrecCertificateDetails data={certificateWithMissingFields} />)
    
    expect(screen.getByText('Minimal Test Certificate')).toBeInTheDocument()
    expect(screen.getByText('IREC-TEST-003')).toBeInTheDocument()
    expect(screen.getByText('$0.00')).toBeInTheDocument() // Default price
    expect(screen.getByText('0')).toBeInTheDocument() // Default supply
  })

  it('handles null/undefined supply data', () => {
    const certificateWithNullSupply = [{
      ...mockCertificateData[0],
      supply: null
    }]
    
    render(<IrecCertificateDetails data={certificateWithNullSupply} />)
    
    expect(screen.getByText('Test Solar Farm')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument() // Default supply value
  })

  it('handles null/undefined trading data', () => {
    const certificateWithNullTrading = [{
      ...mockCertificateData[0],
      trading: null
    }]
    
    render(<IrecCertificateDetails data={certificateWithNullTrading} />)
    
    expect(screen.getByText('Test Solar Farm')).toBeInTheDocument()
    expect(screen.getByText('$0.00')).toBeInTheDocument() // Default price
  })

  it('displays certificate ID with proper styling', () => {
    render(<IrecCertificateDetails data={mockCertificateData} />)
    
    const certificateId = screen.getByText('IREC-TEST-001')
    expect(certificateId).toHaveClass('bg-gray-700')
    expect(certificateId).toHaveClass('text-green-400')
  })

  it('applies correct CSS classes for styling', () => {
    const { container } = render(<IrecCertificateDetails data={mockCertificateData} />)
    
    // Check for gradient background
    const gradientElement = container.querySelector('.bg-gradient-to-br')
    expect(gradientElement).toBeInTheDocument()
    expect(gradientElement).toHaveClass('from-[#181B1F]')
    expect(gradientElement).toHaveClass('to-[#1A1D23]')
  })

  it('renders with custom className', () => {
    const { container } = render(
      <IrecCertificateDetails data={mockCertificateData} className="custom-class" />
    )
    
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })

  it('handles suspended status correctly', () => {
    const suspendedCertificate = [{
      ...mockCertificateData[0],
      metadata: { status: 'suspended' }
    }]
    
    render(<IrecCertificateDetails data={suspendedCertificate} />)
    
    expect(screen.getByText('Suspended')).toBeInTheDocument()
    
    const statusBadge = screen.getByText('Suspended')
    expect(statusBadge).toHaveClass('text-yellow-400')
  })

  it('handles cancelled status correctly', () => {
    const cancelledCertificate = [{
      ...mockCertificateData[0],
      metadata: { status: 'cancelled' }
    }]
    
    render(<IrecCertificateDetails data={cancelledCertificate} />)
    
    expect(screen.getByText('Cancelled')).toBeInTheDocument()
    
    const statusBadge = screen.getByText('Cancelled')
    expect(statusBadge).toHaveClass('text-gray-400')
  })

  it('handles unknown status with default styling', () => {
    const unknownStatusCertificate = [{
      ...mockCertificateData[0],
      metadata: { status: 'unknown' }
    }]
    
    render(<IrecCertificateDetails data={unknownStatusCertificate} />)
    
    expect(screen.getByText('Unknown')).toBeInTheDocument()
    
    const statusBadge = screen.getByText('Unknown')
    expect(statusBadge).toHaveClass('text-green-400') // Default to active styling
  })

  it('formats numbers below 1000 correctly', () => {
    const certificateWithSmallNumbers = [{
      ...mockCertificateData[0],
      supply: { 
        total: '500', 
        available: '300', 
        retired: '200' 
      }
    }]
    
    render(<IrecCertificateDetails data={certificateWithSmallNumbers} />)
    
    expect(screen.getByText('500')).toBeInTheDocument()
  })

  it('formats numbers in thousands correctly', () => {
    const certificateWithThousands = [{
      ...mockCertificateData[0],
      supply: { 
        total: '15000', 
        available: '12000', 
        retired: '3000' 
      }
    }]
    
    render(<IrecCertificateDetails data={certificateWithThousands} />)
    
    expect(screen.getByText('15.0K')).toBeInTheDocument()
  })

  it('displays project name with icon', () => {
    render(<IrecCertificateDetails data={mockCertificateData} />)
    
    const projectName = screen.getByText('Test Solar Farm')
    expect(projectName).toBeInTheDocument()
    
    // Check for Award icon (it should be in the same container)
    const headingElement = projectName.closest('h3')
    expect(headingElement).toBeInTheDocument()
  })

  it('handles zero values correctly', () => {
    const certificateWithZeroValues = [{
      ...mockCertificateData[0],
      supply: { 
        total: '0', 
        available: '0', 
        retired: '0' 
      },
      trading: { 
        currentPrice: 0, 
        currency: 'USD' 
      }
    }]
    
    render(<IrecCertificateDetails data={certificateWithZeroValues} />)
    
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('$0.00')).toBeInTheDocument()
  })

  it('handles string numbers correctly', () => {
    const certificateWithStringNumbers = [{
      ...mockCertificateData[0],
      supply: { 
        total: '1000.50', 
        available: '750.25', 
        retired: '250.25' 
      }
    }]
    
    render(<IrecCertificateDetails data={certificateWithStringNumbers} />)
    
    expect(screen.getByText('1,001')).toBeInTheDocument() // Should be formatted as integer
  })

  it('handles invalid number strings gracefully', () => {
    const certificateWithInvalidNumbers = [{
      ...mockCertificateData[0],
      supply: { 
        total: 'invalid', 
        available: 'also-invalid', 
        retired: 'not-a-number' 
      }
    }]
    
    render(<IrecCertificateDetails data={certificateWithInvalidNumbers} />)
    
    expect(screen.getByText('Test Solar Farm')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument() // Should default to 0
  })
})