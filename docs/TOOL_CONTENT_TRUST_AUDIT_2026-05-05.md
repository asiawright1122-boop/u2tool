# Tool Content Trust Audit - 2026-05-05

## Executive Summary

This audit checks tool support content against search-engine quality expectations and the actual U2Tool browser-first implementation. The primary recovery risk addressed here is not raw indexability: GSC Coverage showed indexed pages continued to rise while impressions collapsed. The next defensible layer is content trust, overclaiming, and thin support content.

- Tool message files scanned: 5010
- English tool files scanned: 501
- Popular English tool files checked for depth: 50
- Files with high-confidence implementation overclaims: 218
- Files with medium-confidence claims for future review: 176
- Popular English files with depth gaps: 20

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
| `d3-runtime` | high | 186 | Mentions a D3.js chart runtime even though chart tools render through the shared ECharts stack. |
| `microservices-claim` | medium | 59 | References distributed backend architecture that may be unrelated to the page implementation. |
| `oauth2-claim` | medium | 43 | References OAuth integrations that should be verified against the actual tool. |
| `redis-runtime` | medium | 37 | Mentions Redis-specific behavior that should be verified against the actual tool UI. |
| `print-ready-export` | medium | 34 | Claims print-grade export precision that should be backed by implementation evidence. |
| `rest-api-claim` | medium | 31 | Describes API/backend capabilities that may not exist on the page implementation. |
| `imagemagick-runtime` | high | 28 | Mentions ImageMagick-backed processing that the repo does not ship. |
| `thin-faqs` | depth | 20 | Popular English tool has 0 FAQs; expected at least 3. |
| `server-side-reference` | medium | 18 | References server-side behavior on a browser-first tool page and should be verified. |
| `codec-runtime-claim` | high | 8 | Mentions native image codec pipelines that are not part of the browser-first implementation. |
| `openid-connect-claim` | medium | 7 | References authentication-platform integrations that should be verified against the actual tool. |
| `svgjs-runtime` | high | 2 | Mentions an SVG.js rendering stack that is not present in this repo. |

## High-Confidence Overclaim Samples

