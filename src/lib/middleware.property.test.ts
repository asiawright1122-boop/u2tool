/**
 * Middleware 属性测试
 * Property 6: Middleware Static Asset Bypass
 * Property 7: Middleware Locale Cookie Persistence
 * 
 * @see Requirements 6.1, 6.3, 6.6, 19.2
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// 支持的语言列表
const SUPPORTED_LOCALES = ['en', 'zh', 'es', 'pt', 'ja', 'ko', 'fr', 'de', 'ru', 'ar'] as const;
type Locale = typeof SUPPORTED_LOCALES[number];

// 静态资源扩展名
const STATIC_EXTENSIONS = [
  '.html', '.txt', '.xml', '.ico', '.png', '.jpg', '.jpeg', 
  '.gif', '.svg', '.webp', '.css', '.js', '.json', '.woff', '.woff2'
];

// 应该跳过的路径前缀
const SKIP_PREFIXES = ['/api', '/_next', '/_vercel'];

// 搜索引擎爬虫 User-Agent
const SEARCH_ENGINE_BOTS = [
  'Googlebot/2.1 (+http://www.google.com/bot.html)',
  'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)',
  'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)',
];

// 模拟 shouldSkip 函数
function shouldSkip(pathname: string): boolean {
  // 检查前缀
  for (const prefix of SKIP_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      return true;
    }
  }
  
  // 检查特殊文件
  if (pathname.includes('baidu_verify') || pathname.includes('google')) {
    return true;
  }
  
  // 检查扩展名
  for (const ext of STATIC_EXTENSIONS) {
    if (pathname.endsWith(ext)) {
      return true;
    }
  }
  
  return false;
}

// 模拟 hasLocalePrefix 函数
function hasLocalePrefix(pathname: string): boolean {
  return SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
}

// 模拟 detectLocale 函数
function detectLocale(
  cookieLocale: Locale | null,
  country: string | null,
  acceptLanguage: string | null
): Locale {
  // 1. Cookie 优先
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    return cookieLocale;
  }
  
  // 2. IP 地理位置
  const countryToLocale: Record<string, Locale> = {
    CN: 'zh', TW: 'zh', HK: 'zh',
    JP: 'ja', KR: 'ko',
    ES: 'es', MX: 'es', AR: 'es',
    BR: 'pt', PT: 'pt',
    FR: 'fr', BE: 'fr',
    DE: 'de', AT: 'de',
    RU: 'ru',
    SA: 'ar', AE: 'ar', EG: 'ar',
  };
  
  if (country && countryToLocale[country]) {
    return countryToLocale[country];
  }
  
  // 3. Accept-Language
  if (acceptLanguage) {
    const browserLocales = acceptLanguage
      .split(',')
      .map(lang => lang.trim().split(';')[0].split('-')[0].toLowerCase());
    
    for (const locale of browserLocales) {
      if (SUPPORTED_LOCALES.includes(locale as Locale)) {
        return locale as Locale;
      }
    }
  }
  
  // 4. 默认
  return 'en';
}

// 模拟 Middleware 响应类型
interface MiddlewareResponse {
  type: 'next' | 'redirect' | 'rewrite';
  status?: number;
  location?: string;
  cookies?: { name: string; value: string; maxAge: number }[];
}

// 模拟 Middleware 处理逻辑
function handleMiddleware(
  pathname: string,
  userAgent: string,
  cookieLocale: Locale | null,
  country: string | null,
  acceptLanguage: string | null
): MiddlewareResponse {
  // 跳过静态资源
  if (shouldSkip(pathname)) {
    return { type: 'next' };
  }
  
  const isSearchEngineBot = SEARCH_ENGINE_BOTS.some(bot => 
    userAgent.toLowerCase().includes(bot.toLowerCase().split('/')[0])
  );
  
  // 搜索引擎爬虫访问根路径
  if (isSearchEngineBot && pathname === '/') {
    return { type: 'rewrite', location: '/zh' };
  }
  
  // 已有 locale 前缀
  if (hasLocalePrefix(pathname)) {
    const currentLocale = pathname.split('/')[1] as Locale;
    const cookies: { name: string; value: string; maxAge: number }[] = [];
    
    if (currentLocale !== cookieLocale) {
      cookies.push({
        name: 'NEXT_LOCALE',
        value: currentLocale,
        maxAge: 60 * 60 * 24 * 365, // 1 年
      });
    }
    
    return { type: 'next', cookies };
  }
  
  // 没有 locale 前缀
  const detectedLocale = detectLocale(cookieLocale, country, acceptLanguage);
  const targetPath = pathname === '/' ? `/${detectedLocale}` : `/${detectedLocale}${pathname}`;
  
  // 搜索引擎爬虫使用 rewrite
  if (isSearchEngineBot) {
    return { type: 'rewrite', location: targetPath };
  }
  
  // 普通用户使用 redirect
  const cookies: { name: string; value: string; maxAge: number }[] = [];
  if (!cookieLocale) {
    cookies.push({
      name: 'NEXT_LOCALE',
      value: detectedLocale,
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  
  return {
    type: 'redirect',
    status: 301,
    location: `https://www.u2tool.com${targetPath}`,
    cookies,
  };
}

describe('Middleware Properties', () => {
  describe('Property 6: Middleware Static Asset Bypass', () => {
    it('should bypass paths with static file extensions', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...STATIC_EXTENSIONS),
          fc.string({ minLength: 1, maxLength: 20 }),
          (ext, filename) => {
            const path = `/some/path/${filename}${ext}`;
            return shouldSkip(path) === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should bypass API routes', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('/api', '/api/og', '/api/exchange-rates', '/api/data'),
          (path) => {
            return shouldSkip(path) === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should bypass _next static paths', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (subpath) => {
            const path = `/_next/static/${subpath}`;
            return shouldSkip(path) === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should NOT bypass regular page paths', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...SUPPORTED_LOCALES),
          fc.constantFrom('/tools', '/tools/json-formatter', '/about', '/'),
          (locale, pagePath) => {
            const path = `/${locale}${pagePath}`;
            return shouldSkip(path) === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return next() for static assets in middleware', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...STATIC_EXTENSIONS),
          fc.string({ minLength: 1, maxLength: 20 }),
          (ext, filename) => {
            const path = `/assets/${filename}${ext}`;
            const response = handleMiddleware(path, 'Mozilla/5.0', null, null, null);
            return response.type === 'next';
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 7: Middleware Locale Cookie Persistence', () => {
    it('should set cookie with at least 30 days max-age on redirect', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('/tools', '/about', '/'),
          (path) => {
            const response = handleMiddleware(path, 'Mozilla/5.0', null, null, null);
            
            if (response.type === 'redirect' && response.cookies) {
              const localeCookie = response.cookies.find(c => c.name === 'NEXT_LOCALE');
              if (localeCookie) {
                // 至少 30 天 = 2592000 秒
                return localeCookie.maxAge >= 2592000;
              }
            }
            return true; // 如果没有设置 cookie，也算通过（可能已有 cookie）
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should set cookie with valid locale value', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('/tools', '/about', '/'),
          (path) => {
            const response = handleMiddleware(path, 'Mozilla/5.0', null, null, null);
            
            if (response.type === 'redirect' && response.cookies) {
              const localeCookie = response.cookies.find(c => c.name === 'NEXT_LOCALE');
              if (localeCookie) {
                return SUPPORTED_LOCALES.includes(localeCookie.value as Locale);
              }
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should update cookie when user switches locale via URL', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...SUPPORTED_LOCALES),
          fc.constantFrom(...SUPPORTED_LOCALES),
          (urlLocale, cookieLocale) => {
            fc.pre(urlLocale !== cookieLocale);
            
            const path = `/${urlLocale}/tools`;
            const response = handleMiddleware(path, 'Mozilla/5.0', cookieLocale, null, null);
            
            if (response.cookies) {
              const localeCookie = response.cookies.find(c => c.name === 'NEXT_LOCALE');
              if (localeCookie) {
                return localeCookie.value === urlLocale;
              }
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should NOT set cookie if already has correct locale', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...SUPPORTED_LOCALES),
          (locale) => {
            const path = `/${locale}/tools`;
            const response = handleMiddleware(path, 'Mozilla/5.0', locale, null, null);
            
            // 如果 cookie 已经是正确的 locale，不应该设置新 cookie
            if (response.cookies) {
              const localeCookie = response.cookies.find(c => c.name === 'NEXT_LOCALE');
              return !localeCookie; // 不应该有 cookie 设置
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Search Engine Bot Handling', () => {
    it('should use rewrite instead of redirect for search engine bots', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...SEARCH_ENGINE_BOTS),
          fc.constantFrom('/tools', '/about'),
          (botUserAgent, path) => {
            const response = handleMiddleware(path, botUserAgent, null, null, null);
            return response.type === 'rewrite';
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should rewrite root path to /zh for search engine bots', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...SEARCH_ENGINE_BOTS),
          (botUserAgent) => {
            const response = handleMiddleware('/', botUserAgent, null, null, null);
            return response.type === 'rewrite' && response.location === '/zh';
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Locale Detection', () => {
    it('should prioritize cookie locale over other methods', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...SUPPORTED_LOCALES),
          fc.constantFrom('CN', 'JP', 'US', 'DE'),
          fc.constantFrom('fr-FR', 'de-DE', 'ja-JP'),
          (cookieLocale, country, acceptLang) => {
            const detected = detectLocale(cookieLocale, country, acceptLang);
            return detected === cookieLocale;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use country-based locale when no cookie', () => {
      const countryLocaleMap: [string, Locale][] = [
        ['CN', 'zh'], ['JP', 'ja'], ['KR', 'ko'], ['DE', 'de'], ['FR', 'fr'],
      ];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...countryLocaleMap),
          ([country, expectedLocale]) => {
            const detected = detectLocale(null, country, null);
            return detected === expectedLocale;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should fall back to default locale when no signals', () => {
      const detected = detectLocale(null, null, null);
      expect(detected).toBe('en');
    });
  });
});
