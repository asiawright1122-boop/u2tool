import { describe, expect, it } from 'vitest';

import {
  getToolCapabilityProfile,
  type ToolCapabilityProfile,
} from '../../src/config/tool-capabilities';
import {
  loadToolPageMessages,
  readMessageFile,
} from '../../src/lib/translations';
import {
  flattenToolMessages,
  parseToolCapabilityClaimArgs,
  repositoryEvidenceFileExists,
  runToolCapabilityClaimValidation,
  validateCapabilityMessageMatrix,
  validateReleaseReadyProfiles,
} from './validate-tool-capability-claims';

function releaseBlockingGrammarProfile(
  overrides: Partial<ToolCapabilityProfile> = {},
): ToolCapabilityProfile {
  const inventoryProfile = getToolCapabilityProfile('grammar-checker');
  if (!inventoryProfile) {
    throw new Error('Missing grammar-checker fixture profile');
  }

  return {
    ...inventoryProfile,
    enforcement: 'release-blocking',
    evidenceTests: ['tests/grammar-checker.test.ts'],
    browserOnlyFeatures: inventoryProfile.browserOnlyFeatures.map((feature) => ({
      ...feature,
      evidenceTest: 'tests/grammar-checker.test.ts',
    })),
    ...overrides,
  };
}

describe('flattenToolMessages', () => {
  it('scans only searchable SEO and support copy', () => {
    const flattened = flattenToolMessages({
      seo_title: 'SEO title',
      seo_description: 'SEO description',
      name: 'Tool name',
      description: 'Short description',
      detailed_description: 'Detailed description',
      usage_steps: ['First step', 'Second step'],
      usage_examples: ['First example', 'Second example'],
      faqs: [
        { question: 'First question?', answer: 'First answer.' },
        { question: 'Second question?', answer: 'Second answer.' },
      ],
      capabilities: {
        limits: { unsupported: 'Ignored capability limit' },
      },
      inputPlaceholder: 'Ignored UI control',
    });

    expect(flattened).toBe(
      [
        'SEO title',
        'SEO description',
        'Tool name',
        'Short description',
        'Detailed description',
        'First step',
        'Second step',
        'First example',
        'Second example',
        'First question?',
        'First answer.',
        'Second question?',
        'Second answer.',
      ].join('\n'),
    );
  });
});

describe('validateCapabilityMessageMatrix', () => {
  it('accepts truthful English-only disclosure copy', () => {
    expect(
      validateCapabilityMessageMatrix([
        {
          locale: 'en',
          slug: 'grammar-checker',
          messages: {
            seo_title: 'Local English Grammar Checker',
            description:
              'Checks English text with browser-based static rules and does not use AI.',
          },
        },
      ]),
    ).toEqual([]);
  });

  it('preserves the governed issue for a native Russian grammar claim', () => {
    expect(
      validateCapabilityMessageMatrix([
        {
          locale: 'ru',
          slug: 'grammar-checker',
          messages: {
            detailed_description:
              'Инструмент проверяет русскую грамматику прямо в браузере.',
          },
        },
      ]),
    ).toEqual([
      {
        locale: 'ru',
        slug: 'grammar-checker',
        code: 'grammar-checker-native-non-english-claim',
        message: 'The local grammar engine only checks English text.',
      },
    ]);
  });

  it('orders issues deterministically by locale, slug, and code', () => {
    expect(
      validateCapabilityMessageMatrix([
        {
          locale: 'ru',
          slug: 'grammar-checker',
          messages: {
            description:
              'Проверяет русскую грамматику and is AI-powered.',
          },
        },
        {
          locale: 'en',
          slug: 'grammar-checker',
          messages: {
            description: 'Provides multilingual grammar checking.',
          },
        },
      ]).map(({ locale, slug, code }) => `${locale}/${slug}/${code}`),
    ).toEqual([
      'en/grammar-checker/grammar-checker-native-non-english-claim',
      'ru/grammar-checker/grammar-checker-ai-claim',
      'ru/grammar-checker/grammar-checker-native-non-english-claim',
    ]);
  });
});

