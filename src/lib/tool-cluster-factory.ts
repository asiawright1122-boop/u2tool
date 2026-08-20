/**
 * Shared builder factory for tool cluster modules.
 *
 * All 8 cluster libraries (chart, creator-seo, developer-data, image,
 * online-calculator, pdf-document, security, text-writing) share identical
 * builder logic. This module centralises that logic so each data file only
 * supplies its own GroupId union, slugs, group definitions, and locale copy.
 *
 * Each cluster data file keeps its original exported symbol names; the data
 * file simply delegates to these generic helpers.
 */

import { tools } from '@/config/tools';
import { getLocalizedPath, type Locale } from './i18n';
import { filterIndexableTools } from './index-suppression';
import { buildLocalizedPageUrl, getHreflang, resolveMetaDescription } from './seo';
import type { ToolClusterCopy, ToolClusterGroup, ToolClusterItem } from './tool-cluster-types';

// ---------------------------------------------------------------------------
// Slug-set helpers
// ---------------------------------------------------------------------------

/** Build an O(1) lookup set from a slug array. */
export function createClusterSlugSet(slugs: readonly string[]): Set<string> {
  return new Set<string>(slugs);
}

/** Check membership in a cluster via a pre-built slug set. */
export function isClusterSlug(slugSet: Set<string>, slug: string): boolean {
  return slugSet.has(slug);
}

/** Resolve which group a slug belongs to, or null if the slug is not grouped. */
export function getClusterGroupIdForSlug<GroupId extends string>(
  groupDefs: ReadonlyArray<{ id: GroupId; slugs: string[] }>,
  slug: string
): GroupId | null {
  return groupDefs.find((group) => group.slugs.includes(slug))?.id ?? null;
}

// ---------------------------------------------------------------------------
// Locale copy helpers
// ---------------------------------------------------------------------------

/**
 * Resolve locale copy with English fallback.
 *
 * Works for both `Record<Locale, ...>` (full coverage) and
 * `Partial<Record<Locale, ...>>` (partial coverage) because the fallback reads
 * `en` unconditionally.
 */
export function resolveClusterCopy<T extends ToolClusterCopy>(
  copyByLocale: Record<string, T>,
  locale: Locale
): T {
  return copyByLocale[locale] ?? copyByLocale.en;
}

/**
 * Resolve locale group-copy with English fallback.
 *
 * The `en` entry is required (non-null) because partial-coverage clusters
 * (text-writing, pdf-document) guarantee at minimum an English group copy.
 */
export function resolveClusterGroupCopy<GroupId extends string>(
  groupCopy: Record<string, Record<GroupId, { title: string; description: string }>>,
  locale: Locale
): Record<GroupId, { title: string; description: string }> {
  return groupCopy[locale] ?? groupCopy.en;
}

// ---------------------------------------------------------------------------
// Item / group builders
// ---------------------------------------------------------------------------

/**
 * Build an array of ToolClusterItem from a slug list, resolving each slug
 * against the global tool config and localising names / descriptions / href.
 */
export function buildClusterItems(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>,
  slugs: readonly string[]
): ToolClusterItem[] {
  const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));

  // Only indexable (non-suppressed) tools may appear on discovery surfaces.
  return filterIndexableTools(
    locale,
    slugs
      .map((slug) => toolBySlug.get(slug))
      .filter((tool): tool is (typeof tools)[number] => Boolean(tool))
      .map((tool) => ({
        category: tool.category,
        categoryName: categoryNames[tool.category] || tool.category,
        description: toolDescriptions[tool.slug] || '',
        href: getLocalizedPath(locale, `/tools/${tool.slug}`),
        icon: tool.icon,
        name: toolNames[tool.slug] || tool.slug,
        slug: tool.slug,
      })),
  );
}

/**
 * Build all groups for a cluster, localising titles / descriptions and
 * attaching the resolved tool items per group.
 */
export function buildClusterGroups<GroupId extends string>(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>,
  groupDefs: ReadonlyArray<{ id: GroupId; slugs: string[] }>,
  groupCopy: Record<string, Record<GroupId, { title: string; description: string }>>
): ToolClusterGroup<GroupId>[] {
  const copy = resolveClusterGroupCopy(groupCopy, locale);

  return groupDefs.map((group) => ({
    id: group.id,
    title: copy[group.id].title,
    description: copy[group.id].description,
    tools: buildClusterItems(locale, categoryNames, toolNames, toolDescriptions, group.slugs),
  }));
}

/**
 * Resolve the single group that contains a given tool slug, or null when the
 * slug is not part of this cluster.
 */
export function buildClusterGroupForTool<GroupId extends string>(
  locale: Locale,
  slug: string,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>,
  groupDefs: ReadonlyArray<{ id: GroupId; slugs: string[] }>,
  groupCopy: Record<string, Record<GroupId, { title: string; description: string }>>
): ToolClusterGroup<GroupId> | null {
  const groupId = getClusterGroupIdForSlug(groupDefs, slug);
  if (!groupId) {
    return null;
  }

  return buildClusterGroups(locale, categoryNames, toolNames, toolDescriptions, groupDefs, groupCopy)
    .find((group) => group.id === groupId) ?? null;
}

// ---------------------------------------------------------------------------
// Structured data (JSON-LD) builders
// ---------------------------------------------------------------------------

/** Build an `ItemList` JSON-LD object from cluster groups. */
export function buildClusterItemList(
  baseUrl: string,
  locale: Locale,
  groups: ToolClusterGroup[],
  clusterTitle: string
): Record<string, unknown> {
  const toolsForList = groups.flatMap((group) => group.tools);

  return {
    name: clusterTitle,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: toolsForList.length,
    itemListElement: toolsForList.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}${tool.href}`,
      item: {
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.description || undefined,
        applicationCategory: tool.categoryName,
        url: `${baseUrl}${tool.href}`,
      },
    })),
  };
}

/** Build a `CollectionPage` JSON-LD object from cluster groups + copy. */
export function buildClusterCollectionData(
  baseUrl: string,
  locale: Locale,
  groups: ToolClusterGroup[],
  clusterPath: string,
  copy: ToolClusterCopy
): Record<string, unknown> {
  return {
    name: copy.title,
    description: resolveMetaDescription({
      description: copy.seoDescription,
      locale,
      title: copy.seoTitle,
    }),
    url: buildLocalizedPageUrl(baseUrl, locale, clusterPath),
    inLanguage: getHreflang(locale),
    numberOfItems: groups.reduce((count, group) => count + group.tools.length, 0),
    hasPart: groups.map((group) => ({
      '@type': 'CollectionPage',
      name: group.title,
      description: group.description,
      hasPart: group.tools.map((tool) => ({
        '@type': 'SoftwareApplication',
        name: tool.name,
        url: `${baseUrl}${tool.href}`,
      })),
    })),
  };
}
