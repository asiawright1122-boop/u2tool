import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { calculateTypingStats } from './calculator-utils';
import { locales } from './i18n';
import {
  buildLocalTypingTarget,
  calculateTimedTypingResult,
  clampTimedTypingElapsedMs,
  MAX_TIMED_TYPING_CHARACTERS,
  readTypingHistory,
  truncateTimedTypingText,
  type TypingHistoryEntry,
  writeTypingHistory,
} from './typing-speed-test';

describe('local timed typing target', () => {
  it('extends native prompts beyond a fast typist\'s 120-second run without changing the existing prefix', () => {
    const prompts = [
      'The quick brown fox jumps over the lazy dog.',
      'Pack my box with five dozen liquor jugs.',
    ];
    const initialTarget = buildLocalTypingTarget(prompts, 1_200);
    const continuedTarget = buildLocalTypingTarget(prompts, 2_400);

    expect(Array.from(initialTarget).length).toBeGreaterThanOrEqual(1_200);
    expect(Array.from(continuedTarget).length).toBeGreaterThanOrEqual(2_400);
    expect(continuedTarget.startsWith(initialTarget)).toBe(true);
    expect(continuedTarget).not.toContain('MISSING:');

    const correctCharacterCount = Array.from(continuedTarget).length;
    const result = calculateTimedTypingResult({
      targetText: continuedTarget,
      typedText: continuedTarget,
      elapsedMs: 120_000,
      intervalCorrectCharCounts: [correctCharacterCount / 2, correctCharacterCount / 2],
    });
    expect(result.correctChars).toBe(correctCharacterCount);
    expect(result.cpm).toBe(Math.round(correctCharacterCount / 2));
    expect(result.wpm).toBe(Math.round(correctCharacterCount / 10));
  });

  it('caps generated targets at the documented 120-second input ceiling while preserving the typed prefix', () => {
    const prompts = ['native prompt one', 'native prompt two'];
    const existingTarget = buildLocalTypingTarget(prompts, 2_400);
    const boundedTarget = buildLocalTypingTarget(
      prompts,
      MAX_TIMED_TYPING_CHARACTERS + 500,
    );

    expect(MAX_TIMED_TYPING_CHARACTERS).toBe(3_000);
    expect(Array.from(boundedTarget)).toHaveLength(MAX_TIMED_TYPING_CHARACTERS);
    expect(boundedTarget.startsWith(existingTarget)).toBe(true);
  });
});

describe('timed typing input ceiling', () => {
  it('truncates text deterministically by Unicode code point', () => {
    const boundedText = truncateTimedTypingText(
      `${'😀'.repeat(MAX_TIMED_TYPING_CHARACTERS)}猫`,
    );

    expect(Array.from(boundedText)).toHaveLength(MAX_TIMED_TYPING_CHARACTERS);
    expect(boundedText).toBe('😀'.repeat(MAX_TIMED_TYPING_CHARACTERS));
  });

  it('enforces the named ceiling in markup and writes bounded programmatic input back to the DOM', () => {
    const componentSource = readFileSync(
      fileURLToPath(new URL('../components/tools/TypingSpeedTest.svelte', import.meta.url)),
      'utf8',
    );

    expect(componentSource).toContain('maxlength={MAX_TIMED_TYPING_CHARACTERS}');
    expect(componentSource).toContain('truncateTimedTypingText,');
    expect(componentSource).toContain(
      'const boundedTypedText = truncateTimedTypingText(input.value);',
    );
    expect(componentSource).toContain('input.value = boundedTypedText;');
  });

  it('guards component input state with the active deadline before accepting bounded text', () => {
    const componentSource = readFileSync(
      fileURLToPath(new URL('../components/tools/TypingSpeedTest.svelte', import.meta.url)),
      'utf8',
    );
    const inputHandler = componentSource.slice(
      componentSource.indexOf('function handleInputEvent'),
      componentSource.indexOf('\n  onMount'),
    );

    expect(componentSource).toContain('let activeDeadline = $state(0);');
    expect(inputHandler).toContain('Date.now() >= activeDeadline');
    expect(inputHandler).toContain('input.value = typedText;');
    expect(inputHandler.indexOf('Date.now() >= activeDeadline'))
      .toBeLessThan(inputHandler.indexOf('typedText = boundedTypedText;'));
  });

  it('starts completed-flow side-effect observation before reload hydration and duration selection', () => {
    const browserTestSource = readFileSync(
      fileURLToPath(new URL('../components/tools/TypingSpeedTest.test.ts', import.meta.url)),
      'utf8',
    );
    const testStart = browserTestSource.indexOf(
      "it('completes locally without network navigation download account ranking certificate or cloud-history side effects",
    );
    const completedFlowTest = browserTestSource.slice(
      testStart,
      browserTestSource.indexOf('\n  }, 15_000);', testStart),
    );
    const observationStart = completedFlowTest.indexOf('observeSideEffects = true;');
    const testedReload = completedFlowTest.indexOf('await page.reload');
    const testedHydration = completedFlowTest.indexOf(
      'await page.waitForFunction',
      testedReload,
    );
    const durationSelection = completedFlowTest.indexOf(
      'await page.$eval(\'[data-typing-duration="15"]\'',
    );

    expect(testStart).toBeGreaterThanOrEqual(0);
    expect(observationStart).toBeGreaterThanOrEqual(0);
    expect(observationStart).toBeLessThan(testedReload);
    expect(testedReload).toBeLessThan(testedHydration);
    expect(testedHydration).toBeLessThan(durationSelection);
    expect(completedFlowTest).toContain(
      "['Document', 'Fetch', 'XHR', 'Ping']",
    );
    expect(completedFlowTest).toContain('allowedFixtureDocumentRequests = 1;');
    expect(completedFlowTest).toContain('allowedFixtureNavigations = 1;');
  });
});

