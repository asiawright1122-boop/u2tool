import type { Locale } from '@/lib/i18n';

export interface GrammarLanguageSupport {
  uiLocale: Locale;
  localInputLanguage: 'en';
  nativeForUiLocale: boolean;
}

export function getGrammarLanguageSupport(
  locale: Locale,
): GrammarLanguageSupport {
  return {
    uiLocale: locale,
    localInputLanguage: 'en',
    nativeForUiLocale: locale === 'en',
  };
}
