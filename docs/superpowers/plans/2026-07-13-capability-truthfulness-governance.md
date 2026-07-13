# Capability Truthfulness Governance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the capability source of truth and CI gates that keep tool behavior, localized claims, page disclosures, structured data, and release readiness aligned for the six recovery pilots.

**Architecture:** One typed profile per governed tool records current behavior and evidence. A resolver feeds an SSR capability/privacy disclosure and a claim scanner. Existing message files remain the source of human copy; profiles constrain what that copy may claim. The existing content-trust fallback remains active and receives profile-based issues instead of duplicating fixed per-tool rules indefinitely.

**Tech Stack:** TypeScript, Astro, Vitest, localized JSON messages, existing `content-trust.js`, `loadToolPageMessages`, repository validation scripts.

**Global Constraints:** Start profiles from current production behavior, not planned behavior; inventory profiles may constrain claims but cannot render public capability disclosures or pass a release-ready gate; promote a profile to release-blocking only when matching public-behavior tests pass; keep non-pilot legacy tools non-blocking; resolve every user-visible capability label from localized message files; distinguish language-neutral tools from language-limited engines; do not deploy before the master plan opens the production lane.

---

## File Map

**Create:**

- `src/config/tool-capabilities/types.ts`
- `src/config/tool-capabilities/define-profile.ts`
- `src/config/tool-capabilities/profiles/hex-editor.ts`
- `src/config/tool-capabilities/profiles/sql-query-optimizer.ts`
- `src/config/tool-capabilities/profiles/excel-viewer.ts`
- `src/config/tool-capabilities/profiles/grammar-checker.ts`
- `src/config/tool-capabilities/profiles/typing-speed-test.ts`
- `src/config/tool-capabilities/profiles/gantt-chart-generator.ts`
- `src/config/tool-capabilities/index.ts`
- `src/config/tool-capabilities/index.test.ts`
- `src/lib/tool-capability-claims.ts`
- `src/lib/tool-capability-claims.test.ts`
- `src/components/tools/ToolCapabilityDisclosure.astro`
- `scripts/validation/validate-tool-capability-claims.ts`
- `scripts/validation/validate-tool-capability-claims.test.ts`

**Modify:**

- `src/lib/content-trust.js`
- `src/lib/support-content-fallback.test.ts`
- `src/pages/[locale]/tools/[slug].astro`
- `src/messages/en/base.json`
- `src/messages/zh/base.json`
- `src/messages/ja/base.json`
- `src/messages/ko/base.json`
- `src/messages/es/base.json`
- `src/messages/pt/base.json`
- `src/messages/fr/base.json`
- `src/messages/de/base.json`
- `src/messages/ru/base.json`
- `src/messages/ar/base.json`
- `scripts/validation/tool-page-render-contract.ts`
- `scripts/validation/tool-page-render-contract.test.ts`
- `package.json`

## Task 1: Define The Capability Contract And Register Inventory Profiles

**Files:**
- Create: `src/config/tool-capabilities/types.ts`
- Create: `src/config/tool-capabilities/define-profile.ts`
- Create: six files under `src/config/tool-capabilities/profiles/`
- Create: `src/config/tool-capabilities/index.ts`
- Create: `src/config/tool-capabilities/index.test.ts`

- [ ] **Step 1: Write the contract test first**

Create `src/config/tool-capabilities/index.test.ts` with the initial registry test:

```ts
import { describe, expect, it } from 'vitest';
import { locales } from '@/lib/i18n';
import { getToolCapabilityProfile, PILOT_TOOL_SLUGS } from './index';

describe('pilot tool capability registry', () => {
  it('resolves exactly the six approved pilot profiles', () => {
    expect(PILOT_TOOL_SLUGS).toEqual([
      'grammar-checker',
      'hex-editor',
      'sql-query-optimizer',
      'excel-viewer',
      'typing-speed-test',
      'gantt-chart-generator',
    ]);

    for (const slug of PILOT_TOOL_SLUGS) {
      const profile = getToolCapabilityProfile(slug);
      expect(profile?.slug).toBe(slug);
      expect(profile?.version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(profile?.enforcement).toBe('inventory');
      expect(profile?.forbiddenClaims.length).toBeGreaterThan(0);
      expect(profile?.supportedLocales.ui).toEqual(locales);
    }
  });

  it('does not invent a blocking profile for unrelated legacy tools', () => {
    expect(getToolCapabilityProfile('json-formatter')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run the test and confirm the missing-module failure**

```bash
npx vitest run src/config/tool-capabilities/index.test.ts
```

Expected: FAIL because the capability registry does not exist.

- [ ] **Step 3: Create the shared types**

Create `src/config/tool-capabilities/types.ts`:

```ts
import type { Locale } from '@/lib/i18n';

