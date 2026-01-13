/**
 * GEO 优化工具 FAQ - 第 55 批
 * 验证工具、图像工具和文本工具
 */

import type { ToolSpecificFAQ } from './tool-specific-faqs';

export const GEO_TOOL_FAQS_55: ToolSpecificFAQ[] = [
  {
    slug: 'credit-card-validator',
    faqs: {
      en: [
        {
          question: 'How does credit card validation work?',
          answer: 'Credit card validation uses the Luhn algorithm to check if a card number is mathematically valid. It also identifies the card type (Visa, Mastercard, etc.) from the number pattern.',
        },
        {
          question: 'Does validation mean the card is active?',
          answer: 'No, validation only checks if the number format is correct. It doesn\'t verify if the card is active, has funds, or belongs to you. Only payment processors can verify actual card status.',
        },
        {
          question: 'What card types can be validated?',
          answer: 'Validate Visa, Mastercard, American Express, Discover, JCB, Diners Club, and more. The tool identifies the card network from the number prefix (BIN/IIN).',
        },
      ],
      zh: [
        {
          question: '信用卡验证如何工作？',
          answer: '信用卡验证使用 Luhn 算法检查卡号是否在数学上有效。它还从号码模式中识别卡类型（Visa、Mastercard 等）。',
        },
        {
          question: '验证是否意味着卡是有效的？',
          answer: '不，验证只检查号码格式是否正确。它不验证卡是否有效、是否有余额或是否属于您。只有支付处理商才能验证实际卡状态。',
        },
        {
          question: '可以验证哪些卡类型？',
          answer: '验证 Visa、Mastercard、American Express、Discover、JCB、Diners Club 等。工具从号码前缀（BIN/IIN）识别卡网络。',
        },
      ],
    },
  },
  {
    slug: 'color-blindness-simulator',
    faqs: {
      en: [
        {
          question: 'What is a color blindness simulator?',
          answer: 'A color blindness simulator shows how images or designs appear to people with different types of color vision deficiency. It helps designers create accessible content for all users.',
        },
        {
          question: 'What types of color blindness can be simulated?',
          answer: 'Simulate protanopia (red-blind), deuteranopia (green-blind), tritanopia (blue-blind), and achromatopsia (total color blindness). Each affects color perception differently.',
        },
        {
          question: 'How do I make my designs color-blind friendly?',
          answer: 'Use the simulator to check your designs. Ensure sufficient contrast, don\'t rely solely on color to convey information, and use patterns or labels alongside colors.',
        },
      ],
      zh: [
        {
          question: '什么是色盲模拟器？',
          answer: '色盲模拟器显示图像或设计对不同类型色觉缺陷人群的外观。它帮助设计师为所有用户创建无障碍内容。',
        },
        {
          question: '可以模拟哪些类型的色盲？',
          answer: '模拟红色盲（protanopia）、绿色盲（deuteranopia）、蓝色盲（tritanopia）和全色盲（achromatopsia）。每种对颜色感知的影响不同。',
        },
        {
          question: '如何使我的设计对色盲友好？',
          answer: '使用模拟器检查您的设计。确保足够的对比度，不要仅依靠颜色传达信息，在颜色旁边使用图案或标签。',
        },
      ],
    },
  },
  {
    slug: 'aspect-ratio-resizer',
    faqs: {
      en: [
        {
          question: 'What is an aspect ratio resizer?',
          answer: 'An aspect ratio resizer changes image dimensions while maintaining or adjusting the aspect ratio. It can crop, pad, or stretch images to fit specific dimensions.',
        },
        {
          question: 'How do I resize an image to a specific aspect ratio?',
          answer: 'Upload your image, select the target aspect ratio (16:9, 4:3, 1:1, etc.), and choose how to handle the resize (crop, fit, or fill). Preview and download the result.',
        },
        {
          question: 'What\'s the difference between crop, fit, and fill?',
          answer: 'Crop removes parts of the image to fit the ratio. Fit scales the image to fit within the ratio (may add padding). Fill stretches the image to fill the ratio (may distort).',
        },
      ],
      zh: [
        {
          question: '什么是宽高比调整器？',
          answer: '宽高比调整器在保持或调整宽高比的同时更改图像尺寸。它可以裁剪、填充或拉伸图像以适应特定尺寸。',
        },
        {
          question: '如何将图像调整为特定宽高比？',
          answer: '上传图像，选择目标宽高比（16:9、4:3、1:1 等），并选择如何处理调整（裁剪、适应或填充）。预览并下载结果。',
        },
        {
          question: '裁剪、适应和填充有什么区别？',
          answer: '裁剪删除图像的部分以适应比例。适应缩放图像以适应比例内（可能添加填充）。填充拉伸图像以填满比例（可能变形）。',
        },
      ],
    },
  },
  {
    slug: 'speech-timer',
    faqs: {
      en: [
        {
          question: 'What is a speech timer?',
          answer: 'A speech timer helps speakers track their presentation time. It shows elapsed time, remaining time, and can alert you at specific intervals or when time is running out.',
        },
        {
          question: 'How do I set up a speech timer?',
          answer: 'Enter your total speech time and optional warning intervals (e.g., 5 minutes remaining). Start the timer when you begin speaking. Visual and audio alerts notify you of time milestones.',
        },
        {
          question: 'Can I use this for Toastmasters or debate timing?',
          answer: 'Yes, the timer supports green/yellow/red light timing used in Toastmasters. Set custom intervals for different speech types and competition formats.',
        },
      ],
      zh: [
        {
          question: '什么是演讲计时器？',
          answer: '演讲计时器帮助演讲者跟踪演示时间。它显示已用时间、剩余时间，并可以在特定间隔或时间即将用完时提醒您。',
        },
        {
          question: '如何设置演讲计时器？',
          answer: '输入总演讲时间和可选的警告间隔（例如剩余 5 分钟）。开始演讲时启动计时器。视觉和音频提醒会通知您时间里程碑。',
        },
        {
          question: '可以用于 Toastmasters 或辩论计时吗？',
          answer: '是的，计时器支持 Toastmasters 中使用的绿/黄/红灯计时。为不同的演讲类型和比赛格式设置自定义间隔。',
        },
      ],
    },
  },
  {
    slug: 'flip-text',
    faqs: {
      en: [
        {
          question: 'What is flip text?',
          answer: 'Flip text turns your text upside down using special Unicode characters. The result can be read when rotated 180 degrees. Fun for social media, usernames, or creative messages.',
        },
        {
          question: 'How do I flip text upside down?',
          answer: 'Type or paste your text and it\'s instantly converted to upside-down characters. Copy the result and paste anywhere - it works on most platforms that support Unicode.',
        },
        {
          question: 'Does flipped text work everywhere?',
          answer: 'Flipped text uses Unicode characters supported by most modern systems. Some characters may not have upside-down equivalents and will remain unchanged.',
        },
      ],
      zh: [
        {
          question: '什么是翻转文本？',
          answer: '翻转文本使用特殊的 Unicode 字符将文本倒置。结果旋转 180 度后可以阅读。适合社交媒体、用户名或创意消息。',
        },
        {
          question: '如何将文本倒置？',
          answer: '输入或粘贴文本，它会立即转换为倒置字符。复制结果并粘贴到任何地方 - 它在大多数支持 Unicode 的平台上都有效。',
        },
        {
          question: '翻转文本在所有地方都有效吗？',
          answer: '翻转文本使用大多数现代系统支持的 Unicode 字符。某些字符可能没有倒置等效项，将保持不变。',
        },
      ],
    },
  },
  {
    slug: 'strikethrough-text',
    faqs: {
      en: [
        {
          question: 'How do I create strikethrough text?',
          answer: 'Enter your text and it\'s converted to strikethrough using Unicode combining characters. Copy and paste the result anywhere - works on social media, messaging apps, and more.',
        },
        {
          question: 'Why use strikethrough text?',
          answer: 'Strikethrough is used to show corrections, indicate completed tasks, add humor or sarcasm, or create visual emphasis. It\'s a common formatting style in digital communication.',
        },
        {
          question: 'Does strikethrough work on all platforms?',
          answer: 'Unicode strikethrough works on most platforms. Some apps have native strikethrough support (like Discord\'s ~~text~~), but our Unicode version works more universally.',
        },
      ],
      zh: [
        {
          question: '如何创建删除线文本？',
          answer: '输入文本，它会使用 Unicode 组合字符转换为删除线。复制并粘贴结果到任何地方 - 适用于社交媒体、消息应用等。',
        },
        {
          question: '为什么使用删除线文本？',
          answer: '删除线用于显示更正、指示已完成的任务、添加幽默或讽刺，或创建视觉强调。它是数字通信中常见的格式样式。',
        },
        {
          question: '删除线在所有平台上都有效吗？',
          answer: 'Unicode 删除线在大多数平台上有效。某些应用有原生删除线支持（如 Discord 的 ~~text~~），但我们的 Unicode 版本更通用。',
        },
      ],
    },
  },
  {
    slug: 'small-text-generator',
    faqs: {
      en: [
        {
          question: 'What is small text?',
          answer: 'Small text uses Unicode subscript and superscript characters to create text that appears smaller than normal. It\'s used for stylistic effects in social media bios and posts.',
        },
        {
          question: 'How do I generate small text?',
          answer: 'Type your text and choose from subscript (ₛₘₐₗₗ), superscript (ˢᵐᵃˡˡ), or small caps (sᴍᴀʟʟ) styles. Copy the result and use it anywhere Unicode is supported.',
        },
        {
          question: 'Why doesn\'t small text work for all characters?',
          answer: 'Unicode only has subscript/superscript versions for certain characters. Letters without equivalents may appear normal-sized or be substituted with similar characters.',
        },
      ],
      zh: [
        {
          question: '什么是小号文本？',
          answer: '小号文本使用 Unicode 下标和上标字符创建看起来比正常更小的文本。它用于社交媒体简介和帖子中的风格效果。',
        },
        {
          question: '如何生成小号文本？',
          answer: '输入文本并从下标（ₛₘₐₗₗ）、上标（ˢᵐᵃˡˡ）或小型大写字母（sᴍᴀʟʟ）样式中选择。复制结果并在任何支持 Unicode 的地方使用。',
        },
        {
          question: '为什么小号文本不适用于所有字符？',
          answer: 'Unicode 只有某些字符的下标/上标版本。没有等效项的字母可能显示为正常大小或被替换为类似字符。',
        },
      ],
    },
  },
  {
    slug: 'binary-to-text',
    faqs: {
      en: [
        {
          question: 'How do I convert binary to text?',
          answer: 'Enter binary code (sequences of 0s and 1s) and the tool converts it to readable text. Each 8-bit sequence represents one ASCII character.',
        },
        {
          question: 'What binary format is supported?',
          answer: 'Enter binary with or without spaces between bytes. The tool auto-detects 7-bit or 8-bit encoding. Standard ASCII and extended ASCII characters are supported.',
        },
        {
          question: 'Can I convert text to binary?',
          answer: 'Yes, the tool works both ways. Enter text to get its binary representation, or enter binary to decode it back to text.',
        },
      ],
      zh: [
        {
          question: '如何将二进制转换为文本？',
          answer: '输入二进制代码（0 和 1 的序列），工具将其转换为可读文本。每个 8 位序列代表一个 ASCII 字符。',
        },
        {
          question: '支持什么二进制格式？',
          answer: '输入带或不带字节间空格的二进制。工具自动检测 7 位或 8 位编码。支持标准 ASCII 和扩展 ASCII 字符。',
        },
        {
          question: '可以将文本转换为二进制吗？',
          answer: '是的，工具双向工作。输入文本获取其二进制表示，或输入二进制将其解码回文本。',
        },
      ],
    },
  },
  {
    slug: 'roman-numeral-converter',
    faqs: {
      en: [
        {
          question: 'How do I convert numbers to Roman numerals?',
          answer: 'Enter any number from 1 to 3999 and get the Roman numeral equivalent. The tool shows the breakdown of how the numeral is constructed (M=1000, D=500, C=100, etc.).',
        },
        {
          question: 'Can I convert Roman numerals to numbers?',
          answer: 'Yes, enter a Roman numeral (like XIV or MCMLXXXIV) and get the decimal number. The tool validates the numeral and shows if it\'s correctly formatted.',
        },
        {
          question: 'What is the largest Roman numeral?',
          answer: 'Standard Roman numerals go up to 3999 (MMMCMXCIX). Larger numbers historically used overlines or other notations, which aren\'t commonly used today.',
        },
      ],
      zh: [
        {
          question: '如何将数字转换为罗马数字？',
          answer: '输入 1 到 3999 之间的任何数字，获取罗马数字等效值。工具显示数字如何构成的分解（M=1000、D=500、C=100 等）。',
        },
        {
          question: '可以将罗马数字转换为数字吗？',
          answer: '是的，输入罗马数字（如 XIV 或 MCMLXXXIV）获取十进制数字。工具验证数字并显示格式是否正确。',
        },
        {
          question: '最大的罗马数字是什么？',
          answer: '标准罗马数字最大到 3999（MMMCMXCIX）。更大的数字历史上使用上划线或其他符号，现在不常用。',
        },
      ],
    },
  },
  {
    slug: 'fraction-calculator',
    faqs: {
      en: [
        {
          question: 'How do I calculate with fractions?',
          answer: 'Enter fractions in the format a/b (like 3/4) and perform addition, subtraction, multiplication, or division. Results are automatically simplified to lowest terms.',
        },
        {
          question: 'Can I convert between fractions and decimals?',
          answer: 'Yes, enter a decimal to convert to a fraction, or enter a fraction to see its decimal equivalent. The tool handles repeating decimals too.',
        },
        {
          question: 'How do I simplify a fraction?',
          answer: 'Enter any fraction and the tool automatically reduces it to lowest terms by finding the greatest common divisor. It shows the simplification steps.',
        },
      ],
      zh: [
        {
          question: '如何用分数计算？',
          answer: '以 a/b 格式输入分数（如 3/4）并执行加法、减法、乘法或除法。结果自动简化为最简形式。',
        },
        {
          question: '可以在分数和小数之间转换吗？',
          answer: '是的，输入小数转换为分数，或输入分数查看其小数等效值。工具也处理循环小数。',
        },
        {
          question: '如何简化分数？',
          answer: '输入任何分数，工具通过找到最大公约数自动将其约简为最简形式。它显示简化步骤。',
        },
      ],
    },
  },
];
