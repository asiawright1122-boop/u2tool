/**
 * GEO 优化的工具 FAQ 配置 - 第九批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_9: ToolSpecificFAQ[] = [
  // JSON to XML
  {
    slug: 'json-to-xml',
    faqs: {
      en: [
        { question: 'How do I convert JSON to XML online?', answer: 'Paste your JSON data and click Convert. The tool transforms JSON objects to XML elements, arrays to repeated elements, and preserves data types.' },
        { question: 'How are JSON arrays converted to XML?', answer: 'Arrays become repeated XML elements with the same tag name. You can customize the wrapper element name and item element names.' },
        { question: 'Can I convert XML back to JSON?', answer: 'Yes, switch to XML to JSON mode. The tool handles attributes, text content, and nested elements, converting them to appropriate JSON structures.' },
      ],
      zh: [
        { question: '如何在线将 JSON 转换为 XML？', answer: '粘贴 JSON 数据并点击转换。工具将 JSON 对象转换为 XML 元素，数组转换为重复元素，并保留数据类型。' },
        { question: 'JSON 数组如何转换为 XML？', answer: '数组变成具有相同标签名的重复 XML 元素。您可以自定义包装元素名称和项目元素名称。' },
        { question: '可以将 XML 转换回 JSON 吗？', answer: '是的，切换到 XML 转 JSON 模式。工具处理属性、文本内容和嵌套元素，将它们转换为适当的 JSON 结构。' },
      ],
    },
  },

  // SQL to MongoDB
  {
    slug: 'sql-to-mongodb',
    faqs: {
      en: [
        { question: 'How do I convert SQL queries to MongoDB?', answer: 'Paste your SQL SELECT query and we convert it to MongoDB find() syntax. Supports WHERE, ORDER BY, LIMIT, and basic JOINs.' },
        { question: 'What SQL features are supported?', answer: 'SELECT, WHERE with AND/OR, comparison operators, IN, LIKE, ORDER BY, LIMIT, OFFSET. Complex JOINs may need manual adjustment.' },
        { question: 'Does it convert CREATE TABLE to MongoDB schema?', answer: 'MongoDB is schemaless, but we can generate Mongoose schema definitions from CREATE TABLE statements for Node.js applications.' },
      ],
      zh: [
        { question: '如何将 SQL 查询转换为 MongoDB？', answer: '粘贴 SQL SELECT 查询，我们会将其转换为 MongoDB find() 语法。支持 WHERE、ORDER BY、LIMIT 和基本 JOIN。' },
        { question: '支持哪些 SQL 功能？', answer: 'SELECT、带 AND/OR 的 WHERE、比较运算符、IN、LIKE、ORDER BY、LIMIT、OFFSET。复杂的 JOIN 可能需要手动调整。' },
        { question: '可以将 CREATE TABLE 转换为 MongoDB 模式吗？', answer: 'MongoDB 是无模式的，但我们可以从 CREATE TABLE 语句为 Node.js 应用生成 Mongoose 模式定义。' },
      ],
    },
  },

  // Punycode Converter
  {
    slug: 'punycode-converter',
    faqs: {
      en: [
        { question: 'What is Punycode?', answer: 'Punycode encodes Unicode characters into ASCII for domain names. It allows internationalized domain names (IDN) like 中文.com to work in DNS.' },
        { question: 'How do I convert to Punycode?', answer: 'Enter a domain with non-ASCII characters and click Convert. The tool adds the xn-- prefix and encodes the Unicode portion.' },
        { question: 'Why do I need Punycode conversion?', answer: 'DNS only supports ASCII. Punycode lets you register and use domains in any language while maintaining compatibility with the internet infrastructure.' },
      ],
      zh: [
        { question: '什么是 Punycode？', answer: 'Punycode 将 Unicode 字符编码为 ASCII 用于域名。它允许国际化域名（IDN）如 中文.com 在 DNS 中工作。' },
        { question: '如何转换为 Punycode？', answer: '输入包含非 ASCII 字符的域名并点击转换。工具会添加 xn-- 前缀并编码 Unicode 部分。' },
        { question: '为什么需要 Punycode 转换？', answer: 'DNS 只支持 ASCII。Punycode 让您可以注册和使用任何语言的域名，同时保持与互联网基础设施的兼容性。' },
      ],
    },
  },

  // Unicode Converter
  {
    slug: 'unicode-converter',
    faqs: {
      en: [
        { question: 'How do I convert text to Unicode?', answer: 'Enter text and select output format: code points (U+0041), HTML entities (&#65;), or escape sequences (\\u0041). Copy the result for use in code.' },
        { question: 'What is a Unicode code point?', answer: 'A unique number assigned to each character in Unicode. For example, A is U+0041, 中 is U+4E2D. Code points are written in hexadecimal.' },
        { question: 'Can I convert Unicode back to text?', answer: 'Yes, paste Unicode code points, HTML entities, or escape sequences and convert to readable text. Supports mixed formats.' },
      ],
      zh: [
        { question: '如何将文本转换为 Unicode？', answer: '输入文本并选择输出格式：码点（U+0041）、HTML 实体（&#65;）或转义序列（\\u0041）。复制结果在代码中使用。' },
        { question: '什么是 Unicode 码点？', answer: 'Unicode 中分配给每个字符的唯一数字。例如，A 是 U+0041，中 是 U+4E2D。码点用十六进制表示。' },
        { question: '可以将 Unicode 转换回文本吗？', answer: '是的，粘贴 Unicode 码点、HTML 实体或转义序列并转换为可读文本。支持混合格式。' },
      ],
    },
  },

  // ASCII Art Generator
  {
    slug: 'ascii-art-generator',
    faqs: {
      en: [
        { question: 'How do I create ASCII art from text?', answer: 'Enter your text and choose a font style. The tool converts each letter to ASCII art characters. Over 100 font styles available.' },
        { question: 'Can I convert images to ASCII art?', answer: 'Yes, upload an image and we convert it to ASCII characters based on brightness levels. Adjust width and character set for best results.' },
        { question: 'What characters are used in ASCII art?', answer: 'Common sets include @#$%&*+=-:. for images (dark to light) and various block characters for text. You can customize the character palette.' },
      ],
      zh: [
        { question: '如何从文本创建 ASCII 艺术？', answer: '输入文本并选择字体样式。工具将每个字母转换为 ASCII 艺术字符。有 100 多种字体样式可用。' },
        { question: '可以将图片转换为 ASCII 艺术吗？', answer: '是的，上传图片，我们会根据亮度级别将其转换为 ASCII 字符。调整宽度和字符集以获得最佳效果。' },
        { question: 'ASCII 艺术使用什么字符？', answer: '常见字符集包括 @#$%&*+=-:.（用于图片，从暗到亮）和各种块字符（用于文本）。您可以自定义字符调色板。' },
      ],
    },
  },

  // Whitespace Remover
  {
    slug: 'whitespace-remover',
    faqs: {
      en: [
        { question: 'How do I remove extra whitespace from text?', answer: 'Paste your text and click Clean. The tool removes leading/trailing spaces, reduces multiple spaces to single, and optionally removes blank lines.' },
        { question: 'What types of whitespace are removed?', answer: 'Spaces, tabs, non-breaking spaces, and other Unicode whitespace characters. You can choose which types to remove or normalize.' },
        { question: 'Can I preserve paragraph breaks?', answer: 'Yes, enable "Preserve Paragraphs" to keep double line breaks while removing extra whitespace within paragraphs.' },
      ],
      zh: [
        { question: '如何从文本中删除多余的空白？', answer: '粘贴文本并点击清理。工具会删除前导/尾随空格，将多个空格减少为单个，并可选择删除空行。' },
        { question: '会删除哪些类型的空白？', answer: '空格、制表符、不间断空格和其他 Unicode 空白字符。您可以选择要删除或规范化的类型。' },
        { question: '可以保留段落分隔吗？', answer: '是的，启用"保留段落"可以保留双换行符，同时删除段落内的多余空白。' },
      ],
    },
  },

  // Duplicate Line Remover
  {
    slug: 'duplicate-line-remover',
    faqs: {
      en: [
        { question: 'How do I remove duplicate lines?', answer: 'Paste your text and click Remove Duplicates. The tool keeps the first occurrence of each unique line and removes subsequent duplicates.' },
        { question: 'Is the comparison case-sensitive?', answer: 'By default yes, but you can enable case-insensitive mode to treat "Hello" and "hello" as duplicates.' },
        { question: 'Can I sort the remaining lines?', answer: 'Yes, optionally sort alphabetically (A-Z or Z-A) or by line length after removing duplicates.' },
      ],
      zh: [
        { question: '如何删除重复行？', answer: '粘贴文本并点击删除重复。工具保留每个唯一行的第一次出现，并删除后续重复项。' },
        { question: '比较区分大小写吗？', answer: '默认是的，但您可以启用不区分大小写模式，将"Hello"和"hello"视为重复。' },
        { question: '可以对剩余行排序吗？', answer: '是的，可以在删除重复后按字母顺序（A-Z 或 Z-A）或按行长度排序。' },
      ],
    },
  },

  // Sort Lines
  {
    slug: 'sort-lines',
    faqs: {
      en: [
        { question: 'How do I sort lines of text?', answer: 'Paste your text and choose sort order: alphabetical (A-Z, Z-A), numerical, by length, or random shuffle. Results update instantly.' },
        { question: 'Does it handle numbers correctly?', answer: 'Yes, numerical sort treats "2" as less than "10" (unlike alphabetical where "10" comes before "2"). Enable for lists with numbers.' },
        { question: 'Can I sort and remove duplicates together?', answer: 'Yes, enable "Remove Duplicates" option to get a sorted list of unique lines in one step.' },
      ],
      zh: [
        { question: '如何对文本行排序？', answer: '粘贴文本并选择排序顺序：字母顺序（A-Z、Z-A）、数字、按长度或随机打乱。结果即时更新。' },
        { question: '能正确处理数字吗？', answer: '是的，数字排序将"2"视为小于"10"（不像字母排序中"10"在"2"之前）。对包含数字的列表启用此选项。' },
        { question: '可以同时排序和删除重复吗？', answer: '是的，启用"删除重复"选项可以一步获得排序后的唯一行列表。' },
      ],
    },
  },

  // Text to Hex
  {
    slug: 'text-to-hex',
    faqs: {
      en: [
        { question: 'How do I convert text to hexadecimal?', answer: 'Enter your text and each character is converted to its hex value. "Hello" becomes "48 65 6C 6C 6F". Choose with or without spaces.' },
        { question: 'What encoding is used?', answer: 'UTF-8 by default. ASCII characters are single bytes (00-7F), while Unicode characters may be multiple bytes. You can select other encodings.' },
        { question: 'Can I convert hex back to text?', answer: 'Yes, paste hex values (with or without spaces, 0x prefix optional) and convert to readable text.' },
      ],
      zh: [
        { question: '如何将文本转换为十六进制？', answer: '输入文本，每个字符都会转换为其十六进制值。"Hello"变成"48 65 6C 6C 6F"。选择带或不带空格。' },
        { question: '使用什么编码？', answer: '默认 UTF-8。ASCII 字符是单字节（00-7F），而 Unicode 字符可能是多字节。您可以选择其他编码。' },
        { question: '可以将十六进制转换回文本吗？', answer: '是的，粘贴十六进制值（有或没有空格，0x 前缀可选）并转换为可读文本。' },
      ],
    },
  },

  // Octal Converter
  {
    slug: 'octal-converter',
    faqs: {
      en: [
        { question: 'How do I convert to octal?', answer: 'Enter a decimal, binary, or hex number and get the octal (base-8) equivalent. Octal uses digits 0-7 only.' },
        { question: 'Where is octal used?', answer: 'Unix file permissions (chmod 755), some programming languages, and legacy systems. Each octal digit represents 3 binary bits.' },
        { question: 'How do I read octal file permissions?', answer: '7=rwx (read+write+execute), 6=rw-, 5=r-x, 4=r--, etc. 755 means owner has full access, others can read and execute.' },
      ],
      zh: [
        { question: '如何转换为八进制？', answer: '输入十进制、二进制或十六进制数字，获得八进制（基数 8）等价值。八进制只使用数字 0-7。' },
        { question: '八进制在哪里使用？', answer: 'Unix 文件权限（chmod 755）、一些编程语言和遗留系统。每个八进制数字代表 3 个二进制位。' },
        { question: '如何读取八进制文件权限？', answer: '7=rwx（读+写+执行）、6=rw-、5=r-x、4=r-- 等。755 表示所有者有完全访问权限，其他人可以读取和执行。' },
      ],
    },
  },
];
