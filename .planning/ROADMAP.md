# Roadmap: U2Tool

## Archived Milestones

- [x] v0.0.26 Persistent Render Regression Gate
  Requirements: [.planning/milestones/v0.0.26-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.26-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.26-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.26-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-23. Added a durable SSR render contract gate for 11 representative tool pages, covering all 8 cluster families plus FAQ, CJK, and RTL sentinel routes. The gate extracts stable semantic HTML contracts (head metadata, canonical, JSON-LD types, cluster attributes, sibling links, FAQ count, and body sentinels) instead of committing full HTML snapshots. It directly guards the v0.0.25 Phase 84 missing cluster-card runtime bug, supports `--timeout-ms` to avoid hanging fetches, and is wired into `qa:production` after `build`. Local SSR validation passed 11/11 routes against `http://127.0.0.1:4321` on 2026-06-23.

- [x] v0.0.25 Cluster Card / Tool Island Commonality Extraction
  Requirements: [.planning/milestones/v0.0.25-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.25-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.25-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.25-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-23. Extracted shared types (`tool-cluster-types.ts`, 6 interfaces/types) and factory (`tool-cluster-factory.ts`, 4 generic builders) from 8 `*-cluster.ts` data files. Replaced 16 per-cluster Astro components (8 Card + 8 Section) with unified `ToolClusterCard.astro` + `ToolClusterSection.astro`. Fixed critical template bug (`Card` discriminator vestige → `ToolClusterCard`). Simplified `CLUSTER_BLOCKS` type to named `ToolClusterBlock` interface, removed 16 unused type imports. 3 phases (83/84/85), 9 requirements (SCT-01/02/03/04, UCC-01/02/03/04, TBF-01) all PASS. `astro check` 0 errors, `astro build` success, 811/811 relevant tests green. Refactor-only discipline: zero `src/messages/` changes, zero rendering behavior changes.

- [x] v0.0.24 Tool Detail Page Architecture Refactor
  Requirements: [.planning/milestones/v0.0.24-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.24-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.24-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.24-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-23. Behavior-preserving single-file refactor of `src/pages/[locale]/tools/[slug].astro` (729 → 721 lines): collapsed 8 copy-pasted cluster configurations (getXxxClusterCopy + buildXxxClusterGroupForTool + {xxxGroup && <XxxClusterCard/>}) into one `CLUSTER_BLOCKS` array + single `.map` render loop. FAQ extraction + support-content trust/fallback chain organized into clear frontmatter sections. HTML snapshot byte-diff over 11 representative slug × locale pages proves byte-equivalence (-6 bytes pure whitespace). TDP-01/02/03/04/05 all implemented in Phase 82; two design refinements transparently recorded (TDP-01 order-description typo fix; TDP-03 function-extraction rolled back to inline after `translations.test.ts` contract-test regression, caught on clean HEAD). `qa:production` chain 27/28 green (sole failure = v0.0.23 legacy detection-only `validate:translation-corpus`). Single-file boundary + refactor-only discipline held: zero `src/messages/`, `src/lib/`, `src/components/` changes; only new file is one-shot `scripts/validation/snapshot-tool-pages.ts`.

- [x] v0.0.23 Translation Corpus Governance
  Requirements: [.planning/milestones/v0.0.23-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.23-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.23-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.23-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-22. Built a three-layer translation corpus governance system (detection-only). Phase 79: split-file schema validator (4-key schema, tiered `detailed_description` thresholds, legacy FAQ variant detection) + coverage/parity detector (17 missing slugs, orphans, inter-locale asymmetry) + base.json namespace EN-consistency check; 44 unit tests green. Phase 80: merge chain consistency auditor — redesigned after premise disproof to multi-source support-copy overlap audit, exported `readMessageFile` + `mergeMessageRecords` as reusable probes, 0 resolved divergences (split file always wins); 17 unit tests green. Phase 81: metadata drift extension (TDK-05) covering `og:title`/`twitter:title`/`keywords`/JSON-LD via new `compareMetadata()` wrapper + 4 seo-probe extractors; 102 unit tests green (78 + 24). All three validators wired into `qa:seo-governance` → `qa:production`. Two premise disproofs transparently recorded.

- [x] v0.0.22 TDK Drift Verification
  Archive: [.planning/milestones/v0.0.22-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.22-MILESTONE-AUDIT.md)
  Requirements: [.planning/REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/REQUIREMENTS.md)
  Status: Shipped on 2026-06-20. Built a source-truth ↔ live-rendered TDK drift detector for tool detail pages. Phase 77: `resolveExpectedTdk` reproducing `[slug].astro:133-137` fallback chain with reused `withBrand`, shared `src/lib/seo-probe.ts` module, `captureRenderedTdk` batch capture. Phase 78: 5-label drift comparator (MATCH/BRAND_DRIFT/FALLBACK_LEAK/ENGLISH_RESIDUE/MISMATCH) with Unicode NFC normalization, JSON report writer, `--online` production gate with exit code policy. 52 unit tests green; 5570 tools × 10 locales offline self-check PASS.

- [x] v0.0.21 Live Redirection Connection Monitoring & Crawler
  Archive: [.planning/milestones/v0.0.21-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.21-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.21-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.21-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.21-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.21-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-20. Built a live redirect probe (matrix expansion + fetch pool), multi-hop tracer with per-chain loop blocker and query-param normalization, and an HTML safety auditor (soft-404 + reasoning-trace + noindex) gated behind --online. 38 unit tests green across all three phases.

- [x] v0.0.20 GSC Recovery Automation & Long-tail Expansion
  Archive: [.planning/milestones/v0.0.19-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.19-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.19-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.19-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.19-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.19-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-17. Implemented dynamic Cloudflare Workers redirects, similarity auto-mapper CLI generator, and fully aligned flagship fitness tools TDK across 10 locales.

- [x] v0.0.18 GSC Recovery Checkpoint & Content Optimization
  Archive: [.planning/milestones/v0.0.18-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.18-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.18-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.18-REQUIREMENTS.md)
  Audit: [.planning/v0.0.18-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/v0.0.18-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-17. Generated 2026-06-16 checked GSC comparison report, optimized TDKs for 13 Cohort C tools in 10 languages with 0 warning, and designed GSC recovery pipeline with verified middleware E2E sandbox.

- [x] v0.0.17 SEO & GEO Comprehensive Audit & Governance
  Archive: [.planning/milestones/v0.0.17-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.17-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.17-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.17-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.17-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.17-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-17. Implemented full-scale trailing-slash validation, multi-locale sitemap validator, Robots.txt & 410 decommissioned route auditor, 10-locale hreflang SCC graph validator, TDK completeness scanner, Breadcrumbs Schema validator, llms.txt optimizer, and edge-simulation safety gates. Fully verified online.

- [x] v0.0.16 GSC Legacy Redirects & Decommissioned Route Governance
  Archive: [.planning/milestones/v0.0.16-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.16-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.16-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.16-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.16-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.16-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-16. Implemented dynamic trailing-slash 301 redirects, legacy blog/compare redirects, and stale Next.js chunk asset 410 gone response gates, verified through comprehensive E2E Puppeteer redirect chains and technical SEO validation scripts.

- [x] v0.0.15 Technical SEO Redirection Governance & Root Route Normalization
  Archive: [.planning/milestones/v0.0.15-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.15-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.15-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.15-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.15-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.15-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-16. Implemented canonical 301 redirects from the root route `/` to the default language prefix `/en/` while preserving all query parameters. Implemented loopback safety guards (headers: `cf-worker`, `x-worker-loopback`, User-Agent) to bypass redirection and prevent loopbacks. Updated `public/_routes.json` to explicitly intercept root route requests. Extended technical SEO validation and E2E smoke tests validating root redirection and loopback bypass behavior.

- [x] v0.0.14 Production Release and GSC Recovery Measurement
  Archive: [.planning/milestones/v0.0.14-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.14-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.14-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.14-REQUIREMENTS.md)
  Audit: [.planning/v0.0.14-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/v0.0.14-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-15. Released recovery slice through PR #25, verified live category support copy, ran spot checks for Cohort A/B on June 12, resolved Wrangler high-concurrency connection drops via loopback retry client, and aligned 10-locale intent TDK.

- [x] v0.0.13 Popular Tool Flagship Conversion Wave
  Archive: [.planning/milestones/v0.0.13-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.13-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.13-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.13-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.13-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.13-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-09. Converted all remaining high-traffic `PopularUtilityTool` catalog placeholders to real Svelte 5 components across Finance, Developer/Security, Content Generators, Social/Media, Lifestyle, Image, and Converter clusters. Added category-level authority content for English `finance`, `generators`, and `lifestyle`, preserved the no-internal-reasoning frontend safety rule, and closed on green build, runtime, SEO, placeholder, and frontend-safety gates.

## Archived Milestone: v0.0.27 Production QA Closure

**Goal:** Turn the full `qa:production` chain into a repeatable release checklist with environment preflight, failure taxonomy, guarded command recipes, and evidence logging.

**Requirements:** [.planning/milestones/v0.0.27-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.27-REQUIREMENTS.md)

**Phase plan:**

- [x] **Phase 87** - Production QA Closure

**Design notes:**

- Docs-first milestone: prefer release checklist clarity over broad script refactors.
- Do not fix warning-only namespace/overlap debt in this milestone; classify it clearly instead.
- Keep local/CI gates strict while documenting Codex sandbox bind/listen/fetch limits as environmental.

**Status:** Completed on 2026-06-24. Focused offline gates passed, local SSR probe returned HTTP 200, and `validate:tool-page-render-contract` passed 11/11 routes against `http://127.0.0.1:4321`.

## Archived Milestone: v0.0.28 Traceability Contract Restoration

**Goal:** Restore `planning:traceability` so the generated report reflects the current planning format, shows real requirement/phase coverage, and becomes trustworthy release evidence again.

**Requirements:** [.planning/milestones/v0.0.28-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.28-REQUIREMENTS.md)

**Audit:** [.planning/milestones/v0.0.28-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.28-MILESTONE-AUDIT.md)

**Phase plan:**

- [x] **Phase 88** - Traceability Contract Restoration

**Design notes:**

- Fix the generator around the current planning doc shape instead of hand-maintaining a parallel matrix.
- Evidence discovery should reflect the planning artifacts the repo actually tracks today.
- `verify:production` should stop getting a false sense of safety from an empty traceability report.

**Status:** Archived on 2026-06-24. `planning:traceability` now parses the current milestone/requirements/phase format, focused traceability tests pass, and the regenerated report records 6 requirements, Phase 88 coverage, and milestone-audit evidence without false-green gaps.

## Archived Milestone: v0.0.29 Production Metadata Drift Baseline

**Goal:** Turn `validate:tdk-drift:online` from a wired-but-never-baselined capability into a usable production evidence workflow with scope controls, explicit environment semantics, readable summaries, and a first captured online baseline.

**Requirements:** [.planning/milestones/v0.0.29-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.29-REQUIREMENTS.md)

**Audit:** [.planning/milestones/v0.0.29-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.29-MILESTONE-AUDIT.md)

**Phase plan:**

- [x] **Phase 89** - Production Metadata Drift Baseline

**Design notes:**

- Keep offline `validate:tdk-drift` unchanged and green; this milestone is about the online production layer.
- Prefer a representative smoke cohort plus targeted reruns before forcing a 5570-route full sweep into every release path.
- Missing secrets, unreachable production targets, or WAF/network failures must be classified explicitly instead of getting buried as generic drift noise.

**Status:** Archived on 2026-06-24. Phase 89 now has scoped online CLI controls, a committed smoke cohort, explicit blocker semantics, markdown summary output, green focused tests (`85/85`), and captured local + production smoke artifacts. Production smoke has already been confirmed from a reachable local terminal with `42/42 MATCH`, and Cloudflare dashboard inspection showed no configured `x-waf-bypass-token` bypass rule for the current zone, so `WAF_BYPASS_TOKEN` is treated as optional infrastructure rather than a universal production prerequisite.

## Archived Milestone: v0.0.30 Translation Warning Signal Reduction

**Goal:** Reduce the standing translation-governance warning noise so release evidence can separate real regressions from historical backlog, starting with `group_key_drift` namespace warnings and root-layer duplicate support-copy overlap.

**Requirements:** [.planning/milestones/v0.0.30-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.30-REQUIREMENTS.md)

**Audit:** [.planning/milestones/v0.0.30-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.30-MILESTONE-AUDIT.md)

**Phase plan:**

- [x] **Phase 90** - Translation Warning Signal Reduction

**Design notes:**

- Plan against the current measured repo state, not stale backlog from earlier detection-only milestones.
- Keep schema / coverage / resolved-divergence gates strict; improve warning signal quality without weakening hard failures.
- Start from the concentrated hotspots: `zh` dominates namespace drift, and `root` dominates merge-layer overlap noise.

**Status:** Completed on 2026-06-24. Phase 90 improved validator ergonomics (`--help`, `--report-path`, `--top`), added warning breakdown summaries, regenerated planning evidence for `v0.0.30`, and completed one bounded duplicate-copy cleanup batch. The milestone closed with `validate:translation-corpus` PASS at `307` warning-only namespace issues and `validate:merge-chain-consistency` PASS at `15241` warning-only overlap findings, both still at `0` hard-fail counts. Post-closure follow-up cleanups reduced namespace warnings to `0`, eliminated all `missing_only` namespace drift, reduced merge-chain overlap warnings to `0`, and preserved `0` hard-fail counts.

## Archived Milestone: v0.0.31 TDK Compliance Warning Signal Reduction

**Goal:** Turn `validate:tdk-integrity` from a flat warning dump into a readable release-health signal, then prove the workflow with a bounded top-overrun metadata cleanup batch.

**Requirements:** [.planning/milestones/v0.0.31-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.31-REQUIREMENTS.md)

**Audit:** [.planning/milestones/v0.0.31-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.31-MILESTONE-AUDIT.md)

**Phase plan:**

- [x] **Phase 91** - TDK Compliance Warning Signal Reduction

**Design notes:**

- Preserve hard errors for missing metadata and placeholder leakage.
- Keep length/style findings warning-only, but make them reviewable by locale, field, category, slug, and overrun size.
- Avoid whole-catalog rewriting; use a small top-overrun batch to validate the cleanup loop.

**Status:** Completed on 2026-06-27; ready to select the next milestone. `validate:tdk-integrity` now supports `--help`, `--report-path` / `--json-out`, and `--top`; writes complete JSON reports; and prints summarized warning evidence. Focused tests pass (`7/7`). The fresh baseline was `0` errors / `2802` warnings, and the top-10 cleanup reduced it to `0` errors / `2792` warnings while keeping edited root/base metadata synchronized. Closeout verification kept `validate:tdk-drift`, `validate:translation-corpus`, and `validate:merge-chain-consistency` green.

## Archived Milestone: v0.0.32 TDK Cleanup Batch Planner

**Goal:** Turn the remaining TDK warning backlog into a reviewable cleanup queue with ranked candidates, source-layer evidence, and scoped export controls.

**Requirements:** [.planning/milestones/v0.0.32-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.32-REQUIREMENTS.md)

**Audit:** [.planning/milestones/v0.0.32-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.32-MILESTONE-AUDIT.md)

**Phase plan:**

- [x] **Phase 92** - TDK Cleanup Batch Planner

**Design notes:**

- Build on the v0.0.31 report model instead of creating a separate scanner.
- Keep ordinary `validate:tdk-integrity` pass/fail behavior unchanged.
- Export candidates for human review; do not mass-edit localized metadata copy in this milestone.
- Include root/base source-layer status so follow-up batches know whether one or both legacy metadata layers need synchronized edits.

**Status:** Completed and merged on 2026-06-27. `validate:tdk-integrity` now supports optional cleanup candidate exports via `--candidates-path`, `--candidate-top`, `--candidate-locales`, `--candidate-fields`, and `--candidate-directions`. Focused tests pass (`11/11`), traceability maps `6/6` requirements, `qa:seo-governance` passes, and `npm run check` passes with only existing hints. The fresh candidate baseline is `0` errors / `2792` warnings, and the top-20 overlong `seo_description` export includes rank, length bounds, overrun size, current value evidence, file paths, and source-layer sync status.

## Archived Milestone: v0.0.33 TDK Cleanup Batch One

**Goal:** Use the v0.0.32 candidate export to trim the first bounded set of 10 synchronized overlong `seo_description` entries.

**Requirements:** [.planning/milestones/v0.0.33-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.33-REQUIREMENTS.md)

**Phase plan:**

- [x] **Phase 93** - TDK Cleanup Batch One

**Design notes:**

- Edit only the selected 10 `root_base_match` candidates from the fresh export.
- Keep root/base metadata synchronized for every edited pair.
- Avoid CJK/RTL/Slavic-language edits in this batch.
- Verify a concrete warning-count reduction while preserving `0` hard errors.

**Status:** Completed and merged on 2026-06-27. The selected 10 root/base `seo_description` pairs were trimmed and kept synchronized. `validate:tdk-integrity` reports `0` errors / `2782` warnings, down from `2792`, with `seo_description` warnings reduced from `2350` to `2340`.

## Archived Milestone: v0.0.34 TDK Cleanup Batch Two

**Goal:** Use the remaining candidate export queue to trim the second bounded set of 10 synchronized overlong `seo_description` entries.

**Requirements:** [.planning/milestones/v0.0.34-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.34-REQUIREMENTS.md)

**Audit:** [.planning/milestones/v0.0.34-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.34-MILESTONE-AUDIT.md)

**Phase plan:**

- [x] **Phase 94** - TDK Cleanup Batch Two

**Design notes:**

- Edit only the selected 10 `root_base_match` candidates from the fresh v0.0.34 export.
- Keep root/base metadata synchronized for every edited pair.
- Stay with low-risk Latin-script `es` and `pt` entries in this batch.
- Verify a concrete warning-count reduction while preserving `0` hard errors.

**Status:** Completed and merged on 2026-06-27. The selected 10 root/base `seo_description` pairs were trimmed and kept synchronized. `validate:tdk-integrity` reports `0` errors / `2772` warnings, down from `2782`, with `seo_description` warnings reduced from `2340` to `2330`.

## Active Milestone: v0.0.35 TDK Cleanup Batch Three

**Goal:** Use the remaining candidate export queue to trim the third bounded set of 10 synchronized overlong `seo_description` entries.

**Requirements:** [.planning/milestones/v0.0.35-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.35-REQUIREMENTS.md)

**Phase plan:**

- [x] **Phase 95** - TDK Cleanup Batch Three

**Design notes:**

- Edit only the selected 10 `root_base_match` candidates from the fresh v0.0.35 export.
- Keep root/base metadata synchronized for every edited pair.
- Stay with low-risk Latin-script `es`, `fr`, and `pt` entries in this batch.
- Follow candidate JSON rank order for same-overrun ties; do not substitute CLI summary examples.
- Verify a concrete warning-count reduction while preserving `0` hard errors.

**Status:** Completed locally on 2026-06-27; final PR integration pending. The selected 10 root/base `seo_description` pairs were trimmed and kept synchronized. `validate:tdk-integrity` now reports `0` errors / `2762` warnings, down from `2772`, with `seo_description` warnings reduced from `2330` to `2320`.
