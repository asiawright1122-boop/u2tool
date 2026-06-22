---
gsd_state_version: 1.0
milestone: v0.0.23
milestone_name: - Translation Corpus Governance
status: Complete
stopped_at: Phase 81 complete (metadata drift extension + tests + docs); v0.0.23 all 3 phases done
last_updated: "2026-06-22T04:30:00.000Z"
last_activity: 2026-06-22
progress:
  total_phases: 3
  completed_phases: 3
  total_plans: 3
  completed_plans: 3
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-06-20)

**Core value:** Every localized tool page must render the right topic, the right language, and the right UX state without drift.
**Current focus:** v0.0.23 (Translation Corpus Governance) — detection + tooling over ~5,600 message files.
**Frontend safety:** No user-facing surface may expose internal reasoning traces, hidden prompts, scratchpads, handoff notes, or raw planning notes.

## Current Position

Phase: 81 COMPLETE; v0.0.23 milestone COMPLETE (all 3 phases shipped)
Status: Phase 81 (wave 3 of v0.0.23) implemented, verified, documented
Last activity: 2026-06-22 — Phase 81 complete. Extended `validate-tdk-drift.ts` with `compareMetadata()` wrapper detecting drift on `og:title`, `twitter:title`, `keywords`, and JSON-LD `SoftwareApplication` `name`/`description`. Added 4 new extractors to `src/lib/seo-probe.ts` (`getOgTitle`/`getTwitterTitle`/`getKeywords`/`extractJsonLdBlocks`). Extended `ExpectedTdk` (+`expectedToolName`, +`sourceKeywords`), `RenderedTdk` (+`ogTitle`/`twitterTitle`/`keywords`/`jsonLdBlocks`), `DriftResult.field` → new `MetadataField` union. 102 unit tests green (78 in `validate-tdk-drift.test.ts` + 24 in new `seo-probe.test.ts`). 5570 tools × 10 locales offline self-check PASS. No wiring changes needed (`validate:tdk-drift` already in `qa:seo-governance` → `qa:production`). 81-BASELINE.md + 81-PLAN.md written. REQUIREMENTS TCG-04 + traceability + ROADMAP marked implemented. **v0.0.23 milestone complete.**

## Milestone Context

### Phase Map

| Phase | Focus | Status |
|-------|-------|--------|
| 79 | Split File Schema & Coverage (TCG-01, TCG-02, TCG-05) | **Complete** |
| 80 | Merge Chain Consistency Auditor (TCG-03) | **Complete** |
| 81 | Metadata Drift Extension (TCG-04 / TDK-05) | **Complete** |

## Accumulated Context

