# Tool Content Trust Audit - 2026-05-05

## Executive Summary

This audit checks tool support content against search-engine quality expectations and the actual U2Tool browser-first implementation. The primary recovery risk addressed here is not raw indexability: GSC Coverage showed indexed pages continued to rise while impressions collapsed. The next defensible layer is content trust, overclaiming, and thin support content.

- Tool message files scanned: 5480
- English tool files scanned: 548
- Popular English tool files checked for depth: 94
- Files with high-confidence implementation overclaims: 2
- Files with medium-confidence claims for future review: 2
- Popular English files with depth gaps: 16

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
| `thin-detailed-description` | depth | 15 | Popular English tool has a short detailed_description (...). |
| `redis-runtime` | medium | 3 | Mentions Redis-specific behavior that should be verified against the actual tool UI. |
| `dice-roller-unsupported-control-claim` | high | 1 | Claims Dice Roller controls that are not present in the current dice button, modifier, result, and history UI. |
| `document-word-counter-export-claim` | high | 1 | Claims Document Word Counter export behavior that is not present in the current live statistics UI. |
| `server-side-reference` | medium | 1 | References server-side behavior on a browser-first tool page and should be verified. |
| `thin-faqs` | depth | 1 | Popular English tool has 0 FAQs; expected at least 3. |

## High-Confidence Overclaim Samples

| Locale | Tool | Field | Rule | Excerpt |
|---|---|---|---|---|
| en | `document-word-counter` | `usage_steps[4]` | `document-word-counter-export-claim` | Export stats |
| pt | `dice-roller` | `usage_steps[1]` | `dice-roller-unsupported-control-claim` | Selecione o tipo de dado que deseja lançar using the dropdown menu (por exemplo, D6, D20). |

## Popular English Depth Gaps

These are not automatic noindex problems. They are prioritization targets for content refresh because popular landing pages should give users concrete, page-accurate guidance, examples, and FAQs.

| Tool | Detailed Chars | Steps | Examples | FAQs | Gap Codes |
|---|---:|---:|---:|---:|---|
| `calorie-deficit-calculator` | 185 | 4 | 3 | 3 | `thin-detailed-description` |
| `cover-letter-generator` | 152 | 4 | 3 | 3 | `thin-detailed-description` |
| `csp-header-generator` | 157 | 4 | 3 | 3 | `thin-detailed-description` |
| `csv-to-vcard-converter` | 143 | 4 | 3 | 3 | `thin-detailed-description` |
| `debt-snowball-calculator` | 161 | 4 | 3 | 3 | `thin-detailed-description` |
| `ics-file-generator` | 154 | 4 | 3 | 3 | `thin-detailed-description` |
| `macro-calculator` | 153 | 4 | 3 | 3 | `thin-detailed-description` |
| `midjourney-prompt-generator` | 184 | 4 | 3 | 3 | `thin-detailed-description` |
| `one-rep-max-calculator` | 146 | 4 | 3 | 3 | `thin-detailed-description` |
| `passport-photo-maker` | 168 | 4 | 3 | 3 | `thin-detailed-description` |
| `paypal-fee-calculator` | 158 | 4 | 3 | 3 | `thin-detailed-description` |
| `savings-goal-calculator` | 173 | 4 | 3 | 3 | `thin-detailed-description` |
| `security-headers-checker` | 170 | 4 | 3 | 3 | `thin-detailed-description` |
| `stable-diffusion-prompt-generator` | 188 | 4 | 3 | 3 | `thin-detailed-description` |
| `websocket-tester` | 679 | 6 | 4 | 0 | `thin-faqs` |
| `youtube-title-generator` | 140 | 4 | 3 | 3 | `thin-detailed-description` |

## Recovery Actions

1. Keep the runtime fallback guard active for all high-confidence implementation overclaims.
2. Refresh the highest-impression English tool pages first with page-accurate descriptions, usage steps, examples, and FAQs.
3. Use GSC Performance exports to decide the next content wave by lost impressions and current average position.
4. Re-run `npm run report:content-trust` after each content wave and before submitting more IndexNow batches.
