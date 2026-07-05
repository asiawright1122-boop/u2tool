import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

type Priority = 'P0' | 'P1' | 'P2' | 'P3';
type Action = 'request-indexing' | 'content-refresh' | 'monitor';

interface Args {
  input?: string;
  output?: string;
  jsonOut?: string;
  csvOut?: string;
  queueDir?: string;
  batchOut?: string;
  contentRefreshBriefOut?: string;
  contentRefreshJsonOut?: string;
  requestIndexingLedgerOut?: string;
  requestIndexingLedgerReportOut?: string;
  batchSize: number;
  includeAllPriorities: boolean;
}

interface AuditIssue {
  code: string;
  severity: string;
  message: string;
  score: number;
}

interface AuditRow {
  locale: string;
  slug: string;
  category: string;
  url: string;
  score: number;
  priority: Priority;
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
  rows: AuditRow[];
}

interface ClassifiedRow extends AuditRow {
  action: Action;
  actionReason: string;
  lastCrawledDates: string[];
  localIssueCodes: string[];
}

interface ActionSummary {
  action: Action;
  count: number;
  clickLoss: number;
  impressionLoss: number;
}

interface ToolMessageStats {
  detailedDescriptionChars: number;
  usageSteps: number;
  usageExamples: number;
  faqs: number;
  hasSeoTitle: boolean;
  hasSeoDescription: boolean;
}

interface ContentRefreshBrief {
  priority: Priority;
  score: number;
  locale: string;
  slug: string;
  category: string;
  url: string;
  clickLoss: number;
  impressionLoss: number;
  currentClicks: number;
  currentImpressions: number;
  currentPosition: number;
  lastCrawledDates: string[];
  actionReason: string;
  splitMessagePath: string | null;
  baseMessagePath: string | null;
  componentPath: string | null;
  messageStats: ToolMessageStats;
  qaFocus: string[];
}

interface RequestIndexingLedgerRow {
  batch: number;
  status: string;
  url: string;
  priority: Priority;
  score: number;
  locale: string;
  slug: string;
  category: string;
  lastCrawled: string;
  clickLoss: number;
  impressionLoss: number;
  currentClicks: number;
  currentImpressions: number;
  previousClicks: number;
  previousImpressions: number;
  liveTestResult: string;
  indexingRequestSubmitted: string;
  inspectionDate: string;
  requestDate: string;
  notes: string;
}

function localDateStamp(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function parseArgs(argv: string[]): Args {
  const parsed: Args = {
    batchSize: 10,
    includeAllPriorities: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];
    if (!current.startsWith('--')) continue;

    if (current === '--input' && next) {
      parsed.input = next;
      index += 1;
    } else if (current === '--output' && next) {
      parsed.output = next;
      index += 1;
    } else if (current === '--json-out' && next) {
      parsed.jsonOut = next;
      index += 1;
    } else if (current === '--csv-out' && next) {
      parsed.csvOut = next;
      index += 1;
    } else if (current === '--queue-dir' && next) {
      parsed.queueDir = next;
      index += 1;
    } else if (current === '--batch-out' && next) {
      parsed.batchOut = next;
      index += 1;
    } else if (current === '--content-refresh-brief-out' && next) {
      parsed.contentRefreshBriefOut = next;
      index += 1;
    } else if (current === '--content-refresh-json-out' && next) {
      parsed.contentRefreshJsonOut = next;
      index += 1;
    } else if (current === '--request-indexing-ledger-out' && next) {
      parsed.requestIndexingLedgerOut = next;
      index += 1;
    } else if (current === '--request-indexing-ledger-report-out' && next) {
      parsed.requestIndexingLedgerReportOut = next;
      index += 1;
    } else if (current === '--batch-size' && next) {
      const batchSize = Number.parseInt(next, 10);
      if (Number.isFinite(batchSize) && batchSize > 0) {
        parsed.batchSize = batchSize;
      }
      index += 1;
    } else if (current === '--all-priorities') {
      parsed.includeAllPriorities = true;
    }
  }

  return parsed;
}

function latestAuditMatrixPath(): string {
  const directory = path.join(process.cwd(), 'exports/seo');
  const candidates = fs.existsSync(directory)
    ? fs.readdirSync(directory)
      .filter((name) => /^seo-geo-audit-matrix-\d{4}-\d{2}-\d{2}\.json$/.test(name))
      .sort()
    : [];
  const latest = candidates.at(-1);
  if (!latest) {
    throw new Error('No SEO/GEO audit matrix JSON found under exports/seo.');
  }

  return path.join(directory, latest);
}

function readReport(inputPath: string): AuditReport {
  return JSON.parse(fs.readFileSync(inputPath, 'utf8')) as AuditReport;
}

function hasCrawledNotIndexed(row: AuditRow): boolean {
  return row.issues.some((issue) => issue.code === 'coverage_crawled-not-indexed');
}

