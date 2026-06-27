import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tools, type ToolCategory } from '../../src/config/tools/index';
import { locales, type Locale } from '../../src/lib/i18n';
import { toolMessageAliases } from '../../src/lib/translations';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const messagesDir = path.resolve(__dirname, '../../src/messages');

const CJK_LANGUAGES = ['zh', 'ja', 'ko'] as const;

const LATIN_TITLE_MIN = 10;
const LATIN_TITLE_MAX = 70;
const LATIN_DESC_MIN = 50;
const LATIN_DESC_MAX = 180;

const CJK_TITLE_MIN = 5;
const CJK_TITLE_MAX = 35;
const CJK_DESC_MIN = 40;
const CJK_DESC_MAX = 120;

const DEFAULT_TOP_FINDINGS = 30;
const SUMMARY_TOP_LIMIT = 10;

const forbiddenSubstrings = ['TODO', 'PLACEHOLDER', 'MISSING', '${BASE_URL}'] as const;

export type TdkIntegritySeverity = 'error' | 'warning';
export type TdkIntegrityField = 'namespace' | 'seo_title' | 'seo_description';
export type TdkIntegrityKind = 'missing_namespace' | 'missing' | 'forbidden_token' | 'length';
export type TdkLengthDirection = 'short' | 'long';

export interface TdkIntegrityFinding {
  locale: string;
  slug: string;
  category: ToolCategory | string;
  field: TdkIntegrityField;
  severity: TdkIntegritySeverity;
  kind: TdkIntegrityKind;
  message: string;
  lookupKey?: string;
  direction?: TdkLengthDirection;
  length?: number;
  min?: number;
  max?: number;
  overBy?: number;
}

export interface CountByLocaleEntry {
  locale: string;
  count: number;
}

export interface CountByCategoryEntry {
  category: string;
  count: number;
}

export interface CountBySlugEntry {
  slug: string;
  count: number;
}

export interface CountByLocaleFieldEntry {
  locale: string;
  field: Exclude<TdkIntegrityField, 'namespace'>;
  count: number;
}

export interface TdkIntegrityReport {
  timestamp: string;
  totalTools: number;
  totalLocales: number;
  checkedCount: number;
  summary: {
    errors: number;
    warnings: number;
    warningsByField: Record<Exclude<TdkIntegrityField, 'namespace'>, number>;
    warningsByDirection: Record<TdkLengthDirection, number>;
    topWarningLocales: CountByLocaleEntry[];
    topWarningCategories: CountByCategoryEntry[];
    topWarningSlugs: CountBySlugEntry[];
    topWarningLocaleFields: CountByLocaleFieldEntry[];
    largestOverLimit: TdkIntegrityFinding[];
  };
  findings: TdkIntegrityFinding[];
}

export interface TdkIntegrityCliArgs {
  help: boolean;
  reportPath?: string;
  top: number;
}

export interface ValidateToolTdkParams {
  locale: string;
  slug: string;
  category: ToolCategory | string;
  lookupKey: string;
  toolDict: Record<string, unknown>;
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

function loadTranslations(locale: Locale): Record<string, unknown> {
  const rootPath = path.join(messagesDir, `${locale}.json`);
  const basePath = path.join(messagesDir, locale, 'base.json');

  const rootMessages = fs.existsSync(rootPath)
    ? JSON.parse(fs.readFileSync(rootPath, 'utf-8')) as Record<string, unknown>
    : {};
  const baseMessages = fs.existsSync(basePath)
    ? JSON.parse(fs.readFileSync(basePath, 'utf-8')) as Record<string, unknown>
    : {};

  return deepMerge(baseMessages, rootMessages);
}

function getSafeBounds(
  locale: string,
  field: Exclude<TdkIntegrityField, 'namespace'>
): { min: number; max: number } {
  const isCjk = (CJK_LANGUAGES as readonly string[]).includes(locale);
  if (field === 'seo_title') {
    return {
      min: isCjk ? CJK_TITLE_MIN : LATIN_TITLE_MIN,
      max: isCjk ? CJK_TITLE_MAX : LATIN_TITLE_MAX,
    };
  }
  return {
    min: isCjk ? CJK_DESC_MIN : LATIN_DESC_MIN,
    max: isCjk ? CJK_DESC_MAX : LATIN_DESC_MAX,
  };
}

function buildMissingFinding(
  params: ValidateToolTdkParams,
  field: Exclude<TdkIntegrityField, 'namespace'>
): TdkIntegrityFinding {
  return {
    locale: params.locale,
    slug: params.slug,
    category: params.category,
    field,
    severity: 'error',
    kind: 'missing',
    message: `${field} is missing or empty`,
  };
}

function validateTextField(
  params: ValidateToolTdkParams,
  field: Exclude<TdkIntegrityField, 'namespace'>,
  value: unknown
): TdkIntegrityFinding[] {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return [buildMissingFinding(params, field)];
  }

