import { describe, it, expect } from 'vitest';
import {
  calculatePositionSize,
  type PositionSizeInput,
} from './position-size-helper';

describe('calculatePositionSize', () => {
  it('calculates correct position size and cost', () => {
    const input: PositionSizeInput = {
      accountSize: 10000,
      riskPercent: 2, // 2% risk
      entryPrice: 50,
      stopLossPrice: 45,
    };
    const result = calculatePositionSize(input);
    expect(result.riskAmount).toBeCloseTo(200, 4); // 10000 * 0.02 = 200
    expect(result.riskPerShare).toBeCloseTo(5, 4); // 50 - 45 = 5
    expect(result.shares).toBe(40); // 200 / 5 = 40
    expect(result.totalCost).toBeCloseTo(2000, 4); // 40 * 50 = 2000
    expect(result.capitalPercent).toBeCloseTo(20, 4); // 2000 / 10000 * 100 = 20%
  });

  it('handles leverage properly', () => {
    const input: PositionSizeInput = {
      accountSize: 10000,
      riskPercent: 2,
      entryPrice: 50,
      stopLossPrice: 45,
      leverage: 5,
    };
    const result = calculatePositionSize(input);
    expect(result.shares).toBe(40);
    expect(result.totalCost).toBeCloseTo(2000, 4);
    expect(result.leverageCost).toBeCloseTo(400, 4); // 2000 / 5 = 400
  });

  it('calculates stop loss price from stopLossPercent if stopLossPrice is not provided', () => {
    const input: PositionSizeInput = {
      accountSize: 10000,
      riskPercent: 1, // 1% risk
      entryPrice: 100,
      stopLossPercent: 10, // 10% stop loss
    };
    const result = calculatePositionSize(input);
    expect(result.stopLossPrice).toBeCloseTo(90, 4); // 100 - 100 * 0.1 = 90
    expect(result.shares).toBe(10); // (10000 * 0.01) / 10 = 10
  });

  it('handles invalid inputs gracefully (e.g. stop loss above entry price for long)', () => {
    const input: PositionSizeInput = {
      accountSize: 10000,
      riskPercent: 2,
      entryPrice: 50,
      stopLossPrice: 55, // Stop loss higher than entry (invalid for long)
    };
    const result = calculatePositionSize(input);
    expect(result.shares).toBe(0);
    expect(result.totalCost).toBe(0);
    expect(result.riskPerShare).toBe(0);
  });

  it('handles zero or negative inputs', () => {
    const input: PositionSizeInput = {
      accountSize: 0,
      riskPercent: 2,
      entryPrice: 50,
      stopLossPrice: 45,
    };
    const result = calculatePositionSize(input);
    expect(result.shares).toBe(0);
    expect(result.riskAmount).toBe(0);
  });
});
