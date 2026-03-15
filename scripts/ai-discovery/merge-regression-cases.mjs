#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_BASE = 'docs/ai-discovery-regression-cases.json';
const DEFAULT_INCOMING = 'docs/ai-discovery-regression-cases.generated.json';
const DEFAULT_OUT = DEFAULT_BASE;

function parseArgs(argv) {
  const args = {
    base: DEFAULT_BASE,
    incoming: DEFAULT_INCOMING,
    out: DEFAULT_OUT,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    if (current === '--base') {
      args.base = argv[i + 1] ?? DEFAULT_BASE;
      i += 1;
      continue;
    }
    if (current === '--incoming') {
      args.incoming = argv[i + 1] ?? DEFAULT_INCOMING;
      i += 1;
      continue;
    }
    if (current === '--out' || current === '-o') {
      args.out = argv[i + 1] ?? DEFAULT_OUT;
      i += 1;
    }
  }

  return args;
}

function printUsage() {
  console.log('Usage:');
  console.log('  node scripts/ai-discovery/merge-regression-cases.mjs [--base docs/ai-discovery-regression-cases.json] [--incoming docs/ai-discovery-regression-cases.generated.json] [--out docs/ai-discovery-regression-cases.json]');
}

function loadJsonArray(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(`Expected JSON array: ${filePath}`);
  }
  return parsed;
}

function normalizeQuery(query) {
  return String(query ?? '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function makeCaseKey(item) {
  const locale =
    typeof item.locale === 'string' && item.locale.trim().length > 0
      ? item.locale.trim()
      : 'en';
  const query = normalizeQuery(item.query);
  return `${locale}::${query}`;
}

function slugify(value) {
  return normalizeQuery(value)
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 40);
}

function generateId(locale, query, usedIds) {
  const base = `fallback-${locale}-${slugify(query) || 'query'}`;
  if (!usedIds.has(base)) {
    return base;
  }

  let n = 2;
  while (usedIds.has(`${base}-${n}`)) {
    n += 1;
  }
  return `${base}-${n}`;
}

function sanitizeCase(item, usedIds) {
  const locale =
    typeof item.locale === 'string' && item.locale.trim().length > 0
      ? item.locale.trim()
      : 'en';
  const query = typeof item.query === 'string' ? item.query.trim() : '';
  if (!query) {
    return null;
  }

  const next = { ...item, locale, query };
  const incomingId = typeof next.id === 'string' ? next.id.trim() : '';
  if (!incomingId || usedIds.has(incomingId)) {
    next.id = generateId(locale, query, usedIds);
  } else {
    next.id = incomingId;
  }
  usedIds.add(next.id);
  return next;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (process.argv.slice(2).includes('--help')) {
    printUsage();
    process.exit(0);
  }

  const basePath = path.resolve(process.cwd(), args.base);
  const incomingPath = path.resolve(process.cwd(), args.incoming);
  const outPath = path.resolve(process.cwd(), args.out);

  const baseCases = loadJsonArray(basePath);
  const incomingCases = loadJsonArray(incomingPath);

  const merged = [...baseCases];
  const usedKeys = new Set(baseCases.map(makeCaseKey));
  const usedIds = new Set(
    baseCases
      .map((item) => (typeof item.id === 'string' ? item.id.trim() : ''))
      .filter(Boolean)
  );

  let added = 0;
  let skipped = 0;
  let invalid = 0;

  for (const item of incomingCases) {
    const normalizedQuery = normalizeQuery(item?.query);
    if (!normalizedQuery) {
      invalid += 1;
      continue;
    }

    const key = makeCaseKey(item);
    if (usedKeys.has(key)) {
      skipped += 1;
      continue;
    }

    const sanitized = sanitizeCase(item, usedIds);
    if (!sanitized) {
      invalid += 1;
      continue;
    }

    merged.push(sanitized);
    usedKeys.add(key);
    added += 1;
  }

  fs.writeFileSync(outPath, `${JSON.stringify(merged, null, 2)}\n`, 'utf-8');

  console.log(`Merged regression cases written to: ${outPath}`);
  console.log(`Base: ${baseCases.length}, Incoming: ${incomingCases.length}, Added: ${added}, Skipped duplicates: ${skipped}, Invalid: ${invalid}`);
}

try {
  main();
} catch (error) {
  console.error('[ai-discovery] failed to merge regression cases:', error.message);
  process.exit(1);
}
