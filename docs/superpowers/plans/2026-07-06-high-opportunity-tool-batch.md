# High Opportunity Tool Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add nine high-opportunity tool pages: `llms-txt-validator`, `ai-robots-txt-generator`, `mcp-json-validator`, `mcp-server-config-generator`, `ai-token-calculator`, `json-repair`, `jsonl-validator`, `har-file-viewer`, and `world-cup-2026-bracket-predictor`.

**Architecture:** Keep registration, SEO copy, import maps, and localized support content inside the existing U2Tool workflow. Put deterministic logic in focused `src/lib/*` helpers with Vitest coverage, then connect three custom Svelte components and six `PopularUtilityTool` branches.

**Tech Stack:** Astro 6, Svelte 5 runes, TypeScript, Vitest, existing `scripts/tools/launch-tool-batch.ts`, existing `scripts/tools/onboard-tool.ts`, existing `PopularUtilityTool.svelte`.

## Global Constraints

- Tool metadata lives in `src/config/tools/*.ts`.
- Base SEO copy lives in `src/messages/*/base.json`.
- Long support copy lives in `src/messages/*/tools/<slug>.json`.
- Tool components are loaded through `src/components/tools/ToolImportMap.ts`.
- Batch registration should use the existing `tools:launch` and `tools:onboard` scripts where practical.
- Keep inputs private by running all analysis and generation in the browser.
- Use custom Svelte components only where the tool needs richer interaction.
- Reuse `PopularUtilityTool` for smaller validator and generator tools.
- Avoid touching unrelated existing translation changes.
- Pricing data must be verified against official provider docs before hardcoding.
- User-agent names for GPTBot, ClaudeBot, Google-Extended, and Perplexity crawlers must be checked against official docs before finalizing.
- Schedule and tournament structure should be checked against official FIFA data before final constants are added.
- No server-side processing or file upload.
- No live FIFA results integration in this batch.
- No paid keyword API integration.
- No broad redesign of tool pages.
- No unrelated translation cleanup.

---

## File Structure

- Create `src/lib/high-opportunity-tool-helpers.ts` for small shared validators and generators used by `PopularUtilityTool`.
- Create `src/lib/high-opportunity-tool-helpers.test.ts` for JSON repair, JSONL validation, MCP validation/config generation, `llms.txt` validation, and AI robots generation.
- Create `src/lib/ai-token-calculator.ts` and `src/lib/ai-token-calculator.test.ts` for token estimation, pricing constants, and cost math.
- Create `src/lib/har-viewer.ts` and `src/lib/har-viewer.test.ts` for HAR parsing and summary generation.
- Create `src/lib/world-cup-2026-bracket.ts` and `src/lib/world-cup-2026-bracket.test.ts` for static bracket slots and winner advancement.
- Create `src/components/tools/AiTokenCalculator.svelte`.
- Create `src/components/tools/HarFileViewer.svelte`.
- Create `src/components/tools/WorldCup2026BracketPredictor.svelte`.
- Modify `src/components/tools/PopularUtilityTool.svelte` for six shared-runtime tools.
- Modify `src/config/tools/development.ts`, `src/config/tools/generators.ts`, and `src/config/tools/fun.ts` through onboarding output.
- Modify `src/components/tools/ToolImportMap.ts` through `scripts/generate-tool-import-map.ts`.
- Modify locale files under `src/messages/*/base.json` and `src/messages/*/tools/<slug>.json` through onboarding output.
- Modify `src/lib/tool-launches.ts` to surface the new batch in recent launches.
- Create `data/tool-launches/high-opportunity-tools-2026-07-06.json` as the launch input used by the batch script.

---

### Task 1: Verify Current External Constants

**Files:**
- Create: `.tmp/tool-launches/high-opportunity-sources-2026-07-06.md`

**Interfaces:**
- Consumes: official public docs.
- Produces: a short source note used by Tasks 3, 5, and 8.

- [ ] **Step 1: Write the source note with exact source URLs**

Create `.tmp/tool-launches/high-opportunity-sources-2026-07-06.md` with:

```markdown
# High Opportunity Tool Sources

Checked on 2026-07-06.

## AI pricing
- OpenAI API pricing: https://platform.openai.com/docs/pricing or https://openai.com/api/pricing
- Anthropic Claude pricing: https://docs.anthropic.com/
- Google Gemini API pricing: https://ai.google.dev/gemini-api/docs/pricing
- DeepSeek API pricing: https://api-docs.deepseek.com/quick_start/pricing

## AI crawler user agents
- OpenAI crawlers: https://developers.openai.com/api/docs/bots
- Anthropic crawlers: https://support.anthropic.com/ or https://docs.anthropic.com/
- Google crawlers and Google-Extended: https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers
- Perplexity crawlers: https://docs.perplexity.ai/

## MCP and llms.txt
- Model Context Protocol documentation: https://modelcontextprotocol.io/docs/getting-started/intro
- llms.txt proposal: https://llmstxt.org/
- Chrome Lighthouse agentic browsing audits: https://developer.chrome.com/docs/lighthouse/agentic-browsing/

## World Cup 2026
- FIFA match schedule: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026
```

