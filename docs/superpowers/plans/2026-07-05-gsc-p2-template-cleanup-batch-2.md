# GSC P2 Template Cleanup Batch 2

Date: 2026-07-05

## Goal

Continue the P2 cleanup lane with generic-template and crawled-not-indexed pages from the 2026-07-05 SEO/GEO audit matrix.

## Batch

| URL | Evidence | Action |
|---|---:|---|
| `/de/tools/fake-data-generator/` | title/description long, generic template, coverage risk | Replace marketing metadata and overbroad support copy with field, locale, editable preview, JSON/CSV/SQL export behavior. |
| `/de/tools/crc32-calculator/` | root/base drift, generic template, coverage risk | Synchronize root/base metadata around text/file CRC32, hex/decimal output, and copy behavior. |
| `/es/tools/docker-compose-generator/` | root/base drift, generic template, coverage risk | Replace overbroad Compose claims with selectable services, Compose version, YAML preview, copy, and download behavior. |
| `/es/tools/json-to-sql/` | root/base drift, generic template, coverage risk | Replace nested-schema/import overclaims with pasted JSON, table name, dialect, optional CREATE TABLE, INSERT output, and copy behavior. |
| `/de/tools/hex-editor/` | impression loss, FAQ short, generic template, coverage risk | Preserve accurate metadata and add focused support FAQs for text-to-hex and hex-to-text behavior. |
| `/fr/tools/uuid-generator/` | description long, FAQ short, generic template, coverage risk | Replace overbroad UUID claims with v4 count 1-100, generate, copy all, and copy single behavior. |

## Checks

- Root/base metadata parity for the selected URLs.
- Split support content names only implemented controls.
- No GSC request-indexing ledger changes.
- Run focused JSON/parity checks and full SEO governance after edits.
