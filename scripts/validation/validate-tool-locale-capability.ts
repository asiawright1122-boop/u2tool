import { readFileSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  type CapabilityEvidenceReference,
  getPilotToolCapabilityProfiles,
  getToolCapabilityProfile,
  type ToolCapabilityProfile,
} from '../../src/config/tool-capabilities';
import type {
  EngineLocaleDataEvidence,
  EngineLocaleEvidenceContract,
} from '../../src/config/tool-capabilities/types';
import { locales, type Locale } from '../../src/lib/i18n';
import { loadToolPageMessages } from '../../src/lib/translations';
import {
  type CapabilityEvidenceExecutionResult,
  repositoryEvidenceTestModule,
  type RepositoryEvidenceTestModule,
  runRepositoryEvidenceTest,
  validateCapabilityEvidenceReference,
  validateCapabilityEvidenceExecution,
} from './validate-tool-capability-claims';

export interface LocaleCapabilityIssue {
  locale: string;
  slug: string;
  code:
    | 'missing-disclosure'
    | 'native-language-overclaim'
    | 'missing-fixtures';
  message: string;
}

const defaultRepositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

const URI_SCHEME = /^[A-Za-z][A-Za-z\d+.-]*:/u;
let fixtureImportSequence = 0;

function profileEvidenceReferences(
  profile: ToolCapabilityProfile,
): CapabilityEvidenceReference[] {
  const engine = profile.supportedLocales.engine;
  return [
    ...profile.evidenceTests,
    ...profile.modes.flatMap(({ evidence }) => (evidence ? [evidence] : [])),
    ...profile.acceptedInputs.flatMap(({ evidence }) =>
      evidence ? [evidence] : [],
    ),
    ...profile.producedOutputs.flatMap(({ evidence }) =>
      evidence ? [evidence] : [],
    ),
    ...profile.browserOnlyFeatures.flatMap(({ evidence }) =>
      evidence ? [evidence] : [],
    ),
    ...profile.optionalServerFeatures.flatMap(({ evidence }) =>
      evidence ? [evidence] : [],
    ),
    ...profile.limits.flatMap(({ evidence }) => (evidence ? [evidence] : [])),
    ...(engine.evidence ? [engine.evidence] : []),
    ...(engine.kind === 'engine-limited'
      ? engine.localeEvidence.map(({ evidence }) => evidence)
      : []),
  ];
}

function flattenNonEmptyStrings(value: unknown): string[] {
  if (typeof value === 'string') return value.trim() ? [value.trim()] : [];
  if (Array.isArray(value)) return value.flatMap(flattenNonEmptyStrings);
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(flattenNonEmptyStrings);
  }
  return [];
}

function resolveMessagePath(
  root: unknown,
  pathParts: readonly string[],
): unknown {
  return pathParts.reduce<unknown>(
    (value, part) =>
      value && typeof value === 'object'
        ? (value as Record<string, unknown>)[part]
        : undefined,
    root,
  );
}

function isOutsideRepository(
  canonicalRoot: string,
  candidatePath: string,
): boolean {
  const relativePath = path.relative(canonicalRoot, candidatePath);
  return (
    relativePath === '..' ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  );
}

function resolveRepositoryDataFile(input: {
  repositoryRoot: string;
  repositoryPath: string;
  allowedExtensions: readonly string[];
}): string | null {
  try {
    if (
      !input.repositoryPath.trim() ||
      path.isAbsolute(input.repositoryPath) ||
      path.win32.isAbsolute(input.repositoryPath) ||
      URI_SCHEME.test(input.repositoryPath) ||
      input.repositoryPath.split(/[\\/]/u).includes('..')
    ) {
      return null;
    }

    const requestedExtension = path.extname(input.repositoryPath);
    if (!input.allowedExtensions.includes(requestedExtension)) {
      return null;
    }

    const canonicalRoot = realpathSync(input.repositoryRoot);
    const requestedPath = path.resolve(canonicalRoot, input.repositoryPath);
    if (isOutsideRepository(canonicalRoot, requestedPath)) {
      return null;
    }

    const canonicalPath = realpathSync(requestedPath);
    if (
      isOutsideRepository(canonicalRoot, canonicalPath) ||
      !statSync(canonicalPath).isFile() ||
      !input.allowedExtensions.includes(path.extname(canonicalPath))
    ) {
      return null;
    }

    return canonicalPath;
  } catch {
    return null;
  }
}