- [ ] **Step 2: Confirm constants before implementation**

Run:

```bash
test -s .tmp/tool-launches/high-opportunity-sources-2026-07-06.md
```

Expected: exit code `0`.

- [ ] **Step 3: Commit source note only if it becomes intentionally tracked**

Do not commit `.tmp`. If any later task needs a tracked source note, move the relevant links into the helper file comments or plan update before committing.

---

### Task 2: Shared Utility Helper

**Files:**
- Create: `src/lib/high-opportunity-tool-helpers.test.ts`
- Create: `src/lib/high-opportunity-tool-helpers.ts`

**Interfaces:**
- Produces:
  - `repairJson(input: string): JsonRepairResult`
  - `validateJsonLines(input: string): JsonLinesValidationResult`
  - `validateLlmsTxt(input: string): LlmsTxtValidationResult`
  - `generateAiRobotsTxt(input: AiRobotsInput): string`
  - `validateMcpJsonConfig(input: string): McpValidationResult`
  - `generateMcpServerConfig(input: McpServerConfigInput): string`

- [ ] **Step 1: Write failing helper tests**

Create `src/lib/high-opportunity-tool-helpers.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  generateAiRobotsTxt,
  generateMcpServerConfig,
  repairJson,
  validateJsonLines,
  validateLlmsTxt,
  validateMcpJsonConfig,
} from './high-opportunity-tool-helpers';

describe('high opportunity shared helpers', () => {
  it('repairs conservative malformed JSON syntax', () => {
    const result = repairJson(`{
      // generated by an assistant
      name: 'Ada',
      "skills": ["math", "software",],
    }`);

    expect(result.valid).toBe(true);
    expect(result.output).toBe('{\n  "name": "Ada",\n  "skills": [\n    "math",\n    "software"\n  ]\n}');
    expect(result.fixes).toEqual([
      'Removed JavaScript-style comments',
      'Quoted unquoted object keys',
      'Converted single-quoted strings',
      'Removed trailing commas',
    ]);
  });

  it('reports unrepaired JSON without inventing values', () => {
    const result = repairJson('{ "name": "Ada", "missing": }');
    expect(result.valid).toBe(false);
    expect(result.output).toBe('');
    expect(result.error).toContain('Unexpected token');
  });

  it('validates JSON Lines and reports invalid line numbers', () => {
    const result = validateJsonLines('{"id":1}\n{"id":2}\nnot json\n\n[1,2,3]');
    expect(result.valid).toBe(false);
    expect(result.validLines).toBe(3);
    expect(result.invalidLines).toEqual([{ line: 3, message: expect.stringContaining('Unexpected') }]);
    expect(result.normalized).toBe('{"id":1}\n{"id":2}\n[1,2,3]');
  });

  it('validates llms.txt structure and links', () => {
    const result = validateLlmsTxt(`# Example Docs

> Short description.

