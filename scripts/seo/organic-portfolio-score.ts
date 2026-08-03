import fs from 'node:fs';
import path from 'node:path';

import { tools } from '../../src/config/tools/index';
import { locales, type Locale } from '../../src/lib/i18n';
import {
  getOrganicSearchProfile,
  organicPortfolioScore,
  organicSearchProfiles,
  type OrganicPortfolioTier,
} from '../../src/lib/organic-search-portfolio';

interface Args {
  csvOut: string;
  jsonOut: string;
  reportOut: string;
}

interface PortfolioRow {
  locale: Locale;
  slug: string;
  url: string;
  category: string;
  tier: OrganicPortfolioTier;
  status: string;
  score: number;
  demand: number;
  functionalCompleteness: number;
  uniqueEvidence: number;
  achievableCompetition: number;
  trustAndRisk: number;
  localization: number;
  evidenceStatus: 'documented' | 'needs-demand-review';
  primaryIntent: string;
  demandEvidence: string;
  recommendedAction: string;
}

const SITE_BASE = 'https://www.u2tool.com';
const jsonCache = new Map<string, Record<string, unknown>>();

function dateStamp(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function parseArgs(args: string[]): Args {
  const stamp = dateStamp();
  const parsed: Args = {
    csvOut: `exports/seo/organic-portfolio-${stamp}.csv`,
    jsonOut: `exports/seo/organic-portfolio-${stamp}.json`,
    reportOut: `docs/ORGANIC_SEARCH_PORTFOLIO_${stamp}.md`,
  };

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];
    const next = args[index + 1];
    if (!next) continue;
    if (current === '--csv-out') parsed.csvOut = next;
    if (current === '--json-out') parsed.jsonOut = next;
    if (current === '--report-out') parsed.reportOut = next;
    if (current.startsWith('--')) index += 1;
  }

  return parsed;
}

