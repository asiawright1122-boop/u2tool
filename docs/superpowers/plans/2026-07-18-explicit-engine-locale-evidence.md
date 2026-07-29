# Explicit Engine-Locale Evidence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace brittle AST/regex locale-evidence inference with explicit profile-owned engine-locale contracts, direct data-source validation, exact behavior-test execution, and centralized capability-claim semantics.

**Architecture:** Engine-limited capability profiles declare one typed evidence contract per supported engine locale. The locale validator validates those declared data sources directly, executes exact evidence tests through the existing repository runner, and resolves one explicit disclosure label. The central capability claim taxonomy runs a separate bounded best-effort unsupported-language lint; the locale validator does not consume those findings or map them to a blocking issue. It does not inspect matcher syntax, trace arbitrary test variables, or implement its own page-wide claim detector.

**Tech Stack:** TypeScript, Vitest, Astro capability profiles, localized JSON messages, existing capability evidence runner, existing capability claim taxonomy.

## Global Constraints

- Never write to `robots.txt`, meta robots, canonical, hreflang, redirects, sitemap files, or production indexation metadata.
- Missing or invalid engine-locale evidence fails closed as `missing-fixtures` in the completed implementation. During Tasks 1–2 only, `defineToolCapabilityProfile` may expose one clearly named temporary compatibility input for the three not-yet-migrated engine-limited profiles; Task 3 must delete it and add a regression proving omitted contract fields fail closed before Task 3 is committed.
- The public `validateToolLocaleCapability({ locale, slug, mergedMessages, evidenceTests })` interface remains available for synchronous message-only disclosure checks; repository data and exact-test checks stay in the async runner.
- Language-neutral profiles remain unchanged and never require locale evidence contracts.
- Do not fabricate empty locale fixtures or claim unsupported product languages.
- Do not add a second unsupported-language taxonomy inside the locale validator.
- Preserve the exact capability-evidence marker and runnable-test gate.
- Keep the unrelated `docs/COMPETITOR_RESEARCH_2026-07-15.md` untouched, unstaged, and uncommitted.
- Do not deploy, push, merge, or modify active Spanish chart recovery controls.

---

## File Map

**Modify:**

- `src/config/tool-capabilities/types.ts` — explicit engine-locale evidence types.
- `src/config/tool-capabilities/define-profile.ts` — profile contract validation and normalization.
- `src/config/tool-capabilities/index.test.ts` — schema, coverage, and immutability tests.
- `src/config/tool-capabilities/profiles/grammar-checker.ts` — fixture-object contract.
- `src/config/tool-capabilities/profiles/sql-query-optimizer.ts` — behavior-test contract and SQL native-diagnostics claim code.
- `src/config/tool-capabilities/profiles/typing-speed-test.ts` — ten message-prompt-bank contracts.
- `src/lib/grammar-rules.test.ts` — exact fixture-backed Grammar engine evidence.
- `src/lib/tool-capability-claim-taxonomy.ts` — centralized clause-level unsupported-language semantics.
- `src/lib/tool-capability-claims.test.ts` — adversarial claim regressions.
- `scripts/validation/validate-tool-locale-capability.ts` — direct contract validator; remove AST inference.
- `scripts/validation/validate-tool-locale-capability.test.ts` — contract/data/execution/disclosure integration tests.

**Keep unchanged:**

- `package.json` — Task 3 scripts are already installed.
- Grammar fixture files and localized message content unless a test proves a current explicit label is missing.
- Language-neutral profiles.

**Documentation already written:**

- `docs/superpowers/specs/2026-07-18-explicit-engine-locale-evidence-design.md`
- `docs/superpowers/plans/2026-07-18-explicit-engine-locale-evidence.md`

## Starting Worktree State

The worktree begins with uncommitted edits in the two locale-validator files from the rejected AST approach. Preserve them until Task 5, then replace the heuristic sections through focused patches. Do not stage or commit those two files in Tasks 1–4, except Task 2 may update only the stale `flattenProfileEvidenceTestFiles` expectation that still names Grammar's former engine-evidence file; no validator production logic may change before Task 5.

---

### Task 1: Add The Explicit Profile Contract

**Files:**

- Modify: `src/config/tool-capabilities/types.ts`
- Modify: `src/config/tool-capabilities/define-profile.ts`
- Modify: `src/config/tool-capabilities/index.test.ts`

**Interfaces:**

