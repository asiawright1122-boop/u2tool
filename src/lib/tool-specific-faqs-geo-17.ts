/**
 * GEO 优化的工具 FAQ 配置 - 第十七批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_17: ToolSpecificFAQ[] = [
  // PDF Merger
  {
    slug: 'pdf-merger',
    faqs: {
      en: [
        { question: 'How do I merge PDF files?', answer: 'Upload multiple PDFs, drag to arrange order, click Merge. All files combine into one PDF that you can download.' },
        { question: 'Is there a limit on number of files?', answer: 'You can merge many PDFs at once. Processing happens in your browser, so very large files may be slower.' },
        { question: 'Can I rearrange pages before merging?', answer: 'Yes, drag and drop to reorder entire files. For page-level control, use our PDF page organizer tool.' },
      ],
      zh: [
        { question: '如何合并 PDF 文件？', answer: '上传多个 PDF，拖动排列顺序，点击合并。所有文件合并为一个可下载的 PDF。' },
        { question: '文件数量有限制吗？', answer: '您可以一次合并多个 PDF。处理在浏览器中进行，所以非常大的文件可能会较慢。' },
        { question: '合并前可以重新排列页面吗？', answer: '是的，拖放重新排序整个文件。要进行页面级控制，请使用我们的 PDF 页面组织工具。' },
      ],
    },
  },

  // PDF Splitter
  {
    slug: 'pdf-splitter',
    faqs: {
      en: [
        { question: 'How do I split a PDF?', answer: 'Upload PDF, choose split method: by page range, every N pages, or extract specific pages. Download individual files.' },
        { question: 'Can I extract specific pages?', answer: 'Yes, enter page numbers (e.g., 1,3,5-8) to extract only those pages into a new PDF.' },
        { question: 'How do I split into equal parts?', answer: 'Choose "split every N pages" option. A 20-page PDF split every 5 pages creates 4 separate files.' },
      ],
      zh: [
        { question: '如何拆分 PDF？', answer: '上传 PDF，选择拆分方法：按页面范围、每 N 页或提取特定页面。下载单独的文件。' },
        { question: '可以提取特定页面吗？', answer: '是的，输入页码（例如 1,3,5-8）仅将这些页面提取到新的 PDF 中。' },
        { question: '如何拆分成相等的部分？', answer: '选择"每 N 页拆分"选项。20 页的 PDF 每 5 页拆分创建 4 个单独的文件。' },
      ],
    },
  },

  // PDF Compressor
  {
    slug: 'pdf-compressor',
    faqs: {
      en: [
        { question: 'How much can PDFs be compressed?', answer: 'Typically 50-90% reduction depending on content. Image-heavy PDFs compress more. Text-only PDFs are already small.' },
        { question: 'Will compression affect quality?', answer: 'Choose compression level: low (best quality), medium (balanced), high (smallest size). Preview before downloading.' },
        { question: 'Why is my PDF so large?', answer: 'Usually due to high-resolution images, embedded fonts, or scanned pages. Compression optimizes these elements.' },
      ],
      zh: [
        { question: 'PDF 可以压缩多少？', answer: '通常减少 50-90%，取决于内容。图像较多的 PDF 压缩更多。纯文本 PDF 本身就很小。' },
        { question: '压缩会影响质量吗？', answer: '选择压缩级别：低（最佳质量）、中（平衡）、高（最小尺寸）。下载前预览。' },
        { question: '为什么我的 PDF 这么大？', answer: '通常是由于高分辨率图像、嵌入字体或扫描页面。压缩会优化这些元素。' },
      ],
    },
  },

  // Word to PDF
  {
    slug: 'word-to-pdf',
    faqs: {
      en: [
        { question: 'How do I convert Word to PDF?', answer: 'Upload .doc or .docx file. We convert it to PDF preserving formatting, fonts, and images. Download the PDF.' },
        { question: 'Will formatting be preserved?', answer: 'Yes, we maintain layout, fonts, images, tables, and styles. Complex formatting may have minor differences.' },
        { question: 'Can I convert multiple Word files?', answer: 'Yes, upload multiple files for batch conversion. Each becomes a separate PDF, or merge into one.' },
      ],
      zh: [
        { question: '如何将 Word 转换为 PDF？', answer: '上传 .doc 或 .docx 文件。我们将其转换为 PDF，保留格式、字体和图像。下载 PDF。' },
        { question: '格式会保留吗？', answer: '是的，我们保持布局、字体、图像、表格和样式。复杂格式可能有细微差异。' },
        { question: '可以转换多个 Word 文件吗？', answer: '是的，上传多个文件进行批量转换。每个成为单独的 PDF，或合并为一个。' },
      ],
    },
  },

  // Excel to PDF
  {
    slug: 'excel-to-pdf',
    faqs: {
      en: [
        { question: 'How do I convert Excel to PDF?', answer: 'Upload .xls or .xlsx file. Choose page orientation and scaling. We convert spreadsheet to PDF format.' },
        { question: 'How do I fit wide spreadsheets?', answer: 'Choose landscape orientation, "fit to page" scaling, or select specific columns to include.' },
        { question: 'Are formulas converted?', answer: 'PDF shows calculated values, not formulas. Charts and formatting are preserved. It\'s a static snapshot.' },
      ],
      zh: [
        { question: '如何将 Excel 转换为 PDF？', answer: '上传 .xls 或 .xlsx 文件。选择页面方向和缩放。我们将电子表格转换为 PDF 格式。' },
        { question: '如何适应宽电子表格？', answer: '选择横向方向、"适应页面"缩放，或选择要包含的特定列。' },
        { question: '公式会被转换吗？', answer: 'PDF 显示计算值，而非公式。图表和格式会保留。它是静态快照。' },
      ],
    },
  },

  // HTML to PDF
  {
    slug: 'html-to-pdf',
    faqs: {
      en: [
        { question: 'How do I convert HTML to PDF?', answer: 'Paste HTML code or enter URL. We render the page and convert to PDF. CSS styles are preserved.' },
        { question: 'Are images and CSS included?', answer: 'Yes, we render complete pages including images, CSS, and web fonts. External resources must be accessible.' },
        { question: 'Can I convert a live webpage?', answer: 'Yes, enter the URL and we\'ll capture and convert it. Some dynamic content may not render correctly.' },
      ],
      zh: [
        { question: '如何将 HTML 转换为 PDF？', answer: '粘贴 HTML 代码或输入 URL。我们渲染页面并转换为 PDF。CSS 样式会保留。' },
        { question: '图像和 CSS 会包含吗？', answer: '是的，我们渲染完整页面，包括图像、CSS 和网页字体。外部资源必须可访问。' },
        { question: '可以转换实时网页吗？', answer: '是的，输入 URL，我们将捕获并转换它。某些动态内容可能无法正确渲染。' },
      ],
    },
  },

  // Markdown to PDF
  {
    slug: 'markdown-to-pdf',
    faqs: {
      en: [
        { question: 'How do I convert Markdown to PDF?', answer: 'Paste Markdown text or upload .md file. We render with styling and convert to PDF. Code blocks are syntax highlighted.' },
        { question: 'What Markdown features are supported?', answer: 'Headers, lists, tables, code blocks, images, links, bold, italic, blockquotes. GitHub Flavored Markdown supported.' },
        { question: 'Can I customize the PDF style?', answer: 'Yes, choose themes (light/dark), fonts, margins, and code highlighting style before converting.' },
      ],
      zh: [
        { question: '如何将 Markdown 转换为 PDF？', answer: '粘贴 Markdown 文本或上传 .md 文件。我们使用样式渲染并转换为 PDF。代码块有语法高亮。' },
        { question: '支持哪些 Markdown 功能？', answer: '标题、列表、表格、代码块、图像、链接、粗体、斜体、引用块。支持 GitHub 风格 Markdown。' },
        { question: '可以自定义 PDF 样式吗？', answer: '是的，在转换前选择主题（浅色/深色）、字体、边距和代码高亮样式。' },
      ],
    },
  },

  // OCR (Image to Text)
  {
    slug: 'ocr',
    faqs: {
      en: [
        { question: 'How does OCR work?', answer: 'Upload image containing text. AI recognizes characters and extracts them as editable text. Works with photos, scans, screenshots.' },
        { question: 'What languages are supported?', answer: 'English, Chinese, Japanese, Korean, Spanish, French, German, and 100+ other languages. Select language for best accuracy.' },
        { question: 'How do I improve OCR accuracy?', answer: 'Use clear, high-resolution images. Ensure good contrast between text and background. Straight alignment helps.' },
      ],
      zh: [
        { question: 'OCR 是如何工作的？', answer: '上传包含文本的图像。AI 识别字符并将其提取为可编辑文本。适用于照片、扫描件、截图。' },
        { question: '支持哪些语言？', answer: '英语、中文、日语、韩语、西班牙语、法语、德语和 100 多种其他语言。选择语言以获得最佳准确性。' },
        { question: '如何提高 OCR 准确性？', answer: '使用清晰、高分辨率的图像。确保文本和背景之间有良好的对比度。对齐有助于提高准确性。' },
      ],
    },
  },

  // Text Compare
  {
    slug: 'text-compare',
    faqs: {
      en: [
        { question: 'How do I compare two texts?', answer: 'Paste text in both panels. We highlight additions (green), deletions (red), and changes. Line-by-line or word-by-word comparison.' },
        { question: 'What comparison modes are available?', answer: 'Character-level, word-level, line-level. Choose based on what differences you\'re looking for.' },
        { question: 'Can I compare files?', answer: 'Yes, upload two text files or paste content directly. Supports .txt, .md, .json, .xml, and code files.' },
      ],
      zh: [
        { question: '如何比较两段文本？', answer: '在两个面板中粘贴文本。我们高亮显示添加（绿色）、删除（红色）和更改。逐行或逐词比较。' },
        { question: '有哪些比较模式可用？', answer: '字符级、单词级、行级。根据您要查找的差异选择。' },
        { question: '可以比较文件吗？', answer: '是的，上传两个文本文件或直接粘贴内容。支持 .txt、.md、.json、.xml 和代码文件。' },
      ],
    },
  },

  // Regex Tester
  {
    slug: 'regex-tester',
    faqs: {
      en: [
        { question: 'How do I test a regex pattern?', answer: 'Enter pattern and test string. We highlight matches in real-time. Shows capture groups and match details.' },
        { question: 'What regex flavors are supported?', answer: 'JavaScript regex by default. Supports flags: g (global), i (case-insensitive), m (multiline), s (dotall).' },
        { question: 'How do I learn regex?', answer: 'We provide a cheat sheet with common patterns. Hover over pattern parts for explanations. Try examples to learn.' },
      ],
      zh: [
        { question: '如何测试正则表达式模式？', answer: '输入模式和测试字符串。我们实时高亮匹配项。显示捕获组和匹配详情。' },
        { question: '支持哪些正则表达式风格？', answer: '默认 JavaScript 正则表达式。支持标志：g（全局）、i（不区分大小写）、m（多行）、s（点匹配所有）。' },
        { question: '如何学习正则表达式？', answer: '我们提供常见模式的速查表。将鼠标悬停在模式部分上查看解释。尝试示例来学习。' },
      ],
    },
  },
];
