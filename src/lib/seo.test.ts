import { describe, expect, it } from 'vitest';
import {
  buildWebsiteSearchUrlTemplate,
  getCategoryPageSeo,
  getHomePageSeo,
  getHreflang,
  getToolsPageSeo,
  withBrand,
} from './seo';
import { buildPriorityIndexNowUrls } from './seo-discovery';

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

  it('normalizes outdated numeric claims in tools page SEO copy', () => {
    const seo = getToolsPageSeo(
      {
        pages: {
          tools: {
            seo_title: '100+ Free Online Tools for Developers & Designers | U2Tool',
            seo_description: 'Discover 100+ free online tools for developers and creators.',
          },
        },
      },
      501
    );

    expect(seo.title).toBe('501+ Free Online Tools for Developers & Designers | U2Tool');
    expect(seo.description).toBe('Discover 501+ free online tools for developers and creators.');
  });

  it('builds stronger homepage SEO copy when no dedicated home metadata exists', () => {
    const seo = getHomePageSeo(
      {
        home: {
          hero: {
            title: 'Free Online Tools',
            subtitle: 'Boost your productivity with our collection of free developer tools.',
          },
        },
      },
      501
    );

    expect(seo.title).toBe('U2Tool: 501+ Free Online Tools, Converters & Generators');
    expect(seo.description).toContain("Explore U2Tool's 501+ free online tools");
  });

  it('keeps home and tools fallback titles distinct to avoid intent overlap', () => {
    const homeSeo = getHomePageSeo({}, 501);
    const toolsSeo = getToolsPageSeo({}, 501);

    expect(homeSeo.title).not.toBe(toolsSeo.title);
    expect(homeSeo.title).toContain('U2Tool');
    expect(toolsSeo.title).toContain('Browse');
  });

  it('falls back to deterministic category SEO copy', () => {
    const seo = getCategoryPageSeo({}, 'security', 'Security', 42);

    expect(seo.title).toBe('Security Tools');
    expect(seo.description).toBe('42+ free Security tools online.');
  });

  it('keeps encoding category SEO pinned to Hex intent when message assets are stale', () => {
    const seo = getCategoryPageSeo(
      {
        categories_seo: {
          encoding: {
            seo_title: 'Encoding & Decoding Tools - JSON, Base64, HTML Encoder Online',
            seo_description: 'Free online encoding tools for JSON formatting, Base64 encoding/decoding, HTML entity encoding, and more.',
          },
        },
      },
      'encoding',
      'Encoding & Decoding',
      33
    );

    expect(seo.title).toContain('Hex');
    expect(seo.description).toContain('hex');
  });

  it('normalizes stale Russian encoding category titles for rendered SEO checks', () => {
    const seo = getCategoryPageSeo(
      {
        categories_seo: {
          encoding: {
            seo_title: '\u0418\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u044b \u041a\u043e\u0434\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f - JSON, Base64, HTML \u041a\u043e\u0434\u0438\u0440\u043e\u0432\u0449\u0438\u043a \u041e\u043d\u043b\u0430\u0439\u043d',
            seo_description: '\u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u044b\u0435 \u043e\u043d\u043b\u0430\u0439\u043d \u0438\u043d\u0441\u0442\u0440\u0443\u043c\u0435\u043d\u0442\u044b \u043a\u043e\u0434\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f \u0434\u043b\u044f JSON, Base64 \u0438 HTML.',
          },
        },
      },
      'encoding',
      '\u041a\u043e\u0434\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435',
      33
    );

    expect(seo.title).toContain('\u043a\u043e\u0434\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f');
    expect(seo.title).toContain('Hex');
    expect(seo.description).toContain('hex');
  });

  it('does not duplicate the brand in titles', () => {
    expect(withBrand('Free Tools | U2Tool')).toBe('Free Tools | U2Tool');
    expect(withBrand('Free Tools')).toBe('Free Tools | U2Tool');
  });

  it('builds a valid search action URL template', () => {
    expect(buildWebsiteSearchUrlTemplate('https://www.u2tool.com', 'en'))
      .toBe('https://www.u2tool.com/en/tools/?q={search_term_string}');
  });

  it('returns shared hreflang mappings', () => {
    expect(getHreflang('zh')).toBe('zh-CN');
    expect(getHreflang('pt')).toBe('pt');
  });

  it('builds canonical priority IndexNow URLs with trailing slashes', () => {
    const urls = buildPriorityIndexNowUrls('https://www.u2tool.com/', {
      limit: 5,
      selectedLocales: ['en'],
    });

    expect(urls).toContain('https://www.u2tool.com/en/');
    expect(urls.every((url) => url.endsWith('/'))).toBe(true);
    expect(urls.every((url) => !url.includes('com//'))).toBe(true);
  });
});
