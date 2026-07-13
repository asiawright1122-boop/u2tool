import { readFileSync, realpathSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

import type { ToolCapabilityProfile } from '../../src/config/tool-capabilities';
import { getPilotToolCapabilityProfiles } from '../../src/config/tool-capabilities';
import { locales, type Locale } from '../../src/lib/i18n';
import { assessToolCapabilityClaims } from '../../src/lib/tool-capability-claims';
import { buildToolWrapperTranslations } from '../../src/lib/tool-page-translations';
import {
  loadToolPageMessages,
  mergeMessageRecords,
  readMessageFile,
} from '../../src/lib/translations';

const ALWAYS_VISIBLE_SHARED_CAPABILITY_LABEL_KEYS = [
  'tools.capabilityDisclosure.title',
  'tools.capabilityDisclosure.runsLocally',
  'tools.capabilityDisclosure.acceptedInputs',
  'tools.capabilityDisclosure.producedOutputs',
  'tools.capabilityDisclosure.supportedLanguage',
  'tools.capabilityDisclosure.limits',
  'tools.capabilityDisclosure.privacyLocal',
] as const;

export interface CapabilityValidationIssue {
  locale: Locale;
  slug: string;
  code: string;
  message: string;
}

export type CapabilityEvidenceCategory =
  | 'profile'
  | 'mode'
  | 'accepted-input'
  | 'produced-output'
  | 'browser-feature'
  | 'optional-server-feature'
  | 'limit'
  | 'engine';

export interface CapabilityEvidenceReference {
  file: string;
  testName: string;
}

export interface CapabilityEvidenceSubject {
  slug: string;
  category: CapabilityEvidenceCategory;
  id: string;
}

export interface RepositoryEvidenceTestModule {
  file: string;
  source: string;
}

export type CapabilityEvidenceExecutionStatus =
  | 'passed'
  | 'failed'
  | 'skipped'
  | 'todo'
  | 'not-collected'
  | 'error';

export interface CapabilityEvidenceExecutionResult {
  status: CapabilityEvidenceExecutionStatus;
  details?: string;
}

export interface ToolCapabilityClaimOptions {
  requireReleaseReady?: string;
}

export interface ToolCapabilityClaimRunDependencies {
  profiles: readonly ToolCapabilityProfile[];
  locales: readonly Locale[];
  loadToolMessages: (
    locale: Locale,
    slug: string,
  ) => Promise<Record<string, unknown>>;
  loadLocalizedBaseMessages: (
    locale: Locale,
  ) => Promise<Record<string, unknown>>;
  loadLocalizedToolMessages: (
    locale: Locale,
    slug: string,
  ) => Promise<Record<string, unknown>>;
  loadEvidenceTestModule: (
    path: string,
  ) => RepositoryEvidenceTestModule | null;
  runEvidenceTest?: (
    evidence: CapabilityEvidenceReference,
  ) =>
    | CapabilityEvidenceExecutionResult
    | Promise<CapabilityEvidenceExecutionResult>;
}

export interface ToolCapabilityClaimRunReport {
  profileCount: number;
  localePageCount: number;
  issues: CapabilityValidationIssue[];
  exitCode: 0 | 1;
}

export function parseToolCapabilityClaimArgs(
  argv: readonly string[],
): ToolCapabilityClaimOptions {
  if (argv.length === 0) {
    return {};
  }

  if (
    argv.length === 2 &&
    argv[0] === '--require-release-ready' &&
    argv[1].trim().length > 0
  ) {
    return { requireReleaseReady: argv[1].trim() };
  }

  throw new Error(
    'Usage: validate-tool-capability-claims [--require-release-ready <slug>]',
  );
}

function resolveMessage(
  messages: Record<string, unknown>,
  labelKey: string,
): unknown {
  return labelKey.split('.').reduce<unknown>((value, segment) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return undefined;
    }
    return (value as Record<string, unknown>)[segment];
  }, messages);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function visibleCapabilityLabelKeys(
  profile: ToolCapabilityProfile,
): string[] {
  const engineLabelKeys =
    profile.supportedLocales.engine.kind === 'language-neutral'
      ? ['tools.capabilityDisclosure.languageNeutral']
      : profile.supportedLocales.engine.local.map(
          (locale) => `tools.capabilityDisclosure.languages.${locale}`,
        );
  const optionalServerLabelKeys =
    profile.optionalServerFeatures.length === 0
      ? []
      : [
          'tools.capabilityDisclosure.optionalServer',
          'tools.capabilityDisclosure.privacyServer',
          ...profile.modes
            .filter(({ runtime }) => runtime === 'optional-server')
            .map(({ labelKey }) => labelKey),
          ...profile.optionalServerFeatures.map(({ labelKey }) => labelKey),
        ];

  return [
    ...new Set([
      ...ALWAYS_VISIBLE_SHARED_CAPABILITY_LABEL_KEYS,
      ...engineLabelKeys,
      ...profile.modes
        .filter(({ runtime }) => runtime === 'browser')
        .map(({ labelKey }) => labelKey),
      ...profile.acceptedInputs.map(({ labelKey }) => labelKey),
      ...profile.producedOutputs.map(({ labelKey }) => labelKey),
      ...profile.browserOnlyFeatures.map(({ labelKey }) => labelKey),
      ...profile.limits.map(({ labelKey }) => labelKey),
      ...optionalServerLabelKeys,
    ]),
  ].sort(compareStrings);
}

