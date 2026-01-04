/**
 * 轻量级 Middleware
 * 
 * 此 middleware 不导入任何翻译文件或 next-intl 模块，
 * 以避免翻译文件被打包到 Edge Function 中。
 * 
 * 功能：
 * - Locale 检测（Cookie、IP、Accept-Language）
 * - 重定向到带 locale 前缀的 URL
 * - 搜索引擎爬虫特殊处理
 * 
 * @see Requirements 1.1, 1.2, 1.4, 3.1, 3.2
 */

import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// 硬编码配置 - 避免导入任何模块
// ============================================================================

// 支持的语言列表
const locales = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'] as const;
type Locale = typeof locales[number];

// 默认语言
const DEFAULT_LOCALE: Locale = 'en';

// 语言偏好 Cookie 名称
const LOCALE_COOKIE = 'NEXT_LOCALE';

// 国家到语言的映射（基于 IP 地理位置）
const countryToLocale: Record<string, Locale> = {
  // 中文地区
  CN: 'zh', TW: 'zh', HK: 'zh', MO: 'zh',
  
  // 西班牙语地区
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es',
  EC: 'es', GT: 'es', CU: 'es', BO: 'es', DO: 'es', HN: 'es', PY: 'es',
  SV: 'es', NI: 'es', CR: 'es', PA: 'es', UY: 'es', PR: 'es', GQ: 'es',
  
  // 葡萄牙语地区
  BR: 'pt', PT: 'pt', AO: 'pt', MZ: 'pt', CV: 'pt', GW: 'pt', ST: 'pt', TL: 'pt',
  
  // 日语地区
  JP: 'ja',
  
  // 俄语地区
  RU: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru', TJ: 'ru', UZ: 'ru', TM: 'ru',
  AM: 'ru', AZ: 'ru', GE: 'ru', MD: 'ru',
  
  // 法语地区
  FR: 'fr', BE: 'fr', LU: 'fr', MC: 'fr', SN: 'fr', CI: 'fr', ML: 'fr',
  BF: 'fr', NE: 'fr', TD: 'fr', GA: 'fr', CG: 'fr', CD: 'fr', CM: 'fr',
  BJ: 'fr', TG: 'fr', RW: 'fr', BI: 'fr', DJ: 'fr', KM: 'fr', MG: 'fr',
  SC: 'fr', MU: 'fr', VU: 'fr', PF: 'fr', NC: 'fr',
  
  // 阿拉伯语地区
  SA: 'ar', AE: 'ar', EG: 'ar', MA: 'ar', DZ: 'ar', IQ: 'ar', SD: 'ar',
  SY: 'ar', TN: 'ar', JO: 'ar', LY: 'ar', LB: 'ar', PS: 'ar', OM: 'ar',
  KW: 'ar', MR: 'ar', QA: 'ar', BH: 'ar', YE: 'ar', SO: 'ar',
  
  // 德语地区
  DE: 'de', AT: 'de', CH: 'de', LI: 'de',
  
  // 韩语地区
  KR: 'ko', KP: 'ko',
};

// 搜索引擎爬虫 User-Agent 正则表达式
const SEARCH_ENGINE_BOTS = /Baiduspider|Googlebot|bingbot|Slurp|DuckDuckBot|YandexBot|Sogou|360Spider|Bytespider/i;

// ============================================================================
// 辅助函数
// ============================================================================

/**
 * 检查是否应该跳过此路径
 */
function shouldSkip(pathname: string): boolean {
  return (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('baidu_verify') ||
    pathname.includes('google') ||
    pathname.endsWith('.html') ||
    pathname.endsWith('.txt') ||
    pathname.endsWith('.xml') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.gif') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.json') ||
    pathname.endsWith('.woff') ||
    pathname.endsWith('.woff2')
  );
}

/**
 * 检测用户的 locale
 * 优先级：Cookie > IP 地理位置 > Accept-Language > 默认
 */
