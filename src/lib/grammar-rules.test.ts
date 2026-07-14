import { describe, expect, it, vi } from 'vitest';

import {
  GRAMMAR_CHECKER_INPUT_BOUNDARY,
  grammarCheckerEnglishFixtures,
} from './fixtures/grammar-checker/en';
import { getGrammarLanguageSupport } from './grammar-language-support';
import { applyCorrections, checkGrammar } from './grammar-rules';

describe('grammar checker rules', () => {
  it('checks English text with local static rules [capability:grammar-checker:mode:local-english-rules]', () => {
    expect(checkGrammar(grammarCheckerEnglishFixtures.correct)).toEqual([]);

    expect(checkGrammar(grammarCheckerEnglishFixtures.repeatedWord)).toEqual([
      expect.objectContaining({
        type: 'grammar',
        original: 'reviews reviews',
        suggestions: ['reviews'],
      }),
    ]);
  });

  it('accepts empty and boundary-length plain-text input [capability:grammar-checker:accepted-input:plain-text]', () => {
    expect(checkGrammar(grammarCheckerEnglishFixtures.empty)).toEqual([]);
    expect(grammarCheckerEnglishFixtures.boundaryLength).toHaveLength(
      GRAMMAR_CHECKER_INPUT_BOUNDARY,
    );
    expect(checkGrammar(grammarCheckerEnglishFixtures.boundaryLength)).toEqual(
      [],
    );
  });

  it('returns issue details for highlighted output [capability:grammar-checker:produced-output:highlighted-issues]', () => {
    const [issue] = checkGrammar(grammarCheckerEnglishFixtures.commonMisspelling);

    expect(issue).toEqual({
      type: 'spelling',
      message: '"Teh" is commonly misspelled',
      position: { start: 0, end: 3 },
      suggestions: ['the'],
      severity: 'error',
      original: 'Teh',
    });
  });

  it('produces corrected text from public suggestions [capability:grammar-checker:produced-output:corrected-text]', () => {
    const input = grammarCheckerEnglishFixtures.subjectVerbAgreement;

    expect(applyCorrections(input, checkGrammar(input))).toBe(
      'She has the final draft.',
    );
  });

  it('detects representative English spelling, grammar, and punctuation rules [capability:grammar-checker:browser-feature:english-local-rules]', () => {
    expect(
      checkGrammar(grammarCheckerEnglishFixtures.commonMisspelling)[0],
    ).toMatchObject({ type: 'spelling', suggestions: ['the'] });
    expect(
      checkGrammar(grammarCheckerEnglishFixtures.subjectVerbAgreement)[0],
    ).toMatchObject({ type: 'grammar', suggestions: ['She has'] });
    expect(
      checkGrammar(grammarCheckerEnglishFixtures.punctuation)[0],
    ).toMatchObject({ type: 'punctuation', suggestions: ['. I'] });
  });

  it('returns sorted source ranges that identify each issue [capability:grammar-checker:browser-feature:issue-highlights]', () => {
    const input = grammarCheckerEnglishFixtures.multipleFixes;
    const issues = checkGrammar(input);

    expect(issues.map(({ position }) => position)).toEqual([
      { start: 0, end: 3 },
      { start: 11, end: 26 },
    ]);
    expect(
      issues.map(({ original, position }) =>
        input.slice(position.start, position.end) === original,
      ),
    ).toEqual([true, true]);
  });

  it('applies one selected suggestion without changing other issues [capability:grammar-checker:browser-feature:individual-fixes]', () => {
    const input = grammarCheckerEnglishFixtures.multipleFixes;
    const [spellingIssue] = checkGrammar(input);

    expect(applyCorrections(input, [spellingIssue])).toBe(
      'the editor reviews reviews the draft.',
    );
  });

  it('applies all available suggestions without position drift [capability:grammar-checker:browser-feature:all-fixes]', () => {
    const input = grammarCheckerEnglishFixtures.multipleFixes;

    expect(applyCorrections(input, checkGrammar(input))).toBe(
      'the editor reviews the draft.',
    );
  });

  it('does not present Cyrillic input as native Russian checking [capability:grammar-checker:limit:english-only-engine]', () => {
    expect(getGrammarLanguageSupport('ru')).toMatchObject({
      localInputLanguage: 'en',
      nativeForUiLocale: false,
    });
    expect(checkGrammar(grammarCheckerEnglishFixtures.cyrillicNonTarget)).toEqual(
      [],
    );
  });

  it('exposes the finite static-rule boundary rather than AI inference [capability:grammar-checker:limit:no-ai]', () => {
    expect(checkGrammar('The dogs walks to the park.')).toEqual([]);
    expect(checkGrammar(grammarCheckerEnglishFixtures.commonMisspelling)).toEqual([
      expect.objectContaining({ original: 'Teh', suggestions: ['the'] }),
    ]);
  });

  it('checks text synchronously without server requests [capability:grammar-checker:limit:no-server-processing]', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const result = checkGrammar(grammarCheckerEnglishFixtures.multipleFixes);

    expect(result).toHaveLength(2);
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('covers the shipped English checker behavior and non-target boundary [capability:grammar-checker:profile:release-readiness]', () => {
    const expectedIssueCounts = new Map<string, number>([
      [grammarCheckerEnglishFixtures.correct, 0],
      [grammarCheckerEnglishFixtures.repeatedWord, 1],
      [grammarCheckerEnglishFixtures.commonMisspelling, 1],
      [grammarCheckerEnglishFixtures.subjectVerbAgreement, 1],
      [grammarCheckerEnglishFixtures.empty, 0],
      [grammarCheckerEnglishFixtures.punctuation, 1],
      [grammarCheckerEnglishFixtures.boundaryLength, 0],
      [grammarCheckerEnglishFixtures.cyrillicNonTarget, 0],
    ]);

    for (const [input, count] of expectedIssueCounts) {
      expect(checkGrammar(input)).toHaveLength(count);
    }
    expect(getGrammarLanguageSupport('ru').nativeForUiLocale).toBe(false);
  });
});
