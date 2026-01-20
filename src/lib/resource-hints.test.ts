/**
 * 资源提示属性测试
 * Property 5: Resource Hints Completeness
 * 验证 preload、dns-prefetch、preconnect 配置
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Resource Hints - Property Tests', () => {
  // 读取 layout.tsx 文件内容
  const layoutPath = join(process.cwd(), 'src/app/[locale]/layout.tsx');
  let layoutContent: string;
  
  try {
    layoutContent = readFileSync(layoutPath, 'utf-8');
  } catch {
    layoutContent = '';
  }

  describe('Property 5: Resource Hints Completeness', () => {
    // 测试 dns-prefetch 链接存在
    it('should have dns-prefetch links for external domains', () => {
      expect(layoutContent).toContain('rel="dns-prefetch"');
      expect(layoutContent).toContain('fonts.googleapis.com');
      expect(layoutContent).toContain('fonts.gstatic.com');
    });

    // 测试 preconnect 链接存在
    it('should have preconnect links for critical domains', () => {
      expect(layoutContent).toContain('rel="preconnect"');
      expect(layoutContent).toContain('https://fonts.googleapis.com');
      expect(layoutContent).toContain('https://fonts.gstatic.com');
    });

    // 测试 preconnect 包含 crossOrigin 属性
    it('should have crossOrigin attribute on preconnect links', () => {
      expect(layoutContent).toContain('crossOrigin="anonymous"');
    });

    // 测试不应该有错误的 globals.css preload 链接
    it('should not have incorrect preload link for /globals.css', () => {
      expect(layoutContent).not.toContain('href="/globals.css"');
      expect(layoutContent).not.toContain('<link rel="preload" as="style" href="/globals.css"');
    });

    // 测试分析服务的 dns-prefetch
    it('should have dns-prefetch for analytics services', () => {
      // Google Analytics
      expect(layoutContent).toContain('google-analytics.com');
      // 百度统计
      expect(layoutContent).toContain('hm.baidu.com');
    });
  });

  describe('Security Headers', () => {
    // 测试安全相关的 meta 标签
    it('should have security-related meta tags', () => {
      expect(layoutContent).toContain('X-Content-Type-Options');
      expect(layoutContent).toContain('X-Frame-Options');
      expect(layoutContent).toContain('X-XSS-Protection');
    });
  });

  describe('Mobile Optimization', () => {
    // 测试移动端优化标签
    it('should have mobile optimization meta tags', () => {
      expect(layoutContent).toContain('apple-mobile-web-app-capable');
      expect(layoutContent).toContain('mobile-web-app-capable');
    });

    // 测试 Apple 启动画面
    it('should have Apple splash screen links', () => {
      expect(layoutContent).toContain('apple-touch-startup-image');
    });
  });
});
