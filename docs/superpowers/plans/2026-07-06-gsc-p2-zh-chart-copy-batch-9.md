# GSC P2 ZH Chart Copy Batch 9 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up six Chinese P2 chart pages whose metadata or support copy still overclaims batch generation, file workflows, 3D/WebGL rendering, advanced engines, or unsupported exports.

**Architecture:** Locale-copy-only remediation. Update Chinese root/base metadata and split support JSON to match existing Svelte chart components. Do not change components, helpers, routes, tests, or GSC execution ledgers.

**Tech Stack:** Svelte component audit, `src/messages/zh*.json`, split chart support JSON, npm SEO governance scripts, markdown worklog.

## Global Constraints

- Do not touch GSC request-indexing ledgers, URL Inspection submission data, or daily execution status docs.
- Do not change Svelte components, helper functions, routes, schemas, or tests.
- Keep copy grounded in visible UI controls and current ECharts behavior.
- Avoid unsupported claims: batch generation, file upload except Nightingale CSV, Excel import, WebGL, 3D viewpoint controls, drag editing, JSON export, automatic layout optimization, one-click high-definition export, guaranteed privacy/security, or professional diagnosis.
- Stage only files changed by this batch; leave unrelated dirty docs untouched.
- Run targeted parity/overclaim scan, `git diff --check`, `npm run validate:gsc-loss-metadata`, and `npm run qa:seo-governance` before committing.

---

### Task 1: Confirm Scope

**Files:**
- Create: `docs/superpowers/plans/2026-07-06-gsc-p2-zh-chart-copy-batch-9.md`

**Interfaces:**
- Consumes: git status, component reads, current zh metadata parse.
- Produces: Batch 9 checklist for six Chinese chart pages.

- [x] **Step 1: Confirm workspace boundary**

Run: `git status --short --branch`

Expected: `main...origin/main`, with only pre-existing unrelated docs dirty.

- [x] **Step 2: Read component capabilities**

Read:

```bash
sed -n '1,260p' src/components/tools/AreaChartGenerator.svelte
sed -n '1,280p' src/components/tools/BubbleChartGenerator.svelte
sed -n '1,300p' src/components/tools/SankeyChartGenerator.svelte
sed -n '1,520p' src/components/tools/NightingaleRoseChartGenerator.svelte
sed -n '1,320p' src/components/tools/TreeChartGenerator.svelte
sed -n '1,620p' src/components/tools/TreemapChartGenerator.svelte
```

- [x] **Step 3: Parse current effective metadata**

Parse `src/messages/zh.json` and `src/messages/zh/base.json` for `area-chart-generator`, `bubble-chart-generator`, `sankey-chart-generator`, `nightingale-rose-chart-generator`, `tree-chart-generator`, and `treemap-chart-generator`.

### Task 2: Update Chinese Root/Base Metadata

**Files:**
- Modify: `src/messages/zh.json`
- Modify: `src/messages/zh/base.json`

**Interfaces:**
- Consumes: effective metadata and component audit.
- Produces: root/base parity and capability-accurate SEO descriptions.

- [x] **Step 1: Patch effective metadata**

Use these values:

```text
area-chart-generator
description: 编辑分类和系列数据，生成面积图并下载 PNG 或 SVG。
seo_description: 区域图生成器可编辑分类、系列和值，生成展示累计数据和时间序列的面积图，并导出 PNG 或 SVG。

bubble-chart-generator
description: 编辑 X、Y 和气泡大小数据，生成二维气泡图并下载 PNG 或 SVG。
seo_description: 气泡图生成器可编辑系列、点名称、X 值、Y 值和气泡大小，用二维图表表示三维数据，并导出 PNG 或 SVG。

sankey-chart-generator
description: 编辑节点和流向数据，生成桑基图并下载 PNG 或 SVG。
seo_description: 桑基图生成器可编辑节点、来源、目标和值，制作流向图和转化路径图，并导出 PNG 或 SVG。

nightingale-rose-chart-generator
description: 编辑分类和值，生成夜莺玫瑰图并下载 PNG 或 SVG。
seo_description: 夜莺玫瑰图生成器可手动编辑分类和值，选择半径或面积模式，切换标签和图例，并支持 CSV 文本导入。

tree-chart-generator
description: 编辑节点、父节点和值，生成树状图并下载 PNG 或 SVG。
seo_description: 树状图生成器可编辑层级节点、父节点和值，用于组织架构和层级关系展示，并导出 PNG 或 SVG。

treemap-chart-generator
description: 编辑层级节点和值，生成矩形树图并下载 PNG 或 SVG。
seo_description: 矩形树图生成器可编辑分层数据和值，用矩形面积展示占比和业务构成，并导出 PNG 或 SVG。
```

