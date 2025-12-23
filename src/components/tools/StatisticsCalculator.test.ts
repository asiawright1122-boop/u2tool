/**
 * Property-Based Tests for Statistics Calculator
 * **Feature: add-new-tools, Property 9: 统计计算正确性**
 * **Validates: Requirements 9.4**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateMean,
  calculateMedian,
  calculateMode,
  calculateVariance,
  calculateStdDev,
  calculateSum,
  calculateMin,
  calculateMax,
  calculateRange,
  parseNumbers,
} from './StatisticsCalculator';

describe('StatisticsCalculator - Property 9: 统计计算正确性', () => {
  /**
   * Property: For any list of numbers, the mean should equal sum / count
   */
  it('should correctly calculate mean as sum divided by count', () => {
    fc.assert(
      fc.property(
        fc.array(fc.float({ min: Math.fround(-1e6), max: Math.fround(1e6), noNaN: true }), { minLength: 1, maxLength: 100 }),
        (numbers) => {
          const mean = calculateMean(numbers);
          const expectedMean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
          expect(mean).toBeCloseTo(expectedMean, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Sum should equal the total of all numbers
   */
  it('should correctly calculate sum', () => {
    fc.assert(
      fc.property(
        fc.array(fc.float({ min: Math.fround(-1e6), max: Math.fround(1e6), noNaN: true }), { minLength: 1, maxLength: 100 }),
        (numbers) => {
          const sum = calculateSum(numbers);
          const expectedSum = numbers.reduce((acc, n) => acc + n, 0);
          expect(sum).toBeCloseTo(expectedSum, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Min should be less than or equal to all numbers
   */
  it('should correctly calculate min', () => {
    fc.assert(
      fc.property(
        fc.array(fc.float({ min: Math.fround(-1e6), max: Math.fround(1e6), noNaN: true }), { minLength: 1, maxLength: 100 }),
        (numbers) => {
          const min = calculateMin(numbers);
          expect(numbers.every(n => n >= min)).toBe(true);
          expect(numbers.includes(min)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Max should be greater than or equal to all numbers
   */
  it('should correctly calculate max', () => {
    fc.assert(
      fc.property(
        fc.array(fc.float({ min: Math.fround(-1e6), max: Math.fround(1e6), noNaN: true }), { minLength: 1, maxLength: 100 }),
        (numbers) => {
          const max = calculateMax(numbers);
          expect(numbers.every(n => n <= max)).toBe(true);
          expect(numbers.includes(max)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Range should equal max - min
   */
  it('should correctly calculate range as max minus min', () => {
    fc.assert(
      fc.property(
        fc.array(fc.float({ min: Math.fround(-1e6), max: Math.fround(1e6), noNaN: true }), { minLength: 1, maxLength: 100 }),
        (numbers) => {
          const range = calculateRange(numbers);
          const expectedRange = calculateMax(numbers) - calculateMin(numbers);
          expect(range).toBeCloseTo(expectedRange, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Median should be the middle value when sorted
   */
  it('should correctly calculate median', () => {
    fc.assert(
      fc.property(
        fc.array(fc.float({ min: Math.fround(-1e6), max: Math.fround(1e6), noNaN: true }), { minLength: 1, maxLength: 100 }),
        (numbers) => {
          const median = calculateMedian(numbers);
          const sorted = [...numbers].sort((a, b) => a - b);
          const mid = Math.floor(sorted.length / 2);
          const expectedMedian = sorted.length % 2 !== 0
            ? sorted[mid]
            : (sorted[mid - 1] + sorted[mid]) / 2;
          expect(median).toBeCloseTo(expectedMedian, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Population variance should be non-negative
   */
  it('should calculate non-negative variance', () => {
    fc.assert(
      fc.property(
        fc.array(fc.float({ min: Math.fround(-1e6), max: Math.fround(1e6), noNaN: true }), { minLength: 1, maxLength: 100 }),
        (numbers) => {
          const variance = calculateVariance(numbers, true);
          expect(variance).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Standard deviation should be sqrt of variance
   */
  it('should calculate stdDev as sqrt of variance', () => {
    fc.assert(
      fc.property(
        fc.array(fc.float({ min: Math.fround(-1e6), max: Math.fround(1e6), noNaN: true }), { minLength: 1, maxLength: 100 }),
        (numbers) => {
          const variance = calculateVariance(numbers, true);
          const stdDev = calculateStdDev(numbers, true);
          expect(stdDev).toBeCloseTo(Math.sqrt(variance), 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Empty array should return 0 for all calculations
   */
  it('should handle empty arrays gracefully', () => {
    expect(calculateMean([])).toBe(0);
    expect(calculateMedian([])).toBe(0);
    expect(calculateMode([])).toEqual([]);
    expect(calculateVariance([])).toBe(0);
    expect(calculateStdDev([])).toBe(0);
    expect(calculateSum([])).toBe(0);
    expect(calculateMin([])).toBe(0);
    expect(calculateMax([])).toBe(0);
    expect(calculateRange([])).toBe(0);
  });

  /**
   * Property: parseNumbers should correctly parse various formats
   */
  it('should correctly parse numbers from string', () => {
    expect(parseNumbers('1, 2, 3')).toEqual([1, 2, 3]);
    expect(parseNumbers('1 2 3')).toEqual([1, 2, 3]);
    expect(parseNumbers('1\n2\n3')).toEqual([1, 2, 3]);
    expect(parseNumbers('1; 2; 3')).toEqual([1, 2, 3]);
    expect(parseNumbers('1.5, 2.5, 3.5')).toEqual([1.5, 2.5, 3.5]);
    expect(parseNumbers('invalid')).toEqual([]);
    expect(parseNumbers('')).toEqual([]);
  });
});