async function validateFixtureObjectData(
  data: Extract<EngineLocaleDataEvidence, { kind: 'fixture-object' }>,
  repositoryRoot: string,
): Promise<boolean> {
  const fixturePath = resolveRepositoryDataFile({
    repositoryRoot,
    repositoryPath: data.file,
    allowedExtensions: ['.ts', '.js'],
  });
  if (!fixturePath) return false;

  try {
    const moduleUrl = pathToFileURL(fixturePath);
    moduleUrl.searchParams.set(
      'locale-evidence-read',
      String(++fixtureImportSequence),
    );
    const fixtureModule = (await import(moduleUrl.href)) as Record<
      string,
      unknown
    >;
    return (
      flattenNonEmptyStrings(fixtureModule[data.exportName]).length >=
      data.minimumNonEmptyValues
    );
  } catch {
    return false;
  }
}

function validateMessagePromptBankData(
  contract: EngineLocaleEvidenceContract,
  data: Extract<EngineLocaleDataEvidence, { kind: 'message-prompt-bank' }>,
  repositoryRoot: string,
): boolean {
  const promptPath = resolveRepositoryDataFile({
    repositoryRoot,
    repositoryPath: data.fileTemplate.replace('{locale}', contract.locale),
    allowedExtensions: ['.json'],
  });
  if (!promptPath) return false;

  try {
    const messages = JSON.parse(readFileSync(promptPath, 'utf8')) as unknown;
    return (
      flattenNonEmptyStrings(resolveMessagePath(messages, data.messagePath))
        .length >= data.minimumNonEmptyEntries
    );
  } catch {
    return false;
  }
}

async function validateLocaleDataContract(
  contract: EngineLocaleEvidenceContract,
  repositoryRoot: string,
): Promise<boolean> {
  if (contract.data.kind === 'behavior-test') return true;
  if (contract.data.kind === 'fixture-object') {
    return validateFixtureObjectData(contract.data, repositoryRoot);
  }
  return validateMessagePromptBankData(
    contract,
    contract.data,
    repositoryRoot,
  );
}

function localeDataDeclarationLocator(
  contract: EngineLocaleEvidenceContract,
): string {
  const data = contract.data;
  if (data.kind === 'fixture-object') {
    return [
      `fixture file ${JSON.stringify(data.file)}`,
      `export ${JSON.stringify(data.exportName)}`,
    ].join(' ');
  }
  if (data.kind === 'message-prompt-bank') {
    return [
      `prompt template ${JSON.stringify(data.fileTemplate)}`,
      `resolved file ${JSON.stringify(data.fileTemplate.replace('{locale}', contract.locale))}`,
      `message path ${JSON.stringify(data.messagePath.join('.'))}`,
    ].join(' ');
  }
  return [
    `behavior-test evidence ${JSON.stringify(contract.evidence.testName)}`,
    `in ${JSON.stringify(contract.evidence.file)}`,
  ].join(' ');
}

function evidenceExecutionKey(
  evidence: CapabilityEvidenceReference,
): string {
  return `${evidence.file}\u0000${evidence.testName}`;
}

function failedEvidenceResult(error: unknown): CapabilityEvidenceExecutionResult {
  return {
    status: 'error',
    details: error instanceof Error ? error.message : String(error),
  };
}