export async function runToolCapabilityClaimValidation(
  options: ToolCapabilityClaimOptions,
  dependencies: ToolCapabilityClaimRunDependencies,
): Promise<ToolCapabilityClaimRunReport> {
  const rows: Array<{
    locale: Locale;
    slug: string;
    messages: Record<string, unknown>;
  }> = [];

  for (const profile of dependencies.profiles) {
    for (const locale of dependencies.locales) {
      const messages = await dependencies.loadToolMessages(
        locale,
        profile.slug,
      );
      rows.push({ locale, slug: profile.slug, messages });
    }
  }

  const issues = validateCapabilityMessageMatrix(rows);
  const releaseReadyProfiles = dependencies.profiles.filter(
    (profile) => profile.enforcement === 'release-blocking',
  );

  if (options.requireReleaseReady) {
    const requiredProfile = dependencies.profiles.find(
      (profile) => profile.slug === options.requireReleaseReady,
    );
    const locale = dependencies.locales[0] ?? 'en';

    if (!requiredProfile) {
      issues.push({
        locale,
        slug: options.requireReleaseReady,
        code: 'release-ready-profile-not-found',
        message: 'Required capability profile does not exist.',
      });
    } else if (requiredProfile.enforcement !== 'release-blocking') {
      issues.push({
        locale,
        slug: requiredProfile.slug,
        code: 'release-ready-enforcement-required',
        message: 'Required profile must use release-blocking enforcement.',
      });
    }
  }

  const baseMessagesByLocale = new Map<Locale, Record<string, unknown>>();
  const labelMessagesByPage = new Map<string, Record<string, unknown>>();
  const toolSlugs = dependencies.profiles.map(({ slug }) => slug);

  for (const profile of releaseReadyProfiles) {
    for (const locale of profile.supportedLocales.ui) {
      let baseMessages = baseMessagesByLocale.get(locale);
      if (!baseMessages) {
        baseMessages = await dependencies.loadLocalizedBaseMessages(locale);
        baseMessagesByLocale.set(locale, baseMessages);
      }

      const pageKey = `${locale}\0${profile.slug}`;
      const localizedTools =
        (baseMessages.tools as Record<string, unknown> | undefined) ?? {};
      const localizedToolBase =
        (localizedTools[profile.slug] as Record<string, unknown> | undefined) ??
        {};
      const localizedToolMessages =
        await dependencies.loadLocalizedToolMessages(locale, profile.slug);

      labelMessagesByPage.set(
        pageKey,
        buildToolWrapperTranslations({
          currentSlug: profile.slug,
          currentToolMessages: mergeMessageRecords(
            localizedToolBase,
            localizedToolMessages,
          ),
          toolSlugs,
          toolsCommon: localizedTools,
        }),
      );
    }
  }

  issues.push(
    ...validateReleaseReadyProfiles(
      releaseReadyProfiles,
      dependencies.loadEvidenceTestModule,
      (profile, locale, labelKey) =>
        {
          const value = resolveMessage(
            labelMessagesByPage.get(`${locale}\0${profile.slug}`) ?? {},
            labelKey,
          );
          return isNonEmptyString(value) ? value.trim() : undefined;
        },
    ),
  );

  const requiredReleaseProfile = options.requireReleaseReady
    ? releaseReadyProfiles.find(
        (profile) => profile.slug === options.requireReleaseReady,
      )
    : undefined;
  if (requiredReleaseProfile) {
    const hasStructuralEvidenceIssue = issues.some(
      (issue) =>
        issue.slug === requiredReleaseProfile.slug &&
        (issue.code.startsWith('release-ready-evidence-') ||
          issue.code === 'release-ready-category-evidence-required'),
    );
    if (!hasStructuralEvidenceIssue) {
      const evidenceReferences = [
        ...requiredReleaseProfile.evidenceTests,
        ...requiredReleaseProfile.modes.map(({ evidence }) => evidence),
        ...requiredReleaseProfile.acceptedInputs.map(({ evidence }) => evidence),
        ...requiredReleaseProfile.producedOutputs.map(({ evidence }) => evidence),
        ...requiredReleaseProfile.browserOnlyFeatures.map(
          ({ evidence }) => evidence,
        ),
        ...requiredReleaseProfile.optionalServerFeatures.map(
          ({ evidence }) => evidence,
        ),
        ...requiredReleaseProfile.limits.map(({ evidence }) => evidence),
        requiredReleaseProfile.supportedLocales.engine.evidence,
      ].filter(
        (evidence): evidence is CapabilityEvidenceReference =>
          Boolean(evidence),
      );
      const runEvidenceTest =
        dependencies.runEvidenceTest ?? runRepositoryEvidenceTest;

      for (const evidence of evidenceReferences) {
        const executionIssue = validateCapabilityEvidenceExecution(
          evidence,
          await runEvidenceTest(evidence),
        );
        if (executionIssue) {
          issues.push({
            locale: requiredReleaseProfile.supportedLocales.ui[0] ?? 'en',
            slug: requiredReleaseProfile.slug,
            ...executionIssue,
          });
        }
      }
    }
  }
  issues.sort(compareIssues);

  return {
    profileCount: dependencies.profiles.length,
    localePageCount: rows.length,
    issues,
    exitCode: issues.length === 0 ? 0 : 1,
  };
}

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function compareIssues(
  left: CapabilityValidationIssue,
  right: CapabilityValidationIssue,
): number {
  return (
    compareStrings(left.locale, right.locale) ||
    compareStrings(left.slug, right.slug) ||
    compareStrings(left.code, right.code) ||
    compareStrings(left.message, right.message)
  );
}