- Produces: `EngineLocaleDataEvidence`, `EngineLocaleEvidenceContract`, `EngineLanguageDisclosureContract`.
- Produces: engine-limited `localeEvidence` and `disclosure` profile fields consumed by Tasks 2–5.

- [ ] **Step 1: Add failing definition tests**

Add tests to `src/config/tool-capabilities/index.test.ts` that construct a minimal release-blocking engine-limited profile and assert:

```ts
expect(() => defineToolCapabilityProfile({
  ...profile,
  supportedLocales: {
    ui: ['en', 'ru'],
    engine: {
      kind: 'engine-limited',
      local: ['en'],
      optionalServer: [],
      evidence,
      localeEvidence: [],
      disclosure: {
        labelKey: 'tools.example.capabilities.limits.englishOnly',
        unsupportedLocaleClaimCodes: ['example-native-language-claim'],
      },
    },
  },
})).toThrow('example: engine locale en requires exactly one locale evidence contract');
```

Add one test each for duplicate locale contracts, undeclared locales, `runtime` mismatch, empty disclosure key, a disclosure key outside `tools.<slug>.*`, an empty/unknown claim code, invalid or traversal data paths, non-positive/non-integer minimums, an empty message path, a prompt template without exactly one `{locale}` token, and locale-only fields on a language-neutral profile.

- [ ] **Step 2: Run the schema tests and confirm RED**

Run:

```bash
npx vitest run src/config/tool-capabilities/index.test.ts -t "engine locale evidence contract"
```

Expected: FAIL because the new fields and definition checks do not exist.

- [ ] **Step 3: Add the profile types**

Add to `src/config/tool-capabilities/types.ts`:

```ts
export type EngineLocaleDataEvidence =
  | {
      kind: 'fixture-object';
      file: string;
      exportName: string;
      minimumNonEmptyValues: number;
    }
  | {
      kind: 'message-prompt-bank';
      fileTemplate: string;
      messagePath: readonly string[];
      minimumNonEmptyEntries: number;
    }
  | {
      kind: 'behavior-test';
    };

export interface EngineLocaleEvidenceContract {
  locale: Locale;
  runtime: 'local' | 'optional-server';
  evidence: CapabilityEvidenceReference;
  data: EngineLocaleDataEvidence;
}

export interface EngineLanguageDisclosureContract {
  labelKey: string;
  unsupportedLocaleClaimCodes: readonly string[];
}
```

Extend only the `engine-limited` branch:

```ts
localeEvidence: readonly EngineLocaleEvidenceContract[];
disclosure: EngineLanguageDisclosureContract;
```

- [ ] **Step 4: Validate the contract in `defineToolCapabilityProfile`**

Add a focused helper:

```ts
function validateEngineLocaleEvidence(profile: ToolCapabilityProfile): void {
  const engine = profile.supportedLocales.engine;
  if (engine.kind === 'language-neutral') return;

  const declared = [
    ...engine.local.map((locale) => ({ locale, runtime: 'local' as const })),
    ...engine.optionalServer.map((locale) => ({ locale, runtime: 'optional-server' as const })),
  ];

  for (const expected of declared) {
    const matches = engine.localeEvidence.filter(({ locale }) => locale === expected.locale);
    if (matches.length !== 1) {
      throw new Error(`${profile.slug}: engine locale ${expected.locale} requires exactly one locale evidence contract`);
    }
    if (matches[0].runtime !== expected.runtime) {
      throw new Error(`${profile.slug}: engine locale ${expected.locale} has an invalid runtime`);
    }
  }

  const declaredLocales = new Set(declared.map(({ locale }) => locale));
  const extra = engine.localeEvidence.find(({ locale }) => !declaredLocales.has(locale));
  if (extra) {
    throw new Error(`${profile.slug}: locale evidence declares unsupported locale ${extra.locale}`);
  }
  if (!engine.disclosure.labelKey.trim()) {
    throw new Error(`${profile.slug}: engine language disclosure label is required`);
  }
}
```

Also validate each data-evidence discriminant: repository paths must be relative and traversal-free; fixture export names and message-path segments must be non-empty; minimums must be positive integers; prompt templates must contain exactly one `{locale}` token; disclosure keys must begin with `tools.${profile.slug}.`; and every declared unsupported-locale claim code must be non-empty, unique, and present in `profile.forbiddenClaims`.

Call the helper before returning the frozen profile. Normalize new arrays with copied frozen arrays/objects, but do not broaden into the previously recorded repository-wide deep-freeze debt.

