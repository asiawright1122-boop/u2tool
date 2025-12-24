/**
 * 站点地图属性测试
 * Property 4: Sitemap Completeness
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5
 */

import { describe, it, expect } from 'vitest';
import { tools } from '@/config/tools';
import { SEO_CONFIG, SEO_LOCALES } from '@/lib/seo';

// 模拟 sitemap 生成逻辑
function generateSitemapAlternates(path: string) {
  return {
    languages: Object.fromEntries(
      SEO_LOCALES.map(locale => [locale, `${SEO_CONFIG.siteUrl}/${locale}${path}`])
    )
  };
}

interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: string;
  priority: number;
  alternates: { languages: Record<string, string> };
}

function generateSitemap(): SitemapEntry[] {
  const routes: SitemapEntry[] = [];
  const now = new Date();

  for (const locale of SEO_LOCALES) {
    routes.push({
      url: `${SEO_CONFIG.siteUrl}/${locale}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: generateSitemapAlternates(''),
    });

    routes.push({
      url: `${SEO_CONFIG.siteUrl}/${locale}/tools`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: generateSitemapAlternates('/tools'),
    });

    for (const tool of tools) {
      const priority = tool.popular ? 0.8 : 0.7;
      
      routes.push({
        url: `${SEO_CONFIG.siteUrl}/${locale}/tools/${tool.slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority,
        alternates: generateSitemapAlternates(`/tools/${tool.slug}`),
      });
    }
  }

  return routes;
}

describe('站点地图', () => {
  const sitemap = generateSitemap();

  describe('基本结构', () => {
    it('应该包含所有语言的首页', () => {
      for (const locale of SEO_LOCALES) {
        const homeEntry = sitemap.find(
          entry => entry.url === `${SEO_CONFIG.siteUrl}/${locale}`
        );
        expect(homeEntry).toBeDefined();
        expect(homeEntry?.priority).toBe(1.0);
      }
    });

    it('应该包含所有语言的工具列表页', () => {
      for (const locale of SEO_LOCALES) {
        const toolsEntry = sitemap.find(
          entry => entry.url === `${SEO_CONFIG.siteUrl}/${locale}/tools`
        );
        expect(toolsEntry).toBeDefined();
        expect(toolsEntry?.priority).toBe(0.9);
      }
    });

    it('应该包含所有工具的所有语言版本', () => {
      for (const tool of tools) {
        for (const locale of SEO_LOCALES) {
          const toolEntry = sitemap.find(
            entry => entry.url === `${SEO_CONFIG.siteUrl}/${locale}/tools/${tool.slug}`
          );
          expect(toolEntry).toBeDefined();
        }
      }
    });
  });

  describe('priority 值', () => {
    it('首页 priority 应该为 1.0', () => {
      const homeEntries = sitemap.filter(
        entry => entry.url.match(/\/[a-z]{2}$/)
      );
      for (const entry of homeEntries) {
        expect(entry.priority).toBe(1.0);
      }
    });

    it('工具列表页 priority 应该为 0.9', () => {
      const toolsListEntries = sitemap.filter(
        entry => entry.url.match(/\/[a-z]{2}\/tools$/)
      );
      for (const entry of toolsListEntries) {
        expect(entry.priority).toBe(0.9);
      }
    });

    it('热门工具 priority 应该为 0.8', () => {
      const popularTools = tools.filter(t => t.popular);
      for (const tool of popularTools) {
        const toolEntries = sitemap.filter(
          entry => entry.url.endsWith(`/tools/${tool.slug}`)
        );
        for (const entry of toolEntries) {
          expect(entry.priority).toBe(0.8);
        }
      }
    });

    it('非热门工具 priority 应该为 0.7', () => {
      const nonPopularTools = tools.filter(t => !t.popular);
      for (const tool of nonPopularTools) {
        const toolEntries = sitemap.filter(
          entry => entry.url.endsWith(`/tools/${tool.slug}`)
        );
        for (const entry of toolEntries) {
          expect(entry.priority).toBe(0.7);
        }
      }
    });
  });

  describe('alternates', () => {
    it('每个条目都应该有 alternates', () => {
      for (const entry of sitemap) {
        expect(entry.alternates).toBeDefined();
        expect(entry.alternates.languages).toBeDefined();
      }
    });

    it('alternates 应该包含所有支持的语言', () => {
      for (const entry of sitemap) {
        for (const locale of SEO_LOCALES) {
          expect(entry.alternates.languages[locale]).toBeDefined();
        }
      }
    });
  });
});

