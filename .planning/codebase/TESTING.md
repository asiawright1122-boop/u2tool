# Testing

**Analysis Date:** 2026-06-24

## Primary Test Stack

- `vitest@^4.0.18` via `npx vitest run`
- `@astrojs/check@^0.9.9` via `npm run check`
- `fast-check@^4.6.0` for property-based translation coverage in `src/messages/translations.test.ts`
- 30+ TypeScript validation scripts under `scripts/validation/` and `scripts/seo/` driven by `tsx`
- `puppeteer@^24.38.0` is installed but not wired into the main vitest entrypoints

## Current Test Coverage Areas

**Core libraries (`src/lib/*.test.ts` — 25 files):**
- `i18n.test.ts`, `translations.test.ts`, `theme.test.ts`, `theme-contract.test.ts`
- `seo.test.ts`, `seo-recovery.test.ts`, `discovery-surface.test.ts`
- `comparison-surfaces.test.ts`, `category-support.test.ts`, `support-content-fallback.test.ts`
- `sanitize.test.ts`, `scientific-calculator.test.ts`
- `tool-stubs.test.ts`, `tool-stubs-runtime.test.ts`
- `llms-content-builder.test.ts`, `popular-tools-batch3-remaining.test.ts`
- `fill-missing-translation-keys.test.ts`

**AI discovery (`src/lib/ai-discovery/*.test.ts`):**
- `feature-flag.test.ts`, `index-builder.test.ts`, `matcher.test.ts`
- `normalize`/`query-link.test.ts`, `search-service.test.ts`
- `search-api.test.ts`, `events-api.test.ts` (relocated from `src/pages/api/ai-discovery/`)
- `regression-cases.test.ts`, `telemetry.test.ts`

**Translation corpus:**
- `src/messages/translations.test.ts` — JSON parse validation, missing-key sampling/threshold checks, fast-check property tests for non-empty values
- `src/messages/seo-governance.test.ts` — page/category SEO metadata across every locale

**Tool / shell infrastructure:**
- `src/components/tools/tool-infrastructure.test.ts`
- `src/components/tools/tools-grid-search.test.ts`
- `src/middleware.test.ts`
- `src/hooks/useChartTheme.test.ts`

## Validation / Audit Scripts

**Route + render:**
- `scripts/validation/verify-production-routes.mjs`
- `scripts/validation/validate-internal-link-canonicals.ts`
- `scripts/validation/validate-rendered-seo.ts`
- `scripts/validation/validate-tool-page-render-contract.ts`
- `scripts/validation/validate-worker-ssr-health.ts`

**SEO / discovery:**
- `scripts/validation/seo-alignment-audit.ts`
- `scripts/validation/technical-seo-audit.ts`
- `scripts/validation/validate-llms-discovery.ts`
- `scripts/validation/validate-growth-surfaces.ts`
- `scripts/validation/validate-search-engine-compliance.ts`

**Sitemap / canonicals:**
- `scripts/validation/validate-sitemap-url-health.ts`
- `scripts/validation/generate-sitemap-lastmod.ts`
- `scripts/validation/generate-seo-alignment-report.ts`

**Content trust:**
- `scripts/validation/content-trust-audit.mjs`

**Translation governance:**
- `scripts/validation/validate-translations.ts`
- `scripts/validation/fill-missing-translations.ts` (and `scripts/maintenance/fill-missing-translation-keys.ts`)

**Runtime / hooks / corruption:**
- `scripts/validation/validate-runtime-placeholder-regressions.ts`
- `scripts/validation/validate-historical-fixes.ts`
- `scripts/validation/validate-svelte-corruption.ts`
- `scripts/validation/validate-defensive-programming.ts` (+ `fix-defensive-programming.ts`)
- `scripts/validation/validate-echarts-lazy-loading.ts`
- `scripts/validation/validate-hooks-dependencies.ts`
- `scripts/validation/audit-tool-loading.ts`
- `scripts/validation/audit-tool-pages-runtime.ts`

