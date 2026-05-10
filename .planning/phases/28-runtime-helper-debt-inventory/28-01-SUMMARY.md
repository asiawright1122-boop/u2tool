# 28-01 Summary: Runtime Debt Inventory Report

## Outcome

Added a deterministic runtime helper debt inventory report generated from actual `tool-stubs.ts` exports and component imports.

## Changes

- Added [`scripts/validation/generate-runtime-debt-inventory.ts`](/Users/kaka/Dev/u2tool/scripts/validation/generate-runtime-debt-inventory.ts).
- Added `report:runtime-debt` to [`package.json`](/Users/kaka/Dev/u2tool/package.json).
- Updated [`scripts/validation/README.md`](/Users/kaka/Dev/u2tool/scripts/validation/README.md).
- Generated [`docs/RUNTIME_HELPER_DEBT_INVENTORY.md`](/Users/kaka/Dev/u2tool/docs/RUNTIME_HELPER_DEBT_INVENTORY.md).

## Evidence

- `npm run report:runtime-debt` passed.
- The report scanned `246` imported compatibility exports and identified `19` likely broken imported exports.
- The report separated `73` protected or likely false-positive exports from likely repair candidates.

## Notes

- The script intentionally distinguishes invalid-input fallback returns from empty reference data used directly by UI transformations.
