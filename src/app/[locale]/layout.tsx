import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import { routing } from '@/i18n/routing';
import { SEO_CONFIG, getVerificationTags } from '@/lib/seo';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WebVitalsReporter from '@/components/WebVitalsReporter';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.u2tool.com';

/**
 * 视口配置
 * 包含主题颜色、PWA 相关设置、移动端优化
 */
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: SEO_CONFIG.themeColor },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  // 移动端视口优化
  viewportFit: 'cover', // 支持 iPhone X 等刘海屏
  interactiveWidget: 'resizes-visual', // 虚拟键盘行为优化
};

/**
 * 全局元数据配置
 * 包含站长验证、PWA manifest、图标等
 */
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: '%s | U2Tool',
    default: 'U2Tool - Free Online Tools',
  },
  description: 'Free online tools for developers, designers, and creators.',
  // 应用名称（PWA）
  applicationName: SEO_CONFIG.siteName,
  // 作者信息
  authors: [{ name: SEO_CONFIG.siteName }],
  // 生成器
  generator: 'Next.js',
  // 关键词（全局默认）
  keywords: ['online tools', 'developer tools', 'free tools', 'web tools'],
  // 引用策略
  referrer: 'origin-when-cross-origin',
  // 创建者
  creator: SEO_CONFIG.siteName,
  // 发布者
  publisher: SEO_CONFIG.siteName,
  // 格式检测（禁用自动电话号码检测）
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Open Graph 默认配置
  openGraph: {
    type: 'website',
    siteName: SEO_CONFIG.siteName,
  },
  // Twitter Card 默认配置
  twitter: {
    card: 'summary_large_image',
    site: SEO_CONFIG.twitterHandle,
  },
  // 机器人指令
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // 图标配置
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/safari-pinned-tab.svg', color: SEO_CONFIG.themeColor },
    ],
  },
  // PWA manifest
  manifest: '/manifest.json',
  // 站长验证标签
  verification: getVerificationTags(),
  // RSS Feed
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  // 其他 meta 标签
  other: {
    // === 移动端优化 ===
    // 百度移动适配声明
    'mobile-agent': `format=html5; url=${BASE_URL}`,
    'applicable-device': 'pc,mobile',
    // 百度 MIP 声明（移动网页加速）
    'baidu-site-verification': process.env.BAIDU_SITE_VERIFICATION || '',
    
    // === 浏览器渲染优化 ===
    // 360 浏览器渲染模式（优先使用 webkit 内核）
    'renderer': 'webkit',
    // IE/Edge 兼容模式
    'X-UA-Compatible': 'IE=edge,chrome=1',
    
    // === 转码禁止 ===
    // 禁止百度转码
    'Cache-Control': 'no-transform',
    // 禁止 siteapp 转码
    'no-siteapp': 'true',
    // 禁止搜狗转码
    'sogou_site_verification': process.env.SOGOU_SITE_VERIFICATION || '',
    
    // === Apple 移动端优化 ===
    // 启用全屏模式
    'apple-mobile-web-app-capable': 'yes',
    // 状态栏样式
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    // 应用标题
    'apple-mobile-web-app-title': SEO_CONFIG.siteName,
    
    // === Android 移动端优化 ===
    // 启用全屏模式
    'mobile-web-app-capable': 'yes',
    
    // === 微软/Windows 优化 ===
    // Windows 磁贴颜色
    'msapplication-TileColor': SEO_CONFIG.themeColor,
    // Windows 磁贴图标
    'msapplication-TileImage': '/icons/icon-144x144.png',
    // Windows 配置文件
    'msapplication-config': '/browserconfig.xml',
    
    // === 搜索引擎特定优化 ===
    // Google 新闻标记
    'news_keywords': 'developer tools, online tools, web tools, free tools',
    // 内容分级
    'rating': 'general',
    // 版权信息
    'copyright': `© ${new Date().getFullYear()} ${SEO_CONFIG.siteName}`,
    // 地理位置（可选，用于本地化搜索）
    'geo.region': 'US',
    'geo.placename': 'United States',
    
    // === 社交媒体优化 ===
    // Pinterest 验证
    'p:domain_verify': process.env.PINTEREST_VERIFICATION || '',
  },
  // 分类
  category: 'technology',
};

/**
 * 生成静态参数，为每个支持的语言生成页面
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * 语言布局组件
 * 动态设置 HTML lang 属性，确保正确的语言标识
 * @see Requirements 1.2
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // 验证 locale 是否在支持的语言列表中
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  // 显式传递 locale 以确保加载正确的翻译文件
  const messages = await getMessages({ locale });

  return (
    // 动态设置 lang 属性，确保搜索引擎和辅助技术正确识别页面语言
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* === 性能优化：DNS 预取和预连接 === */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//hm.baidu.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* === 性能优化：预加载关键资源 === */}
        <link rel="preload" as="style" href="/globals.css" />
        
        {/* === 移动端优化：Apple 特定标签 === */}
        {/* Apple 启动画面（不同设备尺寸） */}
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-2048-2732.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1668-2388.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1536-2048.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1125-2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-1242-2688.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-750-1334.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/icons/apple-splash-640-1136.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" />
        
        {/* === 搜索引擎优化：百度移动适配 === */}
        {/* 百度移动适配协议 - 告知百度 PC 和移动页面的对应关系 */}
        <meta name="mobile-agent" content={`format=html5; url=${BASE_URL}/${locale}`} />
        
        {/* === 搜索引擎优化：神马搜索（UC 浏览器） === */}
        <meta name="shenma-site-verification" content={process.env.SHENMA_SITE_VERIFICATION || ''} />
        
        {/* === 搜索引擎优化：头条搜索 === */}
        <meta name="bytedance-verification-code" content={process.env.BYTEDANCE_VERIFICATION || ''} />
        
        {/* === 安全优化 === */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* === 语言和地区优化 === */}
        <meta httpEquiv="Content-Language" content={locale} />
      </head>
      <body className="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <NextIntlClientProvider messages={messages}>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow pt-16 bg-white dark:bg-black">{children}</main>
              <Footer />
            </div>
            {/* Web Vitals 监控 */}
            <WebVitalsReporter />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
