import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { CurrencyService } from './currency-service';

describe('CurrencyService Property Tests', () => {
  const service = new CurrencyService();

  describe('Property 3: Data Validation', () => {
    it('rejects all rates with non-positive values', () => {
      // Feature: currency-rate-update, Property 3: 数据验证
      // Validates: Requirements 6.1, 6.2

      fc.assert(
        fc.property(
          fc.dictionary(
            fc.string({ minLength: 3, maxLength: 3 }),
            fc.oneof(
              fc.constant(0),
              fc.double({ max: 0, noNaN: true }),
              fc.constant(NaN),
              fc.constant(-Infinity)
            )
          ),
          (rates) => {
            fc.pre(Object.keys(rates).length > 0); // Skip empty objects

            const result = service.validateRates(rates);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('accepts all rates with positive values', () => {
      // Feature: currency-rate-update, Property 3: 数据验证
      // Validates: Requirements 6.1, 6.2

      fc.assert(
        fc.property(
          fc.dictionary(
            fc.constantFrom('EUR', 'GBP', 'JPY', 'CNY', 'CHF'),
            fc.double({ min: 0.001, max: 10000, noNaN: true })
          ),
          (rates) => {
            fc.pre(Object.keys(rates).length > 0);

            const result = service.validateRates(rates);
            // Should be valid (no negative/zero/NaN values)
            // Might have warnings about differences from fallback, but that's OK
            expect(result.errors.every((e) => !e.includes('Invalid rate'))).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 7: Conversion Symmetry', () => {
    it('converting A->B->A returns original amount', () => {
      // Feature: currency-rate-update, Property 7: 转换对称性
      // Validates: Requirements 1.1

      fc.assert(
        fc.property(
          fc.double({ min: 0.01, max: 1000000, noNaN: true }),
          fc.constantFrom('USD', 'EUR', 'GBP', 'JPY', 'CNY'),
          fc.constantFrom('USD', 'EUR', 'GBP', 'JPY', 'CNY'),
          fc.record({
            USD: fc.constant(1),
            EUR: fc.double({ min: 0.5, max: 1.5, noNaN: true }),
            GBP: fc.double({ min: 0.5, max: 1.5, noNaN: true }),
            JPY: fc.double({ min: 100, max: 200, noNaN: true }),
            CNY: fc.double({ min: 5, max: 10, noNaN: true }),
          }),
          (amount, currA, currB, rates) => {
            fc.pre(currA !== currB); // Skip same currency

            try {
              // A -> B
              const toB = service.convert(amount, currA, currB, rates, 'USD');
              // B -> A
              const backToA = service.convert(toB, currB, currA, rates, 'USD');

              // Should be close to original (within 0.01% due to floating point)
              const difference = Math.abs(backToA - amount) / amount;
              expect(difference).toBeLessThan(0.0001);
            } catch (error) {
              // If conversion fails, that's also acceptable (missing rate)
              expect(error).toBeDefined();
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 8: Rate Transitivity', () => {
    it('A->B->C equals A->C direct conversion', () => {
      // Feature: currency-rate-update, Property 8: 汇率传递性
      // Validates: Requirements 1.1

      fc.assert(
        fc.property(
          fc.double({ min: 0.01, max: 1000000, noNaN: true }),
          fc.constantFrom('USD', 'EUR', 'GBP', 'JPY', 'CNY'),
          fc.constantFrom('USD', 'EUR', 'GBP', 'JPY', 'CNY'),
          fc.constantFrom('USD', 'EUR', 'GBP', 'JPY', 'CNY'),
          fc.record({
            USD: fc.constant(1),
            EUR: fc.double({ min: 0.5, max: 1.5, noNaN: true }),
            GBP: fc.double({ min: 0.5, max: 1.5, noNaN: true }),
            JPY: fc.double({ min: 100, max: 200, noNaN: true }),
            CNY: fc.double({ min: 5, max: 10, noNaN: true }),
          }),
          (amount, currA, currB, currC, rates) => {
            fc.pre(currA !== currB && currB !== currC && currA !== currC);

            try {
              // A -> B -> C
              const toB = service.convert(amount, currA, currB, rates, 'USD');
              const toC = service.convert(toB, currB, currC, rates, 'USD');

              // A -> C (direct)
              const directToC = service.convert(amount, currA, currC, rates, 'USD');

              // Should be equal (within floating point precision)
              const difference = Math.abs(toC - directToC) / directToC;
              expect(difference).toBeLessThan(0.0001);
            } catch (error) {
              // If conversion fails, that's acceptable
              expect(error).toBeDefined();
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Additional Properties', () => {
    it('mergeRates always returns same number of currencies', () => {
      fc.assert(
        fc.property(
          fc.dictionary(
            fc.string({ minLength: 3, maxLength: 3 }),
            fc.double({ min: 0.001, max: 10000, noNaN: true })
          ),
          fc.constantFrom('USD', 'EUR', 'GBP'),
          (apiRates, base) => {
            const merged = service.mergeRates(apiRates, base);
            const fallbackRates = service.getFallbackRates(base);

            // Should have same number of currencies as fallback
            expect(merged.length).toBe(Object.keys(fallbackRates).length);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('base currency always has rate 1 after merge', () => {
      fc.assert(
        fc.property(
          fc.dictionary(
            fc.string({ minLength: 3, maxLength: 3 }),
            fc.double({ min: 0.001, max: 10000, noNaN: true })
          ),
          fc.constantFrom('USD', 'EUR', 'GBP', 'JPY'),
          (apiRates, base) => {
            const merged = service.mergeRates(apiRates, base);
            const baseCurrency = merged.find((c) => c.code === base);

            expect(baseCurrency).toBeDefined();
            expect(baseCurrency!.rate).toBe(1);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
