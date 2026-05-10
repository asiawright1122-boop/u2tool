# Phase 28: Runtime Helper Debt Inventory - Context

**Gathered:** 2026-05-10
**Status:** Ready for planning
**Source:** Auto-selected from v0.0.9 milestone scope and codebase scout

<domain>

## Phase Boundary

Phase 28 delivers a deterministic inventory and ranking of remaining `src/lib/tool-stubs.ts` debt. It does not repair the selected helper clusters yet; implementation repairs belong to Phases 29 and 30.

</domain>

<decisions>

## Implementation Decisions

### Inventory Shape

- The inventory must be generated from actual code, not hand-maintained notes.
- It should map imported `tool-stubs.ts` exports to consumer components, export kinds, source line numbers, placeholder signatures, and ranking inputs.
- It should classify likely false positives because simple signatures such as `return []` or `return ''` can be legitimate invalid-input fallback behavior.

### Ranking Model

- Prioritize user-visible breakage first, then import coverage, deterministic testability, and compatibility risk.
- Reference-data helpers with empty maps/arrays used directly by UI transforms are high priority because they visibly produce no output while still compiling.
- Runtime helper wrappers already delegated into `src/lib/runtime-integrity/` should be marked protected or false-positive instead of reselected.

### Output

- Write a checked-in Markdown report under `docs/` so Phase 29 and Phase 30 can cite it without rerunning exploratory scripts.
- Add a package script so the report can be regenerated deterministically.

### the agent's Discretion

- The exact script path, TypeScript parsing approach, and scoring weights can follow existing validation/report script patterns.
- The report may include top candidate tables instead of every low-risk export if the full inventory is too noisy, as long as source data counts and ranking rationale are clear.

</decisions>

<canonical_refs>

## Canonical References

Downstream agents MUST read these before planning or implementing.

### Milestone Scope

- `.planning/REQUIREMENTS.md` — v0.0.9 requirements and out-of-scope boundaries.
- `.planning/ROADMAP.md` — Phase 28 success criteria and downstream phase split.
- `.planning/PROJECT.md` — current runtime-trust decisions and project constraints.

### Runtime Surface

- `src/lib/tool-stubs.ts` — compatibility export surface to inventory.
- `src/lib/tool-stubs-runtime.test.ts` — current runtime smoke coverage pattern.
- `scripts/validation/validate-runtime-placeholder-regressions.ts` — protected-helper governance pattern and false-positive risk.
- `src/lib/runtime-integrity/` — typed runtime modules used by repaired helper clusters.

</canonical_refs>

<specifics>

## Specific Ideas

- Initial scout found empty reference-data candidates around `ASCII_FONTS`, `MORSE_CODE`, `REVERSE_MORSE`, `NATO_ALPHABET`, `subscriptMap`, `superscriptMap`, `mirrorMap`, and adjacent validation dictionaries.
- Initial scout also found false-positive candidates such as `getNextRuns`, `findClosestColor`, `calculateHash`, and `testForInjection`, where empty returns can represent invalid input or fallback behavior rather than placeholder implementation.

</specifics>

<deferred>

## Deferred Ideas

- Repairing selected text/reference-data helpers is deferred to Phase 29.
- Repairing selected validation/reference-data helpers is deferred to Phase 30.
- Expanding production gate governance for newly repaired clusters is deferred to Phase 31.

</deferred>

---

*Phase: 28-runtime-helper-debt-inventory*
*Context gathered: 2026-05-10*
