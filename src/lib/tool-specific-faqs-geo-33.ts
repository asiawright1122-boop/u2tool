/**
 * GEO 优化的工具 FAQ 配置 - 第三十三批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_33: ToolSpecificFAQ[] = [
  // Hex Editor
  {
    slug: 'hex-editor',
    faqs: {
      en: [
        { question: 'What is a hex editor?', answer: 'View and edit files in hexadecimal format. See raw bytes of any file. Essential for binary file analysis.' },
        { question: 'How do I edit hex values?', answer: 'Click on hex byte to edit. Type new hex value (00-FF). Changes reflect in ASCII view simultaneously.' },
        { question: 'What files can I edit?', answer: 'Any file type. Common uses: executables, images, game saves, corrupted files. Be careful with system files.' },
      ],
      zh: [
        { question: '什么是十六进制编辑器？', answer: '以十六进制格式查看和编辑文件。查看任何文件的原始字节。对于二进制文件分析至关重要。' },
        { question: '如何编辑十六进制值？', answer: '点击十六进制字节进行编辑。输入新的十六进制值（00-FF）。更改同时反映在 ASCII 视图中。' },
        { question: '可以编辑哪些文件？', answer: '任何文件类型。常见用途：可执行文件、图像、游戏存档、损坏的文件。小心系统文件。' },
      ],
    },
  },

  // Color Palette Generator
  {
    slug: 'color-palette',
    faqs: {
      en: [
        { question: 'How do I generate a color palette?', answer: 'Enter base color or upload image. We generate harmonious palettes using color theory algorithms.' },
        { question: 'What palette types are available?', answer: 'Complementary, analogous, triadic, split-complementary, tetradic, monochromatic. Each creates different moods.' },
        { question: 'Can I extract colors from an image?', answer: 'Yes, upload image. We extract dominant colors and create a cohesive palette from them.' },
      ],
      zh: [
        { question: '如何生成调色板？', answer: '输入基础颜色或上传图像。我们使用色彩理论算法生成和谐的调色板。' },
        { question: '有哪些调色板类型？', answer: '互补色、类似色、三色、分裂互补、四色、单色。每种创造不同的氛围。' },
        { question: '可以从图像中提取颜色吗？', answer: '是的，上传图像。我们提取主要颜色并从中创建一个协调的调色板。' },
      ],
    },
  },

  // HTTP Status Codes Reference
  {
    slug: 'http-status',
    faqs: {
      en: [
        { question: 'What are HTTP status codes?', answer: 'Three-digit codes indicating request result. 2xx success, 3xx redirect, 4xx client error, 5xx server error.' },
        { question: 'What does 404 mean?', answer: '404 Not Found means the requested resource does not exist. Check URL spelling and resource availability.' },
        { question: 'What is the difference between 401 and 403?', answer: '401 Unauthorized: need to authenticate. 403 Forbidden: authenticated but not allowed access.' },
      ],
      zh: [
        { question: '什么是 HTTP 状态码？', answer: '表示请求结果的三位数代码。2xx 成功，3xx 重定向，4xx 客户端错误，5xx 服务器错误。' },
        { question: '404 是什么意思？', answer: '404 Not Found 表示请求的资源不存在。检查 URL 拼写和资源可用性。' },
        { question: '401 和 403 有什么区别？', answer: '401 未授权：需要认证。403 禁止：已认证但不允许访问。' },
      ],
    },
  },

  // Data URI Generator
  {
    slug: 'data-uri',
    faqs: {
      en: [
        { question: 'What is a Data URI?', answer: 'Data URI embeds file content directly in HTML/CSS. Format: data:[mime];base64,[data]. No separate file request needed.' },
        { question: 'When should I use Data URIs?', answer: 'Small images (<5KB), icons, fonts. Reduces HTTP requests. Not recommended for large files.' },
        { question: 'How do I use Data URI in CSS?', answer: 'background-image: url(data:image/png;base64,...). Embed small images directly in stylesheets.' },
      ],
      zh: [
        { question: '什么是 Data URI？', answer: 'Data URI 将文件内容直接嵌入 HTML/CSS。格式：data:[mime];base64,[data]。不需要单独的文件请求。' },
        { question: '什么时候应该使用 Data URI？', answer: '小图像（<5KB）、图标、字体。减少 HTTP 请求。不推荐用于大文件。' },
        { question: '如何在 CSS 中使用 Data URI？', answer: 'background-image: url(data:image/png;base64,...)。直接在样式表中嵌入小图像。' },
      ],
    },
  },

  // JSON to Go
  {
    slug: 'json-to-go',
    faqs: {
      en: [
        { question: 'How do I convert JSON to Go structs?', answer: 'Paste JSON, we generate Go struct definitions with proper field tags and types.' },
        { question: 'What are JSON tags in Go?', answer: 'Tags like `json:"fieldName"` map JSON keys to struct fields. We generate these automatically.' },
        { question: 'Does it handle nested JSON?', answer: 'Yes, nested objects become nested structs. Arrays become slices. Proper Go naming conventions applied.' },
      ],
      zh: [
        { question: '如何将 JSON 转换为 Go 结构体？', answer: '粘贴 JSON，我们生成带有正确字段标签和类型的 Go 结构体定义。' },
        { question: 'Go 中的 JSON 标签是什么？', answer: '像 `json:"fieldName"` 这样的标签将 JSON 键映射到结构体字段。我们自动生成这些。' },
        { question: '它能处理嵌套 JSON 吗？', answer: '是的，嵌套对象变成嵌套结构体。数组变成切片。应用正确的 Go 命名约定。' },
      ],
    },
  },

  // HTML to JSX
  {
    slug: 'html-to-jsx',
    faqs: {
      en: [
        { question: 'What changes from HTML to JSX?', answer: 'class→className, for→htmlFor, style as object, self-closing tags, camelCase attributes.' },
        { question: 'How are inline styles converted?', answer: 'style="color: red" becomes style={{color: "red"}}. CSS properties become camelCase.' },
        { question: 'Does it handle event handlers?', answer: 'Yes, onclick→onClick, onchange→onChange. Event names become camelCase in JSX.' },
      ],
      zh: [
        { question: 'HTML 到 JSX 有什么变化？', answer: 'class→className，for→htmlFor，style 作为对象，自闭合标签，驼峰命名属性。' },
        { question: '内联样式如何转换？', answer: 'style="color: red" 变成 style={{color: "red"}}。CSS 属性变成驼峰命名。' },
        { question: '它能处理事件处理程序吗？', answer: '是的，onclick→onClick，onchange→onChange。事件名称在 JSX 中变成驼峰命名。' },
      ],
    },
  },

  // Chmod Calculator
  {
    slug: 'chmod-calculator',
    faqs: {
      en: [
        { question: 'What is chmod?', answer: 'chmod sets file permissions in Unix/Linux. Three digits for owner, group, others. Each digit 0-7 represents read/write/execute.' },
        { question: 'What does 755 mean?', answer: '7=rwx (owner full), 5=r-x (group read+execute), 5=r-x (others read+execute). Common for executables.' },
        { question: 'What does 644 mean?', answer: '6=rw- (owner read+write), 4=r-- (group read), 4=r-- (others read). Common for regular files.' },
      ],
      zh: [
        { question: '什么是 chmod？', answer: 'chmod 在 Unix/Linux 中设置文件权限。三位数字分别代表所有者、组、其他人。每位数字 0-7 代表读/写/执行。' },
        { question: '755 是什么意思？', answer: '7=rwx（所有者完全权限），5=r-x（组读+执行），5=r-x（其他人读+执行）。常用于可执行文件。' },
        { question: '644 是什么意思？', answer: '6=rw-（所有者读+写），4=r--（组读），4=r--（其他人读）。常用于普通文件。' },
      ],
    },
  },

  // URL Parser
  {
    slug: 'url-parser',
    faqs: {
      en: [
        { question: 'What URL components are parsed?', answer: 'Protocol, host, port, path, query parameters, hash fragment. Each component extracted and displayed.' },
        { question: 'How do I extract query parameters?', answer: 'Paste URL, we parse all query params into key-value pairs. Easy to copy individual values.' },
        { question: 'Can I build URLs from components?', answer: 'Yes, enter components separately. We construct valid URL with proper encoding.' },
      ],
      zh: [
        { question: '解析哪些 URL 组件？', answer: '协议、主机、端口、路径、查询参数、哈希片段。每个组件被提取并显示。' },
        { question: '如何提取查询参数？', answer: '粘贴 URL，我们将所有查询参数解析为键值对。易于复制单个值。' },
        { question: '可以从组件构建 URL 吗？', answer: '是的，分别输入组件。我们构建带有正确编码的有效 URL。' },
      ],
    },
  },

  // Text Wrapper
  {
    slug: 'text-wrapper',
    faqs: {
      en: [
        { question: 'What is text wrapping?', answer: 'Breaking long lines at specified width. Useful for formatting code comments, emails, or fixed-width displays.' },
        { question: 'How do I set wrap width?', answer: 'Enter character count (e.g., 80). Text wraps at word boundaries to avoid breaking words.' },
        { question: 'Can I add prefixes to wrapped lines?', answer: 'Yes, add prefix like "> " for quotes or "// " for code comments. Applied to each wrapped line.' },
      ],
      zh: [
        { question: '什么是文本换行？', answer: '在指定宽度处断开长行。用于格式化代码注释、电子邮件或固定宽度显示。' },
        { question: '如何设置换行宽度？', answer: '输入字符数（例如 80）。文本在单词边界处换行以避免断开单词。' },
        { question: '可以为换行添加前缀吗？', answer: '是的，添加前缀如 "> " 用于引用或 "// " 用于代码注释。应用于每个换行。' },
      ],
    },
  },

  // HTML Entity Encoder
  {
    slug: 'html-entity',
    faqs: {
      en: [
        { question: 'What are HTML entities?', answer: 'Special codes representing characters. &lt; for <, &amp; for &, &nbsp; for space. Prevents HTML parsing issues.' },
        { question: 'When should I encode HTML entities?', answer: 'User input displayed in HTML, special characters in content, preventing XSS attacks.' },
        { question: 'What is the difference between named and numeric entities?', answer: '&lt; is named, &#60; is numeric. Both represent <. Named are more readable, numeric more universal.' },
      ],
      zh: [
        { question: '什么是 HTML 实体？', answer: '表示字符的特殊代码。&lt; 代表 <，&amp; 代表 &，&nbsp; 代表空格。防止 HTML 解析问题。' },
        { question: '什么时候应该编码 HTML 实体？', answer: '在 HTML 中显示的用户输入、内容中的特殊字符、防止 XSS 攻击。' },
        { question: '命名实体和数字实体有什么区别？', answer: '&lt; 是命名的，&#60; 是数字的。两者都代表 <。命名的更易读，数字的更通用。' },
      ],
    },
  },
];
