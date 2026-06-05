import { describe, it, expect } from 'vitest';
import {
  calculateOneRepMax,
  generateLoadTable,
} from './one-rep-max-helper';

describe('calculateOneRepMax', () => {
  it('calculates 1RM correctly using Epley and Brzycki formulas', () => {
    // Weight: 100, Reps: 5
    // Epley: 100 * (1 + 5/30) = 116.67
    // Brzycki: 100 / (1.0278 - 0.0278 * 5) = 100 / 0.8888 = 112.51
    const result = calculateOneRepMax({ weight: 100, reps: 5 });
    expect(result.epleyMax).toBeCloseTo(116.67, 1);
    expect(result.brzyckiMax).toBeCloseTo(112.51, 1);
    expect(result.averageMax).toBeCloseTo(114.59, 1);
  });

  it('returns raw weight if reps is 1', () => {
    const result = calculateOneRepMax({ weight: 100, reps: 1 });
    expect(result.averageMax).toBe(100);
    expect(result.epleyMax).toBe(100);
    expect(result.brzyckiMax).toBe(100);
  });

  it('handles negative or zero values gracefully', () => {
    const result = calculateOneRepMax({ weight: 0, reps: 5 });
    expect(result.averageMax).toBe(0);
    expect(result.epleyMax).toBe(0);
    expect(result.brzyckiMax).toBe(0);
  });
});

describe('generateLoadTable', () => {
  it('generates load percentages and weights correctly', () => {
    const table = generateLoadTable(100); // 1RM = 100
    // expect 10 entries (50% to 95% at 5% step)
    expect(table.length).toBe(10);
    
    // Check 85% entry
    const entry85 = table.find(e => e.percentage === 85);
    expect(entry85).toBeDefined();
    expect(entry85!.weight).toBeCloseTo(85, 2);
    expect(entry85!.recommendedReps).toBe(6); // 85% is typically 6 reps
  });
});
