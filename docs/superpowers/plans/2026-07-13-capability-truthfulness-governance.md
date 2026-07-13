# Capability Truthfulness Governance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the capability source of truth and CI gates that keep tool behavior, localized claims, page disclosures, structured data, and release readiness aligned for the six recovery pilots.

**Architecture:** One typed profile per governed tool records current behavior and evidence. A resolver feeds an SSR capability/privacy disclosure and a claim scanner. Existing message files remain the source of human copy; profiles constrain what that copy may claim. The existing content-trust fallback remains active and receives profile-based issues instead of duplicating fixed per-tool rules indefinitely.

**Tech Stack:** TypeScript, Astro, Vitest, localized JSON messages, existing `content-trust.js`, `loadToolPageMessages`, repository validation scripts.

**Global Constraints:** Start profiles from current production behavior, not planned behavior; update the profile version only when matching behavior tests pass; keep non-pilot legacy tools non-blocking; do not generate marketing copy from capability profiles; do not deploy before the master plan opens the production lane.

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
- `src/config/tool-capabilities/current-state-evidence.test.ts`
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

## Task 1: Define The Capability Contract

**Files:**
- Create: `src/config/tool-capabilities/types.ts`
- Create: `src/config/tool-capabilities/define-profile.ts`

- [ ] **Step 1: Write the contract test first**

Create `src/config/tool-capabilities/index.test.ts` with the initial shape test:

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
      expect(profile?.version).toMatch(/^1\.0\.0$/);
      expect(profile?.evidenceTests.length).toBeGreaterThan(0);
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

Expected: FAIL because `src/config/tool-capabilities/index.ts` does not exist.

- [ ] **Step 3: Create the shared types**

Create `src/config/tool-capabilities/types.ts`:

```ts
import type { Locale } from '@/lib/i18n';

export type ToolRuntime = 'browser' | 'optional-server';

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
  modes: readonly CapabilityMode[];
  acceptedInputs: readonly CapabilityValue[];
  producedOutputs: readonly CapabilityValue[];
  supportedLocales: {
    ui: readonly Locale[];
    localEngine: readonly Locale[];
    optionalServerEngine: readonly Locale[];
  };
  browserOnlyFeatures: readonly CapabilityFeature[];
  optionalServerFeatures: readonly CapabilityFeature[];
  limits: readonly string[];
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
  if (profile.evidenceTests.length === 0) {
    throw new Error(`${profile.slug}: at least one evidence test is required`);
  }
  if (profile.forbiddenClaims.length === 0) {
    throw new Error(`${profile.slug}: at least one forbidden claim is required`);
  }
  return Object.freeze(profile);
}
```

- [ ] **Step 5: Commit the shared contract**

```bash
git add src/config/tool-capabilities/types.ts src/config/tool-capabilities/define-profile.ts src/config/tool-capabilities/index.test.ts
git commit -m "test: define tool capability profile contract"
```

## Task 2: Register Current-State Pilot Profiles

**Files:**
- Create: six files under `src/config/tool-capabilities/profiles/`
- Create: `src/config/tool-capabilities/index.ts`

- [ ] **Step 1: Add the Hex Editor current-state profile**

Create `src/config/tool-capabilities/profiles/hex-editor.ts` with version `1.0.0`. Its only mode is `text-converter`; accepted inputs are UTF-8 text and whitespace-separated hexadecimal text; outputs are UTF-8 text and uppercase hexadecimal text. Its browser features are text-to-hex, hex-to-text, and clipboard copy. Its limits must state no file open, no offset grid, no direct byte editing, and no modified-file export.

Use these forbidden claim codes:

```ts
[
  'hex-editor-grid-claim',
  'hex-editor-byte-edit-claim',
  'hex-editor-unsupported-encoding-claim',
  'hex-editor-file-export-claim',
]
```

Set `evidenceTests` to `['src/config/tool-capabilities/current-state-evidence.test.ts']`. The pilot plan replaces this transitional source-and-function contract with `src/lib/hex-editor.test.ts` before the profile advances beyond current behavior.

- [ ] **Step 2: Add the remaining five current-state profiles**

Use these contracts:

| Slug | Local engine locales | Current browser capabilities | Required current limits |
|---|---|---|---|
| `grammar-checker` | `en` | English local rules, highlights, individual/all fixes | no native non-English checking, no AI, no server processing |
| `sql-query-optimizer` | `en` | static heuristics, score, SQL formatting, general index candidates | no DB selector, EXPLAIN parser, database connection, SQL execution, guaranteed speed |
| `excel-viewer` | all UI locales; file semantics are language-neutral | XLS/XLSX open, sheet tabs, row table, sort, filter | no macro execution, formula recalculation, charts, full formatting fidelity, export |
| `typing-speed-test` | all UI locales | difficulty prompt banks, completion-based WPM/accuracy/duration | no fixed timed mode, CPM, consistency, history, account, ranking |
| `gantt-chart-generator` | all UI locales | task name/dates/progress, chart theme, PNG/SVG export | no dependencies, milestones, critical path, persistence, import/export data, collaboration |

Every profile uses all ten locales for `supportedLocales.ui`, no optional server locales, and one behavior-test path in `evidenceTests`.

- [ ] **Step 3: Add a transitional current-state evidence test**

Create `src/config/tool-capabilities/current-state-evidence.test.ts`. Import and exercise `checkGrammar`, `optimizeSQL`, and `calculateTypingStats`. Read the current Hex, Excel, and Gantt Svelte sources and assert only their current controls are present. The test must lock the six `1.0.0` profiles to the current production baseline and explicitly fail if a profile claims a feature not visible in its component or pure function.