| Locale | Tool | Field | Rule | Excerpt |
|---|---|---|---|---|
| ar | `area-chart-generator` | `detailed_description` | `d3-runtime` | لوب بصري دقيق. يعتمد الأداة على محرك رسم مبني على مكتبة D3.js لإنشاء رسوم قابلة للتفاعل مع المستخدم، مع دعم تنسيقات S |
| de | `area-chart-generator` | `detailed_description` | `d3-runtime` | Datenvisualisierung. Technisch basiert das Tool auf der D3.js-Bibliothek und ermöglicht die Darstellung kumulativer D |
| fr | `area-chart-generator` | `detailed_description` | `d3-runtime` | des algorithmes de traçage basés sur les bibliothèques D3.js ou Chart.js pour générer des graphiques interactifs en |
| ja | `area-chart-generator` | `detailed_description` | `d3-runtime` | このツールは、時系列データや累積データの可視化に特化したエリアチャート生成エンジンです。D3.jsやCanvas APIを基盤に、複数のデータ系列を積み上げたスタック型エリアチャートを動的に生成します。ユーザー |
| ko | `area-chart-generator` | `detailed_description` | `d3-runtime` | 이 도구는 D3.js 및 SVG 렌더링 엔진을 기반으로 누적 데이터 시리즈를 시각화하는 영역 차트 생성기를 구현합니다. |
| ru | `area-chart-generator` | `detailed_description` | `d3-runtime` | считывает координаты вершин полигонов, используя методы D3.js для построения SVG-путей. Экспорт реализован через Canv |
| zh | `area-chart-generator` | `detailed_description` | `d3-runtime` | Area Chart Generator基于D3.js和Canvas技术实现，可将多维度数值型数据转化为堆叠式面积图。该工具支持多数据序列叠加显示，通过填充折线图与坐 |
| ar | `bar-chart-generator` | `detailed_description` | `d3-runtime` | العددية إلى تمثيلات بصرية ديناميكية باستخدام مكتبات مثل D3.js أو Chart.js. يتيح للأفراد والفرق إنشاء رسوم بيانية عمود |
| de | `bar-chart-generator` | `detailed_description` | `d3-runtime` | und bietet Echtzeit-Rendering durch WebGL-beschleunigte D3.js-Bibliotheken. Benutzer können Achsenbeschriftungen, Ska |
| es | `bar-chart-generator` | `detailed_description` | `d3-runtime` | datos en el lado del cliente. Utiliza bibliotecas como D3.js y SVG.js para renderizar gráficos escalables en formato |
| fr | `bar-chart-generator` | `detailed_description` | `d3-runtime` | es (HTML5 Canvas, SVG et bibliothèques JavaScript comme D3.js). Il permet de transformer des données tabulaires en re |
| ja | `bar-chart-generator` | `detailed_description` | `d3-runtime` | ンを使用して、インタラクティブな棒グラフを生成します。ユーザーはCSVまたはJSON形式でデータをインポートし、D3.jsの軸生成機能を活用して線形・対数スケールの軸を動的に調整可能です。グラデーション塗りつぶし、シャドウエフェクト、 |
| ko | `bar-chart-generator` | `detailed_description` | `d3-runtime` | SV 형식의 구조화된 데이터를 입력하여 실시간으로 대화형 바 차트를 생성할 수 있습니다. 이 도구는 D3.js 및 Chart.js 라이브러리를 커스터마이징하여 개발되었으며, 축 레이블, 데이터 시리즈, 색상 팔 |
| pt | `bar-chart-generator` | `detailed_description` | `d3-runtime` | rt Generator é uma ferramenta web baseada em tecnologia D3.js e SVG que permite a criação programática de gráficos de |
| ru | `bar-chart-generator` | `detailed_description` | `d3-runtime` | реализованный на JavaScript с использованием библиотеки D3.js. Он обеспечивает визуализацию данных в формате гистогра |
| zh | `bar-chart-generator` | `detailed_description` | `d3-runtime` | Bar Chart Generator是一款基于Web技术的数据可视化工具，采用D3.js与SVG渲染引擎实现动态图表生成。通过解析用户输入的JSON/CSV格式数据集，自动构建笛卡尔坐标系，支持单轴/ |
| es | `bar-chart-generator` | `detailed_description` | `svgjs-runtime` | n el lado del cliente. Utiliza bibliotecas como D3.js y SVG.js para renderizar gráficos escalables en formatos vectori |
| de | `boxplot-chart-generator` | `detailed_description` | `d3-runtime` | erator auf leistungsstarken JavaScript-Bibliotheken wie D3.js oder Chart.js, die pixelgenaue Darstellung und responsi |
| es | `boxplot-chart-generator` | `detailed_description` | `d3-runtime` | ación por categorías. El motor de renderizado basado en D3.js garantiza precisión matemática en los cálculos estadíst |
| fr | `boxplot-chart-generator` | `detailed_description` | `d3-runtime` | tations en LaTeX pour les étiquettes. Le moteur utilise D3.js pour le rendu SVG interactif et permet l'export en PNG |
| ja | `boxplot-chart-generator` | `detailed_description` | `d3-runtime` | します。研究者、データアナリスト、教育者は、実験結果の分布特性や品質管理データの偏り分析に活用できます。内部ではD3.jsを基盤にしたレンダリングエンジンが動作し、SVGパスデータを動的に生成。ユーザーはカスタムカラーパレットや軸ラベ |
| ko | `boxplot-chart-generator` | `detailed_description` | `d3-runtime` | 교, 제조업의 품질 관리 등 다양한 분야에서 활용됩니다. 내부적으로는 WebGL 기반 렌더링 엔진과 D3.js 라이브러리를 사용하여 고성능 차트를 구현하며, 사용자는 SVG 경로 데이터 또는 PNG 래스터 이미 |
| ru | `boxplot-chart-generator` | `detailed_description` | `d3-runtime` | ляет статистические метрики с использованием библиотеки D3.js. Диаграммы рендерятся в SVG для масштабирования без пот |
| zh | `boxplot-chart-generator` | `detailed_description` | `d3-runtime` | 本工具基于D3.js和Canvas技术实现，提供专业的箱线图可视化功能。支持输入JSON/CSV格式的数值型数据集，自动计算四分位间 |
| es | `calendar-heatmap-generator` | `detailed_description` | `d3-runtime` | el generador procesa datos mediante un motor basado en D3.js o bibliotecas equivalentes, aplicando funciones de esca |
| fr | `calendar-heatmap-generator` | `detailed_description` | `d3-runtime` | 5, SVG et JavaScript (utilisant des bibliothèques comme D3.js) permettant de visualiser des données temporelles quoti |
| ja | `calendar-heatmap-generator` | `detailed_description` | `d3-runtime` | このツールは時系列データをカレンダー形式で可視化するHTML5ベースのチャートレンダリングエンジンです。D3.jsとSVGレンダリング技術を活用し、日単位の数値データを色調で表現するヒートマップを生成します。開発者はISO 8 |
| ko | `calendar-heatmap-generator` | `detailed_description` | `d3-runtime` | 패턴 파악, 건강 데이터 추적 등 일별 데이터의 주기적 경향성을 분석할 때 유용합니다. 내부적으로는 D3.js 라이브러리를 활용한 DOM 조작과 CanvasRenderingContext2D API를 사용해 실시 |
| zh | `calendar-heatmap-generator` | `detailed_description` | `d3-runtime` | 日历热力图生成器是一款基于WebGL加速的可视化分析工具，采用D3.js与Canvas双渲染引擎实现百万级时间序列数据的实时渲染。该工具通过矩阵式日期编码算法，将离散的日期值映射为三维 |
| de | `candlestick-chart-generator` | `detailed_description` | `d3-runtime` | en durch eine Kombination aus JavaScript-Frameworks wie D3.js und SVG-Rendering, um dynamische Kerzencharts zu erzeug |