function readJson(filePath: string): Record<string, unknown> {
  const cached = jsonCache.get(filePath);
  if (cached) return cached;
  if (!fs.existsSync(filePath)) return {};
  const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
  jsonCache.set(filePath, parsed);
  return parsed;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toolMessages(locale: Locale, slug: string): Record<string, unknown> {
  const root = readJson(path.join(process.cwd(), 'src/messages', `${locale}.json`));
  const base = readJson(path.join(process.cwd(), 'src/messages', locale, 'base.json'));
  const split = readJson(path.join(process.cwd(), 'src/messages', locale, 'tools', `${slug}.json`));
  const baseTool = isObject(base.tools) && isObject(base.tools[slug]) ? base.tools[slug] : {};
  const rootTool = isObject(root.tools) && isObject(root.tools[slug]) ? root.tools[slug] : {};
  return { ...baseTool, ...rootTool, ...split };
}

function stringValue(source: Record<string, unknown>, key: string): string {
  return typeof source[key] === 'string' ? source[key].trim() : '';
}

function arrayLength(source: Record<string, unknown>, key: string): number {
  return Array.isArray(source[key]) ? source[key].length : 0;
}

function sourceOnlyScores(
  locale: Locale,
  slug: string,
  component: string
): {
  functionalCompleteness: number;
  uniqueEvidence: number;
  trustAndRisk: number;
  localization: number;
} {
  const messages = toolMessages(locale, slug);
  const description = stringValue(messages, 'detailed_description');
  const steps = arrayLength(messages, 'usage_steps');
  const examples = arrayLength(messages, 'usage_examples');
  const faqs = arrayLength(messages, 'faqs');
  const componentExists = fs.existsSync(
    path.join(process.cwd(), 'src/components/tools', `${component}.svelte`)
  );
  const splitExists = fs.existsSync(
    path.join(process.cwd(), 'src/messages', locale, 'tools', `${slug}.json`)
  );

  const functionalCompleteness = Math.min(
    25,
    (componentExists ? 15 : 0)
      + (description ? 4 : 0)
      + (steps >= 5 ? 2 : 0)
      + (examples >= 4 ? 2 : 0)
      + (faqs >= 5 ? 2 : 0)
  );
  const uniqueEvidence = Math.min(
    20,
    (description ? 5 : 0)
      + (description.length >= 300 ? 5 : 0)
      + (examples >= 4 ? 5 : 0)
      + (faqs >= 5 ? 5 : 0)
  );
  const trustAndRisk = description && steps >= 3 && faqs >= 3 ? 8 : 3;
  const localization = splitExists ? 5 : 0;

  return { functionalCompleteness, uniqueEvidence, trustAndRisk, localization };
}

function recommendedAction(status: string): string {
  if (status === 'active-recovery') return 'rehabilitate-and-measure';
  if (status === 'capability-first') return 'build-capability-before-query-expansion';
  if (status === 'governance-hold') return 'hold-no-publication';
  if (status === 'candidate') return 'validate-query-and-prepare-next-batch';
  return 'review-demand-before-any-index-change';
}

function buildRows(): PortfolioRow[] {
  const rows: PortfolioRow[] = [];

  for (const locale of locales) {
    for (const tool of tools) {
      const profile = getOrganicSearchProfile(locale, tool.slug);
      const url = `${SITE_BASE}/${locale}/tools/${tool.slug}/`;

      if (profile) {
        rows.push({
          locale,
          slug: tool.slug,
          url,
          category: tool.category,
          tier: profile.tier,
          status: profile.status,
          score: organicPortfolioScore(profile),
          ...profile.scores,
          evidenceStatus: 'documented',
          primaryIntent: profile.primaryIntent,
          demandEvidence: profile.demandEvidence,
          recommendedAction: recommendedAction(profile.status),
        });
        continue;
      }

      const sourceScores = sourceOnlyScores(locale, tool.slug, tool.component);
      const score =
        sourceScores.functionalCompleteness
        + sourceScores.uniqueEvidence
        + sourceScores.trustAndRisk
        + sourceScores.localization;

      rows.push({
        locale,
        slug: tool.slug,
        url,
        category: tool.category,
        tier: score >= 30 ? 'P2' : 'P3',
        status: 'unassessed',
        score,
        demand: 0,
        ...sourceScores,
        achievableCompetition: 0,
        evidenceStatus: 'needs-demand-review',
        primaryIntent: '',
        demandEvidence: '',
        recommendedAction: recommendedAction('unassessed'),
      });
    }
  }

  return rows.sort((left, right) => {
    const evidenceOrder = Number(right.evidenceStatus === 'documented')
      - Number(left.evidenceStatus === 'documented');
    return evidenceOrder || right.score - left.score || left.url.localeCompare(right.url);
  });
}

function csvCell(value: unknown): string {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function writeCsv(filePath: string, rows: PortfolioRow[]): void {
  const headers: Array<keyof PortfolioRow> = [
    'locale',
    'slug',
    'url',
    'category',
    'tier',
    'status',
    'score',
    'demand',
    'functionalCompleteness',
    'uniqueEvidence',
    'achievableCompetition',
    'trustAndRisk',
    'localization',
    'evidenceStatus',
    'primaryIntent',
    'demandEvidence',
    'recommendedAction',
  ];
  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(',')),
  ];
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`);
}

function writeReport(filePath: string, rows: PortfolioRow[]): void {
  const documentedRows = rows.filter((row) => row.evidenceStatus === 'documented');
  const counts = new Map<OrganicPortfolioTier, number>([
    ['P0', 0],
    ['P1', 0],
    ['P2', 0],
    ['P3', 0],
  ]);
  for (const row of rows) counts.set(row.tier, (counts.get(row.tier) ?? 0) + 1);

  const lines = [
    `# Organic Search Portfolio - ${dateStamp()}`,
    '',
    '## Safety boundary',
    '',
    'This inventory scores every locale/tool route from current source evidence. Only rows marked `documented` have direct GSC/release evidence. An unassessed P2/P3 row is not an automatic noindex or removal decision; fresh complete GSC data, backlinks, and live index state must be checked first.',
    '',
    '## Inventory',
    '',
    `- Tools: ${tools.length}`,
    `- Locales: ${locales.length}`,
    `- Locale/tool URLs: ${rows.length}`,
    `- Documented profiles: ${documentedRows.length}`,
    `- P0: ${counts.get('P0')}`,
    `- P1: ${counts.get('P1')}`,
    `- P2: ${counts.get('P2')}`,
    `- P3: ${counts.get('P3')}`,
    '',
    '## Documented recovery portfolio',
    '',
    '| Tier | Status | Score | URL | Primary intent | Next action |',
    '|---|---|---:|---|---|---|',
    ...documentedRows.map(
      (row) =>
        `| ${row.tier} | ${row.status} | ${row.score} | \`${row.url}\` | ${row.primaryIntent} | ${row.recommendedAction} |`
    ),
    '',
    '## Scoring model',
    '',
    '| Dimension | Maximum |',
    '|---|---:|',
    '| Search demand | 30 |',
    '| Functional completeness | 25 |',
    '| Unique evidence | 20 |',
    '| Achievable competition | 10 |',
    '| Trust and risk | 10 |',
    '| Localization quality | 5 |',
    '',
    'Thresholds are P0 >= 70, P1 50-69, P2 30-49, and P3 < 30 for documented profiles. Source-only rows are capped at P2 because missing demand evidence must never be interpreted as proven zero demand.',
    '',
    '## Execution order',
    '',
    '1. Rehabilitate and measure the four active P0 profiles.',
    '2. Build missing Gantt capabilities before expanding its keyword footprint.',
    '3. Validate Spanish word-counter demand for the next batch.',
    '4. Keep Hex on governance hold.',
    '5. Import a fresh complete GSC export before making P2/P3 index decisions.',
    '',
  ];

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, lines.join('\n'));
}

const args = parseArgs(process.argv.slice(2));
const rows = buildRows();
writeCsv(args.csvOut, rows);
fs.mkdirSync(path.dirname(args.jsonOut), { recursive: true });
fs.writeFileSync(
  args.jsonOut,
  `${JSON.stringify({ generatedAt: new Date().toISOString(), profiles: organicSearchProfiles, rows }, null, 2)}\n`
);
writeReport(args.reportOut, rows);

console.log(
  JSON.stringify({
    rows: rows.length,
    documented: rows.filter((row) => row.evidenceStatus === 'documented').length,
    csvOut: args.csvOut,
    jsonOut: args.jsonOut,
    reportOut: args.reportOut,
  })
);
