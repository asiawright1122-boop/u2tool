import type { Guide } from './guides-types';
import { guidesEs } from './guides-data-es';
import { guidesDe } from './guides-data-de';
import { guidesRu } from './guides-data-ru';
import { guidesJa } from './guides-data-ja';
import { guidesEn } from './guides-data-en';
import type { Locale } from './i18n';

/**
 * Guide catalog per locale. Languages without a guide entry simply have no
 * guides page (no machine fallback — content is intentionally hand-written).
 */
const guidesByLocale: Partial<Record<Locale, Record<string, Guide>>> = {
  en: Object.fromEntries(guidesEn.map((guide) => [guide.slug, guide])),
  es: Object.fromEntries(guidesEs.map((guide) => [guide.slug, guide])),
  de: Object.fromEntries(guidesDe.map((guide) => [guide.slug, guide])),
  ru: Object.fromEntries(guidesRu.map((guide) => [guide.slug, guide])),
  ja: Object.fromEntries(guidesJa.map((guide) => [guide.slug, guide])),
};

export function getGuide(slug: string, locale: Locale): Guide | undefined {
  return guidesByLocale[locale]?.[slug];
}

export function getGuidesForLocale(locale: Locale): Guide[] {
  const guides = guidesByLocale[locale];
  if (!guides) {
    return [];
  }
  return Object.values(guides).sort((a, b) => a.slug.localeCompare(b.slug));
}

export function guideSlugsForLocale(locale: Locale): string[] {
  return getGuidesForLocale(locale).map((guide) => guide.slug);
}
