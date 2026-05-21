export function normalizeQuery(query: string): string {
  return query
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const CJK_PATTERN = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;

function buildCjkNgrams(value: string): string[] {
  const compact = value.replace(/\s+/g, '');
  const tokens = new Set<string>([value]);

  for (const size of [2, 3]) {
    if (compact.length < size) {
      continue;
    }

    for (let index = 0; index <= compact.length - size; index += 1) {
      tokens.add(compact.slice(index, index + size));
    }
  }

  return Array.from(tokens);
}

export function tokenizeQuery(query: string): string[] {
  const normalized = normalizeQuery(query);
  if (!normalized) {
    return [];
  }

  if (CJK_PATTERN.test(normalized) && !normalized.includes(' ')) {
    return buildCjkNgrams(normalized);
  }

  return normalized.split(' ');
}
