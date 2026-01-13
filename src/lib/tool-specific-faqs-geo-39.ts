/**
 * GEO 优化的工具 FAQ 配置 - 第三十九批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_39: ToolSpecificFAQ[] = [
  // Canvas Drawing
  {
    slug: 'canvas-drawing',
    faqs: {
      en: [
        { question: 'How do I draw on the canvas?', answer: 'Select tool (pen, brush, shapes), choose color and size. Click and drag to draw.' },
        { question: 'Can I save my drawing?', answer: 'Yes, export as PNG, JPEG, or SVG. Also save project to continue later.' },
        { question: 'What tools are available?', answer: 'Pen, brush, eraser, shapes (rectangle, circle, line), text, fill bucket, color picker.' },
      ],
      zh: [
        { question: '如何在画布上绘图？', answer: '选择工具（钢笔、画笔、形状），选择颜色和大小。点击并拖动绘制。' },
        { question: '可以保存我的绘图吗？', answer: '是的，导出为 PNG、JPEG 或 SVG。也可以保存项目以便稍后继续。' },
        { question: '有哪些工具可用？', answer: '钢笔、画笔、橡皮擦、形状（矩形、圆形、线条）、文本、填充桶、颜色选择器。' },
      ],
    },
  },

  // CSS Animation Generator
  {
    slug: 'css-animation-generator',
    faqs: {
      en: [
        { question: 'How do I create CSS animations?', answer: 'Define keyframes visually. Set timing, duration, easing. We generate @keyframes and animation CSS.' },
        { question: 'What animation properties can I set?', answer: 'Duration, delay, timing-function, iteration-count, direction, fill-mode. Full control.' },
        { question: 'Can I preview animations?', answer: 'Yes, live preview as you adjust. See exactly how animation will look before copying code.' },
      ],
      zh: [
        { question: '如何创建 CSS 动画？', answer: '可视化定义关键帧。设置时间、持续时间、缓动。我们生成 @keyframes 和动画 CSS。' },
        { question: '可以设置哪些动画属性？', answer: '持续时间、延迟、时间函数、迭代次数、方向、填充模式。完全控制。' },
        { question: '可以预览动画吗？', answer: '是的，调整时实时预览。在复制代码之前准确查看动画效果。' },
      ],
    },
  },

  // Text Case Counter
  {
    slug: 'text-case-counter',
    faqs: {
      en: [
        { question: 'What does this tool count?', answer: 'Uppercase letters, lowercase letters, digits, spaces, special characters. Detailed breakdown.' },
        { question: 'Why count character cases?', answer: 'Password requirements, text analysis, data validation. Know exact composition of text.' },
        { question: 'Can I see character distribution?', answer: 'Yes, shows percentage of each type. Visual chart of character composition.' },
      ],
      zh: [
        { question: '这个工具计算什么？', answer: '大写字母、小写字母、数字、空格、特殊字符。详细分解。' },
        { question: '为什么要计算字符大小写？', answer: '密码要求、文本分析、数据验证。了解文本的确切组成。' },
        { question: '可以看到字符分布吗？', answer: '是的，显示每种类型的百分比。字符组成的可视化图表。' },
      ],
    },
  },

  // Port Reference
  {
    slug: 'port-reference',
    faqs: {
      en: [
        { question: 'What is this tool for?', answer: 'Reference of common network ports. Search by port number or service name. Know what runs on which port.' },
        { question: 'What are well-known ports?', answer: 'Ports 0-1023. HTTP (80), HTTPS (443), SSH (22), FTP (21), SMTP (25). Reserved for common services.' },
        { question: 'How do I find what uses a port?', answer: 'Enter port number. We show service name, protocol, and description. Or search by service name.' },
      ],
      zh: [
        { question: '这个工具是做什么的？', answer: '常见网络端口参考。按端口号或服务名称搜索。了解哪个端口运行什么。' },
        { question: '什么是知名端口？', answer: '端口 0-1023。HTTP（80）、HTTPS（443）、SSH（22）、FTP（21）、SMTP（25）。为常见服务保留。' },
        { question: '如何找到使用某个端口的服务？', answer: '输入端口号。我们显示服务名称、协议和描述。或按服务名称搜索。' },
      ],
    },
  },

  // JSON to TSV
  {
    slug: 'json-to-tsv',
    faqs: {
      en: [
        { question: 'How do I convert JSON to TSV?', answer: 'Paste JSON array of objects. We extract keys as headers, values as tab-separated rows.' },
        { question: 'What is TSV format?', answer: 'Tab-Separated Values. Like CSV but uses tabs. Better for data with commas. Opens in Excel.' },
        { question: 'How are nested objects handled?', answer: 'Flattened with dot notation (user.name) or JSON stringified. Choose your preference.' },
      ],
      zh: [
        { question: '如何将 JSON 转换为 TSV？', answer: '粘贴对象的 JSON 数组。我们提取键作为标题，值作为制表符分隔的行。' },
        { question: 'TSV 格式是什么？', answer: '制表符分隔值。类似 CSV 但使用制表符。更适合包含逗号的数据。在 Excel 中打开。' },
        { question: '嵌套对象如何处理？', answer: '使用点表示法扁平化（user.name）或 JSON 字符串化。选择您的偏好。' },
      ],
    },
  },

  // CSV Viewer
  {
    slug: 'csv-viewer',
    faqs: {
      en: [
        { question: 'How do I view CSV files?', answer: 'Upload or paste CSV. We display in sortable, filterable table. Search across all columns.' },
        { question: 'Can I edit CSV data?', answer: 'Yes, click cells to edit. Add/delete rows and columns. Export modified CSV.' },
        { question: 'What delimiters are supported?', answer: 'Comma, semicolon, tab, pipe. Auto-detect or specify manually.' },
      ],
      zh: [
        { question: '如何查看 CSV 文件？', answer: '上传或粘贴 CSV。我们以可排序、可过滤的表格显示。跨所有列搜索。' },
        { question: '可以编辑 CSV 数据吗？', answer: '是的，点击单元格编辑。添加/删除行和列。导出修改后的 CSV。' },
        { question: '支持哪些分隔符？', answer: '逗号、分号、制表符、管道符。自动检测或手动指定。' },
      ],
    },
  },

  // Nginx Config Generator
  {
    slug: 'nginx-config-generator',
    faqs: {
      en: [
        { question: 'How do I generate Nginx config?', answer: 'Select server type (static, proxy, PHP). Set domain, ports, SSL. We generate complete config.' },
        { question: 'Does it include SSL configuration?', answer: 'Yes, generates SSL config with recommended security settings. Works with Let\'s Encrypt.' },
        { question: 'Can I add custom locations?', answer: 'Yes, add location blocks for different paths. Configure proxy, static files, redirects.' },
      ],
      zh: [
        { question: '如何生成 Nginx 配置？', answer: '选择服务器类型（静态、代理、PHP）。设置域名、端口、SSL。我们生成完整配置。' },
        { question: '它包含 SSL 配置吗？', answer: '是的，生成带有推荐安全设置的 SSL 配置。与 Let\'s Encrypt 配合使用。' },
        { question: '可以添加自定义位置吗？', answer: '是的，为不同路径添加 location 块。配置代理、静态文件、重定向。' },
      ],
    },
  },

  // cURL Converter
  {
    slug: 'curl-converter',
    faqs: {
      en: [
        { question: 'What does this tool convert?', answer: 'Converts cURL commands to code in various languages: JavaScript, Python, PHP, Go, and more.' },
        { question: 'How do I get a cURL command?', answer: 'Browser DevTools > Network tab > Right-click request > Copy as cURL. Paste here.' },
        { question: 'What languages are supported?', answer: 'JavaScript (fetch, axios), Python (requests), PHP, Go, Ruby, Java, C#, and more.' },
      ],
      zh: [
        { question: '这个工具转换什么？', answer: '将 cURL 命令转换为各种语言的代码：JavaScript、Python、PHP、Go 等。' },
        { question: '如何获取 cURL 命令？', answer: '浏览器开发工具 > 网络选项卡 > 右键点击请求 > 复制为 cURL。粘贴到这里。' },
        { question: '支持哪些语言？', answer: 'JavaScript（fetch、axios）、Python（requests）、PHP、Go、Ruby、Java、C# 等。' },
      ],
    },
  },

  // Reading Time Calculator
  {
    slug: 'reading-time-calculator',
    faqs: {
      en: [
        { question: 'How is reading time calculated?', answer: 'Based on word count and average reading speed (200-250 WPM). Adjusts for content complexity.' },
        { question: 'Can I customize reading speed?', answer: 'Yes, set custom WPM. Default 200 for technical, 250 for casual content.' },
        { question: 'Does it account for images?', answer: 'Yes, adds time for images if specified. First image 12 seconds, decreasing for subsequent.' },
      ],
      zh: [
        { question: '阅读时间是如何计算的？', answer: '基于字数和平均阅读速度（200-250 WPM）。根据内容复杂性调整。' },
        { question: '可以自定义阅读速度吗？', answer: '是的，设置自定义 WPM。技术内容默认 200，休闲内容 250。' },
        { question: '它考虑图像吗？', answer: '是的，如果指定则为图像添加时间。第一张图像 12 秒，后续递减。' },
      ],
    },
  },

  // Open Graph Generator
  {
    slug: 'open-graph-generator',
    faqs: {
      en: [
        { question: 'What is Open Graph?', answer: 'Meta tags controlling how URLs appear when shared on social media. Title, description, image.' },
        { question: 'What tags should I include?', answer: 'og:title, og:description, og:image, og:url are essential. og:type, og:site_name recommended.' },
        { question: 'How do I test my Open Graph tags?', answer: 'Use Facebook Sharing Debugger, Twitter Card Validator, or LinkedIn Post Inspector.' },
      ],
      zh: [
        { question: '什么是 Open Graph？', answer: '控制 URL 在社交媒体上分享时显示方式的元标签。标题、描述、图像。' },
        { question: '应该包含哪些标签？', answer: 'og:title、og:description、og:image、og:url 是必需的。og:type、og:site_name 推荐。' },
        { question: '如何测试我的 Open Graph 标签？', answer: '使用 Facebook 分享调试器、Twitter 卡片验证器或 LinkedIn 帖子检查器。' },
      ],
    },
  },
];
