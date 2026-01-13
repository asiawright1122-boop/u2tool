/**
 * GEO 优化的工具 FAQ 配置 - 第四十一批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_41: ToolSpecificFAQ[] = [
  // Audio to Base64
  {
    slug: 'audio-to-base64',
    faqs: {
      en: [
        { question: 'How do I convert audio to Base64?', answer: 'Upload audio file (MP3, WAV, OGG). We encode to Base64 string for embedding in HTML or JSON.' },
        { question: 'Why convert audio to Base64?', answer: 'Embed audio in HTML without separate files, include in JSON data, store in databases as text.' },
        { question: 'What is the size increase?', answer: 'Base64 increases size by ~33%. 1MB audio becomes ~1.33MB Base64. Consider for small files only.' },
      ],
      zh: [
        { question: '如何将音频转换为 Base64？', answer: '上传音频文件（MP3、WAV、OGG）。我们编码为 Base64 字符串以嵌入 HTML 或 JSON。' },
        { question: '为什么要将音频转换为 Base64？', answer: '在 HTML 中嵌入音频而无需单独文件，包含在 JSON 数据中，作为文本存储在数据库中。' },
        { question: '大小增加多少？', answer: 'Base64 增加约 33% 的大小。1MB 音频变成约 1.33MB Base64。仅考虑小文件。' },
      ],
    },
  },

  // Video to Base64
  {
    slug: 'video-to-base64',
    faqs: {
      en: [
        { question: 'How do I convert video to Base64?', answer: 'Upload video file. We encode to Base64. Note: videos are large, Base64 makes them larger.' },
        { question: 'When should I use video Base64?', answer: 'Rarely recommended due to size. Use for tiny videos (<1MB) or when absolutely necessary.' },
        { question: 'What formats are supported?', answer: 'MP4, WebM, OGG video formats. MP4 most widely supported for playback.' },
      ],
      zh: [
        { question: '如何将视频转换为 Base64？', answer: '上传视频文件。我们编码为 Base64。注意：视频很大，Base64 使它们更大。' },
        { question: '什么时候应该使用视频 Base64？', answer: '由于大小原因很少推荐。用于小视频（<1MB）或绝对必要时。' },
        { question: '支持哪些格式？', answer: 'MP4、WebM、OGG 视频格式。MP4 播放支持最广泛。' },
      ],
    },
  },

  // File Size Calculator
  {
    slug: 'file-size-calculator',
    faqs: {
      en: [
        { question: 'How do I convert file sizes?', answer: 'Enter size in any unit (B, KB, MB, GB, TB). We convert to all other units instantly.' },
        { question: 'What is the difference between KB and KiB?', answer: 'KB = 1000 bytes (decimal). KiB = 1024 bytes (binary). We show both systems.' },
        { question: 'How do I calculate storage needs?', answer: 'Enter file size and count. We calculate total storage needed. Useful for planning.' },
      ],
      zh: [
        { question: '如何转换文件大小？', answer: '以任何单位输入大小（B、KB、MB、GB、TB）。我们立即转换为所有其他单位。' },
        { question: 'KB 和 KiB 有什么区别？', answer: 'KB = 1000 字节（十进制）。KiB = 1024 字节（二进制）。我们显示两种系统。' },
        { question: '如何计算存储需求？', answer: '输入文件大小和数量。我们计算所需的总存储空间。用于规划。' },
      ],
    },
  },

  // ASCII Table Reference
  {
    slug: 'ascii-table',
    faqs: {
      en: [
        { question: 'What is ASCII?', answer: 'American Standard Code for Information Interchange. 128 characters including letters, numbers, symbols, control codes.' },
        { question: 'How do I find ASCII code for a character?', answer: 'Search by character or browse table. Shows decimal, hex, octal, and binary representations.' },
        { question: 'What are control characters?', answer: 'ASCII 0-31 and 127. Non-printable characters like newline (10), tab (9), carriage return (13).' },
      ],
      zh: [
        { question: '什么是 ASCII？', answer: '美国信息交换标准代码。128 个字符，包括字母、数字、符号、控制代码。' },
        { question: '如何找到字符的 ASCII 代码？', answer: '按字符搜索或浏览表格。显示十进制、十六进制、八进制和二进制表示。' },
        { question: '什么是控制字符？', answer: 'ASCII 0-31 和 127。不可打印字符，如换行（10）、制表符（9）、回车（13）。' },
      ],
    },
  },

  // CSS Variables Generator
  {
    slug: 'css-variables-generator',
    faqs: {
      en: [
        { question: 'What are CSS variables?', answer: 'Custom properties defined with --name. Reusable values throughout CSS. --primary-color: #007bff;' },
        { question: 'How do I generate CSS variables?', answer: 'Enter colors, sizes, fonts. We generate :root block with all variables. Copy to your stylesheet.' },
        { question: 'Why use CSS variables?', answer: 'Easy theming, consistent values, runtime changes with JavaScript. Better maintainability.' },
      ],
      zh: [
        { question: '什么是 CSS 变量？', answer: '用 --name 定义的自定义属性。在整个 CSS 中可重用的值。--primary-color: #007bff;' },
        { question: '如何生成 CSS 变量？', answer: '输入颜色、大小、字体。我们生成包含所有变量的 :root 块。复制到您的样式表。' },
        { question: '为什么使用 CSS 变量？', answer: '易于主题化、一致的值、使用 JavaScript 运行时更改。更好的可维护性。' },
      ],
    },
  },

  // Lorem Picsum (Placeholder Images)
  {
    slug: 'lorem-picsum',
    faqs: {
      en: [
        { question: 'What is Lorem Picsum?', answer: 'Service providing random placeholder images. Specify dimensions, get beautiful stock photos.' },
        { question: 'How do I get a specific size image?', answer: 'Enter width and height. We generate URL: picsum.photos/800/600. Use directly in HTML.' },
        { question: 'Can I get the same image every time?', answer: 'Yes, use seed parameter. Same seed = same image. Useful for consistent mockups.' },
      ],
      zh: [
        { question: '什么是 Lorem Picsum？', answer: '提供随机占位图像的服务。指定尺寸，获取漂亮的库存照片。' },
        { question: '如何获取特定大小的图像？', answer: '输入宽度和高度。我们生成 URL：picsum.photos/800/600。直接在 HTML 中使用。' },
        { question: '可以每次获取相同的图像吗？', answer: '是的，使用 seed 参数。相同的 seed = 相同的图像。用于一致的模型。' },
      ],
    },
  },

  // Regex Escape
  {
    slug: 'regex-escape',
    faqs: {
      en: [
        { question: 'What characters need escaping in regex?', answer: 'Special chars: . * + ? ^ $ { } [ ] \\ | ( ). We escape them with backslash.' },
        { question: 'Why escape regex characters?', answer: 'To match literal characters instead of special meaning. "file.txt" needs "file\\.txt" to match dot.' },
        { question: 'Does this work for all regex flavors?', answer: 'Yes, basic escaping works across JavaScript, Python, Java, etc. Some edge cases may differ.' },
      ],
      zh: [
        { question: '正则表达式中哪些字符需要转义？', answer: '特殊字符：. * + ? ^ $ { } [ ] \\ | ( )。我们用反斜杠转义它们。' },
        { question: '为什么要转义正则表达式字符？', answer: '匹配字面字符而不是特殊含义。"file.txt"需要"file\\.txt"来匹配点。' },
        { question: '这适用于所有正则表达式风格吗？', answer: '是的，基本转义适用于 JavaScript、Python、Java 等。某些边缘情况可能不同。' },
      ],
    },
  },

  // HTML to Text
  {
    slug: 'html-to-text',
    faqs: {
      en: [
        { question: 'How do I extract text from HTML?', answer: 'Paste HTML code. We strip all tags, keeping only text content. Preserves basic structure.' },
        { question: 'Are line breaks preserved?', answer: 'Yes, block elements (p, div, br) become line breaks. Inline elements removed without breaks.' },
        { question: 'What about HTML entities?', answer: 'Decoded to characters. &amp; becomes &, &lt; becomes <. Clean readable text output.' },
      ],
      zh: [
        { question: '如何从 HTML 中提取文本？', answer: '粘贴 HTML 代码。我们去除所有标签，只保留文本内容。保留基本结构。' },
        { question: '换行符会保留吗？', answer: '是的，块元素（p、div、br）变成换行符。内联元素被删除而不换行。' },
        { question: 'HTML 实体呢？', answer: '解码为字符。&amp; 变成 &，&lt; 变成 <。干净可读的文本输出。' },
      ],
    },
  },

  // Binary to Decimal
  {
    slug: 'binary-to-decimal',
    faqs: {
      en: [
        { question: 'How do I convert binary to decimal?', answer: 'Enter binary number (0s and 1s). We calculate decimal equivalent. 1010 = 10.' },
        { question: 'How does binary work?', answer: 'Each position is power of 2. Rightmost is 2^0=1, then 2^1=2, 2^2=4, etc. Sum positions with 1.' },
        { question: 'Can I convert decimal to binary?', answer: 'Yes, enter decimal number. We show binary representation. Bidirectional conversion.' },
      ],
      zh: [
        { question: '如何将二进制转换为十进制？', answer: '输入二进制数（0 和 1）。我们计算十进制等效值。1010 = 10。' },
        { question: '二进制如何工作？', answer: '每个位置是 2 的幂。最右边是 2^0=1，然后 2^1=2，2^2=4 等。对有 1 的位置求和。' },
        { question: '可以将十进制转换为二进制吗？', answer: '是的，输入十进制数。我们显示二进制表示。双向转换。' },
      ],
    },
  },

  // Text to NATO Phonetic
  {
    slug: 'text-to-nato',
    faqs: {
      en: [
        { question: 'What is NATO phonetic alphabet?', answer: 'Standard spelling alphabet. A=Alpha, B=Bravo, C=Charlie. Used to spell words clearly over radio/phone.' },
        { question: 'How do I convert text to NATO?', answer: 'Enter text. Each letter converts to NATO word. "AB" becomes "Alpha Bravo".' },
        { question: 'What about numbers?', answer: 'Numbers have NATO equivalents too. 0=Zero, 1=One, 9=Niner. We convert both letters and numbers.' },
      ],
      zh: [
        { question: '什么是北约音标字母？', answer: '标准拼写字母表。A=Alpha，B=Bravo，C=Charlie。用于通过无线电/电话清晰拼写单词。' },
        { question: '如何将文本转换为北约音标？', answer: '输入文本。每个字母转换为北约单词。"AB"变成"Alpha Bravo"。' },
        { question: '数字呢？', answer: '数字也有北约等效词。0=Zero，1=One，9=Niner。我们转换字母和数字。' },
      ],
    },
  },
];
