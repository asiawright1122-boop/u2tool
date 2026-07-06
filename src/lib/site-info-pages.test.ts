import { describe, expect, it } from 'vitest';
import { locales, type Locale } from './i18n';
import { getSiteInfoPageCopy, siteInfoPageSlugs } from './site-info-pages';

const localizedLocales = locales.filter((locale): locale is Exclude<Locale, 'en'> => locale !== 'en');

function flattenParagraphs(copy: ReturnType<typeof getSiteInfoPageCopy>): string {
  return copy.sections.flatMap((section) => section.paragraphs).join('\n');
}

describe('site info pages', () => {
  it('serves localized copy for every sitemap locale', () => {
    for (const slug of siteInfoPageSlugs) {
      const englishCopy = getSiteInfoPageCopy(slug, 'en');
      const englishParagraphs = flattenParagraphs(englishCopy);

      for (const locale of localizedLocales) {
        const localizedCopy = getSiteInfoPageCopy(slug, locale);

        expect(localizedCopy.title).not.toBe(englishCopy.title);
        expect(localizedCopy.description).not.toBe(englishCopy.description);
        expect(flattenParagraphs(localizedCopy)).not.toBe(englishParagraphs);
      }
    }
  });

  it('keeps contact email visible in localized contact and privacy copy', () => {
    for (const locale of locales) {
      expect(flattenParagraphs(getSiteInfoPageCopy('contact', locale))).toContain('contact@u2tool.com');
      expect(flattenParagraphs(getSiteInfoPageCopy('privacy', locale))).toContain('contact@u2tool.com');
    }
  });
});
