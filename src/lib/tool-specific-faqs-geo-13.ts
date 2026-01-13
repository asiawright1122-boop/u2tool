/**
 * GEO 优化的工具 FAQ 配置 - 第十三批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_13: ToolSpecificFAQ[] = [
  // Aspect Ratio Calculator
  {
    slug: 'aspect-ratio-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate aspect ratio?', answer: 'Enter width and height. The tool calculates the ratio (e.g., 1920×1080 = 16:9). You can also enter a ratio to find dimensions.' },
        { question: 'What are common aspect ratios?', answer: '16:9 (HD video, monitors), 4:3 (old TV), 21:9 (ultrawide), 1:1 (Instagram square), 9:16 (TikTok/Stories), 3:2 (photos).' },
        { question: 'How do I resize while keeping aspect ratio?', answer: 'Enter original dimensions, then enter new width OR height. The tool calculates the other dimension to maintain the ratio.' },
      ],
      zh: [
        { question: '如何计算宽高比？', answer: '输入宽度和高度。工具计算比例（例如 1920×1080 = 16:9）。您也可以输入比例来查找尺寸。' },
        { question: '常见的宽高比有哪些？', answer: '16:9（高清视频、显示器）、4:3（旧电视）、21:9（超宽屏）、1:1（Instagram 方形）、9:16（TikTok/Stories）、3:2（照片）。' },
        { question: '如何在保持宽高比的同时调整大小？', answer: '输入原始尺寸，然后输入新宽度或高度。工具计算另一个尺寸以保持比例。' },
      ],
    },
  },

  // Discount Calculator
  {
    slug: 'discount-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate discount percentage?', answer: 'Enter original price and sale price. Formula: ((Original - Sale) / Original) × 100. A $100 item at $75 = 25% off.' },
        { question: 'How do I calculate final price after discount?', answer: 'Enter original price and discount %. Formula: Original × (1 - Discount/100). $100 with 25% off = $75.' },
        { question: 'How do I calculate multiple discounts?', answer: 'Apply discounts sequentially. 20% then 10% off $100: $100 × 0.8 = $80, then $80 × 0.9 = $72. Not the same as 30% off!' },
      ],
      zh: [
        { question: '如何计算折扣百分比？', answer: '输入原价和售价。公式：((原价 - 售价) / 原价) × 100。100 元商品 75 元出售 = 75 折。' },
        { question: '如何计算折扣后的最终价格？', answer: '输入原价和折扣百分比。公式：原价 × (1 - 折扣/100)。100 元打 75 折 = 75 元。' },
        { question: '如何计算多重折扣？', answer: '依次应用折扣。100 元先打 8 折再打 9 折：100 × 0.8 = 80，然后 80 × 0.9 = 72 元。不等于 7 折！' },
      ],
    },
  },

  // Tip Calculator
  {
    slug: 'tip-calculator',
    faqs: {
      en: [
        { question: 'How much should I tip?', answer: 'US standard: 15-20% for good service, 20%+ for excellent. Enter bill amount and tip %. We calculate tip amount and total.' },
        { question: 'How do I split the bill with tip?', answer: 'Enter bill, tip %, and number of people. We calculate each person\'s share including their portion of the tip.' },
        { question: 'How do I calculate tip on pre-tax amount?', answer: 'Enter the pre-tax subtotal (not the total with tax). Tip should be calculated on food/service cost, not on taxes.' },
      ],
      zh: [
        { question: '我应该给多少小费？', answer: '美国标准：良好服务 15-20%，优秀服务 20% 以上。输入账单金额和小费百分比，我们计算小费金额和总计。' },
        { question: '如何分摊含小费的账单？', answer: '输入账单、小费百分比和人数。我们计算每人的份额，包括他们的小费部分。' },
        { question: '如何按税前金额计算小费？', answer: '输入税前小计（不是含税总额）。小费应按食物/服务成本计算，而不是按税金计算。' },
      ],
    },
  },

  // Margin Calculator
  {
    slug: 'margin-calculator',
    faqs: {
      en: [
        { question: 'What is the difference between margin and markup?', answer: 'Margin = (Price - Cost) / Price. Markup = (Price - Cost) / Cost. 50% markup = 33.3% margin. They\'re different calculations!' },
        { question: 'How do I calculate profit margin?', answer: 'Enter cost and selling price. Margin = (Selling Price - Cost) / Selling Price × 100. Cost $60, sell $100 = 40% margin.' },
        { question: 'How do I find selling price from margin?', answer: 'Enter cost and desired margin %. Selling Price = Cost / (1 - Margin/100). $60 cost with 40% margin = $100 price.' },
      ],
      zh: [
        { question: '利润率和加价率有什么区别？', answer: '利润率 = (价格 - 成本) / 价格。加价率 = (价格 - 成本) / 成本。50% 加价率 = 33.3% 利润率。它们是不同的计算！' },
        { question: '如何计算利润率？', answer: '输入成本和售价。利润率 = (售价 - 成本) / 售价 × 100。成本 60 元，售价 100 元 = 40% 利润率。' },
        { question: '如何从利润率计算售价？', answer: '输入成本和期望利润率。售价 = 成本 / (1 - 利润率/100)。60 元成本 40% 利润率 = 100 元售价。' },
      ],
    },
  },

  // Salary Calculator
  {
    slug: 'salary-calculator',
    faqs: {
      en: [
        { question: 'How do I convert hourly to annual salary?', answer: 'Hourly × 40 hours × 52 weeks = Annual. $25/hour = $52,000/year. Adjust for your actual hours and weeks worked.' },
        { question: 'How do I calculate monthly salary from annual?', answer: 'Annual ÷ 12 = Monthly. $60,000/year = $5,000/month. For bi-weekly pay: Annual ÷ 26 = $2,307.69.' },
        { question: 'How do I account for taxes?', answer: 'Enter gross salary. We estimate take-home pay based on tax brackets. Actual taxes vary by location and deductions.' },
      ],
      zh: [
        { question: '如何将时薪转换为年薪？', answer: '时薪 × 40 小时 × 52 周 = 年薪。25 元/小时 = 52,000 元/年。根据实际工作时间和周数调整。' },
        { question: '如何从年薪计算月薪？', answer: '年薪 ÷ 12 = 月薪。60,000 元/年 = 5,000 元/月。双周发薪：年薪 ÷ 26。' },
        { question: '如何计算税后工资？', answer: '输入税前工资。我们根据税率档次估算实际到手工资。实际税额因地区和扣除项而异。' },
      ],
    },
  },

  // Investment Calculator
  {
    slug: 'investment-calculator',
    faqs: {
      en: [
        { question: 'How does compound interest work?', answer: 'Interest earns interest. $1000 at 10% compounded annually: Year 1 = $1100, Year 2 = $1210, Year 10 = $2594. More frequent compounding = more growth.' },
        { question: 'What is the Rule of 72?', answer: 'Divide 72 by interest rate to estimate doubling time. At 8% return, money doubles in ~9 years (72÷8=9).' },
        { question: 'How do I calculate future value?', answer: 'Enter principal, rate, time, and compounding frequency. FV = P(1 + r/n)^(nt). We handle the math for you.' },
      ],
      zh: [
        { question: '复利是如何运作的？', answer: '利息产生利息。1000 元年利率 10%：第 1 年 = 1100 元，第 2 年 = 1210 元，第 10 年 = 2594 元。复利频率越高 = 增长越多。' },
        { question: '什么是 72 法则？', answer: '用 72 除以利率来估算翻倍时间。8% 回报率下，资金约 9 年翻倍（72÷8=9）。' },
        { question: '如何计算未来价值？', answer: '输入本金、利率、时间和复利频率。FV = P(1 + r/n)^(nt)。我们为您处理数学计算。' },
      ],
    },
  },

  // Mortgage Calculator
  {
    slug: 'mortgage-calculator',
    faqs: {
      en: [
        { question: 'How is monthly mortgage payment calculated?', answer: 'Based on loan amount, interest rate, and term. Formula uses amortization. $300K at 6% for 30 years ≈ $1,799/month (principal + interest).' },
        { question: 'What is included in mortgage payment?', answer: 'PITI: Principal, Interest, Taxes, Insurance. Our calculator shows P&I. Add ~1-2% of home value annually for taxes and insurance.' },
        { question: 'How much can I afford?', answer: 'Rule of thumb: housing costs ≤ 28% of gross income. $6000/month income → ~$1680 max payment. We help calculate based on your inputs.' },
      ],
      zh: [
        { question: '月供是如何计算的？', answer: '基于贷款金额、利率和期限。公式使用摊销法。30 万贷款 6% 利率 30 年 ≈ 每月 1,799 美元（本金 + 利息）。' },
        { question: '月供包括什么？', answer: 'PITI：本金、利息、税费、保险。我们的计算器显示本金和利息。每年加上房屋价值的 1-2% 作为税费和保险。' },
        { question: '我能负担多少？', answer: '经验法则：住房成本 ≤ 总收入的 28%。月收入 6000 元 → 最高月供约 1680 元。我们根据您的输入帮助计算。' },
      ],
    },
  },

  // Retirement Calculator
  {
    slug: 'retirement-calculator',
    faqs: {
      en: [
        { question: 'How much do I need to retire?', answer: 'Rule of 25: Annual expenses × 25 = retirement target. Need $50K/year? Target $1.25M. This assumes 4% safe withdrawal rate.' },
        { question: 'What is the 4% rule?', answer: 'Withdraw 4% of portfolio in year 1, adjust for inflation. Historically provides 30+ years of income. $1M portfolio = $40K/year.' },
        { question: 'How do I calculate retirement savings needed?', answer: 'Enter current age, retirement age, current savings, monthly contribution, and expected return. We project your retirement balance.' },
      ],
      zh: [
        { question: '我需要多少钱才能退休？', answer: '25 倍法则：年支出 × 25 = 退休目标。需要每年 5 万？目标 125 万。这假设 4% 安全提取率。' },
        { question: '什么是 4% 法则？', answer: '第一年提取投资组合的 4%，之后根据通胀调整。历史上可提供 30 年以上的收入。100 万投资组合 = 每年 4 万。' },
        { question: '如何计算所需的退休储蓄？', answer: '输入当前年龄、退休年龄、当前储蓄、每月供款和预期回报。我们预测您的退休余额。' },
      ],
    },
  },

  // Tax Calculator
  {
    slug: 'tax-calculator',
    faqs: {
      en: [
        { question: 'How do tax brackets work?', answer: 'Progressive taxation: only income in each bracket is taxed at that rate. $50K income doesn\'t mean 22% on all $50K, just on the portion in that bracket.' },
        { question: 'What is the difference between marginal and effective tax rate?', answer: 'Marginal = rate on next dollar earned. Effective = total tax / total income. Effective is always lower than your top marginal rate.' },
        { question: 'How do I estimate my tax refund?', answer: 'Compare total tax owed vs. total withheld. Withheld more than owed = refund. Owed more than withheld = payment due.' },
      ],
      zh: [
        { question: '税率档次是如何运作的？', answer: '累进税制：只有每个档次内的收入按该税率征税。5 万收入不意味着全部按 22% 征税，只是该档次内的部分。' },
        { question: '边际税率和有效税率有什么区别？', answer: '边际税率 = 下一美元收入的税率。有效税率 = 总税额 / 总收入。有效税率总是低于您的最高边际税率。' },
        { question: '如何估算退税？', answer: '比较应缴税额与已预扣税额。预扣多于应缴 = 退税。应缴多于预扣 = 需补缴。' },
      ],
    },
  },

  // Currency Converter
  {
    slug: 'currency-converter',
    faqs: {
      en: [
        { question: 'How accurate are exchange rates?', answer: 'We use real-time market rates updated frequently. Actual rates at banks/exchanges may differ due to fees and spreads.' },
        { question: 'What is the difference between buy and sell rates?', answer: 'Banks buy currency at lower rate, sell at higher rate. The difference (spread) is their profit. Mid-market rate is the average.' },
        { question: 'How do I convert multiple currencies?', answer: 'Enter amount and select source/target currencies. For complex conversions, convert to USD first, then to target currency.' },
      ],
      zh: [
        { question: '汇率有多准确？', answer: '我们使用频繁更新的实时市场汇率。银行/兑换处的实际汇率可能因手续费和点差而不同。' },
        { question: '买入价和卖出价有什么区别？', answer: '银行以较低价格买入货币，以较高价格卖出。差价（点差）是他们的利润。中间汇率是平均值。' },
        { question: '如何转换多种货币？', answer: '输入金额并选择源/目标货币。对于复杂转换，先转换为美元，再转换为目标货币。' },
      ],
    },
  },
];