export type ToolRuntime = 'browser' | 'optional-server';
export type ToolCapabilityEnforcement = 'inventory' | 'release-blocking';

export interface CapabilityMode {
  id: string;
  labelKey: string;
  runtime: ToolRuntime;
}

export interface CapabilityValue {
  id: string;
  labelKey: string;
}

export interface CapabilityFeature {
  id: string;
  labelKey: string;
  evidenceTest: string;
}

export interface ForbiddenCapabilityClaim {
  code: string;
  pattern: RegExp;
  reason: string;
}

export interface ToolCapabilityProfile {
  slug: string;
  version: string;
  enforcement: ToolCapabilityEnforcement;
  modes: readonly CapabilityMode[];
  acceptedInputs: readonly CapabilityValue[];
  producedOutputs: readonly CapabilityValue[];
  supportedLocales: {
    ui: readonly Locale[];
    engine:
      | { kind: 'language-neutral' }
      | {
          kind: 'engine-limited';
          local: readonly Locale[];
          optionalServer: readonly Locale[];
        };
  };
  browserOnlyFeatures: readonly CapabilityFeature[];
  optionalServerFeatures: readonly CapabilityFeature[];
  limits: readonly CapabilityValue[];
  forbiddenClaims: readonly ForbiddenCapabilityClaim[];
  targetSearchIntents: readonly string[];
  evidenceTests: readonly string[];
}
```

- [ ] **Step 4: Add a definition helper that rejects malformed profiles**

Create `src/config/tool-capabilities/define-profile.ts`:

```ts
import type { ToolCapabilityProfile } from './types';

const SEMVER = /^\d+\.\d+\.\d+$/;

export function defineToolCapabilityProfile(
  profile: ToolCapabilityProfile
): ToolCapabilityProfile {
  if (!profile.slug || !SEMVER.test(profile.version)) {
    throw new Error(`Invalid capability profile identity: ${profile.slug}@${profile.version}`);
  }
  if (profile.enforcement === 'release-blocking' && profile.evidenceTests.length === 0) {
    throw new Error(`${profile.slug}: release-blocking profiles require behavior evidence`);
  }
  if (profile.forbiddenClaims.length === 0) {
    throw new Error(`${profile.slug}: at least one forbidden claim is required`);
  }
  return Object.freeze(profile);
}
```

- [ ] **Step 5: Add the six current-state inventory profiles**

Create one profile module per pilot. Every profile starts at version `1.0.0` with `enforcement: 'inventory'`, all ten UI locales, no optional server feature, stable intent IDs, localized `labelKey` values for every visible mode/input/output/feature/limit, forbidden-claim patterns, and an empty `evidenceTests` list. Empty evidence is permitted only while the profile remains inventory.

Use these current-state contracts:

| Slug | Engine support | Current browser capabilities | Required current limits |
|---|---|---|---|
| `grammar-checker` | engine-limited: local `en` | English local rules, highlights, individual/all fixes | no native non-English checking, AI, or server processing |
| `hex-editor` | language-neutral | text-to-hex, hex-to-text, clipboard copy | no file open, offset grid, direct byte editing, or file export |
| `sql-query-optimizer` | engine-limited: local `en` | static heuristics, score, SQL formatting, general index candidates | no DB selector, EXPLAIN parser, connection, execution, or guaranteed speed |
| `excel-viewer` | language-neutral | XLS/XLSX open, sheet tabs, row table, sort, filter | no macros, formula recalculation, charts, full formatting fidelity, or export |
| `typing-speed-test` | engine-limited: all ten prompt locales | difficulty prompt banks, completion WPM/accuracy/duration | no fixed timer, CPM, consistency, history, account, or ranking |
| `gantt-chart-generator` | language-neutral | task name/dates/progress, theme, PNG/SVG export | no dependencies, milestones, critical path, persistence, data import/export, or collaboration |

For Hex Editor, preserve these existing forbidden claim codes:

```ts
[
  'hex-editor-grid-claim',
  'hex-editor-byte-edit-claim',
  'hex-editor-unsupported-encoding-claim',
  'hex-editor-file-export-claim',
]
```

- [ ] **Step 6: Create the registry**

Create `src/config/tool-capabilities/index.ts` with `PILOT_TOOL_SLUGS`, a profile map, `getToolCapabilityProfile`, and `getPilotToolCapabilityProfiles`. Keep the approved release order: Grammar, Hex, SQL, Excel, Typing, Gantt.

- [ ] **Step 7: Run the test and reach green**

```bash
npx vitest run src/config/tool-capabilities/index.test.ts
```

Expected: PASS. The test must also prove that an unrelated legacy slug resolves to `undefined`, visible fields contain message keys rather than English sentences, language-neutral profiles do not declare fake engine locales, and no inventory profile is treated as release-ready.

- [ ] **Step 8: Commit the green contract and inventory registry**

```bash
git add src/config/tool-capabilities
git commit -m "feat: add pilot capability inventory"
```

## Task 2: Add Profile-Based Claim Assessment

**Files:**
- Create: `src/lib/tool-capability-claims.ts`
- Create: `src/lib/tool-capability-claims.test.ts`
- Modify: `src/lib/content-trust.js`
- Modify: `src/lib/support-content-fallback.test.ts`

- [ ] **Step 1: Write failing claim-assessment tests**

The test must cover:

```ts
import { describe, expect, it } from 'vitest';
import { assessToolCapabilityClaims } from './tool-capability-claims';

