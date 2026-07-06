# AI Token Calculator Model Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the AI Token Calculator so it supports a much broader, current, source-backed set of major AI providers and models, including USD and CNY priced catalogs.
**Architecture:** Keep the tool's runtime local and static: a typed pricing catalog in `src/lib/ai-token-calculator.ts`, a Svelte UI in `src/components/tools/AiTokenCalculator.svelte`, and focused unit coverage in `src/lib/ai-token-calculator.test.ts`.
**Tech Stack:** Astro, Svelte 5 runes, TypeScript, Vitest, Cloudflare Workers deployment.

## Global Constraints

- Use only pricing that can be verified from official provider documentation on 2026-07-06.
- Do not add live scrapers, exchange-rate lookups, tokenizer dependencies, or runtime network calls.
- Preserve the current simple token-estimation behavior and existing localized UI copy.
- Display each result in the model's own published currency.
- Keep the select usable as the model count grows by grouping options by provider.
- Note pricing caveats where a provider charges different rates for cache, long context, request fees, or introductory periods.

---

## Tasks

- [ ] Update the typed pricing model and catalog.
  - Add a `currency` field to `AiModelPricing`.
  - Replace the four-model seed list with about 30 current models from OpenAI, Anthropic, Google Gemini, DeepSeek, xAI, Perplexity, and Kimi/Moonshot.
  - Keep all entries dated `2026-07-06` and include official source URLs and notes for caveats.

- [ ] Improve model selection and currency formatting in the UI.
  - Add provider grouping for the native model select.
  - Format `perRequestCost` and `batchCost` using the selected model's currency.
  - Include provider and model in copied summaries.

- [ ] Expand tests around catalog quality and calculation behavior.
  - Assert provider coverage, unique IDs, valid prices, valid currencies, and official source URLs.
  - Assert representative model IDs exist for each provider.
  - Assert USD and CNY models calculate costs without changing the local estimation behavior.

- [ ] Verify and ship.
  - Run the focused Vitest suite for the helper.
  - Run type/build validation and relevant SEO/render checks.
  - Commit, push `main`, deploy to Cloudflare, and smoke-test the live AI Token Calculator page.
