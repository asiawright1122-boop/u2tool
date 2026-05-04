export interface ToolSearchResultItem {
  slug?: string;
  href?: string;
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
