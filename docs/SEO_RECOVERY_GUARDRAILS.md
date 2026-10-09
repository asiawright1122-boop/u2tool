# SEO recovery guardrails — 2026-10-09

Stage 2 update: tool hreflang/sitemap alignment is now implemented and locally verified; see [SEO_DISCOVERY_FIX_2026-10-09.md](./SEO_DISCOVERY_FIX_2026-10-09.md). The stage-1 scope and verification results below are retained as a historical record.

## Scope

Stage 1 prevents accidental index-state regression and corrects confirmed capability claims. It does not deploy, submit URLs, reopen suppressed pages, or prove that traffic will recover. The reviewed baseline remains **1,795 retained / 3,845 suppressed tool URLs** (564 tools × 10 locales). The generated suppression file is unchanged.

## Durable retention

`src/config/index-retention-approvals.json` migrates 226 retained URLs: the 85 restored URLs that the previous generator would suppress again, plus existing governance/lastmod protections (deduplicated). Reasons distinguish snapshot-preservation from historical demand or product decisions; migration is not a new claim of current demand or completed functional QA.

`recordedOn` dates this migration. Each entry has a key, reason and evidence reference. `reviewAfter` is a review reminder, **not automatic expiry**. The generator reads structured JSON, not a regex over TypeScript. It no longer treats sitemap lastmod edits as index approvals. Existing `index-readiness-overrides.ts` remains input to readiness reporting; its historical entries are preserved here independently.

## Preview and explicit approval

```sh
npm run --silent seo:index-suppression:generate -- --checkpoint-date 2026-07-13 --dry-run
```

Default is dry-run, with JSON on stdout: blockers, catalog drift, review reminders, URL old/new states, reasons, evidence windows, and an `approvalHash`. The exported `planIndexSuppression` API also returns every unchanged decision. `--as-of YYYY-MM-DD` is preview-only, for reproducible date regression checks.

Writing requires **both** `--write` and `--approve-diff <reviewed approvalHash>`. The hash binds the dated input, baseline, approvals and exact diff; changing them invalidates approval. Do not generate approval automatically in deployment. A zero-change approved write leaves the file byte-for-byte unchanged. Deployment does not run the generator.

Writes are blocked for missing/invalid inputs, stale checkpoints, missing/extra catalog rows, duplicate URLs, invalid observed metrics, unverified/truncated windows or invalid approval records. Unknown demand preserves **both** retained and suppressed states. An absent GSC row is not zero. Explicit zero-demand noindex candidates need both observed windows and no missing review evidence; even then, a diff must be manually approved. Positive evidence can propose reopening, not automatically publish it.

Current July evidence is stale and differs from the active catalog. Its preview holds all current states and its write fails. Renaming an export folder is not a refresh.

### New evidence contract

The readiness report needs an audited `evidenceWindow` in addition to its existing `checkpointDate` and rows:

```json
{
  "current": { "start": "2026-09-09", "end": "2026-10-06", "complete": true },
  "historical": { "start": "2026-08-12", "end": "2026-09-08", "complete": true }
}
```

This is a schema example, **not an attestation of a new export**. Checkpoint age and current-window end must be within 28 days of the write date; windows must be valid, non-overlapping and not in the future. `complete: true` must be set only after verifying export pagination/row limits and date coverage. Existing report generation does not establish this completeness, so its output stays preview-only until verified. Google privacy omissions still mean unknown, not zero. Bing/AI demand is not yet an automated input; preserve an independently reviewed reason in the retention manifest instead.

Automatic checkpoint selection prefers catalog-complete reports and ignores empty/malformed directories. If none is catalog-complete, the latest readable report may be previewed but its catalog mismatch blocks writes. Every selected report still goes through completeness/freshness checks; selection alone never authorizes a write.

## Release checks

- `npm run qa:seo-recovery`: actual policy/CLI behavior, approval write tests in temporary directories, expiry dates, all 226 protections, exact current suppression-set fingerprint, merged locale copy, SQL heuristic presentation, compact discovery, workflow ordering, and independent failure reporting.
- `DISABLE_CLOUDFLARE_INSPECTOR=1 npm run build`: local build; the environment option avoids the existing inspector-port collision when other Astro commands run locally.
- `node scripts/validation/run-with-preview.mjs -- npm run validate:seo-recovery-rendered`: checks 18 local SSR pages for status, robots, canonical, expected support copy; compares the complete tools sitemap with the approved set. It refuses public hosts.

The deploy workflow blocks on both source and local SSR gates. The exact-set fingerprint deliberately requires a reviewed test update for any later index-state change; changing a count alone does not approve substitutions.

Three optional archival-replay cases use ignored local July exports when available and explicitly skip on clean CI checkouts. All protection/policy/CLI/write/fingerprint checks use repository data or self-contained fixtures and run in CI without GSC credentials or private exports.

Post-build diagnostics now run independently, preserve each exit code, and fail overall if any fail. Results are saved to `artifacts/validation/postbuild-results.json` and uploaded by the weekly workflow. If prebuild/build prevents this stage, the failure report explicitly says downstream checks did not run instead of quoting a stale repository health report. Prebuild/build remain dependencies, not independent checks.

## Copy corrections and remaining work

- French frosted glass: actual whole-image canvas blur, 0–50 px, three presets, PNG; removed invented opacity/noise/adaptive/animation controls. Still noindex.
- Japanese encoding detector: BOM/basic byte hints; pasted text is re-encoded as UTF-8, cannot reveal original encoding; no Shift-JIS/EUC-JP identification or report export. Still noindex.
- English SQL tester: regex heuristics, no live scanning. Removed SAFE/security score UI and scanner metadata; low-severity matches are also review hints. Engine behavior unchanged, page remains indexable. Clarify guidance influenced wording and removal of false certainty, not a visual redesign.
- Arabic IP lookup: removed mixed-script corruption and qualified location precision.
- Compact llms: category links are concise rather than repeating full-catalog instructions; full catalogs and the existing <350-line check are preserved.

Not completed in stage 1: full 564-tool capability coverage, all 14 candidate interaction journeys, hreflang/noindex reconciliation, generic metadata padding, unknown-route status behavior, parameter handling, new evidence exports, deployment, index requests or monitoring. These require separate scoped work. SSR health is not proof that every client tool function works.

The design-context check also found legacy PRODUCT.md formatting. It was not changed; optional `impeccable init` can migrate it later. An existing side-border style warning was left outside this copy-only change.

## Local verification results

- Recovery suite: 32 tests passed (including the 3 optional archived-export replays on this machine).
- Existing translation, runtime, security-cluster and SEO-governance suites: 87 tests passed.
- Astro check: 0 errors, 0 warnings, 8 existing hints.
- Build: passed with `DISABLE_CLOUDFLARE_INSPECTOR=1`; an initial concurrent Astro invocation collided on port 9229. No unrelated process was stopped.
- Local SSR: all 18 target URLs passed; all 1,795 tools sitemap entries match the baseline.
- LLMS discovery validator, 66 GSC metadata checks and the 564 × 10 offline message-merge audit passed.
- Hydrated SQL UI: no-match disclaimer and low-severity findings exercised in Chromium; no security score is displayed. This is a targeted test, not a full security review.
- Workflow YAML parses; `git diff --check` passes. Full `verify:production` was not run, and no claim is made that all legacy production validators are green.

The user's pre-existing `docs/TOOL_CONTENT_TRUST_AUDIT_2026-05-05.md` edit was left untouched. No deployment, Git commit/push, URL submission, account-setting change or new credential was performed.
