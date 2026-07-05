import { buildLlmsContent } from '../../src/lib/llms-content';
import { locales } from '../../src/lib/i18n';
import * as fs from 'node:fs/promises';
import path from 'node:path';

function assert(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function extractCanonicalRouteViolations(text: string): string[] {
  const urls = text.match(/https:\/\/www\.u2tool\.com\/[^\s)]+/g) || [];
  const violations: string[] = [];

  for (const rawValue of urls) {
    const value = rawValue.replace(/[,.]+$/, '');
    let url: URL;

    try {
      url = new URL(value);
    } catch {
      violations.push(value);
      continue;
    }

    // Only inspect tools, categories, compare routes
    if (!url.pathname.match(/^\/[a-z]{2}\/(?:tools|categories|compare)\//)) {
      continue;
    }

    if (!url.pathname.endsWith('/')) {
      violations.push(value);
    }
  }

  return violations;
}

const gscRecoveryFragments = [
  '/de/tools/text-to-handwriting/',
  '/ru/tools/hex-editor/',
  '/ko/tools/html-preview/',
  '/en/tools/hex-editor/',
  '/ko/tools/unicode-converter/',
  '/ru/tools/html-preview/',
  '/fr/tools/file-size-calculator/',
  '/en/tools/ical-parser/',
  '/es/tools/html-preview/',
  '/ru/tools/barcode-generator/',
  '/en/tools/morse-code-player/',
  '/en/tools/gantt-chart-generator/',
  '/en/tools/iban-validator/',
  '/en/tools/sitemap-generator/',
  '/en/tools/compound-interest-calculator/',
  '/es/tools/word-counter/',
  '/es/tools/document-word-counter/',
  '/en/tools/passport-photo-maker/',
  '/en/tools/csv-to-vcard-converter/',
  '/en/tools/vcard-to-csv-converter/',
];

async function validateCompact(text: string, isZh = false): Promise<void> {
  // Check basic structure
  if (isZh) {
    assert(text.includes('# U2Tool - 免费在线工具大全'), 'Chinese compact version missing title');
    assert(text.includes('## 全量发现字典'), 'Chinese compact version missing full catalog section');
    assert(text.includes('/llms-full.txt'), 'Chinese compact version missing full catalog link');
    assert(text.includes('## 常见问题 (FAQ)'), 'Chinese compact version missing FAQ section');
    assert(text.includes('完全免费，无需注册'), 'Chinese compact version missing free cost statement');
  } else {
    assert(text.includes('# U2Tool - Free Online Tools Catalog'), 'English compact version missing title');
    assert(text.includes('## Full Catalog Discovery'), 'English compact version missing full catalog section');
    assert(text.includes('/llms-full.txt'), 'English compact version missing full catalog link');
    assert(text.includes('## Frequently Asked Questions'), 'English compact version missing FAQ section');
  }

  // Ensure it is truly compact (no long tool lists expanded in categories)
  const lines = text.split('\n');
  assert(lines.length < 350, `Compact version is too large: ${lines.length} lines. Category tools list might have been incorrectly expanded.`);
}

async function validateFull(text: string, isZh = false): Promise<void> {
  if (isZh) {
    assert(text.includes('# U2Tool - 免费在线工具大全'), 'Chinese full version missing title');
  } else {
    assert(text.includes('# U2Tool - Free Online Tools Catalog'), 'English full version missing title');
  }

  // Count tools mentioned in catalog to verify all 500+ tools are rendered
  const toolsCountInDoc = (text.match(/\/tools\/[a-zA-Z0-9-]+\//g) || []).length;
  // There are over 500 tools. The full list must include them.
  assert(toolsCountInDoc > 450, `Full catalog version missing long-tail tools. Found only ${toolsCountInDoc} tools, expected > 450.`);

  // Ensure it has catalog by category details
  if (isZh) {
    assert(text.includes('## 工具分类目录'), 'Chinese full version missing category title');
  } else {
    assert(text.includes('## Catalog by Category'), 'English full version missing category title');
  }
}

function validateGscRecoveryCoverage(fullDocs: Array<{ name: string; doc: string }>): void {
  for (const fragment of gscRecoveryFragments) {
    const matchingDocs = fullDocs.filter((item) => item.doc.includes(fragment)).map((item) => item.name);
    assert(
      matchingDocs.length > 0,
      `GSC recovery route missing from full LLM discovery catalogs: ${fragment}`
    );
  }
}

import { tools, categories } from '../../src/config/tools';

async function checkRouteValidity(doc: string, docName: string): Promise<void> {
  const urls = doc.match(/https:\/\/www\.u2tool\.com\/[^\s)]+/g) || [];
  const validToolSlugs = new Set(tools.map(t => t.slug));
  const validCategories = new Set(categories.map(c => c.id));
  const checkedPaths = new Set<string>();

  for (const rawUrl of urls) {
    const value = rawUrl.replace(/[,.]+$/, '');
    let url: URL;
    try {
      url = new URL(value);
    } catch {
      continue;
    }
    
    if (!url.pathname.match(/^\/[a-z]{2}\//)) continue;
    if (checkedPaths.has(url.pathname)) continue;
    checkedPaths.add(url.pathname);
    
    // Extract route pattern
    const toolMatch = url.pathname.match(/^\/[a-z]{2}\/tools\/([^/]+)\/$/);
    if (toolMatch) {
      const slug = toolMatch[1];
      if (slug === '%3Ctool-slug%3E') continue;
      if (!validToolSlugs.has(slug)) {
        throw new Error(`[${docName}] Route validation failed: Tool slug "${slug}" listed in llms.txt is not a valid tool.`);
      }
      continue;
    }

    const categoryMatch = url.pathname.match(/^\/[a-z]{2}\/categories\/([^/]+)\/$/);
    if (categoryMatch) {
      const cat = categoryMatch[1];
      if (cat === '%3Ccategory-slug%3E') continue;
      if (!validCategories.has(cat)) {
        throw new Error(`[${docName}] Route validation failed: Category "${cat}" listed in llms.txt is not a valid category.`);
      }
      continue;
    }
  }
}

async function main(): Promise<void> {
  console.log('🏁 Starting LLM discovery layer compilation & validation...');

  const mockUrl = new URL('https://www.u2tool.com/llms.txt');

  // 1. Compile 4 targets
  const enCompact = await buildLlmsContent('en', mockUrl, { isFull: false });
  const enFull = await buildLlmsContent('en', mockUrl, { isFull: true });
  const zhCompact = await buildLlmsContent('zh', mockUrl, { isFull: false });
  const zhFull = await buildLlmsContent('zh', mockUrl, { isFull: true });

  // 2. Format & Integrity Audit
  const documents = [
    { name: 'enCompact', doc: enCompact },
    { name: 'enFull', doc: enFull },
    { name: 'zhCompact', doc: zhCompact },
    { name: 'zhFull', doc: zhFull },
  ];
  for (const item of documents) {
    const doc = item.doc;
    assert(!doc.includes('undefined'), 'LLM discovery file contains "undefined" text.');
    assert(!doc.includes('[object Object]'), 'LLM discovery file contains unrendered objects.');
    assert(!doc.includes('${BASE_URL}'), 'LLM discovery file contains unreplaced placeholders.');
    assert(!doc.includes('MISSING:'), 'LLM discovery file contains missing translation keys.');
    assert(!doc.includes('Static Astro site'), 'LLM discovery file contains outdated rendering info.');
    
    // Check for trailing slashes
    const violations = extractCanonicalRouteViolations(doc);
    assert(violations.length === 0, `Discovery file contains non-canonical URLs without trailing slash: ${violations.slice(0, 5).join(', ')}`);
    
    // Check route validity
    await checkRouteValidity(doc, item.name);
    
    // Check byte size to stay within search retrieval limits (500KB)
    const byteSize = Buffer.byteLength(doc, 'utf8');
    assert(byteSize < 500 * 1024, `[${item.name}] Discovery file is too large: ${Math.round(byteSize / 1024)}KB (limit 500KB).`);
  }

  // 3. Compact / Full specific checks
  console.log('🔍 Auditing English compact discovery node...');
  await validateCompact(enCompact, false);

  console.log('🔍 Auditing English full discovery catalog...');
  await validateFull(enFull, false);

  console.log('🔍 Auditing Chinese compact discovery node...');
  await validateCompact(zhCompact, true);

  console.log('🔍 Auditing Chinese full discovery catalog...');
  await validateFull(zhFull, true);

  console.log('🔍 Auditing GSC recovery route coverage...');
  validateGscRecoveryCoverage([
    { name: 'enFull', doc: enFull },
    { name: 'zhFull', doc: zhFull },
  ]);

  console.log('✅ All LLM discovery layer compilation & validation checks passed successfully (Local Simulation Mode)!');
}

main().catch((error) => {
  console.error(`LLMS discovery validation failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
