# Roadmap: U2Tool

## v0.0.10 GSC Evidence Intake and High-Value URL Recovery

**Milestone:** v0.0.10 GSC Evidence Intake and High-Value URL Recovery

This milestone resumes natural-search recovery after `v0.0.9` closed the runtime debt cycle. The focus is to stop treating GSC validation as a single giant button: use the existing Coverage drilldown and Performance exports to identify which URL groups should not be validated, which technical blockers need code fixes first, and which high-value tool pages deserve content/internal-link recovery and individual request-indexing treatment.

Status: milestone opened on 2026-05-11 from existing GSC exports. Baseline reports regenerated as `docs/GSC_DRILLDOWN_URL_REPORT_2026-05-11.md` and `docs/GSC_PERFORMANCE_RECOVERY_REPORT_2026-05-11.md`.

### Phase 32: GSC Validation Action Matrix
**Goal**: Convert existing GSC Coverage and Performance exports into a deterministic validation action matrix that explains why previous broad validation attempts failed and what should be validated next.
**Depends on**: Archived v0.0.9 baseline
**Requirements**: GSC-13
**Status**: Complete on 2026-05-11 with `docs/GSC_VALIDATION_ACTION_MATRIX_2026-05-11.md` and `docs/GSC_VALIDATION_PLAYBOOK_2026-05-11.md`.
**Success Criteria** (what must be TRUE):
  1. Existing GSC exports are checked and regenerated into current baseline reports.
  2. URL groups are labeled as `do-not-validate`, `fix-before-validate`, `request-indexing-after-enhancement`, or `monitor`.
  3. The action matrix includes exact examples and user-facing guidance for which GSC rows to leave alone versus retry.
**Plans**: 2 plans

Plans:
- [x] 32-01: Generate the GSC validation action matrix from existing exports
- [x] 32-02: Document the validation/request-indexing playbook for the current GSC state

### Phase 33: Technical URL Blocker Repair
**Goal**: Fix only high-confidence technical blockers that prevent indexable pages from passing live inspection, while marking expected exclusions as intentional.
**Depends on**: Phase 32
**Requirements**: GSC-14
**Success Criteria** (what must be TRUE):
  1. True 4xx/noindex/robots/5xx blockers on indexable pages are live-checked and patched when the repository owns the issue.
  2. Expected exclusions such as stale build assets, canonical alternates, redirects, and query-parameter variants are documented as not worth validation.
  3. Internal-link and search-engine compliance checks remain green after any redirect/canonical/sitemap changes.
**Plans**: 2 plans

Plans:
- [ ] 33-01: Live-check high-confidence technical blocker samples and classify fixability
- [ ] 33-02: Patch owned URL-shape defects and verify canonical/internal-link gates

### Phase 34: High-Value Tool Detail Recovery
**Goal**: Prioritize and repair the highest-value tool-detail recovery candidates using Performance evidence rather than broad catalog rewrites.
**Depends on**: Phase 33
**Requirements**: GSC-15
**Success Criteria** (what must be TRUE):
  1. Candidate pages are ranked by lost clicks, lost impressions, current indexability, content mismatch, and internal-link opportunity.
  2. Only selected high-value pages receive content/runtime/internal-link fixes.
  3. Rendered SEO and content-trust checks cover each edited page.
**Plans**: 2 plans

Plans:
- [ ] 34-01: Rank high-value `tool-detail` recovery candidates from Performance evidence
- [ ] 34-02: Patch the selected recovery slice with rendered/content-trust evidence

### Phase 35: GSC Recovery Evidence Gate and Closeout
**Goal**: Fold the GSC action matrix and selected fixes into production verification and close the milestone with clear next validation instructions.
**Depends on**: Phase 34
**Requirements**: OPS-13
**Success Criteria** (what must be TRUE):
  1. Production verification passes after GSC recovery changes.
  2. Traceability, health, and milestone audit artifacts reflect which GSC validation groups are ready for retry.
  3. The final playbook tells the user exactly which GSC issue rows to validate, which URLs to request indexing for, and which rows to monitor without clicking validate.
**Plans**: 2 plans

Plans:
- [ ] 35-01: Extend evidence gates for the GSC recovery slice
- [ ] 35-02: Run production verification and complete GSC recovery closeout

## Archived Milestones

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
