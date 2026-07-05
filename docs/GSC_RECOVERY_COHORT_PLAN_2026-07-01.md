# GSC Recovery Cohort Plan - 2026-07-01

## Cohort A - Old Winners To Repair First

| URL | Reason | Request Indexing Only After |
|---|---|---|
| `https://www.u2tool.com/de/tools/text-to-handwriting/` | 109 merged 16-month clicks; slash/no-slash split | rendered SEO and content trust pass |
| `https://www.u2tool.com/ru/tools/hex-editor/` | 56 merged 16-month clicks; prior first-page Russian query visibility | rendered SEO and content trust pass |
| `https://www.u2tool.com/ko/tools/html-preview/` | 42 merged 16-month clicks; 2,553 impressions | rendered SEO and content trust pass |
| `https://www.u2tool.com/en/tools/hex-editor/` | 40 merged 16-month clicks; old English tool-intent query | rendered SEO and content trust pass |
| `https://www.u2tool.com/ko/tools/unicode-converter/` | 38 merged 16-month clicks; Korean query family | rendered SEO and content trust pass |
| `https://www.u2tool.com/ru/tools/html-preview/` | 35 merged 16-month clicks | rendered SEO and content trust pass |
| `https://www.u2tool.com/fr/tools/file-size-calculator/` | 33 16-month clicks; no-slash history | rendered SEO and content trust pass |
| `https://www.u2tool.com/en/tools/ical-parser/` | 30 merged 16-month clicks; old ranking near position 13 | rendered SEO and content trust pass |
| `https://www.u2tool.com/es/tools/html-preview/` | 26 16-month clicks | rendered SEO and content trust pass |
| `https://www.u2tool.com/ru/tools/barcode-generator/` | 25 merged 16-month clicks | rendered SEO and content trust pass |
| `https://www.u2tool.com/en/tools/morse-code-player/` | 14 16-month clicks; prior copy defect | rendered SEO and content trust pass |

## Cohort B - Exposure-Loss Pages From Local Exports

| URL | Reason |
|---|---|
| `https://www.u2tool.com/en/tools/gantt-chart-generator/` | largest local impression loss |
| `https://www.u2tool.com/en/tools/iban-validator/` | high-intent validator page lost exposure |
| `https://www.u2tool.com/en/tools/sitemap-generator/` | high-intent developer tool lost exposure |
| `https://www.u2tool.com/en/tools/compound-interest-calculator/` | YMYL-adjacent calculator lost exposure |
| `https://www.u2tool.com/es/tools/word-counter/` | Spanish word-counter query family lost exposure |
| `https://www.u2tool.com/es/tools/document-word-counter/` | adjacent Spanish word-count intent |

## GSC Boundary

- Do not click broad "验证修复" for mixed excluded URL buckets.
- Use URL Inspection and "请求编入索引" only for canonical URLs that pass repository and live checks.
- Record every inspected URL, latest crawl state, and request date in `exports/gsc/checkpoints/YYYY-MM-DD/page-indexing-cohort-notes.md`.

## 2026-07-02 URL Inspection Update

- `已抓取 - 尚未编入索引` drilldown still shows 4,629-4,630 affected pages, last updated `2026/6/12`, validation started `2026/6/15`.
- The first 20 visible drilldown examples were checked in URL Inspection and all currently report indexed.
- 8 Cohort A former winners were checked in URL Inspection and all currently report indexed.
- Do not request indexing again for the checked URLs. Treat the visible drilldown rows as stale until a fresher export proves otherwise.
- Recovery priority now shifts from indexability to ranking signals: query-intent copy, native localized support sections, internal links from cluster/category/compare pages, and GSC performance monitoring.

Detailed checkpoint: `exports/gsc/checkpoints/2026-07-02/page-indexing-cohort-notes.md`.

## 2026-07-02 Internal Discovery Update

