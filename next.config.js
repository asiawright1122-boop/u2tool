const createNextIntlPlugin = require('next-intl/plugin');

/**
 * Next.js 配置
 * 
 * 使用 next-intl 插件，但翻译加载在布局层进行。
 * i18n/request.ts 返回空 messages，避免翻译被打包到 Edge Function。
 * 
 * @see .kiro/specs/middleware-size-optimization/
 */

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 禁用 Turbopack（解决中文路径 bug）
  // 参考: https://github.com/vercel/next.js/issues/turbopack-unicode
  turbopack: {
    // 设置根目录以避免检测到其他包含中文的路径
    root: __dirname,
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
    // 优化包导入（移除 next-intl，因为不再使用插件）
    optimizePackageImports: ['lucide-react'],
  },
  
  // 性能优化：HTTP 头部缓存策略
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
        // HTML 页面缓存（1小时，可重新验证）
        source: '/:locale(en|zh|es|pt|ja|ko|fr|de|ru|ar)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // API 路由缓存
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300',
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
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
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

module.exports = withNextIntl(nextConfig);