describe('validateReleaseReadyProfiles', () => {
  it('allows inventory profiles to omit behavior evidence', () => {
    const inventoryProfile = getToolCapabilityProfile('grammar-checker');
    expect(inventoryProfile).toBeDefined();

    expect(
      validateReleaseReadyProfiles(
        [inventoryProfile!],
        () => false,
        () => false,
      ),
    ).toEqual([]);
  });

  it('requires non-empty top-level evidence for release-blocking profiles', () => {
    const profile = releaseBlockingGrammarProfile({ evidenceTests: [] });

    expect(
      validateReleaseReadyProfiles(
        [profile],
        () => true,
        () => true,
      ),
    ).toEqual([
      {
        locale: 'en',
        slug: 'grammar-checker',
        code: 'release-ready-evidence-required',
        message:
          'Release-blocking profile requires at least one top-level evidence test.',
      },
    ]);
  });

  it('requires every browser and optional-server feature to name evidence', () => {
    const base = releaseBlockingGrammarProfile();
    const profile: ToolCapabilityProfile = {
      ...base,
      browserOnlyFeatures: [
        { ...base.browserOnlyFeatures[0], evidenceTest: '' },
        ...base.browserOnlyFeatures.slice(1),
      ],
      optionalServerFeatures: [
        {
          id: 'optional-review',
          labelKey:
            'tools.grammar-checker.capabilities.features.englishLocalRules',
          evidenceTest: '   ',
        },
      ],
    };

    expect(
      validateReleaseReadyProfiles(
        [profile],
        () => true,
        () => true,
      ),
    ).toEqual([
      {
        locale: 'en',
        slug: 'grammar-checker',
        code: 'release-ready-feature-evidence-required',
        message:
          'Browser feature "english-local-rules" must name a non-empty evidence test.',
      },
      {
        locale: 'en',
        slug: 'grammar-checker',
        code: 'release-ready-feature-evidence-required',
        message:
          'Optional-server feature "optional-review" must name a non-empty evidence test.',
      },
    ]);
  });

  it('requires every named top-level and feature evidence file to exist', () => {
    const base = releaseBlockingGrammarProfile();
    const profile: ToolCapabilityProfile = {
      ...base,
      evidenceTests: ['tests/top-level.test.ts'],
      browserOnlyFeatures: [
        {
          ...base.browserOnlyFeatures[0],
          evidenceTest: 'tests/missing-feature.test.ts',
        },
        ...base.browserOnlyFeatures.slice(1).map((feature) => ({
          ...feature,
          evidenceTest: 'tests/top-level.test.ts',
        })),
      ],
    };

    expect(
      validateReleaseReadyProfiles(
        [profile],
        (path) => path !== 'tests/missing-feature.test.ts',
        () => true,
      ),
    ).toEqual([
      {
        locale: 'en',
        slug: 'grammar-checker',
        code: 'release-ready-evidence-file-missing',
        message:
          'Evidence test file does not exist: tests/missing-feature.test.ts',
      },
    ]);
  });

  it('requires every visible shared and profile label in every UI locale', () => {
    const profile = releaseBlockingGrammarProfile();

    expect(
      validateReleaseReadyProfiles(
        [profile],
        () => true,
        (_profile, locale, labelKey) =>
          !(
            (locale === 'de' &&
              labelKey === 'tools.capabilityDisclosure.title') ||
            (locale === 'ru' &&
              labelKey ===
                'tools.grammar-checker.capabilities.inputs.plainText')
          ),
      ),
    ).toEqual([
      {
        locale: 'de',
        slug: 'grammar-checker',
        code: 'release-ready-label-unresolved',
        message:
          'Visible capability label does not resolve: tools.capabilityDisclosure.title',
      },
      {
        locale: 'ru',
        slug: 'grammar-checker',
        code: 'release-ready-label-unresolved',
        message:
          'Visible capability label does not resolve: tools.grammar-checker.capabilities.inputs.plainText',
      },
    ]);
  });

  it('does not require dormant optional-server or unsupported-language labels', () => {
    const profile = releaseBlockingGrammarProfile();

    expect(
      validateReleaseReadyProfiles(
        [profile],
        () => true,
        (_profile, _locale, labelKey) =>
          ![
            'tools.capabilityDisclosure.optionalServer',
            'tools.capabilityDisclosure.privacyServer',
            'tools.capabilityDisclosure.languages.ru',
          ].includes(labelKey),
      ),
    ).toEqual([]);
  });
});

describe('parseToolCapabilityClaimArgs', () => {
  it('parses a named release-ready requirement', () => {
    expect(
      parseToolCapabilityClaimArgs([
        '--require-release-ready',
        'grammar-checker',
      ]),
    ).toEqual({ requireReleaseReady: 'grammar-checker' });
  });
});

describe('repositoryEvidenceFileExists', () => {
  it('accepts only regular files inside the repository', () => {
    expect(repositoryEvidenceFileExists('package.json')).toBe(true);
    expect(repositoryEvidenceFileExists('.')).toBe(false);
    expect(repositoryEvidenceFileExists('/etc/passwd')).toBe(false);
  });
});

