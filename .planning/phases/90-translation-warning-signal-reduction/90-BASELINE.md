---
phase: 90
milestone: v0.0.30
captured: 2026-06-24T08:25:00Z
translation_corpus_baseline_report: .planning/research/reports/translation-corpus-2026-06-24T07-09-43-851Z.json
translation_corpus_checkpoint_report: .planning/research/reports/translation-corpus-2026-06-24T08-22-03-695Z.json
merge_chain_baseline_report: .planning/research/reports/merge-chain-consistency-2026-06-24T07-10-29-423Z.json
merge_chain_checkpoint_report: .planning/research/reports/merge-chain-consistency-2026-06-24T08-22-43-221Z.json
translation_corpus_followup_report: .planning/research/reports/translation-corpus-2026-06-24T17-41-39-987Z.json
merge_chain_followup_report: .planning/research/reports/merge-chain-consistency-2026-06-24T17-42-10-855Z.json
translation_corpus_followup_2_report: .planning/research/reports/translation-corpus-2026-06-24T17-51-02-890Z.json
merge_chain_followup_2_report: .planning/research/reports/merge-chain-consistency-2026-06-24T17-51-33-847Z.json
translation_corpus_followup_3_report: .planning/research/reports/translation-corpus-2026-06-24T18-12-38-485Z.json
merge_chain_followup_3_report: .planning/research/reports/merge-chain-consistency-2026-06-24T18-28-42-791Z.json
translation_corpus_followup_4_report: .planning/research/reports/translation-corpus-phase90-zh-faq-migration-root-cleanup.json
merge_chain_followup_4_report: .planning/research/reports/merge-chain-phase90-zh-faq-migration-root-cleanup.json
translation_corpus_followup_5_report: .planning/research/reports/translation-corpus-phase90-zh-clean.json
merge_chain_followup_5_report: .planning/research/reports/merge-chain-phase90-zh-clean.json
translation_corpus_followup_6_report: .planning/research/reports/translation-corpus-phase90-all-shadow-cleanup.json
merge_chain_followup_6_report: .planning/research/reports/merge-chain-phase90-all-shadow-cleanup.json
---

# Phase 90: Baseline Evidence

This record captures the first implementation checkpoint for
`v0.0.30 Translation Warning Signal Reduction`. The milestone started from a
warning-only backlog with hard failures already at zero. Phase 90's job is to
make those warning channels smaller and easier to interpret without weakening
the gates.

## What Changed in This Checkpoint

Validator improvements:

- `scripts/validation/validate-translation-corpus.ts`
  - added real CLI help
  - added `--report-path`
  - added `--top`
  - added namespace warning summaries by kind, drift shape, top locale, and top key
- `scripts/validation/validate-merge-chain-consistency.ts`
  - added real CLI help
  - added `--report-path`
  - added `--top`
  - added overlap summaries by layer shape, top locale, and top slug

Bounded cleanup:

- removed dead root-layer support copy for `gpa-calculator` and
  `pace-calculator` from every locale aggregate `<locale>.json`
- removed locale-only `base.json` extras that EN no longer carries:
  - `gpa-calculator.remove`
  - `pace-calculator.metric`
  - `pace-calculator.imperial`

These edits are mechanically safe because the authoritative support copy lives
in split files, while tool UI components continue reading current keys from the
merged `tools.<slug>` scope.

## Focused Test Evidence

Commands:

```bash
npx vitest run scripts/validation/validate-translation-corpus.test.ts scripts/validation/validate-merge-chain-consistency.test.ts
npx vitest run scripts/validation/validate-translation-corpus.test.ts scripts/validation/validate-merge-chain-consistency.test.ts src/lib/translations.test.ts src/lib/support-content-fallback.test.ts
```

Results:

- Validator-focused pass: `2` files / `72` tests / PASS
- Extended regression pass: `4` files / `190` tests / PASS

This covers the new CLI parsing, summary shapes, hotspot aggregation, merge
semantics, and support-content fallback contracts.

## Baseline vs Current Checkpoint

### Translation Corpus

Baseline command:

```bash
npm run validate:translation-corpus
```

Baseline result:

- PASS
- `Schema errors: 0`
- `Coverage gaps: 0`
- `Namespace issues: 325`
- report: `.planning/research/reports/translation-corpus-2026-06-24T07-09-43-851Z.json`

Checkpoint command:

```bash
npm run validate:translation-corpus -- --top 5
```

Checkpoint result:

