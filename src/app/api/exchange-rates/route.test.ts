import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { NextRequest } from 'next/server';
import { rateCache } from '@/lib/rate-cache';

// Mock fetch
global.fetch = vi.fn();

describe('Exchange Rates API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    rateCache.clear();
  });

  it('should return cached rates when available', async () => {
    const rates = { EUR: 0.92, GBP: 0.79 };
    rateCache.set('USD', rates);

    const request = new NextRequest('http://localhost:3000/api/exchange-rates?base=USD');
    const response = await GET(request);
    const data = await response.json();

    expect(data.source).toBe('cache');
    expect(data.rates).toEqual(rates);
  });

  it('should fetch from API when cache miss', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        base: 'USD',
        date: '2024-01-01',
        rates: { EUR: 0.92, GBP: 0.79 },
      }),
    });

    const request = new NextRequest('http://localhost:3000/api/exchange-rates?base=USD');
    const response = await GET(request);
    const data = await response.json();

    expect(data.source).toBe('api');
    expect(data.rates.EUR).toBe(0.92);
  });

  it('should return fallback on API failure', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const request = new NextRequest('http://localhost:3000/api/exchange-rates?base=USD');
    const response = await GET(request);
    const data = await response.json();

    expect(data.source).toBe('fallback');
    expect(data.rates).toBeDefined();
  });
});
