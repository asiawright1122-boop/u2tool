# GSC Daily Execution Status

Generated at: 2026-07-05T04:40:51.020Z
Request ledger: /Users/kaka/Dev/u2tool/exports/seo/gsc-crawled-not-indexed-queues/2026-07-04/request-indexing-inspection-ledger.csv
Request live preflight: /Users/kaka/Dev/u2tool/exports/seo/gsc-crawled-not-indexed-queues/2026-07-04/request-indexing-live-preflight.csv
Request submission runbook: /Users/kaka/Dev/u2tool/exports/seo/gsc-crawled-not-indexed-queues/2026-07-04/request-indexing-submission-runbook.csv
Content live preflight: /Users/kaka/Dev/u2tool/exports/seo/gsc-crawled-not-indexed-queues/2026-07-04/content-refresh-live-preflight.csv
Content link audit: /Users/kaka/Dev/u2tool/exports/seo/gsc-crawled-not-indexed-queues/2026-07-04/content-refresh-internal-link-audit.csv
CSV export: /Users/kaka/Dev/u2tool/exports/seo/gsc-crawled-not-indexed-queues/2026-07-04/gsc-daily-execution-status.csv
JSON export: /Users/kaka/Dev/u2tool/exports/seo/gsc-crawled-not-indexed-queues/2026-07-04/gsc-daily-execution-status.json

## Executive Status

- Request-indexing lane: 67 URLs; 0 ready for GSC URL Inspection submission; 67 already submitted or indexed in the ledger.
- Content-refresh lane: 11 URLs; 11 live-ready and internally covered.
- Repository-side blocker/review rows: 0.
- GSC daily quota rows recorded today: 0.
- Next executable request-indexing batch: none.
- Combined tracked loss: 103 clicks and 8000 impressions.

## Request-Indexing Lane

| State | Rows |
|---|---:|
| ready-to-submit | 0 |
| needs-review | 0 |
| blocked | 0 |
| submitted | 52 |
| already-indexed | 15 |
| skipped | 0 |

| Batch | URLs | Ready | Needs review | Blocked | Submitted/indexed | Click Loss | Impression Loss |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 10 | 0 | 0 | 0 | 10 | 30 | 640 |
| 2 | 10 | 0 | 0 | 0 | 10 | 12 | 1699 |
| 3 | 10 | 0 | 0 | 0 | 10 | 10 | 274 |
| 4 | 10 | 0 | 0 | 0 | 10 | 10 | 134 |
| 5 | 10 | 0 | 0 | 0 | 10 | 10 | 65 |
| 6 | 10 | 0 | 0 | 0 | 10 | 10 | 24 |
| 7 | 7 | 0 | 0 | 0 | 7 | 4 | 2598 |

## Content-Refresh Lane

| State | Rows |
|---|---:|
| ready-covered | 11 |
| ready-watch | 0 |
| link-gap | 0 |
| blocked | 0 |
| needs-review | 0 |

## Attention Rows

_No blocker or review rows._

## GSC Quota Rows

_No quota-limited rows recorded._

## Next GSC Batch none

_No request-indexing batch is ready to submit._

## Operating Notes

- This report is read-only: it does not mutate the editable request-indexing ledger.
- Do not mark a URL as submitted unless the GSC URL Inspection workflow actually accepted the request.
- Keep the 11 content-refresh URLs in monitoring mode; current live/indexability and internal-link checks do not justify more content churn.