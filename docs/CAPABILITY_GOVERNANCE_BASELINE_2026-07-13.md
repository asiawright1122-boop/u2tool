# Capability Governance Foundation Baseline - 2026-07-13

## Decision

Capability governance is verified as a repository foundation gate against
pre-baseline commit `9bc1b32c` (`docs: make governance baseline auditable`).
The checkpoint name follows the 2026-07-13 governance plan; all evidence below
was collected fresh on 2026-07-14 in `Asia/Shanghai`.

This is an inventory baseline, not a production release approval. None of the
six pilot profiles is production-release-ready. No deployment occurred. The
production lane remains frozen until the 2026-07-27 Day 14 decision explicitly
returns `OPEN_PRODUCT_LANE`.

## Current Profile Registry

The values below were read from `getPilotToolCapabilityProfiles()` rather than
transcribed from the implementation plan.

| Pilot profile | Version | Enforcement | Engine support | Current evidence paths |
|---|---:|---|---|---|
| `grammar-checker` | `1.0.0` | `inventory` | `engine-limited`; local `en`; optional server locales `[]` | `[]` |
| `hex-editor` | `1.0.0` | `inventory` | `language-neutral` | `[]` |
| `sql-query-optimizer` | `1.0.0` | `inventory` | `engine-limited`; local `en`; optional server locales `[]` | `[]` |
| `excel-viewer` | `1.0.0` | `inventory` | `language-neutral` | `[]` |
| `typing-speed-test` | `1.0.0` | `inventory` | `engine-limited`; local `en`, `zh`, `ja`, `ko`, `es`, `pt`, `fr`, `de`, `ru`, `ar`; optional server locales `[]` | `[]` |
| `gantt-chart-generator` | `1.0.0` | `inventory` | `language-neutral` | `[]` |

Reproducible registry query:

```bash
node --import tsx/esm --input-type=module <<'NODE'
import { getPilotToolCapabilityProfiles } from './src/config/tool-capabilities/index.ts';

for (const profile of getPilotToolCapabilityProfiles()) {
  console.log(JSON.stringify({
    slug: profile.slug,
    version: profile.version,
    enforcement: profile.enforcement,
    evidenceTests: profile.evidenceTests,
    engine: profile.supportedLocales.engine,
    optionalServerFeatureCount: profile.optionalServerFeatures.length,
    modeRuntimes: [...new Set(profile.modes.map((mode) => mode.runtime))],
  }));
}
NODE
```

Result: exit `0`; six JSON rows. Every row reported `version: "1.0.0"`,
`enforcement: "inventory"`, `evidenceTests: []`,
`optionalServerFeatureCount: 0`, and `modeRuntimes: ["browser"]`; the engine
objects match the table above.

Every profile currently has browser-only modes, zero optional-server features,
and zero top-level behavior-evidence paths. Each product pilot must record its
real behavior-test paths when it promotes its profile to `release-blocking`.

## Fresh Foundation Verification

### Focused governance suite

```bash
npx vitest run src/config/tool-capabilities/index.test.ts src/lib/tool-capability-claims.test.ts src/lib/support-content-fallback.test.ts scripts/validation/validate-tool-capability-claims.test.ts scripts/validation/tool-page-render-contract.test.ts src/components/tools/ToolCapabilityDisclosure.test.ts src/lib/tool-capability-disclosure.test.ts
```

Result: exit `0`; 7/7 test files passed; 207/207 tests passed.

### Default claims validator

```bash
npm run validate:tool-capability-claims
```

Result: exit `0`; `profiles=6 localePages=60 issues=0`.

### Type and Astro integration check

```bash
npm run check
```

Result: exit `0`; 328 files checked; 0 errors; 0 warnings; 13 hints.
The hints are the pre-existing unused-value diagnostics listed by Astro.

### SEO governance

```bash
npm run qa:seo-governance
```

Result: exit `0`.

- Missing translation keys: 0 in every non-English catalog; total 0.
- TDK integrity: 5,700 combinations, 0 errors, 2,476 non-blocking warnings.
  The warnings break down to 404 title and 2,072 description warnings; 8 are
  short and 2,468 are long.
- TDK drift: 5,700 passed, 0 failed.
- Translation corpus: 5,700 files, 0 schema errors, 0 coverage gaps, and 0
  namespace issues.
- Merge-chain consistency: 0 overlap warnings, 0 resolved divergences, and 0
  English-fallback resolutions.
- Localized long-tail support: 90 files passed.
- Capability claims within the governance chain: 6 profiles, 60 locale pages,
  0 issues.
- SEO governance tests: 16/16 files and 251/251 tests passed.

### Production build

```bash
npm run build
```

Result: exit `0`; the Cloudflare SSR server build completed. The build retained
six pre-existing Vite externalization warnings: the same three
`src/lib/translations.ts` imports (`node:fs/promises`, `node:url`, and
`node:path`) were reported twice. It also reported that inspector port `9229`
was occupied and used `9230`; neither condition blocked the build.

### Whitespace check

```bash
git diff --check
```

Result: exit `0`; no output.

## Release-Blocking Semantics

```bash
npx vitest run src/config/tool-capabilities/index.test.ts src/lib/tool-capability-claims.test.ts scripts/validation/validate-tool-capability-claims.test.ts scripts/validation/tool-page-render-contract.test.ts src/components/tools/ToolCapabilityDisclosure.test.ts src/lib/tool-capability-disclosure.test.ts --reporter verbose -t 'resolves exactly the six approved pilot profiles|does not invent a blocking profile for unrelated legacy tools|preserves the governed issue for a native Russian grammar claim|does not block a non-governed legacy tool|keeps an inventory pilot route free of public capability attributes|requires non-empty top-level evidence for release-blocking profiles|requires every named top-level and feature evidence file to exist|resolves every visible profile and shared disclosure label from each locale catalog|renders an engine-limited profile with localized attributes, language, and privacy copy|builds an engine-limited disclosure entirely from localized messages'
```