Because Grammar, SQL, and Typing migrate in Tasks 2–3, add one explicitly named temporary legacy input accepted only when both new fields are absent. Lock that narrow transition in tests: supplying only one new field still fails, and the compatibility type/function is marked for mandatory removal in Task 3. This is migration scaffolding, not the final profile contract.

- [ ] **Step 5: Run the complete capability profile tests**

Run:

```bash
npx vitest run src/config/tool-capabilities/index.test.ts
```

Expected: PASS with all existing tests plus the new contract cases.

- [ ] **Step 6: Commit Task 1**

```bash
git add src/config/tool-capabilities/types.ts src/config/tool-capabilities/define-profile.ts src/config/tool-capabilities/index.test.ts
git commit -m "feat: define engine locale evidence contracts"
```

---

### Task 2: Migrate Grammar To Fixture-Object Evidence

**Files:**

- Modify: `src/config/tool-capabilities/profiles/grammar-checker.ts`
- Modify: `src/lib/grammar-rules.test.ts`
- Modify: `src/config/tool-capabilities/index.test.ts`
- Modify only the stale Grammar evidence-path expectation: `scripts/validation/validate-tool-locale-capability.test.ts`

**Interfaces:**

- Consumes: Task 1 `EngineLocaleEvidenceContract`.
- Produces: one `en` fixture-object contract and one exact fixture-backed engine evidence test.

- [ ] **Step 1: Write the failing Grammar profile contract test**

Add this expectation to `src/config/tool-capabilities/index.test.ts`:

```ts
expect(getToolCapabilityProfile('grammar-checker')?.supportedLocales.engine).toMatchObject({
  kind: 'engine-limited',
  local: ['en'],
  optionalServer: [],
  localeEvidence: [{
    locale: 'en',
    runtime: 'local',
    data: {
      kind: 'fixture-object',
      file: 'src/lib/fixtures/grammar-checker/en.ts',
      exportName: 'grammarCheckerEnglishFixtures',
      minimumNonEmptyValues: 6,
    },
  }],
  disclosure: {
    labelKey: 'tools.grammar-checker.capabilities.limits.englishOnlyEngine',
    unsupportedLocaleClaimCodes: ['grammar-checker-native-non-english-claim'],
  },
});
```

- [ ] **Step 2: Run the Grammar profile test and confirm RED**

```bash
npx vitest run src/config/tool-capabilities/index.test.ts -t "Grammar engine locale evidence"
```

Expected: FAIL because Grammar has not declared `localeEvidence`.

- [ ] **Step 3: Add an exact fixture-backed behavior test**

In `src/lib/grammar-rules.test.ts`, add a direct test that imports `grammarCheckerEnglishFixtures`, executes the public Grammar rule function over the declared cases, and uses real matchers:

```ts
it('exercises non-empty English grammar fixtures [capability:grammar-checker:engine:language-support]', () => {
  const fixtureTexts = Object.values(grammarCheckerEnglishFixtures);
  expect(fixtureTexts.filter((text) => text.trim().length > 0).length).toBeGreaterThanOrEqual(6);
  expect(checkGrammar(grammarCheckerEnglishFixtures.correct)).toEqual([]);
  expect(checkGrammar(grammarCheckerEnglishFixtures.repeatedWord).length).toBeGreaterThan(0);
});
```

- [ ] **Step 4: Add the Grammar profile contract**

Replace the parent engine evidence with the exact test reference from Step 3, reuse that same reference in the locale contract, and add the fixture/disclosure fields shown in Step 1. Keep `src/lib/grammar-language-support.test.ts` as an ordinary profile-shape regression, but no longer treat it as engine behavior evidence.

- [ ] **Step 5: Verify Grammar and profile behavior**

Update the existing `flattenProfileEvidenceTestFiles(grammarProfile)` assertion
to expect the new `src/lib/grammar-rules.test.ts` engine evidence and no longer
expect `src/lib/grammar-language-support.test.ts`. Do not alter any validator
production logic or other heuristic tests in this task.

