const FETCH_BASE_URL = (process.env.PROD_BASE_URL || 'https://www.u2tool.com').replace(/\/+$/, '');
const CANONICAL_BASE_URL = (
  process.env.CANONICAL_BASE_URL ||
  process.env.PUBLIC_SITE_URL ||
  'https://www.u2tool.com'
).replace(/\/+$/, '');
const MAX_LINKS = Number(process.env.INTERNAL_LINK_AUDIT_MAX_LINKS || 500);
const FETCH_ATTEMPTS = Number(process.env.INTERNAL_LINK_AUDIT_FETCH_ATTEMPTS || 5);

const seedPaths = [
  '/en/',
  '/en/tools/',
  '/en/tools/?q=word',
  '/en/ai/',
  '/en/categories/text/',
  '/en/categories/development/',
  '/en/compare/',
  '/en/compare/choose-text-tool/',
  '/en/compare/choose-json-tool/',
  '/en/tools/json-formatter/',
  '/en/tools/jwt-decoder/',
  '/en/tools/word-counter/',
];

interface LinkFinding {
  sourcePath: string;
  href: string;
  reason: string;
}

function assert(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchWithRetry(url: string, init: RequestInit = {}, attempts = FETCH_ATTEMPTS): Promise<Response> {
  let lastError: unknown;
  const method = init.method || 'GET';

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetch(url, init);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`${method} ${url} failed after ${attempts} attempts: ${message}`);
}

function decodeHtmlAttribute(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&#38;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function isSkippableHref(rawHref: string): boolean {
  return (
    rawHref === '' ||
    rawHref.startsWith('#') ||
    rawHref.startsWith('mailto:') ||
    rawHref.startsWith('tel:') ||
    rawHref.startsWith('javascript:')
  );
}

function isSkippablePath(pathname: string): boolean {
  return (
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/cdn-cgi/') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.json') ||
    pathname.endsWith('.txt') ||
    pathname.endsWith('.xml')
  );
}

function normalizeInternalHref(rawHref: string, sourceUrl: string): string | null {
  const href = decodeHtmlAttribute(rawHref).trim();
  if (isSkippableHref(href)) {
    return null;
  }

  const parsed = new URL(href, sourceUrl);
  const fetchBase = new URL(FETCH_BASE_URL);
  const canonicalBase = new URL(CANONICAL_BASE_URL);
  if (parsed.hostname !== fetchBase.hostname && parsed.hostname !== canonicalBase.hostname) {
    return null;
  }

  if (isSkippablePath(parsed.pathname)) {
    return null;
  }

  parsed.hash = '';
  parsed.protocol = canonicalBase.protocol;
  parsed.hostname = canonicalBase.hostname;
  parsed.port = canonicalBase.port;
  return parsed.toString();
}