## Docs
- [API](https://example.com/api)
- Missing link`);

    expect(result.title).toBe('Example Docs');
    expect(result.links).toBe(1);
    expect(result.issues).toContain('Line 7 list item should use Markdown link syntax.');
    expect(result.warnings).toEqual([]);
  });

  it('generates AI crawler robots.txt policy blocks', () => {
    const output = generateAiRobotsTxt({
      policy: 'block-training',
      sitemapUrl: 'https://example.com/sitemap.xml',
      extraAgents: ['ExampleBot'],
    });

    expect(output).toContain('User-agent: GPTBot');
    expect(output).toContain('User-agent: ClaudeBot');
    expect(output).toContain('User-agent: Google-Extended');
    expect(output).toContain('User-agent: PerplexityBot');
    expect(output).toContain('User-agent: ExampleBot');
    expect(output).toContain('Disallow: /');
    expect(output).toContain('Sitemap: https://example.com/sitemap.xml');
  });

  it('validates MCP JSON configs with server shape warnings', () => {
    const result = validateMcpJsonConfig(JSON.stringify({
      mcpServers: {
        filesystem: { args: '--bad' },
        github: { command: 'npx', args: ['-y', '@modelcontextprotocol/server-github'], env: { GITHUB_TOKEN: 'token' } },
      },
    }));

    expect(result.validJson).toBe(true);
    expect(result.serverCount).toBe(2);
    expect(result.errors).toContain('filesystem.command is required.');
    expect(result.errors).toContain('filesystem.args must be an array when provided.');
    expect(result.warnings).toContain('github.env includes a concrete value; prefer environment placeholders for shared configs.');
  });

  it('generates MCP server config JSON for client presets', () => {
    const output = generateMcpServerConfig({
      client: 'claude',
      serverName: 'filesystem',
      command: 'npx',
      argsText: '-y @modelcontextprotocol/server-filesystem /Users/me/project',
      envText: 'DEBUG=false',
    });

    expect(JSON.parse(output)).toEqual({
      mcpServers: {
        filesystem: {
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-filesystem', '/Users/me/project'],
          env: { DEBUG: 'false' },
        },
      },
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
npx vitest run src/lib/high-opportunity-tool-helpers.test.ts
```

Expected: fail because `src/lib/high-opportunity-tool-helpers.ts` does not exist.

- [ ] **Step 3: Implement shared helper**

Create `src/lib/high-opportunity-tool-helpers.ts` with exported types and functions named in the interfaces. Implementation rules:

- `repairJson` removes block comments, line comments, trailing commas, converts single quoted strings, and quotes object keys matching `/([{,]\s*)([A-Za-z_$][\w$-]*)(\s*:)/g`; then it formats with `JSON.stringify(parsed, null, 2)`.
- `validateJsonLines` skips blank lines, parses each nonblank line, tracks one-based line numbers, and joins normalized lines with `\n`.
- `validateLlmsTxt` requires a first markdown H1, counts `- [label](https?://...)` links, flags list items that do not use Markdown link syntax, and warns when there is no blockquote summary.
- `generateAiRobotsTxt` supports `policy: 'block-training' | 'allow-discovery' | 'custom'`, includes `GPTBot`, `ClaudeBot`, `Claude-SearchBot`, `Claude-User`, `Google-Extended`, `PerplexityBot`, and `Perplexity-User`, and appends nonempty custom agents.
- `validateMcpJsonConfig` accepts a root object containing `mcpServers`, requires each server to have `command: string`, allows `args: string[]`, allows `env: Record<string, string>`, and warns when env values do not look like placeholders.
- `generateMcpServerConfig` splits args by shell-like whitespace with quoted phrase support, parses env lines as `KEY=value`, and returns pretty JSON.

- [ ] **Step 4: Run helper tests to verify pass**

Run:

```bash
npx vitest run src/lib/high-opportunity-tool-helpers.test.ts
```

Expected: all tests in the file pass.

- [ ] **Step 5: Commit shared helper**

Run:

```bash
git add src/lib/high-opportunity-tool-helpers.ts src/lib/high-opportunity-tool-helpers.test.ts
git commit -m "feat: add shared high opportunity tool helpers"
```

---

### Task 3: AI Token Calculator Helper

**Files:**
- Create: `src/lib/ai-token-calculator.test.ts`
- Create: `src/lib/ai-token-calculator.ts`

**Interfaces:**
- Produces:
  - `AI_MODEL_PRICING: AiModelPricing[]`
  - `estimateTokens(text: string): number`
  - `calculateAiTokenCost(input: AiTokenCostInput): AiTokenCostResult`

- [ ] **Step 1: Write failing token calculator tests**

Create `src/lib/ai-token-calculator.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { AI_MODEL_PRICING, calculateAiTokenCost, estimateTokens } from './ai-token-calculator';

describe('ai token calculator helper', () => {
  it('estimates tokens from text with a conservative characters-per-token ratio', () => {
    expect(estimateTokens('hello world')).toBe(3);
    expect(estimateTokens('')).toBe(0);
  });

  it('contains dated pricing metadata for supported providers', () => {
    expect(AI_MODEL_PRICING.map((model) => model.id)).toEqual(expect.arrayContaining([
      'openai-gpt-5-1',
      'anthropic-claude-sonnet-4-5',
      'google-gemini-3-pro',
      'deepseek-chat',
    ]));
    expect(AI_MODEL_PRICING.every((model) => model.pricingDate === '2026-07-06')).toBe(true);
  });

  it('calculates per-request and batch cost from per-million token pricing', () => {
    const result = calculateAiTokenCost({
      modelId: 'openai-gpt-5-1',
      promptText: 'hello world',
      outputTokens: 100,
      requestCount: 10,
    });

    expect(result.inputTokens).toBe(3);
    expect(result.outputTokens).toBe(100);
    expect(result.totalTokens).toBe(103);
    expect(result.requestCount).toBe(10);
    expect(result.perRequestCost).toBeGreaterThan(0);
    expect(result.batchCost).toBeCloseTo(result.perRequestCost * 10, 8);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
npx vitest run src/lib/ai-token-calculator.test.ts
```

Expected: fail because `src/lib/ai-token-calculator.ts` does not exist.

- [ ] **Step 3: Implement token calculator helper**

Create `src/lib/ai-token-calculator.ts` with:

- `estimateTokens` returning `Math.ceil(text.trim().length / 4)` for nonempty text.
- `AI_MODEL_PRICING` entries with fields `id`, `provider`, `model`, `inputPerMillion`, `outputPerMillion`, `pricingDate`, and `sourceUrl`.
- Initial model IDs: `openai-gpt-5-1`, `anthropic-claude-sonnet-4-5`, `google-gemini-3-pro`, `deepseek-chat`.
- `calculateAiTokenCost` looks up the model, clamps `outputTokens` and `requestCount` to nonnegative finite numbers, and computes `(inputTokens / 1_000_000) * inputPerMillion + (outputTokens / 1_000_000) * outputPerMillion`.

- [ ] **Step 4: Run token tests to verify pass**

Run:

```bash
npx vitest run src/lib/ai-token-calculator.test.ts
```

Expected: all tests in the file pass.

- [ ] **Step 5: Commit token helper**

Run:

```bash
git add src/lib/ai-token-calculator.ts src/lib/ai-token-calculator.test.ts
git commit -m "feat: add AI token cost helper"
```

---

### Task 4: HAR Viewer Helper

**Files:**
- Create: `src/lib/har-viewer.test.ts`
- Create: `src/lib/har-viewer.ts`

**Interfaces:**
- Produces:
  - `parseHarSummary(input: string): HarSummaryResult`
  - `formatBytes(bytes: number): string`

- [ ] **Step 1: Write failing HAR helper tests**

Create `src/lib/har-viewer.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatBytes, parseHarSummary } from './har-viewer';

describe('har viewer helper', () => {
  it('summarizes HAR entries by request, status, domain, bytes, and timing', () => {
    const result = parseHarSummary(JSON.stringify({
      log: {
        entries: [
          { request: { method: 'GET', url: 'https://example.com/app.js' }, response: { status: 200, content: { size: 1200 } }, time: 50 },
          { request: { method: 'POST', url: 'https://api.example.com/items' }, response: { status: 201, bodySize: 300 }, time: 220 },
          { request: { method: 'GET', url: 'https://example.com/missing' }, response: { status: 404, content: { size: 50 } }, time: 75 },
        ],
      },
    }));

    expect(result.valid).toBe(true);
    expect(result.summary).toMatchObject({
      requestCount: 3,
      totalBytes: 1550,
      totalTime: 345,
    });
    expect(result.summary?.statusGroups).toEqual({ '2xx': 2, '4xx': 1 });
    expect(result.summary?.domains).toEqual([
      { domain: 'example.com', count: 2, bytes: 1250 },
      { domain: 'api.example.com', count: 1, bytes: 300 },
    ]);
    expect(result.summary?.slowest[0].url).toBe('https://api.example.com/items');
  });

  it('rejects non-HAR JSON with a clear error', () => {
    const result = parseHarSummary('{"log":{"pages":[]}}');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('HAR log.entries must be an array.');
  });

  it('formats bytes compactly', () => {
    expect(formatBytes(950)).toBe('950 B');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
npx vitest run src/lib/har-viewer.test.ts
```

Expected: fail because `src/lib/har-viewer.ts` does not exist.

- [ ] **Step 3: Implement HAR helper**

Create `src/lib/har-viewer.ts` with:

- JSON parsing that returns `{ valid: false, error }` for invalid JSON.
- HAR shape check requiring `parsed.log.entries` to be an array.
- Byte calculation using `response.bodySize` when positive, otherwise `response.content.size` when positive.
- Status group keys such as `2xx`, `3xx`, `4xx`, `5xx`, and `other`.
- Domain extraction with `new URL(url).hostname`, falling back to `unknown`.
- `slowest` sorted by descending `time`, limited to 10 entries.
- `domains` sorted by descending `count`, then descending `bytes`.

- [ ] **Step 4: Run HAR tests to verify pass**

Run:

```bash
npx vitest run src/lib/har-viewer.test.ts
```

Expected: all tests in the file pass.

- [ ] **Step 5: Commit HAR helper**

Run:

```bash
git add src/lib/har-viewer.ts src/lib/har-viewer.test.ts
git commit -m "feat: add HAR summary helper"
```

---

### Task 5: World Cup 2026 Bracket Helper

**Files:**
- Create: `src/lib/world-cup-2026-bracket.test.ts`
- Create: `src/lib/world-cup-2026-bracket.ts`

**Interfaces:**
- Produces:
  - `WORLD_CUP_2026_GROUPS: WorldCupGroup[]`
  - `buildDefaultBracket(): WorldCupBracketState`
  - `advanceBracket(state: WorldCupBracketState, picks: Record<string, string>): WorldCupBracketResult`

- [ ] **Step 1: Write failing bracket tests**

Create `src/lib/world-cup-2026-bracket.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { WORLD_CUP_2026_GROUPS, advanceBracket, buildDefaultBracket } from './world-cup-2026-bracket';

describe('world cup 2026 bracket helper', () => {
  it('defines twelve groups for a 48-team tournament', () => {
    expect(WORLD_CUP_2026_GROUPS).toHaveLength(12);
    expect(WORLD_CUP_2026_GROUPS.every((group) => group.teams.length === 4)).toBe(true);
  });

  it('builds a default knockout bracket with thirty-two entrants', () => {
    const state = buildDefaultBracket();
    expect(state.rounds[0].name).toBe('Round of 32');
    expect(state.rounds[0].matches).toHaveLength(16);
  });

  it('advances explicit winners through the final', () => {
    const state = buildDefaultBracket();
    const picks = Object.fromEntries(
      state.rounds.flatMap((round) => round.matches.map((match) => [match.id, match.home]))
    );
    const result = advanceBracket(state, picks);
    expect(result.champion).toBe(state.rounds[0].matches[0].home);
    expect(result.rounds.at(-1)?.name).toBe('Final');
    expect(result.summary).toContain('Champion:');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
npx vitest run src/lib/world-cup-2026-bracket.test.ts
```

Expected: fail because `src/lib/world-cup-2026-bracket.ts` does not exist.

- [ ] **Step 3: Implement bracket helper**

Create `src/lib/world-cup-2026-bracket.ts` with:

- Twelve groups labeled A through L, each with four placeholder team labels such as `A1 seed`, `A2 seed`, `A3 seed`, `A4 seed`.
- `buildDefaultBracket` returning a 32-team simplified knockout bracket seeded as group winners, runners-up, and the eight highest third-place placeholders.
- Round names: `Round of 32`, `Round of 16`, `Quarterfinals`, `Semifinals`, `Final`.
- `advanceBracket` that uses provided picks when present and otherwise falls back to the home team.
- `summary` containing one line per final path and a final `Champion: <team>` line.

- [ ] **Step 4: Run bracket tests to verify pass**

Run:

```bash
npx vitest run src/lib/world-cup-2026-bracket.test.ts
```

Expected: all tests in the file pass.

- [ ] **Step 5: Commit bracket helper**

Run:

```bash
git add src/lib/world-cup-2026-bracket.ts src/lib/world-cup-2026-bracket.test.ts
git commit -m "feat: add World Cup bracket helper"
```

---

### Task 6: Custom Components

**Files:**
- Create: `src/components/tools/AiTokenCalculator.svelte`
- Create: `src/components/tools/HarFileViewer.svelte`
- Create: `src/components/tools/WorldCup2026BracketPredictor.svelte`

**Interfaces:**
- Consumes:
  - `AI_MODEL_PRICING`, `calculateAiTokenCost`
  - `parseHarSummary`, `formatBytes`
  - `buildDefaultBracket`, `advanceBracket`
- Produces: default Svelte components accepted by `ToolImportMap.ts`.

- [ ] **Step 1: Create AI token calculator component**

Create `src/components/tools/AiTokenCalculator.svelte` with:

- Props: `locale?: string`, `translations?: Record<string, unknown>`.
- State: `modelId`, `promptText`, `outputTokens`, `requestCount`, `copied`.
- Derived result from `calculateAiTokenCost`.
- UI: model select, prompt textarea, numeric output/request inputs, four result cards, source/pricing date note, copy button.
- Copy text format:

```ts
`Model: ${result.model.model}; Input tokens: ${result.inputTokens}; Output tokens: ${result.outputTokens}; Per request: ${currency(result.perRequestCost)}; Batch: ${currency(result.batchCost)}`
```

- [ ] **Step 2: Create HAR file viewer component**

Create `src/components/tools/HarFileViewer.svelte` with:

- Props: `locale?: string`, `translations?: Record<string, unknown>`.
- State: `input`, `fileName`, `copied`.
- File input using `event.currentTarget.files?.[0]?.text()`.
- Derived result from `parseHarSummary(input)`.
- UI: paste textarea, file picker, summary cards, status group list, domain table, slowest request table, copy summary button.
- Error panel for invalid HAR.

- [ ] **Step 3: Create World Cup bracket component**

Create `src/components/tools/WorldCup2026BracketPredictor.svelte` with:

- Props: `locale?: string`, `translations?: Record<string, unknown>`.
- State: `picks: Record<string, string>`, `copied`.
- Constant `state = buildDefaultBracket()`.
- Derived result from `advanceBracket(state, picks)`.
- UI: grouped rounds, each match with two selectable buttons, champion card, copy summary button.
- Note text: `Simplified predictor. It does not fetch live FIFA results.`

- [ ] **Step 4: Run Svelte type check**

Run:

```bash
npm run check
```

Expected: no TypeScript or Svelte diagnostics for the three new components.

- [ ] **Step 5: Commit custom components**

Run:

```bash
git add src/components/tools/AiTokenCalculator.svelte src/components/tools/HarFileViewer.svelte src/components/tools/WorldCup2026BracketPredictor.svelte
git commit -m "feat: add custom high opportunity tool components"
```

---

### Task 7: PopularUtilityTool Branches

**Files:**
- Modify: `src/components/tools/PopularUtilityTool.svelte`

**Interfaces:**
- Consumes:
  - `repairJson`
  - `validateJsonLines`
  - `validateLlmsTxt`
  - `generateAiRobotsTxt`
  - `validateMcpJsonConfig`
  - `generateMcpServerConfig`

- [ ] **Step 1: Import shared helper functions**

Modify the `<script>` imports in `src/components/tools/PopularUtilityTool.svelte` to import from `../../lib/high-opportunity-tool-helpers`.

- [ ] **Step 2: Add copy keys**

Extend `FALLBACK_COPY.en.fields`, `FALLBACK_COPY.en.options`, `FALLBACK_COPY.en.results`, and `FALLBACK_COPY.en.placeholders` with:

```ts
llmsTxt: 'llms.txt Content',
robotsPolicy: 'AI Crawler Policy',
sitemapUrl: 'Sitemap URL',
customAgents: 'Custom User Agents',
mcpConfig: 'MCP JSON Config',
mcpClient: 'Client Preset',
serverName: 'Server Name',
command: 'Command',
argsText: 'Arguments',
envText: 'Environment Variables',
jsonInput: 'JSON Input',
jsonlInput: 'JSONL / NDJSON Input',
blockTraining: 'Block training crawlers',
allowDiscovery: 'Allow discovery crawlers',
customPolicy: 'Custom policy',
validLines: 'Valid Lines',
invalidLines: 'Invalid Lines',
issues: 'Issues',
warnings: 'Warnings',
links: 'Links',
servers: 'Servers',
fixes: 'Fixes',
normalized: 'Normalized Output',
```

Add equivalent Chinese fallback strings to `FALLBACK_COPY.zh` for the same keys.

- [ ] **Step 3: Add field definitions**

In `getToolFields`, add cases:

- `llms-txt-validator`: one textarea field `llmsTxt`.
- `ai-robots-txt-generator`: select `robotsPolicy`, text `sitemapUrl`, textarea `customAgents`.
- `mcp-json-validator`: textarea `mcpConfig`.
- `mcp-server-config-generator`: select `mcpClient`, text `serverName`, text `command`, textarea `argsText`, textarea `envText`.
- `json-repair`: textarea `jsonInput`.
- `jsonl-validator`: textarea `jsonlInput`.

- [ ] **Step 4: Add default values**

In `getDefaults`, add realistic defaults:

- `llms-txt-validator`: a small `# Example Docs` sample with one valid markdown link.
- `ai-robots-txt-generator`: `robotsPolicy: 'block-training'`, `sitemapUrl: 'https://example.com/sitemap.xml'`, `customAgents: ''`.
- `mcp-json-validator`: `{"mcpServers":{"filesystem":{"command":"npx","args":["-y","@modelcontextprotocol/server-filesystem","."]}}}`.
- `mcp-server-config-generator`: `mcpClient: 'claude'`, `serverName: 'filesystem'`, `command: 'npx'`, `argsText: '-y @modelcontextprotocol/server-filesystem .'`, `envText: ''`.
- `json-repair`: malformed sample with comments, single quotes, unquoted key, and trailing comma.
- `jsonl-validator`: three lines with two valid JSON rows and one invalid row.

- [ ] **Step 5: Add calculate branches**

In `calculate`, add cases:

- `llms-txt-validator`: call `validateLlmsTxt`, show cards for issues, warnings, links, title, output as issue/warning text or normalized success note.
- `ai-robots-txt-generator`: call `generateAiRobotsTxt`, show crawler count and policy cards, output robots text.
- `mcp-json-validator`: call `validateMcpJsonConfig`, show server count, errors, warnings, normalized JSON.
- `mcp-server-config-generator`: call `generateMcpServerConfig`, show server name and client cards, output JSON.
- `json-repair`: call `repairJson`, show valid status and fix count, output repaired JSON or parse error.
- `jsonl-validator`: call `validateJsonLines`, show valid and invalid line counts, output normalized JSONL or line errors.

- [ ] **Step 6: Run targeted runtime check**

Run:

```bash
npm run qa:runtime-integrity
```

Expected: runtime integrity tests pass.

- [ ] **Step 7: Commit PopularUtilityTool branches**

Run:

```bash
git add src/components/tools/PopularUtilityTool.svelte
git commit -m "feat: add shared runtime high opportunity tools"
```

---

### Task 8: Batch Registration And Copy

**Files:**
- Create: `data/tool-launches/high-opportunity-tools-2026-07-06.json`
- Modify: `src/config/tools/development.ts`
- Modify: `src/config/tools/generators.ts`
- Modify: `src/config/tools/fun.ts`
- Modify: `src/components/tools/ToolImportMap.ts`
- Modify: `src/messages/*/base.json`
- Create: `src/messages/*/tools/llms-txt-validator.json`
- Create: `src/messages/*/tools/ai-robots-txt-generator.json`
- Create: `src/messages/*/tools/mcp-json-validator.json`
- Create: `src/messages/*/tools/mcp-server-config-generator.json`
- Create: `src/messages/*/tools/ai-token-calculator.json`
- Create: `src/messages/*/tools/json-repair.json`
- Create: `src/messages/*/tools/jsonl-validator.json`
- Create: `src/messages/*/tools/har-file-viewer.json`
- Create: `src/messages/*/tools/world-cup-2026-bracket-predictor.json`
- Modify: `src/lib/tool-launches.ts`

**Interfaces:**
- Consumes: components and runtime branches from Tasks 6 and 7.
- Produces: registered multilingual tool pages.

- [ ] **Step 1: Create launch input**

Create `data/tool-launches/high-opportunity-tools-2026-07-06.json` with a top-level `tools` array containing these exact tool objects:

```json
{
  "tools": [
    {
      "slug": "llms-txt-validator",
      "category": "development",
      "icon": "file-check",
      "component": "PopularUtilityTool",
      "popular": true,
      "locales": {
        "en": {
          "name": "llms.txt Validator",
          "description": "Validate llms.txt content, Markdown links, summaries, and common formatting issues before publishing.",
          "seo_title": "llms.txt Validator - Check llms.txt Format Online",
          "seo_description": "Paste llms.txt content and check headings, links, summaries, warnings, and formatting issues locally in your browser.",
          "primary_keyword": "llms txt validator"
        }
      }
    },
    {
      "slug": "ai-robots-txt-generator",
      "category": "generators",
      "icon": "bot",
      "component": "PopularUtilityTool",
      "popular": true,
      "locales": {
        "en": {
          "name": "AI Robots.txt Generator",
          "description": "Generate robots.txt policy blocks for AI crawlers such as GPTBot, ClaudeBot, Google-Extended, and PerplexityBot.",
          "seo_title": "AI Robots.txt Generator - GPTBot and ClaudeBot Rules",
          "seo_description": "Create copy-ready robots.txt rules for AI crawlers, discovery bots, sitemap URLs, and custom user agents.",
          "primary_keyword": "ai robots txt generator"
        }
      }
    },
    {
      "slug": "mcp-json-validator",
      "category": "development",
      "icon": "braces",
      "component": "PopularUtilityTool",
      "popular": true,
      "locales": {
        "en": {
          "name": "MCP JSON Validator",
          "description": "Validate Model Context Protocol JSON configs and catch missing commands, invalid args, and env shape issues.",
          "seo_title": "MCP JSON Validator - Check MCP Server Configs",
          "seo_description": "Paste an MCP JSON config and validate mcpServers, commands, args arrays, env values, and normalized output locally.",
          "primary_keyword": "mcp json validator"
        }
      }
    },
    {
      "slug": "mcp-server-config-generator",
      "category": "development",
      "icon": "server-cog",
      "component": "PopularUtilityTool",
      "popular": true,
      "locales": {
        "en": {
          "name": "MCP Server Config Generator",
          "description": "Generate copy-ready MCP server configuration JSON for Claude, Codex, Cursor, VS Code, and compatible clients.",
          "seo_title": "MCP Server Config Generator - Create mcpServers JSON",
          "seo_description": "Build MCP server config JSON from command, args, env values, and client presets without uploading your settings.",
          "primary_keyword": "mcp server config generator"
        }
      }
    },
    {
      "slug": "ai-token-calculator",
      "category": "development",
      "icon": "calculator",
      "component": "AiTokenCalculator",
      "popular": true,
      "locales": {
        "en": {
          "name": "AI Token Calculator",
          "description": "Estimate prompt tokens, output tokens, per-request cost, and batch cost for common AI API models.",
          "seo_title": "AI Token Calculator - Estimate LLM API Costs",
          "seo_description": "Estimate token counts and API costs for OpenAI, Claude, Gemini, and DeepSeek models using browser-side calculations.",
          "primary_keyword": "ai token calculator"
        }
      }
    },
    {
      "slug": "json-repair",
      "category": "development",
      "icon": "wrench",
      "component": "PopularUtilityTool",
      "popular": true,
      "locales": {
        "en": {
          "name": "JSON Repair",
          "description": "Repair common malformed JSON from AI output, logs, and copied snippets with transparent fix notes.",
          "seo_title": "JSON Repair Online - Fix Malformed JSON",
          "seo_description": "Fix trailing commas, comments, single quotes, and unquoted keys, then copy formatted JSON locally in your browser.",
          "primary_keyword": "json repair online"
        }
      }
    },
    {
      "slug": "jsonl-validator",
      "category": "development",
      "icon": "list-checks",
      "component": "PopularUtilityTool",
      "popular": true,
      "locales": {
        "en": {
          "name": "JSONL Validator",
          "description": "Validate JSON Lines and NDJSON payloads line by line with normalized output and actionable parse errors.",
          "seo_title": "JSONL Validator - Check NDJSON Lines Online",
          "seo_description": "Paste JSONL or NDJSON text and find invalid line numbers, valid row counts, and normalized JSON Lines output.",
          "primary_keyword": "jsonl validator"
        }
      }
    },
    {
      "slug": "har-file-viewer",
      "category": "development",
      "icon": "activity",
      "component": "HarFileViewer",
      "popular": true,
      "locales": {
        "en": {
          "name": "HAR File Viewer",
          "description": "View and summarize HAR files locally with request counts, status groups, domains, transfer size, and slowest requests.",
          "seo_title": "HAR File Viewer - Analyze HAR Files Online",
          "seo_description": "Paste or open a HAR file and inspect requests, domains, status codes, bytes, and slow network entries in your browser.",
          "primary_keyword": "har file viewer"
        }
      }
    },
    {
      "slug": "world-cup-2026-bracket-predictor",
      "category": "fun",
      "icon": "trophy",
      "component": "WorldCup2026BracketPredictor",
      "popular": true,
      "locales": {
        "en": {
          "name": "World Cup 2026 Bracket Predictor",
          "description": "Build a simplified 2026 World Cup knockout bracket, pick winners, and copy your champion prediction.",
          "seo_title": "World Cup 2026 Bracket Predictor - Pick Your Champion",
          "seo_description": "Create a browser-side World Cup 2026 bracket prediction, choose knockout winners, and copy your champion path.",
          "primary_keyword": "world cup 2026 bracket predictor"
        }
      }
    }
  ]
}
```

- [ ] **Step 2: Run batch launch**

Run:

```bash
npm run tools:launch -- --input data/tool-launches/high-opportunity-tools-2026-07-06.json --qa=light
```

Expected: onboarding completes, import map regenerates, changed locale QA prints the new pages.

- [ ] **Step 3: Update recent launches**

Modify `src/lib/tool-launches.ts` so `recentLongTailToolSlugs` starts with the nine new slugs, then keeps the most relevant previous long-tail launches until the array has 10 items. Use this order:

```ts
'ai-token-calculator',
'llms-txt-validator',
'ai-robots-txt-generator',
'mcp-json-validator',
'mcp-server-config-generator',
'json-repair',
'jsonl-validator',
'har-file-viewer',
'world-cup-2026-bracket-predictor',
'llms-txt-generator',
```

- [ ] **Step 4: Run launch and locale checks**

Run:

```bash
npm run i18n:check-missing-keys
npm run qa:changed-tool-locales -- --timeout-ms=30000 llms-txt-validator ai-robots-txt-generator mcp-json-validator mcp-server-config-generator ai-token-calculator json-repair jsonl-validator har-file-viewer world-cup-2026-bracket-predictor
```

Expected: both commands pass.

- [ ] **Step 5: Commit registration and copy**

Run:

```bash
git add data/tool-launches/high-opportunity-tools-2026-07-06.json src/config/tools src/components/tools/ToolImportMap.ts src/messages src/lib/tool-launches.ts src/lib/ai-discovery/generated-aliases.ts .tmp/tool-launches
git reset .tmp/tool-launches
git commit -m "feat: register high opportunity tool batch"
```

---

### Task 9: Final Verification

**Files:**
- No new files.
- Verify all files changed by Tasks 2 through 8.

**Interfaces:**
- Consumes: completed tool batch.
- Produces: evidence that pages build and targeted tests pass.

- [ ] **Step 1: Run all targeted helper tests**

Run:

```bash
npx vitest run src/lib/high-opportunity-tool-helpers.test.ts src/lib/ai-token-calculator.test.ts src/lib/har-viewer.test.ts src/lib/world-cup-2026-bracket.test.ts
```

Expected: all targeted helper tests pass.

- [ ] **Step 2: Run runtime integrity**

Run:

```bash
npm run qa:runtime-integrity
```

Expected: runtime integrity tests pass.

- [ ] **Step 3: Run type and Svelte check**

Run:

```bash
npm run check
```

Expected: no diagnostics.

- [ ] **Step 4: Run build**

Run:

```bash
npm run build
```

Expected: Astro build exits with code `0`.

- [ ] **Step 5: Inspect git diff**

Run:

```bash
git status --short
git diff --stat
```

Expected: only files for the high opportunity tool batch are modified or added.

- [ ] **Step 6: Commit verification-only fixes if needed**

If Step 1 through Step 5 reveal small fixes, make the fixes, rerun the failed command, and commit with:

```bash
git add src data
git commit -m "fix: stabilize high opportunity tool batch"
```

---

## Plan Self-Review

- Spec coverage: all nine slugs are represented in Task 8, all custom components are represented in Task 6, all shared-runtime tools are represented in Task 7, and all pure helper tests are represented in Tasks 2 through 5.
- Privacy requirement: every implementation task runs in browser-side TypeScript or Svelte and does not introduce server endpoints.
- External constants requirement: Task 1 records official source checks before pricing, crawler, MCP, llms.txt, or FIFA constants are finalized.
- Localization requirement: Task 8 uses the existing batch launch and onboarding flow and Task 9 runs locale checks.
- Verification requirement: Task 9 includes targeted tests, runtime integrity, `npm run check`, and `npm run build`.
