import fs from 'node:fs';
import path from 'node:path';
import { argv } from 'node:process';

import { tools, type Tool, type ToolCategory } from '../../src/config/tools/index';
import { locales, type Locale } from '../../src/lib/i18n';
import { toolMessageAliases } from '../../src/lib/tool-message-aliases';
import { assessSupportContentTrust } from '../../src/lib/content-trust.js';
import { seoDiscoveryConfig } from '../../src/lib/seo-discovery';

type Priority = 'P0' | 'P1' | 'P2' | 'P3';
type IssueSeverity = 'critical' | 'high' | 'medium' | 'low';

interface Args {
  inputDir: string;
  output: string;
  jsonOut: string;
  top: number;
}

interface MetricRow {
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface MetricSummary {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface AuditIssue {
  code: string;
  severity: IssueSeverity;
  message: string;
  score: number;
}

interface CoverageObservation {
  bucket: string;
  sourceUrl: string;
  normalizedUrl: string;
  lastCrawled?: string;
}

interface AuditRow {
  locale: Locale;
  slug: string;
  category: ToolCategory;
  url: string;
  score: number;
  priority: Priority;
  action: string;
  currentClicks: number;
  previousClicks: number;
  clickLoss: number;
  currentImpressions: number;
  previousImpressions: number;
  impressionLoss: number;
  currentPosition: number;
  previousPosition: number;
  titleLength: number;
  descriptionLength: number;
  supportSignal: number;
  issues: AuditIssue[];
}

interface AuditReport {
  generatedAt: string;
  inputs: {
    inputDir: string;
    pagesCurrent: string;
    pagesPrevious: string;
    queriesCurrent: string;
    queriesPrevious: string;
  };
  totals: {
    tools: number;
    locales: number;
    auditedPages: number;
    p0: number;
    p1: number;
    p2: number;
    p3: number;
  };
  rows: AuditRow[];
  topLostPages: Array<{
    url: string;
    currentClicks: number;
    previousClicks: number;
    clickLoss: number;
    currentImpressions: number;
    previousImpressions: number;
    impressionLoss: number;
  }>;
  topLostQueries: Array<{
    query: string;
    currentClicks: number;
    previousClicks: number;
    clickLoss: number;
    currentImpressions: number;
    previousImpressions: number;
    impressionLoss: number;
  }>;
}

const SITE_BASE = 'https://www.u2tool.com';
const CJK_LOCALES = new Set<string>(['zh', 'ja', 'ko']);
const DEFAULT_TOP = 60;

const genericTemplatePatterns: Array<{ code: string; pattern: RegExp; message: string }> = [
  {
    code: 'generic-data-generator-zh',
    pattern: /便捷的在线生成器|各种类型的数据|测试数据、示例内容还是随机值|符合特定格式要求的数据/,
    message: 'Chinese support copy still looks like a generic data-generator template.',
  },
  {
    code: 'generic-data-generator-ja',
    pattern: /さまざまな種類のデータ|テストデータ|サンプルコンテンツ|ランダム値|特定の形式要件/,
    message: 'Japanese support copy still looks like a generic data-generator template.',
  },
  {
    code: 'generic-data-generator-ko',
    pattern: /다양한 유형의 데이터|테스트 데이터|샘플 콘텐츠|무작위 값|특정 형식 요구/,
    message: 'Korean support copy still looks like a generic data-generator template.',
  },
  {
    code: 'generic-data-generator-latin',
    pattern: /test data, sample content|sample content or random values|various types of data|datos de prueba|contenido de ejemplo|valores aleatorios|données de test|contenu d'exemple|valeurs aléatoires|Testdaten|Beispielinhalte|Zufallswerte/i,
    message: 'Support copy contains generic data-generator language instead of tool-specific intent.',
  },
  {
    code: 'placeholder-ellipsis',
    pattern: /\.{4,}|…$/,
    message: 'Copy contains placeholder ellipsis that can leak into snippets.',
  },
  {
    code: 'generic-online-free-template',
    pattern: /Free online .{2,80} to .{2,80} online for free/i,
    message: 'TDK/support copy uses a repetitive "free online ... online for free" template.',
  },
];

function parseArgs(args: string[]): Args {
  const parsed: Args = {
    inputDir: 'exports/gsc/raw-csv',
    output: `docs/SEO_GEO_AUDIT_MATRIX_${localDateStamp()}.md`,
    jsonOut: `exports/seo/seo-geo-audit-matrix-${localDateStamp()}.json`,
    top: DEFAULT_TOP,
  };

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];
    const next = args[index + 1];
    if (!current.startsWith('--')) continue;

    if (current === '--input-dir' && next) {
      parsed.inputDir = next;
      index += 1;
    } else if (current === '--output' && next) {
      parsed.output = next;
      index += 1;
    } else if (current === '--json-out' && next) {
      parsed.jsonOut = next;
      index += 1;
    } else if (current === '--top' && next) {
      const value = Number.parseInt(next, 10);
      if (Number.isInteger(value) && value > 0) {
        parsed.top = value;
      }
      index += 1;
    }
  }

