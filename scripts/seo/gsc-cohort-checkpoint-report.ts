import * as fs from 'node:fs';
import * as path from 'node:path';
import { argv, exit } from 'node:process';
import * as XLSX from 'xlsx';

interface Args {
  baselineDir?: string;
  checkpointDir?: string;
  output?: string;
  label?: string;
}

interface MetricRow {
  key: string;
  clicks: number;
  impressions: number;
  position: number;
}

interface CohortUrl {
  cohort: 'A' | 'B' | 'C';
  url: string;
  label: string;
}

interface QueryFamily {
  family: string;
  queries: string[];
  urls: string[];
}

const COHORT_URLS: CohortUrl[] = [
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/de/tools/text-to-handwriting/',
    label: 'DE Text to Handwriting - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/ru/tools/hex-editor/',
    label: 'RU Hex Editor - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/ko/tools/html-preview/',
    label: 'KO HTML Preview - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/en/tools/hex-editor/',
    label: 'EN Hex Editor - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/ko/tools/unicode-converter/',
    label: 'KO Unicode Converter - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/ru/tools/html-preview/',
    label: 'RU HTML Preview - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/fr/tools/file-size-calculator/',
    label: 'FR File Size Calculator - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/en/tools/ical-parser/',
    label: 'EN iCal Parser - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/es/tools/html-preview/',
    label: 'ES HTML Preview - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/ru/tools/barcode-generator/',
    label: 'RU Barcode Generator - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/en/tools/morse-code-player/',
    label: 'EN Morse Code Player - 16-month winner',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/en/tools/passport-photo-maker/',
    label: 'Passport Photo Maker',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/en/tools/csv-to-vcard-converter/',
    label: 'CSV to vCard Converter',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/en/tools/vcard-to-csv-converter/',
    label: 'vCard to CSV Converter',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/en/categories/finance/',
    label: 'Finance category',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/en/categories/generators/',
    label: 'Generators category',
  },
  {
    cohort: 'A',
    url: 'https://www.u2tool.com/en/categories/lifestyle/',
    label: 'Lifestyle category',
  },
  {
    cohort: 'B',
    url: 'https://www.u2tool.com/ru/tools/hex-editor/',
    label: 'RU Hex Editor',
  },
  {
    cohort: 'B',
    url: 'https://www.u2tool.com/en/tools/hex-editor/',
    label: 'EN Hex Editor',
  },
  {
    cohort: 'B',
    url: 'https://www.u2tool.com/en/tools/gantt-chart-generator/',
    label: 'EN Gantt Chart Generator',
  },
  {
    cohort: 'B',
    url: 'https://www.u2tool.com/en/tools/ical-parser/',
    label: 'EN iCal Parser',
  },
  {
    cohort: 'B',
    url: 'https://www.u2tool.com/en/tools/iban-validator/',
    label: 'EN IBAN Validator',
  },
  {
    cohort: 'B',
    url: 'https://www.u2tool.com/en/tools/sitemap-generator/',
    label: 'EN Sitemap Generator',
  },
  {
    cohort: 'B',
    url: 'https://www.u2tool.com/en/tools/compound-interest-calculator/',
    label: 'EN Compound Interest Calculator',
  },
  {
    cohort: 'B',
    url: 'https://www.u2tool.com/fr/tools/file-size-calculator/',
    label: 'FR File Size Calculator',
  },
  {
    cohort: 'B',
    url: 'https://www.u2tool.com/en/tools/morse-code-player/',
    label: 'EN Morse Code Player',
  },
  {
    cohort: 'B',
    url: 'https://www.u2tool.com/es/tools/word-counter/',
    label: 'ES Word Counter',
  },
  {
    cohort: 'B',
    url: 'https://www.u2tool.com/en/tools/html-preview/',
    label: 'EN HTML Preview',
  },
  {
    cohort: 'B',
    url: 'https://www.u2tool.com/de/tools/text-to-handwriting/',
    label: 'DE Text to Handwriting',
  },
  {
    cohort: 'B',
    url: 'https://www.u2tool.com/ru/tools/barcode-generator/',
    label: 'RU Barcode Generator',
  },
  {
    cohort: 'C',
    url: 'https://www.u2tool.com/en/tools/typing-speed-test/',
    label: 'EN Typing Speed Test',
  },
  {
    cohort: 'C',
    url: 'https://www.u2tool.com/en/tools/pixel-density-calculator/',
    label: 'EN Pixel Density Calculator',
  },
  {
    cohort: 'C',
    url: 'https://www.u2tool.com/es/tools/document-word-counter/',
    label: 'ES Document Word Counter',
  },
  {
    cohort: 'C',
    url: 'https://www.u2tool.com/en/tools/screen-recorder/',
    label: 'EN Screen Recorder',
  },
  {
    cohort: 'C',
    url: 'https://www.u2tool.com/ar/tools/calorie-calculator/',
    label: 'AR Calorie Calculator',
  },
  {
    cohort: 'C',
    url: 'https://www.u2tool.com/es/tools/gantt-chart-generator/',
    label: 'ES Gantt Chart Generator',
  },
  {
    cohort: 'C',
    url: 'https://www.u2tool.com/en/tools/ascii-table/',
    label: 'EN ASCII Table',
  },
  {
    cohort: 'C',
    url: 'https://www.u2tool.com/en/tools/dice-roller/',
    label: 'EN Dice Roller',
  },
  {
    cohort: 'C',
    url: 'https://www.u2tool.com/en/tools/credit-card-validator/',
    label: 'EN Credit Card Validator',
  },
  {
    cohort: 'C',
    url: 'https://www.u2tool.com/en/tools/timeline-chart-generator/',
    label: 'EN Timeline Chart Generator',
  },
  {
    cohort: 'C',
    url: 'https://www.u2tool.com/fr/tools/mortgage-calculator/',
    label: 'FR Mortgage Calculator',
  },
  {
    cohort: 'C',
    url: 'https://www.u2tool.com/en/tools/bra-size-calculator/',
    label: 'EN Bra Size Calculator',
  },
  {
    cohort: 'C',
    url: 'https://www.u2tool.com/en/tools/random-color-generator/',
    label: 'EN Random Color Generator',
  },
];

