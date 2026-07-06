# GSC P2 ZH Tool Copy Batch 6 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up six additional Chinese tool pages whose metadata and support copy overclaim professional engines, exports, algorithms, or unsupported controls.

**Architecture:** Locale-copy-only remediation. Edits stay in Chinese root/base metadata and split support JSON; Svelte components and helper code remain unchanged. Because `zh.json` has duplicate historical tool keys, verification must parse effective metadata and also scan textual duplicates for stale risky phrases.

**Tech Stack:** Svelte component audit, `src/messages/zh*.json`, split tool support JSON, npm SEO governance scripts, markdown worklog.

## Global Constraints

- Do not touch GSC request-indexing ledgers or URL Inspection data.
- Do not change tool behavior, Svelte components, helper functions, routing, schema, or tests.
- Keep copy grounded in visible UI controls and current helper behavior.
- Use small patches and preserve existing locale structure.
- Run targeted parity/overclaim scan, `git diff --check`, `npm run validate:gsc-loss-metadata`, and `npm run qa:seo-governance` before committing.

---

### Task 1: Confirm Scope

**Files:**
- Create: `docs/superpowers/plans/2026-07-06-gsc-p2-zh-tool-copy-batch-6.md`

**Interfaces:**
- Consumes: Clean git status, component reads, current zh metadata parse.
- Produces: Batch 6 checklist for six Chinese pages.

- [x] **Step 1: Confirm clean workspace**

Run: `git status --short --branch`

Expected: `## main...origin/main`.

- [x] **Step 2: Read component capabilities**

Read:

```bash
sed -n '1,260p' src/components/tools/BaseCalculator.svelte
sed -n '1,280p' src/components/tools/AspectRatioCalculatorEnhanced.svelte
sed -n '1,260p' src/components/tools/AudioToBase64.svelte
sed -n '1,260p' src/components/tools/ColorShadesGenerator.svelte
sed -n '1,260p' src/components/tools/ColorNameFinder.svelte
sed -n '1,280p' src/components/tools/CssClipPathGenerator.svelte
```

- [x] **Step 3: Parse current effective metadata**

Parse `src/messages/zh.json` and `src/messages/zh/base.json` for `base-calculator`, `aspect-ratio-calculator-enhanced`, `audio-to-base64`, `color-shades-generator`, `color-name-finder`, and `css-clip-path-generator`.

### Task 2: Update Chinese Root/Base Metadata

**Files:**
- Modify: `src/messages/zh.json`
- Modify: `src/messages/zh/base.json`

**Interfaces:**
- Consumes: Effective metadata and duplicate key locations.
- Produces: Root/base parity and shorter capability-accurate SEO descriptions.

- [x] **Step 1: Patch effective metadata**

Use these effective values:

```text
base-calculator
description: 在二进制、八进制、十进制和十六进制中计算两个数。
seo_description: 基数计算器支持二进制、八进制、十进制和十六进制，输入两个数执行加减乘除或 AND/OR/XOR 按位运算。

aspect-ratio-calculator-enhanced
description: 输入宽度和高度，计算比例并按预设或锁定比例调整尺寸。
seo_description: 输入宽高计算尺寸比例，锁定比例并套用 16:9、4:3、1:1、3:2 预设，辅助裁剪前尺寸和分辨率换算。

audio-to-base64
description: 上传或拖放音频文件，生成 Base64 或 Data URI 输出。
seo_description: 选择 MP3、WAV、OGG 等音频文件，预览文件信息和播放器，切换数据 URI 前缀，复制 Base64 输出。

color-shades-generator
description: 从一个基础颜色生成 5-15 个明暗色阶并复制 CSS 变量。
seo_description: 选择基础颜色和色阶数量，预览生成的 HEX 色阶，点击单色复制或复制全部 CSS 变量。

color-name-finder
description: 输入 HEX 颜色，查找最接近的命名颜色候选。
seo_description: 颜色名称查找器根据十六进制颜色值查找最接近的 5 个颜色名称、HEX 值和距离，并显示色块预览。

css-clip-path-generator
description: 选择预设或编辑 clip-path 值，预览形状并复制 CSS。
seo_description: 使用预设形状或手写 clip-path，实时预览裁剪效果，复制 clip-path CSS 代码。
```

