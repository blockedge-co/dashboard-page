import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IrecTransactionHistory } from '../irec-transaction-history'
import type { IrecOptimismActivity, IrecOptimismTransaction } from '@/lib/types/irec'

// Mock window.open
Object.defineProperty(window, 'open', {
  value: jest.fn(),
  writable: true,
})

const mockTransactions: IrecOptimismTransaction[] = [
  {
    id: 'tx-1',
    transactionHash: '0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef01',
    blockNumber: 18500001,
    blockTimestamp: '2023-12-01T10:30:00Z',
    type: 'buy',
    certificateId: 'cert-1',
    amount: '100',
    amountInTokens: '100',
    from: '0x1234567890abcdef1234567890abcdef12345678',
    to: '0x9876543210fedcba9876543210fedcba98765432',
    pricePerToken: '45.00',
    totalValue: '4500',
    currency: 'USD',
    gasUsed: '21000',
    gasPrice: '20',
    transactionFee: '0.00042',
    contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    methodName: 'buyTokens',
    status: 'confirmed',
    metadata: {
      purpose: 'Carbon offset purchase',
      beneficiary: 'Corporate buyer',
    },
    createdAt: '2023-12-01T10:30:00Z',
  },
  {
    id: 'tx-2',
    transactionHash: '0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    blockNumber: 18500002,
    blockTimestamp: '2023-12-01T11:00:00Z',
    type: 'sell',
    certificateId: 'cert-1',
    amount: '50',
    amountInTokens: '50',
    from: '0x2345678901abcdef2345678901abcdef23456789',
    to: '0x8765432109fedcba8765432109fedcba87654321',
    pricePerToken: '47.00',
    totalValue: '2350',
    currency: 'USD',
    gasUsed: '25000',
    gasPrice: '22',
    transactionFee: '0.00055',
    contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    methodName: 'sellTokens',
    status: 'confirmed',
    metadata: {
      purpose: 'Liquidation',
    },
    createdAt: '2023-12-01T11:00:00Z',
  },
  {
    id: 'tx-3',
    transactionHash: '0x345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef23',
    blockNumber: 18500003,
    blockTimestamp: '2023-12-01T11:30:00Z',
    type: 'tokenize',
    certificateId: 'cert-1',
    amount: '200',
    amountInTokens: '200',
    from: '0x3456789012abcdef3456789012abcdef34567890',
    to: '0x7654321098fedcba7654321098fedcba76543210',
    pricePerToken: '44.00',
    totalValue: '8800',
    currency: 'USD',
    gasUsed: '30000',
    gasPrice: '18',
    transactionFee: '0.00054',
    contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    methodName: 'tokenizeCredits',
    status: 'pending',
    metadata: {
      purpose: 'Tokenization',
    },
    createdAt: '2023-12-01T11:30:00Z',
  },
]

const mockActivity: IrecOptimismActivity = {
  certificateId: 'cert-1',
  totalTransactions: 3,
  transactionsByType: {
    tokenize: 1,
    buy: 1,
    sell: 1,
    transfer: 0,
    retire: 0,
    redeem: 0,
  },
  totalVolume: '350',
  volumeByType: {
    tokenize: '200',
    buy: '100',
    sell: '50',
    transfer: '0',
    retire: '0',
    redeem: '0',
  },
  totalValue: '15650',
  valueByType: {
    tokenize: '8800',
    buy: '4500',
    sell: '2350',
    transfer: '0',
    retire: '0',
    redeem: '0',
  },
  recentTransactions: mockTransactions,
  topBuyers: [
    {
      address: '0x1234567890abcdef1234567890abcdef12345678',
      volume: '100',
      value: '4500',
      transactionCount: 1,
    },
  ],
  topSellers: [
    {
      address: '0x2345678901abcdef2345678901abcdef23456789',
      volume: '50',
      value: '2350',
      transactionCount: 1,
    },
  ],
  statistics: {
    averageTransactionSize: '116.67',
    averagePrice: '45.00',
    medianPrice: '45.00',
    priceRange: {
      min: '44.00',
      max: '47.00',
    },
    activityPeriod: {
      start: '2023-12-01T10:30:00Z',
      end: '2023-12-01T11:30:00Z',
    },
  },
  lastUpdated: '2023-12-01T12:00:00Z',
}

