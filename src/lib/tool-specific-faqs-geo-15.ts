/**
 * GEO 优化的工具 FAQ 配置 - 第十五批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_15: ToolSpecificFAQ[] = [
  // Color Picker
  {
    slug: 'color-picker',
    faqs: {
      en: [
        { question: 'How do I pick a color from an image?', answer: 'Upload an image or paste URL. Click anywhere on the image to sample that color. Get HEX, RGB, HSL values instantly.' },
        { question: 'What color formats are supported?', answer: 'HEX (#FF5733), RGB (255, 87, 51), HSL (11°, 100%, 60%), CMYK for print, and color names. Convert between any format.' },
        { question: 'How do I find complementary colors?', answer: 'Enter a color and we show complementary (opposite on color wheel), analogous (adjacent), triadic, and split-complementary schemes.' },
      ],
      zh: [
        { question: '如何从图像中选取颜色？', answer: '上传图像或粘贴 URL。点击图像任意位置采样该颜色。立即获取 HEX、RGB、HSL 值。' },
        { question: '支持哪些颜色格式？', answer: 'HEX (#FF5733)、RGB (255, 87, 51)、HSL (11°, 100%, 60%)、用于印刷的 CMYK 和颜色名称。在任何格式之间转换。' },
        { question: '如何找到互补色？', answer: '输入一种颜色，我们显示互补色（色轮上的对面）、类似色（相邻）、三色和分裂互补配色方案。' },
      ],
    },
  },

  // Gradient Generator
  {
    slug: 'gradient-generator',
    faqs: {
      en: [
        { question: 'How do I create a CSS gradient?', answer: 'Select colors, choose direction (linear/radial), adjust stops. Copy the generated CSS code directly into your stylesheet.' },
        { question: 'What types of gradients can I create?', answer: 'Linear (straight line), radial (circular), conic (around a point). Each supports multiple color stops and transparency.' },
        { question: 'How do I add more colors to gradient?', answer: 'Click on the gradient bar to add color stops. Drag stops to adjust position. Click stop and change color. Delete by dragging off.' },
      ],
      zh: [
        { question: '如何创建 CSS 渐变？', answer: '选择颜色，选择方向（线性/径向），调整色标。将生成的 CSS 代码直接复制到样式表中。' },
        { question: '可以创建哪些类型的渐变？', answer: '线性（直线）、径向（圆形）、锥形（围绕一点）。每种都支持多个色标和透明度。' },
        { question: '如何向渐变添加更多颜色？', answer: '点击渐变条添加色标。拖动色标调整位置。点击色标更改颜色。拖出删除。' },
      ],
    },
  },

  // Color Palette Generator
  {
    slug: 'color-palette-generator',
    faqs: {
      en: [
        { question: 'How do I generate a color palette?', answer: 'Enter a base color or let us generate random palettes. Choose harmony type: complementary, analogous, triadic, or custom.' },
        { question: 'How many colors should a palette have?', answer: 'Typically 3-5 colors: primary, secondary, accent, and neutrals. We generate palettes with proper contrast ratios for accessibility.' },
        { question: 'Can I extract palette from an image?', answer: 'Yes, upload an image and we extract dominant colors. Great for matching designs to photos or brand images.' },
      ],
      zh: [
        { question: '如何生成调色板？', answer: '输入基础颜色或让我们生成随机调色板。选择和谐类型：互补、类似、三色或自定义。' },
        { question: '调色板应该有多少种颜色？', answer: '通常 3-5 种颜色：主色、次色、强调色和中性色。我们生成具有适当对比度的调色板以确保可访问性。' },
        { question: '可以从图像中提取调色板吗？', answer: '是的，上传图像，我们提取主要颜色。非常适合将设计与照片或品牌图像匹配。' },
      ],
    },
  },

  // Image Compressor
  {
    slug: 'image-compressor',
    faqs: {
      en: [
        { question: 'How much can images be compressed?', answer: 'Typically 50-80% size reduction with minimal quality loss. JPEGs compress more than PNGs. We show before/after comparison.' },
        { question: 'What image formats are supported?', answer: 'JPEG, PNG, WebP, GIF. We can also convert between formats. WebP offers best compression for web use.' },
        { question: 'Is image compression lossy or lossless?', answer: 'Both options available. Lossy removes some data for smaller files. Lossless preserves all data. Choose based on your needs.' },
      ],
      zh: [
        { question: '图像可以压缩多少？', answer: '通常可减少 50-80% 的大小，质量损失最小。JPEG 比 PNG 压缩更多。我们显示压缩前后对比。' },
        { question: '支持哪些图像格式？', answer: 'JPEG、PNG、WebP、GIF。我们还可以在格式之间转换。WebP 为网页使用提供最佳压缩。' },
        { question: '图像压缩是有损还是无损？', answer: '两种选项都可用。有损压缩删除一些数据以获得更小的文件。无损保留所有数据。根据需要选择。' },
      ],
    },
  },

  // Image Resizer
  {
    slug: 'image-resizer',
    faqs: {
      en: [
        { question: 'How do I resize an image?', answer: 'Upload image, enter new dimensions or percentage. Lock aspect ratio to prevent distortion. Download resized image.' },
        { question: 'What is aspect ratio lock?', answer: 'When locked, changing width automatically adjusts height (and vice versa) to maintain original proportions. Prevents stretching.' },
        { question: 'What resolution should I use?', answer: 'Web: 72-150 PPI. Print: 300 PPI. Social media has specific sizes: Instagram 1080×1080, Facebook 1200×630, Twitter 1200×675.' },
      ],
      zh: [
        { question: '如何调整图像大小？', answer: '上传图像，输入新尺寸或百分比。锁定宽高比以防止变形。下载调整后的图像。' },
        { question: '什么是宽高比锁定？', answer: '锁定时，更改宽度会自动调整高度（反之亦然）以保持原始比例。防止拉伸。' },
        { question: '应该使用什么分辨率？', answer: '网页：72-150 PPI。印刷：300 PPI。社交媒体有特定尺寸：Instagram 1080×1080，Facebook 1200×630，Twitter 1200×675。' },
      ],
    },
  },

  // Image Cropper
  {
    slug: 'image-cropper',
    faqs: {
      en: [
        { question: 'How do I crop an image?', answer: 'Upload image, drag to select crop area, or choose preset aspect ratio. Adjust selection and click Crop to download.' },
        { question: 'What aspect ratios are available?', answer: 'Free form, 1:1 (square), 4:3, 16:9, 3:2, and custom ratios. Presets for social media platforms also available.' },
        { question: 'Can I crop to exact pixel dimensions?', answer: 'Yes, enter exact width and height in pixels. The crop area will be constrained to those dimensions.' },
      ],
      zh: [
        { question: '如何裁剪图像？', answer: '上传图像，拖动选择裁剪区域，或选择预设宽高比。调整选择并点击裁剪下载。' },
        { question: '有哪些宽高比可用？', answer: '自由形式、1:1（正方形）、4:3、16:9、3:2 和自定义比例。还有社交媒体平台的预设。' },
        { question: '可以裁剪到精确的像素尺寸吗？', answer: '是的，输入精确的宽度和高度（像素）。裁剪区域将被限制在这些尺寸内。' },
      ],
    },
  },

  // Image to Base64
  {
    slug: 'image-to-base64',
    faqs: {
      en: [
        { question: 'Why convert images to Base64?', answer: 'Embed images directly in HTML/CSS without separate files. Useful for small icons, email templates, and reducing HTTP requests.' },
        { question: 'What is a data URL?', answer: 'Format: data:image/png;base64,[encoded data]. Can be used directly in img src or CSS background-image. No external file needed.' },
        { question: 'When should I NOT use Base64 images?', answer: 'Large images (>10KB) - Base64 is ~33% larger than binary. Use for small icons only. Large Base64 strings slow page loading.' },
      ],
      zh: [
        { question: '为什么要将图像转换为 Base64？', answer: '直接在 HTML/CSS 中嵌入图像，无需单独文件。适用于小图标、电子邮件模板和减少 HTTP 请求。' },
        { question: '什么是数据 URL？', answer: '格式：data:image/png;base64,[编码数据]。可直接用于 img src 或 CSS background-image。无需外部文件。' },
        { question: '什么时候不应该使用 Base64 图像？', answer: '大图像（>10KB）- Base64 比二进制大约 33%。仅用于小图标。大的 Base64 字符串会减慢页面加载。' },
      ],
    },
  },

  // SVG to PNG
  {
    slug: 'svg-to-png',
    faqs: {
      en: [
        { question: 'Why convert SVG to PNG?', answer: 'PNG is more widely supported. Some apps don\'t support SVG. PNG is needed for social media uploads and older software.' },
        { question: 'What resolution should I export?', answer: 'Choose 1x for web, 2x for retina displays, 3x for high-DPI. We maintain sharp edges during conversion.' },
        { question: 'Will I lose quality converting SVG to PNG?', answer: 'SVG is vector (scalable), PNG is raster (pixels). Export at high resolution to minimize quality loss. Can\'t convert back without loss.' },
      ],
      zh: [
        { question: '为什么要将 SVG 转换为 PNG？', answer: 'PNG 支持更广泛。某些应用不支持 SVG。社交媒体上传和旧软件需要 PNG。' },
        { question: '应该导出什么分辨率？', answer: '网页选择 1x，视网膜显示屏选择 2x，高 DPI 选择 3x。我们在转换过程中保持锐利边缘。' },
        { question: '将 SVG 转换为 PNG 会损失质量吗？', answer: 'SVG 是矢量（可缩放），PNG 是光栅（像素）。以高分辨率导出以最小化质量损失。无法无损转换回来。' },
      ],
    },
  },

  // PNG to JPG
  {
    slug: 'png-to-jpg',
    faqs: {
      en: [
        { question: 'Why convert PNG to JPG?', answer: 'JPG files are smaller for photos. PNG is better for graphics with transparency. Convert photos to JPG to save space.' },
        { question: 'What happens to transparency?', answer: 'JPG doesn\'t support transparency. Transparent areas become white (or chosen background color). Keep PNG if you need transparency.' },
        { question: 'What quality setting should I use?', answer: '80-90% quality is good balance of size and quality. 100% is nearly lossless but larger. Below 70% shows visible artifacts.' },
      ],
      zh: [
        { question: '为什么要将 PNG 转换为 JPG？', answer: 'JPG 文件对于照片更小。PNG 更适合带透明度的图形。将照片转换为 JPG 以节省空间。' },
        { question: '透明度会怎样？', answer: 'JPG 不支持透明度。透明区域变成白色（或选择的背景色）。如果需要透明度，请保留 PNG。' },
        { question: '应该使用什么质量设置？', answer: '80-90% 质量是大小和质量的良好平衡。100% 几乎无损但更大。低于 70% 会显示可见的伪影。' },
      ],
    },
  },

  // WebP Converter
  {
    slug: 'webp-converter',
    faqs: {
      en: [
        { question: 'What is WebP format?', answer: 'Google\'s modern image format. 25-35% smaller than JPEG/PNG with same quality. Supports transparency and animation.' },
        { question: 'Is WebP supported everywhere?', answer: 'All modern browsers support WebP (Chrome, Firefox, Safari, Edge). For older browsers, provide JPEG/PNG fallback.' },
        { question: 'Should I convert all images to WebP?', answer: 'Yes for web use - smaller files = faster loading. Keep originals as backup. Use picture element for browser fallback.' },
      ],
      zh: [
        { question: '什么是 WebP 格式？', answer: 'Google 的现代图像格式。相同质量下比 JPEG/PNG 小 25-35%。支持透明度和动画。' },
        { question: 'WebP 到处都支持吗？', answer: '所有现代浏览器都支持 WebP（Chrome、Firefox、Safari、Edge）。对于旧浏览器，提供 JPEG/PNG 后备。' },
        { question: '应该将所有图像转换为 WebP 吗？', answer: '是的，用于网页 - 更小的文件 = 更快的加载。保留原件作为备份。使用 picture 元素进行浏览器后备。' },
      ],
    },
  },
];
