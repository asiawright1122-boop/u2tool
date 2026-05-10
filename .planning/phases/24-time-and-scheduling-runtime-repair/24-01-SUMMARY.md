# 24-01 Summary: Shared Scheduling Runtime Extraction

## Outcome

Added a typed shared scheduling runtime module and reconnected the selected `tool-stubs.ts` exports to real behavior instead of placeholder returns.

## Changes

- Added [`src/lib/runtime-integrity/scheduling.ts`](/Users/kaka/Dev/u2tool/src/lib/runtime-integrity/scheduling.ts) with parsing, formatting, conflict parsing, busy-slot merging, availability calculation, and source-aware timezone conversion helpers.
- Updated [`src/lib/tool-stubs.ts`](/Users/kaka/Dev/u2tool/src/lib/tool-stubs.ts) so `convertTime`, `findAvailableSlots`, `formatHour`, `formatMinutesToTime`, `parseConflicts`, and `parseTimeToMinutes` delegate to the shared runtime module.
- Added a compatibility export for `mergeBusySlots` so representative office tools can use the same shared behavior without importing directly from the runtime module.

## Evidence

- `npx vitest run src/lib/tool-stubs-runtime.test.ts` passed.
- `npm run check` passed with `0 errors`, `0 warnings`, and `0 hints`.
- `npm run build` passed.

## Notes

- `convertTime` now accepts an optional reference date for deterministic tests while preserving the existing three-argument component call shape.
- The compatibility seam remains intentionally permissive because historical `tool-stubs.ts` consumers pass mixed runtime shapes.