function appendString(values: string[], value: unknown): void {
  if (typeof value === 'string' && value.trim().length > 0) {
    values.push(value.trim());
  }
}

function appendStringArray(values: string[], value: unknown): void {
  if (!Array.isArray(value)) {
    return;
  }

  for (const item of value) {
    appendString(values, item);
  }
}

export function flattenToolMessages(messages: Record<string, unknown>): string {
  const values: string[] = [];

  appendString(values, messages.seo_title);
  appendString(values, messages.seo_description);
  appendString(values, messages.name);
  appendString(values, messages.description);
  appendString(values, messages.detailed_description);
  appendStringArray(values, messages.usage_steps);
  appendStringArray(values, messages.usage_examples);

  if (Array.isArray(messages.faqs)) {
    for (const faq of messages.faqs) {
      if (typeof faq !== 'object' || faq === null || Array.isArray(faq)) {
        continue;
      }

      appendString(values, (faq as Record<string, unknown>).question);
      appendString(values, (faq as Record<string, unknown>).answer);
    }
  }

  return values.join('\n');
}

export function validateCapabilityMessageMatrix(
  rows: Array<{
    locale: Locale;
    slug: string;
    messages: Record<string, unknown>;
  }>,
): CapabilityValidationIssue[] {
  return rows
    .flatMap((row) => {
      const report = assessToolCapabilityClaims({
        slug: row.slug,
        locale: row.locale,
        text: flattenToolMessages(row.messages),
      });

      return report.issues.map((issue) => ({
        locale: row.locale,
        slug: row.slug,
        code: issue.code,
        message: issue.message,
      }));
    })
    .sort(compareIssues);
}

