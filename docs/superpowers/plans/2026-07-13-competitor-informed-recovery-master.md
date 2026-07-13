# Competitor-Informed Recovery Master Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Coordinate the truthfulness-first recovery program from the approved design through six pilot releases, P1 expansion, selective-indexation review, and 90-day GSC measurement without obscuring the sitemap recovery experiment.

**Architecture:** Four independently reviewable subprojects feed one release train. Capability governance is the shared contract, the six pilot tools prove it, index-readiness produces recommendations only, and cohort monitoring controls expansion. Every production batch is reversible and has a control cohort.

**Tech Stack:** Astro 6, Svelte 5, TypeScript, Vitest, Cloudflare Workers, localized JSON messages, repository SEO validators, Google Search Console exports.

**Global Constraints:** Preserve existing URLs and canonicals; add no recurring paid API cost; do not connect to databases or upload user files; do not auto-mutate robots, canonical, sitemap, redirects, or `noindex`; do not deploy recovery product/content changes before the 2026-07-27 Day 14 sitemap checkpoint unless a live technical indexability failure is proven.

---

## Source Documents

- Approved design: `docs/superpowers/specs/2026-07-13-competitor-informed-recovery-roadmap-design.md`
- Sitemap recovery record: `docs/GSC_SITEMAP_LASTMOD_RECOVERY_2026-07-13.md`
- Day 7 decision queue: `docs/GSC_DAY7_DECISION_QUEUE_2026-07-13.md`
- Traffic cliff report: `docs/GSC_TRAFFIC_CLIFF_REPORT_2026-07-01.md`
- Subproject 1: `docs/superpowers/plans/2026-07-13-capability-truthfulness-governance.md`
- Subproject 2: `docs/superpowers/plans/2026-07-13-six-tool-product-recovery-pilot.md`
- Subproject 3: `docs/superpowers/plans/2026-07-13-multilingual-selective-indexation-governance.md`
- Subproject 4: `docs/superpowers/plans/2026-07-13-cohort-rollout-recovery-monitoring.md`

## Approved-Design Traceability

| Approved requirement | Implementation owner |
|---|---|
| Six typed profiles, evidence tests, and claim validators | Capability governance Tasks 1-6 |
| No undisclosed English-only localized grammar claims | Product pilot Task 1; multilingual governance Task 3 |
| Hex binary editing without remote upload | Product pilot Task 2 |
| Database-aware local SQL analysis without execution | Product pilot Task 3 |
| Optional free server assist with consent, limit, and fallback | Product pilot Task 4 |
| Local Excel data view without macro/full-fidelity claims | Product pilot Task 5 |
| Timed typing metrics and local-only history | Product pilot Task 6 |
| Gantt dependencies, critical path, local persistence, and data exchange | Product pilot Task 7 |
| Recommendation-only selective indexation | Multilingual governance Tasks 1-6 |
| 48-hour, 14-day, and 28-day control-cohort gates | Cohort monitoring Tasks 1-8 |
| P1 then 50-100 URL catalog expansion | Master Tasks 5-6 |
| Day 14 observation freeze and 90-day review | Master Tasks 1 and 7 |

## Dependency Order

```text
Day 14 sitemap verdict
  -> capability truthfulness governance
     -> grammar language gate
     -> hex editor
     -> SQL analyzer
     -> Excel data viewer
     -> typing speed test
     -> Gantt chart
        -> selective-indexation report
           -> P1 profile expansion
              -> 50-100 URL locale/category cohorts
```

The six pilot tools are released one at a time. A tool may be implemented on an isolated branch before the Day 14 checkpoint, but it must not be merged into the deployment branch or deployed until the checkpoint decision explicitly opens the production lane.

## Task 1: Preserve The Observation Window

**Files:**
- Read: `docs/GSC_SITEMAP_LASTMOD_RECOVERY_2026-07-13.md`
- Read: `docs/GSC_DAY7_DECISION_QUEUE_2026-07-13.md`
- Create after checkpoint: `docs/GSC_SITEMAP_DAY14_DECISION_2026-07-27.md`

- [ ] **Step 1: Run the Day 7 readout on 2026-07-20**

Export equal-window GSC Performance data and record the sitemap status. Do not interpret partial same-day data as recovery.

- [ ] **Step 2: Run the Day 14 readout on 2026-07-27**

The decision note must record:

```md
- Sitemap status and last read date
- Indexed and excluded page counts
- Sitewide clicks, impressions, CTR, and average position
- Pilot-candidate page and query movement
- Canonical, robots, hreflang, crawl, or rendering failures
- Decision: OPEN_PRODUCT_LANE | HOLD_PRODUCT_LANE | TECHNICAL_ROLLBACK
```

- [ ] **Step 3: Keep the production lane closed unless the decision is `OPEN_PRODUCT_LANE`**

Expected: no product, support-copy, internal-link, or indexation deployment before the decision. Documentation, tests, and unmerged implementation branches are allowed.

- [ ] **Step 4: Commit the checkpoint decision**

```bash
git add docs/GSC_SITEMAP_DAY14_DECISION_2026-07-27.md
git commit -m "docs: record sitemap day 14 decision"
```

## Task 2: Implement Capability Governance

**Plan:** `docs/superpowers/plans/2026-07-13-capability-truthfulness-governance.md`

