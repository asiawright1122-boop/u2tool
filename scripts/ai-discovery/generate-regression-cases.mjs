#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_LIMIT = 20;
const DEFAULT_OUTPUT = 'docs/ai-discovery-regression-cases.generated.json';

function parseArgs(argv) {
  const args = {
    input: '',
    locale: 'all',
    limit: DEFAULT_LIMIT,
    out: DEFAULT_OUTPUT,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    if (current === '--input' || current === '-i') {
      args.input = argv[i + 1] ?? '';
      i += 1;
      continue;
    }
    if (current === '--locale' || current === '-l') {
      args.locale = argv[i + 1] ?? 'en';
      i += 1;
      continue;
    }
    if (current === '--limit') {
      const value = Number.parseInt(argv[i + 1] ?? '', 10);
      if (!Number.isNaN(value) && value > 0) {
        args.limit = value;
      }
      i += 1;
      continue;
    }
    if (current === '--out' || current === '-o') {
      args.out = argv[i + 1] ?? DEFAULT_OUTPUT;
      i += 1;
    }
  }

  return args;
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
  return query
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function toId(query, index, locale) {
  const slug = normalizeQuery(query)
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 40);
  return `fallback-${locale}-${index + 1}-${slug || 'query'}`;
}

function buildCases(events, localeFilter, limit) {
  const frequency = new Map();
  const examples = new Map();
  const localeByKey = new Map();

  for (const event of events) {
    if (!event || typeof event !== 'object') {
      continue;
    }

    if (event.name !== 'fallback_viewed') {
      continue;
    }

    if (typeof event.query !== 'string') {
      continue;
    }

    const eventLocale =
      typeof event.locale === 'string' && event.locale.trim().length > 0
        ? event.locale.trim()
        : 'en';

    if (localeFilter !== 'all' && eventLocale !== localeFilter) {
      continue;
    }

    const normalized = normalizeQuery(event.query);
    if (!normalized) {
      continue;
    }

    const key = `${eventLocale}::${normalized}`;
    frequency.set(key, (frequency.get(key) ?? 0) + 1);
    if (!examples.has(key)) {
      examples.set(key, event.query.trim());
      localeByKey.set(key, eventLocale);
    }
  }

  const ranked = Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  return ranked.map(([key, count], index) => {
    const original = examples.get(key) ?? key.split('::')[1] ?? key;
    const locale = localeByKey.get(key) ?? 'en';
    return {
      id: toId(original, index, locale),
      locale,
      query: original,
      expectedAction: 'fallback',
      maxConfidence: 0.2,
      observedCount: count,
      notes: 'Auto-generated from telemetry fallback_viewed events. Review and set expectedTopSlug when matcher improves.',
    };
  });
}

function printUsage() {
  console.log('Usage:');
  console.log('  node scripts/ai-discovery/generate-regression-cases.mjs --input <events.json|events.ndjson> [--locale all|en|zh] [--limit 20] [--out docs/ai-discovery-regression-cases.generated.json]');
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
  const generated = buildCases(events, args.locale, args.limit);

  const outputPath = path.resolve(process.cwd(), args.out);
  fs.writeFileSync(outputPath, `${JSON.stringify(generated, null, 2)}\n`, 'utf-8');

  console.log(`Generated ${generated.length} regression case(s) to: ${outputPath}`);
  if (generated.length === 0) {
    console.log('No fallback_viewed events with query were found.');
  } else {
    for (const item of generated) {
      console.log(`- ${item.query} (count: ${item.observedCount})`);
    }
  }
}

try {
  main();
} catch (error) {
  console.error('[ai-discovery] failed to generate regression cases:', error.message);
  process.exit(1);
}
