/**
 * GEO 优化的工具 FAQ 配置 - 第四十批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_40: ToolSpecificFAQ[] = [
  // MIME Type Lookup
  {
    slug: 'mime-type-lookup',
    faqs: {
      en: [
        { question: 'What is a MIME type?', answer: 'Multipurpose Internet Mail Extensions. Identifies file type. text/html, image/png, application/json.' },
        { question: 'How do I find MIME type for a file?', answer: 'Enter file extension (.pdf, .jpg). We show the correct MIME type to use.' },
        { question: 'Why are MIME types important?', answer: 'Servers use them to tell browsers how to handle files. Wrong MIME type = wrong behavior.' },
      ],
      zh: [
        { question: '什么是 MIME 类型？', answer: '多用途互联网邮件扩展。标识文件类型。text/html、image/png、application/json。' },
        { question: '如何找到文件的 MIME 类型？', answer: '输入文件扩展名（.pdf、.jpg）。我们显示要使用的正确 MIME 类型。' },
        { question: '为什么 MIME 类型很重要？', answer: '服务器使用它们告诉浏览器如何处理文件。错误的 MIME 类型 = 错误的行为。' },
      ],
    },
  },

  // HTTP Status Codes Reference
  {
    slug: 'http-status-codes',
    faqs: {
      en: [
        { question: 'What are HTTP status code categories?', answer: '1xx informational, 2xx success, 3xx redirect, 4xx client error, 5xx server error.' },
        { question: 'What is the most common success code?', answer: '200 OK for successful requests. 201 Created for POST creating resources. 204 No Content for DELETE.' },
        { question: 'What does 500 Internal Server Error mean?', answer: 'Server encountered unexpected condition. Check server logs. Not a client-side issue.' },
      ],
      zh: [
        { question: 'HTTP 状态码类别是什么？', answer: '1xx 信息性，2xx 成功，3xx 重定向，4xx 客户端错误，5xx 服务器错误。' },
        { question: '最常见的成功代码是什么？', answer: '200 OK 用于成功请求。201 Created 用于 POST 创建资源。204 No Content 用于 DELETE。' },
        { question: '500 内部服务器错误是什么意思？', answer: '服务器遇到意外情况。检查服务器日志。不是客户端问题。' },
      ],
    },
  },

  // String Obfuscator
  {
    slug: 'string-obfuscator',
    faqs: {
      en: [
        { question: 'What is string obfuscation?', answer: 'Making strings harder to read/find in code. Encodes to hex, unicode escapes, or custom encoding.' },
        { question: 'Why obfuscate strings?', answer: 'Hide sensitive strings (API keys, URLs) from casual inspection. Not true security, just obscurity.' },
        { question: 'Can obfuscated strings be reversed?', answer: 'Yes, obfuscation is reversible. For real security, use encryption, not obfuscation.' },
      ],
      zh: [
        { question: '什么是字符串混淆？', answer: '使字符串在代码中更难阅读/查找。编码为十六进制、unicode 转义或自定义编码。' },
        { question: '为什么要混淆字符串？', answer: '隐藏敏感字符串（API 密钥、URL）以防止随意检查。不是真正的安全，只是模糊。' },
        { question: '混淆的字符串可以逆转吗？', answer: '是的，混淆是可逆的。要真正安全，使用加密，而不是混淆。' },
      ],
    },
  },

  // Text Cleaner
  {
    slug: 'text-cleaner',
    faqs: {
      en: [
        { question: 'What does text cleaner do?', answer: 'Removes extra whitespace, special characters, HTML tags, line breaks. Cleans messy text.' },
        { question: 'Can I keep some formatting?', answer: 'Yes, choose what to remove: extra spaces, line breaks, HTML, special chars. Selective cleaning.' },
        { question: 'Does it fix encoding issues?', answer: 'Yes, can fix common encoding problems like smart quotes, em dashes, and special characters.' },
      ],
      zh: [
        { question: '文本清理器做什么？', answer: '删除多余的空白、特殊字符、HTML 标签、换行符。清理混乱的文本。' },
        { question: '可以保留一些格式吗？', answer: '是的，选择要删除的内容：多余空格、换行符、HTML、特殊字符。选择性清理。' },
        { question: '它能修复编码问题吗？', answer: '是的，可以修复常见的编码问题，如智能引号、破折号和特殊字符。' },
      ],
    },
  },

  // SQL Generator
  {
    slug: 'sql-generator',
    faqs: {
      en: [
        { question: 'How do I generate SQL queries?', answer: 'Select operation (SELECT, INSERT, UPDATE, DELETE), choose columns and conditions. We build the query.' },
        { question: 'What SQL dialects are supported?', answer: 'MySQL, PostgreSQL, SQLite, SQL Server, Oracle. Syntax differences handled automatically.' },
        { question: 'Can I generate complex queries?', answer: 'Yes, JOINs, subqueries, GROUP BY, HAVING, ORDER BY. Build step by step.' },
      ],
      zh: [
        { question: '如何生成 SQL 查询？', answer: '选择操作（SELECT、INSERT、UPDATE、DELETE），选择列和条件。我们构建查询。' },
        { question: '支持哪些 SQL 方言？', answer: 'MySQL、PostgreSQL、SQLite、SQL Server、Oracle。自动处理语法差异。' },
        { question: '可以生成复杂查询吗？', answer: '是的，JOIN、子查询、GROUP BY、HAVING、ORDER BY。逐步构建。' },
      ],
    },
  },

  // htaccess to Nginx Converter
  {
    slug: 'htaccess-to-nginx',
    faqs: {
      en: [
        { question: 'Why convert htaccess to Nginx?', answer: 'Nginx doesn\'t use .htaccess. When migrating from Apache, rules need conversion.' },
        { question: 'What rules can be converted?', answer: 'Redirects, rewrites, access control, MIME types, caching headers. Most common rules supported.' },
        { question: 'Are all htaccess features supported in Nginx?', answer: 'Most, but not all. Some Apache modules have no Nginx equivalent. We note unsupported rules.' },
      ],
      zh: [
        { question: '为什么要将 htaccess 转换为 Nginx？', answer: 'Nginx 不使用 .htaccess。从 Apache 迁移时，规则需要转换。' },
        { question: '可以转换哪些规则？', answer: '重定向、重写、访问控制、MIME 类型、缓存头。支持大多数常见规则。' },
        { question: 'Nginx 支持所有 htaccess 功能吗？', answer: '大多数，但不是全部。某些 Apache 模块没有 Nginx 等效项。我们注明不支持的规则。' },
      ],
    },
  },

  // JS Obfuscator
  {
    slug: 'js-obfuscator',
    faqs: {
      en: [
        { question: 'What is JavaScript obfuscation?', answer: 'Transforms code to be hard to read/understand. Renames variables, encodes strings, adds dead code.' },
        { question: 'Does obfuscation protect my code?', answer: 'Makes reverse engineering harder, not impossible. Determined attackers can still analyze. Use for deterrence.' },
        { question: 'Will obfuscation affect performance?', answer: 'Slightly. More obfuscation = larger file size and slower execution. Balance security vs performance.' },
      ],
      zh: [
        { question: '什么是 JavaScript 混淆？', answer: '将代码转换为难以阅读/理解的形式。重命名变量、编码字符串、添加死代码。' },
        { question: '混淆能保护我的代码吗？', answer: '使逆向工程更难，但不是不可能。有决心的攻击者仍然可以分析。用于威慑。' },
        { question: '混淆会影响性能吗？', answer: '略微影响。更多混淆 = 更大的文件大小和更慢的执行。平衡安全性与性能。' },
      ],
    },
  },

  // SVG to Image Converter
  {
    slug: 'svg-to-image',
    faqs: {
      en: [
        { question: 'How do I convert SVG to PNG?', answer: 'Upload or paste SVG. Set output size and background. Download as PNG, JPEG, or WebP.' },
        { question: 'Can I set custom dimensions?', answer: 'Yes, specify width and height. SVG scales perfectly to any size without quality loss.' },
        { question: 'What about transparent backgrounds?', answer: 'PNG supports transparency. JPEG doesn\'t (uses white). Choose format based on needs.' },
      ],
      zh: [
        { question: '如何将 SVG 转换为 PNG？', answer: '上传或粘贴 SVG。设置输出大小和背景。下载为 PNG、JPEG 或 WebP。' },
        { question: '可以设置自定义尺寸吗？', answer: '是的，指定宽度和高度。SVG 可以完美缩放到任何大小而不损失质量。' },
        { question: '透明背景呢？', answer: 'PNG 支持透明度。JPEG 不支持（使用白色）。根据需要选择格式。' },
      ],
    },
  },

  // Hex Base64 Converter
  {
    slug: 'hex-base64-converter',
    faqs: {
      en: [
        { question: 'How do I convert hex to Base64?', answer: 'Enter hex string (like "48656c6c6f"). We convert to Base64 encoding.' },
        { question: 'What is the relationship between hex and Base64?', answer: 'Both represent binary data as text. Hex uses 16 chars (0-F), Base64 uses 64 chars. Base64 is more compact.' },
        { question: 'When would I need this conversion?', answer: 'Working with cryptographic data, binary protocols, or converting between different encoding formats.' },
      ],
      zh: [
        { question: '如何将十六进制转换为 Base64？', answer: '输入十六进制字符串（如"48656c6c6f"）。我们转换为 Base64 编码。' },
        { question: '十六进制和 Base64 之间有什么关系？', answer: '两者都将二进制数据表示为文本。十六进制使用 16 个字符（0-F），Base64 使用 64 个字符。Base64 更紧凑。' },
        { question: '什么时候需要这种转换？', answer: '处理加密数据、二进制协议或在不同编码格式之间转换时。' },
      ],
    },
  },

  // PDF to Base64
  {
    slug: 'pdf-to-base64',
    faqs: {
      en: [
        { question: 'How do I convert PDF to Base64?', answer: 'Upload PDF file. We encode to Base64 string. Copy or download the result.' },
        { question: 'Why convert PDF to Base64?', answer: 'Embed in JSON/XML, send via API, store in database as text, include in data URLs.' },
        { question: 'Is there a file size limit?', answer: 'Processing is local, so browser memory is the limit. Large PDFs may be slow. Typically up to 50MB.' },
      ],
      zh: [
        { question: '如何将 PDF 转换为 Base64？', answer: '上传 PDF 文件。我们编码为 Base64 字符串。复制或下载结果。' },
        { question: '为什么要将 PDF 转换为 Base64？', answer: '嵌入 JSON/XML、通过 API 发送、作为文本存储在数据库中、包含在数据 URL 中。' },
        { question: '有文件大小限制吗？', answer: '处理是本地的，所以浏览器内存是限制。大型 PDF 可能较慢。通常最多 50MB。' },
      ],
    },
  },
];