  return parsed;
}

function localDateStamp(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function splitCsvLine(line: string): string[] {
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
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function parseNumber(value: string | undefined): number {
  const parsed = Number.parseFloat(String(value || '').replace(/,/g, '').replace(/%/g, '').trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseCtr(value: string | undefined, clicks: number, impressions: number): number {
  if (!value) return impressions > 0 ? clicks / impressions : 0;
  const parsed = parseNumber(value);
  return String(value).includes('%') || parsed > 1 ? parsed / 100 : parsed;
}

function readCsvMetrics(filePath: string): MetricRow[] {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]).map((header) => header.trim().toLowerCase());
  const keyIndex = headers.findIndex((header) => ['top pages', 'top queries', 'page', 'query'].includes(header));
  const clicksIndex = headers.findIndex((header) => header === 'clicks');
  const impressionsIndex = headers.findIndex((header) => header === 'impressions');
  const ctrIndex = headers.findIndex((header) => header === 'ctr');
  const positionIndex = headers.findIndex((header) => header === 'position');

  if (keyIndex < 0 || clicksIndex < 0 || impressionsIndex < 0) {
    throw new Error(`Unsupported GSC CSV headers in ${filePath}: ${headers.join(', ')}`);
  }

  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const clicks = parseNumber(cells[clicksIndex]);
    const impressions = parseNumber(cells[impressionsIndex]);
    return {
      key: cells[keyIndex] || '',
      clicks,
      impressions,
      ctr: parseCtr(cells[ctrIndex], clicks, impressions),
      position: parseNumber(cells[positionIndex]),
    };
  }).filter((row) => row.key);
}

function normalizeToolUrl(locale: string, slug: string): string {
  return `${SITE_BASE}/${locale}/tools/${slug}/`;
}

function normalizePageKey(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';

  try {
    const url = trimmed.startsWith('http')
      ? new URL(trimmed)
      : new URL(trimmed.startsWith('/') ? `${SITE_BASE}${trimmed}` : `${SITE_BASE}/${trimmed}`);
    const pathname = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
    return `${SITE_BASE}${pathname}`;
  } catch {
    return trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
  }
}

function urlPathname(input: string): string {
  try {
    const url = input.startsWith('http')
      ? new URL(input)
      : new URL(input.startsWith('/') ? `${SITE_BASE}${input}` : `${SITE_BASE}/${input}`);
    return url.pathname;
  } catch {
    return '';
  }
}

function isSlashlessLocalizedToolVariant(sourceUrl: string, normalizedUrl: string): boolean {
  const sourcePath = urlPathname(sourceUrl);
  if (!sourcePath || sourcePath.endsWith('/')) return false;

  const normalizedPath = urlPathname(normalizedUrl);
  if (normalizedPath !== `${sourcePath}/`) return false;

  const segments = sourcePath.split('/').filter(Boolean);
  return (
    segments.length === 3
    && (locales as readonly string[]).includes(segments[0])
    && segments[1] === 'tools'
  );
}

function groupMetrics(rows: MetricRow[], normalizeKey: (key: string) => string): Map<string, MetricSummary> {
  const grouped = new Map<string, MetricSummary & { weightedPosition: number }>();

  for (const row of rows) {
    const key = normalizeKey(row.key);
    if (!key) continue;

    const previous = grouped.get(key) || {
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0,
      weightedPosition: 0,
    };
    previous.clicks += row.clicks;
    previous.impressions += row.impressions;
    previous.weightedPosition += row.position * Math.max(row.impressions, 1);
    grouped.set(key, previous);
  }

  return new Map([...grouped.entries()].map(([key, value]) => [
    key,
    {
      clicks: value.clicks,
      impressions: value.impressions,
      ctr: value.impressions > 0 ? value.clicks / value.impressions : 0,
      position: value.impressions > 0 ? Number((value.weightedPosition / value.impressions).toFixed(2)) : 0,
    },
  ]));
}

