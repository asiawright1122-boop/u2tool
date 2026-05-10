# Requirements: v0.0.9 Runtime Debt Prioritization and Text Utility Repair

**Defined:** 2026-05-10
**Core Value:** Every localized tool page must render the right topic, the right language, and the right UX state without drift.

## Status

Open

## Why This Exists

`v0.0.8` repaired two bounded helper clusters and added runtime-placeholder governance, but `src/lib/tool-stubs.ts` is still a broad compatibility surface with many imported constants and functions. The next safe move is not a repo-wide rewrite. It is to make the remaining debt measurable, then repair the next obvious user-visible text/reference-data cluster where empty maps or arrays directly produce broken tool output.

The strongest immediate candidates are text utility tools that expect reference data from `tool-stubs.ts`: ASCII art fonts, Morse/NATO maps, small-text superscript/subscript maps, flip/mirror maps, and adjacent validation dictionaries. These are visible, deterministic, and easy to smoke-test without network or browser-only dependencies.

## In Scope

### Runtime Debt Intelligence

- [x] RUNTIME-06: Remaining `tool-stubs.ts` exports imported by tool components are inventoried with consumer paths, placeholder signatures, false-positive notes, and ranked repair candidates.

### Text Utility Runtime Repair

- [x] RUNTIME-07: Text utility tools that currently depend on empty reference maps or arrays render meaningful ASCII, Morse/NATO, small-text, and flip/mirror output through shared runtime-integrity helpers or populated compatibility exports.
- [x] RUNTIME-08: Adjacent validation/reference-data tools selected from the inventory, such as email provider/typo/disposable-domain checks or password common-list checks, stop silently under-reporting because of empty compatibility data.

### Runtime Governance

- [ ] OPS-12: Runtime governance and production verification include the new inventory/repair evidence without regressing localization, theme, SEO, discovery, or existing runtime gates.

## Future Requirements

- [ ] Repair additional developer, database, finance, image, or generator helper families only after inventory ranking shows high import coverage and user-visible breakage.
- [ ] Revisit fresh GSC/Coverage recovery only after new exports are available.
- [ ] Consider replacing the generated `tool-stubs.ts` compatibility surface only after enough helper clusters have migrated into typed runtime-integrity modules.

## Out Of Scope

| Feature | Reason |
| --- | --- |
| Repo-wide `tool-stubs.ts` rewrite | Too risky for a large compatibility surface; this milestone should rank and repair bounded clusters. |
| New catalog/tool expansion | The current leverage is making existing tools honest, not increasing page count. |
| Fresh GSC recovery edits | Existing May 2026 exports were already consumed; new search work needs new evidence. |
| Full visual redesign of affected tools | Runtime behavior and deterministic evidence are the goal; UI redesign can wait. |

## Traceability

| Requirement | Planned Phase | Status |
| --- | --- | --- |
| RUNTIME-06 | Phase 28 | Complete |
| RUNTIME-07 | Phase 29 | Complete |
| RUNTIME-08 | Phase 30 | Complete |
| OPS-12 | Phase 31 | Pending |

**Coverage:**
- v0.0.9 requirements: 4 total
- Mapped to phases: 4
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-10*
*Last updated: 2026-05-10 after Phase 30 verification*
