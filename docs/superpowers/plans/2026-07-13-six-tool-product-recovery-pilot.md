# Six-Tool Product Recovery Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade or accurately reposition the six competitor-identified recovery tools so their product behavior satisfies the search intent they target, while preserving browser-local privacy and existing URLs.

**Architecture:** Each Svelte component delegates behavior to a pure TypeScript module with focused tests. Every tool increment updates its capability profile and localized claims in the same commit. File tools remain browser-only. SQL receives a required local analyzer and a separately gated optional Workers AI action that cannot replace the local result.

**Tech Stack:** Svelte 5, TypeScript, Vitest, SheetJS `xlsx`, ECharts, browser File APIs, localStorage, optional Cloudflare Workers AI and Rate Limiting bindings.

**Global Constraints:** Preserve the six slugs and canonicals; no database connection or SQL execution; no uploaded file leaves the browser; no macro execution; no collaboration/accounts/cloud sync; no recurring paid API cost; no pilot production deployment before the Day 14 lane opens; release in the approved order.

---

## Release Order And Versioning

| Order | Slug | Current profile | Pilot profile |
|---:|---|---|---|
| 1 | `grammar-checker` | `1.0.0` | `1.1.0` |
| 2 | `hex-editor` | `1.0.0` | `2.0.0` |
| 3 | `sql-query-optimizer` | `1.0.0` | `2.0.0`; optional server `2.1.0` |
| 4 | `excel-viewer` | `1.0.0` | `2.0.0` |
| 5 | `typing-speed-test` | `1.0.0` | `2.0.0` |
| 6 | `gantt-chart-generator` | `1.0.0` | `2.0.0` |

Do not update a profile version before the behavior tests named in `evidenceTests` pass.

## Task 1: Ship The Grammar Language Gate

**Files:**
- Create: `src/lib/grammar-language-support.ts`
- Create: `src/lib/grammar-language-support.test.ts`
- Create: `src/lib/grammar-rules.test.ts`
- Create: `src/lib/fixtures/grammar-checker/en.ts`
- Modify: `src/components/tools/GrammarChecker.svelte`
- Modify: `src/config/tool-capabilities/profiles/grammar-checker.ts`
- Modify: `src/messages/{en,zh,ja,ko,es,pt,fr,de,ru,ar}/base.json`
- Modify: `src/messages/{en,zh,ja,ko,es,pt,fr,de,ru,ar}/tools/grammar-checker.json`
- Modify: `scripts/validation/tool-page-render-contract.ts`

- [ ] **Step 1: Write failing language-support tests**

Create `src/lib/grammar-language-support.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getGrammarLanguageSupport } from './grammar-language-support';

describe('grammar checker language support', () => {
  it('declares English as the only local checking language', () => {
    expect(getGrammarLanguageSupport('en')).toEqual({
      uiLocale: 'en',
      localInputLanguage: 'en',
      nativeForUiLocale: true,
    });
    expect(getGrammarLanguageSupport('ru')).toEqual({
      uiLocale: 'ru',
      localInputLanguage: 'en',
      nativeForUiLocale: false,
    });
  });
});
```

Create `src/lib/fixtures/grammar-checker/en.ts` with a correct English sentence, repeated word, `teh`, subject-verb agreement, empty input, punctuation, boundary-length input, and Cyrillic non-target input. Import those fixtures in `src/lib/grammar-rules.test.ts`. Cyrillic input must not be reported as successfully checked Russian grammar.

- [ ] **Step 2: Run and confirm failures**

```bash
npx vitest run src/lib/grammar-language-support.test.ts src/lib/grammar-rules.test.ts
```

Expected: the language-support module is missing; grammar fixtures reveal the current English-only boundary.

- [ ] **Step 3: Implement the pure support resolver**

