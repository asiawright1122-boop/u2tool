# High Opportunity Tool Batch Design

Date: 2026-07-06

## Summary

Add a first launch batch of nine high-opportunity tools to U2Tool. The batch combines durable developer and AI SEO demand with one time-sensitive World Cup 2026 tool.

The implementation should follow the existing Astro and Svelte tool system:

- Tool metadata lives in `src/config/tools/*.ts`.
- Base SEO copy lives in `src/messages/*/base.json`.
- Long support copy lives in `src/messages/*/tools/<slug>.json`.
- Tool components are loaded through `src/components/tools/ToolImportMap.ts`.
- Batch registration should use the existing `tools:launch` and `tools:onboard` scripts where practical.

## Goals

- Launch nine indexable, usable tool pages with localized SEO copy.
- Keep inputs private by running all analysis and generation in the browser.
- Prioritize tools with clear search intent and defensible long-tail phrases.
- Use custom Svelte components only where the tool needs richer interaction.
- Reuse `PopularUtilityTool` for smaller validator and generator tools.
- Avoid touching unrelated existing translation changes.

## Tool Scope

### Custom Components

1. `ai-token-calculator`
   - Category: `development`
   - Purpose: Estimate token counts and API cost for common AI models.
   - Inputs: prompt text, output token estimate, selected provider/model, request count.
   - Outputs: input tokens, estimated output tokens, per-request cost, batch cost.
   - Requirement: Pricing data must be verified against official provider docs before hardcoding. If exact current pricing cannot be verified, show conservative labeled estimates and keep pricing constants isolated.

2. `har-file-viewer`
   - Category: `development`
   - Purpose: Parse a browser HAR file locally and summarize network requests.
   - Inputs: pasted HAR JSON or uploaded `.har` file.
   - Outputs: request count, total transferred bytes, total duration, slowest requests, status breakdown, domain breakdown.
   - Requirement: No upload. Invalid HAR should produce a readable parse or schema error.

3. `world-cup-2026-bracket-predictor`
   - Category: `fun`
   - Purpose: Let users make a 2026 FIFA World Cup bracket prediction during the tournament window.
   - Inputs: group winners and runners-up or quick seeded defaults.
   - Outputs: knockout bracket, finalist picks, champion, copyable summary.
   - Requirement: Schedule and tournament structure should be checked against official FIFA data before final constants are added. The tool may use a simplified predictor if complete live standings are not available.

### PopularUtilityTool Extensions

4. `llms-txt-validator`
   - Category: `development`
   - Purpose: Validate pasted `llms.txt` content for common formatting and link issues.
   - Inputs: `llms.txt` content.
   - Outputs: issue count, warning count, detected title, link count, normalized suggestions.

5. `ai-robots-txt-generator`
   - Category: `generators`
   - Purpose: Generate robots.txt policy blocks for AI crawlers.
   - Inputs: site policy preset, sitemap URL, custom allowed or blocked user agents.
   - Outputs: copyable robots.txt.
   - Requirement: User-agent names for GPTBot, ClaudeBot, Google-Extended, and Perplexity crawlers must be checked against official docs before finalizing.

6. `mcp-json-validator`
   - Category: `development`
   - Purpose: Validate an MCP JSON configuration for common shape and field mistakes.
   - Inputs: MCP JSON config.
   - Outputs: valid/invalid status, server count, issue list, normalized JSON.

7. `mcp-server-config-generator`
   - Category: `development`
   - Purpose: Generate a simple MCP server configuration block.
   - Inputs: server name, command, args, env variables, client preset.
   - Outputs: copyable JSON config.

8. `json-repair`
   - Category: `development`
   - Purpose: Repair common malformed JSON from AI or logs.
   - Inputs: malformed JSON text.
   - Outputs: repaired JSON, parse status, fix notes.
   - Requirement: Repairs should be conservative and transparent. Do not silently invent missing values beyond safe syntax repairs.

9. `jsonl-validator`
   - Category: `development`
   - Purpose: Validate JSON Lines and NDJSON payloads.
   - Inputs: JSONL or NDJSON text.
   - Outputs: valid line count, invalid line count, first errors, optional normalized output.

## Architecture

Use a mixed implementation.

Custom components should be created for tools whose user experience benefits from structured panels, upload handling, tables, or model selectors. These components should own only their UI state and call small pure helper functions from `src/lib/`.

Shared utility tools should extend `src/components/tools/PopularUtilityTool.svelte` with:

- new field definitions,
- default input values,
- calculation branches,
- reusable copy keys when possible,
- concise output cards and copyable output text.

Pure logic should live in focused helper files under `src/lib/` when it is complex enough to test independently. Expected helper modules:

- `src/lib/ai-token-calculator.ts`
- `src/lib/har-viewer.ts`
- `src/lib/world-cup-2026-bracket.ts`
- `src/lib/high-opportunity-tool-helpers.ts` for small shared validators and generators, unless separate files are clearer.

## Data Flow

1. Batch specs define slug, category, icon, component, and English seed copy.
2. `scripts/tools/launch-tool-batch.ts` localizes the specs and calls onboarding.
3. Onboarding appends tool metadata and writes base plus split message files for all locales.
4. `scripts/generate-tool-import-map.ts` updates component imports.
5. Tool pages render through the existing `[locale]/tools/[slug].astro` route.
6. Runtime logic runs in the browser. Uploaded files are read locally with `FileReader`.

## Copy And Localization

English copy should be specific and search-aligned. Other locales may initially use the project localization workflow output, but must pass the existing translation validators.

Each tool needs:

- `name`
- `description`
- `seo_title`
- `seo_description`
- `detailed_description`
- `usage_steps`
- `usage_examples`
- three FAQs

Avoid vague claims such as "best" unless the page earns the comparison. Avoid promising live or official data where the implementation is static or user-driven.

## Error Handling

- JSON parsing tools should show the first actionable parse error and the line number when available.
- HAR parsing should reject non-HAR JSON with a clear message.
- MCP validation should distinguish invalid JSON from valid JSON with MCP shape warnings.
- Token pricing should label estimates and expose the pricing date in the UI or helper data.
- World Cup predictor should not claim live results unless live data is actually fetched.
- All tools must keep user input in the browser.

## Testing

Add focused tests for pure helpers:

- JSON repair handles trailing commas, single quotes, comments, and unquoted keys when safe.
- JSONL validation reports valid and invalid line numbers.
- MCP validation reports missing server command and invalid args/env shapes.
- AI robots generator emits expected user-agent blocks.
- Token calculator computes cost from model pricing constants.
- HAR parser summarizes entries, bytes, timings, status classes, and domains.
- World Cup bracket helper advances selected teams and produces a final champion path.

Run at minimum:

- `npm run i18n:check-missing-keys`
- `npm run qa:changed-tool-locales -- --timeout-ms=30000 <new slugs>`
- `npm run qa:runtime-integrity`
- `npm run check`
- `npm run build` if component changes are broad or type checks are insufficient

## Rollout

Launch all nine pages together to create a visible topical batch:

- AI SEO and MCP tools should interlink conceptually through related tools.
- JSON repair and JSONL validator should sit near existing JSON formatter, validator, and converter pages.
- HAR viewer should sit near API tester, curl converter, and request header tools.
- World Cup bracket predictor should sit near existing World Cup simulator, group calculator, budget, timezone, and visa tools.

After launch, the IndexNow URL list generated by the batch script can be submitted with the existing deployment workflow.

## Non-Goals

- No server-side processing or file upload.
- No live FIFA results integration in this batch.
- No paid keyword API integration.
- No broad redesign of tool pages.
- No unrelated translation cleanup.
