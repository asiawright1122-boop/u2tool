import { describe, expect, it } from 'vitest';
import { matchTools } from './matcher';
import { normalizeQuery, tokenizeQuery } from './normalize';
import type { DiscoveryCandidate, IntentDictionary } from './types';

const CANDIDATES: DiscoveryCandidate[] = [
  {
    slug: 'json-to-csv',
    name: 'JSON to CSV Converter',
    description: 'Convert JSON data to CSV format',
    category: 'converters',
    categoryName: 'Converters',
    aliases: ['json csv'],
  },
  {
    slug: 'cron-generator',
    name: 'Cron Generator',
    description: 'Build cron expressions easily',
    category: 'generators',
    categoryName: 'Generators',
    aliases: ['crontab'],
  },
  {
    slug: 'docker-compose-generator',
    name: 'Docker Compose Generator',
    description: 'Generate docker compose yaml',
    category: 'development',
    categoryName: 'Development',
    aliases: ['compose yaml'],
  },
  {
    slug: 'alpha-tool',
    name: 'Sample Tool',
    description: 'Sample description',
    category: 'text',
    categoryName: 'Text Tools',
  },
  {
    slug: 'beta-tool',
    name: 'Sample Tool',
    description: 'Sample description',
    category: 'text',
    categoryName: 'Text Tools',
  },
  {
    slug: 'sitemap-generator',
    name: '网站地图生成器',
    description: '生成 XML 网站地图，帮助搜索引擎抓取与索引。',
    category: 'generators',
    categoryName: '生成器',
    aliases: ['xml 网站地图'],
  },
];

const INTENTS: IntentDictionary = {
  keywordsBySlug: {
    'cron-generator': ['cron expression', 'crontab'],
    'docker-compose-generator': ['docker compose', 'compose file'],
  },
  keywordsByCategory: {
    generators: ['generate', 'builder', 'make'],
    converters: ['convert', 'transform'],
  },
};

describe('normalizeQuery', () => {
  it('normalizes whitespace and punctuation', () => {
    expect(normalizeQuery('  JSON, to  CSV!! ')).toBe('json to csv');
  });

  it('keeps non-latin characters while lowercasing latin text', () => {
    expect(normalizeQuery('JSON 转 CSV')).toBe('json 转 csv');
  });
});

describe('tokenizeQuery', () => {
  it('splits normalized query into tokens', () => {
    expect(tokenizeQuery('  make   cron expression! ')).toEqual(['make', 'cron', 'expression']);
  });

  it('builds CJK n-grams for queries without spaces', () => {
    expect(tokenizeQuery('网站地图')).toEqual(expect.arrayContaining(['网站地图', '网站', '地图', '网站地']));
  });
});

describe('matchTools', () => {
  it('boosts exact name matches to top results', () => {
    const results = matchTools('JSON to CSV Converter', CANDIDATES, INTENTS);
    expect(results[0]?.slug).toBe('json-to-csv');
  });

  it('boosts keyword/category intent matches', () => {
    const results = matchTools('make cron expression', CANDIDATES, INTENTS);
    expect(results[0]?.slug).toBe('cron-generator');
  });

  it('sorts deterministically by score then slug', () => {
    const results = matchTools('sample tool', CANDIDATES, INTENTS);
    expect(results[0]?.slug).toBe('alpha-tool');
    expect(results[1]?.slug).toBe('beta-tool');
  });

  it('matches CJK queries without spaces through n-gram tokens', () => {
    const results = matchTools('网站地图', CANDIDATES, INTENTS);
    expect(results[0]?.slug).toBe('sitemap-generator');
    expect(results[0]?.score).toBeGreaterThan(0);
  });
});