function extractInternalLinks(html: string, sourcePath: string): string[] {
  const sourceUrl = `${FETCH_BASE_URL}${sourcePath}`;
  const hrefs = Array.from(html.matchAll(/<a\b[^>]*\bhref=(["'])(.*?)\1/gi))
    .map((match) => normalizeInternalHref(match[2], sourceUrl))
    .filter((href): href is string => Boolean(href));

  return Array.from(new Set(hrefs)).sort();
}

function getCanonical(html: string): string {
  const tag = html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i)?.[0] || '';
  return tag.match(/\bhref=(["'])(.*?)\1/i)?.[2]?.trim() || '';
}

function expectedCanonical(url: string): string {
  const parsed = new URL(url);
  parsed.hash = '';
  return parsed.toString();
}

function toFetchUrl(canonicalUrl: string): string {
  const url = new URL(canonicalUrl);
  const fetchBase = new URL(FETCH_BASE_URL);
  url.protocol = fetchBase.protocol;
  url.hostname = fetchBase.hostname;
  url.port = fetchBase.port;
  return url.toString();
}

async function fetchSeedLinks(sourcePath: string): Promise<string[]> {
  const response = await fetchWithRetry(`${FETCH_BASE_URL}${sourcePath}`, { redirect: 'follow' });
  assert(response.status === 200, `${sourcePath}: expected seed page HTTP 200, got ${response.status}`);
  assert((response.headers.get('content-type') || '').includes('text/html'), `${sourcePath}: seed page is not HTML`);

  const html = await response.text();
  return extractInternalLinks(html, sourcePath);
}

async function validateInternalLink(sourcePath: string, href: string): Promise<LinkFinding[]> {
  const findings: LinkFinding[] = [];
  const parsed = new URL(href);

  if (parsed.search) {
    findings.push({
      sourcePath,
      href,
      reason: `internal crawlable link contains query parameters "${parsed.search}"`,
    });
  }

  const fetchHref = toFetchUrl(href);
  const headResponse = await fetchWithRetry(fetchHref, { method: 'HEAD', redirect: 'manual' });
  if (headResponse.status >= 300 && headResponse.status < 400) {
    findings.push({
      sourcePath,
      href,
      reason: `internal link returns redirect ${headResponse.status} to "${headResponse.headers.get('location') || '(missing location)'}"`,
    });
    return findings;
  }

  if (headResponse.status >= 400) {
    findings.push({
      sourcePath,
      href,
      reason: `internal link returns HTTP ${headResponse.status}`,
    });
    return findings;
  }

  const contentType = headResponse.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return findings;
  }

  const getResponse = await fetchWithRetry(fetchHref, { redirect: 'manual' });
  if (getResponse.status >= 300 && getResponse.status < 400) {
    findings.push({
      sourcePath,
      href,
      reason: `internal HTML link redirects on GET with HTTP ${getResponse.status}`,
    });
    return findings;
  }

  const html = await getResponse.text();
  const canonical = getCanonical(html);
  if (canonical && canonical !== expectedCanonical(href)) {
    findings.push({
      sourcePath,
      href,
      reason: `canonical "${canonical}" does not match linked URL "${expectedCanonical(href)}"`,
    });
  }

  const robots = html.match(/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/i)?.[0] || '';
  if (/noindex/i.test(robots)) {
    findings.push({
      sourcePath,
      href,
      reason: 'internal link points to a noindex HTML page',
    });
  }

  return findings;
}

async function main(): Promise<void> {
  const linksBySource = new Map<string, string[]>();
  for (const seedPath of seedPaths) {
    const links = await fetchSeedLinks(seedPath);
    linksBySource.set(seedPath, links);
    console.log(`OK  Seed ${seedPath} exposed ${links.length} internal crawlable links`);
  }

  const pairsByHref = new Map<string, { sourcePath: string; href: string }>();
  for (const [sourcePath, links] of linksBySource.entries()) {
    for (const href of links) {
      if (!pairsByHref.has(href)) {
        pairsByHref.set(href, { sourcePath, href });
      }
    }
  }

  const pairs = Array.from(pairsByHref.values()).slice(0, MAX_LINKS);

  const findings: LinkFinding[] = [];
  for (const pair of pairs) {
    findings.push(...await validateInternalLink(pair.sourcePath, pair.href));
  }

  if (findings.length > 0) {
    for (const finding of findings.slice(0, 50)) {
      console.log(`FAIL ${finding.sourcePath} -> ${finding.href}: ${finding.reason}`);
    }
    console.log(`\n${findings.length} internal link canonical findings found. FETCH_BASE_URL=${FETCH_BASE_URL}; CANONICAL_BASE_URL=${CANONICAL_BASE_URL}; checked=${pairs.length}`);
    process.exitCode = 1;
    return;
  }

  console.log(`\nAll internal link canonical checks passed. FETCH_BASE_URL=${FETCH_BASE_URL}; CANONICAL_BASE_URL=${CANONICAL_BASE_URL}; checked=${pairs.length}`);
}

main().catch((error) => {
  console.error(`Unexpected internal link canonical validation error: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
