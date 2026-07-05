import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { getToolBySlug, getToolsByCategory, type ToolCategory } from '@/config/tools';
import { buildCategoryDiscoverySpotlights } from '@/lib/discovery-surface';
import { getLocalizedPath, type Locale } from '@/lib/i18n';
import { getRelatedToolsForTool } from '@/lib/related-tools';
import { buildPriorityIndexNowUrls } from '@/lib/seo-discovery';

type CoverageStatus = 'covered' | 'watch' | 'gap';

interface Args {
  csvOut?: string;
  input?: string;
  output?: string;
}

interface ContentRefreshRow {
  action: string;
  priority: string;
  score: string;
  locale: Locale;
  slug: string;
  category: ToolCategory;
  url: string;
  last_crawled: string;
  click_loss: string;
  impression_loss: string;
  current_clicks: string;
  current_impressions: string;
  current_position: string;
  previous_clicks: string;
  previous_impressions: string;
  previous_position: string;
  local_issue_codes: string;
  action_reason: string;
}

interface AuditRow {
  categorySource: string;
  categorySourcePresent: boolean;
  discoverySpotlightSources: string[];
  inboundRelatedSources: string[];
  missingSignals: string[];
  priorityDiscoveryPresent: boolean;
  relatedOutboundSlugs: string[];
  row: ContentRefreshRow;
  status: CoverageStatus;
}

const REQUIRED_COLUMNS = [
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
] as const;

const categoryNames = new Proxy<Record<string, string>>({}, {
  get: (_target, property) => String(property),
});

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

function localDateStamp(): string {
  return new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
  }).format(new Date());
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells;
}

function parseCsv(content: string): Array<Record<string, string>> {
  const lines = content.split(/\r?\n/).filter((line) => line.length > 0);
  const [headerLine, ...rowLines] = lines;
  if (!headerLine) {
    return [];
  }

  const headers = parseCsvLine(headerLine);
  return rowLines.map((line) => {
    const cells = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] || '']));
  });
}

function readRows(inputPath: string): ContentRefreshRow[] {
  const rows = parseCsv(fs.readFileSync(inputPath, 'utf8'));
  const missingColumns = REQUIRED_COLUMNS.filter((column) => !Object.hasOwn(rows[0] || {}, column));

  if (missingColumns.length > 0) {
    throw new Error(`${inputPath} is missing columns: ${missingColumns.join(', ')}`);
  }

  return rows.map((row) => {
    const typed: Partial<ContentRefreshRow> = {};
    for (const column of REQUIRED_COLUMNS) {
      typed[column] = row[column] || '';
    }
    return typed as ContentRefreshRow;
  });
}

function normalizedUrl(value: string): string {
  return value.endsWith('/') ? value : `${value}/`;
}

function buildSpotlightSources(row: ContentRefreshRow): string[] {
  const spotlights = buildCategoryDiscoverySpotlights(
    row.locale,
    categoryNames,
    {},
    {},
  );
  const spotlight = spotlights.find((candidate) =>
    candidate.category === row.category && candidate.tools.some((tool) => tool.slug === row.slug)
  );

  if (!spotlight) {
    return [];
  }

  return [
    getLocalizedPath(row.locale, '/'),
    getLocalizedPath(row.locale, '/tools/'),
    getLocalizedPath(row.locale, '/ai/'),
  ];
}

function buildInboundRelatedSources(row: ContentRefreshRow): string[] {
  const candidates = getToolsByCategory(row.category)
    .filter((tool) => tool.slug !== row.slug)
    .filter((tool) => getRelatedToolsForTool(tool, 6).some((relatedTool) => relatedTool.slug === row.slug));

  return candidates.map((tool) => getLocalizedPath(row.locale, `/tools/${tool.slug}/`));
}