function readJson(filePath: string): Record<string, unknown> {
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepMerge(base: Record<string, unknown>, override: Record<string, unknown>): Record<string, unknown> {
  const merged = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const baseValue = merged[key];
    if (isObject(baseValue) && isObject(value)) {
      merged[key] = deepMerge(baseValue, value);
    } else {
      merged[key] = value;
    }
  }
  return merged;
}

function readToolMessages(locale: Locale, slug: string): {
  mergedTool: Record<string, unknown>;
  splitTool: Record<string, unknown>;
  rootTool: Record<string, unknown>;
  baseTool: Record<string, unknown>;
  splitPath: string;
} {
  const lookupKey = toolMessageAliases[slug] ?? slug;
  const rootPath = path.join(process.cwd(), 'src/messages', `${locale}.json`);
  const basePath = path.join(process.cwd(), 'src/messages', locale, 'base.json');
  const splitPath = path.join(process.cwd(), 'src/messages', locale, 'tools', `${lookupKey}.json`);

  const rootMessages = readJson(rootPath);
  const baseMessages = readJson(basePath);
  const mergedMessages = deepMerge(baseMessages, rootMessages);

  const rootTool = isObject(rootMessages.tools) && isObject(rootMessages.tools[lookupKey])
    ? rootMessages.tools[lookupKey] as Record<string, unknown>
    : {};
  const baseTool = isObject(baseMessages.tools) && isObject(baseMessages.tools[lookupKey])
    ? baseMessages.tools[lookupKey] as Record<string, unknown>
    : {};
  const mergedTool = isObject(mergedMessages.tools) && isObject(mergedMessages.tools[lookupKey])
    ? mergedMessages.tools[lookupKey] as Record<string, unknown>
    : {};
  const splitTool = readJson(splitPath);

  return { mergedTool, splitTool, rootTool, baseTool, splitPath };
}

function stringField(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === 'string' ? value.trim() : '';
}

function stringArray(source: Record<string, unknown>, key: string): string[] {
  const value = source[key];
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [];
}

function faqs(source: Record<string, unknown>): Array<{ question?: string; answer?: string }> {
  const value = source.faqs;
  if (!Array.isArray(value)) return [];
  return value.filter(isObject).map((item) => ({
    question: typeof item.question === 'string' ? item.question : undefined,
    answer: typeof item.answer === 'string' ? item.answer : undefined,
  }));
}

function supportSignalCount(parts: string[]): number {
  const text = parts.filter(Boolean).join(' ');
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const cjkSignal = text.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu)?.length ?? 0;
  return wordCount + Math.floor(cjkSignal / 2);
}

function getSafeBounds(locale: string, field: 'seo_title' | 'seo_description'): { min: number; max: number } {
  const isCjk = CJK_LOCALES.has(locale);
  if (field === 'seo_title') {
    return { min: isCjk ? 5 : 10, max: isCjk ? 35 : 70 };
  }
  return { min: isCjk ? 40 : 50, max: isCjk ? 120 : 180 };
}

function addIssue(issues: AuditIssue[], issue: AuditIssue): void {
  issues.push(issue);
}

function auditTdk(
  locale: Locale,
  title: string,
  description: string,
  rootTool: Record<string, unknown>,
  baseTool: Record<string, unknown>,
  issues: AuditIssue[]
): void {
  for (const [field, value] of [
    ['seo_title', title],
    ['seo_description', description],
  ] as const) {
    if (!value) {
      addIssue(issues, {
        code: `${field}_missing`,
        severity: 'critical',
        message: `${field} is missing.`,
        score: 45,
      });
      continue;
    }

    if (/TODO|PLACEHOLDER|MISSING|\$\{BASE_URL\}/.test(value)) {
      addIssue(issues, {
        code: `${field}_placeholder`,
        severity: 'critical',
        message: `${field} contains a placeholder token.`,
        score: 45,
      });
    }

    const { min, max } = getSafeBounds(locale, field);
    if (value.length < min || value.length > max) {
      addIssue(issues, {
        code: `${field}_${value.length < min ? 'short' : 'long'}`,
        severity: 'medium',
        message: `${field} length ${value.length} is outside safe bounds [${min}, ${max}].`,
        score: value.length > max ? Math.min(18, Math.ceil((value.length - max) / 10) + 6) : 8,
      });
    }
  }

  for (const field of ['seo_title', 'seo_description'] as const) {
    const rootValue = stringField(rootTool, field);
    const baseValue = stringField(baseTool, field);
    if (rootValue && baseValue && rootValue !== baseValue) {
      addIssue(issues, {
        code: `${field}_source_drift`,
        severity: 'medium',
        message: `${field} differs between root locale JSON and base.json.`,
        score: 12,
      });
    }
  }
}

