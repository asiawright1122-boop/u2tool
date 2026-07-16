import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import {
  getPilotToolCapabilityProfiles,
  getToolCapabilityProfile,
  type ToolCapabilityProfile,
} from '../../src/config/tool-capabilities';
import { locales, type Locale } from '../../src/lib/i18n';
import { assessToolCapabilityClaims } from '../../src/lib/tool-capability-claims';
import { loadToolPageMessages } from '../../src/lib/translations';

export interface LocaleCapabilityIssue {
  locale: string;
  slug: string;
  code:
    | 'missing-disclosure'
    | 'native-language-overclaim'
    | 'missing-fixtures';
  message: string;
}

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

function hasLocaleFixtureEvidence(
  slug: string,
  locale: string,
  evidenceTests: readonly string[],
): boolean {
  const fixturePath = `src/lib/fixtures/${slug}/${locale}.ts`;
  const absoluteFixturePath = path.join(repositoryRoot, fixturePath);
  const fixtureReference = `fixtures/${slug}/${locale}`;
  const evidenceSources = evidenceTests.flatMap((evidencePath) => {
    const absoluteEvidencePath = path.resolve(repositoryRoot, evidencePath);
    const relativeEvidencePath = path.relative(
      repositoryRoot,
      absoluteEvidencePath,
    );
    if (
      path.isAbsolute(evidencePath) ||
      relativeEvidencePath === '..' ||
      relativeEvidencePath.startsWith(`..${path.sep}`) ||
      !/\.test\.[cm]?[jt]sx?$/u.test(relativeEvidencePath) ||
      !existsSync(absoluteEvidencePath)
    ) {
      return [];
    }

    return [readFileSync(absoluteEvidencePath, 'utf8')];
  });

  const fixtureDirectory = path.dirname(absoluteFixturePath);
  if (existsSync(fixtureDirectory)) {
    return (
      existsSync(absoluteFixturePath) &&
      evidenceSources.some((source) => source.includes(fixtureReference))
    );
  }

  const engineMarker = `[capability:${slug}:engine:language-support]`;
  return evidenceSources.some((source) => {
    if (!source.includes(engineMarker)) {
      return false;
    }
    if (locale === 'en') {
      return true;
    }

    const localeLiteral = new RegExp(
      `(?:["']${locale}["']|\\b${locale}\\s*:)`,
      'u',
    );
    return (
      localeLiteral.test(source) &&
      /(?:fixture|prompt|sample|input|output|message)/iu.test(source)
    );
  });
}

function flattenMessageStrings(value: unknown, values: string[] = []): string {
  if (typeof value === 'string') {
    values.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) {
      flattenMessageStrings(item, values);
    }
  } else if (typeof value === 'object' && value !== null) {
    for (const item of Object.values(value)) {
      flattenMessageStrings(item, values);
    }
  }

  return values.join('\n');
}

