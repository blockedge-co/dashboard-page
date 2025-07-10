"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { 
  IrecCertificateComplete, 
  IrecCertificateList, 
  IrecAnalytics, 
  IrecSearchFilters,
  IrecCertificateStatus,
  IrecCertificateType 
} from '@/lib/types/irec'
import { getCompleteIrecCertificate, getIrecAnalytics } from '@/lib/irec-aggregation'
import { fetchIrecSupplyData } from '@/lib/irec-api'
import { fetchIrecOptimismActivity } from '@/lib/optimism-api'

// Hook state interface
interface IrecDataState {
  // Data
  certificates: IrecCertificateComplete[]
  analytics: IrecAnalytics | null
  
  // Loading states
  loading: boolean
  certificatesLoading: boolean
  analyticsLoading: boolean
  
  // Error states
  error: string | null
  certificatesError: string | null
  analyticsError: string | null
  
  // Pagination
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
  
  // Filters
  filters: IrecSearchFilters
  
  // Sorting
  sorting: {
    field: string
    direction: 'asc' | 'desc'
  }
}

// Hook configuration
interface UseIrecDataConfig {
  autoFetch?: boolean
  pageSize?: number
  cacheTimeout?: number
  enableRealtime?: boolean
  pollInterval?: number
}

// Hook return interface
interface UseIrecDataReturn extends IrecDataState {
  // Actions
  fetchCertificates: (filters?: IrecSearchFilters) => Promise<void>
  fetchAnalytics: () => Promise<void>
  getCertificate: (id: string) => Promise<IrecCertificateComplete | null>
  refresh: () => Promise<void>
  
  // Pagination
  nextPage: () => void
  previousPage: () => void
  setPage: (page: number) => void
  setPageSize: (size: number) => void
  
  // Filtering
  setFilters: (filters: Partial<IrecSearchFilters>) => void
  clearFilters: () => void
  
  // Sorting
  setSorting: (field: string, direction?: 'asc' | 'desc') => void
  
  // Utilities
  isLoading: boolean
  hasError: boolean
  hasData: boolean
}

