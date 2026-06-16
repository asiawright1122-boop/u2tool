# Phase 63: Hreflang & TDK Loop & Translation Integrity - Context

**Gathered:** 2026-06-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Validating post-build `dist/client/` output to ensure all localized HTML files maintain intact, symmetrical Hreflang loops (Strongly Connected Components) and checking that localized Title/Description (TDK) tags are properly translated instead of falling back to English values or placeholders.

</domain>

<decisions>
## Implementation Decisions

### Hreflang Validation
- **D-01 (Graph Scope):** Scan **all** HTML files in `dist/client/`. Do not limit to high-priority tool routes. We want 100% SCC coverage for maximum safety.
- **D-02 (SCC Strictness):** Break the build immediately on **ANY** asymmetrical loop. Strict enforcement prevents errors from reaching production.

### TDK Fallback Detection
- **D-03 (Detection Logic):** Match against English JSON values. Directly compare localized TDK against the `en` values to spot missing translations, rather than relying on regex (which would trigger false positives on brand names).

### the agent's Discretion
- Parsing HTML efficiently (e.g. using `node-html-parser` or similar, as we do in other validators).
- How to structure the graph model for SCC checking.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Plans
- `.planning/ROADMAP.md` — Phase 63 objectives (HTDK-01, HTDK-02 requirements).

No external specs — requirements fully captured in decisions above.
</canonical_refs>

<code_context>
## Existing Code Insights

### Established Patterns
- **Validation Pipeline:** Post-build static analysis runs in `package.json` (`qa:production` -> `npm run validate:*`). Our new scripts (`validate-hreflang-scc.ts` / `validate-tdk-translations.ts`) must follow the `node --import tsx/esm scripts/validation/...` pattern.
- **HTML Parsing:** Other validators in `scripts/validation/` read files from `dist/client/` and analyze tags. We should reuse the same file discovery patterns.

</code_context>

<specifics>
## Specific Ideas

No specific references — open to standard approaches based on existing validator scripts.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 63-hreflang-tdk-loop-translation-integrity*
*Context gathered: 2026-06-16*
