import * as cheerio from 'cheerio';
import { tools } from '../../src/config/tools/index';
import { locales } from '../../src/lib/i18n';
import { INDEX_SUPPRESSION } from '../../src/config/index-suppression.generated';
import { buildLocalizedAlternates } from '../../src/lib/seo';
import { getIndexableToolLocales } from '../../src/lib/tool-indexability';
import { loadToolPageMessages } from '../../src/lib/translations';
import type { Locale } from '../../src/lib/i18n';

// Intentionally local: release gating must verify the build about to ship.
const base = new URL(process.env.FETCH_BASE_URL ?? 'http://127.0.0.1:4327');
if (!['localhost', '127.0.0.1', '[::1]'].includes(base.hostname)) throw new Error('Recovery release gate requires local SSR preview.');
const canonical = 'https://www.u2tool.com';
const keys = ['zh/hex-editor', 'zh/color-picker', 'zh/timezone-converter', 'zh/wordcloud-generator',
  'zh/encoding-detector', 'zh/graph-chart-generator', 'zh/note-pad', 'zh/byte-counter', 'zh/curl-converter',
  'en/curl-converter', 'ko/unicode-converter', 'es/ip-validator', 'es/character-map', 'ar/ip-lookup',
  'fr/image-frosted-glass', 'ja/encoding-detector', 'en/encoding-detector', 'en/sql-injection-tester'];
const failures: string[] = [];
const route = (key: string) => `/${key.replace('/', '/tools/')}/`;
const toolSlugs = new Set(tools.map(tool => tool.slug));
type Alternate = { hreflang: string; href: string };
const normalizeAlternates = (values: Alternate[]) => values.map(value => `${value.hreflang}|${value.href}`).sort();
function assertAlternates(actual: Alternate[], expected: Alternate[], label: string) {
  if (JSON.stringify(normalizeAlternates(actual)) !== JSON.stringify(normalizeAlternates(expected))) {
    throw new Error(`${label}: alternate set differs from eligible variants (actual=${actual.length}, expected=${expected.length})`);
  }
}
function expectedAlternates(key: string): Alternate[] {
  if (INDEX_SUPPRESSION[key]) return [];
  const slug = key.split('/')[1];
  return buildLocalizedAlternates(canonical, `/tools/${slug}`, getIndexableToolLocales(slug));
}
// Fetch every eligible sibling of the recovery cohort, so reciprocity is checked
// against real HTML rather than inferred from one page or from source code.
const cohort = new Set(keys);
for (const key of keys) {
  const slug = key.split('/')[1];
  for (const locale of getIndexableToolLocales(slug)) cohort.add(`${locale}/${slug}`);
}
const fullySuppressed = tools.find(tool => getIndexableToolLocales(tool.slug).length === 0);
if (fullySuppressed) cohort.add(`en/${fullySuppressed.slug}`);
async function read(routePath: string) {
  const response = await fetch(new URL(routePath, base), { redirect: 'manual', signal: AbortSignal.timeout(30_000) });
  if (response.status !== 200) throw new Error(`${routePath}: HTTP ${response.status}`);
  return { body: await response.text(), robots: response.headers.get('x-robots-tag') ?? '' };
}
let sitemap: Set<string> | null = null;
try {
  const { body } = await read('/sitemap-tools.xml');
  const $ = cheerio.load(body, { xmlMode: true });
  const listedUrls = $('url > loc').map((_, el) => $(el).text()).get();
  sitemap = new Set(listedUrls);
  const expected = new Set(locales.flatMap(locale => tools.filter(tool => !INDEX_SUPPRESSION[`${locale}/${tool.slug}`])
    .map(tool => `${canonical}${route(`${locale}/${tool.slug}`)}`)));
  if (listedUrls.length !== sitemap.size || sitemap.size !== expected.size || [...expected].some(url => !sitemap!.has(url))) throw new Error('sitemap differs from approved index states');
  $('url').each((_, el) => {
    const url = $(el).find('loc').text();
    const match = new URL(url).pathname.match(/^\/([a-z]{2})\/tools\/([^/]+)\/$/)!;
    const actual = $(el).find('[hreflang]').map((_, link) => ({ hreflang: $(link).attr('hreflang')!, href: $(link).attr('href')! })).get();
    assertAlternates(actual, expectedAlternates(`${match[1]}/${match[2]}`), url);
  });
  console.log(`PASS sitemap: ${sitemap.size} approved URLs and their alternate sets`);
} catch (error) { failures.push(String(error)); }

