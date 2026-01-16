/**
 * GEO 优化工具 FAQ - 第 58 批
 * 为缺失 FAQ 的工具添加 GEO 优化的问答内容
 */

import type { ToolSpecificFAQ } from './tool-specific-faqs';

export const GEO_TOOL_FAQS_58: ToolSpecificFAQ[] = [
  {
    slug: 'credit-card-validator',
    faqs: {
      en: [
        { question: 'How does validation work?', answer: 'Uses Luhn algorithm to verify card number checksum. Also identifies card type (Visa, Mastercard, etc.) by prefix.' },
        { question: 'Is it safe?', answer: 'Yes, all validation happens in your browser. Card numbers are never sent to any server.' },
        { question: 'What cards are supported?', answer: 'Visa, Mastercard, American Express, Discover, JCB, Diners Club, and more.' },
      ],
      zh: [
        { question: '验证如何工作？', answer: '使用 Luhn 算法验证卡号校验和。还通过前缀识别卡类型（Visa、Mastercard 等）。' },
        { question: '安全吗？', answer: '是的，所有验证在浏览器中进行。卡号永远不会发送到任何服务器。' },
        { question: '支持哪些卡？', answer: 'Visa、Mastercard、American Express、Discover、JCB、Diners Club 等。' },
      ],
    },
  },
  {
    slug: 'color-blindness-simulator',
    faqs: {
      en: [
        { question: 'What types are simulated?', answer: 'Protanopia, Deuteranopia, Tritanopia (complete), and Protanomaly, Deuteranomaly, Tritanomaly (partial).' },
        { question: 'Why use this?', answer: 'Test designs for accessibility. Ensure content is readable for users with color vision deficiency.' },
        { question: 'How accurate?', answer: 'Uses scientifically-based color transformation matrices to simulate how colors appear to affected individuals.' },
      ],
      zh: [
        { question: '模拟哪些类型？', answer: '红色盲、绿色盲、蓝色盲（完全），以及红色弱、绿色弱、蓝色弱（部分）。' },
        { question: '为什么使用？', answer: '测试设计的可访问性。确保内容对色觉缺陷用户可读。' },
        { question: '准确性如何？', answer: '使用基于科学的颜色转换矩阵来模拟受影响个体看到的颜色。' },
      ],
    },
  },
  {
    slug: 'aspect-ratio-resizer',
    faqs: {
      en: [
        { question: 'What is aspect ratio?', answer: 'The proportional relationship between width and height. Common ratios: 16:9 (video), 4:3 (photos), 1:1 (square).' },
        { question: 'How to use?', answer: 'Enter one dimension and select ratio. The tool calculates the other dimension maintaining proportion.' },
        { question: 'Common use cases?', answer: 'Resizing images for social media, video thumbnails, responsive design, print layouts.' },
      ],
      zh: [
        { question: '什么是宽高比？', answer: '宽度和高度之间的比例关系。常见比例：16:9（视频）、4:3（照片）、1:1（正方形）。' },
        { question: '如何使用？', answer: '输入一个尺寸并选择比例。工具计算另一个尺寸以保持比例。' },
        { question: '常见用例？', answer: '为社交媒体调整图片大小、视频缩略图、响应式设计、打印布局。' },
      ],
    },
  },
  {
    slug: 'speech-timer',
    faqs: {
      en: [
        { question: 'What is this for?', answer: 'Practice speeches and presentations with timing. Set target duration and get visual/audio alerts.' },
        { question: 'Features?', answer: 'Countdown/count-up modes, customizable alerts at intervals, pace indicator, pause/resume.' },
        { question: 'Ideal speech length?', answer: 'TED talks: 18 min. Elevator pitch: 30-60 sec. Presentation: 10-20 min depending on context.' },
      ],
      zh: [
        { question: '这是做什么的？', answer: '练习演讲和演示的计时。设置目标时长并获得视觉/音频提醒。' },
        { question: '功能？', answer: '倒计时/正计时模式、可自定义的间隔提醒、节奏指示器、暂停/继续。' },
        { question: '理想演讲时长？', answer: 'TED 演讲：18 分钟。电梯演讲：30-60 秒。演示：10-20 分钟，取决于场景。' },
      ],
    },
  },
  {
    slug: 'flip-text',
    faqs: {
      en: [
        { question: 'How does it work?', answer: 'Replaces characters with upside-down Unicode equivalents. Text appears flipped when viewed normally.' },
        { question: 'Where to use?', answer: 'Social media posts, usernames, creative messaging, fun text effects.' },
        { question: 'All characters supported?', answer: 'Most Latin letters and numbers have flip equivalents. Some special characters may not flip.' },
      ],
      zh: [
        { question: '如何工作？', answer: '用倒置的 Unicode 等效字符替换字符。正常查看时文本显示为翻转。' },
        { question: '在哪里使用？', answer: '社交媒体帖子、用户名、创意消息、有趣的文本效果。' },
        { question: '支持所有字符吗？', answer: '大多数拉丁字母和数字都有翻转等效项。某些特殊字符可能无法翻转。' },
      ],
    },
  },
  {
    slug: 'strikethrough-text',
    faqs: {
      en: [
        { question: 'How does it work?', answer: 'Adds Unicode combining characters to create strikethrough effect that works everywhere.' },
        { question: 'Where can I use it?', answer: 'Social media, messaging apps, anywhere that supports Unicode text.' },
        { question: 'Different from HTML?', answer: 'Yes, this uses Unicode characters, not HTML tags. Works in plain text contexts.' },
      ],
      zh: [
        { question: '如何工作？', answer: '添加 Unicode 组合字符来创建在任何地方都有效的删除线效果。' },
        { question: '可以在哪里使用？', answer: '社交媒体、消息应用、任何支持 Unicode 文本的地方。' },
        { question: '与 HTML 不同？', answer: '是的，这使用 Unicode 字符，而不是 HTML 标签。在纯文本环境中有效。' },
      ],
    },
  },
  {
    slug: 'small-text-generator',
    faqs: {
      en: [
        { question: 'What types available?', answer: 'Superscript (ˢᵐᵃˡˡ), subscript (ₛₘₐₗₗ), and small caps (sᴍᴀʟʟ) styles.' },
        { question: 'How does it work?', answer: 'Converts to Unicode characters that appear smaller. Not actual font size change.' },
        { question: 'Compatibility?', answer: 'Works on most platforms supporting Unicode. Some characters may not have small equivalents.' },
      ],
      zh: [
        { question: '有哪些类型？', answer: '上标（ˢᵐᵃˡˡ）、下标（ₛₘₐₗₗ）和小型大写字母（sᴍᴀʟʟ）样式。' },
        { question: '如何工作？', answer: '转换为看起来更小的 Unicode 字符。不是实际的字体大小更改。' },
        { question: '兼容性？', answer: '在大多数支持 Unicode 的平台上有效。某些字符可能没有小型等效项。' },
      ],
    },
  },
  {
    slug: 'binary-to-text',
    faqs: {
      en: [
        { question: 'What format is expected?', answer: 'Binary digits (0s and 1s) in 8-bit groups. Spaces between bytes are optional.' },
        { question: 'What encoding?', answer: 'Converts binary to ASCII/UTF-8 text. Each 8 bits represents one character.' },
        { question: 'Can convert text to binary?', answer: 'Yes, the tool works both ways. Enter text to get binary representation.' },
      ],
      zh: [
        { question: '期望什么格式？', answer: '8 位组的二进制数字（0 和 1）。字节之间的空格是可选的。' },
        { question: '什么编码？', answer: '将二进制转换为 ASCII/UTF-8 文本。每 8 位代表一个字符。' },
        { question: '可以将文本转换为二进制吗？', answer: '是的，该工具双向工作。输入文本以获取二进制表示。' },
      ],
    },
  },
  {
    slug: 'roman-numeral-converter',
    faqs: {
      en: [
        { question: 'What range is supported?', answer: 'Standard Roman numerals: 1 to 3999. Extended notation can go higher.' },
        { question: 'Basic symbols?', answer: 'I=1, V=5, X=10, L=50, C=100, D=500, M=1000. Subtractive notation for 4, 9, etc.' },
        { question: 'Common uses?', answer: 'Clock faces, book chapters, movie sequels, formal documents, outlines.' },
      ],
      zh: [
        { question: '支持什么范围？', answer: '标准罗马数字：1 到 3999。扩展表示法可以更高。' },
        { question: '基本符号？', answer: 'I=1、V=5、X=10、L=50、C=100、D=500、M=1000。4、9 等使用减法表示法。' },
        { question: '常见用途？', answer: '钟面、书籍章节、电影续集、正式文件、大纲。' },
      ],
    },
  },
  {
    slug: 'fraction-calculator',
    faqs: {
      en: [
        { question: 'What operations?', answer: 'Add, subtract, multiply, divide fractions. Also simplify and convert to decimals.' },
        { question: 'Mixed numbers?', answer: 'Yes, supports mixed numbers (e.g., 2 1/2) and improper fractions.' },
        { question: 'Auto simplification?', answer: 'Results are automatically reduced to lowest terms using GCD.' },
      ],
      zh: [
        { question: '什么运算？', answer: '加、减、乘、除分数。还可以简化和转换为小数。' },
        { question: '带分数？', answer: '是的，支持带分数（如 2 1/2）和假分数。' },
        { question: '自动简化？', answer: '结果使用最大公约数自动约分到最简形式。' },
      ],
    },
  },
];
