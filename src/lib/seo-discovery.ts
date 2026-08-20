import { categories, getPopularTools, tools, type Tool } from '@/config/tools';
import { aiToolTopicSlugs, getAiToolTopicPath } from '@/lib/ai-tool-topics';
import { comparisonSurfaceSlugs } from '@/lib/comparison-surfaces';
import { isIndexSuppressed } from '@/lib/index-suppression';
import { locales, type Locale } from '@/lib/i18n';
import { getPublicSiteUrl } from '@/lib/public-env';
import { withPageUrlTrailingSlash } from '@/lib/seo';
import { organicRecoveryPrioritySlugs } from '@/lib/organic-search-portfolio';

const highValueToolBlocklistOverrides = new Set<string>([
  'json-formatter',
  'base64',
  'url-encoder',
  'jwt-decoder',
  'xml-formatter',
  'uuid-generator',
  'password-generator',
  'hash-generator',
  'qr-generator',
  'word-counter',
  'regex-tester',
  'sql-formatter',
  'json-to-typescript',
  'markdown-to-html',
  'image-compressor',
  'image-converter',
  'favicon-generator',
  'gitignore-generator',
  'meta-tag-generator',
  'robots-txt-generator',
  'sitemap-generator',
  'ssl-checker',
  'cidr-calculator',
  'timezone-converter',
  'ai-token-calculator',
  'ai-prompt-generator',
  'ai-prompt-optimizer',
  'ai-prompt-template-generator',
  'json-to-prompt',
  'rag-chunk-size-calculator',
  'ai-text-humanizer',
  'ai-robots-txt-generator',
  'llms-txt-generator',
  'llms-txt-validator',
  'midjourney-prompt-generator',
  'stable-diffusion-prompt-generator',
]);

const explicitPriorityToolSlugs = [
  ...organicRecoveryPrioritySlugs,
  'json-formatter',
  'base64',
  'url-encoder',
  'xml-formatter',
  'uuid-generator',
  'password-generator',
  'hash-generator',
  'qr-generator',
  'regex-tester',
  'sql-formatter',
  'json-to-typescript',
  'markdown-to-html',
  'image-compressor',
  'gitignore-generator',
  'meta-tag-generator',
  'robots-txt-generator',
  'sitemap-generator',
  'text-to-handwriting',
  'hex-editor',
  'ascii-table',
  'html-preview',
  'unicode-converter',
  'file-size-calculator',
  'ical-parser',
  'gantt-chart-generator',
  'timeline-chart-generator',
  'calendar-availability-finder',
  'database-connection-tester',
  'merge-conflict-resolver',
  'go-formatter',
  'tile-calculator',
  'gpa-calculator',
  'roman-numeral-converter',
  'typing-speed-test',
  'text-summarizer',
  'screen-recorder',
  'pixel-density-calculator',
  'image-resizer',
  'image-cropper',
  'gif-maker',
  'venn-diagram-generator',
  'random-color-generator',
  'dice-roller',
  'love-calculator',
  'world-clock',
  'bra-size-calculator',
  'calorie-calculator',
  'iban-validator',
  'compound-interest-calculator',
  'document-word-counter',
  'passport-photo-maker',
  'csv-to-vcard-converter',
  'vcard-to-csv-converter',
  'barcode-generator',
  'credit-card-validator',
  'morse-code-player',
  'ai-token-calculator',
  'ai-prompt-generator',
  'ai-prompt-optimizer',
  'ai-prompt-template-generator',
  'json-to-prompt',
  'rag-chunk-size-calculator',
  'ai-text-humanizer',
  'ai-robots-txt-generator',
  'llms-txt-generator',
  'llms-txt-validator',
  'midjourney-prompt-generator',
  'stable-diffusion-prompt-generator',
  'ssl-checker',
  'cidr-calculator',
];

export const maxIndexNowUrlsPerRun = 1000;