function buildAuditRow(row: ContentRefreshRow, priorityUrls: Set<string>): AuditRow {
  const tool = getToolBySlug(row.slug);
  if (!tool) {
    throw new Error(`Unknown tool slug in content-refresh queue: ${row.slug}`);
  }

  if (tool.category !== row.category) {
    throw new Error(`Category mismatch for ${row.slug}: queue=${row.category}, registry=${tool.category}`);
  }

  const targetUrl = normalizedUrl(row.url);
  const categorySource = getLocalizedPath(row.locale, `/categories/${row.category}/`);
  const discoverySpotlightSources = buildSpotlightSources(row);
  const inboundRelatedSources = buildInboundRelatedSources(row);
  const relatedOutboundSlugs = getRelatedToolsForTool(tool, 6).map((relatedTool) => relatedTool.slug);
  const priorityDiscoveryPresent = priorityUrls.has(targetUrl);
  const categorySourcePresent = getToolsByCategory(row.category).some((candidate) => candidate.slug === row.slug);
  const missingSignals: string[] = [];

  if (!priorityDiscoveryPresent) {
    missingSignals.push('missing_priority_discovery');
  }

  if (!categorySourcePresent) {
    missingSignals.push('missing_category_listing');
  }

  if (discoverySpotlightSources.length === 0) {
    missingSignals.push('missing_category_spotlight');
  }

  if (inboundRelatedSources.length < 3) {
    missingSignals.push('low_related_tool_inbound_links');
  }

  const status: CoverageStatus = missingSignals.some((signal) => signal.startsWith('missing_'))
    ? 'gap'
    : missingSignals.length > 0
      ? 'watch'
      : 'covered';

  return {
    categorySource,
    categorySourcePresent,
    discoverySpotlightSources,
    inboundRelatedSources,
    missingSignals,
    priorityDiscoveryPresent,
    relatedOutboundSlugs,
    row,
    status,
  };
}

