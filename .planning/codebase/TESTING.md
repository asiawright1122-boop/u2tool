# Testing

**Analysis Date:** 2026-05-21

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
