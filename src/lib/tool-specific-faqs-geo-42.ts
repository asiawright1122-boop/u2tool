/**
 * GEO 优化的工具 FAQ 配置 - 第四十二批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_42: ToolSpecificFAQ[] = [
  // CRC32 Calculator
  {
    slug: 'crc32-calculator',
    faqs: {
      en: [
        { question: 'What is CRC32?', answer: 'Cyclic Redundancy Check, 32-bit. Fast checksum for error detection. Used in ZIP files, Ethernet, PNG.' },
        { question: 'How is CRC32 different from MD5/SHA?', answer: 'CRC32 is faster but not cryptographic. Good for error detection, not security. 32-bit vs 128/256-bit.' },
        { question: 'When should I use CRC32?', answer: 'File integrity checks, data transmission verification, quick checksums. Not for passwords or security.' },
      ],
      zh: [
        { question: '什么是 CRC32？', answer: '循环冗余校验，32 位。用于错误检测的快速校验和。用于 ZIP 文件、以太网、PNG。' },
        { question: 'CRC32 与 MD5/SHA 有什么不同？', answer: 'CRC32 更快但不是加密的。适合错误检测，不适合安全。32 位 vs 128/256 位。' },
        { question: '什么时候应该使用 CRC32？', answer: '文件完整性检查、数据传输验证、快速校验和。不用于密码或安全。' },
      ],
    },
  },

  // MAC Address Generator
  {
    slug: 'mac-address-generator',
    faqs: {
      en: [
        { question: 'What is a MAC address?', answer: 'Media Access Control address. 48-bit hardware identifier for network interfaces. Format: XX:XX:XX:XX:XX:XX.' },
        { question: 'Why generate random MAC addresses?', answer: 'Testing, privacy (MAC spoofing), virtual machines, network simulations.' },
        { question: 'What is a locally administered MAC?', answer: 'Second hex digit is 2, 6, A, or E. Indicates not assigned by manufacturer. Safe for testing.' },
      ],
      zh: [
        { question: '什么是 MAC 地址？', answer: '媒体访问控制地址。网络接口的 48 位硬件标识符。格式：XX:XX:XX:XX:XX:XX。' },
        { question: '为什么要生成随机 MAC 地址？', answer: '测试、隐私（MAC 欺骗）、虚拟机、网络模拟。' },
        { question: '什么是本地管理的 MAC？', answer: '第二个十六进制数字是 2、6、A 或 E。表示不是由制造商分配的。测试安全。' },
      ],
    },
  },

  // IP Validator
  {
    slug: 'ip-validator',
    faqs: {
      en: [
        { question: 'How do I validate an IP address?', answer: 'Enter IP address. We check format, range validity for IPv4 (0-255) and IPv6.' },
        { question: 'What makes an IP invalid?', answer: 'IPv4: octets >255, wrong format. IPv6: invalid hex, wrong segment count. We explain the issue.' },
        { question: 'Does it detect IP type?', answer: 'Yes, identifies public/private, loopback, multicast, link-local, and reserved ranges.' },
      ],
      zh: [
        { question: '如何验证 IP 地址？', answer: '输入 IP 地址。我们检查 IPv4（0-255）和 IPv6 的格式、范围有效性。' },
        { question: '什么使 IP 无效？', answer: 'IPv4：八位字节 >255，格式错误。IPv6：无效的十六进制，段数错误。我们解释问题。' },
        { question: '它能检测 IP 类型吗？', answer: '是的，识别公共/私有、回环、多播、链路本地和保留范围。' },
      ],
    },
  },

  // JSON Merger
  {
    slug: 'json-merger',
    faqs: {
      en: [
        { question: 'How do I merge JSON objects?', answer: 'Paste two or more JSON objects. We deep merge them. Later values override earlier for same keys.' },
        { question: 'How are arrays handled?', answer: 'Options: concatenate, replace, or merge by index. Choose based on your data structure needs.' },
        { question: 'Can I merge JSON files?', answer: 'Yes, upload multiple JSON files. We merge all into single output. Download or copy result.' },
      ],
      zh: [
        { question: '如何合并 JSON 对象？', answer: '粘贴两个或更多 JSON 对象。我们深度合并它们。相同键的后面值覆盖前面的。' },
        { question: '数组如何处理？', answer: '选项：连接、替换或按索引合并。根据您的数据结构需求选择。' },
        { question: '可以合并 JSON 文件吗？', answer: '是的，上传多个 JSON 文件。我们将所有文件合并为单个输出。下载或复制结果。' },
      ],
    },
  },

  // Text Template
  {
    slug: 'text-template',
    faqs: {
      en: [
        { question: 'How do I use text templates?', answer: 'Create template with {{variables}}. Provide values. We replace placeholders with your data.' },
        { question: 'Can I use conditionals?', answer: 'Yes, {{#if variable}}...{{/if}} for conditional content. {{#each array}} for loops.' },
        { question: 'What template syntax is used?', answer: 'Handlebars-like syntax. Simple and powerful. Supports variables, conditionals, loops, helpers.' },
      ],
      zh: [
        { question: '如何使用文本模板？', answer: '创建带有 {{variables}} 的模板。提供值。我们用您的数据替换占位符。' },
        { question: '可以使用条件吗？', answer: '是的，{{#if variable}}...{{/if}} 用于条件内容。{{#each array}} 用于循环。' },
        { question: '使用什么模板语法？', answer: '类似 Handlebars 的语法。简单而强大。支持变量、条件、循环、助手。' },
      ],
    },
  },

  // Base Calculator
  {
    slug: 'base-calculator',
    faqs: {
      en: [
        { question: 'What is a base calculator?', answer: 'Perform arithmetic in any number base (2-36). Add, subtract, multiply, divide in binary, hex, etc.' },
        { question: 'How do I add hex numbers?', answer: 'Enter numbers, select base 16. We calculate and show result in same base. FF + 1 = 100.' },
        { question: 'Can I mix different bases?', answer: 'Yes, enter each number with its base. We convert, calculate, and show result in your chosen base.' },
      ],
      zh: [
        { question: '什么是进制计算器？', answer: '在任何进制（2-36）中执行算术。在二进制、十六进制等中加、减、乘、除。' },
        { question: '如何添加十六进制数？', answer: '输入数字，选择基数 16。我们计算并以相同基数显示结果。FF + 1 = 100。' },
        { question: '可以混合不同的进制吗？', answer: '是的，输入每个数字及其基数。我们转换、计算并以您选择的基数显示结果。' },
      ],
    },
  },

  // Color Name Finder
  {
    slug: 'color-name-finder',
    faqs: {
      en: [
        { question: 'How do I find a color name?', answer: 'Enter hex code or pick color. We find the closest named color from CSS/HTML color names.' },
        { question: 'How many color names are there?', answer: '140 CSS named colors plus extended palettes. We show closest match and similar alternatives.' },
        { question: 'Can I search by name?', answer: 'Yes, type color name to see its hex value. Search "blue" to see all blue variants.' },
      ],
      zh: [
        { question: '如何找到颜色名称？', answer: '输入十六进制代码或选择颜色。我们从 CSS/HTML 颜色名称中找到最接近的命名颜色。' },
        { question: '有多少颜色名称？', answer: '140 个 CSS 命名颜色加上扩展调色板。我们显示最接近的匹配和类似的替代方案。' },
        { question: '可以按名称搜索吗？', answer: '是的，输入颜色名称以查看其十六进制值。搜索"blue"以查看所有蓝色变体。' },
      ],
    },
  },

  // Character Frequency Analyzer
  {
    slug: 'char-frequency',
    faqs: {
      en: [
        { question: 'What does this tool analyze?', answer: 'Counts occurrence of each character in text. Shows frequency, percentage, and visual chart.' },
        { question: 'Why analyze character frequency?', answer: 'Cryptanalysis, text analysis, detecting patterns, language identification, data validation.' },
        { question: 'Can I see letter frequency only?', answer: 'Yes, filter to show only letters, only numbers, or all characters. Ignore case option available.' },
      ],
      zh: [
        { question: '这个工具分析什么？', answer: '计算文本中每个字符的出现次数。显示频率、百分比和可视化图表。' },
        { question: '为什么要分析字符频率？', answer: '密码分析、文本分析、检测模式、语言识别、数据验证。' },
        { question: '可以只看字母频率吗？', answer: '是的，过滤以仅显示字母、仅数字或所有字符。可用忽略大小写选项。' },
      ],
    },
  },

  // JSON to Dart
  {
    slug: 'json-to-dart',
    faqs: {
      en: [
        { question: 'How do I convert JSON to Dart?', answer: 'Paste JSON, we generate Dart classes with fromJson/toJson methods for Flutter/Dart projects.' },
        { question: 'Does it support null safety?', answer: 'Yes, generates null-safe Dart code. Nullable fields use Type? syntax. Required fields are non-null.' },
        { question: 'Can I use with json_serializable?', answer: 'Yes, option to generate @JsonSerializable annotations for code generation approach.' },
      ],
      zh: [
        { question: '如何将 JSON 转换为 Dart？', answer: '粘贴 JSON，我们为 Flutter/Dart 项目生成带有 fromJson/toJson 方法的 Dart 类。' },
        { question: '它支持空安全吗？', answer: '是的，生成空安全的 Dart 代码。可空字段使用 Type? 语法。必需字段是非空的。' },
        { question: '可以与 json_serializable 一起使用吗？', answer: '是的，可选择生成 @JsonSerializable 注解用于代码生成方法。' },
      ],
    },
  },

  // SQL to JSON
  {
    slug: 'sql-to-json',
    faqs: {
      en: [
        { question: 'How do I convert SQL to JSON?', answer: 'Paste SQL query result or CREATE TABLE. We convert to JSON array of objects.' },
        { question: 'What SQL formats are supported?', answer: 'Query results (tabular), CREATE TABLE statements, INSERT statements. Auto-detected.' },
        { question: 'How are data types mapped?', answer: 'INT→number, VARCHAR→string, BOOLEAN→boolean, DATE→ISO string, NULL→null.' },
      ],
      zh: [
        { question: '如何将 SQL 转换为 JSON？', answer: '粘贴 SQL 查询结果或 CREATE TABLE。我们转换为对象的 JSON 数组。' },
        { question: '支持哪些 SQL 格式？', answer: '查询结果（表格）、CREATE TABLE 语句、INSERT 语句。自动检测。' },
        { question: '数据类型如何映射？', answer: 'INT→number，VARCHAR→string，BOOLEAN→boolean，DATE→ISO 字符串，NULL→null。' },
      ],
    },
  },
];
