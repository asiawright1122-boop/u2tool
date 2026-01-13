/**
 * GEO 优化的工具 FAQ 配置 - 第二十三批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_23: ToolSpecificFAQ[] = [
  // List Randomizer
  {
    slug: 'list-randomizer',
    faqs: {
      en: [
        { question: 'How do I randomize a list?', answer: 'Paste items (one per line). Click Shuffle. Items are randomly reordered using Fisher-Yates algorithm.' },
        { question: 'Is the shuffle truly random?', answer: 'Yes, uses cryptographic randomness. Each permutation has equal probability. No patterns or bias.' },
        { question: 'What are use cases for list randomization?', answer: 'Playlist shuffling, random ordering, fair selection, randomized testing, drawing lots.' },
      ],
      zh: [
        { question: '如何随机排列列表？', answer: '粘贴项目（每行一个）。点击洗牌。项目使用 Fisher-Yates 算法随机重新排序。' },
        { question: '洗牌真的是随机的吗？', answer: '是的，使用加密随机性。每种排列都有相等的概率。没有模式或偏向。' },
        { question: '列表随机化有哪些用例？', answer: '播放列表洗牌、随机排序、公平选择、随机测试、抽签。' },
      ],
    },
  },

  // Countdown to Date
  {
    slug: 'countdown-to-date',
    faqs: {
      en: [
        { question: 'How do I create a countdown?', answer: 'Enter target date and time. We show live countdown: days, hours, minutes, seconds remaining.' },
        { question: 'Can I share my countdown?', answer: 'Yes, generate shareable link. Others see the same countdown. Great for events and launches.' },
        { question: 'What happens when countdown ends?', answer: 'Optional alert/notification. Counter shows time elapsed since target. Customize end message.' },
      ],
      zh: [
        { question: '如何创建倒计时？', answer: '输入目标日期和时间。我们显示实时倒计时：剩余天数、小时、分钟、秒。' },
        { question: '可以分享我的倒计时吗？', answer: '是的，生成可分享的链接。其他人看到相同的倒计时。非常适合活动和发布。' },
        { question: '倒计时结束时会发生什么？', answer: '可选的警报/通知。计数器显示自目标以来经过的时间。自定义结束消息。' },
      ],
    },
  },

  // Event Countdown
  {
    slug: 'event-countdown',
    faqs: {
      en: [
        { question: 'How do I create an event countdown?', answer: 'Enter event name, date, time, and timezone. Get embeddable countdown widget for your website.' },
        { question: 'Can I customize the countdown style?', answer: 'Yes, choose colors, fonts, size, and format. Match your website or event branding.' },
        { question: 'Does it handle timezones?', answer: 'Yes, set event timezone. Visitors see countdown adjusted to their local time automatically.' },
      ],
      zh: [
        { question: '如何创建活动倒计时？', answer: '输入活动名称、日期、时间和时区。获取可嵌入您网站的倒计时小部件。' },
        { question: '可以自定义倒计时样式吗？', answer: '是的，选择颜色、字体、大小和格式。匹配您的网站或活动品牌。' },
        { question: '它处理时区吗？', answer: '是的，设置活动时区。访问者自动看到调整到他们当地时间的倒计时。' },
      ],
    },
  },

  // Birthday Calculator
  {
    slug: 'birthday-calculator',
    faqs: {
      en: [
        { question: 'What can the birthday calculator do?', answer: 'Calculate exact age, days until next birthday, day of week born, zodiac sign, birthstone, and fun facts.' },
        { question: 'How do I find days until birthday?', answer: 'Enter birthdate. We show countdown to next birthday and how many days old you are.' },
        { question: 'What zodiac information is shown?', answer: 'Western zodiac sign, Chinese zodiac animal, birthstone, birth flower, and personality traits.' },
      ],
      zh: [
        { question: '生日计算器可以做什么？', answer: '计算精确年龄、距下次生日的天数、出生星期几、星座、诞生石和有趣的事实。' },
        { question: '如何找到距生日的天数？', answer: '输入出生日期。我们显示到下次生日的倒计时以及您已经多少天了。' },
        { question: '显示哪些星座信息？', answer: '西方星座、中国生肖、诞生石、诞生花和性格特征。' },
      ],
    },
  },

  // Pregnancy Due Date Calculator
  {
    slug: 'pregnancy-calculator',
    faqs: {
      en: [
        { question: 'How is due date calculated?', answer: 'From last menstrual period (LMP): add 280 days (40 weeks). Or from conception date: add 266 days.' },
        { question: 'How accurate is the due date?', answer: 'Only 5% of babies arrive on due date. Normal range is 37-42 weeks. Due date is an estimate.' },
        { question: 'What milestones are shown?', answer: 'Trimester dates, key development stages, recommended checkup times, and week-by-week progress.' },
      ],
      zh: [
        { question: '预产期是如何计算的？', answer: '从末次月经（LMP）：加 280 天（40 周）。或从受孕日期：加 266 天。' },
        { question: '预产期有多准确？', answer: '只有 5% 的婴儿在预产期出生。正常范围是 37-42 周。预产期是估计值。' },
        { question: '显示哪些里程碑？', answer: '孕期日期、关键发育阶段、建议检查时间和每周进展。' },
      ],
    },
  },

  // Love Calculator
  {
    slug: 'love-calculator',
    faqs: {
      en: [
        { question: 'How does the love calculator work?', answer: 'Enter two names. Algorithm generates compatibility percentage. For entertainment only - not scientifically valid!' },
        { question: 'Is the result accurate?', answer: 'No, it\'s just for fun! Results are algorithmically generated from names. Real compatibility is complex.' },
        { question: 'Why do I get different results?', answer: 'Some calculators use random elements. Ours is deterministic - same names always give same result.' },
      ],
      zh: [
        { question: '爱情计算器是如何工作的？', answer: '输入两个名字。算法生成兼容性百分比。仅供娱乐 - 没有科学依据！' },
        { question: '结果准确吗？', answer: '不，这只是为了好玩！结果是从名字算法生成的。真正的兼容性很复杂。' },
        { question: '为什么我得到不同的结果？', answer: '一些计算器使用随机元素。我们的是确定性的 - 相同的名字总是给出相同的结果。' },
      ],
    },
  },

  // GPA Calculator
  {
    slug: 'gpa-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate GPA?', answer: 'Enter courses with grades and credit hours. We calculate weighted average. Standard 4.0 scale or custom.' },
        { question: 'What GPA scale is used?', answer: 'Default 4.0 scale (A=4, B=3, C=2, D=1, F=0). Also supports +/- grades and custom scales.' },
        { question: 'How do I calculate cumulative GPA?', answer: 'Enter all semesters. We combine using credit-weighted average. Shows semester and cumulative GPA.' },
      ],
      zh: [
        { question: '如何计算 GPA？', answer: '输入课程及其成绩和学分。我们计算加权平均值。标准 4.0 制或自定义。' },
        { question: '使用什么 GPA 制度？', answer: '默认 4.0 制（A=4、B=3、C=2、D=1、F=0）。也支持 +/- 成绩和自定义制度。' },
        { question: '如何计算累积 GPA？', answer: '输入所有学期。我们使用学分加权平均值合并。显示学期和累积 GPA。' },
      ],
    },
  },

  // Grade Calculator
  {
    slug: 'grade-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate my grade?', answer: 'Enter assignments with scores and weights. We calculate weighted average and letter grade.' },
        { question: 'What grade do I need on final?', answer: 'Enter current grade, final exam weight, and target grade. We calculate minimum final exam score needed.' },
        { question: 'How do weighted grades work?', answer: 'Each category has a weight (e.g., exams 40%, homework 30%). Final grade is weighted average of categories.' },
      ],
      zh: [
        { question: '如何计算我的成绩？', answer: '输入作业及其分数和权重。我们计算加权平均值和字母等级。' },
        { question: '期末考试我需要多少分？', answer: '输入当前成绩、期末考试权重和目标成绩。我们计算所需的最低期末考试分数。' },
        { question: '加权成绩是如何工作的？', answer: '每个类别都有权重（例如考试 40%、作业 30%）。最终成绩是各类别的加权平均值。' },
      ],
    },
  },

  // Percentage Calculator
  {
    slug: 'percentage-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate percentage?', answer: 'Multiple modes: X% of Y, X is what % of Y, % change from X to Y. Enter values and calculate.' },
        { question: 'How do I calculate percentage increase?', answer: '((New - Old) / Old) × 100. From 50 to 75 = 50% increase. We handle the formula for you.' },
        { question: 'How do I find original value from percentage?', answer: 'If 75 is 150% of X, then X = 75 / 1.5 = 50. Enter known values, we solve for unknown.' },
      ],
      zh: [
        { question: '如何计算百分比？', answer: '多种模式：Y 的 X%、X 是 Y 的百分之几、从 X 到 Y 的百分比变化。输入值并计算。' },
        { question: '如何计算百分比增长？', answer: '((新值 - 旧值) / 旧值) × 100。从 50 到 75 = 50% 增长。我们为您处理公式。' },
        { question: '如何从百分比找到原始值？', answer: '如果 75 是 X 的 150%，则 X = 75 / 1.5 = 50。输入已知值，我们求解未知值。' },
      ],
    },
  },

  // Scientific Calculator
  {
    slug: 'scientific-calculator',
    faqs: {
      en: [
        { question: 'What functions are available?', answer: 'Trig (sin, cos, tan), logarithms (log, ln), powers, roots, factorials, constants (π, e), and more.' },
        { question: 'Can I use keyboard input?', answer: 'Yes, type expressions directly. Use ^ for power, sqrt() for root, pi for π. Press Enter to calculate.' },
        { question: 'Does it support complex calculations?', answer: 'Yes, nested parentheses, order of operations (PEMDAS), and expression history for reference.' },
      ],
      zh: [
        { question: '有哪些函数可用？', answer: '三角函数（sin、cos、tan）、对数（log、ln）、幂、根、阶乘、常数（π、e）等。' },
        { question: '可以使用键盘输入吗？', answer: '是的，直接输入表达式。使用 ^ 表示幂，sqrt() 表示根，pi 表示 π。按 Enter 计算。' },
        { question: '它支持复杂计算吗？', answer: '是的，嵌套括号、运算顺序（PEMDAS）和表达式历史记录供参考。' },
      ],
    },
  },
];
