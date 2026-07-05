# GSC P2 Template Cleanup Batch 4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tighten the next P2 localized tool pages so SEO metadata and long-form copy describe the actual browser UI without overclaiming unsupported capabilities.

**Architecture:** This is copy-only remediation across locale metadata and split tool content. Root/base locale files may contain duplicate keys, so verification must parse effective JSON values and compare root/base parity rather than relying on the first textual match.

**Tech Stack:** SvelteKit locale JSON under `src/messages`, GSC governance scripts via npm, markdown worklog under `docs/`.

## Global Constraints

- Do not touch GSC request-indexing ledgers or URL Inspection data.
- Do not change Svelte components or tool behavior in this batch.
- Preserve existing JSON structure and duplicate-key ordering; use small patches rather than whole-file rewrites.
- Copy must stay grounded in observed UI capabilities for each tool.
- Run governance validation before commit.

---

### Task 1: Ground Batch Scope And Plan

**Files:**
- Create: `docs/superpowers/plans/2026-07-05-gsc-p2-template-cleanup-batch-4.md`

**Interfaces:**
- Consumes: Existing GSC cleanup cadence and observed component capability notes.
- Produces: A batch checklist for six P2 pages.

- [x] **Step 1: Confirm clean workspace**

Run: `git status --short --branch`

Expected: branch line only, no changed files.

- [x] **Step 2: Create this plan**

Create `docs/superpowers/plans/2026-07-05-gsc-p2-template-cleanup-batch-4.md` with the batch scope and validation steps.

- [x] **Step 3: Locate duplicate locale entries**

Run:

```bash
rg -n 'sql-to-json|sunburst-chart-generator|fake-data-generator|ip-address-generator' src/messages/ko.json src/messages/ko/base.json
rg -n 'text-reverser' src/messages/de.json src/messages/de/base.json
rg -n 'random-generator' src/messages/es.json src/messages/es/base.json src/messages/es/tools/random-generator.json
```

Expected: duplicate root/base positions are visible before patching.

### Task 2: Rewrite Korean SQL/Chart/Data/IP Tool Copy

**Files:**
- Modify: `src/messages/ko.json`
- Modify: `src/messages/ko/base.json`
- Modify: `src/messages/ko/tools/sql-to-json.json`
- Modify: `src/messages/ko/tools/sunburst-chart-generator.json`
- Modify: `src/messages/ko/tools/fake-data-generator.json`
- Modify: `src/messages/ko/tools/ip-address-generator.json`

**Interfaces:**
- Consumes: Actual component capabilities for SQL-to-JSON, Sunburst Chart Generator, Fake Data Generator, and IP Address Generator.
- Produces: Accurate Korean metadata and split long-form copy.

- [x] **Step 1: Update effective metadata**

Patch the effective root/base metadata to these values:

```text
ko/tools/sql-to-json/
name: SQL을 JSON으로 변환
description: SQL INSERT 문을 JSON 배열로 변환합니다.
seo_title: SQL을 JSON으로 변환 온라인
seo_description: SQL INSERT 문을 붙여넣어 JSON 배열로 변환하고, 오류 메시지와 복사 가능한 JSON 출력을 확인하세요.

ko/tools/sunburst-chart-generator/
name: 선버스트 차트 생성기
description: 계층형 데이터를 원형 차트로 시각화합니다.
seo_title: 선버스트 차트 생성기 온라인
seo_description: 계층 JSON을 붙여넣고 제목, 테마, 라벨, 반지름을 조정해 선버스트 차트를 미리보고 PNG/SVG로 저장하세요.

ko/tools/fake-data-generator/
name: 가짜 데이터 생성기
description: 테스트용 예시 데이터를 생성합니다.
seo_title: 무료 온라인 가짜 데이터 생성기
seo_description: 필드와 로케일을 선택해 편집 가능한 테스트 데이터를 만들고 JSON, CSV 또는 SQL로 내보내세요.

ko/tools/ip-address-generator/
name: IP 주소 생성기
description: IPv4, IPv6, 사설 IPv4, 공용 IPv4 예시 주소를 생성합니다.
seo_title: 무료 온라인 IP 주소 생성기
seo_description: IPv4, IPv6, 사설 IPv4, 공용 IPv4 주소를 1-100개 생성하고 개별 주소나 전체 목록을 복사하세요.
```