- Production sitemap and LLM discovery endpoints were verified after deploy version `8951a63a-a757-47e2-b2f9-e1d518f15df3`.
- `sitemap-priority.xml` returns 200 and includes the added recovery slugs across locale variants.
- `llms-full.txt` returns 200 and includes the added GSC recovery route annotations.
- Search-engine compliance, rendered SEO, and targeted online TDK drift checks passed against `https://www.u2tool.com`.
- Next recovery action moved from indexing requests to site architecture:
  - category discovery now prioritizes recovery-bearing categories: text, converters, charts, development, encoding, image, finance, and math;
  - each default category spotlight includes at least one high-value recovery tool, strengthening visible internal links and `ItemList` structured data from homepage, tools index, and AI discovery surfaces.
- HTML edge cache versioning now fingerprints dirty working-tree content instead of using a fixed `HEAD-dirty` suffix. This prevents consecutive uncommitted SEO deploys from reusing stale cached HTML after a successful Worker deploy.
- Post-deploy production smoke confirmed `/en/`, `/en/tools/`, and `/en/ai/` each render all 8 recovery spotlight links without a query-string cache buster.

## 2026-07-02 Hex Editor Query-Intent Update

- URL Inspection for `https://www.u2tool.com/en/tools/ical-parser/` showed `网址已收录到 Google` and `网页已编入索引`; no indexing request was submitted.
- Fresh GSC recovery report generated at `docs/GSC_RECOVERY_REPORT_2026-07-02.md`.
- The largest page click-loss pair in the local GSC exports is now the Hex Editor cohort:
  - `https://www.u2tool.com/ru/tools/hex-editor/` lost 20 prior clicks and 341 impressions.
  - `https://www.u2tool.com/en/tools/hex-editor/` lost 18 prior clicks and 579 impressions.
- English and Russian Hex Editor support content now explicitly covers old query intent such as `online hex editor`, `text to hex`, `hex to text`, `hex-редактор онлайн`, `текст в hex`, and `hex в текст`, while preserving the truthful boundary that this is not a full binary file editor.
- Deployed version `e9e9d441-3245-4698-8bf9-4619f15e9524`; production smoke confirmed the new title/body phrases on both English and Russian Hex Editor pages.

## 2026-07-02 German Text to Handwriting Query-Intent Update

- The next Cohort A former winner was `https://www.u2tool.com/de/tools/text-to-handwriting/`, which lost 17 clicks and 176 impressions in the local GSC page exports.
- German support content now covers the old query family: `Text in Handschrift umwandeln online`, `Text in Handschrift umwandeln`, `Text zu Handschrift`, `Handschrift Generator`, and `Text in Handschrift umwandeln online kostenlos`.
- The copy keeps the page inside the actual product boundary: it presents stylized handwriting PNG generation and does not claim OCR or real handwriting recognition.
- Deployed version `bce1441f-865d-4ef0-8dd7-307c0fc85679`; production smoke confirmed all target German phrases on `https://www.u2tool.com/de/tools/text-to-handwriting/`.
- Post-deploy `validate:search-engine-compliance` and full `validate:rendered-seo` passed against `https://www.u2tool.com`.

## 2026-07-02 iCal Parser Query-Intent Update

- URL Inspection had already confirmed `https://www.u2tool.com/en/tools/ical-parser/` is indexed, so the recovery action stayed focused on ranking and CTR signals instead of another indexing request.
- The page lost 14 clicks and 244 impressions in the local GSC page exports. Old GSC query rows included `ical viewer` and `view ical online`.
- English title, description, support content, and FAQ now cover `iCal viewer`, `view iCal online`, `ICS calendar viewer`, and `view ICS file online`.
- The copy keeps the current product boundary: it parses pasted or uploaded iCal/ICS content into readable events and JSON, but does not claim calendar sync, invitation sending, CalDAV sync, or complete timezone-rule expansion.
- Deployed version `5eda8481-0949-4ba2-bce3-69308055c2ca`; production smoke confirmed the target phrases, meta title intent, and non-sync boundary on `https://www.u2tool.com/en/tools/ical-parser/`.
- Post-deploy `validate:search-engine-compliance` and full `validate:rendered-seo` passed against `https://www.u2tool.com`.
- Next recommended Cohort A target: `https://www.u2tool.com/ru/tools/barcode-generator/` (`-11` clicks, `-244` impressions), then `https://www.u2tool.com/fr/tools/file-size-calculator/` if the Russian barcode query family checks out.

## 2026-07-02 Russian Barcode Generator Query-Intent Update

