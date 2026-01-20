/**
 * LocaleLayout 组件测试
 * 验证 CSS 预加载链接已移除，且保留了必要的性能优化资源
 * 
 * @see Design Property 1: 错误的 CSS 预加载链接已移除
 * @see Design Property 2: 保留必要的性能优化资源
 * @see Requirements 1.1, 1.2, 4.1, 4.2, 4.3
 */

import { describe, it, expect } from 'vitest';

describe('LocaleLayout Component', () => {
  /**
   * Property 1: 错误的 CSS 预加载链接已移除
   * For any 渲染的 LocaleLayout 组件，其输出的 HTML 中不应包含指向 `/globals.css` 的预加载链接标签
   * 
   * Feature: fix-css-404-errors, Property 1: 错误的 CSS 预加载链接已移除
   * Validates: Requirements 1.1, 1.2
   */
  it('should not include preload link for /globals.css', async () => {
    // 读取布局文件内容
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const layoutPath = path.join(process.cwd(), 'src/app/[locale]/layout.tsx');
    const layoutContent = await fs.readFile(layoutPath, 'utf-8');
    
    // 验证不包含错误的预加载链接
    expect(layoutContent).not.toContain('<link rel="preload" as="style" href="/globals.css"');
    expect(layoutContent).not.toContain('href="/globals.css"');
  });

  /**
   * Property 2: 保留必要的性能优化资源
   * For any 渲染的 LocaleLayout 组件，其输出的 HTML 中应包含所有必要的 DNS prefetch、preconnect 和移动端优化标签
   * 
   * Feature: fix-css-404-errors, Property 2: 保留必要的性能优化资源
   * Validates: Requirements 4.1, 4.2, 4.3
   */
  it('should preserve DNS prefetch links', async () => {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const layoutPath = path.join(process.cwd(), 'src/app/[locale]/layout.tsx');
    const layoutContent = await fs.readFile(layoutPath, 'utf-8');
    
    // 验证 DNS prefetch links 存在
    expect(layoutContent).toContain('rel="dns-prefetch" href="//fonts.googleapis.com"');
    expect(layoutContent).toContain('rel="dns-prefetch" href="//fonts.gstatic.com"');
    expect(layoutContent).toContain('rel="dns-prefetch" href="//www.google-analytics.com"');
    expect(layoutContent).toContain('rel="dns-prefetch" href="//hm.baidu.com"');
  });

  it('should preserve preconnect links', async () => {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const layoutPath = path.join(process.cwd(), 'src/app/[locale]/layout.tsx');
    const layoutContent = await fs.readFile(layoutPath, 'utf-8');
    
    // 验证 preconnect links 存在
    expect(layoutContent).toContain('rel="preconnect" href="https://fonts.googleapis.com"');
    expect(layoutContent).toContain('rel="preconnect" href="https://fonts.gstatic.com"');
  });

  it('should preserve Apple startup images', async () => {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const layoutPath = path.join(process.cwd(), 'src/app/[locale]/layout.tsx');
    const layoutContent = await fs.readFile(layoutPath, 'utf-8');
    
    // 验证至少包含一些主要的 Apple 启动画面
    expect(layoutContent).toContain('rel="apple-touch-startup-image"');
    expect(layoutContent).toContain('apple-splash-2048-2732.png');
  });

  it('should have comment explaining Next.js automatic CSS handling', async () => {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const layoutPath = path.join(process.cwd(), 'src/app/[locale]/layout.tsx');
    const layoutContent = await fs.readFile(layoutPath, 'utf-8');
    
    // 验证包含说明注释
    expect(layoutContent).toContain('Next.js 自动处理 CSS 加载');
  });
});
