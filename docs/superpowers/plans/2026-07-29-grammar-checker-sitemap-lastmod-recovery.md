# Grammar Checker Sitemap Lastmod Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish truthful `2026-07-27` sitemap update signals for all ten localized Grammar Checker pages without changing any other tool's signal or indexability contract.

**Architecture:** Keep `src/config/sitemap-lastmod.json` as the sole source of truth and add ten exact path overrides. Verify both the resolver and generated tools-sitemap entries, then deploy from an isolated worktree and confirm the live XML before recording the checkpoint.

**Tech Stack:** Astro, TypeScript, JSON manifest, Vitest, Cloudflare Workers/Wrangler.

## Global Constraints

- Use an isolated worktree on branch `codex/grammar-sitemap-lastmod-recovery`; do not modify the user's dirty `main` worktree.
- Set only the ten Grammar Checker locale paths to `2026-07-27`.
- Do not change the tools bucket fallback date `2026-06-02`.
- Do not change sitemap membership, canonical tags, robots directives, hreflang relationships, or untreated pilot profiles.
- Do not submit a manual Google indexing request or resubmit a sitemap as part of this change.
- Keep Hex Editor and the other four pilot tools as untreated controls.

## File Structure

- `src/config/sitemap-lastmod.json` — exact per-URL lastmod source of truth.
- `src/lib/sitemap-lastmod.test.ts` — resolver-level regression coverage for the ten paths and unchanged fallback.
- `src/lib/sitemap-entry-builders.test.ts` — generated-entry integration coverage for the ten paths and tools child-sitemap newest date.
- `docs/GSC_GRAMMAR_CHECKER_RELEASE_2026-07-27.md` — dated 48-hour checkpoint, production deployment, and live sitemap evidence.

---

### Task 1: Add Truthful Grammar Checker Lastmod Overrides

**Files:**
- Modify: `src/lib/sitemap-lastmod.test.ts`
- Modify: `src/config/sitemap-lastmod.json`

**Interfaces:**
- Consumes: `resolveSitemapLastmod(path: string, bucket: SitemapLastmodBucket): string`.
- Produces: exact `2026-07-27` resolution for ten Grammar Checker paths while preserving the tools fallback.

- [ ] **Step 1: Write the failing resolver regression test**

Add this test inside `describe('sitemap lastmod resolver', ...)`:

```ts
it('publishes the Grammar Checker release date for every locale only', () => {
  const grammarCheckerLocales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

  for (const locale of grammarCheckerLocales) {
    expect(resolveSitemapLastmod(`/${locale}/tools/grammar-checker/`, 'tools'))
      .toBe('2026-07-27');
  }

  expect(resolveSitemapLastmod('/en/tools/uuid-generator/', 'tools'))
    .toBe('2026-06-02');
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
npx vitest run src/lib/sitemap-lastmod.test.ts
```

Expected: the new test fails because each Grammar Checker path resolves to `2026-06-02`.

- [ ] **Step 3: Add the ten exact manifest overrides**

Insert these entries into the existing alphabetically grouped `overrides` object in `src/config/sitemap-lastmod.json`:

```json
"/ar/tools/grammar-checker/": "2026-07-27",
"/de/tools/grammar-checker/": "2026-07-27",
"/en/tools/grammar-checker/": "2026-07-27",
"/es/tools/grammar-checker/": "2026-07-27",
"/fr/tools/grammar-checker/": "2026-07-27",
"/ja/tools/grammar-checker/": "2026-07-27",
"/ko/tools/grammar-checker/": "2026-07-27",
"/pt/tools/grammar-checker/": "2026-07-27",
"/ru/tools/grammar-checker/": "2026-07-27",
"/zh/tools/grammar-checker/": "2026-07-27"
```

Do not modify `buckets.tools` or any existing override.

- [ ] **Step 4: Run the resolver test and verify GREEN**

Run:

```bash
npx vitest run src/lib/sitemap-lastmod.test.ts
```

Expected: all seven resolver tests pass.

- [ ] **Step 5: Commit the resolver fix**

```bash
git add src/config/sitemap-lastmod.json src/lib/sitemap-lastmod.test.ts
git commit -m "fix(seo): publish grammar checker release lastmods"
```

---

### Task 2: Prove Generated Sitemap Entries Preserve the Cohort Boundary

**Files:**
- Modify: `src/lib/sitemap-entry-builders.test.ts`

**Interfaces:**
- Consumes: `buildToolsSitemapEntries(): SitemapUrlEntry[]` and `newestEntryLastmod(entries): string`.
- Produces: integration evidence that every Grammar Checker entry is dated `2026-07-27` and an untreated tool remains `2026-06-02`.

- [ ] **Step 1: Add the generated-entry integration test**

Add this test inside `describe('sitemap entry builders', ...)`:

```ts
it('publishes the Grammar Checker cohort date without redating untreated tools', () => {
  const entries = buildToolsSitemapEntries();
  const grammarCheckerLocales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

  for (const locale of grammarCheckerLocales) {
    expect(entries.find((entry) => entry.path === `/${locale}/tools/grammar-checker/`)?.lastmod)
      .toBe('2026-07-27');
  }

  expect(entries.find((entry) => entry.path === '/en/tools/uuid-generator/')?.lastmod)
    .toBe('2026-06-02');
  expect(newestEntryLastmod(entries)).toBe('2026-07-27');
});
```