```ts
import type { Locale } from '@/lib/i18n';

export interface GrammarLanguageSupport {
  uiLocale: Locale;
  localInputLanguage: 'en';
  nativeForUiLocale: boolean;
}

export function getGrammarLanguageSupport(locale: Locale): GrammarLanguageSupport {
  return {
    uiLocale: locale,
    localInputLanguage: 'en',
    nativeForUiLocale: locale === 'en',
  };
}
```

- [ ] **Step 4: Add an always-visible input-language notice**

In `GrammarChecker.svelte`, resolve support from `locale` and render a notice above the input. English copy says the local checker is designed for English. Non-English UI copy explicitly says the interface is localized but the checker evaluates English text. Do not hide the notice after input starts.

- [ ] **Step 5: Correct all search-facing copy**

For every locale, scan name, description, SEO fields, detailed description, steps, examples, and FAQs. Non-English pages may use the localized product name, but every native-language-checking claim must be replaced with an explicit English-input statement.

- [ ] **Step 6: Update the profile to `1.1.0`**

Keep `supportedLocales.localEngine: ['en']`. Add `grammar-language-support.test.ts` and `grammar-rules.test.ts` to `evidenceTests`. No optional server features are enabled in this release.

- [ ] **Step 7: Run gates and commit**

```bash
npx vitest run src/lib/grammar-language-support.test.ts src/lib/grammar-rules.test.ts src/lib/tool-capability-claims.test.ts src/lib/support-content-fallback.test.ts
npm run validate:tool-capability-claims
npm run validate:tool-page-render-contract -- --filter grammar-checker
npm run check
git add src/lib/grammar-language-support.ts src/lib/grammar-language-support.test.ts src/lib/grammar-rules.test.ts src/lib/fixtures/grammar-checker/en.ts src/components/tools/GrammarChecker.svelte src/config/tool-capabilities/profiles/grammar-checker.ts src/messages scripts/validation/tool-page-render-contract.ts
git commit -m "fix: disclose grammar checker language support"
```

Expected: all commands exit `0`; Russian and other localized pages render an English-input disclosure.

## Task 2: Build A Real Browser Hex File Editor

**Files:**
- Create: `src/lib/hex-editor.ts`
- Create: `src/lib/hex-editor.test.ts`
- Modify: `src/components/tools/HexEditor.svelte`
- Modify: `src/config/tool-capabilities/profiles/hex-editor.ts`
- Modify: `src/messages/{en,zh,ja,ko,es,pt,fr,de,ru,ar}/base.json` and `src/messages/{en,zh,ja,ko,es,pt,fr,de,ru,ar}/tools/hex-editor.json`

- [ ] **Step 1: Write failing byte-model tests**

Use this public API:

```ts
export interface HexRow {
  offset: number;
  bytes: number[];
  ascii: string;
}

export interface HexSearchMatch {
  start: number;
  end: number;
}

export function bytesToRows(bytes: Uint8Array, width?: number): HexRow[];
export function updateByte(bytes: Uint8Array, offset: number, hex: string): Uint8Array;
export function parseHexSearch(input: string): Uint8Array;
export function findByteMatches(bytes: Uint8Array, needle: Uint8Array): HexSearchMatch[];
export function findAsciiMatches(bytes: Uint8Array, query: string): HexSearchMatch[];
export function textToHex(text: string): string;
export function hexToText(hex: string): string;
```

Tests must cover 16-byte rows, zero-padded offsets, printable ASCII vs `.`, immutable byte edits, invalid hex rejection, overlapping search matches, UTF-8 text conversion, empty files, and a 2 MiB boundary fixture.

- [ ] **Step 2: Run and confirm failure**

```bash
npx vitest run src/lib/hex-editor.test.ts
```

Expected: FAIL because `src/lib/hex-editor.ts` does not exist.

- [ ] **Step 3: Implement the pure byte model**

Use `Uint8Array` throughout. `updateByte` accepts exactly two hexadecimal digits and throws `RangeError` for an invalid offset. `bytesToRows` defaults to 16 bytes. Search functions return all matches without mutating data.

- [ ] **Step 4: Replace the component with two explicit modes**

