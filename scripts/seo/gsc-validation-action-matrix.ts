import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import * as XLSX from 'xlsx';

import {
  buildDelta,
  classifyPageBucket as classifyPerformancePageBucket,
  inferLocaleFromPage,
  type SearchMetricRow,
  type SearchMetricSummary,
} from '@/lib/seo-recovery';

const SUPPORTED_LOCALES = new Set(['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar']);
const CANONICAL_HOST = 'www.u2tool.com';
const SITE_INFO_PAGES = new Set(['privacy', 'terms', 'contact']);

type ValidationAction =
  | 'do-not-validate'
  | 'fix-before-validate'
  | 'request-indexing-after-enhancement'
  | 'monitor';

interface Args {
  inputDir?: string;
  coverageDir?: string;
  pagesCurrent?: string;
  pagesPrevious?: string;
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
  validationAction: ValidationAction;
  actionReason: string;
}

interface PageCandidate {
  url: string;
  locale: string;
  clicks: number;
  clicksDelta: number;
  impressions: number;
  impressionsDelta: number;
  position: number;
  score: number;
}

interface GroupedAction {
  action: ValidationAction;
  issue: string;
  pageBucket: string;
  signalBucket: string;
  count: number;
  reason: string;
  examples: string[];
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
      '  npm run report:gsc-validation-matrix -- \\',
      '    --input-dir exports/gsc \\',
      '    --output docs/GSC_VALIDATION_ACTION_MATRIX_2026-05-11.md',
    ].join('\n')
  );
  process.exit(1);
}

function findInputFile(dirPath: string, patterns: RegExp[]): string | undefined {
  const absoluteDirPath = path.resolve(dirPath);
  if (!fs.existsSync(absoluteDirPath)) {
    throw new Error(`Input directory not found: ${absoluteDirPath}`);
  }

  return fs
    .readdirSync(absoluteDirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => patterns.some((pattern) => pattern.test(name)))
    .sort()
    .map((name) => path.join(absoluteDirPath, name))[0];
}

function resolveArgs(args: Args): Required<Pick<Args, 'coverageDir' | 'pagesCurrent' | 'pagesPrevious'>> &
  Args {
  const inputDir = path.resolve(args.inputDir || 'exports/gsc');
  const coverageDir = path.resolve(args.coverageDir || path.join(inputDir, 'coverage-drilldowns'));
  const pagesCurrent =
    args.pagesCurrent ||
    findInputFile(inputDir, [/pages?.*current/i, /current.*pages?/i, /page-current/i]);
  const pagesPrevious =
    args.pagesPrevious ||
    findInputFile(inputDir, [/pages?.*previous/i, /previous.*pages?/i, /page-previous/i]);

  if (!coverageDir || !pagesCurrent || !pagesPrevious) {
    printUsage();
  }

  return {
    ...args,
    coverageDir,
    pagesCurrent,
    pagesPrevious,
  };
}

function resolveCoverageFiles(coverageDir: string): string[] {
  const absoluteDirPath = path.resolve(coverageDir);
  if (!fs.existsSync(absoluteDirPath)) {
    throw new Error(`Coverage drilldown directory not found: ${absoluteDirPath}`);
  }

  return fs
    .readdirSync(absoluteDirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.csv$/i.test(entry.name))
    .map((entry) => path.join(absoluteDirPath, entry.name))
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
  const text = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').trim();
  if (!text) {
    return [];
  }

  return text.split(/\r?\n/).map(parseCsvLine);
}

function normalizeHeader(value: unknown): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[()%]/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '');
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
  return bestScore > 0 ? scores.indexOf(bestScore) : 0;
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

function parseNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  const normalized = String(value || '')
    .trim()
    .replace(/,/g, '')
    .replace(/%/g, '');

  if (!normalized) {
    return 0;
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseCtr(value: unknown, clicks: number, impressions: number): number {
  if (value === undefined || value === null || value === '') {
    return impressions > 0 ? clicks / impressions : 0;
  }

  const raw = String(value).trim();
  if (raw.endsWith('%')) {
    return parseNumber(raw) / 100;
  }

  const parsed = parseNumber(value);
  return parsed > 1 ? parsed / 100 : parsed;
}

function readSheetRows(filePath: string): Record<string, unknown>[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Input file not found: ${filePath}`);
  }

  const workbook = XLSX.read(fs.readFileSync(filePath), { cellDates: false, type: 'buffer' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, {
    defval: '',
    raw: false,
  });
}

function toMetricRows(filePath: string): SearchMetricRow[] {
  return readSheetRows(filePath)
    .map((row) => {
      const normalizedEntries = Object.fromEntries(
        Object.entries(row).map(([key, value]) => [normalizeHeader(key), value])
      );
      const keyValue =
        normalizedEntries.page ||
        normalizedEntries.pages ||
        normalizedEntries.toppages ||
        normalizedEntries['网页'] ||
        normalizedEntries['页面'];
      const clicks = parseNumber(normalizedEntries.clicks);
      const impressions = parseNumber(normalizedEntries.impressions);
      const position = parseNumber(
        normalizedEntries.position || normalizedEntries.averageposition
      );
      const ctr = parseCtr(
        normalizedEntries.ctr || normalizedEntries.sitectr || normalizedEntries.averagectr,
        clicks,
        impressions
      );

      return {
        key: String(keyValue || '').trim(),
        clicks,
        impressions,
        ctr,
        position,
      } satisfies SearchMetricRow;
    })
    .filter((row) => /^https?:\/\//i.test(row.key) || row.key.startsWith('/'));
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

  if (url.pathname.startsWith('/_next/static/')) {
    return 'legacy-next-asset';
  }

  if (localizedSegments[0] === 'dist') {
    return 'build-output-path';
  }

  if (localizedSegments[0] === 'models') {
    return 'legacy-info-page';
  }

  if (SITE_INFO_PAGES.has(localizedSegments[0] || '')) {
    return 'site-info-page';
  }

  if (localizedSegments[0] === 'blog') {
    return 'legacy-blog';
  }

  if (localizedSegments.length === 1 && localizedSegments[0] === 'tools') {
    return 'tools-index';
  }

  if (localizedSegments[0] === 'tools' && localizedSegments[1] === 'category') {
    return 'legacy-category-under-tools';
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

  if (localizedSegments[0] === 'compare' && localizedSegments.length >= 3) {
    return 'legacy-compare-pair';
  }

  if (localizedSegments[0] === 'compare') {
    return localizedSegments.length >= 2 ? 'compare-detail' : 'compare-index';
  }

  if (localizedSegments[0] === 'ai') {
    return 'ai-page';
  }

  return 'other';
}

function classifySignal(url: URL): string {
  const pathname = url.pathname;
  const segments = getSegments(url);
  const last = segments[segments.length - 1] || '';
  const localizedSegments = SUPPORTED_LOCALES.has(segments[0] || '') ? segments.slice(1) : segments;

  if (pathname.startsWith('/api/')) {
    return 'non-html-endpoint';
  }

  if (pathname.startsWith('/_next/static/')) {
    return 'stale-build-asset';
  }

  if (localizedSegments[0] === 'dist') {
    return 'build-output-path';
  }

  if (localizedSegments[0] === 'blog') {
    return 'legacy-blog';
  }

  if (localizedSegments[0] === 'compare' && localizedSegments.length >= 3) {
    return 'legacy-compare-pair';
  }

  if (SITE_INFO_PAGES.has(localizedSegments[0] || '') || localizedSegments[0] === 'models') {
    return 'legacy-info-page';
  }

  if (last.includes('.')) {
    return 'file-like-path';
  }

  if (url.search) {
    return 'query-parameter';
  }

  if (localizedSegments[0] === 'tools' && localizedSegments[1] === 'category') {
    return 'legacy-category-under-tools';
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

  if (
    segments[0] &&
    !SUPPORTED_LOCALES.has(segments[0]) &&
    ['tools', 'categories', 'compare', 'ai'].includes(segments[0])
  ) {
    return 'legacy-unlocalized-path';
  }

  return 'canonical-shape';
}

function hasIssue(row: DrilldownRow, pattern: RegExp): boolean {
  return pattern.test(row.issue);
}

function isExpectedNonHtmlSignal(signalBucket: string): boolean {
  return [
    'stale-build-asset',
    'build-output-path',
    'non-html-endpoint',
    'file-like-path',
  ].includes(signalBucket);
}

function isLegacyConsolidationSignal(signalBucket: string): boolean {
  return [
    'legacy-blog',
    'legacy-category-under-tools',
    'legacy-compare-pair',
    'legacy-info-page',
    'legacy-unlocalized-path',
    'missing-trailing-slash',
  ].includes(signalBucket);
}

function isIntendedIndexablePage(pageBucket: string): boolean {
  return [
    'homepage',
    'tools-index',
    'category-page',
    'tool-detail',
    'compare-detail',
    'compare-index',
    'site-info-page',
    'ai-page',
  ].includes(pageBucket);
}

function classifyValidationAction(
  row: Omit<ClassifiedUrl, 'validationAction' | 'actionReason'>
): Pick<ClassifiedUrl, 'validationAction' | 'actionReason'> {
  if (row.hostBucket !== 'canonical-host') {
    return {
      validationAction: 'monitor',
      actionReason:
        'Host/protocol variants should be checked for canonical redirect consolidation, not sent through broad issue validation.',
    };
  }

  if (isExpectedNonHtmlSignal(row.signalBucket)) {
    return {
      validationAction: 'do-not-validate',
      actionReason:
        'This is an expected non-HTML or stale asset exclusion. Redirecting it to HTML would create softer crawl quality signals.',
    };
  }

  if (row.signalBucket === 'query-parameter') {
    return {
      validationAction: 'do-not-validate',
      actionReason:
        'Query variants should canonicalize to clean URLs. They can remain useful to users without becoming canonical index targets.',
    };
  }

  if (hasIssue(row, /alternate with proper canonical/i)) {
    return {
      validationAction: 'do-not-validate',
      actionReason:
        'GSC is confirming the alternate points at a proper canonical. There is no fix to validate for this mixed row.',
    };
  }

  if (hasIssue(row, /page with redirect/i)) {
    return {
      validationAction: 'monitor',
      actionReason:
        'Redirect rows are expected when old URL shapes consolidate to canonical localized pages. Spot-check redirects, then wait for recrawl.',
    };
  }

  if (
    (hasIssue(row, /blocked 4xx/i) || hasIssue(row, /not found 404/i) || hasIssue(row, /noindex/i)) &&
    isIntendedIndexablePage(row.pageBucket)
  ) {
    return {
      validationAction: 'fix-before-validate',
      actionReason:
        'This looks like an intended indexable page in a blocker row. Live-inspect it; fix status, robots, or noindex if still blocked, or mark it expected before validating.',
    };
  }

  if (
    row.pageBucket === 'tool-detail' &&
    (hasIssue(row, /crawled not indexed/i) ||
      hasIssue(row, /google selected canonical/i) ||
      row.signalBucket === 'canonical-shape')
  ) {
    return {
      validationAction: 'request-indexing-after-enhancement',
      actionReason:
        'This is an indexable tool-detail shape. Prioritize only high-value pages, improve evidence/internal links first, then request indexing individually.',
    };
  }

  if (isLegacyConsolidationSignal(row.signalBucket)) {
    return {
      validationAction: 'monitor',
      actionReason:
        'This is a legacy or normalized URL shape. Confirm the redirect/canonical path is coherent and avoid broad validation retries.',
    };
  }

  return {
    validationAction: 'monitor',
    actionReason:
      'No deterministic repo fix is implied by this export row alone. Sample live URL inspection before changing behavior.',
  };
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
    ...classifyValidationAction(base),
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

function normalizeUrlKey(input: string): string {
  const url = parseUrl(input);
  let pathname = url.pathname || '/';
  const lastSegment = pathname.split('/').filter(Boolean).at(-1) || '';

  if (pathname !== '/' && !pathname.endsWith('/') && !lastSegment.includes('.')) {
    pathname += '/';
  }

  return `https://${CANONICAL_HOST}${pathname}`;
}

function metricSummaryFromRow(row: SearchMetricRow | undefined): SearchMetricSummary | undefined {
  if (!row) {
    return undefined;
  }

  return {
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  };
}

function buildHighValueCandidates(currentRows: SearchMetricRow[], previousRows: SearchMetricRow[]): PageCandidate[] {
  const currentMap = new Map(currentRows.map((row) => [normalizeUrlKey(row.key), row]));
  const previousMap = new Map(previousRows.map((row) => [normalizeUrlKey(row.key), row]));
  const keys = Array.from(new Set([...currentMap.keys(), ...previousMap.keys()])).sort();

  return keys
    .map((key) => {
      const current = currentMap.get(key);
      const previous = previousMap.get(key);
      const delta = buildDelta(metricSummaryFromRow(current), metricSummaryFromRow(previous));
      const pageBucket = classifyPerformancePageBucket(key);
      const clickLoss = Math.max(0, -delta.clicksDelta);
      const impressionLoss = Math.max(0, -delta.impressionsDelta);
      const priorClicks = previous?.clicks || 0;
      const score = clickLoss * 1000 + priorClicks * 100 + impressionLoss + delta.impressions * 0.25;

      return {
        url: key,
        locale: inferLocaleFromPage(key),
        clicks: delta.clicks,
        clicksDelta: delta.clicksDelta,
        impressions: delta.impressions,
        impressionsDelta: delta.impressionsDelta,
        position: delta.position,
        score,
        pageBucket,
      };
    })
    .filter((candidate) => candidate.pageBucket === 'tool-detail')
    .filter((candidate) => candidate.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.clicksDelta - right.clicksDelta ||
        left.impressionsDelta - right.impressionsDelta ||
        left.url.localeCompare(right.url)
    )
    .slice(0, 20)
    .map(({ pageBucket: _pageBucket, ...candidate }) => candidate);
}

function formatNumber(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function formatDecimal(value: number, digits = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function formatDelta(value: number): string {
  const rounded = Math.round(value);
  return rounded > 0 ? `+${formatNumber(rounded)}` : formatNumber(rounded);
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function renderCountTable(title: string, counts: Record<string, number>): string {
  const lines = [`### ${title}`, '', '| Bucket | URLs |', '|---|---:|'];

  for (const [bucket, count] of Object.entries(counts)) {
    lines.push(`| ${escapeCell(bucket)} | ${formatNumber(count)} |`);
  }

  lines.push('');
  return lines.join('\n');
}

function groupActionRows(rows: ClassifiedUrl[]): GroupedAction[] {
  const grouped = new Map<string, GroupedAction>();

  for (const row of rows) {
    const key = [row.validationAction, row.issue, row.pageBucket, row.signalBucket].join('\u0000');
    const existing = grouped.get(key);

    if (existing) {
      existing.count += 1;
      if (existing.examples.length < 3) {
        existing.examples.push(row.url);
      }
      continue;
    }

    grouped.set(key, {
      action: row.validationAction,
      issue: row.issue,
      pageBucket: row.pageBucket,
      signalBucket: row.signalBucket,
      count: 1,
      reason: row.actionReason,
      examples: [row.url],
    });
  }

  const actionOrder: ValidationAction[] = [
    'do-not-validate',
    'fix-before-validate',
    'request-indexing-after-enhancement',
    'monitor',
  ];

  return Array.from(grouped.values()).sort(
    (left, right) =>
      actionOrder.indexOf(left.action) - actionOrder.indexOf(right.action) ||
      right.count - left.count ||
      left.issue.localeCompare(right.issue) ||
      left.pageBucket.localeCompare(right.pageBucket) ||
      left.signalBucket.localeCompare(right.signalBucket)
  );
}

function renderActionMatrix(rows: ClassifiedUrl[]): string {
  const grouped = groupActionRows(rows);
  const lines = [
    '## Action Matrix',
    '',
    '| Action | Issue Row | Page Bucket | URL Signal | URLs | Why | Examples |',
    '|---|---|---|---|---:|---|---|',
  ];

  for (const group of grouped) {
    lines.push(
      `| \`${group.action}\` | ${escapeCell(group.issue)} | ${escapeCell(group.pageBucket)} | ${escapeCell(group.signalBucket)} | ${formatNumber(group.count)} | ${escapeCell(group.reason)} | ${group.examples.map(escapeCell).join('<br>')} |`
    );
  }

  lines.push('');
  return lines.join('\n');
}

function renderIssueGuidance(rows: ClassifiedUrl[]): string {
  const issueCounts = countBy(rows, (row) => row.issue);
  const guidance: Record<string, string> = {
    'alternate with proper canonical':
      'Do not validate. These are expected alternate/canonical relationships unless live inspection proves the canonical target is wrong.',
    'blocked 4xx':
      'Validate only after Phase 33 live-checks intended indexable pages and fixes any owned status/robots defects. Leave stale assets and random file-like paths alone.',
    'crawled not indexed':
      'Do not press a broad validation button. Use Performance evidence to choose high-value tool-detail pages, enhance them, then request indexing individually.',
    'google selected canonical':
      'Treat as canonical/content trust work, not a whole-row validation retry. Prioritize high-value canonical tool pages for enhancement.',
    noindex:
      'Do not validate expected noindex assets or non-HTML paths. Validate only if an intended indexable HTML page is accidentally noindexed and has been fixed.',
    'not found 404':
      'Do not validate stale hashed assets or random dead paths. Validate only after a repeated indexable URL pattern has been fixed or explicitly restored.',
    'page with redirect':
      'Monitor. Redirects are expected for legacy shapes, missing trailing slash, and old category/blog/compare URLs once live spot checks confirm coherent 301s.',
  };

  const lines = [
    '## GSC Issue Row Guidance',
    '',
    '| GSC Issue Row | URLs | Current Instruction |',
    '|---|---:|---|',
  ];

  for (const [issue, count] of Object.entries(issueCounts)) {
    lines.push(`| ${escapeCell(issue)} | ${formatNumber(count)} | ${escapeCell(guidance[issue] || 'Sample live URLs before changing or validating this row.')} |`);
  }

  lines.push('');
  return lines.join('\n');
}

function renderHighValueCandidates(candidates: PageCandidate[]): string {
  const lines = [
    '## High-Value Tool Detail Candidates',
    '',
    'These are Performance candidates for Phase 34. They are not "fixed" yet. Enhance content/internal links first, inspect the live URL in GSC, then request indexing individually.',
    '',
    '| URL | Locale | Clicks | Click Delta | Impressions | Impression Delta | Position | Next Step |',
    '|---|---|---:|---:|---:|---:|---:|---|',
  ];

  for (const candidate of candidates.slice(0, 12)) {
    lines.push(
      `| ${escapeCell(candidate.url)} | ${candidate.locale} | ${formatNumber(candidate.clicks)} | ${formatDelta(candidate.clicksDelta)} | ${formatNumber(candidate.impressions)} | ${formatDelta(candidate.impressionsDelta)} | ${formatDecimal(candidate.position)} | Check content fit, FAQ/support copy, internal links, rendered SEO, then request indexing. |`
    );
  }

  if (candidates.length === 0) {
    lines.push('| n/a | n/a | 0 | 0 | 0 | 0 | 0.00 | No tool-detail Performance candidates found. |');
  }

  lines.push('');
  return lines.join('\n');
}

function renderNextSteps(): string {
  return [
    '## Next Operational Steps',
    '',
    '1. Do not re-run broad GSC validation for mixed rows right now.',
    '2. Phase 33 should live-check only `fix-before-validate` samples where the URL is intended to be indexable HTML.',
    '3. Phase 34 should enhance the highest-value tool-detail candidates, then use URL Inspection -> Test live URL -> Request indexing per URL.',
    '4. Only click "Validate fix" on a GSC issue row after the row is narrowed to a fixed, coherent URL pattern and repository validation gates are green.',
    '',
  ].join('\n');
}

function buildReport(
  classifiedRows: ClassifiedUrl[],
  files: string[],
  currentRows: SearchMetricRow[],
  previousRows: SearchMetricRow[]
): string {
  const generatedAt = new Date().toISOString();
  const actionCounts = countBy(classifiedRows, (row) => row.validationAction);
  const pageCounts = countBy(classifiedRows, (row) => row.pageBucket);
  const signalCounts = countBy(classifiedRows, (row) => row.signalBucket);
  const candidates = buildHighValueCandidates(currentRows, previousRows);

  return [
    '# GSC Validation Action Matrix',
    '',
    `Generated at: ${generatedAt}`,
    '',
    `Coverage files: ${files.map((file) => path.resolve(file)).join(', ')}`,
    '',
    '## Executive Summary',
    '',
    `- Coverage drilldown URLs classified: ${formatNumber(classifiedRows.length)}.`,
    `- Current Performance page rows: ${formatNumber(currentRows.length)}.`,
    `- Previous Performance page rows: ${formatNumber(previousRows.length)}.`,
    '- Previous broad GSC validation attempts failed because issue rows mix expected exclusions with possible real blockers.',
    '- The safe path is to leave expected exclusions alone, live-check only intended indexable blockers, and request indexing individually for enhanced high-value pages.',
    '',
    renderCountTable('By Validation Action', actionCounts),
    renderCountTable('By Page Bucket', pageCounts),
    renderCountTable('By URL Signal', signalCounts),
    renderIssueGuidance(classifiedRows),
    renderActionMatrix(classifiedRows),
    renderHighValueCandidates(candidates),
    renderNextSteps(),
  ].join('\n');
}

function main(): void {
  const args = resolveArgs(parseArgs(process.argv.slice(2)));
  const coverageFiles = resolveCoverageFiles(args.coverageDir);
  const drilldownRows = coverageFiles.flatMap(readDrilldownRows);

  if (drilldownRows.length === 0) {
    throw new Error('No URL rows found. Export issue drilldown CSVs from GSC Coverage and retry.');
  }

  const classifiedRows = drilldownRows.map(classifyRow);
  const currentRows = toMetricRows(args.pagesCurrent);
  const previousRows = toMetricRows(args.pagesPrevious);
  const report = buildReport(classifiedRows, coverageFiles, currentRows, previousRows);

  if (args.output) {
    const outputPath = path.resolve(args.output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, report, 'utf8');
    console.log(`Saved report to ${outputPath}`);
    return;
  }

  console.log(report);
}

main();
