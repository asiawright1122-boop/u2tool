#!/usr/bin/env tsx
/**
 * One-shot v2 retirement migrator.
 *
 * Picks the only two slugs `loadLegacyToolIndex` actually reads from
 * `src/messages/{locale}/v2/tools-index.json` (jwt-debugger and
 * jwt-decoder, derived from `toolMessageAliases` keys+values) and
 * merges their non-empty fields into `src/messages/{locale}/base.json`
 * under `tools.<slug>`.
 *
 * After this script runs, the only consumer of v2/* is no longer
 * needed and the v2 directory tree can be deleted.
 *
 * Run once: `npx tsx scripts/maintenance/migrate-v2-tool-index.ts`
 */
import { readFileSync, writeFileSync } from 'node:fs';

const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const SLUGS_TO_MIGRATE = ['jwt-debugger', 'jwt-decoder'];

type ToolMeta = {
  name?: string;
  description?: string;
  seo_title?: string;
  seo_description?: string;
  [k: string]: unknown;
};

type BaseShape = {
  tools?: Record<string, ToolMeta>;
  [k: string]: unknown;
};

let mergedCount = 0;
let skipped = 0;

for (const locale of LOCALES) {
  const v2Path = `src/messages/${locale}/v2/tools-index.json`;
  const v1Path = `src/messages/${locale}/base.json`;

  const v2Raw = readFileSync(v2Path, 'utf-8');
  const v1Raw = readFileSync(v1Path, 'utf-8');
  const v2Index = JSON.parse(v2Raw) as Record<string, ToolMeta>;
  const v1Base = JSON.parse(v1Raw) as BaseShape;

  if (!v1Base.tools || typeof v1Base.tools !== 'object') {
    v1Base.tools = {};
  }

  let touched = false;

  for (const slug of SLUGS_TO_MIGRATE) {
    const v2Entry = v2Index[slug];
    if (!v2Entry || typeof v2Entry !== 'object') {
      skipped++;
      continue;
    }

    const v1Existing = (v1Base.tools as Record<string, ToolMeta>)[slug] ?? {};

    // Merge: v2 wins for fields v1 lacks; v1 keeps its existing fields.
    // This preserves the runtime-integrity contract used by
    // src/lib/translations.ts applyToolMessageAliases() before this
    // change.
    const merged: ToolMeta = { ...v2Entry, ...v1Existing };

    // But if v1 lacks the entry entirely, take the v2 entry whole.
    if (Object.keys(v1Existing).length === 0) {
      Object.assign(merged, v2Entry);
    }

    (v1Base.tools as Record<string, ToolMeta>)[slug] = merged;
    touched = true;
    mergedCount++;
  }

  if (touched) {
    writeFileSync(v1Path, JSON.stringify(v1Base, null, 2) + '\n');
    console.log(`✓ ${locale}: merged ${SLUGS_TO_MIGRATE.length} slug(s) into ${v1Path}`);
  }
}

console.log(`\nDone. Merged ${mergedCount} entries across ${LOCALES.length} locales (${skipped} v2 entries were empty/missing).`);