- [x] **Step 2: Replace split tool JSON copy**

Rewrite split JSON files so detailed descriptions, steps, examples, and FAQs mention only supported UI behavior: paste/type input, JSON preview, copy, PNG/SVG where present, JSON/CSV/SQL export where present, and count/type controls where present.

- [x] **Step 3: Avoid unsupported claims**

Verify the edited Korean copy no longer claims AST parsing, CSV upload, field mapping, CSPRNG guarantees, CIDR support, profile photos, payment/order data, advanced rules, network simulation, or 4K export.

### Task 3: Rewrite German Text Reverser Copy

**Files:**
- Modify: `src/messages/de.json`
- Modify: `src/messages/de/base.json`
- Modify: `src/messages/de/tools/text-reverser.json`

**Interfaces:**
- Consumes: Actual Text Reverser component modes: characters, words, lines, copy output.
- Produces: Accurate German metadata and split copy.

- [x] **Step 1: Update effective metadata**

Patch effective root/base metadata to:

```text
de/tools/text-reverser/
name: Textumkehrer
description: Kehren Sie Zeichen, Wörter oder Zeilen in einem Text um.
seo_title: Textumkehrer online kostenlos
seo_description: Fügen Sie Text ein, kehren Sie Zeichen, Wörter oder Zeilen um und kopieren Sie die Ausgabe direkt im Browser.
```

- [x] **Step 2: Replace split tool JSON copy**

Rewrite split content around the three modes and copy output only.

- [x] **Step 3: Avoid unsupported claims**

Verify German copy no longer claims file upload, downloads, Web Workers, UTF normalization, delimiter configuration, or JSON/XML debugging.

### Task 4: Verify Spanish Random Generator Is Already Aligned

**Files:**
- Inspect only: `src/messages/es.json`
- Inspect only: `src/messages/es/base.json`
- Inspect only: `src/messages/es/tools/random-generator.json`

**Interfaces:**
- Consumes: Actual Random Generator component: min/max/count, max 1000, unique option, copy.
- Produces: Worklog note if no edit is needed.

- [x] **Step 1: Parse effective Spanish metadata**

Confirm effective name, description, title, and description already mention the actual integer range generator behavior.

- [x] **Step 2: Inspect split copy**

Confirm long-form copy describes range/count/unique/copy behavior and does not overclaim exports or crypto randomness.

### Task 5: Validate Governance And Record Evidence

**Files:**
- Create: `docs/GSC_P2_TEMPLATE_CLEANUP_BATCH_4_WORKLOG_2026-07-05.md`

**Interfaces:**
- Consumes: Edited locale JSON and governance command output.
- Produces: Validation evidence and batch worklog.

- [x] **Step 1: Run targeted parse and parity check**

Run a Node script that parses effective metadata for the six scoped URLs and compares root/base parity for locale metadata.

- [x] **Step 2: Run whitespace diff check**

Run: `git diff --check`

Expected: exit 0.

- [x] **Step 3: Run metadata validator**

Run: `npm run validate:gsc-loss-metadata`

Expected: exit 0.

- [x] **Step 4: Run SEO governance QA**

Run: `npm run qa:seo-governance`

Expected: exit 0. Record the final TDK warning count.

- [x] **Step 5: Write worklog**

Create `docs/GSC_P2_TEMPLATE_CLEANUP_BATCH_4_WORKLOG_2026-07-05.md` with scoped URLs, edits, skipped Spanish page rationale, and validation evidence.

### Task 6: Commit And Push

**Files:**
- Stage all files changed in Tasks 1-5.

**Interfaces:**
- Consumes: Passing validation evidence.
- Produces: Pushed commit on `main`.

- [ ] **Step 1: Review final diff**

Run: `git diff --stat && git diff -- src/messages/ko/tools/sql-to-json.json src/messages/de/tools/text-reverser.json docs/GSC_P2_TEMPLATE_CLEANUP_BATCH_4_WORKLOG_2026-07-05.md`

- [ ] **Step 2: Stage files**

Run: `git add <changed files>`

- [ ] **Step 3: Commit**

Run: `git commit -m "Clean up P2 CJK and text utility copy"`

- [ ] **Step 4: Push**

Run: `git push`

Expected: remote `main` updated successfully.
