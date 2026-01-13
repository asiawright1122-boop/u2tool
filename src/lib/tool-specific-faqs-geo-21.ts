/**
 * GEO 优化的工具 FAQ 配置 - 第二十一批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_21: ToolSpecificFAQ[] = [
  // WHOIS Lookup
  {
    slug: 'whois-lookup',
    faqs: {
      en: [
        { question: 'What is WHOIS lookup?', answer: 'Query domain registration database. Shows registrar, creation date, expiration, nameservers, and sometimes owner contact.' },
        { question: 'Why is owner information hidden?', answer: 'GDPR and privacy services hide personal data. Many registrars offer privacy protection. Business info may still be visible.' },
        { question: 'What can I learn from WHOIS?', answer: 'Domain age, registrar, expiration date, nameservers. Useful for due diligence, SEO analysis, and finding domain owners.' },
      ],
      zh: [
        { question: '什么是 WHOIS 查询？', answer: '查询域名注册数据库。显示注册商、创建日期、到期日期、域名服务器，有时还有所有者联系方式。' },
        { question: '为什么所有者信息被隐藏？', answer: 'GDPR 和隐私服务隐藏个人数据。许多注册商提供隐私保护。商业信息可能仍然可见。' },
        { question: '我可以从 WHOIS 了解什么？', answer: '域名年龄、注册商、到期日期、域名服务器。对于尽职调查、SEO 分析和查找域名所有者很有用。' },
      ],
    },
  },

  // SSL Checker
  {
    slug: 'ssl-checker',
    faqs: {
      en: [
        { question: 'How do I check SSL certificate?', answer: 'Enter domain name. We connect and analyze the SSL/TLS certificate. Shows validity, issuer, expiration, and security grade.' },
        { question: 'What does the SSL checker verify?', answer: 'Certificate validity, expiration date, issuer trust, chain completeness, protocol versions, cipher suites.' },
        { question: 'Why is SSL important?', answer: 'Encrypts data between browser and server. Required for HTTPS. Affects SEO ranking. Builds user trust.' },
      ],
      zh: [
        { question: '如何检查 SSL 证书？', answer: '输入域名。我们连接并分析 SSL/TLS 证书。显示有效性、颁发者、到期日期和安全等级。' },
        { question: 'SSL 检查器验证什么？', answer: '证书有效性、到期日期、颁发者信任、链完整性、协议版本、密码套件。' },
        { question: '为什么 SSL 很重要？', answer: '加密浏览器和服务器之间的数据。HTTPS 必需。影响 SEO 排名。建立用户信任。' },
      ],
    },
  },

  // HTTP Headers Checker
  {
    slug: 'http-headers',
    faqs: {
      en: [
        { question: 'What are HTTP headers?', answer: 'Metadata sent with HTTP requests/responses. Include content type, caching rules, security policies, cookies, and more.' },
        { question: 'How do I check HTTP headers?', answer: 'Enter URL. We make request and display all response headers. Useful for debugging and security analysis.' },
        { question: 'What security headers should I check?', answer: 'Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security, X-XSS-Protection.' },
      ],
      zh: [
        { question: '什么是 HTTP 头？', answer: '随 HTTP 请求/响应发送的元数据。包括内容类型、缓存规则、安全策略、Cookie 等。' },
        { question: '如何检查 HTTP 头？', answer: '输入 URL。我们发出请求并显示所有响应头。对于调试和安全分析很有用。' },
        { question: '应该检查哪些安全头？', answer: 'Content-Security-Policy、X-Frame-Options、X-Content-Type-Options、Strict-Transport-Security、X-XSS-Protection。' },
      ],
    },
  },

  // Website Speed Test
  {
    slug: 'speed-test',
    faqs: {
      en: [
        { question: 'How do I test website speed?', answer: 'Enter URL. We load the page and measure performance metrics: load time, TTFB, FCP, LCP, and resource breakdown.' },
        { question: 'What metrics are measured?', answer: 'Time to First Byte (TTFB), First Contentful Paint (FCP), Largest Contentful Paint (LCP), Total load time, page size.' },
        { question: 'How do I improve website speed?', answer: 'Optimize images, enable compression, use CDN, minimize CSS/JS, enable caching, reduce server response time.' },
      ],
      zh: [
        { question: '如何测试网站速度？', answer: '输入 URL。我们加载页面并测量性能指标：加载时间、TTFB、FCP、LCP 和资源分解。' },
        { question: '测量哪些指标？', answer: '首字节时间（TTFB）、首次内容绘制（FCP）、最大内容绘制（LCP）、总加载时间、页面大小。' },
        { question: '如何提高网站速度？', answer: '优化图像、启用压缩、使用 CDN、最小化 CSS/JS、启用缓存、减少服务器响应时间。' },
      ],
    },
  },

  // Meta Tag Generator
  {
    slug: 'meta-tag-generator',
    faqs: {
      en: [
        { question: 'What are meta tags?', answer: 'HTML tags providing page metadata: title, description, keywords, social sharing info. Important for SEO and social media.' },
        { question: 'How do I generate meta tags?', answer: 'Fill in title, description, keywords, and social media info. We generate HTML code to copy into your page head.' },
        { question: 'What meta tags are important for SEO?', answer: 'Title tag, meta description, canonical URL, Open Graph tags (og:), Twitter cards. Robots meta for indexing control.' },
      ],
      zh: [
        { question: '什么是 meta 标签？', answer: '提供页面元数据的 HTML 标签：标题、描述、关键词、社交分享信息。对 SEO 和社交媒体很重要。' },
        { question: '如何生成 meta 标签？', answer: '填写标题、描述、关键词和社交媒体信息。我们生成 HTML 代码供您复制到页面 head 中。' },
        { question: '哪些 meta 标签对 SEO 很重要？', answer: '标题标签、meta 描述、canonical URL、Open Graph 标签（og:）、Twitter 卡片。Robots meta 用于索引控制。' },
      ],
    },
  },

  // Open Graph Generator
  {
    slug: 'og-generator',
    faqs: {
      en: [
        { question: 'What is Open Graph?', answer: 'Protocol for rich link previews on social media. Controls how your page appears when shared on Facebook, LinkedIn, etc.' },
        { question: 'What Open Graph tags do I need?', answer: 'og:title, og:description, og:image, og:url are essential. Also og:type, og:site_name for complete implementation.' },
        { question: 'What image size for og:image?', answer: '1200×630 pixels recommended. Minimum 600×315. Use high-quality images. Facebook, LinkedIn, and others use this.' },
      ],
      zh: [
        { question: '什么是 Open Graph？', answer: '用于社交媒体丰富链接预览的协议。控制您的页面在 Facebook、LinkedIn 等上分享时的显示方式。' },
        { question: '我需要哪些 Open Graph 标签？', answer: 'og:title、og:description、og:image、og:url 是必需的。还有 og:type、og:site_name 用于完整实现。' },
        { question: 'og:image 应该用什么图像尺寸？', answer: '推荐 1200×630 像素。最小 600×315。使用高质量图像。Facebook、LinkedIn 等都使用这个。' },
      ],
    },
  },

  // Twitter Card Generator
  {
    slug: 'twitter-card-generator',
    faqs: {
      en: [
        { question: 'What are Twitter Cards?', answer: 'Rich media attachments for tweets. When someone shares your URL, Twitter shows title, description, and image.' },
        { question: 'What Twitter Card types exist?', answer: 'Summary (small image), Summary Large Image (big image), App (mobile app), Player (video/audio).' },
        { question: 'How do I validate Twitter Cards?', answer: 'Use Twitter Card Validator tool. Enter URL to preview how your card will appear. Fix any warnings shown.' },
      ],
      zh: [
        { question: '什么是 Twitter 卡片？', answer: '推文的富媒体附件。当有人分享您的 URL 时，Twitter 显示标题、描述和图像。' },
        { question: '有哪些 Twitter 卡片类型？', answer: '摘要（小图像）、大图摘要（大图像）、应用（移动应用）、播放器（视频/音频）。' },
        { question: '如何验证 Twitter 卡片？', answer: '使用 Twitter 卡片验证工具。输入 URL 预览您的卡片将如何显示。修复显示的任何警告。' },
      ],
    },
  },

  // Robots.txt Generator
  {
    slug: 'robots-txt-generator',
    faqs: {
      en: [
        { question: 'What is robots.txt?', answer: 'File telling search engine crawlers which pages to index or ignore. Located at yoursite.com/robots.txt.' },
        { question: 'How do I create robots.txt?', answer: 'Use our generator to set rules: allow/disallow paths, set crawl delay, specify sitemap location. Download file.' },
        { question: 'Does robots.txt block pages from Google?', answer: 'It requests crawlers not to access pages, but doesn\'t guarantee exclusion. Use noindex meta tag for stronger control.' },
      ],
      zh: [
        { question: '什么是 robots.txt？', answer: '告诉搜索引擎爬虫哪些页面要索引或忽略的文件。位于 yoursite.com/robots.txt。' },
        { question: '如何创建 robots.txt？', answer: '使用我们的生成器设置规则：允许/禁止路径、设置爬取延迟、指定站点地图位置。下载文件。' },
        { question: 'robots.txt 能阻止页面被 Google 收录吗？', answer: '它请求爬虫不要访问页面，但不能保证排除。使用 noindex meta 标签进行更强的控制。' },
      ],
    },
  },

  // Sitemap Generator
  {
    slug: 'sitemap-generator',
    faqs: {
      en: [
        { question: 'What is a sitemap?', answer: 'XML file listing all pages on your site. Helps search engines discover and index your content efficiently.' },
        { question: 'How do I create a sitemap?', answer: 'Enter your website URL. We crawl and generate XML sitemap with all discovered pages. Download and upload to your server.' },
        { question: 'How do I submit sitemap to Google?', answer: 'Add to Google Search Console, or reference in robots.txt: Sitemap: https://yoursite.com/sitemap.xml' },
      ],
      zh: [
        { question: '什么是站点地图？', answer: '列出您网站上所有页面的 XML 文件。帮助搜索引擎高效地发现和索引您的内容。' },
        { question: '如何创建站点地图？', answer: '输入您的网站 URL。我们爬取并生成包含所有发现页面的 XML 站点地图。下载并上传到您的服务器。' },
        { question: '如何向 Google 提交站点地图？', answer: '添加到 Google Search Console，或在 robots.txt 中引用：Sitemap: https://yoursite.com/sitemap.xml' },
      ],
    },
  },

  // Schema Markup Generator
  {
    slug: 'schema-generator',
    faqs: {
      en: [
        { question: 'What is Schema markup?', answer: 'Structured data helping search engines understand your content. Enables rich snippets in search results (stars, prices, FAQs).' },
        { question: 'What Schema types are available?', answer: 'Article, Product, LocalBusiness, FAQ, HowTo, Recipe, Event, Organization, Person, and many more.' },
        { question: 'How do I add Schema to my page?', answer: 'Generate JSON-LD code with our tool. Add to page head or body. Validate with Google Rich Results Test.' },
      ],
      zh: [
        { question: '什么是 Schema 标记？', answer: '帮助搜索引擎理解您内容的结构化数据。在搜索结果中启用丰富摘要（星级、价格、FAQ）。' },
        { question: '有哪些 Schema 类型可用？', answer: 'Article、Product、LocalBusiness、FAQ、HowTo、Recipe、Event、Organization、Person 等等。' },
        { question: '如何将 Schema 添加到我的页面？', answer: '使用我们的工具生成 JSON-LD 代码。添加到页面 head 或 body。使用 Google 富媒体结果测试验证。' },
      ],
    },
  },
];
