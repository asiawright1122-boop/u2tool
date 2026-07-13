# Cohort Rollout And Recovery Monitoring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Release recovery changes in measurable cohorts, preserve controls, detect technical regressions within 48 hours, and make 14-day/28-day expand-hold-rollback decisions from equal-window GSC evidence.

**Architecture:** A typed cohort registry defines changed URLs and candidate controls. A pure gate calculator compares normalized pilot and control metrics. A CLI consumes cohort-filtered GSC exports and writes an auditable report. Existing live technical validators provide the 48-hour safety evidence; the monitoring layer does not submit indexing requests or mutate the site.

**Tech Stack:** TypeScript, Vitest, existing GSC report scripts, Google Search Console CSV exports, live SEO/runtime validators, Markdown/JSON/CSV reports.

**Global Constraints:** One production pilot at a time; equal complete windows only; no same-day partial data; no GSC request-indexing action from this plan; no broad batch changes during a pilot measurement window; technical regressions roll back immediately; performance ambiguity waits for the full window.

---

## File Map

**Create:**

- `src/config/recovery-cohorts.ts`
- `src/config/recovery-cohorts.test.ts`
- `src/lib/recovery-cohort-gate.ts`
- `src/lib/recovery-cohort-gate.test.ts`
- `scripts/seo/gsc-recovery-cohort-report.ts`
- `scripts/seo/gsc-recovery-cohort-report.test.ts`
- `docs/GSC_RECOVERY_COHORT_RUNBOOK.md`

**Modify:**

- `package.json`
- `src/config/index-readiness-overrides.ts` after Subproject 3 creates it

**Generated:**

- `exports/gsc/cohorts/{cohort-id}/{checkpoint-date}/pilot-pages.csv`
- `exports/gsc/cohorts/{cohort-id}/{checkpoint-date}/pilot-queries.csv`
- `exports/gsc/cohorts/{cohort-id}/{checkpoint-date}/control-pages.csv`
- `exports/gsc/cohorts/{cohort-id}/{checkpoint-date}/control-queries.csv`
- `exports/gsc/cohorts/{cohort-id}/{checkpoint-date}/cohort-report.json`
- `exports/gsc/cohorts/{cohort-id}/{checkpoint-date}/cohort-report.md`
- `docs/GSC_COHORT_PILOT_01_GRAMMAR_2026-08-13.md` for the first 14-day pilot report; later reports use their real cohort ID and checkpoint date

## Task 1: Register Pilot And Control Cohorts

**Files:**
- Create: `src/config/recovery-cohorts.ts`
- Create: `src/config/recovery-cohorts.test.ts`

- [ ] **Step 1: Write the failing registry test**

Use:

```ts
import { describe, expect, it } from 'vitest';
import { locales } from '@/lib/i18n';
import { RECOVERY_COHORTS } from './recovery-cohorts';

describe('recovery cohorts', () => {
  it('registers the six pilots in approved release order', () => {
    expect(RECOVERY_COHORTS.map((cohort) => cohort.pilotSlug)).toEqual([
      'grammar-checker',
      'hex-editor',
      'sql-query-optimizer',
      'excel-viewer',
      'typing-speed-test',
      'gantt-chart-generator',
    ]);
  });

  it('provides one unchanged control URL for every pilot locale URL', () => {
    for (const cohort of RECOVERY_COHORTS) {
      expect(cohort.locales).toEqual(locales);
      expect(cohort.controlSlug).not.toBe(cohort.pilotSlug);
      expect(cohort.changedDimensions.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run and confirm failure**

```bash
npx vitest run src/config/recovery-cohorts.test.ts
```

- [ ] **Step 3: Define the cohort contract**

```ts
import { locales, type Locale } from '@/lib/i18n';

export type RecoveryChangeDimension =
  | 'capability-disclosure'
  | 'product-behavior'
  | 'language-truthfulness'
  | 'support-copy'
  | 'tdk';

