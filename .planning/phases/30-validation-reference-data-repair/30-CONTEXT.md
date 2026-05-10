# Phase 30: Validation Reference Data Repair - Context

**Gathered:** 2026-05-10
**Status:** Ready for planning
**Source:** Phase 28 runtime debt inventory and Phase 29 repair pattern

<domain>

## Phase Boundary

Phase 30 repairs the validation/reference-data helpers selected by the runtime debt inventory. It should not repair unrelated text, emoji, chart, database, finance, or generic helper placeholders. It should preserve current component imports from `src/lib/tool-stubs.ts` and land meaningful data in a typed `src/lib/runtime-integrity/` module.

</domain>

<decisions>

## Implementation Decisions

### Selected Helpers

- Repair `commonPasswords`, `commonTypos`, `disposableDomains`, and `freeProviders`.
- Preserve `PasswordStrength.svelte` and `EmailValidator.svelte` imports from `@/lib/tool-stubs` unless a local compatibility issue forces a narrowly scoped adjustment.
- Prefer `src/lib/runtime-integrity/validation-reference.ts` for the selected reference data, mirroring the Phase 29 `text-reference.ts` pattern.

### Expected Behavior

- `commonPasswords` must include representative high-risk passwords such as `password`, `123456`, `qwerty`, `admin`, `letmein`, and `password123` so common-password penalties actually trigger.
- `commonTypos` must include representative provider typo corrections such as `gamil.com -> gmail.com`, `gmial.com -> gmail.com`, `hotmial.com -> hotmail.com`, `yaho.com -> yahoo.com`, and `outlok.com -> outlook.com`.
- `freeProviders` must include common consumer email providers such as `gmail.com`, `yahoo.com`, `hotmail.com`, `outlook.com`, `icloud.com`, and `proton.me`.
- `disposableDomains` must include representative disposable providers such as `mailinator.com`, `10minutemail.com`, `guerrillamail.com`, `tempmail.com`, and `yopmail.com`.

### the agent's Discretion

- The exact lists can stay compact and deterministic; this is a runtime repair, not a complete threat-intelligence feed.
- Tests should assert representative membership and the behavior implied by current component logic rather than requiring browser interaction.

</decisions>

<canonical_refs>

## Canonical References

Downstream agents MUST read these before planning or implementing.

### Phase Scope

- `.planning/REQUIREMENTS.md` - `RUNTIME-08` acceptance boundary.
- `.planning/ROADMAP.md` - Phase 30 success criteria.
- `docs/RUNTIME_HELPER_DEBT_INVENTORY.md` - selected helper evidence.
- `.planning/phases/29-text-utility-runtime-repair/29-CONTEXT.md` - immediately preceding runtime-reference repair pattern.

### Runtime Code

- `src/lib/tool-stubs.ts` - compatibility exports to preserve.
- `src/lib/tool-stubs-runtime.test.ts` - smoke test location and style.
- `src/lib/runtime-integrity/text-reference.ts` - Phase 29 typed reference-data pattern.
- `src/components/tools/PasswordStrength.svelte` - `commonPasswords` consumer.
- `src/components/tools/EmailValidator.svelte` - `commonTypos`, `disposableDomains`, and `freeProviders` consumer.

</canonical_refs>

<specifics>

## Specific Ideas

- Add `src/lib/runtime-integrity/validation-reference.ts` exporting typed arrays/maps for the selected helpers.
- Delegate the four compatibility constants in `src/lib/tool-stubs.ts` to the new runtime-integrity module.
- Extend `src/lib/tool-stubs-runtime.test.ts` to prove common-password, typo-suggestion, free-provider, and disposable-domain cases using current component semantics.
- Regenerate `docs/RUNTIME_HELPER_DEBT_INVENTORY.md`; the selected Phase 30 candidates should no longer remain likely broken.

</specifics>

<deferred>

## Deferred Ideas

- Governance updates for the repaired validation helpers are Phase 31.
- Nonselected candidates such as `defaultColors`, `emojiData`, `fontMappings`, `fontStyles`, `K`, and `bicDatabase` stay deferred.
- A full disposable-domain/provider threat feed is out of scope for this milestone.

</deferred>

---

*Phase: 30-validation-reference-data-repair*
*Context gathered: 2026-05-10*
