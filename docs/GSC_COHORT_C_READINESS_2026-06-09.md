# GSC Cohort C Readiness - 2026-06-09

## Purpose

Close the repo-side inspection loop for the Cohort C high-loss URLs from `docs/GSC_RECOVERY_COHORT_PLAN_2026-06-09.md`. These URLs were originally kept out of request indexing until title, support copy, localization, query fit, and safety boundaries had patch evidence.

## Summary

All Cohort C URLs now have targeted rendered SEO/content guards. Twelve URLs pass against production on 2026-06-09. One URL, `en/tools/bra-size-calculator/`, had a meta-description gap and was patched locally so the rendered guard passes against localhost; request indexing for that URL should wait until the patch is deployed.

## Verification Commands

Production checks were run with:

```bash
INCLUDE_SOURCE_RENDERED_CHECKS=1 RENDERED_SEO_CHECK='<check name>' \
  node --import tsx/esm scripts/validation/validate-rendered-seo.ts
```

The local post-fix check for Bra Size Calculator was run with:

```bash
PROD_BASE_URL=http://127.0.0.1:4329 INCLUDE_SOURCE_RENDERED_CHECKS=1 \
  RENDERED_SEO_CHECK='Bra Size Calculator recovery' \
  node --import tsx/esm scripts/validation/validate-rendered-seo.ts
```

## URL Decisions

| Priority | URL | Guard Evidence | Decision |
|---:|---|---|---|
| 1 | `https://www.u2tool.com/en/tools/typing-speed-test/` | Production `Typing Speed Test` checks passed | Move to URL Inspection after Cohort A/B quota allows |
| 2 | `https://www.u2tool.com/en/tools/pixel-density-calculator/` | Production `Pixel Density Calculator` checks passed | Move to URL Inspection after Cohort A/B quota allows |
| 3 | `https://www.u2tool.com/es/tools/document-word-counter/` | Production `Spanish Document Word Counter` checks passed | Move to URL Inspection after Cohort A/B quota allows |
| 4 | `https://www.u2tool.com/en/tools/screen-recorder/` | Production `Screen Recorder recovery` checks passed | Move to URL Inspection after Cohort A/B quota allows |
| 5 | `https://www.u2tool.com/ar/tools/calorie-calculator/` | Production `Arabic Calorie Calculator` check passed | Move to URL Inspection after Cohort A/B quota allows |
| 6 | `https://www.u2tool.com/es/tools/gantt-chart-generator/` | Production `Spanish Gantt Chart Generator` check passed | Move to URL Inspection after Cohort A/B quota allows |
| 7 | `https://www.u2tool.com/en/tools/ascii-table/` | Production `ASCII Table recovery` check passed | Move to URL Inspection after Cohort A/B quota allows |
| 8 | `https://www.u2tool.com/en/tools/dice-roller/` | Production `Dice Roller` checks passed | Move to URL Inspection after Cohort A/B quota allows |
| 9 | `https://www.u2tool.com/en/tools/credit-card-validator/` | Production `English Credit Card Validator` check passed | Move to URL Inspection after Cohort A/B quota allows |
| 10 | `https://www.u2tool.com/en/tools/timeline-chart-generator/` | Production `Timeline Chart Generator recovery` check passed | Move to URL Inspection after Cohort A/B quota allows |
| 11 | `https://www.u2tool.com/fr/tools/mortgage-calculator/` | Production `French Mortgage Calculator` check passed | Move to URL Inspection after Cohort A/B quota allows |
| 12 | `https://www.u2tool.com/en/tools/bra-size-calculator/` | Local `Bra Size Calculator recovery` check passed after meta-description patch | Deploy first, then URL Inspection |
| 13 | `https://www.u2tool.com/en/tools/random-color-generator/` | Production `Random Color Generator recovery` check passed | Move to URL Inspection after Cohort A/B quota allows |

## Bra Size Patch

The production guard failed because the meta description did not include `underbust`, even though the page body already describes underbust and bust measurements. The English SEO description now says:

> Free online Bra Size Calculator to estimate bra size from underbust and bust measurements, then compare regional labels safely in your browser.

The localhost rendered SEO check confirms the patched metadata and existing body guard pass.

## Next Action

After this patch is deployed, Cohort C can be treated as a lower-priority request-indexing queue. Run URL Inspection with the same rules as Cohort A/B:

1. Test live URL first.
2. Request indexing only if the live test says the URL is eligible.
3. If any URL fails canonical, robots, rendered content, or safety checks, mark `needs-repair` and do not request indexing.