function auditSupportContent(
  locale: Locale,
  tool: Tool,
  mergedTool: Record<string, unknown>,
  splitTool: Record<string, unknown>,
  splitPath: string,
  issues: AuditIssue[]
): { supportSignal: number; supportText: string } {
  const detailedDescription = stringField(splitTool, 'detailed_description') || stringField(mergedTool, 'detailed_description');
  const usageSteps = stringArray(splitTool, 'usage_steps').length ? stringArray(splitTool, 'usage_steps') : stringArray(mergedTool, 'usage_steps');
  const usageExamples = stringArray(splitTool, 'usage_examples').length ? stringArray(splitTool, 'usage_examples') : stringArray(mergedTool, 'usage_examples');
  const faqItems = faqs(splitTool).length ? faqs(splitTool) : faqs(mergedTool);
  const supportParts = [
    stringField(mergedTool, 'name'),
    stringField(mergedTool, 'description'),
    detailedDescription,
    ...usageSteps,
    ...usageExamples,
    ...faqItems.flatMap((item) => [item.question || '', item.answer || '']),
  ];
  const supportText = supportParts.filter(Boolean).join(' ');
  const supportSignal = supportSignalCount(supportParts);

  if (!fs.existsSync(splitPath)) {
    addIssue(issues, {
      code: 'split_support_missing',
      severity: 'high',
      message: 'Per-tool support JSON is missing.',
      score: 30,
    });
  }

  if (supportSignal < 120) {
    addIssue(issues, {
      code: 'support_thin_critical',
      severity: 'high',
      message: `Support content signal is very thin (${supportSignal}).`,
      score: 30,
    });
  } else if (supportSignal < 170) {
    addIssue(issues, {
      code: 'support_thin',
      severity: 'medium',
      message: `Support content signal is below recovery-page target (${supportSignal}).`,
      score: 14,
    });
  }

  if (usageSteps.length < 5) {
    addIssue(issues, {
      code: 'usage_steps_short',
      severity: 'low',
      message: `Only ${usageSteps.length} usage steps.`,
      score: 4,
    });
  }
  if (usageExamples.length < 4) {
    addIssue(issues, {
      code: 'usage_examples_short',
      severity: 'low',
      message: `Only ${usageExamples.length} usage examples.`,
      score: 4,
    });
  }
  if (faqItems.length < 5) {
    addIssue(issues, {
      code: 'faq_short',
      severity: 'low',
      message: `Only ${faqItems.length} FAQs.`,
      score: 4,
    });
  }

  for (const template of genericTemplatePatterns) {
    if (template.pattern.test(supportText)) {
      addIssue(issues, {
        code: template.code,
        severity: 'medium',
        message: template.message,
        score: 16,
      });
    }
  }

  const trust = assessSupportContentTrust({
    locale,
    slug: tool.slug,
    name: stringField(mergedTool, 'name'),
    description: stringField(mergedTool, 'description'),
    detailedDescription,
    usageSteps,
    usageExamples,
    faqs: faqItems,
  });

  for (const issue of trust.issues.slice(0, 5)) {
    addIssue(issues, {
      code: `content_trust_${issue.code}`,
      severity: issue.severity === 'high' ? 'critical' : 'medium',
      message: issue.message,
      score: issue.severity === 'high' ? 55 : 10,
    });
  }

  return { supportSignal, supportText };
}

function priorityFor(score: number, issues: AuditIssue[], clickLoss: number, impressionLoss: number): Priority {
  const hasGscLoss = clickLoss > 0 || impressionLoss > 0;
  const hasCriticalTechnicalIssue = issues.some((issue) => (
    issue.code.startsWith('coverage_blocked')
    || issue.code.startsWith('coverage_noindex')
    || issue.code.startsWith('coverage_not-found')
    || issue.code.startsWith('content_trust_')
    || issue.code.endsWith('_missing')
    || issue.code.endsWith('_placeholder')
  ) && issue.severity === 'critical');

  if (
    (score >= 100 && hasGscLoss) ||
    clickLoss >= 10 ||
    impressionLoss >= 5000 ||
    hasCriticalTechnicalIssue
  ) {
    return 'P0';
  }
  if (score >= 60 || clickLoss >= 3 || impressionLoss >= 1000) return 'P1';
  if (score >= 30 || impressionLoss >= 100) return 'P2';
  return 'P3';
}

