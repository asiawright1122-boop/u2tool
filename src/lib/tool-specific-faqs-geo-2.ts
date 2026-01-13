/**
 * GEO 优化的工具 FAQ 配置 - 第二批
 * 为更多热门工具提供 GEO 优化的 FAQ
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_2: ToolSpecificFAQ[] = [
  // SQL Formatter
  {
    slug: 'sql-formatter',
    faqs: {
      en: [
        { question: 'How do I format SQL queries online?', answer: 'Paste your SQL query into the input field and click Format. The tool instantly beautifies your SQL with proper indentation, keyword capitalization, and line breaks for better readability.' },
        { question: 'What SQL dialects are supported?', answer: 'Our formatter supports standard SQL, MySQL, PostgreSQL, SQL Server, Oracle, and SQLite syntax. It automatically handles dialect-specific keywords and functions.' },
        { question: 'Can I minify SQL queries?', answer: 'Yes, switch to Minify mode to compress your SQL by removing unnecessary whitespace and comments. This is useful for reducing query size in applications.' },
      ],
      zh: [
        { question: '如何在线格式化 SQL 查询？', answer: '将 SQL 查询粘贴到输入框，点击格式化。工具会立即美化您的 SQL，添加正确的缩进、关键字大写和换行，提高可读性。' },
        { question: '支持哪些 SQL 方言？', answer: '我们的格式化工具支持标准 SQL、MySQL、PostgreSQL、SQL Server、Oracle 和 SQLite 语法。它自动处理特定方言的关键字和函数。' },
        { question: '可以压缩 SQL 查询吗？', answer: '是的，切换到压缩模式可以通过移除不必要的空白和注释来压缩 SQL。这对于减少应用程序中的查询大小很有用。' },
      ],
    },
  },

  // Image Compressor
  {
    slug: 'image-compressor',
    faqs: {
      en: [
        { question: 'How do I compress images online without losing quality?', answer: 'Upload your image and adjust the quality slider. Our tool uses smart compression algorithms to reduce file size while maintaining visual quality. Preview the result before downloading.' },
        { question: 'What image formats are supported?', answer: 'We support JPEG, PNG, WebP, and GIF formats. Each format has optimized compression settings for best results.' },
        { question: 'Is there a file size limit?', answer: 'You can compress images up to 10MB. All processing happens in your browser, so your images are never uploaded to any server.' },
      ],
      zh: [
        { question: '如何在线压缩图片而不损失质量？', answer: '上传图片并调整质量滑块。我们的工具使用智能压缩算法在保持视觉质量的同时减小文件大小。下载前可预览结果。' },
        { question: '支持哪些图片格式？', answer: '我们支持 JPEG、PNG、WebP 和 GIF 格式。每种格式都有优化的压缩设置以获得最佳效果。' },
        { question: '有文件大小限制吗？', answer: '您可以压缩最大 10MB 的图片。所有处理都在浏览器中进行，图片永远不会上传到任何服务器。' },
      ],
    },
  },

  // YAML to JSON
  {
    slug: 'yaml-to-json',
    faqs: {
      en: [
        { question: 'How do I convert YAML to JSON online?', answer: 'Paste your YAML content in the input field and click Convert. The tool instantly transforms YAML to properly formatted JSON with correct data types preserved.' },
        { question: 'Can I convert JSON to YAML?', answer: 'Yes, our tool supports bidirectional conversion. Switch to JSON to YAML mode to convert JSON files to YAML format.' },
        { question: 'Does it preserve comments?', answer: 'JSON does not support comments, so YAML comments are removed during conversion. The data structure and values are fully preserved.' },
      ],
      zh: [
        { question: '如何在线将 YAML 转换为 JSON？', answer: '将 YAML 内容粘贴到输入框，点击转换。工具会立即将 YAML 转换为格式正确的 JSON，并保留正确的数据类型。' },
        { question: '可以将 JSON 转换为 YAML 吗？', answer: '是的，我们的工具支持双向转换。切换到 JSON 转 YAML 模式可将 JSON 文件转换为 YAML 格式。' },
        { question: '会保留注释吗？', answer: 'JSON 不支持注释，因此 YAML 注释在转换过程中会被移除。数据结构和值会完全保留。' },
      ],
    },
  },

  // Text Case Converter
  {
    slug: 'text-case-converter',
    faqs: {
      en: [
        { question: 'How do I convert text to uppercase online?', answer: 'Paste your text and select UPPERCASE from the conversion options. The tool instantly converts all characters to capital letters. Works with any language.' },
        { question: 'What case conversions are available?', answer: 'We support UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and CONSTANT_CASE conversions.' },
        { question: 'Can I convert programming variable names?', answer: 'Yes, use camelCase, PascalCase, snake_case, or kebab-case options to convert between different naming conventions used in programming.' },
      ],
      zh: [
        { question: '如何在线将文本转换为大写？', answer: '粘贴文本并选择大写选项。工具会立即将所有字符转换为大写字母。适用于任何语言。' },
        { question: '有哪些大小写转换选项？', answer: '我们支持大写、小写、标题大小写、句子大小写、驼峰命名、帕斯卡命名、下划线命名、短横线命名和常量命名转换。' },
        { question: '可以转换编程变量名吗？', answer: '是的，使用驼峰命名、帕斯卡命名、下划线命名或短横线命名选项可在编程中使用的不同命名约定之间转换。' },
      ],
    },
  },

  // HTML to Markdown
  {
    slug: 'html-to-markdown',
    faqs: {
      en: [
        { question: 'How do I convert HTML to Markdown online?', answer: 'Paste your HTML code in the input field and click Convert. The tool transforms HTML tags to equivalent Markdown syntax while preserving formatting.' },
        { question: 'What HTML elements are supported?', answer: 'We support headings, paragraphs, links, images, lists, tables, code blocks, bold, italic, and most common HTML elements.' },
        { question: 'Can I convert Markdown back to HTML?', answer: 'Yes, switch to Markdown to HTML mode for reverse conversion. Both directions produce clean, valid output.' },
      ],
      zh: [
        { question: '如何在线将 HTML 转换为 Markdown？', answer: '将 HTML 代码粘贴到输入框，点击转换。工具会将 HTML 标签转换为等效的 Markdown 语法，同时保留格式。' },
        { question: '支持哪些 HTML 元素？', answer: '我们支持标题、段落、链接、图片、列表、表格、代码块、粗体、斜体和大多数常见 HTML 元素。' },
        { question: '可以将 Markdown 转换回 HTML 吗？', answer: '是的，切换到 Markdown 转 HTML 模式进行反向转换。两个方向都能产生干净、有效的输出。' },
      ],
    },
  },

  // CSS Minifier
  {
    slug: 'css-minifier',
    faqs: {
      en: [
        { question: 'How do I minify CSS online?', answer: 'Paste your CSS code and click Minify. The tool removes whitespace, comments, and optimizes selectors to reduce file size by 30-70%.' },
        { question: 'Will minified CSS work the same?', answer: 'Yes, minified CSS is functionally identical. Only formatting is removed. Keep original files for development and use minified versions in production.' },
        { question: 'Can I beautify minified CSS?', answer: 'Yes, switch to Beautify mode to format minified CSS with proper indentation and line breaks for easier reading and editing.' },
      ],
      zh: [
        { question: '如何在线压缩 CSS？', answer: '粘贴 CSS 代码并点击压缩。工具会移除空白、注释并优化选择器，将文件大小减少 30-70%。' },
        { question: '压缩后的 CSS 功能一样吗？', answer: '是的，压缩后的 CSS 功能完全相同。只移除了格式。保留原始文件用于开发，在生产环境中使用压缩版本。' },
        { question: '可以美化压缩的 CSS 吗？', answer: '是的，切换到美化模式可以为压缩的 CSS 添加正确的缩进和换行，便于阅读和编辑。' },
      ],
    },
  },

  // JavaScript Minifier
  {
    slug: 'javascript-minifier',
    faqs: {
      en: [
        { question: 'How do I minify JavaScript online?', answer: 'Paste your JavaScript code and click Minify. The tool removes whitespace, shortens variable names, and optimizes code to reduce file size significantly.' },
        { question: 'Is minified JavaScript harder to debug?', answer: 'Yes, minified code is harder to read. Use source maps in production to map minified code back to original source for debugging.' },
        { question: 'Does minification affect performance?', answer: 'Minification reduces file size and download time, improving page load speed. The code executes the same way as the original.' },
      ],
      zh: [
        { question: '如何在线压缩 JavaScript？', answer: '粘贴 JavaScript 代码并点击压缩。工具会移除空白、缩短变量名并优化代码，显著减小文件大小。' },
        { question: '压缩后的 JavaScript 更难调试吗？', answer: '是的，压缩代码更难阅读。在生产环境中使用 source map 将压缩代码映射回原始源代码以便调试。' },
        { question: '压缩会影响性能吗？', answer: '压缩减小文件大小和下载时间，提高页面加载速度。代码执行方式与原始代码相同。' },
      ],
    },
  },

  // Base64 Image
  {
    slug: 'base64-image',
    faqs: {
      en: [
        { question: 'How do I convert an image to Base64?', answer: 'Upload or drag an image file into the tool. It instantly converts to a Base64 encoded string that you can copy and use in HTML, CSS, or JavaScript.' },
        { question: 'Why convert images to Base64?', answer: 'Base64 images can be embedded directly in HTML/CSS, reducing HTTP requests. Useful for small icons, logos, and images that need to load instantly.' },
        { question: 'What is the size limit for Base64 images?', answer: 'While there is no hard limit, Base64 encoding increases size by ~33%. For images over 10KB, using regular image files is usually more efficient.' },
      ],
      zh: [
        { question: '如何将图片转换为 Base64？', answer: '上传或拖拽图片文件到工具中。它会立即转换为 Base64 编码字符串，您可以复制并在 HTML、CSS 或 JavaScript 中使用。' },
        { question: '为什么要将图片转换为 Base64？', answer: 'Base64 图片可以直接嵌入 HTML/CSS，减少 HTTP 请求。适用于需要即时加载的小图标、Logo 和图片。' },
        { question: 'Base64 图片有大小限制吗？', answer: '虽然没有硬性限制，但 Base64 编码会增加约 33% 的大小。对于超过 10KB 的图片，使用常规图片文件通常更高效。' },
      ],
    },
  },

  // Color Picker
  {
    slug: 'color-picker',
    faqs: {
      en: [
        { question: 'How do I pick colors from an image?', answer: 'Upload an image and click anywhere on it to pick a color. The tool shows the color in HEX, RGB, and HSL formats instantly.' },
        { question: 'Can I create color palettes?', answer: 'Yes, pick multiple colors to build a palette. You can save, export, and share your color combinations for design projects.' },
        { question: 'What color formats are supported?', answer: 'We support HEX, RGB, RGBA, HSL, HSLA, and HSV formats. Convert between any format with one click.' },
      ],
      zh: [
        { question: '如何从图片中取色？', answer: '上传图片并点击任意位置取色。工具会立即显示 HEX、RGB 和 HSL 格式的颜色值。' },
        { question: '可以创建调色板吗？', answer: '是的，选取多个颜色来构建调色板。您可以保存、导出和分享您的颜色组合用于设计项目。' },
        { question: '支持哪些颜色格式？', answer: '我们支持 HEX、RGB、RGBA、HSL、HSLA 和 HSV 格式。一键在任何格式之间转换。' },
      ],
    },
  },

  // Unit Converter
  {
    slug: 'unit-converter',
    faqs: {
      en: [
        { question: 'How do I convert units online?', answer: 'Select the unit category (length, weight, temperature, etc.), enter a value, and choose source and target units. Conversion happens instantly.' },
        { question: 'What unit categories are available?', answer: 'We support length, weight, temperature, area, volume, speed, time, data storage, and many more categories with hundreds of units.' },
        { question: 'Are the conversions accurate?', answer: 'Yes, we use precise conversion factors from international standards. Results are accurate to multiple decimal places.' },
      ],
      zh: [
        { question: '如何在线转换单位？', answer: '选择单位类别（长度、重量、温度等），输入数值，选择源单位和目标单位。转换即时完成。' },
        { question: '有哪些单位类别？', answer: '我们支持长度、重量、温度、面积、体积、速度、时间、数据存储等多个类别，包含数百种单位。' },
        { question: '转换准确吗？', answer: '是的，我们使用国际标准的精确转换因子。结果精确到多位小数。' },
      ],
    },
  },
];