export interface RecoveryCohortDefinition {
  id: string;
  releaseOrder: number;
  pilotSlug: string;
  controlSlug: string;
  locales: readonly Locale[];
  changedDimensions: readonly RecoveryChangeDimension[];
  minimumObservationDays: 14;
  decisionDays: 28;
}
```

Create these exact pilot/control pairs:

| ID | Pilot | Candidate control |
|---|---|---|
| `pilot-01-grammar` | `grammar-checker` | `readability-checker` |
| `pilot-02-hex` | `hex-editor` | `hex-base64-converter` |
| `pilot-03-sql` | `sql-query-optimizer` | `query-execution-planner` |
| `pilot-04-excel` | `excel-viewer` | `csv-viewer` |
| `pilot-05-typing` | `typing-speed-test` | `reading-time-calculator` |
| `pilot-06-gantt` | `gantt-chart-generator` | `timeline-chart-generator` |

These are candidate controls. Before deployment, the baseline report must confirm the control has similar historical impressions and receives no overlapping change. If it does not, update the registry in a reviewed commit before freezing the baseline.

- [ ] **Step 4: Run and commit**

```bash
npx vitest run src/config/recovery-cohorts.test.ts
git add src/config/recovery-cohorts.ts src/config/recovery-cohorts.test.ts
git commit -m "config: define recovery pilot cohorts"
```

## Task 2: Implement The Pure Performance Gate

**Files:**
- Create: `src/lib/recovery-cohort-gate.ts`
- Create: `src/lib/recovery-cohort-gate.test.ts`

- [ ] **Step 1: Write failing gate tests**

Use:

```ts
export interface RecoveryWindowMetrics {
  startDate: string;
  endDate: string;
  completeDays: number;
  clicks: number;
  impressions: number;
  averagePosition: number | null;
  topQueryShare: number | null;
}

export interface RecoveryTechnicalStatus {
  canonicalFailures: number;
  robotsFailures: number;
  hreflangFailures: number;
  renderingFailures: number;
  sitemapFailures: number;
  runtimeFailures: number;
  capabilityClaimFailures: number;
}

export type RecoveryGateDecision =
  | 'expand'
  | 'hold'
  | 'rollback-technical'
  | 'insufficient-data';

export interface RecoveryGateInput {
  pilotBaseline: RecoveryWindowMetrics;
  pilotCurrent: RecoveryWindowMetrics;
  controlBaseline: RecoveryWindowMetrics;
  controlCurrent: RecoveryWindowMetrics;
  technical: RecoveryTechnicalStatus;
  requiredDays: 14 | 28;
}

export interface RecoveryGateResult {
  decision: RecoveryGateDecision;
  reasons: string[];
  pilot: {
    clickChangePercent: number | null;
    impressionChangePercent: number | null;
    positionImprovement: number | null;
  };
  control: {
    impressionChangePercent: number | null;
    positionImprovement: number | null;
  };
}

export function evaluateRecoveryGate(input: RecoveryGateInput): RecoveryGateResult;
```

Test:

- Any technical/capability failure → `rollback-technical`.
- Fewer complete days than required → `insufficient-data`.
- Clicks down → `hold`.
- Clicks stable, impressions +20%, control flat → `expand`.
- Clicks stable, position improves 5, control flat → `expand`.
- Pilot and control move similarly → `hold`.
- Top query share over 0.80 → `hold`.
- Zero baseline impressions produces `null` percentage and cannot auto-expand.
- Average position improvement is `baseline - current`; smaller positions are better.

- [ ] **Step 2: Run and confirm failure**

```bash
npx vitest run src/lib/recovery-cohort-gate.test.ts
```

- [ ] **Step 3: Implement the exact expansion condition**

```ts
const technicalFailures = Object.values(input.technical).reduce((sum, value) => sum + value, 0);
const clicksStable = input.pilotCurrent.clicks >= input.pilotBaseline.clicks;
const impressionsPass = impressionChangePercent !== null && impressionChangePercent >= 20;
const positionPass = positionImprovement !== null && positionImprovement >= 5;
const queryPass = input.pilotCurrent.topQueryShare !== null && input.pilotCurrent.topQueryShare <= 0.80;
const controlDoesNotMatch = !controlMovedSimilarly(input);
```

`controlMovedSimilarly` returns true when the pilot passes on impressions and the control also gains at least 15%, or when the pilot passes on position and the control also improves by at least 4 positions. Return `expand` only when technical failures are zero and every boolean above passes. A missing top-query share is insufficient data, not a pass.

- [ ] **Step 4: Verify and commit**

```bash
npx vitest run src/lib/recovery-cohort-gate.test.ts
git add src/lib/recovery-cohort-gate.ts src/lib/recovery-cohort-gate.test.ts
git commit -m "feat: calculate recovery cohort gates"
```

## Task 3: Build The Cohort GSC Report CLI

**Files:**
- Create: `scripts/seo/gsc-recovery-cohort-report.ts`
- Create: `scripts/seo/gsc-recovery-cohort-report.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Write failing parser/report tests**

