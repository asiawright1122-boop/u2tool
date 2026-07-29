import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  getToolCapabilityProfile,
  type CapabilityEvidenceReference,
  type ToolCapabilityProfile,
} from '../../src/config/tool-capabilities';
import { defineToolCapabilityProfile } from '../../src/config/tool-capabilities/define-profile';
import type { EngineLocaleDataEvidence } from '../../src/config/tool-capabilities/types';
import type { CapabilityEvidenceExecutionResult } from './validate-tool-capability-claims';
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

const evidence = {
  file: 'src/lib/example-engine.test.ts',
  testName:
    'proves locale behavior [capability:example:engine:language-support]',
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
        localeEvidence: [
          { locale: 'en', runtime: 'local', evidence, data },
        ],
        disclosure: {
          labelKey: 'tools.example.englishOnly',
          unsupportedLocaleClaimCodes: ['example-native-language-claim'],
        },
      },
    },
    browserOnlyFeatures: [],
    optionalServerFeatures: [],
    limits: [],
    forbiddenClaims: [
      {
        code: 'example-native-language-claim',
        pattern: /native Russian/iu,
        reason: 'The example engine is English-only.',
      },
    ],
    targetSearchIntents: ['example.local'],
    evidenceTests: [evidence],
  });
}

function replaceEngineData(
  profile: ToolCapabilityProfile,
  data: EngineLocaleDataEvidence,
): ToolCapabilityProfile {
  const engine = profile.supportedLocales.engine;
  expect(engine.kind).toBe('engine-limited');
  if (engine.kind !== 'engine-limited') return profile;
  return {
    ...profile,
    supportedLocales: {
      ...profile.supportedLocales,
      engine: {
        ...engine,
        localeEvidence: engine.localeEvidence.map((contract) => ({
          ...contract,
          data,
        })),
      },
    },
  };
}

function createTemporaryRepository(): string {
  const root = mkdtempSync(path.join(tmpdir(), 'u2tool-locale-contract-'));
  temporaryRepositoryRoots.push(root);
  writeRepositoryFile(
    root,
    evidence.file,
    `it(${JSON.stringify(evidence.testName)}, () => {});\n`,
  );
  return root;
}

function writeRepositoryFile(
  root: string,
  relativePath: string,
  source: string,
): void {
  const file = path.join(root, relativePath);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, source);
}

async function runProfile(
  profile: ToolCapabilityProfile,
  repositoryRoot: string,
  runEvidenceTest: (
    evidence: CapabilityEvidenceReference,
  ) =>
    | CapabilityEvidenceExecutionResult
    | Promise<CapabilityEvidenceExecutionResult> = () => ({
    status: 'passed',
  }),
) {
  return runToolLocaleCapabilityValidation({
    profiles: [profile],
    locales: ['en', 'ru'],
    repositoryRoot,
    runEvidenceTest,
    loadMergedMessages: async (locale) => ({
      englishOnly:
        locale === 'ru'
          ? 'Checks English text only.'
          : 'English engine.',
    }),
  });
}

