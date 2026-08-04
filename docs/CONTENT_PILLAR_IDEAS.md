# 信息型内容选题池（少量精做）

> 原则：**少量精做**（首批 20-30 篇，每篇真实有用），优先 es/de/ru/ja 四语，
> 每篇内容页**内链到对应保留工具页**（hub 结构），获取信息型长尾流量并给工具页
> 传递内部链接权重。
> 类型：教程（how-to）/ 对比（vs）/ 指南（guide）/ 常见问题。
> 这些词的竞争显著低于工具页头词，新域名可争取索引与排名。

## 实现提示（下一轮）

- 建议新路由 `/guides/[slug]`（或复用 compare 模式），内容页进 sitemap-pages，
  不占 tools sitemap。
- 每篇页面：H1 = 目标词，正文含真实步骤/示例（不是模板），内链 2-3 个相关工具页。

## 首批选题（按语言，标 ★ 为最高优先）

### es（主攻）
1. ★ Cómo crear un diagrama de Gantt gratis online → gantt-chart-generator
2. ★ Cómo convertir JSON a Excel en línea → json-to-excel
3. Cómo hacer una línea de tiempo (timeline) gratis → timeline-chart-generator
4. Generador de gráficas: líneas vs barras vs dispersión (guía) → graph-chart-generator
5. Cómo ver un archivo Excel sin Excel (online) → excel-viewer
6. Calculadora de gastos de electricidad: cómo estimar tu factura → electricity-cost-calculator

### de（主攻）
7. ★ Excel-Datei online ansehen ohne Office → excel-viewer
8. ★ Zeitstrahl (Timeline) online erstellen – kostenlos → timeline-chart-generator
9. Wasserfall-Diagramm in Excel vs online erstellen → waterfall-chart-generator
10. Währungsrechner: Wechselkurse verstehen → currency-converter
11. JSON-Pfade finden: Tipps und Beispiele → json-path-finder

### ru（主攻）
12. ★ Создание диаграммы Ганта онлайн бесплатно → gantt-chart-generator
13. ★ Как отформатировать номера телефонов онлайн → phone-formatter
14. Каскадные диаграммы: когда и как использовать → waterfall-chart-generator
15. Проверка кредитных карт: как работает алгоритм Луна → credit-card-validator
16. Конвертер часовых поясов для планирования встреч → timezone-converter

### ja（主攻）
17. ★ 無料でガントチャートを作成する方法 → gantt-chart-generator
18. ★ タイムラインを無料で作成する方法 → timeline-chart-generator
19. 電気代の計算方法と節約のコツ → electricity-cost-calculator
20. EXIF情報の見方と活用 → exif-viewer
21. タイムゾーン変換で会議時間を調整するコツ → timezone-converter

### en（少量，高价值）
22. ★ JSON to Excel: 3 ways to convert (online, script, manual) → json-to-excel
23. ★ Gantt chart vs timeline: which to use → gantt/timeline 对比
24. SQL EXPLAIN explained for beginners → sql-query-optimizer
25. What is a Sankey diagram (with real examples) → sankey-chart-generator

## 内容质量红线

- 不写「AI 填充的废话」——每篇有真实步骤、可复现示例、截图或数据。
- 每篇内链 2-3 个相关**保留**工具页（不得链接被抑制页）。
- 标题/描述走 TDK 校验（与本站所有页面一致）。
- 一篇文章只聚焦一个意图，不贪多。

## 执行节奏

- 第 1 批（下周）：es 3 篇 + de 2 篇 + ru 2 篇 + ja 2 篇（9 篇，都是 ★）
- 第 2 批（第 3 周）：剩余 16 篇
- 每篇上线后 2 周，GSC 观察是否出现印象（信息型词在 Bing 可能更快见效）

---

# 第三批选题：内容集群（Topical Clusters）

> 定位：不再是散点长尾，而是**集群化**——围绕有 GSC 展示信号的工具形成主题权威
> （图表 / Excel 转换 / 文本语法 / 生成器写作 / 开发者 / 计算器），篇与篇互相链接，
> 并回链到保留工具页。所有关联工具已验证保留（可索引）。
> 数据基础：2026-07-13 checkpoint，charts 集群 41 个有展示工具（最强需求信号）。

