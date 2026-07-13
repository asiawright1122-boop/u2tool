# Final Governance Review Fix Report

## Status

Implementation commit:
`7bdcf8091fe6149cd10d49d293d9f9952ccd1561`
(`fix: harden capability governance gate`).

No deploy, push, main-checkout edit, or inventory-profile promotion occurred.
The production lane remains frozen until the 2026-07-27 Day 14 decision
explicitly returns `OPEN_PRODUCT_LANE`.

## Implemented Important Findings

### 1. Locale-aware claim enforcement and 60-page audit

- Added `src/lib/tool-capability-claim-taxonomy.ts` with deterministic rules for
  all governed claim codes and all ten UI locales.
- Detection is sentence/segment based, skips questions, recognizes localized
  negative/limitation language, and preserves the existing profile issue codes.
- Added 60 affirmative/limitation fixture pairs across the six pilot families
  and ten locales, plus exact regressions for Arabic Hex, Arabic Excel, and
  German Gantt findings.
- Added Excel claim families for advanced regex/multi-condition filtering and
  hierarchical/multi-column sorting.
- Audited six profiles × ten locales. The corrected validator identified 15
  issues across nine locale pages before copy correction and now reports zero.
- Rewrote unsupported Arabic, Japanese, Korean, and Chinese pilot copy and kept
  Chinese root/base SEO records aligned.

### 2. Scan every visible disclosure label

- Release readiness now resolves every conditionally visible shared/profile
  disclosure label and passes each resolved string through the same
  locale-aware claim detector.
- Covered shared headings, privacy and language labels, modes, inputs, outputs,
  features, limits, engine-language branches, and optional-server branches.
- Added a regression proving an AI overclaim in a visible Grammar label blocks
  readiness; honest labels and dormant branches pass.
- Inventory profiles remain excluded from public disclosure rendering.

### 3. Require real matching behavior-test evidence

- Added the structured evidence type `{ file, testName }` to the capability
  schema.
- Release-blocking validation now requires evidence for the profile gate and
  every rendered category: modes, accepted inputs, produced outputs, browser
  features, optional-server features, limits, and engine-language support.
- Approved evidence locations are repository test modules under `src/`,
  `scripts/`, `tests/`, and `e2e/`.
- Rejected arbitrary files (`package.json`), directories, missing/outside
  paths, absolute paths, and symlink escapes.
- Bound the named collected test to the exact marker
  `[capability:<slug>:<category>:<item-id>]`.
- Added coverage for unrelated test modules; wrong slug, category, and item
  markers; uncollected names; symlink escape; and valid exact-marker evidence.
- All six real profiles remain inventory with empty evidence.

### 4. Regenerated baseline

Replaced `docs/CAPABILITY_GOVERNANCE_BASELINE_2026-07-13.md` with fresh
commands, counts, results, corrected evidence semantics, current limitations,
warning totals, SSR isolation evidence, and the independent production freeze.

## Files Changed

Governance implementation and tests:

- `src/lib/tool-capability-claim-taxonomy.ts`
- `src/lib/tool-capability-claims.ts`
- `src/lib/tool-capability-claims.test.ts`
- `scripts/validation/validate-tool-capability-claims.ts`
- `scripts/validation/validate-tool-capability-claims.test.ts`
- `src/config/tool-capabilities/types.ts`
- `src/config/tool-capabilities/index.ts`
- `src/config/tool-capabilities/index.test.ts`
- `src/config/tool-capabilities/profiles/excel-viewer.ts`
- `src/config/tool-capabilities/profiles/gantt-chart-generator.ts`
- `src/config/tool-capabilities/profiles/grammar-checker.ts`
- `src/config/tool-capabilities/profiles/hex-editor.ts`
- `src/config/tool-capabilities/profiles/sql-query-optimizer.ts`
- `src/config/tool-capabilities/profiles/typing-speed-test.ts`
- `src/components/tools/test-fixtures/tool-capability-disclosure/src/pages/index.astro`
- `src/messages/seo-governance.test.ts`

Corrected localized copy:

- `src/messages/ar/base.json`
- `src/messages/ar/tools/excel-viewer.json`
- `src/messages/ar/tools/gantt-chart-generator.json`
- `src/messages/ar/tools/hex-editor.json`
- `src/messages/ja/tools/excel-viewer.json`
- `src/messages/ja/tools/hex-editor.json`
- `src/messages/ko/tools/excel-viewer.json`
- `src/messages/ko/tools/gantt-chart-generator.json`
- `src/messages/zh.json`
- `src/messages/zh/base.json`

Documentation:

