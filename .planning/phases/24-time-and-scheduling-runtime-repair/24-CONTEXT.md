# Phase 24: Time and Scheduling Runtime Repair - Context

**Gathered:** 2026-05-10
**Status:** Ready for planning and execution
**Mode:** Auto-selected from roadmap, requirements, and code evidence

<domain>
## Phase Boundary

Repair the meeting/time scheduling helper cluster behind `src/lib/tool-stubs.ts` so representative office tools compute real timezone, working-hour, availability, and conflict behavior from shared runtime-integrity helpers.

</domain>

<decisions>
## Implementation Decisions

### Cluster-selection strategy
- **D-01:** Phase 24 targets the office time/scheduling family first because `findAvailableSlots`, `parseConflicts`, and `parseTimeToMinutes` are still empty exported helpers, while `TimezoneMeetingScheduler.svelte` and `CalendarAvailabilityFinder.svelte` show direct user-facing behavior in this cluster.
- **D-02:** The phase should not broaden into cron/month-run scheduling, room booking, or the next developer/data helper wave; those remain Phase 25+ scope unless a tiny compatibility fix is required to keep this cluster usable.

### Shared-helper strategy
- **D-03:** New scheduling logic should live in a typed `src/lib/runtime-integrity/scheduling.ts` module and flow back through `src/lib/tool-stubs.ts` as the compatibility seam.
- **D-04:** Existing export shapes should stay stable: `TIMEZONES` remains an array of `{ value, label }`, `convertTime` remains string-in/string-out, and availability helpers should stay non-throwing for invalid or partial input.
- **D-05:** Component-local algorithms in `CalendarAvailabilityFinder.svelte` can be extracted or mirrored into shared helpers, but UI layout and copy should remain out of scope.

### Timezone and boundary behavior
- **D-06:** `convertTime(time, fromTz, toTz)` must respect both source and target time zones. The current implementation effectively ignores `fromTz` by creating a local `Date` and only formatting with `toTz`.
- **D-07:** Time parsing should return numeric minutes for valid `HH:mm` and hour-only values, clamp/normalize display helpers predictably, and return a safe invalid value rather than `{}`.
- **D-08:** Availability calculations should merge overlapping busy windows, clip busy slots to the work window, and support minimum-duration filtering without throwing on empty people or invalid work-hour input.

### Evidence strategy
- **D-09:** Runtime trust claims for this phase require direct smoke tests in `src/lib/tool-stubs-runtime.test.ts` against the public `tool-stubs.ts` export surface.
- **D-10:** Validation should use targeted Vitest runs first. If the historical `qa:runtime-integrity` script is absent in `package.json`, Phase 24 may rely on `npx vitest run src/lib/tool-stubs-runtime.test.ts` and leave script restoration/governance to Phase 26.

### The Agent's Discretion
- Exact type names and internal helper decomposition inside `runtime-integrity/scheduling.ts`.
- Whether `CalendarAvailabilityFinder.svelte` imports shared helpers immediately or keeps local wrappers that delegate to shared functions, as long as behavior is covered and duplication is reduced.
- Whether `TimezoneMeetingScheduler.svelte` keeps its scoring loop locally or delegates to a shared slot-scoring helper, as long as timezone conversion and formatting come from the repaired shared behavior.

</decisions>

<specifics>
## Specific Ideas

- Add `parseTimeToMinutes`, `formatMinutesToTime`, `formatHour`, `mergeBusySlots`, `findAvailableSlots`, `parseConflicts`, and `convertTime` to `src/lib/runtime-integrity/scheduling.ts`.
- Re-export those helpers from `src/lib/tool-stubs.ts`, replacing the current empty function bodies.
- Use `Intl.DateTimeFormat` with `timeZoneName: 'shortOffset'` or equivalent offset extraction to convert a wall-clock time from the source timezone into a target timezone without adding a heavy date-time dependency.
- Seed tests with a normal workday (`09:00` to `17:00`), overlapping busy slots, invalid inputs, boundary values (`24:00`, negative/fractional hours), and a known cross-timezone conversion such as `09:00 America/New_York` to `Europe/London`.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone and phase scope
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/PROJECT.md`
- `.planning/STATE.md`

### Runtime-integrity patterns
- `src/lib/runtime-integrity/calculators.ts`
- `src/lib/runtime-integrity/curl.ts`
- `src/lib/runtime-integrity/object.ts`
- `src/lib/runtime-integrity/sql.ts`
- `src/lib/tool-stubs-runtime.test.ts`

### Selected helper surface
- `src/lib/tool-stubs.ts`
- `src/components/tools/TimezoneMeetingScheduler.svelte`
- `src/components/tools/CalendarAvailabilityFinder.svelte`
- `src/components/tools/BatchTimestampConverter.svelte`
- `src/components/tools/WorldClock.svelte`
- `package.json`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `CalendarAvailabilityFinder.svelte` already contains local `parseTimeToMinutes`, `formatMinutesToTime`, `mergeBusySlots`, and `findAvailableSlots` implementations that can anchor the shared availability behavior.
- `TimezoneMeetingScheduler.svelte` already uses the shared `TIMEZONES`, `convertTime`, and `formatHour` exports, making it a direct smoke target for timezone and formatting repairs.
- Prior runtime repairs use typed modules under `src/lib/runtime-integrity/` and keep `src/lib/tool-stubs.ts` as the public compatibility layer.

### Current Failure Signals
- `src/lib/tool-stubs.ts` currently exports `findAvailableSlots() { return []; }`, `parseConflicts() { return {}; }`, `parseTimeToMinutes() { return {}; }`, and `formatMinutesToTime() { return ''; }`.
- `convertTime(time, fromTz, toTz)` currently catches errors but does not use `fromTz` to interpret the source wall-clock time.
- `formatHour(hour)` currently string-pads raw input and can produce unnormalized values for negative, fractional, or overflow hours.
- `package.json` does not currently expose the historical `qa:runtime-integrity` script mentioned by prior planning artifacts, so Phase 24 verification should call Vitest directly unless the script is restored in-scope.

### Integration Points
- `src/lib/tool-stubs.ts` should import the new scheduling helpers near the existing runtime-integrity imports and delegate the selected exports.
- `src/lib/tool-stubs-runtime.test.ts` is the stable smoke-test surface for public helper behavior.
- Svelte component changes, if needed, should be limited to replacing duplicated helper logic with shared imports and preserving current UI behavior.

</code_context>

<deferred>
## Deferred Ideas

- Cron parsing, calendar month-run expansion, and recurring schedule explanation.
- Meeting room availability logic beyond the selected time/participant helper cluster.
- Developer/data helper wave selection and repair, which belongs to Phase 25.
- Restoring broad runtime-placeholder validator scripts, which belongs to Phase 26 unless needed for local verification.

</deferred>

---

*Phase: 24-time-and-scheduling-runtime-repair*
*Context gathered: 2026-05-10*