`HexEditor.svelte` must provide:

- `File Editor` and `Text Converter` tabs.
- Local `<input type="file">`; no network call.
- Offset, 16 editable byte cells, and ASCII preview.
- Hex and ASCII search with next/previous navigation.
- Modified-byte count and reset-to-original action.
- Download using `Blob`, preserving the original filename with `.modified` before the extension.
- A 2 MiB pilot limit with a truthful error message.
- The existing text↔hex conversion and copy controls in the second tab.

Do not add disassembly, encoding selectors, remote URL open, or format interpretation.

- [ ] **Step 5: Update the capability profile to `2.0.0`**

Enable file editor and text converter modes, binary file input, modified binary output, byte editing, search, and download. Remove the four old forbidden claims only after the new tests pass. Add forbidden claims for disassembly, remote upload, executable analysis, and professional reverse-engineering workflows.

- [ ] **Step 6: Align localized copy**

Describe this as a browser binary file editor with a 2 MiB limit. Avoid claims about UTF-16 endianness, disassembly, malware analysis, unlimited files, or preserving application-level file validity after arbitrary edits.

- [ ] **Step 7: Verify and commit**

```bash
npx vitest run src/lib/hex-editor.test.ts src/config/tool-capabilities/index.test.ts src/lib/tool-capability-claims.test.ts src/lib/support-content-fallback.test.ts
npm run validate:tool-capability-claims
npm run check
npm run build
git add src/lib/hex-editor.ts src/lib/hex-editor.test.ts src/components/tools/HexEditor.svelte src/config/tool-capabilities/profiles/hex-editor.ts src/messages
git commit -m "feat: add local binary hex file editor"
```

## Task 3: Build The Local SQL Analysis Engine

**Files:**
- Create: `src/lib/sql-query-optimizer.ts`
- Create: `src/lib/sql-query-optimizer.test.ts`
- Modify: `src/components/tools/SqlQueryOptimizer.svelte`
- Modify: `src/lib/tool-stubs.ts`
- Modify: `src/lib/tool-stubs-runtime.test.ts`
- Modify: `src/config/tool-capabilities/profiles/sql-query-optimizer.ts`
- Modify: localized SQL Query Optimizer messages

- [ ] **Step 1: Write failing analyzer tests**

Use these types:

```ts
export type SqlDialect = 'generic' | 'postgresql' | 'mysql' | 'sqlite' | 'sql-server';

export interface SqlSuggestion {
  code: string;
  severity: 'warning' | 'improvement' | 'info';
  message: string;
  evidence: string;
  indexCandidates: string[];
}

export interface ExplainFinding {
  code: string;
  severity: 'warning' | 'info';
  message: string;
  evidence: string;
}

export interface SqlAnalysisResult {
  dialect: SqlDialect;
  formattedSql: string;
  score: number;
  suggestions: SqlSuggestion[];
  explainFindings: ExplainFinding[];
  limitations: string[];
}

export function analyzeSql(input: {
  sql: string;
  dialect: SqlDialect;
  explainText?: string;
}): SqlAnalysisResult;
```

Fixtures must cover `SELECT *`, unbounded reads, update/delete without `WHERE`, leading wildcard, filtered-column functions, `OR`, composite index candidates, PostgreSQL sequential scan, MySQL `type: ALL`, SQLite `SCAN`, SQL Server table scan text, malformed input, comments, and strings that contain SQL keywords but are not clauses.

- [ ] **Step 2: Run and confirm failure**

```bash
npx vitest run src/lib/sql-query-optimizer.test.ts
```

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Extract and strengthen the current heuristics**

Move optimizer logic from `tool-stubs.ts` into the new module. Keep a compatibility re-export from `tool-stubs.ts` so unrelated imports do not break. Every diagnostic must include evidence and uncertainty-aware wording. Dialect-specific rules may explain known plan tokens but must never claim runtime verification.

- [ ] **Step 4: Upgrade the component**