try {
  const { body } = await read('/sitemap-priority.xml');
  const $ = cheerio.load(body, { xmlMode: true });
  let checked = 0;
  $('url').each((_, el) => {
    const url = $(el).find('loc').text();
    const match = new URL(url).pathname.match(/^\/([a-z]{2})\/tools\/([^/]+)\/$/);
    if (!match || !toolSlugs.has(match[2])) return;
    const key = `${match[1]}/${match[2]}`;
    if (INDEX_SUPPRESSION[key]) throw new Error(`Priority sitemap contains suppressed URL: ${url}`);
    const actual = $(el).find('[hreflang]').map((_, link) => ({ hreflang: $(link).attr('hreflang')!, href: $(link).attr('href')! })).get();
    assertAlternates(actual, expectedAlternates(key), url);
    checked++;
  });
  console.log(`PASS priority sitemap: ${checked} tool alternate sets`);
} catch (error) { failures.push(String(error)); }

for (const key of cohort) {
  try {
    const { body, robots } = await read(route(key));
    const $ = cheerio.load(body);
    const noindex = /noindex/i.test(`${robots} ${$('meta[name="robots"]').attr('content') ?? ''}`);
    const [locale, slug] = key.split('/');
    const messages = await loadToolPageMessages(locale as Locale, slug);
    // Independent expected text: do not use the formatter under test here.
    const authored = String(messages.seo_description || messages.description || messages.name || slug).replace(/\s+/g, ' ').trim();
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
      if ($(selector).attr('content') !== authored) throw new Error(`${selector}: authored description padded or truncated`);
    }
    if (noindex !== !!INDEX_SUPPRESSION[key]) throw new Error('robots differs from approved state');
    if ($('link[rel="canonical"]').attr('href') !== canonical + route(key)) throw new Error('canonical is not self-referencing');
    if (sitemap && sitemap.has(canonical + route(key)) === noindex) throw new Error('sitemap/robots contradiction');
    const actual = $('head link[rel="alternate"][hreflang]').map((_, el) => ({ hreflang: $(el).attr('hreflang')!, href: $(el).attr('href')! })).get();
    assertAlternates(actual, expectedAlternates(key), key);
    if (!$('h1').text().trim() || /MISSING: tools\./.test($('body').text())) throw new Error('missing rendered content');
    const text = $('body').text();
    if (key === 'en/sql-injection-tester' && (!text.includes('regular expressions') || $('title').text().includes('Security Scanner'))) throw new Error('SQL capability copy regression');
    if (key === 'fr/image-frosted-glass' && !text.includes('0 à 50')) throw new Error('French capability copy missing');
    if (key === 'ja/encoding-detector' && !text.includes('元の文字コード')) throw new Error('Japanese capability copy missing');
    console.log(`PASS ${key}: 200, canonical, robots, reciprocal alternates, content`);
  } catch (error) { failures.push(`${key}: ${String(error)}`); }
}
// Shared-component controls: ordinary pages keep ten locales; published AI
// comparison pages keep their existing two-language contract.
const controls = ['/en/', '/en/tools/', '/en/categories/text/', '/en/ai/models/', '/zh/ai/models/openai-vs-claude-api-cost/'];
for (const control of controls) {
  try {
    const { body, robots } = await read(control);
    const $ = cheerio.load(body);
    if (/noindex/i.test(`${robots} ${$('meta[name="robots"]').attr('content') ?? ''}`)) throw new Error('control unexpectedly noindex');
    if ($('link[rel="canonical"]').attr('href') !== canonical + control) throw new Error('control canonical changed');
    const actual = $('head link[rel="alternate"][hreflang]').map((_, el) => ({ hreflang: $(el).attr('hreflang')!, href: $(el).attr('href')! })).get();
    const expected = buildLocalizedAlternates(canonical, control.replace(/^\/[a-z]{2}/, '') || '/',
      control.includes('/ai/models/') ? ['en', 'zh'] : locales);
    assertAlternates(actual, expected, control);
    console.log(`PASS control ${control}: canonical, robots, existing language set`);
  } catch (error) { failures.push(`${control}: ${String(error)}`); }
}
// Unknown tool URLs must terminate at a real 404, not redirect to the catalog.
const missingTools = ['/en/tools/does-not-exist-seo-audit/', '/zh/tools/does-not-exist-seo-audit/',
  '/xx/tools/json-formatter/', '/en/tools/does-not-exist-seo-audit/?category=math'];
