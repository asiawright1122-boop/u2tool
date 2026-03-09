# 设计文档：Middleware 大小优化

## 概述

本设计文档描述如何解决 Vercel Edge Function 大小超限问题（2.85 MB > 2 MB 限制）。

根本原因分析：
1. `next-intl` 插件配置指向 `src/i18n/request.ts`，该文件导入翻译加载器
2. 翻译加载器使用动态导入 `import(@/messages/${locale}/base.json)`
3. Webpack/Turbopack 将所有可能的动态导入目标打包到 Edge runtime
4. 结果：10 种语言的翻译文件（~12 MB）被打包到 middleware

解决方案：
1. 创建一个轻量级的 middleware，不依赖 `next-intl/middleware`
2. 将翻译加载完全移到页面级别的 Server Components
3. 使用 `NextIntlClientProvider` 在布局层提供翻译

## 架构

```
优化前：
┌─────────────────────────────────────────────────────────────┐
│  Middleware (Edge Runtime) - 2.85 MB                        │
│  ├── next-intl/middleware                                   │
│  ├── i18n/request.ts → translations.ts                      │
│  └── ALL translation files bundled (10 locales × ~1MB)      │
└─────────────────────────────────────────────────────────────┘

优化后：
┌─────────────────────────────────────────────────────────────┐
│  Middleware (Edge Runtime) - ~50 KB                         │
│  ├── 自定义 locale 检测逻辑                                  │
│  ├── Cookie/Header/IP 检测                                  │
│  └── 重定向到带 locale 前缀的 URL                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Layout (Server Component)                                   │
│  ├── 加载 base translations                                  │
│  └── NextIntlClientProvider                                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Page (Server Component)                                     │
│  ├── 按需加载 tool translations                              │
│  └── 合并翻译并传递给组件                                    │
└─────────────────────────────────────────────────────────────┘
```

## 组件和接口

### 1. 轻量级 Middleware

```typescript
// src/middleware.ts (优化后)

import { NextRequest, NextResponse } from 'next/server';

// 支持的语言列表 - 硬编码避免导入
const locales = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'] as const;
type Locale = typeof locales[number];

// 国家到语言的映射 - 硬编码避免导入
const countryToLocale: Record<string, Locale> = {
  CN: 'zh', TW: 'zh', HK: 'zh', MO: 'zh',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', // ... 其他映射
  JP: 'ja',
  RU: 'ru', BY: 'ru', KZ: 'ru',
  FR: 'fr', BE: 'fr',
  SA: 'ar', AE: 'ar', EG: 'ar',
  DE: 'de', AT: 'de', CH: 'de',
  KR: 'ko',
  BR: 'pt', PT: 'pt',
};

const LOCALE_COOKIE = 'NEXT_LOCALE';
const DEFAULT_LOCALE: Locale = 'en';

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 跳过静态文件和 API 路由
  if (shouldSkip(pathname)) {
    return NextResponse.next();
  }
  
  // 检查是否已有 locale 前缀
  const hasLocalePrefix = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (hasLocalePrefix) {
    // 已有 locale 前缀，更新 cookie 并继续
    const currentLocale = pathname.split('/')[1] as Locale;
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, currentLocale, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    });
    return response;
  }
  
  // 检测 locale 并重定向
  const detectedLocale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? `/${detectedLocale}` : `/${detectedLocale}${pathname}`;
  
  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, detectedLocale, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
  });
  
  return response;
}

function shouldSkip(pathname: string): boolean {
  return (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.') ||
    pathname.includes('baidu_verify') ||
    pathname.includes('google')
  );
}

function detectLocale(request: NextRequest): Locale {
  // 1. Cookie
  const savedLocale = request.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined;
  if (savedLocale && locales.includes(savedLocale)) {
    return savedLocale;
  }
  
  // 2. IP 地理位置
  const country = request.headers.get('x-vercel-ip-country') || 
                  request.headers.get('cf-ipcountry');
  if (country && countryToLocale[country]) {
    return countryToLocale[country];
  }
  
  // 3. Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const browserLocales = acceptLanguage
      .split(',')
      .map(lang => lang.trim().split(';')[0].split('-')[0].toLowerCase());
    
    for (const locale of browserLocales) {
      if (locales.includes(locale as Locale)) {
        return locale as Locale;
      }
    }
  }
  
  return DEFAULT_LOCALE;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*|baidu_verify.*|google.*).*)'],
};
```

