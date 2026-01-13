/**
 * GEO 优化的工具 FAQ 配置 - 第七批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_7: ToolSpecificFAQ[] = [
  // Encryption Tool
  {
    slug: 'encryption-tool',
    faqs: {
      en: [
        { question: 'How do I encrypt text online?', answer: 'Enter your text and a password, select an encryption algorithm (AES-256 recommended), and click Encrypt. The encrypted output can only be decrypted with the same password.' },
        { question: 'What encryption algorithm should I use?', answer: 'AES-256 is the industry standard, used by governments and banks. It\'s secure, fast, and widely supported. Use it unless you have specific requirements.' },
        { question: 'Is online encryption safe?', answer: 'Yes, with our tool. All encryption happens in your browser using JavaScript. Your data and password never leave your device or get sent to any server.' },
      ],
      zh: [
        { question: '如何在线加密文本？', answer: '输入文本和密码，选择加密算法（推荐 AES-256），然后点击加密。加密输出只能用相同的密码解密。' },
        { question: '应该使用什么加密算法？', answer: 'AES-256 是行业标准，被政府和银行使用。它安全、快速且广泛支持。除非有特殊要求，否则使用它。' },
        { question: '在线加密安全吗？', answer: '使用我们的工具是安全的。所有加密都在浏览器中使用 JavaScript 进行。您的数据和密码永远不会离开设备或发送到任何服务器。' },
      ],
    },
  },

  // Barcode Generator
  {
    slug: 'barcode-generator',
    faqs: {
      en: [
        { question: 'How do I create a barcode online?', answer: 'Enter your data, select barcode type (Code 128, EAN-13, UPC-A, etc.), and click Generate. Download as PNG or SVG for printing.' },
        { question: 'What barcode type should I use?', answer: 'Code 128 for general use, EAN-13 for retail products (international), UPC-A for US retail, Code 39 for industrial. Choose based on your industry.' },
        { question: 'Can I customize barcode appearance?', answer: 'Yes, adjust width, height, colors, and whether to show the text below. Ensure adequate contrast for reliable scanning.' },
      ],
      zh: [
        { question: '如何在线创建条形码？', answer: '输入数据，选择条形码类型（Code 128、EAN-13、UPC-A 等），然后点击生成。下载 PNG 或 SVG 用于打印。' },
        { question: '应该使用什么条形码类型？', answer: 'Code 128 用于一般用途，EAN-13 用于零售产品（国际），UPC-A 用于美国零售，Code 39 用于工业。根据您的行业选择。' },
        { question: '可以自定义条形码外观吗？', answer: '是的，可以调整宽度、高度、颜色以及是否显示下方文字。确保足够的对比度以便可靠扫描。' },
      ],
    },
  },

  // Text to Speech
  {
    slug: 'text-to-speech',
    faqs: {
      en: [
        { question: 'How do I convert text to speech online?', answer: 'Enter or paste your text, select a voice and language, adjust speed if needed, and click Play. You can also download the audio file.' },
        { question: 'What languages are supported?', answer: 'We support 50+ languages using your browser\'s built-in speech synthesis. Available voices depend on your operating system and browser.' },
        { question: 'Can I download the audio?', answer: 'Yes, click Download to save the speech as an MP3 file. Useful for creating voiceovers, audiobooks, or accessibility content.' },
      ],
      zh: [
        { question: '如何在线将文本转换为语音？', answer: '输入或粘贴文本，选择语音和语言，根据需要调整速度，然后点击播放。您也可以下载音频文件。' },
        { question: '支持哪些语言？', answer: '我们使用浏览器内置的语音合成支持 50 多种语言。可用的语音取决于您的操作系统和浏览器。' },
        { question: '可以下载音频吗？', answer: '是的，点击下载可以将语音保存为 MP3 文件。用于创建配音、有声书或无障碍内容很有用。' },
      ],
    },
  },

  // Emoji Picker
  {
    slug: 'emoji-picker',
    faqs: {
      en: [
        { question: 'How do I find and copy emojis?', answer: 'Browse categories or search by keyword. Click any emoji to copy it to your clipboard. Paste it anywhere - social media, documents, messages.' },
        { question: 'How many emojis are available?', answer: 'We include 3,000+ emojis from the latest Unicode standard, organized into categories: smileys, people, animals, food, activities, travel, objects, symbols.' },
        { question: 'Do emojis work everywhere?', answer: 'Most modern apps and websites support emojis. Appearance may vary slightly between platforms (Apple, Google, Windows) but meaning stays the same.' },
      ],
      zh: [
        { question: '如何查找和复制表情符号？', answer: '浏览分类或按关键词搜索。点击任何表情符号将其复制到剪贴板。粘贴到任何地方 - 社交媒体、文档、消息。' },
        { question: '有多少表情符号可用？', answer: '我们包含来自最新 Unicode 标准的 3000 多个表情符号，分为以下类别：笑脸、人物、动物、食物、活动、旅行、物品、符号。' },
        { question: '表情符号在所有地方都能用吗？', answer: '大多数现代应用和网站都支持表情符号。不同平台（Apple、Google、Windows）的外观可能略有不同，但含义相同。' },
      ],
    },
  },

  // JSON Validator
  {
    slug: 'json-validator',
    faqs: {
      en: [
        { question: 'How do I validate JSON online?', answer: 'Paste your JSON and click Validate. The tool checks syntax and shows "Valid JSON" or highlights the exact error location with a description.' },
        { question: 'What errors does it detect?', answer: 'Missing or extra commas, unquoted keys, single quotes instead of double, trailing commas, invalid escape sequences, and structural errors.' },
        { question: 'Can I validate JSON against a schema?', answer: 'This tool validates JSON syntax. For JSON Schema validation (checking data structure and types), use our JSON Schema Validator tool.' },
      ],
      zh: [
        { question: '如何在线验证 JSON？', answer: '粘贴 JSON 并点击验证。工具检查语法并显示"有效 JSON"或高亮显示确切的错误位置和描述。' },
        { question: '可以检测哪些错误？', answer: '缺少或多余的逗号、未加引号的键、单引号而非双引号、尾随逗号、无效的转义序列和结构错误。' },
        { question: '可以根据 schema 验证 JSON 吗？', answer: '此工具验证 JSON 语法。对于 JSON Schema 验证（检查数据结构和类型），请使用我们的 JSON Schema 验证器工具。' },
      ],
    },
  },

  // CSS Gradient Generator
  {
    slug: 'css-gradient-generator',
    faqs: {
      en: [
        { question: 'How do I create a CSS gradient?', answer: 'Pick colors, choose gradient type (linear or radial), adjust angle/position, and copy the generated CSS code. Preview updates in real-time.' },
        { question: 'What gradient types are available?', answer: 'Linear gradients (straight line), radial gradients (circular), and conic gradients (around a center point). Each has customizable parameters.' },
        { question: 'Can I add multiple color stops?', answer: 'Yes, add unlimited color stops to create complex gradients. Drag to reposition stops and adjust opacity for each color.' },
      ],
      zh: [
        { question: '如何创建 CSS 渐变？', answer: '选择颜色，选择渐变类型（线性或径向），调整角度/位置，然后复制生成的 CSS 代码。预览实时更新。' },
        { question: '有哪些渐变类型可用？', answer: '线性渐变（直线）、径向渐变（圆形）和锥形渐变（围绕中心点）。每种都有可自定义的参数。' },
        { question: '可以添加多个颜色停止点吗？', answer: '是的，可以添加无限个颜色停止点来创建复杂的渐变。拖动重新定位停止点并调整每种颜色的不透明度。' },
      ],
    },
  },

  // Box Shadow Generator
  {
    slug: 'box-shadow-generator',
    faqs: {
      en: [
        { question: 'How do I create a CSS box shadow?', answer: 'Adjust horizontal/vertical offset, blur, spread, and color using sliders. Copy the generated CSS code to use in your stylesheet.' },
        { question: 'Can I add multiple shadows?', answer: 'Yes, layer multiple shadows for complex effects. Each shadow can have different offsets, blur, and colors.' },
        { question: 'What is the inset shadow option?', answer: 'Inset creates an inner shadow (inside the element) instead of outer. Useful for pressed button effects or recessed areas.' },
      ],
      zh: [
        { question: '如何创建 CSS 盒子阴影？', answer: '使用滑块调整水平/垂直偏移、模糊、扩展和颜色。复制生成的 CSS 代码在样式表中使用。' },
        { question: '可以添加多个阴影吗？', answer: '是的，可以叠加多个阴影以获得复杂效果。每个阴影可以有不同的偏移、模糊和颜色。' },
        { question: '什么是内阴影选项？', answer: '内阴影在元素内部创建阴影而不是外部。用于按下按钮效果或凹陷区域很有用。' },
      ],
    },
  },

  // Border Radius Generator
  {
    slug: 'border-radius-generator',
    faqs: {
      en: [
        { question: 'How do I create rounded corners in CSS?', answer: 'Adjust the radius for each corner using sliders or enter values directly. Copy the CSS border-radius property for your stylesheet.' },
        { question: 'Can I set different radius for each corner?', answer: 'Yes, unlock corners to set individual values for top-left, top-right, bottom-right, and bottom-left independently.' },
        { question: 'What units can I use?', answer: 'Pixels (px) for fixed sizes, percentages (%) for responsive designs. 50% creates a circle from a square element.' },
      ],
      zh: [
        { question: '如何在 CSS 中创建圆角？', answer: '使用滑块调整每个角的半径或直接输入值。复制 CSS border-radius 属性用于样式表。' },
        { question: '可以为每个角设置不同的半径吗？', answer: '是的，解锁角可以独立设置左上、右上、右下和左下的值。' },
        { question: '可以使用什么单位？', answer: '像素（px）用于固定大小，百分比（%）用于响应式设计。50% 可以将正方形元素变成圆形。' },
      ],
    },
  },

  // Flexbox Generator
  {
    slug: 'flexbox-generator',
    faqs: {
      en: [
        { question: 'How do I use the Flexbox generator?', answer: 'Set container properties (direction, wrap, justify, align) and see the layout update live. Copy the generated CSS for both container and items.' },
        { question: 'What is the difference between justify and align?', answer: 'Justify-content aligns items along the main axis (horizontal by default). Align-items aligns along the cross axis (vertical by default).' },
        { question: 'Can I customize individual flex items?', answer: 'Yes, set flex-grow, flex-shrink, and flex-basis for each item to control how they share available space.' },
      ],
      zh: [
        { question: '如何使用 Flexbox 生成器？', answer: '设置容器属性（方向、换行、对齐、排列）并实时查看布局更新。复制生成的容器和项目 CSS。' },
        { question: 'justify 和 align 有什么区别？', answer: 'justify-content 沿主轴对齐项目（默认水平）。align-items 沿交叉轴对齐（默认垂直）。' },
        { question: '可以自定义单个 flex 项目吗？', answer: '是的，为每个项目设置 flex-grow、flex-shrink 和 flex-basis 来控制它们如何分配可用空间。' },
      ],
    },
  },

  // Grid Generator
  {
    slug: 'grid-generator',
    faqs: {
      en: [
        { question: 'How do I create a CSS Grid layout?', answer: 'Define rows and columns, set gaps, and place items visually. The tool generates the CSS code for your grid container and items.' },
        { question: 'What is the difference between Grid and Flexbox?', answer: 'Grid is 2D (rows and columns), best for page layouts. Flexbox is 1D (row or column), best for component layouts. Use both together.' },
        { question: 'Can I create responsive grids?', answer: 'Yes, use fr units for flexible columns, minmax() for responsive sizing, and auto-fit/auto-fill for dynamic column counts.' },
      ],
      zh: [
        { question: '如何创建 CSS Grid 布局？', answer: '定义行和列，设置间距，并可视化放置项目。工具为网格容器和项目生成 CSS 代码。' },
        { question: 'Grid 和 Flexbox 有什么区别？', answer: 'Grid 是二维的（行和列），最适合页面布局。Flexbox 是一维的（行或列），最适合组件布局。两者可以一起使用。' },
        { question: '可以创建响应式网格吗？', answer: '是的，使用 fr 单位创建灵活的列，minmax() 用于响应式大小，auto-fit/auto-fill 用于动态列数。' },
      ],
    },
  },
];