  const findings: TdkIntegrityFinding[] = [];
  const text = value.trim();

  for (const forbidden of forbiddenSubstrings) {
    if (text.includes(forbidden)) {
      findings.push({
        locale: params.locale,
        slug: params.slug,
        category: params.category,
        field,
        severity: 'error',
        kind: 'forbidden_token',
        message: `${field} contains forbidden placeholder "${forbidden}"`,
      });
    }
  }

  const { min, max } = getSafeBounds(params.locale, field);
  const length = text.length;
  if (length < min || length > max) {
    const direction: TdkLengthDirection = length < min ? 'short' : 'long';
    findings.push({
      locale: params.locale,
      slug: params.slug,
      category: params.category,
      field,
      severity: 'warning',
      kind: 'length',
      direction,
      length,
      min,
      max,
      overBy: direction === 'short' ? min - length : length - max,
      message: `${field} length ${length} is out of safe bounds [${min}, ${max}]`,
    });
  }

  return findings;
}

export function validateToolTdk(params: ValidateToolTdkParams): TdkIntegrityFinding[] {
  return [
    ...validateTextField(params, 'seo_title', params.toolDict.seo_title),
    ...validateTextField(params, 'seo_description', params.toolDict.seo_description),
  ];
}

function sortFindings(findings: TdkIntegrityFinding[]): TdkIntegrityFinding[] {
  return [...findings].sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === 'error' ? -1 : 1;
    if (a.locale !== b.locale) return a.locale.localeCompare(b.locale);
    if (a.category !== b.category) return String(a.category).localeCompare(String(b.category));
    if (a.slug !== b.slug) return a.slug.localeCompare(b.slug);
    if (a.field !== b.field) return a.field.localeCompare(b.field);
    return a.kind.localeCompare(b.kind);
  });
}

function buildTopCounts<T extends { count: number }>(
  items: T[],
  keyOf: (item: T) => string,
  makeEntry: (key: string, count: number) => T,
  limit: number
): T[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([key, count]) => makeEntry(key, count));
}

export function buildTdkIntegrityReport(
  findings: TdkIntegrityFinding[],
  meta: { totalTools: number; totalLocales: number; checkedCount: number }
): TdkIntegrityReport {
  const sortedFindings = sortFindings(findings);
  const warnings = sortedFindings.filter((finding) => finding.severity === 'warning');
  const lengthWarnings = warnings.filter(
    (finding) => finding.kind === 'length' && finding.field !== 'namespace'
  );

  const warningsByField: Record<Exclude<TdkIntegrityField, 'namespace'>, number> = {
    seo_title: 0,
    seo_description: 0,
  };
  const warningsByDirection: Record<TdkLengthDirection, number> = {
    short: 0,
    long: 0,
  };

  for (const finding of lengthWarnings) {
    if (finding.field !== 'namespace') {
      warningsByField[finding.field] += 1;
    }
    if (finding.direction) {
      warningsByDirection[finding.direction] += 1;
    }
  }

  const topWarningLocales = buildTopCounts(
    warnings.map((finding) => ({ locale: finding.locale, count: 0 })),
    (entry) => entry.locale,
    (locale, count) => ({ locale, count }),
    SUMMARY_TOP_LIMIT
  );
  const topWarningCategories = buildTopCounts(
    warnings.map((finding) => ({ category: String(finding.category), count: 0 })),
    (entry) => entry.category,
    (category, count) => ({ category, count }),
    SUMMARY_TOP_LIMIT
  );
  const topWarningSlugs = buildTopCounts(
    warnings.map((finding) => ({ slug: finding.slug, count: 0 })),
    (entry) => entry.slug,
    (slug, count) => ({ slug, count }),
    SUMMARY_TOP_LIMIT
  );
  const topWarningLocaleFields = buildTopCounts(
    lengthWarnings
      .filter((finding): finding is TdkIntegrityFinding & { field: Exclude<TdkIntegrityField, 'namespace'> } => finding.field !== 'namespace')
      .map((finding) => ({
        locale: finding.locale,
        field: finding.field,
        count: 0,
      })),
    (entry) => `${entry.locale}/${entry.field}`,
    (key, count) => {
      const [locale, field] = key.split('/') as [string, Exclude<TdkIntegrityField, 'namespace'>];
      return { locale, field, count };
    },
    SUMMARY_TOP_LIMIT
  );

  return {
    timestamp: new Date().toISOString(),
    totalTools: meta.totalTools,
    totalLocales: meta.totalLocales,
    checkedCount: meta.checkedCount,
    summary: {
      errors: sortedFindings.filter((finding) => finding.severity === 'error').length,
      warnings: warnings.length,
      warningsByField,
      warningsByDirection,
      topWarningLocales,
      topWarningCategories,
      topWarningSlugs,
      topWarningLocaleFields,
      largestOverLimit: [...lengthWarnings]
        .sort((a, b) => (b.overBy ?? 0) - (a.overBy ?? 0) || a.slug.localeCompare(b.slug))
        .slice(0, SUMMARY_TOP_LIMIT),
    },
    findings: sortedFindings,
  };
}

