# Runtime Helper Debt Inventory

Generated: 2026-05-10T15:37:27.016Z

## Summary

- Imported compatibility exports scanned: 246
- Likely broken imported exports: 6
- Protected or likely false-positive exports: 73
- Selected Phase 29 text/reference candidates still likely broken: 0
- Selected Phase 30 validation/reference candidates still likely broken: 0

## Top Repair Candidates

| Rank | Export | Category | Score | Signatures | Consumers | Notes |
| --- | --- | --- | ---: | --- | ---: | --- |
| 1 | `defaultColors` | text-reference | 60 | empty-array-const | 1 | - |
| 2 | `emojiData` | text-reference | 60 | empty-array-const | 1 | - |
| 3 | `fontMappings` | text-reference | 60 | empty-object-const | 1 | - |
| 4 | `fontStyles` | text-reference | 60 | empty-array-const | 1 | - |
| 5 | `K` | general | 54 | empty-array-const | 5 | - |
| 6 | `bicDatabase` | database-developer | 42 | empty-object-const | 1 | - |

## Recommended v0.0.9 Waves

### Phase 29 Text Utility Reference Data

- No selected Phase 29 text utility candidates remain likely broken. Nonselected text/reference candidates may still appear in the top repair table.

### Phase 30 Validation Reference Data

- No selected Phase 30 validation/reference candidates remain likely broken. Nonselected validation candidates may still appear in the top repair table.

## False Positives and Protected Helpers

| Rank | Export | Category | Score | Signatures | Consumers | Notes |
| --- | --- | --- | ---: | --- | ---: | --- |
| 1 | `formatJson` | general | 0 | - | 2 | covered by runtime-integrity delegation or placeholder validator |
| 2 | `generateGo` | general | 0 | - | 2 | covered by runtime-integrity delegation or placeholder validator |
| 3 | `generatePython` | general | 0 | - | 2 | covered by runtime-integrity delegation or placeholder validator |
| 4 | `getNextRuns` | general | 7 | return-empty-array, empty-array-const | 2 | empty return appears to be guarded invalid-input fallback |
| 5 | `sortObject` | general | 0 | - | 2 | covered by runtime-integrity delegation or placeholder validator |
| 6 | `analyzeComplexity` | general | 0 | - | 1 | covered by runtime-integrity delegation or placeholder validator |
| 7 | `analyzeDeadCode` | general | 0 | - | 1 | covered by runtime-integrity delegation or placeholder validator |
| 8 | `analyzePerformance` | general | 0 | - | 1 | covered by runtime-integrity delegation or placeholder validator |
| 9 | `base64UrlEncode` | general | 0 | - | 1 | covered by runtime-integrity delegation or placeholder validator |
| 10 | `calculate` | general | 6 | return-zero | 1 | empty return appears to be guarded invalid-input fallback |
| 11 | `calculateBreakEven` | general | 0 | - | 1 | covered by runtime-integrity delegation or placeholder validator |
| 12 | `calculateCapacity` | general | 0 | - | 1 | covered by runtime-integrity delegation or placeholder validator |
| 13 | `calculateHash` | general | 6 | return-empty-string | 1 | empty return appears to be guarded invalid-input fallback |
| 14 | `calculateMD5` | general | 6 | return-empty-string | 1 | empty return appears to be guarded invalid-input fallback |
| 15 | `calculateStats` | general | 0 | - | 1 | covered by runtime-integrity delegation or placeholder validator |
| 16 | `checkVulnerabilities` | validation-reference | 6 | empty-array-const | 1 | empty return appears to be guarded invalid-input fallback |
| 17 | `convertTime` | time-scheduling | 0 | - | 1 | covered by runtime-integrity delegation or placeholder validator |
| 18 | `decodeJwt` | general | 0 | - | 1 | covered by runtime-integrity delegation or placeholder validator |
| 19 | `detectMemoryLeaks` | general | 6 | empty-array-const | 1 | empty return appears to be guarded invalid-input fallback |
| 20 | `extractHeadings` | general | 6 | empty-array-const | 1 | empty return appears to be guarded invalid-input fallback |
| 21 | `findAvailableSlots` | general | 0 | - | 1 | covered by runtime-integrity delegation or placeholder validator |
| 22 | `findClosestColor` | text-reference | 6 | return-empty-array | 1 | empty return appears to be guarded invalid-input fallback |
| 23 | `findUnusedImports` | general | 6 | empty-array-const | 1 | empty return appears to be guarded invalid-input fallback |
| 24 | `formatDate` | time-scheduling | 6 | return-empty-string | 1 | empty return appears to be guarded invalid-input fallback |
| 25 | `formatHour` | general | 0 | - | 1 | covered by runtime-integrity delegation or placeholder validator |
| 26 | `formatMinutesToTime` | time-scheduling | 0 | - | 1 | covered by runtime-integrity delegation or placeholder validator |
| 27 | `formatNumber` | general | 6 | return-empty-string | 1 | empty return appears to be guarded invalid-input fallback |
| 28 | `formatSql` | database-developer | 0 | - | 1 | covered by runtime-integrity delegation or placeholder validator |
| 29 | `formatTime` | time-scheduling | 6 | return-empty-string | 1 | empty return appears to be guarded invalid-input fallback |
| 30 | `formatXml` | general | 6 | return-empty-string | 1 | empty return appears to be guarded invalid-input fallback |

## Ranking Notes

- Empty maps and arrays used by text transformation tools rank highly because they make the UI produce no useful output while still compiling.
- Functions with empty invalid-input fallbacks are separated from likely broken helpers when they also contain meaningful returns.
- Helpers already delegated into `src/lib/runtime-integrity/` are treated as protected and should not be reselected unless their smoke coverage fails.