**GSC reports (Phase 23):**
- `scripts/seo/gsc-coverage-report.ts`
- `scripts/seo/gsc-drilldown-url-report.ts`
- `scripts/seo/gsc-recovery-report.ts`
- `scripts/seo/check-gsc-recovery-inputs.ts`

## NPM Script Tiers

Single check:
- `npm run check` — `astro check`
- `npx vitest run` — full suite

Sub-suites:
- `qa:seo-governance` = i18n missing-key check + 8 vitest files
- `qa:theme-parity` = 3 vitest files (theme + theme-contract + useChartTheme)
- `qa:ai-discovery` = ai-discovery vitest + build; `:strict` adds `npm run check`; `:regression` runs regression-cases test

Production gates:
- `qa:production` = check + qa:seo-governance + qa:theme-parity + build + SSR tool-page render contract + validate:* scripts
- **`verify:production`** = qa:production + report:seo-alignment + planning:traceability + health:check (canonical release contract)
- `health:check` / `health:check:strict` (alias of verify:production)

SSR render contract:
- `npm run validate:tool-page-render-contract` fetches 11 representative `/tools/{slug}/` SSR pages and verifies stable head metadata, JSON-LD types, cluster card attributes, sibling links, and FAQ count.
- The matrix covers all 8 cluster surfaces plus FAQ, comparison-guide, CJK, and RTL routes; it is the persistent guard for the v0.0.25 Phase 84 bug where stale template fields caused cluster cards not to render.
- The command requires a reachable SSR server (`FETCH_BASE_URL` / `PROD_BASE_URL`, default `http://localhost:4321`); sandbox `listen EPERM` or localhost `fetch failed` is environmental, not a render regression.

## CI / CD

`.github/workflows/`:
- **deploy-cloudflare.yml** — push to main / manual; Node 22, builds and `wrangler deploy`. Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets.
- **performance.yml** — pull request and manual; Node 22, runs `perf:benchmark`, compares against `benchmarks/baseline.json`, uploads artifact.
- **project-health.yml** — weekly Mon 09:00 UTC and manual; Node 22, runs `verify:production`, uploads health report, opens issue on failure.

## Production QA Closure (v0.0.27 / Phase 87)

### `qa:production` Inventory

Current `package.json` chain:

```bash
npm run validate:redirect-loops && npm run check && npm run qa:seo-governance && npm run qa:theme-parity && npm run qa:runtime-integrity && npm run validate:runtime-placeholder-regressions && npm run validate:tool-svg-rendering && npm run validate:front-end-safety && npm run validate:gsc-loss-metadata && npm run build && npm run validate:tool-page-render-contract && npm run validate:robots-txt && npm run validate:decommissioned-routes && npm run validate:html-links && npm run validate:canonical-slash && npm run validate:sitemap-urls && npm run validate:production-routes && npm run validate:seo-alignment && npm run validate:technical-seo && npm run validate:llms-discovery && npm run validate:rendered-seo && npm run validate:worker-ssr && npm run validate:growth-surfaces && npm run validate:internal-link-canonicals && npm run validate:search-engine-compliance && npm run validate:hreflang-scc && npm run validate:tdk-translations && npm run validate:json-ld && npm run validate:prerender-safety && npm run validate:edge-simulation
```

Ordered release groups:

| Order | Group | Commands | Purpose | Failure meaning |
|-------|-------|----------|---------|-----------------|
| 1 | redirect / build / type safety | `validate:redirect-loops`, `check` | Catch routing loops and Astro/type regressions before deeper QA. | Usually code regression; occasionally environment/toolchain install breakage. |
| 2 | SEO governance | `qa:seo-governance` | Validate i18n key coverage, TDK integrity/drift, translation corpus, merge-chain consistency, localized longtail support, and focused Vitest SEO coverage. | Schema/content drift, governance regression, or warning-only corpus debt depending on sub-step. |
| 3 | theme / runtime integrity | `qa:theme-parity`, `qa:runtime-integrity`, `validate:runtime-placeholder-regressions`, `validate:tool-svg-rendering`, `validate:front-end-safety`, `validate:gsc-loss-metadata` | Protect tool runtime contracts, theme parity, placeholder regressions, SVG rendering, and frontend safety promises. | Usually code regression or generated-asset drift. |
| 4 | build + rendered HTML / SSR | `build`, `validate:tool-page-render-contract` | Produce the SSR bundle and verify 11 representative tool pages render the expected semantic contract. | Build failures are code/toolchain regressions; render-contract fetch failures can also be environment/network blockers if localhost SSR is unreachable. |
| 5 | routes / sitemap / production route checks | `validate:robots-txt`, `validate:decommissioned-routes`, `validate:html-links`, `validate:canonical-slash`, `validate:sitemap-urls`, `validate:production-routes` | Guard crawlability, canonicalization, sitemap integrity, and declared route health. | Usually code regression or deployment-shape drift. |
| 6 | rendered SEO / i18n / metadata / schema | `validate:seo-alignment`, `validate:technical-seo`, `validate:llms-discovery`, `validate:rendered-seo`, `validate:worker-ssr`, `validate:growth-surfaces`, `validate:internal-link-canonicals`, `validate:search-engine-compliance`, `validate:hreflang-scc`, `validate:tdk-translations`, `validate:json-ld` | Validate rendered metadata, structured data, discovery surfaces, worker SSR health, and locale graph consistency. | Code regression, content/data drift, or environment/network blocker for live-fetch checks. |
| 7 | prerender / edge simulation | `validate:prerender-safety`, `validate:edge-simulation` | Confirm prerender safety rules and edge-runtime assumptions still hold. | Usually code regression or edge-runtime contract drift. |

Warning-only gates inside the chain today:

- `validate:translation-corpus` passes with warning-only namespace issues when schema errors and coverage gaps are zero.
- `validate:merge-chain-consistency` passes with warning-only layer overlap findings when resolved divergences remain zero.
- These warnings are visible release evidence, but **they do not block v0.0.27 closure** unless their scripts start exiting non-zero.

### Environment Preflight Checklist

Use this checklist before any SSR-backed local release run:

1. Confirm dependencies are installed and Node satisfies `>=22.12.0`.
2. Confirm any required local secrets/config already live in `.env.local` if your normal dev flow depends on them.
3. Start local SSR from a normal terminal, not the Codex sandbox:

```bash
npm install
npm run dev -- --host 127.0.0.1 --port 4321
```

4. Confirm the local SSR target responds before running render gates:

```bash
curl -I http://127.0.0.1:4321/en/tools/youtube-tags-generator/
```

Expected probe result: HTTP `200 OK` (or another explicit success code from the local SSR server), with no connection refusal / timeout.

5. Run the SSR-backed render contract against that exact base URL:

```bash
FETCH_BASE_URL=http://127.0.0.1:4321 npm run validate:tool-page-render-contract -- --timeout-ms 30000
```

Environment notes:

- `validate:tool-page-render-contract` resolves `FETCH_BASE_URL` first, then `PROD_BASE_URL`, then defaults to `http://localhost:4321`.
- Astro is running with the Cloudflare adapter, so a healthy local SSR process matters for rendered-page checks even when offline validation is green.
- In the Codex desktop sandbox, local bind/listen/fetch may fail with `listen EPERM` or `fetch failed`. Treat that as an **environment/network blocker**, not as evidence that rendered HTML regressed.

### Failure Taxonomy