- The next Cohort A target was `https://www.u2tool.com/ru/tools/barcode-generator/`, which lost 11 clicks and 244 impressions in the local GSC page exports.
- Old query rows included `бесплатный генератор штрих-кодов`, `генератор штрихкода`, `штрих код онлайн`, `баркод генератор`, and `баркод онлайн`.
- Russian title, description, support content, examples, and FAQ now cover the old query family while preserving the current product boundary: browser-based SVG preview for Code 128, Code 39, EAN-13, and UPC-A.
- The copy explicitly avoids unsupported output promises such as EPS/PNG export, 600 DPI, raster image generation, styling controls, bar-height controls, or module-width controls.
- Initial deploy version `aa21c3d3-5798-4762-9d2e-363e77670fc5` exposed the content but failed an existing rendered SEO title-case guard. Follow-up deploy version `f2e588ef-f437-434b-96c7-7267c47ea915` restored `Генератор` in the title and passed the guard.
- Production smoke confirmed the target Russian phrases and absence of unsupported-output claims on `https://www.u2tool.com/ru/tools/barcode-generator/`.
- Post-deploy `validate:search-engine-compliance` and full `validate:rendered-seo` passed against `https://www.u2tool.com`.
- Next recommended Cohort A target: `https://www.u2tool.com/fr/tools/file-size-calculator/` (`-11` clicks, `-57` impressions) or `https://www.u2tool.com/en/tools/morse-code-player/` (`-9` clicks, `-249` impressions), depending on whether we prioritize former top-5 position recovery or larger exposure loss.

## 2026-07-02 French File Size Calculator Query-Intent Update

- The next Cohort A target was `https://www.u2tool.com/fr/tools/file-size-calculator/`, which lost 11 clicks and 57 impressions in the local GSC page exports, with prior average position near 4.64.
- Direct query evidence was thin, but the surviving query row and page intent point to the French file-size conversion cluster: `convertisseur de taille de fichier`, `taille de fichier`, `octets Ko Mo Go`, `convertir Ko en Mo`, `convertir Mo en Go`, and `base 1000 ou 1024`.
- French title, description, support content, examples, and FAQ now cover that query family while preserving the product boundary: this is a manual numeric converter between bytes, Ko, Mo, Go, To, and Po, not a local-file upload, reader, or analyzer.
- Initial deploy version `4f51af50-e798-48d0-b5a4-bd17297dc47e` exposed the refreshed body content but still served stale actual title/meta from duplicate French TDK sources and the HTML edge cache. Follow-up deploy version `7d47aab3-a7ff-4d2a-9a9b-cdf12ebdbd3d` synced both `fr/base.json` and `fr.json` TDK sources and refreshed the rendered HTML shell.
- Production smoke confirmed the new French title/meta, all target phrases, and absence of unsupported file-upload or file-reading claims on `https://www.u2tool.com/fr/tools/file-size-calculator/`.
- Post-deploy `validate:search-engine-compliance` and full `validate:rendered-seo` passed against `https://www.u2tool.com`.
- Next recommended Cohort A target: `https://www.u2tool.com/en/tools/morse-code-player/` (`-9` clicks, `-249` impressions), because the page still has meaningful exposure loss and an old copy defect noted in the cohort table.

## 2026-07-02 Morse Code Player Query-Intent Update

- The next Cohort A target was `https://www.u2tool.com/en/tools/morse-code-player/`, which lost 9 clicks and 249 impressions in the local GSC page exports, with prior average position near 15.74 and current position around 89.
- Old query rows included `morse code player`, `morse code player online`, `morse code play`, and `morse player`; the current export also surfaced `morse code live`.
- English title, description, support content, examples, and FAQ now cover that query family with `Morse Code Player Online - Text to Morse Audio`, `Morse code player online`, `Morse code live audio`, `quick Morse player`, and `Morse code play practice`.
- The copy preserves the current product boundary: text-to-Morse, Morse-to-text, browser audio playback, speed/frequency controls, and visual rhythm; it avoids a built-in reference chart claim, placeholder-like `Adjust speed and ....`, advanced training scheduler claims, and professional transmission guarantees.
- Initial deploy version `296a9276-f9a3-43e0-b981-c5f299a04523` exposed the new TDK and query copy, but production smoke caught an over-strict forbidden phrase collision in a negative boundary sentence. Follow-up deploy version `817d6af6-a002-440a-be9f-27cfcd161367` cleaned that wording and refreshed the page HTML.
- Production smoke confirmed the new title/meta, all target phrases, and absence of unsupported reference-chart or transmission-guarantee claims on `https://www.u2tool.com/en/tools/morse-code-player/`.
- Post-deploy `validate:search-engine-compliance` and full `validate:rendered-seo` passed against `https://www.u2tool.com`.
- Next recommended Cohort A target: `https://www.u2tool.com/ko/tools/unicode-converter/` because the June checkpoint still marks the Korean unicode query family (`유니코드 변환`, `유니코드 변환기`) as `not-visible-yet`, while the page remains a 38-click / 1,262-impression former winner.

