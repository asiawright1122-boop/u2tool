/**
 * GEO 优化的工具 FAQ 配置 - 第十六批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_16: ToolSpecificFAQ[] = [
  // GIF Maker
  {
    slug: 'gif-maker',
    faqs: {
      en: [
        { question: 'How do I create a GIF from images?', answer: 'Upload multiple images, set frame delay (100ms = 10 fps), arrange order, and generate. Download the animated GIF.' },
        { question: 'How do I convert video to GIF?', answer: 'Upload video file, select start/end times, choose frame rate and size. We extract frames and create the GIF.' },
        { question: 'How do I reduce GIF file size?', answer: 'Reduce dimensions, lower frame rate, reduce colors (256 max), or shorten duration. Each significantly impacts file size.' },
      ],
      zh: [
        { question: '如何从图像创建 GIF？', answer: '上传多张图像，设置帧延迟（100ms = 10 fps），排列顺序，然后生成。下载动画 GIF。' },
        { question: '如何将视频转换为 GIF？', answer: '上传视频文件，选择开始/结束时间，选择帧率和大小。我们提取帧并创建 GIF。' },
        { question: '如何减小 GIF 文件大小？', answer: '减小尺寸、降低帧率、减少颜色（最多 256）或缩短时长。每项都会显著影响文件大小。' },
      ],
    },
  },

  // Screenshot to Code
  {
    slug: 'screenshot-to-code',
    faqs: {
      en: [
        { question: 'How does screenshot to code work?', answer: 'Upload a UI screenshot. AI analyzes the design and generates HTML/CSS or React code that recreates the layout.' },
        { question: 'What frameworks are supported?', answer: 'HTML/CSS, React, Vue, Tailwind CSS. Choose your preferred output format before generating code.' },
        { question: 'How accurate is the generated code?', answer: 'Best for simple layouts. Complex designs may need manual adjustment. Use as starting point, not final code.' },
      ],
      zh: [
        { question: '截图转代码是如何工作的？', answer: '上传 UI 截图。AI 分析设计并生成重现布局的 HTML/CSS 或 React 代码。' },
        { question: '支持哪些框架？', answer: 'HTML/CSS、React、Vue、Tailwind CSS。在生成代码前选择您喜欢的输出格式。' },
        { question: '生成的代码有多准确？', answer: '最适合简单布局。复杂设计可能需要手动调整。用作起点，而非最终代码。' },
      ],
    },
  },

  // Favicon Generator
  {
    slug: 'favicon-generator',
    faqs: {
      en: [
        { question: 'What sizes do I need for favicon?', answer: '16×16, 32×32 (standard), 180×180 (Apple touch), 192×192, 512×512 (PWA). We generate all sizes from one image.' },
        { question: 'What format should favicon be?', answer: 'ICO for legacy support, PNG for modern browsers, SVG for scalability. We provide all formats in a package.' },
        { question: 'How do I add favicon to my website?', answer: 'Add <link rel="icon" href="/favicon.ico"> in HTML head. We provide the complete HTML code for all icon types.' },
      ],
      zh: [
        { question: '我需要什么尺寸的 favicon？', answer: '16×16、32×32（标准）、180×180（Apple touch）、192×192、512×512（PWA）。我们从一张图像生成所有尺寸。' },
        { question: 'favicon 应该是什么格式？', answer: 'ICO 用于旧版支持，PNG 用于现代浏览器，SVG 用于可缩放性。我们在包中提供所有格式。' },
        { question: '如何将 favicon 添加到我的网站？', answer: '在 HTML head 中添加 <link rel="icon" href="/favicon.ico">。我们提供所有图标类型的完整 HTML 代码。' },
      ],
    },
  },

  // Placeholder Image Generator
  {
    slug: 'placeholder-image-generator',
    faqs: {
      en: [
        { question: 'How do I generate placeholder images?', answer: 'Enter dimensions (width×height), choose background color, add optional text. Download or use the generated URL directly.' },
        { question: 'What are placeholder images used for?', answer: 'Mockups, wireframes, development before real images are ready. Shows where images will go with correct dimensions.' },
        { question: 'Can I customize placeholder appearance?', answer: 'Yes, change colors, add text, choose format (PNG/JPG/SVG). Some services offer category-specific images (nature, people, etc.).' },
      ],
      zh: [
        { question: '如何生成占位图像？', answer: '输入尺寸（宽×高），选择背景颜色，添加可选文本。下载或直接使用生成的 URL。' },
        { question: '占位图像用于什么？', answer: '模型、线框图、在真实图像准备好之前的开发。显示图像将放置的位置和正确的尺寸。' },
        { question: '可以自定义占位符外观吗？', answer: '是的，更改颜色、添加文本、选择格式（PNG/JPG/SVG）。某些服务提供特定类别的图像（自然、人物等）。' },
      ],
    },
  },

  // Meme Generator
  {
    slug: 'meme-generator',
    faqs: {
      en: [
        { question: 'How do I create a meme?', answer: 'Choose a template or upload image. Add top and bottom text. Customize font, size, color. Download your meme.' },
        { question: 'What image formats work best?', answer: 'JPG or PNG. Square or 4:3 ratio works best for social media. Keep file size reasonable for sharing.' },
        { question: 'Can I use custom fonts?', answer: 'Yes, choose from available fonts or upload custom fonts. Impact font is the classic meme style.' },
      ],
      zh: [
        { question: '如何创建表情包？', answer: '选择模板或上传图像。添加顶部和底部文本。自定义字体、大小、颜色。下载您的表情包。' },
        { question: '什么图像格式最好？', answer: 'JPG 或 PNG。正方形或 4:3 比例最适合社交媒体。保持合理的文件大小以便分享。' },
        { question: '可以使用自定义字体吗？', answer: '是的，从可用字体中选择或上传自定义字体。Impact 字体是经典的表情包风格。' },
      ],
    },
  },

  // Text to Image
  {
    slug: 'text-to-image',
    faqs: {
      en: [
        { question: 'How does AI text to image work?', answer: 'Describe what you want in text (prompt). AI generates an image matching your description. More detail = better results.' },
        { question: 'How do I write good prompts?', answer: 'Be specific: subject, style, lighting, colors, mood. Example: "sunset over mountains, oil painting style, warm colors, peaceful".' },
        { question: 'What image sizes can I generate?', answer: 'Common sizes: 512×512, 1024×1024, 16:9 for landscapes, 9:16 for portraits. Larger sizes take longer to generate.' },
      ],
      zh: [
        { question: 'AI 文本转图像是如何工作的？', answer: '用文本描述您想要的内容（提示词）。AI 生成与您描述匹配的图像。更多细节 = 更好的结果。' },
        { question: '如何写好提示词？', answer: '要具体：主题、风格、光线、颜色、氛围。例如："山上的日落，油画风格，暖色调，宁静"。' },
        { question: '可以生成什么尺寸的图像？', answer: '常见尺寸：512×512、1024×1024、16:9 用于风景、9:16 用于肖像。更大的尺寸需要更长的生成时间。' },
      ],
    },
  },

  // Background Remover
  {
    slug: 'background-remover',
    faqs: {
      en: [
        { question: 'How does background removal work?', answer: 'AI detects the subject (person, product, etc.) and removes everything else. Works best with clear subject-background contrast.' },
        { question: 'What output format should I use?', answer: 'PNG to preserve transparency. JPG will add white background. Use PNG for overlays and compositing.' },
        { question: 'How do I improve removal accuracy?', answer: 'Use images with clear edges, good lighting, and contrast. Avoid complex backgrounds or subjects that blend in.' },
      ],
      zh: [
        { question: '背景移除是如何工作的？', answer: 'AI 检测主体（人物、产品等）并移除其他所有内容。在主体与背景对比清晰时效果最好。' },
        { question: '应该使用什么输出格式？', answer: 'PNG 以保留透明度。JPG 会添加白色背景。使用 PNG 进行叠加和合成。' },
        { question: '如何提高移除准确性？', answer: '使用边缘清晰、光线良好、对比度高的图像。避免复杂背景或与背景融合的主体。' },
      ],
    },
  },

  // Image Watermark
  {
    slug: 'image-watermark',
    faqs: {
      en: [
        { question: 'How do I add a watermark to images?', answer: 'Upload image, add text or logo watermark. Adjust position, size, opacity, and rotation. Download watermarked image.' },
        { question: 'What opacity should I use?', answer: '20-40% for subtle protection, 50-70% for visible branding. Too high obscures the image, too low is easily removed.' },
        { question: 'Can I batch watermark multiple images?', answer: 'Yes, upload multiple images and apply the same watermark to all. Great for protecting photo collections.' },
      ],
      zh: [
        { question: '如何给图像添加水印？', answer: '上传图像，添加文本或 Logo 水印。调整位置、大小、不透明度和旋转。下载带水印的图像。' },
        { question: '应该使用什么不透明度？', answer: '20-40% 用于微妙保护，50-70% 用于可见品牌。太高会遮挡图像，太低容易被移除。' },
        { question: '可以批量给多张图像添加水印吗？', answer: '是的，上传多张图像并对所有图像应用相同的水印。非常适合保护照片集。' },
      ],
    },
  },

  // PDF to Image
  {
    slug: 'pdf-to-image',
    faqs: {
      en: [
        { question: 'How do I convert PDF to images?', answer: 'Upload PDF, choose output format (PNG/JPG), select pages, set resolution. Each page becomes a separate image.' },
        { question: 'What resolution should I use?', answer: '72 DPI for web, 150 DPI for screen viewing, 300 DPI for printing. Higher DPI = larger files but better quality.' },
        { question: 'Can I convert specific pages only?', answer: 'Yes, select page range (e.g., 1-5, 8, 10-12) or convert all pages. Useful for large documents.' },
      ],
      zh: [
        { question: '如何将 PDF 转换为图像？', answer: '上传 PDF，选择输出格式（PNG/JPG），选择页面，设置分辨率。每页成为单独的图像。' },
        { question: '应该使用什么分辨率？', answer: '72 DPI 用于网页，150 DPI 用于屏幕查看，300 DPI 用于打印。更高的 DPI = 更大的文件但更好的质量。' },
        { question: '可以只转换特定页面吗？', answer: '是的，选择页面范围（例如 1-5、8、10-12）或转换所有页面。适用于大型文档。' },
      ],
    },
  },

  // Image to PDF
  {
    slug: 'image-to-pdf',
    faqs: {
      en: [
        { question: 'How do I convert images to PDF?', answer: 'Upload images, arrange order, choose page size and orientation. All images are combined into a single PDF.' },
        { question: 'What page sizes are available?', answer: 'A4, Letter, Legal, and custom sizes. Choose portrait or landscape orientation. Images are scaled to fit.' },
        { question: 'Can I add multiple images per page?', answer: 'Yes, choose layout: 1, 2, 4, or 6 images per page. Great for photo albums or contact sheets.' },
      ],
      zh: [
        { question: '如何将图像转换为 PDF？', answer: '上传图像，排列顺序，选择页面大小和方向。所有图像合并为单个 PDF。' },
        { question: '有哪些页面尺寸可用？', answer: 'A4、Letter、Legal 和自定义尺寸。选择纵向或横向方向。图像会缩放以适应。' },
        { question: '可以每页添加多张图像吗？', answer: '是的，选择布局：每页 1、2、4 或 6 张图像。非常适合相册或联系表。' },
      ],
    },
  },
];