export function getPriorityTools(): Tool[] {
  const toolMap = new Map(tools.map((tool) => [tool.slug, tool]));
  const orderedSlugs = [
    ...explicitPriorityToolSlugs,
    ...highValueToolBlocklistOverrides,
    ...getPopularTools().map((tool) => tool.slug),
  ];
  const dedupedTools: Tool[] = [];
  const seen = new Set<string>();

  for (const slug of orderedSlugs) {
    if (seen.has(slug)) {
      continue;
    }

    const tool = toolMap.get(slug);
    if (!tool) {
      continue;
    }

    seen.add(slug);
    dedupedTools.push(tool);
  }

  return dedupedTools;
}

export function buildPriorityRoutePaths(locale: Locale): string[] {
  const paths = new Set<string>();

  paths.add(`/${locale}`);
  paths.add(`/${locale}/tools`);
  paths.add(`/${locale}/compare`);

  // /ai is a first-class content hub (always index,follow) so it stays in the
  // priority route set regardless of the runtime discovery feature flag.
  paths.add(`/${locale}/ai`);

  for (const topicSlug of aiToolTopicSlugs) {
    paths.add(`/${locale}${getAiToolTopicPath(topicSlug)}`);
  }

  for (const category of categories) {
    paths.add(`/${locale}/categories/${category.id}`);
  }

  for (const slug of comparisonSurfaceSlugs) {
    paths.add(`/${locale}/compare/${slug}`);
  }

  for (const tool of getPriorityTools()) {
    // A suppressed page renders robots=noindex. Submitting it to IndexNow asks
    // the engine to index a page that then refuses indexing, which wastes the
    // per-run quota. Priority status is a crawl-order hint, not an
    // indexability override.
    if (isIndexSuppressed(locale, tool.slug)) {
      continue;
    }
    paths.add(`/${locale}/tools/${tool.slug}`);
  }

  return Array.from(paths);
}

/**
 * Build IndexNow URLs in priority tiers so that when the per-run limit is hit,
 * the highest-priority paths (homepages, tool indexes) are preserved across
 * ALL locales instead of filling the quota with one locale's full set.
 *
 * Tier 1: locale homepages + tool/compare hubs + AI hub
 * Tier 2: AI topics + comparison slugs + category pages
 * Tier 3: priority tool pages (in priority order, across locales)
 */
export function buildPriorityIndexNowUrls(
  baseUrl = getPublicSiteUrl(),
  options: {
    limit?: number;
    selectedLocales?: readonly Locale[];
  } = {}
): string[] {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  const selectedLocales = options.selectedLocales ?? locales;
  const limit = options.limit ?? maxIndexNowUrlsPerRun;
  const seen = new Set<string>();
  const result: string[] = [];

  const add = (path: string): void => {
    const url = withPageUrlTrailingSlash(`${normalizedBaseUrl}${path}`);
    if (seen.has(url)) return;
    seen.add(url);
    if (result.length < limit) {
      result.push(url);
    }
  };

  // Tier 1: hub pages across all locales
  for (const locale of selectedLocales) {
    add(`/${locale}`);
    add(`/${locale}/tools`);
    add(`/${locale}/compare`);
    add(`/${locale}/ai`);
  }

  // Tier 2: topic/category/comparison pages across all locales
  for (const locale of selectedLocales) {
    for (const topicSlug of aiToolTopicSlugs) {
      add(`/${locale}${getAiToolTopicPath(topicSlug)}`);
    }
    for (const slug of comparisonSurfaceSlugs) {
      add(`/${locale}/compare/${slug}`);
    }
    for (const category of categories) {
      add(`/${locale}/categories/${category.id}`);
    }
  }

  // Tier 3: priority tool pages across all locales (interleaved)
  const priorityTools = getPriorityTools();
  for (const tool of priorityTools) {
    for (const locale of selectedLocales) {
      if (isIndexSuppressed(locale, tool.slug)) continue;
      add(`/${locale}/tools/${tool.slug}`);
    }
  }

  return result;
}

export const seoDiscoveryConfig = {
  highValueToolBlocklistOverrides,
  explicitPriorityToolSlugs,
};