function actionFor(row: Pick<AuditRow, 'issues' | 'clickLoss' | 'impressionLoss'>): string {
  if (row.issues.some((issue) => (
    issue.code.startsWith('coverage_blocked')
    || issue.code.startsWith('coverage_noindex')
    || issue.code.startsWith('coverage_not-found')
    || issue.code.startsWith('content_trust_')
    || issue.code.endsWith('_missing')
    || issue.code.endsWith('_placeholder')
  ) && issue.severity === 'critical')) {
    return 'technical/content-trust repair before indexing';
  }
  if (row.clickLoss > 0 || row.impressionLoss >= 1000) {
    return 'query-intent TDK/support refresh';
  }
  if (row.issues.some((issue) => issue.code.includes('generic') || issue.code.includes('template'))) {
    return 'batch localized template cleanup';
  }
  if (row.issues.some((issue) => issue.code.startsWith('seo_'))) {
    return 'TDK source sync and snippet cleanup';
  }
  if (row.issues.some((issue) => issue.code.includes('thin') || issue.code.includes('faq_'))) {
    return 'support content expansion';
  }
  return 'monitor';
}

function readCoverageBuckets(): Map<string, CoverageObservation[]> {
  const directory = path.join(process.cwd(), 'exports/gsc/coverage-drilldowns');
  const bucketNames = ['blocked-4xx.csv', 'noindex.csv', 'not-found-404.csv', 'crawled-not-indexed.csv'];
  const buckets = new Map<string, CoverageObservation[]>();

  for (const bucketName of bucketNames) {
    const filePath = path.join(directory, bucketName);
    if (!fs.existsSync(filePath)) continue;
    const rows = fs.readFileSync(filePath, 'utf8').split(/\r?\n/).filter(Boolean);
    for (const line of rows.slice(1)) {
      const [url, lastCrawled] = splitCsvLine(line);
      const key = normalizePageKey(url);
      const bucket = bucketName.replace(/\.csv$/, '');
      const current = buckets.get(key) || [];
      if (!current.some((entry) => entry.bucket === bucket && entry.sourceUrl === url)) {
        current.push({
          bucket,
          sourceUrl: url,
          normalizedUrl: key,
          lastCrawled: lastCrawled || undefined,
        });
      }
      buckets.set(key, current);
    }
  }

  return buckets;
}

