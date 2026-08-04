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