const QUERY_FAMILIES: QueryFamily[] = [
  {
    family: 'hex editor online',
    queries: ['hex editor online'],
    urls: [
      'https://www.u2tool.com/en/tools/hex-editor/',
      'https://www.u2tool.com/ru/tools/hex-editor/',
    ],
  },
  {
    family: 'hex editor Russian',
    queries: ['hex редактор онлайн'],
    urls: ['https://www.u2tool.com/ru/tools/hex-editor/'],
  },
  {
    family: 'German handwriting conversion',
    queries: ['text in handschrift umwandeln', 'text in handschrift umwandeln online'],
    urls: ['https://www.u2tool.com/de/tools/text-to-handwriting/'],
  },
  {
    family: 'Korean HTML preview',
    queries: ['html 미리보기', 'html 뷰어', 'html 실행'],
    urls: [
      'https://www.u2tool.com/ko/tools/html-preview/',
      'https://www.u2tool.com/ru/tools/html-preview/',
      'https://www.u2tool.com/es/tools/html-preview/',
      'https://www.u2tool.com/en/tools/html-preview/',
    ],
  },
  {
    family: 'Korean unicode converter',
    queries: ['유니코드 변환', '유니코드 변환기'],
    urls: ['https://www.u2tool.com/ko/tools/unicode-converter/'],
  },
  {
    family: 'French file size calculator',
    queries: ['calcul taille fichier', 'taille fichier ko mo go'],
    urls: ['https://www.u2tool.com/fr/tools/file-size-calculator/'],
  },
  {
    family: 'gantt chart maker',
    queries: ['gantt chart maker', 'create gantt chart online', 'create a gantt chart online'],
    urls: ['https://www.u2tool.com/en/tools/gantt-chart-generator/'],
  },
  {
    family: 'compound interest calculator',
    queries: ['compound interest calculator'],
    urls: ['https://www.u2tool.com/en/tools/compound-interest-calculator/'],
  },
  {
    family: 'sitemap generator',
    queries: ['sitemap generator'],
    urls: ['https://www.u2tool.com/en/tools/sitemap-generator/'],
  },
  {
    family: 'word counter Spanish',
    queries: ['contador de palabras', 'contador de palabras online'],
    urls: [
      'https://www.u2tool.com/es/tools/word-counter/',
      'https://www.u2tool.com/es/tools/document-word-counter/',
    ],
  },
  {
    family: 'passport photo maker',
    queries: ['passport photo maker', 'passport photo online', 'passport photo free'],
    urls: ['https://www.u2tool.com/en/tools/passport-photo-maker/'],
  },
  {
    family: 'csv to vcard',
    queries: ['csv to vcard', 'csv to vcf', 'csv to vcard converter'],
    urls: ['https://www.u2tool.com/en/tools/csv-to-vcard-converter/'],
  },
  {
    family: 'vcard to csv',
    queries: ['vcard to csv', 'vcf to csv', 'vcard to csv converter'],
    urls: ['https://www.u2tool.com/en/tools/vcard-to-csv-converter/'],
  },
];

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
      '  node --import tsx/esm scripts/seo/gsc-cohort-checkpoint-report.ts \\',
      '    --baseline-dir exports/gsc \\',
      '    --checkpoint-dir exports/gsc/checkpoints/2026-06-16 \\',
      '    --label 2026-06-16 \\',
      '    --output docs/GSC_COHORT_CHECKPOINT_2026-06-16.md',
    ].join('\n')
  );
  exit(1);
}

