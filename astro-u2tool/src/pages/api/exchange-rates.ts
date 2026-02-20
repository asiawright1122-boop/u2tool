/**
 * Exchange Rates API Endpoint
 *
 * Returns exchange rate data with caching support.
 * Accepts query param: base (3-letter currency code, default: USD)
 *
 * For now, returns mock/cached fallback data.
 * Actual Frankfurter API integration can be added later.
 *
 * Requirements: 7.3
 */

import type { APIRoute } from 'astro';

// Server-side only - do not prerender
export const prerender = false;

// Cache for 1 hour
const CACHE_MAX_AGE = 60 * 60;
const STALE_WHILE_REVALIDATE = 60 * 60 * 24; // 24 hours

export interface ExchangeRatesResponse {
  rates: Record<string, number>;
  base: string;
  timestamp: string;
  source: 'api' | 'cache' | 'fallback';
}

// In-memory cache
const rateCache = new Map<string, { rates: Record<string, number>; timestamp: Date }>();

const FRANKFURTER_API = 'https://api.frankfurter.dev/v1/latest';

/**
 * Fallback exchange rates (USD-based, approximate values)
 * Used when the external API is unavailable
 */
const FALLBACK_RATES_USD: Record<string, number> = {
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CNY: 7.24,
  KRW: 1320.00,
  CAD: 1.36,
  AUD: 1.53,
  CHF: 0.88,
  HKD: 7.82,
  SGD: 1.34,
  SEK: 10.45,
  NOK: 10.65,
  DKK: 6.87,
  NZD: 1.67,
  MXN: 17.15,
  BRL: 4.97,
  INR: 83.12,
  RUB: 91.50,
  ZAR: 18.65,
  TRY: 30.25,
  THB: 35.20,
  TWD: 31.50,
  PLN: 4.02,
  CZK: 22.85,
  HUF: 355.00,
  ILS: 3.72,
  PHP: 55.80,
  MYR: 4.65,
  IDR: 15550.00,
  AED: 3.67,
  SAR: 3.75,
};

/**
 * Get fallback rates for a given base currency
 */
function getFallbackRates(base: string): Record<string, number> {
  if (base === 'USD') {
    return { ...FALLBACK_RATES_USD };
  }

  // Convert from USD-based rates to the requested base
  const baseToUsd = FALLBACK_RATES_USD[base];
  if (!baseToUsd) {
    // Unknown base currency, return USD rates
    return { ...FALLBACK_RATES_USD };
  }

  const rates: Record<string, number> = { USD: 1 / baseToUsd };
  for (const [currency, usdRate] of Object.entries(FALLBACK_RATES_USD)) {
    if (currency !== base) {
      rates[currency] = usdRate / baseToUsd;
    }
  }

  return rates;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const base = url.searchParams.get('base') || 'USD';

    // Validate base currency code (must be 3 uppercase letters)
    if (!/^[A-Z]{3}$/.test(base)) {
      return new Response(
        JSON.stringify({ error: 'Invalid base currency code. Must be 3 uppercase letters (e.g., USD, EUR).' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Check in-memory cache first
    const cached = rateCache.get(base);
    if (cached) {
      const ageMs = Date.now() - cached.timestamp.getTime();
      if (ageMs < CACHE_MAX_AGE * 1000) {
        return new Response(
          JSON.stringify({
            rates: cached.rates,
            base,
            timestamp: cached.timestamp.toISOString(),
            source: 'cache',
          } satisfies ExchangeRatesResponse),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
            },
          }
        );
      }
    }

    // Try fetching from Frankfurter API
    try {
      const response = await fetch(`${FRANKFURTER_API}?base=${base}`, {
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (!response.ok) {
        throw new Error(`Frankfurter API returned ${response.status}`);
      }

      const data = await response.json() as { base: string; date: string; rates: Record<string, number> };

      // Basic validation: ensure rates are positive numbers
      const hasValidRates = Object.values(data.rates).every(
        (r) => typeof r === 'number' && r > 0 && !isNaN(r)
      );

      if (!hasValidRates) {
        throw new Error('Invalid rate data from API');
      }

      // Cache the rates
      rateCache.set(base, { rates: data.rates, timestamp: new Date() });

      return new Response(
        JSON.stringify({
          rates: data.rates,
          base: data.base,
          timestamp: new Date().toISOString(),
          source: 'api',
        } satisfies ExchangeRatesResponse),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
          },
        }
      );
    } catch (apiError) {
      // API failed, use fallback rates
      console.error('Failed to fetch from Frankfurter API:', apiError);

      const fallbackRates = getFallbackRates(base);

      return new Response(
        JSON.stringify({
          rates: fallbackRates,
          base,
          timestamp: new Date().toISOString(),
          source: 'fallback',
        } satisfies ExchangeRatesResponse),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
          },
        }
      );
    }
  } catch (error) {
    console.error('Exchange rates API error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
