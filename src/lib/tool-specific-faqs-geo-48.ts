/**
 * GEO 优化工具 FAQ - 第 48 批
 * 图像处理工具
 */

import type { ToolSpecificFAQ } from './tool-specific-faqs';

export const GEO_TOOL_FAQS_48: ToolSpecificFAQ[] = [
  {
    slug: 'image-splitter',
    faqs: {
      en: [
        {
          question: 'How do I split an image into multiple parts?',
          answer: 'Upload your image and specify the grid size (rows and columns) or the number of pieces. The tool divides the image evenly and lets you download all parts as a ZIP file or individually.',
        },
        {
          question: 'What is image splitting used for?',
          answer: 'Common uses include creating Instagram grid posts, splitting large images for printing, creating puzzle pieces, preparing sprite sheets, or dividing panoramas into sections.',
        },
        {
          question: 'Can I split images into custom sizes?',
          answer: 'Yes, besides grid splitting, you can specify exact pixel dimensions for each piece or use percentage-based divisions. Preview the split before downloading.',
        },
      ],
      zh: [
        {
          question: '如何将图像分割成多个部分？',
          answer: '上传图像并指定网格大小（行和列）或块数。工具会均匀分割图像，让您以 ZIP 文件或单独下载所有部分。',
        },
        {
          question: '图像分割用于什么？',
          answer: '常见用途包括创建 Instagram 网格帖子、分割大图像用于打印、创建拼图块、准备精灵图或将全景图分成多个部分。',
        },
        {
          question: '可以将图像分割成自定义大小吗？',
          answer: '是的，除了网格分割，您还可以为每个块指定精确的像素尺寸或使用基于百分比的分割。下载前预览分割效果。',
        },
      ],
    },
  },
  {
    slug: 'image-rounder',
    faqs: {
      en: [
        {
          question: 'How do I add rounded corners to an image?',
          answer: 'Upload your image and adjust the corner radius slider. Preview the result in real-time and download with transparent corners (PNG) or with a background color of your choice.',
        },
        {
          question: 'Can I make a perfectly circular image?',
          answer: 'Yes, set the corner radius to maximum or use the "Circle" preset. The tool will crop your image to a perfect circle, ideal for profile pictures and avatars.',
        },
        {
          question: 'What output formats support rounded corners?',
          answer: 'PNG format preserves transparency for rounded corners. If you choose JPEG, you\'ll need to select a background color to fill the corners since JPEG doesn\'t support transparency.',
        },
      ],
      zh: [
        {
          question: '如何为图像添加圆角？',
          answer: '上传图像并调整圆角半径滑块。实时预览结果，下载带透明角的图像（PNG）或选择背景颜色。',
        },
        {
          question: '可以制作完美的圆形图像吗？',
          answer: '是的，将圆角半径设置为最大或使用"圆形"预设。工具会将图像裁剪成完美的圆形，非常适合头像和个人资料图片。',
        },
        {
          question: '哪些输出格式支持圆角？',
          answer: 'PNG 格式保留圆角的透明度。如果选择 JPEG，您需要选择背景颜色来填充角落，因为 JPEG 不支持透明度。',
        },
      ],
    },
  },
  {
    slug: 'image-border',
    faqs: {
      en: [
        {
          question: 'How do I add a border to my image?',
          answer: 'Upload your image, choose border style (solid, dashed, double, etc.), set the width and color. You can also add padding between the image and border, and round the corners.',
        },
        {
          question: 'Can I add decorative or patterned borders?',
          answer: 'Yes, choose from solid colors, gradients, patterns, or upload a custom border image. Create frames that look like polaroids, film strips, or artistic borders.',
        },
        {
          question: 'What border styles are available?',
          answer: 'We offer solid, dashed, dotted, double, groove, ridge, inset, and outset styles. You can also create shadow effects and combine multiple border layers.',
        },
      ],
      zh: [
        {
          question: '如何为图像添加边框？',
          answer: '上传图像，选择边框样式（实线、虚线、双线等），设置宽度和颜色。您还可以在图像和边框之间添加内边距，并设置圆角。',
        },
        {
          question: '可以添加装饰性或图案边框吗？',
          answer: '是的，可选择纯色、渐变、图案或上传自定义边框图像。创建看起来像宝丽来、胶片条或艺术边框的相框。',
        },
        {
          question: '有哪些边框样式可用？',
          answer: '我们提供实线、虚线、点线、双线、凹槽、脊线、内嵌和外凸样式。您还可以创建阴影效果并组合多个边框层。',
        },
      ],
    },
  },
  {
    slug: 'image-flip-rotate',
    faqs: {
      en: [
        {
          question: 'How do I flip or rotate an image online?',
          answer: 'Upload your image and use the flip buttons (horizontal/vertical) or rotation controls. Rotate by 90° increments or enter a custom angle. Preview changes before downloading.',
        },
        {
          question: 'Can I rotate an image by a specific angle?',
          answer: 'Yes, enter any angle from 0 to 360 degrees. The tool rotates the image precisely and lets you choose how to handle the resulting canvas (crop, expand, or fill with color).',
        },
        {
          question: 'Will rotating affect image quality?',
          answer: 'Rotating by 90° multiples preserves quality perfectly. Custom angles may cause slight interpolation, but our tool uses high-quality algorithms to minimize any quality loss.',
        },
      ],
      zh: [
        {
          question: '如何在线翻转或旋转图像？',
          answer: '上传图像并使用翻转按钮（水平/垂直）或旋转控件。按 90° 增量旋转或输入自定义角度。下载前预览更改。',
        },
        {
          question: '可以按特定角度旋转图像吗？',
          answer: '是的，输入 0 到 360 度之间的任何角度。工具会精确旋转图像，并让您选择如何处理结果画布（裁剪、扩展或用颜色填充）。',
        },
        {
          question: '旋转会影响图像质量吗？',
          answer: '按 90° 的倍数旋转可完美保持质量。自定义角度可能会导致轻微的插值，但我们的工具使用高质量算法来最小化任何质量损失。',
        },
      ],
    },
  },
  {
    slug: 'image-adjustment',
    faqs: {
      en: [
        {
          question: 'What image adjustments can I make?',
          answer: 'Adjust brightness, contrast, saturation, hue, exposure, highlights, shadows, temperature, and tint. Fine-tune your images with professional-level controls, all in your browser.',
        },
        {
          question: 'How do I fix an underexposed or overexposed photo?',
          answer: 'Use the exposure slider to correct overall brightness. Then fine-tune with highlights (bright areas) and shadows (dark areas) sliders for balanced results without losing detail.',
        },
        {
          question: 'Can I save my adjustment settings as presets?',
          answer: 'Yes, save your favorite adjustment combinations as presets to apply to other images quickly. Great for maintaining consistent style across multiple photos.',
        },
      ],
      zh: [
        {
          question: '可以进行哪些图像调整？',
          answer: '调整亮度、对比度、饱和度、色相、曝光、高光、阴影、色温和色调。使用专业级控件微调图像，全部在浏览器中完成。',
        },
        {
          question: '如何修复曝光不足或过度曝光的照片？',
          answer: '使用曝光滑块校正整体亮度。然后用高光（亮区）和阴影（暗区）滑块微调，获得平衡的结果而不丢失细节。',
        },
        {
          question: '可以将调整设置保存为预设吗？',
          answer: '是的，将您喜欢的调整组合保存为预设，以便快速应用到其他图像。非常适合在多张照片中保持一致的风格。',
        },
      ],
    },
  },
  {
    slug: 'image-frosted-glass',
    faqs: {
      en: [
        {
          question: 'What is a frosted glass effect?',
          answer: 'A frosted glass effect adds a blurred, translucent overlay to images, similar to looking through frosted glass. It\'s popular for backgrounds, privacy overlays, and modern UI designs.',
        },
        {
          question: 'How do I apply frosted glass effect to an image?',
          answer: 'Upload your image and adjust the blur intensity and opacity. You can apply the effect to the entire image or select specific areas. Add tint colors for creative variations.',
        },
        {
          question: 'Can I create a partial frosted glass effect?',
          answer: 'Yes, use the selection tool to apply the effect only to specific areas. This is useful for blurring sensitive information while keeping the rest of the image clear.',
        },
      ],
      zh: [
        {
          question: '什么是毛玻璃效果？',
          answer: '毛玻璃效果为图像添加模糊、半透明的覆盖层，类似于透过毛玻璃观看。它在背景、隐私覆盖和现代 UI 设计中很流行。',
        },
        {
          question: '如何为图像应用毛玻璃效果？',
          answer: '上传图像并调整模糊强度和不透明度。您可以将效果应用于整个图像或选择特定区域。添加色调颜色以获得创意变化。',
        },
        {
          question: '可以创建部分毛玻璃效果吗？',
          answer: '是的，使用选择工具仅将效果应用于特定区域。这对于模糊敏感信息同时保持图像其余部分清晰很有用。',
        },
      ],
    },
  },
  {
    slug: 'image-to-ico',
    faqs: {
      en: [
        {
          question: 'How do I convert an image to ICO format?',
          answer: 'Upload any image (PNG, JPG, etc.) and our tool converts it to ICO format. Choose the icon sizes you need (16x16, 32x32, 48x48, 256x256) or create a multi-size ICO file.',
        },
        {
          question: 'What is ICO format used for?',
          answer: 'ICO (Icon) format is used for Windows application icons, website favicons, and desktop shortcuts. It can contain multiple sizes in one file for different display contexts.',
        },
        {
          question: 'Can I create a favicon for my website?',
          answer: 'Yes, upload your logo and we\'ll generate favicon.ico with all necessary sizes. We also provide PNG versions for modern browsers and Apple touch icons for iOS devices.',
        },
      ],
      zh: [
        {
          question: '如何将图像转换为 ICO 格式？',
          answer: '上传任何图像（PNG、JPG 等），我们的工具会将其转换为 ICO 格式。选择所需的图标大小（16x16、32x32、48x48、256x256）或创建多尺寸 ICO 文件。',
        },
        {
          question: 'ICO 格式用于什么？',
          answer: 'ICO（图标）格式用于 Windows 应用程序图标、网站 favicon 和桌面快捷方式。它可以在一个文件中包含多个尺寸，用于不同的显示场景。',
        },
        {
          question: '可以为我的网站创建 favicon 吗？',
          answer: '是的，上传您的 logo，我们会生成包含所有必要尺寸的 favicon.ico。我们还提供用于现代浏览器的 PNG 版本和用于 iOS 设备的 Apple touch 图标。',
        },
      ],
    },
  },
  {
    slug: 'gif-splitter',
    faqs: {
      en: [
        {
          question: 'How do I extract frames from a GIF?',
          answer: 'Upload your GIF and the tool automatically extracts all frames. Preview each frame, select the ones you want, and download them individually or as a ZIP file in PNG or JPG format.',
        },
        {
          question: 'Can I extract specific frames from a GIF?',
          answer: 'Yes, preview all frames and select only the ones you need. You can also specify a frame range (e.g., frames 10-20) or extract every Nth frame to reduce the number of images.',
        },
        {
          question: 'What can I do with extracted GIF frames?',
          answer: 'Use extracted frames for editing individual images, creating new GIFs with modifications, making sprite sheets, or analyzing animation sequences frame by frame.',
        },
      ],
      zh: [
        {
          question: '如何从 GIF 中提取帧？',
          answer: '上传 GIF，工具会自动提取所有帧。预览每一帧，选择您想要的，然后以 PNG 或 JPG 格式单独下载或作为 ZIP 文件下载。',
        },
        {
          question: '可以从 GIF 中提取特定帧吗？',
          answer: '是的，预览所有帧并只选择您需要的。您还可以指定帧范围（例如第 10-20 帧）或每隔 N 帧提取一次以减少图像数量。',
        },
        {
          question: '提取的 GIF 帧可以做什么？',
          answer: '使用提取的帧编辑单个图像、创建带修改的新 GIF、制作精灵图或逐帧分析动画序列。',
        },
      ],
    },
  },
  {
    slug: 'gif-compressor',
    faqs: {
      en: [
        {
          question: 'How do I reduce GIF file size?',
          answer: 'Upload your GIF and choose compression level. The tool reduces file size by optimizing colors, removing duplicate frames, and adjusting quality. Preview the result before downloading.',
        },
        {
          question: 'How much can I compress a GIF?',
          answer: 'Compression results vary, but typically 30-70% size reduction is achievable. Higher compression may affect quality, so use the preview to find the right balance for your needs.',
        },
        {
          question: 'Will compression affect GIF animation quality?',
          answer: 'Some quality loss is normal with compression. Our tool offers different levels so you can choose between smaller file size and better quality. The preview helps you decide.',
        },
      ],
      zh: [
        {
          question: '如何减小 GIF 文件大小？',
          answer: '上传 GIF 并选择压缩级别。工具通过优化颜色、删除重复帧和调整质量来减小文件大小。下载前预览结果。',
        },
        {
          question: 'GIF 可以压缩多少？',
          answer: '压缩结果各不相同，但通常可以实现 30-70% 的大小减少。更高的压缩可能会影响质量，因此使用预览找到适合您需求的平衡点。',
        },
        {
          question: '压缩会影响 GIF 动画质量吗？',
          answer: '压缩时一些质量损失是正常的。我们的工具提供不同级别，让您可以在更小的文件大小和更好的质量之间选择。预览可帮助您决定。',
        },
      ],
    },
  },
  {
    slug: 'image-to-webp',
    faqs: {
      en: [
        {
          question: 'Why should I convert images to WebP?',
          answer: 'WebP offers 25-35% smaller file sizes than JPEG/PNG with similar quality. It\'s supported by all modern browsers and recommended by Google for faster website loading.',
        },
        {
          question: 'How do I convert images to WebP format?',
          answer: 'Upload your images (PNG, JPG, GIF) and they\'re instantly converted to WebP. Adjust quality settings if needed and download. Batch conversion is supported for multiple files.',
        },
        {
          question: 'Does WebP support transparency and animation?',
          answer: 'Yes, WebP supports both transparency (like PNG) and animation (like GIF), often with smaller file sizes. It\'s a versatile format that can replace multiple image types.',
        },
      ],
      zh: [
        {
          question: '为什么应该将图像转换为 WebP？',
          answer: 'WebP 在相似质量下比 JPEG/PNG 文件小 25-35%。所有现代浏览器都支持它，Google 推荐使用它来加快网站加载速度。',
        },
        {
          question: '如何将图像转换为 WebP 格式？',
          answer: '上传图像（PNG、JPG、GIF），它们会立即转换为 WebP。如需要可调整质量设置并下载。支持多文件批量转换。',
        },
        {
          question: 'WebP 支持透明度和动画吗？',
          answer: '是的，WebP 支持透明度（如 PNG）和动画（如 GIF），通常文件更小。它是一种多功能格式，可以替代多种图像类型。',
        },
      ],
    },
  },
];