// Property 4: Sitemap Completeness
describe('Property 4: Sitemap Completeness', () => {
  const sitemap = generateSitemap();

  it('*For any* 工具, sitemap 应该包含所有语言版本', () => {
    for (const tool of tools) {
      const toolEntries = sitemap.filter(
        entry => entry.url.endsWith(`/tools/${tool.slug}`)
      );
      
      // 应该有 5 个条目（每种语言一个）
      expect(toolEntries.length).toBe(SEO_LOCALES.length);
      
      // 验证每种语言都有
      for (const locale of SEO_LOCALES) {
        const localeEntry = toolEntries.find(
          entry => entry.url === `${SEO_CONFIG.siteUrl}/${locale}/tools/${tool.slug}`
        );
        expect(localeEntry).toBeDefined();
      }
    }
  });

  it('*For any* 条目, alternates 应该包含所有语言的正确 URL', () => {
    for (const entry of sitemap) {
      const alternates = entry.alternates.languages;
      
      // 验证所有语言都有
      expect(Object.keys(alternates).length).toBe(SEO_LOCALES.length);
      
      // 验证 URL 格式正确
      for (const [locale, url] of Object.entries(alternates)) {
        expect(url).toContain(SEO_CONFIG.siteUrl);
        expect(url).toContain(`/${locale}`);
      }
    }
  });

  it('sitemap 总条目数应该正确', () => {
    // 每种语言: 1 首页 + 1 工具列表 + N 工具页面
    const expectedPerLocale = 1 + 1 + tools.length;
    const expectedTotal = expectedPerLocale * SEO_LOCALES.length;
    
    expect(sitemap.length).toBe(expectedTotal);
  });

  it('*For any* 条目, priority 应该在 0-1 之间', () => {
    for (const entry of sitemap) {
      expect(entry.priority).toBeGreaterThanOrEqual(0);
      expect(entry.priority).toBeLessThanOrEqual(1);
    }
  });

  it('*For any* 条目, changeFrequency 应该是有效值', () => {
    const validFrequencies = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
    
    for (const entry of sitemap) {
      expect(validFrequencies).toContain(entry.changeFrequency);
    }
  });
});

// Property 6: Sitemap Validity (图片 sitemap)
describe('Property 6: Sitemap Validity - Image Sitemap', () => {
  // 生成工具的 OG 图片 URL
  function generateToolImageUrl(toolName: string, locale: string, icon: string): string {
    return `${SEO_CONFIG.siteUrl}/api/og?title=${encodeURIComponent(toolName)}&locale=${locale}&icon=${encodeURIComponent(icon)}`;
  }

  it('should generate valid image URLs for tools', () => {
    const testTool = tools[0];
    const toolName = testTool.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    for (const locale of SEO_LOCALES) {
      const imageUrl = generateToolImageUrl(toolName, locale, testTool.icon);
      
      // 验证 URL 格式
      expect(imageUrl).toContain('/api/og');
      expect(imageUrl).toContain('title=');
      expect(imageUrl).toContain(`locale=${locale}`);
      expect(imageUrl).toContain('icon=');
    }
  });

  it('should encode special characters in image URLs', () => {
    const toolName = 'JSON Formatter & Validator';
    const imageUrl = generateToolImageUrl(toolName, 'en', '📋');
    
    // 验证特殊字符被编码
    expect(imageUrl).not.toContain('&V'); // & 应该被编码
    expect(imageUrl).toContain(encodeURIComponent('&'));
  });

  it('should generate unique image URLs for each tool', () => {
    const imageUrls = new Set<string>();
    
    for (const tool of tools.slice(0, 10)) {
      const toolName = tool.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const imageUrl = generateToolImageUrl(toolName, 'en', tool.icon);
      imageUrls.add(imageUrl);
    }
    
    // 所有 URL 应该是唯一的
    expect(imageUrls.size).toBe(Math.min(10, tools.length));
  });
});
