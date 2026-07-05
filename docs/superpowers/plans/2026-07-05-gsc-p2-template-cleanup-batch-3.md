# GSC P2 Template Cleanup Batch 3

Date: 2026-07-05

## Goal

Continue P2 localized template cleanup with pages that still show generic generator copy, root/base drift, short support content, or crawled-not-indexed risk.

## Batch

| URL | Evidence | Action |
|---|---:|---|
| `/de/tools/text-repeater/` | support thin, examples short, FAQ short, generic template | Expand support copy around repeat count, separators, numbering, copy, TXT download, and counters. |
| `/de/tools/regex-escape/` | description long, source drift, FAQ short, generic template | Synchronize metadata and remove SQL/security/dialect overclaims from support copy. |
| `/es/tools/uuid-generator/` | description long, source drift, FAQ short, generic template | Synchronize metadata and replace UUID format/export overclaims with count 1-100, copy single, copy all. |
| `/de/tools/ip-address-generator/` | low ranking, generic template, coverage risk | Replace generic metadata and overbroad CIDR/CSPRNG/MAC/export claims with IPv4/IPv6/private/public, count 1-100, copy behavior. |
| `/de/tools/random-generator/` | impression loss, description long, FAQ short, generic template | Replace generic root/base description with min/max/count/unique/max-1000/copy framing. |
| `/de/tools/json-to-python/` | FAQ short, generic template, coverage risk | Remove AST/schema/date/download overclaims; describe pasted object, class name, dataclass/Pydantic/TypedDict/plain, Optional, sample, copy. |

## Checks

- Root/base metadata parity for the selected URLs.
- Split support content names only implemented controls.
- No GSC request-indexing ledger changes.
- Run focused JSON/parity checks and full SEO governance after edits.
