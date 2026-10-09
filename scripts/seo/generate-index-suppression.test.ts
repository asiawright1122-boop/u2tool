import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { expect, it } from 'vitest';
import { generateIndexSuppression, latestCheckpoint, planIndexSuppression, type PlanInput } from './generate-index-suppression';
import { tools } from '../../src/config/tools/index';
import { locales } from '../../src/lib/i18n';
import { INDEX_SUPPRESSION } from '../../src/config/index-suppression.generated';
import retention from '../../src/config/index-retention-approvals.json';

const localCheckpointAvailable = fs.existsSync('exports/seo/tool-index-readiness/2026-07-13/tool-index-readiness.json');

function fixture(): PlanInput & { existingSuppressedKeys: Set<string> } {
  return {
    asOf: '2026-10-09', checkpointDate: '2026-10-09', catalogKeys: ['en/example'],
    existingSuppressedKeys: new Set(), approvals: [],
    report: {
      checkpointDate: '2026-10-09',
      evidenceWindow: { current: { start: '2026-09-09', end: '2026-10-06', complete: true },
        historical: { start: '2026-08-12', end: '2026-09-08', complete: true } },
      rows: [{ url: 'https://www.u2tool.com/en/tools/example/',
        demandCoverage: { currentPageRow: false, historicalPageRow: false },
        decision: { recommendation: 'manual-review', missingEvidence: ['demand'] },
        evidence: { demand: { currentClicks: null, currentImpressions: null, historicalClicks: null, historicalImpressions: null },
          content: { hasIndependentSplitCopy: false, detailedDescriptionLength: 0, usageStepCount: 0,
            usageExampleCount: 0, faqCount: 0, duplicateContentKey: null, fallbackUsed: false } } }],
    },
  };
}

it.each([false, true])('unknown demand preserves existing suppressed=%s without reopening or closing', (suppressed) => {
  const input = fixture();
  if (suppressed) input.existingSuppressedKeys.add('en/example');
  const plan = planIndexSuppression(input);
  expect(plan.blockers).toEqual([]);
  expect(plan.changes).toEqual([]);
  expect(plan.suppressed).toBe(Number(suppressed));
});

