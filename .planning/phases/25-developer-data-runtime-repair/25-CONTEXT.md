# Phase 25: Developer/Data Runtime Repair - Context

**Gathered:** 2026-05-10
**Status:** Ready for planning and execution
**Mode:** Auto-selected from roadmap, requirements, and code evidence

<domain>
## Phase Boundary

Select and repair the next high-leverage developer/data helper family still exposed through `src/lib/tool-stubs.ts` placeholders, using actual imports and user-visible output as the scope boundary.

</domain>

<decisions>
## Implementation Decisions

### Cluster-selection strategy
- **D-01:** Phase 25 should target the code-analysis helper family: `analyzeComplexity`, `analyzeDeadCode`, and `analyzePerformance`.
- **D-02:** This family outranks a single `analyzeQuery` repair because it drives three visible developer tools with the same expected input domain and currently returns the same empty `{ score: 0, issues: [] }` placeholder shape.
- **D-03:** Existing repaired helpers such as `parseGitLog`, `sqlToJson`, `findUnusedImports`, and `generateCleanedCode` should remain out of scope except for compatibility checks.

### Shared-helper strategy
- **D-04:** Code-analysis logic should live in `src/lib/runtime-integrity/code-analysis.ts` and flow through `src/lib/tool-stubs.ts` as the compatibility seam.
- **D-05:** The repaired helpers should return the shapes expected by the existing Svelte components:
  - `analyzeComplexity`: line counts, function metrics, overall complexity, maintainability index
  - `analyzeDeadCode`: array of dead-code items with type, name, line, code, and reason
  - `analyzePerformance`: total estimated time, operations, hotspots, and suggestions
- **D-06:** The implementation should stay heuristic and deterministic. It is not a full parser, linter, profiler, or bundler.

### Evidence strategy
- **D-07:** Runtime smoke tests should exercise the public `tool-stubs.ts` exports with representative JavaScript/TypeScript snippets.
- **D-08:** Phase 25 validation should run targeted Vitest, `npm run check`, and `npm run build`.

### The Agent's Discretion
- Exact heuristic scoring details, as long as the results are non-placeholder, stable, and useful for the current tools.
- Whether helper internals use regular expressions or simple lexical scanning, as long as comments/strings are handled conservatively enough for smoke coverage.
- Exact wording of issue/recommendation strings.

</decisions>

<specifics>
## Specific Ideas

- Count code/comment/blank lines and detect common function declarations, arrow functions, methods, and class methods.
- Estimate cyclomatic complexity from branch keywords such as `if`, `else if`, `for`, `while`, `case`, `catch`, `&&`, `||`, and ternaries.
- Detect likely dead declarations by comparing declaration names with later identifier references.
- Estimate performance cost from nested loops, DOM queries in loops, synchronous JSON parsing/stringifying, repeated regex construction, and expensive array combinators.

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
- `src/lib/runtime-integrity/scheduling.ts`
- `src/lib/tool-stubs-runtime.test.ts`
- `src/lib/tool-stubs.ts`

### Selected consumers
- `src/components/tools/CodeComplexityAnalyzer.svelte`
- `src/components/tools/DeadCodeAnalyzer.svelte`
- `src/components/tools/PerformanceProfiler.svelte`
- `package.json`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- The existing components already render the expected output shapes, so the repair can focus on helper behavior without UI redesign.
- `EXAMPLE_CODE` is already shared through `tool-stubs.ts` and can seed deterministic smoke tests.
- Existing `findUnusedImports` and `generateCleanedCode` prove simple code-analysis heuristics are acceptable for this runtime-integrity layer.

### Current Failure Signals
- `analyzeComplexity() { return { score: 0, issues: [] }; }`
- `analyzeDeadCode() { return { score: 0, issues: [] }; }`
- `analyzePerformance() { return { score: 0, issues: [] }; }`
- These shapes do not match the components: dead-code UI expects an array, performance UI expects `operations`, and complexity UI expects line/function metrics.

### Integration Points
- `tool-stubs.ts` should delegate the three selected exports to `runtime-integrity/code-analysis.ts`.
- `tool-stubs-runtime.test.ts` should cover all three public exports.
- Component edits should not be needed if helper return shapes match current expectations.

</code_context>

<deferred>
## Deferred Ideas

- `analyzeQuery` and broader SQL execution-plan analysis.
- Full AST-based parsing or TypeScript compiler analysis.
- Package vulnerability/database-backed analysis beyond existing helper coverage.

</deferred>

---

*Phase: 25-developer-data-runtime-repair*
*Context gathered: 2026-05-10*
