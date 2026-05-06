const FETCH_BASE_URL = (process.env.PROD_BASE_URL || 'https://www.u2tool.com').replace(/\/+$/, '');
const CANONICAL_BASE_URL = (
  process.env.CANONICAL_BASE_URL ||
  process.env.PUBLIC_SITE_URL ||
  'https://www.u2tool.com'
).replace(/\/+$/, '');
const MAX_URLS = Number(process.env.SITEMAP_URL_HEALTH_MAX_URLS || 600);
const CONCURRENCY = Number(process.env.SITEMAP_URL_HEALTH_CONCURRENCY || 12);

const sitemapPaths = [
  '/sitemap-priority.xml',
  '/sitemap-pages.xml',
  '/sitemap-tools.xml',
];

interface SitemapUrl {
  sitemapPath: string;
  url: string;
}

interface Finding {
  sitemapPath: string;
  url: string;
  reason: string;
}

function assert(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchWithRetry(url: string, init: RequestInit = {}, attempts = 3): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetch(url, init);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
  }

  throw lastError;
}

function extractLocs(xml: string): string[] {
  return Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map((match) => match[1].trim());
}

function selectEvenly<T>(items: T[], maxItems: number): T[] {
  if (items.length <= maxItems) {
    return items;
  }

  if (maxItems <= 0) {
    return [];
  }

  const selected: T[] = [];
  const step = (items.length - 1) / Math.max(1, maxItems - 1);
  for (let index = 0; index < maxItems; index += 1) {
    selected.push(items[Math.round(index * step)]);
  }

  return Array.from(new Set(selected));
}

function sampleSitemapUrls(groups: Record<string, string[]>): SitemapUrl[] {
  const totalUrls = Object.values(groups).reduce((sum, urls) => sum + urls.length, 0);
  const sampled: SitemapUrl[] = [];

  for (const [sitemapPath, urls] of Object.entries(groups)) {
    const proportionalLimit = Math.max(1, Math.round((urls.length / totalUrls) * MAX_URLS));
    for (const url of selectEvenly(urls, proportionalLimit)) {
      sampled.push({ sitemapPath, url });
    }
  }

  return sampled.slice(0, MAX_URLS);
}

function getCanonical(html: string): string {
  const tag = html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i)?.[0] || '';
  return tag.match(/\bhref=(["'])(.*?)\1/i)?.[2]?.trim() || '';
}

function getRobotsMeta(html: string): string {
  const tag = html.match(/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/i)?.[0] || '';
  return tag.match(/\bcontent=(["'])(.*?)\1/i)?.[2]?.trim() || '';
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

function validateSitemapUrlShape(sitemapPath: string, url: string): Finding[] {
  const findings: Finding[] = [];
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return [{ sitemapPath, url, reason: 'invalid URL in sitemap' }];
  }

  if (parsed.origin !== CANONICAL_BASE_URL) {
    findings.push({ sitemapPath, url, reason: `non-canonical origin "${parsed.origin}"` });
  }

  if (parsed.search) {
    findings.push({ sitemapPath, url, reason: `query string leaked into sitemap: "${parsed.search}"` });
  }

  if (parsed.pathname !== '/' && !parsed.pathname.endsWith('/') && !parsed.pathname.endsWith('.xml') && !parsed.pathname.endsWith('.txt')) {
    findings.push({ sitemapPath, url, reason: 'non-canonical sitemap URL without trailing slash' });
  }

  return findings;
}

async function validateLiveUrl(item: SitemapUrl): Promise<Finding[]> {
  const findings = validateSitemapUrlShape(item.sitemapPath, item.url);
  if (findings.length > 0) {
    return findings;
  }

  const fetchUrl = toFetchUrl(item.url);
  const headResponse = await fetchWithRetry(fetchUrl, { method: 'HEAD', redirect: 'manual' });
  if (headResponse.status >= 300 && headResponse.status < 400) {
    findings.push({
      ...item,
      reason: `sitemap URL returns redirect ${headResponse.status} to "${headResponse.headers.get('location') || '(missing location)'}"`,
    });
    return findings;
  }

  if (headResponse.status !== 200) {
    findings.push({ ...item, reason: `sitemap URL returns HTTP ${headResponse.status}` });
    return findings;
  }

  const contentType = headResponse.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return findings;
  }

  const getResponse = await fetchWithRetry(fetchUrl, { redirect: 'manual' });
  if (getResponse.status !== 200) {
    findings.push({ ...item, reason: `HTML sitemap URL GET returns HTTP ${getResponse.status}` });
    return findings;
  }

  const html = await getResponse.text();
  const canonical = getCanonical(html);
  const robots = getRobotsMeta(html);

  if (canonical !== expectedCanonical(item.url)) {
    findings.push({
      ...item,
      reason: `canonical "${canonical || '(missing)'}" does not match sitemap URL "${expectedCanonical(item.url)}"`,
    });
  }

  if (/noindex/i.test(robots)) {
    findings.push({ ...item, reason: 'sitemap URL points to noindex HTML' });
  }

  if (html.includes('MISSING:') || html.includes('${BASE_URL}')) {
    findings.push({ ...item, reason: 'sitemap URL HTML contains leaked placeholder text' });
  }

  return findings;
}

async function mapWithConcurrency<T, R>(items: T[], mapper: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = [];
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index]);
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, worker));
  return results;
}

async function loadSitemapGroups(): Promise<Record<string, string[]>> {
  const groups: Record<string, string[]> = {};

  for (const sitemapPath of sitemapPaths) {
    const response = await fetchWithRetry(`${FETCH_BASE_URL}${sitemapPath}`);
    assert(response.status === 200, `${sitemapPath}: expected HTTP 200, got ${response.status}`);
    const xml = await response.text();
    const locs = extractLocs(xml);
    assert(locs.length > 0, `${sitemapPath}: no <loc> entries found`);
    groups[sitemapPath] = locs;
  }

  return groups;
}

async function main(): Promise<void> {
  const groups = await loadSitemapGroups();
  for (const [sitemapPath, urls] of Object.entries(groups)) {
    console.log(`OK  Loaded ${urls.length} URLs from ${sitemapPath}`);
  }

  const sample = sampleSitemapUrls(groups);
  console.log(`OK  Selected ${sample.length} sitemap URLs for live health checks`);

  const findingGroups = await mapWithConcurrency(sample, validateLiveUrl);
  const findings = findingGroups.flat();

  if (findings.length > 0) {
    for (const finding of findings.slice(0, 50)) {
      console.log(`FAIL ${finding.sitemapPath} -> ${finding.url}: ${finding.reason}`);
    }
    console.log(`\n${findings.length} sitemap URL health findings found. FETCH_BASE_URL=${FETCH_BASE_URL}; CANONICAL_BASE_URL=${CANONICAL_BASE_URL}; checked=${sample.length}`);
    process.exitCode = 1;
    return;
  }

  console.log(`\nAll sitemap URL health checks passed. FETCH_BASE_URL=${FETCH_BASE_URL}; CANONICAL_BASE_URL=${CANONICAL_BASE_URL}; checked=${sample.length}`);
}

main().catch((error) => {
  console.error(`Unexpected sitemap URL health validation error: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
