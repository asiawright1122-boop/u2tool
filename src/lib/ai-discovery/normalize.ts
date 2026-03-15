export function normalizeQuery(query: string): string {
  return query
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenizeQuery(query: string): string[] {
  const normalized = normalizeQuery(query);
  if (!normalized) {
    return [];
  }

  return normalized.split(' ');
}