export function runTdkIntegrityAudit(): TdkIntegrityReport {
  const translations: Record<string, Record<string, unknown>> = {};
  for (const locale of locales) {
    translations[locale] = loadTranslations(locale);
  }

  const findings: TdkIntegrityFinding[] = [];
  let checkedCount = 0;

  for (const tool of tools) {
    const slug = tool.slug;
    const lookupKey = toolMessageAliases[slug] ?? slug;

    for (const locale of locales) {
      checkedCount += 1;
      const toolNamespace = translations[locale].tools;
      if (!isObject(toolNamespace)) {
        findings.push({
          locale,
          slug,
          category: tool.category,
          field: 'namespace',
          severity: 'error',
          kind: 'missing_namespace',
          message: 'Missing root "tools" translation namespace',
          lookupKey,
        });
        continue;
      }

      const toolDict = toolNamespace[lookupKey];
      if (!isObject(toolDict)) {
        findings.push({
          locale,
          slug,
          category: tool.category,
          field: 'namespace',
          severity: 'error',
          kind: 'missing_namespace',
          message: `Missing translation namespace under key "${lookupKey}"`,
          lookupKey,
        });
        continue;
      }

      findings.push(...validateToolTdk({
        locale,
        slug,
        category: tool.category,
        lookupKey,
        toolDict,
      }));
    }
  }

  return buildTdkIntegrityReport(findings, {
    totalTools: tools.length,
    totalLocales: locales.length,
    checkedCount,
  });
}

export async function writeTdkIntegrityReport(
  report: TdkIntegrityReport,
  reportPath?: string
): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportDir = path.resolve(__dirname, '../../.planning/research/reports');
  const targetPath = reportPath ?? path.join(reportDir, `tdk-integrity-${timestamp}.json`);

  await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.promises.writeFile(targetPath, `${JSON.stringify(report, null, 2)}\n`, 'utf-8');
  return targetPath;
}

export function parseTdkIntegrityArgs(argv: string[]): TdkIntegrityCliArgs {
  const args: TdkIntegrityCliArgs = {
    help: false,
    top: DEFAULT_TOP_FINDINGS,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      args.help = true;
      continue;
    }

    if ((arg === '--report-path' || arg === '--json-out') && argv[index + 1]) {
      args.reportPath = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--top' && argv[index + 1]) {
      const parsed = Number(argv[index + 1]);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error(`Invalid value for --top: ${argv[index + 1]}`);
      }
      args.top = parsed;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return args;
}

function printHelp(): void {
  console.log('TDK Integrity Governance - offline audit');
  console.log('');
  console.log('Usage:');
  console.log('  npm run validate:tdk-integrity -- [options]');
  console.log('');
  console.log('Options:');
  console.log('  --report-path <path>  Write the JSON report to a specific path');
  console.log('  --json-out <path>     Alias for --report-path');
  console.log(`  --top <n>             Print up to <n> sample findings per section (default: ${DEFAULT_TOP_FINDINGS})`);
  console.log('  --help, -h            Show this help and exit');
}

