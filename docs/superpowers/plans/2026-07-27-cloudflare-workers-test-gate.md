# Cloudflare Workers Test Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the repository-wide Vitest gate by supplying the Cloudflare Workers virtual module inside the one test file that imports the AI Discovery events route.

**Architecture:** Add a hoisted, file-local Vitest mock for `cloudflare:workers` in `src/lib/ai-discovery/events-api.test.ts`, matching the established pattern in `src/middleware.test.ts`. Keep production routes, global Vitest configuration, dependencies, Grammar Checker release files, and Cloudflare configuration unchanged.

**Tech Stack:** TypeScript, Vitest, Astro, npm, Cloudflare Workers runtime types.

## Global Constraints

- Work only in `/Users/kaka/Dev/u2tool/.worktrees/fix-cloudflare-workers-test-gate` on branch `codex/fix-cloudflare-workers-test-gate`.
- Modify only `src/lib/ai-discovery/events-api.test.ts` during implementation, plus this plan document.
- Do not touch the Grammar Checker release branch or its worktree.
- Do not change `src/pages/api/ai-discovery/events.ts`, `vitest.config.ts`, dependencies, Worker bindings, or production configuration.
- Do not release or deploy Grammar Checker or Hex Calculator as part of this fix.
- Stop and reassess if the file-local mock does not resolve the virtual module; do not expand scope automatically.

---

### Task 1: Restore And Verify The Vitest Gate

**Files:**
- Modify: `src/lib/ai-discovery/events-api.test.ts`

**Interfaces:**
- Consumes: the route's `import { env } from 'cloudflare:workers'` and the existing file-local mock pattern in `src/middleware.test.ts`.
- Produces: a Node-compatible test environment for the six AI Discovery events API tests without changing production behavior.

- [ ] **Step 1: Preserve the RED evidence**

Run:

```bash
npx vitest run src/lib/ai-discovery/events-api.test.ts
```

Expected: all six tests fail while resolving `cloudflare:workers`, before route behavior is exercised. Record any materially different failure and stop before editing.

- [ ] **Step 2: Add the file-local virtual-module mock**

Immediately after the Vitest import in `src/lib/ai-discovery/events-api.test.ts`, add:

```ts
vi.mock('cloudflare:workers', () => ({
  env: {},
}));
```

Do not alter the existing route loaders, fixtures, assertions, or cleanup behavior.

- [ ] **Step 3: Verify the targeted GREEN state**

Run:

```bash
npx vitest run src/lib/ai-discovery/events-api.test.ts
```

Expected: `6/6` tests pass.

- [ ] **Step 4: Verify the repository-wide Vitest gate**

Run:

```bash
npx vitest run
```

Expected: `1580/1580` tests pass with no failed test files. If the repository test count has legitimately changed since the recorded RED run, require zero failures and explain the count difference before proceeding.

- [ ] **Step 5: Verify Astro and TypeScript integration**

Run:

```bash
npm run check
```

Expected: exit code `0` with no errors.

- [ ] **Step 6: Verify the production build**

Run:

```bash
npm run build
```

Expected: exit code `0`; the test-only mock has no production build effect.

- [ ] **Step 7: Review the scoped diff**

Run:

```bash
git diff --check
git status --short
git diff -- src/lib/ai-discovery/events-api.test.ts
```

Expected: no whitespace errors, and the implementation diff contains only the three-line file-local mock in the approved test file.

- [ ] **Step 8: Commit the verified fix**

Stage only the test file and commit:

```bash
git add src/lib/ai-discovery/events-api.test.ts
git commit -m "test: mock Cloudflare Workers env for events API"
```

Expected: one focused implementation commit on `codex/fix-cloudflare-workers-test-gate`; no deployment or production configuration change.
