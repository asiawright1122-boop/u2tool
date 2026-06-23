# Requirements: v0.0.26 - Persistent Render Regression Gate

## Milestone Goal

把 v0.0.24 的一次性 `[slug].astro` HTML 快照方法升级成可长期运行的 render 回归 gate：用固定代表性页面矩阵抓取 SSR HTML，抽取稳定的页面契约（head、structured data、cluster cards、FAQ、support copy、related links），并接入 `qa:production`，防止类似 v0.0.25 Phase 84 的 `Card` 字段遗留 bug 再次溜过类型/构建检查。

This is a **validation-infrastructure** milestone: it should not change product rendering, translation content, SEO output, URL routing, or user-facing UI. It adds a durable regression net around already-shipped behavior.

## Motivation

- **Phase 84 暴露了测试盲区**：v0.0.25 审计发现 `[slug].astro` 模板仍解构不存在的 `Card` 字段，运行时会导致 cluster cards 区域不渲染。Phase 85 已修复，但该类“模板字段漂移”需要常驻 gate。
- **一次性快照不可持续**：v0.0.24 的 `scripts/validation/snapshot-tool-pages.ts` 能证明 refactor 前后等价，但未纳入 `qa:production`，也依赖人工比较快照目录。
- **完整 byte diff 成本高且脆弱**：Astro/Cloudflare SSR 输出包含构建资产 hash 与空白差异。v0.0.26 应抽取稳定 DOM/HTML 契约，而不是长期保存整页 HTML golden。
- **C 已解除发布阻塞**：v0.0.23 的 translation-corpus debt 已修复。Fresh verification on 2026-06-23: `validate:translation-corpus` exits 0 with `Schema errors: 0`, `Coverage gaps: 0`, namespace warnings only; `validate:merge-chain-consistency` and `validate:tdk-drift` also pass.

## Requirements

### Persistent Render Gate (PRG)

- [x] **PRG-01** - **Representative render matrix**: Extract the v0.0.24 snapshot page matrix into a typed reusable constant covering all 8 tool clusters plus FAQ, support-content fallback, comparison guide, CJK, and RTL pages. The matrix must include at least these 11 entries: `en/bar-chart-generator`, `en/youtube-tags-generator`, `en/json-formatter`, `en/image-compressor`, `en/currency-converter`, `en/pdf-to-image`, `en/password-generator`, `en/word-counter`, `en/markdown-editor`, `ja/json-formatter`, `ar/password-generator`.
- [x] **PRG-02** - **Stable HTML contract extractor**: Add a zero-dependency extractor that converts raw rendered HTML into a stable contract object instead of storing full HTML. Contract fields must include: HTTP status, `<title>`, meta description, canonical URL, h1 text, JSON-LD `@type` set, `data-tool-cluster` entries, `data-tool-cluster-group` entries, sibling tool hrefs, FAQ question count, and sentinel body text presence.
- [x] **PRG-03** - **Cluster card runtime assertions**: For each cluster matrix page, assert the expected unified `data-tool-cluster="<prefix>"` appears, at least one `data-tool-cluster-group` appears, and at least one sibling tool link appears. This is the direct regression guard for the Phase 84 `Card` discriminator bug.
- [x] **PRG-04** - **Render validation script**: Add `scripts/validation/validate-tool-page-render-contract.ts` with CLI options `--base-url`, `--filter`, and `--json-out`; `--update-baseline` is reserved and fails fast until a committed-baseline workflow exists. Default mode validates against committed stable expectations and exits non-zero on contract drift.
- [x] **PRG-05** - **Unit tests for contract logic**: Add Vitest coverage for extractor/comparator behavior, including a fixture where `data-tool-cluster` is missing and the comparator fails with a specific cluster-card regression message.
- [x] **PRG-06** - **qa:production wiring**: Add `validate:tool-page-render-contract` to `package.json` and wire it into `qa:production` after `build` and before broader rendered SEO checks. It must support local `FETCH_BASE_URL` / `PROD_BASE_URL` conventions already used by `validate-rendered-seo.ts`.
- [x] **PRG-07** - **Document local-server limitation**: Document that this gate requires a reachable SSR server. In sandboxed environments that cannot bind/listen/fetch localhost, mark the result as environmental rather than code regression. Do not weaken the gate for normal CI/dev environments.

## Out of Scope

- **Changing `[slug].astro` rendering** — no template, SEO, structured data, ToolWrapper, support-content, FAQ, or cluster card output changes unless a failing contract reveals a real existing regression.
- **Changing translation content** — C already fixed schema/coverage debt; this milestone only guards rendered behavior.
- **Browser E2E automation** — no Puppeteer/Playwright dependency unless the HTML contract approach proves insufficient.
- **Full-page golden snapshots in git** — store compact expectations/fixtures only; avoid committed full rendered HTML.
- **Production-only online probing** — default gate should run against local SSR build/preview when available. Production probing remains opt-in through base URL overrides.

## Key Design Constraints

1. **Stable over exhaustive**: Prefer durable semantic assertions over byte-for-byte HTML comparison. The goal is to catch user-visible/render-contract regressions without flaking on asset hashes or whitespace.
2. **Offline/local first**: Reuse `fetchHtmlWithRetry` / `getTagContent` from `src/lib/seo-probe.ts` and existing `FETCH_BASE_URL` / `PROD_BASE_URL` conventions. Do not require production network in default mode.
3. **Phase 84 guard is mandatory**: Missing `data-tool-cluster`, missing cluster groups, or missing sibling links on a cluster matrix page must fail the gate.
4. **Small committed baseline**: If a baseline file is needed, keep it compact JSON under `scripts/validation/fixtures/` or `src/lib/__fixtures__/`, not `.planning/` or `.snapshots/`.
5. **Clear failure output**: Failures must name the route, contract field, expected value, actual value, and likely affected surface.

## Traceability

| Requirement ID | Description | Assigned Phase | Status |
| :--- | :--- | :--- | :--- |
| **PRG-01** | Representative render matrix | Phase 86 | ✅ Implemented |
| **PRG-02** | Stable HTML contract extractor | Phase 86 | ✅ Implemented |
| **PRG-03** | Cluster card runtime assertions | Phase 86 | ✅ Implemented |
| **PRG-04** | Render validation script | Phase 86 | ✅ Implemented |
| **PRG-05** | Unit tests for contract logic | Phase 86 | ✅ Implemented |
| **PRG-06** | qa:production wiring | Phase 86 | ✅ Implemented |
| **PRG-07** | Local-server limitation docs | Phase 86 | ✅ Implemented |

## Fresh Baseline Evidence

- `npm run validate:translation-corpus` — PASS on 2026-06-23 (`Schema errors: 0`, `Coverage gaps: 0`, `Namespace issues: 325` warnings only).
- `npm run validate:merge-chain-consistency` — PASS on 2026-06-23 (`Resolved divergences: 0`, `EN-fallback resolutions: 0`, layer overlap warnings only).
- `npm run validate:tdk-drift` — PASS on 2026-06-23 (`5570/5570` offline records resolved).
- `npx vitest run src/lib/tool-cluster-factory.test.ts ... src/lib/translations.test.ts` — PASS on 2026-06-23 (`10` files, `76` tests).
