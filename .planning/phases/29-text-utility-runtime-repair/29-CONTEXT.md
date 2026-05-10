# Phase 29: Text Utility Runtime Repair - Context

**Gathered:** 2026-05-10
**Status:** Ready for planning
**Source:** Phase 28 runtime debt inventory

<domain>

## Phase Boundary

Phase 29 repairs the text utility reference-data helpers selected by Phase 28. It should not repair validation/email/password helpers, chart colors, emoji data, database lookup data, or generic `K` constants; those are deferred to later phases or future milestones.

</domain>

<decisions>

## Implementation Decisions

### Selected Helpers

- Repair `ASCII_FONTS`, `MORSE_CODE`, `REVERSE_MORSE`, `NATO_ALPHABET`, `smallCapsMap`, `subscriptMap`, `superscriptMap`, `flipMap`, and `mirrorMap`.
- Preserve existing component imports from `src/lib/tool-stubs.ts`.
- Prefer a typed `src/lib/runtime-integrity/` module for reference data so future governance can protect it like prior runtime waves.

### Expected Behavior

- ASCII art should produce usable multi-line output for common letters, digits, and spaces.
- Morse and NATO maps should cover A-Z and 0-9 where applicable, with reverse Morse generated from the forward table.
- Small text maps should support representative letters and digits for superscript, subscript, and small-caps output.
- Flip/mirror maps should transform common Latin letters, digits, punctuation, and preserve unknown characters through existing component fallback.

### the agent's Discretion

- The exact reference dataset can be compact but must cover representative normal inputs used by tests and UI samples.
- Non-ASCII transformation characters are allowed because these tools exist to generate Unicode text variants.

</decisions>

<canonical_refs>

## Canonical References

Downstream agents MUST read these before planning or implementing.

### Phase Scope

- `.planning/REQUIREMENTS.md` — `RUNTIME-07` acceptance boundary.
- `.planning/ROADMAP.md` — Phase 29 success criteria.
- `docs/RUNTIME_HELPER_DEBT_INVENTORY.md` — selected helper evidence.

### Runtime Code

- `src/lib/tool-stubs.ts` — compatibility exports to preserve.
- `src/lib/tool-stubs-runtime.test.ts` — smoke test location and style.
- `src/lib/runtime-integrity/` — target location for typed runtime/reference helpers.
- `src/components/tools/TextToAsciiArt.svelte`
- `src/components/tools/MorseCode.svelte`
- `src/components/tools/TextToNato.svelte`
- `src/components/tools/SmallTextGenerator.svelte`
- `src/components/tools/FlipText.svelte`

</canonical_refs>

<specifics>

## Specific Ideas

- Tests should prove `HELLO` can be rendered through `ASCII_FONTS.standard`, `SOS` maps to Morse and back, `ABC` maps to Alpha/Bravo/Charlie, and common small/flip transforms produce changed output instead of echoing the original text.
- The compatibility surface should expose data objects, not force component rewrites.

</specifics>

<deferred>

## Deferred Ideas

- Email/password validation reference data is Phase 30.
- Governance updates for the repaired text helpers are Phase 31.
- Nonselected Phase 28 candidates such as `fontMappings`, `fontStyles`, `emojiData`, `defaultColors`, `K`, and `bicDatabase` stay deferred.

</deferred>

---

*Phase: 29-text-utility-runtime-repair*
*Context gathered: 2026-05-10*
