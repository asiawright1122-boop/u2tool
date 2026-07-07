# AI RAG And Prompt Template Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two browser-only AI workflow tools: a RAG chunk size calculator and an AI prompt template generator.

**Architecture:** Extend the existing AI prompt workflow helper with two pure functions, then expose them through focused Svelte tool components that match the current tool-page UI pattern. Register both tools in the catalog, add them to the AI tools directory, and provide metadata for every supported locale.

**Tech Stack:** Astro, Svelte 5, TypeScript, Vitest, existing tool catalog and message JSON files.

## Global Constraints

- No external AI API calls; all calculations and template generation happen locally in the browser.
- Keep UI consistent with the current tool pages: associated labels, two-column input/output layout, compact metric cards, copy/reset actions, and dark-mode classes.
- Add empty per-tool split message JSON files for every supported locale so runtime translation fetching does not 404.
- Update tests for helper behavior and AI directory membership.

---

### Task 1: Shared Tool Logic

**Files:**
- Modify: `src/lib/ai-prompt-workflow-tools.ts`
- Modify: `src/lib/ai-prompt-workflow-tools.test.ts`

**Interfaces:**
- Produces: `calculateRagChunkPlan(input: RagChunkPlanInput): RagChunkPlanResult`
- Produces: `generateAiPromptTemplate(input: AiPromptTemplateInput): AiPromptTemplateResult`

- [ ] Add RAG input/result types and implement estimates for chunk count, overlap duplication, retrieved context tokens, context usage percent, and a recommendation string.
- [ ] Add prompt-template input/result types and implement a reusable template, variable table, example prompt, and quality checklist.
- [ ] Add Vitest coverage for normal RAG estimates, risk warning thresholds, template variable extraction, and checklist generation.

### Task 2: Tool Components And Catalog Registration

**Files:**
- Create: `src/components/tools/RagChunkSizeCalculator.svelte`
- Create: `src/components/tools/AiPromptTemplateGenerator.svelte`
- Modify: `src/config/tools/development.ts`
- Modify: `src/config/tools/text.ts`
- Regenerate: `src/components/tools/ToolImportMap.ts`

**Interfaces:**
- Consumes: helper functions from Task 1.
- Produces: two working tool slugs: `rag-chunk-size-calculator` and `ai-prompt-template-generator`.

- [ ] Build RAG calculator with numeric inputs, metric cards, recommendation output, copy summary, and reset.
- [ ] Build prompt template generator with task/variables/output/constraints inputs, generated template output, variable table, copy template, and reset.
- [ ] Register RAG under development tools and Prompt Template under text tools.
- [ ] Run `npx tsx scripts/generate-tool-import-map.ts`.

### Task 3: AI Directory And Localization

**Files:**
- Modify: `src/lib/ai-tools-directory.ts`
- Modify: `src/lib/ai-tools-directory.test.ts`
- Modify: `src/messages/{locale}/base.json`
- Create: `src/messages/{locale}/tools/rag-chunk-size-calculator.json`
- Create: `src/messages/{locale}/tools/ai-prompt-template-generator.json`

**Interfaces:**
- Produces: AI directory clusters that include the two new tools.

- [ ] Add `ai-prompt-template-generator` to the prompt builders cluster.
- [ ] Add `rag-knowledge-workflows` cluster for RAG and knowledge-base planning.
- [ ] Update English and Chinese AI directory copy and SEO text.
- [ ] Add compact metadata for all supported locales and empty split files for both tool slugs.
- [ ] Update AI directory tests for order, slug set, and structured data count.

### Task 4: Verification, Commit, Push, Deploy

**Files:**
- No new source files beyond Tasks 1-3.

- [ ] Run targeted Vitest tests for helper logic, directory logic, and runtime map integrity.
- [ ] Run `npm run check`.
- [ ] Run `npm run build`.
- [ ] Start a local dev server and run runtime-loading validation for both tools across all locales.
- [ ] Run browser checks for desktop/mobile on new tools and AI directory.
- [ ] Commit, push to `main`, deploy with Wrangler, and run production smoke checks.