function detectLocale(request: NextRequest): Locale {
  // 1. 从 Cookie 获取
  const savedLocale = request.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined;
  if (savedLocale && locales.includes(savedLocale)) {
    return savedLocale;
  }
  
  // 2. 从 IP 地理位置获取
  const country = request.headers.get('x-vercel-ip-country') || 
                  request.headers.get('cf-ipcountry');
  if (country && countryToLocale[country]) {
    return countryToLocale[country];
  }
  
  // 3. 从 Accept-Language header 获取
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    // 解析 Accept-Language header
    const browserLocales = acceptLanguage
      .split(',')
      .map(lang => {
        const [locale, q = '1'] = lang.trim().split(';q=');
        return { locale: locale.split('-')[0].toLowerCase(), q: parseFloat(q) };
      })
      .sort((a, b) => b.q - a.q);
    
    // 找到第一个匹配的语言
    for (const { locale } of browserLocales) {
      if (locales.includes(locale as Locale)) {
        return locale as Locale;
      }
    }
  }
  
  // 4. 返回默认语言
  return DEFAULT_LOCALE;
}

/**
 * 检查路径是否已有 locale 前缀
 */
function hasLocalePrefix(pathname: string): boolean {
  return locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
}

/**
 * 从路径中提取 locale
 */
function extractLocale(pathname: string): Locale | null {
  const segment = pathname.split('/')[1];
  if (locales.includes(segment as Locale)) {
    return segment as Locale;
  }
  return null;
}

// ============================================================================
// Middleware 主函数
// ============================================================================

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  
  // 跳过静态文件和特殊路径
  if (shouldSkip(pathname)) {
    return NextResponse.next();
  }
  
  // 检测是否为搜索引擎爬虫
  const isSearchEngineBot = SEARCH_ENGINE_BOTS.test(userAgent);
  
  // 对搜索引擎爬虫访问根路径时，使用 rewrite 而非 redirect
  // 这样爬虫可以看到页面内容（包括 meta 验证标签），而不会收到 307 重定向
  if (isSearchEngineBot && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/zh'; // 默认 rewrite 到中文版本（百度主要面向中文用户）
    return NextResponse.rewrite(url);
  }
  
  // 检查是否已有 locale 前缀
  if (hasLocalePrefix(pathname)) {
    // 已有 locale 前缀，更新 cookie 并继续
    const currentLocale = extractLocale(pathname);
    const savedLocale = request.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined;
    
    const response = NextResponse.next();
    
    // 更新 cookie 为当前语言（用户通过 URL 切换语言时）
    if (currentLocale && currentLocale !== savedLocale) {
      response.cookies.set(LOCALE_COOKIE, currentLocale, {
        maxAge: 60 * 60 * 24 * 365, // 1年
        path: '/',
        sameSite: 'lax',
      });
    }
    
    return response;
  }
  
  // 没有 locale 前缀，检测并重定向
  const detectedLocale = detectLocale(request);
  const savedLocale = request.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined;
  
  // 构建重定向 URL
  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' 
    ? `/${detectedLocale}` 
    : `/${detectedLocale}${pathname}`;
  
  const response = NextResponse.redirect(url);
  
  // 设置语言偏好 cookie
  if (!savedLocale) {
    response.cookies.set(LOCALE_COOKIE, detectedLocale, {
      maxAge: 60 * 60 * 24 * 365, // 1年
      path: '/',
      sameSite: 'lax',
    });
  }
  
  return response;
}

// ============================================================================
// Middleware 配置
// ============================================================================

export const config = {
  // 匹配所有路径，排除静态文件、API 和验证文件
  matcher: [
    // 匹配所有路径，但排除以下内容：
    // - api 路由
    // - _next 静态文件
    // - _vercel 内部路由
    // - 带扩展名的文件（.html, .txt, .xml, .ico 等）
    '/((?!api|_next|_vercel|.*\\..*|baidu_verify.*|google.*).*)',
  ],
};