async function validateProfileLocaleEvidence(input: {
  profile: ToolCapabilityProfile;
  repositoryRoot: string;
  loadEvidenceTestModule: (
    file: string,
  ) => RepositoryEvidenceTestModule | null;
  runEvidenceTest: (
    evidence: CapabilityEvidenceReference,
  ) =>
    | CapabilityEvidenceExecutionResult
    | Promise<CapabilityEvidenceExecutionResult>;
  executionCache: Map<
    string,
    Promise<CapabilityEvidenceExecutionResult>
  >;
}): Promise<LocaleCapabilityIssue[]> {
  const engine = input.profile.supportedLocales.engine;
  if (
    input.profile.enforcement !== 'release-blocking' ||
    engine.kind !== 'engine-limited'
  ) {
    return [];
  }

  const issues: LocaleCapabilityIssue[] = [];
  for (const contract of engine.localeEvidence) {
    const structuralIssue = validateCapabilityEvidenceReference(
      {
        slug: input.profile.slug,
        category: 'engine',
        id: 'language-support',
      },
      contract.evidence,
      input.loadEvidenceTestModule,
    );

    const key = evidenceExecutionKey(contract.evidence);
    let executionPromise = input.executionCache.get(key);
    if (!executionPromise) {
      executionPromise = Promise.resolve()
        .then(() => input.runEvidenceTest(contract.evidence))
        .catch(failedEvidenceResult);
      input.executionCache.set(key, executionPromise);
    }
    const [execution, dataIsValid] = await Promise.all([
      executionPromise,
      validateLocaleDataContract(contract, input.repositoryRoot),
    ]);

    const failureReasons: string[] = [];
    if (structuralIssue) failureReasons.push(structuralIssue.message);
    const executionIssue = validateCapabilityEvidenceExecution(
      contract.evidence,
      execution,
    );
    if (executionIssue) failureReasons.push(executionIssue.message);
    if (!dataIsValid) {
      failureReasons.push('declared data did not meet its contract');
    }

    if (failureReasons.length > 0) {
      issues.push({
        locale: contract.locale,
        slug: input.profile.slug,
        code: 'missing-fixtures',
        message: `Engine locale ${contract.locale} ${localeDataDeclarationLocator(contract)} is not release-ready: ${failureReasons.join('; ')}.`,
      });
    }
  }

  return issues;
}

export interface ToolLocaleCapabilityRunDependencies {
  profiles: readonly ToolCapabilityProfile[];
  locales: readonly string[];
  repositoryRoot?: string;
  loadMergedMessages: (
    locale: string,
    slug: string,
  ) => Promise<Record<string, unknown>>;
  loadEvidenceTestModule?: (
    file: string,
  ) => RepositoryEvidenceTestModule | null;
  runEvidenceTest?: (
    evidence: CapabilityEvidenceReference,
  ) =>
    | CapabilityEvidenceExecutionResult
    | Promise<CapabilityEvidenceExecutionResult>;
}

export interface ToolLocaleCapabilityRunReport {
  profileCount: number;
  localePageCount: number;
  issues: LocaleCapabilityIssue[];
  notReleaseReadyProfiles: string[];
  exitCode: 0 | 1;
}

type ToolLocaleCapabilityInput = {
  locale: string;
  slug: string;
  mergedMessages: Record<string, unknown>;
  evidenceTests: readonly string[];
};

function validateToolLocaleCapabilityAgainstProfile(
  input: ToolLocaleCapabilityInput,
  profile: ToolCapabilityProfile,
): LocaleCapabilityIssue[] {
  const engine = profile.supportedLocales.engine;
  if (engine.kind === 'language-neutral') return [];

  const supportedEngineLocales = [
    ...engine.local,
    ...engine.optionalServer,
  ] as readonly string[];
  if (supportedEngineLocales.includes(input.locale)) return [];

  const disclosurePrefix = `tools.${profile.slug}.`;
  const disclosureValue = engine.disclosure.labelKey.startsWith(
    disclosurePrefix,
  )
    ? resolveMessagePath(
        input.mergedMessages,
        engine.disclosure.labelKey
          .slice(disclosurePrefix.length)
          .split('.'),
      )
    : undefined;
  if (typeof disclosureValue === 'string' && disclosureValue.trim()) {
    return [];
  }

  return [
    {
      locale: input.locale,
      slug: input.slug,
      code: 'missing-disclosure',
      message: `Declared engine disclosure ${JSON.stringify(engine.disclosure.labelKey)} must resolve to a non-empty tool-local message.`,
    },
  ];
}

