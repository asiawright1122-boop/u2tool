# Competitor-Informed SEO and Product Recovery Roadmap Design

**Status:** Approved

**Date:** 2026-07-13

**Scope:** U2Tool search recovery, product-capability truthfulness, multilingual quality, selective indexation, and staged rollout

## Context

U2Tool lost most of its Google visibility beginning on 2026-03-29. The current technical baseline is healthy: production URLs are reachable, canonical and hreflang checks pass, the sitemap lastmod recovery was deployed and accepted by Google Search Console on 2026-07-13, and no manual action, security issue, or broad server outage has been found.

The remaining diagnosis is a broad ranking and quality reassessment rather than a simple crawl outage. The 2026-07-13 competitor review strengthened that diagnosis:

- U2Tool's homepage and internal-link architecture are already substantial.
- The strongest SERP competitors are usually specialist products rather than other broad tool collections.
- Several U2Tool pages use head-query positioning that exceeds the implemented product capability.
- Some localized pages imply local-language functionality while the underlying engine only supports English.
- Adding more generic copy to thousands of pages would not resolve these product-intent gaps.

Representative findings:

| Tool | Current implementation | Competitor-led gap |
|---|---|---|
| Hex Editor | Text-to-hex and hex-to-text conversion | SERP leaders edit binary files, search bytes, and export modified files |
| Grammar Checker | English spelling and grammar rules reused behind localized pages | Native-language competitors check spelling, grammar, and punctuation in the queried language |
| SQL Query Optimizer | Static heuristic checks and SQL formatting | SERP leaders provide database-specific diagnostics, rewrites, and index guidance |
| Excel Viewer | XLS/XLSX parsed into row data | SERP leaders render broader workbook structures and formats |
| Typing Speed Test | Passage-completion test with WPM and accuracy | Specialist competitors provide timed modes, CPM, consistency, and deeper practice loops |
| Gantt Chart | Basic task, date, progress, and image export | SERP leaders offer dependencies, milestones, templates, persistence, and collaboration |

## Decision

Adopt a truthfulness-first staged recovery program.

The program balances search recovery and product quality. It does not treat SEO copy, product functionality, localization, or indexation as independent shortcuts. Each published claim must be backed by an implemented and tested capability.

The program uses a hybrid runtime model:

- Basic functionality runs locally in the browser.
- Advanced server functionality is optional and user-triggered.
- Server functionality may use only existing infrastructure or free allowances.
- The product must retain a useful local fallback when server functionality is unavailable.
- The program adds no recurring paid API cost.

## Goals

1. Make search positioning, rendered content, structured data, and actual tool behavior consistent.
2. Correct misleading multilingual capability claims.
3. Upgrade six high-value pilot tools without creating enterprise-sized products.
4. Establish a reusable capability governance system for the 95 P1 pages and eventually all 570 tools.
5. Make selective indexation evidence-led and reversible.
6. Preserve the sitemap recovery experiment until the Day 14 decision point.
7. Recover traffic through measured cohorts rather than large simultaneous page changes.

## Non-Goals

- No broad tool launch program during recovery.
- No bulk rewrite of all 5,700 localized tool pages.
- No automatic noindex, robots, canonical, redirect, or sitemap mutation from a scoring script.
- No paid third-party AI dependency.
- No database connections or SQL execution.
- No macro execution or full Microsoft Excel compatibility.
- No enterprise project management, collaboration, account, or cloud-sync platform.
- No claim that an optimization guarantees ranking or performance improvement.

## Program Decomposition

The roadmap is divided into four independently reviewable subprojects.

### Subproject 1: Capability Truthfulness Governance

Create the structured capability source of truth, validators, locale-support rules, privacy disclosure rules, and index-readiness reporting.

### Subproject 2: Six-Tool Product Recovery Pilot

Upgrade or reposition Hex Editor, SQL Query Optimizer, Excel Viewer, Grammar Checker, Typing Speed Test, and Gantt Chart.

### Subproject 3: Multilingual and Selective Indexation Governance

Evaluate every tool and locale combination against real language support, content independence, product value, and GSC demand. Produce recommendations only.

### Subproject 4: Cohort Rollout and Recovery Monitoring

Deploy small batches, preserve control cohorts, run 48-hour technical checks, and use 14-day and 28-day GSC gates before expansion.

Each subproject receives its own implementation plan. Subproject 1 is implemented first because the later work depends on its interfaces and release gates.

## Architecture

The recovery chain is:

Actual component behavior and tests
→ ToolCapabilityProfile
→ page capability and privacy presentation
→ TDK, support-content, and structured-data validation
→ locale support and index-readiness evaluation
→ six-tool pilot release
→ 14-day and 28-day GSC decision gates
→ expansion to P1 pages and later batches