- PASS
- `Schema errors: 0`
- `Coverage gaps: 0`
- `Namespace issues: 307`
- drift shape summary: `missing_only=2`, `extra_only=305`, `mixed=0`
- top locale remains `zh=294`
- report: `.planning/research/reports/translation-corpus-2026-06-24T08-22-03-695Z.json`

Net change:

- `-18` namespace warnings

### Merge Chain Consistency

Baseline command:

```bash
npm run validate:merge-chain-consistency
```

Baseline result:

- PASS
- `Layer overlap: 15301`
- `Resolved divergences: 0`
- `EN-fallback resolutions: 0`
- root-heavy breakdown: `root=15034`, `base=0`, `both=267`
- report: `.planning/research/reports/merge-chain-consistency-2026-06-24T07-10-29-423Z.json`

Checkpoint command:

```bash
npm run validate:merge-chain-consistency -- --top 5
```

Checkpoint result:

- PASS
- `Layer overlap: 15241`
- `Resolved divergences: 0`
- `EN-fallback resolutions: 0`
- refined layer summary: `root=14974`, `base=0`, `both=267`
- report: `.planning/research/reports/merge-chain-consistency-2026-06-24T08-22-43-221Z.json`

Net change:

- `-60` overlap warnings

## Follow-up Checkpoint: Chart / Prettier Namespace Batch

After the v0.0.30 closure checkpoint, a second bounded cleanup batch continued
the same warning-reduction direction without reopening the milestone scope:

- added missing `prettier-config-generator.htmlWhitespaceSensitivity` labels to
  `ar/base.json` and `ru/base.json`, eliminating the remaining
  `missing_only` namespace warnings
- removed Arabic chart-tool extras that the corresponding components do not
  read (`title`, plus `themeRandom` / `themeImportJson` for calendar heatmap)
- removed five Chinese chart FAQ shadow blocks from `base.json` only where the
  same locale already has split-file FAQ copy

Follow-up commands:

```bash
npm run validate:translation-corpus -- --top 8
npm run validate:merge-chain-consistency -- --top 8
npx vitest run scripts/validation/validate-translation-corpus.test.ts scripts/validation/validate-merge-chain-consistency.test.ts src/lib/translations.test.ts src/lib/support-content-fallback.test.ts
```

Follow-up result:

- `validate:translation-corpus`: PASS with `Schema errors: 0`,
  `Coverage gaps: 0`, and `Namespace issues: 291`
- namespace drift shape summary is now `missing_only=0`, `extra_only=291`,
  `mixed=0`
- top namespace locale remains `zh=289`; the only non-ZH namespace hotspots are
  `es/carbon-footprint-calculator` and `pt/carbon-footprint-calculator`
- `validate:merge-chain-consistency`: PASS with `Layer overlap: 15241`,
  `Resolved divergences: 0`, and `EN-fallback resolutions: 0`
- merge layer shape shifted from `root=14974`, `both=267` to `root=14979`,
  `both=262`; total overlap is unchanged because the removed ZH base FAQ
  shadows still have root-layer duplicates
- focused regression tests passed: `4` files / `190` tests

Follow-up net change from the Phase 90 closure checkpoint:

- `-16` namespace warnings (`307 -> 291`)
- `-2` missing-only warnings (`2 -> 0`)
- `0` total overlap warnings (`15241 -> 15241`), with `5` fewer `root+base`
  overlap cases

## Follow-up Checkpoint 2: ZH Split-Covered FAQ Shadow Batch

A third bounded cleanup batch removed `162` additional `zh/base.json` FAQ shadow
blocks only when the same slug already had `faqs` in
`src/messages/zh/tools/<slug>.json`. Slugs without split-file FAQ copy were
left untouched so tool pages do not lose their only local FAQ source.

Implementation note: `zh/base.json` contains duplicate top-level slug keys for
some legacy entries, so the cleanup selected the effective last top-level slug
block for each candidate and handled both middle-field and final-field JSON
comma positions before writing. The rewritten JSON was parsed before and after
the edit.

Follow-up 2 commands:

```bash
npm run validate:translation-corpus -- --top 8
npm run validate:merge-chain-consistency -- --top 8
npx vitest run scripts/validation/validate-translation-corpus.test.ts scripts/validation/validate-merge-chain-consistency.test.ts src/lib/translations.test.ts src/lib/support-content-fallback.test.ts
```

Follow-up 2 result:

- `validate:translation-corpus`: PASS with `Schema errors: 0`,
  `Coverage gaps: 0`, and `Namespace issues: 129`
- namespace drift shape summary remains `missing_only=0`, `extra_only=129`,
  `mixed=0`
