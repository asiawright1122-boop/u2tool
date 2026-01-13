/**
 * GEO 优化的工具 FAQ 配置 - 第三十七批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_37: ToolSpecificFAQ[] = [
  // JSON to C#
  {
    slug: 'json-to-csharp',
    faqs: {
      en: [
        { question: 'How do I convert JSON to C# classes?', answer: 'Paste JSON, we generate C# classes with properties and proper types. Ready for System.Text.Json or Newtonsoft.' },
        { question: 'Does it support nullable reference types?', answer: 'Yes, generates nullable types for optional fields. Compatible with C# 8.0+ nullable context.' },
        { question: 'Can I customize property naming?', answer: 'Yes, choose PascalCase or keep original. Add [JsonPropertyName] attributes for mapping.' },
      ],
      zh: [
        { question: '如何将 JSON 转换为 C# 类？', answer: '粘贴 JSON，我们生成带有属性和正确类型的 C# 类。可用于 System.Text.Json 或 Newtonsoft。' },
        { question: '它支持可空引用类型吗？', answer: '是的，为可选字段生成可空类型。兼容 C# 8.0+ 可空上下文。' },
        { question: '可以自定义属性命名吗？', answer: '是的，选择 PascalCase 或保持原样。添加 [JsonPropertyName] 属性用于映射。' },
      ],
    },
  },

  // JSON to Rust
  {
    slug: 'json-to-rust',
    faqs: {
      en: [
        { question: 'How do I convert JSON to Rust structs?', answer: 'Paste JSON, we generate Rust structs with serde derive macros for serialization.' },
        { question: 'What serde attributes are added?', answer: '#[derive(Serialize, Deserialize)] and #[serde(rename = "...")] for field mapping.' },
        { question: 'How are optional fields handled?', answer: 'Nullable JSON fields become Option<T> in Rust. We add #[serde(skip_serializing_if = "Option::is_none")].' },
      ],
      zh: [
        { question: '如何将 JSON 转换为 Rust 结构体？', answer: '粘贴 JSON，我们生成带有 serde 派生宏的 Rust 结构体用于序列化。' },
        { question: '添加了哪些 serde 属性？', answer: '#[derive(Serialize, Deserialize)] 和 #[serde(rename = "...")] 用于字段映射。' },
        { question: '可选字段如何处理？', answer: '可空的 JSON 字段在 Rust 中变成 Option<T>。我们添加 #[serde(skip_serializing_if = "Option::is_none")]。' },
      ],
    },
  },

  // JSON to Swift
  {
    slug: 'json-to-swift',
    faqs: {
      en: [
        { question: 'How do I convert JSON to Swift?', answer: 'Paste JSON, we generate Swift structs conforming to Codable protocol.' },
        { question: 'Does it support CodingKeys?', answer: 'Yes, generates CodingKeys enum when JSON keys differ from Swift naming conventions.' },
        { question: 'How are dates handled?', answer: 'Date strings are typed as Date. Add dateDecodingStrategy to JSONDecoder for parsing.' },
      ],
      zh: [
        { question: '如何将 JSON 转换为 Swift？', answer: '粘贴 JSON，我们生成符合 Codable 协议的 Swift 结构体。' },
        { question: '它支持 CodingKeys 吗？', answer: '是的，当 JSON 键与 Swift 命名约定不同时生成 CodingKeys 枚举。' },
        { question: '日期如何处理？', answer: '日期字符串被类型化为 Date。向 JSONDecoder 添加 dateDecodingStrategy 用于解析。' },
      ],
    },
  },

  // JS Minifier
  {
    slug: 'js-minifier',
    faqs: {
      en: [
        { question: 'What does JS minifier do?', answer: 'Removes whitespace, shortens variable names, removes comments. Reduces file size for production.' },
        { question: 'How much size reduction can I expect?', answer: 'Typically 40-70% reduction. More with longer variable names and comments.' },
        { question: 'Will minification break my code?', answer: 'No, if code is valid. Always test minified code. Some edge cases with eval() may have issues.' },
      ],
      zh: [
        { question: 'JS 压缩器做什么？', answer: '删除空白、缩短变量名、删除注释。减少文件大小以供生产使用。' },
        { question: '可以期望多少大小减少？', answer: '通常减少 40-70%。变量名更长和注释更多时减少更多。' },
        { question: '压缩会破坏我的代码吗？', answer: '不会，如果代码有效的话。始终测试压缩后的代码。某些使用 eval() 的边缘情况可能有问题。' },
      ],
    },
  },

  // Text to ASCII Art
  {
    slug: 'text-to-ascii-art',
    faqs: {
      en: [
        { question: 'How do I create ASCII art from text?', answer: 'Enter text, choose font style. We generate ASCII art using various character patterns.' },
        { question: 'What fonts are available?', answer: 'Standard, Banner, Big, Block, Bubble, Digital, and 20+ more styles. Preview before copying.' },
        { question: 'Can I use ASCII art in code comments?', answer: 'Yes, great for headers and section dividers. Copy and paste into your code.' },
      ],
      zh: [
        { question: '如何从文本创建 ASCII 艺术？', answer: '输入文本，选择字体样式。我们使用各种字符模式生成 ASCII 艺术。' },
        { question: '有哪些字体可用？', answer: 'Standard、Banner、Big、Block、Bubble、Digital 等 20 多种样式。复制前预览。' },
        { question: '可以在代码注释中使用 ASCII 艺术吗？', answer: '是的，非常适合标题和分节符。复制并粘贴到您的代码中。' },
      ],
    },
  },

  // Color Shades Generator
  {
    slug: 'color-shades-generator',
    faqs: {
      en: [
        { question: 'How do I generate color shades?', answer: 'Enter base color. We generate lighter tints and darker shades. Perfect for design systems.' },
        { question: 'How many shades are generated?', answer: 'Default 10 shades (50-900 like Tailwind). Customize number and step size.' },
        { question: 'Can I export for CSS/Tailwind?', answer: 'Yes, export as CSS variables, Tailwind config, or SCSS variables. Ready to use.' },
      ],
      zh: [
        { question: '如何生成颜色色调？', answer: '输入基础颜色。我们生成较浅的色调和较深的阴影。非常适合设计系统。' },
        { question: '生成多少个色调？', answer: '默认 10 个色调（50-900 像 Tailwind）。自定义数量和步长。' },
        { question: '可以导出为 CSS/Tailwind 吗？', answer: '是的，导出为 CSS 变量、Tailwind 配置或 SCSS 变量。可直接使用。' },
      ],
    },
  },

  // JSON Flattener
  {
    slug: 'json-flattener',
    faqs: {
      en: [
        { question: 'What does JSON flattening do?', answer: 'Converts nested JSON to flat key-value pairs. {a:{b:1}} becomes {"a.b":1}. Useful for databases.' },
        { question: 'How are arrays handled?', answer: 'Array indices in path: items[0].name. Or flatten to items.0.name depending on settings.' },
        { question: 'Can I unflatten JSON?', answer: 'Yes, reverse operation. Flat keys with dots become nested objects again.' },
      ],
      zh: [
        { question: 'JSON 扁平化做什么？', answer: '将嵌套 JSON 转换为扁平的键值对。{a:{b:1}} 变成 {"a.b":1}。对数据库有用。' },
        { question: '数组如何处理？', answer: '路径中的数组索引：items[0].name。或根据设置扁平化为 items.0.name。' },
        { question: '可以反扁平化 JSON 吗？', answer: '是的，反向操作。带点的扁平键再次变成嵌套对象。' },
      ],
    },
  },

  // Base85 Encoder/Decoder
  {
    slug: 'base85',
    faqs: {
      en: [
        { question: 'What is Base85 encoding?', answer: 'Uses 85 ASCII characters for encoding. More efficient than Base64 (4:5 vs 3:4 ratio). Used in PDF, Git.' },
        { question: 'What variants are supported?', answer: 'ASCII85 (Adobe), Z85 (ZeroMQ), RFC 1924 (IPv6). Each uses different character sets.' },
        { question: 'When should I use Base85?', answer: 'When space efficiency matters more than compatibility. 20% smaller than Base64 output.' },
      ],
      zh: [
        { question: '什么是 Base85 编码？', answer: '使用 85 个 ASCII 字符进行编码。比 Base64 更高效（4:5 vs 3:4 比率）。用于 PDF、Git。' },
        { question: '支持哪些变体？', answer: 'ASCII85（Adobe）、Z85（ZeroMQ）、RFC 1924（IPv6）。每种使用不同的字符集。' },
        { question: '什么时候应该使用 Base85？', answer: '当空间效率比兼容性更重要时。比 Base64 输出小 20%。' },
      ],
    },
  },

  // Regex Generator
  {
    slug: 'regex-generator',
    faqs: {
      en: [
        { question: 'How do I generate regex from examples?', answer: 'Enter sample strings that should match. We infer a regex pattern that matches all examples.' },
        { question: 'Can I specify what should NOT match?', answer: 'Yes, add negative examples. We refine the pattern to exclude them.' },
        { question: 'How accurate is the generated regex?', answer: 'Good starting point. May need refinement for edge cases. Always test with more examples.' },
      ],
      zh: [
        { question: '如何从示例生成正则表达式？', answer: '输入应该匹配的示例字符串。我们推断出匹配所有示例的正则表达式模式。' },
        { question: '可以指定不应该匹配的内容吗？', answer: '是的，添加负面示例。我们细化模式以排除它们。' },
        { question: '生成的正则表达式有多准确？', answer: '良好的起点。可能需要针对边缘情况进行细化。始终用更多示例测试。' },
      ],
    },
  },

  // URL Shortener Preview
  {
    slug: 'url-shortener-preview',
    faqs: {
      en: [
        { question: 'What does this tool do?', answer: 'Expands shortened URLs to show the final destination. Check where bit.ly, t.co links actually go.' },
        { question: 'Why preview shortened URLs?', answer: 'Security. Shortened URLs can hide malicious sites. Always check before clicking unknown links.' },
        { question: 'Does it follow all redirects?', answer: 'Yes, follows redirect chain to final URL. Shows each hop in the redirect path.' },
      ],
      zh: [
        { question: '这个工具做什么？', answer: '展开缩短的 URL 以显示最终目的地。检查 bit.ly、t.co 链接实际指向哪里。' },
        { question: '为什么要预览缩短的 URL？', answer: '安全性。缩短的 URL 可以隐藏恶意网站。点击未知链接前始终检查。' },
        { question: '它会跟踪所有重定向吗？', answer: '是的，跟踪重定向链到最终 URL。显示重定向路径中的每一跳。' },
      ],
    },
  },
];