The product pilot plan replaces these source assertions with pure behavior tests as each tool version advances. Do not keep a source assertion as the only evidence for a `2.x` profile.

- [ ] **Step 4: Create the registry**

Create `src/config/tool-capabilities/index.ts`:

```ts
import type { ToolCapabilityProfile } from './types';
import { grammarCheckerCapability } from './profiles/grammar-checker';
import { hexEditorCapability } from './profiles/hex-editor';
import { sqlQueryOptimizerCapability } from './profiles/sql-query-optimizer';
import { excelViewerCapability } from './profiles/excel-viewer';
import { typingSpeedTestCapability } from './profiles/typing-speed-test';
import { ganttChartGeneratorCapability } from './profiles/gantt-chart-generator';

export type { ToolCapabilityProfile } from './types';

export const PILOT_TOOL_SLUGS = [
  'grammar-checker',
  'hex-editor',
  'sql-query-optimizer',
  'excel-viewer',
  'typing-speed-test',
  'gantt-chart-generator',
] as const;

const PROFILES = new Map<string, ToolCapabilityProfile>([
  [grammarCheckerCapability.slug, grammarCheckerCapability],
  [hexEditorCapability.slug, hexEditorCapability],
  [sqlQueryOptimizerCapability.slug, sqlQueryOptimizerCapability],
  [excelViewerCapability.slug, excelViewerCapability],
  [typingSpeedTestCapability.slug, typingSpeedTestCapability],
  [ganttChartGeneratorCapability.slug, ganttChartGeneratorCapability],
]);

export function getToolCapabilityProfile(
  slug: string
): ToolCapabilityProfile | undefined {
  return PROFILES.get(slug);
}

export function getPilotToolCapabilityProfiles(): ToolCapabilityProfile[] {
  return PILOT_TOOL_SLUGS.map((slug) => PROFILES.get(slug)!);
}
```

- [ ] **Step 5: Run the registry tests**

```bash
npx vitest run src/config/tool-capabilities/index.test.ts src/config/tool-capabilities/current-state-evidence.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit the profiles**

```bash
git add src/config/tool-capabilities
git commit -m "feat: register pilot capability profiles"
```

## Task 3: Add Profile-Based Claim Assessment

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

## Task 4: Render Capability And Privacy Disclosure

**Files:**
- Create: `src/components/tools/ToolCapabilityDisclosure.astro`
- Modify: `src/pages/[locale]/tools/[slug].astro`
- Modify: ten `src/messages/{en,zh,ja,ko,es,pt,fr,de,ru,ar}/base.json` files
- Modify: `scripts/validation/tool-page-render-contract.ts`
- Modify: `scripts/validation/tool-page-render-contract.test.ts`

- [ ] **Step 1: Add localized disclosure labels**

Under `tools.capabilityDisclosure` in each base file, add localized strings for:

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

Render `data-tool-capability={profile.slug}`, `data-capability-version={profile.version}`, and `data-local-processing="true"`. Render mode, input, output, supported local-engine language, limits, and privacy copy. Render optional-server disclosure only when `optionalServerFeatures.length > 0`.

- [ ] **Step 3: Integrate the disclosure before the interactive island**

In `src/pages/[locale]/tools/[slug].astro`:

```ts
import ToolCapabilityDisclosure from '@/components/tools/ToolCapabilityDisclosure.astro';
import { getToolCapabilityProfile } from '@/config/tool-capabilities';

const capabilityProfile = getToolCapabilityProfile(tool.slug);
```

Render the component immediately before the `ToolWrapper` card when a profile exists. Do not render an empty disclosure for legacy tools.

- [ ] **Step 4: Extend the rendered contract**

Add optional fields to `ToolPageRenderExpectation`:

```ts
expectedCapabilitySlug?: string;
expectedCapabilityVersion?: string;
expectedLocalProcessing?: boolean;
```

Add all six English pilot routes plus `ru/grammar-checker` to `TOOL_PAGE_RENDER_MATRIX`. The Russian grammar route must include a body sentinel that explicitly says the checker processes English text.

- [ ] **Step 5: Run component and render-contract tests**

```bash
npx vitest run scripts/validation/tool-page-render-contract.test.ts
npm run build
```

Expected: PASS; built HTML contains the capability attributes for the pilot pages.

- [ ] **Step 6: Commit the disclosure**

```bash
git add src/components/tools/ToolCapabilityDisclosure.astro src/pages/'[locale]'/tools/'[slug].astro src/messages scripts/validation/tool-page-render-contract.ts scripts/validation/tool-page-render-contract.test.ts
git commit -m "feat: disclose pilot capabilities and privacy"
```

## Task 5: Add The Repository Claim Validator

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
```

Test that `seo_title`, `seo_description`, `description`, `detailed_description`, usage steps/examples, and FAQ question/answers are scanned. Test a clean English disclosure and failing Russian native-language claim.

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

## Task 6: Verify Governance As A Release Gate

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

- Missing one of the six pilot profiles fails the registry test.
- An unsupported pilot claim fails the validator.
- An unrelated legacy tool without a profile does not fail.
- Optional server disclosure is absent while no optional server feature is enabled.
- All ten localized disclosure label sets are non-English where applicable.

- [ ] **Step 3: Record the profile baseline**

Create a short evidence section in the implementation PR description listing all six `1.0.0` profiles and their behavior-test paths. Do not deploy before the master checkpoint allows it.
