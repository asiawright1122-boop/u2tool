import { describe, expect, it } from 'vitest';
import {
  buildWebsiteSearchUrlTemplate,
  getCategoryPageSeo,
  getHreflang,
  getToolsPageSeo,
  withBrand,
} from './seo';

describe('seo helpers', () => {
  it('reuses localized tools page SEO when available', () => {
    const seo = getToolsPageSeo(
      {
        pages: {
          tools: {
            seo_title: 'Free Developer Tools | U2Tool',
            seo_description: 'Localized tools listing description.',
          },
        },
      },
      501
    );

    expect(seo.title).toBe('Free Developer Tools | U2Tool');
    expect(seo.description).toBe('Localized tools listing description.');
  });

  it('falls back to deterministic category SEO copy', () => {
    const seo = getCategoryPageSeo({}, 'security', 'Security', 42);

    expect(seo.title).toBe('Security Tools');
    expect(seo.description).toBe('42+ free Security tools online.');
  });

  it('does not duplicate the brand in titles', () => {
    expect(withBrand('Free Tools | U2Tool')).toBe('Free Tools | U2Tool');
    expect(withBrand('Free Tools')).toBe('Free Tools | U2Tool');
  });

  it('builds a valid search action URL template', () => {
    expect(buildWebsiteSearchUrlTemplate('https://www.u2tool.com', 'en'))
      .toBe('https://www.u2tool.com/en/tools?q={search_term_string}');
  });

  it('returns shared hreflang mappings', () => {
    expect(getHreflang('zh')).toBe('zh-CN');
    expect(getHreflang('pt')).toBe('pt');
  });
});
