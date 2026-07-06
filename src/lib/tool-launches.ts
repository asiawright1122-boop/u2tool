import { tools } from '@/config/tools';
import { getLocalizedPath, type Locale } from './i18n';

export const recentLongTailToolSlugs = [
  'ai-token-calculator',
  'llms-txt-validator',
  'ai-robots-txt-generator',
  'mcp-json-validator',
  'mcp-server-config-generator',
  'json-repair',
  'jsonl-validator',
  'har-file-viewer',
  'world-cup-2026-bracket-predictor',
  'llms-txt-generator',
  'instagram-bio-generator',
  'youtube-description-generator',
  'linkedin-headline-generator',
  'linkedin-summary-generator',
  'email-subject-line-generator',
  'etsy-fee-calculator',
  'freelance-rate-calculator',
  'vcard-to-csv-converter',
  'docker-run-to-docker-compose-converter',
] as const;

export interface ToolLaunchItem {
  category: string;
  categoryName: string;
  description: string;
  href: string;
  icon: string;
  name: string;
  slug: string;
}

export function buildRecentToolLaunches(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): ToolLaunchItem[] {
  const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));

  return recentLongTailToolSlugs
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
    }));
}

export function buildToolLaunchItemList(
  baseUrl: string,
  launches: ToolLaunchItem[]
): Record<string, unknown> {
  return {
    name: 'U2Tool recent tool launches',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: launches.length,
    itemListElement: launches.map((tool, index) => ({
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
