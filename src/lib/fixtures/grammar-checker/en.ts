export const GRAMMAR_CHECKER_LARGE_INPUT_LENGTH = 10_000;

const largeInputSeed = 'The editor reviews the draft carefully. ';

export const grammarCheckerEnglishFixtures = {
  correct: 'The editor reviews the draft carefully.',
  repeatedWord: 'The editor reviews reviews the draft.',
  commonMisspelling: 'Teh editor reviews the draft.',
  subjectVerbAgreement: 'She have the final draft.',
  empty: '',
  punctuation: 'This draft is ready.It is clear.',
  largeInput: largeInputSeed
    .repeat(
      Math.ceil(GRAMMAR_CHECKER_LARGE_INPUT_LENGTH / largeInputSeed.length),
    )
    .slice(0, GRAMMAR_CHECKER_LARGE_INPUT_LENGTH),
  cyrillicNonTarget: 'Она пишет короткий русский текст.',
  multipleFixes: 'Teh editor reviews reviews the draft.',
} as const;
