/**
 * GEO 优化的工具 FAQ 配置 - 第三十二批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_32: ToolSpecificFAQ[] = [
  // HTML Table Generator
  {
    slug: 'html-table-generator',
    faqs: {
      en: [
        { question: 'How do I create an HTML table?', answer: 'Set rows and columns, enter data in cells. We generate clean HTML table code with proper tags.' },
        { question: 'Can I add styling to the table?', answer: 'Yes, add CSS classes, inline styles, or use our preset themes. Includes border, padding, and color options.' },
        { question: 'Can I import data from Excel?', answer: 'Yes, paste Excel data directly. We auto-detect columns and rows, converting to HTML table format.' },
      ],
      zh: [
        { question: '如何创建 HTML 表格？', answer: '设置行和列，在单元格中输入数据。我们生成带有正确标签的干净 HTML 表格代码。' },
        { question: '可以为表格添加样式吗？', answer: '是的，添加 CSS 类、内联样式或使用我们的预设主题。包括边框、内边距和颜色选项。' },
        { question: '可以从 Excel 导入数据吗？', answer: '是的，直接粘贴 Excel 数据。我们自动检测列和行，转换为 HTML 表格格式。' },
      ],
    },
  },

  // JSON Schema Validator
  {
    slug: 'json-schema-validator',
    faqs: {
      en: [
        { question: 'What is JSON Schema validation?', answer: 'JSON Schema defines the structure of JSON data. Validation checks if data matches the schema rules.' },
        { question: 'What schema versions are supported?', answer: 'Draft-04, Draft-06, Draft-07, and Draft 2019-09. Choose based on your project requirements.' },
        { question: 'How do I fix validation errors?', answer: 'Errors show exact path and issue. Common fixes: add required fields, fix data types, match patterns.' },
      ],
      zh: [
        { question: '什么是 JSON Schema 验证？', answer: 'JSON Schema 定义 JSON 数据的结构。验证检查数据是否符合模式规则。' },
        { question: '支持哪些模式版本？', answer: 'Draft-04、Draft-06、Draft-07 和 Draft 2019-09。根据您的项目需求选择。' },
        { question: '如何修复验证错误？', answer: '错误显示确切的路径和问题。常见修复：添加必需字段、修复数据类型、匹配模式。' },
      ],
    },
  },

  // Regex Patterns Library
  {
    slug: 'regex-patterns',
    faqs: {
      en: [
        { question: 'What regex patterns are available?', answer: 'Email, URL, phone, IP address, date, credit card, password validation, and 50+ more common patterns.' },
        { question: 'How do I use these patterns?', answer: 'Copy pattern, paste into your code. Each pattern includes explanation and test examples.' },
        { question: 'Can I customize patterns?', answer: 'Yes, patterns are starting points. Modify to match your specific requirements and edge cases.' },
      ],
      zh: [
        { question: '有哪些正则表达式模式可用？', answer: '电子邮件、URL、电话、IP 地址、日期、信用卡、密码验证等 50 多种常见模式。' },
        { question: '如何使用这些模式？', answer: '复制模式，粘贴到您的代码中。每个模式都包含解释和测试示例。' },
        { question: '可以自定义模式吗？', answer: '是的，模式是起点。修改以匹配您的特定需求和边缘情况。' },
      ],
    },
  },

  // Byte Counter
  {
    slug: 'byte-counter',
    faqs: {
      en: [
        { question: 'How do I count bytes in text?', answer: 'Paste text, we count bytes in UTF-8, UTF-16, and ASCII encodings. Shows character vs byte count difference.' },
        { question: 'Why do byte counts differ from character counts?', answer: 'UTF-8 uses 1-4 bytes per character. ASCII is 1 byte. Emoji and Chinese characters use multiple bytes.' },
        { question: 'Why is byte count important?', answer: 'Database fields, API limits, and file sizes are often in bytes. Knowing byte count prevents truncation issues.' },
      ],
      zh: [
        { question: '如何计算文本中的字节数？', answer: '粘贴文本，我们计算 UTF-8、UTF-16 和 ASCII 编码的字节数。显示字符数与字节数的差异。' },
        { question: '为什么字节数与字符数不同？', answer: 'UTF-8 每个字符使用 1-4 个字节。ASCII 是 1 个字节。表情符号和中文字符使用多个字节。' },
        { question: '为什么字节数很重要？', answer: '数据库字段、API 限制和文件大小通常以字节为单位。了解字节数可以防止截断问题。' },
      ],
    },
  },

  // JSON to TypeScript
  {
    slug: 'json-to-typescript',
    faqs: {
      en: [
        { question: 'How do I convert JSON to TypeScript types?', answer: 'Paste JSON data, we generate TypeScript interfaces. Handles nested objects, arrays, and optional fields.' },
        { question: 'Does it handle complex JSON structures?', answer: 'Yes, nested objects become nested interfaces. Arrays are typed. Union types for mixed arrays.' },
        { question: 'Can I customize the generated types?', answer: 'Yes, set interface name prefix, choose between interface and type, add export keywords.' },
      ],
      zh: [
        { question: '如何将 JSON 转换为 TypeScript 类型？', answer: '粘贴 JSON 数据，我们生成 TypeScript 接口。处理嵌套对象、数组和可选字段。' },
        { question: '它能处理复杂的 JSON 结构吗？', answer: '是的，嵌套对象变成嵌套接口。数组被类型化。混合数组使用联合类型。' },
        { question: '可以自定义生成的类型吗？', answer: '是的，设置接口名称前缀，在 interface 和 type 之间选择，添加 export 关键字。' },
      ],
    },
  },

  // SVG Optimizer
  {
    slug: 'svg-optimizer',
    faqs: {
      en: [
        { question: 'How do I optimize SVG files?', answer: 'Upload or paste SVG. We remove unnecessary metadata, comments, and whitespace. Typically 30-60% size reduction.' },
        { question: 'What optimizations are applied?', answer: 'Remove editor metadata, merge paths, simplify transforms, round numbers, remove hidden elements.' },
        { question: 'Will optimization affect SVG appearance?', answer: 'No, visual output is identical. Only redundant data is removed. Preview before/after to verify.' },
      ],
      zh: [
        { question: '如何优化 SVG 文件？', answer: '上传或粘贴 SVG。我们删除不必要的元数据、注释和空白。通常减少 30-60% 的大小。' },
        { question: '应用了哪些优化？', answer: '删除编辑器元数据、合并路径、简化变换、四舍五入数字、删除隐藏元素。' },
        { question: '优化会影响 SVG 外观吗？', answer: '不会，视觉输出相同。只删除冗余数据。预览前后对比以验证。' },
      ],
    },
  },

  // JSON Diff
  {
    slug: 'json-diff',
    faqs: {
      en: [
        { question: 'How do I compare two JSON files?', answer: 'Paste JSON in both panels. We highlight additions (green), deletions (red), and modifications (yellow).' },
        { question: 'Does it handle nested differences?', answer: 'Yes, shows differences at all nesting levels. Expandable tree view for complex structures.' },
        { question: 'Can I ignore certain fields?', answer: 'Yes, specify fields to ignore (like timestamps, IDs). Useful for comparing data without metadata.' },
      ],
      zh: [
        { question: '如何比较两个 JSON 文件？', answer: '在两个面板中粘贴 JSON。我们高亮显示添加（绿色）、删除（红色）和修改（黄色）。' },
        { question: '它能处理嵌套差异吗？', answer: '是的，显示所有嵌套级别的差异。复杂结构的可展开树视图。' },
        { question: '可以忽略某些字段吗？', answer: '是的，指定要忽略的字段（如时间戳、ID）。用于比较不含元数据的数据。' },
      ],
    },
  },

  // Base32 Encoder/Decoder
  {
    slug: 'base32',
    faqs: {
      en: [
        { question: 'What is Base32 encoding?', answer: 'Base32 uses 32 characters (A-Z, 2-7) to encode binary data. More human-readable than Base64, used in TOTP.' },
        { question: 'When should I use Base32 vs Base64?', answer: 'Base32 for case-insensitive systems, manual entry (TOTP secrets). Base64 for efficiency when case matters.' },
        { question: 'How do I decode Base32?', answer: 'Paste Base32 string, select decode mode. Original data is restored. Handles padding automatically.' },
      ],
      zh: [
        { question: '什么是 Base32 编码？', answer: 'Base32 使用 32 个字符（A-Z、2-7）来编码二进制数据。比 Base64 更易读，用于 TOTP。' },
        { question: '什么时候应该使用 Base32 而不是 Base64？', answer: 'Base32 用于不区分大小写的系统、手动输入（TOTP 密钥）。Base64 在区分大小写时效率更高。' },
        { question: '如何解码 Base32？', answer: '粘贴 Base32 字符串，选择解码模式。原始数据被恢复。自动处理填充。' },
      ],
    },
  },

  // CSS Unit Converter
  {
    slug: 'css-unit-converter',
    faqs: {
      en: [
        { question: 'What CSS units can I convert?', answer: 'px, em, rem, %, vw, vh, pt, cm, mm, in. Enter value and base font size for accurate conversion.' },
        { question: 'How do I convert px to rem?', answer: 'Enter px value and root font size (default 16px). 16px = 1rem. We calculate the rem equivalent.' },
        { question: 'Why use rem instead of px?', answer: 'rem scales with user font preferences, improving accessibility. px is fixed, ignoring user settings.' },
      ],
      zh: [
        { question: '可以转换哪些 CSS 单位？', answer: 'px、em、rem、%、vw、vh、pt、cm、mm、in。输入值和基础字体大小以进行准确转换。' },
        { question: '如何将 px 转换为 rem？', answer: '输入 px 值和根字体大小（默认 16px）。16px = 1rem。我们计算 rem 等效值。' },
        { question: '为什么使用 rem 而不是 px？', answer: 'rem 随用户字体偏好缩放，提高可访问性。px 是固定的，忽略用户设置。' },
      ],
    },
  },

  // Text Statistics
  {
    slug: 'text-statistics',
    faqs: {
      en: [
        { question: 'What statistics are calculated?', answer: 'Characters, words, sentences, paragraphs, reading time, speaking time, and readability scores.' },
        { question: 'How is reading time calculated?', answer: 'Average reading speed is 200-250 words per minute. We calculate based on word count and complexity.' },
        { question: 'What are readability scores?', answer: 'Flesch-Kincaid, Gunning Fog, SMOG index. Higher scores mean easier to read. Aim for grade 8-10 for general audience.' },
      ],
      zh: [
        { question: '计算哪些统计数据？', answer: '字符、单词、句子、段落、阅读时间、朗读时间和可读性分数。' },
        { question: '阅读时间是如何计算的？', answer: '平均阅读速度是每分钟 200-250 个单词。我们根据单词数和复杂性计算。' },
        { question: '什么是可读性分数？', answer: 'Flesch-Kincaid、Gunning Fog、SMOG 指数。分数越高越容易阅读。一般受众目标是 8-10 年级。' },
      ],
    },
  },
];
