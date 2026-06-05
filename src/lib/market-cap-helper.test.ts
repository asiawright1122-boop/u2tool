import { describe, it, expect } from 'vitest';
import {
  calculateMarketCap,
  classifyMarketCap,
  calculateSharePriceFromMarketCap,
  calculateSharesFromMarketCap,
} from './market-cap-helper';

describe('calculateMarketCap', () => {
  it('calculates market cap from share price and outstanding shares', () => {
    const result = calculateMarketCap({ sharePrice: 150, outstandingShares: 1000000 });
    expect(result.marketCap).toBe(150000000);
  });

  it('handles zero or negative share price', () => {
    const result = calculateMarketCap({ sharePrice: 0, outstandingShares: 1000000 });
    expect(result.marketCap).toBe(0);
  });

  it('calculates net income when peRatio is provided', () => {
    const result = calculateMarketCap({
      sharePrice: 50,
      outstandingShares: 10000000, // $500M market cap
      peRatio: 25,
    });
    expect(result.netIncome).toBeCloseTo(20000000, 4); // 500M / 25 = 20M
  });

  it('does not calculate net income if peRatio is zero or negative', () => {
    const result = calculateMarketCap({
      sharePrice: 50,
      outstandingShares: 10000000,
      peRatio: 0,
    });
    expect(result.netIncome).toBeUndefined();
  });
});

describe('classifyMarketCap', () => {
  it('classifies mega cap', () => {
    expect(classifyMarketCap(250000000000)).toBe('mega'); // $250B
  });

  it('classifies large cap', () => {
    expect(classifyMarketCap(50000000000)).toBe('large'); // $50B
  });

  it('classifies mid cap', () => {
    expect(classifyMarketCap(5000000000)).toBe('mid'); // $5B
  });

  it('classifies small cap', () => {
    expect(classifyMarketCap(500000000)).toBe('small'); // $500M
  });

  it('classifies micro cap', () => {
    expect(classifyMarketCap(50000000)).toBe('micro'); // $50M
  });
});

describe('calculateSharePriceFromMarketCap', () => {
  it('back-calculates share price correctly', () => {
    expect(calculateSharePriceFromMarketCap({ marketCap: 100000000, outstandingShares: 2000000 })).toBeCloseTo(50, 4);
  });

  it('returns 0 when outstanding shares is zero or negative', () => {
    expect(calculateSharePriceFromMarketCap({ marketCap: 100000000, outstandingShares: 0 })).toBe(0);
  });
});

describe('calculateSharesFromMarketCap', () => {
  it('back-calculates outstanding shares correctly', () => {
    expect(calculateSharesFromMarketCap({ marketCap: 100000000, sharePrice: 20 })).toBeCloseTo(5000000, 4);
  });

  it('returns 0 when share price is zero or negative', () => {
    expect(calculateSharesFromMarketCap({ marketCap: 100000000, sharePrice: 0 })).toBe(0);
  });
});