| Bucket | Meaning | Current examples | Release action |
|--------|---------|------------------|----------------|
| code regression | Code, config, or template behavior no longer satisfies an established contract. | `npm run check` type errors; `validate:tool-page-render-contract` drift on missing `data-tool-cluster`; `validate:runtime-placeholder-regressions` failures. | Block release, fix code, rerun the failing gate. |
| content/data drift | Source messages, metadata, routes, or generated governance data no longer match the expected corpus. | `validate:translation-corpus` schema/coverage failures; `validate:tdk-drift` mismatches; `validate:tdk-translations` failures. | Block release until source truth or generator output is corrected. |
| environment/network blocker | The validator could not reach the runtime or external dependency needed to judge behavior. | `listen EPERM` during local SSR startup; `fetch failed` / timeout against unreachable `FETCH_BASE_URL`; sandboxed localhost denial in Codex. | Do not claim pass or fail; rerun in a reachable local terminal or CI and record the exact blocker. |
| warning-only hygiene debt | Known audit noise that is still surfaced, but intentionally non-blocking for this milestone. | `validate:translation-corpus` namespace issues (`0` at the latest Phase 90 follow-up checkpoint on 2026-06-26); `validate:merge-chain-consistency` layer overlap warnings (`0` at the latest Phase 90 follow-up checkpoint on 2026-06-26). | Record warning counts in release evidence; use the new hotspot summaries to decide whether a warning batch is historical debt or a fresh regression. |

### Translation Governance Checkpoint (2026-06-26)

Latest focused warning-reduction evidence:

```bash
npm run validate:merge-chain-consistency -- --top 20 --report-path .planning/research/reports/merge-chain-phase90-all-shadow-cleanup.json
npm run validate:translation-corpus -- --top 20 --report-path .planning/research/reports/translation-corpus-phase90-all-shadow-cleanup.json
npx vitest run scripts/validation/validate-translation-corpus.test.ts scripts/validation/validate-merge-chain-consistency.test.ts src/lib/translations.test.ts src/lib/support-content-fallback.test.ts
npm run qa:seo-governance
npm run check
npm run build
```

Results:

- `validate:translation-corpus`: PASS, `Schema errors: 0`, `Coverage gaps: 0`, `Namespace issues: 0`
- namespace shape summary: `missing_only=0`, `extra_only=0`, `mixed=0`
- `validate:merge-chain-consistency`: PASS, `Layer overlap: 0`, `Resolved divergences: 0`, `EN-fallback resolutions: 0`
- merge layer shape summary: `root=0`, `base=0`, `both=0`
- focused regression tests: `4` files / `190` tests / PASS
- `qa:seo-governance`: PASS. It reconfirmed `0` missing i18n keys, `5570/5570` TDK drift records resolved, both translation-governance warning channels at `0`, localized long-tail support for `90` files, and `16` Vitest files / `187` tests passing. It also surfaced `2802` warning-only TDK compliance suggestions.
- `npm run check`: PASS with `0` errors and `0` warnings; Astro emitted `13` existing unused-symbol hints.
- `npm run build`: PASS for Cloudflare server output; existing Vite browser-compat externalization warnings were non-fatal.

### Guarded Release Command Recipes

Never run release validation and git actions as separate bare lines in the same paste block. Use one of these guarded recipes instead.

Focused local SSR guard:

```bash
FETCH_BASE_URL=http://127.0.0.1:4321 npm run validate:tool-page-render-contract -- --timeout-ms 30000 && git status -sb
```

Focused Phase 87 evidence run:

```bash
npx vitest run src/lib/tool-cluster-factory.test.ts scripts/validation/tool-page-render-contract.test.ts && npm run validate:translation-corpus && npm run validate:merge-chain-consistency && npm run validate:tdk-drift
```

Full local production QA closure:

```bash
FETCH_BASE_URL=http://127.0.0.1:4321 npm run qa:production && git status -sb
```

Only after the guarded validation command succeeds should release actions continue:

```bash
FETCH_BASE_URL=http://127.0.0.1:4321 npm run qa:production && git status -sb && git add -A && git commit -m "..." && git push
```

### Phase 87 Evidence Minimum

Before closing a release milestone, capture at least:

- Exact commands run.
- Pass/fail totals for each command.
- Warning-only counts for non-blocking audits.
- Local SSR URL used for rendered-page gates.
- Current branch state and commit SHA.
- Any skipped gates plus the exact reason (`Codex sandbox listen EPERM`, unreachable localhost, CI-only dependency, etc.).

