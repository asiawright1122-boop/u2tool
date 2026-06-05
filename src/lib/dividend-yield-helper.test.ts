import { describe, it, expect } from 'vitest';
import {
  calculateDividendYield,
  calculateAnnualDividend,
  calculateSharePrice,
  classifyYield,
  type DividendYieldResult,
} from './dividend-yield-helper';

describe('calculateDividendYield', () => {
  it('calculates yield from annual dividend and share price', () => {
    const result = calculateDividendYield({ annualDividend: 2, sharePrice: 50 });
    expect(result.yieldPercent).toBeCloseTo(4, 4);
    expect(result.annualIncome).toBeCloseTo(2, 4);
  });

  it('calculates yield from quarterly dividend', () => {
    const result = calculateDividendYield({ quarterlyDividend: 0.5, sharePrice: 40 });
    expect(result.yieldPercent).toBeCloseTo(5, 4);
    expect(result.annualDividend).toBeCloseTo(2, 4);
  });

  it('calculates yield from monthly dividend', () => {
    const result = calculateDividendYield({ monthlyDividend: 0.1, sharePrice: 24 });
    expect(result.yieldPercent).toBeCloseTo(5, 4);
    expect(result.annualDividend).toBeCloseTo(1.2, 4);
  });

  it('returns zero yield when share price is zero', () => {
    const result = calculateDividendYield({ annualDividend: 2, sharePrice: 0 });
    expect(result.yieldPercent).toBe(0);
  });

  it('calculates annual income for given shares held', () => {
    const result = calculateDividendYield({ annualDividend: 3, sharePrice: 60, sharesHeld: 100 });
    expect(result.annualIncome).toBeCloseTo(300, 4);
    expect(result.monthlyIncome).toBeCloseTo(25, 4);
  });

  it('calculates how many shares needed to reach income target', () => {
    const result = calculateDividendYield({ annualDividend: 2, sharePrice: 50, targetAnnualIncome: 1000 });
    expect(result.sharesNeeded).toBe(500);
    expect(result.capitalNeeded).toBe(25000);
  });
});

describe('calculateAnnualDividend', () => {
  it('converts quarterly to annual', () => {
    expect(calculateAnnualDividend({ quarterlyDividend: 0.25 })).toBeCloseTo(1, 4);
  });

  it('converts monthly to annual', () => {
    expect(calculateAnnualDividend({ monthlyDividend: 0.1 })).toBeCloseTo(1.2, 4);
  });

  it('returns annual dividend unchanged', () => {
    expect(calculateAnnualDividend({ annualDividend: 2.5 })).toBeCloseTo(2.5, 4);
  });
});

describe('calculateSharePrice', () => {
  it('back-calculates share price from yield and dividend', () => {
    // If yield = 5% and annual dividend = 2, price = 40
    const price = calculateSharePrice({ annualDividend: 2, yieldPercent: 5 });
    expect(price).toBeCloseTo(40, 4);
  });

  it('returns 0 when yield is 0', () => {
    expect(calculateSharePrice({ annualDividend: 2, yieldPercent: 0 })).toBe(0);
  });
});

describe('classifyYield', () => {
  it('classifies very low yield', () => {
    expect(classifyYield(0.5)).toBe('very-low');
  });

  it('classifies low yield', () => {
    expect(classifyYield(1.5)).toBe('low');
  });

  it('classifies moderate yield', () => {
    expect(classifyYield(3)).toBe('moderate');
  });

  it('classifies high yield', () => {
    expect(classifyYield(6)).toBe('high');
  });

  it('classifies very high / risky yield', () => {
    expect(classifyYield(12)).toBe('very-high');
  });
});
