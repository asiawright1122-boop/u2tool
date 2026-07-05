import fs from 'node:fs';
import path from 'node:path';
import { argv } from 'node:process';

type Priority = 'P0' | 'P1' | 'P2' | 'P3';

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
  action: string;
  currentClicks: number;
  previousClicks: number;
  clickLoss: number;
  currentImpressions: number;
  previousImpressions: number;
  impressionLoss: number;
  currentPosition: number;
  previousPosition: number;
  issues: AuditIssue[];
}

interface AuditReport {
  generatedAt: string;
  rows: AuditRow[];
}

interface Worklist {
  slug: string;
  title: string;
  description: string;
  rows: AuditRow[];
}

interface Args {
  input?: string;
  outputDir?: string;
  limit: number;
}

const DEFAULT_LIMIT = 120;

function localDateStamp(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function parseArgs(args: string[]): Args {
  const parsed: Args = {
    limit: DEFAULT_LIMIT,
  };

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];
    const next = args[index + 1];
    if (!current.startsWith('--')) continue;

    if (current === '--input' && next) {
      parsed.input = next;
      index += 1;
    } else if (current === '--output-dir' && next) {
      parsed.outputDir = next;
      index += 1;
    } else if (current === '--limit' && next) {
      const value = Number.parseInt(next, 10);
      if (Number.isInteger(value) && value > 0) {
        parsed.limit = value;
      }
      index += 1;
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

function priorityRank(priority: Priority): number {
  return { P0: 0, P1: 1, P2: 2, P3: 3 }[priority];
}

function sortRecoveryRows(rows: AuditRow[]): AuditRow[] {
  return [...rows].sort((a, b) => (
    b.clickLoss - a.clickLoss
    || b.impressionLoss - a.impressionLoss
    || priorityRank(a.priority) - priorityRank(b.priority)
    || b.score - a.score
    || a.url.localeCompare(b.url)
  ));
}

function sortRiskRows(rows: AuditRow[]): AuditRow[] {
  return [...rows].sort((a, b) => (
    priorityRank(a.priority) - priorityRank(b.priority)
    || b.score - a.score
    || b.clickLoss - a.clickLoss
    || b.impressionLoss - a.impressionLoss
    || a.url.localeCompare(b.url)
  ));
}

function hasIssue(row: AuditRow, predicate: (issue: AuditIssue) => boolean): boolean {
  return row.issues.some(predicate);
}

function buildWorklists(report: AuditReport, limit: number): Worklist[] {
  const recoveryRows = sortRecoveryRows(report.rows.filter((row) =>
    (row.clickLoss > 0 || row.impressionLoss > 0)
    && (row.priority === 'P0' || row.priority === 'P1')
  ));

  const coverageBlockers = sortRiskRows(report.rows.filter((row) =>
    hasIssue(row, (issue) =>
      issue.code.startsWith('coverage_blocked')
      || issue.code.startsWith('coverage_noindex')
      || issue.code.startsWith('coverage_not-found')
    )
  ));

  const crawledNotIndexed = sortRiskRows(report.rows.filter((row) =>
    hasIssue(row, (issue) => issue.code === 'coverage_crawled-not-indexed')
  ));

  const tdkSourceDrift = sortRiskRows(report.rows.filter((row) =>
    hasIssue(row, (issue) =>
      issue.code === 'seo_title_source_drift'
      || issue.code === 'seo_description_source_drift'
      || issue.code === 'seo_title_long'
      || issue.code === 'seo_description_long'
      || issue.code === 'seo_description_short'
    )
  ));

  const templateCleanup = sortRiskRows(report.rows.filter((row) =>
    hasIssue(row, (issue) =>
      issue.code.includes('generic-data-generator')
      || issue.code.includes('generic-online-free-template')
      || issue.code === 'placeholder-ellipsis'
    )
  ));

  const contentDepth = sortRiskRows(report.rows.filter((row) =>
    hasIssue(row, (issue) =>
      issue.code === 'support_thin_critical'
      || issue.code === 'support_thin'
      || issue.code === 'faq_short'
      || issue.code === 'usage_examples_short'
      || issue.code === 'usage_steps_short'
    )
  ));

  return [
    {
      slug: '01-gsc-recovery-p0-p1',
      title: 'GSC Recovery P0/P1',
      description: 'Historic click or impression loss rows that should drive the next recovery batches.',
      rows: recoveryRows.slice(0, limit),
    },
    {
      slug: '02-coverage-blockers',
      title: 'Coverage Blockers',
      description: 'Rows in blocked, noindex, or not-found coverage buckets; classify before any indexing request.',
      rows: coverageBlockers.slice(0, limit),
    },
    {
      slug: '03-crawled-not-indexed',
      title: 'Crawled Not Indexed',
      description: 'Rows in GSC crawled-not-indexed exports; many may be stale and need live/URL Inspection classification.',
      rows: crawledNotIndexed.slice(0, limit),
    },
    {
      slug: '04-tdk-source-drift',
      title: 'TDK Source Drift',
      description: 'Rows with root/base TDK drift or unsafe snippet lengths.',
      rows: tdkSourceDrift.slice(0, limit),
    },
    {
      slug: '05-template-cleanup',
      title: 'Generic Template Cleanup',
      description: 'Rows with generic data-generator or placeholder-like support copy.',
      rows: templateCleanup.slice(0, limit),
    },
    {
      slug: '06-content-depth',
      title: 'Content Depth / GEO',
      description: 'Rows with thin support content, short usage examples, or missing FAQ depth.',
      rows: contentDepth.slice(0, limit),
    },
  ];
}

function issueCodes(row: AuditRow, limit = 5): string {
  return row.issues.slice(0, limit).map((issue) => issue.code).join(', ');
}

function renderWorklist(worklist: Worklist, sourcePath: string): string {
  return [
    `# ${worklist.title}`,
    '',
    `Source: \`${path.relative(process.cwd(), sourcePath)}\``,
    '',
    worklist.description,
    '',
    `Rows: ${worklist.rows.length}`,
    '',
    '| Priority | Score | URL | Loss | Action | Issues |',
    '|---|---:|---|---:|---|---|',
    ...worklist.rows.map((row) => (
      `| ${row.priority} | ${row.score} | \`${row.url}\` | ${row.clickLoss}/${row.impressionLoss} | ${row.action} | ${issueCodes(row)} |`
    )),
    '',
  ].join('\n');
}

function renderIndex(worklists: Worklist[], sourcePath: string): string {
  return [
    '# SEO/GEO Worklists',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    `Source: \`${path.relative(process.cwd(), sourcePath)}\``,
    '',
    '| Worklist | Rows | Purpose |',
    '|---|---:|---|',
    ...worklists.map((worklist) => (
      `| [${worklist.title}](./${worklist.slug}.md) | ${worklist.rows.length} | ${worklist.description} |`
    )),
    '',
    '## Suggested Next Batch',
    '',
    '- Start with `01-gsc-recovery-p0-p1.md` and skip rows already repaired in the cohort plan.',
    '- Then classify `02-coverage-blockers.md` before making more GSC validation requests.',
    '- Use `04-tdk-source-drift.md` and `05-template-cleanup.md` for batch-safe automated cleanup.',
    '',
  ].join('\n');
}

async function writeWorklists(worklists: Worklist[], outputDir: string, sourcePath: string): Promise<void> {
  await fs.promises.mkdir(outputDir, { recursive: true });
  await fs.promises.writeFile(path.join(outputDir, 'index.md'), `${renderIndex(worklists, sourcePath)}\n`, 'utf8');

  for (const worklist of worklists) {
    await fs.promises.writeFile(
      path.join(outputDir, `${worklist.slug}.md`),
      `${renderWorklist(worklist, sourcePath)}\n`,
      'utf8'
    );
    await fs.promises.writeFile(
      path.join(outputDir, `${worklist.slug}.json`),
      `${JSON.stringify(worklist.rows, null, 2)}\n`,
      'utf8'
    );
  }
}

async function main(): Promise<void> {
  const args = parseArgs(argv.slice(2));
  const input = path.resolve(args.input || latestAuditMatrixPath());
  const outputDir = path.resolve(args.outputDir || `exports/seo/worklists/${localDateStamp()}`);
  const report = readReport(input);
  const worklists = buildWorklists(report, args.limit);

  await writeWorklists(worklists, outputDir, input);
  console.log(`SEO/GEO worklists written to ${outputDir}`);
  for (const worklist of worklists) {
    console.log(`${worklist.slug}: ${worklist.rows.length}`);
  }
}

if (import.meta.url === `file://${argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
