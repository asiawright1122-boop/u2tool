# Phase 73 Plan: KV Pipeline Integration Validation

## 1. Step-by-Step Implementation

### Step 1: Implement Loop Detection Script
- **File**: [validate-redirect-loops.ts](file:///Users/kaka/Dev/u2tool/scripts/validation/validate-redirect-loops.ts)
- **Design**:
  - Load `src/config/gsc-redirects.json`.
  - Parse each entry `[sourcePath, targetPath]`.
  - Normalize paths (lower-case, trim trailing and leading slashes).
  - Perform DFS (Depth-First Search) cycle detection on the dependency graph.
  - If a cycle is detected (e.g. `/a` redirects to `/b` and `/b` redirects to `/a` or `/a`), report the full cycle path and terminate with `process.exit(1)`.
  - Add warnings for multi-hop redirects (e.g., `/a -> /b -> /c`) to suggest flattening the mapping, but do not exit with error.
  - Also ensure target routes are well-formed (start with `/tools/`, `/categories/`, `/compare/`, or other valid canonical formats).

### Step 2: Register Commands and Integrate to Gate
- **File**: [package.json](file:///Users/kaka/Dev/u2tool/package.json)
- **Changes**:
  - Add `"validate:redirect-loops": "node --import tsx/esm scripts/validation/validate-redirect-loops.ts"` to `scripts`.
  - Inject `npm run validate:redirect-loops` into `qa:production` command sequence.

### Step 3: Extend Vitest Integration Tests
- **File**: [src/middleware.test.ts](file:///Users/kaka/Dev/u2tool/src/middleware.test.ts)
- **Changes**:
  - Add new assertions for dynamic KV-resolved paths under the `GSC recovery redirects` describe block.
  - Case A: **Query parameter preservation**. Request `/dynamic-old-path?utm_source=test` with KV enabled -> Redirect location should be `/en/tools/dynamic-new-target/?utm_source=test`.
  - Case B: **Locale preservation**. Request `/zh/dynamic-old-path` with KV enabled -> Redirect location should be `/zh/tools/dynamic-new-target/`.

### Step 4: Verification
- Execute local Vitest tests.
- Execute full production-readiness check via `npm run verify:production`.
