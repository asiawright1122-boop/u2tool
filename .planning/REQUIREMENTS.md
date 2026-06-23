# Requirements: v0.0.27 - TBD

## Milestone Goal

TBD. v0.0.26 已完成并归档；下一步需要先选择 v0.0.27 的主题，再冻结 requirements。

## Candidate Directions

1. **Production QA Closure** — 在可运行 SSR/Cloudflare 环境里跑完整 `qa:production`，整理剩余环境/链路阻塞，形成可重复 release checklist。
2. **Online TDK / Metadata Baseline** — 执行 `validate:tdk-drift:online`，建立生产环境 source-truth ↔ live-rendered metadata drift 基线。
3. **Render Gate CI Ergonomics** — 改善 render gate 的开发者体验，例如更清晰的 local preview 启动文档、CI/local split、或防止失败后误提交的脚本封装。
4. **Translation Namespace Warning Reduction** — 处理 `validate:translation-corpus` 的 325 个 namespace warnings 与 merge-chain overlap warnings，降低长期噪音。

## Requirements

TBD after v0.0.27 direction selection.

## Fresh Baseline Evidence

- v0.0.26 commit: `eed8e7dd Add persistent tool page render contract gate` pushed to `origin/main`.
- Local SSR render contract gate on 2026-06-23: `FETCH_BASE_URL=http://127.0.0.1:4321 npm run validate:tool-page-render-contract -- --timeout-ms 30000` — PASS, 11/11 routes.
- Focused offline verification on 2026-06-23: `tool-cluster-factory.test.ts` + `tool-page-render-contract.test.ts` — PASS, 26/26 tests.
- Offline corpus gates on 2026-06-23: `validate:translation-corpus`, `validate:merge-chain-consistency`, and `validate:tdk-drift` — PASS with warning-only namespace/overlap noise.