function hasEngineLanguageDisclosure(
  slug: string,
  locale: string,
  messages: Record<string, unknown>,
): boolean {
  const text = flattenMessageStrings(messages);
  const englishLanguageByLocale: Readonly<Record<string, RegExp>> = {
    en: /\bEnglish\b/iu,
    zh: /(?:英语|英文)/u,
    ja: /英語/u,
    ko: /영어/u,
    es: /\bingl(?:és|esa|eses|esas)\b/iu,
    pt: /\bingl(?:ês|esa|eses|esas)\b/iu,
    fr: /\banglai(?:s|se|ses)\b/iu,
    de: /\benglisch\p{L}*\b/iu,
    ru: /английск\p{L}*/iu,
    ar: /(?:إنجليزي|إنجليزية|الإنجليزي|الإنجليزية)/u,
  };
  const grammarInputByLocale: Readonly<Record<string, RegExp>> = {
    en: /\b(?:text|input)\b/iu,
    zh: /(?:文本|输入)/u,
    ja: /(?:テキスト|入力)/u,
    ko: /(?:텍스트|입력)/u,
    es: /\b(?:texto|entrada)\b/iu,
    pt: /\b(?:texto|entrada)\b/iu,
    fr: /\b(?:texte|saisie)\b/iu,
    de: /\b(?:Text|Eingabe)\p{L}*\b/iu,
    ru: /(?:текст|ввод)\p{L}*/iu,
    ar: /(?:نص|إدخال)/u,
  };
  const diagnosticOutputByLocale: Readonly<Record<string, RegExp>> = {
    en: /\b(?:diagnostic|explanation|finding)\p{L}*\b/iu,
    zh: /(?:诊断|说明|结果)/u,
    ja: /(?:診断|説明|指摘)/u,
    ko: /(?:진단|설명|결과)/u,
    es: /\b(?:diagnóstic|explicaci|hallazgo)\p{L}*\b/iu,
    pt: /\b(?:diagnóstic|explicaç|achado)\p{L}*\b/iu,
    fr: /\b(?:diagnostic|explication|constat)\p{L}*\b/iu,
    de: /\b(?:Diagnose|Erklärung|Hinweis)\p{L}*\b/iu,
    ru: /(?:диагност|объяснен|замечан)\p{L}*/iu,
    ar: /(?:تشخيص|تفسير|نتائج)/u,
  };
  const languagePattern = englishLanguageByLocale[locale];
  const boundaryPattern =
    slug === 'grammar-checker'
      ? grammarInputByLocale[locale]
      : slug === 'sql-query-optimizer'
        ? diagnosticOutputByLocale[locale]
        : undefined;

  if (languagePattern && boundaryPattern) {
    return languagePattern.test(text) && boundaryPattern.test(text);
  }

  return false;
}

export interface ToolLocaleCapabilityRunDependencies {
  profiles: readonly ToolCapabilityProfile[];
  locales: readonly string[];
  loadMergedMessages: (
    locale: string,
    slug: string,
  ) => Promise<Record<string, unknown>>;
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
  if (profile.supportedLocales.engine.kind === 'language-neutral') {
    return [];
  }

  const issues: LocaleCapabilityIssue[] = [];
  const isLocalEngineLocale = (
    profile.supportedLocales.engine.local as readonly string[]
  ).includes(input.locale);
  const messageText = flattenMessageStrings(input.mergedMessages);

  const nativeLanguageOverclaim = assessToolCapabilityClaims({
    locale: input.locale,
    slug: input.slug,
    text: messageText,
  }).issues.find(
    ({ code }) => code === 'grammar-checker-native-non-english-claim',
  );
  if (nativeLanguageOverclaim) {
    issues.push({
      locale: input.locale,
      slug: input.slug,
      code: 'native-language-overclaim',
      message: nativeLanguageOverclaim.message,
    });
  }

  if (
    !isLocalEngineLocale &&
    !hasEngineLanguageDisclosure(
      input.slug,
      input.locale,
      input.mergedMessages,
    )
  ) {
    issues.push({
      locale: input.locale,
      slug: input.slug,
      code: 'missing-disclosure',
      message:
        'Localized UI copy must explicitly disclose the supported engine language.',
    });
  }

  if (
    profile.enforcement === 'release-blocking' &&
    isLocalEngineLocale &&
    !hasLocaleFixtureEvidence(
      input.slug,
      input.locale,
      input.evidenceTests,
    )
  ) {
    issues.push({
      locale: input.locale,
      slug: input.slug,
      code: 'missing-fixtures',
      message: `Release-blocking local engine locale ${input.locale} lacks matching fixture-backed test evidence.`,
    });
  }

  return issues;
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
  const evidence = [
    ...profile.evidenceTests,
    ...profile.modes.map((item) => item.evidence),
    ...profile.acceptedInputs.map((item) => item.evidence),
    ...profile.producedOutputs.map((item) => item.evidence),
    ...profile.browserOnlyFeatures.map((item) => item.evidence),
    ...profile.optionalServerFeatures.map((item) => item.evidence),
    ...profile.limits.map((item) => item.evidence),
    profile.supportedLocales.engine.evidence,
  ];

  return [...new Set(evidence.flatMap((item) => (item ? [item.file] : [])))];
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
  let localePageCount = 0;

  for (const profile of dependencies.profiles) {
    const evidenceTests = flattenProfileEvidenceTestFiles(profile);
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
            evidenceTests,
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
