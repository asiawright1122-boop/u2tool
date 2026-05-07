# 0001. v2 message namespace retirement

**Status:** Accepted
**Date:** 2026-05-07
**Decided:** 2026-05-07
**Owner:** project-wide
**Implementation:** commits `50139773`, `7dbba4c3`, `de6d4a99` on
branch `wip/v2-namespace-retirement` (merged to `main`).

## Context

`src/messages/{locale}/v2/` was introduced as a forward-looking
replacement for the legacy `{locale}.json` + `{locale}/base.json` +
`{locale}/tools/` corpus. The migration was started but never finished.

### Current ground truth (verified 2026-05-07)

- The v2 namespace is fully populated for all 10 locales:
  - `v2/core.json` (468 lines) — full UI strings (site, nav, footer)
  - `v2/seo.json` (76 lines) — `categories_seo` and related metadata
  - `v2/static/{about,blog,privacy,terms}.json` — static-page copy
  - `v2/tools/<slug>.json` × **635 files per locale** = 6,350 files
  - `v2/tools-index.json` — flat catalog index
- The v1 namespace is also fully populated:
  - `{locale}.json` and `{locale}/base.json` — UI strings and SEO
  - `{locale}/tools/<slug>.json` — per-tool detail copy
- Total `src/messages/` JSON count: **11,450**.
- 10 locales × ~1,145 files. v2 contributes roughly 65% of the file count.

### Code consumption today

- `src/lib/translations.ts` is the canonical loader.
- `loadBaseMessages(locale)` reads **v1 only** — `{locale}.json` merged
  with `{locale}/base.json`.
- `loadToolMessages(locale, slug)` reads **v1 only** — `{locale}/tools/<slug>.json`
  with `{locale}/base.json` fallback.
- `loadLegacyToolIndex(locale)` reads **v2/tools-index.json** (the
  function is misnamed: "Legacy" referred to the per-page tool-detail
  JSON shape, but the body actually loads the v2 file).
- `grep -rn "v2/" src/` finds **zero references** to `v2/core.json`,
  `v2/seo.json`, `v2/static/*`, or `v2/tools/<slug>.json`. They are on
  disk but no code path reads them.

### Content drift between v1 and v2 (sampled `json-formatter`)

- `v2/tools/json-formatter.json` adds `inputPlaceholder` and
  `outputPlaceholder` strings that v1 does not have.
- `v1/tools/json-formatter.json` keeps a `faqs[]` array that v2 omits.
- Top-level UI copy diverges: `v2/core.json` advertises
  "1000+ Free Online Tools" while `v1/base.json` says
  "500+ Free Online Tools — No Login Required". The tool catalog
  ships 500 tools, so v1 is currently truthful.

### Why this needs a decision

- 6,350 v2 tool files are paid maintenance (translation reviews,
  copy edits, rendered-SEO drift) without delivering runtime value.
- v1 and v2 disagree on which fields exist (UI placeholders, faqs)
  and on tagline counts; whichever surface ships, half of the corpus
  is silently incorrect.
- Future work that touches translations (Phase 23 GSC recovery,
  v0.0.8 authority waves) needs to know which namespace is the
  authoritative source so edits do not get reverted.

## Decision

**Proposed: Option B — Retire v2, keep v1 as the single namespace.**

Detailed rationale and alternatives below. This ADR is **Proposed**
until the project owner accepts or counters with one of the other
options. Until then, no v1 or v2 files should be deleted.

## Alternatives Considered

### Option A — Complete the migration to v2, retire v1

Switch `loadBaseMessages` and `loadToolMessages` to read v2 first.
Backfill the missing fields (port `faqs[]` from v1 to v2). Update
`tagline`/`description` strings. Delete v1 once all consumers verified.

- **Cost:** highest. Requires content reconciliation across 10 locales,
  test updates, validation-script updates, careful rollout to avoid
  rendered-SEO drift on the live site.
- **Benefit:** v2 already has UI placeholder strings v1 lacks; lays
  the groundwork for the "1000+ tools" expansion advertised in
  `v2/core.json`.
- **Risk:** during the cutover, every page on the site re-renders from
  a different content source — fertile ground for SEO regressions
  exactly when Phase 23 is trying to recover GSC trust.

### Option B — Retire v2, keep v1 as the single namespace (RECOMMENDED)

