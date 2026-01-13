/**
 * GEO 优化的工具 FAQ 配置 - 第三十五批
 */

import type { FAQItem } from './faq';

export interface ToolSpecificFAQ {
  slug: string;
  faqs: Record<string, FAQItem[]>;
}

export const GEO_TOOL_FAQS_35: ToolSpecificFAQ[] = [
  // JSON to SQL
  {
    slug: 'json-to-sql',
    faqs: {
      en: [
        { question: 'How do I convert JSON to SQL?', answer: 'Paste JSON array of objects. We generate CREATE TABLE and INSERT statements for your data.' },
        { question: 'What SQL dialects are supported?', answer: 'MySQL, PostgreSQL, SQLite, SQL Server, Oracle. Each has slightly different syntax.' },
        { question: 'How are data types determined?', answer: 'We infer types from values: strings→VARCHAR, numbers→INT/DECIMAL, booleans→BOOLEAN, dates→DATETIME.' },
      ],
      zh: [
        { question: '如何将 JSON 转换为 SQL？', answer: '粘贴对象的 JSON 数组。我们为您的数据生成 CREATE TABLE 和 INSERT 语句。' },
        { question: '支持哪些 SQL 方言？', answer: 'MySQL、PostgreSQL、SQLite、SQL Server、Oracle。每种语法略有不同。' },
        { question: '数据类型如何确定？', answer: '我们从值推断类型：字符串→VARCHAR，数字→INT/DECIMAL，布尔值→BOOLEAN，日期→DATETIME。' },
      ],
    },
  },

  // TOML JSON Converter
  {
    slug: 'toml-json',
    faqs: {
      en: [
        { question: 'What is TOML?', answer: 'Tom\'s Obvious Minimal Language. Config file format like INI but with better data types. Used in Rust, Python projects.' },
        { question: 'How do I convert TOML to JSON?', answer: 'Paste TOML config, we parse and output equivalent JSON. Preserves data types and structure.' },
        { question: 'When should I use TOML vs JSON?', answer: 'TOML for human-edited configs (more readable). JSON for data exchange and APIs (more universal).' },
      ],
      zh: [
        { question: '什么是 TOML？', answer: 'Tom 的明显最小语言。类似 INI 但具有更好数据类型的配置文件格式。用于 Rust、Python 项目。' },
        { question: '如何将 TOML 转换为 JSON？', answer: '粘贴 TOML 配置，我们解析并输出等效的 JSON。保留数据类型和结构。' },
        { question: '什么时候应该使用 TOML 而不是 JSON？', answer: 'TOML 用于人工编辑的配置（更易读）。JSON 用于数据交换和 API（更通用）。' },
      ],
    },
  },

  // JSON to Java
  {
    slug: 'json-to-java',
    faqs: {
      en: [
        { question: 'How do I convert JSON to Java classes?', answer: 'Paste JSON, we generate Java POJO classes with getters, setters, and proper types.' },
        { question: 'Does it support Jackson annotations?', answer: 'Yes, optionally add @JsonProperty annotations for JSON field mapping.' },
        { question: 'How are nested objects handled?', answer: 'Nested objects become separate classes. We generate all required classes with proper references.' },
      ],
      zh: [
        { question: '如何将 JSON 转换为 Java 类？', answer: '粘贴 JSON，我们生成带有 getter、setter 和正确类型的 Java POJO 类。' },
        { question: '它支持 Jackson 注解吗？', answer: '是的，可选择添加 @JsonProperty 注解用于 JSON 字段映射。' },
        { question: '嵌套对象如何处理？', answer: '嵌套对象变成单独的类。我们生成所有必需的类并带有正确的引用。' },
      ],
    },
  },

  // JSON to Python
  {
    slug: 'json-to-python',
    faqs: {
      en: [
        { question: 'How do I convert JSON to Python?', answer: 'Paste JSON, we generate Python dataclasses or TypedDict with proper type hints.' },
        { question: 'What Python versions are supported?', answer: 'Python 3.7+ for dataclasses, 3.8+ for TypedDict. We generate modern, type-safe code.' },
        { question: 'Can I generate Pydantic models?', answer: 'Yes, select Pydantic output. Generates BaseModel classes with validation.' },
      ],
      zh: [
        { question: '如何将 JSON 转换为 Python？', answer: '粘贴 JSON，我们生成带有正确类型提示的 Python dataclasses 或 TypedDict。' },
        { question: '支持哪些 Python 版本？', answer: 'Python 3.7+ 用于 dataclasses，3.8+ 用于 TypedDict。我们生成现代的、类型安全的代码。' },
        { question: '可以生成 Pydantic 模型吗？', answer: '是的，选择 Pydantic 输出。生成带有验证的 BaseModel 类。' },
      ],
    },
  },

  // JSON to Kotlin
  {
    slug: 'json-to-kotlin',
    faqs: {
      en: [
        { question: 'How do I convert JSON to Kotlin?', answer: 'Paste JSON, we generate Kotlin data classes with proper types and nullable handling.' },
        { question: 'Does it support kotlinx.serialization?', answer: 'Yes, optionally add @Serializable annotations and @SerialName for field mapping.' },
        { question: 'How are nullable fields handled?', answer: 'Fields with null values become nullable types (String?). We detect and handle nullability.' },
      ],
      zh: [
        { question: '如何将 JSON 转换为 Kotlin？', answer: '粘贴 JSON，我们生成带有正确类型和可空处理的 Kotlin 数据类。' },
        { question: '它支持 kotlinx.serialization 吗？', answer: '是的，可选择添加 @Serializable 注解和 @SerialName 用于字段映射。' },
        { question: '可空字段如何处理？', answer: '具有 null 值的字段变成可空类型（String?）。我们检测并处理可空性。' },
      ],
    },
  },

  // Image Converter
  {
    slug: 'image-converter',
    faqs: {
      en: [
        { question: 'What image formats are supported?', answer: 'PNG, JPEG, WebP, GIF, BMP, ICO, TIFF. Convert between any supported formats.' },
        { question: 'Can I adjust quality during conversion?', answer: 'Yes, for JPEG and WebP. Lower quality = smaller file size. 80% is good balance.' },
        { question: 'Is image conversion done locally?', answer: 'Yes, all processing in browser. Images never uploaded to server. Fast and private.' },
      ],
      zh: [
        { question: '支持哪些图像格式？', answer: 'PNG、JPEG、WebP、GIF、BMP、ICO、TIFF。在任何支持的格式之间转换。' },
        { question: '转换时可以调整质量吗？', answer: '是的，对于 JPEG 和 WebP。较低的质量 = 较小的文件大小。80% 是良好的平衡。' },
        { question: '图像转换是在本地完成的吗？', answer: '是的，所有处理都在浏览器中进行。图像永远不会上传到服务器。快速且私密。' },
      ],
    },
  },

  // Gitignore Generator
  {
    slug: 'gitignore-generator',
    faqs: {
      en: [
        { question: 'How do I create a .gitignore file?', answer: 'Select your tech stack (Node.js, Python, etc.). We generate appropriate ignore patterns.' },
        { question: 'What should be in .gitignore?', answer: 'Dependencies (node_modules), build outputs, IDE files, environment files (.env), logs, OS files.' },
        { question: 'Can I combine multiple templates?', answer: 'Yes, select multiple technologies. We merge patterns, removing duplicates.' },
      ],
      zh: [
        { question: '如何创建 .gitignore 文件？', answer: '选择您的技术栈（Node.js、Python 等）。我们生成适当的忽略模式。' },
        { question: '.gitignore 中应该有什么？', answer: '依赖项（node_modules）、构建输出、IDE 文件、环境文件（.env）、日志、操作系统文件。' },
        { question: '可以组合多个模板吗？', answer: '是的，选择多种技术。我们合并模式，删除重复项。' },
      ],
    },
  },

  // Docker Compose Generator
  {
    slug: 'docker-compose-generator',
    faqs: {
      en: [
        { question: 'How do I create docker-compose.yml?', answer: 'Select services (database, cache, web server). We generate compose file with proper configuration.' },
        { question: 'What services are available?', answer: 'PostgreSQL, MySQL, MongoDB, Redis, Nginx, Node.js, Python, and more. Common development stacks.' },
        { question: 'Can I customize ports and volumes?', answer: 'Yes, configure port mappings, volume mounts, environment variables for each service.' },
      ],
      zh: [
        { question: '如何创建 docker-compose.yml？', answer: '选择服务（数据库、缓存、Web 服务器）。我们生成带有正确配置的 compose 文件。' },
        { question: '有哪些服务可用？', answer: 'PostgreSQL、MySQL、MongoDB、Redis、Nginx、Node.js、Python 等。常见的开发栈。' },
        { question: '可以自定义端口和卷吗？', answer: '是的，为每个服务配置端口映射、卷挂载、环境变量。' },
      ],
    },
  },

  // Package.json Generator
  {
    slug: 'package-json-generator',
    faqs: {
      en: [
        { question: 'How do I create package.json?', answer: 'Enter project name, version, description. Add dependencies and scripts. We generate valid package.json.' },
        { question: 'What fields are required?', answer: 'name and version are required. description, main, scripts, dependencies are recommended.' },
        { question: 'Can I add common scripts?', answer: 'Yes, preset scripts for start, build, test, lint. Customize commands as needed.' },
      ],
      zh: [
        { question: '如何创建 package.json？', answer: '输入项目名称、版本、描述。添加依赖项和脚本。我们生成有效的 package.json。' },
        { question: '哪些字段是必需的？', answer: 'name 和 version 是必需的。description、main、scripts、dependencies 是推荐的。' },
        { question: '可以添加常用脚本吗？', answer: '是的，预设脚本用于 start、build、test、lint。根据需要自定义命令。' },
      ],
    },
  },

  // JSON Minifier
  {
    slug: 'json-minifier',
    faqs: {
      en: [
        { question: 'What does JSON minifier do?', answer: 'Removes whitespace, newlines, and comments from JSON. Reduces file size for production use.' },
        { question: 'How much space is saved?', answer: 'Typically 20-40% reduction. More savings with heavily formatted JSON. Great for API responses.' },
        { question: 'Is minified JSON still valid?', answer: 'Yes, functionally identical. Just harder to read. Use beautifier when you need to edit.' },
      ],
      zh: [
        { question: 'JSON 压缩器做什么？', answer: '从 JSON 中删除空白、换行和注释。减少文件大小以供生产使用。' },
        { question: '节省多少空间？', answer: '通常减少 20-40%。格式化严重的 JSON 节省更多。非常适合 API 响应。' },
        { question: '压缩后的 JSON 仍然有效吗？', answer: '是的，功能相同。只是更难阅读。需要编辑时使用美化器。' },
      ],
    },
  },
];
