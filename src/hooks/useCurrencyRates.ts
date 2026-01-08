'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseCurrencyRatesResult {
  rates: Record<string, number> | null;
  loading: boolean;
  error: Error | null;
  timestamp: Date | null;
  source: 'api' | 'cache' | 'fallback' | null;
  refetch: () => Promise<void>;
}

interface CacheEntry {
  rates: Record<string, number>;
  timestamp: Date;
  source: 'api' | 'cache' | 'fallback';
}

// Client-side cache (1 hour TTL)
const clientCache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function isCacheValid(entry: CacheEntry): boolean {
  const age = Date.now() - entry.timestamp.getTime();
  return age < CACHE_TTL;
}

export function useCurrencyRates(baseCurrency: string = 'USD'): UseCurrencyRatesResult {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [timestamp, setTimestamp] = useState<Date | null>(null);
  const [source, setSource] = useState<'api' | 'cache' | 'fallback' | null>(null);
  
  // Track if component is mounted
  const isMounted = useRef(true);

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check client cache first
      const cached = clientCache.get(baseCurrency);
      if (cached && isCacheValid(cached)) {
        if (isMounted.current) {
          setRates(cached.rates);
          setTimestamp(cached.timestamp);
          setSource('cache');
          setLoading(false);
        }
        return;
      }

      // Fetch from API route
      const response = await fetch(`/api/exchange-rates?base=${baseCurrency}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch rates: ${response.status}`);
      }

      const data = await response.json();

      // Cache the response
      const cacheEntry: CacheEntry = {
        rates: data.rates,
        timestamp: new Date(data.timestamp),
        source: data.source,
      };
      clientCache.set(baseCurrency, cacheEntry);

      if (isMounted.current) {
        setRates(data.rates);
        setTimestamp(new Date(data.timestamp));
        setSource(data.source);
        setLoading(false);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    }
  }, [baseCurrency]);

  const refetch = useCallback(async () => {
    // Clear cache for this currency
    clientCache.delete(baseCurrency);
    await fetchRates();
  }, [baseCurrency, fetchRates]);

  useEffect(() => {
    isMounted.current = true;
    fetchRates();

    return () => {
      isMounted.current = false;
    };
  }, [fetchRates]);

  return {
    rates,
    loading,
    error,
    timestamp,
    source,
    refetch,
  };
}
