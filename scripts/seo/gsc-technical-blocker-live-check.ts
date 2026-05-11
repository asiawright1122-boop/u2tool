import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

type Verdict = 'expected-monitor' | 'true-blocker' | 'needs-rerun';

interface Args {
  input?: string;
  output?: string;
}

interface TargetGroup {
  issue: string;
  pageBucket: string;
  signalBucket: string;
  count: number;
  reason: string;
  examples: string[];
}

interface RedirectStep {
  location?: string;
  status: number;
  url: string;
}

interface LiveCheckResult {
  canonical?: string;
  chain: RedirectStep[];
  contentType: string;
  error?: string;
  finalStatus: number;
  finalUrl: string;
  group: TargetGroup;
  metaRobots?: string;
  originalUrl: string;
  verdict: Verdict;
  xRobotsTag?: string;
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

function stripBackticks(value: string): string {
  return value.trim().replace(/^`|`$/g, '');
}

function splitMarkdownRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  const cells: string[] = [];
  let current = '';

  for (let index = 0; index < trimmed.length; index += 1) {
    const char = trimmed[index];
    const next = trimmed[index + 1];

    if (char === '\\' && next === '|') {
      current += '|';
      index += 1;
      continue;
    }

    if (char === '|') {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function parseTargets(inputPath: string): TargetGroup[] {
  const content = fs.readFileSync(inputPath, 'utf8');
  const groups: TargetGroup[] = [];

  for (const line of content.split('\n')) {
    if (!line.startsWith('| `fix-before-validate` |')) {
      continue;
    }

    const cells = splitMarkdownRow(line);
    if (cells.length < 7) {
      continue;
    }

    groups.push({
      issue: cells[1],
      pageBucket: cells[2],
      signalBucket: cells[3],
      count: Number.parseInt(cells[4].replace(/,/g, ''), 10) || 0,
      reason: cells[5],
      examples: cells[6]
        .split('<br>')
        .map((url) => stripBackticks(url.trim()))
        .filter(Boolean),
    });
  }

  return groups;
}

async function fetchWithRedirectChain(url: string): Promise<{
  body: string;
  chain: RedirectStep[];
  contentType: string;
  finalStatus: number;
  finalUrl: string;
  xRobotsTag?: string;
}> {
  const chain: RedirectStep[] = [];
  let currentUrl = url;
  let response: Response | undefined;

  for (let redirects = 0; redirects <= 6; redirects += 1) {
    response = await fetch(currentUrl, {
      headers: {
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'user-agent': 'u2tool-gsc-live-check/1.0',
      },
      redirect: 'manual',
      signal: AbortSignal.timeout(20_000),
    });

    const location = response.headers.get('location') || undefined;
    chain.push({
      location,
      status: response.status,
      url: currentUrl,
    });

    if (location && response.status >= 300 && response.status < 400) {
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    const contentType = response.headers.get('content-type') || '';
    const body = contentType.includes('text/html') ? await response.text() : '';

    return {
      body,
      chain,
      contentType,
      finalStatus: response.status,
      finalUrl: response.url || currentUrl,
      xRobotsTag: response.headers.get('x-robots-tag') || undefined,
    };
  }

  return {
    body: '',
    chain,
    contentType: response?.headers.get('content-type') || '',
    finalStatus: response?.status || 0,
    finalUrl: currentUrl,
    xRobotsTag: response?.headers.get('x-robots-tag') || undefined,
  };
}

function extractCanonical(html: string): string | undefined {
  const linkTags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of linkTags) {
    if (!/\brel=["'][^"']*\bcanonical\b[^"']*["']/i.test(tag)) {
      continue;
    }

    const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1];
    if (href) {
      return href;
    }
  }

  return undefined;
}

function extractMetaRobots(html: string): string | undefined {
  const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
  const robotsValues: string[] = [];

  for (const tag of metaTags) {
    if (!/\bname=["']robots["']/i.test(tag)) {
      continue;
    }

    const content = tag.match(/\bcontent=["']([^"']+)["']/i)?.[1];
    if (content) {
      robotsValues.push(content);
    }
  }

  return robotsValues.length > 0 ? robotsValues.join('; ') : undefined;
}

function classifyVerdict(result: Omit<LiveCheckResult, 'verdict'>): Verdict {
  if (result.error || result.finalStatus === 0) {
    return 'needs-rerun';
  }

  const robotsSignals = `${result.xRobotsTag || ''} ${result.metaRobots || ''}`.toLowerCase();
  if (result.finalStatus >= 500 || result.finalStatus === 429) {
    return 'needs-rerun';
  }

  if (result.finalStatus >= 400 || robotsSignals.includes('noindex')) {
    return 'true-blocker';
  }

  return 'expected-monitor';
}

async function checkUrl(group: TargetGroup, originalUrl: string): Promise<LiveCheckResult> {
  try {
    const response = await fetchWithRedirectChain(originalUrl);
    const base = {
      canonical: extractCanonical(response.body),
      chain: response.chain,
      contentType: response.contentType,
      finalStatus: response.finalStatus,
      finalUrl: response.finalUrl,
      group,
      metaRobots: extractMetaRobots(response.body),
      originalUrl,
      xRobotsTag: response.xRobotsTag,
    };

    return {
      ...base,
      verdict: classifyVerdict(base),
    };
  } catch (error) {
    const base = {
      chain: [],
      contentType: '',
      error: error instanceof Error ? error.message : String(error),
      finalStatus: 0,
      finalUrl: originalUrl,
      group,
      originalUrl,
    };

    return {
      ...base,
      verdict: 'needs-rerun',
    };
  }
}

function countByVerdict(results: LiveCheckResult[]): Record<Verdict, number> {
  return results.reduce<Record<Verdict, number>>(
    (counts, result) => {
      counts[result.verdict] += 1;
      return counts;
    },
    {
      'expected-monitor': 0,
      'needs-rerun': 0,
      'true-blocker': 0,
    }
  );
}

function formatChain(chain: RedirectStep[]): string {
  if (chain.length === 0) {
    return 'n/a';
  }

  return chain
    .map((step) =>
      step.location
        ? `${step.status} ${step.url} -> ${new URL(step.location, step.url).toString()}`
        : `${step.status} ${step.url}`
    )
    .join('<br>');
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function nextActionFor(result: LiveCheckResult): string {
  if (result.verdict === 'true-blocker') {
    return 'Patch before any GSC validation request.';
  }

  if (result.verdict === 'needs-rerun') {
    return 'Rerun live check before deciding; do not validate yet.';
  }

  return 'Do not validate broadly; monitor recrawl or mark this group expected.';
}

function renderReport(results: LiveCheckResult[], sourcePath: string): string {
  const counts = countByVerdict(results);
  const blockerCount = counts['true-blocker'];
  const verdictLine =
    blockerCount === 0
      ? 'No current live technical blockers were found in representative `fix-before-validate` samples.'
      : `${blockerCount} representative sample(s) still look blocked and need a repo-owned fix or deeper inspection.`;

  const lines = [
    '# GSC Technical Blocker Live Check',
    '',
    `Generated at: ${new Date().toISOString()}`,
    `Source matrix: ${path.resolve(sourcePath)}`,
    '',
    '## Executive Summary',
    '',
    `- Representative URLs checked: ${results.length}.`,
    `- Expected/monitor: ${counts['expected-monitor']}.`,
    `- True blockers: ${counts['true-blocker']}.`,
    `- Needs rerun: ${counts['needs-rerun']}.`,
    `- Verdict: ${verdictLine}`,
    '',
    '## Group Summary',
    '',
    '| Issue | Page Bucket | Signal | GSC URLs In Group | Tested Examples | Live Result |',
    '|---|---|---|---:|---:|---|',
  ];

  const groupKeys = new Map<string, LiveCheckResult[]>();
  for (const result of results) {
    const key = [result.group.issue, result.group.pageBucket, result.group.signalBucket].join('\u0000');
    groupKeys.set(key, [...(groupKeys.get(key) || []), result]);
  }

  for (const groupResults of groupKeys.values()) {
    const [first] = groupResults;
    const groupCounts = countByVerdict(groupResults);
    lines.push(
      `| ${escapeCell(first.group.issue)} | ${escapeCell(first.group.pageBucket)} | ${escapeCell(first.group.signalBucket)} | ${first.group.count.toLocaleString('en-US')} | ${groupResults.length} | expected=${groupCounts['expected-monitor']}; true-blocker=${groupCounts['true-blocker']}; rerun=${groupCounts['needs-rerun']} |`
    );
  }

  lines.push(
    '',
    '## URL Results',
    '',
    '| Original URL | Chain | Final Status | Final URL | Robots | Canonical | Verdict | Next Action |',
    '|---|---|---:|---|---|---|---|---|'
  );

  for (const result of results) {
    const robots = result.xRobotsTag || result.metaRobots || 'none detected';
    lines.push(
      `| ${escapeCell(result.originalUrl)} | ${escapeCell(formatChain(result.chain))} | ${result.finalStatus} | ${escapeCell(result.finalUrl)} | ${escapeCell(robots)} | ${escapeCell(result.canonical || 'n/a')} | \`${result.verdict}\` | ${escapeCell(nextActionFor(result))} |`
    );
  }

  lines.push(
    '',
    '## Operational Decision',
    '',
    blockerCount === 0
      ? 'The checked blocker samples currently resolve to indexable canonical HTML or expected redirect states. Do not retry broad GSC validation for these mixed rows; monitor recrawl and continue to high-value content recovery.'
      : 'Patch the true-blocker rows before any GSC validation request, then rerun this report.',
    ''
  );

  return lines.join('\n');
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(args.input || 'docs/GSC_VALIDATION_ACTION_MATRIX_2026-05-11.md');
  const groups = parseTargets(inputPath);
  const targets = groups.flatMap((group) =>
    group.examples.map((example) => ({
      group,
      url: example,
    }))
  );

  if (targets.length === 0) {
    throw new Error(`No fix-before-validate examples found in ${inputPath}`);
  }

  const results: LiveCheckResult[] = [];
  for (const target of targets) {
    results.push(await checkUrl(target.group, target.url));
  }

  const report = renderReport(results, inputPath);
  if (args.output) {
    const outputPath = path.resolve(args.output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, report, 'utf8');
    console.log(`Saved report to ${outputPath}`);
    return;
  }

  console.log(report);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
