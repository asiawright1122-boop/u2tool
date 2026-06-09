# Phase 55-02 Summary: Request-Indexing Rules Defined

## Status

Complete.

## Rules Added

The GSC cohort plan now defines:

- Inspect only clean canonical URLs, not cache-bypass or query variants.
- Use URL Inspection -> Test live URL -> Request indexing for Cohort A and Cohort B only when the live test confirms eligibility.
- Avoid broad "Validate fix" clicks on mixed Coverage rows.
- Move any failing clean canonical URL to `fix-before-request`.
- Keep Cohort C out of request indexing until page-level content/snippet evidence is repaired or accepted.
- Track cohorts by URL and query family rather than site-wide averages.

## Crawl And Measurement Windows

The plan records absolute checkpoints:

- 2026-06-12: indexing spot check.
- 2026-06-16: 7-day performance checkpoint.
- 2026-06-23: 14-day performance checkpoint.
- 2026-07-07: 28-day performance checkpoint.

## Outcome

Phase 55-02 is complete. The request-indexing and monitoring rules are operationally bounded.
