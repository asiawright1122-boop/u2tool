/**
 * 第三方脚本优化加载测试
 * 
 * 测试目标：
 * 1. 验证脚本延迟加载策略
 * 2. 验证脚本加载失败不阻塞页面
 * 3. 验证百度统计正确配置
 * 
 * @see Requirements 2.2, 5.1, 5.2, 5.3, 5.5
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('ThirdPartyScripts Component', () => {
  const componentPath = path.join(process.cwd(), 'src/components/ThirdPartyScripts.tsx');
  const componentContent = fs.readFileSync(componentPath, 'utf-8');

  describe('Script Loading Strategy', () => {
    /**
     * **Validates: Requirements 5.2, 5.3**
     * 验证脚本使用 requestIdleCallback 延迟加载
     */
    it('should use requestIdleCallback for deferred loading', () => {
      expect(componentContent).toContain('requestIdleCallback');
    });

    /**
     * **Validates: Requirements 2.2**
     * 验证脚本使用 async 属性异步加载
     */
    it('should load scripts with async attribute', () => {
      expect(componentContent).toContain('script.async');
      expect(componentContent).toContain('async: true');
    });

    /**
     * **Validates: Requirements 5.5**
     * 验证脚本加载失败不阻塞页面渲染
     */
    it('should handle script loading errors gracefully', () => {
      expect(componentContent).toContain('onerror');
      expect(componentContent).toContain('resolve()'); // 错误时也 resolve，不 reject
    });

    /**
     * **Validates: Requirements 5.3**
     * 验证使用低优先级加载策略
     */
    it('should use idle callback with timeout for low priority loading', () => {
      expect(componentContent).toContain('timeout');
      expect(componentContent).toContain('scheduleIdleTask');
    });
  });

  describe('Baidu Analytics Integration', () => {
    /**
     * **Validates: Requirements 5.3**
     * 验证百度统计正确初始化
     */
    it('should initialize _hmt global variable', () => {
      expect(componentContent).toContain('_hmt');
      expect(componentContent).toContain('window');
    });

    it('should load Baidu Analytics script from correct URL', () => {
      expect(componentContent).toContain('hm.baidu.com/hm.js');
    });

    it('should conditionally load Baidu Analytics', () => {
      expect(componentContent).toContain('baiduAnalyticsId');
      expect(componentContent).toContain('if (baiduAnalyticsId)');
    });
  });

  describe('Performance Optimization', () => {
    /**
     * **Validates: Requirements 2.2**
     * 验证脚本不阻塞主线程
     */
    it('should wait for page load before loading scripts', () => {
      expect(componentContent).toContain("document.readyState === 'complete'");
      expect(componentContent).toContain("window.addEventListener('load'");
    });

    it('should prevent duplicate script loading', () => {
      expect(componentContent).toContain('loadedRef');
      expect(componentContent).toContain('if (loadedRef.current) return');
    });

    it('should check for existing scripts before adding', () => {
      expect(componentContent).toContain('document.getElementById');
    });
  });

  describe('Error Handling', () => {
    /**
     * **Validates: Requirements 5.5**
     * 验证脚本加载错误被优雅处理
     */
    it('should have try-catch for error handling', () => {
      expect(componentContent).toContain('try {');
      expect(componentContent).toContain('catch');
    });

    it('should log errors in debug mode', () => {
      expect(componentContent).toContain('debug');
      expect(componentContent).toContain('log(');
    });

    it('should provide fallback for requestIdleCallback', () => {
      expect(componentContent).toContain("'requestIdleCallback' in window");
      expect(componentContent).toContain('setTimeout');
    });
  });
});

describe('Layout Integration', () => {
  const layoutPath = path.join(process.cwd(), 'src/app/[locale]/layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

  /**
   * **Validates: Requirements 5.1, 5.2**
   * 验证 Google Analytics 使用 @next/third-parties
   */
  it('should use @next/third-parties for Google Analytics', () => {
    expect(layoutContent).toContain("@next/third-parties/google");
    expect(layoutContent).toContain("GoogleAnalytics");
  });

  /**
   * **Validates: Requirements 5.3**
   * 验证百度统计使用 ThirdPartyScripts 组件
   */
  it('should use ThirdPartyScripts component for Baidu Analytics', () => {
    expect(layoutContent).toContain('ThirdPartyScripts');
    expect(layoutContent).toContain('baiduAnalyticsId');
    expect(layoutContent).toContain('NEXT_PUBLIC_BAIDU_ANALYTICS_ID');
  });

  /**
   * **Validates: Requirements 5.4**
   * 验证使用 DNS 预取资源提示
   */
  it('should have DNS prefetch for third-party domains', () => {
    expect(layoutContent).toContain('dns-prefetch');
    expect(layoutContent).toContain('hm.baidu.com');
    expect(layoutContent).toContain('www.google-analytics.com');
    expect(layoutContent).toContain('www.googletagmanager.com');
  });

  /**
   * **Validates: Requirements 5.5**
   * 验证第三方脚本在 body 之后加载
   */
  it('should load analytics scripts after body content', () => {
    const bodyCloseIndex = layoutContent.indexOf('</body>');
    const gaIndex = layoutContent.indexOf('<GoogleAnalytics');
    const analyticsIndex = layoutContent.indexOf('<Analytics');
    
    expect(gaIndex).toBeGreaterThan(bodyCloseIndex);
    expect(analyticsIndex).toBeGreaterThan(bodyCloseIndex);
  });

  /**
   * **Validates: Requirements 5.1**
   * 验证 Vercel Analytics 正确配置
   */
  it('should use official Vercel Analytics', () => {
    expect(layoutContent).toContain("@vercel/analytics/react");
    expect(layoutContent).toContain("<Analytics");
  });

  /**
   * **Validates: Requirements 5.1**
   * 验证 Vercel Speed Insights 正确配置
   */
  it('should use official Vercel Speed Insights', () => {
    expect(layoutContent).toContain("@vercel/speed-insights/next");
    expect(layoutContent).toContain("<SpeedInsights");
  });
});

describe('Environment Configuration', () => {
  const envExamplePath = path.join(process.cwd(), '.env.example');
  const envContent = fs.readFileSync(envExamplePath, 'utf-8');

  it('should have Baidu Analytics ID configuration', () => {
    expect(envContent).toContain('NEXT_PUBLIC_BAIDU_ANALYTICS_ID');
  });

  it('should have Google Analytics ID configuration', () => {
    expect(envContent).toContain('NEXT_PUBLIC_GA_ID');
  });

  it('should have documentation for Baidu Analytics', () => {
    expect(envContent).toContain('tongji.baidu.com');
  });
});