## Popular English Depth Gaps

These are not automatic noindex problems. They are prioritization targets for content refresh because popular landing pages should give users concrete, page-accurate guidance, examples, and FAQs.

| Tool | Detailed Chars | Steps | Examples | FAQs | Gap Codes |
|---|---:|---:|---:|---:|---|
| `chinese-converter` | 1457 | 6 | 4 | 0 | `thin-faqs` |
| `json-diff` | 1075 | 6 | 4 | 0 | `thin-faqs` |
| `json-to-csv` | 1240 | 6 | 4 | 0 | `thin-faqs` |
| `json-to-typescript` | 1137 | 6 | 4 | 0 | `thin-faqs` |
| `json-to-yaml` | 1001 | 6 | 4 | 0 | `thin-faqs` |
| `loan-calculator` | 896 | 6 | 4 | 0 | `thin-faqs` |
| `lorem-ipsum` | 1123 | 6 | 4 | 0 | `thin-faqs` |
| `markdown-to-html` | 1132 | 6 | 4 | 0 | `thin-faqs` |
| `number-base-converter` | 1171 | 6 | 4 | 0 | `thin-faqs` |
| `percentage-calculator` | 1249 | 6 | 4 | 0 | `thin-faqs` |
| `scientific-calculator` | 1106 | 6 | 4 | 0 | `thin-faqs` |
| `sql-formatter` | 1074 | 6 | 4 | 0 | `thin-faqs` |
| `ssl-checker` | 1026 | 6 | 4 | 0 | `thin-faqs` |
| `text-encryption` | 1189 | 6 | 4 | 0 | `thin-faqs` |
| `text-statistics` | 1091 | 6 | 4 | 0 | `thin-faqs` |
| `text-to-slug` | 1482 | 6 | 4 | 0 | `thin-faqs` |
| `timezone-converter` | 1230 | 6 | 4 | 0 | `thin-faqs` |
| `unicode-converter` | 1137 | 6 | 4 | 0 | `thin-faqs` |
| `unit-converter` | 1017 | 6 | 4 | 0 | `thin-faqs` |
| `uuid-generator` | 1285 | 6 | 4 | 0 | `thin-faqs` |

## Recovery Actions

1. Keep the runtime fallback guard active for all high-confidence implementation overclaims.
2. Refresh the highest-impression English tool pages first with page-accurate descriptions, usage steps, examples, and FAQs.
3. Use GSC Performance exports to decide the next content wave by lost impressions and current average position.
4. Re-run `npm run report:content-trust` after each content wave and before submitting more IndexNow batches.