function buildAuditRows(
  pagesCurrent: Map<string, MetricSummary>,
  pagesPrevious: Map<string, MetricSummary>
): AuditRow[] {
  const rows: AuditRow[] = [];
  const coverageBuckets = readCoverageBuckets();
  const prioritySlugs = new Set<string>([
    ...seoDiscoveryConfig.explicitPriorityToolSlugs,
    ...seoDiscoveryConfig.highValueToolBlocklistOverrides,
  ]);

  for (const tool of tools) {
    for (const locale of locales) {
      const url = normalizeToolUrl(locale, tool.slug);
      const current = pagesCurrent.get(url) || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
      const previous = pagesPrevious.get(url) || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
      const clickLoss = Math.max(0, previous.clicks - current.clicks);
      const impressionLoss = Math.max(0, previous.impressions - current.impressions);
      const issues: AuditIssue[] = [];

      if (clickLoss > 0) {
        addIssue(issues, {
          code: 'gsc_click_loss',
          severity: clickLoss >= 10 ? 'critical' : 'high',
          message: `Lost ${clickLoss} clicks versus previous GSC export.`,
          score: Math.min(55, 25 + clickLoss * 3),
        });
      }
      if (impressionLoss > 0) {
        addIssue(issues, {
          code: 'gsc_impression_loss',
          severity: impressionLoss >= 1000 ? 'high' : 'medium',
          message: `Lost ${impressionLoss} impressions versus previous GSC export.`,
          score: Math.min(45, 8 + Math.ceil(impressionLoss / 120)),
        });
      }
      if (previous.impressions >= 500 && current.impressions <= 10) {
        addIssue(issues, {
          code: 'gsc_indexed_low_exposure',
          severity: 'high',
          message: 'Previous high-exposure page now has near-zero current exposure.',
          score: 24,
        });
      }
      if (current.impressions > 0 && current.position >= 50) {
        addIssue(issues, {
          code: 'gsc_low_ranking_current',
          severity: 'medium',
          message: `Current average position is ${current.position}.`,
          score: 8,
        });
      }

      const { mergedTool, splitTool, rootTool, baseTool, splitPath } = readToolMessages(locale, tool.slug);
      const title = stringField(mergedTool, 'seo_title');
      const description = stringField(mergedTool, 'seo_description');
      auditTdk(locale, title, description, rootTool, baseTool, issues);
      const { supportSignal } = auditSupportContent(locale, tool, mergedTool, splitTool, splitPath, issues);

      const coverage = coverageBuckets.get(url) || [];
      for (const observation of coverage) {
        const lastCrawled = observation.lastCrawled ? ` Last crawled: ${observation.lastCrawled}.` : '';
        if (
          observation.bucket === 'blocked-4xx'
          && isSlashlessLocalizedToolVariant(observation.sourceUrl, observation.normalizedUrl)
        ) {
          addIssue(issues, {
            code: 'coverage_blocked-4xx_slash_redirect_pending',
            severity: 'medium',
            message: `GSC blocked-4xx source is a slashless localized tool variant now covered by canonical redirect: ${observation.sourceUrl}.${lastCrawled}`,
            score: 12,
          });
          continue;
        }

        addIssue(issues, {
          code: `coverage_${observation.bucket}`,
          severity: observation.bucket === 'crawled-not-indexed' ? 'high' : 'critical',
          message: `Canonical URL appears in GSC coverage bucket: ${observation.bucket}.${lastCrawled}`,
          score: observation.bucket === 'crawled-not-indexed' ? 24 : 70,
        });
      }

      if ((previous.impressions >= 500 || current.impressions >= 100) && !prioritySlugs.has(tool.slug)) {
        addIssue(issues, {
          code: 'geo_priority_discovery_gap',
          severity: 'medium',
          message: 'High-signal tool is not in the explicit priority discovery/IndexNow set.',
          score: 12,
        });
      }

      const baseScore = tool.category === 'finance' || tool.category === 'security' ? 4 : 0;
      const score = Math.min(200, baseScore + issues.reduce((sum, issue) => sum + issue.score, 0));
      const priority = priorityFor(score, issues, clickLoss, impressionLoss);
      const row: AuditRow = {
        locale,
        slug: tool.slug,
        category: tool.category,
        url,
        score,
        priority,
        action: 'monitor',
        currentClicks: current.clicks,
        previousClicks: previous.clicks,
        clickLoss,
        currentImpressions: current.impressions,
        previousImpressions: previous.impressions,
        impressionLoss,
        currentPosition: current.position,
        previousPosition: previous.position,
        titleLength: title.length,
        descriptionLength: description.length,
        supportSignal,
        issues,
      };
      row.action = actionFor(row);
      rows.push(row);
    }
  }

  return rows.sort((a, b) => b.score - a.score || b.impressionLoss - a.impressionLoss || a.url.localeCompare(b.url));
}

function lostPages(
  current: Map<string, MetricSummary>,
  previous: Map<string, MetricSummary>,
  limit: number
): AuditReport['topLostPages'] {
  return [...previous.entries()].map(([url, previousRow]) => {
    const currentRow = current.get(url) || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
    return {
      url,
      currentClicks: currentRow.clicks,
      previousClicks: previousRow.clicks,
      clickLoss: Math.max(0, previousRow.clicks - currentRow.clicks),
      currentImpressions: currentRow.impressions,
      previousImpressions: previousRow.impressions,
      impressionLoss: Math.max(0, previousRow.impressions - currentRow.impressions),
    };
  }).filter((row) => row.clickLoss > 0 || row.impressionLoss > 0)
    .sort((a, b) => b.clickLoss - a.clickLoss || b.impressionLoss - a.impressionLoss)
    .slice(0, limit);
}

function lostQueries(
  current: Map<string, MetricSummary>,
  previous: Map<string, MetricSummary>,
  limit: number
): AuditReport['topLostQueries'] {
  return [...previous.entries()].map(([query, previousRow]) => {
    const currentRow = current.get(query) || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
    return {
      query,
      currentClicks: currentRow.clicks,
      previousClicks: previousRow.clicks,
      clickLoss: Math.max(0, previousRow.clicks - currentRow.clicks),
      currentImpressions: currentRow.impressions,
      previousImpressions: previousRow.impressions,
      impressionLoss: Math.max(0, previousRow.impressions - currentRow.impressions),
    };
  }).filter((row) => row.clickLoss > 0 || row.impressionLoss > 0)
    .sort((a, b) => b.clickLoss - a.clickLoss || b.impressionLoss - a.impressionLoss)
    .slice(0, limit);
}

