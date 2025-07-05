// Advanced caching strategies extending existing patterns from co2e-api.ts
// Provides performance-optimized data fetching with proper cache invalidation

import type {
  CacheConfig,
  CacheEntry,
  CacheStats,
  ValidationResult,
  ApiResponse,
} from "./types";
import { getConfig } from "./config";

/**
 * Advanced cache manager that extends existing caching patterns
 * with support for TTL, LRU eviction, and intelligent refresh strategies
 */
export class CacheManager {
  private cache = new Map<string, CacheEntry>();
  private accessOrder = new Map<string, number>(); // For LRU tracking
  private accessCounter = 0;
  private cleanupTimer?: NodeJS.Timeout;
  private stats: CacheStats = {
    size: 0,
    maxSize: 1000,
    hitRate: 0,
    missRate: 0,
    evictions: 0,
    totalRequests: 0,
    lastCleanup: Date.now(),
  };

  constructor(private readonly config: { maxSize?: number; cleanupInterval?: number } = {}) {
    this.stats.maxSize = config.maxSize || 1000;
    
    // Start periodic cleanup
    this.startPeriodicCleanup(config.cleanupInterval || 5 * 60 * 1000); // 5 minutes
  }

  /**
   * Get data from cache with automatic refresh and validation
   */
  async get<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    cacheConfig: CacheConfig
  ): Promise<T> {
    this.stats.totalRequests++;
    const entry = this.cache.get(key);
    const now = Date.now();

    // Cache hit - check if still valid
    if (entry && now < entry.expiresAt) {
      this.updateAccessStats(key, true);
      
      // Background refresh if close to expiry
      if (cacheConfig.refreshThreshold && 
          (entry.expiresAt - now) < cacheConfig.refreshThreshold) {
        this.backgroundRefresh(key, fetchFunction, cacheConfig);
      }
      
      return entry.data as T;
    }

    // Cache miss or expired - fetch fresh data
    this.updateAccessStats(key, false);
    const data = await fetchFunction();
    this.set(key, data, cacheConfig);
    return data;
  }

  /**
   * Set data in cache with automatic eviction
   */
  set<T>(key: string, data: T, config: CacheConfig): void {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt: now + config.ttl,
      accessCount: 1,
      lastAccessed: now,
      metadata: {
        source: "cache-manager",
        version: "1.0.0",
        tags: [],
      },
    };

    // Remove existing entry if present
    if (this.cache.has(key)) {
      this.cache.delete(key);
      this.accessOrder.delete(key);
    }

    // Check if we need to evict entries
    if (this.cache.size >= this.stats.maxSize) {
      this.evictEntries(config.strategy);
    }

    // Add new entry
    this.cache.set(key, entry);
    this.accessOrder.set(key, this.accessCounter++);
    this.stats.size = this.cache.size;
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() >= entry.expiresAt) {
      this.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Delete entry from cache
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    this.accessOrder.delete(key);
    this.stats.size = this.cache.size;
    return deleted;
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder.clear();
    this.stats.size = 0;
    this.stats.lastCleanup = Date.now();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    this.calculateHitRates();
    return { ...this.stats };
  }

  /**
   * Validate cached data integrity
   */
  validate(): ValidationResult {
    const errors: any[] = [];
    const warnings: any[] = [];
    let validEntries = 0;
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.expiresAt) {
        warnings.push({
          field: key,
          message: "Entry has expired",
          code: "EXPIRED_ENTRY",
          severity: "warning" as const,
        });
      } else {
        validEntries++;
      }

      if (!entry.data) {
        errors.push({
          field: key,
          message: "Entry contains null or undefined data",
          code: "INVALID_DATA",
          severity: "error" as const,
        });
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

  /**
   * Bulk operations for better performance
   */
  async getMany<T>(
    keys: string[],
    fetchFunction: (missingKeys: string[]) => Promise<Record<string, T>>,
    cacheConfig: CacheConfig
  ): Promise<Record<string, T>> {
    const result: Record<string, T> = {};
    const missingKeys: string[] = [];
    const now = Date.now();

    // Check cache for each key
    for (const key of keys) {
      const entry = this.cache.get(key);
      if (entry && now < entry.expiresAt) {
        result[key] = entry.data as T;
        this.updateAccessStats(key, true);
      } else {
        missingKeys.push(key);
        this.updateAccessStats(key, false);
      }
    }

    // Fetch missing data in bulk
    if (missingKeys.length > 0) {
      const freshData = await fetchFunction(missingKeys);
      
      // Cache the fresh data
      for (const [key, data] of Object.entries(freshData)) {
        this.set(key, data, cacheConfig);
        result[key] = data;
      }
    }

    return result;
  }

  /**
   * Set multiple entries at once
   */
  setMany<T>(data: Record<string, T>, config: CacheConfig): void {
    for (const [key, value] of Object.entries(data)) {
      this.set(key, value, config);
    }
  }

  /**
   * Intelligent prefetching based on access patterns
   */
  async prefetch<T>(
    keys: string[],
    fetchFunction: (key: string) => Promise<T>,
    cacheConfig: CacheConfig
  ): Promise<void> {
    const prefetchPromises = keys
      .filter(key => !this.has(key))
      .map(async (key) => {
        try {
          const data = await fetchFunction(key);
          this.set(key, data, cacheConfig);
        } catch (error) {
          console.warn(`Prefetch failed for key ${key}:`, error);
        }
      });

    await Promise.allSettled(prefetchPromises);
  }

  /**
   * Background refresh without blocking
   */
  private async backgroundRefresh<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    cacheConfig: CacheConfig
  ): Promise<void> {
    try {
      const data = await fetchFunction();
      this.set(key, data, cacheConfig);
    } catch (error) {
      console.warn(`Background refresh failed for key ${key}:`, error);
    }
  }

  /**
   * Evict entries based on strategy
   */
  private evictEntries(strategy: "lru" | "fifo" | "ttl"): void {
    const entriesToEvict = Math.ceil(this.stats.maxSize * 0.1); // Evict 10%
    
    switch (strategy) {
      case "lru":
        this.evictLRU(entriesToEvict);
        break;
      case "fifo":
        this.evictFIFO(entriesToEvict);
        break;
      case "ttl":
        this.evictByTTL(entriesToEvict);
        break;
    }
    
    this.stats.evictions += entriesToEvict;
  }

  /**
   * Evict least recently used entries
   */
  private evictLRU(count: number): void {
    const sortedByAccess = Array.from(this.accessOrder.entries())
      .sort(([, a], [, b]) => a - b)
      .slice(0, count);

    for (const [key] of sortedByAccess) {
      this.delete(key);
    }
  }

  /**
   * Evict first in, first out entries
   */
  private evictFIFO(count: number): void {
    const keys = Array.from(this.cache.keys()).slice(0, count);
    for (const key of keys) {
      this.delete(key);
    }
  }

  /**
   * Evict entries closest to expiration
   */
  private evictByTTL(count: number): void {
    const sortedByExpiry = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.expiresAt - b.expiresAt)
      .slice(0, count);

    for (const [key] of sortedByExpiry) {
      this.delete(key);
    }
  }

  /**
   * Update access statistics
   */
  private updateAccessStats(key: string, hit: boolean): void {
    if (hit) {
      const entry = this.cache.get(key);
      if (entry) {
        entry.accessCount++;
        entry.lastAccessed = Date.now();
        this.accessOrder.set(key, this.accessCounter++);
      }
    }
  }

  /**
   * Calculate hit and miss rates
   */
  private calculateHitRates(): void {
    if (this.stats.totalRequests > 0) {
      const hits = this.stats.totalRequests - this.stats.evictions;
      this.stats.hitRate = hits / this.stats.totalRequests;
      this.stats.missRate = 1 - this.stats.hitRate;
    }
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startPeriodicCleanup(interval: number): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }

    this.cleanupTimer = setInterval(() => {
      this.cleanupExpiredEntries();
    }, interval);
  }

  /**
   * Remove expired entries
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.expiresAt) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      this.delete(key);
    }

    this.stats.lastCleanup = now;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clear();
  }
}

/**
 * Enhanced data fetcher that integrates with existing co2eApi patterns
 */
