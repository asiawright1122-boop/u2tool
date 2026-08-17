import { categories, getPopularTools, getToolsByCategory, type ToolCategory } from '@/config/tools';
import { getLocalizedPath, type Locale } from './i18n';
import { crawledNotIndexedContentRefreshToolSlugsByCategory } from './related-tools';

export interface DiscoverySpotlightTool {
  description: string;
  href: string;
  name: string;
  slug: string;
}

export interface CategoryDiscoverySpotlight {
  category: ToolCategory;
  href: string;
  icon: string;
  name: string;
  popularCount: number;
  toolCount: number;
  tools: DiscoverySpotlightTool[];
}

export const discoveryCategoryPriority: ToolCategory[] = [
  'text',
  'converters',
  'charts',
  'development',
  'encoding',
  'image',
  'network',
  'finance',
  'math',
  'office',
  'fun',
  'security',
];

const defaultDiscoverySpotlightLimit = 12;
const representativeToolLimit = 6;

const recoveryRepresentativeToolSlugsByCategory: Partial<Record<ToolCategory, string[]>> = {
  charts: ['gantt-chart-generator', ...(crawledNotIndexedContentRefreshToolSlugsByCategory.charts ?? [])],
  converters: ['csv-to-vcard-converter', 'vcard-to-csv-converter', 'ical-parser'],
  development: ['html-preview', ...(crawledNotIndexedContentRefreshToolSlugsByCategory.development ?? [])],
  encoding: ['hex-editor', 'ascii-table', 'unicode-converter', 'morse-code-player'],
  finance: ['iban-validator'],
  fun: [...(crawledNotIndexedContentRefreshToolSlugsByCategory.fun ?? [])],
  image: [
    'passport-photo-maker',
    'text-to-handwriting',
    'barcode-generator',
    ...(crawledNotIndexedContentRefreshToolSlugsByCategory.image ?? []),
  ],
  math: ['compound-interest-calculator', ...(crawledNotIndexedContentRefreshToolSlugsByCategory.math ?? [])],
  network: [
    'ip-lookup',
    'ip-validator',
    ...(crawledNotIndexedContentRefreshToolSlugsByCategory.network ?? []),
  ],
  office: [...(crawledNotIndexedContentRefreshToolSlugsByCategory.office ?? [])],
  text: ['grammar-checker', 'document-word-counter'],
};

function getRepresentativeToolSlugs(category: ToolCategory): string[] {
  const categoryTools = getToolsByCategory(category);
  const categoryToolSlugs = new Set(categoryTools.map((tool) => tool.slug));
  const recoverySlugs = (recoveryRepresentativeToolSlugsByCategory[category] ?? []).filter((slug) =>
    categoryToolSlugs.has(slug)
  );
  const popularSlugs = getPopularTools()
    .filter((tool) => tool.category === category)
    .map((tool) => tool.slug);
  const fallbackSlugs = categoryTools.map((tool) => tool.slug);

  return [...new Set([...recoverySlugs, ...popularSlugs, ...fallbackSlugs])].slice(0, representativeToolLimit);
}

export function buildCategoryDiscoverySpotlights(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>,
  limit = defaultDiscoverySpotlightLimit
): CategoryDiscoverySpotlight[] {
  const prioritizedCategories = discoveryCategoryPriority
    .map((id) => categories.find((category) => category.id === id))
    .filter((category): category is (typeof categories)[number] => Boolean(category));
  const fallbackCategories = categories
    .filter((category) => !discoveryCategoryPriority.includes(category.id))
    .sort((left, right) => getToolsByCategory(right.id).length - getToolsByCategory(left.id).length);

  return [...prioritizedCategories, ...fallbackCategories]
    .slice(0, limit)
    .map((category) => {
      const categoryTools = getToolsByCategory(category.id);
      const representativeSlugs = getRepresentativeToolSlugs(category.id);

      return {
        category: category.id,
        href: getLocalizedPath(locale, `/categories/${category.id}`),
        icon: category.icon,
        name: categoryNames[category.id] || category.id,
        popularCount: categoryTools.filter((tool) => tool.popular).length,
        toolCount: categoryTools.length,
        tools: representativeSlugs.map((slug) => ({
          slug,
          name: toolNames[slug] || slug,
          description: toolDescriptions[slug] || '',
          href: getLocalizedPath(locale, `/tools/${slug}`),
        })),
      };
    });
}

export function buildCategoryDiscoveryItemList(
  baseUrl: string,
  spotlights: CategoryDiscoverySpotlight[]
): Record<string, unknown> {
  return {
    name: 'U2Tool category discovery',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: spotlights.length,
    itemListElement: spotlights.map((spotlight, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}${spotlight.href}`,
      item: {
        '@type': 'CollectionPage',
        name: spotlight.name,
        url: `${baseUrl}${spotlight.href}`,
        numberOfItems: spotlight.toolCount,
        hasPart: spotlight.tools.map((tool) => ({
          '@type': 'SoftwareApplication',
          name: tool.name,
          description: tool.description || undefined,
          url: `${baseUrl}${tool.href}`,
        })),
      },
    })),
  };
}