describe('assessToolCapabilityClaims', () => {
  it('blocks native Russian grammar claims while the engine is English-only', () => {
    const report = assessToolCapabilityClaims({
      slug: 'grammar-checker',
      locale: 'ru',
      text: 'Проверяет русскую грамматику, орфографию и пунктуацию.',
    });
    expect(report.issues.map((issue) => issue.code)).toContain(
      'grammar-checker-native-non-english-claim'
    );
  });

  it('allows explicit English-input disclosure on a Russian UI page', () => {
    const report = assessToolCapabilityClaims({
      slug: 'grammar-checker',
      locale: 'ru',
      text: 'Интерфейс переведен на русский язык, но локальная проверка предназначена для английского текста.',
    });
    expect(report.issues).toEqual([]);
  });

  it('does not block a non-governed legacy tool', () => {
    expect(assessToolCapabilityClaims({
      slug: 'json-formatter',
      locale: 'en',
      text: 'Format JSON in your browser.',
    }).issues).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test and confirm failure**

```bash
npx vitest run src/lib/tool-capability-claims.test.ts
```

Expected: FAIL because the assessment module does not exist.

- [ ] **Step 3: Implement the pure scanner**

`assessToolCapabilityClaims` returns:

```ts
export interface ToolCapabilityClaimIssue {
  code: string;
  message: string;
}

export interface ToolCapabilityClaimReport {
  governed: boolean;
  issues: ToolCapabilityClaimIssue[];
}
```

It resolves the profile, tests every `forbiddenClaims.pattern` against the supplied flattened text, and returns no issues for unprofiled tools. Regex instances with `g` or `y` flags must have `lastIndex` reset before testing.

- [ ] **Step 4: Compose the scanner into existing content trust**

Modify `src/lib/content-trust.js` so `assessSupportContentTrust` appends profile issues after its current static issues. Preserve all existing issue codes during the migration. Do not remove the existing Hex, Gantt, or SQL rules in this task; first prove equivalent profile coverage.

- [ ] **Step 5: Add equivalence tests to `support-content-fallback.test.ts`**

Add tests for:

- Russian native-language Grammar Checker overclaim.
- Excel macro/full-fidelity overclaim.
- Typing leaderboard/certificate overclaim.
- Existing Hex, Gantt, and SQL cases still returning their current codes.

- [ ] **Step 6: Run focused trust tests**

```bash
npx vitest run src/lib/tool-capability-claims.test.ts src/lib/support-content-fallback.test.ts
```

Expected: PASS with all legacy assertions retained.

- [ ] **Step 7: Commit the assessment layer**

```bash
git add src/lib/tool-capability-claims.ts src/lib/tool-capability-claims.test.ts src/lib/content-trust.js src/lib/support-content-fallback.test.ts
git commit -m "feat: enforce capability claims in content trust"
```

## Task 3: Add Localized Capability Vocabulary And Conditional Disclosure

**Files:**
- Create: `src/components/tools/ToolCapabilityDisclosure.astro`
- Modify: `src/pages/[locale]/tools/[slug].astro`
- Modify: ten `src/messages/{en,zh,ja,ko,es,pt,fr,de,ru,ar}/base.json` files
- Modify: `scripts/validation/tool-page-render-contract.ts`
- Modify: `scripts/validation/tool-page-render-contract.test.ts`

- [ ] **Step 1: Add localized disclosure labels**

Under `tools.capabilityDisclosure` in each base file, add localized section labels. Under each pilot tool's split message file, add localized values for every profile `labelKey` used by its modes, inputs, outputs, features, limits, and language disclosure.

The shared section labels are:

```json
{
  "title": "What this tool does",
  "runsLocally": "Runs locally in your browser",
  "optionalServer": "Optional server processing",
  "acceptedInputs": "Accepted inputs",
  "producedOutputs": "Produced outputs",
  "supportedLanguage": "Supported checking language",
  "limits": "Current limits",
  "privacyLocal": "Your input stays in this browser for the local mode.",
  "privacyServer": "Server processing only starts after you explicitly request it."
}
```

Translate every value; localized pages must not fall back to English labels.

- [ ] **Step 2: Create the Astro disclosure component**

Use this public API:

```ts
interface Props {
  profile: ToolCapabilityProfile;
  locale: Locale;
  messages: Record<string, unknown>;
}
```

Resolve every visible value through `messages` using its `labelKey`. Render `data-tool-capability={profile.slug}`, `data-capability-version={profile.version}`, and `data-local-processing="true"`. Render mode, input, output, limits, and privacy copy. For `language-neutral`, render the localized language-neutral label instead of a locale list. For `engine-limited`, render the supported local-engine languages. Render optional-server disclosure only when `optionalServerFeatures.length > 0`.

- [ ] **Step 3: Integrate the disclosure before the interactive island**

In `src/pages/[locale]/tools/[slug].astro`:

```ts
import ToolCapabilityDisclosure from '@/components/tools/ToolCapabilityDisclosure.astro';
import { getToolCapabilityProfile } from '@/config/tool-capabilities';

const capabilityProfile = getToolCapabilityProfile(tool.slug);
const publicCapabilityProfile = capabilityProfile?.enforcement === 'release-blocking'
  ? capabilityProfile
  : undefined;
```

Render the component immediately before the `ToolWrapper` card only when `publicCapabilityProfile` exists. Inventory profiles continue to constrain claim validation but never render a public disclosure. Do not render an empty disclosure for legacy tools.

- [ ] **Step 4: Extend the rendered contract**

Add optional fields to `ToolPageRenderExpectation`:

```ts
expectedCapabilitySlug?: string;
expectedCapabilityVersion?: string;
expectedLocalProcessing?: boolean;
```

Add extractor/comparator tests using an enforced fixture profile, and add a negative route expectation proving an inventory profile does not render disclosure attributes. Individual pilot routes are added to `TOOL_PAGE_RENDER_MATRIX` when their product task promotes the profile to `release-blocking`. The Grammar task adds `en/grammar-checker` and `ru/grammar-checker`, with a Russian body sentinel explicitly saying the checker processes English text.

- [ ] **Step 5: Run component and render-contract tests**

```bash
npx vitest run scripts/validation/tool-page-render-contract.test.ts
npm run build
```

Expected: PASS; built HTML does not expose inventory profiles, while component/contract fixtures prove enforced profiles render localized capability attributes correctly.

- [ ] **Step 6: Commit the disclosure**

```bash
git add src/components/tools/ToolCapabilityDisclosure.astro src/pages/'[locale]'/tools/'[slug].astro src/messages scripts/validation/tool-page-render-contract.ts scripts/validation/tool-page-render-contract.test.ts
git commit -m "feat: disclose pilot capabilities and privacy"
```

## Task 4: Add The Repository Claim And Release-Readiness Validator

**Files:**
- Create: `scripts/validation/validate-tool-capability-claims.ts`
- Create: `scripts/validation/validate-tool-capability-claims.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Write failing validator tests**

Export pure functions from the script:

```ts
export interface CapabilityValidationIssue {
  locale: Locale;
  slug: string;
  code: string;
  message: string;
}

export function flattenToolMessages(messages: Record<string, unknown>): string;
export function validateCapabilityMessageMatrix(
  rows: Array<{ locale: Locale; slug: string; messages: Record<string, unknown> }>
): CapabilityValidationIssue[];
export function validateReleaseReadyProfiles(
  profiles: readonly ToolCapabilityProfile[],
  fileExists: (path: string) => boolean,
  labelResolves: (profile: ToolCapabilityProfile, locale: Locale, labelKey: string) => boolean
): CapabilityValidationIssue[];
```

Test that `seo_title`, `seo_description`, `description`, `detailed_description`, usage steps/examples, and FAQ question/answers are scanned. Test a clean English disclosure and failing Russian native-language claim. Test that inventory profiles may have no evidence, while release-blocking profiles fail when an evidence path is absent or when a visible `labelKey` is unresolved in any UI locale.

- [ ] **Step 2: Run and confirm failure**

```bash
npx vitest run scripts/validation/validate-tool-capability-claims.test.ts
```

Expected: FAIL because the validator does not exist.

- [ ] **Step 3: Implement the CLI**

For every pilot slug and every locale in `locales`, call `loadToolPageMessages(locale, slug)` and scan the merged page messages. Print each issue as:

```text
ru/tools/grammar-checker grammar-checker-native-non-english-claim: native Russian checking is not implemented
```

Print the pass summary as:

```text
Tool capability claims passed. profiles=6 localePages=60 issues=0
```

Set `process.exitCode = 1` when any issue exists.

The default CLI validates claims for all six profiles and validates evidence only for profiles already marked `release-blocking`. Support `--require-release-ready grammar-checker` so a pilot release can prove the named profile is enforced, its behavior-test files exist, and all public label keys resolve before deployment.

- [ ] **Step 4: Add package scripts**

Add:

```json
"validate:tool-capability-claims": "node --import tsx/esm scripts/validation/validate-tool-capability-claims.ts"
```

Append `npm run validate:tool-capability-claims` to `qa:seo-governance` before the Vitest command.

- [ ] **Step 5: Run the validator and fix real message violations**

```bash
npx vitest run scripts/validation/validate-tool-capability-claims.test.ts
npm run validate:tool-capability-claims
npm run qa:seo-governance
```

Expected: all commands exit `0`. Copy fixes must describe current behavior; do not weaken forbidden patterns to preserve an overclaim.

- [ ] **Step 6: Commit the validator**

```bash
git add scripts/validation/validate-tool-capability-claims.ts scripts/validation/validate-tool-capability-claims.test.ts package.json src/messages
git commit -m "ci: validate tool capability claims"
```

## Task 5: Verify Governance As A Foundation Gate

- [ ] **Step 1: Run the complete focused suite**

```bash
npx vitest run src/config/tool-capabilities/index.test.ts src/lib/tool-capability-claims.test.ts src/lib/support-content-fallback.test.ts scripts/validation/validate-tool-capability-claims.test.ts scripts/validation/tool-page-render-contract.test.ts
npm run validate:tool-capability-claims
npm run check
npm run qa:seo-governance
npm run build
git diff --check
```

Expected: all commands exit `0`.

- [ ] **Step 2: Confirm release-blocking semantics**

Verify:

- Missing one of the six pilot inventory profiles fails the registry test.
- An unsupported pilot claim fails the validator.
- An unrelated legacy tool without a profile does not fail.
- Inventory profiles never render public disclosure markup.
- A release-blocking fixture without real evidence fails the readiness validator.
- Optional server disclosure is absent while no optional server feature is enabled.
- All ten localized disclosure label sets are non-English where applicable.

- [ ] **Step 3: Record the profile baseline**

Create a short evidence section in the implementation PR description listing all six `1.0.0` inventory profiles and stating that they are not production-release-ready. Each product pilot later records its real behavior-test paths when it promotes its profile. Do not deploy before the master checkpoint allows it.