export function validateReleaseReadyProfiles(
  profiles: readonly ToolCapabilityProfile[],
  loadEvidenceTestModule: (
    path: string,
  ) => RepositoryEvidenceTestModule | null,
  resolveLabel: (
    profile: ToolCapabilityProfile,
    locale: Locale,
    labelKey: string,
  ) => string | undefined,
): CapabilityValidationIssue[] {
  return profiles
    .filter((profile) => profile.enforcement === 'release-blocking')
    .flatMap((profile) => {
      const locale = profile.supportedLocales.ui[0] ?? 'en';
      const issues: CapabilityValidationIssue[] = [];
      const hasTopLevelEvidence = profile.evidenceTests.length > 0;

      if (!hasTopLevelEvidence) {
        issues.push({
          locale,
          slug: profile.slug,
          code: 'release-ready-evidence-required',
          message:
            'Release-blocking profile requires at least one top-level evidence test.',
        });
      }

      const categoryEvidence: Array<{
        subject: CapabilityEvidenceSubject;
        evidence?: CapabilityEvidenceReference;
      }> = [
        ...profile.modes.map((item) => ({
          subject: { slug: profile.slug, category: 'mode' as const, id: item.id },
          evidence: item.evidence,
        })),
        ...profile.acceptedInputs.map((item) => ({
          subject: {
            slug: profile.slug,
            category: 'accepted-input' as const,
            id: item.id,
          },
          evidence: item.evidence,
        })),
        ...profile.producedOutputs.map((item) => ({
          subject: {
            slug: profile.slug,
            category: 'produced-output' as const,
            id: item.id,
          },
          evidence: item.evidence,
        })),
        ...profile.browserOnlyFeatures.map((item) => ({
          subject: {
            slug: profile.slug,
            category: 'browser-feature' as const,
            id: item.id,
          },
          evidence: item.evidence,
        })),
        ...profile.optionalServerFeatures.map((item) => ({
          subject: {
            slug: profile.slug,
            category: 'optional-server-feature' as const,
            id: item.id,
          },
          evidence: item.evidence,
        })),
        ...profile.limits.map((item) => ({
          subject: { slug: profile.slug, category: 'limit' as const, id: item.id },
          evidence: item.evidence,
        })),
        {
          subject: {
            slug: profile.slug,
            category: 'engine',
            id: 'language-support',
          },
          evidence: profile.supportedLocales.engine.evidence,
        },
      ];

      for (const entry of categoryEvidence) {
        if (!entry.evidence) {
          issues.push({
            locale,
            slug: profile.slug,
            code: 'release-ready-category-evidence-required',
            message: `${entry.subject.category} ${JSON.stringify(entry.subject.id)} must name structured behavior-test evidence.`,
          });
          continue;
        }

        const evidenceIssue = validateCapabilityEvidenceReference(
          entry.subject,
          entry.evidence,
          loadEvidenceTestModule,
        );
        if (evidenceIssue) {
          issues.push({ locale, slug: profile.slug, ...evidenceIssue });
        }
      }

      for (const evidence of profile.evidenceTests) {
        const evidenceIssue = validateCapabilityEvidenceReference(
          {
            slug: profile.slug,
            category: 'profile',
            id: 'release-readiness',
          },
          evidence,
          loadEvidenceTestModule,
        );
        if (evidenceIssue) {
          issues.push({ locale, slug: profile.slug, ...evidenceIssue });
        }
      }

      const visibleLabelKeys = visibleCapabilityLabelKeys(profile);

      for (const uiLocale of profile.supportedLocales.ui) {
        for (const labelKey of visibleLabelKeys) {
          const label = resolveLabel(profile, uiLocale, labelKey);
          if (label) {
            const report = assessToolCapabilityClaims({
              slug: profile.slug,
              locale: uiLocale,
              text: label,
            });
            issues.push(
              ...report.issues.map((issue) => ({
                locale: uiLocale,
                slug: profile.slug,
                code: issue.code,
                message: `${issue.message} Visible capability label: ${labelKey}`,
              })),
            );
            continue;
          }

          issues.push({
            locale: uiLocale,
            slug: profile.slug,
            code: 'release-ready-label-unresolved',
            message: `Visible capability label does not resolve: ${labelKey}`,
          });
        }
      }

      return issues;
    })
    .sort(compareIssues);
}

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

