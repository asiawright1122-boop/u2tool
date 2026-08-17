# Organic Search Portfolio - 2026-07-30

## Execution update - 2026-08-17

- Implementation branch: `codex/organic-traffic-recovery`; production release completed on 2026-08-17.
- Data basis: the complete repository GSC reports generated through 2026-07-02. No newer complete GSC window was used, so this update does not claim current traffic movement.
- First active batch: Korean HTML Preview plus the Russian IP Validator/Lookup workflow.
- Indexability gate: Korean HTML Preview remains indexable; the two Russian IP pages are removed from suppression, all three carry a truthful 2026-08-17 sitemap refresh date, and their SSR contracts require index/follow plus indexable related-tool links.
- Release state: Worker `308badbb-3f20-473e-b051-e1813fd5f367` is serving production; the pre-release rollback target is `3ab6a694-63c8-4bfd-ae8c-86947052b39b`.
- Post-release gates: 21/21 production SSR contracts, search-engine compliance, two Worker SSR rounds, direct no-redirect probes, and production sitemap checks passed. No sitemap resubmission or indexing request was made.
- Grammar and Hex remain governance holds and are excluded from the active traffic queue.

## Safety boundary

This inventory scores every locale/tool route from current source evidence. Only rows marked `documented` have direct GSC/release evidence. An unassessed P2/P3 row is not an automatic noindex or removal decision; fresh complete GSC data, backlinks, and live index state must be checked first.

## Inventory

- Tools: 570
- Locales: 10
- Locale/tool URLs: 5700
- Documented profiles: 9
- P0: 5
- P1: 4
- P2: 5641
- P3: 50

## Documented recovery portfolio

| Tier | Status | Score | URL | Primary intent | Next action |
|---|---|---:|---|---|---|
| P0 | active-recovery | 83 | `https://www.u2tool.com/ko/tools/html-preview/` | 정적 HTML과 CSS를 확인하는 HTML 뷰어 온라인 | rehabilitate-and-measure |
| P0 | active-recovery | 93 | `https://www.u2tool.com/ru/tools/ip-validator/` | Проверка формата одного IPv4 или IPv6 адреса | rehabilitate-and-measure |
| P0 | active-recovery | 94 | `https://www.u2tool.com/ru/tools/ip-lookup/` | Проверка IP-адреса, геолокации, провайдера и публичного IP | rehabilitate-and-measure |
| P0 | active-recovery | 93 | `https://www.u2tool.com/en/tools/iban-validator/` | Validate IBAN format, country length, and MOD-97 checksum | rehabilitate-and-measure |
| P0 | active-recovery | 91 | `https://www.u2tool.com/en/tools/ical-parser/` | Open, inspect, and export iCal or ICS calendar data | rehabilitate-and-measure |
| P1 | governance-hold | 61 | `https://www.u2tool.com/ru/tools/grammar-checker/` | Проверка английского текста на частые ошибки через русский интерфейс | hold-until-worker-gate-is-reconciled |
| P1 | capability-first | 69 | `https://www.u2tool.com/en/tools/gantt-chart-generator/` | Create and export a simple Gantt chart without signup | build-capability-before-query-expansion |
| P1 | candidate | 66 | `https://www.u2tool.com/es/tools/word-counter/` | Contar palabras y caracteres en español | validate-query-and-prepare-next-batch |
| P1 | governance-hold | 60 | `https://www.u2tool.com/en/tools/hex-editor/` | Inspect and convert hexadecimal text | hold-no-publication |

## Scoring model

| Dimension | Maximum |
|---|---:|
| Search demand | 30 |
| Functional completeness | 25 |
| Unique evidence | 20 |
| Achievable competition | 10 |
| Trust and risk | 10 |
| Localization quality | 5 |

Thresholds are P0 >= 70, P1 50-69, P2 30-49, and P3 < 30 for documented profiles. Source-only rows are capped at P2 because missing demand evidence must never be interpreted as proven zero demand.

## Execution order

1. Rehabilitate and measure Korean HTML Preview plus the Russian IP validation/lookup workflow.
2. Preserve the existing English IBAN and iCal recovery work while fresh data matures.
3. Keep Grammar and Hex on governance hold; do not use control pages for traffic expansion.
4. Build missing Gantt capabilities before expanding its keyword footprint.
5. Validate Spanish word-counter demand for the next batch.
6. Import a fresh complete GSC export before making P2/P3 index decisions.
