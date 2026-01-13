/**
 * GEO 优化的工具 FAQ 配置 - 第十批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_10: ToolSpecificFAQ[] = [
  // Email Extractor
  {
    slug: 'email-extractor',
    faqs: {
      en: [
        { question: 'How do I extract emails from text?', answer: 'Paste any text containing email addresses and click Extract. The tool finds all valid email patterns and lists them, removing duplicates.' },
        { question: 'What email formats are detected?', answer: 'Standard formats like user@domain.com, plus addresses with dots, hyphens, underscores, and subdomains. Invalid patterns are filtered out.' },
        { question: 'Can I export the extracted emails?', answer: 'Yes, copy as a comma-separated list, one per line, or download as CSV. Perfect for importing into email tools or spreadsheets.' },
      ],
      zh: [
        { question: '如何从文本中提取电子邮件？', answer: '粘贴包含电子邮件地址的任何文本并点击提取。工具会找到所有有效的电子邮件模式并列出，同时删除重复项。' },
        { question: '可以检测哪些电子邮件格式？', answer: '标准格式如 user@domain.com，以及带点、连字符、下划线和子域名的地址。无效模式会被过滤掉。' },
        { question: '可以导出提取的电子邮件吗？', answer: '是的，可以复制为逗号分隔列表、每行一个，或下载为 CSV。非常适合导入到电子邮件工具或电子表格。' },
      ],
    },
  },

  // URL Extractor
  {
    slug: 'url-extractor',
    faqs: {
      en: [
        { question: 'How do I extract URLs from text?', answer: 'Paste text containing links and click Extract. The tool finds all URLs including http, https, and www patterns.' },
        { question: 'Does it extract URLs from HTML?', answer: 'Yes, it extracts URLs from href attributes, src attributes, and plain text. You can filter by domain or protocol.' },
        { question: 'Can I validate the extracted URLs?', answer: 'Enable validation to check if URLs are accessible. The tool marks broken links and shows HTTP status codes.' },
      ],
      zh: [
        { question: '如何从文本中提取 URL？', answer: '粘贴包含链接的文本并点击提取。工具会找到所有 URL，包括 http、https 和 www 模式。' },
        { question: '可以从 HTML 中提取 URL 吗？', answer: '是的，它从 href 属性、src 属性和纯文本中提取 URL。您可以按域名或协议过滤。' },
        { question: '可以验证提取的 URL 吗？', answer: '启用验证可以检查 URL 是否可访问。工具会标记断开的链接并显示 HTTP 状态码。' },
      ],
    },
  },

  // Phone Number Extractor
  {
    slug: 'phone-extractor',
    faqs: {
      en: [
        { question: 'How do I extract phone numbers from text?', answer: 'Paste text and the tool finds phone numbers in various formats: (123) 456-7890, 123-456-7890, +1 123 456 7890, etc.' },
        { question: 'Does it recognize international formats?', answer: 'Yes, it detects numbers with country codes (+1, +44, +86, etc.) and various local formatting conventions.' },
        { question: 'Can I standardize the output format?', answer: 'Yes, choose output format: E.164 international (+11234567890), national, or keep original formatting.' },
      ],
      zh: [
        { question: '如何从文本中提取电话号码？', answer: '粘贴文本，工具会找到各种格式的电话号码：(123) 456-7890、123-456-7890、+1 123 456 7890 等。' },
        { question: '可以识别国际格式吗？', answer: '是的，它检测带国家代码（+1、+44、+86 等）和各种本地格式约定的号码。' },
        { question: '可以标准化输出格式吗？', answer: '是的，选择输出格式：E.164 国际格式（+11234567890）、国内格式或保持原始格式。' },
      ],
    },
  },

  // IP Extractor
  {
    slug: 'ip-extractor',
    faqs: {
      en: [
        { question: 'How do I extract IP addresses from text?', answer: 'Paste logs, configs, or any text. The tool finds all IPv4 (192.168.1.1) and IPv6 addresses, removing duplicates.' },
        { question: 'Can it distinguish public from private IPs?', answer: 'Yes, enable classification to separate public, private (10.x, 192.168.x, 172.16-31.x), and special IPs (localhost, broadcast).' },
        { question: 'Does it extract IP ranges and CIDR notation?', answer: 'Yes, it recognizes CIDR notation (192.168.1.0/24) and IP ranges. You can expand CIDR to list all IPs in the range.' },
      ],
      zh: [
        { question: '如何从文本中提取 IP 地址？', answer: '粘贴日志、配置或任何文本。工具会找到所有 IPv4（192.168.1.1）和 IPv6 地址，并删除重复项。' },
        { question: '可以区分公网和私网 IP 吗？', answer: '是的，启用分类可以分离公网、私网（10.x、192.168.x、172.16-31.x）和特殊 IP（localhost、广播）。' },
        { question: '可以提取 IP 范围和 CIDR 表示法吗？', answer: '是的，它识别 CIDR 表示法（192.168.1.0/24）和 IP 范围。您可以展开 CIDR 列出范围内的所有 IP。' },
      ],
    },
  },

  // JSON Escape
  {
    slug: 'json-escape',
    faqs: {
      en: [
        { question: 'How do I escape special characters for JSON?', answer: 'Paste your string and click Escape. Quotes become \\", backslashes become \\\\, newlines become \\n, tabs become \\t.' },
        { question: 'When do I need to escape JSON strings?', answer: 'When embedding strings in JSON manually, or when your string contains quotes, backslashes, or control characters that would break JSON syntax.' },
        { question: 'Can I unescape JSON strings?', answer: 'Yes, switch to Unescape mode to convert escaped sequences back to actual characters. Useful when reading JSON string values.' },
      ],
      zh: [
        { question: '如何为 JSON 转义特殊字符？', answer: '粘贴字符串并点击转义。引号变成 \\"，反斜杠变成 \\\\，换行变成 \\n，制表符变成 \\t。' },
        { question: '什么时候需要转义 JSON 字符串？', answer: '手动在 JSON 中嵌入字符串时，或者字符串包含引号、反斜杠或会破坏 JSON 语法的控制字符时。' },
        { question: '可以反转义 JSON 字符串吗？', answer: '是的，切换到反转义模式可以将转义序列转换回实际字符。读取 JSON 字符串值时很有用。' },
      ],
    },
  },

  // HTML Entity Encoder
  {
    slug: 'html-entity-encoder',
    faqs: {
      en: [
        { question: 'What are HTML entities?', answer: 'Special codes representing characters in HTML. < becomes &lt;, > becomes &gt;, & becomes &amp;. Prevents code injection and display issues.' },
        { question: 'How do I encode HTML entities?', answer: 'Paste text with special characters and click Encode. All HTML-sensitive characters are converted to their entity equivalents.' },
        { question: 'Should I encode all characters or just special ones?', answer: 'Usually just special characters (<, >, &, ", \') need encoding. Full encoding (all non-ASCII) is for maximum compatibility with legacy systems.' },
      ],
      zh: [
        { question: '什么是 HTML 实体？', answer: '表示 HTML 中字符的特殊代码。< 变成 &lt;，> 变成 &gt;，& 变成 &amp;。防止代码注入和显示问题。' },
        { question: '如何编码 HTML 实体？', answer: '粘贴包含特殊字符的文本并点击编码。所有 HTML 敏感字符都会转换为其实体等价物。' },
        { question: '应该编码所有字符还是只编码特殊字符？', answer: '通常只需要编码特殊字符（<、>、&、"、\'）。完全编码（所有非 ASCII）用于与遗留系统的最大兼容性。' },
      ],
    },
  },

  // CSS Formatter
  {
    slug: 'css-formatter',
    faqs: {
      en: [
        { question: 'How do I format CSS code online?', answer: 'Paste your CSS and click Format. The tool adds proper indentation, line breaks, and organizes properties for better readability.' },
        { question: 'Can I sort CSS properties?', answer: 'Yes, enable property sorting to organize by type (positioning, box model, typography) or alphabetically within each rule.' },
        { question: 'Does it fix CSS errors?', answer: 'The formatter fixes minor syntax issues like missing semicolons but doesn\'t validate CSS. Use a CSS validator for error checking.' },
      ],
      zh: [
        { question: '如何在线格式化 CSS 代码？', answer: '粘贴 CSS 并点击格式化。工具会添加正确的缩进、换行并组织属性以提高可读性。' },
        { question: '可以对 CSS 属性排序吗？', answer: '是的，启用属性排序可以按类型（定位、盒模型、排版）或在每个规则内按字母顺序组织。' },
        { question: '会修复 CSS 错误吗？', answer: '格式化器修复小的语法问题如缺少分号，但不验证 CSS。使用 CSS 验证器进行错误检查。' },
      ],
    },
  },

  // JavaScript Formatter
  {
    slug: 'javascript-formatter',
    faqs: {
      en: [
        { question: 'How do I format JavaScript code online?', answer: 'Paste your JavaScript and click Format. The tool applies consistent indentation, spacing, and line breaks following best practices.' },
        { question: 'What style options are available?', answer: 'Choose indent size (2 or 4 spaces), single or double quotes, semicolons or no semicolons, and trailing commas. Matches popular style guides.' },
        { question: 'Does it work with modern JavaScript?', answer: 'Yes, supports ES6+ features including arrow functions, destructuring, template literals, async/await, and optional chaining.' },
      ],
      zh: [
        { question: '如何在线格式化 JavaScript 代码？', answer: '粘贴 JavaScript 并点击格式化。工具会按照最佳实践应用一致的缩进、间距和换行。' },
        { question: '有哪些样式选项可用？', answer: '选择缩进大小（2 或 4 个空格）、单引号或双引号、分号或无分号、尾随逗号。匹配流行的样式指南。' },
        { question: '支持现代 JavaScript 吗？', answer: '是的，支持 ES6+ 特性，包括箭头函数、解构、模板字面量、async/await 和可选链。' },
      ],
    },
  },

  // Python Formatter
  {
    slug: 'python-formatter',
    faqs: {
      en: [
        { question: 'How do I format Python code online?', answer: 'Paste your Python code and click Format. The tool applies PEP 8 style guidelines with proper indentation and spacing.' },
        { question: 'Does it follow PEP 8?', answer: 'Yes, formatting follows PEP 8 conventions: 4-space indentation, line length limits, spacing around operators, and blank lines between functions.' },
        { question: 'Can it fix indentation errors?', answer: 'It normalizes indentation to 4 spaces but can\'t fix logical indentation errors. Python\'s indentation defines code blocks, so structure must be correct.' },
      ],
      zh: [
        { question: '如何在线格式化 Python 代码？', answer: '粘贴 Python 代码并点击格式化。工具会应用 PEP 8 样式指南，包括正确的缩进和间距。' },
        { question: '遵循 PEP 8 吗？', answer: '是的，格式化遵循 PEP 8 约定：4 空格缩进、行长度限制、运算符周围的间距和函数之间的空行。' },
        { question: '可以修复缩进错误吗？', answer: '它将缩进规范化为 4 个空格，但无法修复逻辑缩进错误。Python 的缩进定义代码块，所以结构必须正确。' },
      ],
    },
  },

  // SQL to CSV
  {
    slug: 'sql-to-csv',
    faqs: {
      en: [
        { question: 'How do I convert SQL results to CSV?', answer: 'Paste SQL query results (table format) and click Convert. The tool extracts columns and rows into proper CSV format.' },
        { question: 'What SQL output formats are supported?', answer: 'MySQL, PostgreSQL, SQL Server, and SQLite output formats. Also works with tab-separated and pipe-separated table outputs.' },
        { question: 'Can I convert INSERT statements to CSV?', answer: 'Yes, paste INSERT INTO statements and we extract the values into CSV rows. Useful for migrating data between systems.' },
      ],
      zh: [
        { question: '如何将 SQL 结果转换为 CSV？', answer: '粘贴 SQL 查询结果（表格格式）并点击转换。工具会将列和行提取为正确的 CSV 格式。' },
        { question: '支持哪些 SQL 输出格式？', answer: 'MySQL、PostgreSQL、SQL Server 和 SQLite 输出格式。也适用于制表符分隔和管道分隔的表格输出。' },
        { question: '可以将 INSERT 语句转换为 CSV 吗？', answer: '是的，粘贴 INSERT INTO 语句，我们会将值提取为 CSV 行。用于在系统之间迁移数据很有用。' },
      ],
    },
  },
];