function canonicalizeUrl(input: string): string {
  const raw = input.trim();
  if (!raw) {
    return '';
  }

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    url = new URL(raw.startsWith('/') ? `https://www.u2tool.com${raw}` : `https://www.u2tool.com/${raw}`);
  }

  let pathname = url.pathname;
  const fileLike = /\.[a-z0-9]{2,8}$/i.test(pathname);
  if (!fileLike && !pathname.endsWith('/')) {
    pathname += '/';
  }

  return `https://www.u2tool.com${pathname}`;
}

function normalizeQuery(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, ' ');
}

function parseNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  const parsed = Number.parseFloat(
    String(value || '')
      .trim()
      .replace(/,/g, '')
      .replace(/%/g, '')
  );
  return Number.isFinite(parsed) ? parsed : 0;
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

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[()%]/g, '')
    .replace(/[^a-z0-9 ]/g, '');
}

function getField(row: Record<string, unknown>, names: string[]): unknown {
  const normalized = Object.fromEntries(
    Object.entries(row).map(([key, value]) => [normalizeHeader(key), value])
  );

  for (const name of names) {
    const value = normalized[normalizeHeader(name)];
    if (value !== undefined && value !== '') {
      return value;
    }
  }

  return '';
}

function readMetricMap(filePath: string, kind: 'page' | 'query'): Map<string, MetricRow> {
  const accumulated = new Map<string, { clicks: number; impressions: number; weightedPosition: number }>();

  for (const row of readSheetRows(filePath)) {
    const rawKey =
      kind === 'page'
        ? getField(row, ['Top pages', 'Pages', 'Page'])
        : getField(row, ['Top queries', 'Queries', 'Query']);

    const key = kind === 'page' ? canonicalizeUrl(String(rawKey || '')) : normalizeQuery(String(rawKey || ''));
    if (!key) {
      continue;
    }

    const clicks = parseNumber(getField(row, ['Clicks']));
    const impressions = parseNumber(getField(row, ['Impressions']));
    const position = parseNumber(getField(row, ['Position', 'Average position']));
    const existing = accumulated.get(key) || { clicks: 0, impressions: 0, weightedPosition: 0 };

    existing.clicks += clicks;
    existing.impressions += impressions;
    existing.weightedPosition += position * impressions;
    accumulated.set(key, existing);
  }

  return new Map(
    Array.from(accumulated.entries()).map(([key, value]) => [
      key,
      {
        key,
        clicks: value.clicks,
        impressions: value.impressions,
        position: value.impressions > 0 ? value.weightedPosition / value.impressions : 0,
      },
    ])
  );
}

function metricFor(map: Map<string, MetricRow>, key: string): MetricRow {
  return map.get(key) || { key, clicks: 0, impressions: 0, position: 0 };
}

function sumMetrics(map: Map<string, MetricRow>, keys: string[]): MetricRow {
  const rows = keys.map((key) => metricFor(map, key));
  const clicks = rows.reduce((sum, row) => sum + row.clicks, 0);
  const impressions = rows.reduce((sum, row) => sum + row.impressions, 0);
  const weightedPosition = rows.reduce((sum, row) => sum + row.position * row.impressions, 0);

  return {
    key: keys.join(', '),
    clicks,
    impressions,
    position: impressions > 0 ? weightedPosition / impressions : 0,
  };
}

