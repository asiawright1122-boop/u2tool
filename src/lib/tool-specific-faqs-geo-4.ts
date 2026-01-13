/**
 * GEO 优化的工具 FAQ 配置 - 第四批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_4: ToolSpecificFAQ[] = [
  // Hex to RGB
  {
    slug: 'hex-to-rgb',
    faqs: {
      en: [
        { question: 'How do I convert HEX to RGB?', answer: 'Enter a HEX color code like #FF5733 or FF5733. The tool instantly shows RGB values (255, 87, 51) that you can use in CSS or design software.' },
        { question: 'What HEX formats are accepted?', answer: 'Both 6-digit (#FF5733) and 3-digit shorthand (#F53) formats work. The # symbol is optional. We also support 8-digit HEX with alpha channel.' },
        { question: 'Can I convert RGB back to HEX?', answer: 'Yes, enter RGB values (0-255 for each channel) and get the HEX code. Useful when copying colors from design tools to CSS.' },
      ],
      zh: [
        { question: '如何将 HEX 转换为 RGB？', answer: '输入 HEX 颜色代码如 #FF5733 或 FF5733。工具会立即显示 RGB 值（255, 87, 51），可用于 CSS 或设计软件。' },
        { question: '接受什么 HEX 格式？', answer: '6 位（#FF5733）和 3 位简写（#F53）格式都可以。# 符号是可选的。我们还支持带 alpha 通道的 8 位 HEX。' },
        { question: '可以将 RGB 转换回 HEX 吗？', answer: '是的，输入 RGB 值（每个通道 0-255）即可获得 HEX 代码。从设计工具复制颜色到 CSS 时很有用。' },
      ],
    },
  },

  // Percentage Calculator
  {
    slug: 'percentage-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate percentage of a number?', answer: 'Enter the percentage and the number. For example, 20% of 150 = 30. The tool shows the calculation steps and result instantly.' },
        { question: 'Can I calculate percentage increase/decrease?', answer: 'Yes, enter original and new values to find the percentage change. Useful for comparing prices, statistics, or performance metrics.' },
        { question: 'How do I find what percentage one number is of another?', answer: 'Enter both numbers and select "X is what % of Y" mode. For example, 30 is 20% of 150.' },
      ],
      zh: [
        { question: '如何计算一个数的百分比？', answer: '输入百分比和数字。例如，150 的 20% = 30。工具会立即显示计算步骤和结果。' },
        { question: '可以计算百分比增减吗？', answer: '是的，输入原始值和新值可以找到百分比变化。用于比较价格、统计数据或性能指标很有用。' },
        { question: '如何找出一个数是另一个数的百分之几？', answer: '输入两个数字并选择"X 是 Y 的百分之几"模式。例如，30 是 150 的 20%。' },
      ],
    },
  },

  // Lorem Ipsum
  {
    slug: 'lorem-ipsum',
    faqs: {
      en: [
        { question: 'What is Lorem Ipsum?', answer: 'Lorem Ipsum is placeholder text used in design and publishing since the 1500s. It helps visualize layouts without distracting readers with meaningful content.' },
        { question: 'How do I generate Lorem Ipsum text?', answer: 'Select the number of paragraphs, sentences, or words you need and click Generate. Copy the text directly into your design or document.' },
        { question: 'Is Lorem Ipsum real Latin?', answer: 'It\'s derived from a Latin text by Cicero (45 BC) but scrambled and modified. It\'s not meant to be readable Latin, just realistic-looking placeholder text.' },
      ],
      zh: [
        { question: '什么是 Lorem Ipsum？', answer: 'Lorem Ipsum 是自 1500 年代以来用于设计和出版的占位符文本。它帮助可视化布局，而不会用有意义的内容分散读者注意力。' },
        { question: '如何生成 Lorem Ipsum 文本？', answer: '选择需要的段落、句子或单词数量，然后点击生成。将文本直接复制到您的设计或文档中。' },
        { question: 'Lorem Ipsum 是真正的拉丁语吗？', answer: '它源自西塞罗（公元前 45 年）的拉丁文本，但经过打乱和修改。它不是可读的拉丁语，只是看起来逼真的占位符文本。' },
      ],
    },
  },

  // Slug Generator
  {
    slug: 'slug-generator',
    faqs: {
      en: [
        { question: 'What is a URL slug?', answer: 'A slug is the URL-friendly version of a title, like "how-to-make-coffee" from "How to Make Coffee". It uses lowercase letters, numbers, and hyphens only.' },
        { question: 'How do I create a slug from text?', answer: 'Enter any text and the tool converts it to a slug: lowercase, spaces become hyphens, special characters removed. Perfect for blog posts and product URLs.' },
        { question: 'Why are slugs important for SEO?', answer: 'Clean, descriptive slugs help search engines understand page content and improve click-through rates. They\'re also easier for users to read and share.' },
      ],
      zh: [
        { question: '什么是 URL slug？', answer: 'Slug 是标题的 URL 友好版本，如"How to Make Coffee"变成"how-to-make-coffee"。它只使用小写字母、数字和连字符。' },
        { question: '如何从文本创建 slug？', answer: '输入任何文本，工具会将其转换为 slug：小写、空格变成连字符、移除特殊字符。非常适合博客文章和产品 URL。' },
        { question: '为什么 slug 对 SEO 很重要？', answer: '干净、描述性的 slug 帮助搜索引擎理解页面内容并提高点击率。它们也更容易让用户阅读和分享。' },
      ],
    },
  },

  // Random String Generator
  {
    slug: 'random-string-generator',
    faqs: {
      en: [
        { question: 'How do I generate a random string?', answer: 'Set the length and character types (letters, numbers, symbols), then click Generate. Each string is cryptographically random and unique.' },
        { question: 'What are random strings used for?', answer: 'Common uses include API keys, session tokens, temporary passwords, unique identifiers, and test data. They provide unpredictability for security.' },
        { question: 'Are the strings truly random?', answer: 'Yes, we use the Web Crypto API which provides cryptographically secure random values, suitable for security-sensitive applications.' },
      ],
      zh: [
        { question: '如何生成随机字符串？', answer: '设置长度和字符类型（字母、数字、符号），然后点击生成。每个字符串都是加密随机且唯一的。' },
        { question: '随机字符串有什么用途？', answer: '常见用途包括 API 密钥、会话令牌、临时密码、唯一标识符和测试数据。它们为安全性提供不可预测性。' },
        { question: '字符串是真正随机的吗？', answer: '是的，我们使用 Web Crypto API，它提供加密安全的随机值，适用于安全敏感的应用程序。' },
      ],
    },
  },

  // Number to Words
  {
    slug: 'number-to-words',
    faqs: {
      en: [
        { question: 'How do I convert numbers to words?', answer: 'Enter any number and get its word form. For example, 1234 becomes "one thousand two hundred thirty-four". Supports very large numbers.' },
        { question: 'What languages are supported?', answer: 'We support English, Chinese, Spanish, French, German, and more. Each language follows its native number naming conventions.' },
        { question: 'Can I convert currency amounts?', answer: 'Yes, enable currency mode to get formats like "one hundred twenty-three dollars and forty-five cents" for check writing.' },
      ],
      zh: [
        { question: '如何将数字转换为文字？', answer: '输入任何数字即可获得其文字形式。例如，1234 变成"一千二百三十四"。支持非常大的数字。' },
        { question: '支持哪些语言？', answer: '我们支持英语、中文、西班牙语、法语、德语等。每种语言都遵循其本地的数字命名约定。' },
        { question: '可以转换货币金额吗？', answer: '是的，启用货币模式可以获得如"壹佰贰拾叁元肆角伍分"的格式，用于支票书写。' },
      ],
    },
  },

  // Aspect Ratio Calculator
  {
    slug: 'aspect-ratio-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate aspect ratio?', answer: 'Enter width and height to get the aspect ratio (e.g., 1920x1080 = 16:9). Or enter a ratio and one dimension to calculate the other.' },
        { question: 'What are common aspect ratios?', answer: '16:9 (HD video), 4:3 (old TV), 1:1 (square/Instagram), 9:16 (vertical video), 21:9 (ultrawide). Each has specific use cases.' },
        { question: 'Why is aspect ratio important?', answer: 'Maintaining aspect ratio prevents image distortion when resizing. It\'s crucial for responsive design, video editing, and print layouts.' },
      ],
      zh: [
        { question: '如何计算宽高比？', answer: '输入宽度和高度即可获得宽高比（如 1920x1080 = 16:9）。或输入比例和一个尺寸来计算另一个。' },
        { question: '常见的宽高比有哪些？', answer: '16:9（高清视频）、4:3（旧电视）、1:1（正方形/Instagram）、9:16（竖屏视频）、21:9（超宽屏）。每种都有特定用途。' },
        { question: '为什么宽高比很重要？', answer: '保持宽高比可以防止调整大小时图像变形。这对响应式设计、视频编辑和印刷布局至关重要。' },
      ],
    },
  },

  // Character Counter
  {
    slug: 'character-counter',
    faqs: {
      en: [
        { question: 'How do I count characters in text?', answer: 'Paste or type your text and see instant counts for characters (with/without spaces), words, sentences, paragraphs, and reading time.' },
        { question: 'Why do character counts matter?', answer: 'Many platforms have limits: Twitter (280 chars), meta descriptions (160), SMS (160). Knowing your count helps optimize content.' },
        { question: 'Does it count Unicode characters correctly?', answer: 'Yes, we properly count Unicode including emojis, Chinese characters, and special symbols. Each emoji counts as one character.' },
      ],
      zh: [
        { question: '如何计算文本中的字符数？', answer: '粘贴或输入文本，即可看到字符（含/不含空格）、单词、句子、段落和阅读时间的即时统计。' },
        { question: '为什么字符计数很重要？', answer: '许多平台有限制：Twitter（280 字符）、meta 描述（160）、短信（160）。了解字符数有助于优化内容。' },
        { question: '能正确计算 Unicode 字符吗？', answer: '是的，我们正确计算 Unicode，包括表情符号、中文字符和特殊符号。每个表情符号计为一个字符。' },
      ],
    },
  },

  // Line Counter
  {
    slug: 'line-counter',
    faqs: {
      en: [
        { question: 'How do I count lines in text?', answer: 'Paste your text to see total lines, non-empty lines, and empty lines. Useful for code files, logs, and data processing.' },
        { question: 'How are empty lines counted?', answer: 'Lines with only whitespace (spaces, tabs) are counted as empty. You can choose to include or exclude them from the total.' },
        { question: 'Can I count lines in code files?', answer: 'Yes, paste any code and see line counts. We also show lines of code (LOC) excluding comments and blank lines for many languages.' },
      ],
      zh: [
        { question: '如何计算文本中的行数？', answer: '粘贴文本即可看到总行数、非空行数和空行数。对代码文件、日志和数据处理很有用。' },
        { question: '空行如何计算？', answer: '只有空白字符（空格、制表符）的行被计为空行。您可以选择在总数中包含或排除它们。' },
        { question: '可以计算代码文件的行数吗？', answer: '是的，粘贴任何代码即可看到行数统计。我们还显示代码行数（LOC），排除许多语言的注释和空行。' },
      ],
    },
  },

  // Text Reverser
  {
    slug: 'text-reverser',
    faqs: {
      en: [
        { question: 'How do I reverse text online?', answer: 'Enter your text and click Reverse. "Hello World" becomes "dlroW olleH". You can reverse by character, word, or line.' },
        { question: 'What are the different reverse modes?', answer: 'Character reverse flips all characters. Word reverse keeps words intact but reverses order. Line reverse reverses line order.' },
        { question: 'Does it work with Unicode?', answer: 'Yes, Unicode characters including emojis and non-Latin scripts are properly reversed while maintaining character integrity.' },
      ],
      zh: [
        { question: '如何在线反转文本？', answer: '输入文本并点击反转。"Hello World"变成"dlroW olleH"。可以按字符、单词或行反转。' },
        { question: '有哪些不同的反转模式？', answer: '字符反转翻转所有字符。单词反转保持单词完整但反转顺序。行反转反转行顺序。' },
        { question: '支持 Unicode 吗？', answer: '是的，Unicode 字符包括表情符号和非拉丁文字都能正确反转，同时保持字符完整性。' },
      ],
    },
  },
];