- 2026-06-22 Phase 81 complete (wave 3 of v0.0.23, **milestone complete**). Extended `validate-tdk-drift.ts` with `compareMetadata()` wrapper detecting drift on `og:title`, `twitter:title`, `keywords`, and JSON-LD `SoftwareApplication` `name`/`description`. Added 4 new zero-dependency regex extractors to `src/lib/seo-probe.ts`: `getOgTitle`, `getTwitterTitle`, `getKeywords`, `extractJsonLdBlocks` (multi-block parse, silently skips malformed JSON). Extended types: `ExpectedTdk` (+`expectedToolName` = `name ?? slug` unbranded, +`sourceKeywords` if split file has it), `RenderedTdk` (+`ogTitle`/`twitterTitle`/`keywords`/`jsonLdBlocks`), `DriftResult.field` → new `MetadataField` union (`'title'|'description'|'og:title'|'twitter:title'|'keywords'|'jsonld_name'|'jsonld_description'`). Architecture: `compareBrandedMetaTitle` reuses full 5-label logic for OG/Twitter (same `brandedSeoTitle` source as `<title>`); `compareJsonLdName` uses unbranded `expectedToolName` (no BRAND_DRIFT); `compareKeywordsMeta` skips when source has no keywords (no false positives — no source currently has keywords); `compareJsonLdDescription` mirrors `compareTdkDescription`. `findSoftwareApplicationBlock` selects from up to 4 JSON-LD blocks by `@type`. 102 unit tests green (78 in `validate-tdk-drift.test.ts` + 24 in new `seo-probe.test.ts`). 5570 tools × 10 locales offline self-check PASS (3.0s). No wiring changes — `validate:tdk-drift` already in `qa:seo-governance` → `qa:production`. Per-tool online check count: 6 fields (2 TDK + 4 metadata; keywords = 0 today). 81-PLAN.md + 81-BASELINE.md written. REQUIREMENTS TCG-04 ✓ + traceability table + ROADMAP Phase 81 ✓ updated. **v0.0.23 Translation Corpus Governance milestone complete: TCG-01/02/03/04/05 all implemented.**
- 2026-06-22 Phase 80 complete (wave 2 of v0.0.23). **TCG-03 original premise DISPROVEN** (same pattern as Phase 79 fix-3/fix-5): "`translations.test.ts:45` uses `deepMerge(base, root)` opposite to runtime" — test was rewritten to call runtime loaders, no test-vs-runtime divergence exists. **Redesigned to multi-source support-copy overlap audit.** Exported `mergeMessageRecords` + `isMergeableRecord` + new pure async `readMessageFile` (offline, no glob/cache/fetch) from `src/lib/translations.ts` — single-source merge reuse (REQUIREMENTS line 84). Built `scripts/validation/validate-merge-chain-consistency.ts` + `.test.ts` (17 tests). Three audits: (1) `layer_overlap` = 15,301 warnings (15,034 root-only + 267 root+base; 498 distinct slugs; near-ubiquitous stale support-copy in legacy aggregate root); (2) `resolved_divergence` = **0** (merge logic correct, split file always wins → gate PASS exit 0); (3) `en_fallback_resolution` = 68 info (17 Phase-79 missing slugs × 4 fields, 2 distinct slugs: ip-geolocation + screen-recorder). Gate design: only resolved divergences fail gate; 0 → warning-only regression guard. Wired `validate:merge-chain-consistency` into `qa:seo-governance` + `qa:production`. 80-BASELINE.md + 80-PLAN.md updated. REQUIREMENTS TCG-03 + traceability table + ROADMAP marked implemented. `readMessageFile` is reusable by Phase 81.
- 2026-06-21 Phase 80 pre-research + plan complete. **TCG-03 original premise DISPROVEN** (REQUIREMENTS line 12/35: "`translations.test.ts:45` uses `deepMerge(base, root)` opposite to runtime") — that test was rewritten (`2ecbe102`/`081a6537`) to call the actual runtime loaders (`loadBaseMessages`/`loadToolMessages`), so test and runtime share one merge implementation; no test-vs-runtime divergence exists to audit. **Redesigned to the real problem** found by replicating `mergeMessageRecords` against real files: multi-source support-copy (`detailed_description`/`usage_steps`/`usage_examples`/`faqs`) overlap across 3 merge layers. Runtime chain = `loadToolMessages` does `mergeMessageRecords(toolData, detailed)` where `toolData` flows from `merge(merge(en_root,en_base), merge(loc_root,loc_base))` — all 3 layers feed support keys. Measured overlap: root.json (`<locale>.json`) = 5,002 (~500/locale, 497 in en), base.json `tools.*` = 389 (en=11, **zh=290 outlier**, others=11), split files = authoritative (Phase 79). **Confirmed real divergence**: `en/markdown-editor` `faqs` exists in both base.json and split file, 3 FAQs with identical questions but `IDENTICAL? false` (answer text drifts; base.json copy is dead shadowed weight). 80-PLAN.md: 3 audits — `layer_overlap` (warning), `resolved_divergence` (error, split must win), `en_fallback_resolution` (info, 17 Phase-79 missing slugs). Single-source: export `mergeMessageRecords` + new pure `readMessageFile` (no glob/cache/fetch). Gate fails on resolved divergences; if baseline = 0, downgrade to warning-only. REQUIREMENTS TCG-03 + Design Refinements + ROADMAP updated with the premise-disproof record (transparency pattern from Phase 79 fix-3).
- 2026-06-20 Phase 79 complete (wave 1 of v0.0.23). `scripts/validation/validate-translation-corpus.ts` (+ `.test.ts`) ships `validateSplitFile` / `auditCoverage` / `auditBaseJsonNamespace` / `runCorpusAudit` + `writeCorpusReport`. Three rule refinements driven by full-corpus reality: (1) TCG-01 `detailed_description` tiered `<20` stub error / `20–49` warning / `≥50` clean (single `≥50` threshold over-flagged); (2) TCG-01 `faqs` optional + legacy `{q,a}` accepted but flagged as render-drift error (ToolFAQ.astro renders empty); (3) TCG-05 redesigned to EN inner-key consistency after original mixed-layer premise disproven (`tools.*` are almost all slug objects). 44 unit tests green. Verified baseline (report `translation-corpus-2026-06-20T15-10-50-114Z.json`, gitignored): 5,573 files scanned; 51 schema errors + 37 coverage gaps (gate exit 1 — intentional, detection-only) + 325 namespace warnings. Coverage: 17 missing (`ip-geolocation`×9, `screen-recorder`×8) + 20 orphan (`curl-to-code`×10, `port-scanner`×10, both not-in-catalog). Alias `jwt-debugger`/`jwt-decoder` clean (0 findings). Wired `validate:translation-corpus` into `qa:seo-governance` + `qa:production`. 79-BASELINE.md records fact-checked findings; REQUIREMENTS/ROADMAP/79-PLAN + TRACEABILITY regenerated. Note: `generate-traceability-report.ts` parser regexes (`### Phase N:`, `^- [x] ID: title`, `**Milestone:**`) do not match current ROADMAP/REQUIREMENTS doc format (`**Phase N**`, `**ID** - title`, `## Active Milestone:`) — pre-existing gap (report was already empty in v0.0.22); not fixed in this detection-only milestone.
- 2026-06-20 v0.0.23 planning complete. Requirements drafted: 5 TCG requirements covering split file schema (TCG-01), coverage/parity (TCG-02), merge chain consistency (TCG-03), metadata drift extension to OG/Twitter/keywords/JSON-LD (TCG-04, absorbs deferred TDK-05), base.json namespace hygiene (TCG-05). Roadmap defines 3 phases: 79 (schema+coverage, wave 1), 80 (merge audit, depends 79), 81 (metadata drift, depends 79, can parallel 80). Key findings from exploration: ~5,573 split tool files (en=559/zh=557, 2-file gap confirmed), fixed 4-key schema, `translations.test.ts:45` uses `deepMerge(base, root)` vs runtime `mergeMessageRecords(fallback, locale)` (opposite directions), v2 namespace no longer exists (CONCERNS.md #4 stale), base.json `tools` mixes 146 UI keys + 692 slug objects. Detection-only milestone (no message file edits), reuses `mergeMessageRecords` single-source, ADR 0002 compliant, offline-safe (only TCG-04 `--online`).
- 2026-06-20 v0.0.22 archived. MILESTONE-AUDIT.md written: all 4 requirements (TDK-01/02/03/04) PASS, 52 unit tests green, 5570 tools × 10 locales offline self-check PASS, ADR 0002 enforced on reports, `withBrand` single-truth verified. ROADMAP updated (v0.0.22 → archived, v0.0.23 → active). STATE reset for v0.0.23.
- 2026-06-20 Phase 77 complete. `resolveExpectedTdk(locale, slug)` reproduces the `[slug].astro:133-137` fallback chain using the page's own `loadToolPageMessages` loader and `withBrand`; shared `src/lib/seo-probe.ts` module exports `fetchHtmlWithRetry` + `getTagContent` + `buildProbeHeaders` + `CHROME_DESKTOP_UA`; `captureRenderedTdk` online wrapper wired but unreachable without `--online`; offline self-check covers 5570 tools × 10 locales (PASS); 17 unit tests green. Fixed `validate-live-redirects.ts` side-effect import guard (direct-entry check via `path.resolve(argv[1]) === __filename`).
- 2026-06-20 v0.0.22 requirements + roadmap defined. Gap analysis of 5 existing TDK/metadata validators (`validate-tdk-translations`, `validate-tdk-integrity`, `validate-rendered-seo`, `seo-alignment-audit`, `validate-tool-locales`) confirmed none do source-vs-live drift comparison with brand-suffix + double-fallback-chain modeling — the new `validate-tdk-drift.ts` fills that gap. Rendering contract captured from `[slug].astro:133-137`: `seoTitle = seo_title ?? name ?? slug`, `brandedSeoTitle = withBrand(seoTitle)`, `seoDescription = seo_description ?? description`. Must reuse `withBrand` from `src/lib/seo.ts` and extract `fetchHtmlWithRetry`/`getTagContent` from `validate-rendered-seo.ts` into shared `src/lib/seo-probe.ts`.
- 2026-06-20 milestone v0.0.21 complete and archived. All three phases (74 matrix+pool, 75 hop tracer+loop blocker, 76 HTML safety auditor+gate) implemented; 38 probe unit tests green; front-end-safety scan green after extracting shared `safety-patterns.ts`. Audit/requirements/roadmap written under `.planning/milestones/`.
- 2026-06-18 Phase 76 complete. `auditHtmlSafety` (soft-404 scoped to `<h1>`/`<title>` across 10 locales + reasoning-trace via shared patterns + noindex), `--online`/`LIVE_REDIRECT_ONLINE=1` gate, sanitized JSON report under gitignored `.planning/research/reports/`, `validate:live-redirects:online` in package.json. 38 unit tests green.
- 2026-06-18 Phase 75 complete. Multi-hop `traceRedirectChain` with per-chain visited Set, `MAX_REDIRECTS=5` cap, query-param normalization (trailing-slash preserved to avoid false loop), non-mutating `suggestFlatten`. 24 unit tests green.
- 2026-06-18 Phase 74 complete. `validate-live-redirects.ts` ships matrix expansion (11 configs/rule), concurrency pool with 50–150ms jitter, manual-redirect fetch with `500*attempt` backoff, and `x-waf-bypass-token` header guard. 10 unit tests green.
- 2026-06-18 milestone v0.0.20 complete. Edge KV automatic publishing, local memory cache, and graph cycle detection gates implemented and verified green.
- 2026-06-17 milestone v0.0.19 complete. Dynamic redirects middleware, similarity generator CLI, and flagship l10n verified green.
- 2026-06-17 milestone v0.0.18 complete. Metadata audit passes with 0 warnings, GSC Recovery Pipeline E2E sandbox tests passed.
- 2026-06-17 milestone v0.0.17 complete and archived. All SEO & GEO validators and edge simulation loops are live.
- 2026-06-09 production route validation passed against `https://www.u2tool.com`.
- 2026-06-09 GSC recovery cohort plan created with exact URL lists, action rules, owner model, and checkpoints.
- 2026-06-12 GSC URL Inspection checkpoint recorded.

Milestones v0.0.14, v0.0.15, v0.0.16, v0.0.17, v0.0.18, v0.0.19, v0.0.20, v0.0.21, v0.0.22 are complete and archived.

## Next Action

**v0.0.23 (Translation Corpus Governance) milestone complete** — all 3 phases
(79/80/81) shipped, TCG-01/02/03/04/05 implemented. No outstanding work for
this milestone. Awaiting next milestone definition; candidate next steps
(verified during Phase 81, not yet committed as a plan):
- Run `validate:tdk-drift:online` against production to capture the first
  online metadata-drift baseline (gated by `--online`/`TDK_DRIFT_ONLINE=1`;
  requires production network + WAF bypass token). Offline parity is already
  verified by the 102 unit tests + 5570 self-check.

## Session

Last Date: 2026-06-22T04:30:00.000Z
Stopped At: Phase 81 complete; v0.0.23 milestone complete (all 3 phases done)
Resume File: .planning/phases/81-metadata-drift-extension/81-BASELINE.md
