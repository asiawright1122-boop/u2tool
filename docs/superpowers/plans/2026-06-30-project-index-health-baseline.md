# Project Index And Health Baseline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the project index and capture a lightweight, reproducible health baseline for U2Tool on 2026-06-30.

**Architecture:** This is a documentation and verification baseline, not a product-code change. The authoritative map stays in `docs/PROJECT_INDEX.md`, while the dated health evidence lives in `docs/PROJECT_HEALTH_BASELINE_2026-06-30.md` and the generated quick health report remains `docs/PROJECT_HEALTH_REPORT.md`.

**Tech Stack:** Astro 6, Svelte 5, TypeScript, Vitest, npm scripts, Cloudflare Workers.

---

### Task 1: Refresh Project Index Snapshot

**Files:**
- Modify: `docs/PROJECT_INDEX.md`

- [ ] **Step 1: Capture current counts**

Run:

```bash
node --import tsx/esm -e "import { tools, categories } from './src/config/tools/index.ts'; const byCat = Object.fromEntries(categories.map(c => [c.id, tools.filter(t => t.category === c.id).length])); console.log(JSON.stringify({ toolCount: tools.length, categoryCount: categories.length, byCat, popularCount: tools.filter(t => t.popular).length }, null, 2));"
find src/components/tools -maxdepth 1 -type f -name '*.svelte' | wc -l
find src/components/tools -maxdepth 1 -type f -name '*.test.ts' | wc -l
find src/lib -type f -name '*.test.ts' | wc -l
git status --short
```

Expected:

```text
toolCount: 557
categoryCount: 14
popularCount: 100
Svelte tool files: 565
direct tool tests: 5
src/lib tests: 61
existing dirty files limited to .planning/TRACEABILITY.md and es/fr/pt message files
```

- [ ] **Step 2: Update index metadata**

In `docs/PROJECT_INDEX.md`, set `Last updated` to `2026-06-30` and update the snapshot bullets to include:

```markdown
- Tool catalog size: 557 tools across 14 categories
- Popular tools: 100
- Svelte files under `src/components/tools/`: 565
- Direct tool-component tests under `src/components/tools/`: 5
- Library tests under `src/lib/`: 61
```

- [ ] **Step 3: Add the current workspace baseline**

Add a short "Current Workspace Baseline" section that records:

```markdown
- Branch: `main...origin/main`
- Pre-existing dirty files: `.planning/TRACEABILITY.md`, `src/messages/es*.json`, `src/messages/fr*.json`, `src/messages/pt*.json`
- Baseline report: `docs/PROJECT_HEALTH_BASELINE_2026-06-30.md`
```

### Task 2: Create Dated Health Baseline

**Files:**
- Create: `docs/PROJECT_HEALTH_BASELINE_2026-06-30.md`
- Modify: `docs/PROJECT_HEALTH_REPORT.md` by running `npm run health:check`

- [ ] **Step 1: Run quick health script**

Run:

```bash
npm run health:check
```

Expected:

```text
overallHealth: excellent
temporaryFiles.count: 0
buildWarnings.count: 0
unusedDependencies.count: 0
```

- [ ] **Step 2: Run lightweight gates**

Run:

```bash
npm run i18n:check-missing-keys
npm run check
npm run qa:runtime-integrity
npm run qa:ai-discovery
```

Expected:

```text
i18n:check-missing-keys: total 0 missing key(s) detected
check: exits 0
qa:runtime-integrity: exits 0
qa:ai-discovery: exits 0
```

- [ ] **Step 3: Write the baseline report**

Create `docs/PROJECT_HEALTH_BASELINE_2026-06-30.md` with:

```markdown
# Project Health Baseline - 2026-06-30

## Scope

Lightweight health baseline for project indexing and next-step planning.

## Workspace State

- Branch: `main...origin/main`
- Pre-existing dirty files before this baseline: `.planning/TRACEABILITY.md`, `src/messages/es*.json`, `src/messages/fr*.json`, `src/messages/pt*.json`

## Verification

| Command | Result | Evidence |
|---|---|---|
| `npm run health:check` | Pass | Excellent; 0 temporary files, 0 build warnings, 0 unused dependencies |
| `npm run i18n:check-missing-keys` | Pass | Total 0 missing key(s) detected |
| `npm run check` | Pass | Astro check exited 0 |
| `npm run qa:runtime-integrity` | Pass | Vitest runtime integrity suite exited 0 |
| `npm run qa:ai-discovery` | Pass | AI discovery test suite and build exited 0 |
```

### Task 3: Review And Report

**Files:**
- Read: `git diff -- docs/PROJECT_INDEX.md docs/PROJECT_HEALTH_REPORT.md docs/PROJECT_HEALTH_BASELINE_2026-06-30.md docs/superpowers/plans/2026-06-30-project-index-health-baseline.md`

- [ ] **Step 1: Review documentation diff**

Run:

```bash
git diff -- docs/PROJECT_INDEX.md docs/PROJECT_HEALTH_REPORT.md docs/PROJECT_HEALTH_BASELINE_2026-06-30.md docs/superpowers/plans/2026-06-30-project-index-health-baseline.md
```

Expected:

```text
Only project-index, health-baseline, generated health report, and this plan changed.
No source code or existing message files changed.
```

- [ ] **Step 2: Final status**

Report:

```text
Updated project index, created dated health baseline, refreshed generated health report, and verified with the listed commands.
```