- top namespace locale remains `zh=127`; only `es` and `pt` contribute one
  non-ZH finding each
- `validate:merge-chain-consistency`: PASS with `Layer overlap: 15241`,
  `Resolved divergences: 0`, and `EN-fallback resolutions: 0`
- merge layer shape shifted from `root=14979`, `both=262` to `root=15141`,
  `both=100`; total overlap is unchanged because the underlying root-layer
  support-copy duplicates still exist
- focused regression tests passed again: `4` files / `190` tests

Follow-up 2 net change from the previous follow-up checkpoint:

- `-162` namespace warnings (`291 -> 129`)
- `0` total overlap warnings (`15241 -> 15241`), with `162` fewer `root+base`
  overlap cases

## Follow-up Checkpoint 3: Carbon-Footprint Legacy Key Batch

A fourth bounded cleanup batch removed stale localized
`carbon-footprint-calculator` keys from `es/base.json`, `pt/base.json`, and
`zh/base.json`. These keys used old localized/snake-case names that the Svelte
component does not read; the current UI keys (`monthly`, `transportation`,
`homeEnergy`, `dietType`, `treesNeeded`, `levels.*`, etc.) remain intact.

Follow-up 3 result:

- `validate:translation-corpus`: PASS with `Schema errors: 0`,
  `Coverage gaps: 0`, and `Namespace issues: 126`
- namespace drift shape summary remains `missing_only=0`, `extra_only=126`,
  `mixed=0`
- remaining namespace drift is now entirely `zh`
- `validate:merge-chain-consistency`: PASS with `Layer overlap: 15241`,
  `Resolved divergences: 0`, and `EN-fallback resolutions: 0`
- merge layer shape remains `root=15141`, `base=0`, `both=100`
- focused regression tests passed again: `4` files / `190` tests

Follow-up 3 net change from the previous follow-up checkpoint:

- `-3` namespace warnings (`129 -> 126`)
- `0` total overlap warnings (`15241 -> 15241`)

## Follow-up Checkpoint 4: ZH FAQ Split Migration Batch

A fifth bounded cleanup batch migrated the remaining `112` FAQ-only
`zh/base.json` namespace findings into their corresponding split files under
`src/messages/zh/tools/<slug>.json`. Each candidate had a split file, had
`faqs` only in `zh/base.json`, and did not already have split-file FAQ copy.

The batch also removed `108` identical root-layer FAQ shadows from
`src/messages/zh.json` after verifying their FAQ arrays matched the new split
copy exactly. Four chart slugs (`bar-chart-generator`, `line-chart-generator`,
`treemap-chart-generator`, and `venn-diagram-generator`) had no root-layer FAQ
shadow, so only the split migration was needed for them.

Follow-up 4 commands:

```bash
npm run validate:translation-corpus -- --top 20 --report-path .planning/research/reports/translation-corpus-phase90-zh-faq-migration-root-cleanup.json
npm run validate:merge-chain-consistency -- --top 20 --report-path .planning/research/reports/merge-chain-phase90-zh-faq-migration-root-cleanup.json
```

Follow-up 4 result:

- `validate:translation-corpus`: PASS with `Schema errors: 0`,
  `Coverage gaps: 0`, and `Namespace issues: 14`
- namespace drift shape summary remains `missing_only=0`, `extra_only=14`,
  `mixed=0`
- remaining namespace drift is still entirely `zh` and is now limited to
  non-FAQ tool UI keys such as `bra-size-calculator`, `paint-calculator`,
  `subnet-calculator-enhanced`, and `tile-calculator`
- `validate:merge-chain-consistency`: PASS with `Layer overlap: 15241`,
  `Resolved divergences: 0`, and `EN-fallback resolutions: 0`
- merge layer shape remains `root=15141`, `base=0`, `both=100`

Follow-up 4 net change from the previous follow-up checkpoint:

- `-112` namespace warnings (`126 -> 14`)
- `0` total overlap warnings (`15241 -> 15241`), because the newly
  split-owned FAQ copy was paired with identical root-shadow removal where the
  root layer existed

## Follow-up Checkpoint 5: ZH Residual UI-Key Split Migration Batch

A sixth bounded cleanup batch migrated the final `14` non-FAQ
`zh/base.json` namespace findings into their corresponding split files. These
were tool UI labels for:

- `bra-size-calculator`
- `code-screenshot-generator`
- `concrete-calculator`
- `graphql-formatter`
- `instagram-font-generator`
- `keyword-density-checker`
- `number-system-converter`
- `paint-calculator`
- `paraphrase-tool`
- `ring-size-calculator`
- `social-media-size-guide`
- `subnet-calculator-enhanced`
- `text-summarizer`
- `tile-calculator`

Each candidate had a split file, the split file did not already carry the
extra keys, and the values were copied verbatim from `zh/base.json` before the
base-layer copy was removed.

Follow-up 5 commands:

```bash
npm run validate:translation-corpus -- --top 20 --report-path .planning/research/reports/translation-corpus-phase90-zh-clean.json
npm run validate:merge-chain-consistency -- --top 20 --report-path .planning/research/reports/merge-chain-phase90-zh-clean.json
```

Follow-up 5 result:

- `validate:translation-corpus`: PASS with `Schema errors: 0`,
  `Coverage gaps: 0`, and `Namespace issues: 0`
- namespace drift shape summary is now `missing_only=0`, `extra_only=0`,
  `mixed=0`
- `validate:merge-chain-consistency`: PASS with `Layer overlap: 15241`,
  `Resolved divergences: 0`, and `EN-fallback resolutions: 0`
- merge layer shape remains `root=15141`, `base=0`, `both=100`

Follow-up 5 net change from the previous follow-up checkpoint:

- `-14` namespace warnings (`14 -> 0`)
- `0` total overlap warnings (`15241 -> 15241`)

## Follow-up Checkpoint 6: Full Root/Base Support Shadow Cleanup

A seventh bounded cleanup batch removed all remaining support-copy shadows from
the non-authoritative root and base layers. The removed fields were limited to
the split-owned support keys:

- `detailed_description`
- `usage_steps`
- `usage_examples`
- `faqs`

Before writing files, a full dry-run removed the reported root/base shadow
fields in memory and compared the final resolved support copy for every
affected `(locale, slug)` pair. The dry-run covered `14841` remaining overlap
findings, `4852` affected `(locale, slug)` pairs, and `19408` support-key
comparisons with `0` diffs. This confirms the split files already owned the
runtime-visible support copy.

Follow-up 6 commands:

```bash
npm run validate:merge-chain-consistency -- --top 20 --report-path .planning/research/reports/merge-chain-phase90-all-shadow-cleanup.json
npm run validate:translation-corpus -- --top 20 --report-path .planning/research/reports/translation-corpus-phase90-all-shadow-cleanup.json
npm run qa:seo-governance
npm run check
npm run build
```

Follow-up 6 result:

- `validate:merge-chain-consistency`: PASS with `Layer overlap: 0`,
  `Resolved divergences: 0`, and `EN-fallback resolutions: 0`
- merge layer shape summary is now `root=0`, `base=0`, `both=0`
- `validate:translation-corpus`: PASS with `Schema errors: 0`,
  `Coverage gaps: 0`, and `Namespace issues: 0`
- `qa:seo-governance`: PASS on 2026-06-26. The chain confirmed `0`
  missing i18n keys, `5570/5570` TDK drift records resolved, translation
  corpus and merge-chain counts stayed at `0`, localized long-tail support
  passed for `90` files, and the focused Vitest SEO/support suite passed
  (`16` files / `187` tests). The existing `2802` TDK compliance findings are
  warning-only length/style suggestions and did not fail the gate.
- `npm run check`: PASS with `0` errors and `0` warnings; Astro reported
  `13` existing unused-symbol hints outside this cleanup.
- `npm run build`: PASS. Build completed for the Cloudflare server output;
  Vite reported existing browser-compat externalization warnings for Node
  modules imported by `src/lib/translations.ts`.

Follow-up 6 net change from the previous follow-up checkpoint:

- `-15241` overlap warnings (`15241 -> 0`)
- `0` namespace warnings unchanged

## Interpretation

- The hard-gate contract is unchanged and still green.
- The warning surface is now easier to review because reports show hotspot
  structure instead of one flat total.
- The first bounded cleanup batch proved that a small number of concentrated
  duplicate-copy edits can reduce both warning families without touching page
  templates or merge semantics.
- The namespace warning channel is now clear; any future
  `validate:translation-corpus` namespace warning should be treated as fresh
  drift unless a new accepted-debt record is added.
- The merge-chain overlap warning channel is now clear; any future
  `validate:merge-chain-consistency` layer overlap should be treated as fresh
  duplicate-source drift unless a new accepted-debt record is added.

## Exact Next Step

Phase 90's warning-reduction objective is complete. The next milestone can
focus on a different governance or release-health priority.
