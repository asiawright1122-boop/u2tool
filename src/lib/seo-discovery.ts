import { categories, getPopularTools, tools, type Tool } from '@/config/tools';
import { comparisonSurfaceSlugs } from '@/lib/comparison-surfaces';
import { isAiDiscoveryEnabled } from '@/lib/ai-discovery/feature-flag';
import { locales, type Locale } from '@/lib/i18n';
import { getPublicSiteUrl } from '@/lib/public-env';

const discoveryToolBlocklist = new Set<string>([
  // Add temporarily suppressed tool slugs here when a route should stay out of search feeds.
]);

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
]);

const explicitPriorityToolSlugs = [
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
  'ssl-checker',
  'cidr-calculator',
];

export const maxIndexNowUrlsPerRun = 1000;

export function isToolBlockedFromDiscovery(toolOrSlug: Pick<Tool, 'slug'> | string): boolean {
  const slug = typeof toolOrSlug === 'string' ? toolOrSlug : toolOrSlug.slug;
  return discoveryToolBlocklist.has(slug) && !highValueToolBlocklistOverrides.has(slug);
}

export function getDiscoverableTools(): Tool[] {
  return tools.filter((tool) => !isToolBlockedFromDiscovery(tool));
}

export function getPriorityTools(): Tool[] {
  const discoverableToolMap = new Map(getDiscoverableTools().map((tool) => [tool.slug, tool]));
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

    const tool = discoverableToolMap.get(slug);
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

  if (isAiDiscoveryEnabled()) {
    paths.add(`/${locale}/ai`);
  }

  for (const category of categories) {
    paths.add(`/${locale}/categories/${category.id}`);
  }

  for (const slug of comparisonSurfaceSlugs) {
    paths.add(`/${locale}/compare/${slug}`);
  }

  for (const tool of getPriorityTools()) {
    paths.add(`/${locale}/tools/${tool.slug}`);
  }

  return Array.from(paths);
}

export function buildPriorityIndexNowUrls(
  baseUrl = getPublicSiteUrl(),
  options: {
    limit?: number;
    selectedLocales?: readonly Locale[];
  } = {}
): string[] {
  const urls = new Set<string>();
  const selectedLocales = options.selectedLocales ?? locales;

  for (const locale of selectedLocales) {
    for (const path of buildPriorityRoutePaths(locale)) {
      urls.add(`${baseUrl}${path}`);
    }
  }

  return Array.from(urls).slice(0, options.limit ?? maxIndexNowUrlsPerRun);
}

export const seoDiscoveryConfig = {
  discoveryToolBlocklist,
  highValueToolBlocklistOverrides,
  explicitPriorityToolSlugs,
};
