import { describe, expect, it } from 'vitest';
import { runDiscoverySearch } from './search-service';
import type { DiscoveryCandidate } from './types';

const CANDIDATES: DiscoveryCandidate[] = [
  {
    slug: 'json-to-csv',
    name: 'JSON to CSV Converter',
    description: 'Convert json to csv quickly',
    seoTitle: 'Free Online JSON to CSV Converter',
    seoDescription: 'Convert JSON data to CSV format in your browser',
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
  {
    slug: 'choose-text-tool',
    href: '/en/compare/choose-text-tool',
    kind: 'comparison',
    name: 'Choose the right text tool',
    description: 'Compare word counters, text cleaners, diff tools, and publishing-prep text workflows.',
    seoTitle: 'Choose the right text tool',
    seoDescription: 'Decide when to use a word counter, text cleaner, diff checker, markdown preview, or slug tool.',
    category: 'comparison',
    categoryName: 'Comparison guide',
    aliases: ['choose text tool', 'word counter vs text cleaner'],
  },
  {
    slug: 'choose-jwt-tool',
    href: '/en/compare/choose-jwt-tool',
    kind: 'comparison',
    name: 'Choose the right JWT tool',
    description: 'Compare JWT decoders, payload inspection, debugging, and related token utilities.',
    seoTitle: 'Choose the right JWT tool',
    seoDescription: 'Decide when to use a JWT decoder, payload decoder, debugger, or generator.',
    category: 'comparison',
    categoryName: 'Comparison guide',
    aliases: ['jwt decoder vs debugger', 'choose jwt tool'],
  },
  {
    slug: 'choose-chart-type',
    href: '/en/compare/choose-chart-type',
    kind: 'comparison',
    name: 'Choose the right chart type',
    description: 'Route trend, comparison, distribution, and flow questions to the right chart family.',
    seoTitle: 'Choose the right chart type',
    seoDescription: 'Compare bar, line, pie, scatter, and hierarchy charts for different data questions.',
    category: 'comparison',
    categoryName: 'Comparison guide',
    aliases: ['bar vs line chart', 'choose chart type'],
  },
  {
    slug: 'meta-tags-vs-open-graph-vs-twitter-cards',
    href: '/en/compare/meta-tags-vs-open-graph-vs-twitter-cards',
    kind: 'comparison',
    name: 'Meta Tags vs Open Graph vs Twitter Cards',
    description: 'Choose between search metadata, social sharing tags, preview tools, and discovery files.',
    seoTitle: 'Meta Tags vs Open Graph vs Twitter Cards',
    seoDescription: 'Understand when to use Open Graph, Twitter cards, and core SEO meta tags.',
    category: 'comparison',
    categoryName: 'Comparison guide',
    aliases: ['open graph vs twitter cards', 'meta tags vs twitter cards'],
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

  it('uses SEO metadata when discovery copy is more precise than the visible card text', async () => {
    const result = await runDiscoverySearch({
      locale: 'en',
      query: 'json data to csv',
      dependencies: {
        buildIndex: async () => [
          {
            slug: 'json-to-csv',
            name: 'Data Export Tool',
            description: 'Export data for spreadsheets',
            seoTitle: 'JSON to CSV Converter',
            seoDescription: 'Convert JSON data to CSV online',
            category: 'converters',
            categoryName: 'Converters',
            aliases: [],
          },
        ],
      },
    });

    expect(result.matches[0]?.slug).toBe('json-to-csv');
    expect(result.action).not.toBe('fallback');
  });

  it('can route explicit comparison intent to a comparison guide', async () => {
    const result = await runDiscoverySearch({
      locale: 'en',
      query: 'open graph vs twitter cards',
      dependencies: {
        buildIndex: async () => CANDIDATES,
      },
    });

    expect(result.matches[0]?.slug).toBe('meta-tags-vs-open-graph-vs-twitter-cards');
    expect(result.matches[0]?.href).toBe('/en/compare/meta-tags-vs-open-graph-vs-twitter-cards');
    expect(result.action).toBe('direct');
  });

  it('boosts JWT-selection intent toward the promoted comparison guide', async () => {
    const result = await runDiscoverySearch({
      locale: 'en',
      query: 'jwt decoder vs debugger',
      dependencies: {
        buildIndex: async () => CANDIDATES,
      },
    });

    expect(result.matches[0]?.slug).toBe('choose-jwt-tool');
    expect(result.matches[0]?.href).toBe('/en/compare/choose-jwt-tool');
    expect(result.action).toBe('direct');
  });

  it('boosts text-selection intent toward the promoted comparison guide', async () => {
    const result = await runDiscoverySearch({
      locale: 'en',
      query: 'word counter vs text cleaner',
      dependencies: {
        buildIndex: async () => CANDIDATES,
      },
    });

    expect(result.matches[0]?.slug).toBe('choose-text-tool');
    expect(result.matches[0]?.href).toBe('/en/compare/choose-text-tool');
    expect(result.action).toBe('direct');
  });

  it('boosts chart-selection intent toward the promoted comparison guide', async () => {
    const result = await runDiscoverySearch({
      locale: 'en',
      query: 'bar vs line chart',
      dependencies: {
        buildIndex: async () => CANDIDATES,
      },
    });

    expect(result.matches[0]?.slug).toBe('choose-chart-type');
    expect(result.matches[0]?.href).toBe('/en/compare/choose-chart-type');
    expect(result.action).toBe('direct');
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
