/**
 * GEO 优化的工具 FAQ 配置 - 第二十二批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_22: ToolSpecificFAQ[] = [
  // Keyword Density Checker
  {
    slug: 'keyword-density',
    faqs: {
      en: [
        { question: 'What is keyword density?', answer: 'Percentage of times a keyword appears vs total words. 2% density = keyword appears 20 times in 1000 words.' },
        { question: 'What is ideal keyword density?', answer: '1-3% is generally recommended. Too low: poor relevance. Too high: keyword stuffing penalty. Focus on natural writing.' },
        { question: 'How do I check keyword density?', answer: 'Paste your content. We analyze word frequency, show top keywords, and calculate density percentages.' },
      ],
      zh: [
        { question: '什么是关键词密度？', answer: '关键词出现次数与总词数的百分比。2% 密度 = 关键词在 1000 个词中出现 20 次。' },
        { question: '理想的关键词密度是多少？', answer: '通常建议 1-3%。太低：相关性差。太高：关键词堆砌惩罚。专注于自然写作。' },
        { question: '如何检查关键词密度？', answer: '粘贴您的内容。我们分析词频，显示热门关键词，并计算密度百分比。' },
      ],
    },
  },

  // Backlink Checker
  {
    slug: 'backlink-checker',
    faqs: {
      en: [
        { question: 'What are backlinks?', answer: 'Links from other websites pointing to yours. Important ranking factor. Quality matters more than quantity.' },
        { question: 'How do I check backlinks?', answer: 'Enter domain. We show linking domains, anchor text, link types (dofollow/nofollow), and domain authority.' },
        { question: 'What makes a good backlink?', answer: 'From relevant, authoritative sites. Natural anchor text. Dofollow preferred. Contextual placement in content.' },
      ],
      zh: [
        { question: '什么是反向链接？', answer: '从其他网站指向您网站的链接。重要的排名因素。质量比数量更重要。' },
        { question: '如何检查反向链接？', answer: '输入域名。我们显示链接域名、锚文本、链接类型（dofollow/nofollow）和域名权威度。' },
        { question: '什么是好的反向链接？', answer: '来自相关、权威的网站。自然的锚文本。首选 dofollow。在内容中的上下文放置。' },
      ],
    },
  },

  // Page Rank Checker
  {
    slug: 'page-rank-checker',
    faqs: {
      en: [
        { question: 'What is PageRank?', answer: 'Google\'s algorithm measuring page importance based on links. Original PageRank is deprecated, but concept still matters.' },
        { question: 'What metrics replace PageRank?', answer: 'Domain Authority (Moz), Domain Rating (Ahrefs), Trust Flow (Majestic). We show multiple authority metrics.' },
        { question: 'How do I improve page authority?', answer: 'Build quality backlinks, create valuable content, improve site structure, increase social signals.' },
      ],
      zh: [
        { question: '什么是 PageRank？', answer: 'Google 基于链接衡量页面重要性的算法。原始 PageRank 已弃用，但概念仍然重要。' },
        { question: '什么指标取代了 PageRank？', answer: '域名权威度（Moz）、域名评级（Ahrefs）、信任流（Majestic）。我们显示多个权威指标。' },
        { question: '如何提高页面权威度？', answer: '建立高质量反向链接、创建有价值的内容、改善网站结构、增加社交信号。' },
      ],
    },
  },

  // Random Number Generator
  {
    slug: 'random-number-generator',
    faqs: {
      en: [
        { question: 'How do I generate random numbers?', answer: 'Set minimum and maximum values, choose quantity. Click Generate. Numbers are cryptographically random.' },
        { question: 'Are the numbers truly random?', answer: 'Yes, we use crypto.getRandomValues() for cryptographic randomness. Suitable for security applications.' },
        { question: 'Can I generate unique numbers?', answer: 'Yes, enable "no duplicates" option. Useful for lottery picks, random sampling, or unique IDs.' },
      ],
      zh: [
        { question: '如何生成随机数？', answer: '设置最小值和最大值，选择数量。点击生成。数字是加密随机的。' },
        { question: '数字真的是随机的吗？', answer: '是的，我们使用 crypto.getRandomValues() 进行加密随机。适用于安全应用。' },
        { question: '可以生成不重复的数字吗？', answer: '是的，启用"无重复"选项。适用于彩票选号、随机抽样或唯一 ID。' },
      ],
    },
  },

  // Random String Generator
  {
    slug: 'random-string-generator',
    faqs: {
      en: [
        { question: 'How do I generate random strings?', answer: 'Choose length and character types (letters, numbers, symbols). Click Generate. Copy result.' },
        { question: 'What are random strings used for?', answer: 'API keys, tokens, temporary passwords, unique identifiers, test data, session IDs.' },
        { question: 'Can I customize the character set?', answer: 'Yes, include/exclude uppercase, lowercase, numbers, symbols. Or define custom character set.' },
      ],
      zh: [
        { question: '如何生成随机字符串？', answer: '选择长度和字符类型（字母、数字、符号）。点击生成。复制结果。' },
        { question: '随机字符串用于什么？', answer: 'API 密钥、令牌、临时密码、唯一标识符、测试数据、会话 ID。' },
        { question: '可以自定义字符集吗？', answer: '是的，包含/排除大写、小写、数字、符号。或定义自定义字符集。' },
      ],
    },
  },

  // Coin Flip
  {
    slug: 'coin-flip',
    faqs: {
      en: [
        { question: 'How does the coin flip work?', answer: 'Click to flip. Animation shows spinning coin landing on heads or tails. Uses cryptographic randomness for fair results.' },
        { question: 'Is the coin flip fair?', answer: 'Yes, exactly 50/50 probability. Uses secure random number generator. No bias toward either side.' },
        { question: 'Can I flip multiple coins?', answer: 'Yes, set quantity and flip multiple coins at once. See results summary with heads/tails count.' },
      ],
      zh: [
        { question: '抛硬币是如何工作的？', answer: '点击抛掷。动画显示旋转的硬币落在正面或反面。使用加密随机性确保公平结果。' },
        { question: '抛硬币公平吗？', answer: '是的，正好 50/50 概率。使用安全随机数生成器。对任何一面都没有偏向。' },
        { question: '可以同时抛多个硬币吗？', answer: '是的，设置数量并一次抛多个硬币。查看带有正面/反面计数的结果摘要。' },
      ],
    },
  },

  // Dice Roller
  {
    slug: 'dice-roller',
    faqs: {
      en: [
        { question: 'How do I roll dice online?', answer: 'Select dice type (d4, d6, d8, d10, d12, d20, d100), quantity, and roll. See individual results and total.' },
        { question: 'What dice types are available?', answer: 'Standard RPG dice: d4, d6, d8, d10, d12, d20, d100. Also custom dice with any number of sides.' },
        { question: 'Can I roll multiple different dice?', answer: 'Yes, roll combinations like 2d6+1d8+5. Common for tabletop RPGs. We calculate totals and modifiers.' },
      ],
      zh: [
        { question: '如何在线掷骰子？', answer: '选择骰子类型（d4、d6、d8、d10、d12、d20、d100）、数量，然后掷骰。查看单个结果和总计。' },
        { question: '有哪些骰子类型可用？', answer: '标准 RPG 骰子：d4、d6、d8、d10、d12、d20、d100。还有任意面数的自定义骰子。' },
        { question: '可以掷多个不同的骰子吗？', answer: '是的，掷组合如 2d6+1d8+5。常用于桌游 RPG。我们计算总数和修正值。' },
      ],
    },
  },

  // Spin Wheel
  {
    slug: 'spin-wheel',
    faqs: {
      en: [
        { question: 'How do I create a spin wheel?', answer: 'Add options (names, prizes, choices). Click Spin. Wheel rotates and lands on random selection.' },
        { question: 'Can I customize the wheel?', answer: 'Yes, add unlimited options, customize colors, adjust segment sizes for weighted probability.' },
        { question: 'What are spin wheels used for?', answer: 'Random selection, giveaways, decision making, classroom activities, party games, prize wheels.' },
      ],
      zh: [
        { question: '如何创建转盘？', answer: '添加选项（名称、奖品、选择）。点击旋转。转盘旋转并随机停在一个选项上。' },
        { question: '可以自定义转盘吗？', answer: '是的，添加无限选项，自定义颜色，调整扇区大小以设置加权概率。' },
        { question: '转盘用于什么？', answer: '随机选择、抽奖、决策、课堂活动、派对游戏、奖品转盘。' },
      ],
    },
  },

  // Name Picker
  {
    slug: 'name-picker',
    faqs: {
      en: [
        { question: 'How do I pick a random name?', answer: 'Enter list of names (one per line or comma-separated). Click Pick. Random name is selected and highlighted.' },
        { question: 'Can I remove picked names?', answer: 'Yes, enable "remove after picking" to avoid repeats. Great for raffles or assigning tasks.' },
        { question: 'Can I save my name lists?', answer: 'Yes, save lists to browser storage for reuse. Import/export lists as text files.' },
      ],
      zh: [
        { question: '如何随机选择名字？', answer: '输入名字列表（每行一个或逗号分隔）。点击选择。随机名字被选中并高亮显示。' },
        { question: '可以移除已选的名字吗？', answer: '是的，启用"选择后移除"以避免重复。非常适合抽奖或分配任务。' },
        { question: '可以保存名字列表吗？', answer: '是的，将列表保存到浏览器存储以便重用。以文本文件导入/导出列表。' },
      ],
    },
  },

  // Team Generator
  {
    slug: 'team-generator',
    faqs: {
      en: [
        { question: 'How do I generate random teams?', answer: 'Enter participant names, specify number of teams or team size. Click Generate. We randomly distribute people.' },
        { question: 'Can I balance teams by skill?', answer: 'Yes, assign skill ratings to participants. We distribute to create balanced teams.' },
        { question: 'Can I regenerate keeping some assignments?', answer: 'Yes, lock certain people to teams, then regenerate others. Useful for captains or constraints.' },
      ],
      zh: [
        { question: '如何生成随机团队？', answer: '输入参与者名字，指定团队数量或团队大小。点击生成。我们随机分配人员。' },
        { question: '可以按技能平衡团队吗？', answer: '是的，为参与者分配技能评级。我们分配以创建平衡的团队。' },
        { question: '可以保留某些分配重新生成吗？', answer: '是的，将某些人锁定到团队，然后重新生成其他人。适用于队长或约束条件。' },
      ],
    },
  },
];