## 2026-07-02 Korean Unicode Converter Query-Intent Update

- The next Cohort A target was `https://www.u2tool.com/ko/tools/unicode-converter/`, a 38-click / 1,262-impression former winner. The June checkpoint still marked its Korean unicode query family as `not-visible-yet`, and the current page export only showed 4 impressions around position 43.75.
- URL Inspection checkpoint notes already show the canonical slash URL as indexed, so the recovery action stayed focused on query fit, title/meta quality, and content trust instead of another indexing request.
- Korean title, description, support content, examples, and FAQ now cover `유니코드 변환`, `유니코드 변환기`, `유니코드 변환기 온라인`, `한글 유니코드 변환`, `유니코드 이스케이프 변환`, `HTML 엔터티 변환`, `CSS 이스케이프 변환`, and `\uXXXX 변환`.
- The copy preserves the actual product boundary: browser string conversion between Unicode escape, HTML entity, CSS escape, and readable text. It explicitly does not claim UTF-8 file analysis, BOM processing, NFC/NFD normalization comparison, or server-side charset detection.
- The Korean Unicode TDK was synced across both `ko/base.json` and `ko.json` duplicate sources, replacing the old machine-translated meta snippet. The GSC loss metadata guard now blocks that old snippet from returning.
- During metadata validation, the Russian Barcode Generator guard exposed a remaining no-hyphen `штрихкод` TDK gap, so the existing Russian Barcode Generator title/description sources were synchronized with that query variant without changing the page's SVG-preview product boundary.
- Deployed version `b2e1827f-a297-4cca-ba0c-c59cf7d75abc`.
- Production smoke confirmed the new Korean Unicode title/meta, all target Korean phrases, absence of the old machine-translated Unicode snippet, and the Russian Barcode `штрихкод`/`штрих код`/`баркод` variants on production.
- Post-deploy `validate:search-engine-compliance` and full `validate:rendered-seo` passed against `https://www.u2tool.com`.
- Next recommended Cohort A target: `https://www.u2tool.com/ru/tools/html-preview/` because `ko/tools/html-preview/` already has recent current-click recovery, while the Russian HTML Preview page remains a 35-click / 1,276-impression former winner with weak current visibility.

## 2026-07-02 Russian HTML Preview Query-Intent Update

- The next Cohort A target was `https://www.u2tool.com/ru/tools/html-preview/`, a 35-click / 1,276-impression former winner with weak current visibility (`0` clicks, `3` impressions, average position around `47.33` in the June checkpoint).
- URL Inspection checkpoint notes already show the canonical slash URL as indexed, so the recovery action stayed focused on query fit, title/meta quality, and content trust instead of another indexing request.
- Russian title, description, support content, examples, and FAQ now cover `просмотр HTML`, `предпросмотр HTML`, `HTML просмотр онлайн`, `HTML и CSS`, `статичный HTML`, and `sandboxed iframe`.
- The copy preserves the actual product boundary: browser preview for small static HTML/CSS snippets in an iframe sandbox. It explicitly avoids claiming JavaScript support or execution because the component renders with `sandbox="allow-same-origin"` and no `allow-scripts`.
- The Russian HTML Preview TDK was synced across both `ru/base.json` and `ru.json` duplicate sources, replacing the old mixed English/Russian `Live HTML Viewer & Editor` title and the machine-translated `Бесплатный онлайн-инструмент` snippet.
- Deployed version `c0dae7bf-e894-490d-a419-c8e888e41f25`.
- Production smoke confirmed the new Russian title/meta, all target phrases, a fresh `x-u2tool-html-cache: MISS`, and absence of the old JavaScript-support and `Live HTML Viewer` fragments on `https://www.u2tool.com/ru/tools/html-preview/`.
- Post-deploy `validate:search-engine-compliance` and full `validate:rendered-seo` passed against `https://www.u2tool.com`.
- Next recommended Cohort A target: `https://www.u2tool.com/es/tools/html-preview/` because it remains a 26-click / 351-impression former winner, the June checkpoint shows weak current visibility, and the same HTML Preview intent family can reuse the now-proven sandbox/static-preview guard pattern without copying Russian wording.

