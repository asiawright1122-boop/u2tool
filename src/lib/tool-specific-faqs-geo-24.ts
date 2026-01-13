/**
 * GEO 优化的工具 FAQ 配置 - 第二十四批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_24: ToolSpecificFAQ[] = [
  // Unit Converter
  {
    slug: 'unit-converter',
    faqs: {
      en: [
        { question: 'What units can I convert?', answer: 'Length, weight, volume, temperature, area, speed, time, data, and more. 100+ unit types supported.' },
        { question: 'How do I convert units?', answer: 'Select category, enter value, choose from/to units. Conversion happens instantly as you type.' },
        { question: 'Are conversions accurate?', answer: 'Yes, we use precise conversion factors. Results shown to appropriate decimal places for each unit type.' },
      ],
      zh: [
        { question: '可以转换哪些单位？', answer: '长度、重量、体积、温度、面积、速度、时间、数据等。支持 100 多种单位类型。' },
        { question: '如何转换单位？', answer: '选择类别，输入值，选择源/目标单位。输入时即时转换。' },
        { question: '转换准确吗？', answer: '是的，我们使用精确的转换因子。结果显示到每种单位类型的适当小数位。' },
      ],
    },
  },

  // Length Converter
  {
    slug: 'length-converter',
    faqs: {
      en: [
        { question: 'What length units are supported?', answer: 'Meters, feet, inches, miles, kilometers, yards, centimeters, millimeters, nautical miles, and more.' },
        { question: 'How do I convert feet to meters?', answer: 'Enter feet value, select meters as target. 1 foot = 0.3048 meters. We calculate instantly.' },
        { question: 'What is the difference between mile and nautical mile?', answer: 'Mile = 1.609 km (land). Nautical mile = 1.852 km (sea/air). Based on Earth\'s circumference.' },
      ],
      zh: [
        { question: '支持哪些长度单位？', answer: '米、英尺、英寸、英里、公里、码、厘米、毫米、海里等。' },
        { question: '如何将英尺转换为米？', answer: '输入英尺值，选择米作为目标。1 英尺 = 0.3048 米。我们即时计算。' },
        { question: '英里和海里有什么区别？', answer: '英里 = 1.609 公里（陆地）。海里 = 1.852 公里（海洋/航空）。基于地球周长。' },
      ],
    },
  },

  // Weight Converter
  {
    slug: 'weight-converter',
    faqs: {
      en: [
        { question: 'What weight units are supported?', answer: 'Kilograms, pounds, ounces, grams, tons, stones, milligrams, and more. Metric and imperial.' },
        { question: 'How do I convert kg to lbs?', answer: 'Enter kg value. 1 kg = 2.205 lbs. We show result instantly. Works both directions.' },
        { question: 'What is the difference between mass and weight?', answer: 'Mass is amount of matter (kg). Weight is gravitational force (N). On Earth, we use them interchangeably.' },
      ],
      zh: [
        { question: '支持哪些重量单位？', answer: '千克、磅、盎司、克、吨、英石、毫克等。公制和英制。' },
        { question: '如何将千克转换为磅？', answer: '输入千克值。1 千克 = 2.205 磅。我们即时显示结果。双向转换。' },
        { question: '质量和重量有什么区别？', answer: '质量是物质的量（千克）。重量是重力（牛顿）。在地球上，我们可以互换使用。' },
      ],
    },
  },

  // Temperature Converter
  {
    slug: 'temperature-converter',
    faqs: {
      en: [
        { question: 'What temperature scales are supported?', answer: 'Celsius, Fahrenheit, Kelvin, and Rankine. Convert between any combination.' },
        { question: 'How do I convert Celsius to Fahrenheit?', answer: 'F = (C × 9/5) + 32. Enter Celsius, we calculate Fahrenheit. 0°C = 32°F, 100°C = 212°F.' },
        { question: 'What is absolute zero?', answer: '0 Kelvin = -273.15°C = -459.67°F. Lowest possible temperature. Molecules have minimum energy.' },
      ],
      zh: [
        { question: '支持哪些温度标度？', answer: '摄氏度、华氏度、开尔文和兰氏度。在任何组合之间转换。' },
        { question: '如何将摄氏度转换为华氏度？', answer: 'F = (C × 9/5) + 32。输入摄氏度，我们计算华氏度。0°C = 32°F，100°C = 212°F。' },
        { question: '什么是绝对零度？', answer: '0 开尔文 = -273.15°C = -459.67°F。最低可能温度。分子具有最小能量。' },
      ],
    },
  },

  // Area Converter
  {
    slug: 'area-converter',
    faqs: {
      en: [
        { question: 'What area units are supported?', answer: 'Square meters, feet, acres, hectares, square miles, square kilometers, and more.' },
        { question: 'How big is an acre?', answer: '1 acre = 43,560 sq ft = 4,047 sq m. About 90% of a football field. 640 acres = 1 square mile.' },
        { question: 'How do I convert hectares to acres?', answer: '1 hectare = 2.471 acres = 10,000 sq m. Enter hectares, we calculate acres instantly.' },
      ],
      zh: [
        { question: '支持哪些面积单位？', answer: '平方米、平方英尺、英亩、公顷、平方英里、平方公里等。' },
        { question: '一英亩有多大？', answer: '1 英亩 = 43,560 平方英尺 = 4,047 平方米。大约是足球场的 90%。640 英亩 = 1 平方英里。' },
        { question: '如何将公顷转换为英亩？', answer: '1 公顷 = 2.471 英亩 = 10,000 平方米。输入公顷，我们即时计算英亩。' },
      ],
    },
  },

  // Volume Converter
  {
    slug: 'volume-converter',
    faqs: {
      en: [
        { question: 'What volume units are supported?', answer: 'Liters, gallons, cups, milliliters, fluid ounces, cubic meters, pints, quarts, and more.' },
        { question: 'What is the difference between US and UK gallon?', answer: 'US gallon = 3.785 L. UK gallon = 4.546 L. UK gallon is about 20% larger.' },
        { question: 'How do I convert ml to cups?', answer: '1 US cup = 236.6 ml. Enter ml, we calculate cups. Note: metric cup = 250 ml.' },
      ],
      zh: [
        { question: '支持哪些体积单位？', answer: '升、加仑、杯、毫升、液体盎司、立方米、品脱、夸脱等。' },
        { question: '美制加仑和英制加仑有什么区别？', answer: '美制加仑 = 3.785 升。英制加仑 = 4.546 升。英制加仑大约大 20%。' },
        { question: '如何将毫升转换为杯？', answer: '1 美制杯 = 236.6 毫升。输入毫升，我们计算杯数。注意：公制杯 = 250 毫升。' },
      ],
    },
  },

  // Speed Converter
  {
    slug: 'speed-converter',
    faqs: {
      en: [
        { question: 'What speed units are supported?', answer: 'km/h, mph, m/s, knots, feet/second, Mach number, speed of light fraction.' },
        { question: 'How do I convert mph to km/h?', answer: '1 mph = 1.609 km/h. Enter mph, we calculate km/h. 60 mph ≈ 97 km/h.' },
        { question: 'What is a knot?', answer: '1 knot = 1 nautical mile/hour = 1.852 km/h. Used in aviation and maritime.' },
      ],
      zh: [
        { question: '支持哪些速度单位？', answer: '公里/小时、英里/小时、米/秒、节、英尺/秒、马赫数、光速分数。' },
        { question: '如何将英里/小时转换为公里/小时？', answer: '1 英里/小时 = 1.609 公里/小时。输入英里/小时，我们计算公里/小时。60 英里/小时 ≈ 97 公里/小时。' },
        { question: '什么是节？', answer: '1 节 = 1 海里/小时 = 1.852 公里/小时。用于航空和航海。' },
      ],
    },
  },

  // Data Storage Converter
  {
    slug: 'data-storage-converter',
    faqs: {
      en: [
        { question: 'What data units are supported?', answer: 'Bits, bytes, KB, MB, GB, TB, PB. Both binary (KiB, MiB) and decimal (KB, MB) standards.' },
        { question: 'What is the difference between KB and KiB?', answer: 'KB = 1000 bytes (decimal). KiB = 1024 bytes (binary). Storage uses decimal, RAM uses binary.' },
        { question: 'How many GB in a TB?', answer: '1 TB = 1000 GB (decimal) or 1024 GiB (binary). A 1TB drive shows ~931 GiB in Windows.' },
      ],
      zh: [
        { question: '支持哪些数据单位？', answer: '比特、字节、KB、MB、GB、TB、PB。二进制（KiB、MiB）和十进制（KB、MB）标准。' },
        { question: 'KB 和 KiB 有什么区别？', answer: 'KB = 1000 字节（十进制）。KiB = 1024 字节（二进制）。存储使用十进制，RAM 使用二进制。' },
        { question: '1 TB 有多少 GB？', answer: '1 TB = 1000 GB（十进制）或 1024 GiB（二进制）。1TB 硬盘在 Windows 中显示约 931 GiB。' },
      ],
    },
  },

  // Time Converter
  {
    slug: 'time-converter',
    faqs: {
      en: [
        { question: 'What time units are supported?', answer: 'Seconds, minutes, hours, days, weeks, months, years, milliseconds, microseconds.' },
        { question: 'How many seconds in a day?', answer: '86,400 seconds = 60 × 60 × 24. Enter days, we convert to any time unit.' },
        { question: 'How do you calculate months and years?', answer: 'Average month = 30.44 days. Average year = 365.25 days (accounting for leap years).' },
      ],
      zh: [
        { question: '支持哪些时间单位？', answer: '秒、分钟、小时、天、周、月、年、毫秒、微秒。' },
        { question: '一天有多少秒？', answer: '86,400 秒 = 60 × 60 × 24。输入天数，我们转换为任何时间单位。' },
        { question: '如何计算月和年？', answer: '平均月 = 30.44 天。平均年 = 365.25 天（考虑闰年）。' },
      ],
    },
  },

  // Pressure Converter
  {
    slug: 'pressure-converter',
    faqs: {
      en: [
        { question: 'What pressure units are supported?', answer: 'Pascal, bar, PSI, atm, mmHg, inHg, kPa, MPa. Scientific and everyday units.' },
        { question: 'What is standard atmospheric pressure?', answer: '1 atm = 101,325 Pa = 14.7 PSI = 760 mmHg = 1.013 bar. Sea level pressure.' },
        { question: 'How do I convert PSI to bar?', answer: '1 PSI = 0.0689 bar. Enter PSI, we calculate bar. Common for tire pressure conversion.' },
      ],
      zh: [
        { question: '支持哪些压力单位？', answer: '帕斯卡、巴、PSI、大气压、毫米汞柱、英寸汞柱、千帕、兆帕。科学和日常单位。' },
        { question: '标准大气压是多少？', answer: '1 大气压 = 101,325 帕 = 14.7 PSI = 760 毫米汞柱 = 1.013 巴。海平面压力。' },
        { question: '如何将 PSI 转换为巴？', answer: '1 PSI = 0.0689 巴。输入 PSI，我们计算巴。常用于轮胎压力转换。' },
      ],
    },
  },
];
