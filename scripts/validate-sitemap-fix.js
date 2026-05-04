#!/usr/bin/env node

/**
 * Validates the built sitemap and robots assets from dist/.
 * Run this after `npm run build`.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.join(__dirname, '..');
const distDir = path.join(repoRoot, 'dist');

const SITE_URL = 'https://www.u2tool.com';
const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const CATEGORIES = ['text', 'encoding', 'generators', 'converters', 'development', 'security', 'network', 'image', 'math', 'charts', 'office', 'lifestyle', 'finance', 'fun'];
const COMPARISON_SLUGS = [
  'choose-text-tool',
  'choose-jwt-tool',
  'choose-chart-type',
  'choose-json-tool',
  'choose-image-tool',
  'meta-tags-vs-open-graph-vs-twitter-cards',
];
const PRIORITY_TOOL_SLUGS = [
  'json-formatter',
  'base64',
  'url-encoder',
  'xml-formatter',
  'uuid-generator',
  'password-generator',
  'hash-generator',
  'qr-generator',
  'word-counter',
  'regex-tester',
  'sql-formatter',
  'json-to-typescript',
  'markdown-to-html',
  'image-compressor',
  'image-converter',
  'favicon-generator',
  'gitignore-generator',
  'meta-tag-generator',
  'robots-txt-generator',
  'sitemap-generator',
  'ssl-checker',
  'cidr-calculator',
  'timezone-converter',
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readDistFile(fileName) {
  const filePath = path.join(distDir, fileName);
  assert(fs.existsSync(filePath), `Missing built asset: dist/${fileName}. Run npm run build first.`);
  return fs.readFileSync(filePath, 'utf8');
}

function extractLocs(xml) {
  return Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map((match) => match[1]);
}

function extractTagCount(xml, tagName) {
  return Array.from(xml.matchAll(new RegExp(`<${tagName}(\\s|>)`, 'g'))).length;
}

function buildMinimumPriorityCount(prioritySitemap) {
  const aiCount = prioritySitemap.includes(`${SITE_URL}/en/ai`) ? 1 : 0;
  const perLocale = 1 + 1 + 1 + aiCount + CATEGORIES.length + COMPARISON_SLUGS.length + PRIORITY_TOOL_SLUGS.length;
  return perLocale * LOCALES.length;
}

function main() {
  console.log('=== Sitemap Validation ===\n');

  const sitemapIndex = readDistFile('sitemap.xml');
  const sitemapPriority = readDistFile('sitemap-priority.xml');
  const sitemapPages = readDistFile('sitemap-pages.xml');
  const sitemapTools = readDistFile('sitemap-tools.xml');
  const robotsTxt = readDistFile('robots.txt');

  assert(sitemapIndex.includes('<sitemapindex'), 'sitemap.xml must be a sitemap index.');
  const indexLocs = extractLocs(sitemapIndex);
  const expectedChildSitemaps = [
    `${SITE_URL}/sitemap-priority.xml`,
    `${SITE_URL}/sitemap-pages.xml`,
    `${SITE_URL}/sitemap-tools.xml`,
  ];
  assert(indexLocs.length === expectedChildSitemaps.length, `sitemap.xml should reference ${expectedChildSitemaps.length} child sitemaps.`);
  for (const childSitemap of expectedChildSitemaps) {
    assert(indexLocs.includes(childSitemap), `sitemap.xml is missing child sitemap: ${childSitemap}`);
  }
  console.log(`sitemap.xml OK (${indexLocs.length} child sitemaps)`);

  assert(sitemapPriority.includes('<urlset'), 'sitemap-priority.xml must be a urlset sitemap.');
  const priorityLocs = extractLocs(sitemapPriority);
  const minimumPriorityCount = buildMinimumPriorityCount(sitemapPriority);
  assert(priorityLocs.length >= minimumPriorityCount, `sitemap-priority.xml URL count is too low: expected at least ${minimumPriorityCount}, got ${priorityLocs.length}.`);
  assert(new Set(priorityLocs).size === priorityLocs.length, 'sitemap-priority.xml must not contain duplicate URLs.');
  assert(priorityLocs.includes(`${SITE_URL}/en/ai/`), 'sitemap-priority.xml must include /en/ai/.');
  assert(priorityLocs.includes(`${SITE_URL}/en/tools/json-formatter/`), 'sitemap-priority.xml must include /en/tools/json-formatter/.');
  assert(priorityLocs.includes(`${SITE_URL}/zh/tools/json-formatter/`), 'sitemap-priority.xml must include /zh/tools/json-formatter/.');
  console.log(`sitemap-priority.xml OK (${priorityLocs.length} URLs)`);

  assert(sitemapPages.includes('<urlset'), 'sitemap-pages.xml must be a urlset sitemap.');
  const pageLocs = extractLocs(sitemapPages);
  assert(pageLocs.includes(`${SITE_URL}/en/`), 'sitemap-pages.xml must include /en/.');
  assert(pageLocs.includes(`${SITE_URL}/en/ai/`), 'sitemap-pages.xml must include /en/ai/.');
  assert(pageLocs.includes(`${SITE_URL}/en/compare/`), 'sitemap-pages.xml must include /en/compare/.');
  assert(pageLocs.includes(`${SITE_URL}/en/categories/development/`), 'sitemap-pages.xml must include /en/categories/development/.');
  console.log(`sitemap-pages.xml OK (${pageLocs.length} URLs)`);

  assert(sitemapTools.includes('<urlset'), 'sitemap-tools.xml must be a urlset sitemap.');
  const toolLocs = extractLocs(sitemapTools);
  assert(toolLocs.includes(`${SITE_URL}/en/tools/json-formatter/`), 'sitemap-tools.xml must include /en/tools/json-formatter/.');
  assert(toolLocs.includes(`${SITE_URL}/zh/tools/json-formatter/`), 'sitemap-tools.xml must include /zh/tools/json-formatter/.');
  console.log(`sitemap-tools.xml OK (${toolLocs.length} URLs)`);

  const toolsOverlapWithPages = toolLocs.filter((url) => pageLocs.includes(url));
  assert(toolsOverlapWithPages.length === 0, 'sitemap-pages.xml and sitemap-tools.xml must not overlap.');
  console.log('Page/tool sitemap overlap OK');

  assert(robotsTxt.includes(`Sitemap: ${SITE_URL}/sitemap.xml`), 'robots.txt must reference sitemap.xml.');
  assert(robotsTxt.includes(`Sitemap: ${SITE_URL}/sitemap-priority.xml`), 'robots.txt must reference sitemap-priority.xml.');
  assert(robotsTxt.includes(`Sitemap: ${SITE_URL}/sitemap-pages.xml`), 'robots.txt must reference sitemap-pages.xml.');
  assert(robotsTxt.includes(`Sitemap: ${SITE_URL}/sitemap-tools.xml`), 'robots.txt must reference sitemap-tools.xml.');
  console.log('robots.txt OK');

  const priorityTagCount = extractTagCount(sitemapPriority, 'url');
  assert(priorityTagCount === priorityLocs.length, 'sitemap-priority.xml should contain one <url> per <loc>.');
  console.log('\nAll sitemap checks passed.');
}

try {
  main();
} catch (error) {
  console.error(`Validation failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
