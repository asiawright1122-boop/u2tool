/** Review-first index governance. See docs/SEO_RECOVERY_GUARDRAILS.md. */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { tools } from '../../src/config/tools/index';
import { locales } from '../../src/lib/i18n';
import { deriveIndexSuppression, parseExistingSuppressionKeys, toolKeyFromUrl,
  type SuppressionReadinessRow } from './index-suppression-policy';

export interface RetentionApproval {
  key: string;
  reason: string;
  evidence: string;
  reviewAfter?: string;
}
interface EvidenceWindow { start: string; end: string; complete: boolean }
export interface ReadinessReport {
  checkpointDate?: string;
  evidenceWindow?: { current: EvidenceWindow; historical: EvidenceWindow };
  rows: (SuppressionReadinessRow & { evidence: SuppressionReadinessRow['evidence'] & { priority?: string } })[];
}
export interface PlanInput {
  report: ReadinessReport;
  checkpointDate: string;
  asOf: string;
  catalogKeys: string[];
  existingSuppressedKeys: ReadonlySet<string>;
  approvals: RetentionApproval[];
  renderedKeys?: ReadonlySet<string>;
}
const digest = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
function dateValue(date: string): number {
  const value = Date.parse(date);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(value) &&
    new Date(value).toISOString().slice(0, 10) === date ? value : NaN;
}

/** Unknown, stale or incomplete evidence holds BOTH index and noindex states. */
export function planIndexSuppression(input: PlanInput) {
  const { report, checkpointDate, asOf, approvals, existingSuppressedKeys } = input;
  const blockers: string[] = [];
  const catalog = new Set(input.catalogKeys);
  const rows = new Map<string, ReadinessReport['rows'][number]>();
  for (const row of report.rows) {
    const key = toolKeyFromUrl(row.url);
    if (!key) { blockers.push(`invalid-url:${row.url}`); continue; }
    if (rows.has(key)) blockers.push(`duplicate-row:${key}`);
    rows.set(key, row);
  }
  const missingKeys = [...catalog].filter(key => !rows.has(key)).sort();
  const removedKeys = [...rows.keys()].filter(key => !catalog.has(key)).sort();
  if (missingKeys.length || removedKeys.length) blockers.push('catalog-mismatch');
  if ([...existingSuppressedKeys].some(key => !catalog.has(key))) blockers.push('baseline-catalog-mismatch');
  const age = (dateValue(asOf) - dateValue(checkpointDate)) / 86400000;
  if (!Number.isFinite(age) || age < 0 || age > 28) blockers.push('stale-checkpoint');
  if (report.checkpointDate !== checkpointDate) blockers.push('checkpoint-date-mismatch');
  const windows = report.evidenceWindow;
  if (!windows) blockers.push('evidence-window-unverified');
  else {
    for (const name of ['current', 'historical'] as const) {
      const window = windows[name];
      if (!window || window.complete !== true || !Number.isFinite(dateValue(window.start)) ||
          !Number.isFinite(dateValue(window.end)) || window.start > window.end || window.end > asOf ||
          (name === 'current' && (dateValue(asOf) - dateValue(window.end)) / 86400000 > 28)) {
        blockers.push(`incomplete-or-stale-window:${name}`);
      }
    }
    if (windows.current && windows.historical && windows.historical.end >= windows.current.start) {
      blockers.push('overlapping-evidence-windows');
    }
  }
  const protectedKeys = new Set<string>();
  for (const approval of approvals) {
    if (!catalog.has(approval.key) || protectedKeys.has(approval.key) || !approval.reason?.trim() ||
        !approval.evidence?.trim() || (approval.reviewAfter && !Number.isFinite(dateValue(approval.reviewAfter)))) {
      blockers.push(`invalid-retention-approval:${approval.key}`);
    }
    protectedKeys.add(approval.key);
  }
  const reviewRequired = approvals.filter(a => a.reviewAfter && a.reviewAfter < asOf).map(a => a.key).sort();
  for (const [key, row] of rows) {
    if (['pilot', 'p1'].includes(row.evidence?.priority ?? '')) protectedKeys.add(key);
  }
  let candidate = new Set(existingSuppressedKeys);
  try {
    const derived = deriveIndexSuppression({
      rows: report.rows.filter(row => catalog.has(toolKeyFromUrl(row.url) ?? '')),
      renderedKeys: input.renderedKeys ?? new Set(), protectedKeys, existingSuppressedKeys,
      supplementalDemandByKey: new Map(),
    });
    candidate = new Set(derived.suppression.map(e => `${e.locale}/${e.slug}`));
  } catch (error) {
    blockers.push(`invalid-evidence:${error instanceof Error ? error.message : String(error)}`);
  }
  const decisions = [...catalog].sort().map(key => {
    const oldState = existingSuppressedKeys.has(key) ? 'noindex' : 'index';
    const newState = blockers.length ? oldState : candidate.has(key) ? 'noindex' : 'index';
    const approval = approvals.find(a => a.key === key);
    return {
      key, url: `https://www.u2tool.com/${key.replace('/', '/tools/')}/`, oldState, newState,
      reason: blockers.length ? 'hold-existing-state:blocked-input' : protectedKeys.has(key) ?
        'explicit-retention' : oldState === newState ? 'hold-existing-state-or-confirmed-evidence' :
        newState === 'index' ? 'positive-demand-or-rendered-evidence' : 'confirmed-noindex-candidate',
      evidence: approval?.evidence ?? report.evidenceWindow ?? null, checkpointDate, asOf,
    };
  });
  const changes = decisions.filter(d => d.oldState !== d.newState);
  const suppressionKeys = decisions.filter(d => d.newState === 'noindex').map(d => d.key);
  return { checkpointDate, asOf, blockers, missingKeys, removedKeys, reviewRequired, decisions, changes,
    suppressed: suppressionKeys.length, retained: catalog.size - suppressionKeys.length, suppressionKeys,
    approvalHash: digest({ input: { ...input, existingSuppressedKeys: [...existingSuppressedKeys].sort(),
      renderedKeys: [...(input.renderedKeys ?? [])].sort() }, changes }),
  };
}