function countBy<T>(items: T[], keyOf: (item: T) => string): Array<{ key: string; count: number }> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([key, count]) => ({ key, count }));
}

function issueCodes(row: AuditRow, limit = 4): string {
  return row.issues.slice(0, limit).map((issue) => issue.code).join(', ');
}

function renderMarkdown(report: AuditReport, top: number): string {
  const rowsByPriority = (priority: Priority) => report.rows.filter((row) => row.priority === priority);
  const issueCounts = countBy(report.rows.flatMap((row) => row.issues), (issue) => issue.code).slice(0, 15);
  const localeP0P1 = countBy(report.rows.filter((row) => row.priority === 'P0' || row.priority === 'P1'), (row) => row.locale).slice(0, 10);
  const categoryP0P1 = countBy(report.rows.filter((row) => row.priority === 'P0' || row.priority === 'P1'), (row) => row.category).slice(0, 10);
  const templateRows = report.rows.filter((row) => row.issues.some((issue) => issue.code.includes('generic') || issue.code.includes('template')));
  const recoveryRows = report.rows
    .filter((row) => row.clickLoss > 0 || row.impressionLoss > 0)
    .sort((a, b) => (
      b.clickLoss - a.clickLoss
      || b.impressionLoss - a.impressionLoss
      || b.score - a.score
    ));

  return [
    `# SEO/GEO Audit Matrix - ${localDateStamp()}`,
    '',
    `Generated: ${report.generatedAt}`,
    '',
    '## Scope',
    '',
    `- Audited ${report.totals.auditedPages.toLocaleString('en-US')} localized tool pages (${report.totals.tools} tools x ${report.totals.locales} locales).`,
    `- GSC source: \`${report.inputs.inputDir}\`.`,
    '- Signals: GSC page loss, TDK safety, duplicate source drift, support-content depth, content-trust overclaims, generic template language, coverage blockers, and priority discovery/IndexNow coverage.',
    '',
    '## Priority Counts',
    '',
    '| Priority | Count | Meaning |',
    '|---|---:|---|',
    `| P0 | ${report.totals.p0} | Lost clicks/major exposure or critical technical/content-trust risk. |`,
    `| P1 | ${report.totals.p1} | Large exposure loss or high-confidence SEO cleanup target. |`,
    `| P2 | ${report.totals.p2} | Medium cleanup debt suitable for batch repair. |`,
    `| P3 | ${report.totals.p3} | Monitor or low-risk backlog. |`,
    '',
    '## GSC Recovery Queue',
    '',
    '| Priority | Score | URL | Click Loss | Impression Loss | Action | Main Issues |',
    '|---|---:|---|---:|---:|---|---|',
    ...recoveryRows.slice(0, top).map((row) => `| ${row.priority} | ${row.score} | \`${row.url}\` | ${row.clickLoss} | ${row.impressionLoss} | ${row.action} | ${issueCodes(row)} |`),
    '',
    '## Top P0/P1 Rows',
    '',
    '| Priority | Score | URL | Click Loss | Impression Loss | Action | Main Issues |',
    '|---|---:|---|---:|---:|---|---|',
    ...report.rows
      .filter((row) => row.priority === 'P0' || row.priority === 'P1')
      .slice(0, top)
      .map((row) => `| ${row.priority} | ${row.score} | \`${row.url}\` | ${row.clickLoss} | ${row.impressionLoss} | ${row.action} | ${issueCodes(row)} |`),
    '',
    '## Top Lost Pages From GSC',
    '',
    '| URL | Click Loss | Impression Loss | Current | Previous |',
    '|---|---:|---:|---:|---:|',
    ...report.topLostPages.slice(0, 30).map((row) => `| \`${row.url}\` | ${row.clickLoss} | ${row.impressionLoss} | ${row.currentClicks} / ${row.currentImpressions} | ${row.previousClicks} / ${row.previousImpressions} |`),
    '',
    '## Top Lost Queries From GSC',
    '',
    '| Query | Click Loss | Impression Loss | Current | Previous |',
    '|---|---:|---:|---:|---:|',
    ...report.topLostQueries.slice(0, 30).map((row) => `| \`${row.query}\` | ${row.clickLoss} | ${row.impressionLoss} | ${row.currentClicks} / ${row.currentImpressions} | ${row.previousClicks} / ${row.previousImpressions} |`),
    '',
    '## Batch Views',
    '',
    '### Issue Types',
    '',
    '| Issue | Rows |',
    '|---|---:|',
    ...issueCounts.map((entry) => `| \`${entry.key}\` | ${entry.count} |`),
    '',
    '### P0/P1 By Locale',
    '',
    '| Locale | Rows |',
    '|---|---:|',
    ...localeP0P1.map((entry) => `| ${entry.key} | ${entry.count} |`),
    '',
    '### P0/P1 By Category',
    '',
    '| Category | Rows |',
    '|---|---:|',
    ...categoryP0P1.map((entry) => `| ${entry.key} | ${entry.count} |`),
    '',
    '### Template Cleanup Candidates',
    '',
    '| Priority | URL | Issues |',
    '|---|---|---|',
    ...templateRows.slice(0, 40).map((row) => `| ${row.priority} | \`${row.url}\` | ${issueCodes(row, 6)} |`),
    '',
    '## Recommended Execution Order',
    '',
    '1. Finish P0 rows with old clicks first: exact query-intent TDK/support refresh, live rendered SEO check, deploy, and GSC URL Inspection only if indexing state is stale.',
    '2. Batch-fix generic localized templates by locale/category, starting with CJK pages where generic generator language is still visible.',
    '3. Run TDK source sync for root/base drift and overlong snippets, prioritizing pages with current impressions.',
    '4. Promote only high-signal repaired pages into priority discovery/IndexNow surfaces; keep low-value pages out of broad manual indexing pushes.',
    '',
    `JSON export: \`${report.inputs.inputDir ? report.inputs.inputDir : ''}\` -> see \`${path.relative(process.cwd(), reportPathFromJsonPlaceholder())}\` after generation.`,
    '',
  ].join('\n');
}

