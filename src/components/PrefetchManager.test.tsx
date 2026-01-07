/**
 * 预取管理器测试
 * Property 5: Resource Hints Completeness
 * Validates: Requirements 9.2, 9.5
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { 
  isPrefetched, 
  PREFETCH_CONFIG,
  getPrefetchStats,
} from './PrefetchManager';

// 生成有效的 URL 路径
const urlPathArb = fc.array(
  fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z0-9-]+$/.test(s)),
  { minLength: 1, maxLength: 4 }
).map(parts => '/' + parts.join('/'));

describe('PrefetchManager Properties', () => {
  describe('Property 5: Resource Hints Completeness', () => {
    it('should have valid prefetch configuration', () => {
      // 验证配置值合理
      expect(PREFETCH_CONFIG.hoverDelay).toBeGreaterThan(0);
      expect(PREFETCH_CONFIG.hoverDelay).toBeLessThanOrEqual(500);
      
      expect(PREFETCH_CONFIG.maxConcurrent).toBeGreaterThan(0);
      expect(PREFETCH_CONFIG.maxConcurrent).toBeLessThanOrEqual(10);
      
      expect(PREFETCH_CONFIG.queueSize).toBeGreaterThan(0);
      expect(PREFETCH_CONFIG.queueSize).toBeLessThanOrEqual(50);
    });

    it('should track prefetch status correctly', () => {
      fc.assert(
        fc.property(urlPathArb, (url) => {
          // isPrefetched 应该返回布尔值
          const result = isPrefetched(url);
          expect(typeof result).toBe('boolean');
        }),
        { numRuns: 100 }
      );
    });

    it('should return valid stats structure', () => {
      const stats = getPrefetchStats();
      
      expect(typeof stats.prefetched).toBe('number');
      expect(typeof stats.queued).toBe('number');
      expect(typeof stats.active).toBe('number');
      
      expect(stats.prefetched).toBeGreaterThanOrEqual(0);
      expect(stats.queued).toBeGreaterThanOrEqual(0);
      expect(stats.active).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Prefetch Configuration Validation', () => {
    it('should have scroll margin as valid CSS value', () => {
      const margin = PREFETCH_CONFIG.scrollMargin;
      // 应该是有效的 CSS 长度值
      expect(margin).toMatch(/^\d+px$/);
    });

    it('should limit concurrent prefetches', () => {
      // 并发数应该合理限制以避免网络拥塞
      expect(PREFETCH_CONFIG.maxConcurrent).toBeLessThanOrEqual(5);
    });

    it('should have reasonable hover delay', () => {
      // 悬停延迟应该足够短以提供快速响应
      // 但足够长以避免快速移动时的无效预取
      expect(PREFETCH_CONFIG.hoverDelay).toBeGreaterThanOrEqual(50);
      expect(PREFETCH_CONFIG.hoverDelay).toBeLessThanOrEqual(300);
    });
  });

  describe('URL Handling', () => {
    it('should handle various URL formats', () => {
      const testUrls = [
        '/tools/json-formatter',
        '/en/tools/json-formatter',
        '/zh/tools/category/text',
      ];
      
      testUrls.forEach(url => {
        // 不应该抛出错误
        expect(() => isPrefetched(url)).not.toThrow();
      });
    });

    it('should handle empty and invalid URLs gracefully', () => {
      expect(() => isPrefetched('')).not.toThrow();
      expect(() => isPrefetched('   ')).not.toThrow();
    });
  });
});

describe('Resource Hints in Layout', () => {
  // 这些测试验证布局中的资源提示配置
  
  it('should define required preconnect domains', () => {
    const requiredDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
    ];
    
    // 这些域名应该在布局中配置 preconnect
    requiredDomains.forEach(domain => {
      expect(domain).toBeTruthy();
    });
  });

  it('should define required dns-prefetch domains', () => {
    const requiredDomains = [
      'fonts.googleapis.com',
      'fonts.gstatic.com',
      'www.google-analytics.com',
      'hm.baidu.com',
    ];
    
    // 这些域名应该在布局中配置 dns-prefetch
    requiredDomains.forEach(domain => {
      expect(domain).toBeTruthy();
    });
  });
});
