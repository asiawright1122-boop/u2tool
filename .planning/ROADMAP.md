# Roadmap: U2Tool

## v0.0.11 Runtime Helper Debt Liquidation and Cryptographic Toolbox Shaking

**Milestone:** v0.0.11 Runtime Helper Debt Liquidation and Cryptographic Toolbox Shaking

This milestone focuses on completely clearing out the remaining legacy imports in `src/lib/tool-stubs.ts` to achieve 100% runtime integrity, and designing & building the 4th flagship interaction utility in our Obsidian Gold series: the matte private-banking styled "Developer Cryptographic & Hash Toolbox" (slug: `developer-cryptography-toolbox`).

Status: milestone opened on 2026-06-02.

### Phase 36: Residual Runtime Stub Liquidation
**Goal**: Reposition and repair the remaining compatibility exports inside `src/lib/tool-stubs.ts` (`defaultColors`, `emojiData`, `fontMappings`, `fontStyles`, `K`, and `bicDatabase`) into fully typed reference data under `src/lib/runtime-integrity/`.
**Depends on**: Shipped v0.0.10 baseline
**Requirements**: RUNTIME-09
**Status**: Open
**Success Criteria** (what must be TRUE):
  1. All 6 legacy stubs are migrated to proper ES modules with real typed data.
  2. Consumer components importing these helpers execute genuine data rather than falling back to empty stubs.
  3. No placeholder regressions or TypeScript validation errors.
**Plans**: 2 plans

Plans:
- [ ] 36-01: Migrating font, color, and constant stubs to runtime-integrity references
- [ ] 36-02: Migrating bank database and emoji stubs with runtime smoke validation

### Phase 37: Developer Cryptographic Flagship Design
**Goal**: Design the schema, UX flow, and rigorous 10-locale translation keys (including character constraints for titles/descriptions) for the premium Cryptographic & Hash Toolbox.
**Depends on**: Phase 36
**Requirements**: CRYPTO-01
**Status**: Open
**Success Criteria** (what must be TRUE):
  1. Complete translation files established in `src/messages/[locale]/tools/developer-cryptography-toolbox.json`.
  2. Character density metrics strictly satisfy [70, 100] for CJK TDK and [120, 160] for phonetic strings with zero hardcoded English leaks.
  3. Design specification signed off.
**Plans**: 2 plans

Plans:
- [ ] 37-01: Define cryptographic localized copy and exact schema tokens
- [ ] 37-02: Create routing mapping and ToolImportMap loader registry

### Phase 38: Obsidian Matte Premium Implementation
**Goal**: Build the Svelte 5 interactive cryptography island displaying high-signal hash conversions, symmetric/asymmetric demos, performance micro-benchmarks, and matte dark-gold luxury styling.
**Depends on**: Phase 37
**Requirements**: CRYPTO-02
**Status**: Open
**Success Criteria** (what must be TRUE):
  1. The new tool `src/components/tools/DeveloperCryptographicToolbox.svelte` compiles perfectly in Svelte 5.
  2. Premium UX incorporates smooth animations, microsecond-level benchmarking, and interactive state indicators.
  3. Dark mode behaves flawlessly and remains synchronized with active site parameters.
**Plans**: 2 plans

Plans:
- [ ] 38-01: Build the core algorithms and reactive state machines in Svelte 5
- [ ] 38-02: Implement Swiss banking premium dark-gold UX styling and interactive charts

### Phase 39: Production Release Gate & QA Enforcement
**Goal**: Verify sitemap inclusion, cross-origin/SSR safety under Astro 6, full QA sitemap crawlers, and run complete test coverage for the cryptography integration.
**Depends on**: Phase 38
**Requirements**: OPS-14
**Status**: Open
**Success Criteria** (what must be TRUE):
  1. All 183+ test cases pass and the sitemap validator successfully parses `/sitemap.xml`.
  2. Project health returns `🟢 EXCELLENT`.
  3. Commit atomic packages with proper Git traceability annotations.
**Plans**: 2 plans

Plans:
- [ ] 39-01: Implement Vitest and E2E validation scenarios for the cryptographic toolbox
- [ ] 39-02: Run full verify:production gate and publish release evidence

## Archived Milestones

- [x] v0.0.10 GSC Evidence Intake and High-Value URL Recovery
  Archive: [.planning/milestones/v0.0.10-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.10-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.10-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.10-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.10-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.10-MILESTONE-AUDIT.md)
  Status: Shipped on 2026-06-02. Delivered targeted GSC validation playbooks, recovered Hex Editor Detail page, launched the pension optimizer and net-worth portfolio trackers with 10-locale constraints, and resolved Astro 6 SSR Cloudflare sitemap path checks.
- [x] v0.0.9 Runtime Debt Prioritization and Text Utility Repair
  Archive: [.planning/milestones/v0.0.9-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.9-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.9-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.9-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.9-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.9-MILESTONE-AUDIT.md)
  Status: shipped on 2026-05-11 with runtime debt inventory, text and validation reference-data repairs, const-helper governance, and canonical production verification complete.
- [x] v0.0.8 Runtime Workflow Integrity Expansion
  Archive: [.planning/milestones/v0.0.8-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.8-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.8-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.8-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.8-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.8-MILESTONE-AUDIT.md)
  Status: shipped on 2026-05-10 with scheduling and code-analysis runtime helper repairs plus runtime-placeholder governance.
- [x] v0.0.7 Organic Authority Re-Expansion
  Archive: [.planning/milestones/v0.0.7-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.7-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.7-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.7-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.7-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.7-MILESTONE-AUDIT.md)
  Status: shipped on 2026-05-10 with the `text` authority wave selected, promoted, governed, and followed by evidence-led GSC recovery triage.
