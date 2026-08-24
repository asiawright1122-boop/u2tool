import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  META_DESCRIPTION_MAX_LENGTH,
  META_DESCRIPTION_MIN_LENGTH,
  buildWebsiteSearchUrlTemplate,
  buildCanonicalUrl,
  getCategoryPageSeo,
  getHomePageSeo,
  getHreflang,
  getToolsPageSeo,
  resolveMetaDescription,
  resolveSiteDescription,
  withBrand,
} from './seo';
import { buildPriorityIndexNowUrls } from './seo-discovery';
import { isIndexSuppressed } from './index-suppression';

describe('seo helpers', () => {
  it('normalizes stale tool counts in the shared site description', () => {
    expect(resolveSiteDescription('500+ free online tools with no signup.', 570))
      .toBe('570+ free online tools with no signup.');
    expect(resolveSiteDescription('提供 500+ 款免费在线工具。', 570))
      .toBe('提供 570+ 款免费在线工具。');
  });

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
      501,
      'en'
    );

    expect(seo.title).toBe('Free Developer Tools | U2Tool');
    expect(seo.description).toBe(resolveMetaDescription({
      description: 'Localized tools listing description.',
      locale: 'en',
      title: 'Free Developer Tools | U2Tool',
    }));
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
      501,
      'en'
    );

    expect(seo.title).toBe('501+ Free Online Tools for Developers & Designers | U2Tool');
    expect(seo.description).toBe(resolveMetaDescription({
      description: 'Discover 501+ free online tools for developers and creators.',
      locale: 'en',
      title: '501+ Free Online Tools for Developers & Designers | U2Tool',
    }));
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
    expect(seo.description).toBe(resolveMetaDescription({
      description: '42+ free Security tools online.',
      title: 'Security Tools',
    }));
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

  it('expands short localized meta descriptions into the safe SEO range', () => {
    const description = resolveMetaDescription({
      description: '快速编辑十六进制。',
      locale: 'zh',
      title: 'Hex Editor',
    });

    expect([...description].length).toBeGreaterThanOrEqual(META_DESCRIPTION_MIN_LENGTH);
    expect([...description].length).toBeLessThanOrEqual(META_DESCRIPTION_MAX_LENGTH);
    expect(description).toContain('快速编辑十六进制');
    expect(description).toContain('无需注册');
  });

  it('uses a Bing-safe minimum length for short CJK meta descriptions', () => {
    const description = resolveMetaDescription({
      description: '将联系人 CSV 行转换为适用于通讯录和 CRM 导入的 vCard 文本。',
      locale: 'zh',
      title: '免费在线CSV 转 vCard 转换器',
    });

    expect([...description].length).toBeGreaterThanOrEqual(150);
    expect([...description].length).toBeLessThanOrEqual(META_DESCRIPTION_MAX_LENGTH);
  });

  it('uses a Bing-safe minimum length for short RTL meta descriptions', () => {
    const description = resolveMetaDescription({
      description: 'قارن أدوات النص قبل فتح صفحة واحدة.',
      locale: 'ar',
      title: 'دليل أدوات النص',
    });

    expect([...description].length).toBeGreaterThanOrEqual(150);
    expect([...description].length).toBeLessThanOrEqual(META_DESCRIPTION_MAX_LENGTH);
  });

  it('truncates overlong meta descriptions without exceeding the shared max', () => {
    const description = resolveMetaDescription({
      description: 'Free online developer utility for testing metadata, converting content, validating structured data, generating copy, reviewing SEO output, and preparing browser-based workflows without signup or server uploads.',
      locale: 'en',
      title: 'Developer Utility',
    });

    expect([...description].length).toBeLessThanOrEqual(META_DESCRIPTION_MAX_LENGTH);
    expect(description.endsWith('…')).toBe(true);
  });

  it('does not duplicate the brand in titles', () => {
    expect(withBrand('Free Tools | U2Tool')).toBe('Free Tools | U2Tool');
    expect(withBrand('Free Tools')).toBe('Free Tools | U2Tool');
  });

  it('keeps latin branded titles within the SERP safe boundary', () => {
    const long = 'AI Tools Directory - Token Cost, Prompt Templates and RAG Tools';
    const branded = withBrand(long);
    expect(branded.length).toBeLessThanOrEqual(70);
    expect(branded.endsWith(' | U2Tool')).toBe(true);
    expect(branded).not.toContain('  ');
  });

  it('keeps CJK branded titles within the SERP safe boundary', () => {
    const long = 'AI 爬虫工具集 - Robots.txt 规则和 llms.txt 生成器';
    const branded = withBrand(long);
    expect(branded.length).toBeLessThanOrEqual(35);
    expect(branded.endsWith(' | U2Tool')).toBe(true);
  });

  it('builds a valid search action URL template', () => {
    expect(buildWebsiteSearchUrlTemplate('https://www.u2tool.com', 'en'))
      .toBe('https://www.u2tool.com/en/tools/?q={search_term_string}');
  });

  it('builds canonical URLs without request query strings or hashes', () => {
    const canonical = buildCanonicalUrl({
      baseUrl: 'https://www.u2tool.com/',
      locale: 'zh',
      requestUrl: 'https://www.u2tool.com/zh/ai/rag-tools/?utm_source=test#pricing',
      canonicalPath: '/ai/rag-tools',
    });

    expect(canonical).toBe('https://www.u2tool.com/zh/ai/rag-tools/');
  });

  it('derives canonical paths from localized request pathnames when no override is provided', () => {
    const canonical = buildCanonicalUrl({
      baseUrl: 'https://www.u2tool.com',
      locale: 'en',
      requestUrl: new URL('https://www.u2tool.com/en/tools/?q=json'),
    });

    expect(canonical).toBe('https://www.u2tool.com/en/tools/');
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

  it('keeps GSC performance-loss recovery pages in priority discovery', () => {
    const urls = buildPriorityIndexNowUrls('https://www.u2tool.com/', {
      selectedLocales: ['en', 'es'],
    });

    expect(urls).toContain('https://www.u2tool.com/en/tools/gantt-chart-generator/');
    expect(urls).toContain('https://www.u2tool.com/en/tools/ascii-table/');
    expect(urls).toContain('https://www.u2tool.com/en/tools/iban-validator/');
    expect(urls).toContain('https://www.u2tool.com/en/tools/compound-interest-calculator/');
    // es/document-word-counter was suppressed by the 2026-08-04 index-hygiene
    // pass, then recovered by the 2026-08-20 priority fix (demand=null no
    // longer treated as zero demand), so it is indexable again and submitted.
    expect(urls).toContain('https://www.u2tool.com/es/tools/document-word-counter/');
  });

  it('keeps crawled-not-indexed content-refresh pages in priority discovery', () => {
    const urls = buildPriorityIndexNowUrls('https://www.u2tool.com/', {
      selectedLocales: ['en', 'es', 'fr'],
    });

    expect(urls).toContain('https://www.u2tool.com/en/tools/database-connection-tester/');
    expect(urls).toContain('https://www.u2tool.com/fr/tools/image-resizer/');
    expect(urls).toContain('https://www.u2tool.com/en/tools/merge-conflict-resolver/');
    expect(urls).toContain('https://www.u2tool.com/en/tools/go-formatter/');
    expect(urls).toContain('https://www.u2tool.com/es/tools/image-cropper/');
    expect(urls).toContain('https://www.u2tool.com/es/tools/love-calculator/');
    expect(urls).toContain('https://www.u2tool.com/es/tools/gif-maker/');
    expect(urls).toContain('https://www.u2tool.com/es/tools/venn-diagram-generator/');
    expect(urls).toContain('https://www.u2tool.com/es/tools/world-clock/');
    expect(urls).toContain('https://www.u2tool.com/en/tools/compound-interest-calculator/');
    expect(urls).toContain('https://www.u2tool.com/en/tools/tile-calculator/');
  });

  it('keeps AI topic hub routes in priority discovery', () => {
    const urls = buildPriorityIndexNowUrls('https://www.u2tool.com/', {
      selectedLocales: ['en', 'zh'],
    });

    // The AI hub pages are not tool detail pages, so index suppression
    // (which is tool-scoped) never removes them.
    expect(urls).toContain('https://www.u2tool.com/en/ai/prompt-tools/');
    expect(urls).toContain('https://www.u2tool.com/en/ai/rag-tools/');
    expect(urls).toContain('https://www.u2tool.com/zh/ai/ai-crawler-tools/');
  });

  it('submits recovered AI tool pages to priority discovery', () => {
    const urls = buildPriorityIndexNowUrls('https://www.u2tool.com/', {
      selectedLocales: ['en', 'zh'],
    });

    // These were suppressed by the 2026-08-04 index-hygiene pass, then
    // recovered by the 2026-08-20 priority fix (product priority p1 retains
    // indexability even when GSC demand data is missing). They now render
    // indexable pages, so submitting them to IndexNow is valid.
    expect(urls).toContain('https://www.u2tool.com/en/tools/ai-token-calculator/');
    expect(urls).toContain('https://www.u2tool.com/en/tools/ai-prompt-template-generator/');
    expect(urls).toContain('https://www.u2tool.com/en/tools/rag-chunk-size-calculator/');
    expect(urls).toContain('https://www.u2tool.com/zh/tools/ai-robots-txt-generator/');
    expect(urls).toContain('https://www.u2tool.com/zh/tools/llms-txt-generator/');
  });

  it('never submits a suppressed tool URL to IndexNow', () => {
    const urls = buildPriorityIndexNowUrls('https://www.u2tool.com');
    const suppressed = urls.filter((url) => {
      const match = /u2tool\.com\/([a-z]{2})\/tools\/([^/]+)\//.exec(url);
      return match ? isIndexSuppressed(match[1], match[2]) : false;
    });

    expect(suppressed).toEqual([]);
  });
});

