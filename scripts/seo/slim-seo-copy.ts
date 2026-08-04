/**
 * slim-seo-copy.ts
 *
 * Batch-slim over-long seo_title / seo_description fields flagged by the TDK
 * integrity audit (warnings are optimization debt, not errors). Google renders
 * roughly 155-160 chars of a meta description, so over-long copy is wasted
 * SERP real estate with an uncontrolled truncation point.
 *
 * Strategy: cut at the last sentence boundary within the safe limit, keeping
 * the keyword-dense opening intact. Single over-long sentences fall back to a
 * hard character cut. CJK and Latin both supported.
 *
 * Usage:
 *   npm run seo:slim-seo-copy -- --dry-run   # preview only, no writes
 *   npm run seo:slim-seo-copy -- --apply     # write changes
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const LATIN_TITLE_MAX = 70;
const LATIN_DESC_MAX = 180;
const CJK_TITLE_MAX = 35;
const CJK_DESC_MAX = 120;

const CJK_LANGUAGES = new Set(['zh', 'ja', 'ko']);

interface TdkFinding {
  locale: string;
  slug: string;
  field: 'seo_title' | 'seo_description';
  length: number;
  overBy: number;
}

interface SlimChange {
  filePath: string;
  slug: string;
  field: string;
  before: string;
  after: string;
}

function parseArgs(argv: string[]): { mode: 'dry-run' | 'apply' } {
  const mode = argv.includes('--apply') ? 'apply' : 'dry-run';
  return { mode };
}

function loadFindings(): TdkFinding[] {
  const reportsDir = path.join('.planning', 'research', 'reports');
  const reportFile = fs
    .readdirSync(reportsDir)
    .filter((name) => name.startsWith('tdk-integrity'))
    .map((name) => ({ name, mtime: fs.statSync(path.join(reportsDir, name)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0]?.name;
  if (!reportFile) throw new Error('No TDK integrity report found');

  const report = JSON.parse(
    fs.readFileSync(path.join(reportsDir, reportFile), 'utf8'),
  ) as { findings: TdkFinding[] };

  return report.findings.filter(
    (finding) =>
      finding.field === 'seo_description' || finding.field === 'seo_title',
  );
}

function limitFor(locale: string, field: 'seo_title' | 'seo_description'): number {
  const cjk = CJK_LANGUAGES.has(locale);
  if (field === 'seo_title') return cjk ? CJK_TITLE_MAX : LATIN_TITLE_MAX;
  return cjk ? CJK_DESC_MAX : LATIN_DESC_MAX;
}

function slimText(text: string, max: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;

  const lastIndexWithin = (regex: RegExp, floor: number): number => {
    let last = -1;
    for (let index = 0; index < trimmed.length && index < max; index += 1) {
      if (regex.test(trimmed[index])) last = index + 1;
    }
    return last >= floor ? last : -1;
  };

  const sentenceEnd = /[。！？.!?；;]/u;
  const softBoundary = /[。！？.!?；;，,、\s]/u;

  // 1. Sentence boundary near the limit (keeps meaning intact).
  const sentenceCut = lastIndexWithin(sentenceEnd, Math.floor(max * 0.6));
  if (sentenceCut !== -1) {
    return trimmed.slice(0, sentenceCut).trim();
  }

  // 2. Any soft boundary (comma/space) near the limit.
  const softCut = lastIndexWithin(softBoundary, Math.floor(max * 0.6));
  if (softCut !== -1) {
    return trimmed.slice(0, softCut).trim();
  }

  // 3. Hard character cut as a last resort.
  return trimmed.slice(0, max).trimEnd();
}

function slimField(
  locale: string,
  slug: string,
  field: 'seo_title' | 'seo_description',
  value: string,
): string | null {
  const max = limitFor(locale, field);
  const slimmed = slimText(value, max);
  return slimmed === value.trim() ? null : slimmed;
}

function collectChanges(findings: TdkFinding[]): SlimChange[] {
  const changes: SlimChange[] = [];
  const seen = new Set<string>();

  for (const finding of findings) {
    const key = `${finding.locale}/${finding.slug}/${finding.field}`;
    if (seen.has(key)) continue;
    seen.add(key);

    // Field may live in the split tool file, the root aggregate catalog, or
    // the base aggregate catalog. Slim wherever it exists, keeping root/base
    // in sync (catalog contract tests require identical root/base entries).
    const candidatePaths = [
      path.join('src', 'messages', finding.locale, 'tools', `${finding.slug}.json`),
      path.join('src', 'messages', `${finding.locale}.json`),
      path.join('src', 'messages', finding.locale, 'base.json'),
    ];

    for (const filePath of candidatePaths) {
      if (!fs.existsSync(filePath)) continue;

      const messages = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
      const toolDict = (messages.tools as Record<string, Record<string, unknown>> | undefined)?.[finding.slug];
      const value = typeof toolDict?.[finding.field] === 'string' ? (toolDict[finding.field] as string) : undefined;
      if (value === undefined) continue;

      const slimmed = slimField(finding.locale, finding.slug, finding.field, value);
      if (slimmed !== null) {
        changes.push({
          filePath,
          slug: finding.slug,
          field: finding.field,
          before: value,
          after: slimmed,
        });
      }
    }
  }

  return changes;
}

function applyChanges(changes: SlimChange[]): void {
  const byFile = new Map<string, Array<{ slug: string; field: string; after: string }>>();
  for (const change of changes) {
    const list = byFile.get(change.filePath) ?? [];
    list.push({ slug: change.slug, field: change.field, after: change.after });
    byFile.set(change.filePath, list);
  }

  for (const [filePath, edits] of byFile) {
    const messages = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
    const toolsNamespace = messages.tools as Record<string, Record<string, unknown>>;
    for (const edit of edits) {
      toolsNamespace[edit.slug][edit.field] = edit.after;
    }
    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2) + '\n', 'utf8');
  }
}

function main(): void {
  const { mode } = parseArgs(process.argv.slice(2));
  const findings = loadFindings();
  const changes = collectChanges(findings);

  process.stdout.write(
    [
      `TDK over-long fields: ${findings.length}`,
      `slimeable changes:    ${changes.length} (mode: ${mode})`,
      '',
    ].join('\n'),
  );

  const preview = changes.slice(0, 12);
  for (const change of preview) {
    process.stdout.write(
      [
        `--- ${change.slug} (${change.field}) @ ${change.filePath.replace('src/messages/', '')} ---`,
        `  before (${change.before.length}ch): ${change.before.slice(0, 120)}`,
        `  after  (${change.after.length}ch): ${change.after}`,
        '',
      ].join('\n'),
    );
  }

  if (mode === 'apply' && changes.length > 0) {
    applyChanges(changes);
    process.stdout.write(`Applied ${changes.length} changes across ${changes.length} fields.\n`);
  }
}

main();
