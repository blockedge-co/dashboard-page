import { renderHook, act } from '@testing-library/react'
import { useIrecData, useIrecCertificate, useIrecAnalytics } from '../useIrecData'
import { getCompleteIrecCertificate, getIrecAnalytics } from '@/lib/irec-aggregation'
import type { IrecCertificateComplete, IrecAnalytics } from '@/lib/types/irec'

// Mock the API functions
jest.mock('@/lib/irec-aggregation', () => ({
  getCompleteIrecCertificate: jest.fn(),
  getIrecAnalytics: jest.fn(),
}))

jest.mock('@/lib/irec-api', () => ({
  fetchSupplyData: jest.fn(),
}))

jest.mock('@/lib/optimism-api', () => ({
  fetchOptimismActivity: jest.fn(),
}))

const mockGetCompleteCertificate = getCompleteIrecCertificate as jest.MockedFunction<typeof getCompleteIrecCertificate>
const mockGetAnalytics = getIrecAnalytics as jest.MockedFunction<typeof getIrecAnalytics>

const mockCertificate: IrecCertificateComplete = {
  id: 'test-cert-1',
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
    name: 'Test Solar Farm',
    location: 'California, USA',
    technology: 'Solar PV',
    capacity: '50 MW',
  },
  currentOwner: '0x123456789abcdef',
  registryName: 'IREC Registry',
  registryUrl: 'https://irec.registry.com',
  verification: {
    verifier: 'Test Verifier',
    verificationDate: '2023-01-15',
    verificationStandard: 'IREC Standard',
    documentHash: '0xabcdef123456',
  },
  supplyData: {
    certificateId: 'test-cert-1',
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
    certificateId: 'test-cert-1',
    totalTransactions: 10,
    transactionsByType: {
      tokenize: 2,
      buy: 3,
      sell: 2,
      transfer: 2,
      retire: 1,
      redeem: 0,
    },
    totalVolume: '500',
    volumeByType: {
      tokenize: '200',
      buy: '150',
      sell: '100',
      transfer: '50',
      retire: '25',
      redeem: '0',
    },
    totalValue: '22500',
    valueByType: {
      tokenize: '9000',
      buy: '6750',
      sell: '4500',
      transfer: '2250',
      retire: '1125',
      redeem: '0',
    },
    recentTransactions: [],
    topBuyers: [],
    topSellers: [],
    statistics: {
      averageTransactionSize: '50',
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
}

const mockAnalytics: IrecAnalytics = {
  overview: {
    totalCertificates: 100,
    totalSupply: '100000',
    totalValue: '4500000',
    activeMarkets: 5,
    averagePrice: '45.00',
  },
  byStatus: {
    active: { count: 70, supply: '70000', value: '3150000', percentage: 70 },
    tokenized: { count: 15, supply: '15000', value: '675000', percentage: 15 },
    retired: { count: 10, supply: '10000', value: '450000', percentage: 10 },
    transferred: { count: 3, supply: '3000', value: '135000', percentage: 3 },
    expired: { count: 1, supply: '1000', value: '45000', percentage: 1 },
    revoked: { count: 1, supply: '1000', value: '45000', percentage: 1 },
    pending: { count: 0, supply: '0', value: '0', percentage: 0 },
  },
  byType: {
    renewable_energy: { count: 80, supply: '80000', value: '3600000', percentage: 80 },
    carbon_offset: { count: 15, supply: '15000', value: '675000', percentage: 15 },
    energy_efficiency: { count: 3, supply: '3000', value: '135000', percentage: 3 },
    biofuel: { count: 1, supply: '1000', value: '45000', percentage: 1 },
    waste_to_energy: { count: 1, supply: '1000', value: '45000', percentage: 1 },
    other: { count: 0, supply: '0', value: '0', percentage: 0 },
  },
  byCountry: {
    USA: { count: 50, supply: '50000', value: '2250000', percentage: 50 },
    Germany: { count: 20, supply: '20000', value: '900000', percentage: 20 },
    Spain: { count: 15, supply: '15000', value: '675000', percentage: 15 },
    France: { count: 10, supply: '10000', value: '450000', percentage: 10 },
    Italy: { count: 5, supply: '5000', value: '225000', percentage: 5 },
  },
  timeSeriesData: {
    daily: [],
    monthly: [],
  },
  trends: {
    supplyGrowth: 0.15,
    priceChange: 0.05,
    volumeChange: 0.22,
    marketCapChange: 0.18,
    newCertificateRate: 0.12,
  },
  topPerformers: {
    mostTraded: [],
    highestValue: [],
    mostLiquid: [],
    recentlyAdded: [],
  },
  lastUpdated: '2023-01-01T00:00:00Z',
}

describe('useIrecData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetCompleteCertificate.mockResolvedValue(mockCertificate)
    mockGetAnalytics.mockResolvedValue(mockAnalytics)
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useIrecData({ autoFetch: false }))

    expect(result.current.certificates).toEqual([])
    expect(result.current.analytics).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.pagination.page).toBe(1)
    expect(result.current.pagination.pageSize).toBe(20)
    expect(result.current.filters).toEqual({})
    expect(result.current.sorting.field).toBe('issuanceDate')
    expect(result.current.sorting.direction).toBe('desc')
  })

  it('fetches analytics successfully', async () => {
    const { result } = renderHook(() => useIrecData({ autoFetch: false }))

    await act(async () => {
      await result.current.fetchAnalytics()
    })

    expect(mockGetAnalytics).toHaveBeenCalledTimes(1)
    expect(result.current.analytics).toEqual(mockAnalytics)
    expect(result.current.analyticsLoading).toBe(false)
    expect(result.current.analyticsError).toBeNull()
  })

  it('handles analytics fetch error', async () => {
    const error = new Error('Analytics fetch failed')
    mockGetAnalytics.mockRejectedValue(error)

    const { result } = renderHook(() => useIrecData({ autoFetch: false }))

    await act(async () => {
      await result.current.fetchAnalytics()
    })

    expect(result.current.analytics).toBeNull()
    expect(result.current.analyticsLoading).toBe(false)
    expect(result.current.analyticsError).toBe('Analytics fetch failed')
  })

  it('gets single certificate with caching', async () => {
    const { result } = renderHook(() => useIrecData({ autoFetch: false }))

    await act(async () => {
      const cert = await result.current.getCertificate('test-cert-1')
      expect(cert).toEqual(mockCertificate)
    })

    expect(mockGetCompleteCertificate).toHaveBeenCalledWith('test-cert-1')
    expect(mockGetCompleteCertificate).toHaveBeenCalledTimes(1)

    // Second call should use cache
    await act(async () => {
      const cert = await result.current.getCertificate('test-cert-1')
      expect(cert).toEqual(mockCertificate)
    })

    expect(mockGetCompleteCertificate).toHaveBeenCalledTimes(1) // Still 1 due to cache
  })

  it('handles certificate fetch error', async () => {
    const error = new Error('Certificate fetch failed')
    mockGetCompleteCertificate.mockRejectedValue(error)

    const { result } = renderHook(() => useIrecData({ autoFetch: false }))

    await act(async () => {
      const cert = await result.current.getCertificate('test-cert-1')
      expect(cert).toBeNull()
    })
  })

  it('handles pagination correctly', async () => {
    const { result } = renderHook(() => useIrecData({ autoFetch: false }))

    act(() => {
      result.current.setPage(2)
    })

    expect(result.current.pagination.page).toBe(2)

    act(() => {
      result.current.setPageSize(50)
    })

    expect(result.current.pagination.pageSize).toBe(50)
    expect(result.current.pagination.page).toBe(1) // Should reset to page 1
  })

  it('handles filters correctly', async () => {
    const { result } = renderHook(() => useIrecData({ autoFetch: false }))

    act(() => {
      result.current.setFilters({ status: ['active'], country: ['USA'] })
    })

    expect(result.current.filters).toEqual({
      status: ['active'],
      country: ['USA'],
    })
    expect(result.current.pagination.page).toBe(1) // Should reset to page 1

    act(() => {
      result.current.clearFilters()
    })

    expect(result.current.filters).toEqual({})
  })

  it('handles sorting correctly', async () => {
    const { result } = renderHook(() => useIrecData({ autoFetch: false }))

    act(() => {
      result.current.setSorting('energyAmount', 'asc')
    })

    expect(result.current.sorting.field).toBe('energyAmount')
    expect(result.current.sorting.direction).toBe('asc')
  })

  it('computes isLoading correctly', () => {
    const { result } = renderHook(() => useIrecData({ autoFetch: false }))

    expect(result.current.isLoading).toBe(false)

    act(() => {
      result.current.fetchAnalytics()
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('computes hasError correctly', async () => {
    const { result } = renderHook(() => useIrecData({ autoFetch: false }))

    expect(result.current.hasError).toBe(false)

    mockGetAnalytics.mockRejectedValue(new Error('Test error'))

    await act(async () => {
      await result.current.fetchAnalytics()
    })

    expect(result.current.hasError).toBe(true)
  })

  it('computes hasData correctly', async () => {
    const { result } = renderHook(() => useIrecData({ autoFetch: false }))

    expect(result.current.hasData).toBe(false)

    await act(async () => {
      await result.current.fetchAnalytics()
    })

    expect(result.current.hasData).toBe(true)
  })

  it('refreshes all data', async () => {
    const { result } = renderHook(() => useIrecData({ autoFetch: false }))

    await act(async () => {
      await result.current.refresh()
    })

    expect(mockGetAnalytics).toHaveBeenCalledTimes(1)
    expect(result.current.analytics).toEqual(mockAnalytics)
  })

  it('handles custom configuration', () => {
    const config = {
      autoFetch: false,
      pageSize: 10,
      cacheTimeout: 60000,
      enableRealtime: true,
      pollInterval: 5000,
    }

    const { result } = renderHook(() => useIrecData(config))

    expect(result.current.pagination.pageSize).toBe(10)
  })
})

describe('useIrecCertificate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetCompleteCertificate.mockResolvedValue(mockCertificate)
  })

  it('fetches certificate on mount', async () => {
    const { result } = renderHook(() => useIrecCertificate('test-cert-1'))

    await act(async () => {
      // Wait for the effect to run
    })

    expect(mockGetCompleteCertificate).toHaveBeenCalledWith('test-cert-1')
    expect(result.current.certificate).toEqual(mockCertificate)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('handles certificate fetch error', async () => {
    const error = new Error('Certificate fetch failed')
    mockGetCompleteCertificate.mockRejectedValue(error)

    const { result } = renderHook(() => useIrecCertificate('test-cert-1'))

    await act(async () => {
      // Wait for the effect to run
    })

    expect(result.current.certificate).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('Certificate fetch failed')
  })

  it('does not fetch when no id provided', async () => {
    const { result } = renderHook(() => useIrecCertificate(''))

    await act(async () => {
      // Wait for the effect to run
    })

    expect(mockGetCompleteCertificate).not.toHaveBeenCalled()
    expect(result.current.certificate).toBeNull()
  })

  it('refetches when id changes', async () => {
    const { result, rerender } = renderHook(
      ({ id }) => useIrecCertificate(id),
      { initialProps: { id: 'test-cert-1' } }
    )

    await act(async () => {
      // Wait for the effect to run
    })

    expect(mockGetCompleteCertificate).toHaveBeenCalledWith('test-cert-1')

    rerender({ id: 'test-cert-2' })

    await act(async () => {
      // Wait for the effect to run
    })

    expect(mockGetCompleteCertificate).toHaveBeenCalledWith('test-cert-2')
    expect(mockGetCompleteCertificate).toHaveBeenCalledTimes(2)
  })

  it('provides refetch function', async () => {
    const { result } = renderHook(() => useIrecCertificate('test-cert-1'))

    await act(async () => {
      // Wait for the effect to run
    })

    expect(mockGetCompleteCertificate).toHaveBeenCalledTimes(1)

    await act(async () => {
      await result.current.refetch()
    })

    expect(mockGetCompleteCertificate).toHaveBeenCalledTimes(2)
  })
})

describe('useIrecAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGetAnalytics.mockResolvedValue(mockAnalytics)
  })

  it('fetches analytics on mount', async () => {
    const { result } = renderHook(() => useIrecAnalytics())

    await act(async () => {
      // Wait for the effect to run
    })

    expect(mockGetAnalytics).toHaveBeenCalledTimes(1)
    expect(result.current.analytics).toEqual(mockAnalytics)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('handles analytics fetch error', async () => {
    const error = new Error('Analytics fetch failed')
    mockGetAnalytics.mockRejectedValue(error)

    const { result } = renderHook(() => useIrecAnalytics())

    await act(async () => {
      // Wait for the effect to run
    })

    expect(result.current.analytics).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('Analytics fetch failed')
  })

  it('provides refetch function', async () => {
    const { result } = renderHook(() => useIrecAnalytics())

    await act(async () => {
      // Wait for the effect to run
    })

    expect(mockGetAnalytics).toHaveBeenCalledTimes(1)

    await act(async () => {
      await result.current.refetch()
    })

    expect(mockGetAnalytics).toHaveBeenCalledTimes(2)
  })
})