export class EnhancedDataFetcher {
  private cacheManager: CacheManager;

  constructor(cacheConfig?: { maxSize?: number; cleanupInterval?: number }) {
    this.cacheManager = new CacheManager(cacheConfig);
  }

  /**
   * Fetch data with caching, retries, and error handling
   */
  async fetchWithCache<T>(
    url: string,
    options: {
      cacheConfig: CacheConfig;
      retries?: number;
      timeout?: number;
      headers?: Record<string, string>;
    }
  ): Promise<ApiResponse<T>> {
    const { cacheConfig, retries = 3, timeout = 10000, headers = {} } = options;
    const cacheKey = this.generateCacheKey(url, headers);

    try {
      const data = await this.cacheManager.get(
        cacheKey,
        () => this.fetchData<T>(url, { retries, timeout, headers }),
        cacheConfig
      );

      return {
        success: true,
        data,
        metadata: {
          timestamp: new Date().toISOString(),
          version: "2.0.0",
          cached: true,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "FETCH_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
          details: error,
        },
        metadata: {
          timestamp: new Date().toISOString(),
          version: "2.0.0",
          cached: false,
        },
      };
    }
  }

  /**
   * Batch fetch multiple URLs with caching
   */
  async fetchManyWithCache<T>(
    urls: string[],
    options: {
      cacheConfig: CacheConfig;
      retries?: number;
      timeout?: number;
      headers?: Record<string, string>;
      concurrency?: number;
    }
  ): Promise<Record<string, ApiResponse<T>>> {
    const { concurrency = 5 } = options;
    const results: Record<string, ApiResponse<T>> = {};

    // Process URLs in batches to control concurrency
    for (let i = 0; i < urls.length; i += concurrency) {
      const batch = urls.slice(i, i + concurrency);
      const batchPromises = batch.map(async (url) => {
        const result = await this.fetchWithCache<T>(url, options);
        return { url, result };
      });

      const batchResults = await Promise.allSettled(batchPromises);
      
      for (const result of batchResults) {
        if (result.status === "fulfilled") {
          results[result.value.url] = result.value.result;
        } else {
          console.error("Batch fetch error:", result.reason);
        }
      }
    }

    return results;
  }

