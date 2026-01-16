/**
 * GEO 优化工具 FAQ - 第 59 批
 * 为缺失 FAQ 的工具添加 GEO 优化的问答内容
 */

import type { ToolSpecificFAQ } from './tool-specific-faqs';

export const GEO_TOOL_FAQS_59: ToolSpecificFAQ[] = [
  {
    slug: 'percentage-change-calculator',
    faqs: {
      en: [
        { question: 'How to calculate?', answer: 'Enter original and new values. Formula: ((New - Original) / Original) × 100.' },
        { question: 'Positive vs negative?', answer: 'Positive result = increase, negative = decrease. Shows direction of change.' },
        { question: 'Common uses?', answer: 'Stock price changes, sales growth, discount calculations, data analysis.' },
      ],
      zh: [
        { question: '如何计算？', answer: '输入原始值和新值。公式：((新值 - 原始值) / 原始值) × 100。' },
        { question: '正数 vs 负数？', answer: '正数结果 = 增加，负数 = 减少。显示变化方向。' },
        { question: '常见用途？', answer: '股价变化、销售增长、折扣计算、数据分析。' },
      ],
    },
  },
  {
    slug: 'random-color-generator',
    faqs: {
      en: [
        { question: 'What formats?', answer: 'Generates colors in HEX, RGB, HSL formats. Copy any format with one click.' },
        { question: 'Can I set constraints?', answer: 'Yes, limit hue range, saturation, lightness for themed palettes.' },
        { question: 'Palette generation?', answer: 'Generate complementary, analogous, triadic, or random color palettes.' },
      ],
      zh: [
        { question: '什么格式？', answer: '生成 HEX、RGB、HSL 格式的颜色。一键复制任何格式。' },
        { question: '可以设置约束吗？', answer: '是的，限制色相范围、饱和度、亮度以生成主题调色板。' },
        { question: '调色板生成？', answer: '生成互补色、类似色、三色或随机调色板。' },
      ],
    },
  },
  {
    slug: 'anagram-solver',
    faqs: {
      en: [
        { question: 'How does it work?', answer: 'Rearranges letters to find all valid English words. Uses comprehensive dictionary.' },
        { question: 'Word length filter?', answer: 'Yes, filter results by minimum/maximum word length.' },
        { question: 'Multiple words?', answer: 'Can find multi-word anagrams from longer letter combinations.' },
      ],
      zh: [
        { question: '如何工作？', answer: '重新排列字母以找到所有有效的英语单词。使用综合词典。' },
        { question: '单词长度过滤？', answer: '是的，按最小/最大单词长度过滤结果。' },
        { question: '多个单词？', answer: '可以从较长的字母组合中找到多词变位词。' },
      ],
    },
  },
  {
    slug: 'word-unscrambler',
    faqs: {
      en: [
        { question: 'Difference from anagram?', answer: 'Unscrambler finds the original word from jumbled letters. Anagram finds all possible words.' },
        { question: 'Game helper?', answer: 'Great for Scrabble, Words with Friends, crossword puzzles, word games.' },
        { question: 'Wildcard support?', answer: 'Use ? or * for unknown letters to find matching words.' },
      ],
      zh: [
        { question: '与变位词的区别？', answer: '解谜器从混乱的字母中找到原始单词。变位词找到所有可能的单词。' },
        { question: '游戏助手？', answer: '非常适合 Scrabble、Words with Friends、填字游戏、文字游戏。' },
        { question: '通配符支持？', answer: '使用 ? 或 * 表示未知字母以查找匹配的单词。' },
      ],
    },
  },
  {
    slug: 'text-to-pdf',
    faqs: {
      en: [
        { question: 'What formatting?', answer: 'Supports font selection, size, margins, page orientation, headers/footers.' },
        { question: 'File size?', answer: 'Generated PDFs are optimized for small file size while maintaining quality.' },
        { question: 'Privacy?', answer: 'All conversion happens in browser. Text never leaves your device.' },
      ],
      zh: [
        { question: '什么格式？', answer: '支持字体选择、大小、边距、页面方向、页眉/页脚。' },
        { question: '文件大小？', answer: '生成的 PDF 在保持质量的同时优化了文件大小。' },
        { question: '隐私？', answer: '所有转换在浏览器中进行。文本永远不会离开您的设备。' },
      ],
    },
  },
  {
    slug: 'unit-price-calculator',
    faqs: {
      en: [
        { question: 'What is unit price?', answer: 'Price per standard unit (oz, lb, ml, etc.). Helps compare products of different sizes.' },
        { question: 'How to use?', answer: 'Enter price and quantity for each product. Tool calculates and compares unit prices.' },
        { question: 'Best for?', answer: 'Grocery shopping, bulk buying decisions, comparing package sizes.' },
      ],
      zh: [
        { question: '什么是单价？', answer: '每标准单位（盎司、磅、毫升等）的价格。帮助比较不同大小的产品。' },
        { question: '如何使用？', answer: '输入每个产品的价格和数量。工具计算并比较单价。' },
        { question: '最适合？', answer: '杂货购物、批量购买决策、比较包装大小。' },
      ],
    },
  },
  {
    slug: 'bionic-reading-converter',
    faqs: {
      en: [
        { question: 'What is bionic reading?', answer: 'Bolds the first few letters of words to guide eyes and potentially improve reading speed.' },
        { question: 'Does it help everyone?', answer: 'Results vary. Some find it helpful, especially those with ADHD or dyslexia. Try it yourself.' },
        { question: 'Customization?', answer: 'Adjust fixation intensity (how many letters are bolded) to find your preference.' },
      ],
      zh: [
        { question: '什么是仿生阅读？', answer: '加粗单词的前几个字母以引导眼睛，可能提高阅读速度。' },
        { question: '对每个人都有帮助吗？', answer: '效果因人而异。有些人觉得有帮助，特别是 ADHD 或阅读障碍者。自己试试。' },
        { question: '自定义？', answer: '调整固定强度（加粗多少字母）以找到您的偏好。' },
      ],
    },
  },
  {
    slug: 'palindrome-checker',
    faqs: {
      en: [
        { question: 'What is a palindrome?', answer: 'Word, phrase, or sequence that reads the same forwards and backwards (e.g., "radar", "A man a plan a canal Panama").' },
        { question: 'Case sensitive?', answer: 'By default ignores case and spaces. Option to enable strict checking.' },
        { question: 'What about numbers?', answer: 'Works with numbers too. 12321 is a numeric palindrome.' },
      ],
      zh: [
        { question: '什么是回文？', answer: '正读和反读相同的单词、短语或序列（如 "radar"、"上海自来水来自海上"）。' },
        { question: '区分大小写？', answer: '默认忽略大小写和空格。可选择启用严格检查。' },
        { question: '数字呢？', answer: '也适用于数字。12321 是数字回文。' },
      ],
    },
  },
  {
    slug: 'character-map',
    faqs: {
      en: [
        { question: 'What characters?', answer: 'Browse Unicode characters: symbols, emojis, mathematical, currency, arrows, and more.' },
        { question: 'How to use?', answer: 'Click any character to copy. Search by name or browse by category.' },
        { question: 'Unicode info?', answer: 'Shows code point, name, and category for each character.' },
      ],
      zh: [
        { question: '什么字符？', answer: '浏览 Unicode 字符：符号、表情符号、数学、货币、箭头等。' },
        { question: '如何使用？', answer: '点击任何字符即可复制。按名称搜索或按类别浏览。' },
        { question: 'Unicode 信息？', answer: '显示每个字符的代码点、名称和类别。' },
      ],
    },
  },
  {
    slug: 'text-repeater',
    faqs: {
      en: [
        { question: 'What does it do?', answer: 'Repeats text a specified number of times. Add separators between repetitions.' },
        { question: 'Use cases?', answer: 'Testing, placeholder content, pattern generation, creative text effects.' },
        { question: 'Limits?', answer: 'Can repeat thousands of times. Browser memory is the only limit.' },
      ],
      zh: [
        { question: '它做什么？', answer: '将文本重复指定次数。在重复之间添加分隔符。' },
        { question: '用例？', answer: '测试、占位符内容、模式生成、创意文本效果。' },
        { question: '限制？', answer: '可以重复数千次。浏览器内存是唯一的限制。' },
      ],
    },
  },
];
