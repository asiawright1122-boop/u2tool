# GSC P2 ZH Template Cleanup Batch 5 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tighten six Chinese P2 tool pages whose support copy and metadata overstate implementation details or unsupported UI features.

**Architecture:** This is a locale-copy-only cleanup. Edits stay in `src/messages/zh*.json` and split Chinese tool files; Svelte components and tool behavior remain unchanged. Root/base locale files contain duplicate historical keys, so verification must parse effective JSON values.

**Tech Stack:** Svelte component capability audit, JSON locale files under `src/messages`, npm SEO governance scripts, markdown worklog under `docs/`.

## Global Constraints

- Do not touch GSC request-indexing ledgers or URL Inspection data.
- Do not change Svelte components, tool stubs, routing, schema, or UI behavior.
- Use small JSON patches; do not rewrite root/base locale files wholesale.
- Copy must describe only observed UI behavior and helper capabilities.
- Run targeted JSON parity/overclaim checks, metadata validation, and SEO governance QA before commit.

---

### Task 1: Confirm Scope And Write Plan

**Files:**
- Create: `docs/superpowers/plans/2026-07-06-gsc-p2-zh-template-cleanup-batch-5.md`

**Interfaces:**
- Consumes: Batch 4 worklog, clean git status, component capability reads.
- Produces: Six-page Chinese cleanup checklist.

- [x] **Step 1: Confirm clean workspace**

Run: `git status --short --branch`

Expected: branch line only.

- [x] **Step 2: Confirm component capabilities**

Read:

```bash
sed -n '1,260p' src/components/tools/MarkdownPreview.svelte
sed -n '1,260p' src/components/tools/OctalConverter.svelte
sed -n '1,300p' src/components/tools/PdfRotator.svelte
sed -n '1,260p' src/components/tools/SqlToMongo.svelte
sed -n '1,280p' src/components/tools/UrlParser.svelte
sed -n '1,300p' src/components/tools/UnitConverter.svelte
```

Expected: actual UI controls and outputs are known before copy changes.

- [x] **Step 3: Parse effective root/base metadata**

Run a Node script for `markdown-preview`, `octal-converter`, `pdf-rotator`, `sql-to-mongo`, `url-parser`, and `unit-converter` in `src/messages/zh.json` and `src/messages/zh/base.json`.

Expected: current effective metadata is visible and root/base parity can be checked after edits.

### Task 2: Update Chinese Root/Base Metadata

**Files:**
- Modify: `src/messages/zh.json`
- Modify: `src/messages/zh/base.json`

**Interfaces:**
- Consumes: Effective metadata for six scoped slugs.
- Produces: Accurate, shorter metadata with root/base parity.

- [x] **Step 1: Patch effective metadata**

Set root/base effective metadata to:

```text
markdown-preview
description: 编写 Markdown 并预览渲染结果，可复制生成的 HTML。
seo_description: 在左右分栏中输入 Markdown，实时查看预览，复制清理后的 HTML，并可一键清空内容。

octal-converter
description: 在八进制、十进制、二进制和十六进制之间转换整数。
seo_description: 选择八进制、十进制、二进制或十六进制转换模式，输入整数，查看结果并复制输出。

pdf-rotator
description: 上传 PDF，预览页面缩略图，并按页或批量旋转后保存。
seo_description: 上传 PDF，预览每页缩略图，单页或全部旋转 90°、180°、270°，然后下载旋转后的文件。

sql-to-mongo
description: 将常见 SQL SELECT、INSERT、UPDATE、DELETE 语句转换为 MongoDB 查询。
seo_description: 粘贴常见 SQL 语句，转换为 MongoDB find、insert、update 或 delete 查询，支持示例与复制输出。

url-parser
description: 解析 URL 的协议、主机、端口、路径、查询参数和锚点。
seo_description: 输入 URL，查看协议、主机、端口、路径、查询字符串、锚点、origin 和查询参数，并逐项复制。

unit-converter
description: 转换长度、重量、温度、面积、体积、速度和数据单位。
seo_description: 选择单位类别、源单位和目标单位，输入数值后查看换算结果，支持交换单位和复制结果。
```

