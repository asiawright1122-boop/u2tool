/**
 * GEO 优化的工具 FAQ 配置 - 第三十批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_30: ToolSpecificFAQ[] = [
  // Cron Generator
  {
    slug: 'cron-generator',
    faqs: {
      en: [
        { question: 'How do I create a cron expression?', answer: 'Select schedule type (daily, weekly, monthly), set time and day. We generate the cron expression automatically.' },
        { question: 'What is cron expression format?', answer: 'Five fields: minute (0-59), hour (0-23), day of month (1-31), month (1-12), day of week (0-6). * means any value.' },
        { question: 'How do I run a job every 5 minutes?', answer: 'Use */5 * * * * - the */5 in minute field means every 5 minutes. We show next run times to verify.' },
      ],
      zh: [
        { question: '如何创建 cron 表达式？', answer: '选择计划类型（每天、每周、每月），设置时间和日期。我们自动生成 cron 表达式。' },
        { question: 'cron 表达式格式是什么？', answer: '五个字段：分钟（0-59）、小时（0-23）、月中日（1-31）、月份（1-12）、周中日（0-6）。* 表示任意值。' },
        { question: '如何每 5 分钟运行一次任务？', answer: '使用 */5 * * * * - 分钟字段中的 */5 表示每 5 分钟。我们显示下次运行时间以供验证。' },
      ],
    },
  },

  // Case Converter
  {
    slug: 'case-converter',
    faqs: {
      en: [
        { question: 'What case formats are supported?', answer: 'UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and more.' },
        { question: 'How do I convert to camelCase?', answer: 'Paste text, select camelCase. Words are joined, first word lowercase, subsequent words capitalized: myVariableName.' },
        { question: 'What is the difference between camelCase and PascalCase?', answer: 'camelCase: first word lowercase (myVariable). PascalCase: all words capitalized (MyVariable). Used in different programming conventions.' },
      ],
      zh: [
        { question: '支持哪些大小写格式？', answer: '大写、小写、标题大小写、句子大小写、驼峰命名、帕斯卡命名、蛇形命名、短横线命名等。' },
        { question: '如何转换为驼峰命名？', answer: '粘贴文本，选择驼峰命名。单词连接，第一个单词小写，后续单词首字母大写：myVariableName。' },
        { question: '驼峰命名和帕斯卡命名有什么区别？', answer: '驼峰命名：第一个单词小写（myVariable）。帕斯卡命名：所有单词首字母大写（MyVariable）。用于不同的编程约定。' },
      ],
    },
  },

  // Text to Slug
  {
    slug: 'text-to-slug',
    faqs: {
      en: [
        { question: 'What is a URL slug?', answer: 'A slug is the URL-friendly version of a title. "My Blog Post!" becomes "my-blog-post". Used in SEO-friendly URLs.' },
        { question: 'How are special characters handled?', answer: 'Spaces become hyphens, special characters removed, accents converted (é→e), all lowercase. Clean, readable URLs.' },
        { question: 'Why are slugs important for SEO?', answer: 'Descriptive slugs help search engines understand page content. "my-blog-post" is better than "post?id=123" for rankings.' },
      ],
      zh: [
        { question: '什么是 URL slug？', answer: 'Slug 是标题的 URL 友好版本。"我的博客文章！"变成"my-blog-post"。用于 SEO 友好的 URL。' },
        { question: '特殊字符如何处理？', answer: '空格变成连字符，特殊字符被移除，重音符号转换（é→e），全部小写。干净、可读的 URL。' },
        { question: '为什么 slug 对 SEO 很重要？', answer: '描述性的 slug 帮助搜索引擎理解页面内容。"my-blog-post"比"post?id=123"对排名更好。' },
      ],
    },
  },

  // Chinese Converter
  {
    slug: 'chinese-converter',
    faqs: {
      en: [
        { question: 'What does this tool convert?', answer: 'Converts between Simplified and Traditional Chinese characters. 简体 ↔ 繁體. Useful for cross-strait communication.' },
        { question: 'Is the conversion accurate?', answer: 'Yes, uses comprehensive character mapping. Handles one-to-many mappings (发→發/髮) based on context when possible.' },
        { question: 'Can I convert large documents?', answer: 'Yes, paste any amount of text. Processing happens locally in browser. No file size limits.' },
      ],
      zh: [
        { question: '这个工具转换什么？', answer: '在简体中文和繁体中文之间转换。简体 ↔ 繁體。对于两岸交流很有用。' },
        { question: '转换准确吗？', answer: '是的，使用全面的字符映射。尽可能根据上下文处理一对多映射（发→發/髮）。' },
        { question: '可以转换大型文档吗？', answer: '是的，粘贴任意数量的文本。处理在浏览器本地进行。没有文件大小限制。' },
      ],
    },
  },

  // Pinyin Converter
  {
    slug: 'pinyin-converter',
    faqs: {
      en: [
        { question: 'What is Pinyin?', answer: 'Pinyin is the romanization system for Chinese characters. 中文 → zhōng wén. Shows pronunciation with tone marks.' },
        { question: 'What tone formats are available?', answer: 'Tone marks (zhōng), tone numbers (zhong1), or no tones (zhong). Choose based on your learning needs.' },
        { question: 'Does it handle polyphones?', answer: 'Yes, common polyphones are handled contextually. 行 can be háng (row) or xíng (walk) based on usage.' },
      ],
      zh: [
        { question: '什么是拼音？', answer: '拼音是汉字的罗马化系统。中文 → zhōng wén。显示带声调标记的发音。' },
        { question: '有哪些声调格式？', answer: '声调标记（zhōng）、声调数字（zhong1）或无声调（zhong）。根据您的学习需求选择。' },
        { question: '它能处理多音字吗？', answer: '是的，常见的多音字根据上下文处理。行可以是 háng（行列）或 xíng（行走），取决于用法。' },
      ],
    },
  },

  // Number Base Converter
  {
    slug: 'number-base-converter',
    faqs: {
      en: [
        { question: 'What number bases are supported?', answer: 'Binary (2), Octal (8), Decimal (10), Hexadecimal (16), and custom bases 2-36. Convert between any bases.' },
        { question: 'How do I convert hex to binary?', answer: 'Enter hex value, select base 16 as input, base 2 as output. Example: FF → 11111111.' },
        { question: 'What is base 36?', answer: 'Uses 0-9 and A-Z for 36 digits. Compact representation for large numbers. Often used in URL shorteners.' },
      ],
      zh: [
        { question: '支持哪些进制？', answer: '二进制（2）、八进制（8）、十进制（10）、十六进制（16）和自定义进制 2-36。在任意进制之间转换。' },
        { question: '如何将十六进制转换为二进制？', answer: '输入十六进制值，选择基数 16 作为输入，基数 2 作为输出。例如：FF → 11111111。' },
        { question: '什么是 36 进制？', answer: '使用 0-9 和 A-Z 共 36 个数字。大数字的紧凑表示。常用于 URL 缩短器。' },
      ],
    },
  },

  // JSON Path Tester
  {
    slug: 'json-path-tester',
    faqs: {
      en: [
        { question: 'What is JSONPath?', answer: 'JSONPath is a query language for JSON, like XPath for XML. Extract specific data from complex JSON structures.' },
        { question: 'How do I select nested values?', answer: 'Use dot notation: $.store.book[0].title. Or bracket notation: $["store"]["book"][0]["title"]. Both work.' },
        { question: 'How do I filter arrays?', answer: 'Use filter expressions: $.store.book[?(@.price<10)] selects books under $10. Powerful for data extraction.' },
      ],
      zh: [
        { question: '什么是 JSONPath？', answer: 'JSONPath 是 JSON 的查询语言，类似于 XML 的 XPath。从复杂的 JSON 结构中提取特定数据。' },
        { question: '如何选择嵌套值？', answer: '使用点表示法：$.store.book[0].title。或括号表示法：$["store"]["book"][0]["title"]。两者都有效。' },
        { question: '如何过滤数组？', answer: '使用过滤表达式：$.store.book[?(@.price<10)] 选择价格低于 10 美元的书籍。强大的数据提取功能。' },
      ],
    },
  },

  // Aspect Ratio Calculator
  {
    slug: 'aspect-ratio',
    faqs: {
      en: [
        { question: 'What is aspect ratio?', answer: 'Aspect ratio is width:height proportion. 16:9 is widescreen, 4:3 is standard, 1:1 is square. Important for images and video.' },
        { question: 'How do I calculate new dimensions?', answer: 'Enter original dimensions and desired width or height. We calculate the other dimension maintaining aspect ratio.' },
        { question: 'What are common aspect ratios?', answer: '16:9 (HD video), 4:3 (old TV), 21:9 (ultrawide), 1:1 (Instagram square), 9:16 (mobile video/stories).' },
      ],
      zh: [
        { question: '什么是宽高比？', answer: '宽高比是宽度:高度的比例。16:9 是宽屏，4:3 是标准，1:1 是正方形。对图像和视频很重要。' },
        { question: '如何计算新尺寸？', answer: '输入原始尺寸和所需的宽度或高度。我们计算另一个尺寸以保持宽高比。' },
        { question: '常见的宽高比有哪些？', answer: '16:9（高清视频）、4:3（旧电视）、21:9（超宽屏）、1:1（Instagram 正方形）、9:16（移动视频/故事）。' },
      ],
    },
  },

  // CSS Beautifier
  {
    slug: 'css-beautifier',
    faqs: {
      en: [
        { question: 'What does CSS beautifier do?', answer: 'Formats minified or messy CSS into readable code with proper indentation, line breaks, and consistent spacing.' },
        { question: 'Can I customize the formatting?', answer: 'Yes, choose indent size (2 or 4 spaces), brace style, and whether to sort properties alphabetically.' },
        { question: 'Does it validate CSS?', answer: 'Basic validation included. Highlights syntax errors. For full validation, use dedicated CSS validators.' },
      ],
      zh: [
        { question: 'CSS 美化器做什么？', answer: '将压缩或混乱的 CSS 格式化为可读代码，具有正确的缩进、换行和一致的间距。' },
        { question: '可以自定义格式吗？', answer: '是的，选择缩进大小（2 或 4 个空格）、大括号样式，以及是否按字母顺序排序属性。' },
        { question: '它验证 CSS 吗？', answer: '包含基本验证。高亮显示语法错误。如需完整验证，请使用专用的 CSS 验证器。' },
      ],
    },
  },

  // JS Beautifier
  {
    slug: 'js-beautifier',
    faqs: {
      en: [
        { question: 'What does JS beautifier do?', answer: 'Formats minified or messy JavaScript into readable code with proper indentation and line breaks.' },
        { question: 'Does it support TypeScript?', answer: 'Yes, handles TypeScript syntax including type annotations, interfaces, and generics.' },
        { question: 'Can it unminify obfuscated code?', answer: 'Partially. Beautifies structure but cannot restore original variable names from obfuscated code.' },
      ],
      zh: [
        { question: 'JS 美化器做什么？', answer: '将压缩或混乱的 JavaScript 格式化为可读代码，具有正确的缩进和换行。' },
        { question: '它支持 TypeScript 吗？', answer: '是的，处理 TypeScript 语法，包括类型注解、接口和泛型。' },
        { question: '它能反混淆代码吗？', answer: '部分可以。美化结构但无法从混淆代码中恢复原始变量名。' },
      ],
    },
  },
];
