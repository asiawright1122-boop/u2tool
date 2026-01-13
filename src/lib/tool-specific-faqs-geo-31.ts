/**
 * GEO 优化的工具 FAQ 配置 - 第三十一批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_31: ToolSpecificFAQ[] = [
  // HTML Preview
  {
    slug: 'html-preview',
    faqs: {
      en: [
        { question: 'How do I preview HTML code?', answer: 'Paste HTML code in the editor. Live preview updates instantly. See how your HTML renders in real-time.' },
        { question: 'Does it support CSS and JavaScript?', answer: 'Yes, include <style> and <script> tags. Full HTML document preview with CSS styling and JS functionality.' },
        { question: 'Can I test responsive design?', answer: 'Yes, resize the preview panel or use device presets (mobile, tablet, desktop) to test responsive layouts.' },
      ],
      zh: [
        { question: '如何预览 HTML 代码？', answer: '在编辑器中粘贴 HTML 代码。实时预览即时更新。实时查看 HTML 的渲染效果。' },
        { question: '它支持 CSS 和 JavaScript 吗？', answer: '是的，包含 <style> 和 <script> 标签。完整的 HTML 文档预览，包括 CSS 样式和 JS 功能。' },
        { question: '可以测试响应式设计吗？', answer: '是的，调整预览面板大小或使用设备预设（移动、平板、桌面）来测试响应式布局。' },
      ],
    },
  },

  // Random Generator
  {
    slug: 'random-generator',
    faqs: {
      en: [
        { question: 'What can I generate randomly?', answer: 'Numbers, strings, passwords, colors, dates, names, and more. Customize length, range, and character sets.' },
        { question: 'Is the randomness cryptographically secure?', answer: 'Yes, uses Web Crypto API for secure random generation. Suitable for passwords and security tokens.' },
        { question: 'Can I generate multiple values at once?', answer: 'Yes, specify quantity to generate bulk random values. Export as list or JSON format.' },
      ],
      zh: [
        { question: '我可以随机生成什么？', answer: '数字、字符串、密码、颜色、日期、名称等。自定义长度、范围和字符集。' },
        { question: '随机性是加密安全的吗？', answer: '是的，使用 Web Crypto API 进行安全随机生成。适用于密码和安全令牌。' },
        { question: '可以一次生成多个值吗？', answer: '是的，指定数量以批量生成随机值。导出为列表或 JSON 格式。' },
      ],
    },
  },

  // String Escape
  {
    slug: 'string-escape',
    faqs: {
      en: [
        { question: 'What is string escaping?', answer: 'Converting special characters to escape sequences. "Hello\\nWorld" represents a newline. Essential for code strings.' },
        { question: 'What escape formats are supported?', answer: 'JavaScript/JSON, HTML entities, URL encoding, XML, CSV, and regex escaping. Choose based on your use case.' },
        { question: 'Can I unescape strings too?', answer: 'Yes, bidirectional conversion. Escape for code, unescape to see actual characters. Toggle between modes.' },
      ],
      zh: [
        { question: '什么是字符串转义？', answer: '将特殊字符转换为转义序列。"Hello\\nWorld"表示换行。对于代码字符串至关重要。' },
        { question: '支持哪些转义格式？', answer: 'JavaScript/JSON、HTML 实体、URL 编码、XML、CSV 和正则表达式转义。根据您的用例选择。' },
        { question: '也可以反转义字符串吗？', answer: '是的，双向转换。转义用于代码，反转义以查看实际字符。在模式之间切换。' },
      ],
    },
  },

  // YAML JSON Converter
  {
    slug: 'yaml-json',
    faqs: {
      en: [
        { question: 'How do I convert YAML to JSON?', answer: 'Paste YAML in input, click convert. Output is valid JSON. Preserves data types and nested structures.' },
        { question: 'How do I convert JSON to YAML?', answer: 'Paste JSON, select JSON to YAML mode. Output is clean YAML with proper indentation.' },
        { question: 'Which format should I use?', answer: 'YAML is more human-readable, good for config files. JSON is more universal, better for APIs and data exchange.' },
      ],
      zh: [
        { question: '如何将 YAML 转换为 JSON？', answer: '在输入中粘贴 YAML，点击转换。输出是有效的 JSON。保留数据类型和嵌套结构。' },
        { question: '如何将 JSON 转换为 YAML？', answer: '粘贴 JSON，选择 JSON 到 YAML 模式。输出是具有正确缩进的干净 YAML。' },
        { question: '我应该使用哪种格式？', answer: 'YAML 更易于人类阅读，适合配置文件。JSON 更通用，更适合 API 和数据交换。' },
      ],
    },
  },

  // Text Deduplicator
  {
    slug: 'text-deduplicator',
    faqs: {
      en: [
        { question: 'How do I remove duplicate lines?', answer: 'Paste text with duplicate lines. We remove duplicates keeping first occurrence. Choose to preserve or ignore order.' },
        { question: 'Is comparison case-sensitive?', answer: 'Configurable. Case-sensitive treats "Hello" and "hello" as different. Case-insensitive treats them as duplicates.' },
        { question: 'Can I remove duplicate words?', answer: 'Yes, switch to word mode. Removes duplicate words within text while preserving sentence structure.' },
      ],
      zh: [
        { question: '如何删除重复行？', answer: '粘贴包含重复行的文本。我们删除重复项，保留第一次出现的。选择保留或忽略顺序。' },
        { question: '比较区分大小写吗？', answer: '可配置。区分大小写将"Hello"和"hello"视为不同。不区分大小写将它们视为重复。' },
        { question: '可以删除重复的单词吗？', answer: '是的，切换到单词模式。删除文本中的重复单词，同时保留句子结构。' },
      ],
    },
  },

  // Color Blender
  {
    slug: 'color-blender',
    faqs: {
      en: [
        { question: 'How do I blend two colors?', answer: 'Enter two colors (hex, RGB, or pick). Adjust blend ratio. We show the resulting mixed color and intermediate steps.' },
        { question: 'What color spaces are used?', answer: 'Blend in RGB, HSL, or LAB color space. LAB produces more perceptually uniform gradients.' },
        { question: 'Can I create color gradients?', answer: 'Yes, specify number of steps between colors. We generate smooth gradient with all intermediate colors.' },
      ],
      zh: [
        { question: '如何混合两种颜色？', answer: '输入两种颜色（十六进制、RGB 或选择）。调整混合比例。我们显示结果混合颜色和中间步骤。' },
        { question: '使用什么颜色空间？', answer: '在 RGB、HSL 或 LAB 颜色空间中混合。LAB 产生更感知均匀的渐变。' },
        { question: '可以创建颜色渐变吗？', answer: '是的，指定颜色之间的步数。我们生成包含所有中间颜色的平滑渐变。' },
      ],
    },
  },

  // JSON Sorter
  {
    slug: 'json-sorter',
    faqs: {
      en: [
        { question: 'How do I sort JSON keys?', answer: 'Paste JSON, click sort. Keys are alphabetically ordered at all nesting levels. Arrays remain in original order.' },
        { question: 'Why sort JSON keys?', answer: 'Consistent key order makes JSON easier to compare, review in version control, and maintain across team.' },
        { question: 'Can I sort arrays too?', answer: 'Yes, enable array sorting. Sort by value for primitives, or by specific key for object arrays.' },
      ],
      zh: [
        { question: '如何排序 JSON 键？', answer: '粘贴 JSON，点击排序。键在所有嵌套级别按字母顺序排列。数组保持原始顺序。' },
        { question: '为什么要排序 JSON 键？', answer: '一致的键顺序使 JSON 更容易比较、在版本控制中审查，并在团队中维护。' },
        { question: '也可以排序数组吗？', answer: '是的，启用数组排序。对于原始值按值排序，对于对象数组按特定键排序。' },
      ],
    },
  },

  // Placeholder Image Generator
  {
    slug: 'placeholder-image',
    faqs: {
      en: [
        { question: 'How do I create placeholder images?', answer: 'Enter dimensions (width x height), choose background color and text. Download PNG or get data URL.' },
        { question: 'What sizes are commonly used?', answer: 'Common: 150x150 (avatar), 300x200 (thumbnail), 1200x630 (social share), 1920x1080 (hero image).' },
        { question: 'Can I add custom text?', answer: 'Yes, add dimension text, custom labels, or leave blank. Customize font size and text color.' },
      ],
      zh: [
        { question: '如何创建占位图像？', answer: '输入尺寸（宽 x 高），选择背景颜色和文本。下载 PNG 或获取数据 URL。' },
        { question: '常用的尺寸有哪些？', answer: '常见：150x150（头像）、300x200（缩略图）、1200x630（社交分享）、1920x1080（主图）。' },
        { question: '可以添加自定义文本吗？', answer: '是的，添加尺寸文本、自定义标签或留空。自定义字体大小和文本颜色。' },
      ],
    },
  },

  // Text Encryption
  {
    slug: 'text-encryption',
    faqs: {
      en: [
        { question: 'How do I encrypt text?', answer: 'Enter text and password. We encrypt using AES-256. Only someone with the password can decrypt.' },
        { question: 'What encryption algorithm is used?', answer: 'AES-256-GCM, industry standard. Provides both confidentiality and integrity. Used by governments and banks.' },
        { question: 'Is my password stored?', answer: 'No, all encryption happens locally in browser. Password never leaves your device. We cannot decrypt your data.' },
      ],
      zh: [
        { question: '如何加密文本？', answer: '输入文本和密码。我们使用 AES-256 加密。只有拥有密码的人才能解密。' },
        { question: '使用什么加密算法？', answer: 'AES-256-GCM，行业标准。提供机密性和完整性。被政府和银行使用。' },
        { question: '我的密码会被存储吗？', answer: '不会，所有加密都在浏览器本地进行。密码永远不会离开您的设备。我们无法解密您的数据。' },
      ],
    },
  },

  // File Hash Calculator
  {
    slug: 'file-hash',
    faqs: {
      en: [
        { question: 'What is a file hash?', answer: 'A hash is a unique fingerprint of file contents. Same file always produces same hash. Used to verify file integrity.' },
        { question: 'What hash algorithms are supported?', answer: 'MD5, SHA-1, SHA-256, SHA-384, SHA-512. SHA-256 recommended for security. MD5 for quick checksums.' },
        { question: 'How do I verify a downloaded file?', answer: 'Calculate hash of downloaded file, compare with hash provided by source. Match means file is unmodified.' },
      ],
      zh: [
        { question: '什么是文件哈希？', answer: '哈希是文件内容的唯一指纹。相同的文件总是产生相同的哈希。用于验证文件完整性。' },
        { question: '支持哪些哈希算法？', answer: 'MD5、SHA-1、SHA-256、SHA-384、SHA-512。推荐 SHA-256 用于安全性。MD5 用于快速校验。' },
        { question: '如何验证下载的文件？', answer: '计算下载文件的哈希，与来源提供的哈希比较。匹配意味着文件未被修改。' },
      ],
    },
  },
];
