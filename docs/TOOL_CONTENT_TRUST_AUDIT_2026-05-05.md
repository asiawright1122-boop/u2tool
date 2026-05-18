# Tool Content Trust Audit - 2026-05-05

## Executive Summary

This audit checks tool support content against search-engine quality expectations and the actual U2Tool browser-first implementation. The primary recovery risk addressed here is not raw indexability: GSC Coverage showed indexed pages continued to rise while impressions collapsed. The next defensible layer is content trust, overclaiming, and thin support content.

- Tool message files scanned: 5481
- English tool files scanned: 549
- Popular English tool files checked for depth: 95
- Files with high-confidence implementation overclaims: 18
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
| `xml-validator-unsupported-schema-claim` | high | 9 | Claims XML schema, upload, SAX/libxml2, quick-fix, download, JSON, or CI output behavior that is not present in the current DOMParser UI. |
| `image-to-pdf-unsupported-workflow-claim` | high | 5 | Claims image-to-PDF paste/copy, OCR, quality, GIF, server-upload, or advanced output controls that are not present in the current upload-to-PDF UI. |
| `reading-time-unsupported-analysis-claim` | high | 4 | Claims Reading Time Calculator NLP, Markdown, language, API, or section-analysis behavior that is not present in the current counter UI. |
| `image-collage-unsupported-editor-claim` | high | 2 | Claims collage layouts, effects, border, JPEG, live preview, or advanced image-editing controls that are not present in the current horizontal/vertical PNG collage UI. |

## High-Confidence Overclaim Samples

| Locale | Tool | Field | Rule | Excerpt |
|---|---|---|---|---|
| es | `image-collage` | `detailed_description` | `image-collage-unsupported-editor-claim` | osición de cada imagen, y aplicar efectos visuales como bordes y sombras. Esta herramienta es ideal para diseñadores g |
| es | `image-collage` | `usage_steps[3]` | `image-collage-unsupported-editor-claim` | Paso 4: Aplica efectos visuales como bordes, sombras, y filtros a las imágenes seleccionadas. Utili |
| es | `image-to-pdf` | `usage_steps[2]` | `image-to-pdf-unsupported-workflow-claim` | ejemplo, A4 o Letter), y la resolución de las imágenes (DPI). |
| es | `image-to-pdf` | `usage_examples[3]` | `image-to-pdf-unsupported-workflow-claim` | gurando la orientación en paisaje y la resolución a 150 DPI para un equilibrio entre calidad y tamaño del archivo. |
| ko | `image-to-pdf` | `detailed_description` | `image-to-pdf-unsupported-workflow-claim` | 를 단일 PDF 문서로 변환하는 도구입니다. 이 도구는 다양한 이미지 파일 형식(JPEG, PNG, GIF 등)을 지원하며, 사용자는 페이지 설정(용지 크기, 방향, 마진 등)을 조정하여 원하는 형태의 PD |
| pt | `image-to-pdf` | `detailed_description` | `image-to-pdf-unsupported-workflow-claim` | dade de formatos de imagem, incluindo JPEG, PNG, BMP, e GIF, tornando-a uma solução versátil para diferentes necess |
| zh | `image-to-pdf` | `detailed_description` | `image-to-pdf-unsupported-workflow-claim` | 尽可能小，从而优化存储和传输效率。此外，Image to PDF 支持多种图像格式，包括常见的JPEG、PNG和GIF等，满足不同用户的需求。对于需要经常整理和分发图像文件的用户，如设计师、摄影师或教育工作者，Image to P |
| ar | `reading-time-calculator` | `usage_steps[3]` | `reading-time-unsupported-analysis-claim` | اضغط على زر 'تحليل' لتشغيل محرك NLP (معالجة اللغة الطبيعية) لتحديد كثافة المحتوى |
| fr | `reading-time-calculator` | `detailed_description` | `reading-time-unsupported-analysis-claim` | i combine algorithmes de traitement du langage naturel (NLP) et modèles statistiques pour déterminer avec précision |
| ja | `reading-time-calculator` | `detailed_description` | `reading-time-unsupported-analysis-claim` | Calculatorは、テキストや記事の読了時間を正確に計算するためのツールです。このツールは、自然言語処理（NLP）技術を用いて、入力されたテキストの単語数、文の長さ、パラグラフの構造などを解析し、一般的な読解速度に基づいて読 |
| ko | `reading-time-calculator` | `detailed_description` | `reading-time-unsupported-analysis-claim` | 이 도구는 텍스트 분석을 기반으로 정확한 읽기 시간을 계산하는 고급 유틸리티입니다. 자연어 처리(NLP) 기술을 활용해 입력된 텍스트를 토큰화(Tokenization)하여 단어 단위로 분석하고, 사용자가 |
| ar | `xml-validator` | `detailed_description` | `xml-validator-unsupported-schema-claim` | ثل Expat أو Xerces) يقوم بتفكيك المستند إلى شجرة DOM أو SAX، ويرصد أي انتهاكات للقواعد الصارفة (syntactic rules). ت |
| de | `xml-validator` | `detailed_description` | `xml-validator-unsupported-schema-claim` | nzen führen. Technisch arbeitet der Validator mit einem SAX-Parser für effiziente Speicherauslastung und DOM-Integr |
| es | `xml-validator` | `detailed_description` | `xml-validator-unsupported-schema-claim` | nsaje. Internamente, el validador utiliza un analizador SAX (Simple API for XML) para procesar el documento de form |
| fr | `xml-validator` | `detailed_description` | `xml-validator-unsupported-schema-claim` | hiers de mapping ORM. Le processus utilise un analyseur SAX (Simple API for XML) pour détecter les erreurs de bien- |
| ja | `xml-validator` | `detailed_description` | `xml-validator-unsupported-schema-claim` | 造エラーや、エンコーディング不一致、タグの不整合を迅速に特定する必要がある際、このツールを活用します。内部的にはSAX（Simple API for XML）パーサーを使用し、メモリ効率の高い逐次処理で大規模ファイルも高速に解析し |
| ko | `xml-validator` | `detailed_description` | `xml-validator-unsupported-schema-claim` | 속성 값의 인용 부호 처리, 네임스페이스 선언, CDATA 섹션의 경계 처리 등을 점검합니다. 특히 SAX2.0 호환 파서를 사용해 대용량 파일 처리 시 메모리 효율성을 확보하면서도 XSD/DTD 스키마 유효 |
| pt | `xml-validator` | `detailed_description` | `xml-validator-unsupported-schema-claim` | ransformações XSLT. O funcionamento baseia-se em parser SAX ou DOM, que percorre o documento em tempo real, identif |
| ru | `xml-validator` | `usage_steps[1]` | `xml-validator-unsupported-schema-claim` | Выберите тип проверки: 'Well-formedness' или 'Schema Validation' в выпадающем меню |
| zh | `xml-validator` | `usage_steps[2]` | `xml-validator-unsupported-schema-claim` | 切换「验证模式」选择DOM解析（完整校验）或SAX流式校验 |

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
