import { describe, expect, it } from 'vitest';
import { tools } from '@/config/tools';
import { INDEX_SUPPRESSION } from '@/config/index-suppression.generated';
import { locales } from '@/lib/i18n';
import { buildLocalizedAlternates } from '@/lib/seo';
import { getIndexableToolLocales } from './tool-indexability';

const base = 'https://www.u2tool.com';

describe('shared tool language discovery', () => {
  it('keeps Chinese encoding detection discoverable without pointing to suppressed English', () => {
    const available = getIndexableToolLocales('encoding-detector');
    expect(available).toContain('zh');
    expect(available).not.toContain('en');
    expect(buildLocalizedAlternates(base, '/tools/encoding-detector', available))
      .toContainEqual({ hreflang: 'x-default', href: `${base}/zh/tools/encoding-detector/` });
  });

  it('omits all alternates when no language is eligible or a slug is unknown', () => {
    expect(buildLocalizedAlternates(base, '/tools/example', [])).toEqual([]);
    expect(getIndexableToolLocales('not-a-published-tool')).toEqual([]);
    const fullySuppressed = tools.find(tool => locales.every(locale => INDEX_SUPPRESSION[`${locale}/${tool.slug}`]));
    expect(fullySuppressed).toBeDefined();
    expect(getIndexableToolLocales(fullySuppressed!.slug)).toEqual([]);
  });

  it('chooses the same valid fallback regardless of input order and duplicates', () => {
    const first = buildLocalizedAlternates(base, '/tools/example', ['fr', 'ja', 'fr']);
    const second = buildLocalizedAlternates(base, '/tools/example/', ['ja', 'fr']);
    expect(first).toEqual(second);
    expect(first.at(-1)).toEqual({ hreflang: 'x-default', href: `${base}/ja/tools/example/` });
    expect(buildLocalizedAlternates(base, '/tools/example', ['fr', 'ja'], 'fr').at(-1)?.href)
      .toBe(`${base}/fr/tools/example/`);
  });

  it('preserves the ordinary all-language page contract and English default', () => {
    const alternates = buildLocalizedAlternates(base, '/tools');
    expect(alternates).toHaveLength(11);
    expect(alternates.at(-1)).toEqual({ hreflang: 'x-default', href: `${base}/en/tools/` });
    expect(alternates).toContainEqual({ hreflang: 'zh-CN', href: `${base}/zh/tools/` });
  });

  it('covers the exact approved locale set for every active tool without mutating state', () => {
    let retained = 0;
    for (const tool of tools) {
      const eligible = getIndexableToolLocales(tool.slug);
      expect(eligible).toEqual(locales.filter(locale => !INDEX_SUPPRESSION[`${locale}/${tool.slug}`]));
      retained += eligible.length;
    }
    expect(retained).toBe(1795);
  });
});
