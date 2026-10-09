import { getToolBySlug } from '@/config/tools';
import { INDEX_SUPPRESSION } from '@/config/index-suppression.generated';
import { locales, type Locale } from '@/lib/i18n';

/** Published tool variants eligible for search discovery; not evidence of actual indexing. */
export function getIndexableToolLocales(slug: string): Locale[] {
  if (!getToolBySlug(slug)) return [];
  return locales.filter(locale => INDEX_SUPPRESSION[`${locale}/${slug}`] !== true);
}