Store that record in the phase validation file for the active milestone.

## Online Metadata Drift Smoke (v0.0.29)

`validate:tdk-drift:online` is now a scoped release-governance workflow rather
than a bare `--online` toggle. It supports:

- `--scope full|smoke|targeted`
- `--base-url`
- `--locales`
- `--slugs`
- `--report-path` / `--json-out`
- `--summary-path`
- `--concurrency`
- `--jitter-range`
- `--timeout-ms`
- `--bypass-token`

Representative smoke cohort:

- `en/bar-chart-generator`
- `en/json-formatter`
- `en/markdown-editor`
- `ja/json-formatter`
- `ar/password-generator`
- `en/screen-recorder`
- `en/ip-geolocation`

### Local rehearsal

```bash
FETCH_BASE_URL=http://127.0.0.1:4321 npm run validate:tdk-drift:online -- --scope smoke --report-path .planning/research/reports/tdk-drift-v0.0.29-smoke.json --summary-path .planning/research/reports/tdk-drift-v0.0.29-smoke-summary.md --timeout-ms 30000
```

Latest local result (2026-06-24):

- PASS
- `42/42` MATCH
- `0` transport failures
- blocker = `none`

### Production smoke

```bash
npm run validate:tdk-drift:online:prod-smoke -- --report-path .planning/research/reports/tdk-drift-v0.0.29-prod-smoke.json --summary-path .planning/research/reports/tdk-drift-v0.0.29-prod-smoke-summary.md --timeout-ms 30000
```

Current baseline snapshot (2026-06-24, reachable local terminal):

- Report path: `.planning/research/reports/tdk-drift-v0.0.29-prod-smoke.json`
- Summary path: `.planning/research/reports/tdk-drift-v0.0.29-prod-smoke-summary.md`
- Content result: `42/42` MATCH
- Exit behavior: `0`
- blocker = `none`

Interpretation:

- The production target is reachable and returns clean metadata for the smoke
  cohort.
- This establishes the first formal production metadata-drift baseline for
  v0.0.29.
- Cloudflare dashboard inspection on 2026-06-24 showed no active custom rule
  using `x-waf-bypass-token` for the current zone, so `WAF_BYPASS_TOKEN` is
  optional infrastructure rather than a required prerequisite for this deploy.
- Placeholder text is not a valid token. If you literally pass example text
  such as `你真实的WAF_BYPASS_TOKEN`, the validator now exits early with
  `invalid-bypass-token` so that placeholder misuse is not misread as a
  production reachability failure.

### Release placement decision

Keep this smoke run as a **manual pre-release step** for now.

Do not wire it into `qa:smoke` or `verify:production` yet because:

- it depends on production network access;
- some deployments may optionally depend on a WAF secret not required by normal local QA;
- the full online sweep remains too expensive for default local release paths.

Weekly CI is a possible follow-up once the secret contract is routine, but it is
not the default placement today.

## TDK Integrity Warning Summaries (v0.0.31)

`validate:tdk-integrity` now supports scoped release evidence output:

- `--help`
- `--top <n>`
- `--report-path <path>`
- `--json-out <path>`

Baseline capture:

```bash
npm run validate:tdk-integrity -- --top 5 --report-path .planning/research/reports/tdk-integrity-v0.0.31-baseline.json
```

Baseline result (2026-06-26):

- PASS
- `0` hard errors
- `2802` warning-only findings
- by field: `seo_title=442`, `seo_description=2360`
- by direction: `short=6`, `long=2796`

After the first top-overrun cleanup:

```bash
npm run validate:tdk-integrity -- --top 5 --report-path .planning/research/reports/tdk-integrity-v0.0.31-after-top10.json
```

Current result:

- PASS
- `0` hard errors
- `2792` warning-only findings
- by field: `seo_title=442`, `seo_description=2350`
- by direction: `short=6`, `long=2786`

