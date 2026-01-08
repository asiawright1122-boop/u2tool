// Currency service for rate validation, conversion, and data management

import { Currency, currencies as fallbackCurrencies } from './data/currencies';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class CurrencyService {
  private fallbackRates: Map<string, number>;

  constructor() {
    // Build fallback rates map for quick lookup
    this.fallbackRates = new Map();
    fallbackCurrencies.forEach((currency) => {
      this.fallbackRates.set(currency.code, currency.rate);
    });
  }

  /**
   * Validate exchange rates
   * - All rates must be positive numbers
   * - Rates should not differ by more than 50% from fallback rates
   */
  validateRates(rates: Record<string, number>): ValidationResult {
    const errors: string[] = [];

    // Check if rates object is empty
    if (Object.keys(rates).length === 0) {
      errors.push('Rates object is empty');
      return { valid: false, errors };
    }

    // Validate each rate
    for (const [code, rate] of Object.entries(rates)) {
      // Check if rate is a positive number
      if (typeof rate !== 'number' || isNaN(rate) || rate <= 0) {
        errors.push(`Invalid rate for ${code}: ${rate}`);
        continue;
      }

      // Check if rate is within reasonable range of fallback
      const fallbackRate = this.fallbackRates.get(code);
      if (fallbackRate) {
        const difference = Math.abs(rate - fallbackRate) / fallbackRate;
        if (difference > 0.5) {
          // More than 50% difference
          errors.push(
            `Rate for ${code} differs by ${(difference * 100).toFixed(1)}% from fallback (${rate} vs ${fallbackRate})`
          );
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Convert amount from one currency to another
   */
  convert(
    amount: number,
    fromCode: string,
    toCode: string,
    rates: Record<string, number>,
    baseCode: string = 'USD'
  ): number {
    // If same currency, return amount
    if (fromCode === toCode) {
      return amount;
    }

    // Get rates for both currencies
    const fromRate = fromCode === baseCode ? 1 : rates[fromCode];
    const toRate = toCode === baseCode ? 1 : rates[toCode];

    if (!fromRate || !toRate) {
      throw new Error(`Missing rate for ${!fromRate ? fromCode : toCode}`);
    }

    // Convert to base currency first, then to target currency
    const baseAmount = amount / fromRate;
    return baseAmount * toRate;
  }

  /**
   * Merge API rates with static currency data
   * Returns full Currency objects with updated rates
   */
  mergeRates(
    apiRates: Record<string, number>,
    baseCode: string = 'USD'
  ): Currency[] {
    const merged: Currency[] = [];

    fallbackCurrencies.forEach((currency) => {
      // Use API rate if available, otherwise use fallback
      let rate = currency.rate;

      if (currency.code === baseCode) {
        rate = 1; // Base currency always has rate 1
      } else if (apiRates[currency.code]) {
        rate = apiRates[currency.code];
      }

      merged.push({
        ...currency,
        rate,
      });
    });

    return merged;
  }

  /**
   * Get fallback rates as a Record
   */
  getFallbackRates(baseCode: string = 'USD'): Record<string, number> {
    const rates: Record<string, number> = {};

    fallbackCurrencies.forEach((currency) => {
      if (currency.code === baseCode) {
        rates[currency.code] = 1;
      } else if (baseCode === 'USD') {
        rates[currency.code] = currency.rate;
      } else {
        // Convert from USD-based rate to new base
        const baseRate = this.fallbackRates.get(baseCode) || 1;
        rates[currency.code] = currency.rate / baseRate;
      }
    });

    return rates;
  }

  /**
   * Check if all required currency codes are present
   */
  hasRequiredCurrencies(rates: Record<string, number>): boolean {
    const requiredCodes = fallbackCurrencies.map((c) => c.code);
    const providedCodes = Object.keys(rates);

    // Check if at least 80% of required currencies are present
    const matchCount = requiredCodes.filter((code) =>
      providedCodes.includes(code)
    ).length;

    return matchCount >= requiredCodes.length * 0.8;
  }
}

// Global service instance
export const currencyService = new CurrencyService();
