import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  type CapabilityEvidenceReference,
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
  repositoryEvidenceTestModule,
  runRepositoryEvidenceTest,
  runToolCapabilityClaimValidation,
  validateCapabilityEvidenceReference,
  validateCapabilityEvidenceExecution,
  validateCapabilityMessageMatrix,
  validateReleaseReadyProfiles,
} from './validate-tool-capability-claims';

function evidence(
  category: string,
  id: string,
  file = 'src/lib/grammar-checker.behavior.test.ts',
): CapabilityEvidenceReference {
  return {
    file,
    testName: `[capability:grammar-checker:${category}:${id}]`,
  };
}

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
    evidenceTests: [evidence('profile', 'release-readiness')],
    modes: inventoryProfile.modes.map((item) => ({
      ...item,
      evidence: evidence('mode', item.id),
    })),
    acceptedInputs: inventoryProfile.acceptedInputs.map((item) => ({
      ...item,
      evidence: evidence('accepted-input', item.id),
    })),
    producedOutputs: inventoryProfile.producedOutputs.map((item) => ({
      ...item,
      evidence: evidence('produced-output', item.id),
    })),
    supportedLocales: {
      ...inventoryProfile.supportedLocales,
      engine: {
        ...inventoryProfile.supportedLocales.engine,
        evidence: evidence('engine', 'language-support'),
      },
    },
    browserOnlyFeatures: inventoryProfile.browserOnlyFeatures.map((feature) => ({
      ...feature,
      evidence: evidence('browser-feature', feature.id),
    })),
    optionalServerFeatures: inventoryProfile.optionalServerFeatures.map(
      (feature) => ({
        ...feature,
        evidence: evidence('optional-server-feature', feature.id),
      }),
    ),
    limits: inventoryProfile.limits.map((item) => ({
      ...item,
      evidence: evidence('limit', item.id),
    })),
    ...overrides,
  };
}