Interpretation:

- TDK length/style warnings remain non-blocking SEO optimization debt.
- Missing metadata namespaces, empty `seo_title` / `seo_description`, and
  forbidden placeholder tokens remain hard errors.
- Full finding detail lives in the JSON report; console output should be used
  for hotspot triage and regression comparison.

## TDK Cleanup Candidate Export (v0.0.32)

`validate:tdk-integrity` can now emit a ranked cleanup queue without changing
the default hard-fail policy:

- `--candidates-path <path>`
- `--candidate-top <n>`
- `--candidate-locales <comma-list>`
- `--candidate-fields <seo_title|seo_description>`
- `--candidate-directions <short|long>`

Candidate export command:

```bash
npm run validate:tdk-integrity -- --top 5 --report-path .planning/research/reports/tdk-integrity-v0.0.32-after-candidates.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.32-top20.json --candidate-top 20 --candidate-fields seo_description --candidate-directions long
```

Current result (2026-06-27):

- PASS
- `0` hard errors
- `2792` warning-only findings
- candidate count: `20`
- candidate filters: `fields=seo_description`, `directions=long`, `limit=20`
- each candidate includes rank, locale, slug, category, field, length bounds,
  overrun size, current value evidence, source file paths, and root/base
  source-layer status.

Interpretation:

- Use this export to plan bounded metadata cleanup batches.
- Prefer `root_base_match` candidates first because synchronized edits are
  straightforward to review.
- `.planning/research/reports/` remains gitignored; commit only summarized
  phase evidence and code/tests.

## TDK Cleanup Batch Evidence (v0.0.33)

The first candidate-driven cleanup batch used the v0.0.32 export to trim exactly
10 synchronized `root_base_match` overlong `seo_description` entries in `es`,
`fr`, and `pt`.

After-cleanup command:

```bash
npm run validate:tdk-integrity -- --top 5 --report-path .planning/research/reports/tdk-integrity-v0.0.33-after-top10.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.33-after-top20.json --candidate-top 20 --candidate-fields seo_description --candidate-directions long
```

Current result (2026-06-27):

- PASS
- `0` hard errors
- `2782` warning-only findings, down from `2792`
- `seo_description=2340`, down from `2350`
- `long=2776`, down from `2786`
- focused root/base sync check passed for all 10 edited pairs

Interpretation:

- Candidate exports can now drive small, auditable copy cleanup batches.
- Continue with Latin-script `root_base_match` candidates before taking on
  larger JA/KO/RU/AR review-sensitive batches.

## TDK Cleanup Batch Evidence (v0.0.34)

The second candidate-driven cleanup batch trimmed exactly 10 synchronized
`root_base_match` overlong `seo_description` entries in `es` and `pt`.

After-cleanup command:

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.34-final.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.34-final-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Current result (2026-06-27):

- PASS
- `0` hard errors
- `2772` warning-only findings, down from `2782`
- `seo_description=2330`, down from `2340`
- `long=2766`, down from `2776`
- focused root/base sync check passed for all 10 edited pairs

Interpretation:

- The candidate-export workflow is repeatable for small metadata cleanup
  batches.
- Continue with Latin-script `root_base_match` candidates before taking on
  larger JA/KO/RU/AR review-sensitive batches.

## TDK Cleanup Batch Evidence (v0.0.35)

The third candidate-driven cleanup batch trimmed exactly 10 synchronized
`root_base_match` overlong `seo_description` entries in `es`, `fr`, and `pt`.

After-cleanup command:

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.35-final.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.35-final-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Current result (2026-06-27):

- PASS
- `0` hard errors
- `2762` warning-only findings, down from `2772`
- `seo_description=2320`, down from `2330`
- `long=2756`, down from `2766`
- focused root/base sync check passed for all 10 edited pairs

Interpretation:

- Candidate JSON rank order is the selection source of truth when same-overrun
  candidates tie in the CLI summary.