Result: exit `0`; 6/6 test files passed; 10/10 selected assertions passed; 53
unrelated tests skipped. Together with the complete 207-test run, this
confirmed:

- The registry asserts the exact six approved pilot slugs and resolves each
  one, so removing any pilot fails the exact-set/lookup contract.
- A native Russian Grammar Checker claim produces the governed
  `grammar-checker-native-non-english-claim` validator issue.
- An unrelated legacy tool without a profile remains non-blocking.
- Inventory routes require zero public capability-disclosure elements.
- A release-blocking fixture with empty top-level evidence fails with
  `release-ready-evidence-required`, and a named missing evidence file fails
  with `release-ready-evidence-file-missing`.
- The real disclosure builder and component omit optional-server disclosure
  while `optionalServerFeatures` is empty.
- Every locale has 20/20 direct capability-disclosure labels with zero missing
  strings. Each of `zh`, `ja`, `ko`, `es`, `pt`, `fr`, `de`, `ru`, and `ar`
  has zero strings unchanged from the English set.

### Direct localization audit

```bash
node --import tsx/esm --input-type=module <<'NODE'
import { locales } from './src/lib/i18n.ts';
import { readMessageFile } from './src/lib/translations.ts';

function flatten(value, prefix = '', out = {}) {
  for (const [key, item] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof item === 'string') out[path] = item;
    else if (item && typeof item === 'object' && !Array.isArray(item)) {
      flatten(item, path, out);
    }
  }
  return out;
}

const english = flatten(
  (await readMessageFile('en/base.json')).tools.capabilityDisclosure,
);
for (const locale of locales) {
  const current = flatten(
    (await readMessageFile(`${locale}/base.json`)).tools.capabilityDisclosure,
  );
  const missing = Object.keys(english).filter(
    (key) => typeof current[key] !== 'string' || current[key].trim() === '',
  );
  const unchangedFromEnglish = locale === 'en'
    ? []
    : Object.keys(english).filter((key) => current[key] === english[key]);
  console.log(JSON.stringify({
    locale,
    labelCount: Object.keys(current).length,
    missing,
    unchangedFromEnglish,
  }));
}
NODE
```

Result: exit `0`; all ten locale rows reported `labelCount: 20` and
`missing: []`. Every non-English row also reported
`unchangedFromEnglish: []`.

## Intentional Release-Ready Failure

```bash
npm run validate:tool-capability-claims -- --require-release-ready grammar-checker
```

Result: expected exit `1`; 6 profiles, 60 locale pages, 1 issue:

```text
en/tools/grammar-checker release-ready-enforcement-required: Required profile must use release-blocking enforcement.
Tool capability claims failed. profiles=6 localePages=60 issues=1
```

This intentional failure proves that `grammar-checker` is not release-ready;
it is not a failure of the inventory foundation gate. The production lane
remains closed independently by the 2026-07-27 Day 14 policy.

## Real Inventory-Page Isolation

A local SSR preview was started at `http://127.0.0.1:4327`, verified, and then
stopped cleanly. In terminal 1, start and keep the preview running:

```bash
npm run preview -- --host 127.0.0.1 --port 4327
```

In terminal 2, run the render contract:

```bash
npm run validate:tool-page-render-contract -- --base-url http://127.0.0.1:4327 --filter grammar-checker
```

Result: exit `0`; 1 route checked, 1 passed, 0 failed for
`en/grammar-checker`.

Direct response check:

```bash
html_file=$(mktemp -t u2tool-grammar-checker)
trap 'rm -f "$html_file"' EXIT
curl -fsS -o "$html_file" -w 'http_status=%{http_code}\n' http://127.0.0.1:4327/en/tools/grammar-checker/
for attribute in data-tool-capability data-capability-version data-local-processing; do
  if rg -q "$attribute" "$html_file"; then
    printf '%s=present\n' "$attribute"
    exit 1
  fi
  printf '%s=absent\n' "$attribute"
done
printf 'html_bytes=%s\n' "$(wc -c < "$html_file" | tr -d ' ')"
```

Result: exit `0`:

```text
http_status=200
data-tool-capability=absent
data-capability-version=absent
data-local-processing=absent
html_bytes=175982
```

The response therefore contained none of:

- `data-tool-capability`
- `data-capability-version`
- `data-local-processing`

After stopping the preview with `Ctrl-C`, the following command verified that
the server was no longer reachable:

```bash
if curl -fsS --max-time 2 http://127.0.0.1:4327/ >/dev/null 2>&1; then
  printf 'server_stopped=no\n'
  exit 1
else
  printf 'server_stopped=yes\n'
fi
```

Result: exit `0`; `server_stopped=yes`.

## Remaining Non-Blocking Concern

The known Task 2 Minor remains: profile-generated content-trust excerpts use
the full content entry instead of a focused match window. This does not weaken
claim detection or this foundation gate, but a later refinement may add matched
offsets without changing the public scanner contract.

## Release Constraint

No profile may be called production-release-ready until it uses
`release-blocking` enforcement, names existing real behavior-test paths at the
top level and for every visible feature, resolves all required localized
labels without fallback, passes the release-ready validator, and passes its
render contract. Even then, no pilot may deploy before the 2026-07-27 Day 14
checkpoint explicitly opens the production lane.
