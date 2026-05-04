const BASE_URL = (process.env.PROD_BASE_URL || 'https://www.u2tool.com').replace(/\/+$/, '');

interface HtmlGrowthCheck {
  name: string;
  path: string;
  requiredText: string[];
  forbiddenText?: string[];
  schemaTypes?: string[];
  expectedCacheHeader?: 'HIT_OR_MISS' | 'BYPASS';
}

const textWaveTerms = [
  'Text Tools',
  'Word Counter',
  'Case Converter',
  'Markdown Preview',
];

const htmlChecks: HtmlGrowthCheck[] = [
  {
    name: 'Homepage discovery promotes text wave',
    path: '/en/',
    requiredText: ['Text Tools', 'Word Counter', 'Choose the Right Text Tool'],
    schemaTypes: ['Organization', 'WebSite', 'ItemList'],
    expectedCacheHeader: 'HIT_OR_MISS',
  },
  {
    name: 'Tools index discovery promotes text wave',
    path: '/en/tools/',
    requiredText: ['500+ Free Online Tools', ...textWaveTerms, 'Choose the Right Text Tool'],
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage', 'ItemList'],
    expectedCacheHeader: 'HIT_OR_MISS',
  },
  {
    name: 'Tools search preserves SSR text result contract',
    path: '/en/tools/?q=word',
    requiredText: ['500+ Free Online Tools', 'Word Counter', 'https://www.u2tool.com/en/tools/word-counter/'],
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage', 'ItemList'],
    expectedCacheHeader: 'BYPASS',
  },
  {
    name: 'AI discovery page promotes text wave',
    path: '/en/ai/',
    requiredText: ['Text Tools', 'Word Counter', 'Choose the Right Text Tool'],
    schemaTypes: ['Organization', 'WebSite'],
  },
  {
    name: 'Text category renders representative support surface',
    path: '/en/categories/text/',
    requiredText: ['Text Tools', 'Word Counter', 'Case Converter', 'Markdown Preview'],
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage', 'BreadcrumbList'],
  },
  {
    name: 'Text comparison guide keeps intent boundaries',
    path: '/en/compare/choose-text-tool/',
    requiredText: ['Choose the Right Text Tool', 'Word Counter', 'Text Statistics', 'Diff Checker'],
    forbiddenText: ['Choose the Right JSON Tool', 'JWT Decoder'],
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage', 'BreadcrumbList'],
  },
];

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

function assertCanonicalHtml(path: string, html: string): void {
  assert(!html.includes('${BASE_URL}'), `${path}: unresolved BASE_URL placeholder leaked`);
  assert(!html.includes('MISSING:'), `${path}: missing translation placeholder leaked`);
  assert(!html.includes('/tools/word-counter"'), `${path}: non-canonical word-counter URL without trailing slash leaked`);
  assert(!html.includes('/compare/choose-text-tool"'), `${path}: non-canonical choose-text-tool URL without trailing slash leaked`);
}

async function validateHtmlCheck(check: HtmlGrowthCheck): Promise<void> {
  const response = await fetchWithRetry(`${BASE_URL}${check.path}`, { redirect: 'follow' });
  assert(response.status === 200, `${check.name}: expected HTTP 200, got ${response.status}`);
  assert((response.headers.get('content-type') || '').includes('text/html'), `${check.name}: response is not HTML`);

  const cacheHeader = response.headers.get('x-u2tool-html-cache') || '';
  if (check.expectedCacheHeader === 'HIT_OR_MISS') {
    assert(['HIT', 'MISS'].includes(cacheHeader), `${check.name}: expected HTML cache HIT/MISS, got "${cacheHeader || '(none)'}"`);
  }
  if (check.expectedCacheHeader === 'BYPASS') {
    assert(cacheHeader === 'BYPASS', `${check.name}: expected HTML cache BYPASS, got "${cacheHeader || '(none)'}"`);
  }

  const html = await response.text();
  assertCanonicalHtml(check.path, html);

  for (const required of check.requiredText) {
    assert(html.includes(required), `${check.name}: body missing "${required}"`);
  }

  for (const forbidden of check.forbiddenText || []) {
    assert(!html.includes(forbidden), `${check.name}: body contains off-intent text "${forbidden}"`);
  }

  const schemaTypes = extractJsonLdTypes(html);
  for (const schemaType of check.schemaTypes || []) {
    assert(schemaTypes.includes(schemaType), `${check.name}: missing JSON-LD type ${schemaType}`);
  }
}

