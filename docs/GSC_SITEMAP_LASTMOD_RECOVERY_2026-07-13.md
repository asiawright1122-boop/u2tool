# GSC Sitemap Lastmod Recovery - 2026-07-13

## Scope

- Release: sitemap lastmod infrastructure and approved recovery overrides only.
- P1 material-change date: 2026-07-05.
- Gantt material-change date: 2026-07-01.
- AI discovery fallback date: 2026-07-08.
- Unchanged tools fallback date: 2026-06-02.
- Content-worktree files included: 0.

## Pre-deploy Baseline

- Latest complete GSC range: 2026-07-04 through 2026-07-10.
- Clicks: 2; previous: 1.
- Impressions: 1,012; previous: 824.
- P1 clicks: 0.
- Production tools sitemap URL count: 5,700.
- Production tools sitemap lastmod before release: 2026-06-02 for all entries.

## Release Controls

- Branch: `codex/sitemap-lastmod-recovery`.
- Sitemap to submit after verified deployment: `https://www.u2tool.com/sitemap.xml`.
- Broad URL Inspection requests permitted: 0.
- Deployment and GSC evidence are appended only from observed command or UI output.

## Release Evidence

- Pull request: https://github.com/asiawright1122-boop/u2tool/pull/42.
- Merge commit: `e5f7d23bb639b5bd8832de39d0569c1837647c4c`.
- Merge time: 2026-07-13 14:02:45 Asia/Shanghai.
- Deployment run: https://github.com/asiawright1122-boop/u2tool/actions/runs/29227835517.
- Cloudflare Worker version: `d038c377-269e-458c-b27e-398c274da620`.
- Worker deployment completed: 2026-07-13 14:06:01 Asia/Shanghai.
- Deployment uploaded four changed assets: `sitemap.xml`, `sitemap-priority.xml`, `sitemap-pages.xml`, and `sitemap-tools.xml`.
- Production search-engine compliance: passed.
- Production technical SEO validation: passed.
- P1 production smoke test: 95 URLs checked; 0 failures.

## GSC Submission Evidence

- Submitted sitemap index: `https://www.u2tool.com/sitemap.xml`.
- Accepted at: 2026-07-13 14:08:08 Asia/Shanghai (`2026-07-13T06:08:08.954Z`).
- GSC confirmation: `已成功提交站点地图`.
- GSC row after submission: submitted 2026-07-13; last read 2026-07-13; status `成功`.
- GSC discovered pages displayed after submission: 7,346.
- Child sitemaps submitted during this release: 0.
- Broad URL Inspection requests made during this release: 0.

## Monitoring

- Day 7 checkpoint: 2026-07-20 after 14:08 Asia/Shanghai.
- Day 14 checkpoint: 2026-07-27 after 14:08 Asia/Shanghai.
- Do not churn content during the first 7 complete days unless live indexability fails.
