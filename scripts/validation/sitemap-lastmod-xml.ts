function extractBlockLastmods(xml: string, tag: 'url' | 'sitemap'): Map<string, string> {
  const pattern = new RegExp(
    `<${tag}>[\\s\\S]*?<loc>(.*?)<\\/loc>[\\s\\S]*?<lastmod>(.*?)<\\/lastmod>[\\s\\S]*?<\\/${tag}>`,
    'g'
  );
  return new Map(
    Array.from(xml.matchAll(pattern)).map((match) => [match[1].trim(), match[2].trim()])
  );
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
