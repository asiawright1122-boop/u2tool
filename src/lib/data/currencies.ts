// Currency data for currency converter tool
// Exchange rates are relative to USD (base currency)
// 
// IMPORTANT: These are FALLBACK rates used when the live API is unavailable
// Last updated: 2025-01-08
// Source: Static snapshot for fallback purposes
// 
// For live rates, the system fetches from Frankfurter API (https://frankfurter.dev)
// These fallback rates are updated periodically but may not reflect current market rates

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate relative to USD
}

export const currencies: Currency[] = [
  // Major currencies
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.50 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.88 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.36 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.53 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', rate: 1.67 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', rate: 7.82 },
  
  // Asian currencies
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', rate: 1320 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.34 },
  { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$', rate: 31.50 },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', rate: 35.20 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', rate: 4.72 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', rate: 15800 },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', rate: 56.50 },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', rate: 24500 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.20 },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', rate: 278 },
  
  // European currencies
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', rate: 10.45 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', rate: 10.85 },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', rate: 6.88 },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', rate: 4.02 },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', rate: 23.20 },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', rate: 358 },
  { code: 'RON', name: 'Romanian Leu', symbol: 'lei', rate: 4.58 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', rate: 32.50 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', rate: 92.50 },
  { code: 'UAH', name: 'Ukrainian Hryvnia', symbol: '₴', rate: 41.20 },
  
  // Americas
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', rate: 17.15 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 4.97 },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', rate: 875 },
  { code: 'CLP', name: 'Chilean Peso', symbol: '$', rate: 925 },
  { code: 'COP', name: 'Colombian Peso', symbol: '$', rate: 3950 },
  { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', rate: 3.72 },
  
  // Middle East & Africa
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 3.67 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', rate: 3.75 },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', rate: 3.68 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', rate: 30.90 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', rate: 18.75 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rate: 1550 },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', rate: 153 },
  
  // Cryptocurrencies (approximate USD values)
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', rate: 0.000024 },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', rate: 0.00042 },
];

// Get currency by code
export function getCurrency(code: string): Currency | undefined {
  return currencies.find(c => c.code === code);
}

// Convert amount from one currency to another
export function convertCurrency(
  amount: number,
  fromCode: string,
  toCode: string
): number {
  const fromCurrency = getCurrency(fromCode);
  const toCurrency = getCurrency(toCode);
  
  if (!fromCurrency || !toCurrency) {
    throw new Error('Invalid currency code');
  }
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / fromCurrency.rate;
  return usdAmount * toCurrency.rate;
}

// Get all currency codes
export function getCurrencyCodes(): string[] {
  return currencies.map(c => c.code);
}

// Format currency amount
export function formatCurrency(
  amount: number,
  currencyCode: string,
  locale: string = 'en-US'
): string {
  const currency = getCurrency(currencyCode);
  if (!currency) return amount.toString();
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: currencyCode === 'BTC' ? 8 : 2,
    }).format(amount);
  } catch {
    return `${currency.symbol}${amount.toFixed(2)}`;
  }
}
