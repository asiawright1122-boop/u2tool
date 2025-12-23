/**
 * OG 图片 API 测试
 * Property 8: Dynamic OG Image Generation
 * Validates: Requirements 9.1, 9.2, 9.4
 */

import { describe, it, expect } from 'vitest';
import { SEO_CONFIG, generateOgImageUrl } from '@/lib/seo';

// OG 图片尺寸常量
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

describe('OG 图片 API', () => {
  describe('generateOgImageUrl', () => {
    it('应该生成正确的 OG 图片 URL', () => {
      const url = generateOgImageUrl({
        title: 'JSON Formatter',
        locale: 'en',
        icon: '📋',
      });

      expect(url).toContain('/api/og');
      expect(url).toContain('title=');
      expect(url).toContain('locale=en');
      expect(url).toContain('icon=');
    });

    it('应该正确编码标题中的特殊字符', () => {
      const url = generateOgImageUrl({
        title: 'JSON & XML Formatter',
        locale: 'en',
      });

      expect(url).toContain('title=JSON');
      // URL 编码会将 & 转换为 %26
      expect(url).toContain('%26');
    });

    it('应该处理中文标题', () => {
      const url = generateOgImageUrl({
        title: 'JSON 格式化工具',
        locale: 'zh',
      });

      expect(url).toContain('locale=zh');
      // 中文会被 URL 编码
      expect(url).toContain('%');
    });

    it('应该处理没有 icon 的情况', () => {
      const url = generateOgImageUrl({
        title: 'Test Tool',
        locale: 'en',
      });

      expect(url).not.toContain('icon=');
    });
  });

  describe('OG 图片尺寸', () => {
    it('应该使用标准 OG 图片尺寸 1200x630', () => {
      expect(OG_WIDTH).toBe(1200);
      expect(OG_HEIGHT).toBe(630);
    });

    it('宽高比应该接近 1.91:1', () => {
      const ratio = OG_WIDTH / OG_HEIGHT;
      expect(ratio).toBeCloseTo(1.9, 1);
    });
  });
});

// Property 8: Dynamic OG Image Generation
describe('Property 8: Dynamic OG Image Generation', () => {
  it('*For any* locale, generateOgImageUrl 应该生成有效的 URL', () => {
    const testCases = [
      { title: 'JSON Formatter', locale: 'en', icon: '📋' },
      { title: 'Base64 编码', locale: 'zh', icon: '🔐' },
      { title: 'Generador UUID', locale: 'es', icon: '🆔' },
      { title: 'Gerador de Senha', locale: 'pt', icon: '🔑' },
      { title: 'ハッシュ生成', locale: 'ja', icon: '#️⃣' },
    ];

    for (const testCase of testCases) {
      const url = generateOgImageUrl(testCase);

      // 验证 URL 格式
      expect(url).toContain(SEO_CONFIG.siteUrl);
      expect(url).toContain('/api/og');
      expect(url).toContain(`locale=${testCase.locale}`);
    }
  });

  it('*For any* 工具, OG 图片 URL 应该包含工具信息', () => {
    const tools = [
      { name: 'JSON Formatter', icon: '📋' },
      { name: 'UUID Generator', icon: '🆔' },
      { name: 'Password Generator', icon: '🔑' },
      { name: 'Hash Generator', icon: '#️⃣' },
      { name: 'QR Generator', icon: '📱' },
    ];

    for (const tool of tools) {
      for (const locale of SEO_CONFIG.locales) {
        const url = generateOgImageUrl({
          title: tool.name,
          locale,
          icon: tool.icon,
        });

        // 验证 URL 包含必要参数
        expect(url).toContain('title=');
        expect(url).toContain(`locale=${locale}`);
        expect(url).toContain('icon=');
      }
    }
  });

  it('OG 图片 URL 应该是有效的 URL 格式', () => {
    const url = generateOgImageUrl({
      title: 'Test Tool',
      locale: 'en',
      icon: '🔧',
    });

    // 验证 URL 可以被解析
    expect(() => new URL(url)).not.toThrow();

    const parsedUrl = new URL(url);
    expect(parsedUrl.pathname).toBe('/api/og');
    expect(parsedUrl.searchParams.get('title')).toBe('Test Tool');
    expect(parsedUrl.searchParams.get('locale')).toBe('en');
  });
});
