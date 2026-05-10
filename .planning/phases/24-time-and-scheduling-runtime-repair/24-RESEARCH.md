# 24 Research

## Question

How should Phase 24 repair the time and scheduling helper cluster while preserving the existing `tool-stubs.ts` compatibility surface?

## Findings

### The selected helper family has direct user-visible placeholder behavior

- `findAvailableSlots` returns an empty array, so any consumer that expects shared availability calculation would silently show no results.
- `parseConflicts` returns an empty object, which is not a meaningful conflict list or summary shape.
- `parseTimeToMinutes` returns an object instead of a number, creating a high-risk public helper contract.
- `formatMinutesToTime` returns an empty string, and `formatHour` only string-pads raw values without normalization.

### Representative tools already define the desired behavior

- `CalendarAvailabilityFinder.svelte` contains a practical local algorithm: parse `HH:mm`, merge overlapping busy slots, clip to work hours, and emit free windows that meet a minimum duration.
- `TimezoneMeetingScheduler.svelte` already depends on shared `TIMEZONES`, `convertTime`, and `formatHour`, so it will benefit immediately from repairing those exports.
- `BatchTimestampConverter.svelte` also imports `TIMEZONES`; preserving the `{ value, label }` array shape is important.

### The core timezone bug is semantic, not a missing dependency

- The current `convertTime` creates a `Date` in the user's local environment and formats it in the target timezone, which ignores the source timezone argument.
- A dependency-free repair can use `Intl.DateTimeFormat` to derive timezone offsets for a chosen date and translate a source wall-clock minute into a target wall-clock minute.
- The helper should stay deterministic enough for tests by allowing an optional reference date internally or using a fixed noon UTC anchor for offset calculation.

### Existing runtime-integrity patterns are still the right fit

- Prior repaired clusters live in `src/lib/runtime-integrity/{token,object,calculators,curl,sql}.ts`.
- `src/lib/tool-stubs.ts` imports those implementations and keeps existing consumers stable.
- `src/lib/tool-stubs-runtime.test.ts` already exercises public exports and is the right place to add scheduling smoke cases.

## Recommended Phase 24 Shape

- Add `src/lib/runtime-integrity/scheduling.ts` with typed helpers for time parsing/formatting, busy-slot merging, availability calculation, conflict parsing, and timezone conversion.
- Delegate the selected `tool-stubs.ts` exports to that module without changing the exported names.
- Reduce component-local duplication only where it is low-risk and clearly improves the representative tools.
- Add direct tests for parsing, formatting, availability, conflicts, and timezone conversion through `src/lib/tool-stubs.ts`.

## Risks

- Timezone conversion can become flaky if tests depend on the current date near daylight-saving transitions. Tests should use stable zones and/or a fixed reference date if the helper supports it.
- A too-large component refactor would turn this runtime repair into UI churn. Keep component edits narrow.
- Broadening into cron or room booking would weaken the phase boundary and delay the highest-confidence repair.

## Recommendation

Execute Phase 24 in two parts: first add the shared scheduling module and compatibility exports, then wire representative office tools and extend smoke tests. Keep validation targeted at `src/lib/tool-stubs-runtime.test.ts`, `npm run check`, and build-level verification after implementation.

## Validation Notes

- `npx vitest run src/lib/tool-stubs-runtime.test.ts`
- `npm run check`
- `npm run build`