export function useIrecData(config: UseIrecDataConfig = {}): UseIrecDataReturn {
  const {
    autoFetch = true,
    pageSize = 20,
    cacheTimeout = 5 * 60 * 1000, // 5 minutes
    enableRealtime = false,
    pollInterval = 30000 // 30 seconds
  } = config

  // State
  const [state, setState] = useState<IrecDataState>({
    certificates: [],
    analytics: null,
    loading: false,
    certificatesLoading: false,
    analyticsLoading: false,
    error: null,
    certificatesError: null,
    analyticsError: null,
    pagination: {
      page: 1,
      pageSize,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrevious: false
    },
    filters: {},
    sorting: {
      field: 'issuanceDate',
      direction: 'desc'
    }
  })

  // Cache for certificates
  const [certificateCache, setCertificateCache] = useState<Map<string, {
    data: IrecCertificateComplete
    timestamp: number
  }>>(new Map())

  // Fetch certificates
  const fetchCertificates = useCallback(async (filters?: IrecSearchFilters) => {
    setState(prev => ({
      ...prev,
      certificatesLoading: true,
      certificatesError: null
    }))

    try {
      const mergedFilters = { ...state.filters, ...filters }
      
      // Mock implementation - in real app, this would call your API
      const mockCertificates: IrecCertificateComplete[] = []
      
      // Calculate pagination
      const total = mockCertificates.length
      const totalPages = Math.ceil(total / state.pagination.pageSize)
      const hasNext = state.pagination.page < totalPages
      const hasPrevious = state.pagination.page > 1

      setState(prev => ({
        ...prev,
        certificates: mockCertificates,
        certificatesLoading: false,
        filters: mergedFilters,
        pagination: {
          ...prev.pagination,
          total,
          totalPages,
          hasNext,
          hasPrevious
        }
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        certificatesLoading: false,
        certificatesError: error instanceof Error ? error.message : 'Failed to fetch certificates'
      }))
    }
  }, [state.filters, state.pagination.pageSize, state.pagination.page])

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    setState(prev => ({
      ...prev,
      analyticsLoading: true,
      analyticsError: null
    }))

    try {
      const analytics = await getIrecAnalytics()
      setState(prev => ({
        ...prev,
        analytics,
        analyticsLoading: false
      }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        analyticsLoading: false,
        analyticsError: error instanceof Error ? error.message : 'Failed to fetch analytics'
      }))
    }
  }, [])

  // Get single certificate with caching
  const getCertificate = useCallback(async (id: string): Promise<IrecCertificateComplete | null> => {
    // Check cache first
    const cached = certificateCache.get(id)
    if (cached && (Date.now() - cached.timestamp) < cacheTimeout) {
      return cached.data
    }

    try {
      const certificate = await getCompleteIrecCertificate(id)
      
      // Update cache
      setCertificateCache(prev => new Map(prev).set(id, {
        data: certificate,
        timestamp: Date.now()
      }))
      
      return certificate
    } catch (error) {
      console.error('Failed to fetch certificate:', error)
      return null
    }
  }, [certificateCache, cacheTimeout])

  // Refresh all data
  const refresh = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      await Promise.all([
        fetchCertificates(),
        fetchAnalytics()
      ])
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to refresh data'
      }))
    } finally {
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [fetchCertificates, fetchAnalytics])

  // Pagination actions
  const nextPage = useCallback(() => {
    if (state.pagination.hasNext) {
      setState(prev => ({
        ...prev,
        pagination: { ...prev.pagination, page: prev.pagination.page + 1 }
      }))
    }
  }, [state.pagination.hasNext])

  const previousPage = useCallback(() => {
    if (state.pagination.hasPrevious) {
      setState(prev => ({
        ...prev,
        pagination: { ...prev.pagination, page: prev.pagination.page - 1 }
      }))
    }
  }, [state.pagination.hasPrevious])

  const setPage = useCallback((page: number) => {
    setState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, page }
    }))
  }, [])

  const setPageSize = useCallback((size: number) => {
    setState(prev => ({
      ...prev,
      pagination: { ...prev.pagination, pageSize: size, page: 1 }
    }))
  }, [])

  // Filter actions
  const setFilters = useCallback((filters: Partial<IrecSearchFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
      pagination: { ...prev.pagination, page: 1 } // Reset to first page
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: {},
      pagination: { ...prev.pagination, page: 1 }
    }))
  }, [])

  // Sorting actions
  const setSorting = useCallback((field: string, direction: 'asc' | 'desc' = 'asc') => {
    setState(prev => ({
      ...prev,
      sorting: { field, direction }
    }))
  }, [])

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      refresh()
    }
  }, [autoFetch, refresh])

  // Refetch when pagination or filters change
  useEffect(() => {
    if (autoFetch) {
      fetchCertificates()
    }
  }, [state.pagination.page, state.pagination.pageSize, state.filters, state.sorting])

  // Real-time polling
  useEffect(() => {
    if (enableRealtime && pollInterval > 0) {
      const interval = setInterval(refresh, pollInterval)
      return () => clearInterval(interval)
    }
  }, [enableRealtime, pollInterval, refresh])

  // Computed values
  const isLoading = state.loading || state.certificatesLoading || state.analyticsLoading
  const hasError = !!(state.error || state.certificatesError || state.analyticsError)
  const hasData = state.certificates.length > 0 || !!state.analytics

  return {
    ...state,
    fetchCertificates,
    fetchAnalytics,
    getCertificate,
    refresh,
    nextPage,
    previousPage,
    setPage,
    setPageSize,
    setFilters,
    clearFilters,
    setSorting,
    isLoading,
    hasError,
    hasData
  }
}

// Utility hook for single certificate
export function useIrecCertificate(id: string) {
  const [certificate, setCertificate] = useState<IrecCertificateComplete | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCertificate = useCallback(async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    try {
      const cert = await getCompleteIrecCertificate(id)
      setCertificate(cert)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch certificate')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCertificate()
  }, [fetchCertificate])

  return {
    certificate,
    loading,
    error,
    refetch: fetchCertificate
  }
}

// Utility hook for analytics only
export function useIrecAnalytics() {
  const [analytics, setAnalytics] = useState<IrecAnalytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getIrecAnalytics()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  }
}