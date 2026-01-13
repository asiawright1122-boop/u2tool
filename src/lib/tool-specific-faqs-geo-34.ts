/**
 * GEO 优化的工具 FAQ 配置 - 第三十四批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_34: ToolSpecificFAQ[] = [
  // Number Formatter
  {
    slug: 'number-formatter',
    faqs: {
      en: [
        { question: 'What number formats are supported?', answer: 'Thousands separators, decimal places, currency, percentage, scientific notation, custom formats.' },
        { question: 'How do I format numbers for different locales?', answer: 'Select locale. US uses 1,234.56, Germany uses 1.234,56. We handle locale-specific formatting.' },
        { question: 'Can I format large numbers?', answer: 'Yes, supports abbreviations: 1K, 1M, 1B. Also scientific notation: 1.23e6. Choose based on context.' },
      ],
      zh: [
        { question: '支持哪些数字格式？', answer: '千位分隔符、小数位数、货币、百分比、科学计数法、自定义格式。' },
        { question: '如何为不同地区格式化数字？', answer: '选择地区。美国使用 1,234.56，德国使用 1.234,56。我们处理特定地区的格式。' },
        { question: '可以格式化大数字吗？', answer: '是的，支持缩写：1K、1M、1B。也支持科学计数法：1.23e6。根据上下文选择。' },
      ],
    },
  },

  // HMAC Generator
  {
    slug: 'hmac-generator',
    faqs: {
      en: [
        { question: 'What is HMAC?', answer: 'Hash-based Message Authentication Code. Combines secret key with message hash. Verifies data integrity and authenticity.' },
        { question: 'What algorithms are supported?', answer: 'HMAC-SHA256, HMAC-SHA384, HMAC-SHA512, HMAC-MD5, HMAC-SHA1. SHA256 recommended for security.' },
        { question: 'How is HMAC used in APIs?', answer: 'Sign API requests with secret key. Server verifies signature. Prevents tampering and authenticates sender.' },
      ],
      zh: [
        { question: '什么是 HMAC？', answer: '基于哈希的消息认证码。将密钥与消息哈希结合。验证数据完整性和真实性。' },
        { question: '支持哪些算法？', answer: 'HMAC-SHA256、HMAC-SHA384、HMAC-SHA512、HMAC-MD5、HMAC-SHA1。推荐 SHA256 以确保安全。' },
        { question: 'HMAC 在 API 中如何使用？', answer: '使用密钥签名 API 请求。服务器验证签名。防止篡改并认证发送者。' },
      ],
    },
  },

  // Password Strength Checker
  {
    slug: 'password-strength',
    faqs: {
      en: [
        { question: 'How is password strength calculated?', answer: 'Based on length, character variety, patterns, and dictionary words. We estimate crack time.' },
        { question: 'What makes a strong password?', answer: '12+ characters, mix of upper/lower/numbers/symbols, no dictionary words, no personal info, unique per site.' },
        { question: 'Is my password sent to a server?', answer: 'No, all analysis happens locally in your browser. Your password never leaves your device.' },
      ],
      zh: [
        { question: '密码强度是如何计算的？', answer: '基于长度、字符多样性、模式和字典单词。我们估计破解时间。' },
        { question: '什么是强密码？', answer: '12 个以上字符，大小写/数字/符号混合，无字典单词，无个人信息，每个网站唯一。' },
        { question: '我的密码会发送到服务器吗？', answer: '不会，所有分析都在浏览器本地进行。您的密码永远不会离开您的设备。' },
      ],
    },
  },

  // TOTP Generator
  {
    slug: 'totp-generator',
    faqs: {
      en: [
        { question: 'What is TOTP?', answer: 'Time-based One-Time Password. Generates 6-digit codes that change every 30 seconds. Used for 2FA.' },
        { question: 'How do I set up TOTP?', answer: 'Enter secret key (Base32) from service. We generate current code. Add to authenticator app.' },
        { question: 'Why do codes expire?', answer: 'Time-based codes prevent replay attacks. Even if intercepted, code is useless after 30 seconds.' },
      ],
      zh: [
        { question: '什么是 TOTP？', answer: '基于时间的一次性密码。生成每 30 秒变化的 6 位数代码。用于双因素认证。' },
        { question: '如何设置 TOTP？', answer: '输入服务提供的密钥（Base32）。我们生成当前代码。添加到认证器应用。' },
        { question: '为什么代码会过期？', answer: '基于时间的代码防止重放攻击。即使被截获，代码在 30 秒后也无效。' },
      ],
    },
  },

  // User Agent Parser
  {
    slug: 'user-agent-parser',
    faqs: {
      en: [
        { question: 'What is a User Agent?', answer: 'String identifying browser, OS, and device. Sent with every HTTP request. Used for analytics and compatibility.' },
        { question: 'What information is extracted?', answer: 'Browser name/version, OS name/version, device type, rendering engine. Parsed from UA string.' },
        { question: 'Why parse User Agents?', answer: 'Analytics, browser-specific fixes, device detection, bot identification, security logging.' },
      ],
      zh: [
        { question: '什么是 User Agent？', answer: '标识浏览器、操作系统和设备的字符串。随每个 HTTP 请求发送。用于分析和兼容性。' },
        { question: '提取哪些信息？', answer: '浏览器名称/版本、操作系统名称/版本、设备类型、渲染引擎。从 UA 字符串解析。' },
        { question: '为什么要解析 User Agent？', answer: '分析、浏览器特定修复、设备检测、机器人识别、安全日志。' },
      ],
    },
  },

  // CIDR Calculator
  {
    slug: 'cidr-calculator',
    faqs: {
      en: [
        { question: 'What is CIDR notation?', answer: 'Classless Inter-Domain Routing. 192.168.1.0/24 means 256 addresses. The /24 is the subnet mask.' },
        { question: 'How do I calculate subnet size?', answer: 'Enter CIDR. We show network address, broadcast, first/last usable IP, and total host count.' },
        { question: 'What is the difference between /24 and /16?', answer: '/24 = 256 IPs (254 usable), /16 = 65,536 IPs (65,534 usable). Smaller number = larger network.' },
      ],
      zh: [
        { question: '什么是 CIDR 表示法？', answer: '无类别域间路由。192.168.1.0/24 表示 256 个地址。/24 是子网掩码。' },
        { question: '如何计算子网大小？', answer: '输入 CIDR。我们显示网络地址、广播地址、第一个/最后一个可用 IP 和总主机数。' },
        { question: '/24 和 /16 有什么区别？', answer: '/24 = 256 个 IP（254 个可用），/16 = 65,536 个 IP（65,534 个可用）。数字越小 = 网络越大。' },
      ],
    },
  },

  // HTTP Header Parser
  {
    slug: 'http-header-parser',
    faqs: {
      en: [
        { question: 'What are HTTP headers?', answer: 'Metadata sent with HTTP requests/responses. Include content type, caching, authentication, cookies.' },
        { question: 'How do I parse headers?', answer: 'Paste raw headers. We extract each header name and value, explain common headers.' },
        { question: 'What are important security headers?', answer: 'Content-Security-Policy, X-Frame-Options, Strict-Transport-Security, X-Content-Type-Options.' },
      ],
      zh: [
        { question: '什么是 HTTP 头？', answer: '随 HTTP 请求/响应发送的元数据。包括内容类型、缓存、认证、cookies。' },
        { question: '如何解析头？', answer: '粘贴原始头。我们提取每个头名称和值，解释常见头。' },
        { question: '重要的安全头有哪些？', answer: 'Content-Security-Policy、X-Frame-Options、Strict-Transport-Security、X-Content-Type-Options。' },
      ],
    },
  },

  // Statistics Calculator
  {
    slug: 'statistics-calculator',
    faqs: {
      en: [
        { question: 'What statistics are calculated?', answer: 'Mean, median, mode, standard deviation, variance, range, quartiles, percentiles.' },
        { question: 'How do I enter data?', answer: 'Enter numbers separated by commas, spaces, or newlines. We parse and calculate all statistics.' },
        { question: 'What is standard deviation?', answer: 'Measures data spread from mean. Low SD = data clustered near mean. High SD = data spread out.' },
      ],
      zh: [
        { question: '计算哪些统计数据？', answer: '平均值、中位数、众数、标准差、方差、范围、四分位数、百分位数。' },
        { question: '如何输入数据？', answer: '输入用逗号、空格或换行分隔的数字。我们解析并计算所有统计数据。' },
        { question: '什么是标准差？', answer: '测量数据与平均值的离散程度。低标准差 = 数据聚集在平均值附近。高标准差 = 数据分散。' },
      ],
    },
  },

  // Text Sorter
  {
    slug: 'text-sorter',
    faqs: {
      en: [
        { question: 'How do I sort text lines?', answer: 'Paste text, choose sort order (A-Z, Z-A, by length, numeric). Lines are sorted accordingly.' },
        { question: 'Can I sort case-insensitively?', answer: 'Yes, enable case-insensitive option. "Apple" and "apple" treated as equal for sorting.' },
        { question: 'How does numeric sorting work?', answer: 'Sorts by number value, not string. "2" comes before "10" (unlike alphabetical where "10" < "2").' },
      ],
      zh: [
        { question: '如何排序文本行？', answer: '粘贴文本，选择排序顺序（A-Z、Z-A、按长度、数字）。行相应排序。' },
        { question: '可以不区分大小写排序吗？', answer: '是的，启用不区分大小写选项。"Apple"和"apple"在排序时被视为相等。' },
        { question: '数字排序如何工作？', answer: '按数字值排序，而不是字符串。"2"在"10"之前（不像字母顺序中"10"<"2"）。' },
      ],
    },
  },

  // Text Extractor
  {
    slug: 'text-extractor',
    faqs: {
      en: [
        { question: 'What can I extract from text?', answer: 'Emails, URLs, phone numbers, IP addresses, dates, numbers, hashtags, mentions using regex patterns.' },
        { question: 'How do I extract all emails?', answer: 'Paste text, select "Emails" extraction type. All email addresses are extracted and listed.' },
        { question: 'Can I use custom patterns?', answer: 'Yes, enter custom regex pattern. We extract all matches from your text.' },
      ],
      zh: [
        { question: '可以从文本中提取什么？', answer: '使用正则表达式模式提取电子邮件、URL、电话号码、IP 地址、日期、数字、标签、提及。' },
        { question: '如何提取所有电子邮件？', answer: '粘贴文本，选择"电子邮件"提取类型。所有电子邮件地址被提取并列出。' },
        { question: '可以使用自定义模式吗？', answer: '是的，输入自定义正则表达式模式。我们从您的文本中提取所有匹配项。' },
      ],
    },
  },
];