- [ ] **Step 1: Complete all governance tests and validators**
- [ ] **Step 2: Confirm the six pilot profiles are the only release-blocking profiles**
- [ ] **Step 3: Render the capability/privacy disclosure on all six pilot pages**
- [ ] **Step 4: Run the focused governance gate**

```bash
npx vitest run src/config/tool-capabilities src/lib/tool-capability-claims.test.ts scripts/validation/validate-tool-capability-claims.test.ts
npm run validate:tool-capability-claims
npm run qa:seo-governance
```

Expected: all commands exit `0`; six profiles resolve; unsupported claims produce non-zero validator results in fixtures.

- [ ] **Step 5: Commit as an independently reviewable change**

```bash
git add src/config/tool-capabilities src/lib/tool-capability-claims.ts src/lib/tool-capability-claims.test.ts src/components/tools/ToolCapabilityDisclosure.astro src/pages/'[locale]'/tools/'[slug].astro src/messages scripts/validation package.json
git commit -m "feat: add tool capability truthfulness governance"
```

## Task 3: Release The Six Pilots Sequentially

**Plan:** `docs/superpowers/plans/2026-07-13-six-tool-product-recovery-pilot.md`

Release order is fixed:

1. Grammar Checker truthfulness and language gate
2. Hex Editor
3. SQL Query Optimizer
4. Excel Viewer
5. Typing Speed Test
6. Gantt Chart

- [ ] **Step 1: Complete one pilot's tests, copy, profile version, and rendered contract**
- [ ] **Step 2: Deploy only that pilot after the production lane is open**
- [ ] **Step 3: Run its 48-hour technical check**
- [ ] **Step 4: Wait for the complete 14-day window**
- [ ] **Step 5: Apply the expand/hold/rollback gate before starting the next production pilot**

Implementation of later pilots may continue in isolated branches while a prior pilot is measured, but production cohorts must remain separable by deployment and date.

## Task 4: Generate Index-Readiness Recommendations

**Plan:** `docs/superpowers/plans/2026-07-13-multilingual-selective-indexation-governance.md`

- [ ] **Step 1: Run the evaluator against all tool-locale pairs**
- [ ] **Step 2: Confirm outputs contain recommendations only**
- [ ] **Step 3: Manually review every `merge` and `noindex-candidate` row**
- [ ] **Step 4: Keep Spanish chart recovery controls unchanged**
- [ ] **Step 5: Approve at most one locale/category cohort of 50-100 URLs**

No recommendation becomes a metadata change without a separate implementation plan and explicit approval.

## Task 5: Operate The Cohort Gates

**Plan:** `docs/superpowers/plans/2026-07-13-cohort-rollout-recovery-monitoring.md`

- [ ] **Step 1: Freeze the baseline and control cohort before each deployment**
- [ ] **Step 2: Run the 48-hour technical report**
- [ ] **Step 3: Run the 14-day equal-window performance gate**
- [ ] **Step 4: Run the 28-day expand/hold/rollback decision**
- [ ] **Step 5: Record whether one anomalous query explains the movement**

The expansion gate passes only when all conditions are true:

```text
technical regressions = 0
capability claim violations = 0
clicks >= comparison-window clicks
and (
  impressions >= comparison-window impressions * 1.20
  or average position improves by at least 5.0
)
movement is not dominated by one query
control cohort does not show the same movement
```

## Task 6: Expand To P1 And Then The Catalog

- [ ] **Step 1: Add profiles for the 95 P1 pages in category-sized commits**

Each P1 profile must name behavior evidence and forbidden claims. Do not invent capabilities from existing SEO copy.

- [ ] **Step 2: Run truth checks before changing any P1 copy**

```bash
npm run validate:tool-capability-claims
npm run qa:seo-governance
```

- [ ] **Step 3: Release one 50-100 URL batch at a time**

Each batch must contain either one locale across a coherent category or one category across a coherent locale set. Do not combine unrelated locales and categories.

- [ ] **Step 4: Preserve a comparison cohort**

The comparison cohort must have similar historical impressions and page type but receive no product, content, internal-link, or indexation change during the measurement window.

## Task 7: Run The 90-Day Program Review

**Files:**
- Create: `docs/GSC_COMPETITOR_RECOVERY_90_DAY_REVIEW_2026-10-25.md`

- [ ] **Step 1: Evaluate all ten approved success criteria**

Use `pass`, `partial`, or `fail` for each criterion and attach the evidence source.

- [ ] **Step 2: Separate technical, product, content, locale, and demand outcomes**

Do not attribute sitewide movement to a pilot when the control cohort or an external trend moved similarly.

- [ ] **Step 3: Decide the next quarter**

Choose one:

```text
EXPAND_P1
HOLD_AND_REFINE_PILOTS
ROLL_BACK_WEAK_PILOTS
REOPEN_ROOT_CAUSE_DIAGNOSIS
```

- [ ] **Step 4: Commit the review**

```bash
git add docs/GSC_COMPETITOR_RECOVERY_90_DAY_REVIEW_2026-10-25.md
git commit -m "docs: record competitor recovery 90 day review"
```

## Program-Level Verification

Run before every production release:

```bash
npm run check
npm run qa:seo-governance
npm run qa:runtime-integrity
npm run validate:tool-capability-claims
npm run validate:tool-page-render-contract
npm run build
```

Expected: all commands exit `0`. If a command fails because the local SSR server is not running, start the server required by that validator and rerun; do not waive the result.