function formatNumber(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function formatPosition(value: number): string {
  return value > 0 ? value.toFixed(2) : '0.00';
}

function formatDelta(value: number): string {
  if (value > 0) {
    return `+${formatNumber(value)}`;
  }

  return formatNumber(value);
}

function decision(
  checkpoint: MetricRow,
  baseline: MetricRow,
  cohort: CohortUrl['cohort']
): string {
  if (cohort === 'C') {
    return 'defer';
  }

  if (checkpoint.impressions > baseline.impressions || checkpoint.clicks > baseline.clicks) {
    return 'recovering';
  }

  if (checkpoint.impressions === 0 && baseline.impressions === 0) {
    return 'not-visible-yet';
  }

  return 'watch';
}

function buildReport(args: Required<Args>): string {
  const baselinePages = readMetricMap(path.join(args.baselineDir, 'pages-current.xlsx'), 'page');
  const checkpointPages = readMetricMap(path.join(args.checkpointDir, 'pages-current.xlsx'), 'page');
  const baselineQueries = readMetricMap(path.join(args.baselineDir, 'queries-current.xlsx'), 'query');
  const checkpointQueries = readMetricMap(path.join(args.checkpointDir, 'queries-current.xlsx'), 'query');
  const generatedAt = new Date().toISOString();

  const lines = [
    `# GSC Cohort Checkpoint - ${args.label}`,
    '',
    `Generated: ${generatedAt}`,
    '',
    `Baseline directory: \`${args.baselineDir}\``,
    `Checkpoint directory: \`${args.checkpointDir}\``,
    '',
    '## URL Cohorts',
    '',
    '| Cohort | URL | Label | Baseline Clicks | Checkpoint Clicks | Click Delta | Baseline Impressions | Checkpoint Impressions | Impression Delta | Checkpoint Position | Decision |',
    '|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|',
  ];

  for (const item of COHORT_URLS) {
    const key = canonicalizeUrl(item.url);
    const baseline = metricFor(baselinePages, key);
    const checkpoint = metricFor(checkpointPages, key);

    lines.push(
      [
        item.cohort,
        `\`${item.url}\``,
        item.label,
        formatNumber(baseline.clicks),
        formatNumber(checkpoint.clicks),
        formatDelta(checkpoint.clicks - baseline.clicks),
        formatNumber(baseline.impressions),
        formatNumber(checkpoint.impressions),
        formatDelta(checkpoint.impressions - baseline.impressions),
        formatPosition(checkpoint.position),
        decision(checkpoint, baseline, item.cohort),
      ].join(' | ').replace(/^/, '| ') + ' |'
    );
  }

  lines.push(
    '',
    '## Query Families',
    '',
    '| Query Family | Queries | Related URLs | Baseline Clicks | Checkpoint Clicks | Click Delta | Baseline Impressions | Checkpoint Impressions | Impression Delta | Checkpoint Position | Decision |',
    '|---|---|---|---:|---:|---:|---:|---:|---:|---:|---|'
  );

  for (const family of QUERY_FAMILIES) {
    const keys = family.queries.map(normalizeQuery);
    const baseline = sumMetrics(baselineQueries, keys);
    const checkpoint = sumMetrics(checkpointQueries, keys);
    const familyDecision =
      checkpoint.impressions > baseline.impressions || checkpoint.clicks > baseline.clicks
        ? 'recovering'
        : checkpoint.impressions === 0 && baseline.impressions === 0
          ? 'not-visible-yet'
          : 'watch';

    lines.push(
      [
        family.family,
        family.queries.map((query) => `\`${query}\``).join('<br>'),
        family.urls.map((url) => `\`${url}\``).join('<br>'),
        formatNumber(baseline.clicks),
        formatNumber(checkpoint.clicks),
        formatDelta(checkpoint.clicks - baseline.clicks),
        formatNumber(baseline.impressions),
        formatNumber(checkpoint.impressions),
        formatDelta(checkpoint.impressions - baseline.impressions),
        formatPosition(checkpoint.position),
        familyDecision,
      ].join(' | ').replace(/^/, '| ') + ' |'
    );
  }

  lines.push(
    '',
    '## Decision Legend',
    '',
    '- `recovering`: checkpoint clicks or impressions are above the baseline export.',
    '- `watch`: checkpoint data exists but is not yet above baseline.',
    '- `not-visible-yet`: neither baseline nor checkpoint export has visibility for this exact URL/query.',
    '- `defer`: Cohort C needs content/snippet inspection before request-indexing or recovery judgment.',
    '',
    '## Notes',
    '',
    '- This report compares clean canonical URLs only.',
    '- Use Search Console URL Inspection state alongside this performance report before declaring a URL recovered or broken.',
    '- Search Console data may lag the checkpoint date; record the actual GSC end date in the checkpoint notes.',
    ''
  );

  return lines.join('\n');
}

const parsedArgs = parseArgs(argv.slice(2));
if (!parsedArgs.checkpointDir) {
  printUsage();
}

const resolvedArgs: Required<Args> = {
  baselineDir: path.resolve(parsedArgs.baselineDir || 'exports/gsc'),
  checkpointDir: path.resolve(parsedArgs.checkpointDir),
  output: path.resolve(parsedArgs.output || `docs/GSC_COHORT_CHECKPOINT_${parsedArgs.label || 'latest'}.md`),
  label: parsedArgs.label || path.basename(path.resolve(parsedArgs.checkpointDir)),
};

const report = buildReport(resolvedArgs);
fs.mkdirSync(path.dirname(resolvedArgs.output), { recursive: true });
fs.writeFileSync(resolvedArgs.output, report, 'utf8');
console.log(`Saved cohort checkpoint report to ${resolvedArgs.output}`);