for (const pathname of missingTools) {
  for (const method of ['GET', 'HEAD']) {
    try {
      const response = await fetch(new URL(pathname, base), { method, redirect: 'manual', signal: AbortSignal.timeout(30_000) });
      if (response.status !== 404 || response.headers.has('location')) throw new Error(`expected terminal 404, got ${response.status}`);
      if (!/noindex/.test(response.headers.get('x-robots-tag') ?? '')) throw new Error('missing noindex response header');
      const body = await response.text();
      if (method === 'HEAD' && body !== '') throw new Error('HEAD has a body');
      if (method === 'GET' && !body.includes('Page Not Found')) throw new Error('missing user-facing 404 page');
      console.log(`PASS ${method} ${pathname}: terminal 404`);
    } catch (error) { failures.push(`${method} ${pathname}: ${String(error)}`); }
  }
}
const parameterControls = [
  '/en/tools/json-formatter/?utm_source=seo-audit',
  '/en/tools/json-formatter/?q=test',
  '/en/tools/json-formatter/?category=math',
  '/en/tools/?q=json',
  '/en/tools/?category=does-not-exist-seo-audit',
  '/en/tools/encoding-detector/?utm_source=seo-audit',
];
for (const pathname of parameterControls) {
  try {
    const { body, robots } = await read(pathname);
    const $ = cheerio.load(body);
    if (!/noindex/.test(`${robots} ${$('meta[name="robots"]').attr('content') ?? ''}`)) throw new Error('existing query noindex policy changed');
    if ($('link[rel="canonical"]').attr('href') !== canonical + new URL(pathname, base).pathname) throw new Error('query canonical differs from clean URL');
    if (pathname.includes('/json-formatter/') && !$('title').text().includes('JSON')) throw new Error('tool content replaced by category');
    console.log(`PASS ${pathname}: original page, query noindex, clean canonical`);
  } catch (error) { failures.push(`${pathname}: ${String(error)}`); }
}
const redirectControls = [
  ['/en/tools/?category=math&utm_source=seo-audit', '/en/categories/math/?utm_source=seo-audit'],
  ['/zh/tools?category=encoding', '/zh/categories/encoding/'],
  ['/tools/json-formatter/?category=math&utm_source=seo-audit', '/en/tools/json-formatter/?category=math&utm_source=seo-audit'],
  ['/en/tools/json-formatter', '/en/tools/json-formatter/'],
  ['/typing-test', '/en/tools/typing-speed-test/'],
  // The full route pipeline localizes this legacy URL before returning 410.
  ['/tools/world-cup-simulator/', '/en/tools/world-cup-simulator/'],
];
for (const [pathname, target] of redirectControls) {
  try {
    const response = await fetch(new URL(pathname, base), { redirect: 'manual', signal: AbortSignal.timeout(30_000) });
    const location = response.headers.get('location');
    const destination = location ? new URL(location, base) : null;
    if (response.status !== 301 || !destination || destination.pathname + destination.search !== target) {
      throw new Error(`expected 301 to ${target}, got ${response.status} ${location}`);
    }
    console.log(`PASS redirect ${pathname}: approved target retained`);
  } catch (error) { failures.push(`${pathname}: ${String(error)}`); }
}
for (const pathname of ['/en/tools/world-cup-simulator/', '/en/tools/compare/url-parser/dns-lookup']) {
  try {
    const response = await fetch(new URL(pathname, base), { redirect: 'manual', signal: AbortSignal.timeout(30_000) });
    if (response.status !== 410 || !/noindex/.test(response.headers.get('x-robots-tag') ?? '')) throw new Error(`expected existing 410/noindex, got ${response.status}`);
    console.log(`PASS gone ${pathname}: existing 410 retained`);
  } catch (error) { failures.push(`${pathname}: ${String(error)}`); }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else console.log(`Recovery rendered gate passed: ${cohort.size} tool URLs, ${controls.length} shared-component controls, ${missingTools.length * 2} missing-route requests, ${parameterControls.length} parameter pages, ${redirectControls.length} redirects and 2 gone routes`);