function formatCountList(entries: Array<{ label: string; count: number }>): string {
  return entries.map((entry) => `${entry.label}=${entry.count}`).join(', ');
}

function printFinding(finding: TdkIntegrityFinding): string {
  const location = `${finding.locale}/${finding.slug}`;
  const details = finding.kind === 'length'
    ? ` (${finding.direction}, overBy=${finding.overBy})`
    : '';
  return `${location} [${finding.category}] ${finding.field}: ${finding.message}${details}`;
}

async function main(): Promise<void> {
  const args = parseTdkIntegrityArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  console.log('[INFO] Multi-Locale TDK Integrity Validation');
  console.log(`  Catalog: ${tools.length} tools x ${locales.length} locales`);
  console.log('------------------------------------------------------------------');

  const startTime = Date.now();
  const report = runTdkIntegrityAudit();
  const durationMs = Date.now() - startTime;

  console.log(`  Checked combinations: ${report.checkedCount}`);
  console.log(`  Errors: ${report.summary.errors}`);
  console.log(`  Warnings: ${report.summary.warnings}`);
  console.log(`  Duration: ${(durationMs / 1000).toFixed(1)}s`);

  if (report.summary.warnings > 0) {
    console.warn('');
    console.warn(`[WARN] ${report.summary.warnings} TDK compliance warning(s) - review for SEO optimization`);
    console.warn(
      `  By field: ${formatCountList([
        { label: 'seo_title', count: report.summary.warningsByField.seo_title },
        { label: 'seo_description', count: report.summary.warningsByField.seo_description },
      ])}`
    );
    console.warn(
      `  By direction: ${formatCountList([
        { label: 'short', count: report.summary.warningsByDirection.short },
        { label: 'long', count: report.summary.warningsByDirection.long },
      ])}`
    );
    console.warn(
      `  Top locales: ${formatCountList(
        report.summary.topWarningLocales.map((entry) => ({
          label: entry.locale,
          count: entry.count,
        }))
      )}`
    );
    console.warn(
      `  Top categories: ${formatCountList(
        report.summary.topWarningCategories.map((entry) => ({
          label: entry.category,
          count: entry.count,
        }))
      )}`
    );
    console.warn(
      `  Top locale/fields: ${formatCountList(
        report.summary.topWarningLocaleFields.map((entry) => ({
          label: `${entry.locale}/${entry.field}`,
          count: entry.count,
        }))
      )}`
    );
    console.warn('  Largest over-limit examples:');
    for (const finding of report.summary.largestOverLimit.slice(0, args.top)) {
      console.warn(`    ${printFinding(finding)}`);
    }

    const warningSamples = report.findings
      .filter((finding) => finding.severity === 'warning')
      .slice(0, args.top);
    console.warn('  Sample warnings:');
    for (const finding of warningSamples) {
      console.warn(`    ${printFinding(finding)}`);
    }
    const remaining = report.summary.warnings - warningSamples.length;
    if (remaining > 0) {
      console.warn(`    ... and ${remaining} more`);
    }
  }

  if (report.summary.errors > 0) {
    console.error('');
    console.error(`[FAIL] ${report.summary.errors} TDK compliance error(s):`);
    const errors = report.findings
      .filter((finding) => finding.severity === 'error')
      .slice(0, args.top);
    for (const finding of errors) {
      console.error(`  ${printFinding(finding)}`);
    }
    const remaining = report.summary.errors - errors.length;
    if (remaining > 0) {
      console.error(`  ... and ${remaining} more`);
    }
  }

  try {
    const reportPath = await writeTdkIntegrityReport(report, args.reportPath);
    console.log(`\n  Report: ${reportPath}`);
  } catch (err) {
    console.warn(`\n  [WARN] Could not write report: ${(err as Error).message}`);
  }

  if (report.summary.errors > 0) {
    console.error('\n[FAIL] TDK integrity audit found hard errors.');
    process.exitCode = 1;
  } else {
    console.log('\n[PASS] TDK integrity audit passed (warnings are optimization debt).');
  }
}

if (typeof process !== 'undefined' && !process.env.VITEST) {
  main().catch((err) => {
    console.error('[FATAL]', err);
    process.exitCode = 1;
  });
}
