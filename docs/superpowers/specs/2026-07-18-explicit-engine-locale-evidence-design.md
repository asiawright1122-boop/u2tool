# Explicit Engine-Locale Evidence Contract Design

## Status

Approved design direction on 2026-07-18. This document replaces the brittle
AST/data-flow and page-wide semantic heuristics introduced while implementing
Multilingual Selective Indexation Governance Task 3.

## Problem

The current locale capability validator tries to infer evidence quality from
test syntax. It recognizes matcher-looking method names, follows partial AST
data flow, and searches localized prose for engine-language meaning. Three
independent reviews produced new bypasses each time:

- matcher-shaped non-assertions such as `toString()`;
- disconnected or decoy locale datasets that satisfy syntactic flags;
- page copy where unrelated negation or English-language nouns create false
  positives and false negatives.

Static syntax inference cannot prove that arbitrary tests meaningfully verify
locale behavior. Continuing to add AST and regular-expression exceptions would
make the release gate larger without making it trustworthy.

## Goals

1. Make every engine-supported locale an explicit, typed profile declaration.
2. Validate locale data directly from a declared data source instead of
   reverse-engineering test bodies.
3. Require an exact runnable behavior test for every locale evidence contract.
4. Keep unsupported-language free-text checks in the existing capability-claim subsystem as a best-effort authoring lint, not as proof of arbitrary natural-language semantics.
5. Require an explicit, visible disclosure label for UI locales not supported
   by the local engine.
6. Keep language-neutral profiles unchanged.
7. Preserve the public `validateToolLocaleCapability` function while replacing
   repository validation with the explicit contract.

## Non-Goals

- No automatic indexation changes.
- No new product capabilities or locale claims.
- No fabricated fixture files.
- No generic static proof that an arbitrary unit test is semantically useful.
- No second claim-taxonomy implementation inside the locale validator.

## Approaches Considered

### A. Profile-owned explicit contract — selected

Each engine-limited profile owns its locale evidence, disclosure, and claim
boundaries. This keeps the declaration beside the capability it governs and
prevents a separate registry from drifting.

### B. Central locale evidence registry

A separate registry would avoid changing capability profile types, but it
would duplicate slug, locale, enforcement, and evidence information. Profile
and registry changes could land independently and disagree.

### C. Exact test execution only

Running an exact test is necessary but insufficient: a no-op or poorly scoped
test can still pass. This approach would not prove that declared locale data
exists or meets a minimum schema.

## Type Model

`supportedLocales.engine` keeps its existing `kind`, `local`,
`optionalServer`, and profile-level `evidence`. Engine-limited profiles add the
following fields:

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

The engine-limited branch gains:

```ts
localeEvidence: readonly EngineLocaleEvidenceContract[];
disclosure: EngineLanguageDisclosureContract;
```

`defineToolCapabilityProfile` validates and normalizes these new structures in
the same style as existing profile fields. This design does not expand into the
separate, already-recorded shallow-freeze debt for all nested profile data.

## Profile Migrations

### Grammar Checker

- Local locale: `en`.
- Data kind: `fixture-object`.
- Fixture: `src/lib/fixtures/grammar-checker/en.ts`.
- Export: `grammarCheckerEnglishFixtures`.
- Behavior evidence: an exact Grammar rules test carrying the existing
  `engine:language-support` marker and exercising the fixture-backed rules.
- Disclosure key: the existing English-only engine limit label.
- Unsupported claim codes: Grammar native-non-English claim family.

### SQL Query Optimizer

- Local locale: `en`.
- Data kind: `behavior-test`; diagnostics are deterministic output rather than
  a locale corpus.
- Behavior evidence: the existing exact test proving formatted SQL preserves
  input while local diagnostics remain English.
- Disclosure key: the existing English diagnostics limit label.
- Unsupported claim codes: a dedicated SQL native-diagnostics claim family in
  the central capability taxonomy.

### Typing Speed Test

- Local locales: all ten UI locales.
- One contract per locale, all using `message-prompt-bank`.
- Data source: `src/messages/{locale}.json` at
  `tools.typing-speed-test.sampleTexts`.
- Minimum: six non-empty prompt strings per locale.
- Behavior evidence: the existing exact ten-locale prompt test.
- No unsupported UI locale currently requires a disclosure, but the profile
  still declares the relevant capability label for future locale changes.

### Language-Neutral Profiles

Hex Editor, Excel Viewer, and Gantt remain `language-neutral`; they do not add
locale evidence contracts or language disclosures.

## Validation Data Flow

For every release-blocking engine-limited profile:

1. Validate that `localeEvidence` contains exactly one entry for every local
   and optional-server locale, with no undeclared locale.
2. Validate the exact evidence reference using the existing capability
   evidence structural rules.