Export:

```ts
export interface RecoveryCohortReportOptions {
  cohortId: string;
  checkpointDate: string;
  baselineStart: string;
  baselineEnd: string;
  currentStart: string;
  currentEnd: string;
  baselineDir: string;
  currentDir: string;
  technicalJson: string;
  requiredDays: 14 | 28;
  outputJson: string;
  outputMarkdown: string;
}

export function parseRecoveryCohortArgs(args: string[]): RecoveryCohortReportOptions;
export function parsePerformanceCsv(csv: string): RecoveryWindowMetrics;
export function computeTopQueryShare(csv: string): number | null;
export function buildRecoveryCohortReport(input: RecoveryCohortReportInput): RecoveryCohortReport;
```

Tests cover English/Chinese headers, decimal positions, percent strings, quoted queries, empty exports, incomplete dates, mismatched window lengths, and deterministic Markdown.

- [ ] **Step 2: Run and confirm failure**

```bash
npx vitest run scripts/seo/gsc-recovery-cohort-report.test.ts
```

- [ ] **Step 3: Require four filtered exports per window**

For each baseline/current directory, require:

```text
pilot-pages.csv
pilot-queries.csv
control-pages.csv
control-queries.csv
```

The GSC UI export must be filtered to the exact cohort URLs and complete dates. Record the filter and date range in a `README.md` beside the CSV files.

The CLI calculates `completeDays` from the explicit inclusive start/end arguments and rejects unequal baseline/current window lengths. CSV aggregate tables do not carry enough information to infer the date range safely.

- [ ] **Step 4: Write the report**

The Markdown report includes:

- Cohort definition and changed dimensions.
- Deployment timestamp.
- Baseline/current date ranges and complete-day counts.
- Pilot/control clicks, impressions, CTR, and average position.
- Top query and top-query share.
- Technical failure counts.
- Gate decision and every reason.
- Explicit next action: expand, hold, or rollback.

- [ ] **Step 5: Add the package script**

```json
"report:gsc-recovery-cohort": "node --import tsx/esm scripts/seo/gsc-recovery-cohort-report.ts"
```

- [ ] **Step 6: Verify and commit**

```bash
npx vitest run scripts/seo/gsc-recovery-cohort-report.test.ts src/lib/recovery-cohort-gate.test.ts
git add scripts/seo/gsc-recovery-cohort-report.ts scripts/seo/gsc-recovery-cohort-report.test.ts package.json
git commit -m "feat: report GSC recovery cohort gates"
```

## Task 4: Create The 48-Hour Technical Check

**Files:**
- Create: `docs/GSC_RECOVERY_COHORT_RUNBOOK.md`
- Generate per release: `exports/gsc/cohorts/{cohort-id}/{checkpoint-date}/technical-status.json`

- [ ] **Step 1: Document the technical status schema**

```json
{
  "checkedAt": "2026-07-30T14:08:00.000Z",
  "baseUrl": "https://www.u2tool.com",
  "canonicalFailures": 0,
  "robotsFailures": 0,
  "hreflangFailures": 0,
  "renderingFailures": 0,
  "sitemapFailures": 0,
  "runtimeFailures": 0,
  "capabilityClaimFailures": 0,
  "commands": []
}
```

- [ ] **Step 2: Run the repository and live checks 48 hours after deployment**

```bash
npm run validate:tool-capability-claims
npm run validate:tool-page-render-contract -- --base-url https://www.u2tool.com --filter grammar-checker
npm run validate:tool-runtime-loading:prod
npm run validate:live-redirects:online
PROD_BASE_URL=https://www.u2tool.com npm run validate:sitemap-url-health
npm run validate:hreflang-scc
npm run report:gsc-technical-blockers
```

Replace the filter with the active pilot slug. Record command, exit code, timestamp, and failure count. Do not set a failure count to zero when a command was not run.

- [ ] **Step 3: Apply immediate rollback for technical failure**

Rollback the active cohort if canonical, robots, hreflang, rendering, sitemap, runtime, or capability claims regress. Do not wait 14 days for a technical rollback.

- [ ] **Step 4: Commit the runbook**

```bash
git add docs/GSC_RECOVERY_COHORT_RUNBOOK.md
git commit -m "docs: add recovery cohort monitoring runbook"
```

## Task 5: Freeze A Baseline Before Every Deployment

- [ ] **Step 1: Select complete equal-length windows**

