# Phase 34: High-Value Tool Detail Recovery - Context

**Gathered:** 2026-05-11
**Status:** Ready for planning
**Source:** Phase 32 action matrix, Phase 33 live checks, and previous Phase 23 recovery history

<domain>

## Phase Boundary

Phase 34 repairs a small high-value `tool-detail` recovery slice from Performance evidence. It should not reopen broad content rewrites or retry GSC validation. The phase must rank candidates, select only the strongest untreated page cluster, patch content/internal-link evidence, and verify rendered/content-trust behavior.

</domain>

<decisions>

## Implementation Decisions

### Candidate Selection

- Phase 32 ranked high-value tool-detail candidates from the current exports.
- Previous Phase 23 follow-ups already completed many recurring candidates: German Text to Handwriting, Russian Barcode Generator, French File Size Calculator, English Morse Code Player, English HTML Preview, English Gantt Chart Generator, and several adjacent long-tail pages.
- The strongest untreated cluster is Hex Editor:
  - `https://www.u2tool.com/ru/tools/hex-editor/`: 0 current clicks, -20 click delta, 9 current impressions, -341 impression delta.
  - `https://www.u2tool.com/en/tools/hex-editor/`: 0 current clicks, -18 click delta, 6 current impressions, -579 impression delta.
  - Query evidence from 2026-05-09 included `hex editor online` as a matching click-loss query.

### Patch Boundary

- Do not add unsupported hex-grid, byte-cell editing, encoding picker, file upload, or file export claims.
- Keep the tool aligned to the actual UI: two text areas, explicit text-to-hex/hex-to-text buttons, copy controls, and browser-side UTF-8 encoding/decoding.
- Improve internal-link evidence through the Encoding category support content rather than broad homepage or catalog promotion.

</decisions>

<canonical_refs>

## Canonical References

Downstream agents MUST read these before planning or implementing.

### Milestone Scope

- `.planning/REQUIREMENTS.md` - `GSC-15` acceptance boundary.
- `.planning/ROADMAP.md` - Phase 34 success criteria.
- `.planning/STATE.md` - current phase state.
- `.planning/TRACEABILITY.md` - generated requirements coverage.
- `.planning/PROJECT.md` - active milestone and decision log.

### Evidence

- `docs/GSC_VALIDATION_ACTION_MATRIX_2026-05-11.md`
- `docs/GSC_PERFORMANCE_RECOVERY_REPORT_2026-05-11.md`
- `docs/GSC_PERFORMANCE_RECOVERY_REPORT_2026-05-09.md`
- `.planning/phases/23-gsc-evidence-recovery-triage/23-02-SUMMARY.md`

### Candidate Files

- `src/messages/en/base.json`
- `src/messages/ru/base.json`
- `src/messages/en/tools/hex-editor.json`
- `src/messages/ru/tools/hex-editor.json`
- `src/components/tools/HexEditor.svelte`
- `src/lib/content-trust.js`
- `src/lib/support-content-fallback.test.ts`
- `scripts/validation/validate-rendered-seo.ts`

</canonical_refs>

<specifics>

## Specific Ideas

- Write `docs/GSC_HIGH_VALUE_TOOL_DETAIL_RECOVERY_2026-05-11.md` to document ranking and selection.
- Update English and Russian Hex Editor metadata/support copy and add tool-specific FAQs.
- Add English and Russian Encoding category support content that links to `hex-editor`, `text-to-hex`, and adjacent encoding tools.
- Add rendered SEO/source checks for the edited Hex Editor pages and category support evidence.

</specifics>

<deferred>

## Deferred Ideas

- Further candidates such as Database Connection Tester, Crontab Calendar, and Color Blender should wait for another ranked pass if Phase 34 closes cleanly.
- Final production verification and GSC request-indexing instructions remain Phase 35.

</deferred>

---

*Phase: 34-high-value-tool-detail-recovery*
*Context gathered: 2026-05-11*
