# Phase 92 Baseline: TDK Cleanup Batch Planner

Captured: 2026-06-27

## Baseline Command

```bash
npm run validate:tdk-integrity -- --top 20 --report-path .planning/research/reports/tdk-integrity-v0.0.32-candidate-baseline.json
```

Result:

- PASS
- Errors: `0`
- Warnings: `2792`
- Checked combinations: `5570`
- Warning fields: `seo_title=442`, `seo_description=2350`
- Warning directions: `short=6`, `long=2786`
- Top locales: `ja=498`, `ko=427`, `ru=350`, `fr=308`, `ar=298`, `es=261`, `de=236`, `zh=205`, `pt=182`, `en=27`
- Top categories: `development=535`, `generators=309`, `converters=299`, `text=257`, `office=226`, `image=206`, `charts=185`, `encoding=141`, `math=141`, `network=135`

## Candidate Export Command

```bash
npm run validate:tdk-integrity -- --top 5 --report-path .planning/research/reports/tdk-integrity-v0.0.32-after-candidates.json --candidates-path .planning/research/reports/tdk-cleanup-candidates-v0.0.32-top20.json --candidate-top 20 --candidate-fields seo_description --candidate-directions long
```

Result:

- PASS
- Errors: `0`
- Warnings: `2792`
- Candidate count: `20`
- Filters: `fields=seo_description`, `directions=long`, `limit=20`

Top exported candidates:

| Rank | Locale | Slug | Field | Length | Max | Over By | Source Status |
| :--- | :--- | :--- | :--- | ---: | ---: | ---: | :--- |
| 1 | es | heatmap-chart-generator | seo_description | 388 | 180 | 208 | root_base_match |
| 2 | es | json-formatter | seo_description | 387 | 180 | 207 | root_base_match |
| 3 | fr | random-generator | seo_description | 387 | 180 | 207 | root_base_match |
| 4 | fr | jwt-payload-decoder | seo_description | 387 | 180 | 207 | root_base_match |
| 5 | es | sankey-chart-generator | seo_description | 386 | 180 | 206 | root_base_match |

## Interpretation

- The warning backlog is still non-blocking optimization debt; hard errors remain clear at `0`.
- The candidate export now gives reviewers enough information to plan a small content batch: rank, source field, current value, length bounds, overrun size, and whether root/base files must be edited together.
- `.planning/research/reports/` outputs are gitignored by design. The tracked evidence is this baseline summary plus the validator behavior and tests.

## Follow-Up Recommendation

Use the candidate export to create a small follow-up content cleanup batch, probably scoped to the top 10 or top 20 `root_base_match` candidates in one or two Latin-script locales first. Avoid mass JA/KO/RU/AR rewrites until a reviewer can validate copy quality.
