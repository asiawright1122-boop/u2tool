# Roadmap: U2Tool

## v0.0.8 Runtime Workflow Integrity Expansion

**Milestone:** v0.0.8 Runtime Workflow Integrity Expansion

This milestone resumes runtime trust work after the `v0.0.7` growth and GSC recovery cycle. The focus is the remaining deferred shared helper surface behind `src/lib/tool-stubs.ts`: replace the next user-visible placeholder-backed clusters with typed runtime-integrity modules, keep compatibility exports stable, and make the repaired behavior visible in deterministic runtime and production evidence.

Status: milestone opened on 2026-05-10. Phase numbering continues from the archived v0.0.7 milestone.

### Phase 24: Time and Scheduling Runtime Repair
**Goal**: Replace the meeting/time scheduling helper cluster behind `tool-stubs.ts` with shared runtime-integrity behavior so representative office tools compute real availability and timezone outcomes.
**Depends on**: Archived v0.0.7 baseline
**Requirements**: RUNTIME-04
**Success Criteria** (what must be TRUE):
  1. `findAvailableSlots`, `parseTimeToMinutes`, conflict parsing, timezone conversion, and time formatting behavior are implemented in typed shared runtime code and re-exported through `tool-stubs.ts`.
  2. `TimezoneMeetingScheduler` and `CalendarAvailabilityFinder` use the shared helper behavior or remain behaviorally equivalent through a documented compatibility path.
  3. Direct runtime smoke tests cover normal workday slots, overlapping busy windows, invalid time input, cross-timezone conversion, and overnight or boundary-hour cases.
**Plans**: 2 plans

Plans:
- [ ] 24-01: Map the time/scheduling helper surface and extract shared runtime behavior
- [ ] 24-02: Wire representative office tools to the repaired helpers and add behavioral smoke evidence

### Phase 25: Developer/Data Runtime Repair
**Goal**: Select and repair the next high-leverage developer/data helper family still exposed through placeholder exports, using real imports and user-visible behavior as the scope boundary.
**Depends on**: Phase 24
**Requirements**: RUNTIME-05
**Success Criteria** (what must be TRUE):
  1. Candidate helper families are ranked by actual component imports, placeholder severity, expected user output, and compatibility risk before implementation.
  2. The selected family is moved into typed shared runtime-integrity code or marked as an explicit governed exclusion with rationale.
  3. Representative consumers produce meaningful output for common examples instead of empty arrays, empty objects, zero scores, or placeholder strings.
**Plans**: 2 plans

Plans:
- [ ] 25-01: Rank remaining developer/data placeholder helper families and select the bounded repair wave
- [ ] 25-02: Implement the selected repair wave with compatibility exports and targeted tests

### Phase 26: Runtime Placeholder Governance Expansion
**Goal**: Extend deterministic runtime-placeholder governance so the v0.0.8 repaired clusters cannot silently regress to compiling shells.
**Depends on**: Phase 25
**Requirements**: OPS-10
**Success Criteria** (what must be TRUE):
  1. Placeholder detection covers the repaired helper clusters with low-noise signatures tied to real exported behavior.
  2. `npm run qa:runtime-integrity` or the canonical production gate fails if repaired helpers return the known empty fallback shapes again.
  3. Governance output points maintainers to the owning helper cluster and representative test path.
**Plans**: 2 plans

Plans:
- [ ] 26-01: Add low-noise placeholder regression signatures for repaired runtime clusters
- [ ] 26-02: Fold the new runtime evidence into the existing QA and production verification path

### Phase 27: Production Trust Revalidation and Closeout
**Goal**: Revalidate the milestone through traceability, health, and canonical production verification so runtime expansion lands without weakening existing localization, theme, SEO, discovery, or GSC safeguards.
**Depends on**: Phase 26
**Requirements**: OPS-11
**Success Criteria** (what must be TRUE):
  1. Traceability maps all v0.0.8 requirements to completed phase evidence with zero gaps.
  2. `npm run verify:production` passes after the runtime workflow expansion.
  3. Milestone audit records the repaired runtime surface, residual deferred helper risk, and any follow-up candidates for future milestones.
**Plans**: 2 plans

Plans:
- [ ] 27-01: Refresh traceability, health evidence, and runtime-integrity summaries
- [ ] 27-02: Run canonical production verification and complete the v0.0.8 audit

## Archived Milestones

- [x] v0.0.7 Organic Authority Re-Expansion
  Archive: [.planning/milestones/v0.0.7-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.7-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.7-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.7-REQUIREMENTS.md)
  Audit: [.planning/milestones/v0.0.7-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.7-MILESTONE-AUDIT.md)
  Status: shipped on 2026-05-10 with the `text` authority wave selected, promoted, governed, and followed by evidence-led GSC recovery triage.
- [x] v0.0.6 Drift Governance and Runtime Expansion
  Archive: [.planning/milestones/v0.0.6-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.6-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.6-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.6-REQUIREMENTS.md)
  Audit: [.planning/v0.0.6-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/v0.0.6-MILESTONE-AUDIT.md)
  Status: shipped on 2026-04-06 with curl/codegen runtime expansion, representative rendered drift governance, shared theme-contract hardening, and explicit rendered/theme release evidence in the canonical production gate complete.
- [x] v0.0.5 Runtime Integrity and Performance Trust
  Archive: [.planning/milestones/v0.0.5-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.5-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.5-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.5-REQUIREMENTS.md)
  Audit: [.planning/v0.0.5-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/v0.0.5-MILESTONE-AUDIT.md)
  Status: shipped on 2026-04-04 with browse-shell performance hardening, representative runtime-integrity repair, and anti-corruption guardrails complete.
- [x] v0.0.4 Intent Depth and Citation Consolidation
  Archive: [.planning/milestones/v0.0.4-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.4-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.4-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.4-REQUIREMENTS.md)
  Audit: [.planning/v0.0.4-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/v0.0.4-MILESTONE-AUDIT.md)
  Status: shipped on 2026-04-04 with third-wave authority expansion, discovery-priority consolidation, and canonical production verification complete.
- [x] v0.0.3 Authority Coverage Expansion
  Archive: [.planning/milestones/v0.0.3-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.3-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.3-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.3-REQUIREMENTS.md)
  Audit: [.planning/v0.0.3-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/v0.0.3-MILESTONE-AUDIT.md)
  Status: shipped on 2026-04-02 with second-wave authority coverage, comparison discovery, and release-health traceability hardening complete.
- [x] v0.0.2 Search Trust Expansion
  Archive: [.planning/milestones/v0.0.2-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.2-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.2-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.2-REQUIREMENTS.md)
  Audit: [.planning/v0.0.2-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/v0.0.2-MILESTONE-AUDIT.md)
  Status: shipped on 2026-04-02 with rendered SEO verification, long-tail topical authority expansion, and AI / GEO discovery governance complete.
- [x] v0.0.1 Quality Hardening Baseline
  Archive: [.planning/milestones/v0.0.1-ROADMAP.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.1-ROADMAP.md)
  Requirements: [.planning/milestones/v0.0.1-REQUIREMENTS.md](/Users/kaka/Dev/u2tool/.planning/milestones/v0.0.1-REQUIREMENTS.md)
  Audit: [.planning/v0.0.1-MILESTONE-AUDIT.md](/Users/kaka/Dev/u2tool/.planning/v0.0.1-MILESTONE-AUDIT.md)
  Status: shipped on 2026-04-02 with localization, theme, SEO governance, and technical SEO hardening complete.
