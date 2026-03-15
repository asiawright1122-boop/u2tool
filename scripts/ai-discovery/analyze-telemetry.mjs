#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_TOP = 20;
const DEFAULT_OUTPUT = 'docs/ai-discovery-telemetry-summary.md';
const DEFAULT_CTR_THRESHOLD = 0.2;
const DEFAULT_FALLBACK_THRESHOLD = 0.35;
const VALID_NAMES = new Set(['query_submitted', 'result_clicked', 'fallback_viewed']);

function parseArgs(argv) {
  const args = {
    input: '',
    locale: 'all',
    top: DEFAULT_TOP,
    out: DEFAULT_OUTPUT,
    ctrThreshold: DEFAULT_CTR_THRESHOLD,
    fallbackThreshold: DEFAULT_FALLBACK_THRESHOLD,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    if (current === '--input' || current === '-i') {
      args.input = argv[i + 1] ?? '';
      i += 1;
      continue;
    }
    if (current === '--locale' || current === '-l') {
      args.locale = argv[i + 1] ?? 'all';
      i += 1;
      continue;
    }
    if (current === '--top') {
      const value = Number.parseInt(argv[i + 1] ?? '', 10);
      if (!Number.isNaN(value) && value > 0) {
        args.top = value;
      }
      i += 1;
      continue;
    }
    if (current === '--out' || current === '-o') {
      args.out = argv[i + 1] ?? DEFAULT_OUTPUT;
      i += 1;
      continue;
    }
    if (current === '--ctr-threshold') {
      const value = Number.parseFloat(argv[i + 1] ?? '');
      if (!Number.isNaN(value) && value >= 0) {
        args.ctrThreshold = value;
      }
      i += 1;
      continue;
    }
    if (current === '--fallback-threshold') {
      const value = Number.parseFloat(argv[i + 1] ?? '');
      if (!Number.isNaN(value) && value >= 0) {
        args.fallbackThreshold = value;
      }
      i += 1;
    }
  }

  return args;
}

function printUsage() {
  console.log('Usage:');
  console.log('  node scripts/ai-discovery/analyze-telemetry.mjs --input <events.json|events.ndjson> [--locale all|en] [--top 20] [--out docs/ai-discovery-telemetry-summary.md]');
  console.log('  Optional thresholds: --ctr-threshold 0.2 --fallback-threshold 0.35');
}

function parseEvents(raw) {
  const trimmed = raw.trim();
  if (!trimmed) {
    return [];
  }

  if (trimmed.startsWith('[')) {
    const parsed = JSON.parse(trimmed);
    if (!Array.isArray(parsed)) {
      throw new Error('JSON input must be an array when using array format.');
    }
    return parsed;
  }

  const lines = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, index) => {
    try {
      return JSON.parse(line);
    } catch {
      throw new Error(`Invalid NDJSON at line ${index + 1}`);
    }
  });
}