- `docs/CAPABILITY_GOVERNANCE_BASELINE_2026-07-13.md`
- `.superpowers/sdd/final-fix-report.md`

## Design Decisions

1. Kept unsupported-claim ownership in profiles while centralizing localized
   matching by claim code. This preserves established issue codes/reasons and
   avoids duplicating translated regexes across profile files.
2. Applied negation and question handling per text segment, not to the entire
   flattened page, so one honest limitation cannot mask an affirmative claim
   elsewhere and FAQ questions do not become affirmative assertions.
3. Scanned only labels that would render for the release-blocking profile and
   locale. Dormant optional-server and unsupported engine-language labels remain
   out of scope until their branches become visible.
4. Used explicit test-name markers rather than file existence or filename
   conventions. This binds evidence to the profile slug and exact public
   category/item while keeping inventory profiles evidence-free.
5. Did not fabricate behavior evidence or promote any pilot profile.

## TDD Evidence

- Hex locale tracer: RED 9/13 failures for non-English affirmative claims;
  GREEN 13/13 after the first localized detector.
- Full locale-family fixtures: RED 11/25 failures while new Excel families and
  locale terms were absent; GREEN after taxonomy/profile additions.
- Concrete Arabic/German audit regressions: RED 2/27; GREEN 27/27.
- Evidence APIs: RED 4/20; GREEN 20/20 after approved-path and exact-marker
  validation.
- Visible-label scan: RED 1/21 for a resolved AI overclaim; GREEN 21/21.
- Final evidence/schema focused run: 2/2 files, 38/38 tests.

## Fresh Verification

### Focused governance suite

```bash
npx vitest run src/config/tool-capabilities/index.test.ts src/lib/tool-capability-claims.test.ts src/lib/support-content-fallback.test.ts scripts/validation/validate-tool-capability-claims.test.ts scripts/validation/tool-page-render-contract.test.ts src/components/tools/ToolCapabilityDisclosure.test.ts src/lib/tool-capability-disclosure.test.ts
```

Exit `0`; 7/7 files, 236/236 tests.

### Default validator

```bash
npm run validate:tool-capability-claims
```

Exit `0`; `profiles=6 localePages=60 issues=0`.

### Intentional release-ready failure

```bash
npm run validate:tool-capability-claims -- --require-release-ready grammar-checker
```

Expected exit `1`; exactly one
`release-ready-enforcement-required` issue for the real inventory Grammar
profile.

### SEO governance

```bash
npm run qa:seo-governance
```

Exit `0`; 0 missing keys; 5,700/5,700 TDK records resolved; 0 TDK errors;
2,475 warnings (404 title, 2,071 description; 8 short, 2,467 long); 5,700
translation files with 0 schema/coverage/namespace failures; merge-chain counts
all zero; 90 localized long-tail files passed; capability claims 6/60/0; SEO
tests 16/16 files and 251/251 tests.

### Type/Astro check

```bash
npm run check
```

Exit `0`; 329 files; 0 errors; 0 warnings; 13 pre-existing hints.

### Build

```bash
npm run build
```

Exit `0`; Cloudflare SSR build complete. Six pre-existing Vite externalization
warnings remained. Inspector port `9229` was occupied and `9230` was used.

### SSR inventory isolation

```bash
npm run preview -- --host 127.0.0.1 --port 4327
npm run validate:tool-page-render-contract -- --base-url http://127.0.0.1:4327 --filter grammar-checker
```

Exit `0`; 1 route passed. Direct HTTP response was `200`, `175982` bytes, and
contained none of `data-tool-capability`, `data-capability-version`, or
`data-local-processing`. Preview shutdown check returned `server_stopped=yes`.

### Whitespace

```bash
git diff --check
```

Exit `0`; no output.

## Baseline Changes

- Focused suite changed from 207 to 236 tests.
- Astro check changed from 328 to 329 files because the locale taxonomy module
  was added.
- TDK warnings changed from 2,476 to 2,475 after truthful Chinese SEO copy was
  shortened; description warnings changed from 2,072 to 2,071 and long warnings
  from 2,468 to 2,467.
- The baseline now documents per-category exact-marker evidence rather than
  arbitrary existing file paths.
- Inventory-only and Day 14 production-freeze statements remain explicit.

## Concerns and Recorded Minors

- `src/lib/content-trust.js` still uses entire fields for profile-generated
  excerpts rather than focused match windows.
- `defineToolCapabilityProfile` still shallow-freezes profiles; nested
  structures remain mutable.
- Evidence validation proves an approved test module contains a collected test
  with the exact capability marker. Promotion policy must still run the named
  behavior tests and the repository suite before changing enforcement.
- No current pilot has evidence or release-ready status. This is intentional.
