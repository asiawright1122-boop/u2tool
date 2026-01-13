/**
 * GEO 优化的工具 FAQ 配置 - 第十一批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_11: ToolSpecificFAQ[] = [
  // Temperature Converter
  {
    slug: 'temperature-converter',
    faqs: {
      en: [
        { question: 'How do I convert Celsius to Fahrenheit?', answer: 'Enter the temperature in Celsius and the tool instantly shows Fahrenheit. Formula: °F = (°C × 9/5) + 32. Also converts to Kelvin.' },
        { question: 'What is the difference between Celsius and Fahrenheit?', answer: 'Celsius: water freezes at 0°, boils at 100°. Fahrenheit: water freezes at 32°, boils at 212°. Celsius is metric, Fahrenheit is used in the US.' },
        { question: 'What is Kelvin used for?', answer: 'Kelvin is the SI unit for temperature, used in science. 0K is absolute zero (-273.15°C). There are no negative Kelvin values.' },
      ],
      zh: [
        { question: '如何将摄氏度转换为华氏度？', answer: '输入摄氏温度，工具会立即显示华氏度。公式：°F = (°C × 9/5) + 32。也可转换为开尔文。' },
        { question: '摄氏度和华氏度有什么区别？', answer: '摄氏度：水在 0° 结冰，100° 沸腾。华氏度：水在 32° 结冰，212° 沸腾。摄氏度是公制，华氏度在美国使用。' },
        { question: '开尔文用于什么？', answer: '开尔文是温度的国际单位，用于科学。0K 是绝对零度（-273.15°C）。没有负的开尔文值。' },
      ],
    },
  },

  // Length Converter
  {
    slug: 'length-converter',
    faqs: {
      en: [
        { question: 'How do I convert meters to feet?', answer: 'Enter the value in meters and select feet as the target unit. 1 meter = 3.28084 feet. Supports all common length units.' },
        { question: 'What length units are supported?', answer: 'Metric: mm, cm, m, km. Imperial: inches, feet, yards, miles. Also nautical miles, light years, and more specialized units.' },
        { question: 'How do I convert between metric and imperial?', answer: 'Enter any value and select source/target units. Common conversions: 1 inch = 2.54 cm, 1 mile = 1.609 km, 1 foot = 30.48 cm.' },
      ],
      zh: [
        { question: '如何将米转换为英尺？', answer: '输入米值并选择英尺作为目标单位。1 米 = 3.28084 英尺。支持所有常见长度单位。' },
        { question: '支持哪些长度单位？', answer: '公制：毫米、厘米、米、千米。英制：英寸、英尺、码、英里。还有海里、光年和更多专业单位。' },
        { question: '如何在公制和英制之间转换？', answer: '输入任何值并选择源/目标单位。常见转换：1 英寸 = 2.54 厘米，1 英里 = 1.609 千米，1 英尺 = 30.48 厘米。' },
      ],
    },
  },

  // Weight Converter
  {
    slug: 'weight-converter',
    faqs: {
      en: [
        { question: 'How do I convert kg to pounds?', answer: 'Enter the weight in kilograms and select pounds. 1 kg = 2.20462 pounds. The conversion is instant and precise.' },
        { question: 'What is the difference between mass and weight?', answer: 'Mass (kg) is constant everywhere. Weight depends on gravity. On Earth, they\'re practically the same. Our tool converts mass units.' },
        { question: 'What weight units are available?', answer: 'Metric: mg, g, kg, metric ton. Imperial: ounces, pounds, stones, tons. Also carats for gems and troy ounces for precious metals.' },
      ],
      zh: [
        { question: '如何将千克转换为磅？', answer: '输入千克重量并选择磅。1 千克 = 2.20462 磅。转换即时且精确。' },
        { question: '质量和重量有什么区别？', answer: '质量（千克）在任何地方都是恒定的。重量取决于重力。在地球上，它们实际上是相同的。我们的工具转换质量单位。' },
        { question: '有哪些重量单位可用？', answer: '公制：毫克、克、千克、公吨。英制：盎司、磅、英石、吨。还有宝石用的克拉和贵金属用的金衡盎司。' },
      ],
    },
  },

  // Area Converter
  {
    slug: 'area-converter',
    faqs: {
      en: [
        { question: 'How do I convert square meters to square feet?', answer: 'Enter the area in square meters and select square feet. 1 m² = 10.764 ft². Perfect for real estate and construction.' },
        { question: 'What area units are supported?', answer: 'Metric: mm², cm², m², km², hectares. Imperial: in², ft², yd², acres, square miles. Also ares and other regional units.' },
        { question: 'How big is a hectare?', answer: 'A hectare is 10,000 m² or about 2.47 acres. It\'s roughly the size of a soccer field. Common for measuring land.' },
      ],
      zh: [
        { question: '如何将平方米转换为平方英尺？', answer: '输入平方米面积并选择平方英尺。1 平方米 = 10.764 平方英尺。非常适合房地产和建筑。' },
        { question: '支持哪些面积单位？', answer: '公制：平方毫米、平方厘米、平方米、平方千米、公顷。英制：平方英寸、平方英尺、平方码、英亩、平方英里。还有公亩和其他地区单位。' },
        { question: '一公顷有多大？', answer: '一公顷是 10,000 平方米或约 2.47 英亩。大约是一个足球场的大小。常用于测量土地。' },
      ],
    },
  },

  // Volume Converter
  {
    slug: 'volume-converter',
    faqs: {
      en: [
        { question: 'How do I convert liters to gallons?', answer: 'Enter liters and select gallons. 1 liter = 0.264 US gallons or 0.22 UK gallons. We support both US and UK measurements.' },
        { question: 'What is the difference between US and UK gallons?', answer: 'US gallon = 3.785 liters. UK (Imperial) gallon = 4.546 liters. UK gallon is about 20% larger. Always specify which system.' },
        { question: 'What volume units are available?', answer: 'Metric: mL, L, m³. US: fl oz, cups, pints, quarts, gallons. UK Imperial versions. Also tablespoons, teaspoons for cooking.' },
      ],
      zh: [
        { question: '如何将升转换为加仑？', answer: '输入升并选择加仑。1 升 = 0.264 美制加仑或 0.22 英制加仑。我们支持美制和英制测量。' },
        { question: '美制加仑和英制加仑有什么区别？', answer: '美制加仑 = 3.785 升。英制加仑 = 4.546 升。英制加仑大约大 20%。始终指定使用哪种制度。' },
        { question: '有哪些体积单位可用？', answer: '公制：毫升、升、立方米。美制：液量盎司、杯、品脱、夸脱、加仑。英制版本。还有烹饪用的汤匙、茶匙。' },
      ],
    },
  },

  // Speed Converter
  {
    slug: 'speed-converter',
    faqs: {
      en: [
        { question: 'How do I convert km/h to mph?', answer: 'Enter speed in km/h and select mph. 1 km/h = 0.621 mph. Useful for understanding speed limits when traveling internationally.' },
        { question: 'What speed units are supported?', answer: 'm/s (SI unit), km/h, mph, knots (nautical), feet per second, Mach number (speed of sound), and speed of light.' },
        { question: 'What is a knot?', answer: 'A knot is 1 nautical mile per hour (1.852 km/h or 1.151 mph). Used in aviation and maritime navigation worldwide.' },
      ],
      zh: [
        { question: '如何将千米/小时转换为英里/小时？', answer: '输入千米/小时速度并选择英里/小时。1 千米/小时 = 0.621 英里/小时。在国际旅行时了解速度限制很有用。' },
        { question: '支持哪些速度单位？', answer: '米/秒（国际单位）、千米/小时、英里/小时、节（海里）、英尺/秒、马赫数（音速）和光速。' },
        { question: '什么是节？', answer: '节是每小时 1 海里（1.852 千米/小时或 1.151 英里/小时）。在全球航空和海上导航中使用。' },
      ],
    },
  },

  // Data Storage Converter
  {
    slug: 'data-storage-converter',
    faqs: {
      en: [
        { question: 'How do I convert GB to TB?', answer: 'Enter the value in GB and select TB. 1 TB = 1000 GB (decimal) or 1024 GB (binary/GiB). We show both systems.' },
        { question: 'What is the difference between GB and GiB?', answer: 'GB (gigabyte) = 1000 MB (decimal, used by storage manufacturers). GiB (gibibyte) = 1024 MiB (binary, used by operating systems).' },
        { question: 'Why does my drive show less space than advertised?', answer: 'Manufacturers use decimal (1 GB = 1000 MB), but OS uses binary (1 GiB = 1024 MiB). A "500 GB" drive shows as ~465 GiB in your OS.' },
      ],
      zh: [
        { question: '如何将 GB 转换为 TB？', answer: '输入 GB 值并选择 TB。1 TB = 1000 GB（十进制）或 1024 GB（二进制/GiB）。我们显示两种制度。' },
        { question: 'GB 和 GiB 有什么区别？', answer: 'GB（吉字节）= 1000 MB（十进制，存储制造商使用）。GiB（吉比字节）= 1024 MiB（二进制，操作系统使用）。' },
        { question: '为什么我的硬盘显示的空间比标称的少？', answer: '制造商使用十进制（1 GB = 1000 MB），但操作系统使用二进制（1 GiB = 1024 MiB）。"500 GB"硬盘在操作系统中显示约 465 GiB。' },
      ],
    },
  },

  // Time Zone Converter
  {
    slug: 'timezone-converter',
    faqs: {
      en: [
        { question: 'How do I convert time between time zones?', answer: 'Select source and target time zones, enter the time, and see the converted result. Accounts for daylight saving time automatically.' },
        { question: 'What is UTC?', answer: 'UTC (Coordinated Universal Time) is the global time standard. Time zones are expressed as offsets from UTC (e.g., EST = UTC-5, JST = UTC+9).' },
        { question: 'Does it handle daylight saving time?', answer: 'Yes, DST is automatically applied based on the date. The tool knows when each region switches to/from DST.' },
      ],
      zh: [
        { question: '如何在时区之间转换时间？', answer: '选择源时区和目标时区，输入时间，查看转换结果。自动考虑夏令时。' },
        { question: '什么是 UTC？', answer: 'UTC（协调世界时）是全球时间标准。时区表示为与 UTC 的偏移量（如 EST = UTC-5，JST = UTC+9）。' },
        { question: '会处理夏令时吗？', answer: '是的，根据日期自动应用夏令时。工具知道每个地区何时切换夏令时。' },
      ],
    },
  },

  // Fuel Consumption Converter
  {
    slug: 'fuel-consumption-converter',
    faqs: {
      en: [
        { question: 'How do I convert MPG to L/100km?', answer: 'Enter MPG value and get L/100km. Note: higher MPG = lower L/100km (inverse relationship). 30 MPG ≈ 7.84 L/100km.' },
        { question: 'What is the difference between US and UK MPG?', answer: 'US gallon is smaller than UK gallon, so US MPG numbers are lower for the same efficiency. 30 US MPG = 36 UK MPG.' },
        { question: 'Which fuel economy unit is better?', answer: 'L/100km is more intuitive for comparing fuel costs. MPG is traditional in US/UK. Both measure the same thing differently.' },
      ],
      zh: [
        { question: '如何将 MPG 转换为 L/100km？', answer: '输入 MPG 值获得 L/100km。注意：MPG 越高 = L/100km 越低（反比关系）。30 MPG ≈ 7.84 L/100km。' },
        { question: '美制 MPG 和英制 MPG 有什么区别？', answer: '美制加仑比英制加仑小，所以相同效率下美制 MPG 数字更低。30 美制 MPG = 36 英制 MPG。' },
        { question: '哪种燃油经济性单位更好？', answer: 'L/100km 更直观地比较燃油成本。MPG 是美国/英国的传统单位。两者以不同方式测量同一事物。' },
      ],
    },
  },

  // Pressure Converter
  {
    slug: 'pressure-converter',
    faqs: {
      en: [
        { question: 'How do I convert PSI to bar?', answer: 'Enter PSI value and select bar. 1 bar = 14.504 PSI. Common for tire pressure: 32 PSI ≈ 2.2 bar.' },
        { question: 'What pressure units are used for tires?', answer: 'US uses PSI (pounds per square inch). Europe uses bar or kPa. 1 bar = 100 kPa = 14.5 PSI.' },
        { question: 'What is atmospheric pressure?', answer: '1 atm = 101.325 kPa = 14.696 PSI = 1.01325 bar. This is the standard pressure at sea level.' },
      ],
      zh: [
        { question: '如何将 PSI 转换为 bar？', answer: '输入 PSI 值并选择 bar。1 bar = 14.504 PSI。轮胎气压常见：32 PSI ≈ 2.2 bar。' },
        { question: '轮胎使用什么压力单位？', answer: '美国使用 PSI（磅/平方英寸）。欧洲使用 bar 或 kPa。1 bar = 100 kPa = 14.5 PSI。' },
        { question: '什么是大气压？', answer: '1 atm = 101.325 kPa = 14.696 PSI = 1.01325 bar。这是海平面的标准压力。' },
      ],
    },
  },
];
