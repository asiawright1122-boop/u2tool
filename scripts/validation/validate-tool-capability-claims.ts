import { realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

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
  fileExists: (path: string) => boolean;
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
      dependencies.fileExists,
      (profile, locale, labelKey) =>
        isNonEmptyString(
          resolveMessage(
            labelMessagesByPage.get(`${locale}\0${profile.slug}`) ?? {},
            labelKey,
          ),
        ),
    ),
  );
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
  fileExists: (path: string) => boolean,
  labelResolves: (
    profile: ToolCapabilityProfile,
    locale: Locale,
    labelKey: string,
  ) => boolean,
): CapabilityValidationIssue[] {
  return profiles
    .filter((profile) => profile.enforcement === 'release-blocking')
    .flatMap((profile) => {
      const locale = profile.supportedLocales.ui[0] ?? 'en';
      const issues: CapabilityValidationIssue[] = [];
      const hasTopLevelEvidence = profile.evidenceTests.some(
        (evidenceTest) => evidenceTest.trim().length > 0,
      );

      if (!hasTopLevelEvidence) {
        issues.push({
          locale,
          slug: profile.slug,
          code: 'release-ready-evidence-required',
          message:
            'Release-blocking profile requires at least one top-level evidence test.',
        });
      }

      for (const [featureKind, features] of [
        ['Browser', profile.browserOnlyFeatures],
        ['Optional-server', profile.optionalServerFeatures],
      ] as const) {
        for (const feature of features) {
          if (feature.evidenceTest.trim().length > 0) {
            continue;
          }

          issues.push({
            locale,
            slug: profile.slug,
            code: 'release-ready-feature-evidence-required',
            message: `${featureKind} feature ${JSON.stringify(feature.id)} must name a non-empty evidence test.`,
          });
        }
      }

      const evidencePaths = new Set(
        [
          ...profile.evidenceTests,
          ...profile.browserOnlyFeatures.map(({ evidenceTest }) => evidenceTest),
          ...profile.optionalServerFeatures.map(
            ({ evidenceTest }) => evidenceTest,
          ),
        ]
          .map((evidenceTest) => evidenceTest.trim())
          .filter(Boolean),
      );

      for (const evidencePath of [...evidencePaths].sort(compareStrings)) {
        if (fileExists(evidencePath)) {
          continue;
        }

        issues.push({
          locale,
          slug: profile.slug,
          code: 'release-ready-evidence-file-missing',
          message: `Evidence test file does not exist: ${evidencePath}`,
        });
      }

      const visibleLabelKeys = visibleCapabilityLabelKeys(profile);

      for (const uiLocale of profile.supportedLocales.ui) {
        for (const labelKey of visibleLabelKeys) {
          if (labelResolves(profile, uiLocale, labelKey)) {
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

export function repositoryEvidenceFileExists(
  evidencePath: string,
  repositoryRoot = repoRoot,
): boolean {
  try {
    const canonicalRoot = realpathSync(repositoryRoot);
    const candidatePath = realpathSync(
      path.resolve(canonicalRoot, evidencePath),
    );
    const relativePath = path.relative(canonicalRoot, candidatePath);
    const isOutsideRepository =
      relativePath === '..' ||
      relativePath.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relativePath);

    return !isOutsideRepository && statSync(candidatePath).isFile();
  } catch {
    return false;
  }
}

const productionDependencies: ToolCapabilityClaimRunDependencies = {
  profiles: getPilotToolCapabilityProfiles(),
  locales,
  loadToolMessages: loadToolPageMessages,
  loadLocalizedBaseMessages: async (locale) =>
    (await readMessageFile(`${locale}/base.json`)) ?? {},
  loadLocalizedToolMessages: async (locale, slug) =>
    (await readMessageFile(`${locale}/tools/${slug}.json`)) ?? {},
  fileExists: repositoryEvidenceFileExists,
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
