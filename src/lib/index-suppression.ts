import { INDEX_SUPPRESSION } from '@/config/index-suppression.generated';

/**
 * M2 index-hygiene helpers: keep on-page links (related tools, popular tools,
 * category grids) pointing at indexable pages only, so crawl attention and
 * link equity do not flow into noindex-suppressed pages.
 *
 * The suppression list is (locale, slug) scoped: the same tool can be kept in
 * one locale and suppressed in another.
 */
export function isIndexSuppressed(locale: string, slug: string): boolean {
  return INDEX_SUPPRESSION[`${locale}/${slug}`] === true;
}

export function filterIndexableTools<T extends { slug: string }>(
  locale: string,
  tools: readonly T[],
): T[] {
  return tools.filter((tool) => !isIndexSuppressed(locale, tool.slug));
}