Add:

- Database selector with five dialects.
- SQL input and optional pasted EXPLAIN text.
- Separate `Analyze locally` button.
- Formatted SQL, score, categorized findings, evidence excerpts, index candidates, and limitations.
- Copy buttons for formatted SQL and findings.

The UI must say it does not connect to a database, execute SQL, or guarantee faster queries.

- [ ] **Step 5: Update the profile to `2.0.0`**

Enable dialect selection, static analysis, index candidates, formatting, and pasted EXPLAIN text analysis. Keep database connection, execution, automatic rewrite, verified indexes, and guaranteed speed as forbidden claims.

- [ ] **Step 6: Verify and commit the local analyzer**

```bash
npx vitest run src/lib/sql-query-optimizer.test.ts src/lib/tool-stubs-runtime.test.ts src/lib/tool-capability-claims.test.ts
npm run validate:tool-capability-claims
npm run check
git add src/lib/sql-query-optimizer.ts src/lib/sql-query-optimizer.test.ts src/lib/tool-stubs.ts src/lib/tool-stubs-runtime.test.ts src/components/tools/SqlQueryOptimizer.svelte src/config/tool-capabilities/profiles/sql-query-optimizer.ts src/messages
git commit -m "feat: add local database-aware SQL analysis"
```

## Task 4: Add The Optional SQL Server Assist Behind A Hard Gate

**Files:**
- Create: `src/lib/sql-ai-assist.ts`
- Create: `src/lib/sql-ai-assist.test.ts`
- Create: `src/pages/api/tools/sql-query-optimizer/analyze.ts`
- Create: `src/pages/api/tools/sql-query-optimizer/analyze.test.ts`
- Modify: `src/components/tools/SqlQueryOptimizer.svelte`
- Modify: `src/config/tool-capabilities/profiles/sql-query-optimizer.ts`
- Modify: `src/lib/public-env.ts`
- Modify: `src/env.d.ts`
- Modify: `wrangler.jsonc`
- Modify: localized SQL messages

This task is executed only after the local `2.0.0` pilot is stable and the operator confirms the Cloudflare account will not incur usage charges. The feature remains disabled by default.

- [ ] **Step 1: Add the disabled public flag**

Add `PUBLIC_SQL_AI_ASSIST_ENABLED` to `public-env.ts` and `env.d.ts`. Only the exact string `true` enables the button.

- [ ] **Step 2: Add official Cloudflare bindings**

Append to `wrangler.jsonc`:

```jsonc
"ai": {
  "binding": "AI"
},
"ratelimits": [
  {
    "name": "SQL_AI_RATE_LIMITER",
    "namespace_id": "24071301",
    "simple": {
      "limit": 10,
      "period": 60
    }
  }
]
```

The Workers AI binding syntax and rate-limit binding shape are from current official Cloudflare documentation. The namespace is an application-chosen positive integer, not a provisioned resource ID.

Official references:

- `https://developers.cloudflare.com/workers-ai/configuration/bindings/`
- `https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/`

- [ ] **Step 3: Implement a strict request/response contract**

`sql-ai-assist.ts` validates:

```ts
export interface SqlAiAssistRequest {
  dialect: SqlDialect;
  sql: string;
  explainText?: string;
}

export interface SqlAiAssistResponse {
  summary: string;
  suggestions: Array<{ title: string; rationale: string; confidence: 'low' | 'medium' | 'high' }>;
  limitations: string[];
  fallbackUsed: boolean;
}
```

Reject SQL over 20,000 characters, EXPLAIN text over 30,000 characters, unknown fields, and non-JSON bodies. Do not log the body.

- [ ] **Step 4: Implement the endpoint**

The endpoint must:

