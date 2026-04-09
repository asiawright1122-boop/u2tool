import type { DiscoveryCandidate } from './types';

interface ToolLike {
  slug: string;
  category: string;
}

export const DISCOVERY_ALIASES: Record<string, string[]> = {
  'json-to-csv': ['json csv', 'convert json to csv'],
  'cron-generator': ['crontab', 'cron expression'],
  'docker-compose-generator': ['compose file', 'docker compose yaml'],
  'gitignore-generator': ['git ignore', '.gitignore'],
  'meta-tag-generator': ['meta tags', 'seo meta'],
};

function readToolString(
  toolsObj: Record<string, unknown>,
  slug: string,
  field: 'name' | 'description' | 'seo_title' | 'seo_description'
): string | null {
  const toolData = toolsObj[slug];
  if (!toolData || typeof toolData !== 'object') {
    return null;
  }

  const value = (toolData as Record<string, unknown>)[field];
  return typeof value === 'string' ? value : null;
}

export function buildDiscoveryIndex(
  tools: readonly ToolLike[],
  toolsObj: Record<string, unknown>,
  categoryMessages: Record<string, string>
): DiscoveryCandidate[] {
  return tools.map((tool) => {
    const name = readToolString(toolsObj, tool.slug, 'name') ?? tool.slug;
    const description = readToolString(toolsObj, tool.slug, 'description') ?? '';
    const seoTitle = readToolString(toolsObj, tool.slug, 'seo_title') ?? undefined;
    const seoDescription = readToolString(toolsObj, tool.slug, 'seo_description') ?? undefined;
    const categoryName = categoryMessages[tool.category] ?? tool.category;

    return {
      slug: tool.slug,
      name,
      description,
      seoTitle,
      seoDescription,
      category: tool.category,
      categoryName,
      aliases: DISCOVERY_ALIASES[tool.slug],
    };
  });
}