const APPROVED_TEST_MODULE_PATH =
  /^(?:(?:src|scripts)\/.+\.test|(?:tests|e2e)\/.+\.(?:test|spec))\.(?:[cm]?[jt]sx?)$/u;

export function repositoryEvidenceTestModule(
  evidencePath: string,
  repositoryRoot = repoRoot,
): RepositoryEvidenceTestModule | null {
  try {
    const canonicalRoot = realpathSync(repositoryRoot);
    const requestedRelativePath = path.normalize(evidencePath);
    if (
      path.isAbsolute(evidencePath) ||
      !APPROVED_TEST_MODULE_PATH.test(requestedRelativePath)
    ) {
      return null;
    }
    const candidatePath = realpathSync(
      path.resolve(canonicalRoot, evidencePath),
    );
    const relativePath = path.relative(canonicalRoot, candidatePath);
    const isOutsideRepository =
      relativePath === '..' ||
      relativePath.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relativePath);

    if (isOutsideRepository || !statSync(candidatePath).isFile()) {
      return null;
    }

    const canonicalRelativePath = path.relative(canonicalRoot, candidatePath);
    if (!APPROVED_TEST_MODULE_PATH.test(canonicalRelativePath)) {
      return null;
    }

    return {
      file: canonicalRelativePath.split(path.sep).join('/'),
      source: readFileSync(candidatePath, 'utf8'),
    };
  } catch {
    return null;
  }
}

interface VitestJsonAssertion {
  title?: string;
  status?: string;
  failureMessages?: string[];
}

interface VitestJsonResult {
  testResults?: Array<{
    assertionResults?: VitestJsonAssertion[];
  }>;
}

export function runRepositoryEvidenceTest(
  evidence: CapabilityEvidenceReference,
  repositoryRoot = repoRoot,
): CapabilityEvidenceExecutionResult {
  const module = repositoryEvidenceTestModule(evidence.file, repositoryRoot);
  if (!module) {
    return {
      status: 'error',
      details: `Invalid evidence module: ${evidence.file}`,
    };
  }

  const canonicalRoot = realpathSync(repositoryRoot);
  const vitestModule = path.join(
    canonicalRoot,
    'node_modules/vitest/vitest.mjs',
  );
  if (!statSync(vitestModule, { throwIfNoEntry: false })?.isFile()) {
    return { status: 'error', details: 'Local Vitest module is unavailable.' };
  }

  const result = spawnSync(
    process.execPath,
    [
      vitestModule,
      'run',
      evidence.file,
      '--reporter=json',
      '--testNamePattern',
      escapeRegExp(evidence.testName),
    ],
    {
      cwd: canonicalRoot,
      encoding: 'utf8',
      env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
      maxBuffer: 10 * 1024 * 1024,
    },
  );

  if (result.error) {
    return { status: 'error', details: result.error.message };
  }

  let report: VitestJsonResult;
  try {
    report = JSON.parse(result.stdout) as VitestJsonResult;
  } catch {
    const output = `${result.stdout}\n${result.stderr}`.trim();
    return /no test|no tests|no test suite/iu.test(output)
      ? { status: 'not-collected', details: output }
      : { status: 'error', details: output || 'Vitest returned no JSON report.' };
  }

  const exactAssertions = (report.testResults ?? [])
    .flatMap(({ assertionResults }) => assertionResults ?? [])
    .filter(({ title }) => title === evidence.testName);
  if (exactAssertions.length === 0) {
    return { status: 'not-collected' };
  }
  if (exactAssertions.length > 1) {
    return {
      status: 'error',
      details: 'Multiple tests use the exact evidence test name.',
    };
  }

  const [assertion] = exactAssertions;
  if (assertion.status === 'passed' && result.status === 0) {
    return { status: 'passed' };
  }
  if (assertion.status === 'failed') {
    return {
      status: 'failed',
      details: assertion.failureMessages?.join('\n'),
    };
  }
  if (assertion.status === 'todo') {
    return { status: 'todo' };
  }
  if (assertion.status === 'skipped' || assertion.status === 'pending') {
    return { status: 'skipped' };
  }

  return {
    status: 'error',
    details: `Unexpected Vitest assertion status: ${String(assertion.status)}`,
  };
}

