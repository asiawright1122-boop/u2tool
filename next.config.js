const createNextIntlPlugin = require('next-intl/plugin');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Cloudflare Workers 开发环境初始化
// 仅在开发模式下初始化，生产构建由 opennextjs-cloudflare 处理
if (process.env.NODE_ENV === 'development') {
  const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare');
  initOpenNextCloudflareForDev();
}

/**
 * Next.js 配置
 * 
 * 使用 next-intl 插件，但翻译加载在布局层进行。
 * i18n/request.ts 返回空 messages，避免翻译被打包到 Edge Function。
 * 
 * 构建优化：
 * - 仅预渲染热门工具页面，减少构建日志大小（避免超过 Vercel 4MB 限制）
 * - 非热门工具通过 dynamicParams = true 按需生成并缓存
 * - @see src/app/[locale]/tools/[slug]/page.tsx
 * - @see https://vercel.link/build-log-size-limit
 * 
 * 部署平台：Cloudflare Workers (via @opennextjs/cloudflare)
 * @see .kiro/specs/vercel-to-cloudflare-migration/
 * @see .kiro/specs/middleware-size-optimization/
 */

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack 配置 - 明确设置根目录
  turbopack: {
    root: __dirname,
  },

  // Cloudflare Workers 优化：排除大型库从服务端 bundle
  // 这些库只在客户端使用，不需要打包到 Worker
  serverExternalPackages: [
    'echarts',
    'echarts/core',
    'echarts-for-react',
    'echarts-liquidfill',
    'echarts-wordcloud',
    'pdfjs-dist',
    'jspdf',
    'xlsx',
    'mammoth',
    'html2canvas',
    'html2pdf.js',
    'gif.js',
    'gifuct-js',
    'jszip',
    'pdf-lib',
    'qrcode',
    'colorthief',
    'exifreader',
  ],

  // 排除翻译文件从服务端 bundle（运行时从外部加载）
  webpack: (config, { isServer }) => {
    if (isServer) {
      // 将翻译文件标记为外部依赖
      config.externals = config.externals || [];
      config.externals.push({
        // 翻译文件不打包到服务端
        '../messages/zh.json': 'commonjs ../messages/zh.json',
        '../messages/ja.json': 'commonjs ../messages/ja.json',
        '../messages/ko.json': 'commonjs ../messages/ko.json',
        '../messages/es.json': 'commonjs ../messages/es.json',
        '../messages/pt.json': 'commonjs ../messages/pt.json',
        '../messages/fr.json': 'commonjs ../messages/fr.json',
        '../messages/de.json': 'commonjs ../messages/de.json',
        '../messages/ru.json': 'commonjs ../messages/ru.json',
        '../messages/ar.json': 'commonjs ../messages/ar.json',
      });
    }
    return config;
  },

  // 性能优化：启用压缩
  compress: true,

  // 性能优化：优化图片
  images: {
    // 启用图片优化
    formats: ['image/avif', 'image/webp'],
    // 设备尺寸断点
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // 图片尺寸断点
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 最小化缓存时间（秒）
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 天
  },

  // 性能优化：启用严格模式
  reactStrictMode: true,

  // 性能优化：优化打包
  experimental: {
    // 优化重依赖包的导入，启用更好的 tree-shaking
    // 注意：不要包含 serverExternalPackages 中的包
    optimizePackageImports: [
      'lucide-react',      // 图标库 ~200KB
      'marked',            // Markdown 解析
      'react-markdown',    // Markdown 渲染
    ],
  },

  // 性能优化：HTTP 头部缓存策略
  // @see Requirements 3.1, 15.1, 15.2 - 优化 HTTP 缓存头减少 Fast Data Transfer
  async headers() {
    return [
      {
        // 静态资源缓存策略（1年）
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // JS/CSS 资源缓存（1年，不可变）
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // HTML 页面缓存（7天，可重新验证30天）
        // 从 24 小时延长到 7 天，显著减少 Fast Data Transfer
        source: '/:locale(en|zh|es|pt|ja|ko|fr|de|ru|ar)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=2592000',
          },
          {
            // Vercel CDN 专用缓存控制头（不会返回给浏览器）
            key: 'Vercel-CDN-Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=2592000',
          },
        ],
      },
      {
        // API 路由缓存（1小时，可重新验证24小时）
        // 从 1 分钟延长到 1 小时
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
          {
            // 添加 Vary 头防止缓存污染
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      {
        // sitemap 和 robots 缓存（1天）
        source: '/:path(sitemap.xml|robots.txt|feed.xml)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // 安全头部
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google-analytics.com https://ssl.google-analytics.com https://hm.baidu.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://www.google-analytics.com https://hm.baidu.com; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://hm.baidu.com; frame-ancestors 'none';",
          },
          {
            // 允许 Service Worker 作用域
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },

  // 注意：根路径重定向由 middleware 处理，支持基于 IP 的语言检测
  // 不要在这里添加 '/' -> '/en' 的重定向，否则会覆盖 middleware 的语言检测逻辑

  // URL 重写规则（如需要可在此添加）
  // 注意：IndexNow key 文件直接放在 public 目录下，无需重写
};

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
