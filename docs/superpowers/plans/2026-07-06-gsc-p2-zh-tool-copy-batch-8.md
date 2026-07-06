# GSC P2 ZH Tool Copy Batch 8 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up six Chinese P2 tool pages whose SEO metadata or support copy still overclaims crawling, batch workflows, professional engines, or unsupported export controls.

**Architecture:** Locale-copy-only remediation. Update Chinese root/base metadata and split support JSON to reflect existing Svelte component behavior. Do not change components, helpers, routes, tests, or GSC execution ledgers.

**Tech Stack:** Svelte component audit, `src/messages/zh*.json`, split tool support JSON, npm SEO governance scripts, markdown worklog.

## Global Constraints

- Do not touch GSC request-indexing ledgers, URL Inspection submission data, or daily execution status docs.
- Do not change Svelte components, helper functions, routes, schemas, or tests.
- Keep copy grounded in visible UI controls and current helper behavior.
- Preserve priority SEO keywords for `base85`, `color-converter`, `password-strength`, `meta-tag-generator`, and `sitemap-generator`.
- Stage only files changed by this batch; leave unrelated dirty docs untouched.
- Run targeted parity/overclaim scan, `git diff --check`, `npm run validate:gsc-loss-metadata`, and `npm run qa:seo-governance` before committing.

---

### Task 1: Confirm Scope

**Files:**
- Create: `docs/superpowers/plans/2026-07-06-gsc-p2-zh-tool-copy-batch-8.md`

**Interfaces:**
- Consumes: git status, component reads, current zh metadata parse.
- Produces: Batch 8 checklist for six Chinese pages.

- [x] **Step 1: Confirm workspace boundary**

Run: `git status --short --branch`

Expected: `main...origin/main`, with only pre-existing unrelated docs dirty.

- [x] **Step 2: Read component capabilities**

Read:

```bash
sed -n '1,280p' src/components/tools/MetaTagGenerator.svelte
sed -n '1,280p' src/components/tools/ColorConverter.svelte
sed -n '1,320p' src/components/tools/PolarBarChartGenerator.svelte
sed -n '1,260p' src/components/tools/PasswordStrength.svelte
sed -n '1,300p' src/components/tools/Base85.svelte
sed -n '1,320p' src/components/tools/SitemapGenerator.svelte
```

- [x] **Step 3: Parse current effective metadata**

Parse `src/messages/zh.json` and `src/messages/zh/base.json` for `meta-tag-generator`, `color-converter`, `polar-bar-chart-generator`, `password-strength`, `base85`, and `sitemap-generator`.

### Task 2: Update Chinese Root/Base Metadata

**Files:**
- Modify: `src/messages/zh.json`
- Modify: `src/messages/zh/base.json`

**Interfaces:**
- Consumes: effective metadata and priority keyword list.
- Produces: root/base parity and capability-accurate SEO descriptions.

- [x] **Step 1: Patch effective metadata**

Use these values:

```text
meta-tag-generator
description: 填写页面标题、描述和分享字段，生成可复制的 meta 标签。
seo_description: 元标签生成器可填写页面标题、描述和社交分享字段，生成 SEO 与分享标签代码。

color-converter
description: 在 HEX、RGB 和 HSL 之间转换颜色并复制结果。
seo_description: 颜色转换器支持 HEX、RGB、HSL 互转，使用颜色选择器或数值输入更新颜色并复制结果。

polar-bar-chart-generator
description: 编辑分类和值，生成极坐标柱状图并下载 PNG 或 SVG。
seo_description: 极坐标柱状图生成器可编辑分类和值，设置标题、主题、内半径和图例，并导出 PNG 或 SVG。

password-strength
description: 根据长度、字符类型和常见模式检查密码强度。
seo_description: 密码强度检测器根据密码复杂度、常见模式和字符组合提示破解风险与密码优化建议。

base85
description: 输入文本并进行 Base85 编码或解码，复制输出结果。
seo_description: Base85 编码解码器可在浏览器中转换文本和二进制字符数据，支持编码、解码和复制结果。

sitemap-generator
description: 手动添加 URL 条目，生成 XML 网站地图并复制或下载。
seo_description: 网站地图生成器可手动维护 URL、更新时间、更新频率和优先级，生成 XML 网站地图，辅助抓取入口整理并下载。
```

- [x] **Step 2: Sync duplicate metadata where present**

If root/base contain earlier duplicate entries for the six slugs, update stale duplicate `description` and `seo_description` values or remove scoped risky phrases without changing unrelated fields.

### Task 3: Rewrite Split Support Copy

**Files:**
- Modify: `src/messages/zh/tools/meta-tag-generator.json`
- Modify: `src/messages/zh/tools/color-converter.json`
- Modify: `src/messages/zh/tools/polar-bar-chart-generator.json`
- Modify: `src/messages/zh/tools/password-strength.json`
- Modify: `src/messages/zh/tools/base85.json`
- Modify: `src/messages/zh/tools/sitemap-generator.json`

**Interfaces:**
- Consumes: component behavior audit.
- Produces: accurate detailed descriptions, steps, examples, and FAQs.

- [x] **Step 1: Meta Tag support**

Describe page title, description, keywords, author, Open Graph image/page URL, Twitter card type/site, robots, viewport, generated code block, escaping, and copy. Avoid validation, social preview, schema markup, existing-page parsing, CSV import/export, and batch generation.

- [x] **Step 2: Color Converter support**

Describe color preview, color picker, HEX input, RGB numeric inputs, HSL display, and copy buttons. Avoid CIE/XYZ, gamma correction, alpha/ARGB, batch queues, design-system migration, accessibility analysis, and CSS variable export.

- [x] **Step 3: Polar Bar Chart support**

Describe editable chart title, theme select, inner radius slider, legend/round cap/stack toggles, editable category/value rows, sample data, clear, preview, and PNG/SVG export. Avoid file upload, CSV/TSV parsing, WebGL, path optimization, advanced polar-axis settings, draggable rotation, and multi-series claims.

- [x] **Step 4: Password Strength support**

Describe password input, show/hide toggle, score from length and character classes, common-password penalty, repeated/sequential penalty, strength bar, character type indicators, and suggestions. Avoid entropy, standards compliance, breach databases, hash collision estimates, professional mode, JSON report export, and account auditing.

- [x] **Step 5: Base85 support**

Describe encode/decode mode buttons, input/output textareas, TextEncoder/TextDecoder behavior, Base85 character set conversion, error output for invalid characters, process and copy buttons. Avoid Adobe/PDF/PostScript compatibility, RFC claims, binary file handling, end markers, SMTP workflows, and protocol validation.

- [x] **Step 6: Sitemap support**

Describe base URL input, editable rows for path/date/changefreq/priority, add/remove URL rows, XML generation, XML escaping, copy, and download. Avoid site crawling, automatic scanning, search-engine submission, ranking claims, bulk generation, and server upload.

### Task 4: Validate And Record Evidence

**Files:**
- Create: `docs/GSC_P2_ZH_TOOL_COPY_BATCH_8_WORKLOG_2026-07-06.md`

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

Run: `git add <batch 8 files>`.

- [x] **Step 3: Commit**

Run: `git commit -m "Clean up P2 Chinese SEO utility copy"`.

- [x] **Step 4: Push**

Run: `git push`.