1. Return `404` when the flag is disabled.
2. Require POST and JSON.
3. Call `SQL_AI_RATE_LIMITER.limit({ key: 'sql-ai-assist' })`; return `429` on failure.
4. Call `env.AI.run('@cf/meta/llama-3.1-8b-instruct', ...)` with a prompt that forbids database-execution claims and requires JSON.
5. Use an 8-second timeout.
6. Validate the model response.
7. Return the local analyzer result with `fallbackUsed: true` on timeout, quota failure, binding absence, or invalid model output.
8. Emit aggregate state only: locale, dialect, success/fallback, latency bucket. Never emit SQL or EXPLAIN text.

- [ ] **Step 5: Add explicit consent in the component**

The server action is a separate button labeled as optional. Before the first request, show that SQL and pasted EXPLAIN text will be sent to the server. Local analysis remains available and visible even when the server action fails.

- [ ] **Step 6: Update the profile to `2.1.0`**

Add one optional server feature and keep all local capabilities unchanged. Do not add non-English engine locales unless locale-specific response fixtures pass.

- [ ] **Step 7: Verify disabled, limited, fallback, and privacy behavior**

```bash
npx vitest run src/lib/sql-ai-assist.test.ts src/pages/api/tools/sql-query-optimizer/analyze.test.ts src/lib/sql-query-optimizer.test.ts
npm run check
npm run build
```

Expected: disabled endpoint `404`; limit failure `429`; timeout and invalid AI responses return a valid fallback without input logging.

- [ ] **Step 8: Commit without enabling production**

```bash
git add src/lib/sql-ai-assist.ts src/lib/sql-ai-assist.test.ts src/pages/api/tools/sql-query-optimizer src/components/tools/SqlQueryOptimizer.svelte src/config/tool-capabilities/profiles/sql-query-optimizer.ts src/lib/public-env.ts src/env.d.ts wrangler.jsonc src/messages
git commit -m "feat: add gated SQL AI assist fallback"
```

## Task 5: Upgrade Excel Viewer To A Local Data Viewer

**Files:**
- Create: `src/lib/excel-data-viewer.ts`
- Create: `src/lib/excel-data-viewer.test.ts`
- Create: `src/lib/excel-data-viewer.fixture.ts`
- Modify: `src/components/tools/ExcelViewer.svelte`
- Modify: `src/config/tool-capabilities/profiles/excel-viewer.ts`
- Modify: localized Excel Viewer messages

- [ ] **Step 1: Write failing workbook-model tests**

Use this API:

```ts
export interface ExcelCellView {
  address: string;
  value: string | number | boolean | null;
  formula: string | null;
}

export interface ExcelSheetView {
  name: string;
  range: string;
  headers: string[];
  rows: ExcelCellView[][];
  merges: string[];
}

export interface ExcelWorkbookView {
  sheets: ExcelSheetView[];
  warnings: string[];
}

export async function parseExcelWorkbook(bytes: Uint8Array): Promise<ExcelWorkbookView>;
export function filterExcelRows(sheet: ExcelSheetView, column: number, query: string): ExcelCellView[][];
export function sortExcelRows(sheet: ExcelSheetView, column: number, direction: 'asc' | 'desc'): ExcelCellView[][];
export function sheetToCsv(sheet: ExcelSheetView): string;
```

Build a tiny in-memory XLSX fixture with two sheets, formulas, blank cells, booleans, dates, and a merged range. Test addresses, formula text, merges, stable sorting, filtering, CSV escaping, empty sheets, and parse errors.

- [ ] **Step 2: Run and confirm failure**

```bash
npx vitest run src/lib/excel-data-viewer.test.ts
```

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement the parser**

Use `XLSX.read(bytes, { type: 'array', cellFormula: true, cellDates: true })`. Read `worksheet['!ref']`, `worksheet['!merges']`, and individual cell addresses. Do not execute macros or recalculate formulas.

- [ ] **Step 4: Upgrade the component**

Render:

- File name and local-processing notice.
- Sheet tabs.
- Cell address, displayed value, and formula text toggle.
- Merged-range notice.
- Sort and filter controls.
- CSV export for the selected sheet.
- Warnings for macros, charts, complex formatting, and formulas that are displayed but not recalculated.