The capability profile is the boundary between product behavior and search-facing claims. It is not a marketing-copy generator.

## Tool Capability Model

Every governed tool has a ToolCapabilityProfile containing:

- slug
- capability version
- operating modes
- accepted inputs
- produced outputs
- supported locales
- browser-only features
- optional server features
- operational limits
- forbidden claims
- target search intents
- behavior tests that prove the claims

The source should be split into focused files rather than one large manifest:

- shared capability types
- one capability profile module per governed tool
- a resolver that returns a profile by slug
- a readiness evaluator that combines profile, locale, content, and demand evidence
- validation scripts that compare rendered claims with the profile

## Governance Rules

1. The six pilot tools must have capability profiles before production changes are allowed.
2. Every enabled capability must have a behavior test.
3. Every forbidden claim must be covered by a negative content test.
4. New features require a capability-version change and corresponding tests.
5. Existing message files continue to own human-readable copy.
6. CI prevents copy from claiming unsupported inputs, outputs, languages, workflows, or server behavior.
7. A missing profile blocks pilot release but does not immediately block unrelated legacy tools.
8. Profile coverage expands from six pilots to the 95 P1 cohort and then to the remaining catalog.

## Pilot Tool Designs

### Hex Editor

Preserve the existing URL and canonical.

Add two explicit modes:

- File Editor: local file opening, offset/hex/ASCII grid, byte editing, hex or ASCII search, and modified-file download.
- Text Converter: retain the existing text-to-hex and hex-to-text workflow.

Do not add disassembly, remote uploads, professional reverse-engineering workflows, or arbitrary format interpretation.

### SQL Query Optimizer

Provide a useful local analyzer as the required baseline:

- database-type selection
- static query rules
- index candidates
- SQL formatting
- pasted EXPLAIN-result analysis
- explanations with uncertainty and limitations

An optional advanced action may use existing free Workers AI capacity when available. It must be feature-flagged, user-triggered, rate-limited, and able to fall back to the local analyzer.

The tool must not connect to a database, execute SQL, or promise guaranteed speed gains.

### Excel Viewer

Position the product as a local Excel Data Viewer.

Supported pilot capabilities:

- XLS and XLSX input
- multiple worksheets
- cell addresses and values
- formula text where available
- merged-region awareness
- sorting and filtering
- CSV export

The page must disclose that macros are not executed and that complex formatting, charts, and formula calculation are not fully reproduced.

### Grammar Checker

Introduce a strict language-support gate.

The local rule engine is initially supported for English only. Non-English pages may use localized interface copy but must clearly state that the local checker evaluates English text.

An optional advanced service may be enabled for an individual locale only when:

- existing free infrastructure is available
- locale-specific fixtures pass
- the user explicitly triggers server processing
- a local fallback remains available

The product must not imply native Russian, Spanish, German, French, Portuguese, Japanese, Korean, Arabic, or Chinese checking until that locale passes its own quality gate.

### Typing Speed Test

Add:

- 15, 30, 60, and 120 second modes
- WPM
- CPM
- accuracy
- consistency
- error heat map or equivalent error summary
- localized prompt banks
- local result history

Do not add accounts, public rankings, certificates, or cloud sync.

### Gantt Chart

Add:

- milestone tasks
- task dependencies
- client-side critical-path calculation
- JSON and CSV import/export
- local persistence
- a small set of truthful project templates
- existing PNG and SVG export

Do not add collaboration, cloud project management, resource billing, or enterprise workflows.

## Runtime and Privacy

Browser-local execution remains the default.

For optional server functionality:

- the user must actively invoke it
- the interface must state that text will be sent to the server
- user input and file contents must not be written to application logs
- inputs must not be retained after the response
- aggregate telemetry may record feature, locale, result state, latency bucket, and fallback state only
- rate limits must protect free allowances
- timeout, quota exhaustion, unavailable models, and invalid responses must produce a clear fallback path

File-processing tools remain browser-local.

## Localization

A localized interface is not evidence that a tool supports the local language.

Language support is declared separately from UI translation. Each supported locale requires fixtures for:

- correct input
- representative errors
- boundary input
- non-target-language input

Until a locale passes, its search-facing copy must describe the actual supported language.

English headings or fallback support blocks on a localized page are quality failures unless they are intentionally part of a language selector or disclosure.

## Index Readiness

The readiness evaluator combines:

- implemented capability completeness
- locale support
- content specificity
- rendered SEO consistency
- current and historical GSC demand
- technical indexability
- overlap with stronger sibling pages

It returns one of:

- keep
- improve
- merge
- noindex-candidate
- manual-review

The evaluator never changes production metadata. Missing or ambiguous evidence produces manual-review.

## Rollout