/** Ignore empty/malformed directories; freshness is separately enforced by the plan. */
export function latestCheckpoint(root: string, catalogKeys = locales.flatMap(locale => tools.map(tool => `${locale}/${tool.slug}`))): string {
  const dir = path.join(root, 'exports/seo/tool-index-readiness');
  if (!fs.existsSync(dir)) return '';
  let fallback = '';
  for (const name of fs.readdirSync(dir).filter(name => /^\d{4}-\d{2}-\d{2}$/.test(name)).sort().reverse()) {
    try {
      const report = JSON.parse(fs.readFileSync(path.join(dir, name, 'tool-index-readiness.json'), 'utf8'));
      if (report.checkpointDate !== name || !Array.isArray(report.rows) || !report.rows.length) continue;
      fallback ||= name;
      const keys = new Set(report.rows.map((row: { url: string }) => toolKeyFromUrl(row.url)));
      if (keys.size === report.rows.length && keys.size === catalogKeys.length && catalogKeys.every(key => keys.has(key))) return name;
    } catch { /* Malformed or empty directories are not checkpoints. */ }
  }
  // A readable but incomplete report may be previewed; plan blockers forbid writing it.
  return fallback;
}

export function generateIndexSuppression(options: {
  root?: string; checkpointDate?: string; asOf?: string; write?: boolean; approveDiff?: string;
}) {
  const root = options.root ?? process.cwd();
  const checkpointDate = options.checkpointDate ?? latestCheckpoint(root);
  if (!checkpointDate || !Number.isFinite(dateValue(checkpointDate))) throw new Error('No valid readiness checkpoint found.');
  const readJson = (file: string) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  const report: ReadinessReport = readJson(`exports/seo/tool-index-readiness/${checkpointDate}/tool-index-readiness.json`);
  const output = path.join(root, 'src/config/index-suppression.generated.ts');
  const baseline = fs.readFileSync(output, 'utf8');
  const manifestPath = 'src/config/index-retention-approvals.json';
  const manifest = fs.existsSync(path.join(root, manifestPath)) ? readJson(manifestPath) : null;
  const plan = planIndexSuppression({ report, checkpointDate, asOf: options.asOf ?? new Date().toISOString().slice(0, 10),
    catalogKeys: locales.flatMap(locale => tools.map(tool => `${locale}/${tool.slug}`)),
    existingSuppressedKeys: parseExistingSuppressionKeys(baseline), approvals: manifest?.entries ?? [],
    // Historical rendered contracts do not prove today's build; do not import them.
  });
  if (!manifest || manifest.version !== 1 || !Number.isFinite(dateValue(manifest.recordedOn ?? ''))) {
    plan.blockers.push('retention-manifest-missing-or-invalid');
  }
  if (options.write) {
    if (options.asOf) throw new Error('--as-of is only allowed for previews');
    if (plan.blockers.length) throw new Error(`Write blocked: ${plan.blockers.join(', ')}`);
    if (options.approveDiff !== plan.approvalHash) throw new Error('Write requires --approve-diff with the reviewed preview approvalHash.');
    if (plan.changes.length) {
      const content = ['// GENERATED FILE — do not edit by hand.', '// Source: npm run seo:index-suppression:generate',
        `// Checkpoint: ${checkpointDate}`, `// Approved plan: ${plan.approvalHash}`,
        '// Unknown evidence holds existing state. Retention review dates do not revoke approval.',
        'export const INDEX_SUPPRESSION: Record<string, boolean> = {',
        ...plan.suppressionKeys.map(key => `  '${key}': true,`), '};', ''].join('\n');
      const temporary = `${output}.tmp`;
      fs.writeFileSync(temporary, content, { flag: 'wx' });
      fs.renameSync(temporary, output);
    }
  }
  return { ...plan, mode: options.write ? 'write' : 'dry-run', wrote: !!options.write && plan.changes.length > 0 };
}

function main() {
  const args = process.argv.slice(2);
  const options: Parameters<typeof generateIndexSuppression>[0] = {};
  let dryRun = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--write') options.write = true;
    else if (arg === '--dry-run') dryRun = true;
    else if (['--checkpoint-date', '--as-of', '--approve-diff'].includes(arg)) {
      const value = args[++i];
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`);
      if (arg === '--checkpoint-date') options.checkpointDate = value;
      else if (arg === '--as-of') options.asOf = value;
      else options.approveDiff = value;
    } else throw new Error(`Unknown argument: ${arg}`);
  }
  if (options.write && dryRun) throw new Error('--write and --dry-run are mutually exclusive');
  const { decisions, suppressionKeys, ...summary } = generateIndexSuppression(options);
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { main(); } catch (error) {
    process.stderr.write(`generate-index-suppression failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}
