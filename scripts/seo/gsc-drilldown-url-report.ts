import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const SUPPORTED_LOCALES = new Set(['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar']);
const CANONICAL_HOST = 'www.u2tool.com';

interface Args {
  inputDir?: string;
  files?: string;
  output?: string;
}

interface DrilldownRow {
  issue: string;
  filePath: string;
  url: string;
}

interface ClassifiedUrl extends DrilldownRow {
  hostBucket: string;
  locale: string;
  pageBucket: string;
  signalBucket: string;
  recommendedAction: string;
}

function parseArgs(argv: string[]): Args {
  const args: Args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    if (!current.startsWith('--')) {
      continue;
    }

    const key = current.slice(2).replace(/-([a-z])/g, (_, char) => char.toUpperCase()) as keyof Args;
    if (next && !next.startsWith('--')) {
      args[key] = next;
      index += 1;
    }
  }

  return args;
}

function printUsage(): never {
  console.error(
    [
      'Usage:',
      '  npm run report:gsc-drilldown -- \\',
      '    --input-dir exports/gsc/coverage-drilldowns \\',
      '    --output docs/GSC_DRILLDOWN_URL_REPORT.md',
      '',
      'Or provide comma-separated files:',
      '  npm run report:gsc-drilldown -- \\',
      '    --files exports/crawled-not-indexed.csv,exports/google-selected-canonical.csv \\',
      '    --output docs/GSC_DRILLDOWN_URL_REPORT.md',
    ].join('\n')
  );
  process.exit(1);
}

function resolveInputFiles(args: Args): string[] {
  if (args.files) {
    return args.files
      .split(',')
      .map((item) => path.resolve(item.trim()))
      .filter(Boolean);
  }

  if (!args.inputDir) {
    printUsage();
  }

  const inputDir = path.resolve(args.inputDir);
  if (!fs.existsSync(inputDir)) {
    throw new Error(`Input directory not found: ${inputDir}`);
  }

  return fs
    .readdirSync(inputDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.csv$/i.test(entry.name))
    .map((entry) => path.join(inputDir, entry.name))
    .sort();
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === ',' && !quoted) {
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function readCsv(filePath: string): string[][] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV not found: ${filePath}`);
  }

  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').trim();
  if (!text) {
    return [];
  }

  return text.split(/\r?\n/).map(parseCsvLine);
}

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[()%]/g, '');
}

function inferIssueFromFilename(filePath: string): string {
  return path
    .basename(filePath, path.extname(filePath))
    .replace(/[-_]+/g, ' ')
    .trim();
}

function looksLikeUrl(value: string): boolean {
  return /^https?:\/\//i.test(value) || value.startsWith('/');
}

function findUrlColumn(headers: string[], rows: string[][]): number {
  const normalized = headers.map(normalizeHeader);
  const preferred = ['url', 'page', 'pages', '网页', '网址', '页面', 'affectedpages', 'affectedurl'];
  const preferredIndex = normalized.findIndex((header) => preferred.includes(header));
  if (preferredIndex >= 0) {
    return preferredIndex;
  }

  const sampleRows = rows.slice(0, 20);
  const scores = headers.map((_, columnIndex) =>
    sampleRows.filter((row) => looksLikeUrl(row[columnIndex] || '')).length
  );
  const bestScore = Math.max(...scores);
  if (bestScore > 0) {
    return scores.indexOf(bestScore);
  }

  return 0;
}

function readDrilldownRows(filePath: string): DrilldownRow[] {
  const csv = readCsv(filePath);
  if (csv.length < 2) {
    return [];
  }

  const [headers, ...rows] = csv;
  const urlColumn = findUrlColumn(headers, rows);
  const issue = inferIssueFromFilename(filePath);

  return rows
    .map((row) => String(row[urlColumn] || '').trim())
    .filter((url) => looksLikeUrl(url))
    .map((url) => ({ issue, filePath, url }));
}

function parseUrl(input: string): URL {
  return new URL(input, `https://${CANONICAL_HOST}`);
}

function getSegments(url: URL): string[] {
  return url.pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
}

function classifyHost(url: URL): string {
  if (url.protocol !== 'https:') {
    return 'non-https';
  }

  if (url.hostname === CANONICAL_HOST) {
    return 'canonical-host';
  }

  if (url.hostname === 'u2tool.com') {
    return 'apex-host';
  }

  return 'other-host';
}

