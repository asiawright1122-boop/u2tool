# Phase 31: Runtime Evidence Gate and Closeout - Context

**Gathered:** 2026-05-10
**Status:** Ready for planning
**Source:** v0.0.9 roadmap, Phase 29/30 verification, and existing runtime governance

<domain>

## Phase Boundary

Phase 31 folds the v0.0.9 inventory and reference-data repairs into runtime governance, runs the canonical production verification gate, and prepares milestone closeout evidence. It should not select or repair additional helper families unless the governance gate itself exposes a regression in the already repaired Phase 29 or Phase 30 clusters.

</domain>

<decisions>

## Implementation Decisions

### Runtime Governance

- Extend `scripts/validation/validate-runtime-placeholder-regressions.ts` so it can protect const reference-data helpers, not only function wrappers.
- Protect the Phase 29 text helpers: `ASCII_FONTS`, `MORSE_CODE`, `REVERSE_MORSE`, `NATO_ALPHABET`, `smallCapsMap`, `subscriptMap`, `superscriptMap`, `flipMap`, and `mirrorMap`.
- Protect the Phase 30 validation helpers: `commonPasswords`, `commonTypos`, `disposableDomains`, and `freeProviders`.
- The governance check must verify runtime import alias, `tool-stubs.ts` const delegation, runtime module export, and smoke-test reference for each protected const helper.

### Closeout Evidence

- Use `npm run verify:production` as the canonical closeout gate.
- Regenerate traceability and health evidence through existing scripts rather than hand-editing generated reports.
- Milestone audit should mention the initial inventory, the Phase 29/30 selected-candidate reduction, remaining deferred candidates, and the production gate result.

### the agent's Discretion

- If `verify:production` exposes an unrelated pre-existing network or production route issue, capture it in verification evidence and stop before archiving.
- If the gate passes, archive v0.0.9 using the same `.planning/milestones/` pattern as v0.0.8.

</decisions>

<canonical_refs>

## Canonical References

Downstream agents MUST read these before planning or implementing.

### Milestone Scope

- `.planning/REQUIREMENTS.md` - `OPS-12` acceptance boundary.
- `.planning/ROADMAP.md` - Phase 31 success criteria.
- `.planning/STATE.md` - current milestone state.
- `.planning/TRACEABILITY.md` - generated requirements coverage.
- `.planning/MILESTONE-AUDIT-TEMPLATE.md` - audit structure.
- `.planning/MILESTONES.md` - milestone archive index.
- `.planning/PROJECT.md` - project decision log and active milestone metadata.

### Runtime Evidence

- `scripts/validation/validate-runtime-placeholder-regressions.ts` - governance gate to extend.
- `src/lib/tool-stubs.ts` - compatibility exports to protect.
- `src/lib/tool-stubs-runtime.test.ts` - smoke coverage for protected helpers.
- `src/lib/runtime-integrity/text-reference.ts` - Phase 29 runtime module.
- `src/lib/runtime-integrity/validation-reference.ts` - Phase 30 runtime module.
- `docs/RUNTIME_HELPER_DEBT_INVENTORY.md` - v0.0.9 inventory evidence.
- `.planning/phases/29-text-utility-runtime-repair/29-VERIFICATION.md`
- `.planning/phases/30-validation-reference-data-repair/30-VERIFICATION.md`

</canonical_refs>

<specifics>

## Specific Ideas

- Model protected helpers with a `kind` field so existing function checks stay intact while const checks use `export const NAME = alias` and `export const NAME` patterns.
- Add the 13 repaired reference-data exports to the protected helper list.
- Run `npm run validate:runtime-placeholder-regressions`, `npm run qa:runtime-integrity`, and then `npm run verify:production`.
- If the production gate passes, write Phase 31 summaries, verification, milestone audit, and archive v0.0.9.

</specifics>

<deferred>

## Deferred Ideas

- Remaining inventory candidates such as `defaultColors`, `emojiData`, `fontMappings`, `fontStyles`, `K`, and `bicDatabase` stay deferred to a future ranked milestone.
- Fresh GSC/Coverage recovery remains deferred until after the v0.0.9 runtime evidence is archived.

</deferred>

---

*Phase: 31-runtime-evidence-gate-and-closeout*
*Context gathered: 2026-05-10*
