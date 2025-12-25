import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing, locales, countryToLocale, type Locale } from './i18n/routing';

// 语言偏好Cookie名称
const LOCALE_COOKIE = 'NEXT_LOCALE';

// 搜索引擎爬虫 User-Agent 正则表达式
// 包含百度、Google、Bing、Yandex 等主流搜索引擎爬虫
const SEARCH_ENGINE_BOTS = /Baiduspider|Googlebot|bingbot|Slurp|DuckDuckBot|YandexBot|Sogou|360Spider|Bytespider/i;

// 创建 next-intl middleware
const handleI18nRouting = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  
  // 检测是否为搜索引擎爬虫
  const isSearchEngineBot = SEARCH_ENGINE_BOTS.test(userAgent);
  
  // 跳过搜索引擎验证文件（百度、Google等）- 直接放行，不做任何处理
  if (pathname.includes('baidu_verify') || 
      pathname.includes('google') || 
      pathname.endsWith('.html') ||
      pathname.endsWith('.txt')) {
    return NextResponse.next();
  }
  
  // 对搜索引擎爬虫访问根路径时，使用 rewrite 而非 redirect
  // 这样爬虫可以看到页面内容（包括 meta 验证标签），而不会收到 307 重定向
  if (isSearchEngineBot && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/zh'; // 默认 rewrite 到中文版本（百度主要面向中文用户）
    return NextResponse.rewrite(url);
  }
  
  // 获取用户保存的语言偏好（从cookie）
  const savedLocale = request.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined;
  
  // 检查是否已有语言前缀
  const hasLocalePrefix = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  // 如果没有语言前缀，需要检测并重定向
  if (!hasLocalePrefix) {
    let detectedLocale: Locale = 'en';
    
    // 优先级1: 用户保存的语言偏好
    if (savedLocale && locales.includes(savedLocale)) {
      detectedLocale = savedLocale;
    } else {
      // 优先级2: 基于IP地理位置检测（通过Vercel/Cloudflare headers）
      const country = request.headers.get('x-vercel-ip-country') || 
                      request.headers.get('cf-ipcountry');
      
      if (country && countryToLocale[country]) {
        detectedLocale = countryToLocale[country];
      } else {
        // 优先级3: 浏览器Accept-Language header
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
              detectedLocale = locale as Locale;
              break;
            }
          }
        }
      }
    }
    
    // 重定向到检测到的语言
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/' 
      ? `/${detectedLocale}` 
      : `/${detectedLocale}${pathname}`;
    
    const response = NextResponse.redirect(url);
    
    // 设置语言偏好cookie
    if (!savedLocale) {
      response.cookies.set(LOCALE_COOKIE, detectedLocale, {
        maxAge: 60 * 60 * 24 * 365, // 1年
        path: '/',
        sameSite: 'lax',
      });
    }
    
    return response;
  }
  
  // 提取当前URL中的语言
  const currentLocale = pathname.split('/')[1] as Locale;
  
  // 调用 next-intl middleware 处理
  const response = handleI18nRouting(request);
  
  // 更新cookie为当前语言（用户通过URL切换语言时）
  if (locales.includes(currentLocale) && currentLocale !== savedLocale) {
    response.cookies.set(LOCALE_COOKIE, currentLocale, {
      maxAge: 60 * 60 * 24 * 365, // 1年
      path: '/',
      sameSite: 'lax',
    });
  }
  
  return response;
}

export const config = {
  // 匹配所有路径，排除静态文件、API和验证文件
  matcher: [
    // 匹配所有路径，但排除以下内容：
    // - api 路由
    // - _next 静态文件
    // - _vercel 内部路由
    // - 带扩展名的文件（.html, .txt, .xml, .ico 等）
    '/((?!api|_next|_vercel|.*\\..*|baidu_verify.*|google.*).*)',
  ],
};
