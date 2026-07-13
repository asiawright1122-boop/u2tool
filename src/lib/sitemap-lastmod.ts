import manifestJson from '@/config/sitemap-lastmod.json';
import { locales } from '@/lib/i18n';
import { getDiscoverableTools } from '@/lib/seo-discovery';

export type SitemapLastmodBucket = 'pages' | 'ai' | 'tools';

export interface SitemapLastmodManifest {
  buckets: Record<SitemapLastmodBucket, string>;
  overrides: Record<string, string>;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SUPPORTED_LOCALES = new Set<string>(locales);
const DISCOVERABLE_TOOL_SLUGS = new Set(getDiscoverableTools().map((tool) => tool.slug));

function assertDate(value: string, label: string, today: string): void {
  const parsed = new Date(`${value}T00:00:00Z`);
  if (
    !DATE_PATTERN.test(value) ||
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== value
  ) {
    throw new Error(`${label}: invalid lastmod "${value}"`);
  }
  if (value > today) {
    throw new Error(`${label}: future lastmod "${value}"`);
  }
}

export function normalizeSitemapPath(input: string): string {
  const trimmed = input.trim();
  const parsed = trimmed.startsWith('http://') || trimmed.startsWith('https://')
    ? new URL(trimmed)
    : new URL(trimmed.startsWith('/') ? trimmed : `/${trimmed}`, 'https://www.u2tool.com');
  const pathname = parsed.pathname.replace(/\/{2,}/g, '/');
  return pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`;
}

export function validateSitemapLastmodManifest(
  input: SitemapLastmodManifest,
  today = new Date().toISOString().slice(0, 10)
): SitemapLastmodManifest {
  for (const bucket of ['pages', 'ai', 'tools'] as const) {
    assertDate(input.buckets[bucket], `bucket ${bucket}`, today);
  }

  for (const [rawPath, lastmod] of Object.entries(input.overrides)) {
    const path = normalizeSitemapPath(rawPath);
    if (path !== rawPath) {
      throw new Error(`non-canonical override path "${rawPath}"`);
    }

    const segments = path.split('/').filter(Boolean);
    const locale = segments[0] || '';
    if (!SUPPORTED_LOCALES.has(locale)) {
      throw new Error(`unsupported locale "${locale}" in ${path}`);
    }

    if (segments[1] === 'tools') {
      const slug = segments[2] || '';
      if (segments.length !== 3 || !DISCOVERABLE_TOOL_SLUGS.has(slug)) {
        throw new Error(`unknown tool slug "${slug}" in ${path}`);
      }
    }

    assertDate(lastmod, `override ${path}`, today);
  }

  return input;
}

export const sitemapLastmodManifest = validateSitemapLastmodManifest(
  manifestJson as SitemapLastmodManifest
);

export function resolveSitemapLastmod(
  path: string,
  bucket: SitemapLastmodBucket,
  manifest: SitemapLastmodManifest = sitemapLastmodManifest
): string {
  const normalized = normalizeSitemapPath(path);
  return manifest.overrides[normalized] || manifest.buckets[bucket];
}

export function maxLastmod(values: readonly string[]): string {
  if (values.length === 0) {
    throw new Error('Cannot calculate max lastmod from an empty list');
  }
  return [...values].sort().at(-1)!;
}