```bash
npx vitest run src/lib/grammar-rules.test.ts src/config/tool-capabilities/index.test.ts scripts/validation/validate-tool-locale-capability.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit Task 2**

```bash
git add src/config/tool-capabilities/profiles/grammar-checker.ts src/lib/grammar-rules.test.ts src/config/tool-capabilities/index.test.ts
git add -f scripts/validation/validate-tool-locale-capability.test.ts
git commit -m "test: declare Grammar locale fixture evidence"
```

---

### Task 3: Migrate SQL And Typing Locale Evidence

**Files:**

- Modify: `src/config/tool-capabilities/define-profile.ts`
- Modify: `src/config/tool-capabilities/profiles/sql-query-optimizer.ts`
- Modify: `src/config/tool-capabilities/profiles/typing-speed-test.ts`
- Modify: `src/config/tool-capabilities/index.test.ts`

**Interfaces:**

- Produces: SQL `behavior-test` contract for `en`.
- Produces: ten Typing `message-prompt-bank` contracts.
- Produces: explicit SQL unsupported-locale claim code consumed by Task 4.

- [ ] **Step 1: Write failing SQL and Typing contract tests**

Add exact assertions:

```ts
expect(getToolCapabilityProfile('sql-query-optimizer')?.supportedLocales.engine).toMatchObject({
  kind: 'engine-limited',
  localeEvidence: [{ locale: 'en', runtime: 'local', data: { kind: 'behavior-test' } }],
  disclosure: {
    labelKey: 'tools.sql-query-optimizer.capabilities.limits.englishDiagnostics',
    unsupportedLocaleClaimCodes: ['sql-query-optimizer-native-non-english-diagnostics-claim'],
  },
});
```

```ts
const typingEngine = getToolCapabilityProfile('typing-speed-test')?.supportedLocales.engine;
expect(typingEngine).toMatchObject({ kind: 'engine-limited' });
if (typingEngine?.kind === 'engine-limited') {
  expect(typingEngine.localeEvidence.map(({ locale }) => locale)).toEqual(locales);
  for (const contract of typingEngine.localeEvidence) {
    expect(contract).toMatchObject({
      runtime: 'local',
      data: {
        kind: 'message-prompt-bank',
        fileTemplate: 'src/messages/{locale}.json',
        messagePath: ['tools', 'typing-speed-test', 'sampleTexts'],
        minimumNonEmptyEntries: 6,
      },
    });
  }
}
```

- [ ] **Step 2: Run and confirm RED**

```bash
npx vitest run src/config/tool-capabilities/index.test.ts -t "SQL and Typing engine locale evidence"
```

Expected: FAIL because the contracts do not exist.

- [ ] **Step 3: Add SQL locale evidence**

Reuse the existing `engineEvidence` reference. Add one `en` contract with `data: { kind: 'behavior-test' }`, the existing English diagnostics label key, and the new unsupported claim code.

Add a matching forbidden claim entry to the SQL profile:

```ts
{
  code: 'sql-query-optimizer-native-non-english-diagnostics-claim',
  pattern: /\b(?:native|localized)\s+(?:Russian|Chinese|Japanese|Korean|Spanish|Portuguese|French|German|Arabic)\s+(?:diagnostics?|findings?|explanations?)\b/iu,
  reason: 'Local SQL diagnostic explanations are currently English.',
}
```

The central taxonomy in Task 4 provides the ten-locale semantic detector; this profile pattern remains the English fallback.

- [ ] **Step 4: Add Typing locale evidence**

Build the contracts without duplicating the locale list:

```ts
const typingLocaleEvidence = locales.map((locale) => ({
  locale,
  runtime: 'local' as const,
  evidence: promptLocaleEvidence,
  data: {
    kind: 'message-prompt-bank' as const,
    fileTemplate: 'src/messages/{locale}.json',
    messagePath: ['tools', 'typing-speed-test', 'sampleTexts'] as const,
    minimumNonEmptyEntries: 6,
  },
}));
```

Set the disclosure label to `tools.typing-speed-test.capabilities.features.difficultyPromptBanks` and `unsupportedLocaleClaimCodes` to an empty array because all UI locales are declared local.

- [ ] **Step 5: Verify profile migrations**

```bash
npx vitest run src/config/tool-capabilities/index.test.ts src/lib/sql-query-optimizer.test.ts src/lib/typing-speed-test.test.ts
```

Expected: PASS.

After all three engine-limited profiles have explicit contracts, delete the temporary Task 1 legacy input/early-return. Add a regression that casts an engine-limited profile with both `localeEvidence` and `disclosure` omitted and expects `defineToolCapabilityProfile` to throw; also retain the one-field-missing cases. Run the full capability profile suite before committing Task 3.

- [ ] **Step 6: Commit Task 3**

```bash
git add src/config/tool-capabilities/profiles/sql-query-optimizer.ts src/config/tool-capabilities/profiles/typing-speed-test.ts src/config/tool-capabilities/index.test.ts
git commit -m "config: declare SQL and Typing locale evidence"
```

---

### Task 4: Centralize Best-Effort Unsupported-Language Claim Lint

**Files:**

- Modify: `src/lib/tool-capability-claim-taxonomy.ts`
- Modify: `src/lib/tool-capability-claims.test.ts`

**Interfaces:**

- Produces: central advisory issue codes through `assessToolCapabilityClaims`.
- Removes: locale-validator-specific native-language clause detection without turning free-form prose parsing into release evidence.

- [ ] **Step 1: Add adversarial claim tests**

Add direct `assessToolCapabilityClaims` cases for the exact reviewed sentences:

```ts
expect(assessToolCapabilityClaims({
  locale: 'ru',
  slug: 'grammar-checker',
  text: 'Инструмент не проверяет русскую грамматику, а проверяет только английский текст.',
}).issues).toEqual([]);
```

```ts
for (const description of [
  'Русская грамматика доступна.',
  'Русская грамматика поддерживается.',
  'Доступна проверка русской грамматики.',
  'Проверяет русскую грамматику и не отправляет текст на сервер.',
]) {
  expect(assessToolCapabilityClaims({
    locale: 'ru',
    slug: 'grammar-checker',
    text: description,
  }).issues).toEqual([
    expect.objectContaining({ code: 'grammar-checker-native-non-english-claim' }),
  ]);
}
```

Add a Russian SQL native-diagnostics claim that must produce
`sql-query-optimizer-native-non-english-diagnostics-claim`. Add a compact
ten-locale table with one affirmative and one truthful negated SQL diagnostics
sentence per locale so the new target family cannot silently fall back to the
English profile regex.

- [ ] **Step 2: Run the selected claim tests and confirm RED**

```bash
npx vitest run src/lib/tool-capability-claims.test.ts -t "engine locale claim semantics"
```

Expected: at least the nominal Grammar and SQL cases fail before taxonomy changes.

- [ ] **Step 3: Implement the bounded authoring lint**

Keep one semantic owner in `tool-capability-claim-taxonomy.ts`. Reuse the
existing `splitClaimSegments` sentence and locale-contrast machinery instead
of creating another global splitter. Implement the exact reviewed repository
authoring cases and the ten-locale SQL target family, but explicitly treat the
result as a deterministic best-effort lint rather than a parser for arbitrary
natural-language word order. Do not grow a Russian predicate/ownership parser
in response to open-ended prose variants.

```ts
const NEGATED_ADDITION_BY_LOCALE: Partial<Record<Locale, RegExp>> = {
  ru: /\s+и\s+(?=не(?:\s|$))/iu,
};
```

Extend Russian assertion vocabulary for the reviewed nominal availability and
passive support forms (`доступн...`, `поддержива...`). Add a ten-locale target
family for `sql-query-optimizer-native-non-english-diagnostics-claim`, using
the existing locale assertion and negation tables. Document the best-effort
boundary in code/tests. Do not add any semantic detector back to
`validate-tool-locale-capability.ts`, and do not map these free-text findings
to locale-validator blocking issues in Task 5.

- [ ] **Step 4: Run the exhaustive claim suite**

```bash
npx vitest run src/lib/tool-capability-claims.test.ts
npm run validate:tool-capability-claims
```

Expected: PASS and `issues=0` for the current 60 pages.

- [ ] **Step 5: Commit Task 4**

```bash
git add src/lib/tool-capability-claim-taxonomy.ts src/lib/tool-capability-claims.test.ts
git commit -m "fix: centralize engine locale claim semantics"
```

---

### Task 5: Replace The Locale Validator With Explicit Contracts

**Files:**

- Modify: `scripts/validation/validate-tool-locale-capability.ts`
- Modify: `scripts/validation/validate-tool-locale-capability.test.ts`

**Interfaces:**

- Consumes: Task 1 engine locale contracts.
- Consumes: `runRepositoryEvidenceTest` and `validateCapabilityEvidenceReference`.
- Produces: existing `LocaleCapabilityIssue` and `ToolLocaleCapabilityRunReport` shapes.

- [ ] **Step 1: Replace heuristic tests with contract tests**

Delete synthetic tests whose only purpose is matcher-name, loop-variable, or arbitrary AST inference. Add these test helpers at the top of the validator test file:

```ts
const evidence = {
  file: 'src/lib/example-engine.test.ts',
  testName: 'proves locale behavior [capability:example:engine:language-support]',
};

