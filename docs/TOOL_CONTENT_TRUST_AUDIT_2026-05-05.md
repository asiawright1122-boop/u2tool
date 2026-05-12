# Tool Content Trust Audit - 2026-05-05

## Executive Summary

This audit checks tool support content against search-engine quality expectations and the actual U2Tool browser-first implementation. The primary recovery risk addressed here is not raw indexability: GSC Coverage showed indexed pages continued to rise while impressions collapsed. The next defensible layer is content trust, overclaiming, and thin support content.

- Tool message files scanned: 5380
- English tool files scanned: 538
- Popular English tool files checked for depth: 84
- Files with high-confidence implementation overclaims: 15
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
| `barcode-unsupported-output-claim` | high | 22 | Claims barcode export or styling controls that are not present in the current SVG preview UI. |
| `thin-detailed-description` | depth | 15 | Popular English tool has a short detailed_description (...). |
| `scientific-calculator-unsupported-function-claim` | high | 8 | Claims scientific-calculator controls or math modes that are not present in the current button UI. |
| `redis-runtime` | medium | 3 | Mentions Redis-specific behavior that should be verified against the actual tool UI. |
| `dice-roller-unsupported-control-claim` | high | 1 | Claims Dice Roller controls that are not present in the current dice button, modifier, result, and history UI. |
| `document-word-counter-export-claim` | high | 1 | Claims Document Word Counter export behavior that is not present in the current live statistics UI. |
| `server-side-reference` | medium | 1 | References server-side behavior on a browser-first tool page and should be verified. |
| `thin-faqs` | depth | 1 | Popular English tool has 0 FAQs; expected at least 3. |

## High-Confidence Overclaim Samples