Move `loadLegacyToolIndex` to read from a v1-equivalent source (or
collapse the tool-index into existing v1 truth). Delete the v2
directory across all 10 locales.

- **Cost:** moderate. Requires migrating the one v2 read site
  (`loadLegacyToolIndex`) and proving tools-index export still passes
  `validate:llms-discovery` and `validate:growth-surfaces`. Then bulk
  delete ≈6,350 v2 files.
- **Benefit:** removes 65% of `src/messages/` file count. Eliminates
  the silent drift between two sources. Translation governance
  (`i18n:check-missing-keys`, `qa:seo-governance`) gets simpler.
  v1 already passes `0 missing key(s)` across all 9 non-English locales.
- **Risk:** loses the v2-only fields (UI placeholders) that no live
  code reads anyway. Future "1000+ tools" expansion would need to
  restart from v1 (or design a v3 with explicit migration plan)
  rather than continuing on v2's half-built foundation.

### Option C — Keep both, status quo

Leave the directories side by side. Document that `loadLegacyToolIndex`
is the only v2 consumer and treat the rest as cold storage.

- **Cost:** zero immediate. Ongoing: the cost of maintaining drift
  between two sources every time copy is updated.
- **Benefit:** no risk of breaking anything today.
- **Risk:** the two sources will continue to drift; future contributors
  will keep editing the wrong one; the disk and validation surface
  area keeps growing.

### Option D — Pause and re-design

Write a v3 namespace shape that explicitly captures the lessons
learned (UI placeholders, faqs, static pages, expansion tagline).
Then migrate v1 to v3 in a single planned phase.

- **Cost:** high but bounded. Requires a new namespace design + a
  one-shot migration.
- **Benefit:** gets a clean shape with no historical baggage.
- **Risk:** introduces a third state (v1 + v2 + v3) for the duration
  of design + migration. Worse than Option B for any horizon under
  six months.

## Consequences (if Option B is accepted)

**Positive:**

- `src/messages/` shrinks from ≈11,450 files to ≈5,100 (≈55% reduction).
- One canonical place to edit copy → fewer "I changed it but the
  page still shows the old text" incidents.
- `qa:seo-governance` and `validate-rendered-seo` only have one
  surface to assert against.
- `loadLegacyToolIndex` rename / inline becomes possible (the function
  name has been misleading since the v2 wave landed).

**Negative:**

- Loses the v2-only UI placeholder strings. Any tool that wanted
  contextual placeholders would need the field added to v1 (1 round
  of translation work, but bounded to tools that actually need it).
- The "1000+ tools" tagline in `v2/core.json` is gone; if/when the
  catalog crosses 1000 tools the tagline is added once to v1.
- Anyone with a local branch editing v2 will have to rebase or
  re-apply against v1.

**Neutral:**

- v1's `faqs[]` field continues to be the SEO-critical source.
- Build-time `copyMessageAssetsIntegration` automatically reflects
  the smaller corpus.

## Migration Plan (only after this ADR is Accepted)

1. **Snapshot v2 to a branch**: `git checkout -b archive/v2-namespace-snapshot`
   on a commit that still has the full v2 tree, push the branch to
   `origin` so the content is recoverable. Tag the commit
   `v2-namespace-final-snapshot`.
2. **Replace the one v2 reader**: change `loadLegacyToolIndex` in
   `src/lib/translations.ts` to derive the index from
   `src/config/tools/index.ts` plus `loadBaseMessages`, or move the
   tools-index source into a v1-equivalent location
   (e.g., `src/messages/{locale}/tools-index.json`).
3. **Add a Phase-scoped audit**: extend `validate:llms-discovery` and
   `validate:growth-surfaces` to assert the tools-index path no longer
   references `v2/`.
4. **Delete v2 directories**: `git rm -r src/messages/{locale}/v2/`
   for all 10 locales. Single commit.
5. **Run the full gate**: `npm run verify:production` must stay
   green before pushing to `origin/main`.
6. **Update CONCERNS.md and PROJECT.md** to mark the v1/v2
   coexistence concern resolved.
7. **Update this ADR**: change `Status: Proposed` →
   `Status: Accepted`, add a `Decided: YYYY-MM-DD` line, and
   record the snapshot commit / branch name in the document for
   future archaeology.

Estimated effort: one focused half-day session, gated by passing
`verify:production` after the v2 directory deletion.
