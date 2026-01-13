/**
 * GEO 优化的工具 FAQ 配置 - 第三十六批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_36: ToolSpecificFAQ[] = [
  // Color Contrast Checker
  {
    slug: 'color-contrast-checker',
    faqs: {
      en: [
        { question: 'What is color contrast ratio?', answer: 'Ratio between foreground and background luminance. Higher ratio = better readability. WCAG requires 4.5:1 for normal text.' },
        { question: 'What are WCAG contrast requirements?', answer: 'AA: 4.5:1 normal text, 3:1 large text. AAA: 7:1 normal, 4.5:1 large. We show compliance level.' },
        { question: 'How do I fix low contrast?', answer: 'Darken the darker color or lighten the lighter one. We suggest accessible color alternatives.' },
      ],
      zh: [
        { question: '什么是颜色对比度？', answer: '前景和背景亮度之间的比率。比率越高 = 可读性越好。WCAG 要求普通文本 4.5:1。' },
        { question: 'WCAG 对比度要求是什么？', answer: 'AA：普通文本 4.5:1，大文本 3:1。AAA：普通 7:1，大 4.5:1。我们显示合规级别。' },
        { question: '如何修复低对比度？', answer: '使较深的颜色更深或使较浅的颜色更浅。我们建议可访问的颜色替代方案。' },
      ],
    },
  },

  // Markdown Table Generator
  {
    slug: 'markdown-table-generator',
    faqs: {
      en: [
        { question: 'How do I create a Markdown table?', answer: 'Enter data in grid, we generate Markdown table syntax. Supports alignment and formatting.' },
        { question: 'Can I import from Excel?', answer: 'Yes, paste Excel data. We convert to Markdown table format automatically.' },
        { question: 'How do I align columns?', answer: 'Use :--- for left, :---: for center, ---: for right alignment in the separator row.' },
      ],
      zh: [
        { question: '如何创建 Markdown 表格？', answer: '在网格中输入数据，我们生成 Markdown 表格语法。支持对齐和格式化。' },
        { question: '可以从 Excel 导入吗？', answer: '是的，粘贴 Excel 数据。我们自动转换为 Markdown 表格格式。' },
        { question: '如何对齐列？', answer: '在分隔行中使用 :--- 左对齐，:---: 居中，---: 右对齐。' },
      ],
    },
  },

  // Base58 Encoder/Decoder
  {
    slug: 'base58',
    faqs: {
      en: [
        { question: 'What is Base58?', answer: 'Encoding using 58 characters, excluding similar-looking ones (0, O, I, l). Used in Bitcoin addresses.' },
        { question: 'Why use Base58 instead of Base64?', answer: 'Avoids confusing characters, easier to read/type manually. No + or / that cause URL issues.' },
        { question: 'What is Base58Check?', answer: 'Base58 with checksum for error detection. Used in cryptocurrency addresses to prevent typos.' },
      ],
      zh: [
        { question: '什么是 Base58？', answer: '使用 58 个字符的编码，排除外观相似的字符（0、O、I、l）。用于比特币地址。' },
        { question: '为什么使用 Base58 而不是 Base64？', answer: '避免混淆字符，更容易手动阅读/输入。没有导致 URL 问题的 + 或 /。' },
        { question: '什么是 Base58Check？', answer: '带有校验和的 Base58，用于错误检测。用于加密货币地址以防止拼写错误。' },
      ],
    },
  },

  // OpenGraph Preview
  {
    slug: 'opengraph-preview',
    faqs: {
      en: [
        { question: 'What is OpenGraph?', answer: 'Meta tags that control how URLs appear when shared on social media. Title, description, image preview.' },
        { question: 'How do I preview my OpenGraph tags?', answer: 'Enter URL or paste HTML. We show how it appears on Facebook, Twitter, LinkedIn.' },
        { question: 'What tags are required?', answer: 'og:title, og:description, og:image, og:url. Twitter uses twitter:card additionally.' },
      ],
      zh: [
        { question: '什么是 OpenGraph？', answer: '控制 URL 在社交媒体上分享时显示方式的元标签。标题、描述、图像预览。' },
        { question: '如何预览我的 OpenGraph 标签？', answer: '输入 URL 或粘贴 HTML。我们显示它在 Facebook、Twitter、LinkedIn 上的显示效果。' },
        { question: '哪些标签是必需的？', answer: 'og:title、og:description、og:image、og:url。Twitter 额外使用 twitter:card。' },
      ],
    },
  },

  // CSS Grid Generator
  {
    slug: 'css-grid-generator',
    faqs: {
      en: [
        { question: 'How do I create a CSS Grid layout?', answer: 'Set columns, rows, and gap. Drag to resize cells. We generate the CSS code.' },
        { question: 'What is fr unit in CSS Grid?', answer: 'Fractional unit. 1fr 2fr means second column is twice as wide. Flexible sizing.' },
        { question: 'How do I span multiple cells?', answer: 'Use grid-column: span 2 or grid-row: span 2. We visualize and generate the code.' },
      ],
      zh: [
        { question: '如何创建 CSS Grid 布局？', answer: '设置列、行和间距。拖动调整单元格大小。我们生成 CSS 代码。' },
        { question: 'CSS Grid 中的 fr 单位是什么？', answer: '分数单位。1fr 2fr 表示第二列是两倍宽。灵活的尺寸。' },
        { question: '如何跨越多个单元格？', answer: '使用 grid-column: span 2 或 grid-row: span 2。我们可视化并生成代码。' },
      ],
    },
  },

  // CSS Flexbox Generator
  {
    slug: 'css-flexbox-generator',
    faqs: {
      en: [
        { question: 'How do I create a Flexbox layout?', answer: 'Set flex direction, justify-content, align-items. Visual preview updates in real-time.' },
        { question: 'What is the difference between justify and align?', answer: 'justify-content: main axis (horizontal in row). align-items: cross axis (vertical in row).' },
        { question: 'How do I center items with Flexbox?', answer: 'justify-content: center and align-items: center. Perfect centering in both directions.' },
      ],
      zh: [
        { question: '如何创建 Flexbox 布局？', answer: '设置 flex 方向、justify-content、align-items。视觉预览实时更新。' },
        { question: 'justify 和 align 有什么区别？', answer: 'justify-content：主轴（行中水平）。align-items：交叉轴（行中垂直）。' },
        { question: '如何使用 Flexbox 居中项目？', answer: 'justify-content: center 和 align-items: center。两个方向完美居中。' },
      ],
    },
  },

  // JWT Generator
  {
    slug: 'jwt-generator',
    faqs: {
      en: [
        { question: 'What is a JWT?', answer: 'JSON Web Token. Encoded token with header, payload, signature. Used for authentication and data exchange.' },
        { question: 'How do I create a JWT?', answer: 'Enter payload data and secret key. We generate signed JWT. Choose algorithm (HS256, RS256).' },
        { question: 'How do I decode a JWT?', answer: 'Paste JWT, we decode and show header and payload. Note: signature verification requires the secret.' },
      ],
      zh: [
        { question: '什么是 JWT？', answer: 'JSON Web Token。带有头部、载荷、签名的编码令牌。用于认证和数据交换。' },
        { question: '如何创建 JWT？', answer: '输入载荷数据和密钥。我们生成签名的 JWT。选择算法（HS256、RS256）。' },
        { question: '如何解码 JWT？', answer: '粘贴 JWT，我们解码并显示头部和载荷。注意：签名验证需要密钥。' },
      ],
    },
  },

  // Cron Explainer
  {
    slug: 'cron-explainer',
    faqs: {
      en: [
        { question: 'How do I understand a cron expression?', answer: 'Paste cron expression. We explain in plain English: "Every day at 3:00 AM" for "0 3 * * *".' },
        { question: 'What do the five fields mean?', answer: 'Minute (0-59), Hour (0-23), Day of Month (1-31), Month (1-12), Day of Week (0-6, 0=Sunday).' },
        { question: 'What does * mean in cron?', answer: '* means "every" or "any". * in hour field means every hour. */5 means every 5 units.' },
      ],
      zh: [
        { question: '如何理解 cron 表达式？', answer: '粘贴 cron 表达式。我们用简单语言解释："每天凌晨 3:00"对应"0 3 * * *"。' },
        { question: '五个字段是什么意思？', answer: '分钟（0-59）、小时（0-23）、月中日（1-31）、月份（1-12）、周中日（0-6，0=周日）。' },
        { question: 'cron 中的 * 是什么意思？', answer: '* 表示"每个"或"任何"。小时字段中的 * 表示每小时。*/5 表示每 5 个单位。' },
      ],
    },
  },

  // JSON to GraphQL
  {
    slug: 'json-to-graphql',
    faqs: {
      en: [
        { question: 'How do I convert JSON to GraphQL schema?', answer: 'Paste JSON data. We generate GraphQL type definitions with proper field types.' },
        { question: 'How are types inferred?', answer: 'Strings→String, numbers→Int/Float, booleans→Boolean, arrays→[Type], objects→custom types.' },
        { question: 'Does it generate queries too?', answer: 'Yes, generates sample queries and mutations based on your data structure.' },
      ],
      zh: [
        { question: '如何将 JSON 转换为 GraphQL 模式？', answer: '粘贴 JSON 数据。我们生成带有正确字段类型的 GraphQL 类型定义。' },
        { question: '类型是如何推断的？', answer: '字符串→String，数字→Int/Float，布尔值→Boolean，数组→[Type]，对象→自定义类型。' },
        { question: '它也生成查询吗？', answer: '是的，根据您的数据结构生成示例查询和变更。' },
      ],
    },
  },

  // SQL to MongoDB
  {
    slug: 'sql-to-mongo',
    faqs: {
      en: [
        { question: 'How do I convert SQL to MongoDB?', answer: 'Paste SQL query. We convert to MongoDB query syntax (find, aggregate, etc.).' },
        { question: 'What SQL operations are supported?', answer: 'SELECT, WHERE, ORDER BY, LIMIT, GROUP BY, JOIN (as $lookup), aggregate functions.' },
        { question: 'How are JOINs converted?', answer: 'SQL JOINs become MongoDB $lookup aggregation stage. We handle inner and left joins.' },
      ],
      zh: [
        { question: '如何将 SQL 转换为 MongoDB？', answer: '粘贴 SQL 查询。我们转换为 MongoDB 查询语法（find、aggregate 等）。' },
        { question: '支持哪些 SQL 操作？', answer: 'SELECT、WHERE、ORDER BY、LIMIT、GROUP BY、JOIN（作为 $lookup）、聚合函数。' },
        { question: 'JOIN 如何转换？', answer: 'SQL JOIN 变成 MongoDB $lookup 聚合阶段。我们处理内连接和左连接。' },
      ],
    },
  },
];
