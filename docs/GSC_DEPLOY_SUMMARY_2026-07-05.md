# GSC Deploy Summary - 2026-07-05

## Scope

This deploy candidate contains the completed GSC/SEO recovery content batches recorded in `docs/GSC_RECOVERY_WORKLOG_2026-07-05.md`.

## Coverage

- P1 URLs in `docs/SEO_GEO_AUDIT_MATRIX_2026-07-05.md`: `105`.
- P1 URLs covered by the worklog: `105`.
- P1 URLs remaining for content/metadata inspection: `0`.
- GSC request-indexing ledger mutations: `0`.
- GSC URL Inspection submissions: `0`.

## Main Changes

- Replaced generic or overbroad localized SEO descriptions with component-accurate SERP copy.
- Synchronized selected root/base metadata where parsed locale output diverged.
- Rewrote support copy that claimed unsupported behavior, including live database/security execution, advanced rendering engines, drag controls, exports, upload modes, balancing algorithms, file parsing, and unimplemented editor controls.
- Verified already-accurate pages without changing their copy where the current metadata and support content matched implemented behavior.

## Final Validation

- `npm run validate:gsc-loss-metadata` passed with `checks=65`.
- `npx vitest run scripts/validation/gsc-high-value-content.test.ts` passed with `89` tests.
- `npm run qa:seo-governance` passed with `16` test files and `240` tests.
- `npm run check` passed with `0` errors and the existing `13` hints.
- `npm run build` passed.

## Deployment

- Manual Cloudflare Workers deploy completed on 2026-07-05.
- Initial P1 deploy version: `1aa15c70-a650-4b8a-8f40-b0f288116f14`.
- Final deployed Worker version after the Spanish Word Counter TDK sync: `a9e30cc0-23be-46c1-950e-3047b67ab7b9`.
- `https://www.u2tool.com/en/tools/excel-to-csv/`, `https://www.u2tool.com/zh/tools/sql-injection-tester/`, `https://www.u2tool.com/ru/tools/video-to-base64/`, and `https://www.u2tool.com/fr/tools/html-to-pdf/` returned `200 text/html` after deployment.
- `npm run validate:search-engine-compliance` passed against `https://www.u2tool.com`.
- Cache-busted production smoke confirmed `https://www.u2tool.com/es/tools/word-counter/?v=a9e30cc0` serves `Contador de palabras online gratis - U2Tool`.
- Cache-busted production status sweep checked `94` unique P1 URLs extracted from the worklog with `?v=a9e30cc0`; all returned `200`, failures `0`.
- Follow-up unversioned production validation confirmed `https://www.u2tool.com/es/tools/word-counter/` now serves `Contador de palabras online gratis - U2Tool` with a fresh HTML cache `MISS`.
- `npm run validate:rendered-seo` passed against `https://www.u2tool.com` after the CDN cache refreshed.

## Known Warnings

- `npm run qa:seo-governance` retains `2491` TDK length warnings as existing optimization debt.
- `npm run build` retains existing Vite externalization warnings for Node modules imported by `src/lib/translations.ts`; these warnings did not fail the build.
- Immediate post-deploy validation briefly saw a stale Cloudflare CDN HTML cache entry for unversioned `https://www.u2tool.com/es/tools/word-counter/`; it later refreshed naturally and the unversioned rendered SEO gate passed.

## Diff Audit Notes

- App logic/components were not changed for this deploy candidate.
- GSC request-indexing ledger/export files were not changed.
- The intended files are localized message JSON, split support JSON, superpowers plan docs, this deploy summary, and `docs/GSC_RECOVERY_WORKLOG_2026-07-05.md`.

## Release Note

Completed P1 GSC content recovery coverage for all 105 P1 URLs in the 2026-07-05 audit matrix. This release tightens localized SEO metadata and support copy to match actual browser-side tool behavior, with no GSC request-indexing ledger mutation and no URL Inspection submission.

## Post-Deploy Monitoring

After deployment, compare affected URLs in the next GSC export using the 7/14/28-day checkpoint method from `docs/GSC_RECOVERY_MEASUREMENT_REPORT_2026-06-09.md`.

Use `docs/GSC_P1_POST_DEPLOY_CHECKPOINTS_2026-07-05.md` for the 2026-07-12, 2026-07-19, and 2026-08-02 P1 checkpoint export convention and decision labels.
