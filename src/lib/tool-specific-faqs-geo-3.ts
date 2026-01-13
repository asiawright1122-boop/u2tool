/**
 * GEO 优化的工具 FAQ 配置 - 第三批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_3: ToolSpecificFAQ[] = [
  // Markdown to HTML
  {
    slug: 'markdown-to-html',
    faqs: {
      en: [
        { question: 'How do I convert Markdown to HTML online?', answer: 'Paste your Markdown text and click Convert. The tool transforms Markdown syntax to clean HTML code instantly. Supports all standard Markdown features.' },
        { question: 'Does it support GitHub Flavored Markdown?', answer: 'Yes, we support GFM including tables, task lists, strikethrough, and fenced code blocks with syntax highlighting.' },
        { question: 'Can I preview the HTML output?', answer: 'Yes, switch to Preview mode to see how the HTML renders in a browser. You can toggle between code view and preview.' },
      ],
      zh: [
        { question: '如何在线将 Markdown 转换为 HTML？', answer: '粘贴 Markdown 文本并点击转换。工具会立即将 Markdown 语法转换为干净的 HTML 代码。支持所有标准 Markdown 功能。' },
        { question: '支持 GitHub 风格的 Markdown 吗？', answer: '是的，我们支持 GFM，包括表格、任务列表、删除线和带语法高亮的围栏代码块。' },
        { question: '可以预览 HTML 输出吗？', answer: '是的，切换到预览模式可以看到 HTML 在浏览器中的渲染效果。可以在代码视图和预览之间切换。' },
      ],
    },
  },

  // JSON to CSV
  {
    slug: 'json-to-csv',
    faqs: {
      en: [
        { question: 'How do I convert JSON to CSV online?', answer: 'Paste your JSON array and click Convert. The tool extracts keys as column headers and values as rows, creating a properly formatted CSV file.' },
        { question: 'What JSON structure is required?', answer: 'The tool works best with an array of objects with consistent keys. Nested objects are flattened using dot notation (e.g., user.name).' },
        { question: 'Can I customize the CSV delimiter?', answer: 'Yes, you can choose comma, semicolon, or tab as the delimiter. This is useful for different regional settings and applications.' },
      ],
      zh: [
        { question: '如何在线将 JSON 转换为 CSV？', answer: '粘贴 JSON 数组并点击转换。工具会提取键作为列标题，值作为行，创建格式正确的 CSV 文件。' },
        { question: '需要什么 JSON 结构？', answer: '工具最适合处理具有一致键的对象数组。嵌套对象使用点表示法展平（如 user.name）。' },
        { question: '可以自定义 CSV 分隔符吗？', answer: '是的，可以选择逗号、分号或制表符作为分隔符。这对于不同的区域设置和应用程序很有用。' },
      ],
    },
  },

  // CSV to JSON
  {
    slug: 'csv-to-json',
    faqs: {
      en: [
        { question: 'How do I convert CSV to JSON online?', answer: 'Paste your CSV data or upload a file. The tool uses the first row as keys and converts each subsequent row to a JSON object in an array.' },
        { question: 'How are data types handled?', answer: 'Numbers and booleans are automatically detected and converted. Strings remain as strings. You can enable strict mode to keep everything as strings.' },
        { question: 'Can I convert large CSV files?', answer: 'Yes, processing happens in your browser. Files up to 10MB work smoothly. For larger files, consider splitting them first.' },
      ],
      zh: [
        { question: '如何在线将 CSV 转换为 JSON？', answer: '粘贴 CSV 数据或上传文件。工具使用第一行作为键，将后续每行转换为数组中的 JSON 对象。' },
        { question: '数据类型如何处理？', answer: '数字和布尔值会自动检测并转换。字符串保持为字符串。可以启用严格模式将所有内容保持为字符串。' },
        { question: '可以转换大型 CSV 文件吗？', answer: '是的，处理在浏览器中进行。10MB 以内的文件运行流畅。对于更大的文件，建议先拆分。' },
      ],
    },
  },

  // Text Diff
  {
    slug: 'text-diff',
    faqs: {
      en: [
        { question: 'How do I compare two texts online?', answer: 'Paste original text on the left and modified text on the right, then click Compare. Differences are highlighted: red for deletions, green for additions.' },
        { question: 'Can I compare code files?', answer: 'Yes, the tool works with any text including code. Syntax highlighting is available for common programming languages.' },
        { question: 'What diff algorithms are used?', answer: 'We use the Myers diff algorithm, the same used by Git. It finds the minimal set of changes between two texts.' },
      ],
      zh: [
        { question: '如何在线比较两段文本？', answer: '在左侧粘贴原始文本，在右侧粘贴修改后的文本，然后点击比较。差异会高亮显示：红色表示删除，绿色表示添加。' },
        { question: '可以比较代码文件吗？', answer: '是的，工具适用于任何文本，包括代码。常见编程语言有语法高亮。' },
        { question: '使用什么差异算法？', answer: '我们使用 Myers 差异算法，与 Git 使用的相同。它能找到两段文本之间的最小更改集。' },
      ],
    },
  },

  // Epoch Converter
  {
    slug: 'epoch-converter',
    faqs: {
      en: [
        { question: 'What is Unix epoch time?', answer: 'Unix epoch is the number of seconds since January 1, 1970 (UTC). It\'s a standard way to represent time in computing, used in databases, APIs, and logs.' },
        { question: 'How do I convert epoch to date?', answer: 'Enter the epoch timestamp and the tool instantly shows the corresponding date and time in your local timezone and UTC.' },
        { question: 'Does it support milliseconds?', answer: 'Yes, we auto-detect whether your timestamp is in seconds (10 digits) or milliseconds (13 digits) and convert accordingly.' },
      ],
      zh: [
        { question: '什么是 Unix 纪元时间？', answer: 'Unix 纪元是自 1970 年 1 月 1 日（UTC）以来的秒数。这是计算机中表示时间的标准方式，用于数据库、API 和日志。' },
        { question: '如何将纪元转换为日期？', answer: '输入纪元时间戳，工具会立即显示对应的本地时区和 UTC 日期时间。' },
        { question: '支持毫秒吗？', answer: '是的，我们自动检测时间戳是秒（10 位）还是毫秒（13 位）并相应转换。' },
      ],
    },
  },

  // Crontab Generator
  {
    slug: 'crontab-generator',
    faqs: {
      en: [
        { question: 'How do I create a cron expression?', answer: 'Use our visual builder to select minute, hour, day, month, and weekday. The cron expression is generated automatically with a human-readable description.' },
        { question: 'What cron format is supported?', answer: 'We support standard 5-field cron (minute hour day month weekday) and extended 6-field format with seconds. Both Unix and Quartz formats are available.' },
        { question: 'Can I test when my cron job will run?', answer: 'Yes, enter any cron expression to see the next 10 scheduled execution times. This helps verify your schedule is correct.' },
      ],
      zh: [
        { question: '如何创建 cron 表达式？', answer: '使用可视化构建器选择分钟、小时、日期、月份和星期。cron 表达式会自动生成，并附带人类可读的描述。' },
        { question: '支持什么 cron 格式？', answer: '我们支持标准 5 字段 cron（分 时 日 月 周）和带秒的扩展 6 字段格式。Unix 和 Quartz 格式都可用。' },
        { question: '可以测试 cron 任务何时运行吗？', answer: '是的，输入任何 cron 表达式可以看到接下来 10 次计划执行时间。这有助于验证您的计划是否正确。' },
      ],
    },
  },

  // IP Address Lookup
  {
    slug: 'ip-lookup',
    faqs: {
      en: [
        { question: 'How do I find my IP address?', answer: 'Your public IP address is displayed automatically when you open the tool. It shows both IPv4 and IPv6 addresses if available.' },
        { question: 'What information can I get about an IP?', answer: 'Enter any IP to see geolocation (country, city), ISP, organization, timezone, and whether it\'s a VPN/proxy. Data is from multiple sources for accuracy.' },
        { question: 'Is IP lookup accurate?', answer: 'Geolocation is typically accurate to city level for most IPs. VPN and mobile IPs may show different locations. ISP and organization data is highly accurate.' },
      ],
      zh: [
        { question: '如何查找我的 IP 地址？', answer: '打开工具时会自动显示您的公共 IP 地址。如果可用，会同时显示 IPv4 和 IPv6 地址。' },
        { question: '可以获取 IP 的什么信息？', answer: '输入任何 IP 可以看到地理位置（国家、城市）、ISP、组织、时区以及是否是 VPN/代理。数据来自多个来源以确保准确性。' },
        { question: 'IP 查询准确吗？', answer: '对于大多数 IP，地理位置通常精确到城市级别。VPN 和移动 IP 可能显示不同位置。ISP 和组织数据非常准确。' },
      ],
    },
  },

  // JSON Path Finder
  {
    slug: 'json-path-finder',
    faqs: {
      en: [
        { question: 'What is JSONPath?', answer: 'JSONPath is a query language for JSON, similar to XPath for XML. It lets you extract specific values from complex JSON structures using path expressions like $.store.book[0].title.' },
        { question: 'How do I find a path in JSON?', answer: 'Paste your JSON and click on any value. The tool shows the JSONPath expression to access that value, which you can copy and use in your code.' },
        { question: 'What JSONPath syntax is supported?', answer: 'We support standard JSONPath including dot notation, bracket notation, wildcards (*), recursive descent (..), array slices, and filter expressions.' },
      ],
      zh: [
        { question: '什么是 JSONPath？', answer: 'JSONPath 是 JSON 的查询语言，类似于 XML 的 XPath。它允许您使用路径表达式（如 $.store.book[0].title）从复杂的 JSON 结构中提取特定值。' },
        { question: '如何在 JSON 中查找路径？', answer: '粘贴 JSON 并点击任何值。工具会显示访问该值的 JSONPath 表达式，您可以复制并在代码中使用。' },
        { question: '支持什么 JSONPath 语法？', answer: '我们支持标准 JSONPath，包括点表示法、括号表示法、通配符（*）、递归下降（..）、数组切片和过滤表达式。' },
      ],
    },
  },

  // HTML Beautifier
  {
    slug: 'html-beautifier',
    faqs: {
      en: [
        { question: 'How do I beautify HTML code online?', answer: 'Paste your HTML and click Beautify. The tool adds proper indentation, line breaks, and formats attributes for better readability.' },
        { question: 'Does it fix invalid HTML?', answer: 'The beautifier formats existing HTML but doesn\'t fix structural errors. Use an HTML validator first if you suspect syntax issues.' },
        { question: 'Can I customize the formatting?', answer: 'Yes, you can set indentation size (2 or 4 spaces), choose whether to wrap attributes, and configure line width for wrapping.' },
      ],
      zh: [
        { question: '如何在线美化 HTML 代码？', answer: '粘贴 HTML 并点击美化。工具会添加正确的缩进、换行并格式化属性以提高可读性。' },
        { question: '会修复无效的 HTML 吗？', answer: '美化器格式化现有 HTML 但不修复结构错误。如果怀疑有语法问题，请先使用 HTML 验证器。' },
        { question: '可以自定义格式吗？', answer: '是的，可以设置缩进大小（2 或 4 个空格）、选择是否换行属性，以及配置换行的行宽。' },
      ],
    },
  },

  // Text to Binary
  {
    slug: 'text-to-binary',
    faqs: {
      en: [
        { question: 'How do I convert text to binary?', answer: 'Enter your text and click Convert. Each character is converted to its 8-bit binary representation. Spaces between bytes make it readable.' },
        { question: 'What encoding is used?', answer: 'We use UTF-8 encoding by default. ASCII characters use 8 bits, while special characters may use multiple bytes (16, 24, or 32 bits).' },
        { question: 'Can I convert binary back to text?', answer: 'Yes, switch to Binary to Text mode. Paste binary digits (with or without spaces) and get the original text back.' },
      ],
      zh: [
        { question: '如何将文本转换为二进制？', answer: '输入文本并点击转换。每个字符都会转换为其 8 位二进制表示。字节之间的空格使其更易读。' },
        { question: '使用什么编码？', answer: '我们默认使用 UTF-8 编码。ASCII 字符使用 8 位，而特殊字符可能使用多个字节（16、24 或 32 位）。' },
        { question: '可以将二进制转换回文本吗？', answer: '是的，切换到二进制转文本模式。粘贴二进制数字（有或没有空格）即可获得原始文本。' },
      ],
    },
  },
];
