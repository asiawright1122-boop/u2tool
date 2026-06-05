export type MarketCapCategory = 'mega' | 'large' | 'mid' | 'small' | 'micro';

export interface MarketCapInput {
  sharePrice: number;
  outstandingShares: number;
  peRatio?: number;
}

export interface MarketCapResult {
  marketCap: number;
  category: MarketCapCategory;
  netIncome?: number;
}

export function classifyMarketCap(marketCap: number): MarketCapCategory {
  // Thresholds in USD:
  // Mega: >= $200B (200,000,000,000)
  // Large: >= $10B (10,000,000,000)
  // Mid: >= $2B (2,000,000,000)
  // Small: >= $250M (250,000,000)
  // Micro: < $250M
  if (marketCap >= 200000000000) return 'mega';
  if (marketCap >= 10000000000) return 'large';
  if (marketCap >= 2000000000) return 'mid';
  if (marketCap >= 250000000) return 'small';
  return 'micro';
}

export function calculateMarketCap(input: MarketCapInput): MarketCapResult {
  const { sharePrice, outstandingShares, peRatio } = input;

  if (sharePrice <= 0 || outstandingShares <= 0) {
    return {
      marketCap: 0,
      category: 'micro',
    };
  }

  const marketCap = sharePrice * outstandingShares;
  const category = classifyMarketCap(marketCap);

  const result: MarketCapResult = {
    marketCap,
    category,
  };

  if (peRatio !== undefined && peRatio > 0) {
    result.netIncome = marketCap / peRatio;
  }

  return result;
}

export function calculateSharePriceFromMarketCap(input: { marketCap: number; outstandingShares: number }): number {
  if (input.outstandingShares <= 0 || input.marketCap < 0) return 0;
  return input.marketCap / input.outstandingShares;
}

export function calculateSharesFromMarketCap(input: { marketCap: number; sharePrice: number }): number {
  if (input.sharePrice <= 0 || input.marketCap < 0) return 0;
  return input.marketCap / input.sharePrice;
}
