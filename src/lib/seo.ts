import type { ToolCategory } from '@/config/tools';
import { ensurePagePath, getLocalizedPath, type Locale } from './i18n';

export interface SeoMetadata {
  title: string;
  description: string;
}

export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
}

export interface WebsiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  potentialAction: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': 'required name=search_term_string';
  };
}

export const hreflangMap: Record<Locale, string> = {
  en: 'en',
  zh: 'zh-CN',
  ja: 'ja',
  ko: 'ko',
  es: 'es',
  pt: 'pt',
  fr: 'fr',
  de: 'de',
  ru: 'ru',
  ar: 'ar',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function readSeoNamespace(
  parent: Record<string, unknown>,
  key: string
): Partial<SeoMetadata> {
  const candidate = parent[key];
  if (!isRecord(candidate)) {
    return {};
  }

  return {
    title: isNonEmptyString(candidate.seo_title) ? candidate.seo_title.trim() : undefined,
    description: isNonEmptyString(candidate.seo_description)
      ? candidate.seo_description.trim()
      : undefined,
  };
}

export function getHreflang(locale: Locale): string {
  return hreflangMap[locale];
}

export function withBrand(title: string, brand = 'U2Tool'): string {
  return title.includes(brand) ? title : `${title} | ${brand}`;
}

export function buildWebsiteSearchUrlTemplate(baseUrl: string, locale: Locale = 'en'): string {
  return `${buildLocalizedPageUrl(baseUrl, locale, '/tools')}?q={search_term_string}`;
}

export function withPageUrlTrailingSlash(urlOrPath: string): string {
  if (!urlOrPath) {
    return urlOrPath;
  }

  try {
    const url = new URL(urlOrPath);
    url.pathname = ensurePagePath(url.pathname);
    return url.toString();
  } catch {
    return ensurePagePath(urlOrPath);
  }
}

export function buildLocalizedPagePath(locale: Locale, path = '/'): string {
  return getLocalizedPath(locale, path);
}

export function buildLocalizedPageUrl(baseUrl: string, locale: Locale, path = '/'): string {
  return withPageUrlTrailingSlash(`${baseUrl}${buildLocalizedPagePath(locale, path)}`);
}

export function buildSiteDescription(toolCount: number): string {
  return `${toolCount}+ free online tools for developers, designers, and teams. Format, convert, generate, and validate data directly in your browser.`;
}

function getLargestNumericClaim(text: string): number {
  const matches = [...text.matchAll(/\b(\d[\d,]*)\+?\b/g)];
  const values = matches
    .map((match) => Number.parseInt(match[1].replace(/,/g, ''), 10))
    .filter((value) => Number.isFinite(value));

  return values.length > 0 ? Math.max(...values) : 0;
}

export function resolveSiteDescription(siteDescription: string | undefined, toolCount: number): string {
  const candidate = siteDescription?.trim();
  if (!candidate) {
    return buildSiteDescription(toolCount);
  }

  const largestClaim = getLargestNumericClaim(candidate);
  if (largestClaim > toolCount || /\bmillions? of developers\b/i.test(candidate)) {
    return buildSiteDescription(toolCount);
  }

  return candidate;
}

export function getSiteDescription(
  baseMessages: Record<string, unknown>,
  toolCount: number
): string {
  const site = isRecord(baseMessages.site) ? baseMessages.site : {};
  return isNonEmptyString(site.description) ? site.description.trim() : buildSiteDescription(toolCount);
}

export function buildOrganizationSchema(
  baseUrl: string,
  description: string,
  sameAs: string[] = ['https://github.com/u2tool']
): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'U2Tool',
    url: baseUrl,
    logo: `${baseUrl}/favicon.svg`,
    description,
    sameAs,
  };
}

export function buildWebsiteSchema(
  baseUrl: string,
  locale: Locale,
  description: string
): WebsiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'U2Tool',
    url: baseUrl,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: buildWebsiteSearchUrlTemplate(baseUrl, locale),
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getToolsPageSeo(
  baseMessages: Record<string, unknown>,
  toolCount: number
): SeoMetadata {
  const pages = isRecord(baseMessages.pages) ? baseMessages.pages : {};
  const toolsPage = readSeoNamespace(pages, 'tools');

  return {
    title: toolsPage.title ?? `Browse ${toolCount}+ Free Online Tools`,
    description:
      toolsPage.description ??
      `Browse ${toolCount}+ free online tools for developers, designers, and creators.`,
  };
}

export function getCategoryPageSeo(
  baseMessages: Record<string, unknown>,
  category: ToolCategory,
  fallbackCategoryName: string,
  toolCount: number
): SeoMetadata {
  const categoriesSeo = isRecord(baseMessages.categories_seo) ? baseMessages.categories_seo : {};
  const categorySeo = readSeoNamespace(categoriesSeo, category);

  return {
    title: categorySeo.title ?? `${fallbackCategoryName} Tools`,
    description:
      categorySeo.description ??
      `${toolCount}+ free ${fallbackCategoryName} tools online.`,
  };
}