function normalizeQuery(query) {
  return String(query)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function toPct(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function safeRate(numerator, denominator) {
  if (!denominator) {
    return 0;
  }
  return numerator / denominator;
}

function statusForCtr(rate, threshold) {
  return rate >= threshold ? 'PASS' : 'WARN';
}

function statusForFallback(rate, threshold) {
  return rate <= threshold ? 'PASS' : 'WARN';
}

function buildTopFallback(events, top) {
  const frequency = new Map();
  const examples = new Map();

  for (const event of events) {
    if (event.name !== 'fallback_viewed') {
      continue;
    }

    if (typeof event.query !== 'string') {
      continue;
    }

    const normalized = normalizeQuery(event.query);
    if (!normalized) {
      continue;
    }

    frequency.set(normalized, (frequency.get(normalized) ?? 0) + 1);
    if (!examples.has(normalized)) {
      examples.set(normalized, event.query.trim());
    }
  }

  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([normalized, count]) => ({
      query: examples.get(normalized) ?? normalized,
      count,
    }));
}

function buildLocaleMetrics(events) {
  const metrics = new Map();

  for (const event of events) {
    const locale = typeof event.locale === 'string' && event.locale.trim() ? event.locale.trim() : 'unknown';
    if (!metrics.has(locale)) {
      metrics.set(locale, {
        locale,
        querySubmitted: 0,
        resultClicked: 0,
        fallbackViewed: 0,
      });
    }

    const target = metrics.get(locale);
    if (event.name === 'query_submitted') {
      target.querySubmitted += 1;
    } else if (event.name === 'result_clicked') {
      target.resultClicked += 1;
    } else if (event.name === 'fallback_viewed') {
      target.fallbackViewed += 1;
    }
  }

  return Array.from(metrics.values())
    .map((item) => ({
      ...item,
      ctr: safeRate(item.resultClicked, item.querySubmitted),
      fallbackRate: safeRate(item.fallbackViewed, item.querySubmitted),
    }))
    .sort((a, b) => b.querySubmitted - a.querySubmitted);
}

function buildSummary(events, args, inputPath) {
  const filtered = events.filter((event) => {
    if (!event || typeof event !== 'object') {
      return false;
    }
    if (!VALID_NAMES.has(event.name)) {
      return false;
    }
    if (args.locale === 'all') {
      return true;
    }
    return event.locale === args.locale;
  });

  const querySubmitted = filtered.filter((event) => event.name === 'query_submitted');
  const resultClicked = filtered.filter((event) => event.name === 'result_clicked');
  const fallbackViewed = filtered.filter((event) => event.name === 'fallback_viewed');

  const uniqueSubmitted = new Set(
    querySubmitted
      .map((event) => (typeof event.query === 'string' ? normalizeQuery(event.query) : ''))
      .filter(Boolean)
  ).size;

  const uniqueFallback = new Set(
    fallbackViewed
      .map((event) => (typeof event.query === 'string' ? normalizeQuery(event.query) : ''))
      .filter(Boolean)
  ).size;

  const ctr = safeRate(resultClicked.length, querySubmitted.length);
  const fallbackRate = safeRate(fallbackViewed.length, querySubmitted.length);
  const ctrStatus = statusForCtr(ctr, args.ctrThreshold);
  const fallbackStatus = statusForFallback(fallbackRate, args.fallbackThreshold);
  const localeMetrics = buildLocaleMetrics(filtered);
  const topFallback = buildTopFallback(filtered, args.top);

  const timestamps = filtered
    .map((event) => (typeof event.timestamp === 'string' ? Date.parse(event.timestamp) : NaN))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  const firstTimestamp = timestamps.length > 0 ? new Date(timestamps[0]).toISOString() : 'N/A';
  const lastTimestamp = timestamps.length > 0 ? new Date(timestamps[timestamps.length - 1]).toISOString() : 'N/A';

  const markdownLines = [
    '# AI Discovery Telemetry Summary',
    '',
    `Generated at: ${new Date().toISOString()}`,
    `Input file: ${inputPath}`,
    `Locale filter: ${args.locale}`,
    `Event window: ${firstTimestamp} -> ${lastTimestamp}`,
    '',
    '## Core Metrics',
    '',
    '| Metric | Value |',
    '| --- | --- |',
    `| query_submitted | ${querySubmitted.length} |`,
    `| result_clicked | ${resultClicked.length} |`,
    `| fallback_viewed | ${fallbackViewed.length} |`,
    `| CTR (clicked/submitted) | ${toPct(ctr)} (target >= ${toPct(args.ctrThreshold)}) ${ctrStatus} |`,
    `| Fallback Rate (fallback/submitted) | ${toPct(fallbackRate)} (target <= ${toPct(args.fallbackThreshold)}) ${fallbackStatus} |`,
    `| Unique submitted queries | ${uniqueSubmitted} |`,
    `| Unique fallback queries | ${uniqueFallback} |`,
    '',
    '## Locale Metrics',
    '',
    '| Locale | query_submitted | result_clicked | fallback_viewed | CTR | Fallback Rate |',
    '| --- | ---: | ---: | ---: | ---: | ---: |',
  ];

  if (localeMetrics.length === 0) {
    markdownLines.push('| N/A | 0 | 0 | 0 | 0.0% | 0.0% |');
  } else {
    for (const item of localeMetrics) {
      markdownLines.push(
        `| ${item.locale} | ${item.querySubmitted} | ${item.resultClicked} | ${item.fallbackViewed} | ${toPct(item.ctr)} | ${toPct(item.fallbackRate)} |`
      );
    }
  }

  markdownLines.push('', `## Top ${args.top} Fallback Queries`, '', '| # | Query | Count |', '| ---: | --- | ---: |');
  if (topFallback.length === 0) {
    markdownLines.push('| 1 | N/A | 0 |');
  } else {
    for (let i = 0; i < topFallback.length; i += 1) {
      const item = topFallback[i];
      markdownLines.push(`| ${i + 1} | ${item.query.replace(/\|/g, '\\|')} | ${item.count} |`);
    }
  }

  return {
    filteredCount: filtered.length,
    ctr,
    fallbackRate,
    ctrStatus,
    fallbackStatus,
    markdown: `${markdownLines.join('\n')}\n`,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input) {
    printUsage();
    process.exit(1);
  }

  const inputPath = path.resolve(process.cwd(), args.input);
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input file not found: ${inputPath}`);
  }

  const raw = fs.readFileSync(inputPath, 'utf-8');
  const events = parseEvents(raw);
  const summary = buildSummary(events, args, inputPath);

  const outputPath = path.resolve(process.cwd(), args.out);
  fs.writeFileSync(outputPath, summary.markdown, 'utf-8');

  console.log(`Analyzed ${summary.filteredCount} event(s).`);
  console.log(`CTR: ${toPct(summary.ctr)} (${summary.ctrStatus}), Fallback Rate: ${toPct(summary.fallbackRate)} (${summary.fallbackStatus})`);
  console.log(`Summary written to: ${outputPath}`);
}

try {
  main();
} catch (error) {
  console.error('[ai-discovery] telemetry analysis failed:', error.message);
  process.exit(1);
}
