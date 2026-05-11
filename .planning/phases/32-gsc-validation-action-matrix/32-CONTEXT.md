# Phase 32: GSC Validation Action Matrix - Context

**Gathered:** 2026-05-11
**Status:** Ready for planning
**Source:** v0.0.10 roadmap, existing GSC drilldown exports, and regenerated baseline reports

<domain>

## Phase Boundary

Phase 32 turns existing Google Search Console exports into a deterministic decision matrix and user-facing playbook. It explains why prior broad "Validate fix" requests failed and separates expected exclusions from URL groups that should be fixed first or individually requested for indexing.

This phase should not patch route/content defects directly unless report generation exposes a small deterministic script issue. Technical URL repairs belong to Phase 33, and high-value content/internal-link repairs belong to Phase 34.

</domain>

<decisions>

## Implementation Decisions

### Evidence Inputs

- Reuse existing exports under `exports/gsc/coverage-drilldowns/` and `exports/gsc/*.xlsx`; do not ask the user to export again.
- Regenerated baselines are:
  - `docs/GSC_DRILLDOWN_URL_REPORT_2026-05-11.md`
  - `docs/GSC_PERFORMANCE_RECOVERY_REPORT_2026-05-11.md`
- `npm run check:gsc-recovery-inputs` is the input gate.

### Action Labels

- `do-not-validate`: expected exclusions or historical URL shapes where retrying validation will keep failing because the row mixes valid canonical/redirect/asset states.
- `fix-before-validate`: likely true blockers on intended indexable pages, especially 4xx/noindex/robots/5xx on live tool/category pages.
- `request-indexing-after-enhancement`: high-value tool-detail pages that should first receive content/internal-link/rendered evidence and then be requested individually.
- `monitor`: coherent canonical/redirect states that should be watched for recrawl instead of repeatedly validated.

### User Guidance

- The playbook must answer the user's question directly: previous revalidation failed because mixed GSC rows still contain expected exclusions; do not click broad validation again until a row contains only fixed URLs.
- The report should name the GSC issue rows to leave alone, the rows to inspect before validation, and example URLs or groups for individual request-indexing follow-up.

</decisions>

<canonical_refs>

## Canonical References

Downstream agents MUST read these before planning or implementing.

### Milestone Scope

- `.planning/REQUIREMENTS.md` - `GSC-13` acceptance boundary.
- `.planning/ROADMAP.md` - Phase 32 success criteria.
- `.planning/STATE.md` - current phase state.
- `.planning/TRACEABILITY.md` - generated requirements coverage.
- `.planning/PROJECT.md` - active milestone and decision log.

### GSC Evidence

- `exports/gsc/coverage-drilldowns/*.csv` - raw Coverage issue drilldown rows.
- `exports/gsc/pages-current.xlsx`
- `exports/gsc/pages-previous.xlsx`
- `exports/gsc/queries-current.xlsx`
- `exports/gsc/queries-previous.xlsx`
- `docs/GSC_DRILLDOWN_URL_REPORT_2026-05-11.md`
- `docs/GSC_PERFORMANCE_RECOVERY_REPORT_2026-05-11.md`
- `docs/GSC_DRILLDOWN_URL_REPORT_2026-05-09.md` - previous live triage notes and completed follow-ups.
- `docs/GSC_NEXT_WORK_2026-05-06.md` - earlier GSC next-work guidance.

### Existing Scripts

- `scripts/seo/check-gsc-recovery-inputs.ts`
- `scripts/seo/gsc-drilldown-url-report.ts`
- `scripts/seo/gsc-recovery-report.ts`
- `package.json` GSC scripts.

</canonical_refs>

<specifics>

## Specific Ideas

- Add a deterministic script under `scripts/seo/` that reads existing drilldown exports plus Performance workbooks and emits `docs/GSC_VALIDATION_ACTION_MATRIX_2026-05-11.md`.
- Create `docs/GSC_VALIDATION_PLAYBOOK_2026-05-11.md` as the short operational companion for the user.
- Use counts from the action matrix to prove that broad GSC issue validation is unsafe when a row contains stale assets, canonical alternates, redirects, query variants, or missing-trailing-slash canonical shapes.
- Surface a small ranked example set for later Phase 33/34 work without claiming those URLs are already fixed.

</specifics>

<deferred>

## Deferred Ideas

- Live HTTP inspection, canonical/rendered checks, and route repairs are deferred to Phase 33.
- Content/runtime/internal-link edits on selected high-value tool-detail pages are deferred to Phase 34.
- Final production verification and closeout are deferred to Phase 35.

</deferred>

---

*Phase: 32-gsc-validation-action-matrix*
*Context gathered: 2026-05-11*
