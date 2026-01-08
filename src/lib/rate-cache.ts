// Server-side cache for exchange rates
// Stores rates in memory with TTL (Time To Live)

export interface CacheEntry {
  rates: Record<string, number>;
  timestamp: Date;
  base: string;
}

export class RateCache {
  private cache: Map<string, CacheEntry>;
  private ttl: number; // TTL in milliseconds (1 hour)

  constructor(ttlMinutes: number = 60) {
    this.cache = new Map();
    this.ttl = ttlMinutes * 60 * 1000;
  }

  /**
   * Get cached rates for a base currency
   * Returns null if not found or expired
   */
  get(base: string): CacheEntry | null {
    const entry = this.cache.get(base);
    
    if (!entry) {
      return null;
    }

    if (!this.isValid(entry)) {
      // Remove expired entry
      this.cache.delete(base);
      return null;
    }

    return entry;
  }

  /**
   * Store rates in cache
   */
  set(base: string, rates: Record<string, number>): void {
    const entry: CacheEntry = {
      rates,
      timestamp: new Date(),
      base,
    };
    
    this.cache.set(base, entry);
  }

  /**
   * Check if a cache entry is still valid (not expired)
   */
  isValid(entry: CacheEntry): boolean {
    const now = new Date().getTime();
    const entryTime = entry.timestamp.getTime();
    const age = now - entryTime;
    
    return age < this.ttl;
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get all cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

// Global cache instance (shared across API route invocations)
export const rateCache = new RateCache(60); // 1 hour TTL
