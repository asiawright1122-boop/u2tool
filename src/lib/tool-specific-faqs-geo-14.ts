/**
 * GEO 优化的工具 FAQ 配置 - 第十四批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_14: ToolSpecificFAQ[] = [
  // BMI Calculator
  {
    slug: 'bmi-calculator',
    faqs: {
      en: [
        { question: 'How is BMI calculated?', answer: 'BMI = weight (kg) / height² (m). Or: weight (lb) × 703 / height² (in). A 70kg person at 1.75m = 22.9 BMI.' },
        { question: 'What do BMI categories mean?', answer: 'Underweight: <18.5, Normal: 18.5-24.9, Overweight: 25-29.9, Obese: 30+. BMI is a screening tool, not a diagnosis.' },
        { question: 'Is BMI accurate for everyone?', answer: 'BMI doesn\'t account for muscle mass, age, or body composition. Athletes may have high BMI but low body fat. Consult healthcare providers for full assessment.' },
      ],
      zh: [
        { question: 'BMI 是如何计算的？', answer: 'BMI = 体重（公斤）/ 身高²（米）。70 公斤身高 1.75 米 = BMI 22.9。' },
        { question: 'BMI 分类是什么意思？', answer: '偏瘦：<18.5，正常：18.5-24.9，超重：25-29.9，肥胖：30+。BMI 是筛查工具，不是诊断。' },
        { question: 'BMI 对每个人都准确吗？', answer: 'BMI 不考虑肌肉量、年龄或身体成分。运动员可能 BMI 高但体脂低。请咨询医疗专业人员进行全面评估。' },
      ],
    },
  },

  // Calorie Calculator
  {
    slug: 'calorie-calculator',
    faqs: {
      en: [
        { question: 'How many calories do I need daily?', answer: 'Depends on age, sex, weight, height, and activity level. Average: 2000-2500 for men, 1600-2000 for women. We calculate your specific needs.' },
        { question: 'What is TDEE?', answer: 'Total Daily Energy Expenditure = BMR × activity multiplier. BMR is calories burned at rest. TDEE is total calories burned including activity.' },
        { question: 'How do I calculate calories for weight loss?', answer: 'Create a deficit of 500-1000 calories/day for 1-2 lbs/week loss. Never go below 1200 (women) or 1500 (men) without medical supervision.' },
      ],
      zh: [
        { question: '我每天需要多少卡路里？', answer: '取决于年龄、性别、体重、身高和活动水平。平均：男性 2000-2500，女性 1600-2000。我们计算您的具体需求。' },
        { question: '什么是 TDEE？', answer: '每日总能量消耗 = 基础代谢率 × 活动系数。基础代谢率是静息时燃烧的卡路里。TDEE 是包括活动在内的总卡路里消耗。' },
        { question: '如何计算减肥所需的卡路里？', answer: '每天制造 500-1000 卡路里的缺口，每周减 1-2 磅。没有医疗监督不要低于 1200（女性）或 1500（男性）。' },
      ],
    },
  },

  // Body Fat Calculator
  {
    slug: 'body-fat-calculator',
    faqs: {
      en: [
        { question: 'How is body fat percentage calculated?', answer: 'Using measurements (neck, waist, hips) and height. Navy method formula varies by sex. More accurate than BMI for fitness assessment.' },
        { question: 'What is a healthy body fat percentage?', answer: 'Men: 10-20% (athletes 6-13%). Women: 18-28% (athletes 14-20%). Essential fat: 2-5% men, 10-13% women.' },
        { question: 'How accurate is this calculator?', answer: 'Tape measure method is ±3-4% accurate. For precise measurement, use DEXA scan, hydrostatic weighing, or professional calipers.' },
      ],
      zh: [
        { question: '体脂率是如何计算的？', answer: '使用测量值（颈围、腰围、臀围）和身高。海军公式因性别而异。比 BMI 更准确地评估健身状况。' },
        { question: '健康的体脂率是多少？', answer: '男性：10-20%（运动员 6-13%）。女性：18-28%（运动员 14-20%）。必需脂肪：男性 2-5%，女性 10-13%。' },
        { question: '这个计算器有多准确？', answer: '卷尺测量法准确度 ±3-4%。要精确测量，请使用 DEXA 扫描、水下称重或专业卡尺。' },
      ],
    },
  },

  // Age Calculator
  {
    slug: 'age-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate exact age?', answer: 'Enter birthdate and target date. We calculate years, months, days, and even hours/minutes if needed. Accounts for leap years.' },
        { question: 'How do I calculate age between two dates?', answer: 'Enter start and end dates. Useful for calculating duration of employment, relationships, or time between events.' },
        { question: 'How do I find what day I was born?', answer: 'Enter your birthdate. We show the day of week, zodiac sign, Chinese zodiac, and other fun facts about your birth date.' },
      ],
      zh: [
        { question: '如何计算精确年龄？', answer: '输入出生日期和目标日期。我们计算年、月、日，如果需要还有小时/分钟。考虑闰年。' },
        { question: '如何计算两个日期之间的年龄？', answer: '输入开始和结束日期。适用于计算工作年限、关系持续时间或事件之间的时间。' },
        { question: '如何找出我出生在星期几？', answer: '输入您的出生日期。我们显示星期几、星座、生肖和其他关于您出生日期的有趣事实。' },
      ],
    },
  },

  // Date Calculator
  {
    slug: 'date-calculator',
    faqs: {
      en: [
        { question: 'How do I add days to a date?', answer: 'Enter start date and number of days to add. We calculate the resulting date, accounting for months of different lengths and leap years.' },
        { question: 'How do I calculate days between dates?', answer: 'Enter two dates. We show total days, weeks, months, and years between them. Useful for countdowns or duration calculations.' },
        { question: 'How do I calculate business days?', answer: 'Select "exclude weekends" option. We count only Monday-Friday. Some calculators also exclude holidays.' },
      ],
      zh: [
        { question: '如何在日期上添加天数？', answer: '输入开始日期和要添加的天数。我们计算结果日期，考虑不同月份的天数和闰年。' },
        { question: '如何计算两个日期之间的天数？', answer: '输入两个日期。我们显示它们之间的总天数、周数、月数和年数。适用于倒计时或持续时间计算。' },
        { question: '如何计算工作日？', answer: '选择"排除周末"选项。我们只计算周一至周五。某些计算器还排除节假日。' },
      ],
    },
  },

  // Time Zone Converter
  {
    slug: 'timezone-converter',
    faqs: {
      en: [
        { question: 'How do I convert time zones?', answer: 'Enter time and source timezone, select target timezone. We handle DST automatically. 3 PM EST = 8 PM GMT = 9 PM CET.' },
        { question: 'What is UTC?', answer: 'Coordinated Universal Time is the global time standard. UTC+0 = GMT. EST = UTC-5, PST = UTC-8, JST = UTC+9.' },
        { question: 'How does Daylight Saving Time affect conversion?', answer: 'DST shifts clocks 1 hour. We automatically adjust for DST based on date and location. Not all regions observe DST.' },
      ],
      zh: [
        { question: '如何转换时区？', answer: '输入时间和源时区，选择目标时区。我们自动处理夏令时。东部时间下午 3 点 = 格林威治时间晚上 8 点 = 中欧时间晚上 9 点。' },
        { question: '什么是 UTC？', answer: '协调世界时是全球时间标准。UTC+0 = 格林威治时间。东部时间 = UTC-5，太平洋时间 = UTC-8，日本时间 = UTC+9。' },
        { question: '夏令时如何影响转换？', answer: '夏令时将时钟调快 1 小时。我们根据日期和地点自动调整夏令时。并非所有地区都实行夏令时。' },
      ],
    },
  },

  // Stopwatch
  {
    slug: 'stopwatch',
    faqs: {
      en: [
        { question: 'How do I use the online stopwatch?', answer: 'Click Start to begin timing, Stop to pause, Reset to clear. Lap button records split times without stopping the main timer.' },
        { question: 'Can I record lap times?', answer: 'Yes, click Lap while running to record split times. Each lap shows individual lap time and cumulative total time.' },
        { question: 'Does the stopwatch work in background?', answer: 'Yes, timing continues even if you switch tabs. The timer uses system time, not intervals, for accuracy.' },
      ],
      zh: [
        { question: '如何使用在线秒表？', answer: '点击开始计时，停止暂停，重置清除。计圈按钮在不停止主计时器的情况下记录分段时间。' },
        { question: '可以记录分段时间吗？', answer: '是的，在运行时点击计圈记录分段时间。每圈显示单圈时间和累计总时间。' },
        { question: '秒表在后台工作吗？', answer: '是的，即使切换标签页，计时也会继续。计时器使用系统时间而非间隔，以确保准确性。' },
      ],
    },
  },

  // Countdown Timer
  {
    slug: 'countdown-timer',
    faqs: {
      en: [
        { question: 'How do I set a countdown timer?', answer: 'Enter hours, minutes, seconds and click Start. Timer counts down to zero and alerts you when complete.' },
        { question: 'Can I set multiple timers?', answer: 'Yes, you can create multiple countdown timers running simultaneously. Each timer operates independently.' },
        { question: 'Does the timer work when tab is inactive?', answer: 'Yes, the countdown continues in background. You\'ll receive a notification when time is up, even in another tab.' },
      ],
      zh: [
        { question: '如何设置倒计时器？', answer: '输入小时、分钟、秒并点击开始。计时器倒数到零并在完成时提醒您。' },
        { question: '可以设置多个计时器吗？', answer: '是的，您可以创建多个同时运行的倒计时器。每个计时器独立运行。' },
        { question: '标签页不活动时计时器工作吗？', answer: '是的，倒计时在后台继续。时间到时您会收到通知，即使在另一个标签页中。' },
      ],
    },
  },

  // Pomodoro Timer
  {
    slug: 'pomodoro-timer',
    faqs: {
      en: [
        { question: 'What is the Pomodoro Technique?', answer: '25 minutes focused work, 5 minute break. After 4 pomodoros, take a 15-30 minute break. Improves focus and prevents burnout.' },
        { question: 'Can I customize timer durations?', answer: 'Yes, adjust work time (default 25 min), short break (5 min), and long break (15-30 min) to fit your workflow.' },
        { question: 'How do I track completed pomodoros?', answer: 'The timer counts completed sessions. Many users aim for 8-12 pomodoros per day. We track your daily and weekly totals.' },
      ],
      zh: [
        { question: '什么是番茄工作法？', answer: '25 分钟专注工作，5 分钟休息。4 个番茄后，休息 15-30 分钟。提高专注力并防止倦怠。' },
        { question: '可以自定义计时器时长吗？', answer: '是的，调整工作时间（默认 25 分钟）、短休息（5 分钟）和长休息（15-30 分钟）以适应您的工作流程。' },
        { question: '如何跟踪完成的番茄数？', answer: '计时器计算完成的会话数。许多用户每天目标 8-12 个番茄。我们跟踪您的每日和每周总数。' },
      ],
    },
  },

  // World Clock
  {
    slug: 'world-clock',
    faqs: {
      en: [
        { question: 'How do I add cities to world clock?', answer: 'Search for a city or select from popular locations. Add multiple cities to compare times across different time zones.' },
        { question: 'How do I find the best meeting time?', answer: 'View all time zones simultaneously. Look for overlapping business hours (typically 9 AM - 5 PM) across all locations.' },
        { question: 'Does it show daylight saving time?', answer: 'Yes, times automatically adjust for DST. We show current DST status and upcoming changes for each location.' },
      ],
      zh: [
        { question: '如何向世界时钟添加城市？', answer: '搜索城市或从热门地点中选择。添加多个城市以比较不同时区的时间。' },
        { question: '如何找到最佳会议时间？', answer: '同时查看所有时区。寻找所有地点重叠的工作时间（通常是上午 9 点至下午 5 点）。' },
        { question: '它显示夏令时吗？', answer: '是的，时间会自动调整夏令时。我们显示每个地点的当前夏令时状态和即将到来的变化。' },
      ],
    },
  },
];
