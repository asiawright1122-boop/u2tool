/**
 * GEO 优化工具 FAQ - 第 52 批
 * 生活工具和计算器
 */

import type { ToolSpecificFAQ } from './tool-specific-faqs';

export const GEO_TOOL_FAQS_52: ToolSpecificFAQ[] = [
  {
    slug: 'decision-wheel',
    faqs: {
      en: [
        {
          question: 'What is a decision wheel?',
          answer: 'A decision wheel (or spinner wheel) helps you make random choices. Add your options, spin the wheel, and let fate decide. Great for games, choosing restaurants, or breaking decision paralysis.',
        },
        {
          question: 'How do I create a custom spinner wheel?',
          answer: 'Enter your options (one per line or comma-separated). Customize colors for each segment. Click spin and the wheel randomly selects a winner with animation.',
        },
        {
          question: 'Is the selection truly random?',
          answer: 'Yes, the wheel uses cryptographically secure random numbers. Each option has an equal chance of being selected (unless you set custom weights for different probabilities).',
        },
      ],
      zh: [
        {
          question: '什么是决策轮盘？',
          answer: '决策轮盘（或转盘）帮助您做出随机选择。添加选项，转动轮盘，让命运决定。非常适合游戏、选择餐厅或打破决策困难。',
        },
        {
          question: '如何创建自定义转盘？',
          answer: '输入选项（每行一个或逗号分隔）。为每个扇区自定义颜色。点击旋转，轮盘会随机选择一个获胜者并带有动画效果。',
        },
        {
          question: '选择真的是随机的吗？',
          answer: '是的，轮盘使用加密安全的随机数。每个选项被选中的机会相等（除非您为不同概率设置自定义权重）。',
        },
      ],
    },
  },
  {
    slug: 'name-generator',
    faqs: {
      en: [
        {
          question: 'What types of names can I generate?',
          answer: 'Generate random names for people (first, last, full names), businesses, products, usernames, fantasy characters, and more. Choose from different styles and cultural origins.',
        },
        {
          question: 'How do I generate names for a specific purpose?',
          answer: 'Select the name type and customize options like gender, origin/culture, length, and style. Generate multiple names at once and save your favorites.',
        },
        {
          question: 'Can I generate names in different languages?',
          answer: 'Yes, choose from various cultural origins including English, Chinese, Japanese, Spanish, and more. Names follow authentic patterns for each culture.',
        },
      ],
      zh: [
        {
          question: '可以生成哪些类型的名字？',
          answer: '生成人名（名、姓、全名）、企业名、产品名、用户名、奇幻角色名等随机名字。从不同风格和文化来源中选择。',
        },
        {
          question: '如何为特定目的生成名字？',
          answer: '选择名字类型并自定义选项，如性别、来源/文化、长度和风格。一次生成多个名字并保存您喜欢的。',
        },
        {
          question: '可以生成不同语言的名字吗？',
          answer: '是的，从各种文化来源中选择，包括英语、中文、日语、西班牙语等。名字遵循每种文化的真实模式。',
        },
      ],
    },
  },
  {
    slug: 'random-picker',
    faqs: {
      en: [
        {
          question: 'What is a random picker?',
          answer: 'A random picker selects one or more items from a list randomly. Use it for raffles, team selection, random sampling, or any situation where you need unbiased random selection.',
        },
        {
          question: 'How do I pick random items from a list?',
          answer: 'Enter your items (one per line), specify how many to pick, and click Pick. The tool randomly selects the specified number of items. Option to remove picked items for subsequent picks.',
        },
        {
          question: 'Can I pick without replacement?',
          answer: 'Yes, enable "remove after picking" to ensure the same item isn\'t selected twice. This is useful for raffles or when you need unique selections.',
        },
      ],
      zh: [
        {
          question: '什么是随机选择器？',
          answer: '随机选择器从列表中随机选择一个或多个项目。用于抽奖、团队选择、随机抽样或任何需要无偏随机选择的情况。',
        },
        {
          question: '如何从列表中随机选择项目？',
          answer: '输入项目（每行一个），指定要选择的数量，然后点击选择。工具会随机选择指定数量的项目。可选择在后续选择中移除已选项目。',
        },
        {
          question: '可以不重复选择吗？',
          answer: '是的，启用"选择后移除"以确保同一项目不会被选中两次。这对于抽奖或需要唯一选择时很有用。',
        },
      ],
    },
  },
  {
    slug: 'coin-flipper',
    faqs: {
      en: [
        {
          question: 'How do I flip a coin online?',
          answer: 'Click the flip button and watch the animated coin spin. It randomly lands on heads or tails with a 50/50 probability. Great for making quick decisions or settling disputes.',
        },
        {
          question: 'Is the coin flip truly random?',
          answer: 'Yes, the flip uses cryptographically secure random numbers, ensuring a fair 50/50 chance for heads or tails. No patterns or biases in the results.',
        },
        {
          question: 'Can I flip multiple coins at once?',
          answer: 'Yes, set the number of coins to flip simultaneously. View results for each coin and statistics like the number of heads vs tails.',
        },
      ],
      zh: [
        {
          question: '如何在线抛硬币？',
          answer: '点击抛掷按钮，观看动画硬币旋转。它以 50/50 的概率随机落在正面或反面。非常适合快速决策或解决争议。',
        },
        {
          question: '抛硬币真的是随机的吗？',
          answer: '是的，抛掷使用加密安全的随机数，确保正面或反面有公平的 50/50 机会。结果没有模式或偏差。',
        },
        {
          question: '可以一次抛多个硬币吗？',
          answer: '是的，设置要同时抛掷的硬币数量。查看每个硬币的结果和统计数据，如正面与反面的数量。',
        },
      ],
    },
  },
  {
    slug: 'countdown-days-calculator',
    faqs: {
      en: [
        {
          question: 'How do I count days until an event?',
          answer: 'Enter your target date and the calculator shows days, hours, minutes, and seconds remaining. Create countdowns for birthdays, holidays, deadlines, or any important date.',
        },
        {
          question: 'Can I count days from a past date?',
          answer: 'Yes, enter a past date to see how many days have passed since then. Useful for tracking anniversaries, project durations, or time since an event.',
        },
        {
          question: 'Can I share my countdown?',
          answer: 'Yes, generate a shareable link to your countdown. Others can view the live countdown without creating their own. Great for event promotion.',
        },
      ],
      zh: [
        {
          question: '如何计算距离某个事件的天数？',
          answer: '输入目标日期，计算器显示剩余的天、小时、分钟和秒。为生日、节日、截止日期或任何重要日期创建倒计时。',
        },
        {
          question: '可以计算从过去日期开始的天数吗？',
          answer: '是的，输入过去的日期以查看自那时以来过了多少天。用于跟踪周年纪念、项目持续时间或事件以来的时间。',
        },
        {
          question: '可以分享我的倒计时吗？',
          answer: '是的，生成倒计时的可分享链接。其他人可以查看实时倒计时而无需创建自己的。非常适合活动推广。',
        },
      ],
    },
  },
  {
    slug: 'fuel-cost-calculator',
    faqs: {
      en: [
        {
          question: 'How do I calculate fuel cost for a trip?',
          answer: 'Enter the trip distance, your vehicle\'s fuel efficiency (MPG or L/100km), and current fuel price. The calculator shows total fuel needed and cost for the trip.',
        },
        {
          question: 'Can I compare fuel costs between vehicles?',
          answer: 'Yes, enter details for multiple vehicles to compare fuel costs for the same trip. Useful when deciding which car to take or comparing potential vehicle purchases.',
        },
        {
          question: 'How do I calculate cost per mile/kilometer?',
          answer: 'The calculator shows cost per distance unit based on your inputs. This helps you understand the true cost of driving and budget for regular commutes.',
        },
      ],
      zh: [
        {
          question: '如何计算行程的燃油成本？',
          answer: '输入行程距离、车辆的燃油效率（MPG 或 L/100km）和当前燃油价格。计算器显示行程所需的总燃油量和成本。',
        },
        {
          question: '可以比较不同车辆的燃油成本吗？',
          answer: '是的，输入多辆车的详细信息以比较相同行程的燃油成本。在决定开哪辆车或比较潜在购车时很有用。',
        },
        {
          question: '如何计算每英里/公里的成本？',
          answer: '计算器根据您的输入显示每距离单位的成本。这有助于您了解驾驶的真实成本并为日常通勤做预算。',
        },
      ],
    },
  },
  {
    slug: 'electricity-cost-calculator',
    faqs: {
      en: [
        {
          question: 'How do I calculate electricity cost for an appliance?',
          answer: 'Enter the appliance wattage, hours of daily use, and your electricity rate (cost per kWh). The calculator shows daily, monthly, and yearly electricity costs.',
        },
        {
          question: 'How do I find my appliance\'s wattage?',
          answer: 'Check the appliance label or manual for wattage. Common examples: LED bulb (10W), laptop (50W), refrigerator (150W), air conditioner (1000-3000W).',
        },
        {
          question: 'Can I calculate costs for multiple appliances?',
          answer: 'Yes, add multiple appliances to see individual and total electricity costs. Identify which appliances consume the most energy and find savings opportunities.',
        },
      ],
      zh: [
        {
          question: '如何计算电器的电费？',
          answer: '输入电器功率、每日使用小时数和电费费率（每千瓦时成本）。计算器显示每日、每月和每年的电费。',
        },
        {
          question: '如何找到电器的功率？',
          answer: '查看电器标签或手册上的功率。常见示例：LED 灯泡（10W）、笔记本电脑（50W）、冰箱（150W）、空调（1000-3000W）。',
        },
        {
          question: '可以计算多个电器的成本吗？',
          answer: '是的，添加多个电器以查看单个和总电费。识别哪些电器消耗最多能源并找到节省机会。',
        },
      ],
    },
  },
  {
    slug: 'pace-calculator',
    faqs: {
      en: [
        {
          question: 'What is a pace calculator?',
          answer: 'A pace calculator helps runners and cyclists determine their speed. Enter any two of: distance, time, or pace, and it calculates the third. Essential for training and race planning.',
        },
        {
          question: 'How do I calculate my running pace?',
          answer: 'Enter your distance and finish time. The calculator shows your pace (minutes per mile or km). You can also enter a target pace to see your projected finish time.',
        },
        {
          question: 'Can I calculate splits for a race?',
          answer: 'Yes, enter your target finish time and distance. The calculator shows split times for each mile/km, helping you maintain consistent pacing during the race.',
        },
      ],
      zh: [
        {
          question: '什么是配速计算器？',
          answer: '配速计算器帮助跑步者和骑行者确定速度。输入距离、时间或配速中的任意两个，它会计算第三个。对于训练和比赛规划至关重要。',
        },
        {
          question: '如何计算我的跑步配速？',
          answer: '输入距离和完成时间。计算器显示您的配速（每英里或公里的分钟数）。您也可以输入目标配速以查看预计完成时间。',
        },
        {
          question: '可以计算比赛的分段时间吗？',
          answer: '是的，输入目标完成时间和距离。计算器显示每英里/公里的分段时间，帮助您在比赛中保持一致的配速。',
        },
      ],
    },
  },
  {
    slug: 'ring-size-calculator',
    faqs: {
      en: [
        {
          question: 'How do I find my ring size?',
          answer: 'Measure your finger circumference or diameter in mm. Enter the measurement and the calculator converts it to ring sizes in US, UK, EU, and other international standards.',
        },
        {
          question: 'What\'s the best way to measure finger size?',
          answer: 'Wrap a strip of paper around your finger, mark where it overlaps, and measure the length. Or measure an existing ring\'s inner diameter. Measure at the end of the day when fingers are largest.',
        },
        {
          question: 'How do I convert between ring size systems?',
          answer: 'Enter a ring size in any system (US, UK, EU, JP, etc.) and see the equivalent in all other systems. Useful when buying rings from international sellers.',
        },
      ],
      zh: [
        {
          question: '如何找到我的戒指尺寸？',
          answer: '测量手指周长或直径（毫米）。输入测量值，计算器将其转换为美国、英国、欧盟和其他国际标准的戒指尺寸。',
        },
        {
          question: '测量手指尺寸的最佳方法是什么？',
          answer: '用纸条绕手指一圈，标记重叠处，测量长度。或测量现有戒指的内径。在一天结束时测量，此时手指最大。',
        },
        {
          question: '如何在戒指尺寸系统之间转换？',
          answer: '输入任何系统（美国、英国、欧盟、日本等）的戒指尺寸，查看所有其他系统的等效尺寸。从国际卖家购买戒指时很有用。',
        },
      ],
    },
  },
  {
    slug: 'bra-size-calculator',
    faqs: {
      en: [
        {
          question: 'How do I calculate my bra size?',
          answer: 'Measure your band size (under bust) and bust size (fullest part). Enter both measurements and the calculator determines your bra size in US, UK, EU, and other sizing systems.',
        },
        {
          question: 'How do I measure correctly for bra size?',
          answer: 'Use a soft measuring tape. For band size, measure snugly under your bust. For bust, measure at the fullest point while wearing an unpadded bra. Keep the tape parallel to the floor.',
        },
        {
          question: 'Why do bra sizes vary between brands?',
          answer: 'Sizing standards differ between countries and brands. Use our converter to find equivalent sizes across different systems. Always try on bras as fit can vary.',
        },
      ],
      zh: [
        {
          question: '如何计算我的文胸尺寸？',
          answer: '测量下胸围（胸下）和胸围（最丰满处）。输入两个测量值，计算器会确定您在美国、英国、欧盟和其他尺码系统中的文胸尺寸。',
        },
        {
          question: '如何正确测量文胸尺寸？',
          answer: '使用软尺。测量下胸围时，在胸下紧贴测量。测量胸围时，穿着无衬垫文胸在最丰满处测量。保持尺子与地面平行。',
        },
        {
          question: '为什么文胸尺寸在不同品牌之间有差异？',
          answer: '不同国家和品牌的尺码标准不同。使用我们的转换器在不同系统中找到等效尺寸。始终试穿文胸，因为合身度可能有所不同。',
        },
      ],
    },
  },
];