function engineProfile(data: EngineLocaleDataEvidence): ToolCapabilityProfile {
  return defineToolCapabilityProfile({
    slug: 'example',
    version: '1.0.0',
    enforcement: 'release-blocking',
    modes: [],
    acceptedInputs: [],
    producedOutputs: [],
    supportedLocales: {
      ui: ['en', 'ru'],
      engine: {
        kind: 'engine-limited',
        local: ['en'],
        optionalServer: [],
        evidence,
        localeEvidence: [{ locale: 'en', runtime: 'local', evidence, data }],
        disclosure: {
          labelKey: 'tools.example.englishOnly',
          unsupportedLocaleClaimCodes: ['example-native-language-claim'],
        },
      },
    },
    browserOnlyFeatures: [],
    optionalServerFeatures: [],
    limits: [],
    forbiddenClaims: [{
      code: 'example-native-language-claim',
      pattern: /native Russian/iu,
      reason: 'The example engine is English-only.',
    }],
    targetSearchIntents: ['example.local'],
    evidenceTests: [evidence],
  });
}

async function runProfile(
  profile: ToolCapabilityProfile,
  repositoryRoot: string,
  runEvidenceTest: (
    evidence: CapabilityEvidenceReference,
  ) => CapabilityEvidenceExecutionResult | Promise<CapabilityEvidenceExecutionResult> =
    () => ({ status: 'passed' }),
) {
  return runToolLocaleCapabilityValidation({
    profiles: [profile],
    locales: ['en', 'ru'],
    repositoryRoot,
    runEvidenceTest,
    loadMergedMessages: async (locale) => ({
      englishOnly: locale === 'ru' ? 'Checks English text only.' : 'English engine.',
    }),
  });
}
```

`createTemporaryRepository()` must also write
`src/lib/example-engine.test.ts` with one direct `it(...)` declaration whose
static name exactly equals `evidence.testName`. This keeps the structural
evidence gate real while allowing execution status to be injected.

Add the following concrete tests, using `mkdtempSync`, `mkdirSync`, and `writeFileSync` to create each declared data file:

```ts
it('fails fixture-object data below its declared minimum and passes at the exact minimum', async () => {
  const root = createTemporaryRepository();
  writeRepositoryFile(root, 'src/lib/fixtures/example/en.ts',
    "export const samples = ['one', 'two', 'three', 'four', 'five'];\n");
  const data = {
    kind: 'fixture-object' as const,
    file: 'src/lib/fixtures/example/en.ts',
    exportName: 'samples',
    minimumNonEmptyValues: 6,
  };
  expect((await runProfile(engineProfile(data), root)).issues).toEqual([
    expect.objectContaining({ code: 'missing-fixtures' }),
  ]);

  writeRepositoryFile(root, 'src/lib/fixtures/example/en.ts',
    "export const samples = ['one', 'two', 'three', 'four', 'five', 'six'];\n");
  expect((await runProfile(engineProfile(data), root)).issues).toEqual([]);
});