## 2026-07-02 Spanish HTML Preview Query-Intent Update

- The next Cohort A target was `https://www.u2tool.com/es/tools/html-preview/`, a 26-click / 351-impression former winner. The June checkpoint showed weak current visibility (`0` clicks, `1` impression, average position `48.00`).
- Direct local GSC query evidence included `visualizador html`, which fell from `25` impressions at average position `14.08` in the previous export to `1` impression at position `48.00` in the current export.
- Spanish title, description, support content, examples, and FAQ now cover `visualizador HTML`, `vista previa HTML`, `ver HTML online`, `HTML y CSS`, `iframe sandboxed`, and the no-script boundary.
- The copy preserves the product boundary: browser preview for small static HTML/CSS snippets in a sandboxed iframe. It explicitly avoids claiming JavaScript support, real-time JavaScript execution, or complete interactive-site testing.
- The Spanish HTML Preview TDK was synced across both `es/base.json` and `es.json` duplicate sources, replacing old `Previsualización HTML`, `Renderizado en tiempo real`, and CSS/JavaScript-support snippets.
- Deployed version `1bfbf299-948f-4aae-8767-a6a7f7b8e413`.
- Initial production smoke saw a stale no-query HTML shell, while cache-busted requests and production message assets already had the new copy. Follow-up HEAD/GET refreshes replaced the no-query HTML cache; final smoke confirmed `x-u2tool-html-cache: HIT` with the new title/meta and all target phrases.
- Post-deploy `validate:search-engine-compliance`, full `validate:rendered-seo`, and targeted source-rendered `Spanish HTML Preview` checks passed against `https://www.u2tool.com`.
- Cohort A former-winner pass is now complete for the tracked high-value set. Next recommended target: start Cohort B with `https://www.u2tool.com/en/tools/gantt-chart-generator/`, the largest local impression-loss page in the exposure-loss table.

## 2026-07-02 English Gantt Chart Generator Query-Intent Update

- The first Cohort B target was `https://www.u2tool.com/en/tools/gantt-chart-generator/`, the largest local exposure-loss page: baseline current `0` clicks / `122` impressions versus previous `1` click / `6,377` impressions.
- Old query rows showed the missing intent cluster clearly: `gantt chart maker` (`-489` impressions), `create gantt chart online` (`-442` impressions), `create a gantt chart online`, `create gantt chart online free`, `easy gantt chart maker`, and adjacent `project timeline maker` intent.
- English title, description, support content, example, and FAQ now cover `Gantt Chart Maker Online`, `Create Gantt chart online free`, `easy Gantt chart maker`, `Create a Gantt chart online`, and `project timeline`.
- The copy preserves the actual product boundary: editable task rows, start/end dates, progress bars, chart title, theme, preview, and PNG/SVG export. It explicitly avoids dependency management, critical-path analysis, resource leveling, and live project-management tracking claims.
- A new GSC high-value content guard and rendered SEO source checks now protect this query-intent cluster and block the older overbroad `Create and manage Gantt charts` / `progress tracking` positioning from returning.
- First deploy attempt hit a transient Cloudflare Workers Assets `401 Unauthorized`; Wrangler `whoami` confirmed the OAuth session and the retry succeeded.
- Deployed version `2465904c-1626-44a8-872b-a8a263fd8f4b`.
- Production smoke confirmed the new title/meta, all target phrases, `x-u2tool-html-cache: MISS`, and absence of unsupported project-management claims on `https://www.u2tool.com/en/tools/gantt-chart-generator/`.
- Post-deploy `validate:search-engine-compliance`, full `validate:rendered-seo`, and targeted source-rendered `Gantt Chart` checks passed against `https://www.u2tool.com`.
- Next recommended Cohort B target: `https://www.u2tool.com/en/tools/iban-validator/` because it has high-intent validator demand, previous clicks, and a large exposure loss (`7` current impressions versus `2,395` previous impressions) before moving to the zero-click `sitemap-generator` exposure-loss page.

