/**
 * GEO 优化工具 FAQ - 第 56 批
 * 计算器、文本工具和其他工具
 */

import type { ToolSpecificFAQ } from './tool-specific-faqs';

export const GEO_TOOL_FAQS_56: ToolSpecificFAQ[] = [
  {
    slug: 'percentage-change-calculator',
    faqs: {
      en: [
        {
          question: 'How do I calculate percentage change?',
          answer: 'Enter the original value and new value. The calculator shows the percentage increase or decrease. Formula: ((New - Original) / Original) × 100.',
        },
        {
          question: 'What\'s the difference between percentage change and percentage difference?',
          answer: 'Percentage change compares to an original value (growth from baseline). Percentage difference compares two values without a baseline (how different they are from each other).',
        },
        {
          question: 'Can I calculate the original value from a percentage change?',
          answer: 'Yes, enter the final value and percentage change to find the original value. Useful for reverse calculations like finding the pre-discount price.',
        },
      ],
      zh: [
        {
          question: '如何计算百分比变化？',
          answer: '输入原始值和新值。计算器显示百分比增加或减少。公式：((新值 - 原值) / 原值) × 100。',
        },
        {
          question: '百分比变化和百分比差异有什么区别？',
          answer: '百分比变化与原始值比较（从基线增长）。百分比差异比较两个值而没有基线（它们彼此有多不同）。',
        },
        {
          question: '可以从百分比变化计算原始值吗？',
          answer: '是的，输入最终值和百分比变化以找到原始值。用于反向计算，如找到折扣前的价格。',
        },
      ],
    },
  },
  {
    slug: 'random-color-generator',
    faqs: {
      en: [
        {
          question: 'How do I generate random colors?',
          answer: 'Click generate to create random colors. Get the color in HEX, RGB, and HSL formats. Generate single colors or entire palettes with complementary, analogous, or triadic schemes.',
        },
        {
          question: 'Can I generate colors within a specific range?',
          answer: 'Yes, set constraints like hue range, saturation, or brightness. Generate only pastel colors, dark colors, or colors matching a specific mood.',
        },
        {
          question: 'How do I create a color palette?',
          answer: 'Generate a base color, then create harmonious palettes using color theory rules. Export palettes as CSS variables, SCSS, or image swatches.',
        },
      ],
      zh: [
        {
          question: '如何生成随机颜色？',
          answer: '点击生成创建随机颜色。获取 HEX、RGB 和 HSL 格式的颜色。生成单个颜色或使用互补、类似或三元配色方案的整个调色板。',
        },
        {
          question: '可以在特定范围内生成颜色吗？',
          answer: '是的，设置色相范围、饱和度或亮度等约束。只生成柔和色、深色或匹配特定情绪的颜色。',
        },
        {
          question: '如何创建调色板？',
          answer: '生成基础颜色，然后使用色彩理论规则创建和谐的调色板。将调色板导出为 CSS 变量、SCSS 或图像色板。',
        },
      ],
    },
  },
  {
    slug: 'anagram-solver',
    faqs: {
      en: [
        {
          question: 'What is an anagram solver?',
          answer: 'An anagram solver finds all valid words that can be made by rearranging the letters of your input. It uses a dictionary to find real words from the letter combinations.',
        },
        {
          question: 'How do I solve an anagram?',
          answer: 'Enter the letters and the tool finds all possible words. Filter by word length, sort alphabetically or by length, and see definitions for found words.',
        },
        {
          question: 'Can I use this for word games like Scrabble?',
          answer: 'Yes, it\'s perfect for Scrabble, Words with Friends, crossword puzzles, and other word games. Find the highest-scoring words from your available letters.',
        },
      ],
      zh: [
        {
          question: '什么是字谜求解器？',
          answer: '字谜求解器找到所有可以通过重新排列输入字母组成的有效单词。它使用字典从字母组合中找到真实单词。',
        },
        {
          question: '如何解决字谜？',
          answer: '输入字母，工具找到所有可能的单词。按单词长度过滤，按字母顺序或长度排序，并查看找到的单词的定义。',
        },
        {
          question: '可以用于 Scrabble 等文字游戏吗？',
          answer: '是的，非常适合 Scrabble、Words with Friends、填字游戏和其他文字游戏。从可用字母中找到得分最高的单词。',
        },
      ],
    },
  },
  {
    slug: 'word-unscrambler',
    faqs: {
      en: [
        {
          question: 'What is a word unscrambler?',
          answer: 'A word unscrambler takes jumbled letters and finds valid words. Unlike anagram solvers, it focuses on finding the intended word from scrambled letters.',
        },
        {
          question: 'How do I unscramble letters?',
          answer: 'Enter the scrambled letters and the tool shows possible words. Results are ranked by likelihood, with common words shown first.',
        },
        {
          question: 'Can I specify word length?',
          answer: 'Yes, filter results by exact length or minimum/maximum length. Useful when you know how many letters the answer should have.',
        },
      ],
      zh: [
        {
          question: '什么是单词解谜器？',
          answer: '单词解谜器接受混乱的字母并找到有效单词。与字谜求解器不同，它专注于从打乱的字母中找到预期的单词。',
        },
        {
          question: '如何解开字母？',
          answer: '输入打乱的字母，工具显示可能的单词。结果按可能性排名，常见单词首先显示。',
        },
        {
          question: '可以指定单词长度吗？',
          answer: '是的，按精确长度或最小/最大长度过滤结果。当您知道答案应该有多少字母时很有用。',
        },
      ],
    },
  },
  {
    slug: 'text-to-pdf',
    faqs: {
      en: [
        {
          question: 'How do I convert text to PDF?',
          answer: 'Paste or type your text, customize formatting (font, size, margins), and generate a PDF. The tool preserves line breaks and can add headers, footers, and page numbers.',
        },
        {
          question: 'Can I customize the PDF appearance?',
          answer: 'Yes, choose fonts, text size, line spacing, margins, and page size (A4, Letter, etc.). Add a title page, headers, footers, and page numbers.',
        },
        {
          question: 'Is there a text length limit?',
          answer: 'The tool handles large documents with automatic pagination. Very long texts are split across multiple pages with consistent formatting.',
        },
      ],
      zh: [
        {
          question: '如何将文本转换为 PDF？',
          answer: '粘贴或输入文本，自定义格式（字体、大小、边距），然后生成 PDF。工具保留换行符，可以添加页眉、页脚和页码。',
        },
        {
          question: '可以自定义 PDF 外观吗？',
          answer: '是的，选择字体、文字大小、行距、边距和页面大小（A4、Letter 等）。添加标题页、页眉、页脚和页码。',
        },
        {
          question: '有文本长度限制吗？',
          answer: '工具处理带有自动分页的大型文档。非常长的文本会以一致的格式分布在多个页面上。',
        },
      ],
    },
  },
  {
    slug: 'unit-price-calculator',
    faqs: {
      en: [
        {
          question: 'What is a unit price calculator?',
          answer: 'A unit price calculator helps you compare prices by calculating the cost per unit (per ounce, per item, etc.). Essential for smart shopping and finding the best value.',
        },
        {
          question: 'How do I compare prices with different quantities?',
          answer: 'Enter the price and quantity for each product. The calculator shows the unit price for each, making it easy to see which offers better value.',
        },
        {
          question: 'What units are supported?',
          answer: 'Compare by weight (oz, lb, g, kg), volume (fl oz, ml, L, gal), count (per item), or length (ft, m). The tool converts between units automatically.',
        },
      ],
      zh: [
        {
          question: '什么是单价计算器？',
          answer: '单价计算器通过计算每单位成本（每盎司、每件等）帮助您比较价格。对于精明购物和找到最佳价值至关重要。',
        },
        {
          question: '如何比较不同数量的价格？',
          answer: '输入每个产品的价格和数量。计算器显示每个的单价，便于查看哪个提供更好的价值。',
        },
        {
          question: '支持哪些单位？',
          answer: '按重量（盎司、磅、克、公斤）、体积（液体盎司、毫升、升、加仑）、数量（每件）或长度（英尺、米）比较。工具自动在单位之间转换。',
        },
      ],
    },
  },
  {
    slug: 'bionic-reading-converter',
    faqs: {
      en: [
        {
          question: 'What is bionic reading?',
          answer: 'Bionic reading bolds the first few letters of each word to guide your eyes and help you read faster. It creates artificial fixation points that your brain uses to complete words.',
        },
        {
          question: 'How do I convert text to bionic reading format?',
          answer: 'Paste your text and the tool automatically bolds the optimal portion of each word. Adjust the boldness level and copy the formatted text.',
        },
        {
          question: 'Does bionic reading actually help?',
          answer: 'Many users report faster reading and better focus, especially those with ADHD or dyslexia. Results vary by individual - try it to see if it works for you.',
        },
      ],
      zh: [
        {
          question: '什么是仿生阅读？',
          answer: '仿生阅读将每个单词的前几个字母加粗，以引导您的眼睛并帮助您更快阅读。它创建人工注视点，您的大脑用它来完成单词。',
        },
        {
          question: '如何将文本转换为仿生阅读格式？',
          answer: '粘贴文本，工具会自动将每个单词的最佳部分加粗。调整加粗级别并复制格式化的文本。',
        },
        {
          question: '仿生阅读真的有帮助吗？',
          answer: '许多用户报告阅读更快、注意力更集中，特别是那些有 ADHD 或阅读障碍的人。结果因人而异 - 试试看它是否对您有效。',
        },
      ],
    },
  },
  {
    slug: 'palindrome-checker',
    faqs: {
      en: [
        {
          question: 'What is a palindrome?',
          answer: 'A palindrome is a word, phrase, or sequence that reads the same forwards and backwards. Examples: "radar", "level", "A man a plan a canal Panama".',
        },
        {
          question: 'How does the palindrome checker work?',
          answer: 'Enter text and the tool checks if it\'s a palindrome. It can ignore spaces, punctuation, and case to check phrases. It shows the reversed text for comparison.',
        },
        {
          question: 'Can I check numbers for palindromes?',
          answer: 'Yes, enter numbers to check if they\'re palindromic (like 12321). The tool also finds the next palindrome number from any given number.',
        },
      ],
      zh: [
        {
          question: '什么是回文？',
          answer: '回文是正读和反读都相同的单词、短语或序列。例如："radar"、"level"、"上海自来水来自海上"。',
        },
        {
          question: '回文检查器如何工作？',
          answer: '输入文本，工具检查它是否是回文。它可以忽略空格、标点和大小写来检查短语。它显示反转的文本以供比较。',
        },
        {
          question: '可以检查数字是否是回文吗？',
          answer: '是的，输入数字检查它们是否是回文（如 12321）。工具还可以从任何给定数字找到下一个回文数字。',
        },
      ],
    },
  },
  {
    slug: 'character-map',
    faqs: {
      en: [
        {
          question: 'What is a character map?',
          answer: 'A character map displays all available Unicode characters organized by category. Find and copy special characters, symbols, emojis, and characters from different scripts.',
        },
        {
          question: 'How do I find a specific character?',
          answer: 'Browse by category (symbols, arrows, math, currency, etc.) or search by name. Click any character to copy it. View the Unicode code point and HTML entity.',
        },
        {
          question: 'What characters are included?',
          answer: 'Access thousands of Unicode characters including Latin, Greek, Cyrillic, CJK, Arabic, emojis, mathematical symbols, arrows, box drawing, and more.',
        },
      ],
      zh: [
        {
          question: '什么是字符映射表？',
          answer: '字符映射表按类别显示所有可用的 Unicode 字符。查找和复制特殊字符、符号、表情符号和不同文字的字符。',
        },
        {
          question: '如何找到特定字符？',
          answer: '按类别浏览（符号、箭头、数学、货币等）或按名称搜索。点击任何字符复制它。查看 Unicode 代码点和 HTML 实体。',
        },
        {
          question: '包含哪些字符？',
          answer: '访问数千个 Unicode 字符，包括拉丁文、希腊文、西里尔文、中日韩文、阿拉伯文、表情符号、数学符号、箭头、方框绘制等。',
        },
      ],
    },
  },
  {
    slug: 'text-repeater',
    faqs: {
      en: [
        {
          question: 'What is a text repeater?',
          answer: 'A text repeater duplicates your text a specified number of times. Useful for creating test data, filling templates, or generating repeated patterns.',
        },
        {
          question: 'How do I repeat text multiple times?',
          answer: 'Enter your text and specify how many times to repeat it. Choose a separator (new line, space, comma, or custom). Copy the result instantly.',
        },
        {
          question: 'What are common uses for text repetition?',
          answer: 'Generate test data for development, create placeholder content, fill spreadsheet cells, make decorative text patterns, or test input field limits.',
        },
      ],
      zh: [
        {
          question: '什么是文本重复器？',
          answer: '文本重复器将您的文本复制指定次数。用于创建测试数据、填充模板或生成重复模式。',
        },
        {
          question: '如何多次重复文本？',
          answer: '输入文本并指定重复次数。选择分隔符（换行、空格、逗号或自定义）。立即复制结果。',
        },
        {
          question: '文本重复的常见用途是什么？',
          answer: '为开发生成测试数据、创建占位内容、填充电子表格单元格、制作装饰性文本图案或测试输入字段限制。',
        },
      ],
    },
  },
];