function reportPathFromJsonPlaceholder(): string {
  return 'exports/seo/seo-geo-audit-matrix-YYYY-MM-DD.json';
}

function buildReport(args: Args): AuditReport {
  const pagesCurrentPath = path.join(args.inputDir, 'pages-current.csv');
  const pagesPreviousPath = path.join(args.inputDir, 'pages-previous.csv');
  const queriesCurrentPath = path.join(args.inputDir, 'queries-current.csv');
  const queriesPreviousPath = path.join(args.inputDir, 'queries-previous.csv');

  const pagesCurrent = groupMetrics(readCsvMetrics(pagesCurrentPath), normalizePageKey);
  const pagesPrevious = groupMetrics(readCsvMetrics(pagesPreviousPath), normalizePageKey);
  const queriesCurrent = groupMetrics(readCsvMetrics(queriesCurrentPath), (key) => key.trim().toLowerCase());
  const queriesPrevious = groupMetrics(readCsvMetrics(queriesPreviousPath), (key) => key.trim().toLowerCase());
  const rows = buildAuditRows(pagesCurrent, pagesPrevious);

  return {
    generatedAt: new Date().toISOString(),
    inputs: {
      inputDir: args.inputDir,
      pagesCurrent: pagesCurrentPath,
      pagesPrevious: pagesPreviousPath,
      queriesCurrent: queriesCurrentPath,
      queriesPrevious: queriesPreviousPath,
    },
    totals: {
      tools: tools.length,
      locales: locales.length,
      auditedPages: rows.length,
      p0: rows.filter((row) => row.priority === 'P0').length,
      p1: rows.filter((row) => row.priority === 'P1').length,
      p2: rows.filter((row) => row.priority === 'P2').length,
      p3: rows.filter((row) => row.priority === 'P3').length,
    },
    rows,
    topLostPages: lostPages(pagesCurrent, pagesPrevious, 100),
    topLostQueries: lostQueries(queriesCurrent, queriesPrevious, 100),
  };
}

async function main(): Promise<void> {
  const args = parseArgs(argv.slice(2));
  const report = buildReport(args);
  const markdown = renderMarkdown(report, args.top).replace(
    reportPathFromJsonPlaceholder(),
    path.relative(process.cwd(), args.jsonOut)
  );

  await fs.promises.mkdir(path.dirname(args.output), { recursive: true });
  await fs.promises.mkdir(path.dirname(args.jsonOut), { recursive: true });
  await fs.promises.writeFile(args.output, `${markdown}\n`, 'utf8');
  await fs.promises.writeFile(args.jsonOut, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log(`SEO/GEO audit matrix written to ${args.output}`);
  console.log(`JSON export written to ${args.jsonOut}`);
  console.log(`Priority counts: P0=${report.totals.p0} P1=${report.totals.p1} P2=${report.totals.p2} P3=${report.totals.p3}`);
}

if (import.meta.url === `file://${argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