export function validateToolLocaleCapability(
  input: ToolLocaleCapabilityInput,
): LocaleCapabilityIssue[] {
  const profile = getToolCapabilityProfile(input.slug);
  return profile
    ? validateToolLocaleCapabilityAgainstProfile(input, profile)
    : [];
}

export function flattenProfileEvidenceTestFiles(
  profile: ToolCapabilityProfile,
): string[] {
  return [
    ...new Set(profileEvidenceReferences(profile).map(({ file }) => file)),
  ];
}

function compareIssues(
  left: LocaleCapabilityIssue,
  right: LocaleCapabilityIssue,
): number {
  return (
    left.locale.localeCompare(right.locale) ||
    left.slug.localeCompare(right.slug) ||
    left.code.localeCompare(right.code) ||
    left.message.localeCompare(right.message)
  );
}

export async function runToolLocaleCapabilityValidation(
  dependencies: ToolLocaleCapabilityRunDependencies,
): Promise<ToolLocaleCapabilityRunReport> {
  const issues: LocaleCapabilityIssue[] = [];
  const repositoryRoot =
    dependencies.repositoryRoot ?? defaultRepositoryRoot;
  const loadEvidenceTestModule =
    dependencies.loadEvidenceTestModule ??
    ((file: string) => repositoryEvidenceTestModule(file, repositoryRoot));
  const runEvidenceTest =
    dependencies.runEvidenceTest ??
    ((evidence: CapabilityEvidenceReference) =>
      runRepositoryEvidenceTest(evidence, repositoryRoot));
  const executionCache = new Map<
    string,
    Promise<CapabilityEvidenceExecutionResult>
  >();
  let localePageCount = 0;

  for (const profile of dependencies.profiles) {
    issues.push(
      ...(await validateProfileLocaleEvidence({
        profile,
        repositoryRoot,
        loadEvidenceTestModule,
        runEvidenceTest,
        executionCache,
      })),
    );

    for (const locale of dependencies.locales) {
      localePageCount += 1;
      issues.push(
        ...validateToolLocaleCapabilityAgainstProfile(
          {
            locale,
            slug: profile.slug,
            mergedMessages: await dependencies.loadMergedMessages(
              locale,
              profile.slug,
            ),
            evidenceTests: [],
          },
          profile,
        ),
      );
    }
  }

  issues.sort(compareIssues);
  const notReleaseReadyProfiles = dependencies.profiles
    .filter(({ enforcement }) => enforcement === 'inventory')
    .map(({ slug }) => slug)
    .sort();

  return {
    profileCount: dependencies.profiles.length,
    localePageCount,
    issues,
    notReleaseReadyProfiles,
    exitCode: issues.length === 0 ? 0 : 1,
  };
}

export function runToolLocaleCapabilityCli(): Promise<ToolLocaleCapabilityRunReport> {
  return runToolLocaleCapabilityValidation({
    profiles: getPilotToolCapabilityProfiles(),
    locales,
    loadMergedMessages: (locale, slug) =>
      loadToolPageMessages(locale as Locale, slug),
  });
}

async function main(): Promise<void> {
  const report = await runToolLocaleCapabilityCli();

  for (const issue of report.issues) {
    process.stderr.write(
      `${issue.locale}/tools/${issue.slug} ${issue.code}: ${issue.message}\n`,
    );
  }
  for (const slug of report.notReleaseReadyProfiles) {
    process.stdout.write(
      `${slug} not release-ready: inventory enforcement\n`,
    );
  }

  const status = report.issues.length === 0 ? 'passed' : 'failed';
  const summary = `Tool locale capability ${status}. profiles=${report.profileCount} localePages=${report.localePageCount} issues=${report.issues.length} notReleaseReady=${report.notReleaseReadyProfiles.length}\n`;
  (report.issues.length === 0 ? process.stdout : process.stderr).write(summary);
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
