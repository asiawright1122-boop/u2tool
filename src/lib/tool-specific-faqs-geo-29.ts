/**
 * GEO 优化的工具 FAQ 配置 - 第二十九批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_29: ToolSpecificFAQ[] = [
  // Budget Planner
  {
    slug: 'budget-planner',
    faqs: {
      en: [
        { question: 'How do I create a budget?', answer: 'Enter income, list expenses by category. We calculate remaining and show allocation. Adjust until balanced.' },
        { question: 'What is the 50/30/20 rule?', answer: '50% needs (housing, food), 30% wants (entertainment), 20% savings/debt. Good starting framework.' },
        { question: 'How often should I review my budget?', answer: 'Monthly review recommended. Adjust for life changes. Track actual vs planned spending.' },
      ],
      zh: [
        { question: '如何创建预算？', answer: '输入收入，按类别列出支出。我们计算剩余并显示分配。调整直到平衡。' },
        { question: '什么是 50/30/20 法则？', answer: '50% 需求（住房、食物），30% 想要（娱乐），20% 储蓄/债务。良好的起始框架。' },
        { question: '我应该多久审查一次预算？', answer: '建议每月审查。根据生活变化调整。跟踪实际与计划支出。' },
      ],
    },
  },

  // Bill Splitter
  {
    slug: 'bill-splitter',
    faqs: {
      en: [
        { question: 'How do I split a bill?', answer: 'Enter total, number of people, tip percentage. We calculate each person\'s share including tip.' },
        { question: 'Can I split unevenly?', answer: 'Yes, assign different amounts or percentages to each person. Useful when people ordered different items.' },
        { question: 'How do I handle shared items?', answer: 'Add shared items separately, divide among sharers. Individual items assigned to specific people.' },
      ],
      zh: [
        { question: '如何分摊账单？', answer: '输入总额、人数、小费百分比。我们计算每人的份额，包括小费。' },
        { question: '可以不均等分摊吗？', answer: '是的，为每人分配不同的金额或百分比。当人们点了不同的东西时很有用。' },
        { question: '如何处理共享项目？', answer: '单独添加共享项目，在分享者之间分配。个人项目分配给特定的人。' },
      ],
    },
  },

  // Debt Payoff Calculator
  {
    slug: 'debt-payoff-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate debt payoff?', answer: 'Enter debts with balances, rates, minimum payments. We show payoff timeline and total interest.' },
        { question: 'What is the debt avalanche method?', answer: 'Pay minimums on all, extra to highest interest rate. Mathematically optimal, saves most interest.' },
        { question: 'What is the debt snowball method?', answer: 'Pay minimums on all, extra to smallest balance. Quick wins for motivation. Slightly more interest paid.' },
      ],
      zh: [
        { question: '如何计算债务还清？', answer: '输入债务余额、利率、最低还款额。我们显示还清时间表和总利息。' },
        { question: '什么是债务雪崩法？', answer: '对所有债务支付最低还款额，额外资金用于最高利率的债务。数学上最优，节省最多利息。' },
        { question: '什么是债务滚雪球法？', answer: '对所有债务支付最低还款额，额外资金用于最小余额的债务。快速胜利以获得动力。支付的利息略多。' },
      ],
    },
  },

  // Savings Goal Calculator
  {
    slug: 'savings-goal-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate savings needed?', answer: 'Enter goal amount and target date. We calculate monthly savings needed. Adjust for interest earnings.' },
        { question: 'How does compound interest help savings?', answer: 'Interest earns interest. $500/month at 5% for 10 years = $77,641 (vs $60,000 without interest).' },
        { question: 'What if I can\'t save the calculated amount?', answer: 'Extend timeline, reduce goal, or find ways to increase income/reduce expenses. We show trade-offs.' },
      ],
      zh: [
        { question: '如何计算所需储蓄？', answer: '输入目标金额和目标日期。我们计算所需的每月储蓄。根据利息收益调整。' },
        { question: '复利如何帮助储蓄？', answer: '利息产生利息。每月 500 元，5% 利率，10 年 = 77,641 元（相比没有利息的 60,000 元）。' },
        { question: '如果我存不了计算出的金额怎么办？', answer: '延长时间线、减少目标或找到增加收入/减少支出的方法。我们显示权衡。' },
      ],
    },
  },

  // Net Worth Calculator
  {
    slug: 'net-worth-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate net worth?', answer: 'List assets (cash, investments, property) and liabilities (debts, loans). Net Worth = Assets - Liabilities.' },
        { question: 'What should I include in assets?', answer: 'Cash, savings, investments, retirement accounts, real estate, vehicles, valuables. Use current market values.' },
        { question: 'How often should I calculate net worth?', answer: 'Monthly or quarterly. Track trends over time. Celebrate growth, identify areas to improve.' },
      ],
      zh: [
        { question: '如何计算净资产？', answer: '列出资产（现金、投资、房产）和负债（债务、贷款）。净资产 = 资产 - 负债。' },
        { question: '资产应该包括什么？', answer: '现金、储蓄、投资、退休账户、房地产、车辆、贵重物品。使用当前市场价值。' },
        { question: '我应该多久计算一次净资产？', answer: '每月或每季度。跟踪随时间变化的趋势。庆祝增长，确定需要改进的领域。' },
      ],
    },
  },

  // Stock Profit Calculator
  {
    slug: 'stock-profit-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate stock profit?', answer: 'Enter buy price, sell price, shares, and fees. Profit = (Sell - Buy) × Shares - Fees.' },
        { question: 'How do I calculate percentage return?', answer: 'Return % = (Profit / Investment) × 100. We show both dollar profit and percentage return.' },
        { question: 'Should I include dividends?', answer: 'Yes, for total return. Add dividend income to capital gains. We calculate total return including dividends.' },
      ],
      zh: [
        { question: '如何计算股票利润？', answer: '输入买入价、卖出价、股数和费用。利润 = (卖出价 - 买入价) × 股数 - 费用。' },
        { question: '如何计算百分比回报？', answer: '回报率 % = (利润 / 投资) × 100。我们显示美元利润和百分比回报。' },
        { question: '应该包括股息吗？', answer: '是的，用于总回报。将股息收入加到资本收益中。我们计算包括股息的总回报。' },
      ],
    },
  },

  // Crypto Profit Calculator
  {
    slug: 'crypto-profit-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate crypto profit?', answer: 'Enter buy price, current/sell price, amount. We calculate profit/loss in fiat currency and percentage.' },
        { question: 'How do I account for multiple purchases?', answer: 'Enter each purchase separately. We calculate average cost basis and total profit/loss.' },
        { question: 'What about crypto taxes?', answer: 'Crypto gains are taxable in most countries. Track cost basis for each transaction. Consult tax professional.' },
      ],
      zh: [
        { question: '如何计算加密货币利润？', answer: '输入买入价、当前/卖出价、数量。我们计算法币利润/亏损和百分比。' },
        { question: '如何计算多次购买？', answer: '分别输入每次购买。我们计算平均成本基础和总利润/亏损。' },
        { question: '加密货币税怎么办？', answer: '在大多数国家，加密货币收益需要纳税。跟踪每笔交易的成本基础。咨询税务专业人士。' },
      ],
    },
  },

  // Typing Speed Test
  {
    slug: 'typing-test',
    faqs: {
      en: [
        { question: 'How is typing speed measured?', answer: 'Words Per Minute (WPM). A "word" is 5 characters. 60 WPM = 300 characters per minute.' },
        { question: 'What is a good typing speed?', answer: 'Average: 40 WPM. Good: 60-80 WPM. Professional: 80-100+ WPM. Practice regularly to improve.' },
        { question: 'How can I improve typing speed?', answer: 'Practice daily, use proper finger placement, don\'t look at keyboard, focus on accuracy first then speed.' },
      ],
      zh: [
        { question: '打字速度是如何测量的？', answer: '每分钟字数（WPM）。一个"字"是 5 个字符。60 WPM = 每分钟 300 个字符。' },
        { question: '什么是好的打字速度？', answer: '平均：40 WPM。良好：60-80 WPM。专业：80-100+ WPM。定期练习以提高。' },
        { question: '如何提高打字速度？', answer: '每天练习，使用正确的手指位置，不要看键盘，先注重准确性然后是速度。' },
      ],
    },
  },

  // Click Speed Test
  {
    slug: 'click-speed-test',
    faqs: {
      en: [
        { question: 'How is click speed measured?', answer: 'Clicks Per Second (CPS). Click as fast as possible for set time. We count total clicks and calculate CPS.' },
        { question: 'What is a good CPS?', answer: 'Average: 6-7 CPS. Good: 8-10 CPS. Pro gamers: 10-14 CPS. Useful for gaming performance.' },
        { question: 'How can I click faster?', answer: 'Jitter clicking, butterfly clicking techniques. Practice regularly. Good mouse helps. Don\'t strain your hand.' },
      ],
      zh: [
        { question: '点击速度是如何测量的？', answer: '每秒点击次数（CPS）。在设定时间内尽可能快地点击。我们计算总点击次数并计算 CPS。' },
        { question: '什么是好的 CPS？', answer: '平均：6-7 CPS。良好：8-10 CPS。职业玩家：10-14 CPS。对游戏性能有用。' },
        { question: '如何点击更快？', answer: '抖动点击、蝴蝶点击技术。定期练习。好的鼠标有帮助。不要让手紧张。' },
      ],
    },
  },

  // Reaction Time Test
  {
    slug: 'reaction-time-test',
    faqs: {
      en: [
        { question: 'How is reaction time measured?', answer: 'Time between stimulus (color change) and your click. Measured in milliseconds (ms).' },
        { question: 'What is a good reaction time?', answer: 'Average: 250-300 ms. Good: 200-250 ms. Excellent: <200 ms. Pro gamers: 150-180 ms.' },
        { question: 'How can I improve reaction time?', answer: 'Practice regularly, get enough sleep, reduce distractions, stay focused. Caffeine may help short-term.' },
      ],
      zh: [
        { question: '反应时间是如何测量的？', answer: '刺激（颜色变化）和您点击之间的时间。以毫秒（ms）为单位测量。' },
        { question: '什么是好的反应时间？', answer: '平均：250-300 毫秒。良好：200-250 毫秒。优秀：<200 毫秒。职业玩家：150-180 毫秒。' },
        { question: '如何提高反应时间？', answer: '定期练习，充足睡眠，减少干扰，保持专注。咖啡因可能短期有帮助。' },
      ],
    },
  },
];
