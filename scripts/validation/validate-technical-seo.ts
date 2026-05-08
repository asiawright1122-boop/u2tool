const BASE_URL = (process.env.PROD_BASE_URL || 'https://www.u2tool.com').replace(/\/+$/, '');
const MAX_LASTMOD_AGE_DAYS = Number(process.env.MAX_SITEMAP_LASTMOD_AGE_DAYS || 45);

interface UrlCheck {
  name: string;
  path: string;
  contentTypeIncludes?: string;
  bodyIncludes?: string[];
}

const urlChecks: UrlCheck[] = [
  { name: 'robots.txt', path: '/robots.txt', contentTypeIncludes: 'text/plain', bodyIncludes: ['Sitemap: https://www.u2tool.com/sitemap.xml', 'Disallow: /api/', 'Disallow: /_next/', 'Disallow: /dist/'] },
  { name: 'sitemap index', path: '/sitemap.xml', contentTypeIncludes: 'application/xml', bodyIncludes: ['/sitemap-priority.xml', '/sitemap-pages.xml', '/sitemap-tools.xml'] },
  { name: 'priority sitemap', path: '/sitemap-priority.xml', contentTypeIncludes: 'application/xml', bodyIncludes: ['/en/ai/', '/en/tools/json-formatter/', '/en/tools/jwt-decoder/'] },
  { name: 'tools sitemap', path: '/sitemap-tools.xml', contentTypeIncludes: 'application/xml', bodyIncludes: ['/en/tools/json-formatter/', '/en/tools/jwt-decoder/'] },
];

function assert(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchWithRetry(url: string, init: RequestInit = {}, attempts = 3): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
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
  return Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map((match) => match[1]);
}

function extractLastmods(xml: string): string[] {
  return Array.from(xml.matchAll(/<lastmod>(.*?)<\/lastmod>/g)).map((match) => match[1]);
}

function assertRecentLastmods(name: string, xml: string): void {
  const lastmods = extractLastmods(xml);
  assert(lastmods.length > 0, `${name}: no lastmod entries found`);

  const now = Date.now();
  for (const lastmod of lastmods.slice(0, 50)) {
    const timestamp = Date.parse(lastmod);
    assert(Number.isFinite(timestamp), `${name}: invalid lastmod "${lastmod}"`);
    const ageDays = (now - timestamp) / 86_400_000;
    assert(ageDays <= MAX_LASTMOD_AGE_DAYS, `${name}: stale lastmod "${lastmod}" (${Math.round(ageDays)} days old)`);
  }
}

async function fetchText(path: string, redirect: RequestRedirect = 'follow'): Promise<{ response: Response; text: string }> {
  const response = await fetchWithRetry(`${BASE_URL}${path}`, { redirect });
  return { response, text: await response.text() };
}

async function validateUrlCheck(check: UrlCheck): Promise<void> {
  const { response, text } = await fetchText(check.path);
  assert(response.status === 200, `${check.name}: expected HTTP 200, got ${response.status}`);
  if (check.contentTypeIncludes) {
    assert((response.headers.get('content-type') || '').includes(check.contentTypeIncludes), `${check.name}: unexpected content-type "${response.headers.get('content-type') || ''}"`);
  }
  for (const expected of check.bodyIncludes || []) {
    assert(text.includes(expected), `${check.name}: body missing "${expected}"`);
  }
  if (check.path.includes('sitemap')) {
    assertRecentLastmods(check.name, text);
  }
}

async function validateRedirects(): Promise<void> {
  const redirects = [
    ['/tools/json-formatter', '/en/tools/json-formatter/'],
    ['/en/tools/json-formatter', '/en/tools/json-formatter/'],
    ['/tools/category/text', '/en/categories/text/'],
    ['/en/tools/category/text', '/en/categories/text/'],
    ['/privacy', '/en/privacy/'],
    ['/models', '/en/ai/'],
    ['/favicon.ico', '/favicon.svg'],
    ['/ru/blog/regex-complete-guide', '/ru/tools/regex-tester/'],
    ['/ja/blog/jwt-tokens-explained', '/ja/compare/choose-jwt-tool/'],
    ['/compare/image-border/image-splitter', '/en/compare/choose-image-tool/'],
    ['/compare/image-border/image-splitter/', '/en/compare/choose-image-tool/'],
    ['/zh/compare/image-border/image-splitter', '/zh/compare/choose-image-tool/'],
    ['/zh/compare/image-border/image-splitter/', '/zh/compare/choose-image-tool/'],
    ['/en/compare/css-animation-generator/uuid-generator', '/en/tools/css-animation-generator/'],
    ['/en/compare/css-animation-generator/uuid-generator/', '/en/tools/css-animation-generator/'],
    ['/compare/choose-json-tool', '/en/compare/choose-json-tool/'],
  ];

  for (const [from, expectedLocation] of redirects) {
    const response = await fetchWithRetry(`${BASE_URL}${from}`, { redirect: 'manual' });
    const location = response.headers.get('location') || '';
    assert([301, 302, 307, 308].includes(response.status), `redirect ${from}: expected redirect, got ${response.status}`);
    assert(location.endsWith(expectedLocation), `redirect ${from}: expected location ending "${expectedLocation}", got "${location}"`);
  }
}

async function validateSitemapConsistency(): Promise<void> {
  const [{ text: priorityXml }, { text: toolsXml }] = await Promise.all([
    fetchText('/sitemap-priority.xml'),
    fetchText('/sitemap-tools.xml'),
  ]);
  const priorityLocs = extractLocs(priorityXml);
  const toolLocs = extractLocs(toolsXml);
  assert(new Set(priorityLocs).size === priorityLocs.length, 'priority sitemap contains duplicate URLs');
  assert(new Set(toolLocs).size === toolLocs.length, 'tools sitemap contains duplicate URLs');
  assert(toolLocs.length >= 1000, `tools sitemap has unexpectedly few URLs: ${toolLocs.length}`);
  assert(priorityLocs.every((url) => url.endsWith('/') || url.endsWith('.xml')), 'priority sitemap contains non-canonical URLs without trailing slash');
  assert(toolLocs.every((url) => url.endsWith('/')), 'tools sitemap contains non-canonical tool URLs without trailing slash');
}

async function main(): Promise<void> {
  const failures: string[] = [];
  const tasks: Array<[string, () => Promise<void>]> = [
    ...urlChecks.map((check): [string, () => Promise<void>] => [check.name, () => validateUrlCheck(check)]),
    ['redirect canonicals', validateRedirects],
    ['sitemap consistency', validateSitemapConsistency],
  ];

  for (const [name, task] of tasks) {
    try {
      await task();
      console.log(`OK  ${name}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(message);
      console.log(`FAIL ${name} -> ${message}`);
    }
  }

  if (failures.length > 0) {
    console.log(`\n${failures.length} technical SEO checks failed. BASE_URL=${BASE_URL}`);
    process.exitCode = 1;
    return;
  }

  console.log(`\nAll technical SEO checks passed. BASE_URL=${BASE_URL}`);
}

main().catch((error) => {
  console.error('Unexpected technical SEO validation error:', error);
  process.exitCode = 1;
});