function historyEntry(index: number): TypingHistoryEntry {
  return {
    id: `run-${index}`,
    locale: index % 2 === 0 ? 'en' : 'zh',
    duration: 30,
    completedAt: new Date(Date.UTC(2026, 0, index + 1)).toISOString(),
    wpm: index,
    cpm: index * 5,
    accuracy: 100,
    consistency: 100,
    correctChars: index,
    incorrectChars: 0,
    elapsedSeconds: 30,
    errors: [],
  };
}

describe('timed typing result', () => {
  it('truncates oversized programmatic text before calculating metrics and character errors', () => {
    const stablePrefix = '猫'.repeat(MAX_TIMED_TYPING_CHARACTERS);
    const result = calculateTimedTypingResult({
      targetText: `${stablePrefix}${'犬'.repeat(500)}`,
      typedText: `${stablePrefix}${'鳥'.repeat(500)}`,
      elapsedMs: 120_000,
      intervalCorrectCharCounts: [1_500, 1_500],
    });

    expect(result.correctChars).toBe(MAX_TIMED_TYPING_CHARACTERS);
    expect(result.incorrectChars).toBe(0);
    expect(result.errors).toEqual([]);
  });

  it('caps delayed completion at the selected fixed duration', () => {
    expect(clampTimedTypingElapsedMs({
      duration: 120,
      startedAt: 1_000,
      finishedAt: 151_000,
    })).toBe(120_000);
  });

  it('calculates Unicode-aware timed metrics and character errors [capability:typing-speed-test:profile:release-readiness] [capability:typing-speed-test:produced-output:wpm] [capability:typing-speed-test:produced-output:cpm] [capability:typing-speed-test:produced-output:accuracy] [capability:typing-speed-test:produced-output:consistency] [capability:typing-speed-test:produced-output:elapsed-duration]', () => {
    expect(calculateTimedTypingResult({
      targetText: 'café猫',
      typedText: 'cafe犬x',
      elapsedMs: 30_000,
      intervalCorrectCharCounts: [5, 10],
    })).toEqual({
      wpm: 1,
      cpm: 6,
      accuracy: 50,
      consistency: 66.67,
      correctChars: 3,
      incorrectChars: 3,
      elapsedSeconds: 30,
      errors: [
        { index: 3, expected: 'é', actual: 'e' },
        { index: 4, expected: '猫', actual: '犬' },
        { index: 5, expected: '', actual: 'x' },
      ],
    });
  });

  it('returns finite zero metrics and full consistency with fewer than two non-empty intervals', () => {
    expect(calculateTimedTypingResult({
      targetText: '你好',
      typedText: '',
      elapsedMs: Number.POSITIVE_INFINITY,
      intervalCorrectCharCounts: [0, Number.NaN, 4],
    })).toEqual({
      wpm: 0,
      cpm: 0,
      accuracy: 0,
      consistency: 100,
      correctChars: 0,
      incorrectChars: 0,
      elapsedSeconds: 0,
      errors: [],
    });
  });
});

