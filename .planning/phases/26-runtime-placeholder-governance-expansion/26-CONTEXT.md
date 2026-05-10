# Phase 26: Runtime Placeholder Governance Expansion - Context

**Gathered:** 2026-05-10
**Status:** Ready for planning and execution
**Mode:** Auto-selected from roadmap, requirements, and code evidence

<domain>
## Phase Boundary

Extend deterministic runtime-placeholder governance so the v0.0.8 repaired helper clusters cannot silently regress to compiling shells.

</domain>

<decisions>
## Implementation Decisions

### Governance target
- **D-01:** Phase 26 should restore the existing `_deprecated` runtime placeholder validator into the active validation path instead of inventing a second audit model.
- **D-02:** The protected helper list must include prior runtime-integrity helpers plus the v0.0.8 scheduling and code-analysis helpers.
- **D-03:** The validator should check the public `tool-stubs.ts` seam, the owning runtime-integrity modules, and `src/lib/tool-stubs-runtime.test.ts` smoke coverage.

### Release-gate integration
- **D-04:** Restore or create `npm run qa:runtime-integrity` as the focused runtime smoke entrypoint.
- **D-05:** Add `npm run validate:runtime-placeholder-regressions` and include both runtime commands in `qa:production` so `npm run verify:production` inherits the governance.
- **D-06:** Keep the validator low-noise by protecting only helpers that have already been repaired and tested.

### The Agent's Discretion
- Exact ordering of package scripts inside `qa:production`, as long as runtime integrity runs before release success.
- Whether the active validator is copied from `_deprecated` or moved, as long as the deprecated archive remains understandable.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `scripts/validation/_deprecated/validate-runtime-placeholder-regressions.ts`
- `scripts/validation/README.md`
- `src/lib/tool-stubs.ts`
- `src/lib/tool-stubs-runtime.test.ts`
- `src/lib/runtime-integrity/scheduling.ts`
- `src/lib/runtime-integrity/code-analysis.ts`
- `package.json`

</canonical_refs>

<code_context>
## Existing Code Insights

- A purpose-built runtime placeholder validator already exists under `_deprecated`.
- `package.json` currently lacks `qa:runtime-integrity` and `validate:runtime-placeholder-regressions`, despite prior planning artifacts referring to those gates.
- The current production gate runs `qa:production` before reporting/traceability/health, so adding runtime governance there makes `verify:production` inherit the failure mode.

</code_context>

<deferred>
## Deferred Ideas

- Expanding governance to unrepaired placeholder helpers.
- Reintroducing the old Svelte corruption validator, which remains superseded by `astro check` unless a concrete regression returns.

</deferred>

---

*Phase: 26-runtime-placeholder-governance-expansion*
*Context gathered: 2026-05-10*