function localIssueCodes(row: AuditRow): string[] {
  return row.issues
    .map((issue) => issue.code)
    .filter((code) => !code.startsWith('gsc_') && !code.startsWith('coverage_'));
}

function lastCrawledDates(row: AuditRow): string[] {
  return row.issues
    .filter((issue) => issue.code === 'coverage_crawled-not-indexed')
    .map((issue) => issue.message.match(/Last crawled: ([0-9-]+)/)?.[1] || '')
    .filter(Boolean)
    .filter((date, index, dates) => dates.indexOf(date) === index)
    .sort();
}

function classify(row: AuditRow): Pick<ClassifiedRow, 'action' | 'actionReason'> {
  const localIssues = localIssueCodes(row);
  if (localIssues.length > 0) {
    return {
      action: 'content-refresh',
      actionReason: `Local quality issues remain: ${localIssues.join(', ')}.`,
    };
  }

  if (row.currentClicks === 0 && row.currentImpressions === 0) {
    return {
      action: 'request-indexing',
      actionReason:
        'No current GSC exposure; local blockers are clean, so URL Inspection and individual indexing request are the next useful action.',
    };
  }

  if (row.currentPosition > 0 && row.currentPosition <= 20) {
    return {
      action: 'monitor',
      actionReason:
        `Current average position is ${row.currentPosition.toFixed(2)}, so the coverage bucket may be stale or mixed; monitor before changing content.`,
    };
  }

  return {
    action: 'content-refresh',
    actionReason:
      row.currentPosition > 0
        ? `Current exposure exists but average position is ${row.currentPosition.toFixed(2)}; refresh intent fit and internal links before requesting indexing.`
        : 'Current exposure exists; live-inspect and monitor the stale coverage bucket before broad validation.',
  };
}

function priorityRank(priority: Priority): number {
  return { P0: 0, P1: 1, P2: 2, P3: 3 }[priority];
}

function actionRank(action: Action): number {
  return {
    'request-indexing': 0,
    'content-refresh': 1,
    monitor: 2,
  }[action];
}

function classifyRows(report: AuditReport, includeAllPriorities: boolean): ClassifiedRow[] {
  return report.rows
    .filter((row) => hasCrawledNotIndexed(row))
    .filter((row) => includeAllPriorities || row.priority === 'P0' || row.priority === 'P1')
    .map((row) => {
      const result = classify(row);
      return {
        ...row,
        ...result,
        lastCrawledDates: lastCrawledDates(row),
        localIssueCodes: localIssueCodes(row),
      };
    })
    .sort((left, right) => (
      actionRank(left.action) - actionRank(right.action)
      || priorityRank(left.priority) - priorityRank(right.priority)
      || right.clickLoss - left.clickLoss
      || right.impressionLoss - left.impressionLoss
      || right.score - left.score
      || left.url.localeCompare(right.url)
    ));
}

function summarize(rows: ClassifiedRow[]): ActionSummary[] {
  const summaries = new Map<Action, ActionSummary>();
  for (const row of rows) {
    const current = summaries.get(row.action) || {
      action: row.action,
      count: 0,
      clickLoss: 0,
      impressionLoss: 0,
    };
    current.count += 1;
    current.clickLoss += row.clickLoss;
    current.impressionLoss += row.impressionLoss;
    summaries.set(row.action, current);
  }

  return [...summaries.values()].sort((left, right) => actionRank(left.action) - actionRank(right.action));
}