function countBy<T extends string>(rows: AuditRow[], getKey: (row: AuditRow) => T): Record<T, number> {
  return rows.reduce<Record<T, number>>((counts, row) => {
    const key = getKey(row);
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {} as Record<T, number>);
}

function csvCell(value: string | number | boolean | undefined): string {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function renderCsv(rows: AuditRow[]): string {
  const headers = [
    'status',
    'locale',
    'slug',
    'category',
    'url',
    'priority_discovery_present',
    'category_source_present',
    'category_source',
    'discovery_spotlight_sources',
    'inbound_related_link_count',
    'inbound_related_sources',
    'outbound_related_slugs',
    'missing_signals',
    'click_loss',
    'impression_loss',
    'current_position',
  ];

  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push([
      row.status,
      row.row.locale,
      row.row.slug,
      row.row.category,
      row.row.url,
      row.priorityDiscoveryPresent,
      row.categorySourcePresent,
      row.categorySource,
      row.discoverySpotlightSources.join(';'),
      row.inboundRelatedSources.length,
      row.inboundRelatedSources.join(';'),
      row.relatedOutboundSlugs.join(';'),
      row.missingSignals.join(';'),
      row.row.click_loss,
      row.row.impression_loss,
      row.row.current_position,
    ].map(csvCell).join(','));
  }

  return `${lines.join('\n')}\n`;
}

function renderStatusSummary(rows: AuditRow[]): string[] {
  const counts = countBy(rows, (row) => row.status);
  const statuses: CoverageStatus[] = ['covered', 'watch', 'gap'];

  return [
    '| Status | Rows |',
    '|---|---:|',
    ...statuses.map((status) => `| ${status} | ${counts[status] || 0} |`),
  ];
}

function renderRows(rows: AuditRow[]): string[] {
  const lines = [
    '| Status | URL | Priority discovery | Category source | Spotlight sources | Related inbound | Missing signals |',
    '|---|---|---:|---|---:|---:|---|',
  ];

  for (const row of rows) {
    lines.push(
      `| ${row.status} | \`${escapeCell(row.row.url)}\` | ${row.priorityDiscoveryPresent ? 'yes' : 'no'} | \`${escapeCell(row.categorySource)}\` | ${row.discoverySpotlightSources.length} | ${row.inboundRelatedSources.length} | ${escapeCell(row.missingSignals.join('; ') || 'none')} |`
    );
  }

  return lines;
}

function renderInboundDetails(rows: AuditRow[]): string[] {
  const lines: string[] = [];

  for (const row of rows) {
    lines.push(
      `### ${row.row.locale}/${row.row.slug}`,
      '',
      `- Target: \`${row.row.url}\``,
      `- Category page: \`${row.categorySource}\``,
      `- Discovery spotlight sources: ${row.discoverySpotlightSources.map((source) => `\`${source}\``).join(', ') || 'none'}.`,
      `- Related-tool inbound sources (${row.inboundRelatedSources.length}): ${row.inboundRelatedSources.slice(0, 12).map((source) => `\`${source}\``).join(', ') || 'none'}.`,
      `- Outbound related tools: ${row.relatedOutboundSlugs.map((slug) => `\`${slug}\``).join(', ') || 'none'}.`,
      ''
    );
  }

  return lines;
}

function renderReport(rows: AuditRow[], inputPath: string, csvPath: string): string {
  const statusCounts = countBy(rows, (row) => row.status);
  const totalRelatedInbound = rows.reduce((sum, row) => sum + row.inboundRelatedSources.length, 0);
  const totalClickLoss = rows.reduce((sum, row) => sum + (Number.parseInt(row.row.click_loss, 10) || 0), 0);
  const totalImpressionLoss = rows.reduce((sum, row) => sum + (Number.parseInt(row.row.impression_loss, 10) || 0), 0);

  const lines = [
    '# GSC Content Refresh Internal Link Audit',
    '',
    `Generated at: ${new Date().toISOString()}`,
    `Source queue: ${path.resolve(inputPath)}`,
    `CSV export: ${path.resolve(csvPath)}`,
    '',
    '## Summary',
    '',
    `- Content-refresh URLs audited: ${rows.length}.`,
    `- Covered: ${statusCounts.covered || 0}.`,
    `- Watch: ${statusCounts.watch || 0}.`,
    `- Gap: ${statusCounts.gap || 0}.`,
    `- Related-tool inbound links found: ${totalRelatedInbound}.`,
    `- Total click loss in this lane: ${totalClickLoss}.`,
    `- Total impression loss in this lane: ${totalImpressionLoss}.`,
    '',
    '## Status Summary',
    '',
    ...renderStatusSummary(rows),
    '',
    '## URL Coverage',
    '',
    ...renderRows(rows),
    '',
    '## Inbound Details',
    '',
    ...renderInboundDetails(rows),
  ];

  return lines.join('\n');
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const dateStamp = localDateStamp();
  const defaultQueueDir = `exports/seo/gsc-crawled-not-indexed-queues/${dateStamp}`;
  const inputPath = path.resolve(args.input || path.join(defaultQueueDir, 'content-refresh.csv'));
  const outputPath = path.resolve(args.output || `docs/GSC_CONTENT_REFRESH_INTERNAL_LINK_AUDIT_${dateStamp}.md`);
  const csvPath = path.resolve(args.csvOut || path.join(defaultQueueDir, 'content-refresh-internal-link-audit.csv'));
  const rows = readRows(inputPath);

  if (rows.length === 0) {
    throw new Error(`No content-refresh rows found in ${inputPath}`);
  }

  const priorityUrls = new Set(buildPriorityIndexNowUrls('https://www.u2tool.com/', {
    selectedLocales: [...new Set(rows.map((row) => row.locale))],
  }));
  const auditRows = rows.map((row) => buildAuditRow(row, priorityUrls));

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.mkdirSync(path.dirname(csvPath), { recursive: true });
  fs.writeFileSync(csvPath, renderCsv(auditRows), 'utf8');
  fs.writeFileSync(outputPath, renderReport(auditRows, inputPath, csvPath), 'utf8');

  const counts = countBy(auditRows, (row) => row.status);
  console.log(`GSC content-refresh internal link audit written to ${outputPath}`);
  console.log(`CSV export written to ${csvPath}`);
  console.log(`covered=${counts.covered || 0} watch=${counts.watch || 0} gap=${counts.gap || 0}`);
}

main();
