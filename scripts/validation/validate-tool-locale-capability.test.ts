import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { getToolCapabilityProfile } from '../../src/config/tool-capabilities';
import type { ToolCapabilityProfile } from '../../src/config/tool-capabilities';
import {
  flattenProfileEvidenceTestFiles,
  runToolLocaleCapabilityCli,
  runToolLocaleCapabilityValidation,
  validateToolLocaleCapability,
} from './validate-tool-locale-capability';

const temporaryRepositoryRoots: string[] = [];

afterEach(() => {
  for (const root of temporaryRepositoryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

const fixtureEvidenceTestName =
  'exercises the English fixture [capability:grammar-checker:engine:language-support]';

function fixtureEvidenceProfile(): ToolCapabilityProfile {
  const grammarProfile = getToolCapabilityProfile('grammar-checker');
  expect(grammarProfile).toBeDefined();
  const evidence = {
    file: 'src/lib/locale-fixture-evidence.test.ts',
    testName: fixtureEvidenceTestName,
  };

  return {
    ...grammarProfile!,
    modes: [],
    acceptedInputs: [],
    producedOutputs: [],
    supportedLocales: {
      ui: ['en'],
      engine: {
        kind: 'engine-limited',
        local: ['en'],
        optionalServer: [],
        evidence,
      },
    },
    browserOnlyFeatures: [],
    optionalServerFeatures: [],
    limits: [],
    evidenceTests: [evidence],
  };
}

function fixtureEvidenceRepository(input: {
  fixtureSource: string;
  testSource: string;
}): string {
  const root = mkdtempSync(path.join(tmpdir(), 'u2tool-locale-evidence-'));
  temporaryRepositoryRoots.push(root);
  const fixtureDirectory = path.join(
    root,
    'src/lib/fixtures/grammar-checker',
  );
  mkdirSync(fixtureDirectory, { recursive: true });
  writeFileSync(path.join(fixtureDirectory, 'en.ts'), input.fixtureSource);
  writeFileSync(
    path.join(root, 'src/lib/locale-fixture-evidence.test.ts'),
    input.testSource,
  );
  return root;
}

describe('tool locale capability validation', () => {
  it('accepts the English grammar checker when real English fixture evidence is named', () => {
    expect(
      validateToolLocaleCapability({
        locale: 'en',
        slug: 'grammar-checker',
        mergedMessages: {
          description:
            'Check English text locally for common grammar, spelling, and punctuation issues.',
        },
        evidenceTests: ['src/lib/grammar-rules.test.ts'],
      }),
    ).toEqual([]);
  });

  it('requires a Russian UI page to disclose that grammar input must be English', () => {
    const undisclosed = validateToolLocaleCapability({
      locale: 'ru',
      slug: 'grammar-checker',
      mergedMessages: {
        description: 'Локальная проверка грамматики в браузере.',
      },
      evidenceTests: ['src/lib/grammar-rules.test.ts'],
    });

    expect(undisclosed).toEqual([
      expect.objectContaining({
        locale: 'ru',
        slug: 'grammar-checker',
        code: 'missing-disclosure',
      }),
    ]);
    expect(
      validateToolLocaleCapability({
        locale: 'ru',
        slug: 'grammar-checker',
        mergedMessages: {
          description:
            'Русскоязычный интерфейс проверяет только английский текст локальными правилами.',
        },
        evidenceTests: ['src/lib/grammar-rules.test.ts'],
      }),
    ).toEqual([]);
  });

  it('rejects separated English and text keywords without one semantic input-language disclosure', () => {
    expect(
      validateToolLocaleCapability({
        locale: 'ru',
        slug: 'grammar-checker',
        mergedMessages: {
          description: 'Интерфейс доступен на английском языке.',
          usage_steps: ['Введите текст в поле.'],
        },
        evidenceTests: ['src/lib/grammar-rules.test.ts'],
      }),
    ).toEqual([
      expect.objectContaining({
        locale: 'ru',
        slug: 'grammar-checker',
        code: 'missing-disclosure',
      }),
    ]);
  });

  it('rejects a native Russian grammar-checking claim even when English input is disclosed', () => {
    expect(
      validateToolLocaleCapability({
        locale: 'ru',
        slug: 'grammar-checker',
        mergedMessages: {
          description:
            'Интерфейс принимает английский текст и проверяет русскую грамматику.',
        },
        evidenceTests: ['src/lib/grammar-rules.test.ts'],
      }),
    ).toEqual([
      expect.objectContaining({
        locale: 'ru',
        slug: 'grammar-checker',
        code: 'native-language-overclaim',
      }),
    ]);
  });

  it('does not let unrelated server negation cancel an affirmative Russian grammar claim', () => {
    expect(
      validateToolLocaleCapability({
        locale: 'ru',
        slug: 'grammar-checker',
        mergedMessages: {
          description:
            'Инструмент принимает английский текст, не отправляет данные на сервер и проверяет русскую грамматику.',
        },
        evidenceTests: ['src/lib/grammar-rules.test.ts'],
      }),
    ).toEqual([
      expect.objectContaining({
        locale: 'ru',
        slug: 'grammar-checker',
        code: 'native-language-overclaim',
      }),
    ]);
  });

  it('rejects native Russian diagnostics for an English-diagnostics SQL engine', () => {
    expect(
      validateToolLocaleCapability({
        locale: 'ru',
        slug: 'sql-query-optimizer',
        mergedMessages: {
          description:
            'Локальный анализ показывает английские диагностические объяснения и предоставляет диагностику на русском языке.',
        },
        evidenceTests: ['src/lib/sql-query-optimizer.test.ts'],
      }),
    ).toEqual([
      expect.objectContaining({
        locale: 'ru',
        slug: 'sql-query-optimizer',
        code: 'native-language-overclaim',
      }),
    ]);
  });

  it('does not confuse a Russian UI locale with language-neutral file processing', () => {
    expect(
      validateToolLocaleCapability({
        locale: 'ru',
        slug: 'hex-editor',
        mergedMessages: {
          description:
            'Откройте локальный бинарный файл и редактируйте байты в браузере.',
        },
        evidenceTests: [],
      }),
    ).toEqual([]);
  });

  it('rejects release-blocking engine locale declarations without matching fixture-test evidence', () => {
    expect(
      validateToolLocaleCapability({
        locale: 'en',
        slug: 'grammar-checker',
        mergedMessages: {
          description: 'Check English text locally.',
        },
        evidenceTests: ['src/lib/grammar-language-support.test.ts'],
      }),
    ).toEqual([
      expect.objectContaining({
        locale: 'en',
        slug: 'grammar-checker',
        code: 'missing-fixtures',
      }),
    ]);
  });

  it('reports inventory profiles as not release-ready without pretending they have locale fixtures', async () => {
    const grammarProfile = getToolCapabilityProfile('grammar-checker');
    expect(grammarProfile).toBeDefined();
    const inventoryProfile: ToolCapabilityProfile = {
      ...grammarProfile!,
      enforcement: 'inventory',
      evidenceTests: [],
    };

    await expect(
      runToolLocaleCapabilityValidation({
        profiles: [inventoryProfile],
        locales: ['en'],
        loadMergedMessages: async () => ({
          description: 'Check English text locally.',
        }),
      }),
    ).resolves.toEqual({
      profileCount: 1,
      localePageCount: 1,
      issues: [],
      notReleaseReadyProfiles: ['grammar-checker'],
      exitCode: 0,
    });
  });

  it('validates every profiled tool and UI locale with repository evidence', async () => {
    await expect(runToolLocaleCapabilityCli()).resolves.toEqual({
      profileCount: 6,
      localePageCount: 60,
      issues: [],
      notReleaseReadyProfiles: [],
      exitCode: 0,
    });
  });

  it('adapts structured profile evidence to deduplicated file paths', () => {
    const grammarProfile = getToolCapabilityProfile('grammar-checker');
    expect(grammarProfile).toBeDefined();

    const evidenceTests = flattenProfileEvidenceTestFiles(grammarProfile!);
    expect(evidenceTests).toContain('src/lib/grammar-rules.test.ts');
    expect(evidenceTests).toContain('src/lib/grammar-language-support.test.ts');
    expect(evidenceTests.every((item) => typeof item === 'string')).toBe(true);
    expect(new Set(evidenceTests).size).toBe(evidenceTests.length);
  });

  it('binds a real locale fixture to the exact structured runnable evidence test', async () => {
    const repositoryRoot = fixtureEvidenceRepository({
      fixtureSource:
        "export const grammarFixtures = { sample: 'Meaningful English input.' };\n",
      testSource: `import { expect, it } from 'vitest';
import { grammarFixtures } from './fixtures/grammar-checker/en';

it('${fixtureEvidenceTestName}', () => {
  expect(grammarFixtures.sample).toContain('English');
});
`,
    });

    await expect(
      runToolLocaleCapabilityValidation({
        profiles: [fixtureEvidenceProfile()],
        locales: ['en'],
        repositoryRoot,
        loadMergedMessages: async () => ({
          description: 'Check English text locally.',
        }),
      }),
    ).resolves.toMatchObject({ issues: [], exitCode: 0 });
  });

  it('rejects an empty locale fixture even when the exact evidence test imports it', async () => {
    const repositoryRoot = fixtureEvidenceRepository({
      fixtureSource: "export const grammarFixtures = { sample: '' };\n",
      testSource: `import { expect, it } from 'vitest';
import { grammarFixtures } from './fixtures/grammar-checker/en';

it('${fixtureEvidenceTestName}', () => {
  expect(grammarFixtures.sample).toBe('');
});
`,
    });

    await expect(
      runToolLocaleCapabilityValidation({
        profiles: [fixtureEvidenceProfile()],
        locales: ['en'],
        repositoryRoot,
        loadMergedMessages: async () => ({
          description: 'Check English text locally.',
        }),
      }),
    ).resolves.toMatchObject({
      issues: [expect.objectContaining({ code: 'missing-fixtures' })],
      exitCode: 1,
    });
  });

  it('rejects a comment-only fixture path reference', async () => {
    const repositoryRoot = fixtureEvidenceRepository({
      fixtureSource:
        "export const grammarFixtures = { sample: 'Meaningful English input.' };\n",
      testSource: `import { expect, it } from 'vitest';

// Fixture path: ./fixtures/grammar-checker/en
it('${fixtureEvidenceTestName}', () => {
  expect('unrelated text').toContain('text');
});
`,
    });

    await expect(
      runToolLocaleCapabilityValidation({
        profiles: [fixtureEvidenceProfile()],
        locales: ['en'],
        repositoryRoot,
        loadMergedMessages: async () => ({
          description: 'Check English text locally.',
        }),
      }),
    ).resolves.toMatchObject({
      issues: [expect.objectContaining({ code: 'missing-fixtures' })],
      exitCode: 1,
    });
  });

  it('rejects an unrelated fixture path string without a real import', async () => {
    const repositoryRoot = fixtureEvidenceRepository({
      fixtureSource:
        "export const grammarFixtures = { sample: 'Meaningful English input.' };\n",
      testSource: `import { expect, it } from 'vitest';

const fixturePath = './fixtures/grammar-checker/en';
it('${fixtureEvidenceTestName}', () => {
  expect(fixturePath).toContain('grammar-checker');
});
`,
    });

    const report = await runToolLocaleCapabilityValidation({
      profiles: [fixtureEvidenceProfile()],
      locales: ['en'],
      repositoryRoot,
      loadMergedMessages: async () => ({
        description: 'Check English text locally.',
      }),
    });
    expect(report.issues).toEqual([
      expect.objectContaining({ code: 'missing-fixtures' }),
    ]);
    expect(report.exitCode).toBe(1);
  });

  it('rejects fixture use in a different test than the exact structured evidence test', async () => {
    const repositoryRoot = fixtureEvidenceRepository({
      fixtureSource:
        "export const grammarFixtures = { sample: 'Meaningful English input.' };\n",
      testSource: `import { expect, it } from 'vitest';
import { grammarFixtures } from './fixtures/grammar-checker/en';

it('uses the fixture in an unrelated test', () => {
  expect(grammarFixtures.sample).toContain('English');
});

it('${fixtureEvidenceTestName}', () => {
  expect('unrelated text').toContain('text');
});
`,
    });

    await expect(
      runToolLocaleCapabilityValidation({
        profiles: [fixtureEvidenceProfile()],
        locales: ['en'],
        repositoryRoot,
        loadMergedMessages: async () => ({
          description: 'Check English text locally.',
        }),
      }),
    ).resolves.toMatchObject({
      issues: [expect.objectContaining({ code: 'missing-fixtures' })],
      exitCode: 1,
    });
  });

  it('rejects skipped, todo, and dynamically named fixture evidence tests', async () => {
    const nonRunnableTests = [
      `it.skip('${fixtureEvidenceTestName}', () => {
  expect(grammarFixtures.sample).toContain('English');
});`,
      `it.todo('${fixtureEvidenceTestName}');`,
      `const evidenceName = '${fixtureEvidenceTestName}';
it(evidenceName, () => {
  expect(grammarFixtures.sample).toContain('English');
});`,
    ];

    for (const testDeclaration of nonRunnableTests) {
      const repositoryRoot = fixtureEvidenceRepository({
        fixtureSource:
          "export const grammarFixtures = { sample: 'Meaningful English input.' };\n",
        testSource: `import { expect, it } from 'vitest';
import { grammarFixtures } from './fixtures/grammar-checker/en';

${testDeclaration}
`,
      });

      const report = await runToolLocaleCapabilityValidation({
        profiles: [fixtureEvidenceProfile()],
        locales: ['en'],
        repositoryRoot,
        loadMergedMessages: async () => ({
          description: 'Check English text locally.',
        }),
      });
      expect(report.issues).toEqual([
        expect.objectContaining({ code: 'missing-fixtures' }),
      ]);
      expect(report.exitCode).toBe(1);
    }
  });
});
