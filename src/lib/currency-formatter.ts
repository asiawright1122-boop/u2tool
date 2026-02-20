/**
 * Currency Formatting Utilities
 * 
 * Functions for formatting currency values according to country-specific rules
 */

import type { TaxRegime } from './data/tax-regimes';

/**
 * Get the locale string for a country code
 */
export function getLocaleForCountry(countryCode: string): string {
  const countryToLocale: Record<string, string> = {
    US: 'en-US',
    CN: 'zh-CN',
    JP: 'ja-JP',
    KR: 'ko-KR',
    ES: 'es-ES',
    BR: 'pt-BR',
    FR: 'fr-FR',
    DE: 'de-DE',
    RU: 'ru-RU',
    SA: 'ar-SA',
  };
  return countryToLocale[countryCode] || 'en-US';
}

/**
 * Format a number as currency according to the tax regime's currency settings
 */
export function formatCurrency(value: number, regime: TaxRegime): string {
  const locale = getLocaleForCountry(regime.countryCode);
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: regime.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
