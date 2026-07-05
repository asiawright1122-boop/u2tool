# GSC P1 Post-Deploy Checkpoints - 2026-07-05

## Scope

- Deploy date: 2026-07-05.
- Final deployed Worker version: `a9e30cc0-23be-46c1-950e-3047b67ab7b9`.
- Source worklog: `docs/GSC_RECOVERY_WORKLOG_2026-07-05.md`.
- Matrix source: `docs/SEO_GEO_AUDIT_MATRIX_2026-07-05.md`.
- P1 matrix rows covered: `105`.
- Unique production URLs extracted from the worklog for monitoring: `94`.
- Additional P0 exposure-loss URL to compare at the same checkpoints: `https://www.u2tool.com/en/tools/gantt-chart-generator/`.
- GSC request-indexing submissions from this release: `0`.

## Immediate Post-Deploy State

- `npm run validate:search-engine-compliance` passed against `https://www.u2tool.com`.
- Cache-busted production status sweep checked all `94` unique P1 URLs with `?v=a9e30cc0`; all returned `200`, failures `0`.
- `https://www.u2tool.com/es/tools/word-counter/?v=a9e30cc0` served the corrected title `Contador de palabras online gratis - U2Tool`.
- Unversioned `https://www.u2tool.com/es/tools/word-counter/` briefly hit a stale Cloudflare CDN HTML cache entry immediately after deploy, then refreshed naturally. Follow-up validation served `Contador de palabras online gratis - U2Tool` with `x-u2tool-html-cache: MISS`.
- `npm run validate:rendered-seo` passed against `https://www.u2tool.com` after the CDN cache refreshed.
- The remaining P0 Gantt URL was source-verified in this closure pass and remains covered by the existing Gantt query-intent metadata/content guards.

## Local Monitoring Artifacts

These files are generated locally under `exports/`, which is gitignored in this repository:

```text
exports/seo/gsc-p1-post-deploy-monitoring/2026-07-05/p1-monitoring-urls.csv
exports/seo/gsc-p1-post-deploy-monitoring/2026-07-05/p1-monitoring-urls.json
exports/seo/gsc-p1-post-deploy-monitoring/2026-07-05/p1-monitoring-urls.txt
```

They contain the `94` unique P1 URLs extracted from `docs/GSC_RECOVERY_WORKLOG_2026-07-05.md`, their cache-busted probe URLs, locale, slug, deploy version, checkpoint dates, request-indexing status, and immediate post-deploy smoke status.

Regenerate them with:

```bash
npm run report:gsc-p1-post-deploy-monitoring
```

Regenerate and re-smoke the cache-busted URLs with:

```bash
npm run report:gsc-p1-post-deploy-monitoring -- --smoke true
```

Script validation performed on 2026-07-05:

```bash
npx vitest run scripts/seo/gsc-p1-post-deploy-monitoring-list.test.ts
npx tsc --noEmit --skipLibCheck --module NodeNext --moduleResolution NodeNext --target ES2022 scripts/seo/gsc-p1-post-deploy-monitoring-list.ts scripts/seo/gsc-p1-post-deploy-monitoring-list.test.ts
```

## Checkpoint Dates

| Checkpoint | Date | Purpose |
|---|---|---|
| 7-day | 2026-07-12 | Confirm recrawl/indexing movement and early impression return without judging final recovery. |
| 14-day | 2026-07-19 | Flag indexed pages with flat impressions for snippet/internal-link review. |
| 28-day | 2026-08-02 | Decide which P1 families recovered, stayed flat, or need another repair wave. |

## Export Convention

Create checkpoint folders under:

```text
exports/gsc/checkpoints/2026-07-12/
exports/gsc/checkpoints/2026-07-19/
exports/gsc/checkpoints/2026-08-02/
```

Use these filenames in each folder:

```text
pages-current.xlsx
pages-previous.xlsx
queries-current.xlsx
queries-previous.xlsx
page-indexing-cohort-notes.md
```

If Search Console's latest complete date lags the calendar checkpoint, use the latest complete GSC date and record the actual date in `page-indexing-cohort-notes.md`.

## Measurement Rules

- Compare affected URLs with the 7/14/28-day framework in `docs/GSC_RECOVERY_MEASUREMENT_REPORT_2026-06-09.md`.
- Include `https://www.u2tool.com/en/tools/gantt-chart-generator/` in the checkpoint comparison even though the generated P1 monitoring JSON contains only P1 worklog URLs.
- Treat this release as deployment-only for GSC: no request-indexing ledger mutation, no URL Inspection submission, and no broad indexing action unless a new ready-to-submit queue is generated.
- Use URL-level movement first: clicks, impressions, CTR, average position, and latest indexing state.
- Use query-family movement second: old winner terms, localized long-tail variants, and title/query alignment.
- Do not churn page copy on the 7-day checkpoint unless a page fails canonical, robots, indexability, or rendered content checks.

## Decision Labels

| Label | Meaning | Next Action |
|---|---|---|
| `recovering` | Impressions or clicks improved and live rendered/indexability checks are healthy. | Keep monitoring; avoid copy churn. |
| `indexed-no-exposure` | Indexed, but impressions stay flat by 14 days. | Review SERP intent, title/meta, internal links, and competitor snippets. |
| `not-recrawled` | GSC still shows stale crawl state after deploy. | Re-test live URL and sitemap/internal links; only request indexing from a new approved queue. |
| `needs-repair` | Live URL fails canonical, robots, rendered SEO, or content-accuracy checks. | Fix repo before any GSC action. |
| `defer` | No reliable post-deploy evidence yet. | Keep out of request-indexing queue. |

## Next Commands

After each export exists, generate a P1 checkpoint report from the monitoring JSON:

```bash
npm run report:gsc-p1-checkpoint -- \
  --baseline-dir exports/gsc \
  --checkpoint-dir exports/gsc/checkpoints/2026-07-12 \
  --monitoring-json exports/seo/gsc-p1-post-deploy-monitoring/2026-07-05/p1-monitoring-urls.json \
  --label 2026-07-12 \
  --output docs/GSC_P1_COHORT_CHECKPOINT_2026-07-12.md
```

Repeat with the matching folder, label, and output filename for `2026-07-19` and `2026-08-02`.

Checkpoint report script validation performed on 2026-07-05:

```bash
npx vitest run scripts/seo/gsc-p1-checkpoint-report.test.ts
npx tsc --noEmit --skipLibCheck --module NodeNext --moduleResolution NodeNext --target ES2022 scripts/seo/gsc-p1-checkpoint-report.ts scripts/seo/gsc-p1-checkpoint-report.test.ts
```

The full CLI was also dry-run against the existing `exports/gsc/checkpoints/2026-06-16/pages-current.xlsx` export and the P1 monitoring JSON, writing to `/tmp/u2tool-gsc-p1-checkpoint-dry-run.md`; it produced `94` URL rows. That dry-run verifies XLSX parsing and report rendering only, not the 2026-07-12 recovery outcome.