function evidenceModuleForProfile(profile: ToolCapabilityProfile) {
  const references = [
    ...profile.evidenceTests,
    ...profile.modes.map(({ evidence }) => evidence),
    ...profile.acceptedInputs.map(({ evidence }) => evidence),
    ...profile.producedOutputs.map(({ evidence }) => evidence),
    ...profile.browserOnlyFeatures.map(({ evidence }) => evidence),
    ...profile.optionalServerFeatures.map(({ evidence }) => evidence),
    ...profile.limits.map(({ evidence }) => evidence),
    profile.supportedLocales.engine.evidence,
  ].filter((item): item is CapabilityEvidenceReference => Boolean(item));
  const byFile = new Map<string, string[]>();
  for (const reference of references) {
    const names = byFile.get(reference.file) ?? [];
    names.push(reference.testName);
    byFile.set(reference.file, names);
  }

  return (file: string) => {
    const names = byFile.get(file);
    return names
      ? {
          file,
          source: names
            .map((testName) => `it(${JSON.stringify(testName)}, () => {});`)
            .join('\n'),
        }
      : null;
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
    const inventoryProfile = getToolCapabilityProfile('hex-editor');
    expect(inventoryProfile).toBeDefined();

    expect(
      validateReleaseReadyProfiles(
        [inventoryProfile!],
        () => null,
        () => undefined,
      ),
    ).toEqual([]);
  });

  it('requires non-empty top-level evidence for release-blocking profiles', () => {
    const profile = releaseBlockingGrammarProfile({ evidenceTests: [] });

    expect(
      validateReleaseReadyProfiles(
        [profile],
        evidenceModuleForProfile(profile),
        () => 'Honest localized label',
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

  it('requires evidence for every rendered capability category', () => {
    const base = releaseBlockingGrammarProfile();
    const profile: ToolCapabilityProfile = {
      ...base,
      modes: [{ ...base.modes[0], evidence: undefined }],
      browserOnlyFeatures: [
        { ...base.browserOnlyFeatures[0], evidence: undefined },
        ...base.browserOnlyFeatures.slice(1),
      ],
    };

    expect(
      validateReleaseReadyProfiles(
        [profile],
        evidenceModuleForProfile(profile),
        () => 'Honest localized label',
      ),
    ).toEqual([
      {
        locale: 'en',
        slug: 'grammar-checker',
        code: 'release-ready-category-evidence-required',
        message:
          'browser-feature "english-local-rules" must name structured behavior-test evidence.',
      },
      {
        locale: 'en',
        slug: 'grammar-checker',
        code: 'release-ready-category-evidence-required',
        message:
          'mode "local-english-rules" must name structured behavior-test evidence.',
      },
    ]);
  });

  it('rejects invalid structured evidence on a rendered category', () => {
    const base = releaseBlockingGrammarProfile();
    const profile: ToolCapabilityProfile = {
      ...base,
      browserOnlyFeatures: [
        {
          ...base.browserOnlyFeatures[0],
          evidence: {
            file: 'package.json',
            testName:
              '[capability:grammar-checker:browser-feature:english-local-rules]',
          },
        },
        ...base.browserOnlyFeatures.slice(1),
      ],
    };

    expect(
      validateReleaseReadyProfiles(
        [profile],
        evidenceModuleForProfile(base),
        () => 'Honest localized label',
      ),
    ).toEqual([
      {
        locale: 'en',
        slug: 'grammar-checker',
        code: 'release-ready-evidence-test-invalid',
        message:
          'Evidence must name an approved repository test module: package.json',
      },
    ]);
  });

  it('requires every visible shared and profile label in every UI locale', () => {
    const profile = releaseBlockingGrammarProfile();

    expect(
      validateReleaseReadyProfiles(
        [profile],
        evidenceModuleForProfile(profile),
        (_profile, locale, labelKey) =>
          (
            (locale === 'de' &&
              labelKey === 'tools.capabilityDisclosure.title') ||
            (locale === 'ru' &&
              labelKey ===
                'tools.grammar-checker.capabilities.inputs.plainText')
          )
            ? undefined
            : 'Honest localized label',
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
        evidenceModuleForProfile(profile),
        (_profile, _locale, labelKey) =>
          [
            'tools.capabilityDisclosure.optionalServer',
            'tools.capabilityDisclosure.privacyServer',
            'tools.capabilityDisclosure.languages.ru',
          ].includes(labelKey)
            ? undefined
            : 'Honest localized label',
      ),
    ).toEqual([]);
  });

  it('blocks an overclaim in a resolved visible disclosure label', () => {
    const profile = releaseBlockingGrammarProfile({
      supportedLocales: {
        ...releaseBlockingGrammarProfile().supportedLocales,
        ui: ['en'],
      },
    });

    const issues = validateReleaseReadyProfiles(
      [profile],
      evidenceModuleForProfile(profile),
      (_profile, _locale, labelKey) =>
        labelKey ===
        'tools.grammar-checker.capabilities.features.englishLocalRules'
          ? 'Uses AI-powered grammar checking.'
          : 'Honest localized label',
    );

    expect(issues).toContainEqual({
      locale: 'en',
      slug: 'grammar-checker',
      code: 'grammar-checker-ai-claim',
      message:
        'The browser checker uses local static rules, not AI. Visible capability label: tools.grammar-checker.capabilities.features.englishLocalRules',
    });
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

describe('repositoryEvidenceTestModule', () => {
  it('accepts only recognized repository test modules', () => {
    expect(repositoryEvidenceTestModule('src/lib/i18n.test.ts')).not.toBeNull();
    expect(repositoryEvidenceTestModule('package.json')).toBeNull();
    expect(repositoryEvidenceTestModule('.')).toBeNull();
    expect(repositoryEvidenceTestModule('/etc/passwd')).toBeNull();
  });

  it('rejects a repository test-path symlink that escapes the repository', () => {
    const repositoryRoot = mkdtempSync(
      path.join(tmpdir(), 'u2tool-evidence-root-'),
    );
    const outsideRoot = mkdtempSync(
      path.join(tmpdir(), 'u2tool-evidence-outside-'),
    );

    try {
      mkdirSync(path.join(repositoryRoot, 'src/lib'), { recursive: true });
      const outsideTest = path.join(outsideRoot, 'escape.test.ts');
      writeFileSync(outsideTest, 'it("escape", () => {});');
      symlinkSync(
        outsideTest,
        path.join(repositoryRoot, 'src/lib/escape.test.ts'),
      );

      expect(
        repositoryEvidenceTestModule(
          'src/lib/escape.test.ts',
          repositoryRoot,
        ),
      ).toBeNull();
    } finally {
      rmSync(repositoryRoot, { recursive: true, force: true });
      rmSync(outsideRoot, { recursive: true, force: true });
    }
  });
});

describe('validateCapabilityEvidenceReference', () => {
  const subject = {
    slug: 'grammar-checker',
    category: 'mode' as const,
    id: 'local-english-rules',
  };
  const marker =
    '[capability:grammar-checker:mode:local-english-rules]';

  it('rejects arbitrary files and unrelated test modules', () => {
    expect(
      validateCapabilityEvidenceReference(
        subject,
        { file: 'package.json', testName: marker },
        () => null,
      )?.code,
    ).toBe('release-ready-evidence-test-invalid');

    expect(
      validateCapabilityEvidenceReference(
        subject,
        { file: 'src/lib/i18n.test.ts', testName: marker },
        () => ({
          file: 'src/lib/i18n.test.ts',
          source: 'it("loads locales", () => {});',
        }),
      )?.code,
    ).toBe('release-ready-evidence-test-not-runnable');
  });

  it('rejects a marker for the wrong slug, category, or item', () => {
    for (const testName of [
      '[capability:hex-editor:mode:local-english-rules]',
      '[capability:grammar-checker:limit:local-english-rules]',
      '[capability:grammar-checker:mode:plain-text]',
    ]) {
      expect(
        validateCapabilityEvidenceReference(
          subject,
          { file: 'src/lib/grammar-checker.test.ts', testName },
          () => ({
            file: 'src/lib/grammar-checker.test.ts',
            source: `it(${JSON.stringify(testName)}, () => {});`,
          }),
        )?.code,
      ).toBe('release-ready-evidence-marker-mismatch');
    }
  });

  it('accepts a collected test with the exact capability marker', () => {
    expect(
      validateCapabilityEvidenceReference(
        subject,
        {
          file: 'src/lib/grammar-checker.test.ts',
          testName: `checks local rules ${marker}`,
        },
        () => ({
          file: 'src/lib/grammar-checker.test.ts',
          source: `it("checks local rules ${marker}", () => {});`,
        }),
      ),
    ).toBeNull();
  });

  it('rejects skipped, todo, only, commented, and dynamic declarations', () => {
    const declarations = [
      `it.skip(${JSON.stringify(marker)}, () => {});`,
      `it.todo(${JSON.stringify(marker)});`,
      `it.only(${JSON.stringify(marker)}, () => {});`,
      `// it(${JSON.stringify(marker)}, () => {});`,
      `const name = ${JSON.stringify(marker)}; it(name, () => {});`,
    ];

    for (const source of declarations) {
      expect(
        validateCapabilityEvidenceReference(
          subject,
          { file: 'src/lib/grammar-checker.test.ts', testName: marker },
          () => ({
            file: 'src/lib/grammar-checker.test.ts',
            source,
          }),
        )?.code,
        source,
      ).toBe('release-ready-evidence-test-not-runnable');
    }
  });
});

describe('validateCapabilityEvidenceExecution', () => {
  const reference = {
    file: 'src/lib/grammar-checker.test.ts',
    testName: '[capability:grammar-checker:mode:local-english-rules]',
  };

  it('accepts a genuinely passing exact-marker test', () => {
    expect(
      validateCapabilityEvidenceExecution(reference, { status: 'passed' }),
    ).toBeNull();
  });

  it.each([
    ['failed', 'release-ready-evidence-test-failed'],
    ['skipped', 'release-ready-evidence-test-skipped'],
    ['todo', 'release-ready-evidence-test-todo'],
    ['not-collected', 'release-ready-evidence-test-not-collected'],
    ['error', 'release-ready-evidence-test-cannot-run'],
  ] as const)('rejects a %s exact-marker test result', (status, code) => {
    expect(
      validateCapabilityEvidenceExecution(reference, {
        status,
        details: `synthetic ${status}`,
      })?.code,
    ).toBe(code);
  });
});

const EVIDENCE_SUBPROCESS_PARENT_TIMEOUT_MS = 15_000;

describe('runRepositoryEvidenceTest', () => {
  it.each([
    ['passed', 'expect(1).toBe(1);'],
    ['failed', 'expect(1).toBe(2);'],
  ] as const)('executes an exact-marker test that is %s', (status, body) => {
    const fixtureDirectory = mkdtempSync(
      path.join(process.cwd(), 'src/lib/.evidence-runner-'),
    );
    const fixturePath = path.join(fixtureDirectory, 'synthetic.test.ts');
    const testName =
      '[capability:synthetic-tool:mode:synthetic-mode]';

    try {
      writeFileSync(
        fixturePath,
        `import { expect, it } from 'vitest';\nit(${JSON.stringify(testName)}, () => { ${body} });\n`,
      );
      const evidence = {
        file: path.relative(process.cwd(), fixturePath),
        testName,
      };
      expect(runRepositoryEvidenceTest(evidence).status).toBe(status);
    } finally {
      rmSync(fixtureDirectory, { recursive: true, force: true });
    }
  }, EVIDENCE_SUBPROCESS_PARENT_TIMEOUT_MS);

  it.each([
    ['skipped', 'it.skip'],
    ['todo', 'it.todo'],
  ] as const)('reports an exact-marker test declared as %s', (status, call) => {
    const fixtureDirectory = mkdtempSync(
      path.join(process.cwd(), 'src/lib/.evidence-runner-'),
    );
    const fixturePath = path.join(fixtureDirectory, 'synthetic.test.ts');
    const testName =
      '[capability:synthetic-tool:mode:synthetic-mode]';

    try {
      writeFileSync(
        fixturePath,
        `import { it } from 'vitest';\n${call}(${JSON.stringify(testName)}, () => {});\n`,
      );
      expect(
        runRepositoryEvidenceTest({
          file: path.relative(process.cwd(), fixturePath),
          testName,
        }).status,
      ).toBe(status);
    } finally {
      rmSync(fixtureDirectory, { recursive: true, force: true });
    }
  }, EVIDENCE_SUBPROCESS_PARENT_TIMEOUT_MS);

  it(
    'reports a commented-out exact-marker test as not collected',
    () => {
      const fixtureDirectory = mkdtempSync(
        path.join(process.cwd(), 'src/lib/.evidence-runner-'),
      );
      const fixturePath = path.join(fixtureDirectory, 'synthetic.test.ts');
      const testName =
        '[capability:synthetic-tool:mode:synthetic-mode]';

      try {
        writeFileSync(
          fixturePath,
          `import { it } from 'vitest';\n// it(${JSON.stringify(testName)}, () => {});\n`,
        );
        expect(
          runRepositoryEvidenceTest({
            file: path.relative(process.cwd(), fixturePath),
            testName,
          }).status,
        ).toBe('not-collected');
      } finally {
        rmSync(fixtureDirectory, { recursive: true, force: true });
      }
    },
    EVIDENCE_SUBPROCESS_PARENT_TIMEOUT_MS,
  );

  it(
    'terminates a hanging evidence test within the configured runner timeout',
    () => {
      const fixtureDirectory = mkdtempSync(
        path.join(process.cwd(), 'src/lib/.evidence-runner-'),
      );
      const fixturePath = path.join(fixtureDirectory, 'synthetic.test.ts');
      const testName =
        '[capability:synthetic-tool:mode:synthetic-mode]';

      try {
        writeFileSync(
          fixturePath,
          [
            `import { it } from 'vitest';`,
            `it(${JSON.stringify(testName)}, async () => { await new Promise(() => {}); }, 1_000);`,
          ].join('\n'),
        );
        const startedAt = performance.now();
        const evidence = {
          file: path.relative(process.cwd(), fixturePath),
          testName,
        };
        const result = runRepositoryEvidenceTest(
          evidence,
          process.cwd(),
          { timeoutMs: 250 },
        );

        expect(result.status).toBe('error');
        expect(result.details).toMatch(/ETIMEDOUT|timed out/iu);
        expect(
          validateCapabilityEvidenceExecution(evidence, result)?.code,
        ).toBe('release-ready-evidence-test-cannot-run');
        expect(performance.now() - startedAt).toBeLessThan(2_000);
      } finally {
        rmSync(fixtureDirectory, { recursive: true, force: true });
      }
    },
    EVIDENCE_SUBPROCESS_PARENT_TIMEOUT_MS,
  );
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
        loadEvidenceTestModule: evidenceModuleForProfile(profile),
        runEvidenceTest: async () => ({ status: 'passed' }),
      },
    );

    expect(report).toEqual({
      profileCount: 1,
      localePageCount: 1,
      issues: [],
      exitCode: 0,
    });
  });

  it(
    'executes every exact-marker test for a synthetic required release-ready profile',
    async () => {
      const fixtureDirectory = mkdtempSync(
        path.join(process.cwd(), 'src/lib/.evidence-release-ready-'),
      );
      const fixturePath = path.join(fixtureDirectory, 'synthetic.test.ts');
      const relativeFixturePath = path.relative(process.cwd(), fixturePath);
      const base = releaseBlockingGrammarProfile();
      const moveEvidence = (reference: CapabilityEvidenceReference) => ({
        ...reference,
        file: relativeFixturePath,
      });
      const profile: ToolCapabilityProfile = {
        ...base,
        evidenceTests: base.evidenceTests.map(moveEvidence),
        modes: base.modes.map((item) => ({
          ...item,
          evidence: moveEvidence(item.evidence!),
        })),
        acceptedInputs: base.acceptedInputs.map((item) => ({
          ...item,
          evidence: moveEvidence(item.evidence!),
        })),
        producedOutputs: base.producedOutputs.map((item) => ({
          ...item,
          evidence: moveEvidence(item.evidence!),
        })),
        browserOnlyFeatures: base.browserOnlyFeatures.map((item) => ({
          ...item,
          evidence: moveEvidence(item.evidence!),
        })),
        limits: base.limits.map((item) => ({
          ...item,
          evidence: moveEvidence(item.evidence!),
        })),
        supportedLocales: {
          ...base.supportedLocales,
          ui: ['en'],
          engine: {
            ...base.supportedLocales.engine,
            evidence: moveEvidence(base.supportedLocales.engine.evidence!),
          },
        },
      };
      const references = [
        ...profile.evidenceTests,
        ...profile.modes.map(({ evidence }) => evidence!),
        ...profile.acceptedInputs.map(({ evidence }) => evidence!),
        ...profile.producedOutputs.map(({ evidence }) => evidence!),
        ...profile.browserOnlyFeatures.map(({ evidence }) => evidence!),
        ...profile.limits.map(({ evidence }) => evidence!),
        profile.supportedLocales.engine.evidence!,
      ];

      try {
        writeFileSync(
          fixturePath,
          [
            `import { expect, it } from 'vitest';`,
            ...references.map(
              ({ testName }) =>
                `it(${JSON.stringify(testName)}, () => { expect(true).toBe(true); });`,
            ),
          ].join('\n'),
        );

        const report = await runToolCapabilityClaimValidation(
          { requireReleaseReady: 'grammar-checker' },
          {
            profiles: [profile],
            locales: ['en'],
            loadToolMessages: async () => ({
              description: 'Checks English text with local static rules.',
            }),
            loadLocalizedBaseMessages: async () =>
              (await readMessageFile('en/base.json')) ?? {},
            loadLocalizedToolMessages: async () =>
              (await readMessageFile('en/tools/grammar-checker.json')) ?? {},
            loadEvidenceTestModule: repositoryEvidenceTestModule,
            runEvidenceTest: runRepositoryEvidenceTest,
          },
        );

        expect(report.issues).toEqual([]);
        expect(report.exitCode).toBe(0);
      } finally {
        rmSync(fixtureDirectory, { recursive: true, force: true });
      }
    },
    20_000,
  );

  it.each([
    ['failed', 'release-ready-evidence-test-failed'],
    ['skipped', 'release-ready-evidence-test-skipped'],
    ['todo', 'release-ready-evidence-test-todo'],
    ['not-collected', 'release-ready-evidence-test-not-collected'],
    ['error', 'release-ready-evidence-test-cannot-run'],
  ] as const)(
    'fails required readiness when an exact evidence test is %s',
    async (status, code) => {
      const base = releaseBlockingGrammarProfile();
      const profile: ToolCapabilityProfile = {
        ...base,
        supportedLocales: { ...base.supportedLocales, ui: ['en'] },
      };
      let runCount = 0;

      const report = await runToolCapabilityClaimValidation(
        { requireReleaseReady: 'grammar-checker' },
        {
          profiles: [profile],
          locales: ['en'],
          loadToolMessages: async () => ({
            description: 'Checks English text with local static rules.',
          }),
          loadLocalizedBaseMessages: async () =>
            (await readMessageFile('en/base.json')) ?? {},
          loadLocalizedToolMessages: async () =>
            (await readMessageFile('en/tools/grammar-checker.json')) ?? {},
          loadEvidenceTestModule: evidenceModuleForProfile(profile),
          runEvidenceTest: async () => {
            runCount += 1;
            return runCount === 1 ? { status } : { status: 'passed' };
          },
        },
      );

      expect(report.issues.some((issue) => issue.code === code)).toBe(true);
      expect(report.exitCode).toBe(1);
    },
  );

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
        loadEvidenceTestModule: evidenceModuleForProfile(profile),
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
    const hexProfile = getToolCapabilityProfile('hex-editor');
    expect(hexProfile).toBeDefined();

    const report = await runToolCapabilityClaimValidation(
      {},
      {
        profiles: [hexProfile!],
        locales: ['en'],
        loadToolMessages: async () => ({
          description: 'Converts text and hexadecimal locally in the browser.',
        }),
        loadLocalizedBaseMessages: async () => ({ tools: {} }),
        loadLocalizedToolMessages: async () => ({}),
        loadEvidenceTestModule: () => null,
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
        loadEvidenceTestModule: () => null,
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

  it('fails deterministically when Grammar is required but forced back to inventory', async () => {
    const grammarProfile = getToolCapabilityProfile('grammar-checker');
    expect(grammarProfile).toBeDefined();
    const inventoryGrammarProfile: ToolCapabilityProfile = {
      ...grammarProfile!,
      enforcement: 'inventory',
      evidenceTests: [],
    };

    const report = await runToolCapabilityClaimValidation(
      parseToolCapabilityClaimArgs([
        '--require-release-ready',
        'grammar-checker',
      ]),
      {
        profiles: [inventoryGrammarProfile],
        locales: ['en'],
        loadToolMessages: async () => ({
          description: 'Checks English text with local static rules.',
        }),
        loadLocalizedBaseMessages: async () => ({ tools: {} }),
        loadLocalizedToolMessages: async () => ({}),
        loadEvidenceTestModule: () => null,
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
