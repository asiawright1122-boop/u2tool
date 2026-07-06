# GSC P2 ZH Chart Copy Batch 9 Worklog

Date: 2026-07-06

## Scope

Cleaned Chinese P2 copy for six chart pages:

- `area-chart-generator`
- `bubble-chart-generator`
- `sankey-chart-generator`
- `nightingale-rose-chart-generator`
- `tree-chart-generator`
- `treemap-chart-generator`

This was locale-copy-only remediation. No Svelte components, helper logic, routes, schemas, tests, GSC request-indexing ledgers, URL Inspection submission data, or daily execution status docs were changed.

## Changes

- Updated effective Chinese root/base metadata for the six scoped chart slugs.
- Rewrote scoped split support JSON so detailed descriptions, usage steps, examples, and FAQs match the current ECharts UI:
  - Area chart: categories, series, smooth/stacked/grid/legend/fill opacity, sample data, PNG/SVG.
  - Bubble chart: two-dimensional X/Y/size bubble points, series editing, axis names, PNG/SVG.
  - Sankey chart: node and link rows, source/target/value, orientation, node width/gap, PNG/SVG.
  - Nightingale rose chart: category/value rows, rose type, labels/legend, CSV text import, PNG/SVG.
  - Tree chart: node table, parent selection, values, orthogonal/radial layout, direction, PNG/SVG.
  - Treemap chart: nested node editor, child nodes, percentages, breadcrumb, leaf depth, PNG/SVG.
- Removed unsupported or misleading claims around batch generation, 3D/WebGL rendering, Excel upload, broad file workflows, drag editing, JSON export, massive-node engines, high-definition export language, and generic speed/security guarantees.

## Validation Evidence

- Targeted metadata parity and split overclaim scan:
  - `targeted zh batch 9 chart metadata parity and split overclaim scan passed`
- `git diff --check`
  - Exit code 0.
- `npm run validate:gsc-loss-metadata`
  - `GSC loss metadata validation passed. checks=65`
- `npm run qa:seo-governance`
  - Missing i18n keys: 0.
  - TDK integrity: 5570 checked combinations, 0 errors, 2477 warnings.
  - TDK drift: 5570 passed, 0 failed.
  - Translation corpus: 5570 split files scanned, 0 schema errors, 0 coverage gaps, 0 namespace issues.
  - Merge chain: 0 resolved divergences.
  - Localized long-tail support: files=90.
  - Vitest: 16 test files passed, 240 tests passed.

## Notes

- Priority SEO keyword pins required preserving truthful terms such as `面积图`, `累计数据`, `时间序列`, `三维数据`, `流向图`, `转化路径`, `组织架构`, `层级关系`, `分层数据`, `占比`, and `业务构成`.
- Existing unrelated dirty GSC/docs files, `package.json`, and `scripts/seo/gsc-post-submission-performance-readout-template.ts` remain intentionally unstaged.
