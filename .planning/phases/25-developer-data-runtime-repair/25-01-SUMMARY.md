# 25-01 Summary: Developer/Data Helper Wave Selection

## Outcome

Selected the code-analysis helper family as the bounded Phase 25 runtime repair wave.

## Evidence

- `analyzeComplexity`, `analyzeDeadCode`, and `analyzePerformance` were direct placeholder exports in `src/lib/tool-stubs.ts`.
- The selected family powers three visible developer tools:
  - `CodeComplexityAnalyzer.svelte`
  - `DeadCodeAnalyzer.svelte`
  - `PerformanceProfiler.svelte`
- Adjacent candidates such as `parseGitLog`, `sqlToJson`, `findUnusedImports`, and `generateCleanedCode` already had meaningful implementations or smoke coverage.

## Decision

Repair the code-analysis trio first, defer `analyzeQuery` and deeper SQL/query planning to a later query-specific wave.

## Verification

- Candidate surface reviewed with `rg` across `src/lib/tool-stubs.ts`, `src/components/tools`, and `src/lib/tool-stubs-runtime.test.ts`.
