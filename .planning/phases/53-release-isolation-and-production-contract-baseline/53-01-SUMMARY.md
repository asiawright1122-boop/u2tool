# Phase 53-01 Summary: Release Manifest

## Status

Complete.

## Baseline

- Current worktree status count: 308 entries.
- Largest dirty areas:
  - `.kiro`: 196 entries, mostly deletions.
  - `src`: 64 entries.
  - `.agents`: 17 entries.
  - `scripts`: 12 entries.
  - `docs`: 5 entries.
  - `.planning`: 5 tracked entries plus ignored planning artifacts.
- Live production route contract: `npm run validate:production-routes` passed against `https://www.u2tool.com` on 2026-06-09.
- Live spot checks:
  - `/en/this-route-should-not-exist-xyz` normalizes to trailing slash and returns 404.
  - `/tools/jwt-decoder` redirects to `/en/tools/jwt-decoder/`.
  - `/en/tools/passport-photo-maker/`, `/en/tools/csv-to-vcard-converter/`, and `/en/tools/vcard-to-csv-converter/` return HTTP 200.
  - The newest English category-support copy for `finance`, `generators`, and `lifestyle` was not found on live category pages.

## Approved Release Slice

Production-impact files for the v0.0.14 recovery release:

- `src/lib/category-support-v13.ts`
  - New English category support content for `finance`, `generators`, and `lifestyle`.
- `src/lib/category-support.ts`
  - Wires the v0.0.13 support-content module into the shared category support map.
- `src/lib/category-support.test.ts`
  - Adds v0.0.13 priority clusters and SEO expectations so the new support content stays governed.
- `src/components/tools/WorldCupBudgetCalculator.svelte`
  - Current dirty version contains pre-existing light-mode/chart styling changes plus two syntax fixes that were required for `npm run build` to pass in this worktree.
  - Release rule: include this file only after reviewing the broader pre-existing UI changes, or omit it if the clean release branch does not contain the duplicate `onMount` import / `{#else}` syntax regression.

Planning/evidence files for operator context:

- `.planning/REQUIREMENTS.md`
- `.planning/ROADMAP.md`
- `.planning/STATE.md`
- `.planning/PROJECT.md`
- `.planning/TRACEABILITY.md`
- `.planning/debug/traffic-drop-after-changes.md`
- `.planning/milestones/v0.0.13-MILESTONE-AUDIT.md`
- `.planning/milestones/v0.0.14-REQUIREMENTS.md`
- `.planning/milestones/v0.0.14-ROADMAP.md`
- `.planning/phases/53-release-isolation-and-production-contract-baseline/53-01-SUMMARY.md`

These planning files are ignored by `.gitignore` unless force-added. They are not required for the deployed site, but they are part of the GSD evidence trail.

## Must Exclude From Release Until Separately Reviewed

- Broad `.kiro/**` deletions.
- Broad `.agents/**` changes.
- Unrelated `src/**` modifications outside the approved release slice.
- Unrelated `scripts/**`, `docs/**`, `package.json`, `astro.config.mjs`, `.gitignore`, and ad hoc update scripts unless they are explicitly reclassified into a future release manifest.

## Release Path

1. Start from a clean branch based on the deploy target.
2. Apply only the approved production-impact files above.
3. If `WorldCupBudgetCalculator.svelte` is needed, review the full dirty diff before including it; otherwise keep it out of the release.
4. Run:
   - `npm run check`
   - `npm run qa:runtime-integrity`
   - `npm run qa:seo-governance`
   - `npm run validate:runtime-placeholder-regressions`
   - `npm run validate:front-end-safety`
   - `npm run build`
   - `npm run validate:production-routes`
5. After deployment, verify live category pages for the new support copy and rerun production route validation.

## Outcome

R1 is complete for v0.0.14: a deployable manifest now separates the traffic-recovery release slice from the unrelated dirty worktree.