### 2. 更新的 i18n 配置

```typescript
// src/i18n/request.ts (优化后)

import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  // 不在这里加载翻译！
  // 翻译将在布局和页面级别按需加载
  return {
    locale,
    messages: {}, // 空对象，翻译在布局层加载
  };
});
```

### 3. 布局层翻译加载

```typescript
// src/app/[locale]/layout.tsx (关键部分)

import { NextIntlClientProvider } from 'next-intl';
import { loadBaseMessages, type SupportedLocale } from '@/lib/translations';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // 在布局层加载基础翻译
  const messages = await loadBaseMessages(locale as SupportedLocale);
  
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### 4. Next.js 配置更新

```javascript
// next.config.js (优化后)

// 不使用 next-intl 插件包装！
// const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... 其他配置保持不变
  
  experimental: {
    // 移除 next-intl 的优化，因为我们不再使用插件
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;
```

## 数据模型

翻译文件结构保持不变：

```
src/messages/
├── {locale}/
│   ├── base.json          # 基础翻译 (~400-700KB)
│   └── tools/
│       └── {slug}.json    # 工具详细翻译
└── {locale}.json          # 完整翻译（向后兼容）
```

## 正确性属性

*属性是一个特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的正式声明。属性是人类可读规范和机器可验证正确性保证之间的桥梁。*

### Property 1: Middleware 不包含翻译导入
*对于任何* middleware 构建输出，edge chunks 中不应包含任何 `src_messages_` 前缀的文件。
**Validates: Requirements 1.1, 1.2, 2.2**

### Property 2: Edge Function 大小限制
*对于任何* 构建输出，Edge Function 的总大小应小于 1.5 MB（留有安全余量）。
**Validates: Requirements 1.3, 4.2**

### Property 3: Locale 检测和重定向
*对于任何* 没有 locale 前缀的请求，middleware 应该检测 locale 并重定向到带有正确 locale 前缀的 URL。
**Validates: Requirements 3.1, 3.2**

### Property 4: 翻译回退机制
*对于任何* 缺失的翻译键，系统应该回退到英文翻译。
**Validates: Requirements 3.3**

### Property 5: 翻译键结构保持
*对于任何* 工具 slug S，翻译键应该遵循 `tools.{S}.name`、`tools.{S}.description` 等模式。
**Validates: Requirements 3.4**

### Property 6: 翻译缓存行为
*对于任何* 已加载的翻译文件，后续请求应该返回缓存版本而不触发新的导入。
**Validates: Requirements 5.1, 5.3**

## 错误处理

| 错误场景 | 处理策略 |
|---------|---------|
| 翻译文件加载失败 | 回退到英文翻译 |
| 英文翻译也失败 | 返回空对象，记录警告 |
| 无效的 locale | 使用默认 locale (en) |
| Cookie 解析失败 | 忽略 cookie，使用其他检测方法 |

## 测试策略

### 单元测试
- 测试 `detectLocale` 函数的各种输入场景
- 测试 `shouldSkip` 函数的路径匹配
- 测试翻译加载器的缓存行为

### 属性测试
- **Property 1**: 构建后检查 edge chunks 不包含翻译文件
- **Property 2**: 构建后检查 Edge Function 大小
- **Property 3**: 生成随机请求，验证 locale 检测和重定向
- **Property 6**: 多次加载同一翻译，验证缓存命中

### 集成测试
- 测试完整页面渲染与翻译
- 测试 locale 切换功能
- 测试 Vercel 部署成功

### 构建验证脚本
- 创建脚本检查 Edge Function 大小
- 在 CI/CD 中运行大小检查
