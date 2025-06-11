import { useState, useEffect, useMemo } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function useDebouncedFilter<T>(
  items: T[],
  filters: {
    type?: string
    registry?: string
    search?: string
  },
  filterFunctions: {
    byType?: (item: T, type: string) => boolean
    byRegistry?: (item: T, registry: string) => boolean
    bySearch?: (item: T, search: string) => boolean
  },
  delay: number = 300
) {
  const debouncedFilters = {
    type: useDebounce(filters.type || 'all', delay),
    registry: useDebounce(filters.registry || 'all', delay),
    search: useDebounce(filters.search || '', delay)
  }

  const filteredItems = useMemo(() => {
    let filtered = items

    if (debouncedFilters.type !== 'all' && filterFunctions.byType) {
      filtered = filtered.filter(item => filterFunctions.byType!(item, debouncedFilters.type))
    }

    if (debouncedFilters.registry !== 'all' && filterFunctions.byRegistry) {
      filtered = filtered.filter(item => filterFunctions.byRegistry!(item, debouncedFilters.registry))
    }

    if (debouncedFilters.search && filterFunctions.bySearch) {
      filtered = filtered.filter(item => filterFunctions.bySearch!(item, debouncedFilters.search))
    }

    return filtered
  }, [items, debouncedFilters, filterFunctions])

  return filteredItems
}