  /**
   * Invalidate cache entries by pattern
   */
  invalidateByPattern(pattern: RegExp): number {
    let invalidated = 0;
    const keys = Array.from(this.cacheManager['cache'].keys());
    
    for (const key of keys) {
      if (pattern.test(key)) {
        this.cacheManager.delete(key);
        invalidated++;
      }
    }
    
    return invalidated;
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): CacheStats {
    return this.cacheManager.getStats();
  }

  /**
   * Validate cache integrity
   */
  validateCache(): ValidationResult {
    return this.cacheManager.validate();
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cacheManager.clear();
  }

  /**
   * Prefetch data based on predicted access patterns
   */
  async prefetchData<T>(
    urls: string[],
    options: {
      cacheConfig: CacheConfig;
      retries?: number;
      timeout?: number;
      headers?: Record<string, string>;
    }
  ): Promise<void> {
    await this.cacheManager.prefetch(
      urls,
      (url) => this.fetchData<T>(url, { 
        retries: options.retries || 3, 
        timeout: options.timeout || 10000, 
        headers: options.headers || {} 
      }),
      options.cacheConfig
    );
  }

  /**
   * Internal fetch implementation with retries
   */
  private async fetchData<T>(
    url: string,
    options: {
      retries: number;
      timeout: number;
      headers: Record<string, string>;
    }
  ): Promise<T> {
    const { retries, timeout, headers } = options;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt < retries) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error("Max retries exceeded");
  }

  /**
   * Generate cache key from URL and headers
   */
  private generateCacheKey(url: string, headers: Record<string, string>): string {
    const headerStr = Object.entries(headers)
      .sort()
      .map(([k, v]) => `${k}:${v}`)
      .join(";");
    
    return `${url}|${headerStr}`;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.cacheManager.destroy();
  }
}

// Export singleton instances that integrate with existing config
const appConfig = getConfig();

export const cacheManager = new CacheManager({
  maxSize: 1000,
  cleanupInterval: 5 * 60 * 1000, // 5 minutes
});

export const enhancedDataFetcher = new EnhancedDataFetcher({
  maxSize: 1000,
  cleanupInterval: 5 * 60 * 1000,
});

// Export utility functions that integrate with existing patterns
export const getCachedData = <T>(
  key: string,
  fetchFunction: () => Promise<T>,
  cacheConfig: CacheConfig
): Promise<T> => cacheManager.get(key, fetchFunction, cacheConfig);

export const setCachedData = <T>(
  key: string,
  data: T,
  cacheConfig: CacheConfig
): void => cacheManager.set(key, data, cacheConfig);

export const invalidateCache = (pattern: RegExp): number =>
  enhancedDataFetcher.invalidateByPattern(pattern);

export const getCacheStats = (): CacheStats => cacheManager.getStats();

export const validateCacheIntegrity = (): ValidationResult =>
  cacheManager.validate();

// Default cache configurations that extend existing patterns
export const CACHE_CONFIGS = {
  PROJECTS: {
    key: "projects",
    ttl: appConfig.cache.projectsCacheDuration,
    strategy: "ttl" as const,
    refreshThreshold: appConfig.cache.projectsCacheDuration * 0.8,
  },
  STATS: {
    key: "stats", 
    ttl: appConfig.cache.statsCacheDuration,
    strategy: "ttl" as const,
    refreshThreshold: appConfig.cache.statsCacheDuration * 0.8,
  },
  RETIREMENTS: {
    key: "retirements",
    ttl: 2 * 60 * 1000, // 2 minutes
    strategy: "ttl" as const,
    refreshThreshold: 1.5 * 60 * 1000, // 1.5 minutes
  },
  BLOCKCHAIN: {
    key: "blockchain",
    ttl: 30 * 1000, // 30 seconds
    strategy: "ttl" as const,
    refreshThreshold: 20 * 1000, // 20 seconds
  },
} as const;