- [x] **Step 2: Sync duplicate metadata where present**

If root/base contain duplicate entries for the six slugs, update stale duplicate `description` and `seo_description` values without changing unrelated fields.

### Task 3: Rewrite Split Support Copy

**Files:**
- Modify: `src/messages/zh/tools/area-chart-generator.json`
- Modify: `src/messages/zh/tools/bubble-chart-generator.json`
- Modify: `src/messages/zh/tools/sankey-chart-generator.json`
- Modify: `src/messages/zh/tools/nightingale-rose-chart-generator.json`
- Modify: `src/messages/zh/tools/tree-chart-generator.json`
- Modify: `src/messages/zh/tools/treemap-chart-generator.json`

**Interfaces:**
- Consumes: component behavior audit.
- Produces: accurate detailed descriptions, steps, examples, and FAQs.

- [x] **Step 1: Area chart support**

Describe categories, series rows, title, theme, legend, grid, smooth, stacked, fill opacity, sample data, clear, preview, PNG/SVG. Avoid file import and batch claims.

- [x] **Step 2: Bubble chart support**

Describe series, point name, X/Y/size values, axis names, theme, legend, clear, preview, PNG/SVG. Avoid 3D, upload, Excel, drag viewpoint, and multi-format export beyond PNG/SVG.

- [x] **Step 3: Sankey support**

Describe nodes, links, source/target/value, title, theme, horizontal/vertical orientation, node width/gap, sample data, clear, preview, PNG/SVG. Avoid batch and automatic optimization claims.

- [x] **Step 4: Nightingale support**

Describe category/value rows, title, theme, rose type, labels, legend, CSV or text import, sample data, clear, preview, PNG/SVG. Avoid embed, Excel, automatic area calculations beyond ECharts rendering, and non-existent export formats.

- [x] **Step 5: Tree chart support**

Describe node table, parent selection, values, orthogonal/radial layout, orientation, theme, cascade delete, clear, preview, PNG/SVG. Avoid WebGL, JSON Schema, drag editing, JSON export, and huge-node claims.

- [x] **Step 6: Treemap support**

Describe nested node editor, child add/delete, values, percentages, title, theme, labels, breadcrumb, leaf depth, sample data, clear, preview, PNG/SVG. Avoid file import, layout algorithms beyond visible controls, and high-definition/large dataset claims.

### Task 4: Validate And Record Evidence

**Files:**
- Create: `docs/GSC_P2_ZH_CHART_COPY_BATCH_9_WORKLOG_2026-07-06.md`

**Interfaces:**
- Consumes: edited locale and split files.
- Produces: worklog with exact validation evidence.

- [x] **Step 1: Run targeted metadata parity and overclaim scan**

Use Node to parse root/base effective values for the six slugs and scan scoped split files for removed risky phrases.

- [x] **Step 2: Run whitespace check**

Run: `git diff --check`

- [x] **Step 3: Run metadata validator**

Run: `npm run validate:gsc-loss-metadata`

- [x] **Step 4: Run SEO governance QA**

Run: `npm run qa:seo-governance`

- [x] **Step 5: Write worklog**

Record scoped pages, no GSC ledger changes, TDK warning count, and test totals.

### Task 5: Commit And Push

**Files:**
- Stage only files changed in Tasks 1-4.

**Interfaces:**
- Consumes: passing verification.
- Produces: pushed commit on `main`.

- [x] **Step 1: Review diff**

Run: `git diff --stat` and inspect representative diffs.

- [x] **Step 2: Stage files**

Run: `git add <batch 9 files>`.

- [x] **Step 3: Commit**

Run: `git commit -m "Clean up P2 Chinese chart copy"`.

- [x] **Step 4: Push**

Run: `git push`.
