# AI Token Calculator SEO Reference Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a server-rendered model pricing reference section to the AI Token Calculator page.

**Architecture:** Create a focused Astro component that imports the existing pricing catalog and renders indexable HTML. Mount it conditionally from the generic tool detail page only when `tool.slug === 'ai-token-calculator'`.

**Tech Stack:** Astro, TypeScript, Svelte island remains unchanged, Vitest, existing SEO validation scripts.

## Global Constraints

- Add a server-rendered support block only for `ai-token-calculator`.
- Reuse `AI_MODEL_PRICING` as the single source of truth for provider, model, price, currency, pricing date, source URL, and caveat notes.
- Render a provider-grouped pricing table in HTML so crawlers can read every supported model.
- Add short localized explanatory copy for English and Chinese, with safe English fallback for other locales.
- Keep the interactive calculator unchanged.
- Do not add scrapers, exchange-rate conversion, live pricing calls, or tokenizer dependencies.

---

## Task 1: SSR Pricing Reference Component

**Files:**
- Create: `src/components/tools/AiTokenCalculatorSeoContent.astro`
- Modify: `src/pages/[locale]/tools/[slug].astro`

**Interfaces:**
- Consumes: `getAiModelPricingGroups()` from `src/lib/ai-token-calculator.ts`
- Produces: an Astro component with props `{ locale: Locale }`

- [ ] **Step 1: Create the Astro component**
  - Render a heading, intro, table, caveat notes, and final note.
  - Use `Intl.NumberFormat` with each model's `currency`.
  - Keep source links on official provider URLs.

- [ ] **Step 2: Mount the component conditionally**
  - Import `AiTokenCalculatorSeoContent`.
  - Render it after `ToolWrapper` only when `tool.slug === 'ai-token-calculator'`.

- [ ] **Step 3: Verify rendered content locally**
  - Run `npm run build`.
  - Start `npm run preview -- --host 127.0.0.1 --port 4322`.
  - Confirm `/zh/tools/ai-token-calculator/` contains `AI 模型 Token 价格参考`, `gpt-5.5`, `Claude Sonnet 5`, `grok-4.3`, and `kimi-k2.7-code` in the HTML/DOM.

## Task 2: SEO Guard Test

**Files:**
- Modify: `src/lib/ai-token-calculator.test.ts`

**Interfaces:**
- Consumes: `getAiModelPricingGroups()`
- Produces: test coverage proving every catalog row can be rendered with provider groups and source-backed fields.

- [ ] **Step 1: Add a table-readiness test**
  - Assert that every grouped model has provider, model, currency, pricing date, source URL, and positive prices.

- [ ] **Step 2: Run focused tests**
  - Run `npx vitest run src/lib/ai-token-calculator.test.ts`.
  - Expected: all tests pass.

## Task 3: Release Verification

**Files:**
- No source edits unless verification exposes a problem.

- [ ] **Step 1: Run project checks**
  - `npm run check`
  - `npm run build`
  - `npm run qa:changed-tool-locales -- --base-url=http://127.0.0.1:4322 --timeout-ms=30000 ai-token-calculator`
  - `npm run validate:rendered-seo`
  - `npm run validate:search-engine-compliance`

- [ ] **Step 2: Ship**
  - Commit implementation files.
  - Push `main`.
  - Deploy with Cloudflare Wrangler and confirm GitHub Actions deployment.
  - Smoke-test production for the static table and interactive model select.
