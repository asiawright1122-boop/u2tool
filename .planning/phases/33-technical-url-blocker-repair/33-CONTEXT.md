# Phase 33: Technical URL Blocker Repair - Context

**Gathered:** 2026-05-11
**Status:** Ready for planning
**Source:** Phase 32 action matrix, GSC drilldown exports, and initial live curl samples

<domain>

## Phase Boundary

Phase 33 live-checks the `fix-before-validate` groups identified in Phase 32 and patches only repository-owned URL-shape defects that still block intended indexable pages.

This phase should not enhance content or internal links for high-value tool-detail pages. That belongs to Phase 34. It should also avoid broad GSC validation requests; validation instructions remain evidence-only until the URL groups are confirmed fixed and deployed.

</domain>

<decisions>

## Implementation Decisions

### Live Check Target

Phase 32 identified 206 `fix-before-validate` URLs:

- 133 `blocked 4xx` `tool-detail` URLs with `missing-trailing-slash`.
- 54 `noindex` `tool-detail` URLs with `missing-trailing-slash`.
- 12 `not found 404` site-info legacy URLs.
- 7 `noindex` site-info legacy URLs.

Initial curl samples already show representative tool-detail and privacy paths redirecting to canonical pages and resolving 200. Phase 33 should make this reproducible with a report rather than relying on ad hoc terminal output.

### Patch Boundary

- If live checks show 301/308 -> canonical URL -> 200 HTML without `X-Robots-Tag: noindex`, document the group as expected/monitor and do not patch.
- If live checks show an intended indexable canonical URL returning 4xx/5xx/noindex, patch the owned route/redirect/canonical behavior.
- If failures are transient network errors, rerun representative samples before patching.

</decisions>

<canonical_refs>

## Canonical References

Downstream agents MUST read these before planning or implementing.

### Milestone Scope

- `.planning/REQUIREMENTS.md` - `GSC-14` acceptance boundary.
- `.planning/ROADMAP.md` - Phase 33 success criteria.
- `.planning/STATE.md` - current phase state.
- `.planning/TRACEABILITY.md` - generated requirements coverage.
- `.planning/PROJECT.md` - active milestone and decision log.

### Phase 32 Evidence

- `docs/GSC_VALIDATION_ACTION_MATRIX_2026-05-11.md`
- `docs/GSC_VALIDATION_PLAYBOOK_2026-05-11.md`
- `.planning/phases/32-gsc-validation-action-matrix/32-VERIFICATION.md`

### Relevant Validators

- `scripts/seo/gsc-validation-action-matrix.ts`
- `scripts/validation/validate-internal-link-canonicals.ts`
- `scripts/validation/validate-search-engine-compliance.ts`
- `scripts/validation/validate-sitemap-url-health.ts`

</canonical_refs>

<specifics>

## Specific Ideas

- Add a deterministic live-check script under `scripts/seo/` that extracts or encodes Phase 32 `fix-before-validate` representative URLs, follows redirects, records final status, final URL, content type, noindex headers/meta, and canonical tag.
- Emit `docs/GSC_TECHNICAL_BLOCKER_LIVE_CHECK_2026-05-11.md`.
- If all representative blocker groups resolve to indexable canonical pages or intentional exclusions, document "no code patch required" for Phase 33 and keep broad GSC validation paused.
- Run canonical/internal-link/search-engine validation after any patch. If no patch is needed, run the lightweight compliance gates that prove current URL behavior remains coherent.

</specifics>

<deferred>

## Deferred Ideas

- High-value content/internal-link enhancements and individual request-indexing are deferred to Phase 34.
- Final production verification and closeout remain deferred to Phase 35.

</deferred>

---

*Phase: 33-technical-url-blocker-repair*
*Context gathered: 2026-05-11*