function inferLocale(url: URL): string {
  const first = getSegments(url)[0];
  if (!first) {
    return 'none';
  }

  return SUPPORTED_LOCALES.has(first) ? first : 'none';
}

function classifyPage(url: URL): string {
  const segments = getSegments(url);
  const localizedSegments = SUPPORTED_LOCALES.has(segments[0] || '') ? segments.slice(1) : segments;

  if (segments.length === 0 || (segments.length === 1 && SUPPORTED_LOCALES.has(segments[0]))) {
    return 'homepage';
  }

  if (url.pathname.startsWith('/api/')) {
    return 'api';
  }

  if (localizedSegments.length === 1 && localizedSegments[0] === 'tools') {
    return 'tools-index';
  }

  if (localizedSegments[0] === 'tools' && localizedSegments[1] === 'ranking') {
    return 'legacy-ranking';
  }

  if (localizedSegments[0] === 'tools' && localizedSegments.length >= 2) {
    return 'tool-detail';
  }

  if (localizedSegments[0] === 'categories') {
    return 'category-page';
  }

  if (localizedSegments[0] === 'compare') {
    return localizedSegments.length >= 2 ? 'compare-detail' : 'compare-index';
  }

  if (localizedSegments[0] === 'ai') {
    return 'ai-page';
  }

  if (['sitemap.xml', 'sitemap-pages.xml', 'sitemap-tools.xml', 'sitemap-priority.xml', 'robots.txt', 'llms.txt'].includes(localizedSegments[0] || '')) {
    return 'crawler-file';
  }

  if (['tools', 'categories', 'compare', 'ai'].includes(segments[0] || '')) {
    return 'legacy-unlocalized';
  }

  return 'other';
}

function classifySignal(url: URL): string {
  const pathname = url.pathname;
  const segments = getSegments(url);
  const last = segments[segments.length - 1] || '';

  if (pathname.startsWith('/api/')) {
    return 'non-html-endpoint';
  }

  if (last.includes('.')) {
    return 'file-like-path';
  }

  if (url.search) {
    return 'query-parameter';
  }

  if (url.hash) {
    return 'fragment';
  }

  if (/[A-Z]/.test(pathname)) {
    return 'uppercase-path';
  }

  if (pathname !== '/' && !pathname.endsWith('/')) {
    return 'missing-trailing-slash';
  }

  if (pathname.includes('//')) {
    return 'duplicate-slash';
  }

  if (segments[0] && !SUPPORTED_LOCALES.has(segments[0]) && ['tools', 'categories', 'compare', 'ai'].includes(segments[0])) {
    return 'legacy-unlocalized-path';
  }

  return 'canonical-shape';
}

function recommendAction(classified: Omit<ClassifiedUrl, 'recommendedAction'>): string {
  if (classified.hostBucket !== 'canonical-host') {
    return 'Confirm redirect consolidation to https://www.u2tool.com and ensure sitemaps/internal links never expose this host variant.';
  }

  if (classified.signalBucket === 'query-parameter') {
    return 'Keep out of sitemap and internal discovery; canonical should point to the clean URL. If this is search/filter traffic, keep it useful but not canonical.';
  }

  if (classified.signalBucket === 'missing-trailing-slash' || classified.signalBucket === 'legacy-unlocalized-path') {
    return 'Ensure 301 to trailing-slash localized canonical and remove any internal references to this shape.';
  }

  if (classified.pageBucket === 'tool-detail') {
    return 'Inspect content depth, FAQ/schema presence, SSR stability, and whether this tool has differentiated text beyond the shared template.';
  }

  if (classified.pageBucket === 'category-page' || classified.pageBucket === 'compare-detail') {
    return 'Inspect whether the page gives unique intent coverage and links to concrete canonical tools.';
  }

  if (classified.pageBucket === 'api') {
    return 'Keep API paths blocked/noindex and remove any crawlable links from public HTML.';
  }

  return 'Sample live URL status, canonical, robots meta, sitemap inclusion, and internal link sources before changing behavior.';
}

