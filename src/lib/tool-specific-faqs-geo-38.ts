/**
 * GEO 优化的工具 FAQ 配置 - 第三十八批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_38: ToolSpecificFAQ[] = [
  // JSON Viewer
  {
    slug: 'json-viewer',
    faqs: {
      en: [
        { question: 'How do I view JSON data?', answer: 'Paste JSON, we display in collapsible tree view. Expand/collapse nodes, search within data.' },
        { question: 'Can I edit JSON in the viewer?', answer: 'Yes, click values to edit. Changes reflect in raw JSON. Validates as you type.' },
        { question: 'How do I navigate large JSON?', answer: 'Use search to find keys/values. Collapse all then expand specific paths. Copy path to any node.' },
      ],
      zh: [
        { question: '如何查看 JSON 数据？', answer: '粘贴 JSON，我们以可折叠的树视图显示。展开/折叠节点，在数据中搜索。' },
        { question: '可以在查看器中编辑 JSON 吗？', answer: '是的，点击值进行编辑。更改反映在原始 JSON 中。输入时验证。' },
        { question: '如何导航大型 JSON？', answer: '使用搜索查找键/值。全部折叠然后展开特定路径。复制任何节点的路径。' },
      ],
    },
  },

  // IP Address Generator
  {
    slug: 'ip-address-generator',
    faqs: {
      en: [
        { question: 'How do I generate random IP addresses?', answer: 'Select IP version (v4/v6), range constraints. We generate valid random IPs.' },
        { question: 'Can I generate IPs in a specific range?', answer: 'Yes, specify CIDR or start/end range. We generate IPs within that subnet.' },
        { question: 'What about private IP ranges?', answer: 'Option to include/exclude private ranges (10.x, 192.168.x, etc.). Choose based on use case.' },
      ],
      zh: [
        { question: '如何生成随机 IP 地址？', answer: '选择 IP 版本（v4/v6）、范围约束。我们生成有效的随机 IP。' },
        { question: '可以在特定范围内生成 IP 吗？', answer: '是的，指定 CIDR 或起始/结束范围。我们在该子网内生成 IP。' },
        { question: '私有 IP 范围呢？', answer: '可选择包含/排除私有范围（10.x、192.168.x 等）。根据用例选择。' },
      ],
    },
  },

  // CSS Gradient Text
  {
    slug: 'css-gradient-text',
    faqs: {
      en: [
        { question: 'How do I create gradient text in CSS?', answer: 'Enter text, choose colors. We generate CSS with background-clip and text-fill-color.' },
        { question: 'Does gradient text work in all browsers?', answer: 'Modern browsers yes. Uses -webkit-background-clip for Safari. We include all prefixes.' },
        { question: 'Can I animate the gradient?', answer: 'Yes, we can generate animated gradient CSS. Smooth color transitions on text.' },
      ],
      zh: [
        { question: '如何在 CSS 中创建渐变文本？', answer: '输入文本，选择颜色。我们生成带有 background-clip 和 text-fill-color 的 CSS。' },
        { question: '渐变文本在所有浏览器中都有效吗？', answer: '现代浏览器可以。Safari 使用 -webkit-background-clip。我们包含所有前缀。' },
        { question: '可以为渐变添加动画吗？', answer: '是的，我们可以生成动画渐变 CSS。文本上平滑的颜色过渡。' },
      ],
    },
  },

  // JSON to PHP
  {
    slug: 'json-to-php',
    faqs: {
      en: [
        { question: 'How do I convert JSON to PHP?', answer: 'Paste JSON, we generate PHP array syntax or class definitions with typed properties.' },
        { question: 'Array or class output?', answer: 'Choose array for simple data, classes for OOP. Classes include getters/setters and type hints.' },
        { question: 'Does it support PHP 8 features?', answer: 'Yes, constructor property promotion, union types, named arguments. Select PHP version.' },
      ],
      zh: [
        { question: '如何将 JSON 转换为 PHP？', answer: '粘贴 JSON，我们生成 PHP 数组语法或带有类型属性的类定义。' },
        { question: '数组还是类输出？', answer: '简单数据选择数组，OOP 选择类。类包含 getter/setter 和类型提示。' },
        { question: '它支持 PHP 8 特性吗？', answer: '是的，构造函数属性提升、联合类型、命名参数。选择 PHP 版本。' },
      ],
    },
  },

  // CSS Filter Generator
  {
    slug: 'css-filter-generator',
    faqs: {
      en: [
        { question: 'What CSS filters are available?', answer: 'Blur, brightness, contrast, grayscale, hue-rotate, invert, saturate, sepia, drop-shadow.' },
        { question: 'How do I combine multiple filters?', answer: 'Add filters in sequence. Order matters. We generate combined filter property.' },
        { question: 'Can I create Instagram-like filters?', answer: 'Yes, combine filters to recreate popular photo effects. Save presets for reuse.' },
      ],
      zh: [
        { question: '有哪些 CSS 滤镜可用？', answer: '模糊、亮度、对比度、灰度、色相旋转、反转、饱和度、棕褐色、阴影。' },
        { question: '如何组合多个滤镜？', answer: '按顺序添加滤镜。顺序很重要。我们生成组合的 filter 属性。' },
        { question: '可以创建类似 Instagram 的滤镜吗？', answer: '是的，组合滤镜以重现流行的照片效果。保存预设以供重用。' },
      ],
    },
  },

  // Text Diff Patch
  {
    slug: 'text-diff-patch',
    faqs: {
      en: [
        { question: 'How do I compare two texts?', answer: 'Paste original and modified text. We show additions, deletions, and changes highlighted.' },
        { question: 'What is a patch file?', answer: 'Unified diff format showing changes. Can be applied to recreate modifications. Used in version control.' },
        { question: 'Can I apply a patch?', answer: 'Yes, paste original text and patch. We apply changes to produce the modified version.' },
      ],
      zh: [
        { question: '如何比较两个文本？', answer: '粘贴原始和修改后的文本。我们显示高亮的添加、删除和更改。' },
        { question: '什么是补丁文件？', answer: '显示更改的统一差异格式。可以应用以重现修改。用于版本控制。' },
        { question: '可以应用补丁吗？', answer: '是的，粘贴原始文本和补丁。我们应用更改以生成修改后的版本。' },
      ],
    },
  },

  // Encoding Detector
  {
    slug: 'encoding-detector',
    faqs: {
      en: [
        { question: 'How do I detect text encoding?', answer: 'Paste text or upload file. We analyze byte patterns to identify encoding (UTF-8, ISO-8859-1, etc.).' },
        { question: 'Why does encoding matter?', answer: 'Wrong encoding causes garbled text (mojibake). Correct detection ensures proper display.' },
        { question: 'Can I convert between encodings?', answer: 'Yes, detect then convert. We support UTF-8, UTF-16, ISO-8859-1, Windows-1252, and more.' },
      ],
      zh: [
        { question: '如何检测文本编码？', answer: '粘贴文本或上传文件。我们分析字节模式以识别编码（UTF-8、ISO-8859-1 等）。' },
        { question: '为什么编码很重要？', answer: '错误的编码导致乱码。正确的检测确保正确显示。' },
        { question: '可以在编码之间转换吗？', answer: '是的，检测然后转换。我们支持 UTF-8、UTF-16、ISO-8859-1、Windows-1252 等。' },
      ],
    },
  },

  // CSS Clip Path Generator
  {
    slug: 'css-clip-path-generator',
    faqs: {
      en: [
        { question: 'What is CSS clip-path?', answer: 'Clips element to a shape. Circle, ellipse, polygon, or custom path. Creates non-rectangular elements.' },
        { question: 'How do I create custom shapes?', answer: 'Use polygon editor. Click to add points, drag to adjust. We generate the clip-path CSS.' },
        { question: 'What shapes are available?', answer: 'Circle, ellipse, inset (rounded rectangle), polygon (any shape). Visual editor for all.' },
      ],
      zh: [
        { question: '什么是 CSS clip-path？', answer: '将元素裁剪为形状。圆形、椭圆、多边形或自定义路径。创建非矩形元素。' },
        { question: '如何创建自定义形状？', answer: '使用多边形编辑器。点击添加点，拖动调整。我们生成 clip-path CSS。' },
        { question: '有哪些形状可用？', answer: '圆形、椭圆、内嵌（圆角矩形）、多边形（任何形状）。所有形状都有可视化编辑器。' },
      ],
    },
  },

  // UUID Validator
  {
    slug: 'uuid-validator',
    faqs: {
      en: [
        { question: 'How do I validate a UUID?', answer: 'Paste UUID string. We check format, version, and variant. Shows if valid and which version.' },
        { question: 'What UUID versions exist?', answer: 'v1 (time-based), v3 (MD5 hash), v4 (random), v5 (SHA-1 hash). v4 most common.' },
        { question: 'What makes a UUID invalid?', answer: 'Wrong length, invalid characters, incorrect version/variant bits. We explain the specific issue.' },
      ],
      zh: [
        { question: '如何验证 UUID？', answer: '粘贴 UUID 字符串。我们检查格式、版本和变体。显示是否有效以及哪个版本。' },
        { question: '存在哪些 UUID 版本？', answer: 'v1（基于时间）、v3（MD5 哈希）、v4（随机）、v5（SHA-1 哈希）。v4 最常见。' },
        { question: '什么使 UUID 无效？', answer: '长度错误、无效字符、版本/变体位不正确。我们解释具体问题。' },
      ],
    },
  },

  // Text Hash Comparator
  {
    slug: 'text-hash-comparator',
    faqs: {
      en: [
        { question: 'How do I compare hashes?', answer: 'Enter two hash values. We compare and show if they match. Case-insensitive comparison.' },
        { question: 'Why compare hashes?', answer: 'Verify file integrity, check password hashes, validate downloads. Matching hashes = identical content.' },
        { question: 'Can I hash and compare in one step?', answer: 'Yes, enter text and expected hash. We compute hash and compare automatically.' },
      ],
      zh: [
        { question: '如何比较哈希？', answer: '输入两个哈希值。我们比较并显示是否匹配。不区分大小写的比较。' },
        { question: '为什么要比较哈希？', answer: '验证文件完整性、检查密码哈希、验证下载。匹配的哈希 = 相同的内容。' },
        { question: '可以一步完成哈希和比较吗？', answer: '是的，输入文本和预期哈希。我们自动计算哈希并比较。' },
      ],
    },
  },
];
