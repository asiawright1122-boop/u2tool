import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.u2tool.com';

/**
 * 生成 robots.txt 配置
 * 允许主要搜索引擎爬取，禁止 API 和私有路径
 * 支持：Google、Bing、百度、360、搜狗、神马、Yandex、头条等搜索引擎
 * 支持：AI 爬虫（GPTBot、ClaudeBot、PerplexityBot 等）用于 GEO 优化
 * @see Requirements 4.1, 4.2, 4.3
 * @see docs/SEO_GEO_COMPREHENSIVE_AUDIT.md
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // 默认规则：允许所有爬虫访问公开内容
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',      // API 路由不需要索引
          '/private/',  // 私有内容
          '/_next/',    // Next.js 内部资源
          '/*.json$',   // JSON 文件（除 manifest）
          '/*/loading', // 加载页面
        ],
        // 爬取延迟（秒）- 保护服务器
        crawlDelay: 1,
      },
      // === 国际搜索引擎 ===
      {
        // Google 爬虫：完全允许，无延迟
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        // Google 图片爬虫
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
      {
        // Google 移动端爬虫
        userAgent: 'Googlebot-Mobile',
        allow: '/',
      },
      {
        // Google AdsBot（广告质量检查）
        userAgent: 'AdsBot-Google',
        allow: '/',
      },
      {
        // Bing 爬虫：完全允许
        userAgent: 'Bingbot',
        allow: '/',
      },
      {
        // Bing 移动端爬虫
        userAgent: 'BingPreview',
        allow: '/',
      },
      {
        // Yandex 爬虫（俄罗斯搜索引擎）
        userAgent: 'YandexBot',
        allow: '/',
      },
      {
        // Yandex 图片爬虫
        userAgent: 'YandexImages',
        allow: '/',
      },
      {
        // DuckDuckGo 爬虫
        userAgent: 'DuckDuckBot',
        allow: '/',
      },
      {
        // Yahoo 爬虫
        userAgent: 'Slurp',
        allow: '/',
      },
      // === 中国搜索引擎 ===
      {
        // 百度爬虫：完全允许（中国最大搜索引擎）
        userAgent: 'Baiduspider',
        allow: '/',
      },
      {
        // 百度图片爬虫
        userAgent: 'Baiduspider-image',
        allow: '/',
      },
      {
        // 百度移动端爬虫
        userAgent: 'Baiduspider-mobile',
        allow: '/',
      },
      {
        // 百度视频爬虫
        userAgent: 'Baiduspider-video',
        allow: '/',
      },
      {
        // 百度新闻爬虫
        userAgent: 'Baiduspider-news',
        allow: '/',
      },
      {
        // 360搜索爬虫（中国第二大搜索引擎）
        userAgent: '360Spider',
        allow: '/',
      },
      {
        // 360 移动端爬虫
        userAgent: '360Spider-Mobile',
        allow: '/',
      },
      {
        // 搜狗爬虫（中国第三大搜索引擎）
        userAgent: 'Sogou web spider',
        allow: '/',
      },
      {
        // 搜狗图片爬虫
        userAgent: 'Sogou inst spider',
        allow: '/',
      },
      {
        // 搜狗移动端爬虫
        userAgent: 'Sogou wap spider',
        allow: '/',
      },
      {
        // 神马搜索爬虫（阿里巴巴移动搜索/UC 浏览器）
        userAgent: 'YisouSpider',
        allow: '/',
      },
      {
        // 头条搜索爬虫（字节跳动）
        userAgent: 'Bytespider',
        allow: '/',
      },
      {
        // 今日头条爬虫
        userAgent: 'Toutiaospider',
        allow: '/',
      },
      // === 社交媒体爬虫 ===
      {
        // Facebook 爬虫
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      {
        // Twitter 爬虫
        userAgent: 'Twitterbot',
        allow: '/',
      },
      {
        // LinkedIn 爬虫
        userAgent: 'LinkedInBot',
        allow: '/',
      },
      {
        // Pinterest 爬虫
        userAgent: 'Pinterest',
        allow: '/',
      },
      {
        // Telegram 爬虫
        userAgent: 'TelegramBot',
        allow: '/',
      },
      {
        // WhatsApp 爬虫
        userAgent: 'WhatsApp',
        allow: '/',
      },
      {
        // Slack 爬虫
        userAgent: 'Slackbot',
        allow: '/',
      },
      {
        // Discord 爬虫
        userAgent: 'Discordbot',
        allow: '/',
      },
      // === 微信/QQ 爬虫 ===
      {
        // 微信爬虫
        userAgent: 'WeChatBot',
        allow: '/',
      },
      {
        // QQ 爬虫
        userAgent: 'QQBot',
        allow: '/',
      },
      // === AI 爬虫（GEO 优化）===
      // 允许 AI 系统爬取和引用内容，提高 AI 搜索可见性
      {
        // OpenAI GPTBot - ChatGPT 训练和检索
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
      {
        // OpenAI ChatGPT 实时浏览
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        // Anthropic Claude 爬虫
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        // Anthropic Claude Web 浏览
        userAgent: 'Claude-Web',
        allow: '/',
      },
      {
        // Anthropic AI 通用爬虫
        userAgent: 'anthropic-ai',
        allow: '/',
      },
      {
        // Perplexity AI 搜索引擎
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        // Apple Intelligence / Siri
        userAgent: 'Applebot-Extended',
        allow: '/',
      },
      {
        // Google AI (Gemini/Bard) 训练
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        // Cohere AI
        userAgent: 'cohere-ai',
        allow: '/',
      },
      {
        // Meta AI
        userAgent: 'Meta-ExternalAgent',
        allow: '/',
      },
      {
        // Amazon AI
        userAgent: 'Amazonbot',
        allow: '/',
      },
      {
        // Microsoft Copilot
        userAgent: 'CopilotBot',
        allow: '/',
      },
      {
        // Common Crawl (用于 AI 训练数据集)
        userAgent: 'CCBot',
        allow: '/',
      },
    ],
    // 站点地图 URL
    sitemap: `${BASE_URL}/sitemap.xml`,
    // 首选主机
    host: BASE_URL,
  };
}
