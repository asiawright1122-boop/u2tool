import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { runDiscoverySearch } from './search-service';
import type { DiscoveryCandidate, DiscoveryDecision } from './types';

interface RegressionCase {
  id: string;
  locale?: string;
  query: string;
  expectedTopSlug?: string;
  expectedAction?: DiscoveryDecision;
  minConfidence?: number;
  maxConfidence?: number;
}

const CASES_PATH = path.join(process.cwd(), 'docs/ai-discovery-regression-cases.json');
const rawCases = fs.readFileSync(CASES_PATH, 'utf-8');
const REGRESSION_CASES = JSON.parse(rawCases) as RegressionCase[];

const REGRESSION_CANDIDATES: DiscoveryCandidate[] = [
  {
    slug: 'json-to-csv',
    name: 'JSON to CSV Converter',
    description: 'Convert JSON payloads to CSV files quickly.',
    category: 'converters',
    categoryName: 'Converters',
    aliases: ['json to csv', 'convert json to csv'],
  },
  {
    slug: 'cron-generator',
    name: 'Cron Generator',
    description: 'Build cron expressions for schedules.',
    category: 'generators',
    categoryName: 'Generators',
    aliases: ['cron expression', 'crontab'],
  },
  {
    slug: 'docker-compose-generator',
    name: 'Docker Compose Generator',
    description: 'Generate docker compose file templates.',
    category: 'development',
    categoryName: 'Development',
    aliases: ['docker compose', 'compose file'],
  },
  {
    slug: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    description: 'Generate SEO meta tags for web pages.',
    category: 'generators',
    categoryName: 'Generators',
    aliases: ['meta tags', 'seo title'],
  },
  {
    slug: 'gitignore-generator',
    name: 'Gitignore Generator',
    description: 'Create .gitignore files for common stacks.',
    category: 'development',
    categoryName: 'Development',
    aliases: ['gitignore', '.gitignore'],
  },
];

describe('ai discovery regression cases', () => {
  it('has at least one regression case', () => {
    expect(REGRESSION_CASES.length).toBeGreaterThan(0);
  });

  for (const regressionCase of REGRESSION_CASES) {
    it(`passes: ${regressionCase.id}`, async () => {
      const result = await runDiscoverySearch({
        locale: regressionCase.locale ?? 'en',
        query: regressionCase.query,
        dependencies: {
          buildIndex: async () => REGRESSION_CANDIDATES,
        },
      });

      if (regressionCase.expectedTopSlug) {
        expect(result.matches[0]?.slug).toBe(regressionCase.expectedTopSlug);
      }

      if (regressionCase.expectedAction) {
        expect(result.action).toBe(regressionCase.expectedAction);
      }

      if (typeof regressionCase.minConfidence === 'number') {
        expect(result.confidence).toBeGreaterThanOrEqual(regressionCase.minConfidence);
      }

      if (typeof regressionCase.maxConfidence === 'number') {
        expect(result.confidence).toBeLessThanOrEqual(regressionCase.maxConfidence);
      }
    });
  }
});
