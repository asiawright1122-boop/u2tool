/**
 * GEO 优化的工具 FAQ 配置 - 第十二批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_12: ToolSpecificFAQ[] = [
  // Energy Converter
  {
    slug: 'energy-converter',
    faqs: {
      en: [
        { question: 'How do I convert joules to calories?', answer: 'Enter joules and select calories. 1 calorie = 4.184 joules. Note: food calories (kcal) = 1000 calories.' },
        { question: 'What energy units are available?', answer: 'Joules (SI), calories, kilocalories (food), BTU, kWh (electricity), eV (physics), foot-pounds, and more.' },
        { question: 'How do I convert electricity usage?', answer: 'Enter kWh (kilowatt-hours) from your bill. 1 kWh = 3.6 million joules = 860 kcal of heat energy.' },
      ],
      zh: [
        { question: '如何将焦耳转换为卡路里？', answer: '输入焦耳并选择卡路里。1 卡路里 = 4.184 焦耳。注意：食物卡路里（千卡）= 1000 卡路里。' },
        { question: '有哪些能量单位可用？', answer: '焦耳（国际单位）、卡路里、千卡（食物）、BTU、千瓦时（电力）、电子伏特（物理）、英尺磅等。' },
        { question: '如何转换电力使用量？', answer: '输入账单上的千瓦时（kWh）。1 千瓦时 = 360 万焦耳 = 860 千卡热能。' },
      ],
    },
  },

  // Power Converter
  {
    slug: 'power-converter',
    faqs: {
      en: [
        { question: 'How do I convert watts to horsepower?', answer: 'Enter watts and select horsepower. 1 HP = 745.7 watts. A 100W light bulb = 0.134 HP.' },
        { question: 'What is the difference between watts and kilowatts?', answer: '1 kW = 1000 W. Kilowatts are used for larger appliances. Your home might use 1-5 kW at any time.' },
        { question: 'What power units are available?', answer: 'Watts, kilowatts, megawatts, horsepower (mechanical and metric), BTU/hour, calories/second, foot-pounds/second.' },
      ],
      zh: [
        { question: '如何将瓦特转换为马力？', answer: '输入瓦特并选择马力。1 马力 = 745.7 瓦特。100W 灯泡 = 0.134 马力。' },
        { question: '瓦特和千瓦有什么区别？', answer: '1 千瓦 = 1000 瓦特。千瓦用于较大的电器。您的家庭可能随时使用 1-5 千瓦。' },
        { question: '有哪些功率单位可用？', answer: '瓦特、千瓦、兆瓦、马力（机械和公制）、BTU/小时、卡路里/秒、英尺磅/秒。' },
      ],
    },
  },

  // Angle Converter
  {
    slug: 'angle-converter',
    faqs: {
      en: [
        { question: 'How do I convert degrees to radians?', answer: 'Enter degrees and select radians. 180° = π radians. Formula: radians = degrees × (π/180).' },
        { question: 'When should I use radians vs degrees?', answer: 'Degrees for everyday use and navigation. Radians for mathematics, physics, and programming (most trig functions use radians).' },
        { question: 'What angle units are available?', answer: 'Degrees, radians, gradians (400 per circle), arcminutes, arcseconds, turns/revolutions, and milliradians.' },
      ],
      zh: [
        { question: '如何将度转换为弧度？', answer: '输入度并选择弧度。180° = π 弧度。公式：弧度 = 度 × (π/180)。' },
        { question: '什么时候应该使用弧度而不是度？', answer: '度用于日常使用和导航。弧度用于数学、物理和编程（大多数三角函数使用弧度）。' },
        { question: '有哪些角度单位可用？', answer: '度、弧度、百分度（每圈 400）、角分、角秒、圈/转和毫弧度。' },
      ],
    },
  },

  // Frequency Converter
  {
    slug: 'frequency-converter',
    faqs: {
      en: [
        { question: 'How do I convert Hz to kHz?', answer: 'Enter Hz and select kHz. 1 kHz = 1000 Hz. Radio frequencies are often in MHz or GHz.' },
        { question: 'What is frequency used for?', answer: 'Sound pitch (20 Hz - 20 kHz audible), radio waves (kHz to GHz), CPU speed (GHz), and AC power (50/60 Hz).' },
        { question: 'What frequency units are available?', answer: 'Hertz (Hz), kilohertz (kHz), megahertz (MHz), gigahertz (GHz), RPM, and radians per second.' },
      ],
      zh: [
        { question: '如何将 Hz 转换为 kHz？', answer: '输入 Hz 并选择 kHz。1 kHz = 1000 Hz。无线电频率通常以 MHz 或 GHz 为单位。' },
        { question: '频率用于什么？', answer: '声音音高（20 Hz - 20 kHz 可听）、无线电波（kHz 到 GHz）、CPU 速度（GHz）和交流电源（50/60 Hz）。' },
        { question: '有哪些频率单位可用？', answer: '赫兹（Hz）、千赫兹（kHz）、兆赫兹（MHz）、吉赫兹（GHz）、RPM 和弧度/秒。' },
      ],
    },
  },

  // Cooking Converter
  {
    slug: 'cooking-converter',
    faqs: {
      en: [
        { question: 'How do I convert cups to grams?', answer: 'Select the ingredient (flour, sugar, butter, etc.) as density varies. 1 cup flour ≈ 125g, 1 cup sugar ≈ 200g.' },
        { question: 'What is the difference between US and metric cups?', answer: 'US cup = 236.6 mL. Metric cup = 250 mL. Australian cup = 250 mL. Always check which system your recipe uses.' },
        { question: 'How do I convert oven temperatures?', answer: 'Enter °F or °C and convert. Common: 350°F = 175°C, 400°F = 200°C. Gas marks are also supported.' },
      ],
      zh: [
        { question: '如何将杯转换为克？', answer: '选择配料（面粉、糖、黄油等），因为密度不同。1 杯面粉 ≈ 125 克，1 杯糖 ≈ 200 克。' },
        { question: '美制杯和公制杯有什么区别？', answer: '美制杯 = 236.6 毫升。公制杯 = 250 毫升。澳大利亚杯 = 250 毫升。始终检查食谱使用哪种制度。' },
        { question: '如何转换烤箱温度？', answer: '输入华氏度或摄氏度并转换。常见：350°F = 175°C，400°F = 200°C。也支持煤气标记。' },
      ],
    },
  },

  // Shoe Size Converter
  {
    slug: 'shoe-size-converter',
    faqs: {
      en: [
        { question: 'How do I convert US to EU shoe sizes?', answer: 'Enter your US size and get EU equivalent. US Men\'s 10 ≈ EU 43. Sizes vary by brand, so this is approximate.' },
        { question: 'What shoe size systems exist?', answer: 'US (different for men/women), UK, EU (continental), Japan (cm), and China. Each has different numbering.' },
        { question: 'How do I measure my foot size?', answer: 'Stand on paper, trace your foot, measure longest point in cm. This gives your foot length for accurate conversion.' },
      ],
      zh: [
        { question: '如何将美国鞋码转换为欧洲鞋码？', answer: '输入美国尺码获得欧洲等效尺码。美国男士 10 码 ≈ 欧洲 43 码。尺码因品牌而异，所以这是近似值。' },
        { question: '有哪些鞋码系统？', answer: '美国（男女不同）、英国、欧洲（大陆）、日本（厘米）和中国。每种都有不同的编号。' },
        { question: '如何测量我的脚尺寸？', answer: '站在纸上，描出脚的轮廓，测量最长点的厘米数。这给出您的脚长以便准确转换。' },
      ],
    },
  },

  // Clothing Size Converter
  {
    slug: 'clothing-size-converter',
    faqs: {
      en: [
        { question: 'How do I convert US to EU clothing sizes?', answer: 'Select garment type and enter US size. US Women\'s 8 ≈ EU 38. Sizes vary significantly between brands.' },
        { question: 'What clothing size systems exist?', answer: 'US, UK, EU, Japan, China, and international (XS-XL). Each region has different numbering for the same measurements.' },
        { question: 'Why do sizes vary between brands?', answer: 'No universal standard exists. Brands use different fit models and may use "vanity sizing" (labeling larger sizes with smaller numbers).' },
      ],
      zh: [
        { question: '如何将美国服装尺码转换为欧洲尺码？', answer: '选择服装类型并输入美国尺码。美国女士 8 码 ≈ 欧洲 38 码。尺码在品牌之间差异很大。' },
        { question: '有哪些服装尺码系统？', answer: '美国、英国、欧洲、日本、中国和国际（XS-XL）。每个地区对相同测量值有不同的编号。' },
        { question: '为什么尺码在品牌之间不同？', answer: '没有通用标准。品牌使用不同的版型模特，可能使用"虚荣尺码"（用较小的数字标记较大的尺码）。' },
      ],
    },
  },

  // Ring Size Converter
  {
    slug: 'ring-size-converter',
    faqs: {
      en: [
        { question: 'How do I find my ring size?', answer: 'Measure inner diameter of a ring that fits (in mm) or wrap string around finger and measure. Enter the measurement to get sizes.' },
        { question: 'What ring size systems exist?', answer: 'US/Canada (numbers), UK/Australia (letters), EU (circumference in mm), Japan (numbers), and China. We convert between all.' },
        { question: 'Do ring sizes change?', answer: 'Yes, fingers swell in heat and shrink in cold. Measure at room temperature, end of day, when fingers are normal size.' },
      ],
      zh: [
        { question: '如何找到我的戒指尺寸？', answer: '测量合适戒指的内径（毫米）或用绳子绕手指测量。输入测量值获得尺码。' },
        { question: '有哪些戒指尺码系统？', answer: '美国/加拿大（数字）、英国/澳大利亚（字母）、欧洲（周长毫米）、日本（数字）和中国。我们在所有系统之间转换。' },
        { question: '戒指尺寸会变化吗？', answer: '是的，手指在热时膨胀，冷时收缩。在室温下、一天结束时、手指正常大小时测量。' },
      ],
    },
  },

  // Paper Size Converter
  {
    slug: 'paper-size-converter',
    faqs: {
      en: [
        { question: 'What is A4 paper size in inches?', answer: 'A4 is 210 × 297 mm or 8.27 × 11.69 inches. It\'s the international standard, slightly narrower and taller than US Letter.' },
        { question: 'What is the difference between A4 and Letter?', answer: 'A4: 210 × 297 mm. US Letter: 215.9 × 279.4 mm (8.5 × 11 in). Letter is wider and shorter than A4.' },
        { question: 'How does the A-series work?', answer: 'Each size is half the previous: A0 (1 m²) → A1 → A2 → A3 → A4 → A5. Aspect ratio is always 1:√2.' },
      ],
      zh: [
        { question: 'A4 纸尺寸是多少英寸？', answer: 'A4 是 210 × 297 毫米或 8.27 × 11.69 英寸。它是国际标准，比美国 Letter 稍窄稍长。' },
        { question: 'A4 和 Letter 有什么区别？', answer: 'A4：210 × 297 毫米。美国 Letter：215.9 × 279.4 毫米（8.5 × 11 英寸）。Letter 比 A4 更宽更短。' },
        { question: 'A 系列是如何工作的？', answer: '每个尺寸是前一个的一半：A0（1 平方米）→ A1 → A2 → A3 → A4 → A5。宽高比始终是 1:√2。' },
      ],
    },
  },

  // Screen Resolution Calculator
  {
    slug: 'screen-resolution-calculator',
    faqs: {
      en: [
        { question: 'How do I calculate PPI (pixels per inch)?', answer: 'Enter screen width, height (pixels), and diagonal size (inches). PPI = √(width² + height²) / diagonal. Higher PPI = sharper display.' },
        { question: 'What is a good PPI for screens?', answer: 'Phones: 300+ PPI (retina). Monitors: 100-150 PPI typical, 200+ for 4K. Print: 300 PPI standard.' },
        { question: 'What do 1080p, 4K, 8K mean?', answer: '1080p = 1920×1080 (Full HD). 4K = 3840×2160 (4× pixels of 1080p). 8K = 7680×4320 (4× pixels of 4K).' },
      ],
      zh: [
        { question: '如何计算 PPI（每英寸像素）？', answer: '输入屏幕宽度、高度（像素）和对角线尺寸（英寸）。PPI = √(宽度² + 高度²) / 对角线。PPI 越高 = 显示越清晰。' },
        { question: '屏幕的好 PPI 是多少？', answer: '手机：300+ PPI（视网膜）。显示器：100-150 PPI 典型，4K 为 200+。印刷：300 PPI 标准。' },
        { question: '1080p、4K、8K 是什么意思？', answer: '1080p = 1920×1080（全高清）。4K = 3840×2160（1080p 的 4 倍像素）。8K = 7680×4320（4K 的 4 倍像素）。' },
      ],
    },
  },
];
