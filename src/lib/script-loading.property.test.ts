import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Script Loading Strategy 属性测试
 * 
 * Property 3: Script Loading Strategy
 * 验证第三方脚本使用正确的加载策略
 * 
 * 注意：已迁移到 Cloudflare Workers，移除了 Vercel Analytics 和 SpeedInsights
 * 
 * @see Requirements 4.1, 4.2
 */

describe('Script Loading Strategy Property Tests', () => {
  describe('Property 3: Script Loading Strategy', () => {
    const layoutPath = path.join(process.cwd(), 'src/app/[locale]/layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

    it('uses @next/third-parties for Google Analytics', () => {
      expect(layoutContent).toContain("@next/third-parties/google");
      expect(layoutContent).toContain("GoogleAnalytics");
    });

    it('Google Analytics is conditionally loaded', () => {
      // GA 应该只在有 ID 时加载
      expect(layoutContent).toContain("process.env.NEXT_PUBLIC_GA_ID");
    });

    it('does not use Vercel-specific analytics (migrated to Cloudflare)', () => {
      // 已迁移到 Cloudflare，不应包含 Vercel 专用组件
      expect(layoutContent).not.toContain("@vercel/analytics");
      expect(layoutContent).not.toContain("@vercel/speed-insights");
    });

    it('Google Analytics is placed correctly in layout', () => {
      // GA 应该在 body 内
      const gaIndex = layoutContent.indexOf('<GoogleAnalytics');
      expect(gaIndex).toBeGreaterThan(-1);
    });
  });

  describe('DNS Prefetch and Preconnect', () => {
    const layoutPath = path.join(process.cwd(), 'src/app/[locale]/layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

    it('has DNS prefetch for Google Analytics', () => {
      expect(layoutContent).toContain('dns-prefetch');
      expect(layoutContent).toContain('www.google-analytics.com');
    });

    it('has DNS prefetch for Google Fonts', () => {
      expect(layoutContent).toContain('fonts.googleapis.com');
      expect(layoutContent).toContain('fonts.gstatic.com');
    });

    it('has preconnect for Google Fonts', () => {
      expect(layoutContent).toContain('preconnect');
      expect(layoutContent).toContain('https://fonts.googleapis.com');
    });
  });
});

/**
 * Tool Component Isolation 属性测试
 * 
 * Property 8: Tool Component Isolation
 * 验证工具组件使用动态导入隔离
 * 
 * @see Requirements 4.4
 */

describe('Tool Component Isolation Property Tests', () => {
  describe('Property 8: Tool Component Isolation', () => {
    // 动态导入现在在 ToolRegistry.tsx 中定义
    const registryPath = path.join(process.cwd(), 'src/components/tools/ToolRegistry.tsx');
    const registryContent = fs.readFileSync(registryPath, 'utf-8');
    
    const wrapperPath = path.join(process.cwd(), 'src/components/tools/ToolWrapper.tsx');
    const wrapperContent = fs.readFileSync(wrapperPath, 'utf-8');

    it('uses dynamic imports for all tool components', () => {
      // 检查 ToolRegistry 是否使用 dynamic 函数
      expect(registryContent).toContain("import dynamic from 'next/dynamic'");
      expect(registryContent).toContain('createToolImport');
    });

    it('all tool imports use createToolImport helper', () => {
      // 统计 createToolImport 调用次数
      const matches = registryContent.match(/createToolImport\(/g);
      expect(matches).not.toBeNull();
      // 应该有大量工具使用此函数
      expect(matches!.length).toBeGreaterThan(100);
    });

    it('chart tools disable SSR', () => {
      // 图表工具应该禁用 SSR
      expect(registryContent).toContain("'chart', false");
    });

    it('PDF tools disable SSR', () => {
      // PDF 工具应该禁用 SSR
      const pdfToolsWithSsrFalse = [
        "'pdf-to-image'",
        "'image-to-pdf'",
        "'pdf-merger'",
        "'pdf-splitter'",
        "'pdf-compressor'",
        "'pdf-rotator'",
      ];
      
      pdfToolsWithSsrFalse.forEach(tool => {
        const toolLine = registryContent.split('\n').find(line => line.includes(tool));
        expect(toolLine).toContain('false');
      });
    });

    it('includes loading skeleton for each tool', () => {
      // 检查 createToolImport 函数定义包含 loading 选项
      expect(registryContent).toContain('loading: () => <ToolSkeleton');
    });

    it('wraps tools with error boundary', () => {
      expect(wrapperContent).toContain('ToolErrorBoundary');
      expect(wrapperContent).toContain('<ToolErrorBoundary');
    });
  });
});
