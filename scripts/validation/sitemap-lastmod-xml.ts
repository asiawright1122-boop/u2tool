function extractBlockLastmods(xml: string, tag: 'url' | 'sitemap'): Map<string, string> {
  const blockPattern = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'g');
  const values = new Map<string, string>();

  for (const match of xml.matchAll(blockPattern)) {
    const block = match[1];
    const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1]?.trim();
    const lastmod = block.match(/<lastmod>(.*?)<\/lastmod>/)?.[1]?.trim();
    if (!loc) {
      throw new Error(`${tag} block missing loc`);
    }
    if (!lastmod) {
      throw new Error(`${tag} block for ${loc} missing lastmod`);
    }
    values.set(loc, lastmod);
  }

  return values;
}

export function extractUrlLastmods(xml: string): Map<string, string> {
  return extractBlockLastmods(xml, 'url');
}

export function extractSitemapIndexLastmods(xml: string): Map<string, string> {
  return extractBlockLastmods(xml, 'sitemap');
}

export function assertValidLastmods(values: readonly string[], today: string): void {
  if (values.length === 0) {
    throw new Error('no lastmod values found');
  }

  for (const value of values) {
    const parsed = new Date(`${value}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== value
    ) {
      throw new Error(`invalid lastmod "${value}"`);
    }
    if (value > today) {
      throw new Error(`future lastmod "${value}"`);
    }
  }
}

export function assertExpectedLastmod(
  values: ReadonlyMap<string, string>,
  url: string,
  expected: string
): void {
  const actual = values.get(url) || 'missing';
  if (actual !== expected) {
    throw new Error(`${url}: expected ${expected}, got ${actual}`);
  }
}
