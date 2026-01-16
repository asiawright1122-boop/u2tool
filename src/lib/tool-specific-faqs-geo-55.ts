/**
 * GEO 优化工具 FAQ - 第 55 批
 * 为缺失 FAQ 的工具添加 GEO 优化的问答内容
 */

import type { ToolSpecificFAQ } from './tool-specific-faqs';

export const GEO_TOOL_FAQS_55: ToolSpecificFAQ[] = [
  {
    slug: 'json-to-proto',
    faqs: {
      en: [
        { question: 'What is Protocol Buffers?', answer: 'Protocol Buffers is a language-neutral serialization format by Google, smaller and faster than JSON.' },
        { question: 'Why convert JSON to Protobuf?', answer: 'Protobuf offers 3-10x smaller message sizes and faster parsing compared to JSON.' },
        { question: 'Does this generate valid .proto files?', answer: 'Yes, generates valid proto3 schema files for use with protoc compiler.' },
      ],
      zh: [
        { question: '什么是 Protocol Buffers？', answer: 'Protocol Buffers 是 Google 开发的语言无关序列化格式，比 JSON 更小更快。' },
        { question: '为什么转换为 Protobuf？', answer: 'Protobuf 提供比 JSON 小 3-10 倍的消息大小和更快的解析速度。' },
        { question: '生成的 .proto 文件有效吗？', answer: '是的，生成有效的 proto3 模式文件，可与 protoc 编译器一起使用。' },
      ],
    },
  },
  {
    slug: 'webp-to-png',
    faqs: {
      en: [
        { question: 'Why convert WebP to PNG?', answer: 'PNG is more universally supported across all browsers and image editing software.' },
        { question: 'Will I lose quality?', answer: 'No, PNG is lossless. Converting preserves all image quality.' },
        { question: 'Is my data secure?', answer: 'Yes, all processing happens in your browser. Images never leave your device.' },
      ],
      zh: [
        { question: '为什么转换为 PNG？', answer: 'PNG 在所有浏览器和图像编辑软件中得到更广泛支持。' },
        { question: '会损失质量吗？', answer: '不会，PNG 是无损格式，转换会保留所有图像质量。' },
        { question: '数据安全吗？', answer: '是的，所有处理在浏览器中进行，图像永远不会离开您的设备。' },
      ],
    },
  },
  {
    slug: 'png-to-svg',
    faqs: {
      en: [
        { question: 'How does conversion work?', answer: 'The tool traces edges and shapes, converting them to vector paths. Best for simple graphics.' },
        { question: 'Will SVG look like my PNG?', answer: 'For simple graphics with clear edges, yes. Complex photos may not convert well.' },
        { question: 'Benefits of SVG?', answer: 'Scalable without quality loss, smaller for simple graphics, editable with code.' },
      ],
      zh: [
        { question: '转换如何工作？', answer: '工具追踪边缘和形状，转换为矢量路径。最适合简单图形。' },
        { question: 'SVG 会像 PNG 一样吗？', answer: '对于边缘清晰的简单图形，是的。复杂照片可能转换效果不佳。' },
        { question: 'SVG 的优势？', answer: '可无损缩放，简单图形文件更小，可用代码编辑。' },
      ],
    },
  },
  {
    slug: 'json-to-table',
    faqs: {
      en: [
        { question: 'What JSON works best?', answer: 'Arrays of objects work best, each object becomes a row, keys become columns.' },
        { question: 'Can I export?', answer: 'Yes, export to CSV, Excel, or copy HTML table code directly.' },
        { question: 'How are nested objects handled?', answer: 'Flattened using dot notation (e.g., "address.city").' },
      ],
      zh: [
        { question: '什么 JSON 最适合？', answer: '对象数组最适合，每个对象成为一行，键成为列。' },
        { question: '可以导出吗？', answer: '是的，可导出为 CSV、Excel 或直接复制 HTML 表格代码。' },
        { question: '嵌套对象如何处理？', answer: '使用点符号展平（如 "address.city"）。' },
      ],
    },
  },
  {
    slug: 'yaml-validator',
    faqs: {
      en: [
        { question: 'What errors are detected?', answer: 'Incorrect indentation, invalid characters, duplicate keys, malformed structures with line numbers.' },
        { question: 'YAML 1.2 support?', answer: 'Yes, fully supports YAML 1.2 including anchors, aliases, and multi-document streams.' },
        { question: 'Kubernetes YAML?', answer: 'Yes for syntax validation, but not Kubernetes-specific schema requirements.' },
      ],
      zh: [
        { question: '检测哪些错误？', answer: '不正确的缩进、无效字符、重复键、格式错误的结构，并提供行号。' },
        { question: '支持 YAML 1.2？', answer: '是的，完全支持 YAML 1.2，包括锚点、别名和多文档流。' },
        { question: 'Kubernetes YAML？', answer: '支持语法验证，但不验证 Kubernetes 特定模式要求。' },
      ],
    },
  },
  {
    slug: 'xml-validator',
    faqs: {
      en: [
        { question: 'What is checked?', answer: 'Well-formedness: tag nesting, matching tags, attribute syntax, character encoding.' },
        { question: 'XSD validation?', answer: 'This validates syntax only. XSD schema validation requires providing the schema file.' },
        { question: 'Common errors?', answer: 'Unclosed tags, mismatched names, unescaped characters (&, <, >), missing root element.' },
      ],
      zh: [
        { question: '检查什么？', answer: '格式良好性：标签嵌套、匹配标签、属性语法、字符编码。' },
        { question: 'XSD 验证？', answer: '仅验证语法。XSD 模式验证需要提供模式文件。' },
        { question: '常见错误？', answer: '未关闭标签、不匹配名称、未转义字符（&、<、>）、缺少根元素。' },
      ],
    },
  },
  {
    slug: 'css-to-tailwind',
    faqs: {
      en: [
        { question: 'How accurate?', answer: 'Handles most common CSS properties. Complex selectors may need manual adjustment.' },
        { question: 'All CSS supported?', answer: 'Most common properties with Tailwind equivalents. Some advanced features may not map directly.' },
        { question: 'Tailwind version?', answer: 'Generates classes compatible with Tailwind CSS v3.x.' },
      ],
      zh: [
        { question: '准确性如何？', answer: '处理大多数常见 CSS 属性。复杂选择器可能需要手动调整。' },
        { question: '支持所有 CSS？', answer: '支持大多数有 Tailwind 等效项的常用属性。某些高级功能可能无法直接映射。' },
        { question: 'Tailwind 版本？', answer: '生成与 Tailwind CSS v3.x 兼容的类。' },
      ],
    },
  },
  {
    slug: 'tailwind-to-css',
    faqs: {
      en: [
        { question: 'Why convert?', answer: 'Useful for non-Tailwind projects, understanding generated CSS, or debugging styles.' },
        { question: 'All classes supported?', answer: 'Yes, including responsive variants, state variants, and arbitrary values.' },
        { question: 'Responsive breakpoints?', answer: 'Yes, sm:, md:, lg: are converted to proper CSS media queries.' },
      ],
      zh: [
        { question: '为什么转换？', answer: '适用于非 Tailwind 项目、理解生成的 CSS 或调试样式。' },
        { question: '支持所有类？', answer: '是的，包括响应式变体、状态变体和任意值。' },
        { question: '响应式断点？', answer: '是的，sm:、md:、lg: 会转换为适当的 CSS 媒体查询。' },
      ],
    },
  },
];