- [x] **Step 2: Sync duplicate textual metadata where present**

If `zh.json` contains older duplicate entries for the scoped tools, update stale duplicate SEO descriptions to match effective text or remove risky phrases, without changing unrelated fields.

### Task 3: Rewrite Split Support Copy

**Files:**
- Modify: `src/messages/zh/tools/base-calculator.json`
- Modify: `src/messages/zh/tools/aspect-ratio-calculator-enhanced.json`
- Modify: `src/messages/zh/tools/audio-to-base64.json`
- Modify: `src/messages/zh/tools/color-shades-generator.json`
- Modify: `src/messages/zh/tools/color-name-finder.json`
- Modify: `src/messages/zh/tools/css-clip-path-generator.json`

**Interfaces:**
- Consumes: Component and helper capability audit.
- Produces: Accurate detailed descriptions, steps, examples, and FAQs.

- [x] **Step 1: Base Calculator support**

Describe base selector 2/8/10/16, two inputs, operations `+`, `-`, `×`, `÷`, `AND`, `OR`, `XOR`, calculate button, error, and result shown in binary/octal/decimal/hex. Avoid 2-36 bases, floating precision, import/export, Base58, and cryptography claims.

- [x] **Step 2: Aspect Ratio support**

Describe width/height inputs, simplified ratio display, lock/unlock current ratio, presets 16:9/4:3/1:1/3:2, auto dimension adjustment. Avoid JSON export, unit selection, PAR, 4K compatibility analysis, and video workflow claims.

- [x] **Step 3: Audio to Base64 support**

Describe file input/drag-drop, audio MIME check, file name/size/MIME display, audio preview, Data URI checkbox, output textarea, copy, clear, and supported formats list. Avoid manual MIME override, download, byte process view, RFC explanation, and JSON/XML payload claims.

- [x] **Step 4: Color Shades support**

Describe color input, text hex input, shade count 5-15, generated HEX swatches, click single swatch to copy, copy all CSS variables, and output preview. Avoid CIELAB, WCAG checking, CSV/SCSS export, print workflows, and exact perceptual claims.

- [x] **Step 5: Color Name Finder support**

Describe color picker, HEX input, find button, closest colors list with name, HEX, distance, and swatch. Avoid RGB/HSL input, CSS4 standard guarantees, Lab/CIE formulas, export, and forensic/print claims.

- [x] **Step 6: CSS Clip Path support**

Describe presets, manual clip-path textarea, preview, output block, copy button, and syntax reference. Avoid drag handles, SVG path nodes, browser-prefix export, path modes, batch generation, and pixel/percentage coordinate systems.

### Task 4: Validate And Record Evidence

**Files:**
- Create: `docs/GSC_P2_ZH_TOOL_COPY_BATCH_6_WORKLOG_2026-07-06.md`

**Interfaces:**
- Consumes: Edited locale and split files.
- Produces: Worklog with exact validation evidence.

- [x] **Step 1: Run targeted metadata parity and overclaim scan**

Use Node to parse root/base effective values for the six slugs and scan split files plus `zh.json` textual duplicates for removed risky phrases.

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
- Stage all files changed in Tasks 1-4.

**Interfaces:**
- Consumes: Passing verification.
- Produces: Pushed commit on `main`.

- [x] **Step 1: Review diff**

Run: `git diff --stat` and inspect representative diffs.

- [x] **Step 2: Stage files**

Run: `git add <changed files>`.

- [x] **Step 3: Commit**

Run: `git commit -m "Clean up P2 Chinese utility copy"`.

- [x] **Step 4: Push**

Run: `git push`.
