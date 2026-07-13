# Capability Governance Foundation Baseline - 2026-07-13

## Decision

Capability governance was re-verified on 2026-07-14 in `Asia/Shanghai` after
the final targeted FAQ correction. This document records the verified
working-tree state; the implementation commits are recorded in the local SDD
report and repository history.

This remains an inventory baseline, not production release approval. All six
pilot profiles remain `inventory`, contain no behavior evidence, and render no
public capability disclosure. The production lane remains independently frozen
until the 2026-07-27 Day 14 decision explicitly returns `OPEN_PRODUCT_LANE`.

## Current Profile Registry

| Pilot profile | Version | Enforcement | Engine support | Profile/category evidence |
|---|---:|---|---|---|
| `grammar-checker` | `1.0.0` | `inventory` | engine-limited; local `en` | empty |
| `hex-editor` | `1.0.0` | `inventory` | language-neutral | empty |
| `sql-query-optimizer` | `1.0.0` | `inventory` | engine-limited; local `en` | empty |
| `excel-viewer` | `1.0.0` | `inventory` | language-neutral | empty |
| `typing-speed-test` | `1.0.0` | `inventory` | engine-limited; all ten UI locales | empty |
| `gantt-chart-generator` | `1.0.0` | `inventory` | language-neutral | empty |

Reproducible registry query:

```bash
node --import tsx/esm --input-type=module <<'NODE'
import { getPilotToolCapabilityProfiles } from './src/config/tool-capabilities/index.ts';

for (const profile of getPilotToolCapabilityProfiles()) {
  const categoryEvidence = [
    ...profile.modes,
    ...profile.acceptedInputs,
    ...profile.producedOutputs,
    ...profile.browserOnlyFeatures,
    ...profile.optionalServerFeatures,
    ...profile.limits,
  ].filter((item) => item.evidence).length +
    Number(Boolean(profile.supportedLocales.engine.evidence));
  console.log(JSON.stringify({
    slug: profile.slug,
    version: profile.version,
    enforcement: profile.enforcement,
    evidenceTests: profile.evidenceTests,
    categoryEvidence,
    engine: profile.supportedLocales.engine,
  }));
}
NODE
```

Result: exit `0`; six rows, all `inventory`, all `evidenceTests: []`, and
all `categoryEvidence: 0`.

## Corrected Gate Contracts

### Locale-aware claims

The claim detector now selects deterministic taxonomy rules by locale, splits
mixed statements at localized contrast clauses, and evaluates adjacent
assertions independently. Negation in one assertion cannot mask the next.
Explicit FAQ questions remain associated with a following localized bare
`Yes` or `No`, but every following explanation is evaluated independently for
affirmative governed claims. Localized negative limitations remain honest, as
do explicit recommendations to use an external database, service, provider,
application, browser, or server. No generic previous-negation suppression
remains. Tests exercise every governed claim code in every UI locale with 320
affirmative and 320 limitation cases, plus ten-locale contradictory and honest
FAQ matrices, mixed-clause, adjacent-sentence, honest two-sentence limitation,
and current-message regressions.

The repository audit scans all six pilots in all ten locales (60 pages). Copy
found by both review waves was rewritten to match current production behavior.
The second wave corrected German, Japanese, Portuguese, French, and Russian
Gantt dependency and milestone claims in tool messages and aligned root/base
SEO records. Current-message regressions cover those five locales alongside
the earlier Arabic Hex, Arabic Excel, and other multilingual corrections.

### Visible disclosure labels

For a `release-blocking` profile, every label that could render is resolved and
scanned with the same locale-aware claim detector. This includes shared
headings/privacy/language labels, browser modes, inputs, outputs, features,
limits, engine-language labels, and conditionally visible optional-server
branches. Inventory profiles still do not render disclosure.

### Matching behavior evidence

Release evidence is structured as `{ file, testName }`. A release-blocking
profile must provide evidence for the profile gate and every rendered category:
modes, accepted inputs, produced outputs, browser features, optional-server
features, limits, and engine-language support.

Evidence files must be approved repository test modules under `src/`,
`scripts/`, `tests/`, or `e2e/`. Absolute paths, arbitrary files such as
`package.json`, directories, missing files, outside paths, and symlink escapes
are rejected. TypeScript AST collection accepts only direct `it` or `test`
declarations with static literal names. Skipped, todo, only, commented, and
dynamically named declarations are not runnable evidence. The named test must
contain the exact capability marker
`[capability:<slug>:<category>:<item-id>]`; unrelated tests and wrong
slug/category/item markers fail.