## 2026-07-02 English IBAN Validator Query-Intent Update

- The next Cohort B target was `https://www.u2tool.com/en/tools/iban-validator/`, a high-intent validator page with baseline current `0` clicks / `7` impressions versus previous `3` clicks / `2,395` impressions.
- Old query rows showed a broad checker/validator cluster: `iban checker online free`, `iban checker`, `check iban`, `iban validator online`, `validate iban number`, `validate iban online`, `online iban validator`, `online iban checker`, and account-check phrasing such as `iban account checker`.
- English title and meta description now cover `IBAN Checker Online`, `Validate IBAN online`, `free IBAN checker`, and MOD-97 checksum validation.
- Support content, examples, and FAQ now cover the old query family while preserving the actual product boundary: browser-side country-code, registered length, allowed-format, and ISO 7064 MOD-97 checksum checks; grouped formatting; country/check-digit/BBAN display; and no bank contact, account-ownership verification, or payment-acceptance guarantees.
- The GSC high-value content guard now requires the IBAN checker/validator query cluster. Metadata and rendered SEO guards now require `IBAN Checker Online`, `Validate IBAN online`, and MOD-97 language while blocking old unsupported fragments such as `Supports all European countries`, `show bank code`, and `bank information`.
- Deployed version `421dfd6e-9dd3-49a1-b9bc-a8ae8a040288`.
- Production smoke confirmed the new title/meta, all target phrases, `x-u2tool-html-cache: MISS`, and absence of unsupported bank-information claims on `https://www.u2tool.com/en/tools/iban-validator/`.
- Post-deploy full `validate:rendered-seo`, targeted source-rendered `IBAN Validator`, and retried `validate:search-engine-compliance` passed against `https://www.u2tool.com`. The first compliance run had a transient `robots.txt` fetch failure; the retry passed all checks.
- Next recommended Cohort B target: `https://www.u2tool.com/en/tools/sitemap-generator/`, because it has a large exposure loss (`0` current impressions versus `1,340` previous impressions) and belongs to a developer-intent query family that can be validated with strict no-crawler/no-submission boundaries.

## 2026-07-03 English HTML Preview Query-Intent Update

- The next scalable recovery target was `https://www.u2tool.com/en/tools/html-preview/`, selected from the SEO/GEO audit worklist after excluding already repaired former-winner samples. It had `8` lost clicks and `486` lost impressions, plus source drift between the duplicate English TDK stores.
- Old GSC query evidence included `html viewer online`, `html online viewer`, `html preview`, `online html preview`, `html previewer`, and `preview html online`.
- English title, description, support content, examples, and FAQ now cover `HTML Viewer Online`, `Preview HTML online`, `HTML viewer online`, `HTML online viewer`, `online HTML preview`, `HTML previewer`, and `preview HTML online`.
- The copy preserves the actual product boundary: browser preview for static HTML/CSS snippets in a sandboxed iframe-style preview area. It explicitly states that the tool does not enable scripts, matching the component's `sandbox="allow-same-origin"` iframe configuration without `allow-scripts`.
- The English HTML Preview TDK was synced across `en/base.json` and `en.json`, replacing older `Live HTML Viewer`, JavaScript-support, and `live sandboxed iframe` positioning.
- Deployed version `1ddfe1af-07da-4e13-94d1-174fbcfe6451`.
- Production smoke confirmed the new title/meta, all target English phrases, and absence of unsupported JavaScript execution or complete interactive-site testing claims on `https://www.u2tool.com/en/tools/html-preview/`.
- Post-deploy `validate:search-engine-compliance`, full `validate:rendered-seo`, and targeted source-rendered `HTML Preview` checks passed against `https://www.u2tool.com`.
- Next recommended batch target: treat `Credit Card Validator` as a multilingual family instead of one URL at a time. The current worklist shows historical loss across `ru`, `ar`, `en`, `es`, and `zh`, so one shared intent/boundary pass can recover more surface area while keeping locale-specific wording native.