describe('typing history', () => {
  it('treats malformed local history as empty without throwing', () => {
    const storage = { getItem: () => '{not-json' };

    expect(readTypingHistory(storage)).toEqual([]);
  });

  it('filters invalid entries and returns only the latest twenty valid results', () => {
    const entries: unknown[] = [
      ...Array.from({ length: 22 }, (_, index) => historyEntry(index)),
      { ...historyEntry(30), duration: 45 },
      { ...historyEntry(31), accuracy: Number.NaN },
      null,
    ];
    const storage = { getItem: () => JSON.stringify(entries) };

    expect(readTypingHistory(storage).map(({ id }) => id)).toEqual(
      Array.from({ length: 20 }, (_, index) => `run-${21 - index}`),
    );
  });

  it('writes only the latest twenty valid results', () => {
    let stored = '';
    const storage = {
      setItem: (_key: string, value: string) => {
        stored = value;
      },
    };
    const entries = [
      ...Array.from({ length: 22 }, (_, index) => historyEntry(index)),
      { ...historyEntry(40), locale: '' },
    ] as TypingHistoryEntry[];

    writeTypingHistory(storage, entries);

    expect((JSON.parse(stored) as TypingHistoryEntry[]).map(({ id }) => id))
      .toEqual(Array.from({ length: 20 }, (_, index) => `run-${21 - index}`));
  });
});

describe('legacy typing calculator compatibility', () => {
  it('retains the existing result fields and values', () => {
    expect(calculateTypingStats('😀猫', '😀犬', 30_000)).toEqual({
      wpm: 0,
      accuracy: 50,
      correctChars: 1,
      incorrectChars: 1,
      totalChars: 2,
      duration: 30,
    });
  });
});

