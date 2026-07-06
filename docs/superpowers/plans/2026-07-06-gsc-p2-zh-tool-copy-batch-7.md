# GSC P2 ZH Tool Copy Batch 7 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up six more Chinese P2 tool pages whose metadata or support copy overstates algorithms, import/export, professional workflows, or unsupported controls.

**Architecture:** Locale-copy-only remediation. Edits stay in Chinese root/base metadata and split support JSON. Svelte components, helpers, routes, schemas, and tests remain unchanged. Because `zh.json` and `zh/base.json` contain duplicate historical tool keys, verification must parse effective metadata and scan the scoped split files for stale risky phrases.

**Tech Stack:** Svelte component audit, `src/messages/zh*.json`, split tool support JSON, npm SEO governance scripts, markdown worklog.

## Global Constraints

- Do not touch GSC request-indexing ledgers, URL Inspection submission data, or daily execution status docs.
- Do not change Svelte components, helper functions, routing, schemas, or tests.
- Keep all copy grounded in visible UI controls and current helper behavior.
- Preserve priority SEO keywords for `regex-escape` and `signature-pad`.
- Stage only files changed by this batch; leave unrelated dirty docs untouched.
- Run targeted parity/overclaim scan, `git diff --check`, `npm run validate:gsc-loss-metadata`, and `npm run qa:seo-governance` before committing.

---

### Task 1: Confirm Scope

**Files:**
- Create: `docs/superpowers/plans/2026-07-06-gsc-p2-zh-tool-copy-batch-7.md`

**Interfaces:**
- Consumes: git status, component reads, current zh metadata parse.
- Produces: Batch 7 checklist for six Chinese pages.

- [x] **Step 1: Confirm workspace boundary**

Run: `git status --short --branch`

Expected: `main...origin/main`, with only pre-existing unrelated docs dirty.

- [x] **Step 2: Read component capabilities**

Read:

```bash
sed -n '1,240p' src/components/tools/HexCalculator.svelte
sed -n '430,510p' src/lib/calculator-utils.ts
sed -n '1,240p' src/components/tools/JsonToTsv.svelte
sed -n '1,280p' src/components/tools/EpochConverter.svelte
sed -n '1,260p' src/components/tools/RegexEscape.svelte
sed -n '1,260p' src/components/tools/PortScanner.svelte
sed -n '1,520p' src/components/tools/SignaturePad.svelte
```

- [x] **Step 3: Parse current effective metadata**

Parse `src/messages/zh.json` and `src/messages/zh/base.json` for `hex-calculator`, `json-to-tsv`, `epoch-converter`, `regex-escape`, `port-reference`, and `signature-pad`.

### Task 2: Update Chinese Root/Base Metadata

**Files:**
- Modify: `src/messages/zh.json`
- Modify: `src/messages/zh/base.json`

**Interfaces:**
- Consumes: effective metadata and duplicate key locations.
- Produces: root/base parity and capability-accurate SEO descriptions.

- [x] **Step 1: Patch effective metadata**

Use these values:

```text
hex-calculator
description: 输入十六进制数，执行算术或按位运算并查看多种表示。
seo_description: 十六进制计算器支持加减乘除、AND/OR/XOR/NOT，输入 HEX 操作数后查看十六进制、十进制和二进制结果。

json-to-tsv
description: 粘贴 JSON 数组，选择是否包含表头并转换为 TSV 文本。
seo_description: 将 JSON 数组转换为 TSV，按首个对象字段生成列，可选择包含表头，复制制表符分隔输出。

epoch-converter
description: 在 Epoch/Unix 时间戳和日期时间文本之间双向转换。
seo_description: 输入 Unix 时间戳转日期文本，或输入日期时间转秒级 Epoch；可使用当前时间并复制结果。

regex-escape
description: 转义或取消转义正则表达式特殊字符。
seo_description: 正则表达式转义工具可处理特殊字符、取消转义结果、加载示例并复制输出，适合规则调试。

port-reference
description: 搜索常见端口号、服务名称和端口范围说明。
seo_description: 查询常见网络端口和服务说明，按端口号或服务名搜索，并查看知名、注册和动态端口范围。

signature-pad
description: 在画布上创建手写签名，调整画笔和背景并下载 PNG 或 SVG。
seo_description: 电子签名板支持手写数字签名、合同签字和授权文件草稿，可调整画笔、撤销清除并下载 PNG 或 SVG。
```

- [x] **Step 2: Sync duplicate metadata where present**

If root/base contain earlier duplicate entries for the six slugs, update stale duplicate `description` and `seo_description` values or remove scoped risky phrases without changing unrelated fields.

### Task 3: Rewrite Split Support Copy

**Files:**
- Modify: `src/messages/zh/tools/hex-calculator.json`
- Modify: `src/messages/zh/tools/json-to-tsv.json`
- Modify: `src/messages/zh/tools/epoch-converter.json`
- Modify: `src/messages/zh/tools/regex-escape.json`
- Modify: `src/messages/zh/tools/port-reference.json`
- Modify: `src/messages/zh/tools/signature-pad.json`

**Interfaces:**
- Consumes: component and helper behavior audit.
- Produces: accurate detailed descriptions, steps, examples, and FAQs.

- [x] **Step 1: Hex Calculator support**

Describe two HEX inputs, optional second input for binary operations, operations `+`, `-`, `×`, `÷`, `AND`, `OR`, `XOR`, `NOT`, calculate button, invalid hex errors, and result shown as hexadecimal, decimal, and binary. Avoid shifts, bit widths, carry flags, CPU simulation, byte arrays, protocol debugging, and cryptography claims.

- [x] **Step 2: JSON to TSV support**

Describe JSON textarea, include headers checkbox, conversion of JSON arrays using keys from the first object, object values serialized as JSON strings, TSV output textarea, convert and copy buttons, and invalid JSON/format errors. Avoid upload, field mapping, recursive flattening, encoding selection, downloads, zip files, type inference, and database migration claims.

- [x] **Step 3: Epoch Converter support**

Describe live current epoch display, timestamp input, date text input, timestamp-to-date, date-to-epoch, use now, and copy. Mention milliseconds are accepted only by the `> 9999999999` heuristic for timestamp-to-date. Avoid timezone database, timezone dropdowns, nanoseconds, batch conversion, RFC reports, logs parsing, and blockchain validation.

- [x] **Step 4: Regex Escape support**

Describe escape/unescape mode selector, input/output textareas, convert, swap, copy, load sample, and special-character insertion buttons. Avoid syntax highlighting, regex engine compatibility guarantees, preserve whitespace option, state-machine claims, and code-editor integration.

- [x] **Step 5: Port Reference support**

Describe common ports table from built-in data, search by port/service/description, custom port lookup, unknown/invalid port message, and port range reference. Avoid live scanning, IANA sync, TCP/UDP filtering, RFC/vendor details, API access, Nmap, firewall export, and security assessment claims.

- [x] **Step 6: Signature Pad support**

Describe canvas drawing with mouse/touch, preset and custom pen colors, pen width slider, background color, transparent background, undo, clear, PNG download, and SVG download from stroke history. Avoid JPG/PDF export, direct document insertion, batch generation, legal reliability, high-resolution print guarantees, and multiple saved signature profiles.

### Task 4: Validate And Record Evidence

**Files:**
- Create: `docs/GSC_P2_ZH_TOOL_COPY_BATCH_7_WORKLOG_2026-07-06.md`

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

Run: `git add <batch 7 files>`.

- [x] **Step 3: Commit**

Run: `git commit -m "Clean up P2 Chinese developer utility copy"`.

- [x] **Step 4: Push**

Run: `git push`.
