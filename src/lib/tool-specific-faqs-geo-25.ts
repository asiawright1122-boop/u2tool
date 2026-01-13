/**
 * GEO 优化的工具 FAQ 配置 - 第二十五批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_25: ToolSpecificFAQ[] = [
  // Fuel Consumption Converter
  {
    slug: 'fuel-consumption-converter',
    faqs: {
      en: [
        { question: 'How do I convert MPG to L/100km?', answer: 'Enter MPG value. Formula: L/100km = 235.215 / MPG. 30 MPG ≈ 7.84 L/100km. We calculate instantly.' },
        { question: 'What is the difference between US and UK MPG?', answer: 'US gallon is smaller. 30 US MPG = 36 UK MPG. We support both standards.' },
        { question: 'Which is better: higher MPG or lower L/100km?', answer: 'Higher MPG = better efficiency. Lower L/100km = better efficiency. They measure the same thing inversely.' },
      ],
      zh: [
        { question: '如何将 MPG 转换为 L/100km？', answer: '输入 MPG 值。公式：L/100km = 235.215 / MPG。30 MPG ≈ 7.84 L/100km。我们即时计算。' },
        { question: '美制 MPG 和英制 MPG 有什么区别？', answer: '美制加仑更小。30 美制 MPG = 36 英制 MPG。我们支持两种标准。' },
        { question: '哪个更好：更高的 MPG 还是更低的 L/100km？', answer: '更高的 MPG = 更好的效率。更低的 L/100km = 更好的效率。它们以相反的方式衡量同一件事。' },
      ],
    },
  },

  // Electricity Cost Calculator
  {
    slug: 'electricity-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate electricity cost?', answer: 'Enter watts, hours of use, and electricity rate ($/kWh). Cost = (Watts × Hours / 1000) × Rate.' },
        { question: 'How do I find my electricity rate?', answer: 'Check your electricity bill for $/kWh rate. US average is ~$0.12-0.15/kWh. Varies by location.' },
        { question: 'How much does it cost to run an appliance?', answer: 'Enter wattage (on label), daily hours, rate. A 100W bulb for 10 hours at $0.12/kWh = $0.12/day.' },
      ],
      zh: [
        { question: '如何计算电费？', answer: '输入瓦数、使用小时数和电价（元/千瓦时）。费用 = (瓦数 × 小时 / 1000) × 电价。' },
        { question: '如何找到我的电价？', answer: '查看您的电费账单上的元/千瓦时费率。中国平均约 0.5-0.8 元/千瓦时。因地区而异。' },
        { question: '运行一个电器要多少钱？', answer: '输入瓦数（标签上）、每日小时数、电价。100W 灯泡每天 10 小时，0.5 元/千瓦时 = 0.5 元/天。' },
      ],
    },
  },

  // Compound Interest Calculator
  {
    slug: 'compound-interest-calculator',
    faqs: {
      en: [
        { question: 'How does compound interest work?', answer: 'Interest earns interest. Principal grows exponentially. More frequent compounding = more growth.' },
        { question: 'What is the compound interest formula?', answer: 'A = P(1 + r/n)^(nt). P=principal, r=rate, n=compounds/year, t=years. We calculate for you.' },
        { question: 'How often should interest compound?', answer: 'Daily > Monthly > Quarterly > Annually. Daily compounding gives highest returns. Check your account terms.' },
      ],
      zh: [
        { question: '复利是如何运作的？', answer: '利息产生利息。本金呈指数增长。复利频率越高 = 增长越多。' },
        { question: '复利公式是什么？', answer: 'A = P(1 + r/n)^(nt)。P=本金，r=利率，n=每年复利次数，t=年数。我们为您计算。' },
        { question: '利息应该多久复利一次？', answer: '每日 > 每月 > 每季度 > 每年。每日复利给出最高回报。检查您的账户条款。' },
      ],
    },
  },

  // Simple Interest Calculator
  {
    slug: 'simple-interest-calculator',
    faqs: {
      en: [
        { question: 'What is simple interest?', answer: 'Interest calculated only on principal. Formula: I = P × r × t. No interest on interest.' },
        { question: 'How is simple interest different from compound?', answer: 'Simple: interest on principal only. Compound: interest on principal + accumulated interest. Compound grows faster.' },
        { question: 'When is simple interest used?', answer: 'Short-term loans, car loans, some bonds. Less common than compound interest in savings.' },
      ],
      zh: [
        { question: '什么是单利？', answer: '仅根据本金计算的利息。公式：I = P × r × t。利息不产生利息。' },
        { question: '单利和复利有什么区别？', answer: '单利：仅对本金计息。复利：对本金 + 累积利息计息。复利增长更快。' },
        { question: '什么时候使用单利？', answer: '短期贷款、汽车贷款、某些债券。在储蓄中不如复利常见。' },
      ],
    },
  },

  // EMI Calculator
  {
    slug: 'emi-calculator',
    faqs: {
      en: [
        { question: 'What is EMI?', answer: 'Equated Monthly Installment - fixed monthly payment for loans. Includes principal and interest portions.' },
        { question: 'How is EMI calculated?', answer: 'EMI = P × r × (1+r)^n / ((1+r)^n - 1). P=principal, r=monthly rate, n=months. We calculate instantly.' },
        { question: 'How can I reduce my EMI?', answer: 'Longer tenure (more interest total), larger down payment, lower interest rate, or prepay principal.' },
      ],
      zh: [
        { question: '什么是 EMI？', answer: '等额月供 - 贷款的固定月付款。包括本金和利息部分。' },
        { question: 'EMI 是如何计算的？', answer: 'EMI = P × r × (1+r)^n / ((1+r)^n - 1)。P=本金，r=月利率，n=月数。我们即时计算。' },
        { question: '如何减少我的 EMI？', answer: '更长的期限（总利息更多）、更大的首付、更低的利率或提前还本金。' },
      ],
    },
  },

  // SIP Calculator
  {
    slug: 'sip-calculator',
    faqs: {
      en: [
        { question: 'What is SIP?', answer: 'Systematic Investment Plan - regular fixed investments in mutual funds. Rupee cost averaging reduces risk.' },
        { question: 'How is SIP return calculated?', answer: 'Uses compound interest with regular contributions. FV = P × ((1+r)^n - 1) / r × (1+r). We show projected growth.' },
        { question: 'What is the power of SIP?', answer: 'Small regular investments grow significantly over time. ₹5000/month at 12% for 20 years ≈ ₹50 lakhs.' },
      ],
      zh: [
        { question: '什么是 SIP？', answer: '系统投资计划 - 定期固定投资于共同基金。平均成本法降低风险。' },
        { question: 'SIP 回报是如何计算的？', answer: '使用带定期供款的复利。FV = P × ((1+r)^n - 1) / r × (1+r)。我们显示预计增长。' },
        { question: 'SIP 的力量是什么？', answer: '小额定期投资随时间显著增长。每月 5000 元，12% 利率，20 年 ≈ 约 500 万元。' },
      ],
    },
  },

  // ROI Calculator
  {
    slug: 'roi-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate ROI?', answer: 'ROI = (Gain - Cost) / Cost × 100%. Invested $1000, now worth $1500 = 50% ROI.' },
        { question: 'What is a good ROI?', answer: 'Depends on investment type. Stocks: 7-10% annually. Real estate: 8-12%. Compare to risk-free rate.' },
        { question: 'Does ROI account for time?', answer: 'Basic ROI doesn\'t. Use annualized ROI for comparison. 50% over 5 years ≈ 8.4% annually.' },
      ],
      zh: [
        { question: '如何计算 ROI？', answer: 'ROI = (收益 - 成本) / 成本 × 100%。投资 1000 元，现在价值 1500 元 = 50% ROI。' },
        { question: '什么是好的 ROI？', answer: '取决于投资类型。股票：每年 7-10%。房地产：8-12%。与无风险利率比较。' },
        { question: 'ROI 考虑时间吗？', answer: '基本 ROI 不考虑。使用年化 ROI 进行比较。5 年 50% ≈ 每年 8.4%。' },
      ],
    },
  },

  // Break Even Calculator
  {
    slug: 'break-even-calculator',
    faqs: {
      en: [
        { question: 'What is break even point?', answer: 'Where total revenue equals total costs. No profit, no loss. Sales needed to cover all expenses.' },
        { question: 'How do I calculate break even?', answer: 'Break Even Units = Fixed Costs / (Price - Variable Cost per Unit). We calculate units and revenue needed.' },
        { question: 'Why is break even important?', answer: 'Shows minimum sales needed to survive. Helps pricing decisions. Essential for business planning.' },
      ],
      zh: [
        { question: '什么是盈亏平衡点？', answer: '总收入等于总成本的点。没有利润，没有亏损。覆盖所有费用所需的销售额。' },
        { question: '如何计算盈亏平衡？', answer: '盈亏平衡单位 = 固定成本 / (价格 - 单位可变成本)。我们计算所需的单位和收入。' },
        { question: '为什么盈亏平衡很重要？', answer: '显示生存所需的最低销售额。帮助定价决策。对商业规划至关重要。' },
      ],
    },
  },

  // Depreciation Calculator
  {
    slug: 'depreciation-calculator',
    faqs: {
      en: [
        { question: 'What is depreciation?', answer: 'Decrease in asset value over time. Used for accounting and tax purposes. Spreads cost over useful life.' },
        { question: 'What depreciation methods are available?', answer: 'Straight-line (equal amounts), declining balance (faster early), sum-of-years, units of production.' },
        { question: 'How do I calculate straight-line depreciation?', answer: 'Annual Depreciation = (Cost - Salvage Value) / Useful Life. $10,000 asset, $2,000 salvage, 5 years = $1,600/year.' },
      ],
      zh: [
        { question: '什么是折旧？', answer: '资产价值随时间减少。用于会计和税务目的。将成本分摊到使用寿命中。' },
        { question: '有哪些折旧方法可用？', answer: '直线法（等额）、余额递减法（早期更快）、年数总和法、产量法。' },
        { question: '如何计算直线折旧？', answer: '年折旧 = (成本 - 残值) / 使用寿命。10,000 元资产，2,000 元残值，5 年 = 1,600 元/年。' },
      ],
    },
  },

  // Payroll Calculator
  {
    slug: 'payroll-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate net pay?', answer: 'Gross Pay - Taxes - Deductions = Net Pay. Enter salary, we calculate federal, state taxes, and take-home pay.' },
        { question: 'What deductions are included?', answer: 'Federal income tax, state tax, Social Security, Medicare, 401k, health insurance. Varies by location.' },
        { question: 'How do I calculate overtime pay?', answer: 'Standard: 1.5× regular rate for hours over 40/week. Some states have daily overtime rules.' },
      ],
      zh: [
        { question: '如何计算净工资？', answer: '总工资 - 税 - 扣除 = 净工资。输入工资，我们计算联邦税、州税和实际到手工资。' },
        { question: '包括哪些扣除项？', answer: '联邦所得税、州税、社会保障、医疗保险、401k、健康保险。因地区而异。' },
        { question: '如何计算加班费？', answer: '标准：每周超过 40 小时按正常工资的 1.5 倍。某些州有每日加班规则。' },
      ],
    },
  },
];
