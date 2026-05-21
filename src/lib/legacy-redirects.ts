import { ensurePagePath, isValidLocale, type Locale } from './i18n';
import { siteInfoPageSlugs, type SiteInfoPageSlug } from './site-info-pages';

const legacyBlogRedirects: Record<string, string> = {
  'base64-encoding-explained': '/tools/base64',
  'best-json-formatter-tools-2025': '/tools/json-formatter',
  'color-formats-conversion-guide': '/tools/color-converter',
  'hash-algorithms-explained': '/tools/hash-generator',
  'image-optimization-web': '/tools/image-compressor',
  'jwt-tokens-explained': '/compare/choose-jwt-tool',
  'markdown-syntax-guide': '/tools/markdown-preview',
  'password-security-best-practices': '/tools/password-generator',
  'qr-code-complete-guide': '/tools/qr-generator',
  'regex-complete-guide': '/tools/regex-tester',
  'unix-timestamp-guide': '/tools/timestamp-converter',
  'url-encoding-guide': '/tools/url-encoder',
  'uuid-generator-guide': '/tools/uuid-generator',
};

const legacyComparePairRedirects: Record<string, string> = {
  'base32/base64': '/tools/base32',
  'base32/json-formatter': '/tools/base32',
  'base32/jwt-decoder': '/tools/base32',
  'countdown-timer/business-days-calculator': '/tools/countdown-timer',
  'countdown-timer/invoice-generator': '/tools/countdown-timer',
  'countdown-timer/meeting-notes': '/tools/countdown-timer',
  'countdown-timer/pomodoro-timer': '/tools/countdown-timer',
  'countdown-timer/resume-builder': '/tools/countdown-timer',
  'countdown-timer/signature-pad': '/tools/countdown-timer',
  'css-animation-generator/color-palette': '/tools/css-animation-generator',
  'css-animation-generator/css-grid-generator': '/tools/css-animation-generator',
  'css-animation-generator/gradient-generator': '/tools/css-animation-generator',
  'css-animation-generator/markdown-table-generator': '/tools/css-animation-generator',
  'css-animation-generator/meta-tag-generator': '/tools/css-animation-generator',
  'css-animation-generator/uuid-generator': '/tools/css-animation-generator',
  'gif-maker/barcode-generator': '/compare/choose-image-tool',
  'gif-maker/image-collage': '/compare/choose-image-tool',
  'gif-maker/image-resizer': '/compare/choose-image-tool',
  'gif-maker/image-splitter': '/compare/choose-image-tool',
  'gif-maker/qr-generator': '/compare/choose-image-tool',
  'grouped-bar-chart-generator/area-chart-generator': '/compare/choose-chart-type',
  'grouped-bar-chart-generator/bar-chart-generator': '/compare/choose-chart-type',
  'grouped-bar-chart-generator/radar-chart-generator': '/compare/choose-chart-type',
  'hex-editor/json-minifier': '/tools/hex-editor',
  'hex-editor/json-viewer': '/tools/hex-editor',
  'image-border/image-collage': '/compare/choose-image-tool',
  'image-border/image-splitter': '/compare/choose-image-tool',
  'image-collage/barcode-generator': '/compare/choose-image-tool',
  'image-collage/image-resizer': '/compare/choose-image-tool',
  'image-collage/image-rounder': '/compare/choose-image-tool',
  'image-collage/image-splitter': '/compare/choose-image-tool',
  'image-collage/image-watermark': '/compare/choose-image-tool',
  'image-collage/qr-generator': '/compare/choose-image-tool',
  'json-to-csharp/color-converter': '/tools/json-to-csharp',
  'json-to-csharp/timestamp-converter': '/tools/json-to-csharp',
  'json-to-yaml/color-converter': '/tools/json-to-yaml',
  'json-to-yaml/date-calculator': '/tools/json-to-yaml',
  'json-to-yaml/json-to-csv': '/tools/json-to-yaml',
  'json-to-yaml/timestamp-converter': '/tools/json-to-yaml',
  'json-to-yaml/yaml-json': '/tools/json-to-yaml',
  'liquid-fill-chart-generator/area-chart-generator': '/compare/choose-chart-type',
  'liquid-fill-chart-generator/line-chart-generator': '/compare/choose-chart-type',
  'liquid-fill-chart-generator/pie-chart-generator': '/compare/choose-chart-type',
  'liquid-fill-chart-generator/radar-chart-generator': '/compare/choose-chart-type',
  'sql-to-mongo/color-converter': '/tools/sql-to-mongo',
  'sql-to-mongo/date-calculator': '/tools/sql-to-mongo',
  'sql-to-mongo/json-to-csv': '/tools/sql-to-mongo',
  'sql-to-mongo/timestamp-converter': '/tools/sql-to-mongo',
  'sql-to-mongo/unit-converter': '/tools/sql-to-mongo',
  'sql-to-mongo/yaml-json': '/tools/sql-to-mongo',
  'text-hash-comparator/password-generator': '/compare/choose-jwt-tool',
  'toml-json/date-calculator': '/tools/toml-json',
  'toml-json/json-to-csv': '/tools/toml-json',
  'toml-json/timestamp-converter': '/tools/toml-json',
  'treemap-chart-generator/bar-chart-generator': '/compare/choose-chart-type',
  'url-parser/dns-lookup': '/tools/url-parser',
  'url-parser/ip-lookup': '/tools/url-parser',
  'url-parser/ip-validator': '/tools/url-parser',
  'url-parser/ssl-checker': '/tools/url-parser',
  'url-parser/url-encoder': '/tools/url-parser',
  'url-parser/whois-lookup': '/tools/url-parser',
  'xml-to-json/timestamp-converter': '/tools/xml-to-json',
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

export function resolveLegacyBlogFallback(locale: string): string | null {
  if (!isValidLocale(locale)) {
    return null;
  }
  return withLocale(locale, '/tools');
}

export function resolveLegacyUnlocalizedBlogFallback(): string {
  return withLocale('en', '/tools');
}

export function resolveLegacyComparePairFallback(locale: string): string | null {
  if (!isValidLocale(locale)) {
    return null;
  }
  return withLocale(locale, '/compare');
}

export function resolveLegacyUnlocalizedComparePairFallback(): string {
  return withLocale('en', '/compare');
}
