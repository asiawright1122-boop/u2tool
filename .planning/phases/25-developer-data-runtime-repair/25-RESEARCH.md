# 25 Research

## Question

Which developer/data helper family should Phase 25 repair after the time/scheduling runtime wave?

## Findings

### Code-analysis helpers are the strongest bounded next wave

- `analyzeComplexity`, `analyzeDeadCode`, and `analyzePerformance` are all direct empty placeholders.
- They power three separate developer tools: code complexity analysis, dead-code analysis, and performance profiling.
- The expected output shapes are already visible in the components, so implementation can be targeted and testable.

### Several adjacent candidates are already repaired or lower leverage

- `parseGitLog`, `sqlToJson`, `convertSqlToMongo`, `findUnusedImports`, and `generateCleanedCode` already have runtime smoke coverage or non-placeholder implementations.
- `analyzeQuery` is still a placeholder, but it powers one SQL tool and has a different domain surface than the code-analysis trio.
- Full AST analysis would be higher precision but not necessary for this runtime trust repair.

### The safe implementation model is heuristic and deterministic

- The site needs useful user-facing output, not compiler-grade static analysis.
- Simple lexical/regex analysis can provide line counts, function metrics, dead declaration hints, estimated operation costs, hotspots, and suggestions.
- The helpers should remain dependency-free and non-throwing.

## Recommended Phase 25 Shape

- Add `src/lib/runtime-integrity/code-analysis.ts`.
- Delegate `analyzeComplexity`, `analyzeDeadCode`, and `analyzePerformance` from `tool-stubs.ts`.
- Add smoke coverage to `src/lib/tool-stubs-runtime.test.ts`.
- Leave `analyzeQuery` for a future SQL/query-specific wave unless there is spare scope after the selected trio is complete.

## Risks

- Over-promising precision could make the tool misleading. Output should read as heuristic estimates.
- Naive reference detection can flag false positives. Tests should focus on stable examples, not exhaustive language coverage.
- Broad component cleanup would be scope creep; current UI already knows how to render useful shapes.

## Validation Notes

- `npx vitest run src/lib/tool-stubs-runtime.test.ts`
- `npm run check`
- `npm run build`