it('fails a missing fixture export', async () => {
  const root = createTemporaryRepository();
  writeRepositoryFile(root, 'src/lib/fixtures/example/en.ts',
    "export const otherSamples = ['one', 'two', 'three', 'four', 'five', 'six'];\n");
  const report = await runProfile(engineProfile({
    kind: 'fixture-object',
    file: 'src/lib/fixtures/example/en.ts',
    exportName: 'samples',
    minimumNonEmptyValues: 6,
  }), root);
  expect(report.issues).toEqual([expect.objectContaining({ code: 'missing-fixtures' })]);
});

it('enforces the exact prompt-bank minimum', async () => {
  const root = createTemporaryRepository();
  const data = {
    kind: 'message-prompt-bank' as const,
    fileTemplate: 'src/messages/{locale}.json',
    messagePath: ['tools', 'example', 'sampleTexts'] as const,
    minimumNonEmptyEntries: 6,
  };
  writeRepositoryFile(root, 'src/messages/en.json', JSON.stringify({
    tools: { example: { sampleTexts: ['one', 'two', 'three', 'four', 'five'] } },
  }));
  expect((await runProfile(engineProfile(data), root)).issues).toEqual([
    expect.objectContaining({ code: 'missing-fixtures' }),
  ]);

  writeRepositoryFile(root, 'src/messages/en.json', JSON.stringify({
    tools: { example: { sampleTexts: ['one', 'two', 'three', 'four', 'five', 'six'] } },
  }));
  expect((await runProfile(engineProfile(data), root)).issues).toEqual([]);
});

