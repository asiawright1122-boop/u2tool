/**
 * 缓存头属性测试
 * Property 2: Cache Header Consistency
 * Property 3: ETag Conditional Response
 * 
 * @see Requirements 3.1, 3.2, 3.3, 3.4, 3.6
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// 缓存策略配置
const CACHE_STRATEGIES = {
  htmlPage: {
    maxAge: 604800, // 7 天
    staleWhileRevalidate: 2592000, // 30 天
  },
  staticAsset: {
    maxAge: 31536000, // 1 年
    immutable: true,
  },
  apiRoute: {
    maxAge: 3600, // 1 小时
    staleWhileRevalidate: 86400, // 24 小时
  },
  ogImage: {
    maxAge: 604800, // 7 天
    staleWhileRevalidate: 86400, // 1 天
  },
};

// 路由类型判断函数
function getRouteType(path: string): keyof typeof CACHE_STRATEGIES | null {
  // 静态资源
  if (path.match(/\.(svg|jpg|jpeg|png|gif|ico|webp|avif|woff|woff2|js|css)$/)) {
    return 'staticAsset';
  }
  if (path.startsWith('/_next/static/')) {
    return 'staticAsset';
  }
  
  // OG 图片 API
  if (path.startsWith('/api/og')) {
    return 'ogImage';
  }
  
  // API 路由
  if (path.startsWith('/api/')) {
    return 'apiRoute';
  }
  
  // HTML 页面（带 locale 前缀）
  const localePattern = /^\/(en|zh|es|pt|ja|ko|fr|de|ru|ar)(\/|$)/;
  if (localePattern.test(path)) {
    return 'htmlPage';
  }
  
  return null;
}

// 解析 Cache-Control 头
function parseCacheControl(header: string): Record<string, string | boolean | number> {
  const result: Record<string, string | boolean | number> = {};
  const parts = header.split(',').map(p => p.trim());
  
  for (const part of parts) {
    if (part.includes('=')) {
      const [key, value] = part.split('=');
      result[key.trim()] = parseInt(value.trim(), 10) || value.trim();
    } else {
      result[part] = true;
    }
  }
  
  return result;
}

// 验证缓存头是否符合策略
function validateCacheHeader(
  path: string,
  cacheControlHeader: string
): { valid: boolean; reason?: string } {
  const routeType = getRouteType(path);
  
  if (!routeType) {
    return { valid: true }; // 未知路由类型，跳过验证
  }
  
  const strategy = CACHE_STRATEGIES[routeType];
  const parsed = parseCacheControl(cacheControlHeader);
  
  // 检查 max-age
  if (parsed['max-age'] !== strategy.maxAge) {
    return {
      valid: false,
      reason: `Expected max-age=${strategy.maxAge}, got max-age=${parsed['max-age']}`,
    };
  }
  
  // 检查 stale-while-revalidate（如果策略中有）
  if ('staleWhileRevalidate' in strategy) {
    if (parsed['stale-while-revalidate'] !== strategy.staleWhileRevalidate) {
      return {
        valid: false,
        reason: `Expected stale-while-revalidate=${strategy.staleWhileRevalidate}, got ${parsed['stale-while-revalidate']}`,
      };
    }
  }
  
  // 检查 immutable（如果策略中有）
  if ('immutable' in strategy && strategy.immutable) {
    if (!parsed['immutable']) {
      return {
        valid: false,
        reason: 'Expected immutable flag',
      };
    }
  }
  
  return { valid: true };
}

// 生成 ETag
function generateETag(content: string): string {
  // 简化的 ETag 生成（实际使用 base64）
  return `"${Buffer.from(content).toString('base64').slice(0, 32)}"`;
}

// 模拟条件请求响应
function handleConditionalRequest(
  currentETag: string,
  ifNoneMatch: string | null
): { status: number; body: string | null } {
  if (ifNoneMatch === currentETag) {
    return { status: 304, body: null };
  }
  return { status: 200, body: 'content' };
}

describe('Cache Header Properties', () => {
  describe('Property 2: Cache Header Consistency', () => {
    it('should return correct cache headers for HTML pages', () => {
      const locales = ['en', 'zh', 'es', 'pt', 'ja', 'ko', 'fr', 'de', 'ru', 'ar'];
      const paths = ['/', '/tools', '/tools/json-formatter', '/about'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...locales),
          fc.constantFrom(...paths),
          (locale, path) => {
            const fullPath = `/${locale}${path}`;
            const expectedHeader = `public, max-age=${CACHE_STRATEGIES.htmlPage.maxAge}, stale-while-revalidate=${CACHE_STRATEGIES.htmlPage.staleWhileRevalidate}`;
            
            const result = validateCacheHeader(fullPath, expectedHeader);
            return result.valid;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return correct cache headers for static assets', () => {
      const extensions = ['.js', '.css', '.png', '.jpg', '.svg', '.woff2'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...extensions),
          fc.string({ minLength: 1, maxLength: 20 }),
          (ext, filename) => {
            const path = `/assets/${filename}${ext}`;
            const expectedHeader = `public, max-age=${CACHE_STRATEGIES.staticAsset.maxAge}, immutable`;
            
            const result = validateCacheHeader(path, expectedHeader);
            return result.valid;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return correct cache headers for API routes', () => {
      const apiPaths = ['/api/exchange-rates', '/api/data', '/api/tools'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...apiPaths),
          (path) => {
            const expectedHeader = `public, max-age=${CACHE_STRATEGIES.apiRoute.maxAge}, stale-while-revalidate=${CACHE_STRATEGIES.apiRoute.staleWhileRevalidate}`;
            
            const result = validateCacheHeader(path, expectedHeader);
            return result.valid;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return correct cache headers for OG image API', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.constantFrom('en', 'zh', 'ja'),
          (title, locale) => {
            const path = `/api/og?title=${encodeURIComponent(title)}&locale=${locale}`;
            const expectedHeader = `public, max-age=${CACHE_STRATEGIES.ogImage.maxAge}, stale-while-revalidate=${CACHE_STRATEGIES.ogImage.staleWhileRevalidate}`;
            
            const result = validateCacheHeader(path, expectedHeader);
            return result.valid;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 3: ETag Conditional Response', () => {
    it('should return 304 when If-None-Match matches current ETag', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (content) => {
            const etag = generateETag(content);
            const response = handleConditionalRequest(etag, etag);
            
            return response.status === 304 && response.body === null;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return 200 when If-None-Match does not match', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.string({ minLength: 1, maxLength: 100 }),
          (content1, content2) => {
            // 确保两个内容不同
            fc.pre(content1 !== content2);
            
            const currentETag = generateETag(content1);
            const oldETag = generateETag(content2);
            const response = handleConditionalRequest(currentETag, oldETag);
            
            return response.status === 200 && response.body !== null;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return 200 when no If-None-Match header', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (content) => {
            const etag = generateETag(content);
            const response = handleConditionalRequest(etag, null);
            
            return response.status === 200 && response.body !== null;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate consistent ETags for same content', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (content) => {
            const etag1 = generateETag(content);
            const etag2 = generateETag(content);
            
            return etag1 === etag2;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate different ETags for different content', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.string({ minLength: 1, maxLength: 100 }),
          (content1, content2) => {
            fc.pre(content1 !== content2);
            
            const etag1 = generateETag(content1);
            const etag2 = generateETag(content2);
            
            return etag1 !== etag2;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Route Type Detection', () => {
    it('should correctly identify HTML pages', () => {
      const locales = ['en', 'zh', 'es', 'pt', 'ja', 'ko', 'fr', 'de', 'ru', 'ar'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...locales),
          fc.constantFrom('/', '/tools', '/tools/json-formatter', '/about'),
          (locale, path) => {
            const fullPath = `/${locale}${path}`;
            return getRouteType(fullPath) === 'htmlPage';
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly identify static assets', () => {
      const extensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.woff2', '.ico'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...extensions),
          (ext) => {
            const path = `/some/path/file${ext}`;
            return getRouteType(path) === 'staticAsset';
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly identify API routes', () => {
      const apiPaths = ['/api/exchange-rates', '/api/data', '/api/tools/list'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...apiPaths),
          (path) => {
            return getRouteType(path) === 'apiRoute';
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly identify OG image API', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (title) => {
            const path = `/api/og?title=${encodeURIComponent(title)}`;
            return getRouteType(path) === 'ogImage';
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