- [x] **Step 2: Preserve UI labels**

Do not change existing control labels unless they are part of the scoped metadata fields.

### Task 3: Rewrite Split Support Copy

**Files:**
- Modify: `src/messages/zh/tools/markdown-preview.json`
- Modify: `src/messages/zh/tools/octal-converter.json`
- Modify: `src/messages/zh/tools/pdf-rotator.json`
- Modify: `src/messages/zh/tools/sql-to-mongo.json`
- Modify: `src/messages/zh/tools/url-parser.json`
- Modify: `src/messages/zh/tools/unit-converter.json`

**Interfaces:**
- Consumes: Component capability audit and helper function scope.
- Produces: Accurate Chinese detailed descriptions, usage steps, examples, and FAQs.

- [x] **Step 1: Markdown Preview split copy**

Describe textarea input, sanitized preview, HTML copy button, and clear button. Avoid claims about mode switching, line-level copy, export files, synchronized scrolling, Web Workers, or code highlighting options.

- [x] **Step 2: Octal Converter split copy**

Describe the six modes: octal to decimal, decimal to octal, octal to binary, binary to octal, octal to hex, hex to octal; sample loading, validation errors, convert, copy. Avoid negative decimals, fractions, formulas, broad base conversion, Web Workers, or 1024-bit promises.

- [x] **Step 3: PDF Rotator split copy**

Describe PDF upload, thumbnail preview, per-page left/right 90-degree rotation, rotate-all 90/180/270, reset, and save as `_rotated.pdf`. Avoid PDFBox, regex page ranges, shift multi-select, smart reflow, annotations/bookmarks promises, or arbitrary rotation points.

- [x] **Step 4: SQL to Mongo split copy**

Describe common SELECT/INSERT/UPDATE/DELETE conversions, examples, clear, output, and copy. Avoid JOIN, subqueries, window functions, schema upload, field mapping, aggregation migration, or downloads.

- [x] **Step 5: URL Parser split copy**

Describe JavaScript URL parsing into protocol, hostname, port/default port, pathname, search, hash, origin, query params, invalid URL message, and copy per value. Avoid export JSON, advanced tabs, RFC/state-machine/AST claims, decoding options, or security audit promises.

- [x] **Step 6: Unit Converter split copy**

Describe categories length, weight, temperature, area, volume, speed, and data; numeric input, unit selects, swap, result, copy, and quick reference. Avoid 57 categories, expression parsing, WebAssembly, formulas, pressure/engineering categories, or scientific notation options.

### Task 4: Validate And Worklog

**Files:**
- Create: `docs/GSC_P2_ZH_TEMPLATE_CLEANUP_BATCH_5_WORKLOG_2026-07-06.md`

**Interfaces:**
- Consumes: Edited metadata and split support.
- Produces: Evidence record for the batch.

- [x] **Step 1: Run targeted metadata parity and overclaim scan**

Run a Node script that parses root/base effective values for the six scoped slugs and scans split files for removed unsupported claims.

- [x] **Step 2: Run whitespace check**

Run: `git diff --check`

Expected: exit 0.

- [x] **Step 3: Run metadata validator**

Run: `npm run validate:gsc-loss-metadata`

Expected: exit 0.

- [x] **Step 4: Run SEO governance QA**

Run: `npm run qa:seo-governance`

Expected: exit 0. Record TDK warning count and test totals.

- [x] **Step 5: Write worklog**

Create the batch worklog with scoped pages, exact validation evidence, and no-indexing-ledger note.

### Task 5: Commit And Push

**Files:**
- Stage all files changed in Tasks 1-4.

**Interfaces:**
- Consumes: Passing validation evidence.
- Produces: Pushed commit on `main`.

- [ ] **Step 1: Review diff**

Run: `git diff --stat` and inspect representative split-file diffs.

- [ ] **Step 2: Stage files**

Run: `git add <changed files>`.

- [ ] **Step 3: Commit**

Run: `git commit -m "Clean up P2 Chinese tool copy"`.

- [ ] **Step 4: Push**

Run: `git push`.
