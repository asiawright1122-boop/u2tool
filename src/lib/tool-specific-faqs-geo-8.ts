/**
 * GEO 优化的工具 FAQ 配置 - 第八批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_8: ToolSpecificFAQ[] = [
  // Invoice Generator
  {
    slug: 'invoice-generator',
    faqs: {
      en: [
        { question: 'How do I create an invoice online?', answer: 'Fill in your business details, client info, line items with prices, and click Generate. Download as PDF ready to send to clients.' },
        { question: 'Can I customize the invoice template?', answer: 'Yes, add your logo, choose colors, select date format, and customize payment terms. Save your settings for future invoices.' },
        { question: 'Does it calculate taxes automatically?', answer: 'Yes, set your tax rate and the tool calculates tax for each item and totals. Supports multiple tax rates and tax-inclusive pricing.' },
      ],
      zh: [
        { question: '如何在线创建发票？', answer: '填写您的企业信息、客户信息、带价格的项目明细，然后点击生成。下载 PDF 即可发送给客户。' },
        { question: '可以自定义发票模板吗？', answer: '是的，可以添加 Logo、选择颜色、选择日期格式和自定义付款条款。保存设置以便将来使用。' },
        { question: '会自动计算税费吗？', answer: '是的，设置税率后工具会计算每个项目的税费和总计。支持多种税率和含税定价。' },
      ],
    },
  },

  // Resume Builder
  {
    slug: 'resume-builder',
    faqs: {
      en: [
        { question: 'How do I create a resume online?', answer: 'Choose a template, fill in your information (contact, experience, education, skills), and download as PDF. No account required.' },
        { question: 'What resume formats are available?', answer: 'We offer chronological, functional, and combination formats. Choose based on your experience level and career goals.' },
        { question: 'Can I save and edit my resume later?', answer: 'Yes, your data is saved in your browser. You can also export as JSON to backup and import later on any device.' },
      ],
      zh: [
        { question: '如何在线创建简历？', answer: '选择模板，填写信息（联系方式、工作经历、教育背景、技能），然后下载 PDF。无需注册账户。' },
        { question: '有哪些简历格式可用？', answer: '我们提供时间顺序型、功能型和组合型格式。根据您的经验水平和职业目标选择。' },
        { question: '可以保存并稍后编辑简历吗？', answer: '是的，您的数据保存在浏览器中。您也可以导出为 JSON 备份，稍后在任何设备上导入。' },
      ],
    },
  },

  // Privacy Policy Generator
  {
    slug: 'privacy-policy-generator',
    faqs: {
      en: [
        { question: 'How do I create a privacy policy?', answer: 'Answer questions about your website/app (data collected, cookies, third parties), and we generate a customized privacy policy you can use.' },
        { question: 'Is the generated policy legally compliant?', answer: 'Our templates follow GDPR, CCPA, and general best practices. However, consult a lawyer for specific legal requirements in your jurisdiction.' },
        { question: 'Can I customize the privacy policy?', answer: 'Yes, the generated policy is fully editable. Add, remove, or modify sections to match your specific data practices.' },
      ],
      zh: [
        { question: '如何创建隐私政策？', answer: '回答关于您网站/应用的问题（收集的数据、Cookie、第三方），我们会生成您可以使用的定制隐私政策。' },
        { question: '生成的政策符合法律要求吗？', answer: '我们的模板遵循 GDPR、CCPA 和一般最佳实践。但是，请咨询律师了解您所在地区的具体法律要求。' },
        { question: '可以自定义隐私政策吗？', answer: '是的，生成的政策完全可编辑。添加、删除或修改部分以匹配您的具体数据实践。' },
      ],
    },
  },

  // Terms Generator
  {
    slug: 'terms-generator',
    faqs: {
      en: [
        { question: 'How do I create terms of service?', answer: 'Provide your business details and answer questions about your service. We generate comprehensive terms covering user rights, limitations, and legal protections.' },
        { question: 'What should terms of service include?', answer: 'User obligations, intellectual property, limitation of liability, termination conditions, dispute resolution, and governing law. Our generator covers all essentials.' },
        { question: 'Do I need different terms for different countries?', answer: 'Basic terms work globally, but specific clauses may need adjustment for EU (GDPR), California (CCPA), or other jurisdictions. Consult legal counsel for international compliance.' },
      ],
      zh: [
        { question: '如何创建服务条款？', answer: '提供您的企业信息并回答关于服务的问题。我们会生成涵盖用户权利、限制和法律保护的全面条款。' },
        { question: '服务条款应该包括什么？', answer: '用户义务、知识产权、责任限制、终止条件、争议解决和适用法律。我们的生成器涵盖所有要点。' },
        { question: '不同国家需要不同的条款吗？', answer: '基本条款全球通用，但特定条款可能需要针对欧盟（GDPR）、加州（CCPA）或其他地区进行调整。请咨询法律顾问以确保国际合规。' },
      ],
    },
  },

  // Meta Tag Generator
  {
    slug: 'meta-tag-generator',
    faqs: {
      en: [
        { question: 'What are meta tags and why are they important?', answer: 'Meta tags provide information about your page to search engines and social media. They affect how your page appears in search results and when shared.' },
        { question: 'How do I generate meta tags?', answer: 'Enter your page title, description, keywords, and social media info. We generate HTML meta tags including Open Graph and Twitter Cards.' },
        { question: 'What is the ideal meta description length?', answer: '150-160 characters for search engines. Longer descriptions get truncated. Include your main keyword and a compelling call to action.' },
      ],
      zh: [
        { question: '什么是 meta 标签，为什么重要？', answer: 'Meta 标签向搜索引擎和社交媒体提供页面信息。它们影响页面在搜索结果中的显示方式以及分享时的外观。' },
        { question: '如何生成 meta 标签？', answer: '输入页面标题、描述、关键词和社交媒体信息。我们会生成包括 Open Graph 和 Twitter Cards 的 HTML meta 标签。' },
        { question: 'meta 描述的理想长度是多少？', answer: '搜索引擎建议 150-160 个字符。更长的描述会被截断。包含主要关键词和吸引人的行动号召。' },
      ],
    },
  },

  // Robots.txt Generator
  {
    slug: 'robots-txt-generator',
    faqs: {
      en: [
        { question: 'What is robots.txt?', answer: 'A file that tells search engine crawlers which pages to index and which to skip. It\'s placed in your website\'s root directory.' },
        { question: 'How do I create a robots.txt file?', answer: 'Select which bots to allow/disallow, specify paths to block, add sitemap URL, and copy the generated content to your server.' },
        { question: 'Can robots.txt hide pages from Google?', answer: 'It prevents crawling but not indexing. Pages can still appear in search results if linked from other sites. Use noindex meta tag for true exclusion.' },
      ],
      zh: [
        { question: '什么是 robots.txt？', answer: '一个告诉搜索引擎爬虫哪些页面要索引、哪些要跳过的文件。它放在网站的根目录中。' },
        { question: '如何创建 robots.txt 文件？', answer: '选择允许/禁止哪些机器人，指定要阻止的路径，添加站点地图 URL，然后将生成的内容复制到服务器。' },
        { question: 'robots.txt 可以从 Google 隐藏页面吗？', answer: '它阻止爬取但不阻止索引。如果其他网站链接到页面，页面仍可能出现在搜索结果中。使用 noindex meta 标签才能真正排除。' },
      ],
    },
  },

  // Sitemap Generator
  {
    slug: 'sitemap-generator',
    faqs: {
      en: [
        { question: 'What is a sitemap?', answer: 'An XML file listing all pages on your website. It helps search engines discover and index your content more efficiently.' },
        { question: 'How do I create a sitemap?', answer: 'Enter your website URL and we crawl your site to generate a sitemap. Or manually add URLs with priority and change frequency settings.' },
        { question: 'How often should I update my sitemap?', answer: 'Update whenever you add, remove, or significantly change pages. For dynamic sites, generate sitemaps automatically on content changes.' },
      ],
      zh: [
        { question: '什么是站点地图？', answer: '一个列出网站所有页面的 XML 文件。它帮助搜索引擎更有效地发现和索引您的内容。' },
        { question: '如何创建站点地图？', answer: '输入网站 URL，我们会爬取您的网站生成站点地图。或者手动添加 URL 并设置优先级和更改频率。' },
        { question: '应该多久更新一次站点地图？', answer: '每当添加、删除或显著更改页面时更新。对于动态网站，在内容更改时自动生成站点地图。' },
      ],
    },
  },

  // .htaccess Generator
  {
    slug: 'htaccess-generator',
    faqs: {
      en: [
        { question: 'What is .htaccess?', answer: 'A configuration file for Apache web servers. It controls redirects, security, caching, and URL rewriting without editing server config.' },
        { question: 'How do I create .htaccess rules?', answer: 'Select the rules you need (redirects, security headers, caching), configure options, and copy the generated code to your .htaccess file.' },
        { question: 'Will .htaccess work on my server?', answer: '.htaccess works on Apache servers with AllowOverride enabled. It doesn\'t work on Nginx (use nginx.conf) or IIS (use web.config).' },
      ],
      zh: [
        { question: '什么是 .htaccess？', answer: 'Apache Web 服务器的配置文件。它控制重定向、安全、缓存和 URL 重写，无需编辑服务器配置。' },
        { question: '如何创建 .htaccess 规则？', answer: '选择需要的规则（重定向、安全头、缓存），配置选项，然后将生成的代码复制到 .htaccess 文件。' },
        { question: '.htaccess 在我的服务器上能用吗？', answer: '.htaccess 在启用 AllowOverride 的 Apache 服务器上工作。在 Nginx（使用 nginx.conf）或 IIS（使用 web.config）上不起作用。' },
      ],
    },
  },

  // Cron Job Generator
  {
    slug: 'cron-job-generator',
    faqs: {
      en: [
        { question: 'What is a cron job?', answer: 'A scheduled task that runs automatically at specified times on Unix/Linux systems. Used for backups, cleanup, reports, and automated maintenance.' },
        { question: 'How do I create a cron schedule?', answer: 'Use our visual builder to select when to run (minute, hour, day, month, weekday). We generate the cron expression and show next run times.' },
        { question: 'What does * mean in cron?', answer: 'Asterisk (*) means "every" - every minute, every hour, etc. For example, * * * * * runs every minute, 0 * * * * runs every hour at minute 0.' },
      ],
      zh: [
        { question: '什么是 cron 任务？', answer: '在 Unix/Linux 系统上按指定时间自动运行的计划任务。用于备份、清理、报告和自动维护。' },
        { question: '如何创建 cron 计划？', answer: '使用我们的可视化构建器选择运行时间（分钟、小时、日期、月份、星期）。我们会生成 cron 表达式并显示下次运行时间。' },
        { question: 'cron 中的 * 是什么意思？', answer: '星号（*）表示"每个" - 每分钟、每小时等。例如，* * * * * 每分钟运行，0 * * * * 每小时的第 0 分钟运行。' },
      ],
    },
  },

  // Markdown Editor
  {
    slug: 'markdown-editor',
    faqs: {
      en: [
        { question: 'How do I write Markdown?', answer: 'Type in the editor using Markdown syntax: # for headings, **bold**, *italic*, [links](url), ![images](url), and more. Preview updates in real-time.' },
        { question: 'What Markdown features are supported?', answer: 'Full CommonMark plus GFM extensions: tables, task lists, strikethrough, fenced code blocks with syntax highlighting, and footnotes.' },
        { question: 'Can I export my Markdown?', answer: 'Yes, export as .md file, copy as HTML, or download as PDF. Your content is saved locally and persists between sessions.' },
      ],
      zh: [
        { question: '如何编写 Markdown？', answer: '在编辑器中使用 Markdown 语法输入：# 表示标题，**粗体**，*斜体*，[链接](url)，![图片](url) 等。预览实时更新。' },
        { question: '支持哪些 Markdown 功能？', answer: '完整的 CommonMark 加 GFM 扩展：表格、任务列表、删除线、带语法高亮的围栏代码块和脚注。' },
        { question: '可以导出 Markdown 吗？', answer: '是的，可以导出为 .md 文件、复制为 HTML 或下载为 PDF。您的内容保存在本地，会话之间保持不变。' },
      ],
    },
  },
];
