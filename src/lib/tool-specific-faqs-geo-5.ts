/**
 * GEO 优化的工具 FAQ 配置 - 第五批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_5: ToolSpecificFAQ[] = [
  // HTML Minifier
  {
    slug: 'html-minifier',
    faqs: {
      en: [
        { question: 'How do I minify HTML online?', answer: 'Paste your HTML code and click Minify. The tool removes whitespace, comments, and optional tags to reduce file size while keeping functionality intact.' },
        { question: 'What gets removed during minification?', answer: 'Whitespace between tags, HTML comments, optional closing tags, redundant attributes, and empty attributes are removed. The HTML remains valid and functional.' },
        { question: 'How much can HTML be compressed?', answer: 'Typical reduction is 10-30% depending on original formatting. Pages with lots of whitespace and comments see the biggest improvements.' },
      ],
      zh: [
        { question: '如何在线压缩 HTML？', answer: '粘贴 HTML 代码并点击压缩。工具会移除空白、注释和可选标签以减小文件大小，同时保持功能完整。' },
        { question: '压缩过程中会移除什么？', answer: '标签之间的空白、HTML 注释、可选的闭合标签、冗余属性和空属性会被移除。HTML 保持有效和功能正常。' },
        { question: 'HTML 可以压缩多少？', answer: '根据原始格式，通常可减少 10-30%。有大量空白和注释的页面改进最明显。' },
      ],
    },
  },

  // Favicon Generator
  {
    slug: 'favicon-generator',
    faqs: {
      en: [
        { question: 'How do I create a favicon?', answer: 'Upload an image (PNG, JPG, SVG) and we generate all favicon sizes needed: ICO, PNG (16x16 to 512x512), Apple Touch Icon, and Android icons.' },
        { question: 'What sizes do I need for favicons?', answer: 'Essential sizes: 16x16, 32x32 (browser tabs), 180x180 (Apple), 192x192 and 512x512 (Android/PWA). We generate all of these automatically.' },
        { question: 'What image format is best for favicons?', answer: 'Start with a square PNG or SVG at least 512x512 pixels. SVG works best as it scales perfectly. Avoid photos; simple icons work better at small sizes.' },
      ],
      zh: [
        { question: '如何创建网站图标？', answer: '上传图片（PNG、JPG、SVG），我们会生成所需的所有网站图标尺寸：ICO、PNG（16x16 到 512x512）、Apple Touch Icon 和 Android 图标。' },
        { question: '网站图标需要什么尺寸？', answer: '必要尺寸：16x16、32x32（浏览器标签）、180x180（Apple）、192x192 和 512x512（Android/PWA）。我们自动生成所有这些。' },
        { question: '什么图片格式最适合网站图标？', answer: '从至少 512x512 像素的正方形 PNG 或 SVG 开始。SVG 效果最好，因为它可以完美缩放。避免照片；简单图标在小尺寸下效果更好。' },
      ],
    },
  },

  // PDF Merger
  {
    slug: 'pdf-merger',
    faqs: {
      en: [
        { question: 'How do I merge PDF files online?', answer: 'Upload multiple PDF files, arrange them in your preferred order by dragging, then click Merge. Download the combined PDF instantly.' },
        { question: 'Is there a limit on PDF files?', answer: 'You can merge up to 20 PDFs at once, with a total size limit of 100MB. All processing happens in your browser for privacy.' },
        { question: 'Will merging affect PDF quality?', answer: 'No, we combine PDFs without re-encoding. Original quality, fonts, images, and formatting are fully preserved.' },
      ],
      zh: [
        { question: '如何在线合并 PDF 文件？', answer: '上传多个 PDF 文件，通过拖拽按您喜欢的顺序排列，然后点击合并。立即下载合并后的 PDF。' },
        { question: 'PDF 文件有限制吗？', answer: '您可以一次合并最多 20 个 PDF，总大小限制为 100MB。所有处理都在浏览器中进行以保护隐私。' },
        { question: '合并会影响 PDF 质量吗？', answer: '不会，我们合并 PDF 时不重新编码。原始质量、字体、图片和格式都完全保留。' },
      ],
    },
  },

  // PDF Splitter
  {
    slug: 'pdf-splitter',
    faqs: {
      en: [
        { question: 'How do I split a PDF into pages?', answer: 'Upload your PDF, select which pages to extract (e.g., 1-3, 5, 7-10), and click Split. Download individual pages or selected ranges.' },
        { question: 'Can I extract specific pages?', answer: 'Yes, enter page numbers or ranges like "1,3,5-10" to extract only those pages. You can also split into single-page PDFs.' },
        { question: 'Is the original PDF modified?', answer: 'No, the original file is never modified. We create new PDF files from the selected pages while keeping the source intact.' },
      ],
      zh: [
        { question: '如何将 PDF 拆分为页面？', answer: '上传 PDF，选择要提取的页面（如 1-3、5、7-10），然后点击拆分。下载单独页面或选定范围。' },
        { question: '可以提取特定页面吗？', answer: '是的，输入页码或范围如"1,3,5-10"只提取那些页面。您也可以拆分为单页 PDF。' },
        { question: '原始 PDF 会被修改吗？', answer: '不会，原始文件永远不会被修改。我们从选定页面创建新的 PDF 文件，同时保持源文件完整。' },
      ],
    },
  },

  // Image Resizer
  {
    slug: 'image-resizer',
    faqs: {
      en: [
        { question: 'How do I resize an image online?', answer: 'Upload your image, enter new dimensions or percentage, and click Resize. Download the resized image in your preferred format.' },
        { question: 'Can I maintain aspect ratio?', answer: 'Yes, lock the aspect ratio to prevent distortion. Enter one dimension and the other calculates automatically.' },
        { question: 'What formats are supported?', answer: 'We support JPEG, PNG, WebP, and GIF. You can also convert between formats while resizing.' },
      ],
      zh: [
        { question: '如何在线调整图片大小？', answer: '上传图片，输入新尺寸或百分比，然后点击调整大小。以您喜欢的格式下载调整后的图片。' },
        { question: '可以保持宽高比吗？', answer: '是的，锁定宽高比可以防止变形。输入一个尺寸，另一个会自动计算。' },
        { question: '支持什么格式？', answer: '我们支持 JPEG、PNG、WebP 和 GIF。您也可以在调整大小时转换格式。' },
      ],
    },
  },

  // Image Cropper
  {
    slug: 'image-cropper',
    faqs: {
      en: [
        { question: 'How do I crop an image online?', answer: 'Upload your image, drag to select the crop area, and click Crop. You can also set exact dimensions or use preset aspect ratios.' },
        { question: 'What aspect ratios are available?', answer: 'Presets include 1:1 (square), 4:3, 16:9, 3:2, and custom. Perfect for social media, presentations, or print.' },
        { question: 'Can I crop to exact pixel dimensions?', answer: 'Yes, enter exact width and height in pixels. The crop area will lock to those dimensions.' },
      ],
      zh: [
        { question: '如何在线裁剪图片？', answer: '上传图片，拖动选择裁剪区域，然后点击裁剪。您也可以设置精确尺寸或使用预设宽高比。' },
        { question: '有哪些宽高比可用？', answer: '预设包括 1:1（正方形）、4:3、16:9、3:2 和自定义。非常适合社交媒体、演示文稿或印刷。' },
        { question: '可以裁剪到精确像素尺寸吗？', answer: '是的，输入精确的宽度和高度像素值。裁剪区域将锁定到这些尺寸。' },
      ],
    },
  },

  // Morse Code Translator
  {
    slug: 'morse-code',
    faqs: {
      en: [
        { question: 'How do I convert text to Morse code?', answer: 'Enter your text and click Convert. Each letter becomes dots and dashes. You can also play the audio to hear the Morse code.' },
        { question: 'Can I decode Morse code to text?', answer: 'Yes, enter Morse code using dots (.) and dashes (-) with spaces between letters. The tool converts it back to readable text.' },
        { question: 'What characters are supported?', answer: 'Letters A-Z, numbers 0-9, and common punctuation. Unsupported characters are skipped with a warning.' },
      ],
      zh: [
        { question: '如何将文本转换为摩尔斯电码？', answer: '输入文本并点击转换。每个字母变成点和划。您也可以播放音频来听摩尔斯电码。' },
        { question: '可以将摩尔斯电码解码为文本吗？', answer: '是的，使用点（.）和划（-）输入摩尔斯电码，字母之间用空格分隔。工具会将其转换回可读文本。' },
        { question: '支持哪些字符？', answer: '字母 A-Z、数字 0-9 和常见标点符号。不支持的字符会被跳过并显示警告。' },
      ],
    },
  },

  // Pomodoro Timer
  {
    slug: 'pomodoro-timer',
    faqs: {
      en: [
        { question: 'What is the Pomodoro Technique?', answer: 'A time management method using 25-minute focused work sessions followed by 5-minute breaks. After 4 sessions, take a longer 15-30 minute break.' },
        { question: 'Can I customize the timer durations?', answer: 'Yes, adjust work time (default 25 min), short break (5 min), and long break (15 min) to match your preferences.' },
        { question: 'Does it work in the background?', answer: 'Yes, the timer continues when you switch tabs. You\'ll get a notification and sound alert when each session ends.' },
      ],
      zh: [
        { question: '什么是番茄工作法？', answer: '一种时间管理方法，使用 25 分钟专注工作后休息 5 分钟。4 个周期后，进行 15-30 分钟的长休息。' },
        { question: '可以自定义计时器时长吗？', answer: '是的，可以调整工作时间（默认 25 分钟）、短休息（5 分钟）和长休息（15 分钟）以匹配您的偏好。' },
        { question: '在后台运行吗？', answer: '是的，切换标签页时计时器继续运行。每个周期结束时您会收到通知和声音提醒。' },
      ],
    },
  },

  // Stopwatch
  {
    slug: 'stopwatch',
    faqs: {
      en: [
        { question: 'How do I use the online stopwatch?', answer: 'Click Start to begin timing, Stop to pause, and Reset to clear. The Lap button records split times without stopping the main timer.' },
        { question: 'Can I record lap times?', answer: 'Yes, click Lap while the stopwatch is running to record split times. All laps are listed with individual and cumulative times.' },
        { question: 'Does it work offline?', answer: 'Yes, once loaded the stopwatch works without internet. It continues running even if you switch browser tabs.' },
      ],
      zh: [
        { question: '如何使用在线秒表？', answer: '点击开始计时，停止暂停，重置清零。计圈按钮在不停止主计时器的情况下记录分段时间。' },
        { question: '可以记录分段时间吗？', answer: '是的，在秒表运行时点击计圈可以记录分段时间。所有分段都会列出单独和累计时间。' },
        { question: '离线可以使用吗？', answer: '是的，加载后秒表无需网络即可工作。即使切换浏览器标签页也会继续运行。' },
      ],
    },
  },

  // Countdown Timer
  {
    slug: 'countdown-timer',
    faqs: {
      en: [
        { question: 'How do I set a countdown timer?', answer: 'Enter hours, minutes, and seconds, then click Start. The timer counts down and alerts you when it reaches zero.' },
        { question: 'Can I set multiple timers?', answer: 'Yes, create multiple countdown timers that run simultaneously. Each has its own controls and can be labeled.' },
        { question: 'Will I be notified when time is up?', answer: 'Yes, you\'ll hear an alarm sound and see a visual notification. Works even when the browser tab is in the background.' },
      ],
      zh: [
        { question: '如何设置倒计时？', answer: '输入小时、分钟和秒数，然后点击开始。计时器倒计时并在归零时提醒您。' },
        { question: '可以设置多个计时器吗？', answer: '是的，可以创建多个同时运行的倒计时器。每个都有自己的控制按钮，可以添加标签。' },
        { question: '时间到了会通知我吗？', answer: '是的，您会听到闹钟声并看到视觉通知。即使浏览器标签页在后台也能工作。' },
      ],
    },
  },
];
