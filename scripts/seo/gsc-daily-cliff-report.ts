import fs from 'node:fs';
import path from 'node:path';
import { argv } from 'node:process';

export interface DailyRow {
  date: string;
  clicks: number;
  impressions: number;
  ctr: string;
  position: string;
}

export interface CliffWindow {
  preStart: string;
  preEnd: string;
  postStart: string;
  postEnd: string;
}

export interface WindowSummary {
  start: string;
  end: string;
  days: number;
  clicks: number;
  impressions: number;
  averageClicks: number;
  averageImpressions: number;
}

export interface DailyCliffSummary {
  pre: WindowSummary;
  post: WindowSummary;
  clickDropPercent: number;
  impressionDropPercent: number;
  lowestPostClickDays: number;
}

const DEFAULT_WINDOW: CliffWindow = {
  preStart: '2025-12-23',
  preEnd: '2026-03-29',
  postStart: '2026-03-30',
  postEnd: '2026-06-29',
};

function parseArgs(args: string[]): Record<string, string> {
  const parsed: Record<string, string> = {};

  for (let index = 0; index < args.length; index += 1) {
    const item = args[index];
    if (!item.startsWith('--')) {
      continue;
    }

    const next = args[index + 1];
    if (next && !next.startsWith('--')) {
      parsed[item.slice(2)] = next;
      index += 1;
    }
  }

  return parsed;
}

function parseNumber(input: string): number {
  const value = Number.parseFloat(String(input || '').replace(/,/g, '').replace(/%/g, '').trim());
  return Number.isFinite(value) ? value : 0;
}

function normalizeDate(input: string): string {
  const trimmed = input.trim();
  const chinese = trimmed.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日$/);

  if (chinese) {
    return [
      chinese[1],
      chinese[2].padStart(2, '0'),
      chinese[3].padStart(2, '0'),
    ].join('-');
  }

  return trimmed;
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

function headerIndex(headers: string[], candidates: string[]): number {
  const normalizedHeaders = headers.map((header) => header.trim().toLowerCase());

  for (const candidate of candidates) {
    const index = normalizedHeaders.indexOf(candidate.toLowerCase());
    if (index >= 0) {
      return index;
    }
  }

  return -1;
}

export function parseDailyRowsFromCsv(csv: string): DailyRow[] {
  const lines = csv.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) {
    return [];
  }

  const headers = splitCsvLine(lines[0]);
  const dateIndex = headerIndex(headers, ['date', 'day', '天']);
  const clickIndex = headerIndex(headers, ['clicks', '点击次数']);
  const impressionIndex = headerIndex(headers, ['impressions', '展示', '展示次数']);
  const ctrIndex = headerIndex(headers, ['ctr', '点击率']);
  const positionIndex = headerIndex(headers, ['position', '排名', '平均排名']);

  if (dateIndex < 0 || clickIndex < 0 || impressionIndex < 0) {
    throw new Error(`Unsupported daily GSC headers: ${headers.join(', ')}`);
  }

  return lines.slice(1)
    .map((line) => {
      const cells = splitCsvLine(line);
      return {
        date: normalizeDate(cells[dateIndex] || ''),
        clicks: parseNumber(cells[clickIndex] || ''),
        impressions: parseNumber(cells[impressionIndex] || ''),
        ctr: cells[ctrIndex] || '',
        position: cells[positionIndex] || '',
      };
    })
    .filter((row) => /^\d{4}-\d{2}-\d{2}$/.test(row.date));
}

function summarize(rows: DailyRow[], start: string, end: string): WindowSummary {
  const windowRows = rows.filter((row) => row.date >= start && row.date <= end);
  const clicks = windowRows.reduce((sum, row) => sum + row.clicks, 0);
  const impressions = windowRows.reduce((sum, row) => sum + row.impressions, 0);
  const days = windowRows.length;

  return {
    start,
    end,
    days,
    clicks,
    impressions,
    averageClicks: days > 0 ? Number((clicks / days).toFixed(2)) : 0,
    averageImpressions: days > 0 ? Number((impressions / days).toFixed(1)) : 0,
  };
}

function dropPercent(preValue: number, postValue: number): number {
  if (preValue <= 0) {
    return 0;
  }

  return Number((((preValue - postValue) / preValue) * 100).toFixed(2));
}

export function buildDailyCliffSummary(
  rows: DailyRow[],
  window: CliffWindow = DEFAULT_WINDOW
): DailyCliffSummary {
  const sortedRows = [...rows].sort((a, b) => a.date.localeCompare(b.date));
  const pre = summarize(sortedRows, window.preStart, window.preEnd);
  const post = summarize(sortedRows, window.postStart, window.postEnd);

  return {
    pre,
    post,
    clickDropPercent: dropPercent(pre.clicks, post.clicks),
    impressionDropPercent: dropPercent(pre.impressions, post.impressions),
    lowestPostClickDays: sortedRows.filter(
      (row) => row.date >= window.postStart && row.date <= window.postEnd && row.clicks <= 1
    ).length,
  };
}

function renderReport(rows: DailyRow[], summary: DailyCliffSummary): string {
  const aroundDrop = rows
    .filter((row) => row.date >= '2026-03-24' && row.date <= '2026-04-06')
    .sort((a, b) => a.date.localeCompare(b.date));

  return [
    '# GSC Traffic Cliff Report - 2026-07-01',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Summary',
    '',
    `- Pre-drop window: ${summary.pre.start} to ${summary.pre.end}, ${summary.pre.clicks.toLocaleString('en-US')} clicks, ${summary.pre.impressions.toLocaleString('en-US')} impressions, ${summary.pre.averageClicks} clicks/day, ${summary.pre.averageImpressions} impressions/day.`,
    `- Post-drop window: ${summary.post.start} to ${summary.post.end}, ${summary.post.clicks.toLocaleString('en-US')} clicks, ${summary.post.impressions.toLocaleString('en-US')} impressions, ${summary.post.averageClicks} clicks/day, ${summary.post.averageImpressions} impressions/day.`,
    `- Click drop: ${summary.clickDropPercent}%.`,
    `- Impression drop: ${summary.impressionDropPercent}%.`,
    `- Post-drop days with 0 or 1 click: ${summary.lowestPostClickDays}.`,
    '',
    '## Cliff Window',
    '',
    '| Date | Clicks | Impressions | CTR | Position |',
    '|---|---:|---:|---:|---:|',
    ...aroundDrop.map((row) => `| ${row.date} | ${row.clicks} | ${row.impressions} | ${row.ctr} | ${row.position} |`),
    '',
  ].join('\n');
}

function main(): void {
  const args = parseArgs(argv.slice(2));
  const input = args.input || 'exports/gsc/raw-csv/daily-2025-12-23_2026-06-29.csv';
  const output = args.output || 'docs/GSC_TRAFFIC_CLIFF_REPORT_2026-07-01.md';
  const rows = parseDailyRowsFromCsv(fs.readFileSync(input, 'utf8'));
  const summary = buildDailyCliffSummary(rows);

  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, renderReport(rows, summary));
  console.log(`GSC daily cliff report written to ${output}`);
}

if (import.meta.url === `file://${argv[1]}`) {
  main();
}
