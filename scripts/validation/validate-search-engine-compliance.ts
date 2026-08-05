import {
  buildIndexableToolsSitemapEntries,
  buildPagesSitemapEntries,
  buildPrioritySitemapEntries,
} from '../../src/lib/sitemap-entry-builders';
import { resolveSitemapLastmod } from '../../src/lib/sitemap-lastmod';
import { newestEntryLastmod } from '../../src/lib/sitemap-utils';
import {
  assertExpectedLastmod,
  assertValidLastmods,
  extractSitemapIndexLastmods,
  extractUrlLastmods,
} from './sitemap-lastmod-xml';

const FETCH_BASE_URL = (process.env.PROD_BASE_URL || 'https://www.u2tool.com').replace(/\/+$/, '');
const CANONICAL_BASE_URL = (
  process.env.CANONICAL_BASE_URL ||
  process.env.PUBLIC_SITE_URL ||
  'https://www.u2tool.com'
).replace(/\/+$/, '');
const SUPPORTED_LOCALES = ['en', 'zh-CN', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

interface HtmlCheck {
  name: string;
  path: string;
  canonicalPath?: string;
  isNoIndex?: boolean;
  maxTitleLength?: number;
  requiredSchema: string[];
  requiredBody: Array<string | RegExp>;
}

const htmlChecks: HtmlCheck[] = [
  {
    name: 'Homepage',
    path: '/en/',
    requiredSchema: ['Organization', 'WebSite'],
    requiredBody: ['Free Online Tools', 'Text Tools', 'JSON Formatter'],
  },
  {
    name: 'Tools index',
    path: '/en/tools/',
    requiredSchema: ['Organization', 'WebSite', 'CollectionPage'],
    requiredBody: [/\b\d[\d,]*\+\s+Free\s+Online\s+Tools/, 'Text Tools', 'Choose the Right Text Tool'],
  },
  {
    name: 'Tools search canonical',
    path: '/en/tools/?q=word',
    canonicalPath: '/en/tools/',
    isNoIndex: true,
    requiredSchema: ['Organization', 'WebSite', 'CollectionPage'],
    requiredBody: ['Word Counter', 'https://www.u2tool.com/en/tools/word-counter/'],
  },
  {
    name: 'AI discovery fallback',
    path: '/en/ai/',
    maxTitleLength: 75,
    requiredSchema: ['Organization', 'WebSite'],
    requiredBody: ['AI Tools Directory', 'Text Tools', 'Choose the Right Text Tool'],
  },
  {
    name: 'Representative tool detail',
    path: '/en/tools/json-formatter/',
    requiredSchema: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    requiredBody: ['JSON Formatter', 'Choose the Right JSON Tool'],
  },
  {
    name: 'Representative category',
    path: '/en/categories/text/',
    requiredSchema: ['Organization', 'WebSite', 'CollectionPage', 'BreadcrumbList'],
    requiredBody: ['Text Tools', 'Word Counter', 'Case Converter'],
  },
  {
    name: 'Representative comparison',
    path: '/en/compare/choose-text-tool/',
    requiredSchema: ['Organization', 'WebSite', 'CollectionPage', 'BreadcrumbList'],
    requiredBody: ['Choose the Right Text Tool', 'Word Counter', 'Diff Checker'],
  },
];

function assert(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

async function fetchText(path: string): Promise<{ response: Response; text: string }> {
  const response = await fetch(`${FETCH_BASE_URL}${path}`, { redirect: 'follow' });
  return { response, text: await response.text() };
}

function getTagContent(html: string, selector: 'title' | 'description' | 'canonical' | 'robots'): string {
  if (selector === 'title') {
    return html.match(/<title>(.*?)<\/title>/is)?.[1]?.replace(/\s+/g, ' ').trim() || '';
  }

  const tagName = selector === 'canonical' ? 'link' : 'meta';
  const attribute = selector === 'canonical' ? 'rel' : 'name';
  const tag = html.match(new RegExp(`<${tagName}\\b(?=[^>]*\\b${attribute}=["']${selector}["'])[^>]*>`, 'i'))?.[0] || '';
  const valueAttribute = selector === 'canonical' ? 'href' : 'content';
  return tag.match(new RegExp(`\\b${valueAttribute}=(["'])(.*?)\\1`, 'i'))?.[2]?.trim() || '';
}

function extractJsonLdTypes(html: string): string[] {
  const scripts = Array.from(
    html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
  ).map((match) => match[1].trim());
  const types = new Set<string>();

  for (const script of scripts) {
    const parsed = JSON.parse(script) as unknown;
    const values = Array.isArray(parsed) ? parsed : [parsed];
    for (const value of values) {
      if (value && typeof value === 'object' && '@type' in value) {
        const type = (value as { '@type'?: unknown })['@type'];
        if (typeof type === 'string') {
          types.add(type);
        }
      }
    }
  }

  return Array.from(types);
}

function extractLocs(xml: string): string[] {
  return Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map((match) => match[1]);
}

function assertNoLeaks(name: string, text: string): void {
  assert(!text.includes('${BASE_URL}'), `${name}: unresolved BASE_URL placeholder leaked`);
  assert(!text.includes('MISSING:'), `${name}: missing translation placeholder leaked`);
  assert(!text.includes('/en/tools/word-counter"'), `${name}: non-canonical word-counter URL leaked`);
}

async function validateRobots(): Promise<void> {
  const { response, text } = await fetchText('/robots.txt');
  assert(response.status === 200, `robots.txt: expected 200, got ${response.status}`);
  assert((response.headers.get('content-type') || '').includes('text/plain'), 'robots.txt: expected text/plain');
  for (const expected of [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    `Sitemap: ${CANONICAL_BASE_URL}/sitemap.xml`,
    `Sitemap: ${CANONICAL_BASE_URL}/sitemap-priority.xml`,
    `Sitemap: ${CANONICAL_BASE_URL}/sitemap-pages.xml`,
    `Sitemap: ${CANONICAL_BASE_URL}/sitemap-tools.xml`,
    'User-agent: Yandex',
    'Clean-param: q',
    'Clean-param: utm_source&utm_medium&utm_campaign&utm_term&utm_content&fbclid&gclid&yclid',
  ]) {
    assert(text.includes(expected), `robots.txt: missing "${expected}"`);
  }
}

async function validateIndexNowKey(): Promise<void> {
  const { response, text } = await fetchText('/u2tool2026indexnowkey.txt');
  assert(response.status === 200, `IndexNow key: expected 200, got ${response.status}`);
  assert(text.trim() === 'u2tool2026indexnowkey', 'IndexNow key: unexpected key content');
}

async function validateSitemaps(): Promise<void> {
  const [{ text: indexXml }, { text: priorityXml }, { text: pagesXml }, { text: toolsXml }] = await Promise.all([
    fetchText('/sitemap.xml'),
    fetchText('/sitemap-priority.xml'),
    fetchText('/sitemap-pages.xml'),
    fetchText('/sitemap-tools.xml'),
  ]);

  for (const [name, xml] of [
    ['sitemap index', indexXml],
    ['priority sitemap', priorityXml],
    ['pages sitemap', pagesXml],
    ['tools sitemap', toolsXml],
  ] as const) {
    assertNoLeaks(name, xml);
  }

  const indexLastmods = extractSitemapIndexLastmods(indexXml);
  const priorityLastmods = extractUrlLastmods(priorityXml);
  const pageLastmods = extractUrlLastmods(pagesXml);
  const toolLastmods = extractUrlLastmods(toolsXml);
  const today = new Date().toISOString().slice(0, 10);

  for (const values of [indexLastmods, priorityLastmods, pageLastmods, toolLastmods]) {
    assertValidLastmods([...values.values()], today);
  }

  assertExpectedLastmod(
    toolLastmods,
    `${CANONICAL_BASE_URL}/en/tools/gantt-chart-generator/`,
    resolveSitemapLastmod('/en/tools/gantt-chart-generator/', 'tools')
  );
  assertExpectedLastmod(
    toolLastmods,
    `${CANONICAL_BASE_URL}/en/tools/sql-query-optimizer/`,
    resolveSitemapLastmod('/en/tools/sql-query-optimizer/', 'tools')
  );
  assertExpectedLastmod(
    toolLastmods,
    `${CANONICAL_BASE_URL}/en/tools/uuid-generator/`,
    resolveSitemapLastmod('/en/tools/uuid-generator/', 'tools')
  );
  assertExpectedLastmod(
    pageLastmods,
    `${CANONICAL_BASE_URL}/en/ai/`,
    resolveSitemapLastmod('/en/ai/', 'ai')
  );
  assertExpectedLastmod(
    priorityLastmods,
    `${CANONICAL_BASE_URL}/en/tools/gantt-chart-generator/`,
    resolveSitemapLastmod('/en/tools/gantt-chart-generator/', 'tools')
  );

  assertExpectedLastmod(
    indexLastmods,
    `${CANONICAL_BASE_URL}/sitemap-priority.xml`,
    newestEntryLastmod(buildPrioritySitemapEntries())
  );
  assertExpectedLastmod(
    indexLastmods,
    `${CANONICAL_BASE_URL}/sitemap-pages.xml`,
    newestEntryLastmod(buildPagesSitemapEntries())
  );
  assertExpectedLastmod(
    indexLastmods,
    `${CANONICAL_BASE_URL}/sitemap-tools.xml`,
    newestEntryLastmod(buildIndexableToolsSitemapEntries())
  );

  const priorityLocs = extractLocs(priorityXml);
  const pageLocs = extractLocs(pagesXml);
  const toolLocs = extractLocs(toolsXml);
  assert(new Set(priorityLocs).size === priorityLocs.length, 'priority sitemap: duplicate URL');
  assert(new Set(pageLocs).size === pageLocs.length, 'pages sitemap: duplicate URL');
  assert(new Set(toolLocs).size === toolLocs.length, 'tools sitemap: duplicate URL');
  assert(priorityLocs.length < 50_000 && pageLocs.length < 50_000 && toolLocs.length < 50_000, 'sitemap: URL count exceeds per-file limit');
  assert(priorityLocs.includes(`${CANONICAL_BASE_URL}/en/ai/`), 'priority sitemap: missing /en/ai/');
  assert(pageLocs.includes(`${CANONICAL_BASE_URL}/en/ai/`), 'pages sitemap: missing /en/ai/');
  assert(toolLocs.includes(`${CANONICAL_BASE_URL}/en/tools/json-formatter/`), 'tools sitemap: missing JSON Formatter');
  assert([...priorityLocs, ...pageLocs, ...toolLocs].every((url) => url.startsWith(`${CANONICAL_BASE_URL}/`)), 'sitemap: non-canonical host leaked');
  assert([...priorityLocs, ...pageLocs, ...toolLocs].every((url) => !url.includes('?')), 'sitemap: query URL leaked');
}

async function validateHtml(check: HtmlCheck): Promise<void> {
  const { response, text: html } = await fetchText(check.path);
  assert(response.status === 200, `${check.name}: expected 200, got ${response.status}`);
  assert((response.headers.get('content-type') || '').includes('text/html'), `${check.name}: expected HTML`);
  assertNoLeaks(check.name, html);

  const title = getTagContent(html, 'title');
  const description = getTagContent(html, 'description');
  const canonical = getTagContent(html, 'canonical');
  const robots = getTagContent(html, 'robots');
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || '';
  const expectedCanonical = `${CANONICAL_BASE_URL}${check.canonicalPath || check.path}`;

  const maxTitleLength = check.maxTitleLength || 70;
  assert(title.length >= 10 && title.length <= maxTitleLength, `${check.name}: title length ${title.length} outside safe range`);
  assert(description.length >= 50 && description.length <= 180, `${check.name}: description length ${description.length} outside safe range`);
  assert(canonical === expectedCanonical, `${check.name}: canonical "${canonical}" does not match "${expectedCanonical}"`);
  
  if (check.isNoIndex) {
    assert(robots.includes('noindex'), `${check.name}: robots meta should be noindex`);
  } else {
    assert(robots.includes('index') && robots.includes('follow') && !robots.includes('noindex'), `${check.name}: robots meta is not indexable`);
  }
  assert(h1.length > 0, `${check.name}: missing H1`);

  const hreflangValues = Array.from(html.matchAll(/hreflang=["']([^"']+)["']/gi)).map((match) => match[1]);
  for (const locale of [...SUPPORTED_LOCALES, 'x-default']) {
    assert(hreflangValues.includes(locale), `${check.name}: missing hreflang ${locale}`);
  }

  const schemaTypes = extractJsonLdTypes(html);
  for (const type of check.requiredSchema) {
    assert(schemaTypes.includes(type), `${check.name}: missing JSON-LD type ${type}`);
  }

  for (const expected of check.requiredBody) {
    if (expected instanceof RegExp) {
      assert(expected.test(html), `${check.name}: body missing pattern ${expected.toString()}`);
    } else {
      assert(html.includes(expected), `${check.name}: body missing "${expected}"`);
    }
  }
}

async function main(): Promise<void> {
  const tasks: Array<[string, () => Promise<void>]> = [
    ['robots.txt', validateRobots],
    ['IndexNow key', validateIndexNowKey],
    ['sitemaps', validateSitemaps],
    ...htmlChecks.map((check): [string, () => Promise<void>] => [check.name, () => validateHtml(check)]),
  ];
  const failures: string[] = [];

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
    console.log(`\n${failures.length} search-engine compliance checks failed. FETCH_BASE_URL=${FETCH_BASE_URL}; CANONICAL_BASE_URL=${CANONICAL_BASE_URL}`);
    process.exitCode = 1;
    return;
  }

  console.log(`\nAll search-engine compliance checks passed. FETCH_BASE_URL=${FETCH_BASE_URL}; CANONICAL_BASE_URL=${CANONICAL_BASE_URL}`);
}

main().catch((error) => {
  console.error(`Unexpected compliance validation error: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
