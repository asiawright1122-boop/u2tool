/**
 * GEO 优化工具 FAQ - 第 56 批
 * 为缺失 FAQ 的工具添加 GEO 优化的问答内容
 */

import type { ToolSpecificFAQ } from './tool-specific-faqs';

export const GEO_TOOL_FAQS_56: ToolSpecificFAQ[] = [
  {
    slug: 'svg-editor',
    faqs: {
      en: [
        { question: 'What can I do?', answer: 'Create and edit SVG graphics, add shapes, paths, text. Supports move, scale, rotate, and color changes.' },
        { question: 'Can I import SVG files?', answer: 'Yes, paste SVG code or upload an SVG file to start editing.' },
        { question: 'Export formats?', answer: 'Export as SVG (vector), PNG (raster), or copy SVG code directly.' },
      ],
      zh: [
        { question: '可以做什么？', answer: '创建和编辑 SVG 图形，添加形状、路径、文本。支持移动、缩放、旋转和颜色更改。' },
        { question: '可以导入 SVG 文件吗？', answer: '是的，粘贴 SVG 代码或上传 SVG 文件开始编辑。' },
        { question: '导出格式？', answer: '导出为 SVG（矢量）、PNG（光栅）或直接复制 SVG 代码。' },
      ],
    },
  },
  {
    slug: 'json-to-form',
    faqs: {
      en: [
        { question: 'How does it work?', answer: 'Analyzes JSON structure and generates appropriate HTML form fields. Strings become text inputs, booleans become checkboxes.' },
        { question: 'Can I customize?', answer: 'Yes, customize labels, validation rules, input types, and layout after generation.' },
        { question: 'Export frameworks?', answer: 'Export as plain HTML, React, Vue, or Angular components.' },
      ],
      zh: [
        { question: '如何工作？', answer: '分析 JSON 结构并生成适当的 HTML 表单字段。字符串变为文本输入，布尔值变为复选框。' },
        { question: '可以自定义吗？', answer: '是的，生成后可自定义标签、验证规则、输入类型和布局。' },
        { question: '导出框架？', answer: '导出为纯 HTML、React、Vue 或 Angular 组件。' },
      ],
    },
  },
  {
    slug: 'jwt-debugger',
    faqs: {
      en: [
        { question: 'Decoder vs Debugger?', answer: 'Decoder only displays contents. Debugger also verifies signatures, modifies payloads, and creates test tokens.' },
        { question: 'Can I verify signatures?', answer: 'Yes, provide secret key (HS256) or public key (RS256) to verify signature validity.' },
        { question: 'Algorithms supported?', answer: 'HS256, HS384, HS512, RS256, RS384, RS512, ES256, ES384, ES512.' },
      ],
      zh: [
        { question: '解码器 vs 调试器？', answer: '解码器仅显示内容。调试器还可验证签名、修改负载和创建测试令牌。' },
        { question: '可以验证签名吗？', answer: '是的，提供密钥（HS256）或公钥（RS256）来验证签名有效性。' },
        { question: '支持的算法？', answer: 'HS256、HS384、HS512、RS256、RS384、RS512、ES256、ES384、ES512。' },
      ],
    },
  },
  {
    slug: 'csp-generator',
    faqs: {
      en: [
        { question: 'What is CSP?', answer: 'Content Security Policy helps prevent XSS, clickjacking, and code injection by specifying allowed content sources.' },
        { question: 'How to implement?', answer: 'Add as Content-Security-Policy HTTP header or use a <meta> tag in HTML head.' },
        { question: 'How to test safely?', answer: 'Use Content-Security-Policy-Report-Only header first to report without blocking.' },
      ],
      zh: [
        { question: '什么是 CSP？', answer: '内容安全策略通过指定允许的内容源来帮助防止 XSS、点击劫持和代码注入。' },
        { question: '如何实现？', answer: '添加为 Content-Security-Policy HTTP 头或在 HTML head 中使用 <meta> 标签。' },
        { question: '如何安全测试？', answer: '首先使用 Content-Security-Policy-Report-Only 头来报告而不阻止。' },
      ],
    },
  },
  {
    slug: 'sri-hash-generator',
    faqs: {
      en: [
        { question: 'What is SRI?', answer: 'Subresource Integrity lets browsers verify resources haven\'t been tampered with using cryptographic hashes.' },
        { question: 'When to use?', answer: 'When loading resources from CDNs or third-party sources to protect against compromised CDNs.' },
        { question: 'Which algorithm?', answer: 'SHA-384 is recommended for strong security with good performance.' },
      ],
      zh: [
        { question: '什么是 SRI？', answer: '子资源完整性让浏览器使用加密哈希验证资源未被篡改。' },
        { question: '何时使用？', answer: '从 CDN 或第三方源加载资源时，防止受损的 CDN 提供恶意代码。' },
        { question: '哪种算法？', answer: '推荐 SHA-384，安全性强且性能良好。' },
      ],
    },
  },
  {
    slug: 'cors-tester',
    faqs: {
      en: [
        { question: 'What is CORS?', answer: 'Cross-Origin Resource Sharing allows or restricts web pages from making requests to different domains.' },
        { question: 'Why CORS errors?', answer: 'Server doesn\'t include proper Access-Control-Allow-Origin headers. Server must explicitly allow your domain.' },
        { question: 'What does this test?', answer: 'Sends requests and analyzes CORS headers, showing allowed origins, methods, and headers.' },
      ],
      zh: [
        { question: '什么是 CORS？', answer: '跨源资源共享允许或限制网页向不同域发出请求。' },
        { question: '为什么有 CORS 错误？', answer: '服务器未包含正确的 Access-Control-Allow-Origin 头。服务器必须明确允许您的域。' },
        { question: '测试什么？', answer: '发送请求并分析 CORS 头，显示允许的源、方法和头。' },
      ],
    },
  },
  {
    slug: 'json-to-zod',
    faqs: {
      en: [
        { question: 'What is Zod?', answer: 'TypeScript-first schema validation library providing runtime validation with type inference.' },
        { question: 'Why convert?', answer: 'Quickly create validation schemas from existing data structures for type safety and runtime validation.' },
        { question: 'Type mappings?', answer: 'Strings→z.string(), numbers→z.number(), booleans→z.boolean(), arrays→z.array(), objects→z.object().' },
      ],
      zh: [
        { question: '什么是 Zod？', answer: 'TypeScript 优先的模式验证库，提供带类型推断的运行时验证。' },
        { question: '为什么转换？', answer: '从现有数据结构快速创建验证模式，实现类型安全和运行时验证。' },
        { question: '类型映射？', answer: '字符串→z.string()，数字→z.number()，布尔→z.boolean()，数组→z.array()，对象→z.object()。' },
      ],
    },
  },
  {
    slug: 'typescript-to-json',
    faqs: {
      en: [
        { question: 'What can be converted?', answer: 'TypeScript interfaces, types, and classes to JSON Schema or sample JSON objects.' },
        { question: 'Complex types?', answer: 'Supports generics, union types, intersection types, and mapped types. Some advanced types may need adjustment.' },
        { question: 'Output formats?', answer: 'JSON Schema (validation), sample JSON (testing), or different TypeScript type formats.' },
      ],
      zh: [
        { question: '可以转换什么？', answer: 'TypeScript 接口、类型和类转换为 JSON Schema 或示例 JSON 对象。' },
        { question: '复杂类型？', answer: '支持泛型、联合类型、交叉类型和映射类型。某些高级类型可能需要调整。' },
        { question: '输出格式？', answer: 'JSON Schema（验证）、示例 JSON（测试）或不同的 TypeScript 类型格式。' },
      ],
    },
  },
  {
    slug: 'markdown-to-slides',
    faqs: {
      en: [
        { question: 'How to separate slides?', answer: 'Use three dashes (---) on a new line. Each section becomes a new slide.' },
        { question: 'Markdown features?', answer: 'All standard Markdown: headings, lists, code blocks with highlighting, images, links, tables, blockquotes.' },
        { question: 'Export formats?', answer: 'HTML (web), PDF (sharing), or formats compatible with reveal.js, Marp, PowerPoint.' },
      ],
      zh: [
        { question: '如何分隔幻灯片？', answer: '在新行使用三个破折号（---）。每个部分成为新幻灯片。' },
        { question: 'Markdown 功能？', answer: '所有标准 Markdown：标题、列表、带高亮的代码块、图片、链接、表格、引用。' },
        { question: '导出格式？', answer: 'HTML（网页）、PDF（分享）或与 reveal.js、Marp、PowerPoint 兼容的格式。' },
      ],
    },
  },
];
