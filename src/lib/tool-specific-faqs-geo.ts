/**
 * GEO 优化的工具 FAQ 配置
 * 针对 AI 搜索引擎优化的高质量 FAQ 内容
 * 包含答案块格式，便于 AI 引用
 * 
 * @see docs/SEO_GEO_COMPREHENSIVE_AUDIT.md
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

/**
 * GEO 优化的工具 FAQ
 * 特点：
 * 1. 问题以 How/What/Why/Can/Is 开头
 * 2. 答案简洁明了，50-100 词
 * 3. 包含具体数据和事实
 * 4. 适合 AI 引用的格式
 */
export const GEO_TOOL_FAQS: ToolSpecificFAQ[] = [
  // URL Encoder
  {
    slug: 'url-encoder',
    faqs: {
      en: [
        {
          question: 'How do I URL encode a string online for free?',
          answer: 'Paste your text into the input field and click Encode. Special characters like spaces become %20, ampersands become %26, and non-ASCII characters are converted to UTF-8 percent-encoded format. The process is instant and runs entirely in your browser.',
        },
        {
          question: 'What is the difference between encodeURI and encodeURIComponent?',
          answer: 'encodeURI preserves URL structure characters (:, /, ?, &, =) and is used for complete URLs. encodeURIComponent encodes everything except alphanumerics and is used for individual parameter values. Use encodeURIComponent for query string values.',
        },
        {
          question: 'Why do I need to URL encode special characters?',
          answer: 'URLs can only contain ASCII characters. Special characters like spaces, &, ?, = have reserved meanings in URLs. Encoding converts these to safe percent-encoded format, preventing parsing errors and ensuring data integrity in web requests.',
        },
      ],
      zh: [
        {
          question: '如何免费在线进行 URL 编码？',
          answer: '将文本粘贴到输入框，点击编码按钮。空格会变成 %20，& 变成 %26，非 ASCII 字符会转换为 UTF-8 百分号编码格式。处理过程即时完成，完全在浏览器中运行。',
        },
        {
          question: 'encodeURI 和 encodeURIComponent 有什么区别？',
          answer: 'encodeURI 保留 URL 结构字符（:、/、?、&、=），用于完整 URL。encodeURIComponent 编码除字母数字外的所有字符，用于单个参数值。查询字符串值应使用 encodeURIComponent。',
        },
        {
          question: '为什么需要对特殊字符进行 URL 编码？',
          answer: 'URL 只能包含 ASCII 字符。空格、&、?、= 等特殊字符在 URL 中有保留含义。编码将这些转换为安全的百分号格式，防止解析错误并确保 Web 请求中的数据完整性。',
        },
      ],
    },
  },

  // JWT Decoder
  {
    slug: 'jwt-decoder',
    faqs: {
      en: [
        {
          question: 'How do I decode a JWT token online without the secret key?',
          answer: 'Paste your JWT into the input field. The tool instantly decodes the header and payload (claims) without needing the secret key. JWTs are base64-encoded, not encrypted, so anyone can read the payload. The signature cannot be verified without the key.',
        },
        {
          question: 'What information is stored in a JWT token?',
          answer: 'A JWT contains three parts: Header (algorithm and token type), Payload (claims like user ID, expiration time, issuer), and Signature (verification hash). Common claims include iss (issuer), exp (expiration), sub (subject), and iat (issued at).',
        },
        {
          question: 'Is it safe to decode JWT tokens in an online tool?',
          answer: 'Yes, with our tool. All decoding happens locally in your browser using JavaScript. The token is never sent to any server. However, never share JWTs containing sensitive data publicly, as the payload is readable by anyone.',
        },
      ],
      zh: [
        {
          question: '如何在线解码 JWT 令牌而不需要密钥？',
          answer: '将 JWT 粘贴到输入框。工具会立即解码 header 和 payload（声明），无需密钥。JWT 是 base64 编码的，不是加密的，任何人都可以读取 payload。没有密钥无法验证签名。',
        },
        {
          question: 'JWT 令牌中存储了什么信息？',
          answer: 'JWT 包含三部分：Header（算法和令牌类型）、Payload（声明如用户 ID、过期时间、发行者）和 Signature（验证哈希）。常见声明包括 iss（发行者）、exp（过期时间）、sub（主题）和 iat（签发时间）。',
        },
        {
          question: '在在线工具中解码 JWT 令牌安全吗？',
          answer: '使用我们的工具是安全的。所有解码都在浏览器中使用 JavaScript 本地进行。令牌永远不会发送到任何服务器。但是，永远不要公开分享包含敏感数据的 JWT，因为 payload 任何人都可以读取。',
        },
      ],
    },
  },


  // XML Formatter
  {
    slug: 'xml-formatter',
    faqs: {
      en: [
        {
          question: 'How do I format and beautify XML online?',
          answer: 'Paste your XML into the input field and click Format. The tool adds proper indentation, line breaks, and validates syntax. You can customize indentation size (2 or 4 spaces). Invalid XML will show error messages with line numbers.',
        },
        {
          question: 'What is the difference between XML and JSON formatting?',
          answer: 'XML uses tags with attributes and supports namespaces, schemas, and comments. JSON is lighter with key-value pairs. XML is common in enterprise systems, SOAP APIs, and configuration files. JSON dominates REST APIs and web applications.',
        },
        {
          question: 'Can this tool validate XML against a schema (XSD)?',
          answer: 'This tool validates XML syntax (well-formedness) but not schema validation. It checks for proper tag nesting, attribute formatting, and character encoding. For XSD validation, you need a dedicated XML schema validator.',
        },
      ],
      zh: [
        {
          question: '如何在线格式化和美化 XML？',
          answer: '将 XML 粘贴到输入框，点击格式化。工具会添加正确的缩进、换行并验证语法。可以自定义缩进大小（2 或 4 个空格）。无效的 XML 会显示带行号的错误信息。',
        },
        {
          question: 'XML 和 JSON 格式化有什么区别？',
          answer: 'XML 使用带属性的标签，支持命名空间、模式和注释。JSON 更轻量，使用键值对。XML 常见于企业系统、SOAP API 和配置文件。JSON 主导 REST API 和 Web 应用。',
        },
        {
          question: '这个工具可以根据 XSD 模式验证 XML 吗？',
          answer: '此工具验证 XML 语法（格式良好性）但不进行模式验证。它检查标签嵌套、属性格式和字符编码。XSD 验证需要专门的 XML 模式验证器。',
        },
      ],
    },
  },

  // Color Converter
  {
    slug: 'color-converter',
    faqs: {
      en: [
        {
          question: 'How do I convert HEX color to RGB online?',
          answer: 'Enter your HEX color code (e.g., #FF5733 or FF5733) in the input field. The tool instantly converts it to RGB (255, 87, 51), HSL, HSV, and CMYK formats. You can also start with any format and convert to others.',
        },
        {
          question: 'What is the difference between RGB, HEX, and HSL color formats?',
          answer: 'RGB uses red, green, blue values (0-255). HEX is RGB in hexadecimal (#RRGGBB). HSL uses hue (0-360°), saturation, and lightness (0-100%). HSL is more intuitive for adjusting colors. CMYK is for print (cyan, magenta, yellow, black).',
        },
        {
          question: 'Which color format should I use for web development?',
          answer: 'HEX (#FF5733) is most common in CSS. RGB/RGBA is useful when you need transparency. HSL is best for programmatically adjusting colors (lightening, darkening). Modern CSS supports all formats, so choose based on your workflow.',
        },
      ],
      zh: [
        {
          question: '如何在线将 HEX 颜色转换为 RGB？',
          answer: '在输入框中输入 HEX 颜色代码（如 #FF5733 或 FF5733）。工具会立即转换为 RGB（255, 87, 51）、HSL、HSV 和 CMYK 格式。也可以从任何格式开始转换为其他格式。',
        },
        {
          question: 'RGB、HEX 和 HSL 颜色格式有什么区别？',
          answer: 'RGB 使用红、绿、蓝值（0-255）。HEX 是十六进制的 RGB（#RRGGBB）。HSL 使用色相（0-360°）、饱和度和亮度（0-100%）。HSL 更直观地调整颜色。CMYK 用于印刷（青、品红、黄、黑）。',
        },
        {
          question: 'Web 开发应该使用哪种颜色格式？',
          answer: 'HEX（#FF5733）在 CSS 中最常见。RGB/RGBA 在需要透明度时有用。HSL 最适合程序化调整颜色（变亮、变暗）。现代 CSS 支持所有格式，根据工作流程选择。',
        },
      ],
    },
  },

  // Diff Checker
  {
    slug: 'diff-checker',
    faqs: {
      en: [
        {
          question: 'How do I compare two texts online and find differences?',
          answer: 'Paste your original text in the left panel and modified text in the right panel. Click Compare to see differences highlighted: red for deletions, green for additions. Line-by-line and character-level differences are shown.',
        },
        {
          question: 'What types of files can I compare with this diff tool?',
          answer: 'You can compare any plain text: code (JavaScript, Python, HTML, CSS), configuration files (JSON, YAML), documents, and more. The tool works with any text content regardless of programming language or format.',
        },
        {
          question: 'Can I ignore whitespace when comparing texts?',
          answer: 'Yes, enable "Ignore Whitespace" option to focus on meaningful changes. This ignores differences in spaces, tabs, and line endings - useful when comparing code with different formatting styles.',
        },
      ],
      zh: [
        {
          question: '如何在线比较两段文本并找出差异？',
          answer: '在左侧面板粘贴原始文本，在右侧面板粘贴修改后的文本。点击比较查看高亮显示的差异：红色表示删除，绿色表示添加。显示逐行和字符级别的差异。',
        },
        {
          question: '这个差异工具可以比较哪些类型的文件？',
          answer: '可以比较任何纯文本：代码（JavaScript、Python、HTML、CSS）、配置文件（JSON、YAML）、文档等。该工具适用于任何文本内容，不受编程语言或格式限制。',
        },
        {
          question: '比较文本时可以忽略空白字符吗？',
          answer: '是的，启用"忽略空白"选项可以专注于有意义的更改。这会忽略空格、制表符和换行符的差异 - 在比较不同格式风格的代码时很有用。',
        },
      ],
    },
  },

  // Code Minifier
  {
    slug: 'code-minifier',
    faqs: {
      en: [
        {
          question: 'How do I minify JavaScript code online?',
          answer: 'Paste your JavaScript code and click Minify. The tool removes whitespace, comments, and shortens variable names to reduce file size. Typical reduction is 30-70% depending on code structure and comments.',
        },
        {
          question: 'What is the difference between minification and compression?',
          answer: 'Minification removes unnecessary characters from code (whitespace, comments) while keeping it executable. Compression (like gzip) is a separate step that further reduces transfer size. Use both for optimal performance.',
        },
        {
          question: 'Will minified code work the same as the original?',
          answer: 'Yes, minified code is functionally identical to the original. Only formatting and comments are removed. However, debugging minified code is harder, so keep original source files and use source maps in production.',
        },
      ],
      zh: [
        {
          question: '如何在线压缩 JavaScript 代码？',
          answer: '粘贴 JavaScript 代码并点击压缩。工具会移除空白、注释并缩短变量名以减小文件大小。根据代码结构和注释，通常可减少 30-70%。',
        },
        {
          question: '代码压缩和 gzip 压缩有什么区别？',
          answer: '代码压缩移除代码中不必要的字符（空白、注释）同时保持可执行性。gzip 压缩是另一个步骤，进一步减少传输大小。两者结合使用可获得最佳性能。',
        },
        {
          question: '压缩后的代码和原始代码功能一样吗？',
          answer: '是的，压缩后的代码功能与原始代码完全相同。只移除了格式和注释。但是，调试压缩代码更困难，所以保留原始源文件并在生产环境中使用 source map。',
        },
      ],
    },
  },

  // Timestamp Converter
  {
    slug: 'timestamp-converter',
    faqs: {
      en: [
        {
          question: 'How do I convert Unix timestamp to human-readable date?',
          answer: 'Enter the Unix timestamp (seconds since January 1, 1970) and the tool instantly shows the corresponding date and time. Supports both seconds (10 digits) and milliseconds (13 digits) formats.',
        },
        {
          question: 'What is a Unix timestamp and why is it used?',
          answer: 'Unix timestamp is the number of seconds since January 1, 1970 (UTC). It\'s used because it\'s timezone-independent, easy to store (single integer), and simple to compare. Common in databases, APIs, and log files.',
        },
        {
          question: 'How do I get the current Unix timestamp?',
          answer: 'Click "Now" button to get the current timestamp. In JavaScript: Date.now() (milliseconds) or Math.floor(Date.now()/1000) (seconds). In Python: import time; time.time().',
        },
      ],
      zh: [
        {
          question: '如何将 Unix 时间戳转换为可读日期？',
          answer: '输入 Unix 时间戳（自 1970 年 1 月 1 日以来的秒数），工具会立即显示对应的日期和时间。支持秒（10 位）和毫秒（13 位）两种格式。',
        },
        {
          question: '什么是 Unix 时间戳，为什么要使用它？',
          answer: 'Unix 时间戳是自 1970 年 1 月 1 日（UTC）以来的秒数。使用它是因为它与时区无关、易于存储（单个整数）且便于比较。常用于数据库、API 和日志文件。',
        },
        {
          question: '如何获取当前的 Unix 时间戳？',
          answer: '点击"现在"按钮获取当前时间戳。JavaScript 中：Date.now()（毫秒）或 Math.floor(Date.now()/1000)（秒）。Python 中：import time; time.time()。',
        },
      ],
    },
  },

  // Regex Tester
  {
    slug: 'regex-tester',
    faqs: {
      en: [
        {
          question: 'How do I test a regular expression online?',
          answer: 'Enter your regex pattern in the pattern field and test text below. Matches are highlighted in real-time. Use flags like g (global), i (case-insensitive), m (multiline) to modify matching behavior.',
        },
        {
          question: 'What are the most common regex patterns?',
          answer: 'Email: ^[\\w.-]+@[\\w.-]+\\.\\w+$. URL: https?://[\\w.-]+. Phone: \\d{3}-\\d{3}-\\d{4}. IP: \\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}. These are starting points - adjust based on your specific needs.',
        },
        {
          question: 'Why is my regex not matching as expected?',
          answer: 'Common issues: forgetting to escape special characters (. * + ?), missing flags (g for multiple matches), greedy vs lazy quantifiers (* vs *?), and anchor misuse (^ $ for line vs string). Test incrementally to debug.',
        },
      ],
      zh: [
        {
          question: '如何在线测试正则表达式？',
          answer: '在模式字段中输入正则表达式，在下方输入测试文本。匹配项会实时高亮显示。使用标志如 g（全局）、i（不区分大小写）、m（多行）来修改匹配行为。',
        },
        {
          question: '最常用的正则表达式模式有哪些？',
          answer: '邮箱：^[\\w.-]+@[\\w.-]+\\.\\w+$。URL：https?://[\\w.-]+。电话：\\d{3}-\\d{3}-\\d{4}。IP：\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}。这些是起点 - 根据具体需求调整。',
        },
        {
          question: '为什么我的正则表达式没有按预期匹配？',
          answer: '常见问题：忘记转义特殊字符（. * + ?）、缺少标志（g 用于多次匹配）、贪婪与懒惰量词（* vs *?）、锚点误用（^ $ 用于行 vs 字符串）。逐步测试以调试。',
        },
      ],
    },
  },
];
