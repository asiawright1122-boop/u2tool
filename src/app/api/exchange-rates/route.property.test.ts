import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { GET } from './route';
import { NextRequest } from 'next/server';
import { rateCache } from '@/lib/rate-cache';

global.fetch = vi.fn();

describe('Exchange Rates API Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    rateCache.clear();
  });

  describe('Property 2: Fallback Guarantee', () => {
    it('always returns valid rates even on API failure', () => {
      // Feature: currency-rate-update, Property 2: 降级保证
      // Validates: Requirements 3.1, 3.2

      fc.assert(
        fc.asyncProperty(
          fc.constantFrom('USD', 'EUR', 'GBP'),
          async (base) => {
            // Mock API failure
            (global.fetch as any).mockRejectedValueOnce(new Error('API Error'));

            const request = new NextRequest(`http://localhost:3000/api/exchange-rates?base=${base}`);
            const response = await GET(request);
            const data = await response.json();

            // Should return fallback
            expect(data.source).toBe('fallback');
            expect(data.rates).toBeDefined();
            expect(Object.keys(data.rates).length).toBeGreaterThan(0);
            
            // All rates should be positive
            Object.values(data.rates).forEach((rate: any) => {
              expect(rate).toBeGreaterThan(0);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
