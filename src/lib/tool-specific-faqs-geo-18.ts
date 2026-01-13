/**
 * GEO 优化的工具 FAQ 配置 - 第十八批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_18: ToolSpecificFAQ[] = [
  // Cron Expression Generator
  {
    slug: 'cron-expression-generator',
    faqs: {
      en: [
        { question: 'What is a cron expression?', answer: 'A string defining schedule: minute hour day month weekday. "0 9 * * 1" = every Monday at 9 AM. Used for scheduled tasks.' },
        { question: 'How do I create a cron expression?', answer: 'Use our visual builder: select frequency, time, days. We generate the cron expression and show next run times.' },
        { question: 'What do the asterisks mean?', answer: '* means "every". "* * * * *" = every minute. "0 * * * *" = every hour at minute 0. "0 0 * * *" = daily at midnight.' },
      ],
      zh: [
        { question: '什么是 cron 表达式？', answer: '定义计划的字符串：分钟 小时 日 月 星期。"0 9 * * 1" = 每周一上午 9 点。用于计划任务。' },
        { question: '如何创建 cron 表达式？', answer: '使用我们的可视化构建器：选择频率、时间、日期。我们生成 cron 表达式并显示下次运行时间。' },
        { question: '星号是什么意思？', answer: '* 表示"每个"。"* * * * *" = 每分钟。"0 * * * *" = 每小时的第 0 分钟。"0 0 * * *" = 每天午夜。' },
      ],
    },
  },

  // JWT Decoder
  {
    slug: 'jwt-decoder',
    faqs: {
      en: [
        { question: 'What is a JWT token?', answer: 'JSON Web Token - a secure way to transmit information. Contains header, payload, and signature. Used for authentication.' },
        { question: 'How do I decode a JWT?', answer: 'Paste the token. We decode and display header (algorithm), payload (claims), and verify structure. No secret needed to decode.' },
        { question: 'Is it safe to decode JWTs online?', answer: 'Decoding is safe - payload is just base64 encoded, not encrypted. Don\'t share tokens with sensitive data. We don\'t store tokens.' },
      ],
      zh: [
        { question: '什么是 JWT 令牌？', answer: 'JSON Web Token - 一种安全传输信息的方式。包含头部、载荷和签名。用于身份验证。' },
        { question: '如何解码 JWT？', answer: '粘贴令牌。我们解码并显示头部（算法）、载荷（声明）并验证结构。解码不需要密钥。' },
        { question: '在线解码 JWT 安全吗？', answer: '解码是安全的 - 载荷只是 base64 编码，不是加密。不要分享包含敏感数据的令牌。我们不存储令牌。' },
      ],
    },
  },

  // API Tester
  {
    slug: 'api-tester',
    faqs: {
      en: [
        { question: 'How do I test an API endpoint?', answer: 'Enter URL, select method (GET/POST/PUT/DELETE), add headers and body if needed. Click Send to see response.' },
        { question: 'What request methods are supported?', answer: 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS. Add custom headers, query params, and request body.' },
        { question: 'Can I save API requests?', answer: 'Yes, save requests to collections for reuse. Export/import collections. Great for API documentation and testing.' },
      ],
      zh: [
        { question: '如何测试 API 端点？', answer: '输入 URL，选择方法（GET/POST/PUT/DELETE），根据需要添加头部和正文。点击发送查看响应。' },
        { question: '支持哪些请求方法？', answer: 'GET、POST、PUT、PATCH、DELETE、HEAD、OPTIONS。添加自定义头部、查询参数和请求正文。' },
        { question: '可以保存 API 请求吗？', answer: '是的，将请求保存到集合以便重用。导出/导入集合。非常适合 API 文档和测试。' },
      ],
    },
  },

  // Code Formatter
  {
    slug: 'code-formatter',
    faqs: {
      en: [
        { question: 'What languages are supported?', answer: 'JavaScript, TypeScript, HTML, CSS, JSON, Python, SQL, and more. Select language for proper formatting rules.' },
        { question: 'Can I customize formatting rules?', answer: 'Yes, adjust indent size (2/4 spaces or tabs), line width, quote style, semicolons, and other options.' },
        { question: 'Does it fix syntax errors?', answer: 'No, formatter requires valid syntax. It beautifies code structure but won\'t fix errors. Use a linter for error detection.' },
      ],
      zh: [
        { question: '支持哪些语言？', answer: 'JavaScript、TypeScript、HTML、CSS、JSON、Python、SQL 等。选择语言以获得正确的格式化规则。' },
        { question: '可以自定义格式化规则吗？', answer: '是的，调整缩进大小（2/4 空格或制表符）、行宽、引号样式、分号和其他选项。' },
        { question: '它能修复语法错误吗？', answer: '不能，格式化器需要有效的语法。它美化代码结构但不会修复错误。使用 linter 进行错误检测。' },
      ],
    },
  },

  // Code Minifier
  {
    slug: 'code-minifier',
    faqs: {
      en: [
        { question: 'What is code minification?', answer: 'Removes whitespace, comments, and shortens variable names to reduce file size. Essential for production JavaScript/CSS.' },
        { question: 'How much size reduction can I expect?', answer: 'Typically 30-70% reduction. More for verbose code with comments. Minified code loads faster.' },
        { question: 'Can minified code be reversed?', answer: 'Partially. Beautifiers restore formatting but not original variable names. Keep source files for development.' },
      ],
      zh: [
        { question: '什么是代码压缩？', answer: '移除空白、注释并缩短变量名以减小文件大小。对于生产环境的 JavaScript/CSS 至关重要。' },
        { question: '可以期望多少大小减少？', answer: '通常减少 30-70%。带注释的冗长代码减少更多。压缩后的代码加载更快。' },
        { question: '压缩后的代码可以还原吗？', answer: '部分可以。美化器恢复格式但不能恢复原始变量名。保留源文件用于开发。' },
      ],
    },
  },

  // SQL Formatter
  {
    slug: 'sql-formatter',
    faqs: {
      en: [
        { question: 'How do I format SQL queries?', answer: 'Paste SQL code, select dialect (MySQL, PostgreSQL, etc.), click Format. We indent and structure for readability.' },
        { question: 'What SQL dialects are supported?', answer: 'Standard SQL, MySQL, PostgreSQL, SQL Server, Oracle, SQLite. Each has slightly different syntax rules.' },
        { question: 'Does it validate SQL syntax?', answer: 'Basic validation only. For full validation, test against your actual database. We focus on formatting, not execution.' },
      ],
      zh: [
        { question: '如何格式化 SQL 查询？', answer: '粘贴 SQL 代码，选择方言（MySQL、PostgreSQL 等），点击格式化。我们缩进和结构化以提高可读性。' },
        { question: '支持哪些 SQL 方言？', answer: '标准 SQL、MySQL、PostgreSQL、SQL Server、Oracle、SQLite。每种都有略微不同的语法规则。' },
        { question: '它验证 SQL 语法吗？', answer: '仅基本验证。要完全验证，请针对实际数据库测试。我们专注于格式化，而非执行。' },
      ],
    },
  },

  // CSS Minifier
  {
    slug: 'css-minifier',
    faqs: {
      en: [
        { question: 'How do I minify CSS?', answer: 'Paste CSS code and click Minify. We remove whitespace, comments, and optimize selectors. Download minified file.' },
        { question: 'What optimizations are applied?', answer: 'Remove whitespace/comments, shorten colors (#ffffff → #fff), merge selectors, remove redundant properties.' },
        { question: 'Should I minify CSS for production?', answer: 'Yes, always. Minified CSS loads faster. Use source maps for debugging. Most build tools do this automatically.' },
      ],
      zh: [
        { question: '如何压缩 CSS？', answer: '粘贴 CSS 代码并点击压缩。我们移除空白、注释并优化选择器。下载压缩后的文件。' },
        { question: '应用了哪些优化？', answer: '移除空白/注释、缩短颜色（#ffffff → #fff）、合并选择器、移除冗余属性。' },
        { question: '生产环境应该压缩 CSS 吗？', answer: '是的，始终应该。压缩后的 CSS 加载更快。使用 source maps 进行调试。大多数构建工具会自动执行此操作。' },
      ],
    },
  },

  // HTML Minifier
  {
    slug: 'html-minifier',
    faqs: {
      en: [
        { question: 'How do I minify HTML?', answer: 'Paste HTML code and click Minify. We remove whitespace, comments, and optional tags. Download minified file.' },
        { question: 'What gets removed during minification?', answer: 'Whitespace between tags, HTML comments, optional closing tags, redundant attributes. Content is preserved.' },
        { question: 'Will minification break my HTML?', answer: 'Rarely. We preserve necessary whitespace in pre/code tags. Test thoroughly. Some edge cases may need adjustment.' },
      ],
      zh: [
        { question: '如何压缩 HTML？', answer: '粘贴 HTML 代码并点击压缩。我们移除空白、注释和可选标签。下载压缩后的文件。' },
        { question: '压缩过程中会移除什么？', answer: '标签之间的空白、HTML 注释、可选的闭合标签、冗余属性。内容会保留。' },
        { question: '压缩会破坏我的 HTML 吗？', answer: '很少。我们保留 pre/code 标签中必要的空白。彻底测试。某些边缘情况可能需要调整。' },
      ],
    },
  },

  // JavaScript Minifier
  {
    slug: 'javascript-minifier',
    faqs: {
      en: [
        { question: 'How do I minify JavaScript?', answer: 'Paste JS code and click Minify. We remove whitespace, shorten variables, and optimize code. Download minified file.' },
        { question: 'What is the difference between minify and uglify?', answer: 'Minify removes whitespace. Uglify also mangles variable names and applies advanced optimizations. We offer both.' },
        { question: 'Will minification break my code?', answer: 'Usually not. Avoid relying on variable names (like in eval). Test minified code thoroughly before production.' },
      ],
      zh: [
        { question: '如何压缩 JavaScript？', answer: '粘贴 JS 代码并点击压缩。我们移除空白、缩短变量并优化代码。下载压缩后的文件。' },
        { question: 'minify 和 uglify 有什么区别？', answer: 'Minify 移除空白。Uglify 还会混淆变量名并应用高级优化。我们提供两种选项。' },
        { question: '压缩会破坏我的代码吗？', answer: '通常不会。避免依赖变量名（如在 eval 中）。在生产前彻底测试压缩后的代码。' },
      ],
    },
  },

  // JSON to CSV
  {
    slug: 'json-to-csv',
    faqs: {
      en: [
        { question: 'How do I convert JSON to CSV?', answer: 'Paste JSON array of objects. We extract keys as headers and values as rows. Download CSV file.' },
        { question: 'What JSON structure is required?', answer: 'Array of objects with consistent keys: [{name:"A",value:1},{name:"B",value:2}]. Nested objects are flattened.' },
        { question: 'How are nested objects handled?', answer: 'Nested objects are flattened with dot notation: {user:{name:"John"}} becomes user.name column.' },
      ],
      zh: [
        { question: '如何将 JSON 转换为 CSV？', answer: '粘贴对象数组的 JSON。我们提取键作为标题，值作为行。下载 CSV 文件。' },
        { question: '需要什么 JSON 结构？', answer: '具有一致键的对象数组：[{name:"A",value:1},{name:"B",value:2}]。嵌套对象会被展平。' },
        { question: '嵌套对象如何处理？', answer: '嵌套对象使用点表示法展平：{user:{name:"John"}} 变成 user.name 列。' },
      ],
    },
  },
];
