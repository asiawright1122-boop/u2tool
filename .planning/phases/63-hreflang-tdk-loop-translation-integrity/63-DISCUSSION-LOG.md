# Phase 63: Hreflang & TDK Loop & Translation Integrity - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-16
**Phase:** 63-Hreflang & TDK Loop & Translation Integrity
**Areas discussed:** Hreflang Graph Scope, SCC Strictness, TDK Fallback Detection

---

## Hreflang Graph Scope

| Option | Description | Selected |
|--------|-------------|----------|
| Scan all HTML files | Maximum safety, ensures 100% SCC coverage but adds a few seconds to build. | ✓ |
| Scan only high-priority | Faster build, but risks missing broken loops on static/legal pages. | |

**User's choice:** Scan all HTML files in `dist/client/`

---

## SCC Strictness

| Option | Description | Selected |
|--------|-------------|----------|
| Break the build on ANY asymmetrical loop | Ensures 100% Google Hreflang compliance and prevents any errors from reaching production. | ✓ |
| Log warnings | Avoids breaking builds for minor static page translation gaps. | |

**User's choice:** Break the build on ANY asymmetrical loop

---

## TDK Fallback Detection

| Option | Description | Selected |
|--------|-------------|----------|
| Match against English JSON values | Zero false positives for brand names, directly compares localized TDK against `en` values. | ✓ |
| Regex for English characters | Simpler to implement but requires a whitelist for brand names. | |

**User's choice:** Match against English JSON values

---