- Continue with Latin-script `root_base_match` candidates before taking on
  larger JA/KO/RU/AR review-sensitive batches.

## TDK Cleanup Batch Evidence (v0.0.36)

The fourth candidate-driven cleanup batch trimmed exactly 10 synchronized
`root_base_match` overlong `seo_description` entries in `es`, `fr`, and `pt`.

After-cleanup command:

```bash
npm run validate:tdk-integrity -- --top 10 --report-path .planning/research/reports/tdk-integrity-v0.0.36-final.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.36-final-top30.json --candidate-top 30 --candidate-fields seo_description --candidate-directions long
```

Current result (2026-06-27):

- PASS
- `0` hard errors
- `2752` warning-only findings, down from `2762`
- `seo_description=2310`, down from `2320`
- `long=2746`, down from `2756`
- focused root/base sync check passed for all 10 edited pairs

Interpretation:

- The candidate-export workflow continues to support small, auditable metadata
  cleanup batches.
- The next largest Latin-script candidates include `es/json-to-table`,
  `fr/small-text-generator`, `pt/tree-chart-generator`,
  `pt/shoe-size-converter`, and `pt/financial-forecast-calculator`.

## Latest Verification Snapshot (2026-06-24)

- **`npx vitest run src/lib/tool-cluster-factory.test.ts scripts/validation/tool-page-render-contract.test.ts`**: 2 files / 26 tests / PASS
- **`npm run validate:translation-corpus -- --top 5`**: PASS with `307` warning-only namespace issues; schema errors `0`, coverage gaps `0`; summary now breaks findings down by kind, drift shape, top locales, and top keys.
- **`npm run validate:merge-chain-consistency -- --top 5`**: PASS with `15241` warning-only overlap findings; `0` resolved divergences; summary now breaks overlap down by `root` / `base` / `both` plus top locales and slugs.
- **`npm run validate:tdk-drift`**: PASS, `5570/5570` records resolved
- **`curl -I http://127.0.0.1:4321/en/tools/youtube-tags-generator/`**: HTTP `200 OK`
- **`FETCH_BASE_URL=http://127.0.0.1:4321 npm run validate:tool-page-render-contract -- --timeout-ms 30000`**: PASS, `11/11` routes

## Latest Verification Snapshot (2026-05-21)

- **`npm run check`**: 143 files / 0 errors / 0 warnings / 0 hints
- **`npx vitest run`**: 32 files / 227 tests / ~5s (绿色全通)
- **`npm run build`**: 正常通过，针对 Edge Runtime 优化
- **`npm run health:check`**: **🟢 EXCELLENT** (0 临时文件, 所有 Spec 已归档, 0 构建警告, 0 未使用依赖)
- **`npm run check:gsc-recovery-inputs`**: **✅ SUCCESS** (11个 GSC 核心数据文件已全部在 `exports/gsc/` 到齐并成功通过完整性验证)
- **`npm run verify:production`**: 全链条绿色通过，符合上游发布门禁标准

## Gaps

- 虽然安装了 `puppeteer`，但仍未在主发布门禁中引入浏览器端 E2E 冒烟测试。
- 翻译完整性测试对于非核心（尾部）命名空间仍允许一定比例的容错缺失。
- 性能基准测试（benchmarking）目前仅在 PR 工作流中执行，尚未并入 `verify:production` 门禁。
- 随着校验脚本增加，`scripts/validation/` 部分逻辑存在一定的边界重叠，未来可做精简。

## Recommended Testing Direction

- 优先使用 `puppeteer` 对高流量重点页面（如主页、核心工具详情页、对比页、AI页面）的各 locale 渲染结果构建简单的 E2E 冒烟测试。
- 待 v2 版翻译在全部 locale 下稳定后，进一步收紧翻译键缺失门禁。
- 充分利用已到齐的 11 个 GSC 数据输入，编写自动化数据对齐单元测试，确保高权重的 top urls 不会出现 description 漂移。

---

*Testing analysis: 2026-05-21*