When `--require-release-ready` targets a `release-blocking` profile, the gate
also invokes local Vitest for every exact evidence reference, parses its JSON
result, requires exactly one collected assertion with the exact leaf title,
and requires that assertion to pass. Failed, skipped, todo, not-collected, and
cannot-run results each fail readiness. The runner uses a fixed executable and
argument array without a shell, with the test-name pattern escaped as data. A
single evidence invocation has a documented 30-second production timeout,
runs in a one-worker thread pool, and receives `SIGKILL` on timeout. Timeout or
termination maps to the existing cannot-run readiness failure. A real hanging
evidence regression uses an injected 250-millisecond bound and terminates
without leaving temporary fixture directories.

## Fresh Verification

### Focused capability-governance suite

```bash
npx vitest run src/config/tool-capabilities/index.test.ts src/lib/tool-capability-claims.test.ts src/lib/support-content-fallback.test.ts scripts/validation/validate-tool-capability-claims.test.ts scripts/validation/tool-page-render-contract.test.ts src/components/tools/ToolCapabilityDisclosure.test.ts src/lib/tool-capability-disclosure.test.ts
```

Result: exit `0`; 7/7 files and 291/291 tests passed.

### Default claims validator

```bash
npm run validate:tool-capability-claims
```

Result: exit `0`; `profiles=6 localePages=60 issues=0`.

### Intentional release-ready failure

```bash
npm run validate:tool-capability-claims -- --require-release-ready grammar-checker
```

Result: expected exit `1`; exactly one issue:

```text
en/tools/grammar-checker release-ready-enforcement-required: Required profile must use release-blocking enforcement.
Tool capability claims failed. profiles=6 localePages=60 issues=1
```

### SEO governance

```bash
npm run qa:seo-governance
```

Result: exit `0`.

- Missing keys: 0 in every non-English locale; total 0.
- TDK integrity: 5,700 combinations, 0 errors, 2,475 warnings.
- Warning breakdown: 404 title and 2,071 description warnings; 8 short and
  2,467 long.
- TDK drift: 5,700 passed, 0 failed.
- Translation corpus: 5,700 files, 0 schema errors, 0 coverage gaps, 0
  namespace issues.
- Merge chain: 0 overlap warnings, 0 resolved divergences, 0 English-fallback
  resolutions.
- Localized long-tail support: 90 files passed.
- Capability claims: 6 profiles, 60 locale pages, 0 issues.
- SEO tests: 16/16 files and 251/251 tests passed.

### Type and Astro integration check

```bash
npm run check
```

Result: exit `0`; 330 files checked; 0 errors; 0 warnings; 13 pre-existing
unused-value hints.

### Production build

```bash
npm run build
```

Result: exit `0`; Cloudflare SSR build completed. It retained six pre-existing
Vite externalization warnings for `node:fs/promises`, `node:url`, and
`node:path` (each emitted twice). Inspector port `9229` was occupied, so the
build used `9230`. Neither condition blocked the build.

### Inventory SSR isolation

```bash
npm run preview -- --host 127.0.0.1 --port 4327
npm run validate:tool-page-render-contract -- --base-url http://127.0.0.1:4327 --filter grammar-checker
```

Result: exit `0`; 1 route checked, 1 passed, 0 failed.

A direct request returned HTTP `200`, `175982` bytes, and none of
`data-tool-capability`, `data-capability-version`, or `data-local-processing`.
After `Ctrl-C`, a follow-up probe reported `server_stopped=yes`.

### Whitespace

```bash
git diff --check
```

Result: exit `0`; no output.

## Current Limitations

- No pilot is release-ready; all evidence associations remain empty by design.
- A future promotion must add real passing behavior tests with exact capability
  markers before changing enforcement to `release-blocking`; the required
  release-ready command will execute every referenced test automatically.
- Non-pilot legacy tools remain non-blocking.
- The production lane remains closed independently of repository gate status.

The local `.superpowers/sdd/final-fix-report.md` report is intentionally ignored
and absent from the Git index; no `.superpowers/` path is part of the baseline
commit.

## Recorded Minor Findings

- `src/lib/content-trust.js` still uses the entire field for profile-generated
  excerpts rather than a focused match window.
- `defineToolCapabilityProfile` still shallow-freezes profiles; nested
  structures remain mutable.

Neither Minor was required to resolve the Important findings, so both remain
recorded and non-merge-blocking.