| Locale | Tool | Field | Rule | Excerpt |
|---|---|---|---|---|
| en | `barcode-generator` | `detailed_description` | `barcode-unsupported-output-claim` | dule width), quiet zone size, and resolution (up to 600 DPI) to meet ISO/IEC 15416 compliance requirements. This to |
| en | `barcode-generator` | `usage_steps[2]` | `barcode-unsupported-output-claim` | range), quiet zone (2.3-4.6mm), and resolution (150-600 DPI) |
| en | `barcode-generator` | `usage_steps[5]` | `barcode-unsupported-output-claim` | Download the output as PNG (with adjustable anti-aliasing) or SVG (with XML struct |
| en | `document-word-counter` | `usage_steps[4]` | `document-word-counter-export-claim` | Export stats |
| ar | `barcode-generator` | `detailed_description` | `barcode-unsupported-output-claim` | ت باستخدام معايير الصناعة، مع إمكانية تحديد دقة الصورة (DPI)، وضبط نسب الأبعاد (العرض/الارتفاع)، وإضافة مناطق هادئة |
| ar | `barcode-generator` | `usage_steps[3]` | `barcode-unsupported-output-claim` | صورة (Resolution) من القائمة المنسدلة (150، 300، أو 600 DPI) حسب استخدام الطباعة. |
| ar | `barcode-generator` | `usage_steps[5]` | `barcode-unsupported-output-claim` | انقر على زر 'إنشاء الباركود' لتنزيل الملف النهائي بصيغة PNG أو JPEG. |
| es | `barcode-generator` | `detailed_description` | `barcode-unsupported-output-claim` | sion), altura de barras, margen silencioso y resolución DPI. Los usuarios necesitan esta herramienta para automatiz |
| es | `barcode-generator` | `usage_steps[3]` | `barcode-unsupported-output-claim` | 4. Configura la resolución en DPI (300-1200) según el propósito de impresión usando el se |
| es | `barcode-generator` | `usage_steps[5]` | `barcode-unsupported-output-claim` | tener el código de barras y descárgalo en formato SVG o PNG con un clic en los botones correspondientes. |
| fr | `barcode-generator` | `detailed_description` | `barcode-unsupported-output-claim` | ies en une représentation graphique vectorielle (SVG ou PNG) en appliquant des algorithmes de codage spécifiques à |
| fr | `barcode-generator` | `usage_steps[2]` | `barcode-unsupported-output-claim` | auteur du code-barres (en pixels), résolution (72 à 600 DPI) et épaisseur des barres. |
| fr | `barcode-generator` | `usage_steps[5]` | `barcode-unsupported-output-claim` | Téléchargez le résultat au format SVG ou PNG haute qualité via le bouton 'Exporter' après validation |
| ja | `barcode-generator` | `detailed_description` | `barcode-unsupported-output-claim` | あり、POSシステムとの互換性を確保するためのEAN-13やUPCのサポートが重要です。技術的には、SVGまたはPNG形式のベクタ画像を生成し、解像度に依存しない高品質な出力が可能です。ユーザーが入力したデータは、選択されたフォー |
| ja | `barcode-generator` | `usage_steps[3]` | `barcode-unsupported-output-claim` | 4. 解像度調整スライダーで出力画像のDPIを300〜1200の範囲で設定します。 |
| ja | `barcode-generator` | `usage_steps[5]` | `barcode-unsupported-output-claim` | 6. 完了したバーコードは右クリックでPNGまたはSVG形式でのダウンロードが可能です。 |
| ko | `barcode-generator` | `detailed_description` | `barcode-unsupported-output-claim` | 리 시스템 구축, 상품 포장 디자인, 병원 자산 추적 등 다양한 분야에서 사용할 수 있으며, SVG/PNG 형식으로 다운로드 가능한 고해상도 이미지를 생성합니다. 실시간 렌더링 엔진은 Canvas API와 |
| ko | `barcode-generator` | `usage_steps[5]` | `barcode-unsupported-output-claim` | 'Download SVG' 또는 'PNG 600dpi' 버튼으로 이미지 저장 |
| ko | `barcode-generator` | `usage_examples[3]` | `barcode-unsupported-output-claim` | 소형 가전제품 포장에 1.5cm 크기의 UPC-A 바코드 PNG 파일 생성 |
| pt | `barcode-generator` | `detailed_description` | `barcode-unsupported-output-claim` | ígitos verificadores para integridade e exporta imagens PNG ou SVG com resolução ajustável (DPI), permitindo person |
| pt | `barcode-generator` | `usage_steps[5]` | `barcode-unsupported-output-claim` | 6. Baixe o resultado nos formatos PNG (raster) ou SVG (vetorial) ou copie o código embeddable |
| zh | `barcode-generator` | `detailed_description` | `barcode-unsupported-output-claim` | ）及UPC-A（通用商品代码）四种编码体系。采用HTML5 Canvas动态渲染技术实现无损缩放，生成的SVG/PNG图像可直接用于商业打印。开发者通过ISO/IEC 15417标准校验算法确保生成的条码可通过激光/CCD扫描设备 |
| zh | `barcode-generator` | `usage_steps[5]` | `barcode-unsupported-output-claim` | 点击生成按钮后下载SVG矢量文件或PNG位图（分辨率可选300/600/1200dpi） |
| pt | `dice-roller` | `usage_steps[1]` | `dice-roller-unsupported-control-claim` | Selecione o tipo de dado que deseja lançar using the dropdown menu (por exemplo, D6, D20). |
| ar | `scientific-calculator` | `usage_steps[2]` | `scientific-calculator-unsupported-function-claim` | استخدم زر 'sinh' أو 'cosh' لحساب الدوال الزائدية، أو زر 'ln' للوغاريتم |
| de | `scientific-calculator` | `usage_steps[0]` | `scientific-calculator-unsupported-function-claim` | zwischen Standard- und inversen Funktionen (z.B. sin → sin⁻¹). |
| de | `scientific-calculator` | `usage_examples[1]` | `scientific-calculator-unsupported-function-claim` | Bestimmung der Phasendifferenz in der Optik: tan⁻¹((λ/d)) für Interferenzmuster mit Wellenlänge λ und Gitt |
| es | `scientific-calculator` | `detailed_description` | `scientific-calculator-unsupported-function-claim` | enciales (e^x, 10^x), y operaciones hiperbólicas (senh, cosh, tanh). Su motor de cálculo interpreta expresiones mate |
| fr | `scientific-calculator` | `usage_steps[1]` | `scientific-calculator-unsupported-function-claim` | n mathématique en utilisant les touches spécialisées : 'sinh' pour sinus hyperbolique, 'log₂' pour logarithme base 2 |
| ko | `scientific-calculator` | `detailed_description` | `scientific-calculator-unsupported-function-claim` | 산기는 고급 수학 연산을 위한 웹 기반 도구로, 삼각 함수(sin, cos, tan), 쌍곡선 함수(sinh, cosh), 로그 함수(log, ln), 지수 함수(e^x, 10^x) 및 복잡한 수식 해석 기능 |

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