export function capabilityEvidenceMarker(
  subject: CapabilityEvidenceSubject,
): string {
  return `[capability:${subject.slug}:${subject.category}:${subject.id}]`;
}

export function validateCapabilityEvidenceReference(
  subject: CapabilityEvidenceSubject,
  evidence: CapabilityEvidenceReference,
  loadTestModule: (
    file: string,
  ) => RepositoryEvidenceTestModule | null,
): Pick<CapabilityValidationIssue, 'code' | 'message'> | null {
  const module = loadTestModule(evidence.file);
  if (!module) {
    return {
      code: 'release-ready-evidence-test-invalid',
      message: `Evidence must name an approved repository test module: ${evidence.file}`,
    };
  }

  const marker = capabilityEvidenceMarker(subject);
  if (!evidence.testName.includes(marker)) {
    return {
      code: 'release-ready-evidence-marker-mismatch',
      message: `Evidence test name must include ${marker}`,
    };
  }

  const sourceFile = ts.createSourceFile(
    module.file,
    module.source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const runnableTestNames = new Set<string>();
  const visit = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      (node.expression.text === 'it' || node.expression.text === 'test')
    ) {
      const [name] = node.arguments;
      if (name && ts.isStringLiteral(name)) {
        runnableTestNames.add(name.text);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  if (!runnableTestNames.has(evidence.testName)) {
    return {
      code: 'release-ready-evidence-test-not-runnable',
      message: `Evidence must be a direct runnable it/test declaration with the exact static name ${JSON.stringify(evidence.testName)} in ${module.file}`,
    };
  }

  return null;
}

export function validateCapabilityEvidenceExecution(
  evidence: CapabilityEvidenceReference,
  result: CapabilityEvidenceExecutionResult,
): Pick<CapabilityValidationIssue, 'code' | 'message'> | null {
  if (result.status === 'passed') {
    return null;
  }

  const codeByStatus: Record<
    Exclude<CapabilityEvidenceExecutionStatus, 'passed'>,
    string
  > = {
    failed: 'release-ready-evidence-test-failed',
    skipped: 'release-ready-evidence-test-skipped',
    todo: 'release-ready-evidence-test-todo',
    'not-collected': 'release-ready-evidence-test-not-collected',
    error: 'release-ready-evidence-test-cannot-run',
  };

  return {
    code: codeByStatus[result.status],
    message: `Evidence test ${JSON.stringify(evidence.testName)} in ${evidence.file} did not pass (${result.status})${result.details ? `: ${result.details}` : ''}`,
  };
}

const productionDependencies: ToolCapabilityClaimRunDependencies = {
  profiles: getPilotToolCapabilityProfiles(),
  locales,
  loadToolMessages: loadToolPageMessages,
  loadLocalizedBaseMessages: async (locale) =>
    (await readMessageFile(`${locale}/base.json`)) ?? {},
  loadLocalizedToolMessages: async (locale, slug) =>
    (await readMessageFile(`${locale}/tools/${slug}.json`)) ?? {},
  loadEvidenceTestModule: repositoryEvidenceTestModule,
  runEvidenceTest: runRepositoryEvidenceTest,
};

export async function runToolCapabilityClaimCli(
  argv: readonly string[] = process.argv.slice(2),
): Promise<ToolCapabilityClaimRunReport> {
  return runToolCapabilityClaimValidation(
    parseToolCapabilityClaimArgs(argv),
    productionDependencies,
  );
}

async function main(): Promise<void> {
  const report = await runToolCapabilityClaimCli();

  for (const issue of report.issues) {
    process.stderr.write(
      `${issue.locale}/tools/${issue.slug} ${issue.code}: ${issue.message}\n`,
    );
  }

  const status = report.issues.length === 0 ? 'passed' : 'failed';
  const summary = `Tool capability claims ${status}. profiles=${report.profileCount} localePages=${report.localePageCount} issues=${report.issues.length}\n`;
  if (report.issues.length === 0) {
    process.stdout.write(summary);
  } else {
    process.stderr.write(summary);
  }

  process.exitCode = report.exitCode;
}

const invokedPath = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href
  : '';
if (import.meta.url === invokedPath) {
  main().catch((error) => {
    process.stderr.write(
      `Fatal: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  });
}