Enforce a 10 MiB file limit. Do not upload the workbook.

- [ ] **Step 5: Update profile to `2.0.0`, copy, tests, and commit**

```bash
npx vitest run src/lib/excel-data-viewer.test.ts src/lib/tool-capability-claims.test.ts
npm run validate:tool-capability-claims
npm run check
npm run build
git add src/lib/excel-data-viewer.ts src/lib/excel-data-viewer.test.ts src/lib/excel-data-viewer.fixture.ts src/components/tools/ExcelViewer.svelte src/config/tool-capabilities/profiles/excel-viewer.ts src/messages
git commit -m "feat: upgrade local Excel data viewer"
```

## Task 6: Build Timed Typing Modes And Local History

**Files:**
- Create: `src/lib/typing-speed-test.ts`
- Create: `src/lib/typing-speed-test.test.ts`
- Modify: `src/components/tools/TypingSpeedTest.svelte`
- Modify: `src/lib/calculator-utils.ts`
- Modify: `src/config/tool-capabilities/profiles/typing-speed-test.ts`
- Modify: localized prompt banks and messages

- [ ] **Step 1: Write failing engine tests**

Use:

```ts
export type TypingDuration = 15 | 30 | 60 | 120;

export interface TypingErrorSummary {
  index: number;
  expected: string;
  actual: string;
}

export interface TimedTypingResult {
  wpm: number;
  cpm: number;
  accuracy: number;
  consistency: number;
  correctChars: number;
  incorrectChars: number;
  elapsedSeconds: number;
  errors: TypingErrorSummary[];
}

export interface TypingHistoryEntry extends TimedTypingResult {
  id: string;
  locale: string;
  duration: TypingDuration;
  completedAt: string;
}

export function calculateTimedTypingResult(input: {
  targetText: string;
  typedText: string;
  elapsedMs: number;
  intervalCorrectCharCounts: number[];
}): TimedTypingResult;
export function readTypingHistory(storage: Pick<Storage, 'getItem'>): TypingHistoryEntry[];
export function writeTypingHistory(storage: Pick<Storage, 'setItem'>, entries: TypingHistoryEntry[]): void;
```

Consistency is `100 - coefficientOfVariation(intervalCorrectCharCounts) * 100`, clamped to `0..100`; fewer than two non-empty intervals returns `100`. Keep only the latest 20 valid history entries.

- [ ] **Step 2: Run and confirm failure**

```bash
npx vitest run src/lib/typing-speed-test.test.ts
```

- [ ] **Step 3: Implement timed state in the component**

Add 15/30/60/120-second buttons, countdown, automatic finish at zero, WPM, CPM, accuracy, consistency, character-level error summary, restart, and local history. Prompt banks must contain at least six prompts per locale and must be native to that locale.

Do not add accounts, leaderboards, certificates, or cloud history.

- [ ] **Step 4: Preserve compatibility**

Keep `calculateTypingStats` exported from `calculator-utils.ts` for unrelated users, but implement it through the new calculator where practical and retain existing result fields.

- [ ] **Step 5: Update profile to `2.0.0`, verify, and commit**

```bash
npx vitest run src/lib/typing-speed-test.test.ts src/lib/tool-stubs-runtime.test.ts src/messages/seo-governance.test.ts
npm run validate:tool-capability-claims
npm run check
git add src/lib/typing-speed-test.ts src/lib/typing-speed-test.test.ts src/lib/calculator-utils.ts src/components/tools/TypingSpeedTest.svelte src/config/tool-capabilities/profiles/typing-speed-test.ts src/messages
git commit -m "feat: add timed typing modes and local history"
```

## Task 7: Add Gantt Dependencies, Critical Path, Persistence, And Data Exchange

**Files:**
- Create: `src/lib/gantt-chart.ts`
- Create: `src/lib/gantt-chart.test.ts`
- Modify: `src/components/tools/GanttChartGenerator.svelte`
- Modify: `src/config/tool-capabilities/profiles/gantt-chart-generator.ts`
- Modify: localized Gantt messages

