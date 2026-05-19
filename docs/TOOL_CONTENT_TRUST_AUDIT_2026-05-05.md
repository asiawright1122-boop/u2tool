# Tool Content Trust Audit - 2026-05-05

## Executive Summary

This audit checks tool support content against search-engine quality expectations and the actual U2Tool browser-first implementation. The primary recovery risk addressed here is not raw indexability: GSC Coverage showed indexed pages continued to rise while impressions collapsed. The next defensible layer is content trust, overclaiming, and thin support content.

- Tool message files scanned: 5483
- English tool files scanned: 550
- Popular English tool files checked for depth: 96
- Files with high-confidence implementation overclaims: 2
- Files with medium-confidence claims for future review: 0
- Popular English files with depth gaps: 0

Runtime mitigation: high-confidence support-content issues are blocked by `assessSupportContentTrust` and replaced by safe fallback support content on tool detail pages.

## Search Engine Quality Basis

- Google Search Central: helpful content should be created for people first and should avoid content that leaves visitors needing to search again for better information. Source: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Search Essentials: pages should be accessible, indexable, useful, and not deceptive or misleading. Source: https://developers.google.com/search/docs/essentials
- Bing Webmaster Guidelines: pages should provide clear, original, useful content and avoid deceptive or low-value patterns. Source: https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a
- Yandex Webmaster guidance: site quality and relevance are ranking inputs, so content should match the user's task and not misrepresent page behavior. Source: https://yandex.com/support/webmaster/en/yandex-indexing/rank
- Baidu Search Resource Platform guidance broadly emphasizes user-oriented, high-quality content and crawlable pages. Source: https://ziyuan.baidu.com/

## Issue Distribution

| Code | Severity | Count | Meaning |
|---|---:|---:|---|
| `candlestick-unsupported-volume-market-claim` | high | 1 | Claims candlestick volume bars, imports, live/feed data, pattern detection, or trading signals that are not present in the current manual OHLC chart UI. |
| `image-splitter-unsupported-advanced-claim` | high | 1 | Claims image splitter overlap, output-format, EXIF, or advanced slicing controls that are not present in the current rows/columns PNG grid UI. |

## High-Confidence Overclaim Samples

| Locale | Tool | Field | Rule | Excerpt |
|---|---|---|---|---|
| pt | `candlestick-chart-generator` | `usage_examples[1]` | `candlestick-unsupported-volume-market-claim` | Um educador financeiro criando gráficos didáticos com candlestick patterns para um curso de análise técnica |
| pt | `image-splitter` | `detailed_description` | `image-splitter-unsupported-advanced-claim` | xa de aspecto quando necessário. Técnicas de amostragem bilinear são aplicadas para evitar distorções nos fragmentos ger |

## Popular English Depth Gaps

These are not automatic noindex problems. They are prioritization targets for content refresh because popular landing pages should give users concrete, page-accurate guidance, examples, and FAQs.

| Tool | Detailed Chars | Steps | Examples | FAQs | Gap Codes |
|---|---:|---:|---:|---:|---|
| - | - | - | - | - | No popular English depth gaps found. |

## Recovery Actions

1. Keep the runtime fallback guard active for all high-confidence implementation overclaims.
2. Refresh the highest-impression English tool pages first with page-accurate descriptions, usage steps, examples, and FAQs.
3. Use GSC Performance exports to decide the next content wave by lost impressions and current average position.
4. Re-run `npm run report:content-trust` after each content wave and before submitting more IndexNow batches.
