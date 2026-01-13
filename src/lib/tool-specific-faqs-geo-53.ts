/**
 * GEO 优化工具 FAQ - 第 53 批
 * 建筑计算器、社交媒体工具和开发工具
 */

import type { ToolSpecificFAQ } from './tool-specific-faqs';

export const GEO_TOOL_FAQS_53: ToolSpecificFAQ[] = [
  {
    slug: 'concrete-calculator',
    faqs: {
      en: [
        {
          question: 'How do I calculate concrete needed for a project?',
          answer: 'Enter the dimensions (length, width, thickness) of your project area. The calculator shows cubic yards/meters of concrete needed, plus recommended extra for waste (typically 10%).',
        },
        {
          question: 'How do I calculate concrete for different shapes?',
          answer: 'Choose from slab, footing, column, or stairs shapes. Enter the relevant dimensions for each shape type. The calculator handles the geometry automatically.',
        },
        {
          question: 'How many bags of concrete do I need?',
          answer: 'After calculating volume, the tool shows how many bags you need based on bag size (40lb, 60lb, 80lb). It accounts for the yield per bag to give accurate estimates.',
        },
      ],
      zh: [
        {
          question: '如何计算项目所需的混凝土量？',
          answer: '输入项目区域的尺寸（长、宽、厚度）。计算器显示所需的立方码/米混凝土，加上建议的额外量用于浪费（通常 10%）。',
        },
        {
          question: '如何计算不同形状的混凝土？',
          answer: '从板、基脚、柱或楼梯形状中选择。为每种形状类型输入相关尺寸。计算器自动处理几何计算。',
        },
        {
          question: '我需要多少袋混凝土？',
          answer: '计算体积后，工具根据袋子大小（40磅、60磅、80磅）显示您需要多少袋。它考虑每袋的产量以给出准确的估计。',
        },
      ],
    },
  },
  {
    slug: 'paint-calculator',
    faqs: {
      en: [
        {
          question: 'How do I calculate paint needed for a room?',
          answer: 'Enter room dimensions (length, width, height) and the number of doors/windows. The calculator determines wall area and recommends gallons of paint needed, accounting for coverage rate.',
        },
        {
          question: 'How many coats of paint should I plan for?',
          answer: 'Most projects need 2 coats for even coverage. Select the number of coats and the calculator adjusts the paint quantity. Dark colors over light may need 3+ coats.',
        },
        {
          question: 'What is paint coverage rate?',
          answer: 'Coverage rate is the area one gallon covers (typically 350-400 sq ft). It varies by paint type and surface texture. The calculator uses standard rates but you can adjust for your specific paint.',
        },
      ],
      zh: [
        {
          question: '如何计算房间所需的油漆量？',
          answer: '输入房间尺寸（长、宽、高）和门/窗数量。计算器确定墙面面积并推荐所需的油漆加仑数，考虑覆盖率。',
        },
        {
          question: '应该计划涂几层油漆？',
          answer: '大多数项目需要 2 层才能均匀覆盖。选择层数，计算器会调整油漆数量。深色覆盖浅色可能需要 3 层以上。',
        },
        {
          question: '什么是油漆覆盖率？',
          answer: '覆盖率是一加仑油漆覆盖的面积（通常 350-400 平方英尺）。它因油漆类型和表面纹理而异。计算器使用标准费率，但您可以根据具体油漆进行调整。',
        },
      ],
    },
  },
  {
    slug: 'tile-calculator',
    faqs: {
      en: [
        {
          question: 'How do I calculate tiles needed for a floor?',
          answer: 'Enter the room dimensions and tile size. The calculator shows the number of tiles needed, including extra for cuts and waste (typically 10-15% extra recommended).',
        },
        {
          question: 'How do I account for tile waste?',
          answer: 'Add 10% extra for simple layouts, 15% for diagonal patterns, and 20% for complex patterns or rooms with many corners. The calculator lets you adjust the waste percentage.',
        },
        {
          question: 'Can I calculate tiles for walls too?',
          answer: 'Yes, enter wall dimensions to calculate tiles for backsplashes, shower walls, or accent walls. Subtract areas for windows, doors, or fixtures.',
        },
      ],
      zh: [
        {
          question: '如何计算地板所需的瓷砖数量？',
          answer: '输入房间尺寸和瓷砖大小。计算器显示所需的瓷砖数量，包括切割和浪费的额外量（通常建议额外 10-15%）。',
        },
        {
          question: '如何考虑瓷砖浪费？',
          answer: '简单布局添加 10% 额外量，对角线图案 15%，复杂图案或有很多角落的房间 20%。计算器允许您调整浪费百分比。',
        },
        {
          question: '也可以计算墙砖吗？',
          answer: '是的，输入墙壁尺寸来计算后挡板、淋浴墙或装饰墙的瓷砖。减去窗户、门或固定装置的面积。',
        },
      ],
    },
  },
  {
    slug: 'instagram-font-generator',
    faqs: {
      en: [
        {
          question: 'How do I create fancy fonts for Instagram?',
          answer: 'Type your text and see it converted to various Unicode font styles instantly. Copy any style and paste directly into Instagram bio, captions, or comments. Works on all devices.',
        },
        {
          question: 'Why do these fonts work on Instagram?',
          answer: 'These aren\'t actually fonts - they\'re Unicode characters that look like different font styles. Since they\'re standard characters, they display correctly on any platform.',
        },
        {
          question: 'What font styles are available?',
          answer: 'Choose from bold, italic, script, gothic, bubble, small caps, strikethrough, underline, and many decorative styles. Mix and match for unique text effects.',
        },
      ],
      zh: [
        {
          question: '如何为 Instagram 创建花式字体？',
          answer: '输入文本，立即看到它转换为各种 Unicode 字体样式。复制任何样式并直接粘贴到 Instagram 简介、标题或评论中。适用于所有设备。',
        },
        {
          question: '为什么这些字体在 Instagram 上有效？',
          answer: '这些实际上不是字体 - 它们是看起来像不同字体样式的 Unicode 字符。由于它们是标准字符，因此在任何平台上都能正确显示。',
        },
        {
          question: '有哪些字体样式可用？',
          answer: '从粗体、斜体、手写体、哥特体、气泡体、小型大写字母、删除线、下划线和许多装饰样式中选择。混合搭配以获得独特的文本效果。',
        },
      ],
    },
  },
  {
    slug: 'social-media-size-guide',
    faqs: {
      en: [
        {
          question: 'What are the correct image sizes for social media?',
          answer: 'Each platform has optimal sizes: Instagram post (1080x1080), Story (1080x1920), Facebook post (1200x630), Twitter (1600x900), LinkedIn (1200x627). Our guide covers all platforms.',
        },
        {
          question: 'Why do image sizes matter for social media?',
          answer: 'Correct sizes ensure your images display properly without cropping or quality loss. Optimized images also load faster and look more professional, improving engagement.',
        },
        {
          question: 'How often do social media size requirements change?',
          answer: 'Platforms update requirements periodically. Our guide is regularly updated to reflect the latest specifications. Check back before major campaigns.',
        },
      ],
      zh: [
        {
          question: '社交媒体的正确图像尺寸是什么？',
          answer: '每个平台都有最佳尺寸：Instagram 帖子（1080x1080）、Story（1080x1920）、Facebook 帖子（1200x630）、Twitter（1600x900）、LinkedIn（1200x627）。我们的指南涵盖所有平台。',
        },
        {
          question: '为什么图像尺寸对社交媒体很重要？',
          answer: '正确的尺寸确保您的图像正确显示，不会被裁剪或质量损失。优化的图像加载更快，看起来更专业，提高参与度。',
        },
        {
          question: '社交媒体尺寸要求多久更改一次？',
          answer: '平台会定期更新要求。我们的指南会定期更新以反映最新规格。在重大活动前查看。',
        },
      ],
    },
  },
  {
    slug: 'keyword-density-checker',
    faqs: {
      en: [
        {
          question: 'What is keyword density?',
          answer: 'Keyword density is the percentage of times a keyword appears compared to total words. For SEO, 1-2% density is generally recommended. Too high can be seen as keyword stuffing.',
        },
        {
          question: 'How do I check keyword density?',
          answer: 'Paste your content and enter target keywords. The tool calculates density for each keyword, shows word count, and highlights keyword occurrences in the text.',
        },
        {
          question: 'What is the ideal keyword density for SEO?',
          answer: 'There\'s no perfect number, but 1-2% is a good guideline. Focus on natural writing first. Modern SEO values context and relevance over exact keyword frequency.',
        },
      ],
      zh: [
        {
          question: '什么是关键词密度？',
          answer: '关键词密度是关键词出现次数与总字数的百分比。对于 SEO，通常建议 1-2% 的密度。太高可能被视为关键词堆砌。',
        },
        {
          question: '如何检查关键词密度？',
          answer: '粘贴内容并输入目标关键词。工具计算每个关键词的密度，显示字数，并在文本中高亮关键词出现的位置。',
        },
        {
          question: 'SEO 的理想关键词密度是多少？',
          answer: '没有完美的数字，但 1-2% 是一个好的指导方针。首先关注自然写作。现代 SEO 重视上下文和相关性，而不是精确的关键词频率。',
        },
      ],
    },
  },
  {
    slug: 'text-summarizer',
    faqs: {
      en: [
        {
          question: 'How does the text summarizer work?',
          answer: 'Paste your text and select the desired summary length. The tool uses AI to identify key sentences and concepts, creating a concise summary that captures the main points.',
        },
        {
          question: 'What types of content can I summarize?',
          answer: 'Summarize articles, research papers, reports, emails, or any text content. Works best with well-structured content that has clear main points.',
        },
        {
          question: 'How accurate are the summaries?',
          answer: 'Summaries capture key points but may miss nuances. Always review the summary for accuracy, especially for important documents. Use it as a starting point, not a replacement for reading.',
        },
      ],
      zh: [
        {
          question: '文本摘要器如何工作？',
          answer: '粘贴文本并选择所需的摘要长度。工具使用 AI 识别关键句子和概念，创建捕捉要点的简洁摘要。',
        },
        {
          question: '可以摘要哪些类型的内容？',
          answer: '摘要文章、研究论文、报告、电子邮件或任何文本内容。对于结构良好、要点清晰的内容效果最好。',
        },
        {
          question: '摘要有多准确？',
          answer: '摘要捕捉要点但可能遗漏细微差别。始终检查摘要的准确性，特别是对于重要文件。将其用作起点，而不是阅读的替代品。',
        },
      ],
    },
  },
  {
    slug: 'paraphrase-tool',
    faqs: {
      en: [
        {
          question: 'What is a paraphrase tool?',
          answer: 'A paraphrase tool rewrites text while keeping the original meaning. It helps avoid plagiarism, improve clarity, or create alternative versions of content.',
        },
        {
          question: 'How do I paraphrase text?',
          answer: 'Paste your text and click paraphrase. The tool generates a rewritten version with different words and sentence structures. Review and edit as needed.',
        },
        {
          question: 'Is paraphrased content plagiarism-free?',
          answer: 'Paraphrasing helps avoid direct copying, but you should still cite sources for ideas. The tool changes words, not the underlying concepts or facts.',
        },
      ],
      zh: [
        {
          question: '什么是改写工具？',
          answer: '改写工具在保持原意的同时重写文本。它有助于避免抄袭、提高清晰度或创建内容的替代版本。',
        },
        {
          question: '如何改写文本？',
          answer: '粘贴文本并点击改写。工具生成使用不同词语和句子结构的重写版本。根据需要审查和编辑。',
        },
        {
          question: '改写的内容没有抄袭吗？',
          answer: '改写有助于避免直接复制，但您仍应为想法引用来源。工具改变词语，而不是基本概念或事实。',
        },
      ],
    },
  },
  {
    slug: 'graphql-formatter',
    faqs: {
      en: [
        {
          question: 'What is a GraphQL formatter?',
          answer: 'A GraphQL formatter beautifies and validates GraphQL queries, mutations, and schemas. It adds proper indentation, line breaks, and highlights syntax for better readability.',
        },
        {
          question: 'How do I format GraphQL queries?',
          answer: 'Paste your GraphQL code and click format. The tool structures your query with proper indentation, aligns fields, and validates syntax. Copy the formatted result.',
        },
        {
          question: 'Can I validate GraphQL syntax?',
          answer: 'Yes, the formatter checks for syntax errors and highlights issues. It validates query structure, field names, and argument formatting according to GraphQL specification.',
        },
      ],
      zh: [
        {
          question: '什么是 GraphQL 格式化器？',
          answer: 'GraphQL 格式化器美化和验证 GraphQL 查询、变更和模式。它添加正确的缩进、换行并高亮语法以提高可读性。',
        },
        {
          question: '如何格式化 GraphQL 查询？',
          answer: '粘贴 GraphQL 代码并点击格式化。工具使用正确的缩进构建查询，对齐字段并验证语法。复制格式化的结果。',
        },
        {
          question: '可以验证 GraphQL 语法吗？',
          answer: '是的，格式化器检查语法错误并高亮问题。它根据 GraphQL 规范验证查询结构、字段名称和参数格式。',
        },
      ],
    },
  },
  {
    slug: 'code-screenshot-generator',
    faqs: {
      en: [
        {
          question: 'How do I create beautiful code screenshots?',
          answer: 'Paste your code, select a theme and language for syntax highlighting. Customize the window style, background, and padding. Export as PNG or copy to clipboard.',
        },
        {
          question: 'What customization options are available?',
          answer: 'Choose from various themes (dark, light, colorful), window styles (macOS, Windows, none), backgrounds (solid, gradient, transparent), fonts, and padding.',
        },
        {
          question: 'What are code screenshots used for?',
          answer: 'Share code on social media, documentation, presentations, or tutorials. Beautiful screenshots are more engaging than plain text and preserve formatting across platforms.',
        },
      ],
      zh: [
        {
          question: '如何创建漂亮的代码截图？',
          answer: '粘贴代码，选择主题和语言进行语法高亮。自定义窗口样式、背景和内边距。导出为 PNG 或复制到剪贴板。',
        },
        {
          question: '有哪些自定义选项？',
          answer: '从各种主题（深色、浅色、彩色）、窗口样式（macOS、Windows、无）、背景（纯色、渐变、透明）、字体和内边距中选择。',
        },
        {
          question: '代码截图用于什么？',
          answer: '在社交媒体、文档、演示或教程中分享代码。漂亮的截图比纯文本更吸引人，并在各平台保持格式。',
        },
      ],
    },
  },
];