it('writes only an exactly approved fresh diff and is idempotent afterward', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'u2tool-approved-write-test-'));
  try {
    const date = (days: number) => new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
    const report = fixture().report;
    report.checkpointDate = date(0);
    report.evidenceWindow = { current: { start: date(7), end: date(1), complete: true },
      historical: { start: date(14), end: date(8), complete: true } };
    const row = report.rows[0];
    report.rows = locales.flatMap(locale => tools.map(tool => ({ ...structuredClone(row),
      url: `https://www.u2tool.com/${locale}/tools/${tool.slug}/` })));
    const recoveryKey = Object.keys(INDEX_SUPPRESSION)[0];
    const recovery = report.rows.find(r => r.url === `https://www.u2tool.com/${recoveryKey.replace('/', '/tools/')}/`)!;
    recovery.demandCoverage.currentPageRow = true;
    recovery.evidence.demand.currentClicks = 1;
    recovery.evidence.demand.currentImpressions = 10;
    const dir = path.join(root, `exports/seo/tool-index-readiness/${date(0)}`);
    fs.mkdirSync(dir, { recursive: true });
    fs.mkdirSync(path.join(root, 'src/config'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'tool-index-readiness.json'), JSON.stringify(report));
    for (const file of ['index-retention-approvals.json', 'index-suppression.generated.ts']) {
      fs.copyFileSync(`src/config/${file}`, path.join(root, 'src/config', file));
    }
    const preview = generateIndexSuppression({ root });
    expect(preview.blockers).toEqual([]);
    expect(preview.changes).toMatchObject([{ key: recoveryKey, oldState: 'noindex', newState: 'index' }]);
    expect(() => generateIndexSuppression({ root, write: true })).toThrow('--approve-diff');
    expect(() => generateIndexSuppression({ root, write: true, approveDiff: 'wrong' })).toThrow('--approve-diff');
    expect(generateIndexSuppression({ root, write: true, approveDiff: preview.approvalHash }).wrote).toBe(true);
    const after = fs.readFileSync(path.join(root, 'src/config/index-suppression.generated.ts'), 'utf8');
    const second = generateIndexSuppression({ root });
    expect(second.changes).toEqual([]);
    expect(generateIndexSuppression({ root, write: true, approveDiff: second.approvalHash }).wrote).toBe(false);
    expect(fs.readFileSync(path.join(root, 'src/config/index-suppression.generated.ts'), 'utf8')).toBe(after);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

it('only proposes suppression for explicit zero rows with complete review evidence', () => {
  const input = fixture();
  const row = input.report.rows[0];
  row.demandCoverage = { currentPageRow: true, historicalPageRow: true };
  row.evidence.demand = { currentClicks: 0, currentImpressions: 0, historicalClicks: 0, historicalImpressions: 0 };
  row.decision = { recommendation: 'noindex-candidate', missingEvidence: [] };
  expect(planIndexSuppression(input).changes).toMatchObject([{ oldState: 'index', newState: 'noindex' }]);
  input.approvals = [{ key: 'en/example', reason: 'Approved product value', evidence: 'review', reviewAfter: '2026-10-01' }];
  const protectedPlan = planIndexSuppression(input);
  expect(protectedPlan.blockers).toEqual([]);
  expect(protectedPlan.changes).toEqual([]);
  expect(protectedPlan.reviewRequired).toEqual(['en/example']);
});

it.each(['truncated', 'missing', 'duplicate', 'negative', 'placeholder', 'stale-window', 'invalid-date'])('blocks %s evidence and holds state', (scenario) => {
  const input = fixture();
  if (scenario === 'truncated') input.report.evidenceWindow!.current.complete = false;
  if (scenario === 'missing') input.report.rows = [];
  if (scenario === 'duplicate') input.report.rows.push(input.report.rows[0]);
  if (scenario === 'negative') { input.report.rows[0].demandCoverage.currentPageRow = true; input.report.rows[0].evidence.demand.currentClicks = -1; }
  if (scenario === 'placeholder') input.report.rows[0].evidence.demand.currentClicks = 0;
  if (scenario === 'stale-window') input.report.evidenceWindow!.current = { start: '2026-07-04', end: '2026-07-10', complete: true };
  if (scenario === 'invalid-date') input.asOf = '2026-02-30';
  const plan = planIndexSuppression(input);
  expect(plan.blockers.length).toBeGreaterThan(0);
  expect(plan.changes).toEqual([]);
});

it('produces deterministic plans and binds approval to evidence and baseline', () => {
  const input = fixture();
  const first = planIndexSuppression(input);
  expect(planIndexSuppression(input)).toEqual(first);
  input.existingSuppressedKeys.add('en/example');
  expect(planIndexSuppression(input).approvalHash).not.toBe(first.approvalHash);
});

it.skipIf(!localCheckpointAvailable)('rejects archived local checkpoint writes without touching the real baseline', () => {
  const output = 'src/config/index-suppression.generated.ts';
  const before = fs.readFileSync(output, 'utf8');
  expect(() => generateIndexSuppression({ checkpointDate: '2026-07-13', write: true, approveDiff: 'invalid' })).toThrow('Write blocked');
  expect(fs.readFileSync(output, 'utf8')).toBe(before);
});

it('ignores newer empty or malformed checkpoint directories', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'u2tool-checkpoint-test-'));
  try {
    const base = path.join(root, 'exports/seo/tool-index-readiness');
    for (const date of ['2026-10-07', '2026-10-08', '2026-10-09']) fs.mkdirSync(path.join(base, date), { recursive: true });
    fs.writeFileSync(path.join(base, '2026-10-07/tool-index-readiness.json'), JSON.stringify({ checkpointDate: '2026-10-07', rows: [{}] }));
    fs.writeFileSync(path.join(base, '2026-10-08/tool-index-readiness.json'), '{');
    expect(latestCheckpoint(root)).toBe('2026-10-07');
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

it('prefers a catalog-complete checkpoint over a newer truncated report', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'u2tool-complete-checkpoint-test-'));
  try {
    const base = path.join(root, 'exports/seo/tool-index-readiness');
    for (const date of ['2026-10-07', '2026-10-08']) {
      fs.mkdirSync(path.join(base, date), { recursive: true });
      fs.writeFileSync(path.join(base, date, 'tool-index-readiness.json'), JSON.stringify({ checkpointDate: date,
        rows: (date === '2026-10-07' ? ['example', 'second'] : ['example'])
          .map(slug => ({ url: `https://www.u2tool.com/en/tools/${slug}/` })) }));
    }
    expect(latestCheckpoint(root, ['en/example', 'en/second'])).toBe('2026-10-07');
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

it.skipIf(!localCheckpointAvailable).each(['2026-10-09', '2026-10-16'])('replays the archived local checkpoint without index drift on %s', (asOf) => {
  const result = spawnSync(process.execPath, ['--import', 'tsx/esm',
    'scripts/seo/generate-index-suppression.ts', '--checkpoint-date', '2026-07-13', '--as-of', asOf],
  { encoding: 'utf8' });
  expect(result.status, result.stderr).toBe(0);
  const plan = JSON.parse(result.stdout);
  expect(plan.changes).toEqual([]);
  expect(plan.suppressed).toBe(3845);
  expect(plan.retained).toBe(1795);
  expect(plan.blockers).toContain('stale-checkpoint');
  expect(plan.reviewRequired).toContain('en/jwt-debugger');
});

it.each(['2026-10-09', '2026-10-16'])('protects all 226 migrated URLs even with fresh zero-demand candidates on %s', asOf => {
  const input = fixture();
  input.asOf = asOf;
  input.catalogKeys = retention.entries.map(entry => entry.key);
  input.approvals = retention.entries;
  const row = input.report.rows[0];
  row.demandCoverage = { currentPageRow: true, historicalPageRow: true };
  row.evidence.demand = { currentClicks: 0, currentImpressions: 0, historicalClicks: 0, historicalImpressions: 0 };
  row.decision = { recommendation: 'noindex-candidate', missingEvidence: [] };
  input.report.rows = input.catalogKeys.map(key => ({ ...structuredClone(row), url: `https://www.u2tool.com/${key.replace('/', '/tools/')}/` }));
  const plan = planIndexSuppression(input);
  expect(plan.blockers).toEqual([]);
  expect(plan.changes).toEqual([]);
  expect(plan.retained).toBe(226);
});

it('CLI preview never overwrites the approved suppression baseline', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'u2tool-index-test-'));
  try {
    const dir = path.join(root, 'exports/seo/tool-index-readiness/2026-07-13');
    fs.mkdirSync(dir, { recursive: true });
    fs.mkdirSync(path.join(root, 'src/config'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'tool-index-readiness.json'), JSON.stringify({ rows: [] }));
    const output = path.join(root, 'src/config/index-suppression.generated.ts');
    const baseline = "export const INDEX_SUPPRESSION = {\n  'en/example': true,\n};\n";
    fs.writeFileSync(output, baseline);
    const result = spawnSync(process.execPath, ['--import', path.resolve('node_modules/tsx/dist/esm/index.mjs'),
      path.resolve('scripts/seo/generate-index-suppression.ts'), '--checkpoint-date', '2026-07-13'],
    { cwd: root, encoding: 'utf8' });
    expect(result.status, result.stderr).toBe(0);
    expect(fs.readFileSync(output, 'utf8')).toBe(baseline);
    const denied = spawnSync(process.execPath, ['--import', path.resolve('node_modules/tsx/dist/esm/index.mjs'),
      path.resolve('scripts/seo/generate-index-suppression.ts'), '--checkpoint-date', '2026-07-13', '--write'],
    { cwd: root, encoding: 'utf8' });
    expect(denied.status).toBe(1);
    expect(denied.stderr).toContain('Write blocked');
    expect(fs.readFileSync(output, 'utf8')).toBe(baseline);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
