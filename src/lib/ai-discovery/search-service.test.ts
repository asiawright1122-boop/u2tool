import { describe, expect, it } from 'vitest';
import { runDiscoverySearch } from './search-service';
import type { DiscoveryCandidate } from './types';

const CANDIDATES: DiscoveryCandidate[] = [
  {
    slug: 'json-to-csv',
    name: 'JSON to CSV Converter',
    description: 'Convert json to csv quickly',
    category: 'converters',
    categoryName: 'Converters',
    aliases: ['convert json to csv'],
  },
  {
    slug: 'cron-generator',
    name: 'Cron Generator',
    description: 'Build cron expressions',
    category: 'generators',
    categoryName: 'Generators',
    aliases: ['cron expression', 'crontab'],
  },
];

describe('runDiscoverySearch', () => {
  it('returns direct action for high-confidence match', async () => {
    const result = await runDiscoverySearch({
      locale: 'en',
      query: 'JSON to CSV Converter',
      dependencies: {
        buildIndex: async () => CANDIDATES,
      },
    });

    expect(result.action).toBe('direct');
    expect(result.matches[0]?.slug).toBe('json-to-csv');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('returns validation error payload for empty query', async () => {
    const result = await runDiscoverySearch({
      locale: 'en',
      query: '   ',
      dependencies: {
        buildIndex: async () => CANDIDATES,
      },
    });

    expect(result.action).toBe('fallback');
    expect(result.error).toBe('EMPTY_QUERY');
    expect(result.matches).toEqual([]);
  });

  it('returns fallback for low-confidence query', async () => {
    const result = await runDiscoverySearch({
      locale: 'en',
      query: 'zzz',
      dependencies: {
        buildIndex: async () => CANDIDATES,
      },
    });

    expect(result.action).toBe('fallback');
    expect(result.confidence).toBeLessThan(0.4);
  });

  it('returns a stable response shape for clients', async () => {
    const result = await runDiscoverySearch({
      locale: 'en',
      query: 'cron',
      dependencies: {
        buildIndex: async () => CANDIDATES,
      },
    });

    expect(result).toEqual({
      query: expect.any(String),
      normalizedQuery: expect.any(String),
      matches: expect.any(Array),
      action: expect.stringMatching(/^(direct|suggest|fallback)$/),
      confidence: expect.any(Number),
      error: null,
    });
  });
});