it.each(['failed', 'skipped', 'todo', 'not-collected', 'error'] as const)(
  'fails behavior evidence with status %s',
  async (status) => {
    const root = createTemporaryRepository();
    const report = await runProfile(
      engineProfile({ kind: 'behavior-test' }),
      root,
      () => ({ status }),
    );
    expect(report.issues).toEqual([expect.objectContaining({ code: 'missing-fixtures' })]);
  },
);

it('passes behavior-test evidence only when the exact runner passes', async () => {
  const root = createTemporaryRepository();
  expect((await runProfile(engineProfile({ kind: 'behavior-test' }), root)).issues).toEqual([]);
});
```

Retain and update the existing real-profile tests for the declared disclosure key, inventory reporting, language-neutral profiles, and the full six-profile × ten-locale matrix. Remove locale-validator tests that expect free-text claim codes to become `native-language-overclaim`; those codes remain owned by the separate best-effort claim lint.

Retain the public en/ru Grammar, language-neutral, inventory, and real 6×10
matrix tests, but rename the public English case so it asserts synchronous
message checks rather than legacy fixture-path inference. Add one structural
failure case for a missing/wrong exact test declaration and one call-count case
proving ten shared Typing contracts execute their evidence test once.

- [ ] **Step 2: Run and confirm RED against the current heuristic validator**

```bash
npx vitest run scripts/validation/validate-tool-locale-capability.test.ts
```

Expected: new explicit data-source cases fail; obsolete AST tests may still pass until removed.

- [ ] **Step 3: Implement direct data-source validation**

Add these focused helpers:

```ts
function flattenNonEmptyStrings(value: unknown): string[] {
  if (typeof value === 'string') return value.trim() ? [value.trim()] : [];
  if (Array.isArray(value)) return value.flatMap(flattenNonEmptyStrings);
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(flattenNonEmptyStrings);
  }
  return [];
}

function resolveMessagePath(root: unknown, pathParts: readonly string[]): unknown {
  return pathParts.reduce<unknown>((value, part) =>
    value && typeof value === 'object'
      ? (value as Record<string, unknown>)[part]
      : undefined,
  root);
}
```

Add one canonical repository-data resolver shared by both data kinds. It must
reject absolute paths, `..` traversal, missing files, directories, and symlinks
whose real path escapes `repositoryRoot`. Restrict fixture modules to
`.ts`/`.js` and prompt banks to `.json`.

Implement `fixture-object` by importing the declared trusted repository module
via `pathToFileURL`, adding a unique query token per validation read so a
rewritten fixture is not served from the module cache, and reading the declared
export. Implement `message-prompt-bank` by replacing the single `{locale}` in
`fileTemplate`, parsing JSON, resolving `messagePath`, and counting flattened
non-empty strings. `behavior-test` requires no separate data file.

- [ ] **Step 4: Execute exact evidence tests**

Extend `ToolLocaleCapabilityRunDependencies` with injectable evidence helpers:

```ts
loadEvidenceTestModule?: (file: string) => RepositoryEvidenceTestModule | null;
runEvidenceTest?: (
  evidence: CapabilityEvidenceReference,
) => CapabilityEvidenceExecutionResult | Promise<CapabilityEvidenceExecutionResult>;
```

Default them to repository-root-bound wrappers around the existing repository
helpers:

```ts
const loadEvidenceTestModule = dependencies.loadEvidenceTestModule ??
  ((file: string) => repositoryEvidenceTestModule(file, repositoryRoot));
const runEvidenceTest = dependencies.runEvidenceTest ??
  ((evidence: CapabilityEvidenceReference) =>
    runRepositoryEvidenceTest(evidence, repositoryRoot));
