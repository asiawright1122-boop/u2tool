import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { RateCache } from './rate-cache';

describe('RateCache Property Tests', () => {
  describe('Property 1: Cache Consistency', () => {
    it('cached rates are returned without modification', () => {
      // Feature: currency-rate-update, Property 1: 缓存一致性
      // Validates: Requirements 1.5
      
      fc.assert(
        fc.property(
          fc.string({ minLength: 3, maxLength: 3 }), // base currency code
          fc.dictionary(
            fc.string({ minLength: 3, maxLength: 3 }), // currency code
            fc.double({ min: 0.001, max: 10000, noNaN: true }) // rate
          ),
          (base, rates) => {
            const cache = new RateCache(60);
            
            // Set cache
            cache.set(base, rates);
            
            // Get from cache
            const entry = cache.get(base);
            
            // Verify cache returns exact same data
            expect(entry).not.toBeNull();
            expect(entry!.base).toBe(base);
            expect(entry!.rates).toEqual(rates);
            
            // Verify timestamp is recent (within last second)
            const now = new Date().getTime();
            const entryTime = entry!.timestamp.getTime();
            expect(now - entryTime).toBeLessThan(1000);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('valid cached entries are always returned', () => {
      // Feature: currency-rate-update, Property 1: 缓存一致性
      // Validates: Requirements 1.5
      
      fc.assert(
        fc.property(
          fc.string({ minLength: 3, maxLength: 3 }),
          fc.dictionary(
            fc.string({ minLength: 3, maxLength: 3 }),
            fc.double({ min: 0.001, max: 10000, noNaN: true })
          ),
          fc.integer({ min: 1, max: 10 }), // number of gets
          (base, rates, numGets) => {
            const cache = new RateCache(60);
            cache.set(base, rates);
            
            // Multiple gets should return same data
            for (let i = 0; i < numGets; i++) {
              const entry = cache.get(base);
              expect(entry).not.toBeNull();
              expect(entry!.rates).toEqual(rates);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('cache entries remain valid within TTL', () => {
      // Feature: currency-rate-update, Property 1: 缓存一致性
      // Validates: Requirements 1.5
      
      fc.assert(
        fc.property(
          fc.string({ minLength: 3, maxLength: 3 }),
          fc.dictionary(
            fc.string({ minLength: 3, maxLength: 3 }),
            fc.double({ min: 0.001, max: 10000, noNaN: true })
          ),
          (base, rates) => {
            const cache = new RateCache(60); // 60 minutes
            cache.set(base, rates);
            
            const entry = cache.get(base);
            expect(entry).not.toBeNull();
            
            // Entry should be valid immediately after creation
            expect(cache.isValid(entry!)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('different base currencies are cached independently', () => {
      // Feature: currency-rate-update, Property 1: 缓存一致性
      // Validates: Requirements 1.5
      
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              base: fc.string({ minLength: 3, maxLength: 3 }),
              rates: fc.dictionary(
                fc.string({ minLength: 3, maxLength: 3 }),
                fc.double({ min: 0.001, max: 10000, noNaN: true })
              ),
            }),
            { minLength: 1, maxLength: 10 }
          ),
          (entries) => {
            const cache = new RateCache(60);
            
            // Set all entries
            entries.forEach(({ base, rates }) => {
              cache.set(base, rates);
            });
            
            // Verify each entry is stored independently
            entries.forEach(({ base, rates }) => {
              const entry = cache.get(base);
              expect(entry).not.toBeNull();
              expect(entry!.base).toBe(base);
              expect(entry!.rates).toEqual(rates);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