describe('localized timed typing prompts', () => {
  it('provides native prompt fixtures and timed UI messages in all ten locales [capability:typing-speed-test:engine:language-support] [capability:typing-speed-test:browser-feature:difficulty-prompt-banks]', () => {
    const messageRoot = fileURLToPath(new URL('../messages/', import.meta.url));
    const nativePromptSignatures: Record<(typeof locales)[number], RegExp> = {
      ar: /[\u0600-\u06ff]/u,
      de: /\b(?:heute|wetter|bücher|freizeit|übung|meister|frühling|blumen|vögel|erfolg|hingabe|schwierigkeiten|sprache|lohnend|fortschritt|leben|reise|wissen|sekunde|schönheit|augen)\b/iu,
      en: /\b(?:quick|pack|box|vexingly|zebras|wizards|driven|jocks|job|pluck|promptly|buckles|zippers|woven)\b/iu,
      es: /\b(?:hoy|tiempo|libros|práctica|maestro|primavera|flores|pájaros|éxito|dedicación|dificultades|aprender|idioma|progreso|vida|viaje|conocimiento|personas|belleza|corazón)\b/iu,
      fr: /\b(?:aujourd'hui|livres|forgeron|printemps|fleurs|oiseaux|succès|dévouement|difficultés|apprendre|langue|progrès|vie|voyage|connaissance|personnes|beauté|cœur)\b/iu,
      ja: /[\u3040-\u30ff]/u,
      ko: /[\uac00-\ud7af]/u,
      pt: /\b(?:hoje|livros|prática|perfeição|primavera|flores|pássaros|sucesso|dedicação|dificuldades|aprender|idioma|progresso|vida|viagem|conhecimento|pessoas|beleza|coração)\b/iu,
      ru: /[\u0400-\u04ff]/u,
      zh: /[\u3400-\u9fff]/u,
    };
    const requiredKeys = [
      'durationSelector',
      'countdown',
      'cpm',
      'consistency',
      'errors',
      'history',
      'historyEmpty',
      'historyLocalOnly',
    ] as const;
    const requiredCapabilityPaths = [
      ['inputs', 'promptKeystrokes'],
      ['features', 'difficultyPromptBanks'],
      ['features', 'selectableTimedModes'],
      ['features', 'automaticFinish'],
      ['features', 'characterErrors'],
      ['features', 'localHistory'],
      ['limits', 'noAccount'],
      ['limits', 'noRanking'],
      ['limits', 'noCertificate'],
      ['limits', 'noCloudHistory'],
    ] as const;

    for (const locale of locales) {
      const aggregate = JSON.parse(readFileSync(`${messageRoot}/${locale}.json`, 'utf8'))
        .tools['typing-speed-test'];
      const base = JSON.parse(readFileSync(`${messageRoot}/${locale}/base.json`, 'utf8'))
        .tools['typing-speed-test'];
      const split = JSON.parse(
        readFileSync(`${messageRoot}/${locale}/tools/typing-speed-test.json`, 'utf8'),
      );
      const prompts = Object.values(aggregate.sampleTexts).flat() as string[];
      const englishPrompts = Object.values(JSON.parse(
        readFileSync(`${messageRoot}/en.json`, 'utf8'),
      ).tools['typing-speed-test'].sampleTexts).flat() as string[];

      expect(prompts.length, locale).toBeGreaterThanOrEqual(6);
      expect(prompts.every((prompt) => prompt.trim().length > 0), locale).toBe(true);
      expect(
        prompts.filter((prompt) => nativePromptSignatures[locale].test(prompt)).length,
        locale,
      ).toBeGreaterThanOrEqual(6);
      if (locale !== 'en') {
        expect(prompts, locale).not.toEqual(englishPrompts);
      }
      expect(base.sampleTexts, locale).toEqual(aggregate.sampleTexts);
      for (const key of requiredKeys) {
        expect(aggregate[key], `${locale}.${key}`).toBeTypeOf('string');
        expect(aggregate[key].trim().length, `${locale}.${key}`).toBeGreaterThan(0);
        expect(base[key], `${locale}.${key}`).toBe(aggregate[key]);
      }
      for (const [category, key] of requiredCapabilityPaths) {
        const value = split.capabilities?.[category]?.[key];
        expect(value, `${locale}.capabilities.${category}.${key}`).toBeTypeOf('string');
        expect(value.trim().length, `${locale}.capabilities.${category}.${key}`)
          .toBeGreaterThan(0);
      }
    }
  });

  it('describes fixed timed scoring and local-only history without legacy completion controls', () => {
    const messageRoot = fileURLToPath(new URL('../messages/', import.meta.url));
    const searchCopySignatures: Record<(typeof locales)[number], RegExp[]> = {
      ar: [/15.*30.*60.*120/su, /CPM/u, /الثبات/u, /أخطاء/u, /السجل المحلي/u, /حساب/u, /السحاب/u],
      de: [/15.*30.*60.*120/su, /CPM/u, /Gleichmäßigkeit/iu, /Zeichenfehler/iu, /lokalen Verlauf/iu, /Konto/iu, /Cloud/iu],
      en: [/15.*30.*60.*120/su, /CPM/u, /consistency/iu, /character-level error/iu, /local history/iu, /account/iu, /cloud/iu],
      es: [/15.*30.*60.*120/su, /CPM/u, /constancia/iu, /errores por carácter/iu, /historial local/iu, /cuenta/iu, /nube/iu],
      fr: [/15.*30.*60.*120/su, /CPM/u, /régularité/iu, /erreurs caractère/iu, /historique local/iu, /compte/iu, /cloud/iu],
      ja: [/15.*30.*60.*120/su, /CPM/u, /安定度/u, /文字エラー/u, /ローカル履歴/u, /アカウント/u, /クラウド/u],
      ko: [/15.*30.*60.*120/su, /CPM/u, /일관성/u, /문자 오류/u, /로컬 기록/u, /계정/u, /클라우드/u],
      pt: [/15.*30.*60.*120/su, /CPM/u, /consistência/iu, /erros por caractere/iu, /histórico local/iu, /conta/iu, /nuvem/iu],
      ru: [/15.*30.*60.*120/su, /CPM/u, /стабильност/iu, /ошибок по символам/iu, /локальной истории/iu, /учетной записи/iu, /облак/iu],
      zh: [/15.*30.*60.*120/su, /CPM/u, /稳定性/u, /逐字符错误/u, /本地历史/u, /账户/u, /云端/u],
    };

    for (const locale of locales) {
      const aggregate = JSON.parse(readFileSync(`${messageRoot}/${locale}.json`, 'utf8'))
        .tools['typing-speed-test'];
      const base = JSON.parse(readFileSync(`${messageRoot}/${locale}/base.json`, 'utf8'))
        .tools['typing-speed-test'];
      const split = JSON.parse(
        readFileSync(`${messageRoot}/${locale}/tools/typing-speed-test.json`, 'utf8'),
      );

      for (const legacyKey of [
        'newText',
        'rating',
        'beginner',
        'average',
        'aboveAverage',
        'fast',
        'professional',
      ]) {
        expect(aggregate, `${locale}.${legacyKey}`).not.toHaveProperty(legacyKey);
        expect(base, `${locale}.${legacyKey}`).not.toHaveProperty(legacyKey);
      }
      for (const signature of searchCopySignatures[locale]) {
        expect(split.detailed_description, `${locale}.${signature}`).toMatch(signature);
      }
    }
  });
});