- [ ] **Step 2: Run both sitemap test files**

```bash
npx vitest run src/lib/sitemap-lastmod.test.ts src/lib/sitemap-entry-builders.test.ts
```

Expected: both files pass; the resolver test count is seven and the builder test count is four.

- [ ] **Step 3: Commit the integration guard**

```bash
git add src/lib/sitemap-entry-builders.test.ts
git commit -m "test(seo): guard grammar sitemap cohort dates"
```

---

### Task 3: Verify, Deploy, and Record the 48-Hour Recovery Checkpoint

**Files:**
- Modify: `docs/GSC_GRAMMAR_CHECKER_RELEASE_2026-07-27.md`

**Interfaces:**
- Consumes: a clean branch containing Tasks 1 and 2, the existing Cloudflare configuration, and production sitemap endpoints.
- Produces: a deployed Worker version, live ten-of-ten sitemap evidence, and an auditable hold decision for Hex Editor.

- [ ] **Step 1: Run the complete pre-deploy gate**

```bash
npx vitest run src/lib/sitemap-lastmod.test.ts src/lib/sitemap-entry-builders.test.ts
npm run validate:search-engine-compliance
npm run check
npm run build
npm run validate:sitemap
```

Expected: all commands exit 0; Astro reports zero errors; the build generates `dist/sitemap-tools.xml`.

- [ ] **Step 2: Assert the built sitemap contains the exact cohort and unchanged control**

```bash
node --input-type=module <<'NODE'
import { readFile } from 'node:fs/promises';

const xml = await readFile('dist/sitemap-tools.xml', 'utf8');
const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const blocks = Array.from(xml.matchAll(/<url>[\s\S]*?<\/url>/g), (match) => match[0]);

for (const locale of locales) {
  const loc = `https://www.u2tool.com/${locale}/tools/grammar-checker/`;
  const block = blocks.find((value) => value.includes(`<loc>${loc}</loc>`)) ?? '';
  if (!block.includes('<lastmod>2026-07-27</lastmod>')) {
    throw new Error(`${locale} Grammar Checker lastmod mismatch`);
  }
}

const control = blocks.find((value) => value.includes('<loc>https://www.u2tool.com/en/tools/uuid-generator/</loc>')) ?? '';
if (!control.includes('<lastmod>2026-06-02</lastmod>')) {
  throw new Error('Untreated UUID Generator lastmod changed');
}

console.log('Built Grammar Checker lastmods passed: 10/10; untreated control passed: 1/1');
NODE
```

Expected: `Built Grammar Checker lastmods passed: 10/10; untreated control passed: 1/1`.

- [ ] **Step 3: Capture the rollback version and deploy the verified build**

```bash
npx wrangler deployments list
node scripts/deploy/prepare-cloudflare-assets.mjs
npx wrangler deploy
```

Expected: the deployment succeeds and Wrangler prints a new Worker version identifier. Preserve the immediately preceding production version as the rollback target.

- [ ] **Step 4: Verify the production sitemap and Worker health**

```bash
node --input-type=module <<'NODE'
const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const response = await fetch(`https://www.u2tool.com/sitemap-tools.xml?checkpoint=${Date.now()}`);
const xml = await response.text();
const blocks = Array.from(xml.matchAll(/<url>[\s\S]*?<\/url>/g), (match) => match[0]);

if (response.status !== 200) throw new Error(`sitemap status ${response.status}`);

for (const locale of locales) {
  const loc = `https://www.u2tool.com/${locale}/tools/grammar-checker/`;
  const block = blocks.find((value) => value.includes(`<loc>${loc}</loc>`)) ?? '';
  if (!block.includes('<lastmod>2026-07-27</lastmod>')) {
    throw new Error(`${locale} live Grammar Checker lastmod mismatch`);
  }
}

console.log('Live Grammar Checker lastmods passed: 10/10');
NODE
npm run validate:worker-ssr
npm run validate:search-engine-compliance
```

Expected: live lastmods pass 10/10, Worker SSR passes two rounds, and search-engine compliance passes.

- [ ] **Step 5: Append the checkpoint evidence to the release record**

Add a `## 48-Hour Technical Checkpoint` section to `docs/GSC_GRAMMAR_CHECKER_RELEASE_2026-07-27.md` containing the literal execution time, deployed Worker version, rollback version, pre-deploy gate results, live 10/10 sitemap result, GSC last crawl `2026-07-07 08:49:40`, the old indexed Russian title, and the decision `HOLD_HEX_PENDING_DAY_7`.

State explicitly that no indexing request or sitemap resubmission was performed.

- [ ] **Step 6: Commit only the checkpoint record**

```bash
git add docs/GSC_GRAMMAR_CHECKER_RELEASE_2026-07-27.md
git commit -m "docs: record grammar sitemap recovery checkpoint"
```

- [ ] **Step 7: Verify final branch scope**

```bash
git status --short
git diff --stat main...HEAD
git log --oneline main..HEAD
```

Expected: clean worktree; changes limited to the manifest, two sitemap test files, and the Grammar release record; three focused implementation commits after the plan commit.
