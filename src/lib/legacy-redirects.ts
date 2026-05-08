import { ensurePagePath, isValidLocale, type Locale } from './i18n';
import { siteInfoPageSlugs, type SiteInfoPageSlug } from './site-info-pages';

const legacyBlogRedirects: Record<string, string> = {
  'base64-encoding-explained': '/tools/base64',
  'hash-algorithms-explained': '/tools/hash-generator',
  'image-optimization-web': '/tools/image-compressor',
  'jwt-tokens-explained': '/compare/choose-jwt-tool',
  'markdown-syntax-guide': '/tools/markdown-preview',
  'password-security-best-practices': '/tools/password-generator',
  'regex-complete-guide': '/tools/regex-tester',
  'uuid-generator-guide': '/tools/uuid-generator',
};

const legacyComparePairRedirects: Record<string, string> = {
  'css-animation-generator/color-palette': '/tools/css-animation-generator',
  'css-animation-generator/css-grid-generator': '/tools/css-animation-generator',
  'css-animation-generator/gradient-generator': '/tools/css-animation-generator',
  'css-animation-generator/markdown-table-generator': '/tools/css-animation-generator',
  'css-animation-generator/meta-tag-generator': '/tools/css-animation-generator',
  'css-animation-generator/uuid-generator': '/tools/css-animation-generator',
  'grouped-bar-chart-generator/area-chart-generator': '/compare/choose-chart-type',
  'image-border/image-splitter': '/compare/choose-image-tool',
  'json-to-csharp/color-converter': '/tools/json-to-csharp',
};

function withLocale(locale: Locale, path: string): string {
  return `/${locale}${ensurePagePath(path)}`;
}

export function resolveLegacyBlogRedirect(locale: string, slug: string): string | null {
  if (!isValidLocale(locale)) {
    return null;
  }

  const target = legacyBlogRedirects[slug];
  return target ? withLocale(locale, target) : null;
}

export function resolveLegacyUnlocalizedBlogRedirect(slug: string): string | null {
  const target = legacyBlogRedirects[slug];
  return target ? withLocale('en', target) : null;
}

export function resolveLegacyComparePairRedirect(
  locale: string,
  leftSlug: string,
  rightSlug: string
): string | null {
  if (!isValidLocale(locale)) {
    return null;
  }

  const target = legacyComparePairRedirects[`${leftSlug}/${rightSlug}`];
  return target ? withLocale(locale, target) : null;
}

export function resolveLegacyUnlocalizedComparePairRedirect(
  leftSlug: string,
  rightSlug: string
): string | null {
  const target = legacyComparePairRedirects[`${leftSlug}/${rightSlug}`];
  return target ? withLocale('en', target) : null;
}

export function isSiteInfoPageSlug(value: string): value is SiteInfoPageSlug {
  return (siteInfoPageSlugs as readonly string[]).includes(value);
}

export function resolveUnlocalizedSiteInfoRedirect(slug: string): string | null {
  return isSiteInfoPageSlug(slug) ? withLocale('en', `/${slug}`) : null;
}
