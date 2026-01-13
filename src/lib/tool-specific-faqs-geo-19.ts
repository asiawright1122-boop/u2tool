/**
 * GEO 优化的工具 FAQ 配置 - 第十九批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_19: ToolSpecificFAQ[] = [
  // CSV to JSON
  {
    slug: 'csv-to-json',
    faqs: {
      en: [
        { question: 'How do I convert CSV to JSON?', answer: 'Upload CSV file or paste data. First row becomes keys, subsequent rows become objects in array. Download JSON.' },
        { question: 'What delimiter formats are supported?', answer: 'Comma (CSV), semicolon, tab (TSV), pipe. Auto-detect or manually specify delimiter.' },
        { question: 'How are data types handled?', answer: 'Numbers and booleans are auto-detected. "123" becomes 123, "true" becomes true. Strings remain as strings.' },
      ],
      zh: [
        { question: '如何将 CSV 转换为 JSON？', answer: '上传 CSV 文件或粘贴数据。第一行成为键，后续行成为数组中的对象。下载 JSON。' },
        { question: '支持哪些分隔符格式？', answer: '逗号（CSV）、分号、制表符（TSV）、管道符。自动检测或手动指定分隔符。' },
        { question: '数据类型如何处理？', answer: '数字和布尔值会自动检测。"123" 变成 123，"true" 变成 true。字符串保持为字符串。' },
      ],
    },
  },

  // XML to JSON
  {
    slug: 'xml-to-json',
    faqs: {
      en: [
        { question: 'How do I convert XML to JSON?', answer: 'Paste XML content. We parse structure and convert to equivalent JSON. Attributes become properties with @ prefix.' },
        { question: 'How are XML attributes handled?', answer: 'Attributes become @attributeName properties. Text content becomes #text. Arrays for repeated elements.' },
        { question: 'Can I convert complex nested XML?', answer: 'Yes, we preserve full hierarchy. Deeply nested structures convert to nested JSON objects.' },
      ],
      zh: [
        { question: '如何将 XML 转换为 JSON？', answer: '粘贴 XML 内容。我们解析结构并转换为等效的 JSON。属性变成带 @ 前缀的属性。' },
        { question: 'XML 属性如何处理？', answer: '属性变成 @attributeName 属性。文本内容变成 #text。重复元素变成数组。' },
        { question: '可以转换复杂的嵌套 XML 吗？', answer: '是的，我们保留完整的层次结构。深度嵌套的结构转换为嵌套的 JSON 对象。' },
      ],
    },
  },

  // JSON to XML
  {
    slug: 'json-to-xml',
    faqs: {
      en: [
        { question: 'How do I convert JSON to XML?', answer: 'Paste JSON content. We generate XML with proper element structure. Arrays become repeated elements.' },
        { question: 'How are arrays converted?', answer: 'Array items become repeated elements with same tag name. [{a:1},{a:2}] becomes <item><a>1</a></item><item><a>2</a></item>.' },
        { question: 'Can I customize the root element?', answer: 'Yes, specify root element name. Default is "root". Also customize array item element names.' },
      ],
      zh: [
        { question: '如何将 JSON 转换为 XML？', answer: '粘贴 JSON 内容。我们生成具有正确元素结构的 XML。数组变成重复元素。' },
        { question: '数组如何转换？', answer: '数组项变成具有相同标签名的重复元素。[{a:1},{a:2}] 变成 <item><a>1</a></item><item><a>2</a></item>。' },
        { question: '可以自定义根元素吗？', answer: '是的，指定根元素名称。默认是 "root"。也可以自定义数组项元素名称。' },
      ],
    },
  },

  // YAML to JSON
  {
    slug: 'yaml-to-json',
    faqs: {
      en: [
        { question: 'How do I convert YAML to JSON?', answer: 'Paste YAML content. We parse and convert to JSON format. Preserves data types and structure.' },
        { question: 'What YAML features are supported?', answer: 'Objects, arrays, strings, numbers, booleans, null, multi-line strings, anchors and aliases.' },
        { question: 'Why convert YAML to JSON?', answer: 'JSON is more widely supported. APIs often require JSON. Easier to validate and process programmatically.' },
      ],
      zh: [
        { question: '如何将 YAML 转换为 JSON？', answer: '粘贴 YAML 内容。我们解析并转换为 JSON 格式。保留数据类型和结构。' },
        { question: '支持哪些 YAML 功能？', answer: '对象、数组、字符串、数字、布尔值、null、多行字符串、锚点和别名。' },
        { question: '为什么要将 YAML 转换为 JSON？', answer: 'JSON 支持更广泛。API 通常需要 JSON。更容易以编程方式验证和处理。' },
      ],
    },
  },

  // JSON to YAML
  {
    slug: 'json-to-yaml',
    faqs: {
      en: [
        { question: 'How do I convert JSON to YAML?', answer: 'Paste JSON content. We convert to YAML format with proper indentation. More human-readable than JSON.' },
        { question: 'Why use YAML instead of JSON?', answer: 'YAML is more readable, supports comments, less punctuation. Popular for config files (Docker, Kubernetes, CI/CD).' },
        { question: 'Can I customize YAML output?', answer: 'Yes, adjust indent size (2 or 4 spaces), choose flow style vs block style for arrays and objects.' },
      ],
      zh: [
        { question: '如何将 JSON 转换为 YAML？', answer: '粘贴 JSON 内容。我们转换为具有正确缩进的 YAML 格式。比 JSON 更易读。' },
        { question: '为什么使用 YAML 而不是 JSON？', answer: 'YAML 更易读，支持注释，标点符号更少。常用于配置文件（Docker、Kubernetes、CI/CD）。' },
        { question: '可以自定义 YAML 输出吗？', answer: '是的，调整缩进大小（2 或 4 个空格），为数组和对象选择流式样式或块样式。' },
      ],
    },
  },

  // TOML to JSON
  {
    slug: 'toml-to-json',
    faqs: {
      en: [
        { question: 'What is TOML format?', answer: 'Tom\'s Obvious Minimal Language - a config file format. More readable than JSON, stricter than YAML. Used by Rust (Cargo.toml).' },
        { question: 'How do I convert TOML to JSON?', answer: 'Paste TOML content. We parse sections, key-value pairs, and arrays into equivalent JSON structure.' },
        { question: 'What TOML features are supported?', answer: 'Tables, arrays, inline tables, multi-line strings, dates/times, integers, floats, booleans.' },
      ],
      zh: [
        { question: '什么是 TOML 格式？', answer: 'Tom 的明显最小语言 - 一种配置文件格式。比 JSON 更易读，比 YAML 更严格。被 Rust（Cargo.toml）使用。' },
        { question: '如何将 TOML 转换为 JSON？', answer: '粘贴 TOML 内容。我们将节、键值对和数组解析为等效的 JSON 结构。' },
        { question: '支持哪些 TOML 功能？', answer: '表、数组、内联表、多行字符串、日期/时间、整数、浮点数、布尔值。' },
      ],
    },
  },

  // Markdown Editor
  {
    slug: 'markdown-editor',
    faqs: {
      en: [
        { question: 'How do I use the Markdown editor?', answer: 'Type Markdown in left panel, see live preview on right. Toolbar buttons for common formatting. Export to HTML or PDF.' },
        { question: 'What Markdown syntax is supported?', answer: 'Full CommonMark plus GFM extensions: tables, task lists, strikethrough, autolinks, code highlighting.' },
        { question: 'Can I save my documents?', answer: 'Yes, save to browser storage or download as .md file. Import existing Markdown files to continue editing.' },
      ],
      zh: [
        { question: '如何使用 Markdown 编辑器？', answer: '在左侧面板输入 Markdown，在右侧查看实时预览。工具栏按钮用于常见格式。导出为 HTML 或 PDF。' },
        { question: '支持哪些 Markdown 语法？', answer: '完整的 CommonMark 加 GFM 扩展：表格、任务列表、删除线、自动链接、代码高亮。' },
        { question: '可以保存我的文档吗？', answer: '是的，保存到浏览器存储或下载为 .md 文件。导入现有 Markdown 文件继续编辑。' },
      ],
    },
  },

  // HTML Editor
  {
    slug: 'html-editor',
    faqs: {
      en: [
        { question: 'How do I use the HTML editor?', answer: 'Write HTML/CSS/JS in code panels. See live preview instantly. Great for prototyping and learning.' },
        { question: 'Can I use external libraries?', answer: 'Yes, add CDN links in HTML head or use our library picker to include Bootstrap, jQuery, etc.' },
        { question: 'Can I save and share my code?', answer: 'Yes, save to browser storage, download files, or generate shareable link to your creation.' },
      ],
      zh: [
        { question: '如何使用 HTML 编辑器？', answer: '在代码面板中编写 HTML/CSS/JS。立即查看实时预览。非常适合原型设计和学习。' },
        { question: '可以使用外部库吗？', answer: '是的，在 HTML head 中添加 CDN 链接或使用我们的库选择器包含 Bootstrap、jQuery 等。' },
        { question: '可以保存和分享我的代码吗？', answer: '是的，保存到浏览器存储、下载文件或生成可分享的链接到您的作品。' },
      ],
    },
  },

  // Lorem Ipsum Generator
  {
    slug: 'lorem-ipsum-generator',
    faqs: {
      en: [
        { question: 'What is Lorem Ipsum?', answer: 'Placeholder text used in design and publishing since the 1500s. Looks like Latin but is meaningless. Focuses attention on layout.' },
        { question: 'How do I generate Lorem Ipsum?', answer: 'Choose amount: paragraphs, sentences, or words. Click Generate. Copy text for use in your designs.' },
        { question: 'Are there alternatives to Lorem Ipsum?', answer: 'Yes, we offer Hipster Ipsum, Bacon Ipsum, and other fun alternatives. Or generate random text in different languages.' },
      ],
      zh: [
        { question: '什么是 Lorem Ipsum？', answer: '自 1500 年代以来用于设计和出版的占位文本。看起来像拉丁语但没有意义。将注意力集中在布局上。' },
        { question: '如何生成 Lorem Ipsum？', answer: '选择数量：段落、句子或单词。点击生成。复制文本用于您的设计。' },
        { question: '有 Lorem Ipsum 的替代品吗？', answer: '是的，我们提供 Hipster Ipsum、Bacon Ipsum 和其他有趣的替代品。或生成不同语言的随机文本。' },
      ],
    },
  },

  // Diff Checker
  {
    slug: 'diff-checker',
    faqs: {
      en: [
        { question: 'How do I compare two files?', answer: 'Paste or upload content in both panels. We highlight differences: additions (green), deletions (red), changes (yellow).' },
        { question: 'What view modes are available?', answer: 'Side-by-side (two columns) or unified (single column with +/- markers). Choose based on preference.' },
        { question: 'Can I compare code files?', answer: 'Yes, with syntax highlighting for many languages. Great for code reviews and finding changes between versions.' },
      ],
      zh: [
        { question: '如何比较两个文件？', answer: '在两个面板中粘贴或上传内容。我们高亮显示差异：添加（绿色）、删除（红色）、更改（黄色）。' },
        { question: '有哪些视图模式可用？', answer: '并排（两列）或统一（带 +/- 标记的单列）。根据偏好选择。' },
        { question: '可以比较代码文件吗？', answer: '是的，支持多种语言的语法高亮。非常适合代码审查和查找版本之间的更改。' },
      ],
    },
  },
];