## 2026-07-03 Credit Card Validator Family Query-Intent Update

- The next scalable recovery target was the multilingual `Credit Card Validator` family across `en`, `ru`, `ar`, `es`, `zh`, `ja`, `de`, `fr`, `pt`, and `ko`. The worklist showed material former-winner loss across `ru`, `ar`, `en`, `es`, and `zh`, plus residual coverage and low-ranking issues in several secondary locales.
- Locale titles, meta descriptions, support content, examples, and FAQ were rewritten around the actual search intent: credit card number checker / validator phrasing, Luhn checksum checks, card-network pattern hints, length checks, and browser-side validation of test numbers.
- The trust boundary was tightened across all locales: the tool validates number format and checksum only. It does not verify real accounts, balances, CVV, identity, bank authorization, payment acceptance, or whether a real card can be charged.
- Source guards were updated so GSC high-value content, rendered SEO, metadata drift, and content-trust checks require the local validator/checker phrases while blocking old generic or overclaiming fragments.
- Deployed version `735fe3ef-fa2c-41e0-a459-5b75774046c6`.
- Cloudflare custom cache purge was completed for the stale `de`, `fr`, `ja`, and `ko` production URLs only; no full-site purge was used.
- Production smoke confirmed `200` responses, `x-u2tool-html-cache: MISS`, required locale phrases, and absence of old generic phrases on the four formerly stale URLs.
- Validation passed before and after deploy: `validate:gsc-high-value-content`, `validate-gsc-loss-metadata`, `support-content-fallback.test.ts`, `validate:tdk-drift`, `build`, `validate:search-engine-compliance`, full `validate:rendered-seo`, and targeted source-rendered `Credit Card Validator` against `https://www.u2tool.com`.
- Next recommended batch target: `image-splitter` family. It has multiple localized former-winner rows (`ru`, `ar`, `ja` and related locales), about `12` lost clicks / `179` lost impressions in the family view, and mostly straightforward SEO debt (`faq_short`, long descriptions, source drift, coverage) without the higher content-trust risk of relationship or finance-adjacent tools.

## 2026-07-04 Image Splitter Family Completion Checkpoint

- The multilingual `image-splitter` family is now treated as complete for this recovery pass across `en`, `ru`, `ar`, `es`, `zh`, `ja`, `de`, `fr`, `pt`, and `ko`.
- Guard coverage is in place for all 10 locales in `gsc-high-value-content.test.ts` and `validate-gsc-loss-metadata.ts`, requiring localized grid-splitting intent phrases, rows/columns language, PNG part output, and ZIP download language.
- Rendered SEO source checks are in place for the historically visible recovery samples: Russian, Japanese, and Arabic Image Splitter.
- Validation checkpoint on 2026-07-04:
  - `npm run validate:gsc-high-value-content` passed: 80 tests.
  - `npm run validate:gsc-loss-metadata` passed: 65 checks.
  - `npm run validate:tdk-integrity -- --top 8` passed with `0` errors and `2661` warning-only findings; `image-splitter` has `0` remaining TDK warnings.
  - `npm run validate:tdk-drift` passed for all `5570` localized TDK records.
  - `INCLUDE_SOURCE_RENDERED_CHECKS=1 RENDERED_SEO_CHECK='image splitter' npm run validate:rendered-seo` passed for `/ru/tools/image-splitter/`, `/ja/tools/image-splitter/`, and `/ar/tools/image-splitter/`.
  - `npm run validate:llms-discovery` and `npm run validate:edge-simulation` passed.
- No broad GSC validation button should be used for this family. If GSC still shows stale coverage rows, handle them through the coverage-blocker classification workflow rather than another manual content pass.
- Next execution target: classify `exports/seo/worklists/2026-07-04/02-coverage-blockers.md` before requesting indexing or starting another recovery family.
