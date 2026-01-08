import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCurrencyRates } from './useCurrencyRates';

global.fetch = vi.fn();

describe('useCurrencyRates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch rates on mount', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        rates: { EUR: 0.92, GBP: 0.79 },
        base: 'USD',
        timestamp: new Date().toISOString(),
        source: 'api',
      }),
    });

    const { result } = renderHook(() => useCurrencyRates('USD'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.rates).toEqual({ EUR: 0.92, GBP: 0.79 });
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch errors', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useCurrencyRates('USD'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.rates).toBeNull();
  });

  it('should refetch rates when refetch is called', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        rates: { EUR: 0.92 },
        base: 'USD',
        timestamp: new Date().toISOString(),
        source: 'api',
      }),
    });

    const { result } = renderHook(() => useCurrencyRates('USD'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.refetch();

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
