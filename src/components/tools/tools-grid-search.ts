export interface ToolSearchResultItem {
  slug?: string;
  href?: string;
  name?: string;
  description?: string;
  category?: string;
  categoryName?: string;
}

export interface ScoredToolSearchResult<T extends ToolSearchResultItem> {
  item: T;
  score: number;
}

export function normalizeToolSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function scoreToolSearchResult(
  item: ToolSearchResultItem,
  rawQuery: string
): number {
  const query = normalizeToolSearchText(rawQuery);
  if (!query) return 0;

  const tokens = query.split(' ');
  const name = normalizeToolSearchText(item.name || item.slug || '');
  const slug = normalizeToolSearchText(item.slug || '');
  const description = normalizeToolSearchText(item.description || '');
  const category = normalizeToolSearchText(item.categoryName || item.category || '');
  let score = 0;

  if (name === query || slug === query) score += 220;
  if (name.startsWith(query) || slug.startsWith(query)) score += 100;
  if (name.includes(query) || slug.includes(query)) score += 80;
  if (description.includes(query)) score += 30;
  if (category.includes(query)) score += 20;

  for (const token of tokens) {
    if (name.includes(token) || slug.includes(token)) score += 12;
    if (description.includes(token)) score += 5;
    if (category.includes(token)) score += 3;
  }

  return score;
}

export function searchTools<T extends ToolSearchResultItem>(
  items: T[],
  rawQuery: string,
  options: { category?: string | null; limit?: number } = {}
): T[] {
  const query = normalizeToolSearchText(rawQuery);
  if (!query) return [];

  const category = options.category?.trim() || '';
  const limit = options.limit ?? 24;

  return items
    .map((item, index) => ({ item, index, score: scoreToolSearchResult(item, query) }))
    .filter(({ item, score }) => score > 0 && (!category || item.category === category))
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, limit)
    .map(({ item }) => item);
}

function ensureTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

export function buildSearchResultHref(
  item: ToolSearchResultItem,
  toolsBasePath: string
): string {
  if (item.href) {
    return item.href;
  }

  const normalizedBasePath = ensureTrailingSlash(toolsBasePath.trim());
  const normalizedSlug = (item.slug || '').trim().replace(/^\/+|\/+$/g, '');

  if (!normalizedBasePath || !normalizedSlug) {
    return '#';
  }

  return `${normalizedBasePath}${normalizedSlug}/`;
}
