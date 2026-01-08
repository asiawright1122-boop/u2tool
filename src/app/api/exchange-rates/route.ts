import { NextRequest, NextResponse } from 'next/server';
import { rateCache } from '@/lib/rate-cache';
import { currencyService } from '@/lib/currency-service';

export interface ExchangeRatesResponse {
  rates: Record<string, number>;
  base: string;
  timestamp: string;
  source: 'api' | 'cache' | 'fallback';
}

interface FrankfurterResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

const FRANKFURTER_API = 'https://api.frankfurter.dev/v1/latest';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const base = searchParams.get('base') || 'USD';

    // Validate base currency code
    if (!/^[A-Z]{3}$/.test(base)) {
      return NextResponse.json(
        { error: 'Invalid base currency code' },
        { status: 400 }
      );
    }

    // Check cache first
    const cached = rateCache.get(base);
    if (cached && rateCache.isValid(cached)) {
      return NextResponse.json({
        rates: cached.rates,
        base: cached.base,
        timestamp: cached.timestamp.toISOString(),
        source: 'cache',
      } as ExchangeRatesResponse);
    }

    // Fetch from Frankfurter API
    try {
      const response = await fetch(`${FRANKFURTER_API}?base=${base}`, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
        throw new Error(`Frankfurter API returned ${response.status}`);
      }

      const data: FrankfurterResponse = await response.json();

      // Validate the response data
      const validation = currencyService.validateRates(data.rates);
      if (!validation.valid) {
        console.error('Rate validation failed:', validation.errors);
        // Log but don't fail - use the data anyway if it has positive numbers
        const hasOnlyPositive = Object.values(data.rates).every(
          (r) => typeof r === 'number' && r > 0 && !isNaN(r)
        );
        if (!hasOnlyPositive) {
          throw new Error('Invalid rate data from API');
        }
      }

      // Check if we have enough currencies
      if (!currencyService.hasRequiredCurrencies(data.rates)) {
        console.warn('API response missing many required currencies');
      }

      // Cache the rates
      rateCache.set(base, data.rates);

      return NextResponse.json({
        rates: data.rates,
        base: data.base,
        timestamp: new Date().toISOString(),
        source: 'api',
      } as ExchangeRatesResponse);
    } catch (apiError) {
      // API failed, use fallback rates
      console.error('Failed to fetch from Frankfurter API:', apiError);

      const fallbackRates = currencyService.getFallbackRates(base);

      return NextResponse.json({
        rates: fallbackRates,
        base,
        timestamp: new Date().toISOString(),
        source: 'fallback',
      } as ExchangeRatesResponse);
    }
  } catch (error) {
    console.error('Exchange rates API error:', error);

    // Return fallback rates as last resort
    const fallbackRates = currencyService.getFallbackRates('USD');

    return NextResponse.json({
      rates: fallbackRates,
      base: 'USD',
      timestamp: new Date().toISOString(),
      source: 'fallback',
    } as ExchangeRatesResponse);
  }
}
