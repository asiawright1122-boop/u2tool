/**
 * Property-Based Tests for Percentage Calculator
 * **Feature: add-new-tools, Property 8: 百分比计算正确性**
 * **Validates: Requirements 9.1**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculatePercentageOf,
  calculateWhatPercent,
  calculatePercentageChange,
  calculateValueAfterChange,
} from './PercentageCalculator';

describe('PercentageCalculator - Property 8: 百分比计算正确性', () => {
  /**
   * Property: For any values a and b (where b != 0), 
   * calculateWhatPercent(a, b) should equal (a/b)*100
   */
  it('should correctly calculate what percent a is of b', () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(-1e6), max: Math.fround(1e6), noNaN: true }),
        fc.float({ min: Math.fround(0.01), max: Math.fround(1e6), noNaN: true }), // b must be non-zero
        (a, b) => {
          const result = calculateWhatPercent(a, b);
          const expected = (a / b) * 100;
          // Use approximate equality due to floating point precision
          expect(result).toBeCloseTo(expected, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any value and percentage,
   * calculatePercentageOf(value, percentage) should equal (value * percentage) / 100
   */
  it('should correctly calculate percentage of a value', () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(-1e6), max: Math.fround(1e6), noNaN: true }),
        fc.float({ min: Math.fround(-1000), max: Math.fround(1000), noNaN: true }),
        (value, percentage) => {
          const result = calculatePercentageOf(value, percentage);
          const expected = (value * percentage) / 100;
          expect(result).toBeCloseTo(expected, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any old and new values (where old != 0),
   * calculatePercentageChange should equal ((new - old) / old) * 100
   */
  it('should correctly calculate percentage change', () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(0.01), max: Math.fround(1e6), noNaN: true }), // old must be non-zero
        fc.float({ min: Math.fround(-1e6), max: Math.fround(1e6), noNaN: true }),
        (oldValue, newValue) => {
          const result = calculatePercentageChange(oldValue, newValue);
          const expected = ((newValue - oldValue) / oldValue) * 100;
          expect(result).toBeCloseTo(expected, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: For any value and percentage,
   * increase then decrease by same percentage should not return to original
   * (this is a known mathematical property)
   * But increase by X% then decrease by the result percentage should return to original
   */
  it('should correctly calculate value after increase/decrease', () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(1), max: Math.fround(1e6), noNaN: true }),
        fc.float({ min: Math.fround(0), max: Math.fround(100), noNaN: true }),
        (value, percentage) => {
          const increased = calculateValueAfterChange(value, percentage, true);
          const decreased = calculateValueAfterChange(value, percentage, false);
          
          // Verify increase formula: value + (value * percentage / 100)
          const expectedIncrease = value + (value * percentage) / 100;
          expect(increased).toBeCloseTo(expectedIncrease, 5);
          
          // Verify decrease formula: value - (value * percentage / 100)
          const expectedDecrease = value - (value * percentage) / 100;
          expect(decreased).toBeCloseTo(expectedDecrease, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: calculateWhatPercent should return 0 when whole is 0
   */
  it('should handle division by zero gracefully', () => {
    expect(calculateWhatPercent(100, 0)).toBe(0);
    expect(calculatePercentageChange(0, 100)).toBe(0);
  });

  /**
   * Property: 100% of any value should equal that value
   */
  it('should return the same value for 100%', () => {
    fc.assert(
      fc.property(
        fc.float({ min: Math.fround(-1e6), max: Math.fround(1e6), noNaN: true }),
        (value) => {
          const result = calculatePercentageOf(value, 100);
          expect(result).toBeCloseTo(value, 5);
        }
      ),
      { numRuns: 100 }
    );
  });
});