import { getDefaultRobots } from '@/lib/robots';

describe('default robots helper', () => {
  it('returns noindex, nofollow when search params present', () => {
    expect(getDefaultRobots(true)).toBe('noindex, nofollow');
  });
  it('returns index, follow when no search params', () => {
    expect(getDefaultRobots(false)).toBe('index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
  });
});

describe('og/twitter title branding guard', () => {
  const srcRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

  function collectAstroFiles(dir: string, out: string[] = []): string[] {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        collectAstroFiles(full, out);
      } else if (entry.isFile() && entry.name.endsWith('.astro')) {
        out.push(full);
      }
    }
    return out;
  }

  it('does not append the brand manually to og:title/twitter:title (must route through withBrand)', () => {
    const offenders: string[] = [];
    // Rejects any og:title/twitter:title whose content is a template literal that
    // hard-codes the "| U2Tool" suffix, which bypasses withBrand() length gating.
    const forbidden = /(og:title|twitter:title)"[^>]*content={\$\{[^}]*\|\s*U2Tool/;
    for (const file of collectAstroFiles(srcRoot)) {
      const lineMatches = fs.readFileSync(file, 'utf8').split('\n').map((line, index) => ({ line, index }));
      for (const { line, index } of lineMatches.filter((m) => forbidden.test(m.line))) {
        offenders.push(`${path.relative(srcRoot, file)}:${index + 1}: ${line.trim()}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
