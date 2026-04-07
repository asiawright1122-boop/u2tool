import { tools } from '@/config/tools';
import { defaultLocale, isValidLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { loadBaseMessages } from '@/lib/translations';
import { buildDiscoveryIndex } from './index-builder';
import { matchTools } from './matcher';
import { normalizeQuery } from './normalize';
import type {
  DiscoveryCandidate,
  DiscoveryDecision,
  DiscoveryMatch,
  IntentDictionary,
} from './types';

export interface DiscoverySearchResponse {
  query: string;
  normalizedQuery: string;
  matches: DiscoveryMatch[];
  action: DiscoveryDecision;
  confidence: number;
  error: 'EMPTY_QUERY' | null;
}

interface DiscoverySearchDependencies {
  buildIndex?: (locale: Locale) => Promise<DiscoveryCandidate[]>;
  intentDictionary?: IntentDictionary;
}

export interface DiscoverySearchInput {
  locale: string;
  query: string;
  maxResults?: number;
  assetBaseUrl?: string | URL;
  dependencies?: DiscoverySearchDependencies;
}

const DEFAULT_INTENT_DICTIONARY: IntentDictionary = {
  keywordsBySlug: {
    'json-to-csv': ['json to csv', 'convert json'],
    'cron-generator': ['cron expression', 'crontab'],
    'docker-compose-generator': ['docker compose', 'compose file'],
    'meta-tag-generator': ['meta tags', 'seo title'],
    'gitignore-generator': ['gitignore', '.gitignore'],
  },
  keywordsByCategory: {
    converters: ['convert', 'transform'],
    generators: ['generate', 'builder', 'make'],
    development: ['code', 'developer', 'dev'],
    security: ['hash', 'password', 'encrypt'],
    image: ['image', 'photo', 'png', 'jpg'],
  },
};

function computeDecision(score: number): DiscoveryDecision {
  if (score >= 180) {
    return 'direct';
  }
  if (score >= 80) {
    return 'suggest';
  }
  return 'fallback';
}

function computeConfidence(score: number): number {
  return Math.max(0, Math.min(1, score / 250));
}

async function defaultBuildIndex(
  locale: Locale,
  assetBaseUrl?: string | URL
): Promise<DiscoveryCandidate[]> {
  const baseMessages = await loadBaseMessages(locale, assetBaseUrl);
  const toolsObj = (baseMessages.tools as Record<string, unknown>) ?? {};
  const categoryMessages = (baseMessages.categories as Record<string, string>) ?? {};
  return buildDiscoveryIndex(tools, toolsObj, categoryMessages);
}

export async function runDiscoverySearch(input: DiscoverySearchInput): Promise<DiscoverySearchResponse> {
  const normalizedQuery = normalizeQuery(input.query);

  if (!normalizedQuery) {
    return {
      query: input.query,
      normalizedQuery: '',
      matches: [],
      action: 'fallback',
      confidence: 0,
      error: 'EMPTY_QUERY',
    };
  }

  const locale = isValidLocale(input.locale) ? input.locale : defaultLocale;
  const buildIndex =
    input.dependencies?.buildIndex ??
    ((locale: Locale) => defaultBuildIndex(locale, input.assetBaseUrl));
  const intentDictionary = input.dependencies?.intentDictionary ?? DEFAULT_INTENT_DICTIONARY;

  const candidates = await buildIndex(locale);
  const matches = matchTools(normalizedQuery, candidates, intentDictionary, input.maxResults);
  const topScore = matches[0]?.score ?? 0;

  return {
    query: input.query,
    normalizedQuery,
    matches,
    action: computeDecision(topScore),
    confidence: computeConfidence(topScore),
    error: null,
  };
}