describe('tool locale capability validation', () => {
  it('performs only synchronous message checks for the public English Grammar page', () => {
    expect(
      validateToolLocaleCapability({
        locale: 'en',
        slug: 'grammar-checker',
        mergedMessages: {},
        evidenceTests: ['not-a-real-evidence-file.ts'],
      }),
    ).toEqual([]);
  });

  it('accepts the public Russian Grammar disclosure at its declared tool-local key', () => {
    expect(
      validateToolLocaleCapability({
        locale: 'ru',
        slug: 'grammar-checker',
        mergedMessages: {
          capabilities: {
            limits: { englishOnlyEngine: 'Проверяет только английский текст' },
          },
        },
        evidenceTests: [],
      }),
    ).toEqual([]);
  });

  it('requires the declared disclosure key without mapping free-text claims', () => {
    expect(
      validateToolLocaleCapability({
        locale: 'ru',
        slug: 'grammar-checker',
        mergedMessages: {
          description:
            'Инструмент принимает английский текст и проверяет русскую грамматику.',
        },
        evidenceTests: [],
      }),
    ).toEqual([
      expect.objectContaining({ code: 'missing-disclosure' }),
    ]);

    expect(
      validateToolLocaleCapability({
        locale: 'ru',
        slug: 'grammar-checker',
        mergedMessages: {
          description: 'Проверяет русскую грамматику.',
          capabilities: {
            limits: { englishOnlyEngine: 'Проверяет только английский текст' },
          },
        },
        evidenceTests: [],
      }),
    ).toEqual([]);
  });

  it('does not confuse a Russian UI locale with language-neutral file processing', () => {
    expect(
      validateToolLocaleCapability({
        locale: 'ru',
        slug: 'hex-editor',
        mergedMessages: {},
        evidenceTests: [],
      }),
    ).toEqual([]);
  });

  it('reports inventory profiles as not release-ready without pretending they have locale evidence', async () => {
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
        loadMergedMessages: async () => ({}),
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
    expect(evidenceTests.every((item) => typeof item === 'string')).toBe(true);
    expect(new Set(evidenceTests).size).toBe(evidenceTests.length);
  });

  it('fails fixture-object data below its declared minimum and passes at the exact minimum', async () => {
    const root = createTemporaryRepository();
    writeRepositoryFile(
      root,
      'src/lib/fixtures/example/en.ts',
      "export const samples = ['one', 'two', 'three', 'four', 'five'];\n",
    );
    const data = {
      kind: 'fixture-object' as const,
      file: 'src/lib/fixtures/example/en.ts',
      exportName: 'samples',
      minimumNonEmptyValues: 6,
    };
    const belowMinimum = await runProfile(engineProfile(data), root);
    expect(belowMinimum.issues).toEqual([
      expect.objectContaining({ code: 'missing-fixtures' }),
    ]);
    expect(belowMinimum.issues[0].message).toContain(data.file);
    expect(belowMinimum.issues[0].message).toContain(data.exportName);

    writeRepositoryFile(
      root,
      'src/lib/fixtures/example/en.ts',
      "export const samples = ['one', 'two', 'three', 'four', 'five', 'six'];\n",
    );
    expect((await runProfile(engineProfile(data), root)).issues).toEqual([]);
  });

  it('fails a missing fixture export', async () => {
    const root = createTemporaryRepository();
    writeRepositoryFile(
      root,
      'src/lib/fixtures/example/en.ts',
      "export const otherSamples = ['one', 'two', 'three', 'four', 'five', 'six'];\n",
    );
    const report = await runProfile(
      engineProfile({
        kind: 'fixture-object',
        file: 'src/lib/fixtures/example/en.ts',
        exportName: 'samples',
        minimumNonEmptyValues: 6,
      }),
      root,
    );
    expect(report.issues).toEqual([
      expect.objectContaining({ code: 'missing-fixtures' }),
    ]);
  });

  it('enforces the exact prompt-bank minimum', async () => {
    const root = createTemporaryRepository();
    const data = {
      kind: 'message-prompt-bank' as const,
      fileTemplate: 'src/messages/{locale}.json',
      messagePath: ['tools', 'example', 'sampleTexts'] as const,
      minimumNonEmptyEntries: 6,
    };
    writeRepositoryFile(
      root,
      'src/messages/en.json',
      JSON.stringify({
        tools: {
          example: { sampleTexts: ['one', 'two', 'three', 'four', 'five'] },
        },
      }),
    );
    const belowMinimum = await runProfile(engineProfile(data), root);
    expect(belowMinimum.issues).toEqual([
      expect.objectContaining({ code: 'missing-fixtures' }),
    ]);
    expect(belowMinimum.issues[0].message).toContain(data.fileTemplate);
    expect(belowMinimum.issues[0].message).toContain('src/messages/en.json');
    expect(belowMinimum.issues[0].message).toContain(
      data.messagePath.join('.'),
    );

    writeRepositoryFile(
      root,
      'src/messages/en.json',
      JSON.stringify({
        tools: {
          example: {
            sampleTexts: ['one', 'two', 'three', 'four', 'five', 'six'],
          },
        },
      }),
    );
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
      expect(report.issues).toEqual([
        expect.objectContaining({ code: 'missing-fixtures' }),
      ]);
    },
  );

  it(
    'reports exact runner details with the evidence file and test locator',
    async () => {
      const root = createTemporaryRepository();
      const details = 'synthetic exact runner failure';
      const report = await runProfile(
        engineProfile({ kind: 'behavior-test' }),
        root,
        () => ({ status: 'failed', details }),
      );

      expect(report.issues).toHaveLength(1);
      expect(report.issues[0]).toMatchObject({ code: 'missing-fixtures' });
      expect(report.issues[0].message).toContain(evidence.file);
      expect(report.issues[0].message).toContain(evidence.testName);
      expect(report.issues[0].message).toContain(details);
    },
  );

  it('passes behavior-test evidence only when the exact runner passes', async () => {
    const root = createTemporaryRepository();
    expect(
      (await runProfile(engineProfile({ kind: 'behavior-test' }), root)).issues,
    ).toEqual([]);
  });

  it('fails a missing exact static evidence test declaration', async () => {
    const root = createTemporaryRepository();
    writeRepositoryFile(
      root,
      evidence.file,
      "it('a different test name', () => {});\n",
    );

    const report = await runProfile(
      engineProfile({ kind: 'behavior-test' }),
      root,
    );
    expect(report.issues).toEqual([
      expect.objectContaining({
        locale: 'en',
        code: 'missing-fixtures',
        message: expect.stringContaining(evidence.testName),
      }),
    ]);
  });

  it('executes the ten shared Typing evidence contracts once', async () => {
    const typingProfile = getToolCapabilityProfile('typing-speed-test');
    expect(typingProfile).toBeDefined();
    const runEvidenceTest = vi.fn(() => ({ status: 'passed' as const }));

    const report = await runToolLocaleCapabilityValidation({
      profiles: [typingProfile!],
      locales: [...typingProfile!.supportedLocales.ui],
      runEvidenceTest,
      loadMergedMessages: async () => ({}),
    });

    expect(report.issues).toEqual([]);
    expect(runEvidenceTest).toHaveBeenCalledTimes(1);
  });

  it.each(['absolute', 'traversal', 'missing', 'directory', 'symlink'] as const)(
    'rejects a %s repository data path',
    async (pathKind) => {
      const root = createTemporaryRepository();
      const outsideRoot = mkdtempSync(
        path.join(tmpdir(), 'u2tool-locale-outside-'),
      );
      temporaryRepositoryRoots.push(outsideRoot);
      const outsideFile = path.join(outsideRoot, 'outside.ts');
      writeFileSync(outsideFile, "export const samples = ['one'];\n");

      let fixturePath = 'src/lib/fixtures/example/missing.ts';
      if (pathKind === 'absolute') fixturePath = outsideFile;
      if (pathKind === 'traversal') {
        fixturePath = path.relative(root, outsideFile);
      }
      if (pathKind === 'directory') {
        fixturePath = 'src/lib/fixtures/example/directory.ts';
        mkdirSync(path.join(root, fixturePath), { recursive: true });
      }
      if (pathKind === 'symlink') {
        fixturePath = 'src/lib/fixtures/example/symlink.ts';
        const linkPath = path.join(root, fixturePath);
        mkdirSync(path.dirname(linkPath), { recursive: true });
        symlinkSync(outsideFile, linkPath);
      }

      const profile = replaceEngineData(
        engineProfile({ kind: 'behavior-test' }),
        {
          kind: 'fixture-object',
          file: fixturePath,
          exportName: 'samples',
          minimumNonEmptyValues: 1,
        },
      );
      expect((await runProfile(profile, root)).issues).toEqual([
        expect.objectContaining({ code: 'missing-fixtures' }),
      ]);
    },
  );

  it('restricts fixture modules to ts/js and prompt banks to json', async () => {
    const root = createTemporaryRepository();
    writeRepositoryFile(
      root,
      'src/lib/fixtures/example/en.mjs',
      "export const samples = ['one'];\n",
    );
    writeRepositoryFile(
      root,
      'src/messages/en.txt',
      JSON.stringify({ tools: { example: { sampleTexts: ['one'] } } }),
    );

    const fixtureProfile = replaceEngineData(
      engineProfile({ kind: 'behavior-test' }),
      {
        kind: 'fixture-object',
        file: 'src/lib/fixtures/example/en.mjs',
        exportName: 'samples',
        minimumNonEmptyValues: 1,
      },
    );
    expect((await runProfile(fixtureProfile, root)).issues).toEqual([
      expect.objectContaining({ code: 'missing-fixtures' }),
    ]);

    const promptProfile = replaceEngineData(
      engineProfile({ kind: 'behavior-test' }),
      {
        kind: 'message-prompt-bank',
        fileTemplate: 'src/messages/{locale}.txt',
        messagePath: ['tools', 'example', 'sampleTexts'],
        minimumNonEmptyEntries: 1,
      },
    );
    expect((await runProfile(promptProfile, root)).issues).toEqual([
      expect.objectContaining({ code: 'missing-fixtures' }),
    ]);
  });
});