describe('runToolCapabilityClaimValidation', () => {
  it('resolves release labels through the real Task 3 wrapper message shape', async () => {
    const base = releaseBlockingGrammarProfile();
    const profile: ToolCapabilityProfile = {
      ...base,
      supportedLocales: {
        ...base.supportedLocales,
        ui: ['en'],
      },
    };

    const report = await runToolCapabilityClaimValidation(
      { requireReleaseReady: 'grammar-checker' },
      {
        profiles: [profile],
        locales: ['en'],
        loadToolMessages: loadToolPageMessages,
        loadLocalizedBaseMessages: async () =>
          (await readMessageFile('en/base.json')) ?? {},
        loadLocalizedToolMessages: async () =>
          (await readMessageFile('en/tools/grammar-checker.json')) ?? {},
        fileExists: () => true,
      },
    );

    expect(report).toEqual({
      profileCount: 1,
      localePageCount: 1,
      issues: [],
      exitCode: 0,
    });
  });

  it('does not accept an English-fallback tool label as localized release evidence', async () => {
    const base = releaseBlockingGrammarProfile();
    const profile: ToolCapabilityProfile = {
      ...base,
      supportedLocales: {
        ...base.supportedLocales,
        ui: ['ru'],
      },
    };

    const report = await runToolCapabilityClaimValidation(
      {},
      {
        profiles: [profile],
        locales: ['ru'],
        loadToolMessages: loadToolPageMessages,
        loadLocalizedBaseMessages: async () =>
          (await readMessageFile('ru/base.json')) ?? {},
        loadLocalizedToolMessages: async () => ({}),
        fileExists: () => true,
      },
    );

    expect(report.issues).toContainEqual({
      locale: 'ru',
      slug: 'grammar-checker',
      code: 'release-ready-label-unresolved',
      message:
        'Visible capability label does not resolve: tools.grammar-checker.capabilities.inputs.plainText',
    });
  });

  it('keeps the default inventory validation non-blocking when copy is truthful', async () => {
    const grammarProfile = getToolCapabilityProfile('grammar-checker');
    expect(grammarProfile).toBeDefined();

    const report = await runToolCapabilityClaimValidation(
      {},
      {
        profiles: [grammarProfile!],
        locales: ['en'],
        loadToolMessages: async () => ({
          description: 'Checks English text with local static rules.',
        }),
        loadLocalizedBaseMessages: async () => ({ tools: {} }),
        loadLocalizedToolMessages: async () => ({}),
        fileExists: () => false,
      },
    );

    expect(report).toEqual({
      profileCount: 1,
      localePageCount: 1,
      issues: [],
      exitCode: 0,
    });
  });

  it('fails when the required profile does not exist', async () => {
    const report = await runToolCapabilityClaimValidation(
      { requireReleaseReady: 'missing-tool' },
      {
        profiles: [],
        locales: ['en'],
        loadToolMessages: async () => ({}),
        loadLocalizedBaseMessages: async () => ({ tools: {} }),
        loadLocalizedToolMessages: async () => ({}),
        fileExists: () => true,
      },
    );

    expect(report).toEqual({
      profileCount: 0,
      localePageCount: 0,
      issues: [
        {
          locale: 'en',
          slug: 'missing-tool',
          code: 'release-ready-profile-not-found',
          message: 'Required capability profile does not exist.',
        },
      ],
      exitCode: 1,
    });
  });

  it('fails deterministically when Grammar is required but remains inventory', async () => {
    const grammarProfile = getToolCapabilityProfile('grammar-checker');
    expect(grammarProfile).toBeDefined();

    const report = await runToolCapabilityClaimValidation(
      parseToolCapabilityClaimArgs([
        '--require-release-ready',
        'grammar-checker',
      ]),
      {
        profiles: [grammarProfile!],
        locales: ['en'],
        loadToolMessages: async () => ({
          description: 'Checks English text with local static rules.',
        }),
        loadLocalizedBaseMessages: async () => ({ tools: {} }),
        loadLocalizedToolMessages: async () => ({}),
        fileExists: () => true,
      },
    );

    expect(report).toEqual({
      profileCount: 1,
      localePageCount: 1,
      issues: [
        {
          locale: 'en',
          slug: 'grammar-checker',
          code: 'release-ready-enforcement-required',
          message:
            'Required profile must use release-blocking enforcement.',
        },
      ],
      exitCode: 1,
    });
  });
});