async function validateLlmsExport(): Promise<void> {
  const response = await fetchWithRetry(`${BASE_URL}/llms.txt`, { redirect: 'follow' });
  assert(response.status === 200, `llms.txt: expected HTTP 200, got ${response.status}`);
  assert((response.headers.get('content-type') || '').includes('text/plain'), `llms.txt: unexpected content-type "${response.headers.get('content-type') || ''}"`);

  const text = await response.text();
  for (const required of [
    '## Priority Discovery Routes',
    '**Text Tools**: https://www.u2tool.com/en/categories/text/',
    '**Choose the Right Text Tool**: https://www.u2tool.com/en/compare/choose-text-tool/',
    'Word Counter',
    'Case Converter',
    'Markdown Preview',
  ]) {
    assert(text.includes(required), `llms.txt: missing "${required}"`);
  }
  assert(!text.includes('${BASE_URL}'), 'llms.txt: unresolved BASE_URL placeholder leaked');
  assert(!text.includes('MISSING:'), 'llms.txt: missing translation placeholder leaked');
}

async function validateToolsIndexExport(): Promise<void> {
  const response = await fetchWithRetry(`${BASE_URL}/en/tools-index.json`, { redirect: 'follow' });
  assert(response.status === 200, `tools-index: expected HTTP 200, got ${response.status}`);
  assert((response.headers.get('content-type') || '').includes('application/json'), `tools-index: unexpected content-type "${response.headers.get('content-type') || ''}"`);

  const toolsIndex = (await response.json()) as Array<{
    category?: string;
    categoryHref?: string;
    categoryName?: string;
    description?: string;
    href?: string;
    name?: string;
    slug?: string;
  }>;

  assert(Array.isArray(toolsIndex) && toolsIndex.length > 100, `tools-index: unexpectedly small export (${toolsIndex.length})`);
  assert(toolsIndex[0]?.category === 'text', `tools-index: first promoted category should be text, got "${toolsIndex[0]?.category || '(none)'}"`);

  const requiredTextTools = ['word-counter', 'case-converter', 'markdown-preview'];
  for (const slug of requiredTextTools) {
    const entry = toolsIndex.find((tool) => tool.slug === slug);
    assert(entry, `tools-index: missing ${slug}`);
    assert(entry?.category === 'text', `tools-index: ${slug} category drifted to "${entry?.category || '(none)'}"`);
    assert(entry?.href === `/en/tools/${slug}/`, `tools-index: ${slug} non-canonical href "${entry?.href || '(none)'}"`);
    assert(entry?.categoryHref === '/en/categories/text/', `tools-index: ${slug} non-canonical category href "${entry?.categoryHref || '(none)'}"`);
    assert(Boolean(entry?.name && entry.description), `tools-index: ${slug} missing localized name or description`);
  }
}

async function main(): Promise<void> {
  const failures: string[] = [];
  const tasks: Array<[string, () => Promise<void>]> = [
    ...htmlChecks.map((check): [string, () => Promise<void>] => [check.name, () => validateHtmlCheck(check)]),
    ['llms.txt text-wave export', validateLlmsExport],
    ['tools-index text-wave export', validateToolsIndexExport],
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
    console.log(`\n${failures.length} growth surface checks failed. BASE_URL=${BASE_URL}`);
    process.exitCode = 1;
    return;
  }

  console.log(`\nAll growth surface checks passed. BASE_URL=${BASE_URL}`);
}

main().catch((error) => {
  console.error(`Unexpected growth surface validation error: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