### Phase 0: Observation and Design

From 2026-07-13 until the Day 14 checkpoint, do not deploy content, product, internal-link, or indexation changes unless a live technical indexability failure is proven.

Design documents, implementation plans, tests, and non-deployed capability inventories may be prepared.

### Phase 1: Governance Foundation

Implement capability types, six pilot profiles, resolver, validators, and readiness-report interfaces.

### Phase 2: Pilot Releases

Release in this order:

1. Grammar Checker truthfulness and language gating
2. Hex Editor
3. SQL Query Optimizer
4. Excel Viewer
5. Typing Speed Test
6. Gantt Chart

Spanish chart pages that are current recovery comparison cohorts remain unchanged until the applicable GSC gate approves editing.

### Phase 3: P1 Expansion

After pilot validation, expand capability profiles and truth checks to the 95 P1 pages.

### Phase 4: Controlled Catalog Expansion

Expand by one locale or one category at a time in batches of 50 to 100 pages. Do not mix unrelated categories and locales in the same experiment.

## Testing

Every pilot requires:

1. Unit and behavior tests for actual functionality.
2. Capability-contract tests that connect profile claims to behavior tests.
3. Negative content tests for forbidden claims.
4. Locale fixtures for every declared language.
5. Rendered title, description, H1, canonical, hreflang, FAQ, HowTo, capability, and privacy checks.
6. Security and privacy tests for local processing, logging, consent, rate limits, and fallback.
7. Existing repository SEO governance and production validation.

Tests must not be removed or weakened to make a capability claim pass.

## Release Gates

Each production batch requires:

- complete pre-deploy QA
- a 48-hour technical recheck
- a 14-day equal-window GSC comparison
- a 28-day expand, hold, or rollback decision
- an unchanged comparison cohort where practical

Expand only when:

- no canonical, robots, hreflang, rendering, sitemap, or crawl regression exists
- rendered claims match implemented capabilities
- clicks are stable or increasing
- impressions increase by at least 20 percent or average position improves by at least five positions
- the result is not driven by one anomalous query
- the comparison cohort does not show the same natural movement

## Rollback

Technical regressions roll back immediately.

If SEO performance fails to improve without a technical regression, do not churn the page inside 48 hours. Wait for the complete 14-day window and then hold, refine, or roll back only that batch.

Optional server features can be disabled independently through feature flags without disabling the local tool.

Index recommendations remain reversible because they are reviewed before implementation and released in small batches.

## Ninety-Day Success Criteria

1. All six pilots have capability profiles, behavior tests, and claim validators.
2. No undisclosed localized page uses an English-only engine while claiming native-language support.
3. At least four of six pilot tools are classified as recovering or stable isolated-green-shoot.
4. The number of P1 pages receiving impressions increases by at least 25 percent from the recorded baseline.
5. Sitewide impressions grow at least 20 percent across two consecutive 14-day comparison windows.
6. At least three locales show positive movement.
7. Clicks remain stable or improve.
8. Crawled-not-indexed and Google-selected-canonical counts do not worsen.
9. Optional server features add no recurring paid API cost.
10. Recovery is not attributed to bulk tool launches or mass-produced similar copy.

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Product work obscures sitemap recovery evidence | Freeze production changes until the approved checkpoint and release one cohort at a time |
| Capability profiles drift from code | Require behavior evidence and version changes in CI |
| Free AI allowance is unreliable | Keep local baseline functionality and feature-flag the advanced path |
| Localized pages overclaim language support | Separate UI locale from engine locale and require fixtures |
| Large feature scopes delay recovery | Enforce explicit non-goals and independently releasable tool increments |
| Index pruning removes recovering pages | Produce recommendations only, require GSC evidence, and release small reversible batches |
| SEO metrics move from seasonality or noise | Preserve controls and require equal-window 14-day and 28-day comparisons |

## Approved Constraints

- Full multi-phase roadmap
- Balanced search recovery and product quality
- Hybrid local and optional server architecture
- No new paid API cost
- Existing URLs and canonicals preserved for the six pilots
- Day 14 observation freeze respected
- Small, reversible rollout batches
- User review required before implementation planning

## References

- docs/GSC_DAY7_DECISION_QUEUE_2026-07-13.md
- docs/GSC_SITEMAP_LASTMOD_RECOVERY_2026-07-13.md
- docs/GSC_TRAFFIC_CLIFF_REPORT_2026-07-01.md
- docs/superpowers/plans/2026-07-01-gsc-traffic-cliff-recovery.md
- docs/superpowers/plans/2026-07-05-gsc-p0-content-recovery-batch.md
- exports/seo/seo-geo-audit-matrix-2026-07-09.json
- exports/gsc/checkpoints/2026-07-13/raw/网页.csv
