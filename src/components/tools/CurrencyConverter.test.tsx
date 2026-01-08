import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import CurrencyConverter from './CurrencyConverter';
import { NextIntlClientProvider } from 'next-intl';

// Mock the hook
vi.mock('@/hooks/useCurrencyRates', () => ({
  useCurrencyRates: () => ({
    rates: { EUR: 0.92, GBP: 0.79 },
    loading: false,
    error: null,
    timestamp: new Date('2024-01-01'),
    source: 'api',
    refetch: vi.fn(),
  }),
}));

const messages = {
  'tools': {
    'currency-converter': {
      amount: 'Amount',
      from: 'From',
      to: 'To',
      swap: 'Swap',
      exchangeRate: 'Exchange Rate',
      inverseRate: 'Inverse Rate',
      quickConversions: 'Quick Conversions',
      disclaimer: 'Rates are for reference only',
      lastUpdated: 'Last Updated',
      refresh: 'Refresh',
      updating: 'Updating rates...',
      updateFailed: 'Failed to update rates',
      usingStaticRates: 'Using static rates',
      majorCurrencies: 'Major Currencies',
      asianCurrencies: 'Asian Currencies',
      europeanCurrencies: 'European Currencies',
      americasCurrencies: 'Americas Currencies',
      middleEastCurrencies: 'Middle East & Africa',
      crypto: 'Cryptocurrencies',
    },
  },
};

describe('CurrencyConverter', () => {
  it('should render without crashing', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CurrencyConverter />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Amount')).toBeInTheDocument();
  });

  it('should display rate update timestamp', async () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CurrencyConverter />
      </NextIntlClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Last Updated/)).toBeInTheDocument();
    });
  });
});
