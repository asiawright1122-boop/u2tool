/**
 * GEO 优化的工具 FAQ 配置 - 第六批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_6: ToolSpecificFAQ[] = [
  // BMI Calculator
  {
    slug: 'bmi-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate my BMI?', answer: 'Enter your height and weight, then click Calculate. BMI = weight(kg) / height(m)². The result shows your category: underweight, normal, overweight, or obese.' },
        { question: 'What is a healthy BMI range?', answer: 'Normal BMI is 18.5-24.9. Below 18.5 is underweight, 25-29.9 is overweight, and 30+ is obese. BMI is a screening tool, not a diagnostic measure.' },
        { question: 'Is BMI accurate for everyone?', answer: 'BMI doesn\'t account for muscle mass, age, or body composition. Athletes may have high BMI due to muscle. Consult a healthcare provider for personalized assessment.' },
      ],
      zh: [
        { question: '如何计算我的 BMI？', answer: '输入身高和体重，然后点击计算。BMI = 体重(kg) / 身高(m)²。结果显示您的类别：偏瘦、正常、超重或肥胖。' },
        { question: '健康的 BMI 范围是多少？', answer: '正常 BMI 是 18.5-24.9。低于 18.5 是偏瘦，25-29.9 是超重，30 以上是肥胖。BMI 是筛查工具，不是诊断标准。' },
        { question: 'BMI 对每个人都准确吗？', answer: 'BMI 不考虑肌肉量、年龄或身体成分。运动员可能因肌肉而 BMI 较高。请咨询医疗专业人员进行个性化评估。' },
      ],
    },
  },

  // Age Calculator
  {
    slug: 'age-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate my exact age?', answer: 'Enter your birth date and the tool calculates your age in years, months, days, hours, and even seconds. It also shows your next birthday countdown.' },
        { question: 'Can I calculate age between two dates?', answer: 'Yes, enter any two dates to find the exact time difference. Useful for calculating duration of events, employment periods, or historical timespans.' },
        { question: 'Does it account for leap years?', answer: 'Yes, our calculator correctly handles leap years and varying month lengths for precise age calculation down to the day.' },
      ],
      zh: [
        { question: '如何计算我的确切年龄？', answer: '输入出生日期，工具会计算您的年龄（年、月、日、小时甚至秒）。还会显示下一个生日倒计时。' },
        { question: '可以计算两个日期之间的年龄吗？', answer: '是的，输入任意两个日期可以找到确切的时间差。用于计算事件持续时间、工作年限或历史时间跨度很有用。' },
        { question: '会考虑闰年吗？', answer: '是的，我们的计算器正确处理闰年和不同月份长度，精确计算到天。' },
      ],
    },
  },

  // Tip Calculator
  {
    slug: 'tip-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate a tip?', answer: 'Enter the bill amount and tip percentage (15%, 18%, 20%, or custom). The tool shows tip amount and total. You can also split the bill among multiple people.' },
        { question: 'What is a standard tip percentage?', answer: '15-20% is standard in the US. 15% for adequate service, 18% for good service, 20%+ for excellent service. Customs vary by country.' },
        { question: 'Can I split the bill?', answer: 'Yes, enter the number of people to see each person\'s share of the bill and tip. Perfect for group dining.' },
      ],
      zh: [
        { question: '如何计算小费？', answer: '输入账单金额和小费百分比（15%、18%、20% 或自定义）。工具显示小费金额和总计。还可以在多人之间分摊账单。' },
        { question: '标准小费百分比是多少？', answer: '在美国，15-20% 是标准。15% 表示服务尚可，18% 表示服务良好，20% 以上表示服务优秀。各国习惯不同。' },
        { question: '可以分摊账单吗？', answer: '是的，输入人数可以看到每人分摊的账单和小费。非常适合聚餐。' },
      ],
    },
  },

  // Discount Calculator
  {
    slug: 'discount-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate a discount?', answer: 'Enter the original price and discount percentage. The tool shows the discount amount and final price you\'ll pay.' },
        { question: 'Can I calculate multiple discounts?', answer: 'Yes, apply sequential discounts (e.g., 20% off then additional 10% off). The tool shows how stacked discounts work.' },
        { question: 'How do I find the discount percentage?', answer: 'Enter original and sale prices to calculate the discount percentage. Useful for comparing deals across stores.' },
      ],
      zh: [
        { question: '如何计算折扣？', answer: '输入原价和折扣百分比。工具显示折扣金额和您需要支付的最终价格。' },
        { question: '可以计算多重折扣吗？', answer: '是的，可以应用连续折扣（如先打 8 折再打 9 折）。工具显示叠加折扣的计算方式。' },
        { question: '如何找出折扣百分比？', answer: '输入原价和促销价可以计算折扣百分比。用于比较不同商店的优惠很有用。' },
      ],
    },
  },

  // Salary Calculator
  {
    slug: 'salary-calculator',
    faqs: {
      en: [
        { question: 'How do I convert hourly to annual salary?', answer: 'Enter your hourly rate and hours per week. The tool calculates daily, weekly, monthly, and annual salary based on standard work weeks.' },
        { question: 'Does it account for taxes?', answer: 'This is a gross salary calculator. For net pay, you\'d need to subtract taxes which vary by location. We show the pre-tax amounts.' },
        { question: 'Can I calculate overtime pay?', answer: 'Yes, enter overtime hours and rate multiplier (typically 1.5x). The tool adds overtime to your regular pay calculation.' },
      ],
      zh: [
        { question: '如何将时薪转换为年薪？', answer: '输入时薪和每周工作小时数。工具根据标准工作周计算日薪、周薪、月薪和年薪。' },
        { question: '会考虑税收吗？', answer: '这是税前工资计算器。净工资需要减去因地区而异的税款。我们显示的是税前金额。' },
        { question: '可以计算加班费吗？', answer: '是的，输入加班小时数和倍率（通常是 1.5 倍）。工具会将加班费加到常规工资计算中。' },
      ],
    },
  },

  // Mortgage Calculator
  {
    slug: 'mortgage-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate mortgage payments?', answer: 'Enter loan amount, interest rate, and term (years). The tool shows monthly payment, total interest, and full amortization schedule.' },
        { question: 'What is included in the monthly payment?', answer: 'Our calculator shows principal and interest (P&I). Actual payments may include property tax, insurance, and PMI depending on your loan.' },
        { question: 'How does extra payment affect my mortgage?', answer: 'Enter extra monthly or one-time payments to see how much interest you save and how many years you cut from your loan term.' },
      ],
      zh: [
        { question: '如何计算房贷还款？', answer: '输入贷款金额、利率和期限（年）。工具显示月供、总利息和完整的还款计划表。' },
        { question: '月供包括什么？', answer: '我们的计算器显示本金和利息（P&I）。实际还款可能包括房产税、保险和 PMI，具体取决于您的贷款。' },
        { question: '额外还款如何影响房贷？', answer: '输入额外的月供或一次性还款，可以看到您节省了多少利息以及缩短了多少年的贷款期限。' },
      ],
    },
  },

  // Compound Interest Calculator
  {
    slug: 'compound-interest-calculator',
    faqs: {
      en: [
        { question: 'How does compound interest work?', answer: 'Compound interest earns interest on both principal and accumulated interest. Enter principal, rate, time, and compounding frequency to see growth.' },
        { question: 'What compounding frequency should I use?', answer: 'Banks typically compound daily or monthly. More frequent compounding yields slightly higher returns. Annual is simplest for comparison.' },
        { question: 'Can I include regular contributions?', answer: 'Yes, add monthly or annual contributions to see how regular investing accelerates wealth building through compound growth.' },
      ],
      zh: [
        { question: '复利是如何运作的？', answer: '复利是在本金和累积利息上都赚取利息。输入本金、利率、时间和复利频率可以看到增长情况。' },
        { question: '应该使用什么复利频率？', answer: '银行通常按日或按月复利。更频繁的复利产生略高的回报。年复利最简单，便于比较。' },
        { question: '可以包括定期投入吗？', answer: '是的，添加每月或每年的投入可以看到定期投资如何通过复利增长加速财富积累。' },
      ],
    },
  },

  // GPA Calculator
  {
    slug: 'gpa-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate my GPA?', answer: 'Enter each course\'s grade and credit hours. The tool calculates weighted GPA using the standard 4.0 scale (A=4, B=3, C=2, D=1, F=0).' },
        { question: 'What GPA scale is used?', answer: 'We use the standard US 4.0 scale. Some schools use weighted GPA (5.0 for AP/honors). You can customize the scale in settings.' },
        { question: 'Can I calculate cumulative GPA?', answer: 'Yes, enter your current GPA and credits, then add new courses to see how they affect your cumulative GPA.' },
      ],
      zh: [
        { question: '如何计算我的 GPA？', answer: '输入每门课程的成绩和学分。工具使用标准 4.0 制计算加权 GPA（A=4、B=3、C=2、D=1、F=0）。' },
        { question: '使用什么 GPA 制度？', answer: '我们使用美国标准 4.0 制。有些学校使用加权 GPA（AP/荣誉课程 5.0）。您可以在设置中自定义制度。' },
        { question: '可以计算累积 GPA 吗？', answer: '是的，输入当前 GPA 和学分，然后添加新课程可以看到它们如何影响您的累积 GPA。' },
      ],
    },
  },

  // Scientific Calculator
  {
    slug: 'scientific-calculator',
    faqs: {
      en: [
        { question: 'What functions does the scientific calculator have?', answer: 'Trigonometric (sin, cos, tan), logarithmic (log, ln), exponential, factorial, square root, powers, and constants (π, e). Supports complex expressions.' },
        { question: 'Can I use keyboard input?', answer: 'Yes, type numbers and operators directly. Use ^ for power, * for multiply, / for divide. Press Enter to calculate.' },
        { question: 'Does it support order of operations?', answer: 'Yes, calculations follow PEMDAS/BODMAS rules. Parentheses are evaluated first, then exponents, multiplication/division, and addition/subtraction.' },
      ],
      zh: [
        { question: '科学计算器有什么功能？', answer: '三角函数（sin、cos、tan）、对数（log、ln）、指数、阶乘、平方根、幂运算和常数（π、e）。支持复杂表达式。' },
        { question: '可以使用键盘输入吗？', answer: '是的，直接输入数字和运算符。使用 ^ 表示幂，* 表示乘，/ 表示除。按 Enter 计算。' },
        { question: '支持运算顺序吗？', answer: '是的，计算遵循 PEMDAS/BODMAS 规则。先计算括号，然后是指数、乘除、加减。' },
      ],
    },
  },

  // Date Calculator
  {
    slug: 'date-calculator',
    faqs: {
      en: [
        { question: 'How do I add days to a date?', answer: 'Enter a start date and number of days to add (or subtract with negative numbers). The tool shows the resulting date and day of week.' },
        { question: 'Can I find days between two dates?', answer: 'Yes, enter start and end dates to calculate the exact number of days, weeks, months, and years between them.' },
        { question: 'Does it handle business days?', answer: 'Yes, toggle "Business Days Only" to exclude weekends. You can also exclude specific holidays for accurate work day calculations.' },
      ],
      zh: [
        { question: '如何在日期上加天数？', answer: '输入起始日期和要添加的天数（或用负数减去）。工具显示结果日期和星期几。' },
        { question: '可以计算两个日期之间的天数吗？', answer: '是的，输入起始和结束日期可以计算它们之间的确切天数、周数、月数和年数。' },
        { question: '可以处理工作日吗？', answer: '是的，切换"仅工作日"可以排除周末。您还可以排除特定假日以准确计算工作日。' },
      ],
    },
  },
];
