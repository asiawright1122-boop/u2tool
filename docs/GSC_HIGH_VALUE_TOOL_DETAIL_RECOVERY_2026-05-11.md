# GSC High-Value Tool Detail Recovery

Generated at: 2026-05-11

## Evidence Inputs

- `docs/GSC_VALIDATION_ACTION_MATRIX_2026-05-11.md`
- `docs/GSC_PERFORMANCE_RECOVERY_REPORT_2026-05-11.md`
- `docs/GSC_PERFORMANCE_RECOVERY_REPORT_2026-05-09.md`
- `.planning/phases/23-gsc-evidence-recovery-triage/23-02-SUMMARY.md`

## Selection Rules

Candidates were ranked by:

1. lost clicks;
2. lost impressions;
3. current live indexability from prior GSC/live-check evidence;
4. whether the candidate was already patched in Phase 23 follow-ups;
5. content/support-copy fit with the actual UI;
6. internal-link opportunity from category or adjacent-tool surfaces.

## Ranked Candidates

| Rank | URL | Evidence | Prior Status | Phase 34 Decision |
|---:|---|---|---|---|
| 1 | `https://www.u2tool.com/ru/tools/hex-editor/` | -20 clicks, -341 impressions | Live indexable; no prior content patch recorded | Select |
| 2 | `https://www.u2tool.com/en/tools/hex-editor/` | -18 clicks, -579 impressions; query evidence for `hex editor online` | Live indexable; no prior content patch recorded | Select |
| 3 | `https://www.u2tool.com/en/tools/gantt-chart-generator/` | -6,376 impressions | Duplicate-brand title defect already patched in Phase 23 | Monitor |
| 4 | `https://www.u2tool.com/de/tools/text-to-handwriting/` | -17 clicks | Follow-up completed in Phase 23 | Monitor |
| 5 | `https://www.u2tool.com/ru/tools/barcode-generator/` | -11 clicks, -244 impressions | Follow-up completed in Phase 23 | Monitor |
| 6 | `https://www.u2tool.com/fr/tools/file-size-calculator/` | -11 clicks | Follow-up completed in Phase 23 | Monitor |
| 7 | `https://www.u2tool.com/en/tools/morse-code-player/` | -9 clicks | Follow-up completed in Phase 23 | Monitor |
| 8 | `https://www.u2tool.com/en/tools/html-preview/` | -8 clicks, -486 impressions | Follow-up completed in Phase 23 | Monitor |
| 9 | `https://www.u2tool.com/en/tools/database-connection-tester/` | -6 clicks | Lower score than untreated Hex Editor cluster | Defer |
| 10 | `https://www.u2tool.com/en/tools/crontab-calendar/` | -6 clicks | Lower score than untreated Hex Editor cluster | Defer |

## Selected Recovery Slice

Phase 34 selects the English and Russian Hex Editor cluster.

Why:

- It has the largest untreated click loss in the current export set.
- It has query-level support from earlier raw exports.
- The live page is indexable, so the next plausible recovery lever is snippet/content/internal-link quality rather than redirect or robots repair.
- The actual tool is intentionally narrow, so the patch can be verified against concrete UI capabilities.

## Patch Scope

- Refresh English and Russian Hex Editor metadata to target text-to-hex and hex-to-text intent without claiming a full binary file editor.
- Add tool-specific FAQs so the page explains UTF-8 behavior, pasted hex sequences, browser-local processing, and the limits of the current UI.
- Add Encoding category support content for English and Russian with internal links to `hex-editor`, `text-to-hex`, `hex-base64-converter`, and adjacent encoding tools.
- Add rendered/content-trust evidence so unsupported hex-grid, byte-cell editing, encoding picker, and file-export claims remain blocked.

## Request Indexing Queue After Patch

After Phase 34 verification and deployment, request indexing individually for:

1. `https://www.u2tool.com/ru/tools/hex-editor/`
2. `https://www.u2tool.com/en/tools/hex-editor/`

Do not use broad GSC validation for the surrounding mixed Coverage rows.