3. Execute each unique exact evidence reference once with the existing
   repository evidence runner and reuse its result for contracts that share
   the same test. Failed, skipped, todo, missing, duplicate, or timed-out tests
   fail every affected locale contract.
4. Validate the declared data source directly:
   - `fixture-object`: canonicalize a repository-relative TypeScript module,
     reject traversal or symlink escapes, import it with cache isolation,
     locate the declared export, flatten its values, and enforce the non-empty
     minimum;
   - `message-prompt-bank`: resolve the locale file and message path, flatten
     prompt values, and enforce the non-empty minimum;
   - `behavior-test`: no separate corpus is required; exact test execution is
     the data evidence.
5. For each UI locale not supported by the local engine, validate that the
   declared disclosure key belongs to `tools.<slug>.*`, strip that tool prefix,
   and resolve the remaining path from the tool-local merged messages. A
   missing or empty label produces `missing-disclosure`.
6. Keep the existing capability claim assessment as a separate best-effort
   repository lint. Its language findings do not determine the structured
   locale release gate and are not mapped to locale-validator blocking issues.
7. Inventory profiles are reported under `notReleaseReadyProfiles` and do not
   pretend to have release evidence.

The validator no longer inspects test AST matcher shapes, tries to trace loop
variables, or implements its own page-wide language semantics.

The synchronous public `validateToolLocaleCapability` entry point remains
available for message-only disclosure checks. Repository data loading and exact
test execution remain in the asynchronous
`runToolLocaleCapabilityValidation` path used by the release gate.

## Claim Ownership

Unsupported-language prose belongs to the existing capability claim taxonomy,
not the locale evidence validator. It remains a deterministic, best-effort
authoring lint over controlled repository copy; it does not claim to parse or
prove every valid natural-language construction. Required reviewed cases are
added to the central taxonomy tests:

- unrelated negation cannot hide an affirmative native-language claim;
- a truthful negated native claim followed by English-only behavior passes;
- nominal support/availability claims fail;
- an English documentation reference does not satisfy an English-diagnostics
  disclosure.

The locale validator does not consume these free-text findings as release
evidence. This keeps one semantic owner for the auxiliary lint, preserves the
existing exhaustive ten-locale claim matrix, and prevents an open-ended prose
parser from becoming a release proof.

## Error Model

Existing public issue codes remain unchanged:

- `missing-fixtures`: missing locale contract, invalid data source, insufficient
  non-empty data, invalid exact evidence reference, or non-passing evidence
  test;
- `missing-disclosure`: the declared disclosure label is absent or empty for an
  unsupported UI locale;
- `native-language-overclaim`: retained as a compatibility-reserved public
  code, but not emitted by the structured locale release gate.

Issue messages identify the profile, locale, evidence kind, file/key, and exact
test without exposing internal deliberation.

## Testing Strategy

### Schema and definition tests

- missing, duplicate, or extra locale evidence contracts fail;
- local/optional-server runtime mismatches fail;
- language-neutral profiles reject locale-only contract fields;
- nested profile contracts are immutable.

### Data source tests

- fixture object: exact minimum passes; empty/missing export and one-below fail;
- prompt bank: six non-empty prompts pass; missing path, empty prompt, and five
  prompts fail;
- behavior test: passed exact test succeeds; failed/skipped/todo/missing test
  fails.

### Profile integration tests

- real Grammar, SQL, and Typing contracts pass;
- all six profiles × ten UI locales produce zero current issues;
- inventory variants are reported as not release-ready;
- language-neutral tools remain unaffected.

### Claim and disclosure tests

- all previously reported Russian and SQL adversarial sentences are locked in
  the central claim taxonomy or disclosure-label tests;
- a missing declared disclosure key fails without scanning unrelated page text.

### Repository gates

- focused locale capability tests;
- standalone locale validator;
- capability claims validator;
- SEO governance;
- Astro/TypeScript check;
- build and diff checks where required by the parent plan.

## Migration And Cleanup

1. Revert the current uncommitted AST/data-flow and locale-semantic heuristic
   changes in the two locale validator files while preserving already valid
   Task 3 behavior.
2. Add the new profile types and definition validation.
3. Migrate Grammar, SQL, and Typing profiles and exact tests.
4. Move unsupported-language adversarial semantics to the central claim
   taxonomy.
5. Replace repository locale validation with structured contracts and declared
   disclosures only; keep the central bounded best-effort claim lint separate.
6. Delete obsolete AST matcher/data-flow helpers and their synthetic tests.
7. Run the full gates and task review before continuing to Index Readiness
   Task 4.

## Safety Boundary

This design changes only validation metadata, tests, and validators. It does
not change tool behavior, production routes, robots, canonical, hreflang,
redirects, sitemaps, or indexation state. The active Spanish chart controls
remain protected and all index readiness outputs remain recommendations only.