```

For each contract, validate the exact reference with that loader:

```ts
const structuralIssue = validateCapabilityEvidenceReference(
  { slug: profile.slug, category: 'engine', id: 'language-support' },
  contract.evidence,
  loadEvidenceTestModule,
);
const execution = await runEvidenceTest(contract.evidence);
```

Cache execution results by `file + testName`, so Typing's ten contracts run the
shared exact test once. Any structural issue or execution status other than
`passed` produces `missing-fixtures` with the exact locale and test name.
Build these repository-evidence issues once per profile before iterating its UI
pages; do not launch evidence processes from inside the locale page loop.

- [ ] **Step 5: Resolve the structured disclosure boundary**

For UI locales outside both `engine.local` and `engine.optionalServer`, require
the declared `engine.disclosure.labelKey` to start with `tools.${profile.slug}.`,
strip that prefix, and resolve the remaining path against the tool-local
`mergedMessages`. Missing/non-string/empty values produce
`missing-disclosure`.

Do not call `assessToolCapabilityClaims` from the locale validator and do not
map free-text findings to `native-language-overclaim`. Keep
`validateToolLocaleCapability` synchronous by running only the declared
disclosure check. Ignore its legacy `evidenceTests` input there;
full data-source and exact-test checks happen only in
`runToolLocaleCapabilityValidation`.

Delete the current TypeScript AST matcher/data-flow helpers, localized disclosure regex tables, and locale-validator-specific native-language semantic detector.

- [ ] **Step 6: Run focused and standalone validation**

```bash
npx vitest run scripts/validation/validate-tool-locale-capability.test.ts
npm run validate:tool-locale-capability
```

Expected: focused tests pass; standalone output is `profiles=6 localePages=60 issues=0`.

- [ ] **Step 7: Force-stage the ignored validator files and commit**

The repository intentionally ignores new `scripts/validation/*` paths. Do not modify `.gitignore`.

```bash
git add -f scripts/validation/validate-tool-locale-capability.ts scripts/validation/validate-tool-locale-capability.test.ts
git commit -m "refactor: validate explicit engine locale evidence"
```

---

### Task 6: Run The Complete Governance Gate And Close Task 3

**Files:**

- Verify: all files changed in Tasks 1–5.
- Stage when permissions allow: `docs/superpowers/specs/2026-07-18-explicit-engine-locale-evidence-design.md`
- Stage when permissions allow: `docs/superpowers/plans/2026-07-18-explicit-engine-locale-evidence.md`
- Update ignored ledger: `.superpowers/sdd/progress.md`

**Interfaces:**

- Produces: a reviewed, release-blocking explicit locale evidence gate plus a separate bounded best-effort claim lint.
- Preserves: recommendation-only selective indexation safety boundary.

- [ ] **Step 1: Run focused contracts**

```bash
npx vitest run src/config/tool-capabilities/index.test.ts src/lib/grammar-rules.test.ts src/lib/sql-query-optimizer.test.ts src/lib/typing-speed-test.test.ts src/lib/tool-capability-claims.test.ts scripts/validation/validate-tool-locale-capability.test.ts
```

Expected: all files and tests pass.

- [ ] **Step 2: Run repository governance**

```bash
npm run validate:tool-capability-claims
npm run validate:tool-locale-capability
npm run qa:seo-governance
```

Expected: both validators report `profiles=6 localePages=60 issues=0`; SEO governance exits `0` with only documented pre-existing optimization warnings.

- [ ] **Step 3: Run type and build gates**

```bash
npm run check
npm run build
git diff --check
```

Expected: Astro check has zero errors; build exits `0`; diff check has no output.

- [ ] **Step 4: Prove the recommendation-only boundary**

```bash
git diff -- src/pages/robots.txt.ts src/config/gsc-redirects.json src/config/sitemap-lastmod.json src/pages/sitemap.xml.ts src/pages/sitemap-pages.xml.ts src/pages/sitemap-priority.xml.ts src/pages/sitemap-tools.xml.ts src/pages/'[locale]'/tools/'[slug].astro'
```

Expected: no output.

- [ ] **Step 5: Review and record completion**

Generate a review package from Task 1 base through Task 5 head. Require both `Spec compliant` and `Task quality: Approved`; fix every Critical/Important finding before marking Task 3 complete.

Append to `.superpowers/sdd/progress.md`:

```text
Index Readiness Task 3: complete (starting at 51eca35c and ending at the reviewed Task 5 HEAD, final review clean) — explicit profile-owned engine locale evidence, direct data validation, exact behavior-test execution, declared disclosures, and a bounded claim lint kept separate from locale release evidence.
```

- [ ] **Step 6: Commit the approved design and plan documents if still uncommitted**

```bash
git add docs/superpowers/specs/2026-07-18-explicit-engine-locale-evidence-design.md docs/superpowers/plans/2026-07-18-explicit-engine-locale-evidence.md
git commit -m "docs: design explicit engine locale evidence"
```

Do not stage `docs/COMPETITOR_RESEARCH_2026-07-15.md`.