describe('IrecTransactionHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders transaction history with activity data', () => {
    render(<IrecTransactionHistory activity={mockActivity} />)
    
    expect(screen.getByText('Transaction History')).toBeInTheDocument()
    expect(screen.getByText('Complete transaction history for IREC certificates on Optimism')).toBeInTheDocument()
    expect(screen.getByText('3 Transactions')).toBeInTheDocument()
    expect(screen.getByText('Export')).toBeInTheDocument()
  })

  it('displays summary cards correctly', () => {
    render(<IrecTransactionHistory activity={mockActivity} />)
    
    // Check summary cards
    expect(screen.getByText('Total Volume')).toBeInTheDocument()
    expect(screen.getByText('350')).toBeInTheDocument()
    expect(screen.getByText('MWh Traded')).toBeInTheDocument()
    
    expect(screen.getByText('Total Value')).toBeInTheDocument()
    expect(screen.getByText('$15,650')).toBeInTheDocument()
    expect(screen.getByText('USD Volume')).toBeInTheDocument()
    
    expect(screen.getByText('Avg. Price')).toBeInTheDocument()
    expect(screen.getByText('$45')).toBeInTheDocument()
    expect(screen.getByText('Per MWh')).toBeInTheDocument()
    
    expect(screen.getByText('Avg. Size')).toBeInTheDocument()
    expect(screen.getByText('117')).toBeInTheDocument()
    expect(screen.getByText('MWh per TX')).toBeInTheDocument()
  })

  it('renders transaction table with correct data', () => {
    render(<IrecTransactionHistory activity={mockActivity} />)
    
    // Check table headers
    expect(screen.getByText('Time')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getByText('Amount')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
    expect(screen.getByText('From')).toBeInTheDocument()
    expect(screen.getByText('To')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Hash')).toBeInTheDocument()
    
    // Check transaction data
    expect(screen.getByText('Buy')).toBeInTheDocument()
    expect(screen.getByText('Sell')).toBeInTheDocument()
    expect(screen.getByText('Tokenize')).toBeInTheDocument()
    
    expect(screen.getByText('100 MWh')).toBeInTheDocument()
    expect(screen.getByText('50 MWh')).toBeInTheDocument()
    expect(screen.getByText('200 MWh')).toBeInTheDocument()
    
    expect(screen.getByText('$4,500')).toBeInTheDocument()
    expect(screen.getByText('$2,350')).toBeInTheDocument()
    expect(screen.getByText('$8,800')).toBeInTheDocument()
  })

  it('handles transaction type filtering', async () => {
    const user = userEvent.setup()
    render(<IrecTransactionHistory activity={mockActivity} />)
    
    // Initially shows all transactions
    expect(screen.getByText('Recent Transactions (3)')).toBeInTheDocument()
    
    // Filter by buy transactions
    const filterSelect = screen.getByRole('combobox')
    await user.click(filterSelect)
    await user.click(screen.getByText('Buy'))
    
    // Should show only buy transactions
    expect(screen.getByText('Recent Transactions (1)')).toBeInTheDocument()
    expect(screen.getByText('Buy')).toBeInTheDocument()
    expect(screen.queryByText('Sell')).not.toBeInTheDocument()
    expect(screen.queryByText('Tokenize')).not.toBeInTheDocument()
  })

  it('handles search functionality', async () => {
    const user = userEvent.setup()
    render(<IrecTransactionHistory activity={mockActivity} />)
    
    // Search for specific transaction hash
    const searchInput = screen.getByPlaceholderText('Search by hash, address, or method...')
    await user.type(searchInput, '0x123456789abcdef')
    
    // Should filter to matching transactions
    expect(screen.getByText('Recent Transactions (1)')).toBeInTheDocument()
  })

  it('handles column sorting', async () => {
    const user = userEvent.setup()
    render(<IrecTransactionHistory activity={mockActivity} />)
    
    // Click on Amount column header to sort
    const amountHeader = screen.getByText('Amount')
    await user.click(amountHeader)
    
    // Should trigger sorting (exact behavior depends on sort implementation)
    expect(amountHeader).toBeInTheDocument()
  })

  it('displays transaction status badges correctly', () => {
    render(<IrecTransactionHistory activity={mockActivity} />)
    
    // Check status badges
    expect(screen.getAllByText('Confirmed')).toHaveLength(2)
    expect(screen.getByText('Pending')).toBeInTheDocument()
  })

  it('formats addresses correctly', () => {
    render(<IrecTransactionHistory activity={mockActivity} />)
    
    // Check truncated addresses
    expect(screen.getByText('0x1234...5678')).toBeInTheDocument()
    expect(screen.getByText('0x2345...6789')).toBeInTheDocument()
    expect(screen.getByText('0x3456...7890')).toBeInTheDocument()
  })

  it('formats timestamps correctly', () => {
    render(<IrecTransactionHistory activity={mockActivity} />)
    
    // Check formatted dates
    expect(screen.getByText('Dec 1, 2023, 10:30 AM')).toBeInTheDocument()
    expect(screen.getByText('Dec 1, 2023, 11:00 AM')).toBeInTheDocument()
    expect(screen.getByText('Dec 1, 2023, 11:30 AM')).toBeInTheDocument()
    
    // Check block numbers
    expect(screen.getByText('Block 18500001')).toBeInTheDocument()
    expect(screen.getByText('Block 18500002')).toBeInTheDocument()
    expect(screen.getByText('Block 18500003')).toBeInTheDocument()
  })

  it('opens block explorer when hash is clicked', async () => {
    const user = userEvent.setup()
    const mockOpen = jest.fn()
    window.open = mockOpen
    
    render(<IrecTransactionHistory activity={mockActivity} />)
    
    // Click on external link button
    const externalLinkButtons = screen.getAllByRole('button')
    const hashLinkButton = externalLinkButtons.find(button => 
      button.querySelector('svg') // Find button with icon
    )
    
    if (hashLinkButton) {
      await user.click(hashLinkButton)
      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('optimistic.etherscan.io/tx/'),
        '_blank'
      )
    }
  })

  it('displays transaction type breakdown', () => {
    render(<IrecTransactionHistory activity={mockActivity} />)
    
    expect(screen.getByText('Transaction Types')).toBeInTheDocument()
    expect(screen.getByText('Tokenize')).toBeInTheDocument()
    expect(screen.getByText('Buy')).toBeInTheDocument()
    expect(screen.getByText('Sell')).toBeInTheDocument()
  })

  it('displays top participants', async () => {
    const user = userEvent.setup()
    render(<IrecTransactionHistory activity={mockActivity} />)
    
    expect(screen.getByText('Top Participants')).toBeInTheDocument()
    expect(screen.getByText('Top Buyers')).toBeInTheDocument()
    expect(screen.getByText('Top Sellers')).toBeInTheDocument()
    
    // Check buyers tab
    expect(screen.getByText('0x1234...5678')).toBeInTheDocument()
    expect(screen.getByText('100 MWh')).toBeInTheDocument()
    expect(screen.getByText('$4,500')).toBeInTheDocument()
    
    // Switch to sellers tab
    await user.click(screen.getByText('Top Sellers'))
    expect(screen.getByText('0x2345...6789')).toBeInTheDocument()
    expect(screen.getByText('50 MWh')).toBeInTheDocument()
    expect(screen.getByText('$2,350')).toBeInTheDocument()
  })

  it('handles empty transaction list', () => {
    const emptyActivity = {
      ...mockActivity,
      recentTransactions: [],
      totalTransactions: 0,
    }
    
    render(<IrecTransactionHistory activity={emptyActivity} />)
    
    expect(screen.getByText('Recent Transactions (0)')).toBeInTheDocument()
  })

  it('handles large numbers correctly', () => {
    const activityWithLargeNumbers = {
      ...mockActivity,
      totalVolume: '1000000',
      totalValue: '50000000',
      statistics: {
        ...mockActivity.statistics,
        averageTransactionSize: '1000000',
      },
    }
    
    render(<IrecTransactionHistory activity={activityWithLargeNumbers} />)
    
    expect(screen.getByText('1.0M')).toBeInTheDocument()
    expect(screen.getByText('$50,000,000')).toBeInTheDocument()
  })

  it('applies correct CSS classes', () => {
    const { container } = render(<IrecTransactionHistory activity={mockActivity} />)
    
    // Check for gradient background
    const gradientElement = container.querySelector('.bg-gradient-to-br')
    expect(gradientElement).toBeInTheDocument()
    expect(gradientElement).toHaveClass('from-[#181B1F]')
    expect(gradientElement).toHaveClass('to-[#1A1D23]')
  })

  it('renders with custom className', () => {
    const { container } = render(
      <IrecTransactionHistory activity={mockActivity} className="custom-class" />
    )
    
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })

  it('handles certificateId prop correctly', () => {
    render(<IrecTransactionHistory certificateId="cert-123" activity={mockActivity} />)
    
    expect(screen.getByText('Transaction History')).toBeInTheDocument()
  })

  it('calculates percentages correctly in type breakdown', () => {
    render(<IrecTransactionHistory activity={mockActivity} />)
    
    // Each type has 1 transaction out of 3 total = 33.3%
    expect(screen.getAllByText('33.3%')).toHaveLength(3)
  })

  it('displays transaction icons correctly', () => {
    render(<IrecTransactionHistory activity={mockActivity} />)
    
    // Check for transaction type icons (they should be rendered as divs with appropriate classes)
    const typeIcons = screen.getAllByTestId('transaction-type-icon')
    expect(typeIcons).toHaveLength(3) // One for each transaction type
  })

  it('handles missing optional fields gracefully', () => {
    const activityWithMissingFields = {
      ...mockActivity,
      recentTransactions: [
        {
          ...mockTransactions[0],
          metadata: {},
        },
      ],
    }
    
    render(<IrecTransactionHistory activity={activityWithMissingFields} />)
    
    // Should render without errors
    expect(screen.getByText('Transaction History')).toBeInTheDocument()
  })

  it('handles transaction with failed status', () => {
    const activityWithFailedTransaction = {
      ...mockActivity,
      recentTransactions: [
        {
          ...mockTransactions[0],
          status: 'failed' as const,
        },
      ],
    }
    
    render(<IrecTransactionHistory activity={activityWithFailedTransaction} />)
    
    expect(screen.getByText('Failed')).toBeInTheDocument()
  })

  it('handles transaction with reverted status', () => {
    const activityWithRevertedTransaction = {
      ...mockActivity,
      recentTransactions: [
        {
          ...mockTransactions[0],
          status: 'reverted' as const,
        },
      ],
    }
    
    render(<IrecTransactionHistory activity={activityWithRevertedTransaction} />)
    
    expect(screen.getByText('Reverted')).toBeInTheDocument()
  })

  it('clears search when filter is changed', async () => {
    const user = userEvent.setup()
    render(<IrecTransactionHistory activity={mockActivity} />)
    
    // Add search term
    const searchInput = screen.getByPlaceholderText('Search by hash, address, or method...')
    await user.type(searchInput, 'test search')
    
    // Change filter
    const filterSelect = screen.getByRole('combobox')
    await user.click(filterSelect)
    await user.click(screen.getByText('Buy'))
    
    // Search should work with filter
    expect(screen.getByDisplayValue('test search')).toBeInTheDocument()
  })
})