## 集群 A · 图表类型深潜（charts，需求最强）

| 语言 | 选题 | 类型 | 关联工具（保留） | 优先级 |
|---|---|---|---|---|
| es | Cómo crear un diagrama de árbol jerárquico | how-to | tree-chart-generator | ★★★ |
| es | Qué es un gráfico de dispersión y cuándo usarlo | guide | graph-chart-generator | ★★★ |
| es | Cómo elegir el tipo de gráfico correcto (guía completa) | guide | graph-chart-generator | ★★ |
| de | Sunburst-Diagramm verstehen und erstellen | guide | sunburst-chart-generator | ★★ |
| de | Baumdiagramm online erstellen | how-to | tree-chart-generator | ★★ |
| ru | Круговые диаграммы: когда использовать | guide | pie-chart-generator | ★★ |
| ru | Ящичковые диаграммы для анализа данных | guide | boxplot-chart-generator | ★★ |
| en | Nested pie charts explained | guide | nested-pie-chart-generator | ★★ |
| en | Sankey diagrams for conversion tracking | guide | sankey-chart-generator | ★★ |

## 集群 B · Excel 与数据转换（office/converters）

| 语言 | 选题 | 类型 | 关联工具 | 优先级 |
|---|---|---|---|---|
| es | Cómo convertir CSV a vCard | how-to | csv-to-vcard-converter | ★★ |
| de | CSV zu vCard konvertieren | how-to | csv-to-vcard-converter | ★★ |
| ru | Как открыть файл vCard | how-to | vcard-parser | ★★ |
| en | How to open iCal files | how-to | ical-parser | ★★ |
| en | CSV to vCard for your contacts | how-to | csv-to-vcard-converter | ★★ |

## 集群 C · 文本与语法（text，ru 需求强）

| 语言 | 选题 | 类型 | 关联工具 | 优先级 |
|---|---|---|---|---|
| ru | Как улучшить текст: проверка грамматики онлайн | guide | grammar-checker | ★★★ |
| es | Cómo corregir la gramática del inglés | how-to | grammar-checker | ★★ |
| ja | 英文法チェックの基本 | how-to | grammar-checker | ★★ |
| en | How to capitalize titles correctly | guide | title-capitalization-tool | ★★ |

## 集群 D · 生成器与写作（generators）

| 语言 | 选题 | 类型 | 关联工具 | 优先级 |
|---|---|---|---|---|
| es | Cómo escribir títulos SEO | how-to | seo-title-generator | ★★ |
| de | YouTube-Beschreibungen schreiben | how-to | youtube-description-generator | ★★ |
| ja | YouTube概要欄の書き方 | how-to | youtube-description-generator | ★★ |
| en | How to write a table of contents | how-to | table-of-contents-generator | ★★ |

## 集群 E · 开发者与 AI（development）

| 语言 | 选题 | 类型 | 关联工具 | 优先级 |
|---|---|---|---|---|
| ja | llms.txt の書き方と活用法 | guide | llms-txt-generator | ★★ |
| en | SQL index basics: when to add an index | guide | sql-query-optimizer | ★★ |

## 集群 F · 计算器（finance/math）

| 语言 | 选题 | 类型 | 关联工具 | 优先级 |
|---|---|---|---|---|
| es | Cómo calcular el precio por unidad | how-to | unit-price-calculator | ★★ |
| ja | 株式利益の計算方法 | how-to | stock-profit-calculator | ★★ |

## 执行说明

1. **先做 ★★★（4 篇）**：es tree + es scatter + ru grammar + 任一集群 A；验证展示后再批量。
2. 每篇内链 2-3 个**同集群**保留工具 + 1-2 个同语言其他集群工具，形成集群互链（guides.test.ts 自动校验 related 可索引）。
3. 集群页（可选）：当某集群 ≥4 篇时，可做「图表指南总览」类 hub 页回链各篇（第三批后评估）。
4. 节奏：每周 5-6 篇精做（同前两批质量红线：真实步骤、TDK 合规、不链被抑制页）。