- [ ] **Step 1: Write failing project-model tests**

Use:

```ts
export interface GanttTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  milestone: boolean;
  dependencyIds: string[];
}

export interface CriticalPathResult {
  taskIds: string[];
  totalDays: number;
  warnings: string[];
}

export function validateGanttTasks(tasks: GanttTask[]): string[];
export function calculateCriticalPath(tasks: GanttTask[]): CriticalPathResult;
export function ganttTasksToJson(tasks: GanttTask[]): string;
export function ganttTasksFromJson(input: string): GanttTask[];
export function ganttTasksToCsv(tasks: GanttTask[]): string;
export function ganttTasksFromCsv(input: string): GanttTask[];
export function readGanttProject(storage: Pick<Storage, 'getItem'>): GanttTask[];
export function writeGanttProject(storage: Pick<Storage, 'setItem'>, tasks: GanttTask[]): void;
```

Tests cover acyclic dependencies, cycle detection, missing dependency IDs, milestones, end-before-start, stable critical path, CSV quoting, JSON schema rejection, and corrupt local storage.

- [ ] **Step 2: Run and confirm failure**

```bash
npx vitest run src/lib/gantt-chart.test.ts
```

- [ ] **Step 3: Implement deterministic critical-path calculation**

Use a topological sort. Duration is inclusive calendar days; milestones have zero duration. On cycles, return no critical path and a warning rather than hanging or guessing.

- [ ] **Step 4: Upgrade the component**

Add milestone checkbox, dependency multi-select, critical-path highlighting, JSON/CSV import/export, local save/restore/clear, and three built-in templates: software release, marketing campaign, and event preparation. Preserve PNG/SVG export.

Imported data is parsed locally. No collaboration, cloud projects, resource allocation, billing, or live team status.

- [ ] **Step 5: Update the profile to `2.0.0`**

Remove dependency and critical-path forbidden claims only after tests pass. Keep collaboration, cloud sync, resource management, enterprise workflow, and live multi-user claims forbidden.

- [ ] **Step 6: Verify and commit**

```bash
npx vitest run src/lib/gantt-chart.test.ts src/lib/tool-capability-claims.test.ts src/lib/support-content-fallback.test.ts
npm run validate:tool-capability-claims
npm run check
npm run build
git add src/lib/gantt-chart.ts src/lib/gantt-chart.test.ts src/components/tools/GanttChartGenerator.svelte src/config/tool-capabilities/profiles/gantt-chart-generator.ts src/messages
git commit -m "feat: add local Gantt project planning features"
```

## Task 8: Run The Six-Pilot Release Verification

- [ ] **Step 1: Run all focused behavior suites**

```bash
npx vitest run src/lib/grammar-language-support.test.ts src/lib/grammar-rules.test.ts src/lib/hex-editor.test.ts src/lib/sql-query-optimizer.test.ts src/lib/excel-data-viewer.test.ts src/lib/typing-speed-test.test.ts src/lib/gantt-chart.test.ts
```

- [ ] **Step 2: Run capability and content gates**

```bash
npx vitest run src/config/tool-capabilities/index.test.ts src/lib/tool-capability-claims.test.ts src/lib/support-content-fallback.test.ts scripts/validation/tool-page-render-contract.test.ts
npm run validate:tool-capability-claims
npm run qa:seo-governance
```

- [ ] **Step 3: Run type, build, and production contracts**

```bash
npm run check
npm run qa:runtime-integrity
npm run build
npm run validate:tool-page-render-contract
git diff --check
```

Expected: every command exits `0`; no pilot contains a missing translation marker; all file processing is local; optional SQL server assist is disabled unless explicitly configured.

- [ ] **Step 4: Verify the production release remains sequential**

The combined code may exist on a review branch, but production deployment follows the master release order and cohort gates. Do not deploy all six simultaneously.
