import { describe, expect, it } from 'vitest';

import { locales } from './i18n';
import { getGrammarLanguageSupport } from './grammar-language-support';

describe('grammar checker language support', () => {
  it('declares English as the only local checking language [capability:grammar-checker:engine:language-support]', () => {
    expect(getGrammarLanguageSupport('en')).toEqual({
      uiLocale: 'en',
      localInputLanguage: 'en',
      nativeForUiLocale: true,
    });
    expect(getGrammarLanguageSupport('ru')).toEqual({
      uiLocale: 'ru',
      localInputLanguage: 'en',
      nativeForUiLocale: false,
    });
  });

  it('keeps every localized interface on the English checker [capability:grammar-checker:profile:release-readiness]', () => {
    expect(locales.map(getGrammarLanguageSupport)).toEqual(
      locales.map((uiLocale) => ({
        uiLocale,
        localInputLanguage: 'en',
        nativeForUiLocale: uiLocale === 'en',
      })),
    );
  });
});
