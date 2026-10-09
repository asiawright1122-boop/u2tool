import type { ToolCategory } from '@/config/tools';
import { ensurePagePath, getLocalizedPath, locales as allLocales, type Locale } from './i18n';

export interface SeoMetadata {
  title: string;
  description: string;
}

export interface MetaDescriptionInput {
  description?: string;
  locale?: Locale | string;
  title?: string;
}

export interface CanonicalUrlInput {
  baseUrl: string;
  locale: Locale;
  requestUrl: URL | string;
  canonicalPath?: string;
}

const META_DESCRIPTION_DEFAULT_TITLE = 'U2Tool online tools';

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
  inLanguage: string;
  potentialAction?: {
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

function normalizeCountClaim(value: string, toolCount: number): string {
  if (toolCount <= 0) {
    return value;
  }

  return value.replace(/\b\d[\d,]*\+/g, `${toolCount}+`);
}

function normalizeMetaDescriptionWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function resolveMetaDescription(input: MetaDescriptionInput): string {
  const normalizedDescription = normalizeMetaDescriptionWhitespace(input.description ?? '');
  const fallbackDescription = normalizeMetaDescriptionWhitespace(input.title ?? '') || META_DESCRIPTION_DEFAULT_TITLE;
  // Rendering must preserve authored meaning, including limitations at the end.
  // Length is an editorial review concern, not a reason to invent capabilities
  // or cut text. Search engines choose their own display snippet length.
  return normalizedDescription || fallbackDescription;
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

function includeHexIntent(value: string, appendedTerm = 'Hex'): string {
  if (/\bhex\b/i.test(value)) {
    return value;
  }

  const withHex = value
    .replace(/\bBase64,\s*HTML\b/i, 'Base64, Hex, HTML')
    .replace(/\bBase64,\s+(HTML)\b/i, 'Base64, Hex, $1');

  return withHex === value ? `${value} ${appendedTerm}` : withHex;
}

function normalizeEncodingCategorySeo(metadata: SeoMetadata): SeoMetadata {
  const russianEncodingTerm = '\u043a\u043e\u0434\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f';
  const title = includeHexIntent(metadata.title)
    .replace(/\u041a\u043e\u0434\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f/g, russianEncodingTerm);
  const description = includeHexIntent(metadata.description, 'hex');

  return { title, description };
}

export function getHreflang(locale: Locale): string {
  return hreflangMap[locale];
}

/** One alternate set for HTML and XML. Never point x-default outside that set. */
export function buildLocalizedAlternates(
  baseUrl: string,
  path: string,
  publishedLocales: readonly Locale[] = allLocales,
  preferredDefault: Locale = 'en',
): { hreflang: string; href: string }[] {
  // Site locale order makes the fallback identical on every sibling page.
  const available = allLocales.filter(locale => publishedLocales.includes(locale));
  if (!available.length) return [];
  const defaultLocale = available.includes(preferredDefault) ? preferredDefault : available[0];
  return [
    ...available.map(locale => ({
      hreflang: getHreflang(locale),
      href: buildLocalizedPageUrl(baseUrl, locale, path),
    })),
    { hreflang: 'x-default', href: buildLocalizedPageUrl(baseUrl, defaultLocale, path) },
  ];
}

export function withBrand(title: string, brand = 'U2Tool'): string {
  const branded = title.includes(brand) ? title : `${title} | ${brand}`;
  const limit = isCjkTitle(title) ? CJK_TITLE_LIMIT : LATIN_TITLE_LIMIT;
  if (branded.length <= limit) {
    return branded;
  }

  const brandSuffix = ` | ${brand}`;
  // If the title already carries the brand, strip it so the suffix survives
  // the truncation instead of being cut mid-word ("… | U2To…").
  const brandIndex = title.indexOf(brand);
  const content = brandIndex >= 0
    ? title.slice(0, brandIndex).replace(/[\s|]+$/, '')
    : title;
  const contentLimit = Math.max(1, limit - brandSuffix.length);
  let cut = content.slice(0, contentLimit);
  if (!isCjkTitle(content)) {
    // Non-CJK scripts cut at a word boundary to avoid mid-word breaks.
    cut = cut.replace(/\s+\S*$/, '');
  }
  cut = cut.replace(/[\s|]+$/, '');
  return `${cut}${brandSuffix}`;
}

const LATIN_TITLE_LIMIT = 60;
const CJK_TITLE_LIMIT = 35;

function isCjkTitle(title: string): boolean {
  return /[\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF]/.test(title);
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

export function buildCanonicalUrl({
  baseUrl,
  locale,
  requestUrl,
  canonicalPath,
}: CanonicalUrlInput): string {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  const url = typeof requestUrl === 'string'
    ? new URL(requestUrl, normalizedBaseUrl)
    : requestUrl;
  const normalizedCanonicalPath = canonicalPath
    ? new URL(canonicalPath, normalizedBaseUrl).pathname
    : undefined;
  const requestPathWithoutLocale = url.pathname.replace(new RegExp(`^/${locale}(?=/|$)`), '') || '/';
  const pathWithoutLocale = normalizedCanonicalPath ?? requestPathWithoutLocale;

  return buildLocalizedPageUrl(normalizedBaseUrl, locale, pathWithoutLocale);
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

  return normalizeCountClaim(candidate, toolCount);
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
  description: string,
  isHomePage = false
): WebsiteSchema {
  const schema: WebsiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'U2Tool',
    url: baseUrl,
    description,
    inLanguage: getHreflang(locale),
  };

  if (isHomePage) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: buildWebsiteSearchUrlTemplate(baseUrl, locale),
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return schema;
}

export function getToolsPageSeo(
  baseMessages: Record<string, unknown>,
  toolCount: number,
  locale?: Locale | string
): SeoMetadata {
  const pages = isRecord(baseMessages.pages) ? baseMessages.pages : {};
  const toolsPage = readSeoNamespace(pages, 'tools');
  const title = toolsPage.title
    ? normalizeCountClaim(toolsPage.title, toolCount)
    : `Browse ${toolCount}+ Free Online Tools`;
  const description = toolsPage.description
    ? normalizeCountClaim(toolsPage.description, toolCount)
    : `Browse ${toolCount}+ free online tools for developers, designers, and creators.`;

  return {
    title,
    description: resolveMetaDescription({ description, locale, title }),
  };
}

export function getHomePageSeo(
  baseMessages: Record<string, unknown>,
  toolCount: number,
  locale?: Locale | string
): SeoMetadata {
  const pages = isRecord(baseMessages.pages) ? baseMessages.pages : {};
  const homePage = readSeoNamespace(pages, 'home');
  const home = isRecord(baseMessages.home) ? baseMessages.home : {};
  const hero = isRecord(home.hero) ? home.hero : {};

  const fallbackTitle = `U2Tool: ${toolCount}+ Free Online Tools, Converters & Generators`;
  const fallbackDescription =
    `Explore U2Tool's ${toolCount}+ free online tools for JSON, PDF, images, text, charts, SEO, and developer workflows. Fast, browser-based, and no signup required.`;
  const heroTitle = isNonEmptyString(hero.title) ? hero.title.trim() : '';
  const heroDescription = isNonEmptyString(hero.subtitle) ? hero.subtitle.trim() : '';
  const genericHomeTitle = heroTitle === 'Free Online Tools';
  const genericHomeDescription = heroDescription === 'Boost your productivity with our collection of free developer tools. No signup required, works entirely in your browser.'
    || heroDescription === 'Boost your productivity with our collection of free developer tools.';

  const title = homePage.title
    ? normalizeCountClaim(homePage.title, toolCount)
    : heroTitle && !genericHomeTitle
      ? normalizeCountClaim(heroTitle, toolCount)
      : fallbackTitle;
  const description = homePage.description
    ? normalizeCountClaim(homePage.description, toolCount)
    : heroDescription && !genericHomeDescription
      ? normalizeCountClaim(heroDescription, toolCount)
      : fallbackDescription;

  return {
    title,
    description: resolveMetaDescription({ description, locale, title }),
  };
}

export function getCategoryPageSeo(
  baseMessages: Record<string, unknown>,
  category: ToolCategory,
  fallbackCategoryName: string,
  toolCount: number,
  locale?: Locale | string
): SeoMetadata {
  const categoriesSeo = isRecord(baseMessages.categories_seo) ? baseMessages.categories_seo : {};
  const categorySeo = readSeoNamespace(categoriesSeo, category);
  const metadata = {
    title: categorySeo.title ?? `${fallbackCategoryName} Tools`,
    description:
      categorySeo.description ??
      `${toolCount}+ free ${fallbackCategoryName} tools online.`,
  };
  const normalizedMetadata = category === 'encoding' ? normalizeEncodingCategorySeo(metadata) : metadata;

  return {
    ...normalizedMetadata,
    description: resolveMetaDescription({
      description: normalizedMetadata.description,
      locale,
      title: normalizedMetadata.title,
    }),
  };
}