function classifyRow(row: DrilldownRow): ClassifiedUrl {
  const url = parseUrl(row.url);
  const base = {
    ...row,
    hostBucket: classifyHost(url),
    locale: inferLocale(url),
    pageBucket: classifyPage(url),
    signalBucket: classifySignal(url),
  };

  return {
    ...base,
    recommendedAction: recommendAction(base),
  };
}

function countBy<T extends string>(rows: ClassifiedUrl[], getter: (row: ClassifiedUrl) => T): Record<T, number> {
  const counts = new Map<T, number>();
  for (const row of rows) {
    const key = getter(row);
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  return Object.fromEntries(
    Array.from(counts.entries()).sort((left, right) => right[1] - left[1])
  ) as Record<T, number>;
}

function renderCountTable(title: string, counts: Record<string, number>): string {
  const lines = [`### ${title}`, '', '| Bucket | URLs |', '|---|---:|'];

  for (const [bucket, count] of Object.entries(counts)) {
    lines.push(`| ${bucket} | ${count.toLocaleString('en-US')} |`);
  }

  lines.push('');
  return lines.join('\n');
}

function renderSamples(rows: ClassifiedUrl[]): string {
  const lines = [
    '## Highest-Signal Samples',
    '',
    '| Issue | URL | Host | Locale | Page | Signal | Recommended Action |',
    '|---|---|---|---|---|---|---|',
  ];

  const sorted = [...rows].sort((left, right) => {
    const leftScore = left.signalBucket === 'canonical-shape' ? 1 : 0;
    const rightScore = right.signalBucket === 'canonical-shape' ? 1 : 0;
    return leftScore - rightScore || left.url.localeCompare(right.url);
  });

  for (const row of sorted.slice(0, 40)) {
    lines.push(
      `| ${row.issue} | ${row.url} | ${row.hostBucket} | ${row.locale} | ${row.pageBucket} | ${row.signalBucket} | ${row.recommendedAction} |`
    );
  }

  lines.push('');
  return lines.join('\n');
}

function renderReport(rows: ClassifiedUrl[], files: string[]): string {
  const generatedAt = new Date().toISOString();
  const issueCounts = countBy(rows, (row) => row.issue);
  const pageCounts = countBy(rows, (row) => row.pageBucket);
  const signalCounts = countBy(rows, (row) => row.signalBucket);
  const localeCounts = countBy(rows, (row) => row.locale);
  const hostCounts = countBy(rows, (row) => row.hostBucket);

  return [
    '# GSC Drilldown URL Report',
    '',
    `Generated at: ${generatedAt}`,
    '',
    `Files: ${files.map((file) => path.resolve(file)).join(', ')}`,
    '',
    '## Executive Summary',
    '',
    `- URLs classified: ${rows.length.toLocaleString('en-US')}.`,
    '- Use this report only with GSC issue drilldown exports. The aggregate Coverage export tells us counts, but not URL patterns.',
    '- Patch only repeated patterns. A single random 404 is not worth turning into a broad redirect rule.',
    '',
    renderCountTable('By Issue Export', issueCounts),
    renderCountTable('By Page Bucket', pageCounts),
    renderCountTable('By URL Signal', signalCounts),
    renderCountTable('By Locale', localeCounts),
    renderCountTable('By Host', hostCounts),
    renderSamples(rows),
    '## Next Actions',
    '',
    '1. Start with `canonical-shape` URLs inside `tool-detail`, because those are likely real content-quality or crawl-trust issues rather than URL-shape cleanup.',
    '2. For `query-parameter`, `missing-trailing-slash`, `legacy-unlocalized-path`, or host variants, verify redirects/canonicals and remove any internal exposure.',
    '3. For `api`, assets, or intentional utility files, keep them out of indexable discovery surfaces.',
    '4. After patching a repeated pattern, rerun `validate:internal-link-canonicals`, `validate:search-engine-compliance`, and this report on a fresh GSC export.',
    '',
  ].join('\n');
}

const args = parseArgs(process.argv.slice(2));
const files = resolveInputFiles(args);
const rows = files.flatMap(readDrilldownRows).map(classifyRow);

if (rows.length === 0) {
  throw new Error('No URL rows found. Export issue drilldown CSVs from GSC Coverage and retry.');
}

const report = renderReport(rows, files);

if (args.output) {
  const outputPath = path.resolve(args.output);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, report, 'utf8');
  console.log(`Saved report to ${outputPath}`);
} else {
  console.log(report);
}