For a deployment on date `D`, use the most recent complete 14-day period ending at least three days before `D` as the pilot/control baseline. Save the exact dates.

- [ ] **Step 2: Export pilot and control data**

In GSC Performance, filter pages to the ten localized pilot URLs, export pages and queries, then repeat for the ten localized control URLs. Save under:

```text
exports/gsc/cohorts/{cohort-id}/baseline/
```

- [ ] **Step 3: Confirm control fitness**

The candidate control is acceptable only when:

- It receives impressions in the baseline or has comparable historical demand.
- No overlapping product/content/TDK/internal-link change is scheduled.
- It is not an active protected recovery cohort.
- Its baseline movement is not dominated by one query above 80%.

If unsuitable, change `controlSlug` in `src/config/recovery-cohorts.ts`, update its test expectation, and commit before deployment.

- [ ] **Step 4: Protect the control from index-readiness actions**

Add or update its rows in `src/config/index-readiness-overrides.ts` with `protectedControl: true` and an expiry 35 days after deployment.

## Task 6: Run The 14-Day Gate

- [ ] **Step 1: Wait for 14 complete post-deploy days plus GSC reporting lag**

Do not use the deployment day or partial current day.

- [ ] **Step 2: Export the same four filtered files**

Save them under the dated current directory.

- [ ] **Step 3: Generate the report**

```bash
npm run report:gsc-recovery-cohort -- \
  --cohort-id pilot-01-grammar \
  --checkpoint-date 2026-08-13 \
  --baseline-start 2026-07-12 \
  --baseline-end 2026-07-25 \
  --current-start 2026-07-28 \
  --current-end 2026-08-10 \
  --baseline-dir exports/gsc/cohorts/pilot-01-grammar/baseline \
  --current-dir exports/gsc/cohorts/pilot-01-grammar/2026-08-13 \
  --technical-json exports/gsc/cohorts/pilot-01-grammar/2026-08-13/technical-status.json \
  --required-days 14 \
  --output-json exports/gsc/cohorts/pilot-01-grammar/2026-08-13/cohort-report.json \
  --output-markdown docs/GSC_COHORT_PILOT_01_GRAMMAR_2026-08-13.md
```

- [ ] **Step 4: Apply the decision**

- `expand`: open implementation/deployment of the next pilot.
- `hold`: keep the current production state and wait for the 28-day decision; do not churn within 48 hours.
- `rollback-technical`: rollback immediately.
- `insufficient-data`: fix the evidence/export problem and rerun; do not infer a result.

## Task 7: Run The 28-Day Decision

- [ ] **Step 1: Repeat the exact process with `--required-days 28`**

- [ ] **Step 2: Decide one action**

```text
EXPAND_NEXT_PILOT
HOLD_AND_REFINE_CURRENT_PILOT
ROLL_BACK_CURRENT_PILOT
CLOSE_AS_INCONCLUSIVE
```

- [ ] **Step 3: Expire control protection only after the decision**

Remove or update the protection override in a reviewed commit. Keep reports immutable.

- [ ] **Step 4: Commit the decision report**

```bash
git add docs/GSC_COHORT_PILOT_01_GRAMMAR_2026-08-27.md exports/gsc/cohorts/pilot-01-grammar/2026-08-27
git commit -m "docs: record grammar recovery cohort day 28"
```

Use the active cohort ID and date in later releases.

## Task 8: Verify The Monitoring System

- [ ] **Step 1: Run focused tests**

```bash
npx vitest run src/config/recovery-cohorts.test.ts src/lib/recovery-cohort-gate.test.ts scripts/seo/gsc-recovery-cohort-report.test.ts
```

- [ ] **Step 2: Run a synthetic dry report**

Use test fixtures where the pilot improves and control is flat. Expected decision: `expand`. Then use matching pilot/control movement. Expected decision: `hold`.

- [ ] **Step 3: Confirm no external mutation path exists**

Search the new modules for GSC API writes, URL Inspection submission, Indexing API calls, and repository metadata writes:

```bash
rg -n "requestIndexing|urlInspection|indexing.googleapis|meta robots|noindex|writeFile|appendFile" src/config/recovery-cohorts.ts src/lib/recovery-cohort-gate.ts scripts/seo/gsc-recovery-cohort-report.ts
```

Expected: no submission or metadata mutation code.

- [ ] **Step 4: Run formatting and type checks**

```bash
npm run check
git diff --check
```

Expected: all commands exit `0`.
