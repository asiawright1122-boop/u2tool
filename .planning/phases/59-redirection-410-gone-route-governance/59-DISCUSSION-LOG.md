# Phase 59 Discussion Log: Redirection & 410 Gone Route Governance

**Date:** 2026-06-16

---

## Question & Answer Trace

### 1. Trailing Slash Exclusions
*   **Question:** 未带尾随斜杠请求的重定向范围与排除原则是什么？
*   **Options Presented:**
    *   *Option A (Recommended):* 严格系统/文件/API 级排除 (排除 isFileLikePath, _, /api/*, /messages/*)
    *   *Option B:* 仅排除物理文件与框架路径
*   **User Selection:** **Option A**
*   **Outcome Decision:** D-01, D-02 in `59-CONTEXT.md`.

### 2. Legacy Blog Redirect Targets
*   **Question:** 老博客路径 /blog/* 在重定向时是否应进行 Locale 语言前缀对齐？
*   **Options Presented:**
    *   *Option A (Recommended):* Locale 对齐的永久重定向 (按照 /zh/blog/ -> /zh/tools/ 对应对齐)
    *   *Option B:* 一刀切重定向至英文主工具目录 (/en/tools/)
*   **User Selection:** **Option A**
*   **Outcome Decision:** D-03 in `59-CONTEXT.md`.

### 3. 410 Gone Response Details
*   **Question:** 废弃对比与过期 Chunks 的 410 Gone 响应机制如何实现？
*   **Options Presented:**
    *   *Option A (Recommended):* 携带 Robots 标签且可缓存的 410 响应 (410, x-robots-tag: noindex, cache-control 边缘缓存)
    *   *Option B:* 仅返回普通的 410 响应 (无 robots 标签与缓存)
*   **User Selection:** **Option A**
*   **Outcome Decision:** D-04, D-05, D-06 in `59-CONTEXT.md`.