function countBy<T extends string>(rows: ClassifiedRow[], getKey: (row: ClassifiedRow) => T): Record<T, number> {
  return rows.reduce<Record<T, number>>((counts, row) => {
    const key = getKey(row);
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {} as Record<T, number>);
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function formatLoss(row: ClassifiedRow): string {
  return `${row.clickLoss}/${row.impressionLoss}`;
}

function formatCurrent(row: ClassifiedRow): string {
  const position = row.currentPosition > 0 ? row.currentPosition.toFixed(2) : '-';
  return `${row.currentClicks}/${row.currentImpressions} @ ${position}`;
}

function renderRows(rows: ClassifiedRow[], action: Action): string[] {
  const actionRows = rows.filter((row) => row.action === action);
  if (actionRows.length === 0) {
    return ['_No rows._'];
  }

  const lines = [
    '| Priority | Score | URL | Last crawled | Loss c/i | Current c/i @ pos | Reason |',
    '|---|---:|---|---|---:|---:|---|',
  ];

  for (const row of actionRows) {
    lines.push(
      `| ${row.priority} | ${row.score} | \`${row.url}\` | ${row.lastCrawledDates.join('<br>') || 'unknown'} | ${formatLoss(row)} | ${formatCurrent(row)} | ${escapeCell(row.actionReason)} |`
    );
  }

  return lines;
}

const actions: Action[] = ['request-indexing', 'content-refresh', 'monitor'];

function csvCell(value: string | number): string {
  const text = String(value);
  if (!/[",\n]/.test(text)) {
    return text;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const next = text[index + 1];

    if (inQuotes) {
      if (character === '"' && next === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        inQuotes = false;
      } else {
        cell += character;
      }
      continue;
    }

    if (character === '"') {
      inQuotes = true;
    } else if (character === ',') {
      row.push(cell);
      cell = '';
    } else if (character === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (character !== '\r') {
      cell += character;
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function renderCsv(rows: ClassifiedRow[]): string {
  const headers = [
    'action',
    'priority',
    'score',
    'locale',
    'slug',
    'category',
    'url',
    'last_crawled',
    'click_loss',
    'impression_loss',
    'current_clicks',
    'current_impressions',
    'current_position',
    'previous_clicks',
    'previous_impressions',
    'previous_position',
    'local_issue_codes',
    'action_reason',
  ];

  const lines = [
    headers.join(','),
    ...rows.map((row) => [
      row.action,
      row.priority,
      row.score,
      row.locale,
      row.slug,
      row.category,
      row.url,
      row.lastCrawledDates.join(';'),
      row.clickLoss,
      row.impressionLoss,
      row.currentClicks,
      row.currentImpressions,
      row.currentPosition > 0 ? row.currentPosition.toFixed(2) : '',
      row.previousClicks,
      row.previousImpressions,
      row.previousPosition > 0 ? row.previousPosition.toFixed(2) : '',
      row.localIssueCodes.join(';'),
      row.actionReason,
    ].map(csvCell).join(',')),
  ];

  return `${lines.join('\n')}\n`;
}

function renderUrlList(rows: ClassifiedRow[]): string {
  return `${rows.map((row) => row.url).join('\n')}\n`;
}

function chunkRows<T>(rows: T[], batchSize: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < rows.length; index += batchSize) {
    chunks.push(rows.slice(index, index + batchSize));
  }

  return chunks;
}

function batchFileName(batchIndex: number, extension: 'csv' | 'txt'): string {
  return `batch-${String(batchIndex + 1).padStart(2, '0')}.${extension}`;
}

function readJsonObject(filePath: string): Record<string, unknown> | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
}

function recordValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function splitMessagePath(locale: string, slug: string): string {
  return path.join(process.cwd(), 'src/messages', locale, 'tools', `${slug}.json`);
}

function baseMessagePath(locale: string): string {
  return path.join(process.cwd(), 'src/messages', locale, 'base.json');
}

function relativeExistingPath(filePath: string): string | null {
  return fs.existsSync(filePath) ? path.relative(process.cwd(), filePath) : null;
}

function readToolMessages(locale: string, slug: string): Record<string, unknown> {
  const base = readJsonObject(baseMessagePath(locale));
  const split = readJsonObject(splitMessagePath(locale, slug));
  const baseToolMessages = recordValue(recordValue(base?.tools)[slug]);

  return {
    ...baseToolMessages,
    ...(split || {}),
  };
}

function toolMessageStats(locale: string, slug: string): ToolMessageStats {
  const messages = readToolMessages(locale, slug);
  const detailedDescription = messages.detailed_description;
  const usageSteps = messages.usage_steps;
  const usageExamples = messages.usage_examples;
  const faqs = messages.faqs;

  return {
    detailedDescriptionChars: typeof detailedDescription === 'string' ? detailedDescription.length : 0,
    usageSteps: Array.isArray(usageSteps) ? usageSteps.length : 0,
    usageExamples: Array.isArray(usageExamples) ? usageExamples.length : 0,
    faqs: Array.isArray(faqs) ? faqs.length : 0,
    hasSeoTitle: typeof messages.seo_title === 'string' && messages.seo_title.trim().length > 0,
    hasSeoDescription: typeof messages.seo_description === 'string' && messages.seo_description.trim().length > 0,
  };
}

function componentBySlug(): Map<string, string> {
  const components = new Map<string, string>();
  const configDir = path.join(process.cwd(), 'src/config/tools');
  if (!fs.existsSync(configDir)) {
    return components;
  }

  for (const fileName of fs.readdirSync(configDir)) {
    if (!fileName.endsWith('.ts')) continue;

    const contents = fs.readFileSync(path.join(configDir, fileName), 'utf8');
    for (const line of contents.split('\n')) {
      const match = line.match(/slug:\s*'([^']+)'.*component:\s*'([^']+)'/);
      if (match?.[1] && match[2]) {
        components.set(match[1], match[2]);
      }
    }
  }

  return components;
}

function componentPathForSlug(slug: string, components: Map<string, string>): string | null {
  const component = components.get(slug);
  if (!component) {
    return null;
  }

  return relativeExistingPath(path.join(process.cwd(), 'src/components/tools', `${component}.svelte`));
}

function qaFocus(row: ClassifiedRow, stats: ToolMessageStats): string[] {
  const focus = [
    'Verify the support copy against the live component before adding capability claims.',
    'Preserve or improve intent fit in the detailed description, steps, examples, and FAQs.',
  ];

  if (row.currentPosition > 20) {
    focus.push(`Average position is ${row.currentPosition.toFixed(2)}; strengthen query fit and internal-link context before another indexing push.`);
  } else if (row.currentPosition > 0) {
    focus.push(`Average position is ${row.currentPosition.toFixed(2)}; avoid broad rewrites unless the snippet or page promise is stale.`);
  }

  if (stats.detailedDescriptionChars < 500 || stats.usageSteps < 5 || stats.usageExamples < 3 || stats.faqs < 4) {
    focus.push('Support content is below the preferred high-value floor; expand it with grounded, tool-specific guidance.');
  }

  if (!stats.hasSeoTitle || !stats.hasSeoDescription) {
    focus.push('Merged/base TDK is present only if the base locale carries it; check before adding split overrides.');
  }

  if (row.locale !== 'en') {
    focus.push('Keep localization natural and avoid untranslated product or feature claims.');
  }

  return focus;
}

function buildContentRefreshBriefs(rows: ClassifiedRow[]): ContentRefreshBrief[] {
  const components = componentBySlug();

  return rows
    .filter((row) => row.action === 'content-refresh')
    .map((row) => {
      const stats = toolMessageStats(row.locale, row.slug);
      return {
        priority: row.priority,
        score: row.score,
        locale: row.locale,
        slug: row.slug,
        category: row.category,
        url: row.url,
        clickLoss: row.clickLoss,
        impressionLoss: row.impressionLoss,
        currentClicks: row.currentClicks,
        currentImpressions: row.currentImpressions,
        currentPosition: row.currentPosition,
        lastCrawledDates: row.lastCrawledDates,
        actionReason: row.actionReason,
        splitMessagePath: relativeExistingPath(splitMessagePath(row.locale, row.slug)),
        baseMessagePath: relativeExistingPath(baseMessagePath(row.locale)),
        componentPath: componentPathForSlug(row.slug, components),
        messageStats: stats,
        qaFocus: qaFocus(row, stats),
      };
    });
}

function formatBriefPath(filePath: string | null): string {
  return filePath ? `\`${filePath}\`` : '-';
}

function renderContentRefreshBriefReport(
  briefs: ContentRefreshBrief[],
  inputPath: string,
  includeAllPriorities: boolean
): string {
  const priorityScope = includeAllPriorities ? 'all priorities' : 'P0/P1 only';
  const lines = [
    '# GSC Content Refresh Briefs',
    '',
    `Generated at: ${new Date().toISOString()}`,
    `Source matrix: ${path.resolve(inputPath)}`,
    `Scope: ${priorityScope}`,
    '',
    '## Summary',
    '',
    `- Content-refresh rows: ${briefs.length}.`,
    `- Total click loss in this lane: ${briefs.reduce((total, brief) => total + brief.clickLoss, 0)}.`,
    `- Total impression loss in this lane: ${briefs.reduce((total, brief) => total + brief.impressionLoss, 0)}.`,
    '',
    '## Brief Index',
    '',
    '| Priority | URL | Loss c/i | Current c/i @ pos | Split copy | Component |',
    '|---|---|---:|---:|---|---|',
  ];

  for (const brief of briefs) {
    const currentPosition = brief.currentPosition > 0 ? brief.currentPosition.toFixed(2) : '-';
    lines.push(
      `| ${brief.priority} | \`${brief.url}\` | ${brief.clickLoss}/${brief.impressionLoss} | ${brief.currentClicks}/${brief.currentImpressions} @ ${currentPosition} | ${formatBriefPath(brief.splitMessagePath)} | ${formatBriefPath(brief.componentPath)} |`
    );
  }

  lines.push('', '## Page Briefs', '');

  for (const brief of briefs) {
    const stats = brief.messageStats;
    lines.push(
      `### ${brief.locale}/${brief.slug}`,
      '',
      `- URL: \`${brief.url}\``,
      `- Category: ${brief.category}; priority ${brief.priority}; score ${brief.score}.`,
      `- GSC loss: ${brief.clickLoss} clicks / ${brief.impressionLoss} impressions; current ${brief.currentClicks} clicks / ${brief.currentImpressions} impressions @ ${brief.currentPosition > 0 ? brief.currentPosition.toFixed(2) : '-'}.`,
      `- Last crawled: ${brief.lastCrawledDates.join(', ') || 'unknown'}.`,
      `- Reason: ${brief.actionReason}`,
      `- Files: split ${formatBriefPath(brief.splitMessagePath)}, base ${formatBriefPath(brief.baseMessagePath)}, component ${formatBriefPath(brief.componentPath)}.`,
      `- Support stats: detailed_description ${stats.detailedDescriptionChars} chars; steps ${stats.usageSteps}; examples ${stats.usageExamples}; FAQs ${stats.faqs}; SEO title ${stats.hasSeoTitle ? 'yes' : 'no'}; SEO description ${stats.hasSeoDescription ? 'yes' : 'no'}.`,
      '',
      'Refresh focus:',
      ...brief.qaFocus.map((item) => `- ${escapeCell(item)}`),
      ''
    );
  }

  return lines.join('\n');
}

function renderRequestIndexingBatchReport(
  requestRows: ClassifiedRow[],
  batchSize: number,
  batchDir: string,
  inputPath: string,
  includeAllPriorities: boolean
): string {
  const batches = chunkRows(requestRows, batchSize);
  const priorityScope = includeAllPriorities ? 'all priorities' : 'P0/P1 only';
  const lines = [
    '# GSC Request Indexing Batch Plan',
    '',
    `Generated at: ${new Date().toISOString()}`,
    `Source matrix: ${path.resolve(inputPath)}`,
    `Scope: ${priorityScope}`,
    `Batch size: ${batchSize}`,
    `Batch directory: ${path.resolve(batchDir)}`,
    '',
    '## Summary',
    '',
    `- Request-indexing rows: ${requestRows.length}.`,
    `- Batches: ${batches.length}.`,
    `- Total click loss in this lane: ${requestRows.reduce((total, row) => total + row.clickLoss, 0)}.`,
    `- Total impression loss in this lane: ${requestRows.reduce((total, row) => total + row.impressionLoss, 0)}.`,
    '',
    '## Batch Files',
    '',
    '| Batch | Rows | Click Loss | Impression Loss | CSV | URL list |',
    '|---:|---:|---:|---:|---|---|',
  ];

  batches.forEach((batch, batchIndex) => {
    lines.push(
      `| ${batchIndex + 1} | ${batch.length} | ${batch.reduce((total, row) => total + row.clickLoss, 0)} | ${batch.reduce((total, row) => total + row.impressionLoss, 0)} | \`${batchFileName(batchIndex, 'csv')}\` | \`${batchFileName(batchIndex, 'txt')}\` |`
    );
  });

  lines.push('', '## Batch Queues', '');

  batches.forEach((batch, batchIndex) => {
    lines.push(
      `### Batch ${batchIndex + 1}`,
      '',
      '| URL | Last crawled | Loss c/i |',
      '|---|---|---:|'
    );

    for (const row of batch) {
      lines.push(
        `| \`${row.url}\` | ${row.lastCrawledDates.join('<br>') || 'unknown'} | ${formatLoss(row)} |`
      );
    }

    lines.push('');
  });

  return lines.join('\n');
}

function readRequestIndexingLedgerRows(ledgerPath: string): Map<string, RequestIndexingLedgerRow> {
  if (!fs.existsSync(ledgerPath)) {
    return new Map();
  }

  const rows = parseCsv(fs.readFileSync(ledgerPath, 'utf8'));
  const headers = rows[0] || [];
  const indexes = new Map(headers.map((header, index) => [header, index]));
  const byUrl = new Map<string, RequestIndexingLedgerRow>();

  for (const row of rows.slice(1)) {
    const value = (header: string): string => row[indexes.get(header) ?? -1] || '';
    const url = value('url');
    if (!url) continue;

    byUrl.set(url, {
      batch: Number.parseInt(value('batch'), 10) || 0,
      status: value('status') || 'pending',
      url,
      priority: (value('priority') || 'P1') as Priority,
      score: Number.parseInt(value('score'), 10) || 0,
      locale: value('locale'),
      slug: value('slug'),
      category: value('category'),
      lastCrawled: value('last_crawled'),
      clickLoss: Number.parseInt(value('click_loss'), 10) || 0,
      impressionLoss: Number.parseInt(value('impression_loss'), 10) || 0,
      currentClicks: Number.parseInt(value('current_clicks'), 10) || 0,
      currentImpressions: Number.parseInt(value('current_impressions'), 10) || 0,
      previousClicks: Number.parseInt(value('previous_clicks'), 10) || 0,
      previousImpressions: Number.parseInt(value('previous_impressions'), 10) || 0,
      liveTestResult: value('live_test_result'),
      indexingRequestSubmitted: value('indexing_request_submitted') || 'no',
      inspectionDate: value('inspection_date'),
      requestDate: value('request_date'),
      notes: value('notes'),
    });
  }

  return byUrl;
}

function buildRequestIndexingLedgerRows(
  requestRows: ClassifiedRow[],
  batchSize: number,
  existingRows: Map<string, RequestIndexingLedgerRow>
): RequestIndexingLedgerRow[] {
  const batches = chunkRows(requestRows, batchSize);

  return batches.flatMap((batch, batchIndex) => batch.map((row) => {
    const existing = existingRows.get(row.url);

    return {
      batch: batchIndex + 1,
      status: existing?.status || 'pending',
      url: row.url,
      priority: row.priority,
      score: row.score,
      locale: row.locale,
      slug: row.slug,
      category: row.category,
      lastCrawled: row.lastCrawledDates.join(';'),
      clickLoss: row.clickLoss,
      impressionLoss: row.impressionLoss,
      currentClicks: row.currentClicks,
      currentImpressions: row.currentImpressions,
      previousClicks: row.previousClicks,
      previousImpressions: row.previousImpressions,
      liveTestResult: existing?.liveTestResult || '',
      indexingRequestSubmitted: existing?.indexingRequestSubmitted || 'no',
      inspectionDate: existing?.inspectionDate || '',
      requestDate: existing?.requestDate || '',
      notes: existing?.notes || '',
    };
  }));
}

function summarizeLedgerStatuses(ledgerRows: RequestIndexingLedgerRow[]): Record<string, number> {
  return ledgerRows.reduce<Record<string, number>>((counts, row) => {
    counts[row.status] = (counts[row.status] || 0) + 1;
    return counts;
  }, {});
}

function renderRequestIndexingLedgerCsv(ledgerRows: RequestIndexingLedgerRow[]): string {
  const headers = [
    'batch',
    'status',
    'url',
    'priority',
    'score',
    'locale',
    'slug',
    'category',
    'last_crawled',
    'click_loss',
    'impression_loss',
    'current_clicks',
    'current_impressions',
    'previous_clicks',
    'previous_impressions',
    'live_test_result',
    'indexing_request_submitted',
    'inspection_date',
    'request_date',
    'notes',
  ];

  const lines = [
    headers.join(','),
    ...ledgerRows.map((row) => [
      row.batch,
      row.status,
      row.url,
      row.priority,
      row.score,
      row.locale,
      row.slug,
      row.category,
      row.lastCrawled,
      row.clickLoss,
      row.impressionLoss,
      row.currentClicks,
      row.currentImpressions,
      row.previousClicks,
      row.previousImpressions,
      row.liveTestResult,
      row.indexingRequestSubmitted,
      row.inspectionDate,
      row.requestDate,
      row.notes,
    ].map(csvCell).join(',')),
  ];

  return `${lines.join('\n')}\n`;
}

function renderRequestIndexingLedgerReport(
  ledgerRows: RequestIndexingLedgerRow[],
  batchSize: number,
  ledgerCsvPath: string,
  inputPath: string,
  includeAllPriorities: boolean
): string {
  const batches = chunkRows(ledgerRows, batchSize);
  const priorityScope = includeAllPriorities ? 'all priorities' : 'P0/P1 only';
  const statusCounts = summarizeLedgerStatuses(ledgerRows);
  const lines = [
    '# GSC Request Indexing Inspection Ledger',
    '',
    `Generated at: ${new Date().toISOString()}`,
    `Source matrix: ${path.resolve(inputPath)}`,
    `Scope: ${priorityScope}`,
    `Batch size: ${batchSize}`,
    `Editable CSV ledger: ${path.resolve(ledgerCsvPath)}`,
    '',
    '## Summary',
    '',
    `- Request-indexing rows: ${ledgerRows.length}.`,
    `- Batches: ${batches.length}.`,
    `- Total click loss in this lane: ${ledgerRows.reduce((total, row) => total + row.clickLoss, 0)}.`,
    `- Total impression loss in this lane: ${ledgerRows.reduce((total, row) => total + row.impressionLoss, 0)}.`,
    '',
    '## Status Summary',
    '',
    '| Status | Rows |',
    '|---|---:|',
    ...Object.entries(statusCounts)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([status, count]) => `| ${status} | ${count} |`),
    '',
    '## Status Values',
    '',
    '- `pending`: not inspected in URL Inspection yet.',
    '- `live-tested`: live URL test passed but indexing request has not been submitted.',
    '- `request-submitted`: live URL test passed and individual indexing request was submitted.',
    '- `already-indexed`: URL Inspection shows the canonical URL is already indexed.',
    '- `blocked`: live URL test failed or Google reports a current blocker.',
    '- `skipped`: intentionally deferred because quota, duplication, or fresh evidence changed priority.',
    '',
    '## Execution Guardrails',
    '',
    '- Inspect one URL at a time in GSC URL Inspection; do not use broad validation for this mixed stale bucket.',
    '- Run live URL test before submitting an indexing request.',
    '- Record `already-indexed` instead of requesting indexing if URL Inspection says the canonical URL is indexed.',
    '- Record any live blocker in `notes` and move that URL back to code/content remediation before another request.',
    '',
    '## Batch Ledger',
    '',
  ];

  batches.forEach((batch, batchIndex) => {
    lines.push(
      `### Batch ${batchIndex + 1}`,
      '',
      '| Status | URL | Last crawled | Loss c/i | Live test | Request submitted | Notes |',
      '|---|---|---|---:|---|---|---|'
    );

    for (const row of batch) {
      lines.push(
        `| ${escapeCell(row.status)} | \`${row.url}\` | ${escapeCell(row.lastCrawled || 'unknown')} | ${row.clickLoss}/${row.impressionLoss} | ${escapeCell(row.liveTestResult)} | ${escapeCell(row.indexingRequestSubmitted || 'no')} | ${escapeCell(row.notes)} |`
      );
    }

    lines.push('');
  });

  return lines.join('\n');
}

function renderReport(rows: ClassifiedRow[], inputPath: string, includeAllPriorities: boolean): string {
  const summaries = summarize(rows);
  const byLocale = countBy(rows, (row) => row.locale);
  const allLastCrawled = rows.flatMap((row) => row.lastCrawledDates).sort();
  const priorityScope = includeAllPriorities ? 'all priorities' : 'P0/P1 only';

  const lines = [
    '# GSC Crawled Not Indexed Action Matrix',
    '',
    `Generated at: ${new Date().toISOString()}`,
    `Source matrix: ${path.resolve(inputPath)}`,
    `Scope: ${priorityScope}`,
    '',
    '## Executive Summary',
    '',
    `- Rows classified: ${rows.length}.`,
    `- Last-crawled window: ${allLastCrawled[0] || 'unknown'} to ${allLastCrawled.at(-1) || 'unknown'}.`,
    `- Local residual blockers in scoped rows: ${rows.filter((row) => row.localIssueCodes.length > 0).length}.`,
    '',
    '| Action | Rows | Click Loss | Impression Loss |',
    '|---|---:|---:|---:|',
    ...summaries.map((summary) =>
      `| ${summary.action} | ${summary.count} | ${summary.clickLoss} | ${summary.impressionLoss} |`
    ),
    '',
    '## Locale Split',
    '',
    '| Locale | Rows |',
    '|---|---:|',
    ...Object.entries(byLocale)
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .map(([locale, count]) => `| ${locale} | ${count} |`),
    '',
    '## Action Definitions',
    '',
    '- `request-indexing`: no current GSC exposure and no local blocker remains; run URL Inspection, test live URL, then request indexing individually when quota allows.',
    '- `content-refresh`: Google still shows some current exposure but weak average position, or local quality debt remains; improve intent fit/internal links before another indexing request.',
    '- `monitor`: current ranking/exposure is already healthy enough that the coverage bucket is likely stale or mixed; avoid content churn and watch recrawl.',
    '',
    '## Request Indexing Queue',
    '',
    ...renderRows(rows, 'request-indexing'),
    '',
    '## Content Refresh / Internal Link Queue',
    '',
    ...renderRows(rows, 'content-refresh'),
    '',
    '## Monitor Stale Bucket',
    '',
    ...renderRows(rows, 'monitor'),
    '',
  ];

  return lines.join('\n');
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const dateStamp = localDateStamp();
  const inputPath = path.resolve(args.input || latestAuditMatrixPath());
  const outputPath = path.resolve(args.output || `docs/GSC_CRAWLED_NOT_INDEXED_ACTION_MATRIX_${dateStamp}.md`);
  const jsonPath = path.resolve(args.jsonOut || `exports/seo/gsc-crawled-not-indexed-action-matrix-${dateStamp}.json`);
  const csvPath = path.resolve(args.csvOut || `exports/seo/gsc-crawled-not-indexed-action-matrix-${dateStamp}.csv`);
  const queueDir = path.resolve(args.queueDir || `exports/seo/gsc-crawled-not-indexed-queues/${dateStamp}`);
  const batchPath = path.resolve(args.batchOut || `docs/GSC_REQUEST_INDEXING_BATCHES_${dateStamp}.md`);
  const contentRefreshBriefPath = path.resolve(
    args.contentRefreshBriefOut || `docs/GSC_CONTENT_REFRESH_BRIEFS_${dateStamp}.md`
  );
  const contentRefreshJsonPath = path.resolve(
    args.contentRefreshJsonOut || `exports/seo/gsc-content-refresh-briefs-${dateStamp}.json`
  );
  const requestIndexingLedgerPath = path.resolve(
    args.requestIndexingLedgerOut || path.join(queueDir, 'request-indexing-inspection-ledger.csv')
  );
  const requestIndexingLedgerReportPath = path.resolve(
    args.requestIndexingLedgerReportOut || `docs/GSC_REQUEST_INDEXING_INSPECTION_LEDGER_${dateStamp}.md`
  );
  const requestIndexingBatchDir = path.join(queueDir, 'request-indexing-batches');
  const report = readReport(inputPath);
  const rows = classifyRows(report, args.includeAllPriorities);
  const requestIndexingRows = rows.filter((row) => row.action === 'request-indexing');
  const requestIndexingBatches = chunkRows(requestIndexingRows, args.batchSize);
  const contentRefreshBriefs = buildContentRefreshBriefs(rows);
  const requestIndexingLedgerRows = buildRequestIndexingLedgerRows(
    requestIndexingRows,
    args.batchSize,
    readRequestIndexingLedgerRows(requestIndexingLedgerPath)
  );

  const jsonReport = {
    generatedAt: new Date().toISOString(),
    sourceMatrix: inputPath,
    scope: args.includeAllPriorities ? 'all-priorities' : 'p0-p1',
    totals: {
      rows: rows.length,
      byAction: summarize(rows),
      byLocale: countBy(rows, (row) => row.locale),
      requestIndexingBatchSize: args.batchSize,
      requestIndexingBatches: requestIndexingBatches.map((batch, index) => ({
        batch: index + 1,
        rows: batch.length,
        clickLoss: batch.reduce((total, row) => total + row.clickLoss, 0),
        impressionLoss: batch.reduce((total, row) => total + row.impressionLoss, 0),
      })),
    },
    rows,
  };

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.mkdirSync(path.dirname(csvPath), { recursive: true });
  fs.mkdirSync(queueDir, { recursive: true });
  fs.mkdirSync(path.dirname(batchPath), { recursive: true });
  fs.mkdirSync(path.dirname(contentRefreshBriefPath), { recursive: true });
  fs.mkdirSync(path.dirname(contentRefreshJsonPath), { recursive: true });
  fs.mkdirSync(path.dirname(requestIndexingLedgerPath), { recursive: true });
  fs.mkdirSync(path.dirname(requestIndexingLedgerReportPath), { recursive: true });
  fs.mkdirSync(requestIndexingBatchDir, { recursive: true });
  fs.writeFileSync(outputPath, renderReport(rows, inputPath, args.includeAllPriorities), 'utf8');
  fs.writeFileSync(jsonPath, `${JSON.stringify(jsonReport, null, 2)}\n`, 'utf8');
  fs.writeFileSync(csvPath, renderCsv(rows), 'utf8');
  fs.writeFileSync(
    batchPath,
    renderRequestIndexingBatchReport(
      requestIndexingRows,
      args.batchSize,
      requestIndexingBatchDir,
      inputPath,
      args.includeAllPriorities
    ),
    'utf8'
  );
  fs.writeFileSync(
    contentRefreshBriefPath,
    renderContentRefreshBriefReport(contentRefreshBriefs, inputPath, args.includeAllPriorities),
    'utf8'
  );
  fs.writeFileSync(
    contentRefreshJsonPath,
    `${JSON.stringify({
      generatedAt: new Date().toISOString(),
      sourceMatrix: inputPath,
      scope: args.includeAllPriorities ? 'all-priorities' : 'p0-p1',
      briefs: contentRefreshBriefs,
    }, null, 2)}\n`,
    'utf8'
  );
  fs.writeFileSync(
    requestIndexingLedgerPath,
    renderRequestIndexingLedgerCsv(requestIndexingLedgerRows),
    'utf8'
  );
  fs.writeFileSync(
    requestIndexingLedgerReportPath,
    renderRequestIndexingLedgerReport(
      requestIndexingLedgerRows,
      args.batchSize,
      requestIndexingLedgerPath,
      inputPath,
      args.includeAllPriorities
    ),
    'utf8'
  );

  for (const action of actions) {
    fs.writeFileSync(
      path.join(queueDir, `${action}.csv`),
      renderCsv(rows.filter((row) => row.action === action)),
      'utf8'
    );
  }

  fs.writeFileSync(
    path.join(queueDir, 'request-indexing-urls.txt'),
    renderUrlList(requestIndexingRows),
    'utf8'
  );

  requestIndexingBatches.forEach((batch, batchIndex) => {
    fs.writeFileSync(
      path.join(requestIndexingBatchDir, batchFileName(batchIndex, 'csv')),
      renderCsv(batch),
      'utf8'
    );
    fs.writeFileSync(
      path.join(requestIndexingBatchDir, batchFileName(batchIndex, 'txt')),
      renderUrlList(batch),
      'utf8'
    );
  });

  console.log(`GSC crawled-not-indexed action matrix written to ${outputPath}`);
  console.log(`JSON export written to ${jsonPath}`);
  console.log(`CSV export written to ${csvPath}`);
  console.log(`Action queue CSVs written to ${queueDir}`);
  console.log(`Request-indexing batch plan written to ${batchPath}`);
  console.log(`Request-indexing batch files written to ${requestIndexingBatchDir}`);
  console.log(`Content-refresh brief report written to ${contentRefreshBriefPath}`);
  console.log(`Content-refresh brief JSON written to ${contentRefreshJsonPath}`);
  console.log(`Request-indexing inspection ledger written to ${requestIndexingLedgerPath}`);
  console.log(`Request-indexing inspection ledger report written to ${requestIndexingLedgerReportPath}`);
  for (const summary of summarize(rows)) {
    console.log(`${summary.action}: ${summary.count}`);
  }
}

main();
